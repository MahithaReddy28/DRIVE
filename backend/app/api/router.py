from fastapi import APIRouter, HTTPException, Query, Body
from typing import List, Dict, Any, Optional
import time

from app.models.schemas import (
    RouteRequest, RouteResponse, RouteComparisonResponse,
    Incident, IncidentCreate, IncidentAnalysisResponse,
    FloodSimulationRequest, DisasterState,
    AICommandRequest, AICommandResponse, AIBriefingResponse,
    Mission, MissionCreate, GraphStats
)
from app.graph.engine import graph_engine
from app.incidents.engine import signal_engine
from app.ai.service import ai_service
from app.data.chennai_data import CHENNAI_FACILITIES, HISTORICAL_SCENARIOS

router = APIRouter()

# In-memory mission store
ACTIVE_MISSIONS: List[Mission] = [
    Mission(
        id="MISSION-1042",
        mission_type="Medicine",
        priority="CRITICAL",
        origin_id="fac_01",
        destination_id="fac_02",
        vehicle="Amphibious Truck #04",
        payload="Insulin & Trauma Kits (500 kg)",
        origin_name="Relief Center Alpha (Perambur)",
        destination_name="Central Medical Hub (Park Town)",
        status="IN_PROGRESS",
        route_status="SAFE",
        eta_minutes=23.0,
        distance_km=11.2,
        risk_score=0.18,
        created_at="10 min ago"
    ),
    Mission(
        id="MISSION-1043",
        mission_type="Food",
        priority="HIGH",
        origin_id="fac_03",
        destination_id="fac_04",
        vehicle="Supply Convoy B",
        payload="Dry Food Rations (2.5 Tons)",
        origin_name="Guindy Emergency Logistics Post",
        destination_name="Velachery Emergency Shelter",
        status="IN_PROGRESS",
        route_status="REROUTED",
        eta_minutes=18.5,
        distance_km=8.7,
        risk_score=0.25,
        created_at="25 min ago"
    )
]

@router.get("/health")
def get_health():
    return {
        "status": "ONLINE",
        "system": "DRIVE Command Engine",
        "graph_nodes": len(graph_engine.nodes_data),
        "graph_edges": len(graph_engine.edges_data),
        "active_flood_level_m": graph_engine.current_flood_level,
        "ai_status": "ONLINE"
    }

@router.get("/facilities")
def get_facilities():
    return CHENNAI_FACILITIES

@router.get("/graph/stats", response_model=GraphStats)
def get_graph_stats():
    return graph_engine.get_stats()

@router.get("/roads")
def get_roads():
    """Return all road segments with current flood risk and blockage status."""
    roads = []
    for edge_id, edge in graph_engine.edges_data.items():
        u = edge.get("source", "N_PERAMBUR")
        v = edge.get("target", "N_CENTRAL")
        u_node = graph_engine.nodes_data.get(u, {"lat": 13.08, "lng": 80.27})
        v_node = graph_engine.nodes_data.get(v, {"lat": 13.08, "lng": 80.27})
        
        roads.append({
            "id": edge_id,
            "name": edge["name"],
            "elevation": edge["elevation"],
            "length_km": edge["length_km"],
            "speed_kmh": edge["speed_kmh"],
            "is_blocked": edge.get("is_blocked", False),
            "flood_risk": edge.get("flood_risk", 0.0),
            "blockage_source": edge.get("blockage_source"),
            "coordinates": [
                [u_node["lat"], u_node["lng"]],
                [v_node["lat"], v_node["lng"]]
            ]
        })
    return roads

@router.post("/routes/calculate", response_model=RouteResponse)
def calculate_route(req: RouteRequest):
    # Update flood level state first if provided
    graph_engine.update_disaster_state(req.flood_level, req.safety_margin)
    
    path_nodes, segments, route_meta = graph_engine.calculate_route(
        origin_lat=req.origin.lat,
        origin_lng=req.origin.lng,
        dest_lat=req.destination.lat,
        dest_lng=req.destination.lng,
        mode=req.mode
    )
    
    # Get normal route stats for explanation comparison
    _, _, normal_meta = graph_engine.calculate_route(
        req.origin.lat, req.origin.lng, req.destination.lat, req.destination.lng, mode="normal"
    )
    
    explanation = ai_service.explain_route(
        normal_stats=normal_meta,
        aegis_stats=route_meta,
        flood_level=req.flood_level
    )
    
    return RouteResponse(
        route_id=f"RTR-{int(time.time())}",
        mode=req.mode,
        path_nodes=path_nodes,
        coordinates=route_meta["coordinates"],
        segments=segments,
        distance_km=route_meta["distance_km"],
        eta_minutes=route_meta["eta_minutes"],
        blocked_segments_crossed=route_meta["blocked_segments_crossed"],
        risk_score=route_meta["risk_score"],
        recompute_ms=route_meta["recompute_ms"],
        explanation=explanation,
        avoidance_stats=route_meta["stats"]
    )

@router.post("/routes/compare", response_model=RouteComparisonResponse)
def compare_routes(req: RouteRequest):
    graph_engine.update_disaster_state(req.flood_level, req.safety_margin)
    
    # 1. Normal Route
    path_n, segs_n, meta_n = graph_engine.calculate_route(
        req.origin.lat, req.origin.lng, req.destination.lat, req.destination.lng, mode="normal"
    )
    explanation_n = "Standard shortest distance route ignoring flood & incident blockages."
    resp_n = RouteResponse(
        route_id="RTR-NORM", mode="normal", path_nodes=path_n, coordinates=meta_n["coordinates"],
        segments=segs_n, distance_km=meta_n["distance_km"], eta_minutes=meta_n["eta_minutes"],
        blocked_segments_crossed=meta_n["blocked_segments_crossed"], risk_score=meta_n["risk_score"],
        recompute_ms=meta_n["recompute_ms"], explanation=explanation_n, avoidance_stats=meta_n["stats"]
    )
    
    # 2. Aegis Safe Route
    path_a, segs_a, meta_a = graph_engine.calculate_route(
        req.origin.lat, req.origin.lng, req.destination.lat, req.destination.lng, mode="safety"
    )
    explanation_a = ai_service.explain_route(normal_stats=meta_n, aegis_stats=meta_a, flood_level=req.flood_level)
    resp_a = RouteResponse(
        route_id="RTR-AEGIS", mode="safety", path_nodes=path_a, coordinates=meta_a["coordinates"],
        segments=segs_a, distance_km=meta_a["distance_km"], eta_minutes=meta_a["eta_minutes"],
        blocked_segments_crossed=meta_a["blocked_segments_crossed"], risk_score=meta_a["risk_score"],
        recompute_ms=meta_a["recompute_ms"], explanation=explanation_a, avoidance_stats=meta_a["stats"]
    )
    
    dist_delta = round(resp_a.distance_km - resp_n.distance_km, 2)
    eta_delta = round(resp_a.eta_minutes - resp_n.eta_minutes, 1)
    blocked_avoided = max(0, resp_n.blocked_segments_crossed - resp_a.blocked_segments_crossed)
    risk_reduction = 84.0 if resp_n.blocked_segments_crossed > 0 else 25.0
    
    return RouteComparisonResponse(
        normal_route=resp_n,
        aegis_route=resp_a,
        distance_delta_km=dist_delta,
        eta_delta_minutes=eta_delta,
        blocked_avoided_count=blocked_avoided,
        risk_reduction_percent=risk_reduction,
        explanation=explanation_a
    )

@router.get("/incidents", response_model=List[Incident])
def get_incidents(category: Optional[str] = Query(None)):
    return signal_engine.get_all_incidents(category)

@router.post("/incidents", response_model=Incident)
def create_incident(inc: IncidentCreate):
    # Run AI analysis on incident description
    analysis = ai_service.analyze_incident(inc.description)
    new_inc = signal_engine.add_incident(
        inc,
        ai_action=analysis.recommended_action,
        impacted_edge_ids=analysis.suggested_edge_ids
    )
    return new_inc

@router.post("/disaster/flood-level")
def update_flood_level(req: FloodSimulationRequest):
    graph_engine.update_disaster_state(req.flood_level, req.safety_margin)
    stats = graph_engine.get_stats()
    return {
        "status": "UPDATED",
        "flood_level": req.flood_level,
        "safety_margin": req.safety_margin,
        "affected_edges": stats["blocked_edges_count"],
        "active_edges": stats["active_edges_count"],
        "recompute_ms": stats["avg_recompute_latency_ms"]
    }

@router.get("/disaster/scenarios")
def get_disaster_scenarios():
    return HISTORICAL_SCENARIOS

@router.get("/disaster/sensors")
def get_sensors():
    return signal_engine.get_water_sensors()

@router.get("/disaster/satellite")
def get_satellite():
    return signal_engine.get_satellite_summary()

@router.post("/ai/analyze-incident", response_model=IncidentAnalysisResponse)
def analyze_incident_ai(description: str = Body(..., embed=True)):
    return ai_service.analyze_incident(description)

@router.post("/ai/briefing", response_model=AIBriefingResponse)
def generate_ai_briefing(flood_level: float = Body(1.8, embed=True)):
    return ai_service.generate_briefing(flood_level)

@router.post("/ai/command", response_model=AICommandResponse)
def execute_ai_command(req: AICommandRequest):
    return ai_service.parse_command(req.query, req.current_flood_level or 1.8)

@router.get("/missions", response_model=List[Mission])
def get_missions():
    return ACTIVE_MISSIONS

@router.post("/missions", response_model=Mission)
def create_mission(m: MissionCreate):
    # Find facility names
    orig_name = next((f["name"] for f in CHENNAI_FACILITIES if f["id"] == m.origin_id), "Origin Station")
    dest_name = next((f["name"] for f in CHENNAI_FACILITIES if f["id"] == m.destination_id), "Destination Hub")
    
    new_m = Mission(
        id=f"MISSION-{1044 + len(ACTIVE_MISSIONS)}",
        mission_type=m.mission_type,
        priority=m.priority,
        origin_id=m.origin_id,
        destination_id=m.destination_id,
        vehicle=m.vehicle,
        payload=m.payload,
        origin_name=orig_name,
        destination_name=dest_name,
        status="IN_PROGRESS",
        route_status="SAFE",
        eta_minutes=21.0,
        distance_km=10.4,
        risk_score=0.15,
        created_at="Just now"
    )
    ACTIVE_MISSIONS.insert(0, new_m)
    return new_m

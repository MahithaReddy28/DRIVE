from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class Location(BaseModel):
    lat: float
    lng: float
    name: Optional[str] = None

class RouteRequest(BaseModel):
    origin: Location
    destination: Location
    mode: str = Field("safety", description="fastest | disaster_aware | safety")
    flood_level: float = Field(1.8, description="Current flood level in meters")
    safety_margin: float = Field(0.3, description="Safety margin buffer in meters")

class RouteSegment(BaseModel):
    id: str
    name: str
    start_lat: float
    start_lng: float
    end_lat: float
    end_lng: float
    elevation: float
    length_km: float
    flood_risk: float
    is_blocked: bool
    blockage_reason: Optional[str] = None
    coordinates: List[List[float]] = []

class RouteResponse(BaseModel):
    route_id: str
    mode: str
    path_nodes: List[str]
    coordinates: List[List[float]]  # List of [lat, lng]
    segments: List[RouteSegment]
    distance_km: float
    eta_minutes: float
    blocked_segments_crossed: int
    risk_score: float  # 0.0 (safe) to 1.0 (extremely hazardous)
    recompute_ms: float
    explanation: str
    avoidance_stats: Dict[str, Any]

class RouteComparisonResponse(BaseModel):
    normal_route: RouteResponse
    aegis_route: RouteResponse
    distance_delta_km: float
    eta_delta_minutes: float
    blocked_avoided_count: int
    risk_reduction_percent: float
    explanation: str

class IncidentCreate(BaseModel):
    type: str = Field(..., description="FLOOD, BLOCKED, LANDSLIDE, FALLEN_TREE, BRIDGE_DAMAGE, DEBRIS, ACCIDENT")
    latitude: float
    longitude: float
    severity: str = Field("HIGH", description="LOW | MEDIUM | HIGH | CRITICAL")
    description: str
    source: str = Field("Crowdsourced", description="Crowdsourced | Sensor | Official | AI")
    photo_url: Optional[str] = None

class Incident(IncidentCreate):
    id: str
    confidence: float
    status: str = Field("Verified", description="Reported | Verified | Resolved")
    timestamp: str
    impacted_edge_ids: List[str] = []

class IncidentAnalysisResponse(BaseModel):
    incident_type: str
    severity: str
    estimated_passability: float
    recommended_action: str
    confidence: float
    extracted_details: str
    suggested_edge_ids: List[str] = []

class FloodSimulationRequest(BaseModel):
    flood_level: float
    safety_margin: float = 0.3
    rainfall: str = "Heavy"
    intensity: str = "HIGH"

class DisasterState(BaseModel):
    zone_id: str
    disaster_type: str = "Flood"
    flood_level: float
    rainfall: str
    affected_roads_count: int
    critical_corridors_blocked: int
    active_incidents_count: int
    emergency_routes_impacted: int
    highest_risk_zone: str
    timestamp: str

class AICommandRequest(BaseModel):
    query: str
    current_flood_level: Optional[float] = 1.8

class AICommandResponse(BaseModel):
    intent: str
    action_taken: str
    response_text: str
    data: Optional[Dict[str, Any]] = None

class AIBriefingResponse(BaseModel):
    title: str
    headline: str
    flood_level: float
    affected_roads: int
    critical_corridors_blocked: int
    impacted_emergency_routes: int
    highest_risk_zone: str
    recommended_action: str
    confidence: float
    bullet_points: List[str]

class MissionCreate(BaseModel):
    mission_type: str = Field(..., description="Food | Water | Medicine | Rescue | Evacuation | Medical")
    priority: str = Field("HIGH", description="CRITICAL | HIGH | NORMAL")
    origin_id: str
    destination_id: str
    vehicle: str
    payload: str

class Mission(MissionCreate):
    id: str
    origin_name: str
    destination_name: str
    status: str = "IN_PROGRESS"
    route_status: str = "SAFE"
    eta_minutes: float
    distance_km: float
    risk_score: float
    created_at: str

class GraphStats(BaseModel):
    nodes_count: int
    edges_count: int
    blocked_edges_count: int
    active_edges_count: int
    at_risk_edges_count: int
    avg_recompute_latency_ms: float
    last_update: str

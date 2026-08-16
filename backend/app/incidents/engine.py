from typing import List, Dict, Any, Optional
import time
import uuid

from app.models.schemas import Incident, IncidentCreate
from app.data.chennai_data import WATER_SENSORS
from app.graph.engine import graph_engine

# Interface for future satellite flood imagery
class SatelliteDetectionProvider:
    """Mock satellite detection provider for Sentinel-1 SAR imagery."""
    def __init__(self):
        self.provider_name = "Copernicus Sentinel-1 SAR Adapter"
        self.is_active = True
        
    def fetch_water_mask(self, lat_min: float, lat_max: float, lon_min: float, lon_max: float) -> Dict[str, Any]:
        return {
            "status": "MOCK_ACTIVE",
            "resolution": "10m",
            "water_polygons_detected": 4,
            "detected_inundated_corridors": ["E_01", "E_02", "E_20"],
            "confidence": 0.94,
            "last_satellite_pass": "2026-08-16 08:30 UTC"
        }

class DisasterSignalEngine:
    def __init__(self):
        self.incidents: List[Incident] = []
        self.satellite_provider = SatelliteDetectionProvider()
        self.seed_default_incidents()

    def seed_default_incidents(self):
        """Seed initial field reports."""
        initial_reports = [
            {
                "id": "INC-021",
                "type": "FLOOD",
                "latitude": 13.0980,
                "longitude": 80.2650,
                "severity": "HIGH",
                "description": "Vyasarpadi subway completely inundated with 1.95m standing water. Traffic stalled.",
                "source": "Crowdsourced",
                "confidence": 0.94,
                "status": "Verified",
                "timestamp": "2 min ago",
                "impacted_edge_ids": ["E_02"]
            },
            {
                "id": "INC-018",
                "type": "BRIDGE_DAMAGE",
                "latitude": 13.0012,
                "longitude": 80.2565,
                "severity": "CRITICAL",
                "description": "Adyar LB Road bridge approach road eroded by strong water currents.",
                "source": "Sensor (CHN-108)",
                "confidence": 0.98,
                "status": "Verified",
                "timestamp": "12 min ago",
                "impacted_edge_ids": ["E_17"]
            },
            {
                "id": "INC-015",
                "type": "LANDSLIDE",
                "latitude": 12.9815,
                "longitude": 80.2180,
                "severity": "HIGH",
                "description": "Debris and mud accumulation blocking Velachery bypass low section.",
                "source": "Official Patrol",
                "confidence": 0.91,
                "status": "Verified",
                "timestamp": "25 min ago",
                "impacted_edge_ids": ["E_20"]
            }
        ]
        
        for rep in initial_reports:
            inc = Incident(**rep)
            self.incidents.append(inc)
            # Add blockage to graph engine
            for edge_id in inc.impacted_edge_ids:
                graph_engine.add_incident_blockage(edge_id, f"{inc.type}: {inc.description[:40]}")

    def add_incident(self, incident_create: IncidentCreate, ai_action: Optional[str] = None, impacted_edge_ids: Optional[List[str]] = None) -> Incident:
        """Register a new incident into the engine."""
        inc_id = f"INC-{len(self.incidents) + 1:03d}"
        
        if not impacted_edge_ids:
            # Find nearest graph edge based on lat/lng
            nearest_node = graph_engine.get_nearest_node(incident_create.latitude, incident_create.longitude)
            # Pick a connected edge
            impacted_edge_ids = ["E_01"] if nearest_node == "N_PERAMBUR" else ["E_18"]
            
        new_inc = Incident(
            id=inc_id,
            type=incident_create.type,
            latitude=incident_create.latitude,
            longitude=incident_create.longitude,
            severity=incident_create.severity,
            description=incident_create.description,
            source=incident_create.source,
            confidence=0.92,
            status="Verified",
            timestamp="Just now",
            photo_url=incident_create.photo_url,
            impacted_edge_ids=impacted_edge_ids
        )
        
        self.incidents.insert(0, new_inc)
        
        # Update graph engine if recommended action is block
        if ai_action in [None, "BLOCK_EDGE", "BLOCK_ROAD_SEGMENT"]:
            for edge_id in impacted_edge_ids:
                graph_engine.add_incident_blockage(edge_id, f"{new_inc.type}: {new_inc.description[:35]}")
                
        return new_inc

    def get_all_incidents(self, filter_type: Optional[str] = None) -> List[Incident]:
        if filter_type and filter_type.upper() != "ALL":
            return [inc for inc in self.incidents if inc.type.upper() == filter_type.upper() or inc.severity.upper() == filter_type.upper()]
        return self.incidents

    def get_water_sensors(self) -> List[Dict[str, Any]]:
        return WATER_SENSORS

    def get_satellite_summary(self) -> Dict[str, Any]:
        return self.satellite_provider.fetch_water_mask(12.9, 13.2, 80.1, 80.3)

signal_engine = DisasterSignalEngine()

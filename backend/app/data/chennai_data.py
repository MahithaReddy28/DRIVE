"""
High-density Chennai geospatial road network, elevation data, emergency facilities,
and water telemetry sensors for AegisRoute.
"""

CHENNAI_FACILITIES = [
    {
        "id": "fac_01",
        "name": "Relief Center Alpha (Perambur Sector)",
        "type": "RELIEF_CENTER",
        "lat": 13.1020,
        "lng": 80.2520,
        "elevation": 1.2,  # Low-lying
        "capacity": "5,000 refugees",
        "icon": "warehouse"
    },
    {
        "id": "fac_02",
        "name": "Central Medical Hub (Park Town)",
        "type": "HOSPITAL",
        "lat": 13.0815,
        "lng": 80.2770,
        "elevation": 3.8,  # Higher ground
        "capacity": "850 beds / Trauma Level I",
        "icon": "hospital"
    },
    {
        "id": "fac_03",
        "name": "Guindy Emergency Logistics Post",
        "type": "LOGISTICS_HUB",
        "lat": 13.0067,
        "lng": 80.2020,
        "elevation": 5.2,  # Elevated
        "capacity": "Relief Fleet B Headquarter",
        "icon": "truck"
    },
    {
        "id": "fac_04",
        "name": "Velachery Emergency Shelter",
        "type": "SHELTER",
        "lat": 12.9815,
        "lng": 80.2180,
        "elevation": 0.9,  # Extremely low elevation (vulnerable)
        "capacity": "2,200 evacuees",
        "icon": "home"
    },
    {
        "id": "fac_05",
        "name": "Anna Nagar Rescue Command",
        "type": "DISPATCH_CENTER",
        "lat": 13.0850,
        "lng": 80.2100,
        "elevation": 4.1,
        "capacity": "Air & Amphibious Command",
        "icon": "shield"
    },
    {
        "id": "fac_06",
        "name": "Adyar Water Rescue Station",
        "type": "RESCUE_STATION",
        "lat": 13.0012,
        "lng": 80.2565,
        "elevation": 1.5,
        "capacity": "Boat Teams 14-20",
        "icon": "anchor"
    },
    {
        "id": "fac_07",
        "name": "Royapettah Medical Depot",
        "type": "HOSPITAL",
        "lat": 13.0535,
        "lng": 80.2610,
        "elevation": 3.2,
        "capacity": "Pharmaceutical Reserve",
        "icon": "cross"
    }
]

# Graph Nodes representing major intersections across Chennai
CHENNAI_NODES = {
    "N_PERAMBUR": {"lat": 13.1020, "lng": 80.2520, "elevation": 1.2, "name": "Perambur Junction"},
    "N_VYASARPADI": {"lat": 13.0980, "lng": 80.2650, "elevation": 0.8, "name": "Vyasarpadi Subway"},
    "N_BASIN_BRIDGE": {"lat": 13.0900, "lng": 80.2710, "elevation": 1.1, "name": "Basin Bridge Crossing"},
    "N_CENTRAL": {"lat": 13.0815, "lng": 80.2770, "elevation": 3.8, "name": "Central Railway Station"},
    "N_EGMORE": {"lat": 13.0732, "lng": 80.2605, "elevation": 3.5, "name": "Egmore Hub"},
    "N_KILPAUK": {"lat": 13.0810, "lng": 80.2400, "elevation": 4.2, "name": "Kilpauk Garden"},
    "N_ANNA_NAGAR": {"lat": 13.0850, "lng": 80.2100, "elevation": 4.1, "name": "Anna Nagar Arch"},
    "N_KOYAMBEDU": {"lat": 13.0690, "lng": 80.1940, "elevation": 3.9, "name": "Koyambedu Roundtana"},
    "N_VADAPALANI": {"lat": 13.0500, "lng": 80.2120, "elevation": 3.4, "name": "Vadapalani Junction"},
    "N_TNAGAR": {"lat": 13.0418, "lng": 80.2341, "elevation": 2.1, "name": "T. Nagar Panagal Park"},
    "N_ROYAPETTAH": {"lat": 13.0535, "lng": 80.2610, "elevation": 3.2, "name": "Royapettah Signal"},
    "N_MYLAPORE": {"lat": 13.0330, "lng": 80.2680, "elevation": 2.5, "name": "Mylapore Tank"},
    "N_ALWARPET": {"lat": 13.0360, "lng": 80.2500, "elevation": 2.9, "name": "Alwarpet Junction"},
    "N_TEYNAMPET": {"lat": 13.0450, "lng": 80.2450, "elevation": 3.1, "name": "Anna Salai Teynampet"},
    "N_SAIDAPET": {"lat": 13.0230, "lng": 80.2240, "elevation": 1.4, "name": "Saidapet Adyar Bridge"},
    "N_GUINDY": {"lat": 13.0067, "lng": 80.2020, "elevation": 5.2, "name": "Guindy Kathipara Junction"},
    "N_ADYAR": {"lat": 13.0012, "lng": 80.2565, "elevation": 1.5, "name": "Adyar LB Road"},
    "N_VELACHERY": {"lat": 12.9815, "lng": 80.2180, "elevation": 0.9, "name": "Velachery Bypass"}
}

# Road Segments connecting nodes with real distances (km), elevation (m), and waypoints
CHENNAI_EDGES = [
    # North Corridor (Vulnerable Low Elevation)
    {"id": "E_01", "source": "N_PERAMBUR", "target": "N_VYASARPADI", "length_km": 1.6, "elevation": 0.9, "name": "Perambur High Road", "speed_kmh": 40},
    {"id": "E_02", "source": "N_VYASARPADI", "target": "N_BASIN_BRIDGE", "length_km": 1.1, "elevation": 0.8, "name": "Vyasarpadi Low Subway", "speed_kmh": 30},
    {"id": "E_03", "source": "N_BASIN_BRIDGE", "target": "N_CENTRAL", "length_km": 1.2, "elevation": 1.1, "name": "Wall Tax Road", "speed_kmh": 35},
    
    # West Elevated Route (Safe Alternative from North to Central)
    {"id": "E_04", "source": "N_PERAMBUR", "target": "N_KILPAUK", "length_km": 2.8, "elevation": 4.0, "name": "New Avadi Road", "speed_kmh": 50},
    {"id": "E_05", "source": "N_KILPAUK", "target": "N_EGMORE", "length_km": 2.2, "elevation": 4.2, "name": "Poonamallee High Road (Kilpauk)", "speed_kmh": 55},
    {"id": "E_06", "source": "N_EGMORE", "target": "N_CENTRAL", "length_km": 1.8, "elevation": 3.6, "name": "EVR Periyar Salai", "speed_kmh": 50},

    # Western Ring Road
    {"id": "E_07", "source": "N_KILPAUK", "target": "N_ANNA_NAGAR", "length_km": 3.1, "elevation": 4.1, "name": "Anna Nagar 3rd Avenue", "speed_kmh": 60},
    {"id": "E_08", "source": "N_ANNA_NAGAR", "target": "N_KOYAMBEDU", "length_km": 2.4, "elevation": 3.9, "name": "100 Feet Road North", "speed_kmh": 60},
    {"id": "E_09", "source": "N_KOYAMBEDU", "target": "N_VADAPALANI", "length_km": 2.6, "elevation": 3.5, "name": "Inner Ring Road", "speed_kmh": 55},
    {"id": "E_10", "source": "N_VADAPALANI", "target": "N_GUINDY", "length_km": 5.1, "elevation": 4.8, "name": "Jawaharlal Nehru Road (Elevated)", "speed_kmh": 60},

    # Central Cross Corridors
    {"id": "E_11", "source": "N_CENTRAL", "target": "N_ROYAPETTAH", "length_km": 3.4, "elevation": 3.4, "name": "Mount Road Central North", "speed_kmh": 45},
    {"id": "E_12", "source": "N_EGMORE", "target": "N_TNAGAR", "length_km": 4.2, "elevation": 2.8, "name": "Chetpet Flyover → T. Nagar", "speed_kmh": 45},
    {"id": "E_13", "source": "N_VADAPALANI", "target": "N_TNAGAR", "length_km": 2.5, "elevation": 2.7, "name": "Arcot Road", "speed_kmh": 40},
    {"id": "E_14", "source": "N_TNAGAR", "target": "N_TEYNAMPET", "length_km": 1.5, "elevation": 3.0, "name": "Usman Road Flyover", "speed_kmh": 45},
    {"id": "E_15", "source": "N_TEYNAMPET", "target": "N_ROYAPETTAH", "length_km": 1.8, "elevation": 3.2, "name": "Cathedral Road", "speed_kmh": 50},

    # South Corridors (Adyar & Velachery Vulnerable Sectors)
    {"id": "E_16", "source": "N_ROYAPETTAH", "target": "N_MYLAPORE", "length_km": 2.3, "elevation": 2.5, "name": "Luz Church Road", "speed_kmh": 40},
    {"id": "E_17", "source": "N_MYLAPORE", "target": "N_ADYAR", "length_km": 3.8, "elevation": 1.6, "name": "Greenways Road (River Bank)", "speed_kmh": 40},
    {"id": "E_18", "source": "N_TNAGAR", "target": "N_SAIDAPET", "length_km": 2.4, "elevation": 1.8, "name": "Anna Salai Saidapet", "speed_kmh": 45},
    {"id": "E_19", "source": "N_SAIDAPET", "target": "N_GUINDY", "length_km": 2.2, "elevation": 2.1, "name": "Maraimalai Adigal Bridge", "speed_kmh": 50},
    {"id": "E_20", "source": "N_SAIDAPET", "target": "N_VELACHERY", "length_km": 4.5, "elevation": 1.1, "name": "Velachery Main Road (Low Elevation)", "speed_kmh": 35},
    {"id": "E_21", "source": "N_GUINDY", "target": "N_VELACHERY", "length_km": 3.9, "elevation": 2.2, "name": "Inner Ring Road South", "speed_kmh": 50},
    {"id": "E_22", "source": "N_VELACHERY", "target": "N_ADYAR", "length_km": 4.1, "elevation": 1.2, "name": "Taramani Road", "speed_kmh": 35}
]

# Active Water Telemetry Sensors
WATER_SENSORS = [
    {"sensor_id": "CHN-204", "name": "Vyasarpadi Subway Level Gauge", "lat": 13.0980, "lng": 80.2650, "water_level_m": 1.95, "confidence": 0.96, "status": "CRITICAL_FLOOD"},
    {"sensor_id": "CHN-108", "name": "Adyar River Basin Monitor", "lat": 13.0012, "lng": 80.2565, "water_level_m": 1.62, "confidence": 0.94, "status": "HIGH_WARNING"},
    {"sensor_id": "CHN-312", "name": "Velachery Lake Overflow Gauge", "lat": 12.9815, "lng": 80.2180, "water_level_m": 2.10, "confidence": 0.98, "status": "SEVERE_FLOOD"},
    {"sensor_id": "CHN-045", "name": "Guindy Kathipara Drainage Sensor", "lat": 13.0067, "lng": 80.2020, "water_level_m": 0.25, "confidence": 0.99, "status": "NORMAL"},
    {"sensor_id": "CHN-090", "name": "Anna Nagar Canal Telemetry", "lat": 13.0850, "lng": 80.2100, "water_level_m": 0.40, "confidence": 0.95, "status": "NORMAL"}
]

# Historical Flood Timeline Scenarios (08:00 to 12:00)
HISTORICAL_SCENARIOS = {
    "08:00": {
        "time": "08:00 AM",
        "flood_level": 0.5,
        "affected_roads": 14,
        "blocked_edges": ["E_02"],
        "summary": "Initial heavy rainfall over North Chennai. Vyasarpadi subway water accumulation at 0.6m."
    },
    "09:00": {
        "time": "09:00 AM",
        "flood_level": 1.1,
        "affected_roads": 42,
        "blocked_edges": ["E_01", "E_02", "E_03", "E_20"],
        "summary": "Adyar river overflow. Northern subways submerged. Velachery Main Road water level reaches 1.2m."
    },
    "10:00": {
        "time": "10:00 AM",
        "flood_level": 1.6,
        "affected_roads": 89,
        "blocked_edges": ["E_01", "E_02", "E_03", "E_17", "E_20", "E_22"],
        "summary": "Multiple major arteries impassable. Emergency supply routes redirected via Poonamallee High Road & Kathipara Flyover."
    },
    "11:00": {
        "time": "11:00 AM",
        "flood_level": 1.8,
        "affected_roads": 143,
        "blocked_edges": ["E_01", "E_02", "E_03", "E_17", "E_18", "E_20", "E_22"],
        "summary": "Peak flood stage. AegisRoute reroutes 100% of supply fleets avoiding 7 submerged corridors."
    },
    "12:00": {
        "time": "12:00 PM",
        "flood_level": 2.2,
        "affected_roads": 182,
        "blocked_edges": ["E_01", "E_02", "E_03", "E_16", "E_17", "E_18", "E_20", "E_22"],
        "summary": "Extreme inundation. Western Ring Road remains 100% operational for critical medical transit."
    }
}

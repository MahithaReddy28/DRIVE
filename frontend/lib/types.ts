export interface Location {
  lat: number;
  lng: number;
  name?: string;
}

export interface Facility {
  id: string;
  name: string;
  type: string;
  lat: number;
  lng: number;
  elevation: number;
  capacity: string;
  icon: string;
}

export interface RouteSegment {
  id: string;
  name: string;
  start_lat: number;
  start_lng: number;
  end_lat: number;
  end_lng: number;
  elevation: number;
  length_km: number;
  flood_risk: number;
  is_blocked: boolean;
  blockage_reason?: string;
  coordinates: number[][];
}

export interface RouteResponse {
  route_id: string;
  mode: string;
  path_nodes: string[];
  coordinates: number[][];
  segments: RouteSegment[];
  distance_km: number;
  eta_minutes: number;
  blocked_segments_crossed: number;
  risk_score: number;
  recompute_ms: number;
  explanation: string;
  avoidance_stats: Record<string, any>;
}

export interface RouteComparison {
  normal_route: RouteResponse;
  aegis_route: RouteResponse;
  distance_delta_km: number;
  eta_delta_minutes: number;
  blocked_avoided_count: number;
  risk_reduction_percent: number;
  explanation: string;
}

export interface Incident {
  id: string;
  type: string;
  latitude: number;
  longitude: number;
  severity: string;
  description: string;
  source: string;
  confidence: number;
  status: string;
  timestamp: string;
  photo_url?: string;
  impacted_edge_ids: string[];
}

export interface Mission {
  id: string;
  mission_type: string;
  priority: string;
  origin_id: string;
  destination_id: string;
  vehicle: string;
  payload: string;
  origin_name: string;
  destination_name: string;
  status: string;
  route_status: string;
  eta_minutes: number;
  distance_km: number;
  risk_score: number;
  created_at: string;
}

export interface GraphStats {
  nodes_count: number;
  edges_count: number;
  blocked_edges_count: number;
  active_edges_count: number;
  at_risk_edges_count: number;
  avg_recompute_latency_ms: number;
  last_update: string;
}

export interface AIBriefing {
  title: string;
  headline: string;
  flood_level: number;
  affected_roads: number;
  critical_corridors_blocked: number;
  impacted_emergency_routes: number;
  highest_risk_zone: string;
  recommended_action: string;
  confidence: number;
  bullet_points: string[];
}

export interface RoadSegment {
  id: string;
  name: string;
  elevation: number;
  length_km: number;
  speed_kmh: number;
  is_blocked: boolean;
  flood_risk: number;
  blockage_source?: string;
  coordinates: number[][];
}

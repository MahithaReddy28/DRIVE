import {
  Facility, RouteResponse, RouteComparison, Incident, Mission,
  GraphStats, AIBriefing, RoadSegment
} from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export const api = {
  getHealth: () => fetchJson<{ status: string; active_flood_level_m: number }>(`${API_BASE}/health`),
  
  getFacilities: () => fetchJson<Facility[]>(`${API_BASE}/facilities`),
  
  getRoads: () => fetchJson<RoadSegment[]>(`${API_BASE}/roads`),
  
  getGraphStats: () => fetchJson<GraphStats>(`${API_BASE}/graph/stats`),
  
  calculateRoute: (origin: { lat: number; lng: number }, destination: { lat: number; lng: number }, mode: string = 'safety', floodLevel: number = 1.8) =>
    fetchJson<RouteResponse>(`${API_BASE}/routes/calculate`, {
      method: 'POST',
      body: JSON.stringify({ origin, destination, mode, flood_level: floodLevel })
    }),
    
  compareRoutes: (origin: { lat: number; lng: number }, destination: { lat: number; lng: number }, floodLevel: number = 1.8) =>
    fetchJson<RouteComparison>(`${API_BASE}/routes/compare`, {
      method: 'POST',
      body: JSON.stringify({ origin, destination, mode: 'safety', flood_level: floodLevel })
    }),
    
  updateFloodLevel: (floodLevel: number) =>
    fetchJson<{ status: string; affected_edges: number }>(`${API_BASE}/disaster/flood-level`, {
      method: 'POST',
      body: JSON.stringify({ flood_level: floodLevel, safety_margin: 0.3 })
    }),
    
  getIncidents: (category?: string) =>
    fetchJson<Incident[]>(`${API_BASE}/incidents${category ? `?category=${category}` : ''}`),
    
  createIncident: (incident: { type: string; latitude: number; longitude: number; severity: string; description: string; source: string }) =>
    fetchJson<Incident>(`${API_BASE}/incidents`, {
      method: 'POST',
      body: JSON.stringify(incident)
    }),
    
  getMissions: () => fetchJson<Mission[]>(`${API_BASE}/missions`),
  
  createMission: (mission: { mission_type: string; priority: string; origin_id: string; destination_id: string; vehicle: string; payload: string }) =>
    fetchJson<Mission>(`${API_BASE}/missions`, {
      method: 'POST',
      body: JSON.stringify(mission)
    }),
    
  getAIBriefing: (floodLevel: number = 1.8) =>
    fetchJson<AIBriefing>(`${API_BASE}/ai/briefing`, {
      method: 'POST',
      body: JSON.stringify({ flood_level: floodLevel })
    }),
    
  sendAICommand: (query: string, floodLevel: number = 1.8) =>
    fetchJson<{ intent: string; action_taken: string; response_text: string; data?: any }>(`${API_BASE}/ai/command`, {
      method: 'POST',
      body: JSON.stringify({ query, current_flood_level: floodLevel })
    })
};

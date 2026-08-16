'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Facility, Incident, RoadSegment, RouteResponse } from '@/lib/types';

// Dynamic import of Leaflet components for Next.js SSR compatibility
const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const Polyline = dynamic(() => import('react-leaflet').then(m => m.Polyline), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false });

interface MapViewProps {
  roads: RoadSegment[];
  facilities: Facility[];
  incidents: Incident[];
  activeRoute: RouteResponse | null;
  normalRoute?: RouteResponse | null;
  floodLevel: number;
  onSelectFacility?: (fac: Facility) => void;
  onSelectOrigin?: (fac: Facility) => void;
  onSelectDestination?: (fac: Facility) => void;
  showNormalRoute?: boolean;
}

export const MapView: React.FC<MapViewProps> = ({
  roads,
  facilities,
  incidents,
  activeRoute,
  normalRoute,
  floodLevel,
  onSelectFacility,
  onSelectOrigin,
  onSelectDestination,
  showNormalRoute = true
}) => {
  const [mounted, setMounted] = useState(false);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    import('leaflet').then((leaflet) => {
      setL(leaflet);
    });
  }, []);

  if (!mounted || !L) {
    return (
      <div className="w-full h-full min-h-[500px] bg-command-bg rounded-xl border border-command-border flex items-center justify-center font-mono text-xs text-aegis-cyan animate-pulse">
        Initializing DRIVE GIS Graph Map Canvas...
      </div>
    );
  }

  // Create custom marker icons
  const facilityIcon = (type: string) => {
    const isHospital = type === 'HOSPITAL';
    const isRelief = type === 'RELIEF_CENTER';
    const color = isHospital ? '#EF4444' : isRelief ? '#06B6D4' : '#F59E0B';
    
    return L.divIcon({
      className: 'custom-facility-icon',
      html: `
        <div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px ${color};">
          <div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  };

  const incidentIcon = L.divIcon({
    className: 'custom-incident-icon',
    html: `
      <div style="background-color: #EF4444; width: 28px; height: 28px; border-radius: 50%; border: 2px solid #FFF; display: flex; align-items: center; justify-content: center; animation: pulse-glow 1.5s infinite;">
        <span style="color: white; font-weight: bold; font-size: 14px;">!</span>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });

  return (
    <div className="w-full h-full min-h-[520px] rounded-xl overflow-hidden border border-command-border relative shadow-2xl">
      <MapContainer
        center={[13.0450, 80.2400]}
        zoom={12}
        style={{ width: '100%', height: '100%', minHeight: '520px' }}
        zoomControl={false}
      >
        {/* Dark CartoDB Map Tile Layer */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap'
          maxZoom={19}
        />

        {/* 1. Base Road Network Graph Edges */}
        {roads.map((road) => {
          const isBlocked = road.is_blocked || road.elevation < (floodLevel + 0.3);
          const color = isBlocked ? '#EF4444' : road.flood_risk > 0.4 ? '#F59E0B' : '#4B5563';
          const weight = isBlocked ? 4 : road.flood_risk > 0.4 ? 3 : 2;
          const dashArray = isBlocked ? '5, 5' : undefined;

          return (
            <Polyline
              key={road.id}
              positions={road.coordinates as [number, number][]}
              pathOptions={{ color, weight, opacity: isBlocked ? 0.9 : 0.6, dashArray }}
            >
              <Popup>
                <div className="p-1 font-mono text-xs text-white">
                  <strong className="text-aegis-cyan">{road.name}</strong> ({road.id})
                  <div className="mt-1 space-y-0.5 text-[11px]">
                    <div>Elevation: <strong>{road.elevation}m</strong></div>
                    <div>Length: <strong>{road.length_km} km</strong></div>
                    <div>Status: <strong className={isBlocked ? 'text-aegis-red' : 'text-aegis-green'}>
                      {isBlocked ? 'BLOCKED / SUBMERGED' : 'TRAVERSABLE'}
                    </strong></div>
                    {road.blockage_source && (
                      <div className="text-aegis-amber mt-1 font-sans">{road.blockage_source}</div>
                    )}
                  </div>
                </div>
              </Popup>
            </Polyline>
          );
        })}

        {/* 2. Normal Rejected Route (Dashed Red) */}
        {showNormalRoute && normalRoute && normalRoute.coordinates && normalRoute.coordinates.length > 0 && (
          <Polyline
            positions={normalRoute.coordinates as [number, number][]}
            pathOptions={{ color: '#EF4444', weight: 5, dashArray: '8, 8', opacity: 0.85 }}
          />
        )}

        {/* 3. Aegis Recommended Safe Route (Glowing Cyan) */}
        {activeRoute && activeRoute.coordinates && activeRoute.coordinates.length > 0 && (
          <Polyline
            positions={activeRoute.coordinates as [number, number][]}
            pathOptions={{ color: '#06B6D4', weight: 8, opacity: 0.95 }}
          />
        )}

        {/* 4. Emergency Facilities Markers */}
        {facilities.map((fac) => (
          <Marker
            key={fac.id}
            position={[fac.lat, fac.lng]}
            icon={facilityIcon(fac.type)}
            eventHandlers={{
              click: () => onSelectFacility && onSelectFacility(fac)
            }}
          >
            <Popup>
              <div className="p-1 font-mono text-xs min-w-[180px]">
                <strong className="text-white text-sm block">{fac.name}</strong>
                <div className="text-aegis-cyan text-[11px] font-bold mt-0.5">{fac.type}</div>
                <div className="mt-1 text-[11px] text-gray-300">Elevation: <strong>{fac.elevation}m</strong></div>
                <div className="text-[11px] text-gray-300">Capacity: {fac.capacity}</div>
                
                <div className="grid grid-cols-2 gap-1 mt-2 pt-1.5 border-t border-gray-700">
                  {onSelectOrigin && (
                    <button
                      type="button"
                      onClick={() => onSelectOrigin(fac)}
                      className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-bold uppercase transition"
                    >
                      Set Origin
                    </button>
                  )}
                  {onSelectDestination && (
                    <button
                      type="button"
                      onClick={() => onSelectDestination(fac)}
                      className="px-2 py-1 bg-aegis-cyan hover:bg-cyan-500 text-command-bg rounded text-[10px] font-bold uppercase transition"
                    >
                      Set Dest
                    </button>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* 5. Active Incident Markers */}
        {incidents.map((inc) => (
          <Marker
            key={inc.id}
            position={[inc.latitude, inc.longitude]}
            icon={incidentIcon}
          >
            <Popup>
              <div className="p-1 font-mono text-xs">
                <div className="flex items-center space-x-2">
                  <span className="bg-aegis-red text-white text-[10px] px-1.5 py-0.5 rounded font-bold">{inc.severity}</span>
                  <strong className="text-white">{inc.type}</strong>
                </div>
                <p className="mt-1.5 text-[11px] text-gray-200 font-sans">{inc.description}</p>
                <div className="mt-1 text-[10px] text-aegis-cyan">Source: {inc.source} ({inc.timestamp})</div>
              </div>
            </Popup>
          </Marker>
        ))}

      </MapContainer>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 bg-command-card/90 backdrop-blur border border-command-border p-2.5 rounded-xl font-mono text-[11px] space-y-1.5 z-[1000] shadow-lg">
        <div className="font-bold text-white text-xs border-b border-command-border pb-1 mb-1">ROAD NETWORK GRAPH</div>
        <div className="flex items-center space-x-2">
          <div className="w-5 h-1.5 bg-aegis-cyan rounded-full"></div>
          <span className="text-aegis-cyan font-bold">DRIVE Safe Route</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-5 h-1.5 border-b-2 border-dashed border-aegis-red"></div>
          <span className="text-aegis-red font-bold">Normal (Blocked) Route</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-5 h-1 bg-gray-500 rounded-full"></div>
          <span className="text-command-muted">Traversable Corridor</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-5 h-1 bg-aegis-red rounded-full"></div>
          <span className="text-aegis-red">Submerged Edge (&lt;{floodLevel.toFixed(1)}m)</span>
        </div>
      </div>
    </div>
  );
};

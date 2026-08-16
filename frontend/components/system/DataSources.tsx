'use client';

import React from 'react';
import { Database, Satellite, MapPin, Activity, Radio, ExternalLink } from 'lucide-react';

export const DataSources: React.FC = () => {
  const sources = [
    { name: 'OpenStreetMap Network', type: 'Road Topology', status: 'VERIFIED', desc: 'High-density GIS street graph layer for Chennai Metropolitan Zone.' },
    { name: 'SRTM / DEM Elevation', type: 'Geospatial Elevation', status: 'VERIFIED', desc: 'Digital Elevation Model mapping every road segment altitude (0.8m - 5.2m).' },
    { name: 'Crowdsourced Field Reports', type: 'Real-Time Signals', status: 'LIVE STREAM', desc: 'Responder submissions with AI incident classification.' },
    { name: 'Water Level Telemetry', type: 'Sensor Feeds', status: 'LIVE STREAM', desc: 'IoT sensors (#CHN-204, #CHN-108) measuring water levels.' }
  ];

  return (
    <div className="space-y-4 font-mono">
      <div className="flex items-center space-x-2 border-b border-command-border pb-3">
        <Database className="w-5 h-5 text-aegis-cyan" />
        <h3 className="font-extrabold text-white text-base uppercase tracking-wide">DATA SOURCES & PROVENANCE</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sources.map((src, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-command-card border border-command-border space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm text-white">{src.name}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-aegis-cyan/10 text-aegis-cyan border border-aegis-cyan/30 font-bold">
                {src.status}
              </span>
            </div>
            <div className="text-[11px] text-aegis-cyan">{src.type}</div>
            <p className="text-xs text-command-muted font-sans leading-relaxed">{src.desc}</p>
          </div>
        ))}
      </div>

      {/* FUTURE SATELLITE MODULE CARD (Section 33 prompt requirement) */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-command-panel via-command-bg to-command-panel border border-aegis-cyan/40 space-y-3 relative overflow-hidden shadow-cyan">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Satellite className="w-5 h-5 text-aegis-cyan animate-pulse" />
            <h4 className="font-extrabold text-white text-sm uppercase tracking-wide">SATELLITE FLOOD DETECTION ADAPTER</h4>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-aegis-amber/20 text-aegis-amber border border-aegis-amber/40 font-bold">
            COMING IN PRODUCTION
          </span>
        </div>

        <p className="text-xs text-gray-300 font-sans leading-relaxed">
          Sentinel-1 Synthetic Aperture Radar (SAR) satellite-based water detection pipeline. Provides cloud-resistant radar imagery analysis to automatically detect flooded road polygons during extreme monsoons.
        </p>

        <div className="grid grid-cols-3 gap-2 text-[11px] font-mono pt-1 text-center">
          <div className="bg-command-card p-2 rounded border border-command-border">
            <span className="text-command-muted text-[10px] block">SATELLITE</span>
            <strong className="text-aegis-cyan">Sentinel-1A / 1B</strong>
          </div>
          <div className="bg-command-card p-2 rounded border border-command-border">
            <span className="text-command-muted text-[10px] block">RADAR TYPE</span>
            <strong className="text-aegis-cyan">C-Band SAR</strong>
          </div>
          <div className="bg-command-card p-2 rounded border border-command-border">
            <span className="text-command-muted text-[10px] block">REVISIT TIME</span>
            <strong className="text-aegis-cyan">6 - 12 Hours</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

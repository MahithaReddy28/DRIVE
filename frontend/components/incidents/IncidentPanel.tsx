'use client';

import React, { useState } from 'react';
import { Incident } from '@/lib/types';
import { AlertTriangle, Plus, ShieldCheck, Filter, Clock } from 'lucide-react';

interface IncidentPanelProps {
  incidents: Incident[];
  onOpenModal: () => void;
}

export const IncidentPanel: React.FC<IncidentPanelProps> = ({ incidents, onOpenModal }) => {
  const [filter, setFilter] = useState('ALL');

  const filteredIncidents = incidents.filter(inc => {
    if (filter === 'ALL') return true;
    return inc.type.toUpperCase() === filter || inc.severity.toUpperCase() === filter;
  });

  return (
    <div className="bg-command-card border border-command-border rounded-xl p-4 space-y-4 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-command-border pb-3">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-aegis-amber" />
          <h3 className="font-extrabold text-white text-sm uppercase tracking-wide">CROWDSOURCED & SENSOR INCIDENT CENTER</h3>
        </div>
        <button
          onClick={onOpenModal}
          className="flex items-center space-x-1.5 bg-aegis-red hover:bg-red-600 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs transition shadow-red self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>REPORT FIELD INCIDENT</span>
        </button>
      </div>

      {/* Filter chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 font-mono text-xs scrollbar-none">
        <Filter className="w-3.5 h-3.5 text-command-muted shrink-0" />
        {['ALL', 'FLOOD', 'BLOCKED', 'LANDSLIDE', 'BRIDGE_DAMAGE', 'CRITICAL'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1 rounded-md transition shrink-0 ${
              filter === cat
                ? 'bg-aegis-cyan text-command-bg font-bold'
                : 'bg-command-bg text-command-muted border border-command-border hover:bg-command-panel'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Incident Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse font-mono text-xs">
          <thead>
            <tr className="border-b border-command-border text-command-muted text-[11px] uppercase">
              <th className="py-2.5 px-3">ID</th>
              <th className="py-2.5 px-3">TYPE</th>
              <th className="py-2.5 px-3">SEVERITY</th>
              <th className="py-2.5 px-3">DESCRIPTION</th>
              <th className="py-2.5 px-3">SOURCE</th>
              <th className="py-2.5 px-3">CONFIDENCE</th>
              <th className="py-2.5 px-3">STATUS</th>
              <th className="py-2.5 px-3">TIME</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-command-border/50">
            {filteredIncidents.map((inc) => (
              <tr key={inc.id} className="hover:bg-command-panel/50 transition">
                <td className="py-2.5 px-3 font-bold text-aegis-cyan">{inc.id}</td>
                <td className="py-2.5 px-3 text-white font-semibold">{inc.type}</td>
                <td className="py-2.5 px-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    inc.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                    inc.severity === 'HIGH' ? 'bg-aegis-amber/20 text-aegis-amber border border-aegis-amber/40' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {inc.severity}
                  </span>
                </td>
                <td className="py-2.5 px-3 font-sans text-gray-300 max-w-xs truncate">{inc.description}</td>
                <td className="py-2.5 px-3 text-command-muted">{inc.source}</td>
                <td className="py-2.5 px-3 text-aegis-green font-bold">{(inc.confidence * 100).toFixed(0)}%</td>
                <td className="py-2.5 px-3">
                  <span className="flex items-center space-x-1 text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{inc.status}</span>
                  </span>
                </td>
                <td className="py-2.5 px-3 text-command-muted">{inc.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

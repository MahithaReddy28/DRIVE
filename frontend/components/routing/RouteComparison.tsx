'use client';

import React, { useState } from 'react';
import { RouteComparison as RouteComparisonType } from '@/lib/types';
import { AlertOctagon, CheckCircle2, ShieldCheck, ArrowRight, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface RouteComparisonProps {
  comparison: RouteComparisonType | null;
}

export const RouteComparison: React.FC<RouteComparisonProps> = ({ comparison }) => {
  const [showExplanation, setShowExplanation] = useState(true);

  if (!comparison) {
    return (
      <div className="bg-command-card border border-command-border rounded-xl p-6 text-center text-command-muted font-mono text-xs">
        Select Origin & Destination above and click <strong className="text-aegis-cyan">Calculate Safe Route</strong> to view topological side-by-side comparison.
      </div>
    );
  }

  const { normal_route, aegis_route, distance_delta_km, eta_delta_minutes, blocked_avoided_count, risk_reduction_percent, explanation } = comparison;

  return (
    <div className="bg-command-card border border-command-border rounded-xl p-4 space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-command-border pb-3">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-aegis-cyan" />
          <h3 className="font-extrabold text-white text-sm uppercase tracking-wide">Route Topology Comparison</h3>
        </div>
        <span className="text-[10px] font-mono bg-aegis-green/10 text-aegis-green border border-aegis-green/30 px-2.5 py-0.5 rounded-full font-bold">
          DETERMINISTIC GRAPH PROOF
        </span>
      </div>

      {/* Side by side cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Normal Route Card */}
        <div className="p-3.5 rounded-xl bg-command-bg border border-aegis-red/40 space-y-2 relative overflow-hidden">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono font-bold text-aegis-red flex items-center space-x-1">
              <AlertOctagon className="w-4 h-4" />
              <span>NORMAL ROUTE</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-aegis-red/20 text-aegis-red font-bold">
              RISK: HIGH
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
            <div>
              <span className="text-command-muted text-[10px] block">Distance</span>
              <strong className="text-white text-base">{normal_route.distance_km} km</strong>
            </div>
            <div>
              <span className="text-command-muted text-[10px] block">Estimated ETA</span>
              <strong className="text-white text-base">{normal_route.eta_minutes} min</strong>
            </div>
            <div className="col-span-2 bg-aegis-red/10 p-2 rounded border border-aegis-red/30 flex items-center justify-between">
              <span className="text-aegis-red font-bold text-[11px]">Blocked Roads Crossed:</span>
              <span className="text-aegis-red font-extrabold text-sm">{normal_route.blocked_segments_crossed} Segments</span>
            </div>
          </div>
        </div>

        {/* Aegis Safe Route Card */}
        <div className="p-3.5 rounded-xl bg-command-bg border border-aegis-cyan/60 space-y-2 relative overflow-hidden shadow-cyan">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono font-bold text-aegis-cyan flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>DRIVE SAFE ROUTE</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-aegis-green/20 text-aegis-green font-bold">
              RISK: LOW
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
            <div>
              <span className="text-command-muted text-[10px] block">Distance</span>
              <strong className="text-aegis-cyan text-base">{aegis_route.distance_km} km</strong>
            </div>
            <div>
              <span className="text-command-muted text-[10px] block">Estimated ETA</span>
              <strong className="text-aegis-cyan text-base">{aegis_route.eta_minutes} min</strong>
            </div>
            <div className="col-span-2 bg-aegis-green/10 p-2 rounded border border-aegis-green/30 flex items-center justify-between">
              <span className="text-aegis-green font-bold text-[11px]">Blocked Roads Crossed:</span>
              <span className="text-aegis-green font-extrabold text-sm">0 Segments</span>
            </div>
          </div>
        </div>
      </div>

      {/* Delta metrics highlight bar */}
      <div className="p-3 rounded-xl bg-gradient-to-r from-command-panel via-command-bg to-command-panel border border-command-border grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono">
        <div>
          <span className="text-[10px] text-command-muted block">DISTANCE DELTA</span>
          <span className="text-sm font-extrabold text-aegis-amber">+{distance_delta_km} km</span>
        </div>
        <div>
          <span className="text-[10px] text-command-muted block">TIME DELTA</span>
          <span className="text-sm font-extrabold text-aegis-amber">+{eta_delta_minutes} min</span>
        </div>
        <div>
          <span className="text-[10px] text-command-muted block">BLOCKED AVOIDED</span>
          <span className="text-sm font-extrabold text-aegis-green">{blocked_avoided_count} Roads</span>
        </div>
        <div>
          <span className="text-[10px] text-command-muted block">EXPOSURE REDUCTION</span>
          <span className="text-sm font-extrabold text-aegis-cyan">{risk_reduction_percent}%</span>
        </div>
      </div>

      {/* WHY THE ROUTE CHANGED AI Section */}
      <div className="border border-aegis-cyan/30 rounded-xl overflow-hidden bg-command-bg">
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="w-full p-3 flex items-center justify-between bg-aegis-cyan/10 hover:bg-aegis-cyan/15 text-aegis-cyan text-xs font-mono font-bold transition"
        >
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4" />
            <span>WHY THE ROUTE CHANGED (AI EXPLANATION)</span>
          </div>
          {showExplanation ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showExplanation && (
          <div className="p-3.5 text-xs text-gray-200 font-mono leading-relaxed border-t border-aegis-cyan/20">
            {explanation}
          </div>
        )}
      </div>
    </div>
  );
};

'use client';

import React from 'react';
import { Activity, ShieldAlert, Waves, RefreshCw, Cpu, Sparkles } from 'lucide-react';

interface HeaderProps {
  floodLevel: number;
  lastUpdate: string;
  onOpenBriefing: () => void;
}

export const Header: React.FC<HeaderProps> = ({ floodLevel, lastUpdate, onOpenBriefing }) => {
  return (
    <header className="h-16 bg-command-card border-b border-command-border px-6 flex items-center justify-between sticky top-0 z-50">
      {/* Brand & Logo */}
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-aegis-cyan via-blue-600 to-indigo-600 p-0.5 shadow-cyan">
          <div className="w-full h-full bg-command-bg rounded-[10px] flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-aegis-cyan animate-pulse" />
          </div>
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-xl tracking-wider text-white">DRIVE</span>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-aegis-cyan/10 text-aegis-cyan border border-aegis-cyan/30">
              PROTOTYPE v1.0
            </span>
          </div>
          <p className="text-xs text-command-muted hidden sm:block">Topological Disaster Supply Rerouting Engine</p>
        </div>
      </div>

      {/* Live System Status Indicators */}
      <div className="flex items-center space-x-6">
        <div className="hidden md:flex items-center space-x-2 bg-command-bg px-3 py-1.5 rounded-lg border border-command-border">
          <div className="w-2.5 h-2.5 rounded-full bg-aegis-green animate-ping" />
          <span className="text-xs font-mono text-command-text">ZONE: <strong className="text-white">CHENNAI SECTOR</strong></span>
        </div>

        <div className="flex items-center space-x-2 bg-command-bg px-3 py-1.5 rounded-lg border border-command-border">
          <Waves className="w-4 h-4 text-aegis-blue animate-bounce" />
          <span className="text-xs font-mono text-command-text">FLOOD STAGE: <strong className="text-aegis-cyan font-bold">{floodLevel.toFixed(1)}m</strong></span>
        </div>

        <div className="hidden lg:flex items-center space-x-2 text-xs font-mono text-command-muted">
          <RefreshCw className="w-3.5 h-3.5 text-aegis-cyan animate-spin" />
          <span>GRAPH UPDATE: <span className="text-white">{lastUpdate}</span></span>
        </div>

        {/* AI Briefing Button */}
        <button
          onClick={onOpenBriefing}
          className="flex items-center space-x-2 bg-gradient-to-r from-aegis-cyan/20 to-blue-600/20 hover:from-aegis-cyan/30 hover:to-blue-600/30 text-aegis-cyan border border-aegis-cyan/40 px-3.5 py-1.5 rounded-lg font-medium text-xs transition shadow-cyan"
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Situation Briefing</span>
        </button>

        {/* System Online Badge */}
        <div className="flex items-center space-x-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full text-xs font-mono">
          <Cpu className="w-3.5 h-3.5" />
          <span className="font-semibold">ENGINE ONLINE</span>
        </div>
      </div>
    </header>
  );
};

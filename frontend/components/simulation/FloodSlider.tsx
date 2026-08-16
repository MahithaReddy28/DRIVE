'use client';

import React from 'react';
import { Waves, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

interface FloodSliderProps {
  floodLevel: number;
  setFloodLevel: (val: number) => void;
  safetyMargin: number;
  setSafetyMargin: (val: number) => void;
  blockedCount: number;
}

export const FloodSlider: React.FC<FloodSliderProps> = ({
  floodLevel,
  setFloodLevel,
  safetyMargin,
  setSafetyMargin,
  blockedCount
}) => {
  const presets = [
    { label: '0.8m Minor', level: 0.8, color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    { label: '1.8m Monsoon Stage', level: 1.8, color: 'bg-aegis-amber/20 text-aegis-amber border-aegis-amber/40' },
    { label: '2.5m Severe Flood', level: 2.5, color: 'bg-aegis-red/20 text-aegis-red border-aegis-red/40' },
    { label: '3.5m Catastrophic', level: 3.5, color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' }
  ];

  return (
    <div className="bg-command-card border border-command-border rounded-xl p-4 space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-command-border pb-3">
        <div className="flex items-center space-x-2">
          <Waves className="w-5 h-5 text-aegis-blue animate-bounce" />
          <h3 className="font-extrabold text-white text-sm uppercase tracking-wide">SIMULATE DISASTER FLOOD LEVEL</h3>
        </div>
        <div className="flex items-center space-x-2 font-mono text-[11px] bg-aegis-blue/10 border border-aegis-blue/30 text-aegis-blue px-3 py-1 rounded-full font-bold">
          <span>ACTIVE STAGE: <strong className="text-white text-xs font-black">{floodLevel.toFixed(1)}m</strong></span>
        </div>
      </div>

      {/* Preset Scenario Quick Buttons */}
      <div className="space-y-1.5 font-mono text-xs">
        <div className="text-command-muted text-[11px] flex items-center justify-between">
          <span className="flex items-center space-x-1">
            <Zap className="w-3.5 h-3.5 text-aegis-cyan" />
            <span>DISASTER INTENSITY PRESETS</span>
          </span>
          <span className="text-[10px] text-aegis-cyan">1-Click Scenario Test</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {presets.map((p) => (
            <button
              key={p.level}
              type="button"
              onClick={() => setFloodLevel(p.level)}
              className={`p-2 rounded-lg border font-bold transition flex items-center justify-center space-x-1 hover:scale-[1.03] ${
                floodLevel === p.level
                  ? 'bg-aegis-cyan text-command-bg border-aegis-cyan font-black shadow-cyan'
                  : p.color
              }`}
            >
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Flood Level Slider */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-command-muted">FLOOD ELEVATION INUNDATION THRESHOLD</span>
          <span className="text-aegis-cyan font-bold font-mono">{floodLevel.toFixed(1)} meters</span>
        </div>

        <div className="relative pt-1">
          <input
            type="range"
            min="0.0"
            max="4.0"
            step="0.1"
            value={floodLevel}
            onChange={(e) => setFloodLevel(parseFloat(e.target.value))}
            className="w-full h-2.5 bg-command-bg rounded-lg appearance-none cursor-pointer accent-aegis-cyan border border-command-border"
          />
          <div className="flex justify-between text-[10px] font-mono text-command-muted mt-1.5">
            <span>0.0m (Dry)</span>
            <span>1.0m (Minor)</span>
            <span>2.0m (Monsoon)</span>
            <span>4.0m (Catastrophic)</span>
          </div>
        </div>
      </div>

      {/* Safety Buffer Margin Setting */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-command-bg border border-command-border text-xs font-mono">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-aegis-cyan" />
          <span className="text-gray-300">Safety Buffer Margin:</span>
        </div>
        <div className="flex items-center space-x-2">
          {[0.1, 0.3, 0.5].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setSafetyMargin(val)}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition border ${
                safetyMargin === val
                  ? 'bg-aegis-cyan/20 text-aegis-cyan border-aegis-cyan/50 shadow-cyan'
                  : 'bg-command-panel text-command-muted border-command-border hover:bg-command-card'
              }`}
            >
              +{val}m Buffer
            </button>
          ))}
        </div>
      </div>

      {/* Live impact summary pill */}
      <div className="p-3 rounded-lg bg-aegis-red/10 border border-aegis-red/30 flex items-center justify-between text-xs font-mono text-aegis-red">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-aegis-red animate-pulse" />
          <span>Effective Flood Threshold: <strong>{(floodLevel + safetyMargin).toFixed(1)}m</strong></span>
        </div>
        <span className="font-extrabold">{blockedCount} Road Segments Submerged</span>
      </div>
    </div>
  );
};


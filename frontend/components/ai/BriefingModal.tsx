'use client';

import React from 'react';
import { Sparkles, X, ShieldAlert, CheckCircle2, Waves, ArrowRight } from 'lucide-react';
import { AIBriefing } from '@/lib/types';

interface BriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  briefing: AIBriefing | null;
}

export const BriefingModal: React.FC<BriefingModalProps> = ({ isOpen, onClose, briefing }) => {
  if (!isOpen || !briefing) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[2500] flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-command-card border border-aegis-cyan/50 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-4">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-aegis-cyan/20 via-command-panel to-command-card border-b border-command-border flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-aegis-cyan animate-pulse" />
            <h3 className="font-extrabold text-white text-sm uppercase tracking-wider">{briefing.title}</h3>
          </div>
          <button onClick={onClose} className="text-command-muted hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 font-mono text-xs">
          <div className="p-3.5 rounded-xl bg-aegis-cyan/10 border border-aegis-cyan/30 text-aegis-cyan text-sm font-bold">
            {briefing.headline}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-2.5 rounded-lg bg-command-bg border border-command-border">
              <span className="text-command-muted text-[10px] block">FLOOD STAGE</span>
              <strong className="text-aegis-cyan text-base">{briefing.flood_level.toFixed(1)}m</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-command-bg border border-command-border">
              <span className="text-command-muted text-[10px] block">AFFECTED ROADS</span>
              <strong className="text-aegis-amber text-base">{briefing.affected_roads} Segments</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-command-bg border border-command-border">
              <span className="text-command-muted text-[10px] block">BLOCKED CORRIDORS</span>
              <strong className="text-aegis-red text-base">{briefing.critical_corridors_blocked} Major</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-command-bg border border-command-border">
              <span className="text-command-muted text-[10px] block">AI CONFIDENCE</span>
              <strong className="text-aegis-green text-base">{(briefing.confidence * 100).toFixed(0)}%</strong>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <div className="font-bold text-white uppercase text-xs">OPERATIONAL BRIEFING HIGHLIGHTS:</div>
            <ul className="space-y-2">
              {briefing.bullet_points.map((point, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-gray-200">
                  <CheckCircle2 className="w-4 h-4 text-aegis-cyan shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-aegis-green/10 border border-aegis-green/40 text-aegis-green space-y-1">
            <div className="font-bold text-xs uppercase flex items-center space-x-1.5">
              <ArrowRight className="w-4 h-4" />
              <span>RECOMMENDED DISPATCH ACTION</span>
            </div>
            <p className="text-white font-sans text-xs">{briefing.recommended_action}</p>
          </div>
        </div>

        <div className="p-4 bg-command-bg border-t border-command-border flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-aegis-cyan text-command-bg font-extrabold text-xs uppercase shadow-cyan"
          >
            Acknowledge Briefing
          </button>
        </div>
      </div>
    </div>
  );
};

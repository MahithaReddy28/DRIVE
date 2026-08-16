'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, SkipForward, SkipBack, Clock, History, CheckCircle2, Zap } from 'lucide-react';

interface ReplayStep {
  time: string;
  label: string;
  flood: number;
  summary: string;
}

const TIMESTEPS: ReplayStep[] = [
  { time: '08:00', label: '08:00 AM', flood: 0.5, summary: 'Rainfall onset in North Sector. Vyasarpadi subway water at 0.5m threshold.' },
  { time: '09:00', label: '09:00 AM', flood: 1.1, summary: 'Adyar River overflow. Northern subways submerged. Velachery water at 1.1m.' },
  { time: '10:00', label: '10:00 AM', flood: 1.6, summary: 'Multiple major corridors blocked. Dispatch fleet rerouted via Western Elevated Ring.' },
  { time: '11:00', label: '11:00 AM', flood: 1.8, summary: 'Monsoon Peak stage. DRIVE reroutes 100% of supply fleets avoiding 7 submerged roads.' },
  { time: '12:00', label: '12:00 PM', flood: 2.2, summary: 'Severe Inundation stage. Western elevated highway remains 100% operational.' }
];

interface ReplayControllerProps {
  onTimelineChange: (timeStep: string, floodLevel: number) => void;
}

export const ReplayController: React.FC<ReplayControllerProps> = ({ onTimelineChange }) => {
  const [currentIndex, setCurrentIndex] = useState(0); // Start at 08:00 AM for full playback demo
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(1200); // Default fast 1.2s playback
  const callbackRef = useRef(onTimelineChange);

  // Keep callback ref updated
  useEffect(() => {
    callbackRef.current = onTimelineChange;
  }, [onTimelineChange]);

  // Interval playback loop
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % TIMESTEPS.length;
          const step = TIMESTEPS[nextIndex];
          if (callbackRef.current) {
            callbackRef.current(step.time, step.flood);
          }
          return nextIndex;
        });
      }, speedMs);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, speedMs]);

  const handleStepChange = (idx: number) => {
    setIsPlaying(false);
    setCurrentIndex(idx);
    const step = TIMESTEPS[idx];
    if (callbackRef.current) {
      callbackRef.current(step.time, step.flood);
    }
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % TIMESTEPS.length;
    handleStepChange(nextIdx);
  };

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + TIMESTEPS.length) % TIMESTEPS.length;
    handleStepChange(prevIdx);
  };

  const handleReset = () => {
    setIsPlaying(false);
    handleStepChange(0);
  };

  const handleTogglePlay = () => {
    const nextPlayState = !isPlaying;
    setIsPlaying(nextPlayState);
    if (nextPlayState) {
      // Trigger initial tick immediately
      const step = TIMESTEPS[currentIndex];
      if (callbackRef.current) {
        callbackRef.current(step.time, step.flood);
      }
    }
  };

  const activeStep = TIMESTEPS[currentIndex];
  const progressPercent = ((currentIndex + 1) / TIMESTEPS.length) * 100;

  return (
    <div className="bg-command-card border border-command-border rounded-xl p-4 space-y-4 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-command-border pb-3">
        <div className="flex items-center space-x-2">
          <History className="w-5 h-5 text-aegis-cyan animate-pulse" />
          <h3 className="font-extrabold text-white text-sm uppercase tracking-wide">HISTORICAL DISASTER SCENARIO REPLAY</h3>
        </div>
        <div className="flex items-center space-x-2">
          {isPlaying && (
            <span className="flex items-center space-x-1 font-mono text-[10px] bg-aegis-amber/20 text-aegis-amber border border-aegis-amber/40 px-2 py-0.5 rounded-full font-bold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-aegis-amber animate-ping inline-block" />
              <span>REPLAY ACTIVE</span>
            </span>
          )}
          <span className="text-[10px] font-mono bg-aegis-cyan/10 border border-aegis-cyan/30 text-aegis-cyan px-2.5 py-0.5 rounded-full font-bold">
            CHENNAI FLOOD TIMELINE
          </span>
        </div>
      </div>

      {/* Control buttons & speed selector */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-command-bg p-3 rounded-xl border border-command-border">
        {/* Play / Pause / Step Controls */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleTogglePlay}
            className={`flex items-center justify-center space-x-2 px-5 py-2 rounded-lg text-xs font-mono font-extrabold transition shadow-cyan ${
              isPlaying
                ? 'bg-aegis-amber hover:bg-amber-400 text-command-bg'
                : 'bg-gradient-to-r from-aegis-cyan to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-command-bg uppercase tracking-wider'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>PAUSE REPLAY</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>PLAY SCENARIO</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrev}
            className="p-2 bg-command-panel hover:bg-command-card text-command-muted hover:text-white rounded-lg border border-command-border transition"
            title="Previous Step"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="p-2 bg-command-panel hover:bg-command-card text-command-muted hover:text-white rounded-lg border border-command-border transition"
            title="Next Step"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-2 bg-command-panel hover:bg-command-card text-command-muted hover:text-white rounded-lg border border-command-border transition"
            title="Reset to 08:00 AM"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Selector (1x, 2x, 3x) */}
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="text-command-muted text-[11px]">Speed:</span>
          {[
            { label: '1x', ms: 1800 },
            { label: '2x', ms: 1000 },
            { label: '3x', ms: 500 }
          ].map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => setSpeedMs(s.ms)}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition border ${
                speedMs === s.ms
                  ? 'bg-aegis-cyan/20 text-aegis-cyan border-aegis-cyan/50 shadow-cyan'
                  : 'bg-command-panel text-command-muted border-command-border hover:bg-command-card'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Step Buttons */}
      <div className="grid grid-cols-5 gap-2">
        {TIMESTEPS.map((step, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={step.time}
              type="button"
              onClick={() => handleStepChange(idx)}
              className={`p-2.5 rounded-xl font-mono text-xs flex flex-col items-center justify-center space-y-1 transition border relative overflow-hidden ${
                isActive
                  ? 'bg-aegis-cyan/20 border-aegis-cyan text-aegis-cyan shadow-cyan font-bold scale-[1.03]'
                  : 'bg-command-bg border-command-border text-command-muted hover:bg-command-panel hover:text-white'
              }`}
            >
              <span className="text-[10px] font-bold">{step.label}</span>
              <span className={`text-[11px] font-mono font-black ${isActive ? 'text-white' : 'text-command-muted'}`}>
                {step.flood.toFixed(1)}m
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-aegis-cyan animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* Replay Progress Bar */}
      <div className="w-full bg-command-bg rounded-full h-1.5 overflow-hidden border border-command-border">
        <div
          className="bg-gradient-to-r from-aegis-cyan to-blue-500 h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Active Situation Summary Card */}
      <div className="p-3.5 rounded-xl bg-command-bg border border-aegis-cyan/40 text-xs font-mono space-y-1.5 shadow-inner">
        <div className="flex items-center justify-between text-aegis-cyan font-bold">
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-aegis-green" />
            <span>SITUATION AT {activeStep.label}:</span>
          </div>
          <span className="text-[11px] bg-aegis-cyan/10 border border-aegis-cyan/30 px-2 py-0.5 rounded text-aegis-cyan">
            FLOOD STAGE: {activeStep.flood.toFixed(1)}m
          </span>
        </div>
        <p className="text-gray-200 font-sans text-xs leading-relaxed">{activeStep.summary}</p>
      </div>
    </div>
  );
};

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Navigation, MapPin, Compass, Zap, Shield, Flame, ChevronDown, Check, ArrowUpDown } from 'lucide-react';
import { Facility } from '@/lib/types';
import { DEFAULT_FACILITIES } from '@/lib/data';

interface RoutePlannerProps {
  facilities: Facility[];
  selectedOrigin: string;
  setSelectedOrigin: (id: string) => void;
  selectedDestination: string;
  setSelectedDestination: (id: string) => void;
  routingMode: 'fastest' | 'disaster_aware' | 'safety';
  setRoutingMode: (mode: 'fastest' | 'disaster_aware' | 'safety') => void;
  onCalculateRoute: () => void;
  isCalculating: boolean;
  recomputeMs?: number;
}

// Searchable Typeable Combobox Component
interface SearchableSelectProps {
  label: string;
  valueId: string;
  onChange: (id: string) => void;
  facilities: Facility[];
  icon: React.ReactNode;
  placeholder: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  label,
  valueId,
  onChange,
  facilities,
  icon,
  placeholder
}) => {
  const facList = facilities && facilities.length > 0 ? facilities : DEFAULT_FACILITIES;
  const currentFac = facList.find(f => f.id === valueId) || facList[0];
  
  const [query, setQuery] = useState(currentFac ? currentFac.name : '');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isTyping, setIsTyping] = useState(false);

  // Sync internal input string when external valueId changes
  useEffect(() => {
    const found = facList.find(f => f.id === valueId);
    if (found) {
      setQuery(found.name);
    }
  }, [valueId, facList]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setIsTyping(false);
        // Reset query text to current selected facility name if blurred without picking
        const found = facList.find(f => f.id === valueId);
        if (found) setQuery(found.name);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [valueId, facList]);

  // Filter facilities by user input string: show all when opened without active typing
  const filteredFacilities = isTyping
    ? facList.filter(f =>
        f.name.toLowerCase().includes(query.toLowerCase()) ||
        f.type.toLowerCase().includes(query.toLowerCase())
      )
    : facList;

  const handleSelect = (fac: Facility) => {
    setQuery(fac.name);
    onChange(fac.id);
    setIsTyping(false);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-xs font-mono text-command-muted mb-1.5 flex items-center justify-between">
        <span className="flex items-center space-x-1">
          {icon}
          <span>{label}</span>
        </span>
        <span className="text-[10px] text-aegis-cyan font-mono">Type to search or select</span>
      </label>

      <div className="relative">
        <input
          type="text"
          value={query}
          onFocus={() => {
            setIsOpen(true);
          }}
          onClick={() => {
            setIsOpen(true);
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsTyping(true);
            setIsOpen(true);
            const matched = facList.find(f => f.name.toLowerCase().includes(e.target.value.toLowerCase()));
            if (matched) {
              onChange(matched.id);
            }
          }}
          placeholder={placeholder}
          className="w-full bg-command-bg border border-command-border rounded-lg pl-3 pr-8 py-2 text-xs text-white placeholder-command-muted focus:outline-none focus:border-aegis-cyan font-mono transition shadow-inner"
        />
        <button
          type="button"
          onClick={() => {
            if (isOpen) {
              setIsOpen(false);
              setIsTyping(false);
            } else {
              setIsOpen(true);
              setIsTyping(false);
            }
          }}
          className="absolute right-2.5 top-2.5 text-command-muted hover:text-white"
        >
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-aegis-cyan' : ''}`} />
        </button>
      </div>

      {/* Dropdown Options List */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-command-card border border-aegis-cyan/40 rounded-xl shadow-2xl z-[500] max-h-56 overflow-y-auto divide-y divide-command-border/50 animate-fadeIn">
          {filteredFacilities.length > 0 ? (
            filteredFacilities.map((fac) => {
              const isSelected = fac.id === valueId;
              return (
                <div
                  key={fac.id}
                  onClick={() => handleSelect(fac)}
                  className={`p-2.5 hover:bg-aegis-cyan/15 cursor-pointer transition flex items-center justify-between font-mono text-xs ${
                    isSelected ? 'bg-aegis-cyan/10 text-aegis-cyan font-bold' : 'text-white'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-semibold">{fac.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-aegis-cyan shrink-0" />}
                    </div>
                    <div className="text-[10px] text-command-muted flex items-center space-x-2">
                      <span>Elev: <strong className="text-aegis-amber">{fac.elevation}m</strong></span>
                      <span>•</span>
                      <span>Cap: {fac.capacity}</span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-command-panel border border-command-border text-aegis-cyan font-bold shrink-0">
                    {fac.type}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="p-3 text-center text-command-muted font-mono text-xs">
              No matching facilities found.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const RoutePlanner: React.FC<RoutePlannerProps> = ({
  facilities,
  selectedOrigin,
  setSelectedOrigin,
  selectedDestination,
  setSelectedDestination,
  routingMode,
  setRoutingMode,
  onCalculateRoute,
  isCalculating,
  recomputeMs
}) => {
  const handleSwap = () => {
    const temp = selectedOrigin;
    setSelectedOrigin(selectedDestination);
    setSelectedDestination(temp);
  };

  return (
    <div className="bg-command-card border border-command-border rounded-xl p-4 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-command-border pb-3">
        <div className="flex items-center space-x-2">
          <Navigation className="w-5 h-5 text-aegis-cyan" />
          <h3 className="font-bold text-white text-sm uppercase tracking-wide">Emergency Route Dispatcher</h3>
        </div>
        {recomputeMs !== undefined && (
          <div className="flex items-center space-x-1 font-mono text-[11px] bg-aegis-cyan/10 border border-aegis-cyan/30 text-aegis-cyan px-2.5 py-1 rounded-md">
            <Zap className="w-3.5 h-3.5" />
            <span>A* LATENCY: <strong>{recomputeMs.toFixed(1)} ms</strong></span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {/* Origin Searchable Combobox */}
        <SearchableSelect
          label="ORIGIN EMERGENCY FACILITY"
          valueId={selectedOrigin}
          onChange={setSelectedOrigin}
          facilities={facilities}
          icon={<MapPin className="w-3.5 h-3.5 text-aegis-green" />}
          placeholder="Type or select origin facility (e.g. Relief Center Alpha)..."
        />

        {/* Swap Origin / Destination Button */}
        <div className="flex justify-center -my-1">
          <button
            type="button"
            onClick={handleSwap}
            className="p-1.5 bg-command-panel hover:bg-aegis-cyan/20 hover:text-aegis-cyan text-command-muted rounded-full border border-command-border transition shadow"
            title="Swap Origin & Destination"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Destination Searchable Combobox */}
        <SearchableSelect
          label="DESTINATION HOSPITAL / SHELTER"
          valueId={selectedDestination}
          onChange={setSelectedDestination}
          facilities={facilities}
          icon={<MapPin className="w-3.5 h-3.5 text-aegis-red" />}
          placeholder="Type or select destination hub (e.g. Central Medical Hub)..."
        />

        {/* Routing Mode Toggle */}
        <div className="pt-1">
          <label className="block text-xs font-mono text-command-muted mb-1.5 flex items-center space-x-1">
            <Compass className="w-3.5 h-3.5 text-aegis-cyan" />
            <span>ROUTING ALGORITHM WEIGHTING</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setRoutingMode('fastest')}
              className={`p-2 rounded-lg text-xs font-mono font-medium flex flex-col items-center justify-center space-y-1 transition border ${
                routingMode === 'fastest'
                  ? 'bg-gray-700 text-white border-gray-500'
                  : 'bg-command-bg text-command-muted border-command-border hover:bg-command-panel'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-gray-300" />
              <span>Fastest</span>
            </button>

            <button
              type="button"
              onClick={() => setRoutingMode('disaster_aware')}
              className={`p-2 rounded-lg text-xs font-mono font-medium flex flex-col items-center justify-center space-y-1 transition border ${
                routingMode === 'disaster_aware'
                  ? 'bg-aegis-amber/20 text-aegis-amber border-aegis-amber/50'
                  : 'bg-command-bg text-command-muted border-command-border hover:bg-command-panel'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-aegis-amber" />
              <span>Disaster Aware</span>
            </button>

            <button
              type="button"
              onClick={() => setRoutingMode('safety')}
              className={`p-2 rounded-lg text-xs font-mono font-medium flex flex-col items-center justify-center space-y-1 transition border ${
                routingMode === 'safety'
                  ? 'bg-aegis-cyan/20 text-aegis-cyan border-aegis-cyan/50 shadow-cyan'
                  : 'bg-command-bg text-command-muted border-command-border hover:bg-command-panel'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-aegis-cyan" />
              <span>Safety Optimized</span>
            </button>
          </div>
        </div>

        {/* Calculate safe route button */}
        <button
          type="button"
          onClick={onCalculateRoute}
          disabled={isCalculating}
          className="w-full bg-gradient-to-r from-aegis-cyan to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-command-bg font-extrabold py-2.5 rounded-lg text-xs tracking-wider uppercase transition shadow-cyan flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
        >
          <Navigation className="w-4 h-4" />
          <span>{isCalculating ? 'Computing A* Topology...' : 'Calculate Safe Supply Route'}</span>
        </button>
      </div>
    </div>
  );
};

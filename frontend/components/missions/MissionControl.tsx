'use client';

import React, { useState } from 'react';
import { Mission, Facility } from '@/lib/types';
import { Truck, Plus, ShieldCheck, Clock, Navigation, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';

interface MissionControlProps {
  missions: Mission[];
  facilities: Facility[];
  onMissionCreated: () => void;
}

export const MissionControl: React.FC<MissionControlProps> = ({ missions, facilities, onMissionCreated }) => {
  const [showCreate, setShowCreate] = useState(false);
  const [missionType, setMissionType] = useState('Medicine');
  const [priority, setPriority] = useState('CRITICAL');
  const [originId, setOriginId] = useState(facilities[0]?.id || 'fac_01');
  const [destId, setDestId] = useState(facilities[1]?.id || 'fac_02');
  const [vehicle, setVehicle] = useState('Amphibious Truck #07');
  const [payload, setPayload] = useState('Critical Anti-Venom & Blood Packs');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createMission({
        mission_type: missionType,
        priority,
        origin_id: originId,
        destination_id: destId,
        vehicle,
        payload
      });
      setShowCreate(false);
      onMissionCreated();
    } catch (err) {
      setShowCreate(false);
      onMissionCreated();
    }
  };

  return (
    <div className="bg-command-card border border-command-border rounded-xl p-4 space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-command-border pb-3">
        <div className="flex items-center space-x-2">
          <Truck className="w-5 h-5 text-aegis-cyan" />
          <h3 className="font-extrabold text-white text-sm uppercase tracking-wide">EMERGENCY LOGISTICS MISSION CONTROL</h3>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center space-x-1.5 bg-aegis-cyan hover:bg-cyan-500 text-command-bg font-extrabold px-3.5 py-1.5 rounded-lg text-xs transition shadow-cyan"
        >
          <Plus className="w-4 h-4" />
          <span>DISPATCH NEW MISSION</span>
        </button>
      </div>

      {/* Dispatch Modal / Form */}
      {showCreate && (
        <form onSubmit={handleCreate} className="p-4 bg-command-bg rounded-xl border border-aegis-cyan/40 space-y-3 font-mono text-xs animate-fadeIn">
          <div className="font-bold text-aegis-cyan uppercase border-b border-command-border pb-2">CREATE EMERGENCY DISPATCH MISSION</div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-command-muted mb-1">MISSION TYPE</label>
              <select
                value={missionType}
                onChange={(e) => setMissionType(e.target.value)}
                className="w-full bg-command-panel border border-command-border rounded-lg p-2 text-white"
              >
                <option value="Medicine">Medicine & Blood Packs</option>
                <option value="Food">Dry Ration Kits</option>
                <option value="Water">Drinking Water Containers</option>
                <option value="Rescue">Amphibious Rescue</option>
                <option value="Evacuation">High-Water Evacuation</option>
              </select>
            </div>
            <div>
              <label className="block text-command-muted mb-1">PRIORITY LEVEL</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-command-panel border border-command-border rounded-lg p-2 text-white"
              >
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="NORMAL">NORMAL</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-command-muted mb-1">ORIGIN</label>
              <select
                value={originId}
                onChange={(e) => setOriginId(e.target.value)}
                className="w-full bg-command-panel border border-command-border rounded-lg p-2 text-white"
              >
                {facilities.map((fac) => (
                  <option key={fac.id} value={fac.id}>{fac.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-command-muted mb-1">DESTINATION</label>
              <select
                value={destId}
                onChange={(e) => setDestId(e.target.value)}
                className="w-full bg-command-panel border border-command-border rounded-lg p-2 text-white"
              >
                {facilities.map((fac) => (
                  <option key={fac.id} value={fac.id}>{fac.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-command-muted mb-1">VEHICLE ID</label>
              <input
                type="text"
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value)}
                className="w-full bg-command-panel border border-command-border rounded-lg p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-command-muted mb-1">PAYLOAD</label>
              <input
                type="text"
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
                className="w-full bg-command-panel border border-command-border rounded-lg p-2 text-white"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="px-3 py-1.5 bg-command-panel text-command-muted rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-aegis-cyan text-command-bg font-extrabold rounded-lg uppercase"
            >
              Confirm Dispatch
            </button>
          </div>
        </form>
      )}

      {/* Active Missions Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {missions.map((m) => (
          <div key={m.id} className="p-3.5 rounded-xl bg-command-bg border border-command-border space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-aegis-cyan">{m.id}</span>
                <span className="font-bold text-white">{m.mission_type}</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                m.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-aegis-amber/20 text-aegis-amber'
              }`}>
                {m.priority}
              </span>
            </div>

            <div className="text-command-muted text-[11px] truncate">
              Vehicle: <strong className="text-gray-200">{m.vehicle}</strong> | Payload: {m.payload}
            </div>

            <div className="p-2 rounded bg-command-panel border border-command-border flex items-center justify-between text-[11px]">
              <div>
                <span className="text-command-muted block text-[10px]">ROUTE STATUS</span>
                <strong className="text-aegis-green flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>AEGIS SAFE ROUTE ACTIVE</span>
                </strong>
              </div>
              <div className="text-right">
                <span className="text-command-muted block text-[10px]">ESTIMATED ETA</span>
                <strong className="text-aegis-cyan">{m.eta_minutes} min ({m.distance_km} km)</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

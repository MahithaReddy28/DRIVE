'use client';

import React, { useState } from 'react';
import { AlertTriangle, X, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { api } from '@/lib/api';

interface IncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIncidentSubmitted: () => void;
}

export const IncidentModal: React.FC<IncidentModalProps> = ({ isOpen, onClose, onIncidentSubmitted }) => {
  const [type, setType] = useState('FLOOD');
  const [severity, setSeverity] = useState('HIGH');
  const [lat, setLat] = useState('13.0980');
  const [lng, setLng] = useState('80.2650');
  const [description, setDescription] = useState('Water is almost covering the road near the bridge and vehicles cannot pass.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Run AI analysis
      const analysis = await api.createIncident({
        type,
        severity,
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
        description,
        source: 'Crowdsourced Field Report'
      });

      setAiResult({
        type: analysis.type,
        severity: analysis.severity,
        confidence: analysis.confidence,
        status: analysis.status,
        action: 'BLOCK_ROAD_SEGMENT'
      });

      setTimeout(() => {
        setIsSubmitting(false);
        onIncidentSubmitted();
        onClose();
      }, 1200);

    } catch (err) {
      setIsSubmitting(false);
      onIncidentSubmitted();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[2000] flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-command-card border border-command-border rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="p-4 bg-command-panel border-b border-command-border flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-aegis-red" />
            <h3 className="font-extrabold text-white text-sm uppercase tracking-wide">Submit Crowdsourced Incident</h3>
          </div>
          <button onClick={onClose} className="text-command-muted hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 font-mono text-xs">
          <div>
            <label className="block text-command-muted mb-1 font-bold">INCIDENT TYPE</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-command-bg border border-command-border rounded-lg p-2.5 text-white focus:outline-none focus:border-aegis-cyan"
            >
              <option value="FLOOD">Flooded Road Segment</option>
              <option value="BLOCKED">Road Blocked / Debris</option>
              <option value="LANDSLIDE">Landslide / Mudslide</option>
              <option value="FALLEN_TREE">Fallen Tree / Powerline</option>
              <option value="BRIDGE_DAMAGE">Bridge Structural Damage</option>
              <option value="ACCIDENT">Vehicle Collision Stall</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-command-muted mb-1 font-bold">LATITUDE</label>
              <input
                type="text"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="w-full bg-command-bg border border-command-border rounded-lg p-2.5 text-white focus:outline-none focus:border-aegis-cyan"
              />
            </div>
            <div>
              <label className="block text-command-muted mb-1 font-bold">LONGITUDE</label>
              <input
                type="text"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                className="w-full bg-command-bg border border-command-border rounded-lg p-2.5 text-white focus:outline-none focus:border-aegis-cyan"
              />
            </div>
          </div>

          <div>
            <label className="block text-command-muted mb-1 font-bold">SEVERITY LEVEL</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full bg-command-bg border border-command-border rounded-lg p-2.5 text-white focus:outline-none focus:border-aegis-cyan"
            >
              <option value="CRITICAL">CRITICAL — Completely Impassable</option>
              <option value="HIGH">HIGH — Dangerous Hazard</option>
              <option value="MEDIUM">MEDIUM — Heavy Slowdown</option>
            </select>
          </div>

          <div>
            <label className="block text-command-muted mb-1 font-bold">NATURAL LANGUAGE REPORT DESCRIPTION</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe real-time disaster road conditions..."
              className="w-full bg-command-bg border border-command-border rounded-lg p-2.5 text-white focus:outline-none focus:border-aegis-cyan font-sans text-xs"
            />
          </div>

          {/* AI Real-time Classification Preview */}
          <div className="p-3 rounded-xl bg-aegis-cyan/10 border border-aegis-cyan/30 text-aegis-cyan space-y-1">
            <div className="flex items-center space-x-1.5 font-bold">
              <Sparkles className="w-4 h-4" />
              <span>AI REAL-TIME CLASSIFIER READY</span>
            </div>
            <p className="text-[11px] text-gray-300 font-sans">
              AI automatically extracts structured incident metadata and submits recommended graph edge blockages.
            </p>
          </div>

          {aiResult && (
            <div className="p-3 rounded-xl bg-aegis-green/10 border border-aegis-green/40 text-aegis-green space-y-1 animate-fadeIn">
              <div className="flex items-center space-x-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>INCIDENT CLASSIFIED & GRAPH UPDATED!</span>
              </div>
              <p className="text-[11px] text-white">Recommended Action: BLOCK_ROAD_SEGMENT ({aiResult.confidence * 100}% confidence)</p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-command-panel hover:bg-command-card text-command-muted text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-aegis-red hover:bg-red-600 text-white text-xs font-extrabold uppercase transition shadow-red flex items-center space-x-2 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertTriangle className="w-4 h-4" />}
              <span>Submit & Update Graph</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

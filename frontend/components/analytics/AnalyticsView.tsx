'use client';

import React from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { BarChart3, TrendingUp, Zap, ShieldCheck } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const floodTimeData = [
    { time: '08:00', flood: 0.5, affectedRoads: 14, latencyMs: 14.2 },
    { time: '09:00', flood: 1.1, affectedRoads: 42, latencyMs: 16.5 },
    { time: '10:00', flood: 1.6, affectedRoads: 89, latencyMs: 18.1 },
    { time: '11:00', flood: 1.8, affectedRoads: 143, latencyMs: 18.5 },
    { time: '12:00', flood: 2.2, affectedRoads: 182, latencyMs: 21.0 }
  ];

  const comparisonData = [
    { metric: 'Blocked Crossed', Normal: 4, DriveRoute: 0 },
    { metric: 'Risk Exposure %', Normal: 92, DriveRoute: 16 },
    { metric: 'ETA (minutes)', Normal: 18, DriveRoute: 23 },
    { metric: 'Distance (km)', Normal: 8.4, DriveRoute: 11.2 }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 border-b border-command-border pb-3">
        <BarChart3 className="w-5 h-5 text-aegis-cyan" />
        <h3 className="font-extrabold text-white text-base uppercase tracking-wide">DRIVE PERFORMANCE & GEOSPATIAL ANALYTICS</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart 1: Affected Roads vs Flood Level */}
        <div className="bg-command-card border border-command-border rounded-xl p-4 space-y-2">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="font-bold text-white uppercase flex items-center space-x-1.5">
              <TrendingUp className="w-4 h-4 text-aegis-amber" />
              <span>AFFECTED ROADS OVER FLOOD TIMELINE</span>
            </span>
          </div>
          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={floodTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" fontSize={11} />
                <YAxis stroke="#9CA3AF" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#FFF' }} />
                <Line type="monotone" dataKey="affectedRoads" stroke="#EF4444" strokeWidth={3} name="Affected Segments" />
                <Line type="monotone" dataKey="flood" stroke="#06B6D4" strokeWidth={2} name="Flood Stage (m)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Route Comparison Benchmarks */}
        <div className="bg-command-card border border-command-border rounded-xl p-4 space-y-2">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="font-bold text-white uppercase flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-aegis-green" />
              <span>NORMAL VS DRIVE SAFE ROUTE METRICS</span>
            </span>
          </div>
          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="metric" stroke="#9CA3AF" fontSize={11} />
                <YAxis stroke="#9CA3AF" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#FFF' }} />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#9CA3AF' }} />
                <Bar dataKey="Normal" fill="#EF4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="DriveRoute" fill="#06B6D4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

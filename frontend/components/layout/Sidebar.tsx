'use client';

import React from 'react';
import {
  LayoutDashboard, Truck, Navigation, AlertTriangle, Waves, PlayCircle,
  BarChart3, Database, Activity, ChevronRight
} from 'lucide-react';

export type ActiveTab = 'overview' | 'missions' | 'routing' | 'incidents' | 'simulation' | 'replay' | 'analytics' | 'datasources' | 'health';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  blockedEdgesCount: number;
  incidentsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  blockedEdgesCount,
  incidentsCount
}) => {
  const menuItems = [
    { id: 'overview' as ActiveTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'missions' as ActiveTab, label: 'Mission Control', icon: Truck, badge: '2 Active' },
    { id: 'routing' as ActiveTab, label: 'Route Planner', icon: Navigation, badge: 'Live A*' },
    { id: 'incidents' as ActiveTab, label: 'Incident Center', icon: AlertTriangle, badge: `${incidentsCount}` },
    { id: 'simulation' as ActiveTab, label: 'Disaster Simulator', icon: Waves, badge: `${blockedEdgesCount} Blocked` },
    { id: 'replay' as ActiveTab, label: 'Scenario Replay', icon: PlayCircle },
    { id: 'analytics' as ActiveTab, label: 'Analytics', icon: BarChart3 },
    { id: 'datasources' as ActiveTab, label: 'Data Sources', icon: Database },
    { id: 'health' as ActiveTab, label: 'System Health', icon: Activity }
  ];

  return (
    <aside className="w-64 bg-command-card border-r border-command-border flex flex-col justify-between h-full select-none shrink-0 overflow-hidden">
      <div className="p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-xs transition-all duration-200 ${
                isActive
                  ? 'bg-aegis-cyan/15 text-aegis-cyan border border-aegis-cyan/40 shadow-cyan font-semibold'
                  : 'text-command-muted hover:bg-command-panel hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-aegis-cyan' : 'text-command-muted'}`} />
                <span>{item.label}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                {item.badge && (
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-aegis-cyan text-command-bg' : 'bg-command-panel text-command-muted border border-command-border'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-aegis-cyan" />}
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

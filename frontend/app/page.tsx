'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Header } from '@/components/layout/Header';
import { Sidebar, ActiveTab } from '@/components/layout/Sidebar';
import { KpiCards } from '@/components/dashboard/KpiCards';
import { AICommandBar } from '@/components/dashboard/AICommandBar';

const MapView = dynamic(() => import('@/components/map/MapView').then(m => m.MapView), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] bg-command-bg rounded-xl border border-command-border flex items-center justify-center font-mono text-xs text-aegis-cyan animate-pulse">
      Loading DRIVE GIS Engine Canvas...
    </div>
  )
});
import { RoutePlanner } from '@/components/routing/RoutePlanner';
import { RouteComparison } from '@/components/routing/RouteComparison';
import { FloodSlider } from '@/components/simulation/FloodSlider';
import { ReplayController } from '@/components/simulation/ReplayController';
import { IncidentPanel } from '@/components/incidents/IncidentPanel';
import { IncidentModal } from '@/components/incidents/IncidentModal';
import { MissionControl } from '@/components/missions/MissionControl';
import { AnalyticsView } from '@/components/analytics/AnalyticsView';
import { SystemHealth } from '@/components/system/SystemHealth';
import { DataSources } from '@/components/system/DataSources';
import { BriefingModal } from '@/components/ai/BriefingModal';

import { api } from '@/lib/api';
import { calculateClientRouteComparison } from '@/lib/graphEngine';
import { DEFAULT_FACILITIES, DEFAULT_INCIDENTS } from '@/lib/data';
import {
  Facility, Incident, Mission, GraphStats, AIBriefing,
  RoadSegment, RouteResponse, RouteComparison as RouteComparisonType
} from '@/lib/types';

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [floodLevel, setFloodLevel] = useState<number>(1.8);
  const [safetyMargin, setSafetyMargin] = useState<number>(0.3);
  const [lastUpdate, setLastUpdate] = useState<string>('2.4 sec ago');

  // Data states
  const [facilities, setFacilities] = useState<Facility[]>(DEFAULT_FACILITIES);
  const [roads, setRoads] = useState<RoadSegment[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>(DEFAULT_INCIDENTS);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [stats, setStats] = useState<GraphStats | null>(null);
  const [briefing, setBriefing] = useState<AIBriefing | null>(null);

  // Routing states
  const [originId, setOriginId] = useState<string>('fac_01');
  const [destId, setDestId] = useState<string>('fac_02');
  const [routingMode, setRoutingMode] = useState<'fastest' | 'disaster_aware' | 'safety'>('safety');
  const [activeRoute, setActiveRoute] = useState<RouteResponse | null>(null);
  const [routeComparison, setRouteComparison] = useState<RouteComparisonType | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  // Modals
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState<boolean>(false);
  const [isBriefingModalOpen, setIsBriefingModalOpen] = useState<boolean>(false);

  // Load initial data
  const loadData = async () => {
    try {
      const [facsData, roadsData, incsData, missData, statsData, briefingData] = await Promise.all([
        api.getFacilities(),
        api.getRoads(),
        api.getIncidents(),
        api.getMissions(),
        api.getGraphStats(),
        api.getAIBriefing(floodLevel)
      ]);

      setFacilities(facsData);
      setRoads(roadsData);
      setIncidents(incsData);
      setMissions(missData);
      setStats(statsData);
      setBriefing(briefingData);

      // Auto compute default demo route
      if (facsData.length >= 2) {
        handleCalculateRoute(facsData[0].id, facsData[1].id, floodLevel);
      }
    } catch (err) {
      console.warn('Backend loading error - fallback to local simulation state');
      setFacilities(prev => prev.length > 0 ? prev : DEFAULT_FACILITIES);
      setIncidents(prev => prev.length > 0 ? prev : DEFAULT_INCIDENTS);
    }
  };

  const handleIncidentSubmitted = (newIncident?: Incident) => {
    if (newIncident) {
      setIncidents(prev => [newIncident, ...prev.filter(i => i.id !== newIncident.id)]);
    }
    loadData();
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update disaster flood level
  const handleFloodLevelChange = async (newLevel: number) => {
    setFloodLevel(newLevel);
    setLastUpdate('Just now');

    try {
      await api.updateFloodLevel(newLevel);
      const updatedRoads = await api.getRoads();
      setRoads(updatedRoads);
      
      const updatedStats = await api.getGraphStats();
      setStats(updatedStats);

      handleCalculateRoute(originId, destId, newLevel);
    } catch (err) {
      // Local fallback road state filter & route calculation
      setRoads(prev => prev.map(r => ({
        ...r,
        is_blocked: r.elevation < (newLevel + safetyMargin)
      })));
      handleCalculateRoute(originId, destId, newLevel);
    }
  };

  // Calculate route action
  const handleCalculateRoute = async (orig: string = originId, dest: string = destId, level: number = floodLevel) => {
    setIsCalculating(true);
    const facsList = facilities && facilities.length > 0 ? facilities : DEFAULT_FACILITIES;
    const origFac = facsList.find(f => f.id === orig) || facsList[0];
    const destFac = facsList.find(f => f.id === dest) || facsList[1];

    if (!origFac || !destFac) {
      setIsCalculating(false);
      return;
    }

    try {
      const comp = await api.compareRoutes(
        { lat: origFac.lat, lng: origFac.lng },
        { lat: destFac.lat, lng: destFac.lng },
        level
      );
      setRouteComparison(comp);
      setActiveRoute(comp.aegis_route);
    } catch (err) {
      const comp = calculateClientRouteComparison(
        origFac.id, destFac.id,
        origFac.lat, origFac.lng,
        destFac.lat, destFac.lng,
        level
      );
      setRouteComparison(comp);
      setActiveRoute(comp.aegis_route);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleAICommandAction = (intent: string, data: any, rawQuery: string) => {
    if (data?.flood_level) {
      handleFloodLevelChange(data.flood_level);
    } else if (rawQuery.toLowerCase().includes("2.5")) {
      handleFloodLevelChange(2.5);
    }

    if (data?.origin && data?.destination) {
      setOriginId(data.origin);
      setDestId(data.destination);
      handleCalculateRoute(data.origin, data.destination, floodLevel);
    } else {
      handleCalculateRoute(originId, destId, floodLevel);
    }
  };

  const blockedCount = roads.filter(r => r.is_blocked || r.elevation < (floodLevel + safetyMargin)).length;

  return (
    <div className="min-h-screen bg-command-bg text-command-text flex flex-col font-sans select-none">
      {/* Top Header */}
      <Header
        floodLevel={floodLevel}
        lastUpdate={lastUpdate}
        onOpenBriefing={() => setIsBriefingModalOpen(true)}
      />

      {/* Main Layout Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          blockedEdgesCount={blockedCount}
          incidentsCount={incidents.length}
        />

        {/* Central Workspace Content */}
        <main className="flex-1 p-5 overflow-y-auto max-w-full">
          {/* KPI Dashboard Cards */}
          <KpiCards stats={stats} floodLevel={floodLevel} />

          {/* AI Command Center Input Bar */}
          <AICommandBar
            floodLevel={floodLevel}
            onExecuteCommandAction={handleAICommandAction}
          />

          {/* Main Dashboard Views based on Active Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Map & Routing Dispatcher Split View */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[560px]">
                {/* Left 2 Cols: Live Leaflet Map Canvas */}
                <div className="lg:col-span-2 h-full">
                  <MapView
                    roads={roads}
                    facilities={facilities}
                    incidents={incidents}
                    activeRoute={activeRoute}
                    normalRoute={routeComparison?.normal_route}
                    floodLevel={floodLevel}
                    onSelectFacility={(fac) => setDestId(fac.id)}
                  />
                </div>

                {/* Right Col: Route Dispatcher & Comparison */}
                <div className="h-full overflow-y-auto space-y-4 pr-1">
                  <RoutePlanner
                    facilities={facilities}
                    selectedOrigin={originId}
                    setSelectedOrigin={setOriginId}
                    selectedDestination={destId}
                    setSelectedDestination={setDestId}
                    routingMode={routingMode}
                    setRoutingMode={setRoutingMode}
                    onCalculateRoute={() => handleCalculateRoute()}
                    isCalculating={isCalculating}
                    recomputeMs={activeRoute?.recompute_ms}
                  />

                  <RouteComparison comparison={routeComparison} />
                </div>
              </div>

              {/* Flood Level Slider & Scenario Replay */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FloodSlider
                  floodLevel={floodLevel}
                  setFloodLevel={handleFloodLevelChange}
                  safetyMargin={safetyMargin}
                  setSafetyMargin={setSafetyMargin}
                  blockedCount={blockedCount}
                />

                <ReplayController
                  onTimelineChange={(step, lvl) => handleFloodLevelChange(lvl)}
                />
              </div>

              {/* Incidents Table & Mission Control */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <IncidentPanel
                  incidents={incidents}
                  onOpenModal={() => setIsIncidentModalOpen(true)}
                />
                <MissionControl
                  missions={missions}
                  facilities={facilities}
                  onMissionCreated={loadData}
                />
              </div>
            </div>
          )}

          {activeTab === 'missions' && (
            <MissionControl
              missions={missions}
              facilities={facilities}
              onMissionCreated={loadData}
            />
          )}

          {activeTab === 'routing' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[580px]">
              {/* Left 2 Cols: Interactive Map Canvas */}
              <div className="lg:col-span-2 h-full">
                <MapView
                  roads={roads}
                  facilities={facilities}
                  incidents={incidents}
                  activeRoute={activeRoute}
                  normalRoute={routeComparison?.normal_route}
                  floodLevel={floodLevel}
                  onSelectFacility={(fac) => setDestId(fac.id)}
                />
              </div>

              {/* Right Col: Route Planner Controls & Comparison */}
              <div className="h-full overflow-y-auto space-y-4 pr-1">
                <RoutePlanner
                  facilities={facilities}
                  selectedOrigin={originId}
                  setSelectedOrigin={setOriginId}
                  selectedDestination={destId}
                  setSelectedDestination={setDestId}
                  routingMode={routingMode}
                  setRoutingMode={setRoutingMode}
                  onCalculateRoute={() => handleCalculateRoute()}
                  isCalculating={isCalculating}
                  recomputeMs={activeRoute?.recompute_ms}
                />
                <RouteComparison comparison={routeComparison} />
              </div>
            </div>
          )}

          {activeTab === 'incidents' && (
            <IncidentPanel
              incidents={incidents}
              onOpenModal={() => setIsIncidentModalOpen(true)}
            />
          )}

          {activeTab === 'simulation' && (
            <div className="space-y-4">
              <FloodSlider
                floodLevel={floodLevel}
                setFloodLevel={handleFloodLevelChange}
                safetyMargin={safetyMargin}
                setSafetyMargin={setSafetyMargin}
                blockedCount={blockedCount}
              />
              <MapView
                roads={roads}
                facilities={facilities}
                incidents={incidents}
                activeRoute={activeRoute}
                floodLevel={floodLevel}
              />
            </div>
          )}

          {activeTab === 'replay' && (
            <div className="space-y-4">
              <ReplayController
                onTimelineChange={(step, lvl) => handleFloodLevelChange(lvl)}
              />
              <MapView
                roads={roads}
                facilities={facilities}
                incidents={incidents}
                activeRoute={activeRoute}
                floodLevel={floodLevel}
              />
            </div>
          )}

          {activeTab === 'analytics' && <AnalyticsView />}

          {activeTab === 'datasources' && <DataSources />}

          {activeTab === 'health' && <SystemHealth stats={stats} />}
        </main>
      </div>

      {/* Modals */}
      <IncidentModal
        isOpen={isIncidentModalOpen}
        onClose={() => setIsIncidentModalOpen(false)}
        onIncidentSubmitted={handleIncidentSubmitted}
      />

      <BriefingModal
        isOpen={isBriefingModalOpen}
        onClose={() => setIsBriefingModalOpen(false)}
        briefing={briefing}
      />
    </div>
  );
}

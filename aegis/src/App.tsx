import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Earth3DView } from './components/earth/Earth3DView';
import { MissionDashboard } from './components/dashboard/MissionDashboard';
import { DigitalTwinView } from './components/digitalTwin/DigitalTwinView';
import { MissionPlanner } from './components/planner/MissionPlanner';
import { CopilotPanel } from './components/ai/CopilotPanel';
import { DebrisIntelligenceView } from './components/debris/DebrisIntelligenceView';
import { InspectionReportsView } from './components/reports/InspectionReportsView';
import { MaintenanceScheduler } from './components/scheduler/MaintenanceScheduler';
import { TitanValeEcosystemModal } from './components/TitanValeEcosystemModal';

import {
  INITIAL_SATELLITES,
  INITIAL_DEBRIS,
  INITIAL_MISSIONS,
  INITIAL_REPORTS,
  INITIAL_MAINTENANCE_TASKS,
  INITIAL_NOTIFICATIONS,
} from './data/mockData';

import {
  Satellite,
  DebrisObject,
  MissionPlan,
  InspectionReport,
  MaintenanceTask,
  AppNotification,
  UserRole,
} from './types';

import { Activity, Radio, Cpu, ShieldCheck, Clock, Wifi } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState('earth');
  const [userRole, setUserRole] = useState<UserRole>('mission_controller');

  // Application Domain State
  const [satellites, setSatellites] = useState<Satellite[]>(INITIAL_SATELLITES);
  const [debris, setDebris] = useState<DebrisObject[]>(INITIAL_DEBRIS);
  const [missions, setMissions] = useState<MissionPlan[]>(INITIAL_MISSIONS);
  const [reports, setReports] = useState<InspectionReport[]>(INITIAL_REPORTS);
  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>(INITIAL_MAINTENANCE_TASKS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  // Active Context Selections
  const [selectedSatellite, setSelectedSatellite] = useState<Satellite>(INITIAL_SATELLITES[0]);
  const [copilotPrompt, setCopilotPrompt] = useState<string | undefined>(undefined);
  const [isEcosystemOpen, setIsEcosystemOpen] = useState(false);
  const [utcTime, setUtcTime] = useState<string>('');
  const [isSyncingCelesTrak, setIsSyncingCelesTrak] = useState(false);

  // Live CelesTrak Fleet Telemetry Sync
  const handleSyncCelesTrak = async () => {
    setIsSyncingCelesTrak(true);
    try {
      const res = await fetch('/api/celestrak/sync-fleet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ satellites }),
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.satellites)) {
        setSatellites(json.satellites);
        
        setSelectedSatellite((prev) => {
          const updated = json.satellites.find((s: Satellite) => s.id === prev.id);
          return updated || prev;
        });

        setNotifications((prev) => [
          {
            id: `notif-${Date.now()}`,
            type: 'healthy',
            title: 'CelesTrak Sync Complete',
            timestamp: 'JUST NOW',
            satelliteId: 'fleet',
            severity: 'info',
            message: `Live CelesTrak NORAD TLE telemetry synced successfully for AEGIS fleet.`,
            read: false,
          },
          ...prev,
        ]);
      }
    } catch (e: any) {
      console.warn('CelesTrak fleet sync error:', e);
    } finally {
      setIsSyncingCelesTrak(false);
    }
  };

  // Live UTC Clock update & initial CelesTrak Sync
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    // Initial sync
    handleSyncCelesTrak();

    return () => clearInterval(interval);
  }, []);

  // Action Handlers
  const handleSelectSatellite = (sat: Satellite) => {
    setSelectedSatellite(sat);
  };

  const handleOpenCopilot = (sat: Satellite, prompt?: string) => {
    setSelectedSatellite(sat);
    if (prompt) setCopilotPrompt(prompt);
    setActiveTab('copilot');
  };

  const handleGenerateReportTrigger = (sat: Satellite) => {
    setSelectedSatellite(sat);
    setActiveTab('reports');
  };

  const handleScheduleMaintenanceTrigger = (sat: Satellite) => {
    setSelectedSatellite(sat);
    setActiveTab('scheduler');
  };

  const handleAddMission = (newMission: MissionPlan) => {
    setMissions((prev) => [newMission, ...prev]);
  };

  const handleAddReport = (newReport: InspectionReport) => {
    setReports((prev) => [newReport, ...prev]);
  };

  const handleAddMaintenanceTask = (newTask: MaintenanceTask) => {
    setMaintenanceTasks((prev) => [newTask, ...prev]);
  };

  const handleUpdateTaskStatus = (taskId: string, status: MaintenanceTask['status']) => {
    setMaintenanceTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status } : t))
    );
  };

  const handleClearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#05070A] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Primary Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        setUserRole={setUserRole}
        notifications={notifications}
        markNotificationRead={handleClearNotification}
        satellites={satellites}
        onSelectSatellite={handleSelectSatellite}
        openTitanValeModal={() => setIsEcosystemOpen(true)}
        onSyncCelesTrak={handleSyncCelesTrak}
        isSyncingCelesTrak={isSyncingCelesTrak}
      />

      {/* Main View Router */}
      <main className="flex-1 relative overflow-x-hidden pb-8">
        {activeTab === 'earth' && (
          <div className="w-full h-[calc(100vh-120px)] relative">
            <Earth3DView
              satellites={satellites}
              debris={debris}
              selectedSatellite={selectedSatellite}
              onSelectSatellite={handleSelectSatellite}
              onOpenDigitalTwin={(sat) => {
                setSelectedSatellite(sat);
                setActiveTab('digital_twin');
              }}
            />
          </div>
        )}

        {activeTab === 'dashboard' && (
          <MissionDashboard
            satellites={satellites}
            debris={debris}
            maintenanceTasks={maintenanceTasks}
            notifications={notifications}
            onSelectSatellite={setSelectedSatellite}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'digital_twin' && (
          <DigitalTwinView
            satellites={satellites}
            selectedSatellite={selectedSatellite}
            onSelectSatellite={setSelectedSatellite}
            onOpenCopilot={handleOpenCopilot}
            onGenerateReport={handleGenerateReportTrigger}
            onScheduleMaintenance={handleScheduleMaintenanceTrigger}
          />
        )}

        {activeTab === 'planner' && (
          <MissionPlanner
            missions={missions}
            onAddMission={handleAddMission}
          />
        )}

        {activeTab === 'copilot' && (
          <CopilotPanel
            satellites={satellites}
            debris={debris}
            selectedSatellite={selectedSatellite}
            initialPrompt={copilotPrompt}
            onScheduleMaintenance={handleScheduleMaintenanceTrigger}
          />
        )}

        {activeTab === 'debris' && (
          <DebrisIntelligenceView
            debris={debris}
            satellites={satellites}
            onOpenCopilot={handleOpenCopilot}
          />
        )}

        {activeTab === 'reports' && (
          <InspectionReportsView
            reports={reports}
            satellites={satellites}
            onAddReport={handleAddReport}
            onScheduleMaintenance={handleScheduleMaintenanceTrigger}
          />
        )}

        {activeTab === 'scheduler' && (
          <MaintenanceScheduler
            tasks={maintenanceTasks}
            satellites={satellites}
            onAddTask={handleAddMaintenanceTask}
            onUpdateTaskStatus={handleUpdateTaskStatus}
          />
        )}
      </main>

      {/* Immersive UI Bottom Telemetry Status Bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-[#080B12]/95 border-t border-slate-800/80 px-4 py-1.5 backdrop-blur-md font-mono text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-3 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span>AEGIS CORE 3.6 ONLINE</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-emerald-400">
            <Wifi className="w-3 h-3 text-emerald-400" />
            <span>DOWNLINK 24.8 Mbps (NOMINAL)</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-slate-300">
            <Radio className="w-3 h-3 text-cyan-400" />
            <span>FLEET: {satellites.length} SPACECRAFT</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <div className="hidden lg:flex items-center gap-1.5">
            <Cpu className="w-3 h-3 text-cyan-400" />
            <span>DIGITAL TWIN LATTICE: SYNCED</span>
          </div>

          <div className="flex items-center gap-1.5 text-cyan-300 font-semibold">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span>{utcTime || 'UTC --:--:--'}</span>
          </div>
        </div>
      </footer>

      {/* TitanVale Ecosystem Modal */}
      <TitanValeEcosystemModal
        isOpen={isEcosystemOpen}
        onClose={() => setIsEcosystemOpen(false)}
      />
    </div>
  );
}

export default App;
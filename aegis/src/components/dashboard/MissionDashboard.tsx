import React from 'react';
import { Satellite, DebrisObject, MaintenanceTask, AppNotification } from '../../types';
import {
  Activity,
  Satellite as SatelliteIcon,
  ShieldAlert,
  Wrench,
  Radio,
  Zap,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sun,
  ChevronRight,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

interface MissionDashboardProps {
  satellites: Satellite[];
  debris: DebrisObject[];
  maintenanceTasks: MaintenanceTask[];
  notifications: AppNotification[];
  onSelectSatellite: (sat: Satellite) => void;
  onNavigateTab: (tab: string) => void;
}

export const MissionDashboard: React.FC<MissionDashboardProps> = ({
  satellites,
  debris,
  maintenanceTasks,
  notifications,
  onSelectSatellite,
  onNavigateTab,
}) => {
  const nominalCount = satellites.filter((s) => s.status === 'nominal').length;
  const warningCount = satellites.filter((s) => s.status === 'warning').length;
  const criticalCount = satellites.filter((s) => s.status === 'critical').length;

  const avgFleetHealth = Math.round(
    satellites.reduce((acc, s) => acc + s.telemetry.overallHealthScore, 0) / (satellites.length || 1)
  );

  const highRiskDebris = debris.filter((d) => d.riskLevel === 'High');
  const pendingTasks = maintenanceTasks.filter((m) => m.status === 'pending');

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 text-slate-100 font-sans">
      {/* Top Welcome Banner */}
      <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-5 shadow-2xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black font-mono tracking-tight text-white">MISSION HEALTH CONTROL</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              FLEET TELEMETRY MATRIX
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Real-time orbital telemetry monitoring & AI risk evaluation engine across {satellites.length} active spacecraft.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('earth')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono font-semibold text-slate-200 transition-all flex items-center gap-1.5"
          >
            <span>Launch 3D Orbit View</span>
            <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        </div>
      </div>

      {/* Primary Fleet Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 font-mono">
        {/* Fleet Health */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>FLEET HEALTH AVG</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div
            className={`text-2xl font-black ${
              avgFleetHealth >= 85 ? 'text-emerald-400' : avgFleetHealth >= 70 ? 'text-amber-400' : 'text-red-400'
            }`}
          >
            {avgFleetHealth}%
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Nominal across 4 orbital planes</div>
        </div>

        {/* Active Satellites */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>ACTIVE ASSETS</span>
            <SatelliteIcon className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-slate-100">{satellites.length}</div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-2">
            <span className="text-emerald-400">{nominalCount} Nominal</span> |{' '}
            <span className="text-amber-400">{warningCount} Warn</span> |{' '}
            <span className="text-red-400">{criticalCount} Crit</span>
          </div>
        </div>

        {/* Collision Conjunction Alerts */}
        <div className="bg-slate-900/90 border border-red-500/30 rounded-xl p-4 shadow-xl bg-red-950/10">
          <div className="flex items-center justify-between text-red-400 text-xs mb-2">
            <span>COLLISION CONJUNCTIONS</span>
            <ShieldAlert className="w-4 h-4 text-red-400 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-red-400">{highRiskDebris.length}</div>
          <div className="text-[10px] text-slate-400 mt-1">High collision risk objects tracked</div>
        </div>

        {/* Maintenance Queue */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>SERVICING QUEUE</span>
            <Wrench className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-300">{pendingTasks.length}</div>
          <div className="text-[10px] text-slate-400 mt-1">Pending maintenance tasks</div>
        </div>

        {/* Space Weather */}
        <div className="bg-slate-900/90 border border-amber-500/30 rounded-xl p-4 shadow-xl bg-amber-950/10">
          <div className="flex items-center justify-between text-amber-400 text-xs mb-2">
            <span>SPACE WEATHER</span>
            <Sun className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-black text-amber-300">Kp 2.3 STABLE</div>
          <div className="text-[10px] text-slate-400 mt-1">Low solar flare particle flux</div>
        </div>
      </div>

      {/* Fleet Telemetry Comparison Matrix */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl font-mono text-xs">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            <span>FLEET TELEMETRY & AI RISK MATRIX</span>
          </h3>
          <span className="text-slate-400 text-[11px]">Click satellite to open Digital Twin</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                <th className="py-2.5 px-3">Satellite Name</th>
                <th className="py-2.5 px-3">Orbit</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Power/Batt</th>
                <th className="py-2.5 px-3">Thermal</th>
                <th className="py-2.5 px-3">Fuel</th>
                <th className="py-2.5 px-3">AI Risk Score</th>
                <th className="py-2.5 px-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {satellites.map((sat) => (
                <tr
                  key={sat.id}
                  onClick={() => {
                    onSelectSatellite(sat);
                    onNavigateTab('digital_twin');
                  }}
                  className="hover:bg-slate-800/60 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-100 text-xs">{sat.name}</div>
                    <div className="text-[10px] text-slate-500">NORAD #{sat.noradId} | {sat.operator}</div>
                  </td>

                  <td className="py-3 px-3 text-cyan-300 font-semibold">{sat.orbitType}</td>

                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        sat.status === 'nominal'
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30'
                          : sat.status === 'warning'
                          ? 'bg-amber-950 text-amber-400 border-amber-500/30'
                          : 'bg-red-950 text-red-400 border-red-500/30'
                      }`}
                    >
                      {sat.status}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-slate-300">{sat.telemetry.batteryLevel}%</td>

                  <td className="py-3 px-3 text-amber-300">{sat.telemetry.internalTemp}°C</td>

                  <td className="py-3 px-3 text-emerald-300">{sat.telemetry.fuelRemaining}%</td>

                  <td className="py-3 px-3">
                    <span
                      className={`font-bold ${
                        sat.telemetry.aiRiskScore > 50
                          ? 'text-red-400'
                          : sat.telemetry.aiRiskScore > 25
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {sat.telemetry.aiRiskScore}/100
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <button className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 text-[10px] font-semibold transition-all">
                      Inspect Twin →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Alerts Stream & Upcoming Servicing Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Engineering Alerts Stream */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>ACTIVE ENGINEERING ALERTS</span>
            </h3>
            <span className="text-[10px] text-slate-400">{notifications.length} alerts</span>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3 rounded-xl border ${
                  n.severity === 'critical'
                    ? 'bg-red-950/30 border-red-500/40 text-slate-200'
                    : n.severity === 'high'
                    ? 'bg-amber-950/30 border-amber-500/40 text-slate-200'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-100">{n.title}</span>
                  <span className="text-[10px] text-slate-500">{n.timestamp}</span>
                </div>
                <p className="text-xs font-sans text-slate-300">{n.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Servicing Queue */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-emerald-400" />
              <span>UPCOMING SERVICING QUEUE</span>
            </h3>
            <button
              onClick={() => onNavigateTab('scheduler')}
              className="text-[10px] text-cyan-400 hover:underline"
            >
              View Queue →
            </button>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {maintenanceTasks.map((task) => (
              <div key={task.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-cyan-300">{task.satelliteName}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/30">
                    {task.priority.toUpperCase()}
                  </span>
                </div>
                <div className="text-xs text-slate-200 font-sans">{task.title}</div>
                <div className="text-[10px] text-slate-400">Scheduled: {task.scheduledDate}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
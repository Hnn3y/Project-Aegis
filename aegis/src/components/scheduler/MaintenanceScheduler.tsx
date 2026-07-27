import React, { useState } from 'react';
import { MaintenanceTask, Satellite } from '../../types';
import {
  Wrench,
  Plus,
  Bot,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  UserCheck,
  Zap,
  Shield,
  Layers,
} from 'lucide-react';

interface MaintenanceSchedulerProps {
  tasks: MaintenanceTask[];
  satellites: Satellite[];
  onAddTask: (task: MaintenanceTask) => void;
  onUpdateTaskStatus: (taskId: string, status: MaintenanceTask['status']) => void;
}

export const MaintenanceScheduler: React.FC<MaintenanceSchedulerProps> = ({
  tasks,
  satellites,
  onAddTask,
  onUpdateTaskStatus,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    satelliteId: satellites[0]?.id || 'sat-1',
    title: 'EUV Imager Sensor Recalibration & Optic Clean',
    subsystem: 'Payload (Sensors)',
    scheduledDate: '2026-08-10',
    priority: 'high' as MaintenanceTask['priority'],
    taskType: 'repair' as MaintenanceTask['taskType'],
    assignedEngineer: 'Dr. Marcus Vance (TitanVale Servicing Lead)',
    notes: 'Deploy TitanVale Forge autonomous robotic servicing vehicle for orbital docking.',
    aiReasoning: 'AI predicts sensor total data degradation within 21 days due to flare proton lattice displacement.',
  });

  const handleCreate = () => {
    const selectedSat = satellites.find((s) => s.id === formData.satelliteId);
    const newTask: MaintenanceTask = {
      id: `maint-${Date.now()}`,
      satelliteName: selectedSat?.name || 'AEGIS-1',
      status: 'pending',
      ...formData,
    };

    onAddTask(newTask);
    setShowModal(false);
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 text-slate-100 font-sans">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-5 shadow-2xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold font-mono text-white">SPACECRAFT MAINTENANCE & SERVICING SCHEDULER</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/40">
              AUTONOMOUS SERVICING QUEUE
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Schedule inspections, maneuvers, component replacements, and robotic servicing missions.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono text-xs font-semibold shadow-xl transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Servicing Task</span>
        </button>
      </div>

      {/* Long-Term Vision Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/30 font-mono text-xs flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <Zap className="w-6 h-6 text-cyan-400 animate-pulse" />
          <div>
            <span className="text-cyan-300 font-bold block">TITANVALE ROBOTIC SERVICING FLEET VISION</span>
            <p className="text-slate-400 text-[11px] font-sans">
              AEGIS directly commands TitanVale Sentinel & Forge autonomous spacecraft for in-orbit refueling, inspection, and hardware upgrades.
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold text-[10px]">
          FUTURE AUTONOMOUS DOCKING ENABLED
        </span>
      </div>

      {/* Servicing Task List */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold font-mono text-slate-200">ACTIVE MAINTENANCE QUEUE ({tasks.length})</h2>

        <div className="space-y-3 font-mono text-xs">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`p-5 rounded-2xl border transition-all ${
                task.status === 'completed'
                  ? 'bg-slate-950/60 border-slate-800 text-slate-400'
                  : task.priority === 'critical'
                  ? 'bg-red-950/20 border-red-500/40 text-slate-200'
                  : task.priority === 'high'
                  ? 'bg-amber-950/20 border-amber-500/40 text-slate-200'
                  : 'bg-slate-900/90 border-slate-800 text-slate-200'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-3">
                <div>
                  <div className="text-sm font-bold text-cyan-300 font-sans">{task.title}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Asset: <span className="text-slate-200 font-bold">{task.satelliteName}</span> | Subsystem: {task.subsystem}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      task.priority === 'critical'
                        ? 'bg-red-950 text-red-300 border border-red-500/40'
                        : task.priority === 'high'
                        ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    Priority: {task.priority}
                  </span>

                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      task.status === 'completed'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                        : 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-sans text-slate-300 mb-3">
                <div>
                  <span className="text-slate-500 font-mono text-[10px] block">Scheduled Servicing Date:</span>
                  <span className="font-mono text-cyan-300 font-bold">{task.scheduledDate}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-mono text-[10px] block">Assigned Engineer / Vehicle:</span>
                  <span className="text-slate-200">{task.assignedEngineer}</span>
                </div>
              </div>

              {/* AI Reasoning Tag */}
              {task.aiReasoning && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] font-mono mb-3">
                  <span className="text-cyan-400 font-bold block mb-0.5">AI REASONING FOR SCHEDULE:</span>
                  <p className="text-slate-300 font-sans">{task.aiReasoning}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-[10px] text-slate-500 font-mono">Task Type: {task.taskType.toUpperCase()}</span>

                {task.status !== 'completed' && (
                  <button
                    onClick={() => onUpdateTaskStatus(task.id, 'completed')}
                    className="px-3 py-1 rounded bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-mono transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark Completed</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl max-w-xl w-full space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-cyan-300 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-cyan-400" />
                <span>SCHEDULE SERVICING TASK</span>
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-200">
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-slate-400 block mb-1">Target Satellite</label>
                <select
                  value={formData.satelliteId}
                  onChange={(e) => setFormData({ ...formData, satelliteId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                >
                  {satellites.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.orbitType})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Task Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Scheduled Date</label>
                  <input
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Assigned Engineer / Vehicle</label>
                <input
                  type="text"
                  value={formData.assignedEngineer}
                  onChange={(e) => setFormData({ ...formData, assignedEngineer: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">AI Reasoning Justification</label>
                <textarea
                  rows={2}
                  value={formData.aiReasoning}
                  onChange={(e) => setFormData({ ...formData, aiReasoning: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300">
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold"
              >
                Schedule Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
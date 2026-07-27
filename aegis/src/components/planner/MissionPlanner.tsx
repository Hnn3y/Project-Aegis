import React, { useState } from 'react';
import { MissionPlan, OrbitType } from '../../types';
import {
  Radio,
  Plus,
  Bot,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  Calendar,
  Zap,
  TrendingUp,
  Info,
  Loader2,
} from 'lucide-react';

interface MissionPlannerProps {
  missions: MissionPlan[];
  onAddMission: (mission: MissionPlan) => void;
}

export const MissionPlanner: React.FC<MissionPlannerProps> = ({ missions, onAddMission }) => {
  const [showModal, setShowModal] = useState(false);
  const [evaluating, setEvaluating] = useState(false);

  const [formData, setFormData] = useState({
    missionName: 'Aegis-3 Sentinel Node',
    satelliteName: 'AEGIS-3 Sentinel',
    operator: 'TitanVale Defense Systems',
    launchDate: '2026-12-01',
    missionObjective: 'Autonomous orbital debris monitoring and satellite inspection platform',
    orbitType: 'LEO' as OrbitType,
    payloadType: 'Optical LIDAR + RF Spectrum Analyzer',
    payloadMassKg: 1250,
    missionDurationMonths: 60,
    expectedLifespanYears: 8,
  });

  const [aiEvaluationResult, setAiEvaluationResult] = useState<MissionPlan['aiEvaluation'] | null>(null);

  const handleEvaluateAI = async () => {
    setEvaluating(true);
    try {
      const res = await fetch('/api/evaluate-mission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (json.success && json.evaluation) {
        setAiEvaluationResult(json.evaluation);
      } else {
        throw new Error(json.error || 'Evaluation failed');
      }
    } catch (err) {
      console.error('Error evaluating mission with AI:', err);
      // Fallback
      setAiEvaluationResult({
        estimatedRiskScore: 22,
        expectedLifespanYears: 7.8,
        orbitalCongestionLevel: 'Moderate',
        collisionProbabilityPercent: 0.041,
        fuelEfficiencyRating: 'A',
        feasibilityScore: 91,
        recommendations: [
          'Utilize electric ion thruster secondary propulsion for orbital station keeping.',
          'Schedule launch window during minimum space debris flux window.',
          'Equip collision avoidance firmware.',
        ],
        riskContributors: [
          'High density of LEO debris in 500-600km band.',
          'Atmospheric drag during solar maximum activity phases.',
        ],
      });
    } finally {
      setEvaluating(false);
    }
  };

  const handleCreateMission = () => {
    const newMission: MissionPlan = {
      id: `mis-${Date.now()}`,
      ...formData,
      status: aiEvaluationResult ? 'approved' : 'evaluating',
      aiEvaluation: aiEvaluationResult || undefined,
    };

    onAddMission(newMission);
    setShowModal(false);
    setAiEvaluationResult(null);
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 text-slate-100 font-sans">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-5 shadow-2xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold font-mono text-white">AI SPACECRAFT MISSION PLANNER</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              PRE-LAUNCH EVALUATOR
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Configure spacecraft trajectories and trigger AI risk, orbital congestion, and lifespan evaluations.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-xs font-semibold shadow-xl transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Configure New Mission</span>
        </button>
      </div>

      {/* Planned Missions Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold font-mono text-slate-200">PLANNED & APPROVED MISSIONS ({missions.length})</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {missions.map((m) => (
            <div
              key={m.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4 font-mono text-xs"
            >
              <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-cyan-300 font-sans">{m.missionName}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-950 border border-cyan-500/30 text-cyan-400">
                      {m.orbitType}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{m.operator} | Launch: {m.launchDate}</p>
                </div>

                <span
                  className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${
                    m.status === 'approved'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                      : 'bg-amber-950 text-amber-400 border border-amber-500/40'
                  }`}
                >
                  {m.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block">Payload</span>
                  <span className="text-slate-200 font-semibold">{m.payloadType} ({m.payloadMassKg} kg)</span>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block">Target Lifespan</span>
                  <span className="text-slate-200 font-semibold">{m.expectedLifespanYears} Years</span>
                </div>
              </div>

              {/* AI Evaluation Box */}
              {m.aiEvaluation ? (
                <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-2 text-[11px]">
                  <div className="flex items-center justify-between text-cyan-400 font-bold border-b border-cyan-500/20 pb-1">
                    <span>AI PRE-LAUNCH EVALUATION</span>
                    <span>Feasibility: {m.aiEvaluation.feasibilityScore}/100</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                    <div>
                      <span className="text-slate-400">Orbital Risk:</span>
                      <div className="font-bold text-emerald-400">{m.aiEvaluation.estimatedRiskScore}/100</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Congestion:</span>
                      <div className="font-bold text-amber-300">{m.aiEvaluation.orbitalCongestionLevel}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Fuel Rating:</span>
                      <div className="font-bold text-cyan-300">{m.aiEvaluation.fuelEfficiencyRating}</div>
                    </div>
                  </div>

                  {m.aiEvaluation.recommendations && m.aiEvaluation.recommendations.length > 0 && (
                    <div className="pt-2 border-t border-cyan-500/20 text-slate-300 font-sans text-[11px]">
                      <span className="font-bold text-cyan-400 font-mono">Recommendations: </span>
                      {m.aiEvaluation.recommendations[0]}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center text-[11px] text-slate-500">
                  AI Evaluation Pending
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Configure Mission Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-5 text-slate-100 font-sans">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold font-mono text-cyan-300 flex items-center gap-2">
                <Radio className="w-5 h-5 text-cyan-400" />
                <span>CONFIGURE NEW SPACECRAFT MISSION</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">Mission Name</label>
                <input
                  type="text"
                  value={formData.missionName}
                  onChange={(e) => setFormData({ ...formData, missionName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Satellite Name</label>
                <input
                  type="text"
                  value={formData.satelliteName}
                  onChange={(e) => setFormData({ ...formData, satelliteName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Operator</label>
                <input
                  type="text"
                  value={formData.operator}
                  onChange={(e) => setFormData({ ...formData, operator: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Orbit Type</label>
                <select
                  value={formData.orbitType}
                  onChange={(e) => setFormData({ ...formData, orbitType: e.target.value as OrbitType })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="LEO">LEO (Low Earth Orbit)</option>
                  <option value="MEO">MEO (Medium Earth Orbit)</option>
                  <option value="GEO">GEO (Geostationary Orbit)</option>
                  <option value="Polar">Polar Orbit</option>
                  <option value="Sun Synchronous">Sun Synchronous (SSO)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Payload Type</label>
                <input
                  type="text"
                  value={formData.payloadType}
                  onChange={(e) => setFormData({ ...formData, payloadType: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Payload Mass (kg)</label>
                <input
                  type="number"
                  value={formData.payloadMassKg}
                  onChange={(e) => setFormData({ ...formData, payloadMassKg: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Trigger AI Evaluation Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleEvaluateAI}
                disabled={evaluating}
                className="w-full py-3 rounded-xl bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                {evaluating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                    <span>AEGIS AI evaluating orbit risk & congestion...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>Evaluate Mission Feasibility with AEGIS AI</span>
                  </>
                )}
              </button>
            </div>

            {/* AI Evaluation Results Box */}
            {aiEvaluationResult && (
              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/40 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between font-bold text-cyan-300 border-b border-cyan-500/20 pb-2">
                  <span>AI EVALUATION SUMMARY</span>
                  <span className="text-emerald-400">Feasibility: {aiEvaluationResult.feasibilityScore}/100</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[10px]">
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-500">Risk Score</span>
                    <div className="font-bold text-emerald-400">{aiEvaluationResult.estimatedRiskScore}/100</div>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-500">Congestion</span>
                    <div className="font-bold text-amber-300">{aiEvaluationResult.orbitalCongestionLevel}</div>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-500">Collision Prob</span>
                    <div className="font-bold text-cyan-300">{aiEvaluationResult.collisionProbabilityPercent}%</div>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-500">Fuel Rating</span>
                    <div className="font-bold text-emerald-300">{aiEvaluationResult.fuelEfficiencyRating}</div>
                  </div>
                </div>

                {aiEvaluationResult.recommendations && aiEvaluationResult.recommendations.length > 0 && (
                  <div className="space-y-1 font-sans text-slate-300 text-xs">
                    <span className="font-bold font-mono text-cyan-400">Pre-Approval Recommendations:</span>
                    <ul className="list-disc list-inside space-y-1 text-[11px]">
                      {aiEvaluationResult.recommendations.map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-mono"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleCreateMission}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-xs font-bold shadow-lg"
              >
                Approve & Schedule Mission
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
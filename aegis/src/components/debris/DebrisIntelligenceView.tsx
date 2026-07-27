import React, { useState } from 'react';
import { DebrisObject, Satellite } from '../../types';
import {
  ShieldAlert,
  AlertTriangle,
  Search,
  Filter,
  Radio,
  Clock,
  Zap,
  Layers,
  ChevronRight,
} from 'lucide-react';

interface DebrisIntelligenceViewProps {
  debris: DebrisObject[];
  satellites: Satellite[];
  onOpenCopilot: (sat: Satellite, prompt: string) => void;
}

export const DebrisIntelligenceView: React.FC<DebrisIntelligenceViewProps> = ({
  debris,
  satellites,
  onOpenCopilot,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');

  const filteredDebris = debris.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.noradId.toString().includes(searchQuery) ||
      d.objectType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRisk = filterRisk === 'All' || d.riskLevel === filterRisk;

    return matchesSearch && matchesRisk;
  });

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 text-slate-100 font-sans">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-red-500/30 rounded-2xl p-5 shadow-2xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4 bg-red-950/10">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold font-mono text-white">ORBITAL DEBRIS INTELLIGENCE & CONJUNCTION TRACKER</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-950 text-red-300 border border-red-500/40">
              HIGH-RISK CONJUNCTIONS
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Real-time orbital propagation and collision risk analysis using Space-Track and NORAD catalog telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
            Tracked Objects: <span className="text-cyan-400 font-bold">{debris.length}</span>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 font-bold">
            High Collision Risk: {debris.filter((d) => d.riskLevel === 'High').length}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search debris by name, NORAD ID, or object type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-slate-400">Risk Filter:</span>
          {(['All', 'High', 'Medium', 'Low'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setFilterRisk(r)}
              className={`px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                filterRisk === r
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* High-Risk Conjunction Highlight Cards */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold font-mono text-slate-200">ACTIVE CLOSE-CONJUNCTION THREATS</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {debris
            .filter((d) => d.conjunctionTargetName)
            .map((d) => {
              const targetSat = satellites.find((s) => s.id === d.conjunctionTargetId);
              return (
                <div
                  key={d.id}
                  className="bg-slate-900/90 border border-red-500/40 rounded-2xl p-5 shadow-2xl bg-red-950/10 font-mono text-xs space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-red-500/20 pb-2">
                    <div>
                      <div className="text-sm font-bold text-red-400 font-sans">{d.name}</div>
                      <div className="text-[10px] text-slate-400">NORAD #{d.noradId} | {d.objectType}</div>
                    </div>

                    <span className="px-2.5 py-1 rounded bg-red-950 text-red-300 font-bold border border-red-500/40 text-[10px]">
                      PROBABILITY: {(d.collisionProbabilityPercent || 0) * 100}%
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <span className="text-slate-500">Target Asset</span>
                      <div className="font-bold text-cyan-300 mt-0.5">{d.conjunctionTargetName}</div>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <span className="text-slate-500">Close Distance</span>
                      <div className="font-bold text-amber-300 mt-0.5">{d.conjunctionDistanceKm} km</div>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <span className="text-slate-500">Time to TCA</span>
                      <div className="font-bold text-red-400 mt-0.5">{d.tcaHours} hours</div>
                    </div>
                  </div>

                  {targetSat && (
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">Recommended Avoidance Maneuver: Delta-V 1.2 m/s</span>
                      <button
                        onClick={() =>
                          onOpenCopilot(
                            targetSat,
                            `Explain today's collision conjunction threat between ${targetSat.name} and ${d.name} (NORAD #${d.noradId}). What avoidance maneuver should be executed?`
                          )
                        }
                        className="px-3 py-1.5 rounded-lg bg-red-950 hover:bg-red-900 border border-red-500/40 text-red-300 text-xs font-semibold transition-all flex items-center gap-1.5"
                      >
                        <Zap className="w-3.5 h-3.5 text-red-400" />
                        <span>Ask AI Copilot for Avoidance Plan</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {/* Debris Catalog Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl font-mono text-xs">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            <span>ORBITAL DEBRIS CATALOG ({filteredDebris.length})</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                <th className="py-2.5 px-3">Object Name</th>
                <th className="py-2.5 px-3">NORAD ID</th>
                <th className="py-2.5 px-3">Object Type</th>
                <th className="py-2.5 px-3">Altitude</th>
                <th className="py-2.5 px-3">Inclination</th>
                <th className="py-2.5 px-3">Speed</th>
                <th className="py-2.5 px-3">Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredDebris.map((d) => (
                <tr key={d.id} className="hover:bg-slate-800/60 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-100">{d.name}</td>
                  <td className="py-3 px-3 text-cyan-300">#{d.noradId}</td>
                  <td className="py-3 px-3 text-slate-300">{d.objectType}</td>
                  <td className="py-3 px-3 text-slate-300">{d.altitudeKm} km</td>
                  <td className="py-3 px-3 text-slate-300">{d.inclinationDeg}°</td>
                  <td className="py-3 px-3 text-slate-300">{d.speedKms} km/s</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        d.riskLevel === 'High'
                          ? 'bg-red-950 text-red-400 border-red-500/40'
                          : d.riskLevel === 'Medium'
                          ? 'bg-amber-950 text-amber-400 border-amber-500/40'
                          : 'bg-emerald-950 text-emerald-400 border-emerald-500/40'
                      }`}
                    >
                      {d.riskLevel.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
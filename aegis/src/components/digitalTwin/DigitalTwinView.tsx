import React, { useState } from 'react';
import { Satellite, SatelliteComponent, AIPrediction } from '../../types';
import {
  Zap,
  Battery,
  Thermometer,
  Radio,
  Fuel,
  Cpu,
  Activity,
  AlertTriangle,
  Clock,
  Shield,
  Bot,
  FileText,
  Calendar,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Wrench,
  ChevronRight,
  Info,
  Sliders,
} from 'lucide-react';

interface DigitalTwinViewProps {
  satellites: Satellite[];
  selectedSatellite: Satellite;
  onSelectSatellite: (sat: Satellite) => void;
  onOpenCopilot: (sat: Satellite, initialPrompt?: string) => void;
  onGenerateReport: (sat: Satellite) => void;
  onScheduleMaintenance: (sat: Satellite) => void;
}

export const DigitalTwinView: React.FC<DigitalTwinViewProps> = ({
  satellites,
  selectedSatellite,
  onSelectSatellite,
  onOpenCopilot,
  onGenerateReport,
  onScheduleMaintenance,}) => {
  const [selectedComp, setSelectedComp] = useState<SatelliteComponent | null>(
    selectedSatellite.components[0] || null
  );
  const [activeTab, setActiveTab] = useState<'blueprint' | 'telemetry' | 'predictions' | 'timeline' | 'inspections'>('blueprint');

  const sat = selectedSatellite;
  const tel = sat.telemetry;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 text-slate-100 font-sans">
      {/* Top Spacecraft Selection Header */}
      <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-5 shadow-2xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black font-mono tracking-tight text-white">{sat.name}</h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold border ${
                  sat.status === 'nominal'
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40'
                    : sat.status === 'warning'
                    ? 'bg-amber-950 text-amber-400 border-amber-500/40'
                    : 'bg-red-950 text-red-400 border-red-500/40'
                }`}
              >
                ● DIGITAL TWIN: {sat.status.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              NORAD ID: #{sat.noradId} | Operator: {sat.operator} | Manufacturer: {sat.manufacturer}
            </p>
          </div>
        </div>

        {/* Spacecraft Switcher Dropdown */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-mono text-slate-400">Select Asset:</label>
          <select
            value={sat.id}
            onChange={(e) => {
              const target = satellites.find((s) => s.id === e.target.value);
              if (target) onSelectSatellite(target);
            }}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
          >
            {satellites.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.orbitType})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Primary Telemetry Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono">
        {/* Power */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
          <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
            <span>POWER / BATT</span>
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
          </div>
          <div className="text-lg font-bold text-slate-100">{tel.batteryLevel}%</div>
          <div className="text-[10px] text-slate-400 mt-1">
            Health: <span className="text-emerald-400">{tel.batteryHealth}%</span> | Solar: {tel.solarPanelEfficiency}%
          </div>
        </div>

        {/* Thermal */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
          <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
            <span>THERMAL</span>
            <Thermometer className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-lg font-bold text-amber-300">{tel.internalTemp}°C</div>
          <div className="text-[10px] text-slate-400 mt-1">
            Ext: <span className="text-cyan-300">{tel.externalTemp}°C</span>
          </div>
        </div>

        {/* Comms */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
          <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
            <span>COMMS SIGNAL</span>
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-lg font-bold text-cyan-300">{tel.signalStrength} dBm</div>
          <div className="text-[10px] text-slate-400 mt-1">
            Downlink: <span className="text-emerald-400">{tel.downlinkStatus}</span>
          </div>
        </div>

        {/* Propulsion */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
          <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
            <span>PROPULSION</span>
            <Fuel className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-emerald-300">{tel.fuelRemaining}%</div>
          <div className="text-[10px] text-slate-400 mt-1">
            Thrusters: <span className="text-emerald-400">{tel.thrusterHealth}%</span>
          </div>
        </div>

        {/* Payload */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
          <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
            <span>PAYLOAD</span>
            <Cpu className="w-3.5 h-3.5 text-violet-400" />
          </div>
          <div className="text-lg font-bold text-slate-100">{tel.payloadStatus}</div>
          <div className="text-[10px] text-slate-400 mt-1">
            Sensors: <span className="text-emerald-400">{tel.sensorHealth}%</span>
          </div>
        </div>

        {/* Overall AI Score */}
        <div className="bg-slate-900/80 border border-cyan-500/40 rounded-xl p-3 bg-cyan-950/20">
          <div className="flex items-center justify-between text-cyan-400 text-[10px] mb-1">
            <span>AI HEALTH SCORE</span>
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div
            className={`text-xl font-black ${
              tel.overallHealthScore >= 85
                ? 'text-emerald-400'
                : tel.overallHealthScore >= 70
                ? 'text-amber-400'
                : 'text-red-400'
            }`}
          >
            {tel.overallHealthScore}/100
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            AI Risk Score: <span className="text-red-400">{tel.aiRiskScore}/100</span>
          </div>
        </div>
      </div>

      {/* Main Digital Twin Navigation Tabs */}
      <div className="border-b border-slate-800 flex items-center gap-2 overflow-x-auto font-mono text-xs">
        <button
          onClick={() => setActiveTab('blueprint')}
          className={`px-4 py-2.5 rounded-t-xl border-b-2 font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'blueprint'
              ? 'border-cyan-400 bg-cyan-950/30 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Interactive Component Blueprint</span>
        </button>

        <button
          onClick={() => setActiveTab('predictions')}
          className={`px-4 py-2.5 rounded-t-xl border-b-2 font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'predictions'
              ? 'border-cyan-400 bg-cyan-950/30 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>AI Predictive Engineering ({sat.predictions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-4 py-2.5 rounded-t-xl border-b-2 font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'timeline'
              ? 'border-cyan-400 bg-cyan-950/30 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Historical Timeline ({sat.timeline.length})</span>
        </button>
      </div>

      {/* Tab 1: Interactive Component Blueprint */}
      {activeTab === 'blueprint' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Component Diagram Canvas */}
          <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div className="font-mono text-xs text-cyan-400 font-bold flex items-center gap-2">
                <Sliders className="w-4 h-4" />
                <span>SPACECRAFT COMPONENT LAYOUT DIAGRAM</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Click any component to inspect diagnostics</span>
            </div>

            {/* Stylized Spacecraft Blueprint Representation */}
            <div className="relative w-full h-[360px] bg-slate-950/90 rounded-xl border border-slate-800 flex items-center justify-center p-4">
              {/* Grid Background */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#06b6d4 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              ></div>

              {/* Solar Array Left Wing */}
              <button
                onClick={() =>
                  setSelectedComp(
                    sat.components.find((c) => c.category === 'power') || sat.components[0]
                  )
                }
                className={`absolute left-4 top-1/2 -translate-y-1/2 w-28 h-48 rounded-lg border-2 p-2 flex flex-col justify-between transition-all hover:scale-105 ${
                  selectedComp?.category === 'power'
                    ? 'border-cyan-400 bg-cyan-950/60 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                    : 'border-cyan-500/30 bg-slate-900/80'
                }`}
              >
                <div className="text-[10px] font-mono text-cyan-300 font-bold">SOLAR WING L</div>
                <div className="grid grid-cols-2 gap-1 my-2">
                  <div className="h-6 bg-cyan-900/40 rounded border border-cyan-500/20"></div>
                  <div className="h-6 bg-cyan-900/40 rounded border border-cyan-500/20"></div>
                  <div className="h-6 bg-cyan-900/40 rounded border border-cyan-500/20"></div>
                  <div className="h-6 bg-cyan-900/40 rounded border border-cyan-500/20"></div>
                </div>
                <div className="text-[9px] font-mono text-emerald-400">91% Eff</div>
              </button>

              {/* Central Spacecraft Bus Body */}
              <div className="relative w-48 h-56 bg-slate-900/90 border-2 border-slate-700 rounded-2xl p-3 flex flex-col items-center justify-between shadow-2xl z-10">
                {/* Antenna Dish Top */}
                <button
                  onClick={() =>
                    setSelectedComp(
                      sat.components.find((c) => c.category === 'comms') || sat.components[0]
                    )
                  }
                  className="w-24 h-10 -mt-6 bg-slate-800 border-2 border-cyan-500/50 rounded-t-full flex items-center justify-center hover:border-cyan-400 transition-all cursor-pointer"
                >
                  <Radio className="w-4 h-4 text-cyan-400" />
                </button>

                {/* Central Bus Core (Payload & Battery) */}
                <div className="w-full space-y-2 text-center my-auto">
                  <button
                    onClick={() =>
                      setSelectedComp(
                        sat.components.find((c) => c.category === 'payload') || sat.components[0]
                      )
                    }
                    className="w-full py-1.5 px-2 bg-slate-800 border border-slate-700 rounded-lg text-[10px] font-mono text-slate-200 hover:border-cyan-400 transition-all"
                  >
                    Optical Payload Pod
                  </button>

                  <button
                    onClick={() =>
                      setSelectedComp(
                        sat.components.find((c) => c.category === 'power') || sat.components[0]
                      )
                    }
                    className="w-full py-1.5 px-2 bg-slate-800 border border-slate-700 rounded-lg text-[10px] font-mono text-slate-200 hover:border-amber-400 transition-all"
                  >
                    Li-Ion Power Modules
                  </button>
                </div>

                {/* Hydrazine Thrusters Bottom */}
                <button
                  onClick={() =>
                    setSelectedComp(
                      sat.components.find((c) => c.category === 'propulsion') || sat.components[0]
                    )
                  }
                  className="w-20 h-8 -mb-4 bg-slate-800 border-2 border-emerald-500/50 rounded-b-lg flex items-center justify-center gap-1 hover:border-emerald-400 transition-all cursor-pointer"
                >
                  <Fuel className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[9px] font-mono text-emerald-300">RCS Thrusters</span>
                </button>
              </div>

              {/* Solar Array Right Wing */}
              <button
                onClick={() =>
                  setSelectedComp(
                    sat.components.find((c) => c.category === 'power') || sat.components[0]
                  )
                }
                className={`absolute right-4 top-1/2 -translate-y-1/2 w-28 h-48 rounded-lg border-2 p-2 flex flex-col justify-between transition-all hover:scale-105 ${
                  selectedComp?.category === 'power'
                    ? 'border-cyan-400 bg-cyan-950/60 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                    : 'border-cyan-500/30 bg-slate-900/80'
                }`}
              >
                <div className="text-[10px] font-mono text-cyan-300 font-bold">SOLAR WING R</div>
                <div className="grid grid-cols-2 gap-1 my-2">
                  <div className="h-6 bg-cyan-900/40 rounded border border-cyan-500/20"></div>
                  <div className="h-6 bg-cyan-900/40 rounded border border-cyan-500/20"></div>
                  <div className="h-6 bg-cyan-900/40 rounded border border-cyan-500/20"></div>
                  <div className="h-6 bg-cyan-900/40 rounded border border-cyan-500/20"></div>
                </div>
                <div className="text-[9px] font-mono text-emerald-400">91% Eff</div>
              </button>
            </div>

            {/* Quick Component Selection Pills */}
            <div className="mt-4 flex flex-wrap gap-2">
              {sat.components.map((comp) => (
                <button
                  key={comp.id}
                  onClick={() => setSelectedComp(comp)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all flex items-center gap-1.5 ${
                    selectedComp?.id === comp.id
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      comp.status === 'Nominal'
                        ? 'bg-emerald-400'
                        : comp.status === 'Warning'
                        ? 'bg-amber-400'
                        : 'bg-red-400'
                    }`}
                  ></span>
                  <span>{comp.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Component Diagnostics Detail Inspector */}
          <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col justify-between">
            {selectedComp ? (
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">{selectedComp.category} subsystem</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                        selectedComp.status === 'Nominal'
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30'
                          : selectedComp.status === 'Warning'
                          ? 'bg-amber-950 text-amber-400 border-amber-500/30'
                          : 'bg-red-950 text-red-400 border-red-500/30'
                      }`}
                    >
                      {selectedComp.status.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">{selectedComp.name}</h3>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{selectedComp.description}</p>

                {/* Metrics Breakdown */}
                <div className="space-y-2.5 font-mono text-xs">
                  <div className="flex items-center justify-between p-2 rounded bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400">Health Rating</span>
                    <span className="font-bold text-emerald-400">{selectedComp.healthPercent}%</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400">Operating Temp</span>
                    <span className="font-bold text-amber-300">{selectedComp.temperature}°C</span>
                  </div>

                  {selectedComp.voltageCurrent && (
                    <div className="flex items-center justify-between p-2 rounded bg-slate-950/80 border border-slate-800">
                      <span className="text-slate-400">Voltage / Signal</span>
                      <span className="font-bold text-cyan-300">{selectedComp.voltageCurrent}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-2 rounded bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400">Wear & Friction</span>
                    <span className="font-bold text-slate-300">{selectedComp.wearPercent}%</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400">AI Failure Risk</span>
                    <span
                      className={`font-bold ${
                        selectedComp.predictedFailureRisk === 'Low'
                          ? 'text-emerald-400'
                          : selectedComp.predictedFailureRisk === 'Moderate'
                          ? 'text-amber-400'
                          : 'text-red-400'
                      }`}
                    >
                      {selectedComp.predictedFailureRisk.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Quick Action Buttons for this component */}
                <div className="pt-4 border-t border-slate-800 space-y-2">
                  <button
                    onClick={() =>
                      onOpenCopilot(
                        sat,
                        `Why is component "${selectedComp.name}" at failure risk level ${selectedComp.predictedFailureRisk}?`
                      )
                    }
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-semibold transition-all"
                  >
                    <Bot className="w-4 h-4 text-cyan-400" />
                    <span>Ask AEGIS Copilot About Component</span>
                  </button>

                  <button
                    onClick={() => onScheduleMaintenance(sat)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-mono text-xs font-semibold transition-all"
                  >
                    <Wrench className="w-4 h-4 text-emerald-400" />
                    <span>Schedule Component Servicing</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs">
                Select a component from the diagram or list to view diagnostics.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: AI Predictive Engineering */}
      {activeTab === 'predictions' && (
        <div className="space-y-4 font-sans">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold font-mono text-slate-100 flex items-center gap-2">
                  <Bot className="w-5 h-5 text-cyan-400" />
                  <span>AI PREDICTIVE SUBSYSTEM HEALTH SCAN</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Machine reasoning based on simulated telemetry trendlines and lattice physics.
                </p>
              </div>

              <button
                onClick={() => onGenerateReport(sat)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-mono text-xs font-semibold shadow-lg hover:brightness-110 transition-all"
              >
                <FileText className="w-4 h-4" />
                <span>Generate Full Inspection Report</span>
              </button>
            </div>

            <div className="space-y-4">
              {sat.predictions.map((pred) => (
                <div
                  key={pred.id}
                  className={`p-4 rounded-xl border font-mono text-xs transition-all ${
                    pred.urgency === 'critical'
                      ? 'bg-red-950/30 border-red-500/50 text-slate-200'
                      : pred.urgency === 'high'
                      ? 'bg-amber-950/30 border-amber-500/50 text-slate-200'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2 mb-2">
                    <div className="font-bold text-sm text-cyan-300">{pred.subsystem}</div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-400 text-[11px]">
                        AI Confidence: {pred.confidenceScore}%
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                          pred.urgency === 'critical'
                            ? 'bg-red-900 text-red-200'
                            : pred.urgency === 'high'
                            ? 'bg-amber-900 text-amber-200'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        Urgency: {pred.urgency}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 font-semibold block mb-1">Time to Failure Prediction:</span>
                      <span className="text-amber-400 font-bold text-sm">{pred.estimatedTimeToFailure}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-semibold block mb-1">Engineering Explanation:</span>
                      <p className="text-slate-300 font-sans leading-relaxed">{pred.explanation}</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-start justify-between gap-4">
                    <div>
                      <span className="text-emerald-400 font-semibold">Recommended Maintenance: </span>
                      <span className="text-slate-200 font-sans">{pred.recommendedAction}</span>
                    </div>

                    <button
                      onClick={() => onScheduleMaintenance(sat)}
                      className="shrink-0 px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition-all flex items-center gap-1.5"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>Schedule Action</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Historical Timeline */}
      {activeTab === 'timeline' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl font-mono text-xs space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" />
              <span>SPACECRAFT LIFECYCLE TIMELINE</span>
            </h3>
            <span className="text-slate-400">{sat.timeline.length} recorded major events</span>
          </div>

          <div className="relative pl-6 border-l-2 border-cyan-500/30 space-y-6 my-4">
            {sat.timeline.map((evt) => (
              <div key={evt.id} className="relative group">
                {/* Node marker */}
                <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-slate-900 border-2 border-cyan-400 group-hover:scale-125 transition-transform"></div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-cyan-500/40 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-cyan-400 font-bold text-sm">{evt.title}</span>
                    <span className="text-slate-500 text-[11px]">{evt.date}</span>
                  </div>
                  <p className="text-slate-300 font-sans text-xs leading-relaxed">{evt.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
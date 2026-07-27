import React from 'react';
import { Shield, Zap, Radio, Wrench, Layers, Bot, Globe, ChevronRight } from 'lucide-react';

interface TitanValeEcosystemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TitanValeEcosystemModal: React.FC<TitanValeEcosystemModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const products = [
    {
      name: 'AEGIS',
      tagline: 'AI Mission Intelligence Platform',
      icon: Shield,
      status: 'LIVE / CURRENT CORE',
      color: 'border-cyan-500 text-cyan-400 bg-cyan-950/40',
      description: 'Central operational control combining satellite mission planning, orbital visualization, Digital Twins, health monitoring, and AI predictive engineering.',
    },
    {
      name: 'Sentinel',
      tagline: 'Autonomous Orbital Inspection Vehicle',
      icon: Radio,
      status: 'DEVELOPMENT PHASE',
      color: 'border-blue-500 text-blue-400 bg-blue-950/40',
      description: 'Autonomous close-proximity inspection spacecraft equipped with high-resolution LIDAR and multispectral imaging arrays.',
    },
    {
      name: 'Forge',
      tagline: 'Satellite Servicing Spacecraft',
      icon: Wrench,
      status: 'DEVELOPMENT PHASE',
      color: 'border-emerald-500 text-emerald-400 bg-emerald-950/40',
      description: 'Orbital servicing vehicle designed for in-orbit refueling, battery module replacements, sensor recalibrations, and hardware upgrades.',
    },
    {
      name: 'Atlas',
      tagline: 'Orbital Logistics Vehicle',
      icon: Layers,
      status: 'CONCEPT PHASE',
      color: 'border-violet-500 text-violet-400 bg-violet-950/40',
      description: 'Space tug and orbital propellant depot network transporting payloads between LEO, MEO, and GEO orbital planes.',
    },
    {
      name: 'TitanDock',
      tagline: 'Autonomous Docking System',
      icon: Zap,
      status: 'PROTOTYPE TESTING',
      color: 'border-amber-500 text-amber-400 bg-amber-950/40',
      description: 'Universal magnetic and mechanical docking mechanism enabling autonomous uncooperative spacecraft capture.',
    },
    {
      name: 'TitanTwin',
      tagline: 'Fleet-wide Digital Twin Analytics',
      icon: Bot,
      status: 'INTEGRATED IN AEGIS',
      color: 'border-cyan-500 text-cyan-300 bg-cyan-950/40',
      description: 'Continuous physics-based digital twin engine evaluating subsystem lattice state and remaining operational lifespan.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto space-y-6 text-slate-100 font-sans">
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
              <Zap className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-mono text-white">TITANVALE TECHNOLOGIES ECOSYSTEM</h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Connecting intelligence, inspection, servicing, and logistics for sustainable space infrastructure.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 text-base font-mono">
            ✕
          </button>
        </div>

        {/* Vision Statement */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs leading-relaxed text-slate-300">
          <span className="font-bold font-mono text-cyan-400 block uppercase">TITANVALE LONG-TERM VISION</span>
          <p>
            "Today, AEGIS demonstrates how AI-powered Digital Twins can transform raw satellite telemetry into actionable engineering intelligence. In the future, the same platform will become the command center for autonomous robotic spacecraft that inspect, service, upgrade, and extend the operational life of satellites across orbital space."
          </p>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.name} className={`p-4 rounded-xl border ${p.color} space-y-2 font-mono text-xs`}>
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span className="font-bold text-sm text-white font-sans">{p.name}</span>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-950 border border-white/10">
                    {p.status}
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-slate-300">{p.tagline}</div>
                <p className="text-[11px] font-sans text-slate-400 leading-relaxed">{p.description}</p>
              </div>
            );
          })}
        </div>

        <div className="pt-2 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-mono text-xs font-bold shadow-lg"
          >
            Close Ecosystem Overview
          </button>
        </div>
      </div>
    </div>
  );
};
import { ShieldAlert, ShieldCheck, ShieldX, BrainCircuit } from "lucide-react";

import { useMemo } from "react";

import { generateMissionReport } from "../../services/missionCommander";

import { useTelemetryStore } from "../../store/telemetryStore";

export default function MissionCommanderCard() {
  const telemetry = useTelemetryStore(
    (state) => state.telemetry
  );

  const report = useMemo(() => {
    if (!telemetry) return null;

    return generateMissionReport(telemetry);
  }, [telemetry]);

  if (!report) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-slate-300">
        Loading Mission Commander...
      </div>
    );
  }

  const riskStyles = {
    Low: {
      color: "text-emerald-400",
      badge: "bg-emerald-500/20 text-emerald-300",
      icon: <ShieldCheck size={22} />,
    },

    Moderate: {
      color: "text-amber-400",
      badge: "bg-amber-500/20 text-amber-300",
      icon: <ShieldAlert size={22} />,
    },

    High: {
      color: "text-orange-400",
      badge: "bg-orange-500/20 text-orange-300",
      icon: <ShieldAlert size={22} />,
    },

    Critical: {
      color: "text-red-400",
      badge: "bg-red-500/20 text-red-300",
      icon: <ShieldX size={22} />,
    },
  };

  const style = riskStyles[report.risk];

  return (
    <section className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-xl">

      {/* Header */}

      <div className="mb-6 flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="rounded-full bg-cyan-500/20 p-3 text-cyan-400">
            <BrainCircuit size={28} />
          </div>

          <div>

            <h2 className="text-xl font-bold text-white">
              Mission Commander
            </h2>

            <p className="text-sm text-slate-400">
              AI Engineering Assessment
            </p>

          </div>

        </div>

        <div
          className={`rounded-full px-4 py-2 font-semibold ${style.badge}`}
        >
          {report.risk}
        </div>

      </div>

      {/* Status */}

      <div className="mb-6 flex items-center gap-3">

        <div className={style.color}>
          {style.icon}
        </div>

        <h3 className={`text-2xl font-bold ${style.color}`}>
          {report.title}
        </h3>

      </div>

      {/* Summary */}

      <div className="mb-6 rounded-lg border border-slate-800 bg-slate-900/60 p-4">

        <p className="leading-7 text-slate-300">
          {report.summary}
        </p>

      </div>

      {/* Recommendation */}

      <div className="mb-6 rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-4">

        <h4 className="mb-2 font-semibold text-cyan-400">
          Recommended Action
        </h4>

        <p className="text-slate-300">
          {report.recommendation}
        </p>

      </div>

      {/* Footer */}

      <div className="grid grid-cols-2 gap-6">

        <div>

          <p className="text-sm text-slate-500">
            Mission Health
          </p>

          <p className="text-3xl font-bold text-white">
            {report.missionHealth}%
          </p>

        </div>

        <div>

          <p className="text-sm text-slate-500">
            AI Confidence
          </p>

          <p className="text-3xl font-bold text-cyan-400">
            {report.confidence}%
          </p>

        </div>

      </div>

    </section>
  );
}
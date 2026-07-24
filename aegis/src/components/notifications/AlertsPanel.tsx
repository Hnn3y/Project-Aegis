import {
  AlertTriangle,
  AlertCircle,
  Info,
} from "lucide-react";

import { useTelemetryStore } from "../../store/telemetryStore";

export default function AlertsPanel() {
  const alerts = useTelemetryStore(
    (state) => state.telemetry.alerts
  );

  const getIcon = (severity: string) => {
    switch (severity) {
      case "Critical":
        return (
          <AlertCircle
            size={20}
            className="text-red-500"
          />
        );

      case "Warning":
        return (
          <AlertTriangle
            size={20}
            className="text-amber-400"
          />
        );

      default:
        return (
          <Info
            size={20}
            className="text-cyan-400"
          />
        );
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">

      <div className="mb-5 flex items-center justify-between">

        <h2 className="text-lg font-semibold text-white">
          Engineering Alerts
        </h2>

        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
          {alerts.length}
        </span>

      </div>

      {alerts.length === 0 ? (
        <div className="rounded-xl border border-emerald-800 bg-emerald-950/40 p-4">

          <p className="text-sm text-emerald-400">
            ✅ No active engineering alerts.
          </p>

        </div>
      ) : (
        <div className="space-y-4">

          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="rounded-xl border border-slate-800 bg-slate-950 p-4"
            >
              <div className="flex items-start gap-3">

                {getIcon(alert.severity)}

                <div className="flex-1">

                  <div className="flex items-center justify-between">

                    <h3 className="font-medium text-white">
                      {alert.title}
                    </h3>

                    <span
                      className={`
                        rounded-full px-2 py-1 text-xs

                        ${
                          alert.severity === "Critical"
                            ? "bg-red-500/20 text-red-400"

                            : alert.severity === "Warning"
                            ? "bg-amber-500/20 text-amber-300"

                            : "bg-cyan-500/20 text-cyan-300"
                        }
                      `}
                    >
                      {alert.severity}
                    </span>

                  </div>

                  <p className="mt-2 text-sm text-slate-400">
                    {alert.description}
                  </p>

                  <p className="mt-3 text-xs text-slate-500">
                    {new Date(
                      alert.createdAt
                    ).toLocaleString()}
                  </p>

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}
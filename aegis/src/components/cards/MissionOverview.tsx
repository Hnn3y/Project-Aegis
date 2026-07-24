import {
  Activity,
  BatteryCharging,
  Fuel,
  ShieldAlert,
  Satellite,
  Wrench,
} from "lucide-react";

import KPICard from "./KPICard";
import { useTelemetryStore } from "../../store/telemetryStore";

export default function MissionOverview() {
  const telemetry = useTelemetryStore(
    (state) => state.telemetry
  );

  return (
    <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

      <KPICard
        title="Mission Health"
        value={`${telemetry.aiHealth.overall}%`}
        subtitle="AI Overall Health Score"
        icon={<Activity size={34} />}
        color="text-emerald-400"
      />

      <KPICard
        title="Battery Health"
        value={`${telemetry.power.battery.health}%`}
        subtitle={`${telemetry.power.battery.level.toFixed(1)}% Remaining`}
        icon={<BatteryCharging size={34} />}
        color="text-cyan-400"
      />

      <KPICard
        title="Fuel Remaining"
        value={`${telemetry.propulsion.fuelRemaining.toFixed(1)}%`}
        subtitle="Propulsion System"
        icon={<Fuel size={34} />}
        color="text-emerald-400"
      />

      <KPICard
        title="Signal Strength"
        value={`${telemetry.communication.signalStrength.toFixed(0)}%`}
        subtitle="Communications"
        icon={<Satellite size={34} />}
        color="text-violet-400"
      />

      <KPICard
        title="Engineering Alerts"
        value={telemetry.alerts.length}
        subtitle="Active Alerts"
        icon={<ShieldAlert size={34} />}
        color="text-red-400"
      />

      <KPICard
        title="Predictions"
        value={telemetry.predictions.length}
        subtitle="AI Maintenance Insights"
        icon={<Wrench size={34} />}
        color="text-amber-400"
      />

    </section>
  );
}
import TelemetryChart from "./TelemetryChart";
import { useTelemetryStore } from "../../store/telemetryStore";

export default function FuelChart() {
  const history = useTelemetryStore(
    (state) => state.history
  );

  return (
    <TelemetryChart
      title="Fuel Remaining"
      data={history as unknown as Record<string, unknown>[]}
      dataKey="fuel"
      stroke="#10b981"
      unit="%"
    />
  );
}
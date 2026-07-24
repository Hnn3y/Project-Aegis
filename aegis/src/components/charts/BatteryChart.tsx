import TelemetryChart from "./TelemetryChart";
import { useTelemetryStore } from "../../store/telemetryStore";

export default function BatteryChart() {
  const history = useTelemetryStore(
    (state) => state.history
  );

  return (
    <TelemetryChart
      title="Battery Level"
      data={history as unknown as Record<string, unknown>[]}
      dataKey="battery"
      stroke="#06b6d4"
      unit="%"
    />
  );
}
import TelemetryChart from "./TelemetryChart";
import { useTelemetryStore } from "../../store/telemetryStore";

export default function SignalStrengthChart() {
  const history = useTelemetryStore(
    (state) => state.history
  );

  return (
    <TelemetryChart
      title="Signal Strength"
      data={history as unknown as Record<string, unknown>[]}
      dataKey="signal"
      stroke="#8b5cf6"
      unit="%"
    />
  );
}
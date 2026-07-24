import TelemetryChart from "./TelemetryChart";
import { useTelemetryStore } from "../../store/telemetryStore";

export default function ThermalChart() {
  const history = useTelemetryStore(
    (state) => state.history
  );

  return (
    <TelemetryChart
      title="Internal Temperature"
      data={history as unknown as Record<string, unknown>[]}
      dataKey="temperature"
      stroke="#f97316"
      unit="°C"
    />
  );
}
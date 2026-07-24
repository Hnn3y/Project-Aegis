import TelemetryChart from "./TelemetryChart";
import { useTelemetryStore } from "../../store/telemetryStore";

export default function MissionHealthChart() {
  const history = useTelemetryStore(
    (state) => state.history
  );

  return (
    <TelemetryChart
      title="AI Mission Health Score"
      data={history as unknown as Record<string, unknown>[]}
      dataKey="missionHealth"
      stroke="#22c55e"
      unit="%"
    />
  );
}
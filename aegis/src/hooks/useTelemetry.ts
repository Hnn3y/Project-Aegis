import { useEffect } from "react";

import { useTelemetryStore } from "../store/telemetryStore";

export default function useTelemetry() {
  const startSimulation =
    useTelemetryStore(
      (state) => state.startSimulation
    );

  const stopSimulation =
    useTelemetryStore(
      (state) => state.stopSimulation
    );

  useEffect(() => {
    startSimulation();

    return () => stopSimulation();
  }, [startSimulation, stopSimulation]);
}
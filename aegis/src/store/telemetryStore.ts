import { create } from "zustand";

import type {
  SatelliteTelemetry,
  TelemetryHistoryPoint,
} from "../types/telemetry";

import {
  getTelemetry,
  getTelemetryHistory,
  simulateTelemetry,
} from "../services/mockTelemetry";

interface TelemetryState {
  telemetry: SatelliteTelemetry;

  history: TelemetryHistoryPoint[];

  connected: boolean;

  lastUpdated: string;

  startSimulation: () => void;

  stopSimulation: () => void;

  refresh: () => void;
}

let simulationTimer: ReturnType<typeof setInterval> | null = null;

export const useTelemetryStore =
  create<TelemetryState>((set) => ({
    telemetry: getTelemetry(),

    history: getTelemetryHistory(),

    connected: true,

    lastUpdated: new Date().toISOString(),

    refresh: () => {
      const updatedTelemetry = simulateTelemetry();

      set({
        telemetry: updatedTelemetry,

        history: [...getTelemetryHistory()],

        lastUpdated: new Date().toISOString(),
      });
    },

    startSimulation: () => {
      if (simulationTimer) return;

      simulationTimer = setInterval(() => {
        const updatedTelemetry = simulateTelemetry();

        set({
          telemetry: updatedTelemetry,

          history: [...getTelemetryHistory()],

          connected: true,

          lastUpdated: new Date().toISOString(),
        });
      }, 5000);
    },

    stopSimulation: () => {
      if (simulationTimer) {
        clearInterval(simulationTimer);

        simulationTimer = null;

        set({
          connected: false,
        });
      }
    },
  }));
import type {
  SatelliteTelemetry,
  TelemetryHistoryPoint,
  TelemetryAlert,
} from "../types/telemetry";
/* ==========================================================
   Utility Functions
========================================================== */


const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const randomBetween = (min: number, max: number) =>
  Math.random() * (max - min) + min;

const drift = (
  value: number,
  amount: number,
  min: number,
  max: number
) => {
  return clamp(
    value + randomBetween(-amount, amount),
    min,
    max
  );
};

/* ==========================================================
   Initial Telemetry
========================================================== */

let telemetry: SatelliteTelemetry = {
  satelliteId: "SAT-001",

  satelliteName: "Titan-Alpha",

  operator: "TitanVale Technologies",

  manufacturer: "TitanVale Aerospace",

  missionAge: 415,

  remainingLife: 2875,

  timestamp: new Date().toISOString(),

  position: {
    latitude: 4.52,
    longitude: 12.80,
    altitude: 550,
  },

  velocity: {
    x: 7.64,
    y: -2.13,
    z: 0.83,
  },

  orbit: {
    type: "LEO",
    inclination: 97.4,
    altitude: 550,
    period: 96,
    eccentricity: 0.001,
  },

  power: {
    availablePower: 4.8,
    consumedPower: 3.4,

    battery: {
      level: 96,
      health: 98,
      voltage: 28,
      current: 4.2,
      temperature: 22,
      charging: true,
      estimatedCycles: 104,
    },

    solar: {
      efficiency: 97,
      powerGenerated: 5.3,
      panelTemperature: 35,
      degradation: 2,
    },
  },

  thermal: {
    internalTemperature: 26,
    externalTemperature: -42,
    warning: false,
    heaterEnabled: false,
  },

  propulsion: {
    fuelRemaining: 82,
    fuelConsumption: 0.12,
    thrusterHealth: 95,
    lastBurn: new Date().toISOString(),
  },

  communication: {
    signalStrength: 97,
    uplink: true,
    downlink: true,
    latency: 240,
    packetsLost: 0,
  },

  payload: {
    status: "Healthy",
    sensorsHealthy: 8,
    activeSensors: 8,
    payloadTemperature: 18,
  },

  environment: {
    radiation: 1.4,
    magneticField: 31,
    solarWind: 418,
    debrisDensity: 6,
  },

  aiHealth: {
    power: 98,
    thermal: 95,
    communication: 99,
    propulsion: 96,
    payload: 98,
    orbitalSafety: 94,
    overall: 97,
  },

  predictions: [],

  alerts: [],
};

/* ==========================================================
   History
========================================================== */

const history: TelemetryHistoryPoint[] = [];

/* ==========================================================
   Prediction Generator
========================================================== */

function buildPredictions() {
  return [
    {
      subsystem: "Battery",

      confidence: 97,

      estimatedFailureDays: 860,

      recommendation:
        "Continue normal monitoring.",

      explanation:
        "Battery degradation remains within expected operational limits.",
    },

    {
      subsystem: "Thrusters",

      confidence: 91,

      estimatedFailureDays: 520,

      recommendation:
        "Inspect after next orbital maneuver.",

      explanation:
        "Minor efficiency decrease detected.",
    },
  ];
}

/* ==========================================================
   Alert Generator
========================================================== */

function buildAlerts(): TelemetryAlert[] {
  const alerts: TelemetryAlert[] = [];

  if (telemetry.power.battery.level < 30) {
    alerts.push({
      id: crypto.randomUUID(),

      title: "Battery Low",

      description:
        "Battery level has dropped below operational threshold.",

      severity: "Warning",

      createdAt: new Date().toISOString(),

      acknowledged: false,
    });
  }

  if (
    telemetry.propulsion.fuelRemaining < 20
  ) {
    alerts.push({
      id: crypto.randomUUID(),

      title: "Fuel Low",

      description:
        "Remaining fuel reserves are becoming critical.",

      severity: "Critical",

      createdAt: new Date().toISOString(),

      acknowledged: false,
    });
  }

  return alerts;
}

/* ==========================================================
   Simulation Engine
========================================================== */

export function simulateTelemetry() {
  telemetry.power.battery.level = drift(
    telemetry.power.battery.level,
    0.3,
    15,
    100
  );

  telemetry.power.battery.health = drift(
    telemetry.power.battery.health,
    0.02,
    80,
    100
  );

  telemetry.power.solar.efficiency = drift(
    telemetry.power.solar.efficiency,
    0.05,
    85,
    100
  );

  telemetry.thermal.internalTemperature =
    drift(
      telemetry.thermal.internalTemperature,
      0.4,
      18,
      42
    );

  telemetry.communication.signalStrength =
    drift(
      telemetry.communication.signalStrength,
      0.4,
      70,
      100
    );

  telemetry.propulsion.fuelRemaining =
    drift(
      telemetry.propulsion.fuelRemaining,
      0.02,
      5,
      100
    );

  telemetry.aiHealth.overall =
    Math.round(
      (
        telemetry.power.battery.health +
        telemetry.power.solar.efficiency +
        telemetry.communication.signalStrength +
        telemetry.propulsion.thrusterHealth
      ) / 4
    );

  telemetry.timestamp =
    new Date().toISOString();

  telemetry.predictions =
    buildPredictions();

  telemetry.alerts = buildAlerts();

  history.push({
    timestamp: new Date().toLocaleTimeString(),

    battery:
      telemetry.power.battery.level,

    fuel:
      telemetry.propulsion.fuelRemaining,

    temperature:
      telemetry.thermal.internalTemperature,

    signal:
      telemetry.communication.signalStrength,

    missionHealth:
      telemetry.aiHealth.overall,
  });

  if (history.length > 50) {
    history.shift();
  }

  return telemetry;
}

/* ==========================================================
   API
========================================================== */

export function getTelemetry() {
  return telemetry;
}

export function getTelemetryHistory() {
  return history;
}
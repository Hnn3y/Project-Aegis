/* ============================================
   AEGIS Mission Intelligence Platform
   Telemetry Type Definitions
============================================ */

export type OrbitType =
  | "LEO"
  | "MEO"
  | "GEO"
  | "Polar"
  | "Sun Synchronous";

export type ComponentHealth =
  | "Healthy"
  | "Warning"
  | "Critical";

export interface Position3D {
  latitude: number;
  longitude: number;
  altitude: number; // km
}

export interface Velocity3D {
  x: number;
  y: number;
  z: number;
}

export interface OrbitInformation {
  type: OrbitType;

  inclination: number;

  altitude: number;

  period: number;

  eccentricity: number;
}

export interface BatteryTelemetry {
  level: number;

  health: number;

  voltage: number;

  current: number;

  temperature: number;

  charging: boolean;

  estimatedCycles: number;
}

export interface SolarTelemetry {
  efficiency: number;

  powerGenerated: number;

  panelTemperature: number;

  degradation: number;
}

export interface ThermalTelemetry {
  internalTemperature: number;

  externalTemperature: number;

  warning: boolean;

  heaterEnabled: boolean;
}

export interface PropulsionTelemetry {
  fuelRemaining: number;

  fuelConsumption: number;

  thrusterHealth: number;

  lastBurn: string;
}

export interface CommunicationTelemetry {
  signalStrength: number;

  uplink: boolean;

  downlink: boolean;

  latency: number;

  packetsLost: number;
}

export interface PayloadTelemetry {
  status: ComponentHealth;

  sensorsHealthy: number;

  activeSensors: number;

  payloadTemperature: number;
}

export interface PowerTelemetry {
  availablePower: number;

  consumedPower: number;

  battery: BatteryTelemetry;

  solar: SolarTelemetry;
}

export interface EnvironmentTelemetry {
  radiation: number;

  magneticField: number;

  solarWind: number;

  debrisDensity: number;
}

export interface AIHealthScores {
  power: number;

  thermal: number;

  communication: number;

  propulsion: number;

  payload: number;

  orbitalSafety: number;

  overall: number;
}

export interface TelemetryPrediction {
  subsystem: string;

  confidence: number;

  estimatedFailureDays: number;

  recommendation: string;

  explanation: string;
}

export interface TelemetryAlert {
  id: string;

  title: string;

  description: string;

  severity: "Info" | "Warning" | "Critical";

  createdAt: string;

  acknowledged: boolean;
}

export interface SatelliteTelemetry {
  satelliteId: string;

  satelliteName: string;

  operator: string;

  manufacturer: string;

  missionAge: number;

  remainingLife: number;

  position: Position3D;

  velocity: Velocity3D;

  orbit: OrbitInformation;

  power: PowerTelemetry;

  thermal: ThermalTelemetry;

  propulsion: PropulsionTelemetry;

  communication: CommunicationTelemetry;

  payload: PayloadTelemetry;

  environment: EnvironmentTelemetry;

  aiHealth: AIHealthScores;

  predictions: TelemetryPrediction[];

  alerts: TelemetryAlert[];

  timestamp: string;
}

export interface TelemetryHistoryPoint {
  timestamp: string;

  battery: number;

  fuel: number;

  temperature: number;

  signal: number;

  missionHealth: number;
}

export interface DashboardStatistics {
  activeSatellites: number;

  activeMissions: number;

  healthySatellites: number;

  warningSatellites: number;

  criticalSatellites: number;

  collisionAlerts: number;

  maintenanceQueue: number;

  trackedDebris: number;
}

export const TEST_EXPORT = true;
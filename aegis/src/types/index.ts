export type OrbitType = 'LEO' | 'MEO' | 'GEO' | 'Polar' | 'Sun Synchronous';

export type SpacecraftStatus = 'nominal' | 'warning' | 'critical' | 'decommissioned';

export type UserRole = 'admin' | 'mission_controller' | 'systems_engineer' | 'analyst' | 'read_only';

export interface TelemetryData {
  batteryLevel: number; // %
  batteryHealth: number; // %
  solarPanelEfficiency: number; // %
  currentPowerConsumption: number; // Watts
  internalTemp: number; // °C
  externalTemp: number; // °C
  signalStrength: number; // dBm
  uplinkStatus: 'Connected' | 'Degraded' | 'Offline';
  downlinkStatus: 'Connected' | 'Degraded' | 'Offline';
  fuelRemaining: number; // %
  thrusterHealth: number; // %
  payloadStatus: 'Nominal' | 'Calibrating' | 'Anomaly' | 'Standby';
  sensorHealth: number; // %
  missionAgeDays: number;
  remainingLifespanDays: number;
  overallHealthScore: number; // 0-100
  aiRiskScore: number; // 0-100
}

export interface SatelliteComponent {
  id: string;
  name: string;
  category: 'power' | 'payload' | 'propulsion' | 'comms' | 'thermal' | 'avionics';
  status: 'Nominal' | 'Warning' | 'Critical';
  healthPercent: number;
  temperature: number;
  voltageCurrent?: string;
  wearPercent: number;
  lastServicedDate: string;
  predictedFailureRisk: 'Low' | 'Moderate' | 'High' | 'Severe';
  description: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  type: 'launch' | 'orbit_insertion' | 'payload_activation' | 'inspection' | 'anomaly' | 'repair' | 'replacement' | 'maneuver';
  title: string;
  description: string;
  status: 'completed' | 'scheduled' | 'investigating';
}

export interface AIPrediction {
  id: string;
  subsystem: string;
  confidenceScore: number; // e.g., 94%
  estimatedTimeToFailure: string; // e.g. "45 days", "12 months"
  explanation: string;
  recommendedAction: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

export interface Satellite {
  id: string;
  noradId: number;
  name: string;
  operator: string;
  manufacturer: string;
  launchDate: string;
  orbitType: OrbitType;
  missionType: string;
  status: SpacecraftStatus;
  position: {
    lat: number;
    lng: number;
    altitudeKm: number;
    inclinationDeg: number;
    velocityKms: number;
  };
  telemetry: TelemetryData;
  components: SatelliteComponent[];
  timeline: TimelineEvent[];
  predictions: AIPrediction[];
  inspectionReportsCount: number;
  maintenancePriority: 'Low' | 'Medium' | 'High' | 'Immediate';
}

export interface DebrisObject {
  id: string;
  noradId: number;
  name: string;
  objectType: 'Rocket Body' | 'Fragment' | 'Inactive Satellite' | 'Debris Cloud';
  altitudeKm: number;
  inclinationDeg: number;
  riskLevel: 'High' | 'Medium' | 'Low';
  position: {
    lat: number;
    lng: number;
    alt: number;
  };
  speedKms: number;
  conjunctionTargetId?: string;
  conjunctionTargetName?: string;
  conjunctionDistanceKm?: number;
  tcaHours?: number;
  collisionProbabilityPercent?: number;
}

export interface MissionPlan {
  id: string;
  missionName: string;
  satelliteName: string;
  operator: string;
  launchDate: string;
  missionObjective: string;
  orbitType: OrbitType;
  payloadType: string;
  payloadMassKg: number;
  missionDurationMonths: number;
  expectedLifespanYears: number;
  status: 'draft' | 'evaluating' | 'approved' | 'scheduled' | 'launched';
  aiEvaluation?: {
    estimatedRiskScore: number; // 0-100
    expectedLifespanYears: number;
    orbitalCongestionLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
    collisionProbabilityPercent: number;
    fuelEfficiencyRating: 'A' | 'B' | 'C' | 'D';
    feasibilityScore: number; // 0-100
    recommendations: string[];
    riskContributors: string[];
  };
}

export interface MaintenanceTask {
  id: string;
  satelliteId: string;
  satelliteName: string;
  title: string;
  subsystem: string;
  scheduledDate: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed' | 'deferred';
  taskType: 'inspection' | 'repair' | 'upgrade' | 'maneuver' | 'replacement';
  assignedEngineer: string;
  notes: string;
  aiReasoning: string;
}

export interface InspectionReport {
  id: string;
  reportNumber: string;
  satelliteId: string;
  satelliteName: string;
  generatedAt: string;
  author: string;
  executiveSummary: string;
  healthOverview: {
    powerScore: number;
    thermalScore: number;
    commsScore: number;
    propulsionScore: number;
    overallScore: number;
  };
  engineeringAssessment: string;
  predictedFailures: string[];
  identifiedRisks: string[];
  maintenanceRecommendations: string[];
  aiConfidenceScore: number;
  historicalComparison: string;
  riskClassification: 'Low' | 'Moderate' | 'High' | 'Critical';
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'aegis';
  text: string;
  timestamp: string;
  satelliteId?: string;
  structuredData?: {
    confidenceScore?: number;
    supportingEvidence?: string[];
    engineeringReasoning?: string;
    recommendedActions?: string[];
    satelliteContextId?: string;
  };
}

export interface AppNotification {
  id: string;
  type: 'collision' | 'fuel' | 'battery' | 'maintenance' | 'healthy';
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  satelliteId?: string;
}
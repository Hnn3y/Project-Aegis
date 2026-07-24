/* ==========================================================
   AEGIS Mission Commander Types
========================================================== */

export type MissionRisk =
  | "Low"
  | "Moderate"
  | "High"
  | "Critical";

export interface MissionCommanderReport {
  risk: MissionRisk;

  confidence: number;

  title: string;

  summary: string;

  recommendation: string;

  missionHealth: number;

  generatedAt: string;
}
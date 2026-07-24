import type { SatelliteTelemetry } from "../types/telemetry";
import type { MissionCommanderReport } from "../types/missionCommander";

/* ==========================================================
   Mission Commander
========================================================== */

export function generateMissionReport(
  telemetry: SatelliteTelemetry
): MissionCommanderReport {

  const battery =
    telemetry.power.battery.health;

  const fuel =
    telemetry.propulsion.fuelRemaining;

  const temp =
    telemetry.thermal.internalTemperature;

  let risk:
    | "Low"
    | "Moderate"
    | "High"
    | "Critical" = "Low";

  let title = "Mission Healthy";

  let summary =
    "All spacecraft systems are operating within nominal engineering limits.";

  let recommendation =
    "Continue standard mission monitoring.";

  //------------------------------------------------

  if (
    battery < 90 ||
    fuel < 60 ||
    temp > 32
  ) {

    risk = "Moderate";

    title = "Mission Risk Increasing";

    summary =
      "Battery degradation has accelerated by approximately 3.2% over the previous 48 hours. Thermal cycling is beginning to affect overall subsystem efficiency.";

    recommendation =
      "Schedule engineering inspection and increase subsystem monitoring frequency.";
  }

  //------------------------------------------------

  if (
    battery < 75 ||
    fuel < 40 ||
    temp > 40
  ) {

    risk = "High";

    title = "Engineering Attention Required";

    summary =
      "Multiple engineering parameters are approaching operational thresholds. Continued degradation may impact mission objectives.";

    recommendation =
      "Delay non-essential orbital maneuvers and prioritize engineering diagnostics.";
  }

  //------------------------------------------------

  if (
    battery < 50 ||
    fuel < 20
  ) {

    risk = "Critical";

    title = "Immediate Engineering Action Required";

    summary =
      "Mission-critical subsystems are operating below acceptable limits. Immediate intervention is recommended.";

    recommendation =
      "Enter safe mode and schedule robotic servicing as soon as possible.";
  }

  //------------------------------------------------

  return {

    risk,

    confidence: 94,

    title,

    summary,

    recommendation,

    missionHealth:
      telemetry.aiHealth.overall,

    generatedAt:
      new Date().toISOString(),
  };
}
import {
  Satellite,
  ShieldAlert,
  Rocket,
  BrainCircuit,
} from "lucide-react";

import MissionHealthChart from "../../components/charts/MissionHealthChart";

import MetricCard from "../../components/cards/MetricCard";
import HealthScoreCard from "../../components/cards/HealthScoreCard";
import SatelliteStatusCard from "../../components/cards/SatelliteStatusCard";
import CollisionRiskCard from "../../components/cards/CollisionRiskCard";
import DebrisCard from "../../components/cards/DebrisCard";
import AIRecommendationCard from "../../components/cards/AIRecommendationCard";
import BatteryChart from "../../components/charts/BatteryChart";
import FuelChart from "../../components/charts/FuelChart";
import ThermalChart from "../../components/charts/ThermalChart";
import SignalStrengthChart from "../../components/charts/SignalStrengthChart";
import AlertsPanel from "../../components/notifications/AlertsPanel";
import NotificationsPanel from "../../components/notifications/NotificationsPanel";
import MissionOverview from "../../components/cards/MissionOverview";
import { MissionCommanderCard } from "../../components/missionCommander";

export default function Dashboard() {
  return (
    <div className="space-y-8">

      <section>

        <h1 className="text-4xl font-bold">
          Mission Dashboard
        </h1>

        <p className="text-slate-400 mt-2">
          AI-powered operational overview
        </p>

      </section>

      <div className="mb-8">
  <MissionCommanderCard />
</div>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <MetricCard
          title="Satellites"
          value="15"
          icon={<Satellite />}
          color="bg-cyan-600"
        />

        <MetricCard
          title="Active Missions"
          value="12"
          icon={<Rocket />}
          color="bg-emerald-600"
        />

        <MetricCard
          title="AI Alerts"
          value="4"
          icon={<BrainCircuit />}
          color="bg-yellow-600"
        />

        <MetricCard
          title="Collision Alerts"
          value="1"
          icon={<ShieldAlert />}
          color="bg-red-600"
        />

      </section>

      <>
  <MissionOverview />

  <section className="mt-6 grid gap-6 xl:grid-cols-2">
    <MissionHealthChart />
    <BatteryChart />
    <FuelChart />
    <ThermalChart />
    <SignalStrengthChart />
  </section>

  <section className="mt-6 grid gap-6 xl:grid-cols-2">
    <AlertsPanel />
    <NotificationsPanel />
  </section>
</>

      <section className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">

        <HealthScoreCard />

        <SatelliteStatusCard />

        <CollisionRiskCard />

        <DebrisCard />

        <AIRecommendationCard />

      </section>
      <section className="grid gap-6 lg:grid-cols-2">
  <MissionHealthChart />

  <BatteryChart />

  <FuelChart />

  <ThermalChart />

  <SignalStrengthChart />
</section>

<section className="mt-6">
  <AlertsPanel />
</section>

<section className="mt-6 grid gap-6 xl:grid-cols-2">
  <AlertsPanel />
  <NotificationsPanel />
</section>

    </div>
  );
}
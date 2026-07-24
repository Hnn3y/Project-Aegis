import DashboardCard from "./DashboardCard";

export default function CollisionRiskCard() {
  return (
    <DashboardCard
      title="Collision Risk"
      subtitle="Orbital Analysis"
    >
      <div>

        <h1 className="text-6xl font-bold text-red-400">
          LOW
        </h1>

        <p className="mt-4 text-slate-400">
          1 conjunction requires monitoring.
        </p>

      </div>
    </DashboardCard>
  );
}
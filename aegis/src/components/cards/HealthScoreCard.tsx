import DashboardCard from "./DashboardCard";

export default function HealthScoreCard() {
  return (
    <DashboardCard
      title="Mission Health"
      subtitle="Overall AI Assessment"
    >
      <div className="flex flex-col items-center">

        <div className="text-7xl font-bold text-cyan-400">
          94%
        </div>

        <p className="mt-4 text-emerald-400">
          Healthy
        </p>

      </div>
    </DashboardCard>
  );
}
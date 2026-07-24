import DashboardCard from "./DashboardCard";

export default function DebrisCard() {
  return (
    <DashboardCard
      title="Orbital Debris"
      subtitle="Tracked Objects"
    >
      <h1 className="text-5xl font-bold text-amber-400">
        28,563
      </h1>

      <p className="text-slate-400 mt-4">
        Public catalog objects currently tracked.
      </p>
    </DashboardCard>
  );
}
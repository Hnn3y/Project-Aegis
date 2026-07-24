import DashboardCard from "./DashboardCard";

export default function SatelliteStatusCard() {
  return (
    <DashboardCard
      title="Satellite Status"
      subtitle="Fleet Overview"
    >
      <div className="space-y-3">

        <div className="flex justify-between">
          <span>Healthy</span>
          <span className="text-emerald-400">12</span>
        </div>

        <div className="flex justify-between">
          <span>Warning</span>
          <span className="text-yellow-400">2</span>
        </div>

        <div className="flex justify-between">
          <span>Critical</span>
          <span className="text-red-400">1</span>
        </div>

      </div>
    </DashboardCard>
  );
}
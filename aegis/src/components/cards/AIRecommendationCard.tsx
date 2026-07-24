import DashboardCard from "./DashboardCard";

export default function AIRecommendationCard() {
  return (
    <DashboardCard
      title="AI Recommendation"
      subtitle="Engineering Copilot"
    >
      <p className="text-slate-300 leading-7">
        Battery degradation remains within acceptable limits.
        Schedule a detailed inspection during the next servicing
        window to verify long-term capacity retention.
      </p>

      <button className="mt-6 rounded-lg bg-cyan-500 px-4 py-2 font-semibold hover:bg-cyan-400 transition">
        View Analysis
      </button>
    </DashboardCard>
  );
}
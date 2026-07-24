import type { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  color: string;
}

export default function MetricCard({
  title,
  value,
  icon,
  color,
}: MetricCardProps) {
  return (
    <div className="rounded-xl bg-slate-900 border border-slate-800 p-6">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-sm text-slate-400">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {value}
          </h2>

        </div>

        <div
          className={`h-14 w-14 rounded-xl flex items-center justify-center ${color}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}
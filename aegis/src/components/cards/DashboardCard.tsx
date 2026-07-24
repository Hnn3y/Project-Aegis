import type { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function DashboardCard({
  title,
  subtitle,
  children,
}: DashboardCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">
          {title}
        </h2>

        {subtitle && (
          <p className="text-sm text-slate-400 mt-1">
            {subtitle}
          </p>
        )}
      </div>

      {children}
    </div>
  );
}
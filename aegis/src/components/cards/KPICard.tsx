import type { ReactNode } from "react";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  color?: string;
}

export default function KPICard({
  title,
  value,
  subtitle,
  icon,
  color = "text-cyan-400",
}: KPICardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg transition-all duration-300 hover:border-cyan-500">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-400">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-white">
            {value}
          </h2>

          {subtitle && (
            <p className="mt-2 text-xs text-slate-500">
              {subtitle}
            </p>
          )}

        </div>

        <div className={color}>
          {icon}
        </div>

      </div>

    </div>
  );
}
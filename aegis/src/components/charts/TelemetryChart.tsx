import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export interface TelemetryChartProps<T> {
  title: string;
  data: T[];
  dataKey: keyof T;
  stroke?: string;
  unit?: string;
}

export default function TelemetryChart<
  T extends Record<string, unknown>
>({
  title,
  data,
  dataKey,
  stroke = "#22d3ee",
  unit = "",
}: TelemetryChartProps<T>) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white">
          {title}
        </h2>
      </div>

      <div className="h-72">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart data={data}>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e293b"
            />

            <XAxis
              dataKey="timestamp"
              tick={{
                fill: "#94a3b8",
                fontSize: 12,
              }}
            />

            <YAxis
              tick={{
                fill: "#94a3b8",
                fontSize: 12,
              }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "10px",
                color: "#fff",
              }}
             formatter={(value) => [
  `${Number(value)}${unit}`,
  title,
]}
            />

            <Line
              type="monotone"
              dataKey={String(dataKey)}
              stroke={stroke}
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 6,
              }}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}
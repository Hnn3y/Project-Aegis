import {
  Activity,
  Bot,
  CalendarClock,
  Radar,
  Satellite,
} from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type:
    | "telemetry"
    | "ai"
    | "maintenance"
    | "mission"
    | "tracking";
}

const notifications: NotificationItem[] = [
  {
    id: "1",
    title: "Telemetry Updated",
    description:
      "Latest spacecraft telemetry synchronized successfully.",
    time: "Just now",
    type: "telemetry",
  },
  {
    id: "2",
    title: "AI Engineering Summary",
    description:
      "Mission health analysis completed.",
    time: "2 min ago",
    type: "ai",
  },
  {
    id: "3",
    title: "Maintenance Scheduled",
    description:
      "Solar panel inspection added to maintenance queue.",
    time: "12 min ago",
    type: "maintenance",
  },
  {
    id: "4",
    title: "Mission Planner",
    description:
      "Mission Titan Alpha approved.",
    time: "27 min ago",
    type: "mission",
  },
  {
    id: "5",
    title: "Orbital Tracking",
    description:
      "Orbital debris catalog synchronized.",
    time: "1 hour ago",
    type: "tracking",
  },
];

function getIcon(type: NotificationItem["type"]) {
  switch (type) {
    case "telemetry":
      return (
        <Activity
          size={18}
          className="text-cyan-400"
        />
      );

    case "ai":
      return (
        <Bot
          size={18}
          className="text-emerald-400"
        />
      );

    case "maintenance":
      return (
        <CalendarClock
          size={18}
          className="text-amber-400"
        />
      );

    case "tracking":
      return (
        <Radar
          size={18}
          className="text-purple-400"
        />
      );

    default:
      return (
        <Satellite
          size={18}
          className="text-blue-400"
        />
      );
  }
}

export default function NotificationsPanel() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-lg font-semibold text-white">
          Mission Activity
        </h2>

        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
          {notifications.length}
        </span>

      </div>

      <div className="space-y-4">

        {notifications.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 rounded-xl border border-slate-800 bg-slate-950 p-4 transition hover:border-cyan-500"
          >
            <div className="mt-1">
              {getIcon(item.type)}
            </div>

            <div className="flex-1">

              <div className="flex items-center justify-between">

                <h3 className="font-medium text-white">
                  {item.title}
                </h3>

                <span className="text-xs text-slate-500">
                  {item.time}
                </span>

              </div>

              <p className="mt-2 text-sm text-slate-400">
                {item.description}
              </p>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}
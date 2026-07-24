import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Satellite,
  BrainCircuit,
  Map,
  ShieldAlert,
  FileText,
  Wrench,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Mission Control",
    path: "/mission-control",
    icon: Satellite,
  },
  {
    name: "Digital Twin",
    path: "/digital-twin",
    icon: Satellite,
  },
  {
    name: "AI Intelligence",
    path: "/ai",
    icon: BrainCircuit,
  },
  {
    name: "Mission Planner",
    path: "/planner",
    icon: Map,
  },
  {
    name: "Orbital Debris",
    path: "/debris",
    icon: ShieldAlert,
  },
  {
    name: "Reports",
    path: "/reports",
    icon: FileText,
  },
  {
    name: "Maintenance",
    path: "/maintenance",
    icon: Wrench,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-72"
      } transition-all duration-300 bg-slate-900 border-r border-slate-800 flex flex-col`}
    >
      {/* Logo */}
      <div className="h-20 flex items-center justify-between px-5 border-b border-slate-800">
        {!collapsed && (
          <div>
            <h1 className="text-cyan-400 text-2xl font-bold tracking-wider">
              AEGIS
            </h1>

            <p className="text-xs text-slate-400">
              Mission Intelligence
            </p>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-slate-800"
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `
                flex
                items-center
                gap-4
                rounded-xl
                px-4
                py-3
                transition-all
                ${
                  isActive
                    ? "bg-cyan-500 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }
              `
              }
            >
              <Icon size={22} />

              {!collapsed && (
                <span className="font-medium">
                  {item.name}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="border-t border-slate-800 p-5">
          <p className="text-xs text-slate-500">
            TitanVale Technologies
          </p>

          <p className="text-xs text-slate-600">
            AEGIS v1.0
          </p>
        </div>
      )}
    </aside>
  );
}
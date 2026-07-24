import {
  Bell,
  Search,
  Plus,
  BrainCircuit,
  UserCircle2,
} from "lucide-react";

export function Navbar() {
  const now = new Date().toUTCString();

  return (
    <header className="h-20 border-b border-slate-800 bg-slate-900 px-8 flex items-center justify-between">

      {/* Left */}
      <div className="flex items-center gap-6">

        {/* Search */}
        <div className="relative">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            placeholder="Search satellite, mission, operator..."
            className="
              w-96
              rounded-xl
              border
              border-slate-700
              bg-slate-800
              py-3
              pl-11
              pr-4
              text-sm
              outline-none
              placeholder:text-slate-500
              focus:border-cyan-400
            "
          />

        </div>

        {/* Mission Status */}
        <div className="flex items-center gap-2 rounded-xl bg-emerald-900/20 px-4 py-2 border border-emerald-600/30">

          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>

          <span className="text-sm text-emerald-400 font-medium">
            Mission Systems Operational
          </span>

        </div>

      </div>

      {/* Right */}
      <div className="flex items-center gap-4">

        {/* UTC Clock */}
        <div className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2">

          <p className="text-xs text-slate-400">
            UTC
          </p>

          <p className="text-sm font-semibold text-cyan-400">
            {now}
          </p>

        </div>

        {/* AI Copilot */}
        <button
          className="
            flex
            items-center
            gap-2
            rounded-xl
            bg-cyan-500
            px-4
            py-3
            text-sm
            font-semibold
            hover:bg-cyan-400
            transition
          "
        >
          <BrainCircuit size={18} />

          Ask AEGIS
        </button>

        {/* New Mission */}
        <button
          className="
            flex
            items-center
            gap-2
            rounded-xl
            border
            border-slate-700
            bg-slate-800
            px-4
            py-3
            text-sm
            hover:bg-slate-700
          "
        >
          <Plus size={18} />

          New Mission
        </button>

        {/* Notifications */}
        <button
          className="
            relative
            rounded-xl
            border
            border-slate-700
            bg-slate-800
            p-3
            hover:bg-slate-700
          "
        >
          <Bell size={20} />

          <span
            className="
              absolute
              -right-1
              -top-1
              flex
              h-5
              w-5
              items-center
              justify-center
              rounded-full
              bg-red-500
              text-[10px]
              font-bold
            "
          >
            3
          </span>

        </button>

        {/* User */}
        <button
          className="
            flex
            items-center
            gap-3
            rounded-xl
            border
            border-slate-700
            bg-slate-800
            px-3
            py-2
          "
        >
          <UserCircle2 size={34} />

          <div>

            <p className="text-sm font-semibold">
              Mission Controller
            </p>

            <p className="text-xs text-slate-400">
              Administrator
            </p>

          </div>

        </button>

      </div>

    </header>
  );
}
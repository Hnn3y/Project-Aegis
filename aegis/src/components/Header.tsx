import React, { useState, useEffect } from 'react';
import {
  Activity,
  Satellite as SatelliteIcon,
  Globe,
  Radio,
  AlertTriangle,
  Bell,
  Search,
  UserCheck,
  Shield,
  Bot,
  Zap,
  Wrench,
  FileText,
  Calendar,
  Layers,
  ChevronDown,
  Sun,
  RefreshCw,
  CloudDownload,
} from 'lucide-react';
import { UserRole, AppNotification, Satellite } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  satellites: Satellite[];
  onSelectSatellite: (sat: Satellite) => void;
  openTitanValeModal: () => void;
  onSyncCelesTrak?: () => void;
  isSyncingCelesTrak?: boolean;
}

interface SpaceWeatherData {
  kpIndex: number;
  kpStatus: string;
  solarWindSpeedKmS: number;
  solarFluxSFU: number;
  geomagneticStormLevel: string;
  solarRadiationStormLevel: string;
  radioBlackoutLevel: string;
  updatedAt: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  setUserRole,
  notifications,
  markNotificationRead,
  satellites,
  onSelectSatellite,
  openTitanValeModal,
  onSyncCelesTrak,
  isSyncingCelesTrak = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  // Live NOAA Space Weather State
  const [spaceWeather, setSpaceWeather] = useState<SpaceWeatherData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);

  const fetchSpaceWeather = async () => {
    setIsLoadingWeather(true);
    try {
      const res = await fetch('/api/noaa/space-weather');
      const json = await res.json();
      if (json.success && json.data) {
        setSpaceWeather(json.data);
      }
    } catch (e) {
      console.warn('Failed to load NOAA space weather live feed:', e);
    } finally {
      setIsLoadingWeather(false);
    }
  };

  useEffect(() => {
    fetchSpaceWeather();
    const interval = setInterval(fetchSpaceWeather, 60000); // 1 minute auto-refresh
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredSatellites = searchQuery.trim()
    ? satellites.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.operator.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.noradId.toString().includes(searchQuery) ||
          s.orbitType.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const roleLabels: Record<UserRole, string> = {
    admin: 'Administrator',
    mission_controller: 'Mission Controller',
    systems_engineer: 'Systems Engineer',
    analyst: 'Data Analyst',
    read_only: 'Read Only (Observer)',
  };

  const navItems = [
    { id: 'earth', label: '3D Earth', icon: Globe },
    { id: 'dashboard', label: 'Mission Health', icon: Activity },
    { id: 'digital_twin', label: 'Digital Twin', icon: SatelliteIcon },
    { id: 'planner', label: 'Mission Planner', icon: Radio },
    { id: 'copilot', label: 'AI Copilot', icon: Bot },
    { id: 'debris', label: 'Orbital Debris', icon: AlertTriangle },
    { id: 'reports', label: 'AI Reports', icon: FileText },
    { id: 'scheduler', label: 'Maintenance Queue', icon: Calendar },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#05070A]/95 backdrop-blur-xl border-b border-cyan-500/20 text-slate-100 shadow-2xl">
      {/* Top Utility & Space Weather Ticker Bar */}
      <div className="px-4 py-1.5 bg-[#080B12]/90 border-b border-slate-800/80 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-cyan-400 font-mono font-semibold tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            AEGIS MISSION CONTROL ENGINE
          </div>

          <button
            onClick={openTitanValeModal}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#0D1322] hover:bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 transition-all text-xs font-mono"
          >
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>TitanVale Ecosystem</span>
          </button>

          {onSyncCelesTrak && (
            <button
              onClick={onSyncCelesTrak}
              disabled={isSyncingCelesTrak}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-cyan-950/80 hover:bg-cyan-900/90 text-cyan-300 border border-cyan-500/50 transition-all text-xs font-mono disabled:opacity-50"
              title="Sync live orbital TLE elements from CelesTrak NORAD API"
            >
              <CloudDownload className={`w-3 h-3 text-cyan-400 ${isSyncingCelesTrak ? 'animate-bounce' : ''}`} />
              <span>{isSyncingCelesTrak ? 'SYNCING CELESTRAK...' : 'SYNC CELESTRAK TLE'}</span>
            </button>
          )}
        </div>

        {/* Live NOAA Space Weather Ticker */}
        <div className="hidden lg:flex items-center gap-5 font-mono text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 bg-slate-900/60 px-2 py-0.5 rounded border border-slate-800">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">NOAA SWPC Live:</span>
            <span className="text-emerald-400 font-bold">
              Kp {spaceWeather ? spaceWeather.kpIndex : '2.3'} ({spaceWeather ? spaceWeather.kpStatus.split(' ')[0] : 'QUIET'})
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span>Solar Flux:</span>
            <span className="text-cyan-400 font-bold">
              {spaceWeather ? spaceWeather.solarFluxSFU : '168.4'} sfu
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span>Solar Wind:</span>
            <span className="text-cyan-400 font-bold">
              {spaceWeather ? spaceWeather.solarWindSpeedKmS : '412.5'} km/s
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span>Geomagnetic:</span>
            <span className="text-emerald-400 font-bold">
              {spaceWeather ? spaceWeather.geomagneticStormLevel : 'G0'}
            </span>
          </div>

          <button
            onClick={fetchSpaceWeather}
            disabled={isLoadingWeather}
            className="text-slate-500 hover:text-cyan-400 transition-colors"
            title="Refresh NOAA Space Weather Data"
          >
            <RefreshCw className={`w-3 h-3 ${isLoadingWeather ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* User Role Selector */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0D1322] hover:bg-slate-800 border border-slate-700/80 text-slate-300 text-xs font-mono"
          >
            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Role: {roleLabels[userRole]}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-1 w-56 bg-[#080B12] border border-cyan-500/30 rounded-xl shadow-2xl z-50 py-1 font-sans text-xs backdrop-blur-md">
              <div className="px-3 py-1.5 font-mono text-[10px] text-slate-400 uppercase border-b border-slate-800/80">
                Switch Operational Role
              </div>
              {(Object.keys(roleLabels) as UserRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    setUserRole(role);
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-cyan-950/40 transition-colors ${
                    userRole === role ? 'text-cyan-400 font-semibold bg-cyan-950/30' : 'text-slate-300'
                  }`}
                >
                  <span>{roleLabels[role]}</span>
                  {userRole === role && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Header Row */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('earth')}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-900/60 via-slate-900 to-[#080B12] border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            <Shield className="w-6 h-6 text-cyan-400" />
            <div className="absolute inset-0 rounded-xl border border-cyan-400/30 animate-pulse"></div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-wider text-white font-mono bg-gradient-to-r from-cyan-300 via-blue-200 to-cyan-400 bg-clip-text text-transparent">
                AEGIS
              </h1>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-semibold">
                v3.6 AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono tracking-tight hidden sm:block">
              AI Spacecraft Operations & Digital Twin Platform
            </p>
          </div>
        </div>

        {/* Global Search */}
        <div className="relative flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search satellite, NORAD ID, operator, or orbit..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              className="w-full bg-[#080B12]/90 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/50 font-mono transition-all"
            />
          </div>

          {showSearchDropdown && filteredSatellites.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#080B12] border border-slate-700 rounded-xl shadow-2xl z-50 max-h-72 overflow-y-auto">
              <div className="px-3 py-1.5 text-[10px] font-mono text-slate-400 uppercase border-b border-slate-800">
                Satellite Search Results
              </div>
              {filteredSatellites.map((sat) => (
                <button
                  key={sat.id}
                  onClick={() => {
                    onSelectSatellite(sat);
                    setActiveTab('digital_twin');
                    setShowSearchDropdown(false);
                    setSearchQuery('');
                  }}
                  className="w-full text-left px-3 py-2.5 hover:bg-cyan-950/40 border-b border-slate-800/50 flex items-center justify-between group transition-colors"
                >
                  <div>
                    <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 font-sans">
                      {sat.name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      NORAD ID: {sat.noradId} | {sat.operator} | Orbit: {sat.orbitType}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        sat.status === 'nominal'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                          : sat.status === 'warning'
                          ? 'bg-amber-950 text-amber-400 border border-amber-500/30'
                          : 'bg-red-950 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {sat.status.toUpperCase()}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Action Controls & Notifications */}
        <div className="flex items-center gap-3">
          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="relative p-2 rounded-xl bg-[#080B12] hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-300 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white font-mono animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#080B12] border border-cyan-500/30 rounded-2xl shadow-2xl z-50 p-3.5 max-h-96 overflow-y-auto">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h3 className="text-xs font-mono font-bold text-slate-200">ACTIVE ENGINEERING ALERTS</h3>
                  <span className="text-[10px] font-mono text-cyan-400">{unreadCount} unread</span>
                </div>

                <div className="mt-2 space-y-2">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        n.read
                          ? 'bg-[#05070A] border-slate-800 text-slate-400'
                          : n.severity === 'critical'
                          ? 'bg-red-950/30 border-red-500/40 text-slate-200'
                          : n.severity === 'high'
                          ? 'bg-amber-950/30 border-amber-500/40 text-slate-200'
                          : 'bg-[#0A0E17] border-cyan-500/30 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono text-[10px] mb-1">
                        <span
                          className={`font-semibold ${
                            n.severity === 'critical'
                              ? 'text-red-400'
                              : n.severity === 'high'
                              ? 'text-amber-400'
                              : 'text-cyan-400'
                          }`}
                        >
                          {n.title}
                        </span>
                        <span className="text-slate-500">{n.timestamp}</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-slate-300 font-sans">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="px-4 bg-[#080B12]/80 border-t border-slate-800/80 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1.5 py-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.2)] font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
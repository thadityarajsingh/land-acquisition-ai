import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Shield,
  Layers,
  ChevronDown,
  Bell,
  CheckCircle2,
  X,
  AlertCircle,
  LogOut,
  User,
  Fingerprint
} from 'lucide-react';

export function TopNav({
  projects = [],
  selectedProjectId,
  onSelectProject,
  searchQuery = '',
  onSearchChange,
  currentUser,
  onLogout
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  const currentProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notifications = [
    {
      id: 1,
      title: "Bombay High Court Stay Writ #4182/2024",
      desc: "Listed for urgent hearing on 18-Sep-2024 before Division Bench (Court 4).",
      type: "critical",
      time: "2h ago"
    },
    {
      id: 2,
      title: "Section 20(E) Statutory Declaration",
      desc: "Draft gazette order ready; 44 days remaining in Section 25 lapsing window.",
      type: "warning",
      time: "5h ago"
    },
    {
      id: 3,
      title: "Drone Resurvey Coordinates",
      desc: "DGPS validation confirmed for Gut 105/2 by SLR Paud sub-division.",
      type: "success",
      time: "1d ago"
    }
  ];

  const officerName = currentUser?.name || "SLAO Pune";
  const officerRole = currentUser?.roleTitle || "CALA Authority";
  const officerInitials = currentUser?.avatarInitials || "AO";
  const officerBg = currentUser?.avatarBg || "bg-blue-700";
  const officerId = currentUser?.id || "CALA-MH-04";
  const officerDistrict = currentUser?.district || "Pune West Arc Division";

  return (
    <header className="bg-[#0A1120] border-b border-slate-800/80 text-white sticky top-0 z-40 px-4 sm:px-6 py-2.5 shadow-sm backdrop-blur-md">
      <div className="max-w-[1720px] mx-auto flex items-center justify-between gap-4">
        
        {/* Brand & Gov Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-[#1E3A8A] border border-blue-400/30 flex items-center justify-center text-white font-black tracking-wider shadow-sm">
            <span className="text-[#F97316] text-lg">B</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                Bhoomi<span className="text-[#F97316]">IQ</span>
              </span>
              <span className="text-[9px] uppercase font-bold tracking-wider bg-orange-500/15 text-[#F97316] px-1.5 py-0.2 rounded border border-orange-500/25">
                v2.4 Live
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
              National Land Acquisition Risk Intelligence
            </p>
          </div>
        </div>

        {/* Center: Project/Parcel Selector & Quick Search */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <div className="relative flex-1">
            <label htmlFor="project-selector" className="sr-only">Select Infrastructure Corridor</label>
            <div className="relative">
              <Layers className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                id="project-selector"
                value={selectedProjectId}
                onChange={(e) => onSelectProject(e.target.value)}
                className="w-full bg-slate-900/90 text-slate-200 text-xs pl-8 pr-8 py-1.5 rounded-lg border border-slate-700/80 focus:outline-none focus:ring-1.5 focus:ring-[#F97316] font-medium appearance-none cursor-pointer hover:bg-slate-800/80 transition"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id} className="bg-slate-900 text-white py-1">
                    {p.id} — {p.name} ({p.district})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="relative hidden md:block w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              placeholder="Search Gut / Owner..."
              className="w-full bg-slate-900/90 text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-700/80 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1.5 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Right: Live Status, Notifications & Officer Profile with Sign Out */}
        <div className="flex items-center gap-3 shrink-0 relative">
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 text-[11px] font-medium">RFCTLARR Compliant</span>
          </div>

          {/* Notifications Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(prev => !prev)}
              className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-700/80 transition relative"
              title="Statutory Alerts"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#F97316] rounded-full"></span>
            </button>

            {/* Notification Drawer */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-xl p-4 text-xs z-50 animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2.5">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5 text-xs">
                    <AlertCircle className="w-3.5 h-3.5 text-[#F97316]" />
                    Statutory Alerts (3)
                  </span>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2">
                  {notifications.map(n => (
                    <div key={n.id} className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/50 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200 line-clamp-1">{n.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Officer Persona & Interactive Profile Menu */}
          <div className="relative" ref={profileMenuRef}>
            <button
              type="button"
              onClick={() => setShowProfileMenu(prev => !prev)}
              className="flex items-center gap-2 pl-2 border-l border-slate-800 hover:opacity-90 transition group cursor-pointer focus:outline-none"
              title="Officer Profile & Session Options"
            >
              <div className={`w-8 h-8 rounded-full ${officerBg} border border-blue-400/40 text-xs text-white flex items-center justify-center font-bold shadow-sm group-hover:ring-2 group-hover:ring-[#F97316]/50 transition`}>
                {officerInitials}
              </div>
              <div className="hidden xl:block text-left">
                <div className="text-xs font-semibold text-slate-200 leading-tight group-hover:text-white transition">
                  {officerName}
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                  <span>{officerRole}</span>
                  <ChevronDown className={`w-2.5 h-2.5 transition-transform duration-200 ${showProfileMenu ? 'rotate-180 text-[#F97316]' : ''}`} />
                </div>
              </div>
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2.5 w-72 bg-slate-900/95 backdrop-blur-xl border border-slate-700/90 rounded-2xl shadow-2xl p-4 text-xs z-50 animate-in fade-in">
                {/* Officer Card */}
                <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                  <div className={`w-10 h-10 rounded-xl ${officerBg} text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-md`}>
                    {officerInitials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-white text-xs truncate">{officerName}</div>
                    <div className="text-[11px] text-[#F97316] font-medium truncate">{officerRole}</div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">{officerId}</div>
                  </div>
                </div>

                {/* Officer Jurisdiction / Meta */}
                <div className="py-2.5 space-y-1.5 text-[11px] border-b border-slate-800">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Jurisdiction</span>
                    <span className="text-slate-200 font-medium text-right truncate max-w-[150px]">{officerDistrict}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Session Status</span>
                    <span className="text-emerald-400 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Active NIC SSO
                    </span>
                  </div>
                </div>

                {/* Sign Out Action */}
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      if (onLogout) onLogout();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/40 text-xs font-bold transition duration-150 active:scale-[0.98]"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Direct Sign Out Button */}
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-red-400 bg-slate-900 hover:bg-red-500/10 rounded-lg border border-slate-700/80 hover:border-red-500/30 transition"
              title="Sign Out of BhoomiIQ"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}

        </div>

      </div>
    </header>
  );
}

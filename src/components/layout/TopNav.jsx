import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Shield,
  ShieldCheck,
  Layers,
  ChevronDown,
  Bell,
  CheckCircle2,
  X,
  AlertCircle,
  LogOut,
  User,
  Fingerprint,
  PanelLeft,
  Menu,
  FileText,
  Scale
} from 'lucide-react';

export function TopNav({
  projects = [],
  selectedProjectId,
  onSelectProject,
  searchQuery = '',
  onSearchChange,
  currentUser,
  onLogout,
  onToggleSidebar,
  isSidebarOpen = false,
  isSidebarPinned = false,
  onSelectTab,
  onReturnToTop
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showCompliance, setShowCompliance] = useState(false);
  
  const profileMenuRef = useRef(null);
  const complianceRef = useRef(null);
  const notificationRef = useRef(null);

  const currentProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (complianceRef.current && !complianceRef.current.contains(event.target)) {
        setShowCompliance(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleReturnToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (onReturnToTop) {
      onReturnToTop();
    }
  };

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
    <header className="bg-gradient-to-r from-[#EA580C] via-[#F97316] to-[#C2410C] border-b border-orange-700/60 text-white sticky top-0 z-40 px-4 sm:px-6 py-2.5 shadow-md shadow-orange-950/15 backdrop-blur-md">
      <div className="max-w-[1720px] mx-auto flex items-center justify-between gap-4">
        
        {/* Brand & Gov Identity with Sidebar Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className={`p-1.5 rounded-lg border transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                isSidebarOpen || isSidebarPinned
                  ? 'bg-white text-[#EA580C] border-white shadow-md font-bold'
                  : 'bg-black/20 hover:bg-black/30 border-white/25 text-white'
              }`}
              title={isSidebarOpen ? "Close Modules Menu" : "Open Modules Menu (Slide Panel)"}
            >
              <PanelLeft className={`w-4 h-4 ${isSidebarOpen || isSidebarPinned ? 'text-[#EA580C]' : 'text-white'}`} />
              <span className="text-xs font-semibold hidden sm:inline">Modules</span>
            </button>
          )}

          {/* Clickable BhoomiIQ Brand & Button to Return to Top */}
          <button
            type="button"
            onClick={handleReturnToTop}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none select-none"
            title="Click to return to the top"
          >
            <div className="w-8 h-8 rounded-lg bg-white border border-white/40 flex items-center justify-center text-[#EA580C] font-black tracking-wider shadow-sm group-hover:scale-105 group-active:scale-95 transition-transform">
              <span className="text-lg font-black">B</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white drop-shadow-sm group-hover:text-amber-100 transition-colors">
                  Bhoomi<span className="text-amber-100">IQ</span>
                </span>
                <span className="text-[9px] uppercase font-bold tracking-wider bg-white/20 text-white px-1.5 py-0.2 rounded border border-white/30 shadow-xs">
                  v2.4 Live
                </span>
              </div>
              <p className="text-[10px] text-orange-100 font-medium hidden sm:block leading-tight group-hover:text-white transition-colors">
                National Land Acquisition Risk Intelligence
              </p>
            </div>
          </button>
        </div>

        {/* Center: Project/Parcel Selector & Quick Search */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <div className="relative flex-1">
            <label htmlFor="project-selector" className="sr-only">Select Infrastructure Corridor</label>
            <div className="relative">
              <Layers className="w-3.5 h-3.5 text-orange-100 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                id="project-selector"
                value={selectedProjectId}
                onChange={(e) => onSelectProject(e.target.value)}
                className="w-full bg-black/20 hover:bg-black/25 text-white text-xs pl-8 pr-8 py-1.5 rounded-lg border border-white/25 focus:outline-none focus:ring-2 focus:ring-white/40 font-medium appearance-none cursor-pointer transition shadow-inner"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id} className="bg-slate-900 text-white py-1">
                    {p.id} — {p.name} ({p.district})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-orange-100 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="relative hidden md:block w-48">
            <Search className="w-3.5 h-3.5 text-orange-100 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              placeholder="Search Gut / Owner..."
              className="w-full bg-black/20 hover:bg-black/25 text-xs pl-8 pr-3 py-1.5 rounded-lg border border-white/25 text-white placeholder-orange-100/70 focus:outline-none focus:ring-2 focus:ring-white/40 shadow-inner"
            />
          </div>
        </div>

        {/* Right: Live Status, Notifications & Officer Profile with Sign Out */}
        <div className="flex items-center gap-3 shrink-0 relative">
          
          {/* Statutory RFCTLARR Compliance Trigger Button (Button on left side of notification) */}
          <div className="relative" ref={complianceRef}>
            <button
              type="button"
              onClick={() => setShowCompliance(prev => !prev)}
              className="hidden sm:flex items-center gap-1.5 bg-black/20 hover:bg-black/35 active:scale-95 px-2.5 py-1 rounded-lg border border-white/20 hover:border-white/40 text-xs transition cursor-pointer group"
              title="Click to view RFCTLARR Statutory Compliance Audit & Legal Status"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
              <span className="text-white text-[11px] font-medium group-hover:text-amber-100 transition-colors">RFCTLARR Compliant</span>
              <ChevronDown className={`w-3 h-3 text-orange-200 transition-transform duration-200 ${showCompliance ? 'rotate-180 text-white' : ''}`} />
            </button>

            {/* Compliance Modal / Popover */}
            {showCompliance && (
              <div className="absolute right-0 mt-2.5 w-80 sm:w-96 bg-slate-900/95 backdrop-blur-xl border border-slate-700/90 rounded-2xl shadow-2xl p-4 sm:p-5 text-xs z-50 animate-in fade-in">
                {/* Header */}
                <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs">Statutory Compliance Audit</div>
                      <div className="text-[10px] text-slate-400 font-medium">RFCTLARR Act 2013 · Legal Standing</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCompliance(false)}
                    className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Corridor Status Bar */}
                <div className="my-3 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-xs font-bold">100% Statutory Clearance</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono font-semibold">
                    VALID
                  </span>
                </div>

                {/* Statutory Checklist Items */}
                <div className="space-y-2 text-[11px]">
                  <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                      ✓
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-200">Section 20(E) Statutory Declaration</div>
                      <p className="text-slate-400 text-[10px] mt-0.5 leading-tight">
                        Gazette order drafted; 44 days remaining in Section 25 statutory lapsing window.
                      </p>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                      ✓
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-200">Fair Compensation & Solatium (Sec 30)</div>
                      <p className="text-slate-400 text-[10px] mt-0.5 leading-tight">
                        100% Solatium + 12% p.a. additional interest component applied across valuation awards.
                      </p>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                      ✓
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-200">Rural Multiplier Factor (2.0x)</div>
                      <p className="text-slate-400 text-[10px] mt-0.5 leading-tight">
                        Ambavane & Paud belt categorized under First Schedule rural multiplier.
                      </p>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                      ✓
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-200">DGPS Resurvey Verification</div>
                      <p className="text-slate-400 text-[10px] mt-0.5 leading-tight">
                        58% JMS certified by Superintending Land Records Paud sub-division.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-3.5 pt-3 border-t border-slate-800 flex items-center gap-2">
                  {onSelectTab && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowCompliance(false);
                        onSelectTab('protocols');
                      }}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-orange-500/20"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Mitigation Directives</span>
                    </button>
                  )}

                  {onSelectTab && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowCompliance(false);
                        onSelectTab('audit');
                      }}
                      className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition cursor-pointer"
                    >
                      Audit Trail
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Notifications Button */}
          <div className="relative" ref={notificationRef}>
            <button
              type="button"
              onClick={() => setShowNotifications(prev => !prev)}
              className="p-1.5 text-white hover:text-white bg-black/20 hover:bg-black/30 rounded-lg border border-white/25 transition relative cursor-pointer"
              title="Statutory Alerts"
            >
              <Bell className="w-4 h-4 text-white" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-white rounded-full"></span>
            </button>

            {/* Notification Drawer */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-4 text-xs z-50 animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2.5">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5 text-xs">
                    <AlertCircle className="w-3.5 h-3.5 text-[#F97316]" />
                    Statutory Alerts (3)
                  </span>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-slate-400 hover:text-white cursor-pointer"
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
              className="flex items-center gap-2 pl-2 border-l border-white/25 hover:opacity-95 transition group cursor-pointer focus:outline-none"
              title="Officer Profile & Session Options"
            >
              <div className="w-8 h-8 rounded-full bg-white text-[#EA580C] border border-white/50 text-xs flex items-center justify-center font-black shadow-sm group-hover:ring-2 group-hover:ring-white transition">
                {officerInitials}
              </div>
              <div className="hidden xl:block text-left">
                <div className="text-xs font-bold text-white leading-tight">
                  {officerName}
                </div>
                <div className="text-[10px] text-orange-100 flex items-center gap-1">
                  <span>{officerRole}</span>
                  <ChevronDown className={`w-2.5 h-2.5 transition-transform duration-200 text-orange-100 ${showProfileMenu ? 'rotate-180 text-white' : ''}`} />
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
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/40 text-xs font-bold transition duration-150 active:scale-[0.98] cursor-pointer"
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
              className="p-1.5 text-white hover:text-white bg-black/20 hover:bg-red-600/40 rounded-lg border border-white/25 hover:border-red-400/40 transition cursor-pointer"
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


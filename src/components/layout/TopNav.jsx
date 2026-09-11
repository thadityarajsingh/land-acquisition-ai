import React from 'react';
import { Search, ShieldAlert, Layers, ChevronDown, Bell, CheckCircle2, SlidersHorizontal } from 'lucide-react';

export function TopNav({ projects = [], selectedProjectId, onSelectProject }) {
  const currentProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  return (
    <header className="bg-[#0F172A] border-b border-slate-800 text-white sticky top-0 z-40 px-4 lg:px-6 py-2.5 shadow-md">
      <div className="max-w-[1720px] mx-auto flex items-center justify-between gap-4">
        
        {/* Brand & Gov Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-md bg-[#1E3A8A] border border-blue-500/30 flex items-center justify-center text-white font-bold tracking-wider shadow-inner">
            <span className="text-[#F97316] font-black text-xl">B</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                Bhoomi<span className="text-[#F97316]">IQ</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-orange-500/20 text-[#F97316] px-1.5 py-0.5 rounded border border-orange-500/30">
                Risk Engine v2.4
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              National Infrastructure Land Acquisition & De-risking Portal
            </p>
          </div>
        </div>

        {/* Center: Project/Parcel Selector & Quick Search */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <div className="relative flex-1">
            <label htmlFor="project-selector" className="sr-only">Select Infrastructure Corridor / Parcel Sector</label>
            <div className="relative">
              <Layers className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                id="project-selector"
                value={selectedProjectId}
                onChange={(e) => onSelectProject(e.target.value)}
                className="w-full bg-slate-800/90 text-slate-100 text-xs sm:text-sm pl-9 pr-8 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent font-medium appearance-none cursor-pointer hover:bg-slate-800 transition-colors"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id} className="bg-slate-900 text-white py-1">
                    {p.id} — {p.name} ({p.district})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="relative hidden md:block w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Gut / Survey No..."
              className="w-full bg-slate-900/80 text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Right Status Badges & Officer Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden lg:flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-300 text-[11px] font-medium">RFCTLARR Sec 20(E) Compliance</span>
          </div>

          <button className="p-2 text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700 transition relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#F97316] rounded-full"></span>
          </button>

          {/* Officer Persona */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="w-7 h-7 rounded-full bg-blue-900 border border-blue-400/40 text-xs text-blue-200 flex items-center justify-center font-bold">
              AO
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-semibold text-slate-200 leading-tight">SLAO Pune Division</div>
              <div className="text-[10px] text-slate-400">Competent Authority (CALA)</div>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}

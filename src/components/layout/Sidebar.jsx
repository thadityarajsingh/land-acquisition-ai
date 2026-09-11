import React from 'react';
import { 
  Map, 
  FolderKanban, 
  Scale, 
  Sliders, 
  FileCheck2, 
  History, 
  AlertTriangle,
  TrendingDown,
  Building2
} from 'lucide-react';

export function Sidebar({ activeTab, setActiveTab, projectData }) {
  const navItems = [
    { id: 'cadastral', label: 'Cadastral GIS Map', icon: Map, badge: 'Live GIS' },
    { id: 'corridor', label: 'Corridor Assessment', icon: FolderKanban },
    { id: 'disputes', label: 'Dispute & Stay Writs', icon: Scale, count: '3 Writs' },
    { id: 'whatif', label: 'What-If Simulation', icon: Sliders, highlight: true },
    { id: 'protocols', label: 'Mitigation Actions', icon: FileCheck2 },
    { id: 'audit', label: 'Statutory Audit Trail', icon: History },
  ];

  return (
    <aside className="w-64 bg-[#0B132B] border-r border-slate-800 text-slate-300 flex flex-col shrink-0 h-[calc(100vh-57px)] sticky top-[57px]">
      
      {/* Ministry / Authority Header */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/40">
        <div className="flex items-center gap-2.5">
          <Building2 className="w-5 h-5 text-blue-400 shrink-0" />
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Jurisdiction</div>
            <div className="text-xs font-bold text-white truncate">Mulshi Sub-Division, Pune</div>
          </div>
        </div>
      </div>

      {/* Primary Navigation Menu */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1">
          Analysis Views
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-900/40 text-white border-l-4 border-[#F97316] shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#F97316]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-semibold border border-emerald-500/30">
                  {item.badge}
                </span>
              )}
              {item.count && (
                <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-mono font-semibold border border-rose-500/30">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sector Summary Card at bottom of Sidebar */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/60 m-2 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold text-slate-300">Sector Footprint</span>
          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono">
            {projectData?.status || 'Sec 20E'}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-center text-xs">
          <div className="bg-slate-800/80 p-2 rounded border border-slate-700/60">
            <div className="text-[10px] text-slate-400">Total Parcels</div>
            <div className="font-bold text-white font-mono">{projectData?.parcels?.length || 48}</div>
          </div>
          <div className="bg-slate-800/80 p-2 rounded border border-slate-700/60">
            <div className="text-[10px] text-slate-400">Area (Ha)</div>
            <div className="font-bold text-white font-mono">{projectData?.totalAreaHa || 34.6}</div>
          </div>
        </div>
        <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
          <span>Est. Statutory Delay:</span>
          <span className="font-semibold text-rose-400 font-mono">{projectData?.estimatedDelay || '148 days'}</span>
        </div>
      </div>

    </aside>
  );
}

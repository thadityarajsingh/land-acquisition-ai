import React from 'react';
import { 
  Map, 
  FolderKanban, 
  Scale, 
  Sliders, 
  FileCheck2, 
  History, 
  Building2
} from 'lucide-react';

export function Sidebar({ activeTab, setActiveTab, projectData }) {
  const navItems = [
    { id: 'cadastral', label: 'Cadastral GIS Map', icon: Map, badge: 'Live GIS' },
    { id: 'corridor', label: 'Corridor Milestones', icon: FolderKanban },
    { id: 'disputes', label: 'Dispute & Stay Writs', icon: Scale, count: '3 Writs' },
    { id: 'whatif', label: 'What-If Simulation', icon: Sliders, highlight: true },
    { id: 'protocols', label: 'Mitigation Directives', icon: FileCheck2 },
    { id: 'audit', label: 'Statutory Audit Trail', icon: History },
  ];

  return (
    <aside className="w-60 bg-[#090E1A] border-r border-slate-800/80 text-slate-300 flex flex-col shrink-0 h-[calc(100vh-53px)] sticky top-[53px]">
      
      {/* Jurisdiction Tag */}
      <div className="px-4 py-3.5 border-b border-slate-800/60 flex items-center gap-2.5">
        <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
        <div className="truncate">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Jurisdiction</div>
          <div className="text-xs font-bold text-slate-200 truncate">Mulshi Sub-Division, Pune</div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-2.5 py-3 space-y-1 overflow-y-auto">
        <div className="text-[9px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1">
          Views
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-950/70 text-white border-l-3 border-[#F97316] shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#F97316]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[9px] bg-emerald-500/15 text-emerald-400 px-1.5 py-0.2 rounded font-mono font-semibold border border-emerald-500/25">
                  {item.badge}
                </span>
              )}
              {item.count && (
                <span className="text-[9px] bg-rose-500/15 text-rose-300 px-1.5 py-0.2 rounded font-mono font-semibold border border-rose-500/25">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Clean Bottom Metric Card */}
      <div className="p-3 m-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Sector Progress:</span>
          <span className="font-mono font-bold text-amber-400">58% JMS</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-[#F97316] h-full rounded-full" style={{ width: '58%' }}></div>
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 pt-0.5">
          <span>Sec 20(E) Target</span>
          <span className="text-slate-300 font-mono">28-Oct-2024</span>
        </div>
      </div>

    </aside>
  );
}

import React, { useEffect } from 'react';
import { 
  Map, 
  FolderKanban, 
  Scale, 
  Sliders, 
  FileCheck2, 
  History, 
  Building2,
  X,
  Shield,
  Layers,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export function Sidebar({
  activeTab,
  setActiveTab,
  projectData,
  currentUser,
  isOpen = false,
  onClose
}) {
  const navItems = [
    {
      id: 'cadastral',
      label: 'Cadastral GIS Map',
      description: 'DGPS parcel boundaries & risk overlays',
      icon: Map,
      badge: 'Live GIS',
      badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    },
    {
      id: 'corridor',
      label: 'Corridor Milestones',
      description: 'Gazette notifications & chainage milestones',
      icon: FolderKanban,
    },
    {
      id: 'disputes',
      label: 'Dispute & Stay Writs',
      description: 'High Court stays, writs & Lok Adalat',
      icon: Scale,
      count: '3 Writs',
      countColor: 'bg-rose-500/15 text-rose-300 border-rose-500/25',
    },
    {
      id: 'whatif',
      label: 'What-If Simulation',
      description: 'Budget, buffer & alignment scenarios',
      icon: Sliders,
      highlight: true,
      badge: 'AI Engine',
      badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
    },
    {
      id: 'protocols',
      label: 'Mitigation Directives',
      description: 'Section 25 lapse counter-measures',
      icon: FileCheck2,
    },
    {
      id: 'audit',
      label: 'Statutory Audit Trail',
      description: 'Immutable NIC action log & awards',
      icon: History,
    },
  ];

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen && onClose) onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    if (onClose) onClose();
  };

  const officerDistrict = currentUser?.district || "Mulshi Sub-Division, Pune";

  const panelContent = (
    <div className="flex flex-col h-full bg-white text-slate-600 select-none">
      <div className="px-4 py-3.5 border-b border-slate-200 flex items-center justify-between gap-2 shrink-0 bg-white">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-[#1E3A8A] flex items-center justify-center text-white text-xs font-black shadow-sm">
            <span className="text-[#F97316]">B</span>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 tracking-tight flex items-center gap-1.5"><span>Statutory Modules</span></div>
            <div className="text-[10px] text-slate-400 font-medium">BhoomiIQ Navigation</div>
          </div>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg bg-slate-50 hover:bg-orange-50 border border-slate-200 text-slate-500 hover:text-[#EA580C] transition cursor-pointer" title="Close Modules (Esc)">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 space-y-1.5 shrink-0">
        <div className="flex items-center gap-2 text-slate-400">
          <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <div className="truncate flex-1">
            <div className="text-[9px] uppercase font-bold tracking-wider text-slate-500 leading-none">Authority / Division</div>
            <div className="text-xs font-semibold text-slate-800 truncate mt-0.5">{officerDistrict}</div>
          </div>
        </div>
        <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-900">
          <span className="truncate max-w-[170px]">{projectData?.corridor || "Pune Ring Road"}</span>
          <span className="font-mono text-emerald-400 text-[9px] bg-emerald-500/10 px-1 rounded border border-emerald-500/20">{projectData?.parcelsCount || 48} Parcels</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-3 space-y-1.5 overflow-y-auto custom-scrollbar">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 pb-1 flex items-center justify-between"><span>Corridor Views</span><span className="text-[9px] text-slate-600 font-normal">6 Modules</span></div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button key={item.id} onClick={() => handleSelectTab(item.id)} className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all duration-150 group cursor-pointer ${isActive ? 'bg-orange-50 text-slate-900 border-l-4 border-[#F97316] shadow-sm shadow-orange-100' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-l-4 border-transparent'}`}>
              <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 transition ${isActive ? 'bg-[#F97316]/20 text-[#F97316]' : 'bg-slate-100 text-slate-500 group-hover:text-[#EA580C] group-hover:bg-orange-50'}`}><Icon className="w-4 h-4" /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1.5">
                  <span className={`text-xs font-semibold truncate ${isActive ? 'text-white' : 'text-slate-800 group-hover:text-slate-900'}`}>{item.label}</span>
                  {item.badge && <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-semibold border shrink-0 ${item.badgeColor}`}>{item.badge}</span>}
                  {item.count && <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-semibold border shrink-0 ${item.countColor}`}>{item.count}</span>}
                </div>
                <p className="text-[10px] text-slate-500 group-hover:text-slate-400 truncate mt-0.5 leading-snug">{item.description}</p>
              </div>
            </button>
          );
        })}
      </nav>

      <div className="p-3 m-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 shrink-0 shadow-sm">
        <div className="flex items-center justify-between text-xs"><span className="text-slate-400 font-medium">JMS Acquisition:</span><span className="font-mono font-bold text-amber-400">58% Completed</span></div>
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden"><div className="bg-gradient-to-r from-orange-500 to-[#F97316] h-full rounded-full transition-all duration-500" style={{ width: '58%' }} /></div>
        <div className="flex justify-between items-center text-[10px] text-slate-400 pt-0.5"><span>Section 20(E) Deadline</span><span className="text-slate-200 font-mono font-semibold">28-Oct-2024</span></div>
      </div>

      <div className="px-4 py-2.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-[10px] text-slate-500 shrink-0">
        <div className="flex items-center gap-1.5 text-slate-400"><Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" /><span>NIC RFCTLARR v2.4</span></div>
        <span className="text-slate-500">SSO Valid</span>
      </div>
    </div>
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/10 z-[10500] transition-opacity animate-in fade-in duration-200"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-80 bg-[#080D1A] z-[11000] border-r border-slate-800 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        aria-label="Statutory navigation drawer"
      >
        {panelContent}
      </aside>
    </>
  );
}

export default Sidebar;

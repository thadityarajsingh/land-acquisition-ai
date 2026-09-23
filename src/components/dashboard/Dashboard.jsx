import React, { useState, useEffect } from 'react';
import { CadastralMap } from './CadastralMap';
import { RiskScoreCard } from './RiskScoreCard';
import { RiskDrivers } from './RiskDrivers';
import { WhatIfPanel } from './WhatIfPanel';
import { ComparisonView } from './ComparisonView';
import { MitigationProtocols } from './MitigationProtocols';
import { CorridorView } from './CorridorView';
import { DisputesView } from './DisputesView';
import { MapPin, Clock, Layers, IndianRupee } from 'lucide-react';

export function Dashboard({ activeTab = 'cadastral', setActiveTab, projectData, prediction, recommendations = [], whatIfResult, onRunSimulation, simulating, onResetSimulation, searchQuery = '' }) {
  const [selectedParcel, setSelectedParcel] = useState(null);

  const filteredParcels = (projectData?.parcels || []).filter(parcel => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const gutNo = String(parcel.gutNo ?? parcel.parcel_id ?? parcel.parcelId ?? '');
    const owner = String(parcel.owner ?? parcel.owner_name ?? '');
    return gutNo.toLowerCase().includes(q) || owner.toLowerCase().includes(q);
  });

  useEffect(() => {
    if (searchQuery && filteredParcels.length > 0) setSelectedParcel(filteredParcels[0]);
  }, [searchQuery]);

  useEffect(() => {
    setSelectedParcel(null);
  }, [projectData?.project_id, projectData?.id]);

  const currentRiskScore = whatIfResult ? whatIfResult.simulatedScore : (prediction?.riskScore ?? projectData?.riskScore ?? 0);
  const currentDrivers = whatIfResult?.updatedDrivers || prediction?.drivers || projectData?.drivers || [];
  const currentEstimatedDelay = whatIfResult
    ? whatIfResult.simulatedDelay
    : prediction?.risk_score != null
      ? `${Math.round(Number(prediction.risk_score) * 180)} model-estimated days`
      : null;

  return (
    <div className="space-y-6 animate-view-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] card-hover space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[11px] font-bold font-mono px-2.5 py-1 rounded-lg bg-orange-50 text-[#C2410C] border border-orange-200/80 transition-colors">{projectData?.id || '—'}</span>
              <span className="text-xs font-medium text-slate-500 flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" />{projectData?.district ? `${projectData.district}, ${projectData.state || ''}` : 'Location unavailable'} • {projectData?.corridor || projectData?.project_type || 'Land acquisition project'}</span>
              <span className="text-[11px] bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-200/80 flex items-center gap-1.5 transition-all"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Model data loaded</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">{projectData?.name || 'Land Acquisition Risk Assessment'}</h1>
          </div>
          <div className="text-left lg:text-right"><span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Acquisition Stage</span><div className="text-xs font-bold text-slate-800">{projectData?.acquisition_stage || '—'}</div><div className="text-[10px] text-slate-500 font-mono">Project: {projectData?.id || '—'}</div></div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
          <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/70"><div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mb-1"><span>Risk Probability</span><span className="w-2 h-2 rounded-full bg-rose-500"></span></div><div className="flex items-baseline gap-1.5"><span className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight">{Number(currentRiskScore).toFixed(0)}</span><span className="text-xs font-semibold text-rose-600 font-mono">/ 100</span></div><div className="text-[10px] text-slate-400 mt-0.5">{getRiskLabel(currentRiskScore, prediction?.riskCategory)}</div></div>
          <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200/60"><div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mb-1"><span>Land Area</span><Layers className="w-3.5 h-3.5 text-blue-500" /></div><div className="flex items-baseline gap-1.5"><span className="text-2xl font-black text-slate-900 font-mono tracking-tight">{projectData?.land_area_acres ?? '—'}</span><span className="text-xs font-semibold text-slate-500">Acres</span></div><div className="text-[10px] text-slate-400 mt-0.5">{projectData?.affected_families ?? '—'} affected families</div></div>
          <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200/60"><div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mb-1"><span>Approval Delay</span><Clock className="w-3.5 h-3.5 text-rose-500" /></div><div className="flex items-baseline gap-1.5"><span className="text-2xl font-black text-rose-600 font-mono tracking-tight">{projectData?.approval_delay_days ?? '—'}</span><span className="text-xs font-semibold text-slate-500">Days</span></div><div className="text-[10px] text-slate-400 mt-0.5">Recorded project delay input</div></div>
          <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200/60"><div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mb-1"><span>Historical Delays</span><IndianRupee className="w-3.5 h-3.5 text-amber-500" /></div><div className="flex items-baseline gap-1.5"><span className="text-2xl font-black text-slate-900 font-mono tracking-tight">{projectData?.historical_delay_count ?? '—'}</span><span className="text-xs font-semibold text-slate-500">Cases</span></div><div className="text-[10px] text-slate-400 mt-0.5">Historical project signal</div></div>
        </div>
      </div>

      {activeTab === 'cadastral' && (
        <div className="space-y-5 animate-view-fade-in">
          <section className="card-hover rounded-2xl"><CadastralMap parcels={filteredParcels.length > 0 ? filteredParcels : projectData?.parcels || []} selectedGut={selectedParcel?.gutNo ?? selectedParcel?.parcel_id ?? selectedParcel?.parcelId} onSelectParcel={setSelectedParcel} /></section>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-5 space-y-5"><div className="card-hover rounded-2xl"><RiskScoreCard score={currentRiskScore} projectData={projectData} simulationDelta={whatIfResult ? whatIfResult.scoreDelta : null} estimatedDelay={currentEstimatedDelay} /></div><div className="card-hover rounded-2xl"><RiskDrivers drivers={currentDrivers} /></div></div>
            <div className="lg:col-span-7 space-y-5"><div className="card-hover rounded-2xl"><WhatIfPanel defaults={projectData?.simulationDefaults || {}} onRunSimulation={onRunSimulation} simulating={simulating} onReset={onResetSimulation} /></div><div className="card-hover rounded-2xl"><ComparisonView baseline={projectData} simulation={whatIfResult} /></div></div>
          </div>
          <section className="card-hover rounded-2xl"><MitigationProtocols recommendations={recommendations} projectData={projectData} /></section>
        </div>
      )}
      {activeTab === 'corridor' && <div className="animate-view-fade-in"><CorridorView projectData={projectData} onSelectParcel={(parcel) => { setSelectedParcel(parcel); if (setActiveTab) setActiveTab('cadastral'); }} /></div>}
      {activeTab === 'disputes' && <div className="animate-view-fade-in"><DisputesView projectData={projectData} /></div>}
      {activeTab === 'whatif' && <div className="space-y-5 animate-view-fade-in"><div className="grid grid-cols-1 lg:grid-cols-12 gap-5"><div className="lg:col-span-6 space-y-5"><div className="card-hover rounded-2xl"><WhatIfPanel defaults={projectData?.simulationDefaults || {}} onRunSimulation={onRunSimulation} simulating={simulating} onReset={onResetSimulation} /></div><div className="card-hover rounded-2xl"><RiskDrivers drivers={currentDrivers} /></div></div><div className="lg:col-span-6 space-y-5"><div className="card-hover rounded-2xl"><ComparisonView baseline={projectData} simulation={whatIfResult} /></div><div className="card-hover rounded-2xl"><RiskScoreCard score={currentRiskScore} projectData={projectData} simulationDelta={whatIfResult ? whatIfResult.scoreDelta : null} estimatedDelay={currentEstimatedDelay} /></div></div></div></div>}
    </div>
  );
}

function getRiskLabel(score, fallback) {
  const value = Number(score);
  if (Number.isFinite(value)) return value >= 70 ? 'High' : value >= 40 ? 'Medium' : 'Low';
  return fallback || 'Model risk category';
}

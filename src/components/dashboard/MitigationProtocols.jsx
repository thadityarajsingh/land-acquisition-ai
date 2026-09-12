import React, { useState } from 'react';
import { Building, Clock, ArrowRight, Download, Check, Target } from 'lucide-react';
import { GazetteModal } from './GazetteModal';

export function MitigationProtocols({ recommendations = [], projectData }) {
  const [isGazetteOpen, setIsGazetteOpen] = useState(false);
  const [initiatedActions, setInitiatedActions] = useState({});

  const handleInitiate = (recId) => setInitiatedActions(prev => ({ ...prev, [recId]: true }));

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Prescriptive Mitigation Recommendations</h2>
              <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-mono font-medium">Rule-Based</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Actions are prioritized from recorded project risk factors for review by the responsible team.</p>
          </div>
          <button type="button" onClick={() => setIsGazetteOpen(true)} className="flex items-center gap-1.5 text-xs font-semibold text-[#1E3A8A] hover:text-blue-900 border border-slate-300 px-3 py-1.5 rounded-lg hover:bg-blue-50/50 transition shadow-sm"><Download className="w-3.5 h-3.5 text-[#F97316]" /> Export Action Plan Draft</button>
        </div>

        {recommendations.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-6 text-center"><div className="text-xs font-bold text-slate-600">No active recommendations</div><p className="text-[11px] text-slate-400 mt-1">The current project has no rule-triggered mitigation actions.</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.slice(0, 6).map((rec) => {
              const isInitiated = initiatedActions[rec.id];
              const priority = rec.urgency || 'HIGH';
              return (
                <div key={rec.id} className="group relative flex flex-col justify-between p-4 rounded-xl border border-slate-200 hover:border-[#F97316]/60 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${priority === 'CRITICAL' ? 'bg-rose-100 text-rose-700 border border-rose-200' : priority === 'HIGH' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-slate-100 text-slate-700 border border-slate-200'}`}>{priority} PRIORITY</span><span className="text-[10px] font-bold font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">Risk factor</span></div>
                    <h3 className="text-xs font-bold text-slate-900 leading-snug group-hover:text-[#1E3A8A] transition-colors mb-2">{rec.title}</h3>
                    <p className="text-[11px] text-slate-600 leading-relaxed mb-3">{rec.action || rec.description}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-200/80 space-y-1.5 text-[10px] text-slate-500">
                    <div className="flex items-center justify-between gap-2"><span className="flex items-center gap-1 truncate"><Building className="w-3 h-3 text-slate-400 shrink-0" /><span className="truncate">{rec.authority || 'Project coordination team'}</span></span><span className="flex items-center gap-1 font-mono text-slate-600 font-semibold shrink-0"><Clock className="w-3 h-3 text-slate-400" />{rec.timeframe || 'Near term'}</span></div>
                    <div className="flex items-start gap-1.5 text-[9px] text-slate-400"><Target className="w-3 h-3 shrink-0 mt-0.5" /><span>Basis: {rec.basis || rec.statutoryRef || 'Recorded project risk factor'}</span></div>
                    {isInitiated ? <div className="w-full mt-2 py-1.5 px-2 bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] font-bold rounded-lg flex items-center justify-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-600" />Action queued — demo only</div> : <button type="button" onClick={() => handleInitiate(rec.id)} className="w-full mt-2 py-1.5 px-2 bg-slate-100 hover:bg-[#1E3A8A] hover:text-white text-slate-700 text-[11px] font-bold rounded-lg transition flex items-center justify-center gap-1 active:scale-98"><span>Review / Initiate</span><ArrowRight className="w-3 h-3" /></button>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400">Advisory workflow only • No automatic statutory, legal, financial, or field action is performed.</div>
      </div>
      <GazetteModal isOpen={isGazetteOpen} onClose={() => setIsGazetteOpen(false)} projectData={projectData} recommendations={recommendations} />
    </>
  );
}

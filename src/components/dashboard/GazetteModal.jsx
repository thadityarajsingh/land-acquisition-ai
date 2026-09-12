import React from 'react';
import { X, Printer, Download, FileText } from 'lucide-react';

export function GazetteModal({ isOpen, onClose, projectData, recommendations = [] }) {
  if (!isOpen) return null;

  const handlePrint = () => window.print();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-[#0F172A] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#1E3A8A] flex items-center justify-center text-[#F97316]"><FileText className="w-4 h-4" /></div>
            <div><h3 className="font-bold text-sm tracking-wide">Advisory Action Plan Draft</h3><p className="text-[11px] text-slate-400">BhoomiIQ model-assisted project review • Not an official government order</p></div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-8 overflow-y-auto text-slate-900 space-y-6 bg-[#FCFDFE]">
          <div className="text-center space-y-1 pb-4 border-b border-slate-200"><div className="text-xs font-bold uppercase tracking-widest text-slate-500">BhoomiIQ</div><div className="text-base font-extrabold uppercase tracking-wide text-slate-900">Project Risk Mitigation Action Plan</div><div className="text-xs text-slate-500">Project: {projectData?.project_id || projectData?.id || '—'} • {projectData?.district || '—'}</div></div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900"><strong>Advisory notice:</strong> This prototype document summarizes model-assisted recommendations from recorded project indicators. It is not a statutory notification, legal opinion, financial approval, or instruction to any government authority.</div>
          <div className="grid grid-cols-2 gap-3 text-xs"><div className="rounded-lg border border-slate-200 p-3"><div className="text-slate-400">Risk score</div><div className="font-bold text-lg">{projectData?.riskScore ?? '—'} / 100</div></div><div className="rounded-lg border border-slate-200 p-3"><div className="text-slate-400">Acquisition stage</div><div className="font-bold text-lg">{projectData?.acquisition_stage || '—'}</div></div></div>
          <div><div className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Recommended actions</div>{recommendations.length ? <div className="space-y-2">{recommendations.map((rec, index) => <div key={rec.id || index} className="border border-slate-200 rounded-lg p-3 text-xs"><div className="flex items-start justify-between gap-3"><strong>{index + 1}. {rec.title}</strong><span className="font-mono text-[10px]">{rec.urgency || 'HIGH'} PRIORITY</span></div><p className="mt-1 text-slate-600">{rec.action || rec.description}</p><p className="mt-1 text-[10px] text-slate-400">Basis: {rec.basis || rec.statutoryRef || 'Recorded project risk factor'} • Timeframe: {rec.timeframe || 'Near term'}</p></div>)}</div> : <p className="text-xs text-slate-500">No recommendation records are available for the current project.</p>}</div>
        </div>

        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs"><span className="text-slate-500 font-mono">Prototype advisory document</span><div className="flex items-center gap-2"><button type="button" onClick={handlePrint} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 font-semibold text-slate-700 transition"><Printer className="w-3.5 h-3.5" />Print Draft</button><button type="button" onClick={() => { alert('Advisory action plan draft generated for demo use.'); onClose(); }} className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#1E3A8A] hover:bg-blue-900 text-white font-bold transition shadow-sm"><Download className="w-3.5 h-3.5" />Generate Draft</button></div></div>
      </div>
    </div>
  );
}

import React from 'react';
import { Scale, AlertCircle, Gavel, ShieldCheck } from 'lucide-react';

export function DisputesView({ projectData }) {
  const disputes = Number(projectData?.legal_disputes ?? 0);
  const ownership = projectData?.ownership_conflict || 'Not recorded';
  const title = projectData?.title_verification_status || 'Not recorded';
  return (
    <div className="space-y-6">
      <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-1"><span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">Recorded Dispute Indicators</span><span className="text-xs text-slate-500 font-semibold">{projectData?.id || '—'}</span></div>
        <h1 className="text-xl font-black text-slate-900">Legal & Title Risk</h1>
        <p className="text-xs text-slate-500 mt-1">Only fields present in the selected project are shown. No court cases, hearings, or legal remedies are fabricated.</p>
      </section>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Indicator icon={<Gavel className="w-5 h-5 text-rose-600" />} label="Recorded legal disputes" value={disputes} />
        <Indicator icon={<AlertCircle className="w-5 h-5 text-amber-600" />} label="Ownership conflict" value={ownership} />
        <Indicator icon={<Scale className="w-5 h-5 text-blue-600" />} label="Title verification" value={title} />
      </div>
      <section className="bg-slate-50 rounded-xl border border-slate-200 p-6"><div className="flex items-center gap-2 text-sm font-bold text-slate-800"><ShieldCheck className="w-4 h-4 text-blue-600" />Advisory handling</div><p className="mt-2 text-xs leading-relaxed text-slate-600">Review the underlying land-record and legal documents before taking action. The prototype does not submit petitions, contact courts, or dispatch legal instructions.</p></section>
    </div>
  );
}
function Indicator({ icon, label, value }) {
  return <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm"><div className="flex items-center justify-between mb-3">{icon}<span className="text-[10px] font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-600">Recorded</span></div><div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{label}</div><div className="mt-1 text-2xl font-black text-slate-900">{String(value)}</div></div>;
}

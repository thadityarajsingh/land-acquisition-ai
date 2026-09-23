import React, { useMemo, useState } from 'react';
import { MapPin, Search, FolderKanban } from 'lucide-react';
import { RiskCategoryBadge } from './RiskCategoryBadge';
import { formatINR } from '../../lib/utils';

export function CorridorView({ projectData, onSelectParcel }) {
  const [filterType, setFilterType] = useState('ALL');
  const [tableSearch, setTableSearch] = useState('');
  const parcels = projectData?.parcels || [];
  const statuses = [
    ['Acquisition stage', projectData?.acquisition_stage],
    ['Notification', projectData?.notification_status],
    ['Documentation', projectData?.documentation_status],
    ['Compensation', projectData?.compensation_status],
    ['Possession', projectData?.possession_status],
  ];
  const filteredParcels = useMemo(() => parcels.filter(parcel => {
    const risk = Number(parcel.riskScore ?? parcel.risk_score ?? 0);
    const id = String(parcel.gutNo ?? parcel.parcel_id ?? parcel.parcelId ?? '');
    const owner = String(parcel.owner ?? parcel.owner_name ?? '');
    const issue = String(parcel.disputeReason ?? parcel.dispute_reason ?? '');
    const q = tableSearch.toLowerCase();
    const matchesFilter = filterType === 'ALL' || (filterType === 'HIGH' && risk >= 70) || (filterType === 'DISPUTED' && issue && !/consent/i.test(issue));
    return matchesFilter && (!q || id.toLowerCase().includes(q) || owner.toLowerCase().includes(q) || issue.toLowerCase().includes(q));
  }), [parcels, filterType, tableSearch]);

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">Project Workflow</span>
          <span className="text-xs text-slate-500 font-semibold"><MapPin className="inline w-3.5 h-3.5 mr-1" />{projectData?.district || '—'}{projectData?.state ? ', ' + projectData.state : ''}</span>
        </div>
        <h1 className="text-xl font-black text-slate-900">Acquisition Workflow & Project Register</h1>
        <p className="text-xs text-slate-500 mt-1">Statuses are read from the selected project. No statutory dates or parcel facts are generated here.</p>
      </section>
      <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Recorded Project Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {statuses.map(([label, value]) => <div key={label} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 min-h-[105px]"><div className="text-[10px] font-bold uppercase text-slate-400">{label}</div><div className="mt-2 text-sm font-bold text-slate-900">{value || 'Not recorded'}</div></div>)}
        </div>
      </section>
      <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div><h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">Loaded Parcel Register</h2><p className="text-xs text-slate-500">Only parcel records supplied by the selected project are shown.</p></div>
          <div className="flex gap-2">
            <div className="relative"><Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" /><input value={tableSearch} onChange={e => setTableSearch(e.target.value)} placeholder="Filter parcel or owner..." className="text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-300" /></div>
            <select value={filterType} onChange={e => setFilterType(e.target.value)} className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-300"><option value="ALL">All</option><option value="HIGH">High Risk</option><option value="DISPUTED">Disputed</option></select>
          </div>
        </div>
        {filteredParcels.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-xs text-slate-500"><FolderKanban className="mx-auto mb-2 h-5 w-5 text-slate-300" />No parcel records are loaded for this project.</div>
        ) : (
          <div className="overflow-x-auto"><table className="w-full text-xs text-left text-slate-600"><thead className="bg-slate-50 text-slate-700 uppercase text-[10px] font-bold"><tr><th className="p-3">Parcel</th><th className="p-3">Owner</th><th className="p-3 text-right">Area</th><th className="p-3">Classification</th><th className="p-3 text-right">Compensation</th><th className="p-3 text-center">Risk</th><th className="p-3">Issue</th></tr></thead><tbody className="divide-y divide-slate-100">
            {filteredParcels.map((parcel, index) => {
              const id = parcel.gutNo ?? parcel.parcel_id ?? parcel.parcelId ?? 'parcel-' + index;
              const risk = Number(parcel.riskScore ?? parcel.risk_score ?? 0);
              return <tr key={id} onClick={() => onSelectParcel?.(parcel)} className="hover:bg-blue-50/40 cursor-pointer"><td className="p-3 font-mono font-bold text-slate-900">{id}</td><td className="p-3">{parcel.owner ?? parcel.owner_name ?? '—'}</td><td className="p-3 text-right font-mono">{parcel.areaHa ?? parcel.area_acres ?? '—'}</td><td className="p-3">{parcel.classification ?? parcel.land_use_type ?? '—'}</td><td className="p-3 text-right font-mono">{parcel.awardedCompensation == null ? '—' : formatINR(parcel.awardedCompensation)}</td><td className="p-3 text-center"><RiskCategoryBadge score={risk} size="sm" /></td><td className="p-3">{parcel.disputeReason ?? parcel.dispute_reason ?? '—'}</td></tr>;
            })}
          </tbody></table></div>
        )}
      </section>
    </div>
  );
}

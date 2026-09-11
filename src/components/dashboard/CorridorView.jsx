import React, { useState } from 'react';
import { 
  FolderKanban, 
  MapPin, 
  Milestone, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Search, 
  Filter, 
  ArrowUpRight,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { RiskCategoryBadge } from './RiskCategoryBadge';
import { formatINR } from '../../lib/utils';

export function CorridorView({ projectData, onSelectParcel }) {
  const [filterType, setFilterType] = useState('ALL');
  const [tableSearch, setTableSearch] = useState('');

  const milestones = [
    { name: "Section 20(A) Preliminary Notification", date: "14-Feb-2024", status: "COMPLETED", color: "text-emerald-700 bg-emerald-100 border-emerald-300" },
    { name: "Joint Measurement Survey (JMS)", date: "Current (58%)", status: "IN_PROGRESS", color: "text-blue-700 bg-blue-100 border-blue-300" },
    { name: "Section 20(E) Statutory Declaration", date: "28-Oct-2024", status: "UPCOMING", color: "text-amber-800 bg-amber-100 border-amber-300" },
    { name: "Section 23 Compensation Award", date: "15-Dec-2024", status: "PENDING", color: "text-slate-600 bg-slate-100 border-slate-300" },
    { name: "Section 37 Physical Handover", date: "31-Mar-2025", status: "PROJECTED", color: "text-slate-600 bg-slate-100 border-slate-300" },
  ];

  const parcels = projectData?.parcels || [];
  const filteredParcels = parcels.filter(p => {
    const matchesFilter = filterType === 'ALL' || 
      (filterType === 'HIGH' && p.riskScore >= 70) ||
      (filterType === 'DISPUTED' && p.disputeReason && !p.disputeReason.includes('Consent'));
    const matchesSearch = p.gutNo.toLowerCase().includes(tableSearch.toLowerCase()) ||
      p.owner.toLowerCase().includes(tableSearch.toLowerCase()) ||
      p.disputeReason.toLowerCase().includes(tableSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Corridor Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-blue-50 text-[#1E3A8A] border border-blue-200">
                Corridor Alignment
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1 font-semibold">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {projectData?.corridor || 'Pune Ring Road'} • Package III
              </span>
            </div>
            <h1 className="text-xl font-black text-slate-900">
              Corridor Timeline & Land Acquisition Milestone Tracker
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Monitoring statutory compliance, gazette publication milestones, and khatedar compensation status.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition border border-slate-300">
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              Export Land Registry CSV
            </button>
          </div>
        </div>
      </div>

      {/* Statutory Milestones Stepper */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
          Statutory Acquisition Stages (RFCTLARR 2013)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {milestones.map((m, idx) => (
            <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 relative flex flex-col justify-between">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold font-mono text-slate-400">STAGE 0{idx + 1}</span>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${m.color}`}>
                  {m.status}
                </span>
              </div>
              <div className="text-xs font-bold text-slate-900 leading-snug mb-2">
                {m.name}
              </div>
              <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1 pt-2 border-t border-slate-200">
                <Clock className="w-3 h-3 text-slate-400" />
                {m.date}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Corridor Sector Parcels Detailed Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Cadastral Land Register & Title Assessment
            </h2>
            <p className="text-xs text-slate-500">
              Detailed breakdown of parcels, ownership titles, valuation claims, and stay injunctions
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                placeholder="Filter Gut No. or Owner..."
                className="text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-300 text-slate-700 bg-white font-medium"
            >
              <option value="ALL">All Parcels</option>
              <option value="HIGH">High Risk (70+ pts)</option>
              <option value="DISPUTED">Active Disputes</option>
            </select>
          </div>
        </div>

        {/* Parcels Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase text-[10px] font-bold tracking-wider border-y border-slate-200">
              <tr>
                <th className="py-3 px-3">Gut / Survey No.</th>
                <th className="py-3 px-3">Khatedar (Titleholder)</th>
                <th className="py-3 px-3 text-right">Area (Ha)</th>
                <th className="py-3 px-3">Classification</th>
                <th className="py-3 px-3 text-right">Awarded Circle Rate</th>
                <th className="py-3 px-3 text-right">Holder Demand</th>
                <th className="py-3 px-3 text-center">Risk Score</th>
                <th className="py-3 px-3">Primary Objection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredParcels.map((p) => (
                <tr
                  key={p.gutNo}
                  onClick={() => onSelectParcel && onSelectParcel(p)}
                  className="hover:bg-blue-50/40 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-3 font-mono font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{
                      backgroundColor: p.riskScore >= 70 ? '#EF4444' : p.riskScore >= 40 ? '#F59E0B' : '#10B981'
                    }} />
                    {p.gutNo}
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-800">{p.owner}</td>
                  <td className="py-3 px-3 text-right font-mono font-semibold">{p.areaHa}</td>
                  <td className="py-3 px-3 text-slate-500">{p.classification}</td>
                  <td className="py-3 px-3 text-right font-mono text-slate-700">{formatINR(p.awardedCompensation)}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-[#F97316]">{formatINR(p.compensationDemanded)}</td>
                  <td className="py-3 px-3 text-center">
                    <RiskCategoryBadge score={p.riskScore} size="sm" />
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-[11px] text-rose-600 font-medium line-clamp-1">
                      {p.disputeReason}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}

import React from 'react';
import { Map, AlertTriangle } from 'lucide-react';
import { formatINR, getRiskLevel } from '../../lib/utils';

function buildPrototypeParcels(projectData) {
  if (!projectData) return [];
  const totalArea = Number(projectData.land_area_acres);
  const totalRisk = Number(projectData.riskScore ?? 50);
  const baseArea = Number.isFinite(totalArea) && totalArea > 0 ? totalArea / 5 : null;

  return Array.from({ length: 5 }, (_, index) => ({
    gutNo: `Prototype-${String.fromCharCode(65 + index)}`,
    owner: 'Prototype parcel',
    riskScore: Math.max(0, Math.min(100, totalRisk + (index - 2) * 3)),
    areaAcres: baseArea ? Number(baseArea.toFixed(2)) : null,
    awardedCompensation: null,
    prototype: true,
  }));
}

export function CadastralMap({ parcels = [], selectedGut, onSelectParcel, projectData }) {
  const sourceParcels = parcels.length > 0 ? parcels : buildPrototypeParcels(projectData);
  const visibleParcels = sourceParcels.slice(0, 8);
  const usingPrototype = parcels.length === 0 && visibleParcels.length > 0;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div>
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <Map className="h-4 w-4 text-blue-600" />
            Cadastral Parcel Register
          </div>
          <p className="mt-0.5 text-[11px] text-slate-500">
            {usingPrototype
              ? 'Prototype parcel records are synchronized with the GIS overlay above.'
              : 'Parcel details are synchronized with the GIS overlay above.'}
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500">
          {visibleParcels.length} parcels
        </span>
      </div>

      {usingPrototype && (
        <div className="border-b border-amber-100 bg-amber-50/70 px-4 py-2 text-[10px] text-amber-800">
          Prototype geometry only — official cadastral parcel boundaries are not available in the supplied dataset.
        </div>
      )}

      <div className="grid grid-cols-1 gap-2 p-3 sm:grid-cols-2 lg:grid-cols-3">
        {visibleParcels.map((parcel) => {
          const score = Number(parcel.riskScore ?? 0);
          const risk = getRiskLevel(score);
          const selected = parcel.gutNo === selectedGut;
          return (
            <button
              key={parcel.gutNo}
              type="button"
              onClick={() => onSelectParcel?.(parcel)}
              className={`rounded-xl border p-3 text-left transition-all ${selected ? 'border-blue-400 bg-blue-50/60 ring-1 ring-blue-200' : 'border-slate-200 bg-slate-50/60 hover:border-slate-300 hover:bg-white'}`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-xs font-bold text-slate-900">{parcel.prototype ? parcel.gutNo : `Gut ${parcel.gutNo}`}</span>
                <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${risk.bg} ${risk.text}`}>
                  {risk.label}
                </span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-[10px] text-slate-500">
                <span>Owner<br /><b className="text-slate-700">{parcel.owner || '—'}</b></span>
                <span>Risk<br /><b className="text-slate-700">{score.toFixed(0)}/100</b></span>
                <span>Area<br /><b className="text-slate-700">{parcel.areaAcres ?? '—'} ac</b></span>
                <span>Compensation<br /><b className="text-slate-700">{parcel.awardedCompensation == null ? '—' : formatINR(parcel.awardedCompensation)}</b></span>
              </div>
            </button>
          );
        })}
      </div>

      {visibleParcels.length === 0 && (
        <div className="flex items-center gap-2 p-5 text-xs text-slate-500">
          <AlertTriangle className="h-4 w-4" /> No project or cadastral parcel data is available.
        </div>
      )}
    </section>
  );
}

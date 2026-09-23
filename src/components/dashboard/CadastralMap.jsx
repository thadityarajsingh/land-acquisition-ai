import React from 'react';
import { Map, AlertTriangle } from 'lucide-react';
import { formatINR, getRiskLevel } from '../../lib/utils';

export function CadastralMap({ parcels = [], selectedGut, onSelectParcel }) {
  const visibleParcels = parcels.slice(0, 8);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div>
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <Map className="h-4 w-4 text-blue-600" />
            Cadastral Parcel Register
          </div>
          <p className="mt-0.5 text-[11px] text-slate-500">
            Only loaded parcel records are shown; polygon boundaries come from the GIS layer.
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500">
          {visibleParcels.length} parcels
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2 p-3 sm:grid-cols-2 lg:grid-cols-3">
        {visibleParcels.map((parcel, index) => {
          const id = parcel.gutNo ?? parcel.parcel_id ?? parcel.parcelId ?? `parcel-${index}`;
          const owner = parcel.owner ?? parcel.owner_name ?? '—';
          const score = Number(parcel.riskScore ?? parcel.risk_score ?? 0);
          const risk = getRiskLevel(Number.isFinite(score) ? score : 0);
          const selected = String(id) === String(selectedGut);

          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelectParcel?.(parcel)}
              className={`rounded-xl border p-3 text-left transition-all ${
                selected
                  ? 'border-blue-400 bg-blue-50/60 ring-1 ring-blue-200'
                  : 'border-slate-200 bg-slate-50/60 hover:border-slate-300 hover:bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-xs font-bold text-slate-900">{id}</span>
                <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${risk.bg} ${risk.text}`}>
                  {risk.label}
                </span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-[10px] text-slate-500">
                <span>Owner<br /><b className="text-slate-700">{owner}</b></span>
                <span>Risk<br /><b className="text-slate-700">{(Number.isFinite(score) ? score : 0).toFixed(0)}/100</b></span>
                <span>Area<br /><b className="text-slate-700">{parcel.areaAcres ?? parcel.area_acres ?? '—'} ac</b></span>
                <span>Compensation<br /><b className="text-slate-700">{parcel.awardedCompensation == null ? '—' : formatINR(parcel.awardedCompensation)}</b></span>
              </div>
            </button>
          );
        })}
      </div>

      {visibleParcels.length === 0 && (
        <div className="flex items-center gap-2 p-5 text-xs text-slate-500">
          <AlertTriangle className="h-4 w-4" />
          No official cadastral parcel records are loaded. Add project-area GeoJSON to render real boundaries.
        </div>
      )}
    </section>
  );
}

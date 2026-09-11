import React, { useEffect, useState } from 'react';
import { Compass, Map, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

const DEFAULT_RISK = 50;

export function CadastralMap({ projectId, projectName, district, projectType, latitude, longitude, parcels = [], selectedGut, onSelectParcel }) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeParcel, setActiveParcel] = useState(parcels.find((parcel) => parcel.gutNo === selectedGut) || null);

  useEffect(() => {
    setActiveParcel(parcels.find((parcel) => parcel.gutNo === selectedGut) || null);
  }, [selectedGut, parcels]);

  const hasCoordinates = Number.isFinite(Number(latitude)) && Number.isFinite(Number(longitude));
  const riskScore = Number(parcels?.[0]?.riskScore) || DEFAULT_RISK;
  const handleSelect = (parcel) => { setActiveParcel(parcel); onSelectParcel?.(parcel); };
  const parcelNames = ['Parcel A', 'Parcel B', 'Parcel C', 'Parcel D', 'Parcel E'];
  const riskForParcel = (index) => Math.max(0, Math.min(100, riskScore + (index - 2) * 8));
  const fillForRisk = (risk, selected) => risk >= 70 ? (selected ? '#F87171' : '#DC2626') : risk >= 40 ? (selected ? '#FBBF24' : '#D97706') : (selected ? '#34D399' : '#059669');

  return (
    <div className="bg-[#0A0F1D] rounded-2xl border border-slate-800 shadow-sm overflow-hidden flex flex-col min-h-[460px]">
      <div className="bg-slate-950/70 border-b border-slate-800/80 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-2"><Map className="w-4 h-4 text-[#F97316]" /><span className="font-bold text-white tracking-wide">Project Geospatial View</span><span className="text-[10px] bg-blue-900/40 text-blue-300 px-1.5 py-0.2 rounded border border-blue-600/30 font-mono">EPSG:4326</span><span className="text-[10px] text-slate-500 font-mono">Scale: {Math.round(zoomLevel * 100)}%</span></div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400"><span>{projectId || '—'}</span><span>•</span><span>{projectType || 'Land Acquisition'}</span></div>
      </div>

      <div className="relative flex-1 bg-[#060A14] flex flex-col md:flex-row overflow-hidden">
        <div className="flex-1 relative p-4 flex items-center justify-center min-h-[320px] overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b10_1px,transparent_1px),linear-gradient(to_bottom,#1e293b10_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />
          <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
            <div className="w-7 h-7 rounded-lg bg-slate-900/90 border border-slate-700/80 flex items-center justify-center text-slate-300" title="North Indicator"><Compass className="w-3.5 h-3.5 text-[#F97316]" /></div>
            <button type="button" onClick={() => setZoomLevel((value) => Math.min(1.8, Number((value + 0.15).toFixed(2))))} className="w-7 h-7 rounded-lg bg-slate-900/90 border border-slate-700/80 flex items-center justify-center text-slate-300 hover:bg-slate-800" title="Zoom In"><ZoomIn className="w-3.5 h-3.5" /></button>
            <button type="button" onClick={() => setZoomLevel((value) => Math.max(0.7, Number((value - 0.15).toFixed(2))))} className="w-7 h-7 rounded-lg bg-slate-900/90 border border-slate-700/80 flex items-center justify-center text-slate-300 hover:bg-slate-800" title="Zoom Out"><ZoomOut className="w-3.5 h-3.5" /></button>
            <button type="button" onClick={() => setZoomLevel(1)} className="w-7 h-7 rounded-lg bg-slate-900/90 border border-slate-700/80 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800" title="Reset Zoom"><RotateCcw className="w-3 h-3" /></button>
          </div>

          <div className="w-full h-full flex items-center justify-center transition-transform duration-300 ease-out" style={{ transform: `scale(${zoomLevel})` }}>
            <svg className="w-full h-full max-h-[350px] max-w-[540px] drop-shadow-2xl" viewBox="0 0 600 380">
              <circle cx="300" cy="185" r="110" fill="none" stroke="#60A5FA" strokeWidth="2" strokeDasharray="5 5" strokeOpacity="0.35" />
              <circle cx="300" cy="185" r="5" fill="#F97316" /><circle cx="300" cy="185" r="11" fill="none" stroke="#F97316" strokeWidth="2" strokeOpacity="0.65" />
              {[0, 1, 2, 3, 4].map((index) => { const x = 70 + index * 105; const y = 125 + (index % 2) * 22; const risk = riskForParcel(index); const parcel = parcels[index]; const selected = activeParcel && parcel && activeParcel.gutNo === parcel.gutNo; return <g key={index} onClick={() => parcel && handleSelect(parcel)} className={parcel ? 'cursor-pointer' : ''}><polygon points={`${x},${y} ${x + 100},${y - 10} ${x + 92},${y + 100} ${x - 8},${y + 90}`} fill={fillForRisk(risk, selected)} fillOpacity={selected ? 0.95 : 0.65} stroke={selected ? '#FDE047' : 'rgba(255,255,255,0.3)'} strokeWidth={selected ? 3.5 : 1} /><text x={x + 18} y={y + 50} fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="monospace">{parcel?.gutNo || parcelNames[index]}</text><text x={x + 18} y={y + 66} fill="#D1FAE5" fontSize="9" fontFamily="monospace">Risk {Math.round(risk)}</text></g>; })}
              <text x="215" y="315" fill="#93C5FD" fontSize="10" fontFamily="monospace" fontWeight="bold">{hasCoordinates ? 'Synthetic project center' : 'Project coordinates unavailable'}</text>
            </svg>
          </div>
        </div>

        <aside className="w-full md:w-[330px] border-l border-slate-800 bg-slate-950/60 p-5 flex flex-col justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Project Location</div>
            <div className="mt-1 text-sm font-bold text-white">{district || projectName || 'Land Acquisition Project'}</div>
            <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900/70 p-3"><div className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Latitude</div><div className="font-mono text-lg text-slate-100">{hasCoordinates ? Number(latitude).toFixed(6) : '—'}</div><div className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mt-2">Longitude</div><div className="font-mono text-lg text-slate-100">{hasCoordinates ? Number(longitude).toFixed(6) : '—'}</div></div>
            <div className="mt-3 text-[10px] leading-4 text-amber-300/80">Demo coordinates represent a district-center location. They are not official cadastral survey coordinates.</div>
          </div>
          <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-500 font-mono">Source: synthetic project dataset • EPSG:4326</div>
        </aside>
      </div>
    </div>
  );
}

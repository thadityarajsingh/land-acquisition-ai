import React, { useState } from 'react';
import { Map, Layers, Compass, ZoomIn, ZoomOut, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { formatINR } from '../../lib/utils';

export function CadastralMap({ parcels = [], selectedGut, onSelectParcel }) {
  const [activeLayer, setActiveLayer] = useState('cadastral'); // 'cadastral' | 'valuation'
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeParcel, setActiveParcel] = useState(
    parcels.find(p => p.gutNo === selectedGut) || parcels[0] || null
  );

  const handleSelect = (parcel) => {
    setActiveParcel(parcel);
    if (onSelectParcel) onSelectParcel(parcel);
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(1.8, Number((prev + 0.15).toFixed(2))));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(0.7, Number((prev - 0.15).toFixed(2))));
  const handleZoomReset = () => setZoomLevel(1);

  const getPolygonFill = (parcel, isSelected) => {
    if (activeLayer === 'valuation') {
      const spread = (parcel.compensationDemanded / parcel.awardedCompensation) || 1;
      if (spread > 3.0) return isSelected ? '#C084FC' : '#9333EA';
      if (spread > 1.5) return isSelected ? '#FB923C' : '#EA580C';
      return isSelected ? '#38BDF8' : '#0284C7';
    }

    if (parcel.riskScore >= 70) return isSelected ? '#F87171' : '#DC2626';
    if (parcel.riskScore >= 40) return isSelected ? '#FBBF24' : '#D97706';
    return isSelected ? '#34D399' : '#059669';
  };

  return (
    <div className="bg-[#0A0F1D] rounded-2xl border border-slate-800 shadow-sm overflow-hidden flex flex-col min-h-[460px] transition-all duration-300">
      
      {/* Map Control Bar */}
      <div className="bg-slate-950/70 border-b border-slate-800/80 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Map className="w-4 h-4 text-[#F97316]" />
          <span className="font-bold text-white tracking-wide">Cadastral Vector Surface</span>
          <span className="text-[10px] bg-blue-900/40 text-blue-300 px-1.5 py-0.2 rounded border border-blue-600/30 font-mono">
            EPSG:4326
          </span>
          <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
            Scale: {Math.round(zoomLevel * 100)}%
          </span>
        </div>

        {/* Layer Toggles */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveLayer('cadastral')}
            className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all duration-200 cursor-pointer ${
              activeLayer === 'cadastral'
                ? 'bg-[#1E3A8A] text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Cadastral Risk
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('valuation')}
            className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all duration-200 cursor-pointer ${
              activeLayer === 'valuation'
                ? 'bg-[#1E3A8A] text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Valuation Heatmap
          </button>
        </div>

        {/* Legend */}
        <div className="hidden md:flex items-center gap-3 text-[11px]">
          {activeLayer === 'cadastral' ? (
            <>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]"></span>
                <span className="text-slate-400">Low (&lt;40)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]"></span>
                <span className="text-slate-400">Medium (40-69)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.6)]"></span>
                <span className="text-slate-400">High (70+)</span>
              </span>
            </>
          ) : (
            <>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                <span className="text-slate-400">&lt;1.5x</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                <span className="text-slate-400">1.5 - 3x</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                <span className="text-slate-400">&gt;3x</span>
              </span>
            </>
          )}
        </div>
      </div>

      {/* Main Geospatial Canvas */}
      <div className="relative flex-1 bg-[#060A14] flex flex-col md:flex-row overflow-hidden">
        
        {/* SVG Polygon Grid */}
        <div className="flex-1 relative p-4 flex items-center justify-center min-h-[320px] overflow-hidden">
          
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b10_1px,transparent_1px),linear-gradient(to_bottom,#1e293b10_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

          {/* Minimalist Floating Controls */}
          <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
            <div
              className="w-7 h-7 rounded-lg bg-slate-900/90 border border-slate-700/80 flex items-center justify-center text-slate-300 shadow-sm transition-transform duration-200 hover:scale-105"
              title="North Indicator"
            >
              <Compass className="w-3.5 h-3.5 text-[#F97316]" />
            </div>
            <button
              type="button"
              onClick={handleZoomIn}
              className="w-7 h-7 rounded-lg bg-slate-900/90 border border-slate-700/80 flex items-center justify-center text-slate-300 shadow-sm hover:bg-slate-800 transition-all duration-150 active:scale-90 cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              className="w-7 h-7 rounded-lg bg-slate-900/90 border border-slate-700/80 flex items-center justify-center text-slate-300 shadow-sm hover:bg-slate-800 transition-all duration-150 active:scale-90 cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleZoomReset}
              className="w-7 h-7 rounded-lg bg-slate-900/90 border border-slate-700/80 flex items-center justify-center text-slate-400 hover:text-white shadow-sm hover:bg-slate-800 transition-all duration-150 active:scale-90 cursor-pointer"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Cadastral Vector Polygon Map with Smooth Zoom Transition */}
          <div
            className="w-full h-full flex items-center justify-center transition-transform duration-300 ease-out"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <svg className="w-full h-full max-h-[350px] max-w-[540px] drop-shadow-2xl" viewBox="0 0 600 380">
              
              {/* Linear RoW Buffer */}
              <path
                d="M 20 190 Q 300 150 580 180"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="56"
                strokeOpacity="0.10"
              />
              <path
                d="M 20 190 Q 300 150 580 180"
                fill="none"
                stroke="#60A5FA"
                strokeWidth="2"
                strokeDasharray="5 4"
              />
              <text x="32" y="170" fill="#93C5FD" fontSize="10" fontFamily="monospace" fontWeight="bold">
                Pune Ring Road RoW Alignment (Package III)
              </text>

              {/* Polygon 1: Gut 104/1A */}
              <g
                onClick={() => handleSelect(parcels[0])}
                className="cursor-pointer transition-all duration-200 hover:opacity-95"
              >
                <polygon
                  points="80,110 190,100 180,210 70,190"
                  fill={getPolygonFill(parcels[0] || {}, activeParcel?.gutNo === '104/1A')}
                  fillOpacity={activeParcel?.gutNo === '104/1A' ? 0.95 : 0.65}
                  stroke={activeParcel?.gutNo === '104/1A' ? '#FDE047' : 'rgba(255,255,255,0.3)'}
                  strokeWidth={activeParcel?.gutNo === '104/1A' ? 3.5 : 1}
                  className="transition-all duration-300"
                />
                <text x="105" y="155" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  Gut 104/1A
                </text>
                <text x="105" y="170" fill="#FEE2E2" fontSize="9" fontFamily="monospace">
                  {activeLayer === 'valuation' ? '3.8x Spread' : '88 pts'}
                </text>
              </g>

              {/* Polygon 2: Gut 104/1B */}
              <g
                onClick={() => handleSelect(parcels[1])}
                className="cursor-pointer transition-all duration-200 hover:opacity-95"
              >
                <polygon
                  points="190,100 290,120 280,225 180,210"
                  fill={getPolygonFill(parcels[1] || {}, activeParcel?.gutNo === '104/1B')}
                  fillOpacity={activeParcel?.gutNo === '104/1B' ? 0.95 : 0.6}
                  stroke={activeParcel?.gutNo === '104/1B' ? '#FDE047' : 'rgba(255,255,255,0.3)'}
                  strokeWidth={activeParcel?.gutNo === '104/1B' ? 3.5 : 1}
                  className="transition-all duration-300"
                />
                <text x="210" y="160" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  Gut 104/1B
                </text>
                <text x="210" y="175" fill="#FEE2E2" fontSize="9" fontFamily="monospace">
                  {activeLayer === 'valuation' ? '2.3x Spread' : '78 pts'}
                </text>
              </g>

              {/* Polygon 3: Gut 105/2 */}
              <g
                onClick={() => handleSelect(parcels[2])}
                className="cursor-pointer transition-all duration-200 hover:opacity-95"
              >
                <polygon
                  points="290,120 400,105 390,220 280,225"
                  fill={getPolygonFill(parcels[2] || {}, activeParcel?.gutNo === '105/2')}
                  fillOpacity={activeParcel?.gutNo === '105/2' ? 0.95 : 0.65}
                  stroke={activeParcel?.gutNo === '105/2' ? '#FDE047' : 'rgba(255,255,255,0.3)'}
                  strokeWidth={activeParcel?.gutNo === '105/2' ? 3.5 : 1}
                  className="transition-all duration-300"
                />
                <text x="315" y="165" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  Gut 105/2
                </text>
                <text x="315" y="180" fill="#FEE2E2" fontSize="9" fontFamily="monospace">
                  {activeLayer === 'valuation' ? '2.6x Spread' : '84 pts'}
                </text>
              </g>

              {/* Polygon 4: Gut 106/3 */}
              <g
                onClick={() => handleSelect(parcels[3])}
                className="cursor-pointer transition-all duration-200 hover:opacity-95"
              >
                <polygon
                  points="400,105 490,115 480,230 390,220"
                  fill={getPolygonFill(parcels[3] || {}, activeParcel?.gutNo === '106/3')}
                  fillOpacity={activeParcel?.gutNo === '106/3' ? 0.95 : 0.6}
                  stroke={activeParcel?.gutNo === '106/3' ? '#FDE047' : 'rgba(255,255,255,0.3)'}
                  strokeWidth={activeParcel?.gutNo === '106/3' ? 3.5 : 1}
                  className="transition-all duration-300"
                />
                <text x="415" y="165" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  Gut 106/3
                </text>
                <text x="415" y="180" fill="#FEF3C7" fontSize="9" fontFamily="monospace">
                  {activeLayer === 'valuation' ? '1.5x Spread' : '46 pts'}
                </text>
              </g>

              {/* Polygon 5: Gut 107/1 */}
              <g
                onClick={() => handleSelect(parcels[4])}
                className="cursor-pointer transition-all duration-200 hover:opacity-95"
              >
                <polygon
                  points="490,115 570,130 560,240 480,230"
                  fill={getPolygonFill(parcels[4] || {}, activeParcel?.gutNo === '107/1')}
                  fillOpacity={activeParcel?.gutNo === '107/1' ? 0.95 : 0.6}
                  stroke={activeParcel?.gutNo === '107/1' ? '#FDE047' : 'rgba(255,255,255,0.3)'}
                  strokeWidth={activeParcel?.gutNo === '107/1' ? 3.5 : 1}
                  className="transition-all duration-300"
                />
                <text x="500" y="175" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  Gut 107/1
                </text>
                <text x="500" y="190" fill="#D1FAE5" fontSize="9" fontFamily="monospace">
                  {activeLayer === 'valuation' ? '1.02x Match' : '28 pts'}
                </text>
              </g>
            </svg>
          </div>

          <div className="absolute bottom-3 left-4 text-[10px] font-mono text-slate-500">
            Chainage 164+000 - 165+200 • Lat: 18.498°N, Lon: 73.502°E
          </div>
        </div>

        {/* Right Inspector Drawer */}
        <div className="w-full md:w-80 bg-[#080D1A] border-t md:border-t-0 md:border-l border-slate-800/80 p-4 flex flex-col justify-between text-xs transition-all duration-300">
          {activeParcel ? (
            <div className="space-y-3 animate-view-fade-in">
              <div className="flex items-start justify-between pb-2.5 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono text-[#F97316] font-bold uppercase tracking-wider">
                    Cadastral Parcel
                  </span>
                  <div className="text-base font-black text-white font-mono">
                    Gut No. {activeParcel.gutNo}
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono transition-all duration-200 ${
                  activeParcel.riskScore >= 70
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : activeParcel.riskScore >= 40
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}>
                  Risk: {activeParcel.riskScore}/100
                </span>
              </div>

              <div className="space-y-2 text-slate-300">
                <div>
                  <div className="text-[10px] text-slate-500">Registered Titleholder:</div>
                  <div className="font-semibold text-slate-100">{activeParcel.owner}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-500">Area</div>
                    <div className="font-bold font-mono text-white">{activeParcel.areaHa} Ha</div>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-500">Land Type</div>
                    <div className="font-bold text-slate-200 truncate">{activeParcel.classification}</div>
                  </div>
                </div>

                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-500">Primary Injunction / Objection:</div>
                  <div className="text-rose-400 font-semibold text-[11px] mt-0.5 leading-snug">
                    {activeParcel.disputeReason}
                  </div>
                </div>

                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Awarded Benchmark:</span>
                    <span className="font-mono text-slate-200">{formatINR(activeParcel.awardedCompensation)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Holder Demand:</span>
                    <span className="font-mono text-[#F97316] font-bold">{formatINR(activeParcel.compensationDemanded)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                    <span>Valuation Spread:</span>
                    <span className="font-mono text-purple-300 font-bold">
                      {(activeParcel.compensationDemanded / activeParcel.awardedCompensation).toFixed(1)}x Spread
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-slate-500 text-center py-8">
              Click any parcel on the GIS map to inspect details.
            </div>
          )}

          <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
            <span>Source: Bhoomi Abhilekh 7/12</span>
            <span className="text-emerald-400 font-medium">Verified</span>
          </div>
        </div>

      </div>

    </div>
  );
}

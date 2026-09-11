import React, { useState } from 'react';
import { Map, Layers, Compass, ZoomIn, ZoomOut, AlertCircle, CheckCircle, Info, RotateCcw } from 'lucide-react';
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

  // Determine fill color based on active layer
  const getPolygonFill = (parcel, isSelected) => {
    if (activeLayer === 'valuation') {
      // Valuation Spread Heatmap
      const spread = (parcel.compensationDemanded / parcel.awardedCompensation) || 1;
      if (spread > 3.0) return isSelected ? '#A855F7' : '#7E22CE'; // High Valuation Gap (Purple)
      if (spread > 1.5) return isSelected ? '#F97316' : '#EA580C'; // Moderate Valuation Gap (Orange)
      return isSelected ? '#06B6D4' : '#0891B2'; // Minor Gap (Cyan)
    }

    // Default: Cadastral Risk Score
    if (parcel.riskScore >= 70) return isSelected ? '#EF4444' : '#DC2626';
    if (parcel.riskScore >= 40) return isSelected ? '#F59E0B' : '#D97706';
    return isSelected ? '#10B981' : '#059669';
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-md overflow-hidden flex flex-col h-full min-h-[460px]">
      
      {/* Map Control Bar */}
      <div className="bg-slate-950/80 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <Map className="w-4 h-4 text-[#F97316]" />
          <span className="font-bold text-white tracking-wide">Cadastral Vector Surface</span>
          <span className="text-[10px] bg-blue-900/60 text-blue-300 px-1.5 py-0.5 rounded border border-blue-700/50 font-mono">
            EPSG:4326 (WGS 84)
          </span>
          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
            Scale: {Math.round(zoomLevel * 100)}%
          </span>
        </div>

        {/* Layer Toggles */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveLayer('cadastral')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition ${
              activeLayer === 'cadastral' ? 'bg-[#1E3A8A] text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Cadastral Risk
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('valuation')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition ${
              activeLayer === 'valuation' ? 'bg-[#1E3A8A] text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Valuation Spread Heatmap
          </button>
        </div>

        {/* Legend */}
        <div className="hidden md:flex items-center gap-3 text-[11px]">
          {activeLayer === 'cadastral' ? (
            <>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span> Low (&lt;40)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span> Medium (40-69)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500"></span> High (70+)
              </span>
            </>
          ) : (
            <>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500"></span> Minimal Gap (&lt;1.5x)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-orange-500"></span> Moderate (1.5 - 3x)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-purple-500"></span> Severe Gap (&gt;3x)
              </span>
            </>
          )}
        </div>
      </div>

      {/* Main Vector Surface Canvas */}
      <div className="relative flex-1 bg-[#0A0F1D] flex flex-col md:flex-row overflow-hidden">
        
        {/* SVG Interactive Geospatial Grid */}
        <div className="flex-1 relative p-4 flex items-center justify-center min-h-[320px] overflow-hidden">
          
          {/* Simulated GIS Coordinates Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

          {/* Compass & Interactive Zoom Overlay */}
          <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
            <div
              className="w-7 h-7 rounded bg-slate-900/90 border border-slate-700 flex items-center justify-center text-slate-300 shadow"
              title="North Compass Orientation"
            >
              <Compass className="w-4 h-4 text-[#F97316]" />
            </div>
            <button
              type="button"
              onClick={handleZoomIn}
              className="w-7 h-7 rounded bg-slate-900/90 border border-slate-700 flex items-center justify-center text-slate-300 shadow hover:bg-slate-800 transition active:scale-95"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              className="w-7 h-7 rounded bg-slate-900/90 border border-slate-700 flex items-center justify-center text-slate-300 shadow hover:bg-slate-800 transition active:scale-95"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleZoomReset}
              className="w-7 h-7 rounded bg-slate-900/90 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white shadow hover:bg-slate-800 transition text-[10px] font-mono"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Cadastral Vector Polygon Map with dynamic Zoom Scale */}
          <div
            className="w-full h-full flex items-center justify-center transition-transform duration-300 ease-out"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <svg className="w-full h-full max-h-[360px] max-w-[540px] drop-shadow-2xl" viewBox="0 0 600 380">
              
              {/* Linear Highway Right of Way (RoW) Corridor Buffer */}
              <path
                d="M 20 190 Q 300 150 580 180"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="54"
                strokeOpacity="0.12"
              />
              <path
                d="M 20 190 Q 300 150 580 180"
                fill="none"
                stroke="#60A5FA"
                strokeWidth="2"
                strokeDasharray="6 4"
              />
              <text x="32" y="170" fill="#93C5FD" fontSize="10" fontFamily="monospace" fontWeight="bold">
                Pune Ring Road Alignment (Package III RoW)
              </text>

              {/* Polygon 1: Gut 104/1A */}
              <g
                onClick={() => handleSelect(parcels[0])}
                className="cursor-pointer transition-transform hover:scale-[1.01]"
              >
                <polygon
                  points="80,110 190,100 180,210 70,190"
                  fill={getPolygonFill(parcels[0] || {}, activeParcel?.gutNo === '104/1A')}
                  fillOpacity={activeParcel?.gutNo === '104/1A' ? 0.9 : 0.65}
                  stroke={activeParcel?.gutNo === '104/1A' ? '#FBBF24' : '#FECACA'}
                  strokeWidth={activeParcel?.gutNo === '104/1A' ? 3.5 : 1.5}
                />
                <text x="105" y="155" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  Gut 104/1A
                </text>
                <text x="105" y="170" fill="#FEE2E2" fontSize="9" fontFamily="monospace">
                  {activeLayer === 'valuation' ? '3.8x Spread' : '88 pts (Stay)'}
                </text>
              </g>

              {/* Polygon 2: Gut 104/1B */}
              <g
                onClick={() => handleSelect(parcels[1])}
                className="cursor-pointer transition-transform hover:scale-[1.01]"
              >
                <polygon
                  points="190,100 290,120 280,225 180,210"
                  fill={getPolygonFill(parcels[1] || {}, activeParcel?.gutNo === '104/1B')}
                  fillOpacity={activeParcel?.gutNo === '104/1B' ? 0.9 : 0.6}
                  stroke={activeParcel?.gutNo === '104/1B' ? '#FBBF24' : '#FECACA'}
                  strokeWidth={activeParcel?.gutNo === '104/1B' ? 3.5 : 1.5}
                />
                <text x="210" y="160" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  Gut 104/1B
                </text>
                <text x="210" y="175" fill="#FEE2E2" fontSize="9" fontFamily="monospace">
                  {activeLayer === 'valuation' ? '2.3x Spread' : '78 pts (Gairan)'}
                </text>
              </g>

              {/* Polygon 3: Gut 105/2 */}
              <g
                onClick={() => handleSelect(parcels[2])}
                className="cursor-pointer transition-transform hover:scale-[1.01]"
              >
                <polygon
                  points="290,120 400,105 390,220 280,225"
                  fill={getPolygonFill(parcels[2] || {}, activeParcel?.gutNo === '105/2')}
                  fillOpacity={activeParcel?.gutNo === '105/2' ? 0.9 : 0.65}
                  stroke={activeParcel?.gutNo === '105/2' ? '#FBBF24' : '#FECACA'}
                  strokeWidth={activeParcel?.gutNo === '105/2' ? 3.5 : 1.5}
                />
                <text x="315" y="165" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  Gut 105/2
                </text>
                <text x="315" y="180" fill="#FEE2E2" fontSize="9" fontFamily="monospace">
                  {activeLayer === 'valuation' ? '2.6x Spread' : '84 pts (Tree Val)'}
                </text>
              </g>

              {/* Polygon 4: Gut 106/3 */}
              <g
                onClick={() => handleSelect(parcels[3])}
                className="cursor-pointer transition-transform hover:scale-[1.01]"
              >
                <polygon
                  points="400,105 490,115 480,230 390,220"
                  fill={getPolygonFill(parcels[3] || {}, activeParcel?.gutNo === '106/3')}
                  fillOpacity={activeParcel?.gutNo === '106/3' ? 0.9 : 0.6}
                  stroke={activeParcel?.gutNo === '106/3' ? '#FBBF24' : '#FDE68A'}
                  strokeWidth={activeParcel?.gutNo === '106/3' ? 3.5 : 1.5}
                />
                <text x="415" y="165" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  Gut 106/3
                </text>
                <text x="415" y="180" fill="#FEF3C7" fontSize="9" fontFamily="monospace">
                  {activeLayer === 'valuation' ? '1.5x Spread' : '46 pts (NA)'}
                </text>
              </g>

              {/* Polygon 5: Gut 107/1 */}
              <g
                onClick={() => handleSelect(parcels[4])}
                className="cursor-pointer transition-transform hover:scale-[1.01]"
              >
                <polygon
                  points="490,115 570,130 560,240 480,230"
                  fill={getPolygonFill(parcels[4] || {}, activeParcel?.gutNo === '107/1')}
                  fillOpacity={activeParcel?.gutNo === '107/1' ? 0.9 : 0.6}
                  stroke={activeParcel?.gutNo === '107/1' ? '#FBBF24' : '#A7F3D0'}
                  strokeWidth={activeParcel?.gutNo === '107/1' ? 3.5 : 1.5}
                />
                <text x="500" y="175" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  Gut 107/1
                </text>
                <text x="500" y="190" fill="#D1FAE5" fontSize="9" fontFamily="monospace">
                  {activeLayer === 'valuation' ? '1.02x Match' : '28 pts (Consent)'}
                </text>
              </g>
            </svg>
          </div>

          {/* Coordinates footer */}
          <div className="absolute bottom-3 left-4 text-[10px] font-mono text-slate-500">
            Chainage 164+000 - 165+200 • Lat: 18.498°N, Lon: 73.502°E
          </div>
        </div>

        {/* Right Inspector Drawer for Selected Parcel */}
        <div className="w-full md:w-80 bg-slate-950 border-t md:border-t-0 md:border-l border-slate-800 p-4 flex flex-col justify-between text-xs">
          {activeParcel ? (
            <div className="space-y-3">
              <div className="flex items-start justify-between pb-2 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono text-[#F97316] font-bold uppercase tracking-wider">
                    Cadastral Inspector
                  </span>
                  <div className="text-base font-black text-white font-mono">
                    Gut No. {activeParcel.gutNo}
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                  activeParcel.riskScore >= 70
                    ? 'bg-rose-900/60 text-rose-300 border border-rose-700'
                    : activeParcel.riskScore >= 40
                    ? 'bg-amber-900/60 text-amber-300 border border-amber-700'
                    : 'bg-emerald-900/60 text-emerald-300 border border-emerald-700'
                }`}>
                  Risk: {activeParcel.riskScore}/100
                </span>
              </div>

              <div className="space-y-2 text-slate-300">
                <div>
                  <div className="text-[10px] text-slate-500">Recorded Title Holder:</div>
                  <div className="font-semibold text-slate-200">{activeParcel.owner}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <div className="text-[10px] text-slate-500">Area</div>
                    <div className="font-bold font-mono text-white">{activeParcel.areaHa} Hectares</div>
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <div className="text-[10px] text-slate-500">Type</div>
                    <div className="font-bold text-slate-300 truncate">{activeParcel.classification}</div>
                  </div>
                </div>

                <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                  <div className="text-[10px] text-slate-500">Dispute & Injunction Summary:</div>
                  <div className="text-rose-400 font-semibold text-[11px] mt-0.5 leading-snug">
                    {activeParcel.disputeReason}
                  </div>
                </div>

                <div className="bg-slate-900 p-2.5 rounded border border-slate-800 space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Awarded Circle Rate:</span>
                    <span className="font-mono text-slate-300">{formatINR(activeParcel.awardedCompensation)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Demanded by Holder:</span>
                    <span className="font-mono text-[#F97316] font-bold">{formatINR(activeParcel.compensationDemanded)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800">
                    <span>Valuation Spread:</span>
                    <span className="font-mono text-purple-400 font-bold">
                      {(activeParcel.compensationDemanded / activeParcel.awardedCompensation).toFixed(1)}x Spread
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-slate-500 text-center py-8">
              Click any parcel on the GIS map to inspect title and dispute details.
            </div>
          )}

          <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
            <span>Cadastral Source: SLR 7/12</span>
            <span className="text-emerald-400 font-medium">Synced Live</span>
          </div>
        </div>

      </div>

    </div>
  );
}

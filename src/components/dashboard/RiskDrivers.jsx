import React from 'react';
import { ArrowUpRight, ArrowDownRight, Layers, HelpCircle } from 'lucide-react';

export function RiskDrivers({ drivers = [] }) {
  const maxImpact = Math.max(...drivers.map(d => Math.abs(d.impact)), 25);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow">
      
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Top Explainable Risk Drivers (SHAP)
            </h2>
            <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-mono font-medium">
              Feature Attribution
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Key friction points driving delay probability up (+) or mitigated down (-)
          </p>
        </div>
      </div>

      {/* Driver List with Visual Impact Bars */}
      <div className="space-y-3.5">
        {drivers.map((driver, idx) => {
          const isUp = driver.direction === 'up' || driver.impact > 0;
          const barPct = Math.min(100, Math.round((Math.abs(driver.impact) / maxImpact) * 100));

          return (
            <div key={idx} className="group p-3 rounded-lg border border-slate-100 hover:border-slate-300 hover:bg-slate-50/70 transition-all">
              
              <div className="flex items-center justify-between gap-3 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={`p-1 rounded ${isUp ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-slate-900 leading-tight">
                      {driver.name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">
                      {driver.category}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                    isUp ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {driver.displayImpact || (isUp ? `+${driver.impact} pts` : `${driver.impact} pts`)}
                  </span>
                </div>
              </div>

              {/* Proportional Impact Bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-1">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isUp ? 'bg-rose-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${barPct}%` }}
                />
              </div>

              {driver.description && (
                <p className="text-[11px] text-slate-600 line-clamp-1 mt-1">
                  {driver.description}
                </p>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}

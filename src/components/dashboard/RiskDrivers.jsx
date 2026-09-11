import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export function RiskDrivers({ drivers = [] }) {
  const maxImpact = Math.max(...drivers.map(d => Math.abs(d.impact)), 25);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-5 hover:shadow-md transition-shadow">
      
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Explainable AI (SHAP)
          </span>
          <h2 className="text-sm font-bold text-slate-800">
            Primary Delay Drivers
          </h2>
        </div>
        <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-mono font-medium">
          Feature Importance
        </span>
      </div>

      <div className="space-y-3 pt-3">
        {drivers.map((driver, idx) => {
          const isUp = driver.direction === 'up' || driver.impact > 0;
          const barPct = Math.min(100, Math.round((Math.abs(driver.impact) / maxImpact) * 100));

          return (
            <div key={idx} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition">
              
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2 truncate">
                  <span className={`p-1 rounded-md shrink-0 ${isUp ? 'bg-rose-100/80 text-rose-700' : 'bg-emerald-100/80 text-emerald-700'}`}>
                    {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  </span>
                  <div className="truncate">
                    <div className="text-xs font-bold text-slate-800 truncate">
                      {driver.name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">
                      {driver.category}
                    </div>
                  </div>
                </div>

                <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-md shrink-0 ${
                  isUp ? 'bg-rose-50 text-rose-700 border border-rose-200/80' : 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                }`}>
                  {driver.displayImpact || (isUp ? `+${driver.impact} pts` : `${driver.impact} pts`)}
                </span>
              </div>

              {/* Minimal Progress Bar */}
              <div className="w-full bg-slate-200/70 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isUp ? 'bg-rose-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${barPct}%` }}
                />
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}

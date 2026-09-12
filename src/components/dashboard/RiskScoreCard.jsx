import React from 'react';
import { Clock, AlertOctagon } from 'lucide-react';
import { RiskCategoryBadge } from './RiskCategoryBadge';
import { getRiskLevel } from '../../lib/utils';

export function RiskScoreCard({ score = 82, projectData, simulationDelta = null, estimatedDelay = null }) {
  const meta = getRiskLevel(score);
  const displayedDelay = estimatedDelay || (
    Number.isFinite(Number(score))
      ? `${Math.round((Number(score) / 100) * 180)} model-estimated days`
      : '—'
  );

  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const safeScore = Math.max(0, Math.min(100, Number(score) || 0));
  const strokeDashoffset = circumference - (safeScore / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-5 hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Delay Risk Probability
          </span>
          <h2 className="text-sm font-bold text-slate-800">
            Composite Delay Index
          </h2>
        </div>

        <RiskCategoryBadge score={safeScore} category={safeScore >= 70 ? 'HIGH RISK' : safeScore >= 40 ? 'MEDIUM RISK' : 'LOW RISK'} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center pt-4">
        <div className="sm:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
              <circle
                cx="70"
                cy="70"
                r={radius}
                className="text-slate-100"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="70"
                cy="70"
                r={radius}
                stroke={meta.fill}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.4s ease' }}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black text-slate-900 font-mono tracking-tight">
                {safeScore}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                Score / 100
              </span>
              {simulationDelta !== null && simulationDelta !== 0 && (
                <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full mt-0.5 animate-view-fade-in ${
                  simulationDelta < 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {simulationDelta > 0 ? `+${simulationDelta}` : simulationDelta} pts
                </span>
              )}
            </div>
          </div>

          <div className="text-center mt-1">
            <div className="text-[10px] text-slate-400 font-medium">Prediction Source</div>
            <div className="text-xs font-bold text-slate-700 font-mono">ML risk model</div>
          </div>
        </div>

        <div className="sm:col-span-7 space-y-2.5">
          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/60 hover:bg-slate-50 transition-colors">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-500 flex items-center gap-1.5 text-[11px] font-medium">
                <Clock className="w-3.5 h-3.5 text-rose-500" />
                Model-Estimated Delay
              </span>
              <span className="font-bold text-rose-600 font-mono text-xs">
                {displayedDelay}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              Approximate model scenario horizon derived from the predicted risk probability (0–180 days).
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/60 hover:bg-slate-50 transition-colors">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-500 flex items-center gap-1.5 text-[11px] font-medium">
                <AlertOctagon className="w-3.5 h-3.5 text-emerald-500" />
                Decision Support Status
              </span>
              <span className="font-bold text-slate-800 text-xs">Advisory</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              Use the risk score and SHAP drivers to prioritize review; this system does not make statutory or financial decisions.
            </p>
          </div>

          <div className="flex items-center justify-between px-1 text-[10px] text-slate-400">
            <span>Critical Threshold: <strong className="text-slate-600">70 pts</strong></span>
            <span className="text-emerald-600 font-medium">De-risked: &lt;40 pts</span>
          </div>
        </div>
      </div>
    </div>
  );
}

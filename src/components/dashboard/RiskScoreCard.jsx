import React from 'react';
import { ShieldAlert, Clock, AlertOctagon, TrendingUp, HelpCircle } from 'lucide-react';
import { RiskCategoryBadge } from './RiskCategoryBadge';
import { formatINR, getRiskLevel } from '../../lib/utils';

export function RiskScoreCard({ score = 82, projectData, simulationDelta = null }) {
  const meta = getRiskLevel(score);

  // SVG Radial Gauge calculation
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow">
      
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Sector Risk Probability
            </h2>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono font-medium">
              ML Model v3.1
            </span>
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            Composite delay risk across 48 cadastral parcels
          </div>
        </div>

        <RiskCategoryBadge score={score} category={score >= 70 ? "HIGH RISK" : score >= 40 ? "MEDIUM RISK" : "LOW RISK"} />
      </div>

      {/* Radial Score Gauge & Core Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
        
        {/* Radial Gauge (Cols 1-5) */}
        <div className="sm:col-span-5 flex flex-col items-center justify-center p-2">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              {/* Background Track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="text-slate-100"
                strokeWidth="14"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Value Arc */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke={meta.fill}
                strokeWidth="14"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-black tracking-tight text-slate-900 font-mono">
                {score}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Out of 100
              </span>
              {simulationDelta !== null && simulationDelta !== 0 && (
                <span className={`text-[11px] font-bold mt-0.5 px-1.5 py-0.2 rounded font-mono ${
                  simulationDelta < 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  {simulationDelta > 0 ? `+${simulationDelta}` : simulationDelta} pts
                </span>
              )}
            </div>
          </div>

          <div className="text-center mt-2">
            <div className="text-[11px] text-slate-500 font-medium">Model Confidence</div>
            <div className="text-xs font-bold text-slate-800 font-mono">
              {projectData?.confidenceScore || 94.2}% (AUC-ROC: 0.91)
            </div>
          </div>
        </div>

        {/* Operational Risk Metrics (Cols 6-12) */}
        <div className="sm:col-span-7 space-y-2.5">
          
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Statutory Delay Projection
              </span>
              <span className="font-bold text-rose-600 font-mono">
                {projectData?.estimatedDelay || '148 days'}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-tight">
              Likely to breach Section 25 declaration timeline by approx 5 months without intervention.
            </p>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-500 flex items-center gap-1.5">
                <AlertOctagon className="w-3.5 h-3.5 text-slate-400" />
                Capital Exposure at Risk
              </span>
              <span className="font-bold text-slate-900 font-mono">
                {formatINR(projectData?.budgetAtRisk || 142000000)}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-tight">
              Idle contractor standing charges & compounded interest under Section 80.
            </p>
          </div>

          <div className="flex items-center justify-between px-1 text-[11px] text-slate-500">
            <span>Statutory Threshold: <strong className="text-slate-700">70 pts (Critical)</strong></span>
            <span className="text-emerald-700 font-medium">Target: &lt; 40 pts</span>
          </div>

        </div>

      </div>

    </div>
  );
}

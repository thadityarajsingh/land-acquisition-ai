import React from 'react';
import { Clock, AlertOctagon, TrendingDown, ShieldAlert } from 'lucide-react';
import { RiskCategoryBadge } from './RiskCategoryBadge';
import { formatINR, getRiskLevel } from '../../lib/utils';

export function RiskScoreCard({ score = 82, projectData, simulationDelta = null }) {
  const meta = getRiskLevel(score);

  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-5 hover:shadow-md transition-all duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Sector Delay Risk Probability
          </span>
          <h2 className="text-sm font-bold text-slate-800">
            Composite Delay Index
          </h2>
        </div>

        <RiskCategoryBadge score={score} category={score >= 70 ? "HIGH RISK" : score >= 40 ? "MEDIUM RISK" : "LOW RISK"} />
      </div>

      {/* Radial Score Gauge & Core Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center pt-4">
        
        {/* Radial Gauge */}
        <div className="sm:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
              <circle
                cx="70"
                cy="70"
                r={radius}
                className="text-slate-100 transition-colors"
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
                style={{
                  transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.4s ease'
                }}
              />
            </svg>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black text-slate-900 font-mono tracking-tight transition-all duration-300">
                {score}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                Score / 100
              </span>
              {simulationDelta !== null && simulationDelta !== 0 && (
                <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full mt-0.5 transition-all duration-300 animate-view-fade-in ${
                  simulationDelta < 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {simulationDelta > 0 ? `+${simulationDelta}` : simulationDelta} pts
                </span>
              )}
            </div>
          </div>

          <div className="text-center mt-1">
            <div className="text-[10px] text-slate-400 font-medium">Model Confidence</div>
            <div className="text-xs font-bold text-slate-700 font-mono">
              {projectData?.confidenceScore || 94.2}% (AUC 0.91)
            </div>
          </div>
        </div>

        {/* Operational Metrics */}
        <div className="sm:col-span-7 space-y-2.5">
          
          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/60 hover:bg-slate-50 transition-colors">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-500 flex items-center gap-1.5 text-[11px] font-medium">
                <Clock className="w-3.5 h-3.5 text-rose-500" />
                Projected Statutory Delay
              </span>
              <span className="font-bold text-rose-600 font-mono text-xs">
                {projectData?.estimatedDelay || '148 days'}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              Risk of breaching Section 25 declaration lapsing window by approx 5 months.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/60 hover:bg-slate-50 transition-colors">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-500 flex items-center gap-1.5 text-[11px] font-medium">
                <AlertOctagon className="w-3.5 h-3.5 text-amber-500" />
                Capital Exposure at Risk
              </span>
              <span className="font-bold text-slate-800 font-mono text-xs">
                {formatINR(projectData?.budgetAtRisk || 142000000)}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              Idle contractor equipment standing charges and statutory interest.
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

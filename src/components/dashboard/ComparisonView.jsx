import React from 'react';
import { ArrowRight, TrendingDown, Clock, ShieldCheck, CheckCircle, Sparkles } from 'lucide-react';
import { RiskCategoryBadge } from './RiskCategoryBadge';

export function ComparisonView({ baseline, simulation }) {
  if (!simulation) {
    return (
      <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-6 text-center text-slate-500">
        <Sparkles className="w-6 h-6 mx-auto text-slate-400 mb-2" />
        <div className="text-sm font-semibold text-slate-700">No Simulation Active</div>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Adjust the sliders in the What-If Simulator above and click <strong>"Run What-If Simulation"</strong> to evaluate the policy delta.
        </p>
      </div>
    );
  }

  const isImproved = simulation.scoreDelta <= 0;
  const absDelta = Math.abs(simulation.scoreDelta);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow">
      
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
            <TrendingDown className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Intervention Impact Comparison (Before vs After)
            </h2>
            <p className="text-xs text-slate-500">
              Quantified risk & delay variance after applying simulated compensatory package
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{simulation.daysSaved > 0 ? `${simulation.daysSaved} Days Saved` : 'Simulation Applied'}</span>
        </div>
      </div>

      {/* Side by Side Diff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
        
        {/* Baseline (Before) */}
        <div className="md:col-span-5 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex justify-between items-center">
            <span>Statutory Baseline</span>
            <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.2 rounded font-mono">Original</span>
          </div>

          <div className="flex items-baseline justify-between mb-2">
            <span className="text-3xl font-black text-slate-800 font-mono">
              {simulation.originalScore || 82}
            </span>
            <RiskCategoryBadge score={simulation.originalScore || 82} size="sm" />
          </div>

          <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-200">
            <div className="flex justify-between">
              <span className="text-slate-500">Est. Delay:</span>
              <span className="font-mono font-bold text-rose-600">{simulation.originalDelay || '148 statutory days'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Legal Gridlock:</span>
              <span className="font-mono font-medium text-slate-700">7 Active HC Writs</span>
            </div>
          </div>
        </div>

        {/* Delta Arrow */}
        <div className="md:col-span-1 flex flex-col items-center justify-center py-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ${
            isImproved ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
          }`}>
            <ArrowRight className="w-4 h-4" />
          </div>
          <span className={`text-[11px] font-bold font-mono mt-1 ${isImproved ? 'text-emerald-700' : 'text-rose-700'}`}>
            {isImproved ? `-${absDelta} pts` : `+${absDelta} pts`}
          </span>
        </div>

        {/* Simulated (After) */}
        <div className="md:col-span-5 bg-emerald-50/50 p-4 rounded-xl border border-emerald-200">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 mb-2 flex justify-between items-center">
            <span>Simulated Outcome</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-mono font-semibold">Post-Intervention</span>
          </div>

          <div className="flex items-baseline justify-between mb-2">
            <span className="text-3xl font-black text-emerald-900 font-mono">
              {simulation.simulatedScore}
            </span>
            <RiskCategoryBadge score={simulation.simulatedScore} category={simulation.simulatedCategory} size="sm" />
          </div>

          <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-emerald-200">
            <div className="flex justify-between">
              <span className="text-slate-500">Projected Delay:</span>
              <span className="font-mono font-bold text-emerald-800">{simulation.simulatedDelay}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Timeline Recovery:</span>
              <span className="font-mono font-bold text-emerald-700">+{simulation.daysSaved} Days Advanced</span>
            </div>
          </div>
        </div>

      </div>

      {/* Summary Note */}
      <div className="mt-4 p-2.5 bg-blue-50/60 rounded-lg border border-blue-200/80 text-xs text-blue-900 flex items-start gap-2">
        <CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          <strong>Decision Intelligence:</strong> Executing this simulated compensation and Lok Adalat framework reduces risk below the critical 70-point threshold, unblocking physical possession for contractor mobilization within the statutory Q4 FY25 deadline.
        </p>
      </div>

    </div>
  );
}

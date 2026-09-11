import React from 'react';
import { ArrowRight, TrendingDown, Clock, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';
import { RiskCategoryBadge } from './RiskCategoryBadge';

export function ComparisonView({ baseline, simulation }) {
  if (!simulation) {
    return (
      <div className="bg-slate-50/70 border border-dashed border-slate-200 rounded-2xl p-6 text-center text-slate-400 transition-all duration-300">
        <Sparkles className="w-5 h-5 mx-auto text-slate-300 mb-1.5" />
        <div className="text-xs font-bold text-slate-600">No Simulation Active</div>
        <p className="text-[11px] text-slate-400 mt-0.5 max-w-sm mx-auto">
          Adjust the sliders in the simulator above and click <strong>"Run What-If Simulation"</strong> to evaluate the policy delta.
        </p>
      </div>
    );
  }

  const isImproved = simulation.scoreDelta <= 0;
  const absDelta = Math.abs(simulation.scoreDelta);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-5 hover:shadow-md transition-all duration-300 animate-view-fade-in">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Intervention Impact
          </span>
          <h2 className="text-sm font-bold text-slate-800">
            Before vs After Comparison
          </h2>
        </div>

        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-full border border-emerald-200 transition-all duration-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>{simulation.daysSaved > 0 ? `${simulation.daysSaved} Days Saved` : 'Simulated'}</span>
        </div>
      </div>

      {/* Diff Cards */}
      <div className="grid grid-cols-1 md:grid-cols-11 gap-3.5 items-center pt-4">
        
        {/* Baseline (Before) */}
        <div className="md:col-span-5 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/70 hover:bg-slate-50 transition-colors">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex justify-between items-center">
            <span>Statutory Baseline</span>
            <span className="text-[9px] bg-slate-200 text-slate-600 px-1.5 py-0.2 rounded font-mono">Original</span>
          </div>

          <div className="flex items-baseline justify-between mb-2">
            <span className="text-3xl font-black text-slate-800 font-mono tracking-tight">
              {simulation.originalScore || 82}
            </span>
            <RiskCategoryBadge score={simulation.originalScore || 82} size="sm" />
          </div>

          <div className="text-[11px] text-slate-500 space-y-1 pt-2 border-t border-slate-200/70">
            <div className="flex justify-between">
              <span>Est. Delay:</span>
              <span className="font-mono font-bold text-rose-600">{simulation.originalDelay || '148 days'}</span>
            </div>
            <div className="flex justify-between">
              <span>Litigation:</span>
              <span className="font-mono text-slate-700">7 Active Writs</span>
            </div>
          </div>
        </div>

        {/* Delta Indicator */}
        <div className="md:col-span-1 flex flex-col items-center justify-center py-1">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-xs transition-transform duration-300 hover:scale-110 ${
            isImproved ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
          }`}>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
          <span className={`text-[10px] font-bold font-mono mt-1 ${isImproved ? 'text-emerald-700' : 'text-rose-700'}`}>
            {isImproved ? `-${absDelta} pts` : `+${absDelta} pts`}
          </span>
        </div>

        {/* Simulated (After) */}
        <div className="md:col-span-5 bg-emerald-50/40 p-3.5 rounded-xl border border-emerald-200 hover:bg-emerald-50/60 transition-colors">
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 mb-1.5 flex justify-between items-center">
            <span>Simulated Outcome</span>
            <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-mono font-semibold">De-risked</span>
          </div>

          <div className="flex items-baseline justify-between mb-2">
            <span className="text-3xl font-black text-emerald-900 font-mono tracking-tight transition-all duration-300">
              {simulation.simulatedScore}
            </span>
            <RiskCategoryBadge score={simulation.simulatedScore} category={simulation.simulatedCategory} size="sm" />
          </div>

          <div className="text-[11px] text-slate-600 space-y-1 pt-2 border-t border-emerald-200">
            <div className="flex justify-between">
              <span className="text-slate-500">Projected Delay:</span>
              <span className="font-mono font-bold text-emerald-800">{simulation.simulatedDelay}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Timeline Recovery:</span>
              <span className="font-mono font-bold text-emerald-700">+{simulation.daysSaved} Days Saved</span>
            </div>
          </div>
        </div>

      </div>

      {/* Decision Summary */}
      <div className="mt-3.5 p-2.5 bg-blue-50/50 rounded-xl border border-blue-200/60 text-xs text-blue-950 flex items-start gap-2">
        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          <strong>Decision Insight:</strong> Executing this simulated compensation and Lok Adalat framework reduces risk below the critical 70-point threshold, preventing Section 25 lapsing and clearing right-of-way for contractor mobilization.
        </p>
      </div>

    </div>
  );
}

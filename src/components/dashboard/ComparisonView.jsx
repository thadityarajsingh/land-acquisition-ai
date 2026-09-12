import React from 'react';
import { ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle, Minus } from 'lucide-react';
import { RiskCategoryBadge } from './RiskCategoryBadge';

export function ComparisonView({ baseline, simulation }) {
  if (!simulation) {
    return (
      <div className="bg-slate-50/70 border border-dashed border-slate-200 rounded-2xl p-6 text-center text-slate-400 transition-all duration-300">
        <Minus className="w-5 h-5 mx-auto text-slate-300 mb-1.5" />
        <div className="text-xs font-bold text-slate-600">No Simulation Active</div>
        <p className="text-[11px] text-slate-400 mt-0.5 max-w-sm mx-auto">
          Adjust the scenario controls and click <strong>"Run What-If Simulation"</strong> to evaluate the model-estimated policy impact.
        </p>
      </div>
    );
  }

  const scoreDelta = Number(simulation.scoreDelta ?? 0);
  const isImproved = scoreDelta < 0;
  const isUnchanged = scoreDelta === 0;
  const absDelta = Math.abs(scoreDelta);
  const baselineLitigation = Number(baseline?.legal_disputes ?? 0);

  const statusLabel = simulation.daysSaved > 0
    ? `${simulation.daysSaved} Days Saved`
    : isImproved
      ? 'Lower Risk'
      : isUnchanged
        ? 'No Change'
        : 'Higher Risk';

  const scenarioTone = isImproved
    ? 'bg-emerald-50/40 border-emerald-200 hover:bg-emerald-50/60'
    : isUnchanged
      ? 'bg-slate-50/80 border-slate-200 hover:bg-slate-50'
      : 'bg-rose-50/40 border-rose-200 hover:bg-rose-50/60';

  const scenarioLabelTone = isImproved
    ? 'text-emerald-800 bg-emerald-100 text-emerald-800'
    : isUnchanged
      ? 'text-slate-700 bg-slate-200 text-slate-700'
      : 'text-rose-800 bg-rose-100 text-rose-800';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-5 hover:shadow-md transition-all duration-300 animate-view-fade-in">
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Intervention Impact</span>
          <h2 className="text-sm font-bold text-slate-800">Before vs After Comparison</h2>
        </div>

        <div className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border transition-all duration-200 ${
          isImproved
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
            : isUnchanged
              ? 'bg-slate-100 text-slate-700 border-slate-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          {isImproved ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> : isUnchanged ? <Minus className="w-3.5 h-3.5 text-slate-500" /> : <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />}
          <span>{statusLabel}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-11 gap-3.5 items-center pt-4">
        <div className="md:col-span-5 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/70 hover:bg-slate-50 transition-colors">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex justify-between items-center">
            <span>Baseline</span>
            <span className="text-[9px] bg-slate-200 text-slate-600 px-1.5 py-0.2 rounded font-mono">Original</span>
          </div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-3xl font-black text-slate-800 font-mono tracking-tight">{simulation.originalScore}</span>
            <RiskCategoryBadge score={simulation.originalScore} size="sm" />
          </div>
          <div className="text-[11px] text-slate-500 space-y-1 pt-2 border-t border-slate-200/70">
            <div className="flex justify-between"><span>Est. Delay:</span><span className="font-mono font-bold text-rose-600">{simulation.originalDelay}</span></div>
            <div className="flex justify-between"><span>Legal Disputes:</span><span className="font-mono text-slate-700">{baselineLitigation}</span></div>
          </div>
        </div>

        <div className="md:col-span-1 flex flex-col items-center justify-center py-1">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-xs transition-transform duration-300 hover:scale-110 ${
            isImproved ? 'bg-emerald-600 text-white' : isUnchanged ? 'bg-slate-400 text-white' : 'bg-rose-600 text-white'
          }`}>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
          <span className={`text-[10px] font-bold font-mono mt-1 ${isImproved ? 'text-emerald-700' : isUnchanged ? 'text-slate-500' : 'text-rose-700'}`}>
            {isUnchanged ? '0 pts' : isImproved ? `-${absDelta} pts` : `+${absDelta} pts`}
          </span>
        </div>

        <div className={`md:col-span-5 p-3.5 rounded-xl border transition-colors ${scenarioTone}`}>
          <div className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 flex justify-between items-center ${isImproved ? 'text-emerald-800' : isUnchanged ? 'text-slate-700' : 'text-rose-800'}`}>
            <span>Model Scenario</span>
            <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-semibold ${scenarioLabelTone.split(' ').slice(1).join(' ')}`}>
              {isImproved ? 'Lower Risk' : isUnchanged ? 'No Change' : 'Higher Risk'}
            </span>
          </div>
          <div className="flex items-baseline justify-between mb-2">
            <span className={`text-3xl font-black font-mono tracking-tight transition-all duration-300 ${isImproved ? 'text-emerald-900' : isUnchanged ? 'text-slate-800' : 'text-rose-900'}`}>
              {simulation.simulatedScore}
            </span>
            <RiskCategoryBadge score={simulation.simulatedScore} category={simulation.simulatedCategory} size="sm" />
          </div>
          <div className="text-[11px] text-slate-600 space-y-1 pt-2 border-t border-slate-200">
            <div className="flex justify-between"><span className="text-slate-500">Projected Delay:</span><span className="font-mono font-bold">{simulation.simulatedDelay}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Timeline Change:</span><span className={`font-mono font-bold ${isImproved ? 'text-emerald-700' : isUnchanged ? 'text-slate-600' : 'text-rose-700'}`}>{simulation.daysSaved > 0 ? `-${simulation.daysSaved} days` : simulation.daysSaved === 0 ? 'No change' : 'Increase possible'}</span></div>
          </div>
        </div>
      </div>

      <div className={`mt-3.5 p-2.5 rounded-xl border flex items-start gap-2 ${isUnchanged ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-blue-50/50 border-blue-200/60 text-blue-950'}`}>
        {isUnchanged ? <Minus className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" /> : <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />}
        <p className="text-[11px] leading-relaxed">
          <strong>Decision Insight:</strong> {isImproved
            ? `This scenario lowers the model's predicted delay risk by ${absDelta} points compared with the baseline.`
            : isUnchanged
              ? 'This scenario produces no change in the model’s predicted delay risk compared with the baseline. Adjust the controls to test a different intervention.'
              : `This scenario increases the model's predicted delay risk by ${absDelta} points compared with the baseline.`}
          {' '}These are model-derived estimates, not guaranteed project outcomes.
        </p>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Sliders, RefreshCw, RotateCcw, Sparkles, Zap } from 'lucide-react';

export function WhatIfPanel({ defaults = {}, onRunSimulation, simulating = false, onReset }) {
  const [compensationMultiplier, setCompensationMultiplier] = useState(defaults.compensationMultiplier || 1.0);
  const [surveyCompletionPct, setSurveyCompletionPct] = useState(defaults.surveyCompletionPct || 58);
  const [litigationCases, setLitigationCases] = useState(defaults.litigationCases || 7);
  const [solatiumTopUpPct, setSolatiumTopUpPct] = useState(defaults.solatiumTopUpPct || 0);

  const applyPreset = (preset) => {
    let comp = 1.0;
    let survey = 58;
    let lit = 7;
    let sol = 0;

    if (preset === 'fast') {
      comp = 1.75;
      survey = 92;
      lit = 1;
      sol = 20;
    } else if (preset === 'lok_adalat') {
      comp = 1.35;
      survey = 80;
      lit = 2;
      sol = 15;
    }

    setCompensationMultiplier(comp);
    setSurveyCompletionPct(survey);
    setLitigationCases(lit);
    setSolatiumTopUpPct(sol);

    onRunSimulation({
      compensationMultiplier: comp,
      surveyCompletionPct: survey,
      litigationCases: lit,
      solatiumTopUpPct: sol,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onRunSimulation({
      compensationMultiplier: Number(compensationMultiplier),
      surveyCompletionPct: Number(surveyCompletionPct),
      litigationCases: Number(litigationCases),
      solatiumTopUpPct: Number(solatiumTopUpPct),
    });
  };

  const handleReset = () => {
    setCompensationMultiplier(defaults.compensationMultiplier || 1.0);
    setSurveyCompletionPct(defaults.surveyCompletionPct || 58);
    setLitigationCases(defaults.litigationCases || 7);
    setSolatiumTopUpPct(defaults.solatiumTopUpPct || 0);
    if (onReset) onReset();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-5 hover:shadow-md transition-all duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Interactive Policy Simulator
          </span>
          <h2 className="text-sm font-bold text-slate-800">
            De-Risking Simulation Studio
          </h2>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1 font-medium transition-colors cursor-pointer active:scale-95"
          title="Reset to statutory baseline"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {/* Preset Chips */}
      <div className="my-3.5 bg-slate-50 p-2 rounded-xl border border-slate-200/60 flex flex-wrap items-center justify-between gap-2">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 pl-1">
          <Zap className="w-3.5 h-3.5 text-[#F97316]" />
          Demo Presets:
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => applyPreset('lok_adalat')}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50/60 text-slate-700 hover:text-[#1E3A8A] font-semibold border border-slate-200 shadow-xs transition-all duration-150 interactive-tap cursor-pointer"
          >
            Pre-Lok Adalat (1.35x)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('fast')}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white font-bold transition-all duration-150 interactive-tap shadow-xs cursor-pointer"
          >
            Fast Corridor (1.75x)
          </button>
        </div>
      </div>

      {/* Sliders Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        
        {/* Slider 1: Compensation Multiplier */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold text-slate-700">
            <span>Land Compensation Multiplier:</span>
            <span className="font-mono text-[#F97316] font-bold text-[11px] bg-orange-50 px-2 py-0.5 rounded border border-orange-200/60 transition-all duration-150">
              {Number(compensationMultiplier).toFixed(2)}x Circle Rate
            </span>
          </div>
          <input
            type="range"
            min="1.0"
            max="2.5"
            step="0.05"
            value={compensationMultiplier}
            onChange={(e) => setCompensationMultiplier(e.target.value)}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>1.0x (Ready Reckoner)</span>
            <span>1.75x (Consensus)</span>
            <span>2.5x (Cap)</span>
          </div>
        </div>

        {/* Slider 2: Survey Progress */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold text-slate-700">
            <span>Joint Measurement Survey (JMS):</span>
            <span className="font-mono text-blue-700 font-bold text-[11px] bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60 transition-all duration-150">
              {surveyCompletionPct}% Verified
            </span>
          </div>
          <input
            type="range"
            min="30"
            max="100"
            step="1"
            value={surveyCompletionPct}
            onChange={(e) => setSurveyCompletionPct(e.target.value)}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>30% (Early Stage)</span>
            <span>58% (Baseline)</span>
            <span>100% (Completed)</span>
          </div>
        </div>

        {/* Slider 3: Litigations */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold text-slate-700">
            <span>Active High Court Writs:</span>
            <span className="font-mono text-rose-600 font-bold text-[11px] bg-rose-50 px-2 py-0.5 rounded border border-rose-200/60 transition-all duration-150">
              {litigationCases} Petitions
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={litigationCases}
            onChange={(e) => setLitigationCases(e.target.value)}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>0 (Fully Settled)</span>
            <span>7 (Current Writs)</span>
            <span>10 (Gridlock)</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={simulating}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white font-bold text-xs shadow-sm hover:shadow-md transition-all duration-150 interactive-tap disabled:opacity-60 cursor-pointer"
          >
            {simulating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Simulating Scenario...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Run What-If Simulation</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}

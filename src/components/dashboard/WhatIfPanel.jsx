import React, { useState } from 'react';
import { Sliders, RefreshCw, RotateCcw, Sparkles, TrendingDown } from 'lucide-react';

export function WhatIfPanel({ defaults = {}, onRunSimulation, simulating = false, onReset }) {
  const [compensationMultiplier, setCompensationMultiplier] = useState(defaults.compensationMultiplier || 1.0);
  const [surveyCompletionPct, setSurveyCompletionPct] = useState(defaults.surveyCompletionPct || 58);
  const [litigationCases, setLitigationCases] = useState(defaults.litigationCases || 7);
  const [solatiumTopUpPct, setSolatiumTopUpPct] = useState(defaults.solatiumTopUpPct || 0);

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
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow">
      
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-orange-50 text-[#F97316]">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Policy & Operational What-If Simulator
            </h2>
            <p className="text-xs text-slate-500">
              Simulate compensatory interventions & legal settlements to de-risk timeline
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium transition"
          title="Reset to statutory baseline"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Slider 1: Compensation Multiplier */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-slate-700">
            <span>Land Compensation Multiplier:</span>
            <span className="font-mono text-[#F97316] font-bold">{Number(compensationMultiplier).toFixed(2)}x Circle Rate</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="2.5"
            step="0.05"
            value={compensationMultiplier}
            onChange={(e) => setCompensationMultiplier(e.target.value)}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#F97316]"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>1.0x (Standard Ready Reckoner)</span>
            <span>1.75x (Amicable Consensus)</span>
            <span>2.5x (Fast Acquisition Cap)</span>
          </div>
        </div>

        {/* Slider 2: Survey Completion % */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-slate-700">
            <span>Joint Measurement Survey (JMS) Progress:</span>
            <span className="font-mono text-blue-700 font-bold">{surveyCompletionPct}% Verified</span>
          </div>
          <input
            type="range"
            min="30"
            max="100"
            step="1"
            value={surveyCompletionPct}
            onChange={(e) => setSurveyCompletionPct(e.target.value)}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1E3A8A]"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>30% (Early Delays)</span>
            <span>58% (Current Baseline)</span>
            <span>100% (Cadastral Demarcated)</span>
          </div>
        </div>

        {/* Slider 3: Active Litigation Writs */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-slate-700">
            <span>Active High Court Stay Orders / Writs:</span>
            <span className="font-mono text-rose-600 font-bold">{litigationCases} Pending Petitions</span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={litigationCases}
            onChange={(e) => setLitigationCases(e.target.value)}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>0 (Lok Adalat Full Settlement)</span>
            <span>7 (Current Injunctions)</span>
            <span>10 (Severe Gridlock)</span>
          </div>
        </div>

        {/* Slider 4: Solatium Top-Up */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-slate-700">
            <span>Ex-Gratia Solatium Incentive:</span>
            <span className="font-mono text-emerald-700 font-bold">+{solatiumTopUpPct}% Incentive</span>
          </div>
          <input
            type="range"
            min="0"
            max="30"
            step="5"
            value={solatiumTopUpPct}
            onChange={(e) => setSolatiumTopUpPct(e.target.value)}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>0% (Statutory 100%)</span>
            <span>15% (Special Package)</span>
            <span>30% (High Priority Corridor)</span>
          </div>
        </div>

        {/* Action Button: Saffron Theme (#F97316) */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={simulating}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-sm shadow-sm hover:shadow transition disabled:opacity-60"
          >
            {simulating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running Simulation Engine...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run What-If Simulation</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}

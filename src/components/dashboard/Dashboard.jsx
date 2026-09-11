import React, { useState } from 'react';
import { CadastralMap } from './CadastralMap';
import { RiskScoreCard } from './RiskScoreCard';
import { RiskDrivers } from './RiskDrivers';
import { WhatIfPanel } from './WhatIfPanel';
import { ComparisonView } from './ComparisonView';
import { MitigationProtocols } from './MitigationProtocols';
import { MapPin, Calendar, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';

export function Dashboard({
  projectData,
  prediction,
  whatIfResult,
  onRunSimulation,
  simulating,
  onResetSimulation
}) {
  const [selectedParcel, setSelectedParcel] = useState(null);

  // Active risk score: if simulation is active, we can show delta, while RiskScoreCard shows original or simulated
  const currentRiskScore = whatIfResult ? whatIfResult.simulatedScore : (prediction?.riskScore || projectData?.riskScore || 82);
  const originalRiskScore = prediction?.riskScore || projectData?.riskScore || 82;
  const currentDrivers = whatIfResult?.updatedDrivers || prediction?.drivers || projectData?.drivers || [];

  return (
    <div className="space-y-6">
      
      {/* Project Corridor Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-blue-50 text-[#1E3A8A] border border-blue-200">
                {projectData?.id || 'IN-MH-PUN-2024-0094B'}
              </span>
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {projectData?.district || 'Pune, Maharashtra'} • {projectData?.corridor || 'Pune Ring Road'}
              </span>
              <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Live Sensor Synced
              </span>
            </div>

            <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              {projectData?.name || 'Sector Assessment: Mauje Ambavane — Chainage 164+000 to 165+200'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Statutory Stage: <strong className="text-slate-700">{projectData?.section || 'Section 20(E) Declaration'}</strong> • Deadline: <span className="font-mono text-slate-700 font-semibold">{projectData?.statutoryDeadline || '28-Oct-2024'}</span>
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">Total Parcels</div>
              <div className="text-sm font-black font-mono text-slate-800">{projectData?.parcels?.length || 48}</div>
            </div>
            <div className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">Total Land Area</div>
              <div className="text-sm font-black font-mono text-slate-800">{projectData?.totalAreaHa || 34.6} Ha</div>
            </div>
            <div className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">Affected Khatedars</div>
              <div className="text-sm font-black font-mono text-slate-800">{projectData?.affectedFamilies || 132} Families</div>
            </div>
          </div>

        </div>
      </div>

      {/* Cadastral GIS Vector Map (Command Center Centerpiece) */}
      <section>
        <CadastralMap
          parcels={projectData?.parcels || []}
          selectedGut={selectedParcel?.gutNo}
          onSelectParcel={setSelectedParcel}
        />
      </section>

      {/* Analytical Grid: Explain & Simulate */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Explainability (Risk Score & Top SHAP Drivers) */}
        <div className="lg:col-span-5 space-y-6">
          <RiskScoreCard
            score={currentRiskScore}
            projectData={projectData}
            simulationDelta={whatIfResult ? whatIfResult.scoreDelta : null}
          />
          <RiskDrivers drivers={currentDrivers} />
        </div>

        {/* Right Side: What-If Simulation Controls & Before/After Diff */}
        <div className="lg:col-span-7 space-y-6">
          <WhatIfPanel
            defaults={projectData?.simulationDefaults || {}}
            onRunSimulation={onRunSimulation}
            simulating={simulating}
            onReset={onResetSimulation}
          />
          <ComparisonView
            baseline={projectData}
            simulation={whatIfResult}
          />
        </div>

      </div>

      {/* Bottom Section: Mitigation & Statutory Directives */}
      <section>
        <MitigationProtocols
          recommendations={projectData?.recommendations || []}
        />
      </section>

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { CadastralMap } from './CadastralMap';
import { RiskScoreCard } from './RiskScoreCard';
import { RiskDrivers } from './RiskDrivers';
import { WhatIfPanel } from './WhatIfPanel';
import { ComparisonView } from './ComparisonView';
import { MitigationProtocols } from './MitigationProtocols';
import { CorridorView } from './CorridorView';
import { DisputesView } from './DisputesView';
import { AuditTrailView } from './AuditTrailView';
import { MapPin, Calendar, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';

export function Dashboard({
  activeTab = 'cadastral',
  setActiveTab,
  projectData,
  prediction,
  whatIfResult,
  onRunSimulation,
  simulating,
  onResetSimulation,
  searchQuery = ''
}) {
  const [selectedParcel, setSelectedParcel] = useState(null);

  // Search filter across parcels
  const filteredParcels = (projectData?.parcels || []).filter(p => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return p.gutNo.toLowerCase().includes(q) || p.owner.toLowerCase().includes(q);
  });

  // When search matches a parcel, auto-select it
  useEffect(() => {
    if (searchQuery && filteredParcels.length > 0) {
      setSelectedParcel(filteredParcels[0]);
    }
  }, [searchQuery]);

  const currentRiskScore = whatIfResult ? whatIfResult.simulatedScore : (prediction?.riskScore || projectData?.riskScore || 82);
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

      {/* DYNAMIC VIEW ROUTING BASED ON ACTIVE SIDEBAR TAB */}

      {/* VIEW 1: CADASTRAL GIS MAP & OVERVIEW */}
      {activeTab === 'cadastral' && (
        <div className="space-y-6">
          <section>
            <CadastralMap
              parcels={filteredParcels.length > 0 ? filteredParcels : projectData?.parcels || []}
              selectedGut={selectedParcel?.gutNo}
              onSelectParcel={setSelectedParcel}
            />
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-6">
              <RiskScoreCard
                score={currentRiskScore}
                projectData={projectData}
                simulationDelta={whatIfResult ? whatIfResult.scoreDelta : null}
              />
              <RiskDrivers drivers={currentDrivers} />
            </div>

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

          <section>
            <MitigationProtocols
              recommendations={projectData?.recommendations || []}
              projectData={projectData}
            />
          </section>
        </div>
      )}

      {/* VIEW 2: CORRIDOR ASSESSMENT */}
      {activeTab === 'corridor' && (
        <CorridorView
          projectData={projectData}
          onSelectParcel={(parcel) => {
            setSelectedParcel(parcel);
            if (setActiveTab) setActiveTab('cadastral');
          }}
        />
      )}

      {/* VIEW 3: DISPUTES & STAY WRITS */}
      {activeTab === 'disputes' && (
        <DisputesView
          projectData={projectData}
        />
      )}

      {/* VIEW 4: WHAT-IF SIMULATION STUDIO */}
      {activeTab === 'whatif' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 space-y-6">
              <WhatIfPanel
                defaults={projectData?.simulationDefaults || {}}
                onRunSimulation={onRunSimulation}
                simulating={simulating}
                onReset={onResetSimulation}
              />
              <RiskDrivers drivers={currentDrivers} />
            </div>

            <div className="lg:col-span-6 space-y-6">
              <ComparisonView
                baseline={projectData}
                simulation={whatIfResult}
              />
              <RiskScoreCard
                score={currentRiskScore}
                projectData={projectData}
                simulationDelta={whatIfResult ? whatIfResult.scoreDelta : null}
              />
            </div>
          </div>
        </div>
      )}

      {/* VIEW 5: MITIGATION PROTOCOLS */}
      {activeTab === 'protocols' && (
        <div className="space-y-6">
          <MitigationProtocols
            recommendations={projectData?.recommendations || []}
            projectData={projectData}
          />
        </div>
      )}

      {/* VIEW 6: STATUTORY AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <AuditTrailView
          projectData={projectData}
        />
      )}

    </div>
  );
}

import React, { useState } from 'react';
import { 
  Scale, 
  AlertCircle, 
  Calendar, 
  Building, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  ShieldAlert,
  Gavel,
  Check
} from 'lucide-react';
import { formatINR } from '../../lib/utils';

export function DisputesView({ projectData, onReferLokAdalat }) {
  const [activeActions, setActiveActions] = useState({});

  const petitions = [
    {
      id: "WP-4182/2024",
      court: "High Court of Judicature at Bombay (Appellate Side)",
      bench: "Hon'ble Division Bench (Court Room No. 4)",
      petitioner: "Kashinath B. Jadhav & 4 Others vs. State of Maharashtra & CALA Pune",
      gutAffected: "Gut No. 104/1A (1.45 Ha)",
      reliefSought: "Stay on Section 20(E) physical possession citing violation of Sec 15 hearing norms.",
      stayStatus: "INTERIM STAY OPERATIVE",
      nextHearing: "18-Sep-2024",
      advocate: "Adv. S. M. Deshmukh (High Court Bar)",
      statutoryRiskImpact: "+24 Points (Delay: 92 Days)",
      recommendedRemedy: "Refer to Special Pre-Lok Adalat with 1.25x Solatium Package."
    },
    {
      id: "RCS-89/2023",
      court: "Court of Civil Judge Senior Division (CJSD) Paud / Mulshi",
      bench: "Civil Bench I",
      petitioner: "Chandrakant More vs. Suresh More & Brothers",
      gutAffected: "Gut No. 106/3 (0.85 Ha)",
      reliefSought: "Partition decree and injunction restraining disbursement of award compensation.",
      stayStatus: "TITLE APPORTIONMENT PENDING",
      nextHearing: "26-Sep-2024",
      advocate: "Adv. V. R. Kadam",
      statutoryRiskImpact: "+12 Points (Delay: 45 Days)",
      recommendedRemedy: "Deposit 50% award amount with CALA Escrow under Section 77(2)."
    },
    {
      id: "NOC-AMB-04",
      court: "Sub-Divisional Officer & Gram Sabha Ambavane",
      bench: "Administrative Revenue Tribunal",
      petitioner: "Grampanchayat Gairan Committee & Pastoral Community",
      gutAffected: "Gut No. 104/1B (0.92 Ha Common Grazing Land)",
      reliefSought: "Demanding alternative grazing land allocation before corridor excavation.",
      stayStatus: "CONSENT WITHHELD",
      nextHearing: "Immediate Executive Meeting",
      advocate: "Revenue Talathi & Sarpanch Ambavane",
      statutoryRiskImpact: "+18 Points (Delay: 60 Days)",
      recommendedRemedy: "Allocate 1.1 Ha adjacent government barren land for community grazing."
    }
  ];

  const handleAction = (petitionId, actionName) => {
    setActiveActions(prev => ({
      ...prev,
      [petitionId]: actionName
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                Judicial Injunctions Tracker
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                Bombay High Court & Civil Disputes
              </span>
            </div>
            <h1 className="text-xl font-black text-slate-900">
              Active Stay Writs & Legal Dispute Resolution Console
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Judicial risk de-escalation protocols to vacate injunctions and unblock physical right-of-way.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-rose-50 text-rose-700 text-xs font-bold px-3 py-2 rounded-lg border border-rose-200">
            <Gavel className="w-4 h-4" />
            <span>3 Active Petitions Impeding RoW</span>
          </div>
        </div>
      </div>

      {/* Petitions List */}
      <div className="space-y-4">
        {petitions.map((pet) => {
          const actionTaken = activeActions[pet.id];

          return (
            <div
              key={pet.id}
              className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-sm p-5 transition"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold shrink-0">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-slate-900">{pet.id}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-mono">
                        {pet.stayStatus}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-medium">
                      {pet.court} • {pet.bench}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400">Next Hearing:</div>
                    <div className="font-mono font-bold text-slate-800 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      {pet.nextHearing}
                    </div>
                  </div>
                  <div className="text-right pl-3 border-l border-slate-200">
                    <div className="text-[10px] text-slate-400">Risk Weight:</div>
                    <div className="font-mono font-bold text-rose-600">{pet.statutoryRiskImpact}</div>
                  </div>
                </div>
              </div>

              {/* Details Body */}
              <div className="py-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Petitioner vs. Respondent:</span>
                    <div className="font-semibold text-slate-800">{pet.petitioner}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Affected Parcel / RoW:</span>
                    <div className="font-mono font-bold text-slate-900">{pet.gutAffected}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Core Contention:</span>
                    <div className="text-slate-600 text-[11px] leading-relaxed">{pet.reliefSought}</div>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
                  <span className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-[#F97316]" />
                    AI De-Risking Recommendation:
                  </span>
                  <div className="text-xs font-semibold text-slate-800">
                    {pet.recommendedRemedy}
                  </div>

                  <div className="pt-2 text-[10px] text-slate-500">
                    Advocate on Record: <strong className="text-slate-700">{pet.advocate}</strong>
                  </div>

                  {/* Resolution Action Trigger */}
                  <div className="pt-2">
                    {actionTaken ? (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-200">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Action Dispatched: {actionTaken}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAction(pet.id, 'Pre-Lok Adalat Notice Issued')}
                          className="flex-1 py-1.5 px-3 bg-[#1E3A8A] hover:bg-blue-900 text-white font-bold text-xs rounded transition flex items-center justify-center gap-1"
                        >
                          <span>Refer to Lok Adalat</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleAction(pet.id, 'Vacate Application Filed')}
                          className="py-1.5 px-3 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded transition"
                        >
                          File Vacate Petition
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}

import React from 'react';
import { X, Printer, Download, CheckCircle, FileText, Building2 } from 'lucide-react';

export function GazetteModal({ isOpen, onClose, projectData }) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-[#0F172A] text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#1E3A8A] flex items-center justify-center text-[#F97316] font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide">
                Statutory Gazette Notification Order Draft
              </h3>
              <p className="text-[11px] text-slate-400">
                RFCTLARR Act 2013 — Section 20(E) & First Schedule Solatium
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Gazette Document Body (Official Govt Typography & Layout) */}
        <div className="p-8 overflow-y-auto font-serif text-slate-900 space-y-6 leading-relaxed bg-[#FCFDFE]">
          
          {/* Official Emblem & Header */}
          <div className="text-center space-y-1 pb-4 border-b-2 border-slate-900">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-600">
              Government of Maharashtra
            </div>
            <div className="text-base font-extrabold uppercase tracking-wide text-slate-900">
              Office of the Competent Authority & Special Land Acquisition Officer (CALA)
            </div>
            <div className="text-xs text-slate-600">
              Pune Division, Collectorate Compound, Pune — 411001
            </div>
            <div className="text-xs font-mono text-slate-500 pt-1">
              Order No: CALA/PUN/PRR/2024/20E-094B • Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
          </div>

          {/* Subject */}
          <div className="bg-slate-100/80 p-3 rounded border border-slate-300 text-xs font-sans">
            <strong>SUBJECT:</strong> Declaration of Special Solatium Package (1.25x Ready Reckoner Benchmark) and Reference to Fast-Track Pre-Lok Adalat Bench for Amicable Possession of Mauje Ambavane (Chainage 164+000 to 165+200) under Pune Ring Road Project.
          </div>

          {/* Statutory Preamble */}
          <div className="text-xs space-y-3 font-serif">
            <p>
              <strong>WHEREAS,</strong> the land specified in the schedule appended hereto is required for public purpose, namely for the construction and expansion of the <em>Pune Ring Road (West Arc - Package III)</em>, notified under Section 20(A) on 14-Feb-2024;
            </p>
            <p>
              <strong>AND WHEREAS,</strong> representations and writ petitions (including Bombay High Court WP-4182/2024) concerning valuation differentials and joint measurement survey boundaries have been reviewed by the Multi-Disciplinary De-risking Committee;
            </p>
            <p>
              <strong>NOW THEREFORE,</strong> in exercise of the powers conferred by Section 30(1) read with the First Schedule of the Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013, the Competent Authority hereby orders:
            </p>
          </div>

          {/* Operative Directives */}
          <div className="text-xs font-sans bg-blue-50/50 p-4 rounded-lg border border-blue-200 space-y-2.5">
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
              <p>
                <strong>Ex-Gratia Solatium Multiplier:</strong> Approval of a 1.25x multiplier over the current Ready Reckoner circle rates for all titleholders executing consent terms within twenty-one (21) calendar days.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
              <p>
                <strong>Pre-Lok Adalat Conciliation:</strong> Formal referral of Gut Nos. 104/1A, 104/1B, and 105/2 to the District Legal Services Authority (DLSA) special bench for immediate consent compromise.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
              <p>
                <strong>DGPS Drone Re-demarcation:</strong> Direction to the Superintendent of Land Records (SLR) to deploy rover stations for 48-hour boundary confirmation.
              </p>
            </div>
          </div>

          {/* Schedule of Parcels */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700 font-sans">
              Schedule of Affected Cadastral Parcels
            </div>
            <table className="w-full text-[11px] font-sans border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100 text-slate-700">
                  <th className="border border-slate-300 p-1.5 text-left">Gut No.</th>
                  <th className="border border-slate-300 p-1.5 text-left">Khatedar / Titleholder</th>
                  <th className="border border-slate-300 p-1.5 text-right">Area (Ha)</th>
                  <th className="border border-slate-300 p-1.5 text-left">Classification</th>
                  <th className="border border-slate-300 p-1.5 text-right">Risk Score</th>
                </tr>
              </thead>
              <tbody>
                {(projectData?.parcels || []).map((p) => (
                  <tr key={p.gutNo} className="hover:bg-slate-50">
                    <td className="border border-slate-300 p-1.5 font-mono font-bold">{p.gutNo}</td>
                    <td className="border border-slate-300 p-1.5">{p.owner}</td>
                    <td className="border border-slate-300 p-1.5 text-right font-mono">{p.areaHa}</td>
                    <td className="border border-slate-300 p-1.5">{p.classification}</td>
                    <td className="border border-slate-300 p-1.5 text-right font-mono font-bold">{p.riskScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Signatures */}
          <div className="pt-6 grid grid-cols-2 text-xs font-sans">
            <div>
              <div className="text-slate-400 text-[10px]">Digitally Authenticated by:</div>
              <div className="font-bold text-slate-800">Special Land Acquisition Officer</div>
              <div className="text-slate-600">Competent Authority, NHAI Pune</div>
              <div className="text-[10px] text-emerald-700 font-mono mt-1">✓ Verified DSC #994B-2024-CALA</div>
            </div>
            <div className="text-right">
              <div className="text-slate-400 text-[10px]">Countersigned by:</div>
              <div className="font-bold text-slate-800">Collector & District Magistrate</div>
              <div className="text-slate-600">Pune District, Maharashtra</div>
              <div className="text-[10px] text-emerald-700 font-mono mt-1">✓ Stamp: SEAL_CALA_PUNE_2024</div>
            </div>
          </div>

        </div>

        {/* Modal Actions */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-mono">
            Format: Official Gazette Template G.S.R. 734(E)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 font-semibold text-slate-700 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Order
            </button>
            <button
              onClick={() => {
                alert('Gazette Notification Order CALA/PUN/2024/094B downloaded successfully.');
                onClose();
              }}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#1E3A8A] hover:bg-blue-900 text-white font-bold transition shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              Download Official PDF
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

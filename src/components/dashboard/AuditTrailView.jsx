import React from 'react';
import { 
  History, 
  ShieldCheck, 
  Clock, 
  FileCheck2, 
  UserCheck, 
  Calendar, 
  Hash,
  Download,
  AlertOctagon
} from 'lucide-react';

export function AuditTrailView({ projectData }) {
  const auditLogs = [
    {
      timestamp: "11-Sep-2024 14:32 IST",
      event: "Statutory Section 20(E) Risk Simulation Executed",
      officer: "Special Land Acquisition Officer (CALA Pune)",
      ipAddress: "10.142.64.12 (Gov NIC Net)",
      hash: "SHA-256: e9b4c0...84401c",
      status: "VERIFIED",
      details: "Simulated 1.25x solatium package; predicted delay reduction from 148 days to 64 days."
    },
    {
      timestamp: "28-Aug-2024 11:15 IST",
      event: "Bombay High Court Interim Stay Order Registered",
      officer: "Registrar, Legal Cell, NHAI RO Mumbai",
      ipAddress: "10.142.18.90 (Judicial Portal)",
      hash: "SHA-256: 7f81a2...192b0c",
      status: "LEGAL_FLAG",
      details: "Injunction WP-4182/2024 tagged to Gut 104/1A. Automatic risk score escalated to 82."
    },
    {
      timestamp: "15-Jul-2024 16:45 IST",
      event: "Joint Measurement Survey (JMS) Phase II Logged",
      officer: "Superintendent of Land Records (SLR Paud)",
      ipAddress: "10.142.33.45 (Bhoomi Abhilekh)",
      hash: "SHA-256: 3a10d9...88e14f",
      status: "VERIFIED",
      details: "28 parcels boundary coordinates validated via Differential GPS (DGPS)."
    },
    {
      timestamp: "14-Feb-2024 10:00 IST",
      event: "Section 20(A) Notification Gazette Publication",
      officer: "Under Secretary to the Government of Maharashtra",
      ipAddress: "10.140.10.1 (Govt Gazette Press)",
      hash: "SHA-256: 01bc89...a47295",
      status: "GAZETTE_PUBLISHED",
      details: "Published in Extraordinary Gazette No. 114; Section 25 statutory 1-year lapsing clock activated."
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Statutory Compliance
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                RFCTLARR Act 2013 Section 25 Lapsing Clock
              </span>
            </div>
            <h1 className="text-xl font-black text-slate-900">
              Immutable Statutory Audit Trail & Digital Governance Log
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Cryptographically verified decision audit trail for CALA compliance, court scrutiny, and vigilance clearance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition border border-slate-300">
              <Download className="w-4 h-4 text-blue-700" />
              Download Signed Audit Log (PDF)
            </button>
          </div>
        </div>
      </div>

      {/* Statutory Section 25 Lapsing Countdown Alert */}
      <div className="bg-amber-50 rounded-xl border border-amber-300 p-4 flex items-start gap-3">
        <AlertOctagon className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 space-y-1">
          <div className="font-bold text-sm">
            Statutory Lapsing Deadline Alert (Section 25 RFCTLARR)
          </div>
          <p className="leading-relaxed">
            Final award under Section 23 must be declared within 12 months of Section 20(A) notification (by <strong>14-Feb-2025</strong>). 
            Current elapsed time: <strong>210 days</strong>. Failure to publish declaration by <strong>28-Oct-2024</strong> risks lapsing the entire acquisition proceedings.
          </p>
        </div>
      </div>

      {/* Audit Log Entries */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
          Chronological Governance Trail
        </h2>

        <div className="space-y-4">
          {auditLogs.map((log, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:shadow-sm transition space-y-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs font-bold text-slate-900">{log.event}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{log.timestamp}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed pl-6">
                {log.details}
              </p>

              <div className="pl-6 pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-3 h-3 text-blue-600" />
                  <span>Logged by: <strong>{log.officer}</strong></span>
                  <span className="text-slate-400">({log.ipAddress})</span>
                </div>
                <div className="font-mono text-slate-400">
                  {log.hash}
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

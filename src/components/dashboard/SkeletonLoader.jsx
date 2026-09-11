import React from 'react';

// Pulse shimmer base
function Bone({ className = '' }) {
  return (
    <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />
  );
}

/* -- Hero KPI Banner skeleton ----------------------------- */
export function HeroBannerSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
      {/* title row */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div className="space-y-2">
          <div className="flex gap-2">
            <Bone className="h-5 w-32" />
            <Bone className="h-5 w-48" />
          </div>
          <Bone className="h-7 w-80" />
        </div>
        <div className="space-y-1.5 text-right">
          <Bone className="h-3 w-24 ml-auto" />
          <Bone className="h-4 w-36 ml-auto" />
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 space-y-2">
            <div className="flex justify-between items-center">
              <Bone className="h-3 w-24" />
              <Bone className="h-3 w-3 rounded-full" />
            </div>
            <Bone className="h-8 w-16" />
            <Bone className="h-2.5 w-28" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* -- Map skeleton ----------------------------------------- */
export function MapSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <div className="flex justify-between items-center mb-4">
        <Bone className="h-5 w-40" />
        <div className="flex gap-2">
          <Bone className="h-7 w-20 rounded-full" />
          <Bone className="h-7 w-20 rounded-full" />
        </div>
      </div>
      <Bone className="h-64 w-full rounded-xl" />
      <div className="flex gap-3 mt-3">
        {[...Array(3)].map((_, i) => (
          <Bone key={i} className="h-4 w-24" />
        ))}
      </div>
    </div>
  );
}

/* -- Risk Score card skeleton ----------------------------- */
export function RiskScoreSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
      <Bone className="h-5 w-32" />
      <div className="flex justify-center">
        <Bone className="h-40 w-40 rounded-full" />
      </div>
      <div className="space-y-2">
        <Bone className="h-4 w-full" />
        <Bone className="h-4 w-3/4" />
      </div>
    </div>
  );
}

/* -- Risk Drivers skeleton -------------------------------- */
export function RiskDriversSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
      <Bone className="h-5 w-40" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="space-y-1.5">
          <div className="flex justify-between">
            <Bone className="h-3 w-36" />
            <Bone className="h-3 w-10" />
          </div>
          <Bone className={`h-2.5 rounded-full`} style={{ width: `${75 - i * 10}%` }} />
        </div>
      ))}
    </div>
  );
}

/* -- WhatIf Panel skeleton -------------------------------- */
export function WhatIfSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
      <Bone className="h-5 w-44" />
      <div className="flex gap-2">
        {[...Array(3)].map((_, i) => (
          <Bone key={i} className="h-7 flex-1 rounded-full" />
        ))}
      </div>
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-1.5">
          <div className="flex justify-between">
            <Bone className="h-3 w-40" />
            <Bone className="h-3 w-12" />
          </div>
          <Bone className="h-2 w-full rounded-full" />
        </div>
      ))}
      <Bone className="h-10 w-full rounded-xl" />
    </div>
  );
}

/* -- Full page skeleton (Overview tab) -------------------- */
export function DashboardSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <HeroBannerSkeleton />
      <MapSkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5 space-y-5">
          <RiskScoreSkeleton />
          <RiskDriversSkeleton />
        </div>
        <div className="lg:col-span-7 space-y-5">
          <WhatIfSkeleton />
          {/* Comparison placeholder */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3">
            <Bone className="h-5 w-44" />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => <Bone key={i} className="h-4 w-full" />)}
              </div>
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => <Bone key={i} className="h-4 w-full" />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { getRiskLevel } from '../../lib/utils';

export function RiskCategoryBadge({ score, category, size = "md" }) {
  const meta = getRiskLevel(score);
  const displayLabel = category || meta.label;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3.5 py-1.5 text-sm font-bold"
  }[size] || "px-2.5 py-1 text-xs";

  const getStyle = () => {
    if (displayLabel.includes("HIGH") || meta.color === "high") {
      return "bg-rose-500/15 text-rose-600 border-rose-300 dark:border-rose-800/60 dark:text-rose-400";
    }
    if (displayLabel.includes("MED") || meta.color === "medium") {
      return "bg-amber-500/15 text-amber-700 border-amber-300 dark:border-amber-800/60 dark:text-amber-400";
    }
    return "bg-emerald-500/15 text-emerald-700 border-emerald-300 dark:border-emerald-800/60 dark:text-emerald-400";
  };

  const Icon = (displayLabel.includes("HIGH") || meta.color === "high")
    ? AlertCircle
    : (displayLabel.includes("MED") || meta.color === "medium")
    ? AlertTriangle
    : CheckCircle2;

  return (
    <span className={`inline-flex items-center gap-1.5 font-bold tracking-wide rounded-full border ${getStyle()} ${sizeClasses}`}>
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{displayLabel}</span>
    </span>
  );
}

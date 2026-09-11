import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatINR(val) {
  if (val === undefined || val === null) return "₹0"
  if (val >= 10000000) {
    return `₹${(val / 10000000).toFixed(2)} Cr`
  }
  if (val >= 100000) {
    return `₹${(val / 100000).toFixed(2)} Lakh`
  }
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val)
}

export function getRiskLevel(score) {
  if (score >= 70) return { label: "HIGH RISK", color: "high", bg: "bg-red-50", text: "text-red-700", border: "border-red-200", fill: "#EF4444" }
  if (score >= 40) return { label: "MEDIUM RISK", color: "medium", bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200", fill: "#F59E0B" }
  return { label: "LOW RISK", color: "low", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", fill: "#10B981" }
}

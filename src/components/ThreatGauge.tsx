import React from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';
import { RiskLevel } from '../types';
import { RiskBadge } from './RiskBadge';

interface ThreatGaugeProps {
  score: number; // 0 to 100
  riskLevel: RiskLevel;
}

export const ThreatGauge: React.FC<ThreatGaugeProps> = ({ score, riskLevel }) => {
  // Score-based color schemes for dark black palette
  const getTheme = () => {
    if (score >= 70 || riskLevel === 'CRITICAL' || riskLevel === 'HIGH') {
      return {
        bg: 'bg-rose-950/40',
        border: 'border-rose-800/80',
        text: 'text-rose-300',
        badgeBg: 'bg-rose-600',
        badgeText: 'text-white',
        stroke: '#f43f5e',
        label: 'High Scam Probability',
        sublabel: 'Extreme risk — classic fraud patterns detected',
        Icon: AlertOctagon,
      };
    }
    if (score >= 45 || riskLevel === 'MEDIUM') {
      return {
        bg: 'bg-amber-950/40',
        border: 'border-amber-800/80',
        text: 'text-amber-300',
        badgeBg: 'bg-amber-500',
        badgeText: 'text-slate-950',
        stroke: '#fbbf24',
        label: 'Suspicious / Elevated Risk',
        sublabel: 'Notable scam markers found — exercise extreme caution',
        Icon: AlertTriangle,
      };
    }
    if (score >= 20 || riskLevel === 'LOW') {
      return {
        bg: 'bg-blue-950/40',
        border: 'border-blue-800/80',
        text: 'text-blue-300',
        badgeBg: 'bg-blue-600',
        badgeText: 'text-white',
        stroke: '#3b82f6',
        label: 'Low Risk / Cautionary',
        sublabel: 'Minor anomalies noted, verify directly with employer',
        Icon: ShieldCheck,
      };
    }
    return {
      bg: 'bg-emerald-950/40',
      border: 'border-emerald-800/80',
      text: 'text-emerald-300',
      badgeBg: 'bg-emerald-600',
      badgeText: 'text-white',
      stroke: '#10b981',
      label: 'Likely Legitimate',
      sublabel: 'Conforms to authentic recruitment standards',
      Icon: ShieldCheck,
    };
  };

  const theme = getTheme();
  const radius = 64;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  // Semicircle gauge calculation
  const strokeDashoffset = circumference - (score / 100) * (circumference * 0.75);

  return (
    <div 
      id="threat-gauge-card" 
      className={`p-6 rounded-2xl border ${theme.border} ${theme.bg} transition-all duration-300 shadow-lg shadow-black/60 flex flex-col md:flex-row items-center justify-between gap-6`}
    >
      <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
        <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
          <svg className="w-36 h-36 -rotate-90 transform" viewBox="0 0 160 160">
            {/* Background track */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="transparent"
              className="text-neutral-800"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * 0.25}
              strokeLinecap="round"
            />
            {/* Filled progress */}
            <motion.circle
              cx="80"
              cy="80"
              r={radius}
              stroke={theme.stroke}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold tracking-tight text-white">
              {score}%
            </span>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Threat Index
            </span>
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
            <RiskBadge score={score} riskLevel={riskLevel} size="md" />
            <span className="text-xs font-semibold text-slate-400">
              Threat Scale: 0 - 100%
            </span>
          </div>
          <h3 className={`text-xl font-bold tracking-tight ${theme.text}`}>
            {theme.label}
          </h3>
          <p className="text-sm text-slate-300 mt-1 max-w-md">
            {theme.sublabel}
          </p>
        </div>
      </div>

      {/* Threat scale legend bar */}
      <div className="w-full md:w-56 bg-neutral-900/90 p-3.5 rounded-xl border border-neutral-800 shrink-0 text-xs">
        <p className="font-semibold text-slate-300 mb-2 text-[11px] uppercase tracking-wider">
          Threat Thresholds
        </p>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span>0% – 20%</span>
            </span>
            <span className="font-medium text-slate-200">Safe / Verified</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
              <span>21% – 45%</span>
            </span>
            <span className="font-medium text-slate-200">Low Risk</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              <span>46% – 70%</span>
            </span>
            <span className="font-medium text-slate-200">Moderate</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
              <span>71% – 100%</span>
            </span>
            <span className="font-bold text-rose-300">High Threat</span>
          </div>
        </div>
      </div>
    </div>
  );
};

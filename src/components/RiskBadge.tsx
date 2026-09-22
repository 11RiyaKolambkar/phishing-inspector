import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';
import { RiskLevel } from '../types';

interface RiskBadgeProps {
  score?: number; // 0 to 100
  riskLevel?: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showScore?: boolean;
  className?: string;
}

export type RiskCategory = 'safe' | 'caution' | 'danger';

export function getRiskCategory(score?: number, riskLevel?: RiskLevel): RiskCategory {
  const effectiveScore = score ?? (
    riskLevel === 'CRITICAL' ? 95 :
    riskLevel === 'HIGH' ? 75 :
    riskLevel === 'MEDIUM' ? 50 :
    riskLevel === 'LOW' ? 20 : 5
  );

  if (effectiveScore >= 70 || riskLevel === 'CRITICAL' || riskLevel === 'HIGH') {
    return 'danger';
  }
  if (effectiveScore >= 40 || riskLevel === 'MEDIUM') {
    return 'caution';
  }
  return 'safe';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  score,
  riskLevel,
  size = 'md',
  showScore = true,
  className = '',
}) => {
  const effectiveScore = score ?? (
    riskLevel === 'CRITICAL' ? 95 :
    riskLevel === 'HIGH' ? 75 :
    riskLevel === 'MEDIUM' ? 50 :
    riskLevel === 'LOW' ? 20 : 5
  );
  const category = getRiskCategory(effectiveScore, riskLevel);

  const configs = {
    danger: {
      bg: 'bg-rose-950/80',
      text: 'text-rose-200',
      border: 'border-rose-700/80',
      indicator: 'bg-rose-500',
      icon: AlertOctagon,
      label: riskLevel ? `${riskLevel} RISK` : 'HIGH SCAM RISK',
    },
    caution: {
      bg: 'bg-amber-950/80',
      text: 'text-amber-200',
      border: 'border-amber-600/80',
      indicator: 'bg-amber-400',
      icon: AlertTriangle,
      label: riskLevel ? `${riskLevel} RISK` : 'SUSPICIOUS / CAUTION',
    },
    safe: {
      bg: 'bg-emerald-950/80',
      text: 'text-emerald-200',
      border: 'border-emerald-600/80',
      indicator: 'bg-emerald-400',
      icon: ShieldCheck,
      label: riskLevel ? `${riskLevel} RISK` : 'LIKELY LEGITIMATE',
    },
  };

  const current = configs[category];
  const Icon = current.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] gap-1.5',
    md: 'px-2.5 py-1 text-xs gap-2',
    lg: 'px-3.5 py-1.5 text-sm gap-2.5',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <span
      id="scam-threat-risk-badge"
      className={`inline-flex items-center font-bold uppercase tracking-wider rounded-full border shadow-2xs transition-colors select-none ${current.bg} ${current.text} ${current.border} ${sizeClasses[size]} ${className}`}
    >
      <span className={`rounded-full ${current.indicator} animate-pulse ${size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'}`} />
      <Icon className={`${iconSizes[size]} shrink-0`} />
      <span>{current.label}</span>
      {showScore && (
        <span className="font-mono text-[11px] opacity-90 pl-1 border-l border-current/30">
          {score !== undefined ? score : effectiveScore}%
        </span>
      )}
    </span>
  );
};

import React, { useState } from 'react';
import { 
  Clock, 
  CreditCard, 
  Building2, 
  UserX, 
  Globe, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  MessageSquareWarning, 
  Flame, 
  HelpCircle,
  Info,
  X
} from 'lucide-react';
import { RedFlag, RedFlagCategory } from '../types';

interface RedFlagsListProps {
  redFlags: RedFlag[];
}

export const RedFlagsList: React.FC<RedFlagsListProps> = ({ redFlags }) => {
  const [expandedId, setExpandedId] = useState<string | null>(redFlags[0]?.id || null);
  const [activeTooltipId, setActiveTooltipId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const getCategoryConfig = (category: RedFlagCategory) => {
    switch (category) {
      case 'urgency':
        return {
          icon: Clock,
          label: 'Urgency Pressure',
          color: 'text-amber-400 bg-amber-950/70 border-amber-800',
          definition: 'Scammers enforce synthetic 24-hour deadlines to induce panic and prevent candidates from independently verifying credentials or consulting mentors.',
        };
      case 'payment':
        return {
          icon: CreditCard,
          label: 'Upfront Payment / Check',
          color: 'text-rose-400 bg-rose-950/70 border-rose-800',
          definition: 'Authentic employers never ask candidates to pay for gear, deposit cashier checks, or wire funds back. This is classic advance-fee bank fraud.',
        };
      case 'identity':
        return {
          icon: Building2,
          label: 'Fake / Impersonated Identity',
          color: 'text-purple-400 bg-purple-950/70 border-purple-800',
          definition: 'Attackers impersonate well-known companies or executive names to manufacture false authority and lower victim skepticism.',
        };
      case 'communication':
        return {
          icon: UserX,
          label: 'Generic Greeting / Channel',
          color: 'text-orange-400 bg-orange-950/70 border-orange-800',
          definition: 'Impersonal salutations (e.g. "Dear Applicant") indicate mass automated phishing blasts sent indiscriminately to harvested databases.',
        };
      case 'domain':
        return {
          icon: Globe,
          label: 'Suspicious Domain / Email',
          color: 'text-red-400 bg-red-950/70 border-red-800',
          definition: 'Lookalike domains (e.g. apple-jobs.xyz) or free Gmail accounts used for enterprise recruitment signify spoofed infrastructure.',
        };
      case 'interview':
        return {
          icon: MessageSquareWarning,
          label: 'Irregular Interview Format',
          color: 'text-sky-400 bg-sky-950/70 border-sky-800',
          definition: 'Text-only interviews on Telegram, Signal, or WhatsApp allow anonymous operators to evade voice/face verification and identity tracebacks.',
        };
      case 'compensation':
        return {
          icon: Flame,
          label: 'Unrealistic Pay & Perks',
          color: 'text-emerald-400 bg-emerald-950/70 border-emerald-800',
          definition: 'Outrageous compensation ($60+/hr for entry-level data entry) is the bait used to overcome common sense and hook vulnerable job seekers.',
        };
      default:
        return {
          icon: AlertTriangle,
          label: 'Scam Marker',
          color: 'text-slate-400 bg-neutral-800 border-neutral-700',
          definition: 'Anomalous behavioral indicator matching confirmed employment fraud tactics.',
        };
    }
  };

  const getSeverityBadge = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-950 text-rose-300 border border-rose-800">
            High Severity
          </span>
        );
      case 'medium':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-950 text-amber-300 border border-amber-800">
            Medium Severity
          </span>
        );
      case 'low':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-950 text-blue-300 border border-blue-800">
            Low Severity
          </span>
        );
    }
  };

  if (!redFlags || redFlags.length === 0) {
    return (
      <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 text-center">
        <p className="text-sm text-slate-400">No scam red flags identified in this evaluation.</p>
      </div>
    );
  }

  return (
    <div id="red-flags-section" className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
          <span>Identified Scam Red Flags</span>
          <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-full bg-rose-950 text-rose-300 border border-rose-800">
            {redFlags.length} Found
          </span>
        </h3>
        <p className="text-xs text-slate-400 hidden sm:block">
          Click any flag to inspect evidence or hover <strong className="text-amber-400">"Why flagged"</strong> for security explanations
        </p>
      </div>

      <div className="space-y-2.5">
        {redFlags.map((flag) => {
          const catConfig = getCategoryConfig(flag.category);
          const Icon = catConfig.icon;
          const isExpanded = expandedId === flag.id;
          const isTooltipOpen = activeTooltipId === flag.id;

          return (
            <div
              key={flag.id}
              id={`red-flag-card-${flag.id}`}
              className={`rounded-xl border transition-all duration-200 bg-neutral-900 overflow-visible relative ${
                isExpanded ? 'border-rose-500/80 ring-2 ring-rose-500/20 shadow-sm' : 'border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <div className="w-full px-4 py-3.5 flex items-start sm:items-center justify-between text-left gap-3">
                <div 
                  className="flex items-start sm:items-center gap-3 flex-1 cursor-pointer"
                  onClick={() => toggleExpand(flag.id)}
                >
                  <div className={`p-2 rounded-lg shrink-0 border ${catConfig.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        {catConfig.label}
                      </span>
                      {getSeverityBadge(flag.severity)}

                      {/* Interactive "Why Flagged" Tooltip Trigger */}
                      <div className="relative inline-block">
                        <button
                          type="button"
                          id={`why-flagged-btn-${flag.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTooltipId(isTooltipOpen ? null : flag.id);
                          }}
                          onMouseEnter={() => setActiveTooltipId(flag.id)}
                          onMouseLeave={() => setActiveTooltipId(null)}
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold text-amber-300 bg-amber-950/70 border border-amber-800/80 hover:bg-amber-900/60 transition-colors cursor-help"
                          title="Click or hover to learn why this was flagged"
                        >
                          <HelpCircle className="w-3 h-3 text-amber-400" />
                          <span>Why flagged?</span>
                        </button>

                        {/* Why Flagged Tooltip Popover */}
                        {isTooltipOpen && (
                          <div 
                            role="tooltip"
                            className="absolute left-0 top-full mt-1 z-30 w-72 sm:w-80 p-3 rounded-xl bg-neutral-950 border border-amber-500/70 shadow-2xl text-xs text-slate-200 animate-in fade-in zoom-in-95 duration-150"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-start justify-between gap-1 mb-1.5 pb-1 border-b border-neutral-800">
                              <span className="font-bold text-amber-400 flex items-center gap-1 text-[11px] uppercase tracking-wider">
                                <Info className="w-3.5 h-3.5" />
                                <span>Why this is a red flag:</span>
                              </span>
                              <button 
                                onClick={() => setActiveTooltipId(null)}
                                className="text-slate-400 hover:text-white p-0.5 rounded"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                            <p className="text-[11px] text-slate-300 leading-relaxed">
                              {catConfig.definition}
                            </p>
                            <div className="mt-2 pt-1.5 border-t border-neutral-800/80 text-[10px] text-slate-400 font-mono">
                              Threat Pattern: <strong className="text-amber-300">{catConfig.label}</strong>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-slate-100">
                      {flag.title}
                    </h4>
                  </div>
                </div>

                <div 
                  className="shrink-0 p-1 text-slate-400 hover:text-slate-200 cursor-pointer"
                  onClick={() => toggleExpand(flag.id)}
                >
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-neutral-800 bg-neutral-950/70 space-y-3">
                  {flag.evidence && (
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Quoted Evidence from Offer:
                      </span>
                      <blockquote className="p-2.5 rounded-lg bg-neutral-900 border border-rose-900/80 text-xs sm:text-sm font-mono text-rose-200 italic break-words">
                        "{flag.evidence}"
                      </blockquote>
                    </div>
                  )}

                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Why This Is Dangerous:
                    </span>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {flag.explanation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

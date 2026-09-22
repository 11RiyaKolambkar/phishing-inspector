import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  TrendingUp, 
  RefreshCw, 
  ExternalLink, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Radio, 
  Search, 
  Newspaper, 
  ArrowRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Clock
} from 'lucide-react';
import { ThreatTrendsData, ThreatTrendItem, SampleOffer } from '../types';
import { fetchThreatTrends } from '../services/threatTrendsService';
import { RiskBadge } from './RiskBadge';

interface GlobalThreatTrendsProps {
  onTestSample?: (sample: SampleOffer) => void;
}

export const GlobalThreatTrends: React.FC<GlobalThreatTrendsProps> = ({ onTestSample }) => {
  const [data, setData] = useState<ThreatTrendsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedTrendId, setExpandedTrendId] = useState<string | null>(null);

  const loadTrends = async (forceFresh = false) => {
    try {
      if (forceFresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);
      const res = await fetchThreatTrends(forceFresh);
      setData(res);
      // Auto-expand first trend if none expanded
      if (!expandedTrendId && res.trends.length > 0) {
        setExpandedTrendId(res.trends[0].id);
      }
    } catch (err: any) {
      console.error('Failed to load global threat trends:', err);
      setError(err?.message || 'Unable to retrieve threat trends. Showing cached intelligence.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadTrends(false);
  }, []);

  const categories = [
    { id: 'all', label: 'All Threats' },
    { id: 'check_fraud', label: 'Check Schemes' },
    { id: 'impersonation', label: 'Recruiter Spoofing' },
    { id: 'chat_scam', label: 'Chat Interviews' },
    { id: 'task_scam', label: 'Task & Crypto' },
    { id: 'general', label: 'Portals & Identity' },
  ];

  const filteredTrends = data?.trends.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  }) || [];

  const handleTestInInspector = (trend: ThreatTrendItem) => {
    if (!onTestSample) return;

    const sampleMode = trend.sampleMode || 'email';
    const sample: SampleOffer = {
      id: `trend-test-${trend.id}`,
      label: trend.title,
      mode: sampleMode,
      categoryLabel: trend.categoryLabel,
      riskExpectation: trend.urgency === 'CRITICAL' ? 'high' : 'medium',
      description: trend.summary,
      emailDetails: sampleMode === 'email' ? {
        sender: 'hr-talent@logistics-careers-verify.com',
        subject: `ACTION REQUIRED: Remote Workstation Disbursement Check - ${trend.title}`,
        body: trend.exampleSnippet || trend.summary,
      } : undefined,
      urlDetails: sampleMode === 'url' ? {
        url: trend.sourceUrl || 'https://verified-talent-onboarding.xyz/candidate-portal',
      } : undefined,
      messageDetails: sampleMode === 'message' ? {
        platform: 'Telegram',
        senderInfo: '@Corporate_Hiring_Director',
        messageText: trend.exampleSnippet || trend.summary,
      } : undefined,
    };

    onTestSample(sample);
  };

  const formattedTime = data?.lastUpdated 
    ? new Date(data.lastUpdated).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <section 
      id="global-threat-trends" 
      aria-label="Global Threat Trends"
      className="bg-neutral-950 border border-neutral-800 rounded-3xl p-5 sm:p-7 space-y-6 shadow-xl relative overflow-hidden"
    >
      {/* Subtle top accent gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500 opacity-80" />

      {/* Header with Search Grounding status badge & live indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="w-8 h-8 rounded-xl bg-blue-950/80 border border-blue-800/80 text-blue-400 flex items-center justify-center shrink-0">
              <Globe className="w-4 h-4 text-blue-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Global Threat Trends</span>
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/80 border border-emerald-800/70 text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Search Grounded Intelligence</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300">
            Real-time tracking of active employment fraud tactics, FTC alerts, and emerging recruitment phishing schemes worldwide.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          {formattedTime && (
            <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-slate-400 font-mono">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>Synced {formattedTime}</span>
            </span>
          )}
          <button
            type="button"
            onClick={() => loadTrends(true)}
            disabled={isRefreshing || isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-slate-200 border border-neutral-700 hover:border-neutral-600 transition-colors disabled:opacity-50 shadow-2xs"
            title="Perform fresh Google Search Grounding scan"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Grounding...' : 'Refresh Trends'}</span>
          </button>
        </div>
      </div>

      {/* Intelligence Synthesis Overview */}
      {data?.overview && (
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 text-xs sm:text-sm text-slate-300 leading-relaxed flex items-start gap-3">
          <div className="p-1 rounded-lg bg-blue-950 text-blue-400 border border-blue-900/70 shrink-0 mt-0.5">
            <Radio className="w-3.5 h-3.5" />
          </div>
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="font-semibold text-white text-xs uppercase tracking-wider flex items-center justify-between">
              <span>Threat Landscape Briefing</span>
              {data.isLiveGrounded && (
                <span className="text-[10px] text-blue-400 font-mono font-normal">
                  Powered by Gemini 3.8 Flash + Google Search
                </span>
              )}
            </div>
            <p className="text-slate-300 text-xs sm:text-sm">
              {data.overview}
            </p>
          </div>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-neutral-900 hover:bg-neutral-800 text-slate-300 border border-neutral-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Error state */}
      {error && (
        <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-900/70 text-amber-200 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && !data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-800 animate-pulse space-y-3">
              <div className="h-4 bg-neutral-800 rounded w-1/3" />
              <div className="h-5 bg-neutral-800 rounded w-3/4" />
              <div className="h-12 bg-neutral-800 rounded w-full" />
              <div className="h-4 bg-neutral-800 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Active Threat Trends Cards */}
      <div className="grid grid-cols-1 gap-4">
        {filteredTrends.map((trend) => {
          const isExpanded = expandedTrendId === trend.id;
          return (
            <div
              key={trend.id}
              className={`rounded-2xl border transition-all duration-200 ${
                trend.urgency === 'CRITICAL'
                  ? 'border-rose-900/60 bg-rose-950/15 hover:border-rose-800/80'
                  : 'border-neutral-800 bg-neutral-900/80 hover:border-neutral-700'
              }`}
            >
              {/* Card Header */}
              <div 
                onClick={() => setExpandedTrendId(isExpanded ? null : trend.id)}
                className="p-4 sm:p-5 cursor-pointer flex flex-col sm:flex-row sm:items-start justify-between gap-3 select-none"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <RiskBadge 
                      riskLevel={trend.urgency === 'CRITICAL' ? 'CRITICAL' : trend.urgency === 'HIGH' ? 'HIGH' : 'MEDIUM'} 
                      size="sm"
                      showScore={false}
                    />
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-neutral-900 px-2.5 py-0.5 rounded-md border border-neutral-800">
                      {trend.categoryLabel}
                    </span>
                    {trend.urgency === 'CRITICAL' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-300">
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                        <span>Active FTC/IC3 Priority Alert</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-white text-base sm:text-lg leading-snug">
                    {trend.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {trend.summary}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-start shrink-0 pt-1">
                  <button
                    type="button"
                    aria-label={isExpanded ? 'Collapse tactic details' : 'Expand tactic details'}
                    className="p-1.5 rounded-lg bg-neutral-800/70 hover:bg-neutral-800 text-slate-400 hover:text-white transition-colors"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expanded Deep-Dive Details */}
              {isExpanded && (
                <div className="px-4 sm:px-5 pb-5 pt-1 space-y-4 border-t border-neutral-800/80 text-xs sm:text-sm">
                  {/* Tactic mechanics */}
                  <div className="space-y-1 bg-neutral-950/70 p-3.5 rounded-xl border border-neutral-800">
                    <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                      <span>How the Deception Operates</span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      {trend.tacticDetails}
                    </p>
                  </div>

                  {/* Red flags to watch */}
                  {trend.redFlagsToWatch && trend.redFlagsToWatch.length > 0 && (
                    <div className="space-y-2">
                      <div className="font-semibold text-slate-200 text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        <span>Critical Warning Signs for Job Seekers</span>
                      </div>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {trend.redFlagsToWatch.map((flag, idx) => (
                          <li key={idx} className="flex items-start gap-2 bg-neutral-900/90 p-2.5 rounded-lg border border-neutral-800/80 text-xs text-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 mt-1.5" />
                            <span>{flag}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Actionable Protective Directive */}
                  <div className="bg-blue-950/30 border border-blue-900/60 rounded-xl p-3.5 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-blue-300 text-xs uppercase tracking-wider">
                        Defense Rule
                      </div>
                      <p className="text-slate-200 text-xs font-medium mt-0.5">
                        {trend.preventativeRule}
                      </p>
                    </div>
                  </div>

                  {/* Footer actions: Test in Inspector & Grounded Source link */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    {trend.sourceTitle ? (
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 truncate">
                        <Newspaper className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span className="text-slate-500">Source:</span>
                        {trend.sourceUrl ? (
                          <a 
                            href={trend.sourceUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-indigo-400 hover:text-indigo-300 underline font-medium truncate flex items-center gap-1"
                          >
                            <span>{trend.sourceTitle}</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        ) : (
                          <span className="font-medium text-slate-300">{trend.sourceTitle}</span>
                        )}
                      </div>
                    ) : <div />}

                    {onTestSample && (
                      <button
                        type="button"
                        onClick={() => handleTestInInspector(trend)}
                        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors shadow-xs"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Test This Tactic in Inspector</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Grounded Sources & Citations Tray */}
      {data?.groundingSources && data.groundingSources.length > 0 && (
        <div className="pt-3 border-t border-neutral-800 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-500 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-blue-400" />
              <span>Search Grounding Sources & Official Advisories</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              Verified Web Citations
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {data.groundingSources.slice(0, 5).map((source, i) => (
              <a
                key={i}
                href={source.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-slate-300 hover:text-white transition-colors truncate max-w-xs"
              >
                <ExternalLink className="w-3 h-3 text-blue-400 shrink-0" />
                <span className="truncate">{source.title}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

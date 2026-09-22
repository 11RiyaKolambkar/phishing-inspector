import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  HelpCircle,
  Flag,
  Globe,
  Mail,
  Smartphone
} from 'lucide-react';

export const ThreatIntelLookup: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<any | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch(`/api/security-intel?query=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ matched: false });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div id="security-intel-lookup" className="bg-neutral-900 rounded-2xl border border-neutral-800 shadow-sm p-4 sm:p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-900 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white">
              Active Security Defense & Indicator Intelligence
            </h4>
            <p className="text-[11px] text-slate-400">
              Pre-check recruiter domain extensions, email providers, and payment keywords against verified fraud indicators.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800 self-start sm:self-auto">
          Threat Intelligence Engine
        </span>
      </div>

      <form onSubmit={handleLookup} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (result) setResult(null);
            }}
            placeholder="Test a domain (e.g. apple-jobs.work), email (@gmail.com), or keyword (Zelle, Cashier Check)..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-950 border border-neutral-800 text-slate-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-neutral-900 placeholder:text-slate-500"
          />
        </div>
        <button
          type="submit"
          disabled={!query.trim() || isSearching}
          className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors disabled:opacity-50 shrink-0"
        >
          {isSearching ? 'Checking...' : 'Check Intel'}
        </button>
      </form>

      {result && (
        <div className="p-3 rounded-xl border border-neutral-800 text-xs animate-in fade-in duration-150">
          {result.matched ? (
            <div className="flex items-start gap-2.5 bg-rose-950/40 p-2.5 rounded-lg border border-rose-800/80 text-rose-300">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold flex items-center gap-2 text-rose-200">
                  <span>Match Found: High-Risk Indicator</span>
                  <span className="text-[10px] bg-rose-900 text-rose-200 font-bold px-1.5 py-0.2 rounded border border-rose-700">
                    {result.details?.risk || 'ALERT'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {result.details?.tip}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-800/80 text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-[11px]">
                No blacklisted keywords or known spoof patterns identified for "<strong>{query}</strong>". Submit above for comprehensive AI behavioral inspection.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

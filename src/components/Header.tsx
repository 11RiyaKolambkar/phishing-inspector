import React from 'react';
import { ShieldAlert, ShieldCheck, Lock, Sparkles, Activity, Library } from 'lucide-react';
import { AuthNav } from './AuthNav';

interface HeaderProps {
  onReset?: () => void;
  onOpenHistory?: () => void;
  savedScansCount?: number;
  onOpenAlerts?: () => void;
  unreadAlertsCount?: number;
  onOpenSampleLibrary?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onReset, 
  onOpenHistory, 
  savedScansCount = 0,
  onOpenAlerts,
  unreadAlertsCount = 0,
  onOpenSampleLibrary,
}) => {
  return (
    <header className="border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md sticky top-0 z-40 transition-all shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div 
          id="app-brand-banner"
          onClick={onReset}
          className="flex items-center gap-3 cursor-pointer group select-none"
          role="button"
          tabIndex={0}
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-neutral-900 via-neutral-800 to-neutral-700 text-white flex items-center justify-center shadow-md shadow-black/40 group-hover:scale-105 transition-transform duration-200 ring-1 ring-neutral-700/50">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-neutral-950 ring-1 ring-emerald-500/20 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
                Phishing Inspector
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-950/80 text-blue-300 border border-blue-800/80 shadow-2xs">
                <Sparkles className="w-3 h-3 text-blue-400" />
                <span>AI 3.8</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              Recruitment fraud & employment scam detector
            </p>
          </div>
        </div>

        {/* Security badges, Sample Library & Auth Nav */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs text-slate-300">
          {onOpenSampleLibrary && (
            <button
              id="header-sample-library-button"
              type="button"
              onClick={onOpenSampleLibrary}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-slate-200 font-semibold transition-colors shadow-2xs"
              title="Open curated sample scam library"
            >
              <Library className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">Scam Library</span>
            </button>
          )}

          <div className="hidden md:flex items-center gap-2 pl-2 border-l border-neutral-800">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/60 text-emerald-300 font-semibold text-[11px] border border-emerald-800/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Real-Time Engine Active</span>
            </span>
          </div>

          <AuthNav
            onOpenHistory={onOpenHistory}
            savedScansCount={savedScansCount}
            onOpenAlerts={onOpenAlerts}
            unreadAlertsCount={unreadAlertsCount}
          />
        </div>
      </div>
    </header>
  );
};

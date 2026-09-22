import React, { useState } from 'react';
import { Mail, Globe, MessageSquare, ArrowRight, ShieldCheck, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { InspectionMode } from '../types';

interface HowToCheckGuideProps {
  onSelectMode?: (mode: InspectionMode) => void;
}

export const HowToCheckGuide: React.FC<HowToCheckGuideProps> = ({ onSelectMode }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div id="how-to-check-guide" className="bg-neutral-900 rounded-2xl border border-neutral-800 shadow-sm overflow-hidden">
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-blue-950/40 via-neutral-900 to-neutral-900 border-b border-neutral-800">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 block mb-0.5">
            Quick User Guide
          </span>
          <h3 className="text-sm sm:text-base font-bold text-white">
            How to Check Any Job Offer in 3 Simple Steps
          </h3>
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 transition-colors shadow-2xs self-start sm:self-auto"
        >
          <span>{isExpanded ? 'Hide Guide' : 'Show Instructions'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-neutral-950/60">
          {/* Step 1: Email */}
          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 shadow-2xs space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-950 text-blue-400 border border-blue-900 flex items-center justify-center font-bold text-xs">
              <Mail className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-100">
              1. Checking an Email
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Paste the recruiter's email address (e.g., <code className="text-blue-300">hr@google.com</code> vs <code className="text-rose-300">hr@google-careers.work</code> or <code className="text-amber-300">@gmail.com</code>), the subject line, and the offer letter body.
            </p>
            <div className="text-[11px] text-blue-300 font-semibold bg-blue-950/70 border border-blue-900/60 p-2 rounded-lg">
              ✓ Flags fake equipment checks, advance-fee wires & free domain impersonation.
            </div>
          </div>

          {/* Step 2: URL */}
          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 shadow-2xs space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-900 flex items-center justify-center font-bold text-xs">
              <Globe className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-100">
              2. Checking a Link / URL
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Paste any job application URL, candidate onboarding link, or Google Form. We dissect the domain, TLD, SSL security, and inspect the target site.
            </p>
            <div className="text-[11px] text-indigo-300 font-semibold bg-indigo-950/70 border border-indigo-900/60 p-2 rounded-lg">
              ✓ Detects lookalike domains, unbranded form builders & credential harvesting.
            </div>
          </div>

          {/* Step 3: Message */}
          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 shadow-2xs space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-900 flex items-center justify-center font-bold text-xs">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-100">
              3. Checking Chat / SMS
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Select WhatsApp, Telegram, SMS, or LinkedIn. Paste the unsolicited recruitment message and sender phone/username.
            </p>
            <div className="text-[11px] text-emerald-300 font-semibold bg-emerald-950/70 border border-emerald-900/60 p-2 rounded-lg">
              ✓ Unmasks daily crypto task scams, instant hiring & chat-only interviews.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

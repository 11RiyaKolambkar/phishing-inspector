import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  CreditCard, 
  Building2, 
  UserX, 
  Globe, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck 
} from 'lucide-react';

export const ScamSignposts: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const signs = [
    {
      icon: Clock,
      title: 'Urgency Language',
      desc: 'Scammers manufacture artificial panic ("Offer expires in 12 hours", "Immediate wire required") to prevent candidates from verifying facts or consulting others.',
      tip: 'Legitimate employers give multiple business days for formal offer consideration.',
    },
    {
      icon: CreditCard,
      title: 'Upfront Payment & Equipment Checks',
      desc: 'The #1 employment fraud pattern: they send a fake electronic check, ask you to deposit it, and instruct you to wire money to their "vendor" before the bank bounces the fake check.',
      tip: 'Real employers NEVER ask you to deposit checks or pay vendors for your equipment.',
    },
    {
      icon: Building2,
      title: 'Fake Company Details & Impersonation',
      desc: 'Criminals clone reputable brand names, hijack names of real HR directors from LinkedIn, or fabricate addresses that map to residential homes or PO boxes.',
      tip: 'Always cross-reference the opening directly on the company’s official verified website.',
    },
    {
      icon: UserX,
      title: 'Generic Greetings & Instant Hiring',
      desc: '"Dear Applicant", "Dear Candidate", or offering high compensation ($50-$80/hr) with zero phone screening, coding assessment, or face-to-face video interview.',
      tip: 'Corporate roles require thorough multi-stage interviews and personalized correspondence.',
    },
    {
      icon: Globe,
      title: 'Suspicious Domains & Free Emails',
      desc: 'Recruiting from @gmail.com or @outlook.com instead of corporate domains, or links hosted on lookalike domains (e.g. apple-jobs-onboarding.xyz).',
      tip: 'Official recruiters always send contracts from authenticated corporate email domains.',
    },
  ];

  return (
    <div id="scam-signposts-card" className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-neutral-800/80 transition-colors focus:outline-none"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-neutral-950 text-amber-400 border border-neutral-800 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">
              The 5 Classic Red Flags in Employment Scams
            </h4>
            <p className="text-xs text-slate-400">
              Key indicators Phishing Inspector scans for in every offer
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <span>{isOpen ? 'Collapse Guide' : 'View Guide'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="px-5 pb-5 pt-2 border-t border-neutral-800 bg-neutral-950/60">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
            {signs.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div 
                  key={idx} 
                  className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 shadow-2xs space-y-2"
                >
                  <div className="flex items-center gap-2 text-slate-100 font-bold text-xs sm:text-sm">
                    <Icon className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{s.title}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {s.desc}
                  </p>
                  <div className="pt-1 border-t border-neutral-800 flex items-start gap-1.5 text-[11px] text-emerald-300 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{s.tip}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Building2, 
  Briefcase, 
  CheckCircle2, 
  ShieldAlert, 
  Mail, 
  Globe, 
  MessageSquare, 
  Copy, 
  Check, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  Share2,
  Download
} from 'lucide-react';
import { AnalysisResult } from '../types';
import { RiskBadge } from './RiskBadge';

interface AnalysisOverviewProps {
  result: AnalysisResult;
  onReset: () => void;
}

export const AnalysisOverview: React.FC<AnalysisOverviewProps> = ({ result, onReset }) => {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [showOriginalContent, setShowOriginalContent] = useState(false);

  const mode = result.analyzedInput.mode || (result.analyzedInput.domain ? 'url' : 'email');

  const generateReportText = () => {
    return `[PHISHING INSPECTOR SECURITY AUDIT REPORT]
Generated: ${new Date().toLocaleString()}
Channel Inspected: ${mode.toUpperCase()}
Scam Threat Index: ${result.scamThreatIndex}% (${result.riskLevel} RISK)
Claimed Employer/Entity: ${result.detectedCompany || 'Not explicitly stated'}
Role/Offer: ${result.detectedPosition || 'Not explicitly stated'}

EVALUATION SUMMARY:
${result.summary}

IDENTIFIED RED FLAGS (${result.redFlags.length}):
${result.redFlags.map((rf, idx) => `${idx + 1}. [${rf.severity.toUpperCase()}] ${rf.title}
   - Evidence: "${rf.evidence}"
   - Danger: ${rf.explanation}`).join('\n\n')}

RECOMMENDED PROTECTIVE ACTIONS:
${result.actionableAdvice.map((a, idx) => `${idx + 1}. ${a}`).join('\n')}

AUTHENTIC TRUST SIGNALS:
${result.positiveSigns && result.positiveSigns.length > 0 
  ? result.positiveSigns.map(s => `• ${s}`).join('\n')
  : 'None detected.'}

Security Tip: Never wire money, deposit third-party checks for equipment, or share SSN before official in-person/video verification.`;
  };

  const handleCopyReport = async () => {
    const reportText = generateReportText();
    try {
      await navigator.clipboard.writeText(reportText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleShareReport = async () => {
    const reportText = generateReportText();
    const shareData = {
      title: `Phishing Inspector: ${result.detectedCompany || 'Job Offer'} (${result.scamThreatIndex}% Threat)`,
      text: reportText,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          // fallback to clipboard
          await handleCopyReport();
        }
      }
    } else {
      // Native Web Share API not supported on this browser/environment: fallback to clipboard
      await handleCopyReport();
      setShared(true);
      setTimeout(() => setShared(false), 2500);
    }
  };

  const handleDownloadReport = () => {
    const reportText = generateReportText();
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const sanitizedCompany = (result.detectedCompany || 'security-audit').replace(/[^a-zA-Z0-9_-]/g, '_');
    link.download = `Phishing-Inspector-${sanitizedCompany}-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="analysis-overview-container" className="space-y-6">
      {/* Top Metadata & Summary Box */}
      <div className="bg-neutral-900 p-5 sm:p-6 rounded-2xl border border-neutral-800 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-800">
          <div className="flex flex-wrap items-center gap-2">
            {/* Channel Badge */}
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border ${
              mode === 'email' 
                ? 'bg-blue-950/70 text-blue-300 border-blue-800' 
                : mode === 'url' 
                ? 'bg-indigo-950/70 text-indigo-300 border-indigo-800' 
                : 'bg-emerald-950/70 text-emerald-300 border-emerald-800'
            }`}>
              {mode === 'email' && <Mail className="w-3.5 h-3.5" />}
              {mode === 'url' && <Globe className="w-3.5 h-3.5" />}
              {mode === 'message' && <MessageSquare className="w-3.5 h-3.5" />}
              <span>
                {mode === 'email' && 'Email Offer Check'}
                {mode === 'url' && 'Job URL / Portal Check'}
                {mode === 'message' && `${result.analyzedInput.platform || 'Chat'} Message Check`}
              </span>
            </span>

            {result.detectedCompany && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-neutral-800 text-slate-200 border border-neutral-700">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Claimed: {result.detectedCompany}</span>
              </span>
            )}
            {result.detectedPosition && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-neutral-800 text-slate-200 border border-neutral-700">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                <span>Role: {result.detectedPosition}</span>
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              id="copy-report-button"
              type="button"
              onClick={handleCopyReport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 transition-colors focus:ring-2 focus:ring-neutral-600"
              title="Copy full evaluation text to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Report</span>
                </>
              )}
            </button>

            <button
              id="share-report-button"
              type="button"
              onClick={handleShareReport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 transition-colors"
              title="Share or send analysis to someone"
            >
              {shared ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Shared!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Share Report</span>
                </>
              )}
            </button>

            <button
              id="download-report-button"
              type="button"
              onClick={handleDownloadReport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 transition-colors"
              title="Download analysis as text file"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Save</span>
            </button>

            <button
              id="analyze-another-button"
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-300 bg-blue-950/80 hover:bg-blue-900 border border-blue-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Inspect Another</span>
            </button>
          </div>
        </div>

        {/* Input Details Metadata Bar if available */}
        {(result.analyzedInput.sender || result.analyzedInput.subject || result.analyzedInput.domain) && (
          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs flex flex-wrap items-center gap-x-4 gap-y-1.5 text-slate-300 font-mono">
            {result.analyzedInput.sender && (
              <div>
                <span className="text-slate-500 font-sans font-semibold">Sender: </span>
                <span className="text-slate-200">{result.analyzedInput.sender}</span>
              </div>
            )}
            {result.analyzedInput.subject && (
              <div>
                <span className="text-slate-500 font-sans font-semibold">Subject: </span>
                <span className="text-slate-200">{result.analyzedInput.subject}</span>
              </div>
            )}
            {result.analyzedInput.domain && (
              <div>
                <span className="text-slate-500 font-sans font-semibold">Domain: </span>
                <span className="text-slate-200">{result.analyzedInput.domain}</span>
              </div>
            )}
          </div>
        )}

        {/* Short Explanation */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Security Intelligence Evaluation
          </h4>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
            {result.summary}
          </p>
        </div>

        {/* Expandable Inspected Content Viewer */}
        <div className="pt-2 border-t border-neutral-800">
          <button
            type="button"
            onClick={() => setShowOriginalContent(!showOriginalContent)}
            className="flex items-center justify-between w-full text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors py-1"
          >
            <span>{showOriginalContent ? 'Hide Inspected Content' : 'View Submitted Content Inspected'}</span>
            {showOriginalContent ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {showOriginalContent && (
            <div className="mt-2 p-3.5 rounded-xl bg-neutral-950 text-slate-300 font-mono text-xs whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed border border-neutral-800">
              {result.analyzedInput.content}
            </div>
          )}
        </div>
      </div>

      {/* Grid: Positive Signs & Actionable Advice */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Actionable Advice / Safety Rules */}
        <div 
          id="actionable-advice-card"
          className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800 shadow-sm space-y-3"
        >
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
            <ShieldAlert className="w-4 h-4" />
            <span>Recommended Protective Actions</span>
          </div>
          <ul className="space-y-2.5">
            {result.actionableAdvice.map((advice, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <span className="w-5 h-5 rounded-full bg-rose-950 text-rose-300 border border-rose-800 font-bold flex items-center justify-center shrink-0 text-xs">
                  {idx + 1}
                </span>
                <span className="leading-snug">{advice}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Positive / Authentic Trust Markers */}
        <div 
          id="positive-signs-card"
          className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800 shadow-sm space-y-3"
        >
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>Authentic Signals & Trust Factors</span>
          </div>
          {result.positiveSigns && result.positiveSigns.length > 0 ? (
            <ul className="space-y-2.5">
              {result.positiveSigns.map((sign, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{sign}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs sm:text-sm text-slate-500 italic py-2">
              No genuine trust markers were detected in this submission. Treat with high skepticism.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

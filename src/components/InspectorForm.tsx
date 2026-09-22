import React, { useState } from 'react';
import { 
  Mail, 
  Globe, 
  MessageSquare, 
  Trash2, 
  ClipboardPaste, 
  Sparkles, 
  AlertCircle, 
  ArrowRight,
  Shield,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Info,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { InspectionMode, SampleOffer } from '../types';
import { SAMPLE_OFFERS } from '../data/samples';
import { Library } from 'lucide-react';

interface InspectorFormProps {
  onAnalyze: (payload: {
    mode: InspectionMode;
    content: string;
    emailDetails?: { sender?: string; subject?: string; body: string };
    urlDetails?: { url: string };
    messageDetails?: { platform: string; senderInfo?: string; messageText: string };
  }) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  onClearError: () => void;
  onOpenSampleLibrary?: () => void;
  preselectedSample?: SampleOffer | null;
}

export const InspectorForm: React.FC<InspectorFormProps> = ({
  onAnalyze,
  isLoading,
  error,
  onClearError,
  onOpenSampleLibrary,
  preselectedSample,
}) => {
  const [activeMode, setActiveMode] = useState<InspectionMode>('email');

  // Email form state
  const [emailSender, setEmailSender] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  // URL form state
  const [urlInput, setUrlInput] = useState('');

  // Message form state
  const [messagePlatform, setMessagePlatform] = useState<string>('WhatsApp');
  const [messageSender, setMessageSender] = useState('');
  const [messageText, setMessageText] = useState('');

  // Auto-fill when preselectedSample changes
  React.useEffect(() => {
    if (preselectedSample) {
      handleSelectSample(preselectedSample);
    }
  }, [preselectedSample]);

  // Helper to paste into target setter
  const handlePaste = async (setter: (val: string) => void) => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setter(text);
        onClearError();
      }
    } catch {
      // Fallback
    }
  };

  const handleSelectSample = (sample: SampleOffer) => {
    setActiveMode(sample.mode);
    onClearError();

    if (sample.mode === 'email' && sample.emailDetails) {
      setEmailSender(sample.emailDetails.sender);
      setEmailSubject(sample.emailDetails.subject);
      setEmailBody(sample.emailDetails.body);
    } else if (sample.mode === 'url' && sample.urlDetails) {
      setUrlInput(sample.urlDetails.url);
    } else if (sample.mode === 'message' && sample.messageDetails) {
      setMessagePlatform(sample.messageDetails.platform);
      setMessageSender(sample.messageDetails.senderInfo);
      setMessageText(sample.messageDetails.messageText);
    }
  };

  const handleClear = () => {
    if (activeMode === 'email') {
      setEmailSender('');
      setEmailSubject('');
      setEmailBody('');
    } else if (activeMode === 'url') {
      setUrlInput('');
    } else if (activeMode === 'message') {
      setMessageSender('');
      setMessageText('');
    }
    onClearError();
  };

  const isFormValid = () => {
    if (activeMode === 'email') {
      return emailBody.trim().length > 10 || emailSender.trim().length > 3;
    }
    if (activeMode === 'url') {
      return urlInput.trim().length > 3;
    }
    if (activeMode === 'message') {
      return messageText.trim().length > 10;
    }
    return false;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid() || isLoading) return;

    if (activeMode === 'email') {
      onAnalyze({
        mode: 'email',
        content: `From: ${emailSender}\nSubject: ${emailSubject}\n\n${emailBody}`,
        emailDetails: {
          sender: emailSender.trim(),
          subject: emailSubject.trim(),
          body: emailBody.trim(),
        },
      });
    } else if (activeMode === 'url') {
      onAnalyze({
        mode: 'url',
        content: urlInput.trim(),
        urlDetails: {
          url: urlInput.trim(),
        },
      });
    } else if (activeMode === 'message') {
      onAnalyze({
        mode: 'message',
        content: `Platform: ${messagePlatform}\nSender: ${messageSender}\nMessage: ${messageText}`,
        messageDetails: {
          platform: messagePlatform,
          senderInfo: messageSender.trim(),
          messageText: messageText.trim(),
        },
      });
    }
  };

  const currentModeSamples = SAMPLE_OFFERS.filter(s => s.mode === activeMode);

  return (
    <div 
      id="inspector-form-container"
      className="bg-neutral-900 rounded-3xl border border-neutral-800 shadow-2xl shadow-black/80 overflow-hidden transition-all duration-200"
    >
      {/* Visual Header / Tab Switcher */}
      <div className="p-3 sm:p-4 bg-neutral-950/80 border-b border-neutral-800 grid grid-cols-1 sm:grid-cols-3 gap-2">
        {/* Email Mode Tab */}
        <button
          type="button"
          id="mode-tab-email"
          onClick={() => {
            setActiveMode('email');
            onClearError();
          }}
          className={`p-3.5 rounded-2xl text-left transition-all flex items-start gap-3 border ${
            activeMode === 'email'
              ? 'bg-neutral-900 border-blue-500/70 ring-2 ring-blue-500/20 shadow-sm text-white'
              : 'border-transparent hover:bg-neutral-800/60 text-slate-400'
          }`}
        >
          <div className={`p-2.5 rounded-xl shrink-0 transition-colors ${
            activeMode === 'email' ? 'bg-blue-600 text-white shadow-xs' : 'bg-neutral-800 text-slate-400'
          }`}>
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-slate-100 block">
                1. Job Email
              </span>
              {activeMode === 'email' && (
                <span className="w-2 h-2 rounded-full bg-blue-400" />
              )}
            </div>
            <span className="text-[11px] text-slate-400 block leading-tight mt-0.5">
              Sender address, subject & offer letters
            </span>
          </div>
        </button>

        {/* URL Mode Tab */}
        <button
          type="button"
          id="mode-tab-url"
          onClick={() => {
            setActiveMode('url');
            onClearError();
          }}
          className={`p-3.5 rounded-2xl text-left transition-all flex items-start gap-3 border ${
            activeMode === 'url'
              ? 'bg-neutral-900 border-indigo-500/70 ring-2 ring-indigo-500/20 shadow-sm text-white'
              : 'border-transparent hover:bg-neutral-800/60 text-slate-400'
          }`}
        >
          <div className={`p-2.5 rounded-xl shrink-0 transition-colors ${
            activeMode === 'url' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-neutral-800 text-slate-400'
          }`}>
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-slate-100 block">
                2. Job Link / URL
              </span>
              {activeMode === 'url' && (
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
              )}
            </div>
            <span className="text-[11px] text-slate-400 block leading-tight mt-0.5">
              Career portals, domain typos & forms
            </span>
          </div>
        </button>

        {/* Message Mode Tab */}
        <button
          type="button"
          id="mode-tab-message"
          onClick={() => {
            setActiveMode('message');
            onClearError();
          }}
          className={`p-3.5 rounded-2xl text-left transition-all flex items-start gap-3 border ${
            activeMode === 'message'
              ? 'bg-neutral-900 border-emerald-500/70 ring-2 ring-emerald-500/20 shadow-sm text-white'
              : 'border-transparent hover:bg-neutral-800/60 text-slate-400'
          }`}
        >
          <div className={`p-2.5 rounded-xl shrink-0 transition-colors ${
            activeMode === 'message' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-neutral-800 text-slate-400'
          }`}>
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-slate-100 block">
                3. Message / Chat
              </span>
              {activeMode === 'message' && (
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              )}
            </div>
            <span className="text-[11px] text-slate-400 block leading-tight mt-0.5">
              WhatsApp, Telegram, SMS & InMail
            </span>
          </div>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-5">
        {/* Error Notification Banner */}
        {error && (
          <div 
            id="analysis-error-banner"
            className="p-4 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 flex items-start gap-3 text-xs sm:text-sm shadow-xs"
          >
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold block text-rose-200">Inspection Error</span>
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={onClearError}
              className="text-rose-400 hover:text-rose-200 text-xs font-semibold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Tab 1: EMAIL Form Fields */}
        {activeMode === 'email' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Sender Email Address */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <span>Recruiter / Sender Email</span>
                    <span className="text-slate-500 font-normal">(Crucial for domain check)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handlePaste(setEmailSender)}
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-0.5"
                  >
                    <ClipboardPaste className="w-3 h-3" />
                    <span>Paste</span>
                  </button>
                </div>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    id="email-sender-input"
                    value={emailSender}
                    onChange={(e) => {
                      setEmailSender(e.target.value);
                      onClearError();
                    }}
                    placeholder="e.g. hr-recruitment@google-careers.work or john@gmail.com"
                    className="w-full pl-10 pr-3 py-2.5 bg-neutral-950 border border-neutral-800 text-slate-100 rounded-xl text-xs sm:text-sm font-mono focus:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder:text-slate-500 placeholder:font-sans"
                  />
                </div>
              </div>

              {/* Subject Line */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">
                    Email Subject Line
                  </label>
                  <button
                    type="button"
                    onClick={() => handlePaste(setEmailSubject)}
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-0.5"
                  >
                    <ClipboardPaste className="w-3 h-3" />
                    <span>Paste</span>
                  </button>
                </div>
                <input
                  type="text"
                  id="email-subject-input"
                  value={emailSubject}
                  onChange={(e) => {
                    setEmailSubject(e.target.value);
                    onClearError();
                  }}
                  placeholder="e.g. URGENT: Remote Data Entry Operator - $45/hr Offer Letter"
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 text-slate-100 rounded-xl text-xs sm:text-sm focus:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Email Body Content */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <span>Offer Letter Body or Email Text</span>
                  <span className="text-rose-400 font-bold">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handlePaste(setEmailBody)}
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-0.5"
                  >
                    <ClipboardPaste className="w-3 h-3" />
                    <span>Paste Text</span>
                  </button>
                  {(emailSender || emailSubject || emailBody) && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="text-[11px] text-slate-500 hover:text-rose-400 inline-flex items-center gap-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear</span>
                    </button>
                  )}
                </div>
              </div>
              <textarea
                id="email-body-input"
                rows={7}
                value={emailBody}
                onChange={(e) => {
                  setEmailBody(e.target.value);
                  onClearError();
                }}
                placeholder="Paste the full text of the job invitation, contract terms, equipment purchase details, or interview request..."
                className="w-full p-3.5 bg-neutral-950 border border-neutral-800 text-slate-100 rounded-xl text-xs sm:text-sm leading-relaxed focus:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all resize-y min-h-[140px] placeholder:text-slate-500 font-normal"
              />
            </div>
          </div>
        )}

        {/* Tab 2: URL Form Fields */}
        {activeMode === 'url' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <span>Job Application or Portal Link (URL)</span>
                  <span className="text-rose-400 font-bold">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handlePaste(setUrlInput)}
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-0.5"
                  >
                    <ClipboardPaste className="w-3 h-3" />
                    <span>Paste URL</span>
                  </button>
                  {urlInput && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="text-[11px] text-slate-500 hover:text-rose-400 inline-flex items-center gap-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear</span>
                    </button>
                  )}
                </div>
              </div>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  id="job-url-input"
                  value={urlInput}
                  onChange={(e) => {
                    setUrlInput(e.target.value);
                    onClearError();
                  }}
                  placeholder="e.g. https://amazon-recruitment-onboarding.xyz/apply or https://forms.gle/xYz123"
                  className="w-full pl-10 pr-3 py-3 bg-neutral-950 border border-neutral-800 text-slate-100 rounded-xl text-xs sm:text-sm font-mono focus:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all placeholder:text-slate-500 placeholder:font-sans"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-800/60 text-xs text-indigo-300 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold block text-indigo-200">Live Domain & Threat Intelligence Check</span>
                <p className="text-indigo-300/80 text-[11px] leading-relaxed">
                  Our inspection engine evaluates domain WHOIS age, lookalike/typosquatting spoofing, SSL certificate safety, and checks for suspicious Google Forms or external credential collectors.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: MESSAGE Form Fields */}
        {activeMode === 'message' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Platform Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Chat Platform / Channel
                </label>
                <select
                  value={messagePlatform}
                  onChange={(e) => setMessagePlatform(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 text-slate-100 rounded-xl text-xs sm:text-sm focus:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                >
                  <option value="WhatsApp" className="bg-neutral-900 text-white">WhatsApp Message</option>
                  <option value="Telegram" className="bg-neutral-900 text-white">Telegram Chat</option>
                  <option value="SMS" className="bg-neutral-900 text-white">SMS / Text Message</option>
                  <option value="LinkedIn InMail" className="bg-neutral-900 text-white">LinkedIn InMail</option>
                  <option value="Signal" className="bg-neutral-900 text-white">Signal</option>
                  <option value="Other" className="bg-neutral-900 text-white">Other Direct Message</option>
                </select>
              </div>

              {/* Sender Details */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">
                    Sender Phone / Handle
                  </label>
                  <button
                    type="button"
                    onClick={() => handlePaste(setMessageSender)}
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-0.5"
                  >
                    <ClipboardPaste className="w-3 h-3" />
                    <span>Paste</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={messageSender}
                  onChange={(e) => {
                    setMessageSender(e.target.value);
                    onClearError();
                  }}
                  placeholder="e.g. +1 (555) 234-9821 or @recruiter_karen_hr"
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 text-slate-100 rounded-xl text-xs sm:text-sm font-mono focus:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all placeholder:text-slate-500 placeholder:font-sans"
                />
              </div>
            </div>

            {/* Message Text Content */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <span>Chat Message Transcript</span>
                  <span className="text-rose-400 font-bold">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handlePaste(setMessageText)}
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-0.5"
                  >
                    <ClipboardPaste className="w-3 h-3" />
                    <span>Paste Message</span>
                  </button>
                  {(messageSender || messageText) && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="text-[11px] text-slate-500 hover:text-rose-400 inline-flex items-center gap-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear</span>
                    </button>
                  )}
                </div>
              </div>
              <textarea
                rows={6}
                value={messageText}
                onChange={(e) => {
                  setMessageText(e.target.value);
                  onClearError();
                }}
                placeholder="Paste the message content received: 'Hello! I am a recruiter from Adecco, we noticed your profile and have remote part-time positions paying $300-$800/day...'"
                className="w-full p-3.5 bg-neutral-950 border border-neutral-800 text-slate-100 rounded-xl text-xs sm:text-sm leading-relaxed focus:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all resize-y min-h-[130px] placeholder:text-slate-500"
              />
            </div>
          </div>
        )}

        {/* Realistic Quick-Testing Samples */}
        <div className="pt-2 border-t border-neutral-800">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Try a realistic sample for {activeMode.toUpperCase()}:
            </span>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-500 hidden sm:inline">Click to auto-populate</span>
              {onOpenSampleLibrary && (
                <button
                  type="button"
                  id="open-sample-library-button"
                  onClick={onOpenSampleLibrary}
                  className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                >
                  <Library className="w-3.5 h-3.5" />
                  <span>Browse Full Sample Library →</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {currentModeSamples.map((sample) => (
              <button
                key={sample.id}
                type="button"
                id={`sample-button-${sample.id}`}
                onClick={() => handleSelectSample(sample)}
                disabled={isLoading}
                className="p-3 rounded-xl border border-neutral-800 hover:border-neutral-600 bg-neutral-950 hover:bg-neutral-800/80 text-left transition-all group disabled:opacity-50"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider ${
                    sample.riskExpectation === 'high' 
                      ? 'bg-rose-950 text-rose-300 border border-rose-800/60' 
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                  }`}>
                    {sample.riskExpectation === 'high' ? 'Scam Sample' : 'Legit Sample'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {sample.categoryLabel}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-200 group-hover:text-blue-300 truncate">
                  {sample.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Submit CTA or Animated Loading State */}
        <div className="pt-2">
          {isLoading ? (
            <div 
              id="analysis-loading-state"
              className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin shrink-0" />
                <div>
                  <span className="font-bold text-sm block text-slate-100">
                    Analyzing {activeMode.toUpperCase()} with Gemini AI...
                  </span>
                  <span className="text-xs text-slate-400">
                    {activeMode === 'email' && 'Scanning sender domain validity, fake check promises, and urgency phrasing...'}
                    {activeMode === 'url' && 'Inspecting domain registration, typosquatting, SSL status, and credential traps...'}
                    {activeMode === 'message' && 'Evaluating unsolicited contact, task fraud patterns, and compensation realism...'}
                  </span>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-md bg-neutral-800 text-amber-400 font-mono font-medium shrink-0">
                Calculating Threat Index...
              </span>
            </div>
          ) : (
            <button
              id="analyze-submit-button"
              type="submit"
              disabled={!isFormValid()}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-600 hover:from-blue-600 hover:to-indigo-600 disabled:from-neutral-800 disabled:to-neutral-800 disabled:text-neutral-500 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 hover:shadow-xl hover:shadow-blue-700/30 transition-all duration-200 focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed group"
            >
              <Sparkles className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
              <span>
                {activeMode === 'email' && 'Inspect Job Offer Email for Scam Red Flags'}
                {activeMode === 'url' && 'Inspect Job Link & Domain for Scam Red Flags'}
                {activeMode === 'message' && 'Inspect Message & Chat for Scam Red Flags'}
              </span>
              <ArrowRight className="w-4 h-4 text-blue-200 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

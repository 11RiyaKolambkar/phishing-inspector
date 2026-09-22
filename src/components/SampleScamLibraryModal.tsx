import React, { useState } from 'react';
import { 
  Library, 
  X, 
  Mail, 
  Globe, 
  MessageSquare, 
  ArrowRight, 
  ShieldAlert, 
  ShieldCheck, 
  ExternalLink,
  Sparkles,
  Check
} from 'lucide-react';
import { SAMPLE_OFFERS } from '../data/samples';
import { SampleOffer, InspectionMode } from '../types';
import { RiskBadge } from './RiskBadge';

interface SampleScamLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSample: (sample: SampleOffer) => void;
}

export const SampleScamLibraryModal: React.FC<SampleScamLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectSample,
}) => {
  const [filterMode, setFilterMode] = useState<InspectionMode | 'all'>('all');
  const [selectedPreview, setSelectedPreview] = useState<SampleOffer | null>(SAMPLE_OFFERS[0]);

  if (!isOpen) return null;

  const filteredSamples = filterMode === 'all' 
    ? SAMPLE_OFFERS 
    : SAMPLE_OFFERS.filter(s => s.mode === filterMode);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm">
      <div 
        id="sample-scam-library-modal"
        className="bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-800 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-900 via-indigo-900 to-blue-900 text-purple-300 border border-purple-800/80 flex items-center justify-center shadow-xs">
              <Library className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">Sample Scam & Verification Library</h3>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
                  {SAMPLE_OFFERS.length} Curated Cases
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Explore real-world recruitment fraud patterns and authentic corporate offers with 1-click loading
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-neutral-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="px-4 sm:px-5 py-2.5 bg-neutral-950 border-b border-neutral-800 flex items-center gap-2 overflow-x-auto text-xs">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 ${
              filterMode === 'all' 
                ? 'bg-neutral-800 text-white font-bold border border-neutral-700' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Samples ({SAMPLE_OFFERS.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('email')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 ${
              filterMode === 'email' 
                ? 'bg-blue-950 text-blue-300 font-bold border border-blue-800' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Job Emails</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('url')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 ${
              filterMode === 'url' 
                ? 'bg-indigo-950 text-indigo-300 font-bold border border-indigo-800' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Job Links / Domains</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('message')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 ${
              filterMode === 'message' 
                ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-800' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp / Telegram</span>
          </button>
        </div>

        {/* Split Grid: List on Left, Preview on Right */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden bg-neutral-900">
          {/* List (Left) */}
          <div className="md:col-span-5 p-3.5 sm:p-4 overflow-y-auto space-y-2 border-r border-neutral-800 max-h-[40vh] md:max-h-full">
            {filteredSamples.map((sample) => {
              const isSelected = selectedPreview?.id === sample.id;
              const isHighRisk = sample.riskExpectation === 'high';

              return (
                <div
                  key={sample.id}
                  onClick={() => setSelectedPreview(sample)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-neutral-800 border-blue-500 ring-1 ring-blue-500/30'
                      : 'bg-neutral-950 hover:bg-neutral-800/60 border-neutral-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                      isHighRisk 
                        ? 'bg-rose-950 text-rose-300 border border-rose-800' 
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {isHighRisk ? 'Scam Sample' : 'Legitimate Sample'}
                    </span>
                    <span className="text-[11px] text-slate-400 uppercase font-mono">
                      {sample.mode}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-100 line-clamp-1">
                    {sample.label}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                    {sample.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Detailed Preview & Quick Action (Right) */}
          <div className="md:col-span-7 p-4 sm:p-5 overflow-y-auto flex flex-col justify-between space-y-4 bg-neutral-950/60">
            {selectedPreview ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-neutral-800">
                  <div>
                    <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider block">
                      {selectedPreview.categoryLabel}
                    </span>
                    <h3 className="text-base font-bold text-white">
                      {selectedPreview.label}
                    </h3>
                  </div>

                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                    selectedPreview.riskExpectation === 'high'
                      ? 'bg-rose-950 text-rose-300 border-rose-800'
                      : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  }`}>
                    {selectedPreview.riskExpectation === 'high' ? 'High Risk Threat Pattern' : 'Verified Genuine Standard'}
                  </span>
                </div>

                <div className="text-xs text-slate-300 leading-relaxed bg-neutral-900 p-3 rounded-xl border border-neutral-800">
                  <span className="font-bold text-slate-200 block mb-0.5">Educational Analysis Note:</span>
                  {selectedPreview.description}
                </div>

                {/* Content excerpt */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Sample Content to Inspect:
                  </span>

                  {selectedPreview.mode === 'email' && selectedPreview.emailDetails && (
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-xs space-y-2">
                      <div className="text-slate-400 font-mono text-[11px] border-b border-neutral-800 pb-1.5 space-y-0.5">
                        <div><strong className="text-slate-300 font-sans">Sender:</strong> {selectedPreview.emailDetails.sender}</div>
                        <div><strong className="text-slate-300 font-sans">Subject:</strong> {selectedPreview.emailDetails.subject}</div>
                      </div>
                      <p className="font-mono text-slate-300 text-[11px] max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                        {selectedPreview.emailDetails.body}
                      </p>
                    </div>
                  )}

                  {selectedPreview.mode === 'url' && selectedPreview.urlDetails && (
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-xs">
                      <span className="text-slate-400 font-sans block mb-1">Target URL Domain:</span>
                      <code className="text-indigo-300 font-mono text-xs break-all bg-neutral-950 p-2 rounded block border border-neutral-800">
                        {selectedPreview.urlDetails.url}
                      </code>
                    </div>
                  )}

                  {selectedPreview.mode === 'message' && selectedPreview.messageDetails && (
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-xs space-y-2">
                      <div className="text-slate-400 font-mono text-[11px] border-b border-neutral-800 pb-1.5 space-y-0.5">
                        <div><strong className="text-slate-300 font-sans">Platform:</strong> {selectedPreview.messageDetails.platform}</div>
                        <div><strong className="text-slate-300 font-sans">Sender:</strong> {selectedPreview.messageDetails.senderInfo}</div>
                      </div>
                      <p className="font-mono text-slate-300 text-[11px] max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                        {selectedPreview.messageDetails.messageText}
                      </p>
                    </div>
                  )}
                </div>

                {/* Primary Action Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectSample(selectedPreview);
                      onClose();
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-md shadow-blue-900/30"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Load This Sample Into Inspector</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-slate-500 text-xs">
                Select a sample on the left to inspect details
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-neutral-950 border-t border-neutral-800 text-center text-[11px] text-slate-500">
          Curated based on FTC (Federal Trade Commission) and IC3 employment fraud warnings.
        </div>
      </div>
    </div>
  );
};

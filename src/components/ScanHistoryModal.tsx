import React, { useState } from 'react';
import { 
  History, 
  Trash2, 
  X, 
  ArrowUpRight, 
  Mail, 
  Globe, 
  MessageSquare, 
  ShieldCheck, 
  AlertTriangle,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { SavedScanRecord } from '../services/historyService';
import { AnalysisResult } from '../types';
import { RiskBadge } from './RiskBadge';

interface ScanHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  scans: SavedScanRecord[];
  onSelectScan: (result: AnalysisResult) => void;
  onDeleteScan: (scanId: string) => Promise<void>;
}

export const ScanHistoryModal: React.FC<ScanHistoryModalProps> = ({
  isOpen,
  onClose,
  scans,
  onSelectScan,
  onDeleteScan,
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      setDeletingId(id);
      await onDeleteScan(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div 
        id="scan-history-modal"
        className="bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-800 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-950 text-blue-400 border border-blue-900 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Your Cloud Scan Audits</h3>
              <p className="text-xs text-slate-400">
                Securely saved to your Firestore account ({scans.length} {scans.length === 1 ? 'record' : 'records'})
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

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1 bg-neutral-900">
          {scans.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-2">
              <div className="w-12 h-12 rounded-full bg-neutral-800 text-slate-500 mx-auto flex items-center justify-center">
                <History className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-200">No Saved Scans Yet</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Any emails, URLs, or chat messages you inspect while signed in will automatically be archived here in your personal cloud audit trail.
              </p>
            </div>
          ) : (
            scans.map((scan) => {
              const full = (scan as any).fullResult as AnalysisResult | undefined;
              const dateStr = scan.analysisTimestamp 
                ? new Date(scan.analysisTimestamp).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Recent';

              return (
                <div
                  key={scan.id}
                  onClick={() => {
                    if (full) {
                      onSelectScan(full);
                      onClose();
                    }
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group ${
                    scan.scamThreatIndex >= 70
                      ? 'border-rose-900/60 bg-rose-950/20 hover:bg-rose-950/40'
                      : scan.scamThreatIndex >= 40
                      ? 'border-amber-900/60 bg-amber-950/20 hover:bg-amber-950/40'
                      : 'border-neutral-800 bg-neutral-950 hover:bg-neutral-800/60'
                  }`}
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-neutral-800 text-slate-300">
                        {scan.mode === 'email' && <Mail className="w-3 h-3 text-blue-400" />}
                        {scan.mode === 'url' && <Globe className="w-3 h-3 text-indigo-400" />}
                        {scan.mode === 'message' && <MessageSquare className="w-3 h-3 text-emerald-400" />}
                        <span>{scan.mode}</span>
                      </span>

                      <RiskBadge 
                        score={scan.scamThreatIndex} 
                        riskLevel={scan.riskLevel} 
                        size="sm" 
                        showScore={true} 
                      />

                      <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3" />
                        {dateStr}
                      </span>
                    </div>

                    <div className="font-semibold text-slate-100 text-xs sm:text-sm truncate">
                      {scan.detectedCompany || (scan.mode === 'url' ? scan.analyzedInput?.domain : scan.analyzedInput?.subject) || 'Unspecified Offer'}
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-1">
                      {scan.summary}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      disabled={deletingId === scan.id}
                      onClick={(e) => handleDelete(e, scan.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-neutral-800 transition-colors"
                      title="Delete from audit history"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="p-1.5 rounded-lg text-blue-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 text-xs font-semibold">
                      <span>View</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-neutral-950 border-t border-neutral-800 text-center text-[11px] text-slate-500">
          Scans stored in your Firestore collection are encrypted and private to your account.
        </div>
      </div>
    </div>
  );
};

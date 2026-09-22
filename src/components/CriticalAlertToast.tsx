import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertOctagon, X, ShieldAlert, ArrowRight, BellRing } from 'lucide-react';
import { AnalysisResult } from '../types';

interface CriticalAlertToastProps {
  result: AnalysisResult | null;
  onDismiss: () => void;
  onOpenAdvisor?: () => void;
}

export const CriticalAlertToast: React.FC<CriticalAlertToastProps> = ({
  result,
  onDismiss,
  onOpenAdvisor,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (result && result.riskLevel === 'CRITICAL') {
      setVisible(true);
      // Play a soft attention audio ping if browser supports Web Audio API
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      } catch {
        // Audio playback allowed to fail gracefully
      }
    } else {
      setVisible(false);
    }
  }, [result?.analysisTimestamp, result?.riskLevel]);

  if (!visible || !result) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -24, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -24, scale: 0.95 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        id="critical-threat-emergency-banner"
        className="fixed top-18 left-1/2 -translate-x-1/2 z-50 w-[94vw] max-w-2xl bg-rose-600 text-white rounded-2xl shadow-2xl p-4 sm:p-5 border-2 border-rose-400/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
            <BellRing className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider bg-rose-800 text-rose-100 px-2 py-0.5 rounded">
                CRITICAL THREAT ALERT ({result.scamThreatIndex}%)
              </span>
              <span className="text-xs font-bold text-rose-100">
                Imminent Fraud Risk
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-white leading-snug">
              Urgent Safety Alert: This offer displays hallmarks of an advance-fee scam, equipment check fraud, or identity theft campaign.
            </p>
            <p className="text-[11px] text-rose-100">
              🛑 <strong>Immediate Action:</strong> Do not cash any mailed check, do not transfer money via Zelle/wire, and cease all contact.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0">
          {onOpenAdvisor && (
            <button
              type="button"
              onClick={() => {
                onDismiss();
                onOpenAdvisor();
              }}
              className="px-3 py-1.5 rounded-lg bg-white text-rose-700 hover:bg-rose-50 text-xs font-bold shadow-xs transition-colors flex items-center gap-1"
            >
              <span>Ask Advisor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={onDismiss}
            className="p-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white transition-colors"
            title="Acknowledge alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

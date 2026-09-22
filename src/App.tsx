/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { InspectorForm } from './components/InspectorForm';
import { ThreatGauge } from './components/ThreatGauge';
import { RedFlagsList } from './components/RedFlagsList';
import { AnalysisOverview } from './components/AnalysisOverview';
import { ScamSignposts } from './components/ScamSignposts';
import { HowToCheckGuide } from './components/HowToCheckGuide';
import { SecurityChatBot } from './components/SecurityChatBot';
import { ThreatIntelLookup } from './components/ThreatIntelLookup';
import { ScanHistoryModal } from './components/ScanHistoryModal';
import { CriticalAlertToast } from './components/CriticalAlertToast';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { saveScanAudit, getUserScanHistory, deleteUserScan, SavedScanRecord } from './services/historyService';
import { 
  createCriticalAlert, 
  getUserAlerts, 
  markAlertRead, 
  deleteAlert, 
  CriticalAlert,
  requestBrowserNotificationPermission,
  triggerDesktopNotification
} from './services/notificationService';
import { AnalysisResult, InspectionMode, SampleOffer } from './types';
import { RiskBadge } from './components/RiskBadge';
import { SampleScamLibraryModal } from './components/SampleScamLibraryModal';
import { GlobalThreatTrends } from './components/GlobalThreatTrends';
import { 
  ShieldAlert, 
  History, 
  ArrowUpRight, 
  CheckCircle2, 
  Mail, 
  Globe, 
  MessageSquare, 
  Bell, 
  ShieldCheck,
  Sparkles,
  Zap,
  Lock,
  ArrowRight,
  Library
} from 'lucide-react';

function AppContent() {
  const { user } = useAuth();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionHistory, setSessionHistory] = useState<AnalysisResult[]>([]);
  
  // Cloud persistent scan audit state
  const [savedScans, setSavedScans] = useState<SavedScanRecord[]>([]);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Critical Notification state
  const [alerts, setAlerts] = useState<CriticalAlert[]>([]);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [showCriticalToast, setShowCriticalToast] = useState(false);
  const [notificationPerm, setNotificationPerm] = useState<NotificationPermission>('default');

  // Sample Scam Library state
  const [isSampleLibraryOpen, setIsSampleLibraryOpen] = useState(false);
  const [selectedSampleFromLibrary, setSelectedSampleFromLibrary] = useState<SampleOffer | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);

  // Check initial notification permission
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPerm(Notification.permission);
    }
  }, []);

  // Load cloud history & alerts when user signs in
  useEffect(() => {
    if (user?.uid) {
      getUserScanHistory(user.uid)
        .then((records) => setSavedScans(records))
        .catch((err) => console.warn('History load error:', err));

      getUserAlerts(user.uid)
        .then((userAlerts) => setAlerts(userAlerts))
        .catch((err) => console.warn('Alerts load error:', err));
    } else {
      setSavedScans([]);
      setAlerts([]);
    }
  }, [user?.uid]);

  const handleRequestNotificationPermission = async () => {
    const perm = await requestBrowserNotificationPermission();
    setNotificationPerm(perm);
  };

  const handleAnalyze = async (payload: {
    mode: InspectionMode;
    content: string;
    emailDetails?: { sender?: string; subject?: string; body: string };
    urlDetails?: { url: string };
    messageDetails?: { platform: string; senderInfo?: string; messageText: string };
  }) => {
    setIsLoading(true);
    setError(null);
    setShowCriticalToast(false);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server returned error (${response.status})`);
      }

      const data: AnalysisResult = await response.json();
      setResult(data);
      setSessionHistory(prev => [data, ...prev.filter(h => h.analysisTimestamp !== data.analysisTimestamp)].slice(0, 5));

      // Trigger Alert if riskLevel is CRITICAL
      if (data.riskLevel === 'CRITICAL') {
        setShowCriticalToast(true);
        triggerDesktopNotification({
          title: `🚨 CRITICAL SCAM ALERT (${data.scamThreatIndex}%)`,
          body: `High-risk recruitment fraud trap detected for "${data.detectedCompany || data.analyzedInput.domain || 'job offer'}". Immediate action recommended.`,
        });
      }

      // Auto-save to Firestore if user is authenticated
      if (user?.uid) {
        try {
          const docId = await saveScanAudit(user.uid, user.email || 'anonymous', data);
          // If Critical, also persist to user alerts feed
          if (data.riskLevel === 'CRITICAL') {
            await createCriticalAlert(user.uid, data, docId);
            const updatedAlerts = await getUserAlerts(user.uid);
            setAlerts(updatedAlerts);
          }
          // Refresh list
          const updated = await getUserScanHistory(user.uid);
          setSavedScans(updated);
        } catch (saveErr) {
          console.warn('Could not auto-save to cloud:', saveErr);
        }
      }

      // Smooth scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'Failed to connect to the phishing evaluation engine. Please verify the input and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setShowCriticalToast(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadItem = (item: AnalysisResult) => {
    setResult(item);
    if (item.riskLevel === 'CRITICAL') {
      setShowCriticalToast(true);
    }
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleDeleteScan = async (scanId: string) => {
    if (!user?.uid) return;
    await deleteUserScan(user.uid, scanId);
    setSavedScans(prev => prev.filter(s => s.id !== scanId));
  };

  const handleMarkAlertRead = async (alertId: string) => {
    if (!user?.uid) return;
    await markAlertRead(user.uid, alertId);
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, read: true } : a));
  };

  const handleDeleteAlert = async (alertId: string) => {
    if (!user?.uid) return;
    await deleteAlert(user.uid, alertId);
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  const unreadAlertsCount = alerts.filter(a => !a.read).length;

  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white bg-dot-grid">
      <Header 
        onReset={handleReset} 
        onOpenHistory={() => setIsHistoryModalOpen(true)}
        savedScansCount={savedScans.length}
        onOpenAlerts={() => setIsAlertModalOpen(true)}
        unreadAlertsCount={unreadAlertsCount}
        onOpenSampleLibrary={() => setIsSampleLibraryOpen(true)}
      />

      {/* Critical Threat Alert Emergency Toast */}
      {showCriticalToast && (
        <CriticalAlertToast
          result={result}
          onDismiss={() => setShowCriticalToast(false)}
          onOpenAdvisor={() => {
            const chatTrigger = document.querySelector('#gemini-security-chatbot button') as HTMLElement | null;
            chatTrigger?.click();
          }}
        />
      )}

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-7">
        {/* Intro Hero with refined aesthetic */}
        <div id="intro-hero" className="text-center max-w-3xl mx-auto space-y-3 pt-2 sm:pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-950/60 text-blue-300 text-xs font-semibold border border-blue-800/60 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span>AI Employment Fraud Defense & Critical Threat Alerting</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
            Verify Any Job Email, Link, or Message
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Detect advance-fee scams, fake equipment checks, spoofed domains, and recruitment fraud before replying. Receive instant AI-grounded threat assessments with immediate safety directives.
          </p>

          {/* Key capability tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-300 bg-neutral-900/90 border border-neutral-800 px-2.5 py-1 rounded-full shadow-2xs">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>Email & Sender Header Check</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-300 bg-neutral-900/90 border border-neutral-800 px-2.5 py-1 rounded-full shadow-2xs">
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>Domain Spoof & Typo Detection</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-300 bg-neutral-900/90 border border-neutral-800 px-2.5 py-1 rounded-full shadow-2xs">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp & Telegram Inspection</span>
            </span>
          </div>
        </div>

        {/* User-Friendly Step-by-Step Guide */}
        <HowToCheckGuide />

        {/* Input Form with Dedicated Tabs for Email, URL, and Message */}
        <InspectorForm
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
          error={error}
          onClearError={() => setError(null)}
          onOpenSampleLibrary={() => setIsSampleLibraryOpen(true)}
          preselectedSample={selectedSampleFromLibrary}
        />

        {/* Threat Intelligence Indicator Engine */}
        <ThreatIntelLookup />

        {/* Results Area */}
        <div ref={resultsRef}>
          <AnimatePresence mode="wait">
            {result && (
              <motion.div
                key={result.analysisTimestamp}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="space-y-6"
              >
                {/* Cloud Save & Alert confirmation badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-neutral-900 border border-neutral-800 px-4 py-3 rounded-2xl text-xs text-slate-300 shadow-xs">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      {user 
                        ? 'Inspection audit archived securely to your Firestore cloud profile.'
                        : 'Inspection completed securely. Sign in to archive audits to Firestore.'}
                    </span>
                  </div>
                  {result.riskLevel === 'CRITICAL' && (
                    <span className="inline-flex items-center gap-1 font-bold text-rose-300 bg-rose-950/90 px-2.5 py-1 rounded-lg border border-rose-800 shadow-2xs animate-pulse">
                      <span>⚠️ Critical Security Alert Active</span>
                    </span>
                  )}
                </div>

                {/* Threat Index Gauge */}
                <ThreatGauge
                  score={result.scamThreatIndex}
                  riskLevel={result.riskLevel}
                />

                {/* Specific Red Flags */}
                <RedFlagsList redFlags={result.redFlags} />

                {/* Explanation, Company Info & Actionable Advice */}
                <AnalysisOverview
                  result={result}
                  onReset={handleReset}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Global Threat Trends Powered by Google Search Grounding */}
        <GlobalThreatTrends
          onTestSample={(sample) => {
            setSelectedSampleFromLibrary(sample);
            const formElement = document.querySelector('#inspector-form-container');
            formElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        />

        {/* Recent Session History */}
        {sessionHistory.length > 1 && (
          <div id="session-history-section" className="pt-5 border-t border-neutral-800">
            <div className="flex items-center justify-between gap-2 mb-3.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <History className="w-3.5 h-3.5 text-blue-400" />
                <span>Recently Evaluated in This Session ({sessionHistory.length})</span>
              </div>
              <span className="text-[11px] text-slate-500">Click any card to compare findings</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {sessionHistory.map((h, i) => {
                const mode = h.analyzedInput.mode || (h.analyzedInput.domain ? 'url' : 'email');
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleLoadItem(h)}
                    className={`p-3.5 rounded-2xl border text-left transition-all text-xs flex flex-col justify-between gap-2.5 shadow-2xs hover:shadow-xs ${
                      result?.analysisTimestamp === h.analysisTimestamp
                        ? 'bg-blue-950/60 border-blue-500 ring-2 ring-blue-500/20 text-white'
                        : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700 text-slate-200'
                    }`}
                  >
                    <div className="w-full">
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-100 truncate">
                          {mode === 'email' && <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                          {mode === 'url' && <Globe className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                          {mode === 'message' && <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                          <span className="truncate">
                            {h.detectedCompany || (mode === 'url' ? 'URL Check' : mode === 'email' ? 'Email Check' : 'Chat Message')}
                          </span>
                        </div>
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      </div>

                      {h.detectedPosition && (
                        <p className="text-[11px] text-slate-400 truncate mb-1">
                          Role: {h.detectedPosition}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between w-full pt-1 border-t border-neutral-800/80">
                      <RiskBadge 
                        score={h.scamThreatIndex} 
                        riskLevel={h.riskLevel} 
                        size="sm" 
                        showScore={true} 
                      />
                      <span className="text-[10px] text-slate-500 font-mono">
                        {h.redFlags.length} {h.redFlags.length === 1 ? 'flag' : 'flags'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Educational Reference on the 5 Scam Pillars */}
        <ScamSignposts />
      </main>

      {/* Persistent Cloud Scan History Modal */}
      <ScanHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        scans={savedScans}
        onSelectScan={handleLoadItem}
        onDeleteScan={handleDeleteScan}
      />

      {/* Critical Threat Notification Center Modal */}
      <NotificationCenterModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        alerts={alerts}
        onMarkRead={handleMarkAlertRead}
        onDeleteAlert={handleDeleteAlert}
        notificationPermission={notificationPerm}
        onRequestPermission={handleRequestNotificationPermission}
      />

      {/* Curated Sample Scam & Verification Library Modal */}
      <SampleScamLibraryModal
        isOpen={isSampleLibraryOpen}
        onClose={() => setIsSampleLibraryOpen(false)}
        onSelectSample={(sample) => {
          setSelectedSampleFromLibrary(sample);
          // Scroll smoothly to inspector form
          const formElement = document.querySelector('#inspector-form-container');
          formElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
      />

      {/* Multi-turn Gemini Security Chatbot */}
      <SecurityChatBot currentScan={result} />

      {/* Footer */}
      <footer className="mt-auto border-t border-neutral-800 bg-neutral-950 py-6 text-center text-xs text-slate-400">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <p className="font-medium text-slate-300">Phishing Inspector • AI Employment Fraud Defense</p>
          </div>
          <p className="flex items-center gap-1.5 text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Real-time Critical Fraud Alerts • Firestore Persistence • Browser Push Notifications</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

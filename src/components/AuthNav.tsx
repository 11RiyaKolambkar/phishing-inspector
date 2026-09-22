import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LogIn, 
  LogOut, 
  User as UserIcon, 
  ShieldCheck, 
  Sparkles, 
  History, 
  Lock, 
  AlertCircle,
  Loader2,
  ChevronDown,
  Bell,
  Mail
} from 'lucide-react';
import { AuthModal } from './AuthModal';

interface AuthNavProps {
  onOpenHistory?: () => void;
  savedScansCount?: number;
  onOpenAlerts?: () => void;
  unreadAlertsCount?: number;
}

export const AuthNav: React.FC<AuthNavProps> = ({ 
  onOpenHistory, 
  savedScansCount = 0,
  onOpenAlerts,
  unreadAlertsCount = 0
}) => {
  const { user, profile, loading, signInWithGoogle, signInAsGuest, signOut, authError, clearAuthError } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsSigningIn(true);
      await signInWithGoogle();
      setIsMenuOpen(false);
    } catch {
      // Handled in context / open modal for fallback
      setIsAuthModalOpen(true);
    } finally {
      setIsSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-slate-400 py-1 px-2.5 rounded-lg bg-neutral-900 border border-neutral-800 animate-pulse">
        <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-500" />
        <span>Authenticating...</span>
      </div>
    );
  }

  return (
    <>
      <div className="relative flex items-center gap-2">
        {authError && (
          <div className="hidden lg:flex items-center gap-1 text-[11px] text-rose-300 bg-rose-950/70 px-2 py-1 rounded border border-rose-800">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span className="truncate max-w-[160px]">{authError}</span>
            <button onClick={clearAuthError} className="ml-1 text-slate-400 hover:text-slate-200">×</button>
          </div>
        )}

        {/* Critical Threat Alert Center Bell (always accessible) */}
        {onOpenAlerts && (
          <button
            id="critical-threat-notifications-btn"
            type="button"
            onClick={onOpenAlerts}
            className="relative p-2 rounded-xl text-slate-300 hover:text-rose-400 hover:bg-neutral-800 transition-colors border border-neutral-800 bg-neutral-900"
            title="Critical Security Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-xs animate-bounce">
                {unreadAlertsCount}
              </span>
            )}
          </button>
        )}

        {user ? (
          <div className="flex items-center gap-2">
            {onOpenHistory && (
              <button
                id="view-saved-scans-btn"
                type="button"
                onClick={onOpenHistory}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700 transition-all shadow-2xs"
              >
                <History className="w-3.5 h-3.5 text-blue-400" />
                <span>Saved Scans</span>
                {savedScansCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-bold">
                    {savedScansCount}
                  </span>
                )}
              </button>
            )}

            {/* User Profile Pill */}
            <div className="relative">
              <button
                id="user-profile-menu-btn"
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition-colors text-xs text-slate-200"
              >
                {profile?.photoURL ? (
                  <img
                    src={profile.photoURL}
                    alt={profile.displayName || 'User'}
                    className="w-5 h-5 rounded-full object-cover ring-1 ring-neutral-700"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                    {(profile?.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="font-semibold text-slate-200 max-w-[110px] truncate hidden sm:inline">
                  {profile?.displayName || user.email?.split('@')[0] || 'Analyst'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-neutral-900 rounded-xl shadow-2xl border border-neutral-800 py-1.5 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-neutral-800 space-y-0.5">
                    <div className="font-bold text-white truncate">
                      {profile?.displayName || 'Security Analyst'}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate font-mono">
                      {user.email || 'Guest Anonymous Session'}
                    </div>
                    <div className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-900 mt-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Protected Cloud Storage</span>
                    </div>
                  </div>

                  {onOpenAlerts && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onOpenAlerts();
                      }}
                      className="w-full text-left px-3 py-2 text-rose-300 hover:bg-neutral-800 flex items-center gap-2 font-medium"
                    >
                      <Bell className="w-3.5 h-3.5 text-rose-400" />
                      <span>Critical Alert Center</span>
                      {unreadAlertsCount > 0 && (
                        <span className="ml-auto px-1.5 py-0.2 rounded-full bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-bold">
                          {unreadAlertsCount}
                        </span>
                      )}
                    </button>
                  )}

                  {onOpenHistory && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onOpenHistory();
                      }}
                      className="w-full text-left px-3 py-2 text-slate-300 hover:bg-neutral-800 flex items-center gap-2 font-medium"
                    >
                      <History className="w-3.5 h-3.5 text-blue-400" />
                      <span>My Scan Audit History</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      signOut();
                    }}
                    className="w-full text-left px-3 py-2 text-rose-400 hover:bg-neutral-800 flex items-center gap-2 font-semibold border-t border-neutral-800"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <button
              id="google-signin-btn"
              type="button"
              disabled={isSigningIn}
              onClick={handleGoogleLogin}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-2xs disabled:opacity-50"
            >
              {isSigningIn ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <LogIn className="w-3.5 h-3.5 text-white" />
              )}
              <span>Sign in with Google</span>
            </button>

            <button
              id="auth-modal-open-btn"
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-neutral-800 border border-neutral-800 transition-colors bg-neutral-900 shadow-2xs"
            >
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>Email / Password</span>
            </button>
          </div>
        )}
      </div>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

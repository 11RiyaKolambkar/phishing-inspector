import React from 'react';
import { 
  Bell, 
  AlertOctagon, 
  X, 
  ShieldAlert, 
  CheckCircle, 
  Trash2,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { CriticalAlert } from '../services/notificationService';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: CriticalAlert[];
  onMarkRead: (alertId: string) => void;
  onDeleteAlert: (alertId: string) => void;
  notificationPermission: NotificationPermission;
  onRequestPermission: () => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  alerts,
  onMarkRead,
  onDeleteAlert,
  notificationPermission,
  onRequestPermission,
}) => {
  if (!isOpen) return null;

  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div 
        id="notification-center-modal"
        className="bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-800 w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-950 text-rose-400 border border-rose-900 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <span>Critical Threat Alert Feed</span>
                {unreadCount > 0 && (
                  <span className="text-[10px] bg-rose-600 text-white font-extrabold px-1.5 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">
                Automated security triggers for High & Critical fraud threats
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

        {/* Browser Push Permission Banner */}
        <div className="px-4 py-2.5 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>
              Desktop Alert System:{' '}
              <strong className="capitalize font-semibold text-slate-100">
                {notificationPermission === 'granted' ? 'Active' : notificationPermission}
              </strong>
            </span>
          </div>
          {notificationPermission !== 'granted' && (
            <button
              type="button"
              onClick={onRequestPermission}
              className="text-[11px] font-bold text-blue-400 hover:text-blue-300 underline"
            >
              Enable Browser Alerts
            </button>
          )}
        </div>

        {/* Alerts List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 bg-neutral-900">
          {alerts.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-950/60 border border-emerald-900 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-200">All Clear • No Critical Alerts</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                When an inspected email, URL, or chat message scores as a 'Critical' threat, an immediate alert and protective directive will be recorded here.
              </p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                onClick={() => !alert.read && onMarkRead(alert.id)}
                className={`p-3.5 rounded-xl border transition-all flex flex-col gap-2 ${
                  alert.read
                    ? 'border-neutral-800 bg-neutral-950 text-slate-300'
                    : 'border-rose-900/80 bg-rose-950/30 text-slate-100 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-md bg-rose-950 text-rose-400 border border-rose-900">
                      <AlertOctagon className="w-4 h-4" />
                    </span>
                    <span className="font-bold text-xs sm:text-sm text-rose-300">
                      {alert.title}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteAlert(alert.id);
                    }}
                    className="p-1 text-slate-500 hover:text-rose-400 hover:bg-neutral-800 rounded transition-colors"
                    title="Dismiss alert"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed pl-6">
                  {alert.message}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pl-6 pt-1 border-t border-neutral-800">
                  <span className="font-mono">
                    Target: <strong className="text-slate-200">{alert.company || 'Unknown'}</strong> ({alert.mode})
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                    {alert.threatScore}% Threat
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-neutral-950 border-t border-neutral-800 text-center text-[11px] text-slate-500">
          Alerts synchronize securely with your authenticated Firebase account.
        </div>
      </div>
    </div>
  );
};

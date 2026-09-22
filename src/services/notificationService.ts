import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  deleteDoc, 
  doc, 
  updateDoc,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AnalysisResult } from '../types';

export interface CriticalAlert {
  id: string;
  userId: string;
  scanId?: string;
  title: string;
  message: string;
  threatScore: number;
  riskLevel: string;
  mode: string;
  company?: string;
  read: boolean;
  createdAt?: any;
}

// Request browser native notification permission
export async function requestBrowserNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.warn('Notification permission error:', err);
    return 'default';
  }
}

// Dispatch browser push/desktop notification
export function triggerDesktopNotification(alert: {
  title: string;
  body: string;
  icon?: string;
}) {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission === 'granted') {
    try {
      new Notification(alert.title, {
        body: alert.body,
        icon: alert.icon || '/favicon.ico',
        tag: 'phishing-inspector-critical-alert',
      });
    } catch (e) {
      console.warn('Could not launch Notification constructor:', e);
    }
  }
}

// Record a Critical Alert into Firestore and dispatch notifications
export async function createCriticalAlert(
  userId: string,
  result: AnalysisResult,
  scanId?: string
): Promise<string | null> {
  try {
    const company = result.detectedCompany || (result.analyzedInput.domain ? result.analyzedInput.domain : 'Unknown Job Offer');
    const title = `🚨 CRITICAL SCAM DETECTED (${result.scamThreatIndex}% Threat Index)`;
    const message = `A Critical recruitment fraud trap was detected for "${company}". Urgent action is required: do not deposit checks, wire funds, or share personal identity documents.`;

    // 1. Dispatch Desktop Notification if enabled
    triggerDesktopNotification({
      title,
      body: message,
    });

    // 2. Persist in user's /users/{userId}/alerts collection
    const alertsColRef = collection(db, 'users', userId, 'alerts');
    const docRef = await addDoc(alertsColRef, {
      userId,
      scanId: scanId || null,
      title,
      message,
      threatScore: result.scamThreatIndex,
      riskLevel: result.riskLevel,
      mode: result.analyzedInput.mode,
      company,
      read: false,
      createdAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (err) {
    console.error('Failed to create critical security alert:', err);
    return null;
  }
}

// Fetch alerts for a user
export async function getUserAlerts(userId: string): Promise<CriticalAlert[]> {
  try {
    const alertsColRef = collection(db, 'users', userId, 'alerts');
    const q = query(alertsColRef, orderBy('createdAt', 'desc'), limit(15));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({
      id: d.id,
      ...d.data(),
    } as CriticalAlert));
  } catch (err) {
    console.error('Error fetching alerts:', err);
    return [];
  }
}

// Mark alert as read
export async function markAlertRead(userId: string, alertId: string): Promise<void> {
  try {
    const docRef = doc(db, 'users', userId, 'alerts', alertId);
    await updateDoc(docRef, { read: true });
  } catch (err) {
    console.error('Error updating alert read status:', err);
  }
}

// Delete alert
export async function deleteAlert(userId: string, alertId: string): Promise<void> {
  try {
    const docRef = doc(db, 'users', userId, 'alerts', alertId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting alert:', err);
  }
}

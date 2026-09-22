import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  where
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AnalysisResult, RiskLevel } from '../types';

export interface SavedScanRecord {
  id: string;
  userId: string;
  userEmail: string;
  mode: 'email' | 'url' | 'message';
  scamThreatIndex: number;
  riskLevel: RiskLevel;
  detectedCompany?: string;
  summary: string;
  redFlagsCount: number;
  analyzedInput: any;
  analysisTimestamp: string;
  createdAt?: any;
}

export async function saveScanAudit(userId: string, userEmail: string, result: AnalysisResult): Promise<string> {
  try {
    const scansColRef = collection(db, 'users', userId, 'scans');
    const docRef = await addDoc(scansColRef, {
      userId,
      userEmail: userEmail || 'anonymous',
      mode: result.analyzedInput.mode || 'email',
      scamThreatIndex: result.scamThreatIndex,
      riskLevel: result.riskLevel,
      detectedCompany: result.detectedCompany || null,
      summary: result.summary || '',
      redFlagsCount: result.redFlags?.length || 0,
      analyzedInput: {
        mode: result.analyzedInput.mode,
        sender: result.analyzedInput.sender || null,
        subject: result.analyzedInput.subject || null,
        platform: result.analyzedInput.platform || null,
        domain: result.analyzedInput.domain || null,
        contentSnippet: (result.analyzedInput.content || '').slice(0, 300),
      },
      analysisTimestamp: result.analysisTimestamp || new Date().toISOString(),
      fullResult: result, // stored so it can be reloaded in full
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Failed to save scan audit to Firestore:', error);
    throw error;
  }
}

export async function getUserScanHistory(userId: string): Promise<SavedScanRecord[]> {
  try {
    const scansColRef = collection(db, 'users', userId, 'scans');
    const q = query(scansColRef, orderBy('createdAt', 'desc'), limit(25));
    const snap = await getDocs(q);
    
    return snap.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        userEmail: data.userEmail,
        mode: data.mode,
        scamThreatIndex: data.scamThreatIndex,
        riskLevel: data.riskLevel,
        detectedCompany: data.detectedCompany,
        summary: data.summary,
        redFlagsCount: data.redFlagsCount,
        analyzedInput: data.analyzedInput,
        analysisTimestamp: data.analysisTimestamp,
        createdAt: data.createdAt,
        fullResult: data.fullResult,
      } as SavedScanRecord & { fullResult?: AnalysisResult };
    });
  } catch (error) {
    console.error('Failed to fetch user scan history:', error);
    return [];
  }
}

export async function deleteUserScan(userId: string, scanId: string): Promise<void> {
  try {
    const docRef = doc(db, 'users', userId, 'scans', scanId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Failed to delete scan record:', error);
    throw error;
  }
}

export type RiskLevel = 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type InspectionMode = 'email' | 'url' | 'message';

export type RedFlagCategory = 
  | 'urgency' 
  | 'payment' 
  | 'identity' 
  | 'communication' 
  | 'domain' 
  | 'interview' 
  | 'compensation'
  | 'other';

export type RedFlagSeverity = 'high' | 'medium' | 'low';

export interface RedFlag {
  id: string;
  title: string;
  category: RedFlagCategory;
  severity: RedFlagSeverity;
  evidence: string;
  explanation: string;
}

export interface AnalysisResult {
  scamThreatIndex: number; // 0 to 100
  riskLevel: RiskLevel;
  summary: string;
  redFlags: RedFlag[];
  positiveSigns: string[];
  actionableAdvice: string[];
  detectedCompany?: string | null;
  detectedPosition?: string | null;
  analyzedInput: {
    mode: InspectionMode;
    content: string;
    sender?: string;
    subject?: string;
    platform?: string;
    domain?: string;
  };
  analysisTimestamp: string;
}

export interface SampleOffer {
  id: string;
  label: string;
  mode: InspectionMode;
  categoryLabel: string;
  riskExpectation: 'high' | 'medium' | 'safe';
  description: string;
  emailDetails?: {
    sender: string;
    subject: string;
    body: string;
  };
  urlDetails?: {
    url: string;
  };
  messageDetails?: {
    platform: 'WhatsApp' | 'Telegram' | 'SMS' | 'LinkedIn' | 'Discord';
    senderInfo: string;
    messageText: string;
  };
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface ThreatTrendItem {
  id: string;
  title: string;
  category: 'check_fraud' | 'impersonation' | 'chat_scam' | 'ai_deepfake' | 'task_scam' | 'general';
  categoryLabel: string;
  urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  summary: string;
  tacticDetails: string;
  redFlagsToWatch: string[];
  preventativeRule: string;
  exampleSnippet?: string;
  sampleMode?: InspectionMode;
  sourceTitle?: string;
  sourceUrl?: string;
}

export interface ThreatTrendsData {
  overview: string;
  trends: ThreatTrendItem[];
  groundingSources: GroundingSource[];
  searchQueries: string[];
  lastUpdated: string;
  isLiveGrounded: boolean;
}


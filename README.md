# Phishing Inspector

Phishing Inspector is a cybersecurity defense platform designed to protect job seekers and organizations from recruitment fraud, advance-fee check scams, lookalike domain phishing, and impersonation attacks.

Powered by Google Gemini and Google Search Grounding, the platform evaluates suspicious job emails, career URLs, and messaging outreach to produce structured threat scoring, forensic indicator extraction, and actionable remediation steps.

---

## Features

- Multi-Vector Analysis:
  - Offer Emails: Identifies free webmail sender mismatches (@gmail.com, @yahoo.com), domain typosquatting, manufactured urgency, and advance-fee equipment check schemes.
  - Career URLs and Job Portals: Analyzes newly registered suspicious domains, lookalike company URLs, non-standard TLDs (.xyz, .top), and credential harvesting forms.
  - Messaging and Chat Channels: Assesses text-only interviews and task assignments conducted on Telegram, WhatsApp, SMS, and LinkedIn InMail.

- 0-100% Scam Threat Index:
  - Categorizes findings into five risk tiers: Safe, Low, Medium, High, and Critical.
  - Returns clear breakdowns of identified red flags, positive corporate authenticity signals, and prioritized defense advice.

- Live Global Threat Trends:
  - Real-time aggregation of active recruitment fraud campaigns, FTC advisories, and FBI IC3 alerts powered by Google Search Grounding.
  - Direct integration allowing users to test active scam templates in the inspector.

- AI Security Advisor:
  - Interactive multi-turn cybersecurity assistant to guide users on next steps if personal data, banking details, or identification documents were shared.

- Fast Indicator Intelligence:
  - Immediate heuristic lookup for suspicious domains, recruiter emails, and payment keywords (Zelle, CashApp, wire transfer, cashier's check).

- Cloud Scan Auditing and Alerts:
  - Optional Google sign-in with Firebase Firestore persistence for scan histories and critical threat alerts.

---

## Tech Stack

- Frontend: React 19, TypeScript, Tailwind CSS, Motion, Lucide React
- Backend: Node.js, Express, Vite
- Artificial Intelligence: @google/genai SDK (Gemini 3.8 Flash, Gemini Flash Latest, Google Search Grounding)
- Database and Auth: Firebase Authentication, Cloud Firestore

---

## Getting Started

### Prerequisites

- Node.js (version 18 or higher recommended)
- npm or yarn
- Google Gemini API Key (from Google AI Studio)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/phishing-inspector.git
   cd phishing-inspector

##Project Structure

├── server.ts                 # Express backend, Gemini API routes, Search Grounding
├── src/
│   ├── App.tsx               # Primary application container and view routing
│   ├── components/
│   │   ├── Header.tsx        # Navigation, auth modal trigger, scan stats
│   │   ├── InspectorForm.tsx # Multi-mode input form (Email, URL, Message)
│   │   ├── ResultsView.tsx   # Threat index gauge, red flags, recommendations
│   │   ├── ThreatTrends.tsx  # Grounded global recruitment fraud intel feed
│   │   ├── IndicatorLookup.tsx# Fast regex and pattern intelligence lookup
│   │   ├── SecurityChatbot.tsx# Interactive Gemini security advisor
│   │   ├── ScanHistoryModal.tsx# Firestore saved audits modal
│   │   └── AuthModal.tsx     # Google / Email Firebase authentication
│   ├── services/
│   │   ├── firebase.ts       # Firebase client initialization
│   │   └── firestoreService.ts # History persistence and alert subscriptions
│   └── types.ts              # TypeScript definitions for scan results and threats
├── .env.example              # Sample environment configuration
└── package.json              # Project scripts and dependencies

import { SampleOffer } from '../types';

export const SAMPLE_OFFERS: SampleOffer[] = [
  // EMAIL SAMPLES
  {
    id: 'sample-email-fake-check',
    label: 'Fake Equipment Check Email',
    mode: 'email',
    categoryLabel: 'Advance-Fee Check Scam',
    riskExpectation: 'high',
    description: 'Fraudulent employment letter with free Gmail address, equipment cashier check, and wire demand.',
    emailDetails: {
      sender: 'recruitment.apextech.careers@gmail.com',
      subject: 'URGENT: Employment Offer Notification & Equipment Check',
      body: `CONGRATULATIONS! EMPLOYMENT OFFER NOTIFICATION
Company: Apex Global Technologies Inc.
From: recruitment.apextech.careers@gmail.com
Dear Applicant,

We are delighted to confirm your immediate selection for the position of Remote Administrative & Data Assistant with Apex Global Technologies. Following your swift response on Telegram, our HR board has approved your appointment at $52.00/hour (paid weekly via direct deposit).

URGENT NEXT STEPS:
Due to high volume and immediate client requirements, your employment confirmation expires strictly within 24 hours. You must reply immediately with your full legal name, home address, and direct cell phone number.

EQUIPMENT & HOME OFFICE SETUP:
Our financial accounting department will be issuing you an upfront electronic cashier's check of $3,850.00 to cover your home workstation equipment (Apple MacBook Pro, encrypted router, and specialized tracking software). Once you deposit this check into your personal bank account, you must immediately wire $3,200.00 via Zelle/Wire to our accredited equipment fulfillment vendor before 4:00 PM EST tomorrow so your shipment can be dispatched immediately.

Please confirm receipt by replying with "I ACCEPT OFFER" right away.

Warm regards,
Dr. Robert Sterling
Senior Talent Acquisition Lead`
    }
  },
  {
    id: 'sample-email-legit',
    label: 'Authentic Corporate Offer Email',
    mode: 'email',
    categoryLabel: 'Verified Corporate Offer',
    riskExpectation: 'safe',
    description: 'Legitimate employment offer following multi-stage interview panel with verified corporate domain.',
    emailDetails: {
      sender: 'david.miller@northwindhealth.com',
      subject: 'Formal Offer of Employment: Senior Frontend Engineer - Northwind Health',
      body: `Dear Alex,

On behalf of Northwind Health Solutions, I am pleased to offer you the full-time position of Senior Frontend Engineer, reporting directly to Maya Lin, Director of Engineering.

Following the completion of your technical assessment and team panel interviews, our team was deeply impressed with your background in React and healthcare data security.

Key Details of the Offer:
- Compensation: Annual base salary of $142,000, payable semi-monthly according to Northwind's regular payroll practices.
- Equity: Subject to Board approval, 12,000 stock options vesting over four years with a one-year cliff.
- Benefits: Comprehensive medical, dental, and vision insurance coverage effective on your first day, 401(k) with 4% company match, and 20 days paid vacation.
- Equipment: A standard corporate laptop and peripherals will be ordered through our internal IT provisioning portal upon receipt of signed paperwork. No personal funds or reimbursements will ever be requested from you.
- Contingency: This offer is contingent upon satisfactory completion of a background check via HireRight.

Please review this letter and return a signed copy by September 25, 2026. We look forward to welcoming you to Northwind.

Sincerely,
David Miller
VP of People & Culture
Northwind Health Solutions
100 Tech Center Parkway, Suite 400, Boston, MA`
    }
  },

  // URL SAMPLES
  {
    id: 'sample-url-phish-domain',
    label: 'Typosquatted Career Portal',
    mode: 'url',
    categoryLabel: 'Fake Domain / Credential Harvester',
    riskExpectation: 'high',
    description: 'Suspicious domain spoofing Google Careers using lookalike domain and urgent token parameters.',
    urlDetails: {
      url: 'https://google-careers-portal-apply.work/jobs/remote-operations-intake?token=urgent982'
    }
  },
  {
    id: 'sample-url-free-form',
    label: 'Free Form Builder Scam Link',
    mode: 'url',
    categoryLabel: 'SSN / Banking Harvester',
    riskExpectation: 'high',
    description: 'Job application hosted on an unbranded free webform asking for direct banking and SSN upfront.',
    urlDetails: {
      url: 'https://forms.gle/job-onboarding-immediate-id-verification-urgent'
    }
  },
  {
    id: 'sample-url-legit',
    label: 'Authentic Career Site',
    mode: 'url',
    categoryLabel: 'Verified Company Domain',
    riskExpectation: 'safe',
    description: 'Official corporate jobs portal on verifiable enterprise domain with standard SSL.',
    urlDetails: {
      url: 'https://careers.google.com/jobs/results/'
    }
  },

  // MESSAGE SAMPLES
  {
    id: 'sample-message-whatsapp',
    label: 'WhatsApp $600/Day Task Scam',
    mode: 'message',
    categoryLabel: 'Unsolicited WhatsApp / Task Fraud',
    riskExpectation: 'high',
    description: 'Classic task/review fraud promising hundreds of dollars daily via WhatsApp with zero experience.',
    messageDetails: {
      platform: 'WhatsApp',
      senderInfo: '+1 (555) 893-4122 (Unverified number with overseas area code)',
      messageText: `Hi dear! I am Sarah from Amazon Recruitment Team. We reviewed your resume online and were impressed by your profile.

We have an urgent opening for Part-Time Product Reviewer / Online Data Entry Operator.
- Work from anywhere, only 1-2 hours per day
- Daily payout: $250 - $600/day directly to your crypto wallet or bank
- No experience or resume needed! Instant onboarding today!
- Age requirement: 22+

Slots are filling very fast today! Kindly contact our recruitment manager immediately on WhatsApp at +1 (555) 893-4122 with code #AMZ-HIRE to secure your slot and claim your $50 welcome bonus. Do not miss this limited opportunity!`
    }
  },
  {
    id: 'sample-message-telegram',
    label: 'Telegram Chat Interview Scheme',
    mode: 'message',
    categoryLabel: 'Telegram Chat-Only Scam',
    riskExpectation: 'high',
    description: 'Scammer refuses video/phone call, demanding immediate text-only interview on Telegram.',
    messageDetails: {
      platform: 'Telegram',
      senderInfo: '@GlobalTechHiringLead',
      messageText: `Good day! Your profile was shortlisted for the Remote Customer Liaison role. The salary is $45/hour during 2-week paid orientation. 

Our executive interview process is conducted exclusively via Telegram text chat for privacy and confidentiality reasons. Please download Telegram immediately, add user @GlobalTechHiringLead, and message your interview code #EXEC-449. If you do not connect within 60 minutes, your position will be forfeited to the next applicant.`
    }
  },
  {
    id: 'sample-message-linkedin',
    label: 'Legitimate Recruiter InMail',
    mode: 'message',
    categoryLabel: 'Standard Recruiter Outreach',
    riskExpectation: 'safe',
    description: 'Authentic recruiter message discussing specific skills and inviting to an official introductory call.',
    messageDetails: {
      platform: 'LinkedIn',
      senderInfo: 'Jessica Vance, Senior Technical Recruiter at Databricks',
      messageText: `Hi Alex, 

I came across your profile while looking for engineers with experience in high-throughput React frontends and distributed systems. Your open-source contributions on GitHub really stood out to our engineering directors.

We have an open Staff Frontend position on our cloud platform team in San Francisco (hybrid or remote US). 

If you are open to exploring new opportunities, I would love to share the official job description and schedule a brief 20-minute intro call next week. You can also view the posting directly on databricks.com/careers (Req #DB-8192).

Let me know if you are interested!

Best,
Jessica`
    }
  }
];

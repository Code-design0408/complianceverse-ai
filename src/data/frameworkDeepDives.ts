import { FrameworkDeepDive, QuestionItem } from '../types';

export const FRAMEWORK_DEEP_DIVES: Record<string, FrameworkDeepDive> = {
  iso27001: {
    purpose: 'ISO/IEC 27001 provides a globally recognized specification for establishing, implementing, maintaining, and continually improving an Information Security Management System (ISMS). Its core purpose is to preserve the confidentiality, integrity, and availability of information through systematic risk assessment and treatment.',
    whoUsesIt: 'Enterprises, SaaS and cloud providers, financial institutions, government contractors, healthcare vendors, and any organization requiring international proof of rigorous security governance to earn enterprise client and partner trust.',
    keyComponents: [
      {
        title: 'Information Security Management System (ISMS)',
        description: 'Systematic approach consisting of policies, procedures, risk registers, and technical safeguards governed by top leadership (Clauses 4-10).',
        items: ['Context & Scope (Clause 4)', 'Leadership Commitment (Clause 5)', 'ISMS Planning & Objectives (Clause 6)']
      },
      {
        title: 'Risk Assessment & Treatment Methodology',
        description: 'Mandatory identification of information asset risks, impact evaluation, and creation of a formal Statement of Applicability (SoA).',
        items: ['Risk Acceptance Criteria', 'Risk Treatment Plans', 'Statement of Applicability (SoA)']
      },
      {
        title: 'Annex A Security Controls (93 Controls across 4 Themes)',
        description: 'Modern 2022 structure grouping safeguards into Organizational (37), People (8), Physical (14), and Technological (34) controls.',
        items: ['A.5 Organizational Controls', 'A.6 People Controls', 'A.7 Physical Controls', 'A.8 Technological Controls']
      },
      {
        title: 'Security Policies & Governance',
        description: 'Enforceable governance documentation approved by executive management, periodically audited and communicated to all personnel.',
        items: ['Access Control Policy', 'Change Management Policy', 'Incident Response Plan', 'Supplier Security Policy']
      },
      {
        title: 'Continuous Improvement & PDCA Cycle',
        description: 'Clause 9 (Performance Evaluation) and Clause 10 (Nonconformity & Corrective Action) requiring regular internal audits and management reviews.',
        items: ['Annual Internal Audits', 'Management Review Meetings (MRM)', 'Corrective Action Preventive Action (CAPA)']
      }
    ],
    beginnerExplanation: 'Think of ISO 27001 like the master building code for your company\'s digital security. Instead of just installing a few locks (antivirus or firewalls) and hoping for the best, it requires you to create an entire system: knowing every door you have, who has keys, testing the alarms every month, and holding managers responsible when safety rules are ignored.',
    professionalExplanation: 'ISO/IEC 27001:2022 specifies mandatory management system clauses (4 through 10) aligned with ISO Annex SL Harmonized Structure. Organizations must define ISMS scope, perform defensible asset-based or scenario-based risk assessments, calibrate risk appetite, and document control selections in a formal Statement of Applicability (SoA) before engaging accredited third-party certification bodies (e.g., BSI, TÜV, Schellman) for Stage 1 and Stage 2 certification audits.',
    realWorldExample: {
      organizationType: 'B2B Enterprise SaaS Provider (500 Employees)',
      scenario: 'A cloud analytics company lost several Fortune 500 deals because prospects demanded independent verification that customer telemetry was segregated, encrypted, and governed by audited management processes.',
      implementation: 'The company established an ISMS steering committee, inventoried all AWS cloud repositories and third-party SaaS tools, implemented Annex A controls (MFA, automated vulnerability scanning, quarterly user access reviews), and drafted 14 core policies.',
      outcome: 'Passed Stage 1 & Stage 2 audits with zero major non-conformities, secured ISO 27001 accredited certification, and reduced customer security questionnaire turnaround from 6 weeks to 2 days.',
      lessonLearned: 'ISO 27001 certification is not a one-time project; surveillance audits in Years 2 and 3 verify that security controls operate continuously.'
    },
    keyTakeaways: [
      'ISO 27001 mandates a risk-driven Information Security Management System (ISMS), not merely a checklist of IT controls.',
      'The Statement of Applicability (SoA) documents which Annex A controls are applied and justifies any excluded controls.',
      'Executive leadership and internal audits are required for accredited certification validity under Clauses 5 and 9.'
    ]
  },

  nistcsf: {
    purpose: 'The NIST Cybersecurity Framework (CSF) 2.0 provides guidance to organizations of all sizes to manage and reduce cybersecurity risks across their operations. It provides a common language for technical teams, executives, and boards to understand and communicate security posture.',
    whoUsesIt: 'Critical infrastructure operators (energy, utilities, defense), US federal agencies, healthcare organizations, multinational enterprises, and startups wanting a pragmatic, outcome-oriented risk management structure.',
    keyComponents: [
      {
        title: 'Govern (GV) — The Core Addition in CSF 2.0',
        description: 'Establishes and monitors the organization\'s cybersecurity risk management strategy, roles, responsibilities, and supply chain governance.',
        items: ['Organizational Context', 'Risk Management Strategy', 'Roles & Authorities', 'Cybersecurity Supply Chain (C-SCRM)']
      },
      {
        title: 'Identify (ID)',
        description: 'Understanding the organization\'s digital ecosystem to manage cybersecurity risk to assets, data, capabilities, and supply chains.',
        items: ['Asset Inventory (ID.AM)', 'Risk Assessment (ID.RA)', 'Improvement (ID.IM)']
      },
      {
        title: 'Protect (PR)',
        description: 'Delivering safeguards to ensure delivery of critical infrastructure services and limit the impact of potential cybersecurity events.',
        items: ['Identity Management & Access Control (PR.AA)', 'Data Security (PR.DS)', 'Platform Security (PR.PS)', 'Awareness & Training (PR.AT)']
      },
      {
        title: 'Detect (DE)',
        description: 'Developing and implementing appropriate activities to identify the occurrence of a cybersecurity event promptly.',
        items: ['Continuous Monitoring (DE.CM)', 'Adverse Event Analysis (DE.AE)']
      },
      {
        title: 'Respond (RS)',
        description: 'Taking action regarding a detected cybersecurity incident to contain damage, mitigate harm, and communicate with stakeholders.',
        items: ['Incident Management (RS.MA)', 'Incident Analysis (RS.AN)', 'Mitigation (RS.MI)']
      },
      {
        title: 'Recover (RC)',
        description: 'Maintaining plans for resilience and restoring any capabilities or services that were impaired due to a cybersecurity incident.',
        items: ['Incident Recovery Plan Execution (RC.RP)', 'Post-Incident Communication (RC.CO)']
      }
    ],
    beginnerExplanation: 'Think of NIST CSF like the ultimate safety playbook: Govern decides who is in charge of safety rules, Identify creates a list of everything valuable you own, Protect puts up fences and locks, Detect installs security cameras and alarms, Respond calls the fire department and puts out fires, and Recover repairs the building so business gets back to normal.',
    professionalExplanation: 'NIST CSF 2.0 structures cybersecurity activities across 6 Core Functions, 22 Categories, and 106 Subcategories. It emphasizes Profiles (Current Profile vs Target Profile) and Implementation Tiers (Tier 1 Partial to Tier 4 Adaptive) to calibrate cybersecurity investments against organizational risk tolerance. The Govern function establishes explicit board-level fiduciary accountability and supply chain vendor governance.',
    realWorldExample: {
      organizationType: 'Regional Electric Utility & Critical Infrastructure Provider',
      scenario: 'Following state regulatory directives, the utility needed to evaluate whether its operational technology (SCADA) and corporate IT networks could withstand advanced persistent threat (APT) ransomware attacks.',
      implementation: 'Benchmarked current operational maturity across the 6 CSF 2.0 functions, drafted Target Profiles, isolated SCADA control loops behind multi-factor jump hosts (Protect), and deployed 24/7 endpoint detection and network anomaly telemetry (Detect).',
      outcome: 'Elevated organizational maturity from Tier 1 (Ad Hoc) to Tier 3 (Repeatable), established executive dashboard metrics for board oversight, and met NERC CIP alignment.',
      lessonLearned: 'CSF 2.0 provides an adaptable framework that bridges technical IT/OT controls with executive governance and capital allocation.'
    },
    keyTakeaways: [
      'NIST CSF 2.0 introduces GOVERN as the umbrella function linking cybersecurity to enterprise risk and supply chain oversight.',
      'Core Functions: GOVERN, IDENTIFY, PROTECT, DETECT, RESPOND, RECOVER.',
      'CSF is non-prescriptive, allowing companies to create custom Current and Target Profiles suited to their unique risk profile.'
    ]
  },

  soc2: {
    purpose: 'Developed by the American Institute of CPAs (AICPA), SOC 2 (System and Organization Controls 2) establishes auditing procedures that evaluate a service organization\'s internal controls relevant to the Trust Services Criteria (TSC) to ensure customer data is securely managed in the cloud.',
    whoUsesIt: 'B2B SaaS companies, cloud service providers (AWS, GCP, Azure), managed service providers (MSPs), data centers, and modern tech startups selling products to enterprise clients.',
    keyComponents: [
      {
        title: 'Security (Common Criteria - CC1 to CC9)',
        description: 'The baseline mandatory criteria evaluating perimeter defenses, IAM, encryption, vulnerability scanning, firewalls, and incident response.',
        items: ['Control Environment (CC1)', 'Communication & Info (CC2)', 'Risk Assessment (CC3)', 'Monitoring (CC4)', 'Control Activities (CC5)', 'Logical & Physical Access (CC6)', 'System Operations (CC7)', 'Change Management (CC8)', 'Risk Mitigation (CC9)']
      },
      {
        title: 'Availability',
        description: 'Ensuring the system is operational and accessible for authorized use as committed or agreed in Service Level Agreements (SLAs).',
        items: ['Redundancy & Failover', 'DDoS Protection', 'Disaster Recovery (DR) Drills', 'Backup RTO/RPO Verification']
      },
      {
        title: 'Processing Integrity',
        description: 'Validating that system processing is complete, valid, accurate, timely, and authorized without unintended data corruption.',
        items: ['Data Ingestion Validation', 'Error Logging & Handling', 'Automated Reconciliation Checks']
      },
      {
        title: 'Confidentiality',
        description: 'Protecting information designated as confidential (proprietary IP, financial data, business contracts) from unauthorized disclosure.',
        items: ['Strict RBAC & NDAs', 'CPA-approved Data Disposal', 'Encrypted Repositories & Transmission']
      },
      {
        title: 'Privacy',
        description: 'Evaluating how personal information (PII) is collected, used, retained, disclosed, and disposed of in conformity with the AICPA privacy principles.',
        items: ['Notice & Choice', 'User Consent Tracking', 'Data Retention Periods', 'DSAR Fulfillment Mechanisms']
      }
    ],
    beginnerExplanation: 'Imagine you run a bank vault where customers store their valuables. SOC 2 is when an independent licensed auditor inspects your vault for months, tests whether your guards actually check IDs, makes sure your cameras don\'t turn off, and writes an official report proving to customers that their data is safe with you.',
    professionalExplanation: 'A SOC 2 report is an independent attestation conducted by a licensed CPA firm under SSAE 18 (AT-C 205). A Type I report evaluates the design of controls at a specific point in time, while a Type II report tests the operating effectiveness of controls over an evaluation period (typically 3 to 12 months). Security is mandatory (Common Criteria), with Availability, Processing Integrity, Confidentiality, and Privacy scoped in as required by customer commitments.',
    realWorldExample: {
      organizationType: 'Healthcare Scheduling Cloud Platform',
      scenario: 'To close enterprise hospital contracts, the sales team needed an attestation that the scheduling microservices and database tiers operated under tested security safeguards without downtime.',
      implementation: 'Scoped SOC 2 Type II for Security and Confidentiality. Implemented Terraform branch protection, automated GitHub pull request approvals, enforced Okta MFA with hardware tokens, and configured continuous evidence logging with Datadog and AWS CloudTrail.',
      outcome: 'Received an unqualified ("clean") SOC 2 Type II audit report with zero exceptions across 6 months, unlocking $4.2M in annual enterprise pipeline.',
      lessonLearned: 'Automating continuous evidence collection eliminates the "audit panic" typical of manual annual screenshot gathering.'
    },
    keyTakeaways: [
      'SOC 2 Type I inspects control design at a single point in time; Type II evaluates operational effectiveness over 3-12 months.',
      'The Security criterion (Common Criteria) is mandatory for every SOC 2 report.',
      'Reports are issued strictly by licensed CPA firms adhering to AICPA guidelines.'
    ]
  },

  gdpr: {
    purpose: 'The General Data Protection Regulation (EU 2016/679) establishes a comprehensive legal framework for personal data protection across the European Union and EEA, granting data subjects enforceable privacy rights and holding data controllers and processors strictly accountable.',
    whoUsesIt: 'Any organization worldwide that offers goods or services to EU residents, monitors their online behavior, or employs EU personnel, regardless of where the organization is physically headquartered.',
    keyComponents: [
      {
        title: 'Personal Data & Special Category Data',
        description: 'Broadly covers any information relating to an identified or identifiable natural person (IP addresses, cookie IDs, biometric, health, genetic data).',
        items: ['Direct Identifiers (Name, Email)', 'Online Identifiers (Cookies, Device IDs)', 'Special Category (Article 9)']
      },
      {
        title: 'The 7 Core Data Protection Principles (Article 5)',
        description: 'Lawfulness, fairness & transparency; Purpose limitation; Data minimisation; Accuracy; Storage limitation; Integrity & confidentiality; Accountability.',
        items: ['Purpose Limitation', 'Data Minimisation', 'Storage Limitation', 'Accountability Mandate']
      },
      {
        title: 'Data Subject Rights (Articles 12-23)',
        description: 'Legally enforceable rights that organizations must fulfill within 30 days without undue delay.',
        items: ['Right to Access (DSAR)', 'Right to Rectification', 'Right to Erasure ("To Be Forgotten")', 'Right to Data Portability', 'Right to Restrict Processing']
      },
      {
        title: 'Lawful Basis of Processing & Consent (Articles 6 & 7)',
        description: 'Processing requires at least one of 6 lawful grounds: Consent, Contract, Legal Obligation, Vital Interests, Public Task, or Legitimate Interests.',
        items: ['Freely Given & Granular Consent', 'Contractual Necessity', 'Legitimate Interest Assessments (LIA)']
      },
      {
        title: '72-Hour Breach Notification & DPIAs (Articles 33-35)',
        description: 'Mandatory breach notification to Data Protection Authorities (DPA) within 72 hours, and Data Protection Impact Assessments for high-risk operations.',
        items: ['72h Supervisory Authority Notice', 'High Risk Individual Communication', 'Mandatory DPIA Execution', 'Data Protection Officer (DPO) Appointment']
      }
    ],
    beginnerExplanation: 'GDPR says that your personal data—like your name, what you browse, your health details, and your location—belongs to you, not to companies. If a company wants to collect it, they must ask nicely, only take what they truly need, delete it when you ask, and face massive fines if they hide a data breach from you.',
    professionalExplanation: 'GDPR enforces extraterritorial jurisdiction (Article 3(2)) with non-compliance penalties reaching up to €20M or 4% of total worldwide annual turnover. Organizations must maintain Article 30 Records of Processing Activities (RoPA), implement Privacy by Design and by Default (Article 25), execute Standard Contractual Clauses (SCCs) for international data transfers, and institute technical safeguards like pseudonymization and end-to-end encryption.',
    realWorldExample: {
      organizationType: 'Global E-Commerce & Retail Marketplace',
      scenario: 'Following expansion into France, Germany, and Spain, European DPAs issued inquiry notices regarding third-party advertising tracking and consumer data retention schedules.',
      implementation: 'Appointed an external European DPO, audited all cookies with a Consent Management Platform (CMP), established automated workflows for Data Subject Access Requests (DSARs), and codified a 72-hour incident escalation playbook.',
      outcome: 'Achieved 100% compliance across EU supervisory authorities, fulfilled over 1,200 DSARs within the 30-day window, and mitigated regulatory fine exposure.',
      lessonLearned: 'Consent must be an active, unambiguous opt-in; pre-ticked checkboxes or forced cookie walls violate GDPR requirements.'
    },
    keyTakeaways: [
      'Extraterritorial reach applies to any global business processing personal data of European residents.',
      'Supervisory authorities must be notified within 72 hours of becoming aware of a data breach.',
      'Penalties can reach up to 4% of global annual turnover or €20 million, whichever is higher.'
    ]
  },

  pcidss: {
    purpose: 'The Payment Card Industry Data Security Standard (PCI-DSS) v4.0 is a global technical standard designed to protect payment cardholder data (CHD) and sensitive authentication data (SAD) against payment fraud, data theft, and unauthorized card operations.',
    whoUsesIt: 'Merchants, acquiring banks, payment processors, fintech payment gateways, and software providers that store, process, or transmit cardholder data from Visa, Mastercard, American Express, Discover, or JCB.',
    keyComponents: [
      {
        title: 'Cardholder Data Environment (CDE) Scoping & Segmentation',
        description: 'Isolating systems that store, process, or transmit CHD or SAD using strict firewalls, network segmentation, and tokenization.',
        items: ['Primary Account Number (PAN)', 'Sensitive Authentication Data (SAD / CVV)', 'VLAN & Firewall Boundaries', 'Tokenization Platforms']
      },
      {
        title: 'Protecting Stored Cardholder Data (Requirement 3)',
        description: 'Rendering PAN unreadable using strong cryptography (AES-256), hashing, or truncation; absolute ban on storing SAD post-authorization.',
        items: ['No SAD Storage Post-Auth', 'Key Management (Req 3.6)', 'Encrypted Card Repositories']
      },
      {
        title: 'Universal Access Control & MFA (Requirements 7 & 8)',
        description: 'Enforcing least privilege and mandatory Multi-Factor Authentication for all users accessing the Cardholder Data Environment.',
        items: ['Req 8.4.2 Universal MFA for CDE Access', 'Automated Session Logouts', 'Role-Based Access Control (RBAC)']
      },
      {
        title: 'Script Management & Vulnerability Defense (Requirements 6 & 11)',
        description: 'Mitigating client-side Magecart payment page skimming and running quarterly internal and Approved Scanning Vendor (ASV) scans.',
        items: ['Req 6.4.3 Payment Page Script Integrity (SRI)', 'Quarterly ASV External Scans', 'Annual Penetration Testing']
      },
      {
        title: 'Security Monitoring & Policies (Requirements 10 & 12)',
        description: 'Logging every user and administrative action within the CDE, reviewing logs daily, and maintaining comprehensive information security policies.',
        items: ['Centralized Audit Logs (SIEM)', 'Automated File Integrity Monitoring (FIM)', 'Annual Security Policy Attestations']
      }
    ],
    beginnerExplanation: 'PCI-DSS is the rulebook that protects your credit card whenever you buy something online or swipe in a store. It forbids stores from saving your secret 3-digit CVV code, requires strong encryption so hackers can\'t read card numbers, and makes companies test their defenses every few months.',
    professionalExplanation: 'PCI-DSS v4.0 introduces 64 new requirements, emphasizing customized implementation approaches alongside the traditional defined approach. Critical mandates include Req 6.4.3 (script authorization and Subresource Integrity on payment e-commerce pages to eliminate web skimming), Req 8.4.2 (MFA for all individuals entering the CDE, not just remote access), and strict cryptographic key rotation lifecycle protocols.',
    realWorldExample: {
      organizationType: 'FinTech Payment Orchestration API',
      scenario: 'Processing over 10 million transactions annually categorized the company as a Level 1 Merchant requiring an annual Report on Compliance (ROC) signed by a Qualified Security Assessor (QSA).',
      implementation: 'Migrated direct credit card inputs to hosted iframe tokenization fields, configured Subresource Integrity (SRI) scripts, segmented database clusters via AWS Security Groups, and deployed automated File Integrity Monitoring (FIM).',
      outcome: 'Successfully executed an annual Attestation of Compliance (AOC) and ROC with zero findings, maintaining certified Level 1 Service Provider status.',
      lessonLearned: 'Using hosted iframe tokenization transfers card ingestion away from internal servers, drastically shrinking CDE audit scope.'
    },
    keyTakeaways: [
      'Sensitive Authentication Data (SAD / CVV / PIN) must NEVER be stored after transaction authorization.',
      'PCI-DSS v4.0 mandates MFA for all user accounts accessing the Cardholder Data Environment.',
      'Network segmentation is the most effective engineering strategy to reduce compliance scope and audit overhead.'
    ]
  },

  'cis-controls': {
    purpose: 'The CIS Critical Security Controls (CIS Controls) v8 are a prioritized, prescriptive set of 18 cybersecurity best practices created by a global community of practitioners to defend against the most widespread and damaging cyber attack vectors.',
    whoUsesIt: 'Security operations centers (SOCs), IT administrators, CISOs, defense contractors, educational institutions, and organizations seeking an actionable, tactical defense-in-depth blueprint to implement cyber hygiene.',
    keyComponents: [
      {
        title: 'Asset & Software Inventory (CIS 1 & 2)',
        description: 'Actively managing and tracking all enterprise assets (devices, servers, cloud workloads) and authorized software running across the environment.',
        items: ['Enterprise Asset Inventory (CIS 1)', 'Software Asset Inventory (CIS 2)', 'DHCP Log Review', 'Unauthorized Device Isolation']
      },
      {
        title: 'Data Protection & Secure Baseline Configurations (CIS 3 & 4)',
        description: 'Establishing cryptographic classification for data and hardened system configuration benchmarks (CIS Benchmarks) for operating systems.',
        items: ['Data Classification & Encryption (CIS 3)', 'Secure Configuration of Assets (CIS 4)', 'Automated Configuration Monitoring']
      },
      {
        title: 'Account & Access Management (CIS 5 & 6)',
        description: 'Managing credentials, enforcing least privilege, removing dormant accounts, and requiring MFA across all administrative and user endpoints.',
        items: ['Account Management (CIS 5)', 'Access Control Management (CIS 6)', 'Centralized Directory (LDAP/IdP)', 'Privileged Access Management (PAM)']
      },
      {
        title: 'Continuous Vulnerability & Log Management (CIS 7 & 8)',
        description: 'Automated vulnerability scanning, vulnerability remediation SLAs, centralized audit log collection, and SIEM event correlation.',
        items: ['Continuous Vulnerability Management (CIS 7)', 'Audit Log Management (CIS 8)', 'Remediation Timelines', 'Time Synchronization (NTP)']
      },
      {
        title: 'Network Defense, Monitoring & Incident Response (CIS 10-18)',
        description: 'Data recovery, network infrastructure defense, application software security, penetration testing, and structured incident response runbooks.',
        items: ['Data Recovery (CIS 11)', 'Network Infrastructure (CIS 12)', 'Application Software Security (CIS 16)', 'Incident Response Management (CIS 17)']
      }
    ],
    beginnerExplanation: 'Think of CIS Controls as the ultimate doctor-approved checklist for cyber health. Instead of buying fancy tools you don\'t understand, it tells you the exact steps in order: first, know every computer you own; second, know what software is installed; third, lock down passwords and update everything constantly.',
    professionalExplanation: 'CIS Controls v8 organizes 153 Safeguards across 18 Controls, prioritized by Implementation Groups: IG1 represents essential foundational cyber hygiene for small-to-medium businesses; IG2 targets enterprises managing complex operational data; and IG3 defends against sophisticated nation-state threat actors and targeted zero-day exploits. Controls are explicitly mapped to NIST CSF, MITRE ATT&CK, and ISO 27001.',
    realWorldExample: {
      organizationType: 'Municipal Government & Public Sector Agency',
      scenario: 'Facing escalating ransomware attacks targeting regional school systems and public infrastructure, the agency required a prioritized security roadmap within limited taxpayer budgets.',
      implementation: 'Implemented CIS Implementation Group 1 (IG1): deployed automated network discovery to catalog unknown assets (CIS 1), enforced CIS Benchmarks on 2,400 endpoints via Group Policy (CIS 4), and mandated MFA across all administrative portals (CIS 6).',
      outcome: 'Eliminated 88% of credential-stuffing and unpatched vulnerability risks within 90 days while establishing defensible public accountability.',
      lessonLearned: 'Prioritizing Implementation Group 1 (IG1) mitigates the overwhelming majority of common cyber threats before investing in advanced tools.'
    },
    keyTakeaways: [
      'CIS Controls v8 is prioritized into Implementation Groups: IG1 (Essential Hygiene), IG2, and IG3.',
      'You cannot protect what you do not know: CIS 1 (Hardware Assets) and CIS 2 (Software Assets) are the foundation.',
      'Directly maps to MITRE ATT&CK techniques, providing measurable defense-in-depth against real attacker behavior.'
    ]
  }
};

export const FRAMEWORK_QUIZ_QUESTIONS: Record<string, QuestionItem[]> = {
  iso27001: [
    {
      id: 'q-iso-1',
      frameworkId: 'iso27001',
      domain: 'ISMS Governance',
      difficulty: 'Beginner',
      question: 'What is the primary purpose of an Information Security Management System (ISMS) in ISO 27001?',
      options: [
        'To eliminate the need for IT firewalls',
        'To systematically manage information security risks through governance, policies, and controls',
        'To guarantee 100% protection against all nation-state cyber attacks',
        'To replace all internal IT personnel with certified external auditors'
      ],
      correctIndex: 1,
      explanation: 'ISO 27001 specifies requirements for establishing, implementing, maintaining, and continually improving an ISMS to systematically preserve confidentiality, integrity, and availability.'
    },
    {
      id: 'q-iso-2',
      frameworkId: 'iso27001',
      domain: 'Annex A Controls',
      difficulty: 'Intermediate',
      question: 'Which mandatory ISO 27001 document lists which Annex A security controls have been selected or excluded, along with justifications?',
      options: [
        'Business Impact Analysis (BIA)',
        'Statement of Applicability (SoA)',
        'Master Service Agreement (MSA)',
        'Disaster Recovery Runbook'
      ],
      correctIndex: 1,
      explanation: 'The Statement of Applicability (SoA) is a mandatory ISO 27001 document that details which Annex A controls are applied, how they are implemented, and the justification for any exclusions.'
    }
  ],
  nistcsf: [
    {
      id: 'q-nist-1',
      frameworkId: 'nistcsf',
      domain: 'Core Functions',
      difficulty: 'Beginner',
      question: 'Which core function was introduced as a major addition in NIST Cybersecurity Framework 2.0?',
      options: [
        'Encrypt',
        'Govern',
        'Audit',
        'Isolate'
      ],
      correctIndex: 1,
      explanation: 'NIST CSF 2.0 introduced GOVERN (GV) as a dedicated foundational function to emphasize that cybersecurity risk management must be integrated directly into enterprise governance and executive decision-making.'
    },
    {
      id: 'q-nist-2',
      frameworkId: 'nistcsf',
      domain: 'Core Functions',
      difficulty: 'Intermediate',
      question: 'What is the key difference between the Detect (DE) and Respond (RS) functions in NIST CSF?',
      options: [
        'Detect only applies to physical locks, whereas Respond applies to software',
        'Detect discovers cybersecurity events in a timely manner; Respond executes containment and mitigation actions',
        'Detect is executed by external auditors, whereas Respond is executed by customers',
        'Detect is optional in CSF 2.0, whereas Respond is mandatory'
      ],
      correctIndex: 1,
      explanation: 'Detect (DE) activities discover cybersecurity events promptly (e.g., continuous monitoring, anomalies); Respond (RS) activities contain the impact and mitigate harm once an incident is verified.'
    }
  ],
  soc2: [
    {
      id: 'q-soc2-1',
      frameworkId: 'soc2',
      domain: 'Trust Services Criteria',
      difficulty: 'Beginner',
      question: 'Which of the AICPA Trust Services Criteria is mandatory for every SOC 2 examination?',
      options: [
        'Availability',
        'Processing Integrity',
        'Security (Common Criteria)',
        'Privacy'
      ],
      correctIndex: 2,
      explanation: 'The Security category (also known as the Common Criteria) is required in every SOC 2 report. The other criteria (Availability, Processing Integrity, Confidentiality, Privacy) are included depending on service commitments.'
    },
    {
      id: 'q-soc2-2',
      frameworkId: 'soc2',
      domain: 'Report Types',
      difficulty: 'Intermediate',
      question: 'What distinguishes a SOC 2 Type II report from a Type I report?',
      options: [
        'Type I evaluates internal controls at a single point in time, while Type II evaluates their operating effectiveness over a period (e.g., 3–12 months)',
        'Type I is for healthcare, while Type II is for financial institutions',
        'Type I can be written by an engineer, while Type II requires a lawyer',
        'Type II is only applicable to public companies on the NYSE'
      ],
      correctIndex: 0,
      explanation: 'A Type I report verifies that controls are designed appropriately at a specific date. A Type II report audits whether those controls operated effectively over an extended testing window.'
    }
  ],
  gdpr: [
    {
      id: 'q-gdpr-1',
      frameworkId: 'gdpr',
      domain: 'Breach Notification',
      difficulty: 'Beginner',
      question: 'Under GDPR Article 33, what is the maximum timeframe for notifying the supervisory authority after becoming aware of a personal data breach?',
      options: [
        '24 hours',
        '72 hours',
        '30 days',
        '6 months'
      ],
      correctIndex: 1,
      explanation: 'GDPR Article 33 mandates that in the case of a personal data breach, the data controller must notify the competent supervisory authority within 72 hours of becoming aware of it.'
    },
    {
      id: 'q-gdpr-2',
      frameworkId: 'gdpr',
      domain: 'Principles',
      difficulty: 'Intermediate',
      question: 'Which GDPR principle requires that personal data must be kept only for as long as necessary for the specified processing purposes?',
      options: [
        'Data Minimisation',
        'Storage Limitation',
        'Integrity and Confidentiality',
        'Lawfulness and Transparency'
      ],
      correctIndex: 1,
      explanation: 'Article 5(1)(e) defines the Storage Limitation principle, requiring that personal data be kept in a form which permits identification of data subjects for no longer than is necessary.'
    }
  ],
  pcidss: [
    {
      id: 'q-pci-1',
      frameworkId: 'pcidss',
      domain: 'Protecting Cardholder Data',
      difficulty: 'Beginner',
      question: 'According to PCI-DSS rules, is an organization ever permitted to store Sensitive Authentication Data (such as the 3-digit CVV/CVC code) after transaction authorization?',
      options: [
        'Yes, as long as it is encrypted with AES-256',
        'No, storing SAD/CVV after authorization is strictly prohibited under any circumstances',
        'Yes, if the customer checks the "Remember Card" box',
        'Only if the database is hosted in an isolated GovCloud environment'
      ],
      correctIndex: 1,
      explanation: 'PCI-DSS strictly prohibits the storage of Sensitive Authentication Data (SAD), including full magnetic stripe data, CAV2/CVC2/CVV2/CID, and PINs, after authorization has completed.'
    },
    {
      id: 'q-pci-2',
      frameworkId: 'pcidss',
      domain: 'PCI-DSS v4.0',
      difficulty: 'Intermediate',
      question: 'Which PCI-DSS v4.0 requirement mandates that all scripts executing on payment checkout pages be inventoried and integrity-verified to prevent web skimming?',
      options: [
        'Requirement 1.2',
        'Requirement 6.4.3',
        'Requirement 8.4.2',
        'Requirement 12.1'
      ],
      correctIndex: 1,
      explanation: 'Requirement 6.4.3 in PCI-DSS v4.0 specifically targets client-side e-commerce web skimming attacks by requiring documented justification and integrity verification (such as SRI) for all scripts on payment pages.'
    }
  ],
  'cis-controls': [
    {
      id: 'q-cis-1',
      frameworkId: 'cis-controls',
      domain: 'Asset Management',
      difficulty: 'Beginner',
      question: 'Why are CIS Control 1 (Enterprise Assets) and CIS Control 2 (Software Assets) placed first in the framework hierarchy?',
      options: [
        'They are the cheapest controls to purchase from software vendors',
        'An organization cannot protect or defend assets and software that it does not know exist',
        'They are only applicable to hardware routers and physical cables',
        'They replace the need for employee cybersecurity training'
      ],
      correctIndex: 1,
      explanation: 'CIS Controls prioritizes asset and software inventory first because complete visibility into the digital footprint is a non-negotiable prerequisite before configuring firewalls, vulnerability scans, or access controls.'
    },
    {
      id: 'q-cis-2',
      frameworkId: 'cis-controls',
      domain: 'Implementation Groups',
      difficulty: 'Intermediate',
      question: 'In CIS Controls v8, what does Implementation Group 1 (IG1) represent?',
      options: [
        'Advanced defenses reserved only for national intelligence agencies',
        'Essential cyber hygiene that every organization should implement to guard against non-targeted attacks',
        'Voluntary suggestions that carry no security value',
        'Hardware-only controls for cloud data centers'
      ],
      correctIndex: 1,
      explanation: 'Implementation Group 1 (IG1) represents foundational cyber hygiene. It consists of 56 safeguards designed to defend small-to-medium enterprises against the most prevalent automated cyber threats.'
    }
  ]
};

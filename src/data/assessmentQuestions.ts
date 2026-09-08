import { QuestionItem, AssessmentTrack } from '../types';

/**
 * Curated Assessment Tracks for ComplianceVerse AI
 * Covers all requested domains:
 * - Cybersecurity Fundamentals
 * - Compliance Fundamentals
 * - Risk Management
 * - ISO 27001
 * - NIST CSF
 * - SOC 2
 * - HIPAA
 * - PCI-DSS
 * - GDPR
 */
export const ASSESSMENT_TRACKS: AssessmentTrack[] = [
  {
    id: 'track-cybersecurity-fundamentals',
    title: 'Cybersecurity Fundamentals Certification',
    frameworkId: 'cybersecurity_fundamentals',
    frameworkTitle: 'Cybersecurity Core',
    category: 'Cybersecurity',
    difficulty: 'Beginner',
    description: 'Master the core foundational tenets: CIA triad, zero trust architecture, defense-in-depth, cryptographic primitives, and secure protocols.',
    questionCount: 15,
    durationMinutes: 20,
    passingScorePercent: 75,
    xpReward: 200,
    supportedTypes: ['multiple_choice', 'true_false', 'scenario'],
    targetAudience: 'Aspiring Analysts, Developers, IT Administrators',
    examType: 'framework',
    isPopular: true,
  },
  {
    id: 'track-compliance-fundamentals',
    title: 'Compliance & Audit Fundamentals',
    frameworkId: 'compliance_fundamentals',
    frameworkTitle: 'GRC Fundamentals',
    category: 'Compliance',
    difficulty: 'Beginner',
    description: 'Learn attestation vs. certification, continuous evidence sampling, audit workpapers, auditor independence, and compliance lifecycle management.',
    questionCount: 15,
    durationMinutes: 20,
    passingScorePercent: 75,
    xpReward: 200,
    supportedTypes: ['multiple_choice', 'true_false', 'scenario'],
    targetAudience: 'GRC Analysts, Compliance Officers, Product Managers',
    examType: 'framework',
    isPopular: false,
  },
  {
    id: 'track-risk-management',
    title: 'Enterprise Risk Management (ERM & NIST SP 800-30)',
    frameworkId: 'risk_management',
    frameworkTitle: 'Risk Management',
    category: 'Risk Management',
    difficulty: 'Intermediate',
    description: 'In-depth evaluation of qualitative vs. quantitative risk scoring, threat modeling, inherent vs. residual risk, risk registers, and vendor risk tiering.',
    questionCount: 15,
    durationMinutes: 25,
    passingScorePercent: 75,
    xpReward: 250,
    supportedTypes: ['multiple_choice', 'true_false', 'scenario'],
    targetAudience: 'Risk Managers, Security Architects, CISO Staff',
    examType: 'framework',
    isPopular: true,
  },
  {
    id: 'track-iso27001-lead-auditor',
    title: 'ISO/IEC 27001:2022 Lead Auditor Simulation',
    frameworkId: 'iso27001',
    frameworkTitle: 'ISO 27001:2022',
    category: 'Security & Privacy',
    difficulty: 'Advanced',
    description: 'Rigorous exam evaluating ISMS Clauses 4 through 10, the 4 Annex A control themes (Organizational, People, Physical, Technological), and SoA auditing.',
    questionCount: 20,
    durationMinutes: 30,
    passingScorePercent: 75,
    xpReward: 350,
    supportedTypes: ['multiple_choice', 'true_false', 'scenario'],
    targetAudience: 'Internal Auditors, Lead Implementers, Information Security Officers',
    examType: 'framework',
    isPopular: true,
  },
  {
    id: 'track-nistcsf-governance',
    title: 'NIST CSF 2.0 Governance & Controls Assessment',
    frameworkId: 'nistcsf',
    frameworkTitle: 'NIST CSF 2.0',
    category: 'Cybersecurity',
    difficulty: 'Intermediate',
    description: 'Assess understanding across the six NIST 2.0 functions: Govern (GV), Identify (ID), Protect (PR), Detect (DE), Respond (RS), and Recover (RC).',
    questionCount: 15,
    durationMinutes: 25,
    passingScorePercent: 75,
    xpReward: 250,
    supportedTypes: ['multiple_choice', 'true_false', 'scenario'],
    targetAudience: 'Security Engineers, Incident Handlers, GRC Consultants',
    examType: 'framework',
    isPopular: false,
  },
  {
    id: 'track-soc2-readiness',
    title: 'SOC 2 Type II Readiness & Controls Audit',
    frameworkId: 'soc2',
    frameworkTitle: 'SOC 2 Type II',
    category: 'Cloud & SaaS',
    difficulty: 'Intermediate',
    description: 'Test deep knowledge of the Trust Services Criteria (Common Criteria CC1-CC9), population sampling, observation periods, and CI/CD security controls.',
    questionCount: 20,
    durationMinutes: 30,
    passingScorePercent: 75,
    xpReward: 300,
    supportedTypes: ['multiple_choice', 'true_false', 'scenario'],
    targetAudience: 'DevOps Leads, Cloud Security Engineers, SaaS Founders',
    examType: 'framework',
    isPopular: true,
  },
  {
    id: 'track-hipaa-security-privacy',
    title: 'HIPAA Security, Privacy & Breach Notification Rule',
    frameworkId: 'hipaa',
    frameworkTitle: 'HIPAA & HITECH',
    category: 'Healthcare',
    difficulty: 'Intermediate',
    description: 'Administrative, Physical, and Technical safeguards for ePHI, Business Associate Agreements (BAAs), minimum necessary disclosures, and 60-day breach notifications.',
    questionCount: 15,
    durationMinutes: 25,
    passingScorePercent: 75,
    xpReward: 250,
    supportedTypes: ['multiple_choice', 'true_false', 'scenario'],
    targetAudience: 'Healthcare Tech Engineers, Privacy Officers, MedTech Leaders',
    examType: 'framework',
    isPopular: false,
  },
  {
    id: 'track-pcidss-merchant',
    title: 'PCI-DSS v4.0 Merchant & Service Provider Audit',
    frameworkId: 'pcidss',
    frameworkTitle: 'PCI-DSS v4.0',
    category: 'Financial & Payments',
    difficulty: 'Advanced',
    description: 'Cardholder Data Environment (CDE) scoping, Sensitive Authentication Data (SAD) retention bans, client-side script integrity (Req 6.4.3), and universal MFA (Req 8.4.2).',
    questionCount: 15,
    durationMinutes: 25,
    passingScorePercent: 75,
    xpReward: 300,
    supportedTypes: ['multiple_choice', 'true_false', 'scenario'],
    targetAudience: 'Fintech Engineers, Payment Architects, QSA Candidates',
    examType: 'framework',
    isPopular: false,
  },
  {
    id: 'track-gdpr-data-protection',
    title: 'GDPR & International Data Privacy Practitioner',
    frameworkId: 'gdpr',
    frameworkTitle: 'EU GDPR',
    category: 'Privacy',
    difficulty: 'Intermediate',
    description: 'Lawful bases for processing, Data Subject Access Requests (DSARs), DPIA triggers (Art 35), 72-hour supervisory authority breach notifications (Art 33), and cross-border transfers.',
    questionCount: 15,
    durationMinutes: 25,
    passingScorePercent: 75,
    xpReward: 250,
    supportedTypes: ['multiple_choice', 'true_false', 'scenario'],
    targetAudience: 'Data Protection Officers (DPOs), Legal Counsel, Privacy Engineers',
    examType: 'framework',
    isPopular: false,
  },
  {
    id: 'track-scenario-crisis-management',
    title: 'Executive Breach & Audit Crisis Simulation (Scenario Master)',
    frameworkId: 'risk_management',
    frameworkTitle: 'Incident Scenarios',
    category: 'Risk Management',
    difficulty: 'Expert',
    description: '100% scenario-based case studies tackling real-world compromised API keys, rogue insider exfiltrations, auditor non-conformities, and supply chain zero-days.',
    questionCount: 10,
    durationMinutes: 30,
    passingScorePercent: 80,
    xpReward: 400,
    supportedTypes: ['scenario'],
    targetAudience: 'CISOs, Incident Commanders, Senior Security Consultants',
    examType: 'scenario',
    isPopular: true,
  },
  {
    id: 'track-quick-sprint-practice',
    title: '10-Question Daily Knowledge Sprint',
    frameworkId: 'all',
    frameworkTitle: 'Cross-Framework',
    category: 'Cybersecurity',
    difficulty: 'Beginner',
    description: 'Rapid-fire randomized assessment pulling questions across all 9 domains. Perfect for daily practice and active streak retention.',
    questionCount: 10,
    durationMinutes: 15,
    passingScorePercent: 75,
    xpReward: 100,
    supportedTypes: ['multiple_choice', 'true_false'],
    targetAudience: 'All Learners',
    examType: 'quick',
    isPopular: true,
  },
  {
    id: 'track-comprehensive-lead-auditor',
    title: '50-Question Master Lead Auditor Board Examination',
    frameworkId: 'all',
    frameworkTitle: 'Cross-Framework',
    category: 'Security & Privacy',
    difficulty: 'Expert',
    description: 'The ultimate compliance challenge. 50 cross-domain questions blending deep technical controls, tricky scenario edge cases, and regulatory governance.',
    questionCount: 50,
    durationMinutes: 65,
    passingScorePercent: 75,
    xpReward: 500,
    supportedTypes: ['multiple_choice', 'true_false', 'scenario'],
    targetAudience: 'Senior Practitioners & Certification Candidates',
    examType: 'professional',
    isPopular: true,
  },
];

/**
 * Expanded Rich Question Bank
 * Includes Multiple Choice, True / False, and Scenario-Based questions across all requested domains.
 */
export const COMPREHENSIVE_QUESTION_BANK: QuestionItem[] = [
  // ==========================================
  // 1. CYBERSECURITY FUNDAMENTALS
  // ==========================================
  {
    id: 'q-cyber-1',
    frameworkId: 'cybersecurity_fundamentals',
    domain: 'Core Concepts',
    difficulty: 'Beginner',
    questionType: 'multiple_choice',
    question: 'Which element of the CIA Triad is directly addressed by applying cryptographic hash functions (such as SHA-256) to data files?',
    options: [
      'Integrity',
      'Confidentiality',
      'Availability',
      'Non-repudiation'
    ],
    correctIndex: 0,
    explanation: 'Cryptographic hash functions generate a deterministic fixed-length digest of data. Any alteration of the underlying data results in a completely different digest, providing mathematical proof of data Integrity.',
    sourceStandard: 'NIST SP 800-145 / ISO/IEC 27000 § 3.32'
  },
  {
    id: 'q-cyber-2',
    frameworkId: 'cybersecurity_fundamentals',
    domain: 'Architecture',
    difficulty: 'Beginner',
    questionType: 'true_false',
    question: 'True or False: In a Zero Trust Architecture (ZTA), trust is implicitly granted to devices and users once they have successfully connected to the internal corporate local area network (LAN).',
    options: [
      'True',
      'False'
    ],
    correctIndex: 1,
    explanation: 'False. The foundational tenet of Zero Trust (NIST SP 800-207) is "Never Trust, Always Verify." Locality inside an internal network perimeter never grants implicit trust; every request must be authenticated, authorized, and encrypted based on dynamic context.',
    sourceStandard: 'NIST SP 800-207 Zero Trust Architecture'
  },
  {
    id: 'q-cyber-3',
    frameworkId: 'cybersecurity_fundamentals',
    domain: 'Incident Response & Operations',
    difficulty: 'Intermediate',
    questionType: 'scenario',
    scenarioText: 'A financial services firm observes outbound beaconing traffic originating from an internal developer workstation to an unregistered foreign IP address at regular 60-second intervals. The Security Operations Center (SOC) investigates and discovers an unauthorized PowerShell process running in memory with elevated privileges.',
    question: 'What is the immediate, most appropriate containment step according to standard cybersecurity incident handling procedures?',
    options: [
      'Immediately isolate the affected workstation from the network while preserving system volatile memory (RAM) for forensic triage.',
      'Reboot the workstation and run Windows Disk Cleanup.',
      'Delete the PowerShell script executable from the hard drive immediately without documenting it.',
      'Wait until the end of the business day to inform the workstation owner.'
    ],
    correctIndex: 0,
    explanation: 'Under NIST SP 800-61 Rev 2 (Computer Security Incident Handling Guide), containment requires isolating the compromised host from the network immediately to prevent lateral movement and C2 communications, while avoiding power cycles so volatile RAM artifacts are preserved for forensics.',
    sourceStandard: 'NIST SP 800-61 Rev 2 Section 3.3'
  },
  {
    id: 'q-cyber-4',
    frameworkId: 'cybersecurity_fundamentals',
    domain: 'Cryptography',
    difficulty: 'Intermediate',
    questionType: 'multiple_choice',
    question: 'In asymmetric public-key cryptography (e.g. RSA or ECC), which key must be used to generate a valid digital signature?',
    options: [
      'The sender\'s private key',
      'The sender\'s public key',
      'The recipient\'s public key',
      'A pre-shared symmetric key'
    ],
    correctIndex: 0,
    explanation: 'A digital signature is created by encrypting the message hash using the sender\'s private key. Anyone with the sender\'s corresponding public key can verify the signature, ensuring non-repudiation and authenticity.',
    sourceStandard: 'FIPS 186-5 Digital Signature Standard'
  },
  {
    id: 'q-cyber-5',
    frameworkId: 'cybersecurity_fundamentals',
    domain: 'Network Security',
    difficulty: 'Beginner',
    questionType: 'true_false',
    question: 'True or False: Enabling TLS 1.3 on web services completely protects against SQL injection attacks in the web application database.',
    options: [
      'True',
      'False'
    ],
    correctIndex: 1,
    explanation: 'False. TLS 1.3 secures data-in-transit against eavesdropping and tampering between the browser and the server. However, it provides zero protection against application-layer vulnerabilities such as SQL injection, which occur when unvalidated user inputs are executed by database queries.',
    sourceStandard: 'OWASP Top 10 A03:2021-Injection'
  },

  // ==========================================
  // 2. COMPLIANCE FUNDAMENTALS
  // ==========================================
  {
    id: 'q-comp-1',
    frameworkId: 'compliance_fundamentals',
    domain: 'Audit & Governance',
    difficulty: 'Beginner',
    questionType: 'multiple_choice',
    question: 'What is the primary difference between an "Attestation" report (such as SOC 2) and a "Certification" (such as ISO 27001)?',
    options: [
      'An attestation provides an independent CPA practitioner\'s opinion on management\'s assertion over an observation period, whereas a certification awards a formal certificate of conformity issued by an accredited registrar.',
      'Attestations are granted by government ministries, while certifications are issued only by open-source non-profits.',
      'Certifications last forever without renewal, while attestations must be renewed every 30 days.',
      'Attestations only inspect physical buildings, while certifications inspect cloud software.'
    ],
    correctIndex: 0,
    explanation: 'SOC 2 is an attestation engagement conducted under AICPA SSAE standards resulting in an auditor\'s report expressing an opinion. ISO 27001 is a formal management system certification awarded by an accredited third-party certification body (CB) following a Stage 1 and Stage 2 audit.',
    sourceStandard: 'AICPA AT-C 205 / ISO/IEC 17021-1'
  },
  {
    id: 'q-comp-2',
    frameworkId: 'compliance_fundamentals',
    domain: 'Evidence Collection',
    difficulty: 'Intermediate',
    questionType: 'true_false',
    question: 'True or False: In a SOC 2 Type II audit, providing a copy of your written password policy document is sufficient to prove operating effectiveness of access controls over the 12-month audit period.',
    options: [
      'True',
      'False'
    ],
    correctIndex: 1,
    explanation: 'False. A written policy only demonstrates control design (Type I). To prove operating effectiveness in a Type II audit, the organization must provide operational artifacts (e.g. system configuration screenshots, sampled employee onboarding tickets, and IAM logs) demonstrating continuous enforcement across the observation period.',
    sourceStandard: 'AICPA TSP Section 100 § 2.14'
  },
  {
    id: 'q-comp-3',
    frameworkId: 'compliance_fundamentals',
    domain: 'Audit Scenarios',
    difficulty: 'Intermediate',
    questionType: 'scenario',
    scenarioText: 'During an annual external compliance audit, an auditor samples 30 employee termination tickets from the past 6 months to evaluate whether system access was revoked within the organization\'s documented 24-hour SLA. The auditor discovers that 3 contractors still possessed active corporate email and GitHub access 2 weeks after their contracts ended.',
    question: 'How will the external auditor classify this finding in the audit report?',
    options: [
      'As an audit exception / control deficiency in operating effectiveness, requiring management to provide a written response and remediation plan.',
      'The auditor will immediately shut down the company\'s production servers.',
      'The auditor will ignore it because contractors are exempt from compliance requirements.',
      'The auditor will retroactively modify the company\'s policy to 30 days.'
    ],
    correctIndex: 0,
    explanation: 'A failure of a documented control within the sampled audit population is noted as an audit exception / control deviation. In SOC 2 reports, management must document an explanatory response and remediation actions taken.',
    sourceStandard: 'AICPA SSAE 18 / AU-C 530 Audit Sampling'
  },
  {
    id: 'q-comp-4',
    frameworkId: 'compliance_fundamentals',
    domain: 'Roles & Responsibilities',
    difficulty: 'Beginner',
    questionType: 'multiple_choice',
    question: 'In the Three Lines Model of corporate governance (formerly Three Lines of Defense), which group represents the "Third Line"?',
    options: [
      'Internal Audit (providing independent, objective assurance and insight)',
      'Operational Management (implementing controls and managing daily risks)',
      'Compliance and Risk Management functions (monitoring and oversight)',
      'External news media and social network commentators'
    ],
    correctIndex: 0,
    explanation: 'The Institute of Internal Auditors (IIA) Three Lines Model designates operational management as First Line, risk and compliance oversight as Second Line, and Internal Audit as the independent Third Line.',
    sourceStandard: 'IIA Three Lines Model (2020)'
  },
  {
    id: 'q-comp-5',
    frameworkId: 'compliance_fundamentals',
    domain: 'Segregation of Duties',
    difficulty: 'Beginner',
    questionType: 'true_false',
    question: 'True or False: Segregation of Duties (SoD) allows a software engineer to write code, review and approve their own pull request, and deploy the build directly to production environments without oversight.',
    options: [
      'True',
      'False'
    ],
    correctIndex: 1,
    explanation: 'False. Segregation of Duties is designed specifically to prevent a single individual from having end-to-end control over critical processes without independent review, preventing both malicious fraud and accidental outages.',
    sourceStandard: 'SOC 2 CC8.1 / ISO 27001 A.5.3'
  },

  // ==========================================
  // 3. RISK MANAGEMENT
  // ==========================================
  {
    id: 'q-risk-1',
    frameworkId: 'risk_management',
    domain: 'Risk Methodology',
    difficulty: 'Beginner',
    questionType: 'multiple_choice',
    question: 'What is the standard formula used to quantify Inherent Risk in cybersecurity risk assessments?',
    options: [
      'Risk = Likelihood × Impact (before considering the mitigating effect of internal controls)',
      'Risk = Total Revenue ÷ Number of Employees',
      'Risk = Number of Firewalls + Antivirus licenses',
      'Risk = Time to Detect − Time to Respond'
    ],
    correctIndex: 0,
    explanation: 'Inherent Risk represents the raw level of risk present in an environment prior to implementing safeguards and internal controls. It is mathematically modeled as Likelihood multiplied by Impact.',
    sourceStandard: 'NIST SP 800-30 Rev 1 / ISO 31000'
  },
  {
    id: 'q-risk-2',
    frameworkId: 'risk_management',
    domain: 'Risk Treatment',
    difficulty: 'Beginner',
    questionType: 'true_false',
    question: 'True or False: Purchasing a comprehensive cyber insurance policy eliminates the company\'s operational risk entirely.',
    options: [
      'True',
      'False'
    ],
    correctIndex: 1,
    explanation: 'False. Cyber insurance is a form of Risk Transfer (sharing financial consequences of a loss event). It does not eliminate operational risk, reputational damage, legal liabilities, or data breach consequences.',
    sourceStandard: 'ISO 31000 Section 6.5.2'
  },
  {
    id: 'q-risk-3',
    frameworkId: 'risk_management',
    domain: 'Third-Party Risk (TPRM)',
    difficulty: 'Intermediate',
    questionType: 'scenario',
    scenarioText: 'A healthtech startup plans to integrate a third-party AI transcription vendor that will process audio recordings of doctor-patient telemedicine consultations. The vendor holds an unverified self-assessment questionnaire, lacks SOC 2 Type II or ISO 27001 certifications, and refuses to sign a Business Associate Agreement (BAA).',
    question: 'As the Risk Manager, what is the mandatory decision?',
    options: [
      'Reject the vendor integration immediately because processing protected health information without a BAA violates federal law and exceeds organizational risk tolerance.',
      'Approve the integration because AI speeds up physician workflows.',
      'Accept the risk verbally without documenting it in the risk register.',
      'Allow the vendor to operate for 12 months as a pilot trial before asking for security documentation.'
    ],
    correctIndex: 0,
    explanation: 'HIPAA rules strictly prohibit covered entities from disclosing ePHI to business associates without an executed BAA. Doing so incurs catastrophic regulatory penalties under 45 CFR § 164.502 and exceeds enterprise risk appetite.',
    sourceStandard: 'HIPAA 45 CFR § 164.502(e) / NIST SP 800-161'
  },
  {
    id: 'q-risk-4',
    frameworkId: 'risk_management',
    domain: 'Risk Metrics',
    difficulty: 'Intermediate',
    questionType: 'multiple_choice',
    question: 'What is the term for the remaining level of risk after all planned security safeguards, controls, and treatments have been implemented?',
    options: [
      'Residual Risk',
      'Inherent Risk',
      'Unmitigated Hazard',
      'Systemic Volatility'
    ],
    correctIndex: 0,
    explanation: 'Residual Risk is the exposure that remains after countermeasures and security controls have been designed and implemented. Management must formally accept this residual risk if it falls within the organization\'s risk appetite.',
    sourceStandard: 'ISO/IEC 27005 / NIST SP 800-30'
  },
  {
    id: 'q-risk-5',
    frameworkId: 'risk_management',
    domain: 'Threat Modeling',
    difficulty: 'Advanced',
    questionType: 'multiple_choice',
    question: 'In the STRIDE threat modeling framework, which threat category corresponds to an attacker modifying customer account records stored in a database?',
    options: [
      'Tampering',
      'Spoofing',
      'Repudiation',
      'Information Disclosure'
    ],
    correctIndex: 0,
    explanation: 'STRIDE stands for Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, and Elevation of Privilege. Modifying unauthorized data violates integrity and represents Tampering.',
    sourceStandard: 'Microsoft STRIDE Threat Model'
  },

  // ==========================================
  // 4. ISO 27001:2022
  // ==========================================
  {
    id: 'q-iso-new-1',
    frameworkId: 'iso27001',
    domain: 'ISMS Governance',
    difficulty: 'Beginner',
    questionType: 'multiple_choice',
    question: 'In ISO/IEC 27001:2022, which clause requires top management to establish, implement, and maintain an information security policy aligned with strategic business objectives?',
    options: [
      'Clause 5.2 (Information Security Policy)',
      'Clause 4.1 (Understanding the organization)',
      'Clause 8.1 (Operational planning)',
      'Clause 10.2 (Nonconformity and corrective action)'
    ],
    correctIndex: 0,
    explanation: 'Clause 5.2 establishes top management\'s leadership commitment by requiring an approved Information Security Policy that provides a framework for setting information security objectives.',
    sourceStandard: 'ISO/IEC 27001:2022 Clause 5.2'
  },
  {
    id: 'q-iso-new-2',
    frameworkId: 'iso27001',
    domain: 'Annex A Controls',
    difficulty: 'Intermediate',
    questionType: 'true_false',
    question: 'True or False: An organization undergoing an ISO 27001 certification audit can exclude an Annex A control from its Statement of Applicability (SoA) if that control is not relevant to its risk assessment, provided justifiable rationale is documented.',
    options: [
      'True',
      'False'
    ],
    correctIndex: 0,
    explanation: 'True. Unlike Clauses 4-10 (which are mandatory and cannot be excluded), Annex A controls can be excluded if they are not applicable to the organization\'s risk treatment plan and context, provided a documented justification is included in the SoA (Clause 6.1.3d).',
    sourceStandard: 'ISO/IEC 27001:2022 Clause 6.1.3(d)'
  },
  {
    id: 'q-iso-new-3',
    frameworkId: 'iso27001',
    domain: 'Lead Auditor Scenario',
    difficulty: 'Advanced',
    questionType: 'scenario',
    scenarioText: 'During a Stage 2 ISO 27001:2022 certification audit, the lead auditor reviews the organization\'s internal audit records (Clause 9.2). The records show that the internal audit was conducted exclusively by the Chief Technology Officer, who audited and approved their own software development and server deployment controls without independent peer review.',
    question: 'What finding must the lead auditor issue against ISO 27001 Clause 9.2?',
    options: [
      'A Major Nonconformity (NC), because Clause 9.2(c) explicitly requires the organization to select auditors and conduct audits that ensure the objectivity and impartiality of the audit process.',
      'A Minor commendation because the CTO understands the systems best.',
      'No finding, because executive officers are immune from audit independence rules.',
      'An immediate revocation of the company\'s business license.'
    ],
    correctIndex: 0,
    explanation: 'Clause 9.2 requires that auditors not audit their own work. The CTO auditing their own operational controls is a direct breach of audit impartiality and objectivity, warranting a nonconformity.',
    sourceStandard: 'ISO/IEC 27001:2022 Clause 9.2(c)'
  },
  {
    id: 'q-iso-new-4',
    frameworkId: 'iso27001',
    domain: 'Technological Controls',
    difficulty: 'Intermediate',
    questionType: 'multiple_choice',
    question: 'Control A.8.28 in the 2022 edition of ISO 27001 introduces which specific requirement for software development teams?',
    options: [
      'Secure coding principles must be established and applied to software development.',
      'All code must be printed out on paper weekly for physical vault storage.',
      'Software developers are forbidden from using Git version control.',
      'All web pages must use HTTP without encryption.'
    ],
    correctIndex: 0,
    explanation: 'Control A.8.28 (Secure Coding) is one of the 11 new controls introduced in ISO 27001:2022, requiring organizations to enforce secure coding standards throughout the engineering lifecycle.',
    sourceStandard: 'ISO/IEC 27001:2022 A.8.28'
  },

  // ==========================================
  // 5. NIST CSF 2.0
  // ==========================================
  {
    id: 'q-nist-new-1',
    frameworkId: 'nistcsf',
    domain: 'Govern Function',
    difficulty: 'Beginner',
    questionType: 'multiple_choice',
    question: 'Which new Core Function was added to the NIST Cybersecurity Framework in version 2.0 (2024)?',
    options: [
      'GOVERN (GV)',
      'ENFORCE (EN)',
      'ANALYZE (AN)',
      'ATTACK (AT)'
    ],
    correctIndex: 0,
    explanation: 'NIST CSF 2.0 introduced the GOVERN (GV) function as the foundational sixth pillar, elevating cybersecurity governance, policy, risk strategy, and supply chain oversight.',
    sourceStandard: 'NIST CSF 2.0 (Feb 2024)'
  },
  {
    id: 'q-nist-new-2',
    frameworkId: 'nistcsf',
    domain: 'CSF Implementation Tiers',
    difficulty: 'Intermediate',
    questionType: 'true_false',
    question: 'True or False: NIST CSF Implementation Tiers (Tier 1: Partial to Tier 4: Adaptive) represent formal compliance certification levels that organizations must achieve.',
    options: [
      'True',
      'False'
    ],
    correctIndex: 1,
    explanation: 'False. NIST CSF Implementation Tiers do not represent maturity or certification levels. Rather, they describe the degree to which an organization\'s cybersecurity risk management practices exhibit key characteristics (e.g. informal vs. adaptive and integrated).',
    sourceStandard: 'NIST CSF 2.0 Section 2.3'
  },
  {
    id: 'q-nist-new-3',
    frameworkId: 'nistcsf',
    domain: 'Incident Response Scenario',
    difficulty: 'Advanced',
    questionType: 'scenario',
    scenarioText: 'A retail enterprise detects ransomware encrypting backup repository volumes on Saturday morning. The incident response playbook mandates immediate execution of the RESPOND (RS) and RECOVER (RC) functions.',
    question: 'Under NIST CSF 2.0 subcategory RC.RP-01 (Recovery Planning), what is the primary initial objective during restoration?',
    options: [
      'Execute recovery procedures from validated, immutable offline/air-gapped backups in prioritized order according to business continuity objectives.',
      'Pay the extortion ransom immediately using company credit cards.',
      'Format all servers simultaneously without preserving forensic snapshot logs.',
      'Issue an unvetted tweet denying that any incident occurred.'
    ],
    correctIndex: 0,
    explanation: 'RC.RP-01 requires recovery procedures to be executed in accordance with established recovery priorities, using verified immutable backups that have been scanned to confirm they are uncorrupted.',
    sourceStandard: 'NIST CSF 2.0 RC.RP-01'
  },

  // ==========================================
  // 6. SOC 2 TYPE II
  // ==========================================
  {
    id: 'q-soc2-new-1',
    frameworkId: 'soc2',
    domain: 'Trust Services Criteria',
    difficulty: 'Beginner',
    questionType: 'true_false',
    question: 'True or False: The Availability, Confidentiality, Processing Integrity, and Privacy Trust Services Criteria are all mandatory for every SOC 2 report.',
    options: [
      'True',
      'False'
    ],
    correctIndex: 1,
    explanation: 'False. Only the Common Criteria (Security / CC-series) is mandatory for every SOC 2 audit. The other four criteria (Availability, Confidentiality, Processing Integrity, and Privacy) are optional and scoped in based on contractual commitments and service design.',
    sourceStandard: 'AICPA TSP Section 100 § 1.12'
  },
  {
    id: 'q-soc2-new-2',
    frameworkId: 'soc2',
    domain: 'Continuous Monitoring Scenario',
    difficulty: 'Advanced',
    questionType: 'scenario',
    scenarioText: 'A B2B SaaS company is 9 months into its 12-month SOC 2 Type II audit period. A security engineer accidentally pushes an AWS IAM secret access key to a public GitHub repository. Automated secret scanning detects the key 4 minutes later. The team rotates the key within 15 minutes, inspects AWS CloudTrail logs for unauthorized actions (confirming zero calls were made), and logs an internal incident post-mortem.',
    question: 'How should management handle this event when preparing for the external SOC 2 audit submission?',
    options: [
      'Disclose the incident transparently to the SOC 2 auditor along with the CloudTrail logs, remediation timeline, and automated secret scanner evidence demonstrating rapid incident containment (CC7.3 / CC7.4).',
      'Conceal the event and delete the CloudTrail logs so the auditor never finds out.',
      'Terminate the engineer immediately and abandon the SOC 2 audit.',
      'Notify the local police department before rotating the key.'
    ],
    correctIndex: 0,
    explanation: 'Auditors evaluate how well an organization detects and responds to real-world incidents (CC7.3 / CC7.4). A transparently documented incident with rapid automated detection, credential rotation, and zero data compromise proves strong operating effectiveness.',
    sourceStandard: 'AICPA SOC 2 CC7.3 / CC7.4'
  },
  {
    id: 'q-soc2-new-3',
    frameworkId: 'soc2',
    domain: 'Access Control',
    difficulty: 'Intermediate',
    questionType: 'multiple_choice',
    question: 'To satisfy SOC 2 CC6.3 (Access Modification and Revocation), which operational cadence is required for conducting formal user access reviews (UAR) of production environments?',
    options: [
      'At planned periodic intervals (typically quarterly or at minimum semi-annually), reviewed and signed off by resource owners.',
      'Once every 5 years during office lease renewals.',
      'Only when requested by external customers during sales calls.',
      'Never, if the organization uses single sign-on (SSO).'
    ],
    correctIndex: 0,
    explanation: 'CC6.3 requires regular, periodic reviews of user accounts and permissions by designated supervisors or system owners to verify least-privilege access and remove orphaned privileges.',
    sourceStandard: 'SOC 2 CC6.3'
  },

  // ==========================================
  // 7. HIPAA
  // ==========================================
  {
    id: 'q-hipaa-new-1',
    frameworkId: 'hipaa',
    domain: 'Security Rule',
    difficulty: 'Beginner',
    questionType: 'true_false',
    question: 'True or False: Under HIPAA specifications, an "Addressable" implementation specification means the covered entity can simply choose to ignore the control without documentation.',
    options: [
      'True',
      'False'
    ],
    correctIndex: 1,
    explanation: 'False. Under 45 CFR § 164.306(d), "Addressable" does not mean optional. The entity must either implement the specified specification, implement an equivalent alternative measure, or document why the control is not reasonable and appropriate in its specific environment.',
    sourceStandard: '45 CFR § 164.306(d)(3)'
  },
  {
    id: 'q-hipaa-new-2',
    frameworkId: 'hipaa',
    domain: 'Breach Notification Scenario',
    difficulty: 'Advanced',
    questionType: 'scenario',
    scenarioText: 'A healthcare analytics provider operating as a Business Associate discovers that an unencrypted backup tape containing names, social security numbers, and diagnosis histories of 4,200 patients was stolen from an employee\'s vehicle.',
    question: 'What are the legal notification mandates under the HIPAA Breach Notification Rule?',
    options: [
      'Notify the Covered Entity without unreasonable delay and in no case later than 60 calendar days from discovery; affected individuals must be notified in writing, and the HHS Secretary must be notified via the web portal.',
      'No notification is needed if the employee files a police report.',
      'Wait 180 days to see if any identity theft occurs first.',
      'Only notify patients who have paid their medical bills in full.'
    ],
    correctIndex: 0,
    explanation: 'Under 45 CFR § 164.410, a Business Associate must notify the Covered Entity without unreasonable delay (and within 60 days). For breaches of 500+ individuals, notice must also be given to HHS and prominent media if within a single state.',
    sourceStandard: '45 CFR §§ 164.404, 164.406, 164.408'
  },

  // ==========================================
  // 8. PCI-DSS v4.0
  // ==========================================
  {
    id: 'q-pci-new-1',
    frameworkId: 'pcidss',
    domain: 'Cardholder Data Scope',
    difficulty: 'Intermediate',
    questionType: 'multiple_choice',
    question: 'Under PCI-DSS v4.0 Requirement 3.2, which of the following is strictly prohibited from being retained after card authorization, even if encrypted?',
    options: [
      'Card Verification Value / Code (CVV2 / CVC2 / CID)',
      'Primary Account Number (PAN)',
      'Cardholder Name',
      'Card Expiration Date'
    ],
    correctIndex: 0,
    explanation: 'Sensitive Authentication Data (SAD)—including card validation codes (CVV2/CVC2), full track data from the magnetic stripe or chip, and PINs—cannot be stored post-authorization under any circumstances.',
    sourceStandard: 'PCI-DSS v4.0 Requirement 3.2'
  },
  {
    id: 'q-pci-new-2',
    frameworkId: 'pcidss',
    domain: 'Application Security Scenario',
    difficulty: 'Advanced',
    questionType: 'scenario',
    scenarioText: 'An e-commerce merchant embeds a third-party analytics tag and chat widget directly on the payment checkout page where consumers enter their credit card numbers. During an audit against PCI-DSS v4.0, the Qualified Security Assessor (QSA) examines Requirement 6.4.3.',
    question: 'What mandatory technical controls must the merchant prove are in place for all scripts running on payment pages?',
    options: [
      'A documented inventory of all scripts, written business authorization for each script, and an automated method to confirm script integrity (e.g. Subresource Integrity hashes or Content Security Policy headers).',
      'The merchant must hire 24/7 security guards to watch the web servers.',
      'No third-party scripts are permitted on the entire internet.',
      'Scripts are automatically compliant if written in TypeScript.'
    ],
    correctIndex: 0,
    explanation: 'PCI-DSS v4.0 Req 6.4.3 was introduced specifically to combat Magecart/e-skimming attacks, requiring merchants to inventory, authorize, and ensure the integrity of all scripts loaded in payment page contexts.',
    sourceStandard: 'PCI-DSS v4.0 Requirement 6.4.3'
  },

  // ==========================================
  // 9. GDPR & DATA PRIVACY
  // ==========================================
  {
    id: 'q-gdpr-new-1',
    frameworkId: 'gdpr',
    domain: 'Data Subject Rights',
    difficulty: 'Beginner',
    questionType: 'true_false',
    question: 'True or False: Under GDPR Article 17 ("Right to Erasure" / Right to be Forgotten), an organization must immediately delete customer financial accounting records even if tax legislation mandates a 7-year retention period.',
    options: [
      'True',
      'False'
    ],
    correctIndex: 1,
    explanation: 'False. Article 17(3)(b) explicitly provides an exemption to the right to erasure where processing is necessary for compliance with a legal obligation under EU or Member State law (such as statutory financial retention laws).',
    sourceStandard: 'GDPR Article 17(3)(b)'
  },
  {
    id: 'q-gdpr-new-2',
    frameworkId: 'gdpr',
    domain: 'Regulatory Breach Scenario',
    difficulty: 'Advanced',
    questionType: 'scenario',
    scenarioText: 'An enterprise SaaS provider based in Germany suffers an unauthorized database export affecting personal records of 15,000 EU citizens, including email addresses, hashed passwords, and home addresses. The incident is confirmed on Tuesday at 09:00 CET.',
    question: 'What is the Data Controller\'s statutory notification obligation under GDPR Article 33?',
    options: [
      'Notify the competent Supervisory Authority (DPA) without undue delay and, where feasible, not later than 72 hours after becoming aware of the breach.',
      'Notify the authority within 30 business days.',
      'Keep the breach private unless individual users suffer direct financial theft.',
      'Only notify the local police department.'
    ],
    correctIndex: 0,
    explanation: 'Article 33(1) mandates notifying the competent supervisory authority without undue delay and, where feasible, within 72 hours of becoming aware of a personal data breach likely to result in risk to the rights and freedoms of individuals.',
    sourceStandard: 'GDPR Article 33(1)'
  }
];

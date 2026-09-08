import { LearningPath } from '../types';

export const ENTERPRISE_LEARNING_PATHS: LearningPath[] = [
  // ==========================================
  // LEVEL 1 — BEGINNER
  // ==========================================
  {
    id: 'cybersecurity-fundamentals',
    title: 'Cybersecurity Fundamentals',
    roleTarget: 'Junior Security Analyst / IT Associate / Software Engineer',
    description: 'Learn the essential concepts of cybersecurity, threats, vulnerabilities, and security principles.',
    level: 'Beginner',
    difficulty: 'Beginner',
    estimatedTime: '4 Hours',
    estimatedHours: 4,
    modulesCount: 6,
    progressPercentage: 40,
    estimatedWeeks: 2,
    modulesIncluded: [{ frameworkId: 'iso27001', moduleId: 'iso-mod-1' }],
    milestones: [
      'Master the CIA Triad (Confidentiality, Integrity, Availability)',
      'Identify common attack vectors: Phishing, Ransomware, Man-in-the-Middle',
      'Understand Defense-in-Depth and Least Privilege access principles',
      'Pass the Cyber Foundations Knowledge Assessment'
    ],
    overview: {
      whatYouWillLearn: [
        'Core security principles: CIA Triad, Defense in Depth, and Zero Trust basics',
        'Modern threat landscape: Social engineering, malware variants, and zero-day exploits',
        'Authentication protocols: Multi-Factor Authentication (MFA), Passkeys, and SSO',
        'Basic endpoint, network, and cloud perimeter defense architecture'
      ],
      whyItMatters: 'Over 85% of cybersecurity breaches involve human error or misconfigured basic controls. Mastering fundamentals is the prerequisite for any security or GRC specialization.',
      learningObjectives: [
        'Define the core security attributes required to safeguard enterprise data',
        'Differentiate between threats, vulnerabilities, and business risks',
        'Implement personal and organizational cyber hygiene safeguards'
      ],
      estimatedCompletionTime: '4 Hours (Self-paced)',
      difficulty: 'Beginner'
    },
    curriculumModules: [
      {
        id: 'cyber-mod-1',
        title: 'Module 1 — Introduction to Cyber Threats & Vulnerabilities',
        subtitle: 'The Threat Landscape',
        description: 'Explore the modern adversary mindset, common threat actors, and vulnerability lifecycle.',
        order: 1,
        durationMinutes: 35,
        lessonsCount: 3,
        status: 'completed',
        frameworkId: 'iso27001',
        targetLessonId: 'iso-l1'
      },
      {
        id: 'cyber-mod-2',
        title: 'Module 2 — Core Concepts & The CIA Triad',
        subtitle: 'Foundational Tenets',
        description: 'Deep dive into Confidentiality, Integrity, and Availability with practical engineering trade-offs.',
        order: 2,
        durationMinutes: 40,
        lessonsCount: 3,
        status: 'completed',
        frameworkId: 'iso27001',
        targetLessonId: 'iso-l2'
      },
      {
        id: 'cyber-mod-3',
        title: 'Module 3 — Practical Implementation: Identity & Access Control',
        subtitle: 'Authentication & MFA',
        description: 'Configuring least privilege, role-based access control (RBAC), and multi-factor authentication.',
        order: 3,
        durationMinutes: 45,
        lessonsCount: 4,
        status: 'current',
        frameworkId: 'soc2',
        targetLessonId: 'soc2-l1'
      },
      {
        id: 'cyber-mod-4',
        title: 'Module 4 — Real-World Examples: Case Studies in Defense in Depth',
        subtitle: 'Anatomy of Modern Attacks',
        description: 'Walkthroughs of how layered security models prevented catastrophic ransomware deployment.',
        order: 4,
        durationMinutes: 40,
        lessonsCount: 2,
        status: 'available',
        frameworkId: 'soc2',
        targetLessonId: 'soc2-l2'
      },
      {
        id: 'cyber-mod-5',
        title: 'Module 5 — Network & Endpoint Protection Basics',
        subtitle: 'Perimeter to Host',
        description: 'Understanding firewalls, EDR/XDR agent telemetry, and network segmentation concepts.',
        order: 5,
        durationMinutes: 40,
        lessonsCount: 3,
        status: 'available',
        frameworkId: 'nistcsf',
        targetLessonId: 'nist-l1'
      },
      {
        id: 'cyber-mod-6',
        title: 'Module 6 — Knowledge Assessment & Certification Readiness',
        subtitle: 'Foundational Verification',
        description: 'Interactive exam testing scenario diagnosis, threat identification, and control matching.',
        order: 6,
        durationMinutes: 30,
        lessonsCount: 1,
        status: 'available',
        frameworkId: 'iso27001'
      }
    ]
  },

  {
    id: 'compliance-fundamentals',
    title: 'Compliance Fundamentals',
    roleTarget: 'GRC Specialist / Compliance Coordinator / Operations Manager',
    description: 'Understand regulatory compliance, statutory mandates, auditor expectations, and the compliance lifecycle.',
    level: 'Beginner',
    difficulty: 'Beginner',
    estimatedTime: '5 Hours',
    estimatedHours: 5,
    modulesCount: 5,
    progressPercentage: 20,
    estimatedWeeks: 2,
    modulesIncluded: [{ frameworkId: 'soc2', moduleId: 'soc2-mod-1' }],
    milestones: [
      'Understand the difference between laws, regulations, and industry standards',
      'Learn the stages of an enterprise audit lifecycle (Scoping, Testing, Reporting)',
      'Formulate defensible evidence requests and documentation trails',
      'Pass the Compliance Lifecycle Check'
    ],
    overview: {
      whatYouWillLearn: [
        'The role of compliance in enterprise risk and market trust',
        'Regulatory vs voluntary standards: statutory mandates vs customer certifications',
        'Evidence collection workflows and Prepared By Client (PBC) audit lists',
        'Compliance governance roles: CISO, Compliance Officer, Internal Audit, External Assessor'
      ],
      whyItMatters: 'Non-compliance risks multi-million dollar regulatory fines, lost sales contracts, and reputational destruction. Structured compliance frameworks allow businesses to scale with confidence.',
      learningObjectives: [
        'Distinguish between mandatory statutory obligations and commercial frameworks',
        'Interpret auditor requests and organize reproducible digital evidence',
        'Participate effectively in internal and external readiness walkthroughs'
      ],
      estimatedCompletionTime: '5 Hours (Self-paced)',
      difficulty: 'Beginner'
    },
    curriculumModules: [
      {
        id: 'comp-mod-1',
        title: 'Module 1 — Introduction to Enterprise Compliance',
        subtitle: 'Why Compliance Exists',
        description: 'The evolution of regulatory scrutiny and how compliance protects public and customer interests.',
        order: 1,
        durationMinutes: 45,
        lessonsCount: 3,
        status: 'completed',
        frameworkId: 'soc2',
        targetLessonId: 'soc2-l1'
      },
      {
        id: 'comp-mod-2',
        title: 'Module 2 — Core Concepts: Regulations vs Voluntary Frameworks',
        subtitle: 'Legal vs Contractual',
        description: 'Mapping statutory mandates (HIPAA, GDPR) against customer-driven attestations (SOC 2, ISO 27001).',
        order: 2,
        durationMinutes: 50,
        lessonsCount: 3,
        status: 'current',
        frameworkId: 'gdpr',
        targetLessonId: 'gdpr-l1'
      },
      {
        id: 'comp-mod-3',
        title: 'Module 3 — Practical Implementation: The Audit Lifecycle',
        subtitle: 'From Scoping to Report',
        description: 'How to manage PBC lists, conduct evidence sampling, and coordinate auditor interviews.',
        order: 3,
        durationMinutes: 60,
        lessonsCount: 3,
        status: 'available',
        frameworkId: 'soc2',
        targetLessonId: 'soc2-l2'
      },
      {
        id: 'comp-mod-4',
        title: 'Module 4 — Real-World Examples: Evidence Gathering Failures',
        subtitle: 'Avoiding Audit Findings',
        description: 'Real case studies where missing change tickets and delayed offboarding caused qualified audit reports.',
        order: 4,
        durationMinutes: 45,
        lessonsCount: 2,
        status: 'available',
        frameworkId: 'iso27001',
        targetLessonId: 'iso-l1'
      },
      {
        id: 'comp-mod-5',
        title: 'Module 5 — Knowledge Assessment & Compliance Mock Audit',
        subtitle: 'Auditor Interview Scenario',
        description: 'Interactive checkpoint simulating an auditor walkthrough request.',
        order: 5,
        durationMinutes: 35,
        lessonsCount: 1,
        status: 'available',
        frameworkId: 'soc2'
      }
    ]
  },

  {
    id: 'risk-management-basics',
    title: 'Risk Management Basics',
    roleTarget: 'Risk Analyst / Security Associate / Project Lead',
    description: 'Grasp core risk assessment concepts: threat vectors, vulnerability scoring, qualitative vs quantitative risk, and risk registers.',
    level: 'Beginner',
    difficulty: 'Beginner',
    estimatedTime: '4 Hours',
    estimatedHours: 4,
    modulesCount: 4,
    progressPercentage: 0,
    estimatedWeeks: 2,
    modulesIncluded: [{ frameworkId: 'iso27001', moduleId: 'iso-mod-1' }],
    milestones: [
      'Define Risk = Likelihood × Impact mathematically and conceptually',
      'Distinguish between Risk Avoidance, Mitigation, Transfer, and Acceptance',
      'Construct a functional Enterprise Risk Register',
      'Complete Risk Assessment Matrix Exercise'
    ],
    overview: {
      whatYouWillLearn: [
        'Risk taxonomy: Assets, Threats, Vulnerabilities, Likelihood, and Impact',
        'Qualitative vs Quantitative risk calculation methodologies (5x5 Heatmaps vs Monte Carlo)',
        'The 4 core risk treatment strategies: Avoid, Mitigate, Transfer, Accept',
        'Maintaining dynamic Risk Registers that align with ISO 27001 Clause 6 and NIST CSF'
      ],
      whyItMatters: 'No organization can eliminate all risks. Risk management provides the rational framework for deciding where to spend limited security budgets to achieve maximum protection.',
      learningObjectives: [
        'Conduct basic threat identification on business assets and systems',
        'Calculate residual risk after security control implementation',
        'Document and prioritize risks in an enterprise risk register'
      ],
      estimatedCompletionTime: '4 Hours (Self-paced)',
      difficulty: 'Beginner'
    },
    curriculumModules: [
      {
        id: 'risk-mod-1',
        title: 'Module 1 — Introduction to Risk & Threat Vectors',
        subtitle: 'Defining What Matters',
        description: 'Identifying critical crown-jewel assets and mapping potential threat vectors.',
        order: 1,
        durationMinutes: 45,
        lessonsCount: 2,
        status: 'current',
        frameworkId: 'iso27001',
        targetLessonId: 'iso-l1'
      },
      {
        id: 'risk-mod-2',
        title: 'Module 2 — Core Concepts: Likelihood, Impact & Heatmaps',
        subtitle: 'Risk Scoring Math',
        description: 'How to build defensible qualitative risk matrices without subjective bias.',
        order: 2,
        durationMinutes: 50,
        lessonsCount: 3,
        status: 'available',
        frameworkId: 'nistcsf',
        targetLessonId: 'nist-l1'
      },
      {
        id: 'risk-mod-3',
        title: 'Module 3 — Practical Implementation: Risk Treatment Strategies',
        subtitle: 'Avoid, Mitigate, Transfer, Accept',
        description: 'Applying cyber insurance, security controls, or executive risk acceptance waivers.',
        order: 3,
        durationMinutes: 55,
        lessonsCount: 3,
        status: 'available',
        frameworkId: 'iso27001',
        targetLessonId: 'iso-l2'
      },
      {
        id: 'risk-mod-4',
        title: 'Module 4 — Real-World Examples & Risk Register Workshop',
        subtitle: 'Building a Defensible Register',
        description: 'Hands-on creation of an executive risk register with mitigation roadmaps.',
        order: 4,
        durationMinutes: 45,
        lessonsCount: 2,
        status: 'available',
        frameworkId: 'iso27001'
      }
    ]
  },

  {
    id: 'security-controls-fundamentals',
    title: 'Security Controls Fundamentals',
    roleTarget: 'Systems Administrator / Cloud Engineer / Security Auditor',
    description: 'Master administrative, technical, and physical safeguards and how security controls prevent, detect, and correct security incidents.',
    level: 'Beginner',
    difficulty: 'Beginner',
    estimatedTime: '6 Hours',
    estimatedHours: 6,
    modulesCount: 6,
    progressPercentage: 0,
    estimatedWeeks: 3,
    modulesIncluded: [{ frameworkId: 'cis-controls', moduleId: 'cis-mod-1' }],
    milestones: [
      'Categorize controls by function: Preventive, Detective, Corrective',
      'Categorize controls by type: Administrative, Technical, Physical',
      'Implement baseline cloud IAM and boundary firewall rules',
      'Pass the Security Controls Classification Assessment'
    ],
    overview: {
      whatYouWillLearn: [
        'Taxonomy of security safeguards: Administrative policies, Technical mechanisms, Physical barriers',
        'Functional control types: Preventive, Detective, Corrective, Compensating',
        'Mapping technical controls directly to Annex A, SOC 2 Common Criteria, and CIS v8',
        'Continuous control monitoring and telemetry verification'
      ],
      whyItMatters: 'Security controls are the operational machinery of GRC. Policies are meaningless unless translated into enforceable technical guardrails and audit mechanisms.',
      learningObjectives: [
        'Select appropriate control types to mitigate specific threat scenarios',
        'Design compensating controls when primary controls cannot be deployed',
        'Establish automated testing of control effectiveness'
      ],
      estimatedCompletionTime: '6 Hours (Self-paced)',
      difficulty: 'Beginner'
    },
    curriculumModules: [
      {
        id: 'ctrl-mod-1',
        title: 'Module 1 — Introduction to Security Controls',
        subtitle: 'Safeguard Architecture',
        description: 'The role of controls in risk reduction and regulatory compliance.',
        order: 1,
        durationMinutes: 50,
        lessonsCount: 3,
        status: 'current',
        frameworkId: 'soc2',
        targetLessonId: 'soc2-l1'
      },
      {
        id: 'ctrl-mod-2',
        title: 'Module 2 — Core Concepts: Administrative vs Technical vs Physical',
        subtitle: 'The Three Safeguard Pillars',
        description: 'Balancing policies, automated technical guardrails, and data center physical controls.',
        order: 2,
        durationMinutes: 55,
        lessonsCount: 3,
        status: 'available',
        frameworkId: 'iso27001',
        targetLessonId: 'iso-l1'
      },
      {
        id: 'ctrl-mod-3',
        title: 'Module 3 — Practical Implementation: Preventive vs Detective Controls',
        subtitle: 'Stopping vs Catching',
        description: 'Deploying MFA and firewalls (preventive) alongside SIEM logging and FIM (detective).',
        order: 3,
        durationMinutes: 60,
        lessonsCount: 3,
        status: 'available',
        frameworkId: 'soc2',
        targetLessonId: 'soc2-l2'
      },
      {
        id: 'ctrl-mod-4',
        title: 'Module 4 — Real-World Examples: Compensating Controls',
        subtitle: 'When Standard Rules Fail',
        description: 'Designing audit-defensible compensating controls for legacy systems that cannot support MFA.',
        order: 4,
        durationMinutes: 50,
        lessonsCount: 2,
        status: 'available',
        frameworkId: 'pcidss',
        targetLessonId: 'pci-l1'
      },
      {
        id: 'ctrl-mod-5',
        title: 'Module 5 — Control Testing & Evidence Automation',
        subtitle: 'Proving Effectiveness',
        description: 'How modern GRC platforms automate API-driven control testing in AWS and GCP.',
        order: 5,
        durationMinutes: 55,
        lessonsCount: 2,
        status: 'available',
        frameworkId: 'soc2'
      },
      {
        id: 'ctrl-mod-6',
        title: 'Module 6 — Security Controls Knowledge Assessment',
        subtitle: 'Comprehensive Control Mapping',
        description: 'Scenario-based examination evaluating control selection and troubleshooting.',
        order: 6,
        durationMinutes: 40,
        lessonsCount: 1,
        status: 'available',
        frameworkId: 'iso27001'
      }
    ]
  },

  // ==========================================
  // LEVEL 2 — INTERMEDIATE
  // ==========================================
  {
    id: 'iso-27001-path',
    title: 'ISO 27001',
    roleTarget: 'ISMS Manager / Lead Implementer / Internal Auditor',
    description: 'Comprehensive mastery of Information Security Management Systems (ISMS), Clauses 4-10, and Annex A controls.',
    level: 'Intermediate',
    difficulty: 'Intermediate',
    estimatedTime: '8 Hours',
    estimatedHours: 8,
    modulesCount: 6,
    progressPercentage: 65,
    estimatedWeeks: 3,
    modulesIncluded: [{ frameworkId: 'iso27001', moduleId: 'iso-mod-1' }],
    milestones: [
      'Draft ISMS Scope Statement and Context of the Organization (Clause 4)',
      'Conduct Asset-Based Risk Assessment & Document Risk Treatment Plan (Clause 6)',
      'Construct a complete Statement of Applicability (SoA) for 93 Annex A controls',
      'Execute an Internal Audit Simulation and Management Review (Clause 9)'
    ],
    overview: {
      whatYouWillLearn: [
        'Mandatory ISMS requirements: Clauses 4 through 10 of ISO/IEC 27001:2022',
        'The 93 Annex A controls across Organizational, People, Physical, and Technological themes',
        'How to write a defensible Statement of Applicability (SoA) with exclusion justifications',
        'Preparing leadership, engineering, and HR teams for Stage 1 and Stage 2 certification audits'
      ],
      whyItMatters: 'ISO 27001 is the premier global gold standard for enterprise security credibility. Achieving certification is required to win international enterprise tenders and governmental contracts.',
      learningObjectives: [
        'Establish and govern an operational Information Security Management System',
        'Lead ISO 27001 internal audit walkthroughs and resolve nonconformities',
        'Successfully engage accredited external certification bodies'
      ],
      estimatedCompletionTime: '8 Hours (Self-paced)',
      difficulty: 'Intermediate'
    },
    curriculumModules: [
      {
        id: 'iso-path-mod-1',
        title: 'Module 1 — Introduction to ISO 27001 & ISMS Scope',
        subtitle: 'Clauses 4, 5 & 6',
        description: 'Context of the organization, leadership accountability, and security objectives.',
        order: 1,
        durationMinutes: 60,
        lessonsCount: 3,
        status: 'completed',
        frameworkId: 'iso27001',
        targetLessonId: 'iso-l1'
      },
      {
        id: 'iso-path-mod-2',
        title: 'Module 2 — Core Concepts: Annex A 2022 Control Themes',
        subtitle: 'The 93 Safeguards',
        description: 'Deep dive into Organizational (A.5), People (A.6), Physical (A.7), and Technological (A.8).',
        order: 2,
        durationMinutes: 75,
        lessonsCount: 4,
        status: 'completed',
        frameworkId: 'iso27001',
        targetLessonId: 'iso-l2'
      },
      {
        id: 'iso-path-mod-3',
        title: 'Module 3 — Practical Implementation: Statement of Applicability (SoA)',
        subtitle: 'Documenting Applicability',
        description: 'Step-by-step drafting of the SoA with defensible control inclusions and exclusion logic.',
        order: 3,
        durationMinutes: 70,
        lessonsCount: 3,
        status: 'current',
        frameworkId: 'iso27001',
        targetLessonId: 'iso-l1'
      },
      {
        id: 'iso-path-mod-4',
        title: 'Module 4 — Real-World Examples: Stage 1 & Stage 2 Audit Scenarios',
        subtitle: 'Certification Walkthrough',
        description: 'Handling auditor nonconformities (Major vs Minor) and crafting corrective action plans.',
        order: 4,
        durationMinutes: 65,
        lessonsCount: 2,
        status: 'available',
        frameworkId: 'iso27001'
      },
      {
        id: 'iso-path-mod-5',
        title: 'Module 5 — Internal Auditing & Management Review',
        subtitle: 'Clauses 9 & 10',
        description: 'Establishing ongoing performance metrics, internal audit programs, and continual improvement.',
        order: 5,
        durationMinutes: 60,
        lessonsCount: 2,
        status: 'available',
        frameworkId: 'iso27001'
      },
      {
        id: 'iso-path-mod-6',
        title: 'Module 6 — ISO 27001 Lead Implementer Knowledge Assessment',
        subtitle: 'Final Examination',
        description: 'Comprehensive scenario audit testing readiness for external certification.',
        order: 6,
        durationMinutes: 50,
        lessonsCount: 1,
        status: 'available',
        frameworkId: 'iso27001'
      }
    ]
  },

  {
    id: 'nist-csf-path',
    title: 'NIST Cybersecurity Framework',
    roleTarget: 'Security Architect / Risk Manager / Federal Compliance Officer',
    description: 'In-depth study of NIST CSF 2.0: Govern, Identify, Protect, Detect, Respond, and Recover functions.',
    level: 'Intermediate',
    difficulty: 'Intermediate',
    estimatedTime: '7 Hours',
    estimatedHours: 7,
    modulesCount: 6,
    progressPercentage: 50,
    estimatedWeeks: 3,
    modulesIncluded: [{ frameworkId: 'nistcsf', moduleId: 'nist-mod-1' }],
    milestones: [
      'Master the 6 Core Functions including the new GOVERN (GV) function',
      'Create Organizational Current vs Target Profiles',
      'Evaluate Implementation Tiers (Tier 1 Partial to Tier 4 Adaptive)',
      'Complete CSF 2.0 Operational Playbook'
    ],
    overview: {
      whatYouWillLearn: [
        'NIST CSF 2.0 architecture: Core Functions, Categories, and Subcategories',
        'Integrating cybersecurity governance with enterprise risk management (Govern function)',
        'Building Current and Target Profiles to benchmark and budget security upgrades',
        'Supply chain risk management (C-SCRM) and third-party dependency governance'
      ],
      whyItMatters: 'NIST CSF provides the industry-standard common taxonomy recognized by cyber insurance underwriters, federal regulators, and enterprise boards of directors.',
      learningObjectives: [
        'Conduct organizational maturity assessments using NIST CSF 2.0 tiers',
        'Align cyber investments directly to executive risk tolerance',
        'Coordinate multi-team incident response and resilience workflows'
      ],
      estimatedCompletionTime: '7 Hours (Self-paced)',
      difficulty: 'Intermediate'
    },
    curriculumModules: [
      {
        id: 'nist-path-mod-1',
        title: 'Module 1 — Introduction to NIST CSF 2.0 & Govern (GV)',
        subtitle: 'Boardroom Oversight',
        description: 'The architectural expansion of CSF 2.0 and executive governance.',
        order: 1,
        durationMinutes: 60,
        lessonsCount: 3,
        status: 'completed',
        frameworkId: 'nistcsf',
        targetLessonId: 'nist-l1'
      },
      {
        id: 'nist-path-mod-2',
        title: 'Module 2 — Core Concepts: Identify (ID) & Protect (PR)',
        subtitle: 'Assets & Safeguards',
        description: 'Hardware/software asset inventory, IAM, data security, and platform baselines.',
        order: 2,
        durationMinutes: 70,
        lessonsCount: 3,
        status: 'completed',
        frameworkId: 'nistcsf',
        targetLessonId: 'nist-l2'
      },
      {
        id: 'nist-path-mod-3',
        title: 'Module 3 — Practical Implementation: Detect (DE), Respond (RS) & Recover (RC)',
        subtitle: 'Resilience Architecture',
        description: 'SIEM event detection, containment runbooks, and disaster recovery execution.',
        order: 3,
        durationMinutes: 75,
        lessonsCount: 3,
        status: 'current',
        frameworkId: 'nistcsf',
        targetLessonId: 'nist-l2'
      },
      {
        id: 'nist-path-mod-4',
        title: 'Module 4 — Real-World Examples: Critical Infrastructure CSF Profiling',
        subtitle: 'Current vs Target Profile',
        description: 'Case study of a regional energy provider closing security gaps via CSF profiling.',
        order: 4,
        durationMinutes: 60,
        lessonsCount: 2,
        status: 'available',
        frameworkId: 'nistcsf'
      },
      {
        id: 'nist-path-mod-5',
        title: 'Module 5 — Supply Chain Risk Management (C-SCRM)',
        subtitle: 'Third-Party Governance',
        description: 'Evaluating vendor security posture, software bills of materials (SBOMs), and SLA compliance.',
        order: 5,
        durationMinutes: 55,
        lessonsCount: 2,
        status: 'available',
        frameworkId: 'nistcsf'
      },
      {
        id: 'nist-path-mod-6',
        title: 'Module 6 — NIST CSF 2.0 Practitioner Knowledge Assessment',
        subtitle: 'Diagnostic Assessment',
        description: 'Interactive exam testing scenario diagnosis and profile maturity.',
        order: 6,
        durationMinutes: 45,
        lessonsCount: 1,
        status: 'available',
        frameworkId: 'nistcsf'
      }
    ]
  },

  {
    id: 'soc-2-path',
    title: 'SOC 2',
    roleTarget: 'Cloud Architect / Security Lead / DevOps Engineer',
    description: 'Master the AICPA Trust Services Criteria: Security (Common Criteria), Availability, Processing Integrity, Confidentiality, and Privacy.',
    level: 'Intermediate',
    difficulty: 'Intermediate',
    estimatedTime: '6 Hours',
    estimatedHours: 6,
    modulesCount: 5,
    progressPercentage: 40,
    estimatedWeeks: 2,
    modulesIncluded: [{ frameworkId: 'soc2', moduleId: 'soc2-mod-1' }],
    milestones: [
      'Differentiate SOC 2 Type I vs Type II audit scopes and testing methods',
      'Implement Common Criteria CC6 (Access), CC7 (Operations), and CC8 (Change Management)',
      'Automate cloud evidence collection in AWS, GCP, or Azure',
      'Pass the SOC 2 Audit Readiness Assessment'
    ],
    overview: {
      whatYouWillLearn: [
        'The 5 Trust Services Criteria (TSC) with emphasis on Common Criteria Security',
        'Key technical controls: CI/CD branch protection, Okta MFA, quarterly UARs, KMS encryption',
        'How CPA audit firms evaluate sample sizes, exceptions, and management responses',
        'Transitioning from an initial Type I point-in-time report to continuous Type II observation'
      ],
      whyItMatters: 'SOC 2 is the ubiquitous trust benchmark in the North American SaaS economy. Without a clean SOC 2 Type II report, closing enterprise software sales is nearly impossible.',
      learningObjectives: [
        'Design security controls that satisfy AICPA Common Criteria expectations',
        'Maintain continuous compliance evidence without disrupting engineering sprints',
        'Lead external CPA auditors through system walkthroughs with zero exceptions'
      ],
      estimatedCompletionTime: '6 Hours (Self-paced)',
      difficulty: 'Intermediate'
    },
    curriculumModules: [
      {
        id: 'soc2-path-mod-1',
        title: 'Module 1 — Introduction to SOC 2 & Type I vs Type II',
        subtitle: 'Understanding the Report',
        description: 'AICPA governance, service commitments, system descriptions, and auditor independence.',
        order: 1,
        durationMinutes: 55,
        lessonsCount: 3,
        status: 'completed',
        frameworkId: 'soc2',
        targetLessonId: 'soc2-l1'
      },
      {
        id: 'soc2-path-mod-2',
        title: 'Module 2 — Core Concepts: CC6 Access & Identity Architecture',
        subtitle: 'Access Control Rigor',
        description: 'Mandatory MFA, role-based access, 24-hour offboarding SLAs, and quarterly user access reviews.',
        order: 2,
        durationMinutes: 65,
        lessonsCount: 3,
        status: 'completed',
        frameworkId: 'soc2',
        targetLessonId: 'soc2-l2'
      },
      {
        id: 'soc2-path-mod-3',
        title: 'Module 3 — Practical Implementation: CC7 Operations & CC8 Change Management',
        subtitle: 'Engineering Controls',
        description: 'Peer-reviewed pull requests, automated testing gates, vulnerability scanning, and SIEM monitoring.',
        order: 3,
        durationMinutes: 70,
        lessonsCount: 4,
        status: 'current',
        frameworkId: 'soc2',
        targetLessonId: 'soc2-l2'
      },
      {
        id: 'soc2-path-mod-4',
        title: 'Module 4 — Real-World Examples: Handling Audit Exceptions',
        subtitle: 'Mitigating Deficiencies',
        description: 'Case studies on how to write formal management responses when an auditor finds a control failure.',
        order: 4,
        durationMinutes: 50,
        lessonsCount: 2,
        status: 'available',
        frameworkId: 'soc2'
      },
      {
        id: 'soc2-path-mod-5',
        title: 'Module 5 — Knowledge Assessment: Mock SOC 2 Audit Walkthrough',
        subtitle: 'CPA Inspection Simulation',
        description: 'Interactive examination testing sample selection, evidence validation, and report interpretation.',
        order: 5,
        durationMinutes: 40,
        lessonsCount: 1,
        status: 'available',
        frameworkId: 'soc2'
      }
    ]
  },

  {
    id: 'gdpr-path',
    title: 'GDPR',
    roleTarget: 'Data Protection Officer (DPO) / Privacy Engineer / Product Counsel',
    description: 'Understand EU General Data Protection Regulation: 7 core principles, lawful bases, data subject rights, DPIA, and 72-hour breach notices.',
    level: 'Intermediate',
    difficulty: 'Intermediate',
    estimatedTime: '5 Hours',
    estimatedHours: 5,
    modulesCount: 4,
    progressPercentage: 30,
    estimatedWeeks: 2,
    modulesIncluded: [{ frameworkId: 'gdpr', moduleId: 'gdpr-mod-1' }],
    milestones: [
      'Master the 7 Core Principles of Article 5',
      'Operationalize Data Subject Access Requests (DSARs) within 30 days',
      'Execute a Data Protection Impact Assessment (DPIA) under Article 35',
      'Implement 72-hour incident escalation and notification playbooks'
    ],
    overview: {
      whatYouWillLearn: [
        'Personal data taxonomy and special categories of data under EU law',
        'Lawful basis for processing: Consent, Legitimate Interests, and Contractual Necessity',
        'Data subject rights: Access, Rectification, Erasure ("Right to be Forgotten"), and Portability',
        'Data Protection Impact Assessments (DPIAs) and international cross-border data transfer mechanisms (SCCs)'
      ],
      whyItMatters: 'GDPR fines reach up to 4% of global turnover or €20 million. Regulatory compliance is essential for any digital product serving global or European users.',
      learningObjectives: [
        'Embed Privacy by Design into software architecture and feature releases',
        'Establish automated workflows to fulfill DSAR requests within statutory timeframes',
        'Manage high-stakes data breach escalations with European Data Protection Authorities'
      ],
      estimatedCompletionTime: '5 Hours (Self-paced)',
      difficulty: 'Intermediate'
    },
    curriculumModules: [
      {
        id: 'gdpr-path-mod-1',
        title: 'Module 1 — Introduction to GDPR & Article 5 Principles',
        subtitle: 'The European Privacy Standard',
        description: 'Scope, territorial reach, extraterritoriality, and the 7 fundamental principles.',
        order: 1,
        durationMinutes: 55,
        lessonsCount: 3,
        status: 'completed',
        frameworkId: 'gdpr',
        targetLessonId: 'gdpr-l1'
      },
      {
        id: 'gdpr-path-mod-2',
        title: 'Module 2 — Core Concepts: Lawful Basis & Consent Management',
        subtitle: 'Valid Processing Grounds',
        description: 'Analyzing Article 6 legal grounds, cookie tracking, and legitimate interest assessments (LIAs).',
        order: 2,
        durationMinutes: 60,
        lessonsCount: 3,
        status: 'current',
        frameworkId: 'gdpr',
        targetLessonId: 'gdpr-l1'
      },
      {
        id: 'gdpr-path-mod-3',
        title: 'Module 3 — Practical Implementation: DSARs & DPIAs',
        subtitle: 'Operational Workflows',
        description: 'Fulfilling Right to Erasure, data mapping (RoPA), and conducting Article 35 DPIA reviews.',
        order: 3,
        durationMinutes: 65,
        lessonsCount: 3,
        status: 'available',
        frameworkId: 'gdpr'
      },
      {
        id: 'gdpr-path-mod-4',
        title: 'Module 4 — Real-World Examples & 72-Hour Breach Reporting',
        subtitle: 'Crisis Communications',
        description: 'Evaluating landmark enforcement actions (CNIL, ICO, DPC) and rapid breach notification protocol.',
        order: 4,
        durationMinutes: 50,
        lessonsCount: 2,
        status: 'available',
        frameworkId: 'gdpr'
      }
    ]
  },

  {
    id: 'pci-dss-path',
    title: 'PCI DSS',
    roleTarget: 'Payment Security Engineer / FinTech Architect / Qualified Security Assessor (QSA)',
    description: 'Master PCI-DSS v4.0: CDE network segmentation, protecting stored cardholder data, script integrity (Req 6.4.3), and universal MFA.',
    level: 'Intermediate',
    difficulty: 'Intermediate',
    estimatedTime: '6 Hours',
    estimatedHours: 6,
    modulesCount: 5,
    progressPercentage: 25,
    estimatedWeeks: 2,
    modulesIncluded: [{ frameworkId: 'pcidss', moduleId: 'pci-mod-1' }],
    milestones: [
      'Define Cardholder Data Environment (CDE) boundaries and network segmentation',
      'Enforce zero storage of Sensitive Authentication Data (SAD/CVV) post-auth',
      'Implement PCI-DSS v4.0 Requirement 6.4.3 script management on payment pages',
      'Pass the PCI-DSS Audit Scoping Assessment'
    ],
    overview: {
      whatYouWillLearn: [
        'The 12 Core Requirements of PCI-DSS v4.0 and customized validation approaches',
        'CDE scoping, network segmentation, and tokenization architectures (e.g. hosted iframes)',
        'Cardholder Data (CHD) and Sensitive Authentication Data (SAD) cryptographic protection',
        'New v4.0 mandates: Universal MFA (Req 8.4.2) and payment page script tampering defense (Req 6.4.3)'
      ],
      whyItMatters: 'Card breaches result in catastrophic card brand fines, mandatory forensic investigations (PFI), and loss of card processing merchant privileges.',
      learningObjectives: [
        'Isolate payment processing infrastructure to minimize compliance audit scope',
        'Audit web payment checkouts against Magecart script injection vulnerabilities',
        'Prepare Level 1 Reports on Compliance (ROC) and Self-Assessment Questionnaires (SAQs)'
      ],
      estimatedCompletionTime: '6 Hours (Self-paced)',
      difficulty: 'Intermediate'
    },
    curriculumModules: [
      {
        id: 'pci-path-mod-1',
        title: 'Module 1 — Introduction to PCI-DSS & The 12 Requirements',
        subtitle: 'Protecting the Payment Stream',
        description: 'Payment brand rules, merchant levels, and overview of the 12 core requirements.',
        order: 1,
        durationMinutes: 55,
        lessonsCount: 3,
        status: 'completed',
        frameworkId: 'pcidss',
        targetLessonId: 'pci-l1'
      },
      {
        id: 'pci-path-mod-2',
        title: 'Module 2 — Core Concepts: CDE Scoping, Segmentation & Tokenization',
        subtitle: 'Shrinking the Audit Surface',
        description: 'Using VLAN isolation, firewalls, and third-party tokenization to reduce audit scope by 90%.',
        order: 2,
        durationMinutes: 65,
        lessonsCount: 3,
        status: 'current',
        frameworkId: 'pcidss',
        targetLessonId: 'pci-l1'
      },
      {
        id: 'pci-path-mod-3',
        title: 'Module 3 — Practical Implementation: Stored Data & Key Management',
        subtitle: 'Requirement 3 Deep Dive',
        description: 'AES-256 encryption of PAN, key generation, split knowledge, and strict ban on SAD storage.',
        order: 3,
        durationMinutes: 70,
        lessonsCount: 3,
        status: 'available',
        frameworkId: 'pcidss'
      },
      {
        id: 'pci-path-mod-4',
        title: 'Module 4 — Real-World Examples: PCI-DSS v4.0 Web Skimming Defense',
        subtitle: 'Requirement 6.4.3 in Practice',
        description: 'Deploying Subresource Integrity (SRI) and script authorization on e-commerce payment pages.',
        order: 4,
        durationMinutes: 55,
        lessonsCount: 2,
        status: 'available',
        frameworkId: 'pcidss'
      },
      {
        id: 'pci-path-mod-5',
        title: 'Module 5 — Knowledge Assessment: FinTech QSA Audit Simulation',
        subtitle: 'Auditor Verification Exam',
        description: 'Interactive scenario evaluating card data flow analysis and boundary defense.',
        order: 5,
        durationMinutes: 45,
        lessonsCount: 1,
        status: 'available',
        frameworkId: 'pcidss'
      }
    ]
  },

  // ==========================================
  // LEVEL 3 — ADVANCED
  // ==========================================
  {
    id: 'enterprise-grc',
    title: 'Enterprise GRC',
    roleTarget: 'Director of GRC / VP of Security / Chief Risk Officer',
    description: 'Architect and operationalize enterprise Governance, Risk, and Compliance across multi-cloud environments and complex business units.',
    level: 'Advanced',
    difficulty: 'Advanced',
    estimatedTime: '10 Hours',
    estimatedHours: 10,
    modulesCount: 6,
    progressPercentage: 15,
    estimatedWeeks: 4,
    modulesIncluded: [{ frameworkId: 'iso27001', moduleId: 'iso-mod-1' }],
    milestones: [
      'Design an Enterprise Common Control Framework (CCF)',
      'Automate third-party vendor risk assessments and tiering',
      'Establish continuous compliance reporting for board and audit committees',
      'Pass the Executive GRC Architecture Assessment'
    ],
    overview: {
      whatYouWillLearn: [
        'How to harmonize multiple frameworks (ISO, SOC 2, NIST, GDPR, HIPAA) into a single Common Control Framework',
        'Enterprise policy lifecycle governance and automated exception management',
        'Continuous compliance observability and integration with CI/CD and cloud posture tools',
        'Boardroom reporting metrics: Mean Time to Remediation, residual risk value, and audit readiness index'
      ],
      whyItMatters: 'Managing compliance in silos leads to duplicated auditor evidence requests, engineer fatigue, and missed controls. An enterprise GRC program eliminates waste and scales with growth.',
      learningObjectives: [
        'Engineer a unified Common Control Framework to "test once, satisfy many"',
        'Implement scalable Vendor Risk Management (VRM) tiers and automated assessments',
        'Communicate cybersecurity risk quantitatively to executive leadership'
      ],
      estimatedCompletionTime: '10 Hours (Self-paced)',
      difficulty: 'Advanced'
    },
    curriculumModules: [
      {
        id: 'egrc-mod-1',
        title: 'Module 1 — Introduction to Unified GRC Architecture',
        subtitle: 'Eliminating Compliance Silos',
        description: 'Taxonomy, harmonized control frameworks, and executive charters.',
        order: 1,
        durationMinutes: 70,
        lessonsCount: 3,
        status: 'completed',
        frameworkId: 'iso27001'
      },
      {
        id: 'egrc-mod-2',
        title: 'Module 2 — Core Concepts: Common Control Framework (CCF) Engineering',
        subtitle: 'Test Once, Comply with All',
        description: 'Mapping SOC 2 CC6.1, ISO A.5.15, NIST PR.AA, and PCI Req 8 into single unified test procedures.',
        order: 2,
        durationMinutes: 80,
        lessonsCount: 4,
        status: 'current',
        frameworkId: 'soc2'
      },
      {
        id: 'egrc-mod-3',
        title: 'Module 3 — Practical Implementation: Automated Vendor Risk Management',
        subtitle: 'Supply Chain Governance',
        description: 'Tiered vendor scoping, automated SIG/CAIQ questionnaires, and SOC 2 report reviews.',
        order: 3,
        durationMinutes: 75,
        lessonsCount: 3,
        status: 'available',
        frameworkId: 'nistcsf'
      },
      {
        id: 'egrc-mod-4',
        title: 'Module 4 — Real-World Examples: Continuous Compliance Pipelines',
        subtitle: 'API-Driven Verification',
        description: 'Integrating AWS Security Hub, GitHub, and Jira into real-time compliance telemetry dashboards.',
        order: 4,
        durationMinutes: 70,
        lessonsCount: 3,
        status: 'available',
        frameworkId: 'soc2'
      },
      {
        id: 'egrc-mod-5',
        title: 'Module 5 — Board Reporting & Audit Committee Governance',
        subtitle: 'Executive Communication',
        description: 'Translating technical CVEs and audit findings into fiduciary business risk and capital requests.',
        order: 5,
        durationMinutes: 65,
        lessonsCount: 2,
        status: 'available',
        frameworkId: 'iso27001'
      },
      {
        id: 'egrc-mod-6',
        title: 'Module 6 — Enterprise GRC Capstone Assessment',
        subtitle: 'Unified Program Defense',
        description: 'Interactive defense of a global compliance strategy before a simulated audit committee.',
        order: 6,
        durationMinutes: 55,
        lessonsCount: 1,
        status: 'available',
        frameworkId: 'iso27001'
      }
    ]
  },

  {
    id: 'risk-assessment-path',
    title: 'Risk Assessment',
    roleTarget: 'Senior Risk Manager / Quantitative Risk Analyst / Security Consultant',
    description: 'Perform advanced threat modeling (STRIDE, DREAD), FAIR quantitative risk analysis, and business impact analysis (BIA).',
    level: 'Advanced',
    difficulty: 'Advanced',
    estimatedTime: '8 Hours',
    estimatedHours: 8,
    modulesCount: 5,
    progressPercentage: 0,
    estimatedWeeks: 3,
    modulesIncluded: [{ frameworkId: 'nistcsf', moduleId: 'nist-mod-1' }],
    milestones: [
      'Master STRIDE, PASTA, and DREAD threat modeling methodologies',
      'Execute Factor Analysis of Information Risk (FAIR) quantitative financial calculations',
      'Conduct a comprehensive Business Impact Analysis (BIA) determining RTO/RPO',
      'Pass the Advanced Risk Modeling Assessment'
    ],
    overview: {
      whatYouWillLearn: [
        'Methodologies for decomposing complex cloud systems and microservices into threat models',
        'FAIR quantitative modeling: Loss Event Frequency, Vulnerability, and Loss Magnitude in dollar terms',
        'Business Impact Analysis (BIA) and establishing Maximum Tolerable Downtime (MTD)',
        'Calibrating risk appetite statements and executive risk tolerance thresholds'
      ],
      whyItMatters: 'Qualitative heatmaps (Red/Yellow/Green) are notoriously subjective and unscientific. Quantitative risk modeling allows organizations to price risk and justify capital expenditures with data.',
      learningObjectives: [
        'Apply STRIDE to modern cloud architectures and microservices',
        'Model cybersecurity losses in financial terms using FAIR methodology',
        'Conduct executive risk triage for zero-day vulnerabilities'
      ],
      estimatedCompletionTime: '8 Hours (Self-paced)',
      difficulty: 'Advanced'
    },
    curriculumModules: [
      {
        id: 'ra-mod-1',
        title: 'Module 1 — Threat Modeling Methodologies (STRIDE & PASTA)',
        subtitle: 'Architectural Analysis',
        description: 'Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege.',
        order: 1,
        durationMinutes: 70,
        lessonsCount: 3,
        status: 'current',
        frameworkId: 'nistcsf'
      },
      {
        id: 'ra-mod-2',
        title: 'Module 2 — FAIR Quantitative Financial Risk Modeling',
        subtitle: 'Pricing Cyber Risk',
        description: 'Loss Event Frequency (LEF), Loss Magnitude (LM), and Monte Carlo simulations.',
        order: 2,
        durationMinutes: 80,
        lessonsCount: 3,
        status: 'available',
        frameworkId: 'iso27001'
      },
      {
        id: 'ra-mod-3',
        title: 'Module 3 — Business Impact Analysis (BIA) & Resilience',
        subtitle: 'RTO, RPO & MTD',
        description: 'Calculating financial and operational impact across critical business functions.',
        order: 3,
        durationMinutes: 70,
        lessonsCount: 3,
        status: 'available',
        frameworkId: 'nistcsf'
      },
      {
        id: 'ra-mod-4',
        title: 'Module 4 — Real-World Examples: Cloud Data Breach Loss Modeling',
        subtitle: 'Simulating Major Losses',
        description: 'Step-by-step financial modeling of a customer database exfiltration incident.',
        order: 4,
        durationMinutes: 65,
        lessonsCount: 2,
        status: 'available',
        frameworkId: 'soc2'
      },
      {
        id: 'ra-mod-5',
        title: 'Module 5 — Advanced Risk Assessment Knowledge Check',
        subtitle: 'Quantitative Evaluation',
        description: 'Scenario exam testing threat modeling decisions and FAIR calculations.',
        order: 5,
        durationMinutes: 50,
        lessonsCount: 1,
        status: 'available',
        frameworkId: 'nistcsf'
      }
    ]
  },

  {
    id: 'security-control-impl',
    title: 'Security Control Implementation',
    roleTarget: 'DevSecOps Architect / Infrastructure Security Engineer / Cloud Security Lead',
    description: 'Translate regulatory obligations into technical guardrails: infrastructure as code (IaC), zero-trust architecture, and automated policy engines.',
    level: 'Advanced',
    difficulty: 'Advanced',
    estimatedTime: '9 Hours',
    estimatedHours: 9,
    modulesCount: 6,
    progressPercentage: 0,
    estimatedWeeks: 3,
    modulesIncluded: [{ frameworkId: 'cis-controls', moduleId: 'cis-mod-1' }],
    milestones: [
      'Implement Zero Trust Network Access (ZTNA) and mutual TLS (mTLS)',
      'Deploy Cloud Security Posture Management (CSPM) and Policy-as-Code (OPA)',
      'Automate cryptographic key rotation and KMS envelopes',
      'Pass the Technical Controls Engineering Examination'
    ],
    overview: {
      whatYouWillLearn: [
        'Translating human policies into automated code guardrails using OPA (Open Policy Agent) and Terraform',
        'Zero Trust implementation: Identity verification, device posture, and micro-segmentation',
        'Cloud security engineering: IAM boundary policies, KMS customer-managed keys, and private subnets',
        'Continuous automated evidence generation directly from production telemetry'
      ],
      whyItMatters: 'Manual compliance processes cannot keep pace with continuous deployment. Technical control implementation enforces security as an automated attribute of software delivery.',
      learningObjectives: [
        'Automate compliance checks in CI/CD pipelines before code reaches production',
        'Architect Zero Trust access controls that satisfy SOC 2 CC6 and ISO A.8',
        'Eliminate configuration drift using Infrastructure as Code (IaC)'
      ],
      estimatedCompletionTime: '9 Hours (Self-paced)',
      difficulty: 'Advanced'
    },
    curriculumModules: [
      {
        id: 'sci-mod-1',
        title: 'Module 1 — Zero Trust Architecture & Technical Scoping',
        subtitle: 'Never Trust, Always Verify',
        description: 'Identity-aware proxies, device health attestation, and dynamic access policies.',
        order: 1,
        durationMinutes: 75,
        lessonsCount: 3,
        status: 'current',
        frameworkId: 'cis-controls'
      },
      {
        id: 'sci-mod-2',
        title: 'Module 2 — Policy-as-Code & Automated Guardrails (OPA/Rego)',
        subtitle: 'Automated Enforcement',
        description: 'Writing Rego policies to prevent unencrypted S3 buckets, open security groups, and missing tags.',
        order: 2,
        durationMinutes: 85,
        lessonsCount: 4,
        status: 'available',
        frameworkId: 'soc2'
      },
      {
        id: 'sci-mod-3',
        title: 'Module 3 — Cryptographic Key Architecture & Cloud KMS',
        subtitle: 'Data-at-Rest & In-Transit',
        description: 'Envelope encryption, HSM key storage, automated 90-day rotation, and TLS 1.3 enforcement.',
        order: 3,
        durationMinutes: 80,
        lessonsCount: 3,
        status: 'available',
        frameworkId: 'pcidss'
      },
      {
        id: 'sci-mod-4',
        title: 'Module 4 — CI/CD Pipeline Security & SAST/DAST Gates',
        subtitle: 'DevSecOps Integration',
        description: 'Branch protection, dependency vulnerability scans, container signing, and SBOM verification.',
        order: 4,
        durationMinutes: 75,
        lessonsCount: 3,
        status: 'available',
        frameworkId: 'iso27001'
      },
      {
        id: 'sci-mod-5',
        title: 'Module 5 — Real-World Examples: Self-Healing Cloud Compliance',
        subtitle: 'Automated Remediation',
        description: 'Event-driven Lambda functions that automatically revoke public access and alert SecOps.',
        order: 5,
        durationMinutes: 65,
        lessonsCount: 2,
        status: 'available',
        frameworkId: 'soc2'
      },
      {
        id: 'sci-mod-6',
        title: 'Module 6 — Security Control Implementation Assessment',
        subtitle: 'Technical Verification',
        description: 'Interactive exam testing code review, architecture analysis, and cloud configuration.',
        order: 6,
        durationMinutes: 50,
        lessonsCount: 1,
        status: 'available',
        frameworkId: 'cis-controls'
      }
    ]
  },

  {
    id: 'audit-preparation',
    title: 'Audit Preparation',
    roleTarget: 'Audit Manager / GRC Lead / External Audit Liaison',
    description: 'Lead external audit readiness: evidence collection pipelines, population sampling, auditor interview coaching, and deficiency mitigation.',
    level: 'Advanced',
    difficulty: 'Advanced',
    estimatedTime: '8 Hours',
    estimatedHours: 8,
    modulesCount: 5,
    progressPercentage: 0,
    estimatedWeeks: 3,
    modulesIncluded: [{ frameworkId: 'soc2', moduleId: 'soc2-mod-1' }],
    milestones: [
      'Build and manage Prepared By Client (PBC) request trackers',
      'Coach engineers and managers for auditor interview sessions',
      'Validate population completeness and sample selection integrity',
      'Pass the Audit Lead Readiness Examination'
    ],
    overview: {
      whatYouWillLearn: [
        'End-to-end management of external third-party certification and attestation audits',
        'How auditors select sample populations and statistical sampling criteria',
        'Evidence hygiene: Timestamps, unredacted verification, and immutable storage',
        'Drafting management responses and remediation plans when exceptions occur'
      ],
      whyItMatters: 'Poor audit preparation creates months of engineering distraction, failed controls, and costly auditor re-testing fees. A disciplined prep program ensures smooth, on-time unqualified reports.',
      learningObjectives: [
        'Streamline PBC collection timelines from weeks to hours',
        'Prevent accidental disclosure of non-scoped materials during auditor interviews',
        'Negotiate disputed findings with external lead partners professionally'
      ],
      estimatedCompletionTime: '8 Hours (Self-paced)',
      difficulty: 'Advanced'
    },
    curriculumModules: [
      {
        id: 'ap-mod-1',
        title: 'Module 1 — Audit Scoping & PBC Pipeline Architecture',
        subtitle: 'Setting Boundaries',
        description: 'System boundary definition, subservice organization carve-outs, and PBC tracking.',
        order: 1,
        durationMinutes: 65,
        lessonsCount: 3,
        status: 'current',
        frameworkId: 'soc2'
      },
      {
        id: 'ap-mod-2',
        title: 'Module 2 — Population Completeness & Sampling Math',
        subtitle: 'Proving Total Populations',
        description: 'Exporting complete user lists, change commits, and incident tickets without missing records.',
        order: 2,
        durationMinutes: 75,
        lessonsCount: 3,
        status: 'available',
        frameworkId: 'iso27001'
      },
      {
        id: 'ap-mod-3',
        title: 'Module 3 — Auditor Interview Coaching & Psychology',
        subtitle: 'Preparing the Team',
        description: 'How to prepare engineers, IT admins, and HR managers for live walkthrough queries.',
        order: 3,
        durationMinutes: 70,
        lessonsCount: 3,
        status: 'available',
        frameworkId: 'soc2'
      },
      {
        id: 'ap-mod-4',
        title: 'Module 4 — Exception Triage & Management Responses',
        subtitle: 'When Tests Fail',
        description: 'Writing effective, audit-accepted management responses that prevent qualified opinions.',
        order: 4,
        durationMinutes: 65,
        lessonsCount: 2,
        status: 'available',
        frameworkId: 'iso27001'
      },
      {
        id: 'ap-mod-5',
        title: 'Module 5 — Audit Lead Knowledge Assessment',
        subtitle: 'Simulated Walkthrough Exam',
        description: 'Interactive exam testing evidence validation, sample evaluation, and auditor dispute handling.',
        order: 5,
        durationMinutes: 50,
        lessonsCount: 1,
        status: 'available',
        frameworkId: 'soc2'
      }
    ]
  },

  {
    id: 'compliance-gap-analysis',
    title: 'Compliance Gap Analysis',
    roleTarget: 'GRC Consultant / Security Assessor / Compliance Architect',
    description: 'Conduct comprehensive baseline gap analyses across multi-standard frameworks to prioritize remediation budgets and engineering sprints.',
    level: 'Advanced',
    difficulty: 'Advanced',
    estimatedTime: '7 Hours',
    estimatedHours: 7,
    modulesCount: 4,
    progressPercentage: 0,
    estimatedWeeks: 2,
    modulesIncluded: [{ frameworkId: 'iso27001', moduleId: 'iso-mod-1' }],
    milestones: [
      'Execute a structured baseline compliance gap assessment',
      'Quantify control maturity using CMMI levels (1 through 5)',
      'Construct an executive remediation roadmap with resource allocation',
      'Pass the Gap Analysis & Readiness Assessment'
    ],
    overview: {
      whatYouWillLearn: [
        'Methodology for evaluating current-state security posture against target regulatory frameworks',
        'Maturity scoring: Initial, Managed, Defined, Quantitatively Managed, Optimizing (CMMI)',
        'Root-cause deficiency analysis: Distinguishing between policy gaps and technical operational failures',
        'Building executive business cases for compliance investments and headcount'
      ],
      whyItMatters: 'Starting a compliance implementation without a gap analysis leads to wasted effort on low-impact controls while catastrophic gaps remain unnoticed.',
      learningObjectives: [
        'Map organizational current state accurately without sugar-coating gaps',
        'Deliver a prioritized 90-day, 180-day, and 365-day remediation roadmap',
        'Align gap remediation with engineering sprint cycles'
      ],
      estimatedCompletionTime: '7 Hours (Self-paced)',
      difficulty: 'Advanced'
    },
    curriculumModules: [
      {
        id: 'cga-mod-1',
        title: 'Module 1 — Gap Assessment Methodology & Discovery',
        subtitle: 'Assessing Current State',
        description: 'Interview techniques, policy reviews, and technical artifact sampling.',
        order: 1,
        durationMinutes: 70,
        lessonsCount: 3,
        status: 'current',
        frameworkId: 'iso27001'
      },
      {
        id: 'cga-mod-2',
        title: 'Module 2 — Control Maturity Scoring (CMMI Framework)',
        subtitle: 'Measuring Rigor',
        description: 'Scoring controls from ad-hoc (Level 1) to automated and continuously optimized (Level 5).',
        order: 2,
        durationMinutes: 75,
        lessonsCount: 3,
        status: 'available',
        frameworkId: 'nistcsf'
      },
      {
        id: 'cga-mod-3',
        title: 'Module 3 — Root-Cause Analysis & Remediation Roadmaps',
        subtitle: 'Fixing the Gaps',
        description: 'Structuring engineering tasks in Jira, defining RACI matrix ownership, and tracking closure.',
        order: 3,
        durationMinutes: 75,
        lessonsCount: 3,
        status: 'available',
        frameworkId: 'soc2'
      },
      {
        id: 'cga-mod-4',
        title: 'Module 4 — Gap Analysis Assessment & Executive Delivery',
        subtitle: 'Executive Presentation',
        description: 'Interactive exam testing gap identification, maturity scoring, and executive roadmap presentation.',
        order: 4,
        durationMinutes: 50,
        lessonsCount: 1,
        status: 'available',
        frameworkId: 'iso27001'
      }
    ]
  },

  // ==========================================
  // LEVEL 4 — EXPERT
  // ==========================================
  {
    id: 'enterprise-security-scenarios',
    title: 'Enterprise Security Scenarios',
    roleTarget: 'Chief Information Security Officer (CISO) / Incident Commander / Principal Architect',
    description: 'Analyze high-stakes real-world security breaches, ransomware negotiation dilemmas, and crisis communications.',
    level: 'Expert',
    difficulty: 'Expert',
    estimatedTime: '12 Hours',
    estimatedHours: 12,
    modulesCount: 6,
    progressPercentage: 0,
    estimatedWeeks: 4,
    modulesIncluded: [{ frameworkId: 'nistcsf', moduleId: 'nist-mod-1' }],
    milestones: [
      'Lead cross-functional crisis management during an active ransomware attack',
      'Coordinate legal, technical, and regulatory notifications under pressure',
      'Execute cloud forensics and threat actor containment without destroying evidence',
      'Pass the Executive Incident Commander Scenario'
    ],
    overview: {
      whatYouWillLearn: [
        'Anatomy of complex enterprise cyber crises: Nation-state supply chain compromises, cloud credential leaks, and ransomware double extortion',
        'Executive decision-making under uncertainty: When to isolate systems, when to notify law enforcement, and insurance involvement',
        'Coordinating legal counsel, external digital forensics (DFIR), PR crisis management, and executive board members',
        'Conducting blameless post-mortems and driving systemic architectural improvements'
      ],
      whyItMatters: 'In a catastrophic breach, technical decisions have immediate legal, financial, and existential corporate consequences. CISOs must be prepared to lead when the organization is under attack.',
      learningObjectives: [
        'Manage high-velocity technical containment while preserving forensic evidence chain of custody',
        'Balance transparency obligations with liability exposure during public disclosures',
        'Rebuild enterprise infrastructure securely following total domain compromise'
      ],
      estimatedCompletionTime: '12 Hours (Self-paced)',
      difficulty: 'Expert'
    },
    curriculumModules: [
      {
        id: 'ess-mod-1',
        title: 'Module 1 — Nation-State Supply Chain Compromise',
        subtitle: 'The Advanced Adversary',
        description: 'Dissecting build pipeline poisoning, certificate abuse, and stealthy persistence.',
        order: 1,
        durationMinutes: 85,
        lessonsCount: 4,
        status: 'current',
        frameworkId: 'nistcsf'
      },
      {
        id: 'ess-mod-2',
        title: 'Module 2 — Ransomware Double Extortion & Crisis Response',
        subtitle: 'Data Theft & Encryption',
        description: 'Active containment, negotiation protocols, cyber insurance involvement, and recovery drills.',
        order: 2,
        durationMinutes: 90,
        lessonsCount: 4,
        status: 'available',
        frameworkId: 'nistcsf'
      },
      {
        id: 'ess-mod-3',
        title: 'Module 3 — Cloud Multi-Tenant Data Exfiltration',
        subtitle: 'SaaS Architecture Failure',
        description: 'Handling logical cross-tenant boundary breaches and emergency customer disclosures.',
        order: 3,
        durationMinutes: 85,
        lessonsCount: 3,
        status: 'available',
        frameworkId: 'soc2'
      },
      {
        id: 'ess-mod-4',
        title: 'Module 4 — Insider Threat & Intellectual Property Exfiltration',
        subtitle: 'The Privileged Attacker',
        description: 'Managing compromised executive credentials, DLP alerts, and covert HR investigations.',
        order: 4,
        durationMinutes: 80,
        lessonsCount: 3,
        status: 'available',
        frameworkId: 'iso27001'
      },
      {
        id: 'ess-mod-5',
        title: 'Module 5 — Boardroom War Room & Regulatory Briefings',
        subtitle: 'Executive Leadership',
        description: 'Delivering briefings to SEC, European DPAs, corporate board of directors, and the press.',
        order: 5,
        durationMinutes: 75,
        lessonsCount: 2,
        status: 'available',
        frameworkId: 'gdpr'
      },
      {
        id: 'ess-mod-6',
        title: 'Module 6 — Incident Commander Capstone Simulation',
        subtitle: 'Live War Game Exam',
        description: 'Interactive high-pressure simulation evaluating crisis decision-making in real time.',
        order: 6,
        durationMinutes: 60,
        lessonsCount: 1,
        status: 'available',
        frameworkId: 'nistcsf'
      }
    ]
  },

  {
    id: 'audit-simulations',
    title: 'Audit Simulations',
    roleTarget: 'Lead Auditor / Senior GRC Director / Accreditation Assessor',
    description: 'Step into the shoes of an external Big Four lead auditor in an interactive, time-pressured compliance inspection simulation.',
    level: 'Expert',
    difficulty: 'Expert',
    estimatedTime: '10 Hours',
    estimatedHours: 10,
    modulesCount: 5,
    progressPercentage: 0,
    estimatedWeeks: 3,
    modulesIncluded: [{ frameworkId: 'soc2', moduleId: 'soc2-mod-1' }],
    milestones: [
      'Conduct a live auditor walkthrough testing change management controls',
      'Inspect sampling records for evidence of tampering or retrofitted approvals',
      'Evaluate third-party subservice organization SOC reports (Carve-out vs Inclusive)',
      'Draft and issue a formal Independent Service Auditor Report'
    ],
    overview: {
      whatYouWillLearn: [
        'The mindset, standards (SSAE 18, ISAE 3000, ISO 19011), and forensic techniques of elite external auditors',
        'How auditors spot manufactured or retroactive evidence',
        'Evaluating User Entity Controls (CUECs) and Complementary Subservice Organization Controls (CSOCs)',
        'Issuing Unqualified, Qualified, Adverse, or Disclaimer audit opinions'
      ],
      whyItMatters: 'The best compliance leaders understand how auditors think. By learning how to audit systems with forensic skepticism, you can bulletproof your own compliance program.',
      learningObjectives: [
        'Execute rigorous control testing without accepting ambiguous verbal assurances',
        'Identify deceptive evidence practices and control circumvention',
        'Author defensible audit opinions that withstand peer review scrutiny'
      ],
      estimatedCompletionTime: '10 Hours (Self-paced)',
      difficulty: 'Expert'
    },
    curriculumModules: [
      {
        id: 'as-mod-1',
        title: 'Module 1 — The Auditor Perspective & Forensic Skepticism',
        subtitle: 'Auditor Professional Ethics',
        description: 'ISAE 3000, AICPA Attestation Standards, and independent skepticism.',
        order: 1,
        durationMinutes: 80,
        lessonsCount: 3,
        status: 'current',
        frameworkId: 'soc2'
      },
      {
        id: 'as-mod-2',
        title: 'Module 2 — Rigorous Control Testing & Deception Detection',
        subtitle: 'Spotting Retroactive Evidence',
        description: 'Inspecting Git commit timestamps, Jira ticket audit histories, and Okta system logs for tampering.',
        order: 2,
        durationMinutes: 90,
        lessonsCount: 4,
        status: 'available',
        frameworkId: 'iso27001'
      },
      {
        id: 'as-mod-3',
        title: 'Module 3 — Evaluating Subservice Organizations & Carve-Outs',
        subtitle: 'Third-Party Attestations',
        description: 'Reviewing AWS and GCP SOC 2 reports and evaluating client-side user entity controls (CUECs).',
        order: 3,
        durationMinutes: 80,
        lessonsCount: 3,
        status: 'available',
        frameworkId: 'soc2'
      },
      {
        id: 'as-mod-4',
        title: 'Module 4 — Formulating Audit Opinions & Deficiencies',
        subtitle: 'Unqualified vs Qualified',
        description: 'Structuring formal audit findings, management responses, and issuing the final opinion.',
        order: 4,
        durationMinutes: 75,
        lessonsCount: 3,
        status: 'available',
        frameworkId: 'soc2'
      },
      {
        id: 'as-mod-5',
        title: 'Module 5 — Lead Auditor Interactive Exam Simulation',
        subtitle: 'Final Auditor Examination',
        description: 'Interactive examination challenging the learner to find 5 hidden control failures in an audit file.',
        order: 5,
        durationMinutes: 60,
        lessonsCount: 1,
        status: 'available',
        frameworkId: 'soc2'
      }
    ]
  },

  {
    id: 'risk-case-studies',
    title: 'Risk Case Studies',
    roleTarget: 'Enterprise Risk Director / Chief Compliance Officer / Security Fellow',
    description: 'Critical post-mortem analysis of catastrophic enterprise GRC failures (e.g., SolarWinds, Capital One, Equifax) and structural lessons learned.',
    level: 'Expert',
    difficulty: 'Expert',
    estimatedTime: '8 Hours',
    estimatedHours: 8,
    modulesCount: 4,
    progressPercentage: 0,
    estimatedWeeks: 2,
    modulesIncluded: [{ frameworkId: 'nistcsf', moduleId: 'nist-mod-1' }],
    milestones: [
      'Analyze the SolarWinds build pipeline compromise and supply chain governance lessons',
      'Examine the Capital One SSRF WAF bypass and IAM role permission boundary failures',
      'Deconstruct the Equifax Apache Struts patch management and asset inventory breakdown',
      'Pass the Structural Risk Post-Mortem Assessment'
    ],
    overview: {
      whatYouWillLearn: [
        'Detailed architectural post-mortems of landmark cybersecurity breaches',
        'Why compliant organizations still get breached: The dangerous gap between compliance checkboxes and actual security posture',
        'Failures of governance: Siloed security teams, unheeded risk registers, and missing executive accountability',
        'How to translate historic industry catastrophes into defensible architectural reforms'
      ],
      whyItMatters: 'History is the greatest teacher in cybersecurity. Studying real-world multi-million dollar failures provides invaluable insight without paying the price of your own breach.',
      learningObjectives: [
        'Identify common failure modes that bypass standard SOC 2 and ISO audits',
        'Design resilient controls that assume individual safeguards will fail',
        'Formulate persuasive executive briefings using historic case study evidence'
      ],
      estimatedCompletionTime: '8 Hours (Self-paced)',
      difficulty: 'Expert'
    },
    curriculumModules: [
      {
        id: 'rcs-mod-1',
        title: 'Module 1 — SolarWinds & Software Supply Chain Governance',
        subtitle: 'Build Pipeline Compromise',
        description: 'Sunburst backdoor, code signing certificate abuse, and NIST C-SCRM mandates.',
        order: 1,
        durationMinutes: 80,
        lessonsCount: 3,
        status: 'current',
        frameworkId: 'nistcsf'
      },
      {
        id: 'rcs-mod-2',
        title: 'Module 2 — Capital One & Cloud IAM Permission Boundaries',
        subtitle: 'SSRF & Instance Metadata',
        description: 'Deconstructing the AWS SSRF exploit, overly permissive IAM roles, and IMDSv2 defense.',
        order: 2,
        durationMinutes: 85,
        lessonsCount: 3,
        status: 'available',
        frameworkId: 'soc2'
      },
      {
        id: 'rcs-mod-3',
        title: 'Module 3 — Equifax & Patch Governance Breakdown',
        subtitle: 'Asset Visibility Failure',
        description: 'The 76-day unpatched Apache Struts vulnerability, missing SSL certificate renewals, and unencrypted customer data.',
        order: 3,
        durationMinutes: 80,
        lessonsCount: 3,
        status: 'available',
        frameworkId: 'cis-controls'
      },
      {
        id: 'rcs-mod-4',
        title: 'Module 4 — Case Study Synthesis & Executive Risk Defense',
        subtitle: 'Strategic Synthesis Exam',
        description: 'Comprehensive scenario exam challenging learners to identify and fix structural vulnerabilities.',
        order: 4,
        durationMinutes: 55,
        lessonsCount: 1,
        status: 'available',
        frameworkId: 'nistcsf'
      }
    ]
  },

  {
    id: 'compliance-program-design',
    title: 'Compliance Program Design',
    roleTarget: 'VP of Compliance / Head of Trust & Safety / Chief Information Security Officer',
    description: 'Design and scale a unified corporate compliance program from seed-stage startup through global public enterprise.',
    level: 'Expert',
    difficulty: 'Expert',
    estimatedTime: '14 Hours',
    estimatedHours: 14,
    modulesCount: 7,
    progressPercentage: 0,
    estimatedWeeks: 4,
    modulesIncluded: [{ frameworkId: 'iso27001', moduleId: 'iso-mod-1' }],
    milestones: [
      'Draft a formal Board-Approved Security & Compliance Charter',
      'Establish automated Continuous Compliance Monitoring (CCM) architecture',
      'Build scalable vendor risk management and customer assurance programs',
      'Complete the Global Compliance Program Blueprint'
    ],
    overview: {
      whatYouWillLearn: [
        'How to design, budget, and scale a multi-standard compliance department from scratch',
        'Selecting and implementing modern GRC platforms and automation tooling',
        'Managing cross-functional relationships with Engineering, Legal, Sales, HR, and Executive Leadership',
        'Transforming compliance from a cost center into an active sales enablement and revenue engine'
      ],
      whyItMatters: 'A well-designed compliance program accelerates enterprise sales cycles by 50%, builds investor confidence, and prevents costly regulatory disruptions.',
      learningObjectives: [
        'Architect an organizational compliance governance structure that scales seamlessly with company headcount',
        'Create self-service customer trust portals and automated security packet delivery',
        'Negotiate complex customer security addenda (CSAs) and enterprise master service agreements'
      ],
      estimatedCompletionTime: '14 Hours (Self-paced)',
      difficulty: 'Expert'
    },
    curriculumModules: [
      {
        id: 'cpd-mod-1',
        title: 'Module 1 — Strategic Governance & The Compliance Charter',
        subtitle: 'Establishing Authority',
        description: 'Defining departmental mandates, reporting lines, and board-level governance charters.',
        order: 1,
        durationMinutes: 80,
        lessonsCount: 3,
        status: 'current',
        frameworkId: 'iso27001'
      },
      {
        id: 'cpd-mod-2',
        title: 'Module 2 — Selecting & Implementing Modern GRC Automation',
        subtitle: 'Tooling & Architecture',
        description: 'Evaluating automated compliance platforms, API integrations, and cloud posture tooling.',
        order: 2,
        durationMinutes: 90,
        lessonsCount: 4,
        status: 'available',
        frameworkId: 'soc2'
      },
      {
        id: 'cpd-mod-3',
        title: 'Module 3 — Designing the Common Control Framework (CCF)',
        subtitle: 'Harmonization Engineering',
        description: 'Building the cross-framework matrix across SOC 2, ISO 27001, HIPAA, GDPR, and NIST CSF.',
        order: 3,
        durationMinutes: 85,
        lessonsCount: 3,
        status: 'available',
        frameworkId: 'iso27001'
      },
      {
        id: 'cpd-mod-4',
        title: 'Module 4 — Customer Trust Centers & Sales Enablement',
        subtitle: 'Compliance as Revenue',
        description: 'Building public trust centers, automating NDA executions, and speeding up RFP questionnaires.',
        order: 4,
        durationMinutes: 80,
        lessonsCount: 3,
        status: 'available',
        frameworkId: 'soc2'
      },
      {
        id: 'cpd-mod-5',
        title: 'Module 5 — Continuous Evidence Pipelines & Auditor Portals',
        subtitle: 'Eliminating Audit Scrambles',
        description: 'Building permanent, automated evidence vaults that external auditors access on demand.',
        order: 5,
        durationMinutes: 75,
        lessonsCount: 3,
        status: 'available',
        frameworkId: 'soc2'
      },
      {
        id: 'cpd-mod-6',
        title: 'Module 6 — Budgeting, Headcount & Vendor Optimization',
        subtitle: 'Managing the Department',
        description: 'Calculating compliance ROI, negotiating audit firm contracts, and managing staff.',
        order: 6,
        durationMinutes: 70,
        lessonsCount: 2,
        status: 'available',
        frameworkId: 'iso27001'
      },
      {
        id: 'cpd-mod-7',
        title: 'Module 7 — Compliance Program Design Capstone Exam',
        subtitle: 'Executive Defense Exam',
        description: 'Comprehensive simulation defending an end-to-end multi-million dollar compliance strategy.',
        order: 7,
        durationMinutes: 60,
        lessonsCount: 1,
        status: 'available',
        frameworkId: 'iso27001'
      }
    ]
  },

  {
    id: 'advanced-grc-strategy',
    title: 'Advanced GRC Strategy',
    roleTarget: 'Chief Information Security Officer (CISO) / Board Advisor / Partner',
    description: 'Align cybersecurity and compliance with corporate board fiduciary duties, ESG metrics, insurance underwriting, and enterprise valuation.',
    level: 'Expert',
    difficulty: 'Expert',
    estimatedTime: '12 Hours',
    estimatedHours: 12,
    modulesCount: 6,
    progressPercentage: 0,
    estimatedWeeks: 4,
    modulesIncluded: [{ frameworkId: 'iso27001', moduleId: 'iso-mod-1' }],
    milestones: [
      'Master SEC cybersecurity disclosure rules (Item 106 & Form 8-K)',
      'Align security controls with cyber insurance underwriting warranties',
      'Integrate AI Governance frameworks (ISO/IEC 42001 & NIST AI RMF)',
      'Pass the Strategic CISO Board Governance Examination'
    ],
    overview: {
      whatYouWillLearn: [
        'Board-level cybersecurity governance, director fiduciary liabilities, and SEC 4-day disclosure rules',
        'Navigating the cyber insurance market: Underwriting questions, warranty clauses, and uninsurable risks',
        'Emerging AI compliance: ISO/IEC 42001 (Artificial Intelligence Management System) and NIST AI Risk Management Framework',
        'Conducting M&A cybersecurity and compliance due diligence on acquisition targets'
      ],
      whyItMatters: 'Cybersecurity has transitioned from an IT concern to an executive fiduciary priority. Strategic GRC leadership directly influences enterprise valuation, insurance premiums, and director legal liability.',
      learningObjectives: [
        'Present cybersecurity and compliance metrics persuasively to board audit committees',
        'Negotiate optimal cyber insurance policy terms and coverage limits',
        'Establish governance guardrails for enterprise AI and Large Language Model (LLM) deployments'
      ],
      estimatedCompletionTime: '12 Hours (Self-paced)',
      difficulty: 'Expert'
    },
    curriculumModules: [
      {
        id: 'ags-mod-1',
        title: 'Module 1 — Boardroom Governance & SEC Disclosure Rules',
        subtitle: 'Fiduciary Duty & Transparency',
        description: 'Item 106 cybersecurity governance disclosures, Form 8-K 4-day material incident filings, and director liabilities.',
        order: 1,
        durationMinutes: 85,
        lessonsCount: 3,
        status: 'current',
        frameworkId: 'iso27001'
      },
      {
        id: 'ags-mod-2',
        title: 'Module 2 — Cyber Insurance Underwriting & Claims Strategy',
        subtitle: 'Risk Transfer Optimization',
        description: 'Underwriting questionnaires, warranty statements, ransomware exclusions, and claims recovery.',
        order: 2,
        durationMinutes: 80,
        lessonsCount: 3,
        status: 'available',
        frameworkId: 'nistcsf'
      },
      {
        id: 'ags-mod-3',
        title: 'Module 3 — AI Governance (ISO 42001 & NIST AI RMF)',
        subtitle: 'The Frontier of Compliance',
        description: 'Governing LLMs, data lineage, hallucination risks, bias mitigation, and AI safety testing.',
        order: 3,
        durationMinutes: 90,
        lessonsCount: 4,
        status: 'available',
        frameworkId: 'iso27001'
      },
      {
        id: 'ags-mod-4',
        title: 'Module 4 — M&A Cybersecurity & Compliance Due Diligence',
        subtitle: 'Acquisition Risk Scrutiny',
        description: 'Evaluating target technical debt, open-source license compliance, and hidden breach liabilities.',
        order: 4,
        durationMinutes: 80,
        lessonsCount: 3,
        status: 'available',
        frameworkId: 'soc2'
      },
      {
        id: 'ags-mod-5',
        title: 'Module 5 — Global Regulatory Convergence & Geopolitics',
        subtitle: 'Cross-Border Operations',
        description: 'Navigating EU NIS2, DORA, US Cyber Incident Reporting (CIRCIA), and cross-border data transfer treaties.',
        order: 5,
        durationMinutes: 85,
        lessonsCount: 3,
        status: 'available',
        frameworkId: 'gdpr'
      },
      {
        id: 'ags-mod-6',
        title: 'Module 6 — Strategic GRC Executive Board Simulation',
        subtitle: 'CISO Board Presentation Exam',
        description: 'Interactive examination delivering an executive board briefing on emerging risks, capital requests, and AI governance.',
        order: 6,
        durationMinutes: 60,
        lessonsCount: 1,
        status: 'available',
        frameworkId: 'iso27001'
      }
    ]
  }
];

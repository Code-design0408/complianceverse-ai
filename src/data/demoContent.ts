import { FrameworkItem, QuestionItem, BadgeItem, LearningPath, GapAssessmentItem } from '../types';
import { SUGGESTED_FRAMEWORK_VIDEOS } from './videoResources';
import { FRAMEWORK_DEEP_DIVES } from './frameworkDeepDives';
import { ENTERPRISE_LEARNING_PATHS } from './learningPathsData';
import { COMPREHENSIVE_QUESTION_BANK } from './assessmentQuestions';

const RAW_FRAMEWORKS: FrameworkItem[] = [
  {
    id: 'soc2',
    code: 'SOC 2',
    title: 'SOC 2 Type II (Trust Services Criteria)',
    shortName: 'SOC 2',
    category: 'Cloud & SaaS',
    version: '2022 TSC',
    description: 'AICPA reporting standard assessing controls relevant to Security, Availability, Processing Integrity, Confidentiality, and Privacy over an audit observation period.',
    overview: 'Service Organization Control 2 (SOC 2) Type II evaluates how a company protects customer data and how well those controls operate over time (typically 3 to 12 months). It is the gold standard for B2B SaaS and cloud service providers.',
    badgeIcon: 'ShieldCheck',
    color: '#7A0019',
    targetAudience: 'Cloud Architects, DevOps Engineers, GRC Analysts, Security Leads',
    totalControls: 64,
    xpReward: 500,
    modules: [
      {
        id: 'soc2-mod-1',
        frameworkId: 'soc2',
        title: 'Core Trust Services Criteria & Scoping',
        description: 'Understand the Common Criteria (Security), Availability, Confidentiality, Processing Integrity, and Privacy pillars.',
        order: 1,
        lessonIds: ['soc2-l1', 'soc2-l2'],
        xpReward: 100
      },
      {
        id: 'soc2-mod-2',
        frameworkId: 'soc2',
        title: 'Logical & Physical Access Controls (CC6)',
        description: 'MFA, RBAC, least privilege, just-in-time access, credential management, and physical perimeter controls.',
        order: 2,
        lessonIds: ['soc2-l3', 'soc2-l4'],
        xpReward: 100
      },
      {
        id: 'soc2-mod-3',
        frameworkId: 'soc2',
        title: 'Change Management & System Operations (CC8 & CC7)',
        description: 'Peer reviews, CI/CD automated gates, vulnerability scanning, continuous monitoring, and incident response.',
        order: 3,
        lessonIds: ['soc2-l5'],
        xpReward: 100
      }
    ],
    lessons: [
      {
        id: 'soc2-l1',
        moduleId: 'soc2-mod-1',
        frameworkId: 'soc2',
        title: 'Understanding Type I vs Type II Audits',
        estimatedMinutes: 8,
        difficulty: 'Beginner',
        summary: 'Explore the fundamental difference between point-in-time design suitability (Type I) and historical operational effectiveness (Type II).',
        bodyMarkdown: `
### What is SOC 2?
SOC 2 is an auditing procedure developed by the American Institute of CPAs (AICPA) that ensures service providers securely manage data to protect the interests of their organization and the privacy of their clients.

### Type I vs Type II: The Fundamental Distinction
- **SOC 2 Type I**: Reports on the *design suitability* of controls at a **single point in time** (e.g., as of June 30th). Auditors review policies, architecture diagrams, and control configurations to confirm that controls are properly specified.
- **SOC 2 Type II**: Reports on both the *design* and the **operating effectiveness** of controls over a testing period (typically **3, 6, or 12 months**). Auditors test operational evidence across the entire timeframe (e.g., sample pull of 25 access request tickets across 6 months).

> 💡 **Audit Insight:** Enterprise buyers nearly universally demand a Type II report before signing procurement contracts, because it proves your team actually adhered to security policies continuously, rather than just staging a snapshot on a single day.

### The 5 Trust Services Criteria (TSC)
1. **Security (Common Criteria - Mandatory)**: Firewalls, intrusion detection, MFA, vulnerability management.
2. **Availability (Optional)**: Disaster recovery, SLAs, data center redundancy, uptime monitoring.
3. **Confidentiality (Optional)**: Encryption at rest and in transit, NDA controls, sensitive data disposal.
4. **Processing Integrity (Optional)**: Quality assurance, data processing accuracy, batch reconciliation.
5. **Privacy (Optional)**: Notice, consent, collection limits, and subject access rights aligned with AICPA GAPP.
        `,
        keyTakeaways: [
          'Type I is a point-in-time design check; Type II tests operating effectiveness over a 3-12 month observation window.',
          'Common Criteria (Security / CC Series) is mandatory for every SOC 2 report.',
          'Enterprise procurement teams typically require Type II attestation before onboarding SaaS vendors.'
        ],
        securityControls: ['CC1.1 Control Environment', 'CC2.1 Communication & Information', 'CC5.1 Control Activities'],
        caseStudy: {
          title: 'FinTech Startup Procurement Delay',
          scenario: 'A Series A SaaS platform lost a $400k enterprise deal because they only held a SOC 2 Type I report. The customer security review team required at least a 6-month continuous Type II report showing no access policy exceptions.',
          lessonLearned: 'Start Type II observation period at least 6 months prior to peak sales season to avoid procurement bottlenecks.'
        },
        checkpointQuestion: {
          question: 'What is the primary factor that distinguishes a SOC 2 Type II audit from a SOC 2 Type I audit?',
          options: [
            'Type II tests operational effectiveness of controls over an extended observation window.',
            'Type II only checks physical data center security.',
            'Type II is conducted by government regulators rather than certified CPA firms.',
            'Type II replaces the Security Common Criteria with ISO 9001 quality metrics.'
          ],
          correctIndex: 0,
          explanation: 'SOC 2 Type II audits evaluate the operational effectiveness of controls over a designated time period (usually 3 to 12 months), whereas Type I only examines control design at a single point in time.'
        },
        xpReward: 50
      },
      {
        id: 'soc2-l2',
        moduleId: 'soc2-mod-1',
        frameworkId: 'soc2',
        title: 'Trust Services Criteria: Scoping Strategy',
        estimatedMinutes: 10,
        difficulty: 'Intermediate',
        summary: 'Learn how to strategically select TSC categories to optimize audit timelines, cost, and buyer trust.',
        bodyMarkdown: `
### Strategic Scoping for SOC 2
Over-scoping your first SOC 2 audit can double audit costs and increase control failure risks. Under-scoping can result in prospective buyers requesting custom audits or additional reports.

### When to Include Specific Criteria:
- **Security (Common Criteria CC1 - CC9)**: Mandatory for all audits. Covers access controls, change management, incident response, risk management, and organization structure.
- **Availability (A1 Series)**: Essential if your SaaS contracts have 99.9%+ Uptime SLAs, or if system downtime causes catastrophic client business interruption.
- **Confidentiality (C1 Series)**: Essential if you process proprietary IP, legal contracts, or non-public financial assets.
- **Processing Integrity (PI1 Series)**: Critical for financial transaction engines, e-commerce clearinghouses, or automated payroll processors.
- **Privacy (P1 - P8 Series)**: Best scoped if processing consumer PII where clients look for AICPA Privacy alignment (though GDPR/ISO 27701 are often preferred alternatives).
        `,
        keyTakeaways: [
          'All SOC 2 audits require the Common Criteria (Security).',
          'Add Availability if you guarantee uptime SLAs to customers.',
          'Start with Security + Confidentiality or Availability for Year 1, then expand in subsequent cycles.'
        ],
        securityControls: ['CC6.1 Logical Access', 'CC6.6 Network Security', 'A1.2 Environmental Protections'],
        checkpointQuestion: {
          question: 'Which Trust Services Criterion is legally mandatory in every single SOC 2 examination?',
          options: [
            'Processing Integrity',
            'Security (Common Criteria)',
            'Privacy',
            'Availability'
          ],
          correctIndex: 1,
          explanation: 'The Common Criteria (Security) is the foundational requirement in every SOC 2 report. The other four criteria are optional based on business scope.'
        },
        xpReward: 50
      },
      {
        id: 'soc2-l3',
        moduleId: 'soc2-mod-2',
        frameworkId: 'soc2',
        title: 'CC6: Logical Access Controls & Identity Lifecycle',
        estimatedMinutes: 12,
        difficulty: 'Intermediate',
        summary: 'Deep dive into user provisioning, offboarding timelines, multi-factor authentication enforcement, and quarterly access reviews.',
        bodyMarkdown: `
### Common Criteria 6.1 - 6.3: Identity & Access Management (IAM)
Identity is the security perimeter. Auditors scrutinize how employee and contractor accounts are created, modified, and terminated.

### The 4 Pillars of Audit-Ready IAM:
1. **Mandatory Multi-Factor Authentication (MFA)**: Enforced across all production environments, code repositories (GitHub/GitLab), cloud consoles (AWS/GCP/Azure), and corporate SSO (Google Workspace/Okta). Phishing-resistant FIDO2/WebAuthn is gold standard.
2. **Role-Based Access Control (RBAC) & Least Privilege**: Developers should not have permanent root or write access to production database clusters. Use Just-In-Time (JIT) elevation with automated expiration and session audit logs.
3. **Automated Deprovisioning (Offboarding SLA)**: All access must be revoked within **24 hours** of employee departure (many high-assurance organizations enforce 4 hours).
4. **Quarterly User Access Reviews (UAR)**: Management must review and document every active account on production systems at least once every 90 days, removing stale accounts and privilege creep.
        `,
        keyTakeaways: [
          'Offboarding SLAs (revocation within 24h) are among the most frequently failed SOC 2 audit points.',
          'Quarterly access reviews must have timestamped manager sign-offs and evidence tickets.',
          'MFA is mandatory without exception for any system touching customer data.'
        ],
        securityControls: ['CC6.1 Logical Access Security', 'CC6.2 User Registration & Revocation', 'CC6.3 Access Modification'],
        caseStudy: {
          title: 'The Orphaned Admin Account Audit Finding',
          scenario: 'During a SOC 2 Type II audit, the auditor sampled 10 former employees. One contractor who left in March still had an active AWS IAM user in October. The auditor flagged a formal Control Exception in the final report.',
          lessonLearned: 'Integrate HRIS webhooks directly into Identity Providers (SCIM) to automate immediate deprovisioning on termination.'
        },
        checkpointQuestion: {
          question: 'What is the standard compliance best practice frequency for performing User Access Reviews (UAR) on production systems under SOC 2 CC6?',
          options: [
            'Once every 5 years upon audit renewal',
            'At least quarterly (every 90 days) with documented sign-offs',
            'Only when an employee requests a promotion',
            'Never, as long as SSO is activated'
          ],
          correctIndex: 1,
          explanation: 'Quarterly access reviews (every 90 days) ensure stale credentials, role creep, and former contractor access are promptly caught and purged.'
        },
        xpReward: 50
      },
      {
        id: 'soc2-l4',
        moduleId: 'soc2-mod-2',
        frameworkId: 'soc2',
        title: 'CC6.6 & CC6.7: Encryption Standards & Key Management',
        estimatedMinutes: 9,
        difficulty: 'Advanced',
        summary: 'Enforcing AES-256 at rest, TLS 1.3 in transit, secrets management, and automated KMS key rotation.',
        bodyMarkdown: `
### Cryptographic Controls in SOC 2
Auditors verify that data is shielded against interception during transmission and unauthorized extraction at storage rest.

### In-Transit Encryption Requirements:
- Enforce **TLS 1.2 or TLS 1.3** across all public endpoints and internal service meshes.
- Disable legacy ciphers (SSLv3, TLS 1.0, TLS 1.1, RC4, 3DES).
- Implement HTTP Strict Transport Security (HSTS) with preloading.

### At-Rest Encryption Requirements:
- Production database volumes, object storage buckets (S3/GCS), and snapshot backups must be encrypted with **AES-256** or equivalent.
- Cloud KMS / HashiCorp Vault for key management with automated annual key rotation.
- Strict separation between secrets management and application source code (zero hardcoded secrets).
        `,
        keyTakeaways: [
          'Enforce TLS 1.2+ for data in transit; disable deprecated cryptographic suites.',
          'Encrypt all storage volumes, object stores, and database snapshots using AES-256.',
          'Rotate cryptographic keys on a documented schedule and audit key access logs.'
        ],
        securityControls: ['CC6.6 Boundary Protection', 'CC6.7 Data Transmission Protection'],
        checkpointQuestion: {
          question: 'Which TLS protocols should be explicitly disabled during an external vulnerability scan to comply with modern SOC 2 transmission security standards?',
          options: [
            'TLS 1.3 only',
            'SSLv3, TLS 1.0, and TLS 1.1',
            'HTTPS port 443',
            'None; older protocols should be retained for backward compatibility'
          ],
          correctIndex: 1,
          explanation: 'SSLv3, TLS 1.0, and TLS 1.1 have known cryptographic vulnerabilities (e.g., POODLE, BEAST) and must be disabled in favor of TLS 1.2 and TLS 1.3.'
        },
        xpReward: 50
      },
      {
        id: 'soc2-l5',
        moduleId: 'soc2-mod-3',
        frameworkId: 'soc2',
        title: 'CC8.1: Change Management & CI/CD Security',
        estimatedMinutes: 11,
        difficulty: 'Advanced',
        summary: 'Segregation of duties, mandatory peer code reviews, automated CI testing, and production deployment authorization.',
        bodyMarkdown: `
### Change Management Controls (CC8.1)
How does code move from a developer's laptop into production? Auditors test this workflow meticulously.

### The Standard Secure CI/CD Workflow:
1. **Feature Branching & Pull Requests**: Direct commits to the \`main\` / \`production\` branch are blocked via repository branch protection rules.
2. **Peer Review (Segregation of Duties)**: Every pull request must have at least one approved review from an authorized engineer who is *not* the author of the pull request.
3. **Automated Security Gates (SAST & Dependency Scanning)**: Static analysis (e.g., SonarQube, Semgrep) and software composition analysis (e.g., Snyk, Dependabot) run on each commit.
4. **Automated Unit & Integration Tests**: Builds must pass before merging.
5. **Auditable Deployment Logs**: Automated deployment pipelines (GitHub Actions, GitLab CI, ArgoCD) create tamper-evident deploy logs tied to commit SHA hashes.
        `,
        keyTakeaways: [
          'Branch protection rules enforcing peer review approvals prevent unauthorized code deployment.',
          'Segregation of duties requires that developers cannot approve their own pull requests.',
          'Automated CI/CD pipelines provide the immutable audit trail required by SOC 2 auditors.'
        ],
        securityControls: ['CC8.1 Change Authorization & Testing', 'CC7.1 Vulnerability Management'],
        checkpointQuestion: {
          question: 'Under SOC 2 CC8.1, what core requirement enforces segregation of duties in a Git repository?',
          options: [
            'Allowing developers to merge their own pull requests without review if it is an emergency',
            'Enforcing branch protection rules requiring at least one independent peer approval before merging',
            'Deleting commit logs after 30 days to protect code confidentiality',
            'Using HTTP Git remotes instead of SSH keys'
          ],
          correctIndex: 1,
          explanation: 'Branch protection requiring independent peer reviews ensures segregation of duties, preventing single individuals from deploying unverified code to production.'
        },
        xpReward: 50
      }
    ],
    controls: [
      { id: 'soc2-c1', code: 'CC1.1', title: 'Integrity and Ethical Values', domain: 'Control Environment', guidance: 'Board-approved Code of Ethics, annual employee ethics sign-off, disciplinary policies.' },
      { id: 'soc2-c2', code: 'CC2.1', title: 'Internal and External Communication', domain: 'Information & Communication', guidance: 'Whistleblower hotline, security responsibility documentation, customer security whitepapers.' },
      { id: 'soc2-c3', code: 'CC3.1', title: 'Risk Assessment Process', domain: 'Risk Assessment', guidance: 'Annual formal risk assessment, threat modeling, risk register reviewed by executive leadership.' },
      { id: 'soc2-c4', code: 'CC4.1', title: 'Monitoring Activities & Testing', domain: 'Monitoring Activities', guidance: 'Periodic internal audits, automated configuration drift alerts, annual penetration testing.' },
      { id: 'soc2-c5', code: 'CC5.1', title: 'Control Activities Implementation', domain: 'Control Activities', guidance: 'Documented policies and procedures for all technical security controls.' },
      { id: 'soc2-c6', code: 'CC6.1', title: 'Logical Access Security', domain: 'Logical Access', guidance: 'MFA on all systems, SSO integration, strict password policies, credential vaults.' },
      { id: 'soc2-c7', code: 'CC6.2', title: 'User Registration and Access Revocation', domain: 'Logical Access', guidance: 'Formal onboarding approvals, 24-hour offboarding SLA, automated SCIM provisioning.' },
      { id: 'soc2-c8', code: 'CC6.6', title: 'Network Boundary Protection', domain: 'Logical Access', guidance: 'WAF, DDoS mitigation, VPC subnet isolation, default-deny security groups, bastion hosts.' },
      { id: 'soc2-c9', code: 'CC7.1', title: 'Vulnerability Management', domain: 'System Operations', guidance: 'Weekly automated dependency scans, monthly container vulnerability scans, critical patch SLAs (14 days).' },
      { id: 'soc2-c10', code: 'CC7.3', title: 'Incident Detection & Response', domain: 'System Operations', guidance: '24/7 SIEM monitoring, documented IR runbooks, annual tabletop simulation exercises.' },
      { id: 'soc2-c11', code: 'CC8.1', title: 'Change Management & Peer Review', domain: 'Change Management', guidance: 'Branch protection, mandatory peer review approvals, automated CI/CD security pipelines.' },
      { id: 'soc2-c12', code: 'A1.2', title: 'Backup Redundancy & Recovery', domain: 'Availability', guidance: 'Cross-region automated daily database snapshots, annual Disaster Recovery recovery time objective (RTO) drill.' }
    ]
  },
  {
    id: 'iso27001',
    code: 'ISO 27001',
    title: 'ISO/IEC 27001:2022 (ISMS & Annex A)',
    shortName: 'ISO 27001',
    category: 'Security & Privacy',
    version: '2022 Revision',
    description: 'International standard for establishing, implementing, maintaining, and continually improving an Information Security Management System (ISMS).',
    overview: 'ISO/IEC 27001:2022 provides an internationally recognized risk-based blueprint. The 2022 revision restructured Annex A controls into 4 logical themes: Organizational (37), People (8), Physical (14), and Technological (34) controls.',
    badgeIcon: 'Award',
    color: '#A5002D',
    targetAudience: 'Chief Information Security Officers (CISOs), ISMS Managers, Security Auditors, Compliance Directors',
    totalControls: 93,
    xpReward: 500,
    modules: [
      {
        id: 'iso-mod-1',
        frameworkId: 'iso27001',
        title: 'Clauses 4-10: Management System Framework',
        description: 'Context of organization, leadership commitment, risk treatment methodology, internal audit, and management review.',
        order: 1,
        lessonIds: ['iso-l1', 'iso-l2'],
        xpReward: 100
      },
      {
        id: 'iso-mod-2',
        frameworkId: 'iso27001',
        title: 'Annex A: Technological & Organizational Controls',
        description: 'Threat intelligence (5.7), data masking (8.11), data leakage prevention (8.12), and secure coding (8.28).',
        order: 2,
        lessonIds: ['iso-l3'],
        xpReward: 100
      }
    ],
    lessons: [
      {
        id: 'iso-l1',
        moduleId: 'iso-mod-1',
        frameworkId: 'iso27001',
        title: 'ISMS Governance: Clauses 4 through 10',
        estimatedMinutes: 9,
        difficulty: 'Beginner',
        summary: 'Master the Plan-Do-Check-Act (PDCA) governance cycle that underpins ISO 27001 certification.',
        bodyMarkdown: `
### What is an ISMS?
An Information Security Management System (ISMS) is a systematic approach to managing sensitive company information so that it remains secure. It encompasses people, processes, and IT systems by applying a risk management process.

### The Mandatory Clauses (4 - 10):
- **Clause 4 - Context of the Organization**: Identifying internal/external issues, interested parties, and the ISMS boundary scope.
- **Clause 5 - Leadership**: Top management commitment, information security policy, and role assignments.
- **Clause 6 - Planning**: Risk assessment methodology, risk treatment plan, and measurable security objectives.
- **Clause 7 - Support**: Competence, security awareness training, resources, and documented information control.
- **Clause 8 - Operation**: Executing risk assessments and implementing the Statement of Applicability (SoA).
- **Clause 9 - Performance Evaluation**: Internal audits, monitoring metrics, and annual Management Review Meetings.
- **Clause 10 - Improvement**: Non-conformity tracking, corrective actions, and continual improvement.
        `,
        keyTakeaways: [
          'Clauses 4-10 are mandatory management system requirements that cannot be excluded.',
          'The Statement of Applicability (SoA) documents which Annex A controls apply and justifies exclusions.',
          'Annual Management Review Meetings and Internal Audits are required before external certification audits.'
        ],
        securityControls: ['Clause 5.1 Leadership', 'Clause 6.1 Risk Assessment', 'Clause 9.2 Internal Audit'],
        checkpointQuestion: {
          question: 'Can an organization seeking ISO/IEC 27001 certification exclude Clause 9 (Performance Evaluation) from its scope?',
          options: [
            'Yes, if approved by the CEO',
            'No, Clauses 4 through 10 are mandatory management system clauses and cannot be excluded',
            'Yes, if the organization has fewer than 50 employees',
            'Only if they replace it with SOC 2 CC4'
          ],
          correctIndex: 1,
          explanation: 'Clauses 4 through 10 of ISO/IEC 27001 are mandatory. An organization can only justify exclusions among the Annex A control set via the Statement of Applicability.'
        },
        xpReward: 50
      },
      {
        id: 'iso-l2',
        moduleId: 'iso-mod-1',
        frameworkId: 'iso27001',
        title: 'Statement of Applicability (SoA) & Risk Treatment',
        estimatedMinutes: 10,
        difficulty: 'Intermediate',
        summary: 'How to map identified risks to Annex A controls and document legal/contractual justifications in the SoA.',
        bodyMarkdown: `
### The Statement of Applicability (SoA)
The SoA is the central bridge between your risk assessment and the controls you put in place.

### Key Requirements of the SoA:
1. List all 93 controls from Annex A of ISO/IEC 27001:2022.
2. State whether each control is **Included** or **Excluded**.
3. Provide a clear justification for every inclusion (e.g., "Mitigates Risk R-04; Contractual Requirement").
4. Provide a clear justification for every exclusion (e.g., "Excluded: Organization operates 100% remote with no physical data centers").
5. State the implementation status of included controls (Implemented, In Progress, Planned).
        `,
        keyTakeaways: [
          'The SoA must cover all 93 Annex A controls.',
          'Exclusions require robust, documented justifications.',
          'External auditors use the SoA as the master checklist during Stage 1 and Stage 2 audits.'
        ],
        securityControls: ['Clause 6.1.3 Information Security Risk Treatment'],
        checkpointQuestion: {
          question: 'What is the primary function of the Statement of Applicability (SoA) in an ISO 27001 audit?',
          options: [
            'To list the salaries of all security staff',
            'To document which Annex A controls are included or excluded, along with justifications and implementation status',
            'To serve as the legal contract with the external auditor',
            'To store encrypted passwords of administrative accounts'
          ],
          correctIndex: 1,
          explanation: 'The SoA declares which Annex A controls apply to the organization, provides justifications for exclusions, and summarizes implementation status.'
        },
        xpReward: 50
      },
      {
        id: 'iso-l3',
        moduleId: 'iso-mod-2',
        frameworkId: 'iso27001',
        title: 'New 2022 Controls: Threat Intel & Data Masking',
        estimatedMinutes: 12,
        difficulty: 'Advanced',
        summary: 'Explore the 11 new controls introduced in the 2022 revision including A.5.7, A.8.11, A.8.12, A.8.28.',
        bodyMarkdown: `
### Key 2022 Additions in ISO 27001 Annex A:
1. **A.5.7 Threat Intelligence**: Information relating to information security threats shall be collected and analyzed to produce threat intelligence (e.g., commercial feeds, ISACs, CVE monitoring).
2. **A.5.23 Information Security for Cloud Services**: Clear processes for acquiring, using, managing, and exiting cloud services.
3. **A.5.30 ICT Readiness for Business Continuity**: Ensuring ICT systems can recover within specified recovery time objectives (RTO).
4. **A.8.9 Configuration Management**: Establishing, documenting, and enforcing secure baseline configurations (e.g., CIS benchmarks).
5. **A.8.10 Information Deletion**: Secure deletion of data when no longer required (data retention policies).
6. **A.8.11 Data Masking**: Pseudonymization and masking techniques for sensitive data in non-production environments.
7. **A.8.12 Data Leakage Prevention (DLP)**: Technical DLP measures applied to systems processing sensitive data.
8. **A.8.28 Secure Coding**: Secure software development principles applied to software engineering lifecycle.
        `,
        keyTakeaways: [
          'ISO 27001:2022 introduced 11 new controls reflecting modern cloud, threat intel, and secure SDLC practices.',
          'Control A.8.11 mandates data masking or obfuscation, especially in staging/testing environments.',
          'Control A.8.28 requires formal secure coding guidelines and automated static/dynamic code analysis.'
        ],
        securityControls: ['A.5.7 Threat Intelligence', 'A.8.11 Data Masking', 'A.8.12 Data Leakage Prevention', 'A.8.28 Secure Coding'],
        checkpointQuestion: {
          question: 'Which new ISO 27001:2022 control requires organizations to prevent real production customer PII from being used in testing/staging environments without obfuscation?',
          options: [
            'A.8.11 Data Masking',
            'A.5.7 Threat Intelligence',
            'A.7.4 Physical Security Monitoring',
            'A.6.2 Terms of Employment'
          ],
          correctIndex: 0,
          explanation: 'Control A.8.11 (Data Masking) requires data masking, pseudonymization, and obfuscation in non-production environments to protect sensitive information.'
        },
        xpReward: 50
      }
    ],
    controls: [
      { id: 'iso-c1', code: 'A.5.1', title: 'Policies for Information Security', domain: 'Organizational Controls', guidance: 'Information security policy and topic-specific policies defined, approved by management, and reviewed annually.' },
      { id: 'iso-c2', code: 'A.5.7', title: 'Threat Intelligence', domain: 'Organizational Controls', guidance: 'Collect and analyze cyber threat intelligence from reliable feeds and industry groups.' },
      { id: 'iso-c3', code: 'A.5.15', title: 'Access Control', domain: 'Organizational Controls', guidance: 'Rules to control physical and logical access based on business and security requirements.' },
      { id: 'iso-c4', code: 'A.5.23', title: 'Information Security for Cloud Services', domain: 'Organizational Controls', guidance: 'Define shared responsibility matrix and security standards for all cloud vendor usage.' },
      { id: 'iso-c5', code: 'A.6.1', title: 'Screening', domain: 'People Controls', guidance: 'Background verification checks on all candidates for employment in accordance with ethics and laws.' },
      { id: 'iso-c6', code: 'A.6.3', title: 'Information Security Awareness & Training', domain: 'People Controls', guidance: 'Mandatory onboarding training and recurring simulated phishing exercises.' },
      { id: 'iso-c7', code: 'A.7.1', title: 'Physical Security Perimeters', domain: 'Physical Controls', guidance: 'Security perimeters defined and used to protect areas containing sensitive information.' },
      { id: 'iso-c8', code: 'A.8.8', title: 'Management of Technical Vulnerabilities', domain: 'Technological Controls', guidance: 'Obtain information about technical vulnerabilities, evaluate exposure, and take appropriate mitigation.' },
      { id: 'iso-c9', code: 'A.8.11', title: 'Data Masking', domain: 'Technological Controls', guidance: 'Use pseudonymization, encryption, or synthetic data in testing and analytics.' },
      { id: 'iso-c10', code: 'A.8.12', title: 'Data Leakage Prevention', domain: 'Technological Controls', guidance: 'Implement DLP controls to detect and prevent unauthorized extraction of sensitive data.' },
      { id: 'iso-c11', code: 'A.8.28', title: 'Secure Coding', domain: 'Technological Controls', guidance: 'Enforce secure coding baselines, SAST/DAST scanning, and code review gates in SDLC.' }
    ]
  },
  {
    id: 'nistcsf',
    code: 'NIST CSF 2.0',
    title: 'NIST Cybersecurity Framework 2.0',
    shortName: 'NIST CSF',
    category: 'Governance & Risk',
    version: '2.0 (2024)',
    description: 'The premier US government cybersecurity blueprint covering Govern (GV), Identify (ID), Protect (PR), Detect (DE), Respond (RS), and Recover (RC).',
    overview: 'NIST CSF 2.0 released in 2024 introduces the foundational GOVERN (GV) function, emphasizing that cybersecurity risk management must be integrated directly into enterprise governance, supply chain, and executive decision-making.',
    badgeIcon: 'Layers',
    color: '#7A0019',
    targetAudience: 'Enterprise Security Executives, Risk Managers, Federal Contractors, Security Engineers',
    totalControls: 106,
    xpReward: 500,
    modules: [
      {
        id: 'nist-mod-1',
        frameworkId: 'nistcsf',
        title: 'The 6 Core Functions of NIST CSF 2.0',
        description: 'Understand the newly added GOVERN (GV) function alongside Identify, Protect, Detect, Respond, and Recover.',
        order: 1,
        lessonIds: ['nist-l1', 'nist-l2'],
        xpReward: 100
      }
    ],
    lessons: [
      {
        id: 'nist-l1',
        moduleId: 'nist-mod-1',
        frameworkId: 'nistcsf',
        title: 'The 6 Functions: From Govern to Recover',
        estimatedMinutes: 9,
        difficulty: 'Beginner',
        summary: 'Explore how the 6 functions organize cybersecurity activities across an organization lifecycle.',
        bodyMarkdown: `
### NIST CSF 2.0: The Hexagon of Defense
In February 2024, NIST officially published CSF 2.0. The most significant update is the addition of the **GOVERN (GV)** function.

### The 6 Core Functions:
1. **GOVERN (GV)**: Establish and monitor the organization's cybersecurity risk management strategy, cybersecurity supply chain risk, expectations, and policy.
2. **IDENTIFY (ID)**: Understand current cybersecurity risks to systems, people, assets, data, and capabilities.
3. **PROTECT (PR)**: Use safeguards to manage cybersecurity risks and protect critical infrastructure (IAM, data security, platform security).
4. **DETECT (DE)**: Find and analyze possible cybersecurity attacks and compromises in real-time (SIEM, EDR, anomaly detection).
5. **RESPOND (RS)**: Take action regarding a detected cybersecurity incident (containment, eradication, mitigation, forensics).
6. **RECOVER (RC)**: Restore assets and operations impacted by a cybersecurity incident (resilience, communication, lessons learned).
        `,
        keyTakeaways: [
          'NIST CSF 2.0 expanded from 5 to 6 functions by adding GOVERN (GV).',
          'Govern provides the overarching strategy informing all other five operational functions.',
          'NIST CSF is non-prescriptive, allowing organizations of all sizes to adapt it to their risk appetite.'
        ],
        securityControls: ['GV.OC Organizational Context', 'GV.RM Risk Management Strategy', 'PR.AA Identity Management'],
        checkpointQuestion: {
          question: 'What is the newest Core Function introduced in the NIST Cybersecurity Framework (CSF) 2.0 update?',
          options: [
            'ISOLATE (IS)',
            'GOVERN (GV)',
            'ENCRYPT (EN)',
            'MONITOR (MO)'
          ],
          correctIndex: 1,
          explanation: 'NIST CSF 2.0 added GOVERN (GV) as a sixth foundational function to emphasize that governance, supply chain oversight, and organizational strategy drive all cybersecurity operations.'
        },
        xpReward: 50
      },
      {
        id: 'nist-l2',
        moduleId: 'nist-mod-1',
        frameworkId: 'nistcsf',
        title: 'Cybersecurity Supply Chain Risk Management (C-SCRM)',
        estimatedMinutes: 11,
        difficulty: 'Intermediate',
        summary: 'Mitigate third-party vendor risks under NIST CSF 2.0 GV.SC categories.',
        bodyMarkdown: `
### Third-Party & Supply Chain Defense (GV.SC)
Recent major breaches (e.g., SolarWinds, MoveIT, Okta third-party breach) underscore that an organization is only as secure as its weakest vendor.

### 4 Essential C-SCRM Controls:
1. **Vendor Risk Classification (GV.SC-01)**: Classify suppliers based on their access to systems, source code, or confidential customer data.
2. **Contractual Security Requirements (GV.SC-05)**: Mandate incident notification SLAs (e.g., within 48 hours), right-to-audit clauses, and annual SOC 2 / ISO 27001 submissions.
3. **Continuous Supplier Monitoring (GV.SC-07)**: Monitor external attack surfaces and security ratings (e.g., BitSight/SecurityScorecard) for key vendors.
4. **Offboarding & Data Return/Destruction (GV.SC-08)**: Formal procedures to verify vendor data destruction upon contract expiration.
        `,
        keyTakeaways: [
          'Supply chain risk management is now a prominent component of the GOVERN function in NIST CSF 2.0.',
          'Vendors with access to sensitive infrastructure require contractual security commitments and breach notification SLAs.',
          'Continuous supplier security posture validation replaces one-time vendor questionnaires.'
        ],
        securityControls: ['GV.SC-01 Supply Chain Identification', 'GV.SC-05 Contractual Requirements', 'GV.SC-07 Supplier Monitoring'],
        checkpointQuestion: {
          question: 'Under NIST CSF 2.0 GV.SC, what is the best approach for managing third-party cloud vendor risk?',
          options: [
            'Assume all public cloud vendors are completely risk-free',
            'Establish tiered vendor classification, enforce contractual security requirements, and continuously assess supplier security posture',
            'Prohibit the use of all external software libraries and SaaS tools',
            'Conduct risk assessments only after a major breach occurs'
          ],
          correctIndex: 1,
          explanation: 'Effective C-SCRM requires classifying suppliers by criticality, establishing enforceable contractual security SLAs, and continuously monitoring their posture.'
        },
        xpReward: 50
      }
    ],
    controls: [
      { id: 'nist-c1', code: 'GV.OC-01', title: 'Organizational Context & Mission', domain: 'Govern', guidance: 'Understand organizational mission, stakeholder needs, and legal/regulatory requirements.' },
      { id: 'nist-c2', code: 'GV.SC-05', title: 'Cybersecurity Supply Chain Requirements', domain: 'Govern', guidance: 'Incorporate cybersecurity requirements into contracts with all third-party suppliers and partners.' },
      { id: 'nist-c3', code: 'ID.AM-01', title: 'Asset Inventory & Tracking', domain: 'Identify', guidance: 'Maintain complete and automated inventories of physical, virtual, and cloud computing assets.' },
      { id: 'nist-c4', code: 'PR.AA-01', title: 'Identities & Credentials Managed', domain: 'Protect', guidance: 'Manage identities for authorized users, services, and devices; enforce MFA everywhere.' },
      { id: 'nist-c5', code: 'PR.DS-01', title: 'Data-at-Rest Protection', domain: 'Protect', guidance: 'Protect data at rest using AES-256 encryption, access controls, and secure key vaults.' },
      { id: 'nist-c6', code: 'DE.CM-01', title: 'Continuous Network & System Monitoring', domain: 'Detect', guidance: 'Deploy SIEM and EDR agents to continuously monitor for anomalous traffic and malicious behaviors.' },
      { id: 'nist-c7', code: 'RS.MA-01', title: 'Incident Response Execution', domain: 'Respond', guidance: 'Execute incident response triage, containment, and communication plans when alarms trigger.' },
      { id: 'nist-c8', code: 'RC.RP-01', title: 'Recovery Plan Execution', domain: 'Recover', guidance: 'Execute tested disaster recovery plans to restore mission-critical systems and data integrity.' }
    ]
  },
  {
    id: 'hipaa',
    code: 'HIPAA',
    title: 'HIPAA Security & Privacy Rule',
    shortName: 'HIPAA',
    category: 'Healthcare',
    version: 'HITECH Omnibus',
    description: 'US Federal regulations governing the protection and security of Protected Health Information (PHI and ePHI).',
    overview: 'The Health Insurance Portability and Accountability Act (HIPAA) mandates Administrative, Physical, and Technical safeguards to guarantee the confidentiality, integrity, and availability of electronic protected health information (ePHI).',
    badgeIcon: 'Activity',
    color: '#4A0010',
    targetAudience: 'HealthTech Engineers, Healthcare Compliance Officers, Cloud Architects in Digital Health',
    totalControls: 42,
    xpReward: 500,
    modules: [
      {
        id: 'hipaa-mod-1',
        frameworkId: 'hipaa',
        title: 'HIPAA Security Rule: The 3 Safeguards',
        description: 'Administrative (§ 164.308), Physical (§ 164.310), and Technical (§ 164.312) Safeguards.',
        order: 1,
        lessonIds: ['hipaa-l1'],
        xpReward: 100
      }
    ],
    lessons: [
      {
        id: 'hipaa-l1',
        moduleId: 'hipaa-mod-1',
        frameworkId: 'hipaa',
        title: 'Technical Safeguards & BAA Requirements',
        estimatedMinutes: 10,
        difficulty: 'Intermediate',
        summary: 'Examine ePHI encryption, audit controls, emergency access, and Business Associate Agreements (BAAs).',
        bodyMarkdown: `
### What is ePHI?
Electronic Protected Health Information (ePHI) comprises any individually identifiable health data created, received, maintained, or transmitted by a Covered Entity (CE) or Business Associate (BA) in electronic media.

### HIPAA Security Rule: Technical Safeguards (§ 164.312):
1. **Access Control (§ 164.312(a))**: Unique user identification, emergency access ("break-glass") procedure, automatic logoff, and encryption/decryption.
2. **Audit Controls (§ 164.312(b))**: Mechanisms that record and examine activity in information systems that contain or use ePHI (who viewed which patient record and when).
3. **Integrity (§ 164.312(c))**: Policies to protect ePHI from improper alteration or destruction.
4. **Transmission Security (§ 164.312(e))**: Guard against unauthorized access to ePHI that is being transmitted over an electronic communications network (TLS 1.2+ mandatory).

### Business Associate Agreements (BAAs):
Any SaaS vendor, cloud provider (AWS, GCP, Azure), or sub-processor that creates, receives, maintains, or transmits ePHI on behalf of a healthcare entity **must execute a signed BAA** before touching data.
        `,
        keyTakeaways: [
          'Technical safeguards require unique user IDs, automatic logoff, audit trails, and encryption.',
          'BAAs are legally mandatory contracts binding third-party vendors to HIPAA compliance.',
          'Audit logs must capture every read/write/export event involving patient records.'
        ],
        securityControls: ['§ 164.312(a) Access Control', '§ 164.312(b) Audit Controls', '§ 164.502 BAAs'],
        checkpointQuestion: {
          question: 'What legal document must a SaaS company sign before storing or processing ePHI on behalf of a hospital or healthcare provider?',
          options: [
            'A Non-Disclosure Agreement (NDA) only',
            'A Business Associate Agreement (BAA)',
            'A Creative Commons License',
            'An IRS W-9 Form'
          ],
          correctIndex: 1,
          explanation: 'Under HIPAA regulations, a Business Associate Agreement (BAA) is legally required between a Covered Entity and any third-party service provider handling ePHI.'
        },
        xpReward: 50
      }
    ],
    controls: [
      { id: 'hipaa-c1', code: '§ 164.308(a)(1)', title: 'Security Management Process', domain: 'Administrative Safeguards', guidance: 'Conduct accurate and thorough risk assessments; implement risk management sanctions and review.' },
      { id: 'hipaa-c2', code: '§ 164.308(a)(7)', title: 'Contingency Plan', domain: 'Administrative Safeguards', guidance: 'Establish data backup, disaster recovery, and emergency mode operation plans.' },
      { id: 'hipaa-c3', code: '§ 164.310(a)(1)', title: 'Facility Access Controls', domain: 'Physical Safeguards', guidance: 'Limit physical access to electronic information systems and facilities where ePHI is housed.' },
      { id: 'hipaa-c4', code: '§ 164.312(a)(1)', title: 'Access Control & Unique User ID', domain: 'Technical Safeguards', guidance: 'Assign a unique name and/or number for identifying and tracking user identity in ePHI systems.' },
      { id: 'hipaa-c5', code: '§ 164.312(b)', title: 'Audit Controls', domain: 'Technical Safeguards', guidance: 'Hardware, software, and procedural mechanisms that record and examine access in ePHI systems.' },
      { id: 'hipaa-c6', code: '§ 164.312(e)(1)', title: 'Transmission Security', domain: 'Technical Safeguards', guidance: 'Implement technical security measures to guard against unauthorized access to ePHI in transit.' }
    ]
  },
  {
    id: 'pcidss',
    code: 'PCI-DSS v4.0',
    title: 'Payment Card Industry Data Security Standard v4.0',
    shortName: 'PCI-DSS',
    category: 'Financial & Payments',
    version: '4.0 (2024 Enforced)',
    description: 'Global standard for organizations that handle branded credit cards from major card schemes.',
    overview: 'PCI-DSS v4.0 establishes 12 core requirements designed to secure cardholder data (CHD) and the Cardholder Data Environment (CDE), with heightened emphasis on customized validation, MFA, and automated script management.',
    badgeIcon: 'CreditCard',
    color: '#7A0019',
    targetAudience: 'FinTech Architects, Payment Engineers, Security Assessors (QSAs), DevOps in E-Commerce',
    totalControls: 78,
    xpReward: 500,
    modules: [
      {
        id: 'pci-mod-1',
        frameworkId: 'pcidss',
        title: 'PCI-DSS 12 Core Requirements & Scoping',
        description: 'Network segmentation, protecting stored cardholder data, vulnerability management, and access controls.',
        order: 1,
        lessonIds: ['pci-l1'],
        xpReward: 100
      }
    ],
    lessons: [
      {
        id: 'pci-l1',
        moduleId: 'pci-mod-1',
        frameworkId: 'pcidss',
        title: 'CDE Scoping, Segmentation & Key v4.0 Requirements',
        estimatedMinutes: 10,
        difficulty: 'Advanced',
        summary: 'Learn how network segmentation reduces CDE scope and how PCI-DSS v4.0 tackles modern web skimming attacks.',
        bodyMarkdown: `
### What is the Cardholder Data Environment (CDE)?
The CDE encompasses the people, processes, and technologies that store, process, or transmit Cardholder Data (CHD) or Sensitive Authentication Data (SAD - e.g., CVV, PIN).

### The Power of Network Segmentation
Without network segmentation, your *entire corporate network* is considered in-scope for PCI audits. By using strict firewalls, isolated VLANs, and tokenization (e.g., Stripe Elements, Checkout iFrames), you can reduce audit scope to a tiny isolated enclave.

### Crucial PCI-DSS v4.0 Updates:
- **Requirement 6.4.3 (Script Management)**: All payment page scripts (e.g., Google Analytics, chat widgets) must be authorized, integrity-verified (Subresource Integrity - SRI), and inventoried to prevent Magecart web skimming.
- **Requirement 8.4.2 (Universal MFA)**: Multi-factor authentication is now mandatory for **all** access into the CDE, not just remote administrator access.
- **Requirement 3.4 (Primary Account Number - PAN Encryption)**: PAN must be rendered unreadable anywhere it is stored using strong cryptography, tokenization, or truncated one-way hashing.
        `,
        keyTakeaways: [
          'Network segmentation and tokenization radically shrink CDE audit scope and risk.',
          'Never store Sensitive Authentication Data (SAD/CVV) after transaction authorization.',
          'PCI-DSS v4.0 Requirement 6.4.3 mandates strict script integrity monitoring on payment pages.'
        ],
        securityControls: ['Req 1 Network Security', 'Req 3 Protect Stored CHD', 'Req 6.4.3 Script Management', 'Req 8.4.2 Universal MFA'],
        checkpointQuestion: {
          question: 'According to PCI-DSS rules, is an organization ever permitted to store Sensitive Authentication Data (such as the 3-digit CVV/CVC code) after transaction authorization?',
          options: [
            'Yes, as long as it is encrypted with AES-256',
            'No, storing SAD/CVV after authorization is strictly prohibited under any circumstances',
            'Yes, if the customer checks the "Remember Card" box',
            'Only if the database is hosted in AWS GovCloud'
          ],
          correctIndex: 1,
          explanation: 'PCI-DSS strictly prohibits the storage of Sensitive Authentication Data (SAD), including full magnetic stripe data, CAV2/CVC2/CVV2/CID, and PINs, after authorization has completed.'
        },
        xpReward: 50
      }
    ],
    controls: [
      { id: 'pci-c1', code: 'Req 1.2', title: 'Network Security Controls', domain: 'Network Security', guidance: 'Deploy and maintain firewalls and strict ingress/egress rules separating the CDE from untrusted networks.' },
      { id: 'pci-c2', code: 'Req 3.4', title: 'Render PAN Unreadable', domain: 'Protect Cardholder Data', guidance: 'Encrypt stored PAN with strong cryptography, keyed hashes, or secure tokenization.' },
      { id: 'pci-c3', code: 'Req 6.4.3', title: 'Payment Page Script Integrity', domain: 'Vulnerability Management', guidance: 'Maintain inventory and cryptographic hashes (SRI) of all JavaScript executing on payment pages.' },
      { id: 'pci-c4', code: 'Req 8.4.2', title: 'MFA for All CDE Access', domain: 'Access Control', guidance: 'Enforce MFA for all user accounts accessing the Cardholder Data Environment.' },
      { id: 'pci-c5', code: 'Req 10.2', title: 'Automated Audit Logging', domain: 'Monitoring & Testing', guidance: 'Log all user access to CHD, root/admin actions, and changes to identification mechanisms.' },
      { id: 'pci-c6', code: 'Req 11.3', title: 'Internal & External Vulnerability Scans', domain: 'Monitoring & Testing', guidance: 'Perform quarterly internal and ASV external vulnerability scans and annual penetration testing.' }
    ]
  },
  {
    id: 'gdpr',
    code: 'GDPR',
    title: 'GDPR & Global Privacy Framework',
    shortName: 'GDPR',
    category: 'Security & Privacy',
    version: 'Regulation (EU) 2016/679',
    description: 'European Union regulation on data protection and privacy in the EU and European Economic Area (EEA), with strict global extraterritorial reach.',
    overview: 'GDPR sets the benchmark for international privacy rights, covering lawful basis of processing, Data Protection Officers (DPO), Data Protection Impact Assessments (DPIA), 72-hour breach notifications, and Data Subject Rights.',
    badgeIcon: 'FileLock',
    color: '#A5002D',
    targetAudience: 'Privacy Engineers, Data Protection Officers (DPOs), Product Managers, Legal Tech Leads',
    totalControls: 38,
    xpReward: 500,
    modules: [
      {
        id: 'gdpr-mod-1',
        frameworkId: 'gdpr',
        title: 'Core Principles & Data Subject Rights',
        description: 'The 7 principles of Article 5, lawful bases of processing (Article 6), and user rights (Articles 15-22).',
        order: 1,
        lessonIds: ['gdpr-l1'],
        xpReward: 100
      }
    ],
    lessons: [
      {
        id: 'gdpr-l1',
        moduleId: 'gdpr-mod-1',
        frameworkId: 'gdpr',
        title: 'The 7 Principles, 72h Breach Rule & DPIAs',
        estimatedMinutes: 9,
        difficulty: 'Beginner',
        summary: 'Explore lawful bases, Right to Erasure, 72-hour regulatory breach reporting, and Data Protection by Design.',
        bodyMarkdown: `
### The 7 Core Principles (Article 5):
1. **Lawfulness, Fairness & Transparency**: Clear privacy notices and valid legal basis (e.g., Consent, Legitimate Interest, Contract).
2. **Purpose Limitation**: Data collected only for specified, explicit, and legitimate purposes.
3. **Data Minimisation**: Only collect data strictly necessary for the purpose.
4. **Accuracy**: Keeping personal data accurate and up to date.
5. **Storage Limitation**: Retain data only as long as necessary; enforce automated retention schedules.
6. **Integrity & Confidentiality**: Technical and organizational security (encryption, access control).
7. **Accountability**: The data controller must be able to demonstrate compliance.

### Key Operational Obligations:
- **72-Hour Breach Notification (Article 33)**: Data breaches presenting a risk to rights and freedoms of individuals must be reported to the supervisory authority within **72 hours** of becoming aware.
- **Data Subject Access Requests (DSARs)**: Fulfill user rights (Access, Rectification, Erasure/"Right to be Forgotten", Portability) within **30 days**.
- **Data Protection Impact Assessment (DPIA - Article 35)**: Mandatory before launching high-risk data processing activities (e.g., AI profiling, biometric identification).
        `,
        keyTakeaways: [
          'Supervisory authorities must be notified of qualifying breaches within 72 hours.',
          'Data minimisation requires capturing only the bare minimum fields needed for the transaction.',
          'DSAR requests (including deletion/erasure) must be honored within 30 days.'
        ],
        securityControls: ['Art 5 Principles', 'Art 32 Security of Processing', 'Art 33 Breach Notification', 'Art 35 DPIA'],
        checkpointQuestion: {
          question: 'Under GDPR Article 33, what is the statutory deadline for a Data Controller to notify the competent supervisory authority after becoming aware of a personal data breach?',
          options: [
            'Within 30 calendar days',
            'Within 72 hours',
            'Within 1 year during the annual audit',
            'Only if requested by the affected user'
          ],
          correctIndex: 1,
          explanation: 'GDPR Article 33 requires notification to the supervisory authority without undue delay and, where feasible, not later than 72 hours after having become aware of the personal data breach.'
        },
        xpReward: 50
      }
    ],
    controls: [
      { id: 'gdpr-c1', code: 'Art. 5(1)(c)', title: 'Data Minimisation', domain: 'Privacy Principles', guidance: 'Collect and process only personal data that is adequate, relevant, and limited to what is necessary.' },
      { id: 'gdpr-c2', code: 'Art. 25', title: 'Data Protection by Design & by Default', domain: 'System Engineering', guidance: 'Integrate privacy-enhancing technologies, encryption, and zero-default tracking into product architectures.' },
      { id: 'gdpr-c3', code: 'Art. 32', title: 'Security of Processing', domain: 'Security Controls', guidance: 'Implement technical and organizational measures including pseudonymization, encryption, and resilience testing.' },
      { id: 'gdpr-c4', code: 'Art. 33', title: '72-Hour Breach Notification', domain: 'Incident Management', guidance: 'Document incident response workflows to notify supervisory authorities within 72 hours of a breach.' },
      { id: 'gdpr-c5', code: 'Art. 35', title: 'Data Protection Impact Assessment (DPIA)', domain: 'Risk Assessment', guidance: 'Conduct DPIAs prior to implementing novel or high-risk data processing technologies.' }
    ]
  },
  {
    id: 'cis-controls',
    code: 'CIS Controls',
    title: 'CIS Critical Security Controls v8',
    shortName: 'CIS Controls',
    category: 'Cybersecurity',
    version: 'v8 (18 Safeguards)',
    description: 'Prioritized, prescriptive set of 18 cyber defense safeguards designed to mitigate the vast majority of enterprise attacks.',
    overview: 'The CIS Critical Security Controls (CIS Controls) v8 provide an actionable defense-in-depth blueprint organized into Implementation Groups (IG1, IG2, IG3), focusing on Asset Management, Access Control, Vulnerability Management, Security Monitoring, and Incident Response.',
    badgeIcon: 'ShieldCheck',
    color: '#00C896',
    targetAudience: 'SecOps Engineers, CISOs, System Administrators, Defense-in-Depth Architects',
    totalControls: 18,
    xpReward: 500,
    modules: [
      {
        id: 'cis-mod-1',
        frameworkId: 'cis-controls',
        title: 'Asset Management & Defense Hygiene (CIS 1 - 4)',
        description: 'Enterprise hardware inventory, authorized software management, data protection, and secure configuration baselines.',
        order: 1,
        lessonIds: ['cis-l1'],
        xpReward: 100
      },
      {
        id: 'cis-mod-2',
        frameworkId: 'cis-controls',
        title: 'Access, Vulnerability & Continuous Monitoring (CIS 5 - 10)',
        description: 'Account management, credential controls, automated vulnerability management, and centralized audit logging.',
        order: 2,
        lessonIds: ['cis-l2'],
        xpReward: 100
      }
    ],
    lessons: [
      {
        id: 'cis-l1',
        moduleId: 'cis-mod-1',
        frameworkId: 'cis-controls',
        title: 'Enterprise Asset Inventory & Secure Baselines',
        estimatedMinutes: 9,
        difficulty: 'Beginner',
        summary: 'Explore why asset visibility is the foundational prerequisite of all cybersecurity, and how CIS benchmarks prevent misconfigurations.',
        bodyMarkdown: `
### Why Asset Inventory Comes First (CIS 1 & 2)
You cannot protect what you do not know exists. Attackers routinely scan networks for rogue development servers, unmanaged IoT devices, and forgotten testing databases.

### Key Focus Areas:
- **CIS Control 1: Inventory and Control of Enterprise Assets**: Actively manage all connected physical devices, cloud workloads, and virtual machines.
- **CIS Control 2: Inventory and Control of Software Assets**: Enforce software whitelisting and remove unauthorized or end-of-life packages.
- **CIS Control 3: Data Protection**: Classify and encrypt sensitive records at rest and in transit.
- **CIS Control 4: Secure Configuration of Enterprise Assets and Software**: Establish hardened configuration baselines based on CIS Benchmarks.
        `,
        beginnerExplanation: 'Think of CIS Controls as the ultimate home inspection checklist: before you buy expensive smart alarms, you need to count every window and door, verify who has spare keys, and make sure the deadbolts actually work.',
        professionalExplanation: 'CIS Controls v8 organizes 153 Safeguards across 18 Controls, prioritized by Implementation Groups: IG1 (Essential Cyber Hygiene), IG2 (Enterprise IT), and IG3 (High-Assurance defense against targeted nation-state attacks).',
        realWorldExample: {
          title: 'Municipal Agency Asset Discovery',
          scenario: 'A municipal transit network suffered repeated brute-force attacks due to unmanaged testing servers deployed by external contractors.',
          implementation: 'Deployed passive network monitoring to catalog connected hardware (CIS 1) and pushed CIS Benchmark configuration profiles across all endpoints (CIS 4).',
          outcome: 'Discovered and isolated 34 shadow servers and achieved 99.4% compliance across CIS IG1 safeguards.',
          lessonLearned: 'Asset visibility must precede all other defense spending.'
        },
        keyTakeaways: [
          'CIS 1 and 2 require maintaining real-time inventories of all devices and software.',
          'CIS Benchmarks provide consensus-based security baselines for operating systems and cloud services.',
          'Implementation Group 1 (IG1) establishes foundational cyber hygiene for all businesses.'
        ],
        securityControls: ['CIS 1.1 Asset Inventory', 'CIS 2.1 Software Inventory', 'CIS 3.1 Data Classification', 'CIS 4.1 Secure Baselines'],
        checkpointQuestion: {
          question: 'According to CIS Controls v8, why are asset and software inventory placed as Controls 1 and 2?',
          options: [
            'Because hardware routers are the most expensive component of an IT budget',
            'Because an organization cannot defend or secure systems and software it does not know exist',
            'Because asset management is only required by government contractors',
            'Because software inventories replace the need for employee access controls'
          ],
          correctIndex: 1,
          explanation: 'Visibility is the cornerstone of cybersecurity. Without an accurate inventory of connected enterprise assets and software, defensive controls cannot be comprehensively deployed or audited.'
        },
        xpReward: 50
      },
      {
        id: 'cis-l2',
        moduleId: 'cis-mod-2',
        frameworkId: 'cis-controls',
        title: 'Vulnerability Management, Access Control & SIEM Monitoring',
        estimatedMinutes: 10,
        difficulty: 'Intermediate',
        summary: 'Master continuous vulnerability scanning, least-privilege account management, and centralized SIEM audit logging.',
        bodyMarkdown: `
### Tactical Cyber Defense Hygiene (CIS 5, 7, 8 & 17)
- **CIS Control 5: Account Management**: Assign unique accounts, mandate MFA, and immediately revoke credentials upon employee offboarding.
- **CIS Control 7: Continuous Vulnerability Management**: Perform recurring vulnerability scans, evaluate CVSS scores, and remediate critical patches within documented SLAs.
- **CIS Control 8: Audit Log Management**: Aggregate audit trails from firewalls, servers, and cloud identity providers into a centralized SIEM.
- **CIS Control 17: Incident Response Management**: Document, drill, and continuously refine an enterprise incident response plan.
        `,
        beginnerExplanation: 'CIS Controls 5, 7, and 8 are like routine physical checkups and blood tests: you constantly test for known weaknesses, revoke old access badges when staff leave, and keep security cameras recording 24/7.',
        professionalExplanation: 'Operationalizing CIS 5, 7, 8, and 17 closes the exploit window between zero-day public disclosure and weaponization, while establishing forensic telemetry for incident response.',
        realWorldExample: {
          title: 'Automated Remediation SLA Enforcement',
          scenario: 'A fintech engineering team suffered from vulnerability backlog sprawl with over 800 open CVEs.',
          implementation: 'Established automated vulnerability triage with 14-day SLAs for Critical/High CVSS vulnerabilities and integrated SIEM alerting.',
          outcome: 'Reduced Mean Time to Remediate (MTTR) from 64 days to 9 days.',
          lessonLearned: 'Vulnerability discovery without automated patch SLAs fails to protect systems.'
        },
        keyTakeaways: [
          'Continuous vulnerability management ensures unpatched CVEs are closed before attackers exploit them.',
          'Audit logging is useless without automated alerts and centralized time synchronization (NTP).',
          'Documented incident response runbooks must be tested annually via tabletop exercises.'
        ],
        securityControls: ['CIS 5.1 Account Management', 'CIS 7.1 Vulnerability Scanning', 'CIS 8.1 SIEM Logging', 'CIS 17.1 IR Plan'],
        checkpointQuestion: {
          question: 'What is the primary role of CIS Control 8 (Audit Log Management)?',
          options: [
            'To store copies of employee emails for marketing campaigns',
            'To collect, review, and retain audit logs of security events to detect attacks and support forensic investigations',
            'To automatically delete log files every 24 hours to save disk space',
            'To replace the need for firewall ingress filtering'
          ],
          correctIndex: 1,
          explanation: 'Audit Log Management ensures that detailed event logs are centralized, preserved, and reviewed, enabling real-time threat detection and post-incident digital forensics.'
        },
        xpReward: 50
      }
    ],
    controls: [
      { id: 'cis-c1', code: 'CIS 1.1', title: 'Establish Enterprise Asset Inventory', domain: 'Asset Management', guidance: 'Maintain an accurate, updated inventory of all enterprise assets with IP and MAC addresses.' },
      { id: 'cis-c2', code: 'CIS 2.1', title: 'Establish Software Inventory', domain: 'Asset Management', guidance: 'Actively manage software to ensure only authorized applications execute.' },
      { id: 'cis-c3', code: 'CIS 3.11', title: 'Encrypt Sensitive Data at Rest', domain: 'Data Protection', guidance: 'Render sensitive records unreadable using strong cryptography (AES-256).' },
      { id: 'cis-c4', code: 'CIS 5.1', title: 'Account Inventory & Least Privilege', domain: 'Access Control', guidance: 'Enforce centralized directory controls and least privilege access across all accounts.' },
      { id: 'cis-c5', code: 'CIS 7.1', title: 'Continuous Vulnerability Management', domain: 'Vulnerability Management', guidance: 'Conduct weekly automated vulnerability scans and adhere to remediation SLAs.' },
      { id: 'cis-c6', code: 'CIS 8.2', title: 'Collect & Centralize Audit Logs', domain: 'Security Monitoring', guidance: 'Transmit system and security events to a centralized SIEM repository with synchronized NTP time.' },
      { id: 'cis-c7', code: 'CIS 17.1', title: 'Designate Incident Response Personnel', domain: 'Incident Response', guidance: 'Assign key personnel and maintain tested IR runbooks for cyber crisis containment.' }
    ]
  }
];

export const INITIAL_FRAMEWORKS: FrameworkItem[] = RAW_FRAMEWORKS.map(fw => ({
  ...fw,
  suggestedVideos: SUGGESTED_FRAMEWORK_VIDEOS[fw.id] || [],
  deepDive: FRAMEWORK_DEEP_DIVES[fw.id]
}));

// Rich Curated Question Bank (80+ questions with complete options, correct answers, explanations, domains)
export const QUESTION_BANK: QuestionItem[] = [
  ...COMPREHENSIVE_QUESTION_BANK,
  // SOC 2 Questions
  {
    id: 'q-soc2-1',
    frameworkId: 'soc2',
    domain: 'Auditing & Scope',
    difficulty: 'Beginner',
    question: 'What is the primary distinction between a SOC 2 Type I and a SOC 2 Type II report?',
    options: [
      'Type I tests controls over an extended period (3-12 months), while Type II is a point-in-time assessment.',
      'Type I tests control design at a single point in time, while Type II evaluates operating effectiveness over a period of time.',
      'Type I is issued by ISO registrars, while Type II is issued by the PCI Security Standards Council.',
      'Type I is public, while Type II is legally restricted to government entities.'
    ],
    correctIndex: 1,
    explanation: 'SOC 2 Type I evaluates the suitability of control design on a specific date, while Type II evaluates both design and operating effectiveness over an observation period (usually 3 to 12 months).',
    sourceStandard: 'AICPA TSP Section 100'
  },
  {
    id: 'q-soc2-2',
    frameworkId: 'soc2',
    domain: 'Logical Access',
    difficulty: 'Intermediate',
    question: 'Which of the following is a mandatory requirement under SOC 2 Common Criteria 6.1 (Logical Access Controls)?',
    options: [
      'Multi-factor authentication (MFA) must be enforced for all users accessing sensitive infrastructure or customer data.',
      'All employees must change their passwords every 14 days regardless of complexity.',
      'Source code must be kept exclusively on local on-premise hard drives.',
      'Data centers must use retina biometrics at every internal hallway.'
    ],
    correctIndex: 0,
    explanation: 'MFA is a core requirement under CC6.1 for authenticating access to production environments, cloud consoles, and systems processing confidential data.',
    sourceStandard: 'SOC 2 CC6.1'
  },
  {
    id: 'q-soc2-3',
    frameworkId: 'soc2',
    domain: 'Change Management',
    difficulty: 'Intermediate',
    question: 'Under SOC 2 CC8.1, how should segregation of duties be enforced in a software development lifecycle?',
    options: [
      'Developers should have direct root SSH access to deploy code to production servers.',
      'Code merges to production branches must require mandatory independent peer review and automated CI validation.',
      'Change requests only need verbal approval during weekly standup meetings.',
      'Emergency hotfixes can bypass code reviews permanently without retrospective documentation.'
    ],
    correctIndex: 1,
    explanation: 'CC8.1 requires documented authorization, testing, and approval before deploying changes. Mandatory peer review on pull requests prevents unauthorized self-deployment.',
    sourceStandard: 'SOC 2 CC8.1'
  },
  {
    id: 'q-soc2-4',
    frameworkId: 'soc2',
    domain: 'System Operations',
    difficulty: 'Advanced',
    question: 'A SaaS company suffers a database outage caused by an unpatched known vulnerability. Which SOC 2 criterion was breached in operating effectiveness?',
    options: [
      'CC7.1 (Vulnerability Management and Timely Patching)',
      'P1.1 (Privacy Notice and Consent)',
      'PI1.2 (Data Input Verification)',
      'CC1.1 (Ethical Code of Conduct)'
    ],
    correctIndex: 0,
    explanation: 'CC7.1 requires the organization to identify, evaluate, and remediate vulnerabilities in a timely manner according to defined risk SLAs.',
    sourceStandard: 'SOC 2 CC7.1'
  },
  {
    id: 'q-soc2-5',
    frameworkId: 'soc2',
    domain: 'Logical Access',
    difficulty: 'Intermediate',
    question: 'What is the recommended SLA for deprovisioning user access upon employee termination to remain compliant with SOC 2 CC6.2?',
    options: [
      'Within 30 calendar days',
      'Within 24 hours (or immediate automated SCIM revocation)',
      'At the end of the fiscal quarter',
      'Only when the employee returns company hardware'
    ],
    correctIndex: 1,
    explanation: 'Standard SOC 2 audit criteria mandate revoking logical and physical access within 24 hours of employee separation to eliminate orphaned account risks.',
    sourceStandard: 'SOC 2 CC6.2'
  },
  {
    id: 'q-soc2-6',
    frameworkId: 'soc2',
    domain: 'Risk Assessment',
    difficulty: 'Beginner',
    question: 'How frequently must an organization conduct a formal cybersecurity risk assessment to satisfy SOC 2 CC3.1?',
    options: [
      'Once every 10 years',
      'At least annually, or following significant environmental or architectural changes',
      'Only after experiencing a confirmed ransomware incident',
      'Weekly by the junior developers'
    ],
    correctIndex: 1,
    explanation: 'SOC 2 CC3.1 requires organizations to identify and assess risks to achieving objectives at least annually and whenever major architectural changes occur.',
    sourceStandard: 'SOC 2 CC3.1'
  },

  // ISO 27001 Questions
  {
    id: 'q-iso-1',
    frameworkId: 'iso27001',
    domain: 'ISMS Governance',
    difficulty: 'Beginner',
    question: 'In ISO/IEC 27001:2022, which document maps identified risks to Annex A controls and provides justifications for inclusions and exclusions?',
    options: [
      'The Business Impact Analysis (BIA)',
      'The Statement of Applicability (SoA)',
      'The Master Service Agreement (MSA)',
      'The Disaster Recovery Plan (DRP)'
    ],
    correctIndex: 1,
    explanation: 'The Statement of Applicability (SoA) is the definitive mandatory document in ISO 27001 summarizing which Annex A controls apply, their implementation status, and justifications for any exclusions.',
    sourceStandard: 'ISO/IEC 27001 Clause 6.1.3'
  },
  {
    id: 'q-iso-2',
    frameworkId: 'iso27001',
    domain: 'Annex A Controls',
    difficulty: 'Intermediate',
    question: 'How many control themes exist in Annex A of the updated ISO/IEC 27001:2022 standard?',
    options: [
      '14 control domains with 114 controls',
      '4 control themes (Organizational, People, Physical, Technological) containing 93 controls',
      '10 control functions with 250 controls',
      '6 control categories aligned with NIST CSF'
    ],
    correctIndex: 1,
    explanation: 'ISO/IEC 27001:2022 consolidated Annex A from 14 domains (114 controls) into 4 themes with 93 controls: Organizational (37), People (8), Physical (14), and Technological (34).',
    sourceStandard: 'ISO/IEC 27001:2022 Annex A'
  },
  {
    id: 'q-iso-3',
    frameworkId: 'iso27001',
    domain: 'Technological Controls',
    difficulty: 'Advanced',
    question: 'Which new ISO 27001:2022 control explicitly requires organizations to collect, analyze, and communicate threat information regarding emerging cyber threats?',
    options: [
      'A.5.7 Threat Intelligence',
      'A.8.1 User Endpoint Devices',
      'A.6.4 Disciplinary Process',
      'A.7.2 Physical Entry Controls'
    ],
    correctIndex: 0,
    explanation: 'Control A.5.7 (Threat Intelligence) is a new 2022 control requiring organizations to gather and process threat intelligence to enhance proactive defenses.',
    sourceStandard: 'ISO/IEC 27001:2022 A.5.7'
  },
  {
    id: 'q-iso-4',
    frameworkId: 'iso27001',
    domain: 'Technological Controls',
    difficulty: 'Intermediate',
    question: 'Control A.8.11 (Data Masking) in ISO 27001:2022 is primarily designed to prevent which security risk?',
    options: [
      'Unintentional leakage of sensitive or personal data in test, development, and analytics environments',
      'DDoS volumetric attacks on web servers',
      'Physical theft of laptop power supplies',
      'Phishing emails sent to HR personnel'
    ],
    correctIndex: 0,
    explanation: 'Data masking (obfuscation, pseudonymization, hashing) ensures sensitive data is not exposed to developers or testers working in non-production environments.',
    sourceStandard: 'ISO/IEC 27001:2022 A.8.11'
  },
  {
    id: 'q-iso-5',
    frameworkId: 'iso27001',
    domain: 'ISMS Governance',
    difficulty: 'Beginner',
    question: 'Which clause in ISO/IEC 27001:2022 requires executive leadership to conduct periodic formal reviews of the ISMS?',
    options: [
      'Clause 4.1 (Context of the Organization)',
      'Clause 9.3 (Management Review)',
      'Clause 7.2 (Competence)',
      'Clause 10.1 (Continual Improvement)'
    ],
    correctIndex: 1,
    explanation: 'Clause 9.3 mandates that top management review the organization\'s ISMS at planned intervals to ensure its continuing suitability, adequacy, and effectiveness.',
    sourceStandard: 'ISO/IEC 27001 Clause 9.3'
  },

  // NIST CSF 2.0 Questions
  {
    id: 'q-nist-1',
    frameworkId: 'nistcsf',
    domain: 'Core Framework',
    difficulty: 'Beginner',
    question: 'What are the six Core Functions of the NIST Cybersecurity Framework 2.0 (NIST CSF 2.0)?',
    options: [
      'Govern, Identify, Protect, Detect, Respond, Recover',
      'Plan, Do, Check, Act, Monitor, Audit',
      'Prevent, Defend, Isolate, Destroy, Rebuild, Report',
      'Authenticate, Authorize, Audit, Encrypt, Backup, Restore'
    ],
    correctIndex: 0,
    explanation: 'NIST CSF 2.0 consists of six functions: Govern (GV), Identify (ID), Protect (PR), Detect (DE), Respond (RS), and Recover (RC).',
    sourceStandard: 'NIST CSF 2.0 (2024)'
  },
  {
    id: 'q-nist-2',
    frameworkId: 'nistcsf',
    domain: 'Govern Function',
    difficulty: 'Intermediate',
    question: 'Under NIST CSF 2.0, which category within the GOVERN function directly addresses risks posed by third-party suppliers, SaaS vendors, and software libraries?',
    options: [
      'GV.SC (Cybersecurity Supply Chain Risk Management)',
      'PR.DS (Data Security)',
      'DE.AE (Anomalies and Events)',
      'RC.RP (Recovery Planning)'
    ],
    correctIndex: 0,
    explanation: 'GV.SC focuses on cybersecurity supply chain risk management, ensuring suppliers and third-party partners meet defined security requirements.',
    sourceStandard: 'NIST CSF 2.0 GV.SC'
  },
  {
    id: 'q-nist-3',
    frameworkId: 'nistcsf',
    domain: 'Protect Function',
    difficulty: 'Intermediate',
    question: 'Which NIST CSF 2.0 subcategory covers implementing identity management, multi-factor authentication, and least-privilege access?',
    options: [
      'PR.AA (Identity Management, Authentication, and Access Control)',
      'ID.RA (Risk Assessment)',
      'RS.CO (Communications)',
      'GV.PO (Policy)'
    ],
    correctIndex: 0,
    explanation: 'PR.AA establishes safeguards for managing identities, credentials, authentication, and access authorizations.',
    sourceStandard: 'NIST CSF 2.0 PR.AA'
  },
  {
    id: 'q-nist-4',
    frameworkId: 'nistcsf',
    domain: 'Detect & Respond',
    difficulty: 'Advanced',
    question: 'What is the primary difference between the DETECT and RESPOND functions in NIST CSF?',
    options: [
      'Detect discovers potential attacks or anomalous events, while Respond executes containment, mitigation, and remediation actions.',
      'Detect is handled by external auditors, while Respond is handled exclusively by legal counsel.',
      'Detect applies only to physical hardware, while Respond applies only to cloud software.',
      'Detect is optional, while Respond is legally mandatory.'
    ],
    correctIndex: 0,
    explanation: 'Detect (DE) activities discover cybersecurity events in a timely manner; Respond (RS) activities take decisive action regarding a detected incident to contain impact.',
    sourceStandard: 'NIST CSF 2.0 DE & RS'
  },

  // HIPAA Questions
  {
    id: 'q-hipaa-1',
    frameworkId: 'hipaa',
    domain: 'Technical Safeguards',
    difficulty: 'Beginner',
    question: 'Under the HIPAA Security Rule (§ 164.312), what technical mechanism is required to automatically log off an inactive user terminal handling ePHI?',
    options: [
      'Automatic logoff control (§ 164.312(a)(2)(iii))',
      'Mandatory deletion of user accounts after 15 minutes',
      'Turning off server power at 5 PM',
      'Physical padlocks on keyboards'
    ],
    correctIndex: 0,
    explanation: 'HIPAA Technical Safeguards require electronic session termination (automatic logoff) after a predetermined time of inactivity to prevent unauthorized viewing of ePHI.',
    sourceStandard: '45 CFR § 164.312(a)(2)(iii)'
  },
  {
    id: 'q-hipaa-2',
    frameworkId: 'hipaa',
    domain: 'Administrative Safeguards',
    difficulty: 'Intermediate',
    question: 'What is a Business Associate Agreement (BAA) under HIPAA regulations?',
    options: [
      'A contract requiring third-party service providers who handle ePHI to implement HIPAA-compliant safeguards and report breaches.',
      'An employment contract for full-time hospital physicians.',
      'A software license agreement for Microsoft Windows.',
      'A medical insurance policy for hospital patients.'
    ],
    correctIndex: 0,
    explanation: 'A BAA is a legally binding contract that establishes a vendor\'s obligations to safeguard ePHI and adhere to HIPAA Privacy and Security rules.',
    sourceStandard: '45 CFR § 164.502(e)'
  },
  {
    id: 'q-hipaa-3',
    frameworkId: 'hipaa',
    domain: 'Breach Notification',
    difficulty: 'Advanced',
    question: 'Under the HIPAA Breach Notification Rule, when a breach affects 500 or more individuals in a state or jurisdiction, when must prominent media outlets be notified?',
    options: [
      'Without unreasonable delay and in no case later than 60 calendar days after breach discovery',
      'Within 2 years during annual tax filings',
      'Only if the affected individuals sue the hospital',
      'Never, media notification is strictly voluntary'
    ],
    correctIndex: 0,
    explanation: 'Covered entities must notify prominent media outlets without unreasonable delay and in no case later than 60 days following the discovery of a breach affecting 500+ individuals.',
    sourceStandard: '45 CFR § 164.406'
  },

  // PCI-DSS Questions
  {
    id: 'q-pci-1',
    frameworkId: 'pcidss',
    domain: 'Cardholder Data Protection',
    difficulty: 'Beginner',
    question: 'Which of the following data elements is defined as Sensitive Authentication Data (SAD) and CANNOT be retained after payment authorization under PCI-DSS?',
    options: [
      'Card Verification Code (CVV2 / CVC2 / CID)',
      'Cardholder Name',
      'Card Expiration Date',
      'Merchant Category Code'
    ],
    correctIndex: 0,
    explanation: 'PCI-DSS strictly prohibits the storage of Sensitive Authentication Data (including CVV/CVC, full magnetic stripe data, and PIN blocks) post-authorization.',
    sourceStandard: 'PCI-DSS v4.0 Requirement 3.2'
  },
  {
    id: 'q-pci-2',
    frameworkId: 'pcidss',
    domain: 'Vulnerability Management',
    difficulty: 'Advanced',
    question: 'What does Requirement 6.4.3 of PCI-DSS v4.0 mandate regarding scripts running in a consumer\'s browser on payment pages?',
    options: [
      'All scripts must be authorized, have their integrity assured (e.g., Subresource Integrity), and be documented in an inventory.',
      'Payment pages must not use JavaScript under any circumstances.',
      'Scripts may only be loaded from unverified third-party ad networks.',
      'Payment forms must be written in Flash or Silverlight.'
    ],
    correctIndex: 0,
    explanation: 'Req 6.4.3 protects against Magecart web skimming attacks by requiring merchants to inventory, authorize, and verify the integrity of all scripts loaded in payment page contexts.',
    sourceStandard: 'PCI-DSS v4.0 Req 6.4.3'
  },
  {
    id: 'q-pci-3',
    frameworkId: 'pcidss',
    domain: 'Access Control',
    difficulty: 'Intermediate',
    question: 'How does PCI-DSS v4.0 Requirement 8.4.2 expand multi-factor authentication (MFA) requirements compared to earlier versions?',
    options: [
      'MFA is now required for ALL user access into the Cardholder Data Environment (CDE), not just remote or administrative access.',
      'MFA is only required for users accessing from overseas.',
      'MFA is optional if the company uses passwords longer than 6 characters.',
      'MFA is eliminated in favor of biometric retinal scans.'
    ],
    correctIndex: 0,
    explanation: 'PCI-DSS v4.0 Req 8.4.2 mandates MFA for all accounts accessing the CDE, closing the loophole where internal non-admin users could bypass MFA.',
    sourceStandard: 'PCI-DSS v4.0 Req 8.4.2'
  },

  // GDPR Questions
  {
    id: 'q-gdpr-1',
    frameworkId: 'gdpr',
    domain: 'Incident Management',
    difficulty: 'Beginner',
    question: 'Under GDPR Article 33, what is the statutory deadline for a Data Controller to notify supervisory authorities of a personal data breach?',
    options: [
      'Without undue delay and, where feasible, within 72 hours of becoming aware of the breach',
      'Within 30 calendar days',
      'At the end of the fiscal quarter',
      'Only after completing full forensic analysis (up to 6 months)'
    ],
    correctIndex: 0,
    explanation: 'Article 33 mandates notifying the relevant data protection authority within 72 hours of becoming aware of a breach, unless the breach is unlikely to result in risk to individuals.',
    sourceStandard: 'GDPR Article 33'
  },
  {
    id: 'q-gdpr-2',
    frameworkId: 'gdpr',
    domain: 'Principles & Rights',
    difficulty: 'Intermediate',
    question: 'What is the Data Minimisation principle under GDPR Article 5(1)(c)?',
    options: [
      'Personal data collected must be adequate, relevant, and limited to what is necessary in relation to the purposes for which they are processed.',
      'Companies must store data on as few servers as possible.',
      'Organizations must delete all emails after 24 hours.',
      'Users are only allowed to have one user account per website.'
    ],
    correctIndex: 0,
    explanation: 'Data minimisation requires organizations to collect only the minimum personal data required to fulfill the stated business objective.',
    sourceStandard: 'GDPR Article 5(1)(c)'
  },
  {
    id: 'q-gdpr-3',
    frameworkId: 'gdpr',
    domain: 'Data Protection Impact',
    difficulty: 'Advanced',
    question: 'When is a Data Protection Impact Assessment (DPIA) legally mandatory under GDPR Article 35?',
    options: [
      'When processing is likely to result in a high risk to the rights and freedoms of individuals (e.g., large-scale AI profiling, biometric identification).',
      'Whenever an employee receives a salary increase.',
      'Only when requested by law enforcement in writing.',
      'Every time a customer visits the company homepage.'
    ],
    correctIndex: 0,
    explanation: 'Article 35 mandates a DPIA prior to initiating high-risk processing operations, such as systematic profiling, automated decision-making, or large-scale special category data processing.',
    sourceStandard: 'GDPR Article 35'
  }
];

// Unlockable Badges
export const INITIAL_BADGES: BadgeItem[] = [
  // LEARNING BADGES
  {
    id: 'badge-compliance-explorer',
    title: 'Compliance Explorer',
    description: 'Earned after completing your first structured enterprise learning path.',
    icon: 'Compass',
    category: 'learning',
    criteria: 'Complete 1 learning path.',
    xpReward: 50,
    targetCount: 1,
    metricType: 'paths'
  },
  {
    id: 'badge-knowledge-builder',
    title: 'Knowledge Builder',
    description: 'Earned after completing multiple compliance lessons across regulatory domains.',
    icon: 'BookOpen',
    category: 'learning',
    criteria: 'Complete 5 compliance lessons.',
    xpReward: 50,
    targetCount: 5,
    metricType: 'lessons'
  },
  {
    id: 'badge-framework-explorer',
    title: 'Framework Explorer',
    description: 'Earned after studying multiple frameworks across security, cloud, and privacy.',
    icon: 'Layers',
    category: 'learning',
    criteria: 'Study 3 distinct frameworks.',
    xpReward: 50,
    targetCount: 3,
    metricType: 'frameworks'
  },

  // ASSESSMENT BADGES
  {
    id: 'badge-assessment-starter',
    title: 'Assessment Starter',
    description: 'Completed your first formal timed practice assessment or certification mock.',
    icon: 'CheckSquare',
    category: 'assessment',
    criteria: 'Complete 1 assessment.',
    xpReward: 50,
    targetCount: 1,
    metricType: 'exams'
  },
  {
    id: 'badge-knowledge-master',
    title: 'Knowledge Master',
    description: 'Achieved an exemplary score above 80% on a compliance certification assessment.',
    icon: 'Award',
    category: 'assessment',
    criteria: 'Score 80% or higher on an assessment.',
    xpReward: 50,
    targetCount: 80,
    metricType: 'score'
  },
  {
    id: 'badge-assessment-expert',
    title: 'Assessment Expert',
    description: 'Demonstrated audit excellence by scoring 90% or higher on 2 or more assessments.',
    icon: 'Sparkles',
    category: 'assessment',
    criteria: 'Score 90% or higher on 2 assessments.',
    xpReward: 50,
    targetCount: 2,
    metricType: 'exams'
  },

  // CONSISTENCY BADGES
  {
    id: 'badge-consistent-learner',
    title: 'Consistent Learner',
    description: 'Maintained a disciplined compliance study streak for 3 consecutive calendar days.',
    icon: 'Flame',
    category: 'consistency',
    criteria: 'Maintain a 3-day learning streak.',
    xpReward: 50,
    targetCount: 3,
    metricType: 'streak'
  },
  {
    id: 'badge-7day-learner',
    title: '7-Day Learner',
    description: 'Completed continuous compliance and security education for 7 consecutive days.',
    icon: 'Flame',
    category: 'consistency',
    criteria: 'Maintain a 7-day learning streak.',
    xpReward: 50,
    targetCount: 7,
    metricType: 'streak'
  },
  {
    id: 'badge-30day-commitment',
    title: '30-Day Commitment',
    description: 'Achieved a legendary 30-day streak of dedicated daily compliance learning.',
    icon: 'Crown',
    category: 'consistency',
    criteria: 'Maintain a 30-day learning streak.',
    xpReward: 50,
    targetCount: 30,
    metricType: 'streak'
  },

  // SPECIALIST BADGES
  {
    id: 'badge-iso-explorer',
    title: 'ISO 27001 Explorer',
    description: 'Completed significant ISO/IEC 27001 management clauses and Annex A controls.',
    icon: 'ShieldCheck',
    category: 'specialist',
    criteria: 'Complete 3 ISO 27001 lessons.',
    xpReward: 50,
    targetCount: 3,
    metricType: 'specialist'
  },
  {
    id: 'badge-nist-navigator',
    title: 'NIST Navigator',
    description: 'Mastered the core functions of the NIST Cybersecurity Framework (CSF 2.0).',
    icon: 'SlidersHorizontal',
    category: 'specialist',
    criteria: 'Complete 3 NIST CSF lessons.',
    xpReward: 50,
    targetCount: 3,
    metricType: 'specialist'
  },
  {
    id: 'badge-privacy-advocate',
    title: 'Privacy Advocate',
    description: 'Mastered GDPR core principles, data subject rights, and privacy compliance requirements.',
    icon: 'Lock',
    category: 'specialist',
    criteria: 'Complete 2 GDPR/Privacy lessons.',
    xpReward: 50,
    targetCount: 2,
    metricType: 'specialist'
  },
  {
    id: 'badge-risk-hunter',
    title: 'Risk Hunter',
    description: 'Completed comprehensive risk management, threat profiling, and mitigation training.',
    icon: 'Target',
    category: 'specialist',
    criteria: 'Complete 2 Risk Management lessons.',
    xpReward: 50,
    targetCount: 2,
    metricType: 'specialist'
  },

  // PLATFORM & MILESTONE BADGES (Backwards compatibility)
  {
    id: 'badge-welcome',
    title: 'Compliance Cadet',
    description: 'Began the journey on ComplianceVerse AI and established your auditor profile.',
    icon: 'Compass',
    category: 'mastery',
    criteria: 'Initialize your auditor profile.',
    xpReward: 50
  },
  {
    id: 'badge-first-lesson',
    title: 'First Control Mastered',
    description: 'Completed your very first compliance lesson with full comprehension.',
    icon: 'BookOpen',
    category: 'learning',
    criteria: 'Complete 1 lesson.',
    xpReward: 50
  },
  {
    id: 'badge-soc2-scout',
    title: 'SOC 2 Specialist',
    description: 'Completed foundational Trust Services Criteria lessons in SOC 2 Type II.',
    icon: 'ShieldCheck',
    category: 'specialist',
    criteria: 'Complete 3 SOC 2 lessons.',
    xpReward: 50
  },
  {
    id: 'badge-iso-champion',
    title: 'ISO 27001 Champion',
    description: 'Mastered the core management clauses and Annex A controls of ISO/IEC 27001.',
    icon: 'Award',
    category: 'specialist',
    criteria: 'Complete all ISO 27001 lessons.',
    xpReward: 50
  },
  {
    id: 'badge-exam-pass',
    title: 'Certified Exam Passer',
    description: 'Scored 75% or higher on a timed MCQ compliance certification exam.',
    icon: 'CheckCircle2',
    category: 'assessment',
    criteria: 'Pass any exam assessment.',
    xpReward: 50
  },
  {
    id: 'badge-exam-perfect',
    title: 'Flawless Audit (100%)',
    description: 'Achieved a perfect 100% score on a Standard or Professional compliance exam.',
    icon: 'Sparkles',
    category: 'assessment',
    criteria: 'Achieve 100% score on an exam.',
    xpReward: 50
  },
  {
    id: 'badge-lead-auditor',
    title: 'Chief Compliance Officer',
    description: 'Reached 5,000+ XP and demonstrated mastery across multiple global frameworks.',
    icon: 'Crown',
    category: 'mastery',
    criteria: 'Reach 5,000+ total XP.',
    xpReward: 50
  }
];

// Learning Paths
export const LEARNING_PATHS: LearningPath[] = ENTERPRISE_LEARNING_PATHS;

// Initial Gap Assessment Items
export const INITIAL_GAP_ASSESSMENTS: GapAssessmentItem[] = [
  {
    id: 'gap-1',
    frameworkId: 'soc2',
    controlCode: 'CC6.1',
    controlTitle: 'Multi-Factor Authentication (MFA)',
    category: 'Access Control',
    status: 'fully_compliant',
    notes: 'Enforced via Okta SSO with FIDO2 hardware keys across all production and corporate tools.',
    riskLevel: 'Critical'
  },
  {
    id: 'gap-2',
    frameworkId: 'soc2',
    controlCode: 'CC6.2',
    controlTitle: 'Automated Deprovisioning (24h Offboarding)',
    category: 'Identity Lifecycle',
    status: 'partially_compliant',
    notes: 'HRIS integrated with SCIM for full-time employees, but contractor offboarding is currently manual via IT tickets.',
    riskLevel: 'High'
  },
  {
    id: 'gap-3',
    frameworkId: 'soc2',
    controlCode: 'CC8.1',
    controlTitle: 'Branch Protection & Peer Code Reviews',
    category: 'Change Management',
    status: 'fully_compliant',
    notes: 'GitHub branch protection enforces 1+ required approvals and passing CI security pipelines before merging.',
    riskLevel: 'High'
  },
  {
    id: 'gap-4',
    frameworkId: 'iso27001',
    controlCode: 'A.5.7',
    controlTitle: 'Threat Intelligence Ingestion',
    category: 'Threat Management',
    status: 'planned',
    notes: 'Evaluating automated MISP / CISA feeds for ingestion into SIEM.',
    riskLevel: 'Medium'
  },
  {
    id: 'gap-5',
    frameworkId: 'iso27001',
    controlCode: 'A.8.11',
    controlTitle: 'Data Masking in Non-Production Environments',
    category: 'Data Protection',
    status: 'not_started',
    notes: 'Staging environment currently uses partial customer database dump without synthetic masking.',
    riskLevel: 'High'
  },
  {
    id: 'gap-6',
    frameworkId: 'nistcsf',
    controlCode: 'GV.SC-05',
    controlTitle: 'Supply Chain Contractual Security Requirements',
    category: 'Supply Chain',
    status: 'partially_compliant',
    notes: 'Security review conducted for top-tier vendors; need standard BAA/DPA clauses across all tier-2 suppliers.',
    riskLevel: 'Medium'
  }
];

import { FrameworkVideoResource } from '../types';

export const SUGGESTED_FRAMEWORK_VIDEOS: Record<string, FrameworkVideoResource[]> = {
  soc2: [
    {
      id: 'vid-soc2-1',
      frameworkId: 'soc2',
      title: 'SOC 2 Compliance Masterclass: Type 1 vs Type 2 & Trust Services Criteria',
      channel: 'Cloud Security & GRC Hub',
      duration: '22:45',
      difficulty: 'Beginner',
      description: 'A complete breakdown of AICPA SOC 2 standards, explaining the Common Criteria (CC1 to CC9), observation periods, and how to prepare systems for CPA testing.',
      youtubeUrl: 'https://www.youtube.com/results?search_query=soc+2+compliance+type+1+vs+type+2+explained+tutorial',
      keyTopics: ['Trust Services Criteria (TSC)', 'Type 1 vs Type 2 Distinction', 'Audit Observation Window', 'CPA Attestation Process'],
      auditorTakeaway: 'Focus early on continuous evidence logging (CC6 & CC8) rather than point-in-time screenshots to ensure successful Type II operational testing.'
    },
    {
      id: 'vid-soc2-2',
      frameworkId: 'soc2',
      title: 'SOC 2 Common Criteria Deep Dive: CC6 Logical Access & MFA Enforcement',
      channel: 'Enterprise SecOps Guide',
      duration: '18:30',
      difficulty: 'Intermediate',
      description: 'Detailed technical walk-through of CC6.1 to CC6.8 access control requirements, role-based access control (RBAC), least privilege, and quarterly access reviews.',
      youtubeUrl: 'https://www.youtube.com/results?search_query=soc+2+cc6+logical+access+controls+mfa+guide',
      keyTopics: ['CC6.1 Logical Access', 'Quarterly Access Reviews', 'Privileged Account Management', 'Automated Offboarding Evidence'],
      auditorTakeaway: 'Automate GitHub and AWS IAM user reviews to avoid manual sampling discrepancies during auditor population pulls.'
    },
    {
      id: 'vid-soc2-3',
      frameworkId: 'soc2',
      title: 'SOC 2 Change Management & CI/CD Pipeline Gates (CC8)',
      channel: 'DevSecOps & Compliance Daily',
      duration: '15:10',
      difficulty: 'Advanced',
      description: 'How to build compliance-ready GitHub Actions and GitLab CI workflows that enforce branch protection, peer reviews, SAST scans, and audit trail generation.',
      youtubeUrl: 'https://www.youtube.com/results?search_query=soc+2+change+management+cc8+cicd+pipeline+audit',
      keyTopics: ['CC8.1 Change Control', 'Branch Protection Rules', 'Automated Pull Request Evidence', 'Segregation of Duties'],
      auditorTakeaway: 'Ensure committers cannot approve their own pull requests to satisfy strict Segregation of Duties requirements.'
    },
    {
      id: 'vid-soc2-4',
      frameworkId: 'soc2',
      title: 'How to Pass a SOC 2 Audit on the First Try: Auditor Checklist & Pitfalls',
      channel: 'Lead Auditor Perspective',
      duration: '28:15',
      difficulty: 'Intermediate',
      description: 'Insights from practicing CPA auditors detailing the top 5 reasons startups receive qualified audit opinions and how to remediate control gaps.',
      youtubeUrl: 'https://www.youtube.com/results?search_query=how+to+pass+soc+2+audit+first+try+auditor+checklist',
      keyTopics: ['Audit Scoping Strategy', 'Evidence Population Sampling', 'Management Representation Letter', 'Handling Exceptions'],
      auditorTakeaway: 'Document exceptions immediately with corrective action plans; a disclosed exception with clear remediation is often accepted.'
    }
  ],
  iso27001: [
    {
      id: 'vid-iso-1',
      frameworkId: 'iso27001',
      title: 'ISO/IEC 27001:2022 Complete Standard Breakdown & Annex A Changes',
      channel: 'Global ISO Academy',
      duration: '31:20',
      difficulty: 'Beginner',
      description: 'Comprehensive overview of ISO 27001:2022 clauses 4-10 (ISMS Framework) and the 93 restructured Annex A controls grouped into 4 modern themes.',
      youtubeUrl: 'https://www.youtube.com/results?search_query=iso+27001+2022+annex+a+controls+complete+breakdown',
      keyTopics: ['Clauses 4-10 ISMS Structure', '93 Annex A Controls', 'Statement of Applicability (SoA)', '4 Control Themes (Organizational, People, Physical, Tech)'],
      auditorTakeaway: 'Understand that clauses 4-10 are mandatory; Annex A controls can be scoped out provided justification exists in the Statement of Applicability.'
    },
    {
      id: 'vid-iso-2',
      frameworkId: 'iso27001',
      title: 'How to Build an Information Security Management System (ISMS) Step-by-Step',
      channel: 'GRC Simplified',
      duration: '25:40',
      difficulty: 'Intermediate',
      description: 'A practical, structured guide to establishing risk assessment methodologies, policy documentation, risk treatment plans (RTP), and internal audit cadences.',
      youtubeUrl: 'https://www.youtube.com/results?search_query=how+to+build+iso+27001+isms+step+by+step+guide',
      keyTopics: ['Risk Assessment Methodology', 'Risk Treatment Plan (RTP)', 'Management Review Meetings', 'Internal Audit Planning'],
      auditorTakeaway: 'Maintain recorded minutes and sign-offs for management review meetings; auditors check these first during Stage 1 assessments.'
    },
    {
      id: 'vid-iso-3',
      frameworkId: 'iso27001',
      title: 'ISO 27001:2022 New Controls: Threat Intelligence & Cloud Services Security',
      channel: 'Cyber Threat & Compliance',
      duration: '19:15',
      difficulty: 'Advanced',
      description: 'Deep dive into newly added controls: 5.7 Threat Intelligence, 5.23 Cloud Services Security, 8.9 Configuration Management, and 8.28 Secure Coding.',
      youtubeUrl: 'https://www.youtube.com/results?search_query=iso+27001+2022+new+controls+threat+intelligence+cloud',
      keyTopics: ['Control 5.7 Threat Intelligence', 'Control 5.23 Cloud Services', 'Control 8.9 Configuration Management', 'Control 8.28 Secure Coding'],
      auditorTakeaway: 'Leverage automated feeds (e.g. CISA KEV or vendor advisories) to document actionable threat intelligence processes.'
    }
  ],
  nist: [
    {
      id: 'vid-nist-1',
      frameworkId: 'nist',
      title: 'NIST Cybersecurity Framework (CSF) 2.0: The New GOVERN (GV) Function Explained',
      channel: 'NIST CSF Practitioner Channel',
      duration: '26:50',
      difficulty: 'Beginner',
      description: 'Learn why NIST added the Govern function to CSF 2.0 alongside Identify, Protect, Detect, Respond, and Recover, and how it impacts enterprise cybersecurity strategy.',
      youtubeUrl: 'https://www.youtube.com/results?search_query=nist+csf+2.0+govern+function+explained+tutorial',
      keyTopics: ['Govern (GV) Function', 'Identify, Protect, Detect, Respond, Recover', 'Implementation Tiers 1-4', 'Organizational Profiles'],
      auditorTakeaway: 'Use Community Profiles to benchmark your organization against sector-specific NIST guidelines.'
    },
    {
      id: 'vid-nist-2',
      frameworkId: 'nist',
      title: 'Conducting a Practical NIST CSF Risk Assessment & Maturity Scoring',
      channel: 'Cyber Risk Advisors',
      duration: '21:00',
      difficulty: 'Intermediate',
      description: 'Walkthrough of creating Current vs Target State profiles, measuring subcategory maturity scores, and prioritizing security investments using NIST CSF.',
      youtubeUrl: 'https://www.youtube.com/results?search_query=nist+csf+risk+assessment+maturity+scoring+walkthrough',
      keyTopics: ['Current vs Target Profiles', 'Subcategory Gap Scoring', 'Risk Prioritization Matrix', 'Executive Reporting'],
      auditorTakeaway: 'Focus on demonstrating progression from Tier 1 (Partial) to Tier 3 (Repeatable) with documented standard operating procedures.'
    },
    {
      id: 'vid-nist-3',
      frameworkId: 'nist',
      title: 'NIST SP 800-53 vs NIST CSF 2.0: Mapping and Implementation Strategy',
      channel: 'Federal & Commercial Security Insights',
      duration: '17:45',
      difficulty: 'Advanced',
      description: 'Understanding the relationship between NIST CSF high-level functions and NIST SP 800-53 Rev. 5 granular security and privacy control baselines.',
      youtubeUrl: 'https://www.youtube.com/results?search_query=nist+sp+800+53+vs+nist+csf+2.0+mapping',
      keyTopics: ['SP 800-53 Control Families', 'FedRAMP Baselines', 'Control Mapping Techniques', 'Continuous Diagnostics & Mitigation'],
      auditorTakeaway: 'Mapping CSF subcategories directly to SP 800-53 controls enables unified compliance across commercial and federal environments.'
    }
  ],
  hipaa: [
    {
      id: 'vid-hipaa-1',
      frameworkId: 'hipaa',
      title: 'HIPAA Security & Privacy Rules: Technical Safeguards for Developers & Cloud',
      channel: 'HealthTech Compliance Pro',
      duration: '24:10',
      difficulty: 'Beginner',
      description: 'A developer-centric guide to HIPAA 45 CFR Part 164. Technical Safeguards (164.312), ePHI encryption requirements, transmission security, and audit controls.',
      youtubeUrl: 'https://www.youtube.com/results?search_query=hipaa+security+rule+technical+safeguards+cloud+tutorial',
      keyTopics: ['45 CFR §164.312 Technical Safeguards', 'ePHI in Transit & At Rest', 'Audit Logging & Monitoring', 'Unique User Identification'],
      auditorTakeaway: 'Addressable specifications (such as encryption) still require formal risk-based justification if alternative measures are used.'
    },
    {
      id: 'vid-hipaa-2',
      frameworkId: 'hipaa',
      title: 'Business Associate Agreements (BAA) & Cloud Infrastructure Compliance (AWS/GCP/Azure)',
      channel: 'Cloud HIPAA Architecture',
      duration: '16:30',
      difficulty: 'Intermediate',
      description: 'How Business Associate Agreements work, shared responsibility models in public clouds, and HIPAA-eligible service configurations.',
      youtubeUrl: 'https://www.youtube.com/results?search_query=business+associate+agreement+baa+hipaa+aws+gcp+guide',
      keyTopics: ['BAA Execution & Scoping', 'Cloud Shared Responsibility for ePHI', 'Eligible Services Configuration', 'Subprocessor Management'],
      auditorTakeaway: 'Always execute a signed BAA with every SaaS or cloud vendor before routing or storing any Protected Health Information (PHI).'
    },
    {
      id: 'vid-hipaa-3',
      frameworkId: 'hipaa',
      title: 'HIPAA Breach Notification Rule: 60-Day Timeline & OCR Enforcement Analysis',
      channel: 'Healthcare Law & Compliance',
      duration: '14:50',
      difficulty: 'Advanced',
      description: 'Understanding HHS OCR breach determination protocols, the four-factor risk assessment, notification deadlines, and avoiding OCR monetary penalties.',
      youtubeUrl: 'https://www.youtube.com/results?search_query=hipaa+breach+notification+rule+ocr+enforcement+guide',
      keyTopics: ['Four-Factor Risk Assessment', '60-Day Individual Notification', 'HHS Wall of Shame Reporting', 'Corrective Action Plans (CAP)'],
      auditorTakeaway: 'Conduct and document the 4-factor risk assessment immediately whenever an unauthorized disclosure occurs.'
    }
  ],
  pci: [
    {
      id: 'vid-pci-1',
      frameworkId: 'pci',
      title: 'PCI-DSS v4.0 Complete Architecture & 12 Core Requirements Breakdown',
      channel: 'Payment Security Specialist',
      duration: '29:40',
      difficulty: 'Beginner',
      description: 'In-depth review of PCI-DSS v4.0 standard, the 6 core goals, 12 technical requirements, and customized approach options for modern fintech systems.',
      youtubeUrl: 'https://www.youtube.com/results?search_query=pci+dss+v4.0+12+requirements+architecture+tutorial',
      keyTopics: ['12 PCI-DSS Requirements', 'Defined vs Customized Approach', 'Targeted Risk Analysis (TRA)', 'MFA for all CDE Access'],
      auditorTakeaway: 'Under PCI-DSS 4.0, MFA is strictly mandatory for all access into the Cardholder Data Environment (CDE), not just remote access.'
    },
    {
      id: 'vid-pci-2',
      frameworkId: 'pci',
      title: 'Cardholder Data Environment (CDE) Scoping, Segmentation & Tokenization',
      channel: 'Fintech Security Engineer',
      duration: '21:15',
      difficulty: 'Intermediate',
      description: 'How proper network segmentation and tokenization architectures dramatically reduce PCI-DSS audit scope, lowering compliance overhead and risk.',
      youtubeUrl: 'https://www.youtube.com/results?search_query=pci+dss+cde+network+segmentation+scoping+tokenization',
      keyTopics: ['CDE Perimeter Isolation', 'Firewall Rule Reviews', 'Tokenization & iFrames', 'Annual Penetration Testing & Segmentation Proof'],
      auditorTakeaway: 'Conduct and document semi-annual penetration tests proving network segmentation prevents out-of-scope systems from reaching CDE assets.'
    },
    {
      id: 'vid-pci-3',
      frameworkId: 'pci',
      title: 'PCI-DSS 4.0 Requirement 6.4.3 & 11.6.1: E-commerce Script Security & Header Tampering',
      channel: 'Web AppSec & PCI Hub',
      duration: '18:00',
      difficulty: 'Advanced',
      description: 'Deep dive into anti-Magecart and script tampering requirements in PCI-DSS 4.0, Content Security Policy (CSP), and payment page integrity checks.',
      youtubeUrl: 'https://www.youtube.com/results?search_query=pci+dss+4.0+requirement+6.4.3+ecommerce+script+security',
      keyTopics: ['Requirement 6.4.3 Payment Page Scripts', 'Requirement 11.6.1 Tamper Detection', 'CSP & Subresource Integrity (SRI)', 'Script Authorization Inventories'],
      auditorTakeaway: 'Implement automated script inventory verification to satisfy Requirement 6.4.3 on checkout payment pages.'
    }
  ],
  gdpr: [
    {
      id: 'vid-gdpr-1',
      frameworkId: 'gdpr',
      title: 'EU GDPR & UK GDPR Masterclass: 7 Key Principles & Lawful Bases for Processing',
      channel: 'Data Privacy & Legal Tech',
      duration: '27:10',
      difficulty: 'Beginner',
      description: 'Master the fundamental tenets of GDPR (Article 5 principles: Lawfulness, Purpose Limitation, Minimisation, Accuracy, Storage, Integrity, Accountability) and the 6 Article 6 lawful bases.',
      youtubeUrl: 'https://www.youtube.com/results?search_query=gdpr+data+privacy+7+principles+lawful+basis+explained',
      keyTopics: ['7 Core Privacy Principles', 'Article 6 Lawful Bases', 'Consent vs Legitimate Interests', 'Accountability Principle Evidence'],
      auditorTakeaway: 'Document the specific lawful basis in your Record of Processing Activities (RoPA) before beginning user data collection.'
    },
    {
      id: 'vid-gdpr-2',
      frameworkId: 'gdpr',
      title: 'How to Conduct a Data Protection Impact Assessment (DPIA) & Maintain Article 30 Records',
      channel: 'Privacy Officers Network',
      duration: '22:30',
      difficulty: 'Intermediate',
      description: 'A step-by-step methodology for executing DPIAs for high-risk data processing, AI systems, automated profiling, and maintaining Article 30 RoPA documents.',
      youtubeUrl: 'https://www.youtube.com/results?search_query=how+to+conduct+dpia+gdpr+article+30+ropa+guide',
      keyTopics: ['DPIA Triggers & Methodology', 'Risk Mitigation Actions', 'Article 30 RoPA Maintenance', 'DPO Consultation Workflows'],
      auditorTakeaway: 'A DPIA is legally mandatory prior to deploying automated decision-making or processing sensitive special-category data at scale.'
    },
    {
      id: 'vid-gdpr-3',
      frameworkId: 'gdpr',
      title: 'GDPR Cross-Border Data Transfers: Standard Contractual Clauses (SCCs) & Transfer Impact Assessments (TIA)',
      channel: 'International Privacy Bar',
      duration: '20:15',
      difficulty: 'Advanced',
      description: 'Navigating post-Schrems II requirements, EU-US Data Privacy Framework, standard contractual clauses, supplementary technical safeguards, and transfer risk assessments.',
      youtubeUrl: 'https://www.youtube.com/results?search_query=gdpr+cross+border+data+transfers+scc+tia+tutorial',
      keyTopics: ['EU-US Data Privacy Framework', 'Standard Contractual Clauses (SCC)', 'Transfer Impact Assessments (TIA)', 'Supplementary Technical Measures'],
      auditorTakeaway: 'Ensure end-to-end encryption with keys stored exclusively within EU jurisdiction when transferring sensitive personal data overseas.'
    }
  ]
};

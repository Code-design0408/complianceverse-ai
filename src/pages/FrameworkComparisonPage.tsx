import React, { useState } from 'react';
import {
  Layers,
  Search,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Filter,
  ArrowRight,
  Printer
} from 'lucide-react';
import { useAuthAndData } from '../context/AuthAndDataContext';

export const FrameworkComparisonPage: React.FC = () => {
  const { openAiModal } = useAuthAndData();
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const matrixData = [
    {
      domain: 'Identity, Access & MFA',
      description: 'Enforcing unique user identification, principle of least privilege, and multi-factor authentication across all access points.',
      mappings: {
        soc2: 'CC6.1 (Logical Access Security), CC6.2 (User Registration & Revocation), CC6.3 (Access Modification & Removal)',
        iso27001: 'A.5.15 (Access Control), A.5.16 (Identity Management), A.5.17 (Authentication Information), A.5.18 (Access Rights)',
        nistCsf: 'PR.AA-01 (Identities Managed), PR.AA-02 (Physical & Logical Access Authenticated), PR.AA-05 (Access Rights Managed)',
        hipaa: '45 CFR § 164.312(a)(1) (Access Control: Unique User ID, Emergency Access, Automatic Logoff, Encryption)',
        pciDss: 'Req 7 (Restrict Access by Business Need), Req 8 (Identify Users and Authenticate Access - MFA mandatory for all CDE)',
        gdpr: 'Art. 32(1)(b) (Ability to ensure confidentiality, integrity, availability and resilience of processing systems)',
      },
      auditorNotes: 'All frameworks mandate MFA on production databases and administrative consoles. PCI-DSS v4.0 explicitly requires phishing-resistant or cryptographically verified factors for administrative logins.'
    },
    {
      domain: 'Data Encryption (Rest & Transit)',
      description: 'Cryptographic protection of sensitive data in transit over public networks and at rest across datastores and backups.',
      mappings: {
        soc2: 'CC6.6 (Boundary Protection & Public Network Transmission), CC6.7 (Transmission Transmission Protection)',
        iso27001: 'A.8.24 (Use of Cryptography), A.8.20 (Network Security), A.8.21 (Security of Network Services)',
        nistCsf: 'PR.DS-01 (Data at Rest Protected), PR.DS-02 (Data in Transit Protected), PR.DS-10 (Data Integrity Mechanisms)',
        hipaa: '45 CFR § 164.312(a)(2)(iv) (Encryption at Rest - Addressable), § 164.312(e)(2)(ii) (Encryption in Transit - Addressable/Expected)',
        pciDss: 'Req 3 (Protect Stored Account Data), Req 4 (Protect Cardholder Data with Strong Cryptography During Transmission over Open/Public Networks)',
        gdpr: 'Art. 32(1)(a) (Pseudonymisation and encryption of personal data as a technical baseline)',
      },
      auditorNotes: 'TLS 1.2+ is the baseline standard. AES-256 is the universally accepted standard for data at rest. NIST requires key management procedures meeting FIPS 140-2/3 validation.'
    },
    {
      domain: 'Change Management & CI/CD Security',
      description: 'Formal controls governing the authorization, automated testing, separation of duties, and deployment of software changes.',
      mappings: {
        soc2: 'CC8.1 (Change Management: Authorization, Testing, Approval, and Segregation of Duties between Dev and Prod)',
        iso27001: 'A.8.29 (Security Testing in Development and Acceptance), A.8.31 (Separation of Development, Test and Production)',
        nistCsf: 'PR.PS-01 (Software and Hardware Maintenance Conducted with Authorization), PR.PS-06 (Software Security Practices in Lifecycle)',
        hipaa: '45 CFR § 164.308(a)(1)(ii)(A) (Risk Analysis and Management during technical infrastructure adjustments)',
        pciDss: 'Req 6.4 (Public-facing Web Apps protected), Req 6.5 (Changes deployed safely with documented separation of duties)',
        gdpr: 'Art. 25 (Data Protection by Design and by Default in all software development initiatives)',
      },
      auditorNotes: 'Segregation of duties (preventing single-engineer merge-and-deploy without peer approval) is the #1 item sampled by SOC 2 and ISO auditors.'
    },
    {
      domain: 'Vulnerability Management & Pen Testing',
      description: 'Systematic identification, automated scanning, prioritization, patching, and independent penetration testing.',
      mappings: {
        soc2: 'CC7.1 (Vulnerability Detection & Monitoring), CC4.1 (COSO Principle 16: Ongoing and Separate Evaluations)',
        iso27001: 'A.8.8 (Management of Technical Vulnerabilities), A.5.7 (Threat Intelligence)',
        nistCsf: 'ID.RA-01 (Vulnerabilities Identified and Documented), DE.CM-01 (Networks and Physical Environments Monitored for Threats)',
        hipaa: '45 CFR § 164.308(a)(1)(ii)(B) (Implement security measures to reduce risks and vulnerabilities)',
        pciDss: 'Req 11.2 (Run internal and external vulnerability scans quarterly), Req 11.3 (External and internal Penetration Testing annually)',
        gdpr: 'Art. 32(1)(d) (A process for regularly testing, assessing, and evaluating the effectiveness of security measures)',
      },
      auditorNotes: 'PCI-DSS requires quarterly ASV (Approved Scanning Vendor) external scans, while SOC 2 requires periodic scans and at least annual third-party penetration tests.'
    },
    {
      domain: 'Incident Response & Breach SLAs',
      description: 'Documented containment procedures, forensic readiness, and regulatory breach notification notification clocks.',
      mappings: {
        soc2: 'CC7.3 (Incident Evaluation & Containment), CC7.4 (Incident Response Team Activation & Remediation)',
        iso27001: 'A.5.24 (Information Security Incident Management Planning), A.5.25 (Assessment and Decision on Events)',
        nistCsf: 'RS.MA-01 (Incident Response Plan Executed), RS.CO-02 (Incidents Reported to Stakeholders), RC.RP-01 (Recovery Plans Executed)',
        hipaa: '45 CFR § 164.404 (Notification to Individuals within 60 days of breach discovery without unreasonable delay)',
        pciDss: 'Req 12.10 (Implement an Incident Response Plan; test annually; immediate notification to acquiring bank and payment brands)',
        gdpr: 'Art. 33 (Notification of a personal data breach to the supervisory authority within 72 hours of becoming aware)',
      },
      auditorNotes: 'Notice the strict SLA difference: GDPR mandates 72-hour notice to DPAs; HIPAA mandates 60 days to individuals (and immediate notice if >500 records); PCI requires immediate issuer alert.'
    },
    {
      domain: 'Third-Party & Vendor Risk (TPRM)',
      description: 'Due diligence, contractual security obligations, SLA monitoring, and recurring reviews of sub-processors and vendors.',
      mappings: {
        soc2: 'CC9.2 (Vendor Risk Assessment, Due Diligence, Review of Subservice Organizations SOC 2 Reports)',
        iso27001: 'A.5.19 (Information Security in Supplier Relationships), A.5.20 (Addressing Security Within Supplier Agreements)',
        nistCsf: 'GV.SC-01 (Supply Chain Risk Management Strategy), GV.SC-04 (Suppliers Prioritized by Criticality and Assessed)',
        hipaa: '45 CFR § 164.502(e) (Business Associate Agreements / BAA execution prior to PHI transmission)',
        pciDss: 'Req 12.8 (Maintain and implement policies and procedures to manage Third-Party Service Providers / TPSPs)',
        gdpr: 'Art. 28 (Data Processing Agreements / DPAs with strict sub-processor flow-down clauses)',
      },
      auditorNotes: 'SOC 2 auditors require evidence of reviewing your vendors’ SOC 2 Type II reports annually. HIPAA requires signed BAAs for every cloud service touching PHI.'
    }
  ];

  const filteredMatrix = matrixData.filter((item) => {
    const matchesDomain = selectedDomain === 'all' || item.domain === selectedDomain;
    const matchesSearch = item.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.auditorNotes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      Object.values(item.mappings).some(m => m.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesDomain && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/20 border border-primary/30 text-primary-light backdrop-blur-sm">
              <Layers className="h-4 w-4" />
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-text-primary">
              Cross-Framework Control Mapping Matrix
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Harmonize security controls across SOC 2, ISO 27001, NIST CSF, HIPAA, PCI-DSS, and GDPR to eliminate audit redundancy.
          </p>
        </div>

        <button
          onClick={() => openAiModal({ framework: 'Cross-Framework Comparison' })}
          className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-bold text-primary-light hover:bg-white/10 transition-all backdrop-blur-sm self-start md:self-auto"
        >
          <Sparkles className="h-4 w-4" />
          <span>Ask AI Cross-Mapping Query</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search across all frameworks and controls (e.g., MFA, encryption, breach notification)..."
            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-10 pr-4 py-2.5 text-xs text-text-primary placeholder:text-text-muted focus:border-primary-light focus:outline-none backdrop-blur-md shadow-inner"
          />
        </div>

        <select
          value={selectedDomain}
          onChange={(e) => setSelectedDomain(e.target.value)}
          className="rounded-2xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-xs font-medium text-text-primary focus:border-primary-light focus:outline-none backdrop-blur-md"
        >
          <option value="all" className="bg-[#0f0f13] text-white">All Control Domains (6)</option>
          {matrixData.map((d) => (
            <option key={d.domain} value={d.domain} className="bg-[#0f0f13] text-white">{d.domain}</option>
          ))}
        </select>
      </div>

      {/* Matrix Cards List */}
      <div className="space-y-6">
        {filteredMatrix.map((item, index) => (
          <div
            key={index}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8 space-y-6 hover:border-white/20 transition-all shadow-lg backdrop-blur-xl"
          >
            {/* Domain Title */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="rounded-full bg-primary/20 border border-primary/30 px-3 py-0.5 text-[10px] font-bold text-primary-light uppercase backdrop-blur-sm">
                  Domain Matrix
                </span>
                <span className="text-xs text-text-muted">Domain {index + 1} of {matrixData.length}</span>
              </div>
              <h2 className="font-heading text-xl font-bold text-text-primary">
                {item.domain}
              </h2>
              <p className="text-xs text-text-secondary mt-1 max-w-3xl leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* 6 Framework Mapping Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* SOC 2 */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-1.5 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary-light">SOC 2 Type II</span>
                  <span className="text-[10px] text-text-muted">AICPA TSC</span>
                </div>
                <p className="text-xs font-mono text-text-secondary leading-relaxed pt-1">
                  {item.mappings.soc2}
                </p>
              </div>

              {/* ISO 27001 */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-1.5 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-accent-light">ISO/IEC 27001:2022</span>
                  <span className="text-[10px] text-text-muted">Annex A</span>
                </div>
                <p className="text-xs font-mono text-text-secondary leading-relaxed pt-1">
                  {item.mappings.iso27001}
                </p>
              </div>

              {/* NIST CSF */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-1.5 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-400">NIST CSF 2.0</span>
                  <span className="text-[10px] text-text-muted">NIST Special Pub</span>
                </div>
                <p className="text-xs font-mono text-text-secondary leading-relaxed pt-1">
                  {item.mappings.nistCsf}
                </p>
              </div>

              {/* HIPAA */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-1.5 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400">HIPAA Security</span>
                  <span className="text-[10px] text-text-muted">45 CFR Part 164</span>
                </div>
                <p className="text-xs font-mono text-text-secondary leading-relaxed pt-1">
                  {item.mappings.hipaa}
                </p>
              </div>

              {/* PCI-DSS */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-1.5 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400">PCI-DSS v4.0</span>
                  <span className="text-[10px] text-text-muted">12 Requirements</span>
                </div>
                <p className="text-xs font-mono text-text-secondary leading-relaxed pt-1">
                  {item.mappings.pciDss}
                </p>
              </div>

              {/* GDPR */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-1.5 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-400">GDPR Privacy</span>
                  <span className="text-[10px] text-text-muted">EU Regulation</span>
                </div>
                <p className="text-xs font-mono text-text-secondary leading-relaxed pt-1">
                  {item.mappings.gdpr}
                </p>
              </div>

            </div>

            {/* Auditor Guidance Callout */}
            <div className="rounded-2xl border border-primary/40 bg-primary/10 p-4 flex items-start gap-3 backdrop-blur-sm">
              <ShieldCheck className="h-5 w-5 text-primary-light shrink-0 mt-0.5" />
              <div className="space-y-0.5 text-xs">
                <span className="font-bold text-primary-light">Lead Auditor Takeaway & Evidence Strategy:</span>
                <p className="text-text-secondary leading-relaxed">{item.auditorNotes}</p>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

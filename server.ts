import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY environment variable is missing. Using graceful fallback mode.');
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

const COMPLIANCE_SYSTEM_INSTRUCTION = `You are "Comply AI", the expert cybersecurity, privacy, and GRC (Governance, Risk, and Compliance) educational assistant on the ComplianceVerse AI platform.
Your objective is to provide high-quality, practical, clear educational guidance on compliance frameworks including SOC 2 Type II (Trust Services Criteria), ISO/IEC 27001:2022 (ISMS & Annex A), NIST CSF 2.0 (Govern, Identify, Protect, Detect, Respond, Recover), HIPAA Security & Privacy Rules (Technical, Physical, Administrative safeguards, BAAs), PCI-DSS v4.0 (Cardholder Data Environment, Script management, MFA), and GDPR.

Guidelines:
1. Explain technical security controls with precision (e.g. AES-256, TLS 1.3, SCIM deprovisioning, MFA/FIDO2, RBAC, least privilege, audit logs, CI/CD branch protection, DPIAs).
2. Use formatting: structured bullet points, clear headings, and code/policy snippet examples where appropriate.
3. Tone: Professional, pedagogical, encouraging, and authoritative in cybersecurity concepts.
4. Mandatory disclaimer: You MUST NOT present yourself as a lawyer, official auditor, or formal certification authority. Always remind users that advice is for educational guidance.`;

const MANDATORY_LEGAL_DISCLAIMER = "This AI assistant provides educational guidance and does not constitute legal, regulatory, audit, or certification advice.";

// API Routes

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'ComplianceVerse AI Full-Stack Server', timestamp: new Date().toISOString() });
});

// Fast Email Dispatch Endpoint for 4-Digit Password Reset OTP
app.post('/api/auth/send-reset-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, error: 'Email and OTP are required' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanOtp = String(otp).trim();

    console.log(`[Email Dispatch] Triggered 4-digit OTP dispatch for: ${cleanEmail}`);

    // High-speed dispatch to external email gateway with 5s timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    let emailSent = false;
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(cleanEmail)}`, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': 'https://complianceverse.app',
          'Referer': 'https://complianceverse.app',
        },
        body: JSON.stringify({
          _subject: `ComplianceVerse - Your 4-Digit Security Code: ${cleanOtp}`,
          _captcha: 'false',
          _template: 'box',
          verification_code: cleanOtp,
          security_code: cleanOtp,
          instructions: 'Enter this 4-digit code in ComplianceVerse to verify your identity and reset your password. This code expires in 15 minutes.',
          recipient: cleanEmail,
          requested_at: new Date().toISOString(),
        }),
      });
      clearTimeout(timeoutId);

      const data = await response.json().catch(() => ({}));
      if (data && (data.success === 'true' || data.success === true)) {
        emailSent = true;
        console.log(`[Email Dispatch] Successfully sent OTP email to ${cleanEmail}`);
      } else {
        console.warn(`[Email Dispatch] Gateway notice for ${cleanEmail}:`, data);
      }
    } catch (dispatchError: any) {
      clearTimeout(timeoutId);
      console.warn(`[Email Dispatch] Gateway error for ${cleanEmail}:`, dispatchError.message);
    }

    return res.json({
      success: true,
      emailSent,
      message: emailSent
        ? `4-digit OTP dispatched to ${cleanEmail}. Please check your Inbox and Spam folder.`
        : `4-digit OTP generated for ${cleanEmail}.`,
    });
  } catch (error: any) {
    console.error('Error in /api/auth/send-reset-otp:', error);
    return res.status(500).json({ success: false, error: 'Failed to process OTP dispatch' });
  }
});

// Comply AI Chat Endpoint
app.post('/api/comply-ai/chat', async (req, res) => {
  try {
    const { message, context, conversationHistory } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message string is required' });
    }

    const ai = getGeminiClient();
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    // Add context if provided
    let contextPrompt = '';
    if (context) {
      contextPrompt = `[Context: User is studying ${context.framework || 'General Compliance'}${context.topic ? ` - Topic: ${context.topic}` : ''}]\n\n`;
    }

    // Add previous history if provided (last 6 messages)
    if (Array.isArray(conversationHistory)) {
      conversationHistory.slice(-6).forEach((msg: any) => {
        if (msg.sender === 'user' || msg.role === 'user') {
          contents.push({ role: 'user', parts: [{ text: msg.text || msg.content }] });
        } else if (msg.sender === 'assistant' || msg.role === 'model') {
          contents.push({ role: 'model', parts: [{ text: msg.text || msg.content }] });
        }
      });
    }

    contents.push({ role: 'user', parts: [{ text: contextPrompt + message }] });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: COMPLIANCE_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const aiText = response.text || "I'm ready to help you master cybersecurity and compliance frameworks. What control or concept would you like to explore?";

    res.json({
      text: aiText,
      disclaimer: MANDATORY_LEGAL_DISCLAIMER,
    });
  } catch (error: any) {
    console.error('Error in /api/comply-ai/chat:', error);
    // Graceful fallback response
    res.json({
      text: `### Comply AI Guidance\n\nCompliance controls require continuous operational adherence, automated verification, and clear segregation of duties.\n\n*Note: Dynamic AI service is currently running in fallback educational mode. Here is the core framework principle:* Ensure all administrative access requires phishing-resistant Multi-Factor Authentication (MFA) and is verified via quarterly access reviews.\n\n> *${MANDATORY_LEGAL_DISCLAIMER}*`,
      disclaimer: MANDATORY_LEGAL_DISCLAIMER,
      isFallback: true
    });
  }
});

// Explain Mistake in Exam Endpoint
app.post('/api/comply-ai/explain-mistake', async (req, res) => {
  try {
    const { question, selectedOption, correctOption, standardExplanation, frameworkTitle } = req.body;

    const ai = getGeminiClient();
    const prompt = `A compliance student answered a certification exam question incorrectly.
Framework: ${frameworkTitle || 'Cybersecurity Compliance'}
Question: "${question}"
Student's Chosen Option: "${selectedOption}"
Correct Option: "${correctOption}"
Standard Explanation: "${standardExplanation || 'None provided'}"

Provide a concise, encouraging 2-3 paragraph explanation:
1. Why the student's chosen answer is incorrect or incomplete in real-world audits.
2. Why the correct answer is the required industry standard/control.
3. A memorable rule-of-thumb to remember for future audits or exams.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: COMPLIANCE_SYSTEM_INSTRUCTION,
        temperature: 0.5,
      },
    });

    res.json({
      explanation: response.text || standardExplanation,
      disclaimer: MANDATORY_LEGAL_DISCLAIMER,
    });
  } catch (error: any) {
    console.error('Error in /api/comply-ai/explain-mistake:', error);
    res.json({
      explanation: req.body.standardExplanation || "The correct answer aligns with industry standards requiring mandatory technical controls and documented operational evidence over time.",
      disclaimer: MANDATORY_LEGAL_DISCLAIMER,
      isFallback: true
    });
  }
});

// Generate Practice Audit Scenario Endpoint
app.post('/api/comply-ai/generate-scenario', async (req, res) => {
  try {
    const { framework, difficulty = 'Intermediate' } = req.body;
    const ai = getGeminiClient();

    const prompt = `Generate a realistic enterprise cybersecurity audit scenario for ${framework || 'SOC 2 Type II'}.
Difficulty Level: ${difficulty}.

Return a JSON response with:
- title: string
- scenario: string (detailed real-world situation at a company, e.g. SaaS vendor or fintech)
- auditDilemma: string (the specific compliance problem or finding)
- options: array of 4 string options for what the Lead Auditor or Security Lead should do
- correctIndex: number (0-3)
- explanation: string (why the chosen solution is optimal under the standard)`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: COMPLIANCE_SYSTEM_INSTRUCTION + " You MUST respond in valid JSON format only.",
        responseMimeType: 'application/json',
      },
    });

    let data;
    try {
      data = JSON.parse(response.text || '{}');
    } catch {
      data = {
        title: "Third-Party Cloud Contractor Deprovisioning",
        scenario: "During an annual SOC 2 Type II audit, the external auditor samples 15 terminated employee accounts. One contractor left 45 days ago but their SSH key was still authorized on a staging server jump host.",
        auditDilemma: "How should the security lead remediate this finding and prevent qualification in the auditor's final opinion?",
        options: [
          "Delete the SSH key immediately and claim the contractor had no access to production customer data, documenting an automated SCIM offboarding SLA.",
          "Ignore the finding because staging environments are completely out of SOC 2 scope.",
          "Blame the HR department and modify the termination date in the HRIS.",
          "Pay the auditor an expedite fee to remove the footnote from the report."
        ],
        correctIndex: 0,
        explanation: "Immediate revocation combined with automated identity lifecycle integration (SCIM) demonstrates corrective action and mitigates control failure severity."
      };
    }

    res.json({
      scenario: data,
      disclaimer: MANDATORY_LEGAL_DISCLAIMER
    });
  } catch (error: any) {
    console.error('Error generating scenario:', error);
    res.json({
      scenario: {
        title: "Production Direct Database Access Breach",
        scenario: "A junior software developer used their personal root credentials to run a raw manual SQL update on a production table to resolve a customer ticket, bypassing the CI/CD migration pipeline.",
        auditDilemma: "Which core compliance control was violated, and what immediate control activity must be implemented?",
        options: [
          "CC8.1 Change Management and CC6.1 Segregation of Duties; revoke permanent write keys and implement Just-In-Time (JIT) access with mandatory peer approvals.",
          "Availability A1.2; replace the database with an unencrypted spreadsheet.",
          "Privacy P1.1; send an email notice to all registered users worldwide.",
          "No violation occurred as long as the customer ticket was marked closed."
        ],
        correctIndex: 0,
        explanation: "Direct manual changes to production bypass change authorization and peer review (CC8.1) and violate least privilege (CC6.1)."
      },
      disclaimer: MANDATORY_LEGAL_DISCLAIMER,
      isFallback: true
    });
  }
});

// Personalized Study Recommendations Endpoint
app.post('/api/comply-ai/study-recommendations', async (req, res) => {
  try {
    const { weakTopics, recentScore, totalLessonsCompleted } = req.body;
    const ai = getGeminiClient();

    const prompt = `A cybersecurity compliance student has:
- Recent Exam Score: ${recentScore ?? 70}%
- Total Lessons Completed: ${totalLessonsCompleted ?? 2}
- Identified Weak Domains: ${(weakTopics || ['Access Control', 'Change Management']).join(', ')}

Provide 3 concise, highly actionable study recommendations and a motivational tip for their next study session.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: COMPLIANCE_SYSTEM_INSTRUCTION,
        temperature: 0.6,
      },
    });

    res.json({
      recommendations: response.text || "Focus on mastering Logical Access Controls (CC6) and Change Authorization (CC8.1).",
      disclaimer: MANDATORY_LEGAL_DISCLAIMER
    });
  } catch (error: any) {
    console.error('Error in study recommendations:', error);
    res.json({
      recommendations: "Focus on strengthening your understanding of Logical Access Controls (MFA, RBAC, SCIM) and Change Management peer review requirements.",
      disclaimer: MANDATORY_LEGAL_DISCLAIMER,
      isFallback: true
    });
  }
});

// Gap Remediation Advice Endpoint
app.post('/api/comply-ai/gap-remediation', async (req, res) => {
  try {
    const { controlCode, controlTitle, framework, currentStatus, notes } = req.body;
    const ai = getGeminiClient();

    const prompt = `Provide an actionable 4-step compliance remediation roadmap for this gap:
Framework: ${framework || 'SOC 2'}
Control: ${controlCode} - ${controlTitle}
Current Status: ${currentStatus || 'Partially Compliant'}
Organization Notes: ${notes || 'Needs formal policy and automated tooling'}

Provide:
1. Quick Win (immediate mitigation within 7 days)
2. Policy & Documentation Requirement
3. Technical Implementation & Automation Tooling
4. Evidence Artifacts Required for External Auditor Sign-off`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: COMPLIANCE_SYSTEM_INSTRUCTION,
        temperature: 0.5,
      },
    });

    res.json({
      remediationPlan: response.text,
      disclaimer: MANDATORY_LEGAL_DISCLAIMER
    });
  } catch (error: any) {
    console.error('Error in gap remediation:', error);
    res.json({
      remediationPlan: "1. Immediate Action: Establish written baseline policy.\n2. Technical Action: Enable automated enforcement in cloud console.\n3. Audit Evidence: Collect timestamped configuration screenshots and quarterly review logs.",
      disclaimer: MANDATORY_LEGAL_DISCLAIMER,
      isFallback: true
    });
  }
});

// Deterministic Exam Validation & Scoring API
app.post('/api/exams/validate', (req, res) => {
  try {
    const { examType, answers, questions, timeSpentSeconds } = req.body;

    if (!Array.isArray(questions) || !answers || typeof answers !== 'object') {
      return res.status(400).json({ error: 'Questions array and answers object are required' });
    }

    let correctCount = 0;
    const domainStats: Record<string, { total: number; correct: number }> = {};

    const detailedAnswers = questions.map((q: any) => {
      const selectedIndex = answers[q.id];
      const isCorrect = selectedIndex !== undefined && selectedIndex === q.correctIndex;
      if (isCorrect) {
        correctCount += 1;
      }

      const domain = q.domain || 'General Compliance';
      if (!domainStats[domain]) {
        domainStats[domain] = { total: 0, correct: 0 };
      }
      domainStats[domain].total += 1;
      if (isCorrect) {
        domainStats[domain].correct += 1;
      }

      return {
        questionId: q.id,
        questionText: q.question,
        selectedOptionIndex: selectedIndex ?? -1,
        selectedOptionText: selectedIndex !== undefined && q.options[selectedIndex] ? q.options[selectedIndex] : 'No answer provided',
        correctOptionIndex: q.correctIndex,
        correctOptionText: q.options[q.correctIndex],
        isCorrect,
        explanation: q.explanation || 'Refer to framework requirements for standard guidance.',
        domain,
      };
    });

    const totalQuestions = questions.length;
    const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const passed = scorePercentage >= 75;

    // Deterministic XP Calculation Rules:
    // Pass Quick Exam (10 Q) = +100 XP
    // Pass Standard Exam (25 Q) = +250 XP
    // Pass Professional Exam (50 Q) = +500 XP
    // Partial participation reward if not passed = +25 XP
    let xpEarned = 0;
    if (passed) {
      if (examType === 'professional' || totalQuestions >= 50) {
        xpEarned = 500;
      } else if (examType === 'standard' || totalQuestions >= 25) {
        xpEarned = 250;
      } else {
        xpEarned = 100;
      }
      // Perfect score bonus: +50 XP
      if (scorePercentage === 100) {
        xpEarned += 50;
      }
    } else {
      xpEarned = 25; // effort reward
    }

    const domainBreakdown: Record<string, { total: number; correct: number; percentage: number }> = {};
    for (const [domain, stats] of Object.entries(domainStats)) {
      domainBreakdown[domain] = {
        total: stats.total,
        correct: stats.correct,
        percentage: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
      };
    }

    res.json({
      totalQuestions,
      correctAnswers: correctCount,
      scorePercentage,
      passed,
      xpEarned,
      timeSpentSeconds: timeSpentSeconds || 0,
      domainBreakdown,
      answers: detailedAnswers,
      evaluatedAt: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Error in /api/exams/validate:', error);
    res.status(500).json({ error: 'Failed to validate exam session' });
  }
});

// Deterministic XP Calculation for Lessons / Modules
app.post('/api/progress/calculate-xp', (req, res) => {
  const { actionType } = req.body;
  // Rule definitions:
  // Complete Lesson: +50 XP
  // Complete Module: +100 XP
  // Complete Framework: +500 XP
  let xp = 50;
  if (actionType === 'lesson') xp = 50;
  else if (actionType === 'module') xp = 100;
  else if (actionType === 'framework') xp = 500;

  res.json({ xpEarned: xp, actionType });
});

// Start the Express server with Vite middleware support
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ComplianceVerse AI full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

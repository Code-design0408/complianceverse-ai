import { QuestionItem, ExamType, ExamResult } from '../types';

export const apiService = {
  // Comply AI Chat
  async chatWithComplyAI(message: string, context?: { framework?: string; topic?: string }, conversationHistory?: any[]) {
    try {
      const response = await fetch('/api/comply-ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, context, conversationHistory }),
      });
      if (!response.ok) throw new Error('Server error');
      return await response.json();
    } catch (error) {
      console.warn('Backend API request failed, using client fallback:', error);
      return {
        text: `### Comply AI Guidance\n\nCompliance frameworks like SOC 2, ISO 27001, and NIST CSF emphasize continuous operational controls, least-privilege access, and automated evidence collection.\n\n*Key advice:* Review your access control matrices, ensure all cloud environments enforce MFA, and maintain audit logs for all administrative actions.`,
        disclaimer: 'This AI assistant provides educational guidance and does not constitute legal, regulatory, audit, or certification advice.',
        isFallback: true,
      };
    }
  },

  async sendMessageToComplyAI(params: { message: string; context?: any; history?: any[] }) {
    const res = await this.chatWithComplyAI(params.message, params.context, params.history);
    return {
      reply: res.text || res.reply,
      disclaimer: res.disclaimer,
    };
  },

  // Explain Mistake with Comply AI Tutor
  async explainExamMistake(params: {
    question?: string;
    questionText?: string;
    scenarioText?: string;
    selectedOption?: string;
    selectedAnswer?: string;
    correctOption?: string;
    correctAnswer?: string;
    standardExplanation?: string;
    explanation?: string;
    domain?: string;
    frameworkTitle?: string;
    framework?: string;
  }): Promise<{ debrief: string; explanation: string; disclaimer: string; isFallback?: boolean }> {
    const q = params.questionText || params.question || '';
    const sel = params.selectedAnswer || params.selectedOption || '';
    const corr = params.correctAnswer || params.correctOption || '';
    const expl = params.explanation || params.standardExplanation || '';
    const fw = params.framework || params.frameworkTitle || '';
    try {
      const response = await fetch('/api/comply-ai/explain-mistake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionText: q,
          scenarioText: params.scenarioText,
          selectedAnswer: sel,
          correctAnswer: corr,
          explanation: expl,
          domain: params.domain,
          framework: fw,
        }),
      });
      if (!response.ok) throw new Error('Server error');
      const data = await response.json();
      const debriefVal = data.debrief || data.explanation || '';
      return {
        debrief: debriefVal,
        explanation: data.explanation || debriefVal,
        disclaimer: data.disclaimer || 'This AI assistant provides educational guidance and does not constitute legal, regulatory, audit, or certification advice.',
        isFallback: data.isFallback,
      };
    } catch (error) {
      console.warn('Explain mistake fallback notice:', error);
      const debriefText = `### Comply AI Audit Debrief\n\n1. **Choice Analysis**: The selected answer overlooks key operational requirements expected by compliance auditors.\n\n2. **Definitive Principle**: Compliance controls require verifiable proof of continuous enforcement rather than informal assumptions.\n\n3. **Audit Rule of Thumb**: When in doubt on certification exams, prioritize answers that enforce least-privilege, automated verification, and clear separation of duties.`;
      return {
        debrief: debriefText,
        explanation: `${expl}\n\n${debriefText}`,
        disclaimer: 'This AI assistant provides educational guidance and does not constitute legal, regulatory, audit, or certification advice.',
        isFallback: true,
      };
    }
  },

  // Generate Scenario
  async generateScenario(framework: string, difficulty: string = 'Intermediate') {
    try {
      const response = await fetch('/api/comply-ai/generate-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ framework, difficulty }),
      });
      if (!response.ok) throw new Error('Server error');
      return await response.json();
    } catch (error) {
      console.warn('Generate scenario fallback:', error);
      return {
        scenario: {
          title: 'Unauthenticated Cloud Storage Bucket Discovery',
          scenario: 'During an internal pre-audit assessment for SOC 2 Type II, the security team discovers an AWS S3 bucket containing historical customer transaction export files that was inadvertently configured with public read permissions for 3 weeks.',
          auditDilemma: 'What is the immediate technical and compliance requirement for the organization?',
          options: [
            'Immediately restrict bucket ACL to private, enable AWS CloudTrail access logging, conduct a forensic access analysis, and document incident response remediation.',
            'Delete the bucket silently without notifying anyone to avoid failing the audit.',
            'Rename the bucket to test-bucket and leave it public.',
            'Wait until the external auditor discovers it during the sampling phase.'
          ],
          correctIndex: 0,
          explanation: 'Restricting access immediately, preserving forensic logs, analyzing if customer data was accessed, and demonstrating transparent incident response satisfies SOC 2 CC7.3 and CC6.6.'
        },
        disclaimer: 'This AI assistant provides educational guidance and does not constitute legal, regulatory, audit, or certification advice.',
        isFallback: true,
      };
    }
  },

  // Study Recommendations
  async getStudyRecommendations(weakTopics: string[], recentScore: number, totalLessonsCompleted: number) {
    try {
      const response = await fetch('/api/comply-ai/study-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weakTopics, recentScore, totalLessonsCompleted }),
      });
      if (!response.ok) throw new Error('Server error');
      return await response.json();
    } catch (error) {
      return {
        recommendations: `1. **Focus on ${weakTopics[0] || 'Logical Access'}**: Revisit the core controls and practice with the 10-question quick exam.\n2. **Review Real-World Case Studies**: Examine how access control failures result in audit exceptions.\n3. **Test with Standard 25-Question Exam**: Validate your comprehension before advancing to the Professional exam.`,
        disclaimer: 'This AI assistant provides educational guidance and does not constitute legal, regulatory, audit, or certification advice.',
        isFallback: true,
      };
    }
  },

  // Gap Remediation
  async getGapRemediation(params: { controlCode: string; controlTitle: string; framework?: string; currentStatus: string; notes?: string; gapDescription?: string }) {
    try {
      const response = await fetch('/api/comply-ai/gap-remediation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!response.ok) throw new Error('Server error');
      return await response.json();
    } catch (error) {
      return {
        remediationPlan: `### 4-Step Remediation Plan for ${params.controlCode} (${params.controlTitle})\n\n1. **Step 1: Gap Definition & Ownership (Week 1)**\nAssign a technical lead to document the standard operating procedure and define exact exception handling policies.\n\n2. **Step 2: Technical Configuration & Guardrails (Weeks 2-3)**\nImplement automated enforcement policies (e.g. Terraform guardrails, IAM permission boundaries, or automated secrets scanners).\n\n3. **Step 3: Verification & Sampling (Week 4)**\nSimulate an auditor evidence request. Pull a 25-item population sample to verify 100% compliance with zero defects.\n\n4. **Step 4: Continuous Evidence Retention (Ongoing)**\nAutomate periodic evidence collection and retain snapshot exports for at least 12 months for formal external audit sampling.`,
        disclaimer: 'This AI assistant provides educational guidance and does not constitute legal, regulatory, audit, or certification advice.',
        isFallback: true,
      };
    }
  },

  async generateRemediationPlan(params: { controlCode: string; controlTitle: string; currentStatus: string; gapDescription?: string; framework?: string }) {
    const res = await this.getGapRemediation({
      controlCode: params.controlCode,
      controlTitle: params.controlTitle,
      currentStatus: params.currentStatus,
      notes: params.gapDescription || '',
      gapDescription: params.gapDescription,
      framework: params.framework,
    });
    return {
      plan: res.remediationPlan || res.plan,
      disclaimer: res.disclaimer,
    };
  },

  // Deterministic Exam Validation
  async validateExam(params: {
    examType: ExamType;
    answers: Record<string, number>;
    questions: QuestionItem[];
    timeSpentSeconds: number;
    userId: string;
    frameworkId?: string;
    frameworkTitle?: string;
  }): Promise<ExamResult> {
    try {
      const response = await fetch('/api/exams/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!response.ok) throw new Error('Validation server error');
      const data = await response.json();

      return {
        id: 'exam-' + Date.now(),
        userId: params.userId,
        examType: params.examType,
        frameworkId: params.frameworkId,
        frameworkTitle: params.frameworkTitle,
        totalQuestions: data.totalQuestions,
        correctAnswers: data.correctAnswers,
        scorePercentage: data.scorePercentage,
        passed: data.passed,
        xpEarned: data.xpEarned,
        timeSpentSeconds: data.timeSpentSeconds,
        completedAt: data.evaluatedAt || new Date().toISOString(),
        answers: data.answers,
        domainBreakdown: data.domainBreakdown,
        typeBreakdown: data.typeBreakdown,
      };
    } catch (error) {
      console.warn('Server exam validation fallback, evaluating deterministically on client:', error);
      // Deterministic Client Fallback
      let correctCount = 0;
      const domainStats: Record<string, { total: number; correct: number }> = {};
      const typeStats: Record<string, { total: number; correct: number }> = {};

      const detailedAnswers = params.questions.map((q) => {
        const selectedIndex = params.answers[q.id];
        const isCorrect = selectedIndex !== undefined && selectedIndex === q.correctIndex;
        if (isCorrect) correctCount += 1;

        const domain = q.domain || 'General Compliance';
        if (!domainStats[domain]) domainStats[domain] = { total: 0, correct: 0 };
        domainStats[domain].total += 1;
        if (isCorrect) domainStats[domain].correct += 1;

        const qType = q.questionType || (q.options.length === 2 && q.options[0].toLowerCase().includes('true') ? 'true_false' : (q.scenarioText ? 'scenario' : 'multiple_choice'));
        if (!typeStats[qType]) typeStats[qType] = { total: 0, correct: 0 };
        typeStats[qType].total += 1;
        if (isCorrect) typeStats[qType].correct += 1;

        return {
          questionId: q.id,
          questionText: q.question,
          questionType: qType,
          scenarioText: q.scenarioText,
          sourceStandard: q.sourceStandard,
          selectedOptionIndex: selectedIndex ?? -1,
          selectedOptionText: selectedIndex !== undefined && q.options[selectedIndex] ? q.options[selectedIndex] : 'Not answered',
          correctOptionIndex: q.correctIndex,
          correctOptionText: q.options[q.correctIndex],
          isCorrect,
          explanation: q.explanation || 'Standard compliance requirement.',
          domain,
        };
      });

      const total = params.questions.length;
      const score = total > 0 ? Math.round((correctCount / total) * 100) : 0;
      const passed = score >= 75;

      let xp = 30;
      if (passed) {
        if (params.examType === 'professional' || total >= 50) xp = 500;
        else if (params.examType === 'scenario' || total >= 30) xp = 400;
        else if (params.examType === 'standard' || total >= 20) xp = 300;
        else xp = 150;
        if (score === 100) xp += 50;
      }

      const domainBreakdown: Record<string, { total: number; correct: number; percentage: number }> = {};
      for (const [domain, stats] of Object.entries(domainStats)) {
        domainBreakdown[domain] = {
          total: stats.total,
          correct: stats.correct,
          percentage: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
        };
      }

      const typeBreakdown: Record<string, { total: number; correct: number; percentage: number }> = {};
      for (const [tKey, stats] of Object.entries(typeStats)) {
        typeBreakdown[tKey] = {
          total: stats.total,
          correct: stats.correct,
          percentage: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
        };
      }

      return {
        id: 'exam-' + Date.now(),
        userId: params.userId,
        examType: params.examType,
        frameworkId: params.frameworkId,
        frameworkTitle: params.frameworkTitle,
        totalQuestions: total,
        correctAnswers: correctCount,
        scorePercentage: score,
        passed,
        xpEarned: xp,
        timeSpentSeconds: params.timeSpentSeconds,
        completedAt: new Date().toISOString(),
        answers: detailedAnswers,
        domainBreakdown,
        typeBreakdown,
      };
    }
  },
};

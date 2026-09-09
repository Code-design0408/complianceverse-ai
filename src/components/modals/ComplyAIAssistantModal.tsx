import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ShieldCheck,
  HelpCircle,
  FileText,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Lightbulb,
  Copy,
  Check
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useAuthAndData } from '../../context/AuthAndDataContext';
import { apiService } from '../../services/apiService';

export const ComplyAIAssistantModal: React.FC = () => {
  const { isAiModalOpen, closeAiModal, aiModalInitialPrompt, aiModalContext, frameworks, logActivity } = useAuthAndData();

  const [activeTab, setActiveTab] = useState<'chat' | 'scenario' | 'remediation'>('chat');
  const [messages, setMessages] = useState<Array<{ id: string; sender: 'user' | 'assistant'; text: string; timestamp: string }>>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: `👋 **Welcome to Comply AI!** I am your expert cybersecurity, privacy, and GRC educational copilot.\n\nAsk me anything about **SOC 2 Type II, ISO/IEC 27001:2022, NIST CSF 2.0, HIPAA, PCI-DSS v4.0, or GDPR**, or try generating an interactive audit scenario!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Scenario Tab State
  const [selectedScenarioFramework, setSelectedScenarioFramework] = useState('SOC 2');
  const [scenarioDifficulty, setScenarioDifficulty] = useState('Intermediate');
  const [currentScenario, setCurrentScenario] = useState<any | null>(null);
  const [selectedScenarioOption, setSelectedScenarioOption] = useState<number | null>(null);
  const [scenarioRevealed, setScenarioRevealed] = useState(false);
  const [isGeneratingScenario, setIsGeneratingScenario] = useState(false);

  // Remediation Tab State
  const [remediationFramework, setRemediationFramework] = useState('SOC 2');
  const [remediationControl, setRemediationControl] = useState('CC6.1 (Logical Access & MFA)');
  const [remediationStatus, setRemediationStatus] = useState('Partially Compliant');
  const [remediationNotes, setRemediationNotes] = useState('Currently enforcing MFA for console, but API service accounts lack automated rotation.');
  const [remediationResult, setRemediationResult] = useState<string | null>(null);
  const [isGeneratingRemediation, setIsGeneratingRemediation] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (aiModalInitialPrompt && isAiModalOpen) {
      setInputText(aiModalInitialPrompt);
      handleSendMessage(aiModalInitialPrompt);
    }
  }, [aiModalInitialPrompt, isAiModalOpen]);

  useEffect(() => {
    if (isAiModalOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAiModalOpen]);

  if (!isAiModalOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsgId = 'msg-' + Date.now();
    const userMsg = {
      id: userMsgId,
      sender: 'user' as const,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await apiService.chatWithComplyAI(
        text.trim(),
        aiModalContext,
        messages.slice(-6)
      );

      const aiMsg = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'assistant' as const,
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);

      logActivity({
        category: 'ai',
        action: 'ai.chat',
        summary: `Queried Comply AI Copilot: "${text.trim().slice(0, 80)}..."`,
        details: {
          prompt: text.trim(),
          framework: aiModalContext?.framework,
          topic: aiModalContext?.topic,
        },
      });
    } catch (err) {
      const errorMsg = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'assistant' as const,
        text: 'I encountered an issue generating a response. Please verify that your question relates to cybersecurity compliance or try asking in a different way.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerateScenario = async () => {
    setIsGeneratingScenario(true);
    setCurrentScenario(null);
    setSelectedScenarioOption(null);
    setScenarioRevealed(false);

    try {
      const res = await apiService.generateScenario(selectedScenarioFramework, scenarioDifficulty);
      setCurrentScenario(res.scenario);
      logActivity({
        category: 'ai',
        action: 'ai.generate_scenario',
        summary: `Generated Interactive Audit Scenario: ${selectedScenarioFramework} (${scenarioDifficulty})`,
        details: {
          framework: selectedScenarioFramework,
          difficulty: scenarioDifficulty,
        },
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingScenario(false);
    }
  };

  const handleGenerateRemediation = async () => {
    setIsGeneratingRemediation(true);
    setRemediationResult(null);

    try {
      const res = await apiService.getGapRemediation({
        controlCode: remediationControl.split(' ')[0],
        controlTitle: remediationControl,
        framework: remediationFramework,
        currentStatus: remediationStatus,
        notes: remediationNotes,
      });
      setRemediationResult(res.remediationPlan);
      logActivity({
        category: 'ai',
        action: 'ai.gap_remediation',
        summary: `Generated AI Remediation Roadmap: ${remediationFramework} (${remediationControl})`,
        details: {
          control: remediationControl,
          framework: remediationFramework,
          status: remediationStatus,
        },
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingRemediation(false);
    }
  };

  const promptSuggestions = [
    'Explain SOC 2 Type II vs Type I with practical examples',
    'What are the key 2022 additions to ISO 27001 Annex A?',
    'How do I satisfy PCI-DSS v4.0 Req 6.4.3 for payment scripts?',
    'What technical safeguards does HIPAA § 164.312 require?',
    'What are the 6 core functions of NIST CSF 2.0?'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-4xl h-[90vh] max-h-[850px] rounded-3xl border border-white/15 bg-[#0a0a0e]/90 shadow-2xl shadow-black/80 backdrop-blur-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-gradient-to-r from-[#7A0019]/30 via-white/[0.03] to-transparent backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark p-0.5 shadow-md shadow-primary/30">
              <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#050505]/90">
                <Sparkles className="h-4 w-4 text-primary-light animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-base font-bold text-text-primary">
                  Comply AI Copilot
                </h3>
                <span className="rounded-full bg-primary/20 border border-primary/30 px-2 py-0.5 text-[9px] font-bold text-primary-light uppercase tracking-wider">
                  Gemini 3.7
                </span>
              </div>
              <p className="text-xs text-text-muted">
                {aiModalContext?.framework ? `Active Topic: ${aiModalContext.framework}` : 'Cybersecurity & GRC Educational Intelligence'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tabs */}
            <div className="flex rounded-xl bg-white/5 p-1 border border-white/10 backdrop-blur-md">
              <button
                onClick={() => setActiveTab('chat')}
                className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                  activeTab === 'chat' ? 'bg-primary text-white font-bold shadow-md shadow-primary/20' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Chat
              </button>
              <button
                onClick={() => setActiveTab('scenario')}
                className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                  activeTab === 'scenario' ? 'bg-primary text-white font-bold shadow-md shadow-primary/20' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Audit Scenario
              </button>
              <button
                onClick={() => setActiveTab('remediation')}
                className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                  activeTab === 'remediation' ? 'bg-primary text-white font-bold shadow-md shadow-primary/20' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Remediation Plan
              </button>
            </div>

            <button
              onClick={closeAiModal}
              className="p-1.5 rounded-xl text-text-muted hover:text-text-primary hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Legal Disclaimer Bar */}
        <div className="flex items-center gap-2 bg-amber-500/10 border-b border-amber-500/20 px-4 py-1.5 text-[11px] text-amber-300 backdrop-blur-sm">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-400" />
          <span>
            <strong>Educational Guidance:</strong> This AI assistant provides learning guidance and does not constitute legal, regulatory, audit, or certification advice.
          </span>
        </div>

        {/* Tab 1: Interactive Chat */}
        {activeTab === 'chat' && (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {messages.map((msg) => {
                const isAI = msg.sender === 'assistant';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${isAI ? '' : 'flex-row-reverse'}`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                        isAI
                          ? 'bg-primary/20 text-primary-light border border-primary/30'
                          : 'bg-accent/20 text-accent-light border border-accent/30'
                      }`}
                    >
                      {isAI ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    </div>

                    <div className={`relative max-w-[82%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                      isAI
                        ? 'bg-card-bg/90 border border-border text-text-primary'
                        : 'bg-primary text-white'
                    }`}>
                      {isAI ? (
                        <div className="prose prose-invert prose-sm max-w-none space-y-2 leading-relaxed">
                          <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      )}

                      <div className="mt-2 flex items-center justify-between gap-4 text-[10px] text-text-muted">
                        <span>{msg.timestamp}</span>
                        {isAI && (
                          <button
                            onClick={() => handleCopy(msg.text, msg.id)}
                            className="flex items-center gap-1 hover:text-text-primary"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="h-3 w-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary-light border border-primary/30">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="flex items-center gap-2 rounded-2xl bg-card-bg/90 border border-border px-4 py-3 text-xs text-text-muted">
                    <div className="h-2 w-2 rounded-full bg-primary-light animate-ping" />
                    <span>Analyzing compliance standard & formulating guidance...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Prompt suggestions pills */}
            <div className="px-4 py-2 border-t border-border/40 bg-background/50 flex gap-1.5 overflow-x-auto no-scrollbar">
              <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider self-center shrink-0 mr-1">
                Suggested:
              </span>
              {promptSuggestions.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt)}
                  className="shrink-0 rounded-full bg-card-bg border border-border hover:border-primary/40 px-2.5 py-1 text-xs text-text-secondary hover:text-text-primary transition-colors text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 sm:p-4 border-t border-border bg-background-elevated/90">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask Comply AI about SOC 2, ISO 27001, NIST CSF, HIPAA, PCI-DSS, or GDPR..."
                  className="flex-1 rounded-xl border border-border bg-card-bg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isLoading}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white hover:bg-primary-dark transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-md shadow-primary/20"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Tab 2: Interactive Practice Scenario Generator */}
        {activeTab === 'scenario' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            <div className="rounded-xl border border-border bg-card-bg/60 p-4">
              <h4 className="text-sm font-bold text-text-primary mb-2 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary-light" />
                Generate Audit Dilemma Practice Simulation
              </h4>
              <p className="text-xs text-text-muted mb-4">
                Comply AI will generate a realistic, high-stakes audit or security incident scenario with multiple mitigation paths. Test your decision-making against industry frameworks.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-text-muted uppercase">Framework</label>
                  <select
                    value={selectedScenarioFramework}
                    onChange={(e) => setSelectedScenarioFramework(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-background-elevated px-3 py-2 text-xs text-text-primary focus:border-primary"
                  >
                    <option value="SOC 2 Type II">SOC 2 Type II</option>
                    <option value="ISO/IEC 27001:2022">ISO/IEC 27001:2022</option>
                    <option value="NIST CSF 2.0">NIST CSF 2.0</option>
                    <option value="HIPAA Security Rule">HIPAA Security Rule</option>
                    <option value="PCI-DSS v4.0">PCI-DSS v4.0</option>
                    <option value="GDPR Data Protection">GDPR Data Protection</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-text-muted uppercase">Difficulty</label>
                  <select
                    value={scenarioDifficulty}
                    onChange={(e) => setScenarioDifficulty(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-background-elevated px-3 py-2 text-xs text-text-primary focus:border-primary"
                  >
                    <option value="Beginner">Beginner (Foundational)</option>
                    <option value="Intermediate">Intermediate (Operational)</option>
                    <option value="Advanced">Advanced (Crisis & Audit Exceptions)</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleGenerateScenario}
                    disabled={isGeneratingScenario}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary py-2 text-xs font-bold text-white hover:bg-primary-dark transition-all disabled:opacity-50 shadow-md shadow-primary/20"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{isGeneratingScenario ? 'Synthesizing Scenario...' : 'Generate Scenario'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Render Scenario */}
            {currentScenario && (
              <div className="space-y-4 animate-in fade-in">
                <div className="rounded-xl border border-primary/40 bg-gradient-to-br from-primary/10 via-card-bg to-card-bg p-5">
                  <span className="rounded bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary-light uppercase">
                    Audit Case Study
                  </span>
                  <h4 className="text-base font-bold text-text-primary mt-2">
                    {currentScenario.title}
                  </h4>
                  <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                    {currentScenario.scenario}
                  </p>

                  <div className="mt-4 rounded-lg bg-background-elevated/80 border border-border p-3">
                    <p className="text-xs font-semibold text-amber-300">
                      <strong>Audit Dilemma:</strong> {currentScenario.auditDilemma}
                    </p>
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Select the Lead Auditor Remediation Action:
                  </p>
                  {currentScenario.options?.map((opt: string, idx: number) => {
                    const isSelected = selectedScenarioOption === idx;
                    const isCorrect = idx === currentScenario.correctIndex;
                    let style = 'border-border bg-card-bg/80 hover:border-primary/40 text-text-secondary';
                    if (scenarioRevealed) {
                      if (isCorrect) {
                        style = 'border-emerald-500/60 bg-emerald-500/10 text-emerald-300 font-semibold';
                      } else if (isSelected) {
                        style = 'border-rose-500/60 bg-rose-500/10 text-rose-300';
                      }
                    } else if (isSelected) {
                      style = 'border-primary bg-primary/20 text-white font-medium';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          if (!scenarioRevealed) setSelectedScenarioOption(idx);
                        }}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs flex items-start gap-3 ${style}`}
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-background text-[11px] font-bold">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="flex-1">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Submit / Reveal */}
                {!scenarioRevealed && selectedScenarioOption !== null && (
                  <button
                    onClick={() => setScenarioRevealed(true)}
                    className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-all shadow-md shadow-emerald-900/30"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Submit & View Compliance Debrief</span>
                  </button>
                )}

                {/* Debrief */}
                {scenarioRevealed && (
                  <div className="rounded-xl border border-border bg-card-bg p-4 space-y-2 animate-in fade-in">
                    <h5 className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                      <Lightbulb className="h-4 w-4 text-amber-400" />
                      Auditor Analysis & Technical Rationale
                    </h5>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {currentScenario.explanation}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Gap Remediation Planner */}
        {activeTab === 'remediation' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            <div className="rounded-xl border border-border bg-card-bg/60 p-4 space-y-4">
              <div>
                <h4 className="text-sm font-bold text-text-primary">
                  AI-Powered Control Remediation Generator
                </h4>
                <p className="text-xs text-text-muted mt-0.5">
                  Input an identified compliance gap or unfulfilled control to receive a structured 4-step remediation plan with auditor evidence requirements.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-text-muted uppercase">Framework</label>
                  <select
                    value={remediationFramework}
                    onChange={(e) => setRemediationFramework(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-background-elevated px-3 py-2 text-xs text-text-primary focus:border-primary"
                  >
                    <option value="SOC 2 Type II">SOC 2 Type II</option>
                    <option value="ISO/IEC 27001:2022">ISO/IEC 27001:2022</option>
                    <option value="NIST CSF 2.0">NIST CSF 2.0</option>
                    <option value="HIPAA Security">HIPAA Security Rule</option>
                    <option value="PCI-DSS v4.0">PCI-DSS v4.0</option>
                    <option value="GDPR">GDPR Data Protection</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-text-muted uppercase">Control / Requirement</label>
                  <input
                    type="text"
                    value={remediationControl}
                    onChange={(e) => setRemediationControl(e.target.value)}
                    placeholder="e.g., CC6.1 Logical Access / MFA"
                    className="mt-1 w-full rounded-lg border border-border bg-background-elevated px-3 py-2 text-xs text-text-primary focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-text-muted uppercase">Current Maturity Status</label>
                  <select
                    value={remediationStatus}
                    onChange={(e) => setRemediationStatus(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-background-elevated px-3 py-2 text-xs text-text-primary focus:border-primary"
                  >
                    <option value="Not Started">Not Started (0%)</option>
                    <option value="Planned">Planned / In Discussion (25%)</option>
                    <option value="Partially Compliant">Partially Compliant (50%)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-text-muted uppercase">Organization Context / Notes</label>
                  <input
                    type="text"
                    value={remediationNotes}
                    onChange={(e) => setRemediationNotes(e.target.value)}
                    placeholder="e.g., Staging lacks data masking..."
                    className="mt-1 w-full rounded-lg border border-border bg-background-elevated px-3 py-2 text-xs text-text-primary focus:border-primary"
                  />
                </div>
              </div>

              <button
                onClick={handleGenerateRemediation}
                disabled={isGeneratingRemediation}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-xs font-bold text-white hover:bg-primary-dark transition-all disabled:opacity-50 shadow-md shadow-primary/20"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{isGeneratingRemediation ? 'Drafting Remediation Roadmap...' : 'Generate 4-Step Remediation Plan'}</span>
              </button>
            </div>

            {/* Remediation Result */}
            {remediationResult && (
              <div className="rounded-xl border border-primary/40 bg-card-bg p-5 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <h4 className="text-sm font-bold text-text-primary flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary-light" />
                    Targeted Remediation Plan
                  </h4>
                  <button
                    onClick={() => handleCopy(remediationResult, 'remediation-result')}
                    className="flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary"
                  >
                    {copiedId === 'remediation-result' ? (
                      <span className="text-emerald-400">Copied to Clipboard</span>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Plan</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="prose prose-invert prose-sm max-w-none leading-relaxed text-text-secondary">
                  <ReactMarkdown>{remediationResult}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

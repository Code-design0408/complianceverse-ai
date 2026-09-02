import React, { useState } from 'react';
import {
  ShieldAlert,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  RefreshCw,
  UserCheck,
  Award,
  BookOpen,
  Database,
  FileQuestion,
  X
} from 'lucide-react';
import { useAuthAndData } from '../context/AuthAndDataContext';
import { ExamQuestion, UserRole } from '../types';

export const AdminPage: React.FC = () => {
  const {
    user,
    role,
    loginAs,
    questions,
    addCustomQuestion,
    resetToDemoData,
    frameworks,
  } = useAuthAndData();

  const [questionSearch, setQuestionSearch] = useState('');
  const [selectedFwFilter, setSelectedFwFilter] = useState('all');
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);

  // New Question Form State
  const [newFwId, setNewFwId] = useState(frameworks[0]?.id || 'soc2');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newDomain, setNewDomain] = useState('Logical Access');
  const [newOptions, setNewOptions] = useState(['', '', '', '']);
  const [newCorrectIdx, setNewCorrectIdx] = useState(0);
  const [newExplanation, setNewExplanation] = useState('');
  const [newDifficulty, setNewDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.question.toLowerCase().includes(questionSearch.toLowerCase()) ||
      q.domain.toLowerCase().includes(questionSearch.toLowerCase());
    const matchesFw = selectedFwFilter === 'all' || q.frameworkId === selectedFwFilter;
    return matchesSearch && matchesFw;
  });

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText || newOptions.some((o) => !o.trim())) return;

    addCustomQuestion({
      frameworkId: newFwId,
      question: newQuestionText,
      domain: newDomain,
      options: newOptions,
      correctIndex: newCorrectIdx,
      explanation: newExplanation,
      difficulty: newDifficulty,
    });

    setNewQuestionText('');
    setNewOptions(['', '', '', '']);
    setNewExplanation('');
    setShowAddQuestionModal(false);
  };

  const handleOptionChange = (idx: number, val: string) => {
    const next = [...newOptions];
    next[idx] = val;
    setNewOptions(next);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/20 text-purple-300">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-text-primary">
              Instructor & Admin Control Center
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Manage assessment question banks, simulate user roles, and inspect educational metrics.
          </p>
        </div>

        <button
          onClick={() => setShowAddQuestionModal(true)}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white hover:bg-primary-dark transition-all shadow-md shadow-primary/20 self-start md:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add Custom Exam Question</span>
        </button>
      </div>

      {/* Role Switcher & System Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Role Switcher Card */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 space-y-4 backdrop-blur-xl shadow-lg">
          <div className="flex items-center gap-2 text-text-primary font-bold text-sm">
            <UserCheck className="h-4 w-4 text-primary-light" />
            <span>Role Simulator</span>
          </div>
          <p className="text-xs text-text-muted">
            Toggle between application personas to test role-based access control and views:
          </p>

          <div className="space-y-2">
            {(['student', 'instructor', 'admin'] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => loginAs(r)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl border text-xs font-bold transition-all backdrop-blur-sm ${
                  role === r
                    ? 'border-primary-light bg-primary/30 text-white shadow-md'
                    : 'border-white/10 bg-white/[0.03] text-text-muted hover:text-text-primary hover:bg-white/[0.07]'
                }`}
              >
                <span className="capitalize">{r === 'student' ? 'Student / Learner' : r === 'instructor' ? 'Lead Auditor / Instructor' : 'Platform Administrator'}</span>
                {role === r && <CheckCircle2 className="h-4 w-4 text-primary-light" />}
              </button>
            ))}
          </div>
        </div>

        {/* Database & Data Management */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 space-y-4 backdrop-blur-xl shadow-lg">
          <div className="flex items-center gap-2 text-text-primary font-bold text-sm">
            <Database className="h-4 w-4 text-accent-light" />
            <span>Storage & State Management</span>
          </div>
          <p className="text-xs text-text-muted">
            Reset test data, reload standard demo questions, or purge cached simulation sessions.
          </p>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => {
                if (window.confirm('Reset all progress, XP, and history back to default demo state?')) {
                  resetToDemoData();
                }
              }}
              className="w-full flex items-center justify-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 py-2.5 text-xs font-bold text-rose-300 hover:bg-rose-500/20 transition-all backdrop-blur-sm shadow-sm"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Reset Curriculum & Telemetry Data</span>
            </button>
          </div>
        </div>

        {/* Platform Overview Telemetry */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 space-y-3 backdrop-blur-xl shadow-lg">
          <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Platform Inventory</span>
          
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-white/10">
              <span className="text-text-muted">Registered Frameworks:</span>
              <span className="font-bold text-text-primary">{frameworks.length} Standards</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/10">
              <span className="text-text-muted">Total Exam Questions in Bank:</span>
              <span className="font-bold font-mono text-primary-light">{questions.length} Questions</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/10">
              <span className="text-text-muted">Total Security Controls Mapped:</span>
              <span className="font-bold text-text-primary">
                {frameworks.reduce((acc, f) => acc + (f.controls?.length || 0), 0)} Controls
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-text-muted">Active Current User:</span>
              <span className="font-bold text-primary-light">{user.name} ({user.level})</span>
            </div>
          </div>
        </div>

      </div>

      {/* Question Bank Manager */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-heading text-lg font-bold text-text-primary">
              Assessment Question Bank ({filteredQuestions.length} Questions)
            </h3>
            <p className="text-xs text-text-muted">
              Inspect questions used for deterministic 10, 25, and 50-question mock exams.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedFwFilter}
              onChange={(e) => setSelectedFwFilter(e.target.value)}
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-text-primary focus:border-primary-light focus:outline-none backdrop-blur-md"
            >
              <option value="all" className="bg-[#0f0f13] text-white">All Frameworks</option>
              {frameworks.map((f) => (
                <option key={f.id} value={f.id} className="bg-[#0f0f13] text-white">{f.shortName}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] overflow-hidden shadow-lg backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.05] border-b border-white/10 text-text-muted uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">ID / Scope</th>
                  <th className="px-4 py-3">Domain</th>
                  <th className="px-4 py-3">Question Prompt</th>
                  <th className="px-4 py-3">Correct Answer</th>
                  <th className="px-4 py-3">Difficulty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredQuestions.map((q) => (
                  <tr key={q.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-primary-light whitespace-nowrap">
                      {q.frameworkId.toUpperCase()}
                    </td>
                    <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                      <span className="rounded-full bg-white/5 px-2.5 py-0.5 border border-white/10">
                        {q.domain}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-text-primary max-w-md">
                      <div className="line-clamp-2">{q.question}</div>
                    </td>
                    <td className="px-4 py-3 text-emerald-400 font-semibold max-w-xs truncate">
                      {q.options[q.correctIndex]}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] uppercase font-bold text-text-muted border border-white/10">
                        {q.difficulty}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Custom Question Modal */}
      {showAddQuestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <form
            onSubmit={handleCreateQuestion}
            className="w-full max-w-2xl rounded-3xl border border-white/15 bg-neutral-950/90 backdrop-blur-2xl p-6 sm:p-8 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <FileQuestion className="h-5 w-5 text-primary-light" />
                <h3 className="font-heading text-base font-bold text-text-primary">
                  Create Custom Exam Question
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddQuestionModal(false)}
                className="text-text-muted hover:text-text-primary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="font-semibold text-text-secondary block mb-1">Target Framework</label>
                <select
                  value={newFwId}
                  onChange={(e) => setNewFwId(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-text-primary focus:border-primary-light focus:outline-none"
                >
                  {frameworks.map((f) => (
                    <option key={f.id} value={f.id} className="bg-[#0f0f13] text-white">{f.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-text-secondary block mb-1">Domain</label>
                <input
                  type="text"
                  required
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  placeholder="e.g. Logical Access"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-text-primary focus:border-primary-light focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-text-secondary block mb-1">Difficulty</label>
                <select
                  value={newDifficulty}
                  onChange={(e) => setNewDifficulty(e.target.value as any)}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-text-primary focus:border-primary-light focus:outline-none"
                >
                  <option value="Beginner" className="bg-[#0f0f13] text-white">Beginner</option>
                  <option value="Intermediate" className="bg-[#0f0f13] text-white">Intermediate</option>
                  <option value="Advanced" className="bg-[#0f0f13] text-white">Advanced</option>
                </select>
              </div>
            </div>

            <div className="text-xs">
              <label className="font-semibold text-text-secondary block mb-1">Question Prompt</label>
              <textarea
                rows={3}
                required
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                placeholder="Enter complete multiple-choice question scenario..."
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-text-primary focus:border-primary-light focus:outline-none"
              />
            </div>

            {/* Options */}
            <div className="space-y-2 text-xs">
              <label className="font-semibold text-text-secondary block">
                Answer Options (Select radio button for the correct answer):
              </label>
              {newOptions.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correctOption"
                    checked={newCorrectIdx === idx}
                    onChange={() => setNewCorrectIdx(idx)}
                    className="accent-primary h-4 w-4"
                  />
                  <span className="font-mono font-bold text-text-muted w-4">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  <input
                    type="text"
                    required
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                    className="flex-1 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-text-primary focus:border-primary-light focus:outline-none"
                  />
                </div>
              ))}
            </div>

            <div className="text-xs">
              <label className="font-semibold text-text-secondary block mb-1">Regulatory Explanation</label>
              <textarea
                rows={2}
                required
                value={newExplanation}
                onChange={(e) => setNewExplanation(e.target.value)}
                placeholder="Explain why the correct answer is valid under the standard..."
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-text-primary focus:border-primary-light focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowAddQuestionModal(false)}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-semibold text-text-secondary hover:bg-white/10 transition-all backdrop-blur-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-xl bg-primary py-2.5 text-xs font-bold text-white hover:bg-primary-dark transition-all shadow-md shadow-primary/20 border border-white/15"
              >
                Save Question to Bank
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

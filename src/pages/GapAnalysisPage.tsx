import React, { useState } from 'react';
import {
  SlidersHorizontal,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  Bot,
  Layers,
  FileText,
  X
} from 'lucide-react';
import { useAuthAndData } from '../context/AuthAndDataContext';
import { GapAnalysisItem, ComplianceStatus } from '../types';
import { apiService } from '../services/apiService';

interface GapAnalysisPageProps {
  setCurrentTab: (tab: string) => void;
}

export const GapAnalysisPage: React.FC<GapAnalysisPageProps> = ({ setCurrentTab }) => {
  const {
    gapItems,
    updateGapItemStatus,
    addGapItem,
    frameworks,
    openAiModal,
  } = useAuthAndData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFramework, setSelectedFramework] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');

  // AI Roadmap Modal State
  const [activeRoadmapItem, setActiveRoadmapItem] = useState<GapAnalysisItem | null>(null);
  const [roadmapContent, setRoadmapContent] = useState<string | null>(null);
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);

  // New Gap Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFrameworkId, setNewFrameworkId] = useState(frameworks[0]?.id || 'soc2');
  const [newControlCode, setNewControlCode] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newRisk, setNewRisk] = useState<'critical' | 'high' | 'medium' | 'low'>('high');

  // Filter items
  const filteredItems = gapItems.filter((item) => {
    const matchesSearch = item.controlCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFw = selectedFramework === 'all' || item.frameworkId === selectedFramework;
    const matchesStat = selectedStatus === 'all' || item.status === selectedStatus;
    const matchesRisk = selectedRisk === 'all' || item.riskLevel === selectedRisk;
    return matchesSearch && matchesFw && matchesStat && matchesRisk;
  });

  // Calculate Overall Readiness Score (%)
  const totalItems = gapItems.length;
  const compliantItems = gapItems.filter((i) => i.status === 'compliant').length;
  const partialItems = gapItems.filter((i) => i.status === 'partially_compliant').length;
  const plannedItems = gapItems.filter((i) => i.status === 'planned').length;
  const notStartedItems = gapItems.filter((i) => i.status === 'not_started').length;

  const weightedScore = totalItems > 0
    ? Math.round(((compliantItems * 1.0 + partialItems * 0.5 + plannedItems * 0.2) / totalItems) * 100)
    : 0;

  const handleGenerateRoadmap = async (item: GapAnalysisItem) => {
    setActiveRoadmapItem(item);
    setRoadmapContent(null);
    setIsGeneratingRoadmap(true);

    try {
      const res = await apiService.generateRemediationPlan({
        controlCode: item.controlCode,
        controlTitle: item.title,
        currentStatus: item.status,
        gapDescription: item.description,
      });
      setRoadmapContent(res.plan);
    } catch (e) {
      console.error('Error generating roadmap:', e);
      setRoadmapContent('Unable to connect to Comply AI. Please verify network or try again.');
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  const handleCreateGapItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newControlCode || !newTitle) return;

    addGapItem({
      frameworkId: newFrameworkId,
      controlCode: newControlCode,
      title: newTitle,
      description: newDescription,
      status: 'not_started',
      riskLevel: newRisk,
    });

    setNewControlCode('');
    setNewTitle('');
    setNewDescription('');
    setShowAddModal(false);
  };

  const getStatusBadge = (status: ComplianceStatus) => {
    switch (status) {
      case 'compliant':
        return <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">Compliant</span>;
      case 'partially_compliant':
        return <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 text-[11px] font-bold text-amber-400">Partial</span>;
      case 'planned':
        return <span className="rounded-full bg-blue-500/10 border border-blue-500/30 px-2.5 py-0.5 text-[11px] font-bold text-blue-400">Planned</span>;
      case 'not_started':
        return <span className="rounded-full bg-rose-500/10 border border-rose-500/30 px-2.5 py-0.5 text-[11px] font-bold text-rose-400">Not Started</span>;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/20 border border-primary/30 text-primary-light backdrop-blur-sm">
              <SlidersHorizontal className="h-4 w-4" />
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-text-primary">
              Compliance Gap Analysis & Maturity Tracker
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Assess control readiness, track remediation status, and generate 4-step AI implementation roadmaps.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white hover:bg-primary-dark transition-all shadow-md shadow-primary/20 self-start md:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add Custom Gap Item</span>
        </button>
      </div>

      {/* Top Maturity Score Card & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Readiness Gauge Banner */}
        <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-primary/25 via-white/[0.04] to-black/50 p-6 sm:p-8 space-y-4 backdrop-blur-2xl shadow-xl">
          <span className="text-xs font-bold text-primary-light uppercase tracking-wider">
            Overall Security Posture
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-4xl sm:text-5xl font-black text-text-primary">
              {weightedScore}%
            </span>
            <span className="text-xs text-text-secondary">Readiness Index</span>
          </div>

          <div className="h-2.5 w-full bg-black/40 border border-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${weightedScore}%` }}
            />
          </div>

          <p className="text-xs text-text-muted leading-relaxed">
            Calculated across {totalItems} controls in your audit scope. Update statuses below to dynamically track maturity.
          </p>
        </div>

        {/* Status Breakdown Grid (2 cols) */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 flex flex-col justify-between backdrop-blur-md shadow-sm">
            <div className="flex items-center justify-between text-emerald-400">
              <span className="text-xs font-bold">Compliant</span>
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div className="mt-4">
              <p className="font-heading text-2xl font-bold font-mono text-emerald-300">
                {compliantItems}
              </p>
              <p className="text-[10px] text-text-muted mt-0.5">Controls verified</p>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 flex flex-col justify-between backdrop-blur-md shadow-sm">
            <div className="flex items-center justify-between text-amber-400">
              <span className="text-xs font-bold">Partial</span>
              <Clock className="h-4 w-4" />
            </div>
            <div className="mt-4">
              <p className="font-heading text-2xl font-bold font-mono text-amber-300">
                {partialItems}
              </p>
              <p className="text-[10px] text-text-muted mt-0.5">In development</p>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4 flex flex-col justify-between backdrop-blur-md shadow-sm">
            <div className="flex items-center justify-between text-blue-400">
              <span className="text-xs font-bold">Planned</span>
              <FileText className="h-4 w-4" />
            </div>
            <div className="mt-4">
              <p className="font-heading text-2xl font-bold font-mono text-blue-300">
                {plannedItems}
              </p>
              <p className="text-[10px] text-text-muted mt-0.5">On Q3/Q4 backlog</p>
            </div>
          </div>

          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 flex flex-col justify-between backdrop-blur-md shadow-sm">
            <div className="flex items-center justify-between text-rose-400">
              <span className="text-xs font-bold">Not Started</span>
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div className="mt-4">
              <p className="font-heading text-2xl font-bold font-mono text-rose-300">
                {notStartedItems}
              </p>
              <p className="text-[10px] text-text-muted mt-0.5">High audit risk</p>
            </div>
          </div>

        </div>

      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="relative sm:col-span-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search controls..."
            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-9 pr-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:border-primary-light focus:outline-none backdrop-blur-md shadow-inner"
          />
        </div>

        <select
          value={selectedFramework}
          onChange={(e) => setSelectedFramework(e.target.value)}
          className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-text-primary focus:border-primary-light focus:outline-none backdrop-blur-md"
        >
          <option value="all" className="bg-[#0f0f13] text-white">All Frameworks</option>
          {frameworks.map((f) => (
            <option key={f.id} value={f.id} className="bg-[#0f0f13] text-white">{f.shortName}</option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-text-primary focus:border-primary-light focus:outline-none backdrop-blur-md"
        >
          <option value="all" className="bg-[#0f0f13] text-white">All Statuses</option>
          <option value="compliant" className="bg-[#0f0f13] text-white">Compliant</option>
          <option value="partially_compliant" className="bg-[#0f0f13] text-white">Partially Compliant</option>
          <option value="planned" className="bg-[#0f0f13] text-white">Planned</option>
          <option value="not_started" className="bg-[#0f0f13] text-white">Not Started</option>
        </select>

        <select
          value={selectedRisk}
          onChange={(e) => setSelectedRisk(e.target.value)}
          className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-text-primary focus:border-primary-light focus:outline-none backdrop-blur-md"
        >
          <option value="all" className="bg-[#0f0f13] text-white">All Risk Levels</option>
          <option value="critical" className="bg-[#0f0f13] text-white">Critical Risk</option>
          <option value="high" className="bg-[#0f0f13] text-white">High Risk</option>
          <option value="medium" className="bg-[#0f0f13] text-white">Medium Risk</option>
          <option value="low" className="bg-[#0f0f13] text-white">Low Risk</option>
        </select>
      </div>

      {/* Interactive Controls Table */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] overflow-hidden shadow-xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.03] border-b border-white/10 text-text-muted uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">Control Code</th>
                <th className="px-4 py-3">Framework</th>
                <th className="px-4 py-3">Control Requirement & Gap</th>
                <th className="px-4 py-3">Risk Level</th>
                <th className="px-4 py-3">Implementation Status</th>
                <th className="px-4 py-3 text-right">AI Remediation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-primary-light whitespace-nowrap">
                    {item.controlCode}
                  </td>
                  <td className="px-4 py-3 font-semibold text-text-secondary whitespace-nowrap">
                    <span className="rounded-md bg-white/5 px-2 py-0.5 border border-white/10 text-[11px]">
                      {item.frameworkId.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-text-primary">{item.title}</div>
                    <p className="text-[11px] text-text-muted mt-0.5 max-w-md line-clamp-2">{item.description}</p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase backdrop-blur-sm ${
                      item.riskLevel === 'critical'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        : item.riskLevel === 'high'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : item.riskLevel === 'medium'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    }`}>
                      {item.riskLevel}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <select
                      value={item.status}
                      onChange={(e) => updateGapItemStatus(item.id, e.target.value as ComplianceStatus)}
                      className="rounded-xl border border-white/10 bg-white/[0.05] px-2.5 py-1 text-xs font-semibold text-text-primary focus:border-primary-light focus:outline-none backdrop-blur-sm"
                    >
                      <option value="compliant" className="bg-[#0f0f13] text-white">Compliant</option>
                      <option value="partially_compliant" className="bg-[#0f0f13] text-white">Partially Compliant</option>
                      <option value="planned" className="bg-[#0f0f13] text-white">Planned</option>
                      <option value="not_started" className="bg-[#0f0f13] text-white">Not Started</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleGenerateRoadmap(item)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary-light hover:bg-primary/20 transition-all backdrop-blur-sm"
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>Roadmap</span>
                    </button>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-text-muted">
                    No gap items match the selected filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Remediation Plan Modal */}
      {activeRoadmapItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl rounded-3xl border border-white/15 bg-[#0f0f13]/95 p-6 sm:p-8 space-y-5 shadow-2xl backdrop-blur-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary-light" />
                <h3 className="font-heading text-base font-bold text-text-primary">
                  AI Remediation Roadmap: {activeRoadmapItem.controlCode}
                </h3>
              </div>
              <button
                onClick={() => setActiveRoadmapItem(null)}
                className="text-text-muted hover:text-text-primary p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-4 space-y-1 text-xs backdrop-blur-sm">
              <div className="font-bold text-text-primary">{activeRoadmapItem.title}</div>
              <p className="text-text-muted">{activeRoadmapItem.description}</p>
            </div>

            {isGeneratingRoadmap ? (
              <div className="py-12 text-center space-y-3">
                <Sparkles className="h-8 w-8 text-primary-light animate-spin mx-auto" />
                <p className="text-xs font-semibold text-text-secondary">
                  Comply AI is synthesizing technical remediation steps and auditor evidence checklists...
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-xs text-text-secondary whitespace-pre-wrap leading-relaxed space-y-2 backdrop-blur-sm">
                {roadmapContent}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setActiveRoadmapItem(null)}
                className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-primary-dark transition-all"
              >
                Close Roadmap
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Gap Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <form
            onSubmit={handleCreateGapItem}
            className="w-full max-w-md rounded-3xl border border-white/15 bg-[#0f0f13]/95 p-6 space-y-4 shadow-2xl backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-heading text-base font-bold text-text-primary">
                Add Custom Control Gap
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-text-muted hover:text-text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-text-secondary block mb-1">Framework</label>
                <select
                  value={newFrameworkId}
                  onChange={(e) => setNewFrameworkId(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-text-primary focus:border-primary-light focus:outline-none backdrop-blur-sm"
                >
                  {frameworks.map((f) => (
                    <option key={f.id} value={f.id} className="bg-[#0f0f13] text-white">{f.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-text-secondary block mb-1">Control Code (e.g. CC6.1, A.8.1)</label>
                <input
                  type="text"
                  required
                  value={newControlCode}
                  onChange={(e) => setNewControlCode(e.target.value)}
                  placeholder="CC6.1"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-text-primary focus:border-primary-light focus:outline-none backdrop-blur-sm"
                />
              </div>

              <div>
                <label className="font-semibold text-text-secondary block mb-1">Control Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Multi-Factor Authentication on Production Datastores"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-text-primary focus:border-primary-light focus:outline-none backdrop-blur-sm"
                />
              </div>

              <div>
                <label className="font-semibold text-text-secondary block mb-1">Gap Description & Deficit</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Explain why this control is not fully met..."
                  className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-text-primary focus:border-primary-light focus:outline-none backdrop-blur-sm"
                />
              </div>

              <div>
                <label className="font-semibold text-text-secondary block mb-1">Risk Level</label>
                <select
                  value={newRisk}
                  onChange={(e) => setNewRisk(e.target.value as any)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-text-primary focus:border-primary-light focus:outline-none backdrop-blur-sm"
                >
                  <option value="critical" className="bg-[#0f0f13] text-white">Critical</option>
                  <option value="high" className="bg-[#0f0f13] text-white">High</option>
                  <option value="medium" className="bg-[#0f0f13] text-white">Medium</option>
                  <option value="low" className="bg-[#0f0f13] text-white">Low</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 rounded-xl border border-white/10 bg-white/[0.05] py-2.5 text-xs font-semibold text-text-secondary hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-xl bg-primary py-2.5 text-xs font-bold text-white hover:bg-primary-dark transition-all shadow-md shadow-primary/20"
              >
                Save Gap Item
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

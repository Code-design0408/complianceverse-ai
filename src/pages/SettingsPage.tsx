import React, { useState } from 'react';
import {
  Settings,
  User,
  Shield,
  Bell,
  Trash2,
  CheckCircle2,
  Save,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useAuthAndData } from '../context/AuthAndDataContext';
import { UserRole } from '../types';

export const SettingsPage: React.FC = () => {
  const { user, role, loginAs, updateUserProfile, startFreshUser } = useAuthAndData();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [userRole, setUserRole] = useState<UserRole>(role);
  const [jobTitle, setJobTitle] = useState(user.jobTitle || '');
  const [company, setCompany] = useState(user.company || '');
  const [experienceLevel, setExperienceLevel] = useState(user.experienceLevel || 'intermediate');
  const [bio, setBio] = useState(user.bio || '');
  const [studyTarget, setStudyTarget] = useState('30');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      email,
      role: userRole,
      jobTitle,
      company,
      experienceLevel: experienceLevel as any,
      bio,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/20 border border-primary/30 text-primary-light backdrop-blur-sm">
          <Settings className="h-4 w-4" />
        </div>
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-text-primary">
            Settings & Auditor Profile
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-0.5">
            Configure learning goals, role credentials, and platform preferences.
          </p>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        
        {/* Profile Card */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8 space-y-4 backdrop-blur-xl shadow-lg">
          <div className="flex items-center gap-2 text-text-primary font-bold text-sm">
            <User className="h-4 w-4 text-primary-light" />
            <span>Auditor Profile Information</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-text-secondary block mb-1">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-text-primary focus:border-primary-light focus:outline-none backdrop-blur-sm"
              />
            </div>

            <div>
              <label className="font-semibold text-text-secondary block mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-text-primary focus:border-primary-light focus:outline-none backdrop-blur-sm"
              />
            </div>

            <div>
              <label className="font-semibold text-text-secondary block mb-1">Professional Job Title</label>
              <input
                type="text"
                placeholder="e.g., Senior GRC Analyst / Security Lead"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-text-primary focus:border-primary-light focus:outline-none backdrop-blur-sm"
              />
            </div>

            <div>
              <label className="font-semibold text-text-secondary block mb-1">Company / Organization</label>
              <input
                type="text"
                placeholder="e.g., CyberTech Global / Audit Advisory"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-text-primary focus:border-primary-light focus:outline-none backdrop-blur-sm"
              />
            </div>

            <div>
              <label className="font-semibold text-text-secondary block mb-1">Audit & Compliance Experience</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value as any)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-text-primary focus:border-primary-light focus:outline-none backdrop-blur-sm"
              >
                <option value="entry" className="bg-[#0f0f13] text-white">Entry-Level / Student (0-1 yrs)</option>
                <option value="intermediate" className="bg-[#0f0f13] text-white">Associate / GRC Analyst (2-4 yrs)</option>
                <option value="senior" className="bg-[#0f0f13] text-white">Senior Security Consultant (5-8 yrs)</option>
                <option value="lead" className="bg-[#0f0f13] text-white">Lead Auditor / Principal / CISO (8+ yrs)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="font-semibold text-text-secondary block mb-1">Professional Bio & Audit Background</label>
              <textarea
                rows={2}
                placeholder="Brief summary of your cybersecurity responsibilities, target certifications, or compliance framework focus..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-text-primary focus:border-primary-light focus:outline-none backdrop-blur-sm resize-none"
              />
            </div>
          </div>

          <div className="pt-2 text-xs">
            <label className="font-semibold text-text-secondary block mb-1">Active Role</label>
            <div className="flex flex-wrap gap-3">
              {(['student', 'instructor', 'admin'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setUserRole(r);
                    loginAs(r);
                  }}
                  className={`px-4 py-2 rounded-xl border text-xs font-bold capitalize transition-all backdrop-blur-sm ${
                    userRole === r
                      ? 'border-primary-light bg-primary/30 text-white shadow-sm'
                      : 'border-white/10 bg-white/[0.03] text-text-muted hover:text-text-primary hover:border-white/20'
                  }`}
                >
                  {r === 'student' ? 'Student' : r === 'instructor' ? 'Instructor / Lead Auditor' : 'Administrator'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Learning Targets & Notifications */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8 space-y-4 backdrop-blur-xl shadow-lg">
          <div className="flex items-center gap-2 text-text-primary font-bold text-sm">
            <Bell className="h-4 w-4 text-accent-light" />
            <span>Study Goals & Reminders</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-text-secondary block mb-1">Daily Study Target</label>
              <select
                value={studyTarget}
                onChange={(e) => setStudyTarget(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-text-primary focus:border-primary-light focus:outline-none backdrop-blur-sm"
              >
                <option value="15" className="bg-[#0f0f13] text-white">15 Minutes / Day (Casual Sprint)</option>
                <option value="30" className="bg-[#0f0f13] text-white">30 Minutes / Day (Recommended)</option>
                <option value="60" className="bg-[#0f0f13] text-white">60 Minutes / Day (Intensive Certification)</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm">
              <div>
                <span className="font-semibold text-text-primary block">Streak & Exam Alerts</span>
                <span className="text-[11px] text-text-muted">Daily motivation notifications</span>
              </div>
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="h-4 w-4 accent-primary rounded"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          <div>
            {saveSuccess && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 animate-in fade-in">
                <CheckCircle2 className="h-4 w-4" />
                <span>Profile Preferences Saved!</span>
              </span>
            )}
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-white hover:bg-primary-dark transition-all shadow-md shadow-primary/20"
          >
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </button>
        </div>

      </form>

      {/* Reset & Fresh Start Zone */}
      <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-6 sm:p-8 space-y-4 backdrop-blur-xl shadow-lg">
        <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
          <Trash2 className="h-4 w-4" />
          <span>Progress Management</span>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed max-w-xl">
          Reset all your lesson progress, exam completions, and earned XP back to 0.
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all progress to 0 XP and clear completed lessons?')) {
                startFreshUser(userRole, name, email);
              }
            }}
            className="flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/20 px-4 py-2.5 text-xs font-bold text-rose-300 hover:bg-rose-500/30 transition-all backdrop-blur-sm"
          >
            <Sparkles className="h-4 w-4" />
            <span>Reset Progress to 0 XP</span>
          </button>
        </div>
      </div>

    </div>
  );
};

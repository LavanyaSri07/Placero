import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Company } from '../types/index.ts';
import {
  ShieldCheck,
  Plus,
  CheckCircle2,
  Calendar,
  Building2,
  HelpCircle,
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const { companies, refreshData } = useApp();

  const [isAddingCompany, setIsAddingCompany] = useState(false);
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [category, setCategory] = useState<'Core Engineering' | 'Software / Technology'>('Core Engineering');
  const [logo, setLogo] = useState('🏭');
  const [careersUrl, setCareersUrl] = useState('');
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const handleVerify = async (companyId: string) => {
    setVerifyingId(companyId);
    try {
      await fetch(`/api/admin/company/${companyId}/verify`, { method: 'PATCH' });
      await refreshData();
    } catch (err) {
      console.error('Failed to verify company:', err);
    } finally {
      setVerifyingId(null);
    }
  };

  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !industry) return;

    try {
      await fetch('/api/admin/company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          industry,
          category,
          logo,
          majorBusinessAreas: ['Manufacturing', 'Engineering Operations'],
          relevantRoles: ['Graduate Engineer Trainee (GET)'],
          relevantBranches: ['Chemical Engineering', 'Mechanical Engineering', 'Electrical Engineering'],
          frequentlyRequestedSkills: ['Engineering Fundamentals', 'Safety Standards', 'Problem Solving'],
          typicalAssessmentStages: ['Aptitude & Technical Screening', 'Technical Panel Viva', 'HR Fitment'],
          examplePreparationTopics: ['Unit Operations & Equipment Sizing', 'Boundary Assumptions in Design'],
          officialCareersUrl: careersUrl || 'https://careers.example.com',
          sourceReference: 'Verified Placement Office Liaison',
          hiringDifficulty: 'Challenging',
          reverseAuditPrompt: `Audit the core manufacturing line for ${name} to identify energy and downtime bottlenecks.`,
        }),
      });

      setName('');
      setIndustry('');
      setCareersUrl('');
      setIsAddingCompany(false);
      await refreshData();
    } catch (err) {
      console.error('Error creating company:', err);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider mb-1">
              <span>System Administration</span>
              <span>•</span>
              <span>Employer Content Governance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>Admin Management Panel</span>
              <ShieldCheck className="w-7 h-7 text-sky-400" />
            </h1>
            <p className="text-xs lg:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              <strong>Webpage Objective:</strong> Placement coordination and system governance portal. Enables placement cell officers and administrators to register new hiring organizations, update and stamp verification dates on employer hiring stages, and manage custom technical assessment questions with real-time SQLite database persistence.
            </p>
          </div>

          <button
            onClick={() => setIsAddingCompany(!isAddingCompany)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-md transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isAddingCompany ? 'Close Creator' : 'Add New Recruiter'}</span>
          </button>
        </div>
      </div>

      {/* ADD RECRUITER FORM */}
      {isAddingCompany && (
        <form
          onSubmit={handleAddCompany}
          className="bg-slate-900 border border-sky-500/30 rounded-2xl p-6 shadow-xl space-y-4 animate-in fade-in"
        >
          <div className="border-b border-slate-800 pb-3">
            <h2 className="font-bold text-base text-white">Add New Company & Placement Requirements</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Company Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Asian Paints, Cummins, Honeywell"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Industry / Domain</label>
              <input
                type="text"
                required
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. Paints, Power, Automation"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Emoji Icon / Logo</label>
              <input
                type="text"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Official Careers URL</label>
            <input
              type="url"
              value={careersUrl}
              onChange={(e) => setCareersUrl(e.target.value)}
              placeholder="https://company.com/careers"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingCompany(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition"
            >
              Save Company to Database
            </button>
          </div>
        </form>
      )}

      {/* Recruiter Management Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="font-bold text-base text-white">Registered Companies ({companies.length})</h2>
          <span className="text-xs text-slate-400">Click verify to refresh verification date to today</span>
        </div>

        <div className="space-y-3">
          {companies.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{c.logo}</span>
                <div>
                  <h3 className="font-bold text-sm text-white">{c.name}</h3>
                  <div className="text-xs text-slate-400">{c.industry} • {c.category}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right text-xs">
                  <span className="text-slate-400">Last Verified:</span>
                  <div className="font-mono text-emerald-400 font-bold">{c.lastVerifiedDate}</div>
                </div>

                <button
                  onClick={() => handleVerify(c.id)}
                  disabled={verifyingId === c.id}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-sky-400 border border-slate-700 transition flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{verifyingId === c.id ? 'Updating...' : 'Mark Verified'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Company } from '../types/index.ts';
import {
  Building2,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Layers,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  BookOpen,
  HelpCircle,
  GitBranch,
} from 'lucide-react';

export const CompanyWarRoomView: React.FC = () => {
  const {
    companies,
    selectedCompany,
    setSelectedCompany,
    setActiveTab,
    setIsAIChatOpen,
    user,
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'skills' | 'roadmap' | 'questions'>('overview');

  const categories = ['All', 'Core Engineering', 'Software / Technology'];

  const filteredCompanies = companies.filter((c) => {
    if (activeCategory === 'All') return true;
    return c.category === activeCategory;
  });

  const company = selectedCompany || companies[0];

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">
              <span>Target Preparation System</span>
              <span>•</span>
              <span>Verified Employer Standards</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>Company War Room</span>
              <span className="text-2xl">{company?.logo}</span>
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Targeted engineering intelligence, skill radars, hiring stages, and official career links. Master company-specific expectations instead of generic preparation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('reverse-audit')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-md transition"
            >
              <GitBranch className="w-4 h-4" />
              <span>Reverse Audit This Plant</span>
            </button>
          </div>
        </div>

        {/* Company Quick-Selector Pills */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-slate-400">Filter Industry:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition ${
                  activeCategory === cat
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Company horizontally scrollable chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {filteredCompanies.map((c) => {
              const isSelected = company?.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCompany(c)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition border ${
                    isSelected
                      ? 'bg-purple-600/30 text-purple-200 border-purple-500/60 shadow-sm'
                      : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-sm">{c.logo}</span>
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main War Room Card */}
      {company && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {/* Sub Navigation Bar */}
          <div className="bg-slate-950/60 px-6 py-3 border-b border-slate-800 flex items-center justify-between flex-wrap gap-3">
            <div className="flex gap-2">
              {[
                { id: 'overview', label: 'Company Snapshot' },
                { id: 'skills', label: 'Skill Radar & Gaps' },
                { id: 'roadmap', label: 'Preparation Roadmap' },
                { id: 'questions', label: 'Interview Questions' },
              ].map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setActiveSubTab(sub.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    activeSubTab === sub.id
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* Verification Badge */}
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>
                Information last verified: <strong className="text-slate-200">{company.lastVerifiedDate}</strong>
              </span>
            </div>
          </div>

          <div className="p-6">
            {/* OVERVIEW SUBTAB */}
            {activeSubTab === 'overview' && (
              <div className="space-y-6">
                {/* Meta details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                    <div className="text-xs text-slate-400 font-semibold">Industry & Focus</div>
                    <div className="font-bold text-slate-200 text-sm mt-1">{company.industry}</div>
                    <div className="text-xs text-purple-400 mt-2 font-mono">Category: {company.category}</div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                    <div className="text-xs text-slate-400 font-semibold">Hiring Rigor</div>
                    <div className="font-bold text-amber-300 text-sm mt-1">{company.hiringDifficulty} Level</div>
                    <div className="text-xs text-slate-400 mt-2">
                      Assessment: Aptitude + Technical Panel + Case Viva
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                    <div className="text-xs text-slate-400 font-semibold">Relevant Branches</div>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {company.relevantBranches.map((b) => (
                        <span key={b} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Major Business Areas & Roles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                    <h3 className="font-bold text-sm text-white mb-2 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-sky-400" />
                      <span>Major Business Areas & Assets</span>
                    </h3>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {company.majorBusinessAreas.map((area, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                          <span>{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                    <h3 className="font-bold text-sm text-white mb-2 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-purple-400" />
                      <span>Relevant Campus Roles</span>
                    </h3>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {company.relevantRoles.map((role, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{role}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Reverse Audit Scenario Prompt */}
                <div className="p-5 rounded-xl bg-gradient-to-r from-purple-950/30 to-indigo-950/30 border border-purple-500/30">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-300 mb-1">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>Real-World Engineering Challenge (Reverse Audit)</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    "{company.reverseAuditPrompt}"
                  </p>
                  <button
                    onClick={() => setActiveTab('reverse-audit')}
                    className="mt-3 text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1"
                  >
                    <span>Launch full reverse engineering audit report</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Official Sources & Disclaimer */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                      <span className="font-semibold text-slate-300">Source Transparency & Disclaimer:</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <a
                        href={company.officialCareersUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sky-400 hover:underline flex items-center gap-1 font-bold"
                      >
                        <span>Official Careers</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      {company.officialEngineeringBlogUrl && (
                        <a
                          href={company.officialEngineeringBlogUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-purple-400 hover:underline flex items-center gap-1 font-bold"
                        >
                          <span>Engineering / Tech Stories</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-400">
                    Source: {company.sourceReference}. Placero presents verified preparation patterns and publicly documented campus curriculum requirements. We do NOT present company information as guaranteed hiring criteria.
                  </p>
                </div>
              </div>
            )}

            {/* SKILLS SUBTAB */}
            {activeSubTab === 'skills' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-base text-white mb-1">Frequently Requested Skills Radar</h3>
                  <p className="text-xs text-slate-400">
                    Compare your current verified evidence against {company.name}'s technical assessment benchmarks.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {company.frequentlyRequestedSkills.map((skillName, idx) => {
                    const userSkillMatch = user?.currentSkills.find(
                      (s) => s.name.toLowerCase().includes(skillName.toLowerCase()) || skillName.toLowerCase().includes(s.name.toLowerCase())
                    );
                    const userLevel = userSkillMatch ? userSkillMatch.level : 65 + (idx % 3) * 8;
                    const targetBenchmark = 80;

                    return (
                      <div key={idx} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-200">{skillName}</span>
                          <span className="font-mono text-sky-400 font-bold">{userLevel}% readiness</span>
                        </div>

                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all duration-700 ${
                              userLevel >= targetBenchmark ? 'bg-emerald-400' : 'bg-sky-400'
                            }`}
                            style={{ width: `${userLevel}%` }}
                          />
                        </div>

                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>Target: {targetBenchmark}%</span>
                          <span className={userLevel >= targetBenchmark ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                            {userLevel >= targetBenchmark ? 'Benchmark Met ✓' : `Gap: -${targetBenchmark - userLevel}%`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 flex items-center justify-between">
                  <div className="text-xs text-slate-300">
                    Need a project proof artifact to close the gap for <strong className="text-white">{company.name}</strong>?
                  </div>
                  <button
                    onClick={() => setActiveTab('proof-lab')}
                    className="px-3.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold transition"
                  >
                    Build Proof Now
                  </button>
                </div>
              </div>
            )}

            {/* ROADMAP SUBTAB */}
            {activeSubTab === 'roadmap' && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-bold text-base text-white mb-1">4-Week Placement Prep Roadmap</h3>
                  <p className="text-xs text-slate-400">
                    Targeted milestones structured specifically for {company.name}'s assessment stages.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      week: 'Week 1',
                      title: 'Core Fundamentals & Boundary Assumptions',
                      deliverable: 'Master unit operations, material/energy balances, and state boundary assumptions cold.',
                      action: 'Solve 20 high-frequency conceptual problems and review the Mistake Vault.',
                    },
                    {
                      week: 'Week 2',
                      title: 'Company-Specific Technical Deep Dive',
                      deliverable: `Study ${company.majorBusinessAreas[0] || 'primary manufacturing units'} and equipment sizing.`,
                      action: 'Complete one verified project proof and document the Bill of Materials.',
                    },
                    {
                      week: 'Week 3',
                      title: 'STAR-L Mock Interview Training',
                      deliverable: 'Simulate high-pressure technical viva and behavioral failure situations.',
                      action: 'Record 3 voice answers in Mock Interview mode; eliminate filler words.',
                    },
                    {
                      week: 'Week 4',
                      title: 'Reverse Audit & 30-60-90 Day Plan',
                      deliverable: 'Demonstrate immediate operational value and safety consciousness to the panel.',
                      action: 'Generate your 100-Day Contribution Plan for GET onboarding.',
                    },
                  ].map((phase, idx) => (
                    <div key={idx} className="flex gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center font-black text-sm shrink-0">
                        W{idx + 1}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{phase.title}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                            {phase.week}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300">{phase.deliverable}</p>
                        <p className="text-[11px] text-sky-400 font-semibold mt-1">Recommended Action: {phase.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* QUESTIONS SUBTAB */}
            {activeSubTab === 'questions' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-base text-white mb-1">Company-Specific Interview Practice</h3>
                    <p className="text-xs text-slate-400">
                      Questions asked in campus interview rounds for {company.name}.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('mock-interview')}
                    className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <span>Practice in Voice Lab</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {company.examplePreparationTopics.map((topic, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">Topic {idx + 1}: {topic}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 font-semibold">
                          Technical Viva
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Interviewers test first-principles understanding, safety interlocks, and quantitative sizing.
                      </p>
                      <div className="flex justify-end">
                        <button
                          onClick={() => setIsAIChatOpen(true)}
                          className="text-[11px] font-bold text-sky-400 hover:underline flex items-center gap-1"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>Ask Placero AI to test me on this</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

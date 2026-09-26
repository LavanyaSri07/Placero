import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Map,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  Filter,
  Plus,
  ArrowRight,
  Printer,
  Compass,
  AlertCircle,
  Building2,
  GraduationCap,
  Calendar,
  Layers,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { RoadmapMilestone, TimelinePhase, EngineeringBranch } from '../types/index.ts';

export const RoadmapView: React.FC = () => {
  const {
    roadmap,
    user,
    companies,
    toggleRoadmapMilestone,
    generateTailoredRoadmap,
    updateRoadmapMilestones,
    setActiveTab,
    setSelectedCompany,
  } = useApp();

  const [selectedPhase, setSelectedPhase] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // New Milestone Form
  const [newTitle, setNewTitle] = useState('');
  const [newPhase, setNewPhase] = useState<TimelinePhase>('T-30 Days (Company Specifics)');
  const [newCategory, setNewCategory] = useState<RoadmapMilestone['category']>('Core Engineering');
  const [newDescription, setNewDescription] = useState('');
  const [newDeliverable, setNewDeliverable] = useState('');
  const [newHours, setNewHours] = useState(10);
  const [newPriority, setNewPriority] = useState<'Critical' | 'High' | 'Medium'>('High');

  // Generator settings
  const [targetCompany, setTargetCompany] = useState(
    roadmap?.targetCompany || user?.targetCompanies?.[0] || 'Reliance Industries Limited'
  );
  const [targetBranch, setTargetBranch] = useState<EngineeringBranch>(
    roadmap?.branch || user?.branch || 'Chemical Engineering'
  );

  const milestones = roadmap?.milestones || [];
  const completedCount = milestones.filter((m) => m.completed).length;
  const totalCount = milestones.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const totalHours = milestones.reduce((acc, curr) => acc + (curr.recommendedTimeHours || 0), 0);
  const hoursRemaining = milestones
    .filter((m) => !m.completed)
    .reduce((acc, curr) => acc + (curr.recommendedTimeHours || 0), 0);

  const phases = [
    'All',
    'T-90 Days (Foundations)',
    'T-60 Days (Core Mastery)',
    'T-30 Days (Company Specifics)',
    'T-14 Days (Mock Interrogation)',
    'T-7 Days (Fine Tuning)',
    'T-1 Day (Final Calm)',
    'Interview Day (Execution)',
  ];

  const categories = [
    'All',
    'Core Engineering',
    'Proof Building',
    'Mock Interviews',
    'Company Intelligence',
    'Behavioral & STAR-L',
  ];

  const filteredMilestones = milestones.filter((m) => {
    const matchesPhase = selectedPhase === 'All' || m.phase === selectedPhase;
    const matchesCat = selectedCategory === 'All' || m.category === selectedCategory;
    return matchesPhase && matchesCat;
  });

  const handleToggle = async (id: string) => {
    await toggleRoadmapMilestone(id);
  };

  const handleAddMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newM: RoadmapMilestone = {
      id: `m-custom-${Date.now()}`,
      phase: newPhase,
      weekNumber: milestones.length + 1,
      title: newTitle.trim(),
      category: newCategory,
      description: newDescription.trim() || 'Custom study deliverable for placement preparation.',
      deliverable: newDeliverable.trim() || 'Complete targeted documentation or calculation verification.',
      recommendedTimeHours: Number(newHours) || 8,
      completed: false,
      priority: newPriority,
    };

    await updateRoadmapMilestones([...milestones, newM]);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewDescription('');
    setNewDeliverable('');
  };

  const handleGenerateTailored = async () => {
    setIsGenerating(true);
    try {
      await generateTailoredRoadmap(targetCompany, targetBranch);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper to direct user to corresponding placement module
  const navigateToModule = (category: string) => {
    switch (category) {
      case 'Proof Building':
        setActiveTab('proof-lab');
        break;
      case 'Mock Interviews':
        setActiveTab('mock-interview');
        break;
      case 'Company Intelligence':
        const matched = companies.find((c) => c.name.toLowerCase().includes(targetCompany.toLowerCase()));
        if (matched) setSelectedCompany(matched);
        setActiveTab('companies');
        break;
      case 'Behavioral & STAR-L':
        setActiveTab('resume-lab');
        break;
      case 'Core Engineering':
        setActiveTab('core-engineer');
        break;
      default:
        setActiveTab('dashboard');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ================= PAGE DESCRIPTION BANNER ================= */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-sky-950/40 to-slate-900 border border-sky-500/20 p-5 lg:p-6 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-sky-500/15 text-sky-400 border border-sky-500/30 flex items-center gap-1.5">
                <Map className="w-3.5 h-3.5" />
                Preparation Blueprint & Timeline
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Connected to SQLite Database
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-100 tracking-tight">
              Placement Preparation Roadmap
            </h1>
            <p className="mt-1.5 text-xs lg:text-sm text-slate-300 max-w-3xl leading-relaxed">
              <strong>Webpage Objective:</strong> This page delivers a structured, week-by-week engineering preparation timeline calibrated from <strong>T-90 days</strong> down to <strong>Interview Day</strong>. Every milestone outlines concrete technical deliverables, estimated study hours, and priority levels. Checking off milestones permanently updates your SQLite database profile and elevates your overall placement readiness score.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-sky-400" />
              <span>Add Custom Milestone</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Progress & Target Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Completion Card */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span>Roadmap Completion</span>
            <span className="text-sky-400 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden mb-2">
            <div
              className="bg-gradient-to-r from-sky-500 to-indigo-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="text-xs text-slate-300 flex items-center justify-between">
            <span>{completedCount} of {totalCount} completed</span>
            <span className="text-emerald-400 font-medium">
              {totalCount - completedCount} remaining
            </span>
          </div>
        </div>

        {/* Study Hours */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-semibold uppercase">Study Commitment</div>
            <div className="text-lg font-bold text-slate-100">{hoursRemaining} Hours Left</div>
            <div className="text-[11px] text-slate-400">{totalHours} total budgeted hrs</div>
          </div>
        </div>

        {/* Target Recruiter */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-slate-400 font-semibold uppercase">Target Recruiter</div>
            <div className="text-sm font-bold text-slate-100 truncate">
              {roadmap?.targetCompany || user?.targetCompanies?.[0] || 'Reliance Industries'}
            </div>
            <div className="text-[11px] text-sky-400 font-medium truncate">
              {roadmap?.branch || user?.branch || 'Engineering'}
            </div>
          </div>
        </div>

        {/* AI Recalibration Card */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-sky-500/30 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200">AI Tailored Roadmap</span>
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <p className="text-[11px] text-slate-400 my-1">
            Recalibrate timeline for specific recruiter & branch.
          </p>
          <button
            onClick={handleGenerateTailored}
            disabled={isGenerating}
            className="w-full py-1.5 px-3 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <div className="w-3.5 h-3.5 border-2 border-sky-400/20 border-t-sky-400 rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Regenerate Blueprint</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Recruiter & Branch Generator Selector Bar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            Custom Target:
          </span>
          <select
            value={targetCompany}
            onChange={(e) => setTargetCompany(e.target.value)}
            className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-semibold text-slate-200 focus:outline-none focus:border-sky-500"
          >
            {companies.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={targetBranch}
            onChange={(e) => setTargetBranch(e.target.value as EngineeringBranch)}
            className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-semibold text-slate-200 focus:outline-none focus:border-sky-500"
          >
            <option value="Chemical Engineering">Chemical Engineering</option>
            <option value="Mechanical Engineering">Mechanical Engineering</option>
            <option value="Electrical Engineering">Electrical Engineering</option>
            <option value="Electronics & Communication">Electronics & Communication</option>
            <option value="Computer Science & IT">Computer Science & IT</option>
            <option value="Civil Engineering">Civil Engineering</option>
          </select>
        </div>

        <button
          onClick={handleGenerateTailored}
          disabled={isGenerating}
          className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-sky-600/20 cursor-pointer disabled:opacity-50"
        >
          <Sparkles className="w-3 h-3" />
          <span>Sync Database Roadmap</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="space-y-3">
        {/* Phase Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-bold uppercase text-[10px] shrink-0 mr-1 flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Phase:
          </span>
          {phases.map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPhase(p)}
              className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition cursor-pointer ${
                selectedPhase === p
                  ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/30'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-bold uppercase text-[10px] shrink-0 mr-1 flex items-center gap-1">
            <Layers className="w-3 h-3" /> Category:
          </span>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition cursor-pointer ${
                selectedCategory === c
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Milestones List */}
      <div className="space-y-3">
        {filteredMilestones.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800">
            <Filter className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold text-slate-300">No milestones match the current filter.</p>
            <button
              onClick={() => {
                setSelectedPhase('All');
                setSelectedCategory('All');
              }}
              className="mt-3 text-xs text-sky-400 hover:underline font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredMilestones.map((m) => {
            const isCritical = m.priority === 'Critical';
            const isHigh = m.priority === 'High';

            return (
              <div
                key={m.id}
                className={`group p-4 lg:p-5 rounded-2xl border transition-all duration-200 ${
                  m.completed
                    ? 'bg-slate-900/50 border-emerald-500/30 hover:border-emerald-500/50'
                    : isCritical
                    ? 'bg-slate-900/90 border-slate-800 hover:border-rose-500/40 shadow-sm'
                    : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {/* Interactive Completion Toggle (Writes to real database!) */}
                  <button
                    onClick={() => handleToggle(m.id)}
                    title={m.completed ? 'Mark pending' : 'Mark completed in database'}
                    className={`mt-1 shrink-0 transition transform active:scale-95 cursor-pointer ${
                      m.completed
                        ? 'text-emerald-400 hover:text-emerald-300'
                        : 'text-slate-400 hover:text-sky-400'
                    }`}
                  >
                    {m.completed ? (
                      <CheckCircle2 className="w-6 h-6 fill-emerald-500/10" />
                    ) : (
                      <Circle className="w-6 h-6" />
                    )}
                  </button>

                  {/* Main Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        Week {m.weekNumber}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">{m.phase}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/20">
                        {m.category}
                      </span>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isCritical
                            ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                            : isHigh
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {m.priority} Priority
                      </span>

                      {m.completed && (
                        <span className="ml-auto text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Saved in DB
                        </span>
                      )}
                    </div>

                    <h3
                      className={`text-base font-bold transition ${
                        m.completed ? 'text-slate-400 line-through' : 'text-slate-100'
                      }`}
                    >
                      {m.title}
                    </h3>

                    <p className="mt-1 text-xs text-slate-400 leading-relaxed">{m.description}</p>

                    {/* Key Deliverable Box */}
                    {m.deliverable && (
                      <div className="mt-3 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 shrink-0 mt-0.5">
                          Deliverable:
                        </span>
                        <span className="text-xs text-slate-300 leading-snug">{m.deliverable}</span>
                      </div>
                    )}

                    {/* Footer Row */}
                    <div className="mt-3 pt-3 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>Recommended: {m.recommendedTimeHours} Hours</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigateToModule(m.category)}
                          className="flex items-center gap-1 text-[11px] font-semibold text-sky-400 hover:text-sky-300 transition hover:underline cursor-pointer"
                        >
                          <span>Open Associated Tool</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Add Custom Milestone */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Plus className="w-5 h-5 text-sky-400" />
              Add Custom Preparation Milestone
            </h2>
            <p className="text-xs text-slate-400">
              Save a personalized milestone to your persistent SQLite database roadmap.
            </p>

            <form onSubmit={handleAddMilestone} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Milestone Title *
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Master Kern Shell & Tube Heat Exchanger rating"
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phase</label>
                  <select
                    value={newPhase}
                    onChange={(e) => setNewPhase(e.target.value as TimelinePhase)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                  >
                    {phases.filter((p) => p !== 'All').map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                  >
                    {categories.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={2}
                  placeholder="Specific topics to study and core formulas to derive..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Required Deliverable
                </label>
                <input
                  type="text"
                  value={newDeliverable}
                  onChange={(e) => setNewDeliverable(e.target.value)}
                  placeholder="e.g. Completed calculation spreadsheet verified with peer review"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Study Hours Estimate
                  </label>
                  <input
                    type="number"
                    value={newHours}
                    onChange={(e) => setNewHours(Number(e.target.value))}
                    min={1}
                    max={60}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-sky-500 hover:bg-sky-400 rounded-xl shadow-md transition"
                >
                  Save Milestone to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

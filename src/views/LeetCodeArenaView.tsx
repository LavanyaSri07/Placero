import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Code2,
  Terminal,
  Play,
  CheckCircle2,
  Clock,
  Cpu,
  Layers,
  Search,
  Filter,
  Sparkles,
  Award,
  BookOpen,
  RotateCcw,
  FileCode,
  Braces,
  ChevronRight,
  ExternalLink,
  Save,
  Flame,
  Zap,
  Tag,
  Building2,
  Brain,
  ArrowRight,
  Check,
  Circle,
  HelpCircle,
} from 'lucide-react';
import {
  LeetCodeProblem,
  LeetCodeDifficulty,
  LeetCodeCategory,
  LeetCodeSubmissionResult,
} from '../types/index.ts';

export const LeetCodeArenaView: React.FC = () => {
  const {
    leetcodeProblems,
    activeLeetcodeProblem,
    setActiveLeetcodeProblem,
    submitLeetCodeSolution,
    runLeetCodeCode,
    saveLeetCodeNote,
    user,
    triggerConfetti,
  } = useApp();

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCompany, setSelectedCompany] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'catalog' | 'workspace'>('catalog');

  // Workspace code editor states
  const [currentLanguage, setCurrentLanguage] = useState<'python' | 'javascript' | 'cpp' | 'java'>('python');
  const [code, setCode] = useState<string>('');
  const [activeLeftTab, setActiveLeftTab] = useState<'description' | 'solution' | 'notes'>('description');
  const [notes, setNotes] = useState<string>('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [notesSavedNotice, setNotesSavedNotice] = useState(false);

  // Execution & Test results state
  const [selectedTestCaseIndex, setSelectedTestCaseIndex] = useState(0);
  const [customInput, setCustomInput] = useState('');
  const [isCustomTest, setIsCustomTest] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [runResult, setRunResult] = useState<any | null>(null);
  const [submissionResult, setSubmissionResult] = useState<LeetCodeSubmissionResult | null>(null);
  const [expandedHintIndex, setExpandedHintIndex] = useState<number | null>(null);

  // Choose default problem if none active
  useEffect(() => {
    if (!activeLeetcodeProblem && leetcodeProblems.length > 0) {
      // Pick first or first unsolved
      const firstUnsolved = leetcodeProblems.find((p) => !p.solved) || leetcodeProblems[0];
      setActiveLeetcodeProblem(firstUnsolved);
    }
  }, [leetcodeProblems, activeLeetcodeProblem, setActiveLeetcodeProblem]);

  // Synchronize editor code when active problem changes
  useEffect(() => {
    if (activeLeetcodeProblem) {
      if (activeLeetcodeProblem.userCode) {
        setCode(activeLeetcodeProblem.userCode);
      } else {
        const langCode = activeLeetcodeProblem.starterCode[currentLanguage] || activeLeetcodeProblem.starterCode['python'] || '';
        setCode(langCode);
      }
      setNotes(activeLeetcodeProblem.notes || '');
      setRunResult(null);
      setSubmissionResult(null);
      setExpandedHintIndex(null);
      setSelectedTestCaseIndex(0);
    }
  }, [activeLeetcodeProblem, currentLanguage]);

  // Stats calculation
  const totalProblems = leetcodeProblems.length;
  const solvedCount = leetcodeProblems.filter((p) => p.solved).length;
  const easyTotal = leetcodeProblems.filter((p) => p.difficulty === 'Easy').length;
  const easySolved = leetcodeProblems.filter((p) => p.difficulty === 'Easy' && p.solved).length;
  const mediumTotal = leetcodeProblems.filter((p) => p.difficulty === 'Medium').length;
  const mediumSolved = leetcodeProblems.filter((p) => p.difficulty === 'Medium' && p.solved).length;
  const hardTotal = leetcodeProblems.filter((p) => p.difficulty === 'Hard').length;
  const hardSolved = leetcodeProblems.filter((p) => p.difficulty === 'Hard' && p.solved).length;

  // Categories & Companies lists for filters
  const categories = ['All', ...Array.from(new Set(leetcodeProblems.map((p) => p.category)))];
  const allCompaniesSet = new Set<string>();
  leetcodeProblems.forEach((p) => p.companies?.forEach((c) => allCompaniesSet.add(c)));
  const companiesList = ['All', ...Array.from(allCompaniesSet)];

  // Filtered problems
  const filteredProblems = leetcodeProblems.filter((p) => {
    const matchesSearch =
      searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.number.toString().includes(searchQuery) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDifficulty = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesCompany = selectedCompany === 'All' || p.companies.includes(selectedCompany);
    const matchesStatus =
      selectedStatus === 'All' ||
      (selectedStatus === 'Solved' && p.solved) ||
      (selectedStatus === 'Todo' && !p.solved);

    return matchesSearch && matchesDifficulty && matchesCategory && matchesCompany && matchesStatus;
  });

  // Daily Challenge problem (pick #1 or #121 or current date hash)
  const dailyProblem = leetcodeProblems.find((p) => p.number === 1) || leetcodeProblems[0];

  const handleSelectProblem = (prob: LeetCodeProblem) => {
    setActiveLeetcodeProblem(prob);
    setActiveTab('workspace');
  };

  const handleResetCode = () => {
    if (!activeLeetcodeProblem) return;
    const starter = activeLeetcodeProblem.starterCode[currentLanguage] || '';
    setCode(starter);
  };

  const handleSaveNotes = async () => {
    if (!activeLeetcodeProblem) return;
    setIsSavingNotes(true);
    await saveLeetCodeNote(activeLeetcodeProblem.id, notes);
    setIsSavingNotes(false);
    setNotesSavedNotice(true);
    setTimeout(() => setNotesSavedNotice(false), 2500);
  };

  const handleRunCode = async () => {
    if (!activeLeetcodeProblem) return;
    setIsRunning(true);
    setRunResult(null);
    setSubmissionResult(null);

    const inputToTest = isCustomTest
      ? customInput
      : activeLeetcodeProblem.examples[selectedTestCaseIndex]?.input || '';

    const res = await runLeetCodeCode(activeLeetcodeProblem.id, code, currentLanguage, inputToTest);
    setIsRunning(false);
    setRunResult(res);
  };

  const handleSubmitSolution = async () => {
    if (!activeLeetcodeProblem) return;
    setIsSubmitting(true);
    setRunResult(null);
    setSubmissionResult(null);

    const res = await submitLeetCodeSolution(activeLeetcodeProblem.id, {
      code,
      language: currentLanguage,
      notes,
    });

    setIsSubmitting(false);
    if (res) {
      setSubmissionResult(res);
    }
  };

  const getDifficultyColor = (diff: LeetCodeDifficulty) => {
    switch (diff) {
      case 'Easy':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Medium':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Hard':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Title Bar */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-indigo-500/10 via-sky-500/5 to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-sky-500/15 text-sky-400 border border-sky-500/30 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5" />
                LeetCode & Technical DSA Arena
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                Blind 75 · Top 150 · Campus Placement Coding Rounds
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Algorithmic Problem Solving Console</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Master the algorithmic patterns tested by top tech enterprises and engineering conglomerates.
              Compile, execute test vectors, analyze Big-O complexity, and verify performance benchmarks saved directly to your profile.
            </p>
          </div>

          {/* Quick Tab Switcher */}
          <div className="flex items-center gap-2 self-start lg:self-center shrink-0 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'catalog'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Problem Catalog</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-300">
                {totalProblems}
              </span>
            </button>

            <button
              onClick={() => {
                if (activeLeetcodeProblem) setActiveTab('workspace');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'workspace'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Code Workspace</span>
              {activeLeetcodeProblem && (
                <span className="max-w-[120px] truncate text-[10px] text-slate-300">
                  #{activeLeetcodeProblem.number}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Analytics Progress Cockpit */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800/80 text-xs">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
            <div className="text-slate-400 font-medium text-[11px] flex items-center justify-between">
              <span>Total Solved</span>
              <Award className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-xl font-black text-white">{solvedCount}</span>
              <span className="text-slate-500 font-semibold">/ {totalProblems}</span>
              <span className="text-[11px] text-emerald-400 font-bold ml-auto">
                {totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all"
                style={{ width: `${totalProblems > 0 ? (solvedCount / totalProblems) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
            <div className="text-slate-400 font-medium text-[11px] flex items-center justify-between">
              <span className="text-emerald-400 font-semibold">Easy</span>
              <span className="text-emerald-400 font-bold">{easySolved}/{easyTotal}</span>
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all"
                  style={{ width: `${easyTotal > 0 ? (easySolved / easyTotal) * 100 : 0}%` }}
                />
              </div>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Fundamentals & Two Pointers</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
            <div className="text-slate-400 font-medium text-[11px] flex items-center justify-between">
              <span className="text-amber-400 font-semibold">Medium</span>
              <span className="text-amber-400 font-bold">{mediumSolved}/{mediumTotal}</span>
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all"
                  style={{ width: `${mediumTotal > 0 ? (mediumSolved / mediumTotal) * 100 : 0}%` }}
                />
              </div>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Top Placement Interview Tier</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
            <div className="text-slate-400 font-medium text-[11px] flex items-center justify-between">
              <span className="text-sky-400 font-semibold">Best Benchmark</span>
              <Zap className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl font-black text-sky-300">52 ms</span>
              <span className="text-[10px] text-emerald-400 font-bold ml-auto">Beats 89.2%</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Memory: 15.4MB (O(N) single-pass)</span>
          </div>
        </div>
      </div>

      {/* VIEW 1: PROBLEM CATALOG */}
      {activeTab === 'catalog' && (
        <div className="space-y-5">
          {/* Daily Problem Recommendation Card */}
          {dailyProblem && (
            <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900/80 to-slate-900/80 border border-indigo-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 text-indigo-400">
                  <Flame className="w-5 h-5 text-indigo-400 fill-indigo-400/20" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-indigo-300 tracking-wider uppercase">
                      Problem of the Day
                    </span>
                    <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      +100 XP Daily Bonus
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-0.5 flex items-center gap-2">
                    <span>#{dailyProblem.number}. {dailyProblem.title}</span>
                    <span className={`px-2 py-0.2 rounded-md text-[10px] font-bold border ${getDifficultyColor(dailyProblem.difficulty)}`}>
                      {dailyProblem.difficulty}
                    </span>
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                    <span>{dailyProblem.category}</span>
                    <span>·</span>
                    <span>Acceptance: {dailyProblem.acceptanceRate}</span>
                    <span>·</span>
                    <span className="text-slate-300 font-medium">
                      Asked by: {dailyProblem.companies?.slice(0, 3).join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleSelectProblem(dailyProblem)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs transition shadow-md shadow-sky-500/20 flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <span>Solve in Arena</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Filters & Search Header */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex flex-col md:flex-row items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search problems by name, number (#1), category, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500/60"
                />
              </div>

              {/* Difficulty filter */}
              <div className="flex items-center gap-1.5 shrink-0 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition cursor-pointer ${
                      selectedDifficulty === diff
                        ? 'bg-slate-800 text-white border border-slate-700'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>

              {/* Status filter */}
              <div className="flex items-center gap-1 shrink-0 w-full md:w-auto bg-slate-950 p-1 rounded-lg border border-slate-800">
                {['All', 'Solved', 'Todo'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setSelectedStatus(st)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                      selectedStatus === st
                        ? 'bg-sky-500/20 text-sky-300 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Category / Company Pill Selectors */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800/60 text-xs">
              <span className="text-[11px] text-slate-500 font-semibold mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Patterns:
              </span>
              {categories.slice(0, 7).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold'
                      : 'bg-slate-950/60 text-slate-400 hover:text-slate-300 border border-slate-800/80'
                  }`}
                >
                  {cat}
                </button>
              ))}

              {/* Company tag selector */}
              <span className="text-[11px] text-slate-500 font-semibold ml-auto mr-1 flex items-center gap-1">
                <Building2 className="w-3 h-3" /> Company:
              </span>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-[11px] text-slate-300 px-2.5 py-1 rounded-lg focus:outline-none focus:border-sky-500"
              >
                {companiesList.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Problem List Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4 w-12 text-center">Status</th>
                    <th className="py-3 px-4">Title & Pattern</th>
                    <th className="py-3 px-4 w-28">Difficulty</th>
                    <th className="py-3 px-4 w-28">Acceptance</th>
                    <th className="py-3 px-4 hidden md:table-cell">Target Companies</th>
                    <th className="py-3 px-4 w-24 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredProblems.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500">
                        <Code2 className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
                        <p className="font-semibold text-sm text-slate-400">No problems found</p>
                        <p className="text-xs text-slate-500 mt-1">Try resetting your search query or filters.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredProblems.map((prob) => (
                      <tr
                        key={prob.id}
                        onClick={() => handleSelectProblem(prob)}
                        className="hover:bg-slate-800/50 transition cursor-pointer group"
                      >
                        {/* Status Icon */}
                        <td className="py-3.5 px-4 text-center">
                          {prob.solved ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 mx-auto" />
                          )}
                        </td>

                        {/* Title & Pattern */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white group-hover:text-sky-300 transition">
                              {prob.number}. {prob.title}
                            </span>
                            {prob.runtimeMs && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                {prob.runtimeMs}ms
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] text-slate-400">{prob.category}</span>
                            <span className="text-slate-600">·</span>
                            <div className="flex items-center gap-1">
                              {prob.tags.slice(0, 2).map((t) => (
                                <span
                                  key={t}
                                  className="text-[10px] px-1.5 py-0.2 rounded bg-slate-950 text-slate-400 border border-slate-800"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        </td>

                        {/* Difficulty */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-md font-bold text-[10px] border ${getDifficultyColor(
                              prob.difficulty
                            )}`}
                          >
                            {prob.difficulty}
                          </span>
                        </td>

                        {/* Acceptance */}
                        <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                          {prob.acceptanceRate}
                        </td>

                        {/* Companies */}
                        <td className="py-3.5 px-4 hidden md:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {prob.companies?.slice(0, 3).map((comp) => (
                              <span
                                key={comp}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950/80 text-slate-400 border border-slate-800"
                              >
                                {comp}
                              </span>
                            ))}
                            {prob.companies && prob.companies.length > 3 && (
                              <span className="text-[10px] text-slate-500">
                                +{prob.companies.length - 3}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Action */}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectProblem(prob);
                            }}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-800 hover:bg-sky-500 text-slate-300 hover:text-white transition cursor-pointer"
                          >
                            {prob.solved ? 'Review' : 'Solve'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: ACTIVE CODING WORKSPACE */}
      {activeTab === 'workspace' && activeLeetcodeProblem && (
        <div className="space-y-4">
          {/* Top Problem Navigation & Meta Bar */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('catalog')}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-semibold cursor-pointer"
              >
                <span>← All Problems</span>
              </button>
              <span className="text-slate-600">|</span>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white">
                  #{activeLeetcodeProblem.number}. {activeLeetcodeProblem.title}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getDifficultyColor(
                    activeLeetcodeProblem.difficulty
                  )}`}
                >
                  {activeLeetcodeProblem.difficulty}
                </span>
                {activeLeetcodeProblem.solved && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Solved
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-start md:self-center">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mr-2">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Companies: {activeLeetcodeProblem.companies?.slice(0, 3).join(', ')}</span>
              </div>
            </div>
          </div>

          {/* Main Split Grid (Problem Details Left, Code Editor Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* LEFT COLUMN: Problem Details, Solution, Notes (5 cols) */}
            <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col min-h-[640px]">
              {/* Left Column Tabs */}
              <div className="flex items-center border-b border-slate-800 bg-slate-950/70 p-1 text-xs">
                <button
                  onClick={() => setActiveLeftTab('description')}
                  className={`flex-1 py-2 font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeLeftTab === 'description'
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Description</span>
                </button>

                <button
                  onClick={() => setActiveLeftTab('solution')}
                  className={`flex-1 py-2 font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeLeftTab === 'solution'
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Brain className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Editorial & Big-O</span>
                </button>

                <button
                  onClick={() => setActiveLeftTab('notes')}
                  className={`flex-1 py-2 font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeLeftTab === 'notes'
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                  <span>My Notes</span>
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-5 flex-1 overflow-y-auto space-y-4 max-h-[600px] text-xs">
                {activeLeftTab === 'description' && (
                  <div className="space-y-4">
                    {/* Tags & Companies */}
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 border border-slate-800 font-semibold">
                        Pattern: {activeLeetcodeProblem.category}
                      </span>
                      {activeLeetcodeProblem.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 border border-slate-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Description text */}
                    <div className="text-slate-200 leading-relaxed whitespace-pre-line font-sans text-xs">
                      {activeLeetcodeProblem.description}
                    </div>

                    {/* Examples */}
                    <div className="space-y-3 pt-2">
                      <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">
                        Examples
                      </h4>
                      {activeLeetcodeProblem.examples.map((ex, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 font-mono text-[11px] space-y-1.5"
                        >
                          <div className="text-slate-400">
                            <span className="text-sky-400 font-bold">Input:</span> {ex.input}
                          </div>
                          <div className="text-slate-400">
                            <span className="text-emerald-400 font-bold">Output:</span> {ex.output}
                          </div>
                          {ex.explanation && (
                            <div className="text-slate-500 font-sans text-[11px] pt-1 border-t border-slate-900">
                              <span className="font-semibold text-slate-400">Explanation:</span> {ex.explanation}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Constraints */}
                    <div className="space-y-2 pt-2">
                      <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">
                        Constraints
                      </h4>
                      <ul className="list-disc pl-4 space-y-1 text-slate-400 font-mono text-[11px]">
                        {activeLeetcodeProblem.constraints.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Progressive Hints Drawer */}
                    {activeLeetcodeProblem.hints && activeLeetcodeProblem.hints.length > 0 && (
                      <div className="pt-2 border-t border-slate-800/80 space-y-2">
                        <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                          <span>Progressive Hints</span>
                        </div>
                        {activeLeetcodeProblem.hints.map((hint, hIdx) => (
                          <div
                            key={hIdx}
                            className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden"
                          >
                            <button
                              onClick={() =>
                                setExpandedHintIndex(expandedHintIndex === hIdx ? null : hIdx)
                              }
                              className="w-full p-2.5 text-left text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-between cursor-pointer"
                            >
                              <span>Hint {hIdx + 1}</span>
                              <span className="text-[10px] text-sky-400">
                                {expandedHintIndex === hIdx ? 'Hide' : 'Reveal'}
                              </span>
                            </button>
                            {expandedHintIndex === hIdx && (
                              <div className="p-3 bg-slate-900/60 text-slate-300 text-xs border-t border-slate-800 leading-relaxed">
                                {hint}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeLeftTab === 'solution' && (
                  <div className="space-y-4">
                    <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Brain className="w-4 h-4 text-indigo-400" />
                        <span className="font-bold text-xs">Algorithmic Complexity Summary</span>
                      </div>
                      <div className="flex items-center gap-3 font-mono text-[11px]">
                        <span>Time: <strong className="text-white">{activeLeetcodeProblem.timeComplexity || 'O(N)'}</strong></span>
                        <span>·</span>
                        <span>Space: <strong className="text-white">{activeLeetcodeProblem.spaceComplexity || 'O(1)'}</strong></span>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 leading-relaxed whitespace-pre-line text-xs">
                      {activeLeetcodeProblem.solutionApproach || 'Optimal approach documentation is available for this pattern.'}
                    </div>

                    <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-slate-400 text-[11px] space-y-1">
                      <div className="font-semibold text-white">Placement Interview Tip:</div>
                      <p>
                        Always state your assumptions out loud before coding. Discuss the brute-force time complexity first (e.g. O(N^2)), then introduce the hash map or two-pointer optimization to show structured thinking.
                      </p>
                    </div>
                  </div>
                )}

                {activeLeftTab === 'notes' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Personal Problem Insights & Edge Cases:</span>
                      {notesSavedNotice && (
                        <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Saved to SQLite
                        </span>
                      )}
                    </div>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Write your personal notes for this problem (e.g., trap cases, off-by-one errors, recruiter follow-ups)..."
                      className="w-full h-64 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500/60 font-mono resize-none leading-relaxed"
                    />
                    <button
                      onClick={handleSaveNotes}
                      disabled={isSavingNotes}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Save className="w-3.5 h-3.5 text-sky-400" />
                      <span>{isSavingNotes ? 'Saving...' : 'Save Notes to Profile'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: Code Editor & Execution Console (7 cols) */}
            <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col min-h-[640px]">
              {/* Code Editor Header */}
              <div className="flex items-center justify-between bg-slate-950/80 px-4 py-2.5 border-b border-slate-800 text-xs">
                {/* Language Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-semibold text-[11px] flex items-center gap-1">
                    <Braces className="w-3.5 h-3.5 text-sky-400" /> Language:
                  </span>
                  <select
                    value={currentLanguage}
                    onChange={(e) => {
                      const newLang = e.target.value as any;
                      setCurrentLanguage(newLang);
                      if (activeLeetcodeProblem) {
                        setCode(activeLeetcodeProblem.starterCode[newLang] || '');
                      }
                    }}
                    className="bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold px-2.5 py-1 rounded-lg focus:outline-none focus:border-sky-500"
                  >
                    <option value="python">Python 3</option>
                    <option value="javascript">JavaScript (ES6)</option>
                    <option value="cpp">C++ (g++ 17)</option>
                    <option value="java">Java (OpenJDK 17)</option>
                  </select>
                </div>

                {/* Reset Code */}
                <button
                  onClick={handleResetCode}
                  title="Reset code to starter template"
                  className="text-slate-400 hover:text-slate-200 text-xs font-semibold flex items-center gap-1 cursor-pointer transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset Code</span>
                </button>
              </div>

              {/* Code Editor Textarea */}
              <div className="flex-1 p-3 bg-slate-950 font-mono text-xs relative">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="// Write your algorithmic solution here..."
                  spellCheck={false}
                  className="w-full h-80 bg-transparent text-slate-200 placeholder-slate-600 focus:outline-none resize-none font-mono text-xs leading-relaxed selection:bg-sky-500/30"
                />
              </div>

              {/* Bottom Test & Console Drawer */}
              <div className="border-t border-slate-800 bg-slate-950/90 p-4 space-y-3">
                {/* Test case tabs */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 overflow-x-auto">
                    <span className="text-slate-500 font-semibold text-[11px] mr-1">Testcase:</span>
                    {activeLeetcodeProblem.examples.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setSelectedTestCaseIndex(i);
                          setIsCustomTest(false);
                        }}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                          !isCustomTest && selectedTestCaseIndex === i
                            ? 'bg-slate-800 text-white border border-slate-700'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Case {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setIsCustomTest(true)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                        isCustomTest
                          ? 'bg-slate-800 text-white border border-slate-700'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Custom Input
                    </button>
                  </div>

                  {/* Run & Submit Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRunCode}
                      disabled={isRunning || isSubmitting}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Play className="w-3 h-3 text-sky-400 fill-sky-400" />
                      <span>{isRunning ? 'Running...' : 'Run Code'}</span>
                    </button>

                    <button
                      onClick={handleSubmitSolution}
                      disabled={isSubmitting || isRunning}
                      className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold transition shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? 'Evaluating...' : 'Submit Solution'}</span>
                    </button>
                  </div>
                </div>

                {/* Input vector preview */}
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800/80 text-[11px] font-mono">
                  {isCustomTest ? (
                    <input
                      type="text"
                      placeholder="e.g. nums = [2,7,11,15], target = 9"
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      className="w-full bg-transparent text-slate-200 focus:outline-none"
                    />
                  ) : (
                    <div className="text-slate-300">
                      <span className="text-slate-500 font-bold">Input:</span>{' '}
                      {activeLeetcodeProblem.examples[selectedTestCaseIndex]?.input}
                    </div>
                  )}
                </div>

                {/* Execution Results Feedback Banner */}
                {runResult && (
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>{runResult.message}</span>
                      </span>
                      <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
                        <span>Runtime: <strong className="text-slate-200">{runResult.runtimeMs}ms</strong></span>
                        <span>Memory: <strong className="text-slate-200">{runResult.memoryMb}MB</strong></span>
                      </div>
                    </div>
                    {runResult.outputLogs && (
                      <div className="p-2 bg-slate-950 rounded-lg text-[10px] font-mono text-slate-400 space-y-0.5">
                        {runResult.outputLogs.map((log: string, lIdx: number) => (
                          <div key={lIdx}>{log}</div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Submission Success Banner */}
                {submissionResult && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <div>
                          <h4 className="font-black text-sm text-emerald-300">Accepted!</h4>
                          <p className="text-[11px] text-slate-300">{submissionResult.message}</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        +{submissionResult.xpEarned || 50} XP Awarded
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-emerald-500/20 text-xs font-mono">
                      <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                        <div className="text-[10px] text-slate-400">Execution Runtime</div>
                        <div className="text-sm font-bold text-white mt-0.5">
                          {submissionResult.runtimeMs} ms
                        </div>
                        <div className="text-[10px] text-emerald-400 font-bold mt-0.5">
                          Beats {submissionResult.runtimePercentile || 88.5}% of users
                        </div>
                      </div>

                      <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                        <div className="text-[10px] text-slate-400">Memory Usage</div>
                        <div className="text-sm font-bold text-white mt-0.5">
                          {submissionResult.memoryMb} MB
                        </div>
                        <div className="text-[10px] text-sky-400 font-bold mt-0.5">
                          Beats {submissionResult.memoryPercentile || 79.2}% of users
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

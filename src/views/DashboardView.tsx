import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  CheckCircle2,
  Circle,
  Flame,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Award,
  Sparkles,
  Zap,
  Target,
  ChevronRight,
  ShieldCheck,
  Building,
  Mic,
  FolderGit2,
  FileEdit,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    user,
    readiness,
    dailyMission,
    toggleMissionTask,
    dailyFeed,
    setActiveTab,
    setSelectedCompany,
    companies,
    setIsAIChatOpen,
    setIsOnboardingOpen,
  } = useApp();

  const completedCount = dailyMission?.tasks.filter((t) => t.completed).length || 0;
  const totalCount = dailyMission?.tasks.length || 5;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="space-y-6 pb-20">
      {/* Welcome & Top Metric Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-sky-500/10 to-transparent pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider mb-1">
              <span>{user?.branch || 'Chemical Engineering'}</span>
              <span>•</span>
              <span>Target: {user?.targetCompanies?.[0] || 'Reliance Industries Limited'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Good morning, {user?.name?.split(' ')[0] || 'Alex'} 👋
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Your mission today: <span className="font-bold text-sky-300">42 minutes</span> of high-leverage preparation. Build proof, review failure patterns, and prove your engineering readiness.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAIChatOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-sky-500/25 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask Career Coach</span>
            </button>
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 transition"
            >
              Diagnostic Map
            </button>
          </div>
        </div>

        {/* Highlight Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] font-semibold text-slate-400">Readiness Score</div>
            <div className="text-2xl font-black text-sky-400 flex items-baseline gap-1 mt-0.5">
              <span>{readiness?.totalScore || 78}%</span>
              <span className="text-xs text-emerald-400 font-bold flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" /> +6%
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">{readiness?.statusLabel}</div>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] font-semibold text-slate-400">Current Streak</div>
            <div className="text-2xl font-black text-amber-400 flex items-center gap-1.5 mt-0.5">
              <span>{user?.streakDays || 7} Days</span>
              <Flame className="w-5 h-5 fill-amber-400 text-amber-400" />
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Top 8% on platform</div>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] font-semibold text-slate-400">Weakest Area</div>
            <div className="text-sm font-bold text-rose-300 truncate mt-1 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="truncate">{readiness?.weakestSkill || 'Industrial Safety'}</span>
            </div>
            <div className="text-[10px] text-rose-400 font-medium mt-1">Priority focus for mock interview</div>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] font-semibold text-slate-400">Strongest Area</div>
            <div className="text-sm font-bold text-emerald-300 truncate mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{readiness?.strongestSkill || 'Thermodynamics'}</span>
            </div>
            <div className="text-[10px] text-emerald-400 font-medium mt-1">85% benchmark beat</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Mission & Readiness Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Mission System (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-extrabold text-lg text-white">Today's Placement Mission</h2>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>⏱ {dailyMission?.totalMinutes || 42} min total planned</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm font-black text-sky-400">{completedCount} of {totalCount} done</div>
              <div className="text-[11px] text-slate-400">Progress: {progressPercent}%</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden mb-5">
            <div
              className="bg-gradient-to-r from-sky-400 via-indigo-500 to-emerald-400 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Mission Task Checklist */}
          <div className="space-y-2.5">
            {dailyMission?.tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleMissionTask(task.id)}
                className={`flex items-start justify-between p-3.5 rounded-xl border transition cursor-pointer select-none ${
                  task.completed
                    ? 'bg-slate-950/60 border-emerald-500/30 text-slate-400'
                    : 'bg-slate-800/60 border-slate-700/80 hover:border-sky-500/50 hover:bg-slate-800 text-slate-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button className="mt-0.5 text-sky-400 hover:text-sky-300">
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-400 hover:text-sky-400" />
                    )}
                  </button>
                  <div>
                    <span className={`text-sm font-medium ${task.completed ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                      {task.title}
                    </span>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                      <span>⏱ {task.durationMinutes} min</span>
                      <span>•</span>
                      <span className="capitalize">{task.category.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 text-xs font-bold text-amber-300">
                  <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>+{task.xpReward} XP</span>
                </div>
              </div>
            ))}
          </div>

          {dailyMission?.allCompleted && (
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-sky-500/10 to-indigo-500/10 border border-emerald-500/30 text-center">
              <span className="text-xl">🎉</span>
              <h3 className="font-extrabold text-emerald-300 text-sm mt-1">Mission Completed Today!</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Readiness score updated (+2%). You have proven consistency. Keep the fire burning!
              </p>
            </div>
          )}
        </div>

        {/* Readiness Dimensions Radar / Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-extrabold text-lg text-white">Placement Readiness Breakdown</h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                Transparent Model
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Readiness is calculated transparently from verifiable evidence, mock interview scores, and core assessments—not invented at random.
            </p>

            <div className="space-y-3.5">
              {readiness?.dimensions.map((dim, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-200">{dim.dimension}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-mono text-[11px]">Benchmark: {dim.benchmark}%</span>
                      <span className="font-bold text-sky-300 font-mono">{dim.score}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-700 ${
                        dim.score >= dim.benchmark ? 'bg-emerald-400' : 'bg-sky-400'
                      }`}
                      style={{ width: `${dim.score}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 italic">{dim.explanation}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-300">Target Company Alignment:</span>
            <button
              onClick={() => setActiveTab('companies')}
              className="text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1"
            >
              <span>{user?.targetCompanies?.[0] || 'Reliance Industries'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Launchpad Action Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => setActiveTab('mock-interview')}
          className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-slate-800 hover:border-sky-500/50 transition-all text-left group shadow-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Mic className="w-5 h-5" />
          </div>
          <div className="font-bold text-sm text-white group-hover:text-sky-300 transition-colors">
            Voice Mock Interview
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            STAR-L analysis, filler words & technical scoring
          </p>
        </button>

        <button
          onClick={() => setActiveTab('proof-lab')}
          className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950/40 border border-slate-800 hover:border-emerald-500/50 transition-all text-left group shadow-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
            Proof Lab
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Convert projects into verifiable evidence & BOMs
          </p>
        </button>

        <button
          onClick={() => setActiveTab('resume-lab')}
          className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-amber-950/40 border border-slate-800 hover:border-amber-500/50 transition-all text-left group shadow-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <FileEdit className="w-5 h-5" />
          </div>
          <div className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
            Resume "So What?" Lab
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Transform plain bullets into high-impact metrics
          </p>
        </button>

        <button
          onClick={() => setActiveTab('companies')}
          className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-purple-950/40 border border-slate-800 hover:border-purple-500/50 transition-all text-left group shadow-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Building className="w-5 h-5" />
          </div>
          <div className="font-bold text-sm text-white group-hover:text-purple-300 transition-colors">
            Company War Room
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Skill radars, verified recruitment guides & roadmaps
          </p>
        </button>
      </div>

      {/* Daily Feed: 2-min Cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-extrabold text-lg text-white">Your Daily Engineering Feed</h2>
            <p className="text-xs text-slate-400">Micro-learning cards designed for 2-minute placement breakthroughs</p>
          </div>
          <span className="text-[11px] font-bold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg">
            4 Fresh Cards
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dailyFeed.map((card) => (
            <div
              key={card.id}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/90 hover:border-slate-700 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    {card.tag}
                  </span>
                  <span className="text-[11px] text-slate-400">{card.readTime} read</span>
                </div>
                <h3 className="font-bold text-sm text-slate-100 mb-1.5">{card.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{card.content}</p>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800/60 flex justify-end">
                <button
                  onClick={() => {
                    if (card.type === 'interview_question') setActiveTab('mock-interview');
                    else if (card.type === 'project_challenge') setActiveTab('proof-lab');
                    else if (card.type === 'mistake_warning') setActiveTab('mistake-vault');
                    else setActiveTab('core-engineer');
                  }}
                  className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1"
                >
                  <span>Practice this</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

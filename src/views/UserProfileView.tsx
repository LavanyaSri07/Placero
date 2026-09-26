import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  User,
  Award,
  Sparkles,
  Trophy,
  CheckCircle2,
  Lock,
  Clock,
  Mic2,
  Map,
  BookOpen,
  Calendar,
  Building2,
  GraduationCap,
  ExternalLink,
  Edit3,
  Brain,
  Zap,
  TrendingUp,
  Flame,
  Star,
  Shield,
  Layers,
  BarChart3,
  X,
  Target,
  ArrowRight,
  Compass,
} from 'lucide-react';
import { Badge, MockInterviewRecord, EngineeringBranch } from '../types/index.ts';
import { PersonalityTestModal } from '../components/PersonalityTestModal.tsx';

export const UserProfileView: React.FC = () => {
  const {
    user,
    badges,
    mockInterviews,
    roadmap,
    proofs,
    updateProfile,
    setActiveTab,
    setIsPortfolioOpen,
    triggerConfetti,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isPersonalityModalOpen, setIsPersonalityModalOpen] = useState<boolean>(false);

  // Edit Profile form state
  const [editName, setEditName] = useState(user?.name || '');
  const [editCollege, setEditCollege] = useState(user?.college || '');
  const [editBranch, setEditBranch] = useState<EngineeringBranch>(user?.branch || 'Chemical Engineering');
  const [editDegree, setEditDegree] = useState(user?.degree || 'B.Tech');
  const [editCgpa, setEditCgpa] = useState(user?.cgpa || 8.0);
  const [editRole, setEditRole] = useState(user?.preferredRole || 'Graduate Engineer Trainee');
  const [editTargetCompany, setEditTargetCompany] = useState(user?.targetCompanies?.[0] || 'Reliance Industries Limited');

  const milestones = roadmap?.milestones || [];
  const completedMilestones = milestones.filter((m) => m.completed);
  const safeBadges = Array.isArray(badges) ? badges : [];
  const unlockedBadges = safeBadges.filter((b) => b.isUnlocked);
  const unlockedPercent = safeBadges.length > 0 ? Math.round((unlockedBadges.length / safeBadges.length) * 100) : 0;

  const roadmapBadges = safeBadges.filter((b) => b.category === 'roadmap');
  const interviewBadges = safeBadges.filter((b) => b.category === 'interview');

  const filteredBadges = safeBadges.filter((b) => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Roadmap') return b.category === 'roadmap';
    if (selectedCategory === 'Interview') return b.category === 'interview';
    if (selectedCategory === 'Unlocked') return b.isUnlocked;
    if (selectedCategory === 'In Progress') return !b.isUnlocked;
    return true;
  });

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name: editName,
      college: editCollege,
      branch: editBranch,
      degree: editDegree,
      cgpa: Number(editCgpa),
      preferredRole: editRole,
      targetCompanies: [editTargetCompany, ...(user?.targetCompanies?.filter((c) => c !== editTargetCompany) || [])],
    });
    setIsEditModalOpen(false);
    triggerConfetti();
  };

  const getTierColor = (tier?: string) => {
    switch (tier) {
      case 'Bronze':
        return {
          bg: 'bg-amber-950/20',
          border: 'border-amber-700/40',
          text: 'text-amber-400',
          badge: 'bg-amber-900/30 text-amber-300 border-amber-700/50',
        };
      case 'Silver':
        return {
          bg: 'bg-slate-800/30',
          border: 'border-slate-600/40',
          text: 'text-slate-200',
          badge: 'bg-slate-700/40 text-slate-200 border-slate-500/50',
        };
      case 'Gold':
        return {
          bg: 'bg-yellow-950/20',
          border: 'border-yellow-600/40',
          text: 'text-yellow-400',
          badge: 'bg-yellow-900/30 text-yellow-300 border-yellow-600/50',
        };
      case 'Platinum':
        return {
          bg: 'bg-sky-950/25',
          border: 'border-sky-500/40',
          text: 'text-sky-300',
          badge: 'bg-sky-900/30 text-sky-200 border-sky-500/50',
        };
      case 'Diamond':
        return {
          bg: 'bg-indigo-950/30',
          border: 'border-indigo-500/40',
          text: 'text-indigo-300',
          badge: 'bg-indigo-900/40 text-indigo-200 border-indigo-400/50',
        };
      default:
        return {
          bg: 'bg-slate-900/30',
          border: 'border-slate-800',
          text: 'text-slate-300',
          badge: 'bg-slate-800 text-slate-300 border-slate-700',
        };
    }
  };

  const personality = user?.personalityProfile;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ================= WEBPAGE OBJECTIVE BANNER ================= */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#11141c] via-[#141926] to-[#11141c] border border-slate-800/80 p-5 lg:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs text-slate-400">
              <span className="font-semibold text-sky-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Student Credentials & Achievement Portfolio
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-medium">SQLite Database Synced</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-100 tracking-tight">
              Candidate Profile & Achievement Badges
            </h1>
            <p className="mt-1.5 text-xs lg:text-sm text-slate-300 max-w-3xl leading-relaxed">
              <strong>Webpage Objective:</strong> Your complete engineering candidate profile and verified credentials hub. Here you track achievement badges dynamically awarded based on <strong>completed roadmap milestones</strong> and <strong>mock interview speech performance</strong>, manage your cognitive personality alignment, and review your interview trajectory saved directly to your SQLite database account.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsPersonalityModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-sky-500/20 to-indigo-500/20 hover:from-sky-500/30 hover:to-indigo-500/30 text-sky-300 border border-sky-500/30 text-xs font-bold transition cursor-pointer"
            >
              <Brain className="w-3.5 h-3.5 text-sky-400" />
              <span>{personality ? 'Retake Alignment Diagnostic' : 'Take Personality Test'}</span>
            </button>

            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#181d2a] hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-semibold transition cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-400" />
              <span>Edit Profile</span>
            </button>

            <button
              onClick={() => setIsPortfolioOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#181d2a] hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-semibold transition cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span>Public Recruiter Link</span>
            </button>
          </div>
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className="p-5 lg:p-6 rounded-2xl bg-[#131720] border border-[#202636] shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Avatar and Basic Info */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-sky-950">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-full bg-[#181d28] border border-sky-500/40 text-[10px] font-extrabold text-sky-300">
                Lvl {user?.level || 4}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100">
                  {user?.name || user?.loginId || 'Engineering Candidate'}
                </h2>
                <span className="text-xs text-slate-400">
                  ID: <code className="text-sky-300 font-mono">{user?.loginId || 'user-candidate'}</code>
                </span>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  · {user?.role === 'admin' ? 'Placement Admin' : 'Engineering Candidate'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                <span className="flex items-center gap-1 font-medium text-slate-200">
                  <GraduationCap className="w-3.5 h-3.5 text-sky-400" />
                  {user?.degree || 'B.Tech'} in {user?.branch || 'Chemical Engineering'}
                </span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>{user?.college || 'National Institute of Technology'}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="font-semibold text-emerald-400">CGPA: {user?.cgpa || 8.2}/10</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                  Target: <strong className="text-slate-200">{user?.targetCompanies?.[0] || 'Reliance Industries'}</strong>
                </span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>Role: <strong className="text-slate-200">{user?.preferredRole || 'Graduate Engineer Trainee'}</strong></span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="flex items-center gap-1 text-amber-400 font-medium">
                  <Flame className="w-3.5 h-3.5" /> {user?.streakDays || 7} Day Streak
                </span>
              </div>
            </div>
          </div>

          {/* XP Level Progress Bar */}
          <div className="w-full lg:w-72 p-4 rounded-xl bg-[#171c26] border border-[#232a3b] space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-sky-400" /> Placement Mastery
              </span>
              <span className="text-sky-300 font-bold">{user?.xp || 1450} XP</span>
            </div>
            <div className="w-full bg-slate-800/80 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-sky-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, ((user?.xp || 1450) % 500) / 5)}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Level {user?.level || 4}</span>
              <span>{500 - ((user?.xp || 1450) % 500)} XP to Level {(user?.level || 4) + 1}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Student Personality & Platform Alignment Card */}
      <div className="p-5 lg:p-6 rounded-2xl bg-[#131720] border border-[#202636] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                Engineering Personality & Alignment Diagnostic
              </h3>
              <p className="text-xs text-slate-400">
                Calibrated to evaluate engineering problem solving, pressure response, and recruiter culture fit
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsPersonalityModalOpen(true)}
            className="text-xs font-semibold text-sky-400 hover:text-sky-300 transition hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{personality ? 'Retake Alignment Assessment' : 'Take 3-Min Alignment Test'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {personality ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-1">
            <div className="p-4 rounded-xl bg-[#171c26] border border-[#242b3d] space-y-2">
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">
                Primary Engineering Archetype
              </span>
              <div className="text-base font-extrabold text-slate-100">
                {personality.primaryArchetype}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {personality.tagline}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#171c26] border border-[#242b3d] space-y-2">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                Workplace & Cognitive Workstyle
              </span>
              <div className="text-xs text-slate-300 space-y-1.5 leading-relaxed">
                <div>
                  <strong className="text-slate-100">Problem Solving:</strong> {personality.problemSolvingStyle}
                </div>
                <div>
                  <strong className="text-slate-100">Environment:</strong> {personality.workplacePreference}
                </div>
                <div>
                  <strong className="text-slate-100">Pressure Response:</strong> {personality.stressResponse}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#171c26] border border-[#242b3d] space-y-2">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                Tailored Placement Strategy
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {personality.personalizedStrategy}
              </p>
              <div className="pt-1 flex flex-wrap gap-1">
                {personality.bestFitRecruiters?.slice(0, 3).map((comp) => (
                  <span key={comp} className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-medium">
                    {comp}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-xl bg-[#171c26] border border-[#242b3d] text-center space-y-2">
            <Compass className="w-8 h-8 text-sky-400 mx-auto opacity-70" />
            <div className="text-sm font-bold text-slate-100">
              No Engineering Personality Profile Detected
            </div>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Take our 8-question placement diagnostic to uncover your cognitive problem-solving style, ideal recruiter culture fit, and receive tailored interview recommendations.
            </p>
            <button
              onClick={() => setIsPersonalityModalOpen(true)}
              className="mt-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-md transition cursor-pointer"
            >
              Start 3-Minute Alignment Diagnostic
            </button>
          </div>
        )}
      </div>

      {/* ================= ACHIEVEMENT BADGES SHOWCASE ================= */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
              <Award className="w-5 h-5 text-sky-400" />
              <span>Achievement Badges & Placement Credentials</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Awarded based on completed roadmap milestones, voice interview pacing, and verified engineering proofs
            </p>
          </div>

          {/* Stats pills */}
          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-400">
              Unlocked: <strong className="text-emerald-400 font-bold">{unlockedBadges.length}</strong> / {safeBadges.length} ({unlockedPercent}%)
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400">
              Roadmap: <strong className="text-sky-400 font-bold">{roadmapBadges.filter(b => b.isUnlocked).length}</strong>/{roadmapBadges.length}
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400">
              Interview: <strong className="text-violet-400 font-bold">{interviewBadges.filter(b => b.isUnlocked).length}</strong>/{interviewBadges.length}
            </span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {['All', 'Roadmap', 'Interview', 'Unlocked', 'In Progress'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/20'
                  : 'bg-[#151922] hover:bg-[#1a202c] text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat === 'All' ? 'All Badges' : cat === 'Roadmap' ? 'Roadmap Milestones' : cat === 'Interview' ? 'Mock Interview Performance' : cat}
            </button>
          ))}
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {filteredBadges.map((badge) => {
            const tierStyle = getTierColor(badge.tier);
            const isUnlocked = badge.isUnlocked;

            return (
              <div
                key={badge.id}
                onClick={() => setSelectedBadge(badge)}
                className={`group p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isUnlocked
                    ? `${tierStyle.bg} ${tierStyle.border} hover:scale-[1.01] shadow-sm`
                    : 'bg-[#12151e]/80 border-slate-800/80 hover:border-slate-700 opacity-75 hover:opacity-100'
                }`}
              >
                <div>
                  {/* Badge Header Row */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{badge.icon}</span>
                      <div>
                        <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${tierStyle.badge}`}>
                          {badge.tier} Tier
                        </span>
                        <div className="text-[10px] text-slate-400 mt-0.5 capitalize">
                          {badge.category === 'roadmap' ? 'Roadmap Milestone' : badge.category === 'interview' ? 'Mock Interview' : badge.category}
                        </div>
                      </div>
                    </div>

                    {isUnlocked ? (
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Unlocked
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1 shrink-0">
                        <Lock className="w-3 h-3" />
                        Locked
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h4 className={`text-sm font-bold ${isUnlocked ? 'text-slate-100' : 'text-slate-300'}`}>
                    {badge.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                    {badge.description}
                  </p>
                </div>

                {/* Progress / Status Bottom Section */}
                <div className="mt-3 pt-3 border-t border-slate-800/60 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 truncate max-w-[170px]">{badge.progressText || badge.criteria}</span>
                    <span className="text-sky-300 font-bold shrink-0">+{badge.xpReward || 100} XP</span>
                  </div>

                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isUnlocked ? 'bg-emerald-400' : 'bg-sky-500'
                      }`}
                      style={{ width: `${badge.progress || (isUnlocked ? 100 : 0)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Section: Mock Interview Trajectory & Completed Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mock Interview Records */}
        <div className="p-5 rounded-2xl bg-[#131720] border border-[#202636] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic2 className="w-4 h-4 text-sky-400" />
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                Voice Mock Interview History
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('mock-interview')}
              className="text-xs font-semibold text-sky-400 hover:text-sky-300 transition hover:underline cursor-pointer"
            >
              Take Spoken Drill &rarr;
            </button>
          </div>

          {mockInterviews.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No recorded mock viva drills yet. Take your first voice interview in Mock Interview Trainer to unlock speech badges!
            </div>
          ) : (
            <div className="space-y-2.5">
              {mockInterviews.map((mi) => (
                <div
                  key={mi.id}
                  className="p-3 rounded-xl bg-[#171c26] border border-[#232a3b] space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200 truncate max-w-[240px]">
                      {mi.question}
                    </span>
                    <span className="font-extrabold text-emerald-400 shrink-0">
                      Score: {mi.overallScore}/100
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-2">
                      <span>Pace: <strong className="text-slate-300">{mi.speakingPaceWpm} WPM</strong></span>
                      <span aria-hidden="true">·</span>
                      <span>Fillers: <strong className="text-slate-300">{mi.fillerWordCount}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span>{mi.durationSeconds}s</span>
                    </div>
                    <span>{mi.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed Roadmap Milestones */}
        <div className="p-5 rounded-2xl bg-[#131720] border border-[#202636] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Map className="w-4 h-4 text-sky-400" />
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                Completed Roadmap Milestones ({completedMilestones.length}/{milestones.length})
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('roadmap')}
              className="text-xs font-semibold text-sky-400 hover:text-sky-300 transition hover:underline cursor-pointer"
            >
              View Full Blueprint &rarr;
            </button>
          </div>

          {completedMilestones.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No milestones marked completed yet. Open Preparation Roadmap to complete weekly deliverables.
            </div>
          ) : (
            <div className="space-y-2.5">
              {completedMilestones.slice(0, 4).map((m) => (
                <div
                  key={m.id}
                  className="p-3 rounded-xl bg-[#171c26] border border-[#232a3b] space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">
                      Week {m.weekNumber}: {m.title}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Done
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    Deliverable: {m.deliverable}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal: Badge Inspector */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#131722] border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-3xl">{selectedBadge.icon}</span>
                <div>
                  <h3 className="text-base font-bold text-slate-100">{selectedBadge.name}</h3>
                  <span className="text-xs text-slate-400 font-semibold">{selectedBadge.tier} Tier</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedBadge(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedBadge.description}
            </p>

            <div className="p-3.5 rounded-xl bg-[#171c28] border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Unlock Requirement:</span>
                <span className="font-bold text-slate-200">{selectedBadge.criteria}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">XP Reward:</span>
                <span className="font-bold text-sky-400">+{selectedBadge.xpReward} XP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Current Progress:</span>
                <span className="font-bold text-emerald-400">{selectedBadge.progressText}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  setSelectedBadge(null);
                  if (selectedBadge.category === 'roadmap') setActiveTab('roadmap');
                  else if (selectedBadge.category === 'interview') setActiveTab('mock-interview');
                }}
                className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Practice to Progress this Badge</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Profile */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#131722] border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-sky-400" />
                Edit Candidate Profile (Saved to SQLite)
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-[#171c28] border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">CGPA</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    max="10"
                    value={editCgpa}
                    onChange={(e) => setEditCgpa(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 bg-[#171c28] border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">College / Institute</label>
                <input
                  type="text"
                  value={editCollege}
                  onChange={(e) => setEditCollege(e.target.value)}
                  className="w-full px-3 py-2 bg-[#171c28] border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Engineering Branch</label>
                  <select
                    value={editBranch}
                    onChange={(e) => setEditBranch(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#171c28] border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-sky-500"
                  >
                    <option value="Chemical Engineering">Chemical Engineering</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Electronics & Communication">Electronics & Communication</option>
                    <option value="Computer Science & IT">Computer Science & IT</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Target Recruiter</label>
                  <select
                    value={editTargetCompany}
                    onChange={(e) => setEditTargetCompany(e.target.value)}
                    className="w-full px-3 py-2 bg-[#171c28] border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-sky-500"
                  >
                    <option value="Reliance Industries Limited">Reliance Industries Limited</option>
                    <option value="Tata Motors">Tata Motors</option>
                    <option value="Larsen & Toubro (L&T)">Larsen & Toubro (L&T)</option>
                    <option value="Siemens">Siemens</option>
                    <option value="Texas Instruments">Texas Instruments</option>
                    <option value="Dow Chemicals">Dow Chemicals</option>
                    <option value="Google">Google</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Preferred Role</label>
                <input
                  type="text"
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  placeholder="e.g. Graduate Engineer Trainee"
                  className="w-full px-3 py-2 bg-[#171c28] border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-slate-300 hover:bg-slate-800 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-sky-600 hover:bg-sky-500 font-bold rounded-xl transition cursor-pointer"
                >
                  Save Changes to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Personality Test Modal */}
      <PersonalityTestModal
        isOpen={isPersonalityModalOpen}
        onClose={() => setIsPersonalityModalOpen(false)}
      />
    </div>
  );
};

import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  LayoutDashboard,
  Building2,
  FolderGit2,
  Mic2,
  FileText,
  Cpu,
  ShieldAlert,
  GitBranch,
  SearchCode,
  Users,
  ShieldCheck,
  Flame,
  CheckCircle2,
  Map,
  Award,
  Brain,
  Sparkles,
  BookOpen,
  Code2,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    dailyMission,
    proofs,
    mistakes,
    roadmap,
    badges,
    user,
    setIsPersonalityModalOpen,
  } = useApp();

  const completedMilestones = roadmap?.milestones?.filter(m => m.completed).length || 0;
  const totalMilestones = roadmap?.milestones?.length || 0;
  const safeBadges = Array.isArray(badges) ? badges : [];
  const unlockedBadges = safeBadges.filter(b => b.isUnlocked).length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: dailyMission ? `${dailyMission.tasks.filter(t => t.completed).length}/${dailyMission.tasks.length}` : undefined,
    },
    {
      id: 'profile',
      label: 'Profile & Badges',
      icon: Award,
      badge: unlockedBadges > 0 ? `${unlockedBadges} Badges` : undefined,
      subtitle: 'Milestones & Vivas',
    },
    {
      id: 'roadmap',
      label: 'Preparation Roadmap',
      icon: Map,
      badge: totalMilestones > 0 ? `${completedMilestones}/${totalMilestones}` : undefined,
      subtitle: 'Week-by-Week Plan',
    },
    {
      id: 'leetcode',
      label: 'LeetCode Arena',
      icon: Code2,
      badge: 'Blind 75',
      subtitle: 'DSA & Coding Sandbox',
    },
    {
      id: 'flashcards',
      label: 'Anki Flashcards',
      icon: BookOpen,
      badge: 'SRS Active',
      subtitle: 'Spaced Repetition',
    },
    {
      id: 'companies',
      label: 'Company War Room',
      icon: Building2,
      subtitle: 'Target Prep & Radars',
    },
    {
      id: 'proof-lab',
      label: 'Proof Lab',
      icon: FolderGit2,
      badge: proofs.length ? `${proofs.length} verified` : undefined,
      subtitle: 'Build Proof, Not Claims',
    },
    {
      id: 'mock-interview',
      label: 'Mock Interview',
      icon: Mic2,
      subtitle: 'Voice & STAR-L',
    },
    {
      id: 'resume-lab',
      label: 'Resume Bullet Lab',
      icon: FileText,
      subtitle: '"So What?" Engine',
    },
    {
      id: 'core-engineer',
      label: 'Core Engineer Mode',
      icon: Cpu,
      subtitle: 'Branch Deep-Dives',
    },
    {
      id: 'mistake-vault',
      label: 'Mistake Vault',
      icon: ShieldAlert,
      badge: mistakes.length ? `${mistakes.length} logged` : undefined,
      subtitle: 'Failure Pattern Lab',
    },
    {
      id: 'reverse-audit',
      label: 'Reverse Audit & 30-60-90',
      icon: GitBranch,
      subtitle: 'Company Roadmap',
    },
    {
      id: 'rca-lab',
      label: 'RCA & FMEA Lab',
      icon: SearchCode,
      subtitle: '5 Whys Failure Sim',
    },
    {
      id: 'alumni',
      label: 'Alumni Intelligence',
      icon: Users,
      subtitle: 'Verified Insights',
    },
    {
      id: 'admin',
      label: 'Admin Panel',
      icon: ShieldCheck,
      subtitle: 'Manage Content',
    },
  ];

  return (
    <aside className="w-64 shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col justify-between hidden md:flex h-[calc(100vh-61px)] sticky top-[61px]">
      <div className="p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Placement Modules
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                isActive
                  ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 text-left">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-sky-400' : 'text-slate-400 group-hover:text-slate-300'
                  }`}
                />
                <div className="truncate">
                  <div className="truncate leading-tight">{item.label}</div>
                  {item.subtitle && (
                    <div className="text-[10px] font-normal text-slate-400 truncate">
                      {item.subtitle}
                    </div>
                  )}
                </div>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold tracking-tight shrink-0 ${
                    isActive
                      ? 'bg-sky-500/20 text-sky-300'
                      : 'bg-slate-800 text-slate-400 group-hover:text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Personality Alignment Card */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 m-2 rounded-xl space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Brain className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[11px] font-bold text-slate-200">AI Alignment</span>
          </div>
          <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {user?.personalityProfile ? 'Active' : 'Pending'}
          </span>
        </div>

        <p className="text-[11px] text-slate-400 leading-tight">
          {user?.personalityProfile?.primaryArchetype
            ? user.personalityProfile.primaryArchetype.split('&')[0].trim()
            : 'Align platform to your engineering problem-solving style.'}
        </p>

        <button
          onClick={() => setIsPersonalityModalOpen(true)}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold transition cursor-pointer"
        >
          <Sparkles className="w-3 h-3 text-indigo-400" />
          <span>{user?.personalityProfile ? 'Re-align Diagnostic' : 'Take Personality Test'}</span>
        </button>
      </div>
    </aside>
  );
};

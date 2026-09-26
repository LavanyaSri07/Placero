import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Sparkles,
  Flame,
  Award,
  Search,
  MessageSquare,
  Share2,
  RotateCcw,
  CheckCircle2,
  Compass,
  User,
  KeyRound,
  LogIn,
  LogOut,
  Palette,
  Sun,
  Moon,
  Brain,
  ChevronDown,
  Code2,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    user,
    readiness,
    searchQuery,
    setSearchQuery,
    setIsAIChatOpen,
    setIsOnboardingOpen,
    setIsPortfolioOpen,
    setIsAuthModalOpen,
    setIsPersonalityModalOpen,
    setActiveTab,
    badges,
    theme,
    setTheme,
    resetDemoUser,
    logout,
  } = useApp();

  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  const safeBadges = Array.isArray(badges) ? badges : [];

  const themeOptions = [
    { id: 'obsidian', name: 'Executive Obsidian', icon: Moon, description: 'Warm charcoal & gold (Default)' },
    { id: 'nordic', name: 'Nordic Slate', icon: Compass, description: 'Cool matte slate & cyan' },
    { id: 'editorial', name: 'Editorial Paper', icon: Sun, description: 'Clean daylight ivory & ink' },
    { id: 'midnight', name: 'Astral Midnight', icon: Sparkles, description: 'Deep cosmic navy & violet' },
  ] as const;

  const currentThemeObj = themeOptions.find((t) => t.id === theme) || themeOptions[0];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-sky-500/20 text-white font-black text-xl tracking-wider">
            P
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-sky-400 via-indigo-300 to-emerald-300 bg-clip-text text-transparent">
                PLACERO
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                Placement OS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Prepare. Prove. Practice. Get Placement Ready.</p>
          </div>
        </div>

        {/* Global Search */}
        <div className="hidden md:flex flex-1 max-w-md items-center relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search companies, skills, interview questions, projects..."
            className="w-full pl-9 pr-4 py-2 bg-slate-800/80 border border-slate-700/80 rounded-xl text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
          />
        </div>

        {/* User Stats & Actions */}
        <div className="flex items-center gap-3">
          {/* Readiness Pill */}
          {readiness && (
            <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700/80 rounded-xl px-3 py-1.5 shadow-sm">
              <div className="relative w-7 h-7 flex items-center justify-center">
                <svg className="w-7 h-7 -rotate-90">
                  <circle
                    cx="14"
                    cy="14"
                    r="11"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="text-slate-700"
                    fill="transparent"
                  />
                  <circle
                    cx="14"
                    cy="14"
                    r="11"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeDasharray={69.1}
                    strokeDashoffset={69.1 - (69.1 * readiness.totalScore) / 100}
                    className="text-sky-400 transition-all duration-700"
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <span className="absolute text-[10px] font-extrabold text-sky-300">{readiness.totalScore}%</span>
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Readiness</div>
                <div className="text-xs font-bold text-slate-200">{readiness.statusLabel}</div>
              </div>
            </div>
          )}

          {/* Streak */}
          <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-300 px-3 py-1.5 rounded-xl font-bold text-xs">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
            <span>{user?.streakDays || 7}d Streak</span>
          </div>

          {/* Profile & Badges Link */}
          <button
            onClick={() => setActiveTab('profile')}
            title="Candidate Profile & Achievement Badges"
            className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700/80 transition cursor-pointer shadow-sm"
          >
            <User className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden lg:inline">Profile</span>
            {safeBadges.filter((b) => b.isUnlocked).length > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-black rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {safeBadges.filter((b) => b.isUnlocked).length} 🏆
              </span>
            )}
          </button>

          {/* LeetCode Arena Access */}
          <button
            onClick={() => setActiveTab('leetcode')}
            title="LeetCode Technical DSA Arena & Daily Coding Round"
            className="hidden md:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700/80 transition cursor-pointer shadow-sm"
          >
            <Code2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xl:inline">LeetCode</span>
          </button>

          {/* Personality Alignment Trigger */}
          <button
            onClick={() => setIsPersonalityModalOpen(true)}
            title="Student Personality & Platform Alignment Diagnostic"
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition cursor-pointer"
          >
            <Brain className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden xl:inline">
              {user?.personalityProfile ? 'Aligned' : 'Align AI'}
            </span>
          </button>

          {/* Theme Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              title={`Current Theme: ${currentThemeObj.name}. Click to change theme`}
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700/80 transition cursor-pointer shadow-sm"
            >
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">{currentThemeObj.name.split(' ')[0]}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isThemeMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsThemeMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-700/90 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 mb-1">
                    Select Theme
                  </div>
                  {themeOptions.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = theme === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setTheme(opt.id);
                          setIsThemeMenuOpen(false);
                        }}
                        className={`w-full flex items-start gap-2.5 px-2.5 py-2 rounded-xl text-left text-xs transition cursor-pointer ${
                          isSelected
                            ? 'bg-sky-500/20 text-sky-200 font-bold border border-sky-500/40'
                            : 'hover:bg-slate-800/80 text-slate-300'
                        }`}
                      >
                        <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-sky-400' : 'text-slate-400'}`} />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span>{opt.name}</span>
                            {isSelected && <span className="text-[10px] text-sky-400 font-bold">✓</span>}
                          </div>
                          <p className="text-[10px] text-slate-400 font-normal leading-tight mt-0.5">
                            {opt.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* User Account / Login ID Badge */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              title="Click to sign in with Login ID & Password or create an account"
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-sky-400" />
              <div className="text-left hidden sm:block">
                <span className="text-[10px] text-slate-400 block leading-none">
                  {user?.loginId ? 'Logged In' : 'Sign In'}
                </span>
                <span className="font-bold text-sky-300 text-xs">
                  {user?.name ? user.name.split(' ')[0] : user?.loginId || 'Guest / Login'}
                </span>
              </div>
            </button>
          </div>

          {/* Demo User Badge / Switcher */}
          <button
            onClick={resetDemoUser}
            title="Reset to Alex Student demo data (Chemical Engineering, Reliance prep)"
            className="hidden sm:flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
            <span>Demo Reset</span>
          </button>

          {/* Onboarding trigger */}
          <button
            onClick={() => setIsOnboardingOpen(true)}
            title="Open Placement Diagnostic"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            <Compass className="w-4 h-4 text-emerald-400" />
          </button>

          {/* Public Portfolio Preview */}
          <button
            onClick={() => setIsPortfolioOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/30 transition shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Recruiter View</span>
          </button>

          {/* Floating AI Coach Trigger */}
          <button
            onClick={() => setIsAIChatOpen(true)}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-md shadow-sky-500/25 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Ask AI</span>
          </button>
        </div>
      </div>
    </header>
  );
};

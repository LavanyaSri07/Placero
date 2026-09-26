import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  UserProfile,
  Company,
  DailyMission,
  OverallReadiness,
  ProjectEvidence,
  MistakeRecord,
  DailyFeedCard,
  AlumniProfile,
  RoadmapPlan,
  RoadmapMilestone,
  RegisterData,
  Badge,
  MockInterviewRecord,
  LeetCodeProblem,
  LeetCodeSubmissionResult,
} from '../types/index.ts';

interface AppContextType {
  user: UserProfile | null;
  companies: Company[];
  selectedCompany: Company | null;
  readiness: OverallReadiness | null;
  dailyMission: DailyMission | null;
  proofs: ProjectEvidence[];
  mistakes: MistakeRecord[];
  dailyFeed: DailyFeedCard[];
  alumniList: AlumniProfile[];
  roadmap: RoadmapPlan | null;
  badges: Badge[];
  mockInterviews: MockInterviewRecord[];
  flashcards: any[];
  studyNotes: any[];
  leetcodeProblems: LeetCodeProblem[];
  activeLeetcodeProblem: LeetCodeProblem | null;
  setActiveLeetcodeProblem: (p: LeetCodeProblem | null) => void;
  submitLeetCodeSolution: (problemId: string, data: { code: string; language: string; notes?: string }) => Promise<LeetCodeSubmissionResult | null>;
  runLeetCodeCode: (problemId: string, code: string, language: string, customInput?: string) => Promise<any>;
  saveLeetCodeNote: (problemId: string, notes: string) => Promise<any>;
  activeTab: string;
  searchQuery: string;
  isAIChatOpen: boolean;
  isOnboardingOpen: boolean;
  isPortfolioOpen: boolean;
  isAuthModalOpen: boolean;
  isPersonalityModalOpen: boolean;
  theme: 'obsidian' | 'nordic' | 'editorial' | 'midnight';
  isLoading: boolean;
  setActiveTab: (tab: string) => void;
  setSearchQuery: (query: string) => void;
  setIsAIChatOpen: (open: boolean) => void;
  setIsOnboardingOpen: (open: boolean) => void;
  setIsPortfolioOpen: (open: boolean) => void;
  setIsAuthModalOpen: (open: boolean) => void;
  setIsPersonalityModalOpen: (open: boolean) => void;
  setTheme: (theme: 'obsidian' | 'nordic' | 'editorial' | 'midnight') => void;
  setSelectedCompany: (company: Company | null) => void;
  toggleMissionTask: (taskId: string) => Promise<void>;
  addProof: (proof: Partial<ProjectEvidence>) => Promise<ProjectEvidence>;
  deleteProof: (id: string) => Promise<void>;
  addMistake: (mistake: Partial<MistakeRecord>) => Promise<MistakeRecord>;
  deleteMistake: (id: string) => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  toggleRoadmapMilestone: (milestoneId: string) => Promise<void>;
  updateRoadmapMilestones: (milestones: RoadmapMilestone[]) => Promise<void>;
  generateTailoredRoadmap: (targetCompany?: string, branch?: string, totalWeeks?: number) => Promise<void>;
  saveMockInterview: (data: any) => Promise<void>;
  logStudySession: (minutes: number) => Promise<void>;
  updateFlashcardMastery: (id: string, delta: number) => Promise<void>;
  addFlashcard: (card: any) => Promise<void>;
  saveStudyNote: (note: any) => Promise<void>;
  deleteStudyNote: (id: string) => Promise<void>;
  refreshBadges: () => Promise<void>;
  login: (credentials: { loginIdOrEmail: string; password?: string; isDemo?: boolean }) => Promise<{ success: boolean; message?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  resetDemoUser: () => Promise<void>;
  triggerConfetti: () => void;
  refreshData: (overrideUserId?: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string>(() => {
    return localStorage.getItem('placero_user_id') || 'user-demo-01';
  });
  const [user, setUser] = useState<UserProfile | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [readiness, setReadiness] = useState<OverallReadiness | null>(null);
  const [dailyMission, setDailyMission] = useState<DailyMission | null>(null);
  const [proofs, setProofs] = useState<ProjectEvidence[]>([]);
  const [mistakes, setMistakes] = useState<MistakeRecord[]>([]);
  const [dailyFeed, setDailyFeed] = useState<DailyFeedCard[]>([]);
  const [alumniList, setAlumniList] = useState<AlumniProfile[]>([]);
  const [roadmap, setRoadmap] = useState<RoadmapPlan | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [mockInterviews, setMockInterviews] = useState<MockInterviewRecord[]>([]);
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [studyNotes, setStudyNotes] = useState<any[]>([]);
  const [leetcodeProblems, setLeetcodeProblems] = useState<LeetCodeProblem[]>([]);
  const [activeLeetcodeProblem, setActiveLeetcodeProblem] = useState<LeetCodeProblem | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAIChatOpen, setIsAIChatOpen] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isPortfolioOpen, setIsPortfolioOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isPersonalityModalOpen, setIsPersonalityModalOpen] = useState<boolean>(false);
  const [theme, setThemeState] = useState<'obsidian' | 'nordic' | 'editorial' | 'midnight'>(() => {
    return (localStorage.getItem('placero_theme') as any) || 'obsidian';
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const setTheme = (newTheme: 'obsidian' | 'nordic' | 'editorial' | 'midnight') => {
    setThemeState(newTheme);
    localStorage.setItem('placero_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    document.documentElement.classList.remove('theme-obsidian', 'theme-nordic', 'theme-editorial', 'theme-midnight');
    document.documentElement.classList.add(`theme-${newTheme}`);
  };

  useEffect(() => {
    setTheme(theme);
  }, []);

  // Common fetch helper with x-user-id header
  const authFetch = (url: string, options: RequestInit = {}, activeId = userId) => {
    const headers = {
      'Content-Type': 'application/json',
      'x-user-id': activeId,
      ...(options.headers || {}),
    };
    return fetch(url, { ...options, headers });
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#818cf8', '#34d399', '#f472b6', '#fbbf24'],
      });
    } catch (e) {
      // ignore
    }
  };

  const refreshBadges = async (targetUserId?: string) => {
    try {
      const activeId = targetUserId || userId;
      const res = await authFetch('/api/user/badges', {}, activeId);
      const data = await res.json();
      if (Array.isArray(data)) {
        setBadges(data);
      }
    } catch (err) {
      console.error('Failed to load badges:', err);
    }
  };

  const refreshData = async (overrideUserId?: string) => {
    const targetUserId = overrideUserId || userId;
    try {
      setIsLoading(true);
      const [
        userRes,
        compRes,
        readRes,
        missRes,
        proofRes,
        mistRes,
        feedRes,
        alumRes,
        roadRes,
        badgeRes,
        mockRes,
        cardRes,
        noteRes,
        lcRes,
      ] = await Promise.all([
        authFetch('/api/user/profile', {}, targetUserId).then((r) => r.json()),
        authFetch('/api/companies', {}, targetUserId).then((r) => r.json()),
        authFetch('/api/readiness', {}, targetUserId).then((r) => r.json()),
        authFetch('/api/missions/today', {}, targetUserId).then((r) => r.json()),
        authFetch('/api/proofs', {}, targetUserId).then((r) => r.json()),
        authFetch('/api/mistakes', {}, targetUserId).then((r) => r.json()),
        authFetch('/api/daily-feed', {}, targetUserId).then((r) => r.json()),
        authFetch('/api/alumni', {}, targetUserId).then((r) => r.json()),
        authFetch('/api/roadmap', {}, targetUserId).then((r) => r.json()),
        authFetch('/api/user/badges', {}, targetUserId).then((r) => r.json()).catch(() => []),
        authFetch('/api/user/mock-interviews', {}, targetUserId).then((r) => r.json()).catch(() => []),
        authFetch('/api/study/flashcards', {}, targetUserId).then((r) => r.json()).catch(() => []),
        authFetch('/api/study/notes', {}, targetUserId).then((r) => r.json()).catch(() => []),
        authFetch('/api/leetcode/problems', {}, targetUserId).then((r) => r.json()).catch(() => []),
      ]);

      setUser(userRes);
      setCompanies(compRes);
      if (compRes && compRes.length > 0 && !selectedCompany) {
        setSelectedCompany(compRes[0]);
      }
      setReadiness(readRes);
      setDailyMission(missRes);
      setProofs(proofRes || []);
      setMistakes(mistRes || []);
      setDailyFeed(feedRes || []);
      setAlumniList(alumRes || []);
      setRoadmap(roadRes);
      setBadges(Array.isArray(badgeRes) ? badgeRes : Array.isArray(userRes?.badges) ? userRes.badges : []);
      setMockInterviews(Array.isArray(mockRes) ? mockRes : []);
      setFlashcards(Array.isArray(cardRes) ? cardRes : []);
      setStudyNotes(Array.isArray(noteRes) ? noteRes : []);
      setLeetcodeProblems(Array.isArray(lcRes) ? lcRes : []);
    } catch (err) {
      console.error('Failed to load database records:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData(userId);
  }, [userId]);

  // Real Database Login
  const login = async (credentials: { loginIdOrEmail: string; password?: string; isDemo?: boolean }) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loginId: credentials.loginIdOrEmail,
          email: credentials.loginIdOrEmail,
          password: credentials.password,
          isDemo: credentials.isDemo,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, message: data.error || 'Invalid credentials' };
      }

      const activeUser: UserProfile = data.user;
      setUser(activeUser);
      setUserId(activeUser.id);
      localStorage.setItem('placero_user_id', activeUser.id);
      triggerConfetti();
      await refreshData(activeUser.id);
      setIsAuthModalOpen(false);
      return { success: true, message: data.message };
    } catch (err: any) {
      return { success: false, message: err.message || 'Login failed' };
    }
  };

  // Real Database Registration
  const register = async (data: RegisterData) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        return { success: false, message: result.error || 'Registration failed' };
      }

      const newUser: UserProfile = result.user;
      setUser(newUser);
      setUserId(newUser.id);
      localStorage.setItem('placero_user_id', newUser.id);
      triggerConfetti();
      await refreshData(newUser.id);
      setIsAuthModalOpen(false);
      return { success: true, message: result.message };
    } catch (err: any) {
      return { success: false, message: err.message || 'Registration failed' };
    }
  };

  const logout = () => {
    // Switch to demo mode
    setUserId('user-demo-01');
    localStorage.removeItem('placero_user_id');
    refreshData('user-demo-01');
  };

  const toggleMissionTask = async (taskId: string) => {
    try {
      const res = await authFetch('/api/missions/toggle-task', {
        method: 'POST',
        body: JSON.stringify({ taskId }),
      });
      const data = await res.json();
      setDailyMission(data.mission);
      if (data.user) setUser(data.user);

      if (data.mission?.allCompleted) {
        triggerConfetti();
      }

      // Re-fetch readiness score
      const readRes = await authFetch('/api/readiness').then((r) => r.json());
      setReadiness(readRes);
    } catch (err) {
      console.error('Error toggling mission task in database:', err);
    }
  };

  const toggleRoadmapMilestone = async (milestoneId: string) => {
    try {
      const res = await authFetch('/api/roadmap/toggle', {
        method: 'POST',
        body: JSON.stringify({ milestoneId }),
      });
      const updated = await res.json();
      setRoadmap(updated);

      // Check if all completed or critical completed
      const m = updated.milestones?.find((item: RoadmapMilestone) => item.id === milestoneId);
      if (m && m.completed) {
        triggerConfetti();
      }

      // Refresh readiness
      const readRes = await authFetch('/api/readiness').then((r) => r.json());
      setReadiness(readRes);
    } catch (err) {
      console.error('Error toggling milestone in database:', err);
    }
  };

  const updateRoadmapMilestones = async (milestones: RoadmapMilestone[]) => {
    try {
      const res = await authFetch('/api/roadmap/milestones', {
        method: 'POST',
        body: JSON.stringify({ milestones }),
      });
      const updated = await res.json();
      setRoadmap(updated);
      triggerConfetti();
    } catch (err) {
      console.error('Error updating roadmap milestones in database:', err);
    }
  };

  const generateTailoredRoadmap = async (targetCompany?: string, branch?: string, totalWeeks = 10) => {
    try {
      setIsLoading(true);
      const res = await authFetch('/api/roadmap/generate', {
        method: 'POST',
        body: JSON.stringify({ targetCompany, branch, totalWeeks }),
      });
      const updated = await res.json();
      setRoadmap(updated);
      triggerConfetti();
    } catch (err) {
      console.error('Error generating tailored roadmap:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addProof = async (proof: Partial<ProjectEvidence>): Promise<ProjectEvidence> => {
    const res = await authFetch('/api/proofs', {
      method: 'POST',
      body: JSON.stringify(proof),
    });
    const newProof = await res.json();
    setProofs((prev) => [newProof, ...prev]);
    triggerConfetti();
    refreshData();
    return newProof;
  };

  const deleteProof = async (id: string) => {
    await authFetch(`/api/proofs/${id}`, { method: 'DELETE' });
    setProofs((prev) => prev.filter((p) => p.id !== id));
    refreshData();
  };

  const addMistake = async (mistake: Partial<MistakeRecord>): Promise<MistakeRecord> => {
    const res = await authFetch('/api/mistakes', {
      method: 'POST',
      body: JSON.stringify(mistake),
    });
    const newMistake = await res.json();
    setMistakes((prev) => [newMistake, ...prev]);
    refreshData();
    return newMistake;
  };

  const deleteMistake = async (id: string) => {
    await authFetch(`/api/mistakes/${id}`, { method: 'DELETE' });
    setMistakes((prev) => prev.filter((m) => m.id !== id));
  };

  const saveMockInterview = async (data: any) => {
    try {
      const res = await authFetch('/api/user/mock-interviews', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.interview) {
        setMockInterviews((prev) => [result.interview, ...prev]);
      }
      if (result.badges) {
        setBadges(result.badges);
      }
      triggerConfetti();
      refreshData();
    } catch (err) {
      console.error('Error saving mock interview:', err);
    }
  };

  const logStudySession = async (minutes: number) => {
    try {
      const res = await authFetch('/api/study/log-session', {
        method: 'POST',
        body: JSON.stringify({ minutes }),
      });
      const data = await res.json();
      if (data.user) setUser(data.user);
      if (data.badges) setBadges(data.badges);
      triggerConfetti();
    } catch (err) {
      console.error('Error logging study session:', err);
    }
  };

  const updateFlashcardMastery = async (id: string, delta: number) => {
    try {
      await authFetch(`/api/study/flashcards/${id}/mastery`, {
        method: 'POST',
        body: JSON.stringify({ delta }),
      });
      setFlashcards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, masteryLevel: Math.max(0, Math.min(5, (c.masteryLevel || 0) + delta)) } : c))
      );
    } catch (err) {
      console.error('Error updating flashcard:', err);
    }
  };

  const addFlashcard = async (card: any) => {
    try {
      const res = await authFetch('/api/study/flashcards', {
        method: 'POST',
        body: JSON.stringify(card),
      });
      const created = await res.json();
      setFlashcards((prev) => [created, ...prev]);
      triggerConfetti();
    } catch (err) {
      console.error('Error adding flashcard:', err);
    }
  };

  const saveStudyNote = async (note: any) => {
    try {
      const res = await authFetch('/api/study/notes', {
        method: 'POST',
        body: JSON.stringify(note),
      });
      const saved = await res.json();
      setStudyNotes((prev) => {
        const idx = prev.findIndex((n) => n.id === saved.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = saved;
          return next;
        }
        return [saved, ...prev];
      });
    } catch (err) {
      console.error('Error saving note:', err);
    }
  };

  const deleteStudyNote = async (id: string) => {
    try {
      await authFetch(`/api/study/notes/${id}`, { method: 'DELETE' });
      setStudyNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };

  const submitLeetCodeSolution = async (problemId: string, data: { code: string; language: string; notes?: string }) => {
    try {
      const res = await authFetch(`/api/leetcode/problems/${problemId}/submit`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      const result: LeetCodeSubmissionResult = await res.json();
      if (result.status === 'Accepted') {
        triggerConfetti();
        setLeetcodeProblems((prev) =>
          prev.map((p) =>
            p.id === problemId
              ? {
                  ...p,
                  solved: true,
                  status: 'Solved',
                  runtimeMs: result.runtimeMs,
                  memoryMb: result.memoryMb,
                  userCode: data.code,
                  userLanguage: data.language,
                  notes: data.notes || p.notes,
                }
              : p
          )
        );
        if (result.badges && Array.isArray(result.badges)) {
          setBadges(result.badges);
        }
        refreshData();
      }
      return result;
    } catch (err) {
      console.error('Failed to submit solution:', err);
      return null;
    }
  };

  const runLeetCodeCode = async (problemId: string, code: string, language: string, customInput?: string) => {
    try {
      const res = await authFetch(`/api/leetcode/problems/${problemId}/run`, {
        method: 'POST',
        body: JSON.stringify({ code, language, customInput }),
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message || 'Execution error' };
    }
  };

  const saveLeetCodeNote = async (problemId: string, notes: string) => {
    try {
      await authFetch(`/api/leetcode/problems/${problemId}/notes`, {
        method: 'POST',
        body: JSON.stringify({ notes }),
      });
      setLeetcodeProblems((prev) =>
        prev.map((p) => (p.id === problemId ? { ...p, notes } : p))
      );
    } catch (err) {
      console.error('Failed to save LeetCode note:', err);
    }
  };

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    const res = await authFetch('/api/user/profile', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
    const updated = await res.json();
    setUser(updated);
    if (updated.badges && Array.isArray(updated.badges)) setBadges(updated.badges);
    refreshData();
  };

  const resetDemoUser = async () => {
    setUserId('user-demo-01');
    localStorage.removeItem('placero_user_id');
    const res = await fetch('/api/user/reset-demo', { method: 'POST' });
    const data = await res.json();
    if (data.user) {
      setUser(data.user);
      triggerConfetti();
      await refreshData('user-demo-01');
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        companies,
        selectedCompany,
        readiness,
        dailyMission,
        proofs,
        mistakes,
        dailyFeed,
        alumniList,
        roadmap,
        badges,
        mockInterviews,
        flashcards,
        studyNotes,
        leetcodeProblems,
        activeLeetcodeProblem,
        setActiveLeetcodeProblem,
        submitLeetCodeSolution,
        runLeetCodeCode,
        saveLeetCodeNote,
        activeTab,
        searchQuery,
        isAIChatOpen,
        isOnboardingOpen,
        isPortfolioOpen,
        isAuthModalOpen,
        isPersonalityModalOpen,
        theme,
        isLoading,
        setActiveTab,
        setSearchQuery,
        setIsAIChatOpen,
        setIsOnboardingOpen,
        setIsPortfolioOpen,
        setIsAuthModalOpen,
        setIsPersonalityModalOpen,
        setTheme,
        setSelectedCompany,
        toggleMissionTask,
        addProof,
        deleteProof,
        addMistake,
        deleteMistake,
        updateProfile,
        toggleRoadmapMilestone,
        updateRoadmapMilestones,
        generateTailoredRoadmap,
        saveMockInterview,
        logStudySession,
        updateFlashcardMastery,
        addFlashcard,
        saveStudyNote,
        deleteStudyNote,
        refreshBadges,
        login,
        register,
        logout,
        resetDemoUser,
        triggerConfetti,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

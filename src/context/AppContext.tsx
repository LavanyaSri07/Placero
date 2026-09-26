import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  UserProfile,
  Company,
  DailyMission,
  OverallReadiness,
  ProjectEvidence,
  MistakeRecord,
  InterviewQuestion,
  DailyFeedCard,
  AlumniProfile,
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
  activeTab: string;
  searchQuery: string;
  isAIChatOpen: boolean;
  isOnboardingOpen: boolean;
  isPortfolioOpen: boolean;
  isLoading: boolean;
  setActiveTab: (tab: string) => void;
  setSearchQuery: (query: string) => void;
  setIsAIChatOpen: (open: boolean) => void;
  setIsOnboardingOpen: (open: boolean) => void;
  setIsPortfolioOpen: (open: boolean) => void;
  setSelectedCompany: (company: Company | null) => void;
  toggleMissionTask: (taskId: string) => Promise<void>;
  addProof: (proof: Partial<ProjectEvidence>) => Promise<ProjectEvidence>;
  deleteProof: (id: string) => Promise<void>;
  addMistake: (mistake: Partial<MistakeRecord>) => Promise<MistakeRecord>;
  deleteMistake: (id: string) => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  resetDemoUser: () => Promise<void>;
  triggerConfetti: () => void;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [readiness, setReadiness] = useState<OverallReadiness | null>(null);
  const [dailyMission, setDailyMission] = useState<DailyMission | null>(null);
  const [proofs, setProofs] = useState<ProjectEvidence[]>([]);
  const [mistakes, setMistakes] = useState<MistakeRecord[]>([]);
  const [dailyFeed, setDailyFeed] = useState<DailyFeedCard[]>([]);
  const [alumniList, setAlumniList] = useState<AlumniProfile[]>([]);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAIChatOpen, setIsAIChatOpen] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isPortfolioOpen, setIsPortfolioOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#818cf8', '#34d399', '#f472b6', '#fbbf24'],
      });
    } catch (e) {
      // ignore if unavailable
    }
  };

  const refreshData = async () => {
    try {
      setIsLoading(true);
      const [userRes, compRes, readRes, missRes, proofRes, mistRes, feedRes, alumRes] = await Promise.all([
        fetch('/api/user/profile').then(r => r.json()),
        fetch('/api/companies').then(r => r.json()),
        fetch('/api/readiness').then(r => r.json()),
        fetch('/api/missions/today').then(r => r.json()),
        fetch('/api/proofs').then(r => r.json()),
        fetch('/api/mistakes').then(r => r.json()),
        fetch('/api/daily-feed').then(r => r.json()),
        fetch('/api/alumni').then(r => r.json()),
      ]);

      setUser(userRes);
      setCompanies(compRes);
      if (compRes.length > 0 && !selectedCompany) {
        setSelectedCompany(compRes[0]);
      }
      setReadiness(readRes);
      setDailyMission(missRes);
      setProofs(proofRes);
      setMistakes(mistRes);
      setDailyFeed(feedRes);
      setAlumniList(alumRes);
    } catch (err) {
      console.error('Failed to load initial Placero data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const toggleMissionTask = async (taskId: string) => {
    try {
      const res = await fetch('/api/missions/toggle-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId }),
      });
      const data = await res.json();
      setDailyMission(data.mission);
      if (data.user) setUser(data.user);

      // Check if all completed
      if (data.mission.allCompleted) {
        triggerConfetti();
      }

      // Re-fetch readiness score to reflect completed mission
      const readRes = await fetch('/api/readiness').then(r => r.json());
      setReadiness(readRes);
    } catch (err) {
      console.error('Error toggling mission task:', err);
    }
  };

  const addProof = async (proof: Partial<ProjectEvidence>): Promise<ProjectEvidence> => {
    const res = await fetch('/api/proofs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(proof),
    });
    const newProof = await res.json();
    setProofs(prev => [newProof, ...prev]);
    triggerConfetti();
    refreshData();
    return newProof;
  };

  const deleteProof = async (id: string) => {
    await fetch(`/api/proofs/${id}`, { method: 'DELETE' });
    setProofs(prev => prev.filter(p => p.id !== id));
    refreshData();
  };

  const addMistake = async (mistake: Partial<MistakeRecord>): Promise<MistakeRecord> => {
    const res = await fetch('/api/mistakes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mistake),
    });
    const newMistake = await res.json();
    setMistakes(prev => [newMistake, ...prev]);
    refreshData();
    return newMistake;
  };

  const deleteMistake = async (id: string) => {
    await fetch(`/api/mistakes/${id}`, { method: 'DELETE' });
    setMistakes(prev => prev.filter(m => m.id !== id));
  };

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    const res = await fetch('/api/user/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
    });
    const updated = await res.json();
    setUser(updated);
    refreshData();
  };

  const resetDemoUser = async () => {
    const res = await fetch('/api/user/reset-demo', { method: 'POST' });
    const data = await res.json();
    if (data.user) {
      setUser(data.user);
      triggerConfetti();
      await refreshData();
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
        activeTab,
        searchQuery,
        isAIChatOpen,
        isOnboardingOpen,
        isPortfolioOpen,
        isLoading,
        setActiveTab,
        setSearchQuery,
        setIsAIChatOpen,
        setIsOnboardingOpen,
        setIsPortfolioOpen,
        setSelectedCompany,
        toggleMissionTask,
        addProof,
        deleteProof,
        addMistake,
        deleteMistake,
        updateProfile,
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

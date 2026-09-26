import React from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Header } from './components/Header.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { MobileNav } from './components/MobileNav.tsx';
import { DashboardView } from './views/DashboardView.tsx';
import { CompanyWarRoomView } from './views/CompanyWarRoomView.tsx';
import { ProofLabView } from './views/ProofLabView.tsx';
import { MockInterviewView } from './views/MockInterviewView.tsx';
import { ResumeBulletLabView } from './views/ResumeBulletLabView.tsx';
import { CoreEngineerModeView } from './views/CoreEngineerModeView.tsx';
import { MistakeVaultView } from './views/MistakeVaultView.tsx';
import { ReverseAuditView } from './views/ReverseAuditView.tsx';
import { RcaLabView } from './views/RcaLabView.tsx';
import { AlumniIntelligenceView } from './views/AlumniIntelligenceView.tsx';
import { AdminView } from './views/AdminView.tsx';
import { OnboardingModal } from './components/OnboardingModal.tsx';
import { AIChatDrawer } from './components/AIChatDrawer.tsx';
import { PublicPortfolioModal } from './components/PublicPortfolioModal.tsx';

const AppContent: React.FC = () => {
  const { activeTab, isLoading } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'companies':
        return <CompanyWarRoomView />;
      case 'proof-lab':
        return <ProofLabView />;
      case 'mock-interview':
        return <MockInterviewView />;
      case 'resume-lab':
        return <ResumeBulletLabView />;
      case 'core-engineer':
        return <CoreEngineerModeView />;
      case 'mistake-vault':
        return <MistakeVaultView />;
      case 'reverse-audit':
        return <ReverseAuditView />;
      case 'rca-lab':
        return <RcaLabView />;
      case 'alumni':
        return <AlumniIntelligenceView />;
      case 'admin':
        return <AdminView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-sky-500/30 selection:text-sky-200">
      <Header />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden min-w-0">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[500px]">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-sky-500/20 border-t-sky-400 rounded-full animate-spin" />
                <span className="text-xs text-slate-400 font-semibold tracking-wide">
                  Loading Placement OS...
                </span>
              </div>
            </div>
          ) : (
            renderActiveView()
          )}
        </main>
      </div>

      <MobileNav />
      <OnboardingModal />
      <AIChatDrawer />
      <PublicPortfolioModal />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;

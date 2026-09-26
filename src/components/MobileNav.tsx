import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  LayoutDashboard,
  Building2,
  FolderGit2,
  Mic2,
  FileText,
  Map,
  User,
  Menu,
  Code2,
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const mobileTabs = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'roadmap', label: 'Roadmap', icon: Map },
    { id: 'leetcode', label: 'LeetCode', icon: Code2 },
    { id: 'mock-interview', label: 'Interview', icon: Mic2 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-2 py-2 flex items-center justify-around">
      {mobileTabs.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
              isActive ? 'text-sky-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  X,
  Sparkles,
  Send,
  ArrowRight,
  Bot,
  User,
  Zap,
  HelpCircle,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  recommendedAction?: string;
  suggestedNextQuestion?: string;
  timestamp: string;
}

export const AIChatDrawer: React.FC = () => {
  const { isAIChatOpen, setIsAIChatOpen, user, selectedCompany } = useApp();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello ${user?.name?.split(' ')[0] || 'there'}! I am Placero's Senior Placement Coach.

My philosophy is: **"Build proof, not just claims."**
I am synced with your profile:
• **Branch:** ${user?.branch || 'Chemical Engineering'}
• **Target:** ${selectedCompany?.name || 'Reliance Industries Limited'}
• **Weakest Area:** Industrial Process Safety & HAZOP

What would you like to prepare or prove today?`,
      recommendedAction: 'Ask me for a difficult company-specific interview question on your weakest topic.',
      suggestedNextQuestion: 'What should I study today for Reliance Industries?',
      timestamp: 'Just now',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  if (!isAIChatOpen) return null;

  const handleSend = async (questionToSend?: string) => {
    const q = questionToSend || input;
    if (!q.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.answer || 'Here is your guidance.',
        recommendedAction: data.recommendedAction,
        suggestedNextQuestion: data.suggestedNextQuestion,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Error asking coach:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    'What should I study today?',
    `Am I ready for ${selectedCompany?.name || 'Reliance'}?`,
    'Give me a hard technical interview question.',
    'How do I explain my project to a recruiter?',
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm text-white">Placero AI Career Coach</h2>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Grounded in Real Engineering Standards</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsAIChatOpen(false)}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[90%] p-3.5 rounded-2xl text-xs leading-relaxed space-y-2 ${
                m.sender === 'user'
                  ? 'bg-sky-600 text-white rounded-tr-none'
                  : 'bg-slate-950/90 text-slate-200 border border-slate-800 rounded-tl-none'
              }`}
            >
              <div className="whitespace-pre-line">{m.text}</div>

              {m.recommendedAction && (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] mt-2">
                  <strong className="block font-bold">Recommended 20-Min Action:</strong>
                  <span>{m.recommendedAction}</span>
                </div>
              )}
            </div>

            {m.suggestedNextQuestion && (
              <button
                onClick={() => handleSend(m.suggestedNextQuestion)}
                className="mt-1.5 text-[11px] font-semibold text-sky-400 hover:underline flex items-center gap-1"
              >
                <span>Follow-up: {m.suggestedNextQuestion}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}

            <span className="text-[10px] text-slate-500 mt-1 font-mono">{m.timestamp}</span>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 text-xs text-slate-400 italic">
            <Sparkles className="w-4 h-4 text-sky-400 animate-spin" />
            <span>Consulting engineering curriculum & standards...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2 border-t border-slate-800 bg-slate-950/40 flex gap-1.5 overflow-x-auto scrollbar-none">
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 shrink-0 font-medium transition"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <div className="p-3 border-t border-slate-800 bg-slate-950">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about formulas, companies, interview viva..."
            className="flex-1 px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white disabled:opacity-50 transition cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

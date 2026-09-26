import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { MistakeRecord } from '../types/index.ts';
import {
  ShieldAlert,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

export const MistakeVaultView: React.FC = () => {
  const { mistakes, addMistake, deleteMistake, user } = useApp();

  const [isAdding, setIsAdding] = useState(false);
  const [questionOrProblem, setQuestionOrProblem] = useState('');
  const [studentAnswer, setStudentAnswer] = useState('');
  const [whatWentWrong, setWhatWentWrong] = useState('');
  const [correctConcept, setCorrectConcept] = useState('');
  const [improvedAnswer, setImprovedAnswer] = useState('');
  const [category, setCategory] = useState<'Core Concept' | 'Assumptions' | 'Calculation' | 'Technical' | 'Communication'>('Assumptions');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    if (!questionOrProblem || !whatWentWrong || !correctConcept) {
      setValidationError('Please fill out the problem, what went wrong, and correct concept.');
      return;
    }

    await addMistake({
      questionOrProblem,
      studentAnswer,
      whatWentWrong,
      correctConcept,
      improvedAnswer,
      category,
      branch: user?.branch || 'Chemical Engineering',
      repeatStatus: 'First Time',
    });

    setQuestionOrProblem('');
    setStudentAnswer('');
    setWhatWentWrong('');
    setCorrectConcept('');
    setImprovedAnswer('');
    setValidationError(null);
    setIsAdding(false);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">
              <span>Failure Pattern Lab</span>
              <span>•</span>
              <span>Turn Blunders Into Mastery</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>Mistake Vault</span>
              <span>🛡️</span>
            </h1>
            <p className="text-xs lg:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              <strong>Webpage Objective:</strong> Your personal engineering failure pattern journal. Every viva trap question, unstated assumption error, or calculation misstep logged here is saved to SQLite, categorized by failure mode, and tracked until verified as <em>Mastered Now</em>. Eliminates repeat mistakes before you face company technical panels.
            </p>
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-md transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isAdding ? 'Close Logger' : 'Log New Mistake'}</span>
          </button>
        </div>

        {validationError && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Top Recurring Pattern Alert */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 p-3.5 rounded-xl bg-slate-950/60 border border-rose-500/20 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-rose-300 block uppercase">
              Top Recurring Campus Rejection Pattern: Not Explaining Boundary Assumptions
            </span>
            <p className="text-slate-300 mt-0.5 leading-relaxed">
              82% of technical rejections occur when students calculate formulas without stating assumptions (steady-state, ideal gas, laminar vs turbulent). Always state assumptions first!
            </p>
          </div>
        </div>
      </div>

      {/* CREATE MISTAKE FORM */}
      {isAdding && (
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900 border border-rose-500/30 rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in duration-300"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="font-bold text-base text-white">Log Interview / Assessment Mistake</h2>
            <span className="text-xs text-rose-400 font-semibold">Self-Audit</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Question or Problem Context <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={questionOrProblem}
                onChange={(e) => setQuestionOrProblem(e.target.value)}
                placeholder="e.g. Centrifugal pump cavitation troubleshooting"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Failure Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-rose-500"
              >
                <option value="Assumptions">Not Stating Assumptions</option>
                <option value="Core Concept">Core Conceptual Error</option>
                <option value="Calculation">Numerical / Units Blunder</option>
                <option value="Technical">Technical Depth Deficit</option>
                <option value="Communication">Vague / Ramble Delivery</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">My Initial Flawed Answer</label>
              <textarea
                rows={2}
                value={studentAnswer}
                onChange={(e) => setStudentAnswer(e.target.value)}
                placeholder="What did you say or do in the mock round?"
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-400 mb-1">
                What Went Wrong? (The Fatal Flaw) <span className="text-rose-400">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={whatWentWrong}
                onChange={(e) => setWhatWentWrong(e.target.value)}
                placeholder="Why is that answer fatal in a technical interview?"
                className="w-full p-2.5 bg-slate-950 border border-rose-500/40 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-emerald-400 mb-1">
                The Correct Engineering Concept <span className="text-rose-400">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={correctConcept}
                onChange={(e) => setCorrectConcept(e.target.value)}
                placeholder="The physical principle, formula, or ASME/API code specification..."
                className="w-full p-2.5 bg-slate-950 border border-emerald-500/40 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-sky-400 mb-1">My Improved Answer for Next Time</label>
              <textarea
                rows={2}
                value={improvedAnswer}
                onChange={(e) => setImprovedAnswer(e.target.value)}
                placeholder="How I will deliver this answer next time in under 60 seconds..."
                className="w-full p-2.5 bg-slate-950 border border-sky-500/40 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition"
            >
              Lock Into Vault
            </button>
          </div>
        </form>
      )}

      {/* MISTAKE CARDS */}
      <div className="space-y-4">
        {mistakes.map((m) => (
          <div
            key={m.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    {m.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Logged: {m.dateLogged}</span>
                  <span className="text-slate-600">•</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      m.repeatStatus === 'Mastered Now'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {m.repeatStatus}
                  </span>
                </div>
                <h3 className="font-bold text-base text-white">{m.questionOrProblem}</h3>
              </div>

              <button
                onClick={() => deleteMistake(m.id)}
                className="text-slate-500 hover:text-rose-400 p-1 transition"
                title="Remove mistake"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {m.studentAnswer && (
              <div className="text-xs text-slate-400 italic">
                Candidate initially said: "{m.studentAnswer}"
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30">
                <span className="font-bold text-rose-300 block mb-1">What Went Wrong:</span>
                <p className="text-slate-300 leading-relaxed">{m.whatWentWrong}</p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                <span className="font-bold text-emerald-300 block mb-1">Correct Concept & Rule:</span>
                <p className="text-slate-300 leading-relaxed">{m.correctConcept}</p>
              </div>
            </div>

            {m.improvedAnswer && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="font-bold text-sky-400 block mb-0.5">Mastered Delivery for Next Round:</span>
                <p className="text-slate-200 italic leading-relaxed">"{m.improvedAnswer}"</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

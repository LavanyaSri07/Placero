import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ResumeBulletEvaluation } from '../types/index.ts';
import {
  FileText,
  Sparkles,
  Copy,
  Check,
  HelpCircle,
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const ResumeBulletLabView: React.FC = () => {
  const { user, selectedCompany, triggerConfetti } = useApp();

  const [rawBullet, setRawBullet] = useState(
    'Worked on milk chilling project using shell and tube heat exchanger to reduce cooling time.'
  );
  const [evaluation, setEvaluation] = useState<ResumeBulletEvaluation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  // Probing answers state
  const [additionalContext, setAdditionalContext] = useState('');

  const analyzeBullet = async () => {
    if (!rawBullet.trim()) return;

    setIsLoading(true);
    try {
      const fullText = additionalContext
        ? `${rawBullet} (Additional parameters supplied: ${additionalContext})`
        : rawBullet;

      const res = await fetch('/api/ai/resume-bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawBullet: fullText,
          targetCompany: selectedCompany?.name || 'Top Engineering Recruiter',
        }),
      });

      const data: ResumeBulletEvaluation = await res.json();
      setEvaluation(data);
      triggerConfetti();
    } catch (err) {
      console.error('Failed to analyze resume bullet:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
              <span>Resume "So What?" Engine</span>
              <span>•</span>
              <span>Google XYZ & Executive Standard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>Resume Bullet Lab</span>
              <span>✍️</span>
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Transform passive academic bullets into high-conviction engineering achievements. The engine enforces{' '}
              <strong className="text-white">ACTION + CONTEXT + QUANTIFIABLE RESULT + BUSINESS IMPACT</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-bold text-slate-300">
            <span>Discipline: {user?.branch || 'Engineering'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Box (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                Paste Your Current Resume Bullet
              </label>
              <textarea
                rows={3}
                value={rawBullet}
                onChange={(e) => setRawBullet(e.target.value)}
                placeholder="e.g. Worked on heat exchanger simulation to improve temperature..."
                className="w-full p-3.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-amber-500 leading-relaxed"
              />
            </div>

            {/* Quick sample chips */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">Try sample weak bullets:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Worked on a milk chilling project with heat exchanger.',
                  'Designed 3D model of drone frame in SolidWorks.',
                  'Wrote Python script for data processing of sensor values.',
                  'Studied substation protection relays and single line diagrams.',
                ].map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setRawBullet(sample);
                      setAdditionalContext('');
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
                  >
                    "{sample.slice(0, 32)}..."
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Additional Parameters / Metrics answered */}
            <div>
              <label className="block text-xs font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Add Missing Technical Metrics (Quantify Facts)</span>
              </label>
              <textarea
                rows={2}
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
                placeholder="e.g. 5,000 L/day capacity; cooled from 35°C to 4°C in 2.5 hours; saved 18% electricity using ammonia refrigerant..."
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
              <p className="text-[10px] text-slate-400 mt-1 italic">
                *The system will never invent metrics for you. Supply actual project figures to generate verifiable bullets.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={analyzeBullet}
                disabled={isLoading || !rawBullet.trim()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isLoading ? 'Transforming Bullet...' : 'Run "So What?" Engine (+50 XP)'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Output & Probing Engine (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {evaluation ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">Transformed Results</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                      evaluation.actionVerbStrength === 'Power Verb'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    Verb: {evaluation.actionVerbStrength}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">2 Formats Generated</span>
              </div>

              {/* Improved versions */}
              <div className="space-y-3">
                {evaluation.improvedVersions.map((v, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/40 transition space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                        {v.framework}
                      </span>
                      <button
                        onClick={() => copyToClipboard(v.text, idx)}
                        className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-bold"
                      >
                        {copiedIdx === idx ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Bullet</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-xs font-medium text-slate-100 leading-relaxed pl-2 border-l-2 border-amber-500">
                      • {v.text}
                    </p>

                    <p className="text-[10px] text-slate-400 italic">
                      Why it works: {v.strengths}
                    </p>
                  </div>
                ))}
              </div>

              {/* Missing Information Questions */}
              {evaluation.missingInformationQuestions && evaluation.missingInformationQuestions.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                    <HelpCircle className="w-4 h-4 text-amber-400" />
                    <span>Probing Questions to Strengthen This Bullet:</span>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1.5 pl-4 list-disc">
                    {evaluation.missingInformationQuestions.map((q, idx) => (
                      <li key={idx} className="leading-snug">{q}</li>
                    ))}
                  </ul>
                  <p className="text-[10px] text-amber-200/80 pt-1">
                    Tip: Answer these questions in the "Missing Technical Metrics" box on the left, then click transform again.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg text-center space-y-3 flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-sm">Waiting for Resume Bullet</h3>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                Paste your bullet on the left. Placero will transform it using verified recruiter frameworks and identify any missing metrics.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

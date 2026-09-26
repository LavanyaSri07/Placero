import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Users,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Copy,
  Check,
  Building2,
  GraduationCap,
} from 'lucide-react';

export const AlumniIntelligenceView: React.FC = () => {
  const { alumniList, selectedCompany, user } = useApp();

  const [activeAlumni, setActiveAlumni] = useState(alumniList[0] || null);
  const [copied, setCopied] = useState(false);

  const outreachMessage = `Hi ${activeAlumni?.name || 'Senior'},

I am ${user?.name || 'a final-year student'} studying ${user?.branch || 'Engineering'} at ${user?.college || 'National Institute of Technology'}. I am targeting a Graduate Engineer Trainee role at ${activeAlumni?.company || 'Reliance Industries'} and admire your trajectory in ${activeAlumni?.role || 'operations'}.

I recently documented a verified project on ${user?.currentSkills?.[0]?.name || 'process optimization'} and would love to ask one quick question: what technical boundary condition surprised you most in your technical panel interview?

Thank you so much for your time and guidance!
Warm regards,
${user?.name || user?.loginId || 'Engineering Candidate'}`;

  const copyMessage = () => {
    navigator.clipboard.writeText(outreachMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
              <span>Verified Senior Network</span>
              <span>•</span>
              <span>On-Ground Campus Placement Reality</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>Alumni Intelligence</span>
              <span>🎓</span>
            </h1>
            <p className="text-xs lg:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              <strong>Webpage Objective:</strong> Connects candidate preparation with on-ground campus placement reality. Review verified interviews and reflections from recent batch alumni at top employers (Reliance, Tata Motors, Siemens, L&T, Google), discover surprise questions from actual viva rooms, and generate tailored, polite LinkedIn outreach messages.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Alumni Cards List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Verified Alumni Profiles ({alumniList.length})
          </div>

          {alumniList.map((a) => {
            const isSelected = activeAlumni?.id === a.id;
            return (
              <div
                key={a.id}
                onClick={() => setActiveAlumni(a)}
                className={`p-4 rounded-2xl border transition cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 border-indigo-500/50 shadow-lg'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-white">{a.name}</h3>
                    <div className="text-xs text-indigo-400 font-semibold">{a.company}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{a.role}</div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Class of {a.batchYear}
                  </span>
                </div>
                <div className="mt-2 text-[11px] text-slate-400 line-clamp-2 italic">
                  "{a.topAdvice}"
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Insights & Cold Outreach Generator (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {activeAlumni && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-indigo-400">{activeAlumni.company}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs text-slate-400">{activeAlumni.branch}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">{activeAlumni.name}</h2>
                  <p className="text-xs text-slate-300 mt-0.5">{activeAlumni.role}</p>
                </div>

                <a
                  href={activeAlumni.linkedInUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-sky-400 border border-slate-700 transition flex items-center gap-1.5"
                >
                  <span>LinkedIn Profile</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Three High-Yield Questions */}
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="font-bold text-amber-300 block">
                    1. What surprised you most in your final interview?
                  </span>
                  <p className="text-slate-200 leading-relaxed italic">
                    "{activeAlumni.whatSurprisedInInterview}"
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="font-bold text-emerald-300 block">
                    2. What technical skill mattered most during your first six months?
                  </span>
                  <p className="text-slate-200 leading-relaxed">
                    {activeAlumni.keySkillFirst6Months}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="font-bold text-indigo-300 block">
                    3. What is your #1 advice to campus candidates today?
                  </span>
                  <p className="text-slate-200 leading-relaxed font-medium">
                    "{activeAlumni.topAdvice}"
                  </p>
                </div>
              </div>

              {/* Cold Outreach Generator */}
              <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span>Personalized LinkedIn Outreach Template</span>
                  </span>

                  <button
                    onClick={copyMessage}
                    className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Message</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="text-[11px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed p-3 bg-slate-900 rounded-lg border border-slate-800">
                  {outreachMessage}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

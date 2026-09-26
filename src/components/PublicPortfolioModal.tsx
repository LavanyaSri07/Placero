import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  X,
  Printer,
  ExternalLink,
  ShieldCheck,
  Award,
  CheckCircle2,
  FileCode,
  Flame,
  Building2,
  Share2,
} from 'lucide-react';

export const PublicPortfolioModal: React.FC = () => {
  const { isPortfolioOpen, setIsPortfolioOpen, user, proofs, readiness } = useApp();

  if (!isPortfolioOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="p-4 px-6 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-sky-400 font-bold">
            <Share2 className="w-4 h-4" />
            <span>Public Candidate Proof Portfolio • /portfolio/{user?.name?.toLowerCase().replace(/\s+/g, '-') || 'candidate'}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 border border-slate-700 transition"
            >
              <Printer className="w-4 h-4 text-sky-400" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={() => setIsPortfolioOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Candidate Portfolio Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Header Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-indigo-950/30 to-slate-950 border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-sky-400 mb-1">
                <span>{user?.college}</span>
                <span>•</span>
                <span>{user?.degree} in {user?.branch}</span>
              </div>
              <h1 className="text-2xl font-black text-white">{user?.name}</h1>
              <p className="text-xs text-slate-300 mt-0.5">{user?.preferredRole}</p>
              <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400 font-mono">
                <span>CGPA: {user?.cgpa} / 10.0</span>
                <span>•</span>
                <span>Target: {user?.targetCompanies?.join(', ')}</span>
              </div>
            </div>

            {/* Verified Readiness Score Badge */}
            <div className="bg-slate-900 border border-sky-500/30 px-4 py-3 rounded-2xl text-center">
              <div className="text-[10px] uppercase font-bold text-slate-400">Verified Readiness</div>
              <div className="text-2xl font-black text-sky-400 font-mono mt-0.5">
                {readiness?.totalScore || 78}%
              </div>
              <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">
                {readiness?.statusLabel || 'Interview Ready'}
              </span>
            </div>
          </div>

          {/* Core Philosophy Banner */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-emerald-500/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-slate-200">
                Placement OS Verified Proof: All metrics and simulations are audited.
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">
              {proofs.length} Projects Verified
            </span>
          </div>

          {/* Verified Proof Projects */}
          <div className="space-y-4">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-400">
              Verified Engineering Proof Projects ({proofs.length})
            </h2>

            {proofs.map((p) => (
              <div key={p.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {p.skill}
                    </span>
                    <h3 className="font-bold text-base text-white mt-1">{p.title}</h3>
                  </div>

                  {p.evidenceScore && (
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Audit Score</div>
                      <div className="text-base font-black text-emerald-400 font-mono">
                        {p.evidenceScore.overall}/100
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/20 text-xs">
                  <span className="font-bold text-emerald-400 uppercase tracking-wider block mb-0.5">
                    Quantifiable Impact & Verified Numbers:
                  </span>
                  <p className="text-slate-200 font-medium">{p.quantifiableImpact}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-400">
                  <div>
                    <strong className="text-slate-300 block mb-0.5">Engineering Problem:</strong>
                    <p>{p.problemStatement}</p>
                  </div>
                  <div>
                    <strong className="text-slate-300 block mb-0.5">Approach & Standards:</strong>
                    <p>{p.engineeringApproach}</p>
                  </div>
                </div>

                {p.toolsUsed && (
                  <div className="flex flex-wrap gap-1 text-[10px] pt-1">
                    {p.toolsUsed.map((t, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-900 rounded border border-slate-800 text-slate-300 font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Badges / Milestones */}
          <div className="space-y-2">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-400">
              Verified Placement Milestones
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {user?.badges?.map((b) => (
                <div key={b.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                  <span className="text-2xl">{b.icon}</span>
                  <div>
                    <h4 className="font-bold text-xs text-white">{b.name}</h4>
                    <p className="text-[10px] text-slate-400 leading-snug">{b.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

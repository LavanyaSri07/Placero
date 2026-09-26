import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ReverseAudit, CompanyPrepPlan } from '../types/index.ts';
import {
  GitBranch,
  Sparkles,
  Printer,
  Calendar,
  Building2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const ReverseAuditView: React.FC = () => {
  const { selectedCompany, companies, user, triggerConfetti } = useApp();

  const [activeTabMode, setActiveTabMode] = useState<'audit' | 'plan'>('audit');
  const [targetProcess, setTargetProcess] = useState('Refinery Preheat Train & Pinch Exchangers');
  const [targetRole, setTargetRole] = useState('Graduate Engineer Trainee (Process)');
  const [isLoading, setIsLoading] = useState(false);

  const [auditResult, setAuditResult] = useState<ReverseAudit | null>({
    id: 'rev-01',
    companyName: selectedCompany?.name || 'Reliance Industries Limited',
    productOrProcess: 'Crude Distillation Unit Preheat Exchanger Train',
    currentWorkflow: 'Continuous crude preheating using 14 shell-and-tube exchangers recovering thermal duty from atmospheric residue and diesel cuts prior to the gas-fired furnace.',
    identifiedBottleneck: 'Thermal fouling and hydraulic pressure drop buildup across exchangers E-102 and E-104, forcing 8% higher fuel gas firing in the furnace.',
    rootCauseAnalysis: 'Asphaltene particulate deposition under low shear velocity (<0.9 m/s) during high sour crude blends, creating a high-resistance fouling layer on the tube wall.',
    proposedSolution: 'Retrofit with high-shear twisted-tape turbulators and install automated continuous differential pressure transmitters with predictive clean-in-place scheduling.',
    estimatedEngineeringImpact: 'Reduces furnace fuel gas consumption by 12.4%, cuts CO2 emissions by 1,420 tons/year, and extends run-length between shutdowns by 4 months.',
    tradeOffsAndRisks: 'Higher initial tube bundle pressure drop (requires 0.4 bar extra booster pump head) and specialized cleaning tooling.',
    implementationPhases: [
      { phase: 'Phase 1: Hydraulic Audit', duration: '2 Weeks', deliverable: 'Differential pressure logging and fouling resistance baseline curves.' },
      { phase: 'Phase 2: Aspen Simulation', duration: '3 Weeks', deliverable: 'Pinch analysis verification and tube-side velocity optimization.' },
      { phase: 'Phase 3: Turnaround Retrofit', duration: '2 Weeks', deliverable: 'Installation of high-shear inserts and updated DCS alarm limits.' },
    ],
    dateCreated: '2026-09-24',
  });

  const [planResult, setPlanResult] = useState<CompanyPrepPlan | null>(null);

  const handleGenerateAudit = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/reverse-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: selectedCompany?.name || 'Reliance Industries Limited',
          productOrProcess: targetProcess,
        }),
      });
      const data = await res.json();
      setAuditResult({
        ...data,
        id: `audit-${Date.now()}`,
        dateCreated: new Date().toISOString().split('T')[0],
      });
      triggerConfetti();
    } catch (err) {
      console.error('Audit generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePlan = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/plan-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: selectedCompany?.name || 'Reliance Industries Limited',
          role: targetRole,
        }),
      });
      const data = await res.json();
      setPlanResult(data);
      triggerConfetti();
    } catch (err) {
      console.error('Plan generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
              <span>Reverse Engineering & Executive Planning</span>
              <span>•</span>
              <span>Show Immediate Placement Value</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>Reverse Audit & 100-Day Plan</span>
              <span>📐</span>
            </h1>
            <p className="text-xs lg:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              <strong>Webpage Objective:</strong> Reverse-engineer real industrial operations, unit workflows, and engineering bottlenecks for your target recruiter. Generate comprehensive process audit memos (with root cause analysis and trade-offs) and tailored 30-60-90-day onboarding roadmaps to prove you can deliver day-one value to hiring managers.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTabMode('audit')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTabMode === 'audit'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Reverse Process Audit
            </button>
            <button
              onClick={() => {
                setActiveTabMode('plan');
                if (!planResult) handleGeneratePlan();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTabMode === 'plan'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              100-Day Plan Generator
            </button>
          </div>
        </div>
      </div>

      {/* MODE 1: REVERSE PROCESS AUDIT */}
      {activeTabMode === 'audit' && (
        <div className="space-y-6">
          {/* Target Process Configuration */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 space-y-1">
              <label className="block text-xs font-bold text-slate-300">
                Target Company & Process to Audit
              </label>
              <input
                type="text"
                value={targetProcess}
                onChange={(e) => setTargetProcess(e.target.value)}
                placeholder="e.g. Jamnagar Distillation Preheat Train or Tata Motors EV Battery Thermal Loop"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              onClick={handleGenerateAudit}
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md transition disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isLoading ? 'Auditing...' : 'Run Reverse Audit'}</span>
            </button>
          </div>

          {/* Audit Results Sheet */}
          {auditResult && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                    Industrial Reverse Engineering Memo
                  </div>
                  <h2 className="text-xl font-extrabold text-white mt-0.5">
                    {auditResult.companyName} • {auditResult.productOrProcess}
                  </h2>
                </div>

                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 border border-slate-700 transition"
                >
                  <Printer className="w-4 h-4 text-sky-400" />
                  <span>Print / Export PDF</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="font-bold text-slate-400 uppercase tracking-wider">1. Current Workflow Architecture:</span>
                  <p className="text-slate-200 leading-relaxed">{auditResult.currentWorkflow}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="font-bold text-rose-400 uppercase tracking-wider">2. Identified Bottleneck & Energy Loss:</span>
                  <p className="text-slate-200 leading-relaxed">{auditResult.identifiedBottleneck}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1 text-xs">
                <span className="font-bold text-amber-300 uppercase tracking-wider">3. Root Cause Analysis (First Principles):</span>
                <p className="text-slate-200 leading-relaxed">{auditResult.rootCauseAnalysis}</p>
              </div>

              <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 space-y-1 text-xs">
                <span className="font-bold text-indigo-300 uppercase tracking-wider">4. Proposed Engineering Solution:</span>
                <p className="text-slate-100 font-medium leading-relaxed">{auditResult.proposedSolution}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                  <span className="font-bold text-emerald-300 uppercase tracking-wider">5. Estimated Quantifiable Impact:</span>
                  <p className="text-emerald-100 font-semibold leading-relaxed">{auditResult.estimatedEngineeringImpact}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="font-bold text-slate-400 uppercase tracking-wider">6. Trade-offs & Operational Risks:</span>
                  <p className="text-slate-300 leading-relaxed">{auditResult.tradeOffsAndRisks}</p>
                </div>
              </div>

              {/* Implementation Phases */}
              <div className="space-y-2 text-xs">
                <span className="font-bold text-slate-300 uppercase tracking-wider block">
                  7. Three-Phase Execution Roadmap:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {auditResult.implementationPhases.map((phase, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="flex justify-between font-bold text-indigo-300">
                        <span>{phase.phase}</span>
                        <span className="font-mono text-slate-400 text-[10px]">{phase.duration}</span>
                      </div>
                      <p className="text-slate-400 text-[11px] leading-snug">{phase.deliverable}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 2: 100-DAY ONBOARDING PLAN */}
      {activeTabMode === 'plan' && planResult && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Placement Candidate Contribution Roadmap
              </div>
              <h2 className="text-xl font-extrabold text-white mt-0.5">
                100-Day Executive Plan • {planResult.companyName}
              </h2>
              <p className="text-xs text-slate-400">Target Role: {planResult.targetRole}</p>
            </div>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 border border-slate-700 transition"
            >
              <Printer className="w-4 h-4 text-sky-400" />
              <span>Print Plan</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-sky-400">Days 1–30</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/10 text-sky-400">
                  Learning & Systems
                </span>
              </div>
              <p className="text-slate-300 font-semibold">{planResult.first30Days.theme}</p>
              <ul className="space-y-1 text-slate-400 pl-4 list-disc">
                {planResult.first30Days.items.map((it, idx) => (
                  <li key={idx}>{it}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-indigo-400">Days 31–60</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400">
                  Contribution & Audit
                </span>
              </div>
              <p className="text-slate-300 font-semibold">{planResult.days31To60.theme}</p>
              <ul className="space-y-1 text-slate-400 pl-4 list-disc">
                {planResult.days31To60.items.map((it, idx) => (
                  <li key={idx}>{it}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-purple-400">Days 61–90</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400">
                  Ownership & KPIs
                </span>
              </div>
              <p className="text-slate-300 font-semibold">{planResult.days61To90.theme}</p>
              <ul className="space-y-1 text-slate-400 pl-4 list-disc">
                {planResult.days61To90.items.map((it, idx) => (
                  <li key={idx}>{it}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-emerald-400">Days 91–100</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                  Long-Term Scale
                </span>
              </div>
              <p className="text-slate-300 font-semibold">{planResult.days91To100.theme}</p>
              <ul className="space-y-1 text-slate-400 pl-4 list-disc">
                {planResult.days91To100.items.map((it, idx) => (
                  <li key={idx}>{it}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

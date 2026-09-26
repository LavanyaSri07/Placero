import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  SearchCode,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

export const RcaLabView: React.FC = () => {
  const { triggerConfetti } = useApp();

  const scenarios = [
    {
      title: 'Centrifugal Pump Severe Vibration & Seal Failure',
      scenario: 'A crude booster pump at a petrochemical plant experienced high radial vibration (9.2 mm/s RMS) and subsequent mechanical seal leakage after 3 weeks of operation.',
      prefilledWhys: [
        'Why 1: High radial vibration caused the mechanical seal face to deflect and overheat.',
        'Why 2: The pump was running at off-design hydraulic flow (42% of best efficiency point BEP).',
        'Why 3: The process discharge control valve was throttled heavily to compensate for downstream pipeline pressure.',
        'Why 4: No minimum flow bypass line or automatic recirculation valve (ARV) was active.',
        'Why 5: The original piping specification omitted a continuous recirculation loop for startup throttling.',
      ],
    },
    {
      title: 'Batch Chemical Reactor Exothermic Temperature Runaway',
      scenario: 'During an exothermic polymerization batch, reactor temperature surged past 95°C, causing pressure safety valves to vent to the flare header.',
      prefilledWhys: [
        'Why 1: Reactor cooling jacket heat duty was insufficient to absorb the heat of reaction.',
        'Why 2: Cooling water flow rate abruptly dropped by 80%.',
        'Why 3: The cooling water circulating pump tripped on thermal overload.',
        'Why 4: The standby pump failed to start automatically upon pressure drop.',
        'Why 5: The automated pressure switch interlock was mechanically stuck and had not been proof-tested in 6 months.',
      ],
    },
  ];

  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [fiveWhys, setFiveWhys] = useState<string[]>(scenarios[0].prefilledWhys);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectScenario = (idx: number) => {
    setSelectedScenarioIndex(idx);
    setFiveWhys(scenarios[idx].prefilledWhys);
    setEvaluation(null);
  };

  const handleEvaluate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/rca-evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario: scenarios[selectedScenarioIndex].scenario,
          fiveWhys,
        }),
      });
      const data = await res.json();
      setEvaluation(data);
      triggerConfetti();
    } catch (err) {
      console.error('RCA evaluation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-teal-400 uppercase tracking-wider mb-1">
              <span>Failure Diagnosis & Reliability</span>
              <span>•</span>
              <span>Root Cause Analysis Lab</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>RCA & 5-Whys Simulator</span>
              <span>🔍</span>
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Industrial interview panels love testing if you jump to conclusions or systematically trace failure chains. Practice 5 Whys and Fishbone logic on realistic engineering scenarios.
            </p>
          </div>

          <div className="flex gap-2">
            {scenarios.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectScenario(idx)}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold transition border ${
                  selectedScenarioIndex === idx
                    ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                Case #{idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scenario & 5 Whys Inputs (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-5">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
              Active Industrial Incident Scenario:
            </span>
            <h2 className="font-bold text-sm text-white">{scenarios[selectedScenarioIndex].title}</h2>
            <p className="text-xs text-slate-300 leading-relaxed pt-1">
              "{scenarios[selectedScenarioIndex].scenario}"
            </p>
          </div>

          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Trace the 5 Whys Causal Chain:
            </div>

            {fiveWhys.map((why, idx) => (
              <div key={idx} className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400">
                  Level {idx + 1} {idx === 4 ? '(Systemic Root Cause)' : ''}:
                </label>
                <input
                  type="text"
                  value={why}
                  onChange={(e) => {
                    const copy = [...fiveWhys];
                    copy[idx] = e.target.value;
                    setFiveWhys(copy);
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleEvaluate}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isLoading ? 'Evaluating Causal Rigor...' : 'Verify RCA Logic with AI'}</span>
            </button>
          </div>
        </div>

        {/* AI Evaluation (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {evaluation ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-bold text-sm text-white">RCA Diagnostic Score</span>
                <span className="text-xl font-black text-teal-400 font-mono">
                  {evaluation.soundnessScore}/100
                </span>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed italic p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                "{evaluation.feedback}"
              </div>

              {/* Missing Failure Modes */}
              {evaluation.missingFailureModes && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1.5 text-xs">
                  <span className="font-bold text-amber-300 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Latent Failure Mechanisms to Consider:</span>
                  </span>
                  <ul className="text-slate-300 space-y-1 pl-4 list-disc">
                    {evaluation.missingFailureModes.map((m: string, i: number) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Corrective Action */}
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1 text-xs">
                <span className="font-bold text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Corrective & Preventive Action (CAPA):</span>
                </span>
                <p className="text-emerald-100">{evaluation.recommendedCorrectiveAction}</p>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg text-center space-y-3 flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                <SearchCode className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-sm">RCA Engine Standing By</h3>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                Review the 5-Whys progression on the left and click "Verify RCA Logic with AI" to test whether you stopped at superficial human error or reached systemic root cause.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

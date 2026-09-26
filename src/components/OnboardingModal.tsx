import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { EngineeringBranch } from '../types/index.ts';
import {
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Sparkles,
  Award,
  Building2,
  Compass,
} from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { isOnboardingOpen, setIsOnboardingOpen, user, updateProfile, triggerConfetti } = useApp();

  const [step, setStep] = useState(1);
  const totalSteps = 6;

  // Form states initialized with existing user or clean defaults
  const [name, setName] = useState(user?.name || '');
  const [college, setCollege] = useState(user?.college || 'National Institute of Technology');
  const [degree, setDegree] = useState(user?.degree || 'B.Tech');
  const [branch, setBranch] = useState<EngineeringBranch>(user?.branch || 'Chemical Engineering');
  const [year, setYear] = useState(user?.year || 4);
  const [semester, setSemester] = useState(user?.semester || 7);
  const [cgpa, setCgpa] = useState(user?.cgpa || 8.42);
  const [preferredRole, setPreferredRole] = useState(
    user?.preferredRole || 'Graduate Engineer Trainee (Process / Operations)'
  );
  const [targetCompanies, setTargetCompanies] = useState<string[]>(
    user?.targetCompanies || ['Reliance Industries Limited', 'Larsen & Toubro (L&T)']
  );
  const [commConfidence, setCommConfidence] = useState(user?.communicationConfidence || 6);
  const [interviewConfidence, setInterviewConfidence] = useState(user?.interviewConfidence || 6);
  const [dailyStudyTime, setDailyStudyTime] = useState(user?.dailyStudyTimeMinutes || 45);

  if (!isOnboardingOpen) return null;

  const handleFinish = async () => {
    await updateProfile({
      name,
      college,
      degree,
      branch,
      year,
      semester,
      cgpa,
      preferredRole,
      targetCompanies,
      communicationConfidence: commConfidence,
      interviewConfidence,
      dailyStudyTimeMinutes: dailyStudyTime,
    });
    triggerConfetti();
    setIsOnboardingOpen(false);
  };

  const branches: EngineeringBranch[] = [
    'Chemical Engineering',
    'Mechanical Engineering',
    'Electrical Engineering',
    'Electronics & Communication Engineering',
    'Computer Science Engineering',
    'Information Technology',
    'Civil Engineering',
    'Biotechnology',
    'Instrumentation Engineering',
    'Aerospace Engineering',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header & Step Tracker */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs">
              {step}/{totalSteps}
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white">Placement Diagnostic Onboarding</h2>
              <p className="text-[11px] text-slate-400">Step {step}: {
                step === 1 ? 'Academic Foundations' :
                step === 2 ? 'Grades & Academic Standing' :
                step === 3 ? 'Target Companies & Roles' :
                step === 4 ? 'Confidence & Study Capacity' :
                step === 5 ? 'Personalized Placement Plan' :
                'Your Placement Map is Ready'
              }</p>
            </div>
          </div>

          <button
            onClick={() => setIsOnboardingOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-1">
          <div
            className="bg-gradient-to-r from-sky-400 to-indigo-500 h-1 transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        {/* Step Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">College / University</label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Engineering Discipline / Branch</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value as EngineeringBranch)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200"
                >
                  {branches.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Year of Study</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value, 10))}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200"
                  >
                    <option value={3}>3rd Year (Pre-final)</option>
                    <option value={4}>4th Year (Final Year)</option>
                    <option value={2}>2nd Year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Cumulative CGPA (out of 10)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={cgpa}
                    onChange={(e) => setCgpa(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-1">
                <span className="font-bold text-sky-400">Eligibility Calibration:</span>
                <p className="text-slate-400">
                  Most Tier-1 core engineering companies (e.g. Reliance, L&T, Siemens) set baseline screening criteria at ≥ 7.0 or 7.5 CGPA with no active backlogs.
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Preferred Placement Role</label>
                <input
                  type="text"
                  value={preferredRole}
                  onChange={(e) => setPreferredRole(e.target.value)}
                  placeholder="e.g. Graduate Engineer Trainee (Process / Mechanical)"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Primary Target Companies</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    'Reliance Industries Limited',
                    'Larsen & Toubro (L&T)',
                    'Tata Motors',
                    'Siemens',
                    'Texas Instruments',
                    'Dow Chemical Company',
                  ].map((comp) => {
                    const isChecked = targetCompanies.includes(comp);
                    return (
                      <button
                        type="button"
                        key={comp}
                        onClick={() => {
                          if (isChecked) {
                            setTargetCompanies(targetCompanies.filter((c) => c !== comp));
                          } else {
                            setTargetCompanies([...targetCompanies, comp]);
                          }
                        }}
                        className={`p-2.5 rounded-xl border text-left font-semibold transition flex items-center justify-between ${
                          isChecked
                            ? 'bg-sky-500/20 text-sky-200 border-sky-500/40'
                            : 'bg-slate-950 text-slate-400 border-slate-800'
                        }`}
                      >
                        <span className="truncate">{comp}</span>
                        {isChecked && <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                  <span>Communication Confidence</span>
                  <span className="font-mono text-sky-400">{commConfidence} / 10</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={commConfidence}
                  onChange={(e) => setCommConfidence(parseInt(e.target.value, 10))}
                  className="w-full accent-sky-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                  <span>Technical Viva & Interview Confidence</span>
                  <span className="font-mono text-sky-400">{interviewConfidence} / 10</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={interviewConfidence}
                  onChange={(e) => setInterviewConfidence(parseInt(e.target.value, 10))}
                  className="w-full accent-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Daily Available Study Time: <strong className="text-sky-300">{dailyStudyTime} min/day</strong>
                </label>
                <div className="flex gap-2">
                  {[30, 45, 60, 90].map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setDailyStudyTime(t)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                        dailyStudyTime === t
                          ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      {t} min
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4 animate-in fade-in text-center py-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center mx-auto text-white shadow-lg shadow-sky-500/25">
                <Compass className="w-8 h-8 animate-pulse" />
              </div>
              <h3 className="font-extrabold text-lg text-white">Synthesizing Your Placement Plan...</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Calibrating core {branch} skill benchmarks, target company roadmaps, and personal daily mission targets.
              </p>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-left space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Target Company Radar Configured: {targetCompanies[0] || 'Reliance Industries'}</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Daily Habit Loop Sized: {dailyStudyTime} minutes per day</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Proof-of-Execution Engine Armed</span>
                </div>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4 animate-in fade-in text-center py-2">
              <span className="text-4xl">🎉</span>
              <h3 className="font-extrabold text-xl text-white">Your Placement Profile is Ready!</h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                Welcome to Placero, {name}. Your personalized roadmap has been generated. Ready to build proof and prove your skills?
              </p>

              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 to-indigo-950/40 border border-sky-500/30 text-left space-y-2 text-xs">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-400">Target Role:</span>
                  <span className="text-white">{preferredRole}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-slate-400">Target Employer:</span>
                  <span className="text-sky-300">{targetCompanies[0]}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-slate-400">Initial Readiness Score:</span>
                  <span className="text-emerald-400 font-mono">68% (Building Foundation)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-5 border-t border-slate-800 bg-slate-950/80 flex justify-between items-center">
          {step > 1 && step < 6 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < totalSteps ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>{step === 5 ? 'Generate My Plan' : 'Next Step'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 via-indigo-500 to-emerald-400 hover:opacity-95 text-slate-950 font-black text-xs shadow-lg transition cursor-pointer"
            >
              Launch My Placement OS
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

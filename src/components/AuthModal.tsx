import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  X,
  KeyRound,
  User,
  Mail,
  GraduationCap,
  Building2,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { EngineeringBranch } from '../types/index.ts';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, user, login, register, updateProfile, resetDemoUser, triggerConfetti } = useApp();
  const [tab, setTab] = useState<'login' | 'register' | 'custom-name'>('login');

  // Login form state
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register form state
  const [regLoginId, setRegLoginId] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regBranch, setRegBranch] = useState<EngineeringBranch>('Chemical Engineering');
  const [regCollege, setRegCollege] = useState('');
  const [regDegree, setRegDegree] = useState('B.Tech');
  const [regTargetCompany, setRegTargetCompany] = useState('Reliance Industries Limited');

  // Quick Name state
  const [customName, setCustomName] = useState(user?.name || '');
  const [customLoginId, setCustomLoginId] = useState(user?.loginId || '');
  const [customRole, setCustomRole] = useState(user?.preferredRole || 'Graduate Engineer Trainee');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!loginId.trim()) {
      setErrorMsg('Please enter your Login ID or registered Email.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login({ loginIdOrEmail: loginId, password });
      if (!res.success) {
        setErrorMsg(res.message || 'Invalid Login ID or Password');
      } else {
        setSuccessMsg('Successfully authenticated with database!');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!regLoginId.trim() || !regName.trim() || !regPassword.trim()) {
      setErrorMsg('Please complete all required fields (Login ID, Name, Password).');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMsg('Password should be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await register({
        loginId: regLoginId.trim(),
        password: regPassword,
        name: regName.trim(),
        email: regEmail.trim() || `${regLoginId.trim()}@placero.edu`,
        branch: regBranch,
        college: regCollege.trim() || 'National Institute of Technology',
        degree: regDegree,
        targetCompany: regTargetCompany,
      });

      if (!res.success) {
        setErrorMsg(res.message || 'Registration failed');
      } else {
        setSuccessMsg('Account created successfully in database!');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!customName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateProfile({
        name: customName.trim(),
        loginId: customLoginId.trim() || customName.trim().toLowerCase().replace(/\s+/g, '_'),
        preferredRole: customRole.trim(),
      });
      setSuccessMsg(`Welcome, ${customName.trim()}! Your candidate name and profile have been updated and saved to SQLite.`);
      triggerConfetti();
      setTimeout(() => setIsAuthModalOpen(false), 900);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update candidate profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillQuickDemo = (role: 'student' | 'admin') => {
    if (role === 'student') {
      setLoginId('alex_student');
      setPassword('password123');
    } else {
      setLoginId('admin');
      setPassword('adminpassword');
    }
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">
                {tab === 'login' ? 'Sign In to Placement OS' : 'Create Placement Account'}
              </h2>
              <p className="text-xs text-slate-400">
                Persistent database authentication & personal roadmap storage
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 p-1.5 gap-1.5">
          <button
            onClick={() => {
              setTab('login');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              tab === 'login'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Login ID & Password
          </button>
          <button
            onClick={() => {
              setTab('register');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              tab === 'register'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Register Student
          </button>
          <button
            onClick={() => {
              setTab('custom-name');
              setCustomName(user?.name || '');
              setCustomLoginId(user?.loginId || '');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              tab === 'custom-name'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Set Your Name
          </button>
        </div>

        {/* Messages */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-start gap-2 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-2 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Login ID or Email</span>
                  <span className="text-[11px] text-slate-400 font-normal">e.g. alex_student or email</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    placeholder="Enter your Login ID"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Password</span>
                  <span className="text-[11px] text-slate-400 font-normal">Encrypted with bcrypt in SQLite</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-950/70 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-sky-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In with Database</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Quick Preset Logins */}
              <div className="pt-3 border-t border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  1-Click Instant Demo Credentials
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => fillQuickDemo('student')}
                    className="text-left p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition group cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400 mb-0.5">
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>Alex Student</span>
                    </div>
                    <div className="text-[10px] text-slate-400">ID: alex_student</div>
                    <div className="text-[10px] text-slate-400">Pass: password123</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillQuickDemo('admin')}
                    className="text-left p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition group cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-0.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Placement Admin</span>
                    </div>
                    <div className="text-[10px] text-slate-400">ID: admin</div>
                    <div className="text-[10px] text-slate-400">Pass: adminpassword</div>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Login ID <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={regLoginId}
                    onChange={(e) => setRegLoginId(e.target.value)}
                    placeholder="e.g. rahul_sharma"
                    required
                    className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    required
                    className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="rahul@college.edu"
                    className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Password <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    required
                    className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Engineering Branch</label>
                  <select
                    value={regBranch}
                    onChange={(e) => setRegBranch(e.target.value as EngineeringBranch)}
                    className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                  >
                    <option value="Chemical Engineering">Chemical Engineering</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Electronics & Communication">Electronics & Communication</option>
                    <option value="Computer Science & IT">Computer Science & IT</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Target Recruiter</label>
                  <select
                    value={regTargetCompany}
                    onChange={(e) => setRegTargetCompany(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                  >
                    <option value="Reliance Industries Limited">Reliance Industries Limited</option>
                    <option value="Tata Motors">Tata Motors</option>
                    <option value="Larsen & Toubro (L&T)">Larsen & Toubro (L&T)</option>
                    <option value="Siemens">Siemens</option>
                    <option value="Texas Instruments">Texas Instruments</option>
                    <option value="Dow Chemicals">Dow Chemicals</option>
                    <option value="Google">Google</option>
                    <option value="Qualcomm">Qualcomm</option>
                    <option value="Schlumberger (SLB)">Schlumberger (SLB)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">College / Institute</label>
                <input
                  type="text"
                  value={regCollege}
                  onChange={(e) => setRegCollege(e.target.value)}
                  placeholder="e.g. National Institute of Technology, Trichy"
                  className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Database Account & Roadmap</span>
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Active user: {user?.name || 'Guest'} ({user?.loginId || 'alex_student'})</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            SQLite Persistent DB Active
          </span>
        </div>
      </div>
    </div>
  );
};

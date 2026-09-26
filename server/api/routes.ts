import { Router, Request, Response } from 'express';
import {
  SEED_COMPANIES,
  SEED_SKILLS,
  SEED_INTERVIEW_QUESTIONS,
  SEED_DAILY_FEED,
  SEED_ALUMNI,
  DEMO_USER_PROFILE,
} from '../data/seedData.ts';
import {
  askCareerCoach,
  improveResumeBullet,
  evaluateInterviewAnswer,
  evaluateProjectEvidence,
  generate306090Plan,
  generateReverseAudit,
  evaluateRcaReasoning,
} from '../services/gemini.ts';
import {
  UserProfile,
  ProjectEvidence,
  MistakeRecord,
  DailyMission,
  OverallReadiness,
  Company,
  InterviewQuestion,
} from '../../src/types/index.ts';

export const apiRouter = Router();

// In-memory persistent state (seeded with high quality defaults)
let currentCompanies: Company[] = [...SEED_COMPANIES];
let currentQuestions: InterviewQuestion[] = [...SEED_INTERVIEW_QUESTIONS];
let currentUserProfile: UserProfile = { ...DEMO_USER_PROFILE };

let userProjects: ProjectEvidence[] = [
  {
    id: 'proj-01',
    title: 'Crude Preheat Train Pinch Analysis & Exchanger Optimization',
    skill: 'Heat Transfer & Exchangers',
    branch: 'Chemical Engineering',
    problemStatement: 'High steam consumption in the atmospheric crude distillation preheat train due to sub-optimal heat exchanger network matching and heavy fouling.',
    engineeringApproach: 'Applied Pinch Technology (Linnhoff March framework) with a minimum approach temperature (ΔT_min) of 15°C. Modeled stream enthalpy curves and re-routed hot residue streams.',
    toolsUsed: ['Aspen Energy Analyzer', 'Python (NumPy / Matplotlib)', 'AutoCAD P&ID'],
    technicalExplanation: 'Constructed Composite Curves and Grand Composite Curve (GCC). Identified cross-pinch heat transfer in E-103 and retrofitted two 1-2 shell-and-tube exchangers in counter-current configuration to eliminate pinch violation.',
    quantifiableImpact: 'Calculated 14.2% reduction in furnace thermal duty (saving ~420 kg/hr fuel gas), reducing annual CO2 emissions by 1,180 metric tons.',
    lessonsLearned: 'Pinch rules are strict—transferring heat across the pinch always doubles the penalty. Practical piping layout distance must be budgeted alongside thermodynamic optimality.',
    githubUrl: 'https://github.com/placero-demo/crude-pinch-optimization',
    liveDemoUrl: 'https://placero-demo.dev/crude-pinch-demo',
    cadOrSimulationNotes: 'Aspen Plus V12 simulation files with heat curve exports.',
    bomItems: [
      { id: 'b1', component: 'Shell-and-Tube Exchanger (TEMA AES)', quantity: 2, unitCost: 450000, supplier: 'L&T Heavy Engineering', reasonSelected: 'High pressure rating and carbon steel corrosion resistance' },
      { id: 'b2', component: 'High-Temperature Butterfly Control Valves', quantity: 4, unitCost: 65000, supplier: 'Emerson / Fisher', reasonSelected: 'Precision throttling for residue flow split' },
    ],
    evidenceScore: {
      technicalDepth: 88,
      practicality: 84,
      documentation: 90,
      quantifiableResults: 86,
      reproducibility: 85,
      overall: 87,
      aiCritique: 'Exemplary engineering case study with clear composite curves, explicit ΔT_min justification, and verified greenhouse gas / fuel savings.',
      suggestedEnhancement: 'Include tube-side pressure drop calculations to demonstrate the existing booster pump does not cavitate.',
    },
    createdAt: '2026-09-18',
    isPublic: true,
  },
  {
    id: 'proj-02',
    title: 'Automated Continuous Stirred Tank Reactor (CSTR) Temperature Interlock',
    skill: 'Process Safety & HAZOP',
    branch: 'Chemical Engineering',
    problemStatement: 'Exothermic jacketed batch reactor vulnerability to thermal runaway when coolant circulation pump fails.',
    engineeringApproach: 'Designed a dual-redundant Safety Instrumented System (SIS) meeting SIL-2 criteria with emergency coolant dump tank and automated reactant feed cutoff valve.',
    toolsUsed: ['MATLAB Simulink', 'HAZOP Worksheet', 'Arduino Prototyping Board'],
    technicalExplanation: 'Formulated non-linear energy balance coupled with Arrhenius kinetics for sodium thiosulfate reaction. Implemented PID cascade control with rate-of-rise temperature trip logic.',
    quantifiableImpact: 'Simulated 100% containment of thermal runaway in 45 tested pump-failure scenarios; response time reduced to 1.8 seconds.',
    lessonsLearned: 'Safety instrumented functions must have independent sensor taps; sharing process measurement transmitters with safety interlocks violates IEC 61511.',
    githubUrl: 'https://github.com/placero-demo/cstr-safety-interlock',
    createdAt: '2026-09-22',
    isPublic: true,
  },
];

let userMistakes: MistakeRecord[] = [
  {
    id: 'mistake-01',
    questionOrProblem: 'Centrifugal pump cavitation troubleshooting in refinery crude unit.',
    studentAnswer: 'I said we should immediately throttle the suction valve to slow down liquid entering the impeller.',
    whatWentWrong: 'Throttling the suction valve creates a massive localized pressure drop across the valve, severely reducing NPSH available and dramatically worsening cavitation!',
    correctConcept: 'Always throttle the DISCHARGE valve to reduce flow rate (which moves pump operation to a lower NPSH_required point on the pump curve), never throttle the suction valve.',
    improvedAnswer: 'I would verify suction pressure and fluid temperature against vapor pressure to check NPSH margin, inspect the suction strainer for clogging, and if flow must be modulated, throttle the discharge valve only.',
    category: 'Core Concept',
    branch: 'Chemical Engineering',
    repeatStatus: 'Mastered Now',
    dateLogged: '2026-09-23',
  },
  {
    id: 'mistake-02',
    questionOrProblem: 'Total reflux distillation operation in chemical plant.',
    studentAnswer: 'Said operating at total reflux is the best method to run a plant because separation is highest.',
    whatWentWrong: 'Forgot that at total reflux, distillate take-off is ZERO. You make zero product!',
    correctConcept: 'Total reflux is a theoretical limit used to find minimum stages (Fenske equation). Commercial columns operate at 1.1x to 1.3x minimum reflux to balance operating steam costs with capital column height.',
    improvedAnswer: 'Total reflux yields zero production rate. In commercial plants we operate at an optimal reflux ratio typically 10-30% above minimum reflux to minimize total lifecycle cost.',
    category: 'Assumptions',
    branch: 'Chemical Engineering',
    repeatStatus: 'Repeated Once',
    dateLogged: '2026-09-24',
  },
];

let todayMission: DailyMission = {
  id: 'mission-today',
  date: new Date().toISOString().split('T')[0],
  totalMinutes: 42,
  allCompleted: false,
  tasks: [
    {
      id: 'task-1',
      title: 'Solve 5 Material Balance & Pump Sizing questions',
      durationMinutes: 15,
      category: 'practice',
      completed: true,
      xpReward: 100,
    },
    {
      id: 'task-2',
      title: 'Review Reliance Industries interview case study: Centrifugal Cavitation',
      durationMinutes: 8,
      category: 'case_study',
      completed: true,
      xpReward: 60,
    },
    {
      id: 'task-3',
      title: 'Record 1 STAR-L interview answer on Fluid Mechanics',
      durationMinutes: 5,
      category: 'voice_record',
      completed: false,
      xpReward: 120,
    },
    {
      id: 'task-4',
      title: 'Improve 1 resume bullet in Resume Bullet Lab',
      durationMinutes: 5,
      category: 'resume',
      completed: false,
      xpReward: 50,
    },
    {
      id: 'task-5',
      title: 'Review yesterday’s mistake: Throttling Suction vs Discharge',
      durationMinutes: 4,
      category: 'mistake_review',
      completed: false,
      xpReward: 40,
    },
  ],
};

// Calculate transparent multi-dimensional readiness score
function computeReadinessScore(): OverallReadiness {
  const assessmentScore = 78;
  const missionScore = Math.round((todayMission.tasks.filter(t => t.completed).length / todayMission.tasks.length) * 100);
  const proofScore = Math.min(100, userProjects.length * 40);
  const interviewScore = 72;
  const resumeScore = 80;
  const coreEngineeringScore = 82;

  const dimensions = [
    {
      dimension: 'Core Engineering Fundamentals',
      score: coreEngineeringScore,
      benchmark: 80,
      weight: 0.25,
      recentChange: +4,
      explanation: 'Based on 82% accuracy in Material/Energy balances and Thermodynamics assessments.',
    },
    {
      dimension: 'Proof of Execution & Projects',
      score: proofScore,
      benchmark: 75,
      weight: 0.25,
      recentChange: +12,
      explanation: `Calculated from ${userProjects.length} verified projects with simulation files, calculations, and quantifiable metrics.`,
    },
    {
      dimension: 'Interview & STAR-L Communication',
      score: interviewScore,
      benchmark: 70,
      weight: 0.20,
      recentChange: +3,
      explanation: 'Average score across mock interview attempts. Filler word rate improved to 4 per minute.',
    },
    {
      dimension: 'Company-Specific Readiness (Reliance)',
      score: 74,
      benchmark: 80,
      weight: 0.15,
      recentChange: +5,
      explanation: 'Preparation aligned with Jamnagar refinery technical areas (unit operations, pumps, safety).',
    },
    {
      dimension: 'Consistency & Daily Missions',
      score: Math.min(100, currentUserProfile.streakDays * 12 + (missionScore > 50 ? 15 : 0)),
      benchmark: 85,
      weight: 0.15,
      recentChange: +7,
      explanation: `Current streak of ${currentUserProfile.streakDays} days with active mission completions.`,
    },
  ];

  const totalScore = Math.round(
    dimensions.reduce((acc, dim) => acc + dim.score * dim.weight, 0)
  );

  return {
    totalScore,
    dimensions,
    weakestSkill: 'Industrial Process Safety & HAZOP',
    strongestSkill: 'Thermodynamics & Heat Exchanger Pinch Analysis',
    statusLabel: totalScore > 80 ? 'Interview Ready' : totalScore > 65 ? 'Building Foundation' : 'Needs Focus',
  };
}

// ==================== AUTH & PROFILE ROUTES ====================

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email } = req.body;
  if (email && email.toLowerCase().includes('demo')) {
    currentUserProfile = { ...DEMO_USER_PROFILE };
  }
  res.json({
    user: currentUserProfile,
    token: 'placero-auth-token-valid',
  });
});

apiRouter.post('/auth/register', (req: Request, res: Response) => {
  const { name, email, branch, college, degree } = req.body;
  currentUserProfile = {
    ...DEMO_USER_PROFILE,
    id: `user-${Date.now()}`,
    name: name || 'Student Candidate',
    email: email || 'student@placero.edu',
    branch: branch || 'Chemical Engineering',
    college: college || 'Engineering College',
    degree: degree || 'B.Tech',
    streakDays: 1,
    xp: 200,
    level: 1,
    isDemoUser: false,
  };
  res.json({ user: currentUserProfile, token: 'placero-auth-token-valid' });
});

apiRouter.get('/auth/me', (req: Request, res: Response) => {
  res.json({ user: currentUserProfile });
});

apiRouter.get('/user/profile', (req: Request, res: Response) => {
  res.json(currentUserProfile);
});

apiRouter.post('/user/profile', (req: Request, res: Response) => {
  currentUserProfile = { ...currentUserProfile, ...req.body };
  res.json(currentUserProfile);
});

apiRouter.post('/user/reset-demo', (req: Request, res: Response) => {
  currentUserProfile = { ...DEMO_USER_PROFILE };
  res.json({ success: true, user: currentUserProfile });
});

// ==================== READINESS & DASHBOARD ====================

apiRouter.get('/readiness', (req: Request, res: Response) => {
  const readiness = computeReadinessScore();
  res.json(readiness);
});

apiRouter.get('/daily-feed', (req: Request, res: Response) => {
  res.json(SEED_DAILY_FEED);
});

apiRouter.get('/alumni', (req: Request, res: Response) => {
  const branch = req.query.branch as string;
  if (branch) {
    return res.json(SEED_ALUMNI.filter(a => a.branch.toLowerCase() === branch.toLowerCase()));
  }
  res.json(SEED_ALUMNI);
});

// ==================== MISSIONS ====================

apiRouter.get('/missions/today', (req: Request, res: Response) => {
  res.json(todayMission);
});

apiRouter.post('/missions/toggle-task', (req: Request, res: Response) => {
  const { taskId } = req.body;
  const task = todayMission.tasks.find(t => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
    if (task.completed) {
      currentUserProfile.xp += task.xpReward;
      if (currentUserProfile.xp >= currentUserProfile.level * 500) {
        currentUserProfile.level += 1;
      }
    }
  }
  todayMission.allCompleted = todayMission.tasks.every(t => t.completed);
  res.json({ mission: todayMission, user: currentUserProfile });
});

// ==================== COMPANIES & SKILLS ====================

apiRouter.get('/companies', (req: Request, res: Response) => {
  const branch = req.query.branch as string;
  const category = req.query.category as string;
  let results = currentCompanies;

  if (branch) {
    results = results.filter(c =>
      c.relevantBranches.some(b => b.toLowerCase().includes(branch.toLowerCase()))
    );
  }
  if (category) {
    results = results.filter(c => c.category.toLowerCase() === category.toLowerCase());
  }

  res.json(results);
});

apiRouter.get('/companies/:id', (req: Request, res: Response) => {
  const company = currentCompanies.find(c => c.id === req.params.id);
  if (!company) {
    return res.status(404).json({ error: 'Company not found' });
  }
  res.json(company);
});

apiRouter.get('/skills', (req: Request, res: Response) => {
  const branch = req.query.branch as string;
  if (branch) {
    return res.json(SEED_SKILLS.filter(s => s.branch.toLowerCase().includes(branch.toLowerCase())));
  }
  res.json(SEED_SKILLS);
});

// ==================== INTERVIEW QUESTIONS ====================

apiRouter.get('/questions', (req: Request, res: Response) => {
  const { companyId, branch, difficulty, category } = req.query;
  let results = currentQuestions;

  if (companyId) {
    results = results.filter(q => q.companyId === companyId);
  }
  if (branch) {
    results = results.filter(q => !q.branch || q.branch.toLowerCase().includes((branch as string).toLowerCase()));
  }
  if (difficulty) {
    results = results.filter(q => q.difficulty.toLowerCase() === (difficulty as string).toLowerCase());
  }
  if (category) {
    results = results.filter(q => q.category.toLowerCase() === (category as string).toLowerCase());
  }

  res.json(results);
});

// ==================== PROOF OF EXECUTION ====================

apiRouter.get('/proofs', (req: Request, res: Response) => {
  res.json(userProjects);
});

apiRouter.post('/proofs', async (req: Request, res: Response) => {
  const newProject: ProjectEvidence = {
    id: `proj-${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString().split('T')[0],
    isPublic: true,
  };

  // Run AI evidence score evaluation automatically
  try {
    const score = await evaluateProjectEvidence({
      title: newProject.title,
      skill: newProject.skill,
      branch: newProject.branch,
      problemStatement: newProject.problemStatement,
      engineeringApproach: newProject.engineeringApproach,
      toolsUsed: newProject.toolsUsed || [],
      technicalExplanation: newProject.technicalExplanation,
      quantifiableImpact: newProject.quantifiableImpact,
      lessonsLearned: newProject.lessonsLearned,
      hasBom: (newProject.bomItems && newProject.bomItems.length > 0) || false,
      hasGithubOrCad: Boolean(newProject.githubUrl || newProject.cadOrSimulationNotes),
    });
    newProject.evidenceScore = score;
  } catch (err) {
    console.error('Evidence scoring fallback:', err);
  }

  userProjects.unshift(newProject);
  currentUserProfile.xp += 150;
  res.json(newProject);
});

apiRouter.delete('/proofs/:id', (req: Request, res: Response) => {
  userProjects = userProjects.filter(p => p.id !== req.params.id);
  res.json({ success: true });
});

// ==================== MISTAKE VAULT ====================

apiRouter.get('/mistakes', (req: Request, res: Response) => {
  res.json(userMistakes);
});

apiRouter.post('/mistakes', (req: Request, res: Response) => {
  const newMistake: MistakeRecord = {
    id: `mistake-${Date.now()}`,
    ...req.body,
    dateLogged: new Date().toISOString().split('T')[0],
  };
  userMistakes.unshift(newMistake);
  res.json(newMistake);
});

apiRouter.delete('/mistakes/:id', (req: Request, res: Response) => {
  userMistakes = userMistakes.filter(m => m.id !== req.params.id);
  res.json({ success: true });
});

// ==================== AI CONTROLLERS (SERVER-SIDE GEMINI) ====================

apiRouter.post('/ai/coach', async (req: Request, res: Response) => {
  try {
    const { question } = req.body;
    const readiness = computeReadinessScore();
    const result = await askCareerCoach(question, {
      name: currentUserProfile.name,
      branch: currentUserProfile.branch,
      cgpa: currentUserProfile.cgpa,
      targetCompanies: currentUserProfile.targetCompanies,
      weakestSkill: readiness.weakestSkill,
      strongestSkill: readiness.strongestSkill,
      recentMistakesCount: userMistakes.length,
      proofCount: userProjects.length,
    });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'AI coach unavailable' });
  }
});

apiRouter.post('/ai/resume-bullet', async (req: Request, res: Response) => {
  try {
    const { rawBullet, targetCompany } = req.body;
    if (!rawBullet) {
      return res.status(400).json({ error: 'rawBullet is required' });
    }
    const result = await improveResumeBullet(rawBullet, currentUserProfile.branch, targetCompany);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Resume AI evaluation failed' });
  }
});

apiRouter.post('/ai/interview-feedback', async (req: Request, res: Response) => {
  try {
    const { question, transcript, category, targetCompany, durationSeconds } = req.body;
    if (!transcript) {
      return res.status(400).json({ error: 'transcript is required' });
    }

    // Filler word analysis server-side
    const fillerTokens = ['um', 'uh', 'like', 'actually', 'basically', 'you know', 'sort of', 'kind of'];
    const lower = transcript.toLowerCase();
    const fillerWordsFound = fillerTokens
      .map(w => {
        const regex = new RegExp(`\\b${w}\\b`, 'gi');
        const matches = lower.match(regex);
        return { word: w, count: matches ? matches.length : 0 };
      })
      .filter(item => item.count > 0);

    const totalFillers = fillerWordsFound.reduce((acc, curr) => acc + curr.count, 0);

    // Calculate words per minute
    const wordCount = transcript.trim().split(/\s+/).length;
    const safeDuration = durationSeconds && durationSeconds > 0 ? durationSeconds : 60;
    const speakingPaceWpm = Math.round((wordCount / safeDuration) * 60);

    const feedback = await evaluateInterviewAnswer(
      question || 'Technical Problem Solving',
      transcript,
      category || 'Core Engineering',
      currentUserProfile.branch,
      targetCompany
    );

    res.json({
      durationSeconds: safeDuration,
      speakingPaceWpm,
      fillerWordCount: totalFillers,
      fillerWordsFound,
      ...feedback,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Interview evaluation failed' });
  }
});

apiRouter.post('/ai/evidence-score', async (req: Request, res: Response) => {
  try {
    const projectData = req.body;
    const evaluation = await evaluateProjectEvidence({
      ...projectData,
      branch: currentUserProfile.branch,
    });
    res.json(evaluation);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Evidence scoring failed' });
  }
});

apiRouter.post('/ai/plan-generator', async (req: Request, res: Response) => {
  try {
    const { companyName, role } = req.body;
    const plan = await generate306090Plan(
      companyName || 'Reliance Industries Limited',
      role || 'Graduate Engineer Trainee',
      currentUserProfile.branch
    );
    res.json(plan);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Plan generation failed' });
  }
});

apiRouter.post('/ai/reverse-audit', async (req: Request, res: Response) => {
  try {
    const { companyName, productOrProcess } = req.body;
    const audit = await generateReverseAudit(
      companyName || 'Reliance Industries Limited',
      productOrProcess || 'Refinery Preheat Train & Pinch Exchangers',
      currentUserProfile.branch
    );
    res.json(audit);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Reverse audit generation failed' });
  }
});

apiRouter.post('/ai/rca-evaluate', async (req: Request, res: Response) => {
  try {
    const { scenario, fiveWhys } = req.body;
    const rcaEvaluation = await evaluateRcaReasoning(scenario, fiveWhys);
    res.json(rcaEvaluation);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'RCA evaluation failed' });
  }
});

// ==================== ADMIN ENDPOINTS ====================

apiRouter.post('/admin/company', (req: Request, res: Response) => {
  const newCompany: Company = {
    id: `company-${Date.now()}`,
    ...req.body,
    lastVerifiedDate: new Date().toISOString().split('T')[0],
  };
  currentCompanies.unshift(newCompany);
  res.json(newCompany);
});

apiRouter.patch('/admin/company/:id/verify', (req: Request, res: Response) => {
  const company = currentCompanies.find(c => c.id === req.params.id);
  if (company) {
    company.lastVerifiedDate = new Date().toISOString().split('T')[0];
    return res.json(company);
  }
  res.status(404).json({ error: 'Company not found' });
});

apiRouter.post('/admin/question', (req: Request, res: Response) => {
  const newQ: InterviewQuestion = {
    id: `q-${Date.now()}`,
    ...req.body,
  };
  currentQuestions.unshift(newQ);
  res.json(newQ);
});

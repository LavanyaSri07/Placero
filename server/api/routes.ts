import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
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
  RoadmapPlan,
  RoadmapMilestone,
} from '../../src/types/index.ts';
import {
  getDb,
  getUserById,
  getUserByLoginId,
  createUser,
  updateUser,
  getProofsByUserId,
  insertProof,
  deleteProofById,
  getMistakesByUserId,
  insertMistake,
  deleteMistakeById,
  getDailyMissionByUserId,
  toggleMissionTaskDb,
  getRoadmapByUserId,
  toggleMilestoneDb,
  updateRoadmapMilestonesDb,
  getAllCompanies,
  insertCompanyDb,
  verifyCompanyDb,
  persistDb,
  computeBadgesForUser,
  getMockInterviewsByUserId,
  insertMockInterview,
  getFlashcardsByUserId,
  updateFlashcardMastery,
  insertFlashcard,
  getStudyNotesByUserId,
  saveStudyNote,
  deleteStudyNote,
  getLeetCodeProblems,
  getLeetCodeProblemById,
  runLeetCodeTest,
  submitLeetCodeSolution,
  saveLeetCodeNote,
} from '../db/database.ts';

export const apiRouter = Router();

// Helper to determine the active user ID from request headers or default to demo user
function getActiveUserId(req: Request): string {
  const headerUserId = req.headers['x-user-id'] as string;
  if (headerUserId && headerUserId.trim().length > 0) {
    return headerUserId;
  }
  return DEMO_USER_PROFILE.id;
}

// Compute dynamic readiness score using user's real DB records
async function computeReadinessScoreForUser(userId: string): Promise<OverallReadiness> {
  const user = (await getUserById(userId)) || DEMO_USER_PROFILE;
  const mission = await getDailyMissionByUserId(userId);
  const proofs = await getProofsByUserId(userId);
  const mistakes = await getMistakesByUserId(userId);

  const completedTasks = mission.tasks.filter((t) => t.completed).length;
  const missionScore = mission.tasks.length > 0 ? Math.round((completedTasks / mission.tasks.length) * 100) : 50;
  const proofScore = Math.min(100, Math.max(30, proofs.length * 35));
  const coreEngineeringScore = Math.min(95, 70 + (user.cgpa ? Math.round(user.cgpa * 2) : 10));
  const interviewScore = Math.min(92, 60 + user.interviewConfidence * 4);
  const consistencyScore = Math.min(100, (user.streakDays || 1) * 10 + (missionScore > 50 ? 20 : 0));

  const targetComp = user.targetCompanies?.[0] || 'Reliance Industries Limited';

  const dimensions = [
    {
      dimension: 'Core Engineering Fundamentals',
      score: coreEngineeringScore,
      benchmark: 80,
      weight: 0.25,
      recentChange: +4,
      explanation: `Calculated from ${user.branch} core coursework and assessments (CGPA: ${user.cgpa || 8.0}).`,
    },
    {
      dimension: 'Proof of Execution & Projects',
      score: proofScore,
      benchmark: 75,
      weight: 0.25,
      recentChange: +12,
      explanation: `Derived from ${proofs.length} verified project proofs with calculations, CAD/simulation, and BOM data in SQLite database.`,
    },
    {
      dimension: 'Interview & STAR-L Communication',
      score: interviewScore,
      benchmark: 70,
      weight: 0.20,
      recentChange: +3,
      explanation: `Based on interview confidence level (${user.interviewConfidence}/10) and voice mock interview drills.`,
    },
    {
      dimension: `Target Recruiter Alignment (${targetComp.split(' ')[0]})`,
      score: 76,
      benchmark: 80,
      weight: 0.15,
      recentChange: +5,
      explanation: `Readiness mapped to typical assessment stages and technical criteria of ${targetComp}.`,
    },
    {
      dimension: 'Consistency & Daily Missions',
      score: consistencyScore,
      benchmark: 85,
      weight: 0.15,
      recentChange: +7,
      explanation: `Active streak of ${user.streakDays || 1} days with ${completedTasks}/${mission.tasks.length} tasks completed today.`,
    },
  ];

  const totalScore = Math.round(dimensions.reduce((acc, dim) => acc + dim.score * dim.weight, 0));

  return {
    totalScore,
    dimensions,
    weakestSkill: mistakes.length > 0 ? mistakes[0].category : 'Industrial Process Safety & HAZOP',
    strongestSkill: proofs.length > 0 ? proofs[0].skill : 'Thermodynamics & Heat Exchanger Pinch Analysis',
    statusLabel: totalScore >= 80 ? 'Interview Ready' : totalScore >= 65 ? 'Building Foundation' : 'Needs Focus',
  };
}

// ==================== AUTH & PROFILE ROUTES ====================

// Real Login with loginId / email and password
apiRouter.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { loginId, email, password, isDemo } = req.body;
    const identifier = (loginId || email || '').trim();

    // 1-Click Demo Shortcut
    if (isDemo || identifier === 'alex_student' || identifier.toLowerCase().includes('demo')) {
      const demoUser = await getUserById(DEMO_USER_PROFILE.id);
      if (demoUser) {
        return res.json({
          success: true,
          user: demoUser,
          token: demoUser.id,
          message: 'Logged in as Demo Student',
        });
      }
    }

    if (!identifier) {
      return res.status(400).json({ error: 'Please enter a Login ID or Email' });
    }

    const userRecord = await getUserByLoginId(identifier);
    if (!userRecord) {
      return res.status(401).json({ error: 'Account not found. Please check your Login ID or register a new account.' });
    }

    // Verify Password if provided
    if (password && userRecord.password_hash) {
      const valid = bcrypt.compareSync(password, userRecord.password_hash);
      if (!valid) {
        return res.status(401).json({ error: 'Invalid password. Please try again.' });
      }
    }

    const userProfile = await getUserById(userRecord.id);
    return res.json({
      success: true,
      user: userProfile,
      token: userProfile!.id,
      message: 'Login successful',
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: err.message || 'Login failed' });
  }
});

// Real Registration with SQLite database storage
apiRouter.post('/auth/register', async (req: Request, res: Response) => {
  try {
    const { loginId, password, name, email, branch, college, degree, targetCompany } = req.body;

    if (!loginId || !password || !name) {
      return res.status(400).json({ error: 'Login ID, Password, and Full Name are required.' });
    }

    const cleanLoginId = loginId.trim().toLowerCase();
    const cleanEmail = (email || `${cleanLoginId}@placero.student.edu`).trim().toLowerCase();

    // Check existing
    const existing = await getUserByLoginId(cleanLoginId);
    if (existing) {
      return res.status(400).json({ error: `Login ID "${cleanLoginId}" is already taken. Please choose another.` });
    }

    const newUser = await createUser({
      loginId: cleanLoginId,
      email: cleanEmail,
      password,
      name: name.trim(),
      branch: branch || 'Chemical Engineering',
      college: college || 'National Institute of Technology',
      degree: degree || 'B.Tech',
      targetCompany: targetCompany || 'Reliance Industries Limited',
    });

    return res.status(201).json({
      success: true,
      user: newUser,
      token: newUser.id,
      message: 'Registration successful! Your database account is ready.',
    });
  } catch (err: any) {
    console.error('Register error:', err);
    return res.status(500).json({ error: err.message || 'Registration failed' });
  }
});

apiRouter.get('/auth/me', async (req: Request, res: Response) => {
  try {
    const userId = getActiveUserId(req);
    const user = await getUserById(userId);
    res.json({ user: user || DEMO_USER_PROFILE });
  } catch (err: any) {
    res.json({ user: DEMO_USER_PROFILE });
  }
});

apiRouter.get('/user/profile', async (req: Request, res: Response) => {
  try {
    const userId = getActiveUserId(req);
    const user = (await getUserById(userId)) || DEMO_USER_PROFILE;
    const badges = await computeBadgesForUser(userId);
    res.json({ ...user, badges });
  } catch (err: any) {
    res.json(DEMO_USER_PROFILE);
  }
});

apiRouter.post('/user/profile', async (req: Request, res: Response) => {
  try {
    const userId = getActiveUserId(req);
    const updated = await updateUser(userId, req.body);
    const badges = await computeBadgesForUser(userId);
    res.json({ ...updated, badges });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update profile' });
  }
});

// Badges endpoint
apiRouter.get('/user/badges', async (req: Request, res: Response) => {
  try {
    const userId = getActiveUserId(req);
    const badges = await computeBadgesForUser(userId);
    res.json(Array.isArray(badges) ? badges : []);
  } catch (err: any) {
    console.error('Failed to compute badges:', err);
    res.json([]);
  }
});

// Mock interviews endpoints
apiRouter.get('/user/mock-interviews', async (req: Request, res: Response) => {
  try {
    const userId = getActiveUserId(req);
    const interviews = await getMockInterviewsByUserId(userId);
    res.json(interviews);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to load mock interviews' });
  }
});

apiRouter.post('/user/mock-interviews', async (req: Request, res: Response) => {
  try {
    const userId = getActiveUserId(req);
    const interview = await insertMockInterview(userId, req.body);
    const badges = await computeBadgesForUser(userId);
    res.json({ interview, badges });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to save mock interview' });
  }
});

// Study Tools endpoints (Flashcards, Notes, Pomodoro Sessions)
apiRouter.get('/study/flashcards', async (req: Request, res: Response) => {
  try {
    const userId = getActiveUserId(req);
    const cards = await getFlashcardsByUserId(userId);
    res.json(cards);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch flashcards' });
  }
});

apiRouter.post('/study/flashcards', async (req: Request, res: Response) => {
  try {
    const userId = getActiveUserId(req);
    const card = await insertFlashcard(userId, req.body);
    res.json(card);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create flashcard' });
  }
});

apiRouter.post('/study/flashcards/:id/mastery', async (req: Request, res: Response) => {
  try {
    const delta = req.body.delta || 1;
    await updateFlashcardMastery(req.params.id, delta);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update flashcard' });
  }
});

apiRouter.get('/study/notes', async (req: Request, res: Response) => {
  try {
    const userId = getActiveUserId(req);
    const notes = await getStudyNotesByUserId(userId);
    res.json(notes);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch study notes' });
  }
});

apiRouter.post('/study/notes', async (req: Request, res: Response) => {
  try {
    const userId = getActiveUserId(req);
    const note = await saveStudyNote(userId, req.body);
    res.json(note);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to save study note' });
  }
});

apiRouter.delete('/study/notes/:id', async (req: Request, res: Response) => {
  try {
    await deleteStudyNote(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

// ==================== LEETCODE ARENA ENDPOINTS ====================

apiRouter.get('/leetcode/problems', async (req: Request, res: Response) => {
  try {
    const userId = getActiveUserId(req);
    const problems = await getLeetCodeProblems(userId);
    res.json(problems);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch LeetCode problems' });
  }
});

apiRouter.get('/leetcode/problems/:id', async (req: Request, res: Response) => {
  try {
    const userId = getActiveUserId(req);
    const problem = await getLeetCodeProblemById(req.params.id, userId);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    res.json(problem);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch problem' });
  }
});

apiRouter.post('/leetcode/problems/:id/run', async (req: Request, res: Response) => {
  try {
    const { code, language, customInput } = req.body;
    const result = await runLeetCodeTest(req.params.id, code, language, customInput);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: 'Code execution failed', message: err.message });
  }
});

apiRouter.post('/leetcode/problems/:id/submit', async (req: Request, res: Response) => {
  try {
    const userId = getActiveUserId(req);
    const { code, language, notes } = req.body;
    const result = await submitLeetCodeSolution(userId, req.params.id, { code, language, notes });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: 'Solution submission failed', message: err.message });
  }
});

apiRouter.post('/leetcode/problems/:id/notes', async (req: Request, res: Response) => {
  try {
    const userId = getActiveUserId(req);
    const { notes } = req.body;
    const result = await saveLeetCodeNote(userId, req.params.id, notes);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to save notes' });
  }
});

apiRouter.post('/study/log-session', async (req: Request, res: Response) => {
  try {
    const userId = getActiveUserId(req);
    const { minutes } = req.body;
    const safeMin = Number(minutes) || 25;
    const user = await getUserById(userId);
    if (user) {
      const addedXp = Math.round(safeMin * 2);
      await updateUser(userId, {
        dailyStudyTimeMinutes: (user.dailyStudyTimeMinutes || 0) + safeMin,
        xp: user.xp + addedXp,
      });
    }
    const updatedUser = await getUserById(userId);
    const badges = await computeBadgesForUser(userId);
    res.json({ success: true, user: updatedUser, badges });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to log study session' });
  }
});

apiRouter.post('/user/personality', async (req: Request, res: Response) => {
  try {
    const userId = getActiveUserId(req);
    const personalityData = req.body;
    const updated = await updateUser(userId, {
      personalityProfile: {
        ...personalityData,
        completedAt: new Date().toISOString().split('T')[0],
      },
    });
    // Award 200 XP for completing alignment diagnostic
    if (updated) {
      await updateUser(userId, { xp: (updated.xp || 1450) + 200 });
    }
    const finalUser = await getUserById(userId);
    const badges = await computeBadgesForUser(userId);
    res.json({ success: true, user: { ...finalUser, badges }, badges });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to save personality assessment' });
  }
});

apiRouter.post('/user/reset-demo', async (_req: Request, res: Response) => {
  try {
    const user = await getUserById(DEMO_USER_PROFILE.id);
    res.json({ success: true, user: user || DEMO_USER_PROFILE });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to reset demo' });
  }
});

// ==================== READINESS & DASHBOARD ====================

apiRouter.get('/readiness', async (req: Request, res: Response) => {
  try {
    const userId = getActiveUserId(req);
    const readiness = await computeReadinessScoreForUser(userId);
    res.json(readiness);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to compute readiness' });
  }
});

apiRouter.get('/daily-feed', (_req: Request, res: Response) => {
  res.json(SEED_DAILY_FEED);
});

apiRouter.get('/alumni', (req: Request, res: Response) => {
  const branch = req.query.branch as string;
  if (branch) {
    return res.json(SEED_ALUMNI.filter((a) => a.branch.toLowerCase() === branch.toLowerCase()));
  }
  res.json(SEED_ALUMNI);
});

// ==================== MISSIONS (DATABASE PERSISTENCE) ====================

apiRouter.get('/missions/today', async (req: Request, res: Response) => {
  try {
    const userId = getActiveUserId(req);
    const mission = await getDailyMissionByUserId(userId);
    res.json(mission);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to load daily mission' });
  }
});

apiRouter.post('/missions/toggle-task', async (req: Request, res: Response) => {
  try {
    const userId = getActiveUserId(req);
    const { taskId } = req.body;
    if (!taskId) return res.status(400).json({ error: 'taskId required' });

    const result = await toggleMissionTaskDb(userId, taskId);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to toggle task' });
  }
});

// ==================== ROADMAP (DEDICATED DATABASE ENDPOINTS) ====================

apiRouter.get('/roadmap', async (req: Request, res: Response) => {
  try {
    const userId = getActiveUserId(req);
    const roadmap = await getRoadmapByUserId(userId);
    res.json(roadmap);
  } catch (err: any) {
    console.error('Roadmap fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch roadmap' });
  }
});

apiRouter.post('/roadmap/toggle', async (req: Request, res: Response) => {
  try {
    const userId = getActiveUserId(req);
    const { milestoneId } = req.body;
    if (!milestoneId) return res.status(400).json({ error: 'milestoneId is required' });

    const updated = await toggleMilestoneDb(userId, milestoneId);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to toggle milestone' });
  }
});

apiRouter.post('/roadmap/milestones', async (req: Request, res: Response) => {
  try {
    const userId = getActiveUserId(req);
    const { milestones } = req.body;
    if (!Array.isArray(milestones)) {
      return res.status(400).json({ error: 'milestones array is required' });
    }
    const updated = await updateRoadmapMilestonesDb(userId, milestones);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update milestones' });
  }
});

apiRouter.post('/roadmap/generate', async (req: Request, res: Response) => {
  try {
    const userId = getActiveUserId(req);
    const { targetCompany, branch, totalWeeks } = req.body;
    const user = await getUserById(userId);

    const compName = targetCompany || user?.targetCompanies?.[0] || 'Reliance Industries Limited';
    const branchName = branch || user?.branch || 'Chemical Engineering';
    const weeks = totalWeeks || 10;

    // Build specialized milestone plan tailored to branch and company
    const generatedMilestones: RoadmapMilestone[] = [
      {
        id: `gen-${Date.now()}-1`,
        phase: 'T-90 Days (Foundations)',
        weekNumber: 1,
        title: `${branchName} Core Axioms & Boundary Conditions`,
        category: 'Core Engineering',
        description: `Deep review of governing conservation laws, thermodynamic boundaries, and foundational engineering formulas in ${branchName}.`,
        deliverable: `Comprehensive derivation notebook with stated assumptions for standard ${branchName} viva questions.`,
        recommendedTimeHours: 12,
        completed: true,
        priority: 'Critical',
      },
      {
        id: `gen-${Date.now()}-2`,
        phase: 'T-90 Days (Foundations)',
        weekNumber: 2,
        title: 'Quantitative Problem Solving & Numerical Precision',
        category: 'Core Engineering',
        description: `Solve 20 high-frequency technical calculation problems with zero calculator dependency; master order-of-magnitude estimation.`,
        deliverable: `Scored problem set verified with physical sanity checks and dimensional consistency.`,
        recommendedTimeHours: 14,
        completed: true,
        priority: 'High',
      },
      {
        id: `gen-${Date.now()}-3`,
        phase: 'T-60 Days (Core Mastery)',
        weekNumber: 3,
        title: `${compName} Primary Plant / Tech Architecture Deep Dive`,
        category: 'Company Intelligence',
        description: `Analyze ${compName}'s major business units, flagship facilities, engineering patents, and recently published technical whitepapers.`,
        deliverable: `Structured 2-page intelligence briefing detailing ${compName}'s supply chain and engineering bottlenecks.`,
        recommendedTimeHours: 10,
        completed: false,
        priority: 'Critical',
      },
      {
        id: `gen-${Date.now()}-4`,
        phase: 'T-60 Days (Core Mastery)',
        weekNumber: 4,
        title: 'Proof-of-Execution Project with Interactive BOM & Costing',
        category: 'Proof Building',
        description: `Author a complete technical case study demonstrating hands-on problem solving, CAD/simulation validation, and practical equipment costing.`,
        deliverable: `Published Proof Lab project evaluated with >80 AI Evidence Score and downloadable calculation model.`,
        recommendedTimeHours: 16,
        completed: false,
        priority: 'Critical',
      },
      {
        id: `gen-${Date.now()}-5`,
        phase: 'T-30 Days (Company Specifics)',
        weekNumber: 5,
        title: 'Reverse Process / System Audit for Target Operations',
        category: 'Company Intelligence',
        description: `Construct an operational reverse audit identifying potential bottlenecks, safety risks, and efficiency opportunities inside ${compName}.`,
        deliverable: `Complete Reverse Audit proposal memo ready to present during technical interview rounds.`,
        recommendedTimeHours: 12,
        completed: false,
        priority: 'High',
      },
      {
        id: `gen-${Date.now()}-6`,
        phase: 'T-30 Days (Company Specifics)',
        weekNumber: 6,
        title: 'Resume Bullet "So What?" Transformation',
        category: 'Proof Building',
        description: `Audit and rewrite every resume bullet using Action + Context + Quantifiable Result + Business Impact.`,
        deliverable: `Clean, 1-page ATS-ready resume with quantified metrics and zero passive voice.`,
        recommendedTimeHours: 8,
        completed: false,
        priority: 'High',
      },
      {
        id: `gen-${Date.now()}-7`,
        phase: 'T-14 Days (Mock Interrogation)',
        weekNumber: 7,
        title: 'Voice Mock Viva & High-Stress Technical Cross-Examination',
        category: 'Mock Interviews',
        description: `Practice answering high-speed technical viva queries under a countdown timer with filler word detection and STAR-L scoring.`,
        deliverable: `Minimum 3 recorded voice mock interviews with speaking pace between 120-140 WPM and <3 filler words per minute.`,
        recommendedTimeHours: 14,
        completed: false,
        priority: 'Critical',
      },
      {
        id: `gen-${Date.now()}-8`,
        phase: 'T-7 Days (Fine Tuning)',
        weekNumber: 8,
        title: 'Mistake Vault Audit & Failure Pattern Elimination',
        category: 'Core Engineering',
        description: `Systematically review all logged viva traps and past assessment failures to eliminate recurring conceptual errors.`,
        deliverable: `100% mastery score across all flagged mistakes in the Mistake Vault.`,
        recommendedTimeHours: 10,
        completed: false,
        priority: 'High',
      },
      {
        id: `gen-${Date.now()}-9`,
        phase: 'T-1 Day (Final Calm)',
        weekNumber: 9,
        title: '30-60-90 Day Onboarding Plan & Panel Inquiry Preparation',
        category: 'Behavioral & STAR-L',
        description: `Formulate a crisp 30-60-90 day execution plan and prepare 3 perceptive, insightful questions to ask the hiring panel.`,
        deliverable: `Printed 1-page Graduate Engineer Trainee roadmap to hand to the interview panel.`,
        recommendedTimeHours: 5,
        completed: false,
        priority: 'Medium',
      },
      {
        id: `gen-${Date.now()}-10`,
        phase: 'Interview Day (Execution)',
        weekNumber: 10,
        title: `Campus Placement Drive Execution: ${compName}`,
        category: 'Mock Interviews',
        description: `Execute with poise, thermodynamic/systemic conviction, stated assumptions, and verified proof evidence.`,
        deliverable: `GET Placement Offer Letter secured!`,
        recommendedTimeHours: 8,
        completed: false,
        priority: 'Critical',
      },
    ];

    const updatedRoadmap = await updateRoadmapMilestonesDb(userId, generatedMilestones);
    res.json(updatedRoadmap);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Roadmap generation failed' });
  }
});

// ==================== COMPANIES & SKILLS (DATABASE PERSISTENCE) ====================

apiRouter.get('/companies', async (req: Request, res: Response) => {
  try {
    const branch = req.query.branch as string;
    const category = req.query.category as string;
    let companies = await getAllCompanies();

    if (companies.length === 0) {
      companies = SEED_COMPANIES;
    }

    if (branch) {
      companies = companies.filter((c) =>
        c.relevantBranches.some((b) => b.toLowerCase().includes(branch.toLowerCase()))
      );
    }
    if (category) {
      companies = companies.filter((c) => c.category.toLowerCase() === category.toLowerCase());
    }

    res.json(companies);
  } catch (err: any) {
    res.json(SEED_COMPANIES);
  }
});

apiRouter.get('/companies/:id', async (req: Request, res: Response) => {
  try {
    const companies = await getAllCompanies();
    const company = companies.find((c) => c.id === req.params.id) || SEED_COMPANIES.find((c) => c.id === req.params.id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.json(company);
  } catch (err: any) {
    res.status(500).json({ error: 'Company lookup failed' });
  }
});

apiRouter.get('/skills', (req: Request, res: Response) => {
  const branch = req.query.branch as string;
  if (branch) {
    return res.json(SEED_SKILLS.filter((s) => s.branch.toLowerCase() === branch.toLowerCase()));
  }
  res.json(SEED_SKILLS);
});

apiRouter.get('/questions', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const { companyId, branch, difficulty, category } = req.query;

    const resDb = db.exec(`SELECT * FROM interview_questions;`);
    let questions: InterviewQuestion[] = [];

    if (resDb.length > 0 && resDb[0].values.length > 0) {
      const cols = resDb[0].columns;
      questions = resDb[0].values.map((row) => {
        const o: any = {};
        cols.forEach((col, i) => (o[col] = row[i]));
        return {
          id: o.id,
          companyId: o.company_id,
          companyName: o.company_name,
          branch: o.branch,
          skill: o.skill,
          category: o.category,
          difficulty: o.difficulty,
          question: o.question,
          contextOrScenario: o.context_or_scenario,
          idealAnswerPoints: JSON.parse(o.ideal_answer_points_json || '[]'),
          commonMistakes: JSON.parse(o.common_mistakes_json || '[]'),
          starGuide: JSON.parse(o.star_guide_json || '{}'),
        };
      });
    }

    if (questions.length === 0) {
      questions = SEED_INTERVIEW_QUESTIONS;
    }

    if (companyId) {
      questions = questions.filter((q) => q.companyId === companyId);
    }
    if (branch) {
      questions = questions.filter((q) => !q.branch || q.branch.toLowerCase().includes((branch as string).toLowerCase()));
    }
    if (difficulty) {
      questions = questions.filter((q) => q.difficulty.toLowerCase() === (difficulty as string).toLowerCase());
    }
    if (category) {
      questions = questions.filter((q) => q.category.toLowerCase() === (category as string).toLowerCase());
    }

    res.json(questions);
  } catch (err: any) {
    res.json(SEED_INTERVIEW_QUESTIONS);
  }
});

// ==================== PROOF OF EXECUTION (DATABASE PERSISTENCE) ====================

apiRouter.get('/proofs', async (req: Request, res: Response) => {
  try {
    const userId = getActiveUserId(req);
    const proofs = await getProofsByUserId(userId);
    res.json(proofs);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to load proofs' });
  }
});

apiRouter.post('/proofs', async (req: Request, res: Response) => {
  try {
    const userId = getActiveUserId(req);
    const rawProof = req.body;

    // Evaluate evidence score with Gemini or structured heuristics
    let evidenceScore = rawProof.evidenceScore;
    if (!evidenceScore) {
      try {
        evidenceScore = await evaluateProjectEvidence({
          title: rawProof.title,
          skill: rawProof.skill,
          branch: rawProof.branch,
          problemStatement: rawProof.problemStatement,
          engineeringApproach: rawProof.engineeringApproach,
          toolsUsed: rawProof.toolsUsed || [],
          technicalExplanation: rawProof.technicalExplanation,
          quantifiableImpact: rawProof.quantifiableImpact,
          lessonsLearned: rawProof.lessonsLearned,
          hasBom: Boolean(rawProof.bomItems && rawProof.bomItems.length > 0),
          hasGithubOrCad: Boolean(rawProof.githubUrl || rawProof.cadOrSimulationNotes),
        });
      } catch (e) {
        console.warn('Fallback evidence score used');
      }
    }

    const inserted = await insertProof(userId, {
      ...rawProof,
      evidenceScore,
    });

    // Award XP
    const user = await getUserById(userId);
    if (user) {
      await updateUser(userId, { xp: user.xp + 150 });
    }

    res.json(inserted);
  } catch (err: any) {
    console.error('Proof insert error:', err);
    res.status(500).json({ error: err.message || 'Failed to save project proof' });
  }
});

apiRouter.delete('/proofs/:id', async (req: Request, res: Response) => {
  try {
    await deleteProofById(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete proof' });
  }
});

// ==================== MISTAKE VAULT (DATABASE PERSISTENCE) ====================

apiRouter.get('/mistakes', async (req: Request, res: Response) => {
  try {
    const userId = getActiveUserId(req);
    const mistakes = await getMistakesByUserId(userId);
    res.json(mistakes);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to load mistakes' });
  }
});

apiRouter.post('/mistakes', async (req: Request, res: Response) => {
  try {
    const userId = getActiveUserId(req);
    const inserted = await insertMistake(userId, req.body);
    res.json(inserted);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to record mistake' });
  }
});

apiRouter.delete('/mistakes/:id', async (req: Request, res: Response) => {
  try {
    await deleteMistakeById(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete mistake' });
  }
});

// ==================== AI CONTROLLERS (SERVER-SIDE GEMINI) ====================

apiRouter.post('/ai/coach', async (req: Request, res: Response) => {
  try {
    const userId = getActiveUserId(req);
    const { question } = req.body;
    const user = (await getUserById(userId)) || DEMO_USER_PROFILE;
    const readiness = await computeReadinessScoreForUser(userId);
    const proofs = await getProofsByUserId(userId);
    const mistakes = await getMistakesByUserId(userId);

    const result = await askCareerCoach(question, {
      name: user.name,
      branch: user.branch,
      cgpa: user.cgpa,
      targetCompanies: user.targetCompanies,
      weakestSkill: readiness.weakestSkill,
      strongestSkill: readiness.strongestSkill,
      recentMistakesCount: mistakes.length,
      proofCount: proofs.length,
    });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'AI coach unavailable' });
  }
});

apiRouter.post('/ai/resume-bullet', async (req: Request, res: Response) => {
  try {
    const userId = getActiveUserId(req);
    const user = (await getUserById(userId)) || DEMO_USER_PROFILE;
    const { rawBullet, targetCompany } = req.body;
    if (!rawBullet) {
      return res.status(400).json({ error: 'rawBullet is required' });
    }
    const result = await improveResumeBullet(rawBullet, user.branch, targetCompany);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Resume AI evaluation failed' });
  }
});

apiRouter.post('/ai/interview-feedback', async (req: Request, res: Response) => {
  try {
    const userId = getActiveUserId(req);
    const user = (await getUserById(userId)) || DEMO_USER_PROFILE;
    const { question, transcript, category, targetCompany, durationSeconds } = req.body;
    if (!transcript) {
      return res.status(400).json({ error: 'transcript is required' });
    }

    // Filler word analysis server-side
    const fillerTokens = ['um', 'uh', 'like', 'actually', 'basically', 'you know', 'sort of', 'kind of'];
    const lower = transcript.toLowerCase();
    const fillerWordsFound = fillerTokens
      .map((w) => {
        const regex = new RegExp(`\\b${w}\\b`, 'gi');
        const matches = lower.match(regex);
        return { word: w, count: matches ? matches.length : 0 };
      })
      .filter((item) => item.count > 0);

    const totalFillers = fillerWordsFound.reduce((acc, curr) => acc + curr.count, 0);
    const wordCount = transcript.trim().split(/\s+/).length;
    const safeDuration = durationSeconds && durationSeconds > 0 ? durationSeconds : 60;
    const speakingPaceWpm = Math.round((wordCount / safeDuration) * 60);

    const feedback = await evaluateInterviewAnswer(
      question || 'Technical Problem Solving',
      transcript,
      category || 'Core Engineering',
      user.branch,
      targetCompany
    );

    // Save to SQLite database so performance badges update dynamically
    const savedInterview = await insertMockInterview(userId, {
      question: question || 'Technical Problem Solving',
      category: category || 'Core Engineering',
      targetCompany: targetCompany || 'Reliance Industries Limited',
      durationSeconds: safeDuration,
      speakingPaceWpm,
      fillerWordCount: totalFillers,
      overallScore: feedback.overallScore,
      starScore: feedback.overallScore || 80,
      attemptNumber: req.body.attemptNumber || 1,
      transcript,
      evaluation: feedback,
    });

    const updatedBadges = await computeBadgesForUser(userId);

    res.json({
      durationSeconds: safeDuration,
      speakingPaceWpm,
      fillerWordCount: totalFillers,
      fillerWordsFound,
      ...feedback,
      savedInterviewId: savedInterview.id,
      badges: updatedBadges,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Interview evaluation failed' });
  }
});

apiRouter.post('/ai/evidence-score', async (req: Request, res: Response) => {
  try {
    const userId = getActiveUserId(req);
    const user = (await getUserById(userId)) || DEMO_USER_PROFILE;
    const projectData = req.body;
    const evaluation = await evaluateProjectEvidence({
      ...projectData,
      branch: user.branch,
    });
    res.json(evaluation);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Evidence scoring failed' });
  }
});

apiRouter.post('/ai/plan-generator', async (req: Request, res: Response) => {
  try {
    const userId = getActiveUserId(req);
    const user = (await getUserById(userId)) || DEMO_USER_PROFILE;
    const { companyName, role } = req.body;
    const plan = await generate306090Plan(
      companyName || 'Reliance Industries Limited',
      role || 'Graduate Engineer Trainee',
      user.branch
    );
    res.json(plan);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Plan generation failed' });
  }
});

apiRouter.post('/ai/reverse-audit', async (req: Request, res: Response) => {
  try {
    const userId = getActiveUserId(req);
    const user = (await getUserById(userId)) || DEMO_USER_PROFILE;
    const { companyName, productOrProcess } = req.body;
    const audit = await generateReverseAudit(
      companyName || 'Reliance Industries Limited',
      productOrProcess || 'Refinery Preheat Train & Pinch Exchangers',
      user.branch
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

// ==================== ADMIN ENDPOINTS (DATABASE PERSISTENCE) ====================

apiRouter.post('/admin/company', async (req: Request, res: Response) => {
  try {
    const created = await insertCompanyDb(req.body);
    res.json(created);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to add company' });
  }
});

apiRouter.patch('/admin/company/:id/verify', async (req: Request, res: Response) => {
  try {
    const verified = await verifyCompanyDb(req.params.id);
    if (!verified) return res.status(404).json({ error: 'Company not found' });
    res.json(verified);
  } catch (err: any) {
    res.status(500).json({ error: 'Verification update failed' });
  }
});

apiRouter.post('/admin/question', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const id = `q-${Date.now()}`;
    const q = req.body;

    db.run(
      `
      INSERT INTO interview_questions (
        id, company_id, company_name, branch, skill, category, difficulty,
        question, context_or_scenario, ideal_answer_points_json,
        common_mistakes_json, star_guide_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `,
      [
        id,
        q.companyId || null,
        q.companyName || null,
        q.branch || null,
        q.skill || 'Core Technical',
        q.category || 'Core Engineering',
        q.difficulty || 'Medium',
        q.question,
        q.contextOrScenario || null,
        JSON.stringify(q.idealAnswerPoints || []),
        JSON.stringify(q.commonMistakes || []),
        JSON.stringify(q.starGuide || {}),
      ]
    );

    persistDb();
    res.json({ id, ...q });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to insert question' });
  }
});

import initSqlJs, { Database as SqlDatabase } from 'sql.js';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import {
  UserProfile,
  ProjectEvidence,
  MistakeRecord,
  DailyMission,
  Company,
  InterviewQuestion,
  RoadmapPlan,
  RoadmapMilestone,
} from '../../src/types/index.ts';
import {
  SEED_COMPANIES,
  SEED_INTERVIEW_QUESTIONS,
  DEMO_USER_PROFILE,
} from '../data/seedData.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'placero.sqlite');

let db: SqlDatabase | null = null;

// Helper to save sqlite database to disk
export function persistDb() {
  if (!db) return;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_FILE, buffer);
  } catch (err) {
    console.error('Failed to persist database to disk:', err);
  }
}

// Initial default roadmap milestones
const DEFAULT_ROADMAP_MILESTONES: RoadmapMilestone[] = [
  {
    id: 'm-1',
    phase: 'T-90 Days (Foundations)',
    weekNumber: 1,
    title: 'Core Thermodynamics & Boundary Assumptions',
    category: 'Core Engineering',
    description: 'Master 1st & 2nd laws, state variables, open vs closed systems, and phase equilibria (VLE). Practice stating assumptions before every equation.',
    deliverable: 'Derive non-ideal VLE Wilson activity coefficient calculation with verified boundary conditions.',
    recommendedTimeHours: 12,
    completed: true,
    priority: 'Critical',
  },
  {
    id: 'm-2',
    phase: 'T-90 Days (Foundations)',
    weekNumber: 2,
    title: 'Fluid Mechanics & Piping Hydraulics',
    category: 'Core Engineering',
    description: 'Solve piping network pressure drops, friction factor (Moody chart / Colebrook), and centrifugal pump NPSH available vs required calculations.',
    deliverable: 'Complete pump sizing spreadsheet with NPSH margin and cavitation safety check.',
    recommendedTimeHours: 14,
    completed: true,
    priority: 'Critical',
  },
  {
    id: 'm-3',
    phase: 'T-60 Days (Core Mastery)',
    weekNumber: 3,
    title: 'Unit Operations: Distillation & Heat Transfer',
    category: 'Core Engineering',
    description: 'Master McCabe-Thiele and Fenske distillation calculations, minimum reflux ratio, and shell-and-tube heat exchanger rating (Kern method / TEMA).',
    deliverable: 'Complete binary distillation column stage calculation notebook with reflux sensitivity.',
    recommendedTimeHours: 16,
    completed: true,
    priority: 'High',
  },
  {
    id: 'm-4',
    phase: 'T-60 Days (Core Mastery)',
    weekNumber: 4,
    title: 'Proof-of-Execution Project 1 (Pinch Analysis)',
    category: 'Proof Building',
    description: 'Document an industrial case study with problem statement, composite curves, Bill of Materials, and quantifiable energy savings.',
    deliverable: 'Published Proof Lab project: "Crude Preheat Train Pinch Analysis & Exchanger Optimization" with 14.2% verified energy reduction.',
    recommendedTimeHours: 18,
    completed: true,
    priority: 'Critical',
  },
  {
    id: 'm-5',
    phase: 'T-30 Days (Company Specifics)',
    weekNumber: 5,
    title: 'Reliance Industries Plant Architecture & Safety',
    category: 'Company Intelligence',
    description: 'Deep dive into Jamnagar refinery operations, catalytic cracking, HAZOP worksheets, and emergency shutdown valves (ESDV).',
    deliverable: 'Complete Reverse Process Audit memo on refinery preheat train fouling mitigation.',
    recommendedTimeHours: 15,
    completed: false,
    priority: 'Critical',
  },
  {
    id: 'm-6',
    phase: 'T-30 Days (Company Specifics)',
    weekNumber: 6,
    title: 'Resume Bullet Lab & "So What?" Transformation',
    category: 'Proof Building',
    description: 'Refactor all resume bullets into Action + Context + Quantifiable Result + Impact. Remove all passive phrasing.',
    deliverable: '4 transformed resume bullets with verified metric metrics approved by AI Resume Lab.',
    recommendedTimeHours: 8,
    completed: false,
    priority: 'High',
  },
  {
    id: 'm-7',
    phase: 'T-14 Days (Mock Interrogation)',
    weekNumber: 7,
    title: 'High-Pressure Voice Mock Interviews',
    category: 'Mock Interviews',
    description: 'Simulate technical viva and STAR-L behavioral questions under strict timer. Eliminate filler words ("um", "like") and maintain 130 WPM speaking pace.',
    deliverable: 'Complete 3 voice recordings scoring >80% on STAR-L analysis and zero fatal concept errors.',
    recommendedTimeHours: 12,
    completed: false,
    priority: 'Critical',
  },
  {
    id: 'm-8',
    phase: 'T-7 Days (Fine Tuning)',
    weekNumber: 8,
    title: 'Mistake Vault Review & Assumption Audit',
    category: 'Core Engineering',
    description: 'Review top recurring failure patterns from previous assessments. Practice answering failure questions with confidence.',
    deliverable: 'Zero repeated mistakes across 10 high-frequency viva trap questions.',
    recommendedTimeHours: 10,
    completed: false,
    priority: 'High',
  },
  {
    id: 'm-9',
    phase: 'T-1 Day (Final Calm)',
    weekNumber: 9,
    title: '100-Day Executive Onboarding Plan & Mindset',
    category: 'Behavioral & STAR-L',
    description: 'Review 30-60-90 day plan for Graduate Engineer Trainee onboarding. Review safety first principles, questions to ask the interview panel, and rest.',
    deliverable: 'Printed 100-Day Onboarding Plan ready for final round viva panel.',
    recommendedTimeHours: 4,
    completed: false,
    priority: 'Medium',
  },
  {
    id: 'm-10',
    phase: 'Interview Day (Execution)',
    weekNumber: 10,
    title: 'Campus Placement Day: Technical Panel & HR Viva',
    category: 'Mock Interviews',
    description: 'Deliver confident, structured STAR-L answers with boundary assumptions, technical conviction, and verified proof examples.',
    deliverable: 'Receive campus Graduate Engineer Trainee (GET) placement offer.',
    recommendedTimeHours: 8,
    completed: false,
    priority: 'Critical',
  },
];

// Initialize and seed SQLite database
export async function getDb(): Promise<SqlDatabase> {
  if (db) return db;

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_FILE)) {
    try {
      const fileBuffer = fs.readFileSync(DB_FILE);
      db = new SQL.Database(fileBuffer);
      console.log('📦 Loaded existing SQLite database from disk:', DB_FILE);
      return db;
    } catch (err) {
      console.warn('Could not read existing SQLite database, creating new:', err);
    }
  }

  // Create new Database
  db = new SQL.Database();
  console.log('🛠 Initializing fresh SQLite schema...');

  // Create Tables
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      login_id TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'student',
      college TEXT,
      degree TEXT,
      branch TEXT,
      year INTEGER,
      semester INTEGER,
      cgpa REAL,
      target_graduation_year INTEGER,
      preferred_role TEXT,
      target_companies_json TEXT,
      current_skills_json TEXT,
      programming_languages_json TEXT,
      software_tools_json TEXT,
      communication_confidence INTEGER,
      interview_confidence INTEGER,
      daily_study_time_minutes INTEGER,
      placement_timeline_days INTEGER,
      streak_days INTEGER,
      xp INTEGER,
      level INTEGER,
      badges_json TEXT,
      created_at TEXT,
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS proofs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      skill TEXT NOT NULL,
      branch TEXT NOT NULL,
      problem_statement TEXT,
      engineering_approach TEXT,
      tools_used_json TEXT,
      technical_explanation TEXT,
      quantifiable_impact TEXT,
      lessons_learned TEXT,
      github_url TEXT,
      live_demo_url TEXT,
      cad_notes TEXT,
      bom_items_json TEXT,
      evidence_score_json TEXT,
      is_public INTEGER DEFAULT 1,
      created_at TEXT
    );

    CREATE TABLE IF NOT EXISTS mistakes (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      question_or_problem TEXT NOT NULL,
      student_answer TEXT,
      what_went_wrong TEXT,
      correct_concept TEXT,
      improved_answer TEXT,
      category TEXT,
      branch TEXT,
      repeat_status TEXT,
      date_logged TEXT
    );

    CREATE TABLE IF NOT EXISTS daily_missions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      date TEXT NOT NULL,
      total_minutes INTEGER,
      tasks_json TEXT,
      all_completed INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS roadmaps (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      target_company TEXT NOT NULL,
      branch TEXT NOT NULL,
      total_weeks INTEGER,
      milestones_json TEXT,
      created_at TEXT,
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS companies (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      logo TEXT,
      category TEXT,
      industry TEXT,
      major_business_areas_json TEXT,
      relevant_roles_json TEXT,
      relevant_branches_json TEXT,
      frequently_requested_skills_json TEXT,
      typical_assessment_stages_json TEXT,
      technical_areas_json TEXT,
      behavioral_areas_json TEXT,
      example_preparation_topics_json TEXT,
      official_careers_url TEXT,
      official_engineering_blog_url TEXT,
      last_verified_date TEXT,
      source_reference TEXT,
      hiring_difficulty TEXT,
      reverse_audit_prompt TEXT
    );

    CREATE TABLE IF NOT EXISTS interview_questions (
      id TEXT PRIMARY KEY,
      company_id TEXT,
      company_name TEXT,
      branch TEXT,
      skill TEXT,
      category TEXT,
      difficulty TEXT,
      question TEXT,
      context_or_scenario TEXT,
      ideal_answer_points_json TEXT,
      common_mistakes_json TEXT,
      star_guide_json TEXT
    );
  `);

  // Seed default demo user: alex_student / password123
  const demoSalt = bcrypt.genSaltSync(10);
  const demoHash = bcrypt.hashSync('password123', demoSalt);

  const adminHash = bcrypt.hashSync('adminpassword', bcrypt.genSaltSync(10));

  const now = new Date().toISOString();

  // Insert Demo User
  db.run(`
    INSERT INTO users (
      id, login_id, email, password_hash, name, role, college, degree, branch,
      year, semester, cgpa, target_graduation_year, preferred_role,
      target_companies_json, current_skills_json, programming_languages_json,
      software_tools_json, communication_confidence, interview_confidence,
      daily_study_time_minutes, placement_timeline_days, streak_days, xp, level,
      badges_json, created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?
    );
  `, [
    DEMO_USER_PROFILE.id,
    'alex_student',
    DEMO_USER_PROFILE.email,
    demoHash,
    DEMO_USER_PROFILE.name,
    DEMO_USER_PROFILE.role,
    DEMO_USER_PROFILE.college,
    DEMO_USER_PROFILE.degree,
    DEMO_USER_PROFILE.branch,
    DEMO_USER_PROFILE.year,
    DEMO_USER_PROFILE.semester,
    DEMO_USER_PROFILE.cgpa,
    DEMO_USER_PROFILE.targetGraduationYear,
    DEMO_USER_PROFILE.preferredRole,
    JSON.stringify(DEMO_USER_PROFILE.targetCompanies),
    JSON.stringify(DEMO_USER_PROFILE.currentSkills),
    JSON.stringify(DEMO_USER_PROFILE.programmingLanguages),
    JSON.stringify(DEMO_USER_PROFILE.softwareTools),
    DEMO_USER_PROFILE.communicationConfidence,
    DEMO_USER_PROFILE.interviewConfidence,
    DEMO_USER_PROFILE.dailyStudyTimeMinutes,
    DEMO_USER_PROFILE.placementTimelineDays,
    DEMO_USER_PROFILE.streakDays,
    DEMO_USER_PROFILE.xp,
    DEMO_USER_PROFILE.level,
    JSON.stringify(DEMO_USER_PROFILE.badges),
    now,
    now,
  ]);

  // Insert Admin User
  db.run(`
    INSERT INTO users (
      id, login_id, email, password_hash, name, role, college, degree, branch,
      year, semester, cgpa, target_graduation_year, preferred_role,
      target_companies_json, current_skills_json, programming_languages_json,
      software_tools_json, communication_confidence, interview_confidence,
      daily_study_time_minutes, placement_timeline_days, streak_days, xp, level,
      badges_json, created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?
    );
  `, [
    'admin-user',
    'admin',
    'admin@placero.edu',
    adminHash,
    'Placement Cell Admin',
    'admin',
    'National Institute of Technology',
    'M.Tech',
    'Chemical Engineering',
    4, 8, 9.2, 2026,
    'Placement Director',
    JSON.stringify(['Reliance Industries Limited', 'Larsen & Toubro (L&T)', 'Siemens']),
    JSON.stringify(DEMO_USER_PROFILE.currentSkills),
    JSON.stringify(['Python', 'SQL']),
    JSON.stringify(['Aspen Plus', 'ETAP']),
    10, 10, 60, 30, 24, 4500, 10,
    JSON.stringify(DEMO_USER_PROFILE.badges),
    now, now
  ]);

  // Seed Companies
  for (const c of SEED_COMPANIES) {
    db.run(`
      INSERT INTO companies (
        id, name, logo, category, industry,
        major_business_areas_json, relevant_roles_json, relevant_branches_json,
        frequently_requested_skills_json, typical_assessment_stages_json,
        technical_areas_json, behavioral_areas_json, example_preparation_topics_json,
        official_careers_url, official_engineering_blog_url, last_verified_date,
        source_reference, hiring_difficulty, reverse_audit_prompt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `, [
      c.id,
      c.name,
      c.logo,
      c.category,
      c.industry,
      JSON.stringify(c.majorBusinessAreas),
      JSON.stringify(c.relevantRoles),
      JSON.stringify(c.relevantBranches),
      JSON.stringify(c.frequentlyRequestedSkills),
      JSON.stringify(c.typicalAssessmentStages),
      JSON.stringify(c.technicalAreas),
      JSON.stringify(c.behavioralAreas),
      JSON.stringify(c.examplePreparationTopics),
      c.officialCareersUrl,
      c.officialEngineeringBlogUrl || '',
      c.lastVerifiedDate,
      c.sourceReference,
      c.hiringDifficulty,
      c.reverseAuditPrompt,
    ]);
  }

  // Seed Interview Questions
  for (const q of SEED_INTERVIEW_QUESTIONS) {
    db.run(`
      INSERT INTO interview_questions (
        id, company_id, company_name, branch, skill, category, difficulty,
        question, context_or_scenario, ideal_answer_points_json,
        common_mistakes_json, star_guide_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `, [
      q.id,
      q.companyId || null,
      q.companyName || null,
      q.branch || null,
      q.skill,
      q.category,
      q.difficulty,
      q.question,
      q.contextOrScenario || null,
      JSON.stringify(q.idealAnswerPoints),
      JSON.stringify(q.commonMistakes),
      JSON.stringify(q.starGuide || {}),
    ]);
  }

  // Seed Initial Proofs for Alex Student
  db.run(`
    INSERT INTO proofs (
      id, user_id, title, skill, branch, problem_statement,
      engineering_approach, tools_used_json, technical_explanation,
      quantifiable_impact, lessons_learned, github_url, live_demo_url,
      cad_notes, bom_items_json, evidence_score_json, is_public, created_at
    ) VALUES (
      'proj-01', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?
    );
  `, [
    DEMO_USER_PROFILE.id,
    'Crude Preheat Train Pinch Analysis & Exchanger Optimization',
    'Heat Transfer & Exchangers',
    'Chemical Engineering',
    'High steam consumption in the atmospheric crude distillation preheat train due to sub-optimal heat exchanger network matching and heavy fouling.',
    'Applied Pinch Technology (Linnhoff March framework) with a minimum approach temperature (ΔT_min) of 15°C. Modeled stream enthalpy curves and re-routed hot residue streams.',
    JSON.stringify(['Aspen Energy Analyzer', 'Python (NumPy / Matplotlib)', 'AutoCAD P&ID']),
    'Constructed Composite Curves and Grand Composite Curve (GCC). Identified cross-pinch heat transfer in E-103 and retrofitted two 1-2 shell-and-tube exchangers in counter-current configuration to eliminate pinch violation.',
    'Calculated 14.2% reduction in furnace thermal duty (saving ~420 kg/hr fuel gas), reducing annual CO2 emissions by 1,180 metric tons.',
    'Pinch rules are strict—transferring heat across the pinch always doubles the penalty. Practical piping layout distance must be budgeted alongside thermodynamic optimality.',
    'https://github.com/placero-demo/crude-pinch-optimization',
    'https://placero-demo.dev/crude-pinch-demo',
    'Aspen Plus V12 simulation files with heat curve exports.',
    JSON.stringify([
      { id: 'b1', component: 'Shell-and-Tube Exchanger (TEMA AES)', quantity: 2, unitCost: 450000, supplier: 'L&T Heavy Engineering', reasonSelected: 'High pressure rating and carbon steel corrosion resistance' },
      { id: 'b2', component: 'High-Temperature Butterfly Control Valves', quantity: 4, unitCost: 65000, supplier: 'Emerson / Fisher', reasonSelected: 'Precision throttling for residue flow split' },
    ]),
    JSON.stringify({
      technicalDepth: 88,
      practicality: 84,
      documentation: 90,
      quantifiableResults: 86,
      reproducibility: 85,
      overall: 87,
      aiCritique: 'Exemplary engineering case study with clear composite curves, explicit ΔT_min justification, and verified greenhouse gas / fuel savings.',
      suggestedEnhancement: 'Include tube-side pressure drop calculations to demonstrate the existing booster pump does not cavitate.',
    }),
    '2026-09-18',
  ]);

  db.run(`
    INSERT INTO proofs (
      id, user_id, title, skill, branch, problem_statement,
      engineering_approach, tools_used_json, technical_explanation,
      quantifiable_impact, lessons_learned, github_url, live_demo_url,
      cad_notes, bom_items_json, evidence_score_json, is_public, created_at
    ) VALUES (
      'proj-02', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?
    );
  `, [
    DEMO_USER_PROFILE.id,
    'Automated Continuous Stirred Tank Reactor (CSTR) Temperature Interlock',
    'Process Safety & HAZOP',
    'Chemical Engineering',
    'Exothermic jacketed batch reactor vulnerability to thermal runaway when coolant circulation pump fails.',
    'Designed a dual-redundant Safety Instrumented System (SIS) meeting SIL-2 criteria with emergency coolant dump tank and automated reactant feed cutoff valve.',
    JSON.stringify(['MATLAB Simulink', 'HAZOP Worksheet', 'Arduino Prototyping Board']),
    'Formulated non-linear energy balance coupled with Arrhenius kinetics for sodium thiosulfate reaction. Implemented PID cascade control with rate-of-rise temperature trip logic.',
    'Simulated 100% containment of thermal runaway in 45 tested pump-failure scenarios; response time reduced to 1.8 seconds.',
    'Safety instrumented functions must have independent sensor taps; sharing process measurement transmitters with safety interlocks violates IEC 61511.',
    'https://github.com/placero-demo/cstr-safety-interlock',
    null,
    'Simulink control loop model with step failure simulation.',
    JSON.stringify([]),
    JSON.stringify({
      technicalDepth: 84,
      practicality: 86,
      documentation: 82,
      quantifiableResults: 88,
      reproducibility: 80,
      overall: 84,
      aiCritique: 'Superb application of IEC 61511 safety standards and runaway reaction kinetics.',
      suggestedEnhancement: 'Include valve stroke time test data under maximum pneumatic line pressure.',
    }),
    '2026-09-22',
  ]);

  // Seed Initial Mistakes
  db.run(`
    INSERT INTO mistakes (
      id, user_id, question_or_problem, student_answer, what_went_wrong,
      correct_concept, improved_answer, category, branch, repeat_status, date_logged
    ) VALUES (
      'mistake-01', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    );
  `, [
    DEMO_USER_PROFILE.id,
    'Centrifugal pump cavitation troubleshooting in refinery crude unit.',
    'I said we should immediately throttle the suction valve to slow down liquid entering the impeller.',
    'Throttling the suction valve creates a massive localized pressure drop across the valve, severely reducing NPSH available and dramatically worsening cavitation!',
    'Always throttle the DISCHARGE valve to reduce flow rate (which moves pump operation to a lower NPSH_required point on the pump curve), never throttle the suction valve.',
    'I would verify suction pressure and fluid temperature against vapor pressure to check NPSH margin, inspect the suction strainer for clogging, and if flow must be modulated, throttle the discharge valve only.',
    'Core Concept',
    'Chemical Engineering',
    'Mastered Now',
    '2026-09-23',
  ]);

  db.run(`
    INSERT INTO mistakes (
      id, user_id, question_or_problem, student_answer, what_went_wrong,
      correct_concept, improved_answer, category, branch, repeat_status, date_logged
    ) VALUES (
      'mistake-02', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    );
  `, [
    DEMO_USER_PROFILE.id,
    'Total reflux distillation operation in chemical plant.',
    'Said operating at total reflux is the best method to run a plant because separation is highest.',
    'Forgot that at total reflux, distillate take-off is ZERO. You make zero product!',
    'Total reflux is a theoretical limit used to find minimum stages (Fenske equation). Commercial columns operate at 1.1x to 1.3x minimum reflux to balance operating steam costs with capital column height.',
    'Total reflux yields zero production rate. In commercial plants we operate at an optimal reflux ratio typically 10-30% above minimum reflux to minimize total lifecycle cost.',
    'Assumptions',
    'Chemical Engineering',
    'Repeated Once',
    '2026-09-24',
  ]);

  // Seed Initial Daily Mission
  const todayStr = new Date().toISOString().split('T')[0];
  db.run(`
    INSERT INTO daily_missions (
      id, user_id, date, total_minutes, tasks_json, all_completed
    ) VALUES (?, ?, ?, ?, ?, 0);
  `, [
    'mission-today',
    DEMO_USER_PROFILE.id,
    todayStr,
    42,
    JSON.stringify([
      { id: 'task-1', title: 'Solve 5 Material Balance & Pump Sizing questions', durationMinutes: 15, category: 'practice', completed: true, xpReward: 100 },
      { id: 'task-2', title: 'Review Reliance Industries interview case study: Centrifugal Cavitation', durationMinutes: 8, category: 'case_study', completed: true, xpReward: 60 },
      { id: 'task-3', title: 'Record 1 STAR-L interview answer on Fluid Mechanics', durationMinutes: 5, category: 'voice_record', completed: false, xpReward: 120 },
      { id: 'task-4', title: 'Improve 1 resume bullet in Resume Bullet Lab', durationMinutes: 5, category: 'resume', completed: false, xpReward: 50 },
      { id: 'task-5', title: 'Review yesterday’s mistake: Throttling Suction vs Discharge', durationMinutes: 4, category: 'mistake_review', completed: false, xpReward: 40 },
    ]),
  ]);

  // Seed Initial Roadmap Plan
  db.run(`
    INSERT INTO roadmaps (
      id, user_id, title, target_company, branch, total_weeks, milestones_json, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
  `, [
    'roadmap-alex',
    DEMO_USER_PROFILE.id,
    'Reliance GET 10-Week Placement Blueprint',
    'Reliance Industries Limited',
    'Chemical Engineering',
    10,
    JSON.stringify(DEFAULT_ROADMAP_MILESTONES),
    now,
    now,
  ]);

  persistDb();
  return db;
}

// ==================== USER REPOSITORY ====================

export async function getUserByLoginId(loginIdOrEmail: string) {
  const db = await getDb();
  const res = db.exec(`SELECT * FROM users WHERE login_id = ? OR email = ? LIMIT 1;`, [
    loginIdOrEmail,
    loginIdOrEmail,
  ]);

  if (res.length === 0 || res[0].values.length === 0) return null;
  const cols = res[0].columns;
  const row = res[0].values[0];

  const userObj: any = {};
  cols.forEach((col, i) => {
    userObj[col] = row[i];
  });

  return userObj;
}

export async function getUserById(id: string): Promise<UserProfile | null> {
  const db = await getDb();
  const res = db.exec(`SELECT * FROM users WHERE id = ? LIMIT 1;`, [id]);

  if (res.length === 0 || res[0].values.length === 0) return null;
  const cols = res[0].columns;
  const row = res[0].values[0];

  const obj: any = {};
  cols.forEach((col, i) => {
    obj[col] = row[i];
  });

  return {
    id: obj.id,
    loginId: obj.login_id,
    name: obj.name,
    email: obj.email,
    role: obj.role,
    college: obj.college || '',
    degree: obj.degree || '',
    branch: obj.branch || 'Chemical Engineering',
    year: obj.year || 4,
    semester: obj.semester || 7,
    cgpa: obj.cgpa || 8.0,
    targetGraduationYear: obj.target_graduation_year || 2027,
    preferredRole: obj.preferred_role || '',
    targetIndustries: ['Petrochemicals', 'Energy', 'Manufacturing'],
    targetCompanies: JSON.parse(obj.target_companies_json || '[]'),
    currentSkills: JSON.parse(obj.current_skills_json || '[]'),
    programmingLanguages: JSON.parse(obj.programming_languages_json || '[]'),
    softwareTools: JSON.parse(obj.software_tools_json || '[]'),
    communicationConfidence: obj.communication_confidence || 7,
    interviewConfidence: obj.interview_confidence || 7,
    dailyStudyTimeMinutes: obj.daily_study_time_minutes || 45,
    placementTimelineDays: obj.placement_timeline_days || 40,
    streakDays: obj.streak_days || 7,
    xp: obj.xp || 1450,
    level: obj.level || 4,
    badges: JSON.parse(obj.badges_json || '[]'),
    isDemoUser: obj.login_id === 'alex_student',
  };
}

export async function createUser(data: {
  loginId: string;
  email: string;
  password: string;
  name: string;
  branch: string;
  college?: string;
  degree?: string;
  targetCompany?: string;
}): Promise<UserProfile> {
  const db = await getDb();
  const id = `user-${Date.now()}`;
  const now = new Date().toISOString();
  const passwordHash = bcrypt.hashSync(data.password, 10);

  const initialCompanies = data.targetCompany ? [data.targetCompany] : ['Reliance Industries Limited'];
  const initialSkills = [
    { name: 'Core Engineering Fundamentals', level: 75, category: 'Core' },
    { name: 'Unit Operations & Sizing', level: 70, category: 'Technical' },
    { name: 'Communication & STAR-L', level: 65, category: 'Interview' },
  ];

  db.run(`
    INSERT INTO users (
      id, login_id, email, password_hash, name, role, college, degree, branch,
      year, semester, cgpa, target_graduation_year, preferred_role,
      target_companies_json, current_skills_json, programming_languages_json,
      software_tools_json, communication_confidence, interview_confidence,
      daily_study_time_minutes, placement_timeline_days, streak_days, xp, level,
      badges_json, created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, 'student', ?, ?, ?,
      4, 7, 8.2, 2027, 'Graduate Engineer Trainee',
      ?, ?, '["Python"]',
      '["AutoCAD", "Excel"]', 7, 7,
      45, 45, 1, 250, 1,
      '[]', ?, ?
    );
  `, [
    id,
    data.loginId,
    data.email,
    passwordHash,
    data.name,
    data.college || 'Engineering Institute',
    data.degree || 'B.Tech',
    data.branch,
    JSON.stringify(initialCompanies),
    JSON.stringify(initialSkills),
    now,
    now,
  ]);

  // Create personal initial roadmap for user
  db.run(`
    INSERT INTO roadmaps (
      id, user_id, title, target_company, branch, total_weeks, milestones_json, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
  `, [
    `roadmap-${id}`,
    id,
    `${initialCompanies[0]} 10-Week Placement Blueprint`,
    initialCompanies[0],
    data.branch,
    10,
    JSON.stringify(DEFAULT_ROADMAP_MILESTONES),
    now,
    now,
  ]);

  // Create personal daily mission for user
  const todayStr = new Date().toISOString().split('T')[0];
  db.run(`
    INSERT INTO daily_missions (
      id, user_id, date, total_minutes, tasks_json, all_completed
    ) VALUES (?, ?, ?, ?, ?, 0);
  `, [
    `mission-${id}`,
    id,
    todayStr,
    42,
    JSON.stringify([
      { id: 't1', title: `Review ${data.branch} core formula assumptions`, durationMinutes: 15, category: 'practice', completed: false, xpReward: 100 },
      { id: 't2', title: `Explore ${initialCompanies[0]} Skill Radar in Company War Room`, durationMinutes: 10, category: 'case_study', completed: false, xpReward: 60 },
      { id: 't3', title: 'Record first STAR-L voice mock interview', durationMinutes: 8, category: 'voice_record', completed: false, xpReward: 120 },
      { id: 't4', title: 'Improve 1 resume bullet in Resume Bullet Lab', durationMinutes: 5, category: 'resume', completed: false, xpReward: 50 },
    ]),
  ]);

  persistDb();
  const created = await getUserById(id);
  if (!created) throw new Error('User creation failed');
  return created;
}

export async function updateUser(id: string, updates: Partial<UserProfile>): Promise<UserProfile> {
  const db = await getDb();
  const now = new Date().toISOString();

  const current = await getUserById(id);
  if (!current) throw new Error('User not found');

  db.run(`
    UPDATE users SET
      name = COALESCE(?, name),
      college = COALESCE(?, college),
      degree = COALESCE(?, degree),
      branch = COALESCE(?, branch),
      year = COALESCE(?, year),
      semester = COALESCE(?, semester),
      cgpa = COALESCE(?, cgpa),
      preferred_role = COALESCE(?, preferred_role),
      target_companies_json = COALESCE(?, target_companies_json),
      current_skills_json = COALESCE(?, current_skills_json),
      communication_confidence = COALESCE(?, communication_confidence),
      interview_confidence = COALESCE(?, interview_confidence),
      daily_study_time_minutes = COALESCE(?, daily_study_time_minutes),
      streak_days = COALESCE(?, streak_days),
      xp = COALESCE(?, xp),
      level = COALESCE(?, level),
      updated_at = ?
    WHERE id = ?;
  `, [
    updates.name || null,
    updates.college || null,
    updates.degree || null,
    updates.branch || null,
    updates.year || null,
    updates.semester || null,
    updates.cgpa || null,
    updates.preferredRole || null,
    updates.targetCompanies ? JSON.stringify(updates.targetCompanies) : null,
    updates.currentSkills ? JSON.stringify(updates.currentSkills) : null,
    updates.communicationConfidence || null,
    updates.interviewConfidence || null,
    updates.dailyStudyTimeMinutes || null,
    updates.streakDays || null,
    updates.xp || null,
    updates.level || null,
    now,
    id,
  ]);

  persistDb();
  const updated = await getUserById(id);
  if (!updated) throw new Error('Update failed');
  return updated;
}

// ==================== PROOFS REPOSITORY ====================

export async function getProofsByUserId(userId: string): Promise<ProjectEvidence[]> {
  const db = await getDb();
  const res = db.exec(`SELECT * FROM proofs WHERE user_id = ? ORDER BY created_at DESC;`, [userId]);
  if (res.length === 0) return [];

  const cols = res[0].columns;
  return res[0].values.map((row) => {
    const o: any = {};
    cols.forEach((col, i) => (o[col] = row[i]));
    return {
      id: o.id,
      title: o.title,
      skill: o.skill,
      branch: o.branch,
      problemStatement: o.problem_statement || '',
      engineeringApproach: o.engineering_approach || '',
      toolsUsed: JSON.parse(o.tools_used_json || '[]'),
      technicalExplanation: o.technical_explanation || '',
      quantifiableImpact: o.quantifiable_impact || '',
      lessonsLearned: o.lessons_learned || '',
      githubUrl: o.github_url || undefined,
      liveDemoUrl: o.live_demo_url || undefined,
      cadOrSimulationNotes: o.cad_notes || undefined,
      bomItems: JSON.parse(o.bom_items_json || '[]'),
      evidenceScore: JSON.parse(o.evidence_score_json || 'null'),
      isPublic: Boolean(o.is_public),
      createdAt: o.created_at,
    };
  });
}

export async function insertProof(userId: string, proof: Partial<ProjectEvidence>): Promise<ProjectEvidence> {
  const db = await getDb();
  const id = `proj-${Date.now()}`;
  const now = new Date().toISOString().split('T')[0];

  db.run(`
    INSERT INTO proofs (
      id, user_id, title, skill, branch, problem_statement,
      engineering_approach, tools_used_json, technical_explanation,
      quantifiable_impact, lessons_learned, github_url, live_demo_url,
      cad_notes, bom_items_json, evidence_score_json, is_public, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?);
  `, [
    id,
    userId,
    proof.title || 'Untitled Project',
    proof.skill || 'Core Engineering',
    proof.branch || 'Chemical Engineering',
    proof.problemStatement || '',
    proof.engineeringApproach || '',
    JSON.stringify(proof.toolsUsed || []),
    proof.technicalExplanation || '',
    proof.quantifiableImpact || '',
    proof.lessonsLearned || '',
    proof.githubUrl || null,
    proof.liveDemoUrl || null,
    proof.cadOrSimulationNotes || null,
    JSON.stringify(proof.bomItems || []),
    JSON.stringify(proof.evidenceScore || null),
    now,
  ]);

  persistDb();

  return {
    id,
    title: proof.title || '',
    skill: proof.skill || '',
    branch: proof.branch as any,
    problemStatement: proof.problemStatement || '',
    engineeringApproach: proof.engineeringApproach || '',
    toolsUsed: proof.toolsUsed || [],
    technicalExplanation: proof.technicalExplanation || '',
    quantifiableImpact: proof.quantifiableImpact || '',
    lessonsLearned: proof.lessonsLearned || '',
    githubUrl: proof.githubUrl,
    liveDemoUrl: proof.liveDemoUrl,
    cadOrSimulationNotes: proof.cadOrSimulationNotes,
    bomItems: proof.bomItems || [],
    evidenceScore: proof.evidenceScore,
    isPublic: true,
    createdAt: now,
  };
}

export async function deleteProofById(id: string): Promise<boolean> {
  const db = await getDb();
  db.run(`DELETE FROM proofs WHERE id = ?;`, [id]);
  persistDb();
  return true;
}

// ==================== MISTAKES REPOSITORY ====================

export async function getMistakesByUserId(userId: string): Promise<MistakeRecord[]> {
  const db = await getDb();
  const res = db.exec(`SELECT * FROM mistakes WHERE user_id = ? ORDER BY date_logged DESC;`, [userId]);
  if (res.length === 0) return [];

  const cols = res[0].columns;
  return res[0].values.map((row) => {
    const o: any = {};
    cols.forEach((col, i) => (o[col] = row[i]));
    return {
      id: o.id,
      questionOrProblem: o.question_or_problem,
      studentAnswer: o.student_answer || '',
      whatWentWrong: o.what_went_wrong || '',
      correctConcept: o.correct_concept || '',
      improvedAnswer: o.improved_answer || '',
      category: o.category || 'Assumptions',
      branch: o.branch,
      repeatStatus: o.repeat_status || 'First Time',
      dateLogged: o.date_logged,
    };
  });
}

export async function insertMistake(userId: string, mistake: Partial<MistakeRecord>): Promise<MistakeRecord> {
  const db = await getDb();
  const id = `mistake-${Date.now()}`;
  const now = new Date().toISOString().split('T')[0];

  db.run(`
    INSERT INTO mistakes (
      id, user_id, question_or_problem, student_answer, what_went_wrong,
      correct_concept, improved_answer, category, branch, repeat_status, date_logged
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `, [
    id,
    userId,
    mistake.questionOrProblem || '',
    mistake.studentAnswer || '',
    mistake.whatWentWrong || '',
    mistake.correctConcept || '',
    mistake.improvedAnswer || '',
    mistake.category || 'Assumptions',
    mistake.branch || 'Chemical Engineering',
    mistake.repeatStatus || 'First Time',
    now,
  ]);

  persistDb();

  return {
    id,
    questionOrProblem: mistake.questionOrProblem || '',
    studentAnswer: mistake.studentAnswer || '',
    whatWentWrong: mistake.whatWentWrong || '',
    correctConcept: mistake.correctConcept || '',
    improvedAnswer: mistake.improvedAnswer || '',
    category: mistake.category as any,
    branch: mistake.branch as any,
    repeatStatus: mistake.repeatStatus as any,
    dateLogged: now,
  };
}

export async function deleteMistakeById(id: string): Promise<boolean> {
  const db = await getDb();
  db.run(`DELETE FROM mistakes WHERE id = ?;`, [id]);
  persistDb();
  return true;
}

// ==================== DAILY MISSIONS REPOSITORY ====================

export async function getDailyMissionByUserId(userId: string): Promise<DailyMission> {
  const db = await getDb();
  const todayStr = new Date().toISOString().split('T')[0];

  const res = db.exec(`SELECT * FROM daily_missions WHERE user_id = ? AND date = ? LIMIT 1;`, [userId, todayStr]);
  if (res.length > 0 && res[0].values.length > 0) {
    const cols = res[0].columns;
    const row = res[0].values[0];
    const o: any = {};
    cols.forEach((col, i) => (o[col] = row[i]));
    return {
      id: o.id,
      date: o.date,
      totalMinutes: o.total_minutes,
      tasks: JSON.parse(o.tasks_json || '[]'),
      allCompleted: Boolean(o.all_completed),
    };
  }

  // Fallback to most recent mission or generate
  const fallbackRes = db.exec(`SELECT * FROM daily_missions WHERE user_id = ? ORDER BY date DESC LIMIT 1;`, [userId]);
  if (fallbackRes.length > 0 && fallbackRes[0].values.length > 0) {
    const cols = fallbackRes[0].columns;
    const row = fallbackRes[0].values[0];
    const o: any = {};
    cols.forEach((col, i) => (o[col] = row[i]));
    return {
      id: o.id,
      date: todayStr,
      totalMinutes: o.total_minutes,
      tasks: JSON.parse(o.tasks_json || '[]'),
      allCompleted: Boolean(o.all_completed),
    };
  }

  // Default tasks
  const defaultMission: DailyMission = {
    id: `mission-${userId}`,
    date: todayStr,
    totalMinutes: 42,
    allCompleted: false,
    tasks: [
      { id: 'task-1', title: 'Solve 5 Material Balance & Pump Sizing questions', durationMinutes: 15, category: 'practice', completed: true, xpReward: 100 },
      { id: 'task-2', title: 'Review Reliance Industries interview case study: Centrifugal Cavitation', durationMinutes: 8, category: 'case_study', completed: true, xpReward: 60 },
      { id: 'task-3', title: 'Record 1 STAR-L interview answer on Fluid Mechanics', durationMinutes: 5, category: 'voice_record', completed: false, xpReward: 120 },
      { id: 'task-4', title: 'Improve 1 resume bullet in Resume Bullet Lab', durationMinutes: 5, category: 'resume', completed: false, xpReward: 50 },
      { id: 'task-5', title: 'Review yesterday’s mistake: Throttling Suction vs Discharge', durationMinutes: 4, category: 'mistake_review', completed: false, xpReward: 40 },
    ],
  };

  db.run(`
    INSERT INTO daily_missions (id, user_id, date, total_minutes, tasks_json, all_completed)
    VALUES (?, ?, ?, ?, ?, 0);
  `, [defaultMission.id, userId, todayStr, defaultMission.totalMinutes, JSON.stringify(defaultMission.tasks)]);
  persistDb();

  return defaultMission;
}

export async function toggleMissionTaskDb(userId: string, taskId: string): Promise<{ mission: DailyMission; user: UserProfile }> {
  const db = await getDb();
  const currentMission = await getDailyMissionByUserId(userId);
  const user = await getUserById(userId);
  if (!user) throw new Error('User not found');

  const task = currentMission.tasks.find((t) => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
    if (task.completed) {
      user.xp += task.xpReward;
      if (user.xp >= user.level * 500) {
        user.level += 1;
      }
    }
  }

  currentMission.allCompleted = currentMission.tasks.every((t) => t.completed);

  db.run(`
    UPDATE daily_missions SET tasks_json = ?, all_completed = ? WHERE id = ?;
  `, [JSON.stringify(currentMission.tasks), currentMission.allCompleted ? 1 : 0, currentMission.id]);

  db.run(`
    UPDATE users SET xp = ?, level = ? WHERE id = ?;
  `, [user.xp, user.level, user.id]);

  persistDb();

  return { mission: currentMission, user };
}

// ==================== ROADMAP REPOSITORY ====================

export async function getRoadmapByUserId(userId: string): Promise<RoadmapPlan> {
  const db = await getDb();
  const res = db.exec(`SELECT * FROM roadmaps WHERE user_id = ? ORDER BY created_at DESC LIMIT 1;`, [userId]);

  if (res.length > 0 && res[0].values.length > 0) {
    const cols = res[0].columns;
    const row = res[0].values[0];
    const o: any = {};
    cols.forEach((col, i) => (o[col] = row[i]));

    return {
      id: o.id,
      userId: o.user_id,
      title: o.title,
      targetCompany: o.target_company,
      branch: o.branch,
      totalWeeks: o.total_weeks,
      milestones: JSON.parse(o.milestones_json || '[]'),
      createdAt: o.created_at,
      updatedAt: o.updated_at,
    };
  }

  // Fallback to default roadmap
  const user = await getUserById(userId);
  const targetCompany = user?.targetCompanies?.[0] || 'Reliance Industries Limited';
  const branch = user?.branch || 'Chemical Engineering';

  const defaultRoadmap: RoadmapPlan = {
    id: `roadmap-${userId}`,
    userId,
    title: `${targetCompany} Placement Blueprint`,
    targetCompany,
    branch,
    totalWeeks: 10,
    milestones: DEFAULT_ROADMAP_MILESTONES,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.run(`
    INSERT INTO roadmaps (id, user_id, title, target_company, branch, total_weeks, milestones_json, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
  `, [
    defaultRoadmap.id,
    userId,
    defaultRoadmap.title,
    defaultRoadmap.targetCompany,
    defaultRoadmap.branch,
    defaultRoadmap.totalWeeks,
    JSON.stringify(defaultRoadmap.milestones),
    defaultRoadmap.createdAt,
    defaultRoadmap.updatedAt,
  ]);

  persistDb();
  return defaultRoadmap;
}

export async function toggleMilestoneDb(userId: string, milestoneId: string): Promise<RoadmapPlan> {
  const db = await getDb();
  const roadmap = await getRoadmapByUserId(userId);

  const milestone = roadmap.milestones.find((m) => m.id === milestoneId);
  if (milestone) {
    milestone.completed = !milestone.completed;
  }
  roadmap.updatedAt = new Date().toISOString();

  db.run(`
    UPDATE roadmaps SET milestones_json = ?, updated_at = ? WHERE id = ?;
  `, [JSON.stringify(roadmap.milestones), roadmap.updatedAt, roadmap.id]);

  persistDb();
  return roadmap;
}

export async function updateRoadmapMilestonesDb(userId: string, milestones: RoadmapMilestone[]): Promise<RoadmapPlan> {
  const db = await getDb();
  const roadmap = await getRoadmapByUserId(userId);
  roadmap.milestones = milestones;
  roadmap.updatedAt = new Date().toISOString();

  db.run(`
    UPDATE roadmaps SET milestones_json = ?, updated_at = ? WHERE id = ?;
  `, [JSON.stringify(milestones), roadmap.updatedAt, roadmap.id]);

  persistDb();
  return roadmap;
}

// ==================== COMPANIES REPOSITORY ====================

export async function getAllCompanies(): Promise<Company[]> {
  const db = await getDb();
  const res = db.exec(`SELECT * FROM companies ORDER BY name ASC;`);
  if (res.length === 0) return [];

  const cols = res[0].columns;
  return res[0].values.map((row) => {
    const o: any = {};
    cols.forEach((col, i) => (o[col] = row[i]));
    return {
      id: o.id,
      name: o.name,
      logo: o.logo,
      category: o.category,
      industry: o.industry,
      majorBusinessAreas: JSON.parse(o.major_business_areas_json || '[]'),
      relevantRoles: JSON.parse(o.relevant_roles_json || '[]'),
      relevantBranches: JSON.parse(o.relevant_branches_json || '[]'),
      frequentlyRequestedSkills: JSON.parse(o.frequently_requested_skills_json || '[]'),
      typicalAssessmentStages: JSON.parse(o.typical_assessment_stages_json || '[]'),
      technicalAreas: JSON.parse(o.technical_areas_json || '[]'),
      behavioralAreas: JSON.parse(o.behavioral_areas_json || '[]'),
      examplePreparationTopics: JSON.parse(o.example_preparation_topics_json || '[]'),
      officialCareersUrl: o.official_careers_url,
      officialEngineeringBlogUrl: o.official_engineering_blog_url,
      lastVerifiedDate: o.last_verified_date,
      sourceReference: o.source_reference,
      hiringDifficulty: o.hiring_difficulty,
      reverseAuditPrompt: o.reverse_audit_prompt,
    };
  });
}

export async function verifyCompanyDb(id: string): Promise<Company | null> {
  const db = await getDb();
  const todayStr = new Date().toISOString().split('T')[0];
  db.run(`UPDATE companies SET last_verified_date = ? WHERE id = ?;`, [todayStr, id]);
  persistDb();
  const all = await getAllCompanies();
  return all.find((c) => c.id === id) || null;
}

export async function insertCompanyDb(companyData: Partial<Company>): Promise<Company> {
  const db = await getDb();
  const id = companyData.id || `company-${Date.now()}`;
  const todayStr = new Date().toISOString().split('T')[0];

  db.run(`
    INSERT INTO companies (
      id, name, logo, category, industry,
      major_business_areas_json, relevant_roles_json, relevant_branches_json,
      frequently_requested_skills_json, typical_assessment_stages_json,
      technical_areas_json, behavioral_areas_json, example_preparation_topics_json,
      official_careers_url, official_engineering_blog_url, last_verified_date,
      source_reference, hiring_difficulty, reverse_audit_prompt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `, [
    id,
    companyData.name || 'New Recruiter',
    companyData.logo || '🏢',
    companyData.category || 'Core Engineering',
    companyData.industry || 'Manufacturing',
    JSON.stringify(companyData.majorBusinessAreas || ['Operations']),
    JSON.stringify(companyData.relevantRoles || ['Graduate Engineer Trainee']),
    JSON.stringify(companyData.relevantBranches || ['Chemical Engineering', 'Mechanical Engineering']),
    JSON.stringify(companyData.frequentlyRequestedSkills || ['Core Fundamentals']),
    JSON.stringify(companyData.typicalAssessmentStages || ['Aptitude', 'Technical Interview']),
    JSON.stringify(companyData.technicalAreas || ['Unit Operations']),
    JSON.stringify(companyData.behavioralAreas || ['Safety Mindset']),
    JSON.stringify(companyData.examplePreparationTopics || ['Equipment Sizing']),
    companyData.officialCareersUrl || 'https://careers.example.com',
    companyData.officialEngineeringBlogUrl || '',
    todayStr,
    companyData.sourceReference || 'Verified Placement Liaison',
    companyData.hiringDifficulty || 'Challenging',
    companyData.reverseAuditPrompt || 'Audit process operations for bottlenecks.',
  ]);

  persistDb();
  const all = await getAllCompanies();
  return all.find((c) => c.id === id)!;
}

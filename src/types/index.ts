export type EngineeringBranch =
  | 'Chemical Engineering'
  | 'Mechanical Engineering'
  | 'Electrical Engineering'
  | 'Electronics & Communication Engineering'
  | 'Computer Science Engineering'
  | 'Information Technology'
  | 'Civil Engineering'
  | 'Biotechnology'
  | 'Instrumentation Engineering'
  | 'Aerospace Engineering';

export type UserRole = 'student' | 'admin';

export interface UserProfile {
  id: string;
  loginId?: string;
  name: string;
  email: string;
  role: UserRole;
  college: string;
  degree: string;
  branch: EngineeringBranch;
  year: number; // 1 - 4
  semester: number; // 1 - 8
  cgpa: number;
  targetGraduationYear: number;
  preferredRole: string;
  targetIndustries: string[];
  targetCompanies: string[];
  currentSkills: { name: string; level: number; category: string }[];
  programmingLanguages: string[];
  softwareTools: string[];
  communicationConfidence: number; // 1 - 10
  interviewConfidence: number; // 1 - 10
  dailyStudyTimeMinutes: number;
  placementTimelineDays: number;
  streakDays: number;
  xp: number;
  level: number;
  badges: Badge[];
  isDemoUser?: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  category: 'streak' | 'proof' | 'interview' | 'core' | 'assessment';
}

export interface ReadinessDimension {
  dimension: string;
  score: number; // 0 - 100
  benchmark: number;
  weight: number;
  recentChange: number; // e.g. +6
  explanation: string;
}

export interface OverallReadiness {
  totalScore: number; // 0 - 100
  dimensions: ReadinessDimension[];
  weakestSkill: string;
  strongestSkill: string;
  statusLabel: 'Needs Focus' | 'Building Foundation' | 'Interview Ready' | 'Top Tier Candidate';
}

export interface DailyMissionTask {
  id: string;
  title: string;
  durationMinutes: number;
  category: 'practice' | 'case_study' | 'voice_record' | 'resume' | 'mistake_review' | 'proof';
  completed: boolean;
  xpReward: number;
  actionUrl?: string;
}

export interface DailyMission {
  id: string;
  date: string;
  totalMinutes: number;
  tasks: DailyMissionTask[];
  allCompleted: boolean;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  category: 'Core Engineering' | 'Software / Technology' | 'Consulting / Analytics';
  industry: string;
  majorBusinessAreas: string[];
  relevantRoles: string[];
  relevantBranches: EngineeringBranch[];
  frequentlyRequestedSkills: string[];
  typicalAssessmentStages: string[];
  technicalAreas: string[];
  behavioralAreas: string[];
  examplePreparationTopics: string[];
  officialCareersUrl: string;
  officialEngineeringBlogUrl?: string;
  lastVerifiedDate: string;
  sourceReference: string;
  hiringDifficulty: 'Moderate' | 'Challenging' | 'Elite';
  reverseAuditPrompt: string;
}

export interface InterviewQuestion {
  id: string;
  companyId?: string;
  companyName?: string;
  branch?: EngineeringBranch;
  skill: string;
  category: 'Technical' | 'Core Engineering' | 'Behavioral' | 'Case Study' | 'Situational';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  question: string;
  contextOrScenario?: string;
  idealAnswerPoints: string[];
  commonMistakes: string[];
  starGuide?: {
    situation: string;
    task: string;
    action: string;
    result: string;
    learning: string;
  };
}

export interface StarFeedback {
  situationPresent: boolean;
  taskPresent: boolean;
  actionPresent: boolean;
  resultPresent: boolean;
  learningPresent: boolean;
  situationNotes: string;
  taskNotes: string;
  actionNotes: string;
  resultNotes: string;
  learningNotes: string;
}

export interface VoiceInterviewEvaluation {
  durationSeconds: number;
  speakingPaceWpm: number;
  fillerWordCount: number;
  fillerWordsFound: { word: string; count: number }[];
  starFeedback: StarFeedback;
  technicalAccuracyScore: number; // 0 - 100
  clarityScore: number; // 0 - 100
  overallScore: number; // 0 - 100
  keyStrengths: string[];
  priorityFixes: string[];
  improvedAnswerSample: string;
}

export interface ProjectEvidence {
  id: string;
  title: string;
  skill: string;
  branch: EngineeringBranch;
  problemStatement: string;
  engineeringApproach: string;
  toolsUsed: string[];
  technicalExplanation: string;
  quantifiableImpact: string;
  lessonsLearned: string;
  githubUrl?: string;
  liveDemoUrl?: string;
  cadOrSimulationNotes?: string;
  bomItems?: BomItem[];
  evidenceScore?: {
    technicalDepth: number;
    practicality: number;
    documentation: number;
    quantifiableResults: number;
    reproducibility: number;
    overall: number;
    aiCritique: string;
    suggestedEnhancement: string;
  };
  createdAt: string;
  isPublic: boolean;
}

export interface BomItem {
  id: string;
  component: string;
  quantity: number;
  unitCost: number;
  supplier: string;
  alternativeComponent?: string;
  reasonSelected: string;
}

export interface MistakeRecord {
  id: string;
  questionOrProblem: string;
  studentAnswer: string;
  whatWentWrong: string;
  correctConcept: string;
  improvedAnswer: string;
  category: 'Technical' | 'Calculation' | 'Assumptions' | 'Communication' | 'Core Concept' | 'Coding';
  branch: EngineeringBranch;
  repeatStatus: 'First Time' | 'Repeated Once' | 'Mastered Now';
  dateLogged: string;
}

export interface ResumeBulletEvaluation {
  originalBullet: string;
  improvedVersions: {
    framework: string;
    text: string;
    strengths: string;
  }[];
  missingInformationQuestions: string[];
  metricsIdentified: string[];
  actionVerbStrength: 'Weak' | 'Medium' | 'Power Verb';
}

export interface ReverseAudit {
  id: string;
  companyName: string;
  productOrProcess: string;
  currentWorkflow: string;
  identifiedBottleneck: string;
  rootCauseAnalysis: string;
  proposedSolution: string;
  estimatedEngineeringImpact: string;
  tradeOffsAndRisks: string;
  implementationPhases: { phase: string; duration: string; deliverable: string }[];
  dateCreated: string;
}

export interface CompanyPrepPlan {
  companyName: string;
  targetRole: string;
  first30Days: { theme: string; items: string[] };
  days31To60: { theme: string; items: string[] };
  days61To90: { theme: string; items: string[] };
  days91To100: { theme: string; items: string[] };
}

export interface AlumniProfile {
  id: string;
  name: string;
  company: string;
  role: string;
  branch: EngineeringBranch;
  batchYear: number;
  topAdvice: string;
  keySkillFirst6Months: string;
  whatSurprisedInInterview: string;
  linkedInUrl?: string;
}

export interface DailyFeedCard {
  id: string;
  type: 'concept' | 'interview_question' | 'industry_insight' | 'project_challenge' | 'mistake_warning';
  title: string;
  tag: string;
  readTime: string;
  content: string;
  actionText?: string;
  actionPayload?: string;
}

export type TimelinePhase =
  | 'T-90 Days (Foundations)'
  | 'T-60 Days (Core Mastery)'
  | 'T-30 Days (Company Specifics)'
  | 'T-14 Days (Mock Interrogation)'
  | 'T-7 Days (Fine Tuning)'
  | 'T-1 Day (Final Calm)'
  | 'Interview Day (Execution)';

export interface RoadmapMilestone {
  id: string;
  phase: TimelinePhase;
  weekNumber: number;
  title: string;
  category: 'Core Engineering' | 'Company Intelligence' | 'Proof Building' | 'Mock Interviews' | 'Behavioral & STAR-L';
  description: string;
  deliverable: string;
  recommendedTimeHours: number;
  completed: boolean;
  priority: 'Critical' | 'High' | 'Medium';
}

export interface RoadmapPlan {
  id: string;
  userId: string;
  title: string;
  targetCompany: string;
  branch: EngineeringBranch;
  totalWeeks: number;
  milestones: RoadmapMilestone[];
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  loginId: string;
  password: string;
}

export interface RegisterData {
  loginId: string;
  password: string;
  name: string;
  email: string;
  branch: EngineeringBranch;
  college: string;
  degree: string;
  targetCompany?: string;
}


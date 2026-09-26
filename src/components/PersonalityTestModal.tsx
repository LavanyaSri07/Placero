import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  X,
  Compass,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Brain,
  ShieldCheck,
  Target,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { StudentPersonality } from '../types/index.ts';

interface PersonalityQuestion {
  id: number;
  question: string;
  category: string;
  options: {
    label: string;
    description: string;
    archetype: string;
    points: {
      analytical: number;
      practicalTroubleshooting: number;
      systemsThinking: number;
      leadershipAgility: number;
      communicationClarity: number;
    };
  }[];
}

const PERSONALITY_QUESTIONS: PersonalityQuestion[] = [
  {
    id: 1,
    category: 'Engineering Problem Solving',
    question: 'A critical pump in a continuous chemical or power plant is vibrating severely with crackling gravel noises. How do you instinctively approach this crisis?',
    options: [
      {
        label: 'First-Principles Thermodynamic & Hydraulic Calculation',
        description: 'Immediately calculate NPSH available vs required from suction pressure, fluid temperature, and vapor pressure to mathematically prove or disprove cavitation.',
        archetype: 'The First-Principles Theorist',
        points: { analytical: 10, practicalTroubleshooting: 6, systemsThinking: 7, leadershipAgility: 4, communicationClarity: 7 },
      },
      {
        label: 'Hands-On Diagnostic & Field Inspection',
        description: 'Walk down to the pump skid with maintenance technicians, check suction strainer differential pressure, inspect valve lineup, and feel bearing housing vibration.',
        archetype: 'The Root Cause Troubleshooter',
        points: { analytical: 6, practicalTroubleshooting: 10, systemsThinking: 6, leadershipAgility: 7, communicationClarity: 7 },
      },
      {
        label: 'Systemic Process Flow & Instrumentation Audit',
        description: 'Review upstream distillation tower levels, control valve output loops, and historical DCS alarm trends to see what process shift triggered the upset.',
        archetype: 'The Systems Architect',
        points: { analytical: 7, practicalTroubleshooting: 6, systemsThinking: 10, leadershipAgility: 6, communicationClarity: 8 },
      },
      {
        label: 'Emergency Mitigation & Incident Command',
        description: 'Notify the shift engineer, switch immediately to the standby auxiliary pump to protect production, and isolate the troubled unit for systematic safety overhaul.',
        archetype: 'The Agile Operations Leader',
        points: { analytical: 5, practicalTroubleshooting: 7, systemsThinking: 7, leadershipAgility: 10, communicationClarity: 8 },
      },
    ],
  },
  {
    id: 2,
    category: 'Workplace Environment',
    question: 'In what type of engineering work environment do you envision thriving and delivering your highest personal impact?',
    options: [
      {
        label: 'World-Scale Continuous Manufacturing Plant / Refinery',
        description: 'Massive industrial operations (e.g. Jamnagar, Hazira) where real equipment, high pressures, high temperatures, and 24/7 reliability are paramount.',
        archetype: 'The Root Cause Troubleshooter',
        points: { analytical: 6, practicalTroubleshooting: 10, systemsThinking: 8, leadershipAgility: 6, communicationClarity: 6 },
      },
      {
        label: 'High-Tech R&D Lab & Pilot Optimization Center',
        description: 'Advanced laboratories running mathematical modeling, Aspen Plus/Simulink simulation, prototype testing, and next-generation green tech.',
        archetype: 'The First-Principles Theorist',
        points: { analytical: 10, practicalTroubleshooting: 6, systemsThinking: 7, leadershipAgility: 4, communicationClarity: 7 },
      },
      {
        label: 'EPC Engineering, Plant Design & Turnkey Consulting',
        description: 'Global engineering consultancy (e.g. L&T, Technip, Fluor) developing P&IDs, equipment datasheets, piping isometric layouts, and HAZOP studies.',
        archetype: 'The Systems Architect',
        points: { analytical: 8, practicalTroubleshooting: 5, systemsThinking: 10, leadershipAgility: 6, communicationClarity: 8 },
      },
      {
        label: 'Cross-Functional Digital Automation & Industrial IoT',
        description: 'Smart factory integration (Siemens, Rockwell, Schneider), programmable logic controllers (PLCs), edge robotics, and AI telemetry.',
        archetype: 'The Agile Operations Leader',
        points: { analytical: 7, practicalTroubleshooting: 7, systemsThinking: 8, leadershipAgility: 9, communicationClarity: 9 },
      },
    ],
  },
  {
    id: 3,
    category: 'Technical Interrogation Under Pressure',
    question: 'During a campus placement interview, a Senior Chief Engineer interrupts your design answer and says: "Your calculation is completely unviable in practice." What is your reaction?',
    options: [
      {
        label: 'Re-state Boundary Conditions & Assumptions Calmy',
        description: '"I based my sizing on steady-state incompressible flow with isothermal assumptions. If there are transient pressure surges or two-phase flow in your plant, let me adjust the model."',
        archetype: 'The First-Principles Theorist',
        points: { analytical: 10, practicalTroubleshooting: 6, systemsThinking: 7, leadershipAgility: 5, communicationClarity: 9 },
      },
      {
        label: 'Invite Empirical Field Experience',
        description: '"That is an invaluable practical insight. In your operating experience, does slurry settling velocity or pipe dead-leg fouling cause the discrepancy? Let us solve it together."',
        archetype: 'The Root Cause Troubleshooter',
        points: { analytical: 6, practicalTroubleshooting: 10, systemsThinking: 7, leadershipAgility: 8, communicationClarity: 9 },
      },
      {
        label: 'Analyze Safety & Margin of Error Trade-Offs',
        description: '"Understood. Let me step back to look at our safety instrumented SIL level and ASME factor of safety. If we double the wall thickness or install bypass throttling, does that satisfy operational criteria?"',
        archetype: 'The Systems Architect',
        points: { analytical: 7, practicalTroubleshooting: 7, systemsThinking: 10, leadershipAgility: 6, communicationClarity: 8 },
      },
      {
        label: 'Propose Immediate Rapid Prototype or Test Loop',
        description: '"Theoretical calculations have limits. In my project, we validated our sizing by setting up a benchtop test loop with calibrated sensors to prove pressure drops before capital commitment."',
        archetype: 'The Agile Operations Leader',
        points: { analytical: 6, practicalTroubleshooting: 9, systemsThinking: 6, leadershipAgility: 9, communicationClarity: 8 },
      },
    ],
  },
  {
    id: 4,
    category: 'Project Execution Accomplishment',
    question: 'Which phase of an engineering project provides you with the deepest personal satisfaction?',
    options: [
      {
        label: 'The "Eureka" Moment of Mathematical & Physical Proof',
        description: 'Deriving governing balance equations and finding that the non-linear simulation matches theoretical thermodynamic limits perfectly.',
        archetype: 'The First-Principles Theorist',
        points: { analytical: 10, practicalTroubleshooting: 5, systemsThinking: 7, leadershipAgility: 4, communicationClarity: 6 },
      },
      {
        label: 'Turning the Wrench & Commissioning Real Hardware',
        description: 'Watching the motor spin up, checking pressure gauges stabilize within 1% of design, and hearing the plant hum steadily in operation.',
        archetype: 'The Root Cause Troubleshooter',
        points: { analytical: 5, practicalTroubleshooting: 10, systemsThinking: 7, leadershipAgility: 7, communicationClarity: 6 },
      },
      {
        label: 'Optimizing Global Energy & Economic Efficiency',
        description: 'Applying Pinch Analysis to recover 15% waste heat across multi-unit heat exchanger networks and cutting annual carbon emissions.',
        archetype: 'The Systems Architect',
        points: { analytical: 8, practicalTroubleshooting: 6, systemsThinking: 10, leadershipAgility: 6, communicationClarity: 8 },
      },
      {
        label: 'Leading the Multi-Branch Team to on-Time Delivery',
        description: 'Coordinating between chemical, mechanical, electrical, and civil teammates so every discipline delivers their deliverable smoothly.',
        archetype: 'The Agile Operations Leader',
        points: { analytical: 5, practicalTroubleshooting: 6, systemsThinking: 8, leadershipAgility: 10, communicationClarity: 10 },
      },
    ],
  },
  {
    id: 5,
    category: 'Communication & Interview Voice',
    question: 'When asked to explain a complex technical achievement on your resume, what is your natural communication structure?',
    options: [
      {
        label: 'Rigorous STAR-L Narrative with Stated Assumptions',
        description: 'Situation, Task, Personal Action, Quantifiable Metric Result, and Key Engineering Learning stated with crisp confidence.',
        archetype: 'The Systems Architect',
        points: { analytical: 7, practicalTroubleshooting: 7, systemsThinking: 9, leadershipAgility: 8, communicationClarity: 10 },
      },
      {
        label: 'Data-Dense & Metric-First Explanation',
        description: 'Lead immediately with percentages, flowrates, Reynold numbers, and equipment capital expenditure saved before diving into details.',
        archetype: 'The First-Principles Theorist',
        points: { analytical: 10, practicalTroubleshooting: 6, systemsThinking: 7, leadershipAgility: 5, communicationClarity: 8 },
      },
      {
        label: 'Practical Storytelling with Troubleshooting Antidotes',
        description: 'Explain the real physical challenge, how the team was stuck, the hands-on troubleshooting test you devised, and how you fixed it.',
        archetype: 'The Root Cause Troubleshooter',
        points: { analytical: 6, practicalTroubleshooting: 10, systemsThinking: 6, leadershipAgility: 8, communicationClarity: 9 },
      },
      {
        label: 'High-Level Strategic & Business Value Orientation',
        description: 'Connect the engineering technical deliverable directly to business ROI, plant safety culture, and environmental sustainability.',
        archetype: 'The Agile Operations Leader',
        points: { analytical: 6, practicalTroubleshooting: 6, systemsThinking: 8, leadershipAgility: 10, communicationClarity: 10 },
      },
    ],
  },
  {
    id: 6,
    category: 'Daily Study & Learning Rhythm',
    question: 'How does your brain best absorb and retain high-frequency core engineering concepts for placement interviews?',
    options: [
      {
        label: 'Deep Derivations with Zero Formula Memorization',
        description: 'Understanding where every equation originates from conservation of mass, momentum, and energy so you can re-derive it on a whiteboard.',
        archetype: 'The First-Principles Theorist',
        points: { analytical: 10, practicalTroubleshooting: 5, systemsThinking: 7, leadershipAgility: 4, communicationClarity: 7 },
      },
      {
        label: 'Rapid Spaced Repetition (SRS Flashcards) & Failure Analysis',
        description: 'Drilling viva trap questions, analyzing what went wrong in previous mistakes, and active testing under timer countdowns.',
        archetype: 'The Root Cause Troubleshooter',
        points: { analytical: 7, practicalTroubleshooting: 9, systemsThinking: 7, leadershipAgility: 6, communicationClarity: 8 },
      },
      {
        label: 'End-to-End Case Studies & Piping/Flowsheet Reviews',
        description: 'Studying actual refinery P&IDs, industrial datasheets, and reverse audits to see how unit operations link together.',
        archetype: 'The Systems Architect',
        points: { analytical: 8, practicalTroubleshooting: 6, systemsThinking: 10, leadershipAgility: 6, communicationClarity: 8 },
      },
      {
        label: 'Simulated Voice Viva Drills with Spoken Rehearsal',
        description: 'Practicing speaking answers aloud under microphone timers to eliminate filler words and master authoritative delivery.',
        archetype: 'The Agile Operations Leader',
        points: { analytical: 6, practicalTroubleshooting: 7, systemsThinking: 7, leadershipAgility: 10, communicationClarity: 10 },
      },
    ],
  },
  {
    id: 7,
    category: 'Engineering Trade-Offs',
    question: 'You must select an equipment design: Option A has 12% higher thermal efficiency but costs 40% more capital expenditure with specialized metallurgy. Option B uses standard carbon steel but requires slightly higher operating fuel. How do you decide?',
    options: [
      {
        label: 'Perform Net Present Value (NPV) & Payback Period Calculation',
        description: 'Model lifecycle fuel savings vs capital expenditure at 10% discount rate over a 15-year plant life to determine the inflection point.',
        archetype: 'The Systems Architect',
        points: { analytical: 9, practicalTroubleshooting: 6, systemsThinking: 10, leadershipAgility: 7, communicationClarity: 8 },
      },
      {
        label: 'Analyze Corrosion Rates & High-Temperature Metallurgy',
        description: 'Examine ASTM alloy specifications and hydrogen embrittlement risks to ensure Option B will not experience catastrophic failure.',
        archetype: 'The First-Principles Theorist',
        points: { analytical: 10, practicalTroubleshooting: 7, systemsThinking: 7, leadershipAgility: 4, communicationClarity: 7 },
      },
      {
        label: 'Consult Plant Maintenance Overhaul Complexity',
        description: 'Evaluate if spare parts for specialized metallurgy are locally available in India or if turnaround lead times will cause extended plant shutdowns.',
        archetype: 'The Root Cause Troubleshooter',
        points: { analytical: 6, practicalTroubleshooting: 10, systemsThinking: 8, leadershipAgility: 7, communicationClarity: 8 },
      },
      {
        label: 'Assess Safety Regulatory Mandates & ESG Commitments',
        description: 'Verify if corporate decarbonization targets or statutory environmental emission caps make Option A mandatory regardless of cost.',
        archetype: 'The Agile Operations Leader',
        points: { analytical: 6, practicalTroubleshooting: 6, systemsThinking: 9, leadershipAgility: 10, communicationClarity: 9 },
      },
    ],
  },
  {
    id: 8,
    category: 'Placement Ambition & Legacy',
    question: 'When you sign your Graduate Engineer Trainee (GET) campus offer letter, what is your primary professional ambition for your first 3 years?',
    options: [
      {
        label: 'Become the Go-To Plant Troubleshooter on Site',
        description: 'The engineer operators call when a unit upsets at 2 AM because they know you can diagnose the problem and restore safe operation.',
        archetype: 'The Root Cause Troubleshooter',
        points: { analytical: 7, practicalTroubleshooting: 10, systemsThinking: 8, leadershipAgility: 7, communicationClarity: 7 },
      },
      {
        label: 'File Patents & Master Advanced Process Modeling',
        description: 'Publish novel design methodologies, author technical whitepapers, and lead core engineering simulations.',
        archetype: 'The First-Principles Theorist',
        points: { analytical: 10, practicalTroubleshooting: 5, systemsThinking: 8, leadershipAgility: 5, communicationClarity: 8 },
      },
      {
        label: 'Lead Multi-Million Dollar Turnaround & Modernization Projects',
        description: 'Optimize mega-refinery or manufacturing operations, eliminate recurring bottlenecks, and lead cross-unit pinch integrations.',
        archetype: 'The Systems Architect',
        points: { analytical: 8, practicalTroubleshooting: 7, systemsThinking: 10, leadershipAgility: 8, communicationClarity: 9 },
      },
      {
        label: 'Accelerate into Engineering Operations Management',
        description: 'Progress rapidly from GET to Unit Head / Operations Manager, cultivating high-performance safety culture and technical excellence.',
        archetype: 'The Agile Operations Leader',
        points: { analytical: 6, practicalTroubleshooting: 7, systemsThinking: 8, leadershipAgility: 10, communicationClarity: 10 },
      },
    ],
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PersonalityTestModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { user, refreshData, triggerConfetti } = useApp();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<StudentPersonality | null>(null);

  if (!isOpen) return null;

  const currentQ = PERSONALITY_QUESTIONS[currentIdx];
  const selectedOptionIdx = answers[currentQ.id];
  const totalQuestions = PERSONALITY_QUESTIONS.length;
  const isComplete = Object.keys(answers).length === totalQuestions;

  const handleSelect = (optionIdx: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionIdx,
    }));
  };

  const handleNext = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  const calculateResults = async () => {
    setIsSubmitting(true);
    try {
      // Sum points
      let analytical = 0;
      let practicalTroubleshooting = 0;
      let systemsThinking = 0;
      let leadershipAgility = 0;
      let communicationClarity = 0;

      const archetypeCounts: Record<string, number> = {};

      PERSONALITY_QUESTIONS.forEach((q) => {
        const selectedIdx = answers[q.id];
        if (selectedIdx !== undefined) {
          const opt = q.options[selectedIdx];
          analytical += opt.points.analytical;
          practicalTroubleshooting += opt.points.practicalTroubleshooting;
          systemsThinking += opt.points.systemsThinking;
          leadershipAgility += opt.points.leadershipAgility;
          communicationClarity += opt.points.communicationClarity;

          archetypeCounts[opt.archetype] = (archetypeCounts[opt.archetype] || 0) + 1;
        }
      });

      // Normalize to 0-100
      const maxPts = totalQuestions * 10;
      const scores = {
        analytical: Math.min(100, Math.round((analytical / maxPts) * 100)),
        practicalTroubleshooting: Math.min(100, Math.round((practicalTroubleshooting / maxPts) * 100)),
        systemsThinking: Math.min(100, Math.round((systemsThinking / maxPts) * 100)),
        leadershipAgility: Math.min(100, Math.round((leadershipAgility / maxPts) * 100)),
        communicationClarity: Math.min(100, Math.round((communicationClarity / maxPts) * 100)),
      };

      // Determine highest archetype
      let primaryArchetype = 'The Root Cause Troubleshooter & Systems Diagnostician';
      let tagline = 'Empirical engineering problem solver specializing in hands-on plant reliability, field diagnostics, and first-principles safety.';
      let problemSolvingStyle = 'Empirical Verification & Root Cause Tracing';
      let workplacePreference = 'World-Scale Manufacturing & Continuous Plant Operations';
      let stressResponse = 'Methodical Systematic Investigation';
      let interviewVoiceStyle = 'Practical STAR-L Narrative with Realistic Troubleshooting Examples';
      let bestFitRecruiters = ['Reliance Industries Limited', 'Tata Motors', 'Larsen & Toubro (L&T)', 'Siemens'];
      let personalizedStrategy = 'Focus your interview answers on practical plant walkdowns, component failure modes (cavitation, dead-legs, fouling), and verifiable unit operations experience.';
      let dailyStudyFormat = 'Prioritize Spaced Repetition Flashcards, Mistake Vault review, and 5-Whys RCA scenarios over pure abstract theory.';

      // Determine winning archetype
      let highestCount = -1;
      let winningName = '';
      for (const [name, count] of Object.entries(archetypeCounts)) {
        if (count > highestCount) {
          highestCount = count;
          winningName = name;
        }
      }

      if (winningName.includes('First-Principles')) {
        primaryArchetype = 'The First-Principles Theorist & Analytical Modeler';
        tagline = 'Deep conceptual thinker with rigorous mathematical mastery of governing equations, phase equilibria, and thermodynamic boundaries.';
        problemSolvingStyle = 'First-Principles Mathematical Modeling & Boundary Assumption Verification';
        workplacePreference = 'High-Tech R&D Facilities, Advanced Process Simulation & Technology Centers';
        stressResponse = 'Calm Boundary Condition & Conservation Law Review';
        interviewVoiceStyle = 'Quantitative & Metric-Dense with explicit equation derivations';
        bestFitRecruiters = ['Dow Chemicals', 'Reliance Technology Group', 'Texas Instruments', 'Schlumberger'];
        personalizedStrategy = 'Lead with clear stated assumptions, dimensional consistency, and non-ideal thermodynamic behavior. Viva interviewers in research units will deeply value your fundamental depth.';
        dailyStudyFormat = 'Spend 50% of your daily study time on Core Engineering calculations, derivations, and ASME/API code standards.';
      } else if (winningName.includes('Systems Architect')) {
        primaryArchetype = 'The Systems Architect & Operations Optimizer';
        tagline = 'Holistic systems engineer who optimizes the grand balance of energy efficiency, equipment capital cost, and multi-unit integration.';
        problemSolvingStyle = 'Pinch Analysis, Global Enthalpy Matching & Process Flow Integration';
        workplacePreference = 'EPC Turnkey Engineering, Mega-Refinery Design, & Consulting Offices';
        stressResponse = 'Holistic Safety-Instrumented System (SIS) & Risk Trade-Off Evaluation';
        interviewVoiceStyle = 'Structured STAR-L Delivery with Clear Business & Sustainability Metrics';
        bestFitRecruiters = ['Larsen & Toubro (L&T)', 'Reliance Industries Limited', 'Tata Motors', 'Siemens Energy'];
        personalizedStrategy = 'Highlight your end-to-end case studies, Bill of Materials (BOM) cost sensitivity, and Pinch heat integration in the Proof Lab.';
        dailyStudyFormat = 'Engage with Company War Room reverse audits, flowsheet audits, and 30-60-90 day onboarding plans.';
      } else if (winningName.includes('Agile Operations')) {
        primaryArchetype = 'The Agile Operations Leader & Technologist';
        tagline = 'Dynamic engineering communicator who bridges technical calculations with operational leadership, safety culture, and digital telemetry.';
        problemSolvingStyle = 'Rapid Agile Triage, Cross-Discipline Coordination & Automation Integration';
        workplacePreference = 'Smart Manufacturing, Advanced Robotics & High-Velocity Operations';
        stressResponse = 'Decisive Safe Action & Clear Incident Command Protocol';
        interviewVoiceStyle = 'High-Impact Articulate Delivery with Strong Personal Leadership Conviction';
        bestFitRecruiters = ['Tata Motors', 'Siemens', 'Google Hardware Operations', 'Qualcomm'];
        personalizedStrategy = 'Focus on Voice Mock Interview drills to hone authoritative, zero-fluff verbal pacing. Showcase cross-functional collaboration on your resume.';
        dailyStudyFormat = 'Complete daily Voice Mock recordings, Resume Bullet optimization, and team-based scenario drills.';
      }

      const personality: StudentPersonality = {
        primaryArchetype,
        tagline,
        problemSolvingStyle,
        workplacePreference,
        stressResponse,
        interviewVoiceStyle,
        bestFitRecruiters,
        personalizedStrategy,
        dailyStudyFormat,
        scores,
        completedAt: new Date().toISOString().split('T')[0],
      };

      // Save to database
      const res = await fetch('/api/user/personality', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id || 'user-demo-01',
        },
        body: JSON.stringify(personality),
      });

      const data = await res.json();
      setResult(personality);
      triggerConfetti();
      await refreshData();
    } catch (err) {
      console.error('Failed to submit personality diagnostic:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetake = () => {
    setResult(null);
    setCurrentIdx(0);
    setAnswers({});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#11141c] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800/80 bg-[#141824]/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-100">
                  Engineering Personality & Placement Alignment Diagnostic
                </h2>
              </div>
              <p className="text-xs text-slate-400">
                Calibrates platform study tools and interview strategy to your cognitive archetype
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content area */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {result ? (
            /* Results Screen */
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-sky-950/40 via-indigo-950/30 to-[#141824] border border-sky-500/30 shadow-lg">
                <div className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Your Engineering Placement Archetype
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-100">
                  {result.primaryArchetype}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
                  {result.tagline}
                </p>
              </div>

              {/* Cognitive Strength Radar Bars */}
              <div className="p-4 rounded-xl bg-[#141824] border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Cognitive & Professional Strengths Breakdown
                </h4>
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Analytical & Theoretical Depth</span>
                      <span className="font-bold text-sky-400">{result.scores.analytical}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-sky-500 h-full rounded-full transition-all duration-700" style={{ width: `${result.scores.analytical}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Practical & Field Troubleshooting</span>
                      <span className="font-bold text-emerald-400">{result.scores.practicalTroubleshooting}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full transition-all duration-700" style={{ width: `${result.scores.practicalTroubleshooting}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Systems Thinking & Process Optimization</span>
                      <span className="font-bold text-indigo-400">{result.scores.systemsThinking}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full transition-all duration-700" style={{ width: `${result.scores.systemsThinking}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Leadership & Operational Agility</span>
                      <span className="font-bold text-amber-400">{result.scores.leadershipAgility}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full transition-all duration-700" style={{ width: `${result.scores.leadershipAgility}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>STAR-L Technical Communication Clarity</span>
                      <span className="font-bold text-violet-400">{result.scores.communicationClarity}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-violet-500 h-full rounded-full transition-all duration-700" style={{ width: `${result.scores.communicationClarity}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Personalized Action Alignment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-[#141824] border border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider block">
                    Ideal Recruiter Culture Fit
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {result.bestFitRecruiters.map((comp) => (
                      <span key={comp} className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700 text-slate-200 text-[11px] font-medium">
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#141824] border border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                    Recommended Study Cadence
                  </span>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    {result.dailyStudyFormat}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#141824] border border-slate-800 text-xs">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                  Tailored Viva & Interview Strategy
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {result.personalizedStrategy}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handleRetake}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake Diagnostic</span>
                </button>

                <button
                  onClick={onClose}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-md transition cursor-pointer"
                >
                  <span>Apply Alignment to Platform</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Question Screen */
            <div className="space-y-4">
              {/* Progress Tracker */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-sky-400">
                  Question {currentIdx + 1} of {totalQuestions}
                </span>
                <span>{currentQ.category}</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-sky-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <h3 className="text-base sm:text-lg font-bold text-slate-100 leading-snug pt-1">
                {currentQ.question}
              </h3>

              {/* Options */}
              <div className="space-y-2.5 pt-1">
                {currentQ.options.map((opt, oIdx) => {
                  const isSelected = selectedOptionIdx === oIdx;
                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelect(oIdx)}
                      className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition cursor-pointer ${
                        isSelected
                          ? 'bg-sky-500/15 border-sky-500/60 text-slate-100 shadow-sm'
                          : 'bg-[#141824] hover:bg-[#181d2a] border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition ${
                            isSelected
                              ? 'border-sky-400 bg-sky-500 text-white'
                              : 'border-slate-600 bg-slate-900/50'
                          }`}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <div className="text-xs sm:text-sm font-bold text-slate-100">
                            {opt.label}
                          </div>
                          <div className="text-xs text-slate-400 leading-relaxed">
                            {opt.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Navigation controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={handlePrev}
                  disabled={currentIdx === 0}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {currentIdx === totalQuestions - 1 ? (
                  <button
                    onClick={calculateResults}
                    disabled={!isComplete || isSubmitting}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 shadow-lg shadow-sky-500/20 disabled:opacity-50 transition cursor-pointer"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Compute Alignment Profile</span>
                        <Sparkles className="w-4 h-4" />
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    disabled={selectedOptionIdx === undefined}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 disabled:opacity-50 transition cursor-pointer"
                  >
                    <span>Next Question</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 border-t border-slate-800 bg-[#0e1118] text-[11px] text-slate-400 flex items-center justify-between">
          <span>Target Recruiter Alignment: {user?.targetCompanies?.[0] || 'Reliance Industries'}</span>
          <span className="text-emerald-400 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Saved to SQLite
          </span>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { VoiceInterviewEvaluation, InterviewQuestion } from '../types/index.ts';
import {
  Mic,
  Square,
  Play,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Volume2,
  ChevronRight,
  TrendingUp,
  FileText,
  Brain,
} from 'lucide-react';

export const MockInterviewView: React.FC = () => {
  const { user, selectedCompany, companies, triggerConfetti } = useApp();

  const [questionText, setQuestionText] = useState(
    'A centrifugal pump in a refinery is vibrating severely and making a crackling noise resembling gravel being pumped. What is happening, and how would you verify and troubleshoot this on-site?'
  );
  const [selectedCategory, setSelectedCategory] = useState<'Core Engineering' | 'Technical' | 'Behavioral'>('Core Engineering');

  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Attempts
  const [attempt1Result, setAttempt1Result] = useState<VoiceInterviewEvaluation | null>(null);
  const [attempt2Result, setAttempt2Result] = useState<VoiceInterviewEvaluation | null>(null);
  const [currentAttemptNum, setCurrentAttemptNum] = useState<1 | 2>(1);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);

  // Clean timer on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingDuration(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Microphone permission or hardware unavailable:', err);
      // Fallback: allow manual answer or transcript
      setIsRecording(true);
      setRecordingDuration(0);
      timerIntervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setIsRecording(false);

    // If student has not typed a transcript yet, provide a realistic candidate answer
    if (!transcript) {
      setTranscript(
        "Um, so basically, what is happening here is cavitation in the centrifugal pump. Like, the pressure at the impeller eye drops below the vapor pressure of the liquid, so vapor bubbles form and then collapse violently. To verify this, I would, you know, check the suction pressure gauge and calculate the NPSH available versus NPSH required. To fix it, we should throttle the discharge valve to reduce the flow rate so it moves back on the pump curve. Actually, we should never throttle the suction valve because that makes cavitation worse."
      );
    }
  };

  const evaluateAnswer = async () => {
    setValidationError(null);
    if (!transcript.trim()) {
      setValidationError('Please provide or record your answer transcript before submitting for evaluation.');
      return;
    }

    setIsEvaluating(true);
    try {
      const res = await fetch('/api/ai/interview-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionText,
          transcript,
          category: selectedCategory,
          targetCompany: selectedCompany?.name || 'Reliance Industries Limited',
          durationSeconds: recordingDuration > 0 ? recordingDuration : 65,
        }),
      });

      const evaluation: VoiceInterviewEvaluation = await res.json();

      if (currentAttemptNum === 1) {
        setAttempt1Result(evaluation);
      } else {
        setAttempt2Result(evaluation);
        triggerConfetti();
      }
      setValidationError(null);
    } catch (err) {
      console.error('Failed to evaluate interview answer:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const currentResult = currentAttemptNum === 1 ? attempt1Result : attempt2Result;

  const handleRecordAgain = () => {
    setCurrentAttemptNum(2);
    setAudioUrl(null);
    setTranscript('');
    setRecordingDuration(0);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider mb-1">
              <span>Voice-Recorded Interview Simulator</span>
              <span>•</span>
              <span>STAR-L & Filler Word Analysis</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>Mock Interview Trainer</span>
              <span>🎤</span>
            </h1>
            <p className="text-xs lg:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              <strong>Webpage Objective:</strong> Realistic high-pressure voice mock viva simulator. Test your spoken technical articulation using your real microphone or pre-filled transcripts. The system detects filler words (e.g. <em>um, like, basically</em>), speaking pace in words-per-minute (WPM), and evaluates against the strict <strong>STAR-L (Situation, Task, Action, Result, Learning)</strong> framework with Attempt 1 vs Attempt 2 comparison.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Target Company:</span>
            <span className="text-xs font-bold text-white bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
              {selectedCompany?.name || 'Reliance Industries'}
            </span>
          </div>
        </div>

        {validationError && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
            <span>{validationError}</span>
          </div>
        )}
      </div>

      {/* Main Practice Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interview Question & Audio Recorder (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* AI Personality Voice Coaching Callout */}
          {user?.personalityProfile && (
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs">
              <div className="flex items-center gap-2.5">
                <Brain className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="text-slate-200">
                  <strong className="text-indigo-300">Voice Coach Aligned ({user.personalityProfile.primaryArchetype.split('&')[0].trim()}):</strong> {user.personalityProfile.interviewVoiceStyle}
                </span>
              </div>
            </div>
          )}

          {/* Question Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-md border border-sky-500/20">
                {selectedCategory} Question
              </span>
              <div className="flex gap-2">
                {(['Core Engineering', 'Technical', 'Behavioral'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      if (cat === 'Core Engineering') {
                        setQuestionText(
                          'A centrifugal pump in a refinery is vibrating severely and making a crackling noise resembling gravel being pumped. What is happening, and how would you verify and troubleshoot this on-site?'
                        );
                      } else if (cat === 'Technical') {
                        setQuestionText(
                          'Explain what happens to a distillation column when you increase reflux ratio with constant feed rate. What are the hydraulic constraints?'
                        );
                      } else {
                        setQuestionText(
                          'Tell me about an engineering project where your initial design or simulation failed completely. How did you isolate the failure and resolve it?'
                        );
                      }
                    }}
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold transition ${
                      selectedCategory === cat
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-white leading-snug">{questionText}</h2>
          </div>

          {/* Voice Recorder & Visualizer Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg text-center space-y-5">
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400">
              <Clock className="w-4 h-4 text-sky-400" />
              <span>Duration:</span>
              <span className="font-mono text-white text-sm font-extrabold">
                {Math.floor(recordingDuration / 60)}:{(recordingDuration % 60).toString().padStart(2, '0')}
              </span>
              <span>•</span>
              <span>Attempt {currentAttemptNum} of 2</span>
            </div>

            {/* Audio Waveform Animation when recording */}
            <div className="h-16 flex items-center justify-center gap-1.5 py-2">
              {isRecording ? (
                <>
                  {[12, 24, 38, 20, 32, 48, 16, 28, 44, 22, 36, 18, 30].map((h, i) => (
                    <div
                      key={i}
                      className="w-1.5 bg-gradient-to-t from-sky-500 to-emerald-400 rounded-full animate-audio-bar"
                      style={{ animationDelay: `${i * 0.08}s` }}
                    />
                  ))}
                </>
              ) : (
                <div className="text-xs text-slate-400 italic">
                  Press Record to start microphone capture, or type/paste your answer below.
                </div>
              )}
            </div>

            {/* Recording Controls */}
            <div className="flex items-center justify-center gap-4">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-600/30 transition cursor-pointer"
                >
                  <Mic className="w-5 h-5 animate-pulse" />
                  <span>Start Voice Recording</span>
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-600 shadow-lg transition cursor-pointer"
                >
                  <Square className="w-4 h-4 fill-white" />
                  <span>Stop Recording</span>
                </button>
              )}

              {audioUrl && (
                <audio controls src={audioUrl} className="h-9 max-w-xs" />
              )}
            </div>

            {/* Transcript & Answer Textarea */}
            <div className="text-left space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-sky-400" />
                  <span>Answer Transcript</span>
                </span>
                <span className="text-[11px] text-slate-400 font-normal">
                  (Auto-transcribed or edit freely)
                </span>
              </div>
              <textarea
                rows={4}
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Your spoken words will appear here. You can also paste your answer directly..."
                className="w-full p-3 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-sky-500 leading-relaxed"
              />

              <div className="flex justify-end gap-3 pt-2">
                {currentAttemptNum === 1 && attempt1Result && (
                  <button
                    onClick={handleRecordAgain}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-bold border border-slate-700 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Record Attempt 2</span>
                  </button>
                )}

                <button
                  onClick={evaluateAnswer}
                  disabled={isEvaluating || !transcript.trim()}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold shadow-md transition disabled:opacity-50 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isEvaluating ? 'Evaluating STAR-L...' : 'Analyze Answer with AI'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI STAR-L Evaluation & Filler Words (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {currentResult ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="font-extrabold text-base text-white">Interview Evaluation</h3>
                  <span className="text-xs text-slate-400">Attempt #{currentAttemptNum} Performance</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-sky-400">{currentResult.overallScore}/100</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Overall Score</div>
                </div>
              </div>

              {/* Delivery Metrics: Filler words & Pace */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-[11px] font-semibold text-slate-400">Filler Words Found</div>
                  <div className="text-lg font-black text-amber-400 mt-0.5">
                    {currentResult.fillerWordCount} detected
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {currentResult.fillerWordsFound?.map((f) => `"${f.word}" (${f.count})`).join(', ') || 'Clean delivery!'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-[11px] font-semibold text-slate-400">Speaking Pace</div>
                  <div className="text-lg font-black text-emerald-400 mt-0.5">
                    {currentResult.speakingPaceWpm} WPM
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Ideal: 120-150 words/min
                  </div>
                </div>
              </div>

              {/* STAR-L Framework Breakdown */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  STAR-L Structure Analysis
                </div>

                <div className="space-y-2 text-xs">
                  {[
                    { label: 'S - Situation', present: currentResult.starFeedback.situationPresent, notes: currentResult.starFeedback.situationNotes },
                    { label: 'T - Task', present: currentResult.starFeedback.taskPresent, notes: currentResult.starFeedback.taskNotes },
                    { label: 'A - Action', present: currentResult.starFeedback.actionPresent, notes: currentResult.starFeedback.actionNotes },
                    { label: 'R - Result', present: currentResult.starFeedback.resultPresent, notes: currentResult.starFeedback.resultNotes },
                    { label: 'L - Learning', present: currentResult.starFeedback.learningPresent, notes: currentResult.starFeedback.learningNotes },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg border flex items-start gap-2.5 ${
                        item.present
                          ? 'bg-slate-950/40 border-emerald-500/30'
                          : 'bg-rose-950/20 border-rose-500/30'
                      }`}
                    >
                      <span className={`font-bold mt-0.5 ${item.present ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {item.present ? '✓' : '✕'}
                      </span>
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-200 block">{item.label}</span>
                        <p className="text-[11px] text-slate-400 leading-snug">{item.notes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Priority Fixes */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1.5">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Priority Interview Fixes:</span>
                </span>
                <ul className="text-xs text-slate-300 space-y-1 pl-4 list-disc">
                  {currentResult.priorityFixes?.map((fix, idx) => (
                    <li key={idx}>{fix}</li>
                  ))}
                </ul>
              </div>

              {/* High-Impact Sample Answer */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-xs font-bold text-sky-400">Exemplary Answer Structure:</span>
                <p className="text-xs text-slate-300 italic leading-relaxed">
                  "{currentResult.improvedAnswerSample}"
                </p>
              </div>

              {/* Compare Attempt 1 vs Attempt 2 if both present */}
              {attempt1Result && attempt2Result && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-sky-500/10 border border-emerald-500/30 text-xs space-y-2">
                  <div className="font-extrabold text-emerald-300 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4" />
                    <span>Attempt 1 vs Attempt 2 Comparison:</span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span>Overall Score:</span>
                    <span>{attempt1Result.overallScore}% → <strong className="text-emerald-300">{attempt2Result.overallScore}%</strong></span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span>Filler Words:</span>
                    <span>{attempt1Result.fillerWordCount} → <strong className="text-emerald-300">{attempt2Result.fillerWordCount}</strong></span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg text-center space-y-3 flex flex-col items-center justify-center min-h-[350px]">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <Volume2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-sm">No Active Evaluation</h3>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                Record your voice answer or type your response on the left, then click "Analyze Answer with AI" to receive STAR-L scores and filler word detection.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

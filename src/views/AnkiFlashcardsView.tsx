import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Layers,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Flame,
  Brain,
  Plus,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Filter,
  BarChart3,
  Lightbulb,
  X,
  Volume2,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Flashcard, AnkiReviewRating } from '../types/index.ts';

export const AnkiFlashcardsView: React.FC = () => {
  const {
    flashcards,
    updateFlashcardMastery,
    addFlashcard,
    user,
    triggerConfetti,
  } = useApp();

  const [selectedBranch, setSelectedBranch] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [activeMode, setActiveMode] = useState<'study' | 'deck-list'>('study');
  const [reviewedTodayCount, setReviewedTodayCount] = useState<number>(0);

  // New Flashcard Form State
  const [newBranch, setNewBranch] = useState<string>(user?.branch || 'Chemical Engineering');
  const [newTopic, setNewTopic] = useState<string>('Fluid Mechanics & Pumps');
  const [newQuestion, setNewQuestion] = useState<string>('');
  const [newAnswer, setNewAnswer] = useState<string>('');
  const [newFormula, setNewFormula] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Filtered Cards
  const filteredCards = (flashcards || []).filter((card: Flashcard) => {
    const matchBranch = selectedBranch === 'All' || card.branch.toLowerCase() === selectedBranch.toLowerCase() || card.branch === 'Universal Engineering';
    const matchTopic = selectedTopic === 'All' || card.topic.toLowerCase() === selectedTopic.toLowerCase();
    return matchBranch && matchTopic;
  });

  const currentCard: Flashcard | undefined = filteredCards[currentCardIndex];

  // Unique branches and topics
  const branches = ['All', 'Chemical Engineering', 'Mechanical Engineering', 'Electrical Engineering', 'Computer Science Engineering', 'Civil Engineering', 'Universal Engineering'];
  const topics = ['All', ...Array.from(new Set((flashcards || []).map((c: Flashcard) => c.topic)))];

  // Anki stats
  const totalCards = filteredCards.length;
  const newCardsCount = filteredCards.filter((c: Flashcard) => (c.masteryLevel || 0) === 0).length;
  const learningCount = filteredCards.filter((c: Flashcard) => (c.masteryLevel || 0) === 1 || (c.masteryLevel || 0) === 2).length;
  const reviewCount = filteredCards.filter((c: Flashcard) => (c.masteryLevel || 0) === 3).length;
  const masteredCount = filteredCards.filter((c: Flashcard) => (c.masteryLevel || 0) >= 4).length;

  const handleNext = () => {
    setIsFlipped(false);
    setShowHint(false);
    if (currentCardIndex < filteredCards.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
    } else {
      setCurrentCardIndex(0);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setShowHint(false);
    if (currentCardIndex > 0) {
      setCurrentCardIndex((prev) => prev - 1);
    } else {
      setCurrentCardIndex(Math.max(0, filteredCards.length - 1));
    }
  };

  const handleRateCard = async (rating: AnkiReviewRating) => {
    if (!currentCard) return;

    let delta = 1;
    if (rating === 'again') delta = -1;
    if (rating === 'hard') delta = 0;
    if (rating === 'good') delta = 1;
    if (rating === 'easy') delta = 2;

    await updateFlashcardMastery(currentCard.id, delta);
    setReviewedTodayCount((prev) => prev + 1);

    if (rating === 'easy' || (currentCard.masteryLevel || 0) >= 3) {
      triggerConfetti();
    }

    handleNext();
  };

  const handleAddCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    setIsSubmitting(true);
    try {
      await addFlashcard({
        branch: newBranch,
        topic: newTopic,
        frontQuestion: newQuestion.trim(),
        backAnswer: newAnswer.trim(),
        formula: newFormula.trim() || undefined,
      });
      setNewQuestion('');
      setNewAnswer('');
      setNewFormula('');
      setIsAddModalOpen(false);
      triggerConfetti();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-200">
      {/* ================= PAGE DESCRIPTION BANNER ================= */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 p-5 lg:p-6 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5" />
                Anki Spaced Repetition Engine
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                SQLite Synced
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2.5">
              <span>Anki Engineering Flashcards</span>
              <span>🗂️</span>
            </h1>
            <p className="mt-1.5 text-xs lg:text-sm text-slate-300 max-w-3xl leading-relaxed">
              <strong>Webpage Objective:</strong> Master critical engineering viva formulas, governing thermodynamic principles, and interview traps through <strong>Anki-style Spaced Repetition (SM-2)</strong>. Rate each card based on your recall speed (<em>Again, Hard, Good, Easy</em>). The system algorithmically spaces intervals so concepts move into permanent long-term memory before your campus interview day.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md shadow-indigo-600/30 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Card</span>
            </button>
            <button
              onClick={() => setActiveMode(activeMode === 'study' ? 'deck-list' : 'study')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span>{activeMode === 'study' ? 'View Deck List' : 'Study Mode'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Spaced Repetition Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] font-semibold text-slate-400">Total in Deck</div>
          <div className="text-xl font-black text-slate-100 mt-0.5">{totalCards} Cards</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Spaced queue active</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] font-semibold text-rose-400">New (Box 0)</div>
          <div className="text-xl font-black text-rose-400 mt-0.5">{newCardsCount}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Unseen concepts</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] font-semibold text-amber-400">Learning (Box 1-2)</div>
          <div className="text-xl font-black text-amber-400 mt-0.5">{learningCount}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Under repetition</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] font-semibold text-sky-400">Review (Box 3)</div>
          <div className="text-xl font-black text-sky-400 mt-0.5">{reviewCount}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Approaching mastery</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] font-semibold text-emerald-400">Mastered (Box 4-5)</div>
          <div className="text-xl font-black text-emerald-400 mt-0.5">{masteredCount}</div>
          <div className="text-[10px] text-emerald-500 mt-0.5">Long-term memory</div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mr-1">
            <Filter className="w-3.5 h-3.5 text-indigo-400" /> Branch:
          </span>
          {branches.map((b) => (
            <button
              key={b}
              onClick={() => {
                setSelectedBranch(b);
                setCurrentCardIndex(0);
                setIsFlipped(false);
              }}
              className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                selectedBranch === b
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {b.split(' ')[0]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">Topic:</span>
          <select
            value={selectedTopic}
            onChange={(e) => {
              setSelectedTopic(e.target.value);
              setCurrentCardIndex(0);
              setIsFlipped(false);
            }}
            className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            {topics.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ================= MAIN REVIEW AREA ================= */}
      {activeMode === 'study' ? (
        filteredCards.length > 0 && currentCard ? (
          <div className="max-w-3xl mx-auto space-y-4">
            {/* Card Position & Navigation */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="font-bold text-indigo-300">
                  Card {currentCardIndex + 1} of {filteredCards.length}
                </span>
                <span>•</span>
                <span className="text-slate-300">{currentCard.branch}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-400">Mastery Level:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`w-2.5 h-2.5 rounded-full ${
                        (currentCard.masteryLevel || 0) >= level ? 'bg-emerald-400' : 'bg-slate-800 border border-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive 3D Flip Card */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="relative min-h-[340px] rounded-3xl p-7 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-700/80 shadow-2xl cursor-pointer select-none transition-all duration-300 hover:border-indigo-500/50 flex flex-col justify-between"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                  {currentCard.topic}
                </span>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="hidden sm:inline">Click card to {isFlipped ? 'hide answer' : 'flip answer'}</span>
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>

              {/* Card Body */}
              <div className="py-6 flex-1 flex flex-col justify-center">
                {!isFlipped ? (
                  /* FRONT OF CARD */
                  <div className="space-y-4">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Technical Viva Question
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-100 leading-snug">
                      {currentCard.frontQuestion}
                    </h2>

                    {showHint && currentCard.formula && (
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 animate-in fade-in">
                        <strong className="block text-[10px] uppercase font-bold text-amber-400">Hint / Governing Equation:</strong>
                        <code className="font-mono mt-0.5 block">{currentCard.formula}</code>
                      </div>
                    )}
                  </div>
                ) : (
                  /* BACK OF CARD */
                  <div className="space-y-4 animate-in fade-in">
                    <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Verified Engineering Answer
                    </div>

                    <p className="text-base text-slate-200 leading-relaxed font-medium whitespace-pre-line">
                      {currentCard.backAnswer}
                    </p>

                    {currentCard.formula && (
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 block">
                          Governing Formula / Derivation
                        </span>
                        <code className="text-xs sm:text-sm font-mono text-sky-300 font-semibold block">
                          {currentCard.formula}
                        </code>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                {!isFlipped ? (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowHint(!showHint);
                      }}
                      className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-medium transition"
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>{showHint ? 'Hide Hint' : 'Show Formula Hint'}</span>
                    </button>
                    <span className="text-slate-400 italic">Press anywhere on card to reveal answer</span>
                  </>
                ) : (
                  <span className="text-slate-400">Rate your recall speed below to schedule next review:</span>
                )}
              </div>
            </div>

            {/* Anki SM-2 Spaced Repetition Action Buttons */}
            {isFlipped ? (
              <div className="grid grid-cols-4 gap-2.5 pt-2">
                <button
                  onClick={() => handleRateCard('again')}
                  className="flex flex-col items-center py-2.5 px-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 transition cursor-pointer"
                >
                  <span className="text-xs font-black">Again</span>
                  <span className="text-[10px] text-rose-400/80 mt-0.5">&lt; 1 min</span>
                </button>

                <button
                  onClick={() => handleRateCard('hard')}
                  className="flex flex-col items-center py-2.5 px-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 transition cursor-pointer"
                >
                  <span className="text-xs font-black">Hard</span>
                  <span className="text-[10px] text-amber-400/80 mt-0.5">12 hours</span>
                </button>

                <button
                  onClick={() => handleRateCard('good')}
                  className="flex flex-col items-center py-2.5 px-2 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-300 transition cursor-pointer"
                >
                  <span className="text-xs font-black">Good</span>
                  <span className="text-[10px] text-sky-400/80 mt-0.5">3 days</span>
                </button>

                <button
                  onClick={() => handleRateCard('easy')}
                  className="flex flex-col items-center py-2.5 px-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 transition cursor-pointer"
                >
                  <span className="text-xs font-black">Easy</span>
                  <span className="text-[10px] text-emerald-400/80 mt-0.5">7 days</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handlePrev}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={() => setIsFlipped(true)}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-400 hover:to-sky-400 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition cursor-pointer"
                >
                  <span>Show Answer</span>
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl max-w-xl mx-auto space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-100">All caught up in this deck!</h3>
            <p className="text-xs text-slate-400">
              You have reviewed all available flashcards in this category. Switch filters or add new custom cards.
            </p>
            <button
              onClick={() => setSelectedBranch('All')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )
      ) : (
        /* DECK TABLE LIST VIEW */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-200">
              Deck Inventory ({filteredCards.length} Cards)
            </h3>
            <span className="text-xs text-slate-400">Persistent in SQLite Database</span>
          </div>

          <div className="divide-y divide-slate-800 overflow-x-auto">
            {filteredCards.map((card: Flashcard, idx: number) => (
              <div
                key={card.id}
                onClick={() => {
                  setCurrentCardIndex(idx);
                  setActiveMode('study');
                  setIsFlipped(false);
                }}
                className="p-4 hover:bg-slate-800/60 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      {card.topic}
                    </span>
                    <span className="text-xs text-slate-400">· {card.branch}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-100">{card.frontQuestion}</h4>
                  <p className="text-xs text-slate-400 line-clamp-1">{card.backAnswer}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-300 block">
                      Box {card.masteryLevel || 0}/5
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {card.lastReviewed ? `Reviewed: ${card.lastReviewed}` : 'Unseen'}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= ADD CARD MODAL ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-400" />
                <h3 className="font-extrabold text-lg text-slate-100">Add New Anki Flashcard</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCardSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Engineering Branch</label>
                  <select
                    value={newBranch}
                    onChange={(e) => setNewBranch(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    {branches.filter((b) => b !== 'All').map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Topic / Unit Operation</label>
                  <input
                    type="text"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    placeholder="e.g. Distillation Hydraulics"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Technical Viva Question (Front of Card)
                </label>
                <textarea
                  rows={2}
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="e.g. What is the physical meaning of Peclet Number in packed bed reactors?"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Verified Answer & Explanation (Back of Card)
                </label>
                <textarea
                  rows={3}
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="Precise technical explanation that an interviewer wants to hear."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Formula / Governing Equation (Optional)
                </label>
                <input
                  type="text"
                  value={newFormula}
                  onChange={(e) => setNewFormula(e.target.value)}
                  placeholder="e.g. Pe = (u · L) / D_ax"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Saving...' : 'Add to Anki Deck'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

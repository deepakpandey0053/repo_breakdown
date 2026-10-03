import React, { useState } from 'react';
import { 
  Brain, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Trophy, 
  HelpCircle, 
  Sparkles,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { fireConfetti } from './ui/confetti.js';

export default function QuizModule({ quiz = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [questionIdx]: selectedOption }
  const [submittedQuestions, setSubmittedQuestions] = useState({}); // { [questionIdx]: true }
  const [score, setScore] = useState(0);

  if (!quiz || quiz.length === 0) {
    return (
      <div className="p-4 text-center text-xs text-slate-400 space-y-2">
        <HelpCircle className="h-8 w-8 text-slate-600 mx-auto" />
        <p>No quiz questions generated for this repository skeleton.</p>
      </div>
    );
  }

  const currentQ = quiz[currentIndex];
  const totalQuestions = quiz.length;
  const isAnswered = submittedQuestions[currentIndex] !== undefined;
  const selectedOption = selectedAnswers[currentIndex];
  const isCorrect = isAnswered && selectedOption === currentQ.correct_answer;
  const isCompleted = Object.keys(submittedQuestions).length === totalQuestions;

  const handleSelectOption = (opt) => {
    if (isAnswered) return; // locked once submitted
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: opt }));
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption || isAnswered) return;

    const correct = selectedOption === currentQ.correct_answer;
    setSubmittedQuestions((prev) => ({ ...prev, [currentIndex]: true }));
    if (correct) {
      setScore((s) => s + 1);
      fireConfetti();
    }
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setSubmittedQuestions({});
    setScore(0);
  };

  return (
    <div className="flex flex-col h-full bg-[#0d0d12] p-4 text-slate-200">
      {/* Quiz Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-amber-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Test My Knowledge
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-mono text-amber-300 font-semibold">
          <Trophy className="h-3 w-3 text-amber-400" />
          <span>Score: {score}/{totalQuestions}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white/5 rounded-full h-1.5 mb-4 overflow-hidden border border-white/10">
        <div 
          className="bg-gradient-to-r from-amber-500 to-indigo-500 h-full transition-all duration-300"
          style={{ width: `${((Object.keys(submittedQuestions).length) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Finished Screen */}
      {isCompleted && (
        <div className="p-4 rounded-xl bg-gradient-to-b from-indigo-950/40 to-slate-900/60 border border-indigo-500/30 text-center space-y-3 my-auto">
          <div className="h-10 w-10 mx-auto rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/40">
            <Trophy className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Quiz Completed!</h4>
            <p className="text-xs text-slate-300 mt-1">
              You scored <span className="font-bold text-amber-300 font-mono">{score} out of {totalQuestions}</span> on this codebase architecture!
            </p>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 mx-auto px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Retake Quiz</span>
          </button>
        </div>
      )}

      {/* Active Question Card */}
      {!isCompleted && currentQ && (
        <div className="flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            {/* Question Counter */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Question {currentIndex + 1} of {totalQuestions}</span>
              <span className="px-2 py-0.5 rounded bg-white/5 text-[10px]">
                {isAnswered ? (isCorrect ? '✅ Correct' : '❌ Incorrect') : 'Unanswered'}
              </span>
            </div>

            {/* Question Text */}
            <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed">
              {currentQ.question}
            </p>

            {/* Options List */}
            <div className="space-y-2 pt-1">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOption === option;
                const isTargetCorrect = currentQ.correct_answer === option;

                let optionStyles = 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06] text-slate-300';
                if (isAnswered) {
                  if (isTargetCorrect) {
                    optionStyles = 'bg-emerald-950/50 border-emerald-500/60 text-emerald-200 shadow-sm';
                  } else if (isSelected && !isTargetCorrect) {
                    optionStyles = 'bg-rose-950/50 border-rose-500/60 text-rose-200 shadow-sm';
                  } else {
                    optionStyles = 'bg-white/[0.01] border-white/5 text-slate-500 opacity-60';
                  }
                } else if (isSelected) {
                  optionStyles = 'bg-indigo-600/20 border-indigo-500/60 text-indigo-200 ring-1 ring-indigo-500/40';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(option)}
                    disabled={isAnswered}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-start gap-2.5 ${optionStyles}`}
                  >
                    <span className="h-5 w-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 leading-snug break-words">{option}</span>
                    {isAnswered && isTargetCorrect && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    {isAnswered && isSelected && !isTargetCorrect && (
                      <XCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Answer Feedback & Controls */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            {!isAnswered ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedOption}
                className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Check Answer
              </button>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <div className="text-[11px] font-medium text-slate-300">
                  {isCorrect ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Great job!
                    </span>
                  ) : (
                    <span className="text-rose-400 flex items-center gap-1">
                      <XCircle className="h-3.5 w-3.5" /> Correct: <code className="text-slate-200 font-mono ml-1">{currentQ.correct_answer}</code>
                    </span>
                  )}
                </div>

                {currentIndex < totalQuestions - 1 ? (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentIndex(totalQuestions - 1)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all"
                  >
                    <span>View Summary</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

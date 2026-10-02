import React, { useState } from 'react';
import {
  X,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Brain,
  Trophy,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';

export const RevisionModal: React.FC = () => {
  const {
    activeRevisionMistake,
    closeRevisionModal,
    markMistakeMastered,
  } = useApp();

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  if (!activeRevisionMistake) return null;

  const q = activeRevisionMistake.question;
  const isCorrect = selectedOption === q.correctAnswerIndex;

  const handleVerifyAnswer = () => {
    if (selectedOption === null) return;
    setHasSubmitted(true);
    setShowExplanation(true);

    if (selectedOption === q.correctAnswerIndex) {
      // Trigger confetti celebration!
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
      markMistakeMastered(activeRevisionMistake.id);
    }
  };

  const handleReset = () => {
    setSelectedOption(null);
    setHasSubmitted(false);
    setShowExplanation(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-100 text-[#800000] flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Targeted Mistake Revision
              </h3>
              <p className="text-[11px] text-slate-500">
                {q.subject} · {activeRevisionMistake.testSource}
              </p>
            </div>
          </div>

          <button
            onClick={closeRevisionModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Question Text */}
        <div className="py-4">
          <div className="p-3 bg-red-50/60 rounded-xl border border-red-100 mb-3 text-xs text-[#800000] font-medium">
            Previously answered wrongly. Re-attempt now without seeing the answer:
          </div>

          <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed whitespace-pre-line">
            {q.questionText}
          </h4>

          {/* Options */}
          <div className="space-y-2 mt-4">
            {q.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;

              let style = 'border-slate-200 hover:border-red-300 hover:bg-slate-50 text-slate-800';

              if (hasSubmitted) {
                if (idx === q.correctAnswerIndex) {
                  style = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 ring-1 ring-emerald-500 font-bold';
                } else if (isSelected && !isCorrect) {
                  style = 'border-rose-500 bg-rose-50/80 text-rose-950 ring-1 ring-rose-500';
                }
              } else if (isSelected) {
                style = 'border-[#800000] bg-red-50 text-[#800000] ring-1 ring-[#800000]';
              }

              return (
                <button
                  key={idx}
                  disabled={hasSubmitted}
                  onClick={() => setSelectedOption(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${style} ${
                    !hasSubmitted ? 'cursor-pointer' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700">
                      ({String.fromCharCode(65 + idx)})
                    </span>
                    <span>{opt}</span>
                  </div>

                  {hasSubmitted && idx === q.correctAnswerIndex && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                  {hasSubmitted && isSelected && !isCorrect && (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback Alert */}
        {hasSubmitted && (
          <div className="space-y-3 pt-2 animate-in fade-in duration-200">
            {isCorrect ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-900 font-medium">
                <Trophy className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  <strong>Outstanding!</strong> You solved it correctly. This question has been marked as <strong>Mastered</strong> in your notebook.
                </span>
              </div>
            ) : (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-900 font-medium">
                <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>
                  Not quite right yet. Study the core rule below and try again.
                </span>
              </div>
            )}

            {/* Explanation box */}
            {showExplanation && (
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#800000]">
                  <Brain className="w-4 h-4 text-[#800000]" />
                  <span>Rule & Explanation:</span>
                </div>
                <p className="text-slate-700 leading-relaxed font-normal">
                  {q.explanation}
                </p>
                {q.explanationHi && (
                  <p className="text-slate-600 leading-relaxed font-normal pt-1 border-t border-slate-200">
                    {q.explanationHi}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between gap-2 pt-4 mt-2 border-t border-slate-100">
          {hasSubmitted ? (
            <>
              <button
                onClick={handleReset}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Try Again
              </button>

              <button
                onClick={closeRevisionModal}
                className="px-5 py-2.5 rounded-xl bg-[#800000] hover:bg-[#660000] text-white text-xs font-bold transition-colors cursor-pointer shadow-md"
              >
                Close & Return
              </button>
            </>
          ) : (
            <>
              <button
                onClick={closeRevisionModal}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                onClick={handleVerifyAnswer}
                disabled={selectedOption === null}
                className="px-5 py-2.5 rounded-xl bg-[#800000] hover:bg-[#660000] disabled:opacity-40 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Check Answer
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

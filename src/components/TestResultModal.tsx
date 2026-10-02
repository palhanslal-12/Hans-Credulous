import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  BookOpen,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TestResultModal: React.FC = () => {
  const { testResult, closeTestResult, setCurrentTab } = useApp();
  const [filterReview, setFilterReview] = useState<'all' | 'wrong' | 'correct' | 'skipped'>('all');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  if (!testResult) return null;

  const {
    paperTitle,
    totalMarks,
    maxMarks,
    accuracy,
    timeSpentSeconds,
    correctAnswers,
    wrongAnswers,
    unattemptedQuestions,
    questions,
    userAnswers,
    subjectBreakdown,
  } = testResult;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}m ${s}s`;
  };

  const filteredQuestions = questions.filter((q) => {
    const ans = userAnswers[q.id];
    const isAttempted = ans && ans.selectedOptionIndex !== null && ans.selectedOptionIndex !== undefined;
    const isCorrect = isAttempted && ans.selectedOptionIndex === q.correctAnswerIndex;

    if (filterReview === 'wrong') return isAttempted && !isCorrect;
    if (filterReview === 'correct') return isCorrect;
    if (filterReview === 'skipped') return !isAttempted;
    return true;
  });

  const handleGoToMistakeNotebook = () => {
    closeTestResult();
    setCurrentTab('insights');
  };

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Score Summary Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-[#800000]" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="min-w-0">
              <span className="text-xs font-bold text-[#800000] uppercase tracking-wider">
                Official CBT Result
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                {paperTitle}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluated with standard Tier-1 negative marking (-0.25)
              </p>

              {/* Auto Mistake Notebook Notification Callout */}
              {wrongAnswers > 0 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-[#800000]">
                  <BookOpen className="w-4 h-4 text-[#800000] shrink-0" />
                  <span>
                    <strong>{wrongAnswers} incorrect responses</strong> have been automatically logged to your <strong>Auto Mistake Notebook</strong> for targeted re-testing!
                  </span>
                </div>
              )}
            </div>

            {/* Scorecard Hero Numbers */}
            <div className="flex items-center gap-4 shrink-0 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
              <div className="text-center">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Score</span>
                <div className="text-3xl font-extrabold text-[#800000] font-mono tabular-nums">
                  {totalMarks}
                  <span className="text-xs text-slate-400 font-normal"> / {maxMarks}</span>
                </div>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div className="text-center">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Accuracy</span>
                <div className="text-3xl font-extrabold text-emerald-600 font-mono tabular-nums">
                  {accuracy}%
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stat Pill Grid */}
          <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Correct: <strong className="text-slate-900 font-mono">{correctAnswers}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>Incorrect: <strong className="text-slate-900 font-mono">{wrongAnswers}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>Skipped: <strong className="text-slate-900 font-mono">{unattemptedQuestions}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600" />
              <span>Time: <strong className="text-slate-900 font-mono">{formatTime(timeSpentSeconds)}</strong></span>
            </div>
          </div>
        </div>

        {/* Subject-Wise Performance Breakdown */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-4">
            Subject-Wise Score Breakdown
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase">
                  <th className="py-2.5">Subject</th>
                  <th className="py-2.5 text-center">Total Qs</th>
                  <th className="py-2.5 text-center text-emerald-700">Correct</th>
                  <th className="py-2.5 text-center text-rose-700">Wrong</th>
                  <th className="py-2.5 text-right">Net Marks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subjectBreakdown.map((subj) => (
                  <tr key={subj.subject} className="hover:bg-slate-50/50">
                    <td className="py-3 font-semibold text-slate-900">{subj.subject}</td>
                    <td className="py-3 text-center font-mono">{subj.total}</td>
                    <td className="py-3 text-center font-mono text-emerald-700 font-bold">{subj.correct}</td>
                    <td className="py-3 text-center font-mono text-rose-700 font-bold">{subj.wrong}</td>
                    <td className="py-3 text-right font-mono font-bold text-purple-900">
                      {subj.marks.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Question Review & Solutions */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Question Solutions & Detailed Explanations
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Analyze why you got each question right or wrong with step-by-step logic.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
              <button
                onClick={() => setFilterReview('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  filterReview === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                All ({questions.length})
              </button>
              <button
                onClick={() => setFilterReview('wrong')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  filterReview === 'wrong' ? 'bg-rose-600 text-white shadow-sm' : 'text-rose-700'
                }`}
              >
                Wrong ({wrongAnswers})
              </button>
              <button
                onClick={() => setFilterReview('correct')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  filterReview === 'correct' ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-700'
                }`}
              >
                Correct ({correctAnswers})
              </button>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {filteredQuestions.map((q, idx) => {
              const ans = userAnswers[q.id];
              const isAttempted = ans && ans.selectedOptionIndex !== null;
              const isCorrect = isAttempted && ans.selectedOptionIndex === q.correctAnswerIndex;
              const isExpanded = expandedQuestionId === q.id;

              return (
                <div
                  key={q.id}
                  className={`rounded-2xl border transition-all ${
                    !isAttempted
                      ? 'border-slate-200 bg-white'
                      : isCorrect
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : 'border-rose-200 bg-rose-50/20'
                  }`}
                >
                  <div
                    onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                    className="p-4 flex items-start justify-between gap-3 cursor-pointer"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-500 font-mono">
                          Q{idx + 1}
                        </span>
                        <span className="text-[11px] font-semibold text-purple-800 bg-purple-100/70 px-2 py-0.5 rounded">
                          {q.subject}
                        </span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        {isCorrect ? (
                          <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Correct (+1.00)
                          </span>
                        ) : isAttempted ? (
                          <span className="text-xs font-bold text-rose-700 flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Incorrect (-0.25)
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-slate-500">
                            Skipped (0.00)
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                        {q.questionText}
                      </p>
                    </div>

                    <div className="text-slate-400 p-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-slate-100 space-y-3 bg-white/70">
                      {/* Options breakdown */}
                      <div className="space-y-1.5 text-xs">
                        {q.options.map((opt, optIdx) => {
                          const isUserPick = ans?.selectedOptionIndex === optIdx;
                          const isCorrectPick = q.correctAnswerIndex === optIdx;

                          let badge = 'text-slate-700 border-slate-200 bg-white';
                          if (isCorrectPick) {
                            badge = 'text-emerald-900 border-emerald-300 bg-emerald-50 font-bold';
                          } else if (isUserPick) {
                            badge = 'text-rose-900 border-rose-300 bg-rose-50 font-semibold';
                          }

                          return (
                            <div
                              key={optIdx}
                              className={`p-2.5 rounded-xl border flex items-center justify-between ${badge}`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-bold">({String.fromCharCode(65 + optIdx)})</span>
                                <span>{opt}</span>
                              </div>
                              {isCorrectPick && (
                                <span className="text-[11px] font-bold text-emerald-700">Correct Answer</span>
                              )}
                              {isUserPick && !isCorrectPick && (
                                <span className="text-[11px] font-bold text-rose-700">Your Selection</span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation box */}
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                        <span className="font-bold text-purple-900 block mb-1">
                          Official Solution & Key Rule:
                        </span>
                        <p className="text-slate-700 leading-relaxed">
                          {q.explanation}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA Navigation Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            onClick={closeTestResult}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200 shadow-sm transition-colors cursor-pointer"
          >
            Back to Dashboard
          </button>

          <button
            onClick={handleGoToMistakeNotebook}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#800000] hover:bg-[#660000] text-white text-xs font-bold shadow-lg shadow-red-950/10 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Open Auto Mistake Notebook</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

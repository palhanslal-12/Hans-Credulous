import React, { useState, useEffect } from 'react';
import {
  Clock,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Languages,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Question, SubjectId, UserAnswer, TestResultData } from '../types';

export const TestRunner: React.FC = () => {
  const { activeTestPaper, exitTest, finishTest, targetExam } = useApp();

  if (!activeTestPaper) {
    return null;
  }

  const questions = activeTestPaper.questions;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, UserAnswer>>({});
  const [visitedQuestions, setVisitedQuestions] = useState<Set<string>>(new Set([questions[0]?.id]));
  const [language, setLanguage] = useState<'EN' | 'HI'>('EN');
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Timer in seconds
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(activeTestPaper.durationMinutes * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const currentQ: Question | undefined = questions[currentIndex];

  const handleSelectOption = (optionIndex: number) => {
    if (!currentQ) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: {
        questionId: currentQ.id,
        selectedOptionIndex: optionIndex,
        isMarkedForReview: prev[currentQ.id]?.isMarkedForReview || false,
        timeSpentSeconds: (prev[currentQ.id]?.timeSpentSeconds || 0) + 1,
      },
    }));
  };

  const handleClearResponse = () => {
    if (!currentQ) return;
    setUserAnswers((prev) => {
      const copy = { ...prev };
      if (copy[currentQ.id]) {
        copy[currentQ.id] = {
          ...copy[currentQ.id],
          selectedOptionIndex: null,
        };
      }
      return copy;
    });
  };

  const handleMarkForReviewAndNext = () => {
    if (!currentQ) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: {
        questionId: currentQ.id,
        selectedOptionIndex: prev[currentQ.id]?.selectedOptionIndex ?? null,
        isMarkedForReview: true,
        timeSpentSeconds: (prev[currentQ.id]?.timeSpentSeconds || 0) + 1,
      },
    }));
    goToNextQuestion();
  };

  const handleSaveAndNext = () => {
    goToNextQuestion();
  };

  const goToNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setVisitedQuestions((prev) => new Set([...prev, questions[nextIdx].id]));
    }
  };

  const goToPrevQuestion = () => {
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      setVisitedQuestions((prev) => new Set([...prev, questions[prevIdx].id]));
    }
  };

  const jumpToQuestion = (idx: number) => {
    setCurrentIndex(idx);
    setVisitedQuestions((prev) => new Set([...prev, questions[idx].id]));
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Status counters for question palette
  const answeredCount = Object.values(userAnswers).filter((a) => a.selectedOptionIndex !== null && !a.isMarkedForReview).length;
  const markedCount = Object.values(userAnswers).filter((a) => a.isMarkedForReview).length;
  const notAnsweredCount = questions.length - answeredCount - markedCount;

  const handleSubmitTest = () => {
    let correct = 0;
    let wrong = 0;
    let unattempted = 0;

    const subjectStats: Record<SubjectId, { total: number; correct: number; wrong: number; marks: number }> = {
      English: { total: 0, correct: 0, wrong: 0, marks: 0 },
      Reasoning: { total: 0, correct: 0, wrong: 0, marks: 0 },
      'General Awareness': { total: 0, correct: 0, wrong: 0, marks: 0 },
      Mathematics: { total: 0, correct: 0, wrong: 0, marks: 0 },
      'General Science': { total: 0, correct: 0, wrong: 0, marks: 0 },
      Hindi: { total: 0, correct: 0, wrong: 0, marks: 0 },
    };

    questions.forEach((q) => {
      const ans = userAnswers[q.id];
      const subj = q.subject;
      if (!subjectStats[subj]) {
        subjectStats[subj] = { total: 0, correct: 0, wrong: 0, marks: 0 };
      }
      subjectStats[subj].total += 1;

      if (ans && ans.selectedOptionIndex !== null) {
        if (ans.selectedOptionIndex === q.correctAnswerIndex) {
          correct += 1;
          subjectStats[subj].correct += 1;
          subjectStats[subj].marks += 1;
        } else {
          wrong += 1;
          subjectStats[subj].wrong += 1;
          subjectStats[subj].marks -= targetExam.negativeMarking;
        }
      } else {
        unattempted += 1;
      }
    });

    const netMarks = Number((correct * 1.0 - wrong * targetExam.negativeMarking).toFixed(2));
    const attempted = correct + wrong;
    const accuracy = attempted > 0 ? Number(((correct / attempted) * 100).toFixed(1)) : 0;
    const timeSpent = activeTestPaper.durationMinutes * 60 - timeLeftSeconds;

    const resultData: TestResultData = {
      paperId: activeTestPaper.id,
      paperTitle: activeTestPaper.title,
      examId: activeTestPaper.examId,
      totalQuestions: questions.length,
      attemptedQuestions: attempted,
      correctAnswers: correct,
      wrongAnswers: wrong,
      unattemptedQuestions: unattempted,
      totalMarks: Math.max(0, netMarks),
      maxMarks: questions.length,
      accuracy,
      timeSpentSeconds: timeSpent,
      subjectBreakdown: Object.entries(subjectStats)
        .filter(([_, data]) => data.total > 0)
        .map(([name, data]) => ({
          subject: name as SubjectId,
          ...data,
        })),
      mistakeIdsAdded: [],
      questions,
      userAnswers,
    };

    finishTest(resultData);
  };

  const getQuestionPaletteStatus = (q: Question) => {
    const ans = userAnswers[q.id];
    if (ans?.isMarkedForReview) return 'marked';
    if (ans?.selectedOptionIndex !== null && ans?.selectedOptionIndex !== undefined) return 'answered';
    if (visitedQuestions.has(q.id)) return 'not_answered';
    return 'not_visited';
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* CBT Header */}
      <header className="bg-[#800000] text-white px-4 py-3 flex items-center justify-between shadow-md sticky top-0 z-30 border-b border-[#660000]">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => {
              if (window.confirm('Do you want to leave this test session? Your progress will not be saved.')) {
                exitTest();
              }
            }}
            className="p-1.5 rounded-lg hover:bg-[#660000] text-red-200 transition-colors"
            title="Exit Test"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-bold text-white truncate max-w-xs sm:max-w-md">
              {activeTestPaper.title}
            </h1>
            <span className="text-[11px] text-red-200">
              CBT Simulation · Q{currentIndex + 1} of {questions.length}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Language Toggle */}
          <button
            onClick={() => setLanguage((prev) => (prev === 'EN' ? 'HI' : 'EN'))}
            className="px-2.5 py-1 rounded-lg bg-[#660000] hover:bg-[#520000] text-xs font-semibold text-red-100 flex items-center gap-1 border border-[#990000]/60 transition-colors"
            title="Toggle Question Language (English/Hindi)"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{language === 'EN' ? 'English' : 'हिंदी'}</span>
          </button>

          {/* Countdown Timer */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs sm:text-sm font-bold tabular-nums shadow-inner ${
              timeLeftSeconds < 300
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-[#520000] text-red-100 border border-[#660000]'
            }`}
          >
            <Clock className="w-4 h-4 text-red-200" />
            <span>{formatTime(timeLeftSeconds)}</span>
          </div>

          {/* Submit Test Trigger */}
          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all active:scale-95"
          >
            Submit Test
          </button>
        </div>
      </header>

      {/* Main Examination Work Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left: Question Viewer & Option Choices (3 Columns) */}
        <div className="lg:col-span-3 flex flex-col bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden min-h-[500px]">
          {/* Section & Marks Bar */}
          <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#800000] bg-red-100 px-2.5 py-1 rounded-lg">
                Section: {currentQ?.subject}
              </span>
              <span className="text-slate-500 font-medium">
                Topic: {currentQ?.topic}
              </span>
            </div>

            <div className="flex items-center gap-3 font-mono font-medium">
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                +1.00
              </span>
              <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                -{targetExam.negativeMarking}
              </span>
            </div>
          </div>

          {/* Question Text */}
          <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
            {currentQ ? (
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-slate-500 text-sm pt-0.5">
                    Q{currentIndex + 1}.
                  </span>
                  <div className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed whitespace-pre-line">
                    {language === 'HI' && currentQ.questionTextHi
                      ? currentQ.questionTextHi
                      : currentQ.questionText}
                  </div>
                </div>

                {/* Options List */}
                <div className="space-y-2.5 mt-6">
                  {(language === 'HI' && currentQ.optionsHi ? currentQ.optionsHi : currentQ.options).map(
                    (optText, optIdx) => {
                      const isSelected =
                        userAnswers[currentQ.id]?.selectedOptionIndex === optIdx;

                      return (
                        <label
                          key={optIdx}
                          onClick={() => handleSelectOption(optIdx)}
                          className={`flex items-start gap-3.5 p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#800000] bg-red-50 text-[#800000] ring-1 ring-[#800000] shadow-sm'
                              : 'border-slate-200 hover:border-red-300 hover:bg-slate-50 text-slate-800'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`q-${currentQ.id}`}
                            checked={isSelected}
                            onChange={() => handleSelectOption(optIdx)}
                            className="mt-0.5 w-4 h-4 text-[#800000] focus:ring-[#800000]"
                          />
                          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
                            <span className="font-bold text-slate-900">
                              ({String.fromCharCode(65 + optIdx)})
                            </span>
                            <span>{optText}</span>
                          </div>
                        </label>
                      );
                    }
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">Question not found</div>
            )}
          </div>

          {/* Action Footer */}
          <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handleClearResponse}
                className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
              >
                Clear Response
              </button>
              <button
                onClick={handleMarkForReviewAndNext}
                className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold border border-amber-200 transition-colors flex items-center gap-1.5"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Mark for Review & Next</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={goToPrevQuestion}
                disabled={currentIndex === 0}
                className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 disabled:opacity-40 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={handleSaveAndNext}
                className="px-4 py-2 rounded-xl bg-[#800000] hover:bg-[#660000] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
              >
                <span>Save & Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Question Palette Drawer / Sidebar (1 Column) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Question Palette</h3>
            <span className="text-xs text-slate-500 font-mono">
              Total: {questions.length}
            </span>
          </div>

          {/* Palette Legend */}
          <div className="grid grid-cols-2 gap-2 my-3 text-[11px] text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-emerald-600 text-white text-[9px] flex items-center justify-center font-bold">
                ✓
              </span>
              <span>Answered ({answeredCount})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-purple-700 text-white text-[9px] flex items-center justify-center font-bold">
                ★
              </span>
              <span>Marked ({markedCount})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-amber-500 text-white text-[9px] flex items-center justify-center font-bold">
                !
              </span>
              <span>Unanswered ({notAnsweredCount})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-slate-200 text-slate-600 text-[9px] flex items-center justify-center font-bold">
                -
              </span>
              <span>Not Visited</span>
            </div>
          </div>

          {/* Palette Number Grid */}
          <div className="grid grid-cols-5 gap-2 overflow-y-auto max-h-64 sm:max-h-80 p-1">
            {questions.map((q, idx) => {
              const status = getQuestionPaletteStatus(q);
              const isCurrent = idx === currentIndex;

              let style = 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200';
              if (status === 'answered') {
                style = 'bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-700';
              } else if (status === 'marked') {
                style = 'bg-purple-700 text-white hover:bg-purple-800 border-purple-800';
              } else if (status === 'not_answered') {
                style = 'bg-amber-500 text-white hover:bg-amber-600 border-amber-600';
              }

              return (
                <button
                  key={q.id}
                  onClick={() => jumpToQuestion(idx)}
                  className={`h-9 rounded-lg font-mono text-xs font-bold flex items-center justify-center border transition-all cursor-pointer ${style} ${
                    isCurrent ? 'ring-2 ring-purple-900 ring-offset-2' : ''
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="mt-auto pt-4 border-t border-slate-100">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
            >
              Submit Entire Paper
            </button>
          </div>
        </div>
      </div>

      {/* Pre-submission confirmation modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2 mb-2 text-purple-900">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold">Ready to Submit Test?</h3>
            </div>

            <p className="text-xs text-slate-600 mb-4">
              Review your attempt status below before final submission. Incorrect answers will automatically sync to your <strong>Auto Mistake Notebook</strong>.
            </p>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs mb-5 font-medium">
              <div className="flex justify-between">
                <span className="text-slate-600">Total Questions:</span>
                <span className="font-bold text-slate-900">{questions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-700">Answered Questions:</span>
                <span className="font-bold text-emerald-700">{answeredCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-700">Marked for Review:</span>
                <span className="font-bold text-purple-700">{markedCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-700">Unanswered / Skipped:</span>
                <span className="font-bold text-amber-700">{notAnsweredCount}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200">
                <span className="text-slate-600">Time Remaining:</span>
                <span className="font-mono font-bold text-purple-900">{formatTime(timeLeftSeconds)}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700"
              >
                Resume Test
              </button>
              <button
                onClick={handleSubmitTest}
                className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-md shadow-purple-900/10 cursor-pointer"
              >
                Confirm & View Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

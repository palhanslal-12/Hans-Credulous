import React, { useState } from 'react';
import {
  BookOpen,
  RotateCcw,
  CheckCircle2,
  Trash2,
  AlertCircle,
  BarChart2,
  ChevronDown,
  ChevronUp,
  Brain,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MistakeItem, SubjectId } from '../types';

export const InsightsTab: React.FC = () => {
  const {
    mistakes,
    markMistakeMastered,
    removeMistake,
    openRevisionModal,
    userProfile,
  } = useApp();

  const [subjectFilter, setSubjectFilter] = useState<'All' | SubjectId>('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'needs_revision' | 'mastered'>('all');
  const [expandedMistakeId, setExpandedMistakeId] = useState<string | null>(null);

  const filteredMistakes = mistakes.filter((m) => {
    if (subjectFilter !== 'All' && m.question.subject !== subjectFilter) {
      return false;
    }
    if (statusFilter === 'needs_revision' && m.status !== 'needs_revision') {
      return false;
    }
    if (statusFilter === 'mastered' && m.status !== 'mastered') {
      return false;
    }
    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedMistakeId((prev) => (prev === id ? null : id));
  };

  const needsRevisionCount = mistakes.filter((m) => m.status === 'needs_revision').length;
  const masteredCount = mistakes.filter((m) => m.status === 'mastered').length;

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-200">
      {/* Header matching Flutter Text */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#800000]" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Auto Mistake Notebook
            </h2>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Questions you answered wrong in tests are automatically collected here for targeted revision.
          </p>
        </div>

        {/* Quick Revision Stats */}
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 font-semibold">
            {needsRevisionCount} Needs Revision
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold">
            {masteredCount} Mastered
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
        {/* Subject Filter */}
        <div className="flex items-center gap-1 overflow-x-auto py-1">
          {(['All', 'English', 'Reasoning', 'General Awareness', 'Mathematics', 'General Science', 'Hindi'] as const).map((sub) => (
            <button
              key={sub}
              onClick={() => setSubjectFilter(sub)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                subjectFilter === sub
                  ? 'bg-[#800000] text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              statusFilter === 'all' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-600'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('needs_revision')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              statusFilter === 'needs_revision' ? 'bg-white shadow-xs text-rose-700 font-bold' : 'text-slate-600'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setStatusFilter('mastered')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              statusFilter === 'mastered' ? 'bg-white shadow-xs text-emerald-700 font-bold' : 'text-slate-600'
            }`}
          >
            Mastered
          </button>
        </div>
      </div>

      {/* Mistakes List matching Flutter ListView Cards */}
      {filteredMistakes.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200/90 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#800000] flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Mistakes in This Filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Great job! Take a new mock test or sectional drill from the Practice tab. Any incorrect responses will be auto-saved here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMistakes.map((mistake) => {
            const isExpanded = expandedMistakeId === mistake.id;
            const q = mistake.question;

            return (
              <div
                key={mistake.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                {/* Main Row matching Flutter ListTile */}
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div
                    onClick={() => toggleExpand(mistake.id)}
                    className="min-w-0 cursor-pointer flex-1"
                  >
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-red-50 text-[#800000] border border-red-200/60">
                        {q.subject}
                      </span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="text-xs text-slate-500 font-medium">
                        {mistake.testSource}
                      </span>
                      {mistake.status === 'mastered' && (
                        <>
                          <span aria-hidden="true" className="text-slate-300">·</span>
                          <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-0.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Mastered
                          </span>
                        </>
                      )}
                    </div>

                    <h4 className="text-sm font-semibold text-slate-900 line-clamp-2">
                      Q: {q.questionText}
                    </h4>

                    <div className="mt-1.5 flex items-center gap-3 text-xs text-slate-500">
                      <span className="text-rose-600 font-medium">
                        Your wrong choice: Option {String.fromCharCode(65 + mistake.userWrongOptionIndex)}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-700 font-medium">
                        Correct: Option {String.fromCharCode(65 + q.correctAnswerIndex)}
                      </span>
                    </div>
                  </div>

                  {/* Actions (Matching Flutter trailing: TextButton('Revise')) */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => toggleExpand(mistake.id)}
                      className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                      title={isExpanded ? 'Hide explanation' : 'Show explanation'}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => openRevisionModal(mistake)}
                      className="px-3 py-1.5 rounded-xl bg-[#800000] hover:bg-[#660000] active:scale-95 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Revise</span>
                    </button>
                  </div>
                </div>

                {/* Expanded Pedagogical Explanation & Notes */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 sm:px-5 sm:pb-5 border-t border-slate-100 bg-slate-50/70 space-y-3 animate-in fade-in duration-150">
                    <div className="p-3 bg-white rounded-xl border border-slate-200/80 text-xs">
                      <div className="flex items-center gap-1.5 text-[#800000] font-bold mb-1">
                        <Brain className="w-4 h-4" />
                        <span>Concept Explanation & Memory Rule:</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed font-normal">
                        {q.explanation}
                      </p>
                      {q.explanationHi && (
                        <p className="text-slate-600 leading-relaxed font-normal mt-1 border-t border-slate-100 pt-1">
                          {q.explanationHi}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <div className="flex items-center gap-2">
                        {mistake.status !== 'mastered' ? (
                          <button
                            onClick={() => markMistakeMastered(mistake.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 font-semibold transition-colors flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Mark as Mastered</span>
                          </button>
                        ) : (
                          <span className="text-emerald-700 font-medium">
                            Reviewed {mistake.revisionAttempts} times
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => removeMistake(mistake.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1 flex items-center gap-1 text-xs"
                        title="Remove from Mistake Notebook"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Analytics Summary */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm mt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-[#800000]" />
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Exam Preparedness & Error Metrics
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {userProfile.totalQuestionsPracticed} Qs Total
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-xs text-slate-500 font-medium">Accuracy</span>
            <div className="text-xl font-bold text-slate-900 font-mono tabular-nums mt-0.5">
              {userProfile.overallAccuracy}%
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-xs text-slate-500 font-medium">Study Streak</span>
            <div className="text-xl font-bold text-amber-600 font-mono tabular-nums mt-0.5">
              {userProfile.streakDays} Days 🔥
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-xs text-slate-500 font-medium">Weak Zone</span>
            <div className="text-xs font-bold text-[#800000] mt-2 truncate">
              Cloze & Syllogism
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-xs text-slate-500 font-medium">Retention</span>
            <div className="text-xl font-bold text-emerald-600 font-mono tabular-nums mt-0.5">
              88.2%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

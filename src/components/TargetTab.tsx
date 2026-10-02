import React, { useState } from 'react';
import {
  GraduationCap,
  Flame,
  ChevronDown,
  Play,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  Clock,
  Award,
  Search,
  Edit,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HighYieldTopic, ExamCategory } from '../types';

export const TargetTab: React.FC = () => {
  const { targetExam, allExams, setTargetExamId, highYieldTopics, startTest } = useApp();
  const [showExamModal, setShowExamModal] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<'All' | ExamCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const handleStartTopicPYQs = (topic: HighYieldTopic) => {
    // Generate/launch practice quiz specifically on this topic
    const topicQuiz = {
      id: `topic-${topic.id}`,
      title: `${topic.title} (${topic.subject}) PYQ Drill`,
      questions: topic.sampleQuestions.length > 0 ? topic.sampleQuestions : [
        {
          id: `${topic.id}-sample-1`,
          subject: topic.subject,
          topic: topic.title,
          questionText: `Official PYQ Drill Question on ${topic.title}: Identify the most accurate solution based on recent trends.`,
          options: ['Option A (Direct Rule)', 'Option B (Common Trap)', 'Option C (Contextual Variant)', 'Option D (Irrelevant)'],
          correctAnswerIndex: 0,
          explanation: `In ${topic.title}, following the core grammar and reasoning principles ensures accuracy under time pressure.`,
          pyqYear: 2024,
          difficulty: 'Medium' as const,
        }
      ],
      durationMinutes: 15,
      examId: targetExam.id,
    };

    startTest(topicQuiz, 'topic_pyqs');
  };

  return (
    <div className="space-y-5 pb-8 animate-in fade-in duration-200">
      {/* Deep Maroon Selected Exam Card (Matching Flutter Card(color: Color(0xFF800000))) */}
      <div
        onClick={() => setShowExamModal(true)}
        className="bg-[#800000] text-white rounded-2xl p-4 sm:p-5 shadow-lg hover:bg-[#730000] active:scale-[0.99] transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-red-200 uppercase tracking-wider block">
                Target Exam Active
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white truncate">
                Selected Exam: {targetExam.name}
              </h2>
              <p className="text-xs text-red-200/90 truncate mt-0.5">
                {targetExam.fullName} · {targetExam.totalQuestions} Qs · {targetExam.totalTimeMinutes} Mins · -{targetExam.negativeMarking} Neg
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold shrink-0 transition-colors">
            <Edit className="w-4 h-4" />
            <span className="hidden sm:inline">Change</span>
          </div>
        </div>
      </div>

      {/* Target Subjects Section (Matching Flutter ListTile with Icons.check_circle_outline) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Target Subjects
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Subject Modules Coverage
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {targetExam.subjects.map((subj) => (
            <div key={subj.name} className="py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <CheckCircle2 className="w-5 h-5 text-[#800000] shrink-0" />
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-slate-900 truncate">
                    {subj.name === 'English'
                      ? 'English Language & Comprehension'
                      : subj.name === 'Reasoning'
                      ? 'General Intelligence & Reasoning'
                      : subj.name}
                  </h4>
                  <p className="text-xs text-slate-500">
                    0 / {subj.questionsCount} Modules Completed ({subj.marks} Marks)
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  const matchingTopic =
                    highYieldTopics.find((t) => t.subject === subj.name) || highYieldTopics[0];
                  handleStartTopicPYQs(matchingTopic);
                }}
                className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-[#800000] text-xs font-bold transition-colors shrink-0 cursor-pointer"
              >
                Study
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* High-Yield Focus Zone Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-rose-600 fill-rose-600" />
          <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            High-Yield Focus Zone ({targetExam.highYieldThreshold} Weightage)
          </h3>
        </div>
        <span className="text-xs text-slate-500 font-medium hidden sm:inline">
          Ranked by PYQ Repeat Ratio
        </span>
      </div>

      <p className="text-xs text-slate-600 -mt-2">
        Mastering these 6 topics guarantees 60%+ marks in Tier-1. Click <strong>Start PYQs</strong> to drill real previous questions.
      </p>

      {/* Topic Cards List (Matching Flutter _buildTopicTile) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {highYieldTopics.map((topic) => (
          <div
            key={topic.id}
            className={`rounded-2xl p-4 border transition-all shadow-sm hover:shadow-md ${topic.colorScheme.bg} ${topic.colorScheme.border}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className={`text-base font-bold tracking-tight ${topic.colorScheme.text}`}>
                    {topic.title}
                  </h4>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white/80 border border-slate-200 text-slate-700">
                    {topic.weightagePercent}% Weightage
                  </span>
                </div>

                <div className="text-xs text-slate-600 mt-1 flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-slate-800">{topic.subject}</span>
                  <span aria-hidden="true">·</span>
                  <span>{topic.pyqCount} Solved PYQs</span>
                </div>

                <div className="mt-2 flex flex-wrap gap-1">
                  {topic.keyConcepts.slice(0, 2).map((kc, i) => (
                    <span
                      key={i}
                      className="text-[11px] text-slate-600 bg-white/70 px-2 py-0.5 rounded border border-slate-200/60"
                    >
                      {kc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Start PYQs Button (Matching Flutter trailing ElevatedButton) */}
              <button
                onClick={() => handleStartTopicPYQs(topic)}
                className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-bold transition-transform active:scale-95 shadow-sm flex items-center gap-1.5 shrink-0 cursor-pointer ${topic.colorScheme.badgeBg}`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start PYQs</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Syllabus Weightage Heatmap Table */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm mt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#800000]" />
            <h4 className="text-sm sm:text-base font-bold text-slate-900">
              Exam Weightage & Topic Heatmap
            </h4>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Based on Official Tier-1 Schemes
          </span>
        </div>

        <div className="space-y-3">
          {targetExam.subjects.map((subj) => {
            const pct = Math.round((subj.marks / (targetExam.totalMarks || 100)) * 100);
            return (
              <div key={subj.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{subj.name}</span>
                  <span className="font-mono text-slate-600 font-medium">
                    {subj.questionsCount} Qs · {subj.marks} Marks ({pct}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${Math.min(100, Math.max(15, pct))}%` }}
                    className="bg-[#800000] h-full rounded-full transition-all duration-300"
                    title={`Core High-Yield Area: ${pct}%`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
          <Info className="w-4 h-4 text-[#800000] shrink-0" />
          <span>
            Formula: Prioritizing high-weightage topics yields 2.4x higher score efficiency per study hour.
          </span>
        </div>
      </div>

      {/* Change Exam Modal */}
      {showExamModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Select Your Target Exam
                </h3>
                <p className="text-xs text-slate-500">
                  Choose from all SSC exams, Railway (RRB) exams, Banking, Defence, and State tests.
                </p>
              </div>
              <button
                onClick={() => setShowExamModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative mt-3 mb-2">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search exam (e.g. CGL, NTPC, Group D, ALP, GD, CHSL, MTS, JE, RPF...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:bg-white"
              />
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto py-1.5 border-b border-slate-100 mb-3 text-xs">
              {(['All', 'SSC', 'Railway', 'Banking', 'Defence', 'State & Teaching'] as const).map((cat) => {
                const count = cat === 'All' ? allExams.length : allExams.filter((e) => e.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      categoryFilter === cat
                        ? 'bg-[#800000] text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {cat === 'All' ? 'All Exams' : `${cat} (${count})`}
                  </button>
                );
              })}
            </div>

            {/* Exam Items Scrollable List */}
            <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
              {allExams
                .filter((exam) => {
                  if (categoryFilter !== 'All' && exam.category !== categoryFilter) return false;
                  if (searchQuery.trim()) {
                    const q = searchQuery.toLowerCase();
                    return (
                      exam.name.toLowerCase().includes(q) ||
                      exam.fullName.toLowerCase().includes(q) ||
                      (exam.badge && exam.badge.toLowerCase().includes(q))
                    );
                  }
                  return true;
                })
                .map((exam) => {
                  const isSelected = exam.id === targetExam.id;
                  return (
                    <div
                      key={exam.id}
                      onClick={() => {
                        setTargetExamId(exam.id);
                        setShowExamModal(false);
                      }}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-[#800000] bg-red-50/70 text-red-950 ring-1 ring-[#800000] shadow-sm'
                          : 'border-slate-200 hover:border-red-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-slate-900 truncate">
                            {exam.fullName}
                          </h4>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              exam.category === 'SSC'
                                ? 'bg-red-100 text-[#800000]'
                                : exam.category === 'Railway'
                                ? 'bg-emerald-100 text-emerald-800'
                                : exam.category === 'Banking'
                                ? 'bg-blue-100 text-blue-800'
                                : exam.category === 'Defence'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {exam.category}
                          </span>
                          {exam.badge && (
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                              {exam.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          {exam.totalQuestions} Questions · {exam.totalTimeMinutes} Mins · Max: {exam.totalMarks} Marks · Negative: -{exam.negativeMarking}
                        </p>
                      </div>

                      {isSelected ? (
                        <CheckCircle2 className="w-5 h-5 text-[#800000] shrink-0" />
                      ) : (
                        <span className="text-xs font-semibold text-[#800000] hover:underline shrink-0">
                          Select
                        </span>
                      )}
                    </div>
                  );
                })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowExamModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

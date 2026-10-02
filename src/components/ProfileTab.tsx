import React, { useState } from 'react';
import {
  User,
  Camera,
  HardDriveDownload,
  Edit,
  LogOut,
  ChevronRight,
  HardDrive,
  Trash2,
  CheckCircle2,
  ShieldAlert,
  Database,
  Layers,
  FileQuestion,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ExamCategory } from '../types';

export const ProfileTab: React.FC = () => {
  const {
    userProfile,
    targetExam,
    allExams,
    setTargetExamId,
    logout,
    mockPapers,
    downloadPaperForOffline,
    clearOfflineCache,
    offlineCacheSizeBytes,
  } = useApp();

  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [showExamModal, setShowExamModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [examCategoryFilter, setExamCategoryFilter] = useState<'All' | ExamCategory>('All');
  const [isPhotoEditing, setIsPhotoEditing] = useState(false);
  const [adminSyncMsg, setAdminSyncMsg] = useState<string | null>(null);

  const downloadedPapers = mockPapers.filter((p) => p.isDownloaded);

  const handleAdminSync = () => {
    setAdminSyncMsg('Syncing PYQ question banks with local cloud cache...');
    setTimeout(() => {
      setAdminSyncMsg('1,250 Official PYQs and solution matrices verified & synchronized.');
      setTimeout(() => setAdminSyncMsg(null), 3000);
    }, 800);
  };

  return (
    <div className="space-y-6 pb-8 max-w-xl mx-auto animate-in fade-in duration-200">
      {/* Profile Header matching Flutter avatar & text */}
      <div className="flex flex-col items-center text-center pt-2">
        <div className="relative">
          {/* Deep Maroon CircleAvatar (Color(0xFF800000)) */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#800000] flex items-center justify-center text-white shadow-xl ring-4 ring-red-100">
            <User className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>

          <button
            onClick={() => setIsPhotoEditing(!isPhotoEditing)}
            className="absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-[#800000] shadow-md border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-transform active:scale-95"
            title="Update Profile Picture"
          >
            <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        <h2 className="text-xl font-bold text-slate-900 mt-3.5">
          User Profile
        </h2>
        <p className="text-sm font-semibold text-slate-700 mt-0.5">
          {userProfile.name}
        </p>
        <span className="text-xs text-slate-500 font-medium">
          {userProfile.email}
        </span>
        <span className="mt-2 text-xs font-bold px-3 py-1 rounded-full bg-red-50 text-[#800000] border border-red-200">
          Target: {targetExam.fullName}
        </span>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-[11px] text-slate-500 font-medium">Daily Streak</span>
          <div className="text-lg font-bold text-amber-600 font-mono mt-0.5">
            {userProfile.streakDays} Days 🔥
          </div>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-[11px] text-slate-500 font-medium">PYQs Solved</span>
          <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
            {userProfile.totalQuestionsPracticed}
          </div>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-[11px] text-slate-500 font-medium">Accuracy</span>
          <div className="text-lg font-bold text-[#800000] font-mono mt-0.5">
            {userProfile.overallAccuracy}%
          </div>
        </div>
      </div>

      {/* Action Options List matching Flutter ListTile */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden divide-y divide-slate-100">
        {/* Item 1: Admin Panel Access (Matching Flutter Icons.admin_panel_settings) */}
        <button
          onClick={() => setShowAdminModal(true)}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Admin Panel Access
              </h3>
              <p className="text-xs text-slate-500">
                Manage syllabus schemas, question banks & PYQ configurations
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* Item 2: Downloaded Offline Data */}
        <button
          onClick={() => setShowOfflineModal(true)}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <HardDriveDownload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Downloaded Offline Data
              </h3>
              <p className="text-xs text-slate-500">
                {downloadedPapers.length} papers saved ({(offlineCacheSizeBytes / (1024 * 1024)).toFixed(1)} MB stored)
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* Item 3: Change Target Exam */}
        <button
          onClick={() => setShowExamModal(true)}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-[#800000] flex items-center justify-center">
              <Edit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Change Target Exam
              </h3>
              <p className="text-xs text-slate-500">
                Currently: {targetExam.name} ({targetExam.year})
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* Item 4: Logout (Matching Flutter ListTile Icons.logout) */}
        <button
          onClick={logout}
          className="w-full p-4 flex items-center justify-between hover:bg-rose-50/60 transition-colors text-left cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-100">
              <LogOut className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-rose-600">
                Logout
              </h3>
              <p className="text-xs text-rose-400">
                Return to Clean OTP Login screen
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-rose-300" />
        </button>
      </div>

      {/* Admin Panel Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Hans Compain Admin Console
                  </h3>
                  <p className="text-xs text-slate-500">
                    Content Management & Syllabus Pipeline
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAdminModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 text-xs font-semibold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 my-4 overflow-y-auto flex-1 pr-1 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-[#800000]" />
                    <span>Database Status</span>
                  </span>
                  <span className="text-emerald-700 font-mono">ONLINE / ACTIVE</span>
                </div>
                <p className="text-slate-600">
                  Local and Cloud storage active. Total 17 Exams indexed with high-yield weightage tables.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-[#800000]" />
                    <span>Configured Exams</span>
                  </span>
                  <span className="font-mono text-slate-900">{allExams.length} Total Exams</span>
                </div>
                <p className="text-slate-600">
                  SSC: {allExams.filter(e => e.category === 'SSC').length} · Railway: {allExams.filter(e => e.category === 'Railway').length} · Banking: {allExams.filter(e => e.category === 'Banking').length} · Defence: {allExams.filter(e => e.category === 'Defence').length} · State & Teaching: {allExams.filter(e => e.category === 'State & Teaching').length}
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <FileQuestion className="w-4 h-4 text-blue-700" />
                    <span>Available Papers</span>
                  </span>
                  <span className="font-mono text-slate-900">{mockPapers.length} Papers Loaded</span>
                </div>
                <p className="text-slate-600">
                  All official shift papers feature negative marking calculator and auto mistake notebook capture.
                </p>
              </div>

              {adminSyncMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-medium">
                  {adminSyncMsg}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={handleAdminSync}
                className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sync Content</span>
              </button>

              <button
                onClick={() => setShowAdminModal(false)}
                className="px-4 py-2 bg-[#800000] hover:bg-[#660000] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Close Console
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offline Storage Manager Modal */}
      {showOfflineModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-[#800000]" />
                <h3 className="text-base font-bold text-slate-900">
                  Offline PYQs Storage
                </h3>
              </div>
              <span className="text-xs font-mono font-semibold text-[#800000] bg-red-50 px-2 py-0.5 rounded border border-red-200">
                {(offlineCacheSizeBytes / (1024 * 1024)).toFixed(1)} MB Cached
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-4">
              Saved papers and mistake entries are stored directly in your browser's local cache so you can prepare without internet.
            </p>

            <div className="space-y-2 mb-5 max-h-60 overflow-y-auto">
              {mockPapers.map((paper) => (
                <div
                  key={paper.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {paper.title}
                    </h4>
                    <span className="text-[11px] text-slate-500">
                      {(paper.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB · {paper.questionCount} Questions
                    </span>
                  </div>

                  {paper.isDownloaded ? (
                    <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Cached
                    </span>
                  ) : (
                    <button
                      onClick={() => downloadPaperForOffline(paper.id)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#800000] hover:bg-[#660000] text-white shrink-0"
                    >
                      Download
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={clearOfflineCache}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Cache</span>
              </button>

              <button
                onClick={() => setShowOfflineModal(false)}
                className="px-4 py-2 rounded-xl bg-[#800000] hover:bg-[#660000] text-white text-xs font-semibold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Exam Modal */}
      {showExamModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Select Target Exam
              </h3>
              <button
                onClick={() => setShowExamModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 text-xs font-semibold"
              >
                ✕
              </button>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1 overflow-x-auto py-2 border-b border-slate-100 mb-3 text-xs">
              {(['All', 'SSC', 'Railway', 'Banking', 'Defence', 'State & Teaching'] as const).map((cat) => {
                const count = cat === 'All' ? allExams.length : allExams.filter((e) => e.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setExamCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      examCategoryFilter === cat
                        ? 'bg-[#800000] text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {cat === 'All' ? 'All Exams' : `${cat} (${count})`}
                  </button>
                );
              })}
            </div>

            <div className="space-y-2 overflow-y-auto flex-1 pr-1">
              {allExams
                .filter((exam) => examCategoryFilter === 'All' || exam.category === examCategoryFilter)
                .map((exam) => (
                  <button
                    key={exam.id}
                    onClick={() => {
                      setTargetExamId(exam.id);
                      setShowExamModal(false);
                    }}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      exam.id === targetExam.id
                        ? 'border-[#800000] bg-red-50 text-[#800000] font-bold ring-1 ring-[#800000]'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs sm:text-sm font-bold text-slate-900">{exam.fullName}</span>
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-red-100 text-[#800000]">
                          {exam.category}
                        </span>
                        {exam.badge && (
                          <span className="text-[10px] text-slate-500 bg-slate-100 px-1 py-0.2 rounded">
                            {exam.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {exam.totalQuestions} Questions · {exam.totalTimeMinutes} Mins · Negative: -{exam.negativeMarking}
                      </p>
                    </div>
                    {exam.id === targetExam.id && <CheckCircle2 className="w-4 h-4 text-[#800000] shrink-0" />}
                  </button>
                ))}
            </div>

            <div className="pt-3 mt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowExamModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
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

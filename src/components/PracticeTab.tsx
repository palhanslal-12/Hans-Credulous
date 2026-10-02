import React, { useState } from 'react';
import {
  FileText,
  Play,
  Download,
  CheckCircle2,
  WifiOff,
  Clock,
  HelpCircle,
  HardDrive,
  Filter,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MockPaper } from '../types';

export const PracticeTab: React.FC = () => {
  const {
    mockPapers,
    startTest,
    isOffline,
    downloadPaperForOffline,
    removePaperFromOffline,
    targetExam,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'target' | 'ssc' | 'railway' | 'banking' | 'defence' | 'state' | 'offline_ready'>('all');

  const filteredPapers = mockPapers.filter((paper) => {
    if (activeFilter === 'target') {
      return paper.examId === targetExam.id;
    }
    if (activeFilter === 'ssc') {
      return paper.examId.startsWith('ssc_');
    }
    if (activeFilter === 'railway') {
      return paper.examId.startsWith('rrb_') || paper.examId.startsWith('rpf_');
    }
    if (activeFilter === 'banking') {
      return paper.examId.startsWith('ibps_') || paper.examId.startsWith('sbi_') || paper.examId.startsWith('rbi_');
    }
    if (activeFilter === 'defence') {
      return paper.examId.startsWith('cds_') || paper.examId.startsWith('nda_') || paper.examId.startsWith('afcat_') || paper.examId.startsWith('capf_');
    }
    if (activeFilter === 'state') {
      return paper.examId.startsWith('ctet_') || paper.examId.startsWith('up_') || paper.examId.startsWith('bssc_');
    }
    if (activeFilter === 'offline_ready') {
      return paper.isDownloaded || paper.isOfflineAvailable;
    }
    return true;
  });

  const handleStartPaper = (paper: MockPaper) => {
    if (isOffline && paper.isOnlineOnly && !paper.isDownloaded) {
      alert('This paper requires an active internet connection or prior offline download. Switch to Online mode from the top bar.');
      return;
    }

    startTest({
      id: paper.id,
      title: paper.title,
      questions: paper.questions,
      durationMinutes: paper.durationMinutes,
      examId: paper.examId,
    }, 'full_mock');
  };

  return (
    <div className="space-y-5 pb-8 animate-in fade-in duration-200">
      {/* Title & Description matching Flutter text */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            Previous Year Question Papers
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real official Tier-1 exam papers with detailed solutions and auto-mistake tracking.
          </p>
        </div>

        {/* Filter Segmented Controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-xl overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-[#800000] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-white/60'
            }`}
          >
            All Papers ({mockPapers.length})
          </button>
          <button
            onClick={() => setActiveFilter('target')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeFilter === 'target'
                ? 'bg-[#800000] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-white/60'
            }`}
          >
            🎯 {targetExam.name}
          </button>
          <button
            onClick={() => setActiveFilter('ssc')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeFilter === 'ssc'
                ? 'bg-[#800000] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-white/60'
            }`}
          >
            SSC
          </button>
          <button
            onClick={() => setActiveFilter('railway')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeFilter === 'railway'
                ? 'bg-[#800000] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-white/60'
            }`}
          >
            Railway (RRB)
          </button>
          <button
            onClick={() => setActiveFilter('banking')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeFilter === 'banking'
                ? 'bg-[#800000] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-white/60'
            }`}
          >
            Banking
          </button>
          <button
            onClick={() => setActiveFilter('defence')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeFilter === 'defence'
                ? 'bg-[#800000] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-white/60'
            }`}
          >
            Defence
          </button>
          <button
            onClick={() => setActiveFilter('state')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeFilter === 'state'
                ? 'bg-[#800000] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-white/60'
            }`}
          >
            State & Teaching
          </button>
          <button
            onClick={() => setActiveFilter('offline_ready')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeFilter === 'offline_ready'
                ? 'bg-[#800000] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-white/60'
            }`}
          >
            💾 Offline Ready
          </button>
        </div>
      </div>

      {/* Offline Mode Advisory Card */}
      {isOffline && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              Offline active: You can attempt any papers marked <strong>Available Offline</strong> without using internet bandwidth.
            </span>
          </div>
        </div>
      )}

      {/* Quiz Cards List matching Flutter _buildQuizCard */}
      <div className="space-y-3">
        {filteredPapers.map((paper) => {
          const isPlayableInOffline = !isOffline || paper.isDownloaded || paper.isOfflineAvailable;

          return (
            <div
              key={paper.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              {/* Left Slot: Icon & Details (Matching Flutter ListTile leading, title, subtitle isThreeLine) */}
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200/80 flex items-center justify-center text-[#800000] shrink-0 mt-0.5">
                  <FileText className="w-6 h-6" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    {paper.title}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-slate-600 mt-1 flex-wrap">
                    <span className="flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                      <span>{paper.questionCount} Questions</span>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{paper.durationMinutes} Mins</span>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-slate-500">
                      {(paper.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <span className="font-semibold text-slate-500">Status:</span>
                    {paper.isDownloaded ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Saved on Device (Offline Ready)
                      </span>
                    ) : paper.isOfflineAvailable ? (
                      <span className="text-blue-700 font-medium">
                        Available Offline
                      </span>
                    ) : (
                      <span className="text-amber-700 font-medium">
                        Online Only
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Slot: Download & Start Actions */}
              <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
                {/* Download Offline Button */}
                {paper.isDownloaded ? (
                  <button
                    onClick={() => removePaperFromOffline(paper.id)}
                    title="Remove from offline cache"
                    className="p-2 rounded-xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100 text-xs font-semibold border border-emerald-200 transition-colors flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Downloaded</span>
                  </button>
                ) : (
                  <button
                    onClick={() => downloadPaperForOffline(paper.id)}
                    title="Save paper for offline study"
                    className="p-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 text-xs font-medium border border-slate-200 transition-colors flex items-center gap-1"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Download</span>
                  </button>
                )}

                {/* Start Test Button */}
                <button
                  onClick={() => handleStartPaper(paper)}
                  disabled={!isPlayableInOffline}
                  className={`min-h-[42px] px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                    isPlayableInOffline
                      ? 'bg-[#800000] hover:bg-[#660000] active:scale-95 text-white shadow-red-950/10'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Play className="w-4 h-4 fill-current text-white" />
                  <span>Start Test</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rapid Sectional Drills Bento Box */}
      <div className="mt-8 pt-6 border-t border-slate-200">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-3">
          ⚡ 15-Minute Rapid Topic Drills
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div
            onClick={() =>
              startTest({
                id: 'rapid-english',
                title: 'English Rapid 25Q Drill',
                questions: mockPapers[0]?.questions.filter((q) => q.subject === 'English') || [],
                durationMinutes: 15,
                examId: targetExam.id,
              }, 'topic_pyqs')
            }
            className="p-3.5 bg-white rounded-xl border border-slate-200/90 shadow-sm hover:border-purple-300 hover:shadow transition-all cursor-pointer"
          >
            <span className="text-xs font-semibold text-purple-700 uppercase">English Language</span>
            <h4 className="text-sm font-bold text-slate-900 mt-0.5">Grammar & Vocab Blitz</h4>
            <p className="text-xs text-slate-500 mt-1">25 Questions · 15 Mins</p>
          </div>

          <div
            onClick={() =>
              startTest({
                id: 'rapid-reasoning',
                title: 'Reasoning Rapid 25Q Drill',
                questions: mockPapers[0]?.questions.filter((q) => q.subject === 'Reasoning') || [],
                durationMinutes: 15,
                examId: targetExam.id,
              }, 'topic_pyqs')
            }
            className="p-3.5 bg-white rounded-xl border border-slate-200/90 shadow-sm hover:border-purple-300 hover:shadow transition-all cursor-pointer"
          >
            <span className="text-xs font-semibold text-purple-700 uppercase">Reasoning</span>
            <h4 className="text-sm font-bold text-slate-900 mt-0.5">Speed & Deduction Sprint</h4>
            <p className="text-xs text-slate-500 mt-1">25 Questions · 15 Mins</p>
          </div>

          <div
            onClick={() =>
              startTest({
                id: 'rapid-ga',
                title: 'General Awareness Rapid 25Q Drill',
                questions: mockPapers[0]?.questions.filter((q) => q.subject === 'General Awareness') || [],
                durationMinutes: 12,
                examId: targetExam.id,
              }, 'topic_pyqs')
            }
            className="p-3.5 bg-white rounded-xl border border-slate-200/90 shadow-sm hover:border-purple-300 hover:shadow transition-all cursor-pointer"
          >
            <span className="text-xs font-semibold text-purple-700 uppercase">General Awareness</span>
            <h4 className="text-sm font-bold text-slate-900 mt-0.5">Static GK & Current Affairs</h4>
            <p className="text-xs text-slate-500 mt-1">25 Questions · 12 Mins</p>
          </div>
        </div>
      </div>
    </div>
  );
};

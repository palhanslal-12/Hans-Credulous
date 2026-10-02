import React, { useState } from 'react';
import { Wifi, WifiOff, Bell, Smartphone, Monitor, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TopBar: React.FC = () => {
  const {
    isOffline,
    toggleOffline,
    notificationBanner,
    targetExam,
    allExams,
    setTargetExamId,
    deviceMode,
    toggleDeviceMode,
  } = useApp();

  const [showNotificationToast, setShowNotificationToast] = useState(false);

  const handleNotificationClick = () => {
    setShowNotificationToast(true);
    setTimeout(() => setShowNotificationToast(false), 3000);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#800000] text-white shadow-md border-b border-[#660000]">
      {/* Primary Top Bar matching Flutter AppBar and Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
        {/* Zone 1: Brand Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[#660000] border border-[#990000] flex items-center justify-center text-white shrink-0 shadow-inner">
            <span className="font-extrabold text-sm tracking-tight text-red-100">HC</span>
          </div>
          <span className="font-bold text-lg sm:text-xl tracking-tight text-white truncate">
            Hans Compain
          </span>
        </div>

        {/* Zone 2: Target Exam Selector (Single Line Control) */}
        <div className="flex items-center gap-2 min-w-0">
          <label htmlFor="target-exam-select" className="sr-only">Target Exam</label>
          <div className="relative inline-flex items-center">
            <select
              id="target-exam-select"
              value={targetExam.id}
              onChange={(e) => setTargetExamId(e.target.value)}
              className="bg-[#660000] hover:bg-[#590000] text-white text-xs sm:text-sm font-medium py-1.5 pl-3 pr-8 rounded-lg border border-[#990000]/60 focus:outline-none focus:ring-2 focus:ring-red-300 cursor-pointer appearance-none truncate max-w-[170px] sm:max-w-[280px]"
            >
              {(['SSC', 'Railway', 'Banking', 'Defence', 'State & Teaching'] as const).map((cat) => {
                const catExams = allExams.filter((e) => e.category === cat);
                if (catExams.length === 0) return null;
                return (
                  <optgroup key={cat} label={`── ${cat} Exams ──`} className="bg-[#660000] text-red-200 font-bold">
                    {catExams.map((exam) => (
                      <option key={exam.id} value={exam.id} className="bg-slate-900 text-white font-normal">
                        {exam.name} ({exam.year})
                      </option>
                    ))}
                  </optgroup>
                );
              })}
            </select>
            <div className="pointer-events-none absolute right-2.5 text-red-200 text-xs">
              ▼
            </div>
          </div>
        </div>

        {/* Zone 3: Actions (Notification bell, Offline Toggle & Device Frame Toggle) */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Notification Icon matching Flutter AppBar action */}
          <button
            onClick={handleNotificationClick}
            aria-label="Notifications"
            className="p-2 rounded-lg bg-[#660000]/80 hover:bg-[#590000] text-red-100 border border-[#990000]/50 transition-colors relative"
            title="Exam alerts & notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-[#800000]" />
          </button>

          {/* Device Preview Toggle */}
          <button
            onClick={toggleDeviceMode}
            title={deviceMode === 'fluid' ? 'Switch to Smartphone App frame' : 'Switch to Desktop full-width'}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#660000]/80 hover:bg-[#590000] text-red-100 text-xs font-medium border border-[#990000]/50 transition-colors"
          >
            {deviceMode === 'fluid' ? (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile View</span>
              </>
            ) : (
              <>
                <Monitor className="w-3.5 h-3.5" />
                <span>Wide View</span>
              </>
            )}
          </button>

          {/* Wifi Offline / Online Toggle */}
          <button
            onClick={toggleOffline}
            aria-label={isOffline ? 'Switch to Online Mode' : 'Switch to Offline Mode'}
            title={isOffline ? 'Offline Mode Active - Click to go Online' : 'Online - Click to simulate Offline Mode'}
            className={`min-h-[38px] px-3 rounded-lg flex items-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
              isOffline
                ? 'bg-amber-400 text-amber-950 hover:bg-amber-300 ring-2 ring-amber-200 shadow-sm'
                : 'bg-[#660000]/90 text-red-100 hover:bg-[#590000] border border-[#990000]/50'
            }`}
          >
            {isOffline ? (
              <>
                <WifiOff className="w-4 h-4 text-amber-950" />
                <span className="hidden sm:inline">Offline</span>
              </>
            ) : (
              <>
                <Wifi className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Online</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {showNotificationToast && (
        <div className="bg-[#4d0000] border-t border-[#660000] px-4 py-2 text-white text-xs font-medium flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Target Exam: <strong>{targetExam.fullName}</strong>. New 2026 PYQs synced and ready for practice.</span>
          </div>
          <button onClick={() => setShowNotificationToast(false)} className="text-red-200 hover:text-white text-xs ml-2">
            Dismiss
          </button>
        </div>
      )}

      {/* Offline Mode Active Banner */}
      {isOffline && (
        <div className="bg-amber-700 border-t border-b border-amber-600 px-4 py-2 text-white text-xs font-medium flex items-center justify-between shadow-inner animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse" />
            <span className="font-semibold">Offline Mode Active</span>
            <span aria-hidden="true" className="text-amber-300">·</span>
            <span className="text-amber-100 hidden sm:inline">
              Serving local cached PYQs, questions & mistake notebook
            </span>
          </div>
          <button
            onClick={toggleOffline}
            className="underline underline-offset-2 hover:text-amber-200 text-xs shrink-0 ml-2"
          >
            Reconnect
          </button>
        </div>
      )}

      {/* Temporary Toast Banner */}
      {notificationBanner && !isOffline && (
        <div className="bg-emerald-800 px-4 py-1.5 text-emerald-100 text-xs font-medium flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
          <span>{notificationBanner}</span>
        </div>
      )}
    </header>
  );
};

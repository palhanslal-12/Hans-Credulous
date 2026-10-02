import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SplashScreen } from './components/SplashScreen';
import { LoginScreen } from './components/LoginScreen';
import { TopBar } from './components/TopBar';
import { BottomNav } from './components/BottomNav';
import { TargetTab } from './components/TargetTab';
import { PracticeTab } from './components/PracticeTab';
import { InsightsTab } from './components/InsightsTab';
import { ProfileTab } from './components/ProfileTab';
import { TestRunner } from './components/TestRunner';
import { TestResultModal } from './components/TestResultModal';
import { RevisionModal } from './components/RevisionModal';
import { Smartphone, Monitor } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentScreen, currentTab, deviceMode, toggleDeviceMode } = useApp();

  if (currentScreen === 'splash') {
    return <SplashScreen />;
  }

  if (currentScreen === 'login') {
    return <LoginScreen />;
  }

  if (currentScreen === 'test-runner') {
    return <TestRunner />;
  }

  if (currentScreen === 'test-result') {
    return <TestResultModal />;
  }

  const renderActiveTab = () => {
    switch (currentTab) {
      case 'target':
        return <TargetTab />;
      case 'practice':
        return <PracticeTab />;
      case 'insights':
        return <InsightsTab />;
      case 'profile':
        return <ProfileTab />;
      default:
        return <TargetTab />;
    }
  };

  // If Mobile Frame mode is selected on wider screens, wrap in phone mockup
  if (deviceMode === 'mobile_frame') {
    return (
      <div className="min-h-screen bg-slate-900 py-6 sm:py-10 px-4 flex flex-col items-center justify-center">
        {/* Device Switcher Header Floating Bar */}
        <div className="mb-4 flex items-center justify-between w-full max-w-sm px-2 text-slate-400 text-xs">
          <span>Hans Compain Mobile Simulation</span>
          <button
            onClick={toggleDeviceMode}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Switch to Wide View</span>
          </button>
        </div>

        {/* Smartphone Frame */}
        <div className="w-full max-w-[400px] h-[820px] bg-black rounded-[48px] p-3 shadow-2xl ring-1 ring-slate-800 shadow-purple-950/40 relative flex flex-col overflow-hidden">
          {/* Top Speaker / Dynamic Island Bezel */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 flex items-center justify-center">
            <div className="w-12 h-1 bg-slate-800 rounded-full" />
          </div>

          {/* Screen Content Container */}
          <div className="w-full h-full bg-slate-100 rounded-[38px] overflow-hidden flex flex-col relative">
            <TopBar />
            <main className="flex-1 overflow-y-auto px-4 pt-4 pb-24">
              {renderActiveTab()}
            </main>
            <BottomNav />
            <RevisionModal />
          </div>
        </div>
      </div>
    );
  }

  // Fluid responsive mode (Standard web & tablet / desktop view)
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900">
      <TopBar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 pt-5 pb-24 sm:pb-20">
        {renderActiveTab()}
      </main>

      <BottomNav />
      <RevisionModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

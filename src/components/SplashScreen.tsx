import React, { useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SplashScreen: React.FC = () => {
  const { setCurrentScreen } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentScreen('login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [setCurrentScreen]);

  return (
    <div className="fixed inset-0 bg-[#800000] flex flex-col items-center justify-center text-white px-6 z-50">
      <div className="flex flex-col items-center max-w-sm text-center">
        {/* Animated Brand Icon */}
        <div className="w-24 h-24 rounded-3xl bg-[#660000] border border-[#990000] flex items-center justify-center mb-6 shadow-2xl shadow-red-950/50 relative">
          <div className="absolute inset-0 bg-red-400/20 rounded-3xl animate-ping opacity-30" />
          <Sparkles className="w-12 h-12 text-white animate-pulse" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
          Hans Compain
        </h1>
        <p className="text-red-200 text-sm sm:text-base font-medium max-w-xs mb-8">
          Data-Driven Exam Prep & PYQ Engine
        </p>

        {/* Loading indicator & skip button */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-200 animate-bounce [animation-delay:-0.3s]" />
            <span className="w-2 h-2 rounded-full bg-red-200 animate-bounce [animation-delay:-0.15s]" />
            <span className="w-2 h-2 rounded-full bg-red-200 animate-bounce" />
          </div>

          <button
            onClick={() => setCurrentScreen('login')}
            className="mt-4 px-4 py-2 rounded-xl bg-[#660000] hover:bg-[#520000] text-xs font-semibold tracking-wide text-red-100 transition-colors flex items-center gap-1.5 cursor-pointer border border-[#990000]/40"
          >
            <span>Skip into App</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="absolute bottom-6 text-xs text-red-300 font-medium">
        SSC · RRB · State PSC Previous Year Questions Engine
      </div>
    </div>
  );
};

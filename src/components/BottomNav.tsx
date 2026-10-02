import React from 'react';
import { Target, BookOpen, BarChart3, User } from 'lucide-react';
import { useApp, DashboardTab } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const { currentTab, setCurrentTab, mistakes } = useApp();

  const unrevisedCount = mistakes.filter((m) => m.status === 'needs_revision').length;

  const navItems: { id: DashboardTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'target',
      label: 'Target',
      icon: <Target className="w-5 h-5" />,
    },
    {
      id: 'practice',
      label: 'Practice',
      icon: <BookOpen className="w-5 h-5" />, // Matching Flutter Icons.menu_book
    },
    {
      id: 'insights',
      label: 'Insights',
      icon: <BarChart3 className="w-5 h-5" />,
      badge: unrevisedCount > 0 ? unrevisedCount : undefined,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <User className="w-5 h-5" />,
    },
  ];

  return (
    <nav
      aria-label="Main Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg"
    >
      <div className="max-w-md mx-auto grid grid-cols-4 items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex flex-col items-center justify-center min-h-[48px] py-1 px-2 rounded-xl transition-all cursor-pointer relative ${
                isActive
                  ? 'text-[#800000] font-bold'
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <div className="relative">
                <div
                  className={`p-1 rounded-lg transition-transform ${
                    isActive ? 'scale-110 text-[#800000]' : 'text-slate-500'
                  }`}
                >
                  {item.icon}
                </div>
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 px-1.5 py-0.2 min-w-[18px] text-[10px] font-bold bg-[#800000] text-white rounded-full flex items-center justify-center ring-2 ring-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[11px] leading-tight tracking-tight mt-0.5 whitespace-nowrap truncate ${
                  isActive ? 'text-[#800000] font-bold' : 'text-slate-500'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="w-5 h-0.5 bg-[#800000] rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

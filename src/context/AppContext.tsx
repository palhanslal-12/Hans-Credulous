import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ExamId,
  ExamInfo,
  HighYieldTopic,
  MockPaper,
  MistakeItem,
  UserProfile,
  TestResultData,
  Question,
} from '../types';
import {
  EXAMS_LIST,
  INITIAL_USER_PROFILE,
  HIGH_YIELD_TOPICS,
  MOCK_PAPERS,
  INITIAL_MISTAKES,
} from '../data/mockData';

export type ScreenType = 'splash' | 'login' | 'dashboard' | 'test-runner' | 'test-result';
export type DashboardTab = 'target' | 'practice' | 'insights' | 'profile';
export type DeviceFrameMode = 'fluid' | 'mobile_frame';

interface AppContextType {
  // Navigation & Screens
  currentScreen: ScreenType;
  setCurrentScreen: (screen: ScreenType) => void;
  currentTab: DashboardTab;
  setCurrentTab: (tab: DashboardTab) => void;
  deviceMode: DeviceFrameMode;
  setDeviceMode: (mode: DeviceFrameMode) => void;
  toggleDeviceMode: () => void;

  // Offline Engine
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;
  toggleOffline: () => void;
  notificationBanner: string | null;
  setNotificationBanner: (msg: string | null) => void;
  offlineCacheSizeBytes: number;
  downloadPaperForOffline: (paperId: string) => void;
  removePaperFromOffline: (paperId: string) => void;
  clearOfflineCache: () => void;

  // User & Profile
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  logout: () => void;
  login: (phone: string) => void;

  // Exam Selection
  targetExamId: ExamId;
  targetExam: ExamInfo;
  setTargetExamId: (examId: ExamId) => void;
  allExams: ExamInfo[];
  highYieldTopics: HighYieldTopic[];

  // Practice & Tests
  mockPapers: MockPaper[];
  activeTestPaper: { title: string; questions: Question[]; durationMinutes: number; examId: ExamId; id: string } | null;
  activeTestMode: 'full_mock' | 'topic_pyqs' | 'revision';
  startTest: (paper: { id: string; title: string; questions: Question[]; durationMinutes: number; examId: ExamId }, mode?: 'full_mock' | 'topic_pyqs') => void;
  finishTest: (result: TestResultData) => void;
  exitTest: () => void;
  testResult: TestResultData | null;
  closeTestResult: () => void;

  // Auto Mistake Notebook
  mistakes: MistakeItem[];
  addMistake: (question: Question, wrongOptionIndex: number, testSource: string) => void;
  markMistakeMastered: (mistakeId: string) => void;
  removeMistake: (mistakeId: string) => void;
  activeRevisionMistake: MistakeItem | null;
  openRevisionModal: (mistake: MistakeItem) => void;
  closeRevisionModal: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('splash');
  const [currentTab, setCurrentTab] = useState<DashboardTab>('target');
  const [deviceMode, setDeviceMode] = useState<DeviceFrameMode>('fluid');

  // Offline Engine
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [notificationBanner, setNotificationBanner] = useState<string | null>(null);

  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('hc_user_profile');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_USER_PROFILE;
  });

  // Target Exam
  const [targetExamId, setTargetExamIdState] = useState<ExamId>(userProfile.targetExamId || 'ssc_steno_2026');

  // Papers with offline download state
  const [mockPapers, setMockPapers] = useState<MockPaper[]>(() => {
    try {
      const saved = localStorage.getItem('hc_mock_papers');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return MOCK_PAPERS;
  });

  // Mistakes
  const [mistakes, setMistakes] = useState<MistakeItem[]>(() => {
    try {
      const saved = localStorage.getItem('hc_mistakes_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_MISTAKES;
  });

  // Active Test Session
  const [activeTestPaper, setActiveTestPaper] = useState<{
    id: string;
    title: string;
    questions: Question[];
    durationMinutes: number;
    examId: ExamId;
  } | null>(null);
  const [activeTestMode, setActiveTestMode] = useState<'full_mock' | 'topic_pyqs' | 'revision'>('full_mock');
  const [testResult, setTestResult] = useState<TestResultData | null>(null);

  // Revision Modal
  const [activeRevisionMistake, setActiveRevisionMistake] = useState<MistakeItem | null>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('hc_user_profile', JSON.stringify(userProfile));
    } catch {
      // ignore
    }
  }, [userProfile]);

  useEffect(() => {
    try {
      localStorage.setItem('hc_mock_papers', JSON.stringify(mockPapers));
    } catch {
      // ignore
    }
  }, [mockPapers]);

  useEffect(() => {
    try {
      localStorage.setItem('hc_mistakes_v1', JSON.stringify(mistakes));
    } catch {
      // ignore
    }
  }, [mistakes]);

  // Derived properties
  const targetExam = EXAMS_LIST.find((e) => e.id === targetExamId) || EXAMS_LIST[0];
  const highYieldTopics =
    HIGH_YIELD_TOPICS[targetExamId] ||
    (targetExamId.startsWith('rrb_') || targetExamId.startsWith('rpf_')
      ? HIGH_YIELD_TOPICS['rrb_ntpc_grad_2026']
      : targetExamId.startsWith('ssc_')
      ? HIGH_YIELD_TOPICS['ssc_cgl_2026'] || HIGH_YIELD_TOPICS['ssc_steno_2026']
      : HIGH_YIELD_TOPICS['ssc_steno_2026']);

  const offlineCacheSizeBytes = mockPapers
    .filter((p) => p.isDownloaded)
    .reduce((acc, p) => acc + (p.fileSizeBytes || 3500000), 2450000); // base app offline assets ~2.4MB

  // Actions
  const toggleOffline = () => {
    const nextVal = !isOffline;
    setIsOffline(nextVal);
    const msg = nextVal ? 'Offline Mode Switched ON (Using Saved PYQs & Data)' : 'Online Mode Switched ON (Cloud Sync Active)';
    setNotificationBanner(msg);
    setTimeout(() => {
      setNotificationBanner((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const toggleDeviceMode = () => {
    setDeviceMode((prev) => (prev === 'fluid' ? 'mobile_frame' : 'fluid'));
  };

  const setTargetExamId = (examId: ExamId) => {
    setTargetExamIdState(examId);
    setUserProfile((prev) => ({ ...prev, targetExamId: examId }));
  };

  const updateUserProfile = (patch: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...patch }));
  };

  const login = (phone: string) => {
    setUserProfile((prev) => ({ ...prev, phone }));
    setCurrentScreen('dashboard');
  };

  const logout = () => {
    setCurrentScreen('login');
  };

  const downloadPaperForOffline = (paperId: string) => {
    setMockPapers((prev) =>
      prev.map((p) => (p.id === paperId ? { ...p, isDownloaded: true, isOfflineAvailable: true } : p))
    );
    setNotificationBanner('Downloaded for Offline Practice');
    setTimeout(() => setNotificationBanner(null), 2500);
  };

  const removePaperFromOffline = (paperId: string) => {
    setMockPapers((prev) =>
      prev.map((p) => (p.id === paperId ? { ...p, isDownloaded: false } : p))
    );
  };

  const clearOfflineCache = () => {
    setMockPapers((prev) => prev.map((p) => ({ ...p, isDownloaded: false })));
    setNotificationBanner('Offline Cache Cleared');
    setTimeout(() => setNotificationBanner(null), 2500);
  };

  const startTest = (
    paper: { id: string; title: string; questions: Question[]; durationMinutes: number; examId: ExamId },
    mode: 'full_mock' | 'topic_pyqs' = 'full_mock'
  ) => {
    setActiveTestPaper(paper);
    setActiveTestMode(mode);
    setTestResult(null);
    setCurrentScreen('test-runner');
  };

  const finishTest = (result: TestResultData) => {
    setTestResult(result);
    // Auto add mistakes to notebook
    result.questions.forEach((q) => {
      const userAns = result.userAnswers[q.id];
      if (userAns && userAns.selectedOptionIndex !== null && userAns.selectedOptionIndex !== q.correctAnswerIndex) {
        addMistake(q, userAns.selectedOptionIndex, result.paperTitle);
      }
    });

    // Update user stats
    setUserProfile((prev) => {
      const totalSolved = prev.totalQuestionsPracticed + result.attemptedQuestions;
      const totalCorrect = Math.round((prev.totalQuestionsPracticed * (prev.overallAccuracy / 100))) + result.correctAnswers;
      const newAccuracy = totalSolved > 0 ? Number(((totalCorrect / totalSolved) * 100).toFixed(1)) : prev.overallAccuracy;
      return {
        ...prev,
        totalQuestionsPracticed: totalSolved,
        overallAccuracy: newAccuracy,
      };
    });

    setCurrentScreen('test-result');
  };

  const exitTest = () => {
    setActiveTestPaper(null);
    setCurrentScreen('dashboard');
  };

  const closeTestResult = () => {
    setTestResult(null);
    setCurrentScreen('dashboard');
  };

  const addMistake = (question: Question, wrongOptionIndex: number, testSource: string) => {
    setMistakes((prev) => {
      const exists = prev.find((m) => m.questionId === question.id);
      if (exists) {
        return prev.map((m) =>
          m.questionId === question.id
            ? { ...m, userWrongOptionIndex: wrongOptionIndex, testSource, status: 'needs_revision' as const }
            : m
        );
      }
      const newMistake: MistakeItem = {
        id: `mistake-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        questionId: question.id,
        question,
        userWrongOptionIndex: wrongOptionIndex,
        addedAt: new Date().toISOString().split('T')[0],
        testSource,
        status: 'needs_revision',
        revisionAttempts: 0,
        notes: `Auto-captured from ${testSource}. Re-attempt to master.`,
      };
      return [newMistake, ...prev];
    });
  };

  const markMistakeMastered = (mistakeId: string) => {
    setMistakes((prev) =>
      prev.map((m) =>
        m.id === mistakeId
          ? {
              ...m,
              status: 'mastered',
              revisionAttempts: m.revisionAttempts + 1,
              lastRevisedAt: new Date().toISOString().split('T')[0],
            }
          : m
      )
    );
  };

  const removeMistake = (mistakeId: string) => {
    setMistakes((prev) => prev.filter((m) => m.id !== mistakeId));
  };

  const openRevisionModal = (mistake: MistakeItem) => {
    setActiveRevisionMistake(mistake);
  };

  const closeRevisionModal = () => {
    setActiveRevisionMistake(null);
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        currentTab,
        setCurrentTab,
        deviceMode,
        setDeviceMode,
        toggleDeviceMode,
        isOffline,
        setIsOffline,
        toggleOffline,
        notificationBanner,
        setNotificationBanner,
        offlineCacheSizeBytes,
        downloadPaperForOffline,
        removePaperFromOffline,
        clearOfflineCache,
        userProfile,
        updateUserProfile,
        logout,
        login,
        targetExamId,
        targetExam,
        setTargetExamId,
        allExams: EXAMS_LIST,
        highYieldTopics,
        mockPapers,
        activeTestPaper,
        activeTestMode,
        startTest,
        finishTest,
        exitTest,
        testResult,
        closeTestResult,
        mistakes,
        addMistake,
        markMistakeMastered,
        removeMistake,
        activeRevisionMistake,
        openRevisionModal,
        closeRevisionModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

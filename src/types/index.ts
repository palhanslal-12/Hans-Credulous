export type ExamCategory = 'SSC' | 'Railway' | 'Banking' | 'Defence' | 'State & Teaching';

export type ExamId = string;

export type SubjectId = 'English' | 'Reasoning' | 'General Awareness' | 'Mathematics' | 'General Science' | 'Hindi';

export interface ExamInfo {
  id: ExamId;
  category: ExamCategory;
  name: string;
  fullName: string;
  year: number;
  badge?: string;
  totalQuestions: number;
  totalTimeMinutes: number;
  totalMarks: number;
  negativeMarking: number;
  subjects: {
    name: SubjectId;
    questionsCount: number;
    marks: number;
  }[];
  highYieldThreshold: string; // e.g. "50% - 70%"
  description: string;
}

export interface Question {
  id: string;
  subject: SubjectId;
  topic: string;
  questionText: string;
  questionTextHi?: string;
  options: string[];
  optionsHi?: string[];
  correctAnswerIndex: number;
  explanation: string;
  explanationHi?: string;
  pyqYear: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  paperSource?: string;
}

export interface HighYieldTopic {
  id: string;
  title: string;
  subject: SubjectId;
  weightagePercent: number;
  pyqCount: number;
  colorScheme: {
    bg: string;
    border: string;
    text: string;
    badgeBg: string;
  };
  keyConcepts: string[];
  sampleQuestions: Question[];
}

export interface MockPaper {
  id: string;
  title: string;
  examId: ExamId;
  year: number;
  questionCount: number;
  durationMinutes: number;
  isOfflineAvailable: boolean;
  isDownloaded: boolean;
  isOnlineOnly: boolean;
  fileSizeBytes: number;
  questions: Question[];
}

export interface UserAnswer {
  questionId: string;
  selectedOptionIndex: number | null;
  isMarkedForReview: boolean;
  timeSpentSeconds: number;
}

export interface MistakeItem {
  id: string;
  questionId: string;
  question: Question;
  userWrongOptionIndex: number;
  addedAt: string;
  testSource: string;
  status: 'needs_revision' | 'mastered';
  revisionAttempts: number;
  lastRevisedAt?: string;
  notes?: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  targetExamId: ExamId;
  streakDays: number;
  totalQuestionsPracticed: number;
  overallAccuracy: number;
  avatarUrl?: string;
}

export interface TestResultData {
  paperId: string;
  paperTitle: string;
  examId: ExamId;
  totalQuestions: number;
  attemptedQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  unattemptedQuestions: number;
  totalMarks: number;
  maxMarks: number;
  accuracy: number;
  timeSpentSeconds: number;
  subjectBreakdown: {
    subject: SubjectId;
    total: number;
    correct: number;
    wrong: number;
    marks: number;
  }[];
  mistakeIdsAdded: string[];
  questions: Question[];
  userAnswers: Record<string, UserAnswer>;
}

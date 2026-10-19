export type GradeId =
  | 'grade-1'
  | 'grade-2'
  | 'grade-3'
  | 'grade-4'
  | 'grade-5'
  | 'grade-6';

export type SubscriptionType = 'free' | 'paid';

export interface GradeInfo {
  id: GradeId;
  order: number;
  name: string;
  stageName: string;
  shortName: string;
  description: string;
  icon: string;
  badgeColor: string;
  bgColor: string;
  accentColor: string;
}

export interface Subject {
  id: string;
  gradeId: GradeId;
  name: string;
  code: string;
  icon: string;
  themeColor: string;
  description: string;
  lessonsCount: number;
  questionsCount: number;
  isSpecialInteractive?: boolean;
}

export interface Question {
  id: string;
  gradeId: GradeId;
  subjectId: string;
  chapter: string;
  lessonName: string;
  questionText: string;
  answerText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  isVipOnly: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  audioVoiceNote?: string;
}

export interface Student {
  id: string;
  username: string;
  fullName: string;
  gradeId: GradeId;
  password?: string;
  subscription: SubscriptionType;
  subscriptionExpiry?: string;
  registeredAt: string;
  avatar: string;
  totalScore: number;
  starsEarned: number;
  completedQuizzesCount: number;
  badges: string[];
  schoolName?: string;
  city?: string;
}

export interface SubscriptionRequest {
  id: string;
  studentId: string;
  studentName: string;
  username: string;
  gradeId: GradeId;
  requestDate: string;
  paymentMethod: 'zain_cash' | 'qi_card' | 'asia_cell' | 'cash_school';
  paymentPhoneOrRef?: string;
  status: 'pending' | 'approved' | 'rejected';
  amount: number;
  currency: string;
  notes?: string;
}

export interface SubscriptionConfig {
  price: number;
  currency: string;
  periodName: string;
  featureList: string[];
  zainCashWallet: string;
  qiCardNumber: string;
  supportPhone: string;
}

export interface ArabicLetterItem {
  id: string;
  letter: string;
  name: string;
  soundDescription: string;
  fatha: string;
  damma: string;
  kasra: string;
  syllables: string[];
  sampleWords: { word: string; meaning: string; emoji: string }[];
}

export interface EnglishLetterItem {
  letterUpper: string;
  letterLower: string;
  phonicSound: string;
  sampleWord: string;
  arabicTranslation: string;
  emoji: string;
  exampleSentence: string;
}

export interface QuizAttempt {
  id: string;
  studentId: string;
  studentName: string;
  gradeId: GradeId;
  subjectId: string;
  subjectName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  stars: number;
  date: string;
}

export interface ScienceTopicItem {
  id: string;
  title: string;
  unitName: string;
  icon: string;
  summary: string;
  keyConcepts: { title: string; desc: string; emoji: string }[];
  funFact: string;
  voiceNote: string;
}

export interface CertificateData {
  studentName: string;
  gradeName: string;
  subjectName: string;
  score: number;
  total: number;
  percentage: number;
  date: string;
  stars: number;
  honorTitle: string;
}

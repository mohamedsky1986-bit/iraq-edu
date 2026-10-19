import type { GradeId, Question, SubscriptionType } from '../types/index.ts';

/**
 * Normalizes Arabic text by stripping diacritics (tashkeel),
 * standardizing different forms of Alif, Yaa, and Taa Marbuta.
 */
export function normalizeArabicText(text: string): string {
  if (!text) return '';
  return text
    // Remove diacritics / harakat
    .replace(/[\u064B-\u065F\u0670]/g, '')
    // Normalize Alefs
    .replace(/[أإآٱ]/g, 'ا')
    // Normalize Yaa / Alef Maqsura
    .replace(/[ىي]/g, 'ي')
    // Normalize Taa Marbuta
    .replace(/ة/g, 'ه')
    // Normalize Persian/Urdu kaf or gaf if present
    .replace(/ك/g, 'ك')
    .toLowerCase()
    .trim();
}

/**
 * Validates student registration fields.
 */
export function validateRegistration(data: {
  fullName?: string;
  username?: string;
  gradeId?: string;
}): { isValid: boolean; error?: string } {
  if (
    !data.fullName ||
    data.fullName.trim().length < 4 ||
    data.fullName.trim().split(/\s+/).length < 2
  ) {
    return { isValid: false, error: 'يرجى كتابة اسم الطالب الكامل (الثنائي أو الثلاثي على الأقل)' };
  }
  if (!data.username || data.username.trim().length < 3) {
    return { isValid: false, error: 'اسم المستخدم يجب ألا يقل عن 3 أحرف أو أرقام' };
  }
  const validGrades: GradeId[] = [
    'grade-1',
    'grade-2',
    'grade-3',
    'grade-4',
    'grade-5',
    'grade-6',
  ];
  if (!data.gradeId || !validGrades.includes(data.gradeId as GradeId)) {
    return { isValid: false, error: 'يرجى اختيار المرحلة الدراسية من الصف الأول إلى السادس' };
  }
  return { isValid: true };
}

/**
 * Validates admin authentication with username and password to prevent unauthorized access.
 */
export function validateAdminCredentials(
  inputUsername: string,
  inputPassword: string,
  expectedUsername: string,
  expectedPassword: string
): { isValid: boolean; error?: string } {
  const cleanInputUser = inputUsername.trim().toLowerCase();
  const cleanExpectedUser = expectedUsername.trim().toLowerCase();

  if (!cleanInputUser || !inputPassword) {
    return { isValid: false, error: 'يرجى كتابة اسم المشرف وكلمة المرور' };
  }
  if (cleanInputUser !== cleanExpectedUser) {
    return { isValid: false, error: 'اسم المشرف غير صحيح' };
  }
  if (inputPassword !== expectedPassword) {
    return { isValid: false, error: 'كلمة مرور المشرف غير صحيحة' };
  }
  return { isValid: true };
}

/**
 * Formats Iraqi Dinar currency amount.
 */
export function formatIraqiDinar(amount: number, currency: string = 'د.ع'): string {
  return `${amount.toLocaleString('ar-IQ')} ${currency}`;
}

/**
 * Filters questions strictly by student's grade, optional subject, and search query.
 */
export function filterQuestionsForStudent(
  questions: Question[],
  gradeId: GradeId,
  query?: string,
  subjectId?: string
): Question[] {
  return questions.filter((q) => {
    // Strict grade isolation
    if (q.gradeId !== gradeId) return false;

    // Subject filtering if selected
    if (subjectId && subjectId !== 'all' && q.subjectId !== subjectId) {
      return false;
    }

    // Query search with Arabic normalization
    if (query && query.trim() !== '') {
      const normalizedQuery = normalizeArabicText(query);
      const normalizedQuestion = normalizeArabicText(q.questionText);
      const normalizedAnswer = normalizeArabicText(q.answerText);
      const normalizedChapter = normalizeArabicText(q.chapter || '');
      const normalizedLesson = normalizeArabicText(q.lessonName || '');
      const matchTag = (q.tags || []).some((tag) =>
        normalizeArabicText(tag).includes(normalizedQuery)
      );

      const matches =
        normalizedQuestion.includes(normalizedQuery) ||
        normalizedAnswer.includes(normalizedQuery) ||
        normalizedChapter.includes(normalizedQuery) ||
        normalizedLesson.includes(normalizedQuery) ||
        matchTag;

      if (!matches) return false;
    }

    return true;
  });
}

/**
 * Checks if a student can access a specific question based on VIP / Free tier.
 */
export function canStudentAccessQuestion(
  question: Question,
  subscription: SubscriptionType
): boolean {
  if (!question.isVipOnly) return true;
  return subscription === 'paid';
}

export interface QuizEvaluationResult {
  correctCount: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  stars: number;
  appreciation: string;
  badgeEarned?: string;
}

/**
 * Calculates quiz evaluation score, stars, pass status, and encouraging Iraqi appreciation.
 */
export function calculateQuizEvaluation(
  userAnswers: Record<string, number>,
  questions: Question[]
): QuizEvaluationResult {
  const totalQuestions = questions.length;
  if (totalQuestions === 0) {
    return {
      correctCount: 0,
      totalQuestions: 0,
      percentage: 0,
      passed: false,
      stars: 0,
      appreciation: 'لا توجد أسئلة في هذا الاختبار',
    };
  }

  let correctCount = 0;
  for (const q of questions) {
    const selectedAnswer = userAnswers[q.id];
    if (selectedAnswer !== undefined && selectedAnswer === q.correctAnswerIndex) {
      correctCount++;
    }
  }

  const percentage = Math.round((correctCount / totalQuestions) * 100);
  const passed = percentage >= 50;

  let stars = 1;
  let appreciation = 'حاول مرة أخرى يا بطل، بالتركيز والمراجعة ستصل إلى النجاح!';
  let badgeEarned: string | undefined = undefined;

  if (percentage === 100) {
    stars = 5;
    appreciation = 'ما شاء الله! ممتاز جداً يا عبقري العراق، درجة كاملة بجدارة!';
    badgeEarned = 'وسام التميز الذهبي 🌟';
  } else if (percentage >= 85) {
    stars = 4;
    appreciation = 'رائع جداً! مستوى ممتاز وأداء متميز نفتخر بك يا بطل.';
    badgeEarned = 'وسام المتفوق الفضي 🥈';
  } else if (percentage >= 70) {
    stars = 3;
    appreciation = 'جيد جداً! إجابات صحيحة ومجهود رائع، واصل التقدم للأعلى.';
    badgeEarned = 'وسام الشجاعة والاجتهاد 🥉';
  } else if (percentage >= 50) {
    stars = 2;
    appreciation = 'أحسنت لقد اجتزت الاختبار بنجاح، راجع الأخطاء لتصبح من الأوائل.';
    badgeEarned = 'وسام المثابرة 🎖️';
  }

  return {
    correctCount,
    totalQuestions,
    percentage,
    passed,
    stars,
    appreciation,
    badgeEarned,
  };
}

/**
 * Gets Arabic display label for grade
 */
export function getIraqiGradeName(gradeId: GradeId): string {
  switch (gradeId) {
    case 'grade-1':
      return 'الصف الأول الابتدائي';
    case 'grade-2':
      return 'الصف الثاني الابتدائي';
    case 'grade-3':
      return 'الصف الثالث الابتدائي';
    case 'grade-4':
      return 'الصف الرابع الابتدائي';
    case 'grade-5':
      return 'الصف الخامس الابتدائي';
    case 'grade-6':
      return 'الصف السادس الابتدائي';
    default:
      return 'المرحلة الابتدائية';
  }
}

import type { GradeId, Question, SubscriptionType } from '../types/index.ts';

/**
 * Normalizes Arabic text by stripping diacritics (tashkeel),
 * standardizing different forms of Alif, Yaa, and Taa Marbuta,
 * removing punctuation, and converting Persian/Urdu variants.
 */
export function normalizeArabicText(text: string): string {
  if (!text) return '';
  return text
    // Remove diacritics / harakat / tashkeel
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    // Normalize Alefs
    .replace(/[أإآٱ]/g, 'ا')
    // Normalize Yaa / Alef Maqsura
    .replace(/[ىي]/g, 'ي')
    // Normalize Taa Marbuta to Ha
    .replace(/ة/g, 'ه')
    // Normalize punctuation
    .replace(/[.,،؛:!?؟()"'«»\-_/\\\[\]]/g, ' ')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .trim();
}

/**
 * Checks if a string contains any Arabic characters.
 */
export function containsArabicCharacters(text: string): boolean {
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(text);
}

/**
 * Validates student registration fields strictly.
 * - Grade must be selected first.
 * - Full name must be at least 3 characters.
 * - Username MUST be English letters, digits, and underscores only (min 3 chars).
 * - Password MUST be at least 6 characters.
 */
export function validateRegistration(data: {
  fullName?: string;
  username?: string;
  password?: string;
  gradeId?: string;
}): { isValid: boolean; error?: string } {
  const validGrades: GradeId[] = [
    'grade-1',
    'grade-2',
    'grade-3',
    'grade-4',
    'grade-5',
    'grade-6',
  ];
  if (!data.gradeId || !validGrades.includes(data.gradeId as GradeId)) {
    return { isValid: false, error: 'يرجى اختيار المرحلة الدراسية أولاً (من الصف الأول إلى السادس)' };
  }

  if (
    !data.fullName ||
    data.fullName.trim().length < 3 ||
    data.fullName.trim().split(/\s+/).length < 2
  ) {
    return { isValid: false, error: 'يرجى كتابة اسم الطالب الكامل (الثنائي أو الثلاثي على الأقل)' };
  }

  if (!data.username || data.username.trim().length < 3) {
    return { isValid: false, error: 'اسم المستخدم يجب ألا يقل عن 3 خانات' };
  }

  if (containsArabicCharacters(data.username)) {
    return {
      isValid: false,
      error: 'اسم المستخدم يقبل فقط حروف إنجليزية وأرقام (English letters only) بدون أحرف عربية',
    };
  }

  const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
  if (!usernameRegex.test(data.username.trim())) {
    return {
      isValid: false,
      error: 'اسم المستخدم يجب أن يحتوي على أحرف إنجليزية وأرقام فقط (مثال: ahmed_2026)',
    };
  }

  if (data.password !== undefined) {
    if (!data.password || data.password.length < 6) {
      return {
        isValid: false,
        error: 'كلمة المرور يجب أن تكون 6 خانات أو أرقام على الأقل لزيادة الأمان',
      };
    }
  }

  return { isValid: true };
}

/**
 * Result of flexible automated grading.
 */
export interface FlexibleGradingResult {
  isCorrect: boolean;
  isPartial: boolean;
  scoreRatio: number; // 1.0 = full, 0.5 = partial, 0 = incorrect
  earnedMarks: number; // calculated according to question maxMarks
  feedback: string;
  similarityPercentage: number;
}

/**
 * Grades written answers and definitions flexibly with tolerance for:
 * - Minor typos (missing dot, hamza, taa marbuta)
 * - Missing non-essential words
 * - Word order differences
 * - Partial definitions (awards partial credit)
 */
export function gradeFlexibleAnswer(
  studentInput: string,
  modelAnswer: string,
  maxMarks: number = 10,
  options?: string[],
  correctOptionIndex?: number
): FlexibleGradingResult {
  const normStudent = normalizeArabicText(studentInput);
  const normModel = normalizeArabicText(modelAnswer);

  if (!normStudent) {
    return {
      isCorrect: false,
      isPartial: false,
      scoreRatio: 0,
      earnedMarks: 0,
      feedback: 'لم تتم الإجابة بعد.',
      similarityPercentage: 0,
    };
  }

  // If student matched the exact correct option text
  if (options && correctOptionIndex !== undefined && options[correctOptionIndex]) {
    const normOption = normalizeArabicText(options[correctOptionIndex]);
    if (normStudent === normOption || normStudent.includes(normOption) || normOption.includes(normStudent)) {
      return {
        isCorrect: true,
        isPartial: false,
        scoreRatio: 1,
        earnedMarks: maxMarks,
        feedback: 'ما شاء الله! إجابة ممتازة ودقيقة 100% ⭐',
        similarityPercentage: 100,
      };
    }
  }

  // Exact normalized match
  if (normStudent === normModel) {
    return {
      isCorrect: true,
      isPartial: false,
      scoreRatio: 1,
      earnedMarks: maxMarks,
      feedback: 'إجابة نموذجية ممتازة وكاملة 100%! بارك الله فيك 🌟',
      similarityPercentage: 100,
    };
  }

  // Direct substring inclusion (if model answer is in student answer or vice versa)
  if (normStudent.includes(normModel) || normModel.includes(normStudent)) {
    const ratio = Math.min(normStudent.length, normModel.length) / Math.max(normStudent.length, normModel.length);
    if (ratio >= 0.7) {
      return {
        isCorrect: true,
        isPartial: false,
        scoreRatio: 1,
        earnedMarks: maxMarks,
        feedback: 'إجابة صحيحة وممتازة! أحسنت يا بطل ✨',
        similarityPercentage: Math.round(ratio * 100),
      };
    } else if (ratio >= 0.4) {
      return {
        isCorrect: false,
        isPartial: true,
        scoreRatio: 0.5,
        earnedMarks: Math.round(maxMarks * 0.5),
        feedback: 'إجابة صحيحة مع نقص بسيط في التعريف، أحسنت وراجع التكملة 👍',
        similarityPercentage: Math.round(ratio * 100),
      };
    }
  }

  // Token-based keyword matching (filtering common stop words)
  const stopWords = new Set([
    'هو', 'هي', 'هما', 'هم', 'هن', 'في', 'من', 'على', 'الى', 'عن', 'مع', 'ان',
    'الذي', 'التي', 'الذين', 'اللواتي', 'هذا', 'هذه', 'تلك', 'ذلك', 'كل', 'او', 'ثم',
    'و', 'ف', 'ب', 'ك', 'ل', 'كان', 'كانت', 'يكون', 'تكون'
  ]);

  const modelWords = normModel.split(/\s+/).filter((w) => w.length > 1 && !stopWords.has(w));
  const studentWords = normStudent.split(/\s+/).filter((w) => w.length > 1 && !stopWords.has(w));

  if (modelWords.length === 0) {
    return {
      isCorrect: true,
      isPartial: false,
      scoreRatio: 1,
      earnedMarks: maxMarks,
      feedback: 'إجابة مقبولة وصحيحة.',
      similarityPercentage: 100,
    };
  }

  // Count matched core keywords (allowing 1-character typo/fuzzy match)
  let matchedCount = 0;
  for (const mWord of modelWords) {
    const found = studentWords.some((sWord) => {
      if (sWord === mWord) return true;
      if (sWord.includes(mWord) || mWord.includes(sWord)) return true;
      // Levenshtein-like 1-char tolerance for typos (e.g. missing dot or letter)
      if (Math.abs(sWord.length - mWord.length) <= 1) {
        let diffs = 0;
        const minLen = Math.min(sWord.length, mWord.length);
        for (let i = 0; i < minLen; i++) {
          if (sWord[i] !== mWord[i]) diffs++;
        }
        diffs += Math.abs(sWord.length - mWord.length);
        if (diffs <= 1) return true;
      }
      return false;
    });
    if (found) matchedCount++;
  }

  const keywordRatio = matchedCount / modelWords.length;
  const similarityPct = Math.round(keywordRatio * 100);

  if (keywordRatio >= 0.7) {
    return {
      isCorrect: true,
      isPartial: false,
      scoreRatio: 1,
      earnedMarks: maxMarks,
      feedback: 'إجابة ممتازة وصحيحة وشاملة للمفاهيم الأساسية! ⭐',
      similarityPercentage: similarityPct,
    };
  } else if (keywordRatio >= 0.4) {
    const halfMarks = Math.max(1, Math.round(maxMarks * 0.5));
    return {
      isCorrect: false,
      isPartial: true,
      scoreRatio: 0.5,
      earnedMarks: halfMarks,
      feedback: 'إجابة مقبولة بوجود المفاهيم الأساسية مع نقص في بعض الكلمات (درجة جزئية) 👍',
      similarityPercentage: similarityPct,
    };
  } else {
    return {
      isCorrect: false,
      isPartial: false,
      scoreRatio: 0,
      earnedMarks: 0,
      feedback: 'إجابة غير مكتملة أو لم تتطابق مع المفهوم المطلوب. راجع الجواب النموذجي للتركيز 💡',
      similarityPercentage: similarityPct,
    };
  }
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
  partialCount: number;
  mistakeCount: number;
  totalQuestions: number;
  totalScore: number;
  maxPossibleScore: number;
  percentage: number;
  passed: boolean;
  stars: number;
  appreciation: string;
  badgeEarned?: string;
  mistakenQuestions: Question[];
}

/**
 * Calculates quiz evaluation score, stars, pass status, and encouraging Iraqi appreciation.
 * Supports both choice indices and written flexible answers.
 */
export function calculateQuizEvaluation(
  userAnswers: Record<string, number>,
  questions: Question[],
  writtenAnswers?: Record<string, string>,
  marksPerQuestion: number = 10
): QuizEvaluationResult {
  const totalQuestions = questions.length;
  const maxPossibleScore = totalQuestions * marksPerQuestion;

  if (totalQuestions === 0) {
    return {
      correctCount: 0,
      partialCount: 0,
      mistakeCount: 0,
      totalQuestions: 0,
      totalScore: 0,
      maxPossibleScore: 0,
      percentage: 0,
      passed: false,
      stars: 0,
      appreciation: 'لا توجد أسئلة في هذا الاختبار',
      mistakenQuestions: [],
    };
  }

  let correctCount = 0;
  let partialCount = 0;
  let mistakeCount = 0;
  let totalScore = 0;
  const mistakenQuestions: Question[] = [];

  for (const q of questions) {
    const selectedOption = userAnswers[q.id];
    const writtenText = writtenAnswers ? writtenAnswers[q.id] : undefined;

    // Check if written answer was provided
    if (writtenText && writtenText.trim()) {
      const result = gradeFlexibleAnswer(
        writtenText,
        q.answerText,
        marksPerQuestion,
        q.options,
        q.correctAnswerIndex
      );

      totalScore += result.earnedMarks;

      if (result.isCorrect) {
        correctCount++;
      } else if (result.isPartial) {
        partialCount++;
        mistakenQuestions.push(q);
      } else {
        mistakeCount++;
        mistakenQuestions.push(q);
      }
    } else if (selectedOption !== undefined) {
      if (selectedOption === q.correctAnswerIndex) {
        correctCount++;
        totalScore += marksPerQuestion;
      } else {
        mistakeCount++;
        mistakenQuestions.push(q);
      }
    } else {
      mistakeCount++;
      mistakenQuestions.push(q);
    }
  }

  const percentage = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;
  const passed = percentage >= 50;

  let stars = 1;
  let appreciation = 'حاول مرة أخرى يا بطل، راجع الأسئلة الخاطئة وستصل إلى التفوق!';
  let badgeEarned: string | undefined = undefined;

  if (percentage === 100) {
    stars = 5;
    appreciation = 'ما شاء الله! ممتاز جداً يا عبقري العراق، درجة كاملة 100% بجدارة!';
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
    appreciation = 'أحسنت لقد اجتزت الاختبار بنجاح، أعد تدريب الأسئلة الخاطئة لتصبح من الأوائل.';
    badgeEarned = 'وسام المثابرة 🎖️';
  }

  return {
    correctCount,
    partialCount,
    mistakeCount,
    totalQuestions,
    totalScore,
    maxPossibleScore,
    percentage,
    passed,
    stars,
    appreciation,
    badgeEarned,
    mistakenQuestions,
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


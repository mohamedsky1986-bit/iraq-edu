import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeArabicText,
  validateRegistration,
  validateAdminCredentials,
  formatIraqiDinar,
  filterQuestionsForStudent,
  canStudentAccessQuestion,
  calculateQuizEvaluation,
  getIraqiGradeName,
} from './edu-logic.ts';
import type { Question } from '../types/index.ts';

test('normalizeArabicText strips diacritics and normalizes letters', () => {
  const raw = 'الْقِرَاءَةُ وَالْكِتَابَةُ لِلصَّفِّ الأَوَّلِ';
  const normalized = normalizeArabicText(raw);
  assert.equal(normalized.includes('َ'), false);
  assert.equal(normalized.includes('ِ'), false);
  assert.equal(normalized.includes('ُ'), false);
  assert.ok(normalized.includes('القراءه'));
});

test('validateRegistration requires valid name, username and primary grade', () => {
  // Empty
  const res1 = validateRegistration({});
  assert.equal(res1.isValid, false);

  // Short name
  const res2 = validateRegistration({ fullName: 'علي', username: 'ali12', gradeId: 'grade-1' });
  assert.equal(res2.isValid, false);

  // Valid
  const res4 = validateRegistration({
    fullName: 'علي محمد حمزة',
    username: 'ali_iraq',
    gradeId: 'grade-4',
  });
  assert.equal(res4.isValid, true);
});

test('validateAdminCredentials protects against unauthorized access', () => {
  // Wrong username
  const res1 = validateAdminCredentials('hacker', 'admin123', 'admin', 'admin123');
  assert.equal(res1.isValid, false);

  // Wrong password
  const res2 = validateAdminCredentials('admin', 'wrong_pass', 'admin', 'admin123');
  assert.equal(res2.isValid, false);

  // Correct credentials
  const res3 = validateAdminCredentials('admin', 'admin123', 'admin', 'admin123');
  assert.equal(res3.isValid, true);
});

test('formatIraqiDinar formats currency properly', () => {
  const formatted = formatIraqiDinar(15000, 'د.ع');
  assert.ok(formatted.includes('د.ع'));
});

test('filterQuestionsForStudent isolates student grade strictly', () => {
  const sampleQuestions: Question[] = [
    {
      id: 'q1',
      gradeId: 'grade-1',
      subjectId: 'arabic-1',
      chapter: 'دار دور',
      lessonName: 'حرف الدال',
      questionText: 'ما هي الكلمة التي تبدأ بحرف الدال؟',
      answerText: 'دار',
      options: ['دار', 'نار', 'ماء'],
      correctAnswerIndex: 0,
      explanation: 'كلمة دار تبدأ بحرف الدال (د).',
      isVipOnly: false,
      difficulty: 'easy',
      tags: ['حروف', 'قراءة'],
    },
    {
      id: 'q2',
      gradeId: 'grade-6',
      subjectId: 'arabic-6',
      chapter: 'المبتدأ والخبر',
      lessonName: 'الجملة الاسمية',
      questionText: 'ما إعراب المبتدأ في الجملة؟',
      answerText: 'مبتدأ مرفوع وعلامة رفعه الضمة الظاهرة',
      options: ['مرفوع بالضمة', 'منصوب بالفتحة', 'مجرور بالكسرة'],
      correctAnswerIndex: 0,
      explanation: 'المبتدأ اسم مرفوع تبدأ به الجملة الاسمية.',
      isVipOnly: false,
      difficulty: 'medium',
      tags: ['قواعد', 'إعراب'],
    },
  ];

  const grade1Questions = filterQuestionsForStudent(sampleQuestions, 'grade-1');
  assert.equal(grade1Questions.length, 1);
  assert.equal(grade1Questions[0].id, 'q1');

  const grade6Questions = filterQuestionsForStudent(sampleQuestions, 'grade-6');
  assert.equal(grade6Questions.length, 1);
  assert.equal(grade6Questions[0].id, 'q2');
});

test('canStudentAccessQuestion enforces VIP subscription rules', () => {
  const freeQuestion: Question = {
    id: 'f1',
    gradeId: 'grade-3',
    subjectId: 'math-3',
    chapter: 'الضرب',
    lessonName: 'جدول الضرب',
    questionText: '2 * 3 = ؟',
    answerText: '6',
    options: ['4', '5', '6'],
    correctAnswerIndex: 2,
    explanation: 'ضرب 2 في 3 يساوي 6',
    isVipOnly: false,
    difficulty: 'easy',
    tags: ['ضرب'],
  };

  const vipQuestion: Question = {
    ...freeQuestion,
    id: 'v1',
    isVipOnly: true,
  };

  assert.equal(canStudentAccessQuestion(freeQuestion, 'free'), true);
  assert.equal(canStudentAccessQuestion(freeQuestion, 'paid'), true);
  assert.equal(canStudentAccessQuestion(vipQuestion, 'free'), false);
  assert.equal(canStudentAccessQuestion(vipQuestion, 'paid'), true);
});

test('calculateQuizEvaluation calculates correct percentages, stars and Iraqi praise', () => {
  const dummyQuestions: Question[] = [
    {
      id: 'q1',
      gradeId: 'grade-1',
      subjectId: 'math-1',
      chapter: 'الأعداد',
      lessonName: 'العد',
      questionText: '1+1=؟',
      answerText: '2',
      options: ['1', '2', '3'],
      correctAnswerIndex: 1,
      explanation: '1+1=2',
      isVipOnly: false,
      difficulty: 'easy',
      tags: [],
    },
  ];

  const res100 = calculateQuizEvaluation({ q1: 1 }, dummyQuestions);
  assert.equal(res100.correctCount, 1);
  assert.equal(res100.percentage, 100);
  assert.equal(res100.stars, 5);
  assert.equal(res100.passed, true);
});

test('getIraqiGradeName maps all primary grades 1-6 correctly', () => {
  assert.equal(getIraqiGradeName('grade-1'), 'الصف الأول الابتدائي');
  assert.equal(getIraqiGradeName('grade-6'), 'الصف السادس الابتدائي');
});

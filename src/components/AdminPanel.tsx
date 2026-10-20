import React, { useState } from 'react';
import { useEdu } from '../context/EduContext';
import { GradeId, Question } from '../types/index';
import { GRADES_DATA } from '../data/initialData';
import { getIraqiGradeName } from '../utils/edu-logic';
import { playClickSound, playCorrectSound } from '../utils/audio';
import {
  Users, BookOpen, PlusCircle, KeyRound, Trash2, Edit3,
  Shield, CreditCard, X, CheckCheck, FolderPlus, Image,
  Palette, ArrowUp, ArrowDown, RotateCcw
} from 'lucide-react';

const OFFICIAL_IRAQI_SUBJECTS: Record<GradeId, { id: string; name: string }[]> = {
  'grade-1': [
    { id: 'sci-1', name: 'العلوم' },
    { id: 'ar-1', name: 'قراءتي (الحروف والمقاطع)' },
    { id: 'math-1', name: 'الرياضيات' },
    { id: 'isl-1', name: 'التربية الإسلامية' },
    { id: 'eng-1', name: 'اللغة الإنجليزية' },
  ],
  'grade-2': [
    { id: 'ar-2', name: 'قراءتي' },
    { id: 'math-2', name: 'الرياضيات' },
    { id: 'sci-2', name: 'العلوم' },
    { id: 'isl-2', name: 'التربية الإسلامية' },
    { id: 'eng-2', name: 'اللغة الإنجليزية' },
  ],
  'grade-3': [
    { id: 'ar-3', name: 'قراءتي' },
    { id: 'math-3', name: 'الرياضيات' },
    { id: 'sci-3', name: 'العلوم' },
    { id: 'isl-3', name: 'التربية الإسلامية' },
    { id: 'eng-3', name: 'اللغة الإنجليزية' },
  ],
  'grade-4': [
    { id: 'sci-4', name: 'العلوم' },
    { id: 'ar-4', name: 'قواعد العربية' },
    { id: 'math-4', name: 'الرياضيات' },
    { id: 'soc-4', name: 'الاجتماعيات' },
    { id: 'isl-4', name: 'التربية الإسلامية' },
    { id: 'eng-4', name: 'اللغة الإنجليزية' },
  ],
  'grade-5': [
    { id: 'ar-5', name: 'قواعد اللغة العربية' },
    { id: 'sci-5', name: 'العلوم' },
    { id: 'math-5', name: 'الرياضيات' },
    { id: 'soc-5', name: 'الاجتماعيات' },
    { id: 'isl-5', name: 'التربية الإسلامية' },
    { id: 'eng-5', name: 'اللغة الإنجليزية' },
  ],
  'grade-6': [
    { id: 'ar-6', name: 'قواعد العربية (وزاري)' },
    { id: 'sci-6', name: 'العلوم (وزاري)' },
    { id: 'math-6', name: 'الرياضيات (وزاري)' },
    { id: 'soc-6', name: 'الاجتماعيات (وزاري)' },
    { id: 'isl-6', name: 'التربية الإسلامية (وزاري)' },
    { id: 'eng-6', name: 'اللغة الإنجليزية (وزاري)' },
  ],
};

const DEFAULT_IRAQI_CHAPTERS: Record<string, string[]> = {
  'sci-1': [
    'الفصل الأول: الكائنات الحية وأجزاؤها',
    'الفصل الثاني: البيئة الطبيعية ومكوناتها',
    'الفصل الثالث: المادة وخصائصها',
    'الفصل الرابع: الحركة والقوة',
    'الفصل الخامس: الأرض والموارد الطبيعية',
  ],
  'ar-1': [
    'الفصل الأول: الحروف والمقاطع بالحركات',
    'الفصل الثاني: الكلمات والجمل البسيطة',
    'الفصل الثالث: القصص والمطالعة',
  ],
  'math-1': [
    'الفصل الأول: الأعداد من (1 إلى 9) ومفهوم الصفر',
    'الفصل الثاني: الجمع حتى العدد 9',
    'الفصل الثالث: الطرح حتى العدد 9',
    'الفصل الرابع: الأعداد حتى 20',
    'الفصل الخامس: الأشكال الهندسية والقياس',
  ],
  'isl-1': [
    'الفصل الأول: السور القرآنية والآداب الإسلامية',
    'الفصل الثاني: العقيدة وسيرة النبي محمد (ص)',
    'الفصل الثالث: الأخلاق والأدعية والحديث الشريف',
  ],
  'eng-1': [
    'Unit 1: Hello & Alphabet Phonics',
    'Unit 2: Numbers & Colors',
    'Unit 3: Family & Classroom Objects',
  ],
  'sci-2': [
    'الفصل الأول: أعضاء جسم الإنسان',
    'الفصل الثاني: الحفاظ على صحة الجسم',
    'الفصل الثالث: البيئة اليابسة والبيئة المائية',
    'الفصل الرابع: الغذاء والتغذية',
  ],
};

function isStudentOnline(st: any): boolean {
  if (!st || st.isOnline === false) return false;
  const lastActiveStr = st.lastActiveAt;
  if (!lastActiveStr) return false;
  try {
    const diffMs = Date.now() - new Date(lastActiveStr).getTime();
    return diffMs < 5 * 60 * 1000;
  } catch {
    return false;
  }
}

function formatAttendanceText(st: any): string {
  if (!st) return 'غير محدد';
  const lastActiveStr = st.lastActiveAt;
  if (!lastActiveStr) return 'لم يسجل دخول بعد';
  try {
    const d = new Date(lastActiveStr);
    if (isNaN(d.getTime())) return 'لم يسجل دخول بعد';
    const diffMs = Date.now() - d.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMinutes < 5) return 'متواجد الآن';
    if (diffMinutes < 60) return `منذ ${diffMinutes} دقيقة`;
    const now = new Date();
    if (diffHours < 24 && d.getDate() === now.getDate()) {
      return `اليوم ${d.toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' })}`;
    }
    if (diffHours < 48) {
      return `أمس ${d.toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' })}`;
    }
    return d.toLocaleDateString('ar-IQ', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return 'لم يسجل دخول بعد';
  }
}

function formatArabicDate(dateStr?: string) {
  if (!dateStr) return 'غير محدد';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('ar-IQ', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

function renderFormattedPreview(text: string) {
  if (!text) return '';
  const parts = text.split(/(\*\*.*?\*\*|==.*?==|«.*?»|[red].*?\[\/red\]|[blue].*?\[\/blue\]|[green].*?\[\/green\]|[purple].*?\[\/purple\]|[orange].*?\[\/orange\]|\.\.\.\.\.\.)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-black text-slate-950 underline decoration-amber-400 decoration-2">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('==') && part.endsWith('==')) {
      return <mark key={i} className="bg-amber-200 text-amber-950 px-1 rounded font-black">{part.slice(2, -2)}</mark>;
    }
    if (part.startsWith('[red]') && part.endsWith('[/red]')) {
      return <span key={i} className="text-rose-600 font-black">{part.slice(5, -6)}</span>;
    }
    if (part.startsWith('[blue]') && part.endsWith('[/blue]')) {
      return <span key={i} className="text-blue-600 font-black">{part.slice(6, -7)}</span>;
    }
    if (part.startsWith('[green]') && part.endsWith('[/green]')) {
      return <span key={i} className="text-emerald-600 font-black">{part.slice(7, -8)}</span>;
    }
    if (part.startsWith('[purple]') && part.endsWith('[/purple]')) {
      return <span key={i} className="text-purple-600 font-black">{part.slice(8, -9)}</span>;
    }
    if (part.startsWith('[orange]') && part.endsWith('[/orange]')) {
      return <span key={i} className="text-amber-600 font-black">{part.slice(8, -9)}</span>;
    }
    if (part.startsWith('«') && part.endsWith('»')) {
      return <span key={i} className="text-emerald-800 font-serif font-bold">{part}</span>;
    }
    if (part === '......') {
      return <span key={i} className="px-2 font-mono font-black text-amber-600 bg-amber-50 border-b border-dashed border-amber-500">......</span>;
    }
    return part;
  });
}

export const AdminPanel: React.FC = () => {
  const {
    students, questions, adminUsername, subscriptionConfig, subscriptionRequests,
    toggleStudentSubscription, resetStudentPassword, deleteStudent, addQuestion,
    updateQuestion, deleteQuestion, changeAdminCredentials, updateSubscriptionConfig,
    approveSubscriptionRequest, rejectSubscriptionRequest, logoutAdmin
  } = useEdu();

  const [activeTab, setActiveTab] = useState<'curriculum' | 'students' | 'requests' | 'pricing' | 'security'>('curriculum');
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('all');

  const [questionGradeFilter, setQuestionGradeFilter] = useState<GradeId>('grade-1');
  const [questionSubjectFilter, setQuestionSubjectFilter] = useState<string>('sci-1');
  const [questionSearchQuery, setQuestionSearchQuery] = useState<string>('');

  const [chaptersMap, setChaptersMap] = useState<Record<string, string[]>>(() => {
    try {
      const saved = localStorage.getItem('iraq_edu_subject_chapters_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {};
  });

  const [newChapterInput, setNewChapterInput] = useState('');
  const [isAddingChapter, setIsAddingChapter] = useState(false);
  const [editingChapterName, setEditingChapterName] = useState<string | null>(null);
  const [renameInput, setRenameInput] = useState('');

  const currentGradeSubjects = OFFICIAL_IRAQI_SUBJECTS[questionGradeFilter] || [];
  const currentSubjectObj = currentGradeSubjects.find((s) => s.id === questionSubjectFilter) || currentGradeSubjects[0];

  const getSubjectChapters = (subjectId: string): string[] => {
    if (chaptersMap[subjectId] && chaptersMap[subjectId].length > 0) {
      return chaptersMap[subjectId];
    }
    const defaults = DEFAULT_IRAQI_CHAPTERS[subjectId] || [
      'الفصل الأول: المفاهيم الأساسية والبداية',
      'الفصل الثاني: الدروس التطبيقية والأنشطة',
      'الفصل الثالث: مراجعة شاملة ونصف السنة',
      'الفصل الرابع: الاختبارات والوزاريات النهائية',
    ];
    return defaults;
  };

  const subjectChapters = getSubjectChapters(currentSubjectObj?.id || '');

  const filteredQuestions = questions.filter((q) => {
    if (q.gradeId !== questionGradeFilter) return false;
    if (q.subjectId !== (currentSubjectObj?.id || '')) return false;
    if (questionSearchQuery.trim()) {
      const query = questionSearchQuery.toLowerCase();
      const matchText = q.questionText.toLowerCase().includes(query) || q.answerText.toLowerCase().includes(query);
      if (!matchText) return false;
    }
    return true;
  });

  const handleAddNewChapter = () => {
    if (!newChapterInput.trim() || !currentSubjectObj) return;
    const subjId = currentSubjectObj.id;
    const currentList = getSubjectChapters(subjId);
    const updated = {
      ...chaptersMap,
      [subjId]: [...currentList, newChapterInput.trim()],
    };
    setChaptersMap(updated);
    try {
      localStorage.setItem('iraq_edu_subject_chapters_v2', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    setNewChapterInput('');
    setIsAddingChapter(false);
    playCorrectSound();
  };

  const handleSaveRenameChapter = () => {
    if (!editingChapterName || !renameInput.trim() || !currentSubjectObj) return;
    const subjId = currentSubjectObj.id;
    const currentList = getSubjectChapters(subjId);
    const newName = renameInput.trim();
    const updatedList = currentList.map((c) => (c === editingChapterName ? newName : c));
    const updated = {
      ...chaptersMap,
      [subjId]: updatedList,
    };
    setChaptersMap(updated);
    try {
      localStorage.setItem('iraq_edu_subject_chapters_v2', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    const questionsToUpdate = questions.filter(
      (q) => q.gradeId === questionGradeFilter && q.subjectId === subjId && q.chapter === editingChapterName
    );
    questionsToUpdate.forEach((q) => {
      updateQuestion(q.id, { chapter: newName });
    });

    setEditingChapterName(null);
    setRenameInput('');
    playCorrectSound();
  };

  const handleDeleteChapter = (chapName: string) => {
    if (!currentSubjectObj) return;
    if (!confirm(`هل أنت متأكد من حذف فصل (${chapName}) وجميع الأسئلة التابعة له؟`)) return;
    const subjId = currentSubjectObj.id;
    const currentList = getSubjectChapters(subjId);
    const updatedList = currentList.filter((c) => c !== chapName);
    const updated = {
      ...chaptersMap,
      [subjId]: updatedList,
    };
    setChaptersMap(updated);
    try {
      localStorage.setItem('iraq_edu_subject_chapters_v2', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    const questionsToDelete = questions.filter(
      (q) => q.gradeId === questionGradeFilter && q.subjectId === subjId && q.chapter === chapName
    );
    questionsToDelete.forEach((q) => {
      deleteQuestion(q.id);
    });

    playCorrectSound();
  };

  const handleMoveChapter = (index: number, direction: 'up' | 'down') => {
    if (!currentSubjectObj) return;
    const subjId = currentSubjectObj.id;
    const currentList = [...getSubjectChapters(subjId)];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentList.length) return;

    const temp = currentList[index];
    currentList[index] = currentList[targetIndex];
    currentList[targetIndex] = temp;

    const updated = {
      ...chaptersMap,
      [subjId]: currentList,
    };
    setChaptersMap(updated);
    try {
      localStorage.setItem('iraq_edu_subject_chapters_v2', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    playClickSound();
  };

  const handleResetChapters = () => {
    if (!currentSubjectObj) return;
    if (!confirm(`هل ترغب في استعادة ترتيب الفصول الافتراضية لمنهاج (${currentSubjectObj.name})؟`)) return;
    const subjId = currentSubjectObj.id;
    const updated = { ...chaptersMap };
    delete updated[subjId];
    setChaptersMap(updated);
    try {
      localStorage.setItem('iraq_edu_subject_chapters_v2', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    playCorrectSound();
  };

  // Modal State
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const [formQuestionType, setFormQuestionType] = useState<'multiple_choice' | 'qa' | 'fill_in_the_blank' | 'reasoning' | 'definition'>('qa');
  const [formBadgeType, setFormBadgeType] = useState<'none' | 'ministerial' | 'smart_challenge' | 'focus_tip'>('none');
  const [formGradeId, setFormGradeId] = useState<GradeId>('grade-1');
  const [formSubjectId, setFormSubjectId] = useState('sci-1');
  const [formChapter, setFormChapter] = useState('');
  const [formLessonName, setFormLessonName] = useState('');
  const [formQuestionText, setFormQuestionText] = useState('');
  const [formAnswerText, setFormAnswerText] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formOptions, setFormOptions] = useState<string[]>(['', '', '', '']);
  const [formCorrectIndex, setFormCorrectIndex] = useState(0);
  const [formExplanation, setFormExplanation] = useState('');
  const [formIsVipOnly, setFormIsVipOnly] = useState(false);

  const [newPrice, setNewPrice] = useState(subscriptionConfig.price);
  const [newCurrency, setNewCurrency] = useState(subscriptionConfig.currency);
  const [newPeriodName, setNewPeriodName] = useState(subscriptionConfig.periodName);
  const [newZainWallet, setNewZainWallet] = useState(subscriptionConfig.zainCashWallet);
  const [newQiCard, setNewQiCard] = useState(subscriptionConfig.qiCardNumber);
  const [pricingFeedback, setPricingFeedback] = useState(false);

  const [newAdminUser, setNewAdminUser] = useState(adminUsername);
  const [newAdminPass, setNewAdminPass] = useState('');
  const [securityFeedback, setSecurityFeedback] = useState<string | null>(null);

  const filteredStudents = students.filter((st) => {
    const matchSearch = st.fullName.toLowerCase().includes(studentSearch.toLowerCase()) || st.username.toLowerCase().includes(studentSearch.toLowerCase());
    const matchGrade = selectedGradeFilter === 'all' || st.gradeId === selectedGradeFilter;
    return matchSearch && matchGrade;
  });

  const openCreateQuestionForChapter = (chapterName: string) => {
    setEditingQuestion(null);
    setFormQuestionType('qa');
    setFormBadgeType('none');
    setFormGradeId(questionGradeFilter);
    setFormSubjectId(currentSubjectObj?.id || 'sci-1');
    setFormChapter(chapterName);
    setFormLessonName('');
    setFormQuestionText('');
    setFormAnswerText('');
    setFormImageUrl('');
    setFormOptions(['', '', '', '']);
    setFormCorrectIndex(0);
    setFormExplanation('');
    setFormIsVipOnly(false);
    setIsQuestionModalOpen(true);
  };

  const openEditQuestion = (q: Question) => {
    setEditingQuestion(q);
    setFormQuestionType((q.questionType as any) || (q.options && q.options.length >= 2 ? 'multiple_choice' : 'qa'));
    setFormBadgeType((q as any).badgeType || 'none');
    setFormGradeId(q.gradeId);
    setFormSubjectId(q.subjectId);
    setFormChapter(q.chapter || '');
    setFormLessonName(q.lessonName || '');
    setFormQuestionText(q.questionText);
    setFormAnswerText(q.answerText);
    setFormImageUrl((q as any).imageUrl || '');
    setFormOptions(q.options && q.options.length >= 2 ? [...q.options] : ['', '', '', '']);
    setFormCorrectIndex(q.correctAnswerIndex ?? 0);
    setFormExplanation(q.explanation || '');
    setFormIsVipOnly(q.isVipOnly);
    setIsQuestionModalOpen(true);
  };

  const insertTextFormatting = (syntax: string, target: 'question' | 'answer' = 'question') => {
    playClickSound();
    if (target === 'question') {
      setFormQuestionText((prev) => (prev ? prev + ' ' + syntax : syntax));
    } else {
      setFormAnswerText((prev) => (prev ? prev + ' ' + syntax : syntax));
    }
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formQuestionText.trim() || !formAnswerText.trim()) {
      return alert('يرجى كتابة نص السؤال والجواب النموذجي');
    }

    const payload: any = {
      gradeId: formGradeId,
      subjectId: formSubjectId,
      chapter: formChapter.trim() || (subjectChapters[0] || 'الفصل الأول'),
      lessonName: formLessonName.trim(),
      questionText: formQuestionText.trim(),
      answerText: formAnswerText.trim(),
      imageUrl: formImageUrl.trim() || undefined,
      options: formQuestionType === 'multiple_choice' ? formOptions.filter((o) => o.trim()) : [],
      correctAnswerIndex: formCorrectIndex,
      explanation: formExplanation.trim(),
      isVipOnly: formIsVipOnly,
      difficulty: 'medium',
      tags: [getIraqiGradeName(formGradeId), formQuestionType],
      questionType: formQuestionType,
      badgeType: formBadgeType,
    };

    if (editingQuestion) updateQuestion(editingQuestion.id, payload);
    else addQuestion(payload);
    playCorrectSound();
    setIsQuestionModalOpen(false);
  };

  const handleSavePricing = (e: React.FormEvent) => {
    e.preventDefault();
    updateSubscriptionConfig({ price: Number(newPrice), currency: newCurrency, periodName: newPeriodName, zainCashWallet: newZainWallet, qiCardNumber: newQiCard });
    playCorrectSound();
    setPricingFeedback(true);
    setTimeout(() => setPricingFeedback(false), 3000);
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminUser.trim() || !newAdminPass.trim()) return alert('يرجى ملء الحقول');
    changeAdminCredentials(newAdminUser.trim(), newAdminPass.trim());
    playCorrectSound();
    setSecurityFeedback('تم تحديث بيانات الدخول بنجاح ✓');
    setNewAdminPass('');
    setTimeout(() => setSecurityFeedback(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 sm:px-4 text-center sm:text-right">
      <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div>
          <h1 className="text-xl sm:text-2xl font-black">لوحة الإشراف وإدارة منصة المتفوق</h1>
          <p className="text-xs text-slate-400">إدارة الأسئلة مرتبة بالفصول، التعاليل، التعاريف، وحضور الطلاب</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => { playClickSound(); logoutAdmin(); }}
            className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-black flex items-center gap-1.5 cursor-pointer border border-slate-700 shadow-xs"
          >
            <span>← خروج وعودة للمنصة</span>
          </button>
          <button
            onClick={() => openCreateQuestionForChapter(subjectChapters[0] || 'الفصل الأول')}
            className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <PlusCircle className="w-4 h-4" />
            <span>إضافة سؤال جديد</span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
        {[
          { id: 'curriculum', label: 'بنك الأسئلة والفصول', icon: BookOpen, count: questions.length },
          { id: 'students', label: 'الطلاب المشتركون والحضور', icon: Users, count: students.length },
          { id: 'requests', label: 'طلبات الاشتراك', icon: CheckCheck, count: subscriptionRequests.filter(r => r.status === 'pending').length },
          { id: 'pricing', label: 'تسعير المنهاج والدفع', icon: CreditCard },
          { id: 'security', label: 'حماية المشرف', icon: Shield },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => { playClickSound(); setActiveTab(t.id as any); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all ${
                isActive ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
              {t.count !== undefined && <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold">{t.count}</span>}
            </button>
          );
        })}
      </div>

      {activeTab === 'curriculum' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 space-y-6 text-right">
          <div className="p-4 rounded-2xl bg-linear-to-r from-emerald-50/70 to-teal-50/70 border border-emerald-200 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-black text-slate-800 mb-1">
                  1. حدد المرحلة الدراسية (الصف):
                </label>
                <select
                  value={questionGradeFilter}
                  onChange={(e) => {
                    const ng = e.target.value as GradeId;
                    setQuestionGradeFilter(ng);
                    const firstSubj = (OFFICIAL_IRAQI_SUBJECTS[ng] || [])[0]?.id || '';
                    setQuestionSubjectFilter(firstSubj);
                  }}
                  className="w-full p-2.5 rounded-xl border border-emerald-300 bg-white text-xs font-black text-slate-900 shadow-2xs cursor-pointer"
                >
                  {GRADES_DATA.map((g) => (
                    <option key={g.id} value={g.id}>{g.name} ({g.stageName})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-800 mb-1">
                  2. حدد المادة الدراسية المطلوبة:
                </label>
                <select
                  value={questionSubjectFilter}
                  onChange={(e) => setQuestionSubjectFilter(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-emerald-300 bg-white text-xs font-black text-slate-900 shadow-2xs cursor-pointer"
                >
                  {currentGradeSubjects.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-800 mb-1">
                  3. بحث سريع في أسئلة المادة:
                </label>
                <input
                  type="text"
                  placeholder="ابحث بكلمة من السؤال أو الجواب..."
                  value={questionSearchQuery}
                  onChange={(e) => setQuestionSearchQuery(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-emerald-300 bg-white text-xs font-bold text-slate-900 shadow-2xs text-right"
                />
              </div>
            </div>

            <div className="pt-2.5 border-t border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📖</span>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    منهاج {currentSubjectObj?.name} - {getIraqiGradeName(questionGradeFilter)}
                  </h3>
                  <p className="text-[11px] text-emerald-800 font-bold">
                    إجمالي الأسئلة: {filteredQuestions.length} سؤال موزعة على {subjectChapters.length} فصول مرتبة
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingChapter(true)}
                  className="px-3.5 py-2 rounded-xl bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-900 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <FolderPlus className="w-4 h-4 text-emerald-700" />
                  <span>➕ إضافة فصل جديد</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetChapters}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  title="استعادة الفصول النموذجية الافتراضية"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>استعادة الفصول الافتراضية</span>
                </button>

                <button
                  type="button"
                  onClick={() => openCreateQuestionForChapter(subjectChapters[0] || 'الفصل الأول')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>إضافة سؤال جديد</span>
                </button>
              </div>
            </div>

            {isAddingChapter && (
              <div className="p-3 bg-white rounded-xl border border-emerald-300 flex flex-col sm:flex-row items-center gap-2 mt-2 shadow-sm">
                <input
                  type="text"
                  placeholder="اكتب اسم الفصل الجديد (مثال: الفصل السادس: الفضاء والنجوم)..."
                  value={newChapterInput}
                  onChange={(e) => setNewChapterInput(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs font-bold"
                  autoFocus
                />
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleAddNewChapter}
                    className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-black shrink-0 cursor-pointer"
                  >
                    حفظ الفصل ✓
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingChapter(false)}
                    className="w-full sm:w-auto px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold shrink-0 cursor-pointer"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {subjectChapters.map((chapName, chapIdx) => {
              const chapterQuestions = filteredQuestions.filter((q) => q.chapter === chapName);
              const isRenaming = editingChapterName === chapName;

              return (
                <div key={chapIdx} className="rounded-3xl border border-slate-200 bg-slate-50/50 overflow-hidden shadow-2xs">
                  <div className="p-4 bg-slate-100/80 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 w-full sm:w-auto">
                      <span className="text-xl">📁</span>
                      {isRenaming ? (
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <input
                            type="text"
                            value={renameInput}
                            onChange={(e) => setRenameInput(e.target.value)}
                            className="p-1.5 px-3 rounded-lg border border-emerald-400 bg-white text-xs font-black text-slate-900 w-full sm:w-72"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={handleSaveRenameChapter}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shrink-0 cursor-pointer"
                          >
                            حفظ ✓
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingChapterName(null)}
                            className="px-2 py-1.5 rounded-lg bg-slate-200 text-slate-700 text-xs font-bold shrink-0 cursor-pointer"
                          >
                            إلغاء
                          </button>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                              #{chapIdx + 1}
                            </span>
                            <h4 className="font-black text-sm sm:text-base text-slate-900">
                              {chapName}
                            </h4>
                          </div>
                          <span className="text-[11px] font-bold text-slate-500">
                            {chapterQuestions.length} سؤال مضاف في هذا الفصل
                          </span>
                        </div>
                      )}
                    </div>

                    {!isRenaming && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden ml-1">
                          <button
                            type="button"
                            disabled={chapIdx === 0}
                            onClick={() => handleMoveChapter(chapIdx, 'up')}
                            className="p-1.5 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700"
                            title="تحريك الفصل للأعلى"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <div className="w-[1px] h-4 bg-slate-200" />
                          <button
                            type="button"
                            disabled={chapIdx === subjectChapters.length - 1}
                            onClick={() => handleMoveChapter(chapIdx, 'down')}
                            className="p-1.5 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700"
                            title="تحريك الفصل للأسفل"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => { setEditingChapterName(chapName); setRenameInput(chapName); }}
                          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                          title="تعديل اسم هذا الفصل"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteChapter(chapName)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                          title="حذف هذا الفصل وأسئلته"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => openCreateQuestionForChapter(chapName)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1 cursor-pointer shadow-2xs"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>إضافة سؤال للفصل</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    {chapterQuestions.length === 0 ? (
                      <div className="py-6 text-center text-slate-400 text-xs font-bold">
                        لا توجد أسئلة مضافة في هذا الفصل بعد. اضغط على زر "إضافة سؤال للفصل" لإضافة سؤال جديد.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {chapterQuestions.map((q) => (
                          <div key={q.id} className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 transition-all flex flex-col justify-between gap-2.5 text-right shadow-2xs">
                            <div>
                              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                                {q.questionType === 'reasoning' && <span className="text-[10px] bg-rose-100 text-rose-800 font-black px-1.5 py-0.5 rounded">علل 🧐</span>}
                                {q.questionType === 'definition' && <span className="text-[10px] bg-indigo-100 text-indigo-800 font-black px-1.5 py-0.5 rounded">تعريف 📖</span>}
                                {q.questionType === 'fill_in_the_blank' && <span className="text-[10px] bg-amber-100 text-amber-800 font-black px-1.5 py-0.5 rounded">فراغ ✏️</span>}
                                {q.questionType === 'qa' && <span className="text-[10px] bg-blue-100 text-blue-800 font-black px-1.5 py-0.5 rounded">س وج 📝</span>}
                                {q.questionType === 'multiple_choice' && <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-1.5 py-0.5 rounded">خيارات 🔘</span>}
                                {(q as any).badgeType === 'ministerial' && <span className="text-[10px] bg-amber-400 text-amber-950 font-black px-1.5 py-0.5 rounded">🌟 وزاري مرشح</span>}
                                {(q as any).badgeType === 'smart_challenge' && <span className="text-[10px] bg-purple-600 text-white font-black px-1.5 py-0.5 rounded">🎯 للأذكياء</span>}
                                {(q as any).badgeType === 'focus_tip' && <span className="text-[10px] bg-blue-600 text-white font-black px-1.5 py-0.5 rounded">💡 فهم وتركيز</span>}
                              </div>

                              <div className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                                {renderFormattedPreview(q.questionText)}
                              </div>

                              {(q as any).imageUrl && (
                                <div className="my-2 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 max-h-36">
                                  <img src={(q as any).imageUrl} alt="توضيح" className="w-full h-auto max-h-36 object-contain" />
                                </div>
                              )}

                              <div className="text-xs text-slate-700 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-medium leading-relaxed">
                                <span className="font-bold text-slate-900">الجواب: </span>
                                {renderFormattedPreview(q.answerText)}
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                              <span className="text-[10px] font-bold text-slate-400">{q.isVipOnly ? '⭐ VIP' : 'مجاني'}</span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => openEditQuestion(q)}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
                                >
                                  <Edit3 className="w-3.5 h-3.5" /> <span>تعديل</span>
                                </button>
                                <button
                                  onClick={() => { if (confirm('حذف هذا السؤال؟')) deleteQuestion(q.id); }}
                                  className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> <span>حذف</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'students' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <input type="text" placeholder="بحث عن طالب بالاسم أو اليوزر..." value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)} className="w-full sm:w-80 p-2.5 rounded-xl border border-slate-200 text-xs font-bold" />
            <select value={selectedGradeFilter} onChange={(e) => setSelectedGradeFilter(e.target.value)} className="p-2.5 rounded-xl border border-slate-200 text-xs font-bold w-full sm:w-auto">
              <option value="all">كل المراحل الدراسية</option>
              {GRADES_DATA.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-700 font-black bg-slate-50/80">
                  <th className="p-3">الطالب واسم المستخدم</th>
                  <th className="p-3">المرحلة الدراسية</th>
                  <th className="p-3">تاريخ التسجيل</th>
                  <th className="p-3">حالة التواجد (Online)</th>
                  <th className="p-3">حالة الاشتراك</th>
                  <th className="p-3 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((st) => (
                  <tr key={st.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-bold text-slate-900 flex items-center gap-2.5">
                      <span className="text-2xl p-1.5 rounded-xl bg-slate-100">{st.avatar}</span>
                      <div>
                        <div className="font-black text-sm text-slate-950">{st.fullName}</div>
                        <div className="text-[11px] text-emerald-700 font-bold font-mono">@{st.username}</div>
                        {st.schoolName && <div className="text-[10px] text-slate-400">🏫 {st.schoolName}</div>}
                      </div>
                    </td>
                    <td className="p-3 text-slate-700 font-bold whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-black text-[11px]">
                        {getIraqiGradeName(st.gradeId)}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-slate-400">📅</span>
                        <span>{formatArabicDate(st.registeredAt)}</span>
                      </div>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {isStudentOnline(st) ? (
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-black text-[11px] border border-emerald-300 shadow-2xs">
                            🟢 أونلاين (متصل الآن)
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0"></span>
                          <span className="text-[11px] text-slate-500 font-bold">آخر ظهور:</span>
                          <span className="text-[11px] text-slate-800 font-black">
                            {formatAttendanceText(st)}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black inline-flex items-center gap-1 ${
                        st.subscription === 'paid' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {st.subscription === 'paid' ? '⭐ VIP مفعل' : 'مجاني'}
                      </span>
                    </td>
                    <td className="p-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => toggleStudentSubscription(st.id)} className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-500 hover:bg-amber-600 text-white cursor-pointer shadow-2xs">
                          {st.subscription === 'paid' ? 'تحويل لمجاني' : 'تفعيل VIP'}
                        </button>
                        <button onClick={() => resetStudentPassword(st.id)} className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer" title="تصفير كلمة المرور"><KeyRound className="w-4 h-4" /></button>
                        <button onClick={() => { if (confirm('هل أنت متأكد من حذف الطالب؟')) deleteStudent(st.id); }} className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 cursor-pointer" title="حذف الطالب"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-3 text-right">
          <h2 className="text-sm font-black text-slate-800">طلبات التفعيل والاشتراك</h2>
          {subscriptionRequests.length === 0 ? <p className="text-xs text-slate-500 py-6 text-center">لا توجد طلبات حالياً.</p> : (
            subscriptionRequests.map((req) => (
              <div key={req.id} className="p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/60">
                <div><div className="font-black text-slate-900 text-sm">{req.studentName} (@{req.username})</div><div className="text-xs text-slate-500">{getIraqiGradeName(req.gradeId)} • حوالة: {req.paymentPhoneOrRef || 'غير محدد'}</div></div>
                <div className="flex items-center gap-2">
                  {req.status === 'pending' ? (
                    <>
                      <button onClick={() => approveSubscriptionRequest(req.id)} className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-black cursor-pointer">موافقة وتفعيل ✓</button>
                      <button onClick={() => rejectSubscriptionRequest(req.id)} className="px-2.5 py-1.5 rounded-xl bg-rose-100 text-rose-800 text-xs font-bold cursor-pointer">رفض</button>
                    </>
                  ) : <span className="text-xs font-bold text-slate-600">{req.status}</span>}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'pricing' && (
        <form onSubmit={handleSavePricing} className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 max-w-xl mx-auto text-right">
          <h2 className="text-sm font-black text-slate-800">تسعير المنهاج ومحافظ الدفع</h2>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs font-bold text-slate-700 mb-1">السعر</label><input type="number" value={newPrice} onChange={(e) => setNewPrice(Number(e.target.value))} className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold" /></div>
            <div><label className="block text-xs font-bold text-slate-700 mb-1">العملة</label><input type="text" value={newCurrency} onChange={(e) => setNewCurrency(e.target.value)} className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold" /></div>
          </div>
          <div><label className="block text-xs font-bold text-slate-700 mb-1">فترة الاشتراك</label><input type="text" value={newPeriodName} onChange={(e) => setNewPeriodName(e.target.value)} className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold" /></div>
          <div><label className="block text-xs font-bold text-slate-700 mb-1">محفظة زين كاش</label><input type="text" value={newZainWallet} onChange={(e) => setNewZainWallet(e.target.value)} className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold font-mono" /></div>
          <div><label className="block text-xs font-bold text-slate-700 mb-1">رقم بطاقة كي كارد</label><input type="text" value={newQiCard} onChange={(e) => setNewQiCard(e.target.value)} className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold font-mono" /></div>
          {pricingFeedback && <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold text-center">تم الحفظ بنجاح ✓</div>}
          <button type="submit" className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-black text-xs cursor-pointer">حفظ الأسعار والحسابات</button>
        </form>
      )}

      {activeTab === 'security' && (
        <form onSubmit={handleSaveSecurity} className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 max-w-md mx-auto text-right">
          <h2 className="text-sm font-black text-slate-800">بيانات دخول المشرف</h2>
          <div><label className="block text-xs font-bold text-slate-700 mb-1">اسم المشرف</label><input type="text" value={newAdminUser} onChange={(e) => setNewAdminUser(e.target.value)} className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold" /></div>
          <div><label className="block text-xs font-bold text-slate-700 mb-1">كلمة المرور الجديدة</label><input type="password" placeholder="اكتب كلمة مرور قوية..." value={newAdminPass} onChange={(e) => setNewAdminPass(e.target.value)} className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold" /></div>
          {securityFeedback && <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold text-center">{securityFeedback}</div>}
          <button type="submit" className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-black text-xs cursor-pointer">تحديث بيانات الدخول</button>
        </form>
      )}

      {isQuestionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/75 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 max-h-[94vh] overflow-y-auto text-right">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base">
                {editingQuestion ? 'تعديل السؤال / التعليل' : 'إضافة سؤال جديد لبنك المناهج'}
              </h3>
              <button onClick={() => setIsQuestionModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4 pt-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">نوع صياغة السؤال أو النمط:</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                  {[
                    { id: 'qa', label: '📝 سؤال وجواب', color: 'bg-blue-600' },
                    { id: 'reasoning', label: '🧐 تعليل (علل)', color: 'bg-rose-600' },
                    { id: 'definition', label: '📖 تعريف ومصطلح', color: 'bg-indigo-600' },
                    { id: 'fill_in_the_blank', label: '✏️ أكمل الفراغ', color: 'bg-amber-600' },
                    { id: 'multiple_choice', label: '🔘 خيارات تفاعلية', color: 'bg-emerald-600', span: 'col-span-2 sm:col-span-1' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => { playClickSound(); setFormQuestionType(t.id as any); }}
                      className={`py-2 px-1.5 rounded-xl text-xs font-black flex items-center justify-center gap-1 border cursor-pointer transition-all ${t.span || ''} ${
                        formQuestionType === t.id ? `${t.color} text-white shadow-xs` : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">وسام تمييز السؤال:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {[
                    { id: 'none', label: 'بدون وسام' },
                    { id: 'ministerial', label: '🌟 سؤال وزاري مرشح' },
                    { id: 'smart_challenge', label: '🎯 تحدي الأذكياء' },
                    { id: 'focus_tip', label: '💡 فهم وتركيز' }
                  ].map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setFormBadgeType(b.id as any)}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                        formBadgeType === b.id ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">المرحلة الدراسية:</label>
                  <select
                    value={formGradeId}
                    onChange={(e) => {
                      const ng = e.target.value as GradeId;
                      setFormGradeId(ng);
                      const ms = (OFFICIAL_IRAQI_SUBJECTS[ng] || [])[0];
                      if (ms) setFormSubjectId(ms.id);
                    }}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                  >
                    {GRADES_DATA.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">المادة الدراسية:</label>
                  <select
                    value={formSubjectId}
                    onChange={(e) => setFormSubjectId(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                  >
                    {(OFFICIAL_IRAQI_SUBJECTS[formGradeId] || []).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">الفصل المعتمد:</label>
                  <select
                    value={formChapter}
                    onChange={(e) => setFormChapter(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                  >
                    {subjectChapters.map((c, cIdx) => <option key={cIdx} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    {formQuestionType === 'reasoning' ? 'نص التعليل المطلوب (علل / اذكر السبب...):' : formQuestionType === 'definition' ? 'المصطلح المراد تعريفه (عرّف / ما المقصود بـ...):' : formQuestionType === 'fill_in_the_blank' ? 'نص جملة الفراغ (استخدم زر فراغ ......):' : 'نص السؤال (يقرأه النظام صوتياً):'}
                  </label>
                  <span className="text-[10px] text-slate-400">انقر على الأداة أو الرمز لإدراجه في النص:</span>
                </div>

                <div className="p-2.5 bg-slate-100/90 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex flex-wrap items-center gap-1 pb-1.5 border-b border-slate-200/80">
                    <span className="text-[10px] font-bold text-slate-500 ml-1 flex items-center gap-0.5">
                      <Palette className="w-3 h-3" /> ألوان الخط:
                    </span>
                    <button type="button" onClick={() => insertTextFormatting('[red]نص أحمر[/red]', 'question')} className="px-2 py-0.5 text-[10px] bg-rose-100 text-rose-800 rounded font-black hover:bg-rose-200 cursor-pointer">🔴 أحمر</button>
                    <button type="button" onClick={() => insertTextFormatting('[blue]نص أزرق[/blue]', 'question')} className="px-2 py-0.5 text-[10px] bg-blue-100 text-blue-800 rounded font-black hover:bg-blue-200 cursor-pointer">🔵 أزرق</button>
                    <button type="button" onClick={() => insertTextFormatting('[green]نص أخضر[/green]', 'question')} className="px-2 py-0.5 text-[10px] bg-emerald-100 text-emerald-800 rounded font-black hover:bg-emerald-200 cursor-pointer">🟢 أخضر</button>
                    <button type="button" onClick={() => insertTextFormatting('[purple]نص بنفسجي[/purple]', 'question')} className="px-2 py-0.5 text-[10px] bg-purple-100 text-purple-800 rounded font-black hover:bg-purple-200 cursor-pointer">🟣 بنفسجي</button>
                    <button type="button" onClick={() => insertTextFormatting('[orange]نص برتقالي[/orange]', 'question')} className="px-2 py-0.5 text-[10px] bg-amber-100 text-amber-800 rounded font-black hover:bg-amber-200 cursor-pointer">🟠 برتقالي</button>
                    <button type="button" onClick={() => insertTextFormatting('==تمييز أصفر==', 'question')} className="px-2 py-0.5 text-[10px] bg-amber-200 text-amber-950 rounded font-black hover:bg-amber-300 cursor-pointer">🟡 تظليل</button>
                    <button type="button" onClick={() => insertTextFormatting('**خط عريض**', 'question')} className="px-2 py-0.5 text-[10px] bg-slate-200 text-slate-800 rounded font-black hover:bg-slate-300 cursor-pointer">B عريض</button>
                    <button type="button" onClick={() => insertTextFormatting(' ...... ', 'question')} className="px-2 py-0.5 text-[10px] bg-amber-100 text-amber-900 rounded font-mono font-bold hover:bg-amber-200 cursor-pointer">فراغ ......</button>
                    <button type="button" onClick={() => insertTextFormatting('«آية أو نص»', 'question')} className="px-2 py-0.5 text-[10px] bg-emerald-100 text-emerald-900 rounded font-serif hover:bg-emerald-200 cursor-pointer">«أقواس»</button>
                  </div>

                  <div className="space-y-1 pt-0.5">
                    <div className="flex flex-wrap items-center gap-1">
                      <span className="text-[10px] font-bold text-slate-500 ml-1">🔬 علوم وطبيعة:</span>
                      {['🌿', '🌴', '🦁', '🐪', '🐟', '🐦', '🌸', '🌾', '🔬', '🧪', '🧲', '💡', '⚡', '🌡️', '☀️', '💧', '🌍', '🫀', '🦴', '🦠'].map((icon, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => insertTextFormatting(` ${icon} `, 'question')}
                          className="w-6 h-6 rounded bg-white hover:bg-slate-200 border border-slate-200 text-xs flex items-center justify-center cursor-pointer transition-transform hover:scale-115"
                        >
                          {icon}
                        </button>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-1">
                      <span className="text-[10px] font-bold text-slate-500 ml-1">📖 لغة ورياضيات:</span>
                      {['📖', '📚', '✏️', '📝', '🧠', '🎯', '📐', '🔢', '➕', '➖', '✖️', '➗', '🌟', '⭐', '🏆', '🥇', '❓', '❗', '✓', '✗'].map((icon, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => insertTextFormatting(` ${icon} `, 'question')}
                          className="w-6 h-6 rounded bg-white hover:bg-slate-200 border border-slate-200 text-xs flex items-center justify-center cursor-pointer transition-transform hover:scale-115"
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <textarea
                  rows={3}
                  value={formQuestionText}
                  onChange={(e) => setFormQuestionText(e.target.value)}
                  placeholder="اكتب نص السؤال هنا واستخدم أدوات الألوان والتنسيق بالأعلى..."
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs font-bold leading-relaxed focus:border-emerald-500 outline-hidden"
                />

                {formQuestionText && (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-xs">
                    <span className="text-[10px] font-black text-slate-400 block mb-1">معاينة حية لشكل السؤال كما يراه الطالب:</span>
                    <div className="font-bold text-slate-900 leading-snug">{renderFormattedPreview(formQuestionText)}</div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Image className="w-3.5 h-3.5 text-slate-500" />
                  <span>رابط صورة أو رسم توضيحي للسؤال (اختياري):</span>
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/image.png (ضع رابط صورة علمية أو كرتونية إن وجدت)"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-left"
                  dir="ltr"
                />
                {formImageUrl && (
                  <div className="mt-2 p-2 bg-slate-50 rounded-xl border border-slate-200 max-w-xs mx-auto">
                    <img src={formImageUrl} alt="معاينة الصورة" className="w-full h-auto max-h-32 object-contain" onError={() => {}} />
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">
                    {formQuestionType === 'reasoning' ? 'السبب والتعليل النموذجي المعتمد وزارياً:' : formQuestionType === 'definition' ? 'التعريف والشرح العلمي/اللغوي الكامل المعتمد:' : formQuestionType === 'fill_in_the_blank' ? 'الكلمة أو العبارة الصحيحة لملء الفراغ:' : 'الجواب النموذجي المعتمد:'}
                  </label>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => insertTextFormatting('[green]إجابة صحيحة[/green]', 'answer')} className="px-1.5 py-0.5 text-[9px] bg-emerald-100 text-emerald-800 rounded font-black hover:bg-emerald-200 cursor-pointer">🟢 أخضر</button>
                    <button type="button" onClick={() => insertTextFormatting('**نص مميز**', 'answer')} className="px-1.5 py-0.5 text-[9px] bg-slate-200 text-slate-800 rounded font-bold hover:bg-slate-300 cursor-pointer">B عريض</button>
                    <button type="button" onClick={() => insertTextFormatting(' ✓ ', 'answer')} className="px-1.5 py-0.5 text-[9px] bg-emerald-50 text-emerald-700 rounded font-bold hover:bg-emerald-100 cursor-pointer">✓</button>
                  </div>
                </div>

                <textarea
                  rows={2}
                  value={formAnswerText}
                  onChange={(e) => setFormAnswerText(e.target.value)}
                  placeholder="اكتب الإجابة النموذجية الكاملة..."
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs font-bold leading-relaxed focus:border-emerald-500 outline-hidden"
                />

                {formAnswerText && (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-xs">
                    <span className="text-[10px] font-black text-slate-400 block mb-1">معاينة الجواب:</span>
                    <div className="font-medium text-slate-800 leading-snug">{renderFormattedPreview(formAnswerText)}</div>
                  </div>
                )}
              </div>

              {formQuestionType === 'multiple_choice' && (
                <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2">
                  <p className="text-xs font-black text-emerald-900">خيارات الاختبار (حدد الإجابة الصحيحة):</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {formOptions.map((opt, oIdx) => (
                      <div key={oIdx} className="flex items-center gap-1.5 bg-white p-2 rounded-xl border border-slate-200">
                        <input type="radio" name="correctRadio" checked={formCorrectIndex === oIdx} onChange={() => setFormCorrectIndex(oIdx)} className="w-4 h-4 text-emerald-600" />
                        <input type="text" placeholder={`الخيار ${oIdx + 1}...`} value={opt} onChange={(e) => { const u = [...formOptions]; u[oIdx] = e.target.value; setFormOptions(u); }} className="w-full text-xs font-bold outline-hidden" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <input type="checkbox" id="vipCheck" checked={formIsVipOnly} onChange={(e) => setFormIsVipOnly(e.target.checked)} className="w-4 h-4 text-emerald-600 rounded" />
                <label htmlFor="vipCheck" className="text-xs font-bold text-slate-700 cursor-pointer">مخصص للاشتراك المفعّل (VIP) فقط</label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsQuestionModalOpen(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 cursor-pointer">إلغاء</button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black cursor-pointer shadow-md">حفظ وتثبيت السؤال ✓</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;

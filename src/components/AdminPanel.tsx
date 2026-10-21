import React, { useState } from 'react';
import { useEdu } from '../context/EduContext';
import { GradeId, Question, Subject, SubscriptionType } from '../types/index';
import { GRADES_DATA } from '../data/initialData';
import { getIraqiGradeName, formatIraqiDinar } from '../utils/edu-logic';
import { playClickSound, playCorrectSound, playWrongSound } from '../utils/audio';
import {
  Users,
  BookOpen,
  PlusCircle,
  KeyRound,
  Trash2,
  Edit3,
  CheckCircle,
  Shield,
  Crown,
  Search,
  Check,
  X,
  CreditCard,
  DollarSign,
  Phone,
  UserCheck,
  AlertCircle,
  Clock,
  CheckCheck,
  Image,
} from 'lucide-react';

const OFFICIAL_IRAQI_SUBJECTS: Record<GradeId, { id: string; name: string }[]> = {
  "grade-1": [
    { id: "ar-1", name: "قراءتي (الحروف والأصوات والمقاطع)" },
    { id: "math-1", name: "الرياضيات" },
    { id: "sci-1", name: "العلوم" },
    { id: "isl-1", name: "التربية الإسلامية" },
    { id: "eng-1", name: "اللغة الإنجليزية (English)" },
  ],
  "grade-2": [
    { id: "ar-2", name: "قراءتي (اللغة العربية)" },
    { id: "math-2", name: "الرياضيات" },
    { id: "sci-2", name: "العلوم" },
    { id: "isl-2", name: "التربية الإسلامية" },
    { id: "eng-2", name: "اللغة الإنجليزية (English)" },
  ],
  "grade-3": [
    { id: "ar-3", name: "قراءتي (اللغة العربية)" },
    { id: "math-3", name: "الرياضيات" },
    { id: "sci-3", name: "العلوم" },
    { id: "isl-3", name: "التربية الإسلامية" },
    { id: "eng-3", name: "اللغة الإنجليزية (English)" },
  ],
  "grade-4": [
    { id: "ar-4", name: "قواعد اللغة العربية والمطالعة" },
    { id: "math-4", name: "الرياضيات" },
    { id: "sci-4", name: "العلوم" },
    { id: "soc-4", name: "الاجتماعيات" },
    { id: "isl-4", name: "التربية الإسلامية" },
    { id: "eng-4", name: "اللغة الإنجليزية (English)" },
  ],
  "grade-5": [
    { id: "ar-5", name: "قواعد اللغة العربية" },
    { id: "math-5", name: "الرياضيات" },
    { id: "sci-5", name: "العلوم" },
    { id: "soc-5", name: "الاجتماعيات" },
    { id: "isl-5", name: "التربية الإسلامية" },
    { id: "eng-5", name: "اللغة الإنجليزية (English)" },
  ],
  "grade-6": [
    { id: "ar-6", name: "قواعد اللغة العربية (وزاري)" },
    { id: "math-6", name: "الرياضيات (وزاري)" },
    { id: "sci-6", name: "العلوم (وزاري)" },
    { id: "soc-6", name: "الاجتماعيات (وزاري)" },
    { id: "isl-6", name: "التربية الإسلامية (وزاري)" },
    { id: "eng-6", name: "اللغة الإنجليزية (English for Iraq)" },
  ],
};

export const AdminPanel: React.FC = () => {
  const {
    students,
    questions,
    subjects,
    quizAttempts,
    adminUsername,
    subscriptionConfig,
    subscriptionRequests,
    toggleStudentSubscription,
    resetStudentPassword,
    deleteStudent,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    changeAdminCredentials,
    updateSubscriptionConfig,
    approveSubscriptionRequest,
    rejectSubscriptionRequest,
  } = useEdu();

  const [activeTab, setActiveTab] = useState<
    'students' | 'requests' | 'pricing' | 'curriculum' | 'security'
  >('curriculum');

  const [studentSearch, setStudentSearch] = useState('');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('all');

  const [newPrice, setNewPrice] = useState(subscriptionConfig.price);
  const [newCurrency, setNewCurrency] = useState(subscriptionConfig.currency);
  const [newPeriodName, setNewPeriodName] = useState(subscriptionConfig.periodName);
  const [newZainWallet, setNewZainWallet] = useState(subscriptionConfig.zainCashWallet);
  const [newQiCard, setNewQiCard] = useState(subscriptionConfig.qiCardNumber);
  const [pricingFeedback, setPricingFeedback] = useState(false);

  const [newAdminUser, setNewAdminUser] = useState(adminUsername);
  const [newAdminPass, setNewAdminPass] = useState('');
  const [securityFeedback, setSecurityFeedback] = useState<{ text: string; success: boolean } | null>(null);

  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const [formQuestionType, setFormQuestionType] = useState<'multiple_choice' | 'qa' | 'fill_in_the_blank'>('qa');
  const [formBadgeType, setFormBadgeType] = useState<'none' | 'ministerial' | 'smart_challenge' | 'focus_tip'>('none');
  const [isCustomSubject, setIsCustomSubject] = useState(false);
  const [customSubjectName, setCustomSubjectName] = useState('');
  const [formGradeId, setFormGradeId] = useState<GradeId>('grade-5');
  const [formSubjectId, setFormSubjectId] = useState<string>('ar-5');
  const [formChapter, setFormChapter] = useState('');
  const [formLesson, setFormLesson] = useState('');
  const [formQuestionText, setFormQuestionText] = useState('');
  const [formAnswerText, setFormAnswerText] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formOptions, setFormOptions] = useState<string[]>(['', '', '', '']);
  const [formCorrectIndex, setFormCorrectIndex] = useState(0);
  const [formExplanation, setFormExplanation] = useState('');
  const [formIsVipOnly, setFormIsVipOnly] = useState(false);
  const [formDifficulty, setFormDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  const filteredStudents = students.filter((s) => {
    const matchGrade = selectedGradeFilter === 'all' || s.gradeId === selectedGradeFilter;
    const matchSearch =
      s.fullName.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.username.toLowerCase().includes(studentSearch.toLowerCase());
    return matchGrade && matchSearch;
  });

  const [qGradeFilter, setQGradeFilter] = useState<string>('all');
  const filteredQuestions = questions.filter((q) => {
    return qGradeFilter === 'all' || q.gradeId === qGradeFilter;
  });

  const insertFormatting = (prefix: string, suffix: string, target: 'question' | 'answer') => {
    playClickSound();
    if (target === 'question') {
      setFormQuestionText((prev) => `${prev} ${prefix}نص${suffix}`.trim());
    } else {
      setFormAnswerText((prev) => `${prev} ${prefix}نص${suffix}`.trim());
    }
  };

  const insertBlank = () => {
    playClickSound();
    setFormQuestionText((prev) => `${prev} ...... `);
  };

  const handleOpenAddQuestion = () => {
    playClickSound();
    setEditingQuestion(null);
    setFormGradeId('grade-5');
    setFormSubjectId('ar-5');
    setIsCustomSubject(false);
    setCustomSubjectName('');
    setFormQuestionType('qa');
    setFormBadgeType('none');
    setFormChapter('');
    setFormLesson('');
    setFormQuestionText('');
    setFormAnswerText('');
    setFormImageUrl('');
    setFormOptions(['', '', '', '']);
    setFormCorrectIndex(0);
    setFormExplanation('');
    setFormIsVipOnly(false);
    setFormDifficulty('medium');
    setIsQuestionModalOpen(true);
  };

  const handleOpenEditQuestion = (q: Question) => {
    playClickSound();
    setEditingQuestion(q);
    setFormGradeId(q.gradeId);
    setFormSubjectId(q.subjectId);
    setIsCustomSubject(q.subjectId.startsWith('custom-'));
    setCustomSubjectName(q.subjectId.startsWith('custom-') ? q.subjectId.replace('custom-', '').replace(/-/g, ' ') : '');
    setFormQuestionType((q as any).questionType || (q.options && q.options.length >= 2 ? 'multiple_choice' : 'qa'));
    setFormBadgeType((q as any).badgeType || 'none');
    setFormChapter(q.chapter || '');
    setFormLesson(q.lessonName || '');
    setFormQuestionText(q.questionText);
    setFormAnswerText(q.answerText);
    setFormImageUrl((q as any).imageUrl || '');
    setFormOptions(q.options && q.options.length >= 2 ? q.options : ['', '', '', '']);
    setFormCorrectIndex(q.correctAnswerIndex ?? 0);
    setFormExplanation(q.explanation || '');
    setFormIsVipOnly(q.isVipOnly);
    setFormDifficulty(q.difficulty);
    setIsQuestionModalOpen(true);
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formQuestionText.trim() || !formAnswerText.trim()) {
      playWrongSound();
      alert('يرجى كتابة نص السؤال والجواب النموذجي أولاً');
      return;
    }

    try {
      const finalSubjectId = isCustomSubject && customSubjectName.trim()
        ? `custom-${customSubjectName.trim().toLowerCase().replace(/\s+/g, '-')}`
        : formSubjectId;

      let cleanOptions: string[] = [];
      if (formQuestionType === 'multiple_choice') {
        cleanOptions = formOptions.filter((opt) => opt.trim().length > 0);
        if (cleanOptions.length < 2) {
          cleanOptions = [formAnswerText.trim(), 'خيار 1', 'خيار 2'];
        }
      } else if (formQuestionType === 'fill_in_the_blank') {
        const customOpts = formOptions.filter((opt) => opt.trim().length > 0);
        cleanOptions = customOpts.length >= 2 ? customOpts : [formAnswerText.trim()];
      } else {
        cleanOptions = [];
      }

      const payload: any = {
        gradeId: formGradeId,
        subjectId: finalSubjectId,
        chapter: formChapter.trim() || 'الفصل الأول',
        lessonName: formLesson.trim(),
        questionText: formQuestionText.trim(),
        answerText: formAnswerText.trim(),
        options: cleanOptions,
        correctAnswerIndex: formCorrectIndex < cleanOptions.length ? formCorrectIndex : 0,
        explanation: formExplanation.trim(),
        isVipOnly: formIsVipOnly,
        difficulty: formDifficulty,
        questionType: formQuestionType,
        badgeType: formBadgeType,
        tags: [getIraqiGradeName(formGradeId), formBadgeType !== 'none' ? formBadgeType : ''].filter(Boolean),
      };

      // إذا كانت هناك صورة مضافة نضعها، وإذا كانت فارغة لا نمررها لكي ينحفظ السؤال بدون صورة
      if (formImageUrl.trim()) {
        payload.imageUrl = formImageUrl.trim();
      }

      if (editingQuestion) {
        updateQuestion(editingQuestion.id, payload);
      } else {
        addQuestion(payload);
      }

      playCorrectSound();
      setIsQuestionModalOpen(false);
      setEditingQuestion(null);
      alert('تم حفظ وتثبيت السؤال بنجاح في بنك الأسئلة وقاعدة البيانات! ✓');
    } catch (err: any) {
      console.error('Error saving question:', err);
      alert('حدث خطأ أثناء حفظ السؤال: ' + (err?.message || 'يرجى التأكد من البيانات'));
    }
  };

  const handleSavePricing = (e: React.FormEvent) => {
    e.preventDefault();
    updateSubscriptionConfig({
      price: Number(newPrice),
      currency: newCurrency.trim(),
      periodName: newPeriodName.trim(),
      zainCashWallet: newZainWallet.trim(),
      qiCardNumber: newQiCard.trim(),
    });
    playCorrectSound();
    setPricingFeedback(true);
    setTimeout(() => setPricingFeedback(false), 3000);
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminUser.trim() || newAdminUser.trim().length < 3) {
      playWrongSound();
      setSecurityFeedback({ text: 'اسم المشرف يجب ألا يقل عن 3 أحرف', success: false });
      return;
    }
    if (!newAdminPass || newAdminPass.trim().length < 4) {
      playWrongSound();
      setSecurityFeedback({ text: 'كلمة المرور يجب أن تتكون من 4 خانات على الأقل', success: false });
      return;
    }

    const success = changeAdminCredentials(newAdminUser.trim(), newAdminPass.trim());
    if (success) {
      playCorrectSound();
      setSecurityFeedback({
        text: 'تم تحديث اسم المشرف وكلمة المرور بنجاح في قاعدة البيانات السحابية 🔒',
        success: true,
      });
      setNewAdminPass('');
    } else {
      playWrongSound();
      setSecurityFeedback({ text: 'فشل تحديث البيانات', success: false });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-md">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black">
                  لوحة تحكم المشرف العام (Admin Control Center)
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  حساب محمي 🔒
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-1">
                مشرف المنصة: <strong className="text-rose-300 font-mono">{adminUsername}</strong> • إدارة كاملة للطلبة، الأسعار، المناهج والاشتراكات
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAddQuestion}
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>إضافة سؤال أو درس جديد</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-xs text-slate-400 font-bold block mb-1">إجمالي الطلبة المسجلين</span>
            <span className="text-2xl font-black text-white">{students.length}</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-xs text-slate-400 font-bold block mb-1">المشتركين المفعلين (VIP)</span>
            <span className="text-2xl font-black text-amber-400">
              {students.filter((s) => s.subscription === 'paid').length}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-xs text-slate-400 font-bold block mb-1">طلبات التفعيل المعلقة</span>
            <span className="text-2xl font-black text-rose-400">
              {subscriptionRequests.filter((r) => r.status === 'pending').length}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-xs text-slate-400 font-bold block mb-1">بنك الأسئلة والمناهج</span>
            <span className="text-2xl font-black text-emerald-400">{questions.length}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        <button
          onClick={() => {
            playClickSound();
            setActiveTab('curriculum');
          }}
          className={`px-4 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'curriculum'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <span>بنك المناهج وإضافة الأسئلة</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            setActiveTab('students');
          }}
          className={`px-4 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'students'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4 text-sky-400" />
          <span>إدارة الطلبة والاشتراكات ({students.length})</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            setActiveTab('requests');
          }}
          className={`px-4 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'requests'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CreditCard className="w-4 h-4 text-amber-400" />
          <span>طلبات الاشتراك ({subscriptionRequests.filter((r) => r.status === 'pending').length})</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            setActiveTab('pricing');
          }}
          className={`px-4 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'pricing'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <span>تعديل سعر الاشتراك والمدفوعات</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            setActiveTab('security');
          }}
          className={`px-4 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'security'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <KeyRound className="w-4 h-4 text-rose-400" />
          <span>الأمان والحماية</span>
        </button>
      </div>

      {activeTab === 'curriculum' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-bold">تصفية حسب الصف:</span>
              <select
                value={qGradeFilter}
                onChange={(e) => setQGradeFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold"
              >
                <option value="all">جميع الصفوف ({questions.length})</option>
                {GRADES_DATA.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} ({questions.filter((q) => q.gradeId === g.id).length})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleOpenAddQuestion}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>إضافة سؤال جديد (س وج / فراغات / اختبار)</span>
            </button>
          </div>

          <div className="space-y-3">
            {filteredQuestions.map((q) => (
              <div
                key={q.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {getIraqiGradeName(q.gradeId)}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {q.subjectId}
                    </span>
                    <span className="text-xs text-slate-500">
                      {q.chapter} {q.lessonName ? `• ${q.lessonName}` : ''}
                    </span>

                    {(q as any).imageUrl && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                        🖼️ يحتوي صورة
                      </span>
                    )}

                    {(q as any).badgeType === 'ministerial' ? (
                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 border border-amber-500">
                        🌟 وزاري مرشح
                      </span>
                    ) : (q as any).badgeType === 'smart_challenge' ? (
                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-purple-600 text-white">
                        🎯 للأذكياء
                      </span>
                    ) : (q as any).badgeType === 'focus_tip' ? (
                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-blue-600 text-white">
                        💡 فهم وتركيز
                      </span>
                    ) : null}

                    {q.questionType === 'fill_in_the_blank' ? (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                        ✏️ أكمل الفراغ
                      </span>
                    ) : q.questionType === 'qa' || (!q.options || q.options.length < 2) ? (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-300">
                        📝 سؤال وجواب
                      </span>
                    ) : (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                        🔘 اختبار خيارات
                      </span>
                    )}
                    {q.isVipOnly && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                        ⭐ مخصص لـ VIP
                      </span>
                    )}
                  </div>

                  <h3 className="font-black text-sm sm:text-base text-slate-900">
                    {q.questionText}
                  </h3>

                  {(q as any).imageUrl && (
                    <div className="py-1">
                      <img
                        src={(q as any).imageUrl}
                        alt="صورة توضيحية للسؤال"
                        className="max-h-24 rounded-lg border border-slate-200 object-contain"
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                      />
                    </div>
                  )}

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    <span className="font-bold text-emerald-800">الجواب المعتمد: </span>
                    {q.answerText}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleOpenEditQuestion(q)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 text-xs font-bold cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>تعديل</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('هل أنت متأكد من حذف هذا السؤال؟')) {
                        deleteQuestion(q.id);
                        playClickSound();
                      }
                    }}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 cursor-pointer"
                    title="حذف السؤال"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'students' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
            <div className="relative w-full sm:w-72">
              <Search className="absolute right-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="البحث باسم الطالب أو المستخدم..."
                className="w-full pr-10 pl-4 py-2 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-500 font-bold shrink-0">تصفية حسب الصف:</span>
              <select
                value={selectedGradeFilter}
                onChange={(e) => setSelectedGradeFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold w-full sm:w-auto"
              >
                <option value="all">جميع المراحل ({students.length})</option>
                {GRADES_DATA.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} ({students.filter((s) => s.gradeId === g.id).length})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-4">الطالب</th>
                    <th className="p-4">اسم المستخدم</th>
                    <th className="p-4">المرحلة الدراسية</th>
                    <th className="p-4">حالة الاشتراك</th>
                    <th className="p-4">النقاط والنجوم</th>
                    <th className="p-4 text-center">إجراءات الحساب</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 font-bold text-slate-900 flex items-center gap-2.5">
                        <span className="text-xl">{st.avatar}</span>
                        <div>
                          <div>{st.fullName}</div>
                          <span className="text-[10px] text-slate-400 font-normal">
                            {st.city || 'العراق'} • {st.schoolName || 'مدرسة ابتدائية'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-slate-600">{st.username}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                          {getIraqiGradeName(st.gradeId)}
                        </span>
                      </td>
                      <td className="p-4">
                        {st.subscription === 'paid' ? (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1 w-max">
                            <Crown className="w-3.5 h-3.5" /> اشتراك مفعل (VIP)
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
                            حساب مجاني
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-emerald-700">{st.totalScore} نقطة</div>
                        <div className="text-[10px] text-slate-400">{st.starsEarned} نجمة مكتسبة</div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => {
                              playClickSound();
                              toggleStudentSubscription(st.id);
                            }}
                            className={`px-3 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors ${
                              st.subscription === 'paid'
                                ? 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                            }`}
                          >
                            <Crown className="w-3.5 h-3.5" />
                            <span>{st.subscription === 'paid' ? 'إلغاء VIP' : 'تفعيل VIP'}</span>
                          </button>

                          <button
                            onClick={() => {
                              const newPass = prompt(`أدخل كلمة المرور الجديدة للطالب (${st.fullName}):`, '123');
                              if (newPass && newPass.trim()) {
                                resetStudentPassword(st.id, newPass.trim());
                                alert(`تم تعيين كلمة المرور الجديدة للطالب إلى: ${newPass.trim()}`);
                              }
                            }}
                            className="p-

import React, { useState } from 'react';
import { useEdu } from '../context/EduContext';
import { GradeId, Question, Subject, SubscriptionType } from '../types/index';
import { GRADES_DATA } from '../data/initialData';
import { getIraqiGradeName, formatIraqiDinar } from '../utils/edu-logic';
import { playClickSound, playCorrectSound, playWrongSound } from '../utils/audio';
import { EducationalVideo } from '../data/curriculumMedia';
import { VideoPlayerModal } from './VideoPlayerModal';
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
  LogOut,
  Tv,
  Play,
  Video,
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
    logoutAdmin,
    videos,
    addVideo,
    deleteVideo,
  } = useEdu();

  const [activeTab, setActiveTab] = useState<
    'students' | 'requests' | 'pricing' | 'curriculum' | 'security' | 'videos'
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

  // Video Management States
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<EducationalVideo | null>(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoGradeId, setVideoGradeId] = useState<GradeId>('grade-1');
  const [videoSubjectId, setVideoSubjectId] = useState('ar-1');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTeacher, setVideoTeacher] = useState('');
  const [videoDesc, setVideoDesc] = useState('');
  const [videoIsVipOnly, setVideoIsVipOnly] = useState(false);
  const [vGradeFilter, setVGradeFilter] = useState<string>('all');
  const [videoSearchQuery, setVideoSearchQuery] = useState('');

  const filteredVideos = (videos || []).filter((v) => {
    const matchGrade = vGradeFilter === 'all' || v.gradeId === vGradeFilter;
    const matchSearch =
      !videoSearchQuery.trim() ||
      v.title.toLowerCase().includes(videoSearchQuery.toLowerCase()) ||
      (v.teacherName && v.teacherName.toLowerCase().includes(videoSearchQuery.toLowerCase()));
    return matchGrade && matchSearch;
  });

  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle.trim()) {
      alert('يرجى كتابة عنوان الشرح المرئي');
      return;
    }
    if (!videoUrl.trim()) {
      alert('يرجى وضع رابط فيديو اليوتيوب');
      return;
    }
    addVideo({
      title: videoTitle.trim(),
      gradeId: videoGradeId,
      subjectId: videoSubjectId,
      youtubeUrl: videoUrl.trim(),
      teacherName: videoTeacher.trim(),
      description: videoDesc.trim(),
      isVipOnly: videoIsVipOnly,
    });
    playCorrectSound();
    setVideoTitle('');
    setVideoUrl('');
    setVideoTeacher('');
    setVideoDesc('');
    setIsVideoModalOpen(false);
    alert('تمت إضافة الفيديو بنجاح إلى قسم المرئيات والشروحات! ✓');
  };


  const filteredStudents = students.filter((s) => {
    const matchGrade = selectedGradeFilter === 'all' || s.gradeId === selectedGradeFilter;
    const matchSearch =
      s.fullName.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.username.toLowerCase().includes(studentSearch.toLowerCase());
    return matchGrade && matchSearch;
  });

  const [qGradeFilter, setQGradeFilter] = useState<string>('all');
  const [qSubjectFilter, setQSubjectFilter] = useState<string>('all');
  const [qSearchQuery, setQSearchQuery] = useState<string>('');

  const filteredQuestions = questions.filter((q) => {
    const matchGrade = qGradeFilter === 'all' || q.gradeId === qGradeFilter;
    const matchSubject = qSubjectFilter === 'all' || q.subjectId === qSubjectFilter;
    const matchSearch =
      !qSearchQuery.trim() ||
      q.questionText.toLowerCase().includes(qSearchQuery.toLowerCase()) ||
      q.answerText.toLowerCase().includes(qSearchQuery.toLowerCase());
    return matchGrade && matchSubject && matchSearch;
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

      // إذا كانت هناك صورة مضافة نضعها، وإذا كانت فارغة لا نمررها لتفادي أخطاء Firestore
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
              onClick={() => {
                playClickSound();
                logoutAdmin();
              }}
              className="px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/30 transition-all cursor-pointer"
              title="الخروج من لوحة التحكم والعودة كطالب أو زائر"
            >
              <LogOut className="w-4 h-4" />
              <span>خروج وعودة للمنصة</span>
            </button>
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
            setActiveTab('videos');
          }}
          className={`px-4 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'videos'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Tv className="w-4 h-4 text-rose-500" />
          <span>المرئيات والشروحات ({(videos || []).length})</span>
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
          {/* شريط التصفية والبحث المتطور (الصف + المادة + البحث النصي) */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-500 font-bold shrink-0">الصف:</span>
                  <select
                    value={qGradeFilter}
                    onChange={(e) => {
                      setQGradeFilter(e.target.value);
                      setQSubjectFilter('all');
                    }}
                    className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold cursor-pointer"
                  >
                    <option value="all">جميع الصفوف ({questions.length})</option>
                    {GRADES_DATA.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name} ({questions.filter((q) => q.gradeId === g.id).length})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-500 font-bold shrink-0">المادة:</span>
                  <select
                    value={qSubjectFilter}
                    onChange={(e) => setQSubjectFilter(e.target.value)}
                    className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold cursor-pointer"
                  >
                    <option value="all">
                      {qGradeFilter === 'all' ? 'جميع المواد الدراسية' : `جميع مواد ${getIraqiGradeName(qGradeFilter as GradeId)}`}
                    </option>
                    {(qGradeFilter !== 'all'
                      ? OFFICIAL_IRAQI_SUBJECTS[qGradeFilter as GradeId] || []
                      : Object.values(OFFICIAL_IRAQI_SUBJECTS).flat()
                    ).map((s) => {
                      const count = questions.filter(
                        (q) => (qGradeFilter === 'all' || q.gradeId === qGradeFilter) && q.subjectId === s.id
                      ).length;
                      return (
                        <option key={s.id} value={s.id}>
                          {s.name} ({count} سؤال)
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <button
                onClick={handleOpenAddQuestion}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                <span>إضافة سؤال جديد</span>
              </button>
            </div>

            <div className="relative">
              <Search className="absolute right-3.5 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={qSearchQuery}
                onChange={(e) => setQSearchQuery(e.target.value)}
                placeholder="ابحث عن نص سؤال، جواب، أو كلمة في الأسئلة المعروضة..."
                className="w-full pr-10 pl-4 py-2 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-emerald-500 bg-slate-50/50"
              />
            </div>
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
                        <div className="relative shrink-0">
                          <span className="text-xl">{st.avatar}</span>
                          {(st as any).isOnline && (
                            <span
                              className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full animate-pulse"
                              title="متصل الآن"
                            />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span>{st.fullName}</span>
                            {(st as any).isOnline ? (
                              <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                                🟢 أونلاين
                              </span>
                            ) : (st as any).lastActiveAt ? (
                              <span className="text-[9px] font-normal text-slate-400">
                                آخر ظهور: {new Date((st as any).lastActiveAt).toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            ) : null}
                          </div>
                          <span className="text-[10px] text-slate-400 font-normal block mt-0.5">
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
                            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
                            title="إعادة تعيين كلمة المرور"
                          >
                            <KeyRound className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`هل أنت متأكد من حذف حساب الطالب (${st.fullName})؟`)) {
                                deleteStudent(st.id);
                              }
                            }}
                            className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700"
                            title="حذف الطالب"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-black text-slate-900 text-base">
              طلبات اشتراك أولياء الأمور والطلبة (تأكيد الدفع)
            </h2>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900">
              {subscriptionRequests.filter((r) => r.status === 'pending').length} طلب بحاجة للموافقة
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-4">اسم الطالب</th>
                  <th className="p-4">المرحلة</th>
                  <th className="p-4">طريقة الدفع</th>
                  <th className="p-4">المبلغ</th>
                  <th className="p-4">ملاحظات / رقم الحوالة</th>
                  <th className="p-4">الحالة</th>
                  <th className="p-4 text-center">القرار</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subscriptionRequests.map((req) => (
                  <tr key={req.id}>
                    <td className="p-4 font-bold text-slate-900">
                      <div>{req.studentName}</div>
                      <span className="text-[10px] font-mono text-slate-400">@{req.username}</span>
                    </td>
                    <td className="p-4">{getIraqiGradeName(req.gradeId)}</td>
                    <td className="p-4 font-bold text-slate-700">
                      {req.paymentMethod === 'zain_cash'
                        ? 'محفظة زين كاش'
                        : req.paymentMethod === 'qi_card'
                        ? 'بطاقة كي كارد'
                        : req.paymentMethod === 'asia_cell'
                        ? 'رصيد آسياسيل'
                        : 'نقدي'}
                    </td>
                    <td className="p-4 font-black text-emerald-700">
                      {formatIraqiDinar(req.amount, req.currency)}
                    </td>
                    <td className="p-4 text-slate-600">
                      {req.paymentPhoneOrRef && (
                        <div className="font-mono text-slate-900">{req.paymentPhoneOrRef}</div>
                      )}
                      {req.notes && <div className="text-[11px] text-slate-500">{req.notes}</div>}
                    </td>
                    <td className="p-4">
                      {req.status === 'pending' ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 flex items-center gap-1 w-max">
                          <Clock className="w-3.5 h-3.5" /> بانتظار التأكيد
                        </span>
                      ) : req.status === 'approved' ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 flex items-center gap-1 w-max">
                          <Check className="w-3.5 h-3.5" /> تم التفعيل
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-900">
                          مرفوض
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      {req.status === 'pending' ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => {
                              playCorrectSound();
                              approveSubscriptionRequest(req.id);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[11px] flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCheck className="w-3.5 h-3.5" />
                            <span>قبول وتفعيل VIP</span>
                          </button>
                          <button
                            onClick={() => {
                              playClickSound();
                              rejectSubscriptionRequest(req.id);
                            }}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-100 text-rose-700 font-bold text-[11px] cursor-pointer"
                          >
                            رفض
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px] font-medium text-center block">مكتمل</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'pricing' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-2xl shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                إعدادات وتعديل سعر اشتراك المنهاج (VIP Pricing)
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                تعديل السعر يظهر فورياً لجميع الطلبة عند فتح نافذة الاشتراك
              </p>
            </div>
          </div>

          <form onSubmit={handleSavePricing} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  سعر الاشتراك (مبلغ رقمي)
                </label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(Number(e.target.value))}
                  placeholder="مثال: 15000"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 outline-none text-sm font-mono font-bold"
                  dir="ltr"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  العملة
                </label>
                <input
                  type="text"
                  value={newCurrency}
                  onChange={(e) => setNewCurrency(e.target.value)}
                  placeholder="د.ع"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 outline-none text-sm font-bold"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                مسمى فترة الاشتراك
              </label>
              <input
                type="text"
                value={newPeriodName}
                onChange={(e) => setNewPeriodName(e.target.value)}
                placeholder="مثال: اشتراك الفصل الدراسي الكامل أو اشتراك سنوي"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 outline-none text-xs sm:text-sm font-medium"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  رقم محفظة زين كاش (Zain Cash Wallet)
                </label>
                <div className="relative">
                  <Phone className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={newZainWallet}
                    onChange={(e) => setNewZainWallet(e.target.value)}
                    placeholder="مثال: 07801234567"
                    className="w-full pr-10 pl-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 outline-none text-xs sm:text-sm font-mono"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  رقم بطاقة كي كارد (Qi Card)
                </label>
                <div className="relative">
                  <CreditCard className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={newQiCard}
                    onChange={(e) => setNewQiCard(e.target.value)}
                    placeholder="رقم بطاقة أو حساب كي كارد"
                    className="w-full pr-10 pl-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 outline-none text-xs sm:text-sm font-mono"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>

            {pricingFeedback && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>تم تحديث سعر وبيانات الاشتراك بنجاح في المنصة!</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md transition-all cursor-pointer"
            >
              حفظ وتطبيق السعر الجديد في المنصة ✓
            </button>
          </form>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-xl shadow-xs space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shadow-xs">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-black text-slate-900 text-base sm:text-lg">
                تأمين وحماية حساب المشرف (اسم مستخدم + كلمة مرور)
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                تغيير اسم المشرف وكلمة المرور لمنع الاختراق وضمان أمان المنصة
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveCredentials} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                اسم المشرف الجديد (Admin Username)
              </label>
              <div className="relative">
                <UserCheck className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={newAdminUser}
                  onChange={(e) => setNewAdminUser(e.target.value)}
                  placeholder="اسم المستخدم الجديد"
                  className="w-full pr-10 pl-4 py-3 rounded-2xl border border-slate-200 focus:border-rose-500 outline-none text-xs sm:text-sm font-mono font-medium transition-all"
                  dir="ltr"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                كلمة المرور الجديدة (Admin Password)
              </label>
              <div className="relative">
                <KeyRound className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={newAdminPass}
                  onChange={(e) => setNewAdminPass(e.target.value)}
                  placeholder="اكتب كلمة مرور قوية جديدة"
                  className="w-full pr-10 pl-4 py-3 rounded-2xl border border-slate-200 focus:border-rose-500 outline-none text-xs sm:text-sm font-medium transition-all"
                  dir="ltr"
                  required
                />
              </div>
            </div>

            {securityFeedback && (
              <div
                className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                  securityFeedback.success
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                <span>{securityFeedback.success ? '✓' : '⚠️'}</span>
                <span>{securityFeedback.text}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm shadow-md transition-all cursor-pointer"
            >
              حفظ اسم المشرف وكلمة المرور وتأمين النظام 🔒
            </button>
          </form>
        </div>
      )}

      {activeTab === 'videos' && (
        <div className="space-y-6">
          {/* Top Video Header Banner */}
          <div className="bg-gradient-to-r from-rose-900 via-slate-900 to-indigo-950 p-6 sm:p-8 rounded-3xl text-white shadow-lg border border-rose-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1.5 text-center sm:text-right">
              <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-black inline-block mb-1">
                🎥 قسم الشروحات والفيديوهات التفاعلية
              </span>
              <h3 className="text-xl sm:text-2xl font-black">إدارة مكتبة مرئيات اليوتيوب التعليمية</h3>
              <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl">
                أضف دروس وشروحات اليوتيوب لتعرض للطلاب مباشرة داخل المنصة بدون إعلانات أو تشتت خارجي.
              </p>
            </div>

            <button
              onClick={() => {
                playClickSound();
                setVideoTitle('');
                setVideoUrl('');
                setVideoTeacher('');
                setVideoDesc('');
                setIsVideoModalOpen(true);
              }}
              className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs sm:text-sm shadow-lg flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap hover:scale-105 active:scale-95"
            >
              <PlusCircle className="w-5 h-5" />
              <span>إضافة شرح يوتيوب جديد</span>
            </button>
          </div>

          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-500 shrink-0">المرحلة:</span>
              <select
                value={vGradeFilter}
                onChange={(e) => setVGradeFilter(e.target.value)}
                className="p-2 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-800"
              >
                <option value="all">كل المراحل الدراسية</option>
                {GRADES_DATA.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={videoSearchQuery}
                onChange={(e) => setVideoSearchQuery(e.target.value)}
                placeholder="بحث في عناوين الدروس والشروحات..."
                className="w-full pr-9 pl-3 py-2 rounded-xl border border-slate-200 text-xs font-bold placeholder-slate-400 outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Videos Grid */}
          {filteredVideos.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
              <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto text-2xl">
                🎬
              </div>
              <h4 className="text-base font-black text-slate-800">لا توجد فيديوهات مضافة حالياً في هذا القسم</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                اضغط على زر (إضافة شرح يوتيوب جديد) بالأعلى لإدراج أول فيديو لشرح الدروس وسماع أصوات الحروف.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVideos.map((video) => (
                <div
                  key={video.id}
                  className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Thumbnail */}
                    <div
                      onClick={() => setPreviewVideo(video)}
                      className="relative aspect-video bg-slate-900 cursor-pointer overflow-hidden group/thumb"
                    >
                      <img
                        src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          // fallback placeholder if thumbnail fails
                          (e.target as any).src = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400';
                        }}
                      />
                      <div className="absolute inset-0 bg-slate-900/40 group-hover/thumb:bg-slate-900/20 transition-colors flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg group-hover/thumb:scale-110 transition-transform">
                          <Play className="w-6 h-6 fill-white ml-0.5" />
                        </div>
                      </div>
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-lg bg-black/70 text-white text-[10px] font-bold">
                        YouTube
                      </span>
                    </div>

                    {/* Details */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-black">
                          {getIraqiGradeName(video.gradeId)}
                        </span>
                        {video.teacherName && (
                          <span className="px-2 py-0.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
                            👨🏻‍🏫 {video.teacherName}
                          </span>
                        )}
                      </div>

                      <h4 className="font-black text-sm text-slate-900 line-clamp-2 leading-snug">
                        {video.title}
                      </h4>

                      {video.description && (
                        <p className="text-xs text-slate-500 font-medium line-clamp-2">
                          {video.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setPreviewVideo(video)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>معاينة وتشغيل</span>
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`هل أنت متأكد من حذف فيديو: "${video.title}"؟`)) {
                          deleteVideo(video.id);
                          playWrongSound();
                        }
                      }}
                      className="p-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 transition-all cursor-pointer"
                      title="حذف الفيديو"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Video Modal */}
          {isVideoModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
              <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                      <Tv className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-base">إضافة شرح مرئي تفاعلي</h3>
                      <p className="text-xs text-slate-500">اربط فيديو يوتيوب بالمادة والمرحلة المناسبة</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsVideoModalOpen(false)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveVideo} className="mt-5 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      عنوان الدرس / الشرح المرئي: *
                    </label>
                    <input
                      type="text"
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      placeholder="مثال: شرح درس حرف الباء بالحركات والأمثلة"
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">المرحلة الدراسية: *</label>
                      <select
                        value={videoGradeId}
                        onChange={(e) => {
                          const g = e.target.value as GradeId;
                          setVideoGradeId(g);
                          const subjs = OFFICIAL_IRAQI_SUBJECTS[g] || [];
                          if (subjs.length > 0) setVideoSubjectId(subjs[0].id);
                        }}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                      >
                        {GRADES_DATA.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">المادة الدراسية: *</label>
                      <select
                        value={videoSubjectId}
                        onChange={(e) => setVideoSubjectId(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                      >
                        {(OFFICIAL_IRAQI_SUBJECTS[videoGradeId] || []).map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      رابط فيديو اليوتيوب (YouTube URL): *
                    </label>
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://youtu.be/... أو https://www.youtube.com/watch?v=..."
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold text-left outline-none focus:border-rose-500"
                      dir="ltr"
                      required
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      يقبل أي رابط يوتيوب مباشر أو من الموبايل أو المعرف المكون من 11 رمزاً
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        اسم الأستاذ / القناة (اختياري):
                      </label>
                      <input
                        type="text"
                        value={videoTeacher}
                        onChange={(e) => setVideoTeacher(e.target.value)}
                        placeholder="مثال: أستاذ أحمد / شرح تفاعلي"
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        مستوى الوصول:
                      </label>
                      <div className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50">
                        <input
                          type="checkbox"
                          id="vidVipCheck"
                          checked={videoIsVipOnly}
                          onChange={(e) => setVideoIsVipOnly(e.target.checked)}
                          className="w-4 h-4 text-amber-600 rounded-sm cursor-pointer"
                        />
                        <label htmlFor="vidVipCheck" className="text-xs font-bold text-slate-800 cursor-pointer">
                          مخصص للـ VIP فقط
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      وصف مختصر عن محتوى الدرس (اختياري):
                    </label>
                    <textarea
                      value={videoDesc}
                      onChange={(e) => setVideoDesc(e.target.value)}
                      placeholder="اكتب نقاط رئيسية يركز عليها الفيديو..."
                      rows={2}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsVideoModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>تثبيت وإضافة الفيديو ✓</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {isQuestionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-lg">
                {editingQuestion ? 'تعديل السؤال والمنهاج' : 'إضافة سؤال جديد لبنك المناهج'}
              </h3>
              <button
                onClick={() => {
                  playClickSound();
                  setIsQuestionModalOpen(false);
                }}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="mt-5 space-y-4">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  نوع صياغة السؤال المطلوبة:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setFormQuestionType('qa');
                    }}
                    className={`py-2 px-2 sm:px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1 border transition-all cursor-pointer ${
                      formQuestionType === 'qa'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>📝 سؤال وجواب</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setFormQuestionType('fill_in_the_blank');
                    }}
                    className={`py-2 px-2 sm:px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1 border transition-all cursor-pointer ${
                      formQuestionType === 'fill_in_the_blank'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>✏️ أكمل الفراغ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setFormQuestionType('multiple_choice');
                    }}
                    className={`py-2 px-2 sm:px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1 border transition-all cursor-pointer ${
                      formQuestionType === 'multiple_choice'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>🔘 خيارات تفاعلية</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    المرحلة الدراسية
                  </label>
                  <select
                    value={formGradeId}
                    onChange={(e) => {
                      const newGrade = e.target.value as GradeId;
                      setFormGradeId(newGrade);
                      const matchingSubj = (OFFICIAL_IRAQI_SUBJECTS[newGrade] || [])[0];
                      if (matchingSubj) setFormSubjectId(matchingSubj.id);
                      setIsCustomSubject(false);
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                  >
                    {GRADES_DATA.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    المادة الدراسية (شاملة الإسلامية والإنجليزي ومواد مخصصة)
                  </label>
                  <select
                    value={isCustomSubject ? 'custom' : formSubjectId}
                    onChange={(e) => {
                      if (e.target.value === 'custom') {
                        setIsCustomSubject(true);
                      } else {
                        setIsCustomSubject(false);
                        setFormSubjectId(e.target.value);
                      }
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                  >
                    {(OFFICIAL_IRAQI_SUBJECTS[formGradeId] || []).map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                    <option value="custom">➕ مادة دراسية أخرى (مخصصة)...</option>
                  </select>

                  {isCustomSubject && (
                    <input
                      type="text"
                      value={customSubjectName}
                      onChange={(e) => setCustomSubjectName(e.target.value)}
                      placeholder="اكتب اسم المادة (مثال: الحاسوب، النشيد، التربية الفنية)..."
                      className="mt-2 w-full p-2.5 rounded-xl border border-emerald-300 bg-emerald-50/50 text-xs font-bold"
                      required
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    اسم الفصل أو الوحدة
                  </label>
                  <input
                    type="text"
                    value={formChapter}
                    onChange={(e) => setFormChapter(e.target.value)}
                    placeholder="مثال: الفصل الأول / الوحدة الأولى"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    اسم الدرس أو الموضوع
                  </label>
                  <input
                    type="text"
                    value={formLesson}
                    onChange={(e) => setFormLesson(e.target.value)}
                    placeholder="مثال: الفاعل / الملايين / البكتيريا"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-1.5">
                <label className="block text-xs font-bold text-amber-950">
                  شارة تمييز وأهمية السؤال في واجهة التلميذ:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setFormBadgeType('none');
                    }}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      formBadgeType === 'none'
                        ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    📌 سؤال عادي
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setFormBadgeType('ministerial');
                    }}
                    className={`py-1.5 px-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                      formBadgeType === 'ministerial'
                        ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                        : 'bg-white text-amber-900 border-amber-200 hover:bg-amber-100'
                    }`}
                  >
                    🌟 وزاري مرشح
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setFormBadgeType('smart_challenge');
                    }}
                    className={`py-1.5 px-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                      formBadgeType === 'smart_challenge'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-white text-purple-900 border-purple-200 hover:bg-purple-100'
                    }`}
                  >
                    🎯 للأذكياء
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setFormBadgeType('focus_tip');
                    }}
                    className={`py-1.5 px-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                      formBadgeType === 'focus_tip'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-blue-900 border-blue-200 hover:bg-blue-100'
                    }`}
                  >
                    💡 فهم وتركيز
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    {formQuestionType === 'fill_in_the_blank'
                      ? 'نص الجملة مع الفراغ:'
                      : 'نص السؤال (يقرأه النظام صوتياً للطفل):'}
                  </label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => insertFormatting('**', '**', 'question')}
                      className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-black cursor-pointer"
                      title="خط عريض"
                    >
                      B عريض
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('==', '==', 'question')}
                      className="px-2 py-0.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-[11px] font-bold cursor-pointer"
                      title="تظليل أصفر للكلمة"
                    >
                      🖍️ تظليل
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('«', '»', 'question')}
                      className="px-2 py-0.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-[11px] font-bold cursor-pointer"
                      title="أقواس آية أو حديث"
                    >
                      « »
                    </button>
                    <button
                      type="button"
                      onClick={insertBlank}
                      className="px-2 py-0.5 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-900 text-[11px] font-bold cursor-pointer"
                      title="إدراج نقاط فراغ"
                    >
                      ...... فراغ
                    </button>
                  </div>
                </div>
                <textarea
                  value={formQuestionText}
                  onChange={(e) => setFormQuestionText(e.target.value)}
                  placeholder={
                    formQuestionType === 'fill_in_the_blank'
                      ? 'مثال: عاصمة جمهورية العراق الحبيبة هي ......'
                      : 'مثال: ما هو تعريف الفاعل في قواعد اللغة العربية؟ / علل: لماذا سمي العراق ببلاد الرافدين؟'
                  }
                  rows={2}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium"
                  required
                />
              </div>

              {/* حقل رابط الصورة التوضيحية (اختياري) مع معاينة وزر حذف */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Image className="w-3.5 h-3.5 text-slate-500" />
                    <span>رابط صورة توضيحية للسؤال (اختياري):</span>
                  </label>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                    اتركه فارغاً إذا كان السؤال نصياً فقط ✓
                  </span>
                </div>
                <input
                  type="url"
                  placeholder="https://example.com/image.png (اختياري - اتركه فارغاً إذا لم توجد صورة)"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-left outline-none focus:border-emerald-500"
                  dir="ltr"
                />
                {formImageUrl && (
                  <div className="mt-2 p-2 bg-slate-50 rounded-xl border border-slate-200 max-w-xs mx-auto flex flex-col items-center gap-1.5">
                    <img
                      src={formImageUrl}
                      alt="معاينة الصورة"
                      className="w-full h-auto max-h-32 object-contain rounded-lg"
                      onError={() => {}}
                    />
                    <button
                      type="button"
                      onClick={() => setFormImageUrl('')}
                      className="text-[10px] text-rose-600 font-bold hover:underline cursor-pointer"
                    >
                      إلغاء الصورة وحذف الرابط ✕
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {formQuestionType === 'fill_in_the_blank'
                    ? 'الكلمة أو العبارة الصحيحة لملء الفراغ:'
                    : 'الجواب النموذجي المعتمد (يظهر للطالب عند المراجعة):'}
                </label>
                <textarea
                  value={formAnswerText}
                  onChange={(e) => setFormAnswerText(e.target.value)}
                  placeholder={
                    formQuestionType === 'fill_in_the_blank'
                      ? 'مثال: بغداد'
                      : 'اكتب الإجابة الكاملة النموذجية التي تظهر للتلميذ...'
                  }
                  rows={2}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium"
                  required
                />
              </div>

              {formQuestionType === 'multiple_choice' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    خيارات الاختبار التفاعلي (حدد الإجابة الصحيحة بالضغط على الدائرة):
                  </label>
                  <div className="space-y-2">
                    {formOptions.map((opt, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setFormCorrectIndex(idx)}
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer ${
                            formCorrectIndex === idx
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                          title="تحديد كإجابة صحيحة"
                        >
                          {formCorrectIndex === idx ? '✓' : idx + 1}
                        </button>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const updated = [...formOptions];
                            updated[idx] = e.target.value;
                            setFormOptions(updated);
                          }}
                          placeholder={`الخيار ${idx + 1}`}
                          className="flex-1 p-2 rounded-xl border border-slate-200 text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  شرح المعلم / نصيحة للتلميذ (اختياري)
                </label>
                <input
                  type="text"
                  value={formExplanation}
                  onChange={(e) => setFormExplanation(e.target.value)}
                  placeholder="ملاحظة توضيحية لتبسيط الفهم..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200">
                <input
                  type="checkbox"
                  id="vipCheck"
                  checked={formIsVipOnly}
                  onChange={(e) => setFormIsVipOnly(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded-sm cursor-pointer"
                />
                <label htmlFor="vipCheck" className="text-xs font-bold text-amber-900 cursor-pointer">
                  مخصص فقط للاشتراكات المفعلة (VIP)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsQuestionModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  حفظ السؤال ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Preview Video Modal */}
      <VideoPlayerModal video={previewVideo} onClose={() => setPreviewVideo(null)} />
    </div>
  );
};

export default AdminPanel;


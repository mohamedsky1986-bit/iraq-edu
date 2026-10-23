import React, { useState, useEffect } from 'react';
import { useEdu } from '../context/EduContext';
import { db } from '../firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
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
  LogOut,
  Video,
  PlayCircle,
  Play,
  ExternalLink,
  Layers,
  FileText,
  MessageSquare,
  Star
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


interface CustomVideo {
  id: string;
  gradeId: GradeId;
  subjectId: string;
  subjectName: string;
  title: string;
  youtubeUrl: string;
  chapter: string;
  isVipOnly?: boolean;
}


const STORAGE_KEYS = {
  CUSTOM_VIDEOS: 'iraq_edu_admin_custom_videos_v1',
};


function getYouTubeEmbedUrl(url: string): string {
  if (!url) return '';
  if (url.includes('embed/')) return url;
  const matchShort = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (matchShort) return `https://www.youtube.com/embed/${matchShort[1]}`;
  const matchLong = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (matchLong) return `https://www.youtube.com/embed/${matchLong[1]}`;
  return url;
}


export function formatIraqiLastSeen(lastActiveAt?: string, isOnline?: boolean): { label: string; isLive: boolean } {
  if (!lastActiveAt) {
    return { label: 'غير مسجل', isLive: false };
  }
  const date = new Date(lastActiveAt);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / (60 * 1000));
  const diffHours = Math.floor(diffMins / 60);


  if (isOnline && diffMins <= 3) {
    return { label: '🟢 متصل الآن (نشط)', isLive: true };
  }


  if (diffMins < 1) {
    return { label: 'آخر ظهور: قبل لحظات', isLive: false };
  }
  if (diffMins < 60) {
    return { label: `آخر ظهور: منذ ${diffMins} دقيقة`, isLive: false };
  }
  if (diffHours < 24) {
    const timeStr = date.toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' });
    return { label: `آخر ظهور: اليوم ${timeStr}`, isLive: false };
  }
  const dateStr = date.toLocaleDateString('ar-IQ', { month: 'numeric', day: 'numeric' });
  const timeStr = date.toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' });
  return { label: `آخر ظهور: ${dateStr} الساعة ${timeStr}`, isLive: false };
}


interface AdminPanelProps {
  onInspectGrade?: (gradeId: GradeId) => void;
}


export const AdminPanel: React.FC<AdminPanelProps> = ({ onInspectGrade }) => {
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
  } = useEdu();


  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'curriculum' | 'videos' | 'comments' | 'students' | 'requests' | 'pricing' | 'security'
  >('curriculum');


  // Students Search & Filter
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('all');


  // Pricing State
  const [newPrice, setNewPrice] = useState(subscriptionConfig.price);
  const [newCurrency, setNewCurrency] = useState(subscriptionConfig.currency);
  const [newPeriodName, setNewPeriodName] = useState(subscriptionConfig.periodName);
  const [newZainWallet, setNewZainWallet] = useState(subscriptionConfig.zainCashWallet);
  const [newQiCard, setNewQiCard] = useState(subscriptionConfig.qiCardNumber);
  const [pricingFeedback, setPricingFeedback] = useState(false);


  // Security Credentials State
  const [newAdminUser, setNewAdminUser] = useState(adminUsername);
  const [newAdminPass, setNewAdminPass] = useState('');
  const [confirmAdminPass, setConfirmAdminPass] = useState('');
  const [showPasswordToggle, setShowPasswordToggle] = useState(false);
  const [securityFeedback, setSecurityFeedback] = useState<{ text: string; success: boolean } | null>(null);


  // Question Modal & Form State (المنهج وكتابة الآيات والأحاديث والأسئلة والشرح)
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);


  const [formQuestionType, setFormQuestionType] = useState<'multiple_choice' | 'qa' | 'fill_in_the_blank'>('qa');
  const [formBadgeType, setFormBadgeType] = useState<'none' | 'ministerial' | 'smart_challenge' | 'focus_tip'>('none');
  const [isCustomSubject, setIsCustomSubject] = useState(false);
  const [customSubjectName, setCustomSubjectName] = useState('');
  const [formGradeId, setFormGradeId] = useState<GradeId>('grade-1');
  const [formSubjectId, setFormSubjectId] = useState<string>('isl-1');
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


  // Questions Filters
  const [qGradeFilter, setQGradeFilter] = useState<string>('all');
  const [qSubjectFilter, setQSubjectFilter] = useState<string>('all');
  const [qSearchQuery, setQSearchQuery] = useState<string>('');


  // Videos State & In-Panel Player
  const [videosList, setVideosList] = useState<CustomVideo[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_VIDEOS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });
  const [playingVideoUrl, setPlayingVideoUrl] = useState<string | null>(null);


  const [newVidGrade, setNewVidGrade] = useState<GradeId>('grade-1');
  const [newVidSubjectId, setNewVidSubjectId] = useState('ar-1');
  const [newVidTitle, setNewVidTitle] = useState('');
  const [newVidUrl, setNewVidUrl] = useState('');
  const [newVidChapter, setNewVidChapter] = useState('الفصل الأول');
  const [newVidIsVip, setNewVidIsVip] = useState(false);


  // إدارة تعليقات وآراء الطلبة والزوار المتزامنة سحابياً
  const [platformComments, setPlatformComments] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('iraq_edu_platform_comments_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });


  // مزامنة حية للفيديوهات عبر Firebase Firestore
  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'videos'), (snapshot) => {
        if (!snapshot.empty) {
          const remoteVids = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as CustomVideo[];
          setVideosList(remoteVids);
          try {
            localStorage.setItem(STORAGE_KEYS.CUSTOM_VIDEOS, JSON.stringify(remoteVids));
          } catch {}
        }
      });
      return () => unsub();
    } catch (e) {
      console.warn('Firestore live videos sync fallback:', e);
    }
  }, []);

  // مزامنة حية للتعليقات عبر Firebase Firestore
  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'comments'), (snapshot) => {
        if (!snapshot.empty) {
          const remoteComments = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
          setPlatformComments(remoteComments);
          try {
            localStorage.setItem('iraq_edu_platform_comments_v1', JSON.stringify(remoteComments));
          } catch {}
        }
      });
      return () => unsub();
    } catch (e) {
      console.warn('Firestore comments sync fallback:', e);
    }
  }, []);


  const handleDeleteComment = async (id: string) => {
    playClickSound();
    if (confirm('هل أنت متأكد من حذف هذا التعليق نهائياً؟')) {
      const updated = platformComments.filter((c: any) => c.id !== id);
      setPlatformComments(updated);
      try {
        localStorage.setItem('iraq_edu_platform_comments_v1', JSON.stringify(updated));
      } catch {}


      try {
        await deleteDoc(doc(db, 'comments', id));
      } catch (e) {
        console.error('Error deleting comment from Firestore:', e);
      }
    }
  };


  const handleEditComment = async (comm: any) => {
    playClickSound();
    const newText = prompt('تعديل نص التعليق:', comm.commentText);
    if (newText && newText.trim()) {
      const updatedObj = { ...comm, commentText: newText.trim() };
      const updated = platformComments.map((c: any) =>
        c.id === comm.id ? updatedObj : c
      );
      setPlatformComments(updated);
      try {
        localStorage.setItem('iraq_edu_platform_comments_v1', JSON.stringify(updated));
      } catch {}


      try {
        await setDoc(doc(db, 'comments', comm.id), updatedObj);
      } catch (e) {
        console.error('Error updating comment in Firestore:', e);
      }
      alert('تم تحديث وحفظ التعليق سحابياً بنجاح ✓');
    }
  };




  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_VIDEOS, JSON.stringify(videosList));
  }, [videosList]);


  // Handle Add Video
  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVidTitle.trim() || !newVidUrl.trim()) {
      playWrongSound();
      return;
    }
    const subjectsForGrade = OFFICIAL_IRAQI_SUBJECTS[newVidGrade] || [];
    const targetSub = subjectsForGrade.find((s) => s.id === newVidSubjectId);
    const newVid: CustomVideo = {
      id: `vid-${Date.now()}`,
      gradeId: newVidGrade,
      subjectId: newVidSubjectId,
      subjectName: targetSub ? targetSub.name : 'المنهج العام',
      title: newVidTitle.trim(),
      youtubeUrl: newVidUrl.trim(),
      chapter: newVidChapter.trim() || 'الفصل الأول',
      isVipOnly: newVidIsVip,
    };
    const updated = [newVid, ...videosList];
    setVideosList(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_VIDEOS, JSON.stringify(updated));
    } catch {}
    try {
      await setDoc(doc(db, 'videos', newVid.id), newVid);
    } catch (err) {
      console.error('Error saving video to Firestore:', err);
    }
    playCorrectSound();
    setNewVidTitle('');
    setNewVidUrl('');
    alert('تمت إضافة الفيديو بنجاح وحفظه سحابياً ليظهر لجميع الطلاب فوراً ✓');
  };


  const handleDeleteVideo = async (id: string) => {
    playClickSound();
    if (confirm('هل أنت متأكد من حذف هذا الفيديو نهائياً؟')) {
      const updated = videosList.filter((v) => v.id !== id);
      setVideosList(updated);
      try {
        localStorage.setItem(STORAGE_KEYS.CUSTOM_VIDEOS, JSON.stringify(updated));
      } catch {}
      try {
        await deleteDoc(doc(db, 'videos', id));
      } catch (err) {
        console.error('Error deleting video from Firestore:', err);
      }
    }
  };


  // Filtered Students
  const filteredStudents = students.filter((s) => {
    const matchGrade = selectedGradeFilter === 'all' || s.gradeId === selectedGradeFilter;
    const matchSearch =
      s.fullName.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.username.toLowerCase().includes(studentSearch.toLowerCase());
    return matchGrade && matchSearch;
  });


  // Filtered Questions
  const filteredQuestions = questions.filter((q) => {
    const matchGrade = qGradeFilter === 'all' || q.gradeId === qGradeFilter;
    const matchSubject = qSubjectFilter === 'all' || q.subjectId === qSubjectFilter;
    const matchSearch =
      !qSearchQuery.trim() ||
      q.questionText.toLowerCase().includes(qSearchQuery.toLowerCase()) ||
      q.answerText.toLowerCase().includes(qSearchQuery.toLowerCase()) ||
      (q.chapter && q.chapter.toLowerCase().includes(qSearchQuery.toLowerCase()));
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
    setFormGradeId('grade-1');
    setFormSubjectId('isl-1');
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
      alert('يرجى كتابة نص السؤال والجواب المعتمد أولاً');
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
      alert('تم حفظ وتثبيت المنهج والسؤال بنجاح في المنصة! ✓');
    } catch (err: any) {
      console.error('Error saving question:', err);
      alert('حدث خطأ أثناء الحفظ: ' + (err?.message || 'يرجى مراجعة البيانات'));
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


  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminPass || newAdminPass.trim().length < 4) {
      playWrongSound();
      setSecurityFeedback({ text: 'كلمة المرور يجب أن تتكون من 4 خانات على الأقل', success: false });
      return;
    }
    if (confirmAdminPass && newAdminPass.trim() !== confirmAdminPass.trim()) {
      playWrongSound();
      setSecurityFeedback({ text: 'كلمتا المرور غير متطابقتين، يرجى التأكد', success: false });
      return;
    }

    const cleanUser = newAdminUser.trim() || adminUsername;
    const cleanPass = newAdminPass.trim();

    const success = changeAdminCredentials(cleanUser, cleanPass);
    if (success) {
      playCorrectSound();
      try {
        localStorage.setItem('iraq_edu_admin_user_v2', cleanUser);
        localStorage.setItem('iraq_edu_admin_pass_v2', cleanPass);
      } catch {}
      try {
        await setDoc(
          doc(db, 'settings', 'admin'),
          { username: cleanUser, password: cleanPass, updatedAt: new Date().toISOString() },
          { merge: true }
        );
      } catch (err) {
        console.error('Error saving admin pass to Firestore:', err);
      }
      setSecurityFeedback({
        text: `تم حفظ وتثبيت كلمة المرور الجديدة بنجاح: (${cleanPass}) ✓`,
        success: true,
      });
      setNewAdminPass('');
      setConfirmAdminPass('');
    } else {
      playWrongSound();
      setSecurityFeedback({ text: 'فشل تحديث البيانات، يرجى المحاولة ثانية', success: false });
    }
  };


  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner with Direct Password Shortcut & Logout */}
      <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-md">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black">
                  لوحة تحكم المشرف العام (Admin Control Panel)
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  حساب محمي 🔒
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-1">
                مشرف المنصة: <strong className="text-rose-300 font-mono">{adminUsername}</strong> • إدارة كاملة للطلبة، بنك المناهج، الفيديوهات والاشتراكات
              </p>
            </div>
          </div>


          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                playClickSound();
                setActiveTab('security');
              }}
              className="px-4 py-2.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>تغيير باسورد المشرف 🔒</span>
            </button>


            <button
              onClick={() => {
                playClickSound();
                logoutAdmin();
              }}
              className="px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/30 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>خروج المشرف</span>
            </button>


            <button
              onClick={handleOpenAddQuestion}
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>كتابة درس / آيات / أسئلة جديدة</span>
            </button>
          </div>
        </div>


        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-xs text-slate-400 font-bold block mb-1">إجمالي المناهج والأسئلة</span>
            <span className="text-2xl font-black text-emerald-400">{questions.length}</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-xs text-slate-400 font-bold block mb-1">شروحات اليوتيوب المضافة</span>
            <span className="text-2xl font-black text-rose-400">{videosList.length}</span>
          </div>
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
        </div>
      </div>


      {/* ================= 🚀 قسم التصفح والتحكم المباشر بالصفوف كمنتدى ================= */}
      {onInspectGrade && (
        <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 rounded-3xl p-6 text-slate-950 shadow-xl border-2 border-amber-300 space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-600/30 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl">🚀</span>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-950">
                  التصفح والتحكم المباشر بالصفوف كمدير (حرية كاملة كمنتدى)
                </h2>
                <p className="text-xs font-bold text-amber-950">
                  اضغط على أي صف بالأسفل للدخول المباشر إليه كـ "مشرف عام" والتعديل والحذف الفوري في مكانه!
                </p>
              </div>
            </div>
            <span className="text-[11px] font-black px-3.5 py-1.5 rounded-full bg-slate-900 text-amber-300 shadow-md shrink-0">
              ⚡ دخول مباشر بضغطة واحدة
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
            {GRADES_DATA.map((g) => (
              <button
                key={g.id}
                onClick={() => {
                  playClickSound();
                  onInspectGrade(g.id);
                }}
                className="p-4 rounded-2xl bg-white hover:bg-slate-900 text-slate-900 hover:text-white border-2 border-amber-200 hover:border-slate-900 shadow-md hover:shadow-2xl transition-all duration-200 flex flex-col items-center justify-center gap-1.5 cursor-pointer group transform hover:-translate-y-1 select-none"
              >
                <span className="text-3xl group-hover:scale-125 transition-transform">{g.icon}</span>
                <span className="text-xs font-black text-center leading-tight">{g.shortName}</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors mt-0.5">
                  دخول كمدير ⚡
                </span>
              </button>
            ))}
          </div>
        </div>
      )}


      {/* Tabs Row - flex-wrap to prevent overflow */}
      <div className="flex flex-wrap items-center gap-2 pb-2">
        <button
          onClick={() => {
            playClickSound();
            setActiveTab('curriculum');
          }}
          className={`px-4 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'curriculum'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <span>بنك المناهج وإضافة الدروس والأسئلة ({questions.length})</span>
        </button>


        <button
          onClick={() => {
            playClickSound();
            setActiveTab('comments');
          }}
          className={`px-4 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'comments'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-emerald-500" />
          <span>التعليقات والآراء ({platformComments.length})</span>
        </button>


        <button
          onClick={() => {
            playClickSound();
            setActiveTab('videos');
          }}
          className={`px-4 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'videos'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Video className="w-4 h-4 text-rose-500" />
          <span>شروحات وفيديوهات اليوتيوب ({videosList.length})</span>
        </button>


        <button
          onClick={() => {
            playClickSound();
            setActiveTab('students');
          }}
          className={`px-4 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'students'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4 text-sky-400" />
          <span>إدارة الطلبة والتواجد ({students.length})</span>
        </button>


        <button
          onClick={() => {
            playClickSound();
            setActiveTab('requests');
          }}
          className={`px-4 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
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
          className={`px-4 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'pricing'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <span>الأسعار والدفع</span>
        </button>


        <button
          onClick={() => {
            playClickSound();
            setActiveTab('security');
          }}
          className={`px-4 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'security'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <KeyRound className="w-4 h-4 text-rose-400" />
          <span>حساب المشرف 🔒</span>
        </button>
      </div>


      {/* TAB 1: CURRICULUM & QUESTIONS BANK (كتابة المنهج والآيات والأحاديث والأسئلة والشرح) */}
      {activeTab === 'curriculum' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-500 font-bold shrink-0">المرحلة:</span>
                  <select
                    value={qGradeFilter}
                    onChange={(e) => {
                      setQGradeFilter(e.target.value);
                      setQSubjectFilter('all');
                    }}
                    className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold cursor-pointer"
                  >
                    <option value="all">جميع المراحل ({questions.length})</option>
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
                          {s.name} ({count})
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>


              <button
                onClick={handleOpenAddQuestion}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                <span>إضافة درس أو سؤال أو آيات جديدة ✍️</span>
              </button>
            </div>


            <div className="relative">
              <Search className="absolute right-3.5 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={qSearchQuery}
                onChange={(e) => setQSearchQuery(e.target.value)}
                placeholder="ابحث بالنص، الموضوع، الآية، الحديث، الجواب..."
                className="w-full pr-10 pl-4 py-2 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-emerald-500 bg-slate-50/50"
              />
            </div>
          </div>


          <div className="space-y-3">
            {filteredQuestions.map((q) => (
              <div
                key={q.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 text-right"
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
                        📝 سؤال وجواب / شرح
                      </span>
                    ) : (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                        🔘 خيارات تفاعلية
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


                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    <span className="font-bold text-emerald-800">الجواب / النص المعتمد: </span>
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
                      if (confirm('هل أنت متأكد من حذف هذا السؤال/الدرس؟')) {
                        deleteQuestion(q.id);
                        playClickSound();
                      }
                    }}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 cursor-pointer"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


            {/* TAB: COMMENTS MANAGEMENT (التحكم بتعليقات وآراء الطلبة) */}
      {activeTab === 'comments' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6 text-right">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                <span>إدارة تعليقات وآراء الطلبة في الصفحة الرئيسية</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                يمكنك مراجعة جميع التعليقات وحذف أي تعليق مسيء أو تعديل نصه مباشرة
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              {platformComments.length} تعليق
            </span>
          </div>


          {platformComments.length === 0 ? (
            <p className="text-xs text-slate-500 p-8 bg-slate-50 rounded-2xl border border-slate-200 text-center">
              لا توجد تعليقات مسجلة حالياً. أي تعليق يكتبه طالب في الصفحة الرئيسية سيظهر هنا للتحكم به.
            </p>
          ) : (
            <div className="space-y-3">
              {platformComments.map((comm: any) => (
                <div
                  key={comm.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-xs text-slate-900">{comm.studentName}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                        {comm.gradeName}
                      </span>
                      <div className="flex text-amber-400">
                        {Array.from({ length: comm.rating || 5 }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{comm.date}</span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed bg-white p-3 rounded-xl border border-slate-200/80">
                      "{comm.commentText}"
                    </p>
                  </div>


                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEditComment(comm)}
                      className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold cursor-pointer flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>تعديل</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteComment(comm.id)}
                      className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 cursor-pointer transition-colors"
                      title="حذف التعليق"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}


{/* TAB 2: YOUTUBE VIDEOS WITH IN-PANEL PLAYER */}
      {activeTab === 'videos' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-rose-600" />
              <span>إضافة وإدارة شروحات وفيديوهات اليوتيوب المعتمدة</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              كل فيديو تضيفه سيرتبط بمادته حصراً، ويمكنك تشغيله ومعاينته مباشرة داخل لوحة التحكم
            </p>
          </div>


          <form onSubmit={handleAddVideo} className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">المرحلة الدراسية:</label>
              <select
                value={newVidGrade}
                onChange={(e) => {
                  const g = e.target.value as GradeId;
                  setNewVidGrade(g);
                  const matching = OFFICIAL_IRAQI_SUBJECTS[g] || [];
                  if (matching.length > 0) setNewVidSubjectId(matching[0].id);
                }}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold outline-none cursor-pointer bg-white"
              >
                {GRADES_DATA.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>


            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">القسم / المادة:</label>
              <select
                value={newVidSubjectId}
                onChange={(e) => setNewVidSubjectId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold outline-none cursor-pointer bg-white"
              >
                {(OFFICIAL_IRAQI_SUBJECTS[newVidGrade] || []).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>


            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">عنوان الشرح أو الدرس:</label>
              <input
                type="text"
                value={newVidTitle}
                onChange={(e) => setNewVidTitle(e.target.value)}
                placeholder="اكتب عنوان الشرح هنا..."
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-emerald-500"
                required
              />
            </div>


            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">رابط يوتيوب (YouTube URL):</label>
              <input
                type="url"
                value={newVidUrl}
                onChange={(e) => setNewVidUrl(e.target.value)}
                placeholder="https://youtu.be/..."
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold outline-none font-mono"
                dir="ltr"
                required
              />
            </div>


            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">إجراء الحفظ:</label>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>إضافة الفيديو 🎥</span>
              </button>
            </div>
          </form>


          {/* Videos List with Direct Player */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <h3 className="text-xs font-black text-slate-800">قائمة الفيديوهات المضافة:</h3>
            {videosList.length === 0 ? (
              <p className="text-xs text-slate-500 p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                لا توجد فيديوهات مسجلة حالياً. استخدم النموذج أعلاه لإضافة شروحات فيديو لأي مادة.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {videosList.map((vd) => (
                  <div key={vd.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-right">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-rose-100 text-rose-800">
                        {vd.subjectName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {getIraqiGradeName(vd.gradeId)}
                      </span>
                    </div>


                    <h4 className="text-sm font-black text-slate-900">{vd.title}</h4>


                    {/* Inline Player Option */}
                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-300 shadow-2xs">
                      <iframe
                        src={getYouTubeEmbedUrl(vd.youtubeUrl)}
                        title={vd.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>


                    <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                      <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                        <span>🎬 مشغل مدمج داخل المنصة</span>
                      </span>


                      <button
                        type="button"
                        onClick={() => handleDeleteVideo(vd.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                        title="حذف الفيديو"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}


      {/* TAB 3: STUDENTS MANAGEMENT */}
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
                    <th className="p-4">حالة الاتصال وآخر ظهور</th>
                    <th className="p-4">حالة الاشتراك</th>
                    <th className="p-4 text-center">إجراءات الحساب</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((st) => {
                    const presence = formatIraqiLastSeen((st as any).lastActiveAt, (st as any).isOnline);
                    return (
                      <tr key={st.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-4 font-bold text-slate-900 flex items-center gap-2.5">
                          <span className="text-xl">{st.avatar || '👦🏻'}</span>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span>{st.fullName}</span>
                              {presence.isLive && (
                                <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  🟢 متصل الآن
                                </span>
                              )}
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
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span
                              className={`text-xs font-bold ${
                                presence.isLive ? 'text-emerald-700 font-black' : 'text-slate-500'
                              }`}
                            >
                              {presence.label}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          {st.subscription === 'paid' ? (
                            <div className="space-y-0.5">
                              <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1 w-max">
                                <Crown className="w-3.5 h-3.5" /> VIP مفعل
                              </span>
                              <span className="text-[10px] text-amber-800 font-mono block">
                                ينتهي: {st.subscriptionExpiry || '2026-12-31'}
                              </span>
                            </div>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
                              مجاني
                            </span>
                          )}
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
                              title="تغيير كلمة مرور الطالب"
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}


      {/* TAB 4: REQUESTS */}
      {activeTab === 'requests' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-black text-slate-900 text-base">
              طلبات اشتراك أولياء الأمور والطلبة (VIP)
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
                  <th className="p-4">رقم الهاتف / الوصل</th>
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
                    <td className="p-4 font-bold text-slate-700">{req.paymentMethod}</td>
                    <td className="p-4 font-black text-emerald-700">
                      {formatIraqiDinar(req.amount, req.currency)}
                    </td>
                    <td className="p-4 text-slate-600 font-mono" dir="ltr">{req.paymentPhoneOrRef || '-'}</td>
                    <td className="p-4">
                      {req.status === 'pending' ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 flex items-center gap-1 w-max">
                          <Clock className="w-3.5 h-3.5" /> بانتظار التأكيد
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 flex items-center gap-1 w-max">
                          <Check className="w-3.5 h-3.5" /> تم التفعيل
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


      {/* TAB 5: PRICING */}
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


            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  رقم محفظة زين كاش (Zain Cash Wallet)
                </label>
                <input
                  type="text"
                  value={newZainWallet}
                  onChange={(e) => setNewZainWallet(e.target.value)}
                  placeholder="07801234567"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 outline-none text-xs sm:text-sm font-mono"
                  dir="ltr"
                />
              </div>


              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  رقم بطاقة كي كارد (Qi Card)
                </label>
                <input
                  type="text"
                  value={newQiCard}
                  onChange={(e) => setNewQiCard(e.target.value)}
                  placeholder="رقم بطاقة كي كارد"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 outline-none text-xs sm:text-sm font-mono"
                  dir="ltr"
                />
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


      {/* TAB 6: SECURITY */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-xl shadow-xs space-y-6 text-right">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-xs">
              <KeyRound className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h2 className="font-black text-slate-900 text-base sm:text-lg">
                تغيير كلمة مرور المشرف (Admin Password) 🔒
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                اكتب كلمة المرور الجديدة لتسجيل الدخول إلى لوحة تحكم المنصة
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveCredentials} className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-500 block">حساب المشرف المسجل حالياً:</span>
                <span className="text-xs sm:text-sm font-black font-mono text-slate-900">{adminUsername}</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                الحساب الرئيسي 🛡️
              </span>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-800 mb-1.5">
                كلمة المرور الجديدة (New Password):
              </label>
              <div className="relative">
                <input
                  type={showPasswordToggle ? "text" : "password"}
                  value={newAdminPass}
                  onChange={(e) => setNewAdminPass(e.target.value)}
                  placeholder="اكتب كلمة المرور الجديدة هنا"
                  className="w-full pr-4 pl-16 py-3 rounded-2xl border-2 border-slate-200 focus:border-amber-500 outline-none text-xs sm:text-sm font-medium transition-all"
                  dir="ltr"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordToggle(!showPasswordToggle)}
                  className="absolute left-3 top-3 text-slate-400 hover:text-slate-700 text-xs font-bold cursor-pointer"
                >
                  {showPasswordToggle ? "إخفاء 🙈" : "إظهار 👁️"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-800 mb-1.5">
                تأكيد كلمة المرور الجديدة (Confirm Password):
              </label>
              <input
                type={showPasswordToggle ? "text" : "password"}
                value={confirmAdminPass}
                onChange={(e) => setConfirmAdminPass(e.target.value)}
                placeholder="أعد كتابة كلمة المرور للتأكيد"
                className="w-full pr-4 pl-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-amber-500 outline-none text-xs sm:text-sm font-medium transition-all"
                dir="ltr"
                required
              />
            </div>

            <details className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <summary className="font-bold text-slate-600 cursor-pointer select-none">
                ⚙️ (اختياري) تعديل إيميل أو يوزرنيم المشرف
              </summary>
              <div className="pt-3 space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-600">اسم المستخدم / البريد:</label>
                <input
                  type="text"
                  value={newAdminUser}
                  onChange={(e) => setNewAdminUser(e.target.value)}
                  placeholder="mohamedsky1986@gmail.com"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-mono text-xs"
                  dir="ltr"
                />
              </div>
            </details>

            {securityFeedback && (
              <div
                className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                  securityFeedback.success
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                    : 'bg-rose-50 text-rose-800 border border-rose-300'
                }`}
              >
                <span>{securityFeedback.success ? '✓' : '⚠️'}</span>
                <span>{securityFeedback.text}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>حفظ كلمة المرور الجديدة وتثبيتها سحابياً 🔒</span>
            </button>
          </form>
        </div>
      )}


      {/* QUESTION MODAL FOR ADDING/EDITING CURRICULUM QUESTIONS & LESSONS */}
      {isQuestionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-lg">
                {editingQuestion ? 'تعديل السؤال والمنهاج' : 'إضافة درس / آيات / أسئلة لبنك المناهج'}
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
                    <span>📝 سؤال وجواب / شرح</span>
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
                    المرحلة الدراسية:
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
                    المادة الدراسية:
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
                      placeholder="اكتب اسم المادة (مثال: التربية الفنية، الحاسوب)..."
                      className="mt-2 w-full p-2.5 rounded-xl border border-emerald-300 bg-emerald-50/50 text-xs font-bold"
                      required
                    />
                  )}
                </div>
              </div>


              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    اسم الفصل أو الوحدة (مثال: سورة الفاتحة / الحديث النبوي):
                  </label>
                  <input
                    type="text"
                    value={formChapter}
                    onChange={(e) => setFormChapter(e.target.value)}
                    placeholder="مثال: سورة الفاتحة المباركة / الوحدة الأولى"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    اسم الدرس أو الموضوع (مثال: حفظ الآيات / معاني الكلمات):
                  </label>
                  <input
                    type="text"
                    value={formLesson}
                    onChange={(e) => setFormLesson(e.target.value)}
                    placeholder="مثال: آيات الحفظ / المعاني والشرح"
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
                    نص السؤال أو الآية الكريمة أو الحديث:
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
                  placeholder="اكتب السؤال أو الآية الكريمة أو نص الحديث هنا..."
                  rows={2}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium"
                  required
                />
              </div>


              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  الجواب النموذجي أو الشرح والمعاني:
                </label>
                <textarea
                  value={formAnswerText}
                  onChange={(e) => setFormAnswerText(e.target.value)}
                  placeholder="اكتب الإجابة النموذجية أو معاني الكلمات أو الشرح التفصيلي..."
                  rows={2}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium"
                  required
                />
              </div>


              {formQuestionType === 'multiple_choice' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    خيارات الاختبار (اضغط الدائرة لتحديد الجواب الصحيح):
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
                  شرح المعلم / نصيحة للتلميذ (اختياري):
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
                  مخصص فقط للاشتراكات المفعلة (VIP) ⭐
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
                  حفظ في المنهاج ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


export default AdminPanel;

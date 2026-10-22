import React, { useState, useEffect } from 'react';
import { useEdu } from '../context/EduContext';
import { Question, Subject, GradeId, Student, SubscriptionConfig } from '../types/index';
import { GRADES_DATA, DEFAULT_SUBJECTS } from '../data/initialData';
import { formatIraqiDinar, getIraqiGradeName } from '../utils/edu-logic';
import { playClickSound, playCorrectSound, playWrongSound } from '../utils/audio';
import {
  Users,
  HelpCircle,
  CreditCard,
  Settings,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  ShieldCheck,
  Search,
  Filter,
  Save,
  Check,
  X,
  Sparkles,
  BookOpen,
  Crown,
  Eye,
  LogOut,
  ChevronDown,
  GraduationCap,
  Video,
  FileText,
  ExternalLink,
  Edit2,
  PlayCircle,
  KeyRound,
  UserCheck,
  PlusCircle,
  BookCheck,
  Layers,
  Clock
} from 'lucide-react';

interface CustomBook {
  id: string;
  gradeId: GradeId;
  subjectName: string;
  title: string;
  driveUrl: string;
  type: 'book' | 'summary';
}

interface CustomVideo {
  id: string;
  gradeId: GradeId;
  subjectId: string;
  subjectName: string;
  title: string;
  youtubeUrl: string;
  chapter: string;
}

const STORAGE_KEYS = {
  CUSTOM_BOOKS: 'iraq_edu_admin_custom_books_v1',
  CUSTOM_VIDEOS: 'iraq_edu_admin_custom_videos_v1',
  CUSTOM_SUBJECTS: 'iraq_edu_admin_custom_subjects_v1',
  ADMIN_USER: 'iraq_edu_admin_user_custom',
  ADMIN_PASS: 'iraq_edu_admin_pass_custom',
};

// Format human-readable Iraqi Arabic last seen
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

export const AdminPanel: React.FC = () => {
  const {
    students,
    questions,
    subjects: initialSubjects,
    adminUsername,
    subscriptionConfig,
    subscriptionRequests,
    toggleStudentSubscription,
    addQuestion,
    deleteQuestion,
    updateSubscriptionConfig,
    approveSubscriptionRequest,
    rejectSubscriptionRequest,
    logoutAdmin,
  } = useEdu();

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'students' | 'subjects' | 'curriculum' | 'videos' | 'questions' | 'requests' | 'pricing' | 'security'
  >('students');

  // Search & Filter for Students
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('all');

  // Subjects Management State
  const [allSubjects, setAllSubjects] = useState<Subject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_SUBJECTS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialSubjects || DEFAULT_SUBJECTS;
  });

  const [newSubGrade, setNewSubGrade] = useState<GradeId>('grade-1');
  const [newSubName, setNewSubName] = useState('');
  const [newSubIcon, setNewSubIcon] = useState('📚');
  const [newSubDesc, setNewSubDesc] = useState('');

  // Books Management State
  const [booksList, setBooksList] = useState<CustomBook[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_BOOKS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'book-1',
        gradeId: 'grade-1',
        subjectName: 'قراءتي',
        title: 'كتاب قراءتي للصف الأول الابتدائي (المنهج الحديث)',
        driveUrl: 'https://drive.google.com/drive/folders/1Gdmm8qLT26-JA51h5FFpnBxagKJ_jjLL',
        type: 'book',
      },
      {
        id: 'book-2',
        gradeId: 'grade-1',
        subjectName: 'العلوم',
        title: 'كتاب العلوم للصف الأول الابتدائي',
        driveUrl: 'https://drive.google.com/drive/folders/1Gdmm8qLT26-JA51h5FFpnBxagKJ_jjLL',
        type: 'book',
      },
    ];
  });

  const [newBookGrade, setNewBookGrade] = useState<GradeId>('grade-1');
  const [newBookSubject, setNewBookSubject] = useState('قراءتي');
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookUrl, setNewBookUrl] = useState('');
  const [newBookType, setNewBookType] = useState<'book' | 'summary'>('book');

  // Videos Management State
  const [videosList, setVideosList] = useState<CustomVideo[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_VIDEOS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const [newVidGrade, setNewVidGrade] = useState<GradeId>('grade-1');
  const [newVidSubjectId, setNewVidSubjectId] = useState('ar-1');
  const [newVidTitle, setNewVidTitle] = useState('');
  const [newVidUrl, setNewVidUrl] = useState('');
  const [newVidChapter, setNewVidChapter] = useState('الفصل الأول');

  // Questions Management State
  const [selectedQuestionGrade, setSelectedQuestionGrade] = useState<GradeId>('grade-1');
  const [selectedQuestionSubjectId, setSelectedQuestionSubjectId] = useState('ar-1');
  const [questionText, setQuestionText] = useState('');
  const [answerText, setAnswerText] = useState('');
  const [explanation, setExplanation] = useState('');
  const [chapter, setChapter] = useState('الفصل الأول');
  const [isVipOnly, setIsVipOnly] = useState(false);

  // Security / Admin Account State
  const [adminUserVal, setAdminUserVal] = useState(adminUsername || 'admin');
  const [adminPassVal, setAdminPassVal] = useState('');
  const [securityNotice, setSecurityNotice] = useState('');

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_SUBJECTS, JSON.stringify(allSubjects));
  }, [allSubjects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_BOOKS, JSON.stringify(booksList));
  }, [booksList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_VIDEOS, JSON.stringify(videosList));
  }, [videosList]);

  // Handle Add Subject
  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim()) {
      playWrongSound();
      return;
    }
    const newSub: Subject = {
      id: `sub-custom-${Date.now()}`,
      gradeId: newSubGrade,
      name: newSubName.trim(),
      code: `SUB_${Date.now()}`,
      icon: newSubIcon.trim() || '📚',
      themeColor: 'emerald',
      description: newSubDesc.trim() || `مادة ${newSubName.trim()} للمرحلة الدراسية`,
      lessonsCount: 10,
      questionsCount: 10,
    };
    setAllSubjects((prev) => [...prev, newSub]);
    playCorrectSound();
    setNewSubName('');
    setNewSubDesc('');
  };

  const handleDeleteSubject = (id: string) => {
    playClickSound();
    setAllSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  // Handle Add Book
  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookTitle.trim() || !newBookUrl.trim()) {
      playWrongSound();
      return;
    }
    const newBook: CustomBook = {
      id: `book-${Date.now()}`,
      gradeId: newBookGrade,
      subjectName: newBookSubject.trim(),
      title: newBookTitle.trim(),
      driveUrl: newBookUrl.trim(),
      type: newBookType,
    };
    setBooksList((prev) => [...prev, newBook]);
    playCorrectSound();
    setNewBookTitle('');
    setNewBookUrl('');
  };

  const handleDeleteBook = (id: string) => {
    playClickSound();
    setBooksList((prev) => prev.filter((b) => b.id !== id));
  };

  // Handle Add Video
  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVidTitle.trim() || !newVidUrl.trim()) {
      playWrongSound();
      return;
    }
    const targetSub = allSubjects.find((s) => s.id === newVidSubjectId);
    const newVid: CustomVideo = {
      id: `vid-${Date.now()}`,
      gradeId: newVidGrade,
      subjectId: newVidSubjectId,
      subjectName: targetSub ? targetSub.name : 'المنهج العام',
      title: newVidTitle.trim(),
      youtubeUrl: newVidUrl.trim(),
      chapter: newVidChapter.trim() || 'الفصل الأول',
    };
    setVideosList((prev) => [...prev, newVid]);
    playCorrectSound();
    setNewVidTitle('');
    setNewVidUrl('');
  };

  const handleDeleteVideo = (id: string) => {
    playClickSound();
    setVideosList((prev) => prev.filter((v) => v.id !== id));
  };

  // Handle Add Question
  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim() || !answerText.trim()) {
      playWrongSound();
      return;
    }
    addQuestion({
      gradeId: selectedQuestionGrade,
      subjectId: selectedQuestionSubjectId,
      chapter: chapter.trim() || 'الفصل الأول',
      questionText: questionText.trim(),
      answerText: answerText.trim(),
      explanation: explanation.trim() || undefined,
      isVipOnly,
      difficulty: 'medium',
      tags: [getIraqiGradeName(selectedQuestionGrade)],
    });
    playCorrectSound();
    setQuestionText('');
    setAnswerText('');
    setExplanation('');
  };

  // Handle Save Admin Credentials
  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminUserVal.trim() || adminUserVal.trim().length < 3) {
      playWrongSound();
      setSecurityNotice('اسم المشرف يجب ألا يقل عن 3 أحرف');
      return;
    }
    if (!adminPassVal.trim() || adminPassVal.trim().length < 4) {
      playWrongSound();
      setSecurityNotice('كلمة المرور يجب أن تتكون من 4 خانات على الأقل');
      return;
    }
    localStorage.setItem(STORAGE_KEYS.ADMIN_USER, adminUserVal.trim());
    localStorage.setItem(STORAGE_KEYS.ADMIN_PASS, adminPassVal.trim());
    playCorrectSound();
    setSecurityNotice('تم حفظ وتحديث بيانات حساب المشرف بنجاح 🔒');
  };

  // Filtered Students
  const filteredStudents = students.filter((st) => {
    const matchesSearch =
      st.fullName.toLowerCase().includes(studentSearch.toLowerCase()) ||
      st.username.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesGrade = selectedGradeFilter === 'all' || st.gradeId === selectedGradeFilter;
    return matchesSearch && matchesGrade;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner Card */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-black">لوحة تحكم المشرف (Admin Control Panel)</h1>
            <p className="text-xs text-slate-400 font-medium">
              التحكم الشامل: إدارة المواد، الكتب والملازم، فيديوهات اليوتيوب، بنك الأسئلة وحساب المشرف
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setActiveTab('security');
            }}
            className="px-4 py-2.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-black flex items-center gap-2 cursor-pointer transition-all"
          >
            <KeyRound className="w-4 h-4 text-amber-400" />
            <span>تغيير باسورد المشرف 🔒</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              logoutAdmin();
            }}
            className="px-4 py-2.5 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-black flex items-center gap-2 cursor-pointer transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>خروج المشرف</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs - Fully wrapped with flex-wrap so nothing is hidden */}
      <div className="flex flex-wrap items-center gap-2 pb-2">
        <button
          type="button"
          onClick={() => {
            playClickSound();
            setActiveTab('students');
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'students'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>الطلاب والتواجد ({students.length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            playClickSound();
            setActiveTab('subjects');
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'subjects'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>إدارة المواد الدراسية ({allSubjects.length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            playClickSound();
            setActiveTab('curriculum');
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'curriculum'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>الكتب والملازم PDF ({booksList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            playClickSound();
            setActiveTab('videos');
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'videos'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>شروحات اليوتيوب ({videosList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            playClickSound();
            setActiveTab('questions');
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'questions'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>بنك الأسئلة والامتحانات ({questions.length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            playClickSound();
            setActiveTab('requests');
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'requests'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>طلبات الاشتراك VIP</span>
        </button>

        <button
          type="button"
          onClick={() => {
            playClickSound();
            setActiveTab('pricing');
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'pricing'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>الأسعار والدفع</span>
        </button>

        <button
          type="button"
          onClick={() => {
            playClickSound();
            setActiveTab('security');
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'security'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>حساب المشرف 🔒</span>
        </button>
      </div>

      {/* TAB 1: STUDENTS & LAST SEEN */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              <span>قائمة الطلاب والتواجد الدقيق (آخر ظهور)</span>
            </h2>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="بحث بالاسم أو اليوزر..."
                  className="w-full pl-3 pr-9 py-2 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-emerald-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              </div>

              <select
                value={selectedGradeFilter}
                onChange={(e) => setSelectedGradeFilter(e.target.value)}
                className="py-2 px-3 rounded-xl border border-slate-200 text-xs font-bold outline-none bg-white cursor-pointer"
              >
                <option value="all">كل المراحل</option>
                {GRADES_DATA.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-700 font-black border-b border-slate-200">
                <tr>
                  <th className="p-3.5">الطالب</th>
                  <th className="p-3.5">اسم المستخدم</th>
                  <th className="p-3.5">المرحلة</th>
                  <th className="p-3.5">حالة الاتصال وآخر ظهور</th>
                  <th className="p-3.5">الاشتراك</th>
                  <th className="p-3.5 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((st) => {
                  const presence = formatIraqiLastSeen((st as any).lastActiveAt, (st as any).isOnline);
                  return (
                    <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2.5">
                        <span className="text-xl">{st.avatar || '👦🏻'}</span>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span>{st.fullName}</span>
                            {presence.isLive ? (
                              <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                                🟢 متصل الآن
                              </span>
                            ) : null}
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-0.5 font-normal">
                            {st.city || 'العراق'} • {st.schoolName || 'مدرسة ابتدائية'}
                          </span>
                        </div>
                      </td>
                      <td className="p-3.5 font-mono text-slate-700 font-bold">{st.username}</td>
                      <td className="p-3.5 font-bold text-slate-700">{getIraqiGradeName(st.gradeId)}</td>
                      <td className="p-3.5">
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
                      <td className="p-3.5">
                        {st.subscription === 'paid' ? (
                          <span className="text-xs font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1 w-max">
                            <Crown className="w-3 h-3 text-amber-600" />
                            <span>مشترك VIP</span>
                          </span>
                        ) : (
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 w-max block">
                            مجاني
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            playClickSound();
                            toggleStudentSubscription(st.id, st.subscription === 'paid' ? 'free' : 'paid');
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                            st.subscription === 'paid'
                              ? 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          }`}
                        >
                          {st.subscription === 'paid' ? 'إلغاء التفعيل' : 'تفعيل VIP فوري ⭐'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: SUBJECTS MANAGEMENT (إضافة المواد) */}
      {activeTab === 'subjects' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-emerald-600" />
              <span>إضافة مادة دراسية جديدة لأي مرحلة</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              يمكنك إضافة مواد جديدة (مثل التربية الفنية، الحاسوب، القواعد...) وستظهر فوراً في واجهة طلاب الصف المحدد
            </p>
          </div>

          <form onSubmit={handleAddSubject} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">المرحلة الدراسية:</label>
              <select
                value={newSubGrade}
                onChange={(e) => setNewSubGrade(e.target.value as GradeId)}
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
              <label className="block text-xs font-black text-slate-700 mb-1">اسم المادة:</label>
              <input
                type="text"
                value={newSubName}
                onChange={(e) => setNewSubName(e.target.value)}
                placeholder="مثال: التربية الفنية والنشيد"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">رمز الأيقونة (Emoji):</label>
              <input
                type="text"
                value={newSubIcon}
                onChange={(e) => setNewSubIcon(e.target.value)}
                placeholder="🎨 أو 💻 أو 📖"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">إجراء الحفظ:</label>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة المادة فوراً 🚀</span>
              </button>
            </div>
          </form>

          {/* List of current subjects */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h3 className="text-xs font-black text-slate-800">المواد الحالية المسجلة بالنظام:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {allSubjects.map((sub) => (
                <div key={sub.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{sub.icon}</span>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">{sub.name}</h4>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {getIraqiGradeName(sub.gradeId)}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteSubject(sub.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                    title="حذف المادة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CURRICULUM BOOKS & SUMMARIES (إدارة الكتب والملازم) */}
      {activeTab === 'curriculum' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <BookCheck className="w-5 h-5 text-emerald-600" />
              <span>إدارة الكتب والمناهج والملازم المعتمدة (PDF / Drive)</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              تستطيع إضافة كتب جديدة، ملازم ملخصة، أو تحديث روابط كتب قديمة مثل كتاب القراءة بالرابط الجديد
            </p>
          </div>

          <form onSubmit={handleAddBook} className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">المرحلة الدراسية:</label>
              <select
                value={newBookGrade}
                onChange={(e) => setNewBookGrade(e.target.value as GradeId)}
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
              <label className="block text-xs font-black text-slate-700 mb-1">المادة التابعة لها:</label>
              <input
                type="text"
                value={newBookSubject}
                onChange={(e) => setNewBookSubject(e.target.value)}
                placeholder="مثال: قراءتي، العلوم..."
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">عنوان الكتاب / الملزمة:</label>
              <input
                type="text"
                value={newBookTitle}
                onChange={(e) => setNewBookTitle(e.target.value)}
                placeholder="مثال: كتاب القراءة المنهج الحديث 2026"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">رابط Google Drive / PDF:</label>
              <input
                type="url"
                value={newBookUrl}
                onChange={(e) => setNewBookUrl(e.target.value)}
                placeholder="https://drive.google.com/..."
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold outline-none font-mono"
                dir="ltr"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">حفظ الكتاب:</label>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة الكتاب 📚</span>
              </button>
            </div>
          </form>

          {/* List of current books */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h3 className="text-xs font-black text-slate-800">قائمة الكتب والملازم المرفوعة:</h3>
            <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
              {booksList.map((bk) => (
                <div key={bk.id} className="p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <h4 className="text-xs font-black text-slate-900">{bk.title}</h4>
                      <p className="text-[10px] text-slate-500 font-medium">
                        {getIraqiGradeName(bk.gradeId)} • مادة: {bk.subjectName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={bk.driveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs font-bold flex items-center gap-1 transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>فتح الرابط</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => handleDeleteBook(bk.id)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: VIDEOS MANAGEMENT & STRICT SUBJECT TAGGING */}
      {activeTab === 'videos' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-emerald-600" />
              <span>إضافة وتخصيص شروحات يوتيوب حسب المادة المحددة</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              كل فيديو تضيفه سيرتبط بمادته حصراً (مثلاً فيديو الرياضيات يظهر فقط في الرياضيات، وفيديو العربي يظهر فقط في العربي)
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
                  const matching = allSubjects.filter((s) => s.gradeId === g);
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
                {allSubjects
                  .filter((s) => s.gradeId === newVidGrade)
                  .map((s) => (
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
              <label className="block text-xs font-black text-slate-700 mb-1">حفظ الشرح:</label>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة الفيديو 🎥</span>
              </button>
            </div>
          </form>

          {/* List of current videos */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h3 className="text-xs font-black text-slate-800">قائمة الفيديوهات المسجلة حسب الأقسام:</h3>
            {videosList.length === 0 ? (
              <p className="text-xs text-slate-500 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                لا توجد فيديوهات مسجلة حالياً. أضف شروحات جديدة من النموذج أعلاه.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {videosList.map((vd) => (
                  <div key={vd.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Video className="w-6 h-6 text-rose-600 shrink-0" />
                      <div>
                        <h4 className="text-xs font-black text-slate-900">{vd.title}</h4>
                        <p className="text-[10px] text-slate-500 font-medium">
                          {getIraqiGradeName(vd.gradeId)} • قسم: <strong className="text-emerald-700">{vd.subjectName}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={vd.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold flex items-center gap-1"
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
                        <span>مشاهدة</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => handleDeleteVideo(vd.id)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 cursor-pointer"
                        title="حذف الفيديو نهائياً"
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

      {/* TAB 5: QUESTIONS MANAGEMENT */}
      {activeTab === 'questions' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-600" />
              <span>إضافة سؤال أو تعليل أو تعريف جديد</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              ستظهر الأسئلة فوراً في تدريبات المادة وامتحانات الفصول لجميع الطلاب
            </p>
          </div>

          <form onSubmit={handleAddQuestion} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-black text-slate-800 mb-1">المرحلة الدراسية:</label>
                <select
                  value={selectedQuestionGrade}
                  onChange={(e) => {
                    const ng = e.target.value as GradeId;
                    setSelectedQuestionGrade(ng);
                    const matching = allSubjects.filter((s) => s.gradeId === ng);
                    if (matching.length > 0) setSelectedQuestionSubjectId(matching[0].id);
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
                <label className="block text-xs font-black text-slate-800 mb-1">المادة الدراسية:</label>
                <select
                  value={selectedQuestionSubjectId}
                  onChange={(e) => setSelectedQuestionSubjectId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold outline-none cursor-pointer bg-white"
                >
                  {allSubjects
                    .filter((s) => s.gradeId === selectedQuestionGrade)
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-800 mb-1">الفصل / الوحدة:</label>
                <input
                  type="text"
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  placeholder="مثال: الفصل الأول، الوحدة الثانية..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-800 mb-1">نص السؤال أو التعليل:</label>
              <textarea
                rows={2}
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="اكتب نص السؤال هنا، مثلاً: علل: تسمى الغابات برئة الأرض؟ أو ما المقصود بالقوة؟"
                className="w-full p-3 rounded-2xl border border-slate-200 text-xs font-bold outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-800 mb-1">الجواب النموذجي المعتمد:</label>
              <textarea
                rows={2}
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="اكتب الإجابة النموذجية المعتمدة..."
                className="w-full p-3 rounded-2xl border border-slate-200 text-xs font-bold outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isVipQ"
                checked={isVipOnly}
                onChange={(e) => setIsVipOnly(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <label htmlFor="isVipQ" className="text-xs font-bold text-slate-800 cursor-pointer">
                هذا السؤال مخصص للمشتركين فقط (VIP) ⭐
              </label>
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة السؤال لبنك الأسئلة والامتحانات 🚀</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 6: SUBSCRIPTION REQUESTS */}
      {activeTab === 'requests' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            <span>طلبات تفعيل اشتراكات VIP الواردة</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-700 font-black border-b border-slate-200">
                <tr>
                  <th className="p-3.5">اسم الطالب</th>
                  <th className="p-3.5">المرحلة</th>
                  <th className="p-3.5">وسيلة الدفع</th>
                  <th className="p-3.5">رقم الإشعار / الهاتف</th>
                  <th className="p-3.5">المبلغ</th>
                  <th className="p-3.5">الحالة</th>
                  <th className="p-3.5 text-center">القرار</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subscriptionRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">{req.studentName}</td>
                    <td className="p-3.5">{getIraqiGradeName(req.gradeId)}</td>
                    <td className="p-3.5 font-bold text-slate-700">{req.paymentMethod}</td>
                    <td className="p-3.5 font-mono text-slate-800" dir="ltr">{req.paymentPhoneOrRef}</td>
                    <td className="p-3.5 font-bold text-emerald-700">
                      {formatIraqiDinar(req.amount, req.currency)}
                    </td>
                    <td className="p-3.5">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                        {req.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      {req.status === 'pending' && (
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              playClickSound();
                              approveSubscriptionRequest(req.id);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                          >
                            تأكيد وتفعيل ✓
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: PRICING SETTINGS */}
      {activeTab === 'pricing' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-600" />
            <span>إعدادات الأسعار ووسائل الدفع</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-700">سعر الاشتراك الحالي:</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={subscriptionConfig.price}
                  onChange={(e) => updateSubscriptionConfig({ price: Number(e.target.value) || 0 })}
                  className="w-36 p-2 rounded-xl border border-slate-200 text-sm font-mono font-bold outline-none"
                />
                <span className="font-bold text-xs">{subscriptionConfig.currency}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-700">محفظة زين كاش:</label>
              <input
                type="text"
                value={subscriptionConfig.zainCashWallet}
                onChange={(e) => updateSubscriptionConfig({ zainCashWallet: e.target.value })}
                className="w-full p-2 rounded-xl border border-slate-200 text-xs font-mono font-bold outline-none"
                dir="ltr"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-700">رقم الكي كارد / الماستركارد:</label>
              <input
                type="text"
                value={subscriptionConfig.qiCardNumber}
                onChange={(e) => updateSubscriptionConfig({ qiCardNumber: e.target.value })}
                className="w-full p-2 rounded-xl border border-slate-200 text-xs font-mono font-bold outline-none"
                dir="ltr"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-700">رقم الواتساب والدعم الفوري المعتمد:</label>
              <input
                type="text"
                value="07707383565"
                readOnly
                className="w-full p-2 rounded-xl border border-emerald-300 bg-emerald-50/50 text-emerald-950 text-xs font-mono font-black outline-none"
                dir="ltr"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: ADMIN SECURITY & CREDENTIALS (تغيير حساب المشرف) */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 max-w-xl space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">
                تأمين وحماية حساب المشرف (تغيير اليوزر والباسورد)
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                تغيير اسم المشرف وكلمة المرور لضمان أمان المنصة
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveSecurity} className="space-y-4">
            {securityNotice && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{securityNotice}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">اسم المشرف (Admin Username):</label>
              <div className="relative">
                <input
                  type="text"
                  value={adminUserVal}
                  onChange={(e) => setAdminUserVal(e.target.value)}
                  placeholder="اسم المشرف أو بريده"
                  className="w-full pr-10 pl-3 py-2.5 rounded-2xl border border-slate-200 text-xs font-mono font-bold outline-none focus:border-emerald-500"
                  dir="ltr"
                  required
                />
                <UserCheck className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">كلمة المرور الجديدة (Admin Password):</label>
              <div className="relative">
                <input
                  type="password"
                  value={adminPassVal}
                  onChange={(e) => setAdminPassVal(e.target.value)}
                  placeholder="اكتب كلمة مرور جديدة قوية"
                  className="w-full pr-10 pl-3 py-2.5 rounded-2xl border border-slate-200 text-xs font-mono font-bold outline-none focus:border-emerald-500"
                  dir="ltr"
                  required
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>حفظ وتحديث بيانات المشرف فوراً 🔒</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};


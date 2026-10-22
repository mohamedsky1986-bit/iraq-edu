import React, { useState } from 'react';
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
  PlayCircle
} from 'lucide-react';

const SUBJECT_OPTIONS_BY_GRADE: Record<GradeId, { id: string; name: string }[]> = {
  "grade-1": [
    { id: "ar-1", name: "قراءتي (الحروف والأصوات)" },
    { id: "eng-1", name: "اللغة الإنجليزية (English)" },
    { id: "sci-1", name: "العلوم" },
    { id: "math-1", name: "الرياضيات" },
    { id: "isl-1", name: "التربية الإسلامية" },
  ],
  "grade-2": [
    { id: "ar-2", name: "قراءتي (اللغة العربية)" },
    { id: "math-2", name: "الرياضيات" },
    { id: "sci-2", name: "العلوم" },
    { id: "isl-2", name: "التربية الإسلامية" },
  ],
  "grade-3": [
    { id: "ar-3", name: "قراءتي (اللغة العربية)" },
    { id: "math-3", name: "الرياضيات" },
    { id: "sci-3", name: "العلوم" },
    { id: "isl-3", name: "التربية الإسلامية" },
  ],
  "grade-4": [
    { id: "ar-4", name: "قواعد اللغة العربية" },
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

// Helper to check if a student is genuinely online (strictly within last 3 minutes)
export function isStudentOnline(student: any): boolean {
  if (!student || !student.isOnline) return false;
  if (!student.lastActiveAt) return false;
  const lastActiveTime = new Date(student.lastActiveAt).getTime();
  if (isNaN(lastActiveTime)) return false;
  const diffMs = Date.now() - lastActiveTime;
  return diffMs >= 0 && diffMs <= 3 * 60 * 1000;
}

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
    addQuestion,
    deleteQuestion,
    updateSubscriptionConfig,
    approveSubscriptionRequest,
    rejectSubscriptionRequest,
    logoutAdmin,
  } = useEdu();

  const [activeTab, setActiveTab] = useState<'students' | 'questions' | 'requests' | 'pricing'>('students');

  // Question Management State
  const [selectedGrade, setSelectedGrade] = useState<GradeId>('grade-1');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('ar-1');
  const [questionText, setQuestionText] = useState('');
  const [answerText, setAnswerText] = useState('');
  const [explanation, setExplanation] = useState('');
  const [chapter, setChapter] = useState('الفصل الأول');
  const [isVipOnly, setIsVipOnly] = useState(false);
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [correctOptionIdx, setCorrectOptionIdx] = useState(0);

  // Search and Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGrade, setFilterGrade] = useState<string>('all');

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim() || !answerText.trim()) {
      playWrongSound();
      return;
    }

    const validOptions = options.map((o) => o.trim()).filter(Boolean);

    addQuestion({
      gradeId: selectedGrade,
      subjectId: selectedSubjectId,
      chapter: chapter.trim() || 'الفصل الأول',
      questionText: questionText.trim(),
      answerText: answerText.trim(),
      options: validOptions.length >= 2 ? validOptions : undefined,
      correctAnswerIndex: validOptions.length >= 2 ? correctOptionIdx : undefined,
      explanation: explanation.trim() || undefined,
      isVipOnly,
      difficulty: 'medium',
      tags: [getIraqiGradeName(selectedGrade)],
    });

    playCorrectSound();
    setQuestionText('');
    setAnswerText('');
    setExplanation('');
    setOptions(['', '', '', '']);
    setCorrectOptionIdx(0);
  };

  const filteredStudents = students.filter((st) => {
    const matchesSearch =
      st.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = filterGrade === 'all' || st.gradeId === filterGrade;
    return matchesSearch && matchesGrade;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-black">لوحة تحكم المشرف (Admin)</h1>
            <p className="text-xs text-slate-400 font-medium">
              إدارة الطلاب، تفعيل الاشتراكات، بنك الأسئلة والأسعار • {adminUsername}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            playClickSound();
            logoutAdmin();
          }}
          className="px-4 py-2.5 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-black flex items-center gap-2 cursor-pointer transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>تسجيل خروج المشرف</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => {
            playClickSound();
            setActiveTab('students');
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'students'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>الطلاب المسجلون ({students.length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            playClickSound();
            setActiveTab('requests');
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'requests'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>طلبات الاشتراك VIP ({subscriptionRequests.filter((r) => r.status === 'pending').length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            playClickSound();
            setActiveTab('questions');
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
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
            setActiveTab('pricing');
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'pricing'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>إعدادات الأسعار والدفع</span>
        </button>
      </div>

      {/* Tab 1: Students Management */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              <span>قائمة الطلاب المسجلين والتواجد</span>
            </h2>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="بحث بالاسم أو اسم المستخدم..."
                  className="w-full pl-3 pr-9 py-2 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-emerald-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              </div>

              <select
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
                className="py-2 px-3 rounded-xl border border-slate-200 text-xs font-bold outline-none cursor-pointer bg-white"
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
                  <th className="p-3.5">حالة الاتصال</th>
                  <th className="p-3.5">الاشتراك</th>
                  <th className="p-3.5 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2.5">
                      <div className="relative shrink-0">
                        <span className="text-xl">{st.avatar}</span>
                        {isStudentOnline(st) && (
                          <span
                            className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full animate-pulse"
                            title="متصل الآن"
                          />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span>{st.fullName}</span>
                          {isStudentOnline(st) ? (
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                              🟢 أونلاين الآن
                            </span>
                          ) : (st as any).lastActiveAt ? (
                            <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 border border-slate-200">
                              ⚪ غير متصل ({new Date((st as any).lastActiveAt).toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' })})
                            </span>
                          ) : (
                            <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-400">
                              ⚪ غير متصل
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-normal block mt-0.5">
                          {st.city || 'العراق'} • {st.schoolName || 'مدرسة ابتدائية'}
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5 font-mono text-slate-600 font-bold">{st.username}</td>
                    <td className="p-3.5 font-bold text-slate-700">
                      {getIraqiGradeName(st.gradeId)}
                    </td>
                    <td className="p-3.5">
                      {isStudentOnline(st) ? (
                        <span className="text-xs font-black text-emerald-700">متصل (نشط)</span>
                      ) : (
                        <span className="text-xs text-slate-400">غير متصل</span>
                      )}
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
                          toggleStudentSubscription(
                            st.id,
                            st.subscription === 'paid' ? 'free' : 'paid'
                          );
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          st.subscription === 'paid'
                            ? 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs'
                        }`}
                      >
                        {st.subscription === 'paid' ? 'إلغاء التفعيل' : 'تفعيل VIP فوري ⭐'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Requests */}
      {activeTab === 'requests' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 space-y-4">
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
                    <td className="p-3.5 font-bold text-slate-700">
                      {req.paymentMethod === 'zain_cash'
                        ? 'زين كاش'
                        : req.paymentMethod === 'qi_card'
                        ? 'كي كارد'
                        : req.paymentMethod === 'whatsapp'
                        ? 'واتساب مباشر'
                        : req.paymentMethod === 'asia_cell'
                        ? 'رصيد آسيا'
                        : 'المدرسة'}
                    </td>
                    <td className="p-3.5 font-mono text-slate-800" dir="ltr">{req.paymentPhoneOrRef}</td>
                    <td className="p-3.5 font-bold text-emerald-700">
                      {formatIraqiDinar(req.amount, req.currency)}
                    </td>
                    <td className="p-3.5">
                      {req.status === 'pending' ? (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                          قيد المراجعة
                        </span>
                      ) : req.status === 'approved' ? (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                          تم التفعيل ✓
                        </span>
                      ) : (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                          مرفوض ✗
                        </span>
                      )}
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
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-2xs"
                          >
                            تأكيد وتفعيل ✓
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              playClickSound();
                              rejectSubscriptionRequest(req.id);
                            }}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-100 text-rose-700 font-bold text-xs cursor-pointer"
                          >
                            رفض
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

      {/* Tab 3: Questions Management */}
      {activeTab === 'questions' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 space-y-6">
          <div className="border-b border-slate-100 pb-4">
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
                  value={selectedGrade}
                  onChange={(e) => {
                    const ng = e.target.value as GradeId;
                    setSelectedGrade(ng);
                    const list = SUBJECT_OPTIONS_BY_GRADE[ng] || [];
                    if (list.length > 0) setSelectedSubjectId(list[0].id);
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold outline-none cursor-pointer"
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
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold outline-none cursor-pointer"
                >
                  {(SUBJECT_OPTIONS_BY_GRADE[selectedGrade] || []).map((s) => (
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

            <div>
              <label className="block text-xs font-black text-slate-800 mb-1">توضيح المعلم والشرح (اختياري):</label>
              <input
                type="text"
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="ملاحظة إرشادية وتوضيح للطفل..."
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isVip"
                checked={isVipOnly}
                onChange={(e) => setIsVipOnly(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <label htmlFor="isVip" className="text-xs font-bold text-slate-800 cursor-pointer">
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

      {/* Tab 4: Pricing Settings */}
      {activeTab === 'pricing' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/90 space-y-4">
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
              <label className="block text-xs font-bold text-slate-700">رقم الواتساب والدعم الفوري:</label>
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
    </div>
  );
};


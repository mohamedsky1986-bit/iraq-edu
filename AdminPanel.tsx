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
} from 'lucide-react';

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

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'students' | 'requests' | 'pricing' | 'curriculum' | 'security'
  >('students');

  // Search & filter in students
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('all');

  // Pricing Form State
  const [newPrice, setNewPrice] = useState(subscriptionConfig.price);
  const [newCurrency, setNewCurrency] = useState(subscriptionConfig.currency);
  const [newPeriodName, setNewPeriodName] = useState(subscriptionConfig.periodName);
  const [newZainWallet, setNewZainWallet] = useState(subscriptionConfig.zainCashWallet);
  const [newQiCard, setNewQiCard] = useState(subscriptionConfig.qiCardNumber);
  const [pricingFeedback, setPricingFeedback] = useState(false);

  // Security Credentials Form State ("اسم مع باسورد لعدم الاختراق")
  const [newAdminUser, setNewAdminUser] = useState(adminUsername);
  const [newAdminPass, setNewAdminPass] = useState('');
  const [securityFeedback, setSecurityFeedback] = useState<{ text: string; success: boolean } | null>(null);

  // Question editing / creation modal state
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Question form state
  const [formGradeId, setFormGradeId] = useState<GradeId>('grade-1');
  const [formSubjectId, setFormSubjectId] = useState<string>('ar-1');
  const [formChapter, setFormChapter] = useState('');
  const [formLesson, setFormLesson] = useState('');
  const [formQuestionText, setFormQuestionText] = useState('');
  const [formAnswerText, setFormAnswerText] = useState('');
  const [formOptions, setFormOptions] = useState<string[]>(['', '', '', '']);
  const [formCorrectIndex, setFormCorrectIndex] = useState(0);
  const [formExplanation, setFormExplanation] = useState('');
  const [formIsVipOnly, setFormIsVipOnly] = useState(false);
  const [formDifficulty, setFormDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  // Filtered students
  const filteredStudents = students.filter((s) => {
    const matchGrade = selectedGradeFilter === 'all' || s.gradeId === selectedGradeFilter;
    const matchSearch =
      s.fullName.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.username.toLowerCase().includes(studentSearch.toLowerCase());
    return matchGrade && matchSearch;
  });

  // Filtered questions
  const [qGradeFilter, setQGradeFilter] = useState<string>('all');
  const filteredQuestions = questions.filter((q) => {
    return qGradeFilter === 'all' || q.gradeId === qGradeFilter;
  });

  const handleOpenAddQuestion = () => {
    playClickSound();
    setEditingQuestion(null);
    setFormGradeId('grade-1');
    setFormSubjectId(subjects.find((s) => s.gradeId === 'grade-1')?.id || 'ar-1');
    setFormChapter('');
    setFormLesson('');
    setFormQuestionText('');
    setFormAnswerText('');
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
    setFormChapter(q.chapter || '');
    setFormLesson(q.lessonName || '');
    setFormQuestionText(q.questionText);
    setFormAnswerText(q.answerText);
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
      return;
    }

    const cleanOptions = formOptions.filter((opt) => opt.trim().length > 0);

    if (editingQuestion) {
      updateQuestion({
        ...editingQuestion,
        gradeId: formGradeId,
        subjectId: formSubjectId,
        chapter: formChapter.trim() || 'الفصل الأول',
        lessonName: formLesson.trim(),
        questionText: formQuestionText.trim(),
        answerText: formAnswerText.trim(),
        options: cleanOptions.length >= 2 ? cleanOptions : ['صحيح', 'خطأ'],
        correctAnswerIndex: formCorrectIndex < cleanOptions.length ? formCorrectIndex : 0,
        explanation: formExplanation.trim(),
        isVipOnly: formIsVipOnly,
        difficulty: formDifficulty,
      });
    } else {
      addQuestion({
        gradeId: formGradeId,
        subjectId: formSubjectId,
        chapter: formChapter.trim() || 'الفصل الأول',
        lessonName: formLesson.trim(),
        questionText: formQuestionText.trim(),
        answerText: formAnswerText.trim(),
        options: cleanOptions.length >= 2 ? cleanOptions : ['نعم', 'لا'],
        correctAnswerIndex: formCorrectIndex < cleanOptions.length ? formCorrectIndex : 0,
        explanation: formExplanation.trim(),
        isVipOnly: formIsVipOnly,
        difficulty: formDifficulty,
        tags: [getIraqiGradeName(formGradeId)],
      });
    }

    playCorrectSound();
    setIsQuestionModalOpen(false);
  };

  // Save Pricing Settings
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

  // Save Admin Credentials ("اسم مع باسورد لعدم الاختراق")
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
        text: 'تم تحديث اسم المشرف وكلمة المرور بنجاح! تم تأمين الحساب لمنع الاختراق 🔒',
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
      {/* Admin Title & Statistics Banner */}
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
                مشرف المنصة الحالي: <strong className="text-rose-300 font-mono">{adminUsername}</strong> • إدارة كاملة للطلبة، الأسعار، المناهج والاشتراكات
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

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
            <p className="text-xs text-slate-400 font-medium">إجمالي الطلاب المسجلين</p>
            <p className="text-2xl font-black text-white mt-1">{students.length}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
            <p className="text-xs text-amber-400 font-medium">اشتراكات مفعلة (VIP)</p>
            <p className="text-2xl font-black text-amber-300 mt-1">
              {students.filter((s) => s.subscription === 'paid').length}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
            <p className="text-xs text-cyan-400 font-medium">سعر الاشتراك الحالي</p>
            <p className="text-2xl font-black text-cyan-300 mt-1 font-mono">
              {formatIraqiDinar(subscriptionConfig.price, subscriptionConfig.currency)}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
            <p className="text-xs text-rose-400 font-medium">طلبات الاشتراك المعلقة</p>
            <p className="text-2xl font-black text-rose-300 mt-1">
              {subscriptionRequests.filter((r) => r.status === 'pending').length}
            </p>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-slate-200 gap-4 overflow-x-auto pb-1">
        <button
          onClick={() => {
            playClickSound();
            setActiveTab('students');
          }}
          className={`pb-3 text-sm font-black border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'students'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>إدارة الطلبة والاشتراكات ({students.length})</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            setActiveTab('requests');
          }}
          className={`pb-3 text-sm font-black border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'requests'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4 text-amber-500" />
          <span>
            طلبات الاشتراك ({subscriptionRequests.filter((r) => r.status === 'pending').length})
          </span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            setActiveTab('pricing');
          }}
          className={`pb-3 text-sm font-black border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'pricing'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <DollarSign className="w-4 h-4 text-emerald-600" />
          <span>تعديل سعر الاشتراك والمدفوعات</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            setActiveTab('curriculum');
          }}
          className={`pb-3 text-sm font-black border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'curriculum'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>تعديل المناهج وبنك الأسئلة ({questions.length})</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            setActiveTab('security');
          }}
          className={`pb-3 text-sm font-black border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'security'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <KeyRound className="w-4 h-4 text-rose-600" />
          <span>أمان الأدمن (اسم وباسورد لعدم الاختراق)</span>
        </button>
      </div>

      {/* Tab 1: Students & Subscriptions Management */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
            <div className="relative w-full sm:w-80">
              <Search className="absolute right-3.5 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="بحث بالاسم أو اسم المستخدم..."
                className="w-full pr-10 pl-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              <span className="text-xs text-slate-500 font-bold shrink-0">المرحلة:</span>
              <select
                value={selectedGradeFilter}
                onChange={(e) => setSelectedGradeFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold"
              >
                <option value="all">جميع الصفوف الابتدائية</option>
                {GRADES_DATA.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-black">
                  <tr>
                    <th className="p-4">الطالب</th>
                    <th className="p-4">المرحلة الدراسية</th>
                    <th className="p-4">اسم المستخدم (اليوزر)</th>
                    <th className="p-4">نوع الاشتراك</th>
                    <th className="p-4">النقاط والنجوم</th>
                    <th className="p-4 text-center">التحكم بالاشتراك والإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((std) => (
                    <tr key={std.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{std.avatar}</span>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{std.fullName}</p>
                            <p className="text-[11px] text-slate-400">
                              {std.schoolName || 'المدرسة الابتدائية'} • {std.city || 'العراق'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-bold text-slate-700">
                        {getIraqiGradeName(std.gradeId)}
                      </td>
                      <td className="p-4 font-mono font-bold text-slate-600" dir="ltr">
                        {std.username}
                      </td>
                      <td className="p-4">
                        {std.subscription === 'paid' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-100 text-amber-800 border border-amber-300">
                            <Crown className="w-3.5 h-3.5" /> مدفوع (VIP)
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                            مجاني
                          </span>
                        )}
                      </td>
                      <td className="p-4 font-bold text-slate-700">
                        <div className="flex items-center gap-1.5">
                          <span className="text-amber-500 font-black">{std.starsEarned} ⭐</span>
                          <span>•</span>
                          <span className="text-emerald-700">{std.totalScore} نقطة</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              playClickSound();
                              toggleStudentSubscription(std.id);
                            }}
                            className={`px-3 py-1.5 rounded-xl font-black text-[11px] transition-all cursor-pointer ${
                              std.subscription === 'paid'
                                ? 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                            }`}
                            title="تفعيل أو إلغاء الاشتراك المدفوع للمنهج"
                          >
                            {std.subscription === 'paid' ? 'تحويل لمجاني' : 'تفعيل اشتراك VIP 🌟'}
                          </button>

                          <button
                            onClick={() => {
                              const newPass = prompt(`أدخل الرمز الجديد للطالب ${std.fullName}:`, '123');
                              if (newPass) {
                                resetStudentPassword(std.id, newPass);
                                playCorrectSound();
                                alert('تم تحديث رمز مرور الطالب بنجاح');
                              }
                            }}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
                            title="تغيير رمز مرور الطالب"
                          >
                            <KeyRound className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`هل أنت متأكد من حذف الطالب ${std.fullName}؟`)) {
                                deleteStudent(std.id);
                                playClickSound();
                              }
                            }}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
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

      {/* Tab 2: Subscription Requests Management ("طلب الاشتراك") */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>طلبات تفعيل اشتراك VIP المقدمة من التلاميذ:</span>
            </h3>
            <span className="text-xs font-bold text-slate-500">
              يمكنك الموافقة بنقرة واحدة لترقية حساب الطالب فورياً
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-black">
                  <tr>
                    <th className="p-4">الطالب</th>
                    <th className="p-4">المرحلة</th>
                    <th className="p-4">طريقة الدفع</th>
                    <th className="p-4">رقم التحويل / الإشعار</th>
                    <th className="p-4">المبلغ</th>
                    <th className="p-4">تاريخ الطلب</th>
                    <th className="p-4">الحالة</th>
                    <th className="p-4 text-center">الإجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {subscriptionRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/70">
                      <td className="p-4 font-bold text-slate-900">
                        {req.studentName}
                        <span className="block text-[11px] text-slate-400 font-mono" dir="ltr">
                          @{req.username}
                        </span>
                      </td>
                      <td className="p-4 text-slate-700">{getIraqiGradeName(req.gradeId)}</td>
                      <td className="p-4 font-bold text-emerald-800">
                        {req.paymentMethod === 'zain_cash'
                          ? 'زين كاش 📱'
                          : req.paymentMethod === 'qi_card'
                          ? 'كي كارد 💳'
                          : req.paymentMethod === 'asia_cell'
                          ? 'رصيد كارت 🎟️'
                          : 'نقداً بالمدرسة 🏫'}
                      </td>
                      <td className="p-4 font-mono font-bold text-slate-700" dir="ltr">
                        {req.paymentPhoneOrRef || '-'}
                      </td>
                      <td className="p-4 font-black text-slate-900 font-mono">
                        {formatIraqiDinar(req.amount, req.currency)}
                      </td>
                      <td className="p-4 text-slate-500 font-mono">{req.requestDate}</td>
                      <td className="p-4">
                        {req.status === 'pending' ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200">
                            قيد الانتظار ⏳
                          </span>
                        ) : req.status === 'approved' ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                            تم التفعيل ✓
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-200">
                            مرفوض
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {req.status === 'pending' ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => {
                                playCorrectSound();
                                approveSubscriptionRequest(req.id);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[11px] flex items-center gap-1 shadow-xs cursor-pointer"
                              title="قبول الطلب وتفعيل اشتراك VIP فوراً"
                            >
                              <CheckCheck className="w-3.5 h-3.5" />
                              <span>قبول وتفعيل VIP</span>
                            </button>
                            <button
                              onClick={() => {
                                playClickSound();
                                rejectSubscriptionRequest(req.id);
                              }}
                              className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-100 text-rose-700 font-bold text-[11px]"
                              title="رفض الطلب"
                            >
                              رفض
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px] font-medium">مكتمل</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Dynamic Pricing Management ("تعديل السعر من لوحة التحكم") */}
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
                <input
                  type="text"
                  value={newZainWallet}
                  onChange={(e) => setNewZainWallet(e.target.value)}
                  placeholder="07801234567"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 outline-none text-xs sm:text-sm font-mono"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  رقم بطاقة كي كارد / ماستركارد (Qi Card)
                </label>
                <input
                  type="text"
                  value={newQiCard}
                  onChange={(e) => setNewQiCard(e.target.value)}
                  placeholder="6037-XXXX-XXXX-XXXX"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 outline-none text-xs sm:text-sm font-mono"
                  dir="ltr"
                />
              </div>
            </div>

            {pricingFeedback && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>تم حفظ وتحديث سعر الاشتراك وحسابات الدفع بنجاح! ✓</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md transition-all cursor-pointer"
            >
              حفظ وتطبيق سعر الاشتراك الجديد 💳
            </button>
          </form>
        </div>
      )}

      {/* Tab 4: Curriculum & Questions Bank Management */}
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
              <span>إضافة سؤال جديد للمنهاج</span>
            </button>
          </div>

          {/* Questions Grid */}
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
                      {subjects.find((s) => s.id === q.subjectId)?.name || q.subjectId}
                    </span>
                    <span className="text-xs text-slate-500">
                      {q.chapter} {q.lessonName ? `• ${q.lessonName}` : ''}
                    </span>
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
                    <span className="font-bold text-emerald-800">الجواب: </span>
                    {q.answerText}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleOpenEditQuestion(q)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 text-xs font-bold"
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
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700"
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

      {/* Tab 5: Admin Security ("اسم مع باسورد لعدم الاختراق") */}
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

      {/* Add / Edit Question Modal */}
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
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="mt-5 space-y-4">
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
                      const matchingSubj = subjects.find((s) => s.gradeId === newGrade);
                      if (matchingSubj) setFormSubjectId(matchingSubj.id);
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
                    المادة الدراسية
                  </label>
                  <select
                    value={formSubjectId}
                    onChange={(e) => setFormSubjectId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                  >
                    {subjects
                      .filter((s) => s.gradeId === formGradeId)
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                  </select>
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
                    placeholder="مثال: الفصل الأول"
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
                    placeholder="مثال: الحروف والمقاطع"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  نص السؤال (يقرأه النظام صوتياً للطفل)
                </label>
                <textarea
                  value={formQuestionText}
                  onChange={(e) => setFormQuestionText(e.target.value)}
                  placeholder="اكتب نص السؤال بوضوح..."
                  rows={2}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  الجواب النموذجي المعتمد
                </label>
                <textarea
                  value={formAnswerText}
                  onChange={(e) => setFormAnswerText(e.target.value)}
                  placeholder="اكتب الإجابة الكاملة النموذجية..."
                  rows={2}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  خيارات الاختبار التفاعلي (حدد الإجابة الصحيحة)
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
                  className="w-4 h-4 text-amber-600 rounded-sm"
                />
                <label htmlFor="vipCheck" className="text-xs font-bold text-amber-900 cursor-pointer">
                  مخصص فقط للاشتراكات المفعلة (VIP)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsQuestionModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
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
    </div>
  );
};

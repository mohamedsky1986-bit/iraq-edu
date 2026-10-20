import React, { useState } from 'react';
import { useEdu } from '../context/EduContext';
import { GradeId, Question } from '../types/index';
import { GRADES_DATA } from '../data/initialData';
import { getIraqiGradeName } from '../utils/edu-logic';
import { playClickSound, playCorrectSound } from '../utils/audio';
import {
  Users, BookOpen, PlusCircle, KeyRound, Trash2, Edit3,
  Shield, CreditCard, X, CheckCheck
} from 'lucide-react';

const OFFICIAL_IRAQI_SUBJECTS: Record<GradeId, { id: string; name: string }[]> = {
  'grade-1': [
    { id: 'ar-1', name: 'قراءتي (الحروف والمقاطع)' }, { id: 'math-1', name: 'الرياضيات' },
    { id: 'sci-1', name: 'العلوم' }, { id: 'isl-1', name: 'التربية الإسلامية' }, { id: 'eng-1', name: 'اللغة الإنجليزية' }
  ],
  'grade-2': [
    { id: 'ar-2', name: 'قراءتي' }, { id: 'math-2', name: 'الرياضيات' },
    { id: 'sci-2', name: 'العلوم' }, { id: 'isl-2', name: 'التربية الإسلامية' }, { id: 'eng-2', name: 'اللغة الإنجليزية' }
  ],
  'grade-3': [
    { id: 'ar-3', name: 'قراءتي' }, { id: 'math-3', name: 'الرياضيات' },
    { id: 'sci-3', name: 'العلوم' }, { id: 'isl-3', name: 'التربية الإسلامية' }, { id: 'eng-3', name: 'اللغة الإنجليزية' }
  ],
  'grade-4': [
    { id: 'ar-4', name: 'قواعد العربية' }, { id: 'math-4', name: 'الرياضيات' },
    { id: 'sci-4', name: 'العلوم' }, { id: 'soc-4', name: 'الاجتماعيات' },
    { id: 'isl-4', name: 'التربية الإسلامية' }, { id: 'eng-4', name: 'اللغة الإنجليزية' }
  ],
  'grade-5': [
    { id: 'ar-5', name: 'قواعد اللغة العربية' }, { id: 'math-5', name: 'الرياضيات' },
    { id: 'sci-5', name: 'العلوم' }, { id: 'soc-5', name: 'الاجتماعيات' },
    { id: 'isl-5', name: 'التربية الإسلامية' }, { id: 'eng-5', name: 'اللغة الإنجليزية' }
  ],
  'grade-6': [
    { id: 'ar-6', name: 'قواعد العربية (وزاري)' }, { id: 'math-6', name: 'الرياضيات (وزاري)' },
    { id: 'sci-6', name: 'العلوم (وزاري)' }, { id: 'soc-6', name: 'الاجتماعيات (وزاري)' },
    { id: 'isl-6', name: 'التربية الإسلامية (وزاري)' }, { id: 'eng-6', name: 'اللغة الإنجليزية (وزاري)' }
  ]
};

export const AdminPanel: React.FC = () => {
  const {
    students, questions, adminUsername, subscriptionConfig, subscriptionRequests,
    toggleStudentSubscription, resetStudentPassword, deleteStudent, addQuestion,
    updateQuestion, deleteQuestion, changeAdminCredentials, updateSubscriptionConfig,
    approveSubscriptionRequest, rejectSubscriptionRequest
  } = useEdu();

  const [activeTab, setActiveTab] = useState<'students' | 'requests' | 'curriculum' | 'pricing' | 'security'>('curriculum');
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
  const [securityFeedback, setSecurityFeedback] = useState<string | null>(null);

  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const [formQuestionType, setFormQuestionType] = useState<'multiple_choice' | 'qa' | 'fill_in_the_blank' | 'reasoning' | 'definition'>('qa');
  const [formBadgeType, setFormBadgeType] = useState<'none' | 'ministerial' | 'smart_challenge' | 'focus_tip'>('none');
  const [isCustomSubject, setIsCustomSubject] = useState(false);
  const [customSubjectName, setCustomSubjectName] = useState('');
  const [formGradeId, setFormGradeId] = useState<GradeId>('grade-5');
  const [formSubjectId, setFormSubjectId] = useState('ar-5');
  const [formChapter, setFormChapter] = useState('');
  const [formLessonName, setFormLessonName] = useState('');
  const [formQuestionText, setFormQuestionText] = useState('');
  const [formAnswerText, setFormAnswerText] = useState('');
  const [formOptions, setFormOptions] = useState<string[]>(['', '', '', '']);
  const [formCorrectIndex, setFormCorrectIndex] = useState(0);
  const [formExplanation, setFormExplanation] = useState('');
  const [formIsVipOnly, setFormIsVipOnly] = useState(false);

  const filteredStudents = students.filter((st) => {
    const matchSearch = st.fullName.toLowerCase().includes(studentSearch.toLowerCase()) || st.username.toLowerCase().includes(studentSearch.toLowerCase());
    const matchGrade = selectedGradeFilter === 'all' || st.gradeId === selectedGradeFilter;
    return matchSearch && matchGrade;
  });

  const openCreateQuestion = () => {
    setEditingQuestion(null);
    setFormQuestionType('qa');
    setFormBadgeType('none');
    setIsCustomSubject(false);
    setCustomSubjectName('');
    setFormChapter('');
    setFormLessonName('');
    setFormQuestionText('');
    setFormAnswerText('');
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
    setFormOptions(q.options && q.options.length >= 2 ? [...q.options] : ['', '', '', '']);
    setFormCorrectIndex(q.correctAnswerIndex ?? 0);
    setFormExplanation(q.explanation || '');
    setFormIsVipOnly(q.isVipOnly);
    setIsQuestionModalOpen(true);
  };

  const insertFormatting = (syntax: string) => {
    playClickSound();
    setFormQuestionText((prev) => prev + syntax);
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formQuestionText.trim() || !formAnswerText.trim()) return alert('يرجى كتابة نص السؤال والجواب');
    const effectiveSubject = isCustomSubject && customSubjectName.trim() ? customSubjectName.trim() : formSubjectId;
    const payload: any = {
      gradeId: formGradeId,
      subjectId: effectiveSubject,
      chapter: formChapter.trim() || 'الوحدة الأولى',
      lessonName: formLessonName.trim(),
      questionText: formQuestionText.trim(),
      answerText: formAnswerText.trim(),
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
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div>
          <h1 className="text-xl sm:text-2xl font-black">لوحة الإشراف وإدارة منصة المتفوق</h1>
          <p className="text-xs text-slate-400">إدارة الأسئلة، التعاليل، التعاريف، الاشتراكات والأسعار</p>
        </div>
        <button
          onClick={openCreateQuestion}
          className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black flex items-center gap-2 cursor-pointer shadow-lg"
        >
          <PlusCircle className="w-4 h-4" />
          <span>إضافة سؤال / تعليل / تعريف</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
        {[
          { id: 'curriculum', label: 'بنك الأسئلة والمناهج', icon: BookOpen, count: questions.length },
          { id: 'students', label: 'الطلاب المشتركون', icon: Users, count: students.length },
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
              className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer ${
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

      {/* Questions Tab */}
      {activeTab === 'curriculum' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <h2 className="text-sm font-black text-slate-800">بنك الأسئلة والتعاليل ({questions.length} سؤال مضاف)</h2>
            <button onClick={openCreateQuestion} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black cursor-pointer flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4" /> إضافة سؤال جديد
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {questions.slice(0, 60).map((q) => (
              <div key={q.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between gap-2 text-right">
                <div>
                  <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">{getIraqiGradeName(q.gradeId)}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">{q.chapter}</span>
                    {q.questionType === 'reasoning' && <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-1.5 rounded">علل 🧐</span>}
                    {q.questionType === 'definition' && <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-1.5 rounded">تعريف 📖</span>}
                    {q.questionType === 'fill_in_the_blank' && <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 rounded">فراغ ✏️</span>}
                  </div>
                  <div className="font-bold text-xs text-slate-900 leading-snug">{q.questionText}</div>
                  <div className="text-[11px] text-slate-600 mt-1 line-clamp-2">الجواب: {q.answerText}</div>
                </div>
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/60">
                  <button onClick={() => openEditQuestion(q)} className="p-1 text-slate-600 hover:text-emerald-700 cursor-pointer"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => { if (confirm('حذف السؤال؟')) deleteQuestion(q.id); }} className="p-1 text-rose-500 hover:text-rose-700 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Students Tab */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <input type="text" placeholder="بحث عن طالب..." value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)} className="w-full sm:w-80 p-2.5 rounded-xl border border-slate-200 text-xs font-bold" />
            <select value={selectedGradeFilter} onChange={(e) => setSelectedGradeFilter(e.target.value)} className="p-2.5 rounded-xl border border-slate-200 text-xs font-bold w-full sm:w-auto">
              <option value="all">كل المراحل الدراسية</option>
              {GRADES_DATA.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right border-collapse">
              <thead><tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/50"><th className="p-3">الطالب</th><th className="p-3">المرحلة</th><th className="p-3">الاشتراك</th><th className="p-3 text-center">الإجراءات</th></tr></thead>
              <tbody>
                {filteredStudents.map((st) => (
                  <tr key={st.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900 flex items-center gap-2"><span>{st.avatar}</span><div><div>{st.fullName}</div><div className="text-[10px] text-slate-400">@{st.username}</div></div></td>
                    <td className="p-3 text-slate-600">{getIraqiGradeName(st.gradeId)}</td>
                    <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${st.subscription === 'paid' ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-600'}`}>{st.subscription === 'paid' ? 'VIP ⭐' : 'مجاني'}</span></td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => toggleStudentSubscription(st.id)} className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-500 text-white cursor-pointer">{st.subscription === 'paid' ? 'تحويل لمجاني' : 'تفعيل VIP'}</button>
                        <button onClick={() => resetStudentPassword(st.id)} className="p-1 text-slate-500 cursor-pointer" title="تصفير كلمة المرور"><KeyRound className="w-4 h-4" /></button>
                        <button onClick={() => { if (confirm('حذف الطالب؟')) deleteStudent(st.id); }} className="p-1 text-rose-500 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Requests Tab */}
      {activeTab === 'requests' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 space-y-3">
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

      {/* Pricing Tab */}
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

      {/* Security Tab */}
      {activeTab === 'security' && (
        <form onSubmit={handleSaveSecurity} className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 max-w-md mx-auto text-right">
          <h2 className="text-sm font-black text-slate-800">بيانات دخول المشرف</h2>
          <div><label className="block text-xs font-bold text-slate-700 mb-1">اسم المشرف</label><input type="text" value={newAdminUser} onChange={(e) => setNewAdminUser(e.target.value)} className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold" /></div>
          <div><label className="block text-xs font-bold text-slate-700 mb-1">كلمة المرور الجديدة</label><input type="password" placeholder="اكتب كلمة مرور قوية..." value={newAdminPass} onChange={(e) => setNewAdminPass(e.target.value)} className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold" /></div>
          {securityFeedback && <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold text-center">{securityFeedback}</div>}
          <button type="submit" className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-black text-xs cursor-pointer">تحديث بيانات الدخول</button>
        </form>
      )}

      {/* Modal */}
      {isQuestionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto text-right">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base">{editingQuestion ? 'تعديل السؤال / التعليل' : 'إضافة سؤال جديد لبنك المناهج'}</h3>
              <button onClick={() => setIsQuestionModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveQuestion} className="space-y-4 pt-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">نوع صياغة السؤال أو النمط</label>
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
                      className={`py-2 px-1.5 rounded-xl text-xs font-black flex items-center justify-center gap-1 border cursor-pointer ${t.span || ''} ${
                        formQuestionType === t.id ? `${t.color} text-white shadow-xs` : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">وسام تمييز السؤال</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {[
                    { id: 'none', label: 'بدون وسام' }, { id: 'ministerial', label: '🌟 سؤال وزاري مرشح' },
                    { id: 'smart_challenge', label: '🎯 تحدي الأذكياء' }, { id: 'focus_tip', label: '💡 فهم وتركيز' }
                  ].map((b) => (
                    <button key={b.id} type="button" onClick={() => setFormBadgeType(b.id as any)} className={`py-1.5 px-2 rounded-xl text-xs font-bold border cursor-pointer ${formBadgeType === b.id ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">المرحلة الدراسية</label>
                  <select value={formGradeId} onChange={(e) => { const ng = e.target.value as GradeId; setFormGradeId(ng); const ms = (OFFICIAL_IRAQI_SUBJECTS[ng] || [])[0]; if (ms) setFormSubjectId(ms.id); setIsCustomSubject(false); }} className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold">
                    {GRADES_DATA.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">المادة الدراسية</label>
                  <select value={isCustomSubject ? 'custom' : formSubjectId} onChange={(e) => { if (e.target.value === 'custom') setIsCustomSubject(true); else { setIsCustomSubject(false); setFormSubjectId(e.target.value); }}} className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold">
                    {(OFFICIAL_IRAQI_SUBJECTS[formGradeId] || []).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                    <option value="custom">➕ مادة دراسية أخرى (مخصصة)...</option>
                  </select>
                  {isCustomSubject && <input type="text" placeholder="اسم المادة..." value={customSubjectName} onChange={(e) => setCustomSubjectName(e.target.value)} className="w-full mt-2 p-2 rounded-xl border border-emerald-300 text-xs font-bold" />}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><label className="block text-xs font-bold text-slate-700 mb-1">اسم الفصل أو الوحدة</label><input type="text" placeholder="الفصل الأول / الوحدة الثانية..." value={formChapter} onChange={(e) => setFormChapter(e.target.value)} className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold" /></div>
                <div><label className="block text-xs font-bold text-slate-700 mb-1">اسم الدرس أو الموضوع</label><input type="text" placeholder="الفاعل / التكاثر..." value={formLessonName} onChange={(e) => setFormLessonName(e.target.value)} className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold" /></div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    {formQuestionType === 'reasoning' ? 'نص التعليل المطلوب (علل / اذكر السبب...)' : formQuestionType === 'definition' ? 'المصطلح المراد تعريفه (عرّف / ما المقصود بـ...)' : formQuestionType === 'fill_in_the_blank' ? 'نص جملة الفراغ (استخدم زر فراغ ......)' : 'نص السؤال'}
                  </label>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => insertFormatting('**نص عريض**')} className="px-1.5 py-0.5 text-[10px] bg-slate-100 rounded font-black">عريض **</button>
                    <button type="button" onClick={() => insertFormatting('==تمييز أصفر==')} className="px-1.5 py-0.5 text-[10px] bg-amber-100 text-amber-900 rounded font-bold">تمييز ==</button>
                    <button type="button" onClick={() => insertFormatting(' ...... ')} className="px-1.5 py-0.5 text-[10px] bg-blue-100 text-blue-900 rounded font-mono font-bold">فراغ ......</button>
                  </div>
                </div>
                <textarea rows={3} value={formQuestionText} onChange={(e) => setFormQuestionText(e.target.value)} placeholder="اكتب السؤال هنا..." className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold leading-relaxed" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {formQuestionType === 'reasoning' ? 'السبب والتعليل النموذجي المعتمد' : formQuestionType === 'definition' ? 'التعريف والشرح العلمي/اللغوي الكامل' : formQuestionType === 'fill_in_the_blank' ? 'الكلمة الصحيحة لملء الفراغ' : 'الجواب النموذجي المعتمد'}
                </label>
                <textarea rows={2} value={formAnswerText} onChange={(e) => setFormAnswerText(e.target.value)} placeholder="اكتب الإجابة النموذجية الكاملة..." className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold leading-relaxed" />
              </div>

              {formQuestionType === 'multiple_choice' && (
                <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2">
                  <p className="text-xs font-black text-emerald-900">خيارات الاختبار (اختر الإجابة الصحيحة):</p>
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

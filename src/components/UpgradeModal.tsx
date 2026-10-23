import React, { useState } from 'react';
import { useEdu } from '../context/EduContext';
import { formatIraqiDinar, getIraqiGradeName } from '../utils/edu-logic';
import { playClickSound, playCorrectSound } from '../utils/audio';
import {
  X,
  Crown,
  Sparkles,
  Check,
  CreditCard,
  Phone,
  Send,
  Copy,
  CheckCircle2,
  User,
  BookOpen,
  MessageCircle,
} from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdminLogin: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  onOpenAdminLogin,
}) => {
  const {
    currentStudent,
    subscriptionConfig,
    submitSubscriptionRequest,
    toggleStudentSubscription,
  } = useEdu();

  // طرق الدفع العراقية المعتمدة
  const [paymentMethod, setPaymentMethod] = useState<'asia_cell' | 'master_card' | 'zain_cash'>('asia_cell');
  const [senderInfo, setSenderInfo] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  // أرقام الدفع والواتساب للمشرف (قابلة للتعديل من لوحة الإدارة)
  const adminWhatsApp = (subscriptionConfig as any).whatsappNumber || subscriptionConfig.supportPhone || '07709876543';
  const asiacellNumber = (subscriptionConfig as any).asiaCellNumber || subscriptionConfig.supportPhone || '07709876543';
  const masterCardNumber = (subscriptionConfig as any).masterCardNumber || subscriptionConfig.qiCardNumber || '5377-0000-1122-3344';
  const zainCashNumber = subscriptionConfig.zainCashWallet || '07801234567';

  // نسخ الرقم إلى الحافظة
  const handleCopy = (text: string, key: string) => {
    playClickSound();
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // إرسال الطلب مباشرة إلى واتساب المشرف
  const handleSendToWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    playCorrectSound();

    const studentName = currentStudent?.fullName || 'طالب جديد';
    const studentUsername = currentStudent?.username || 'غير مسجل';
    const gradeName = currentStudent ? getIraqiGradeName(currentStudent.gradeId) : 'الصف الابتدائي';
    const amountStr = formatIraqiDinar(subscriptionConfig.price, subscriptionConfig.currency);

    const methodTitle =
      paymentMethod === 'asia_cell'
        ? `تحويل رصيد آسيا سيل (Asiacell) إلى الرقم: ${asiacellNumber}`
        : paymentMethod === 'master_card'
        ? `تحويل ماستر كارد / كي كارد إلى البطاقة: ${masterCardNumber}`
        : `تحويل محفظة زين كاش إلى الرقم: ${zainCashNumber}`;

    const messageText = 
`السلام عليكم أستاذ، أريد تفعيل اشتراك VIP في منصة المتفوق التعليمية 🌟

👤 اسم الطالب: ${studentName}
🔑 اسم المستخدم (اليوزر): ${studentUsername}
📚 المرحلة الدراسية: ${gradeName}
💰 مبلغ الاشتراك: ${amountStr}
💳 طريقة الدفع المختارة: ${methodTitle}
${senderInfo.trim() ? `📲 رقم التحويل / كود الكارت: ${senderInfo.trim()}` : '📲 يرجى تأكيد استلام الرصيد والتحويل'}

يرجى تفعيل الحساب لفتح بنك الأسئلة الوزارية والشروحات، وشكراً جزيلاً!`;

    // تنظيف رقم الواتساب من الصفر في البداية وإضافة رمز العراق 964
    let cleanPhone = adminWhatsApp.replace(/\D/g, '');
    if (cleanPhone.startsWith('07')) {
      cleanPhone = '964' + cleanPhone.slice(1);
    } else if (cleanPhone.startsWith('7')) {
      cleanPhone = '964' + cleanPhone;
    }

    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;

    // تسجيل الطلب محلياً أيضاً
    if (currentStudent) {
      submitSubscriptionRequest({
        studentId: currentStudent.id,
        studentName: currentStudent.fullName,
        username: currentStudent.username,
        gradeId: currentStudent.gradeId,
        paymentMethod: paymentMethod as any,
        paymentPhoneOrRef: senderInfo.trim() || 'إرسال مباشر عبر واتساب',
        amount: subscriptionConfig.price,
        notes: `طلب تفعيل واتساب (${methodTitle})`,
      });
    }

    // فتح تطبيق واتساب فوراً
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  const handleInstantDemoActivate = () => {
    if (currentStudent) {
      toggleStudentSubscription(currentStudent.id, 'paid');
      playCorrectSound();
      alert('تم تفعيل اشتراك VIP التجريبي لحسابك بنجاح! استمتع بكافة الميزات.');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto text-right">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  تفعيل اشتراك المنهاج (VIP)
                </h2>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  المميز ⭐
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                إرسال معلومات الحساب مباشرة للمشرف عبر واتساب للتفعيل الفوري
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. بطاقة معلومات حساب الطالب الحالية المسحوبة تلقائياً */}
        <div className="my-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <span className="text-[11px] font-black text-slate-700 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-emerald-600" />
            <span>بيانات الحساب المراد تفعيله (تُرسل للمشرف تلقائياً):</span>
          </span>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="p-2.5 bg-white rounded-xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 font-bold block">اسم الطالب:</span>
              <span className="font-black text-slate-900 truncate block">
                {currentStudent?.fullName || 'طالب جديد'}
              </span>
            </div>

            <div className="p-2.5 bg-white rounded-xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 font-bold block">اسم المستخدم (اليوزر):</span>
              <span className="font-mono font-bold text-emerald-700 truncate block" dir="ltr">
                {currentStudent?.username || 'غير مسجل'}
              </span>
            </div>

            <div className="col-span-2 p-2.5 bg-white rounded-xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">المرحلة والصف:</span>
                <span className="font-black text-slate-800">
                  {currentStudent ? getIraqiGradeName(currentStudent.gradeId) : 'الصف الابتدائي'}
                </span>
              </div>
              <div className="text-left">
                <span className="text-[10px] text-slate-400 font-bold block">سعر الاشتراك:</span>
                <span className="font-black text-amber-600 text-sm">
                  {formatIraqiDinar(subscriptionConfig.price, subscriptionConfig.currency)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. اختيار طريقة الدفع المناسبة */}
        <form onSubmit={handleSendToWhatsApp} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-slate-800 mb-2">
              اختر طريقة الدفع المناسبة لتحويل المبلغ:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {/* خيار تحويل رصيد آسيا سيل */}
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setPaymentMethod('asia_cell');
                }}
                className={`p-3 rounded-2xl border-2 text-right transition-all cursor-pointer ${
                  paymentMethod === 'asia_cell'
                    ? 'border-emerald-600 bg-emerald-50/80 shadow-xs ring-1 ring-emerald-500'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-xs text-slate-900">رصيد آسيا سيل</span>
                  <span className="text-base">📱</span>
                </div>
                <p className="text-[10px] text-emerald-800 font-bold">تحويل رصيد مباشر</p>
              </button>

              {/* خيار الماستر كارد */}
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setPaymentMethod('master_card');
                }}
                className={`p-3 rounded-2xl border-2 text-right transition-all cursor-pointer ${
                  paymentMethod === 'master_card'
                    ? 'border-amber-500 bg-amber-50/80 shadow-xs ring-1 ring-amber-400'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-xs text-slate-900">ماستر كارد / كي</span>
                  <span className="text-base">💳</span>
                </div>
                <p className="text-[10px] text-amber-800 font-bold">تحويل إلى البطاقة</p>
              </button>

              {/* خيار زين كاش */}
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setPaymentMethod('zain_cash');
                }}
                className={`p-3 rounded-2xl border-2 text-right transition-all cursor-pointer ${
                  paymentMethod === 'zain_cash'
                    ? 'border-blue-600 bg-blue-50/80 shadow-xs ring-1 ring-blue-500'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-xs text-slate-900">زين كاش</span>
                  <span className="text-base">💵</span>
                </div>
                <p className="text-[10px] text-blue-800 font-bold">تحويل محفظة</p>
              </button>
            </div>
          </div>

          {/* صندوق عرض رقم التحويل المختار وطريقة التحويل مع زر النسخ */}
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
            <span className="text-[11px] font-black text-amber-950 block">
              {paymentMethod === 'asia_cell'
                ? 'رقم تحويل رصيد آسيا سيل المعتمد:'
                : paymentMethod === 'master_card'
                ? 'رقم بطاقة الماستر كارد / كي كارد للتحويل:'
                : 'رقم محفظة زين كاش المعتمدة:'}
            </span>

            <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-amber-300 gap-2">
              <span className="font-mono font-black text-sm text-slate-900 select-all" dir="ltr">
                {paymentMethod === 'asia_cell'
                  ? asiacellNumber
                  : paymentMethod === 'master_card'
                  ? masterCardNumber
                  : zainCashNumber}
              </span>

              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    paymentMethod === 'asia_cell'
                      ? asiacellNumber
                      : paymentMethod === 'master_card'
                      ? masterCardNumber
                      : zainCashNumber,
                    'number'
                  )
                }
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[11px] flex items-center gap-1 cursor-pointer shrink-0 transition-colors shadow-2xs"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedKey === 'number' ? 'تم النسخ ✓' : 'نسخ الرقم'}</span>
              </button>
            </div>

            {paymentMethod === 'asia_cell' && (
              <p className="text-[10px] text-slate-600 font-bold mt-1">
                💡 كود تحويل الرصيد المباشر من خطك: <span dir="ltr" className="font-mono text-emerald-800 font-black">*123*15000*{asiacellNumber}#</span>
              </p>
            )}
          </div>

          {/* حقل إدخال إشعار التحويل أو رقم الهاتف المحول منه (اختياري) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              رقم الهاتف المحول منه أو كود كارت التعبئة (اختياري):
            </label>
            <input
              type="text"
              value={senderInfo}
              onChange={(e) => setSenderInfo(e.target.value)}
              placeholder="مثال: 0770XXXXXXX أو رقم الإشعار..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none text-xs font-medium"
              dir="ltr"
            />
          </div>

          {/* زر الإرسال المباشر للواتساب */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 text-white font-black text-sm shadow-lg shadow-emerald-600/25 transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5 text-white" />
            <span>إرسال الطلب عبر واتساب لمشرف المنصة وتفعيل الحساب 💬</span>
          </button>

          {/* تفعيل تجريبي فوري وزر لوحة المشرف */}
          <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
            <button
              type="button"
              onClick={handleInstantDemoActivate}
              className="text-emerald-700 hover:text-emerald-800 font-bold underline cursor-pointer"
            >
              تفعيل تجريبي فوري ليوم واحد
            </button>

            <button
              type="button"
              onClick={() => {
                playClickSound();
                onClose();
                onOpenAdminLogin();
              }}
              className="text-slate-400 hover:text-slate-700 underline cursor-pointer"
            >
              دخول لوحة الأدمن لتعديل الأرقام
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


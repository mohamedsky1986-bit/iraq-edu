import React, { useState } from 'react';
import { useEdu } from '../context/EduContext';
import { formatIraqiDinar } from '../utils/edu-logic';
import { playClickSound, playCorrectSound, playWrongSound } from '../utils/audio';
import {
  X,
  Crown,
  Sparkles,
  Check,
  CreditCard,
  Phone,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
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

  const [paymentMethod, setPaymentMethod] = useState<
    'zain_cash' | 'qi_card' | 'asia_cell' | 'cash_school'
  >('zain_cash');
  const [senderInfo, setSenderInfo] = useState('');
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent) return;

    if (!senderInfo.trim()) {
      playWrongSound();
      return;
    }

    submitSubscriptionRequest({
      studentId: currentStudent.id,
      studentName: currentStudent.fullName,
      username: currentStudent.username,
      gradeId: currentStudent.gradeId,
      paymentMethod,
      paymentPhoneOrRef: senderInfo.trim(),
      amount: subscriptionConfig.price,
      notes: `طلب اشتراك VIP عبر ${
        paymentMethod === 'zain_cash'
          ? 'زين كاش'
          : paymentMethod === 'qi_card'
          ? 'كي كارد'
          : paymentMethod === 'asia_cell'
          ? 'رصيد آسيا'
          : 'المدرسة'
      }`,
    });

    playCorrectSound();
    setRequestSubmitted(true);
  };

  const handleInstantDemoActivate = () => {
    if (currentStudent) {
      toggleStudentSubscription(currentStudent.id, 'paid');
      playCorrectSound();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <Crown className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900">
                  طلب تفعيل اشتراك المنهاج (VIP)
                </h2>
                <span className="text-xs font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  المميز ⭐
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                فتح بنك الأسئلة الوزارية الكامل، النطق اللامحدود، وشهادات التفوق
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pricing Card (Configurable from Admin Panel) */}
        <div className="my-5 p-6 rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50/50 to-amber-100/40 border-2 border-amber-300 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-black text-amber-900 uppercase tracking-wide">
                سعر الاشتراك المعتمد:
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl sm:text-4xl font-black text-amber-950 font-mono">
                  {formatIraqiDinar(subscriptionConfig.price, subscriptionConfig.currency)}
                </span>
                <span className="text-xs font-bold text-amber-800">
                  / {subscriptionConfig.periodName}
                </span>
              </div>
            </div>

            <div className="text-xs font-bold text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-3 py-1.5 rounded-xl flex items-center gap-1.5 self-start sm:self-auto">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>اشتراك شامل لكافة المواد</span>
            </div>
          </div>

          {/* Features Checklist */}
          <div className="mt-4 pt-4 border-t border-amber-200 space-y-2">
            {subscriptionConfig.featureList.map((feat, fIdx) => (
              <div key={fIdx} className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {!requestSubmitted ? (
          /* Subscription Request Form */
          <form onSubmit={handleSubmitRequest} className="space-y-4">
            <h3 className="text-xs font-black text-slate-700 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>اختر وسيلة الدفع المناسبة لتحويل المبلغ:</span>
            </h3>

            {/* Payment Methods */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setPaymentMethod('zain_cash');
                }}
                className={`p-3 rounded-2xl border-2 text-right transition-all cursor-pointer ${
                  paymentMethod === 'zain_cash'
                    ? 'border-amber-500 bg-amber-50/70 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <p className="font-extrabold text-xs text-slate-900">محفظة زين كاش (Zain Cash)</p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5" dir="ltr">
                  {subscriptionConfig.zainCashWallet}
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setPaymentMethod('qi_card');
                }}
                className={`p-3 rounded-2xl border-2 text-right transition-all cursor-pointer ${
                  paymentMethod === 'qi_card'
                    ? 'border-amber-500 bg-amber-50/70 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <p className="font-extrabold text-xs text-slate-900">ماستركارد / كي كارد (Qi Card)</p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5" dir="ltr">
                  {subscriptionConfig.qiCardNumber}
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setPaymentMethod('asia_cell');
                }}
                className={`p-3 rounded-2xl border-2 text-right transition-all cursor-pointer ${
                  paymentMethod === 'asia_cell'
                    ? 'border-amber-500 bg-amber-50/70 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <p className="font-extrabold text-xs text-slate-900">رصيد كارتات (آسيا / أثير)</p>
                <p className="text-[10px] text-slate-500 mt-0.5">إرسال كود الكارت</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setPaymentMethod('cash_school');
                }}
                className={`p-3 rounded-2xl border-2 text-right transition-all cursor-pointer ${
                  paymentMethod === 'cash_school'
                    ? 'border-amber-500 bg-amber-50/70 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <p className="font-extrabold text-xs text-slate-900">الدفع نقداً في المدرسة</p>
                <p className="text-[10px] text-slate-500 mt-0.5">تسليم الوصل للإدارة</p>
              </button>
            </div>

            {/* Reference input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                رقم الهاتف المحول منه أو رقم الإشعار / كود الكارت:
              </label>
              <input
                type="text"
                value={senderInfo}
                onChange={(e) => setSenderInfo(e.target.value)}
                placeholder="مثال: 07801234567 أو رقم إشعار التحويل..."
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-xs sm:text-sm font-medium transition-all"
                required
              />
            </div>

            {/* Submit Request Button */}
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 text-white font-black text-sm shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 rotate-180" />
              <span>إرسال طلب التفعيل لمشرف المنصة 🚀</span>
            </button>

            {/* Instant Demo Activate for evaluation */}
            <div className="pt-2 text-center border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleInstantDemoActivate}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-bold underline"
              >
                تفعيل تجريبي فوري بنقرة واحدة للتجربة
              </button>

              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  onClose();
                  onOpenAdminLogin();
                }}
                className="text-xs text-slate-500 hover:text-slate-800 underline"
              >
                دخول لوحة الأدمن لتعديل الأسعار
              </button>
            </div>
          </form>
        ) : (
          /* Request Sent Success Screen */
          <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900">
                تم إرسال طلب الاشتراك بنجاح! 🎉
              </h3>
              <p className="text-xs text-slate-600 font-medium max-w-md mx-auto mt-1 leading-relaxed">
                سيقوم مشرف المنصة بمراجعة وتأكيد التحويل فورياً من لوحة التحكم وتفعيل اشتراكك كبطل VIP.
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={handleInstantDemoActivate}
                className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black shadow-md cursor-pointer"
              >
                تفعيل الحساب فوراً كـ VIP الآن 🌟
              </button>
              <button
                onClick={onClose}
                className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                إغلاق
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

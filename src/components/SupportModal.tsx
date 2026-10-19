import React, { useState } from 'react';
import { playClickSound, playCorrectSound } from '../utils/audio';
import {
  X,
  HelpCircle,
  MessageSquare,
  Sparkles,
  PhoneCall,
  Send,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [userQuery, setUserQuery] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    {
      sender: 'bot',
      text: 'مرحباً بك في مركز الدعم الفوري لمنصة المتفوق العراقية! 👋 كيف يمكننا مساعدة تلميذنا البطل أو ولي أمره اليوم؟',
    },
  ]);

  if (!isOpen) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    playClickSound();
    const query = userQuery.trim();
    setUserQuery('');

    // Append user message
    setMessages((prev) => [...prev, { sender: 'user', text: query }]);

    // Instant smart response based on question
    setTimeout(() => {
      playCorrectSound();
      let reply = 'شكراً لتواصلك! تم تسجيل استفسارك وسيقوم فريق الدعم التربوي بمتابعته فوراً. نتمنى لك دوام التفوق والنجاح!';
      const q = query.toLowerCase();
      if (q.includes('اشتراك') || q.includes('مدفوع') || q.includes('تفعيل')) {
        reply = 'لتفعيل اشتراك المنهاج (VIP)، يمكن لمشرف الحساب أو المعلم التفعيل بنقرة واحدة من لوحة تحكم المشرف (Admin) في قسم إدارة الطلبة.';
      } else if (q.includes('صوت') || q.includes('نطق') || q.includes('قراءة')) {
        reply = 'النطق الصوتي يعمل بنقرة واحدة على أيقونة السماعة الخضراء بجانب السؤال، وهو يدعم القراءة الواضحة للأطفال بصوت عربي هادئ.';
      } else if (q.includes('شهادة') || q.includes('طباعة')) {
        reply = 'عند إتمام أي اختبار بنجاح، يمكنك الضغط على زر "عرض وطباعة شهادة التفوق" وحفظها كملف PDF أو طباعتها فوراً.';
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-sky-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                الدعم الفوري والاستفسارات
              </h2>
              <p className="text-xs text-slate-500">
                مساعدة التلاميذ وأولياء الأمور على مدار الساعة
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

        {/* Quick FAQ Accordions */}
        <div className="py-3 shrink-0">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="font-bold text-slate-500 shrink-0">أسئلة شائعة:</span>
            <button
              onClick={() => {
                setUserQuery('كيف يتم تفعيل اشتراك المنهاج؟');
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap font-medium"
            >
              تفعيل الاشتراك؟
            </button>
            <button
              onClick={() => {
                setUserQuery('كيف أستمع للنطق الصوتي للأسئلة؟');
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap font-medium"
            >
              طريقة النطق الصوتي؟
            </button>
            <button
              onClick={() => {
                setUserQuery('كيف أطبع شهادة التفوق؟');
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap font-medium"
            >
              طباعة الشهادة؟
            </button>
          </div>
        </div>

        {/* Live Support Chat Thread */}
        <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.sender === 'user' ? 'justify-start' : 'justify-end'
              }`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-xs'
                    : 'bg-white border border-slate-200 text-slate-800 shadow-2xs rounded-bl-xs'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="pt-4 flex gap-2 shrink-0">
          <input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="اكتب استفسارك هنا..."
            className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none text-xs sm:text-sm"
          />
          <button
            type="submit"
            className="px-5 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-sky-600/20 cursor-pointer"
          >
            <span>إرسال</span>
            <Send className="w-4 h-4 rotate-180" />
          </button>
        </form>
      </div>
    </div>
  );
};

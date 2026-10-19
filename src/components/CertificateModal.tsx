import React, { useRef } from 'react';
import { CertificateData } from '../types/index';
import { playClickSound } from '../utils/audio';
import { X, Printer, Award, Sparkles, CheckCircle2 } from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CertificateData | null;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !data) return null;

  const handlePrint = () => {
    playClickSound();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-900">
              شهادة تفوق وتقدير مدرسية
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الشهادة</span>
            </button>
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
        </div>

        {/* Certificate Printable Area */}
        <div
          ref={printRef}
          className="my-4 p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-amber-50/60 via-white to-amber-50/40 border-8 border-double border-amber-300 relative text-center shadow-inner"
        >
          {/* Header Iraqi Emblem / Crown */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 text-white flex items-center justify-center shadow-md ring-4 ring-amber-100">
              <Award className="w-9 h-9" />
            </div>
          </div>

          <p className="text-xs font-black tracking-widest text-amber-700 uppercase mb-1">
            جمهورية العراق • منصة المتفوق التعليمية
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
            شهادة تفوق وامتياز
          </h1>
          <p className="text-xs text-slate-500 mb-6">
            تقدير واعتزاز بالجهد والمثابرة والتحصيل العلمي المتميز
          </p>

          <p className="text-sm text-slate-700 font-medium mb-2">
            تسر إدارة المنصة التعليمية أن تمنح هذه الشهادة للبطل المجتهد:
          </p>

          {/* Student name */}
          <div className="inline-block px-8 py-3 rounded-2xl bg-amber-100/70 border border-amber-300 text-amber-950 font-black text-xl sm:text-2xl mb-4 shadow-2xs">
            {data.studentName}
          </div>

          <p className="text-sm text-slate-700 leading-relaxed max-w-lg mx-auto mb-6">
            تقديراً لاجتيازه الاختبار التفاعلي في مادة{' '}
            <span className="font-bold text-emerald-800">({data.subjectName})</span>{' '}
            المقررة لـ <span className="font-bold text-slate-900">({data.gradeName})</span>{' '}
            بنسبة نجاح ممتازة بلغت{' '}
            <span className="font-black text-amber-600 text-lg">({data.percentage}%)</span>{' '}
            وحصوله على {data.stars} نجوم شرف متلألئة.
          </p>

          {/* Footer Seals & Signature */}
          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-amber-200 mt-6 text-xs text-slate-600 font-bold">
            <div className="text-right">
              <p className="text-slate-400 font-normal">تاريخ الإصدار:</p>
              <p className="text-slate-800 font-mono mt-0.5">{data.date}</p>
              <div className="flex items-center gap-1 text-emerald-700 mt-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>معتمدة إلكترونياً</span>
              </div>
            </div>

            <div className="text-left flex flex-col items-end">
              <div className="w-20 h-20 rounded-full border-4 border-dashed border-amber-400 flex items-center justify-center p-2 text-center text-[10px] text-amber-800 font-black rotate-[-12deg] bg-amber-50 shadow-xs">
                خاتم التفوق والامتياز
              </div>
              <p className="text-slate-500 text-[10px] mt-1">مدير المنصة التعليمية</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2 print:hidden">
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="px-6 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

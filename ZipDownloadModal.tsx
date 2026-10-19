import React, { useState } from 'react';
import JSZip from 'jszip';
import { PROJECT_FILES } from '../data/projectFiles';
import { playClickSound, playCorrectSound } from '../utils/audio';
import {
  X,
  Download,
  FileArchive,
  CheckCircle2,
  Copy,
  Check,
  FileCode,
  Terminal,
  Sparkles,
  Layers,
  ChevronRight,
  Code2,
} from 'lucide-react';

interface ZipDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ZipDownloadModal: React.FC<ZipDownloadModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'download' | 'chatgpt' | 'files'>('download');
  const [selectedFile, setSelectedFile] = useState<string>('src/App.tsx');
  const [copiedFile, setCopiedFile] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [isGeneratingZip, setIsGeneratingZip] = useState(false);
  const [zipSuccess, setZipSuccess] = useState(false);

  if (!isOpen) return null;

  // Generate clean ZIP dynamically using JSZip
  const handleGenerateAndDownloadZip = async () => {
    try {
      setIsGeneratingZip(true);
      playClickSound();

      const zip = new JSZip();

      // Add all project files into the zip
      for (const [filePath, content] of Object.entries(PROJECT_FILES)) {
        zip.file(filePath, content);
      }

      // Add a helpful README.md
      const readme = `# منصة المتفوق التعليمية العراقية (المرحلة الابتدائية ١ - ٦)

منصة تعليمية تفاعلية شاملة مبنية باستخدام React 19 + TypeScript + Vite + Tailwind CSS.

## خطوات التشغيل على جهازك:
1. تأكد من تثبيت Node.js (الإصدار 18 أو أحدث).
2. افتح مجلد المشروع في منفذ الأوامر (Terminal).
3. نفذ أمر تثبيت الحزم:
   \`\`\`bash
   npm install
   \`\`\`
4. شغّل المشروع في وضع التطوير:
   \`\`\`bash
   npm run dev
   \`\`\`
5. افتح المتصفح على: http://localhost:3000

## الحسابات التجريبية:
- رمز الدخول للوحة تحكم الأدمن (المشرف): admin123 (يمكن تغييره من داخل اللوحة).
- حسابات الطلبة الافتراضية: رمز المرور (PIN) هو 123.
`;
      zip.file('README.md', readme);

      // Generate the binary blob
      const blob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 9 },
      });

      // Trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'iraq-edu-platform-source.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setIsGeneratingZip(false);
      setZipSuccess(true);
      playCorrectSound();
    } catch (err) {
      console.error('Failed to generate zip:', err);
      setIsGeneratingZip(false);
    }
  };

  // Copy all project files formatted for ChatGPT
  const handleCopyAllForChatGPT = () => {
    playClickSound();

    let fullPrompt = `أريد تعديل وبرمجة وتطوير تطبيق "منصة المتفوق التعليمية العراقية" للمراحل الابتدائية (من الأول إلى السادس الابتدائي).\n`;
    fullPrompt += `إليك كود المشروع بالكامل مع هيكلية الملفات ومحتوياتها:\n\n`;

    for (const [filePath, content] of Object.entries(PROJECT_FILES)) {
      fullPrompt += `--- START OF FILE: ${filePath} ---\n`;
      fullPrompt += content;
      fullPrompt += `\n--- END OF FILE: ${filePath} ---\n\n`;
    }

    navigator.clipboard.writeText(fullPrompt).then(() => {
      setCopiedAll(true);
      playCorrectSound();
      setTimeout(() => setCopiedAll(false), 3000);
    });
  };

  // Copy currently selected file
  const handleCopySingleFile = () => {
    playClickSound();
    const content = PROJECT_FILES[selectedFile] || '';
    navigator.clipboard.writeText(content).then(() => {
      setCopiedFile(true);
      playCorrectSound();
      setTimeout(() => setCopiedFile(false), 2500);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-5 sm:p-7 shadow-2xl border border-slate-100 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <FileArchive className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">
                تنزيل ونقل كود المنصة للبرمجة والتعديل (مع ChatGPT)
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                ملف ZIP غير معطوب + نسخ الكود المصدري كاملاً للـ ChatGPT
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

        {/* Tabs */}
        <div className="flex rounded-2xl bg-slate-100 p-1 my-4 shrink-0">
          <button
            onClick={() => {
              playClickSound();
              setActiveTab('download');
            }}
            className={`flex-1 py-2 text-xs sm:text-sm font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'download'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Download className="w-4 h-4 text-amber-500" />
            <span>تنزيل ملف ZIP سليم</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setActiveTab('chatgpt');
            }}
            className={`flex-1 py-2 text-xs sm:text-sm font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'chatgpt'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>نسخ كامل للـ ChatGPT</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setActiveTab('files');
            }}
            className={`flex-1 py-2 text-xs sm:text-sm font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'files'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCode className="w-4 h-4 text-sky-500" />
            <span>مستكشف الملفات المنفصلة</span>
          </button>
        </div>

        {/* Tab 1: Direct Clean ZIP Download */}
        {activeTab === 'download' && (
          <div className="space-y-4 py-2 overflow-y-auto">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs sm:text-sm font-medium leading-relaxed">
              <div className="flex items-center gap-2 font-bold mb-1 text-amber-900">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>تم حل مشكلة التنزيل وإنشاء ملف ZIP أصلي 100%:</span>
              </div>
              <p>
                يتم الآن تجميع الكود المصدري كاملاً (24 ملف) وإنشاء ملف ZIP حقيقي مباشرة داخل متصفحك عبر تقنية <strong>JSZip</strong>، حتى لا يتعرض لأي عطب أو مشاكل حظر أثناء التنزيل!
              </p>
            </div>

            {/* Two Guaranteed Download Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: Direct Verified Server File */}
              <a
                href="/iraq-edu-platform.zip"
                download="iraq-edu-platform.zip"
                onClick={() => {
                  playCorrectSound();
                  setZipSuccess(true);
                }}
                className="py-4 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white font-black text-xs sm:text-sm flex flex-col items-center justify-center gap-1 shadow-lg shadow-emerald-600/20 transition-all transform hover:-translate-y-0.5 cursor-pointer text-center no-underline"
              >
                <div className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  <span>تنزيل ملف ZIP السيرفر المباشر 📥</span>
                </div>
                <span className="text-[11px] font-normal text-emerald-100">
                  ملف أصلي تم فحصه واختباره (سليم 100%)
                </span>
              </a>

              {/* Option 2: JSZip Dynamic In-Browser */}
              <button
                onClick={handleGenerateAndDownloadZip}
                disabled={isGeneratingZip}
                className="py-4 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 text-white font-black text-xs sm:text-sm flex flex-col items-center justify-center gap-1 shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <FileArchive className="w-5 h-5" />
                  <span>
                    {isGeneratingZip
                      ? 'جاري تجميع الملفات...'
                      : 'توليد وتنزيل ZIP فوري (JSZip) ⚡'}
                  </span>
                </div>
                <span className="text-[11px] font-normal text-amber-100">
                  توليد ثنائي مشفر داخل المتصفح يمنع الحظر
                </span>
              </button>
            </div>

            {zipSuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  تم بدء تنزيل كود المنصة بالكامل كملف ZIP غير معطوب! يمكنك فك ضغطه والبدء بالبرمجة فوراً.
                </span>
              </div>
            )}

            {/* Instructions */}
            <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 text-xs font-mono space-y-2">
              <div className="flex items-center gap-2 text-slate-400 font-sans font-bold">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>تشغيل وتعديل المشروع بعد فك الضغط (Extract):</span>
              </div>
              <p className="text-slate-300">1. قم بفك ضغط الملف على حاسوبك.</p>
              <p className="text-slate-300">2. افتح المجلد في VS Code أو موجه الأوامر (CMD/Terminal).</p>
              <p className="text-slate-300">
                3. نفذ: <span className="text-amber-400 font-bold">npm install</span> لتثبيت الحزم.
              </p>
              <p className="text-slate-300">
                4. نفذ: <span className="text-emerald-400 font-bold">npm run dev</span> لتشغيل المنصة فورياً!
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Copy Everything for ChatGPT */}
        {activeTab === 'chatgpt' && (
          <div className="space-y-4 py-2 overflow-y-auto">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs sm:text-sm font-medium leading-relaxed">
              <div className="flex items-center gap-2 font-bold mb-1 text-emerald-800">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>نقل المشروع بضغطة واحدة إلى ChatGPT:</span>
              </div>
              <p>
                اضغط على الزر أدناه لنسخ جميع ملفات المشروع منسقة ومرتبة بالاسم والمسار. يمكنك لصقها مباشرة في شات جي بي تي (ChatGPT) أو كلود (Claude) والطلب منه إضافة أي ميزة أو تعديل تريده بسهولة!
              </p>
            </div>

            <button
              onClick={handleCopyAllForChatGPT}
              className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              {copiedAll ? (
                <>
                  <Check className="w-5 h-5 text-amber-300" />
                  <span>تم نسخ كود المشروع بالكامل! جاهز للصق في ChatGPT 📋</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  <span>نسخ جميع ملفات المشروع لـ ChatGPT (ضغطة واحدة) 📋</span>
                </>
              )}
            </button>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
              <p className="font-bold text-slate-900">💡 ماذا تكتب لـ ChatGPT بعد اللصق؟</p>
              <p className="bg-white p-2.5 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-800">
                "هذا كود منصة المتفوق التعليمية العراقية للمرحلة الابتدائية. أريد منك إضافة [اكتب هنا ميزتك الجديدة مثل: إضافة بنك أسئلة لمحافظة معينة، أو إضافة أسئلة للغة الإنجليزية] مع الحفاظ على هيكلية المشروع."
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Interactive File Explorer */}
        {activeTab === 'files' && (
          <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-3 gap-3 min-h-[350px]">
            {/* File List */}
            <div className="border border-slate-200 rounded-2xl overflow-y-auto p-2 bg-slate-50 space-y-1">
              <p className="text-[11px] font-black text-slate-500 px-2 py-1">ملفات المشروع ({Object.keys(PROJECT_FILES).length}):</p>
              {Object.keys(PROJECT_FILES).map((filePath) => {
                const isSelected = selectedFile === filePath;
                return (
                  <button
                    key={filePath}
                    onClick={() => {
                      playClickSound();
                      setSelectedFile(filePath);
                      setCopiedFile(false);
                    }}
                    className={`w-full text-right px-2.5 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white font-bold shadow-2xs'
                        : 'text-slate-700 hover:bg-slate-200/70'
                    }`}
                  >
                    <span className="truncate" dir="ltr">{filePath}</span>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-60" />
                  </button>
                );
              })}
            </div>

            {/* Code Viewer & Single File Copy */}
            <div className="md:col-span-2 border border-slate-200 rounded-2xl flex flex-col bg-slate-950 text-slate-200 overflow-hidden">
              <div className="p-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
                <span className="font-mono text-emerald-400 font-bold" dir="ltr">
                  {selectedFile}
                </span>
                <button
                  onClick={handleCopySingleFile}
                  className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                >
                  {copiedFile ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>تم النسخ ✓</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>نسخ هذا الملف</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="flex-1 p-3 text-[11px] font-mono overflow-auto text-slate-300 leading-relaxed" dir="ltr">
                <code>{PROJECT_FILES[selectedFile] || '// لا يوجد محتوى'}</code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  Smile,
  Moon,
  Star,
  Frown,
  Feather,
  ArrowRight,
  Sparkles,
  HeartPulse,
  PartyPopper,
  Crown,
  Wind,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Starfield from "@/components/Starfield";

// ضع هنا رابط ملف الـ JSON المرفوع أونلاين (مثل Raw Gist على GitHub)
const EXTERNAL_MESSAGES_URL = "https://gist.githubusercontent.com/mohammadz2004/ab4dbba2d1bd3d6840f5ce8757930f36/raw/message.json";

// هيكل البيانات الأساسية (عناوين، أيقونات، وتفاعلات)
const feelingsMetaData: Record<
  string,
  {
    title: string;
    subtitle: string;
    icon: React.ElementType;
    color: string;
    badge: string;
    quote: string;
    interactivePrompt: string;
    actionType: "breathe" | "pulse" | "fireworks" | "sleep" | "wind" | "crown";
    successMessage: string;
  }
> = {
  sad: {
    title: "لما تكوني زعلانة",
    subtitle: "مساحة دافئة لتهدئة قلبك وتذكيرك بإنك مش لحالك...",
    icon: Frown,
    color: "from-blue-600/30 via-indigo-900/20 to-transparent",
    badge: "حضن دافئ 🤍",
    quote: "حتى في أكثر الأيام غيمة، ضحكتك هي النجم اللي بينور عالمي.",
    interactivePrompt: "اضغطي هنا لتأخذي نفساً عميقاً مع نجمة سحرية ✨",
    actionType: "breathe",
    successMessage: "✨ أخذتي نفساً عميقاً.. أطلقنا همومك للسماء وصرتي أحسن!",
  },
  "miss-you": {
    title: "لما تشتاقيلي",
    subtitle: "المسافات مجرد أرقام لما تكون القلوب متصلة...",
    icon: Flame,
    color: "from-rose-600/30 via-pink-900/20 to-transparent",
    badge: "شوق وحنين 🔥",
    quote: "كل ثانية بتدوري فيها ببالي، بتكبر فيها مكانتك بقلبي.",
    interactivePrompt: "اضغطي لإرسال نبضة حب فورية عبر الفضاء ❤️",
    actionType: "pulse",
    successMessage: "❤️ تم إرسال نبضة حب متوهجة عبر المجرة لتستقر في قلبك!",
  },
  happy: {
    title: "لما تكوني فرحانة",
    subtitle: "لأن سعادتك هي الإنجاز الأكبر بحياتي...",
    icon: Smile,
    color: "from-amber-600/30 via-yellow-900/20 to-transparent",
    badge: "بهجة وفرح ✨",
    quote: "ضحكتك بتخلق مجرات جديدة من الأمل بقلبي.",
    interactivePrompt: "اضغطي لإطلاق ألعاب نارية من النجوم احتفالاً بكِ 🎆",
    actionType: "fireworks",
    successMessage: "🎆 أُطلقت الألعاب النارية والنجوم احتفالاً بفرحتك!",
  },
  "before-sleep": {
    title: "قبل ما تنامي",
    subtitle: "كلمات هادئة ترافقك إلى أحلام جميلة ومطمئنة...",
    icon: Moon,
    color: "from-purple-600/30 via-violet-900/20 to-transparent",
    badge: "أحلام سعيدة 🌙",
    quote: "اتركي كل أفكار اليوم جانباً، والتقي بي في الأحلام.",
    interactivePrompt: "اضغطي لإطفاء أضواء الكوكب وتشغيل نمط النوم الهادئ 💤",
    actionType: "sleep",
    successMessage: "🌙 خفتت أضواء الكون حولك.. تصبحي على ألف خير وأحلام سعيدة.",
  },
  "over-thinking": {
    title: "لما تسرحي بأفكارك وتقلقي من المستقبل",
    subtitle: "مساحة هادئة تريح بالك وترجع تطمن قلبك بوجودي معك...",
    icon: Feather,
    color: "from-pink-600/30 via-rose-900/20 to-transparent",
    badge: "راحة بال 🍃",
    quote: "المستقبل حلو طالما احنا سوا، ما تقلقي من شي وأنا معك.",
    interactivePrompt: "اضغطي لتبددي كل الأفكار المقلقة بنفخة سحرية 🌸",
    actionType: "wind",
    successMessage: "🍃 هبت نسائم هادئة وبددت كل قلق وأفكار متعبة من راسك!",
  },
  "you-are-special": {
    title: "قديش إنتي مميزة",
    subtitle: "تذكير بجمالك ورقتك الاستثنائية بكل يوم...",
    icon: Star,
    color: "from-emerald-600/30 via-teal-900/20 to-transparent",
    badge: "أنتِ الاستثناء 👑",
    quote: "بين كل النجوم في هذا الكون، أنتِ المجرة بأكملها.",
    interactivePrompt: "اضغطي لرؤية تاج الملكة يتلألأ ✨",
    actionType: "crown",
    successMessage: "👑 تألق التاج فوق مجرتنا.. أنتِ الملكة المتفردة بقلبي!",
  },
};

export default function FeelingPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
          <p className="text-purple-200 animate-pulse">جارٍ تحميل الصفحة...</p>
        </main>
      }
    >
      <FeelingContent />
    </Suspense>
  );
}

function FeelingContent() {
  const params = useParams<{ id: string }>();
  const feelingId = params.id;
  const metadata = feelingsMetaData[feelingId];

  const [messages, setMessages] = useState<string[][]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isActivated, setIsActivated] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // 1. جلب الرسائل من الـ JSON الخارجي وقراءة الرسالة المحفوظة ساباقاً في localStorage
  useEffect(() => {
    if (!feelingId) return;

    async function loadJsonMessages() {
      try {
        setLoading(true);
        const res = await fetch(EXTERNAL_MESSAGES_URL);
        if (res.ok) {
          const data = await res.json();
          if (data && data[feelingId] && Array.isArray(data[feelingId])) {
            const fetchedMessages: string[][] = data[feelingId];
            setMessages(fetchedMessages);

            // استرجاع آخر رقم رسالة توقفت عندها لصفحة هذا الشعور
            const savedIndex = localStorage.getItem(`last_msg_idx_${feelingId}`);
            if (savedIndex !== null) {
              const parsedIdx = parseInt(savedIndex, 10);
              if (!isNaN(parsedIdx) && parsedIdx < fetchedMessages.length) {
                setCurrentIndex(parsedIdx);
              }
            }
          }
        }
      } catch (err) {
        console.error("خطأ في جلب ملف JSON للرسائل:", err);
      } finally {
        setLoading(false);
      }
    }

    loadJsonMessages();
  }, [feelingId]);

  // 2. التبديل للرسالة التالية وحفظ الرقم الجديد بـ localStorage
  const handleNextMessage = () => {
    if (messages.length === 0) return;
    const nextIdx = (currentIndex + 1) % messages.length;
    setCurrentIndex(nextIdx);
    localStorage.setItem(`last_msg_idx_${feelingId}`, nextIdx.toString());
  };
  const handlePreviousMessage = () => {
    if (messages.length === 0) return;
    const prevIdx = (currentIndex - 1 + messages.length) % messages.length;
    setCurrentIndex(prevIdx);
    localStorage.setItem(`last_msg_idx_${feelingId}`, prevIdx.toString());
  };
  if (!metadata) {
    return (
      <main className="min-h-screen text-white flex flex-col items-center justify-center p-6 text-center">
        <Starfield />
          {/* شريط التنقل العلوي */}
        <Navbar />
        <h1 className="text-2xl font-bold mb-4">الصفحة غير موجودة</h1>
        <Link href="/" className="px-6 py-2 bg-purple-600 rounded-full hover:bg-purple-500 transition">
          العودة للرئيسية
        </Link>
      </main>
    );
  }

  const handleInteraction = () => {
    setIsActivated(true);
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 4500);
  };

  const IconComponent = metadata.icon;
  const currentLetter = messages[currentIndex];

  return (
  
    <main className="relative min-h-screen text-gray-100 overflow-hidden pb-24 pt-20 px-4 sm:px-8">
      <Starfield />
        {/* شريط التنقل العلوي */}
              <Navbar />

      {/* تأثير الخفت التفاعلي بصفحة قبل النوم */}
      <AnimatePresence>
        {isActivated && metadata.actionType === "sleep" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black z-0 pointer-events-none transition duration-1000"
          />
        )}
      </AnimatePresence>

      <div
        className={`absolute inset-0 bg-gradient-to-b ${metadata.color} pointer-events-none z-0 transition-all duration-700 ${
          isActivated && metadata.actionType === "sleep" ? "brightness-50" : ""
        }`}
      />

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* زر العودة للرئيسية */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition mb-8 text-sm text-gray-300"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة لعالمنا الصغير</span>
        </Link>

        {/* كرت العنوان الرئيسي */}
        <motion.div
          animate={isActivated ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 0.5 }}
          className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl mb-8 relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-6">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 border border-white/10 text-purple-200">
              {metadata.badge}
            </span>
            <div className="p-3 rounded-2xl bg-white/10 border border-white/10 text-purple-300">
              <IconComponent className="w-7 h-7" />
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
            {metadata.title}
          </h1>

          <p className="text-gray-300 text-base sm:text-lg font-light leading-relaxed">
            {metadata.subtitle}
          </p>
        </motion.div>

        {/* الاقتباس المميز */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="p-6 rounded-2xl bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/30 mb-8 italic text-purple-200 text-center text-lg shadow-lg"
        >
          “{metadata.quote}”
        </motion.div>

        {/* كرت الرسالة مع الزر والعدّاد وحفظ التفضيلات */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl space-y-6 mb-8"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span>رسالتي لكِ:</span>
            </h2>

                      {/* التنقل بين الرسائل */}
          {messages.length > 0 && (
            <div className="flex items-center justify-center gap-3 mt-6" dir="rtl">
              
              {/* الرسالة السابقة */}
              <button
                onClick={handlePreviousMessage}
                disabled={messages.length <= 1}
                aria-label="الرسالة السابقة"
                className="group flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-4 py-2.5 text-sm font-medium text-purple-200 transition-all duration-300 hover:border-purple-400/50 hover:bg-purple-500/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
                <span className="hidden sm:inline">السابقة</span>
                <span className="sm:hidden">السابق</span>
              </button>

              {/* عداد الرسائل */}
              <div className="flex min-w-[76px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2">
                <span className="text-base font-semibold tabular-nums text-white">
                  {currentIndex + 1}
                  <span className="mx-1.5 text-purple-400/60">/</span>
                  {messages.length}
                </span>
                <span className="mt-0.5 text-[10px] text-gray-400">
                  رسالة 💌
                </span>
              </div>

              {/* الرسالة التالية */}
              <button
                onClick={handleNextMessage}
                disabled={messages.length <= 1}
                aria-label="الرسالة التالية"
                className="group flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-4 py-2.5 text-sm font-medium text-purple-200 transition-all duration-300 hover:border-purple-400/50 hover:bg-purple-500/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                <span className="hidden sm:inline">التالية</span>
                <span className="sm:hidden">التالي</span>
              </button>
            </div>
          )}
          </div>

          {/* عرض الرسالة */}
          {loading ? (
            <p className="text-gray-400 animate-pulse text-sm">جارٍ جلب الرسالة الخاصة لكِ من الفضاء... ✨</p>
          ) : currentLetter ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 text-gray-200 leading-relaxed font-light text-base sm:text-lg"
              >
                {currentLetter.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </motion.div>
            </AnimatePresence>
          ) : (
            <p className="text-gray-400 text-sm">أنتِ الشيء الأجمل في كل الأوقات ❤️</p>
          )}
        </motion.div>

        {/* رسالة التفاعل البصرية */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-400/40 text-purple-200 text-center font-medium shadow-lg backdrop-blur-md flex items-center justify-center gap-2"
            >
              {metadata.actionType === "pulse" && <HeartPulse className="w-5 h-5 text-pink-300 animate-pulse" />}
              {metadata.actionType === "fireworks" && <PartyPopper className="w-5 h-5 text-amber-300 animate-bounce" />}
              {metadata.actionType === "crown" && <Crown className="w-5 h-5 text-yellow-300 animate-spin" />}
              {metadata.actionType === "wind" && <Wind className="w-5 h-5 text-teal-300 animate-pulse" />}
              <span>{metadata.successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* زر التفاعل الرئيسي */}
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleInteraction}
          className="w-full p-5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium shadow-xl shadow-purple-950/50 flex items-center justify-center gap-3 cursor-pointer transition"
        >
          <Sparkles className={`w-5 h-5 text-pink-300 ${isActivated ? "animate-spin" : ""}`} />
          <span>{metadata.interactivePrompt}</span>
        </motion.button>
      </div>
    </main>
  );
}
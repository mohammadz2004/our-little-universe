"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Heart,
  Moon,
  Smile,
  Flame,
  Star,
  Feather,
  Frown,
  X,
} from "lucide-react";
import Link from "next/link";
import Starfield from "@/components/Starfield";
import Navbar from "@/components/Navbar";

// رابط ملف الـ JSON أونلاين
const EXTERNAL_MESSAGES_URL =
  "https://gist.githubusercontent.com/mohammadz2004/ab4dbba2d1bd3d6840f5ce8757930f36/raw/message.json";

// قائمة صفحات المشاعر الست
const feelingsPages = [
  {
    id: "sad",
    title: "لما تكوني زعلانة",
    description: "حضن دافئ بكلمات تهديكي وتذكرك إني دايماً معك...",
    icon: Frown,
    color: "from-blue-500/20 to-indigo-500/10",
    borderColor: "hover:border-blue-500/40",
    badgeColor: "text-blue-400 bg-blue-500/10",
  },
  {
    id: "miss-you",
    title: "لما تشتاقيلي",
    description: "رسائل وذكريات تخلي المسافات ولا شي بيننا...",
    icon: Flame,
    color: "from-rose-500/20 to-pink-500/10",
    borderColor: "hover:border-rose-500/40",
    badgeColor: "text-rose-400 bg-rose-500/10",
  },
  {
    id: "happy",
    title: "لما تكوني فرحانة",
    description: "لأنه ضحكتك هي الضو اللي بضوي عالمي كله...",
    icon: Smile,
    color: "from-amber-500/20 to-yellow-500/10",
    borderColor: "hover:border-amber-500/40",
    badgeColor: "text-amber-400 bg-amber-500/10",
  },
  {
    id: "before-sleep",
    title: "قبل ما تنامي",
    description: "كلمات هادئة ترافق أحلامك الحلوة وتطمن قلبك...",
    icon: Moon,
    color: "from-purple-500/20 to-violet-500/10",
    borderColor: "hover:border-purple-500/40",
    badgeColor: "text-purple-400 bg-purple-500/10",
  },
  {
    id: "over-thinking",
    title: "لما تسرحي بأفكارك وتقلقي من المستقبل",
    description: "مساحة هادئة تريح بالك وترجع تطمن قلبك بوجودي معك...",
    icon: Feather,
    color: "from-pink-500/20 to-rose-500/10",
    borderColor: "hover:border-pink-500/40",
    badgeColor: "text-pink-400 bg-pink-500/10",
  },
  {
    id: "you-are-special",
    title: "قديش إنتي مميزة",
    description: "تذكير يومي بسيط بالسبب اللي بيخليكِ استثنائية بعيني...",
    icon: Star,
    color: "from-emerald-500/20 to-teal-500/10",
    borderColor: "hover:border-emerald-500/40",
    badgeColor: "text-emerald-400 bg-emerald-500/10",
  },
];

export default function Home() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
  if (window.location.hash) {
    window.history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search
    );
  }
  }, []);

  // فحص ملف الـ JSON لمعرفة إذا تم إضافة رسائل جديدة مقارنة بأخر زيارة
  useEffect(() => {
    async function checkForNewMessages() {
      try {
        const res = await fetch(EXTERNAL_MESSAGES_URL);
        if (res.ok) {
          const data = await res.json();

          // حساب إجمالي عدد الرسائل الحالية بملف הـ JSON
          let totalCurrentMessages = 0;
          Object.keys(data).forEach((key) => {
            if (Array.isArray(data[key])) {
              totalCurrentMessages += data[key].length;
            }
          });

          const seenCountStr = localStorage.getItem("total_seen_messages_count");

          if (seenCountStr === null) {
            // أول زيارة: حفظ العدد بدون إظهار الإشعار
            localStorage.setItem(
              "total_seen_messages_count",
              totalCurrentMessages.toString()
            );
          } else {
            const seenCount = parseInt(seenCountStr, 10);
            if (totalCurrentMessages > seenCount) {
              setShowBanner(true);
            }
          }
        }
      } catch (err) {
        console.error("خطأ في فحص الرسائل الجديدة:", err);
      }
    }

    checkForNewMessages();
  }, []);

  // إغلاق البانر وتحديث العدد بالـ localStorage
  const handleCloseBanner = async () => {
    setShowBanner(false);
    try {
      const res = await fetch(EXTERNAL_MESSAGES_URL);
      if (res.ok) {
        const data = await res.json();
        let totalCurrentMessages = 0;
        Object.keys(data).forEach((key) => {
          if (Array.isArray(data[key])) {
            totalCurrentMessages += data[key].length;
          }
        });
        localStorage.setItem(
          "total_seen_messages_count",
          totalCurrentMessages.toString()
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="relative min-h-screen text-gray-100 overflow-hidden pb-20">
      {/* خلفية النجوم المتحركة المتوهجة */}
      <Starfield />

      {/* شريط التنقل العلوي */}
      <Navbar />

      {/* بانر الإشعار الترحيبي بالرسائل الجديدة */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="fixed top-24 left-4 right-4 sm:left-auto sm:right-8 sm:max-w-md z-50 p-4 rounded-2xl bg-gradient-to-r from-purple-900/90 via-indigo-900/90 to-pink-900/90 border border-purple-400/40 backdrop-blur-xl shadow-2xl shadow-purple-950/60 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/20 border border-purple-400/30 text-purple-200 animate-bounce">
                <Sparkles className="w-5 h-5 text-pink-300" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-purple-100 flex items-center gap-1.5">
                  <span>رسائل جديدة بانتظارك!</span>
                  <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400 animate-pulse" />
                </h4>
                <p className="text-xs text-purple-200/80 mt-0.5">
                  تمت إضافة كلمات دافئة جديدة لعالمنا، تفقديها الآن ✨
                </p>
              </div>
            </div>

            <button
              onClick={handleCloseBanner}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white cursor-pointer"
              title="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* لمسات ضوئية سينمائية بالخلفية */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-3/4 right-10 w-[300px] h-[300px] bg-pink-600/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* القسم الترحيبي (Hero Section) */}
      <section className="relative z-10 pt-32 pb-16 px-6 max-w-7xl mx-auto text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="p-3 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-indigo-400 shadow-lg shadow-indigo-500/10 mb-6"
        >
          <Sparkles className="w-8 h-8 animate-pulse" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0 }}
          className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-pink-200 to-indigo-300 drop-shadow-md leading-tight mb-4"
        >
          Our Little Universe
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-gray-300 leading-relaxed font-light max-w-2xl mb-8"
        >
          عالمنا الصغير المليان ذكريات، مشاعر، ورسائل خاصة... صُمّم بحب. ❤️
        </motion.p>

        <motion.a
          href="#feelings"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center gap-3 px-8 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-full font-medium shadow-xl shadow-purple-500/25 cursor-pointer"
        >
          <span>ادخلي إلى عالمنا</span>
          <Heart className="w-5 h-5 text-pink-300 fill-pink-300" />
        </motion.a>
      </section>

      {/* قسم صفحات المشاعر الست */}
      <section id="feelings" className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-3">
            كيف شعورك هلأ؟ ✨
          </h2>
          <p className="text-gray-400 text-sm md:text-base">
            اختاري البطاقة اللي بتعبر عن حالتك حالياً لتلاقي رسالتي الخاصة إلك تطمن قلبك
          </p>
        </div>

        {/* شبكة الكروت الستة المرتبطة بروابط الديناميك */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {feelingsPages.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link href={`/feelings/${item.id}`} key={item.id} className="block h-full">
                <motion.div
initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{
    once: true,
    amount: 0.1,
    margin: "0px 0px 100px 0px",
  }}
  transition={{
    duration: 0.35,
    delay: 0.1 * index,
    ease: "easeOut",
  }}
  whileHover={{ y: -4 }}
  className={`relative group rounded-2xl p-6 bg-gradient-to-b ${item.color} backdrop-blur-md border border-white/10 ${item.borderColor} cursor-pointer shadow-lg overflow-hidden h-full flex flex-col justify-between`}
>
                  {/* تأثير توهج خلف الكرت عند الـ Hover */}
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 pointer-events-none" />

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl border border-white/10 ${item.badgeColor}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
                        رسالة خاصة
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-pink-200">
                      {item.title}
                    </h3>

                    <p className="text-sm text-gray-300 leading-relaxed font-light">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center text-xs font-semibold text-purple-300 group-hover:text-purple-200 gap-1">
                    <span>افتحي الصفحة</span>
                    <span className="group-hover:translate-x-[-4px]">←</span>
                  </div>
                </motion.div>
              </Link>
              
            );
          })}
        </div>
      </section>
          {/* قسم ألبوم الذكريات التفاعلي - أسفل بطاقات المشاعر */}
    <section className="relative z-10 max-w-7xl mx-auto px-6 pt-8 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative group rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-purple-900/30 via-pink-900/20 to-indigo-900/30 border border-purple-500/30 backdrop-blur-xl shadow-2xl overflow-hidden hover:border-pink-500/50"
      >
        {/* لمسات إضاءة خلفية تتوهج عند التحويم */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-pink-500/20 rounded-full blur-[100px] group-hover:bg-pink-500/30 pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-500/20 rounded-full blur-[100px] group-hover:bg-purple-500/30 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* الجانب الأيمن: النصوص والزر */}
          <div className="lg:col-span-7 space-y-4 text-center sm:text-right">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-pink-300 animate-spin-slow" />
              <span>ذكرياتنا المصورة</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
              معرض لحظاتنا الاستثنائية ✨
            </h3>

            <p className="text-gray-300 text-sm sm:text-base font-light leading-relaxed max-w-7xl">
              كل صورة هون بتوثق ضحكة، سفرة، أو لحظة دافئة عشناها سوا.. ادخلي وشوفي ألبوم حكايتنا كاملاً
            </p>

            <div className="pt-2">
              <Link href="/gallery" className="inline-block">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white rounded-full font-medium shadow-xl shadow-purple-950/50 cursor-pointer"
                >
                  <span>تفقدي ألبومنا</span>
                  <Heart className="w-4 h-4 text-pink-200 fill-pink-200 animate-bounce" />
                </motion.div>
              </Link>
            </div>
          </div>

          {/* الجانب الأيسر: إطارات صور تفاعلية متداخلة (Visual Stack) */}
          <div className="lg:col-span-5 flex justify-center items-center relative h-48 sm:h-56">
            <Link href="/gallery" className="relative w-full max-w-[280px] h-full flex justify-center items-center group/stack">
              {/* الإطار الخلفي الأول */}
              <motion.div
                animate={{ rotate: [-6, -4, -6], y: [0, -4, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-36 h-48 sm:w-40 sm:h-52 rounded-2xl bg-gradient-to-tr from-purple-800/60 to-pink-800/40 border border-white/20 shadow-xl backdrop-blur-md -translate-x-10 group-hover/stack:-translate-x-14 flex items-center justify-center"
              >transition
                <Sparkles className="w-8 h-8 text-purple-300/40" />
              </motion.div>

              {/* الإطار الخلفي الثاني */}
              <motion.div
                animate={{ rotate: [6, 4, 6], y: [0, 4, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-36 h-48 sm:w-40 sm:h-52 rounded-2xl bg-gradient-to-tr from-indigo-800/60 to-purple-800/40 border border-white/20 shadow-xl backdrop-blur-md translate-x-10 group-hover/stack:translate-x-14 flex items-center justify-center"
              >
                <Heart className="w-8 h-8 text-pink-300/40" />
              </motion.div>

              {/* الإطار الأمامي الرئيسي */}
              <motion.div
                whileHover={{ scale: 1.08, rotate: 0 }}
                className="relative z-10 w-40 h-52 sm:w-44 sm:h-56 rounded-2xl bg-gradient-to-tr from-purple-600/80 to-pink-500/80 border border-white/40 shadow-2xl backdrop-blur-xl flex flex-col items-center justify-center p-4 text-center group-hover/stack:shadow-pink-500/20"
              >
                <div className="p-3 rounded-full bg-white/20 border border-white/30 text-white mb-2 animate-pulse">
                  <Sparkles className="w-6 h-6 text-pink-200" />
                </div>
                <span className="text-xs font-bold text-white tracking-wider">OUR MEMORIES</span>
                <span className="text-[10px] text-purple-200 mt-1">اضغطي للفتح ✨</span>
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
    </main>
  );
}
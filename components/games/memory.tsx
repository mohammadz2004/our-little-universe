'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  RefreshCw,
  Trophy,
  Heart,
  Camera,
  BookOpen,
  Mail,
  Moon,
  Globe,
  GraduationCap,
  CheckCircle2,
  Lock
} from 'lucide-react';

// تعريف هيكل بطاقات الذاكرة والأجوبة (6 أزواج = 12 بطاقة)
interface MemoryCard {
  id: number; // المعرف الفريد لكل بطاقة (12 بطاقة)
  pairId: number; // من 1 إلى 6
  symbol: string; // الرمز المخصص
  title: string;
  question: string;
  type: 'graduation' | 'travel' | 'letter' | 'wish' | 'photo' | 'chapters';
}

const CARDS_DATA: Omit<MemoryCard, 'id'>[] = [
  {
    pairId: 1,
    symbol: "🎓",
    title: "يوم التخرج",
    question: "تخيلي اجا يوم التخرج وخلصنا تعليمنا وصار الوقت أقرب لخطبتنا, شو رح يكون شعورك؟",
    type: "graduation"
  },
  {
    pairId: 2,
    symbol: "🌍",
    title: "لو قدرنا نروح أي مكان",
    question: "لو قدرنا نروح أي مكان بالعالم بكرا، بدون ما نفكر بالمصاري أو الوقت أو الظروف، وين أول مكان بتفكري فيه؟",
    type: "travel"
  },
  {
    pairId: 3,
    symbol: "✉️",
    title: "رسالتك إليّ",
    question: "اكتبي رسالة إليّ أفتحها بيوم بكون فيه تعبان، أو تزاعلنا فيه.",
    type: "letter"
  },
  {
    pairId: 4,
    symbol: "🌙",
    title: "أمنية لنا",
    question: "في أمنية صغيرة بتتمني تصير إلنا إحنا الاثنين؟",
    type: "wish"
  },
  {
    pairId: 5,
    symbol: "📷",
    title: "صورة لم نلتقطها بعد",
    question: "تخيلي صورة لازم نتصورها بالمستقبل. وين نكون؟ وشو نكون بنعمل؟",
    type: "photo"
  },
  {
    pairId: 6,
    symbol: "📖",
    title: "فصول قصتنا",
    question: "لو علاقتنا كتاب، شو بتسميه؟",
    type: "chapters"
  }
];

export default function MemoryGame() {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [activeModalPair, setActiveModalPair] = useState<Omit<MemoryCard, 'id'> | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // إجابات المستخدم المجمعة
  const [answers, setAnswers] = useState({
    graduationFeelings: '',
    travelDestination: '',
    openWhenLetter: '',
    ourWish: '',
    futurePhotoDesc: '',
    bookTitle: ''
  });

  // تهيئة اللعبة وخلط البطاقات
  useEffect(() => {
    initGame();
  }, []);

  const initGame = () => {
    // إنشاء 12 بطاقة (زوجين لكل عنصر)
    const fullDeck: MemoryCard[] = [];
    let idCounter = 1;

    CARDS_DATA.forEach((item) => {
      fullDeck.push({ ...item, id: idCounter++ });
      fullDeck.push({ ...item, id: idCounter++ });
    });

    // خلط عشوائي
    const shuffled = fullDeck.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedCards([]);
    setMatchedPairs([]);
    setActiveModalPair(null);
    setIsCompleted(false);
  };

  // التعامل مع كشف البطاقة
  const handleCardClick = (cardId: number, pairId: number) => {
    if (
      flippedCards.length === 2 ||
      flippedCards.includes(cardId) ||
      matchedPairs.includes(pairId) ||
      activeModalPair !== null
    ) {
      return;
    }

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const firstCard = cards.find((c) => c.id === newFlipped[0]);
      const secondCard = cards.find((c) => c.id === newFlipped[1]);

      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        // مطابقة ناجحة
        const newMatched = [...matchedPairs, firstCard.pairId];
        setMatchedPairs(newMatched);
        setFlippedCards([]);

        // كشف شاشة السؤال الخاصة بهذا الزوج
        setTimeout(() => {
          setActiveModalPair(firstCard);
        }, 400);
      } else {
        // عدم مطابقة - إعادة التغطية
        setTimeout(() => {
          setFlippedCards([]);
        }, 1100);
      }
    }
  };

  // حفظ إجابة النموذج والانتقال
  const handleSaveModal = () => {
    setActiveModalPair(null);
    if (matchedPairs.length === CARDS_DATA.length) {
      setIsCompleted(true);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col space-y-4 select-none p-3 sm:p-5 pb-12 min-h-[100dvh]" dir="rtl">
      {/* الرأس والتحكم العلوي مباشرة فوق الكروت بدون Nav Bar */}
      {!isCompleted && (
        <div className="bg-slate-900/80 border border-slate-700/60 p-4 rounded-3xl backdrop-blur-xl space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <h1 className="text-base sm:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-violet-200 to-sky-200 flex items-center gap-2">              <Heart className="w-5 h-5 text-indigo-400 fill-indigo-400/30 animate-pulse" />
              أزواج حبنا ومستقبلنا ✨
            </h1>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200 font-semibold">
                الأزواج: <span className="text-indigo-300 font-extrabold">{matchedPairs.length}/6</span>
              </div>
              <button
                onClick={initGame}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors duration-200 cursor-pointer"
                title="إعادة اللعب"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed border-t border-slate-800 pt-2.5">
            اكشفي الأزواج المخبأة.. كل زوج متطابق يملك رسالة لمستقبلنا! طابقي الكروت واكتشفي المفاجآت ✨
          </p>
        </div>
      )}

      {/* شبكة البطاقات (12 كرت) - زيادة الطول وضبط الألوان */}
      {!isCompleted && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 my-auto py-2">
          {cards.map((card) => {
            const isFlipped = flippedCards.includes(card.id) || matchedPairs.includes(card.pairId);
            const isMatched = matchedPairs.includes(card.pairId);

            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(card.id, card.pairId)}
                className="h-36 sm:h-44 md:h-48 w-full relative cursor-pointer [perspective:1000px]"
              >
                <motion.div
                  className="w-full h-full relative rounded-2xl [transform-style:preserve-3d] shadow-xl"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.4 }}
                >

                    {/* وجه البطاقة الخلفي - Minimal Luxury */}
                    <div
                    className="absolute inset-0 w-full h-full rounded-2xl
                        flex items-center justify-center
                        [backface-visibility:hidden]
                        overflow-hidden
                        bg-gradient-to-br from-[#171827] via-[#202039] to-[#141421]
                        border border-white/[0.12]
                        shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]"
                    >
                    {/* إطار داخلي رفيع */}
                    <div className="absolute inset-[6px] rounded-xl border border-white/[0.06]" />

                    {/* توهج مركزي خفيف */}
                    <div className="absolute w-20 h-20 rounded-full
                        bg-violet-400/[0.08] blur-2xl" />

                    {/* رمز القفل */}
                    <div className="relative flex items-center justify-center
                        w-12 h-12 sm:w-14 sm:h-14 rounded-full
                        bg-white/[0.035]
                        border border-rose-200/[0.18]
                        shadow-[0_0_20px_rgba(244,114,182,0.06)]">

                        <Lock
                        className="w-5 h-5 sm:w-6 sm:h-6
                            text-rose-200/80"
                        strokeWidth={1.5}
                        />
                    </div>
                    </div>
                    {/* وجه البطاقة الأمامي - Midnight Romance */}
                    <div
                    className={`absolute inset-0 w-full h-full rounded-2xl
                        flex flex-col items-center justify-center p-3 text-center
                        [backface-visibility:hidden] [transform:rotateY(180deg)]
                        overflow-hidden transition-all duration-500
                        ${
                        isMatched
                            ? 'bg-gradient-to-br from-[#29182f] via-[#201b38] to-[#111b30] border border-rose-300/60 shadow-[0_0_25px_rgba(232,121,166,0.20)]'
                            : 'bg-gradient-to-br from-[#201a35] via-[#191a32] to-[#111827] border border-violet-300/25 shadow-lg'
                        }`}
                    >
                    {/* إضاءة خلفية ناعمة */}
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-400/[0.08] via-transparent to-violet-400/[0.12]" />

                    {/* زخارف النجوم */}
                    <Sparkles className="absolute top-3 right-3 w-3.5 h-3.5 text-rose-200/60" />
                    <Sparkles className="absolute bottom-4 left-3 w-3 h-3 text-violet-200/50" />

                    {/* توهج الكرت عند المطابقة */}
                    {isMatched && (
                        <div className="absolute inset-0 bg-rose-300/[0.04] animate-pulse" />
                    )}

                    {/* محتوى البطاقة */}
                    <div className="relative z-10 flex flex-col items-center justify-center gap-2.5 w-full">
                        {/* الرمز داخل دائرة زجاجية */}
                        <div
                        className={`relative w-[62px] h-[62px] sm:w-[72px] sm:h-[72px]
                            rounded-full flex items-center justify-center
                            bg-gradient-to-br from-white/[0.12] to-white/[0.03]
                            backdrop-blur-sm border shadow-inner
                            ${
                            isMatched
                                ? 'border-rose-200/40 shadow-[0_0_18px_rgba(244,114,182,0.12)]'
                                : 'border-violet-200/20'
                            }`}
                        >
                        <div className="absolute inset-1 rounded-full border border-white/[0.06]" />

                        <span className="text-3xl sm:text-4xl drop-shadow-lg">
                            {card.symbol}
                        </span>
                        </div>

                        {/* عنوان الذكرى */}
                        <div className="space-y-1.5 max-w-full px-1">
                        <h3 className="text-xs sm:text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-100 via-violet-100 to-sky-100 leading-relaxed line-clamp-2">
                            {card.title}
                        </h3>
                        </div>

                        {/* شارة المطابقة */}
                        {isMatched && (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-300/[0.08] border border-rose-200/20">
                            <span className="text-[9px] sm:text-[10px] font-medium text-rose-100">
                            مُكتشف ✨
                            </span>
                        </div>
                        )}
                    </div>

                    </div>

                </motion.div>
              </div>
            );
          })}
        </div>
      )}

      {/* الشاشة التفاعلية فور كشف الزوج (Modal) */}
      <AnimatePresence>
        {activeModalPair && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 20 }}
              className="bg-slate-900 border border-slate-700 rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl space-y-4 text-right"
              dir="rtl"
            >
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                <span className="text-3xl bg-slate-800 p-2 rounded-2xl border border-slate-700">
                  {activeModalPair.symbol}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-rose-300">{activeModalPair.title}</h3>
                  <span className="text-xs text-slate-400">طابقتِ الكرت بنجاح! 🎉</span>
                </div>
              </div>

              <p className="text-sm text-slate-200 leading-relaxed font-medium bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/50">
                «{activeModalPair.question}»
              </p>

              {/* نماذج الإجابات بحسب نوع الكرت */}
              <div className="space-y-3 pt-1">
                {activeModalPair.type === 'graduation' && (
                  <textarea
                    value={answers.graduationFeelings}
                    onChange={(e) => setAnswers({ ...answers, graduationFeelings: e.target.value })}
                    placeholder="احكيلي شو رح تحسي بهاد اليوم المميز..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-400 h-24 resize-none"
                  />
                )}

                {activeModalPair.type === 'travel' && (
                  <input
                    type="text"
                    value={answers.travelDestination}
                    onChange={(e) => setAnswers({ ...answers, travelDestination: e.target.value })}
                    placeholder="مثلاً: المالديف، باريس، كوخ في الجبال..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-400"
                  />
                )}

                {activeModalPair.type === 'letter' && (
                  <textarea
                    value={answers.openWhenLetter}
                    onChange={(e) => setAnswers({ ...answers, openWhenLetter: e.target.value })}
                    placeholder="اكتبي رسالتكِ الصغيرة لي هنا..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-400 h-28 resize-none"
                  />
                )}

                {activeModalPair.type === 'wish' && (
                  <input
                    type="text"
                    value={answers.ourWish}
                    onChange={(e) => setAnswers({ ...answers, ourWish: e.target.value })}
                    placeholder="أمنيتكِ الصغيره لإلنا الاثنين..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-400"
                  />
                )}

                {activeModalPair.type === 'photo' && (
                  <textarea
                    value={answers.futurePhotoDesc}
                    onChange={(e) => setAnswers({ ...answers, futurePhotoDesc: e.target.value })}
                    placeholder="اوصفي المكان واللقطة اللي حابة نتصورها..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-400 h-24 resize-none"
                  />
                )}

                {activeModalPair.type === 'chapters' && (
                  <input
                    type="text"
                    value={answers.bookTitle}
                    onChange={(e) => setAnswers({ ...answers, bookTitle: e.target.value })}
                    placeholder="عنوان الكتاب أو القصّة..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-400"
                  />
                )}
              </div>

              <button
                onClick={handleSaveModal}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-950/40 transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>حفظ والانتقال للكرت التالي ✨</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* الصفحة الختامية: قائمة أمنيات المستقبل */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-5 py-4"
          >
            {/* بطاقة التهنئة العلوية */}
            <div className="text-center bg-slate-900 border border-rose-500/30 p-6 rounded-3xl backdrop-blur-xl space-y-2 shadow-2xl relative overflow-hidden">
              <div className="w-14 h-14 mx-auto rounded-full bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-300">
                <Trophy className="w-7 h-7" />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-200 to-amber-200">
                قائمة أمنياتنا المستقبليّة 📜✨
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
                جمعنا كل أمنياتنا واختياراتكِ السحرية في قائمة واحدة! صوري الشاشة (Screenshot) وارسليها لي لنبدأ بتحقيقها سوياً 💖.
              </p>
            </div>

            {/* عرض بطاقات الأجوبة الستة */}
            <div className="space-y-3 bg-slate-900/90 border border-slate-800 p-4 sm:p-5 rounded-3xl backdrop-blur-xl">
              {/* 1. التخرج */}
              <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-1">
                <div className="flex items-center gap-2 text-rose-300 font-bold text-xs sm:text-sm">
                  <GraduationCap className="w-4 h-4 text-rose-400" />
                  <span>يوم التخرج</span>
                </div>
                <p className="text-xs text-slate-300 pr-6">
                  {answers.graduationFeelings || "لم تذكر بعد"}
                </p>
              </div>

              {/* 2. السفر */}
              <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-1">
                <div className="flex items-center gap-2 text-rose-300 font-bold text-xs sm:text-sm">
                  <Globe className="w-4 h-4 text-rose-400" />
                  <span>لو قدرنا نروح أي مكان</span>
                </div>
                <p className="text-xs text-slate-300 pr-6">
                  الوجهة الأولى: <span className="text-rose-200 font-semibold">{answers.travelDestination || "لم تذكر بعد"}</span>
                </p>
              </div>

              {/* 3. الرسالة */}
              <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-1">
                <div className="flex items-center gap-2 text-rose-300 font-bold text-xs sm:text-sm">
                  <Mail className="w-4 h-4 text-rose-400" />
                  <span>رسالتك إالي</span>
                </div>
                <p className="text-xs text-slate-300 pr-6 italic">
                  {answers.openWhenLetter || "رسالة سرية مغلقة"}
                </p>
              </div>

              {/* 4. الأمنية */}
              <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-1">
                <div className="flex items-center gap-2 text-rose-300 font-bold text-xs sm:text-sm">
                  <Moon className="w-4 h-4 text-rose-400" />
                  <span>أمنية لنا</span>
                </div>
                <p className="text-xs text-slate-300 pr-6">
                  {answers.ourWish || "أمنية لم تتحدد بعد"}
                </p>
              </div>

              {/* 5. الصورة */}
              <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-1">
                <div className="flex items-center gap-2 text-rose-300 font-bold text-xs sm:text-sm">
                  <Camera className="w-4 h-4 text-rose-400" />
                  <span>صورة لم نلتقطها بعد</span>
                </div>
                <p className="text-xs text-slate-300 pr-6">
                  {answers.futurePhotoDesc || "صورة مستقبلية حالمة"}
                </p>
              </div>

              {/* 6. عنوان القصة */}
              <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-1">
                <div className="flex items-center gap-2 text-rose-300 font-bold text-xs sm:text-sm">
                  <BookOpen className="w-4 h-4 text-rose-400" />
                  <span>فصول قصتنا</span>
                </div>
                <p className="text-xs text-rose-200 font-semibold pr-6">
                  عنوان قصتنا: {answers.bookTitle || "قصة حبنا"}
                </p>
              </div>
            </div>

            {/* أزرار الإجراءات السريعة */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-950/50 transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4" />
                <span>التقطي سكرين شوت وارسليها لي 📸</span>
              </button>

              <button
                onClick={initGame}
                className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>إعادة اللعبة 💖</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
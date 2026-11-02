"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, RotateCcw } from "lucide-react";

interface TreasureItem {
  id: string;
  name: string;
  icon: string;
  hint: string;
  title: string;
  message: string;
}

// بنك الأغراض والذكريات
const ALL_TREASURES: TreasureItem[] = [
  { id: "rose", name: "وردة", icon: "🌹", hint: "ابحثي عن أول هدية أخذتيها.. 🌸", title: "أول هدية 🌹", message: "مثل هذه الوردة، حضورك دايماً بضيف لون ودفء لكل الأيام الصعبة." },
  { id: "kiss", name: "بوسة", icon: "💋", hint: "تذكري شو عملنا بمصف السينما وقتها؟ 😉", title: "ذكرى السينما 🎬", message: "لحظة عفوية حلوة ولطيفة محفورة بالذاكرة بابتسامة دافية." },
  { id: "coffee", name: "قهوة", icon: "☕", hint: "شيء مرتبط بأقرب قعدة رايقة مع بعض..", title: "قعدة القهوة الرايقة ☕", message: "أبسط المشاوير والقعدات معك بتعدل المزاج وببتسوى الدنيا كلياتها." },
  { id: "ring", name: "خاتم", icon: "💍", hint: "رمز الأيام والخطوات الجاية بمستقبلنا..", title: "وعد المستقبل 💍", message: "كل خطوة بنمشيها سوا هي بداية لأيام أحلى بنبنيها إحنا الاثنين." },
  { id: "car", name: "سيارة", icon: "🚗", hint: "المشوار الهادي بالسيارة واللفتات بالليل..", title: "مشاوير الليل 🚗", message: "أحلى الطرق والأغاني هي اللي بنسمعها وبنمشيها سوا بهدوء." },
  { id: "pizza", name: "بيتزا", icon: "🍕", hint: "أكلتنا المفضلة لما نكسل ونطلب عسريع..", title: "وجبتنا المفضلة 🍕", message: "حتى بأسئلة الأكل والتفاصيل اليومية البسيطة، بكتشف قدّيش إحنا بيشبه بعض!" },
  { id: "cat", name: "قطة", icon: "🐱", hint: "إشي لطيف وبيذكرنا باللطافة والشقاوة سوا..", title: "روحك اللطيفة 🐱", message: "عفويتك ولطافتك هما السر الكبير اللي بيخلي كل يوم معك خفيف وجميل." },
  { id: "star", name: "نجمة", icon: "⭐", hint: "أمنية اتمنيتيها بليلة صافية..", title: "نجمة الأمنيات ✨", message: "كل أمنية اتمنيتها للمستقبل، وجودك معي كان الجزء الأجمل والأهم فيها." },
  { id: "camera", name: "كاميرا", icon: "📸", hint: "صورة وثّقت أحلى لحظة بيننا..", title: "لقطة بالذاكرة 📸", message: "الصور الحلوة بتذكرنا قدّيش ضحكنا وعشنا لحظات بتسوى كل إشي." },
  { id: "music", name: "موسيقى", icon: "🎵", hint: "الأغنية اللي دايماً بنشغلها ونسمعها..", title: "نغمتنا المفضلّة 🎶", message: "الموسيقى معك إلها طعم تاني، بتذكرني بكل تفصيلة حلوة بيننا." },
];

// بنك فريد وشامل من المشتتات الفضائية
const ALL_DISTRACTORS = [
  "🪐", "🚀", "🛸", "🌙", "🌍", "☄️", "👾", "🛰️", "🔮", "💎", 
  "💙", "✨", "🔥", "🎈", "🧸", "🎁", "🍫", "🍩", "🌸", "🍎", 
  "⚡", "🎲", "🎯", "🎨", "🎧", "💡", "👑", "🦄", "🌈", "❄️", 
  "🌊", "💫", "🍿", "🍔", "🍦", "🍓", "🍉"
];

interface SpaceObject {
  id: string;
  icon: string;
  top: number;
  left: number;
  isTarget: boolean;
  targetData?: TreasureItem;
}

export default function TreasureHuntGame() {
  const [boardObjects, setBoardObjects] = useState<SpaceObject[]>([]);
  const [selectedTargets, setSelectedTargets] = useState<TreasureItem[]>([]);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [activeItem, setActiveItem] = useState<TreasureItem | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: -200, y: -200 });
  const [isGameCompleted, setIsGameCompleted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // توليد أماكن متباعدة ومزدحمة
  const generateDensePositions = (count: number) => {
    const positions: { top: number; left: number }[] = [];
    const minDistance = 9;

    let attempts = 0;
    while (positions.length < count && attempts < 1500) {
      attempts++;
      const top = Math.floor(10 + Math.random() * 80);
      const left = Math.floor(8 + Math.random() * 84);

      let hasConflict = false;
      for (const pos of positions) {
        const dist = Math.hypot(pos.top - top, pos.left - left);
        if (dist < minDistance) {
          hasConflict = true;
          break;
        }
      }

      if (!hasConflict) {
        positions.push({ top, left });
      }
    }
    return positions;
  };

  // خلط ورصف الملعب مع ضمان عدم تكرار أي إيموجي إطلاقاً
  const shuffleBoard = useCallback((targetsToUse: TreasureItem[]) => {
    // استخراج الإيموجيات الخاصة بالأهداف الحالية لمنع تكرارها
    const targetIcons = targetsToUse.map((t) => t.icon);

    // تصفية المشتتات واستبعاد أي إيموجي مستخدم كهدف
    const availableDistractors = ALL_DISTRACTORS.filter(
      (icon) => !targetIcons.includes(icon)
    );

    // اختيار 22 إيموجي مشتت فريد كلياً
    const shuffledDistractors = [...availableDistractors]
      .sort(() => 0.5 - Math.random())
      .slice(0, 22);

    const totalCount = targetsToUse.length + shuffledDistractors.length;
    const allPositions = generateDensePositions(totalCount);

    let posIdx = 0;
    const objects: SpaceObject[] = [];

    // إضافة الأهداف الـ 5 الفريدة
    targetsToUse.forEach((target) => {
      const pos = allPositions[posIdx++] || { top: 50, left: 50 };
      objects.push({
        id: target.id,
        icon: target.icon,
        top: pos.top,
        left: pos.left,
        isTarget: true,
        targetData: target,
      });
    });

    // إضافة المشتتات دون أي تكرار
    shuffledDistractors.forEach((icon, idx) => {
      const pos = allPositions[posIdx++] || { top: 30, left: 30 };
      objects.push({
        id: `distractor-${idx}`,
        icon: icon,
        top: pos.top,
        left: pos.left,
        isTarget: false,
      });
    });

    setBoardObjects(objects.sort(() => 0.5 - Math.random()));
  }, []);

  const initGame = () => {
    const shuffledTreasures = [...ALL_TREASURES].sort(() => 0.5 - Math.random());
    const targets = shuffledTreasures.slice(0, 5);
    
    setSelectedTargets(targets);
    setCurrentHintIndex(0);
    setActiveItem(null);
    setIsGameCompleted(false);
    shuffleBoard(targets);
  };

  useEffect(() => {
    initGame();
  }, [shuffleBoard]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleObjectClick = (obj: SpaceObject) => {
    if (isGameCompleted) return;

    const currentRequiredTarget = selectedTargets[currentHintIndex];

    // الفتح والاستجابة حصراً للهدف المطلوب في الـ Hint حالياً
    if (obj.isTarget && obj.targetData && obj.targetData.id === currentRequiredTarget?.id) {
      setActiveItem(obj.targetData);
    }
  };

  const handleCloseModal = () => {
    setActiveItem(null);

    if (currentHintIndex + 1 >= selectedTargets.length) {
      setIsGameCompleted(true);
    } else {
      setCurrentHintIndex((prev) => prev + 1);
      shuffleBoard(selectedTargets);
    }
  };

  const currentHintTarget = selectedTargets[currentHintIndex];

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 dir-rtl select-none" dir="rtl">
      
      {/* شريط التقدم والترويسة */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-white/[0.03] border border-white/10 backdrop-blur-xl p-4 sm:p-6 rounded-3xl">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <span>رحلة البحث عن الذكريات والكنز</span>
            <Compass className="w-5 h-5 text-purple-400 animate-spin" style={{ animationDuration: "10s" }} />
          </h2>
          <p className="text-xs sm:text-sm text-purple-200/60 mt-1">
            ابحثي عن الإيموجي المطلوب في التلميح فقط من بين الزحمة.. الأماكن تتغير باستمرار!
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-left">
            <div className="text-xs text-purple-300">المكتشف</div>
            <div className="text-base font-bold text-white">
              {currentHintIndex} / {selectedTargets.length}
            </div>
          </div>
          <button
            onClick={initGame}
            className="p-2.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 transition cursor-pointer"
            title="إعادة اللعب"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* مسرح الفضاء المزدحم بالإيموجيات الفريدة وبدون أي تكرار */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative w-full h-[480px] sm:h-[550px] rounded-3xl border border-white/10 bg-[#06070c] overflow-hidden cursor-none shadow-2xl"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(88,28,135,0.15),_transparent_70%)] pointer-events-none" />

        {/* الكشاف الضوئي المباشر */}
        <div
          className="pointer-events-none absolute w-48 h-48 sm:w-56 sm:h-56 rounded-full border border-purple-400/30 transition-transform duration-75 ease-out -translate-x-1/2 -translate-y-1/2 z-30"
          style={{
            top: `${cursorPos.y}px`,
            left: `${cursorPos.x}px`,
            background: "radial-gradient(circle, rgba(168,85,247,0.15) 0%, rgba(168,85,247,0.02) 65%, transparent 100%)",
            boxShadow: "0 0 30px rgba(168, 85, 247, 0.2)",
          }}
        />

        {/* عرض الإيموجيات بالحجم الطبيعي المزدحم والفريد */}
        {boardObjects.map((obj) => (
          <div
            key={obj.id}
            onClick={() => handleObjectClick(obj)}
            style={{ top: `${obj.top}%`, left: `${obj.left}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer p-2"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-2xl sm:text-3xl bg-white/[0.03] border border-white/10 hover:bg-white/10 transition">
              <span>{obj.icon}</span>
            </div>
          </div>
        ))}

        {/* شريط التلميحات الثابت بالأسفل */}
        {!isGameCompleted && currentHintTarget && (
          <div className="absolute bottom-4 right-4 left-4 pointer-events-none text-center z-40">
            <span className="px-4 py-2 rounded-full bg-black/80 border border-white/15 backdrop-blur-md text-xs sm:text-sm text-purple-200/90 shadow-lg">
              💡 {currentHintTarget.hint}
            </span>
          </div>
        )}
      </div>

      {/* نافذة عرض تفاصيل الذكرى المكتشفة */}
      <AnimatePresence>
        {activeItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0d0e17]/95 backdrop-blur-2xl p-6 shadow-2xl text-center space-y-4 overflow-hidden"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-3xl shadow-inner">
                {activeItem.icon}
              </div>

              <h3 className="text-xl font-bold text-white">{activeItem.title}</h3>

              <p className="text-sm text-purple-200/80 leading-relaxed">
                {activeItem.message}
              </p>

              <div className="pt-2">
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs sm:text-sm transition cursor-pointer shadow-lg shadow-purple-950/50"
                >
                  متابعة البحث عن التلميح التالي ✨
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* نافذة ختام اللعبة بعد إيجاد كافة الذكريات الـ 5 */}
      <AnimatePresence>
        {isGameCompleted && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              className="relative w-full max-w-lg rounded-3xl border border-purple-500/30 bg-[#0c0d15]/95 backdrop-blur-2xl p-8 shadow-[0_0_80px_rgba(168,85,247,0.3)] text-center space-y-6 overflow-hidden"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-4xl shadow-xl animate-bounce">
                🏆
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">
                  وجدتِ كنز المجرة الكامل! ❤️✨
                </h3>
                <p className="text-xs text-purple-300">
                  تم اكتشاف جميع الذكريات حسب التلميحات بنجاح
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-purple-100/90 leading-relaxed text-right">
                <p>
                  "كل قطعة وكل ذكرى لقيتيها بالفضاء هي مجرد جزء بسيط من الأيام واللحظات الحلوة اللي عشناها واللي لسه رح نعيشها سوا.. شكراً لأنك دايماً أسرار وسعادة هاد الكون!"
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={initGame}
                  className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white border border-purple-400/30 text-xs sm:text-sm font-medium transition cursor-pointer shadow-lg shadow-purple-950/50"
                >
                  لعبة جديدة بالتلميحات والأغراض 🔄
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
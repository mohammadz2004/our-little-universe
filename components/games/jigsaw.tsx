'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  RefreshCw,
  Eye,
  ImageIcon,
  Trophy,
  Heart,
  ShieldCheck,
  Zap,
  MessageCircleHeart
} from 'lucide-react';

// معرض الصور الجاهزة للاختيار مع الرسائل المخبأة الخاصة بكل صورة
const PRESET_IMAGES = [
  {
    id: 1,
    title: "غروب شمس القدس 🌅",
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    hiddenMessage: "القدسُ في القَلبِ سِحرٌ لا يَزول، وشَمسُها تُضيءُ أجمَل الأيام 🌅✨"
  },
  {
    id: 2,
    title: "ليلة ملونة ✨",
    url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
    hiddenMessage: "مَهما أظْلَمَت اللَّيالي، فَإنَّ البَسمَة تُضيءُ الدَّرب كالنُّجوم ✨🌟"
  },
  {
    id: 3,
    title: "حديقة الورد 🌹",
    url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    hiddenMessage: "أنتِ الوَردَة التي تُزهِرُ في كُلِّ أوقاتِ العَام 🌹💖"
  },
  {
    id: 4,
    title: "سماء ناعمة ☁️",
    url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
    hiddenMessage: "كُوني كالسَّماءِ الصَّافِيَة، تَبثّين الرَّاحَة والسَّلام فِي كلِّ مَكان ☁️🕊️"
  }
];

interface Piece {
  id: number;
  correctPos: number; // 0 to 15
  currentPos: number | null; // 0 to 15 or null if in tray
}

export default function JigsawGame() {
  const GRID_SIZE = 4; // 4x4 Grid = 16 Pieces
  const TOTAL_PIECES = GRID_SIZE * GRID_SIZE;

  const [selectedImageObj, setSelectedImageObj] = useState(PRESET_IMAGES[0]);
  const [difficulty, setDifficulty] = useState<'easy' | 'hard'>('easy');
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [boardSlots, setBoardSlots] = useState<(Piece | null)[]>(Array(TOTAL_PIECES).fill(null));
  const [selectedPieceId, setSelectedPieceId] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [showGallery, setShowGallery] = useState<boolean>(false);
  const [movesCount, setMovesCount] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showHiddenMessage, setShowHiddenMessage] = useState<boolean>(false);

  // إعادة تهيئة البازل عند تغيير الصورة أو مستوى الصعوبة
  useEffect(() => {
    initPuzzle();
  }, [selectedImageObj, difficulty]);

  const initPuzzle = () => {
    setIsCompleted(false);
    setSelectedPieceId(null);
    setMovesCount(0);
    setErrorMessage(null);
    setShowHiddenMessage(false);
    setBoardSlots(Array(TOTAL_PIECES).fill(null));

    // إنشاء 16 قطعة
    const initialPieces: Piece[] = Array.from({ length: TOTAL_PIECES }, (_, i) => ({
      id: i,
      correctPos: i,
      currentPos: null,
    }));

    // خلط القطع عشوائياً
    const shuffled = [...initialPieces].sort(() => Math.random() - 0.5);
    setPieces(shuffled);
  };

  // التحقق من اكتمال البازل
  const checkCompletion = (newSlots: (Piece | null)[]) => {
    const isWin = newSlots.every((slot, index) => slot !== null && slot.correctPos === index);
    if (isWin) {
      setIsCompleted(true);
    }
  };

  // إظهار تنبيه عند محاولة وضع قطعة في مكان غير صحيح بالوضع السهل
  const triggerError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => {
      setErrorMessage(null);
    }, 1800);
  };

  // عند الضغط على قطعة من صينية القطع السفلى
  const handleSelectPiece = (piece: Piece) => {
    if (isCompleted) return;
    if (selectedPieceId === piece.id) {
      setSelectedPieceId(null);
    } else {
      setSelectedPieceId(piece.id);
    }
  };

  // عند الضغط على مربع في اللوحة 4x4
  const handleSlotClick = (targetIndex: number) => {
    if (isCompleted) return;

    // حالة 1: تحديد قطعة لوضعها في المكان
    if (selectedPieceId !== null) {
      const pieceToPlace = pieces.find((p) => p.id === selectedPieceId);
      if (!pieceToPlace) return;

      // قيود الوضع السهل: يمنع وضع القطعة في غير موقعها الصحيح ويحتسب حركة خاضعة للخطأ
      if (difficulty === 'easy' && pieceToPlace.correctPos !== targetIndex) {
        setMovesCount((prev) => prev + 1);
        triggerError('الوضع السهل: هذا ليس المكان الصحيح للقطعة! ❌');
        return;
      }

      const currentOccupant = boardSlots[targetIndex];

      const newBoardSlots = [...boardSlots];
      newBoardSlots[targetIndex] = pieceToPlace;

      const updatedPieces = pieces.map((p) => {
        if (p.id === pieceToPlace.id) {
          return { ...p, currentPos: targetIndex };
        }
        // إذا كان المربع مشغول بقطعة سابقة، نرجعها للصينية
        if (currentOccupant && p.id === currentOccupant.id) {
          return { ...p, currentPos: null };
        }
        return p;
      });

      setBoardSlots(newBoardSlots);
      setPieces(updatedPieces);
      setSelectedPieceId(null);
      setMovesCount((prev) => prev + 1);

      checkCompletion(newBoardSlots);
      return;
    }

    // حالة 2: الضغط على قطعة موجودة باللوحة لإرجاعها للصينية
    const existingPiece = boardSlots[targetIndex];
    if (existingPiece) {
      const newBoardSlots = [...boardSlots];
      newBoardSlots[targetIndex] = null;

      const updatedPieces = pieces.map((p) =>
        p.id === existingPiece.id ? { ...p, currentPos: null } : p
      );

      setBoardSlots(newBoardSlots);
      setPieces(updatedPieces);
      setMovesCount((prev) => prev + 1);
    }
  };

  // القطع المتبقية بالأسفل
  const trayPieces = pieces.filter((p) => p.currentPos === null);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 sm:space-y-6 select-none p-2 sm:p-0" dir="rtl">
      {/* شريط التحكم والأزرار العلوية */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/5 border border-white/10 p-3 sm:p-4 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowGallery(!showGallery)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-200 text-xs sm:text-sm font-medium transition cursor-pointer"
          >
            <ImageIcon className="w-4 h-4 text-purple-300" />
            <span>اختر صورة 🖼️</span>
          </button>

          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs sm:text-sm font-medium transition cursor-pointer ${
              showPreview
                ? 'bg-pink-500/30 border-pink-500/50 text-pink-200 shadow-lg shadow-pink-500/20'
                : 'bg-white/10 hover:bg-white/20 border-white/10 text-gray-200'
            }`}
          >
            <Eye className="w-4 h-4 text-pink-300" />
            <span>{showPreview ? "إخفاء الشفافية 👁️" : "معاينة شفافة 👁️"}</span>
          </button>
        </div>

        {/* اختيارات مستوى الصعوبة */}
        <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setDifficulty('easy')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
              difficulty === 'easy'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>سهل</span>
          </button>

          <button
            onClick={() => setDifficulty('hard')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
              difficulty === 'hard'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>صعب</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 font-medium">
            الحركات: <span className="text-pink-300 font-bold">{movesCount}</span>
          </span>

          <button
            onClick={initPuzzle}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 transition cursor-pointer"
            title="إعادة المحاولة"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* تنبيه الخطأ في الوضع السهل */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs text-center font-semibold backdrop-blur-md shadow-lg"
          >
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* معرض اختيار الصور */}
      <AnimatePresence>
        {showGallery && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4 backdrop-blur-xl"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-purple-300">مجموعة صور الذكريات 📸</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PRESET_IMAGES.map((img) => (
                <div
                  key={img.id}
                  onClick={() => {
                    setSelectedImageObj(img);
                    setShowGallery(false);
                  }}
                  className={`group relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition ${
                    selectedImageObj.id === img.id
                      ? 'border-pink-400 scale-95 shadow-lg shadow-pink-500/20'
                      : 'border-white/10 hover:border-purple-400'
                  }`}
                >
                  <img src={img.url} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                    <span className="text-[10px] text-white font-medium truncate">{img.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* لوحة اللعبة الرئيسية (الشبكة 4x4) */}
      <div className="relative aspect-square w-full max-w-[320px] sm:max-w-md mx-auto bg-slate-900/80 rounded-2xl sm:rounded-3xl p-2 sm:p-0 border-2 border-purple-500/30 backdrop-blur-xl shadow-2xl overflow-hidden">
        {/* شبكة اللوحة - تم استخدام dir="ltr" لضمان عدم عكس اتجاه الصورة */}
        <div
          dir="ltr"
          className="relative z-10 grid grid-cols-4 grid-rows-4 gap-1 sm:gap-1.5 w-full h-full rounded-xl sm:rounded-2xl overflow-hidden bg-black/20"
        >
          {Array.from({ length: TOTAL_PIECES }).map((_, index) => {
            const piece = boardSlots[index];
            const col = index % GRID_SIZE;
            const row = Math.floor(index / GRID_SIZE);

            return (
              <div
                key={index}
                onClick={() => handleSlotClick(index)}
                className={`relative w-full h-full rounded-lg overflow-hidden transition-all duration-200 cursor-pointer flex items-center justify-center border ${
                  piece
                    ? 'border-purple-400/40 hover:border-pink-400 shadow-md'
                    : 'border-white/5 bg-white/[0.03] hover:bg-white/[0.08]'
                }`}
              >
                {/* خلفية المعاينة الشفافة داخل المربع لمطابقة الجزء بـ 100% */}
                {showPreview && !piece && (
                  <div
                    className="absolute inset-0 opacity-25 pointer-events-none"
                    style={{
                      backgroundImage: `url(${selectedImageObj.url})`,
                      backgroundSize: '400% 400%',
                      backgroundPosition: `${col * 33.333}% ${row * 33.333}%`,
                    }}
                  />
                )}

                {piece ? (
                  <div
                    className="w-full h-full relative z-10"
                    style={{
                      backgroundImage: `url(${selectedImageObj.url})`,
                      backgroundSize: '400% 400%',
                      backgroundPosition: `${(piece.correctPos % GRID_SIZE) * 33.333}% ${
                        Math.floor(piece.correctPos / GRID_SIZE) * 33.333
                      }%`,
                    }}
                  />
                ) : (
                  <span className="relative z-10 text-[10px] text-white/20 font-mono select-none">
                    {index + 1}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* طبقة الاحتفال بالفوز */}
        <AnimatePresence>
          {isCompleted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4 rounded-3xl z-30 overflow-y-auto"
            >
              <div className="w-14 h-14 rounded-full bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-300 animate-bounce">
                <Trophy className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-extrabold text-white flex items-center justify-center gap-2">
                  <span>أبدعتِ يا أميرتي!</span>
                  <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
                </h3>
                <p className="text-xs sm:text-sm text-gray-300">
                  أكملتِ البازل بنجاح في الوضع <span className="text-purple-300 font-bold">{difficulty === 'easy' ? 'السهل' : 'الصعب'}</span> خلال <span className="text-pink-300 font-bold">{movesCount}</span> حركة! ✨
                </p>
              </div>

              {/* عرض الرسالة المخبأة */}
              <AnimatePresence>
                {showHiddenMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-900/60 to-pink-900/60 border border-pink-400/30 text-pink-100 text-xs sm:text-sm font-medium shadow-inner backdrop-blur-md max-w-xs"
                  >
                    💌 {selectedImageObj.hiddenMessage}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* الأزرار العلوية والسفلية لإنهاء اللعبة */}
              <div className="flex flex-col gap-2.5 w-full max-w-xs">
                <button
                  onClick={() => setShowHiddenMessage(!showHiddenMessage)}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-purple-500/30 hover:bg-purple-500/40 border border-purple-400/40 text-purple-200 text-xs sm:text-sm font-semibold transition cursor-pointer shadow-md"
                >
                  <MessageCircleHeart className="w-4 h-4 text-pink-300" />
                  <span>
                    {showHiddenMessage ? "إخفاء الرسالة المخبأة 💌" : "أظهر الرسالة المخبأة خلف الصورة 💌"}
                  </span>
                </button>

                <button
                  onClick={initPuzzle}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-pink-500/20 transition transform hover:scale-102 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>لعب مرة أخرى 💖</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* صينية القطع السفلى (المتبقية للتجميع) */}
      <div className="space-y-2 pb-2">
        <div className="flex items-center justify-between text-xs text-gray-400 px-1">
          <span>القطع المتبقية ({trayPieces.length}):</span>
          {selectedPieceId !== null && (
            <span className="text-pink-300 animate-pulse font-medium">
              انقري على مربع في اللوحة لوضع القطعة 📍
            </span>
          )}
        </div>

        <div
          dir="ltr"
          className="p-2 sm:p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-2 sm:gap-2.5 overflow-x-auto scrollbar-thin scrollbar-thumb-purple-500/20 min-h-[76px] sm:min-h-[90px]"
        >
          {trayPieces.length === 0 ? (
            <div className="w-full text-center py-2 text-xs text-gray-400">
              {isCompleted ? "اكتملت جميع القطع 🎉" : "تم وضع جميع القطع في اللوحة!"}
            </div>
          ) : (
            trayPieces.map((piece) => {
              const isSelected = selectedPieceId === piece.id;
              return (
                <div
                  key={piece.id}
                  onClick={() => handleSelectPiece(piece)}
                  className={`relative flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 border-2 ${
                    isSelected
                      ? 'border-pink-400 scale-105 sm:scale-110 shadow-lg shadow-pink-500/30 ring-2 ring-pink-400/50'
                      : 'border-white/20 hover:border-purple-300 hover:scale-105'
                  }`}
                  style={{
                    backgroundImage: `url(${selectedImageObj.url})`,
                    backgroundSize: '400% 400%',
                    backgroundPosition: `${(piece.correctPos % GRID_SIZE) * 33.333}% ${
                      Math.floor(piece.correctPos / GRID_SIZE) * 33.333
                    }%`,
                  }}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
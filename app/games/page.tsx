'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Heart,
  Puzzle,
  Brain,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import Starfield from '@/components/Starfield';
import Jigsaw from '@/components/games/jigsaw';
import Memory from '@/components/games/memory';


export default function GamesHubPage() {
  const [activeGame, setActiveGame] = useState<'menu' | 'jigsaw' | 'memory' | 'quiz'>('menu');

  return (
    <main className="relative min-h-screen text-gray-100 overflow-hidden pb-12 pt-8 px-4 sm:px-8 lg:px-12" dir="rtl">
      <Starfield />

      {/* لمسات خلفية سينمائية - منقولة بفيزياء وأبعاد صفحة الفعاليات بالظبط */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="absolute top-2/3 right-10 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="relative z-10 w-full mx-auto space-y-16">
        {/* زر العودة المخصص حسب الحالة */}
        <div>
          {activeGame === 'menu' ? (
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-sm text-gray-300 backdrop-blur-md transition"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة لعالمنا الصغير</span>
            </Link>
          ) : (
            <button
              onClick={() => setActiveGame('menu')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-sm text-gray-300 backdrop-blur-md transition cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>الرجوع لقائمة الألعاب</span>
            </button>
          )}
        </div>

        {/* 1. قائمة اختيار الألعاب (Menu View) */}
        {activeGame === 'menu' && (
          <div className="space-y-12">
            {/* الهيدر والعنوان الرئيسي مطبق بفيزياء صفحة الفعاليات 100% */}
            <div className="text-center space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs sm:text-sm backdrop-blur-md"
              >
                <Sparkles className="w-4 h-4 text-indigo-300" />
                <span>غرفة الألعاب تبعتنا</span>
              </motion.div>

              <h1 className="text-3xl sm:text-6xl font-extrabold leading-tight">
                <span className="bg-gradient-to-r from-purple-200 via-pink-200 to-indigo-200 bg-clip-text text-transparent">
                  ركن الألعاب
                </span>{" "}
                🎮
              </h1>
            </div>

            {/* الحاوية الرئيسية الزجاجية متطابقة مع قسم العد التنازلي في الصفحة المرجعية */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-3xl p-8 sm:p-10 bg-gradient-to-r from-purple-900/30 via-indigo-900/30 to-pink-900/20 border border-purple-500/30 backdrop-blur-xl shadow-2xl text-center space-y-6 max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 text-purple-200 text-xs font-semibold">
                <span>اختر اللعبة المفضلة 🎲</span>
              </div>

              {/* شبكة الألعاب منقولة بتقسيم وتنسيق كروت الرزنامة والوقت */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-2">
                {/* بطاقة لعبة البازل */}
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveGame('jigsaw')}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/40 backdrop-blur-md cursor-pointer text-center space-y-3 transition flex flex-col items-center justify-center min-h-[180px]"
                >
                  <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300">
                    <Puzzle className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-white">بازل الذكريات 🧩</h3>
                  <p className="text-xs text-gray-300 font-light leading-relaxed">
                    ركّبي قطع الصور لاسترجاع أجمل اللحظات
                  </p>
                </motion.div>

                {/* بطاقة لعبة الذاكرة */}
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveGame('memory')}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-pink-500/40 backdrop-blur-md cursor-pointer text-center space-y-3 transition flex flex-col items-center justify-center min-h-[180px]"
                >
                  <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-300">
                    <Brain className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-white">تطابق الكروت 🧠</h3>
                  <p className="text-xs text-gray-300 font-light leading-relaxed">
                    اختبري ذاكرتكِ واكتشفي الكروت المتطابقة
                  </p>
                </motion.div>

                {/* بطاقة لعبة اختبار الحب */}
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveGame('quiz')}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-rose-500/40 backdrop-blur-md cursor-pointer text-center space-y-3 transition flex flex-col items-center justify-center min-h-[180px]"
                >
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300">
                    <Heart className="w-6 h-6 fill-rose-500/30" />
                  </div>
                  <h3 className="font-bold text-lg text-white">أسئلة وحكايات 💌</h3>
                  <p className="text-xs text-gray-300 font-light leading-relaxed">
                    أسئلة ممتعة لمعرفة مدى إجابتكِ وتذكركِ لتفاصيلنا
                  </p>
                </motion.div>
              </div>
            </motion.section>
          </div>
        )}

        {/* 2. عرض اللعبة المختارة بدقة الأسلوب والكرت نفسه */}
      <AnimatePresence mode="wait">
        {activeGame === 'jigsaw' && (
          <motion.div
            key="jigsaw-game"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full"
          >
            <Jigsaw />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {activeGame === 'memory' && (
          <motion.div
            key="memory-game"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full"
          >
            <Memory />
          </motion.div>
        )}
      </AnimatePresence>

        {activeGame === 'quiz' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-purple-900/30 via-indigo-900/30 to-pink-900/20 border border-purple-500/30 backdrop-blur-xl shadow-2xl text-center space-y-6 max-w-4xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-rose-300">لعبة أسئلة وحكايات قريباً! 💌</h2>
          </motion.section>
        )}
      </div>
    </main>
  );
}
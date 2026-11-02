"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Compass, Music, Lock, LockOpen, Menu, X, ImageIcon, PlayingCards, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // حالة لتتبع العناصر المكتشفة (Visited Links)
  const [visitedLinks, setVisitedLinks] = useState<string[]>([]);
  const [showSecretModal, setShowSecretModal] = useState(false);

  const navLinks = [
    { href: "/#feelings", label: "صفحات المشاعر", icon: Sparkles, iconColor: "text-purple-400" },
    { href: "/interactive", label: "التفاعلات", icon: Compass, iconColor: "text-pink-400" },
    { href: "/ourSongs", label: "أغانينا", icon: Music, iconColor: "text-indigo-400" },
    { href: "/gallery", label: "ألبومنا", icon: ImageIcon, iconColor: "text-green-400" },
    { href: "/games", label: "مساحة لعب", icon: PlayingCards, iconColor: "text-amber-400" },
  ];

  // جلب العناصر المزارة سابقاً من LocalStorage عند التحميل
  useEffect(() => {
    const saved = localStorage.getItem("visited_sections");
    if (saved) {
      try {
        setVisitedLinks(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // تسجيل الرابط عند الضغط عليه
  const handleLinkClick = (href: string) => {
    setIsOpen(false);
    if (!visitedLinks.includes(href)) {
      const updated = [...visitedLinks, href];
      setVisitedLinks(updated);
      localStorage.setItem("visited_sections", JSON.stringify(updated));
    }
  };

  // التحقق هل تم كشف واستكشاف كافة العناصر الموجودة بالقائمة
  const allExplored = navLinks.every((link) => visitedLinks.includes(link.href));
  const remainingCount = navLinks.length - navLinks.filter((link) => visitedLinks.includes(link.href)).length;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <motion.header
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: isVisible ? 0 : -100, opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-3.5 backdrop-blur-md bg-transparent border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
      >
        <div className="w-full mx-auto flex items-center justify-between">

          {/* زر القائمة الجانبية */}
          <div>
            <button
              onClick={() => setIsOpen(true)}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-200 hover:bg-white/10 hover:border-purple-500/40 transition cursor-pointer"
              aria-label="افتح القائمة"
            >
              <Menu className="w-5 h-5 text-purple-300" />
            </button>
          </div>

          {/* الشعار واسم المشروع */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-purple-200 to-indigo-200">
              Our Little Universe
            </span>
            <div className="p-2 bg-gradient-to-tr from-purple-900/60 to-indigo-900/40 border border-purple-500/30 rounded-full text-purple-300 shadow-lg shadow-purple-950/50 group-hover:scale-105 group-hover:border-purple-400/50 transition duration-300">
              <Sparkles className="w-4 h-4 fill-purple-300/20" />
            </div>
          </Link>

        </div>
      </motion.header>

      {/* ---------------- القائمة الجانبية (Sliding Drawer) ---------------- */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm cursor-pointer"
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[280px] sm:w-[320px] bg-[#0c0d14] border-l border-white/10 p-6 flex flex-col justify-between shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <span className="font-bold text-base text-white">القائمة</span>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="flex flex-col gap-3">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    const isVisited = visitedLinks.includes(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => handleLinkClick(link.href)}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl border font-medium transition duration-200 ${
                          isVisited
                            ? "bg-purple-950/20 border-purple-500/30 text-white"
                            : "bg-white/5 border-white/5 hover:bg-purple-500/10 hover:border-purple-500/30 text-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-5 h-5 ${link.iconColor}`} />
                          <span>{link.label}</span>
                        </div>
                        {isVisited && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* زر الرسالة السرية */}
              <div className="pt-6 border-t border-white/10 space-y-2">
                <button
                  onClick={() => {
                    if (allExplored) {
                      setShowSecretModal(true);
                      setIsOpen(false);
                    }
                  }}
                  disabled={!allExplored}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium shadow-lg transition duration-300 ${
                    allExplored
                      ? "bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:scale-[1.02] text-white shadow-purple-950/50 cursor-pointer animate-pulse"
                      : "bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed opacity-75"
                  }`}
                >
                  {allExplored ? (
                    <>
                      <LockOpen className="w-4 h-4 text-pink-200" />
                      <span>فتح الرسالة السرية ✨</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-gray-500" />
                      <span>فتح الرسالة السرية</span>
                    </>
                  )}
                </button>

                {!allExplored && (
                  <p className="text-[11px] text-center text-purple-300/70 font-light">
                    باقي {remainingCount} عناصر لاستكشافها لفتح الرسالة 🔒
                  </p>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ---------------- نافذة عرض الرسالة السرية عند الانتهاء ---------------- */}
      <AnimatePresence>
        {showSecretModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-lg bg-[#0e0f19] border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6 overflow-hidden"
            >
              <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500" />
              
              <div className="w-16 h-16 mx-auto rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-300">
                <Sparkles className="w-8 h-8 animate-spin" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold text-white">الرسالة السرية 💖</h3>
                <p className="text-xs sm:text-sm text-purple-200/80">لأنكِ اكتشفتِ كل أركان عالمنا الصغير..</p>
              </div>

              <div className="p-4 sm:p-6 bg-white/5 border border-white/10 rounded-2xl text-right text-gray-200 text-sm leading-relaxed max-h-60 overflow-y-auto">
                {/* يمكنك كتابة محتوى الرسالة السرية هنا */}
                شكراً لأنكِ دائماً تجعلين كل جزء في حياتي أجمل وأكثر سحراً. كل تفصيلة في هذا المكان صُممت فقط لترسم البسمة على وجهكِ ❤️✨.
              </div>

              <button
                onClick={() => setShowSecretModal(false)}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition cursor-pointer"
              >
                إغلاق الرسالة
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
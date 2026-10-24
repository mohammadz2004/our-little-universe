"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Compass, Bookmark, Lock, Menu, X, ImageIcon, PlayingCards } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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

  const navLinks = [
    { href: "/#feelings", label: "صفحات المشاعر", icon: Sparkles, iconColor: "text-purple-400" },
    { href: "/interactive", label: "التفاعلات", icon: Compass, iconColor: "text-pink-400" },
    { href: "#dreams", label: "أحلامنا المشتركة", icon: Bookmark, iconColor: "text-indigo-400" },
    { href: "/gallery", label: "ألبومنا", icon: ImageIcon, iconColor: "text-green-400" },
    { href: "/games", label: "مساحة لعب", icon: PlayingCards, iconColor: "text-amber-400" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: isVisible ? 0 : -100, opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-3.5 backdrop-blur-md bg-[#090a0f]/80 border-b border-white/10"
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
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/5 hover:bg-purple-500/10 hover:border-purple-500/30 text-gray-200 font-medium transition duration-200"
                      >
                        <Icon className={`w-5 h-5 ${link.iconColor}`} />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-6 border-t border-white/10">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white font-medium shadow-lg shadow-purple-950/50 transition cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-purple-300" />
                  <span>فتح الرسالة السرية</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
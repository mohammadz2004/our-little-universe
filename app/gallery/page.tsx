
"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Heart,
  X,
  ZoomIn,
  ArrowRight,
  Image as ImageIcon,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import Starfield from "@/components/Starfield";
import Navbar from "@/components/Navbar";

export default function GalleryPage() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const selectedImage =
    selectedIndex !== null ? photos[selectedIndex] ?? null : null;

  const loadAlbumPhotos = useCallback(async (signal: AbortSignal) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/gallery", {
        cache: "no-store",
        signal,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "تعذّر تحميل الصور من iCloud");
      }

      if (!Array.isArray(data.photos)) {
        throw new Error("استجابة معرض الصور غير صالحة");
      }

      setPhotos(
        data.photos.filter(
          (url: unknown): url is string =>
            typeof url === "string" && /^https?:\/\//i.test(url)
        )
      );
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;

      console.error("خطأ في جلب الصور:", err);

      setError(
        err instanceof Error
          ? err.message
          : "حدث خطأ غير متوقع أثناء تحميل الصور"
      );
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadAlbumPhotos(controller.signal);

    return () => controller.abort();
  }, [loadAlbumPhotos, reloadKey]);

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const showNext = useCallback(() => {
    setSelectedIndex((current) => {
      if (current === null || photos.length < 2) return current;
      return (current + 1) % photos.length;
    });
  }, [photos.length]);

  const showPrevious = useCallback(() => {
    setSelectedIndex((current) => {
      if (current === null || photos.length < 2) return current;
      return (current - 1 + photos.length) % photos.length;
    });
  }, [photos.length]);

  // لوحة المفاتيح وقفل تمرير الصفحة بالخلفية
  useEffect(() => {
    if (selectedIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeLightbox();

      if (event.key === "ArrowRight") {
        event.preventDefault();
        showNext();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showPrevious();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, closeLightbox, showNext, showPrevious]);

  // السحب على شاشات اللمس
  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    touchStartX.current = event.touches[0].clientX;
    touchStartY.current = event.touches[0].clientY;
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    if (touchStartX.current === null || touchStartY.current === null) {
      return;
    }

    const deltaX = event.changedTouches[0].clientX - touchStartX.current;
    const deltaY = event.changedTouches[0].clientY - touchStartY.current;

    if (
      Math.abs(deltaX) > 50 &&
      Math.abs(deltaX) > Math.abs(deltaY) * 1.2
    ) {
      if (deltaX < 0) showNext();
      else showPrevious();
    }

    touchStartX.current = null;
    touchStartY.current = null;
  }

  return (
    <main
      dir="rtl"
      className="relative min-h-screen overflow-hidden px-4 pb-24 pt-28 text-gray-100 sm:px-8"
    >
      <Starfield />
      <Navbar />

      {/* خلفيات سينمائية */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 z-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-purple-600/10 blur-[150px]" />
      <div className="pointer-events-none absolute right-10 top-2/3 z-0 h-[400px] w-[400px] rounded-full bg-pink-600/10 blur-[130px]" />

      <div className="relative z-10 mx-auto max-w-8xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 backdrop-blur-md transition hover:bg-white/10"
        >
          <ArrowRight className="h-4 w-4" />
          <span>العودة لعالمنا الصغير</span>
        </Link>

        {/* العنوان */}
        <div className="mb-16 space-y-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-pink-500/20 bg-pink-500/10 px-4 py-1.5 text-xs text-pink-300 backdrop-blur-md sm:text-sm"
          >
            <Heart className="h-4 w-4 animate-pulse fill-pink-400 text-pink-400" />
            <span>ذكرياتنا المصورة</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl sm:text-6xl font-bold text-white mb-3 py-4"
          >
            ألبوم حكايتنا ✨
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-7xl text-base font-light leading-relaxed text-gray-300 sm:text-lg"
          >
            كل صورة هون بتحكي عن لحظة استثنائية عشناها سوا..
            وذكرياتنا بتتجدد مع كل صورة جديدة بنضيفها ❤️
          </motion.p>

          {!loading && !error && photos.length > 0 && (
            <p className="text-sm text-purple-200/70">
              <ImageIcon className="ml-1 inline h-4 w-4" />
              {photos.length} صورة من ذكرياتنا
            </p>
          )}
        </div>

        {/* حالات التحميل والأخطاء */}
        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-24">
            <Sparkles className="h-9 w-9 animate-spin text-purple-400" />
            <p className="animate-pulse text-sm text-gray-400">
              جارٍ جلب الصور من ألبومنا... ✨
            </p>
          </div>
        ) : error ? (
          <div
            role="alert"
            className="rounded-3xl border border-red-400/20 bg-white/5 p-8 text-center backdrop-blur-md"
          >
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-300" />
            <h2 className="mb-2 text-lg font-semibold text-white">
              ما قدرنا نحمّل الصور
            </h2>
            <p className="mx-auto mb-6 max-w-lg break-words text-sm text-gray-400">
              {error}
            </p>
            <button
              onClick={() => setReloadKey((key) => key + 1)}
              className="inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-500/20 px-5 py-3 text-sm text-purple-100 transition hover:bg-purple-500/30"
            >
              <RefreshCw className="h-4 w-4" />
              إعادة المحاولة
            </button>
          </div>
        ) : photos.length > 0 ? (
          <div className="columns-1 gap-5 space-y-5 sm:columns-2 lg:columns-3 lg:gap-6 lg:space-y-6">
            {photos.map((url, idx) => (
              <motion.button
                key={`${url}-${idx}`}
                type="button"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  delay: Math.min(idx * 0.035, 0.5),
                }}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedIndex(idx)}
                aria-label={`فتح الصورة ${idx + 1} من ${photos.length}`}
                className="group relative mb-5 block w-full break-inside-avoid cursor-zoom-in overflow-hidden rounded-3xl border border-white/10 bg-white/5 text-right shadow-xl backdrop-blur-md lg:mb-6"
              >
                <img
                  src={url}
                  alt={`ذكرى رقم ${idx + 1}`}
                  loading={idx < 3 ? "eager" : "lazy"}
                  decoding="async"
                  className="h-auto w-full rounded-3xl object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />

                <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/75 via-black/10 to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="flex items-center gap-2 text-xs font-medium text-purple-100 sm:text-sm">
                    <Sparkles className="h-4 w-4 text-pink-300" />
                    تكبير الصورة
                  </span>
                  <span className="rounded-full border border-white/20 bg-white/20 p-2.5 text-white backdrop-blur-md">
                    <ZoomIn className="h-5 w-5" />
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-md">
            <ImageIcon className="mx-auto mb-4 h-12 w-12 text-purple-300 opacity-60" />
            <p className="text-base text-gray-300">
              لا توجد صور متاحة حاليًا في الألبوم.
            </p>
            <button
              onClick={() => setReloadKey((key) => key + 1)}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 transition hover:bg-white/10"
            >
              <RefreshCw className="h-4 w-4" />
              تحديث الألبوم
            </button>
          </div>
        )}
      </div>

      {/* نافذة عرض الصور */}
      <AnimatePresence>
        {selectedImage && selectedIndex !== null && (
          <motion.div
            key="gallery-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-2 backdrop-blur-2xl sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label="عرض الصورة بالحجم الكبير"
          >
            {/* زر الإغلاق */}
            <button
              type="button"
              onClick={closeLightbox}
              aria-label="إغلاق الصورة"
              className="absolute right-3 top-3 z-30 rounded-full border border-white/20 bg-black/70 p-3 text-white transition hover:bg-white/20 sm:right-7 sm:top-7"
            >
              <X className="h-5 w-5" />
            </button>

            {/* عداد الصور */}
            <div
              dir="ltr"
              className="absolute left-1/2 top-4 z-30 -translate-x-1/2 rounded-full border border-white/15 bg-black/60 px-4 py-2 text-sm text-white backdrop-blur-md"
            >
              {selectedIndex + 1} / {photos.length}
            </div>

            {/* مساحة الصورة: أطول على الموبايل */}
            <motion.div
              key={selectedImage}
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(event) => event.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="relative flex h-[calc(100dvh-112px)] max-h-[85vh] w-full max-w-full cursor-default touch-pan-y items-center justify-center sm:h-auto"
            >
              <img
                src={selectedImage}
                alt={`ذكرى رقم ${selectedIndex + 1}`}
                draggable={false}
                decoding="async"
                className="block max-h-full max-w-full select-none rounded-xl object-contain shadow-2xl sm:max-h-[85vh] sm:rounded-3xl"
              />
            </motion.div>

            {/* أزرار التنقل */}
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    showPrevious();
                  }}
                  aria-label="الصورة السابقة"
                  className="absolute left-2 top-1/2 z-30 -translate-y-1/2 rounded-full border border-white/20 bg-black/70 p-3 text-white shadow-lg transition active:scale-90 hover:bg-white/20 sm:left-6 sm:p-4"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    showNext();
                  }}
                  aria-label="الصورة التالية"
                  className="absolute right-2 top-1/2 z-30 -translate-y-1/2 rounded-full border border-white/20 bg-black/70 p-3 text-white shadow-lg transition active:scale-90 hover:bg-white/20 sm:right-6 sm:p-4"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* تعليمات مختلفة للموبايل والكمبيوتر */}
            <div className="pointer-events-none absolute bottom-3 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-black/70 px-4 py-2 text-xs text-gray-200 backdrop-blur-md sm:bottom-5">
              <span className="sm:hidden">
                اسحب للتنقّل · اضغط خارج الصورة للإغلاق
              </span>
              <span className="hidden sm:inline">
                استخدم الأسهم للتنقّل · ESC للإغلاق
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

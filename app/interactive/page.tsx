"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Heart,
  Clock,
  MapPin,
  Calendar as CalendarIcon,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import Starfield from "@/components/Starfield";
import Navbar from "@/components/Navbar";
import JerusalemMap from "@/components/JerusalemMapWrapper";

// ضع هنا رابط Raw الخاص بملف events.json الجديد
const EXTERNAL_EVENTS_URL =
  "https://gist.githubusercontent.com/mohammadz2004/fcc8528888a7a589fb5dcffab2e80f47/raw/interactive.json";

interface CountdownData {
  title: string;
  targetDate: string;
}

interface CalendarItem {
  date: string;
  title: string;
  description: string;
}

interface PlaceItem {
  id: string;
  name: string;
  category: string;
  description: string;
  lat: number;
  lng: number;
  googleMapsUrl: string;
}

export default function EventsPage() {
  const [countdownData, setCountdownData] = useState<CountdownData | null>(null);
  const [calendar, setCalendar] = useState<CalendarItem[]>([]);
  const [places, setPlaces] = useState<PlaceItem[]>([]);
  const [loading, setLoading] = useState(true);

  // حساب الوقت المتبقي للعد التنازلي
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    async function fetchEventsData() {
      try {
        setLoading(true);
        const res = await fetch(EXTERNAL_EVENTS_URL);
        if (res.ok) {
          const data = await res.json();
          setCountdownData(data.countdown || null);
          setCalendar(data.calendar || []);
          setPlaces(data.places || []);
        }
      } catch (err) {
        console.error("خطأ في جلب بيانات الفعاليات:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchEventsData();
  }, []);

  // تحديث العداد التنازلي حي حياً كل ثانية
  useEffect(() => {
    if (!countdownData?.targetDate) return;

    const timer = setInterval(() => {
      const target = new Date(countdownData.targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [countdownData]);

  return (
    <main className="relative min-h-screen text-gray-100 overflow-hidden pb-24 pt-28 px-4 sm:px-8 lg:px-12">
      <Starfield />
      <Navbar />

      {/* لمسات خلفية سينمائية */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="absolute top-2/3 right-10 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="relative z-10 w-full mx-auto space-y-16">
        {/* زر العودة */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-sm text-gray-300 backdrop-blur-md"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة لعالمنا الصغير</span>
          </Link>
        </div>

        {/* الهيدر والعنوان الرئيسي */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs sm:text-sm backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-indigo-300" />
            <span>فعالياتنا وأوقاتنا الخاصة</span>
          </motion.div>

          <h1 className="text-3xl sm:text-6xl font-extrabold leading-tight">
            <span className="bg-gradient-to-r from-purple-200 via-pink-200 to-indigo-200 bg-clip-text text-transparent">
              مواعيد حكايتنا
            </span>{" "}
            ✨
          </h1>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Sparkles className="w-8 h-8 text-purple-400 animate-spin" />
            <p className="text-gray-400 animate-pulse text-sm">
              جارٍ جلب الفعاليات والمناسبات... ✨
            </p>
          </div>
        ) : (
          <>
            {/* 1. قسم العد التنازلي التفاعلي */}
            {countdownData && (
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative rounded-3xl p-8 sm:p-10 bg-gradient-to-r from-purple-900/30 via-indigo-900/30 to-pink-900/20 border border-purple-500/30 backdrop-blur-xl shadow-2xl text-center space-y-6 max-w-4xl mx-auto"
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 text-purple-200 text-xs font-semibold">
                  <Clock className="w-3.5 h-3.5 text-pink-300" />
                  <span>المناسبة القادمة</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  {countdownData.title}
                </h2>

                {/* مربعات الوقت */}
                <div className="grid grid-cols-4 gap-3 sm:gap-6 max-w-lg mx-auto">
                  {[
                    { label: "يوم", value: timeLeft.days },
                    { label: "ساعة", value: timeLeft.hours },
                    { label: "دقيقة", value: timeLeft.minutes },
                    { label: "ثانية", value: timeLeft.seconds },
                  ].map((unit, idx) => (
                    <div
                      key={idx}
                      className="p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-center"
                    >
                      <span className="text-2xl sm:text-4xl font-extrabold text-pink-300">
                        {String(unit.value).padStart(2, "0")}
                      </span>
                      <span className="text-[10px] sm:text-xs text-gray-400 mt-1">
                        {unit.label}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* 2. قسم الرزنامة والمناسبات */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  جدول مناسباتنا 📅
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {calendar.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-2 hover:border-purple-500/40 "
                  >
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 inline-block mb-1">
                      {item.date}
                    </span>
                    <h3 className="text-lg font-bold text-white">{item.title}</h3>
                    <p className="text-sm text-gray-300 font-light leading-relaxed">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* 3. قسم خريطة أماكننا بالقدس التفاعلية */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    أماكننا الخاصة 📍
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-400">
                    خريطة تفاعلية بالذكريات والمواقع اللي الها مكانة بقلبنا
                  </p>
                </div>
              </div>
              {/* عرض الخريطة التفاعلية 2D */}
              <JerusalemMap places={places} />
            </section>
          </>
        )}
      </div>
    </main>
  );
}
"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Disc,
  Repeat,
  Volume2,
  VolumeX,
  Radio,
  ArrowRight,
  Music,
} from "lucide-react";
import Link from "next/link";
import Starfield from "@/components/Starfield";
import Navbar from "@/components/Navbar";

interface Song {
  id: string;
  title: string;
  artist: string;
  memory: string;
  coverEmoji: string;
  audioUrl: string;
}

const OUR_SONGS: Song[] = [
  {
    id: "1",
    title: "أغنيتنا الأولى والخاصة",
    artist: "النانس أو المطرب المفضل",
    memory: "الأغنية اللي دايماً بتذكرنا بأول مشوار وأحلى قعدة هادية.",
    coverEmoji: "🎶",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: "2",
    title: "نغمة الضحكة والبال الطويل",
    artist: "موسيقى هادئة",
    memory: "لما نكون طالعين مشوار بالسيارة بالليل ونسمعها بهدوء.",
    coverEmoji: "🚗",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: "3",
    title: "لحن الذكريات والسر",
    artist: "رومانسيات فضاء",
    memory: "كل ما تعزف هاي النغمة بتذكرني بكل تفصيلة حلوة بيننا.",
    coverEmoji: "✨",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
  {
    id: "4",
    title: "ساعة المزوقين والروقان",
    artist: "جلسة خاصة",
    memory: "الأغنية اللي بنضل نكررها عسريع بدون ما نمل منها أبداً.",
    coverEmoji: "☕",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  },
];

export default function OurSongsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentSong = OUR_SONGS[currentIdx];

  // منع مشاكل الـ Hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (audioRef.current && isMounted) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentIdx, isMounted]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentIdx((prev) => (prev + 1) % OUR_SONGS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentIdx((prev) => (prev - 1 + OUR_SONGS.length) % OUR_SONGS.length);
    setIsPlaying(true);
  };

  const handleRepeat = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleToggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(audioRef.current.muted);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  if (!isMounted) return null;

  return (
    <main className="relative min-h-screen text-gray-100 overflow-hidden pb-24 pt-28 px-4 sm:px-8 lg:px-12" dir="rtl">
      <Starfield />
      <Navbar />

      {/* لمسات خلفية سينمائية موحدة مع النموذج */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="absolute top-2/3 right-10 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[140px] pointer-events-none z-0" />

      <audio
        ref={audioRef}
        src={currentSong.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleRepeat}
      />

      <div className="relative z-10 w-full mx-auto space-y-12">
        {/* زر العودة الموحد مع النموذج */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-sm text-gray-300 backdrop-blur-md transition"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة لعالمنا الصغير</span>
          </Link>
        </div>

        {/* الهيدر والعنوان الرئيسي بنفس الطراز */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs sm:text-sm backdrop-blur-md"
          >
            <Radio className="w-4 h-4 text-indigo-300 animate-pulse" />
            <span>محطة أغانينا الذكية</span>
          </motion.div>

          <h1 className="text-3xl sm:text-6xl font-extrabold leading-tight">
            <span className="bg-gradient-to-r from-purple-200 via-pink-200 to-indigo-200 bg-clip-text text-transparent">
              أغانينا ونغماتنا الخاصة
            </span>{" "}
            🎧
          </h1>
        </div>

        {/* جسم المشغل وقائمة التشغيل */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
          
          {/* مشغل الأغاني الرئيسي */}
          <div className="md:col-span-7 bg-[#0c0d16]/80 border border-white/10 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center">
            
            {/* الكاسيت الدائري المتفاعل */}
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full p-3 bg-gradient-to-tr from-purple-900/40 to-pink-900/40 border border-white/15 shadow-[0_0_40px_rgba(168,85,247,0.2)] flex items-center justify-center mb-6">
              <div
                className={`w-full h-full rounded-full bg-[#141522] border-4 border-white/10 flex flex-col items-center justify-center shadow-inner relative overflow-hidden transition-transform duration-500 ${
                  isPlaying ? "animate-[spin_10s_linear_infinite]" : ""
                }`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.05)_10%,_transparent_70%)]" />
                <div className="text-5xl sm:text-6xl mb-2">{currentSong.coverEmoji}</div>
                <div className="w-10 h-10 rounded-full bg-[#0c0d16] border-2 border-purple-400/40 shadow-md flex items-center justify-center z-10">
                  <Disc className="w-4 h-4 text-purple-300 animate-spin" />
                </div>
              </div>
            </div>

            <div className="text-center space-y-1 mb-6 w-full">
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide truncate">
                {currentSong.title}
              </h3>
              <p className="text-xs sm:text-sm text-purple-300/80">{currentSong.artist}</p>
              <p className="text-xs text-gray-400 font-light mt-1 bg-white/5 py-1 px-3 rounded-full inline-block border border-white/5">
                💡 {currentSong.memory}
              </p>
            </div>

            <div className="w-full space-y-2 mb-6">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex justify-between text-xs text-purple-200/50 font-mono">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* أزرار التحكم */}
            <div className="flex items-center justify-center gap-6 w-full">
              <button
                onClick={handleRepeat}
                className="p-3 rounded-full text-gray-300 hover:text-white hover:bg-white/5 transition cursor-pointer"
                title="إعادة الأغنية من البداية"
              >
                <Repeat className="w-5 h-5" />
              </button>

              <button
                onClick={handlePrev}
                className="p-3 rounded-full text-white bg-white/5 border border-white/10 hover:bg-white/15 transition cursor-pointer"
                title="الأغنية السابقة"
              >
                <SkipForward className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 hover:scale-105 text-white flex items-center justify-center shadow-lg shadow-purple-950/50 transition cursor-pointer"
                title={isPlaying ? "إيقاف مؤقت" : "تشغيل"}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current" />}
              </button>

              <button
                onClick={handleNext}
                className="p-3 rounded-full text-white bg-white/5 border border-white/10 hover:bg-white/15 transition cursor-pointer"
                title="الأغنية التالية"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={handleToggleMute}
                className="p-3 rounded-full text-gray-300 hover:text-white hover:bg-white/5 transition cursor-pointer"
                title={isMuted ? "إلغاء الكتم" : "كتم الصوت"}
              >
                {isMuted ? <VolumeX className="w-5 h-5 text-purple-400" /> : <Volume2 className="w-5 h-5" />}
              </button>
            </div>

          </div>

          {/* قائمة اختيار الأغاني الجانبية */}
          <div className="md:col-span-5 space-y-3">
            <h4 className="text-sm font-bold text-purple-200 px-2 flex items-center gap-2">
              <Music className="w-4 h-4 text-purple-400" />
              <span>قائمة الأغاني والمحطات</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                {OUR_SONGS.length}
              </span>
            </h4>

            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {OUR_SONGS.map((song, idx) => {
                const isSelected = idx === currentIdx;

                return (
                  <div
                    key={song.id}
                    onClick={() => {
                      setCurrentIdx(idx);
                      setIsPlaying(true);
                    }}
                    className={`group p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between backdrop-blur-xl ${
                      isSelected
                        ? "bg-purple-600/20 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                        : "bg-white/[0.03] border-white/10 hover:bg-white/[0.07] hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl shrink-0">
                        {song.coverEmoji}
                      </div>
                      <div>
                        <h5 className="text-xs sm:text-sm font-bold text-white group-hover:text-purple-300 transition">
                          {song.title}
                        </h5>
                        <p className="text-[11px] text-purple-200/60 font-light truncate max-w-[180px]">
                          {song.artist}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isSelected && isPlaying ? (
                        <span className="flex gap-0.5 items-end h-4 px-2">
                          <span className="w-1 bg-purple-400 animate-bounce h-full rounded-full" />
                          <span className="w-1 bg-purple-400 animate-bounce h-2/3 rounded-full [animation-delay:0.2s]" />
                          <span className="w-1 bg-purple-400 animate-bounce h-4/5 rounded-full [animation-delay:0.4s]" />
                        </span>
                      ) : (
                        <Play className="w-4 h-4 text-gray-400 group-hover:text-white transition" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
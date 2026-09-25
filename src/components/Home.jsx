import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  GraduationCap, 
  Trophy, 
  Sparkles, 
  ArrowRight, 
  Play, 
  Clock, 
  Flame, 
  CheckCircle2, 
  Bookmark, 
  Layers,
  ChevronRight,
  BookA,
  LayoutGrid,
  Volume2,
  RotateCcw
} from 'lucide-react';

const INSPIRATIONAL_REFLECTIONS = [
  {
    surahNumber: 94,
    ayahNumber: 5,
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا • إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation: "For indeed, with hardship [will be] ease. Indeed, with hardship [will be] ease.",
    surah: "Surah Ash-Sharh (94:5-6)",
    audioUrl: "https://everyayah.com/data/Alafasy_128kbps/094005.mp3"
  },
  {
    surahNumber: 2,
    ayahNumber: 286,
    arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
    translation: "Allah does not burden a soul beyond that it can bear.",
    surah: "Surah Al-Baqarah (2:286)",
    audioUrl: "https://everyayah.com/data/Alafasy_128kbps/002286.mp3"
  },
  {
    surahNumber: 65,
    ayahNumber: 3,
    arabic: "وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ ۚ وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    translation: "And He will provide for him from where he does not expect. And whoever relies upon Allah - then He is sufficient for him.",
    surah: "Surah At-Talaq (65:3)",
    audioUrl: "https://everyayah.com/data/Alafasy_128kbps/065003.mp3"
  },
  {
    surahNumber: 13,
    ayahNumber: 28,
    arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    translation: "Unquestionably, by the remembrance of Allah hearts are assured and find peace.",
    surah: "Surah Ar-Ra'd (13:28)",
    audioUrl: "https://everyayah.com/data/Alafasy_128kbps/013028.mp3"
  },
  {
    surahNumber: 39,
    ayahNumber: 53,
    arabic: "قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ",
    translation: "Say, 'O My servants who have transgressed against themselves, do not despair of the mercy of Allah.'",
    surah: "Surah Az-Zumar (39:53)",
    audioUrl: "https://everyayah.com/data/Alafasy_128kbps/039053.mp3"
  },
  {
    surahNumber: 2,
    ayahNumber: 152,
    arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ",
    translation: "So remember Me; I will remember you. And be grateful to Me and do not deny Me.",
    surah: "Surah Al-Baqarah (2:152)",
    audioUrl: "https://everyayah.com/data/Alafasy_128kbps/002152.mp3"
  },
  {
    surahNumber: 3,
    ayahNumber: 139,
    arabic: "وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ",
    translation: "So do not weaken and do not grieve, and you will be superior if you are [true] believers.",
    surah: "Surah Ali 'Imran (3:139)",
    audioUrl: "https://everyayah.com/data/Alafasy_128kbps/003139.mp3"
  },
  {
    surahNumber: 21,
    ayahNumber: 87,
    arabic: "لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ",
    translation: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.",
    surah: "Surah Al-Anbiya (21:87)",
    audioUrl: "https://everyayah.com/data/Alafasy_128kbps/021087.mp3"
  },
  {
    surahNumber: 93,
    ayahNumber: 7,
    arabic: "وَوَجَدَكَ ضَالًّا فَهَدَىٰ",
    translation: "And He found you seeking and in need, and He guided [you].",
    surah: "Surah Ad-Duhaa (93:7)",
    audioUrl: "https://everyayah.com/data/Alafasy_128kbps/093007.mp3"
  },
  {
    surahNumber: 55,
    ayahNumber: 13,
    arabic: "فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ",
    translation: "So which of the favors of your Lord would you deny?",
    surah: "Surah Ar-Rahman (55:13)",
    audioUrl: "https://everyayah.com/data/Alafasy_128kbps/055013.mp3"
  }
];

export default function Home() {
  const navigate = useNavigate();

  // Load last read with active fallback
  const [lastRead, setLastRead] = useState(() => {
    try {
      const saved = localStorage.getItem('quran_last_read');
      return saved ? JSON.parse(saved) : {
        surahNumber: 18,
        surahName: 'Al-Kahf',
        surahArabic: 'الكهف',
        ayah: 28,
        totalAyahs: 110,
        juz: 15,
        page: 297,
        progress: 25
      };
    } catch {
      return {
        surahNumber: 18,
        surahName: 'Al-Kahf',
        surahArabic: 'الكهف',
        ayah: 28,
        totalAyahs: 110,
        juz: 15,
        page: 297,
        progress: 25
      };
    }
  });

  // Reload lastRead on mount and whenever window regains focus
  useEffect(() => {
    const syncLastRead = () => {
      try {
        const saved = localStorage.getItem('quran_last_read');
        if (saved) {
          setLastRead(JSON.parse(saved));
        }
      } catch (e) {
        console.error("Failed to sync last read", e);
      }
    };
    syncLastRead();
    window.addEventListener('focus', syncLastRead);
    return () => window.removeEventListener('focus', syncLastRead);
  }, []);

  const [streak, setStreak] = useState(() => {
    try {
      const s = localStorage.getItem('quran_streak');
      return s ? parseInt(s, 10) : 7;
    } catch {
      return 7;
    }
  });

  // Calculate day-of-year so verse automatically changes every calendar day
  const getInitialDayIndex = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    return dayOfYear % INSPIRATIONAL_REFLECTIONS.length;
  };

  const [reflectionIndex, setReflectionIndex] = useState(getInitialDayIndex());
  const [isPlayingDailyVerse, setIsPlayingDailyVerse] = useState(false);
  const audioInstance = useState(new Audio())[0];

  const currentVerse = INSPIRATIONAL_REFLECTIONS[reflectionIndex] || INSPIRATIONAL_REFLECTIONS[0];

  const handleNextReflection = () => {
    audioInstance.pause();
    setIsPlayingDailyVerse(false);
    setReflectionIndex((prev) => (prev + 1) % INSPIRATIONAL_REFLECTIONS.length);
  };

  const handlePlayDailyVerse = () => {
    if (isPlayingDailyVerse) {
      audioInstance.pause();
      setIsPlayingDailyVerse(false);
    } else {
      audioInstance.src = currentVerse.audioUrl;
      audioInstance.play().catch(() => {});
      setIsPlayingDailyVerse(true);
      audioInstance.onended = () => setIsPlayingDailyVerse(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pb-12 text-[#F5F1E6]">
      {/* Hero Section (Relative z-10) */}
      <div className="relative z-10 w-full -mt-16 pt-24 pb-10 sm:pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6 flex flex-col items-center text-center">
          
          {/* Greeting & Headline (Exact text & styling from reference design) */}
          <div className="space-y-1.5 pt-2">
            <span className="font-serif italic text-xl sm:text-2xl text-[#C5A059] font-medium tracking-wide drop-shadow-md">
              Assalamu Alaikum
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-outfit text-white tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
              Continue your Quran journey
            </h1>
            <p className="text-xs sm:text-sm text-[#F5F1E6]/85 font-medium tracking-widest uppercase pt-1 drop-shadow-md">
              Read • Understand • Listen • Learn
            </p>
          </div>

          {/* Floating Frosted Glass Continue Reading Card (Matching Reference Design) */}
          <div className="w-full max-w-2xl bg-[#082218]/75 backdrop-blur-xl border border-[#C5A059]/35 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-left hover:border-[#C5A059]/65 transition-all">
            <p className="text-[11px] uppercase font-bold text-[#C5A059] tracking-wider mb-2.5">
              Continue Reading
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
              
              {/* Left: Medallion + Surah Info + Progress */}
              <div className="flex items-center gap-4 flex-1 w-full sm:w-auto">
                {/* Ornate Medallion with Surah Number */}
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#C5A059] to-[#8B6914] p-0.5 shadow-lg flex-shrink-0">
                  <div className="w-full h-full rounded-full bg-[#082218] border-2 border-[#C5A059]/60 flex items-center justify-center text-[#C5A059] font-bold text-lg">
                    {lastRead.surahNumber}
                  </div>
                </div>

                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold font-outfit text-white">
                        {lastRead.surahName}
                      </h3>
                      <p className="text-xs text-[#F5F1E6]/70">
                        Ayah {lastRead.ayah}/{lastRead.totalAyahs} • Juz {lastRead.juz} • Page {lastRead.page}
                      </p>
                    </div>

                    <span className="text-sm font-bold text-emerald-400">
                      {Math.round((lastRead.ayah / lastRead.totalAyahs) * 100)}%
                    </span>
                  </div>

                  {/* Glowing Emerald Progress Bar */}
                  <div className="w-full bg-[#051811] h-2.5 rounded-full overflow-hidden border border-[#C5A059]/25 shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-[#10B981] via-[#34D399] to-[#C5A059] h-full rounded-full shadow-[0_0_12px_rgba(16,185,129,0.5)] transition-all duration-700"
                      style={{ width: `${Math.max(4, Math.round((lastRead.ayah / lastRead.totalAyahs) * 100))}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Right: Action Buttons */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => navigate(`/quran?surah=${lastRead.surahNumber}&ayah=${lastRead.ayah}&autoplay=true`)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E3C578] text-[#061610] font-bold text-sm hover:brightness-110 shadow-lg shadow-[#C5A059]/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap"
                >
                  <span>Continue Reading</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  onClick={() => navigate(`/live-quran?page=${lastRead.page}`)}
                  className="p-3 rounded-xl bg-[#061A12]/80 hover:bg-[#0c2e23] border border-[#C5A059]/40 text-[#C5A059] hover:text-[#F5E096] transition-all"
                  title="View in 3D Live Mushaf"
                >
                  <BookOpen size={16} />
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Main Dashboard Container (Relative z-10) */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in-up">
        
        {/* Daily Divine Reflection Card (Featured Inspiration below Hero) */}
        <div className="w-full bg-[#082218]/75 backdrop-blur-xl rounded-2xl border border-[#C5A059]/30 p-5 sm:p-6 shadow-xl">
          <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-[#C5A059]/15">
            <span className="inline-flex items-center gap-2 text-xs text-[#C5A059] font-bold tracking-wide uppercase">
              <Sparkles size={14} className="text-[#C5A059]" /> Daily Divine Reflection
            </span>

            <button
              onClick={handleNextReflection}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#061A12] border border-[#C5A059]/30 text-xs text-[#C5A059] hover:bg-[#C5A059]/20 transition-colors"
              title="View Another Inspiring Verse"
            >
              <RotateCcw size={12} />
              <span>Next Reflection</span>
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1 text-center md:text-left">
              <p className="font-scheherazade text-2xl sm:text-3xl text-[#F5F1E6] leading-relaxed mb-1 font-medium">
                {currentVerse.arabic}
              </p>
              <p className="text-xs sm:text-sm text-[#F5F1E6]/85 font-serif italic">
                "{currentVerse.translation}"
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => navigate(`/quran?surah=${currentVerse.surahNumber}&ayah=${currentVerse.ayahNumber}`)}
                className="font-semibold hover:underline flex items-center gap-1 text-xs text-[#F5E096]"
              >
                <span>{currentVerse.surah}</span>
                <ChevronRight size={13} />
              </button>

              <button 
                onClick={handlePlayDailyVerse}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#C5A059]/15 border border-[#C5A059]/35 hover:bg-[#C5A059]/25 text-[#C5A059] transition-colors font-medium text-xs"
              >
                <Volume2 size={14} />
                <span>{isPlayingDailyVerse ? 'Playing...' : 'Listen Ayah'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Feature Cards Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold font-outfit text-[#F5F1E6] flex items-center gap-2">
              <Layers size={20} className="text-[#C5A059]" />
              Core Learning Modules
            </h3>
            <span className="text-xs text-[#C5A059]/80 font-medium">Explore & Study</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Read Quran */}
            <div
              onClick={() => navigate('/quran')}
              className="group cursor-pointer rounded-2xl bg-[#082218]/70 backdrop-blur-lg border border-[#C5A059]/25 p-5 hover:border-[#C5A059]/60 hover:bg-[#082218]/85 hover:shadow-xl hover:shadow-[#C5A059]/15 transition-all hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#C5A059]/15 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059] mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen size={24} />
                </div>
                <h4 className="text-lg font-bold text-white group-hover:text-[#C5A059] transition-colors">
                  Read Quran
                </h4>
                <p className="text-xs text-[#F5F1E6]/70 mt-1.5 leading-relaxed">
                  114 Surahs with translation, tafsir, transliteration & verse-by-verse audio recitation.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#C5A059]/15 flex items-center justify-between text-xs text-[#C5A059] font-semibold">
                <span>Browse Surahs</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 2: Noorani Qaida */}
            <div
              onClick={() => navigate('/qaida')}
              className="group cursor-pointer rounded-2xl bg-[#082218]/70 backdrop-blur-lg border border-[#C5A059]/25 p-5 hover:border-[#C5A059]/60 hover:bg-[#082218]/85 hover:shadow-xl hover:shadow-[#C5A059]/15 transition-all hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#C5A059]/15 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059] mb-4 group-hover:scale-110 transition-transform">
                  <BookA size={24} />
                </div>
                <h4 className="text-lg font-bold text-white group-hover:text-[#C5A059] transition-colors">
                  Noorani Qaida
                </h4>
                <p className="text-xs text-[#F5F1E6]/70 mt-1.5 leading-relaxed">
                  Master the Arabic alphabet, Harakat, Tanween & Tajweed rules with native audio pronunciations.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#C5A059]/15 flex items-center justify-between text-xs text-[#C5A059] font-semibold">
                <span>10 Lessons</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 3: Vocabulary Builder */}
            <div
              onClick={() => navigate('/vocab')}
              className="group cursor-pointer rounded-2xl bg-[#082218]/70 backdrop-blur-lg border border-[#C5A059]/25 p-5 hover:border-[#C5A059]/60 hover:bg-[#082218]/85 hover:shadow-xl hover:shadow-[#C5A059]/15 transition-all hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#C5A059]/15 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059] mb-4 group-hover:scale-110 transition-transform">
                  <LayoutGrid size={24} />
                </div>
                <h4 className="text-lg font-bold text-white group-hover:text-[#C5A059] transition-colors">
                  Vocabulary (SRS)
                </h4>
                <p className="text-xs text-[#F5F1E6]/70 mt-1.5 leading-relaxed">
                  Learn high-frequency Quranic words using Anki spaced repetition flashcards for rapid comprehension.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#C5A059]/15 flex items-center justify-between text-xs text-[#C5A059] font-semibold">
                <span>Practice Words</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 4: Quiz Mode */}
            <div
              onClick={() => navigate('/quiz')}
              className="group cursor-pointer rounded-2xl bg-[#082218]/70 backdrop-blur-lg border border-[#C5A059]/25 p-5 hover:border-[#C5A059]/60 hover:bg-[#082218]/85 hover:shadow-xl hover:shadow-[#C5A059]/15 transition-all hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#C5A059]/15 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059] mb-4 group-hover:scale-110 transition-transform">
                  <Trophy size={24} />
                </div>
                <h4 className="text-lg font-bold text-white group-hover:text-[#C5A059] transition-colors">
                  Islamic Quiz
                </h4>
                <p className="text-xs text-[#F5F1E6]/70 mt-1.5 leading-relaxed">
                  Test and expand your knowledge in Seerah, Quranic wisdom, prophets, and daily Islamic teachings.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#C5A059]/15 flex items-center justify-between text-xs text-[#C5A059] font-semibold">
                <span>Start Challenge</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </div>
        </div>

        {/* Live Quran 3D Mushaf Banner */}
        <div 
          onClick={() => navigate('/live-quran')}
          className="group cursor-pointer relative overflow-hidden rounded-3xl bg-[#0a271c]/75 backdrop-blur-xl border-2 border-[#C5A059]/40 p-6 sm:p-8 shadow-2xl transition-all hover:border-[#C5A059]/80"
        >
          <div className="absolute top-0 right-0 w-80 h-full bg-[#C5A059]/10 blur-2xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C5A059] to-[#8B6914] p-0.5 shadow-lg group-hover:scale-105 transition-transform flex items-center justify-center text-3xl">
                📖
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-extrabold tracking-widest text-[#C5A059]">
                    Realistic 3D Book
                  </span>
                  <span className="text-[10px] bg-[#C5A059]/25 text-[#C5A059] px-2 py-0.5 rounded-full font-bold">
                    604 Pages
                  </span>
                </div>
                <h3 className="text-2xl font-bold font-outfit text-white group-hover:text-[#C5A059] transition-colors">
                  Interactive Live Mushaf
                </h3>
                <p className="text-xs sm:text-sm text-[#F5F1E6]/75 mt-1 max-w-xl">
                  Turn pages like a real printed Quran with dual-page spreads, authentic Madinah calligraphy borders & sound effects.
                </p>
              </div>
            </div>

            <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#C5A059] text-[#061610] font-bold text-sm group-hover:bg-[#F5E096] transition-colors shadow-md whitespace-nowrap">
              <span>Open Mushaf</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Today's Progress & Streak Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Streak Card */}
          <div className="rounded-2xl bg-[#082218]/75 backdrop-blur-md border border-[#C5A059]/25 p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-[#F5F1E6]/60 font-medium">Daily Streak</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">{streak} Days</span>
                <span className="flex items-center text-xs font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full">
                  <Flame size={12} className="fill-orange-400 mr-1" /> On Fire!
                </span>
              </div>
              <p className="text-[11px] text-[#F5F1E6]/50">Read today to maintain your streak</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#C5A059]/15 flex items-center justify-center text-[#C5A059]">
              <Flame size={26} className="text-orange-400" />
            </div>
          </div>

          {/* Reading Time */}
          <div className="rounded-2xl bg-[#082218]/75 backdrop-blur-md border border-[#C5A059]/25 p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-[#F5F1E6]/60 font-medium">Reading Time Today</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">25 mins</span>
                <span className="text-xs text-[#C5A059]">Goal: 30m</span>
              </div>
              <div className="w-36 bg-[#051811] h-1.5 rounded-full overflow-hidden mt-1">
                <div className="bg-[#C5A059] h-full rounded-full" style={{ width: '83%' }} />
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#C5A059]/15 flex items-center justify-center text-[#C5A059]">
              <Clock size={24} />
            </div>
          </div>

          {/* Verses Completed */}
          <div className="rounded-2xl bg-[#082218]/75 backdrop-blur-md border border-[#C5A059]/25 p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-[#F5F1E6]/60 font-medium">Ayahs Read</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">18 Ayahs</span>
                <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  +5 vs yesterday
                </span>
              </div>
              <p className="text-[11px] text-[#F5F1E6]/50">Total 142 ayahs this week</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#C5A059]/15 flex items-center justify-center text-[#C5A059]">
              <CheckCircle2 size={24} />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

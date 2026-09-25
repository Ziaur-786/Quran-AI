import React, { useState, useEffect, useRef } from 'react';
import { fetchSurahs, fetchSurahDetails, fetchAyahTafsir } from '../services/quranApi';
import { fetchChapterInfo } from '../services/quranComApi';
import { bengaliAudioMap } from '../data/bengaliAudioMap';
import { 
  BookOpen, 
  Search, 
  Sliders, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Copy, 
  Bookmark, 
  Sparkles, 
  Info, 
  X, 
  AlertCircle, 
  Loader2, 
  Check, 
  ChevronRight,
  Volume2,
  VolumeX,
  GraduationCap,
  ArrowLeft,
  Settings2,
  Sun,
  Moon,
  PlayCircle
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAudio } from '../context/AudioContext';

export default function QuranReader() {
  const { playAyah, track: globalTrack, isPlaying: isGlobalPlaying, togglePlay } = useAudio();
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Selected Surah & Data
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [surahData, setSurahData] = useState(null);
  const [surahInfo, setSurahInfo] = useState(null);

  // Search & Filter state for Surah Index
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'makki', 'madani', 'saved'
  const [sortBy, setSortBy] = useState('number'); // 'number', 'name', 'ayahs'

  // Reading Settings state
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [arabicFont, setArabicFont] = useState('scheherazade'); // 'scheherazade', 'amiri', 'sans'
  const [arabicFontSize, setArabicFontSize] = useState(34); // in px
  const [translationFontSize, setTranslationFontSize] = useState(16); // in px
  const [readerTheme, setReaderTheme] = useState('dark'); // 'dark', 'sepia', 'light'
  const [selectedLanguage, setSelectedLanguage] = useState('english'); // 'english', 'urdu', 'bengali', 'hindi'
  const [showTranslation, setShowTranslation] = useState(true);
  const [showTransliteration, setShowTransliteration] = useState(false);

  // Audio Playback state
  const [activeVoiceMode, setActiveVoiceMode] = useState('arabic'); // 'arabic' | 'translation'
  const [continuousPlay, setContinuousPlay] = useState(true);
  const audioRef = useRef(null);

  // Surah Overview Modal state (for multi-language audio & Shamshad Ali Khan / Bengali)
  const [isOverviewModalOpen, setIsOverviewModalOpen] = useState(false);
  const [overviewLanguage, setOverviewLanguage] = useState('hindi'); // 'hindi', 'bengali', 'urdu', 'arabic'
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);

  // Bookmarks in localStorage
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const b = localStorage.getItem('quran_bookmarks');
      return b ? JSON.parse(b) : [];
    } catch {
      return [];
    }
  });

  // Tafsir Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAyahForDetail, setSelectedAyahForDetail] = useState(null);
  const [tafsirData, setTafsirData] = useState(null);
  const [loadingTafsir, setLoadingTafsir] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Track resumed ayah for smooth scrolling & visual highlight
  const [resumedAyah, setResumedAyah] = useState(null);

  // Load all Surahs on mount
  useEffect(() => {
    const loadSurahs = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchSurahs();
        setSurahs(data);
      } catch (err) {
        console.error("Failed to load surahs:", err);
        setError(err.message || "Failed to load Surahs. Please check your internet connection.");
      } finally {
        setLoading(false);
      }
    };
    loadSurahs();
  }, []);

  // Handle URL query params (?surah=NUMBER&ayah=NUMBER)
  useEffect(() => {
    const surahNum = parseInt(searchParams.get('surah'), 10);
    const ayahNum = parseInt(searchParams.get('ayah'), 10) || 1;
    const searchParam = searchParams.get('search');

    if (searchParam) {
      setSearchQuery(searchParam);
    }
    if (!surahNum || surahs.length === 0) return;

    setResumedAyah(ayahNum);

    if (selectedSurah && selectedSurah.number === surahNum) {
      // If surah is already open, scroll directly to ayah
      setTimeout(() => {
        const el = document.getElementById(`ayah-${ayahNum}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 200);
      return;
    }

    const found = surahs.find(s => s.number === surahNum);
    if (found) handleSurahClick(found, ayahNum);
  }, [surahs, searchParams]);

  // Smooth scroll to resumed ayah once surahData is rendered
  useEffect(() => {
    if (surahData && resumedAyah) {
      const timer = setTimeout(() => {
        const el = document.getElementById(`ayah-${resumedAyah}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [surahData, resumedAyah]);

  // Effect to play audio when index changes in Surah Overview modal (sequencing)
  useEffect(() => {
    if (currentAyahIndex > 0 && isOverviewModalOpen) {
      const urduAudio = document.getElementById('urdu-audio-player');
      const bengaliAudio = document.getElementById('bengali-audio-player');

      if (urduAudio && (overviewLanguage === 'urdu' || overviewLanguage === 'hindi')) {
        urduAudio.play().catch(e => console.log("Auto-play blocked", e));
      }
      if (bengaliAudio && overviewLanguage === 'bengali') {
        bengaliAudio.play().catch(e => console.log("Auto-play blocked", e));
      }
    }
  }, [currentAyahIndex, isOverviewModalOpen, overviewLanguage]);

  // Audio helper URL for Mishary Alafasy
  const getAyahAudioUrl = (surahNum, ayahNumInSurah) => {
    const s = String(surahNum).padStart(3, '0');
    const a = String(ayahNumInSurah).padStart(3, '0');
    return `https://everyayah.com/data/Alafasy_128kbps/${s}${a}.mp3`;
  };

  const formatSurahNum = (num) => String(num).padStart(3, '0');

  const handleSurahClick = async (surah, targetAyah = 1) => {
    setSelectedSurah(surah);
    setResumedAyah(targetAyah);
    setLoading(true);
    setError(null);
    setSurahInfo(null);
    try {
      const [data, info] = await Promise.all([
        fetchSurahDetails(surah.number, (enriched) => {
          setSurahData(enriched);
        }),
        fetchChapterInfo(surah.number)
      ]);
      setSurahData(data);
      setSurahInfo(info);

      // Save to last read with the exact targetAyah
      const lastReadObj = {
        surahNumber: surah.number,
        surahName: surah.englishName,
        surahArabic: surah.name,
        ayah: targetAyah,
        totalAyahs: surah.numberOfAyahs,
        juz: Math.ceil(surah.number / 4),
        page: Math.ceil(targetAyah / 10),
        progress: Math.round((targetAyah / surah.numberOfAyahs) * 100)
      };
      localStorage.setItem('quran_last_read', JSON.stringify(lastReadObj));

    } catch (err) {
      console.error("Failed to load surah details:", err);
      setError("Failed to load Surah details. Please try again.");
      setSelectedSurah(null);
    } finally {
      setLoading(false);
    }
  };

  // Autoplay ayah when navigating with ?autoplay=true (e.g. from Resume Reading)
  useEffect(() => {
    const autoplay = searchParams.get('autoplay') === 'true';
    const targetAyah = parseInt(searchParams.get('ayah'), 10) || 1;
    if (surahData && autoplay && selectedSurah) {
      const targetAyahObj = surahData.ayahs.find(a => a.numberInSurah === targetAyah) || surahData.ayahs[0];
      if (targetAyahObj) {
        playAyah({
          surahNumber: selectedSurah.number,
          surahName: selectedSurah.englishName,
          surahArabic: selectedSurah.name,
          ayahNumber: targetAyahObj.numberInSurah,
          totalAyahs: selectedSurah.numberOfAyahs,
          audioUrdu: targetAyahObj.audioUrdu,
          voiceMode: 'arabic'
        });
      }
    }
  }, [surahData, selectedSurah, searchParams]);

  const handleBack = () => {
    setSelectedSurah(null);
    setSurahData(null);
    setError(null);
  };

  // Play audio for an ayah through global audio player
  const handlePlayAyah = (ayah, forceVoice = null) => {
    const voiceMode = forceVoice || activeVoiceMode;

    if (
      globalTrack?.surahNumber === selectedSurah.number &&
      globalTrack?.ayahNumber === ayah.numberInSurah &&
      isGlobalPlaying &&
      globalTrack?.voiceMode === voiceMode
    ) {
      togglePlay();
      return;
    }

    setActiveVoiceMode(voiceMode);
    playAyah({
      surahNumber: selectedSurah.number,
      surahName: selectedSurah.englishName,
      surahArabic: selectedSurah.name,
      ayahNumber: ayah.numberInSurah,
      totalAyahs: selectedSurah.numberOfAyahs,
      audioUrdu: ayah.audioUrdu,
      voiceMode
    });
  };

  // Bookmark toggle
  const toggleBookmark = (ayah) => {
    const key = `${selectedSurah.number}:${ayah.numberInSurah}`;
    let updated;
    if (bookmarks.some(b => b.key === key)) {
      updated = bookmarks.filter(b => b.key !== key);
    } else {
      updated = [...bookmarks, {
        key,
        surahNumber: selectedSurah.number,
        surahName: selectedSurah.englishName,
        ayahNumber: ayah.numberInSurah,
        text: ayah.text.slice(0, 60),
        time: new Date().toLocaleDateString()
      }];
    }
    setBookmarks(updated);
    localStorage.setItem('quran_bookmarks', JSON.stringify(updated));
  };

  const isBookmarked = (ayahNum) => {
    if (!selectedSurah) return false;
    return bookmarks.some(b => b.key === `${selectedSurah.number}:${ayahNum}`);
  };

  // Copy Ayah
  const copyAyah = (ayah) => {
    const textToCopy = `${ayah.text}\n\n"${ayah.translation}"\n— Surah ${selectedSurah.englishName} (${selectedSurah.number}:${ayah.numberInSurah})`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(ayah.number);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Explain with AI trigger
  const handleExplainWithAI = (ayah) => {
    const prompt = `Please explain Surah ${selectedSurah.englishName} (${selectedSurah.number}), Ayah ${ayah.numberInSurah}: "${ayah.translation}". What is the deeper meaning, context of revelation (Sabab al-Nuzul), and how can I apply its wisdom in my daily life?`;
    window.dispatchEvent(new CustomEvent('open-guidance-bot', { detail: { prompt } }));
  };

  // Tafsir Modal
  const openAyahDetail = async (ayah) => {
    setSelectedAyahForDetail(ayah);
    setIsModalOpen(true);
    setLoadingTafsir(true);
    setTafsirData(null);
    try {
      if (selectedSurah) {
        const tafsir = await fetchAyahTafsir(selectedSurah.number, ayah.numberInSurah);
        setTafsirData(tafsir);
      }
    } catch (error) {
      console.error("Failed to load tafsir", error);
    } finally {
      setLoadingTafsir(false);
    }
  };

  // Filtered & Sorted Surahs
  const filteredSurahs = surahs.filter(s => {
    const matchesSearch = 
      s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.includes(searchQuery) ||
      s.englishNameTranslation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(s.number).includes(searchQuery);

    if (!matchesSearch) return false;

    if (activeFilter === 'makki') return s.revelationType === 'Meccan';
    if (activeFilter === 'madani') return s.revelationType === 'Medinan';
    if (activeFilter === 'saved') return bookmarks.some(b => b.surahNumber === s.number);

    return true;
  }).sort((a, b) => {
    if (sortBy === 'name') return a.englishName.localeCompare(b.englishName);
    if (sortBy === 'ayahs') return b.numberOfAyahs - a.numberOfAyahs;
    return a.number - b.number;
  });

  // Get active translation text
  const getAyahTranslation = (ayah) => {
    if (selectedLanguage === 'urdu') return ayah.urdu || ayah.translation;
    if (selectedLanguage === 'bengali') return ayah.bengali || ayah.translation;
    if (selectedLanguage === 'hindi') return ayah.hindi || ayah.translation;
    return ayah.translation;
  };

  // Theme wrapper styles
  const getThemeClass = () => {
    if (readerTheme === 'sepia') return 'bg-[#F4ECD8] text-[#3D2E1E]';
    if (readerTheme === 'light') return 'bg-[#FAF8F5] text-[#1E2922]';
    return 'bg-[#061610]/75 backdrop-blur-md text-[#F5F1E6]';
  };

  const getCardBg = () => {
    if (readerTheme === 'sepia') return 'bg-[#EADFCA] border-[#C5A059]/40';
    if (readerTheme === 'light') return 'bg-white border-[#C5A059]/20 shadow-sm';
    return 'bg-[#082218]/75 backdrop-blur-xl border-[#C5A059]/30';
  };

  if (loading && !selectedSurah) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#061610] text-[#F5F1E6]">
        <Loader2 className="h-12 w-12 animate-spin mb-4 text-[#C5A059]" />
        <p className="font-medium animate-pulse text-[#C5A059]">Loading Holy Quran...</p>
      </div>
    );
  }

  if (error && !selectedSurah) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#061610] text-center p-4">
        <div className="bg-[#082218] p-8 rounded-2xl shadow-xl max-w-md border border-red-500/30">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white mb-2">Failed to load Quran</h2>
          <p className="text-sm text-[#F5F1E6]/70 mb-5">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2.5 bg-[#C5A059] text-[#061610] font-bold rounded-xl hover:bg-[#F5E096] transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${selectedSurah ? getThemeClass() : 'text-[#F5F1E6]'} pb-24 transition-colors duration-300`}>
      
      {/* ─────────────────────────────────────────────────────────────
          VIEW 1: SURAH LIST (INDEX)
      ───────────────────────────────────────────────────────────── */}
      {!selectedSurah ? (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6 animate-fade-in-up">
          
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#C5A059]/20">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-[#C5A059]/15 text-[#C5A059]">
                  <BookOpen size={24} />
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold font-outfit text-white">
                  The Noble Quran (القرآن الكريم)
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-[#F5F1E6]/70 mt-1">
                Browse 114 Surahs with translation, tafsir, transliteration & audio recitation.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => navigate('/live-quran')}
                className="px-4 py-2 rounded-xl bg-[#082218]/70 backdrop-blur-md border border-[#C5A059]/40 text-[#C5A059] font-medium text-xs hover:bg-[#0c2e23] transition-colors flex items-center gap-1.5"
              >
                <span>3D Live Mushaf</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Search Bar & Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C5A059]/70" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Surah by name, Arabic, or number..."
                className="w-full bg-[#082218]/70 backdrop-blur-md border border-[#C5A059]/30 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-[#F5F1E6] placeholder-[#F5F1E6]/40 focus:outline-none focus:border-[#C5A059] shadow-inner"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#F5F1E6]/50 hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Filter Tabs & Sort */}
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              {[
                { id: 'all', label: `All (${surahs.length})` },
                { id: 'makki', label: 'Makki (86)' },
                { id: 'madani', label: 'Madani (28)' },
                { id: 'saved', label: `Bookmarks (${bookmarks.length})` }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    activeFilter === tab.id
                      ? 'bg-[#C5A059] text-[#061610] shadow-md shadow-[#C5A059]/20'
                      : 'bg-[#082218]/70 backdrop-blur-md text-[#F5F1E6]/70 border border-[#C5A059]/20 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#082218]/70 backdrop-blur-md border border-[#C5A059]/25 text-[#F5F1E6]/80 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-[#C5A059]"
              >
                <option value="number">Sort: Number</option>
                <option value="name">Sort: Name</option>
                <option value="ayahs">Sort: Ayahs</option>
              </select>
            </div>
          </div>

          {/* Surah Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSurahs.map((surah) => (
              <div
                key={surah.number}
                onClick={() => handleSurahClick(surah)}
                className="group cursor-pointer rounded-2xl bg-[#082218]/70 backdrop-blur-lg border border-[#C5A059]/25 p-4 hover:border-[#C5A059]/60 hover:bg-[#082218]/85 hover:shadow-xl hover:shadow-[#C5A059]/15 transition-all hover:-translate-y-1 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  {/* Surah Number Medallion & Title */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0F3B2A] to-[#0A261B] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] font-bold text-sm shadow-inner group-hover:scale-105 group-hover:bg-[#C5A059] group-hover:text-[#061610] transition-all">
                      {surah.number}
                    </div>
                    <div>
                      <h3 className="font-outfit font-bold text-white text-base group-hover:text-[#C5A059] transition-colors">
                        {surah.englishName}
                      </h3>
                      <p className="text-xs text-[#F5F1E6]/60">
                        {surah.englishNameTranslation}
                      </p>
                    </div>
                  </div>

                  {/* Arabic Calligraphy & Metadata */}
                  <div className="text-right">
                    <span className="font-scheherazade text-2xl text-[#C5A059] leading-tight block">
                      {surah.name}
                    </span>
                    <span className="text-[10px] text-[#F5F1E6]/50 uppercase tracking-wider font-semibold">
                      {surah.revelationType === 'Meccan' ? 'Makki' : 'Madani'} • {surah.numberOfAyahs} Ayahs
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredSurahs.length === 0 && (
            <div className="text-center py-16 text-[#F5F1E6]/60">
              <p className="text-lg">No Surahs found matching "{searchQuery}"</p>
              <button 
                onClick={() => { setSearchQuery(''); setActiveFilter('all'); }}
                className="mt-3 text-xs text-[#C5A059] underline"
              >
                Clear Filters
              </button>
            </div>
          )}

        </div>
      ) : (
        /* ─────────────────────────────────────────────────────────────
            VIEW 2: AYAH READER (READING MODE)
        ───────────────────────────────────────────────────────────── */
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 space-y-6 animate-fade-in-up">
          
          {/* Top Bar Navigation */}
          <div className="flex items-center justify-between pb-3 border-b border-[#C5A059]/20">
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#C5A059]/15 border border-[#C5A059]/30 text-xs font-semibold text-[#C5A059] hover:bg-[#C5A059]/25 transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Surah Index</span>
            </button>

            {/* Title Info */}
            <div className="text-center">
              <h2 className="font-bold text-lg font-outfit">
                {selectedSurah.englishName} ({selectedSurah.englishNameTranslation})
              </h2>
              <p className="text-[11px] opacity-70">
                Surah #{selectedSurah.number} • {selectedSurah.numberOfAyahs} Ayahs • {selectedSurah.revelationType}
              </p>
            </div>

            {/* Settings Trigger */}
            <button
              onClick={() => setSettingsOpen(true)}
              className="p-2 rounded-xl bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#C5A059] hover:bg-[#C5A059]/25 transition-colors"
              title="Reading Preferences"
            >
              <Settings2 size={18} />
            </button>
          </div>

          {/* Surah Header Card with Bismillah */}
          <div className={`rounded-3xl p-6 sm:p-8 text-center border ${getCardBg()} shadow-xl relative overflow-hidden`}>
            <div className="space-y-3">
              <span className="font-scheherazade text-4xl sm:text-5xl text-[#C5A059] block">
                سُورَةُ {selectedSurah.name}
              </span>
              <p className="text-sm font-serif opacity-80 italic">
                "{selectedSurah.englishNameTranslation}"
              </p>

              {/* Bismillah (except for Surah At-Tawbah #9) */}
              {selectedSurah.number !== 9 && (
                <div className="pt-4 border-t border-[#C5A059]/20">
                  <p className="font-scheherazade text-3xl sm:text-4xl text-[#C5A059] tracking-wider">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </p>
                  <p className="text-xs opacity-60 mt-1">
                    In the name of Allah, the Entirely Merciful, the Especially Merciful.
                  </p>
                </div>
              )}

              {/* Action Buttons: Surah Overview & Audio, Arabic Tilawat, Word-by-Word Tutor */}
              <div className="flex items-center justify-center gap-3 pt-3 flex-wrap">
                {/* 1. Surah Overview & Multi-language Audio Modal (Exact user request!) */}
                <button
                  onClick={() => {
                    setIsOverviewModalOpen(true);
                    setCurrentAyahIndex(0);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#8B6914] text-[#061610] font-bold text-xs flex items-center gap-2 hover:from-[#D4B36E] hover:to-[#C5A059] transition-all shadow-lg hover:scale-105"
                >
                  <Info size={16} />
                  <span>Surah Overview & Translation Voice</span>
                </button>

                {/* 2. Arabic Recitation */}
                <button
                  onClick={() => surahData?.ayahs?.[0] && handlePlayAyah(surahData.ayahs[0], 'arabic')}
                  className="px-4 py-2.5 rounded-xl bg-[#082218] border border-[#C5A059]/40 text-[#C5A059] font-bold text-xs flex items-center gap-1.5 hover:bg-[#0c2e23] transition-colors"
                >
                  <Play size={14} />
                  <span>Arabic Tilawat (Mishary)</span>
                </button>

                {/* 3. Word-by-Word Tutor */}
                <button
                  onClick={() => navigate(`/tutor/${selectedSurah.number}`)}
                  className="px-4 py-2.5 rounded-xl border border-[#C5A059]/40 text-[#C5A059] font-medium text-xs hover:bg-[#C5A059]/10 transition-colors flex items-center gap-1.5"
                >
                  <GraduationCap size={14} />
                  <span>Word-by-Word Tutor</span>
                </button>
              </div>
            </div>
          </div>

          {/* Ayah List */}
          {surahData && surahData.ayahs ? (
            <div className="space-y-4">
              {surahData.ayahs.map((ayah) => {
                const isCurrentlyPlaying = 
                  globalTrack?.surahNumber === selectedSurah.number && 
                  globalTrack?.ayahNumber === ayah.numberInSurah && 
                  isGlobalPlaying;
                const bookmarked = isBookmarked(ayah.numberInSurah);

                return (
                  <div
                    key={ayah.number}
                    id={`ayah-${ayah.numberInSurah}`}
                    className={`rounded-2xl p-5 sm:p-6 border transition-all ${getCardBg()} ${
                      isCurrentlyPlaying 
                        ? 'ring-2 ring-[#C5A059] shadow-lg shadow-[#C5A059]/10' 
                        : resumedAyah === ayah.numberInSurah
                        ? 'ring-2 ring-[#C5A059] bg-[#C5A059]/10 shadow-xl shadow-[#C5A059]/20'
                        : ''
                    }`}
                  >
                    {/* Top Row: Ayah Number Medallion & Action Toolbar */}
                    <div className="flex items-center justify-between pb-3 border-b border-[#C5A059]/15 mb-4">
                      {/* Medallion */}
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/40 flex items-center justify-center text-xs font-bold text-[#C5A059]">
                          {selectedSurah.number}:{ayah.numberInSurah}
                        </span>
                        {resumedAyah === ayah.numberInSurah && (
                          <span className="text-[10px] bg-[#C5A059] text-[#061610] font-bold px-2.5 py-0.5 rounded-full shadow-sm animate-pulse">
                            Resumed Reading
                          </span>
                        )}
                        {isCurrentlyPlaying && (
                          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full animate-pulse flex items-center gap-1">
                            <Volume2 size={12} />
                            {activeVoiceMode === 'translation' ? 'Urdu Voice' : 'Arabic Tilawat'}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 sm:gap-2">
                        {/* Play Arabic Audio (Mishary Alafasy) */}
                        <button
                          onClick={() => handlePlayAyah(ayah, 'arabic')}
                          className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                            isCurrentlyPlaying && activeVoiceMode === 'arabic'
                              ? 'bg-[#C5A059] text-[#061610]' 
                              : 'text-[#C5A059] hover:bg-[#C5A059]/15 border border-[#C5A059]/30'
                          }`}
                          title="Play Arabic Recitation (Mishary)"
                        >
                          {isCurrentlyPlaying && activeVoiceMode === 'arabic' ? <Pause size={14} /> : <Play size={14} />}
                          <span className="hidden sm:inline text-[11px]">Arabic</span>
                        </button>

                        {/* Play Translation Voice (Urdu/Hindi Shamshad Ali Khan) */}
                        {ayah.audioUrdu && (
                          <button
                            onClick={() => handlePlayAyah(ayah, 'translation')}
                            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                              isCurrentlyPlaying && activeVoiceMode === 'translation'
                                ? 'bg-emerald-500 text-[#061610]' 
                                : 'text-emerald-400 hover:bg-emerald-500/15 border border-emerald-500/30'
                            }`}
                            title="Play Urdu/Hindi Translation Voice (Shamshad Ali Khan)"
                          >
                            {isCurrentlyPlaying && activeVoiceMode === 'translation' ? <Pause size={14} /> : <Volume2 size={14} />}
                            <span className="hidden sm:inline text-[11px]">Urdu/Hindi</span>
                          </button>
                        )}

                        {/* Explain with AI */}
                        <button
                          onClick={() => handleExplainWithAI(ayah)}
                          className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-[#C5A059]/20 to-[#8B6914]/20 border border-[#C5A059]/35 text-[#C5A059] hover:text-[#F5E096] text-xs font-semibold flex items-center gap-1 transition-all"
                          title="Explain with Islamic Guidance AI"
                        >
                          <Sparkles size={13} className="text-[#C5A059]" />
                          <span className="hidden sm:inline">AI Explain</span>
                        </button>

                        {/* Tafsir */}
                        <button
                          onClick={() => openAyahDetail(ayah)}
                          className="p-2 rounded-lg text-[#C5A059] hover:bg-[#C5A059]/15 transition-colors"
                          title="Tafsir Al-Jalalayn"
                        >
                          <Info size={16} />
                        </button>

                        {/* Bookmark */}
                        <button
                          onClick={() => toggleBookmark(ayah)}
                          className={`p-2 rounded-lg transition-colors ${
                            bookmarked ? 'text-[#C5A059] bg-[#C5A059]/20' : 'opacity-50 hover:opacity-100 hover:text-[#C5A059]'
                          }`}
                          title="Bookmark Verse"
                        >
                          <Bookmark size={16} className={bookmarked ? 'fill-[#C5A059]' : ''} />
                        </button>

                        {/* Copy */}
                        <button
                          onClick={() => copyAyah(ayah)}
                          className="p-2 rounded-lg opacity-50 hover:opacity-100 hover:text-[#C5A059] transition-colors"
                          title="Copy Ayah text"
                        >
                          {copiedId === ayah.number ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* Arabic Text */}
                    <div className="w-full text-right mb-4">
                      <p 
                        className={`leading-[2.4] font-medium tracking-wide ${
                          arabicFont === 'amiri' ? 'font-amiri' : arabicFont === 'sans' ? 'font-sans' : 'font-scheherazade'
                        }`}
                        style={{ fontSize: `${arabicFontSize}px` }}
                        dir="rtl"
                      >
                        {ayah.text.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', '').trim() || ayah.text}
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-[#C5A059]/40 text-[#C5A059] text-xs font-bold mr-3 bg-[#C5A059]/10">
                          {ayah.numberInSurah}
                        </span>
                      </p>
                    </div>

                    {/* Roman Transliteration (optional) */}
                    {showTransliteration && ayah.roman && (
                      <p className="text-xs opacity-60 italic mb-2 font-mono">
                        {ayah.roman}
                      </p>
                    )}

                    {/* Translation */}
                    {showTranslation && (
                      <p 
                        className="leading-relaxed opacity-90 font-serif"
                        style={{ fontSize: `${translationFontSize}px` }}
                        dir={selectedLanguage === 'urdu' ? 'rtl' : 'ltr'}
                      >
                        {getAyahTranslation(ayah)}
                      </p>
                    )}

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#C5A059]" />
            </div>
          )}

        </div>
      )}



      {/* ─────────────────────────────────────────────────────────────
          SURAH OVERVIEW & MULTI-LANGUAGE AUDIO MODAL (EXACT FROM SCREENSHOT)
      ───────────────────────────────────────────────────────────── */}
      {isOverviewModalOpen && surahData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-[#082218] border-2 border-[#C5A059]/40 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto relative animate-fade-in-up text-[#F5F1E6]">
            <button 
              onClick={() => {
                setIsOverviewModalOpen(false);
                const urduAudio = document.getElementById('urdu-audio-player');
                const bengaliAudio = document.getElementById('bengali-audio-player');
                if (urduAudio) urduAudio.pause();
                if (bengaliAudio) bengaliAudio.pause();
              }} 
              className="absolute top-5 right-5 text-[#C5A059] hover:text-white"
            >
              <X size={22} />
            </button>

            <div className="p-6 sm:p-8">
              <h3 className="text-2xl font-bold font-outfit text-[#C5A059] mb-4 border-b border-[#C5A059]/20 pb-2">
                Surah Overview & Multi-Voice Audio
              </h3>

              {/* Detailed Info from Quran.com */}
              {surahInfo && (
                <div className="mb-6 p-4 bg-[#0A261B] rounded-2xl border border-[#C5A059]/25 text-xs text-[#F5F1E6]/85 leading-relaxed shadow-inner">
                  <h4 className="font-bold text-[#C5A059] mb-2 flex items-center gap-1.5 text-sm">
                    <Info size={16} /> About this Surah
                  </h4>
                  <div dangerouslySetInnerHTML={{ __html: surahInfo.short_text }} />
                </div>
              )}

              {/* Language Tabs: Hindi, Bengali, Urdu, Arabic (As shown in screenshot!) */}
              <div className="flex flex-wrap gap-2 mb-6 justify-center">
                {['hindi', 'bengali', 'urdu', 'arabic'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setOverviewLanguage(lang);
                    }}
                    className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all border ${
                      overviewLanguage === lang
                        ? 'bg-[#C5A059] text-[#061610] border-[#C5A059] shadow-md shadow-[#C5A059]/30'
                        : 'bg-transparent text-[#F5F1E6] border-[#C5A059]/30 hover:border-[#C5A059] hover:text-[#C5A059]'
                    }`}
                  >
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </button>
                ))}
              </div>

              {/* Audio Players Section */}
              <div className="mb-6 flex flex-col items-center gap-4">
                
                {/* 1. MISHARY RASHID - FULL ARABIC RECITATION */}
                <div className="w-full bg-[#061A12] p-4 rounded-2xl border border-[#C5A059]/30 flex flex-col">
                  <h4 className="text-xs font-bold text-[#C5A059] mb-2 flex items-center justify-center gap-2">
                    <PlayCircle size={16} /> Play Full Arabic Recitation (Mishary Rashid)
                  </h4>
                  <audio
                    controls
                    className="w-full h-10 accent-[#C5A059]"
                    src={`https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${formatSurahNum(surahData.number)}.mp3`}
                    preload="none"
                  >
                    Your browser does not support the audio element.
                  </audio>
                </div>

                {/* 2. URDU / HINDI - AUDIO SEQUENCE PLAYER (Shamshad Ali Khan) */}
                {(overviewLanguage === 'hindi' || overviewLanguage === 'urdu') && (
                  <div className="w-full bg-[#0A261B] p-4 rounded-2xl border border-emerald-500/30 flex flex-col">
                    <h4 className="text-xs font-bold text-emerald-400 mb-2 flex items-center justify-center gap-2">
                      <PlayCircle size={16} /> Play Urdu/Hindi Translation Voice (Shamshad Ali Khan)
                    </h4>
                    <div className="flex flex-col items-center w-full">
                      <audio
                        id="urdu-audio-player"
                        controls
                        className="w-full h-10"
                        src={surahData.ayahs[currentAyahIndex]?.audioUrdu}
                        onEnded={() => {
                          if (currentAyahIndex < surahData.ayahs.length - 1) {
                            setCurrentAyahIndex(prev => prev + 1);
                          }
                        }}
                        autoPlay={currentAyahIndex > 0}
                      >
                        Your browser does not support the audio element.
                      </audio>
                      <p className="text-[11px] text-[#C5A059] mt-2 font-medium">
                        Playing Verse {currentAyahIndex + 1} of {surahData.numberOfAyahs}
                      </p>
                    </div>
                  </div>
                )}

                {/* 3. BENGALI - FULL SURAH PLAYER (Sheikh Sudais & Toha) */}
                {overviewLanguage === 'bengali' && (
                  <div className="w-full bg-[#0A261B] p-4 rounded-2xl border border-emerald-500/30 flex flex-col">
                    <h4 className="text-xs font-bold text-emerald-400 mb-2 flex items-center justify-center gap-2">
                      <PlayCircle size={16} /> Play Bengali Recitation (Full Surah)
                    </h4>
                    <div className="flex flex-col items-center w-full">
                      <audio
                        id="bengali-audio-player"
                        controls
                        className="w-full h-10"
                        src={bengaliAudioMap[surahData.number] ? `https://archive.org/download/alquranwithbanglaaudio/${encodeURIComponent(bengaliAudioMap[surahData.number])}` : ''}
                        onError={(e) => console.log('Audio load error', e)}
                      >
                        Your browser does not support the audio element.
                      </audio>
                      <p className="text-[11px] text-[#C5A059] mt-2 font-medium">
                        Recitation by Sheikh Sudais & Toha (Bangla) - Full Surah
                      </p>
                    </div>
                  </div>
                )}

              </div>

              {/* Verses List in Selected Language */}
              <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-2 custom-scrollbar border-t border-[#C5A059]/20 pt-4">
                {surahData.ayahs.map((ayah, idx) => (
                  <div 
                    key={idx} 
                    className={`p-3 rounded-xl transition-colors border border-[#C5A059]/10 ${
                      currentAyahIndex === idx && (overviewLanguage === 'urdu' || overviewLanguage === 'hindi')
                        ? 'bg-[#C5A059]/20 border-[#C5A059]' 
                        : 'bg-[#061A12]'
                    }`}
                  >
                    <p 
                      className={`text-sm leading-relaxed ${
                        overviewLanguage === 'urdu' || overviewLanguage === 'arabic' ? 'font-amiri text-right text-lg' : 'font-serif'
                      }`} 
                      dir={overviewLanguage === 'urdu' || overviewLanguage === 'arabic' ? 'rtl' : 'ltr'}
                    >
                      <span className={`font-bold text-[#C5A059] text-xs ${overviewLanguage === 'urdu' || overviewLanguage === 'arabic' ? 'ml-2' : 'mr-2'}`}>
                        {ayah.numberInSurah}.
                      </span>
                      {overviewLanguage === 'arabic' 
                        ? (ayah.text.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', '').trim() || ayah.text)
                        : (ayah[overviewLanguage] || ayah.translation || "Translation unavailable")}
                    </p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          READING SETTINGS DRAWER / SIDEBAR
      ───────────────────────────────────────────────────────────── */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex justify-end animate-fade-in-up">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSettingsOpen(false)} />
          
          <div className="relative w-full max-w-sm h-full bg-[#082218] border-l border-[#C5A059]/30 shadow-2xl p-6 overflow-y-auto text-[#F5F1E6] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#C5A059]/20">
              <h3 className="font-outfit font-bold text-lg text-[#C5A059] flex items-center gap-2">
                <Sliders size={18} />
                Reading Preferences
              </h3>
              <button onClick={() => setSettingsOpen(false)} className="text-[#F5F1E6]/70 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Theme Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">Reading Theme</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'dark', label: 'Dark', icon: Moon, bg: 'bg-[#061610]' },
                  { id: 'sepia', label: 'Sepia', icon: BookOpen, bg: 'bg-[#F4ECD8] text-[#3D2E1E]' },
                  { id: 'light', label: 'Light', icon: Sun, bg: 'bg-[#FAF8F5] text-[#1E2922]' }
                ].map(th => (
                  <button
                    key={th.id}
                    onClick={() => setReaderTheme(th.id)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                      readerTheme === th.id 
                        ? 'border-[#C5A059] bg-[#C5A059]/20 text-[#C5A059]' 
                        : 'border-[#C5A059]/20 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <th.icon size={16} />
                    <span>{th.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Arabic Font Family */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">Arabic Calligraphy Font</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'scheherazade', label: 'Scheherazade (Mushaf)' },
                  { id: 'amiri', label: 'Amiri (Naskh)' },
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setArabicFont(f.id)}
                    className={`p-2.5 rounded-xl border text-xs text-center transition-all ${
                      arabicFont === f.id
                        ? 'border-[#C5A059] bg-[#C5A059]/20 text-[#C5A059] font-bold'
                        : 'border-[#C5A059]/20 text-[#F5F1E6]/70'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Arabic Font Size Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-[#F5F1E6]/80">Arabic Font Size</span>
                <span className="font-bold text-[#C5A059]">{arabicFontSize}px</span>
              </div>
              <input
                type="range"
                min="24"
                max="52"
                step="2"
                value={arabicFontSize}
                onChange={(e) => setArabicFontSize(Number(e.target.value))}
                className="w-full accent-[#C5A059]"
              />
            </div>

            {/* Translation Font Size Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-[#F5F1E6]/80">Translation Font Size</span>
                <span className="font-bold text-[#C5A059]">{translationFontSize}px</span>
              </div>
              <input
                type="range"
                min="13"
                max="24"
                step="1"
                value={translationFontSize}
                onChange={(e) => setTranslationFontSize(Number(e.target.value))}
                className="w-full accent-[#C5A059]"
              />
            </div>

            {/* Translation Language */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">Translation Language</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'english', label: 'English (Sahih)' },
                  { id: 'urdu', label: 'Urdu (Jalandhry)' },
                  { id: 'bengali', label: 'Bengali' },
                  { id: 'hindi', label: 'Hindi (Farooq)' }
                ].map(l => (
                  <button
                    key={l.id}
                    onClick={() => setSelectedLanguage(l.id)}
                    className={`p-2 rounded-xl border text-xs text-center transition-all ${
                      selectedLanguage === l.id
                        ? 'border-[#C5A059] bg-[#C5A059]/20 text-[#C5A059] font-bold'
                        : 'border-[#C5A059]/20 text-[#F5F1E6]/70'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggle Switches */}
            <div className="space-y-3 pt-2 border-t border-[#C5A059]/20">
              <label className="flex items-center justify-between text-xs cursor-pointer">
                <span>Show Translation</span>
                <input
                  type="checkbox"
                  checked={showTranslation}
                  onChange={(e) => setShowTranslation(e.target.checked)}
                  className="w-4 h-4 accent-[#C5A059]"
                />
              </label>

              <label className="flex items-center justify-between text-xs cursor-pointer">
                <span>Show Transliteration (Roman)</span>
                <input
                  type="checkbox"
                  checked={showTransliteration}
                  onChange={(e) => setShowTransliteration(e.target.checked)}
                  className="w-4 h-4 accent-[#C5A059]"
                />
              </label>

              <label className="flex items-center justify-between text-xs cursor-pointer">
                <span>Continuous Audio Play</span>
                <input
                  type="checkbox"
                  checked={continuousPlay}
                  onChange={(e) => setContinuousPlay(e.target.checked)}
                  className="w-4 h-4 accent-[#C5A059]"
                />
              </label>
            </div>

          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAFSIR & EXPLANATION MODAL
      ───────────────────────────────────────────────────────────── */}
      {isModalOpen && selectedAyahForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-[#082218] border border-[#C5A059]/35 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto relative animate-fade-in-up text-[#F5F1E6] p-6 sm:p-8">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-5 right-5 text-[#C5A059] hover:text-white"
            >
              <X size={22} />
            </button>

            <div className="space-y-5">
              <h3 className="text-xl font-bold font-outfit text-[#C5A059] border-b border-[#C5A059]/20 pb-3 flex items-center gap-2">
                <Info size={18} />
                Ayah Explanation • Surah {selectedSurah?.englishName} ({selectedAyahForDetail.numberInSurah})
              </h3>

              {/* Arabic Verse */}
              <div className="bg-[#051811] rounded-2xl p-5 border border-[#C5A059]/20 text-right">
                <p className="text-2xl font-scheherazade leading-loose text-white" dir="rtl">
                  {selectedAyahForDetail.text.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', '').trim() || selectedAyahForDetail.text}
                </p>
              </div>

              {/* Translation */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#C5A059]/80 mb-1">Translation</p>
                <p className="text-sm font-serif opacity-90 leading-relaxed">{selectedAyahForDetail.translation}</p>
              </div>

              {/* Tafsir */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#C5A059]/80 mb-1">Tafsir (Al-Jalalayn)</p>
                {loadingTafsir ? (
                  <div className="flex items-center text-[#C5A059] text-xs py-3">
                    <Loader2 size={16} className="animate-spin mr-2" /> Loading explanation...
                  </div>
                ) : tafsirData ? (
                  <p className="text-xs sm:text-sm text-[#F5F1E6]/80 leading-relaxed text-justify bg-[#0A261B] p-4 rounded-xl border border-[#C5A059]/15">
                    {tafsirData.text}
                  </p>
                ) : (
                  <p className="text-xs text-red-400">Explanation unavailable for this verse.</p>
                )}
              </div>

              {/* AI Guidance Link */}
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  handleExplainWithAI(selectedAyahForDetail);
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#8B6914] text-[#061610] font-bold text-xs flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform"
              >
                <Sparkles size={14} />
                <span>Ask AI Assistant More About This Verse</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

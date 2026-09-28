import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserProgress } from '../utils/userProgress';
import { getBookmarks, removeBookmark } from '../utils/bookmarkUtils';
import { shareSurahOnWhatsApp, shareAyahOnWhatsApp } from '../utils/shareUtils';
import { 
  Trophy, 
  Flame, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Calendar, 
  GraduationCap, 
  Award, 
  Star,
  Target,
  ChevronRight,
  BookA,
  LayoutGrid,
  Bookmark,
  Trash2
} from 'lucide-react';

const WhatsAppIcon = ({ size = 16, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={`shrink-0 ${className}`}
  >
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-5.805 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
  </svg>
);

export default function ProgressDashboard() {
  const navigate = useNavigate();
  const { user, openAuthModal } = useAuth();
  const userProgress = getUserProgress(user);

  // Bookmarks State & Realtime Sync
  const [bookmarks, setBookmarks] = useState(() => getBookmarks());
  const [activeBookmarkTab, setActiveBookmarkTab] = useState('all'); // 'all', 'surah', 'ayah'

  useEffect(() => {
    const handleBookmarkSync = () => {
      setBookmarks(getBookmarks());
    };
    window.addEventListener('quran_bookmarks_changed', handleBookmarkSync);
    window.addEventListener('storage', handleBookmarkSync);
    window.addEventListener('focus', handleBookmarkSync);
    return () => {
      window.removeEventListener('quran_bookmarks_changed', handleBookmarkSync);
      window.removeEventListener('storage', handleBookmarkSync);
      window.removeEventListener('focus', handleBookmarkSync);
    };
  }, []);

  const surahBookmarks = bookmarks.filter(b => b.type === 'surah');
  const ayahBookmarks = bookmarks.filter(b => b.type === 'ayah');

  const displayedBookmarks = bookmarks.filter(b => {
    if (activeBookmarkTab === 'surah') return b.type === 'surah';
    if (activeBookmarkTab === 'ayah') return b.type === 'ayah';
    return true;
  });

  const handleRemoveBookmark = (key, e) => {
    e.stopPropagation();
    const updated = removeBookmark(key);
    setBookmarks(updated);
  };

  const handleOpenBookmark = (item) => {
    if (item.type === 'surah') {
      navigate(`/quran?surah=${item.surahNumber}`);
    } else {
      navigate(`/quran?surah=${item.surahNumber}&ayah=${item.ayahNumber}`);
    }
  };

  const handleShareBookmark = (item, e) => {
    e.stopPropagation();
    if (item.type === 'surah') {
      shareSurahOnWhatsApp({
        surahNumber: item.surahNumber,
        englishName: item.surahName,
        arabicName: item.surahArabic,
        englishNameTranslation: item.englishNameTranslation,
        numberOfAyahs: item.numberOfAyahs,
        revelationType: item.revelationType
      });
    } else {
      shareAyahOnWhatsApp({
        surahNumber: item.surahNumber,
        surahName: item.surahName,
        ayahNumber: item.ayahNumber,
        arabicText: item.text,
        translation: item.translation
      });
    }
  };

  const allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()];

  const daysOfWeek = allDays.map(day => ({
    day,
    completed: (userProgress.activeDaysThisWeek || []).includes(day),
    today: day === todayName
  }));

  const badges = userProgress.badges || [];
  const unlockedBadgesCount = badges.filter(b => b.unlocked).length;

  const formatReadingTime = (minutes) => {
    if (!minutes || minutes < 1) return '0m';
    if (minutes < 60) return `${minutes}m`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  const dailyGoals = [
    {
      title: 'Read 10 Ayahs',
      subtitle: `${Math.min(userProgress.ayahsRead || 0, 10)} / 10 Ayahs`,
      done: (userProgress.ayahsRead || 0) >= 10,
      xp: '+10 XP',
      action: () => navigate('/quran')
    },
    {
      title: 'Review Vocabulary Cards',
      subtitle: `${Math.min(userProgress.vocabMastered || 0, 5)} / 5 Words`,
      done: (userProgress.vocabMastered || 0) >= 5,
      xp: '+15 XP',
      action: () => navigate('/vocabulary')
    },
    {
      title: 'Complete 1 Quiz Challenge',
      subtitle: userProgress.quizzesCompleted > 0 ? 'Quiz finished today' : 'Test Quran knowledge',
      done: (userProgress.quizzesCompleted || 0) >= 1,
      xp: '+20 XP',
      action: () => navigate('/quiz')
    },
    {
      title: 'Recite for 15 minutes',
      subtitle: `${Math.min(userProgress.readingTimeMinutes || 0, 15)} / 15 mins`,
      done: (userProgress.readingTimeMinutes || 0) >= 15,
      xp: '+15 XP',
      action: () => navigate('/live-quran')
    }
  ];

  const completedGoalsCount = dailyGoals.filter(g => g.done).length;

  return (
    <div className="min-h-screen pb-24 md:pb-12 text-[#F5F1E6]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8 animate-fade-in-up">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#C5A059]/20">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[#C5A059]/15 text-[#C5A059]">
                <Trophy size={24} />
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold font-outfit text-white">
                My Learning Progress
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#F5F1E6]/70 mt-1">
              Track your daily Quran recitation, consistency streaks, and achievements.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-[#061610]/60 border border-[#C5A059]/30">
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-[#C5A059]"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#C5A059] text-[#061610] font-bold text-xs flex items-center justify-center">
                    {(user.name || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="text-left">
                  <p className="text-xs font-semibold text-white leading-tight">{user.name}</p>
                  <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Google Cloud Synced
                  </p>
                </div>
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#061610]/80 hover:bg-[#0c2e23] border border-[#C5A059]/40 hover:border-[#C5A059] text-xs transition-all shadow-md group cursor-pointer"
                title="Sign in with Google to sync progress"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <div className="text-left">
                  <span className="font-bold text-[#F5F1E6] group-hover:text-[#C5A059] transition-colors">Sign in with Google</span>
                  <span className="block text-[10px] text-[#F5F1E6]/60">Sync your streak</span>
                </div>
              </button>
            )}

            <button
              onClick={() => navigate('/quran')}
              className="px-4 py-2.5 rounded-xl bg-[#C5A059] text-[#061610] font-bold text-xs hover:bg-[#F5E096] transition-colors flex items-center gap-1.5"
            >
              <span>Recite Now</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Streak & Consistency Hero Card */}
        <div className="rounded-3xl bg-[#082218]/80 backdrop-blur-xl border border-[#C5A059]/35 p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Streak Number */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shadow-inner">
                <Flame size={44} className="fill-orange-500 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-4xl sm:text-5xl font-extrabold text-white font-outfit">{userProgress.streak || 1}</span>
                  <span className="text-xl sm:text-2xl font-bold text-orange-400">Day{(userProgress.streak || 1) !== 1 ? 's' : ''}</span>
                </div>
                <p className="text-sm font-semibold text-[#C5A059]">Current Daily Streak</p>
                <p className="text-xs text-[#F5F1E6]/60">Your longest streak is {userProgress.longestStreak || userProgress.streak || 1} day{(userProgress.longestStreak || userProgress.streak || 1) !== 1 ? 's' : ''}. Keep reciting daily!</p>
              </div>
            </div>

            {/* Weekly Days Indicator */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-[#F5F1E6]/75">
                <Calendar size={14} className="text-[#C5A059]" />
                <span className="font-semibold">This Week's Activity</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                {daysOfWeek.map((d, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <div 
                      className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                        d.completed 
                          ? 'bg-[#C5A059] text-[#061610] shadow-md shadow-[#C5A059]/20' 
                          : d.today
                          ? 'border-2 border-[#C5A059] text-[#C5A059] bg-[#C5A059]/10 animate-pulse'
                          : 'bg-[#061A12] border border-[#C5A059]/20 text-[#F5F1E6]/40'
                      }`}
                    >
                      {d.completed ? '✓' : d.day.slice(0, 1)}
                    </div>
                    <span className={`text-[10px] ${d.today ? 'text-[#C5A059] font-bold' : 'text-[#F5F1E6]/50'}`}>
                      {d.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* 4 Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="rounded-2xl bg-[#082218]/70 backdrop-blur-md border border-[#C5A059]/25 p-5">
            <div className="w-10 h-10 rounded-xl bg-[#C5A059]/15 flex items-center justify-center text-[#C5A059] mb-3">
              <Clock size={20} />
            </div>
            <p className="text-2xl font-bold text-white">{formatReadingTime(userProgress.readingTimeMinutes)}</p>
            <p className="text-xs text-[#F5F1E6]/60 mt-0.5">Total Reading Time</p>
          </div>

          <div className="rounded-2xl bg-[#082218]/70 backdrop-blur-md border border-[#C5A059]/25 p-5">
            <div className="w-10 h-10 rounded-xl bg-[#C5A059]/15 flex items-center justify-center text-[#C5A059] mb-3">
              <BookOpen size={20} />
            </div>
            <p className="text-2xl font-bold text-white">{userProgress.ayahsRead || 0}</p>
            <p className="text-xs text-[#F5F1E6]/60 mt-0.5">Ayahs Read</p>
          </div>

          <div className="rounded-2xl bg-[#082218]/70 backdrop-blur-md border border-[#C5A059]/25 p-5">
            <div className="w-10 h-10 rounded-xl bg-[#C5A059]/15 flex items-center justify-center text-[#C5A059] mb-3">
              <Star size={20} />
            </div>
            <p className="text-2xl font-bold text-white">{userProgress.surahsCompleted || 0} Surah{(userProgress.surahsCompleted || 0) !== 1 ? 's' : ''}</p>
            <p className="text-xs text-[#F5F1E6]/60 mt-0.5">Completed Fully</p>
          </div>

          <div className="rounded-2xl bg-[#082218]/70 backdrop-blur-md border border-[#C5A059]/25 p-5">
            <div className="w-10 h-10 rounded-xl bg-[#C5A059]/15 flex items-center justify-center text-[#C5A059] mb-3">
              <GraduationCap size={20} />
            </div>
            <p className="text-2xl font-bold text-white">{userProgress.quizzesCompleted > 0 ? `${userProgress.quizAccuracy}%` : '0%'}</p>
            <p className="text-xs text-[#F5F1E6]/60 mt-0.5">{userProgress.quizzesCompleted > 0 ? `${userProgress.quizzesCompleted} Quizzes Taken` : 'No Quizzes Yet'}</p>
          </div>

        </div>

        {/* My Saved Bookmarks Section */}
        <div className="rounded-3xl bg-[#082218]/80 backdrop-blur-xl border border-[#C5A059]/30 p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Header & Filter Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#C5A059]/20">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-[#C5A059]/15 text-[#C5A059]">
                  <Bookmark size={22} className="fill-[#C5A059]" />
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-outfit text-white">
                  My Saved Bookmarks
                </h2>
              </div>
              <p className="text-xs text-[#F5F1E6]/70 mt-1">
                Your bookmarked Surahs and Ayahs for easy reference, daily recitation, and WhatsApp sharing.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 bg-[#061A12] p-1.5 rounded-2xl border border-[#C5A059]/20 self-start sm:self-auto">
              {[
                { id: 'all', label: `All (${bookmarks.length})` },
                { id: 'surah', label: `Surahs (${surahBookmarks.length})` },
                { id: 'ayah', label: `Ayahs (${ayahBookmarks.length})` }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveBookmarkTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeBookmarkTab === tab.id
                      ? 'bg-[#C5A059] text-[#061610] shadow-md shadow-[#C5A059]/20'
                      : 'text-[#F5F1E6]/60 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bookmarks Grid / Empty State */}
          {displayedBookmarks.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-2xl bg-[#051811]/60 border border-[#C5A059]/15 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-[#C5A059]/10 border border-[#C5A059]/25 flex items-center justify-center text-[#C5A059] mb-4 text-3xl">
                📖
              </div>
              <h3 className="text-base font-bold text-white mb-1">
                {bookmarks.length === 0 ? 'No Bookmarks Saved Yet' : `No ${activeBookmarkTab === 'surah' ? 'Surahs' : 'Ayahs'} Bookmarked`}
              </h3>
              <p className="text-xs text-[#F5F1E6]/60 max-w-md mx-auto mb-5">
                {bookmarks.length === 0 
                  ? 'Click the bookmark icon on any Surah card or Ayah verse while reciting the Holy Quran to save it here for instant access.'
                  : 'Switch tabs or browse the Quran to bookmark more verses and chapters.'}
              </p>
              <button
                onClick={() => navigate('/quran')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#8B6914] text-[#061610] font-bold text-xs hover:from-[#D4B36E] hover:to-[#C5A059] transition-all flex items-center gap-2 shadow-lg"
              >
                <span>Browse Holy Quran</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedBookmarks.map((item) => {
                const isSurah = item.type === 'surah';
                
                return (
                  <div
                    key={item.key || `${item.surahNumber}-${item.ayahNumber || 'surah'}`}
                    className="rounded-2xl bg-[#061A12]/80 border border-[#C5A059]/25 hover:border-[#C5A059]/55 p-4 sm:p-5 transition-all hover:bg-[#072016] flex flex-col justify-between group shadow-md"
                  >
                    {/* Top Row: Type Badge, Title, Medallion */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                          isSurah 
                            ? 'bg-[#C5A059]/15 text-[#C5A059] border-[#C5A059]/30'
                            : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        }`}>
                          {isSurah ? 'Surah Bookmark' : `Ayah ${item.surahNumber}:${item.ayahNumber}`}
                        </span>

                        <span className="text-[10px] text-[#F5F1E6]/50">
                          {item.time || 'Saved'}
                        </span>
                      </div>

                      {/* Header with Arabic */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <h4 className="font-outfit font-bold text-white text-base group-hover:text-[#C5A059] transition-colors">
                            {item.surahName || `Surah ${item.surahNumber}`}
                          </h4>
                          {isSurah && item.englishNameTranslation && (
                            <p className="text-xs text-[#F5F1E6]/60 italic font-serif">
                              "{item.englishNameTranslation}"
                            </p>
                          )}
                        </div>

                        {item.surahArabic && (
                          <span className="font-scheherazade text-2xl text-[#C5A059] leading-none shrink-0">
                            {item.surahArabic}
                          </span>
                        )}
                      </div>

                      {/* Body snippet */}
                      {isSurah ? (
                        <p className="text-xs text-[#F5F1E6]/70 mt-1">
                          {item.revelationType ? (item.revelationType === 'Meccan' ? 'Makki' : 'Madani') + ' • ' : ''}
                          {item.numberOfAyahs ? `${item.numberOfAyahs} Ayahs` : 'Full Surah'}
                        </p>
                      ) : (
                        <div className="space-y-1.5 my-2 pt-2 border-t border-[#C5A059]/10">
                          {item.text && (
                            <p className="font-scheherazade text-lg text-right text-[#F5F1E6] leading-relaxed line-clamp-2">
                              {item.text}
                            </p>
                          )}
                          {item.translation && (
                            <p className="text-xs text-[#F5F1E6]/80 italic line-clamp-2 font-serif">
                              "{item.translation}"
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="mt-4 pt-3 border-t border-[#C5A059]/15 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleOpenBookmark(item)}
                        className="flex-1 py-2 px-3 rounded-xl bg-[#C5A059]/15 hover:bg-[#C5A059] text-[#C5A059] hover:text-[#061610] font-bold text-xs transition-all flex items-center justify-center gap-1.5 group/btn"
                      >
                        <BookOpen size={14} />
                        <span>Continue Reading</span>
                        <ChevronRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
                      </button>

                      {/* WhatsApp Share */}
                      <button
                        onClick={(e) => handleShareBookmark(item, e)}
                        className="p-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 transition-colors"
                        title="Share on WhatsApp"
                      >
                        <WhatsAppIcon size={16} />
                      </button>

                      {/* Remove Bookmark */}
                      <button
                        onClick={(e) => handleRemoveBookmark(item.key, e)}
                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                        title="Remove Bookmark"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Learning Journey & Daily Checklist */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Module Progress Bars */}
          <div className="rounded-3xl bg-[#082218] border border-[#C5A059]/25 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-outfit font-bold text-lg text-white flex items-center gap-2">
                <Target size={18} className="text-[#C5A059]" />
                Learning Journey
              </h3>
              <span className="text-xs text-[#C5A059]">Active Courses</span>
            </div>

            {/* Noorani Qaida Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-[#F5F1E6] flex items-center gap-1.5">
                  <BookA size={14} className="text-[#C5A059]" /> Noorani Qaida (Tajweed)
                </span>
                <span className="text-[#C5A059] font-bold">{userProgress.qaidaLessonsCompleted || 0} / 10 Lessons ({Math.round(((userProgress.qaidaLessonsCompleted || 0) / 10) * 100)}%)</span>
              </div>
              <div className="w-full bg-[#051811] h-2.5 rounded-full overflow-hidden border border-[#C5A059]/20">
                <div 
                  className="bg-gradient-to-r from-[#C5A059] to-[#E3C578] h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, Math.round(((userProgress.qaidaLessonsCompleted || 0) / 10) * 100))}%` }} 
                />
              </div>
            </div>

            {/* Quran Reading Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-[#F5F1E6] flex items-center gap-1.5">
                  <BookOpen size={14} className="text-[#C5A059]" /> Quran Recitation
                </span>
                <span className="text-[#C5A059] font-bold">{userProgress.surahsCompleted || 0} / 114 Surahs ({Math.round(((userProgress.surahsCompleted || 0) / 114) * 100)}%)</span>
              </div>
              <div className="w-full bg-[#051811] h-2.5 rounded-full overflow-hidden border border-[#C5A059]/20">
                <div 
                  className="bg-gradient-to-r from-[#C5A059] to-[#E3C578] h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, Math.round(((userProgress.surahsCompleted || 0) / 114) * 100))}%` }} 
                />
              </div>
            </div>

            {/* Vocabulary Flashcards Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-[#F5F1E6] flex items-center gap-1.5">
                  <LayoutGrid size={14} className="text-[#C5A059]" /> 100 Common Quranic Words
                </span>
                <span className="text-[#C5A059] font-bold">{userProgress.vocabMastered || 0} / 100 Mastered ({Math.min(100, userProgress.vocabMastered || 0)}%)</span>
              </div>
              <div className="w-full bg-[#051811] h-2.5 rounded-full overflow-hidden border border-[#C5A059]/20">
                <div 
                  className="bg-gradient-to-r from-[#C5A059] to-[#E3C578] h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, userProgress.vocabMastered || 0)}%` }} 
                />
              </div>
            </div>

            {/* Live Mushaf Safa */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-[#F5F1E6] flex items-center gap-1.5">
                  <span>📖</span> Live Mushaf (604 Pages)
                </span>
                <span className="text-[#C5A059] font-bold">Page {Math.max(1, Math.min(604, Math.ceil((userProgress.ayahsRead || 1) / 10)))} / 604</span>
              </div>
              <div className="w-full bg-[#051811] h-2.5 rounded-full overflow-hidden border border-[#C5A059]/20">
                <div 
                  className="bg-gradient-to-r from-[#C5A059] to-[#E3C578] h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, Math.max(1, Math.round((Math.ceil((userProgress.ayahsRead || 1) / 10) / 604) * 100)))}%` }} 
                />
              </div>
            </div>

          </div>

          {/* Today's Daily Checklist */}
          <div className="rounded-3xl bg-[#082218] border border-[#C5A059]/25 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-outfit font-bold text-lg text-white flex items-center gap-2">
                <CheckCircle2 size={18} className="text-[#C5A059]" />
                Today's Daily Goals
              </h3>
              <span className="text-xs bg-[#C5A059]/20 text-[#C5A059] px-2 py-0.5 rounded-full font-bold">
                {completedGoalsCount} of {dailyGoals.length} Done
              </span>
            </div>

            <div className="space-y-3">
              {dailyGoals.map((g, i) => (
                <div 
                  key={i}
                  onClick={g.action}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                    g.done 
                      ? 'bg-[#0A2A1D] border-[#C5A059]/20' 
                      : 'bg-[#061A12] border-[#C5A059]/15 hover:border-[#C5A059]/40 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      g.done ? 'bg-emerald-500/20 text-emerald-400' : 'border border-[#C5A059]/40 text-transparent'
                    }`}>
                      {g.done ? '✓' : ''}
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${g.done ? 'text-white line-through text-[#F5F1E6]/60' : 'text-white'}`}>
                        {g.title}
                      </p>
                      <p className={`text-[10px] ${g.done ? 'text-[#C5A059]' : 'text-[#F5F1E6]/50'}`}>
                        {g.subtitle}
                      </p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-semibold flex items-center gap-0.5 ${g.done ? 'text-emerald-400' : 'text-[#C5A059]'}`}>
                    {g.done ? g.xp : <>Start <ChevronRight size={12} /></>}
                  </span>
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* Badges & Achievements Unlocked */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-outfit font-bold text-xl text-white flex items-center gap-2">
              <Award size={20} className="text-[#C5A059]" />
              Badges & Achievements
            </h3>
            <span className="text-xs text-[#C5A059]">{unlockedBadgesCount} of {badges.length} Unlocked</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {badges.map((b, i) => (
              <div 
                key={i}
                className={`rounded-2xl p-4 border flex flex-col items-center text-center transition-all ${
                  b.unlocked 
                    ? 'bg-[#082218] border-[#C5A059]/40 shadow-lg' 
                    : 'bg-[#04120D]/60 border-[#C5A059]/10 opacity-40'
                }`}
              >
                <div className="text-3xl mb-2">{b.icon}</div>
                <h4 className="text-sm font-bold text-white">{b.title}</h4>
                <p className="text-[11px] text-[#F5F1E6]/60 mt-1">{b.desc}</p>
                <span className={`text-[10px] mt-3 font-semibold px-2 py-0.5 rounded-full ${
                  b.unlocked ? 'bg-[#C5A059]/20 text-[#C5A059]' : 'bg-[#F5F1E6]/10 text-[#F5F1E6]/40'
                }`}>
                  {b.unlocked ? 'Unlocked' : 'Locked'}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

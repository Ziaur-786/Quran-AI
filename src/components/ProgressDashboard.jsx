import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  LayoutGrid
} from 'lucide-react';

export default function ProgressDashboard() {
  const navigate = useNavigate();

  const daysOfWeek = [
    { day: 'Mon', completed: true },
    { day: 'Tue', completed: true },
    { day: 'Wed', completed: true },
    { day: 'Thu', completed: true },
    { day: 'Fri', completed: true },
    { day: 'Sat', completed: true },
    { day: 'Sun', completed: false, today: true },
  ];

  const badges = [
    { title: 'First Surah', desc: 'Read Surah Al-Fatihah', icon: '🌟', unlocked: true },
    { title: '7-Day Streak', desc: 'Maintained 7 consecutive days', icon: '🔥', unlocked: true },
    { title: 'Vocab Novice', desc: 'Mastered 25 Arabic words', icon: '🧠', unlocked: true },
    { title: 'Quiz Ace', desc: 'Scored 100% in Quran Quiz', icon: '🎯', unlocked: true },
    { title: 'Tajweed Seeker', desc: 'Completed 5 Qaida Lessons', icon: '🔤', unlocked: true },
    { title: 'Juz 1 Completed', desc: 'Read first 20 pages', icon: '📖', unlocked: false },
    { title: 'Khatam Master', desc: 'Complete entire Quran', icon: '👑', unlocked: false },
    { title: 'Scholar Rank', desc: 'Reach 500 Quiz Points', icon: '🏆', unlocked: false },
  ];

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

          <div className="flex items-center gap-3">
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
                  <span className="text-4xl sm:text-5xl font-extrabold text-white font-outfit">7</span>
                  <span className="text-xl sm:text-2xl font-bold text-orange-400">Days</span>
                </div>
                <p className="text-sm font-semibold text-[#C5A059]">Current Daily Streak</p>
                <p className="text-xs text-[#F5F1E6]/60">Your longest streak is 14 days. Keep it alive!</p>
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
            <p className="text-2xl font-bold text-white">4h 25m</p>
            <p className="text-xs text-[#F5F1E6]/60 mt-0.5">Total Reading Time</p>
          </div>

          <div className="rounded-2xl bg-[#082218]/70 backdrop-blur-md border border-[#C5A059]/25 p-5">
            <div className="w-10 h-10 rounded-xl bg-[#C5A059]/15 flex items-center justify-center text-[#C5A059] mb-3">
              <BookOpen size={20} />
            </div>
            <p className="text-2xl font-bold text-white">142</p>
            <p className="text-xs text-[#F5F1E6]/60 mt-0.5">Ayahs Read</p>
          </div>

          <div className="rounded-2xl bg-[#082218]/70 backdrop-blur-md border border-[#C5A059]/25 p-5">
            <div className="w-10 h-10 rounded-xl bg-[#C5A059]/15 flex items-center justify-center text-[#C5A059] mb-3">
              <Star size={20} />
            </div>
            <p className="text-2xl font-bold text-white">3 Surahs</p>
            <p className="text-xs text-[#F5F1E6]/60 mt-0.5">Completed Fully</p>
          </div>

          <div className="rounded-2xl bg-[#082218]/70 backdrop-blur-md border border-[#C5A059]/25 p-5">
            <div className="w-10 h-10 rounded-xl bg-[#C5A059]/15 flex items-center justify-center text-[#C5A059] mb-3">
              <GraduationCap size={20} />
            </div>
            <p className="text-2xl font-bold text-white">88%</p>
            <p className="text-xs text-[#F5F1E6]/60 mt-0.5">Quiz Accuracy</p>
          </div>

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
                <span className="text-[#C5A059] font-bold">8 / 10 Lessons (80%)</span>
              </div>
              <div className="w-full bg-[#051811] h-2.5 rounded-full overflow-hidden border border-[#C5A059]/20">
                <div className="bg-gradient-to-r from-[#C5A059] to-[#E3C578] h-full rounded-full" style={{ width: '80%' }} />
              </div>
            </div>

            {/* Quran Reading Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-[#F5F1E6] flex items-center gap-1.5">
                  <BookOpen size={14} className="text-[#C5A059]" /> Quran Recitation
                </span>
                <span className="text-[#C5A059] font-bold">14 / 114 Surahs (12%)</span>
              </div>
              <div className="w-full bg-[#051811] h-2.5 rounded-full overflow-hidden border border-[#C5A059]/20">
                <div className="bg-gradient-to-r from-[#C5A059] to-[#E3C578] h-full rounded-full" style={{ width: '12%' }} />
              </div>
            </div>

            {/* Vocabulary Flashcards Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-[#F5F1E6] flex items-center gap-1.5">
                  <LayoutGrid size={14} className="text-[#C5A059]" /> 100 Common Quranic Words
                </span>
                <span className="text-[#C5A059] font-bold">45 / 100 Mastered (45%)</span>
              </div>
              <div className="w-full bg-[#051811] h-2.5 rounded-full overflow-hidden border border-[#C5A059]/20">
                <div className="bg-gradient-to-r from-[#C5A059] to-[#E3C578] h-full rounded-full" style={{ width: '45%' }} />
              </div>
            </div>

            {/* Live Mushaf Safa */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-[#F5F1E6] flex items-center gap-1.5">
                  <span>📖</span> Live Mushaf (604 Pages)
                </span>
                <span className="text-[#C5A059] font-bold">Page 42 / 604</span>
              </div>
              <div className="w-full bg-[#051811] h-2.5 rounded-full overflow-hidden border border-[#C5A059]/20">
                <div className="bg-gradient-to-r from-[#C5A059] to-[#E3C578] h-full rounded-full" style={{ width: '7%' }} />
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
                2 of 4 Done
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#0A2A1D] border border-[#C5A059]/20">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white line-through text-[#F5F1E6]/60">Read 10 Ayahs</p>
                    <p className="text-[10px] text-[#C5A059]">Completed: 18 / 10</p>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold">+10 XP</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#0A2A1D] border border-[#C5A059]/20">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white line-through text-[#F5F1E6]/60">Review 5 Vocabulary Cards</p>
                    <p className="text-[10px] text-[#C5A059]">Completed: 5 / 5</p>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold">+15 XP</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#061A12] border border-[#C5A059]/15 hover:border-[#C5A059]/40 cursor-pointer transition-colors"
                onClick={() => navigate('/quiz')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full border border-[#C5A059]/40 flex items-center justify-center text-xs" />
                  <div>
                    <p className="text-xs font-bold text-white">Complete 1 Quiz Challenge</p>
                    <p className="text-[10px] text-[#F5F1E6]/50">Test Quran knowledge</p>
                  </div>
                </div>
                <span className="text-[10px] text-[#C5A059] font-semibold flex items-center gap-0.5">
                  Start <ChevronRight size={12} />
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#061A12] border border-[#C5A059]/15 hover:border-[#C5A059]/40 cursor-pointer transition-colors"
                onClick={() => navigate('/live-quran')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full border border-[#C5A059]/40 flex items-center justify-center text-xs" />
                  <div>
                    <p className="text-xs font-bold text-white">Listen to Recitation for 15 mins</p>
                    <p className="text-[10px] text-[#F5F1E6]/50">Progress: 10 / 15 mins</p>
                  </div>
                </div>
                <span className="text-[10px] text-[#C5A059] font-semibold flex items-center gap-0.5">
                  Listen <ChevronRight size={12} />
                </span>
              </div>
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
            <span className="text-xs text-[#C5A059]">5 of 8 Unlocked</span>
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

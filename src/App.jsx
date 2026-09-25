import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import QuranReader from './components/QuranReader';
import QuizMode from './components/QuizMode';
import VocabularyBuilder from './components/VocabularyBuilder';
import ReadingTutor from './components/ReadingTutor';
import Qaida from './components/Qaida';
import { BookOpen, GraduationCap, LayoutGrid, BookA, Sparkles } from 'lucide-react';
import LifeGuidanceBot from './components/LifeGuidanceBot';
import LiveQuran from './components/LiveQuran';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#0F4C36] flex flex-col items-center justify-center p-6 text-[#F5F1E6] bg-islamic-pattern">
      <div className="text-center mb-12 animate-fade-in-up">
        <h1 className="text-6xl font-bold mb-4 font-amiri text-[#C5A059] drop-shadow-md">Quran AI</h1>
        <p className="text-xl text-[#F5F1E6]/80 font-serif italic">Read, Learn, and Listen with Understanding</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl w-full">
        <button
          onClick={() => navigate('/quran')}
          className="bg-[#C5A059]/10 backdrop-blur-lg hover:bg-[#C5A059]/20 p-8 rounded-2xl border border-[#C5A059]/30 flex flex-col items-center transition-all hover:scale-105 group shadow-lg"
        >
          <BookOpen className="w-12 h-12 mb-4 text-[#C5A059] group-hover:text-[#F5F1E6] transition-colors" />
          <h2 className="text-2xl font-bold text-[#C5A059]">Read Quran</h2>
          <p className="text-[#F5F1E6]/70 text-sm mt-2 font-serif">Translation, Tafsir & Summaries</p>
        </button>

        <button
          onClick={() => navigate('/qaida')}
          className="bg-[#C5A059]/10 backdrop-blur-lg hover:bg-[#C5A059]/20 p-8 rounded-2xl border border-[#C5A059]/30 flex flex-col items-center transition-all hover:scale-105 group shadow-lg"
        >
          <BookA className="w-12 h-12 mb-4 text-[#C5A059] group-hover:text-[#F5F1E6] transition-colors" />
          <h2 className="text-2xl font-bold text-[#C5A059]">Qaida (Basics)</h2>
          <p className="text-[#F5F1E6]/70 text-sm mt-2 font-serif">Learn Arabic Alphabet</p>
        </button>

        <button
          onClick={() => navigate('/quiz')}
          className="bg-[#C5A059]/10 backdrop-blur-lg hover:bg-[#C5A059]/20 p-8 rounded-2xl border border-[#C5A059]/30 flex flex-col items-center transition-all hover:scale-105 group shadow-lg"
        >
          <GraduationCap className="w-12 h-12 mb-4 text-[#C5A059] group-hover:text-[#F5F1E6] transition-colors" />
          <h2 className="text-2xl font-bold text-[#C5A059]">Quiz Mode</h2>
          <p className="text-[#F5F1E6]/70 text-sm mt-2 font-serif">Test your knowledge</p>
        </button>

        <button
          onClick={() => navigate('/vocab')}
          className="bg-[#C5A059]/10 backdrop-blur-lg hover:bg-[#C5A059]/20 p-8 rounded-2xl border border-[#C5A059]/30 flex flex-col items-center transition-all hover:scale-105 group shadow-lg"
        >
          <LayoutGrid className="w-12 h-12 mb-4 text-[#C5A059] group-hover:text-[#F5F1E6] transition-colors" />
          <h2 className="text-2xl font-bold text-[#C5A059]">Vocabulary</h2>
          <p className="text-[#F5F1E6]/70 text-sm mt-2 font-serif">Learn words flashcards</p>
        </button>

        {/* Live Quran — 3D Book */}
        <button
          onClick={() => navigate('/live-quran')}
          className="md:col-span-2 bg-gradient-to-br from-[#C5A059]/20 to-[#8B6914]/10 backdrop-blur-lg hover:from-[#C5A059]/30 hover:to-[#8B6914]/20 p-8 rounded-2xl border border-[#C5A059]/50 flex flex-col items-center transition-all hover:scale-105 group shadow-xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C5A059]/5 to-transparent animate-pulse" />
          <div className="relative flex items-center gap-3 mb-3">
            <span className="text-5xl">📖</span>
            <Sparkles className="w-6 h-6 text-[#C5A059] animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-[#C5A059] relative">Live Quran</h2>
          <p className="text-[#F5F1E6]/70 text-sm mt-2 font-serif relative">3D Book • Flip Pages • All 604 Pages • Arrow Keys</p>
        </button>
      </div>

      <p className="mt-16 text-[#C5A059]/40 text-sm font-serif">Built with ❤️ for Learning</p>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quran" element={<QuranReader />} />
        <Route path="/quiz" element={<QuizMode />} />
        <Route path="/vocab" element={<VocabularyBuilder />} />
        <Route path="/tutor/:surahId" element={<ReadingTutor />} />
        <Route path="/qaida" element={<Qaida />} />
        <Route path="/live-quran" element={<LiveQuran />} />
      </Routes>
      {/* Islamic Life Guidance Bot — visible on all pages */}
      <LifeGuidanceBot />
    </Router>
  );
}

export default App;

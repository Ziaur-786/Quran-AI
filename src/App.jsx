import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Home from './components/Home';
import QuranReader from './components/QuranReader';
import QuizMode from './components/QuizMode';
import VocabularyBuilder from './components/VocabularyBuilder';
import ReadingTutor from './components/ReadingTutor';
import Qaida from './components/Qaida';
import LiveQuran from './components/LiveQuran';
import ProgressDashboard from './components/ProgressDashboard';
import LifeGuidanceBot from './components/LifeGuidanceBot';
import GlobalAudioPlayer from './components/GlobalAudioPlayer';
import { AudioProvider } from './context/AudioContext';

function App() {
  return (
    <Router>
      <AudioProvider>
        <div className="min-h-screen bg-[#061610] flex flex-col font-sans selection:bg-[#C5A059] selection:text-[#061610] relative">
          
          {/* 1. Global Full-Page Fixed Base Islamic Mosque Background Image (All Pages) */}
          <div 
            className="fixed inset-0 w-full h-full bg-cover bg-center pointer-events-none z-0"
            style={{ 
              backgroundImage: `url('/images/hero-bg.jpg')`,
              backgroundPosition: 'center 15%'
            }}
          />
          
          {/* 2. Global Calibrated Dark Emerald Transparency Overlay */}
          <div className="fixed inset-0 bg-gradient-to-b from-[#061610]/50 via-[#061610]/70 to-[#061610]/85 pointer-events-none z-0" />
          <div className="fixed inset-0 bg-radial-vignette opacity-40 pointer-events-none z-0" />

          {/* Desktop & Tablet Top Navigation */}
          <Navbar />

          {/* Main Routed Content */}
          <main className="flex-1 relative z-10">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/quran" element={<QuranReader />} />
              <Route path="/quiz" element={<QuizMode />} />
              <Route path="/vocab" element={<VocabularyBuilder />} />
              <Route path="/qaida" element={<Qaida />} />
              <Route path="/live-quran" element={<LiveQuran />} />
              <Route path="/progress" element={<ProgressDashboard />} />
              <Route path="/tutor/:surahId" element={<ReadingTutor />} />
            </Routes>
          </main>

          {/* Persistent Global Floating Audio Player */}
          <GlobalAudioPlayer />

          {/* Mobile Bottom Navigation Bar */}
          <BottomNav />

          {/* Global Islamic Life Guidance AI Bot */}
          <LifeGuidanceBot />
        </div>
      </AudioProvider>
    </Router>
  );
}

export default App;

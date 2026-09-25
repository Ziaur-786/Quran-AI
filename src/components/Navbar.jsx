import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  GraduationCap, 
  Trophy, 
  Search, 
  Bell, 
  User, 
  Sparkles, 
  ChevronDown,
  BookA,
  LayoutGrid,
  CheckCircle2,
  X
} from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [learnDropdown, setLearnDropdown] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationOpen, setNotificationOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Quran', path: '/quran' },
    { label: 'Live Quran', path: '/live-quran' },
    { label: 'Quiz', path: '/quiz' },
    { label: 'Progress', path: '/progress' },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setShowSearchModal(false);
    navigate(`/quran?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#061610]/40 backdrop-blur-md border-none transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C5A059] to-[#8B6914] p-0.5 shadow-md flex items-center justify-center transition-transform group-hover:scale-105">
              <img src="/quran-logo.svg" alt="Quran AI" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-outfit text-xl font-bold tracking-tight text-[#C5A059] group-hover:text-[#F5E096] transition-colors leading-none">
                Quran AI
              </span>
              <span className="text-[10px] text-[#F5F1E6]/50 tracking-wider uppercase font-medium">
                Learn & Understand
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3.5 py-2 text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'text-[#F5E096] font-semibold'
                    : 'text-[#F5F1E6]/75 hover:text-[#F5F1E6]'
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-gradient-to-r from-[#C5A059] to-[#F5E096] rounded-full shadow-[0_0_8px_rgba(197,160,89,0.8)]" />
                )}
              </Link>
            ))}

            {/* Learn Dropdown (Qaida & Vocabulary) */}
            <div className="relative">
              <button
                onClick={() => setLearnDropdown(!learnDropdown)}
                onBlur={() => setTimeout(() => setLearnDropdown(false), 200)}
                className={`relative px-3.5 py-2 text-sm font-medium transition-all flex items-center gap-1 ${
                  location.pathname === '/qaida' || location.pathname === '/vocab'
                    ? 'text-[#F5E096] font-semibold'
                    : 'text-[#F5F1E6]/75 hover:text-[#F5F1E6]'
                }`}
              >
                Learn <ChevronDown size={14} className={`transition-transform ${learnDropdown ? 'rotate-180' : ''}`} />
                {(location.pathname === '/qaida' || location.pathname === '/vocab') && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-[#C5A059] rounded-full shadow-[0_0_8px_rgba(197,160,89,0.8)]" />
                )}
              </button>

              {learnDropdown && (
                <div className="absolute top-full left-0 mt-2 w-52 bg-[#0c2e23] border border-[#C5A059]/30 rounded-2xl shadow-2xl backdrop-blur-xl p-2 z-50 flex flex-col gap-1 animate-fade-in-up">
                  <Link
                    to="/qaida"
                    onClick={() => setLearnDropdown(false)}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#C5A059]/15 text-[#F5F1E6] hover:text-[#C5A059] transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059]">
                      <BookA size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold leading-tight">Learn Qaida</p>
                      <p className="text-[11px] text-[#F5F1E6]/60">Arabic Alphabet Basics</p>
                    </div>
                  </Link>

                  <Link
                    to="/vocab"
                    onClick={() => setLearnDropdown(false)}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#C5A059]/15 text-[#F5F1E6] hover:text-[#C5A059] transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059]">
                      <LayoutGrid size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold leading-tight">Vocabulary</p>
                      <p className="text-[11px] text-[#F5F1E6]/60">Spaced Repetition Cards</p>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Right Actions (Search, Notification, Profile) */}
          <div className="flex items-center gap-2.5">
            {/* Search Button */}
            <button
              onClick={() => setShowSearchModal(true)}
              className="hidden sm:flex items-center gap-2.5 bg-[#061610]/60 hover:bg-[#061610]/80 text-[#F5F1E6]/70 hover:text-[#F5F1E6] px-4 py-1.5 rounded-full border border-[#C5A059]/30 text-xs transition-all shadow-sm backdrop-blur-sm"
              title="Search Surah or Ayah"
            >
              <Search size={14} className="text-[#C5A059]" />
              <span>Search...</span>
              <kbd className="hidden lg:inline-block bg-[#061610]/80 text-[#C5A059]/80 border border-[#C5A059]/20 px-1.5 py-0.5 rounded text-[10px]">
                /
              </kbd>
            </button>

            {/* Mobile Search Icon */}
            <button
              onClick={() => setShowSearchModal(true)}
              className="sm:hidden p-2 rounded-full text-[#F5F1E6]/80 hover:text-[#C5A059] hover:bg-[#0c2e23] border border-transparent hover:border-[#C5A059]/20 transition-all"
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="p-2 rounded-full bg-[#061610]/40 text-[#F5F1E6]/80 hover:text-[#C5A059] hover:bg-[#0c2e23] border border-[#C5A059]/25 hover:border-[#C5A059]/40 transition-all relative"
                aria-label="Notifications"
              >
                <Bell size={17} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C5A059] ring-2 ring-[#061610]" />
              </button>

              {notificationOpen && (
                <div 
                  className="absolute right-0 mt-2 w-72 bg-[#0c2e23] border border-[#C5A059]/30 rounded-2xl shadow-2xl p-4 z-50 animate-fade-in-up"
                  onBlur={() => setTimeout(() => setNotificationOpen(false), 200)}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#C5A059]/20 mb-3">
                    <span className="text-xs font-bold text-[#C5A059] uppercase tracking-wider">Notifications</span>
                    <button onClick={() => setNotificationOpen(false)} className="text-[#F5F1E6]/60 hover:text-[#F5F1E6]">
                      <X size={14} />
                    </button>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-[#061610]/60 border border-[#C5A059]/15 flex items-start gap-2.5">
                      <Sparkles size={16} className="text-[#C5A059] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-[#F5F1E6]">Daily Quran Goal</p>
                        <p className="text-[#F5F1E6]/70 mt-0.5">Read 10 verses today to keep your 7-day streak active!</p>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#061610]/60 border border-[#C5A059]/15 flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-[#F5F1E6]">Quiz Challenge</p>
                        <p className="text-[#F5F1E6]/70 mt-0.5">New vocabulary flashcards unlocked in Learn mode.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar / Progress Link */}
            <Link
              to="/progress"
              className="w-8 h-8 rounded-full bg-[#061610]/40 border border-[#C5A059]/30 hover:border-[#C5A059] text-[#F5F1E6]/80 hover:text-[#C5A059] flex items-center justify-center transition-all shadow-sm"
              title="My Learning Progress"
            >
              <User size={16} />
            </Link>
          </div>

        </div>
      </header>

      {/* Global Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-fade-in-up">
          <div className="bg-[#0c2e23] border border-[#C5A059]/40 w-full max-w-lg rounded-2xl shadow-2xl p-5 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-[#C5A059]/20">
              <span className="text-sm font-bold text-[#C5A059] flex items-center gap-2">
                <Search size={16} /> Search Holy Quran
              </span>
              <button 
                onClick={() => setShowSearchModal(false)}
                className="text-[#F5F1E6]/60 hover:text-[#F5F1E6] p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="mt-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Surah name (e.g. Baqarah, Yaseen) or number (1-114)..."
                  className="w-full bg-[#061610] border border-[#C5A059]/40 rounded-xl py-3 pl-11 pr-4 text-sm text-[#F5F1E6] placeholder-[#F5F1E6]/40 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
                  autoFocus
                />
                <Search size={18} className="absolute left-3.5 top-3.5 text-[#C5A059]" />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs text-[#F5F1E6]/50 py-1">Quick Surahs:</span>
                {['Al-Fatihah (1)', 'Al-Baqarah (2)', 'Yasin (36)', 'Al-Mulk (67)', 'Al-Waqi\'ah (56)'].map((s, i) => {
                  const num = [1, 2, 36, 67, 56][i];
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setShowSearchModal(false);
                        navigate(`/quran?surah=${num}`);
                      }}
                      className="px-2.5 py-1 bg-[#061610] hover:bg-[#C5A059]/20 border border-[#C5A059]/25 hover:border-[#C5A059] rounded-lg text-xs text-[#F5F1E6]/80 hover:text-[#C5A059] transition-all"
                    >
                      {s}
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSearchModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#F5F1E6]/70 hover:text-[#F5F1E6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-[#C5A059] to-[#8B6914] text-[#061610] font-bold rounded-xl text-xs hover:brightness-110 shadow-lg"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

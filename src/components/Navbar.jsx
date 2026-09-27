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
  X,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, openAuthModal, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [learnDropdown, setLearnDropdown] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

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

            {/* Google Authentication Trigger & Profile Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-1.5 p-1 pl-1 pr-2 rounded-full bg-[#061610]/60 hover:bg-[#0c2e23] border border-[#C5A059]/40 hover:border-[#C5A059] transition-all group shadow-sm"
                  aria-label="User Account"
                >
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-[#C5A059]"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#C5A059] to-[#8B6914] text-[#061610] font-bold text-xs flex items-center justify-center">
                      {(user.name || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden sm:inline-block text-xs font-medium text-[#F5F1E6] max-w-[85px] truncate">
                    {user.given_name || user.name.split(' ')[0]}
                  </span>
                  <ChevronDown size={13} className={`text-[#C5A059] transition-transform duration-200 ${profileMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {profileMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setProfileMenuOpen(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-[#0c2e23] border border-[#C5A059]/40 rounded-2xl shadow-2xl p-4 z-50 animate-fade-in-up">
                      {/* User Header */}
                      <div className="flex items-center gap-3 pb-3 border-b border-[#C5A059]/20">
                        {user.picture ? (
                          <img
                            src={user.picture}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-[#C5A059] shrink-0"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C5A059] to-[#8B6914] text-[#061610] font-bold text-sm flex items-center justify-center shrink-0">
                            {(user.name || 'U').charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-[#F5F1E6] truncate">{user.name}</p>
                          <p className="text-[11px] text-[#F5F1E6]/60 truncate">{user.email}</p>
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Google Connected
                          </span>
                        </div>
                      </div>

                      {/* Menu Options */}
                      <div className="py-2 space-y-1">
                        <Link
                          to="/progress"
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#F5F1E6]/90 hover:text-[#C5A059] hover:bg-[#061610]/60 transition-colors"
                        >
                          <Trophy size={15} className="text-[#C5A059]" />
                          <span>My Learning Progress</span>
                        </Link>
                        <Link
                          to="/quran"
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#F5F1E6]/90 hover:text-[#C5A059] hover:bg-[#061610]/60 transition-colors"
                        >
                          <BookOpen size={15} className="text-[#C5A059]" />
                          <span>Continue Reading Quran</span>
                        </Link>
                      </div>

                      {/* Sign Out Button */}
                      <div className="pt-2 border-t border-[#C5A059]/20">
                        <button
                          onClick={() => {
                            logout();
                            setProfileMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-all cursor-pointer"
                        >
                          <LogOut size={14} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#C5A059] to-[#DFBE77] text-[#061610] text-xs font-bold shadow-md hover:shadow-[#C5A059]/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                title="Sign in with Google"
              >
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Sign In</span>
              </button>
            )}
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

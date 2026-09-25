import React from 'react';
import { useAudio } from '../context/AudioContext';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  X, 
  Volume2, 
  BookOpen, 
  ExternalLink 
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function GlobalAudioPlayer() {
  const { 
    track, 
    isPlaying, 
    isVisible, 
    togglePlay, 
    setVoiceMode, 
    nextAyah, 
    prevAyah, 
    closePlayer, 
    currentTime, 
    duration,
    seekTo 
  } = useAudio();

  const navigate = useNavigate();
  const location = useLocation();

  if (!isVisible || !track) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  const handleOpenReader = () => {
    navigate(`/quran?surah=${track.surahNumber}&ayah=${track.ayahNumber}`);
  };

  return (
    <div className="fixed bottom-16 md:bottom-5 left-3 right-3 sm:left-6 sm:right-6 max-w-2xl mx-auto z-50 animate-fade-in-up">
      <div className="bg-[#082218]/95 backdrop-blur-2xl border-2 border-[#C5A059]/40 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-[0_12px_40px_rgba(0,0,0,0.7)] text-[#F5F1E6]">
        
        {/* Progress Bar (Scrubbable) */}
        <div 
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const fraction = Math.max(0, Math.min(1, clickX / rect.width));
            seekTo(fraction);
          }}
          className="w-full bg-[#051811] h-1.5 rounded-full overflow-hidden mb-3 cursor-pointer group"
          title="Click to seek"
        >
          <div 
            className="bg-gradient-to-r from-[#C5A059] to-[#F5E096] h-full rounded-full transition-all duration-150"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Main Controls Row */}
        <div className="flex items-center justify-between gap-3">
          
          {/* Left: Play/Pause Button + Track Info */}
          <div className="flex items-center gap-3 overflow-hidden flex-1">
            <button
              onClick={togglePlay}
              className="w-11 h-11 rounded-full bg-gradient-to-br from-[#C5A059] to-[#8B6914] text-[#061610] flex items-center justify-center font-bold flex-shrink-0 shadow-lg shadow-[#C5A059]/25 hover:scale-105 active:scale-95 transition-transform"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={20} className="fill-[#061610]" /> : <Play size={20} className="fill-[#061610] ml-0.5" />}
            </button>

            <div className="truncate cursor-pointer" onClick={handleOpenReader} title="Click to view Ayah in reader">
              <div className="flex items-center gap-1.5">
                <p className="text-xs sm:text-sm font-bold text-white truncate hover:text-[#C5A059] transition-colors">
                  {track.surahName} — Ayah {track.ayahNumber}
                </p>
                <span className="text-[10px] text-[#C5A059]/70 hidden sm:inline">
                  (of {track.totalAyahs})
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-[#C5A059] flex items-center gap-1">
                  <Volume2 size={11} />
                  {track.voiceMode === 'translation' 
                    ? 'Urdu/Hindi (Shamshad Ali Khan)' 
                    : 'Arabic (Mishary Alafasy)'}
                </span>
                <span className="text-[10px] text-[#F5F1E6]/40 hidden xs:inline">
                  • {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Actions (Voice Switcher, Prev/Next, Open, Close) */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            
            {/* Voice mode toggle */}
            {track.audioUrdu && (
              <button
                onClick={() => setVoiceMode(track.voiceMode === 'arabic' ? 'translation' : 'arabic')}
                className="text-[10px] px-2.5 py-1 rounded-xl bg-[#C5A059]/20 hover:bg-[#C5A059]/30 text-[#C5A059] border border-[#C5A059]/40 font-semibold transition-all whitespace-nowrap hidden sm:inline"
                title="Switch voice track"
              >
                {track.voiceMode === 'arabic' ? 'Switch to Urdu' : 'Switch to Arabic'}
              </button>
            )}

            {/* Prev Ayah */}
            <button
              onClick={prevAyah}
              disabled={track.ayahNumber <= 1}
              className="p-2 rounded-xl text-[#F5F1E6]/70 hover:text-white hover:bg-[#0c2e23] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Previous Ayah"
            >
              <SkipBack size={16} />
            </button>

            {/* Next Ayah */}
            <button
              onClick={nextAyah}
              disabled={track.ayahNumber >= track.totalAyahs}
              className="p-2 rounded-xl text-[#F5F1E6]/70 hover:text-white hover:bg-[#0c2e23] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Next Ayah"
            >
              <SkipForward size={16} />
            </button>

            {/* Open Reader (if not already on this exact page) */}
            <button
              onClick={handleOpenReader}
              className="p-2 rounded-xl text-[#C5A059] hover:bg-[#C5A059]/15 transition-colors"
              title="Open Ayah in Reader"
            >
              <BookOpen size={16} />
            </button>

            {/* Close Button (X) */}
            <button
              onClick={closePlayer}
              className="p-2 rounded-xl text-[#F5F1E6]/50 hover:text-red-400 hover:bg-red-500/10 transition-colors ml-1"
              title="Close Player"
            >
              <X size={18} />
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

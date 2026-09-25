import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const AudioContext = createContext(null);

export function AudioProvider({ children }) {
  const audioRef = useRef(new Audio());
  
  const [track, setTrack] = useState(() => {
    try {
      const saved = localStorage.getItem('quran_last_read');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          surahNumber: parsed.surahNumber || 1,
          surahName: parsed.surahName || 'Al-Fatihah',
          surahArabic: parsed.surahArabic || 'الفاتحة',
          ayahNumber: parsed.ayah || 1,
          totalAyahs: parsed.totalAyahs || 7,
          voiceMode: 'arabic',
          audioUrdu: null
        };
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [continuous, setContinuous] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Helper to generate Mishary Alafasy audio URL
  const getArabicAudioUrl = (surahNum, ayahNum) => {
    const s = String(surahNum).padStart(3, '0');
    const a = String(ayahNum).padStart(3, '0');
    return `https://everyayah.com/data/Alafasy_128kbps/${s}${a}.mp3`;
  };

  // Setup audio event listeners on mount
  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      // Auto-advance to next ayah if continuous play is enabled
      if (continuous && track && track.ayahNumber < track.totalAyahs) {
        playAyah({
          ...track,
          ayahNumber: track.ayahNumber + 1
        });
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [track, continuous]);

  // Main play function
  const playAyah = (trackData) => {
    const audio = audioRef.current;
    const voiceMode = trackData.voiceMode || track?.voiceMode || 'arabic';
    
    let url = '';
    if (voiceMode === 'translation' && trackData.audioUrdu) {
      url = trackData.audioUrdu;
    } else {
      url = getArabicAudioUrl(trackData.surahNumber, trackData.ayahNumber);
    }

    const updatedTrack = {
      ...trackData,
      voiceMode,
      audioUrl: url
    };

    setTrack(updatedTrack);
    setIsVisible(true);

    if (audio.src !== url) {
      audio.src = url;
    }

    audio.play()
      .then(() => setIsPlaying(true))
      .catch((err) => {
        console.warn("Audio play blocked or error:", err.message);
        setIsPlaying(false);
      });

    // Save to last read
    const lastReadObj = {
      surahNumber: updatedTrack.surahNumber,
      surahName: updatedTrack.surahName,
      surahArabic: updatedTrack.surahArabic,
      ayah: updatedTrack.ayahNumber,
      totalAyahs: updatedTrack.totalAyahs,
      juz: Math.ceil(updatedTrack.surahNumber / 4),
      page: Math.ceil(updatedTrack.ayahNumber / 10),
      progress: Math.round((updatedTrack.ayahNumber / updatedTrack.totalAyahs) * 100)
    };
    localStorage.setItem('quran_last_read', JSON.stringify(lastReadObj));
  };

  // Toggle play/pause
  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      if (track) {
        audio.play().catch(() => {});
      }
    }
  };

  // Switch between Arabic recitation and Urdu/Hindi Translation Voice
  const setVoiceMode = (mode) => {
    if (!track) return;
    playAyah({
      ...track,
      voiceMode: mode
    });
  };

  // Next / Previous Ayah
  const nextAyah = () => {
    if (track && track.ayahNumber < track.totalAyahs) {
      playAyah({
        ...track,
        ayahNumber: track.ayahNumber + 1
      });
    }
  };

  const prevAyah = () => {
    if (track && track.ayahNumber > 1) {
      playAyah({
        ...track,
        ayahNumber: track.ayahNumber - 1
      });
    }
  };

  // Close player (user dismisses card)
  const closePlayer = () => {
    setIsVisible(false);
    audioRef.current.pause();
  };

  const seekTo = (fraction) => {
    const audio = audioRef.current;
    if (audio.duration) {
      audio.currentTime = fraction * audio.duration;
    }
  };

  return (
    <AudioContext.Provider
      value={{
        track,
        isPlaying,
        isVisible,
        continuous,
        setContinuous,
        currentTime,
        duration,
        playAyah,
        togglePlay,
        setVoiceMode,
        nextAyah,
        prevAyah,
        closePlayer,
        seekTo,
        setIsVisible
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}

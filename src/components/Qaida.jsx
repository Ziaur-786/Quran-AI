import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Volume2, Play, Pause, BookA, Info, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const lessons = [
  { id: 1, title: 'Single Letters (المفردات)', desc: '29 Isolated Arabic Alphabets & Makharij' },
  { id: 2, title: 'Compound Letters (المركبات)', desc: 'Joined Letters & Ligatures (لا, بل, با)' },
  { id: 3, title: 'Harakat (حركات)', desc: 'Short Vowels: Fatha (ـَ), Kasra (ـِ), Damma (ـُ)' },
  { id: 4, title: 'Tanween (تنوين)', desc: 'Double Vowels: Tanween Fatha, Kasra, Damma' },
  { id: 5, title: 'Sukoon / Jazm (سكون)', desc: 'Resting / Silent Letters (ـْ)' },
  { id: 6, title: 'Tashdeed / Shaddah (تشديد)', desc: 'Doubled & Emphasized Consonants (ـّ)' },
  { id: 7, title: 'Huroof Maddah (حروف المد)', desc: 'Elongation Letters: Alif, Waw, Ya' },
  { id: 8, title: 'Huroof Leen (حروف اللين)', desc: 'Soft Vowels: Waw & Ya with Sukoon' },
  { id: 9, title: 'Nun Sakinah & Tanween', desc: 'Rules of Izhar, Idgham, Iqlab, and Ikhfa' },
  { id: 10, title: 'Waqf & Practice Surahs', desc: 'Rules of Stopping & Short Quranic Verses' }
];

// Lesson 1 Letters with correct Arabic characters, Makhraj, and transliteration
const alphabetLetters = [
  { char: 'ا', name: 'Alif', transliteration: 'Alif', makhraj: 'Empty space in mouth and throat' },
  { char: 'ب', name: 'Ba', transliteration: 'Baa', makhraj: 'Moist part of both lips closing' },
  { char: 'ت', name: 'Ta', transliteration: 'Taa', makhraj: 'Tip of tongue touching base of top teeth' },
  { char: 'ث', name: 'Tha', transliteration: 'Thaa', makhraj: 'Tip of tongue touching edges of top teeth' },
  { char: 'ج', name: 'Jeem', transliteration: 'Jeem', makhraj: 'Middle of tongue touching roof of mouth' },
  { char: 'ح', name: 'Ha', transliteration: 'Haa (sharp)', makhraj: 'Middle of the throat' },
  { char: 'خ', name: 'Kha', transliteration: 'Khaa', makhraj: 'Top of throat closest to mouth' },
  { char: 'د', name: 'Dal', transliteration: 'Daal', makhraj: 'Tip of tongue touching base of top teeth' },
  { char: 'ذ', name: 'Thal', transliteration: 'Dhaal', makhraj: 'Tip of tongue touching edges of top teeth' },
  { char: 'ر', name: 'Ra', transliteration: 'Raa', makhraj: 'Tip of tongue vibrating against palate' },
  { char: 'ز', name: 'Zay', transliteration: 'Zaay', makhraj: 'Tip of tongue just above lower teeth' },
  { char: 'س', name: 'Seen', transliteration: 'Seen', makhraj: 'Tip of tongue close to inner surface of lower teeth' },
  { char: 'ش', name: 'Sheen', transliteration: 'Sheen', makhraj: 'Middle of tongue raised towards hard palate' },
  { char: 'ص', name: 'Sad', transliteration: 'Saad (heavy)', makhraj: 'Tip of tongue near lower teeth, back raised' },
  { char: 'ض', name: 'Dad', transliteration: 'Daad (heavy)', makhraj: 'Side of tongue against upper molars' },
  { char: 'ط', name: 'Ta', transliteration: 'Taa (heavy)', makhraj: 'Tip of tongue on gums of upper teeth' },
  { char: 'ظ', name: 'Za', transliteration: 'Zaa (heavy)', makhraj: 'Tip of tongue on edges of upper teeth' },
  { char: 'ع', name: 'Ayn', transliteration: '\'Ayn', makhraj: 'Middle of throat contracted' },
  { char: 'غ', name: 'Ghayn', transliteration: 'Ghayn', makhraj: 'Upper throat with gentle gargling tone' },
  { char: 'ف', name: 'Fa', transliteration: 'Faa', makhraj: 'Edges of top teeth touching inner lower lip' },
  { char: 'ق', name: 'Qaf', transliteration: 'Qaaf (deep)', makhraj: 'Extreme back of tongue against soft palate' },
  { char: 'ك', name: 'Kaf', transliteration: 'Kaaf', makhraj: 'Back of tongue against hard palate' },
  { char: 'ل', name: 'Lam', transliteration: 'Laam', makhraj: 'Edge of tongue touching upper gums' },
  { char: 'م', name: 'Meem', transliteration: 'Meem', makhraj: 'Dry part of both lips closing together' },
  { char: 'ن', name: 'Noon', transliteration: 'Noon', makhraj: 'Tip of tongue against upper gums with ghunnah' },
  { char: 'و', name: 'Waw', transliteration: 'Waaw', makhraj: 'Rounding of both lips' },
  { char: 'ه', name: 'Ha', transliteration: 'Haa (soft)', makhraj: 'Bottom of the throat' },
  { char: 'ء', name: 'Hamzah', transliteration: 'Hamzah', makhraj: 'Bottom of the throat (glottal stop)' },
  { char: 'ي', name: 'Ya', transliteration: 'Yaa', makhraj: 'Middle of tongue raised towards palate' },
];

// Compound letters sample for lesson 2
const compoundLetters = [
  { char: 'لا', name: 'Lam Alif', transliteration: 'Laam-Alif', makhraj: 'Ligature of Lam and Alif' },
  { char: 'با', name: 'Ba Alif', transliteration: 'Baa-Alif', makhraj: 'Ba joined to Alif' },
  { char: 'بل', name: 'Ba Lam', transliteration: 'Baa-Laam', makhraj: 'Ba joined to Lam' },
  { char: 'تا', name: 'Ta Alif', transliteration: 'Taa-Alif', makhraj: 'Ta joined to Alif' },
  { char: 'بت', name: 'Ba Ta', transliteration: 'Baa-Taa', makhraj: 'Ba joined to Ta' },
  { char: 'ثل', name: 'Tha Lam', transliteration: 'Thaa-Laam', makhraj: 'Tha joined to Lam' },
  { char: 'جا', name: 'Jeem Alif', transliteration: 'Jeem-Alif', makhraj: 'Jeem joined to Alif' },
  { char: 'تح', name: 'Ta Ha', transliteration: 'Taa-Haa', makhraj: 'Ta joined to Ha' },
  { char: 'خل', name: 'Kha Lam', transliteration: 'Khaa-Laam', makhraj: 'Kha joined to Lam' },
  { char: 'يد', name: 'Ya Dal', transliteration: 'Yaa-Daal', makhraj: 'Ya joined to Dal' },
  { char: 'نذ', name: 'Noon Thal', transliteration: 'Noon-Dhaal', makhraj: 'Noon joined to Thal' },
  { char: 'بر', name: 'Ba Ra', transliteration: 'Baa-Raa', makhraj: 'Ba joined to Ra' },
];

// Harakat letters sample for lesson 3
const harakatLetters = [
  { char: 'بَ', name: 'Ba Fatha', transliteration: 'Ba (Short A)', sound: 'Ba' },
  { char: 'بِ', name: 'Ba Kasra', transliteration: 'Bi (Short I)', sound: 'Bi' },
  { char: 'بُ', name: 'Ba Damma', transliteration: 'Bu (Short U)', sound: 'Bu' },
  { char: 'تَ', name: 'Ta Fatha', transliteration: 'Ta (Short A)', sound: 'Ta' },
  { char: 'تِ', name: 'Ta Kasra', transliteration: 'Ti (Short I)', sound: 'Ti' },
  { char: 'تُ', name: 'Ta Damma', transliteration: 'Tu (Short U)', sound: 'Tu' },
  { char: 'ثَ', name: 'Tha Fatha', transliteration: 'Tha (Short A)', sound: 'Tha' },
  { char: 'ثِ', name: 'Tha Kasra', transliteration: 'Thi (Short I)', sound: 'Thi' },
  { char: 'ثُ', name: 'Tha Damma', transliteration: 'Thu (Short U)', sound: 'Thu' },
  { char: 'جَ', name: 'Jeem Fatha', transliteration: 'Ja (Short A)', sound: 'Ja' },
  { char: 'جِ', name: 'Jeem Kasra', transliteration: 'Ji (Short I)', sound: 'Ji' },
  { char: 'جُ', name: 'Jeem Damma', transliteration: 'Ju (Short U)', sound: 'Ju' },
];

export default function Qaida() {
  const navigate = useNavigate();
  const [selectedLesson, setSelectedLesson] = useState(1);
  const [speakingChar, setSpeakingChar] = useState(null);
  const [selectedLetterInfo, setSelectedLetterInfo] = useState(alphabetLetters[0]);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const playAllIndex = useRef(0);
  const timeoutRef = useRef(null);

  const getActiveItems = () => {
    if (selectedLesson === 1) return alphabetLetters;
    if (selectedLesson === 2) return compoundLetters;
    return harakatLetters;
  };

  const playSound = (item) => {
    setSpeakingChar(item.char);
    setSelectedLetterInfo(item);

    const audioPath = `/audio/qaida/${item.name}.mp3`;
    const audio = new Audio(audioPath);

    audio.onended = () => {
      setSpeakingChar(null);
    };

    audio.onerror = () => {
      // Fallback to Web Speech API
      setSpeakingChar(null);
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(item.char);
        utterance.lang = 'ar-SA';
        utterance.rate = 0.8;
        window.speechSynthesis.speak(utterance);
      }
    };

    audio.play().catch(() => {
      setSpeakingChar(null);
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(item.char);
        utterance.lang = 'ar-SA';
        window.speechSynthesis.speak(utterance);
      }
    });
  };

  // Play All sequence
  const startPlayAll = () => {
    setIsPlayingAll(true);
    playAllIndex.current = 0;
    playNextInAll();
  };

  const stopPlayAll = () => {
    setIsPlayingAll(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setSpeakingChar(null);
  };

  const playNextInAll = () => {
    const items = getActiveItems();
    if (playAllIndex.current >= items.length) {
      setIsPlayingAll(false);
      return;
    }

    const currentItem = items[playAllIndex.current];
    playSound(currentItem);
    playAllIndex.current += 1;

    timeoutRef.current = setTimeout(() => {
      playNextInAll();
    }, 1600);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen text-[#F5F1E6] pb-24 md:pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6 animate-fade-in-up">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#C5A059]/20">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/')} 
              className="p-2 hover:bg-[#C5A059]/20 rounded-xl bg-[#082218]/70 backdrop-blur-md border border-[#C5A059]/30 text-[#C5A059] transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-outfit text-white flex items-center gap-2">
                <BookA className="text-[#C5A059]" size={28} />
                Noorani Qaida (القاعدة النورانية)
              </h1>
              <p className="text-xs sm:text-sm text-[#F5F1E6]/70 mt-0.5">
                Learn Arabic alphabet, correct pronunciation (Makharij), and Tajweed rules.
              </p>
            </div>
          </div>

          {/* Action controls */}
          <div className="flex items-center gap-2">
            {isPlayingAll ? (
              <button
                onClick={stopPlayAll}
                className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-bold flex items-center gap-1.5 hover:bg-red-500/30 transition-all"
              >
                <Pause size={14} /> Stop
              </button>
            ) : (
              <button
                onClick={startPlayAll}
                className="px-4 py-2 rounded-xl bg-[#C5A059] text-[#061610] text-xs font-bold flex items-center gap-1.5 hover:bg-[#F5E096] transition-all shadow-md"
              >
                <Play size={14} /> Play All Letters
              </button>
            )}
          </div>
        </div>

        {/* Layout: Lessons Sidebar + Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Lessons Selector (Sidebar) */}
          <div className="lg:col-span-1 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-[#C5A059] px-2 mb-2">
              10 Core Lessons
            </p>
            
            <div className="space-y-1.5 max-h-[550px] overflow-y-auto pr-1">
              {lessons.map((lesson) => {
                const isActive = selectedLesson === lesson.id;
                return (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      setSelectedLesson(lesson.id);
                      stopPlayAll();
                    }}
                    className={`w-full text-left p-3 rounded-2xl border transition-all flex items-start justify-between gap-2 ${
                      isActive 
                        ? 'bg-[#C5A059]/25 border-[#C5A059] text-white shadow-lg backdrop-blur-md' 
                        : 'bg-[#082218]/70 backdrop-blur-md border-[#C5A059]/20 text-[#F5F1E6]/70 hover:bg-[#0c2e23]/80 hover:text-white'
                    }`}
                  >
                    <div>
                      <span className={`text-[11px] font-bold block ${isActive ? 'text-[#C5A059]' : 'text-[#F5F1E6]/50'}`}>
                        Lesson {lesson.id}
                      </span>
                      <h4 className="text-xs font-bold mt-0.5">{lesson.title}</h4>
                      <p className="text-[10px] opacity-60 line-clamp-1 mt-0.5">{lesson.desc}</p>
                    </div>
                    {isActive && <ChevronRight size={16} className="text-[#C5A059] flex-shrink-0 mt-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Letters & Pronunciation Grid */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Active Letter Detail Banner */}
            {selectedLetterInfo && (
              <div className="rounded-3xl bg-[#082218]/80 backdrop-blur-xl border border-[#C5A059]/35 p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 rounded-2xl bg-[#061A12]/80 border-2 border-[#C5A059] flex items-center justify-center text-[#C5A059] font-scheherazade text-5xl shadow-inner">
                    {selectedLetterInfo.char}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold font-outfit text-white">
                        {selectedLetterInfo.name}
                      </h3>
                      <span className="text-xs bg-[#C5A059]/20 text-[#C5A059] px-2.5 py-0.5 rounded-full font-medium">
                        {selectedLetterInfo.transliteration}
                      </span>
                    </div>
                    <p className="text-xs text-[#F5F1E6]/80 mt-1 flex items-center gap-1.5">
                      <Sparkles size={13} className="text-[#C5A059]" />
                      <strong>Makhraj:</strong> {selectedLetterInfo.makhraj || 'Pronounced cleanly with Harakat'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => playSound(selectedLetterInfo)}
                  className="px-4 py-2.5 rounded-xl bg-[#C5A059] text-[#061610] font-bold text-xs flex items-center gap-2 hover:bg-[#F5E096] transition-colors shadow-md"
                >
                  <Volume2 size={16} />
                  <span>Pronounce</span>
                </button>
              </div>
            )}

            {/* Grid of Letters */}
            <div className="rounded-3xl bg-[#082218]/75 backdrop-blur-xl border border-[#C5A059]/25 p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-[#F5F1E6]/70">
                  Tap any letter card to hear audio pronunciation & view its articulation point.
                </p>
                <span className="text-xs text-[#C5A059] font-bold">
                  {getActiveItems().length} Items
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3">
                {getActiveItems().map((item, idx) => {
                  const isSpeaking = speakingChar === item.char;
                  const isSelected = selectedLetterInfo?.char === item.char;

                  return (
                    <div
                      key={idx}
                      onClick={() => playSound(item)}
                      className={`group cursor-pointer aspect-square rounded-2xl border-2 flex flex-col items-center justify-center p-2 transition-all transform hover:scale-105 active:scale-95 ${
                        isSpeaking
                          ? 'bg-[#C5A059] border-[#C5A059] text-[#061610] shadow-xl shadow-[#C5A059]/30 scale-105'
                          : isSelected
                          ? 'bg-[#0E3524] border-[#C5A059] text-[#C5A059] shadow-md'
                          : 'bg-[#061A12] border-[#C5A059]/20 hover:border-[#C5A059]/60 text-[#F5F1E6]'
                      }`}
                    >
                      <span className={`font-scheherazade text-4xl mb-1 ${isSpeaking ? 'text-[#061610]' : 'text-[#C5A059]'}`}>
                        {item.char}
                      </span>
                      <span className={`text-[10px] uppercase font-bold tracking-wider truncate w-full text-center ${
                        isSpeaking ? 'text-[#061610]' : 'text-[#F5F1E6]/60 group-hover:text-white'
                      }`}>
                        {item.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tajweed Guidance Tip */}
            <div className="p-4 rounded-2xl bg-[#0A261B] border border-[#C5A059]/20 flex items-start gap-3">
              <Info size={18} className="text-[#C5A059] flex-shrink-0 mt-0.5" />
              <div className="text-xs text-[#F5F1E6]/80 leading-relaxed">
                <strong className="text-[#C5A059]">Tajweed Tip:</strong> Ensure heavy letters (Musta'liyah: خ, ص, ض, غ, ط, ق, ظ) are pronounced with the back of the tongue raised towards the roof of the mouth for a full, bold sound.
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

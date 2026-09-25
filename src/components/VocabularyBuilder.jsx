import React, { useState } from 'react';
import { ArrowLeft, RefreshCw, Volume2, Sparkles, CheckCircle2, RotateCw, ChevronRight, Layers, LayoutGrid } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  { id: 'common', name: 'High-Frequency 100 Words', desc: 'Covers ~50% of the entire Quran' },
  { id: 'names', name: 'Divine Names of Allah', desc: 'Asma-ul-Husna & Attributes' },
  { id: 'verbs', name: 'Essential Quranic Verbs', desc: 'Action words with past & present forms' },
  { id: 'pronouns', name: 'Pronouns & Particles', desc: 'Prepositions, demonstratives & connectors' },
  { id: 'prophets', name: 'Prophets & Messengers', desc: 'Names mentioned in Quranic narratives' },
  { id: 'akhirah', name: 'Hereafter & Akhirah', desc: 'Jannah, Jahannam & the Day of Reckoning' }
];

const VOCAB_DATABASE = {
  common: [
    { arabic: 'ٱللَّه', transliteration: 'Allah', meaning: 'The One True God', occurrences: '2,699x', type: 'Proper Noun', example: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ' },
    { arabic: 'رَبّ', transliteration: 'Rabb', meaning: 'Lord, Sustainer, Cherisher', occurrences: '975x', type: 'Noun', example: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ' },
    { arabic: 'قَالَ', transliteration: 'Qaala', meaning: 'He said (to say)', occurrences: '1,618x', type: 'Verb (Past)', example: 'قَالَ إِنِّى عَبْدُ ٱللَّهِ' },
    { arabic: 'كَانَ', transliteration: 'Kaana', meaning: 'He was / to be', occurrences: '1,358x', type: 'Verb (Auxiliary)', example: 'وَكَانَ ٱللَّهُ عَلِيمًا حَكِيمًا' },
    { arabic: 'ءَامَنَ', transliteration: 'Aamana', meaning: 'He believed', occurrences: '537x', type: 'Verb', example: 'يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟' },
    { arabic: 'عَلِيم', transliteration: "'Aleem", meaning: 'All-Knowing', occurrences: '157x', type: 'Adjective', example: 'إِنَّ ٱللَّهَ بِكُلِّ شَىْءٍ عَلِيمٌ' },
    { arabic: 'أَرْض', transliteration: 'Ard', meaning: 'Earth / Land', occurrences: '461x', type: 'Noun', example: 'فِى ٱلسَّمَٰوَٰتِ وَٱلْأَرْضِ' },
    { arabic: 'سَمَاء', transliteration: 'Samaa', meaning: 'Sky / Heaven', occurrences: '381x', type: 'Noun', example: 'وَٱلسَّمَآءَ بَنَيْنَٰهَا بِأَيْي۟دٍ' },
    { arabic: 'كِتَاب', transliteration: 'Kitaab', meaning: 'Book / Scripture / Decree', occurrences: '261x', type: 'Noun', example: 'ذَٰلِكَ ٱلْكِتَٰبُ لَا رَيْبَ ۛ فِيهِ' },
    { arabic: 'يَوْم', transliteration: 'Yawm', meaning: 'Day', occurrences: '393x', type: 'Noun', example: 'مَٰلِكِ يَوْمِ ٱلدِّينِ' }
  ],
  names: [
    { arabic: 'ٱلرَّحْمَٰن', transliteration: 'Ar-Rahmaan', meaning: 'The Entirely Merciful', occurrences: '57x', type: 'Divine Name', example: 'ٱلرَّحْمَٰنُ عَلَى ٱلْعَرْشِ ٱسْتَوَىٰ' },
    { arabic: 'ٱلرَّحِيم', transliteration: 'Ar-Raheem', meaning: 'The Especially Merciful', occurrences: '115x', type: 'Divine Name', example: 'إِنَّهُۥ هُوَ ٱلتَّوَّابُ ٱلرَّحِيمُ' },
    { arabic: 'ٱلْمَلِك', transliteration: 'Al-Malik', meaning: 'The Sovereign / King', occurrences: '5x', type: 'Divine Name', example: 'فَتَعَٰلَى ٱللَّهُ ٱلْمَلِكُ ٱلْحَقُّ' },
    { arabic: 'ٱلْقُدُّوس', transliteration: 'Al-Quddoos', meaning: 'The Most Pure & Holy', occurrences: '2x', type: 'Divine Name', example: 'ٱلْمَلِكِ ٱلْقُدُّوسِ ٱلْعَزِيزِ ٱلْحَكِيمِ' },
    { arabic: 'ٱلسَّلَام', transliteration: 'As-Salaam', meaning: 'The Source of Peace & Perfection', occurrences: '1x', type: 'Divine Name', example: 'ٱلسَّلَٰمُ ٱلْمُؤْمِنُ ٱلْمُهَيْمِنُ' },
    { arabic: 'ٱلْغَفُور', transliteration: 'Al-Ghafoor', meaning: 'The All-Forgiving', occurrences: '91x', type: 'Divine Name', example: 'وَٱللَّهُ غَفُورٌ رَّحِيمٌ' }
  ],
  verbs: [
    { arabic: 'عَلِمَ', transliteration: "'Alima", meaning: 'He knew / to know', occurrences: '382x', type: 'Verb', example: 'عَلَّمَ ٱلْإِنسَٰنَ مَا لَمْ يَعْلَمْ' },
    { arabic: 'جَعَلَ', transliteration: "Ja'ala", meaning: 'He made / created', occurrences: '346x', type: 'Verb', example: 'وَجَعَلْنَا مِنَ ٱلْمَآءِ كُلَّ شَىْءٍ حَىٍّ' },
    { arabic: 'عَمِلَ', transliteration: "'Amila", meaning: 'He worked / did good deeds', occurrences: '360x', type: 'Verb', example: 'وَعَمِلُوا۟ ٱلصَّٰلِحَٰتِ' },
    { arabic: 'هَدَىٰ', transliteration: 'Hadaa', meaning: 'He guided / to guide', occurrences: '163x', type: 'Verb', example: 'ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ' }
  ],
  pronouns: [
    { arabic: 'هُوَ', transliteration: 'Huwa', meaning: 'He / It (masculine)', occurrences: '481x', type: 'Pronoun', example: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ' },
    { arabic: 'هِيَ', transliteration: 'Hiya', meaning: 'She / It (feminine)', occurrences: '64x', type: 'Pronoun', example: 'هِيَ عَصَاىَ أَتَوَكَّؤُا۟ عَلَيْهَا' },
    { arabic: 'ٱلَّذِي', transliteration: 'Alladhee', meaning: 'The one who / Which', occurrences: '334x', type: 'Relative Pronoun', example: 'ٱلَّذِى خَلَقَ ٱلْمَوْتَ وَٱلْحَيَوٰةَ' },
    { arabic: 'ٱلَّذِينَ', transliteration: 'Alladheena', meaning: 'Those who (plural)', occurrences: '1,080x', type: 'Relative Pronoun', example: 'صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ' }
  ],
  prophets: [
    { arabic: 'مُوسَىٰ', transliteration: 'Moosa', meaning: 'Moses (pbuh)', occurrences: '136x', type: 'Prophet', example: 'وَإِذْ قَالَ مُوسَىٰ لِقَوْمِهِۦ' },
    { arabic: 'إِبْرَٰهِيم', transliteration: 'Ibraheem', meaning: 'Abraham (pbuh)', occurrences: '69x', type: 'Prophet', example: 'وَإِذِ ٱبْتَلَىٰٓ إِبْرَٰهِـۧمَ رَبُّهُۥ' },
    { arabic: 'عِيسَىٰ', transliteration: "'Eesa", meaning: 'Jesus (pbuh)', occurrences: '25x', type: 'Prophet', example: 'وَءَاتَيْنَا عِيسَى ٱبْنَ مَرْيَمَ ٱلْبَيِّنَٰتِ' },
    { arabic: 'مُحَمَّد', transliteration: 'Muhammad', meaning: 'Muhammad (pbuh)', occurrences: '4x', type: 'Prophet', example: 'مُّحَمَّدٌ رَّسُولُ ٱللَّهِ' }
  ],
  akhirah: [
    { arabic: 'ٱلْجَنَّة', transliteration: 'Al-Jannah', meaning: 'Paradise / Gardens', occurrences: '66x', type: 'Noun', example: 'أُدْخِلَ ٱلْجَنَّةَ فَقَدْ فَازَ' },
    { arabic: 'ٱلنَّار', transliteration: 'An-Naar', meaning: 'The Hellfire', occurrences: '126x', type: 'Noun', example: 'فَاتَّقُوا۟ ٱلنَّارَ ٱلَّتِى وَقُودُهَا ٱلنَّاسُ' },
    { arabic: 'ٱلسَّاعَة', transliteration: 'As-Saa\'ah', meaning: 'The Final Hour', occurrences: '40x', type: 'Noun', example: 'إِنَّ ٱلسَّاعَةَ ءَاتِيَةٌ' },
    { arabic: 'ٱلْحِسَاب', transliteration: 'Al-Hisaab', meaning: 'The Reckoning / Account', occurrences: '29x', type: 'Noun', example: 'يَوْمَ يَقُومُ ٱلْحِسَابُ' }
  ]
};

export default function VocabularyBuilder() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('common');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredWords, setMasteredWords] = useState(() => {
    try {
      const saved = localStorage.getItem('quran_vocab_mastered');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const activeWords = VOCAB_DATABASE[activeCategory] || VOCAB_DATABASE.common;
  const currentWord = activeWords[currentIndex] || activeWords[0];
  const isMastered = masteredWords.includes(currentWord.arabic);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // Anki-style SRS responses
  const handleSRSResponse = (quality) => {
    if (quality === 'easy') {
      if (!masteredWords.includes(currentWord.arabic)) {
        const updated = [...masteredWords, currentWord.arabic];
        setMasteredWords(updated);
        localStorage.setItem('quran_vocab_mastered', JSON.stringify(updated));
      }
    } else if (quality === 'again') {
      if (masteredWords.includes(currentWord.arabic)) {
        const updated = masteredWords.filter(w => w !== currentWord.arabic);
        setMasteredWords(updated);
        localStorage.setItem('quran_vocab_mastered', JSON.stringify(updated));
      }
    }

    // Advance to next word
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % activeWords.length);
    }, 200);
  };

  const playPronunciation = (e) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentWord.arabic);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen text-[#F5F1E6] pb-24 md:pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6 animate-fade-in-up">
        
        {/* Header */}
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
                <LayoutGrid className="text-[#C5A059]" size={28} />
                Quranic Vocabulary (Anki SRS)
              </h1>
              <p className="text-xs sm:text-sm text-[#F5F1E6]/70 mt-0.5">
                Master 85% of Quranic words through spaced repetition memory flashcards.
              </p>
            </div>
          </div>

          {/* Mastered Counter */}
          <div className="flex items-center gap-3 bg-[#082218]/70 backdrop-blur-md border border-[#C5A059]/30 px-4 py-2 rounded-2xl">
            <CheckCircle2 size={18} className="text-emerald-400" />
            <div className="text-xs">
              <span className="font-bold text-white">{masteredWords.length}</span>
              <span className="text-[#F5F1E6]/60"> Words Mastered</span>
            </div>
          </div>
        </div>

        {/* Layout: Categories Sidebar + Flashcard Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Categories Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-[#C5A059] px-2 mb-2">
              Word Categories
            </p>
            <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setCurrentIndex(0);
                      setIsFlipped(false);
                    }}
                    className={`w-full text-left p-3 rounded-2xl border transition-all flex items-start justify-between gap-2 ${
                      isActive 
                        ? 'bg-[#C5A059]/25 border-[#C5A059] text-white shadow-lg backdrop-blur-md' 
                        : 'bg-[#082218]/70 backdrop-blur-md border-[#C5A059]/20 text-[#F5F1E6]/70 hover:bg-[#0c2e23]/80 hover:text-white'
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-bold">{cat.name}</h4>
                      <p className="text-[10px] opacity-60 line-clamp-1 mt-0.5">{cat.desc}</p>
                    </div>
                    {isActive && <ChevronRight size={16} className="text-[#C5A059] flex-shrink-0 mt-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Flashcard & Review Controls */}
          <div className="lg:col-span-3 flex flex-col items-center justify-center space-y-6">
            
            {/* Progress in Category */}
            <div className="w-full max-w-lg flex items-center justify-between text-xs text-[#F5F1E6]/70">
              <span>Word {currentIndex + 1} of {activeWords.length}</span>
              <span className="text-[#C5A059] font-bold">
                {Math.round(((currentIndex + 1) / activeWords.length) * 100)}% Through Category
              </span>
            </div>

            {/* 3D Flip Card */}
            <div 
              className="perspective-1000 w-full max-w-lg h-[340px] cursor-pointer group"
              onClick={handleFlip}
            >
              <div 
                className={`relative w-full h-full text-center transition-transform duration-500 transform-style-3d ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
              >
                {/* Front Side (Arabic Word) */}
                <div className="absolute w-full h-full backface-hidden rounded-3xl bg-gradient-to-b from-[#0B2C1F] to-[#071F15] border-2 border-[#C5A059]/40 p-8 shadow-2xl flex flex-col items-center justify-between">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[11px] font-bold text-[#C5A059] uppercase tracking-wider bg-[#C5A059]/15 px-3 py-1 rounded-full border border-[#C5A059]/30">
                      {currentWord.type}
                    </span>
                    <button 
                      onClick={playPronunciation}
                      className="p-2 rounded-full bg-[#C5A059]/20 text-[#C5A059] hover:bg-[#C5A059] hover:text-[#061610] transition-colors"
                      title="Listen Pronunciation"
                    >
                      <Volume2 size={18} />
                    </button>
                  </div>

                  {/* Arabic Word */}
                  <div className="space-y-3">
                    <h2 className="text-6xl sm:text-7xl font-scheherazade text-white tracking-wide drop-shadow-md">
                      {currentWord.arabic}
                    </h2>
                    <p className="text-sm font-mono text-[#C5A059]">
                      /{currentWord.transliteration}/
                    </p>
                  </div>

                  {/* Tap to flip hint */}
                  <div className="flex items-center gap-1.5 text-xs text-[#F5F1E6]/50">
                    <RotateCw size={13} className="text-[#C5A059]" />
                    <span>Tap card to reveal English meaning</span>
                  </div>
                </div>

                {/* Back Side (Meaning & Quranic Context) */}
                <div className="absolute w-full h-full backface-hidden rounded-3xl bg-gradient-to-b from-[#133F2E] to-[#0B2A1E] border-2 border-[#C5A059] p-8 shadow-2xl rotate-y-180 flex flex-col items-center justify-between text-[#F5F1E6]">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[11px] font-bold text-[#C5A059] uppercase tracking-wider">
                      Quran Occurrence: {currentWord.occurrences}
                    </span>
                    {isMastered && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                        Mastered
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 text-center">
                    <h3 className="text-2xl sm:text-3xl font-bold font-outfit text-[#C5A059]">
                      {currentWord.meaning}
                    </h3>
                    <p className="text-xs text-[#F5F1E6]/70 italic font-serif">
                      "{currentWord.transliteration}"
                    </p>

                    {/* Example Ayah */}
                    {currentWord.example && (
                      <div className="pt-2 border-t border-[#C5A059]/20">
                        <p className="text-[10px] text-[#C5A059] uppercase font-bold tracking-wider mb-1">Example in Quran:</p>
                        <p className="font-scheherazade text-lg text-white" dir="rtl">
                          {currentWord.example}
                        </p>
                      </div>
                    )}
                  </div>

                  <p className="text-[11px] text-[#F5F1E6]/50">
                    Rate how well you knew this word below:
                  </p>
                </div>
              </div>
            </div>

            {/* Anki-style SRS Response Buttons */}
            <div className="w-full max-w-lg grid grid-cols-3 gap-3">
              <button
                onClick={() => handleSRSResponse('again')}
                className="py-3 px-2 rounded-2xl bg-red-500/15 border border-red-500/30 hover:bg-red-500/25 text-red-400 font-bold text-xs flex flex-col items-center gap-0.5 transition-all active:scale-95"
              >
                <span>Again</span>
                <span className="text-[10px] font-normal opacity-70">&lt; 1 Day</span>
              </button>

              <button
                onClick={() => handleSRSResponse('good')}
                className="py-3 px-2 rounded-2xl bg-yellow-500/15 border border-yellow-500/30 hover:bg-yellow-500/25 text-yellow-400 font-bold text-xs flex flex-col items-center gap-0.5 transition-all active:scale-95"
              >
                <span>Good</span>
                <span className="text-[10px] font-normal opacity-70">3 Days</span>
              </button>

              <button
                onClick={() => handleSRSResponse('easy')}
                className="py-3 px-2 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 hover:bg-emerald-500/25 text-emerald-400 font-bold text-xs flex flex-col items-center gap-0.5 transition-all active:scale-95"
              >
                <span>Easy</span>
                <span className="text-[10px] font-normal opacity-70">7 Days</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

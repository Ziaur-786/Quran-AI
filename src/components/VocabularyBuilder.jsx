import React, { useState } from 'react';
import { ArrowLeft, RefreshCw, Volume2 } from 'lucide-react';
import { Link } from 'react-router-dom';

// Simple mock data for vocabulary. In a real app, this would come from an API.
const VOCAB_LIST = [
    { arabic: 'ٱللَّهِ', transliteration: 'Allah', meaning: 'God' },
    { arabic: 'رَحْمَٰن', transliteration: 'Rahman', meaning: 'The Most Gracious' },
    { arabic: 'رَحِيم', transliteration: 'Raheem', meaning: 'The Most Merciful' },
    { arabic: 'ٱلْحَمْدُ', transliteration: 'Al-Hamd', meaning: 'All Praise' },
    { arabic: 'رَبِّ', transliteration: 'Rabb', meaning: 'Lordt' },
    { arabic: 'عَالَمِين', transliteration: 'Alameen', meaning: 'Worlds/Universe' },
    { arabic: 'مَٰلِكِ', transliteration: 'Malik', meaning: 'Master/Owner' },
    { arabic: 'يَوْمِ', transliteration: 'Yawm', meaning: 'Day' },
    { arabic: 'ٱلدِّينِ', transliteration: 'Deen', meaning: 'Judgment/Religion' },
    { arabic: 'صِرَٰطَ', transliteration: 'Sirat', meaning: 'Path' },
    { arabic: 'مُسْتَقِيم', transliteration: 'Mustaqeem', meaning: 'Straight' },
    { arabic: 'سَمَاوَات', transliteration: 'Samawat', meaning: 'Heavens/Skies' },
    { arabic: 'أَرْض', transliteration: 'Ard', meaning: 'Earth' },
    { arabic: 'كِتَٰب', transliteration: 'Kitab', meaning: 'Book' },
    { arabic: 'رَسُول', transliteration: 'Rasool', meaning: 'Messenger' }
];

const VocabularyBuilder = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const currentWord = VOCAB_LIST[currentIndex];

    const handleNext = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % VOCAB_LIST.length);
        }, 200);
    };

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        <div className="min-h-screen bg-[#F5F1E6] p-4 font-sans flex flex-col items-center bg-islamic-pattern">
            <div className="w-full max-w-md">
                <div className="flex justify-between items-center mb-8">
                    <Link to="/" className="flex items-center text-[#0F4C36] font-medium hover:text-[#C5A059] transition-colors">
                        <ArrowLeft className="w-5 h-5 mr-1" /> Home
                    </Link>
                    <h1 className="text-xl font-bold text-[#0F4C36] font-amiri">Vocabulary</h1>
                </div>

                <div className="perspective-1000 w-full h-96 cursor-pointer group" onClick={handleFlip}>
                    <div className={`relative w-full h-full text-center transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>

                        {/* Front Side (Arabic) */}
                        <div className="absolute w-full h-full backface-hidden bg-white rounded-2xl shadow-xl border-b-4 border-[#0F4C36] flex flex-col items-center justify-center p-8 border-l border-r border-t border-[#C5A059]/20">
                            <span className="text-xs font-bold text-[#C5A059] uppercase tracking-widest mb-4">Tap to reveal meaning</span>
                            <h2 className="text-7xl font-amiri text-[#0F4C36] mb-4">{currentWord.arabic}</h2>
                            <p className="text-xl text-gray-400 font-serif italic">{currentWord.transliteration}</p>
                            <div className="absolute bottom-8 text-[#0F4C36]">
                                <Volume2 className="w-6 h-6 mx-auto mb-1 opacity-50" />
                            </div>
                        </div>

                        {/* Back Side (Meaning) */}
                        <div className="absolute w-full h-full backface-hidden bg-[#0F4C36] rounded-2xl shadow-xl rotate-y-180 flex flex-col items-center justify-center p-8 text-[#F5F1E6] border-4 border-[#C5A059]">
                            <h3 className="text-3xl font-bold mb-2 text-[#C5A059]">{currentWord.meaning}</h3>
                            <p className="text-[#F5F1E6] text-lg opacity-80">{currentWord.transliteration}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-center">
                    <button
                        onClick={(e) => { e.stopPropagation(); handleNext(); }}
                        className="flex items-center px-6 py-3 bg-[#0F4C36] text-[#C5A059] border border-[#C5A059] rounded-full font-bold shadow-md hover:bg-[#093022] transition-colors"
                    >
                        <RefreshCw className="w-5 h-5 mr-2" /> Next Word
                    </button>
                </div>

                <p className="text-center text-gray-400 text-sm mt-8">
                    Word {currentIndex + 1} of {VOCAB_LIST.length}
                </p>
            </div>
        </div>
    );
};

export default VocabularyBuilder;

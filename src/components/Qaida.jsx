import React, { useState } from 'react';
import { ArrowLeft, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const letters = [
    { char: 'ا', name: 'Alif', transliteration: 'Alif' },
    { char: 'ب', name: 'Ba', transliteration: 'Ba' },
    { char: 'ت', name: 'Ta', transliteration: 'Ta' },
    { char: 'ث', name: 'Tha', transliteration: 'Tha' },
    { char: 'ج', name: 'Jeem', transliteration: 'Jeem' },
    { char: 'ح', name: 'Ha', transliteration: 'Ha' },
    { char: 'خ', name: 'Kha', transliteration: 'Kha' },
    { char: 'د', name: 'Dal', transliteration: 'Dal' },
    { char: 'ذ', name: 'Thal', transliteration: 'Thal' },
    { char: 'ر', name: 'Ra', transliteration: 'Ra' },
    { char: 'ز', name: 'Zay', transliteration: 'Zay' },
    { char: 'س', name: 'Seen', transliteration: 'Seen' },
    { char: 'ش', name: 'Sheen', transliteration: 'Sheen' },
    { char: 'ص', name: 'Sad', transliteration: 'Sad' },
    { char: 'ض', name: 'Dad', transliteration: 'Dad' },
    { char: 'ط', name: 'Ta', transliteration: 'Ta' },
    { char: 'ظ', name: 'Za', transliteration: 'Za' },
    { char: 'ع', name: 'Ayn', transliteration: 'Ayn' },
    { char: 'غ', name: 'Ghayn', transliteration: 'Ghayn' },
    { char: 'ف', name: 'Fa', transliteration: 'Fa' },
    { char: 'ق', name: 'Qaf', transliteration: 'Qaf' },
    { char: 'ك', name: 'Kaf', transliteration: 'Kaf' },
    { char: 'ل', name: 'Lam', transliteration: 'Lam' },
    { char: 'm', name: 'Meem', transliteration: 'Meem' },
    { char: 'ن', name: 'Noon', transliteration: 'Noon' },
    { char: 'ه', name: 'Ha', transliteration: 'Ha' },
    { char: 'و', name: 'Waw', transliteration: 'Waw' },
    { char: 'ي', name: 'Ya', transliteration: 'Ya' },
];

const Qaida = () => {
    const navigate = useNavigate();
    const [speakingChar, setSpeakingChar] = useState(null);

    const playSound = (char, name) => {
        setSpeakingChar(char);
        const audio = new Audio(`/audio/qaida/${name}.mp3`);
        audio.onended = () => setSpeakingChar(null);
        audio.onerror = (e) => {
            console.error("Audio failed to load", e);
            setSpeakingChar(null);
            // Fallback to browser TTS if file missing
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(char);
                utterance.lang = 'ar-SA';
                window.speechSynthesis.speak(utterance);
            }
        };
        audio.play().catch(e => console.error("Play failed", e));
    };

    return (
        <div className="min-h-screen bg-[#F5F1E6] p-6 pb-20 bg-islamic-pattern">
            <header className="mb-8 flex items-center">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-[#C5A059]/20 rounded-full mr-4 bg-white shadow-sm border border-[#C5A059]/30">
                    <ArrowLeft className="w-6 h-6 text-[#0F4C36]" />
                </button>
                <h1 className="text-3xl font-bold text-[#0F4C36] font-amiri">Qaida (Learn Arabic)</h1>
            </header>

            <div className="bg-white p-8 rounded-3xl shadow-lg max-w-5xl mx-auto border border-[#C5A059]/30">
                <p className="text-center text-gray-500 mb-8 font-serif">Click on a letter to hear its pronunciation</p>
                <div className="grid grid-cols-4 md:grid-cols-7 gap-4">
                    {letters.map((l) => (
                        <div
                            key={l.name}
                            onClick={() => playSound(l.char, l.name)}
                            className={`aspect-square flex flex-col items-center justify-center rounded-2xl border-2 cursor-pointer transition-all transform hover:scale-105 active:scale-95 ${speakingChar === l.char
                                ? 'bg-[#0F4C36] border-[#0F4C36] text-[#C5A059] shadow-lg'
                                : 'bg-[#FDFBF7] border-[#C5A059]/20 hover:border-[#C5A059] text-[#0F4C36] hover:bg-[#C5A059]/10'
                                }`}
                        >
                            <span className="text-5xl font-amiri mb-2">{l.char}</span>
                            <span className={`text-xs uppercase font-bold tracking-wider ${speakingChar === l.char ? 'text-[#C5A059]' : 'text-gray-400'}`}>
                                {l.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Qaida;

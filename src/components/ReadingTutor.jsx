import React, { useState, useEffect } from 'react';
import { fetchVersesWithWords } from '../services/quranComApi';
import { Play, Pause, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const ReadingTutor = () => {
    const { surahId } = useParams();
    const navigate = useNavigate();
    const [verses, setVerses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [playingWordUrl, setPlayingWordUrl] = useState(null);
    const [audio] = useState(new Audio());

    useEffect(() => {
        const loadVerses = async () => {
            if (!surahId) return;
            setLoading(true);
            try {
                const data = await fetchVersesWithWords(surahId);
                setVerses(data);
            } catch (error) {
                console.error("Failed to load verses", error);
            } finally {
                setLoading(false);
            }
        };
        loadVerses();
    }, [surahId]);

    const playWord = (url) => {
        if (!url) return;
        if (playingWordUrl === url) {
            audio.pause();
            setPlayingWordUrl(null);
        } else {
            setPlayingWordUrl(url);
            audio.src = `https://verses.quran.com/${url}`; // Quran.com audio base URL
            audio.play();
            audio.onended = () => setPlayingWordUrl(null);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#F5F1E6] text-[#0F4C36]">
                <Loader2 className="h-10 w-10 animate-spin text-[#C5A059]" />
                <span className="ml-2">Loading Lesson...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F5F1E6] p-4 pb-20 bg-islamic-pattern">
            <header className="mb-6 flex items-center">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-[#C5A059]/20 rounded-full mr-4 border border-[#C5A059]/30 bg-white shadow-sm">
                    <ArrowLeft className="w-6 h-6 text-[#0F4C36]" />
                </button>
                <h1 className="text-2xl font-bold text-[#0F4C36] font-amiri">Reading Tutor (Word-by-Word)</h1>
            </header>

            <div className="space-y-6 max-w-4xl mx-auto">
                {verses.map((verse) => (
                    <div key={verse.id} className="bg-white p-6 rounded-xl shadow-sm border border-[#C5A059]/30">
                        <div className="flex flex-wrap flex-row-reverse gap-3 justify-start items-end mb-4">
                            {verse.words.map((word, idx) => (
                                <div
                                    key={`${verse.id}-${idx}`}
                                    className={`cursor-pointer p-2 rounded-lg transition-all text-center group ${playingWordUrl === word.audio_url ? 'bg-[#0F4C36] ring-2 ring-[#C5A059] text-[#C5A059]' : 'hover:bg-[#C5A059]/10'}`}
                                    onClick={() => playWord(word.audio_url)}
                                >
                                    <p className={`text-3xl font-amiri mb-1 group-hover:text-[#0F4C36] ${playingWordUrl === word.audio_url ? 'text-[#C5A059]' : 'text-gray-800'}`}>
                                        {word.text_uthmani}
                                    </p>
                                    <p className={`text-xs ${playingWordUrl === word.audio_url ? 'text-[#F5F1E6]' : 'text-gray-400'}`}>{word.transliteration?.text}</p>
                                </div>
                            ))}
                        </div>
                        <div className="text-left border-t border-[#C5A059]/20 pt-3">
                            <span className="text-xs font-bold text-[#0F4C36] bg-[#C5A059]/10 px-2 py-1 rounded border border-[#C5A059]/20">
                                Verse {verse.verse_key}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReadingTutor;

import React, { useState, useEffect } from 'react';
import { fetchSurahs, fetchSurahDetails, fetchAyahTafsir } from '../services/quranApi';
import { fetchChapterInfo } from '../services/quranComApi';
import { bengaliAudioMap } from '../data/bengaliAudioMap';
import { BookOpen, ChevronRight, Loader2, Info, X, AlertCircle, PlayCircle, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuranReader = () => {
    const [surahs, setSurahs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSurah, setSelectedSurah] = useState(null);
    const [surahData, setSurahData] = useState(null);
    const [surahInfo, setSurahInfo] = useState(null);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAyahForDetail, setSelectedAyahForDetail] = useState(null);
    const [tafsirData, setTafsirData] = useState(null);
    const [loadingTafsir, setLoadingTafsir] = useState(false);

    // Overview Modal state
    const [isOverviewModalOpen, setIsOverviewModalOpen] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('hindi'); // hindi, bengali, urdu, arabic
    const [currentAyahIndex, setCurrentAyahIndex] = useState(0);

    // Voice State Removed

    const navigate = useNavigate();

    useEffect(() => {
        const loadSurahs = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchSurahs();
                setSurahs(data);
            } catch (err) {
                console.error("Failed to load surahs:", err);
                setError(err.message || "Failed to load Surahs. Please check your internet connection.");
            } finally {
                setLoading(false);
            }
        };
        loadSurahs();
    }, []);

    // Effect to play audio when index changes (sequencing)
    useEffect(() => {
        if (currentAyahIndex > 0 && isOverviewModalOpen) {
            const urduAudio = document.getElementById('urdu-audio-player');
            const bengaliAudio = document.getElementById('bengali-audio-player');

            if (urduAudio && (selectedLanguage === 'urdu' || selectedLanguage === 'hindi')) {
                urduAudio.play().catch(e => console.log("Auto-play blocked", e));
            }
            if (bengaliAudio && selectedLanguage === 'bengali') {
                bengaliAudio.play().catch(e => console.log("Auto-play blocked", e));
            }
        }
    }, [currentAyahIndex, isOverviewModalOpen, selectedLanguage]);

    const handleSurahClick = async (surah) => {
        setSelectedSurah(surah);
        setLoading(true);
        setError(null);
        setSurahInfo(null);
        try {
            const [data, info] = await Promise.all([
                fetchSurahDetails(surah.number),
                fetchChapterInfo(surah.number)
            ]);
            setSurahData(data);
            setSurahInfo(info);
        } catch (err) {
            console.error("Failed to load surah details:", err);
            setError("Failed to load Surah details. Please try again.");
            setSelectedSurah(null);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        setSelectedSurah(null);
        setSurahData(null);
        setIsOverviewModalOpen(false);
        setError(null);
        if (surahs.length === 0) window.location.reload();
    };

    const openAyahDetail = async (ayah) => {
        setSelectedAyahForDetail(ayah);
        setIsModalOpen(true);
        setLoadingTafsir(true);
        setTafsirData(null);
        try {
            if (selectedSurah) {
                const tafsir = await fetchAyahTafsir(selectedSurah.number, ayah.numberInSurah);
                setTafsirData(tafsir);
            }
        } catch (error) {
            console.error("Failed to load tafsir", error);
        } finally {
            setLoadingTafsir(false);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedAyahForDetail(null);
    };

    // TTS Function Removed

    // Helper to format Surah number for audio URLs (001, 002, etc.)
    const formatSurahNum = (num) => String(num).padStart(3, '0');

    if (loading) {
        return (
            <div className="flex h-screen flex-col items-center justify-center bg-[#F5F1E6] text-[#0F4C36]">
                <Loader2 className="h-12 w-12 animate-spin mb-4" />
                <p className="font-medium animate-pulse text-[#C5A059]">Loading Surahs...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen flex-col items-center justify-center bg-gray-50 text-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md border border-red-100">
                    <div className="bg-red-100 p-3 rounded-full w-fit mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Something went wrong</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button onClick={() => window.location.reload()} className="px-6 py-2 bg-emerald-600 text-white rounded-full font-bold hover:bg-emerald-700">Retry</button>
                    <p className="text-xs text-gray-400 mt-6 border-t pt-4">Technical Details: Check console for logs.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-islamic-pattern text-[#F5F1E6] font-sans pb-20 relative">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <header className="mb-8 flex items-center justify-between">
                    <div className="flex items-center space-x-3 cursor-pointer" onClick={handleBack}>
                        <BookOpen className="h-8 w-8 text-[#C5A059]" />
                        <h1 className="text-3xl font-bold text-[#C5A059] drop-shadow-sm font-amiri">
                            Quran AL-Kareem
                        </h1>
                    </div>
                </header>

                {selectedSurah && surahData ? (
                    <div className="animate-fade-in-up">
                        <button
                            onClick={handleBack}
                            className="mb-6 px-4 py-2 text-sm font-medium text-[#0F4C36] bg-[#C5A059]/10 rounded-lg hover:bg-[#C5A059]/20 transition-colors border border-[#C5A059]/30"
                        >
                            ← Back to Surah List
                        </button>
                        <div className="bg-black/40 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-[#C5A059]/30 mb-8">
                            <div className="bg-[#0F4C36]/20 text-[#F5F1E6] p-6 text-center border-b border-[#C5A059]/30">
                                <h2 className="text-4xl font-amiri mb-2 text-[#C5A059]">{surahData.name}</h2>
                                <h3 className="text-xl font-medium text-[#F5F1E6]">{surahData.englishName}</h3>
                                <p className="text-[#C5A059]/80 text-sm mt-1">{surahData.englishNameTranslation} • {surahData.numberOfAyahs} Ayahs</p>

                                <div className="flex justify-center gap-3 mt-4 flex-wrap">
                                    <button
                                        onClick={() => {
                                            setIsOverviewModalOpen(true);
                                            setCurrentAyahIndex(0);
                                        }}
                                        className="px-5 py-2 bg-[#C5A059] hover:bg-[#b08d48] text-[#050505] rounded-full text-sm font-bold flex items-center transition-all shadow-md"
                                    >
                                        <Info className="w-4 h-4 mr-2" /> Surah Overview & Audio
                                    </button>
                                    <button
                                        onClick={() => navigate(`/tutor/${selectedSurah.number}`)}
                                        className="px-5 py-2 bg-white/10 text-[#F5F1E6] hover:bg-white/20 rounded-full text-sm font-bold flex items-center transition-all border border-[#F5F1E6]/30"
                                    >
                                        <GraduationCap className="w-4 h-4 mr-2" /> Word-by-Word Tutor
                                    </button>
                                </div>
                            </div>
                            <div className="p-6 space-y-8 bg-transparent">
                                {selectedSurah.number !== 1 && selectedSurah.number !== 9 && (
                                    <div className="text-center mb-8 pb-8 border-b border-[#C5A059]/20">
                                        <p className="text-2xl font-amiri text-[#0F4C36]">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
                                    </div>
                                )}
                                {surahData.ayahs.map((ayah) => (
                                    <div key={ayah.number} className="group relative p-4 rounded-xl hover:bg-[#C5A059]/5 transition-colors border-b border-[#C5A059]/20 last:border-0">
                                        <div className="flex flex-col gap-4">
                                            <div className="w-full text-right">
                                                <p className="text-3xl font-amiri leading-loose text-[#F5F1E6]" dir="rtl">
                                                    {ayah.text.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', '').trim() || ayah.text}
                                                    <span className="mr-2 inline-flex items-center justify-center w-8 h-8 text-sm border border-[#C5A059] rounded-full text-[#C5A059] font-nums bg-[#0F4C36]">
                                                        {ayah.numberInSurah}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="w-full text-left">
                                                <p className="text-lg text-[#F5F1E6]/90 leading-relaxed font-serif">
                                                    {ayah.translation}
                                                </p>
                                                <button
                                                    onClick={() => openAyahDetail(ayah)}
                                                    className="mt-3 text-sm text-[#C5A059] flex items-center hover:underline font-medium"
                                                >
                                                    <Info className="w-4 h-4 mr-1" /> Explain / Tafsir
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {surahs.map((surah) => (
                            <div
                                key={surah.number}
                                onClick={() => handleSurahClick(surah)}
                                className="bg-black/40 backdrop-blur-sm p-5 rounded-xl shadow-md hover:shadow-[0_0_15px_rgba(197,160,89,0.3)] border border-[#C5A059]/30 cursor-pointer transform hover:-translate-y-1 transition-all duration-200 group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-16 h-16 bg-[#C5A059]/10 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:bg-[#C5A059]/20"></div>
                                <div className="flex items-center justify-between relative z-10">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center justify-center w-10 h-10 bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/50 font-bold rounded-full text-sm group-hover:bg-[#C5A059] group-hover:text-[#050505] transition-colors shadow-sm">
                                            {surah.number}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-[#F5F1E6] group-hover:text-[#C5A059] transition-colors">{surah.englishName}</h3>
                                            <p className="text-xs text-[#F5F1E6]/60">{surah.englishNameTranslation}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-amiri text-lg text-[#C5A059]">{surah.name}</p>
                                        <p className="text-xs text-[#F5F1E6]/40">{surah.numberOfAyahs} Ayahs</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Tafsir Modal */}
            {isModalOpen && selectedAyahForDetail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                    <div className="bg-black/80 border border-[#C5A059]/30 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto relative animate-fade-in-up text-[#F5F1E6]">
                        <button onClick={closeModal} className="absolute top-4 right-4 text-[#C5A059] hover:text-[#F5F1E6]"><X className="w-6 h-6" /></button>
                        <div className="p-8">
                            <h3 className="text-2xl font-bold text-[#C5A059] mb-6 border-b border-[#C5A059]/30 pb-2">Ayah Explanation</h3>
                            <div className="bg-[#0F4C36]/20 rounded-xl p-6 mb-6 text-right border border-[#C5A059]/20">
                                <p className="text-2xl font-amiri leading-loose text-[#F5F1E6]" dir="rtl">
                                    {selectedAyahForDetail.text.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', '').trim() || selectedAyahForDetail.text}
                                </p>
                            </div>
                            <div className="mb-6">
                                <h4 className="text-sm font-bold text-[#C5A059]/70 uppercase tracking-widest mb-2">Translation</h4>
                                <p className="text-lg text-[#F5F1E6]/90 font-serif">{selectedAyahForDetail.translation}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-[#C5A059]/70 uppercase tracking-widest mb-2">Tafsir (Al-Jalalayn)</h4>
                                {loadingTafsir ? <div className="flex items-center text-[#C5A059]"><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading explanation...</div> : tafsirData ? <p className="text-[#F5F1E6]/80 leading-relaxed text-justify">{tafsirData.text}</p> : <p className="text-red-400 text-sm">Explanation unavailable.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Surah Overview Modal (Multi-Language & Voice Settings) */}
            {isOverviewModalOpen && surahData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                    <div className="bg-black/90 border border-[#C5A059]/30 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto relative animate-fade-in-up text-[#F5F1E6]">
                        <button onClick={() => { setIsOverviewModalOpen(false); window.speechSynthesis.cancel(); setIsSpeaking(false); }} className="absolute top-4 right-4 text-[#C5A059] hover:text-[#F5F1E6]"><X className="w-6 h-6" /></button>
                        <div className="p-8">
                            <h3 className="text-2xl font-bold text-[#C5A059] mb-6 border-b border-[#C5A059]/30 pb-2">Surah Overview</h3>

                            {/* Detailed Info from Quran.com */}
                            {surahInfo && (
                                <div className="mb-6 p-4 bg-[#0F4C36]/5 rounded-xl border border-[#0F4C36]/20 text-sm text-gray-700 leading-relaxed shadow-inner">
                                    <h4 className="font-bold text-[#0F4C36] mb-2 flex items-center"><Info className="w-4 h-4 mr-2" /> About this Surah</h4>
                                    <div dangerouslySetInnerHTML={{ __html: surahInfo.short_text }} />
                                </div>
                            )}

                            {/* Language Tabs */}
                            <div className="flex flex-wrap gap-2 mb-6 justify-center">
                                {['hindi', 'bengali', 'urdu', 'arabic'].map((lang) => (
                                    <button
                                        key={lang}
                                        onClick={() => { setSelectedLanguage(lang); window.speechSynthesis.cancel(); setIsSpeaking(false); }}
                                        className={`px-4 py-1 rounded-full text-sm font-bold transition-colors border ${selectedLanguage === lang ? 'bg-[#C5A059] text-[#050505] border-[#C5A059]' : 'bg-transparent text-[#F5F1E6] border-[#C5A059]/30 hover:border-[#C5A059] hover:text-[#C5A059]'}`}
                                    >
                                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                                    </button>
                                ))}
                            </div>

                            <div className="mb-8 flex flex-col items-center gap-4">
                                {/* MISHARY RASHID - ARABIC */}
                                <div className="w-full bg-[#0F4C36]/20 p-4 rounded-xl border border-[#0F4C36]/40 flex flex-col">
                                    <h4 className="text-sm font-bold text-[#C5A059] mb-2 flex items-center justify-center">
                                        <PlayCircle className="w-4 h-4 mr-2" /> Play Full Arabic Recitation (Mishary Rashid)
                                    </h4>
                                    <audio
                                        controls
                                        className="w-full h-10"
                                        src={`https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${formatSurahNum(surahData.number)}.mp3`}
                                        preload="none"
                                    >
                                        Your browser does not support the audio element.
                                    </audio>
                                </div>

                                {/* URDU/HINDI - AUDIO SEQUENCE PLAYER */}
                                {(selectedLanguage === 'hindi' || selectedLanguage === 'urdu') && (
                                    <div className="w-full bg-[#C5A059]/10 p-4 rounded-xl border border-[#C5A059]/30 flex flex-col mt-2">
                                        <h4 className="text-sm font-bold text-[#0F4C36] mb-2 flex items-center justify-center">
                                            <PlayCircle className="w-4 h-4 mr-2" /> Play Urdu/Hindi Translation (Shamshad Ali Khan)
                                        </h4>
                                        <div className="flex flex-col items-center w-full">
                                            <audio
                                                id="urdu-audio-player"
                                                controls
                                                className="w-full h-10"
                                                src={surahData.ayahs[currentAyahIndex]?.audioUrdu}
                                                onEnded={() => {
                                                    if (currentAyahIndex < surahData.ayahs.length - 1) {
                                                        setCurrentAyahIndex(prev => prev + 1);
                                                    }
                                                }}
                                                autoPlay={currentAyahIndex > 0} // Auto-play subsequent ayahs
                                            >
                                                Your browser does not support the audio element.
                                            </audio>
                                            <p className="text-xs text-[#0F4C36] mt-1">
                                                Playing Verse {currentAyahIndex + 1} of {surahData.numberOfAyahs}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* BENGALI - FULL SURAH PLAYER */}
                                {selectedLanguage === 'bengali' && (
                                    <div className="w-full bg-[#C5A059]/10 p-4 rounded-xl border border-[#C5A059]/30 flex flex-col mt-2">
                                        <h4 className="text-sm font-bold text-[#0F4C36] mb-2 flex items-center justify-center">
                                            <PlayCircle className="w-4 h-4 mr-2" /> Play Bengali Recitation (Full Surah)
                                        </h4>
                                        <div className="flex flex-col items-center w-full">
                                            <audio
                                                id="bengali-audio-player"
                                                controls
                                                className="w-full h-10"
                                                src={bengaliAudioMap[surahData.number] ? `https://archive.org/download/alquranwithbanglaaudio/${encodeURIComponent(bengaliAudioMap[surahData.number])}` : ''}
                                                onError={(e) => console.log('Audio load error', e)}
                                            >
                                                Your browser does not support the audio element.
                                            </audio>
                                            <p className="text-xs text-[#0F4C36] mt-1">
                                                Recitation by Sheikh Sudais & Toha (Bangla) - Full Surah
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="w-full h-px bg-[#C5A059]/20 my-2"></div>
                            </div>

                            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                                {surahData.ayahs.slice(0, 10).map((ayah, idx) => (
                                    <p key={idx} className={`text-[#F5F1E6]/80 leading-relaxed text-lg border-b border-[#C5A059]/10 last:border-0 pb-2 ${selectedLanguage === 'urdu' || selectedLanguage === 'arabic' ? 'font-amiri text-right' : 'font-serif'}`} dir={selectedLanguage === 'urdu' || selectedLanguage === 'arabic' ? 'rtl' : 'ltr'}>
                                        <span className={`font-bold text-[#C5A059] text-sm ${selectedLanguage === 'urdu' || selectedLanguage === 'arabic' ? 'ml-2' : 'mr-2'}`}>{ayah.numberInSurah}.</span>
                                        {selectedLanguage === 'arabic' ? ayah.text.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', '').trim() || ayah.text : (ayah[selectedLanguage] || "Translation unavailable")}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuranReader;

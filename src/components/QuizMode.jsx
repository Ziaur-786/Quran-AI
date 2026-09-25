import React, { useState, useEffect } from 'react';
import { fetchRandomAyah } from '../services/quranApi';
import { Loader2, CheckCircle, XCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const QuizMode = () => {
    const [currentAyah, setCurrentAyah] = useState(null);
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOption, setSelectedOption] = useState(null);
    const [score, setScore] = useState(0);
    const [answered, setAnswered] = useState(false);

    const loadQuestion = async () => {
        setLoading(true);
        setAnswered(false);
        setSelectedOption(null);
        try {
            // Fetch 1 correct ayah and 2 distractors
            const [correct, distractor1, distractor2] = await Promise.all([
                fetchRandomAyah(),
                fetchRandomAyah(),
                fetchRandomAyah()
            ]);

            setCurrentAyah(correct);

            // Shuffle options
            const allOptions = [
                { id: 'correct', text: correct.translation.text },
                { id: 'wrong1', text: distractor1.translation.text },
                { id: 'wrong2', text: distractor2.translation.text }
            ].sort(() => Math.random() - 0.5);

            setOptions(allOptions);
        } catch (error) {
            console.error("Failed to load quiz", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadQuestion();
    }, []);

    const handleOptionClick = (optionId) => {
        if (answered) return;
        setSelectedOption(optionId);
        setAnswered(true);
        if (optionId === 'correct') {
            setScore(s => s + 1);
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F1E6] p-4 font-sans flex flex-col items-center bg-islamic-pattern">
            <div className="w-full max-w-2xl">
                <div className="flex justify-between items-center mb-6">
                    <Link to="/" className="flex items-center text-[#0F4C36] font-medium hover:text-[#C5A059] transition-colors">
                        <ArrowLeft className="w-5 h-5 mr-1" /> Home
                    </Link>
                    <div className="bg-[#0F4C36] text-[#C5A059] px-4 py-1 rounded-full font-bold shadow-md border border-[#C5A059]/30">
                        Score: {score}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 text-center min-h-[400px] flex flex-col justify-center border border-[#C5A059]/30">
                    {loading ? (
                        <div className="flex justify-center">
                            <Loader2 className="w-10 h-10 animate-spin text-[#C5A059]" />
                        </div>
                    ) : (
                        <>
                            <div className="mb-8">
                                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Translate this Ayah</h2>
                                <p className="text-3xl font-amiri leading-loose text-gray-800 mb-2" dir="rtl">
                                    {currentAyah?.arabic.text}
                                </p>
                                <p className="text-xs text-gray-400 mt-2">
                                    {currentAyah?.arabic.surah.englishName} : {currentAyah?.arabic.numberInSurah}
                                </p>
                            </div>

                            <div className="space-y-3">
                                {options.map((option) => {
                                    let btnClass = "w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ";
                                    if (answered) {
                                        if (option.id === 'correct') btnClass += "border-[#0F4C36] bg-[#0F4C36] text-[#F5F1E6]";
                                        else if (selectedOption === option.id) btnClass += "border-red-500 bg-red-50 text-red-700";
                                        else btnClass += "border-gray-100 text-gray-400 opacity-50";
                                    } else {
                                        btnClass += "border-gray-100 hover:border-[#C5A059] hover:bg-[#C5A059]/10 text-gray-700";
                                    }

                                    return (
                                        <button
                                            key={option.id}
                                            onClick={() => handleOptionClick(option.id)}
                                            disabled={answered}
                                            className={btnClass}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>{option.text}</span>
                                                {answered && option.id === 'correct' && <CheckCircle className="w-5 h-5 text-[#C5A059]" />}
                                                {answered && selectedOption === option.id && option.id !== 'correct' && <XCircle className="w-5 h-5 text-red-600" />}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {answered && (
                                <div className="mt-8 animate-fade-in-up">
                                    <button
                                        onClick={loadQuestion}
                                        className="px-8 py-3 bg-[#0F4C36] text-[#C5A059] rounded-full font-bold shadow-lg hover:bg-[#093022] transition-colors flex items-center mx-auto border border-[#C5A059]"
                                    >
                                        <RefreshCw className="w-5 h-5 mr-2" /> Next Question
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizMode;

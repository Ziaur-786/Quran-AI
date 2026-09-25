import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  RotateCcw, 
  Award, 
  Sparkles, 
  Clock, 
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QUIZ_QUESTIONS = {
  quran: [
    {
      question: "Which Surah is known as the 'Heart of the Quran' (Qalb al-Quran)?",
      options: ["Surah Ya-Sin (36)", "Surah Al-Mulk (67)", "Surah Al-Baqarah (2)", "Surah Al-Fatihah (1)"],
      correct: 0,
      explanation: "Prophet Muhammad (pbuh) mentioned that Surah Ya-Sin is the heart of the Quran because of its deep spiritual reminders of resurrection and tawheed."
    },
    {
      question: "Which is the longest Ayah in the Holy Quran?",
      options: ["Ayat al-Kursi (2:255)", "Ayat al-Dayn (2:282)", "Ayat an-Noor (24:35)", "Surah Al-Ikhlas (112:1)"],
      correct: 1,
      explanation: "Ayat al-Dayn (The Verse of Loan/Debt) in Surah Al-Baqarah (2:282) is the longest verse in the Quran, detailing fair commercial contracts."
    },
    {
      question: "How many Surahs are there in the Holy Quran?",
      options: ["112 Surahs", "114 Surahs", "116 Surahs", "120 Surahs"],
      correct: 1,
      explanation: "The Holy Quran comprises 114 Surahs, beginning with Surah Al-Fatihah and concluding with Surah An-Nas."
    },
    {
      question: "Which Surah does NOT begin with 'Bismillah-ir-Rahman-ir-Rahim'?",
      options: ["Surah At-Tawbah (9)", "Surah Al-Anfal (8)", "Surah Al-Kahf (18)", "Surah An-Naml (27)"],
      correct: 0,
      explanation: "Surah At-Tawbah (Chapter 9) does not begin with the Basmalah, while Surah An-Naml contains it twice (at the start and in verse 30)."
    },
    {
      question: "Which Surah was named after an insect that builds complex hives?",
      options: ["Surah Al-Ankabut (Spider)", "Surah An-Nahl (The Bee)", "Surah An-Naml (The Ant)", "Surah Al-Baqarah (The Cow)"],
      correct: 1,
      explanation: "Surah An-Nahl (The Bee, Chapter 16) highlights the miraculous inspiration given by Allah to honeybees."
    }
  ],
  seerah: [
    {
      question: "In which cave did Prophet Muhammad (pbuh) receive the first revelation?",
      options: ["Cave Thawr", "Cave Hira", "Mount Uhud", "Cave Safa"],
      correct: 1,
      explanation: "The first revelation of the Quran (Surah Al-'Alaq, verses 1-5) was revealed to the Prophet (pbuh) in Cave Hira on Jabal al-Noor."
    },
    {
      question: "What was the very first word of the Holy Quran revealed to Prophet Muhammad (pbuh)?",
      options: ["Qul (Say)", "Iqra (Read/Recite)", "Al-Hamd (Praise)", "Bismillah (In the name of Allah)"],
      correct: 1,
      explanation: "'Iqra' (Read / Recite in the name of your Lord) was the first divine command delivered by Angel Jibril."
    },
    {
      question: "In which year did the Hijrah (migration from Makkah to Madinah) take place?",
      options: ["610 CE", "622 CE", "630 CE", "632 CE"],
      correct: 1,
      explanation: "The Hijrah occurred in 622 CE and marks the beginning year of the Islamic Hijri calendar."
    }
  ],
  prophets: [
    {
      question: "Which Prophet is mentioned by name most frequently in the Holy Quran?",
      options: ["Prophet Ibrahim (pbuh)", "Prophet Musa (pbuh)", "Prophet Isa (pbuh)", "Prophet Yusuf (pbuh)"],
      correct: 1,
      explanation: "Prophet Musa (Moses, pbuh) is mentioned by name 136 times across numerous Surahs."
    },
    {
      question: "Which Prophet was swallowed by a massive whale (Hoot) and made dua in its belly?",
      options: ["Prophet Yunus (Jonah, pbuh)", "Prophet Ayyub (Job, pbuh)", "Prophet Lut (Lot, pbuh)", "Prophet Yahya (John, pbuh)"],
      correct: 0,
      explanation: "Prophet Yunus (pbuh) called out from the darkness: 'La ilaha illa Anta, Subhanaka inni kuntu minaz-zalimeen' (21:87)."
    }
  ]
};

export default function QuizMode() {
  const navigate = useNavigate();
  const [category, setCategory] = useState('quran'); // 'quran', 'seerah', 'prophets'
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const questions = QUIZ_QUESTIONS[category] || QUIZ_QUESTIONS.quran;
  const currentQ = questions[currentIdx];

  const handleSelectOption = (idx) => {
    if (answered) return;
    setSelectedOption(idx);
    setAnswered(true);

    if (idx === currentQ.correct) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setAnswered(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setAnswered(false);
    setScore(0);
    setQuizCompleted(false);
  };

  return (
    <div className="min-h-screen text-[#F5F1E6] pb-24 md:pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6 animate-fade-in-up">
        
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
                <Trophy className="text-[#C5A059]" size={28} />
                Islamic Quiz Challenge
              </h1>
              <p className="text-xs sm:text-sm text-[#F5F1E6]/70 mt-0.5">
                Strengthen your understanding of the Quran, Seerah, and Islamic history.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Category Pills */}
            {[
              { id: 'quran', label: 'Quran' },
              { id: 'seerah', label: 'Seerah' },
              { id: 'prophets', label: 'Prophets' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setCategory(cat.id);
                  resetQuiz();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  category === cat.id
                    ? 'bg-[#C5A059] text-[#061610] shadow-md shadow-[#C5A059]/20'
                    : 'bg-[#082218]/70 backdrop-blur-md border border-[#C5A059]/25 text-[#F5F1E6]/70 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {!quizCompleted ? (
          <div className="rounded-3xl bg-[#082218]/75 backdrop-blur-xl border border-[#C5A059]/30 p-6 sm:p-8 shadow-2xl space-y-6">
            
            {/* Progress & Score Bar */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#F5F1E6]/70 font-semibold">
                Question {currentIdx + 1} of {questions.length}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-[#C5A059] font-bold">
                  Score: {score} / {questions.length}
                </span>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="w-full bg-[#051811] h-2 rounded-full overflow-hidden border border-[#C5A059]/20">
              <div 
                className="bg-gradient-to-r from-[#C5A059] to-[#E3C578] h-full rounded-full transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question Text */}
            <div className="py-2">
              <h2 className="text-xl sm:text-2xl font-bold font-outfit text-white leading-snug">
                {currentQ.question}
              </h2>
            </div>

            {/* Options List */}
            <div className="space-y-3">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correct;

                let cardStyle = 'bg-[#061A12] border-[#C5A059]/20 text-[#F5F1E6] hover:border-[#C5A059]/60 hover:bg-[#0c2e23]';
                if (answered) {
                  if (isCorrect) {
                    cardStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-300';
                  } else if (isSelected) {
                    cardStyle = 'bg-red-950/60 border-red-500 text-red-300';
                  } else {
                    cardStyle = 'bg-[#061A12] border-[#C5A059]/10 text-[#F5F1E6]/40 opacity-50';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={answered}
                    className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${cardStyle}`}
                  >
                    <span className="text-sm sm:text-base font-medium">{option}</span>
                    {answered && isCorrect && <CheckCircle2 size={20} className="text-emerald-400 flex-shrink-0" />}
                    {answered && isSelected && !isCorrect && <XCircle size={20} className="text-red-400 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation box after answering */}
            {answered && (
              <div className="p-4 rounded-2xl bg-[#0B2C1F] border border-[#C5A059]/30 text-xs sm:text-sm text-[#F5F1E6]/90 space-y-1.5 animate-fade-in-up">
                <span className="font-bold text-[#C5A059] flex items-center gap-1.5 uppercase tracking-wide text-xs">
                  <Sparkles size={14} /> Islamic Insight:
                </span>
                <p className="leading-relaxed opacity-85">
                  {currentQ.explanation}
                </p>
              </div>
            )}

            {/* Next Button */}
            {answered && (
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleNext}
                  className="px-6 py-3 rounded-2xl bg-[#C5A059] text-[#061610] font-bold text-sm hover:bg-[#F5E096] transition-all flex items-center gap-2 shadow-lg shadow-[#C5A059]/20"
                >
                  <span>{currentIdx + 1 < questions.length ? 'Next Question' : 'View Results'}</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}

          </div>
        ) : (
          /* Quiz Results Summary Modal */
          <div className="rounded-3xl bg-gradient-to-b from-[#0E3524] to-[#071F15] border-2 border-[#C5A059]/40 p-8 text-center space-y-6 shadow-2xl animate-fade-in-up">
            <div className="w-20 h-20 rounded-full bg-[#C5A059]/20 border-2 border-[#C5A059] mx-auto flex items-center justify-center text-4xl shadow-lg">
              {score >= questions.length * 0.8 ? '🏆' : '🌟'}
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-bold font-outfit text-white">
                {score >= questions.length * 0.8 ? 'Masha\'Allah! Excellent!' : 'Well Done!'}
              </h2>
              <p className="text-sm text-[#F5F1E6]/70">
                You completed the {category.toUpperCase()} Quiz challenge.
              </p>
            </div>

            <div className="inline-flex items-center gap-6 bg-[#061A12] border border-[#C5A059]/30 px-6 py-4 rounded-2xl">
              <div>
                <p className="text-2xl font-bold text-[#C5A059]">{score} / {questions.length}</p>
                <p className="text-[10px] text-[#F5F1E6]/50 uppercase font-semibold">Correct Answers</p>
              </div>
              <div className="w-px h-8 bg-[#C5A059]/20" />
              <div>
                <p className="text-2xl font-bold text-emerald-400">{Math.round((score / questions.length) * 100)}%</p>
                <p className="text-[10px] text-[#F5F1E6]/50 uppercase font-semibold">Accuracy</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={resetQuiz}
                className="px-6 py-3 rounded-2xl bg-[#C5A059] text-[#061610] font-bold text-sm hover:bg-[#F5E096] transition-colors flex items-center gap-2"
              >
                <RotateCcw size={16} />
                <span>Try Again</span>
              </button>
              <button
                onClick={() => navigate('/progress')}
                className="px-6 py-3 rounded-2xl bg-[#082218] border border-[#C5A059]/35 text-[#C5A059] font-medium text-sm hover:bg-[#0c2e23] transition-colors"
              >
                <span>View All Progress</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

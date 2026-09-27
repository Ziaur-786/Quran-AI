// Unified Real User Progress Tracking & Storage Service
// Handles streak calculation, ayahs read, quiz accuracy, badges & courses per user account.

const DEFAULT_BADGES = [
  { id: 'welcome', title: 'Seeker of Light', desc: 'Joined Quran AI', icon: '🌟', unlocked: true },
  { id: 'first_surah', title: 'First Surah', desc: 'Read Surah Al-Fatihah', icon: '📖', unlocked: false },
  { id: 'streak_3', title: '3-Day Streak', desc: 'Maintained 3 consecutive days', icon: '🔥', unlocked: false },
  { id: 'streak_7', title: '7-Day Streak', desc: 'Maintained 7 consecutive days', icon: '⚡', unlocked: false },
  { id: 'vocab_novice', title: 'Vocab Novice', desc: 'Mastered 25 Arabic words', icon: '🧠', unlocked: false },
  { id: 'quiz_ace', title: 'Quiz Ace', desc: 'Scored 100% in Quran Quiz', icon: '🎯', unlocked: false },
  { id: 'tajweed_seeker', title: 'Tajweed Seeker', desc: 'Completed 5 Qaida Lessons', icon: '🔤', unlocked: false },
  { id: 'khatam_master', title: 'Khatam Master', desc: 'Complete entire Holy Quran', icon: '👑', unlocked: false }
];

const getStorageKey = (user) => {
  if (user && (user.id || user.email)) {
    return `quran_user_progress_${user.id || user.email}`;
  }
  return 'quran_user_progress_guest';
};

const getTodayString = () => {
  return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
};

const getYesterdayString = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
};

const getDayName = (date = new Date()) => {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
};

// Initial default progress for a new user
export const createDefaultProgress = (user) => {
  const today = getTodayString();
  const dayName = getDayName();

  return {
    streak: 1, // First day active
    longestStreak: 1,
    lastActiveDate: today,
    activeDaysThisWeek: [dayName],
    readingTimeMinutes: 0,
    ayahsRead: 0,
    surahsCompleted: 0,
    quizTotalScore: 0,
    quizTotalQuestions: 0,
    quizzesCompleted: 0,
    quizAccuracy: 0,
    qaidaLessonsCompleted: 0,
    vocabMastered: 0,
    badges: DEFAULT_BADGES.map(b => ({
      ...b,
      unlocked: b.id === 'welcome' // Welcome unlocked on sign in
    })),
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
};

// Get current progress for the given user, automatically updating daily streak
export const getUserProgress = (user) => {
  try {
    const key = getStorageKey(user);
    const raw = localStorage.getItem(key);
    let data;

    if (raw) {
      data = JSON.parse(raw);
    } else {
      data = createDefaultProgress(user);
    }

    // Check & update daily streak
    const today = getTodayString();
    const yesterday = getYesterdayString();
    const currentDayName = getDayName();

    if (!data.activeDaysThisWeek) {
      data.activeDaysThisWeek = [];
    }

    if (data.lastActiveDate === today) {
      // Already active today
      if (!data.activeDaysThisWeek.includes(currentDayName)) {
        data.activeDaysThisWeek.push(currentDayName);
      }
    } else if (data.lastActiveDate === yesterday) {
      // Consecutive day! Increment streak
      data.streak = (data.streak || 0) + 1;
      if (data.streak > (data.longestStreak || 1)) {
        data.longestStreak = data.streak;
      }
      data.lastActiveDate = today;
      if (!data.activeDaysThisWeek.includes(currentDayName)) {
        data.activeDaysThisWeek.push(currentDayName);
      }
    } else {
      // Missed more than 1 day, reset streak to 1
      data.streak = 1;
      data.lastActiveDate = today;
      data.activeDaysThisWeek = [currentDayName];
    }

    // Check streak badges
    if (data.streak >= 3) unlockBadge(data, 'streak_3');
    if (data.streak >= 7) unlockBadge(data, 'streak_7');

    saveUserProgress(user, data);
    return data;
  } catch (err) {
    console.error('Failed to get user progress', err);
    return createDefaultProgress(user);
  }
};

// Save progress to localStorage
export const saveUserProgress = (user, progress) => {
  try {
    const key = getStorageKey(user);
    progress.updatedAt = Date.now();
    localStorage.setItem(key, JSON.stringify(progress));
    localStorage.setItem('quran_streak', progress.streak || 1);
  } catch (err) {
    console.error('Failed to save user progress', err);
  }
};

// Helper: Unlock a badge if not already unlocked
const unlockBadge = (progress, badgeId) => {
  if (!progress.badges) return;
  const badge = progress.badges.find(b => b.id === badgeId);
  if (badge && !badge.unlocked) {
    badge.unlocked = true;
    badge.unlockedAt = Date.now();
  }
};

// Record Quran reading activity (reading time + ayahs)
export const recordReadingSession = (user, { ayahsCount = 1, minutesSpent = 1, surahNumber = null }) => {
  const progress = getUserProgress(user);
  progress.ayahsRead = (progress.ayahsRead || 0) + ayahsCount;
  progress.readingTimeMinutes = (progress.readingTimeMinutes || 0) + minutesSpent;

  if (surahNumber === 1) {
    unlockBadge(progress, 'first_surah');
  }

  saveUserProgress(user, progress);
  return progress;
};

// Record completed Quiz
export const recordQuizResult = (user, { score, totalQuestions }) => {
  const progress = getUserProgress(user);
  progress.quizzesCompleted = (progress.quizzesCompleted || 0) + 1;
  progress.quizTotalScore = (progress.quizTotalScore || 0) + score;
  progress.quizTotalQuestions = (progress.quizTotalQuestions || 0) + totalQuestions;

  if (progress.quizTotalQuestions > 0) {
    progress.quizAccuracy = Math.round((progress.quizTotalScore / progress.quizTotalQuestions) * 100);
  }

  // 100% score unlocks Quiz Ace
  if (score === totalQuestions && totalQuestions >= 5) {
    unlockBadge(progress, 'quiz_ace');
  }

  saveUserProgress(user, progress);
  return progress;
};

// Record Qaida lesson completion
export const recordQaidaProgress = (user, lessonNumber) => {
  const progress = getUserProgress(user);
  if (lessonNumber > (progress.qaidaLessonsCompleted || 0)) {
    progress.qaidaLessonsCompleted = lessonNumber;
  }
  if (progress.qaidaLessonsCompleted >= 5) {
    unlockBadge(progress, 'tajweed_seeker');
  }
  saveUserProgress(user, progress);
  return progress;
};

// Record Vocabulary mastered words
export const recordVocabProgress = (user, count) => {
  const progress = getUserProgress(user);
  progress.vocabMastered = count;
  if (count >= 25) {
    unlockBadge(progress, 'vocab_novice');
  }
  saveUserProgress(user, progress);
  return progress;
};

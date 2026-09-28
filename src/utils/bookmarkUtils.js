// Unified Bookmark Management for Surahs & Ayahs

export const BOOKMARKS_KEY = 'quran_bookmarks';

/**
 * Retrieve all bookmarks from localStorage, sorted newest first
 */
export const getBookmarks = () => {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return [];
    
    // Normalize items to ensure type exists
    return list.map(item => {
      const isSurah = item.type === 'surah' || (!item.ayahNumber && item.key?.startsWith('surah-'));
      return {
        ...item,
        type: isSurah ? 'surah' : 'ayah',
        timestamp: item.timestamp || (item.time ? new Date(item.time).getTime() : 0)
      };
    }).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  } catch (e) {
    console.error('Failed to load bookmarks', e);
    return [];
  }
};

/**
 * Save bookmarks to localStorage and dispatch event for real-time reactivity
 */
export const saveBookmarks = (bookmarks) => {
  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    window.dispatchEvent(new CustomEvent('quran_bookmarks_changed', { detail: bookmarks }));
  } catch (e) {
    console.error('Failed to save bookmarks', e);
  }
};

/**
 * Check if a Surah is bookmarked
 */
export const isSurahBookmarked = (surahNumber) => {
  const bookmarks = getBookmarks();
  return bookmarks.some(b => b.type === 'surah' && Number(b.surahNumber) === Number(surahNumber));
};

/**
 * Check if a specific Ayah is bookmarked
 */
export const isAyahBookmarked = (surahNumber, ayahNumber) => {
  const bookmarks = getBookmarks();
  const key = `${surahNumber}:${ayahNumber}`;
  return bookmarks.some(b => b.key === key || (b.type === 'ayah' && Number(b.surahNumber) === Number(surahNumber) && Number(b.ayahNumber) === Number(ayahNumber)));
};

/**
 * Toggle Surah bookmark
 * @returns boolean - true if now bookmarked, false if removed
 */
export const toggleSurahBookmark = (surah) => {
  const bookmarks = getBookmarks();
  const surahNum = Number(surah.number);
  const exists = bookmarks.some(b => b.type === 'surah' && Number(b.surahNumber) === surahNum);

  let updated;
  if (exists) {
    updated = bookmarks.filter(b => !(b.type === 'surah' && Number(b.surahNumber) === surahNum));
  } else {
    const newBookmark = {
      key: `surah-${surahNum}`,
      type: 'surah',
      surahNumber: surahNum,
      surahName: surah.englishName || `Surah ${surahNum}`,
      surahArabic: surah.name || '',
      englishNameTranslation: surah.englishNameTranslation || '',
      numberOfAyahs: surah.numberOfAyahs || '',
      revelationType: surah.revelationType || '',
      time: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      timestamp: Date.now()
    };
    updated = [newBookmark, ...bookmarks];
  }

  saveBookmarks(updated);
  return !exists;
};

/**
 * Toggle Ayah bookmark
 * @returns boolean - true if now bookmarked, false if removed
 */
export const toggleAyahBookmark = (surah, ayah, translation = '') => {
  const bookmarks = getBookmarks();
  const surahNum = Number(surah.number);
  const ayahNum = Number(ayah.numberInSurah);
  const key = `${surahNum}:${ayahNum}`;

  const exists = bookmarks.some(b => b.key === key || (b.type === 'ayah' && Number(b.surahNumber) === surahNum && Number(b.ayahNumber) === ayahNum));

  let updated;
  if (exists) {
    updated = bookmarks.filter(b => !(b.key === key || (b.type === 'ayah' && Number(b.surahNumber) === surahNum && Number(b.ayahNumber) === ayahNum)));
  } else {
    const newBookmark = {
      key,
      type: 'ayah',
      surahNumber: surahNum,
      surahName: surah.englishName || `Surah ${surahNum}`,
      surahArabic: surah.name || '',
      ayahNumber: ayahNum,
      text: ayah.text || '',
      translation: translation || ayah.translation || ayah.urdu || '',
      time: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      timestamp: Date.now()
    };
    updated = [newBookmark, ...bookmarks];
  }

  saveBookmarks(updated);
  return !exists;
};

/**
 * Remove bookmark by key or id
 */
export const removeBookmark = (key) => {
  const bookmarks = getBookmarks();
  const updated = bookmarks.filter(b => b.key !== key && b.id !== key);
  saveBookmarks(updated);
  return updated;
};

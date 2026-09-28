// WhatsApp and Web Sharing Utilities for Quran AI
// Formats beautiful messages with Arabic script, translations, and direct web links.

/**
 * Returns public base URL for sharing.
 * If running on localhost, defaults to production URL so shared links work for recipients.
 */
export const getShareBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const { hostname, origin } = window.location;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'https://quran-ai-sigma.vercel.app';
    }
    return origin;
  }
  return 'https://quran-ai-sigma.vercel.app';
};

/**
 * Generates direct share link for a Surah or Ayah
 */
export const getQuranShareLink = (surahNumber, ayahNumber = null) => {
  const base = getShareBaseUrl();
  if (ayahNumber) {
    return `${base}/quran?surah=${surahNumber}&ayah=${ayahNumber}`;
  }
  return `${base}/quran?surah=${surahNumber}`;
};

/**
 * Share a complete Surah on WhatsApp
 */
export const shareSurahOnWhatsApp = ({
  surahNumber,
  englishName = '',
  arabicName = '',
  englishNameTranslation = '',
  numberOfAyahs = '',
  revelationType = ''
}) => {
  const url = getQuranShareLink(surahNumber);
  const typeText = revelationType ? (revelationType === 'Meccan' ? 'Makki' : 'Madani') : '';
  
  const message = [
    `📖 *Surah ${englishName || surahNumber} ${arabicName ? `(${arabicName})` : ''}*`,
    englishNameTranslation ? `✨ _"${englishNameTranslation}"_` : null,
    numberOfAyahs ? `📜 Revelation: ${typeText ? `${typeText} • ` : ''}${numberOfAyahs} Ayahs` : null,
    ``,
    `Read, listen to beautiful Tilawat and explore translations on Quran AI:`,
    `🔗 ${url}`
  ].filter(line => line !== null).join('\n');

  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank', 'noopener,noreferrer');
  return waUrl;
};

/**
 * Share a specific Ayah on WhatsApp
 */
export const shareAyahOnWhatsApp = ({
  surahNumber,
  surahName = '',
  ayahNumber,
  arabicText = '',
  translation = ''
}) => {
  const url = getQuranShareLink(surahNumber, ayahNumber);
  
  const cleanArabic = (arabicText || '').trim();
  const cleanTranslation = (translation || '').trim();

  const message = [
    `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ`,
    ``,
    cleanArabic ? cleanArabic : null,
    ``,
    cleanTranslation ? `_"${cleanTranslation}"_` : null,
    `— *Surah ${surahName || surahNumber} [${surahNumber}:${ayahNumber}]*`,
    ``,
    `Recite with Tajweed & explore Tafsir on Quran AI:`,
    `🔗 ${url}`
  ].filter(line => line !== null).join('\n');

  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank', 'noopener,noreferrer');
  return waUrl;
};

/**
 * Share Daily Divine Reflection verse on WhatsApp
 */
export const shareDailyVerseOnWhatsApp = (verse) => {
  if (!verse) return;
  const surahNum = verse.surahNumber || 1;
  const ayahNum = verse.ayahNumber || 1;
  const url = getQuranShareLink(surahNum, ayahNum);

  const message = [
    `🌟 *Daily Divine Reflection · Quran AI*`,
    ``,
    verse.arabic ? verse.arabic : null,
    ``,
    verse.translation ? `_"${verse.translation}"_` : null,
    `— *${verse.surah || `Surah ${surahNum}:${ayahNum}`}*`,
    ``,
    `Read full Surah & daily reminders on Quran AI:`,
    `🔗 ${url}`
  ].filter(line => line !== null).join('\n');

  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank', 'noopener,noreferrer');
  return waUrl;
};

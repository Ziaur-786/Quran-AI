/**
 * Surah-themed image prompt generator for Pollinations.ai
 * Maps each Surah to a beautiful, Islamic-themed background prompt
 * for the WhatsApp Status Card generator.
 * 
 * The prompts are designed to produce stunning, serene landscapes
 * and Islamic art that match the spiritual mood of each Surah.
 */

// Category-based prompt templates
export const SCENE_CATEGORIES = {
  light: "Ethereal divine golden light rays streaming through ornate Islamic archway, majestic mosque interior, heavenly glow, ultra realistic photography, cinematic lighting, 8k",
  night: "Majestic crescent moon over ancient Islamic city skyline with minarets, starry night sky milky way, dark blue tones, serene peaceful atmosphere, ultra realistic, 8k",
  nature: "Beautiful lush green garden paradise with flowing streams and blooming flowers, golden hour sunlight, Islamic geometric patterns in sky, ultra realistic, 8k",
  ocean: "Tranquil turquoise ocean at sunset with golden clouds, silhouette of mosque dome on horizon, peaceful reflections on water, ultra realistic photography, 8k",
  desert: "Golden sand dunes desert at sunrise with ancient caravan path, warm amber tones, dramatic sky with golden clouds, spiritual journey atmosphere, ultra realistic, 8k",
  mountain: "Majestic snow-capped mountains at dawn with golden light, peaceful valley with flowing river below, spiritual grandeur atmosphere, ultra realistic, 8k",
  mosque: "Grand ornate Islamic mosque with golden dome at golden hour, beautiful sky reflection in courtyard pool, intricate calligraphy details, ultra realistic photography, 8k",
  sky: "Dramatic sunset sky with golden purple orange clouds, silhouette of mosque minarets, birds flying in formation, spiritual atmosphere, ultra realistic, 8k",
  rain: "Gentle rain falling on beautiful mosque courtyard garden, wet reflections on marble floor, soft diffused light, peaceful atmosphere, ultra realistic, 8k",
  fire: "Dramatic volcanic sunset with deep red orange sky, silhouette of ancient fortress on cliff, intense powerful atmosphere, ultra realistic photography, 8k",
  dawn: "Breathtaking sunrise over misty Islamic city with golden domes and minarets, pink purple sky gradients, birds ascending, spiritual awakening, ultra realistic, 8k",
  garden: "Enchanting Islamic garden with geometric water channels, blooming roses and jasmine, arched marble pavilion, soft golden afternoon light, ultra realistic, 8k",
  cave: "Mystical cave with golden divine light pouring through opening, ancient stone walls, spiritual refuge atmosphere, warm amber tones, ultra realistic, 8k",
  stars: "Infinite starfield cosmos with nebula, crescent moon, spiritual cosmic grandeur, deep space blues and purples, awe-inspiring universe, ultra realistic, 8k",
  waterfall: "Magnificent waterfall in lush tropical forest, rainbow mist, golden sunbeams through canopy, paradise garden vibes, ultra realistic photography, 8k"
};

/**
 * Maps Surah numbers (1-114) to their thematic scene categories.
 * The mapping reflects the mood, themes, and narrative of each Surah.
 */
export const SURAH_THEME_MAP = {
  1: 'light',      // Al-Fatiha - The Opening, divine light
  2: 'mosque',     // Al-Baqarah - The Cow, guidance
  3: 'mountain',   // Ali 'Imran - Family of Imran
  4: 'light',      // An-Nisa - The Women, justice
  5: 'garden',     // Al-Ma'idah - The Table Spread
  6: 'sky',        // Al-An'am - The Cattle, creation
  7: 'garden',     // Al-A'raf - The Heights
  8: 'desert',     // Al-Anfal - The Spoils of War
  9: 'fire',       // At-Tawbah - The Repentance
  10: 'ocean',     // Yunus - Prophet Jonah, ocean
  11: 'mountain',  // Hud - Prophet Hud
  12: 'stars',     // Yusuf - Prophet Joseph, dreams
  13: 'rain',      // Ar-Ra'd - The Thunder
  14: 'light',     // Ibrahim - Prophet Abraham, light
  15: 'cave',      // Al-Hijr - The Rocky Tract
  16: 'nature',    // An-Nahl - The Bee, nature
  17: 'night',     // Al-Isra - The Night Journey
  18: 'cave',      // Al-Kahf - The Cave
  19: 'garden',    // Maryam - Mary, paradise
  20: 'mountain',  // Ta-Ha - Moses on mountain
  21: 'stars',     // Al-Anbiya - The Prophets
  22: 'mosque',    // Al-Hajj - The Pilgrimage
  23: 'ocean',     // Al-Mu'minun - The Believers
  24: 'light',     // An-Nur - The Light
  25: 'dawn',      // Al-Furqan - The Criterion
  26: 'desert',    // Ash-Shu'ara - The Poets
  27: 'garden',    // An-Naml - The Ants, Solomon's garden
  28: 'mountain',  // Al-Qasas - The Stories
  29: 'nature',    // Al-Ankabut - The Spider
  30: 'sky',       // Ar-Rum - The Romans
  31: 'ocean',     // Luqman - Wisdom
  32: 'dawn',      // As-Sajdah - The Prostration
  33: 'mosque',    // Al-Ahzab - The Confederates
  34: 'mountain',  // Saba - Sheba
  35: 'light',     // Fatir - The Originator
  36: 'night',     // Ya-Sin - Heart of Quran
  37: 'stars',     // As-Saffat - Those in Ranks
  38: 'garden',    // Sad - Prophet David
  39: 'sky',       // Az-Zumar - The Groups
  40: 'fire',      // Ghafir - The Forgiver
  41: 'dawn',      // Fussilat - Explained in Detail
  42: 'rain',      // Ash-Shura - The Consultation
  43: 'garden',    // Az-Zukhruf - The Ornaments
  44: 'night',     // Ad-Dukhan - The Smoke
  45: 'ocean',     // Al-Jathiyah - The Kneeling
  46: 'desert',    // Al-Ahqaf - The Sand Dunes
  47: 'waterfall', // Muhammad
  48: 'dawn',      // Al-Fath - The Victory
  49: 'mosque',    // Al-Hujurat - The Chambers
  50: 'mountain',  // Qaf - Creation
  51: 'desert',    // Adh-Dhariyat - The Winds
  52: 'mountain',  // At-Tur - The Mount
  53: 'stars',     // An-Najm - The Star
  54: 'night',     // Al-Qamar - The Moon
  55: 'garden',    // Ar-Rahman - The Most Merciful, paradise
  56: 'sky',       // Al-Waqi'ah - The Inevitable
  57: 'light',     // Al-Hadid - The Iron
  58: 'mosque',    // Al-Mujadilah - The Pleading
  59: 'dawn',      // Al-Hashr - The Gathering
  60: 'light',     // Al-Mumtahanah - She that is Examined
  61: 'mosque',    // As-Saff - The Ranks
  62: 'mosque',    // Al-Jumu'ah - Friday
  63: 'rain',      // Al-Munafiqun - The Hypocrites
  64: 'sky',       // At-Taghabun - Mutual Loss
  65: 'dawn',      // At-Talaq - The Divorce
  66: 'fire',      // At-Tahrim - The Prohibition
  67: 'stars',     // Al-Mulk - The Dominion, cosmos
  68: 'ocean',     // Al-Qalam - The Pen
  69: 'fire',      // Al-Haqqah - The Inevitable Reality
  70: 'sky',       // Al-Ma'arij - The Ascending Stairways
  71: 'ocean',     // Nuh - Noah, flood
  72: 'night',     // Al-Jinn - The Jinn
  73: 'night',     // Al-Muzzammil - The Enshrouded One
  74: 'dawn',      // Al-Muddaththir - The Cloaked One
  75: 'stars',     // Al-Qiyamah - The Resurrection
  76: 'waterfall', // Al-Insan - Man, paradise rivers
  77: 'desert',    // Al-Mursalat - Those Sent Forth
  78: 'mountain',  // An-Naba - The Tidings
  79: 'stars',     // An-Nazi'at - Those Who Drag Forth
  80: 'dawn',      // Abasa - He Frowned
  81: 'sky',       // At-Takwir - The Overthrowing (sun)
  82: 'stars',     // Al-Infitar - The Cleaving
  83: 'fire',      // Al-Mutaffifin - The Defrauding
  84: 'sky',       // Al-Inshiqaq - The Splitting
  85: 'stars',     // Al-Buruj - The Great Stars
  86: 'night',     // At-Tariq - The Night-Comer
  87: 'light',     // Al-A'la - The Most High
  88: 'fire',      // Al-Ghashiyah - The Overwhelming
  89: 'dawn',      // Al-Fajr - The Dawn
  90: 'mountain',  // Al-Balad - The City
  91: 'dawn',      // Ash-Shams - The Sun
  92: 'night',     // Al-Layl - The Night
  93: 'dawn',      // Ad-Duha - The Morning Hours
  94: 'light',     // Ash-Sharh - The Opening Forth
  95: 'garden',    // At-Tin - The Fig
  96: 'cave',      // Al-Alaq - The Clot, first revelation
  97: 'night',     // Al-Qadr - The Night of Power
  98: 'light',     // Al-Bayyinah - The Clear Evidence
  99: 'fire',      // Az-Zalzalah - The Earthquake
  100: 'desert',   // Al-Adiyat - The Chargers
  101: 'mountain', // Al-Qari'ah - The Striking Hour
  102: 'desert',   // At-Takathur - The Rivalry
  103: 'sky',      // Al-Asr - The Declining Day
  104: 'fire',     // Al-Humazah - The Slanderer
  105: 'sky',      // Al-Fil - The Elephant
  106: 'desert',   // Quraysh - Quraysh
  107: 'rain',     // Al-Ma'un - Small Kindnesses
  108: 'waterfall',// Al-Kawthar - The Abundance
  109: 'light',    // Al-Kafirun - The Disbelievers
  110: 'dawn',     // An-Nasr - The Help
  111: 'fire',     // Al-Masad - The Palm Fiber
  112: 'light',    // Al-Ikhlas - The Sincerity, pure light
  113: 'dawn',     // Al-Falaq - The Daybreak
  114: 'mosque',   // An-Nas - Mankind, seeking refuge
};

/**
 * Get a Pollinations.ai image URL for a given Surah number.
 * Uses deterministic seed based on surah + ayah for consistent results.
 * 
 * @param {number} surahNumber - The Surah number (1-114)
 * @param {number} ayahNumber - The Ayah number (for seed variation)
 * @param {number} width - Desired image width
 * @param {number} height - Desired image height
 * @returns {string} The Pollinations.ai image URL
 */
export function getSurahImageUrl(surahNumber, ayahNumber = 1, width = 1080, height = 1920) {
  const category = SURAH_THEME_MAP[surahNumber] || 'mosque';
  const prompt = SCENE_CATEGORIES[category];
  
  // Use surah + ayah as seed for deterministic but varied results
  const seed = surahNumber * 1000 + (ayahNumber || 1);
  
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&nologo=true&seed=${seed}`;
}

/**
 * Get the theme category name for a Surah (for UI display)
 * @param {number} surahNumber 
 * @returns {string} Category name like 'Light', 'Ocean', etc.
 */
export function getSurahThemeCategory(surahNumber) {
  const category = SURAH_THEME_MAP[surahNumber] || 'mosque';
  return category.charAt(0).toUpperCase() + category.slice(1);
}

/**
 * Get all available scene categories (for potential future UI selector)
 */
export const AVAILABLE_SCENES = Object.keys(SCENE_CATEGORIES);

export default { getSurahImageUrl, getSurahThemeCategory, AVAILABLE_SCENES };

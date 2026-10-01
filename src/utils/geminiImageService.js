/**
 * Gemini AI Image Service for Quran AI Status Cards
 * Uses Google Generative AI (Gemini 2.5 Flash Image / Gemini 3.1 Flash Image)
 * to generate spiritual, high-definition status backgrounds for WhatsApp and social cards.
 */

import { getSurahThemeCategory, SURAH_THEME_MAP } from './surahImagePrompts';

// Local storage key for custom user-provided Gemini API key
const GEMINI_STORAGE_KEY = 'quran_ai_gemini_api_key';

/**
 * Detailed prompt templates tuned for Google Gemini Native Image Generation
 * Strictly adheres to Islamic guidelines: no living faces, no human depictions, no idols.
 * Focuses on sacred architecture, celestial skies, dawn, dunes, and divine light.
 */
const GEMINI_SCENE_PROMPTS = {
  light: "Divine warm golden light rays streaming into an ancient sacred Islamic sanctuary through an ornate arabesque archway, delicate volumetric sunbeams, serene spiritual tranquility, 8k cinematic photorealistic, tranquil and peaceful, completely no people, no living faces",
  night: "A radiant golden crescent moon glowing in a deep sapphire starlit midnight sky with sparkling celestial dust, distant silhouette of elegant minarets and graceful domes, royal dark blue aesthetic, 8k photorealistic, peaceful night, no human figures",
  nature: "An enchanting lush paradise garden (Rawdah) with crystal clear flowing water stream, olive trees, blooming white jasmine, warm golden hour sunbeams filtering through leaves, peaceful and sacred, 8k ultra high definition, no people",
  ocean: "A calm turquoise ocean at sunset with gentle glowing waves lapping on soft golden sand, silhouette of elegant domes on the far horizon, glowing amber and peach clouds, 8k photorealistic landscape, peaceful reflection, no people",
  desert: "Pristine golden desert sand dunes at dawn with sweeping wind ripples, warm amber sunrise casting soft golden light, distant contemplative desert horizon, majestic spiritual stillness, 8k cinematic photography, no people",
  mountain: "Majestic snow-crested mountain peaks illuminated by the first golden light of dawn, soft mist resting in the peaceful valley below, crystal clear river, spiritual awe and grandeur, 8k ultra realistic, no people",
  mosque: "Grand sacred Islamic mosque courtyard paved with polished white marble reflecting golden twilight, illuminated majestic domes and tall minarets, intricate geometric patterns, peaceful sacred stillness, 8k architecture photography, no people",
  sky: "Breathtaking twilight sky filled with ethereal amber, rose-gold, and violet clouds, gentle crescent moon, birds in graceful flight in the far distance, magnificent celestial canvas, 8k photorealistic, no people",
  rain: "Gentle blessing rain falling over an ancient Islamic courtyard garden, water ripples on polished marble stones, lush wet foliage, soft diffused heavenly light, contemplative and deeply soothing, 8k photorealistic, no people",
  fire: "Dramatic desert sunset with deep crimson, amber, and gold twilight sky, ancient stone fortress silhouette on a distant ridge, awe-inspiring atmospheric power and majesty, 8k cinematic photography, no people",
  dawn: "Splendid dawn (Fajr) breaking over an ancient Islamic city with glowing golden domes and minarets shrouded in soft morning mist, pastel skies of peach and lavender, spiritual awakening, 8k photorealistic, no people",
  garden: "Luxurious Islamic courtyard garden with geometric marble fountains, blooming Damask roses and sweet oranges, ornate arched portico, peaceful afternoon golden hour light, 8k masterpiece, no people",
  cave: "Sacred mountain cave interior (like Cave of Hira) opening to a view of the desert horizon at dawn, warm divine golden light pouring into the stone opening, profound spiritual refuge, 8k cinematic, no people",
  stars: "The vast cosmic celestial heavens filled with brilliant constellations, glowing nebulas in deep indigo and sapphire, a slender golden crescent moon, awe-inspiring creation of Allah, 8k ultra high resolution, no people",
  waterfall: "Magnificent cascading mountain waterfall in an oasis paradise, crystal waters flowing into a serene pool, lush date palms and blooming wildflowers, misty golden sunbeams, 8k photorealistic, no people"
};

/**
 * Get the currently active Gemini API key (Automatically resolved from environment, no manual input needed)
 */
export function getActiveGeminiKey() {
  const envKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) ? import.meta.env.VITE_GEMINI_API_KEY.trim() : '';
  if (envKey && envKey.length > 10) {
    return envKey;
  }
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(GEMINI_STORAGE_KEY);
    if (stored && stored.trim().length > 10) {
      return stored.trim();
    }
  }
  return '';
}

/**
 * Store a custom Gemini API key (optional)
 */
export function saveGeminiKey(key) {
  if (typeof window === 'undefined') return;
  if (!key || key.trim().length === 0) {
    localStorage.removeItem(GEMINI_STORAGE_KEY);
  } else {
    localStorage.setItem(GEMINI_STORAGE_KEY, key.trim());
  }
}

/**
 * Check if a Gemini API key is configured (Always true with auto-key)
 */
export function hasGeminiKey() {
  const key = getActiveGeminiKey();
  return Boolean(key && key.trim().length > 10);
}

/**
 * Build the Gemini Image prompt for a specific Surah
 */
export function buildGeminiPrompt(surahNumber, ayahNumber = 1, surahName = '', aspectRatio = 'status') {
  const category = SURAH_THEME_MAP[surahNumber] || 'mosque';
  const baseDescription = GEMINI_SCENE_PROMPTS[category] || GEMINI_SCENE_PROMPTS.mosque;
  const ratioText = aspectRatio === 'status' ? 'Vertical 9:16 aspect ratio smartphone wallpaper format' : 'Square 1:1 aspect ratio format';
  
  return `${ratioText}. High resolution spiritual background image for Quran reflection. Theme: Surah ${surahName || surahNumber}. ${baseDescription}. Clean atmospheric composition with soft vignette, optimal for typography overlay in center, 8k masterpiece, completely no human faces, no living figures, no idols.`;
}

/**
 * Generate image using Google Gemini native image models
 * Supported Models:
 * - gemini-2.5-flash-image
 * - gemini-3.1-flash-image
 * 
 * @param {Object} options
 * @param {number} options.surahNumber
 * @param {number} options.ayahNumber
 * @param {string} options.surahName
 * @param {string} options.aspectRatio - 'status' (9:16) or 'square' (1:1)
 * @param {string} [options.customKey] - Optional override key
 * @returns {Promise<{ success: boolean, imageUrl?: string, error?: string, prompt?: string, isKeyError?: boolean }>}
 */
export async function generateGeminiStatusImage({
  surahNumber = 1,
  ayahNumber = 1,
  surahName = '',
  aspectRatio = 'status',
  customKey = ''
}) {
  const apiKey = (customKey || getActiveGeminiKey()).trim();

  if (!apiKey) {
    return {
      success: false,
      error: 'Gemini API key is not configured. Please enter your Google AI Studio API key.',
      isKeyError: true
    };
  }

  const prompt = buildGeminiPrompt(surahNumber, ayahNumber, surahName, aspectRatio);

  // Models to try in sequence
  const models = ['gemini-2.5-flash-image', 'gemini-3.1-flash-image'];

  for (const model of models) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ]
        })
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        const errMsg = data.error?.message || `HTTP ${res.status}: Failed to generate image`;
        const isKeyError = res.status === 400 || res.status === 403 || errMsg.toLowerCase().includes('api key') || errMsg.toLowerCase().includes('permission');
        
        console.warn(`[Gemini Image API error with ${model}]:`, errMsg);
        // If it's an API key error, don't retry other models with the same broken key
        if (isKeyError) {
          return {
            success: false,
            error: errMsg,
            isKeyError: true,
            prompt
          };
        }
        // Try next model if 404 or other issue
        continue;
      }

      // Check for inline image data in parts
      const parts = data.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          const mimeType = part.inlineData.mimeType || 'image/jpeg';
          const imageUrl = `data:${mimeType};base64,${part.inlineData.data}`;
          return {
            success: true,
            imageUrl,
            prompt
          };
        }
      }

    } catch (err) {
      console.warn(`[Gemini Image network error with ${model}]:`, err);
    }
  }

  return {
    success: false,
    error: 'Gemini model did not return image data. Check if your API key has image generation permissions.',
    isKeyError: false,
    prompt
  };
}

export default {
  getActiveGeminiKey,
  saveGeminiKey,
  hasGeminiKey,
  buildGeminiPrompt,
  generateGeminiStatusImage
};

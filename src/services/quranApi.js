import axios from 'axios';

const BASE_URL = 'https://api.alquran.cloud/v1';

export const fetchSurahs = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/surah`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching surahs:', error);
        throw error;
    }
};

// ── In-memory cache so the same surah never fetches twice ───────────────
const surahCache = {};

export const fetchSurahDetails = async (number, onEnrichment) => {
    // Return from cache immediately if available
    if (surahCache[number]) {
        return surahCache[number];
    }

    // ── STEP 1 : Fast fetch — Arabic + English only (opens page instantly) ──
    const fastResponse = await axios.get(
        `${BASE_URL}/surah/${number}/editions/quran-uthmani,en.asad`,
        { timeout: 12000 }
    );

    const [arabic, translation] = fastResponse.data.data;
    const baseAyahs = arabic.ayahs.map((ayah, i) => ({
        ...ayah,
        translation:        translation.ayahs[i].text,
        translationEdition: translation.edition,
        hindi: '', bengali: '', urdu: '', roman: '', audioUrdu: null,
    }));
    const baseResult = { ...arabic, ayahs: baseAyahs };

    // Cache and return immediately so page renders fast
    surahCache[number] = baseResult;

    // ── STEP 2 : Background enrich — remaining 5 editions ────────────────
    // Fires after the page has already rendered, then calls onEnrichment
    // callback so the caller can update state with full data
    if (typeof onEnrichment === 'function') {
        axios.get(
            `${BASE_URL}/surah/${number}/editions/hi.farooq,bn.bengali,ur.jalandhry,en.transliteration,ur.khan`,
            { timeout: 30000 }
        ).then(r => {
            const [hindi, bengali, urdu, roman, audioUrdu] = r.data.data;
            const enrichedAyahs = baseAyahs.map((ayah, i) => ({
                ...ayah,
                hindi:     hindi.ayahs[i].text,
                bengali:   bengali.ayahs[i].text,
                urdu:      urdu.ayahs[i].text,
                roman:     roman.ayahs[i].text,
                audioUrdu: audioUrdu.ayahs[i].audio,
            }));
            const enriched = { ...baseResult, ayahs: enrichedAyahs };
            surahCache[number] = enriched;   // update cache
            onEnrichment(enriched);          // notify caller
        }).catch(e => {
            console.warn(`Background enrichment failed for surah ${number}:`, e.message);
        });
    }

    return baseResult;
};

export const fetchRandomAyah = async () => {
    try {
        // Fetch a random ayah globally (1-6236)
        const globalAyahNum = Math.floor(Math.random() * 6236) + 1;
        const response = await axios.get(`${BASE_URL}/ayah/${globalAyahNum}/editions/quran-uthmani,en.asad`);
        return {
            arabic: response.data.data[0],
            translation: response.data.data[1]
        };
    } catch (error) {
        console.error('Error fetching random ayah:', error);
        throw error;
    }
};

export const fetchAyahTafsir = async (surahNumber, ayahNumberInSurah) => {
    try {
        // Fetching Tafsir al-Jalalayn (en.jalalayn) - simplified commentary
        // Ideally we'd use a more detailed one if available, but let's start here.
        // We can request multiple editions.
        const response = await axios.get(`${BASE_URL}/ayah/${surahNumber}:${ayahNumberInSurah}/editions/en.jalalayn`);
        return response.data.data[0];
    } catch (error) {
        console.error(`Error fetching tafsir for ${surahNumber}:${ayahNumberInSurah}:`, error);
        // Fallback or rethrow
        return null;
    }
}

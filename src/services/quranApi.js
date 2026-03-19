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

export const fetchSurahDetails = async (number) => {
    try {
        // Requesting multiple editions: Quran, English, Hindi, Bengali, Urdu, Roman/Transliteration, Audio (Urdu - Shamshad Ali Khan)
        const response = await axios.get(`${BASE_URL}/surah/${number}/editions/quran-uthmani,en.asad,hi.farooq,bn.bengali,ur.jalandhry,en.transliteration,ur.khan`, { timeout: 20000 });
        const arabic = response.data.data[0];
        const translation = response.data.data[1];
        const hindi = response.data.data[2];
        const bengali = response.data.data[3];
        const urdu = response.data.data[4];
        const roman = response.data.data[5];
        const audioUrdu = response.data.data[6];

        const ayahs = arabic.ayahs.map((ayah, index) => ({
            ...ayah,
            translation: translation.ayahs[index].text,
            translationEdition: translation.edition,
            hindi: hindi.ayahs[index].text,
            bengali: bengali.ayahs[index].text,
            urdu: urdu.ayahs[index].text,
            roman: roman.ayahs[index].text,
            audioUrdu: audioUrdu.ayahs[index].audio // URL for Urdu recitation
        }));

        return { ...arabic, ayahs };
    } catch (error) {
        console.error(`Error fetching surah ${number}:`, error);
        throw error;
    }
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

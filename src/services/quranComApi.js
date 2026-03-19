import axios from 'axios';

const BASE_URL = 'https://api.quran.com/api/v4';

// Get detailed info/summary for a chapter
export const fetchChapterInfo = async (chapterId, language = 'en') => {
    try {
        const response = await axios.get(`${BASE_URL}/chapters/${chapterId}/info`, {
            params: { language },
            timeout: 10000
        });
        return response.data.chapter_info;
    } catch (error) {
        console.error(`Error fetching info for chapter ${chapterId}:`, error);
        return null;
    }
};

// Get verses with word-by-word audio and text
// We use 'words=true' and 'word_fields=audio_url,text_uthmani,text_indopak'
export const fetchVersesWithWords = async (chapterId) => {
    try {
        const response = await axios.get(`${BASE_URL}/verses/by_chapter/${chapterId}`, {
            params: {
                words: true,
                word_fields: 'audio_url,text_uthmani,location,transliteration',
                per_page: 50, // Fetch first 50 verses for now to avoid huge payload
                page: 1
            },
            timeout: 15000
        });
        return response.data.verses;
    } catch (error) {
        console.error(`Error fetching verses for chapter ${chapterId}:`, error);
        throw error;
    }
};

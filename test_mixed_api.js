
import axios from 'axios';

const testMixedEditions = async () => {
    try {
        const response = await axios.get('http://api.alquran.cloud/v1/surah/1/editions/quran-uthmani,ur.khan');
        console.log(`Edition 0 Type: ${response.data.data[0].edition.format}`);
        console.log(`Edition 1 Type: ${response.data.data[1].edition.format}`);
        console.log(`Audio sample: ${response.data.data[1].ayahs[0].audio}`);
    } catch (error) {
        console.error('Error:', error.message);
    }
};

testMixedEditions();

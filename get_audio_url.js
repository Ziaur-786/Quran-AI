
import axios from 'axios';

const fetchAudioUrls = async () => {
    try {
        const response = await axios.get('http://api.alquran.cloud/v1/surah/1/editions/ur.khan');
        const data = response.data.data[0]; // Assuming first edition is the audio one
        console.log(`Edition: ${data.edition.name}`);
        console.log(`First Ayah Audio: ${data.ayahs[0].audio}`);
        console.log(`Second Ayah Audio: ${data.ayahs[1].audio}`);
    } catch (error) {
        console.error('Error:', error.message);
    }
};

fetchAudioUrls();

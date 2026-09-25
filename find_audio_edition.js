
import axios from 'axios';

const fetchAudioEditions = async () => {
    try {
        const response = await axios.get('http://api.alquran.cloud/v1/edition?format=audio&language=ur');
        const editions = response.data.data;
        console.log('Available Urdu Audio Editions:');
        editions.forEach(e => {
            console.log(`- ${e.name} (${e.identifier})`);
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
};

fetchAudioEditions();

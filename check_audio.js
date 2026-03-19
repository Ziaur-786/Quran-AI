
import https from 'https';

const urls = [
    'https://archive.org/download/UrduQuranTranslation/001.mp3',
    'https://download.quranicaudio.com/quran/urdu_shamshad_ali_khan/001.mp3',
    'https://server6.mp3quran.net/urdu/001.mp3',
    'https://server10.mp3quran.net/urdu/001.mp3'
];

urls.forEach(url => {
    const req = https.request(url, { method: 'HEAD' }, (res) => {
        console.log(`${url}: ${res.statusCode}`);
    });
    req.on('error', (e) => {
        console.error(`${url}: Error - ${e.message}`);
    });
    req.end();
});

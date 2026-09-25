
const https = require('https');

const urls = [
    "https://raw.githubusercontent.com/adnan/Arabic-Alphabet/main/audio/Alif.mp3",
    "https://raw.githubusercontent.com/adnan/Arabic-Alphabet/main/audio/Ba.mp3",
    "https://raw.githubusercontent.com/redwan-panda/arabic-alphabet-audio/main/audio/alif.mp3",
    "https://raw.githubusercontent.com/HassanAlthaf/arabic-alphabet/master/assets/audio/alif.mp3",
    "https://raw.githubusercontent.com/HassanAlthaf/arabic-alphabet/master/audio/alif.mp3",
    "https://raw.githubusercontent.com/barismeral/arabic-alphabet/master/audio/alif.mp3",
    "https://raw.githubusercontent.com/ozcanzaferayan/arabic-alphabet/master/src/assets/audio/alif.mp3",
    "https://raw.githubusercontent.com/MhmdFaris/Makharij-App/master/assets/audio/alif.mp3",
    "https://media.blubrry.com/muslim_central_quran/podcasts.muslimcentral.com/quran/mishary-rashid-alafasy/001.mp3"
];

urls.forEach(url => {
    https.get(url, (res) => {
        console.log(`${url}: ${res.statusCode}`);
    }).on('error', (e) => {
        console.log(`${url}: Error ${e.message}`);
    });
});

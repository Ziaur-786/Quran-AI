
const fs = require('fs');
const path = require('path');
const https = require('https');

const letters = [
    { char: 'ا', name: 'Alif' },
    { char: 'ب', name: 'Ba' },
    { char: 'ت', name: 'Ta' },
    { char: 'ث', name: 'Tha' },
    { char: 'ج', name: 'Jeem' },
    { char: 'ح', name: 'Ha' },
    { char: 'خ', name: 'Kha' },
    { char: 'د', name: 'Dal' },
    { char: 'ذ', name: 'Thal' },
    { char: 'ر', name: 'Ra' },
    { char: 'ز', name: 'Zay' },
    { char: 'س', name: 'Seen' },
    { char: 'ش', name: 'Sheen' },
    { char: 'ص', name: 'Sad' },
    { char: 'ض', name: 'Dad' },
    { char: 'ط', name: 'Ta' },
    { char: 'ظ', name: 'Za' },
    { char: 'ع', name: 'Ayn' },
    { char: 'غ', name: 'Ghayn' },
    { char: 'ف', name: 'Fa' },
    { char: 'ق', name: 'Qaf' },
    { char: 'ك', name: 'Kaf' },
    { char: 'ل', name: 'Lam' },
    { char: 'm', name: 'Meem' },
    { char: 'ن', name: 'Noon' },
    { char: 'ه', name: 'Ha' },
    { char: 'و', name: 'Waw' },
    { char: 'ي', name: 'Ya' },
];

const outputDir = 'c:/Quran AI/public/audio/qaida';

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const downloadAudio = (char, filename) => {
    // Special handling for some chars if needed, but Google TTS usually handles UTF-8 arabic well.
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(char)}&tl=ar&client=tw-ob`;
    const filePath = path.join(outputDir, filename);
    const file = fs.createWriteStream(filePath);

    https.get(url, (response) => {
        if (response.statusCode === 200) {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`Downloaded: ${filename}`);
            });
        } else {
            console.error(`Failed to download ${filename}: Status Code ${response.statusCode}`);
            fs.unlink(filePath, () => { }); // Delete partial file
        }
    }).on('error', (err) => {
        fs.unlink(filePath, () => { });
        console.error(`Error downloading ${filename}: ${err.message}`);
    });
};

letters.forEach(letter => {
    downloadAudio(letter.char, `${letter.name}.mp3`);
});

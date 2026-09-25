
const fs = require('fs');
const path = require('path');

const xmlPath = 'c:/Quran AI/archive_files.xml';
const outputPath = 'c:/Quran AI/src/data/bengaliAudioMap.js';

try {
    const xmlContent = fs.readFileSync(xmlPath, 'utf-8');
    const regex = /name="(\d{3})([^"]+\.mp3)"/g;
    let match;
    const mapping = {};

    while ((match = regex.exec(xmlContent)) !== null) {
        const fullFilename = match[1] + match[2];
        // Only include MP3s, ignore duplicates or weird files if any (regex handles .mp3)
        // Check if it's a main file (usually VBR MP3 is the main one)
        // The regex captures simpler structure.

        // Parse the Surah number (e.g. 001)
        const surahNum = parseInt(match[1], 10);

        // We might encounter duplicates because of "source='original'" vs "source='derivative'" (but filenames are usually distinct for derivatives like .png or .afpk, except we are matching .mp3)
        // The XML shows: <file name="001 SURA FATIHA AND OPENING.mp3" source="original">
        // So uniqueness on filename should be fine.

        mapping[surahNum] = fullFilename;
    }

    console.log(`Found ${Object.keys(mapping).length} audio files.`);

    const fileContent = `export const bengaliAudioMap = ${JSON.stringify(mapping, null, 4)};\n`;

    // Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, fileContent);
    console.log('Successfully wrote mapping to ' + outputPath);

} catch (err) {
    console.error('Error:', err);
}

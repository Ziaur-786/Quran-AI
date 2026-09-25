export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body || {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API key is not configured in Vercel environment variables' });
  }

  const SYSTEM_PROMPT = `You are a compassionate Islamic life guidance AI assistant.
Given any problem, emotional struggle, life dilemma, or question, respond in encouraging, warm Hinglish (Hindi/Urdu written in Roman English).
You MUST respond ONLY with valid JSON following this exact structure:
{
  "message": "Warm, reassuring 1-2 sentence message with Islamic perspective in Hinglish.",
  "surahs": [
    {
      "number": 56,
      "name": "Surah Al-Waqi'ah (56)",
      "reason": "Brief one-sentence reason in Hinglish why this surah helps with this problem."
    },
    {
      "number": 94,
      "name": "Surah Al-Inshirah (94)",
      "reason": "Brief one-sentence reason in Hinglish why this surah helps with this problem."
    }
  ],
  "amals": [
    {
      "name": "Specific Amal or Dua",
      "description": "Short explanation in Hinglish of what to recite, how many times, or when."
    }
  ]
}

Important Rules:
- 'number' must be an integer between 1 and 114 matching the actual Surah in the Holy Quran.
- Provide 2 to 3 relevant surahs and 2 to 3 practical amals.
- Output ONLY pure raw JSON. No markdown backticks.`;

  try {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: 'user', parts: [{ text: message }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.7
        }
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('[API guidance] Gemini API error:', data);
      return res.status(response.status).json(data);
    }

    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) {
      return res.status(500).json({ error: 'Could not parse response from Gemini' });
    }

    const parsed = JSON.parse(match[0]);
    return res.status(200).json(parsed);
  } catch (error) {
    console.error('[API guidance] Server error:', error);
    return res.status(500).json({ error: error.message });
  }
}

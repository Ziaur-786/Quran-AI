# 📖 Quran AI - Translate, Learn & Live Quran

A modern, fast, and mobile-optimized web application to read, listen, and understand the Holy Quran, featuring an AI-powered Islamic Life Guidance assistant powered by Google Gemini.

---

## ✨ Features

- 🔑 **Google Account Sign-In**: Direct client-side Google OAuth 2.0 (Google Identity Services) without 3rd-party BaaS (No Supabase required).
- 📈 **Dynamic User Learning Progress**: Real daily recitation streak calculations, ayah read counters, quiz accuracy, and authentic milestone badges.
- 📖 **Quran Reader**: Arabic text with English, Hindi, Urdu, Bengali translations, Tafsir & audio recitations.
- 📚 **Live Quran (3D Book)**: Realistic interactive 3D page flip book with word-by-word transliteration for all 604 Safa. Fully mobile-responsive.
- 🤖 **Islamic Life Guidance Bot**: Ask any life problem or question in Hinglish / English, and receive compassionate Islamic advice, relevant Surah recommendations with direct audio links, and recommended amals/duas powered by Google Gemini.
- 🔤 **Qaida (Basics)**: Learn the Arabic alphabet with pronunciation and interactive audio for beginners.
- 🎓 **Quiz Mode & Vocabulary Builder**: Test your knowledge and learn Quranic vocabulary with interactive flashcards.

---

## 🚀 Live Demo & Hosting

This app is configured for 1-click deployment on **Vercel** with client-side SPA routing (`vercel.json`).

### Environment Variables

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

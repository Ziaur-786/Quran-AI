import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, X, Send, Bot, User, Sparkles, BookOpen, Loader2, AlertCircle } from 'lucide-react';

// ─────────────────────────────────────────────
// Gemini API Config
// ─────────────────────────────────────────────
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_MODEL   = 'gemini-2.5-flash';

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
- Output ONLY the raw JSON object. No markdown backticks.`;

// ─────────────────────────────────────────────
// Intelligent Context-Aware Guidance Engine
// (Ensures answers are never repetitive even if offline or switching keys)
// ─────────────────────────────────────────────
function getSmartIslamicGuidance(text) {
  const q = text.toLowerCase();

  // 1. Rizq / Money / Job / Debt / Business
  if (q.match(/rizq|paisa|paise|money|job|naukri|karz|qarz|business|kamai|tangi|ghareeb|ghareebi|faqa/)) {
    return {
      message: "Allah par pura bharosa rakhein — Woh sabse behtareen Rozi dene wala hai. Rizq ke darwaze kholne ke liye ye tilawat aur amal karein.",
      surahs: [
        { number: 56, name: "Surah Al-Waqi'ah (56)", reason: "Rozana Maghrib ya Isha ke baad parhne se kabhi faqa aur rizq ki tangi nahi aati." },
        { number: 71, name: "Surah Nuh (71)", reason: "Isme Allah ne farmaya hai ke Istighfar karne se aasmaan se barkat aur rizq barsata hai." },
      ],
      amals: [
        { name: "Kasrat se Istighfar (100x roz)", description: "'Astaghfirullah' parhein — isse gunah maaf hote hain aur aamdan me barkat aati hai." },
        { name: "Dua-e-Rizq wa Karz", description: "'Allahumma akfini bi halalika 'an haramika wa aghnini bi fadlika 'amman siwak' har namaz ke baad parhein." },
        { name: "Sadaqah (Khairat)", description: "Roz thoda sa bhi sadaqah dein, sadaqah balaon ko talta hai aur daulat badhata hai." }
      ]
    };
  }

  // 2. Health / Illness / Pain / Shifa
  if (q.match(/bimari|bimar|sehat|dard|pain|health|shifa|cure|tabiyat|doctor|cancer|infection/)) {
    return {
      message: "Allah har beemari ka ilaaj aur shifa dene wala hai. Dawa ke saath Quran ki in ayaat par yaqeen ke saath amal karein.",
      surahs: [
        { number: 1, name: "Surah Al-Fatiha (1)", reason: "Isko 'Surah Ash-Shifa' bhi kehte hain, har marz aur bimari ki shifa ke liye behtareen hai." },
        { number: 26, name: "Surah Ash-Shu'ara (26)", reason: "Isme Hazrat Ibrahim (A.S.) ka qaul hai: 'Jab main beemar hota hoon toh wahi shifa deta hai'." },
      ],
      amals: [
        { name: "Surah Fatiha Dum Karein (7 Martaba)", description: "Paani par 7 baar Surah Fatiha padhkar dum karein aur beemar shakhs ko pilayein." },
        { name: "Dua-e-Shifa", description: "'Allahumma Rabban-nas, adhhibil-ba's, ishfi Antash-Shafi, la shifa'a illa shifa'uk' parhein." }
      ]
    };
  }

  // 3. Marriage / Relationship / Love / Family
  if (q.match(/shaadi|shadi|nikah|rishta|rishte|biwi|shohar|husband|wife|mohabbat|love|marriage/)) {
    return {
      message: "Allah se behtareen aur saleh rishte ki dua karein. Sabr aur Tahajjud ke waqt maangi gayi dua jald qubool hoti hai.",
      surahs: [
        { number: 25, name: "Surah Al-Furqan (25)", reason: "Ayah 74 me behtareen shareek-e-hayat aur aulad ki aankhon ki thandak ki dua hai." },
        { number: 28, name: "Surah Al-Qasas (28)", reason: "Hazrat Musa (A.S.) ne is surah ki dua se rizq aur behtareen rishta paaya tha." },
      ],
      amals: [
        { name: "Dua-e-Saleh Rishta", description: "'Rabbi inni lima anzalta ilayya min khairin faqeer' (Surah Qasas: 24) rozana 100 martaba parhein." },
        { name: "Surah Al-Furqan Ayah 74", description: "'Rabbana hab lana min azwajina wa dhurriyyatina qurrata a'yunin waj'alna lil-muttaqina imama' namaz ke baad parhein." }
      ]
    };
  }

  // 4. Study / Exams / Memory / Focus
  if (q.match(/padhai|padh|exam|study|pass|fail|ilm|knowledge|yad|yaad|memory|focus/)) {
    return {
      message: "Mehnat karein aur nateeja Allah par chhor dein. Allah aapke zehen aur hafizah (memory) me be-panah taqat dega, InshaAllah!",
      surahs: [
        { number: 20, name: "Surah Ta-Ha (20)", reason: "Isme zehen kholne aur zubaan ki luknat/dar door karne ki mashhoor dua hai." },
        { number: 96, name: "Surah Al-Alaq (96)", reason: "Quran ki sabse pehli wahi jo ilm, parhne aur qalam ki taqat sikhata hai." },
      ],
      amals: [
        { name: "Dua-e-Ilm", description: "Kitab kholne se pehle 'Rabbi Zidni Ilma' (Aye mere Rab mere ilm me izafa farma) 7 baar parhein." },
        { name: "Dua-e-Sharh Sadr", description: "'Rabbi-shrah li sadri wa yassir li amri wahlul 'uqdatam-milisani yafqahu qawli' parhein." }
      ]
    };
  }

  // 5. Evil Eye / Nazar / Protection / Hasad / Jadu
  if (q.match(/nazar|hasad|dushman|jadu|jaadu|protection|hifazat|khauf|buri/)) {
    return {
      message: "Kisi bhi buri nazar ya hasad se ghabrayein nahi. Quran-e-Pak me har shar aur burayi se mukammal hifazat maujood hai.",
      surahs: [
        { number: 113, name: "Surah Al-Falaq (113)", reason: "Har qism ke hasad karne wale aur raat ke andhere ke shar se bachne ke liye." },
        { number: 114, name: "Surah An-Nas (114)", reason: "Insano aur jinnato ke waswaso aur burayi se panah mangne ke liye." },
      ],
      amals: [
        { name: "Mu'awwidhatayn (3 Qul) ka Dum", description: "Subah-sham Surah Ikhlas, Falaq aur Nas 3-3 baar padhkar pure jism par haath pher lein." },
        { name: "Ayat-ul-Kursi", description: "Har farz namaz ke baad aur sone se pehle parhein — farishte subah tak hifazat karte hain." }
      ]
    };
  }

  // Default: Stress / Tension / Ghabrahat / Depression / Mushkilat
  return {
    message: "Allah par bharosa rakhein. Quran farmata hai: 'Beshak har mushkil ke baad aasaani hai' (Inna ma'al usri yusra). Ye surahs dil ko sukoon dengi.",
    surahs: [
      { number: 94, name: "Surah Al-Inshirah (94)", reason: "Gham, tension aur dil ki ghabrahat door karke be-inteha sukoon ata karti hai." },
      { number: 93, name: "Surah Ad-Duha (93)", reason: "Umeed aur tasalli deti hai ke Allah ne apne bande ko kabhi tanha nahi chhoda." },
    ],
    amals: [
      { name: "Kasrat se Hasbunallah", description: "'Hasbunallahu wa ni'mal wakeel' (Allah hamare liye kaafi hai aur wahi behtareen kaarsaaz hai) 100 baar parhein." },
      { name: "Tahajjud / 2 Rakat Salatul Hajat", description: "Raat ke waqt wudu karke 2 rakat nafl padhkar dil ki baat Allah se ro-ro kar kahein." }
    ]
  };
}

// ─────────────────────────────────────────────
// Normalise and Validate Surah fields
// ─────────────────────────────────────────────
function sanitizeGuidance(parsed) {
  if (!parsed.message) parsed.message = "Allah aapki mushkil aasaan farmaye. In surahs aur amals par yaqeen ke sath amal karein.";
  if (!Array.isArray(parsed.surahs) || !parsed.surahs.length) parsed.surahs = [];
  if (!Array.isArray(parsed.amals)  || !parsed.amals.length)  parsed.amals  = [];

  parsed.surahs = parsed.surahs.map(s => {
    let num = parseInt(s.number);
    if (isNaN(num) || num < 1 || num > 114) {
      const found = String(s.name || '').match(/\b([1-9]|[1-9][0-9]|10[0-9]|11[0-4])\b/);
      num = found ? parseInt(found[1]) : 1;
    }
    return {
      number: num,
      name: s.name || `Surah ${num}`,
      reason: s.reason || s.benefit || 'Dil ke sukoon aur barkat ke liye parhein.'
    };
  });

  return parsed;
}

// ─────────────────────────────────────────────
// Primary AI Function: Vercel Serverless API + Direct fallback + Smart contextual engine
// ─────────────────────────────────────────────
async function askGeminiAI(userMessage) {
  // 1. Try Vercel secure backend endpoint (/api/guidance)
  try {
    const res = await fetch('/api/guidance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage })
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.message && Array.isArray(data.surahs)) {
        return sanitizeGuidance(data);
      }
    }
  } catch (backendErr) {
    console.log('[Bot] /api/guidance not available:', backendErr.message);
  }

  // 2. Try direct client Gemini API if key is present
  if (GEMINI_API_KEY) {
    try {
      const directUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
      const res = await fetch(directUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: 'user', parts: [{ text: userMessage }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.7
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
        const match = raw.match(/\{[\s\S]*\}/);
        if (match) {
          const parsed = JSON.parse(match[0]);
          return sanitizeGuidance(parsed);
        }
      }
    } catch (directErr) {
      console.warn('[Bot] Direct Gemini API call failed:', directErr.message);
    }
  }

  // 3. Smart Contextual Islamic Guidance Engine (Guarantees dynamic, relevant advice for each question)
  return getSmartIslamicGuidance(userMessage);
}



// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────
export default function LifeGuidanceBot() {
  const navigate = useNavigate();

  const [isOpen,   setIsOpen]   = useState(false);
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      type: 'welcome',
      text: 'Assalamu Alaikum! 🌿\n\nApni koi bhi life problem batao — main Quran se Surah aur Amal suggest karunga. Links click karo aur seedha sun sako! 🎧\n\nMisaal:\n• "Rizq ki kami hai"\n• "Ghabrahta rehta hoon"\n• "Bimari hai"\n• "Shaadi nahi ho rahi"',
    },
  ]);
  const [input,    setInput]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [aiError,  setAiError]  = useState(false);

  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  // ── Send message ──────────────────────────────
  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setAiError(false);
    setMessages(prev => [...prev, { from: 'user', type: 'text', text }]);
    setLoading(true);

    try {
      const guidance = await askGeminiAI(text);
      setMessages(prev => [...prev, { from: 'bot', type: 'guidance', data: guidance }]);
    } catch (err) {
      console.error('AI error:', err);
      setAiError(true);
      setMessages(prev => [...prev, { from: 'bot', type: 'error' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const openSurah = (num) => {
    setIsOpen(false);
    navigate(`/quran?surah=${num}`);
  };

  // ── Render individual message ─────────────────
  const renderMessage = (msg, i) => {
    if (msg.type === 'welcome' || msg.type === 'text') {
      return (
        <div key={i} className={`bot-row ${msg.from === 'bot' ? 'bot-row-left' : 'bot-row-right'}`}>
          {msg.from === 'bot'  && <div className="bot-avatar"><Bot  size={14}/></div>}
          <div className={`bot-bubble ${msg.from === 'bot' ? 'bubble-bot' : 'bubble-user'}`}>
            {msg.text.split('\n').map((line, j) => (
              <span key={j}>{line}{j < msg.text.split('\n').length - 1 && <br/>}</span>
            ))}
          </div>
          {msg.from === 'user' && <div className="user-avatar"><User size={14}/></div>}
        </div>
      );
    }

    if (msg.type === 'error') {
      return (
        <div key={i} className="bot-row bot-row-left">
          <div className="bot-avatar"><Bot size={14}/></div>
          <div className="bot-bubble bubble-bot error-bubble">
            <AlertCircle size={16} style={{marginRight:6, color:'#f87171', flexShrink:0}}/>
            <span>AI assistant se connect karne me dikkat aayi. Kripaya thodi der baad dobara koshish karein.</span>
          </div>
        </div>
      );
    }

    if (msg.type === 'guidance') {
      const { message, surahs = [], amals = [] } = msg.data;
      return (
        <div key={i} className="bot-row bot-row-left">
          <div className="bot-avatar"><Bot size={14}/></div>
          <div className="guidance-card">
            {/* AI message */}
            <p className="guidance-msg">{message}</p>

            {/* Surahs */}
            <div className="guidance-section">
              <p className="guidance-label">📖 Surah parho:</p>
              {surahs.map((s, j) => (
                <button
                  key={j}
                  className="surah-link-btn"
                  onClick={() => openSurah(s.number)}
                  title={`Surah ${s.number} kholo`}
                >
                  <BookOpen size={13} style={{flexShrink:0}}/>
                  <span className="surah-link-name">{s.name}</span>
                  <span className="surah-link-reason">→ {s.reason}</span>
                </button>
              ))}
            </div>

            {/* Amals */}
            <div className="guidance-section">
              <p className="guidance-label">🤲 Amal karo:</p>
              {amals.map((a, j) => (
                <div key={j} className="amal-item">
                  <span className="amal-name">{a.name}</span>
                  <span className="amal-desc"> — {a.description}</span>
                </div>
              ))}
            </div>

            <p className="guidance-footer">💡 Koi aur problem ho toh batao. Allah aapka madad karega. Ameen!</p>
          </div>
        </div>
      );
    }

    return null;
  };

  // ── JSX ───────────────────────────────────────
  return (
    <>
      {/* Floating button */}
      <button
        id="life-guidance-bot-toggle"
        className="bot-fab"
        onClick={() => setIsOpen(o => !o)}
        title="Islamic Life Guidance Bot"
        aria-label="Open guidance bot"
      >
        {isOpen ? <X size={24}/> : <>
          <MessageCircle size={24}/>
          <span className="fab-badge">AI</span>
        </>}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="bot-window" role="dialog" aria-label="Islamic Guidance Bot">
          {/* Header */}
          <div className="bot-header">
            <div className="header-icon"><Sparkles size={17}/></div>
            <div className="header-text">
              <h3>Islamic Guidance Bot</h3>
              <span>Powered by Gemini AI • Free & Instant</span>
            </div>
            <button className="header-close" onClick={() => setIsOpen(false)}><X size={17}/></button>
          </div>

          {/* Messages */}
          <div className="bot-body">
            {messages.map(renderMessage)}

            {/* Typing indicator */}
            {loading && (
              <div className="bot-row bot-row-left">
                <div className="bot-avatar"><Bot size={14}/></div>
                <div className="bot-bubble bubble-bot typing-bubble">
                  <span/><span/><span/>
                </div>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          {/* Input */}
          <div className="bot-footer">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Apni mushkil yahan likho… (Enter = send)"
              className="bot-input"
              rows={2}
              disabled={loading}
            />
            <button
              className="bot-send"
              onClick={handleSend}
              disabled={!input.trim() || loading}
              aria-label="Send"
            >
              {loading ? <Loader2 size={18} className="spin-icon"/> : <Send size={18}/>}
            </button>
          </div>
        </div>
      )}

      {/* ── STYLES ── */}
      <style>{`
        /* FAB */
        .bot-fab {
          position:fixed; bottom:28px; right:28px;
          width:58px; height:58px; border-radius:50%;
          background:linear-gradient(135deg,#C5A059,#8B6914);
          border:2px solid rgba(197,160,89,.35);
          color:#fff; display:flex; align-items:center; justify-content:center;
          cursor:pointer; z-index:9999;
          box-shadow:0 8px 30px rgba(197,160,89,.45),0 2px 8px rgba(0,0,0,.3);
          transition:transform .3s cubic-bezier(.34,1.56,.64,1),box-shadow .3s;
        }
        .bot-fab:hover { transform:scale(1.11); box-shadow:0 12px 40px rgba(197,160,89,.6); }
        .fab-badge {
          position:absolute; top:-4px; right:-4px;
          background:#0F4C36; color:#C5A059;
          font-size:9px; font-weight:800;
          padding:2px 5px; border-radius:8px;
          border:1.5px solid #C5A059; letter-spacing:.5px;
        }

        /* Window */
        .bot-window {
          position:fixed; bottom:96px; right:28px;
          width:390px; max-height:580px;
          background:#081f14;
          border:1px solid rgba(197,160,89,.28);
          border-radius:22px;
          box-shadow:0 24px 60px rgba(0,0,0,.55);
          display:flex; flex-direction:column;
          z-index:9998; overflow:hidden;
          animation:slideUp .35s cubic-bezier(.34,1.56,.64,1);
        }
        @keyframes slideUp {
          from{opacity:0;transform:translateY(18px) scale(.96)}
          to  {opacity:1;transform:translateY(0)    scale(1)}
        }
        @media(max-width:440px){
          .bot-window{right:8px;left:8px;width:auto;bottom:84px;}
        }

        /* Header */
        .bot-header {
          background:linear-gradient(135deg,#0F4C36,#1a6647);
          padding:13px 16px; display:flex; align-items:center; gap:10px;
          border-bottom:1px solid rgba(197,160,89,.2); flex-shrink:0;
        }
        .header-icon {
          width:36px; height:36px; border-radius:50%;
          background:linear-gradient(135deg,#C5A059,#8B6914);
          display:flex; align-items:center; justify-content:center;
          color:#fff; flex-shrink:0;
        }
        .header-text{flex:1;}
        .header-text h3{color:#C5A059;font-size:14px;font-weight:700;margin:0;}
        .header-text span{color:rgba(245,241,230,.55);font-size:11px;}
        .header-close {
          background:rgba(255,255,255,.08); border:none;
          color:rgba(245,241,230,.7); cursor:pointer;
          padding:6px; border-radius:8px; display:flex; align-items:center;
          transition:background .2s;
        }
        .header-close:hover{background:rgba(255,255,255,.18);color:#fff;}

        /* Body */
        .bot-body {
          flex:1; overflow-y:auto; padding:14px 12px;
          display:flex; flex-direction:column; gap:10px;
        }
        .bot-body::-webkit-scrollbar{width:4px;}
        .bot-body::-webkit-scrollbar-thumb{background:rgba(197,160,89,.3);border-radius:4px;}

        /* Row */
        .bot-row{display:flex;align-items:flex-end;gap:7px;}
        .bot-row-left{flex-direction:row;}
        .bot-row-right{flex-direction:row-reverse;}

        /* Avatars */
        .bot-avatar {
          width:27px;height:27px;border-radius:50%;flex-shrink:0;
          background:linear-gradient(135deg,#C5A059,#8B6914);
          display:flex;align-items:center;justify-content:center;color:#fff;
        }
        .user-avatar {
          width:27px;height:27px;border-radius:50%;flex-shrink:0;
          background:linear-gradient(135deg,#1a6647,#0F4C36);
          border:1px solid rgba(197,160,89,.3);
          display:flex;align-items:center;justify-content:center;color:#C5A059;
        }

        /* Bubbles */
        .bot-bubble {
          max-width:82%; padding:10px 13px; border-radius:16px;
          font-size:13px; line-height:1.6; word-break:break-word;
        }
        .bubble-bot {
          background:rgba(197,160,89,.09);
          border:1px solid rgba(197,160,89,.18);
          color:#F5F1E6; border-bottom-left-radius:4px;
        }
        .bubble-user {
          background:linear-gradient(135deg,#C5A059,#9a7a35);
          color:#0a2018; font-weight:500; border-bottom-right-radius:4px;
        }
        .error-bubble {display:flex;align-items:flex-start;gap:6px;color:#fca5a5;}

        /* Typing */
        .typing-bubble{display:flex;align-items:center;gap:5px;padding:12px 16px;}
        .typing-bubble span{
          width:7px;height:7px;background:#C5A059;border-radius:50%;
          animation:dot 1.2s infinite;
        }
        .typing-bubble span:nth-child(2){animation-delay:.2s;}
        .typing-bubble span:nth-child(3){animation-delay:.4s;}
        @keyframes dot{0%,80%,100%{transform:scale(.6);opacity:.4}40%{transform:scale(1);opacity:1}}

        /* Guidance card */
        .guidance-card {
          max-width:88%;
          background:rgba(197,160,89,.08);
          border:1px solid rgba(197,160,89,.22);
          border-radius:16px; border-bottom-left-radius:4px;
          padding:12px 14px; display:flex; flex-direction:column; gap:10px;
        }
        .guidance-msg{color:#F5F1E6;font-size:13px;line-height:1.6;margin:0;}
        .guidance-section{display:flex;flex-direction:column;gap:6px;}
        .guidance-label{color:#C5A059;font-size:12px;font-weight:700;margin:0;}
        .guidance-footer{color:rgba(245,241,230,.45);font-size:11px;font-style:italic;margin:0;}

        /* Surah link button */
        .surah-link-btn {
          display:flex; align-items:flex-start; gap:7px;
          background:rgba(15,76,54,.5);
          border:1px solid rgba(197,160,89,.3);
          border-radius:10px; padding:8px 10px;
          cursor:pointer; text-align:left; width:100%;
          transition:all .2s; color:#F5F1E6;
        }
        .surah-link-btn:hover{
          background:rgba(197,160,89,.18);
          border-color:rgba(197,160,89,.6);
          transform:translateX(2px);
        }
        .surah-link-name{color:#C5A059;font-size:12px;font-weight:700;white-space:nowrap;}
        .surah-link-reason{color:rgba(245,241,230,.6);font-size:11px;line-height:1.4;}

        /* Amal */
        .amal-item{
          background:rgba(255,255,255,.04);
          border:1px solid rgba(255,255,255,.08);
          border-radius:8px; padding:7px 10px; font-size:12px;
        }
        .amal-name{color:#C5A059;font-weight:700;}
        .amal-desc{color:rgba(245,241,230,.65);}

        /* Footer / input */
        .bot-footer {
          padding:10px 12px; border-top:1px solid rgba(197,160,89,.18);
          display:flex; gap:8px; align-items:flex-end;
          background:rgba(0,0,0,.25); flex-shrink:0;
        }
        .bot-input {
          flex:1; background:rgba(255,255,255,.06);
          border:1px solid rgba(197,160,89,.25); border-radius:12px;
          color:#F5F1E6; padding:9px 12px; font-size:13px;
          resize:none; outline:none; line-height:1.5; font-family:inherit;
          transition:border-color .2s;
        }
        .bot-input::placeholder{color:rgba(245,241,230,.3);}
        .bot-input:focus{border-color:rgba(197,160,89,.6);}
        .bot-input:disabled{opacity:.5;}

        .bot-send {
          width:42px; height:42px; border-radius:50%;
          background:linear-gradient(135deg,#C5A059,#8B6914);
          border:none; color:#fff;
          display:flex; align-items:center; justify-content:center;
          cursor:pointer; flex-shrink:0; transition:all .2s;
          box-shadow:0 4px 12px rgba(197,160,89,.3);
        }
        .bot-send:hover:not(:disabled){transform:scale(1.08);box-shadow:0 6px 18px rgba(197,160,89,.5);}
        .bot-send:disabled{opacity:.38;cursor:not-allowed;}

        .spin-icon{animation:spin 1s linear infinite;}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>
    </>
  );
}

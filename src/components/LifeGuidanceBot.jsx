import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, X, Send, Bot, User, Sparkles, BookOpen, Loader2, AlertCircle } from 'lucide-react';

// ─────────────────────────────────────────────
// Gemini API config (Google AI Studio)
// ─────────────────────────────────────────────
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyCKEQ9QmjACC00iEZ0oyxNb1UqlquWUEi8';
const GEMINI_MODEL   = 'gemini-2.5-flash';
const GEMINI_URL     = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

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
// Fallback if AI parsing fails or offline
// ─────────────────────────────────────────────
const FALLBACK = {
  message: "Allah aapki mushkil zaroor aasaan karega. Yeh surah aur amal aazmaiye — inshaAllah farq padega.",
  surahs: [
    { number: 94, name: "Surah Al-Inshirah (94)", reason: "Har mushkil ke baad aasani aati hai — ye surah dil ko sukoon deti hai." },
    { number: 56, name: "Surah Al-Waqiah (56)",   reason: "Rizq aur mushkilat mein bohot mufiid surah hai." },
  ],
  amals: [
    { name: "Istighfar 100 baar roz", description: "Jo istighfar karta rahe Allah uske liye rasta nikaalta hai." },
    { name: "Fajr ki namaz + dua",    description: "Subah ka waqt dua ki qabooliyat ka khaas waqt hai." },
  ],
};

// ─────────────────────────────────────────────
// Call Gemini API — robust JSON extraction
// ─────────────────────────────────────────────
async function askGeminiAI(userMessage) {
  try {
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: SYSTEM_PROMPT }]
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: userMessage }]
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.7
        }
      })
    });

    if (!res.ok) {
      console.warn(`[Bot] Gemini API responded with status: ${res.status}`);
      return FALLBACK;
    }

    const data = await res.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    console.log('[Bot] Gemini raw response:', raw);

    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) {
      console.warn('[Bot] No JSON found — using fallback');
      return FALLBACK;
    }

    let parsed;
    try {
      parsed = JSON.parse(match[0]);
    } catch (e) {
      console.warn('[Bot] Parse failed:', e.message, '— using fallback');
      return FALLBACK;
    }

    // Sanitise fields
    if (!parsed.message) parsed.message = FALLBACK.message;
    if (!Array.isArray(parsed.surahs) || !parsed.surahs.length) parsed.surahs = FALLBACK.surahs;
    if (!Array.isArray(parsed.amals)  || !parsed.amals.length)  parsed.amals  = FALLBACK.amals;

    // Normalise surah numbers (ensure 1-114 integer)
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
  } catch (err) {
    console.error('[Bot] Gemini call error:', err);
    return FALLBACK;
  }
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

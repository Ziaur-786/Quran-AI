import React, {
  useState, useEffect, useRef, forwardRef, useCallback,
} from 'react';
import HTMLFlipBook from 'react-pageflip';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';

// ── Page cache ────────────────────────────────────────────────────────────
const PAGE_CACHE = {};
const FETCHING   = new Set();
const TOTAL      = 604;

let SURAH_LIST = null;
let CHAPTERS_PROMISE = null;

async function getChapters() {
  if (SURAH_LIST) return SURAH_LIST;
  if (CHAPTERS_PROMISE) return CHAPTERS_PROMISE;

  CHAPTERS_PROMISE = axios.get('https://api.quran.com/api/v4/chapters', { timeout: 10000 })
    .then(res => {
      SURAH_LIST = (res.data.chapters || []).map(c => ({
        number: c.id,
        name: c.name_arabic,
        englishName: c.name_simple,
        englishNameTranslation: c.translated_name?.name || '',
        numberOfAyahs: c.verses_count,
        revelationType: c.revelation_place,
        startPage: c.pages[0],
        endPage: c.pages[1],
      }));
      return SURAH_LIST;
    })
    .catch(err => {
      console.warn("Failed to fetch chapters:", err.message);
      SURAH_LIST = [];
      return SURAH_LIST;
    });

  return CHAPTERS_PROMISE;
}

function processPageVerses(verses, surahList) {
  const lines = Array.from({ length: 15 }, () => ({ type: 'text', words: [] }));

  // Group all words by line number
  const wordList = [];
  verses.forEach(v => {
    const chapterId = parseInt(v.verse_key.split(':')[0]);
    (v.words || []).forEach(w => {
      wordList.push({
        id: w.id,
        charType: w.char_type_name,
        ar: w.text_uthmani || '',
        tr: w.char_type_name === 'end' ? '' : (w.transliteration?.text || '').replace(/_/g, ' '),
        line_number: w.line_number,
        verseKey: v.verse_key,
        verseNumber: v.verse_number,
        chapterId: chapterId,
      });
    });
  });

  wordList.forEach(w => {
    const lineIdx = w.line_number - 1;
    if (lineIdx >= 0 && lineIdx < 15) {
      lines[lineIdx].words.push(w);
    }
  });

  const surahStarts = [];
  const seenSurahs = new Set();

  wordList.forEach(w => {
    if (w.verseNumber === 1 && !seenSurahs.has(w.chapterId)) {
      seenSurahs.add(w.chapterId);
      const firstLineIdx = w.line_number - 1;
      surahStarts.push({ chapterId: w.chapterId, lineIdx: firstLineIdx });
    }
  });

  surahStarts.forEach(({ chapterId, lineIdx }) => {
    const surahMeta = surahList?.find(s => s.number === chapterId) || {
      number: chapterId,
      name: `سورة ${chapterId}`,
      englishName: `Surah ${chapterId}`,
      englishNameTranslation: '',
      revelationType: '',
      numberOfAyahs: '',
    };

    if (chapterId === 1) {
      if (lines[0]) {
        lines[0].type = 'surah_header';
        lines[0].surahInfo = surahMeta;
      }
    } else if (chapterId === 9) {
      const headerIdx = lineIdx - 1;
      if (headerIdx >= 0 && lines[headerIdx]) {
        lines[headerIdx].type = 'surah_header';
        lines[headerIdx].surahInfo = surahMeta;
      }
    } else {
      const headerIdx = lineIdx - 2;
      const bismillahIdx = lineIdx - 1;

      if (headerIdx >= 0 && lines[headerIdx]) {
        lines[headerIdx].type = 'surah_header';
        lines[headerIdx].surahInfo = surahMeta;
      }
      if (bismillahIdx >= 0 && lines[bismillahIdx]) {
        lines[bismillahIdx].type = 'bismillah';
        lines[bismillahIdx].surahInfo = surahMeta;
      }
    }
  });

  return lines;
}

async function loadPage(num, onDone) {
  if (PAGE_CACHE[num] !== undefined || FETCHING.has(num)) return;
  FETCHING.add(num);

  // ── Try 1: quran.com official API (word-by-word transliteration) ─────────
  try {
    const res = await axios.get(
      `https://api.quran.com/api/v4/verses/by_page/${num}` +
      `?words=true&word_fields=transliteration,text_uthmani,line_number&per_page=50&fields=text_uthmani`,
      { timeout: 12000 }
    );
    const verses = res.data.verses || [];
    if (verses.length > 0) {
      // Load chapters metadata if not loaded
      const surahList = await getChapters();
      PAGE_CACHE[num] = {
        lines: processPageVerses(verses, surahList),
      };
      FETCHING.delete(num);
      onDone(num);
      return;
    }
  } catch (e1) {
    console.warn(`Page ${num} quran.com failed:`, e1.message);
  }

  // ── Try 2: alquran.cloud Arabic only (reliable fallback) ────────────────
  try {
    const r2 = await axios.get(
      `https://api.alquran.cloud/v1/page/${num}/quran-uthmani`,
      { timeout: 12000 }
    );
    const ayahs = r2.data.data.ayahs || [];
    const fallbackWords = [];
    ayahs.forEach(a => {
      const chapterId = a.surah?.number;
      const arWords = a.text.split(' ').filter(Boolean);
      arWords.forEach((ar, wi) => {
        fallbackWords.push({
          id: `${a.number}-${wi}`,
          charType: 'word',
          ar,
          tr: '',
          line_number: 1,
          verseKey: `${chapterId}:${a.numberInSurah}`,
          verseNumber: a.numberInSurah,
          chapterId: chapterId,
        });
      });
      // Add end marker
      fallbackWords.push({
        id: `${a.number}-end`,
        charType: 'end',
        ar: '۝',
        tr: toAr(a.numberInSurah),
        line_number: 1,
        verseKey: `${chapterId}:${a.numberInSurah}`,
        verseNumber: a.numberInSurah,
        chapterId: chapterId,
      });
    });

    const lines = Array.from({ length: 15 }, () => ({ type: 'text', words: [] }));
    lines[0].words = fallbackWords;
    PAGE_CACHE[num] = { lines };
  } catch {
    PAGE_CACHE[num] = { lines: Array.from({ length: 15 }, () => ({ type: 'text', words: [] })) };
  }

  FETCHING.delete(num);
  onDone(num);
}


const toAr = n => String(n).replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);

// ── Single Quran Page ─────────────────────────────────────────────────────
const QuranPage = forwardRef(function QuranPage({ number, ayahs, showTransliteration }, ref) {
  const loaded = ayahs !== undefined;
  const isLeft = number % 2 === 0;
  const isIlluminated = number === 1 || number === 2;

  // Find the Surah name for the header
  let surahTitle = '';
  if (loaded && ayahs?.lines) {
    for (let line of ayahs.lines) {
      if (line.words?.length > 0) {
        const w = line.words[0];
        const surah = SURAH_LIST?.find(s => s.number === w.chapterId);
        if (surah) {
          surahTitle = surah.englishName;
          break;
        }
      }
    }
  }

  return (
    <div ref={ref} className={`qp ${isLeft ? 'qp-l' : 'qp-r'} ${isIlluminated ? 'qp-illuminated' : ''}`}>
      <div className="qp-border">
        {/* Corner Ornaments */}
        {!isIlluminated && (
          <>
            <div className="qp-corner qp-corner-tl">❖</div>
            <div className="qp-corner qp-corner-tr">❖</div>
            <div className="qp-corner qp-corner-bl">❖</div>
            <div className="qp-corner qp-corner-br">❖</div>
          </>
        )}
        <div className="qp-inner">

          {/* Top bar: page number + surah name */}
          <div className="qp-topbar">
            {isLeft
              ? <><span className="qp-pnum">{toAr(number)}</span><span className="qp-sname">{surahTitle}</span></>
              : <><span className="qp-sname">{surahTitle}</span><span className="qp-pnum">{toAr(number)}</span></>
            }
          </div>

          {/* Content */}
          <div className="qp-body">
            {!loaded && <div className="qp-spin-wrap"><div className="qp-spin"/></div>}

            {loaded && (!ayahs || !ayahs.lines) && <div className="qp-spin-wrap">—</div>}

            {loaded && ayahs && ayahs.lines && (
              <div className={`qp-lines-container ${showTransliteration ? 'with-tr' : 'no-tr'}`}>
                {ayahs.lines.map((line, li) => {
                  if (line.type === 'surah_header' && line.surahInfo) {
                    return (
                      <div key={li} className="qp-surah-hdr">
                        <div className="qp-sh-ar">{line.surahInfo.name}</div>
                        <div className="qp-sh-en">
                          {line.surahInfo.englishName} • {line.surahInfo.numberOfAyahs} Ayahs • {line.surahInfo.revelationType}
                        </div>
                      </div>
                    );
                  }
                  if (line.type === 'bismillah') {
                    return (
                      <div key={li} className="qp-bismillah">
                        بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
                      </div>
                    );
                  }
                  
                  // Text line
                  if (line.words && line.words.length > 0) {
                    const isShort = line.words.length < 5;
                    return (
                      <div 
                        key={li} 
                        className={`qp-text-line ${isShort ? 'qp-line-centered' : 'qp-line-justified'}`} 
                        dir="rtl"
                      >
                        {line.words.map((w, wi) => {
                          if (w.charType === 'end') {
                            return (
                              <span key={wi} className="qp-word qp-marker-wrap">
                                <span className="qp-ar qp-marker">۝</span>
                                <span className="qp-tr qp-marker-tr">{toAr(w.verseNumber)}</span>
                              </span>
                            );
                          }
                          return (
                            <span key={wi} className="qp-word">
                              <span className="qp-ar">{w.ar}</span>
                              {showTransliteration && <span className="qp-tr">{w.tr}</span>}
                            </span>
                          );
                        })}
                      </div>
                    );
                  }

                  // Empty spacer line
                  return <div key={li} className="qp-line-spacer">&nbsp;</div>;
                })}
              </div>
            )}
          </div>

          {/* Bottom page num */}
          <div className="qp-botnum">{toAr(number)}</div>
        </div>
      </div>
    </div>
  );
});

// ── Cover ─────────────────────────────────────────────────────────────────
const CoverPage = forwardRef(function CoverPage({ isFront, onStart }, ref) {
  return (
    <div ref={ref} className={`qp qcov ${isFront ? 'qcov-f' : 'qcov-b'}`}>
      {isFront && (
        <div className="qcov-frame">
          <p className="qcov-bsm">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
          <p className="qcov-title">الْقُرْآنُ الْكَرِيمُ</p>
          <p className="qcov-en">The Holy Quran</p>
          <div className="qcov-divider">✦ ✦ ✦</div>
          <p className="qcov-sub">604 Safa • With Transliteration</p>
          <button className="qcov-start-btn" onClick={onStart}>
            Start Reading
          </button>
        </div>
      )}
    </div>
  );
});

// ── Main ──────────────────────────────────────────────────────────────────
export default function LiveQuran() {
  const navigate = useNavigate();
  const bookRef  = useRef(null);
  const [, tick] = useState(0);
  const [cur, setCur]       = useState(0);
  const [portrait, setPort] = useState(window.innerWidth < 740);
  const [showTransliteration, setShowTransliteration] = useState(true);
  const [chapters, setChapters] = useState([]);
  const [pageInput, setPageInput] = useState('');

  const rerender = useCallback(() => tick(n => n + 1), []);

  const preload = useCallback((c) => {
    getChapters().then(() => {
      for (let p = Math.max(1, c - 1); p <= Math.min(TOTAL, c + 4); p++) {
        loadPage(p, rerender);
      }
    });
  }, [rerender]);

  useEffect(() => {
    getChapters().then(list => {
      setChapters(list);
      preload(1);
    }).catch(err => {
      console.warn(err);
      preload(1);
    });
  }, [preload]);

  useEffect(() => {
    const fn = e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next();
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   prev();
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  const [winWidth, setWinWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 800);

  useEffect(() => {
    const fn = () => {
      setWinWidth(window.innerWidth);
      setPort(window.innerWidth < 740);
    };
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  const next = () => bookRef.current?.pageFlip().flipNext();
  const prev = () => bookRef.current?.pageFlip().flipPrev();

  const onFlip = e => { 
    setCur(e.data); 
    setPageInput('');
    preload(e.data + 1); 
  };

  const jumpToPage = (p) => {
    if (p < 1 || p > TOTAL) return;
    if (portrait) {
      bookRef.current?.pageFlip().flip(p);
    } else {
      const targetIdx = p % 2 === 1 ? p : p - 1;
      bookRef.current?.pageFlip().flip(targetIdx);
    }
  };

  const handleStartReading = () => {
    bookRef.current?.pageFlip().flip(1);
  };

  const getCurrentSurahNumber = () => {
    const activePage = portrait ? cur : (cur % 2 === 1 ? cur : cur - 1);
    const pageData = PAGE_CACHE[activePage];
    if (pageData && pageData.lines) {
      for (let line of pageData.lines) {
        if (line.words?.length > 0) {
          return line.words[0].chapterId || "";
        }
      }
    }
    return "";
  };

  // Responsive page size — in portrait (single page on mobile), use available width up to 380px
  const W  = portrait ? Math.min(winWidth - 24, 380) : Math.min(Math.floor((winWidth - 60) / 2), 340);
  const H  = Math.round(W * 1.62);
  const pct = Math.round((cur / TOTAL) * 100);

  // Formatted page range display
  const getPageSpreadLabel = () => {
    if (cur === 0) return 'Front Cover';
    if (cur === TOTAL + 1) return 'Back Cover';
    if (portrait) return `Page ${cur}`;
    const leftPage = cur + 1;
    const rightPage = cur;
    return `Pages ${rightPage}–${Math.min(leftPage, TOTAL)}`;
  };

  return (
    <div className="lq-root">
      {/* Header */}
      <header className="lq-hdr">
        <button className="lq-back" onClick={() => navigate('/')}>
          <ArrowLeft size={15}/> Home
        </button>
        <div className="lq-htitle">
          <span className="lq-tar">القرآن الكريم</span>
          <span className="lq-ten">Live Quran · With Transliteration</span>
        </div>
        <div className="lq-pgbadge">
          <span className="lq-pgar">{cur > 0 && cur <= TOTAL ? toAr(cur) : ''}</span>
          <span className="lq-pgslash">{getPageSpreadLabel()}</span>
        </div>
      </header>

      {/* Controls Bar */}
      <div className="lq-controls-bar">
        {/* Surah Dropdown */}
        <select 
          className="lq-select" 
          value={getCurrentSurahNumber()}
          onChange={(e) => {
            const num = parseInt(e.target.value);
            const s = chapters.find(c => c.number === num);
            if (s) jumpToPage(s.startPage);
          }}
        >
          <option value="" disabled>Select Surah...</option>
          {chapters.map(c => (
            <option key={c.number} value={c.number}>
              {c.number}. {c.englishName} ({c.name})
            </option>
          ))}
        </select>

        {/* Page Jump */}
        <div className="lq-jump-wrap">
          <span>Go to Page:</span>
          <input 
            type="number" 
            min="1" 
            max="604"
            className="lq-input"
            value={pageInput}
            onChange={(e) => {
              setPageInput(e.target.value);
              const p = parseInt(e.target.value);
              if (p >= 1 && p <= TOTAL) {
                jumpToPage(p);
              }
            }}
            placeholder="1-604"
          />
        </div>

        {/* Transliteration Toggle */}
        <div className="lq-switch-wrap" onClick={() => setShowTransliteration(!showTransliteration)}>
          <span className="lq-switch-lbl">Spelling (Hinglish)</span>
          <div className={`lq-switch ${showTransliteration ? 'active' : ''}`}>
            <span className="lq-switch-thumb" />
          </div>
        </div>
      </div>

      <p className="lq-hint">← → keys &nbsp;|&nbsp; click left / right &nbsp;|&nbsp; swipe</p>

      {/* 3D Stage */}
      <div className="lq-stage">
        <div className="lq-3d">
          <div className="lq-spine">القرآن</div>

          <HTMLFlipBook
            key={portrait ? 'port' : 'land'}
            ref={bookRef}
            width={W} height={H}
            size="fixed"
            minWidth={150} minHeight={220}
            drawShadow
            flippingTime={700}
            usePortrait={portrait}
            autoSize={false}
            showCover
            mobileScrollSupport
            className="lq-fb"
            onFlip={onFlip}
          >
            <CoverPage isFront onStart={handleStartReading} />
            {Array.from({ length: TOTAL }, (_, i) => {
              const idx = i + 1; // 1 to 604
              const pageNum = portrait
                ? idx
                : (idx % 2 === 1 ? idx + 1 : idx - 1);
              return (
                <QuranPage 
                  key={pageNum} 
                  number={pageNum} 
                  ayahs={PAGE_CACHE[pageNum]} 
                  showTransliteration={showTransliteration} 
                />
              );
            })}
            <CoverPage isFront={false} />
          </HTMLFlipBook>
        </div>

        {/* Click zones */}
        <div className="lq-zl" onClick={prev} />
        <div className="lq-zr" onClick={next} />
      </div>

      {/* Progress */}
      <div className="lq-prog">
        <div className="lq-pbar"><div className="lq-fill" style={{width:`${pct}%`}}/></div>
        <span className="lq-pct">{pct}%</span>
      </div>

      {/* Nav */}
      <div className="lq-nav">
        <button className="lq-btn" onClick={prev} disabled={cur === 0}>
          <ChevronLeft size={17}/> Prev
        </button>
        <span className="lq-spread">
          {getPageSpreadLabel()}
        </span>
        <button className="lq-btn" onClick={next} disabled={cur >= TOTAL}>
          Next <ChevronRight size={17}/>
        </button>
      </div>

      {/* ══════════════ STYLES ══════════════ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&family=Amiri:ital,wght@0,400;0,700;1,400&display=swap');

        .lq-root {
          min-height:100vh;
          background: radial-gradient(ellipse 140% 90% at 50% -10%, #12362a, #060e0a 70%);
          display:flex; flex-direction:column; align-items:center;
          padding:0 10px 48px; color:#F5F1E6;
          font-family:'Inter',sans-serif;
        }

        /* Header */
        .lq-hdr {
          width:100%; max-width:880px;
          display:flex; align-items:center; justify-content:space-between;
          padding:13px 2px 10px;
          border-bottom:1px solid rgba(197,160,89,.28); margin-bottom:10px;
        }
        .lq-back {
          display:flex; align-items:center; gap:5px;
          background:rgba(197,160,89,.1); border:1px solid rgba(197,160,89,.28);
          color:#C5A059; padding:7px 13px; border-radius:10px;
          cursor:pointer; font-size:13px; font-weight:600; transition:.2s;
        }
        .lq-back:hover { background:rgba(197,160,89,.2); }
        .lq-htitle { display:flex; flex-direction:column; align-items:center; gap:2px; }
        .lq-tar { font-family:'Scheherazade New',serif; font-size:22px; color:#C5A059; font-weight:700; line-height:1; }
        .lq-ten { font-size:10px; color:rgba(197,160,89,.55); letter-spacing:.8px; text-transform:uppercase; }
        .lq-pgbadge {
          display:flex; align-items:baseline; gap:4px;
          background:rgba(197,160,89,.1); padding:6px 12px;
          border-radius:20px; border:1px solid rgba(197,160,89,.2);
        }
        .lq-pgar { font-family:'Scheherazade New',serif; font-size:18px; color:#C5A059; font-weight:700; }
        .lq-pgslash { font-size:11px; color:rgba(197,160,89,.8); font-weight:600; }

        /* Controls Bar */
        .lq-controls-bar {
          width:100%; max-width:880px;
          display:flex; flex-wrap:wrap; justify-content:center; align-items:center;
          gap:15px 30px; padding:12px 20px;
          background:rgba(197,160,89,.04);
          border:1px solid rgba(197,160,89,.18);
          border-radius:14px; margin-bottom:12px;
        }
        .lq-select {
          background:#091e17; border:1px solid rgba(197,160,89,.4);
          color:#e8c060; padding:8px 12px; border-radius:8px;
          font-family:inherit; font-size:13px; outline:none;
          cursor:pointer; min-width:200px; transition:.2s;
        }
        .lq-select:hover { border-color:#e8c060; }
        .lq-select option { background:#091e17; color:#f5f1e6; }

        .lq-jump-wrap {
          display:flex; align-items:center; gap:8px;
          font-size:13px; color:#c5a059; font-weight:600;
        }
        .lq-input {
          width:65px; background:#091e17; border:1px solid rgba(197,160,89,.4);
          color:#e8c060; padding:6px 8px; border-radius:6px;
          text-align:center; font-size:13px; outline:none; transition:.2s;
        }
        .lq-input:hover, .lq-input:focus { border-color:#e8c060; }

        .lq-switch-wrap {
          display:flex; align-items:center; gap:10px;
          cursor:pointer; user-select:none;
        }
        .lq-switch-lbl { font-size:13px; color:#c5a059; font-weight:600; }
        .lq-switch {
          width:42px; height:22px; background:rgba(197,160,89,.2);
          border-radius:11px; position:relative; transition:background .3s;
          border:1px solid rgba(197,160,89,.3);
        }
        .lq-switch.active { background:#1a5c1a; border-color:#2e8b2e; }
        .lq-switch-thumb {
          position:absolute; top:2px; left:2px;
          width:16px; height:16px; background:#e8c060;
          border-radius:50%; transition:transform .3s;
        }
        .lq-switch.active .lq-switch-thumb { transform:translateX(20px); background:#fdfaf2; }

        .lq-hint { font-size:11px; color:rgba(245,241,230,.28); margin:4px 0 14px; }

        /* 3D stage */
        .lq-stage {
          position:relative;
          perspective:3000px; perspective-origin:50% 38%;
        }
        .lq-3d {
          display:flex; align-items:stretch;
          transform:rotateX(6deg);
          transform-style:preserve-3d;
          filter:drop-shadow(0 44px 70px rgba(0,0,0,.8)) drop-shadow(0 0 3px rgba(197,160,89,.12));
          transition:transform .35s;
        }
        .lq-3d:hover { transform:rotateX(3deg) rotateY(2deg); }

        /* Spine */
        .lq-spine {
          width:22px; flex-shrink:0;
          background:linear-gradient(180deg,#2d1500,#6b4a10 30%,#9a6e1a 50%,#6b4a10 70%,#2d1500);
          display:flex; align-items:center; justify-content:center;
          writing-mode:vertical-rl; font-family:'Scheherazade New',serif;
          font-size:10px; color:#e8c060; letter-spacing:3px;
          border-left:1px solid rgba(200,168,75,.5);
          border-right:1px solid rgba(200,168,75,.5);
          box-shadow:inset 3px 0 10px rgba(0,0,0,.5);
        }

        /* Flipbook */
        .lq-fb { background:transparent !important; }
        .lq-fb .stf__parent { background:transparent !important; }

        /* Click zones */
        .lq-zl,.lq-zr {
          position:absolute; top:0; bottom:0; width:38%;
          z-index:20; cursor:pointer;
        }
        .lq-zl { left:0; }
        .lq-zr { right:0; }

        /* ── Page ── */
        .qp {
          width:100%; height:100%;
          box-sizing:border-box; position:relative; overflow:hidden;
        }
        .qp-r {
          background:linear-gradient(168deg,#fefdf6 0%,#f9f4e2 55%,#f1eccf 100%);
          border-right:2.5px solid #c8a84b;
        }
        .qp-l {
          background:linear-gradient(192deg,#f1eccf 0%,#f9f4e2 45%,#fefdf6 100%);
          border-left:2.5px solid #c8a84b;
        }

        .qp-border {
          position:absolute; inset:5px;
          border:2px double #c8a84b;
          background:inherit;
        }
        .qp-inner {
          position:absolute; inset:4px;
          border:1px solid rgba(200,168,75,.35);
          display:flex; flex-direction:column;
          padding:6px 8px 3px; overflow:hidden;
        }

        /* Corner ornaments */
        .qp-corner {
          position:absolute; font-size:6px; color:rgba(200,168,75,0.45);
          line-height:1; z-index:5;
        }
        .qp-corner-tl { top:2px; left:3px; }
        .qp-corner-tr { top:2px; right:3px; }
        .qp-corner-bl { bottom:2px; left:3px; }
        .qp-corner-br { bottom:2px; right:3px; }

        /* Illuminated Page style (Page 1 & 2) */
        .qp-illuminated {
          background:radial-gradient(circle, #fffdf5 30%, #f7f1db 100%) !important;
        }
        .qp-illuminated .qp-border {
          border:7px solid #c8a84b;
          border-image:linear-gradient(135deg, #c8a84b 0%, #8b6914 50%, #c8a84b 100%) 7;
          box-shadow:0 0 12px rgba(200,168,75,.2), inset 0 0 12px rgba(200,168,75,.2);
        }
        .qp-illuminated .qp-inner {
          border:2px solid #1a3c40;
          margin:2px;
          background:rgba(255,255,255,.9);
          padding:12px 10px 4px;
        }
        .qp-illuminated .qp-topbar, .qp-illuminated .qp-botnum {
          display:none !important;
        }

        /* Top bar */
        .qp-topbar {
          display:flex; justify-content:space-between; align-items:center;
          margin-bottom:4px; border-bottom:1px solid rgba(200,168,75,.15);
          padding-bottom:2px;
        }
        .qp-pnum { font-family:'Scheherazade New',serif; font-size:10px; color:#6b4a10; font-weight:700; }
        .qp-sname { font-family:'Amiri',serif; font-size:9px; color:#6b4a10; font-weight:700; }

        /* Body — 15 lines layout */
        .qp-body {
          flex:1; overflow:hidden;
          display:flex; align-items:stretch;
          padding:4px 0;
        }

        .qp-lines-container {
          display:flex; flex-direction:column;
          justify-content:space-between; height:100%;
          width:100%;
        }

        .qp-lines-container.with-tr {
          --ar-font-size: 12.5px;
        }
        .qp-lines-container.no-tr {
          --ar-font-size: 16.5px;
        }

        /* Standard Text Line */
        .qp-text-line {
          display:flex; flex-direction:row;
          width:100%; box-sizing:border-box;
          align-items:center;
        }
        .qp-line-justified { justify-content:space-between; }
        .qp-line-centered { justify-content:center; gap:10px; }
        .qp-line-spacer { height:12px; display:flex; align-items:center; }

        /* Word pairs */
        .qp-word {
          display:inline-flex;
          flex-direction:column;
          align-items:center;
          cursor:default;
          padding:1px 0;
          border-radius:3px;
          transition:background .15s;
        }
        .qp-word:hover { background:rgba(197,160,89,.12); }

        .qp-ar {
          font-family:'Scheherazade New',serif;
          font-size:var(--ar-font-size, 12.5px); line-height:1.2;
          color:#0d0905;
          white-space:nowrap;
        }
        .qp-tr {
          font-size:7.5px; line-height:1;
          color:#1a5c1a;
          white-space:nowrap;
          font-weight:600;
          letter-spacing:.05px;
          margin-top:1.5px;
        }

        /* Surah Header Callout Banner */
        .qp-surah-hdr {
          width:100%;
          background:linear-gradient(135deg, #fdf8e6 0%, #f5e7c3 100%);
          border:1.5px solid #c8a84b;
          border-radius:6px;
          padding:3px 6px;
          display:flex; flex-direction:column;
          align-items:center; justify-content:center;
          box-sizing:border-box;
          margin:3px 0;
          box-shadow:inset 0 0 10px rgba(200,168,75,.15);
        }
        .qp-illuminated .qp-surah-hdr {
          background:linear-gradient(135deg, #1a3c40 0%, #2d5a27 100%);
          border-color:#e8c060;
          box-shadow:0 4px 8px rgba(0,0,0,.15);
        }
        .qp-sh-ar {
          font-family:'Amiri',serif;
          font-size:13px; font-weight:700;
          color:#5c3f0b; line-height:1.1;
        }
        .qp-illuminated .qp-sh-ar {
          color:#e8c060;
        }
        .qp-sh-en {
          font-size:6.5px; color:rgba(92,63,11,.75);
          font-weight:700; letter-spacing:.3px;
          margin-top:1.5px; text-transform:uppercase;
        }
        .qp-illuminated .qp-sh-en {
          color:rgba(232,192,96,.75);
        }

        /* Bismillah Callout */
        .qp-bismillah {
          width:100%; text-align:center;
          font-family:'Amiri',serif; font-size:13px;
          font-weight:700; color:#1a0800;
          line-height:1.1; margin:3px 0;
        }
        .qp-illuminated .qp-bismillah {
          font-size:14px;
          color:#1a3c40;
        }

        /* Verse end marker */
        .qp-marker-wrap {
          position:relative;
          display:inline-flex;
          align-items:center; justify-content:center;
          width:18px; height:18px;
        }
        .qp-marker {
          font-size:16px; color:#8B4513;
          line-height:1;
        }
        .qp-marker-tr {
          position:absolute;
          font-size:7px; color:#8B4513; font-style:normal;
          font-weight:700;
          top:50%; left:50%;
          transform:translate(-50%, -50%);
          margin-top:0;
        }

        .qp-botnum {
          font-family:'Scheherazade New',serif; font-size:9px;
          color:#6b4a10; text-align:center; margin-top:2px;
          border-top:1px solid rgba(200,168,75,.15);
          padding-top:1px;
        }

        /* Loader */
        .qp-spin-wrap {
          flex:1; display:flex; align-items:center; justify-content:center; color:#b09050;
        }
        .qp-spin {
          width:22px; height:22px; border-radius:50%;
          border:2px solid rgba(176,144,80,.15);
          border-top-color:#b09050;
          animation:lqs .7s linear infinite;
        }
        @keyframes lqs { to { transform:rotate(360deg); } }

        /* Cover */
        .qcov {
          background:linear-gradient(160deg,#1a0800,#2d1200 40%,#1a0800 100%) !important;
        }
        .qcov-f { border-right:3px solid #8B6914 !important; }
        .qcov-b { border-left :3px solid #8B6914 !important; }
        .qcov-frame {
          position:absolute; inset:12px;
          border:2.5px double #c8a84b;
          display:flex; flex-direction:column;
          align-items:center; justify-content:center; gap:8px;
          text-align:center; padding:16px 12px;
          background:radial-gradient(ellipse at center,#1f0d00,#0f0500);
          box-shadow:inset 0 0 30px rgba(197,160,89,.06);
        }
        .qcov-bsm  { font-family:'Scheherazade New',serif; font-size:13px; color:#c8a84b; direction:rtl; margin:0; }
        .qcov-title{ font-family:'Scheherazade New',serif; font-size:26px; font-weight:700; color:#e8c060; direction:rtl; margin:0; text-shadow:0 0 20px rgba(200,168,75,.35); }
        .qcov-en   { font-family:Georgia,serif; font-size:12px; color:rgba(200,168,75,.7); letter-spacing:2px; margin:0; }
        .qcov-divider { color:#c8a84b; font-size:9px; letter-spacing:4px; }
        .qcov-sub  { font-size:9px; color:rgba(200,168,75,.45); letter-spacing:.8px; margin:0; }

        .qcov-start-btn {
          margin-top:15px;
          background:linear-gradient(135deg,#e8c060,#c8a84b);
          color:#1a0800; border:none; font-size:12px; font-weight:700;
          padding:8px 20px; border-radius:20px; cursor:pointer;
          box-shadow:0 4px 10px rgba(200,168,75,0.3);
          transition:transform .2s, box-shadow .2s;
        }
        .qcov-start-btn:hover {
          transform:translateY(-1px);
          box-shadow:0 6px 14px rgba(200,168,75,0.5);
        }

        /* Progress */
        .lq-prog { display:flex; align-items:center; gap:10px; width:100%; max-width:780px; margin-top:20px; }
        .lq-pbar { flex:1; height:5px; background:rgba(197,160,89,.12); border-radius:5px; overflow:hidden; }
        .lq-fill { height:100%; background:linear-gradient(90deg,#6b4a10,#C5A059,#e8c060); border-radius:5px; transition:width .5s; }
        .lq-pct  { font-size:11px; color:rgba(197,160,89,.55); min-width:30px; text-align:right; }

        /* Nav buttons */
        .lq-nav { display:flex; align-items:center; gap:18px; margin-top:15px; }
        .lq-btn {
          display:flex; align-items:center; gap:6px;
          background:linear-gradient(135deg,#C5A059,#8B6914);
          border:none; color:#fff; padding:10px 20px; border-radius:12px;
          font-size:14px; font-weight:700; cursor:pointer;
          box-shadow:0 4px 16px rgba(197,160,89,.35); transition:.2s;
        }
        .lq-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 24px rgba(197,160,89,.5); }
        .lq-btn:disabled { opacity:.35; cursor:not-allowed; }
        .lq-spread { font-size:13px; color:rgba(245,241,230,.5); min-width:120px; text-align:center; font-weight:600; }

        @media(max-width:740px) {
          .lq-controls-bar {
            gap:10px; padding:10px;
          }
          .lq-select {
            min-width:100%;
          }
        }
        @media(max-width:520px){
          .lq-hint { display:none; }
          .lq-tar  { font-size:17px; }
          .lq-btn  { padding:8px 14px; font-size:12px; }
          .lq-spine{ display:none; }
          .lq-controls-bar {
            flex-direction:column;
            align-items:stretch;
          }
        }
      `}</style>
    </div>
  );
}

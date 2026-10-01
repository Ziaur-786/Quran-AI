import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, 
  Download, 
  Share2, 
  Copy, 
  Check, 
  Sparkles, 
  Smartphone, 
  Square, 
  Palette,
  Eye,
  Loader2,
  ImageIcon,
  Layers,
  RefreshCw,
  Key,
  ExternalLink,
  AlertCircle,
  Wand2,
  Sliders
} from 'lucide-react';
import { getSurahImageUrl, getSurahThemeCategory } from '../utils/surahImagePrompts';
import { drawScenicBackground } from '../utils/scenicCanvasRenderer';
import { getHinglishTranslation } from '../utils/hinglishVerseTranslations';
import { 
  generateGeminiStatusImage, 
  getActiveGeminiKey, 
  saveGeminiKey, 
  hasGeminiKey,
  buildGeminiPrompt 
} from '../utils/geminiImageService';

const WhatsAppIcon = ({ size = 18, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={`shrink-0 ${className}`}
  >
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-5.805 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
  </svg>
);

const THEMES = [
  {
    id: 'emerald',
    name: 'Emerald Rahmah',
    bgStart: '#041710',
    bgEnd: '#092b1e',
    accent: '#C5A059',
    accentLight: '#E8C87A',
    textColor: '#FFFFFF',
    desc: 'Deep Quranic Emerald & Royal Gold'
  },
  {
    id: 'dawn',
    name: 'Golden Dawn',
    bgStart: '#1a140a',
    bgEnd: '#33230a',
    accent: '#F3C969',
    accentLight: '#FFE8A3',
    textColor: '#FFFBF0',
    desc: 'Warm Sunrise of Hope & Ease'
  },
  {
    id: 'celestial',
    name: 'Celestial Night',
    bgStart: '#050c1a',
    bgEnd: '#0b1d3a',
    accent: '#64B5F6',
    accentLight: '#90CAF9',
    textColor: '#F0F8FF',
    desc: 'Starlit Midnight Sky & Peace'
  },
  {
    id: 'obsidian',
    name: 'Royal Obsidian',
    bgStart: '#080808',
    bgEnd: '#171717',
    accent: '#D4AF37',
    accentLight: '#F5DEB3',
    textColor: '#FFFFFF',
    desc: 'Pure Luxury Black & Gold Arch'
  }
];

export default function AyahCardGeneratorModal({ isOpen, onClose, verseData }) {
  const [aspectRatio, setAspectRatio] = useState('status'); // 'status' (9:16) | 'square' (1:1)
  const [selectedTheme, setSelectedTheme] = useState('emerald');
  const [backgroundMode, setBackgroundMode] = useState('gemini'); // 'gemini' | 'geometric' | 'scenic'
  const [cardGlassOpacity, setCardGlassOpacity] = useState(18); // Default 18% opacity = 82% transparent glass plate so background photo shines through!
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [previewDataUrl, setPreviewDataUrl] = useState(null);
  
  // AI Image generation states
  const [aiImageLoading, setAiImageLoading] = useState(false);
  const [aiErrorMessage, setAiErrorMessage] = useState(null);
  const [geminiApiKeyInput, setGeminiApiKeyInput] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [activeKey, setActiveKey] = useState(getActiveGeminiKey());

  const canvasRef = useRef(null);
  const aiImageCacheRef = useRef({}); // In-memory cache for loaded background image elements

  const currentTheme = THEMES.find(t => t.id === selectedTheme) || THEMES[0];
  const surahNum = verseData?.surahNumber || 1;
  const ayahNum = verseData?.ayahNumber || 1;
  const surahThemeCategory = getSurahThemeCategory(surahNum);

  // Synchronize key state when modal opens (Auto-selects active Gemini key)
  useEffect(() => {
    if (isOpen) {
      const current = getActiveGeminiKey();
      setActiveKey(current);
      setGeminiApiKeyInput(current);
      setShowKeyInput(false); // No manual input needed - auto selected!
    }
  }, [isOpen]);

  // Helper: Load image from source (URL or base64 data) into an HTMLImageElement
  const loadImageElement = useCallback((src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
      img.src = src;
    });
  }, []);

  // Fetch or retrieve background image for the current mode
  const getBackgroundImage = useCallback(async (targetWidth, targetHeight) => {
    if (backgroundMode === 'geometric') {
      return null;
    }

    const cacheKey = `${backgroundMode}-${surahNum}-${ayahNum}-${targetWidth}x${targetHeight}`;
    if (aiImageCacheRef.current[cacheKey]) {
      return aiImageCacheRef.current[cacheKey];
    }

    setAiImageLoading(true);
    setAiErrorMessage(null);

    try {
      if (backgroundMode === 'gemini') {
        const result = await generateGeminiStatusImage({
          surahNumber: surahNum,
          ayahNumber: ayahNum,
          surahName: verseData?.surah || '',
          aspectRatio,
          customKey: activeKey
        });

        if (result.success && result.imageUrl) {
          const imgElem = await loadImageElement(result.imageUrl);
          aiImageCacheRef.current[cacheKey] = imgElem;
          setAiImageLoading(false);
          return imgElem;
        } else {
          // If Gemini fails (e.g. invalid key or quota), show clear message
          setAiErrorMessage(result.error || 'Gemini image generation unavailable');
          if (result.isKeyError) {
            setShowKeyInput(true);
          }
          setAiImageLoading(false);
          return null;
        }
      }
    } catch (err) {
      console.warn('[CardModal] Gemini image load failed:', err);
      setAiErrorMessage(err.message || 'Failed to load background image');
      setAiImageLoading(false);
      return null;
    }

    setAiImageLoading(false);
    return null;
  }, [backgroundMode, surahNum, ayahNum, verseData, aspectRatio, activeKey, loadImageElement]);

  // Canvas Drawing & Rendering Function
  const generateCanvasImage = useCallback(async () => {
    if (!verseData) return null;

    try {
      const canvas = canvasRef.current || document.createElement('canvas');
      const isStatus = aspectRatio === 'status';

      // High Resolution HD Dimensions (1080x1920 status or 1080x1080 square)
      const width = 1080;
      const height = isStatus ? 1920 : 1080;

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      // 1. Render Background
      if (backgroundMode === 'geometric') {
        drawGeometricBackground(ctx, width, height);
      } else if (backgroundMode === 'scenic') {
        // Draw the rich procedural spiritual atmosphere (Dawn, Celestial Night, Mosque, Light, etc.)
        drawScenicBackground(ctx, width, height, surahThemeCategory, currentTheme);
      } else if (backgroundMode === 'gemini') {
        // Base atmospheric scenic layer
        drawScenicBackground(ctx, width, height, surahThemeCategory, currentTheme);

        // Fetch or render Gemini Imagen 3 photo if key is configured
        const bgImg = await getBackgroundImage(width, height);
        if (bgImg) {
          // Center-crop / cover mode
          const imgAspect = bgImg.width / bgImg.height;
          const canvasAspect = width / height;
          let sx = 0, sy = 0, sw = bgImg.width, sh = bgImg.height;

          if (imgAspect > canvasAspect) {
            sw = bgImg.height * canvasAspect;
            sx = (bgImg.width - sw) / 2;
          } else {
            sh = bgImg.width / canvasAspect;
            sy = (bgImg.height - sh) / 2;
          }

          ctx.drawImage(bgImg, sx, sy, sw, sh, 0, 0, width, height);

          // Gentle cinematic gradient overlay - keeps the entire mosque photo vibrant and clear!
          const overlayGrad = ctx.createLinearGradient(0, 0, 0, height);
          overlayGrad.addColorStop(0, 'rgba(0, 0, 0, 0.32)');
          overlayGrad.addColorStop(0.18, 'rgba(0, 0, 0, 0.12)');
          overlayGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.10)');
          overlayGrad.addColorStop(0.85, 'rgba(0, 0, 0, 0.20)');
          overlayGrad.addColorStop(1, 'rgba(0, 0, 0, 0.48)');
          ctx.fillStyle = overlayGrad;
          ctx.fillRect(0, 0, width, height);

          // Subtle atmospheric vignette
          const vignette = ctx.createRadialGradient(
            width / 2, height / 2, width * 0.45,
            width / 2, height / 2, width * 0.98
          );
          vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
          vignette.addColorStop(1, 'rgba(0, 0, 0, 0.30)');
          ctx.fillStyle = vignette;
          ctx.fillRect(0, 0, width, height);
        }
      }

      // 2. Elegant Outer & Inner Borders with Rosettes
      ctx.save();
      const margin = 45;
      ctx.strokeStyle = currentTheme.accent;
      ctx.lineWidth = 3;
      if (backgroundMode !== 'geometric') {
        ctx.globalAlpha = 0.75;
      }
      ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);

      // Inner faint border
      ctx.strokeStyle = currentTheme.accent;
      ctx.globalAlpha = backgroundMode !== 'geometric' ? 0.35 : 0.4;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(margin + 12, margin + 12, width - (margin + 12) * 2, height - (margin + 12) * 2);

      // Corner ornaments
      ctx.globalAlpha = backgroundMode !== 'geometric' ? 0.75 : 0.85;
      ctx.fillStyle = currentTheme.accent;
      ctx.font = '24px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('❖', margin + 24, margin + 24);
      ctx.fillText('❖', width - margin - 24, margin + 24);
      ctx.fillText('❖', margin + 24, height - margin - 24);
      ctx.fillText('❖', width - margin - 24, height - margin - 24);
      ctx.restore();

      // Word wrapping helper
      const wrapText = (text, maxWidth, font, fontSize) => {
        ctx.font = `${fontSize}px ${font}`;
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
          const testLine = currentLine + ' ' + words[i];
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth) {
            lines.push(currentLine);
            currentLine = words[i];
          } else {
            currentLine = testLine;
          }
        }
        lines.push(currentLine);
        return lines;
      };

      // 3. Resolve Hinglish Meaning
      const hinglishText = verseData.hinglish || getHinglishTranslation(surahNum, ayahNum) || '';

      // 4. Pre-measure Arabic, English, and Hinglish Text
      const cardW = width - (isStatus ? 70 : 60);
      const contentMaxWidth = cardW - (isStatus ? 90 : 70);

      // Arabic font sizing & wrapping (Significantly larger, majestic calligraphy)
      const arabicText = verseData.arabic || '';
      let arFontSize = isStatus ? 86 : 62;
      if (arabicText.length > 70) arFontSize = isStatus ? 74 : 54;
      if (arabicText.length > 130) arFontSize = isStatus ? 64 : 46;
      if (arabicText.length > 200) arFontSize = isStatus ? 52 : 38;
      if (arabicText.length > 300) arFontSize = isStatus ? 44 : 32;
      const arLineHeight = Math.round(arFontSize * 1.8);
      const arLines = wrapText(arabicText, contentMaxWidth, `'Scheherazade New', 'Amiri', serif`, arFontSize);

      // English font sizing & wrapping (Substantially larger, elegant serif)
      const translationText = `"${verseData.translation || ''}"`;
      let trFontSize = isStatus ? 42 : 32;
      if (translationText.length > 120) trFontSize = isStatus ? 36 : 28;
      if (translationText.length > 200) trFontSize = isStatus ? 31 : 24;
      if (translationText.length > 320) trFontSize = isStatus ? 26 : 20;
      const trLineHeight = Math.round(trFontSize * 1.55);
      const trLines = wrapText(translationText, contentMaxWidth, `'Playfair Display', Georgia, serif`, trFontSize);

      // Hinglish font sizing & wrapping (Bold & highly legible Roman Urdu/Hindi)
      let hgFontSize = isStatus ? 38 : 29;
      if (hinglishText.length > 120) hgFontSize = isStatus ? 33 : 25;
      if (hinglishText.length > 200) hgFontSize = isStatus ? 28 : 21;
      if (hinglishText.length > 320) hgFontSize = isStatus ? 24 : 18;
      const hgLineHeight = Math.round(hgFontSize * 1.55);
      const hgLines = hinglishText ? wrapText(`"${hinglishText}"`, contentMaxWidth, `'Outfit', 'Inter', sans-serif`, hgFontSize) : [];

      // 5. Calculate Block Heights & Dynamic Optical Centering
      const bismillahH = isStatus ? 60 : 44;
      const div1Gap = isStatus ? 42 : 30;
      const arTotalH = arLines.length * arLineHeight;
      const div2Gap = isStatus ? 42 : 30;
      const ornamentH = isStatus ? 28 : 22;
      const div3Gap = isStatus ? 44 : 30;
      const trTotalH = trLines.length * trLineHeight;
      
      let hgTotalH = 0;
      let hgGap = 0;
      if (hinglishText && hgLines.length > 0) {
        hgGap = isStatus ? 42 : 28;
        const hgBadgeH = isStatus ? 38 : 28;
        hgTotalH = hgBadgeH + (hgLines.length * hgLineHeight); // Header badge + lines
      }

      const badgeGap = isStatus ? 46 : 32;
      const badgeH = isStatus ? 68 : 54;

      const totalBlockHeight = bismillahH + div1Gap + arTotalH + div2Gap + ornamentH + div3Gap + trTotalH + hgGap + hgTotalH + badgeGap + badgeH;

      // Vertical centering: balanced in the card, avoiding large empty gaps!
      let startY = Math.round((height - totalBlockHeight) * (isStatus ? 0.44 : 0.46));
      const minTop = isStatus ? 150 : 65;
      if (startY < minTop) startY = minTop;

      // 6. Draw Frosted Luxury Glass Backing Plate
      const cardH = totalBlockHeight + (isStatus ? 90 : 60);
      const cardX = (width - cardW) / 2;
      const cardY = startY - (isStatus ? 45 : 30);
      const cardRadius = 36;

      ctx.save();
      // Subtle plate drop shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
      ctx.shadowBlur = 24;
      ctx.shadowOffsetY = 8;

      // Ultra-sleek high-transparency glass fill: allows the full background architecture (arches, pillars, domes, sky) to be clearly seen through the card!
      const glassAlpha = (cardGlassOpacity ?? 18) / 100;
      if (glassAlpha > 0.01) {
        const plateGrad = ctx.createLinearGradient(0, cardY, 0, cardY + cardH);
        plateGrad.addColorStop(0, `rgba(5, 18, 12, ${glassAlpha * 0.85})`);
        plateGrad.addColorStop(0.5, `rgba(2, 10, 7, ${glassAlpha})`);
        plateGrad.addColorStop(1, `rgba(4, 16, 11, ${glassAlpha * 1.15})`);
        ctx.fillStyle = plateGrad;

        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(cardX, cardY, cardW, cardH, cardRadius);
        } else {
          const r = cardRadius;
          ctx.moveTo(cardX + r, cardY);
          ctx.arcTo(cardX + cardW, cardY, cardX + cardW, cardY + cardH, r);
          ctx.arcTo(cardX + cardW, cardY + cardH, cardX, cardY + cardH, r);
          ctx.arcTo(cardX, cardY + cardH, cardX, cardY, r);
          ctx.arcTo(cardX, cardY, cardX + cardW, cardY, r);
          ctx.closePath();
        }
        ctx.fill();
      }

      // Golden ornate card border (floating glass frame)
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.strokeStyle = currentTheme.accent;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.65;
      ctx.stroke();

      // Inner subtle hairline border
      ctx.strokeStyle = currentTheme.accentLight;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.22;
      const inMargin = 10;
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(cardX + inMargin, cardY + inMargin, cardW - inMargin * 2, cardH - inMargin * 2, cardRadius - inMargin);
        ctx.stroke();
      }

      // Corner rosettes on glass plate
      ctx.globalAlpha = 0.85;
      ctx.fillStyle = currentTheme.accent;
      ctx.font = '22px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('❖', cardX + 26, cardY + 26);
      ctx.fillText('❖', cardX + cardW - 26, cardY + 26);
      ctx.fillText('❖', cardX + 26, cardY + cardH - 26);
      ctx.fillText('❖', cardX + cardW - 26, cardY + cardH - 26);
      ctx.restore();

      // 7. Sequentially Render Text Elements
      let currentY = startY + (isStatus ? 20 : 14);

      // Bismillah
      ctx.save();
      ctx.fillStyle = currentTheme.accent;
      ctx.font = `${isStatus ? 54 : 40}px serif`;
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
      ctx.shadowBlur = 18;
      ctx.fillText('✦ ﷽ ✦', width / 2, currentY);
      ctx.restore();

      // Divider 1
      currentY += isStatus ? 50 : 36;
      ctx.save();
      ctx.strokeStyle = currentTheme.accent;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.35;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 160, currentY);
      ctx.lineTo(width / 2 + 160, currentY);
      ctx.stroke();
      ctx.restore();

      // Arabic Verse Text (High contrast drop shadow ensures legibility on transparent glass)
      currentY += isStatus ? 76 : 56;
      ctx.save();
      ctx.direction = 'rtl';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `600 ${arFontSize}px 'Scheherazade New', 'Amiri', serif`;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.98)';
      ctx.shadowBlur = 28;
      ctx.shadowOffsetY = 2;
      for (const line of arLines) {
        ctx.fillText(line, width / 2, currentY);
        currentY += arLineHeight;
      }
      ctx.restore();

      // Center separator ornament
      currentY += isStatus ? 32 : 22;
      ctx.save();
      ctx.fillStyle = currentTheme.accent;
      ctx.font = `${isStatus ? 24 : 18}px serif`;
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
      ctx.shadowBlur = 14;
      ctx.fillText('❖ ─── ◈ ─── ❖', width / 2, currentY);
      ctx.restore();

      // English Translation Text (Crisp and readable through background)
      currentY += isStatus ? 54 : 38;
      ctx.save();
      ctx.direction = 'ltr';
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(255, 252, 245, 0.98)';
      ctx.font = `italic 400 ${trFontSize}px 'Playfair Display', Georgia, serif`;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.96)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetY = 1;
      for (const line of trLines) {
        ctx.fillText(line, width / 2, currentY);
        currentY += trLineHeight;
      }
      ctx.restore();

      // Hinglish Translation Text (Meaning)
      if (hinglishText && hgLines.length > 0) {
        currentY += isStatus ? 42 : 28;

        ctx.save();
        ctx.fillStyle = currentTheme.accent;
        ctx.font = `700 ${isStatus ? 20 : 15}px 'Outfit', sans-serif`;
        ctx.textAlign = 'center';
        ctx.globalAlpha = 0.9;
        try { ctx.letterSpacing = '3px'; } catch(_) {}
        ctx.fillText('❝ MATLAB · MEANING ❞', width / 2, currentY);
        ctx.restore();

        currentY += isStatus ? 38 : 26;
        ctx.save();
        ctx.direction = 'ltr';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFEAA7'; // Radiant warm ivory-gold
        ctx.font = `italic 400 ${hgFontSize}px 'Outfit', 'Inter', sans-serif`;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.96)';
        ctx.shadowBlur = 18;
        ctx.shadowOffsetY = 1;
        for (const line of hgLines) {
          ctx.fillText(line, width / 2, currentY);
          currentY += hgLineHeight;
        }
        ctx.restore();
      }

      // Surah Citation Badge (Neatly anchored below the meanings)
      currentY += isStatus ? 48 : 32;
      const badgeText = (verseData.surah || `Surah ${surahNum}:${ayahNum}`).toUpperCase();
      ctx.save();
      ctx.font = `700 ${isStatus ? 26 : 20}px "Outfit", sans-serif`;
      try { ctx.letterSpacing = '2px'; } catch(_) {}
      const textWidth = ctx.measureText(badgeText).width;
      const padX = isStatus ? 48 : 36;
      const badgeW = textWidth + padX * 2;
      const badgeX = (width - badgeW) / 2;
      const badgeY = currentY;

      ctx.fillStyle = 'rgba(3, 15, 10, 0.72)';
      ctx.strokeStyle = currentTheme.accent;
      ctx.lineWidth = 2;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 28);
      } else {
        const r = 28;
        ctx.moveTo(badgeX + r, badgeY);
        ctx.arcTo(badgeX + badgeW, badgeY, badgeX + badgeW, badgeY + badgeH, r);
        ctx.arcTo(badgeX + badgeW, badgeY + badgeH, badgeX, badgeY + badgeH, r);
        ctx.arcTo(badgeX, badgeY + badgeH, badgeX, badgeY, r);
        ctx.arcTo(badgeX, badgeY, badgeX + badgeW, badgeY, r);
        ctx.closePath();
      }
      ctx.fill();
      ctx.stroke();

      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.fillStyle = currentTheme.accentLight;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(badgeText, width / 2, badgeY + badgeH / 2);
      ctx.restore();

      // 8. Footer Watermark & Brand at the bottom
      const footerY = height - (isStatus ? 95 : 65);
      ctx.save();
      ctx.fillStyle = currentTheme.accent;
      ctx.font = `700 ${isStatus ? 25 : 19}px "Outfit", sans-serif`;
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      ctx.shadowBlur = 15;
      try {
        ctx.letterSpacing = '3px';
      } catch (_) {}
      ctx.fillText('QURAN AI · READ & REFLECT', width / 2, footerY);

      ctx.fillStyle = 'rgba(245, 241, 230, 0.6)';
      ctx.font = `400 ${isStatus ? 18 : 14}px "Inter", sans-serif`;
      ctx.fillText('quran-ai.vercel.app', width / 2, footerY + 30);
      ctx.restore();

      // Export preview
      const dataUrl = canvas.toDataURL('image/png', 0.95);
      setPreviewDataUrl(dataUrl);
      return { canvas, dataUrl };
    } catch (err) {
      console.error('Canvas generation error:', err);
      return null;
    }
  }, [verseData, aspectRatio, selectedTheme, backgroundMode, currentTheme, surahNum, ayahNum, getBackgroundImage, cardGlassOpacity]);

  // Helper: Geometric radial gradient background
  const drawGeometricBackground = (ctx, width, height) => {
    const grad = ctx.createRadialGradient(
      width / 2, height * 0.42, 50,
      width / 2, height / 2, width * 0.85
    );
    grad.addColorStop(0, currentTheme.bgEnd);
    grad.addColorStop(1, currentTheme.bgStart);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.globalAlpha = 0.04;
    ctx.strokeStyle = currentTheme.accent;
    ctx.lineWidth = 3;
    for (let r = 160; r <= 620; r += 90) {
      ctx.beginPath();
      ctx.arc(width / 2, height * 0.45, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  };

  // Re-generate preview whenever theme, aspect ratio, backgroundMode, cardGlassOpacity or verseData changes
  useEffect(() => {
    if (isOpen && verseData) {
      generateCanvasImage();
    }
  }, [isOpen, verseData, selectedTheme, aspectRatio, backgroundMode, activeKey, cardGlassOpacity]);

  // Save new Gemini API Key
  const handleSaveGeminiKey = () => {
    const trimmed = geminiApiKeyInput.trim();
    saveGeminiKey(trimmed);
    setActiveKey(trimmed);
    setShowKeyInput(false);
    setAiErrorMessage(null);
    // Invalidate cache for gemini so it regenerates with the new key
    const width = 1080;
    const height = aspectRatio === 'status' ? 1920 : 1080;
    delete aiImageCacheRef.current[`gemini-${surahNum}-${ayahNum}-${width}x${height}`];
    generateCanvasImage();
  };

  // Regenerate fresh AI variation
  const handleRegenerate = useCallback(() => {
    if (!verseData) return;
    const width = 1080;
    const height = aspectRatio === 'status' ? 1920 : 1080;
    const cacheKey = `${backgroundMode}-${surahNum}-${ayahNum}-${width}x${height}`;
    delete aiImageCacheRef.current[cacheKey];

    setPreviewDataUrl(null);
    setAiErrorMessage(null);
    generateCanvasImage();
  }, [verseData, backgroundMode, surahNum, ayahNum, aspectRatio, generateCanvasImage]);

  // Download HD PNG
  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const result = await generateCanvasImage();
      if (!result) { setIsGenerating(false); return; }
      const { dataUrl } = result;
      const fileName = `QuranAI-Surah-${surahNum}-${ayahNum}-${aspectRatio}.png`;

      const link = document.createElement('a');
      link.download = fileName;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error('Download error:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy Image to Clipboard
  const handleCopy = async () => {
    try {
      const result = await generateCanvasImage();
      if (!result) return;
      const { canvas } = result;
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        } catch (err) {
          console.warn('Clipboard write failed:', err);
        }
      }, 'image/png');
    } catch (e) {
      console.error('Copy error:', e);
    }
  };

  // WhatsApp Share Handler
  const handleWhatsAppShare = async () => {
    setIsGenerating(true);
    try {
      const result = await generateCanvasImage();
      if (!result) { setIsGenerating(false); return; }
      const { canvas } = result;
      const fileName = `QuranAI-Verse-${surahNum}-${ayahNum}.png`;

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], fileName, { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: `Daily Reflection · ${verseData.surah}`,
              text: `"${verseData.translation}"\n— ${verseData.surah}\n\nRead more on Quran AI:\nhttps://quran-ai.vercel.app/quran?surah=${surahNum}&ayah=${ayahNum}`,
              files: [file]
            });
            setIsGenerating(false);
            return;
          } catch (shareErr) {
            if (shareErr.name !== 'AbortError') {
              console.warn('Navigator share failed', shareErr);
            }
          }
        }

        handleDownload();
        const shareText = [
          `🌟 *${verseData.surah}*`,
          ``,
          `"${verseData.translation}"`,
          ``,
          `🖼️ *(Attached verse status card generated by Quran AI)*`,
          ``,
          `Read & reflect: https://quran-ai.vercel.app/quran?surah=${surahNum}&ayah=${ayahNum}`
        ].join('\n');

        const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
        window.open(waUrl, '_blank', 'noopener,noreferrer');
        setIsGenerating(false);
      }, 'image/png');

    } catch (err) {
      console.error('WhatsApp share failed:', err);
      setIsGenerating(false);
    }
  };

  if (!isOpen || !verseData) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-2 sm:p-5 bg-black/90 backdrop-blur-md animate-fade-in overflow-y-auto pt-12 sm:pt-6 pb-20 sm:pb-6">
      <div className="bg-[#071b12] border border-[#C5A059]/40 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh] my-auto animate-fade-in-up">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 sm:py-4 border-b border-[#C5A059]/25 bg-[#092218]/90">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-[#C5A059]/20 text-[#C5A059]">
              <Sparkles size={20} />
            </span>
            <div>
              <h3 className="font-outfit font-bold text-sm sm:text-lg text-white flex items-center gap-2">
                WhatsApp Status & Story Card
                {backgroundMode === 'gemini' && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-[#C5A059]/40 text-[#C5A059] font-medium hidden sm:inline-block">
                    ✨ Gemini Imagen
                  </span>
                )}
              </h3>
              <p className="text-[11px] sm:text-xs text-[#F5F1E6]/60">
                Generate high-definition status images for WhatsApp, Stories & Socials
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-[#061610]/60 border border-[#C5A059]/20 text-[#F5F1E6]/70 hover:text-white hover:bg-[#C5A059]/15 transition-all"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto p-4 sm:p-6 gap-6">
          
          {/* Settings Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-5">
            
            {/* 1. Format Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#C5A059] flex items-center gap-1.5 uppercase tracking-wider">
                <Smartphone size={14} /> 1. Format
              </label>

              <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                <button
                  type="button"
                  onClick={() => setAspectRatio('status')}
                  className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 sm:gap-3 ${
                    aspectRatio === 'status'
                      ? 'bg-[#C5A059]/20 border-[#C5A059] text-white shadow-md'
                      : 'bg-[#061A12] border-[#C5A059]/20 text-[#F5F1E6]/70 hover:border-[#C5A059]/40'
                  }`}
                >
                  <div className={`w-7 h-11 rounded-lg border-2 flex items-center justify-center shrink-0 ${
                    aspectRatio === 'status' ? 'border-[#C5A059] bg-[#C5A059]/10' : 'border-[#F5F1E6]/30'
                  }`}>
                    <span className="text-[9px] font-bold">9:16</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold leading-tight truncate">WhatsApp Status</p>
                    <p className="text-[10px] text-[#F5F1E6]/50 mt-0.5">Story Fullscreen</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setAspectRatio('square')}
                  className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 sm:gap-3 ${
                    aspectRatio === 'square'
                      ? 'bg-[#C5A059]/20 border-[#C5A059] text-white shadow-md'
                      : 'bg-[#061A12] border-[#C5A059]/20 text-[#F5F1E6]/70 hover:border-[#C5A059]/40'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center shrink-0 ${
                    aspectRatio === 'square' ? 'border-[#C5A059] bg-[#C5A059]/10' : 'border-[#F5F1E6]/30'
                  }`}>
                    <span className="text-[9px] font-bold">1:1</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold leading-tight truncate">Square Post</p>
                    <p className="text-[10px] text-[#F5F1E6]/50 mt-0.5">Feed & Groups</p>
                  </div>
                </button>
              </div>
            </div>

            {/* 2. Background Style Engine */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#C5A059] flex items-center gap-1.5 uppercase tracking-wider">
                <Layers size={14} /> 2. Background Style
              </label>

              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                
                {/* Gemini AI Imagen */}
                <button
                  type="button"
                  onClick={() => setBackgroundMode('gemini')}
                  className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                    backgroundMode === 'gemini'
                      ? 'bg-gradient-to-b from-[#C5A059]/25 to-emerald-950/60 border-[#C5A059] text-white shadow-md ring-1 ring-[#C5A059]'
                      : 'bg-[#061A12] border-[#C5A059]/20 text-[#F5F1E6]/70 hover:border-[#C5A059]/40'
                  }`}
                >
                  <span className="text-base">✨</span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold leading-tight text-[#C5A059]">Gemini AI</p>
                    <p className="text-[9px] text-[#F5F1E6]/50">Imagen 3</p>
                  </div>
                </button>

                {/* Classic Geometric */}
                <button
                  type="button"
                  onClick={() => setBackgroundMode('geometric')}
                  className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                    backgroundMode === 'geometric'
                      ? 'bg-[#C5A059]/20 border-[#C5A059] text-white shadow-md ring-1 ring-[#C5A059]'
                      : 'bg-[#061A12] border-[#C5A059]/20 text-[#F5F1E6]/70 hover:border-[#C5A059]/40'
                  }`}
                >
                  <span className="text-base">🎨</span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold leading-tight">Geometric</p>
                    <p className="text-[9px] text-[#F5F1E6]/50">Luxury Gold</p>
                  </div>
                </button>

                {/* Scenic Classic */}
                <button
                  type="button"
                  onClick={() => setBackgroundMode('scenic')}
                  className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                    backgroundMode === 'scenic'
                      ? 'bg-[#C5A059]/20 border-[#C5A059] text-white shadow-md ring-1 ring-[#C5A059]'
                      : 'bg-[#061A12] border-[#C5A059]/20 text-[#F5F1E6]/70 hover:border-[#C5A059]/40'
                  }`}
                >
                  <span className="text-base">🖼️</span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold leading-tight">Scenic</p>
                    <p className="text-[9px] text-[#F5F1E6]/50">Free Fast AI</p>
                  </div>
                </button>
              </div>

              {/* Gemini / Scenic Info Box */}
              {backgroundMode === 'gemini' && (
                <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-[#071F14] border border-[#C5A059]/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-[#C5A059] font-medium">
                      <Wand2 size={13} />
                      <span>Scene: <strong className="text-white">{surahThemeCategory}</strong></span>
                      <span className="text-[10px] text-[#F5F1E6]/50">· Surah {surahNum}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 flex items-center gap-1 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Auto-Connected
                      </span>

                      <button
                        type="button"
                        onClick={handleRegenerate}
                        disabled={aiImageLoading}
                        className="text-[10px] px-2.5 py-1 rounded-lg bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#C5A059] hover:bg-[#C5A059]/25 transition-all flex items-center gap-1 disabled:opacity-50"
                        title="Generate a fresh variation with Gemini AI"
                      >
                        <RefreshCw size={10} className={aiImageLoading ? 'animate-spin' : ''} />
                        Regenerate
                      </button>
                    </div>
                  </div>

                  {aiErrorMessage && (
                    <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-1.5 text-[10px] text-amber-200">
                      <AlertCircle size={12} className="shrink-0 mt-0.5 text-amber-400" />
                      <div>
                        <span>{aiErrorMessage}</span>
                        <p className="text-[9px] text-[#F5F1E6]/60 mt-0.5">
                          Shown using atmospheric scenic mode.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {backgroundMode === 'scenic' && (
                <div className="p-2.5 rounded-xl bg-[#061A12] border border-[#C5A059]/20 flex items-center justify-between text-[10px] text-[#F5F1E6]/70">
                  <span className="flex items-center gap-1">
                    <ImageIcon size={11} className="text-[#C5A059]" />
                    Theme: <strong className="text-white">{surahThemeCategory}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={handleRegenerate}
                    disabled={aiImageLoading}
                    className="px-2 py-0.5 rounded-md bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#C5A059] hover:bg-[#C5A059]/25 transition-all flex items-center gap-1"
                  >
                    <RefreshCw size={9} className={aiImageLoading ? 'animate-spin' : ''} />
                    New
                  </button>
                </div>
              )}
            </div>

            {/* Card Glass Transparency (Peeche ka Background Dekhne Ke Liye) */}
            <div className="space-y-2 p-3 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-[#071F14] border border-[#C5A059]/25">
              <div className="flex items-center justify-between text-xs font-semibold text-[#F5F1E6]/90">
                <span className="flex items-center gap-1.5 text-[#C5A059]">
                  <Sliders size={13} />
                  Card Transparency (Background Visibility)
                </span>
                <span className="text-[11px] font-mono text-[#FFE8A3] bg-black/40 px-2 py-0.5 rounded-md border border-[#C5A059]/20">
                  {100 - cardGlassOpacity}% transparent
                </span>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <input
                  type="range"
                  min="0"
                  max="70"
                  step="5"
                  value={cardGlassOpacity}
                  onChange={(e) => setCardGlassOpacity(Number(e.target.value))}
                  className="flex-1 accent-[#C5A059] h-1.5 bg-black/50 rounded-lg cursor-pointer"
                  title="Adjust card transparency to reveal more background photo"
                />
                <div className="flex gap-1">
                  {[
                    { label: 'Clear', val: 5 },
                    { label: 'Glassy', val: 18 },
                    { label: 'Tinted', val: 40 }
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setCardGlassOpacity(preset.val)}
                      className={`text-[10px] px-2 py-0.5 rounded-lg border transition-all ${
                        cardGlassOpacity === preset.val
                          ? 'bg-[#C5A059] text-[#041710] font-bold border-[#C5A059]'
                          : 'bg-black/40 text-[#F5F1E6]/70 border-[#C5A059]/20 hover:text-white'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-[9px] text-[#F5F1E6]/50">
                Transparency badhane se peeche ki mosque arches, minarets aur chandeliers saaf nazar aayenge.
              </p>
            </div>

            {/* 3. Theme & Color Accents */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#C5A059] flex items-center gap-1.5 uppercase tracking-wider">
                <Palette size={14} /> 3. Accent Palette
              </label>

              <div className="grid grid-cols-2 gap-2">
                {THEMES.map((theme) => {
                  const isSelected = selectedTheme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setSelectedTheme(theme.id)}
                      className={`p-2 rounded-xl border text-left transition-all flex items-center gap-2 ${
                        isSelected 
                          ? 'border-[#C5A059] bg-[#0c3123] shadow-md ring-1 ring-[#C5A059]' 
                          : 'border-[#C5A059]/15 bg-[#05170f] hover:border-[#C5A059]/35'
                      }`}
                    >
                      <div 
                        className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                        style={{ background: `linear-gradient(135deg, ${theme.bgStart}, ${theme.accent})` }}
                      />
                      <p className={`text-xs font-semibold leading-tight truncate ${isSelected ? 'text-[#C5A059]' : 'text-white'}`}>
                        {theme.name}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions: WhatsApp Share, Download, Copy */}
            <div className="space-y-2 pt-1 sm:pt-2">
              <button
                onClick={handleWhatsAppShare}
                disabled={isGenerating || aiImageLoading}
                className="w-full py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-[#061610] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-60"
              >
                {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <WhatsAppIcon size={18} />}
                <span>Share to WhatsApp & Status</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleDownload}
                  disabled={isGenerating || aiImageLoading}
                  className="py-2 px-3 rounded-xl bg-[#0c2e22] hover:bg-[#0f3d2e] border border-[#C5A059]/40 text-[#C5A059] font-semibold text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-60"
                >
                  <Download size={14} />
                  <span>Download PNG</span>
                </button>

                <button
                  onClick={handleCopy}
                  disabled={aiImageLoading}
                  className="py-2 px-3 rounded-xl bg-[#061a13] hover:bg-[#0c2e22] border border-[#C5A059]/25 text-[#F5F1E6]/80 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-60"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copied ? 'Copied!' : 'Copy Image'}</span>
                </button>
              </div>
            </div>

          </div>

          {/* Live Card Preview Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-3 sm:p-5 rounded-2xl bg-[#04120c] border border-[#C5A059]/20 relative min-h-[380px] sm:min-h-[440px]">
            <span className="absolute top-3 left-3 text-[10px] text-[#C5A059] font-bold uppercase tracking-widest flex items-center gap-1">
              <Eye size={12} /> Live Card Preview
            </span>

            {/* AI Generation Loading Overlay */}
            {aiImageLoading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#04120c]/90 backdrop-blur-sm rounded-2xl gap-3 animate-fade-in">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500/20 to-emerald-500/20 animate-pulse flex items-center justify-center border border-[#C5A059]/40">
                    <Sparkles size={28} className="text-[#C5A059] animate-spin" />
                  </div>
                </div>
                <div className="text-center px-4">
                  <p className="text-sm font-bold text-[#C5A059]">
                    {backgroundMode === 'gemini' ? 'Gemini AI Imagen 3' : 'Generating AI Scenic Image'}
                  </p>
                  <p className="text-[11px] text-[#F5F1E6]/60 mt-1 max-w-xs">
                    Synthesizing spiritual {surahThemeCategory.toLowerCase()} scene for Surah {surahNum}...
                  </p>
                </div>
              </div>
            )}

            {previewDataUrl ? (
              <div 
                className={`relative rounded-xl overflow-hidden shadow-2xl border border-[#C5A059]/40 transition-all ${
                  aspectRatio === 'status' ? 'w-[250px] sm:w-[280px] aspect-[9/16]' : 'w-[280px] sm:w-[320px] aspect-square'
                }`}
              >
                <img 
                  src={previewDataUrl} 
                  alt="Quran Verse Status Card"
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 text-[#C5A059]">
                <Loader2 size={28} className="animate-spin" />
                <span className="text-xs">Rendering Status Card...</span>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

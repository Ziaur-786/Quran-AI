/**
 * Scenic Canvas Renderer for Quran AI Status Cards
 * Renders high-definition atmospheric scenes (Dawn, Celestial Night, Divine Light, Mosque Arches, etc.)
 * directly onto the Canvas without requiring external image CDNs.
 */

/**
 * Draw a rich atmospheric spiritual scene matching the Surah category
 * @param {CanvasRenderingContext2D} ctx 
 * @param {number} width - Canvas width (1080)
 * @param {number} height - Canvas height (1920 or 1080)
 * @param {string} category - e.g. 'dawn', 'night', 'light', 'mosque', 'desert', 'stars', 'garden', 'ocean', 'mountain'
 * @param {Object} theme - Active color theme
 */
export function drawScenicBackground(ctx, width, height, category = 'mosque', theme) {
  const cat = (category || 'mosque').toLowerCase();

  switch (cat) {
    case 'night':
    case 'stars':
      drawCelestialNightScene(ctx, width, height, theme);
      break;

    case 'dawn':
    case 'sky':
      drawGoldenDawnScene(ctx, width, height, theme);
      break;

    case 'light':
    case 'cave':
      drawDivineLightScene(ctx, width, height, theme);
      break;

    case 'desert':
    case 'fire':
      drawGoldenDesertScene(ctx, width, height, theme);
      break;

    case 'mountain':
      drawMountainSanctuaryScene(ctx, width, height, theme);
      break;

    case 'garden':
    case 'nature':
    case 'waterfall':
    case 'rain':
      drawParadiseGardenScene(ctx, width, height, theme);
      break;

    case 'ocean':
      drawTranquilOceanScene(ctx, width, height, theme);
      break;

    case 'mosque':
    default:
      drawGrandMosqueScene(ctx, width, height, theme);
      break;
  }
}

// ─────────────────────────────────────────────
// 1. CELESTIAL NIGHT SCENE
// ─────────────────────────────────────────────
function drawCelestialNightScene(ctx, width, height, theme) {
  // Deep midnight gradient
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, '#030814');
  grad.addColorStop(0.35, '#07162c');
  grad.addColorStop(0.7, '#0b1f3d');
  grad.addColorStop(1, '#040b17');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Soft Nebula Glow
  const nebula = ctx.createRadialGradient(
    width * 0.7, height * 0.25, 40,
    width * 0.7, height * 0.25, width * 0.6
  );
  nebula.addColorStop(0, 'rgba(100, 181, 246, 0.15)');
  nebula.addColorStop(0.6, 'rgba(123, 31, 162, 0.08)');
  nebula.addColorStop(1, 'transparent');
  ctx.fillStyle = nebula;
  ctx.fillRect(0, 0, width, height);

  // Starfield (deterministic based on fixed coordinates)
  ctx.save();
  for (let i = 0; i < 90; i++) {
    const x = (Math.sin(i * 997) * 0.5 + 0.5) * width;
    const y = (Math.cos(i * 613) * 0.5 + 0.5) * height * 0.65;
    const radius = ((i % 5) === 0) ? 2.5 : ((i % 2) === 0 ? 1.5 : 1);
    const alpha = 0.3 + ((i % 7) / 10);

    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    // Occasional 4-point twinkle star
    if (i % 12 === 0) {
      ctx.strokeStyle = 'rgba(255, 245, 210, 0.55)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x - 6, y);
      ctx.lineTo(x + 6, y);
      ctx.moveTo(x, y - 6);
      ctx.lineTo(x, y + 6);
      ctx.stroke();
    }
  }
  ctx.restore();

  // Glowing Crescent Moon (Hilal)
  ctx.save();
  const moonX = width * 0.78;
  const moonY = height * 0.16;
  const moonR = 48;

  // Moon Glow
  const moonGlow = ctx.createRadialGradient(moonX, moonY, 10, moonX, moonY, moonR * 3);
  moonGlow.addColorStop(0, 'rgba(255, 248, 220, 0.35)');
  moonGlow.addColorStop(0.5, 'rgba(197, 160, 89, 0.12)');
  moonGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = moonGlow;
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonR * 3, 0, Math.PI * 2);
  ctx.fill();

  // Crescent Shape
  ctx.fillStyle = '#FFF8E7';
  ctx.shadowColor = 'rgba(255, 248, 220, 0.8)';
  ctx.shadowBlur = 15;
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonR, 0.2 * Math.PI, 1.8 * Math.PI, false);
  ctx.arc(moonX + 16, moonY - 4, moonR * 0.85, 1.7 * Math.PI, 0.3 * Math.PI, true);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Distant Mosque Skyline Silhouette at the bottom
  drawDistantMosqueSilhouette(ctx, width, height, 'rgba(3, 8, 18, 0.95)');
}

// ─────────────────────────────────────────────
// 2. GOLDEN DAWN SCENE (FAJR)
// ─────────────────────────────────────────────
function drawGoldenDawnScene(ctx, width, height, theme) {
  // Rich sunrise gradient
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, '#0c0c18');
  grad.addColorStop(0.3, '#1e1424');
  grad.addColorStop(0.55, '#3b1c20');
  grad.addColorStop(0.75, '#6b301c');
  grad.addColorStop(0.9, '#a3541f');
  grad.addColorStop(1, '#cda142');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Radiant Rising Sun Horizon Glow
  const sunX = width / 2;
  const sunY = height * 0.78;
  const sunGlow = ctx.createRadialGradient(sunX, sunY, 20, sunX, sunY, width * 0.85);
  sunGlow.addColorStop(0, 'rgba(255, 235, 175, 0.7)');
  sunGlow.addColorStop(0.25, 'rgba(243, 201, 105, 0.35)');
  sunGlow.addColorStop(0.6, 'rgba(180, 80, 40, 0.15)');
  sunGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = sunGlow;
  ctx.fillRect(0, 0, width, height);

  // Volumetric Dawn Light Beams
  ctx.save();
  ctx.globalAlpha = 0.08;
  ctx.fillStyle = '#FFE8A3';
  for (let angle = -0.4; angle <= 0.4; angle += 0.08) {
    ctx.beginPath();
    ctx.moveTo(sunX, sunY);
    ctx.lineTo(sunX + Math.sin(angle - 0.03) * width * 1.5, 0);
    ctx.lineTo(sunX + Math.sin(angle + 0.03) * width * 1.5, 0);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // Rolling Dune / Mountain Ridges
  drawDistantMountains(ctx, width, height, 'rgba(20, 10, 15, 0.85)', 'rgba(35, 18, 22, 0.6)');
}

// ─────────────────────────────────────────────
// 3. DIVINE LIGHT SCENE (NOOR)
// ─────────────────────────────────────────────
function drawDivineLightScene(ctx, width, height, theme) {
  // Rich emerald dark sanctuary
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, '#020f0a');
  grad.addColorStop(0.4, '#041d14');
  grad.addColorStop(0.7, '#082f21');
  grad.addColorStop(1, '#020d09');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Grand Archway Light Source from top
  const archX = width / 2;
  const archY = height * 0.12;
  const archLight = ctx.createRadialGradient(archX, archY, 30, archX, height * 0.45, width * 0.85);
  archLight.addColorStop(0, 'rgba(255, 238, 180, 0.45)');
  archLight.addColorStop(0.3, 'rgba(197, 160, 89, 0.22)');
  archLight.addColorStop(0.7, 'rgba(10, 60, 40, 0.1)');
  archLight.addColorStop(1, 'transparent');
  ctx.fillStyle = archLight;
  ctx.fillRect(0, 0, width, height);

  // Dramatic Divine Light Rays cascading down
  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = '#F5DEB3';
  for (let i = -4; i <= 4; i++) {
    ctx.beginPath();
    ctx.moveTo(archX, archY);
    ctx.lineTo(archX + i * 140 - 50, height);
    ctx.lineTo(archX + i * 140 + 50, height);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // Floating Divine Light Particles
  ctx.save();
  for (let i = 0; i < 45; i++) {
    const px = (Math.sin(i * 433) * 0.5 + 0.5) * (width - 200) + 100;
    const py = (Math.cos(i * 787) * 0.5 + 0.5) * (height - 300) + 150;
    const pr = ((i % 4) === 0) ? 3 : 1.5;
    const pa = 0.2 + ((i % 6) / 10);

    ctx.fillStyle = `rgba(232, 200, 122, ${pa})`;
    ctx.shadowColor = 'rgba(232, 200, 122, 0.8)';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(px, py, pr, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Sacred Moorish Arch Outline
  drawMoorishArch(ctx, width, height, 'rgba(197, 160, 89, 0.25)');
}

// ─────────────────────────────────────────────
// 4. GRAND MOSQUE SCENE
// ─────────────────────────────────────────────
function drawGrandMosqueScene(ctx, width, height, theme) {
  // Majestic twilight atmosphere
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, '#041410');
  grad.addColorStop(0.35, '#08251b');
  grad.addColorStop(0.7, '#0e382a');
  grad.addColorStop(1, '#051811');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Central spiritual glow
  const centerGlow = ctx.createRadialGradient(
    width / 2, height * 0.45, 60,
    width / 2, height * 0.45, width * 0.75
  );
  centerGlow.addColorStop(0, 'rgba(197, 160, 89, 0.2)');
  centerGlow.addColorStop(0.5, 'rgba(14, 56, 42, 0.15)');
  centerGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = centerGlow;
  ctx.fillRect(0, 0, width, height);

  // Sacred Moorish Arch Framing
  drawMoorishArch(ctx, width, height, 'rgba(197, 160, 89, 0.3)');

  // Distant illuminated domes silhouette at lower third
  drawDistantMosqueSilhouette(ctx, width, height, 'rgba(4, 18, 13, 0.9)');
}

// ─────────────────────────────────────────────
// 5. GOLDEN DESERT SCENE
// ─────────────────────────────────────────────
function drawGoldenDesertScene(ctx, width, height, theme) {
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, '#120a06');
  grad.addColorStop(0.4, '#24140b');
  grad.addColorStop(0.65, '#452614');
  grad.addColorStop(0.85, '#7a421b');
  grad.addColorStop(1, '#a66428');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Warm desert twilight glow
  const glow = ctx.createRadialGradient(width * 0.5, height * 0.6, 50, width * 0.5, height * 0.6, width * 0.7);
  glow.addColorStop(0, 'rgba(243, 201, 105, 0.3)');
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  // Sand Dune Curves at bottom
  ctx.save();
  ctx.fillStyle = 'rgba(25, 12, 6, 0.9)';
  ctx.beginPath();
  ctx.moveTo(0, height * 0.82);
  ctx.bezierCurveTo(width * 0.3, height * 0.78, width * 0.6, height * 0.88, width, height * 0.8);
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = 'rgba(15, 7, 3, 0.98)';
  ctx.beginPath();
  ctx.moveTo(0, height * 0.89);
  ctx.bezierCurveTo(width * 0.4, height * 0.94, width * 0.7, height * 0.86, width, height * 0.92);
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// ─────────────────────────────────────────────
// 6. PARADISE GARDEN SCENE (RAWDAH / JANNAH)
// ─────────────────────────────────────────────
function drawParadiseGardenScene(ctx, width, height, theme) {
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, '#04160e');
  grad.addColorStop(0.4, '#09291b');
  grad.addColorStop(0.7, '#12422e');
  grad.addColorStop(1, '#082116');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Sunbeams filtering through paradise canopy
  ctx.save();
  ctx.globalAlpha = 0.08;
  ctx.fillStyle = '#FFE8A3';
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.moveTo(width * 0.2 + i * 120, 0);
    ctx.lineTo(width * 0.1 + i * 160, height);
    ctx.lineTo(width * 0.1 + i * 160 + 60, height);
    ctx.lineTo(width * 0.2 + i * 120 + 40, 0);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

// ─────────────────────────────────────────────
// 7. TRANQUIL OCEAN SCENE
// ─────────────────────────────────────────────
function drawTranquilOceanScene(ctx, width, height, theme) {
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, '#040d1a');
  grad.addColorStop(0.45, '#092138');
  grad.addColorStop(0.75, '#0e3a5a');
  grad.addColorStop(1, '#061726');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Sea reflection light
  const oceanGlow = ctx.createLinearGradient(0, height * 0.7, 0, height);
  oceanGlow.addColorStop(0, 'rgba(100, 181, 246, 0.15)');
  oceanGlow.addColorStop(1, 'rgba(4, 13, 26, 0.85)');
  ctx.fillStyle = oceanGlow;
  ctx.fillRect(0, height * 0.7, width, height * 0.3);
}

// ─────────────────────────────────────────────
// 8. MOUNTAIN SANCTUARY SCENE
// ─────────────────────────────────────────────
function drawMountainSanctuaryScene(ctx, width, height, theme) {
  drawGoldenDawnScene(ctx, width, height, theme);
}

// ─────────────────────────────────────────────
// HELPER DRAWING UTILITIES
// ─────────────────────────────────────────────

function drawMoorishArch(ctx, width, height, strokeColor) {
  ctx.save();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 2;
  const archW = width * 0.82;
  const archH = height * 0.82;
  const left = (width - archW) / 2;
  const right = left + archW;
  const top = (height - archH) / 2;
  const bottom = top + archH;
  const archApexY = top + 80;

  ctx.beginPath();
  ctx.moveTo(left, bottom);
  ctx.lineTo(left, top + archH * 0.45);
  ctx.bezierCurveTo(left, top + 140, width / 2 - 80, archApexY, width / 2, top);
  ctx.bezierCurveTo(width / 2 + 80, archApexY, right, top + 140, right, top + archH * 0.45);
  ctx.lineTo(right, bottom);
  ctx.stroke();
  ctx.restore();
}

function drawDistantMosqueSilhouette(ctx, width, height, fillColor) {
  ctx.save();
  ctx.fillStyle = fillColor;
  const baseY = height * 0.88;

  ctx.beginPath();
  ctx.moveTo(0, height);
  ctx.lineTo(0, baseY);

  // Small minaret left
  ctx.lineTo(width * 0.18, baseY);
  ctx.lineTo(width * 0.18, baseY - 90);
  ctx.lineTo(width * 0.19, baseY - 120);
  ctx.lineTo(width * 0.20, baseY - 90);
  ctx.lineTo(width * 0.20, baseY);

  // Dome center-left
  ctx.lineTo(width * 0.32, baseY);
  ctx.arc(width * 0.40, baseY, 65, Math.PI, 0, false);
  ctx.lineTo(width * 0.48, baseY);

  // Grand central dome
  ctx.lineTo(width * 0.48, baseY);
  ctx.arc(width * 0.58, baseY, 85, Math.PI, 0, false);
  ctx.lineTo(width * 0.68, baseY);

  // Tall minaret right
  ctx.lineTo(width * 0.78, baseY);
  ctx.lineTo(width * 0.78, baseY - 140);
  ctx.lineTo(width * 0.79, baseY - 180);
  ctx.lineTo(width * 0.80, baseY - 140);
  ctx.lineTo(width * 0.80, baseY);

  ctx.lineTo(width, baseY);
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawDistantMountains(ctx, width, height, color1, color2) {
  ctx.save();
  const baseY = height * 0.86;

  // Layer 1 (Distant)
  ctx.fillStyle = color2;
  ctx.beginPath();
  ctx.moveTo(0, height);
  ctx.lineTo(0, baseY);
  ctx.lineTo(width * 0.2, baseY - 90);
  ctx.lineTo(width * 0.45, baseY - 40);
  ctx.lineTo(width * 0.75, baseY - 110);
  ctx.lineTo(width, baseY - 30);
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fill();

  // Layer 2 (Closer)
  ctx.fillStyle = color1;
  ctx.beginPath();
  ctx.moveTo(0, height);
  ctx.lineTo(0, baseY + 20);
  ctx.lineTo(width * 0.35, baseY - 50);
  ctx.lineTo(width * 0.6, baseY + 10);
  ctx.lineTo(width * 0.85, baseY - 65);
  ctx.lineTo(width, baseY);
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export default { drawScenicBackground };

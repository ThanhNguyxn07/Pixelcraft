// Photorealistic Swiss Mechanical Tourbillon Renderer (HiDPI Canvas 2D)
// Features: Sculpted lugs & strap, fluted crown + pushers, 3 case metals,
// Côtes de Genève mainplate, meshing gear train, 4 Hz flying tourbillon, and sapphire crystal glare.

const METALS = {
  gold: {
    light: '#f7ddb4',
    mid: '#d4a166',
    dark: '#6e4c28',
    rim: '#f2cf9e',
    index: '#f2cf9e',
  },
  platinum: {
    light: '#f3f6fb',
    mid: '#b8c1cf',
    dark: '#4d5563',
    rim: '#e5ebf5',
    index: '#e5ebf5',
  },
  titanium: {
    light: '#b4bcc8',
    mid: '#6e7685',
    dark: '#2b303a',
    rim: '#c8d0dc',
    index: '#d6dce6',
  },
};

function drawGear(ctx, x, y, radius, teeth, angle, color, rimColor, spokes = 5) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  const outerR = radius + 4;
  const innerR = radius - 1.2;
  const step = (Math.PI * 2) / teeth;

  ctx.beginPath();
  for (let i = 0; i < teeth; i++) {
    const a0 = i * step;
    const a1 = a0 + step * 0.28;
    const a2 = a0 + step * 0.48;
    const a3 = a0 + step * 0.78;
    if (i === 0) ctx.moveTo(Math.cos(a0) * innerR, Math.sin(a0) * innerR);
    else ctx.lineTo(Math.cos(a0) * innerR, Math.sin(a0) * innerR);
    ctx.lineTo(Math.cos(a1) * outerR, Math.sin(a1) * outerR);
    ctx.lineTo(Math.cos(a2) * outerR, Math.sin(a2) * outerR);
    ctx.lineTo(Math.cos(a3) * innerR, Math.sin(a3) * innerR);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = rimColor;
  ctx.lineWidth = 0.75;
  ctx.stroke();

  if (radius > 19) {
    const holeR = radius * 0.72;
    const hubR = radius * 0.28;
    ctx.globalCompositeOperation = 'destination-out';
    for (let s = 0; s < spokes; s++) {
      const sa0 = (s * Math.PI * 2) / spokes + 0.14;
      const sa1 = ((s + 1) * Math.PI * 2) / spokes - 0.14;
      ctx.beginPath();
      ctx.arc(0, 0, holeR, sa0, sa1);
      ctx.arc(0, 0, hubR, sa1, sa0, true);
      ctx.closePath();
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  ctx.beginPath();
  ctx.arc(0, 0, Math.max(3.2, radius * 0.12), 0, Math.PI * 2);
  ctx.fillStyle = '#c8975d';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, 0, Math.max(1.8, radius * 0.075), 0, Math.PI * 2);
  ctx.fillStyle = '#e03c5a';
  ctx.fill();
  ctx.restore();
}

function drawHand(ctx, angle, length, tail, width, color) {
  ctx.save();
  ctx.rotate(angle);
  ctx.shadowColor = 'rgba(0,0,0,0.55)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 3;
  ctx.beginPath();
  ctx.moveTo(-width * 0.62, tail);
  ctx.lineTo(-width * 0.34, -length * 0.84);
  ctx.lineTo(0, -length);
  ctx.lineTo(width * 0.34, -length * 0.84);
  ctx.lineTo(width * 0.62, tail);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

export function drawTourbillonFrame(ctx, w, h, state) {
  const cx = w / 2;
  const cy = h / 2;
  const R = Math.min(w, h) * 0.35;
  const m = METALS[state.metal] || METALS.gold;

  ctx.clearRect(0, 0, w, h);

  // Warm studio radial spotlight behind timepiece
  const halo = ctx.createRadialGradient(cx, cy, R * 0.6, cx, cy, R * 1.65);
  halo.addColorStop(0, 'rgba(217, 167, 106, 0.16)');
  halo.addColorStop(0.55, 'rgba(217, 167, 106, 0.04)');
  halo.addColorStop(1, 'rgba(9, 10, 13, 0)');
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, w, h);

  // Hand-stitched dark alligator strap (top & bottom)
  const strapW = R * 0.94;
  const strapGrad = ctx.createLinearGradient(cx - strapW / 2, 0, cx + strapW / 2, 0);
  strapGrad.addColorStop(0, '#0b0c0f');
  strapGrad.addColorStop(0.25, '#191b22');
  strapGrad.addColorStop(0.5, '#20232c');
  strapGrad.addColorStop(0.75, '#191b22');
  strapGrad.addColorStop(1, '#0b0c0f');
  ctx.fillStyle = strapGrad;
  ctx.fillRect(cx - strapW / 2, cy - R * 1.48, strapW, R * 2.96);

  // Subtle strap stitching
  ctx.strokeStyle = 'rgba(217, 167, 106, 0.25)';
  ctx.setLineDash([4, 4]);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - strapW * 0.42, cy - R * 1.44);
  ctx.lineTo(cx - strapW * 0.42, cy + R * 1.44);
  ctx.moveTo(cx + strapW * 0.42, cy - R * 1.44);
  ctx.lineTo(cx + strapW * 0.42, cy + R * 1.44);
  ctx.stroke();
  ctx.setLineDash([]);

  // Sculpted Metal Lugs (4 corners)
  const lugGrad = ctx.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
  lugGrad.addColorStop(0, m.light);
  lugGrad.addColorStop(0.5, m.mid);
  lugGrad.addColorStop(1, m.dark);
  ctx.fillStyle = lugGrad;
  const lugOffsets = [
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
  ];
  for (const [sx, sy] of lugOffsets) {
    ctx.beginPath();
    ctx.moveTo(cx + sx * R * 0.46, cy + sy * R * 0.84);
    ctx.lineTo(cx + sx * R * 0.56, cy + sy * R * 1.32);
    ctx.lineTo(cx + sx * R * 0.78, cy + sy * R * 1.24);
    ctx.lineTo(cx + sx * R * 0.90, cy + sy * R * 0.62);
    ctx.closePath();
    ctx.fill();
  }

  // Fluted Winding Crown (3 o'clock) + Chronograph Pushers (2 & 4 o'clock)
  ctx.save();
  ctx.fillStyle = lugGrad;
  // Main crown
  ctx.beginPath();
  ctx.roundRect(cx + R * 1.03, cy - R * 0.14, R * 0.17, R * 0.28, 4);
  ctx.fill();
  // Top pusher (start/stop)
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-0.48);
  ctx.beginPath();
  ctx.roundRect(R * 1.02, -R * 0.08, R * 0.15, R * 0.16, 3);
  ctx.fill();
  ctx.restore();
  // Bottom pusher (reset)
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(0.48);
  ctx.beginPath();
  ctx.roundRect(R * 1.02, -R * 0.08, R * 0.15, R * 0.16, 3);
  ctx.fill();
  ctx.restore();
  ctx.restore();

  // Outer Double-Stepped Case Bezel
  const bezelGrad = ctx.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
  bezelGrad.addColorStop(0, m.light);
  bezelGrad.addColorStop(0.35, m.mid);
  bezelGrad.addColorStop(0.7, m.dark);
  bezelGrad.addColorStop(1, m.light);

  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.65)';
  ctx.shadowBlur = 32;
  ctx.beginPath();
  ctx.arc(cx, cy, R * 1.08, 0, Math.PI * 2);
  ctx.fillStyle = bezelGrad;
  ctx.fill();
  ctx.restore();

  // Inner polished bezel chamfer
  ctx.beginPath();
  ctx.arc(cx, cy, R * 1.01, 0, Math.PI * 2);
  ctx.fillStyle = '#0b0d13';
  ctx.fill();

  // Movement Mainplate Clipped Inside Sapphire Crystal
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, R * 0.97, 0, Math.PI * 2);
  ctx.clip();

  const plateGrad = ctx.createRadialGradient(cx, cy - R * 0.25, R * 0.1, cx, cy, R);
  plateGrad.addColorStop(0, '#1e2432');
  plateGrad.addColorStop(1, '#0b0e15');
  ctx.fillStyle = plateGrad;
  ctx.fillRect(cx - R, cy - R, R * 2, R * 2);

  // Côtes de Genève stripes
  const stripeW = R * 0.13;
  for (let x = cx - R; x < cx + R; x += stripeW) {
    const sg = ctx.createLinearGradient(x, 0, x + stripeW, 0);
    sg.addColorStop(0, 'rgba(255,255,255,0.04)');
    sg.addColorStop(0.5, 'rgba(255,255,255,0.006)');
    sg.addColorStop(1, 'rgba(0,0,0,0.22)');
    ctx.fillStyle = sg;
    ctx.fillRect(x, cy - R, stripeW, R * 2);
  }

  // Meshing Gear Train
  const t = state.simSec;
  const barrelAngle = t * 0.08 + state.windAngle;
  const centerAngle = -t * 0.22;
  const thirdAngle = t * 0.45;
  const fourthAngle = -t * 0.85;

  drawGear(ctx, cx - R * 0.34, cy - R * 0.26, R * 0.33, 36, barrelAngle, '#b88a55', '#f2cf9e', 6);
  drawGear(ctx, cx + R * 0.32, cy - R * 0.22, R * 0.26, 28, thirdAngle, '#9aa3b4', '#dce2ec', 5);
  drawGear(ctx, cx, cy, R * 0.24, 24, centerAngle, '#c99962', '#f3d4a6', 5);
  drawGear(ctx, cx + R * 0.26, cy + R * 0.24, R * 0.19, 20, fourthAngle, '#b88a55', '#f2cf9e', 4);

  // Midnight Enamel Sunburst Dial (fades translucent in X-Ray Skeleton mode)
  const dialAlpha = state.skeleton ? 0.22 : 0.94;
  ctx.save();
  ctx.globalAlpha = dialAlpha;
  ctx.beginPath();
  ctx.arc(cx, cy, R * 0.97, 0, Math.PI * 2);
  const tourbY = cy + R * 0.42;
  const tourbR = R * 0.29;
  ctx.moveTo(cx + tourbR, tourbY);
  ctx.arc(cx, tourbY, tourbR, 0, Math.PI * 2, true);
  const dialGrad = ctx.createRadialGradient(cx, cy - R * 0.3, R * 0.05, cx, cy, R);
  dialGrad.addColorStop(0, '#161b26');
  dialGrad.addColorStop(1, '#090b10');
  ctx.fillStyle = dialGrad;
  ctx.fill('evenodd');
  ctx.restore();

  // Tourbillon Aperture Bevel
  ctx.beginPath();
  ctx.arc(cx, tourbY, tourbR, 0, Math.PI * 2);
  ctx.strokeStyle = m.rim;
  ctx.lineWidth = 2.2;
  ctx.stroke();

  // 1-Minute Flying Tourbillon Cage + 4 Hz Balance Wheel + Breathing Blued Hairspring
  ctx.save();
  ctx.translate(cx, tourbY);
  ctx.rotate((t * Math.PI * 2) / 60);
  drawGear(ctx, 0, 0, tourbR * 0.52, 15, t * 2.4, '#c8975d', '#f2cf9e', 3);

  const balanceOsc = Math.sin(t * Math.PI * 2 * 4.0) * 1.15;
  ctx.save();
  ctx.rotate(balanceOsc);
  ctx.beginPath();
  ctx.arc(0, 0, tourbR * 0.78, 0, Math.PI * 2);
  ctx.strokeStyle = '#f2cf9e';
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-tourbR * 0.78, 0);
  ctx.lineTo(tourbR * 0.78, 0);
  ctx.strokeStyle = '#d9a76a';
  ctx.lineWidth = 1.6;
  ctx.stroke();
  ctx.restore();

  ctx.beginPath();
  const breath = 1 + Math.sin(t * Math.PI * 2 * 4.0) * 0.08;
  for (let a = 0; a < Math.PI * 7; a += 0.16) {
    const sr = (a / (Math.PI * 7)) * (tourbR * 0.42) * breath;
    const sx = Math.cos(a) * sr;
    const sy = Math.sin(a) * sr;
    if (a === 0) ctx.moveTo(sx, sy);
    else ctx.lineTo(sx, sy);
  }
  ctx.strokeStyle = '#5a9bff';
  ctx.lineWidth = 1.1;
  ctx.stroke();

  for (let arm = 0; arm < 3; arm++) {
    const aa = (arm * Math.PI * 2) / 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(aa) * tourbR * 0.88, Math.sin(aa) * tourbR * 0.88);
    ctx.strokeStyle = '#dce2ec';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(0, 0, 4.4, 0, Math.PI * 2);
  ctx.fillStyle = '#e03c5a';
  ctx.fill();
  ctx.restore();

  // Minute Track & Applied Faceted Baton Indices
  for (let i = 0; i < 60; i++) {
    const a = (i * Math.PI * 2) / 60 - Math.PI / 2;
    const isHour = i % 5 === 0;
    const r0 = isHour ? R * 0.78 : R * 0.88;
    const r1 = R * 0.92;
    if (i === 30) continue;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
    ctx.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
    ctx.strokeStyle = isHour ? m.index : 'rgba(244, 239, 230, 0.30)';
    ctx.lineWidth = isHour ? 2.8 : 1;
    ctx.stroke();
  }

  // Power Reserve Sub-Dial at 10 o'clock
  const prX = cx - R * 0.42;
  const prY = cy - R * 0.18;
  const prR = R * 0.18;
  ctx.beginPath();
  ctx.arc(prX, prY, prR, Math.PI * 0.75, Math.PI * 2.25);
  ctx.strokeStyle = 'rgba(244, 239, 230, 0.24)';
  ctx.lineWidth = 2;
  ctx.stroke();

  const prFrac = Math.max(0, Math.min(1, state.powerHours / 72));
  ctx.beginPath();
  ctx.arc(prX, prY, prR, Math.PI * 0.75, Math.PI * (0.75 + prFrac * 1.5));
  ctx.strokeStyle = m.rim;
  ctx.lineWidth = 2.6;
  ctx.stroke();

  const prAngle = Math.PI * (0.75 + prFrac * 1.5);
  ctx.beginPath();
  ctx.moveTo(prX, prY);
  ctx.lineTo(prX + Math.cos(prAngle) * (prR - 3), prY + Math.sin(prAngle) * (prR - 3));
  ctx.strokeStyle = '#f4efe6';
  ctx.lineWidth = 1.6;
  ctx.stroke();

  // Manufacture Dial Signature
  ctx.fillStyle = '#f4efe6';
  ctx.font = `600 ${Math.round(R * 0.072)}px "Space Grotesk", sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('CHRONOS', cx, cy - R * 0.48);
  ctx.fillStyle = m.rim;
  ctx.font = `500 ${Math.round(R * 0.042)}px "JetBrains Mono", monospace`;
  ctx.fillText('GENÈVE · CAL. 09', cx, cy - R * 0.38);

  // Real Local Time + Chronograph Sweep Hand
  const now = new Date();
  const sec = now.getSeconds() + now.getMilliseconds() / 1000;
  const min = now.getMinutes() + sec / 60;
  const hr = (now.getHours() % 12) + min / 60;

  ctx.save();
  ctx.translate(cx, cy);
  drawHand(ctx, (hr * Math.PI * 2) / 12, R * 0.52, R * 0.12, 7.2, m.rim);
  drawHand(ctx, (min * Math.PI * 2) / 60, R * 0.76, R * 0.14, 5.0, '#f4efe6');
  drawHand(ctx, ((state.chronoSec % 60) * Math.PI * 2) / 60, R * 0.86, R * 0.22, 2.2, '#5a9bff');

  ctx.beginPath();
  ctx.arc(0, 0, 6.8, 0, Math.PI * 2);
  ctx.fillStyle = m.mid;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, 0, 2.6, 0, Math.PI * 2);
  ctx.fillStyle = '#090a0d';
  ctx.fill();
  ctx.restore();

  // Domed Sapphire Crystal Specular Glare
  const glare = ctx.createLinearGradient(cx - R * 0.8, cy - R * 0.9, cx + R * 0.5, cy + R * 0.6);
  glare.addColorStop(0, 'rgba(255,255,255,0.13)');
  glare.addColorStop(0.32, 'rgba(255,255,255,0.03)');
  glare.addColorStop(0.5, 'rgba(255,255,255,0)');
  glare.addColorStop(1, 'rgba(255,255,255,0.04)');
  ctx.fillStyle = glare;
  ctx.fillRect(cx - R, cy - R, R * 2, R * 2);

  ctx.restore();
}

// Mathematical Swiss Mechanical Tourbillon & Gear Train Renderer (HiDPI Canvas 2D)

function drawGear(ctx, x, y, radius, teeth, angle, color, rimColor, spokes = 5) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  const outerR = radius + 4.2;
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
  ctx.lineWidth = 0.8;
  ctx.stroke();

  // Hollow cutouts leaving precision spokes
  if (radius > 20) {
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

  // Center jewel chaton
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
  ctx.beginPath();
  ctx.moveTo(-width * 0.65, tail);
  ctx.lineTo(-width * 0.35, -length * 0.82);
  ctx.lineTo(0, -length);
  ctx.lineTo(width * 0.35, -length * 0.82);
  ctx.lineTo(width * 0.65, tail);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

export function drawTourbillonFrame(ctx, w, h, state) {
  const cx = w / 2;
  const cy = h / 2;
  const R = Math.min(w, h) * 0.43;

  ctx.clearRect(0, 0, w, h);

  // Subtle ambient vignette around case
  const halo = ctx.createRadialGradient(cx, cy, R * 0.82, cx, cy, R * 1.24);
  halo.addColorStop(0, 'rgba(217, 167, 106, 0.12)');
  halo.addColorStop(0.65, 'rgba(217, 167, 106, 0.03)');
  halo.addColorStop(1, 'rgba(10, 12, 16, 0)');
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, w, h);

  // Outer 18K Rose Gold Bezel
  const bezelGrad = ctx.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
  bezelGrad.addColorStop(0, '#f3d4a6');
  bezelGrad.addColorStop(0.35, '#c9965c');
  bezelGrad.addColorStop(0.7, '#7c5933');
  bezelGrad.addColorStop(1, '#e8c18b');

  ctx.beginPath();
  ctx.arc(cx, cy, R * 1.045, 0, Math.PI * 2);
  ctx.fillStyle = bezelGrad;
  ctx.fill();

  // Inner recessed steel step
  ctx.beginPath();
  ctx.arc(cx, cy, R * 0.99, 0, Math.PI * 2);
  ctx.fillStyle = '#0d1016';
  ctx.fill();

  // Movement Mainplate with Côtes de Genève stripes
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, R * 0.96, 0, Math.PI * 2);
  ctx.clip();

  const plateGrad = ctx.createRadialGradient(cx, cy - R * 0.25, R * 0.1, cx, cy, R);
  plateGrad.addColorStop(0, '#1e2330');
  plateGrad.addColorStop(1, '#0e1118');
  ctx.fillStyle = plateGrad;
  ctx.fillRect(cx - R, cy - R, R * 2, R * 2);

  // Geneva stripes
  const stripeW = R * 0.13;
  for (let x = cx - R; x < cx + R; x += stripeW) {
    const sg = ctx.createLinearGradient(x, 0, x + stripeW, 0);
    sg.addColorStop(0, 'rgba(255,255,255,0.035)');
    sg.addColorStop(0.5, 'rgba(255,255,255,0.005)');
    sg.addColorStop(1, 'rgba(0,0,0,0.18)');
    ctx.fillStyle = sg;
    ctx.fillRect(x, cy - R, stripeW, R * 2);
  }

  // Meshing Gear Train (visible strongly in X-Ray Skeleton mode and through open-heart)
  const t = state.simSec;
  const barrelAngle = t * 0.08 + state.windAngle;
  const centerAngle = -t * 0.22;
  const thirdAngle = t * 0.45;
  const fourthAngle = -t * 0.85;

  drawGear(ctx, cx - R * 0.34, cy - R * 0.26, R * 0.33, 36, barrelAngle, '#b88a55', '#f2cf9e', 6);
  drawGear(ctx, cx + R * 0.32, cy - R * 0.22, R * 0.26, 28, thirdAngle, '#9aa3b4', '#dce2ec', 5);
  drawGear(ctx, cx, cy, R * 0.24, 24, centerAngle, '#c99962', '#f3d4a6', 5);
  drawGear(ctx, cx + R * 0.26, cy + R * 0.24, R * 0.19, 20, fourthAngle, '#b88a55', '#f2cf9e', 4);

  // Midnight Enamel Dial Ring (fades translucent in X-Ray Skeleton mode)
  const dialAlpha = state.skeleton ? 0.26 : 0.92;
  ctx.save();
  ctx.globalAlpha = dialAlpha;
  ctx.beginPath();
  ctx.arc(cx, cy, R * 0.96, 0, Math.PI * 2);
  // Cut out open-heart tourbillon aperture at 6 o'clock
  const tourbY = cy + R * 0.42;
  const tourbR = R * 0.29;
  ctx.moveTo(cx + tourbR, tourbY);
  ctx.arc(cx, tourbY, tourbR, 0, Math.PI * 2, true);
  ctx.fillStyle = '#0c0f16';
  ctx.fill('evenodd');
  ctx.restore();

  // Tourbillon Aperture Gold Bevel
  ctx.beginPath();
  ctx.arc(cx, tourbY, tourbR, 0, Math.PI * 2);
  ctx.strokeStyle = '#d9a76a';
  ctx.lineWidth = 2;
  ctx.stroke();

  // 1-Minute Flying Tourbillon Cage + 4Hz Oscillating Balance Wheel + Breathing Hairspring
  ctx.save();
  ctx.translate(cx, tourbY);
  const cageAngle = (t * Math.PI * 2) / 60;
  ctx.rotate(cageAngle);

  // Escape wheel inside cage
  drawGear(ctx, 0, 0, tourbR * 0.52, 15, t * 2.4, '#c8975d', '#f2cf9e', 3);

  // 4 Hz (28,800 vph) oscillating balance wheel
  const balanceOsc = Math.sin(t * Math.PI * 2 * 4.0) * 1.15;
  ctx.save();
  ctx.rotate(balanceOsc);
  ctx.beginPath();
  ctx.arc(0, 0, tourbR * 0.78, 0, Math.PI * 2);
  ctx.strokeStyle = '#f2cf9e';
  ctx.lineWidth = 2.6;
  ctx.stroke();
  // Balance crossbar & timing screws
  ctx.beginPath();
  ctx.moveTo(-tourbR * 0.78, 0);
  ctx.lineTo(tourbR * 0.78, 0);
  ctx.strokeStyle = '#d9a76a';
  ctx.lineWidth = 1.6;
  ctx.stroke();
  ctx.restore();

  // Breathing concentric hairspring
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

  // Three-arm polished tourbillon bridge
  for (let arm = 0; arm < 3; arm++) {
    const aa = (arm * Math.PI * 2) / 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(aa) * tourbR * 0.88, Math.sin(aa) * tourbR * 0.88);
    ctx.strokeStyle = '#dce2ec';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  // Central ruby bearing
  ctx.beginPath();
  ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
  ctx.fillStyle = '#e03c5a';
  ctx.fill();
  ctx.restore();

  // Minute Track & Applied 18K Rose Gold Baton Indices
  for (let i = 0; i < 60; i++) {
    const a = (i * Math.PI * 2) / 60 - Math.PI / 2;
    const isHour = i % 5 === 0;
    const r0 = isHour ? R * 0.79 : R * 0.88;
    const r1 = R * 0.92;
    // Skip 6 o'clock index where tourbillon sits
    if (i === 30) continue;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
    ctx.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
    ctx.strokeStyle = isHour ? '#f2cf9e' : 'rgba(244, 239, 230, 0.32)';
    ctx.lineWidth = isHour ? 2.6 : 1;
    ctx.stroke();
  }

  // Power Reserve Sub-Dial at 10 o'clock (0 - 72h)
  const prX = cx - R * 0.42;
  const prY = cy - R * 0.18;
  const prR = R * 0.18;
  ctx.beginPath();
  ctx.arc(prX, prY, prR, Math.PI * 0.75, Math.PI * 2.25);
  ctx.strokeStyle = 'rgba(244, 239, 230, 0.25)';
  ctx.lineWidth = 2;
  ctx.stroke();

  const prFrac = Math.max(0, Math.min(1, state.powerHours / 72));
  ctx.beginPath();
  ctx.arc(prX, prY, prR, Math.PI * 0.75, Math.PI * (0.75 + prFrac * 1.5));
  ctx.strokeStyle = '#d9a76a';
  ctx.lineWidth = 2.6;
  ctx.stroke();

  const prAngle = Math.PI * (0.75 + prFrac * 1.5);
  ctx.beginPath();
  ctx.moveTo(prX, prY);
  ctx.lineTo(prX + Math.cos(prAngle) * (prR - 3), prY + Math.sin(prAngle) * (prR - 3));
  ctx.strokeStyle = '#f4efe6';
  ctx.lineWidth = 1.6;
  ctx.stroke();

  // Brand Signature at 12 o'clock
  ctx.fillStyle = '#f4efe6';
  ctx.font = `600 ${Math.round(R * 0.068)}px "Space Grotesk", sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('CHRONOS', cx, cy - R * 0.48);
  ctx.fillStyle = '#d9a76a';
  ctx.font = `500 ${Math.round(R * 0.04)}px "JetBrains Mono", monospace`;
  ctx.fillText('GENÈVE · CAL. 09', cx, cy - R * 0.39);

  // Real Local Time Hands + Mechanical Chronograph Sweep Hand
  const now = new Date();
  const sec = now.getSeconds() + now.getMilliseconds() / 1000;
  const min = now.getMinutes() + sec / 60;
  const hr = (now.getHours() % 12) + min / 60;

  ctx.save();
  ctx.translate(cx, cy);
  drawHand(ctx, (hr * Math.PI * 2) / 12, R * 0.52, R * 0.12, 7.5, '#f2cf9e');
  drawHand(ctx, (min * Math.PI * 2) / 60, R * 0.76, R * 0.14, 5.2, '#f4efe6');

  // Chronograph blued-steel sweep hand
  const chronoAngle = ((state.chronoSec % 60) * Math.PI * 2) / 60;
  drawHand(ctx, chronoAngle, R * 0.86, R * 0.22, 2.2, '#5a9bff');

  // Center Gold Pinion Cap
  ctx.beginPath();
  ctx.arc(0, 0, 7, 0, Math.PI * 2);
  ctx.fillStyle = '#d9a76a';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, 0, 2.8, 0, Math.PI * 2);
  ctx.fillStyle = '#0a0c10';
  ctx.fill();
  ctx.restore();

  ctx.restore();
}

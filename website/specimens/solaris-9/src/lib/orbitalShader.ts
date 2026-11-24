// Custom Raw WebGL2 GLSL High-Detail Atmospheric Planetary Raymarcher & 3D Orbital Ring
const VERTEX_SHADER = `#version 300 es
in vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 outColor;

uniform vec2 u_res;
uniform float u_time;
uniform float u_yaw;
uniform float u_pitch;
uniform float u_inclination;
uniform float u_trueAnomaly;
uniform float u_orbitScale;
uniform vec3 u_atmoColor;
uniform vec3 u_accentColor;

float hash(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
        mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
    mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
        mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
    f.z
  );
}

// 7-octave crisp terrain FBM
float fbmTerrain(vec3 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 7; i++) {
    v += a * noise(p);
    p = p * 2.12 + vec3(11.3, 7.1, 4.9);
    a *= 0.49;
  }
  return v;
}

// Ridged multifractal for sharp mountain ranges & cloud filaments
float fbmRidged(vec3 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 6; i++) {
    float n = 1.0 - abs(noise(p) * 2.0 - 1.0);
    v += a * n * n;
    p = p * 2.18 + vec3(5.7, 13.4, 8.2);
    a *= 0.48;
  }
  return v;
}

mat2 rot(float a) {
  float c = cos(a), s = sin(a);
  return mat2(c, -s, s, c);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / min(u_res.x, u_res.y);

  vec3 ro = vec3(0.0, 0.0, 3.65);
  vec3 rd = normalize(vec3(uv, -1.75));

  // Camera orbit rotation
  ro.yz *= rot(u_pitch);
  rd.yz *= rot(u_pitch);
  ro.xz *= rot(u_yaw);
  rd.xz *= rot(u_yaw);

  // Clean deep space + crisp pinpoint starfield
  vec3 col = vec3(0.010, 0.015, 0.026);
  vec2 starUv = vec2(atan(rd.x, rd.z) * 1.5915, asin(clamp(rd.y, -1.0, 1.0)) * 1.5915) * 48.0;
  vec2 sCell = floor(starUv);
  vec2 sFrac = fract(starUv) - 0.5;
  float sSeed = hash(vec3(sCell, 1.7));
  if (sSeed > 0.962) {
    vec2 sOff = vec2(hash(vec3(sCell, 3.1)) - 0.5, hash(vec3(sCell, 5.9)) - 0.5) * 0.68;
    float d = length(sFrac - sOff);
    float pinpoint = exp(-d * d * 240.0);
    float twinkle = 0.78 + 0.22 * sin(u_time * 2.0 + sSeed * 80.0);
    col += mix(vec3(0.76, 0.88, 1.0), vec3(1.0, 0.92, 0.80), fract(sSeed * 37.0)) * pinpoint * twinkle * 0.9;
  }

  // Sun angled so ~68% of Earth is crisply illuminated, ~32% shows night city lights
  vec3 sunDir = normalize(vec3(0.68, 0.30, 0.67));

  // Ray-sphere intersection for Earth (radius = 1.0)
  float b = dot(ro, rd);
  float c = dot(ro, ro) - 1.0;
  float h = b * b - c;

  // Crisp outer Rayleigh atmosphere halo (radius = 1.14)
  float ca = dot(ro, ro) - 1.14 * 1.14;
  float ha = b * b - ca;
  if (ha > 0.0) {
    float tA = max(0.0, -b - sqrt(ha));
    float tB = -b + sqrt(ha);
    float distClosest = length(ro + rd * clamp(-b, tA, tB));
    float rim = exp(-max(0.0, distClosest - 0.992) * 15.0);
    float sunAlign = smoothstep(-0.35, 0.85, dot(normalize(ro + rd * max(0.0, -b)), sunDir));
    col += u_atmoColor * rim * (0.18 + 0.82 * sunAlign) * 0.82;
  }

  float tPlanet = 1e9;
  if (h > 0.0) {
    tPlanet = -b - sqrt(h);
    if (tPlanet > 0.0) {
      vec3 pos = ro + rd * tPlanet;
      vec3 n = normalize(pos);

      // Axial spin
      vec3 pRot = pos;
      pRot.xz *= rot(u_time * 0.038);

      // High-frequency crisp continental & mountain elevation
      float macro = fbmTerrain(pRot * 2.35);
      float ridge = fbmRidged(pRot * 6.5);
      float elev = macro * 0.78 + ridge * 0.22;

      // Sharp coastline transition (eliminates blurry landmass edges)
      float isLand = smoothstep(0.515, 0.528, elev);
      float shallowSea = smoothstep(0.475, 0.518, elev) * (1.0 - isLand);

      // Deep realistic ocean + turquoise continental shelf
      vec3 deepOcean = vec3(0.022, 0.075, 0.175);
      vec3 shelfOcean = vec3(0.045, 0.21, 0.34);
      vec3 oceanCol = mix(deepOcean, shelfOcean, shallowSea);

      // Rich realistic land biomes (forest -> arid highlands -> alpine peaks)
      float lat = abs(pRot.y);
      vec3 forest = vec3(0.09, 0.23, 0.14);
      vec3 desert = vec3(0.54, 0.45, 0.31);
      vec3 mountain = vec3(0.36, 0.34, 0.31);
      vec3 snow = vec3(0.90, 0.93, 0.97);

      float aridMask = smoothstep(0.15, 0.48, lat) * smoothstep(0.54, 0.68, macro);
      vec3 landCol = mix(forest, desert, aridMask * 0.72);
      landCol = mix(landCol, mountain, smoothstep(0.62, 0.76, elev));
      landCol = mix(landCol, snow, smoothstep(0.75, 0.86, elev));

      float polarIce = smoothstep(0.80, 0.90, lat + (macro - 0.5) * 0.12);
      vec3 surface = mix(oceanCol, landCol, isLand);
      surface = mix(surface, snow, polarIce);

      // Subtle finite-difference bump shading on land for crisp mountain relief
      float eps = 0.008;
      float ex = fbmTerrain((pRot + vec3(eps, 0.0, 0.0)) * 2.35) - macro;
      float ey = fbmTerrain((pRot + vec3(0.0, eps, 0.0)) * 2.35) - macro;
      vec3 nBumped = normalize(n + vec3(ex, ey, 0.0) * isLand * 1.45);

      float ndl = dot(nBumped, sunDir);
      float diffuse = smoothstep(-0.08, 0.18, ndl) * max(ndl, 0.0);

      // Sharp ocean specular glint
      vec3 halfVec = normalize(sunDir - rd);
      float spec = pow(max(dot(n, halfVec), 0.0), 72.0) * (1.0 - isLand) * (1.0 - polarIce) * smoothstep(0.0, 0.25, ndl);

      // Crisp swirling cloud filaments (warped domain)
      vec3 warp = vec3(
        noise(pRot * 3.2 + vec3(0.0, u_time * 0.015, 0.0)),
        noise(pRot * 3.2 + vec3(4.1, 0.0, -u_time * 0.012)),
        0.0
      );
      float cloudField = fbmTerrain(pRot * 4.4 + warp * 0.65 + vec3(u_time * 0.02, 0.0, 0.0));
      float cloudMask = smoothstep(0.56, 0.72, cloudField);

      vec3 lit = surface * (0.032 + 1.05 * diffuse);
      // Crisp white sunlit clouds with subtle shadow depth
      lit = mix(lit, vec3(0.95, 0.97, 1.0) * (0.04 + 0.98 * max(dot(n, sunDir), 0.0)), cloudMask * 0.72);
      lit += vec3(1.0, 0.93, 0.82) * spec * 0.58;

      // Crisp night-side coastal city lights (clean golden pinpoints)
      float cityDetail = smoothstep(0.69, 0.78, fbmRidged(pRot * 20.0));
      float nightMask = smoothstep(0.02, -0.18, dot(n, sunDir)) * isLand * (1.0 - polarIce) * (1.0 - cloudMask * 0.75);
      lit += vec3(1.0, 0.80, 0.44) * cityDetail * nightMask * 0.95;

      // Clean blue-white Fresnel Rayleigh atmospheric limb (zero muddy brown stripe)
      float fresnel = pow(1.0 - max(dot(n, -rd), 0.0), 3.8);
      lit += u_atmoColor * fresnel * (0.16 + 0.95 * smoothstep(-0.1, 0.5, dot(n, sunDir)));

      col = lit;
    }
  }

  // Crisp 3D Inclined Orbital Trajectory Ring (renders both front & unobstructed back arc)
  float inc = radians(u_inclination);
  vec3 planeN = normalize(vec3(0.0, cos(inc), sin(inc)));
  float denom = dot(rd, planeN);
  if (abs(denom) > 0.0005) {
    float tRing = -dot(ro, planeN) / denom;
    if (tRing > 0.0 && (tPlanet > 1e8 || tRing < tPlanet)) {
      vec3 hit = ro + rd * tRing;
      float r = length(hit);
      float ringRadius = u_orbitScale;
      float ringLine = exp(-abs(r - ringRadius) * 210.0);

      vec3 uAxis = vec3(1.0, 0.0, 0.0);
      vec3 vAxis = normalize(cross(planeN, uAxis));
      float angleHit = atan(dot(hit, vAxis), dot(hit, uAxis));
      float angleDiff = mod(u_trueAnomaly - angleHit + 6.2831853, 6.2831853);
      float trail = 0.28 + 0.72 * exp(-angleDiff * 1.15);

      col += u_accentColor * ringLine * trail * 0.92;

      // Sharp glowing spacecraft beacon
      vec3 satPos = (cos(u_trueAnomaly) * uAxis + sin(u_trueAnomaly) * vAxis) * ringRadius;
      float dSat = length(hit - satPos);
      float core = exp(-dSat * 75.0);
      float halo = exp(-dSat * 16.0) * 0.45;
      col += mix(u_accentColor, vec3(1.0, 0.99, 0.95), 0.78) * (core * 1.6 + halo);
    }
  }

  // Clean ACES-like filmic curve for crisp contrast
  col = (col * (2.51 * col + 0.03)) / (col * (2.43 * col + 0.59) + 0.14);
  col = pow(clamp(col, 0.0, 1.0), vec3(0.96));

  outColor = vec4(col, 1.0);
}
`;

export interface ShaderState {
  yaw: number;
  pitch: number;
  inclination: number;
  trueAnomaly: number;
  orbitScale: number;
  atmoColor: [number, number, number];
  accentColor: [number, number, number];
}

export function mountOrbitalRenderer(canvas: HTMLCanvasElement, getState: () => ShaderState) {
  const gl = canvas.getContext('webgl2', { antialias: true, powerPreference: 'high-performance' });
  if (!gl) return () => {};

  const compile = (type: number, src: string) => {
    const sh = gl.createShader(type)!;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(sh));
    }
    return sh;
  };

  const prog = gl.createProgram()!;
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERTEX_SHADER));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(prog, 'u_res');
  const uTime = gl.getUniformLocation(prog, 'u_time');
  const uYaw = gl.getUniformLocation(prog, 'u_yaw');
  const uPitch = gl.getUniformLocation(prog, 'u_pitch');
  const uInc = gl.getUniformLocation(prog, 'u_inclination');
  const uAnom = gl.getUniformLocation(prog, 'u_trueAnomaly');
  const uScale = gl.getUniformLocation(prog, 'u_orbitScale');
  const uAtmo = gl.getUniformLocation(prog, 'u_atmoColor');
  const uAccent = gl.getUniformLocation(prog, 'u_accentColor');

  let raf = 0;
  const start = performance.now();

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.floor(canvas.clientWidth * dpr);
    const h = Math.floor(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  };

  const render = (now: number) => {
    resize();
    const st = getState();
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, (now - start) * 0.001);
    gl.uniform1f(uYaw, st.yaw);
    gl.uniform1f(uPitch, st.pitch);
    gl.uniform1f(uInc, st.inclination);
    gl.uniform1f(uAnom, st.trueAnomaly);
    gl.uniform1f(uScale, st.orbitScale);
    gl.uniform3fv(uAtmo, st.atmoColor);
    gl.uniform3fv(uAccent, st.accentColor);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    raf = requestAnimationFrame(render);
  };

  raf = requestAnimationFrame(render);
  return () => cancelAnimationFrame(raf);
}

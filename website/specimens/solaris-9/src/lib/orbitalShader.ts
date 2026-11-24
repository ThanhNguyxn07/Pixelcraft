// Custom Raw WebGL2 GLSL Atmospheric Planetary Raymarcher & Orbital Ring Renderer
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

float fbm(vec3 p) {
  float v = 0.0;
  float a = 0.52;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.04 + vec3(13.1, 7.7, 5.3);
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

  // Camera framed so the entire planet + inclined orbital ring sit cleanly inside viewport
  vec3 ro = vec3(0.0, 0.0, 3.62);
  vec3 rd = normalize(vec3(uv, -1.72));

  // Rotate world by user drag yaw/pitch
  ro.yz *= rot(u_pitch);
  rd.yz *= rot(u_pitch);
  ro.xz *= rot(u_yaw);
  rd.xz *= rot(u_yaw);

  // Deep space background with pinpoint circular stars (zero square artifacts)
  vec3 col = vec3(0.012, 0.018, 0.032);
  vec2 starUv = vec2(atan(rd.x, rd.z) * 1.5915, asin(clamp(rd.y, -1.0, 1.0)) * 1.5915) * 42.0;
  vec2 sCell = floor(starUv);
  vec2 sFrac = fract(starUv) - 0.5;
  float sSeed = hash(vec3(sCell, 1.7));
  if (sSeed > 0.965) {
    vec2 sOff = vec2(hash(vec3(sCell, 3.1)) - 0.5, hash(vec3(sCell, 5.9)) - 0.5) * 0.65;
    float d = length(sFrac - sOff);
    float pinpoint = exp(-d * d * 180.0);
    float twinkle = 0.72 + 0.28 * sin(u_time * 2.2 + sSeed * 80.0);
    col += mix(vec3(0.75, 0.87, 1.0), vec3(1.0, 0.91, 0.78), fract(sSeed * 37.0)) * pinpoint * twinkle * 0.95;
  }

  // Sun direction
  vec3 sunDir = normalize(vec3(0.78, 0.34, 0.52));

  // Ray-sphere intersection for planet (radius 1.0)
  float b = dot(ro, rd);
  float c = dot(ro, ro) - 1.0;
  float h = b * b - c;

  // Atmospheric outer halo (radius 1.18)
  float ca = dot(ro, ro) - 1.18 * 1.18;
  float ha = b * b - ca;
  if (ha > 0.0) {
    float tA = max(0.0, -b - sqrt(ha));
    float tB = -b + sqrt(ha);
    float distClosest = length(ro + rd * clamp(-b, tA, tB));
    float rim = exp(-max(0.0, distClosest - 0.985) * 9.5);
    float sunAlign = clamp(dot(normalize(ro + rd * max(0.0, -b)), sunDir) * 0.65 + 0.45, 0.0, 1.0);
    col += u_atmoColor * rim * sunAlign * 0.72;
  }

  float tPlanet = 1e9;
  if (h > 0.0) {
    tPlanet = -b - sqrt(h);
    if (tPlanet > 0.0) {
      vec3 pos = ro + rd * tPlanet;
      vec3 n = normalize(pos);

      // Slow planetary axial rotation
      vec3 pRot = pos;
      pRot.xz *= rot(u_time * 0.045);

      float continents = fbm(pRot * 2.65);
      float detail = fbm(pRot * 7.2);
      float clouds = fbm(pRot * 3.8 + vec3(u_time * 0.025, 0.0, -u_time * 0.015));

      float isLand = smoothstep(0.505, 0.545, continents);
      vec3 oceanCol = mix(vec3(0.025, 0.085, 0.19), vec3(0.05, 0.17, 0.31), detail);
      vec3 landCol = mix(vec3(0.11, 0.21, 0.16), vec3(0.45, 0.39, 0.29), smoothstep(0.54, 0.74, continents));
      vec3 polar = vec3(0.84, 0.89, 0.94);
      float iceMask = smoothstep(0.78, 0.93, abs(pRot.y) + (detail - 0.5) * 0.16);

      vec3 surface = mix(oceanCol, landCol, isLand);
      surface = mix(surface, polar, iceMask);

      float ndl = dot(n, sunDir);
      float day = smoothstep(-0.14, 0.22, ndl);
      float twilight = exp(-pow((ndl + 0.03) * 7.5, 2.0));

      // Specular glint on ocean
      vec3 halfVec = normalize(sunDir - rd);
      float spec = pow(max(dot(n, halfVec), 0.0), 48.0) * (1.0 - isLand) * (1.0 - iceMask) * day;

      // Cloud layer
      float cloudMask = smoothstep(0.55, 0.78, clouds);
      vec3 litSurface = surface * (0.045 + 0.955 * max(ndl, 0.0));
      litSurface += vec3(0.95, 0.97, 1.0) * cloudMask * (0.08 + 0.92 * max(ndl, 0.0)) * 0.68;
      litSurface += vec3(1.0, 0.88, 0.72) * spec * 0.55;

      // Subtle golden terminator scattering
      litSurface += vec3(0.98, 0.56, 0.24) * twilight * 0.12;

      // Crisp night-side city lights on land
      float cityNoise = smoothstep(0.67, 0.78, fbm(pRot * 19.0));
      float nightMask = smoothstep(0.05, -0.24, ndl) * isLand * (1.0 - iceMask) * (1.0 - cloudMask * 0.65);
      litSurface += vec3(1.0, 0.78, 0.42) * cityNoise * nightMask * 0.92;

      // Fresnel Rayleigh rim
      float fresnel = pow(1.0 - max(dot(n, -rd), 0.0), 3.2);
      litSurface += u_atmoColor * fresnel * (0.35 + 1.05 * day);

      col = litSurface;
    }
  }

  // 3D Inclined Orbital Ring + Live Go-WASM Spacecraft Beacon
  float inc = radians(u_inclination);
  vec3 planeN = normalize(vec3(0.0, cos(inc), sin(inc)));
  float denom = dot(rd, planeN);
  if (abs(denom) > 0.0005) {
    float tRing = -dot(ro, planeN) / denom;
    if (tRing > 0.0 && tRing < tPlanet) {
      vec3 hit = ro + rd * tRing;
      float r = length(hit);
      float ringRadius = u_orbitScale;
      float ringLine = exp(-abs(r - ringRadius) * 145.0);
      col += u_accentColor * ringLine * 0.78;

      // Spacecraft position along orbital plane from Go WASM true anomaly
      vec3 uAxis = vec3(1.0, 0.0, 0.0);
      vec3 vAxis = normalize(cross(planeN, uAxis));
      vec3 satPos = (cos(u_trueAnomaly) * uAxis + sin(u_trueAnomaly) * vAxis) * ringRadius;
      float dSat = length(hit - satPos);
      float beacon = exp(-dSat * 42.0) + exp(-dSat * 11.0) * 0.45;
      col += mix(u_accentColor, vec3(1.0, 0.98, 0.92), 0.65) * beacon * 1.4;
    }
  }

  // Filmic tone-mapping & subtle vignette
  col = col / (col + vec3(0.85));
  col = pow(col, vec3(0.95));
  float vig = 1.0 - dot(uv * 0.42, uv * 0.42);
  col *= clamp(vig, 0.55, 1.0);

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

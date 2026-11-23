'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

// Procedural optical chromatic-ribbon & subtle pixel-lattice field anchored to Pixelcraft's cyan + amber palette
const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = rot * p * 2.02;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    vec2 aspect = vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);
    vec2 p = (uv - 0.5) * aspect;
    vec2 m = (uMouse - 0.5) * aspect;

    float t = uTime * 0.22;

    // Gentle optical distortion field driven by fbm + cursor proximity
    float dist = length(p - m * 0.65);
    float pull = exp(-dist * 2.4) * 0.28;

    vec2 q = vec2(
      fbm(p * 1.65 + vec2(t, -t * 0.6)),
      fbm(p * 1.65 + vec2(-t * 0.7, t * 0.9) + 3.1)
    );
    float f = fbm(p * 1.9 + q * 1.45 - vec2(pull, -pull * 0.6));

    // Architectural obsidian base
    vec3 obsidian = vec3(0.018, 0.020, 0.028);
    vec3 deepCyan = vec3(0.04, 0.36, 0.48);
    vec3 brightCyan = vec3(0.13, 0.83, 0.93);
    vec3 warmAmber = vec3(0.98, 0.55, 0.22);

    // Optical light ribbons
    float ribbon1 = smoothstep(0.42, 0.78, f);
    float ribbon2 = smoothstep(0.56, 0.88, fbm(p * 2.4 - q * 1.2 + t * 0.35));
    float focusGlow = exp(-length(p - vec2(0.28, 0.08) - m * 0.25) * 1.75);

    vec3 col = obsidian;
    col = mix(col, deepCyan, ribbon1 * 0.52);
    col += brightCyan * pow(ribbon1, 2.4) * (0.34 + focusGlow * 0.42);
    col += warmAmber * pow(ribbon2, 2.8) * (0.28 + pull * 0.55);

    // Subtle crisp pixel-matrix interference grid
    vec2 gridCell = fract(gl_FragCoord.xy / 18.0);
    float dotMask = smoothstep(0.14, 0.05, length(gridCell - 0.5));
    col += vec3(0.16, 0.85, 0.95) * dotMask * (0.045 + ribbon1 * 0.06);

    // Edge vignette to keep monumental typography razor-sharp
    float vig = smoothstep(1.35, 0.28, length(p));
    col *= mix(0.45, 1.0, vig);

    // Fine film grain
    float grain = (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) * 0.022;
    col += grain;

    gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
  }
`;

export function ShaderStage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: false,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      uTime: { value: 1.4 },
      uResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
      uMouse: { value: new THREE.Vector2(0.62, 0.45) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
      depthWrite: false,
      depthTest: false,
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    const targetMouse = { x: 0.62, y: 0.45 };
    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      targetMouse.x = (e.clientX - rect.left) / rect.width;
      targetMouse.y = 1.0 - (e.clientY - rect.top) / rect.height;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const onResize = () => {
      if (!container) return;
      const w = Math.max(1, container.clientWidth);
      const h = Math.max(1, container.clientHeight);
      renderer.setSize(w, h);
      uniforms.uResolution.value.set(w, h);
      if (reducedMotion) renderer.render(scene, camera);
    };
    window.addEventListener('resize', onResize, { passive: true });

    let inView = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry?.isIntersecting ?? true;
      },
      { threshold: 0.02 }
    );
    observer.observe(container);

    let rafId = 0;
    const start = performance.now();

    const tick = (now: number) => {
      rafId = requestAnimationFrame(tick);
      if (!inView || document.hidden) return;
      uniforms.uTime.value = 1.4 + (now - start) * 0.001;
      uniforms.uMouse.value.x += (targetMouse.x - uniforms.uMouse.value.x) * 0.06;
      uniforms.uMouse.value.y += (targetMouse.y - uniforms.uMouse.value.y) * 0.06;
      renderer.render(scene, camera);
    };

    if (reducedMotion) {
      renderer.render(scene, camera);
    } else {
      rafId = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      mesh.geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="shader-fallback pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
}

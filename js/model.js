// Renders and animates the 3D subduction model, driven by a 24 s timeline.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { buildModel, slabPoint, D, VOLCANO_X } from './model-build.js';
import { PHASES } from './data.js';

const T_END = 24;
const QUAKE_T = 11;
const TSUNAMI_T = 11.2;
const MAGMA_T = 17.5;
const ERUPT_T = 20.5;

const box = document.getElementById('model-canvas');
const playBtn = document.getElementById('model-play');
const scrub = document.getElementById('model-scrub');
const caption = document.getElementById('model-caption');
const chips = document.getElementById('model-phases');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
box.appendChild(renderer.domElement);
const labels = new CSS2DRenderer();
labels.domElement.className = 'labels';
box.appendChild(labels.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color('#0b1020');
scene.add(new THREE.HemisphereLight('#cfe3ff', '#402010', 1.4));
const sun = new THREE.DirectionalLight('#ffffff', 2.2);
sun.position.set(6, 12, 10);
scene.add(sun);

const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200);
const controls = new OrbitControls(camera, labels.domElement);
controls.enableDamping = true;
controls.enableZoom = false; // keep mouse wheel for page scrolling
controls.enablePan = false;
controls.maxPolarAngle = Math.PI * 0.62;
controls.target.set(0, -3, 0);

const m = buildModel(scene);

// ---- timeline pieces -------------------------------------------------------

/** How far the upper plate's edge is bent down (1 = fully loaded, <0 = rebound overshoot). */
function strain(t) {
  if (t < 5) return 0;
  if (t < QUAKE_T) return (t - 5) / (QUAKE_T - 5);
  if (t < QUAKE_T + 0.25) return 1 - 1.35 * ((t - QUAKE_T) / 0.25);
  if (t < 14) {
    const k = (t - QUAKE_T - 0.25) / 2.75;
    return -0.35 * (1 - k) * Math.cos(k * Math.PI * 3);
  }
  return 0;
}

const smooth = (a, b, x) => {
  const k = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return k * k * (3 - 2 * k);
};

function bendPlate(s) {
  const pos = m.upper.geometry.attributes.position;
  const base = m.basePos;
  for (let i = 0; i < pos.count; i++) {
    const x = base[i * 3];
    const dy = -0.45 * s * smooth(-3, 1.4, x) + 0.15 * s * Math.exp(-((x + 2.4) ** 2) / 0.8);
    pos.array[i * 3 + 1] = base[i * 3 + 1] + dy;
  }
  pos.needsUpdate = true;
}

const green = new THREE.Color('#3ddc84');
const red = new THREE.Color('#ff3b30');
function colorLock(s) {
  const k = Math.max(0, s);
  m.lockedMat.color.copy(green).lerp(red, k);
  m.lockedMat.emissive.copy(m.lockedMat.color);
  m.lockedMat.emissiveIntensity = 0.3 + k * 1.2;
}

function moveStripes(t) {
  const n = m.stripes.length;
  m.stripes.forEach((s, i) => {
    const u = ((i / n) + t * 0.012) % 1;
    const p = slabPoint(u, -0.03);
    const tan = slabPoint(Math.min(u + 0.01, 1)).sub(slabPoint(u));
    s.position.set(p.x, p.y, 0);
    s.rotation.z = Math.atan2(tan.y, tan.x);
  });
}

function quakeFx(t) {
  const q = t - QUAKE_T;
  m.rings.forEach((r, i) => {
    const k = q - i * 0.35;
    r.visible = k > 0 && k < 2.5;
    if (r.visible) {
      r.scale.setScalar(0.3 + k * 4);
      r.material.opacity = 1 - k / 2.5;
    }
  });
  const f = q > 0 ? Math.max(0, 1 - q / 0.8) : 0;
  m.flash.intensity = f * 80;
  m.star.visible = f > 0;
  m.star.material.opacity = f;
  const amp = q > 0 && q < 2.5 ? 0.22 * (1 - q / 2.5) : 0;
  m.world.position.set((Math.random() - 0.5) * amp, (Math.random() - 0.5) * amp, 0);
}

function tsunami(t) {
  const pos = m.surface.geometry.attributes.position;
  const tt = t - TSUNAMI_T;
  const on = tt > 0 && t < MAGMA_T;
  const rise = Math.min(1, tt / 0.4) * (1 - smooth(15.5, MAGMA_T, t));
  for (let i = 0; i < pos.count; i++) {
    const x = pos.array[i * 3];
    let y = 0;
    if (on) {
      const west = 0.8 - 0.9 * tt;
      const east = 0.8 + 0.9 * tt;
      const shoal = 1 + Math.max(0, 0.5 - x) * 0.9; // waves grow in shallow water
      y = 0.32 * rise * (Math.exp(-((x - west) ** 2) / 0.5) * shoal
        + 0.8 * Math.exp(-((x - east) ** 2) / 0.5));
    }
    pos.array[i * 3 + 1] = y;
  }
  pos.needsUpdate = true;
}

// Slab top point directly below the volcanoes: where the magma starts.
let magmaU = 0;
while (slabPoint(magmaU).x > VOLCANO_X) magmaU += 0.002;
const magmaStart = slabPoint(magmaU);

function magma(t) {
  const k0 = t - MAGMA_T;
  const start = magmaStart;
  m.magma.forEach((b, i) => {
    b.visible = k0 > 0;
    if (!b.visible) return;
    const k = (k0 * 0.28 + i / m.magma.length) % 1;
    const y = start.y + 0.3 + k * (0.5 - start.y);
    b.position.set(VOLCANO_X + Math.sin(k * 9 + i) * 0.18, y, D / 2 + 0.06);
  });
  m.craters.forEach((c) => { c.visible = t > ERUPT_T - 1; });
}

const ashVel = [];
const ashAge = [];
function resetAsh(i) {
  const src = m.craters[i % 2].position;
  ashAge[i] = -Math.random() * 2;
  ashVel[i] = [
    0.2 + Math.random() * 0.6, 1 + Math.random() * 0.9, (Math.random() - 0.5) * 0.8, src,
  ];
}
function eruption(t, dt) {
  const on = t > ERUPT_T;
  m.ash.visible = on;
  if (!on) {
    ashAge.length = 0;
    return;
  }
  const arr = m.ash.geometry.attributes.position.array;
  const n = arr.length / 3;
  for (let i = 0; i < n; i++) {
    if (ashAge[i] === undefined || ashAge[i] > 2.4) resetAsh(i);
    ashAge[i] += dt;
    const a = Math.max(0, ashAge[i]);
    const [vx, vy, vz, src] = ashVel[i];
    arr[i * 3] = src.x + vx * a;
    arr[i * 3 + 1] = src.y + vy * a - 0.12 * a * a;
    arr[i * 3 + 2] = src.z + vz * a;
  }
  m.ash.geometry.attributes.position.needsUpdate = true;
}

// ---- UI + loop -------------------------------------------------------------

PHASES.forEach((p, i) => {
  const b = document.createElement('button');
  b.textContent = `${i + 1}. ${p.title}`;
  b.addEventListener('click', () => { time = p.t + 0.01; setPlaying(true); });
  chips.appendChild(b);
});

let time = 0;
let playing = false;
let visible = false;
let started = false;
let shownPhase = -1;

function setPlaying(on) {
  playing = on;
  playBtn.textContent = on ? '❚❚ Pause' : '▶ Play';
  playBtn.setAttribute('aria-pressed', String(on));
}
playBtn.addEventListener('click', () => setPlaying(!playing));
scrub.max = String(T_END);
scrub.addEventListener('input', () => { time = Number(scrub.value); setPlaying(false); });

function showPhase(t) {
  const idx = PHASES.findLastIndex((p) => t >= p.t);
  if (idx === shownPhase) return;
  shownPhase = idx;
  caption.querySelector('h3').textContent = `${idx + 1}. ${PHASES[idx].title}`;
  caption.querySelector('p').textContent = PHASES[idx].text;
  [...chips.children].forEach((c, i) => c.classList.toggle('active', i === idx));
}

function update(t, dt) {
  const s = strain(t);
  bendPlate(s);
  colorLock(s);
  moveStripes(t);
  quakeFx(t);
  tsunami(t);
  magma(t);
  eruption(t, dt);
  showPhase(t);
  scrub.value = String(t);
}

function resize() {
  const w = box.clientWidth;
  const h = box.clientHeight;
  renderer.setSize(w, h);
  labels.setSize(w, h);
  camera.aspect = w / h;
  // Back the camera off until the ~25-unit-wide block fits the canvas width.
  const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);
  const dist = Math.max(24, 12.5 / (Math.tan(halfFov) * camera.aspect));
  camera.position.set(5, 5, dist);
  camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(box);

new IntersectionObserver(([e]) => {
  visible = e.isIntersecting;
  if (visible && !started) {
    started = true;
    setPlaying(!reduceMotion);
  }
}, { threshold: 0.35 }).observe(box);

const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  const dt = Math.min(clock.getDelta(), 0.1);
  if (!visible) return;
  if (playing) {
    time += dt;
    if (time > T_END) time = 0;
  }
  update(time, playing ? dt : 0);
  controls.update();
  renderer.render(scene, camera);
  labels.render(scene, camera);
});

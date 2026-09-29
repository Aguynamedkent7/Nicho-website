// Page-level behavior: presentation keys, section dots, reveal-on-scroll, counters,
// and the hero seismograph.
const sections = [...document.querySelectorAll('main > section')];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---- presentation mode: arrow keys / PageUp / PageDown jump between sections ----------
function currentIndex() {
  const mid = window.innerHeight / 3;
  const idx = sections.findLastIndex((s) => s.getBoundingClientRect().top <= mid);
  return Math.max(0, idx);
}
const go = (i) => sections[Math.min(sections.length - 1, Math.max(0, i))]
  .scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });

document.addEventListener('keydown', (e) => {
  if (e.target.closest('input, textarea, select, #map')) return;
  if (['ArrowDown', 'ArrowRight', 'PageDown'].includes(e.key)) go(currentIndex() + 1);
  else if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) go(currentIndex() - 1);
  else if (e.key === 'f' || e.key === 'F') {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen();
  } else return;
  e.preventDefault();
});

// ---- side dots ---------------------------------------------------------------------
const dots = document.getElementById('dots');
sections.forEach((s, i) => {
  const b = document.createElement('button');
  b.setAttribute('aria-label', s.dataset.title);
  b.title = s.dataset.title;
  b.addEventListener('click', () => go(i));
  dots.appendChild(b);
});
const dotObserver = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    const i = sections.indexOf(e.target);
    [...dots.children].forEach((d, di) => d.classList.toggle('active', di === i));
  }
}, { rootMargin: '-45% 0px -45% 0px' });
sections.forEach((s) => dotObserver.observe(s));

// ---- reveal on scroll + number counters ------------------------------------------------
function countUp(el) {
  const end = Number(el.dataset.count);
  const t0 = performance.now();
  const step = (now) => {
    const k = Math.min(1, (now - t0) / 1400);
    el.textContent = Math.round(end * (1 - (1 - k) ** 3)).toLocaleString();
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const revealer = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    e.target.classList.add('in');
    e.target.querySelectorAll('[data-count]').forEach(countUp);
    revealer.unobserve(e.target);
  }
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach((el) => revealer.observe(el));

// ---- hero seismograph -------------------------------------------------------------------
const canvas = document.getElementById('seismo');
const ctx = canvas.getContext('2d');
const trace = [];
let tick = 0;
function drawSeismo() {
  const w = (canvas.width = canvas.clientWidth * devicePixelRatio);
  const h = (canvas.height = canvas.clientHeight * devicePixelRatio);
  tick += 1;
  const burst = tick % 420;
  const amp = burst < 90 ? (1 - burst / 90) * 0.42 : 0.03; // a "quake" every ~7 s
  trace.push((Math.random() - 0.5) * 2 * amp + Math.sin(tick / 3) * amp * 0.5);
  if (trace.length > w / (2 * devicePixelRatio)) trace.shift();
  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = getComputedStyle(canvas).color;
  ctx.lineWidth = 2 * devicePixelRatio;
  ctx.beginPath();
  trace.forEach((v, i) => ctx.lineTo(i * 2 * devicePixelRatio, h / 2 + v * h));
  ctx.stroke();
  if (!reduceMotion) requestAnimationFrame(drawSeismo);
}
drawSeismo();

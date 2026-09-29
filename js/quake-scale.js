// "How much stronger is a bigger quake?": a house scene that gets more damaged and shakes
// harder at each magnitude, plus a clickable ladder of magnitude levels M4–M9.
import { MAG_LEVELS } from './data.js';

const magIn = document.getElementById('mag');
const frame = document.getElementById('scene');
const ladder = document.getElementById('mag-ladder');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const vsM4 = (m) => 10 ** (1.5 * (m - 4));
const fmt = (n) => (n >= 1e6 ? `${(n / 1e6).toFixed(n >= 1e7 ? 0 : 1)} million`
  : n >= 10 ? Math.round(n).toLocaleString() : n.toFixed(1));

const ink = 'fill="none" stroke-linecap="round" stroke-linejoin="round"';

/** Wavy seismic lines under the ground: more and bigger as the level rises. */
function waves(lv) {
  let out = '';
  for (let i = 0; i < lv - 3; i++) {
    const y = 150 + i * 5;
    const a = 1 + (lv - 4) * 0.8;
    let d = `M-10 ${y} q 10 ${-a} 20 0`;
    for (let x = 0; x < 17; x++) d += ` t 20 0`;
    out += `<path d="${d}" stroke="#ff8a5c" stroke-width="1.4" opacity=".55" ${ink}/>`;
  }
  return out;
}

/** SVG markup of the scene at a whole-number magnitude level (4–9). */
export function sceneSVG(lv, thumb = false) {
  const when = (min, s) => (lv >= min ? s : '');
  const tilt = { 4: 0, 5: 0, 6: 0, 7: 1.5, 8: 4, 9: 8 }[lv];
  const tree = { 4: 0, 5: 0, 6: 3, 7: 10, 8: 25, 9: 72 }[lv];
  const crack = (d, w = 2.5) => `<path d="${d}" stroke="#4a3526" stroke-width="${w}" ${ink}/>`;
  return `<svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMax slice" ${thumb ? 'aria-hidden="true"'
    : `role="img" aria-label="A house and tree during a magnitude ${lv} earthquake"`}>
    <rect width="320" height="180" fill="#16213d"/>
    <circle cx="285" cy="58" r="12" fill="#f5e7b8"/>
    <rect x="-20" y="140" width="360" height="60" fill="#5b4330"/>
    ${thumb ? '' : waves(lv)}
    ${when(7, crack('M150 140 l10 12 -8 9 12 12 -6 7', lv >= 8 ? 7 : 4))}
    ${when(8, crack('M70 140 l-8 10 9 10 -7 20', 5))}
    <g transform="rotate(${tree} 56 140)">
      <rect x="52" y="100" width="8" height="40" fill="#6b4a2b"/>
      <circle cx="56" cy="92" r="22" fill="#3f7d3b"/>
    </g>
    <g transform="rotate(${tilt} 175 140)">
      <rect x="120" y="80" width="110" height="60" fill="#e9dcc4"/>
      <polygon points="110,82 175,40 240,82" fill="#b8482a"
        transform="${lv >= 9 ? 'translate(8 16) rotate(10 175 80)' : ''}"/>
      <rect x="164" y="104" width="22" height="36" fill="#6b4a2b"/>
      <rect x="132" y="96" width="22" height="18" fill="#9fd3ff"/>
      <rect x="196" y="96" width="22" height="18" fill="#9fd3ff"/>
      ${when(5, `<path d="M134 98 l8 7 4 -5 6 12" stroke="#fff" stroke-width="1.5" ${ink}/>`)}
      ${when(6, crack('M125 84 l6 12 -5 8 7 12 -3 8'))}
      ${when(7, crack('M226 100 l-7 9 5 7 -6 14') + crack('M190 82 l-3 10 4 6'))}
      ${when(8, crack('M160 82 l5 14 -6 10 4 12', 3.5))}
    </g>
    ${when(8, `<g fill="#b8482a"><rect x="238" y="132" width="10" height="6"
      transform="rotate(20 243 135)"/><rect x="252" y="134" width="8" height="5"/>
      <rect x="108" y="133" width="9" height="6" transform="rotate(-15 112 136)"/></g>`)}
    ${when(9, `<g fill="#a89c90" opacity=".55"><circle cx="130" cy="136" r="16"/>
      <circle cx="160" cy="130" r="20"/><circle cx="200" cy="134" r="18"/>
      <circle cx="235" cy="138" r="14"/></g>`)}
  </svg>`;
}

// ---- ladder -------------------------------------------------------------------------
for (const L of MAG_LEVELS) {
  const li = document.createElement('li');
  li.innerHTML = `<button type="button" data-m="${L.m}">
    <span class="thumb">${sceneSVG(L.m, true)}</span>
    <span class="rung"><b>M${L.m} · ${L.name}</b>
      <span class="lbar"><i style="width:${((L.m - 3) / 6) * 100}%"></i></span>
      <small>${L.m === 4 ? 'Baseline' : `≈ ${fmt(vsM4(L.m))}× the energy of M4`}
        · ${L.example}</small></span></button>`;
  li.querySelector('button').addEventListener('click', () => {
    magIn.value = String(L.m);
    update();
    shake();
  });
  ladder.appendChild(li);
}

// ---- slider + shaking -----------------------------------------------------------------
let shownLevel = 0;
let stopTimer = 0;

function shake() {
  if (reduceMotion) return;
  frame.classList.add('shaking');
  clearTimeout(stopTimer);
  stopTimer = setTimeout(() => frame.classList.remove('shaking'), 2200);
}

function update() {
  const m = Number(magIn.value);
  const lv = Math.min(9, Math.floor(m));
  const info = MAG_LEVELS.find((L) => L.m === lv);
  if (lv !== shownLevel) {
    frame.innerHTML = sceneSVG(lv);
    shownLevel = lv;
  }
  frame.style.setProperty('--amp', String(0.5 * 2 ** (m - 4)));
  document.getElementById('mag-out').textContent = m.toFixed(1);
  document.getElementById('mag-name').textContent = info.name;
  document.getElementById('mag-effect').textContent = info.effect;
  document.getElementById('mag-vs').textContent = fmt(vsM4(m));
  document.getElementById('mag-tnt').textContent = fmt(10 ** (1.5 * m + 4.8) / 4.184e9);
  ladder.querySelectorAll('button').forEach((b) => {
    b.classList.toggle('active', Number(b.dataset.m) === lv);
  });
}

magIn.addEventListener('input', () => {
  update();
  shake();
});
document.getElementById('scene-shake').addEventListener('click', shake);
update();

// Give it one shake the first time it scrolls into view.
new IntersectionObserver(([e], obs) => {
  if (!e.isIntersecting) return;
  shake();
  obs.disconnect();
}, { threshold: 0.6 }).observe(frame);

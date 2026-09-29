// Interactive tectonic map: plate boundaries, volcanoes, historic and live earthquakes.
// Leaflet is loaded as a global (L) from the CDN script tag in index.html.
import { TRENCHES, FAULTS, PLATES, QUAKES, VOLCANOES } from './data.js';

const USGS = 'https://earthquake.usgs.gov/fdsnws/event/1/query';
const BBOX = { minlatitude: 3, maxlatitude: 22, minlongitude: 115, maxlongitude: 130 };

const map = L.map('map', { scrollWheelZoom: false, zoomSnap: 0.5, keyboard: false })
  .setView([12, 123], window.innerWidth < 640 ? 5 : 5.5);
const esri = 'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean';
L.tileLayer(`${esri}/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}`, {
  maxZoom: 10,
  attribution: 'Tiles &copy; Esri &mdash; GEBCO, NOAA, National Geographic, and others',
}).addTo(map);
L.tileLayer(`${esri}/World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}`, { maxZoom: 10 }).addTo(map);

const card = (title, sub, body) => `<strong>${title}</strong><br><em>${sub}</em><p>${body}</p>`;
const icon = (html, cls) => L.divIcon({
  html: `<div class="${cls}">${html}</div>`, className: 'pin', iconSize: null,
});

// ---- tectonic features ------------------------------------------------------
const tectonics = L.layerGroup();
for (const t of TRENCHES) {
  L.polyline(t.line, { className: t.focus ? 'trench focus' : 'trench', weight: t.focus ? 5 : 3 })
    .bindPopup(card(t.name, t.type, t.info))
    .bindTooltip(t.name, { sticky: true })
    .addTo(tectonics);
}
for (const f of FAULTS) {
  L.polyline(f.line, { className: 'fault', weight: 3 })
    .bindPopup(card(f.name, f.type, f.info))
    .bindTooltip(f.name, { sticky: true })
    .addTo(tectonics);
}
for (const p of PLATES) {
  L.marker(p.at, {
    icon: icon(`<span class="arrow">${p.arrow}</span><b>${p.name}</b><small>${p.note}</small>`,
      'plate-lbl'),
    interactive: false,
  }).addTo(tectonics);
}

const volcanoes = L.layerGroup();
for (const v of VOLCANOES) {
  L.marker(v.at, { icon: icon('▲', 'volcano'), title: v.name })
    .bindPopup(card(v.name, 'Active volcano', v.note))
    .addTo(volcanoes);
}

// ---- historic quakes with a year slider -------------------------------------
const historic = L.layerGroup();
const yearIn = document.getElementById('year');
const yearOut = document.getElementById('year-out');
const radius = (mag) => 3 + (mag - 5.5) * 4.5;

function drawHistoric() {
  const y = Number(yearIn.value);
  yearOut.textContent = y;
  historic.clearLayers();
  for (const q of QUAKES.filter((e) => e.year <= y)) {
    L.circleMarker(q.at, { radius: radius(q.m), className: 'quake-hist', weight: 2 })
      .bindPopup(card(`${q.year} ${q.name} — M${q.m}`, q.src, q.note))
      .addTo(historic);
  }
}
yearIn.addEventListener('input', drawHistoric);

let timer = null;
const playYears = document.getElementById('year-play');
playYears.addEventListener('click', () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
    playYears.textContent = '▶ Play history';
    return;
  }
  yearIn.value = yearIn.min;
  playYears.textContent = '❚❚ Stop';
  timer = setInterval(() => {
    yearIn.value = String(Number(yearIn.value) + 1);
    drawHistoric();
    if (yearIn.value === yearIn.max) playYears.click();
  }, 60);
});

// ---- live USGS feed (last 30 days, colored by depth) ------------------------
const live = L.layerGroup();
const status = document.getElementById('live-status');
const depthClass = (km) => (km < 70 ? 'shallow' : km < 300 ? 'mid' : 'deep');
let liveLoaded = false;

async function loadLive() {
  liveLoaded = true;
  status.textContent = 'Loading live data from USGS…';
  const since = new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10);
  const qs = new URLSearchParams({
    format: 'geojson', starttime: since, minmagnitude: '4', ...BBOX,
  });
  try {
    const res = await fetch(`${USGS}?${qs}`);
    if (!res.ok) throw new Error(`USGS responded ${res.status}`);
    const { features } = await res.json();
    for (const f of features) {
      const [lon, lat, depth] = f.geometry.coordinates;
      const { mag, place, time } = f.properties;
      const cls = `quake-live ${depthClass(depth)}`;
      L.circleMarker([lat, lon], { radius: radius(mag + 1), className: cls })
        .bindPopup(card(`M${mag.toFixed(1)} — ${place}`, new Date(time).toLocaleString(),
          `Depth: ${depth.toFixed(0)} km`))
        .addTo(live);
    }
    status.textContent = `${features.length} earthquakes of M4+ in the last 30 days (USGS, live).`;
  } catch (err) {
    liveLoaded = false;
    status.textContent = `Could not load live data: ${err.message}. Check the internet connection.`;
    console.error(err);
  }
}

// ---- layer toggles ----------------------------------------------------------
const LAYERS = { tectonics, volcanoes, historic, live };
for (const box of document.querySelectorAll('[data-layer]')) {
  const layer = LAYERS[box.dataset.layer];
  const sync = () => {
    if (box.checked) map.addLayer(layer);
    else map.removeLayer(layer);
    if (box.checked && layer === live && !liveLoaded) loadLive();
    document.getElementById('year-controls').hidden = !map.hasLayer(historic);
  };
  box.addEventListener('change', sync);
  sync();
}
drawHistoric();

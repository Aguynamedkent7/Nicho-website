# CONTINUITY — Nicho-website

## 2026-09-29 — Planning
- Task (from instructions.jpg): school project "Modeling Earth's Dynamic Processes", Challenge 3 —
  model the subduction zone that is the focal point of PH seismic activity; presentation must
  highlight PH susceptibility to seismic events. Building it as an interactive website.
- Proposed stack: static site, no build step — index.html + ES modules, Three.js (CDN) for the 3D
  subduction block, inline SVG for maps, USGS FDSN API for live quakes. Deploy: Vercel/GitHub Pages.
- Proposed sections: hero, plate map, 3D Philippine Trench cross-section (scroll/slider driven),
  quake explorer (historic + live), "why PH is at risk", volcano link, quiz, sources,
  presentation mode (arrow keys).
- Status: plan given to user, awaiting answers (deadline, focus trench, hosting). No code yet.
- Blockers: none.

## 2026-09-29 — Build (v1 complete)
- User answers: full animation, English only, presented on laptop, must work on phone,
  no physical model needed.
- Built: index.html, style.css, viz.css, js/{data,main,map,model,model-build,quiz}.js.
  All facts/content live in js/data.js. Map = Leaflet + Esri Ocean tiles; live quakes from
  USGS FDSN API (colored by depth). 3D = three.js 0.169 via importmap (jsdelivr).
- 3D timeline (24 s): converge → stress (plate edge bends, locked zone turns red) → rupture
  (flash, waves, shake, elastic rebound) → tsunami → magma + eruption. Slider scrubs it.
- Verified with Playwright (scratchpad, not a project dep): no console errors, all phases
  render, live USGS fetch returned 35 quakes, phone (390px) layout fixed.
- Must be served over http (ES modules): `python3 -m http.server`. Not committed yet.
- TODO for user: replace "Group ___" byline in index.html; deploy (Vercel/GitHub Pages).

## 2026-09-29 — Magnitude + safety graphics
- New section #scale ("4 · Magnitude"): SVG house scene redrawn per level M4–M9 (cracks, tilt,
  fallen tree, debris, dust), shakes with amplitude ∝ 2^(M-4) in bursts; clickable ladder with
  thumbnails, energy multipliers vs M4 and PH examples. Code: js/quake-scale.js, graphics.css,
  levels in data.js MAG_LEVELS. Old energy bar removed from main.js/style.css.
- Drop/Cover/Hold On cards now have inline SVG figures (Hold On table wobbles).
- Sections renumbered (safety 5, quiz 6). Verified desktop + phone screenshots, no errors.

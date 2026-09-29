// Builds the static geometry of the 3D Philippine Trench cross-section.
// Axes: x = west(-) to east(+), y = up, z = along the trench. Front face is at z = D/2.
import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

export const D = 6;
export const TRENCH_X = 1.4;
export const HYPO = new THREE.Vector3(0.4, -2.35, D / 2);
export const VOLCANO_X = -4.6;
const PLATE_BASE = -2.8;
const WATER_WEST = -1.9;
const WATER_EAST = 11;

const v2 = (x, y) => new THREE.Vector2(x, y);
const std = (color, extra = {}) => new THREE.MeshStandardMaterial({
  color, roughness: 0.85, ...extra,
});

// Top surface of the sinking Philippine Sea Plate, from east to west.
export const slabTop = new THREE.SplineCurve([
  v2(11, -1.5), v2(4, -1.5), v2(1.6, -1.85), v2(0, -2.6),
  v2(-2, -3.8), v2(-4, -5.3), v2(-6, -6.9), v2(-7.4, -8.3),
]);

/** Point on the slab top at curve parameter u, pushed `off` units along the downward normal. */
export function slabPoint(u, off = 0) {
  const p = slabTop.getPointAt(u);
  const t = slabTop.getTangentAt(u);
  return v2(p.x - t.y * off, p.y + t.x * off);
}

function extrude(points, materials, depth = D) {
  const geo = new THREE.ExtrudeGeometry(new THREE.Shape(points), { depth, bevelEnabled: false });
  geo.translate(0, 0, -depth / 2);
  return new THREE.Mesh(geo, materials);
}

function label(text, pos, cls = '') {
  const div = document.createElement('div');
  div.className = `lbl ${cls}`;
  div.textContent = text;
  const obj = new CSS2DObject(div);
  obj.position.copy(pos);
  return obj;
}

function buildPlates(g) {
  const N = 120;
  const top = [];
  const bottom = [];
  for (let i = 0; i <= N; i++) {
    top.push(slabPoint(i / N));
    bottom.push(slabPoint(i / N, 0.9));
  }
  g.add(extrude([...top, ...bottom.reverse()], [std('#46566e'), std('#34425a')]));

  const land = new THREE.SplineCurve([
    v2(-11, 0.35), v2(-8, 0.55), v2(-5, 0.6), v2(-3, 0.35), v2(-1.8, 0.02),
    v2(-0.6, -0.7), v2(0.7, -1.5), v2(TRENCH_X, -1.93),
  ]).getPoints(90);
  const contact = top.filter((p) => p.x < TRENCH_X && p.y > PLATE_BASE);
  const last = contact[contact.length - 1];
  const upper = extrude(
    [...land, ...contact, v2(last.x, PLATE_BASE), v2(-11, PLATE_BASE)],
    [std('#8a6b4a'), std('#5f7d3b')],
  );
  g.add(upper);

  const band = contact.filter((p) => p.x > -0.5);
  const lockedGeo = new THREE.Shape([
    ...band.map((p) => v2(p.x, p.y + 0.08)),
    ...band.map((p) => v2(p.x, p.y - 0.08)).reverse(),
  ]);
  const lockedMat = new THREE.MeshStandardMaterial({ color: '#3ddc84', emissive: '#3ddc84' });
  const locked = new THREE.Mesh(
    new THREE.ExtrudeGeometry(lockedGeo, { depth: D + 0.04, bevelEnabled: false })
      .translate(0, 0, -D / 2 - 0.02),
    lockedMat,
  );
  g.add(locked);

  const mantle = new THREE.Mesh(
    new THREE.BoxGeometry(22, 7.2, D - 0.04),
    std('#b8482a', { emissive: '#5a1a08', emissiveIntensity: 0.6 }),
  );
  mantle.position.y = -5.8;
  g.add(mantle);

  return { upper, basePos: upper.geometry.attributes.position.array.slice(), lockedMat };
}

function buildWater(g) {
  const w = WATER_EAST - WATER_WEST;
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(w, 2.0, D - 0.06),
    new THREE.MeshStandardMaterial({
      color: '#2a7fc9', transparent: true, opacity: 0.35, depthWrite: false,
    }),
  );
  body.position.set(WATER_WEST + w / 2, -1.02, 0);
  g.add(body);

  const geo = new THREE.PlaneGeometry(w, D - 0.06, 200, 1);
  geo.rotateX(-Math.PI / 2);
  geo.translate(WATER_WEST + w / 2, 0, 0);
  const surface = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
    color: '#4aa3e8', transparent: true, opacity: 0.6, side: THREE.DoubleSide, roughness: 0.3,
  }));
  g.add(surface);
  return surface;
}

function buildVolcanoes(g) {
  const craters = [];
  for (const z of [-1.6, 1.4]) {
    const cone = new THREE.Mesh(new THREE.ConeGeometry(1.1, 1.5, 32), std('#5a4636'));
    cone.position.set(VOLCANO_X, 0.58 + 0.75, z);
    g.add(cone);
    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 16, 12),
      new THREE.MeshBasicMaterial({ color: '#ff7a1a' }),
    );
    glow.position.set(VOLCANO_X, 2.05, z);
    glow.visible = false;
    g.add(glow);
    craters.push(glow);
  }

  const magma = [];
  const blobMat = new THREE.MeshBasicMaterial({ color: '#ff8a2a' });
  for (let i = 0; i < 14; i++) {
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 8), blobMat);
    b.visible = false;
    g.add(b);
    magma.push(b);
  }

  const COUNT = 260;
  const ashGeo = new THREE.BufferGeometry();
  ashGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(COUNT * 3), 3));
  const ash = new THREE.Points(ashGeo, new THREE.PointsMaterial({
    color: '#bdb6ad', size: 0.32, transparent: true, opacity: 0.7, depthWrite: false,
  }));
  ash.visible = false;
  g.add(ash);
  return { craters, magma, ash };
}

function buildQuakeFx(g) {
  const rings = [];
  for (let i = 0; i < 3; i++) {
    const r = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.035, 8, 96),
      new THREE.MeshBasicMaterial({ color: '#ffe28a', transparent: true }),
    );
    r.position.copy(HYPO).setZ(D / 2 + 0.06);
    r.visible = false;
    g.add(r);
    rings.push(r);
  }
  const flash = new THREE.PointLight('#ffd27a', 0, 14);
  flash.position.copy(HYPO).setZ(D / 2 + 0.6);
  g.add(flash);
  const star = new THREE.Mesh(
    new THREE.SphereGeometry(0.25, 16, 12),
    new THREE.MeshBasicMaterial({ color: '#fff3c4', transparent: true }),
  );
  star.position.copy(HYPO).setZ(D / 2 + 0.08);
  star.visible = false;
  g.add(star);
  return { rings, flash, star };
}

function buildStripes(g) {
  const mat = std('#9fb3d1', { emissive: '#2a3a55' });
  const stripes = [];
  for (let i = 0; i < 12; i++) {
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.07, D - 0.1), mat);
    g.add(s);
    stripes.push(s);
  }
  const arrow = new THREE.ArrowHelper(
    new THREE.Vector3(-1, 0, 0), new THREE.Vector3(9.5, -0.9, D / 2 - 0.4), 3, '#ffd166', 0.6, 0.4,
  );
  g.add(arrow);
  return stripes;
}

function buildLabels(g) {
  const z = D / 2;
  const small = window.matchMedia('(max-width: 640px)').matches;
  g.add(label('Philippine Sea Plate (oceanic)', new THREE.Vector3(7, -2.0, z)));
  g.add(label('Philippine Trench ▾', new THREE.Vector3(TRENCH_X, 0.8, z), 'hot'));
  g.add(label('Upper plate: the islands', new THREE.Vector3(-8, -1.3, z)));
  g.add(label('Mantle', new THREE.Vector3(5, -6, z)));
  g.add(label('Locked zone', new THREE.Vector3(-1.2, -2.25, z), 'hot'));
  g.add(label('Volcanic arc', new THREE.Vector3(VOLCANO_X, 2.8, 0)));
  if (!small) {
    g.add(label('Mantle wedge melts → magma', new THREE.Vector3(-8.2, -3.9, z)));
    g.add(label('WEST', new THREE.Vector3(-10.5, 1.4, z), 'dir'));
    g.add(label('EAST', new THREE.Vector3(10.5, 1.4, z), 'dir'));
  }
}

/** Build the whole cross-section into `scene`; returns handles for animation. */
export function buildModel(scene) {
  const world = new THREE.Group();
  scene.add(world);
  const plates = buildPlates(world);
  const surface = buildWater(world);
  const volcano = buildVolcanoes(world);
  const fx = buildQuakeFx(world);
  const stripes = buildStripes(world);
  buildLabels(world);
  return { world, surface, stripes, ...plates, ...volcano, ...fx };
}

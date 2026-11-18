// SHAKEDOWN: "Bare Witness" opening prototype.
// Character creator -> the parking lot -> Patches' welcome -> Buck streaks past -> chase him to the river.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const $ = (id) => document.getElementById(id);
const rand = (a, b) => a + Math.random() * (b - a);
const pick = (list) => list[Math.floor(Math.random() * list.length)];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

// ---------------------------------------------------------------- renderer
const renderer = new THREE.WebGLRenderer({ canvas: $('view'), antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x2f7f8f);
scene.fog = new THREE.Fog(0xf2a26b, 70, 330);
const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 900);
function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize();

scene.add(new THREE.HemisphereLight(0xffe2c4, 0x6b7a4a, 1.5));
scene.add(new THREE.AmbientLight(0xffd9c2, 0.55));
const sun = new THREE.DirectionalLight(0xffc48a, 2.3);
const SUN_DIR = new THREE.Vector3(-0.45, 0.5, -0.74).normalize(); // low in the north, over the river
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -28, right: 28, top: 28, bottom: -28, near: 1, far: 160 });
sun.shadow.bias = -0.0006;
scene.add(sun, sun.target);

// ---------------------------------------------------------------- world helpers
const colliders = []; // circles the player cannot walk through
const solid = (x, z, r) => colliders.push({ x, z, r });
const lambert = (color, extra = {}) => new THREE.MeshLambertMaterial({ color, flatShading: true, ...extra });
function mesh(geo, mat, x = 0, y = 0, z = 0, parent = scene) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.castShadow = m.receiveShadow = true;
  parent.add(m);
  return m;
}
function signTexture(text, { w = 512, h = 128, bg = '#fff3d6', fg = '#17111f', border = '#17111f', size = 64 } = {}) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d');
  g.fillStyle = bg; g.fillRect(0, 0, w, h);
  g.strokeStyle = border; g.lineWidth = 12; g.strokeRect(6, 6, w - 12, h - 12);
  g.fillStyle = fg; g.textAlign = 'center'; g.textBaseline = 'middle';
  let px = size;
  do { g.font = `${px}px "Marker Felt","Chalkboard SE",Impact,sans-serif`; px -= 2; } while (g.measureText(text).width > w - 40 && px > 12);
  g.fillText(text, w / 2, h / 2 + 2);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}
function stripeTexture(a, b) {
  const c = document.createElement('canvas');
  c.width = 128; c.height = 16;
  const g = c.getContext('2d');
  for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? a : b; g.fillRect(i * 16, 0, 16, 16); }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// Buck's route doubles as the tour path. [x, z] in metres; north is -z.
const ROUTE = [
  [17, -6.4], [7, -6.9], [1.6, -7.3], [-3.6, -8.4], [-5.6, -11.2], [-2.2, -14.2], [0, -18],
  [0, -27], [1.6, -41], [-1.2, -55], [0, -67],
  [8, -77], [17, -89], [11, -101], [-4, -105], [-17, -99],
  [-31, -101], [-44, -111], [-48, -124], [-39, -135],
  [-23, -141], [-9, -147], [0, -154], [0, -160],
];
const route = new THREE.CatmullRomCurve3(ROUTE.map(([x, z]) => new THREE.Vector3(x, 0, z)), false, 'catmullrom', 0.5);
const ROUTE_LEN = route.getLength();
const nearRoute = (x, z, d) => routeSamples.some((p) => (p.x - x) ** 2 + (p.z - z) ** 2 < d * d);
const routeSamples = route.getSpacedPoints(160);

// ---------------------------------------------------------------- ground + sky
const GROUND = { size: 420, cz: -70 };
function buildGround() {
  const N = 2048, c = document.createElement('canvas');
  c.width = c.height = N;
  const g = c.getContext('2d');
  const px = (x) => (x + GROUND.size / 2) / GROUND.size * N;
  const pz = (z) => (z - GROUND.cz + GROUND.size / 2) / GROUND.size * N;
  const m = (d) => d / GROUND.size * N;
  g.fillStyle = '#5f8f3e'; g.fillRect(0, 0, N, N);
  for (let i = 0; i < 9000; i++) {
    g.fillStyle = pick(['#6fa046', '#557f37', '#7aa64d', '#4f7a35', '#86a955', '#648f3f']);
    g.globalAlpha = rand(0.15, 0.5);
    g.beginPath(); g.ellipse(rand(0, N), rand(0, N), rand(4, 26), rand(3, 14), rand(0, 3), 0, 7); g.fill();
  }
  g.globalAlpha = 1;
  // gravel parking lot
  g.fillStyle = '#b79f78'; g.beginPath(); g.roundRect(px(-24), pz(-12), m(48), m(48), m(5)); g.fill();
  for (let i = 0; i < 2500; i++) {
    g.fillStyle = pick(['#a8916c', '#c6b088', '#9c8662']); g.globalAlpha = 0.5;
    g.fillRect(px(rand(-24, 24)), pz(rand(-12, 36)), rand(2, 6), rand(2, 6));
  }
  g.globalAlpha = 1;
  // river bank sand
  g.fillStyle = '#d8c690'; g.fillRect(0, pz(-185), N, m(24));
  // trodden dirt path along the route
  const stroke = (w, col, a) => {
    g.strokeStyle = col; g.globalAlpha = a; g.lineWidth = m(w); g.lineCap = g.lineJoin = 'round';
    g.beginPath();
    routeSamples.slice(18).forEach((p, i) => (i ? g.lineTo(px(p.x), pz(p.z)) : g.moveTo(px(p.x), pz(p.z))));
    g.stroke();
  };
  stroke(8, '#8a7a4c', 0.35); stroke(5.5, '#a48b5e', 0.8); stroke(3.2, '#b89c6c', 0.9);
  // Shakedown Street is wider and more worn
  g.strokeStyle = '#ad9365'; g.globalAlpha = 0.9; g.lineWidth = m(10); g.lineCap = 'round';
  g.beginPath(); g.moveTo(px(0), pz(-12)); g.lineTo(px(0), pz(-66)); g.stroke();
  g.globalAlpha = 1;
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(GROUND.size, GROUND.size), new THREE.MeshLambertMaterial({ map: tex }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.z = GROUND.cz;
  ground.receiveShadow = true;
  scene.add(ground);

  const water = new THREE.Mesh(new THREE.PlaneGeometry(GROUND.size, 18),
    new THREE.MeshPhongMaterial({ color: 0x2aa7b8, emissive: 0x0c4a55, shininess: 120, specular: 0xffd9a0, transparent: true, opacity: 0.9 }));
  water.rotation.x = -Math.PI / 2;
  water.position.set(0, 0.06, -175);
  scene.add(water);
  return water;
}
function buildSky(texture) {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.MirroredRepeatWrapping;
  texture.repeat.set(2, 1);
  texture.offset.x = -0.25; // put the painted sun due north
  const sky = new THREE.Mesh(new THREE.CylinderGeometry(420, 420, 330, 48, 1, true),
    new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide, fog: false }));
  sky.position.set(0, 118, -70);
  sky.rotation.y = Math.PI / 2;
  scene.add(sky);
}

// ---------------------------------------------------------------- props
const CAR_COLORS = [0xd94f3d, 0x3d7bd9, 0xe8c547, 0x4fae6a, 0xf2efe6, 0x7a5fd0, 0x38424d, 0xe98a3a, 0x7fb7c9];
function car(x, z, rot, color = pick(CAR_COLORS), van = false) {
  const g = new THREE.Group();
  const len = van ? 5.2 : 4.2, h = van ? 1.5 : 0.75;
  mesh(new THREE.BoxGeometry(1.8, h, len), lambert(color), 0, 0.45 + h / 2, 0, g);
  if (!van) mesh(new THREE.BoxGeometry(1.6, 0.6, 2.1), lambert(0x26323d), 0, 1.5, -0.2, g);
  else mesh(new THREE.BoxGeometry(1.82, 0.5, 1.2), lambert(0x26323d), 0, 1.6, len / 2 - 0.9, g);
  const wheel = new THREE.CylinderGeometry(0.36, 0.36, 0.25, 10);
  for (const [wx, wz] of [[-0.9, 1.3], [0.9, 1.3], [-0.9, -1.3], [0.9, -1.3]]) {
    const w = mesh(wheel, lambert(0x1c1c1c), wx, 0.36, wz * (len / 4.2), g);
    w.rotation.z = Math.PI / 2;
  }
  g.position.set(x, 0, z); g.rotation.y = rot;
  scene.add(g);
  solid(x, z, van ? 2.5 : 2.1);
}
const TENT_COLORS = [0xe4572e, 0x29a19c, 0xf3a712, 0x669bbc, 0xa23b72, 0x8ac926, 0xf2e8cf, 0x6a4c93, 0xff7b54];
function tent(x, z, s = 1, color = pick(TENT_COLORS)) {
  const t = mesh(new THREE.ConeGeometry(1.7 * s, 1.5 * s, 4, 1), lambert(color), x, 0.75 * s, z);
  t.rotation.y = rand(0, Math.PI);
  solid(x, z, 1.45 * s);
}
function canopy(x, z, color = pick(TENT_COLORS)) {
  const g = new THREE.Group();
  const post = new THREE.CylinderGeometry(0.05, 0.05, 2.2, 5);
  for (const [px, pz] of [[-1.4, -1.4], [1.4, -1.4], [-1.4, 1.4], [1.4, 1.4]]) mesh(post, lambert(0xdddddd), px, 1.1, pz, g);
  const top = mesh(new THREE.ConeGeometry(2.15, 0.7, 4, 1), lambert(color), 0, 2.55, 0, g);
  top.rotation.y = Math.PI / 4;
  g.position.set(x, 0, z); g.rotation.y = rand(0, 1);
  scene.add(g);
}
function stall(x, z, face, label, a, b) {
  const g = new THREE.Group();
  const post = new THREE.BoxGeometry(0.12, 2.6, 0.12);
  for (const [px, pz] of [[-1.9, -1.2], [1.9, -1.2], [-1.9, 1.2], [1.9, 1.2]]) mesh(post, lambert(0x6b4a2b), px, 1.3, pz, g);
  mesh(new THREE.BoxGeometry(3.9, 1.0, 0.7), lambert(0x8a5f38), 0, 0.5, 1.0, g);
  const stripes = stripeTexture(a, b); stripes.wrapS = THREE.RepeatWrapping; stripes.repeat.x = 2;
  const awn = mesh(new THREE.BoxGeometry(4.4, 0.08, 3.2), new THREE.MeshLambertMaterial({ map: stripes }), 0, 2.72, 0.2, g);
  awn.rotation.x = 0.16;
  const sign = mesh(new THREE.PlaneGeometry(3.6, 0.8), new THREE.MeshBasicMaterial({ map: signTexture(label), fog: true }), 0, 2.2, 1.62, g);
  sign.castShadow = false;
  for (let i = 0; i < 7; i++) mesh(new THREE.BoxGeometry(rand(0.25, 0.5), rand(0.15, 0.45), 0.3), lambert(pick(TENT_COLORS)), -1.5 + i * 0.5, 1.15, 1.0, g);
  g.position.set(x, 0, z); g.rotation.y = face;
  scene.add(g);
  solid(x, z, 2.0); solid(x + Math.cos(face) * 1.5, z - Math.sin(face) * 1.5, 1.2); solid(x - Math.cos(face) * 1.5, z + Math.sin(face) * 1.5, 1.2);
}
function bunting(x1, x2, z, y = 4.3) {
  const cols = [0xff5d8f, 0xffc93c, 0x2ec4b6, 0x5b3fa0, 0xff7b54];
  const tri = new THREE.ConeGeometry(0.22, 0.45, 3, 1);
  const n = Math.round(Math.abs(x2 - x1) / 0.55);
  for (let i = 0; i <= n; i++) {
    const t = i / n, sag = Math.sin(t * Math.PI) * 0.6;
    const f = mesh(tri, lambert(cols[i % cols.length]), x1 + (x2 - x1) * t, y - sag, z);
    f.rotation.x = Math.PI; f.castShadow = false;
  }
  for (const x of [x1, x2]) mesh(new THREE.CylinderGeometry(0.07, 0.09, y + 0.2, 6), lambert(0x6b4a2b), x, (y + 0.2) / 2, z);
}
function gate() {
  const z = -13;
  for (const x of [-5.2, 5.2]) {
    mesh(new THREE.CylinderGeometry(0.32, 0.42, 7, 8), lambert(0x7a4f2a), x, 3.5, z);
    for (let i = 0; i < 4; i++) mesh(new THREE.BoxGeometry(0.9, 0.5, 0.9), lambert([0xff5d8f, 0xffc93c, 0x2ec4b6, 0x5b3fa0][i]), x, 1.2 + i * 1.5, z).rotation.y = i * 0.5;
    solid(x, z, 0.7);
  }
  const board = mesh(new THREE.BoxGeometry(11.5, 2.0, 0.25), lambert(0x17111f), 0, 6.1, z);
  const tex = signTexture('SHAKEDOWN', { w: 1024, h: 180, bg: '#ffc93c', fg: '#17111f', size: 150 });
  for (const s of [1, -1]) {
    const face = mesh(new THREE.PlaneGeometry(11.1, 1.7), new THREE.MeshBasicMaterial({ map: tex }), 0, 6.1, z + s * 0.14);
    if (s < 0) face.rotation.y = Math.PI;
    face.castShadow = false;
  }
  board.castShadow = true;
  // fence either side of the gate
  for (const s of [1, -1]) {
    mesh(new THREE.BoxGeometry(70, 0.12, 0.08), lambert(0x8a6a44), s * 40.6, 1.2, z);
    mesh(new THREE.BoxGeometry(70, 0.12, 0.08), lambert(0x8a6a44), s * 40.6, 0.6, z);
    for (let x = 7; x < 76; x += 3) mesh(new THREE.BoxGeometry(0.14, 1.5, 0.14), lambert(0x6b4a2b), s * x, 0.75, z);
  }
}
function potty(x, z) {
  mesh(new THREE.BoxGeometry(1.2, 2.2, 1.2), lambert(0x2b78c2), x, 1.1, z);
  mesh(new THREE.BoxGeometry(1.3, 0.18, 1.3), lambert(0xf2efe6), x, 2.28, z);
  solid(x, z, 0.95);
}
function stage(x, z) {
  const g = new THREE.Group();
  mesh(new THREE.BoxGeometry(11, 1.5, 17), lambert(0x2a2433), 0, 0.75, 0, g);
  const truss = lambert(0x9aa3ad);
  for (const sz of [-8, 8]) mesh(new THREE.BoxGeometry(0.5, 9, 0.5), truss, 4.5, 6, sz, g);
  mesh(new THREE.BoxGeometry(0.5, 0.5, 16.5), truss, 4.5, 10.5, 0, g);
  const c = document.createElement('canvas'); c.width = 256; c.height = 128;
  const q = c.getContext('2d'), grad = q.createLinearGradient(0, 0, 256, 128);
  grad.addColorStop(0, '#ff5d8f'); grad.addColorStop(0.5, '#5b3fa0'); grad.addColorStop(1, '#2ec4b6');
  q.fillStyle = grad; q.fillRect(0, 0, 256, 128);
  for (let i = 0; i < 9; i++) { q.strokeStyle = 'rgba(255,255,255,.55)'; q.lineWidth = 3; q.beginPath(); q.arc(128, 128, 14 + i * 14, Math.PI, 0); q.stroke(); }
  const scr = new THREE.CanvasTexture(c); scr.colorSpace = THREE.SRGBColorSpace;
  const screen = mesh(new THREE.PlaneGeometry(14, 7), new THREE.MeshBasicMaterial({ map: scr }), -4.6, 6, 0, g);
  screen.rotation.y = Math.PI / 2; screen.castShadow = false;
  mesh(new THREE.BoxGeometry(0.4, 8.5, 15.5), lambert(0x17111f), -5, 5.6, 0, g);
  for (const sz of [-10.2, 10.2]) for (let i = 0; i < 4; i++) mesh(new THREE.BoxGeometry(1.6, 1.25, 1.6), lambert(0x15131a), 3.5, 0.65 + i * 1.3, sz, g);
  g.position.set(x, 0, z);
  scene.add(g);
  solid(x, z - 5, 6.5); solid(x, z + 5, 6.5); solid(x + 3.5, z - 10.2, 1.4); solid(x + 3.5, z + 10.2, 1.4);
}
function totem(x, z) {
  mesh(new THREE.CylinderGeometry(0.04, 0.04, 4.6, 5), lambert(0xdddddd), x, 2.3, z);
  const top = mesh(pick([new THREE.OctahedronGeometry(0.42), new THREE.TorusGeometry(0.34, 0.12, 6, 10), new THREE.IcosahedronGeometry(0.4, 0)]),
    lambert(pick(TENT_COLORS), { emissive: 0x332211 }), x, 4.8, z);
  spinners.push(top);
}
const spinners = [];
let crowd = null;
function buildCrowd(spots) {
  const body = new THREE.CapsuleGeometry(0.24, 0.95, 3, 8);
  crowd = new THREE.InstancedMesh(body, new THREE.MeshLambertMaterial({ flatShading: true }), spots.length);
  crowd.castShadow = true;
  const head = new THREE.InstancedMesh(new THREE.SphereGeometry(0.17, 8, 6), new THREE.MeshLambertMaterial({ flatShading: true }), spots.length);
  const m = new THREE.Matrix4(), col = new THREE.Color();
  const skins = [0xf1c9a5, 0xd9a577, 0xb07c52, 0x8a5a3a, 0x5f3d28, 0xe8b894];
  spots.forEach((s, i) => {
    m.makeTranslation(s.x, 0.72, s.z); crowd.setMatrixAt(i, m);
    crowd.setColorAt(i, col.setHex(pick(TENT_COLORS)));
    m.makeTranslation(s.x, 1.62, s.z); head.setMatrixAt(i, m);
    head.setColorAt(i, col.setHex(pick(skins)));
    solid(s.x, s.z, 0.4);
  });
  crowd.userData = { spots, head };
  scene.add(crowd, head);
}
function buildTrees() {
  const spots = [];
  while (spots.length < 620) {
    const x = rand(-205, 205), z = rand(-275, 135);
    const inside = Math.abs(x) < 74 && z < 40 && z > -166;
    const water = z < -164 && z > -186;
    if (inside || water) continue;
    spots.push([x, z, rand(0.8, 1.7)]);
  }
  for (let i = 0; i < 26; i++) { // a few landmark trees inside the grounds
    const x = rand(-70, 70), z = rand(-160, -70);
    if (!nearRoute(x, z, 9) && !(x < -40 && z < -100 && z > -140)) { spots.push([x, z, rand(0.9, 1.3)]); solid(x, z, 0.6); }
  }
  const trunks = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.28, 0.4, 3, 6), lambert(0x5a3d25), spots.length);
  const tops = new THREE.InstancedMesh(new THREE.ConeGeometry(2.6, 8, 7), lambert(0xffffff), spots.length);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), col = new THREE.Color();
  spots.forEach(([x, z, s], i) => {
    m.compose(new THREE.Vector3(x, 1.5 * s, z), q, new THREE.Vector3(s, s, s)); trunks.setMatrixAt(i, m);
    m.compose(new THREE.Vector3(x, 6.4 * s, z), q, new THREE.Vector3(s, s, s)); tops.setMatrixAt(i, m);
    tops.setColorAt(i, col.setHSL(rand(0.27, 0.36), rand(0.4, 0.6), rand(0.26, 0.4)));
  });
  trunks.castShadow = tops.castShadow = true;
  scene.add(trunks, tops);
}
function buildWorld() {
  // parking lot
  for (const x of [-15, -9, 9, 15]) for (let z = 30; z > -6; z -= 5.6) if (Math.random() < 0.82) car(x + rand(-0.3, 0.3), z, (x < 0 ? 0.5 : -0.5) * Math.PI + rand(-0.08, 0.08), undefined, Math.random() < 0.2);
  car(2.9, 4.6, Math.PI * 0.94, 0x8a8f6a); // the beater you arrived in
  gate();
  // Shakedown Street
  const L = [['TIE-DYE & TAPESTRY', '#ff5d8f', '#ffc93c'], ['GRILLED CHEESE $3', '#ffc93c', '#fff3d6'], ['KANDI KORNER', '#2ec4b6', '#ff5d8f'], ['HEADY GLASS', '#5b3fa0', '#2ec4b6'], ['PINS PINS PINS', '#ff7b54', '#fff3d6']];
  const R = [['COLD WATER $2', '#3aa0ff', '#fff3d6'], ['VEGGIE BURRITOS', '#8ac926', '#ffc93c'], ['LEATHER & BURNER', '#6b4a2b', '#e4572e'], ['THE COSTUME SHOP', '#a23b72', '#ffc93c'], ['3 FOR $20  NO DEALS!', '#17111f', '#ffc93c']];
  L.forEach((s, i) => stall(-8, -22 - i * 9.2, Math.PI / 2, ...s));
  R.forEach((s, i) => stall(8, -22 - i * 9.2, -Math.PI / 2, ...s));
  for (let z = -17.5; z > -64; z -= 9.2) bunting(-6.2, 6.2, z);
  // Vinny's tank by the last stall on the right
  const tank = mesh(new THREE.CylinderGeometry(0.28, 0.28, 1.5, 12), new THREE.MeshPhongMaterial({ color: 0x3f6fd1, shininess: 90 }), 5.3, 0.75, -62.2);
  mesh(new THREE.SphereGeometry(0.28, 12, 8), tank.material, 5.3, 1.5, -62.2);
  for (let i = 0; i < 5; i++) mesh(new THREE.SphereGeometry(0.3, 10, 8), lambert(pick([0xff5d8f, 0xffc93c, 0x2ec4b6, 0xf2efe6])), 5.1 + rand(-0.5, 0.5), 2.2 + rand(0, 0.9), -62 + rand(-0.4, 0.4)).scale.y = 1.2;
  solid(5.3, -62.2, 0.5);
  // the Free Pile
  const pile = new THREE.Group();
  mesh(new THREE.BoxGeometry(4.5, 0.04, 3.4), lambert(0x3f6fd1), 0, 0.03, 0, pile).castShadow = false;
  for (let i = 0; i < 26; i++) { const b = mesh(new THREE.BoxGeometry(rand(0.3, 0.8), rand(0.12, 0.4), rand(0.3, 0.7)), lambert(pick(TENT_COLORS)), rand(-1.5, 1.5), rand(0.1, 0.7), rand(-1, 1), pile); b.rotation.set(rand(-0.5, 0.5), rand(0, 3), rand(-0.5, 0.5)); }
  mesh(new THREE.PlaneGeometry(2.2, 0.6), new THREE.MeshBasicMaterial({ map: signTexture('FREE PILE'), side: THREE.DoubleSide }), 0, 1.6, -1.6, pile).castShadow = false;
  mesh(new THREE.BoxGeometry(0.08, 1.9, 0.08), lambert(0x6b4a2b), 0, 0.95, -1.62, pile);
  pile.position.set(-9.5, 0, -70); pile.rotation.y = 0.5; scene.add(pile); solid(-9.5, -70, 2.2);
  // the Campgrounds
  let placed = 0, tries = 0;
  while (placed < 70 && tries++ < 900) {
    const x = rand(-22, 46), z = rand(-118, -72);
    if (nearRoute(x, z, 3.6) || colliders.some((c) => (c.x - x) ** 2 + (c.z - z) ** 2 < (c.r + 2.2) ** 2)) continue;
    const r = Math.random();
    if (r < 0.72) tent(x, z, rand(0.8, 1.25)); else if (r < 0.86) { canopy(x, z); solid(x, z, 1.9); } else car(x, z, rand(0, 6), undefined, true);
    placed++;
  }
  for (let i = 0; i < 6; i++) potty(34 + i * 1.5, -66);
  for (let i = 0; i < 14; i++) { const x = rand(-20, 44), z = rand(-116, -74); if (!nearRoute(x, z, 2)) totem(x, z); }
  // Main Stage Field
  stage(-66, -121);
  const spots = [];
  for (let i = 0; i < 150; i++) { const x = rand(-58, -51) + rand(-1.5, 1.5), z = rand(-134, -108); if (!nearRoute(x, z, 2.6)) spots.push({ x, z, ph: rand(0, 6) }); }
  for (let i = 0; i < 26; i++) { const side = Math.random() < 0.5 ? -1 : 1; spots.push({ x: side * rand(4.6, 5.8), z: rand(-60, -20), ph: rand(0, 6) }); }
  buildCrowd(spots);
  for (let i = 0; i < 8; i++) totem(rand(-58, -50), rand(-132, -110));
  buildTrees();
}

// ---------------------------------------------------------------- characters
const loader = new GLTFLoader();
function prepClip(clip, name, stripPosition = false) {
  const c = clip.clone();
  c.name = name;
  c.tracks = c.tracks.filter((t) => {
    if (t.name.endsWith('.scale')) return false;
    if (t.name.endsWith('.position')) return !stripPosition && t.name.startsWith('Hips.');
    return true;
  });
  return c;
}
async function loadCharacter(url) {
  const gltf = await loader.loadAsync(url);
  gltf.scene.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = true; o.frustumCulled = false;
      // No reflections in this scene, so treat every surface as matte or metal parts render black.
      o.material.metalness = 0; o.material.metalnessMap = null; o.material.roughness = 0.9; o.material.roughnessMap = null;
    }
  });
  const root = new THREE.Group();
  root.add(gltf.scene);
  const bones = {};
  gltf.scene.traverse((o) => { if (o.isBone) bones[o.name] = o; });
  return { root, model: gltf.scene, mixer: new THREE.AnimationMixer(gltf.scene), clips: gltf.animations, bones, actions: {}, current: null };
}
function addAction(ch, name, clip, timeScale = 1) {
  const a = ch.mixer.clipAction(clip);
  a.timeScale = timeScale;
  ch.actions[name] = a;
}
function play(ch, name, fade = 0.22) {
  if (ch.current === name) return;
  const next = ch.actions[name], prev = ch.actions[ch.current];
  next.reset().setEffectiveWeight(1).play();
  if (prev) prev.crossFadeTo(next, fade, false); else next.fadeIn(0.01);
  ch.current = name;
}
const faceTo = (obj, dx, dz, dt, rate = 10) => {
  const want = Math.atan2(dx, dz);
  let d = want - obj.rotation.y;
  d = Math.atan2(Math.sin(d), Math.cos(d));
  obj.rotation.y += d * Math.min(1, dt * rate);
};

// Tint shader: recolour a texture. "skinOnly" leaves grey/white pixels (briefs, eyes) alone.
function tintable(material, skinOnly) {
  const u = { uTint: { value: new THREE.Color(1, 1, 1) }, uHue: { value: 0 }, uGrey: { value: 0 }, uSkinOnly: { value: skinOnly ? 1 : 0 } };
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, u);
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform vec3 uTint; uniform float uHue; uniform float uGrey; uniform float uSkinOnly;')
      .replace('#include <map_fragment>', `#include <map_fragment>
        { vec3 c = diffuseColor.rgb;
          float mx = max(c.r, max(c.g, c.b)), mn = min(c.r, min(c.g, c.b));
          float w = mix(1.0, smoothstep(0.16, 0.38, (mx - mn) / max(mx, 0.001)), uSkinOnly);
          vec3 k = vec3(0.57735); float cs = cos(uHue), sn = sin(uHue);
          c = c * cs + cross(k, c) * sn + k * dot(k, c) * (1.0 - cs);
          c = mix(c, vec3(dot(c, vec3(0.3, 0.59, 0.11))) * 1.35, uGrey);
          diffuseColor.rgb = mix(diffuseColor.rgb, c * uTint, w); }`);
  };
  material.needsUpdate = true;
  return u;
}

// ---------------------------------------------------------------- the player and the creator
const SKIN = [[1.32, 1.22, 1.16], [1.16, 1.08, 1.02], [1, 1, 1], [0.86, 0.8, 0.76], [0.7, 0.6, 0.54], [0.54, 0.44, 0.38], [0.4, 0.31, 0.27], [0.28, 0.21, 0.19]];
const SKIN_CSS = ['#f3d2bd', '#e6bb9b', '#cf9a72', '#b5825c', '#946443', '#74492f', '#573523', '#3e2519'];
const HAIR_COL = [[1.05, 1, 0.92, '#e8d6a8'], [0.62, 0.42, 0.26, '#8a5a35'], [0.26, 0.17, 0.12, '#3b2417'], [0.1, 0.09, 0.09, '#17120f'], [0.95, 0.4, 0.2, '#c7552c'], [1.1, 0.5, 0.75, '#ff7fb0'], [0.35, 0.95, 0.9, '#3fd6c6'], [0.6, 0.45, 1.05, '#8f6ae0']];
const HUES = [[0, '#c066d6'], [1.2, '#f2a03a'], [2.2, '#5fc66a'], [3.3, '#3fb6d8'], [4.6, '#e0527a']];
const BOT_HUES = [[0, '#7c7a3c'], [-0.5, '#9a6a3a'], [2.6, '#3f6f9a'], [1.2, '#3f8f6a'], [4.4, '#8a4f8a']];
const look = { name: 'First-Timer', skin: 2, hair: 'none', hairCol: 1, age: 24, height: 100, build: 100, top: 'tee', topHue: 0, bottom: 'shorts', botHue: 0, hat: false, bag: true };
let player, uniforms = {};
const PIECES = ['tee', 'shorts', 'hat', 'bag', 'hair_mop', 'hair_afro', 'hair_dreads'];

function setupPlayerMaterials() {
  const groups = { body: [], tee: [], shorts: [], hair: [] };
  player.model.traverse((o) => {
    if (!o.isMesh) return;
    const n = o.name || o.parent.name;
    if (n.startsWith('Body')) groups.body.push(o);
    else if (n.startsWith('hair')) groups.hair.push(o);
    else if (n.startsWith('tee')) groups.tee.push(o);
    else if (n.startsWith('shorts')) groups.shorts.push(o);
  });
  for (const [key, list] of Object.entries(groups)) {
    const done = new Map();
    uniforms[key] = [];
    for (const o of list) {
      if (!done.has(o.material)) { const m = o.material.clone(); done.set(o.material, m); uniforms[key].push(tintable(m, key === 'body')); }
      o.material = done.get(o.material);
    }
  }
}
function applyLook() {
  const worn = new Set();
  if (look.top === 'tee') worn.add('tee');
  if (look.bottom === 'shorts') worn.add('shorts');
  if (look.hat) worn.add('hat');
  if (look.bag) worn.add('bag');
  if (look.hair !== 'none' && !look.hat) worn.add('hair_' + look.hair); // a hat hides the hairstyle for now
  player.model.traverse((o) => {
    const n = o.name;
    if (n.startsWith('BodyU-')) o.visible = !n.slice(6).split('-').some((p) => worn.has(p));
    else if (PIECES.includes(n)) o.visible = worn.has(n);
  });
  const age = (look.age - 18) / 57, grey = clamp((look.age - 38) / 30, 0, 1);
  const s = SKIN[look.skin];
  uniforms.body.forEach((u) => { u.uTint.value.setRGB(s[0], s[1], s[2]); u.uGrey.value = age * 0.12; });
  const h = HAIR_COL[look.hairCol];
  uniforms.hair.forEach((u) => { u.uTint.value.setRGB(h[0], h[1], h[2]).lerp(new THREE.Color(1.15, 1.15, 1.2), grey * 0.85); u.uGrey.value = grey; });
  uniforms.tee.forEach((u) => { u.uHue.value = look.topHue; });
  uniforms.shorts.forEach((u) => { u.uHue.value = look.botHue; });
  const hgt = look.height / 100, wide = look.build / 100;
  player.model.scale.set(hgt * wide, hgt, hgt * wide);
  $('agev').textContent = look.age;
  $('heightv').textContent = `${Math.round(look.height * 1.8)} cm`;
  $('hname').textContent = look.name;
}
function buildCreatorUI() {
  const swatches = (id, cssList, key) => {
    const box = $(id);
    cssList.forEach((css, i) => {
      const b = document.createElement('button');
      b.style.background = css; b.title = `${key} ${i + 1}`; b.setAttribute('aria-label', `${key} ${i + 1}`);
      b.onclick = () => { look[key] = key.endsWith('Hue') ? (key === 'topHue' ? HUES : BOT_HUES)[i][0] : i; sync(); };
      box.append(b);
    });
  };
  const options = (id, list, get, set) => {
    const box = $(id);
    list.forEach(([value, label]) => {
      const b = document.createElement('button');
      b.textContent = label; b.dataset.v = value;
      b.onclick = () => { set(value); sync(); };
      box.append(b);
    });
    box._get = get;
  };
  swatches('skin', SKIN_CSS, 'skin');
  swatches('haircol', HAIR_COL.map((h) => h[3]), 'hairCol');
  swatches('topcol', HUES.map((h) => h[1]), 'topHue');
  swatches('botcol', BOT_HUES.map((h) => h[1]), 'botHue');
  options('hair', [['none', 'Buzz cut'], ['mop', 'Shaggy mop'], ['afro', 'Afro'], ['dreads', 'Dreads']], () => look.hair, (v) => { look.hair = v; });
  options('top', [['none', 'Shirtless'], ['tee', 'Tie-dye tee']], () => look.top, (v) => { look.top = v; });
  options('bottom', [['none', 'Just briefs'], ['shorts', 'Cargo shorts']], () => look.bottom, (v) => { look.bottom = v; });
  const ex = $('extras');
  for (const [key, label] of [['hat', 'Bucket hat'], ['bag', 'Cup-holder bag']]) {
    const b = document.createElement('button');
    b.textContent = label; b.dataset.k = key;
    b.onclick = () => { look[key] = !look[key]; sync(); };
    ex.append(b);
  }
  for (const id of ['age', 'height', 'build']) $(id).oninput = (e) => { look[id] = +e.target.value; sync(); };
  $('pname').oninput = (e) => { look.name = e.target.value.trim() || 'First-Timer'; sync(); };
  $('rand').onclick = () => {
    Object.assign(look, { skin: Math.floor(rand(0, 8)), hair: pick(['none', 'mop', 'afro', 'dreads']), hairCol: Math.floor(rand(0, 8)), age: Math.round(rand(18, 70)), height: Math.round(rand(93, 107)), build: Math.round(rand(92, 116)), top: pick(['tee', 'tee', 'none']), topHue: pick(HUES)[0], bottom: pick(['shorts', 'shorts', 'none']), botHue: pick(BOT_HUES)[0], hat: Math.random() < 0.4, bag: Math.random() < 0.6 });
    for (const id of ['age', 'height', 'build']) $(id).value = look[id];
    sync();
  };
  $('go').onclick = startGame;
}
function sync() {
  const mark = (id, test) => [...$(id).children].forEach((b, i) => b.classList.toggle('on', test(b, i)));
  mark('skin', (b, i) => i === look.skin);
  mark('haircol', (b, i) => i === look.hairCol);
  mark('topcol', (b, i) => HUES[i][0] === look.topHue);
  mark('botcol', (b, i) => BOT_HUES[i][0] === look.botHue);
  for (const id of ['hair', 'top', 'bottom']) mark(id, (b) => b.dataset.v === $(id)._get());
  mark('extras', (b) => look[b.dataset.k]);
  $('topcol').style.visibility = look.top === 'tee' ? 'visible' : 'hidden';
  $('botcol').style.visibility = look.bottom === 'shorts' ? 'visible' : 'hidden';
  applyLook();
}

// ---------------------------------------------------------------- Buck's censor
function makeCensor() {
  const c = document.createElement('canvas');
  c.width = 8; c.height = 6;
  const g = c.getContext('2d');
  const tex = new THREE.CanvasTexture(c);
  tex.magFilter = THREE.NearestFilter; tex.minFilter = THREE.NearestFilter; tex.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, fog: false }));
  sprite.scale.set(0.62, 0.46, 1);
  sprite.renderOrder = 10;
  const tones = ['#d9a07a', '#c98e69', '#e6b592', '#b87d5a', '#f0c4a4', '#a86f4f'];
  let t = 0;
  const repaint = () => { for (let y = 0; y < 6; y++) for (let x = 0; x < 8; x++) { g.fillStyle = pick(tones); g.fillRect(x, y, 1, 1); } tex.needsUpdate = true; };
  repaint();
  return { sprite, update(dt, target, speed) {
    t += dt; if (t > 0.09) { t = 0; repaint(); }
    // The censor is its own object: it lags behind him when he sprints and has to catch up.
    const k = speed > 4 ? 13 : 30;
    sprite.position.lerp(target, Math.min(1, dt * k));
  } };
}

// ---------------------------------------------------------------- game state
const keys = {};
const cam = { yaw: 0, pitch: 0.2, dist: 4.6 };
const state = { mode: 'load', t: 0, thirst: 0.2, zone: '', zonesSeen: new Set(), buckS: 0, buckSpeed: 0, canMove: false, dialogue: null, onDialogueEnd: null };
let patches, buck, vinny, censor, water;
const hips = new THREE.Vector3(), tmp = new THREE.Vector3();

function say(lines, onEnd) {
  state.dialogue = { lines, i: 0 };
  state.onDialogueEnd = onEnd;
  showLine();
}
function showLine() {
  const d = state.dialogue;
  if (!d) return;
  if (d.i >= d.lines.length) { state.dialogue = null; $('dialogue').classList.add('hidden'); const f = state.onDialogueEnd; state.onDialogueEnd = null; if (f) f(); return; }
  const [who, text] = d.lines[d.i];
  $('who').textContent = who; $('line').textContent = text;
  $('dialogue').classList.remove('hidden');
}
function advance() { if (state.dialogue && !state.dialogue.locked) { state.dialogue.i++; showLine(); } }
function banner(text) {
  const z = $('zone');
  z.textContent = text; z.classList.add('show');
  clearTimeout(banner.t); banner.t = setTimeout(() => z.classList.remove('show'), 2800);
}
function quest(title, items) {
  $('quest').classList.remove('hidden');
  $('qtitle').textContent = title;
  $('qlist').innerHTML = '';
  items.forEach(([id, text]) => { const li = document.createElement('li'); li.id = 'q-' + id; li.textContent = text; $('qlist').append(li); });
}
const tick = (id) => { const li = $('q-' + id); if (li) li.classList.add('done'); };
function card(h, p, ms, then) {
  $('cardh').textContent = h; $('cardp').textContent = p;
  $('card').classList.remove('hidden'); $('card').style.opacity = 1;
  setTimeout(() => { $('card').style.opacity = 0; setTimeout(() => { $('card').classList.add('hidden'); if (then) then(); }, 1000); }, ms);
}
function zoneAt(x, z) {
  if (z <= -142) return 'The River';
  if (x <= -25 && z < -92 && z > -140) return 'Main Stage Field';
  if (z <= -69) return 'The Campgrounds';
  if (z <= -13.5) return 'Shakedown Street';
  return 'The Parking Lot';
}

function startCreator() {
  state.mode = 'creator';
  $('loading').classList.add('hidden');
  $('creator').classList.remove('hidden'); $('spinhint').classList.remove('hidden');
  player.root.position.set(0, 0, 1.5);
  player.root.rotation.y = Math.PI * 0.94; // facing the gate; the creator camera stands in front of them
  play(player, 'Idle');
}
function startGame() {
  $('creator').classList.add('hidden'); $('spinhint').classList.add('hidden');
  state.mode = 'intro';
  card('Thursday, 4:20 PM', `${look.name}'s first festival. $40 in your pocket.`, 2600, () => {
    $('hud').classList.remove('hidden');
    state.mode = 'arrive'; state.canMove = true;
    player.root.rotation.y = Math.PI;
    cam.yaw = 0; cam.pitch = 0.2;
    banner('The Parking Lot');
    quest('Welcome to the lot', [['gate', 'Walk up to the gate']]);
  });
}
function beginWelcome() {
  state.mode = 'welcome'; state.canMove = false;
  tick('gate');
  say([
    ['Patches', 'Well, well. A new face. Welcome home, family.'],
    ['Patches', "Name's Patches. Folks call me the Mayor of Shakedown Street. Nobody voted, and nobody's complained yet."],
    ['Patches', 'So here is how it all works. Through that gate is the Street. Past that, the camps. And past the camps you will find the—'],
  ], () => {
    // Buck streaks through mid-sentence.
    state.mode = 'streak'; state.buckS = 0;
    buck.root.visible = censor.sprite.visible = true;
    $('shout').classList.add('show');
    setTimeout(() => $('shout').classList.remove('show'), 2300);
  });
}
function afterStreak() {
  state.mode = 'patches2';
  say([
    ['Patches', '...ah. That’s Buck. He does that.'],
    ['Patches', 'Tell you what, family — go after him. Knows these grounds better than anybody, even if he’s got no idea he’s givin’ you the tour. Just don’t lose him.'],
  ], () => {
    state.mode = 'chase'; state.canMove = true;
    quest('Bare Witness', [['street', 'Chase Buck down Shakedown Street'], ['camp', 'Follow him through the Campgrounds'], ['stage', 'Keep up past the Main Stage'], ['river', 'Corner him at the River']]);
    banner('New quest: Bare Witness');
    $('prompt').innerHTML = 'Hold <kbd>Shift</kbd> to sprint'; $('prompt').classList.remove('hidden');
    setTimeout(() => $('prompt').classList.add('hidden'), 4500);
  });
}
function talkToBuck() {
  state.mode = 'ending'; state.canMove = false;
  $('prompt').classList.add('hidden');
  tick('river');
  say([
    ['???', 'Oh — hey, family. Beautiful day, huh?'],
    ['Free Spirit / Buck', 'You’re drippin’, kid. Drink some water.'],
  ], () => {
    state.mode = 'done'; state.thirst = 0.15;
    play(buck, 'Walk');
    $('tour').innerHTML = [...state.zonesSeen].map((z) => `<li>${z}</li>`).join('');
    setTimeout(() => $('done').classList.remove('hidden'), 2600);
  });
}

// ---------------------------------------------------------------- input
window.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT') return;
  keys[e.code] = true;
  if (e.code === 'KeyE' || e.code === 'Space' || e.code === 'Enter') {
    if (state.dialogue) advance();
    else if (state.mode === 'riverwait' && !$('prompt').classList.contains('hidden')) talkToBuck();
    e.preventDefault();
  }
});
window.addEventListener('keyup', (e) => { keys[e.code] = false; });
$('dialogue').addEventListener('click', advance);
$('again').onclick = () => location.reload();
let drag = null;
$('view').addEventListener('pointerdown', (e) => { drag = { x: e.clientX, y: e.clientY }; $('view').setPointerCapture(e.pointerId); });
$('view').addEventListener('pointerup', () => { drag = null; });
$('view').addEventListener('pointermove', (e) => {
  if (!drag) return;
  const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
  drag = { x: e.clientX, y: e.clientY };
  if (state.mode === 'creator') player.root.rotation.y += dx * 0.01;
  else { cam.yaw -= dx * 0.005; cam.pitch = clamp(cam.pitch + dy * 0.004, -0.05, 0.9); }
});

// ---------------------------------------------------------------- per-frame updates
function movePlayer(dt) {
  let f = 0, r = 0;
  if (state.canMove) {
    f = (keys.KeyW || keys.ArrowUp ? 1 : 0) - (keys.KeyS || keys.ArrowDown ? 1 : 0);
    r = (keys.KeyD ? 1 : 0) - (keys.KeyA ? 1 : 0);
    if (keys.ArrowLeft) cam.yaw += dt * 1.9;
    if (keys.ArrowRight) cam.yaw -= dt * 1.9;
  }
  const moving = f || r;
  const sprint = moving && (keys.ShiftLeft || keys.ShiftRight);
  if (moving) {
    const dx = -Math.sin(cam.yaw) * f + Math.cos(cam.yaw) * r, dz = -Math.cos(cam.yaw) * f - Math.sin(cam.yaw) * r;
    const len = Math.hypot(dx, dz), speed = sprint ? 6.6 : 2.3;
    const p = player.root.position, oldZ = p.z;
    p.x += dx / len * speed * dt; p.z += dz / len * speed * dt;
    faceTo(player.root, dx, dz, dt, 12);
    for (const c of colliders) {
      const ox = p.x - c.x, oz = p.z - c.z, d = Math.hypot(ox, oz), min = c.r + 0.35;
      if (d < min && d > 0.0001) { p.x = c.x + ox / d * min; p.z = c.z + oz / d * min; }
    }
    if (Math.abs(p.x) > 4.7 && (oldZ + 13) * (p.z + 13) <= 0) p.z = oldZ; // the fence beside the gate
    p.x = clamp(p.x, -72, 72); p.z = clamp(p.z, -164.5, 36);
    if (sprint) state.thirst = Math.min(0.97, state.thirst + dt * 0.016);
  }
  play(player, moving ? (sprint ? 'Run' : 'Walk') : 'Idle');
}
function moveBuck(dt) {
  const p = player.root.position, b = buck.root.position;
  const gap = Math.hypot(p.x - b.x, p.z - b.z);
  let speed = 0;
  if (state.mode === 'streak') speed = 7.4;
  else if (state.mode === 'patches2') speed = state.buckS < 62 ? 7.4 : 0;
  else if (state.mode === 'chase') speed = gap < 8 ? 7.6 : gap < 21 ? THREE.MathUtils.mapLinear(gap, 8, 21, 7.6, 2.4) : 0;
  if (state.buckS >= ROUTE_LEN - 0.5) speed = 0;
  state.buckSpeed = THREE.MathUtils.lerp(state.buckSpeed, speed, Math.min(1, dt * 4));
  state.buckS = Math.min(ROUTE_LEN - 0.4, state.buckS + state.buckSpeed * dt);
  const u = state.buckS / ROUTE_LEN;
  route.getPointAt(u, b);
  if (state.mode === 'done') { b.x += (state.t - state.doneAt) * 1.1; faceTo(buck.root, 1, 0, dt, 3); }
  else if (state.buckSpeed > 0.3) { route.getTangentAt(u, tmp); faceTo(buck.root, tmp.x, tmp.z, dt, 9); }
  else if (state.mode === 'riverwait') faceTo(buck.root, -0.5, -0.85, dt, 3); // gazing at the low sun
  else if (state.mode === 'ending') faceTo(buck.root, p.x - b.x, p.z - b.z, dt, 4);
  if (state.mode !== 'done') {
    play(buck, state.buckSpeed > 0.6 ? 'Run' : 'Idle', 0.3);
    buck.actions.Run.timeScale = clamp(state.buckSpeed / 6.2, 0.6, 1.25);
  }
  if (state.mode === 'streak' && state.buckS > 46) afterStreak();
  if (state.mode === 'chase' && state.buckS >= ROUTE_LEN - 0.6) { state.mode = 'riverwait'; }
  if (state.mode === 'riverwait') {
    const near = gap < 3.6;
    $('prompt').innerHTML = '<kbd>E</kbd> Talk';
    $('prompt').classList.toggle('hidden', !near);
  }
  // Float the censor just in front of his hips, on the camera's side, so nearer things still cover it.
  buck.bones.Hips.getWorldPosition(hips);
  hips.addScaledVector(tmp.copy(camera.position).sub(hips).normalize(), 0.3);
  censor.update(dt, hips, state.buckSpeed);
}
function updateCamera(dt) {
  const p = player.root.position;
  if (state.mode === 'creator') {
    const narrow = window.innerWidth < 760;
    camera.position.set(narrow ? 0 : -0.55, 1.2, narrow ? -2.4 : -1.7);
    camera.lookAt(narrow ? 0 : -0.55, narrow ? 0.45 : 0.98, 1.5);
    return;
  }
  const h = 1.5 * look.height / 100;
  const cp = Math.cos(cam.pitch);
  tmp.set(p.x + Math.sin(cam.yaw) * cp * cam.dist, h + Math.sin(cam.pitch) * cam.dist + 0.2, p.z + Math.cos(cam.yaw) * cp * cam.dist);
  camera.position.lerp(tmp, Math.min(1, dt * 9));
  camera.lookAt(p.x, h, p.z);
}
const clock = new THREE.Clock();
function frame() {
  update(Math.min(0.05, clock.getDelta()));
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}
function update(dt) {
  state.t += dt;
  if (state.mode !== 'load') {
    if (state.mode !== 'creator' && state.mode !== 'intro') movePlayer(dt);
    const p = player.root.position;
    if (state.mode === 'arrive' && Math.hypot(p.x - patches.root.position.x, p.z - patches.root.position.z) < 4.6) beginWelcome();
    if (['streak', 'patches2', 'chase', 'riverwait', 'ending', 'done'].includes(state.mode)) {
      if (state.mode === 'done' && state.doneAt === undefined) state.doneAt = state.t;
      moveBuck(dt);
    }
    if (state.mode !== 'creator' && state.mode !== 'intro') {
      const z = zoneAt(p.x, p.z);
      if (z !== state.zone) {
        state.zone = z; state.zonesSeen.add(z);
        if (state.mode !== 'arrive' || z !== 'The Parking Lot') banner(z);
        if (state.mode === 'chase') { if (z === 'The Campgrounds') tick('street'); if (z === 'Main Stage Field') tick('camp'); if (z === 'The River') tick('stage'); }
      }
      if (patches && ['arrive', 'welcome', 'streak', 'patches2'].includes(state.mode)) faceTo(patches.root, p.x - patches.root.position.x, p.z - patches.root.position.z, dt, 3);
      if (state.mode === 'welcome' || state.mode === 'patches2') faceTo(player.root, patches.root.position.x - p.x, patches.root.position.z - p.z, dt, 5);
      if (state.mode === 'streak') {
        // Everyone watches him go: turn the player and swing the camera round to follow Buck.
        const b = buck.root.position;
        faceTo(player.root, b.x - p.x, b.z - p.z, dt, 6);
        let d = Math.atan2(p.x - b.x, p.z - b.z) - cam.yaw;
        d = Math.atan2(Math.sin(d), Math.cos(d));
        cam.yaw += d * Math.min(1, dt * 3.5);
      }
      if (state.mode === 'ending') faceTo(player.root, buck.root.position.x - p.x, buck.root.position.z - p.z, dt, 5);
    }
    for (const ch of [player, patches, buck, vinny]) if (ch) ch.mixer.update(dt);
    updateCamera(dt);
    sun.target.position.copy(p);
    sun.position.copy(p).addScaledVector(SUN_DIR, 70);
    $('thirst').style.width = `${state.thirst * 100}%`;
    $('thirst').style.background = state.thirst > 0.7 ? '#ff5d8f' : '#3aa0ff';
  }
  for (const s of spinners) s.rotation.y += dt * 1.2;
  if (crowd) {
    const m = new THREE.Matrix4();
    crowd.userData.spots.forEach((s, i) => {
      const y = Math.abs(Math.sin(state.t * 3.4 + s.ph)) * (s.x < -40 ? 0.16 : 0.03);
      m.makeTranslation(s.x, 0.72 + y, s.z); crowd.setMatrixAt(i, m);
      m.makeTranslation(s.x, 1.62 + y, s.z); crowd.userData.head.setMatrixAt(i, m);
    });
    crowd.instanceMatrix.needsUpdate = crowd.userData.head.instanceMatrix.needsUpdate = true;
  }
  if (water) water.material.opacity = 0.86 + Math.sin(state.t * 1.3) * 0.05;
}

// ---------------------------------------------------------------- boot
async function boot() {
  const steps = 8; let n = 0;
  const step = (msg) => { n++; $('bar').firstElementChild.style.width = `${n / steps * 100}%`; $('loadmsg').textContent = msg; };
  const skyTex = await new THREE.TextureLoader().loadAsync('./assets/sky.jpg'); step('Painting the sky…');
  buildSky(skyTex); water = buildGround(); buildWorld(); step('Pitching tents…');

  player = await loadCharacter('./assets/player.glb'); step('Waking you up…');
  const idle = (await loader.loadAsync('./assets/player-idle.glb')).animations[0]; step('Stretching…');
  const run = (await loader.loadAsync('./assets/player-run.glb')).animations[0]; step('Lacing up…');
  addAction(player, 'Walk', prepClip(player.clips[0], 'Walk'), 1.15);
  addAction(player, 'Idle', prepClip(idle, 'Idle'));
  addAction(player, 'Run', prepClip(run, 'Run'), 1.05);
  setupPlayerMaterials();
  scene.add(player.root);

  patches = await loadCharacter('./assets/patches.glb'); step('Finding Patches…');
  addAction(patches, 'Idle', prepClip(idle, 'Idle', true));
  patches.root.position.set(1.3, 0, -9.6); patches.root.rotation.y = 0;
  play(patches, 'Idle'); scene.add(patches.root); solid(1.3, -9.6, 0.45);

  buck = await loadCharacter('./assets/buck.glb'); step('Losing Buck’s clothes…');
  addAction(buck, 'Run', prepClip(buck.clips[0], 'Run'));
  addAction(buck, 'Idle', prepClip(idle, 'Idle', true));
  addAction(buck, 'Walk', prepClip(player.clips[0], 'Walk', true));
  buck.root.visible = false; scene.add(buck.root);
  censor = makeCensor(); censor.sprite.visible = false; scene.add(censor.sprite);

  try {
    vinny = await loadCharacter('./assets/vinny.glb');
    addAction(vinny, 'Idle', prepClip(idle, 'Idle', true));
    vinny.root.position.set(6.2, 0, -60.6); vinny.root.rotation.y = -Math.PI / 2;
    play(vinny, 'Idle'); scene.add(vinny.root); solid(6.2, -60.6, 0.45);
  } catch (e) { console.warn('Vinny not loaded', e); }
  step('Ready');

  buildCreatorUI(); sync();
  startCreator();
  window.__game = { state, look, player, buck, patches, cam, keys, sync, startGame, advance, step: (n, dt = 1 / 30) => { for (let i = 0; i < n; i++) update(dt); renderer.render(scene, camera); } };
  frame();
}
boot().catch((e) => { console.error(e); $('loadmsg').textContent = 'Could not load: ' + e.message; });

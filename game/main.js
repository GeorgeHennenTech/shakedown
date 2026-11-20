// SHAKEDOWN: "Bare Witness" opening prototype.
// Character creator -> the parking lot -> Patches' welcome -> Buck streaks past -> chase him to the river.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createGraphics } from './gfx.js?v=6';
import { createLife, readSave, saveLabel } from './life.js?v=97';
import { createPortrait } from './portrait.js?v=2';
import { createSound } from './sound.js?v=1';
import { clone as cloneSkinned } from 'three/addons/utils/SkeletonUtils.js';
import { createCookView } from './cook.js?v=9';
import { createPan } from './pan.js?v=5';
import { createFishing } from './fish.js?v=2';
import { createDecks } from './decks.js?v=5';
import { createCrowd } from './crowd.js?v=3';
const BUILD = new URL(import.meta.url).searchParams.get('v') || '?';
document.title = `SHAKEDOWN · build ${BUILD}`; // in the window's title bar and the top-right corner: check it against the build number you were told
{ const tag = document.createElement('div'); tag.textContent = `build ${BUILD}`; tag.style.cssText = 'position:fixed;right:8px;top:5px;z-index:99;pointer-events:none;font:700 12px ui-monospace,Menlo,monospace;color:#fff;text-shadow:0 1px 3px #000,0 0 2px #000'; document.body.appendChild(tag); }

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
const portrait = createPortrait({ renderer, scene, canvas: $('face') });
const sound = createSound();
for (const ev of ['keydown', 'mousedown']) window.addEventListener(ev, () => sound.start()); // browsers only allow sound after a key or click
let soundClock = 0, crowdNear = 0;
const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 900);
function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  if (gfx) gfx.resize();
}
let gfx = null; // set up in boot(), once the sky exists
let life = null; // needs, clock, camp and hustles
let cookView = null; // the first-person stove
window.addEventListener('resize', resize);
resize();

const hemi = new THREE.HemisphereLight(0xffe2c4, 0x6b7a4a, 0.95), ambient = new THREE.AmbientLight(0xffd9c2, 0.22);
scene.add(hemi, ambient);
const sun = new THREE.DirectionalLight(0xffc48a, 2.3);
const SUN_DIR = new THREE.Vector3(-0.45, 0.5, -0.74).normalize(); // low in the north, over the river
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -28, right: 28, top: 28, bottom: -28, near: 1, far: 160 });
sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.035; sun.shadow.radius = 2.5;
scene.add(sun, sun.target);

const groundWet = { value: 0 }; // 0 dry, 1 soaked: the ground shader and the light pools read it
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
  [-31, -101], [-44, -111], [-48, -124], [-47, -138],
  [-37, -149], [-20, -152], [-7, -154], [0, -158], [0, -160.5],
];
const route = new THREE.CatmullRomCurve3(ROUTE.map(([x, z]) => new THREE.Vector3(x, 0, z)), false, 'catmullrom', 0.5);
const ROUTE_LEN = route.getLength();
const nearRoute = (x, z, d) => routeSamples.some((p) => (p.x - x) ** 2 + (p.z - z) ** 2 < d * d);
const routeSamples = route.getSpacedPoints(160);

// ---------------------------------------------------------------- ground + sky
const GROUND = { size: 420, cz: -70 };
function buildGround(grass, dirt) {
  // A low-resolution mask says where the ground is grass, path, gravel or sand; the painted
  // grass and dirt textures are tiled at full detail and blended by that mask in the shader.
  const N = 1024, c = document.createElement('canvas');
  c.width = c.height = N;
  const g = c.getContext('2d');
  const px = (x) => (x + GROUND.size / 2) / GROUND.size * N;
  const pz = (z) => (z - GROUND.cz + GROUND.size / 2) / GROUND.size * N;
  const m = (d) => d / GROUND.size * N;
  g.fillStyle = '#000080'; g.fillRect(0, 0, N, N);
  g.globalCompositeOperation = 'lighter';
  // blue channel: broad light and dark patches so the tiling never reads as a grid
  for (let i = 0; i < 500; i++) {
    g.fillStyle = Math.random() < 0.5 ? 'rgba(0,0,90,0.25)' : 'rgba(0,0,0,0)';
    g.beginPath(); g.ellipse(rand(0, N), rand(0, N), rand(10, 60), rand(8, 40), rand(0, 3), 0, 7); g.fill();
  }
  g.filter = 'blur(3px)';
  // red channel: dirt. The trodden path follows Buck's route.
  const stroke = (w, a) => {
    g.strokeStyle = `rgba(255,0,0,${a})`; g.lineWidth = m(w); g.lineCap = g.lineJoin = 'round';
    g.beginPath();
    routeSamples.slice(18).forEach((p, i) => (i ? g.lineTo(px(p.x), pz(p.z)) : g.moveTo(px(p.x), pz(p.z))));
    g.stroke();
  };
  stroke(8, 0.3); stroke(5, 0.5); stroke(3, 0.6);
  g.strokeStyle = 'rgba(255,0,0,0.85)'; g.lineWidth = m(11); g.lineCap = 'round';
  g.beginPath(); g.moveTo(px(0), pz(-12)); g.lineTo(px(0), pz(-66)); g.stroke(); // Shakedown Street
  g.fillStyle = 'rgba(255,0,0,0.9)'; g.beginPath(); g.roundRect(px(-25), pz(-12), m(50), m(49), m(6)); g.fill(); // the lot
  for (let i = 0; i < 60; i++) { g.fillStyle = 'rgba(255,0,0,0.35)'; g.beginPath(); g.arc(px(rand(-22, 46)), pz(rand(-118, -72)), m(rand(1.5, 3.5)), 0, 7); g.fill(); } // worn camp patches
  g.fillStyle = 'rgba(255,0,0,0.55)'; g.fillRect(px(-60), pz(-136), m(11), m(30)); // the pit in front of the stage
  // green channel: pale sand along the river
  g.fillStyle = 'rgba(0,255,0,1)'; g.fillRect(0, pz(-187), N, m(25));
  g.filter = 'none'; g.globalCompositeOperation = 'source-over';
  const mask = new THREE.CanvasTexture(c);
  for (const t of [grass, dirt]) { t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8; }
  grass.repeat.set(110, 110);
  const mat = new THREE.MeshLambertMaterial({ map: grass });
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uWet = groundWet;
    shader.uniforms.tDirt = { value: dirt };
    shader.uniforms.tMask = { value: mask };
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform sampler2D tDirt; uniform sampler2D tMask; uniform float uWet;')
      .replace('#include <map_fragment>', `
        { vec2 uvWorld = vMapUv / 110.0;
          vec4 k = texture2D(tMask, uvWorld);
          vec3 grassC = texture2D(map, vMapUv).rgb * mix(0.8, 1.16, k.b) * vec3(0.9, 1.0, 0.84);
          vec3 dirtC = texture2D(tDirt, vMapUv * 1.6).rgb;
          dirtC = mix(dirtC, vec3(dot(dirtC, vec3(0.3, 0.59, 0.11))), 0.4) * vec3(1.12, 1.08, 0.98);
          vec3 sandC = dirtC * vec3(1.28, 1.2, 0.98);
          float edge = texture2D(tDirt, vMapUv * 0.12).r - 0.5; // ragged path edges
          float d = smoothstep(0.32, 0.62, k.r + edge * 0.35);
          vec3 c = mix(grassC, dirtC, d);
          c = mix(c, sandC, smoothstep(0.3, 0.7, k.g + edge * 0.3));
          c = mix(c, c * vec3(0.56, 0.62, 0.72), uWet * (0.55 + 0.45 * d)); // rain darkens the ground, the bare dirt most of all
          diffuseColor.rgb *= c; }`);
  };
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(GROUND.size, GROUND.size), mat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.z = GROUND.cz;
  ground.receiveShadow = true;
  scene.add(ground);

  const water = new THREE.Mesh(new THREE.PlaneGeometry(GROUND.size, 18),
    new THREE.MeshPhongMaterial({ color: 0x2aa7b8, emissive: 0x0c4a55, shininess: 120, specular: 0xffd9a0, transparent: true, opacity: 0.9 }));
  water.rotation.x = -Math.PI / 2;
  water.position.set(0, 0.06, -175);
  scene.add(water);
  return { water, maskCanvas: c, mask };
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
  return sky;
}

// ---------------------------------------------------------------- props
// Every prop is a painted reference turned into a 3D model (see art/props). "fit" says which
// dimension "size" sets in metres: h = height, l = longest side. "yaw" turns the model so its
// front faces +z. "col" lists collision circles as [along-x, along-z, radius] in the prop's own space.
const PROPS = {
  pine: { fit: 'h', size: 11, col: [[0, 0, 0.5]] },
  oak: { fit: 'h', size: 8.5, col: [[0, 0, 0.8]] },
  pinehi: { fit: 'h', size: 11, col: [[0, 0, 0.5]] }, // fuller versions for trees you can walk up to
  oakhi: { fit: 'h', size: 8.5, col: [[0, 0, 0.8]] },
  hatchback: { fit: 'l', size: 3.9, col: [[0, 1, 1.05], [0, -1, 1.05]] },
  wagon: { fit: 'l', size: 4.7, col: [[0, 1.2, 1.1], [0, -1.2, 1.1]] },
  campervan: { fit: 'l', size: 4.5, col: [[0, 1.1, 1.15], [0, -1.1, 1.15]] },
  rv: { fit: 'l', size: 7.6, col: [[0, 2.4, 1.35], [0, 0, 1.35], [0, -2.4, 1.35]] },
  dometent: { fit: 'l', size: 2.9, col: [[0, 0, 1.3]] },
  ridgetent: { fit: 'l', size: 3.0, col: [[0, 0, 1.3]] },
  canopy: { fit: 'l', size: 3.6, col: [[0, 0, 1.5]] },
  foodstall: { fit: 'l', size: 4.2, col: [[-1.2, 0, 1.3], [1.2, 0, 1.3]] },
  merchstall: { fit: 'l', size: 4.2, col: [[-1.2, 0, 1.3], [1.2, 0, 1.3]] },
  potty: { fit: 'h', size: 2.35, col: [[0, 0, 0.8]] },
  stage: { fit: 'l', size: 27, col: [[-8, -2, 6], [0, -2, 6.5], [8, -2, 6]] },
  tank: { fit: 'h', size: 2.7, col: [[0, 0, 0.5]] },
  freepile: { fit: 'l', size: 4.8, col: [[0, 0, 1.9]] },
  gatepost: { fit: 'h', size: 7.4, col: [[0, 0, 0.7]] },
  totem: { fit: 'h', size: 4.8, col: [] },
  campset: { fit: 'l', size: 3.2, col: [[0, 0, 1.2]] },
  fence: { fit: 'l', size: 3.05, col: [] },
  bush: { fit: 'l', size: 1.7, col: [] },
  rock: { fit: 'l', size: 2.1, col: [[0, 0, 0.8]] },
  teepee: { fit: 'h', size: 6.2, col: [[0, 0, 1.9]] },
  dome: { fit: 'l', size: 12, col: [[-2.6, -1, 3.2], [2.6, -1, 3.2], [0, -3, 3.2]] },
  chilltent: { fit: 'l', size: 8.5, col: [[-2.6, -1.2, 1.6], [2.6, -1.2, 1.6]] },
  soundbath: { fit: 'l', size: 4.6, col: [[0, 0, 1.5]] },
  spiral: { fit: 'l', size: 8, col: [] },
  apothecary: { fit: 'l', size: 4.2, col: [[-1.2, 0, 1.3], [1.2, 0, 1.3]] },
  person1: { fit: 'h', size: 1.86, col: [[0, 0, 0.35]] },
  person2: { fit: 'h', size: 1.7, col: [[0, 0, 0.35]] },
  person3: { fit: 'h', size: 1.84, col: [[0, 0, 0.35]] },
  person4: { fit: 'h', size: 1.66, col: [[0, 0, 0.35]] },
};
const YAW = {}; // filled from assets/props/yaw.json
const placed = {}; // prop name -> list of instances
function hueShader(material) {
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float aHue; varying float vHue;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvHue = aHue;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying float vHue;')
      .replace('#include <map_fragment>', `#include <map_fragment>
        { vec3 k = vec3(0.57735); float cs = cos(vHue), sn = sin(vHue); vec3 c = diffuseColor.rgb;
          diffuseColor.rgb = c * cs + cross(k, c) * sn + k * dot(k, c) * (1.0 - cs); }`);
  };
  return material;
}
async function loadProps(onStep) {
  Object.assign(YAW, await (await fetch('./assets/props/yaw.json')).json());
  await Promise.all(Object.keys(PROPS).map(async (name) => {
    let gltf;
    try { gltf = await loader.loadAsync(`./assets/props/${name}.glb`); } catch (e) { console.warn(`prop ${name} is missing`); return; }
    let src = null;
    gltf.scene.updateMatrixWorld(true);
    gltf.scene.traverse((o) => { if (o.isMesh && !src) src = o; });
    const geo = src.geometry.clone().applyMatrix4(src.matrixWorld);
    geo.rotateY((YAW[name] || 0) * Math.PI / 180);
    geo.computeBoundingBox();
    const b = geo.boundingBox, size = b.getSize(new THREE.Vector3());
    const s = PROPS[name].size / (PROPS[name].fit === 'h' ? size.y : Math.max(size.x, size.z));
    geo.translate(-(b.min.x + b.max.x) / 2, -b.min.y, -(b.min.z + b.max.z) / 2).scale(s, s, s);
    PROPS[name].geo = geo;
    PROPS[name].mat = hueShader(new THREE.MeshStandardMaterial({ map: src.material.map, roughness: 0.9, metalness: 0, side: THREE.DoubleSide, envMapIntensity: 0.38 }));
    PROPS[name].height = size.y * s;
  }));
  onStep();
}
// Queue one instance of a prop. far = too distant to bother casting a shadow.
function put(name, x, z, rot = 0, scale = 1, hue = 0, far = false, y = 0) {
  if (!PROPS[name].geo) return; // model not made yet
  const key = far ? name + '#far' : name;
  (placed[key] ||= []).push({ x, y, z, rot, scale, hue });
  if (!far) for (const [cx, cz, r] of PROPS[name].col) {
    const c = Math.cos(rot), s = Math.sin(rot);
    solid(x + (cx * c + cz * s) * scale, z + (-cx * s + cz * c) * scale, r * scale);
  }
}
const instanced = {};
function buildInstances() {
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0);
  for (const [key, list] of Object.entries(placed)) {
    const name = key.split('#')[0], far = key.endsWith('#far');
    const geo = PROPS[name].geo.clone();
    geo.setAttribute('aHue', new THREE.InstancedBufferAttribute(new Float32Array(list.map((i) => i.hue)), 1));
    const im = new THREE.InstancedMesh(geo, PROPS[name].mat, list.length);
    list.forEach((i, n) => {
      q.setFromAxisAngle(up, i.rot);
      m.compose(new THREE.Vector3(i.x, i.y, i.z), q, new THREE.Vector3(i.scale, i.scale, i.scale));
      im.setMatrixAt(n, m);
    });
    im.castShadow = !far; im.receiveShadow = true; im.frustumCulled = false;
    scene.add(im);
    instanced[key] = { mesh: im, list };
  }
}
function signBoard(text, x, y, z, rot, w = 3.4, h = 0.72, opts = {}) {
  // two faces back to back, so the words read the right way round from either side (one two-sided face reads mirrored from behind)
  const s = new THREE.Group(), mat = new THREE.MeshBasicMaterial({ map: signTexture(text, opts) });
  for (const turn of [0, Math.PI]) { const face = mesh(new THREE.PlaneGeometry(w, h), mat, 0, 0, turn ? -0.012 : 0.012, s); face.rotation.y = turn; face.castShadow = false; }
  s.position.set(x, y, z); s.rotation.y = rot; scene.add(s);
  return s;
}
const bulbSpots = []; // where string-light bulbs hang
function bunting(x1, x2, z, y = 4.6) {
  const cols = [0xff5d8f, 0xffc93c, 0x2ec4b6, 0x5b3fa0, 0xff7b54];
  const tri = new THREE.ConeGeometry(0.22, 0.45, 3, 1);
  const n = Math.round(Math.abs(x2 - x1) / 0.55);
  for (let i = 0; i <= n; i++) {
    const t = i / n, sag = Math.sin(t * Math.PI) * 0.6;
    const f = mesh(tri, lambert(cols[i % cols.length]), x1 + (x2 - x1) * t, y - sag, z);
    f.rotation.x = Math.PI; f.castShadow = false;
    if (i % 2 === 0) bulbSpots.push([x1 + (x2 - x1) * t, y - sag + 0.3, z]);
  }
  for (const x of [x1, x2]) mesh(new THREE.CylinderGeometry(0.06, 0.08, y + 0.2, 6), lambert(0x6b4a2b), x, (y + 0.2) / 2, z);
}
// ---- the funky camp (Seth's look, design/decisions.md "The camp look is locked"): leopard, pink tiger, purple zebra,
// patchwork velvet, quilted pink, shag, glossy black, walnut and gold, painted here in code and wrapped on the plain shapes.
// Loud heroes get the patterns; working pieces are black or walnut with one pattern and gold hardware.
const FUNK = { leopard: ['#e3b452', '#8a5a26', '#17111f'], tiger: ['#ff3d9a', '#17111f'], zebra: ['#8a3fd1', '#fff3d6'], patch: ['#6b2d8f', '#c2255c', '#e8a33d', '#1f8a8a', '#7a2331', '#3b2416'],
  quilt: ['#ff3d9a', '#c2187a', '#ffd23f'], shag: ['#ff3d9a', '#ff7fc0', '#d91c7c'], velvet: ['#5b2a86', '#7a3fb0'], black: 0x1b1622, walnut: 0x4a2f1c, gold: 0xe0aa2a };
const funkCache = {};
function funkTex(kind) {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const g = c.getContext('2d'), N = 256, col = FUNK[kind];
  let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  g.fillStyle = col[0]; g.fillRect(0, 0, N, N);
  if (kind === 'leopard') {
    for (let i = 0; i < 32; i++) { const x = rnd() * N, y = rnd() * N, r = 8 + rnd() * 8, a = rnd() * 3;
      for (const [ox, oy] of [[0, 0], [N, 0], [-N, 0], [0, N], [0, -N]]) { g.fillStyle = col[1]; g.beginPath(); g.ellipse(x + ox, y + oy, r, r * 0.8, a, 0, 7); g.fill(); g.strokeStyle = col[2]; g.lineWidth = 5; g.beginPath(); g.ellipse(x + ox, y + oy, r + 3, r * 0.8 + 3, a, 0.4, 2.5); g.stroke(); g.beginPath(); g.ellipse(x + ox, y + oy, r + 3, r * 0.8 + 3, a, 3.5, 5.7); g.stroke(); } }
  } else if (kind === 'tiger' || kind === 'zebra') {
    g.strokeStyle = col[1]; g.lineCap = 'round';
    for (let y = 0; y < N; y += 32) for (const yy of [y, y + N, y - N]) for (const side of [0, 1]) { g.lineWidth = 9 + ((y * 7) % 8); g.beginPath(); const x0 = side ? N + 10 : -10, x1 = N / 2 + ((y * 13) % 60) - 30; g.moveTo(x0, yy + 4); g.quadraticCurveTo((x0 + x1) / 2, yy + ((y * 5) % 24) - 6, x1, yy + 20); g.stroke(); }
  } else if (kind === 'patch') {
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { g.fillStyle = col[(i * 5 + j * 3 + ((i * j) % 2)) % col.length]; g.fillRect(i * 64, j * 64, 64, 64); g.strokeStyle = 'rgba(255,243,214,.75)'; g.lineWidth = 2; g.setLineDash([6, 5]); g.strokeRect(i * 64 + 4, j * 64 + 4, 56, 56); }
    g.setLineDash([]);
  } else if (kind === 'quilt') {
    g.strokeStyle = col[1]; g.lineWidth = 5;
    for (let k = -N; k <= N * 2; k += 64) { g.beginPath(); g.moveTo(k, 0); g.lineTo(k + N, N); g.stroke(); g.beginPath(); g.moveTo(k, 0); g.lineTo(k - N, N); g.stroke(); }
    g.fillStyle = col[2]; for (let i = 0; i <= 4; i++) for (let j = 0; j <= 4; j++) { g.beginPath(); g.arc(i * 64, j * 64, 5, 0, 7); g.fill(); g.beginPath(); g.arc(i * 64 + 32, j * 64 + 32, 5, 0, 7); g.fill(); }
  } else if (kind === 'shag') {
    for (let i = 0; i < 2600; i++) { g.strokeStyle = col[1 + (i % 2)]; g.lineWidth = 2; const x = rnd() * N, y = rnd() * N, a = rnd() * 6.3; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * 9, y + Math.sin(a) * 9); g.stroke(); }
  } else if (kind === 'velvet') {
    for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(${rnd() < 0.5 ? '255,255,255' : '0,0,0'},${rnd() * 0.07})`; g.fillRect(rnd() * N, rnd() * N, 3, 14); }
    const sh = g.createLinearGradient(0, 0, N, 0); sh.addColorStop(0, 'rgba(255,255,255,0)'); sh.addColorStop(0.5, 'rgba(255,255,255,.12)'); sh.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = sh; g.fillRect(0, 0, N, N);
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}
// A material in one of the camp's finishes. rx, ry: how many times the pattern repeats across a face.
function funk(kind, rx = 1, ry = 1, extra = {}) {
  const key = `${kind}|${rx}|${ry}|${JSON.stringify(extra)}`;
  if (funkCache[key]) return funkCache[key];
  let m;
  if (kind === 'gold') m = new THREE.MeshLambertMaterial({ color: FUNK.gold, emissive: 0x5a3d00, ...extra });
  else if (kind === 'black' || kind === 'walnut') m = new THREE.MeshLambertMaterial({ color: FUNK[kind], ...extra });
  else { const map = funkTex(kind); map.repeat.set(rx, ry); m = new THREE.MeshLambertMaterial({ map, ...extra }); }
  return (funkCache[key] = m);
}
const campLook = {};
function buildCampLook() {
  const tent = new THREE.Group();
  campLook.tentGroup = tent;
  tent.position.set(CAMP.tent[0], 0, CAMP.tent[1]); tent.rotation.y = 2.5;
  scene.add(tent);
  // the ridge tent's sloping sides: half-width, height, and the outward normal of each slope
  const HW = 1.02, H = 1.62, nrm = (s) => new THREE.Vector3(s * H, HW, 0).normalize();
  const onSlope = (s, t, z, lift) => new THREE.Vector3(s * HW * t, H * (1 - t), z).addScaledVector(nrm(s), lift);
  // lay a flat panel on a slope: its width runs along the tent, its height runs down the slope
  const facing = (m, s) => {
    const along = new THREE.Vector3(0, 0, 1), down = new THREE.Vector3(s * HW, -H, 0).normalize();
    m.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(along, down, new THREE.Vector3().crossVectors(along, down)));
  };
  campLook.patches = new THREE.Group();
  [[1, 0.35, -0.7, 0xff5d8f], [1, 0.62, 0.35, 0xffc93c], [1, 0.45, 0.95, 0x2ec4b6], [-1, 0.4, 0.5, 0x8f6aff], [-1, 0.66, -0.4, 0xff7b54], [-1, 0.3, -0.95, 0xf2efe6]].forEach(([s, t, z, col], i) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(0.34 + (i % 3) * 0.08, 0.3 + (i % 2) * 0.1), new THREE.MeshLambertMaterial({ color: col, side: THREE.DoubleSide }));
    m.position.copy(onSlope(s, t, z, 0.035)); facing(m, s); m.rotateZ(i * 0.5);
    campLook.patches.add(m);
  });
  campLook.fly = new THREE.Group();
  for (const s of [1, -1]) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(2.95, 2.0), funk('leopard', 2, 1.4, { side: THREE.DoubleSide }));
    m.position.copy(onSlope(s, 0.5, 0, 0.09)); facing(m, s); m.castShadow = true;
    campLook.fly.add(m);
    const skin = new THREE.Mesh(new THREE.PlaneGeometry(2.7, 1.86), funk('tiger', 2, 1.4, { side: THREE.DoubleSide })); // your colours over the old canvas, whatever tent you own
    skin.position.copy(onSlope(s, 0.5, 0, 0.05)); facing(skin, s); tent.add(skin);
  }
  const rug = new THREE.Mesh(new THREE.CircleGeometry(1.05, 24), funk('shag', 2, 2)); rug.rotation.x = -Math.PI / 2; rug.position.set(0, 0.025, 2.05); rug.receiveShadow = true; tent.add(rug); // the shag rug at the door
  campLook.porch = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 1.3), funk('velvet', 2, 1, { side: THREE.DoubleSide }));
  campLook.porch.position.set(0, 1.25, 2.1); campLook.porch.rotation.x = -1.15;
  tent.add(campLook.patches, campLook.fly, campLook.porch);

  const cooler = new THREE.Group();
  cooler.position.set(CAMP.cooler[0], 0, CAMP.cooler[1]); cooler.rotation.y = 0;
  mesh(new THREE.BoxGeometry(0.72, 0.4, 0.42), funk('black'), 0, 0.26, 0, cooler);
  mesh(new THREE.BoxGeometry(0.75, 0.08, 0.45), funk('leopard'), 0, 0.5, 0, cooler);
  for (const x of [-0.2, 0.2]) mesh(new THREE.BoxGeometry(0.08, 0.1, 0.03), funk('gold'), x, 0.42, 0.22, cooler); // latches
  campLook.tape = new THREE.Group();
  for (const x of [-0.2, 0.05, 0.24]) mesh(new THREE.BoxGeometry(0.07, 0.085, 0.47), funk('gold'), x, 0.5, 0, campLook.tape).rotation.y = x;
  campLook.wheels = new THREE.Group();
  for (const z of [-0.23, 0.23]) { const w = mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.05, 12), lambert(0x1c1c1c), -0.3, 0.1, z, campLook.wheels); w.rotation.x = Math.PI / 2; }
  const pull = mesh(new THREE.BoxGeometry(0.04, 0.6, 0.04), lambert(0xff3d9a), 0.42, 0.55, 0, campLook.wheels); pull.rotation.z = -0.5;
  cooler.add(campLook.tape, campLook.wheels);
  campLook.cooler = cooler;
  scene.add(cooler);
  solid(CAMP.cooler[0], CAMP.cooler[1], 0.45);
  campLook.coolerSolid = colliders[colliders.length - 1];

  // the workbench: a door on two milk crates, with scrap and tools on it
  const bench = new THREE.Group();
  bench.position.set(CAMP.bench[0], 0, CAMP.bench[1]); bench.rotation.y = Math.PI / 2; // square to the camp, along its left edge
  for (const x of [-0.55, 0.55]) mesh(new THREE.BoxGeometry(0.42, 0.62, 0.42), funk('black'), x, 0.31, 0, bench);
  mesh(new THREE.BoxGeometry(1.7, 0.07, 0.72), funk('walnut'), 0, 0.66, 0, bench);
  mesh(new THREE.BoxGeometry(0.34, 0.1, 0.26), funk('patch', 0.5, 0.5), -0.5, 0.75, 0.1, bench).rotation.y = 0.4; // folded velvet scraps
  mesh(new THREE.BoxGeometry(0.3, 0.06, 0.22), funk('patch', 0.5, 0.5), -0.46, 0.83, 0.08, bench).rotation.y = -0.2;
  mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.07, 12), funk('gold'), 0.1, 0.73, -0.12, bench); // gold thread
  mesh(new THREE.BoxGeometry(0.34, 0.03, 0.05), funk('gold'), 0.5, 0.71, 0.12, bench).rotation.y = 0.5; // scissors
  mesh(new THREE.BoxGeometry(0.34, 0.03, 0.05), funk('gold'), 0.5, 0.71, 0.12, bench).rotation.y = -0.1;
  mesh(new THREE.ConeGeometry(0.1, 0.14, 10, 1, true), lambert(0xff3d9a, { side: THREE.DoubleSide }), 0.72, 0.98, -0.22, bench); mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.26, 5), funk('gold'), 0.72, 0.82, -0.22, bench); // a pink lamp
  scene.add(bench);
  campLook.bench = bench;
  solid(CAMP.bench[0], CAMP.bench[1], 0.7);

  // things you craft that show up at camp
  campLook.shade = new THREE.Group();
  const sx = (CAMP.stove[0] + CAMP.cooler[0]) / 2, sz = (CAMP.stove[1] + CAMP.cooler[1]) / 2;
  for (const [dx, dz, h] of [[-1.7, -1.3, 2.3], [1.7, -1.3, 2.3], [-1.7, 1.3, 1.9], [1.7, 1.3, 1.9]]) mesh(new THREE.CylinderGeometry(0.03, 0.03, h, 6), funk('gold'), sx + dx, h / 2, sz + dz, campLook.shade);
  const tarp = mesh(new THREE.PlaneGeometry(3.5, 2.7), funk('zebra', 2, 1.5, { side: THREE.DoubleSide }), sx, 2.12, sz, campLook.shade);
  tarp.rotation.x = -Math.PI / 2 + 0.15; tarp.castShadow = true;
  campLook.totem = new THREE.Group();
  campLook.totem.position.set(CAMP.tent[0] + 2.6, 0, CAMP.tent[1] + 1.6);
  mesh(new THREE.CylinderGeometry(0.045, 0.055, 3.4, 8), funk('leopard', 1, 6), 0, 1.7, 0, campLook.totem);
  [0xff5d8f, 0xffc93c, 0x2ec4b6, 0x8f6aff, 0xff7b54, 0x7cf29a].forEach((col, i) => {
    const a = i * 1.9, y = 1.5 + i * 0.36;
    mesh(new THREE.SphereGeometry(0.075, 10, 8), new THREE.MeshBasicMaterial({ color: col }), Math.cos(a) * 0.1, y, Math.sin(a) * 0.1, campLook.totem).castShadow = false;
  });
  mesh(new THREE.IcosahedronGeometry(0.24, 1), new THREE.MeshLambertMaterial({ color: 0xdfe8f2, emissive: 0x6a7a90, flatShading: true }), 0, 3.6, 0, campLook.totem).castShadow = false; // a mirror ball
  mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.03, 16), funk('velvet'), 0, 3.82, 0, campLook.totem); mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.16, 12), funk('velvet'), 0, 3.9, 0, campLook.totem); // in a velvet hat
  scene.add(campLook.shade, campLook.totem);

  // the garden: up to six planters in two rows; the sprouts in each grow with its crop
  campLook.plots = [];
  for (let i = 0; i < 6; i++) {
    const planter = new THREE.Group();
    planter.position.set(CAMP.garden[0] - (i % 3) * 1.6, 0, CAMP.garden[1] - Math.floor(i / 3) * 1.15); // two straight rows of three
    mesh(new THREE.BoxGeometry(1.3, 0.34, 0.6), funk('black'), 0, 0.17, 0, planter);
    mesh(new THREE.BoxGeometry(1.32, 0.14, 0.62), funk('leopard', 3, 0.4), 0, 0.17, 0, planter);
    for (const [cx, cz] of [[-0.62, -0.27], [0.62, -0.27], [-0.62, 0.27], [0.62, 0.27]]) mesh(new THREE.BoxGeometry(0.09, 0.36, 0.09), funk('gold'), cx, 0.17, cz, planter);
    const soil = mesh(new THREE.BoxGeometry(1.18, 0.05, 0.48), new THREE.MeshLambertMaterial({ color: 0x6b5238 }), 0, 0.35, 0, planter);
    const sprouts = new THREE.Group(); sprouts.position.y = 0.37;
    const leaf = new THREE.MeshLambertMaterial({ color: 0x5cb85c, flatShading: true }), fruit = new THREE.MeshLambertMaterial({ color: 0xe0392b });
    // one little bed per crop, so a planter looks like what is in it
    const beds = { herbs: new THREE.Group(), tomato: new THREE.Group(), pepper: new THREE.Group(), sage: new THREE.Group() };
    for (let j = 0; j < 9; j++) { // herbs: a low, dense row of leafy tufts
      const x = -0.5 + j * 0.125, z = (j % 2 ? 0.11 : -0.11);
      mesh(new THREE.ConeGeometry(0.075, 0.26, 5), leaf, x, 0.13, z, beds.herbs);
      mesh(new THREE.ConeGeometry(0.05, 0.2, 5), leaf, x + 0.05, 0.1, -z * 0.5, beds.herbs).rotation.z = 0.5;
    }
    for (let j = 0; j < 4; j++) { // tomatoes: tall staked vines hung with round fruit
      const x = -0.44 + j * 0.29, z = (j % 2 ? 0.07 : -0.07);
      mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.78, 5), lambert(0xb08d57), x, 0.39, z, beds.tomato);
      mesh(new THREE.ConeGeometry(0.15, 0.62, 6), leaf, x, 0.34, z, beds.tomato);
      for (const [fx, fy, fz] of [[0.1, 0.2, 0.08], [-0.09, 0.34, 0.07], [0.05, 0.46, -0.08]]) mesh(new THREE.SphereGeometry(0.06, 7, 6), fruit, x + fx, fy, z + fz, beds.tomato);
    }
    for (let j = 0; j < 5; j++) { // peppers: squat bushes with long pods hanging down
      const x = -0.46 + j * 0.23, z = (j % 2 ? 0.08 : -0.08);
      const bush = mesh(new THREE.SphereGeometry(0.13, 7, 5), leaf, x, 0.3, z, beds.pepper); bush.scale.y = 0.8;
      mesh(new THREE.CylinderGeometry(0.015, 0.02, 0.2, 5), leaf, x, 0.1, z, beds.pepper);
      for (const s of [-1, 1]) { const pod = mesh(new THREE.ConeGeometry(0.035, 0.17, 6), fruit, x + s * 0.09, 0.2, z + 0.06, beds.pepper); pod.rotation.x = Math.PI; }
    }
    for (let j = 0; j < 6; j++) { // sage: soft grey mounds with flower spikes
      const x = -0.46 + j * 0.185, z = (j % 2 ? 0.09 : -0.09);
      const mound = mesh(new THREE.SphereGeometry(0.12, 7, 5), leaf, x, 0.12, z, beds.sage); mound.scale.y = 0.9;
      mesh(new THREE.ConeGeometry(0.028, 0.24, 5), fruit, x, 0.34, z, beds.sage);
      mesh(new THREE.ConeGeometry(0.022, 0.18, 5), fruit, x + 0.07, 0.28, z - 0.04, beds.sage);
    }
    for (const b of Object.values(beds)) sprouts.add(b);
    planter.add(sprouts);
    planter.visible = i === 0;
    scene.add(planter);
    campLook.plots.push({ planter, soil, sprouts, leaf, fruit, beds });
  }
  solid(CAMP.garden[0], CAMP.garden[1], 0.6);

  // the produce cabinet by the stove: a crate, then a cabinet, then a larder (gear ladder 'pantry')
  campLook.pantry = [null, null];
  { const [px, pz] = CAMP.pantry;
    const crate = new THREE.Group();
    mesh(new THREE.BoxGeometry(0.8, 0.5, 0.55), funk('black'), 0, 0.25, 0, crate);
    for (const y of [0.14, 0.36]) mesh(new THREE.BoxGeometry(0.84, 0.06, 0.59), funk('gold'), 0, y, 0, crate);
    for (const [x, c] of [[-0.2, 0xe0392b], [0.02, 0x4fbf4a], [0.22, 0xe0392b]]) mesh(new THREE.SphereGeometry(0.09, 7, 6), lambert(c), x, 0.54, 0.05, crate);
    const cabinet = new THREE.Group();
    mesh(new THREE.BoxGeometry(0.9, 1.3, 0.5), funk('black'), 0, 0.65, 0, cabinet);
    for (const x of [-0.22, 0.22]) mesh(new THREE.BoxGeometry(0.4, 1.14, 0.04), funk('quilt', 1, 2.5), x, 0.67, 0.26, cabinet);
    for (const x of [-0.05, 0.05]) mesh(new THREE.SphereGeometry(0.03, 6, 5), lambert(0xffd23f), x, 0.7, 0.3, cabinet);
    const larder = new THREE.Group();
    mesh(new THREE.BoxGeometry(1.7, 1.6, 0.55), funk('black'), 0, 0.8, 0, larder);
    for (const x of [-0.63, -0.21, 0.21, 0.63]) mesh(new THREE.BoxGeometry(0.38, 1.42, 0.04), funk('zebra', 1, 3), x, 0.82, 0.29, larder);
    mesh(new THREE.BoxGeometry(1.8, 0.07, 0.65), funk('gold'), 0, 1.63, 0, larder);
    for (const [x, c] of [[-0.5, 0xe0392b], [-0.3, 0xe0392b], [0.1, 0x4fbf4a], [0.45, 0xe8a33d]]) mesh(new THREE.SphereGeometry(0.1, 7, 6), lambert(c), x, 1.76, 0, larder);
    for (const g of [crate, cabinet, larder]) { g.position.set(px, 0, pz); g.rotation.y = -0.5; g.visible = false; scene.add(g); campLook.pantry.push(g); }
  }
  // the kitchen counter: a plank on two crates, with a sign that goes up when you are open
  campLook.counter = new THREE.Group();
  campLook.counter.position.set(CAMP.counter[0], 0, CAMP.counter[1]); campLook.counter.rotation.y = Math.PI / 2; // side-on to the kitchen, facing the open ground where the queue forms
  mesh(new THREE.BoxGeometry(1.9, 0.07, 0.6), funk('walnut'), 0, 0.95, 0, campLook.counter);
  for (const x of [-0.7, 0.7]) mesh(new THREE.BoxGeometry(0.45, 0.92, 0.5), funk('black'), x, 0.46, 0, campLook.counter);
  for (const z of [-0.27, 0.27]) mesh(new THREE.PlaneGeometry(1.9, 0.9), funk('leopard', 3, 1.4, { side: THREE.DoubleSide }), 0, 0.47, z, campLook.counter); // a leopard skirt, front and back
  mesh(new THREE.BoxGeometry(1.9, 0.09, 0.05), funk('patch', 3, 0.15), 0, 0.9, 0.3, campLook.counter); mesh(new THREE.BoxGeometry(1.9, 0.09, 0.05), funk('patch', 3, 0.15), 0, 0.9, -0.3, campLook.counter); // a patchwork runner along each edge
  { const awn = mesh(new THREE.PlaneGeometry(2.1, 0.9), funk('tiger', 2, 0.8, { side: THREE.DoubleSide }), 0, 3.02, 0, campLook.counter); awn.rotation.x = -Math.PI / 2; awn.castShadow = true; for (const z of [-0.45, 0.45]) mesh(new THREE.BoxGeometry(2.1, 0.1, 0.02), funk('gold'), 0, 2.98, z, campLook.counter); } // the awning and its gold fringe
  for (const x of [-0.92, 0.92]) mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.9, 6), funk('gold'), x, 1.9, 0, campLook.counter); // posts that carry the sign above head height, so whoever is serving can be seen
  campLook.counter.visible = false; scene.add(campLook.counter);
  campLook.openSign = signBoard('KITCHEN OPEN', CAMP.counter[0], 2.62, CAMP.counter[1], Math.PI / 2, 1.7, 0.42, { bg: '#7cf29a' }); campLook.openSign.visible = false;
  campLook.shutSign = signBoard('CLOSED', CAMP.counter[0], 2.62, CAMP.counter[1], Math.PI / 2, 1.2, 0.42, { bg: '#fff3d6' }); campLook.shutSign.visible = false;
  // the mushroom shelf: a log, a bag of straw and a plank of jars
  campLook.myco = new THREE.Group();
  campLook.myco.position.set(CAMP.myco[0], 0, CAMP.myco[1]); campLook.myco.rotation.y = Math.PI / 2;
  mesh(new THREE.CylinderGeometry(0.2, 0.22, 1.2, 10), lambert(0x6b4a2b), -0.5, 0.2, 0, campLook.myco).rotation.z = Math.PI / 2;
  mesh(new THREE.BoxGeometry(0.5, 0.6, 0.4), lambert(0xe2c98a), 0.55, 0.3, 0, campLook.myco);
  mesh(new THREE.BoxGeometry(1.5, 0.05, 0.35), funk('black'), 0, 0.85, -0.3, campLook.myco);
  for (const x of [-0.65, 0.65]) mesh(new THREE.BoxGeometry(0.06, 0.85, 0.06), funk('gold'), x, 0.42, -0.3, campLook.myco);
  for (let k = 0; k < 9; k++) mesh(new THREE.SphereGeometry(0.03, 6, 5), lambert(k % 2 ? 0xff3d9a : 0xffd23f), -0.72, 0.8 - k * 0.085, -0.12, campLook.myco); // a string of beads down one side
  campLook.caps = [];
  for (let i = 0; i < 4; i++) { // one little cluster per growing spot
    const cap = mesh(new THREE.SphereGeometry(0.12, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshLambertMaterial({ color: 0xe8dcc6 }), -0.5 + i * 0.34, i < 2 ? 0.4 : 0.9, i < 2 ? 0 : -0.3, campLook.myco);
    cap.visible = false; campLook.caps.push(cap);
  }
  campLook.myco.visible = false;
  scene.add(campLook.myco);
  // glow jars you set out at camp
  campLook.glow = [];
  for (const [dx, dz] of [[1.6, 1.9], [-1.9, 1.5], [2.4, -0.6], [-1.2, -2.2]]) {
    const jar = mesh(new THREE.SphereGeometry(0.12, 10, 8), new THREE.MeshBasicMaterial({ color: 0x7cf29a }), CAMP.tent[0] + dx, 0.16, CAMP.tent[1] + dz);
    jar.castShadow = false; jar.visible = false; campLook.glow.push(jar);
  }
  // wild mushrooms: a small pool of caps the life system places around the grounds
  for (let i = 0; i < 12; i++) {
    const m = new THREE.Group(), capMat = new THREE.MeshLambertMaterial({ color: 0xf2a61c, emissive: 0x000000 });
    mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.14, 6), lambert(0xf2efe6), 0, 0.07, 0, m);
    mesh(new THREE.SphereGeometry(0.13, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), capMat, 0, 0.13, 0, m);
    mesh(new THREE.CylinderGeometry(0.03, 0.035, 0.1, 6), lambert(0xf2efe6), 0.17, 0.05, 0.06, m);
    mesh(new THREE.SphereGeometry(0.08, 8, 5, 0, Math.PI * 2, 0, Math.PI / 2), capMat, 0.17, 0.09, 0.06, m);
    m.userData.cap = capMat; m.visible = false; scene.add(m); wildMeshes.push(m);
  }

  // the trophy shelf: quest rewards stand here
  const shelf = new THREE.Group(), gold = new THREE.MeshLambertMaterial({ color: 0xffc93c, emissive: 0x6b4a00 });
  shelf.position.set(CAMP.tent[0] - 3.4, 0, CAMP.tent[1] - 0.4); shelf.rotation.y = 0.9;
  campLook.trophy = { grabber: new THREE.Group(), spatula: new THREE.Group(), flag: new THREE.Group(), disco: new THREE.Group() };
  campLook.shelf = mesh(new THREE.BoxGeometry(1.5, 0.06, 0.34), funk('black'), 0, 0.7, 0, shelf);
  for (const x of [-0.6, 0.6]) mesh(new THREE.BoxGeometry(0.08, 0.7, 0.08), funk('gold'), x, 0.35, 0, shelf);
  const gr = campLook.trophy.grabber; // a litter grabber: a stick with a claw
  mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.8, 6), gold, 0, 0.4, 0, gr).rotation.z = 0.25;
  for (const s of [-1, 1]) mesh(new THREE.BoxGeometry(0.03, 0.16, 0.03), gold, 0.1 + s * 0.05, 0.84, 0, gr).rotation.z = s * 0.5;
  gr.position.set(-0.5, 0.73, 0);
  const sp = campLook.trophy.spatula;
  mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.5, 6), gold, 0, 0.25, 0, sp);
  mesh(new THREE.BoxGeometry(0.2, 0.26, 0.02), gold, 0, 0.6, 0, sp);
  sp.position.set(0, 0.73, 0);
  const fl = campLook.trophy.flag;
  mesh(new THREE.CylinderGeometry(0.03, 0.035, 3.2, 6), funk('gold'), 0, 1.6, 0, fl);
  const cloth = mesh(new THREE.PlaneGeometry(0.9, 0.55), funk('velvet', 1, 1, { side: THREE.DoubleSide }), 0.48, 2.85, 0, fl); cloth.castShadow = true;
  mesh(new THREE.PlaneGeometry(0.9, 0.09), funk('leopard', 3, 0.3, { side: THREE.DoubleSide }), 0.48, 2.53, 0, fl); mesh(new THREE.PlaneGeometry(0.9, 0.05), funk('gold', 1, 1, { side: THREE.DoubleSide }), 0.48, 2.47, 0, fl); // a leopard border and a gold fringe
  mesh(new THREE.CircleGeometry(0.15, 12), new THREE.MeshBasicMaterial({ color: 0xffc93c, side: THREE.DoubleSide }), 0.48, 2.85, 0.01, fl);
  fl.position.set(0.72, 0, 0);
  const db = campLook.trophy.disco; // a mirror ball on a little stand
  mesh(new THREE.IcosahedronGeometry(0.16, 1), new THREE.MeshLambertMaterial({ color: 0xdfe8f2, emissive: 0x5a6a80, flatShading: true }), 0, 0.24, 0, db);
  mesh(new THREE.CylinderGeometry(0.02, 0.05, 0.1, 6), gold, 0, 0.05, 0, db);
  db.position.set(0.42, 0.73, 0);
  const vv = campLook.trophy.valve = new THREE.Group(); // the tank valve off Vinny's corner, on a nail
  mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.14, 10), new THREE.MeshLambertMaterial({ color: 0x3d7bd9 }), 0, 0.07, 0, vv);
  mesh(new THREE.TorusGeometry(0.09, 0.02, 6, 14), new THREE.MeshLambertMaterial({ color: 0xd7263d }), 0, 0.17, 0, vv).rotation.x = Math.PI / 2;
  vv.position.set(-0.26, 0.73, 0);
  const mk = campLook.trophy.mink = new THREE.Group(); // Vinny's coat, over a hanger
  mesh(new THREE.BoxGeometry(0.34, 0.5, 0.12), new THREE.MeshLambertMaterial({ color: 0x8a7a66 }), 0, 0.28, 0, mk);
  mesh(new THREE.BoxGeometry(0.4, 0.1, 0.16), new THREE.MeshLambertMaterial({ color: 0x6f6252 }), 0, 0.52, 0, mk);
  mk.position.set(0.2, 0.73, 0);
  shelf.add(gr, sp, fl, db, vv, mk);
  shelf.visible = false;
  campLook.shelfGroup = shelf;
  scene.add(shelf);

  // the tank Whip leaves at your camp
  campLook.tank = new THREE.Group();
  campLook.tank.position.set(CAMP.tank[0], 0, CAMP.tank[1]);
  mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.15, 14), funk('tiger', 2, 2), 0, 0.6, 0, campLook.tank);
  mesh(new THREE.SphereGeometry(0.2, 14, 8), lambert(0xff3d9a), 0, 1.17, 0, campLook.tank);
  mesh(new THREE.CylinderGeometry(0.212, 0.212, 0.36, 14), funk('leopard', 3, 0.8), 0, 0.62, 0, campLook.tank);
  mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.16, 8), funk('gold'), 0, 1.42, 0, campLook.tank);
  mesh(new THREE.BoxGeometry(0.22, 0.05, 0.05), funk('gold'), 0, 1.5, 0, campLook.tank);
  mesh(new THREE.SphereGeometry(0.13, 10, 8), new THREE.MeshLambertMaterial({ color: 0xff5d8f }), 0.3, 1.2, 0.1, campLook.tank); // one filled balloon tied to it
  campLook.tank.visible = false;
  scene.add(campLook.tank);

  // your own corner, if you win it
  campLook.corner = new THREE.Group();
  campLook.corner.add(signBoard('YOUR CORNER', -4.2, 2.1, -64.2, 0, 2.6, 0.6, { bg: '#ffc93c' }));
  mesh(new THREE.CylinderGeometry(0.05, 0.06, 1.9, 6), lambert(0x6b4a2b), -4.2, 0.95, -64.2, campLook.corner);
  mesh(new THREE.BoxGeometry(1.1, 0.5, 0.6), funk('black'), -4.2, 0.25, -63.4, campLook.corner); // a crate to sell from
  mesh(new THREE.BoxGeometry(1.12, 0.2, 0.62), funk('leopard', 3, 0.5), -4.2, 0.25, -63.4, campLook.corner);
  // and the tank you sell from, with a few filled balloons tied to it
  campLook.cornerTank = new THREE.Group(); campLook.cornerTank.position.set(-3.25, 0, -63.5); campLook.corner.add(campLook.cornerTank);
  mesh(new THREE.CylinderGeometry(0.18, 0.18, 1.1, 12), funk('tiger', 2, 2), 0, 0.55, 0, campLook.cornerTank);
  mesh(new THREE.SphereGeometry(0.18, 12, 8), lambert(0xff3d9a), 0, 1.1, 0, campLook.cornerTank);
  mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.14, 8), funk('gold'), 0, 1.32, 0, campLook.cornerTank);
  for (const [x, y, c] of [[-3.4, 1.75, 0xff5d8f], [-3.05, 1.9, 0xffd23f], [-3.2, 2.1, 0x3aa0ff]]) mesh(new THREE.SphereGeometry(0.14, 10, 8), new THREE.MeshLambertMaterial({ color: c }), x, y, -63.5, campLook.corner);
  campLook.corner.visible = false;
  scene.add(campLook.corner);

  // the lot office sign
  signBoard('VENDOR PERMITS $12', PERMIT[0], 1.9, PERMIT[1], 0, 2.6, 0.56, { bg: '#fff3d6' });
  mesh(new THREE.CylinderGeometry(0.05, 0.06, 1.7, 6), lambert(0x6b4a2b), PERMIT[0], 0.85, PERMIT[1]);
  solid(PERMIT[0], PERMIT[1], 0.25);

  // rain: streaks that fall around you
  const DROPS = 900, rp = new Float32Array(DROPS * 6);
  for (let i = 0; i < DROPS; i++) {
    const x = (Math.random() - 0.5) * 28, y = Math.random() * 12, z = (Math.random() - 0.5) * 28;
    rp.set([x, y, z, x + 0.04, y + 0.5, z], i * 6);
  }
  const rg = new THREE.BufferGeometry();
  rg.setAttribute('position', new THREE.BufferAttribute(rp, 3));
  campLook.rain = new THREE.LineSegments(rg, new THREE.LineBasicMaterial({ color: 0xdcebff, transparent: true, opacity: 0.75, fog: false }));
  campLook.rain.frustumCulled = false; campLook.rain.visible = false;
  scene.add(campLook.rain);
  showGear({ tent: 1, stove: 1, cooler: 1 });
}
// Litter in the grass: crushed cans and party cups you can pick up.
const litter = [], healMarks = [], groves = [], wildMeshes = [];
function buildLitter() {
  let seed = 7;
  const r = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const areas = [[-3.5, 3.5, -46, -16, 8], [8, 44, -92, -58, 10], [-12, 12, -6, 8, 4], [-15, -3, -75, -63, 4]]; // the Street, the Campgrounds, the gate, the Free Pile
  for (const [x1, x2, z1, z2, count] of areas) {
    for (let i = 0; i < count; i++) {
      const x = x1 + r() * (x2 - x1), z = z1 + r() * (z2 - z1), g = new THREE.Group();
      if (r() < 0.5) { const can = mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.16, 8), lambert([0xd7263d, 0x3aa0ff, 0xb9c2c9][i % 3]), 0, 0.05, 0, g); can.rotation.z = Math.PI / 2; can.rotation.y = r() * 6; }
      else { const cup = mesh(new THREE.CylinderGeometry(0.06, 0.04, 0.15, 8), lambert(0xd7263d), 0, 0.06, 0, g); cup.rotation.x = 1.3; cup.rotation.y = r() * 6; }
      if (r() < 0.5) mesh(new THREE.BoxGeometry(0.16, 0.01, 0.12), lambert(0xf2efe6), 0.16, 0.02, 0.08, g).rotation.y = r() * 3; // a scrap of paper
      g.position.set(x, 0, z);
      scene.add(g);
      litter.push({ x, z, mesh: g });
    }
  }
}
// The wheeled cooler trails behind you like a little trailer, handle first. Parked, it sits at camp.
function updateCooler() {
  const c = campLook.cooler;
  if (!c) return;
  campLook.coolerSolid.x = state.towing ? 1e6 : CAMP.cooler[0]; // nothing to bump into at camp while the cooler is with you
  if (!state.towing) {
    if (c.userData.towed) { c.userData.towed = false; c.position.set(CAMP.cooler[0], 0, CAMP.cooler[1]); c.rotation.set(0, 0, 0, 'XYZ'); }
    return;
  }
  const p = player.root.position, reach = campModels.cooler ? 1.05 : 0.95;
  let dx = p.x - c.position.x, dz = p.z - c.position.z, d = Math.hypot(dx, dz);
  if (!c.userData.towed || d > 6) { // just picked up, or you were moved: drop it in behind you
    c.userData.towed = true;
    c.position.set(p.x - Math.sin(player.root.rotation.y) * reach, 0, p.z - Math.cos(player.root.rotation.y) * reach);
    dx = p.x - c.position.x; dz = p.z - c.position.z; d = Math.hypot(dx, dz);
  }
  if (d > reach) { c.position.x += dx * (1 - reach / d); c.position.z += dz * (1 - reach / d); }
  if (campModels.cooler) { // the model: its pull handle stands up at the back, so the back faces you and it leans onto its wheels towards your hand
    if (d > 0.01) c.rotation.set(-0.42, Math.atan2(-dx, -dz), 0, 'YXZ');
    c.position.y = 0.06;
  } else {
    if (d > 0.01) c.rotation.y = Math.atan2(-dz, dx); // the painted one: the handle is on its +x side
    c.rotation.z = 0.12; // tipped onto its wheels
  }
}
// Things at camp and in the sky that follow the game state every frame: the crop, the trophies, the rain.
function updateCamp(dt) {
  if (!state.plots || !campLook.rain) return;
  const now = state.day * 24 + state.hour;
  const CROP_LOOK = { herbs: [0x5cb85c, 0x4caf50], tomato: [0x3f9d4a, 0xe0392b], pepper: [0x2f8f45, 0x4fbf4a], sage: [0x9fb8a0, 0xb9a0d8] };
  campLook.plots.forEach((pl, i) => {
    const d = state.plots[i];
    pl.planter.visible = i < Math.max(1, state.plots.length);
    const grow = !d || !d.crop ? 0 : !d.wet ? 0.02 : Math.min(1, 0.15 + 0.85 * (now - d.start) / Math.max(0.01, d.ready - d.start));
    pl.sprouts.visible = !!(d && d.crop); pl.sprouts.scale.set(1, Math.max(0.02, grow), 1);
    pl.soil.material.color.set(d && d.crop && d.wet ? 0x3a2a1c : 0x6b5238);
    for (const k in pl.beds) pl.beds[k].visible = !!d && (pl.beds[d.crop] ? d.crop : 'herbs') === k;
    if (d && d.crop) { const [leaf, fruit] = CROP_LOOK[d.crop] || CROP_LOOK.herbs; pl.leaf.color.setHex(leaf); pl.fruit.color.setHex(grow > 0.7 ? fruit : leaf); }
  });
  campLook.myco.visible = state.gear.myco >= 2;
  const hasCounter = !!state.craft.made.sign; campLook.counter.visible = hasCounter; campLook.openSign.visible = hasCounter && state.kitchen.open; campLook.shutSign.visible = hasCounter && !state.kitchen.open;
  campLook.caps.forEach((c, i) => { const s = state.shrooms[i]; c.visible = !!s; if (s) { const k = Math.min(1, (now - s.start) / Math.max(0.01, s.ready - s.start)); c.scale.setScalar(0.3 + k * 0.9); c.material.color.setHex({ oyster: 0xd9d2c4, lionsmane: 0xffffff, reishi: 0x8a2f1c, cordyceps: 0xff7a1a, foxfire: 0x9df2b0, goldcap: 0xd9a441 }[s.k] || 0xe8dcc6); } });
  campLook.glow.forEach((j, i) => { j.visible = i < state.glow; });
  let any = false;
  for (const k of Object.keys(campLook.trophy)) { campLook.trophy[k].visible = !!state.trophies[k]; any = any || !!state.trophies[k]; }
  campLook.shelfGroup.visible = any;
  const v = state.nos;
  campLook.tank.visible = v.tank && !v.rig; // hidden in the cooler, it is not standing by the tent
  campLook.corner.visible = v.arc === 'won'; if (campLook.cornerSolid) campLook.cornerSolid.x = v.arc === 'won' ? CORNER[0] : 1e6;
  if (whip) whip.root.visible = !['gone', 'fled'].includes(v.whipState);
  for (const g of goons) g.root.visible = g.role === 'flank' ? v.arc !== 'won' || g === goons[0] : g.role === 'watch' ? v.tank && v.arc === '' && v.stage >= 1 : v.arc === 'truce';
  const raining = state.weather.rain && (state.mode === 'free' || state.mode === 'chase');
  campLook.rain.visible = raining;
  $('rainveil').style.opacity = raining ? 1 : 0;
  if (raining) {
    campLook.rain.position.set(player.root.position.x, 0, player.root.position.z);
    const a = campLook.rain.geometry.attributes.position, v = a.array, fall = 15 * dt;
    for (let i = 0; i < v.length; i += 6) { v[i + 1] -= fall; v[i + 4] -= fall; if (v[i + 1] < 0) { v[i + 1] += 12; v[i + 4] += 12; } }
    a.needsUpdate = true;
  }
}
function showGear(g, made = {}) {
  if (player && life) applyLook();
  campLook.shade.visible = !!made.shade;
  campLook.totem.visible = !!made.totem;
  campLook.patches.visible = g.tent >= 2;
  campLook.fly.visible = g.tent >= 3;
  campLook.porch.visible = g.tent >= 4;
  campLook.fly.children.forEach((m) => m.material.color.set(g.tent >= 5 ? 0x4a5670 : 0x9fb4bf)); // the blackout liner darkens it
  campLook.tape.visible = g.cooler >= 2;
  campLook.wheels.visible = g.cooler >= 3;
  campLook.pantry.forEach((m, lv) => { if (m) m.visible = (g.pantry || 1) === lv; });
  if (campLook.pantrySolid) campLook.pantrySolid.x = (g.pantry || 1) >= 2 ? CAMP.pantry[0] : 1e6;
}
let crowd = null; // moves everybody through their day (crowd.js)
const people = []; // everyone you could sell a sandwich to
function person(x, z, rot, amp = 0, kind = 'fixed', look = null) { // look: { model, scale, hue } pins one person's appearance, so they are the same every time you play
  const name = look ? look.model : 'person' + (1 + Math.floor(Math.random() * 4));
  put(name, x, z, rot, look ? look.scale : rand(0.94, 1.06), look ? look.hue : rand(-0.5, 0.5));
  const list = placed[name];
  people.push({ x, z, next: 0, name, n: list.length - 1, rot, s: list[list.length - 1].scale, amp, ph: rand(0, 6), col: colliders[colliders.length - 1], home: { x, z, rot }, kind, fixed: kind === 'fixed' });
}
// The Healing Village sits between the main stage and the river.
const BOOTH = [-37, -98]; // the Open Decks tent, on the camp side of the Main Stage field
const VILLAGE = { dome: [-58.5, -149.5], chill: [-28, -143.5], bath: [-24, -159], elder: [-49.5, -152] };
const inVillage = (x, z) => x < -19 && x > -74 && z < -137;
const CAMP = { tent: [22, -74.5], stove: [26.6, -77.4], cooler: [24.3, -78.3], bench: [15.4, -75.4], garden: [18.4, -78.6], tank: [20.7, -70.2], myco: [16.3, -72.4], counter: [29.6, -74.9], pantry: [29.4, -78.6], totem: [24.6, -72.9], shelf: [18.6, -74.9], stash: [19.3, -76.8], line: [21.6, -81.2] };
// Your camp is yours: nothing is scattered at random inside this patch (x from, x to, z from, z to), so neighbours' tents, fire rings and totems never land on your garden or kitchen.
const CAMP_PLOT = [12.6, 35.2, -82.2, -66.4];
const inCamp = (x, z, pad = 0) => x > CAMP_PLOT[0] - pad && x < CAMP_PLOT[1] + pad && z > CAMP_PLOT[2] - pad && z < CAMP_PLOT[3] + pad; // right beside the YOUR CAMP sign, where you cannot miss it
const CORNER = [-4.2, -63.4]; // the crate under the YOUR CORNER sign, which goes up when Vinny backs off
const WHIP = [12.4, -52.6]; // the twitchy guy behind the Costume Shop
const PERMIT = [4.4, -15.6]; // the lot office sign at the top of Shakedown Street // your ratty tent, near the gate end of the Campgrounds
const STALLS = { water: [5.9, -22], burrito: [5.9, -31.2], cheese: [-5.9, -31.2], gear: [5.9, -40.4] };
const PILE = [-9.2, -69.4]; // the Free Pile
const SHOWERS = [46.2, -68.2]; // beside Porta-Potty Row
function flags(x1, z1, x2, z2, y = 4.7) {
  // prayer flags: small squares in the five traditional colours, strung between two poles
  const cols = [0x3a7bd5, 0xf2efe6, 0xd9453b, 0x3f9b5b, 0xf2c14e], sq = new THREE.PlaneGeometry(0.42, 0.5);
  const len = Math.hypot(x2 - x1, z2 - z1), n = Math.round(len / 0.5), rot = Math.atan2(x2 - x1, z2 - z1) + Math.PI / 2;
  for (let i = 1; i < n; i++) {
    const t = i / n, f = mesh(sq, new THREE.MeshLambertMaterial({ color: cols[i % 5], side: THREE.DoubleSide }), x1 + (x2 - x1) * t, y - Math.sin(t * Math.PI) * 0.7 - 0.2, z1 + (z2 - z1) * t);
    f.rotation.y = rot; f.castShadow = false;
  }
  for (const [x, z] of [[x1, z1], [x2, z2]]) { mesh(new THREE.CylinderGeometry(0.05, 0.07, y, 6), lambert(0x6b4a2b), x, y / 2, z); bulbSpots.push([x, y + 0.1, z]); }
}
function buildWorld() {
  const hue = () => rand(-3.1, 3.1), tau = Math.PI * 2;
  // the Parking Lot
  for (const x of [-16, -9.5, 9.5, 16]) for (let z = 31; z > -6; z -= 5.2) {
    if (Math.random() > 0.84) continue;
    const r = Math.random(), kind = r < 0.42 ? 'hatchback' : r < 0.76 ? 'wagon' : r < 0.93 ? 'campervan' : 'rv';
    if (kind === 'rv' && Math.abs(x) < 12) continue;
    put(kind, x + rand(-0.3, 0.3), z, (x < 0 ? 0.5 : -0.5) * Math.PI + rand(-0.1, 0.1), 1, hue());
  }
  put('hatchback', 2.9, 4.6, Math.PI * 0.94); // the beater you arrived in
  // the gate and the fence either side of it
  for (const x of [-5.4, 5.4]) put('gatepost', x, -13, x < 0 ? 0.3 : -0.3);
  mesh(new THREE.BoxGeometry(11.6, 2.0, 0.25), lambert(0x3b2616), 0, 6.3, -13);
  const gateTex = { w: 1024, h: 180, bg: '#ffc93c', fg: '#17111f', size: 150 };
  signBoard('SHAKEDOWN', 0, 6.3, -12.86, 0, 11.2, 1.7, gateTex);
  signBoard('SHAKEDOWN', 0, 6.3, -13.14, Math.PI, 11.2, 1.7, gateTex);
  for (const s of [1, -1]) for (let x = 7.6; x < 78; x += 3.05) put('fence', s * x, -13, 0, 1, 0, x > 40);
  // Shakedown Street
  const L = ['TIE-DYE & TAPESTRY', 'GRILLED CHEESE $3', 'KANDI KORNER', 'HEADY GLASS', 'PINS PINS PINS'];
  const R = ['GENERAL STORE', 'VEGGIE BURRITOS', 'LEATHER & BURNER', 'THE COSTUME SHOP', '3 FOR $20  NO DEALS!'];
  const food = new Set(['GRILLED CHEESE $3', 'GENERAL STORE', 'VEGGIE BURRITOS']);
  [[L, -8.6, Math.PI / 2], [R, 8.6, -Math.PI / 2]].forEach(([labels, x, face]) => labels.forEach((label, i) => {
    const z = -22 - i * 9.2, kind = food.has(label) ? 'foodstall' : 'merchstall';
    put(kind, x, z, face, 1, [0, 0.45, -0.4, 0.25, -0.2][i]); // small shifts only, so the wood stays wood
    signBoard(label, x - Math.sign(x) * 1.9, PROPS[kind].height + 0.25, z, face, 3.5, 0.74);
  }));
  for (let z = -17.5; z > -64; z -= 9.2) bunting(-6.4, 6.4, z);
  put('tank', 5.6, -62.4, -0.6); // Vinny's corner
  put('freepile', -10, -70.5, 0.5);
  signBoard('FREE PILE', -8.4, 1.75, -68.2, 0.5, 2.2, 0.6);
  mesh(new THREE.BoxGeometry(0.08, 1.5, 0.08), lambert(0x6b4a2b), -8.4, 0.75, -68.2);
  for (let i = 0; i < 26; i++) { const side = Math.random() < 0.5 ? -1 : 1; person(side * rand(4.4, 5.6), rand(-60, -20), side * -Math.PI / 2 + rand(-0.6, 0.6), 0.02, 'street'); }
  // your camp goes in first so the neighbours pitch around it
  solid(CAMP.tent[0], CAMP.tent[1], 1.5); solid(CAMP.stove[0], CAMP.stove[1], 0.7); // your own tent and stove are camp models now (loadCampModels), not the shared lot props
  signBoard('YOUR CAMP', CAMP.tent[0] - 2.4, 2.0, CAMP.tent[1] + 2.4, 0.5, 2.3, 0.56, { bg: '#ffc93c' });
  mesh(new THREE.BoxGeometry(0.08, 1.75, 0.08), lambert(0x6b4a2b), CAMP.tent[0] - 2.4, 0.87, CAMP.tent[1] + 2.4);
  // the Campgrounds
  solid(1e6, CORNER[1], 0.6); campLook.cornerSolid = colliders[colliders.length - 1]; // the crate is only in the way once the corner is yours
  solid(1e6, CAMP.pantry[1], 0.6); campLook.pantrySolid = colliders[colliders.length - 1]; // moved into place once you own a cabinet
  solid(CAMP.counter[0], CAMP.counter[1], 0.75); // your kitchen counter and its queue: keeps the neighbours' tents off them
  let n = 0, tries = 0;
  while (n < 76 && tries++ < 1200) {
    const x = rand(-22, 48), z = rand(-120, -72);
    if (inCamp(x, z, 1.6) || nearRoute(x, z, 4) || colliders.some((c) => (c.x - x) ** 2 + (c.z - z) ** 2 < (c.r + 2.6) ** 2)) continue;
    const r = Math.random();
    if (r < 0.36) put('dometent', x, z, rand(0, tau), rand(0.85, 1.15), hue());
    else if (r < 0.66) put('ridgetent', x, z, rand(0, tau), rand(0.85, 1.15), hue());
    else if (r < 0.8) put('canopy', x, z, rand(0, tau), 1, hue());
    else if (r < 0.9) put('campset', x, z, rand(0, tau));
    else put(pick(['campervan', 'wagon', 'rv']), x, z, rand(0, tau), 1, hue());
    n++;
  }
  // showers beside Porta-Potty Row: three plank stalls, a water tank on the roof, and a sign
  for (let i = 0; i < 3; i++) {
    const x = 44.6 + i * 1.5;
    for (const dx of [-0.7, 0.7]) mesh(new THREE.BoxGeometry(0.08, 2.3, 1.3), lambert(0x9a7448), x + dx, 1.15, -66);
    mesh(new THREE.BoxGeometry(1.4, 2.3, 0.08), lambert(0x8a663e), x, 1.15, -65.4);
    mesh(new THREE.BoxGeometry(1.3, 1.5, 0.05), lambert([0x2ec4b6, 0xffc93c, 0xff5d8f][i]), x, 1.0, -66.6).castShadow = false; // curtain
    mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.5, 6), lambert(0xb9c2c9), x, 2.2, -65.7).rotation.x = 1.1;
    solid(x, -66, 0.8);
  }
  mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.2, 14), lambert(0x3d7bd9), 46.1, 2.95, -65.7).rotation.z = Math.PI / 2;
  signBoard('SHOWERS $3', 46.1, 2.65, -66.75, Math.PI, 2.4, 0.56, { bg: '#fff3d6' });
  for (let i = 0; i < 6; i++) put('potty', 34 + i * 1.45, -66, Math.PI + rand(-0.05, 0.05), 1, 0);
  for (let i = 0; i < 16; i++) { const x = rand(-20, 46), z = rand(-118, -74); if (!nearRoute(x, z, 2) && !inCamp(x, z, 0.5)) put('totem', x, z, rand(0, tau), rand(0.8, 1.1), hue()); }
  // Moonbeam, your neighbour, always camped beside you. Moonbeam has a model of his own now (see the loader below); he is also picked out by
  // everything around him: a name over his head, and a little moon camp
  // (a crescent on a pole, stars on a string, an indigo rug, a lantern) that nobody else on the grounds has.
  {
    const mx = CAMP.tent[0] + 5.4, mz = CAMP.tent[1] + 4.6;
    person(mx, mz, -2.2, 0, 'fixed', { model: 'person2', scale: 1.08, hue: 0.42 });
    const camp = new THREE.Group(); camp.position.set(mx, 0, mz); scene.add(camp);
    const glow = (c) => new THREE.MeshBasicMaterial({ color: c }); // lit from inside, so it reads at night too
    // the rug: indigo, with a pale moon and a ring of stars
    const rug = mesh(new THREE.CircleGeometry(1.25, 28), lambert(0x2b2350), 0, 0.02, 0, camp); rug.rotation.x = -Math.PI / 2; rug.castShadow = false;
    const ring = mesh(new THREE.RingGeometry(1.08, 1.2, 28), lambert(0xffe9a8), 0, 0.025, 0, camp); ring.rotation.x = -Math.PI / 2; ring.castShadow = false;
    for (let i = 0; i < 8; i++) { const a = i / 8 * tau; const st = mesh(new THREE.CircleGeometry(0.06, 5), glow(0xffe9a8), Math.cos(a) * 0.82, 0.03, Math.sin(a) * 0.82, camp); st.rotation.x = -Math.PI / 2; st.castShadow = false; }
    // the crescent on its pole
    const R = 0.36, c = 0.2, r2 = Math.hypot(c, R), moon = new THREE.Shape();
    moon.absarc(0, 0, R, Math.PI / 2, Math.PI * 1.5, false);
    moon.absarc(c, 0, r2, Math.atan2(-R, -c), Math.atan2(R, -c), true);
    const pole = [-1.05, -0.75];
    mesh(new THREE.CylinderGeometry(0.03, 0.04, 2.9, 6), lambert(0x6b4a2b), pole[0], 1.45, pole[1], camp);
    const crescent = mesh(new THREE.ExtrudeGeometry(moon, { depth: 0.07, bevelEnabled: false, curveSegments: 20 }), glow(0xffe38a), pole[0], 3.15, pole[1] - 0.035, camp); crescent.castShadow = false;
    crescent.rotation.z = -0.35;
    // stars on a string, from the pole down to a peg
    for (let i = 1; i <= 5; i++) { const u = i / 6; mesh(new THREE.OctahedronGeometry(0.07), glow([0xffe38a, 0xb9a0ff, 0x8fd8ff][i % 3]), pole[0] + u * 1.5, 2.75 - u * 2.3 + Math.sin(u * Math.PI) * -0.25, pole[1] + u * 0.2, camp).castShadow = false; }
    // a lantern by the chair
    mesh(new THREE.BoxGeometry(0.2, 0.06, 0.2), lambert(0x3a2a1c), 0.85, 0.03, -0.55, camp);
    mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.24, 8), glow(0xffc46b), 0.85, 0.18, -0.55, camp).castShadow = false;
    mesh(new THREE.ConeGeometry(0.12, 0.1, 8), lambert(0x3a2a1c), 0.85, 0.35, -0.55, camp);
    // the name, floating where a nameplate would be; it always faces you
    const tag = new THREE.Sprite(new THREE.SpriteMaterial({ map: signTexture('MOONBEAM', { w: 384, h: 96, bg: '#2b2350', fg: '#ffe9a8', border: '#ffe9a8', size: 58 }), depthWrite: false }));
    tag.scale.set(1.5, 0.375, 1); tag.position.set(0, 2.45, 0); camp.add(tag);
    campLook.moonTag = tag; campLook.moonCamp = camp;
  }
  for (let i = 0; i < 20; i++) { const x = rand(-20, 46), z = rand(-118, -74); if (!inCamp(x, z) && !nearRoute(x, z, 2) && !colliders.some((c) => (c.x - x) ** 2 + (c.z - z) ** 2 < (c.r + 0.8) ** 2)) person(x, z, rand(0, tau), 0.015, 'camp'); }
  // Main Stage Field
  put('stage', -70, -121, Math.PI / 2);
  { // the Open Decks tent: a canopy, a table with a controller on it, and two speakers
    const [bx, bz] = BOOTH, booth = new THREE.Group();
    booth.position.set(bx, 0, bz - 1.3); booth.rotation.y = 0;
    for (const [x, z] of [[-1.9, -1.2], [1.9, -1.2], [-1.9, 1.2], [1.9, 1.2]]) mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.6, 6), lambert(0xd8dde2), x, 1.3, z, booth);
    mesh(new THREE.ConeGeometry(3.0, 0.9, 4), lambert(0x8f6aff), 0, 3.05, 0, booth).rotation.y = Math.PI / 4;
    mesh(new THREE.BoxGeometry(2.4, 0.08, 0.9), lambert(0x6b4a2b), 0, 1.0, 0, booth);
    for (const x of [-1.05, 1.05]) mesh(new THREE.BoxGeometry(0.08, 1.0, 0.8), lambert(0x4a3320), x, 0.5, 0, booth);
    mesh(new THREE.BoxGeometry(1.3, 0.07, 0.55), lambert(0x22202b), 0, 1.08, 0, booth);
    for (const x of [-0.42, 0.42]) mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.03, 16), lambert(0xd8dde2), x, 1.13, 0, booth);
    for (const x of [-2.6, 2.6]) { mesh(new THREE.BoxGeometry(0.7, 1.5, 0.6), lambert(0x22202b), x, 0.75, 0.3, booth); mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.04, 14), lambert(0x5a5766), x, 0.95, 0.62, booth).rotation.x = Math.PI / 2; }
    scene.add(booth);
    signBoard('OPEN DECKS', bx, 2.45, bz - 0.05, 0, 2.6, 0.5, { bg: '#8f6aff', fg: '#fff3d6' });
    solid(bx, bz - 1.3, 1.3); solid(bx - 2.6, bz - 1.0, 0.5); solid(bx + 2.6, bz - 1.0, 0.5);
  }
  for (let i = 0; i < 150; i++) { const x = rand(-59.5, -50.5), z = rand(-135, -107); if (!nearRoute(x, z, 2.4)) person(x, z, -Math.PI / 2 + rand(-0.35, 0.35), rand(0.05, 0.16), 'stage'); }
  for (let i = 0; i < 9; i++) put('totem', rand(-59, -50), rand(-134, -108), rand(0, tau), rand(0.9, 1.2), hue());
  // the Healing Village: north of the main stage, on the river bank
  put('dome', VILLAGE.dome[0], VILLAGE.dome[1], 1.35); // door towards the path
  put('chilltent', VILLAGE.chill[0], VILLAGE.chill[1], Math.PI + 0.25);
  put('soundbath', VILLAGE.bath[0], VILLAGE.bath[1], 2.6);
  put('spiral', -66.5, -158.5, 0, 1, 0, false, 0.02);
  put('apothecary', -34, -160.5, 0.35);
  put('teepee', -49, -160, 0.2); put('teepee', -41.5, -161.5, -0.3, 0.9, 0.5); put('teepee', -67, -142.5, 1.9, 1.05, -0.4);
  flags(-64, -145, -52, -141); flags(-33, -146.5, -24, -155); flags(-52, -157, -36, -158);
  for (const [x, z] of [[-60, -141], [-55, -158], [-28, -150], [-44, -156], [-63, -153], [-32, -141]]) put('bush', x, z, rand(0, tau), rand(0.9, 1.4), rand(-0.2, 0.2));
  for (const [x, z, r] of [[-38, -142, 2.2], [-41, -143.5, -2.4], [-26, -156, 0.4], [-64, -156, 1.2], [-51, -144, 2.9]]) person(x, z, r, 0.012);
  // the River bank
  for (let i = 0; i < 46; i++) { const x = rand(-74, 74); if (Math.abs(x) > 5 && !(x < -20 && x > -72)) put(Math.random() < 0.55 ? 'rock' : 'bush', x, rand(-166.5, -162), rand(0, tau), rand(0.6, 1.3), rand(-0.2, 0.2)); }
  // trees: landmark trees inside the grounds, then the forest all around
  for (let i = 0; i < 60; i++) {
    const x = rand(-72, 72), z = rand(-160, -68);
    if (nearRoute(x, z, 7) || inVillage(x, z) || (x < -44 && z < -100 && z > -142) || colliders.some((c) => (c.x - x) ** 2 + (c.z - z) ** 2 < (c.r + 3) ** 2)) continue;
    put(Math.random() < 0.6 ? 'oakhi' : 'pinehi', x, z, rand(0, tau), rand(0.8, 1.25), rand(-0.25, 0.2));
    groves.push([x, z]); // wild mushrooms come up under these
  }
  for (let i = 0; i < 90; i++) { const x = rand(-72, 72), z = rand(-160, -14); if (!nearRoute(x, z, 5) && Math.abs(x) > 12 && !inVillage(x, z)) put('bush', x, z, rand(0, tau), rand(0.7, 1.4), rand(-0.3, 0.2)); }
  let trees = 0;
  while (trees < 560) {
    const x = rand(-205, 205), z = rand(-275, 135);
    if ((Math.abs(x) < 76 && z < 42 && z > -166) || (z < -164 && z > -186)) continue;
    const near = Math.abs(x) < 100 && z < 60 && z > -205;
    put(Math.random() < 0.72 ? 'pine' : 'oak', x, z, rand(0, tau), rand(0.8, 1.6), rand(-0.3, 0.2), !near);
    trees++;
  }
  if (carQuestData) buildCarQuest(carQuestData);
  buildInstances();
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
// ---- Moonbeam at work. Hired on the counter, he walks over and stands behind it facing the queue; off shift he goes home to his
// rug. What he is doing shows in how he moves: he waves a customer in, reaches across to hand a sandwich over, shrugs when
// there is nothing to give them, and looks up and down the line while he waits. The rules tell us what happened through
// state.pal.act = { kind, at }; this only draws it. Each pose is extra rotation laid over the idle animation, bone by bone.
const MOON_POSE = {
  // kind: seconds it lasts, and for each bone [x, y, z] in radians at full strength (plus an optional wobble). Axes found by eye on
  // this rig: RightArm z- lifts it up and out, both arms x- bring the hands forward at waist height.
  greet: { secs: 1.6, bones: { RightArm: [0, 0, -1.3], RightForeArm: [0, 0, -0.7], Head: [0.1, 0, 0] }, wobble: { bone: 'RightForeArm', axis: 2, amount: 0.4, speed: 14 } }, // a wave as a customer reaches the counter
  wave: { secs: 1.4, bones: { RightArm: [0, 0, -1.3], RightForeArm: [0, 0, -0.7] }, wobble: { bone: 'RightForeArm', axis: 2, amount: 0.4, speed: 14 } }, // the same wave, for you
  serve: { secs: 1.2, bones: { RightArm: [-1.1, 0, 0], LeftArm: [-1.1, 0, 0], Spine01: [0.16, 0, 0] } }, // both hands out across the counter
  sorry: { secs: 1.7, bones: { RightArm: [0, 0, -0.45], LeftArm: [0, 0, 0.45], RightForeArm: [-0.8, 0, 0], LeftForeArm: [-0.8, 0, 0] }, wobble: { bone: 'Head', axis: 1, amount: 0.35, speed: 8 } }, // open hands and a shake of the head: nothing to give them
  waiting: { secs: 0, bones: {}, wobble: { bone: 'Head', axis: 1, amount: 0.4, speed: 0.9 } }, // on shift with nobody at the counter: he looks up and down the line
};
function moonbeamShift(dt) {
  const m = moonbeam, k = state.kitchen, now = (state.day || 0) * 24 + (state.hour || 0);
  const working = !!k && k.hire && k.hire.job === 'front' && now < k.hire.until && !!state.craft.made.sign;
  const post = working ? [CAMP.counter[0] - 0.95, CAMP.counter[1], Math.PI / 2] : m.home; // behind the counter, facing the queue
  const P = m.root.position, dx = post[0] - P.x, dz = post[1] - P.z, d = Math.hypot(dx, dz);
  if (d > 0.06) { // walking between his rug and the counter
    if (d > 30) P.set(post[0], 0, post[1]); // the clock jumped: he is simply there
    else { const stepLen = Math.min(d, 1.5 * dt); P.x += dx / d * stepLen; P.z += dz / d * stepLen; m.root.rotation.y = Math.atan2(dx, dz); play(m, 'Walk'); }
  } else {
    play(m, 'Idle');
    let turn = post[2] - m.root.rotation.y; turn = Math.atan2(Math.sin(turn), Math.cos(turn)); m.root.rotation.y += turn * Math.min(1, dt * 6);
  }
  // the person the rules call Moonbeam, the name over his head and the thing you bump into all go where he goes
  if (m.stand) { m.stand.x = P.x; m.stand.z = P.z; if (m.stand.col) { m.stand.col.x = P.x; m.stand.col.z = P.z; } }
  if (campLook.moonTag) campLook.moonTag.position.set(P.x - campLook.moonCamp.position.x, 2.45, P.z - campLook.moonCamp.position.z);
  // a wave when you walk up to him, on or off shift
  if (player) { const near = Math.hypot(player.root.position.x - P.x, player.root.position.z - P.z) < 3.6; if (near && !m.sawYou && d <= 0.06 && state.mode === 'free') state.pal.act = { kind: 'wave', at: state.t }; m.sawYou = near; }
  if (d > 0.06) return; // no gestures mid-stride
  if (working && m.bones.Hips) { // the idle he was given swings his whole body round to look about; behind a counter he keeps facing the customers
    if (!m.hipsRest) { const t = m.actions.Idle.getClip().tracks.find((x) => x.name === 'Hips.quaternion'); m.hipsRest = t ? new THREE.Quaternion().fromArray(t.values, 0) : m.bones.Hips.quaternion.clone(); }
    m.bones.Hips.quaternion.slerp(m.hipsRest, 0.85);
  }
  const act = state.pal && state.pal.act, pose = act && MOON_POSE[act.kind], age = act ? state.t - act.at : 99;
  let use = null, w = 0;
  if (pose && age >= 0 && age < pose.secs) { use = pose; const u = age / pose.secs; w = Math.sin(Math.PI * Math.min(1, u * 1.15)) ** 0.6; } // ease in, hold, ease out
  else if (working) { use = MOON_POSE.waiting; w = 1; }
  if (!use) return;
  for (const [name, r] of Object.entries(use.bones)) { const b = m.bones[name]; if (b) { b.rotation.x += r[0] * w; b.rotation.y += r[1] * w; b.rotation.z += r[2] * w; } }
  if (use.wobble) { const b = m.bones[use.wobble.bone]; if (b) b.rotation['xyz'[use.wobble.axis]] += Math.sin(state.t * use.wobble.speed) * use.wobble.amount * w; }
}
// The slow bends of the river where gold settles: a gravel bar, a few stones and a stake with a yellow rag, so you can find them.
// Your sluice box shows in whichever bend you set it.
let RIVER_BENDS = [];
// ---- camp models: a made model for each camp piece (game/assets/camp/*.glb, from the pictures in art/camp/funky) takes the place
// of its painted shape once it has loaded. If one fails to load, the painted shape stays.
const CAMP_MODEL = { // h: how tall to make it, in metres; fit: squeeze it into this box instead; yaw: which way it faces
  tent: { h: 2.05, yaw: 0 }, cooler: { h: 0.95, yaw: 0 }, stove: { h: 1.25, yaw: 0 }, bench: { h: 1.65, yaw: 0 }, planter: { fit: [1.36, 0.36, 0.66], yaw: 0 }, myco: { h: 1.3, yaw: 0 },
  pantry: { h: 1.35, yaw: 0 }, counter: { h: 2.75, yaw: 0 }, stash: { h: 1.2, yaw: 0 }, tank: { h: 1.65, yaw: 0 }, totem: { h: 3.9, yaw: 0 }, flag: { h: 3.4, yaw: 0 }, wagon: { h: 2.1, yaw: 0 },
};
async function loadCampModel(name) {
  const gltf = await loader.loadAsync(`./assets/camp/${name}.glb`), m = gltf.scene, spec = CAMP_MODEL[name];
  m.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; o.material.metalness = 0; o.material.metalnessMap = null; o.material.roughness = 0.82; o.material.roughnessMap = null; } });
  m.rotation.y = spec.yaw || 0; m.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(m), size = box.getSize(new THREE.Vector3()), mid = box.getCenter(new THREE.Vector3());
  const wrap = new THREE.Group(); m.position.x -= mid.x; m.position.y -= box.min.y; m.position.z -= mid.z; wrap.add(m); // stands on the ground, centred
  if (spec.fit) wrap.scale.set(spec.fit[0] / size.x, spec.fit[1] / size.y, spec.fit[2] / size.z); else wrap.scale.setScalar(spec.h / size.y);
  return wrap;
}
function swapIn(group, model, keep = []) { // the painted pieces step aside; anything the game still moves (plants, mushroom caps) stays
  const old = new THREE.Group(); old.visible = false;
  for (const ch of [...group.children]) if (!keep.includes(ch)) old.add(ch);
  group.add(old, model);
}
const campModels = {};
async function loadCampModels() {
  const each = async (name, fn) => { try { const m = await loadCampModel(name); campModels[name] = m; fn(m); } catch (e) { console.warn(`Camp model ${name} not loaded`, e); } };
  await each('tent', (m) => swapIn(campLook.tentGroup, m));
  await each('cooler', (m) => swapIn(campLook.cooler, m));
  await each('stove', (m) => { m.position.set(CAMP.stove[0], 0, CAMP.stove[1]); scene.add(m); });
  await each('bench', (m) => swapIn(campLook.bench, m));
  await each('planter', (m) => campLook.plots.forEach((p, i) => swapIn(p.planter, i ? m.clone() : m, [p.soil, p.sprouts])));
  await each('myco', (m) => { swapIn(campLook.myco, m, campLook.caps); campLook.caps.forEach((cap, i) => cap.position.set(-0.24 + (i % 2) * 0.48, i < 2 ? 0.7 : 0.26, 0)); });
  await each('pantry', (m) => { swapIn(campLook.pantry[3], m); const big = m.clone(); big.scale.multiplyScalar(1.2); big.scale.x *= 1.35; swapIn(campLook.pantry[4], big); });
  await each('counter', (m) => swapIn(campLook.counter, m));
  await each('stash', (m) => { m.position.set(CAMP.stash[0], 0, CAMP.stash[1]); m.rotation.y = 0.6; scene.add(m); solid(CAMP.stash[0], CAMP.stash[1], 0.6); campSolids.stash = colliders[colliders.length - 1]; });
  await each('tank', (m) => { swapIn(campLook.tank, m); swapIn(campLook.cornerTank, m.clone()); });
  await each('totem', (m) => swapIn(campLook.totem, m));
  await each('flag', (m) => swapIn(campLook.trophy.flag, m));
  if (carQuestData) await each('wagon', (m) => { const c = carQuestData.car; m.position.set(c.x, 0, c.z); m.rotation.y = c.turn; scene.add(m); carLook.model = m; });
}
// ---- taking a balloon. Any character with a two-armed skeleton can do it: startBalloon(character).
// The hand is steered to the mouth by working out where the elbow has to be, so it lands right whatever the body's proportions.
// The balloon shrinks as it goes in, the chest fills, then the arm drops and they wobble as what is left gets away.
const BALLOON = { secs: 3.7, up: 0.5, breath: 1.9, down: 2.5, colours: [0xff5d8f, 0xffd23f, 0x3aa0ff, 0x7cf29a, 0xff7b54] };
const balloonActs = new Map();
const smooth01 = (u) => { const k = Math.min(1, Math.max(0, u)); return k * k * (3 - 2 * k); };
const V = () => new THREE.Vector3(), Q = () => new THREE.Quaternion();
const bA = V(), bB = V(), bT = V(), bS = V(), bE = V(), bRight = V(), bFwd = V(), bDir = V(), bPole = V(), bMouth = V(), bHand = V(), bQ1 = Q(), bQ2 = Q(), bQ3 = Q();
const WORLD_UP = new THREE.Vector3(0, 1, 0);
function aimBone(bone, tip, target, w) { // turn `bone` so the joint at its far end (`tip`) points at the world point `target`
  bone.getWorldPosition(bA); tip.getWorldPosition(bB);
  bB.sub(bA).normalize(); bT.copy(target).sub(bA).normalize();
  bQ1.setFromUnitVectors(bB, bT).multiply(bone.getWorldQuaternion(bQ2));
  bone.parent.getWorldQuaternion(bQ3).invert().multiply(bQ1);
  bone.quaternion.slerp(bQ3, w);
  bone.updateMatrixWorld(true);
}
function startBalloon(ch) {
  const B = ch && ch.bones;
  if (!B || !B.RightArm || !B.RightForeArm || !B.RightHand || !B.Head) return false;
  let a = balloonActs.get(ch);
  if (!a) { a = { prop: new THREE.Mesh(new THREE.SphereGeometry(0.15, 14, 10), new THREE.MeshLambertMaterial({ color: 0xff5d8f })) }; a.prop.castShadow = true; scene.add(a.prop); balloonActs.set(ch, a); }
  a.t = 0; a.prop.material.color.setHex(pick(BALLOON.colours)); a.prop.visible = true;
  return true;
}
function balloonTick(dt) { // run after the animation mixers, so this sits on top of whatever the character is doing
  for (const [ch, a] of balloonActs) {
    if (a.t === undefined || a.t > BALLOON.secs || !ch.root.visible) { a.prop.visible = false; a.t = undefined; continue; }
    a.t += dt;
    const t = a.t, B = ch.bones;
    const up = smooth01(t / BALLOON.up) * (1 - smooth01((t - BALLOON.down) / 0.6)); // arm up, hold, down
    const breath = smooth01((t - BALLOON.up) / BALLOON.breath), out = smooth01((t - BALLOON.down) / 1.1), settle = 1 - smooth01((t - 3.2) / 0.5);
    const turn = (name, x, y, z) => { const b = B[name]; if (b) { b.rotation.x += x; b.rotation.y += y; b.rotation.z += z; } };
    turn('Spine01', -0.12 * breath * (1 - out), 0, Math.sin(t * 5) * 0.07 * out * settle); // the chest fills, then the sway
    turn('Head', -0.16 * breath * (1 - out) + 0.2 * out * settle, Math.sin(t * 3.3) * 0.14 * out * settle, 0); // head back to take it in, then it lolls
    ch.root.updateMatrixWorld(true);
    // which way they face, read off the shoulders
    (B.RightShoulder || B.RightArm).getWorldPosition(bRight); (B.LeftShoulder || B.LeftArm || B.Head).getWorldPosition(bA); bRight.sub(bA).setY(0).normalize();
    bFwd.crossVectors(WORLD_UP, bRight).normalize();
    (B.headfront || B.Head).getWorldPosition(bMouth); B.Head.getWorldPosition(bA);
    const headSize = Math.max(0.12, bMouth.distanceTo(bA)); // scales the reach to the character
    if (!B.headfront) bMouth.addScaledVector(bFwd, 0.1).y += 0.06;
    bMouth.y -= headSize * 0.35; // lips, not nose
    bT.copy(bMouth).addScaledVector(bFwd, 0.09).addScaledVector(bRight, 0.03); // where the hand goes: just in front of the lips
    // the elbow: on the circle both arm bones can reach, hanging down and out
    B.RightArm.getWorldPosition(bS); B.RightForeArm.getWorldPosition(bE); B.RightHand.getWorldPosition(bHand);
    const L1 = bS.distanceTo(bE), L2 = bE.distanceTo(bHand), want = bT.clone();
    bDir.copy(want).sub(bS); const d = Math.min(bDir.length(), (L1 + L2) * 0.98); bDir.normalize();
    const along = (L1 * L1 - L2 * L2 + d * d) / (2 * d), side = Math.sqrt(Math.max(0, L1 * L1 - along * along));
    bPole.set(0, -1, 0).addScaledVector(bRight, 0.75); bPole.addScaledVector(bDir, -bPole.dot(bDir)).normalize();
    const elbow = bS.clone().addScaledVector(bDir, along).addScaledVector(bPole, side);
    aimBone(B.RightArm, B.RightForeArm, elbow, up);
    aimBone(B.RightForeArm, B.RightHand, want, up);
    // the balloon rides in front of the hand, shrinking as it empties, and what is left gets away
    B.RightHand.getWorldPosition(bHand);
    const size = (1 - 0.72 * breath) * (1 - out);
    a.prop.position.copy(bHand).addScaledVector(bFwd, 0.07 + 0.13 * size); a.prop.position.y += 0.03 + out * 0.9; a.prop.position.x += Math.sin(t * 9) * 0.05 * out;
    a.prop.scale.setScalar(Math.max(0.001, size));
    a.prop.visible = size > 0.02;
  }
}
// ---- Where's My Car: the things in the lot the story points at, and your car's lights when you press the fob
const carLook = { lamps: [], light: null, at: null };
let carQuestData = null;
function buildCarQuest(Q) {
  const [van, flag, row] = Q.memories;
  // the purple van: a tarp somebody has thrown over the roof of a van
  put('campervan', van.x - 2.4, van.z, Math.PI / 2, 1, 0);
  mesh(new THREE.BoxGeometry(4.3, 0.06, 2.3), lambert(0x7a3fd1), van.x - 2.4, 2.32, van.z);
  for (const side of [-1, 1]) mesh(new THREE.BoxGeometry(4.3, 0.55, 0.05), lambert(0x7a3fd1), van.x - 2.4, 2.06, van.z + side * 1.16);
  // the flag: a towel on a pole
  mesh(new THREE.CylinderGeometry(0.04, 0.05, 3.2, 6), lambert(0x6b4a2b), flag.x + 1.6, 1.6, flag.z);
  const towel = mesh(new THREE.PlaneGeometry(1.1, 0.7), new THREE.MeshLambertMaterial({ color: 0xffc93c, side: THREE.DoubleSide }), flag.x + 2.15, 2.75, flag.z); towel.castShadow = true;
  mesh(new THREE.PlaneGeometry(1.1, 0.12), new THREE.MeshLambertMaterial({ color: 0xff7b54, side: THREE.DoubleSide }), flag.x + 2.15, 2.6, flag.z + 0.01);
  solid(flag.x + 1.6, flag.z, 0.25);
  // the row signs: a kid has been busy
  [['ROW 4', -1.9, 1.5, -0.2], ['ROW 7', -0.5, 1.9, 0.15], ['ROW π', 0.9, 1.6, -0.1], ['ROW 4 AGAIN', 2.6, 2.0, 0.2]].forEach(([text, dx, y, rot]) => {
    signBoard(text, row.x + dx, y, row.z + 1.8, rot, text.length > 6 ? 1.9 : 1.2, 0.42, { bg: '#fff3d6' });
    mesh(new THREE.CylinderGeometry(0.035, 0.045, y, 6), lambert(0x6b4a2b), row.x + dx, y / 2, row.z + 1.8);
  });
  // your car, out past the last proper row, with a card game on the hood
  const c = Q.car;
  solid(c.x, c.z, 1.5); /* your own car is the pink wagon model, loaded with the camp models (loadCampModels) */
  const fx = Math.sin(c.turn), fz = Math.cos(c.turn);
  mesh(new THREE.BoxGeometry(0.5, 0.02, 0.36), lambert(0xf2efe6), c.x + fx * 1.25, 1.07, c.z + fz * 1.25).rotation.y = c.turn + 0.3; // cards on the hood
  for (const side of [-1, 1]) {
    const lamp = mesh(new THREE.SphereGeometry(0.11, 10, 8), new THREE.MeshBasicMaterial({ color: 0x3a3320, toneMapped: false }), c.x + fx * 1.8 + fz * side * 0.74, 0.8, c.z + fz * 1.8 - fx * side * 0.74);
    lamp.castShadow = false; carLook.lamps.push(lamp);
  }
  carLook.light = new THREE.PointLight(0xffe2a8, 0, 16, 1.6); carLook.light.position.set(c.x + fx * 2.4, 1.1, c.z + fz * 2.4); scene.add(carLook.light);
}
function carLights() { // two quick flashes each time the fob is pressed
  const c = state.car;
  if (!c || !carLook.light) return;
  const age = state.t - (c.beepAt ?? -99), on = age >= 0 && age < 1.1 && (age % 0.55) < 0.28;
  for (const l of carLook.lamps) { l.visible = on; l.material.color.setHex(0xfff0b0).multiplyScalar(3); } /* the wagon has its own headlights; these only show while they flash */
  carLook.light.intensity = on ? 30 : 0;
}
// ---- moving camp pieces. CAMP holds where each piece is right now; state.campLayout holds where you chose to put it.
const CAMP_DEFAULT = {}, campSolids = {};
let campSig = '', campLayoutSeen = null;
function campInit() { // once the world is built: remember the starting spots and the thing you bump into at each
  for (const k in CAMP) { CAMP_DEFAULT[k] = CAMP[k].slice(); if (k !== 'tent' && !campSolids[k]) campSolids[k] = colliders.find((c) => Math.abs(c.x - CAMP[k][0]) < 0.02 && Math.abs(c.z - CAMP[k][1]) < 0.02) || null; }
}
function campPlace(k) { // stand one piece where CAMP says it is
  if (!CAMP[k] || !CAMP_DEFAULT[k]) return;
  const [x, z] = CAMP[k], D = CAMP_DEFAULT[k], set = (o) => { if (o) { o.position.x = x; o.position.z = z; } };
  if (k === 'stove') { set(campModels.stove); if (campLook.shade) campLook.shade.position.set(x - D[0], 0, z - D[1]); }
  else if (k === 'cooler') { if (!state.towing) set(campLook.cooler); if (campLook.coolerSolid) campLook.coolerSolid.z = z; }
  else if (k === 'bench') set(campLook.bench);
  else if (k === 'garden') campLook.plots.forEach((p, i) => p.planter.position.set(x - (i % 3) * 1.6, 0, z - Math.floor(i / 3) * 1.15));
  else if (k === 'pantry') { for (const g of campLook.pantry) set(g); if (campLook.pantrySolid) campLook.pantrySolid.z = z; }
  else if (k === 'counter') { set(campLook.counter); set(campLook.openSign); set(campLook.shutSign); }
  else if (k === 'myco') set(campLook.myco);
  else if (k === 'tank') set(campLook.tank);
  else if (k === 'totem') set(campLook.totem);
  else if (k === 'shelf') set(campLook.shelfGroup);
  else if (k === 'stash') set(campModels.stash);
  else if (k === 'line') { set(tapLook.group); if (tapLook.data) { tapLook.data.line.x = x; tapLook.data.line.z = z; } }
  const s = campSolids[k];
  if (s && k !== 'cooler' && k !== 'pantry') { s.x = x; s.z = z; }
}
function campLayoutTick() { // called every frame: cheap unless the layout, a loaded save or a newly loaded model changed something
  if (!CAMP_DEFAULT.tent) return;
  const sig = `${state.campRev || 0}:${Object.keys(campModels).length}`;
  if (sig !== campSig || state.campLayout !== campLayoutSeen) {
    campSig = sig; campLayoutSeen = state.campLayout;
    for (const k in CAMP_DEFAULT) if (k !== 'tent') { const at = (state.campLayout && state.campLayout[k]) || CAMP_DEFAULT[k]; CAMP[k][0] = at[0]; CAMP[k][1] = at[1]; campPlace(k); }
  }
  const pl = state.placing;
  if (pl && player) { // the piece you are carrying rides a couple of steps in front of you
    const r = player.root.rotation.y, x = player.root.position.x + Math.sin(r) * 2.0, z = player.root.position.z + Math.cos(r) * 2.0;
    if (pl.key.startsWith('canopy')) { const c = state.canopies[+pl.key.slice(6)]; if (c) { c.x = x; c.z = z; } }
    else if (CAMP[pl.key]) { CAMP[pl.key][0] = x; CAMP[pl.key][1] = z; campPlace(pl.key); }
  }
  canopyShow();
}
// ---- canopies: up to three pop-ups you buy at the General Store and stand anywhere on your plot. Each can carry one tapestry on its back wall.
const canopyLook = [];
function buildCanopies() {
  for (let i = 0; i < 3; i++) {
    const g = new THREE.Group(); g.visible = false; scene.add(g);
    for (const [x, z] of [[-1.5, -1.5], [1.5, -1.5], [-1.5, 1.5], [1.5, 1.5]]) mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.4, 8), funk('gold'), x, 1.2, z, g);
    const roof = mesh(new THREE.ConeGeometry(2.3, 0.85, 4), funk('velvet', 3, 1), 0, 2.82, 0, g); roof.rotation.y = Math.PI / 4;
    for (const [x, z, ry] of [[0, 1.55, 0], [0, -1.55, 0], [1.55, 0, Math.PI / 2], [-1.55, 0, Math.PI / 2]]) { mesh(new THREE.BoxGeometry(3.14, 0.26, 0.03), funk('velvet', 3, 0.3), x, 2.3, z, g).rotation.y = ry; mesh(new THREE.BoxGeometry(3.14, 0.05, 0.035), funk('gold'), x, 2.16, z, g).rotation.y = ry; }
    const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 340;
    const tex = new THREE.CanvasTexture(canvas); tex.colorSpace = THREE.SRGBColorSpace;
    const cloth = mesh(new THREE.PlaneGeometry(2.9, 1.9), new THREE.MeshLambertMaterial({ map: tex, side: THREE.DoubleSide }), 0, 1.2, -1.5, g); cloth.castShadow = true; cloth.visible = false; windy(cloth, 2.9, 1.9);
    canopyLook.push({ group: g, cloth, canvas, tex, shown: null });
  }
}
function canopyShow() {
  const list = state.canopies || [];
  canopyLook.forEach((L, i) => {
    const c = list[i], up = !!c && c.x !== null && c.x !== undefined;
    L.group.visible = up;
    if (!up) return;
    L.group.position.set(c.x, 0, c.z);
    L.group.rotation.y = Math.atan2(CAMP.tent[0] - c.x, CAMP.tent[1] - c.z); // open side to your tent, tapestry wall away from it
    if (L.shown !== (c.tap || '')) { L.shown = c.tap || ''; const t = tapLook.list.find((q) => q.id === c.tap); L.cloth.visible = !!t; if (t) paintTapestry(t, L); }
  });
}
// ---- the tapestry line at camp: two poles and a rope; whichever tapestry is up hangs from it. Patterns are painted here from data/tapestry.json.
const tapLook = { group: null, cloth: null, canvas: null, tex: null, shown: null, list: [] };
const tapImages = {};
// ---- cloth in the wind: every hanging tapestry is a sheet pinned along its top edge; the rest of it swells and ripples.
const windCloths = [];
function windy(cloth, w, h) {
  cloth.geometry.dispose(); cloth.geometry = new THREE.PlaneGeometry(w, h, 16, 10);
  windCloths.push({ cloth, h, base: cloth.geometry.attributes.position.array.slice(), seed: windCloths.length * 1.7 });
}
function clothWind() { // called every frame
  const t = state.t, gust = (state.weather && state.weather.rain ? 1.7 : 1) * (0.75 + 0.25 * Math.sin(t * 0.23) + 0.2 * Math.sin(t * 0.61 + 1.3)); // the wind comes and goes, and blows harder in rain
  for (const c of windCloths) {
    if (!c.cloth.visible || !c.cloth.parent.visible) continue;
    const pos = c.cloth.geometry.attributes.position, a = pos.array, b = c.base;
    for (let i = 0; i < a.length; i += 3) {
      const x = b[i], y = b[i + 1], down = 0.5 - y / c.h, hang = down * down; /* 0 along the pinned top edge, 1 at the free hem */
      a[i + 2] = gust * hang * (0.2 * Math.sin(t * 1.5 + x * 1.3 + c.seed) + 0.075 * Math.sin(t * 3.4 + x * 3.1 - y * 2.2 + c.seed * 2) + 0.12 * Math.sin(t * 0.7 + c.seed));
      a[i] = x + gust * hang * 0.03 * Math.sin(t * 2.1 + y * 3 + c.seed);
    }
    pos.needsUpdate = true; c.cloth.geometry.computeVertexNormals();
  }
}
function paintTapestry(t, target = tapLook) {
  const c = target.canvas, g = c.getContext('2d'), W = c.width, H = c.height, [a, b, d] = t.colors;
  const rnd = (() => { let s = 7; return () => (s = (s * 16807) % 2147483647) / 2147483647; })(); // the same cloth every time
  g.fillStyle = a; g.fillRect(0, 0, W, H);
  target.want = t.id;
  if (t.draw === 'image') { // a picture made for the game: game/assets/tapestry/<image>.jpg
    let im = tapImages[t.image];
    if (!im) { im = tapImages[t.image] = new Image(); im.src = `./assets/tapestry/${t.image}.jpg`; }
    const draw = () => { if (target.want !== t.id) return; g.drawImage(im, 0, 0, W, H); target.tex.needsUpdate = true; };
    if (im.complete && im.naturalWidth) draw(); else im.addEventListener('load', draw, { once: true });
    target.tex.needsUpdate = true;
    return;
  }
  if (t.draw === 'leopard') {
    for (let i = 0; i < 150; i++) { const x = rnd() * W, y = rnd() * H, r = 9 + rnd() * 10; g.fillStyle = b; g.beginPath(); g.ellipse(x, y, r, r * 0.8, rnd() * 3, 0, 7); g.fill(); g.strokeStyle = d; g.lineWidth = 5; g.beginPath(); g.ellipse(x, y, r + 3, r * 0.8 + 3, rnd() * 3, 0.4, 2.4); g.stroke(); g.beginPath(); g.ellipse(x, y, r + 3, r * 0.8 + 3, 0, 3.4, 5.6); g.stroke(); }
  } else if (t.draw === 'tiger' || t.draw === 'zebra') {
    g.strokeStyle = b; g.lineCap = 'round';
    for (let y = -20; y < H + 40; y += t.draw === 'zebra' ? 30 : 38) for (const side of [0, 1]) { g.lineWidth = 9 + rnd() * 9; g.beginPath(); const x0 = side ? W : 0, x1 = W / 2 + (rnd() - 0.5) * 90, yy = y + rnd() * 16; g.moveTo(x0, yy); g.quadraticCurveTo((x0 + x1) / 2, yy + (rnd() - 0.5) * 50, x1, yy + 26 + rnd() * 20); g.stroke(); }
  } else if (t.draw === 'patchwork') {
    const n = 6, w = W / n, h = H / 4;
    for (let i = 0; i < n; i++) for (let j = 0; j < 4; j++) { g.fillStyle = t.colors[(i * 5 + j * 3 + ((i * j) % 2)) % t.colors.length]; g.fillRect(i * w, j * h, w, h); g.strokeStyle = 'rgba(255,243,214,.8)'; g.lineWidth = 2; g.setLineDash([7, 6]); g.strokeRect(i * w + 5, j * h + 5, w - 10, h - 10); }
    g.setLineDash([]);
  } else if (t.draw === 'sunmoon') {
    g.fillStyle = b; g.strokeStyle = b; g.lineWidth = 6;
    for (let k = 0; k < 16; k++) { const an = k / 16 * 6.283; g.beginPath(); g.moveTo(W * 0.32 + Math.cos(an) * 62, H / 2 + Math.sin(an) * 62); g.lineTo(W * 0.32 + Math.cos(an) * (k % 2 ? 84 : 104), H / 2 + Math.sin(an) * (k % 2 ? 84 : 104)); g.stroke(); }
    g.beginPath(); g.arc(W * 0.32, H / 2, 52, 0, 7); g.fill();
    g.beginPath(); g.arc(W * 0.72, H / 2, 58, 0, 7); g.fill(); g.fillStyle = a; g.beginPath(); g.arc(W * 0.72 + 26, H / 2 - 10, 50, 0, 7); g.fill();
    g.fillStyle = b; for (let i = 0; i < 26; i++) { g.beginPath(); g.arc(rnd() * W, rnd() * H, 2 + rnd() * 2.5, 0, 7); g.fill(); }
    g.strokeStyle = b; g.lineWidth = 5; g.strokeRect(14, 14, W - 28, H - 28);
  } else if (t.draw === 'tree') {
    g.strokeStyle = b; g.fillStyle = b; g.lineCap = 'round';
    const limb = (x, y, an, len, w) => { if (len < 14) { g.beginPath(); g.ellipse(x, y, 7, 4, an, 0, 7); g.fill(); return; } const x2 = x + Math.cos(an) * len, y2 = y + Math.sin(an) * len; g.lineWidth = w; g.beginPath(); g.moveTo(x, y); g.lineTo(x2, y2); g.stroke(); limb(x2, y2, an - 0.5, len * 0.72, w * 0.7); limb(x2, y2, an + 0.45, len * 0.72, w * 0.7); };
    limb(W / 2, H - 26, -Math.PI / 2, 78, 15);
    g.lineWidth = 5; g.strokeRect(14, 14, W - 28, H - 28); g.lineWidth = 2; g.strokeRect(24, 24, W - 48, H - 48);
  } else { // wavy checkerboard
    const n = 9, w = W / n, h = H / 6;
    g.fillStyle = b;
    for (let i = 0; i < n; i++) for (let j = 0; j < 6; j++) if ((i + j) % 2) { g.beginPath(); for (let k = 0; k <= 8; k++) { const u = k / 8; g.lineTo(i * w + u * w + Math.sin((j * h) / 40) * 10, j * h + Math.sin((i + u) * 1.6) * 9); } for (let k = 8; k >= 0; k--) { const u = k / 8; g.lineTo(i * w + u * w + Math.sin(((j + 1) * h) / 40) * 10, (j + 1) * h + Math.sin((i + u) * 1.6) * 9); } g.fill(); }
  }
  for (let i = 0; i < 2600; i++) { g.fillStyle = `rgba(${rnd() < 0.5 ? '0,0,0' : '255,255,255'},${rnd() * 0.06})`; g.fillRect(rnd() * W, rnd() * H, 2, 2); } // a little weave
  target.tex.needsUpdate = true;
}
function buildTapestryLine(T) {
  const { x, z, width, height } = T.line, grp = new THREE.Group();
  grp.position.set(x, 0, z); scene.add(grp);
  for (const s of [-1, 1]) mesh(new THREE.CylinderGeometry(0.05, 0.06, height + 0.5, 7), lambert(0x8a6a3a), s * (width / 2 + 0.12), (height + 0.5) / 2, 0, grp);
  mesh(new THREE.CylinderGeometry(0.015, 0.015, width + 0.24, 5), lambert(0xd9c8a4), 0, height + 0.38, 0, grp).rotation.z = Math.PI / 2;
  tapLook.canvas = document.createElement('canvas'); tapLook.canvas.width = 512; tapLook.canvas.height = 340;
  tapLook.tex = new THREE.CanvasTexture(tapLook.canvas); tapLook.tex.colorSpace = THREE.SRGBColorSpace;
  tapLook.cloth = mesh(new THREE.PlaneGeometry(width, height - 0.15), new THREE.MeshLambertMaterial({ map: tapLook.tex, side: THREE.DoubleSide }), 0, height / 2 + 0.38, 0, grp);
  tapLook.cloth.castShadow = true; windy(tapLook.cloth, width, height - 0.15);
  tapLook.group = grp; tapLook.list = T.list; tapLook.data = T; grp.visible = false;
}
function tapestryShow() { // called every frame: cheap unless what is hanging has changed
  const s = state.tapestry;
  if (!tapLook.group || !s) return;
  const key = `${Object.keys(s.owned).length}|${s.up}`;
  if (key === tapLook.shown) return;
  tapLook.shown = key;
  tapLook.group.visible = Object.keys(s.owned).length > 0; // the poles go in when you bring your first one home
  const t = tapLook.list.find((q) => q.id === s.up);
  tapLook.cloth.visible = !!t;
  if (t) paintTapestry(t);
}
function buildFishPools(FISH) { // a short plank jetty and a blue-flagged post at each pool
  for (const b of FISH.pools) {
    mesh(new THREE.BoxGeometry(1.1, 0.08, 2.4), lambert(0x8a6a3c), b.x, 0.16, b.z - 0.9);
    for (const [dx, dz] of [[-0.5, -0.1], [0.5, -0.1], [-0.5, -1.9], [0.5, -1.9]]) mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.5, 6), lambert(0x6b4a2b), b.x + dx, 0.1, b.z + dz);
    mesh(new THREE.CylinderGeometry(0.035, 0.045, 1.5, 6), lambert(0x6b4a2b), b.x + 1.2, 0.75, b.z + 0.4);
    mesh(new THREE.BoxGeometry(0.36, 0.2, 0.02), new THREE.MeshBasicMaterial({ color: 0x3aa0ff }), b.x + 1.38, 1.36, b.z + 0.4).castShadow = false;
  }
}
function buildRiverBends(RIVER) {
  RIVER_BENDS = RIVER.bends;
  for (const b of RIVER.bends) {
    const bar = mesh(new THREE.CircleGeometry(2.1, 20), lambert(0xb89f77), b.x, 0.03, b.z - 0.6); bar.rotation.x = -Math.PI / 2; bar.scale.set(1.5, 1, 1); bar.castShadow = false;
    for (const [dx, dz, r] of [[-1.6, -0.3, 0.28], [1.4, -0.7, 0.36], [0.3, -1.3, 0.22], [-0.7, -1.1, 0.18]]) mesh(new THREE.SphereGeometry(r, 7, 5), lambert(0x8d8a84), b.x + dx, r * 0.5, b.z + dz).scale.y = 0.6;
    mesh(new THREE.CylinderGeometry(0.035, 0.045, 1.5, 6), lambert(0x6b4a2b), b.x + 1.9, 0.75, b.z + 0.5);
    mesh(new THREE.BoxGeometry(0.36, 0.2, 0.02), new THREE.MeshBasicMaterial({ color: 0xffd23f }), b.x + 2.08, 1.36, b.z + 0.5).castShadow = false;
  }
  const s = campLook.sluice = new THREE.Group();
  mesh(new THREE.BoxGeometry(0.5, 0.08, 1.5), lambert(0xa9824f), 0, 0.14, 0, s);
  for (const x of [-0.25, 0.25]) mesh(new THREE.BoxGeometry(0.05, 0.2, 1.5), lambert(0x8a6a3c), x, 0.2, 0, s);
  for (const z of [-0.5, -0.2, 0.1, 0.4]) mesh(new THREE.BoxGeometry(0.46, 0.05, 0.04), lambert(0x6b4a2b), 0, 0.2, z, s);
  s.rotation.x = 0.12; s.visible = false; scene.add(s);
}
// ---- the corner crew: whoever is hired for the night stands at their station by the crate
const crewModels = {};
let seenAct = null; // the last thing life.js asked your character to act out
const CREW_SPOT = { fill: [1.6, 0.1, -1.75], front: [-1.9, 1.1, 0.4], cash: [-0.7, -0.5, 0.1], run: [2.05, 1.05, -0.2] }; // the filler stands at the tank and faces it; the runner is one arm's reach from the filler
const coolerGrip = new THREE.Vector3(); // the top of the cooler's pull handle, in the cooler's own space
const crewAt = {}; // station -> the character standing there this frame
const crewProp = { mesh: null, col: 0 }; // the balloon being passed down the line
const cV1 = new THREE.Vector3(), cV2 = new THREE.Vector3(), cV3 = new THREE.Vector3();
const inOut = (t, a, b, c, d) => smooth01((t - a) / (b - a)) * (1 - smooth01((t - c) / (d - c))); // ease in between a and b, hold, ease out between c and d
// Steer one hand to a point in the world: works out where the elbow has to be, then turns the two arm bones. w is how far to go, 0 to 1.
function reach(ch, side, target, w) {
  const B = ch.bones, arm = B[side + 'Arm'], fore = B[side + 'ForeArm'], hand = B[side + 'Hand'];
  if (!arm || !fore || !hand || w <= 0.001) return;
  ch.root.updateMatrixWorld(true);
  (B.RightShoulder || B.RightArm).getWorldPosition(bRight); (B.LeftShoulder || B.LeftArm).getWorldPosition(bA); bRight.sub(bA).setY(0).normalize();
  arm.getWorldPosition(bS); fore.getWorldPosition(bE); hand.getWorldPosition(bHand);
  const L1 = bS.distanceTo(bE), L2 = bE.distanceTo(bHand);
  bDir.copy(target).sub(bS); const d = Math.max(0.05, Math.min(bDir.length(), (L1 + L2) * 0.98)); bDir.normalize();
  const along = (L1 * L1 - L2 * L2 + d * d) / (2 * d), out = Math.sqrt(Math.max(0, L1 * L1 - along * along));
  bPole.set(0, -1, 0).addScaledVector(bRight, side === 'Right' ? 0.7 : -0.7); bPole.addScaledVector(bDir, -bPole.dot(bDir)).normalize();
  const elbow = cV3.copy(bS).addScaledVector(bDir, along).addScaledVector(bPole, out), tip = bMouth.copy(bS).addScaledVector(bDir, d);
  aimBone(arm, fore, elbow, w);
  aimBone(fore, hand, tip, w);
}
const TANK_TOP = () => cV1.set(CORNER[0] + 0.95, 1.5, CORNER[1] - 0.1); // the nozzle of the tank at your corner
const spotOf = (st, y, dz = 0) => { const p = crewAt[st].root.position; return new THREE.Vector3(p.x, y, p.z + dz); };
// One sale, acted down the line in about three seconds: the front waves them in, the filler fills one at the tank and passes it,
// the runner takes it and holds it out to the buyer, and cash takes the money. Whoever is missing is skipped.
function crewSaleMove(ch, st, t) {
  if (st === 'front') { if (t < CREW_POSE.greet.secs) poseOn(ch, CREW_POSE.greet, Math.sin(Math.PI * Math.min(1, t / CREW_POSE.greet.secs * 1.15)) ** 0.6); return; }
  const handoff = crewAt.fill && crewAt.run ? spotOf('fill', 1.28).lerp(spotOf('run', 1.28), 0.5) : crewAt.fill ? spotOf('fill', 1.25, 0.6) : null;
  if (st === 'fill') {
    const atTank = inOut(t, 0.15, 0.45, 1.0, 1.25), nozzle = TANK_TOP();
    reach(ch, 'Left', cV2.copy(nozzle).setY(nozzle.y - 0.12), atTank); reach(ch, 'Right', nozzle, atTank); // one hand on the valve, one on the nozzle
    if (handoff) reach(ch, 'Right', handoff, inOut(t, 1.1, 1.35, 1.6, 1.9));
    const b = ch.bones.Spine01; if (b) b.rotation.x += 0.16 * atTank;
  } else if (st === 'run') {
    if (handoff) reach(ch, 'Right', handoff, inOut(t, 1.3, 1.55, 1.75, 1.95)); else reach(ch, 'Right', TANK_TOP(), inOut(t, 1.0, 1.3, 1.5, 1.8));
    reach(ch, 'Right', spotOf('run', 1.3, 0.62), inOut(t, 1.9, 2.15, 2.55, 2.9)); // out to the buyer
  } else if (st === 'cash') {
    reach(ch, 'Right', spotOf('cash', 1.12, 0.55), inOut(t, 1.3, 1.6, 2.1, 2.45)); // palm out for the money
    const h = ch.bones.Head; if (h) h.rotation.x += Math.sin(t * 11) * 0.12 * inOut(t, 2.0, 2.2, 2.6, 2.9); // counting it
  }
}
function crewBalloon() { // the balloon itself: it swells at the nozzle, rides the filler's hand, then the runner's, and is gone with the buyer
  const act = state.corner.act, m = crewProp.mesh || (crewProp.mesh = (() => { const x = new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 10), new THREE.MeshLambertMaterial({ color: 0xff5d8f })); x.castShadow = true; x.visible = false; scene.add(x); return x; })());
  const t = act && act.kind === 'sale' && (crewAt.fill || crewAt.run) ? state.t - act.at : -1;
  if (t < 0.3 || t > 2.85) { m.visible = false; return; }
  if (crewProp.act !== act) { crewProp.act = act; m.material.color.setHex(pick(BALLOON.colours)); }
  const size = smooth01((t - 0.3) / 0.75) * (1 - smooth01((t - 2.6) / 0.25));
  const carrier = t < 1.15 ? null : t < 1.65 ? crewAt.fill || crewAt.run : crewAt.run || (t < 1.9 ? crewAt.fill : null);
  if (t >= 1.15 && !carrier) { m.visible = false; return; }
  if (carrier) { carrier.bones.RightHand.getWorldPosition(m.position); m.position.y += 0.17; } else { m.position.copy(TANK_TOP()); m.position.y += 0.06 + 0.15 * size; }
  m.scale.setScalar(Math.max(0.001, size)); m.visible = true;
}
// What the crew do with their hands. Same rig and axes as Moonbeam's (see MOON_POSE): arm x- brings a hand forward, RightArm z- lifts it out.
const CREW_POSE = {
  greet: { secs: 1.1, bones: { RightArm: [0, 0, -1.3], RightForeArm: [0, 0, -0.7], Head: [0.1, 0, 0] }, wobble: { bone: 'RightForeArm', axis: 2, amount: 0.4, speed: 14 } }, // the front waves the next one in
  pump: { secs: 1.2, bones: { RightArm: [-1.1, 0, 0], LeftArm: [-0.85, 0, 0], Spine01: [0.2, 0, 0], Head: [0.2, 0, 0] }, wobble: { bone: 'RightForeArm', axis: 0, amount: 0.35, speed: 17 } }, // the filler leans to the tank and cracks the valve
  take: { secs: 1.0, bones: { RightArm: [-1.2, 0, 0], RightForeArm: [-0.35, 0, 0], Spine01: [0.1, 0, 0] }, wobble: { bone: 'Head', axis: 0, amount: 0.14, speed: 11 } }, // cash holds a hand out and counts it with a nod
  hand: { secs: 1.1, bones: { RightArm: [-1.3, 0, 0], LeftArm: [-1.3, 0, 0], Spine01: [0.24, 0, 0] } }, // the runner passes it over with both hands
  sorry: { secs: 1.5, bones: { RightArm: [0, 0, -0.45], LeftArm: [0, 0, 0.45], RightForeArm: [-0.8, 0, 0], LeftForeArm: [-0.8, 0, 0] }, wobble: { bone: 'Head', axis: 1, amount: 0.35, speed: 8 } }, // open hands, a shake of the head
  look: { secs: 1.2, bones: { Head: [0, 0.55, 0], Spine01: [0, 0.2, 0] } }, // everyone else turns to watch
  laugh: { secs: 1.1, bones: { Spine01: [-0.16, 0, 0] }, wobble: { bone: 'Head', axis: 0, amount: 0.22, speed: 18 } },
  groove: { secs: 0, bones: {}, wobble: { bone: 'Head', axis: 0, amount: 0.1, speed: 5.2 } }, // between sales they all nod to the same beat
};
// One thing happens at the corner and each station plays its part, one after the other down the line: [pose, seconds after it starts].
const CREW_BEAT = {
  sale: { front: ['greet', 0], fill: ['pump', 0.3], cash: ['take', 0.95], run: ['hand', 1.45] },
  wave: { front: ['sorry', 0], fill: ['look', 0.15], cash: ['look', 0.2], run: ['look', 0.25] },
  pop: { fill: ['sorry', 0], front: ['look', 0.1], cash: ['laugh', 0.25], run: ['laugh', 0.3] },
};
function poseOn(ch, pose, w) {
  for (const [name, r] of Object.entries(pose.bones)) { const b = ch.bones[name]; if (b) { b.rotation.x += r[0] * w; b.rotation.y += r[1] * w; b.rotation.z += r[2] * w; } }
  if (pose.wobble) { const b = ch.bones[pose.wobble.bone]; if (b) b.rotation['xyz'[pose.wobble.axis]] += Math.sin(state.t * pose.wobble.speed) * pose.wobble.amount * w; }
}
function crewAct(ch, st) { // call after the mixer has moved the bones for this frame
  if (ch.bones.Hips && ch.actions.Idle) { // the shared idle swings the whole body about; at work they face the job
    if (!ch.hipsRest) { const t = ch.actions.Idle.getClip().tracks.find((x) => x.name === 'Hips.quaternion'); ch.hipsRest = t ? new THREE.Quaternion().fromArray(t.values, 0) : ch.bones.Hips.quaternion.clone(); }
    ch.bones.Hips.quaternion.slerp(ch.hipsRest, 0.85);
  }
  const act = state.corner.act;
  if (act && act.kind === 'sale' && state.t - act.at < 3) { poseOn(ch, CREW_POSE.groove, 0.5); crewSaleMove(ch, st, state.t - act.at); return; }
  const part = act && CREW_BEAT[act.kind] && CREW_BEAT[act.kind][st], pose = part && CREW_POSE[part[0]], age = part ? state.t - act.at - part[1] : -1;
  if (pose && age >= 0 && age < pose.secs) poseOn(ch, pose, Math.sin(Math.PI * Math.min(1, age / pose.secs * 1.15)) ** 0.6); // ease in, hold, ease out
  else poseOn(ch, CREW_POSE.groove, 1);
} // metres from the crate, and which way they face
// ---- Fern, the gardener you hire by the day: she is at your garden while she is on, working her way along the plots.
let fern = null;
function fernStand(dt) {
  if (!fern) return;
  const on = (state.day || 0) * 24 + (state.hour || 0) < ((state.gardener && state.gardener.until) || 0) && state.mode !== 'creator';
  fern.root.visible = on;
  if (!on) return;
  const n = Math.max(1, Math.min(3, (state.plots || []).length || 1)), i = Math.floor(state.t / 9) % n; /* a few seconds at each plot in the front row */
  const tx = CAMP.garden[0] - i * 1.6, tz = CAMP.garden[1] + 0.95, p = fern.root.position, dx = tx - p.x, dz = tz - p.z, d = Math.hypot(dx, dz);
  if (d > 6) p.set(tx, 0, tz); /* just hired, or the garden was moved */
  else if (d > 0.05) { const step = Math.min(d, dt * 1.1); p.x += dx / d * step; p.z += dz / d * step; }
  const want = d > 0.15 ? Math.atan2(dx, dz) : Math.PI; /* walking: face where she is going; at a plot: face it */
  let turn = want - fern.root.rotation.y; turn = Math.atan2(Math.sin(turn), Math.cos(turn)); fern.root.rotation.y += turn * Math.min(1, dt * 6);
  fern.mixer.update(dt);
}
function crewStand(dt) {
  const c = state.corner;
  if (!c) return;
  const now = (state.day || 0) * 24 + (state.hour || 0), on = {};
  const scattered = now < (c.scatterUntil || 0); // run off by Officer Dan's people: the corner stands empty until they drift back
  if (campLook.corner && campLook.corner.visible && !scattered) for (const st in CREW_SPOT) { const seat = c.crew && c.crew[st]; if (seat && now < seat.until && !(c.left && c.left[seat.id])) on[seat.id] = st; }
  for (const k in crewAt) delete crewAt[k];
  for (const id in on) { const who = id === 'whip' ? whip : crewModels[id]; if (who) crewAt[on[id]] = who; }
  for (const st in crewAt) { const [dx, dz, ry] = CREW_SPOT[st]; crewAt[st].root.position.set(CORNER[0] + dx, 0, CORNER[1] + dz); crewAt[st].root.rotation.y = ry; } // everyone is in place before anyone reaches for anyone
  if (whip) { // Whip has his own model: on duty he comes over to the tank, off duty he is back behind the Costume Shop
    const st = on.whip;
    if (st) { const [dx, dz, ry] = CREW_SPOT[st]; whip.root.position.set(CORNER[0] + dx, 0, CORNER[1] + dz); whip.root.rotation.y = ry; crewAct(whip, st); }
    else if (whip.root.position.x !== WHIP[0]) { whip.root.position.set(WHIP[0], 0, WHIP[1]); whip.root.rotation.y = -1.9; }
  }
  for (const id in crewModels) {
    const ch = crewModels[id], st = on[id];
    ch.root.visible = !!st;
    if (!st) continue;
    const [dx, dz, ry] = CREW_SPOT[st];
    ch.root.position.set(CORNER[0] + dx, 0, CORNER[1] + dz); ch.root.rotation.y = ry;
    ch.mixer.update(dt);
    crewAct(ch, st);
  }
  crewBalloon();
}
async function loadCharacter(url) {
  const gltf = await loader.loadAsync(url);
  gltf.scene.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = true; o.frustumCulled = false;
      // No reflections in this scene, so treat every surface as matte or metal parts render black.
      o.material.metalness = 0; o.material.metalnessMap = null; o.material.roughness = 0.88; o.material.roughnessMap = null; o.material.envMapIntensity = 0.45;
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
  if (look.bag || (state.craft && state.craft.made.sling)) worn.add('bag'); // the cup-holder sling you made shows up on you
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
  const saved = readSave();
  if (saved) {
    $('cont').textContent = `Continue: ${saved.look.name}, ${saveLabel(saved)}`;
    $('cont').classList.remove('hidden');
    $('cont').onclick = () => continueGame(saved);
    $('go').textContent = 'New game \u2192';
  }
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
  // In the Healing Village the pixel blur is politely swapped for a sunflower.
  const fc = document.createElement('canvas');
  fc.width = fc.height = 128;
  const fg = fc.getContext('2d');
  fg.translate(64, 64);
  for (let ring = 0; ring < 2; ring++) for (let i = 0; i < 16; i++) {
    fg.save(); fg.rotate(i * Math.PI / 8 + ring * Math.PI / 16);
    fg.fillStyle = ring ? '#ffd23f' : '#f5a623'; fg.strokeStyle = '#8a5a00'; fg.lineWidth = 2;
    fg.beginPath(); fg.ellipse(0, -40 + ring * 5, 9, 22 - ring * 3, 0, 0, 7); fg.fill(); fg.stroke(); fg.restore();
  }
  fg.fillStyle = '#5a3414'; fg.beginPath(); fg.arc(0, 0, 22, 0, 7); fg.fill();
  fg.fillStyle = '#7a4a22'; for (let i = 0; i < 60; i++) fg.fillRect(Math.cos(i * 2.4) * Math.sqrt(i) * 2.6, Math.sin(i * 2.4) * Math.sqrt(i) * 2.6, 2, 2);
  const flower = new THREE.CanvasTexture(fc);
  flower.colorSpace = THREE.SRGBColorSpace;
  const tones = ['#d9a07a', '#c98e69', '#e6b592', '#b87d5a', '#f0c4a4', '#a86f4f'];
  let t = 0;
  const repaint = () => { for (let y = 0; y < 6; y++) for (let x = 0; x < 8; x++) { g.fillStyle = pick(tones); g.fillRect(x, y, 1, 1); } tex.needsUpdate = true; };
  repaint();
  return { sprite, update(dt, target, speed, sunflower) {
    const want = sunflower ? flower : tex;
    if (sprite.material.map !== want) { sprite.material.map = want; sprite.scale.set(sunflower ? 0.62 : 0.62, sunflower ? 0.62 : 0.46, 1); }
    if (sunflower) sprite.material.rotation += dt * 0.8; else sprite.material.rotation = 0;
    t += dt; if (t > 0.09) { t = 0; repaint(); }
    // The censor is its own object: it lags behind him when he sprints and has to catch up.
    const k = speed > 4 ? 13 : 30;
    sprite.position.lerp(target, Math.min(1, dt * k));
  } };
}

// ---------------------------------------------------------------- game state
const keys = {};
const cam = { yaw: 0, pitch: 0.2, dist: 4.6 };
const state = { mode: 'load', t: 0, vibes: 0.45, bath: null, village: { elder: false, bath: false, water: false }, zone: '', zonesSeen: new Set(), buckS: 0, buckSpeed: 0, canMove: false, dialogue: null, onDialogueEnd: null };
let patches, buck, vinny, elder, whip, moonbeam, censor, water;
const goons = []; // Vinny's men: one model, a different tracksuit colour each
const hips = new THREE.Vector3(), tmp = new THREE.Vector3();

function say(lines, onEnd) {
  state.dialogue = { lines, i: 0 };
  state.onDialogueEnd = onEnd;
  showLine();
}
// Lines that have a recorded voice: the text exactly as written in the dialogue -> the file in game/assets/voice.
const VOICE = {
  'Well, well. A new face. Welcome home, family.': 'patches-1', "Name's Patches. Folks call me the Mayor of Shakedown Street. Nobody voted, and nobody's complained yet.": 'patches-2',
  'So here is how it all works. Through that gate is the Street. Past that, the camps. And past the camps you will find the—': 'patches-3', '...ah. That’s Buck. He does that.': 'patches-4',
  'Tell you what, family — go after him. Knows these grounds better than anybody, even if he’s got no idea he’s givin’ you the tour. Just don’t lose him.': 'patches-5',
  'Oh — hey, family. Beautiful day, huh?': 'buck-1', 'You’re drippin’, kid. Drink some water.': 'buck-2',
};
let voiceNow = null;
function speak(text) {
  if (voiceNow) { voiceNow.pause(); voiceNow = null; }
  const file = VOICE[text];
  if (!file) return;
  voiceNow = new Audio(`./assets/voice/${file}.m4a`); voiceNow.volume = 0.9; voiceNow.play().catch(() => {}); // browsers refuse sound before the first key or click; the line still shows
}
function showLine() {
  const d = state.dialogue;
  if (!d) return;
  if (d.i >= d.lines.length) { if (voiceNow) { voiceNow.pause(); voiceNow = null; } state.dialogue = null; portrait.set(null); $('dialogue').classList.add('hidden'); const f = state.onDialogueEnd; state.onDialogueEnd = null; if (f) f(); return; }
  const [who, text] = d.lines[d.i];
  // the speaker's face sits beside the line, and the line types itself out while they talk
  const face = { Vinny: vinny, Whip: whip, Patches: patches, 'Village Elder': elder, '???': buck, 'Free Spirit / Buck': buck }[who] || null;
  portrait.set(face);
  $('dialogue').classList.toggle('hasface', !!face);
  d.text = text; d.shown = 0;
  speak(text);
  $('who').textContent = who; $('line').textContent = '';
  $('dialogue').classList.remove('hidden');
}
function advance() {
  const d = state.dialogue;
  if (!d || d.locked) return;
  if (d.text && d.shown < d.text.length) { d.shown = d.text.length; $('line').textContent = d.text; return; } // first press finishes the line
  d.i++; showLine();
}
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
  if (inVillage(x, z) && x < -22) return 'Healing Village';
  if (z <= -142) return 'The River';
  if (x <= -25 && z < -92 && z > -140) return 'Main Stage Field';
  if (z <= -69) return 'The Campgrounds';
  if (z <= -13.5) return 'Shakedown Street';
  return 'The Parking Lot';
}

let creatorPlate = null;
function creatorBackdrop(on) { // a big out-of-focus photograph behind the character, only while the creator is up
  if (on && !creatorPlate) {
    const tex = new THREE.TextureLoader().load('./assets/shots/creator-lot.jpg'); tex.colorSpace = THREE.SRGBColorSpace;
    creatorPlate = new THREE.Mesh(new THREE.PlaneGeometry(13.6, 7.6), new THREE.MeshBasicMaterial({ map: tex, fog: false, toneMapped: false }));
    creatorPlate.position.set(-0.55, 1.05, 5.2); /* its horizon sits at your eye level, a few steps behind you */ creatorPlate.rotation.y = Math.PI; scene.add(creatorPlate);
  }
  if (creatorPlate) creatorPlate.visible = on;
}
function startCreator() {
  state.mode = 'creator';
  creatorBackdrop(true);
  $('loading').classList.add('hidden');
  $('creator').classList.remove('hidden'); $('spinhint').classList.remove('hidden');
  player.root.position.set(0, 0, 1.5);
  player.root.rotation.y = Math.PI * 0.94; // facing the gate; the creator camera stands in front of them
  play(player, 'Idle');
}
// Pick up a saved game: skip the creator and the opening, and drop you where you were.
function continueGame(saved) {
  Object.assign(look, saved.look);
  for (const id of ['age', 'height', 'build']) $(id).value = look[id];
  $('pname').value = look.name;
  sync();
  creatorBackdrop(false);
  $('creator').classList.add('hidden'); $('spinhint').classList.add('hidden');
  $('hud').classList.remove('hidden');
  state.mode = 'free'; state.canMove = true;
  state.zonesSeen = new Set(saved.zones || []);
  player.root.position.set(saved.pos[0], 0, saved.pos[1]);
  player.root.rotation.y = saved.pos[2];
  cam.yaw = saved.pos[2] + Math.PI; cam.pitch = 0.2;
  life.load(saved);
  life.startQuest();
  banner('Welcome back');
}
function startGame() {
  creatorBackdrop(false);
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
    state.mode = 'done';
    play(buck, 'Walk');
    $('tour').innerHTML = [...state.zonesSeen].map((z) => `<li>${z}</li>`).join('');
    setTimeout(() => $('done').classList.remove('hidden'), 2600);
  });
}

// ---------------------------------------------------------------- things you can walk up to and use
const interactables = [
  { at: VILLAGE.elder, r: 3.2, label: 'Talk', use: talkToElder },
  { at: [VILLAGE.bath[0] + 1.6, VILLAGE.bath[1] + 1.2], r: 3.6, label: 'Join the sound bath', use: startBath },
  { at: VILLAGE.chill, r: 5.2, label: 'Chill-Out Tent: water and a cot', use: () => life.chill(drinkWater) },
];
let nearby = null, nearbyText = '';
function updateInteractions() {
  const p = player.root.position;
  const open = state.canMove && !state.dialogue && !state.bath && (state.mode === 'chase' || state.mode === 'free');
  const hit = open ? interactables.find((i) => (i.test ? i.test(p) : Math.hypot(p.x - i.at[0], p.z - i.at[1]) < i.r)) : null;
  const text = hit ? (typeof hit.label === 'function' ? hit.label() : hit.label) : '';
  if (hit !== nearby || text !== nearbyText) {
    nearby = hit; nearbyText = text;
    if (hit) $('prompt').innerHTML = `<kbd>E</kbd> ${text}`;
    if (state.mode !== 'riverwait') $('prompt').classList.toggle('hidden', !hit);
  }
}
function villageQuest() {
  if (state.mode !== 'free') return;
  quest('Good Vibes Only', [['elder', 'Meet the village elder'], ['bath', 'Join a sound bath'], ['water', 'Drink water at the Chill-Out Tent']]);
  for (const k of Object.keys(state.village)) if (state.village[k]) tick(k);
}
function villageDone(key) {
  state.village[key] = true;
  tick(key);
}
function talkToElder() {
  state.canMove = false;
  const first = !state.village.elder;
  say(first ? [
    ['Village Elder', 'Slow down, friend. You are breathing like someone who has been chasing something.'],
    ['Village Elder', 'This is the Healing Village. Nobody sells you anything here, and nobody is in a hurry.'],
    ['Village Elder', 'Sit with the bowls by the river if your head is loud. If your body is loud, the Chill-Out Tent has water and a cot.'],
    ['Village Elder', 'And when you are steady yourself, look around. Half this festival is sunburnt, sore or scared. Somebody ought to walk out there and help them.'],
  ] : [
    ['Village Elder', state.vibes > 0.75 ? 'There it is. You look like you finally landed.' : 'Still carrying it, I see. The bowls are by the river.'],
  ], () => { state.canMove = true; villageDone('elder'); if (first) life.xp('charisma', 3); else life.elderShop(); });
}
function drinkWater() {
  if (state.needs.hydration < 0.7) life.xp('wellness', 1);
  state.needs.hydration = 1;
  banner('Hydrated');
  villageDone('water');
}
// Sound bath: breathe with the ring. Press Space as the moving ring meets the still one.
function startBath() {
  state.canMove = false;
  state.bath = { t: 0, round: 0, hits: 0, pressed: false };
  $('bath').classList.remove('hidden');
  $('bathmsg').textContent = 'Breathe with the bowl. Press Space when the rings meet.';
  $('prompt').classList.add('hidden');
}
function bathPress() {
  const b = state.bath;
  if (!b || b.pressed || b.t < 0.6) return;
  b.pressed = true;
  const off = Math.abs(b.phase - 1);
  const good = off < 0.16;
  if (good) { b.hits++; state.vibes = Math.min(1, state.vibes + 0.1); }
  $('bathmsg').textContent = good ? ['Ahhh.', 'There it is.', 'Let it ring.', 'Good.', 'Beautiful.'][b.round % 5] : (b.phase < 1 ? 'A little early. No rush.' : 'A little late. Let it come to you.');
  $('bathring').style.borderColor = good ? '#2ec4b6' : '#ff5d8f';
}
function updateBath(dt) {
  const b = state.bath;
  b.t += dt;
  const cycle = 3.2, local = b.t % cycle;
  b.phase = local / (cycle * 0.75); // reaches 1 (rings meet) three quarters of the way through each breath
  $('bathring').style.transform = `translate(-50%,-50%) scale(${0.25 + Math.min(b.phase, 1.25) * 0.75})`;
  const round = Math.floor(b.t / cycle);
  if (round !== b.round) {
    b.round = round; b.pressed = false; $('bathring').style.borderColor = '#ffc93c';
    if (round >= 5) {
      $('bath').classList.add('hidden');
      const hits = b.hits; state.bath = null; state.canMove = true;
      banner(hits >= 4 ? 'Vibes way up' : hits >= 2 ? 'Vibes up' : 'A bit calmer');
      villageDone('bath');
      life.xp('wellness', 1 + hits);
    }
  }
}

// ---------------------------------------------------------------- input
window.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT') return;
  if (e.code === 'KeyG' && gfx) gfx.cycle();
  if (e.code === 'KeyN') banner(sound.toggleMute() ? 'Sound off' : 'Sound on');
  if (life && life.key(e)) { e.preventDefault(); return; }
  keys[e.code] = true;
  if (e.code === 'KeyE' || e.code === 'Space' || e.code === 'Enter') {
    if (state.bath) { if (e.code === 'Space') bathPress(); }
    else if (state.dialogue) advance();
    else if (nearby && e.code === 'KeyE') nearby.use();
    else if (state.mode === 'riverwait' && !$('prompt').classList.contains('hidden')) talkToBuck();
    e.preventDefault();
  }
});
window.addEventListener('keyup', (e) => { keys[e.code] = false; });
$('dialogue').addEventListener('click', advance);
$('again').onclick = () => location.reload();
$('explore').onclick = () => {
  $('done').classList.add('hidden');
  state.mode = 'free'; state.canMove = true;
  $('quest').classList.add('hidden');
  banner('Go wherever you like');
  life.startQuest();
};
let drag = null;
$('view').addEventListener('pointerdown', (e) => {
  if (state.cooking) { life.cookClick(e.clientX / window.innerWidth); return; } drag = { x: e.clientX, y: e.clientY }; $('view').setPointerCapture(e.pointerId); });
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
  const sprint = moving && (keys.ShiftLeft || keys.ShiftRight) && !state.noSprint;
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
  censor.update(dt, hips, state.buckSpeed, inVillage(b.x, b.z) && b.x < -22);
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
  draw();
  requestAnimationFrame(frame);
}
// While you cook, the screen is the view over your stove; otherwise it is the world.
function draw() { if (state.cooking && cookView) cookView.render(); else { if (state.dialogue) portrait.render(); gfx.render(); } }
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
        if (z === 'Healing Village') villageQuest(); else if (life) life.showQuest();
        if (state.mode === 'chase') { if (z === 'The Campgrounds') tick('street'); if (z === 'Main Stage Field') tick('camp'); if (z === 'The River' || z === 'Healing Village') tick('stage'); }
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
    updateInteractions();
    if (state.bath) updateBath(dt);
    if (elder && Math.hypot(p.x - VILLAGE.elder[0], p.z - VILLAGE.elder[1]) < 9) faceTo(elder.root, p.x - VILLAGE.elder[0], p.z - VILLAGE.elder[1], dt, 3);
    for (const ch of [player, patches, buck, vinny, elder, whip, moonbeam, ...goons]) if (ch && ch.root.visible) ch.mixer.update(dt);
    if (moonbeam) moonbeamShift(dt);
    crewStand(dt);
    fernStand(dt);
    carLights();
    campLayoutTick();
    clothWind();
    if (state.act && state.act !== seenAct) { seenAct = state.act; if (state.act.kind === 'balloon') startBalloon(player); }
    balloonTick(dt);
    if (state.towing && campModels.cooler && campLook.cooler.userData.towed && state.mode !== 'creator') { // your hand is on the cooler's handle, behind you
      campLook.cooler.updateMatrixWorld(true);
      reach(player, 'Right', campLook.cooler.localToWorld(coolerGrip.set(0.0, 0.95, -0.27)), 1);
    }
    tapestryShow();
    if (campLook.sluice && state.river) { const sl = state.river.sluice, b = sl && sl.bend >= 0 ? RIVER_BENDS[sl.bend] : null; campLook.sluice.visible = !!b; if (b) campLook.sluice.position.set(b.x - 0.6, 0, b.z - 1.5); }
    const d = state.dialogue;
    const typing = !!(d && d.text && d.shown < d.text.length);
    if (typing) { d.shown = Math.min(d.text.length, d.shown + dt * 42); $('line').textContent = d.text.slice(0, Math.floor(d.shown)); }
    portrait.update(dt, typing);
    updateCamera(dt);
    sun.target.position.copy(p);
    sun.position.copy(p).addScaledVector(SUN_DIR, 70);
    if (life) life.update(dt);
    updateCooler();
    updateCamp(dt);
    soundClock -= dt;
    if (soundClock <= 0) { // count the people close by a couple of times a second
      soundClock = 0.4; let near = 0;
      for (const f of people) if (!f.away && Math.abs(f.x - p.x) < 14 && Math.abs(f.z - p.z) < 14) near++;
      crowdNear = Math.min(1, near / 14);
    }
    const playing = state.mode !== 'creator' && !state.cooking && !state.decking, showtime = !!crowd && crowd.week(state.day || 0, state.hour ?? 16).music;
    sound.update(dt, {
      moving: playing && (player.current === 'Walk' || player.current === 'Run'), running: player.current === 'Run',
      rain: playing && !!(state.weather && state.weather.rain), crowd: playing ? crowdNear : 0,
      stage: playing && showtime ? Math.max(0, 1 - Math.hypot(p.x + 70, p.z + 121) / 95) ** 1.5 : 0,
    });
  }
  if (crowd && life && !['load', 'creator'].includes(state.mode)) crowd.update(dt, state.t, { hour: state.hour, day: state.day, total: state.day * 24 + state.hour, rain: !!state.weather.rain, heal: state.heal.ids, px: player.root.position.x, pz: player.root.position.z });
  if (gfx && player) {
    const now = (state.day || 0) * 24 + (state.hour || 0), wetWant = state.weather && state.weather.rain ? 1 : state.rainedAt !== undefined && now - state.rainedAt < 2 ? 0.45 : 0;
    groundWet.value += (wetWant - groundWet.value) * Math.min(1, dt * 0.4); gfx.wet = groundWet.value; // the ground soaks and dries slowly
    gfx.update(dt, state.t, player.root.position);
  }
}

// ---------------------------------------------------------------- boot
async function boot() {
  const steps = 8; let n = 0;
  const step = (msg) => { n++; $('bar').firstElementChild.style.width = `${n / steps * 100}%`; $('loadmsg').textContent = msg; };
  const skyTex = await new THREE.TextureLoader().loadAsync('./assets/sky.jpg'); step('Painting the sky…');
  const tl = new THREE.TextureLoader();
  const [grass, dirt] = await Promise.all([tl.loadAsync('./assets/ground-grass.jpg'), tl.loadAsync('./assets/ground-dirt.jpg')]);
  const sky = buildSky(skyTex), land = buildGround(grass, dirt);
  water = land.water;
  gfx = createGraphics({ renderer, scene, camera, sky, ground: GROUND, maskCanvas: land.maskCanvas, maskTexture: land.mask, label: $('gfx'), lights: { sun, hemi, ambient, dir: SUN_DIR } });
  gfx.setTime(16.33);
  gfx.upgradeWater(water);
  await loadProps(() => step('Pitching tents…'));
  // the stage's screen and lamps give off their own light
  Object.assign(PROPS.stage.mat, { emissiveMap: PROPS.stage.mat.map, emissive: new THREE.Color(0xffffff), emissiveIntensity: 0.55 });
  for (const n of ['dome', 'chilltent', 'foodstall', 'merchstall', 'apothecary', 'canopy']) if (PROPS[n].mat) Object.assign(PROPS[n].mat, { emissiveMap: PROPS[n].mat.map, emissive: new THREE.Color(0xffffff), emissiveIntensity: 0.12 });
  const CARQ = await (await fetch(`./data/car.json?v=${BUILD}`)).json(); // Where's My Car: the spots and the lines
  carQuestData = CARQ; // buildWorld places its van and your car along with everything else
  buildWorld();
  gfx.paintFootprints(colliders, [{ x: -66.5, z: -158.5, r: 4 }, { x: -70, z: -121, r: 13 }]);
  gfx.addBulbs(bulbSpots);
  gfx.addBeams([-130, -125.5, -121, -116.5, -112].map((z, i) => [-66.5, PROPS.stage.height * 0.82, z, [0xff4fa0, 0x49e0d0, 0xffd24a, 0x8f6aff, 0xff4fa0][i]]));

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
  try {
    elder = await loadCharacter('./assets/elder.glb');
    addAction(elder, 'Idle', prepClip(elder.clips[0], 'Idle'));
    elder.root.position.set(VILLAGE.elder[0], 0, VILLAGE.elder[1]); elder.root.rotation.y = 1.2;
    play(elder, 'Idle'); scene.add(elder.root); solid(VILLAGE.elder[0], VILLAGE.elder[1], 0.45);
  } catch (e) { console.warn('Elder not loaded', e); }
  try {
    whip = await loadCharacter('./assets/whip.glb');
    addAction(whip, 'Idle', prepClip(idle, 'Idle', true));
    whip.root.position.set(WHIP[0], 0, WHIP[1]); whip.root.rotation.y = -1.9;
    play(whip, 'Idle'); scene.add(whip.root); solid(WHIP[0], WHIP[1], 0.45);
  } catch (e) { console.warn('Whip not loaded', e); }
  try { // Moonbeam's own model. If it will not load, the crowd figure standing on the moon rug stays as it was.
    moonbeam = await loadCharacter('./assets/moonbeam.glb');
    addAction(moonbeam, 'Idle', prepClip(idle, 'Idle', true));
    addAction(moonbeam, 'Walk', prepClip(player.clips[0], 'Walk', true), 1.05);
    const mx = CAMP.tent[0] + 5.4, mz = CAMP.tent[1] + 4.6;
    moonbeam.root.position.set(mx, 0, mz); moonbeam.root.rotation.y = -2.2; // facing your tent
    play(moonbeam, 'Idle'); moonbeam.mixer.update(1.7); scene.add(moonbeam.root);
    const stand = people.find((f) => f.x === mx && f.z === mz), inst = stand && instanced[stand.name];
    moonbeam.stand = stand; moonbeam.home = [mx, mz, -2.2];
    if (stand) stand.s = 0.0001; // the stand-in steps aside: the crowd code redraws every figure at its own size, so shrink that
    if (inst) { inst.mesh.setMatrixAt(stand.n, new THREE.Matrix4().makeScale(0, 0, 0)); inst.mesh.instanceMatrix.needsUpdate = true; }
  } catch (e) { console.warn('Moonbeam not loaded', e); }
  try {
    const base = await loader.loadAsync('./assets/goon.glb');
    // two flank Vinny, one watches the Street once you are noticed, one collects at your camp after a truce
    const posts = [[4.9, -63.6, -Math.PI / 2 + 0.25, 0xe04a4a, 'flank'], [4.9, -57.4, -Math.PI / 2 - 0.25, 0x3f63c9, 'flank'], [3.6, -34, 1.5, 0x3aa35f, 'watch'], [CAMP.tent[0] + 1.2, CAMP.tent[1] + 6.6, -2.9, 0x9a6cf0, 'collect']];
    for (const [x, z, rot, tint, role] of posts) {
      const model = cloneSkinned(base.scene), root = new THREE.Group(), bones = {};
      model.traverse((o) => {
        if (o.isBone) bones[o.name] = o;
        if (!o.isMesh) return;
        o.castShadow = true; o.frustumCulled = false;
        o.material = o.material.clone();
        Object.assign(o.material, { metalness: 0, metalnessMap: null, roughness: 0.88, roughnessMap: null, envMapIntensity: 0.45 });
        // Recolour only the pale grey tracksuit: skin and the dark bag are too colourful or too dark to count as grey.
        const dye = new THREE.Color(tint);
        o.material.onBeforeCompile = (shader) => {
          shader.uniforms.uDye = { value: dye };
          shader.fragmentShader = shader.fragmentShader.replace('#include <common>', '#include <common>\nuniform vec3 uDye;')
            .replace('#include <map_fragment>', `#include <map_fragment>
              float gMax = max(diffuseColor.r, max(diffuseColor.g, diffuseColor.b)), gMin = min(diffuseColor.r, min(diffuseColor.g, diffuseColor.b));
              float cloth = (1.0 - smoothstep(0.035, 0.11, gMax - gMin)) * smoothstep(0.1, 0.24, gMax) * (1.0 - smoothstep(0.72, 0.9, gMin));
              diffuseColor.rgb = mix(diffuseColor.rgb, uDye * (0.35 + gMax * 1.5), cloth);`);
        };
        o.material.customProgramCacheKey = () => 'goon-dye';
      });
      root.add(model); root.position.set(x, 0, z); root.rotation.y = rot;
      const g = { root, model, mixer: new THREE.AnimationMixer(model), bones, actions: {}, current: null, role };
      addAction(g, 'Idle', prepClip(idle, 'Idle', true)); play(g, 'Idle');
      g.mixer.update(Math.random() * 3); // so they do not breathe in step
      scene.add(root); goons.push(g);
      if (role === 'flank') solid(x, z, 0.45);
    }
  } catch (e) { console.warn('Goons not loaded', e); }
  step('Ready');

  cookView = createCookView({ renderer });
  buildCampLook();
  buildLitter();
  for (let i = 0; i < 5; i++) { // pink crosses that float over people who need a healer
    const m = new THREE.Group(), pink = new THREE.MeshBasicMaterial({ color: 0xff5d8f });
    mesh(new THREE.BoxGeometry(0.34, 0.1, 0.1), pink, 0, 0, 0, m).castShadow = false;
    mesh(new THREE.BoxGeometry(0.1, 0.34, 0.1), pink, 0, 0, 0, m).castShadow = false;
    m.visible = false; scene.add(m); healMarks.push(m);
  }
  const DATA = await (await fetch(`./data/garden.json?v=${BUILD}`)).json(); // crops, mushrooms and recipes live in a plain data file
  const CROWD = await (await fetch(`./data/crowd.json?v=${BUILD}`)).json(); // where everybody is through the day
  crowd = createCrowd({ THREE, people, instanced, routeSamples, data: CROWD, rand, isFree: (x, z) => !nearRoute(x, z, 2) && !colliders.some((c) => (c.x - x) ** 2 + (c.z - z) ** 2 < (c.r + 0.8) ** 2) });
  const RIVER = await (await fetch(`./data/river.json?v=${BUILD}`)).json(); // gold panning: the bends, the pans, the odds
  const panGame = createPan({ $, rules: RIVER, sfx: (name) => sound.play(name) });
  const FISH = await (await fetch(`./data/fish.json?v=${BUILD}`)).json(); // fishing: the pools, the fish, the fight
  const fishGame = createFishing({ $, rules: FISH, sfx: (name) => sound.play(name) });
  buildFishPools(FISH);
  buildRiverBends(RIVER);
  const TAPESTRY = await (await fetch(`./data/tapestry.json?v=${BUILD}`)).json(); // tapestries: what the stall sells and where the line stands
  buildTapestryLine(TAPESTRY);
  buildCanopies();
  campInit();
  const CREW = await (await fetch(`./data/crew.json?v=${BUILD}`)).json(); // the corner crew: stations, people, how each is earned
  const CRATE = await (await fetch(`./data/crate.json?v=${BUILD}`)).json(); // the tracks and the rules of a set
  const decks = createDecks({ $, crate: CRATE, isMuted: () => sound.isMuted() });
  (async () => { // the crew models load in the background, so the game does not wait on them
    for (const id of ['brody', 'doc', 'marge', 'juniper', 'tiny']) {
      try {
        const ch = await loadCharacter(`./assets/crew-${id}.glb`);
        addAction(ch, 'Idle', prepClip(idle, 'Idle', true));
        play(ch, 'Idle'); ch.mixer.update(Math.random() * 3); ch.root.visible = false; scene.add(ch.root);
        crewModels[id] = ch;
      } catch (e) { console.warn(`Crew model ${id} not loaded`, e); }
    }
  })();
  (async () => { try { const ch = await loadCharacter('./assets/fern.glb'); addAction(ch, 'Idle', prepClip(idle, 'Idle', true)); play(ch, 'Idle'); ch.root.visible = false; scene.add(ch.root); fern = ch; } catch (e) { console.warn('Fern not loaded', e); } })();
  loadCampModels(); // in the background too
  life = createLife({ DATA, CRATE, decks, BOOTH, crowd, COUNTER: CAMP.counter, CORNER, CREW, RIVER, TAPESTRY, FISH, FISHING: fishGame, CARQ, CAMP_PLOT, PAN: panGame, groves, wildMeshes, cook: cookView, onGear: showGear, litter, marks: healMarks, WHIP, say, sfx: (name) => sound.play(name), PERMIT, PILE, SHOWERS, look, $, state, keys, people, interactables, banner, card, quest, tick, zoneAt, gfx, CAMP, VILLAGE, STALLS, getPlayer: () => player });
  buildCreatorUI(); sync();
  startCreator();
  window.__game = { state, look, player, buck, patches, cam, keys, sync, startGame, advance, sound, decks, crowd, people, interactables, get moonbeam() { return moonbeam; }, get fern() { return fern; }, crewModels, tapLook, showGear, CAMP, canopyLook, windCloths, crewAt, crewProp, startBalloon, BALLOON, balloonActs, campModels, CAMP_MODEL, campLook, CREW_POSE, CREW_BEAT, get whip() { return whip; }, fishing: fishGame, MOON_POSE, pan: panGame, step: (n, dt = 1 / 30) => { for (let i = 0; i < n; i++) update(dt); draw(); }, gfx, life };
  frame();
}
boot().catch((e) => { console.error(e); $('loadmsg').textContent = 'Could not load: ' + e.message; });

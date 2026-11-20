// SHAKEDOWN grilled cheese, first person: you look down at your camp stove and flip the
// sandwiches with a spatula. One pan, or two once you own the second burner.
// life.js runs the timing rules; this file is only what you see and hear.
import * as THREE from 'three';

// How the cooked face looks at each point of the timing bar (0 = just on, 1 = left far too long).
const TOAST = [[0, '#f4e6c3'], [0.42, '#eed9a6'], [0.54, '#dfa64a'], [0.65, '#cf8a2c'], [0.76, '#a8641f'], [0.86, '#5a3115'], [1, '#1c110a']].map(([t, c]) => [t, new THREE.Color(c)]);
function toastColour(t, out) {
  for (let i = 1; i < TOAST.length; i++) if (t <= TOAST[i][0]) return out.copy(TOAST[i - 1][1]).lerp(TOAST[i][1], (t - TOAST[i - 1][0]) / (TOAST[i][0] - TOAST[i - 1][0]));
  return out.copy(TOAST[TOAST.length - 1][1]);
}
const ease = (u) => u * u * (3 - 2 * u);
const clamp01 = (v) => Math.min(1, Math.max(0, v));

function canvasTexture(size, paint) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  paint(c.getContext('2d'), size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function createCookView({ renderer }) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x24331c);
  const camera = new THREE.PerspectiveCamera(48, 1, 0.01, 20);
  const hemi = new THREE.HemisphereLight(0xfff1dd, 0x3a3320, 1.1);
  const key = new THREE.DirectionalLight(0xffe2b8, 2.2);
  key.position.set(-0.5, 1.2, 0.5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -0.8, right: 0.8, top: 0.6, bottom: -0.6, near: 0.1, far: 4 });
  key.shadow.bias = -0.0008;
  const flameLight = new THREE.PointLight(0xff9a3c, 0.5, 1.4);
  scene.add(hemi, key, flameLight);
  const add = (geo, mat, x, y, z, parent = scene) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; parent.add(m); return m; };
  const std = (color, rough = 0.7, metal = 0) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });

  // ---- the camp: a beaten-up folding table on the grass
  const wood = canvasTexture(512, (g, n) => {
    g.fillStyle = '#7a5433'; g.fillRect(0, 0, n, n);
    for (let i = 0; i < 9; i++) { g.fillStyle = i % 2 ? '#6d4a2c' : '#85603c'; g.fillRect(0, i * n / 9, n, n / 9 - 3); }
    for (let i = 0; i < 900; i++) { g.strokeStyle = `rgba(40,24,12,${Math.random() * 0.25})`; g.beginPath(); const y = Math.random() * n; g.moveTo(Math.random() * n, y); g.lineTo(Math.random() * n, y + (Math.random() - 0.5) * 6); g.stroke(); }
    for (let i = 0; i < 14; i++) { g.fillStyle = 'rgba(30,18,8,0.35)'; g.beginPath(); g.ellipse(Math.random() * n, Math.random() * n, 5 + Math.random() * 14, 3 + Math.random() * 6, Math.random(), 0, 7); g.fill(); }
  });
  const tableMat = new THREE.MeshStandardMaterial({ map: wood, roughness: 0.85 });
  new THREE.TextureLoader().load('./assets/shots/cook-table.jpg', (t) => { t.colorSpace = THREE.SRGBColorSpace; tableMat.map = t; tableMat.needsUpdate = true; }); // a photograph of a camp table; the painted planks stay if it does not load
  add(new THREE.BoxGeometry(2.2, 0.03, 1.0), tableMat, 0, -0.125, 0.02);
  const grassTex = new THREE.TextureLoader().load('./assets/shots/cook-ground.jpg');
  grassTex.colorSpace = THREE.SRGBColorSpace; grassTex.wrapS = grassTex.wrapT = THREE.MirroredRepeatWrapping; grassTex.repeat.set(2, 2);
  const lawn = add(new THREE.PlaneGeometry(9, 9), new THREE.MeshStandardMaterial({ map: grassTex, roughness: 1 }), 0, -0.85, -1.5);
  lawn.rotation.x = -Math.PI / 2; lawn.castShadow = false;

  // ---- the stove body (stretches when there are two burners) and its upgrades
  const body = add(new THREE.BoxGeometry(0.46, 0.07, 0.3), std(0x7c8f52, 0.5, 0.25), 0, -0.075, 0);
  const top = add(new THREE.BoxGeometry(0.47, 0.012, 0.31), std(0x2b2f22, 0.5, 0.5), 0, -0.036, 0);
  const guard = new THREE.Group(); // level 2: a foil wind guard
  const foil = new THREE.MeshStandardMaterial({ color: 0xd8dde2, roughness: 0.28, metalness: 0.9, side: THREE.DoubleSide });
  const guardBack = add(new THREE.PlaneGeometry(0.26, 0.17), foil, 0, 0.05, -0.2, guard);
  const guardL = add(new THREE.PlaneGeometry(0.26, 0.17), foil, -0.2, 0.05, -0.1, guard); guardL.rotation.y = 1.0;
  const guardR = add(new THREE.PlaneGeometry(0.26, 0.17), foil, 0.2, 0.05, -0.1, guard); guardR.rotation.y = -1.0;
  scene.add(guard);
  const iron = std(0x242424, 0.5, 0.75);
  const flameMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.5, 0.9, 2.6), transparent: true, opacity: 0.85 });
  const PAN_Y = 0.0;

  // ---- bread and cheese
  const HALF = 0.058, R = 0.016, THICK = 0.015;
  const breadShape = new THREE.Shape();
  breadShape.moveTo(-HALF + R, -HALF);
  breadShape.lineTo(HALF - R, -HALF); breadShape.absarc(HALF - R, -HALF + R, R, -Math.PI / 2, 0);
  breadShape.lineTo(HALF, HALF - R * 1.6); breadShape.absarc(HALF - R * 1.6, HALF - R * 1.6, R * 1.6, 0, Math.PI / 2);
  breadShape.lineTo(-HALF + R * 1.6, HALF); breadShape.absarc(-HALF + R * 1.6, HALF - R * 1.6, R * 1.6, Math.PI / 2, Math.PI);
  breadShape.lineTo(-HALF, -HALF + R); breadShape.absarc(-HALF + R, -HALF + R, R, Math.PI, Math.PI * 1.5);
  const sliceGeo = new THREE.ExtrudeGeometry(breadShape, { depth: THICK, bevelEnabled: true, bevelThickness: 0.0025, bevelSize: 0.0025, bevelSegments: 2, curveSegments: 8 });
  sliceGeo.rotateX(-Math.PI / 2); // lie flat: thickness runs up
  const faceGeo = new THREE.ShapeGeometry(breadShape, 8);
  const crumb = canvasTexture(256, (g, n) => {
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, n, n);
    for (let i = 0; i < 1700; i++) { const v = 200 + Math.random() * 55; g.fillStyle = `rgba(${v},${v - 8},${v - 20},${0.25 + Math.random() * 0.5})`; g.beginPath(); g.arc(Math.random() * n, Math.random() * n, 0.6 + Math.random() * 2.4, 0, 7); g.fill(); }
    for (let i = 0; i < 260; i++) { g.fillStyle = `rgba(120,90,50,${Math.random() * 0.22})`; g.beginPath(); g.ellipse(Math.random() * n, Math.random() * n, 1 + Math.random() * 4, 1 + Math.random() * 2, Math.random() * 3, 0, 7); g.fill(); }
  });
  const tmpC = new THREE.Color();
  function makeSandwich() {
    const g = new THREE.Group();
    const slices = [-1, 1].map((side) => {
      const crust = new THREE.MeshStandardMaterial({ color: 0xd9b072, roughness: 0.85 });
      add(sliceGeo, crust, 0, side < 0 ? -THICK - 0.004 : 0.004, 0, g);
      const faceMat = new THREE.MeshStandardMaterial({ map: crumb, color: 0xf4e6c3, roughness: 0.75, side: THREE.DoubleSide });
      const face = add(faceGeo, faceMat, 0, side < 0 ? -THICK - 0.0068 : THICK + 0.0068, 0, g);
      face.rotation.x = -Math.PI / 2; face.castShadow = false; // same turn as the slice so the outlines match
      return { crust, faceMat, toast: 0 };
    });
    const cheeseMat = new THREE.MeshStandardMaterial({ color: 0xffb52e, roughness: 0.35 });
    const cheese = add(new THREE.BoxGeometry(HALF * 2.04, 0.007, HALF * 2.04), cheeseMat, 0, 0, 0, g);
    const drips = [];
    for (let i = 0; i < 9; i++) {
      const a = i / 9 * 6.28 + Math.random() * 0.5, e = HALF * 1.02;
      const d = add(new THREE.SphereGeometry(0.008, 8, 6), cheeseMat, Math.max(-e, Math.min(e, Math.cos(a) * e * 1.4)), -0.002, Math.max(-e, Math.min(e, Math.sin(a) * e * 1.4)), g);
      d.scale.setScalar(0.01); drips.push(d);
    }
    return { group: g, slices, cheese, drips, flips: 0 };
  }
  function paint(s) {
    for (const sl of s.slices) {
      sl.faceMat.color.copy(toastColour(sl.toast, tmpC));
      sl.crust.color.set(0xd9b072).lerp(tmpC.set(0x2a1a0f), clamp01(sl.toast - 0.35) * 0.75);
    }
    const melt = clamp01((s.slices[0].toast + s.slices[1].toast) / 1.1);
    s.drips.forEach((d, i) => d.scale.set(0.01 + melt * (0.9 + (i % 3) * 0.3), 0.01 + melt * 0.5, 0.01 + melt * (0.9 + (i % 2) * 0.4)));
    s.cheese.scale.y = 1 - melt * 0.35;
  }
  const REST_Y = PAN_Y + THICK + 0.0075;

  // ---- toppings: little cut vegetables that drop in and tuck into the filling, poking out all round the edge
  const TOP_MAT = {
    goldleaf: new THREE.MeshStandardMaterial({ color: 0xffd23f, roughness: 0.22, metalness: 0.85, emissive: 0x6b4a00, emissiveIntensity: 0.5 }),
    pearl: std(0x15121c, 0.18, 0.3), fillet: std(0xf3e6d8, 0.6), skin: std(0x9db7c4, 0.3, 0.6),
    red: std(0xe0392b, 0.45), pink: std(0xf58a78, 0.5), seed: std(0xf7e6a6, 0.5),
    green: std(0x3f9d4a, 0.5), pale: std(0xd4ecb0, 0.55), leaf: std(0x4caf50, 0.6), stalk: std(0x2f7d3a, 0.6),
    cream: std(0xeadfc8, 0.7), gill: std(0xcdbfa3, 0.8), gold: std(0xe8a33d, 0.6), goldDark: std(0xc9822b, 0.7), brown: std(0x7a5a3a, 0.85), tan: std(0xd9c8a4, 0.8),
  };
  const TOP_GEO = {
    disc: new THREE.CylinderGeometry(0.017, 0.017, 0.006, 18), inner: new THREE.CylinderGeometry(0.0125, 0.0125, 0.0066, 16), seed: new THREE.SphereGeometry(0.0022, 5, 4),
    ring: new THREE.TorusGeometry(0.0115, 0.0042, 7, 16), core: new THREE.CylinderGeometry(0.008, 0.008, 0.003, 12),
    leaf: new THREE.SphereGeometry(0.013, 8, 6), cap: new THREE.SphereGeometry(0.016, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), stem: new THREE.CylinderGeometry(0.004, 0.0055, 0.016, 7),
    morel: new THREE.ConeGeometry(0.009, 0.026, 7),
  };
  function makePiece(kind) {
    const g = new THREE.Group();
    if (kind === 'goldflake') { // torn scraps of gold leaf: thin, bright, each at its own angle
      for (let j = 0; j < 4; j++) { const f = add(new THREE.BoxGeometry(0.012 + (j % 2) * 0.006, 0.0012, 0.009 + (j % 3) * 0.004), TOP_MAT.goldleaf, (j % 2 ? 1 : -1) * 0.006 * j, 0.002 * j, (j - 1.5) * 0.006, g); f.rotation.set(j * 0.5, j * 1.3, j * 0.4); }
    } else if (kind === 'caviar') { // a little heap of black pearls
      for (let j = 0; j < 7; j++) { const a = j / 7 * 6.28, r = j === 6 ? 0 : 0.006; add(TOP_GEO.seed, TOP_MAT.pearl, Math.cos(a) * r, j === 6 ? 0.004 : 0.001, Math.sin(a) * r, g).scale.setScalar(1.7); }
    } else if (kind === 'fish') { // a flake of pale fillet with a strip of silver skin
      add(new THREE.BoxGeometry(0.03, 0.006, 0.014), TOP_MAT.fillet, 0, 0, 0, g); add(new THREE.BoxGeometry(0.03, 0.0015, 0.014), TOP_MAT.skin, 0, 0.0038, 0, g);
    } else if (kind === 'tomato') { // a round slice: red skin, pink flesh, pale seeds
      add(TOP_GEO.disc, TOP_MAT.red, 0, 0, 0, g); add(TOP_GEO.inner, TOP_MAT.pink, 0, 0, 0, g);
      for (let j = 0; j < 5; j++) { const a = j / 5 * 6.28; add(TOP_GEO.seed, TOP_MAT.seed, Math.cos(a) * 0.0075, 0.0034, Math.sin(a) * 0.0075, g); add(TOP_GEO.seed, TOP_MAT.seed, Math.cos(a) * 0.0075, -0.0034, Math.sin(a) * 0.0075, g); }
    } else if (kind === 'pepper') { // a jalapeño ring: green skin, pale middle
      add(TOP_GEO.ring, TOP_MAT.green, 0, 0, 0, g).rotation.x = Math.PI / 2; add(TOP_GEO.core, TOP_MAT.pale, 0, 0, 0, g);
    } else if (kind === 'herbs') { // a sprig: three leaves on a stalk
      for (const [x, z, r] of [[0.008, 0, 0], [-0.004, 0.007, 2.2], [-0.004, -0.007, -2.2]]) { const l = add(TOP_GEO.leaf, TOP_MAT.leaf, x, 0, z, g); l.scale.set(1, 0.16, 0.5); l.rotation.y = r; }
      add(TOP_GEO.stem, TOP_MAT.stalk, -0.012, 0, 0, g).rotation.z = Math.PI / 2;
    } else if (kind === 'morel') { // a little honeycombed cone on a pale stem
      add(TOP_GEO.morel, TOP_MAT.brown, 0.006, 0, 0, g).rotation.z = -Math.PI / 2; add(TOP_GEO.stem, TOP_MAT.tan, -0.011, 0, 0, g).rotation.z = Math.PI / 2;
    } else { // oyster (cream) or chanterelle (gold): a sliced cap on a short stem, lying on its side
      const gold = kind === 'chanterelle';
      const cap = add(TOP_GEO.cap, gold ? TOP_MAT.gold : TOP_MAT.cream, 0.004, 0, 0, g); cap.rotation.z = -Math.PI / 2; cap.scale.set(1, 0.55, 1);
      add(TOP_GEO.core, gold ? TOP_MAT.goldDark : TOP_MAT.gill, 0.0035, 0, 0, g).rotation.z = Math.PI / 2;
      add(TOP_GEO.stem, gold ? TOP_MAT.goldDark : TOP_MAT.cream, -0.008, 0, 0, g).rotation.z = Math.PI / 2;
    }
    return g;
  }
  // Eight places round the edge of the sandwich; a second topping takes the gaps between the first.
  function addTopping(s, kind) {
    s.tops = s.tops || [];
    const nth = new Set(s.tops.map((p) => p.kind)).size, theta = s.group.rotation.z, up = [Math.sin(theta), Math.cos(theta)];
    for (let j = 0; j < 8; j++) {
      const a = (j + (nth % 2) * 0.5) / 8 * Math.PI * 2 + 0.2, e = HALF * 1.1;
      const x = Math.max(-e, Math.min(e, Math.cos(a) * e * 1.45)), z = Math.max(-e, Math.min(e, Math.sin(a) * e * 1.45));
      const piece = makePiece(kind); piece.scale.setScalar(1.45);
      piece.rotation.y = -a + (kind === 'tomato' || kind === 'pepper' ? j : 0); // sprigs and mushrooms point outwards
      piece.rotation.x = (j % 3 - 1) * 0.18;
      const to = new THREE.Vector3(x, (nth % 2 ? 0.004 : -0.001) + (j % 2) * 0.002, z);
      const from = to.clone().add(new THREE.Vector3(up[0] * 0.24 + (j % 3 - 1) * 0.02, up[1] * 0.24, (j % 2 ? 0.03 : -0.03)));
      piece.position.copy(from); piece.visible = false;
      s.group.add(piece);
      s.tops.push({ kind, piece, from, to, t: -j * 0.055, spin: (j % 2 ? 1 : -1) * (3 + j) });
    }
  }
  function tickTops(s, dt) {
    if (!s || !s.tops) return;
    for (const p of s.tops) {
      if (p.t >= 0.34) continue;
      p.t += dt;
      const u = clamp01(p.t / 0.34);
      if (p.t < 0) continue;
      p.piece.visible = true;
      p.piece.position.lerpVectors(p.from, p.to, u * u); // it falls, speeding up
      p.piece.rotation.z = (1 - u) * p.spin;
      if (u >= 1) p.piece.rotation.z = 0;
    }
  }

  // ---- a burner with its pan. There are two; the second only shows once you own it.
  function makeStation() {
    const g = new THREE.Group();
    scene.add(g);
    const grate = add(new THREE.TorusGeometry(0.1, 0.006, 6, 28), std(0x1a1a1a, 0.5, 0.7), 0, -0.022, 0, g);
    grate.rotation.x = Math.PI / 2;
    const flames = [];
    for (let i = 0; i < 16; i++) {
      const a = i / 16 * Math.PI * 2;
      const f = add(new THREE.ConeGeometry(0.011, 0.034, 6), flameMat, Math.cos(a) * 0.158, -0.018, Math.sin(a) * 0.158, g);
      f.castShadow = f.receiveShadow = false; flames.push(f);
    }
    const pan = new THREE.Group();
    g.add(pan);
    add(new THREE.CylinderGeometry(0.165, 0.15, 0.012, 40), iron, 0, PAN_Y - 0.006, 0, pan);
    const wall = add(new THREE.CylinderGeometry(0.172, 0.165, 0.035, 40, 1, true), new THREE.MeshStandardMaterial({ color: 0x161616, roughness: 0.42, metalness: 0.75, side: THREE.DoubleSide }), 0, PAN_Y + 0.012, 0, pan);
    wall.castShadow = false;
    const handle = add(new THREE.BoxGeometry(0.2, 0.014, 0.03), iron, -0.19, PAN_Y + 0.022, 0.16, pan);
    handle.rotation.y = -0.95; // points back towards you
    const sheen = add(new THREE.CircleGeometry(0.15, 40), new THREE.MeshStandardMaterial({ color: 0x3a2c12, roughness: 0.12, metalness: 0.2, transparent: true, opacity: 0.55 }), 0, PAN_Y + 0.0012, 0, pan);
    sheen.rotation.x = -Math.PI / 2; sheen.castShadow = false; // a film of melted butter
    const bubbles = new THREE.InstancedMesh(new THREE.SphereGeometry(0.004, 6, 5), new THREE.MeshStandardMaterial({ color: 0xf6d86a, roughness: 0.2 }), 22);
    bubbles.castShadow = false;
    g.add(bubbles);
    const bub = Array.from({ length: 22 }, () => ({ a: Math.random() * 6.28, r: 0.075 + Math.random() * 0.03, ph: Math.random() * 6, sp: 5 + Math.random() * 6 }));
    return { group: g, pan, flames, bubbles, bub, current: null, anim: null, progress: 0, puffClock: 0 };
  }
  const stations = [makeStation(), makeStation()];
  let pans = 1;

  // ---- the plate and the spatula
  const plate = add(new THREE.CylinderGeometry(0.115, 0.085, 0.012, 32), std(0xf2efe6, 0.35), -0.4, -0.1, 0.14);
  const PLATE = new THREE.Vector3(-0.4, -0.092, 0.14);
  const plated = [];
  const spatula = new THREE.Group();
  add(new THREE.BoxGeometry(0.1, 0.0025, 0.085), std(0xc9ced3, 0.25, 0.9), 0, 0, 0, spatula);
  const neck = add(new THREE.BoxGeometry(0.07, 0.006, 0.014), std(0xc9ced3, 0.25, 0.9), 0.08, 0.008, 0, spatula);
  neck.rotation.z = 0.22;
  const grip = add(new THREE.CylinderGeometry(0.011, 0.013, 0.18, 12), std(0x2a2019, 0.6), 0.2, 0.03, 0, spatula);
  grip.rotation.z = Math.PI / 2 - 0.16;
  scene.add(spatula);
  const IDLE = new THREE.Vector3(0.27, 0.05, 0.13);
  let lastBusy = null; // the pan the spatula is working on

  // ---- steam and smoke
  const puffTex = canvasTexture(64, (g, n) => { const r = g.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2); r.addColorStop(0, 'rgba(255,255,255,0.9)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, n, n); });
  const puffs = Array.from({ length: 48 }, () => {
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: puffTex, transparent: true, opacity: 0, depthWrite: false }));
    sp.visible = false; scene.add(sp);
    return { sp, life: 0, max: 1, vx: 0, vz: 0, base: 0.14 };
  });

  // ---- sound: a sizzle made from filtered noise, a hiss on the flip, a chime for a perfect one
  let audio = null, sizzleGain = null, source = null;
  function startAudio() {
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === 'suspended') audio.resume();
      const len = audio.sampleRate * 2, buf = audio.createBuffer(1, len, audio.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (0.6 + 0.4 * Math.random());
      source = audio.createBufferSource(); source.buffer = buf; source.loop = true;
      const hp = audio.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 3200;
      sizzleGain = audio.createGain(); sizzleGain.gain.value = 0;
      source.connect(hp).connect(sizzleGain).connect(audio.destination); source.start();
    } catch (e) { audio = null; }
  }
  function blip(freqs, type = 'sine', vol = 0.12, dur = 0.16) {
    if (!audio) return;
    freqs.forEach((f, i) => {
      const o = audio.createOscillator(), g = audio.createGain(), t = audio.currentTime + i * 0.09;
      o.type = type; o.frequency.value = f; g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.connect(g).connect(audio.destination); o.start(t); o.stop(t + dur + 0.02);
    });
  }
  function hiss() { if (sizzleGain && audio) { sizzleGain.gain.cancelScheduledValues(audio.currentTime); sizzleGain.gain.setValueAtTime(0.32, audio.currentTime); sizzleGain.gain.linearRampToValueAtTime(0.07, audio.currentTime + 0.5); } }

  let time = 0;
  const pointer = { x: 0, y: 0 };
  window.addEventListener('pointermove', (e) => { pointer.x = e.clientX / window.innerWidth - 0.5; pointer.y = e.clientY / window.innerHeight - 0.5; });
  const local = new THREE.Vector3();

  const view = {
    active: false,
    start(light, stoveLevel = 1) {
      view.active = true;
      pans = stoveLevel >= 4 ? 2 : 1;
      for (const p of plated.splice(0)) scene.remove(p.group);
      stations.forEach((s, i) => {
        if (s.current) s.group.remove(s.current.group);
        s.current = null; s.anim = null; s.progress = 0;
        s.group.visible = i < pans;
        s.group.position.x = pans === 2 ? (i ? 0.21 : -0.21) : 0;
        const k = stoveLevel >= 3 ? 1.08 : 1;
        s.pan.scale.set(k, stoveLevel >= 3 ? 1.35 : 1, k); // the cast-iron pan is bigger and deeper
      });
      iron.roughness = stoveLevel >= 3 ? 0.3 : 0.5; iron.color.set(stoveLevel >= 3 ? 0x0c0c0c : 0x242424);
      const wide = pans === 2 ? 1.95 : 1;
      body.scale.x = top.scale.x = wide;
      guard.visible = stoveLevel >= 2;
      guardBack.scale.x = pans === 2 ? 3.3 : 1; guardL.position.x = pans === 2 ? -0.47 : -0.2; guardR.position.x = pans === 2 ? 0.47 : 0.2;
      plate.position.x = PLATE.x = pans === 2 ? -0.66 : -0.4;
      IDLE.x = pans === 2 ? 0.52 : 0.27;
      lastBusy = null;
      view.setLight(light);
      startAudio();
    },
    stop() {
      view.active = false;
      if (source) { try { source.stop(); } catch (e) { /* already stopped */ } source = null; }
      sizzleGain = null;
    },
    setLight(l = [1, 1, 1]) {
      const night = l[0] < 0.4;
      hemi.intensity = night ? 0.35 : 1.1;
      key.intensity = night ? 0.5 : 2.2;
      key.color.setRGB(night ? 0.6 : 1, night ? 0.7 : 0.9, night ? 1 : 0.74);
      flameLight.intensity = night ? 1.6 : 0.5;
      scene.background.setRGB(l[0] * 0.14, l[1] * 0.2, l[2] * 0.12);
    },
    // A fresh sandwich drops into pan i.
    newSandwich(i) {
      const s = stations[i];
      s.current = makeSandwich();
      s.current.group.position.set(0.02, REST_Y + 0.22, 0);
      s.group.add(s.current.group);
      paint(s.current);
      s.progress = 0;
      s.anim = { kind: 'drop', t: 0, dur: 0.38 };
    },
    setProgress(i, x) { stations[i].progress = Math.max(0, x); },
    // A topping goes on the sandwich in pan i: cut pieces drop in from above and tuck into the edge.
    addTopping(i, kind) { const s = stations[i]; if (s && s.current) { addTopping(s.current, kind); blip([520, 700], 'triangle', 0.05, 0.1); } },
    // Flip it over: the side that was cooking is now on top, showing how you did.
    flip(i) { const s = stations[i]; s.anim = { kind: 'flip', t: 0, dur: 0.72, from: s.current.flips }; lastBusy = s; hiss(); },
    // Second side done: lift it out to the plate, cooked side up.
    plate(i, quality) {
      const s = stations[i];
      const to = PLATE.clone().add(new THREE.Vector3((plated.length % 2) * 0.02 - 0.01, 0.022 + plated.length * 0.043, 0)).sub(s.group.position);
      s.anim = { kind: 'plate', t: 0, dur: 0.95, start: s.current.group.position.clone(), to };
      lastBusy = s;
      hiss();
      if (quality === 'Perfect') blip([880, 1320, 1760], 'sine', 0.1, 0.22); else if (quality === 'Burnt') blip([150, 110], 'sawtooth', 0.08, 0.25); else blip([660, 880], 'triangle', 0.08, 0.15);
    },
    update(dt) {
      time += dt;
      for (const p of plated) tickTops(p, dt);
      // the spatula rests on the right, drifting a little with your hand
      let spPos = IDLE.clone().add(new THREE.Vector3(pointer.x * 0.06, Math.sin(time * 2.1) * 0.004 - pointer.y * 0.02, pointer.y * 0.05));
      let spRotZ = -0.35, spRotY = 0.25, spBusy = false;
      let hottest = 0, anyCooking = false;
      const m = new THREE.Matrix4();
      for (let i = 0; i < pans; i++) {
        const st = stations[i], s = st.current;
        tickTops(s, dt);
        // the side facing the pan browns as the marker moves
        if (s && !st.anim) {
          const bottom = s.slices[s.flips % 2 === 0 ? 0 : 1];
          bottom.toast = Math.max(bottom.toast, st.progress);
          paint(s);
        }
        if (st.anim && s) {
          const a = st.anim;
          a.t += dt;
          const u = clamp01(a.t / a.dur);
          const mine = lastBusy === st; // one spatula: it follows the pan you touched last
          if (a.kind === 'drop') {
            s.group.position.y = REST_Y + (1 - ease(u)) * 0.22;
            s.group.position.x = 0.02 * (1 - u);
            if (u >= 1) { s.group.position.set(0, REST_Y, 0); st.anim = null; hiss(); }
          } else if (a.kind === 'flip') {
            const slide = clamp01(u / 0.22), turn = clamp01((u - 0.2) / 0.55), out = clamp01((u - 0.8) / 0.2);
            s.group.rotation.z = Math.PI * (a.from + ease(turn));
            s.group.position.y = REST_Y + Math.sin(Math.PI * turn) * 0.13;
            s.group.position.x = -Math.sin(Math.PI * turn) * 0.015;
            if (mine) {
              local.set(0.27 - 0.24 * ease(slide) + out * 0.24, PAN_Y + 0.006 + Math.sin(Math.PI * Math.min(1, turn * 1.6)) * 0.09, 0.02 + (1 - ease(slide)) * 0.11);
              spPos = local.clone().add(st.group.position); spRotZ = -0.05 + Math.sin(Math.PI * Math.min(1, turn * 1.6)) * 1.25; spRotY = 0; spBusy = true;
            }
            if (u >= 1) { s.flips = a.from + 1; s.group.rotation.z = Math.PI * s.flips; s.group.position.set(0, REST_Y, 0); st.anim = null; st.progress = 0; }
          } else if (a.kind === 'plate') {
            const slide = clamp01(u / 0.2), carry = ease(clamp01((u - 0.18) / 0.62)), out = clamp01((u - 0.84) / 0.16);
            s.group.position.lerpVectors(a.start, a.to, carry);
            s.group.position.y += Math.sin(Math.PI * carry) * 0.16;
            s.group.rotation.z = Math.PI * (s.flips + carry);
            if (mine) {
              spPos = s.group.position.clone().add(st.group.position).add(new THREE.Vector3(0.03 + (1 - ease(slide)) * 0.22 + out * 0.3, -THICK - 0.012, 0.01));
              spRotZ = -0.05; spRotY = 0; spBusy = true;
            }
            if (u >= 1) { // it now belongs to the plate, not the pan
              s.flips += 1; s.group.rotation.z = Math.PI * s.flips;
              scene.attach(s.group); plated.push(s); st.current = null; st.anim = null;
            }
          }
        }
        // heat: flames flicker, butter bubbles
        const cooking = !!st.current && !st.anim;
        anyCooking = anyCooking || cooking;
        if (cooking) hottest = Math.max(hottest, st.progress);
        st.flames.forEach((f, j) => { f.scale.y = 0.8 + Math.sin(time * 23 + j * 1.7 + i) * 0.25 + Math.sin(time * 37 + j) * 0.12; });
        st.bub.forEach((b, j) => {
          const k = cooking ? Math.max(0, Math.sin(time * b.sp + b.ph)) * (0.6 + st.progress * 1.6) : 0;
          m.makeScale(k, k * 0.7, k); m.setPosition(Math.cos(b.a) * b.r, PAN_Y + 0.003, Math.sin(b.a) * b.r);
          st.bubbles.setMatrixAt(j, m);
        });
        st.bubbles.instanceMatrix.needsUpdate = true;
        // steam rises and turns to smoke as it burns
        const burning = cooking && st.progress > 0.78;
        st.puffClock += dt * (burning ? 22 : cooking ? 5 + st.progress * 6 : 1.2);
        while (st.puffClock > 1) {
          st.puffClock -= 1;
          const p = puffs.find((q) => q.life <= 0);
          if (!p) break;
          p.life = p.max = 0.9 + Math.random() * 0.9;
          p.sp.position.set(st.group.position.x + (Math.random() - 0.5) * 0.1, PAN_Y + 0.03, (Math.random() - 0.5) * 0.1);
          p.vx = (Math.random() - 0.5) * 0.04; p.vz = (Math.random() - 0.5) * 0.04;
          p.sp.material.color.setScalar(burning ? 0.22 : 1);
          p.base = burning ? 0.5 : 0.14;
          p.sp.visible = true;
        }
      }
      spatula.position.lerp(spPos, spBusy ? 1 : Math.min(1, dt * 9));
      spatula.rotation.set(0, spRotY, spRotZ);
      flameLight.intensity += (Math.random() - 0.5) * 0.06;
      for (const p of puffs) {
        if (p.life <= 0) continue;
        p.life -= dt;
        const u = 1 - p.life / p.max;
        p.sp.position.x += p.vx * dt; p.sp.position.z += p.vz * dt; p.sp.position.y += dt * (0.16 + u * 0.1);
        p.sp.scale.setScalar(0.05 + u * 0.16);
        p.sp.material.opacity = p.base * Math.sin(Math.PI * Math.min(1, u * 1.1));
        if (p.life <= 0) p.sp.visible = false;
      }
      if (sizzleGain && audio && !spBusy) sizzleGain.gain.setTargetAtTime(anyCooking ? 0.05 + hottest * 0.1 : 0.02, audio.currentTime, 0.1);
      // you, leaning over the stove: further back when there are two pans to watch
      const two = pans === 2;
      camera.position.set(pointer.x * 0.05 + Math.sin(time * 0.6) * 0.004, (two ? 0.74 : 0.6) + Math.sin(time * 0.9) * 0.004, two ? 0.56 : 0.44);
      camera.lookAt((two ? -0.08 : -0.03) + pointer.x * 0.03, -0.01, -0.02);
    },
    render() {
      const size = renderer.getSize(new THREE.Vector2());
      camera.aspect = size.x / size.y;
      camera.fov = camera.aspect < 1 ? 74 : pans === 2 ? 56 : 48; // on a narrow screen, pull back so the plate stays in view
      camera.updateProjectionMatrix();
      renderer.setRenderTarget(null);
      renderer.render(scene, camera);
    },
  };
  return view;
}

// SHAKEDOWN graphics: everything about how the frame is drawn, kept apart from the game rules.
// Sky reflections, contact shadows, glow, colour grading, swaying grass, reflective water,
// string lights, stage beams and fireflies, with three quality levels that step down by themselves
// if the machine cannot keep up.
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';

const LEVELS = ['Low', 'Medium', 'High'];

// Final look: a touch more contrast and colour, warm highlights, darker corners.
const GradeShader = {
  uniforms: { tDiffuse: { value: null }, uVignette: { value: 0.38 }, uSaturation: { value: 1.14 }, uContrast: { value: 1.06 } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: `uniform sampler2D tDiffuse; uniform float uVignette, uSaturation, uContrast; varying vec2 vUv;
    void main(){
      vec4 c = texture2D(tDiffuse, vUv);
      float l = dot(c.rgb, vec3(0.2126, 0.7152, 0.0722));
      c.rgb = mix(vec3(l), c.rgb, uSaturation);
      c.rgb = (c.rgb - 0.18) * uContrast + 0.18;
      c.rgb *= mix(vec3(0.96, 0.99, 1.06), vec3(1.06, 1.0, 0.92), smoothstep(0.05, 0.9, l)); // cool shadows, warm lights
      vec2 d = vUv - 0.5;
      c.rgb *= 1.0 - uVignette * smoothstep(0.25, 0.95, dot(d, d) * 2.2);
      gl_FragColor = vec4(max(c.rgb, 0.0), c.a);
    }`,
};

export function createGraphics({ renderer, scene, camera, sky, ground, maskCanvas, maskTexture, label, lights }) {
  const gfx = { level: 2, locked: false };
  const noAO = []; // things the contact-shadow pass must not see (they move in their own shaders or are see-through)
  const fancy = []; // things that only exist above Low

  // ---- sky light: bake the painted sky into a reflection map so every surface picks up its colours
  // Three skies are stacked and cross-faded by the clock: a blue day sky, the painted sunset, and a starry night.
  const skyCanvas = (paint) => { const c = document.createElement('canvas'); c.width = 1024; c.height = 512; paint(c.getContext('2d'), c.width, c.height); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = THREE.RepeatWrapping; return t; };
  const dayTex = skyCanvas((g, w, h) => {
    const grad = g.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#2f78c8'); grad.addColorStop(0.55, '#7db6e8'); grad.addColorStop(0.86, '#d9ecf7'); grad.addColorStop(1, '#bcd3c2');
    g.fillStyle = grad; g.fillRect(0, 0, w, h);
    g.filter = 'blur(7px)';
    for (let i = 0; i < 46; i++) { // soft painted clouds
      const x = Math.random() * w, y = h * (0.3 + Math.random() * 0.45), r = 20 + Math.random() * 60;
      for (let k = 0; k < 6; k++) { g.fillStyle = `rgba(255,255,255,${0.1 + Math.random() * 0.14})`; g.beginPath(); g.ellipse(x + (Math.random() - 0.5) * r * 2.4, y + (Math.random() - 0.5) * r * 0.4, r * (0.6 + Math.random()), r * 0.28, 0, 0, 7); g.fill(); }
      for (const dx of [-w, w]) { g.beginPath(); g.ellipse(x + dx, y, r, r * 0.28, 0, 0, 7); g.fill(); }
    }
  });
  const nightTex = skyCanvas((g, w, h) => {
    const grad = g.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#04060f'); grad.addColorStop(0.6, '#0b1230'); grad.addColorStop(0.88, '#1d2a55'); grad.addColorStop(1, '#101a2c');
    g.fillStyle = grad; g.fillRect(0, 0, w, h);
    g.filter = 'blur(18px)'; g.fillStyle = 'rgba(120,130,220,0.16)';
    for (let i = 0; i < 30; i++) { g.beginPath(); g.ellipse(Math.random() * w, h * (0.2 + i / 30 * 0.4), 90, 26, 0.5, 0, 7); g.fill(); } // a faint milky band
  });
  const dome = (radius, tex, order) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 330, 48, 1, true), new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide, fog: false, transparent: true, depthWrite: false }));
    m.position.copy(sky.position); m.renderOrder = order;
    scene.add(m);
    return m;
  };
  const daySky = dome(432, dayTex, -3), nightSky = dome(412, nightTex, -1);
  Object.assign(sky.material, { transparent: true, depthWrite: false }); sky.renderOrder = -2;
  const starPos = new Float32Array(1100 * 3);
  for (let i = 0; i < 1100; i++) { const a = Math.random() * 6.2832, e = 0.08 + Math.random() * 1.45, r = 395; starPos.set([Math.cos(a) * Math.cos(e) * r, Math.sin(e) * r, Math.sin(a) * Math.cos(e) * r - 70], i * 3); }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: new THREE.Color(2.2, 2.2, 2.6), size: 1.7, sizeAttenuation: false, transparent: true, opacity: 0, fog: false, depthWrite: false, toneMapped: false }));
  stars.frustumCulled = false; stars.renderOrder = -0.5;
  scene.add(stars);

  // ---- sky light: bake the current sky into a reflection map so every surface picks up its colours
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene();
  for (const d of [daySky, sky, nightSky]) { const c = new THREE.Mesh(d.geometry, d.material); c.position.copy(d.position); c.rotation.copy(d.rotation); c.renderOrder = d.renderOrder; envScene.add(c); }
  const envGround = new THREE.Mesh(new THREE.CircleGeometry(900, 24), new THREE.MeshBasicMaterial({ color: 0x4d5a2c }));
  envGround.rotation.x = -Math.PI / 2; envGround.position.y = -2;
  envScene.add(envGround);
  let envTarget = null, baked = [-1, -1];
  const bakeEnv = () => {
    const next = pmrem.fromScene(envScene, 0.03, 1, 1500);
    scene.environment = next.texture;
    if (envTarget) envTarget.dispose();
    envTarget = next;
  };

  // ---- the clock drives the light. hour is 0-24.
  const mix3 = (a, b, c, wa, wb, wc) => a.map((v, i) => v * wa + b[i] * wb + c[i] * wc);
  const bump = (h, mid, half) => Math.max(0, 1 - Math.abs(h - mid) / half);
  gfx.light = [1, 1, 1];
  gfx.setTime = (hour) => {
    const sunset = Math.min(1, Math.max(bump(hour, 19.0, 2.0), bump(hour, 6.2, 1.3)) * 1.35);
    const night = hour >= 20.2 ? Math.min(1, (hour - 20.2) / 1.1) : hour < 5.2 ? 1 : hour < 6.1 ? 1 - (hour - 5.2) / 0.9 : 0;
    const day = Math.max(0, 1 - Math.max(sunset, night));
    const wS = sunset * (1 - night), wN = night, wD = Math.max(0, 1 - wS - wN);
    sky.material.opacity = Math.min(1, sunset * 1.2);
    nightSky.material.opacity = night;
    stars.material.opacity = night * 0.9;
    // where the sun is: up in the east, high at midday, down into the painted sunset
    const t = Math.min(1, Math.max(0, (hour - 5.5) / 14.7));
    const az = t * 4.17, el = Math.max(0.13, Math.sin(Math.PI * t) * 1.08);
    if (night > 0.5) lights.dir.set(0.45, 0.7, 0.5).normalize(); // moonlight
    else lights.dir.set(Math.cos(az) * Math.cos(el), Math.sin(el), Math.sin(az) * Math.cos(el)).normalize();
    lights.sun.color.setRGB(...mix3([1, 0.96, 0.86], [1, 0.7, 0.42], [0.5, 0.62, 1], wD, wS, wN));
    lights.sun.intensity = 2.7 * wD + 2.3 * wS + 0.5 * wN;
    lights.hemi.intensity = 1.1 * wD + 0.95 * wS + 0.34 * wN;
    lights.hemi.color.setRGB(...mix3([0.85, 0.93, 1], [1, 0.88, 0.77], [0.4, 0.5, 0.85], wD, wS, wN));
    lights.ambient.intensity = 0.24 * wD + 0.22 * wS + 0.16 * wN;
    const fog = mix3([0.72, 0.84, 0.93], [0.95, 0.63, 0.42], [0.03, 0.045, 0.11], wD, wS, wN);
    scene.fog.color.setRGB(...fog); scene.background.setRGB(...fog);
    renderer.toneMappingExposure = 1.0 * wD + 1.05 * wS + 1.0 * wN;
    gfx.light = mix3([1.08, 1.06, 0.96], [1.12, 1.0, 0.82], [0.13, 0.17, 0.3], wD, wS, wN);
    gfx.night = night;
    if (Math.abs(baked[0] - sunset) + Math.abs(baked[1] - night) > 0.1) { baked = [sunset, night]; bakeEnv(); }
  };

  // ---- finishing effects
  const size = new THREE.Vector2();
  const target = new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType, samples: 4 });
  const composer = new EffectComposer(renderer, target);
  composer.addPass(new RenderPass(scene, camera));
  const ao = new GTAOPass(scene, camera, 4, 4);
  ao.blendIntensity = 0.85;
  ao.updateGtaoMaterial({ radius: 0.55, distanceExponent: 1.4, thickness: 1.2, scale: 1.15, samples: 12, screenSpaceRadius: false });
  const hideForAO = ao.overrideVisibility.bind(ao);
  ao.overrideVisibility = () => { hideForAO(); for (const o of noAO) o.visible = false; };
  composer.addPass(ao);
  const bloom = new UnrealBloomPass(new THREE.Vector2(4, 4), 0.3, 0.75, 0.93);
  composer.addPass(bloom);
  composer.addPass(new ShaderPass(GradeShader));
  composer.addPass(new OutputPass());

  gfx.resize = () => {
    renderer.getSize(size);
    composer.setPixelRatio(renderer.getPixelRatio());
    composer.setSize(size.x, size.y);
  };

  // ---- grass: one patch of blades that follows you, thinned wherever the ground map says dirt or sand
  const PATCH = 34, BLADES = 130000;
  const blade = new THREE.InstancedBufferGeometry();
  blade.setAttribute('position', new THREE.Float32BufferAttribute([-0.016, 0, 0, 0.016, 0, 0, -0.011, 0.5, 0, 0.011, 0.5, 0, 0, 1, 0], 3));
  blade.setIndex([0, 1, 2, 2, 1, 3, 2, 3, 4]);
  const offsets = new Float32Array(BLADES * 4);
  for (let i = 0; i < BLADES; i++) offsets.set([Math.random() * PATCH, Math.random() * PATCH, Math.random(), Math.random()], i * 4);
  blade.setAttribute('aOffset', new THREE.InstancedBufferAttribute(offsets, 4));
  blade.instanceCount = BLADES;
  const grassMat = new THREE.ShaderMaterial({
    side: THREE.DoubleSide, fog: true,
    uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, {
      uCenter: { value: new THREE.Vector3() }, uSize: { value: PATCH }, uTime: { value: 0 }, uLight: { value: new THREE.Vector3(1, 1, 1) }, uGround: { value: new THREE.Vector2(ground.size, ground.cz) }, tMask: { value: null },
    }]),
    vertexShader: `uniform vec3 uCenter; uniform float uSize, uTime; uniform vec2 uGround; uniform sampler2D tMask;
      attribute vec4 aOffset; varying float vY; varying float vTone;
      #include <fog_pars_vertex>
      void main(){
        vec2 w = mod(aOffset.xy - uCenter.xz, uSize) - 0.5 * uSize + uCenter.xz;
        vec2 muv = vec2((w.x + 0.5 * uGround.x) / uGround.x, 1.0 - (w.y - uGround.y + 0.5 * uGround.x) / uGround.x);
        vec4 k = texture2D(tMask, muv);
        float amt = (1.0 - smoothstep(0.18, 0.38, k.r)) * (1.0 - smoothstep(0.2, 0.45, k.g));
        amt *= 1.0 - smoothstep(uSize * 0.34, uSize * 0.49, distance(w, uCenter.xz));
        float h = (0.09 + 0.17 * aOffset.z) * amt;
        float a = aOffset.w * 6.2832;
        float sway = (sin(uTime * 1.7 + w.x * 0.31 + w.y * 0.23) * 0.55 + sin(uTime * 3.1 + w.x * 0.9 + aOffset.z * 6.0) * 0.2 + (aOffset.w - 0.5) * 0.7) * 0.2 * position.y * position.y;
        vec3 p = vec3(w.x + position.x * cos(a) * step(0.01, amt) + sway * h * 2.0, position.y * h, w.y + position.x * sin(a) * step(0.01, amt) + sway * h * 1.2);
        vY = position.y; vTone = k.b + (aOffset.z - 0.5) * 0.5;
        vec4 mvPosition = viewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,
    fragmentShader: `varying float vY; varying float vTone; uniform vec3 uLight;
      #include <common>
      #include <fog_pars_fragment>
      void main(){
        vec3 c = mix(vec3(0.09, 0.16, 0.035), vec3(0.3, 0.4, 0.1), vY) * (0.8 + 0.4 * vTone) * uLight;
        gl_FragColor = vec4(c, 1.0);
        #include <fog_fragment>
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
  grassMat.uniforms.tMask.value = maskTexture;
  const grass = new THREE.Mesh(blade, grassMat);
  grass.frustumCulled = false;
  scene.add(grass); noAO.push(grass); fancy.push(grass);

  // Wear the ground down under everything solid, so grass never grows through a tent floor.
  gfx.paintFootprints = (colliders, extra = []) => {
    const g = maskCanvas.getContext('2d'), N = maskCanvas.width;
    const px = (x) => (x + ground.size / 2) / ground.size * N, pz = (z) => (z - ground.cz + ground.size / 2) / ground.size * N;
    g.save(); g.globalCompositeOperation = 'lighter'; g.filter = 'blur(1.5px)'; g.fillStyle = 'rgba(255,0,0,0.55)';
    for (const c of [...colliders, ...extra]) { g.beginPath(); g.arc(px(c.x), pz(c.z), Math.max(1.6, c.r * 1.15 / ground.size * N), 0, 7); g.fill(); }
    g.restore();
    maskTexture.needsUpdate = true;
  };

  // ---- water that mirrors the sky, with ripples that drift
  let ripples = null;
  gfx.upgradeWater = (mesh) => {
    const N = 256, c = document.createElement('canvas');
    c.width = c.height = N;
    const g = c.getContext('2d'), img = g.createImageData(N, N);
    const waves = Array.from({ length: 9 }, (_, i) => [Math.round(1 + Math.random() * (i < 5 ? 2 : 5)) * (Math.random() < 0.5 ? -1 : 1), Math.round(1 + Math.random() * (i < 5 ? 3 : 7)), Math.random() * 6.28, i < 5 ? 1.2 : 0.35]);
    const hgt = (x, y) => waves.reduce((s, [fx, fy, ph, amp]) => s + Math.sin((x * fx + y * fy) / N * 6.2832 + ph) * amp, 0);
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const dx = hgt(x + 1, y) - hgt(x - 1, y), dy = hgt(x, y + 1) - hgt(x, y - 1), i = (y * N + x) * 4;
      const n = new THREE.Vector3(-dx * 0.5, -dy * 0.5, 1).normalize();
      img.data.set([(n.x * 0.5 + 0.5) * 255, (n.y * 0.5 + 0.5) * 255, (n.z * 0.5 + 0.5) * 255, 255], i);
    }
    g.putImageData(img, 0, 0);
    ripples = new THREE.CanvasTexture(c);
    ripples.wrapS = ripples.wrapT = THREE.RepeatWrapping;
    ripples.repeat.set(34, 1.5);
    mesh.material = new THREE.MeshStandardMaterial({ color: 0x1b7f8e, roughness: 0.1, metalness: 0.15, normalMap: ripples, normalScale: new THREE.Vector2(0.28, 0.28), transparent: true, opacity: 0.94, envMapIntensity: 1.6 });
    noAO.push(mesh);
  };

  // ---- string lights: small bulbs bright enough to glow
  gfx.addBulbs = (spots) => {
    const bulbs = new THREE.InstancedMesh(new THREE.SphereGeometry(0.075, 8, 6), new THREE.MeshBasicMaterial({ toneMapped: false }), spots.length);
    const m = new THREE.Matrix4(), col = new THREE.Color(), warm = [[3.2, 2.3, 1.0], [3.0, 1.2, 1.6], [1.2, 2.6, 2.6], [3.0, 2.8, 1.6]];
    spots.forEach((p, i) => { m.makeTranslation(p[0], p[1], p[2]); bulbs.setMatrixAt(i, m); bulbs.setColorAt(i, col.setRGB(...warm[i % warm.length])); });
    scene.add(bulbs); noAO.push(bulbs);
  };

  // ---- stage light beams
  const beams = [];
  gfx.addBeams = (list) => {
    const cone = new THREE.ConeGeometry(2.6, 15, 14, 1, true);
    cone.translate(0, -7.5, 0); // pivot at the lamp
    for (const [x, y, z, hex] of list) {
      const b = new THREE.Mesh(cone, new THREE.MeshBasicMaterial({ color: hex, transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false }));
      b.position.set(x, y, z);
      b.userData.ph = Math.random() * 6;
      scene.add(b); beams.push(b); noAO.push(b); fancy.push(b);
    }
  };

  // ---- fireflies and dust drifting round you
  const FLIES = 260, BOX = 36;
  const flyPos = new Float32Array(FLIES * 3), flySeed = new Float32Array(FLIES * 3);
  for (let i = 0; i < FLIES * 3; i++) flySeed[i] = Math.random();
  const flyGeo = new THREE.BufferGeometry();
  flyGeo.setAttribute('position', new THREE.BufferAttribute(flyPos, 3));
  const dot = document.createElement('canvas');
  dot.width = dot.height = 32;
  const dg = dot.getContext('2d'), glow = dg.createRadialGradient(16, 16, 0, 16, 16, 16);
  glow.addColorStop(0, 'rgba(255,255,255,1)'); glow.addColorStop(0.35, 'rgba(255,255,255,0.55)'); glow.addColorStop(1, 'rgba(255,255,255,0)');
  dg.fillStyle = glow; dg.fillRect(0, 0, 32, 32);
  const flies = new THREE.Points(flyGeo, new THREE.PointsMaterial({ map: new THREE.CanvasTexture(dot), color: new THREE.Color(2.6, 2.1, 1.0), size: 0.09, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
  flies.frustumCulled = false;
  scene.add(flies); fancy.push(flies);

  // ---- quality levels
  gfx.setLevel = (n, lock = false) => {
    gfx.level = Math.max(0, Math.min(2, n));
    if (lock) gfx.locked = true;
    ao.enabled = gfx.level === 2;
    blade.instanceCount = gfx.level === 2 ? BLADES : Math.floor(BLADES * 0.4);
    for (const o of fancy) o.visible = gfx.level > 0;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, [1, 1.25, 1.5][gfx.level]));
    renderer.shadowMap.enabled = true;
    gfx.resize();
    if (label) label.innerHTML = `Graphics: <b>${LEVELS[gfx.level]}</b> <kbd>G</kbd>`;
    slow = 0; samples = 0;
  };
  gfx.cycle = () => gfx.setLevel((gfx.level + 2) % 3, true);

  gfx.update = (dt, t, focus) => {
    grassMat.uniforms.uCenter.value.copy(focus);
    grassMat.uniforms.uTime.value = t;
    grassMat.uniforms.uLight.value.set(...gfx.light);
    flies.material.opacity = 0.15 + 0.7 * Math.max(gfx.night || 0, sky.material.opacity * 0.6);
    if (ripples) ripples.offset.set(t * 0.006, t * 0.014);
    for (const b of beams) { b.material.opacity = 0.07 + 0.2 * (gfx.night || 0); b.rotation.x = Math.sin(t * 0.7 + b.userData.ph) * 0.5; b.rotation.z = 0.5 + Math.cos(t * 0.5 + b.userData.ph) * 0.35; }
    if (gfx.level > 0) {
      for (let i = 0; i < FLIES; i++) {
        const sx = flySeed[i * 3], sy = flySeed[i * 3 + 1], sz = flySeed[i * 3 + 2];
        const x = sx * BOX + Math.sin(t * 0.3 + sy * 20) * 1.5, z = sz * BOX + Math.cos(t * 0.27 + sx * 20) * 1.5;
        flyPos[i * 3] = ((x - focus.x) % BOX + BOX) % BOX - BOX / 2 + focus.x;
        flyPos[i * 3 + 1] = 0.3 + sy * 3.2 + Math.sin(t * 0.9 + sx * 30) * 0.25;
        flyPos[i * 3 + 2] = ((z - focus.z) % BOX + BOX) % BOX - BOX / 2 + focus.z;
      }
      flyGeo.attributes.position.needsUpdate = true;
    }
  };

  // Step down a level if frames stay slow while the page is actually on screen.
  let last = 0, slow = 0, samples = 0;
  gfx.render = () => {
    const now = performance.now(), ms = now - last;
    last = now;
    if (!gfx.locked && gfx.level > 0 && !document.hidden && ms < 400) {
      samples++;
      slow = slow * 0.97 + (ms > 38 ? 1 : 0) * 0.03;
      if (samples > 200 && slow > 0.6) gfx.setLevel(gfx.level - 1);
    }
    if (gfx.level === 0) renderer.render(scene, camera); else composer.render();
  };

  const want = new URLSearchParams(location.search).get('gfx');
  gfx.setLevel(want === null ? 2 : +want, want !== null);
  return gfx;
}

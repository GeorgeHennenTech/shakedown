// SHAKEDOWN gold panning. Top half is rules, bottom half is drawing and hands; numbers are data/river.json.
// One pan of gravel is three beats: scoop (choose a patch of river bed), swirl (wash the light sand off without sloshing
// the lot back in), then tilt and pick (take the glints, and shade one with your hand to tell gold from fool's gold).

const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));

// ---- rules -----------------------------------------------------------------------------------------
// What a finished wash leaves in the pan. rich 0..1 is the bend today, q the patch you scooped, lost the share sloshed away.
export function glintsFor(rules, pan, rich, q, lost, rnd = Math.random) {
  const P = rules.pans[pan], base = clamp(rich * q) * (1 - lost);
  const gold = Math.max(0, Math.round(base * P.glints + (rnd() - 0.5)));
  const pyrite = rules.pyrite.least + Math.floor(rnd() * (rules.pyrite.most - rules.pyrite.least + 1));
  const nugget = base > 0.5 && rnd() < P.nugget * base * 2;
  return { gold, pyrite, nugget };
}
// How a moment of swirling goes. speed is how fast the pan is going round, in radians a second.
export function swirlStep(rules, pan, speed, dt) {
  const S = rules.swirl, P = rules.pans[pan];
  if (speed < S.slow) return { wash: 0, slosh: -S.sloshFade * dt, mood: 'slow' };
  if (speed > S.fast) return { wash: S.washPerSecond * P.wash * 0.4 * dt, slosh: S.sloshPerSecond * P.slosh * dt, mood: 'fast' };
  return { wash: S.washPerSecond * P.wash * dt, slosh: -S.sloshFade * 0.5 * dt, mood: 'good' };
}

// ---- the game --------------------------------------------------------------------------------------
export function createPan({ $, rules, sfx = () => {} }) {
  const root = $('pan'), canvas = $('panview'), g = canvas.getContext('2d');
  let S = null; // the pan in progress
  // photographs of the river (art/river, made with Higgsfield); the game's own marks are drawn over them
  const photo = (src) => { const i = new Image(); i.src = src; return i; };
  const ready = (i) => i.complete && i.naturalWidth > 0;
  function cover(i, w, h) { const k = Math.max(w / i.naturalWidth, h / i.naturalHeight), iw = i.naturalWidth * k, ih = i.naturalHeight * k; g.drawImage(i, (w - iw) / 2, (h - ih) / 2, iw, ih); }
  const SHOT = { bed: photo('./assets/river/pan-bed.jpg'), ridged: photo('./assets/river/pan-ridged.jpg'), tin: photo('./assets/river/pan-tin.jpg') };
  const mouse = { x: 0, y: 0, down: false, shade: false }, held = {};

  function start(opts) { // { pan: 'tin' | 'ridged', rich, where, clearHead, onDone }
    for (const k of Object.keys(held)) held[k] = false; mouse.shade = false; // nothing carries over from the last pan
    const order = [0, 1, 2].sort(() => Math.random() - 0.5);
    S = { ...opts, phase: 'scoop', t: 0, patches: order.map((i) => ({ ...rules.patches[i] })), q: 0, wash: 0, slosh: 0, lost: 0, spills: 0, speed: 0, ang: null, glints: [], gold: 0, pyrite: 0, nugget: false, msg: '', sand: Array.from({ length: 150 }, (_, i) => ({ a: Math.random() * 7, r: Math.sqrt(Math.random()), dark: i % 4 === 0, s: 0.6 + Math.random() * 0.8 })) };
    root.classList.remove('hidden');
    say('Three patches of gravel under the water. Pick the one to scoop.');
    draw();
  }
  const say = (text) => { S.msg = text; };
  function scoop(i) {
    S.q = S.patches[i].q; S.phase = 'swirl'; sfx('pick');
    say('Swirl the pan: move the mouse in steady circles round it. Too slow and nothing washes out; too fast and it sloshes over. (Or hold Space for a slow, safe swirl.)');
  }
  function finishWash() {
    const got = glintsFor(rules, S.pan, S.rich, S.q, S.lost);
    const spots = [];
    const place = (kind) => { for (let tries = 0; tries < 40; tries++) { const a = Math.random() * 7, r = 0.15 + Math.random() * 0.6, x = Math.cos(a) * r, y = Math.sin(a) * r * 0.9 + 0.05; if (spots.every((s) => Math.hypot(s.x - x, s.y - y) > 0.2)) { spots.push({ x, y, kind, picked: false, tw: Math.random() * 7 }); return; } } };
    for (let i = 0; i < got.gold; i++) place('gold');
    for (let i = 0; i < got.pyrite; i++) place('pyrite');
    if (got.nugget) place('nugget');
    S.glints = spots; S.phase = 'pick';
    say(spots.length ? 'Black sand, and something glinting. Click a glint to pick it out. Hold Shift over one to shade it with your hand: real gold stays bright, fool’s gold goes dull. Space when you are done.' : 'Black sand and nothing else. Space to tip it out.');
  }
  function pick(s) {
    s.picked = true; sfx('coin');
    if (s.kind === 'nugget') { S.nugget = true; say('A nugget. An actual nugget.'); } else if (s.kind === 'gold') S.gold++; else S.pyrite++;
  }
  function finish(quit) {
    const done = S.onDone, result = { gold: S.gold, pyrite: S.pyrite, nugget: S.nugget, quit: !!quit && S.phase !== 'pick', spills: S.spills, left: S.glints.filter((s) => !s.picked && s.kind !== 'pyrite').length };
    S = null; root.classList.add('hidden');
    done(result);
  }

  function update(dt) {
    if (!S) return;
    S.t += dt;
    if (S.phase === 'swirl') {
      const [cx, cy, R] = panAt();
      let speed = 0;
      if (held.Space) speed = (rules.swirl.slow + (rules.swirl.fast - rules.swirl.slow) * 0.5) * 1; // steady, but it washes at half the rate
      else {
        const d = Math.hypot(mouse.x - cx, mouse.y - cy);
        if (d > R * 0.15 && d < R * 2.2) {
          const a = Math.atan2(mouse.y - cy, mouse.x - cx);
          if (S.ang !== null) { let da = a - S.ang; da = Math.atan2(Math.sin(da), Math.cos(da)); speed = Math.abs(da) / Math.max(dt, 0.001); }
          S.ang = a;
        } else S.ang = null;
      }
      S.speed += (Math.min(speed, 30) - S.speed) * Math.min(1, dt * 6); // smoothed, so one jerk of the hand is not a slosh
      const step = swirlStep(rules, S.pan, S.speed, dt);
      S.wash = clamp(S.wash + step.wash * (held.Space ? rules.swirl.spaceSpeed : 1)); S.slosh = clamp(S.slosh + step.slosh); S.mood = step.mood;
      S.spin = (S.spin || 0) + S.speed * dt;
      if (S.slosh >= 1) { S.slosh = 0.35; S.lost = Math.min(rules.swirl.mostLost, S.lost + rules.swirl.spill); S.wash = clamp(S.wash + rules.swirl.spillWash); S.spills++; /* a spill costs you gold but never all of it, and it empties the pan a bit, so a clumsy wash still ends */ sfx('pick'); say('It sloshed over the lip. Some of what was in there is back in the river. Gently.'); }
      if (S.wash >= 1) finishWash();
    }
    draw();
  }

  // ---- what you see
  function fit() {
    const r = Math.min(2, window.devicePixelRatio || 1), w = canvas.clientWidth || 720, h = canvas.clientHeight || 380;
    if (canvas.width !== Math.round(w * r)) { canvas.width = Math.round(w * r); canvas.height = Math.round(h * r); }
    g.setTransform(r, 0, 0, r, 0, 0);
    return [w, h];
  }
  const panAt = () => { const w = canvas.clientWidth || 720, h = canvas.clientHeight || 380; return [w / 2, h / 2 + 6, Math.min(w, h) * 0.4]; };
  const patchAt = (i) => { const w = canvas.clientWidth || 720, h = canvas.clientHeight || 380; return [w * (0.22 + i * 0.28), h * 0.55, Math.min(w * 0.11, h * 0.3)]; };
  function water(w, h) {
    if (ready(SHOT.bed)) { cover(SHOT.bed, w, h); g.fillStyle = 'rgba(30,70,80,.18)'; g.fillRect(0, 0, w, h); } else { g.fillStyle = '#2f6f86'; g.fillRect(0, 0, w, h); }
    g.strokeStyle = 'rgba(255,255,255,.10)'; g.lineWidth = 2;
    for (let i = 0; i < 7; i++) { const y = (i * 61 + S.t * 14) % (h + 40) - 20; g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(w * 0.3, y + 10, w * 0.6, y - 10, w, y + 4); g.stroke(); }
  }
  function draw() {
    const [w, h] = fit();
    water(w, h);
    if (S.phase === 'scoop') {
      S.patches.forEach((p, i) => {
        const [x, y, r] = patchAt(i), over = Math.hypot(mouse.x - x, mouse.y - y) < r;
        g.fillStyle = ready(SHOT.bed) ? 'rgba(210,190,150,.22)' : '#b89f77'; g.beginPath(); g.ellipse(x, y, r, r * 0.72, 0, 0, 7); g.fill();
        g.fillStyle = ready(SHOT.bed) ? 'rgba(120,96,66,.25)' : 'rgba(120,96,66,.8)'; for (let k = 0; k < 26; k++) { const a = k * 2.4, rr = r * (0.2 + ((k * 37) % 70) / 100); g.beginPath(); g.arc(x + Math.cos(a) * rr, y + Math.sin(a) * rr * 0.7, 2.2 + (k % 3), 0, 7); g.fill(); }
        if (p.tell !== 'plain') { g.fillStyle = 'rgba(28,24,30,.7)'; g.beginPath(); g.ellipse(x + r * 0.2, y + r * 0.1, r * 0.42, r * 0.13, 0.5, 0, 7); g.fill(); } // black sand settles where the current slows
        if (p.tell === 'glint') { const tw = (Math.sin(S.t * 5) + 1) / 2; g.fillStyle = `rgba(255,224,120,${0.25 + tw * 0.75})`; g.beginPath(); g.arc(x + r * 0.28, y + r * 0.08, 2.4, 0, 7); g.fill(); }
        g.strokeStyle = over ? '#ffd23f' : 'rgba(255,243,214,.5)'; g.lineWidth = over ? 4 : 2; g.beginPath(); g.ellipse(x, y, r + 6, r * 0.72 + 6, 0, 0, 7); g.stroke();
        g.fillStyle = '#fff3d6'; g.font = '700 14px system-ui'; g.textAlign = 'center'; g.fillText(String(i + 1), x, y + r * 0.72 + 26);
      });
    } else {
      const [cx, cy, R] = panAt(), tilt = S.phase === 'pick' ? 0.06 : Math.sin(S.spin || 0) * 0.05;
      g.save(); g.translate(cx, cy); g.rotate(tilt);
      g.fillStyle = 'rgba(0,0,0,.25)'; g.beginPath(); g.ellipse(6, 12, R * 1.06, R * 0.96, 0, 0, 7); g.fill();
      g.fillStyle = S.pan === 'ridged' ? '#2c5a3f' : '#9aa3ab'; g.beginPath(); g.ellipse(0, 0, R * 1.05, R * 0.95, 0, 0, 7); g.fill(); // the rim
      g.fillStyle = S.pan === 'ridged' ? '#1e3f2c' : '#7c858d'; g.beginPath(); g.ellipse(0, 0, R * 0.9, R * 0.82, 0, 0, 7); g.fill();
      const panShot = SHOT[S.pan];
      if (ready(panShot)) { g.save(); g.beginPath(); g.ellipse(0, 0, R * 1.05, R * 0.95, 0, 0, 7); g.clip(); g.drawImage(panShot, -R * 1.07, -R * 0.97, R * 2.14, R * 1.94); g.fillStyle = 'rgba(60,110,120,.16)'; g.fillRect(-R * 1.1, -R, R * 2.2, R * 2); g.restore(); } // a film of river water in it
      if (S.pan === 'ridged' && !ready(panShot)) { g.strokeStyle = 'rgba(255,255,255,.14)'; g.lineWidth = 3; for (const k of [0.62, 0.74, 0.86]) { g.beginPath(); g.ellipse(0, 0, R * k, R * k * 0.91, 0, 2.2, 4.1); g.stroke(); } } // the riffles that catch the heavy stuff
      // sand: the light grains go as you wash, the black sand stays
      const keep = 1 - S.wash;
      S.sand.forEach((p, i) => {
        if (!p.dark && i / S.sand.length > keep + 0.12) return;
        const a = p.a + (S.spin || 0) * (p.dark ? 0.35 : 0.9) * p.s, r = p.r * R * 0.78;
        g.fillStyle = p.dark ? '#1c181e' : '#d9c79f'; g.beginPath(); g.arc(Math.cos(a) * r, Math.sin(a) * r * 0.9, p.dark ? 2.6 : 3.4, 0, 7); g.fill();
      });
      if (S.phase === 'pick') {
        for (const s of S.glints) {
          if (s.picked) continue;
          const x = s.x * R, y = s.y * R, over = Math.hypot(mouse.x - cx - x, mouse.y - cy - y) < 16, shaded = over && mouse.shade;
          const tw = shaded ? 0 : (Math.sin(S.t * 6 + s.tw) + 1) / 2, big = s.kind === 'nugget' ? 9 : 4.5;
          // in the sun they all flash the same. In shade gold still glows; pyrite goes flat and grey-green
          const dull = shaded && s.kind === 'pyrite', keen = S.clearHead && s.kind === 'pyrite';
          g.fillStyle = dull ? '#7d7f63' : keen ? '#d8c66a' : '#ffd23f'; g.beginPath(); g.arc(x, y, big, 0, 7); g.fill();
          if (!dull) { g.fillStyle = `rgba(255,255,255,${shaded ? 0.35 : 0.25 + tw * 0.7})`; g.beginPath(); g.arc(x - big * 0.25, y - big * 0.25, big * 0.45, 0, 7); g.fill(); }
          if (over) { g.strokeStyle = '#fff3d6'; g.lineWidth = 2; g.beginPath(); g.arc(x, y, big + 6, 0, 7); g.stroke(); }
          if (shaded) { g.fillStyle = 'rgba(0,0,0,.28)'; g.beginPath(); g.ellipse(x + 4, y - 14, 30, 18, -0.3, 0, 7); g.fill(); } // your hand's shadow
        }
      }
      g.restore();
      if (S.phase === 'swirl') {
        const bw = Math.min(360, w - 60), bx = w / 2 - bw / 2;
        g.fillStyle = 'rgba(255,243,214,.2)'; g.fillRect(bx, h - 46, bw, 10); g.fillStyle = '#7cf29a'; g.fillRect(bx, h - 46, bw * S.wash, 10);
        g.fillStyle = 'rgba(255,243,214,.2)'; g.fillRect(bx, h - 26, bw, 10); g.fillStyle = S.slosh > 0.7 ? '#ff5f5f' : '#ffc93c'; g.fillRect(bx, h - 26, bw * S.slosh, 10);
        g.fillStyle = '#fff3d6'; g.font = '600 12px system-ui'; g.textAlign = 'right'; g.fillText('washed', bx - 8, h - 37); g.fillText('slosh', bx - 8, h - 17);
        g.textAlign = 'left'; g.fillText(S.mood === 'slow' ? 'too slow' : S.mood === 'fast' ? 'too fast!' : 'steady', bx + bw + 8, h - 37);
      }
    }
    $('pantitle').textContent = `Panning ${S.where || 'the river'} with your ${rules.pans[S.pan].name.toLowerCase()}`;
    $('pancount').textContent = S.phase === 'pick' || S.gold || S.pyrite ? `Picked: ${S.gold + S.pyrite} flake${S.gold + S.pyrite === 1 ? '' : 's'}${S.nugget ? ' and a nugget' : ''}` : '';
    $('panmsg').textContent = S.msg;
  }

  // ---- hands
  const at = (e) => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; };
  canvas.addEventListener('pointermove', (e) => { at(e); mouse.shade = e.shiftKey || (e.buttons & 2) === 2; });
  canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  canvas.addEventListener('pointerdown', (e) => {
    if (!S) return;
    at(e); if (e.button === 2) { mouse.shade = true; return; }
    if (S.phase === 'scoop') { const i = S.patches.findIndex((_, k) => { const [x, y, r] = patchAt(k); return Math.hypot(mouse.x - x, mouse.y - y) < r + 8; }); if (i >= 0) scoop(i); }
    else if (S.phase === 'pick') { const [cx, cy, R] = panAt(); const s = S.glints.find((q) => !q.picked && Math.hypot(mouse.x - cx - q.x * R, mouse.y - cy - q.y * R) < 16); if (s) pick(s); }
  });
  window.addEventListener('pointerup', (e) => { if (e.button === 2) mouse.shade = false; });
  window.addEventListener('keydown', (e) => {
    if (!S) return;
    held[e.code] = true;
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') mouse.shade = true;
    if (e.repeat) return;
    if (S.phase === 'scoop' && /^Digit[123]$/.test(e.code)) scoop(+e.code.slice(5) - 1);
    else if (S.phase === 'pick' && e.code === 'Space') finish(false);
    else if (e.code === 'Escape') finish(true);
  });
  window.addEventListener('keyup', (e) => { held[e.code] = false; if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') mouse.shade = false; });

  return { start, update, get active() { return !!S; }, get game() { return S; }, scoop, pick: (i) => { const s = S && S.glints[i]; if (s && !s.picked) pick(s); }, finish };
}

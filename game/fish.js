// SHAKEDOWN fishing. Top half is rules, bottom half is drawing and hands; numbers are data/fish.json.
// One cast is three beats: cast (stop the marker on the ripple), wait and read (leave the nibbles alone, strike when the
// float goes under), then fight (reel while the fish rests, give line while it runs).

const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const between = ([a, b], rnd = Math.random) => a + rnd() * (b - a);

// ---- rules -----------------------------------------------------------------------------------------
// Which fish takes the bait. depth is the pool's; big is the bait's pull on big fish; noSturgeon while she is away.
export function pickFish(rules, depth, big, noSturgeon, rnd = Math.random) {
  const pool = rules.fish.filter((f) => f.in.includes(depth) && !(noSturgeon && f.id === 'sturgeon')).map((f) => [f, f.odds * (f.big ? big : 1)]);
  let roll = rnd() * pool.reduce((s, [, w]) => s + w, 0);
  for (const [f, w] of pool) { roll -= w; if (roll <= 0) return f; }
  return pool[0][0];
}
// How good the water is right now: dawn and dusk are best, rain helps.
export function biteNow(rules, hour, raining) {
  const T = rules.time, inside = ([a, b]) => hour >= a && hour < b;
  return (inside(T.dawn) || inside(T.dusk) ? T.best : hour >= 8 && hour < 18 ? T.day : T.night) + (raining ? T.rain : 0);
}
// One moment of the fight. reeling: are you winding in; running: is the fish pulling away.
export function fightStep(rules, rod, fish, reeling, running, dt) {
  const F = rules.fight, R = rules.rods[rod];
  const strain = reeling ? F.strainUp * fish.fight * R.strain * (running ? F.runStrain * 2 : 1) * dt : -F.strainDown * dt;
  const line = reeling ? F.reelPerSecond * R.reel * (running ? 0.25 : 1) / (0.6 + fish.fight * 0.5) * dt : running ? -F.runSlip * fish.fight * dt : 0;
  return { strain, line };
}

// ---- the game --------------------------------------------------------------------------------------
export function createFishing({ $, rules, sfx = () => {} }) {
  const root = $('fish'), canvas = $('fishview'), g = canvas.getContext('2d');
  let S = null;
  const held = {};
  // photographs of the river (art/river, made with Higgsfield); the game's own marks are drawn over them
  const photo = (src) => { const i = new Image(); i.src = src; return i; };
  const ready = (i) => i.complete && i.naturalWidth > 0;
  function cover(i, w, h) { const k = Math.max(w / i.naturalWidth, h / i.naturalHeight), iw = i.naturalWidth * k, ih = i.naturalHeight * k; g.drawImage(i, (w - iw) / 2, (h - ih) / 2, iw, ih); }
  const SHOT = { dusk: photo('./assets/river/fish-dusk.jpg'), day: photo('./assets/river/fish-day.jpg') };
  let mouseDown = false;

  function start(opts) { // { rod, fish, bite, where, bait, clearHead, onDone }
    for (const k of Object.keys(held)) held[k] = false; mouseDown = false;
    S = { ...opts, phase: 'cast', t: 0, marker: 0, dir: 1, target: 0.3 + Math.random() * 0.5, events: [], at: 0, bob: 0, under: 0, line: 0.18, strain: 0.3, slack: 0, running: false, swap: 0, runsLeft: 0, fishX: 0.5, msg: '', result: null, endT: 0 };
    root.classList.remove('hidden');
    say('Ripples where something is feeding. Press Space (or click) when the marker is on them.');
    draw();
  }
  const say = (t) => { S.msg = t; };
  function cast() {
    const miss = Math.abs(S.marker - S.target), W = rules.wait;
    const good = miss <= rules.cast.ring / 2;
    const wait = between([W.least, W.most]) / S.bite * (good ? 1 : rules.cast.missWait);
    const n = Math.round(between(W.nibbles)); let t = wait * 0.25;
    for (let i = 0; i < n; i++) { S.events.push({ kind: 'nibble', at: t + Math.random() * wait * 0.2, len: W.nibbleSeconds }); t += wait * 0.3; }
    S.events.push({ kind: 'bite', at: wait, len: W.biteSeconds + (S.clearHead ? W.clearHeadBonus : 0) });
    S.events.sort((a, b) => a.at - b.at);
    S.cast = S.marker; S.phase = 'wait'; S.at = 0; sfx('pick');
    say(good ? 'Right on the ripples. Now watch the float. A twitch is only a nibble: leave it. Strike (Space) when it goes right under.' : 'Wide of the ripples, so this may take a while. A twitch is only a nibble: strike (Space) when the float goes right under.');
  }
  function strike() {
    const e = S.events.find((x) => S.at >= x.at && S.at <= x.at + x.len);
    if (e && e.kind === 'bite') {
      S.phase = 'fight'; S.runsLeft = S.fish.runs; S.running = false; S.swap = between(rules.fight.rest); sfx('build');
      say('Fish on! Hold Space to reel while it rests. Let go when it runs, or the line snaps. Do not let it go slack either.');
    } else end(false, true, e ? 'You struck at a nibble and pulled the bait clean off the hook.' : 'You struck at nothing and the bait flew off. Wait for the float to go under.');
  }
  function end(caught, baitLost, why, quit = false) {
    S.phase = 'done'; S.endT = 0; S.result = { caught, baitLost, quit, fish: S.fish, why }; say(why);
    if (caught) sfx('level');
  }
  function close() { const done = S.onDone, r = S.result; S = null; root.classList.add('hidden'); done(r); }

  function update(dt) {
    if (!S) return;
    S.t += dt;
    const reeling = held.Space || mouseDown;
    if (S.phase === 'cast') {
      S.marker += S.dir * rules.cast.markerSpeed * dt;
      if (S.marker > 1) { S.marker = 1; S.dir = -1; } else if (S.marker < 0) { S.marker = 0; S.dir = 1; }
    } else if (S.phase === 'wait') {
      S.at += dt;
      const e = S.events.find((x) => S.at >= x.at && S.at <= x.at + x.len);
      S.under += ((e ? (e.kind === 'bite' ? 1 : 0.35) : 0) - S.under) * Math.min(1, dt * 14);
      const bite = S.events[S.events.length - 1];
      if (S.at > bite.at + bite.len) end(false, true, 'The float came back up. It took your bait and left.');
    } else if (S.phase === 'fight') {
      const F = rules.fight;
      S.swap -= dt;
      if (S.swap <= 0) {
        if (S.running) { S.running = false; S.swap = between(F.rest); }
        else if (S.runsLeft > 0) { S.running = true; S.runsLeft--; S.swap = between(F.run); sfx('pick'); }
        else S.swap = 99; // out of runs: it is yours if you keep winding
      }
      const step = fightStep(rules, S.rod, S.fish, reeling, S.running, dt);
      S.strain = clamp(S.strain + step.strain); S.line = clamp(S.line + step.line);
      S.slack = clamp(S.slack + (S.strain < F.slackAt ? F.slackPerSecond : -F.slackFade) * dt);
      S.fishX += ((S.running ? 0.5 + Math.sin(S.t * 5) * 0.34 : 0.5 + Math.sin(S.t * 1.3) * 0.1) - S.fishX) * Math.min(1, dt * 6);
      if (S.strain >= 1) end(false, true, 'The line snapped. Let go when it runs.');
      else if (S.slack >= 1) end(false, true, 'The line went slack and it threw the hook. Keep a little tension on.');
      else if (S.line >= 1) end(true, true, `Landed: a ${S.fish.name}.`);
    } else if (S.phase === 'done') { S.endT += dt; if (S.endT > 1.4) { close(); return; } }
    draw();
  }

  // ---- what you see
  function fit() {
    const r = Math.min(2, window.devicePixelRatio || 1), w = canvas.clientWidth || 720, h = canvas.clientHeight || 380;
    if (canvas.width !== Math.round(w * r)) { canvas.width = Math.round(w * r); canvas.height = Math.round(h * r); }
    g.setTransform(r, 0, 0, r, 0, 0);
    return [w, h];
  }
  function bar(x, y, w, v, colour, label, note = '') {
    g.fillStyle = 'rgba(255,243,214,.2)'; g.fillRect(x, y, w, 10); g.fillStyle = colour; g.fillRect(x, y, w * clamp(v), 10);
    g.fillStyle = '#fff3d6'; g.font = '600 12px system-ui'; g.textAlign = 'right'; g.fillText(label, x - 8, y + 9); g.textAlign = 'left'; g.fillText(note, x + w + 8, y + 9);
  }
  function draw() {
    const [w, h] = fit(), dusk = S.bite > 1.2;
    const shot = SHOT[dusk ? 'dusk' : 'day'];
    if (ready(shot)) {
      cover(shot, w, h);
      g.strokeStyle = dusk ? 'rgba(255,214,160,.10)' : 'rgba(255,255,255,.10)'; g.lineWidth = 1.5; // the water moves a little
      for (let i = 0; i < 9; i++) { const y = h * 0.46 + ((i * 47 + S.t * 7) % (h * 0.4)), x = ((i * 173) % w); g.beginPath(); g.moveTo(x, y); g.bezierCurveTo(x + 40, y + 3, x + 90, y - 3, x + 150 + (i % 3) * 40, y + 1); g.stroke(); }
    } else {
    const sky = g.createLinearGradient(0, 0, 0, h * 0.34); sky.addColorStop(0, dusk ? '#f08a4b' : '#8fc7e8'); sky.addColorStop(1, dusk ? '#f7c97a' : '#d6eef7');
    g.fillStyle = sky; g.fillRect(0, 0, w, h * 0.34);
    g.fillStyle = '#2f5f3a'; g.beginPath(); g.moveTo(0, h * 0.34); for (let x = 0; x <= w; x += 40) g.lineTo(x, h * 0.34 - 14 - Math.sin(x * 0.02) * 10 - ((x * 7) % 13)); g.lineTo(w, h * 0.34); g.fill(); // the far bank
    g.fillStyle = '#2f6f86'; g.fillRect(0, h * 0.34, w, h);
    g.strokeStyle = 'rgba(255,255,255,.13)'; g.lineWidth = 2;
    for (let i = 0; i < 6; i++) { const y = h * 0.4 + ((i * 53 + S.t * 9) % (h * 0.6)); g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(w * 0.3, y + 8, w * 0.6, y - 8, w, y + 3); g.stroke(); }
    }
    const waterY = (u) => h * (0.74 - u * 0.28), rodTip = [w * 0.2, h * 0.24];
    // the ripple rings you are aiming for
    if (S.phase === 'cast' || S.phase === 'wait') {
      const ty = waterY(S.target);
      for (let k = 0; k < 3; k++) { const r = 10 + ((S.t * 22 + k * 16) % 48); g.strokeStyle = `rgba(255,243,214,${0.5 - r / 110})`; g.beginPath(); g.ellipse(w * 0.56, ty, r * 1.6, r * 0.5, 0, 0, 7); g.stroke(); }
    }
    // the rod
    { const tipY = rodTip[1] + (S.phase === 'fight' ? S.strain * 34 : 0); g.lineCap = 'round'; // the rod in your hands: thick at the grip, thin at the tip, a cork handle
      g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 9; g.beginPath(); g.moveTo(w * 0.035, h * 1.02); g.quadraticCurveTo(w * 0.1, h * 0.52, rodTip[0], tipY + 3); g.stroke();
      g.strokeStyle = '#2b2019'; g.lineWidth = 7; g.beginPath(); g.moveTo(w * 0.03, h * 1.02); g.quadraticCurveTo(w * 0.095, h * 0.52, rodTip[0], tipY); g.stroke();
      g.strokeStyle = '#5a4634'; g.lineWidth = 2; g.beginPath(); g.moveTo(w * 0.028, h * 1.02); g.quadraticCurveTo(w * 0.092, h * 0.52, rodTip[0], tipY); g.stroke();
      g.strokeStyle = '#c9a26b'; g.lineWidth = 13; g.beginPath(); g.moveTo(w * 0.03, h * 1.02); g.lineTo(w * 0.052, h * 0.86); g.stroke(); }
    if (S.phase === 'cast') {
      const my = waterY(S.marker);
      g.fillStyle = '#ffd23f'; g.beginPath(); g.moveTo(w * 0.56 - 60, my); g.lineTo(w * 0.56 - 78, my - 9); g.lineTo(w * 0.56 - 78, my + 9); g.fill();
      g.fillStyle = 'rgba(255,210,63,.35)'; g.fillRect(w * 0.56 - 60, my - 1.5, 120, 3);
    } else {
      const fx = S.phase === 'fight' ? w * (0.2 + S.fishX * 0.62) : w * 0.56, fy = S.phase === 'fight' ? waterY(0.75 - S.line * 0.7) : waterY(S.cast);
      g.strokeStyle = 'rgba(255,243,214,.8)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(rodTip[0], rodTip[1] + (S.phase === 'fight' ? S.strain * 26 : 0)); g.quadraticCurveTo((rodTip[0] + fx) / 2, fy - 70 + S.strain * 60, fx, fy); g.stroke();
      if (S.phase === 'wait' || (S.phase === 'done' && !S.result.caught)) {
        const dip = S.phase === 'wait' ? S.under * 16 + Math.sin(S.t * 3) * 1.5 : 0;
        g.fillStyle = '#e0392b'; g.beginPath(); g.arc(fx, fy + dip - 4, 7, Math.PI, 0); g.fill(); g.fillStyle = '#fff3d6'; g.beginPath(); g.arc(fx, fy + dip - 4, 7, 0, Math.PI); g.fill();
        if (S.under > 0.2) { g.strokeStyle = 'rgba(255,243,214,.7)'; g.beginPath(); g.ellipse(fx, fy, 14 + S.under * 14, 5 + S.under * 4, 0, 0, 7); g.stroke(); }
      }
      if (S.phase === 'fight' || (S.phase === 'done' && S.result.caught)) { // the fish, a shadow under the water
        const len = 26 + S.fish.fight * 34, dirn = Math.cos(S.t * 5) > 0 ? 1 : -1;
        g.fillStyle = S.phase === 'done' ? '#c7d3d8' : 'rgba(20,40,50,.75)'; g.beginPath(); g.ellipse(fx, fy + 6, len, len * 0.3, 0, 0, 7); g.fill();
        g.beginPath(); g.moveTo(fx - dirn * len, fy + 6); g.lineTo(fx - dirn * (len + 16), fy - 4); g.lineTo(fx - dirn * (len + 16), fy + 16); g.fill();
        if (S.running) { g.strokeStyle = 'rgba(255,255,255,.5)'; for (let k = 0; k < 3; k++) { g.beginPath(); g.arc(fx + (k - 1) * 20, fy - 6, 5 + ((S.t * 30 + k * 7) % 12), 0, 7); g.stroke(); } }
      }
    }
    if (S.phase === 'fight') {
      const bw = Math.min(360, w - 150), bx = w / 2 - bw / 2;
      bar(bx, h - 62, bw, S.line, '#7cf29a', 'reeled in', S.running ? 'it is running: let go!' : 'resting: reel');
      bar(bx, h - 42, bw, S.strain, S.strain > 0.75 ? '#ff5f5f' : '#ffc93c', 'line strain');
      bar(bx, h - 22, bw, S.slack, '#8fc7e8', 'slack');
    }
    $('fishtitle').textContent = `Fishing ${S.where || 'the river'} with ${S.bait}`;
    $('fishcount').textContent = S.phase === 'fight' ? `Something on the line${S.fish.big ? ', and it is heavy' : ''}` : '';
    $('fishmsg').textContent = S.msg;
  }

  // ---- hands
  function press() {
    if (!S) return;
    if (S.phase === 'cast') cast(); else if (S.phase === 'wait') strike(); else if (S.phase === 'done') close();
  }
  canvas.addEventListener('pointerdown', (e) => { if (e.button !== 0) return; mouseDown = true; press(); });
  window.addEventListener('pointerup', () => { mouseDown = false; });
  window.addEventListener('keydown', (e) => {
    if (!S) return;
    held[e.code] = true;
    if (e.repeat) return;
    if (e.code === 'Space') { if (S.phase !== 'fight') press(); }
    else if (e.code === 'Escape') { if (S.phase === 'done') close(); else { end(false, S.phase !== 'cast', S.phase === 'cast' ? 'You reel in without casting.' : 'You cut the line and reel in.', true); close(); } }
  });
  window.addEventListener('keyup', (e) => { held[e.code] = false; });

  return { start, update, get active() { return !!S; }, get game() { return S; }, press, hold: (on) => { held.Space = on; },
    pick: (depth, big, noSturgeon) => pickFish(rules, depth, big, noSturgeon), biteNow: (hour, raining) => biteNow(rules, hour, raining) };
}

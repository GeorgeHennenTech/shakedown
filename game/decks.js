// SHAKEDOWN, the Decks: the mixing game. Two decks, a crate of tracks, and a floor to keep moving.
// A set is a chain of mixes: pick the next track, line its beat up with the one playing, start the
// blend on a phrase, swap the bass in the middle. The rules read their numbers from data/crate.json.
// The top half of this file is rules (no drawing, no sound); the bottom half is what you see and hear.

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const frac = (v) => v - Math.floor(v);

// ---- rules that any engine can reuse -------------------------------------------------------------
export function keysMatch(a, b) { // Camelot wheel: same code, a neighbouring number, or the other letter
  const na = parseInt(a, 10), nb = parseInt(b, 10), la = a.slice(-1), lb = b.slice(-1);
  if (na === nb) return true;
  const gap = Math.min((na - nb + 12) % 12, (nb - na + 12) % 12);
  return gap === 1 && la === lb;
}
export function moodFit(want, from, to) { // how well the next track answers what the floor wants
  const d = to - from;
  if (want === 'up') return d > 0 ? 1 : d === 0 ? 0.5 : 0;
  if (want === 'down') return d < 0 ? 1 : d === 0 ? 0.5 : 0;
  return d === 0 ? 1 : Math.abs(d) === 1 ? 0.5 : 0;
}
export function rollWant(energy, recent) { // recent: energies of the last two tracks
  if (energy >= 5 || (recent.length > 1 && recent.every((e) => e >= 4))) return 'down';
  if (energy <= 1) return 'up';
  const r = Math.random();
  return r < 0.45 ? 'up' : r < 0.75 ? 'hold' : 'down';
}
// One mix, scored 0 to 1. parts: { align 0..1, phrase 0..1, swap 0..1, key bool, mood 0..1, stretched bool }
export function scoreMix(parts, weights) {
  const q = weights.align * parts.align + weights.phrase * parts.phrase + weights.swap * parts.swap + weights.key * (parts.key ? 1 : 0) + weights.mood * parts.mood - (parts.stretched ? 0.15 : 0);
  return clamp(q);
}
export const WANT_TEXT = {
  up: 'The floor is restless. They want it harder.',
  hold: 'They are locked in. Keep this groove.',
  down: 'They are gassed. Give them a breather.',
};

// ---- the game ------------------------------------------------------------------------------------
export function createDecks({ $, crate, isMuted = () => false }) {
  const R = crate.set, T = crate.tracks;
  const root = $('decks'), canvas = $('deckview'), g2 = canvas.getContext('2d');
  let S = null; // the set in progress
  const held = {};
  let ac = null, master = null, noiseBuf = null;

  // ---- sound: every track is a little pattern made in code from its tempo, key and tag
  function audio() {
    if (ac) { if (ac.state === 'suspended') ac.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try {
      ac = new AC();
      master = ac.createGain(); master.gain.value = 0.5; master.connect(ac.destination);
      noiseBuf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
      const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    } catch (e) { ac = null; }
  }
  function chain(deck) { // low (kick and bass) and high (hats and lead) run through their own faders
    if (!ac) return;
    deck.out = ac.createGain(); deck.out.gain.value = 0; deck.out.connect(master);
    deck.lowG = ac.createGain(); deck.lowG.connect(deck.out);
    deck.hiG = ac.createGain(); deck.hiG.connect(deck.out);
  }
  // ---- recorded music: a track may carry an audio file (crate.json: audio { file, bpm, offset, bars }). It plays as a loop,
  // sped up or slowed down to the deck's tempo, split into lows and highs so the faders and the bass swap still work.
  // Until the file has loaded, or if it will not load, the deck falls back to the made-in-code pattern.
  const buffers = {};
  function loadClip(deck) {
    const a = deck.tr.audio;
    if (!a || !ac) return;
    deck.clip = { a, buf: null, src: null, t: 0, rate: 1, last: 0 };
    buffers[a.file] = buffers[a.file] || fetch(a.file).then((r) => r.arrayBuffer()).then((b) => ac.decodeAudioData(b)).catch(() => null);
    buffers[a.file].then((buf) => { if (deck.clip) deck.clip.buf = buf; });
  }
  function stopClip(deck) { const c = deck && deck.clip; if (c && c.src) { try { c.src.stop(ac.currentTime + 0.08); } catch (e) { /* already stopped */ } c.src = null; } }
  function playClip(deck) { // called every frame for a deck with a loaded file
    const c = deck.clip, a = c.a, loop = a.bars * 4 * 60 / a.bpm, now = ac.currentTime;
    const want = ((deck.pos * 60 / a.bpm) % loop + loop) % loop; // where in the loop the deck's beat counter says we should be
    const rate = deck.bpm / a.bpm;
    if (!c.src) {
      const src = ac.createBufferSource(), lo = ac.createBiquadFilter(), hi = ac.createBiquadFilter(), trim = ac.createGain();
      src.buffer = c.buf; src.loop = true; src.loopStart = a.offset; src.loopEnd = a.offset + loop; src.playbackRate.value = rate;
      lo.type = 'lowpass'; lo.frequency.value = 190; hi.type = 'highpass'; hi.frequency.value = 190; trim.gain.value = a.gain || 0.85;
      src.connect(trim); trim.connect(lo).connect(deck.lowG); trim.connect(hi).connect(deck.hiG);
      src.start(0, a.offset + want);
      c.src = src; c.t = want; c.rate = rate; c.last = now;
      return;
    }
    c.t = (c.t + (now - c.last) * c.rate) % loop; c.last = now; // where the file actually is
    let err = want - c.t; if (err > loop / 2) err -= loop; else if (err < -loop / 2) err += loop;
    if (Math.abs(err) > 0.3) { stopClip(deck); return; } // far out (a jump): start again in the right place next frame
    c.rate = rate * (1 + Math.max(-0.06, Math.min(0.06, err * 1.2))); // otherwise bend the speed to catch up, the way a nudge sounds on real decks
    c.src.playbackRate.setTargetAtTime(c.rate, now, 0.02);
  }
  function unchain(deck) { stopClip(deck); if (deck && deck.out) { const o = deck.out; o.gain.setTargetAtTime(0, ac.currentTime, 0.05); setTimeout(() => o.disconnect(), 600); deck.out = null; } }
  function tone(dest, freq, at, len, type, vol, endFreq) {
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, at);
    if (endFreq) o.frequency.exponentialRampToValueAtTime(endFreq, at + len);
    g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(vol, at + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, at + len);
    o.connect(g).connect(dest); o.start(at); o.stop(at + len + 0.05);
  }
  function hiss(dest, at, len, freq, vol) {
    const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
    s.buffer = noiseBuf; f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = 0.9;
    g.gain.setValueAtTime(vol, at); g.gain.exponentialRampToValueAtTime(0.0001, at + len);
    s.connect(f).connect(g).connect(dest); s.start(at, Math.random() * 0.5); s.stop(at + len + 0.02);
  }
  const STYLE = { // 16 steps to the bar
    feels: { kick: [0, 4, 8, 12], snare: [4, 12], hat: [2, 6, 10, 14], bass: [2, 6, 10, 14], lead: 'saw' },
    groove: { kick: [0, 4, 8, 12], snare: [4, 12], hat: [2, 6, 10, 14, 15], bass: [3, 6, 11, 14], lead: 'triangle' },
    glitch: { kick: [0, 4, 8, 12], snare: [4, 13], hat: [1, 2, 6, 9, 10, 14], bass: [2, 7, 10, 15], lead: 'square' },
    808: { kick: [0, 6, 10], snare: [8], hat: [0, 2, 4, 6, 8, 10, 12, 13, 14, 15], bass: [0, 6, 10], lead: 'square' },
    wonk: { kick: [0, 3, 10], snare: [8], hat: [2, 6, 10, 12, 14], bass: [0, 3, 6, 10, 11], lead: 'sawtooth' },
    halftime: { kick: [0, 7, 10], snare: [8], hat: [0, 4, 8, 12, 14], bass: [0, 7, 10], lead: 'triangle' },
    downtempo: { kick: [0, 10], snare: [8], hat: [4, 12], bass: [0, 10], lead: 'sine' },
  };
  function tune(tr) { // root note and scale from the Camelot code, and a melody that is always the same for this track
    const n = parseInt(tr.key, 10), minor = tr.key.endsWith('A');
    const pc = (((9 + 7 * (n - 8)) % 12) + 12 + (minor ? 0 : 3)) % 12;
    const rootHz = 55 * 2 ** (((pc + 3) % 12) / 12); // an octave of bass notes from low A
    let seed = 0; for (const ch of tr.name) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
    const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    const scale = minor ? [0, 3, 5, 7, 10] : [0, 2, 4, 7, 9];
    const melody = Array.from({ length: 16 }, () => (rnd() < 0.3 + tr.energy * 0.09 ? scale[Math.floor(rnd() * 5)] + (rnd() < 0.3 ? 12 : 0) : -1));
    return { rootHz, scale, melody, style: STYLE[tr.tag] || STYLE.feels };
  }
  function fire(deck, step, at) { // one sixteenth note of one deck
    const st = deck.tune.style, s = ((step % 16) + 16) % 16, bar = Math.floor(step / 16);
    const rootHz = deck.tune.rootHz * 2 ** ([0, 0, deck.tune.scale[2], deck.tune.scale[3]][((bar % 4) + 4) % 4] / 12);
    if (st.kick.includes(s)) tone(deck.lowG, 130, at, 0.2, 'sine', 0.95, 44);
    if (st.bass.includes(s)) tone(deck.lowG, rootHz, at, 0.16, 'sawtooth', 0.26);
    if (st.snare.includes(s)) { hiss(deck.hiG, at, 0.11, 1900, 0.3); tone(deck.hiG, 210, at, 0.07, 'triangle', 0.16, 150); }
    if (st.hat.includes(s)) hiss(deck.hiG, at, 0.035, 7200, 0.13);
    const m = deck.tune.melody[s];
    if (m >= 0 && bar % 4 !== 0) tone(deck.hiG, rootHz * 4 * 2 ** (m / 12), at, 0.13, st.lead, 0.05);
  }

  // ---- scratching: purple stretches on deck A's lane are your chance. Work the record back and forth (W and S, in turn)
  // while one passes the playhead and you bank style points, the way a whammy bar works a held note. Outside a stretch a
  // scratch still sounds, and earns nothing. Numbers are `scratch` in crate.json.
  const SC = R.scratch || { every: 16, at: 10, beats: 4, strokes: [3, 5, 7], lift: 0.012 };
  const scratchStart = (pos) => { // the start beat of the stretch this position is inside, or null
    if (!S || !S.A) return null;
    const start = Math.floor((pos - SC.at) / SC.every) * SC.every + SC.at;
    return pos >= start && pos < start + SC.beats && start >= S.A.live + 4 ? start : null;
  };
  function scratch(dir) { // dir: 1 forward (W), -1 back (S)
    if (!S || !S.A || S.phase === 'open') return;
    if (S.sc.last === dir) return; // the same way twice is not a scratch
    S.sc.last = dir; S.sc.wobble = dir;
    if (ac && S.A.out) { const at = ac.currentTime; tone(S.A.hiG, dir > 0 ? 300 : 920, at, 0.085, 'sawtooth', 0.2, dir > 0 ? 960 : 280); hiss(S.A.hiG, at, 0.07, 2600, 0.22); }
    const start = scratchStart(S.A.pos);
    if (start === null) return;
    if (S.sc.win !== start) { bankScratch(); S.sc.win = start; S.sc.strokes = 0; S.sc.tight = 0; }
    S.sc.strokes++;
    if (Math.abs(frac(S.A.pos * 2 + 0.5) - 0.5) < 0.17) S.sc.tight++; // on an eighth note
  }
  function bankScratch() { // the stretch has gone by: turn the strokes into style
    const c = S.sc;
    if (c.win === null) return;
    const [one, two, three] = SC.strokes, onBeat = c.strokes ? c.tight / c.strokes : 0;
    const pts = c.strokes >= three && onBeat >= 0.5 ? 3 : c.strokes >= two ? 2 : c.strokes >= one ? 1 : 0;
    c.win = null;
    if (!pts) return;
    S.style += pts; S.energy = clamp(S.energy + SC.lift * pts); S.flash = Math.max(S.flash, 0.5);
    say(pts === 3 ? 'Scratched it clean, right on the beat. +3 style.' : pts === 2 ? 'Nice cut. +2 style.' : 'A little scratch. +1 style.', 3);
  }
  // ---- decks
  function makeDeck(id, pos) {
    const tr = T[id], d = { id, tr, pos, next: Math.ceil(pos * 4), bpm: tr.bpm, vol: 0, low: 1, live: pos, tune: tune(tr) };
    chain(d); loadClip(d);
    return d;
  }
  const phaseErr = () => { const e = frac(S.B.pos - S.A.pos); return e >= 0.5 ? e - 1 : e; }; // how far B's beat sits off A's, in beats
  const beatsLeft = () => R.trackBeats - (S.A.pos - S.A.live);

  function start(opts) {
    // opts: { owned: [ids], level, manual, steady, ears, startEnergy, crowd, onDone }
    audio();
    S = { ...opts, phase: 'open', A: null, B: null, energy: opts.startEnergy, mix: 0, style: 0, sc: { win: null, strokes: 0, tight: 0, last: 0, wobble: 0 }, played: [], want: 'up', log: [], wrecks: 0, dead: 0, msg: '', msgTill: 0, t: 0, flash: 0, drift: 0, driftIn: 0, sum: 0, time: 0, bs: 0, swapped: null, phrase: 0, wrecking: false, last: null };
    S.skip = true; setTimeout(() => { if (S) S.skip = false; }, 0); // the key press that chose 'Play a set' is not also a track pick
    root.classList.remove('hidden');
    fit();
    drawCrate();
    say(S.manual ? 'No sync, no meter. Pick your opener.' : 'Pick your opening track.');
  }
  function say(text, seconds = 5) { S.msg = text; S.msgTill = S.t + seconds; }
  function tight() { return R.tight + Math.min(0.03, (S.level - 1) * 0.004); }

  function pick(i) {
    if (!S || !['open', 'pick', 'cue'].includes(S.phase)) return;
    const id = S.owned[i];
    if (!id || S.played.includes(id) || (S.B && S.B.id === id)) return;
    if (S.phase === 'open') {
      S.A = makeDeck(id, 0); S.A.vol = 1; S.played.push(id); S.phase = 'pick';
      S.want = rollWant(S.A.tr.energy, []);
      say(`${S.A.tr.name} is playing the room. Pick what comes next.`);
    } else {
      unchain(S.B);
      const side = Math.random() < 0.5 ? -1 : 1;
      S.B = makeDeck(id, Math.floor(S.A.pos) + 1 + side * (0.14 + Math.random() * 0.3));
      S.B.low = 0; S.B.vol = 0.3; // in your headphones: quiet, no bass
      if (S.manual) S.B.bpm = S.B.tr.bpm === S.A.bpm ? S.B.tr.bpm + 1.5 * side : S.B.tr.bpm;
      else { S.B.bpm = S.A.bpm; S.drift = 0; S.driftIn = 0; }
      S.phase = 'cue';
      say(S.manual ? 'Match the tempo with ↑ ↓, line the beats up with ← →, then Space on the phrase.' : 'Line the beats up with ← →, then press Space on the gold line.', 8);
    }
    drawCrate();
  }

  function press() { // Space
    if (!S) return;
    if (S.phase === 'cue') {
      const p = S.A.pos, toPhrase = Math.abs(p - Math.round(p / R.phraseBeats) * R.phraseBeats), toBar = Math.abs(p - Math.round(p / 4) * 4);
      S.phrase = toPhrase < 0.6 ? 1 : toBar < 0.5 ? 0.6 : 0.2;
      S.bs = p; S.sum = 0; S.time = 0; S.swapped = null; S.phase = 'blend';
      say(`${S.phrase === 1 ? 'On the phrase.' : S.phrase === 0.6 ? 'On the bar, not the phrase.' : 'Off the phrase.'} Keep them together, and swap the bass with Space on the pink line.`, 6);
      drawCrate();
    } else if (S.phase === 'blend' && S.swapped === null) {
      const off = Math.abs(S.A.pos - (S.bs + R.blendBeats / 2));
      S.swapped = off < 0.6 ? 1 : off < 1.6 ? 0.6 : 0.2;
      S.A.low = 0; S.B.low = 1; S.flash = 1;
      say(S.swapped === 1 ? 'Bass swapped, right on it.' : S.swapped === 0.6 ? 'Bass swapped, a touch off.' : 'Bass swapped at an odd moment.', 3);
    }
  }

  function finishMix(forced) { // B takes over the room
    const from = S.A.tr, to = S.B.tr;
    const align = forced ? 0 : clamp(1 - (S.sum / Math.max(0.001, S.time) - tight()) / (R.wreck - tight()));
    const parts = { align, phrase: forced ? 0 : S.phrase, swap: forced ? 0 : (S.swapped || 0), key: keysMatch(from.key, to.key), mood: moodFit(S.want, from.energy, to.energy), stretched: Math.abs(to.bpm - from.bpm) / from.bpm > R.stretch };
    const q = scoreMix(parts, R.weights);
    let lift = (q - 0.5) * 0.5; if (lift > 0 && S.manual) lift *= 1.25;
    S.energy = clamp(S.energy + lift);
    const wreck = !forced && align < 0.15;
    if (wreck) { S.wrecks++; S.energy = clamp(S.energy - 0.08); }
    S.last = { ...parts, q, wreck, forced, from: from.name, to: to.name };
    S.log.push(S.last);
    unchain(S.A);
    S.A = S.B; S.B = null; S.A.vol = 1; S.A.low = 1; S.A.live = forced ? S.A.pos : S.bs; S.A.bpm = S.manual ? S.A.bpm : S.A.tr.bpm;
    S.sc.win = null; S.sc.strokes = 0; // a new record under the needle
    S.played.push(S.A.id); S.mix++; S.wrecking = false;
    const words = forced ? 'Dead air, then a hard cut.' : [wreck ? 'Train wreck.' : align > 0.8 ? 'Clean blend.' : align > 0.45 ? 'A bit loose.' : 'Sloppy.', parts.key ? 'Keys sat well.' : 'Key clash: it sounded sour.', parts.mood === 1 ? 'Just what the floor wanted.' : parts.mood ? 'The floor shrugged.' : 'Wrong mood for the floor.', parts.stretched ? 'The tempo jump was a stretch.' : ''].join(' ');
    if (S.mix >= R.mixes) { S.phase = 'out'; S.outAt = S.A.pos + 16; say(`${words} Last track: ride it out.`, 7); }
    else { S.phase = 'pick'; S.want = rollWant(S.A.tr.energy, S.played.slice(-2).map((id) => T[id].energy)); say(`${words} Pick the next one.`, 7); }
    drawCrate();
  }

  function deadAir() {
    S.dead++; S.energy = clamp(S.energy - 0.22);
    if (!S.B) { const left = S.owned.filter((id) => !S.played.includes(id)); S.B = makeDeck(left[Math.floor(Math.random() * left.length)] || S.owned[0], Math.floor(S.A.pos) + 1); }
    finishMix(true);
  }

  function end(quit) {
    const energy = quit ? S.energy * 0.5 : S.energy, done = S.onDone, result = { energy, log: S.log, wrecks: S.wrecks, dead: S.dead, manual: S.manual, quit, mixes: S.mix, style: S.style };
    unchain(S.A); unchain(S.B);
    S = null; root.classList.add('hidden');
    done(result);
  }

  function update(dt) {
    if (!S) return;
    S.t += dt; S.flash = Math.max(0, S.flash - dt * 2);
    if (master) master.gain.value = isMuted() ? 0 : 0.5;
    if (S.A) {
      // B's tempo: with sync it follows A but wanders a little; without, it is whatever you set
      if (S.B && !S.manual) {
        S.driftIn -= dt;
        if (S.driftIn <= 0) { S.driftIn = 4 + Math.random() * 4; S.drift = (Math.random() < 0.5 ? -1 : 1) * (0.25 + Math.random() * 0.4) * (S.steady ? 0.5 : 1) * Math.max(0.5, 1 - (S.level - 1) * 0.04); }
        S.B.bpm = S.A.bpm + S.drift;
      }
      if (S.B) {
        const nudge = (held.ArrowLeft ? 1 : 0) - (held.ArrowRight ? 1 : 0); // → slides B's marks to the right on screen
        S.B.pos += nudge * 0.22 * dt;
      }
      if (S.sc.win !== null && S.A.pos >= S.sc.win + SC.beats) bankScratch();
      for (const d of [S.A, S.B]) if (d) {
        d.pos += dt * d.bpm / 60;
        if (ac && d.out) {
          const rate = d.bpm / 60;
          if (d.next / 4 < d.pos - 0.5) d.next = Math.ceil(d.pos * 4);
          if (d.clip && d.clip.buf) { playClip(d); d.next = Math.ceil(d.pos * 4); } // a recorded track plays its file
          else while ((d.next / 4 - d.pos) / rate < 0.12) { fire(d, d.next, ac.currentTime + Math.max(0, (d.next / 4 - d.pos) / rate)); d.next++; }
        }
      }
      if (S.phase === 'blend') {
        const u = clamp((S.A.pos - S.bs) / R.blendBeats), e = Math.abs(phaseErr());
        S.A.vol = Math.cos(u * Math.PI / 2) ** 0.7; S.B.vol = 0.3 + 0.7 * Math.sin(u * Math.PI / 2) ** 0.7;
        S.sum += e * dt; S.time += dt;
        S.wrecking = e > R.wreck;
        if (S.wrecking) S.energy = clamp(S.energy - 0.02 * dt);
        if (u >= 1) finishMix(false);
      } else if (S.phase === 'pick' || S.phase === 'cue') {
        if (beatsLeft() <= 0) deadAir();
      } else if (S.phase === 'out' && S.A.pos >= S.outAt) { end(false); return; }
      if (S.phase !== 'out') S.energy = clamp(S.energy - 0.003 * dt);
      for (const d of [S.A, S.B]) if (d && d.out) { d.out.gain.value = d.vol * 0.9; d.lowG.gain.value = d.low; }
    }
    draw();
  }

  // ---- what you see
  function fit() {
    const r = Math.min(2, window.devicePixelRatio || 1), w = canvas.clientWidth || 800, h = canvas.clientHeight || 280;
    if (canvas.width !== Math.round(w * r)) { canvas.width = Math.round(w * r); canvas.height = Math.round(h * r); }
    g2.setTransform(r, 0, 0, r, 0, 0);
    return [w, h];
  }
  const TAG = { feels: 'Feels', groove: 'Groove', glitch: 'Glitch', 808: '808s', wonk: 'Wonk', halftime: 'Halftime', downtempo: 'Downtempo' };
  function drawCrate() {
    const cur = S.A ? S.A.tr : null, picking = ['open', 'pick', 'cue'].includes(S.phase);
    const help = !S.manual || S.ears;
    $('deckcrate').innerHTML = S.owned.map((id, i) => {
      const tr = T[id], used = S.played.includes(id), loaded = S.B && S.B.id === id;
      const key = cur && help && !used ? (keysMatch(cur.key, tr.key) ? ' match' : ' clash') : '';
      const d = cur ? tr.energy - cur.energy : 0;
      return `<button class="track${used ? ' used' : ''}${loaded ? ' on' : ''}${key}" data-i="${i}" ${used || !picking ? 'disabled' : ''}>`
        + `<b>${i < 9 ? `<kbd>${i + 1}</kbd> ` : ''}${tr.name}${tr.rare ? ' ★' : ''}</b><small>${tr.artist} · ${TAG[tr.tag] || tr.tag}</small>`
        + `<span>${tr.bpm} BPM · <i class="key">${tr.key}</i> · ${'●'.repeat(tr.energy)}${'○'.repeat(5 - tr.energy)}${cur && !used ? ` <em>${d > 0 ? '▲' : d < 0 ? '▼' : '＝'}</em>` : ''}</span></button>`;
    }).join('');
  }
  function lane(y, h, deck, colour, label, w, scratchable = false) {
    const cx = w * 0.5, px = 84;
    g2.fillStyle = 'rgba(255,243,214,.07)'; g2.fillRect(0, y, w, h);
    if (deck && scratchable) { // where you may scratch: a purple stretch that fills as you work it
      const k0 = Math.floor((deck.pos - cx / px - SC.at) / SC.every), k1 = Math.ceil((deck.pos + cx / px - SC.at) / SC.every);
      for (let k = k0; k <= k1; k++) {
        const start = k * SC.every + SC.at; if (start < deck.live + 4) continue;
        const x = cx + (start - deck.pos) * px, bw = SC.beats * px, mine = S.sc.win === start, live = deck.pos >= start && deck.pos < start + SC.beats;
        g2.fillStyle = live ? 'rgba(213,155,255,.42)' : 'rgba(213,155,255,.2)'; g2.fillRect(x, y, bw, h);
        if (mine) { g2.fillStyle = 'rgba(255,255,255,.35)'; g2.fillRect(x, y + h - 7, bw * Math.min(1, S.sc.strokes / SC.strokes[2]), 7); }
        g2.fillStyle = '#e9d2ff'; g2.font = '800 11px system-ui'; g2.textAlign = 'left'; g2.fillText(live ? 'SCRATCH!  W ⇄ S' : 'SCRATCH', x + 6, y + 13);
      }
    }
    if (!deck) { g2.fillStyle = 'rgba(255,243,214,.45)'; g2.font = '600 14px system-ui'; g2.textAlign = 'center'; g2.fillText(label, cx, y + h / 2 + 5); return; }
    const first = Math.floor(deck.pos - cx / px) - 1, last = Math.ceil(deck.pos + cx / px) + 1;
    for (let b = first; b <= last; b++) {
      const x = cx + (b - deck.pos) * px, bar = b % 4 === 0, phrase = b % R.phraseBeats === 0;
      g2.fillStyle = phrase ? '#ffc93c' : colour; g2.globalAlpha = bar ? 1 : 0.55;
      const bw = phrase ? 7 : bar ? 5 : 3, bh = bar ? h - 10 : h * 0.5;
      g2.fillRect(x - bw / 2, y + (h - bh) / 2, bw, bh);
      if (b >= deck.live && bar) { g2.globalAlpha = 0.6; g2.font = '11px system-ui'; g2.textAlign = 'left'; g2.fillText(String(((b / 4) % 4 + 4) % 4 + 1), x + 6, y + 13); }
    }
    g2.globalAlpha = 1;
    g2.fillStyle = 'rgba(255,243,214,.9)'; g2.font = '700 13px system-ui'; g2.textAlign = 'left';
    g2.fillText(label, 10, y + h - 8);
  }
  function draw() {
    const [w, h] = fit();
    g2.clearRect(0, 0, w, h);
    // the floor: one dot per dancer; the fuller the Crowd Energy, the more of them are moving
    const n = S.crowd, beat = S.A ? frac(S.A.pos) : 0, hop = S.A ? Math.max(0, 1 - beat * 2.2) : 0;
    for (let i = 0; i < n; i++) {
      const on = i / n < S.energy, x = w * (0.08 + 0.84 * ((i * 0.618) % 1)), row = i % 3, y = 44 + row * 13 - (on ? hop * (5 + (i % 4)) : 0);
      g2.globalAlpha = on ? 1 : 0.28;
      g2.fillStyle = ['#ff7a59', '#ffc93c', '#7cf29a', '#6ec5ff', '#d59bff'][i % 5];
      g2.beginPath(); g2.arc(x, y, 5.5, 0, 7); g2.fill();
      g2.fillRect(x - 4, y + 5, 8, 9);
    }
    g2.globalAlpha = 1;
    const y0 = 92, lh = 58;
    lane(y0, lh, S.A, '#ff7a59', S.A ? `A · ${S.A.tr.name} · ${S.A.bpm.toFixed(1)} BPM` : 'Deck A: pick your opener from the crate below', w, true);
    if (S.A && S.sc.wobble) { // the record jumps under your hand
      g2.save(); g2.translate(w - 34, y0 + lh / 2); g2.rotate(S.sc.wobble * 0.55); g2.fillStyle = '#17111f'; g2.beginPath(); g2.arc(0, 0, 20, 0, 7); g2.fill(); g2.fillStyle = '#d59bff'; g2.beginPath(); g2.arc(0, 0, 7, 0, 7); g2.fill(); g2.fillStyle = '#fff3d6'; g2.fillRect(-1.5, -19, 3, 9); g2.restore();
      S.sc.wobble *= 0.86; if (Math.abs(S.sc.wobble) < 0.03) S.sc.wobble = 0;
    }
    lane(y0 + lh + 8, lh, S.B, '#6ec5ff', S.B ? `B · ${S.B.tr.name} · ${S.B.bpm.toFixed(1)} BPM${S.phase === 'cue' ? ' · in your headphones' : ''}` : S.A && S.phase === 'pick' ? 'Deck B: load a track from the crate' : '', w);
    // the playhead, and the marks you aim for
    const cx = w * 0.5, px = 84;
    g2.fillStyle = '#fff3d6'; g2.fillRect(cx - 1, y0 - 6, 2, lh * 2 + 20);
    if (S.phase === 'blend') {
      const x = cx + (S.bs + R.blendBeats / 2 - S.A.pos) * px;
      if (S.swapped === null && x > -20 && x < w + 20) { g2.fillStyle = '#ff5fa2'; g2.fillRect(x - 3, y0 - 8, 6, lh * 2 + 24); g2.font = '700 12px system-ui'; g2.textAlign = 'center'; g2.fillText('BASS', x, y0 - 12); }
      const u = clamp((S.A.pos - S.bs) / R.blendBeats); // the crossfader
      g2.fillStyle = 'rgba(255,243,214,.25)'; g2.fillRect(cx - 90, y0 + lh * 2 + 22, 180, 6);
      g2.fillStyle = '#fff3d6'; g2.fillRect(cx - 90 + u * 180 - 7, y0 + lh * 2 + 16, 14, 18);
    }
    // the phase meter: training wheels that show how far B is off
    if (S.B && !S.manual) {
      const e = phaseErr(), mw = 260, mx = cx - mw / 2, my = h - 26, tz = tight() / 0.5 * (mw / 2) * 2.2;
      g2.fillStyle = 'rgba(255,243,214,.18)'; g2.fillRect(mx, my, mw, 10);
      g2.fillStyle = '#7cf29a'; g2.fillRect(cx - tz, my, tz * 2, 10);
      g2.fillStyle = Math.abs(e) > R.wreck ? '#ff5f5f' : '#fff3d6'; g2.fillRect(cx - clamp(e * 2.2, -0.5, 0.5) * mw - 3, my - 5, 6, 20);
      g2.fillStyle = 'rgba(255,243,214,.7)'; g2.font = '12px system-ui'; g2.textAlign = 'center';
      g2.fillText(Math.abs(e) <= tight() ? 'locked' : e > 0 ? 'slide B right: →' : 'slide B left: ←', cx, my - 9);
    }
    if (S.phase === 'cue') { const to = Math.ceil(S.A.pos / R.phraseBeats - 0.02) * R.phraseBeats - S.A.pos; g2.fillStyle = to < 4 ? '#ffc93c' : 'rgba(255,243,214,.75)'; g2.font = '700 13px system-ui'; g2.textAlign = 'right'; g2.fillText(to < 0.5 ? 'NOW' : `phrase in ${Math.ceil(to)}`, w - 10, y0 - 8); }
    if (S.wrecking) { g2.fillStyle = `rgba(255,95,95,${0.16 + 0.1 * Math.sin(S.t * 18)})`; g2.fillRect(0, 0, w, h); g2.fillStyle = '#fff'; g2.font = '900 30px system-ui'; g2.textAlign = 'center'; g2.fillText('TRAIN WRECK', cx, 34); }
    if (S.flash > 0) { g2.fillStyle = `rgba(255,243,214,${S.flash * 0.25})`; g2.fillRect(0, 0, w, h); }
    // the words around the picture
    $('deckenergy').style.width = `${S.energy * 100}%`;
    $('deckenergy').style.background = S.energy > 0.7 ? '#7cf29a' : S.energy > 0.35 ? '#ffc93c' : '#ff5f5f';
    $('deckmix').textContent = (S.phase === 'open' ? 'Open Decks' : S.phase === 'out' ? 'Last track' : `Mix ${Math.min(R.mixes, S.mix + 1)} of ${R.mixes}`) + (S.style ? ` · Style ${S.style}` : '');
    $('deckwant').textContent = S.A && S.phase !== 'out' ? WANT_TEXT[S.want] : S.phase === 'out' ? 'Soak it in.' : 'Three mixes. Keep the floor moving.';
    const left = S.A && (S.phase === 'pick' || S.phase === 'cue') ? beatsLeft() : null;
    $('deckleft').textContent = left === null ? '' : `${Math.max(0, Math.ceil(left / 4))} bars left on this track`;
    $('deckleft').classList.toggle('warn', left !== null && left < 24);
    $('deckmsg').textContent = S.t < S.msgTill ? S.msg : S.phase === 'cue' ? `Space starts the blend. Next gold line in ${Math.ceil(Math.ceil(S.A.pos / R.phraseBeats - 0.02) * R.phraseBeats - S.A.pos)} beats.` : S.phase === 'pick' ? 'Pick the next track: number keys or click. Scratch with W and S on the purple stretches.' : S.phase === 'out' ? 'Scratch with W and S on the purple stretches.' : '';
  }

  // ---- hands
  window.addEventListener('keydown', (e) => {
    if (!S || S.skip) return;
    held[e.code] = true;
    if (e.repeat && !['ArrowUp', 'ArrowDown'].includes(e.code)) return;
    if (e.code === 'Space') press();
    else if (e.code === 'KeyW') scratch(1);
    else if (e.code === 'KeyS') scratch(-1);
    else if (e.code.startsWith('Digit')) pick(+e.code.slice(5) - 1);
    else if (S.manual && S.B && (e.code === 'ArrowUp' || e.code === 'ArrowDown')) S.B.bpm = Math.round((S.B.bpm + (e.code === 'ArrowUp' ? 0.1 : -0.1)) * 10) / 10;
    else if (e.code === 'Escape') end(S.phase !== 'open');
  });
  window.addEventListener('keyup', (e) => { held[e.code] = false; });
  $('deckcrate').addEventListener('click', (e) => { const b = e.target.closest('button[data-i]'); if (b) pick(+b.dataset.i); });

  return { start, update, get active() { return !!S; }, get set() { return S; }, press, pick, scratch };
}

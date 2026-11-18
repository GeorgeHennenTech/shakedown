// All the game's sound outside the cooking view, made in code: footsteps, rain, crowd murmur,
// a distant kick-and-bass from the main stage, and short blips for sales, pick-ups and level-ups.
// Nothing plays until the first key press or click, which is when browsers allow audio to start.

export function createSound() {
  let ctx = null, master = null, rainGain, crowdGain, musicGain, stepIn = 0, beatIn = 0, beat = 0, muted = false;

  function noise(seconds, brown) {
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * seconds), ctx.sampleRate), d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < d.length; i++) {
      const white = Math.random() * 2 - 1;
      if (brown) { last = (last + 0.02 * white) / 1.02; d[i] = last * 3.5; } else d[i] = white;
    }
    return buf;
  }
  function loop(buffer, filterType, freq) {
    const src = ctx.createBufferSource(), filter = ctx.createBiquadFilter(), gain = ctx.createGain();
    src.buffer = buffer; src.loop = true;
    filter.type = filterType; filter.frequency.value = freq;
    gain.gain.value = 0;
    src.connect(filter).connect(gain).connect(master);
    src.start();
    return gain;
  }
  let white = null;
  function start() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = muted ? 0 : 0.5; master.connect(ctx.destination);
    white = noise(2, false);
    rainGain = loop(white, 'highpass', 2200);
    crowdGain = loop(noise(3, true), 'lowpass', 520);
    musicGain = ctx.createGain(); musicGain.gain.value = 0;
    const muffle = ctx.createBiquadFilter(); muffle.type = 'lowpass'; muffle.frequency.value = 700; // heard from across a field
    musicGain.connect(muffle).connect(master);
  }
  // one note with a quick fade
  function tone(freq, at, length, type, volume, dest = master, endFreq) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, at);
    if (endFreq) o.frequency.exponentialRampToValueAtTime(endFreq, at + length);
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(volume, at + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, at + length);
    o.connect(g).connect(dest);
    o.start(at); o.stop(at + length + 0.05);
  }
  // a short burst of noise: a footstep, a rustle, a hi-hat
  function burst(at, length, freq, volume, dest = master) {
    const src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    src.buffer = white; f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = 0.8;
    g.gain.setValueAtTime(volume, at); g.gain.exponentialRampToValueAtTime(0.0001, at + length);
    src.connect(f).connect(g).connect(dest);
    src.start(at, Math.random()); src.stop(at + length + 0.02);
  }
  const SFX = {
    coin: (t) => { tone(988, t, 0.09, 'square', 0.07); tone(1319, t + 0.08, 0.22, 'square', 0.07); },
    level: (t) => { [523, 659, 784, 1047].forEach((f, i) => tone(f, t + i * 0.09, 0.25, 'triangle', 0.12)); },
    pick: (t) => { burst(t, 0.09, 1800, 0.12); tone(420, t, 0.07, 'sine', 0.06, master, 620); },
    build: (t) => { tone(140, t, 0.1, 'triangle', 0.2, master, 90); tone(150, t + 0.16, 0.1, 'triangle', 0.2, master, 90); burst(t + 0.16, 0.05, 900, 0.08); },
    no: (t) => { tone(240, t, 0.14, 'sine', 0.07, master, 180); },
  };

  return {
    start,
    play(name) { if (ctx && !muted && SFX[name]) SFX[name](ctx.currentTime + 0.01); },
    isMuted: () => muted,
    toggleMute() { muted = !muted; if (master) master.gain.setTargetAtTime(muted ? 0 : 0.5, ctx.currentTime, 0.05); return muted; },
    // s: { moving, running, rain, crowd 0..1, stage 0..1 }
    update(dt, s) {
      if (!ctx || muted || ctx.state !== 'running') return;
      const now = ctx.currentTime;
      rainGain.gain.setTargetAtTime(s.rain ? 0.11 : 0, now, 0.8);
      crowdGain.gain.setTargetAtTime(0.16 * s.crowd, now, 0.6);
      musicGain.gain.setTargetAtTime(0.55 * s.stage, now, 0.5);
      if (s.moving) {
        stepIn -= dt;
        if (stepIn <= 0) { stepIn = s.running ? 0.27 : 0.46; burst(now, 0.07, s.rain ? 700 : 380, s.running ? 0.11 : 0.07); }
      } else stepIn = 0;
      if (s.stage > 0.02) {
        beatIn -= dt;
        if (beatIn <= 0) {
          beatIn += 0.48; // 125 beats a minute
          tone(120, now, 0.22, 'sine', 0.9, musicGain, 42); // kick
          tone(55 * [1, 1, 1.5, 1.335][Math.floor(beat / 4) % 4], now + 0.24, 0.2, 'sawtooth', 0.3, musicGain); // off-beat bass
          burst(now + 0.24, 0.04, 6000, 0.12, musicGain); // hat
          beat++;
        }
      } else beatIn = 0;
    },
  };
}

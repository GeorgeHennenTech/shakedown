// SHAKEDOWN, the crowd: every festival-goer has a day. They sleep in the Campgrounds, drift to
// Shakedown Street at mealtimes, pack the Main Stage field when the music is on, and walk the
// paths in between. The timetable is data/crowd.json. The people are still statues (no legs
// moving): walking is a glide with a step-bob until the models are rigged.

const hash = (i, k) => { const v = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return v - Math.floor(v); };
const PLACES = ['stage', 'street', 'camp', 'village', 'sleep'];

// Which row of the plan an hour falls in. Hours before 3 AM count as 24 to 27.
export function planRow(plan, hour) {
  const h = hour < plan[0].from ? hour + 24 : hour;
  let at = 0;
  for (let i = 0; i < plan.length; i++) if (h >= plan[i].from) at = i;
  return at;
}
// Where one person wants to be: a roll against the row's shares, the same every time for that person, row and day.
export function wantOf(row, roll) {
  let sum = 0;
  for (const k of PLACES) { sum += row[k] || 0; if (roll < sum) return k; }
  return 'camp';
}

export function createCrowd({ THREE, people, instanced, routeSamples, data, isFree, rand }) {
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), pos = new THREE.Vector3(), sc = new THREE.Vector3();
  const N = routeSamples.length;
  const normal = routeSamples.map((p, k) => { // the right-hand side of the path at each sample, for somebody walking up it
    const a = routeSamples[Math.max(0, k - 1)], b = routeSamples[Math.min(N - 1, k + 1)], tx = b.x - a.x, tz = b.z - a.z, len = Math.hypot(tx, tz) || 1;
    return [-tz / len, tx / len];
  });
  const VILLAGE_SPOTS = [[-38, -142], [-41, -143.5], [-26, -156], [-64, -156], [-51, -144], [-30, -146], [-46, -150]];
  let lastTotal = null;

  people.forEach((f, i) => {
    f.i = i; f.late = hash(i, 1) * data.lateBy; f.speed = data.walkSpeed[0] + hash(i, 2) * (data.walkSpeed[1] - data.walkSpeed[0]); f.lane = 0.5 + hash(i, 3) * 1.4;
    f.ph = f.ph ?? hash(i, 4) * 6; f.mode = 'idle'; f.goal = null; f.path = null; f.spots = {}; f.heading = f.rot;
  });

  function spot(f, place) { // each person keeps the same spot at each place, so regulars are where you left them
    if (f.spots[place]) return f.spots[place];
    let s = null;
    const home = { x: f.home.x, z: f.home.z, rot: f.home.rot };
    if (place === 'sleep') return spot(f, 'camp');
    if (place === f.kind) s = home;
    else if (place === 'stage') for (let t = 0; t < 30 && !s; t++) { const x = rand(-62, -49), z = rand(-137, -105); if (isFree(x, z)) s = { x, z, rot: -Math.PI / 2 + rand(-0.35, 0.35) }; }
    else if (place === 'street') for (let t = 0; t < 30 && !s; t++) { const side = Math.random() < 0.5 ? -1 : 1, x = side * rand(3.4, 6.6), z = rand(-64, -18); if (isFree(x, z)) s = { x, z, rot: side * -Math.PI / 2 + rand(-0.6, 0.6) }; }
    else if (place === 'village') { const [x, z] = VILLAGE_SPOTS[Math.floor(Math.random() * VILLAGE_SPOTS.length)]; s = { x: x + rand(-2.5, 2.5), z: z + rand(-2.5, 2.5), rot: rand(0, 6.28) }; }
    else for (let t = 0; t < 30 && !s; t++) { const x = rand(-20, 46), z = rand(-118, -74); if (isFree(x, z)) s = { x, z, rot: rand(0, 6.28) }; }
    return (f.spots[place] = s || home);
  }

  function nearest(x, z) { let best = 0, bd = Infinity; for (let k = 0; k < N; k++) { const d = (routeSamples[k].x - x) ** 2 + (routeSamples[k].z - z) ** 2; if (d < bd) { bd = d; best = k; } } return best; }
  function pathTo(f, s) { // out to the path, along it on the right-hand side, then off to the spot
    if (Math.hypot(s.x - f.x, s.z - f.z) < 14) return [[s.x, s.z]];
    const a = nearest(f.x, f.z), b = nearest(s.x, s.z), dir = b >= a ? 1 : -1, pts = [];
    for (let k = a; dir > 0 ? k <= b : k >= b; k += dir * 2) pts.push([routeSamples[k].x + normal[k][0] * f.lane * dir, routeSamples[k].z + normal[k][1] * f.lane * dir]);
    pts.push([s.x, s.z]);
    return pts;
  }
  function settle(f, s, place) {
    f.x = s.x; f.z = s.z; f.heading = s.rot; f.mode = 'idle'; f.path = null; f.away = place === 'sleep'; f.at = place;
  }

  // c: { hour, day, total, rain, showtime, heal: [ids], px, pz }
  function update(dt, t, c) {
    const row = planRow(data.plan, c.hour), snap = lastTotal === null || Math.abs(c.total - lastTotal) > 0.25;
    lastTotal = c.total;
    const touched = new Set();
    for (const f of people) {
      if (!f.name) continue;
      const hurt = c.heal.includes(f.i);
      if (!f.fixed && !hurt) {
        // a person changes their mind a little after the row changes, each by their own delay
        const h = c.hour < data.plan[0].from ? c.hour + 24 : c.hour, r = h - data.plan[row].from < f.late ? (row + data.plan.length - 1) % data.plan.length : row;
        const key = c.day * 100 + r + (c.rain ? 0.5 : 0);
        if (key !== f.key) {
          f.key = key;
          let want = wantOf(data.plan[r], hash(f.i, 10 + c.day * 31 + r));
          if (want === 'camp' && f.kind === 'street') want = 'street'; // the Street's regulars stay on the Street
          if (want === 'stage' && c.rain && hash(f.i, 50 + r) < data.rainSendsHome) want = 'camp';
          if (want !== f.goal) {
            f.goal = want;
            const s = spot(f, want);
            if (snap) settle(f, s, want);
            else { f.away = false; f.path = pathTo(f, s); f.pi = 0; f.mode = 'walk'; f.at = null; }
          }
        } else if (snap && f.goal) settle(f, spot(f, f.goal), f.goal);
        if (f.mode === 'walk') {
          const near = Math.hypot(c.px - f.x, c.pz - f.z) < data.stopsForYou;
          if (near && (f.stopLeft ?? data.stopSeconds) > 0 && t > (f.ignoreTill || 0)) { // they stop for you, for a moment
            f.stopLeft = (f.stopLeft ?? data.stopSeconds) - dt; f.stopped = true;
            f.heading = Math.atan2(c.px - f.x, c.pz - f.z);
            if (f.stopLeft <= 0) { f.ignoreTill = t + 10; f.stopLeft = undefined; }
          } else {
            if (!near) f.stopLeft = undefined;
            f.stopped = false;
            const [tx, tz] = f.path[f.pi], dx = tx - f.x, dz = tz - f.z, d = Math.hypot(dx, dz), step = f.speed * dt;
            if (d <= step) { f.x = tx; f.z = tz; if (++f.pi >= f.path.length) settle(f, spot(f, f.goal), f.goal); }
            else { f.x += dx / d * step; f.z += dz / d * step; f.heading = Math.atan2(dx, dz); }
          }
        }
      } else if (hurt) { f.away = false; if (f.mode === 'walk') { f.mode = 'idle'; f.key = null; f.goal = null; } } // somebody who needs a healer stays where they are
      // colliders: you can walk through people who are walking, never through people standing
      if (f.col) { f.col.x = f.x; f.col.z = f.z; f.col.r = f.away ? 0 : f.mode === 'walk' && !f.stopped ? 0 : 0.35; }
      // the statue itself
      const im = instanced[f.name].mesh, walking = f.mode === 'walk' && !f.stopped;
      const dancing = !walking && c.showtime && (f.at === 'stage' || (f.fixed && f.amp > 0.04));
      const amp = dancing ? Math.max(0.06, f.amp || 0.1) : (f.amp && f.fixed ? f.amp : 0.012);
      const y = f.away ? -5 : walking ? Math.abs(Math.sin(t * 8.5 + f.ph)) * 0.05 : dancing ? Math.abs(Math.sin(t * 3.3 + f.ph)) * amp : 0;
      const yaw = f.heading + (walking ? Math.sin(t * 8.5 + f.ph) * 0.06 : Math.sin(t * 1.7 + f.ph) * amp * 1.4);
      const s = f.away ? 0.0001 : f.s;
      q.setFromAxisAngle(up, yaw);
      m.compose(pos.set(f.x, y, f.z), q, sc.set(s, s, s));
      im.setMatrixAt(f.n, m); touched.add(im);
    }
    for (const im of touched) im.instanceMatrix.needsUpdate = true;
  }

  function count() { // for tests and the map: how many people are at each place right now
    const out = { stage: 0, street: 0, camp: 0, village: 0, sleep: 0, walking: 0 };
    for (const f of people) if (!f.fixed && f.goal) out[f.mode === 'walk' ? 'walking' : f.goal]++;
    return out;
  }
  return { update, count };
}

// A test player for balance work: it plays the real game (same rules, same random rolls) by walking,
// buying, cooking and selling, far faster than real time, and reports how the money stacks up.
// It is honest but plain: it walks everywhere (never sprints), walks in straight lines through
// obstacles, never forages, gardens, DJs or sells balloons, and flips sandwiches like an average
// player (timing error set by `flipError`). Run from the browser console or a test script:
//   const { makeBot } = await import('./dev/bot.js'); const bot = makeBot({ preset: 'start' }); bot.run(20000);
// Call run() again until bot.done; bot.report() gives the numbers.
// `fillings` (kitchen preset only, e.g. ['tomato', 'pepper']) stands in for a tended garden: the bot knows those
// recipes, its stash is topped back up to twelve of each whenever one runs low, and at the stove it cooks whichever
// sandwich on the board it has fewest of. With fillings on the board, customers order those sandwiches by name.

export function makeBot({ preset = 'start', flipError = 0.03, dt = 1 / 20, speed = 2.3, fillings = [] } = {}) {
  const g = window.__game, S = g.state, P = g.player.root.position;
  const key = (code) => window.dispatchEvent(new KeyboardEvent('keydown', { code }));
  const total = () => S.day * 24 + S.hour;
  const SPOT = { store: null, tent: null, stove: null, permit: null, showers: null };

  // cards and other delays run on real timers in the game; here they run on the bot's clock
  const realSetTimeout = window.setTimeout;
  let simMs = 0; const timers = [];
  window.setTimeout = (fn, ms = 0, ...a) => { timers.push({ at: simMs + ms, fn, a }); return -timers.length; };

  g.gfx.render = () => {}; // nothing needs drawing at this speed
  S.mode = 'free'; S.canMove = true;
  document.getElementById('creator').classList.add('hidden'); document.getElementById('hud').classList.remove('hidden');
  window.removeEventListener('beforeunload', g.life.save);
  if (preset === 'mid') { S.gear.stove = 4; S.gear.bag = 2; }
  if (preset === 'kitted' || preset === 'kitchen') { S.gear.stove = 6; S.gear.bag = 3; S.craft.made.tray = true; }
  const kitchen = preset === 'kitchen'; // stays at camp and serves the counter instead of walking sandwiches around
  if (kitchen) { S.craft.made.sign = true; S.gear.land = 3; S.kitchen.open = true; }
  const larder = () => { for (const k of fillings) { S.recipes[k] = true; if (S.bag[k] + S.store[k] < 3) S.store[k] = 12; } };
  const cooked = (k) => [...S.cheese, ...S.store.cheese].filter((s) => s.p >= 3 && (k ? s.f[0] === k : !s.f.length)).length;
  function lightStove() { // E at the stove; with fillings in the stash the game asks what goes in
    key('KeyE');
    if (!S.menu) return;
    const kinds = ['', ...fillings.filter((k) => S.bag[k] + S.store[k] > 0)].sort((a, b) => cooked(a) - cooked(b));
    const i = kinds[0] ? 1 + fillOrder().indexOf(kinds[0]) : S.menu.options.length - 1; // the menu reads: best, each filling, plain
    key('Digit' + (i + 1));
  }
  const fillOrder = () => ['morel', 'chanterelle', 'oyster', 'tomato', 'pepper', 'herbs'].filter((k) => (S.bag[k] || 0) + (S.store[k] || 0) > 0); // the order the stove menu lists them in
  const short = () => kitchen && fillings.length > 0 && ['', ...fillings].some((k) => cooked(k) < 2);

  const log = { start: total(), cash0: S.cash + S.stash, hours: [], spent: { supplies: 0, permit: 0, water: 0, shower: 0, gear: 0 }, lost: 0, time: { sell: 0, cook: 0, shop: 0, rest: 0, walk: 0, wait: 0 }, offers: 0, stuck: 0 };
  let lastHour = Math.floor(total()), target = null, retarget = 0, lastCash = S.cash + S.stash, doing = 'wait';

  function findSpots() { // read the places off the game's own prompts, so the bot never goes stale when things move
    const want = { store: /General Store/, tent: /Your tent/, stove: /camp stove/, permit: /Lot office/, showers: /Showers/ };
    for (const it of g.interactables || []) { let label = ''; try { label = typeof it.label === 'function' ? it.label() : it.label; } catch (e) { continue; } for (const k in want) if (want[k].test(label || '')) SPOT[k] = it.at; }
  }
  function walkTo([x, z], r = 1.6) {
    const dx = x - P.x, dz = z - P.z, d = Math.hypot(dx, dz);
    if (d <= r) return true;
    const step = Math.min(d - r + 0.05, speed * dt); P.x += dx / d * step; P.z += dz / d * step; g.player.root.rotation.y = Math.atan2(dx, dz);
    return false;
  }
  const opt = (re) => (S.menu ? S.menu.options.findIndex((o) => re.test(o.label)) : -1);
  function pick(re) { const i = opt(re); if (i < 0) return false; const o = S.menu.options[i]; if (o.can && o.can() !== true) return false; const c = S.cash; key('Digit' + (i + 1)); return c; }
  const bagSlots = () => [0, 4, 6, 8, 10][S.gear.bag] + (S.craft.made.sling ? 1 : 0) + (S.tree.mule ? 2 : 0);
  const cheeseRoom = () => (bagSlots() - Object.entries(S.bag).filter(([k, v]) => k !== 'cheese' && v > 0).length) * 5 - S.cheese.length;
  const supplies = () => (S.bag.supplies || 0) + (S.store.supplies || 0) + (S.pantry.supplies || 0);
  const atCamp = () => SPOT.tent && Math.hypot(P.x - SPOT.tent[0], P.z - SPOT.tent[1]) < 8;

  function cookStep() {
    const c = S.cooking; let any = false;
    for (const st of c.stations) {
      if (!st.active) continue; any = true;
      if (st.wait > 0) { st.aim = null; continue; }
      if (st.aim == null) st.aim = 0.655 + (Math.random() + Math.random() + Math.random() - 1.5) * flipError * 2; // roughly bell-shaped
      if (st.x >= st.aim) { key(c.pans > 1 ? (st.i ? 'KeyD' : 'KeyA') : 'Space'); st.aim = null; }
    }
    if (!any) key('Escape');
  }

  function decide() {
    const n = S.needs, h = S.hour, cash = S.cash;
    if (S.menu) { key('Escape'); return 'wait'; }
    // sleep through the dead hours; nap when spent
    if ((h >= (kitchen ? 2.1 : 3.2) && h < 5) || n.energy < 0.18) {
      if (!walkTo(SPOT.tent, 2.2)) return 'walk';
      g.step(1, dt); key('KeyE'); if (!pick(/Sleep until morning/)) pick(/Nap/); return 'rest';
    }
    if (n.hydration < 0.35 && cash >= 2) { if (!walkTo(SPOT.store, 2)) return 'walk'; g.step(1, dt); key('KeyE'); if (pick(/Cold water/) !== false) log.spent.water += 2; key('Escape'); return 'shop'; }
    if (n.nourishment < 0.35 && S.cheese.length) { key('KeyF'); return 'wait'; }
    if (n.hygiene < 0.5 && cash >= 3) { if (!walkTo(SPOT.showers, 2)) return 'walk'; g.step(1, dt); key('KeyE'); const c = pick(/shower/i); if (c !== false) log.spent.shower += c - S.cash; if (S.menu) key('Escape'); return 'rest'; }
    if (kitchen) {
      const stock = S.cheese.length + S.store.cheese.length, open = h >= 8 || h < 2;
      const q = S.kitchen.queue.find((x) => x.at);
      if (q && stock) { const f = g.people[q.i]; if (!walkTo([f.x, f.z], 1.5)) return 'walk'; g.step(1, dt); const c = S.cash; key('KeyE'); if (S.menu) key('Escape'); if (S.cash > c) log.offers++; return 'sell'; }
      const late = h >= 23.5 || h < 8; // cooked food goes stale at 5 AM, so cook little near closing
      if ((stock < (late ? 2 : 6) || (!late && short() && stock < 16 && !S.kitchen.queue.some((x) => x.at))) && supplies() > 0) { if (!walkTo(SPOT.stove, 2)) return 'walk'; g.step(1, dt); lightStove(); return 'cook'; }
      if (stock < 4 && supplies() === 0 && cash >= 5 && open) {
        if (!walkTo(SPOT.store, 2)) return 'walk';
        g.step(1, dt); key('KeyE');
        for (let i = 0; i < Math.min(fillings.length ? 12 : 8, Math.floor((cash - 6) / 5)); i++) { const c = pick(/Bread and cheese/); if (c === false || S.cash === c) break; log.spent.supplies += c - S.cash; }
        key('Escape'); return 'shop';
      }
      if (!walkTo(SPOT.stove, 3.5)) return 'walk';
      return 'wait';
    }
    if (!S.cheese.length) {
      if (S.store.cheese.length) { // fetch from the camp stash
        if (!walkTo(SPOT.tent, 2.2)) return 'walk';
        while (S.store.cheese.length && cheeseRoom() > 0) S.cheese.push(S.store.cheese.shift());
        return 'wait';
      }
      if (supplies() > 0) { if (!walkTo(SPOT.stove, 2)) return 'walk'; g.step(1, dt); key('KeyE'); return 'cook'; }
      if (cash < 5) { log.stuck++; return 'wait'; }
      if (!walkTo(SPOT.store, 2)) return 'walk';
      g.step(1, dt); key('KeyE');
      const pans = S.gear.stove >= 4 ? 2 : 1, per = S.gear.stove >= 6 ? 2 : 1, packs = Math.max(1, Math.min(pans * per * 2, Math.floor((cash - 16) / 5)));
      for (let i = 0; i < packs; i++) { const c = pick(/Bread and cheese/); if (c === false || S.cash === c) break; log.spent.supplies += c - S.cash; }
      key('Escape'); return 'shop';
    }
    // a day permit once it is affordable; without one, stay off Shakedown Street
    if (S.permitDay !== S.day && cash >= 40 && h >= 9 && h < 21) { if (!walkTo(SPOT.permit, 1.8)) return 'walk'; g.step(1, dt); key('KeyE'); const c = pick(/Day permit/); if (c !== false) log.spent.permit += c - S.cash; if (S.menu) key('Escape'); return 'shop'; }
    const now = total(), street = (f) => f.z <= -13.5 && f.z > -69 && Math.abs(f.x) < 20;
    if (!target || target.next > now || target.away || simMs > retarget) {
      let bd = Infinity; target = null; retarget = simMs + 1500;
      for (const f of g.people) { if (f.away || f.fixed || f.next > now || (f.botSkip || 0) > now || (S.permitDay !== S.day && street(f))) continue; const d = Math.hypot(f.x - P.x, f.z - P.z); if (d < bd) { bd = d; target = f; } }
    }
    if (!target) return 'wait';
    if (!walkTo([target.x, target.z], 1.6)) return 'walk';
    g.step(1, dt); key('KeyE');
    if (S.menu) { target.botSkip = now + 1; key('Escape'); } else log.offers++; // standing by a stall, E opened the stall instead
    target = null;
    return 'sell';
  }

  const bot = {
    done: false, log,
    run(frames) {
      if (!SPOT.store) findSpots();
      for (let i = 0; i < frames && !this.done; i++) {
        simMs += dt * 1000;
        for (let k = timers.length - 1; k >= 0; k--) if (timers[k].at <= simMs) { const t = timers.splice(k, 1)[0]; t.fn(...t.a); }
        if (S.over) { this.done = true; break; }
        if (fillings.length) larder();
        if (S.panel || (S.menu && !S.canMove)) key('Escape');
        if (S.dialogue) { key('KeyE'); doing = 'wait'; }
        else if (S.cooking) { cookStep(); doing = 'cook'; }
        else if (S.canMove) doing = decide();
        log.time[doing] = (log.time[doing] || 0) + dt;
        g.step(1, dt);
        const worth = S.cash + S.stash;
        if (worth < lastCash - 0.5 && doing !== 'shop' && doing !== 'rest') log.lost += lastCash - worth; // robbed or fined
        lastCash = worth;
        if (Math.floor(total()) > lastHour) { lastHour = Math.floor(total()); log.hours.push([+total().toFixed(1), worth, S.sold]); }
      }
      return { t: total().toFixed(1), worth: S.cash + S.stash, sold: S.sold, doing };
    },
    report() {
      const gameHours = total() - log.start, worth = S.cash + S.stash, realHours = Object.values(log.time).reduce((a, b) => a + b, 0) / 3600;
      const spent = Object.values(log.spent).reduce((a, b) => a + b, 0);
      return { preset, speed, fillings, wrongOrders: S.kitchen.wrong || 0, cookedLeft: [...S.cheese, ...S.store.cheese].length, gameHours: +gameHours.toFixed(1), realHoursPlayed: +realHours.toFixed(2), start: log.cash0, end: worth, net: worth - log.cash0, sold: S.sold, offers: log.offers, served: S.kitchen.served, walkedOff: S.kitchen.walked,
        netPerGameDay: +((worth - log.cash0) / gameHours * 24).toFixed(0), netPerRealHour: +((worth - log.cash0) / realHours).toFixed(0), spent: log.spent, spentTotal: spent, lostToTheftAndFines: Math.round(log.lost),
        timeShare: Object.fromEntries(Object.entries(log.time).map(([k, v]) => [k, Math.round(v / (realHours * 36)) + '%'])), stuckFrames: log.stuck, hustle: g.life.level('hustle'), byDay: log.hours.filter((_, i) => i % 12 === 11) };
    },
    stop() { window.setTimeout = realSetTimeout; },
  };
  return bot;
}

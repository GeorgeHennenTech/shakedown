// SHAKEDOWN life systems: the clock, the six needs bars, your bag and camp stash, your camp gear,
// buying and eating, the grilled cheese and cold water hustles, and saving the game.
// Kept apart from the opening quest in main.js.

import { ICONS } from './icons.js?v=11';

const HOUR = 50; // real seconds per game hour, so a full day is 20 minutes
const DAYS = ['Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday']; // the festival never ends: the week just comes round again
const dayName = (d) => DAYS[d % DAYS.length];
const BARS = [
  ['hydration', 'Hydration', '#3aa0ff'], ['energy', 'Energy', '#ffb020'], ['nourishment', 'Nourishment', '#8ac926'],
  ['hygiene', 'Hygiene', '#2ec4b6'], ['vibes', 'Vibes', '#ff5d8f'], ['buzzkill', 'Buzzkill', '#d7263d'],
];
const LOW = {
  hydration: 'You are parched. Find water.', energy: 'You are running on fumes. Sleep or nap at your camp.',
  nourishment: 'You are starving. Eat something.', hygiene: 'You reek. Rinse in the river, shower by the porta-potties, or use baby wipes.',
};
// The bible's model: consumables stack in a slot; the bag has a few slots, the camp stash has many.
const ITEMS = {
  cheese: { name: 'Grilled cheese', stack: 5, use: 'Eat', desc: 'Eat it, or offer it to people around the festival.' },
  supplies: { name: 'Bread and cheese', stack: 20, desc: 'Cook it on your camp stove. One makes one sandwich.' },
  bottles: { name: 'Water bottle', stack: 3, use: 'Drink', desc: 'Half a bar of Hydration.' },
  wipes: { name: 'Baby wipes', stack: 5, use: 'Wipe down', desc: 'A little Hygiene, anywhere.' },
  salvage: { name: 'Salvage', stack: 4, desc: 'Tape, poles and frames. Build with it at your tent or workbench.' },
  fabric: { name: 'Fabric scraps', stack: 4, desc: 'Tent cloth, flannel and sleeping bag. For the workbench.' },
  lights: { name: 'Dead fairy lights', stack: 2, desc: 'They only need a new battery. For the workbench.' },
  seeds: { name: 'Herb seeds', stack: 3, desc: 'Plant them in the planter at your camp.' },
  kandi: { name: 'Kandi bracelet', stack: 8, use: 'Trade', desc: 'Hand one to somebody. Peace, love, unity, respect: Vibes for you both, and sometimes a gift back.' },
  balloons: { name: 'Balloon', stack: 10, use: 'Inhale', desc: 'A short, silly head-rush. Or offer them to people late at night.' },
  seedTomato: { name: 'Tomato seeds', stack: 3, desc: 'Plant them in your garden. Eight hours.' },
  seedPepper: { name: 'Pepper seeds', stack: 3, desc: 'Plant them in your garden. Eight hours.' },
  seedSage: { name: 'Sage seeds', stack: 3, desc: 'Healing herbs for your garden. Six hours.' },
  serum: { name: 'Grow serum', stack: 3, desc: 'Pour a bottle on a plot that is growing and it is ready to harvest at once. Use it at your garden.' },
  tomato: { name: 'Tomatoes', stack: 6, desc: 'One goes into a sandwich: a tomato melt, worth $2 more.' },
  pepper: { name: 'Peppers', stack: 6, desc: 'One goes into a sandwich: a jalapeño popper, worth $2 more.' },
  sage: { name: 'Sage', stack: 5, use: 'Burn', desc: 'Burn a little to settle yourself, or give it to somebody who needs a healer.' },
  oyster: { name: 'Oyster mushrooms', stack: 6, desc: 'One goes into a sandwich: a mushroom melt, worth $3 more.' },
  chanterelle: { name: 'Chanterelles', stack: 4, desc: 'A chanterelle melt, worth $4 more. If that is what they are.' },
  morel: { name: 'Morels', stack: 4, desc: 'A morel melt, worth $5 more. If that is what they are.' },
  lionsmane: { name: 'Lion’s mane', stack: 2, use: 'Brew tea', desc: 'Clear Head tea: four hours of learning faster, reading people and slowed timing.' },
  reishi: { name: 'Reishi', stack: 2, use: 'Brew tea', desc: 'Old Soul tea: for a day you cannot collapse.' },
  cordyceps: { name: 'Cordyceps', stack: 2, use: 'Take', desc: 'Zombie Legs: free sprinting for an hour, then the bill.' },
  foxfire: { name: 'Foxfire', stack: 4, use: 'Set out', desc: 'A glow jar for your camp. Carried, it lights up wild mushrooms at night.' },
  goldcap: { name: 'Golden caps', stack: 2, use: 'Eat', desc: 'The Trip. Choose the room first. One handful a day.' },
  chicken: { name: 'Chicken of the woods', stack: 2, use: 'Eat', desc: 'A whole meal.' },
  puffball: { name: 'Puffball', stack: 3, use: 'Throw', desc: 'A smoke bomb: Buzzkill drops and nobody can pick your pocket for an hour.' },
  turkeytail: { name: 'Turkey tail', stack: 4, use: 'Brew broth', desc: 'Iron broth: for a day, rain, cold and bad mushrooms cannot make you ill.' },
  ghostcap: { name: 'Ghost cap', stack: 1, desc: 'The rare one. Take a spore print. Show the Elder.' },
  b12: { name: 'B12 tablets', stack: 3, use: 'Take', desc: 'Clears Tingle Fingers and puts some Body back.' },
  trailmix: { name: 'Trail mix', stack: 4, use: 'Eat', desc: 'A handful of nuts, raisins and chocolate. A fifth of a bar of Nourishment.' },
  electro: { name: 'Electrolyte packet', stack: 4, use: 'Drink', desc: 'A quarter bar of Energy and some Hydration. One works every two hours.' },
  herbs: { name: 'Fresh herbs', stack: 6, use: 'Chew', desc: 'One goes into each sandwich you cook: +$1. Or chew a sprig for Vibes and fresher breath.' },
};
const STASH_BASE = 12;
// What you can make at the workbench. Each thing is made once and then worn or set up at camp.
const RECIPES = [
  { id: 'sling', name: 'Cup-holder sling', level: 1, xp: 6, needs: { salvage: 2, fabric: 1 }, does: 'One more bag slot, and you get thirsty a little slower' },
  { id: 'tray', name: 'Cooler-lid serving tray', level: 2, xp: 8, needs: { salvage: 2 }, does: 'People say yes to your food more often' },
  { id: 'vest', name: 'Sleeping-bag puffer vest', level: 2, xp: 8, needs: { fabric: 2 }, does: 'Nights drain your Energy slower' },
  { id: 'shade', name: 'Tarp shade rig', level: 3, xp: 12, needs: { fabric: 2, salvage: 2 }, does: 'Naps at camp restore more' },
  { id: 'totem', name: 'Fairy-light totem', level: 4, xp: 16, needs: { lights: 1, salvage: 2 }, does: 'Your Vibes settle higher' },
  { id: 'can', name: 'Watering can', level: 1, xp: 5, needs: { salvage: 1 }, does: 'One water does every plot in your garden' },
  { id: 'compost', name: 'Compost bin', level: 2, xp: 8, needs: { salvage: 3 }, does: 'Crops grow a quarter faster' },
  { id: 'sign', name: 'Hand-painted sign', level: 2, xp: 8, needs: { salvage: 1, fabric: 1 }, does: 'Open a kitchen at your camp: people walk up and order (also needs the griddle and four plots)' },
  { id: 'hoodie', name: 'Hidden-pocket hoodie', level: 5, xp: 20, needs: { fabric: 3, salvage: 1 }, does: 'Pickpockets get nothing, and security cannot find your sandwiches when they throw you out' },
];
const LEVEL_XP = [0, 0, 8, 20, 38, 62, 92, 130]; // xp needed to reach each Craft level
const SAVE_KEY = 'shakedown-save-1';
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export function readSave() {
  try { const s = JSON.parse(localStorage.getItem(SAVE_KEY)); return s && s.v === 2 ? s : null; } catch (e) { return null; }
}
export function saveLabel(s) {
  const h = Math.floor(s.hour), m = Math.floor((s.hour - h) * 60);
  return `${dayName(s.day).slice(0, 3)} ${(h + 11) % 12 + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'} · $${s.cash + s.stash}`;
}

// Mushrooms use their journal illustration as their picture; seed packets share one drawing.
for (const k of ['oyster', 'chanterelle', 'morel', 'lionsmane', 'reishi', 'cordyceps', 'foxfire', 'goldcap', 'chicken', 'puffball', 'turkeytail', 'ghostcap']) ICONS[k] = `<img src="./assets/journal/${k}.jpg" alt="">`;

export function createLife(ctx) {
  const { $, state, people, interactables, card, quest, tick, zoneAt, gfx, CAMP, VILLAGE, STALLS, PILE, SHOWERS, PERMIT, WHIP, say, getPlayer, cook, onGear, look, litter = [], marks = [], groves = [], wildMeshes = [], DATA, CRATE, decks, BOOTH, crowd, COUNTER, CORNER, CREW = { rules: {}, stations: {}, members: {} } } = ctx;
  const sfx = ctx.sfx || (() => {});
  Object.assign(state, {
    hour: 16 + 20 / 60, day: 0, cash: 40, stash: 0, cheese: [], sold: 0, noSprint: false, menu: null, cooking: null, panel: false,
    needs: { hydration: 0.72, energy: 0.8, nourishment: 0.62, hygiene: 0.8, buzzkill: 0 },
    lot: { on: false, camp: false, supplies: false, cook: false, sell: false, sleep: false },
    gear: { tent: 1, stove: 1, cooler: 1, bag: 1, lock: 1, land: 1, myco: 1, pantry: 1 }, raid: null, raidNext: 0, water: 0, pileNext: 0, crewDay: -1,
    reckon: { stage: 0, path: '', base: 0 },
    corner: { open: false, queue: [], next: 0, sold: 0, take: 0, whipSold: 0, whipTake: 0, whipNext: 0, jailedUntil: 0, hire: { until: 0 },
      crew: {}, earned: {}, left: {}, jail: {}, wavedNarcs: 0, tinyPaid: false, crewSold: 0, crewTake: 0, crewNext: 0, refills: 0, refillNight: -1, walked: false },
    kitchen: { open: false, queue: [], next: 0, served: 0, walked: 0, palSold: 0, palTake: 0, gardenNext: 0, hire: { job: '', until: 0 } },
    bag: { supplies: 0, bottles: 0, wipes: 0, salvage: 0, fabric: 0, lights: 0, seeds: 0, herbs: 0, kandi: 0, electro: 0, trailmix: 0, balloons: 0, b12: 0 },
    store: { cheese: [], supplies: 0, bottles: 0, wipes: 0, salvage: 0, fabric: 0, lights: 0, seeds: 0, herbs: 0, kandi: 0, electro: 0, trailmix: 0, balloons: 0, b12: 0 }, // the camp stash
    body: 1,
    nos: { met: false, whip: 0, tank: false, fills: 0, heat: 0, stage: 0, reups: 0, arc: '', sold: 0, last: -9, chain: 0, sabotage: false,
      route: '', side: '', price: 5, rig: false, whipState: 'ok', metWhip: false, squeeze: false, flipLater: false, owed: 0, allySold: 0, leak: 0,
      order: 0, refillAt: 0, war: 0, lookoutUntil: 0, tingleUntil: 0, grudge: false, busts: 0 },
    fizzUntil: 0, poncho: false,
    chain: { i: 0, stats: { digs: 0, builds: 0, perfect: 0, herbs: 0, rainCamp: 0, kandi: 0, headliner: 0 } }, trophies: {},
    garden: { on: false, wet: false, start: 0, ready: 0 }, permitDay: -1, heal: { next: 0, ids: [], count: 0 },
    weather: { rain: false, until: 0, next: 31 + Math.random() * 8 }, // the first shower comes on Friday
    plots: [], recipes: {}, pantry: {}, pantryCheese: [], shrooms: [], cultures: {}, journal: {}, prints: {}, wild: [], wildDone: -99, rainedAt: -99, fakes: {}, sets: {},
    fx: { clear: 0, soul: 0, zombie: 0, broth: 0, smoke: 0, trip: 0, tripDay: -1 }, glow: 0, vision: false, visionUsed: false,
    offer: '', pal: { friend: 0, watch: 0, gift: -1, held: 0, told: true }, danced: 0, daily: null, over: false, act: '',
    tree: {}, dayLog: { worth: 40, sold: 0, helped: 0, picked: 0 },
    craft: { xp: 0, made: {} }, skills: { hustle: 0, wellness: 0, charisma: 0, decks: 0 }, crate: { owned: [...CRATE.start], sets: 0, best: 0, gift: -1 }, points: 0, litter: [], picked: 0, towing: false,
  });
  for (const k of Object.keys(ITEMS)) if (k !== 'cheese') { state.bag[k] = state.bag[k] || 0; state.store[k] = state.store[k] || 0; } // every item has a count, even ones added later
  const n = state.needs, warned = {};
  const total = () => state.day * 24 + state.hour;
  const need = (k) => (k === 'vibes' ? state.vibes : n[k]);
  const add = (k, d) => { if (k === 'vibes') state.vibes = clamp(state.vibes + d); else n[k] = clamp(n[k] + d); };
  const pass = (hours) => { state.hour += hours; while (state.hour >= 24) { state.hour -= 24; state.day++; } }; // days keep counting past Monday, so no timer ever runs backwards
  const atCamp = () => { const p = getPlayer().root.position; return Math.hypot(p.x - CAMP.tent[0], p.z - CAMP.tent[1]) < 9.5; };
  let toastTimer = 0;
  const toast = (text) => { const t = $('toast'); t.textContent = text; t.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2600); };

  // ---- camp gear you can level up. cost = buy it at the gear stall; salvage = build it at your tent.
  const GEAR = {
    tent: ['Your tent', [
      { name: 'Ratty borrowed tent' },
      { name: 'Patched tent', salvage: 2, does: 'A night’s sleep restores all your Energy' },
      { name: 'Rainfly and real stakes', cost: 15, does: 'You wake up less thirsty and hungry' },
      { name: 'Vestibule', cost: 20, does: 'Hygiene stops dropping while you sleep' },
      { name: 'Blackout liner', cost: 30, does: 'Naps restore twice as much' },
    ]],
    stove: ['Your stove', [
      { name: 'Single burner' },
      { name: 'Wind guard', salvage: 2, does: 'The marker moves at a steady speed' },
      { name: 'Cast-iron pan', cost: 18, does: 'The gold zone gets wider' },
      { name: 'Second burner', cost: 35, does: 'Two pans: cook two at once' },
      { name: 'Butter dish and a proper spatula', cost: 40, does: 'The Perfect zone gets wider' },
      { name: 'Flat-top griddle', cost: 220, does: 'Every flip cooks two sandwiches: 20 a session' },
      { name: 'Sandwich press', cost: 90, does: 'Two fillings in one sandwich, and both bonuses' },
    ]],
    cooler: ['Your cooler', [
      { name: 'Battered cooler' },
      { name: 'Duct-taped lid', salvage: 1, does: 'Holds 6 waters, up from 3' },
      { name: 'Wheels and a handle', cost: 20, does: 'Holds 12 waters. Take it from camp to pull it behind you, drink anywhere and sell cold water' },
    ]],
    bag: ['Your bag', [
      { name: 'Fanny pack' },
      { name: 'Drawstring sling', cost: 12, does: 'Carries 6 stacks, up from 4' },
      { name: 'Hydration pack', cost: 25, does: 'Carries 8 stacks, and you get thirsty slower. Security notices it a little more' },
      { name: 'Hiking backpack', cost: 45, does: 'Carries 10 stacks. Security and pickpockets notice a pack this big' },
    ]],
    land: ['Your garden', [
      { name: 'One planter' },
      { name: 'A second planter', cost: 40, does: 'Two crops at once' },
      { name: 'Grow bags', cost: 90, does: 'Four plots' },
      { name: 'Raised bed', cost: 180, does: 'Six plots' },
    ]],
    myco: ['Your mushroom shelf', [
      { name: 'No shelf' },
      { name: 'Log and a bag of straw', salvage: 2, does: 'Grow two kinds of mushroom at camp. The General Store has oyster spawn' },
      { name: 'Shade cloth and jars', salvage: 3, does: 'Four mushroom spots' },
    ]],
    pantry: ['Your produce cabinet', [
      { name: 'No cabinet' },
      { name: 'Produce crate', cost: 40, does: 'A crate by your stove for bread, cheese, vegetables, herbs and mushrooms: 12 of each, and the stove cooks from it' },
      { name: 'Pantry cabinet', cost: 110, does: 'Holds 30 of each' },
      { name: 'Camp larder', cost: 260, does: 'Holds 60 of each' },
    ]],
    lock: ['Camp security', [
      { name: 'An unzipped tent' },
      { name: 'Bike lock and zip-ties', cost: 10, does: 'Your camp gets raided half as often' },
      { name: 'Motion light', cost: 25, does: 'Your camp is almost never raided' },
    ]],
  };
  const next = (k) => GEAR[k][1][state.gear[k]]; // the next level, if there is one
  const coolerRoom = () => [0, 3, 6, 12][state.gear.cooler];
  function upgrade(k) {
    const lv = next(k);
    state.gear[k]++;
    if (onGear) onGear(state.gear, state.craft.made);
    toast(`${lv.name}. ${lv.does}.`);
  }

  // ---- the bag and the camp stash
  const made = (id) => !!state.craft.made[id];
  const bagSlots = () => [0, 4, 6, 8, 10][state.gear.bag] + (made('sling') ? 1 : 0) + (state.tree.mule ? 2 : 0);
  const stashSlots = () => STASH_BASE + (state.tree.packrat ? 6 : 0);
  function sip() { return state.tree.camel ? 0.65 : 0.5; } // how much a water restores

  // ---- skills: numbered levels that only rise by doing the thing. Each level-up also earns a skill point.
  const SKILLS = {
    craft: ['Craft', 'Dig, build and make'],
    hustle: ['Hustle', 'Cook and sell'],
    wellness: ['Wellness', 'Look after yourself'],
    charisma: ['Charisma', 'Talk to people'],
    decks: ['Decks', 'Play records'],
  };
  const hustleEdge = (l) => Math.min(0.12, (l - 1) * 0.015) + (state.tree.pitch ? 0.05 : 0), wellEase = (l) => Math.min(0.2, (l - 1) * 0.03), charmEase = (l) => Math.min(0.4, (l - 1) * 0.05);
  const pc = (v) => `${Math.round(v * 1000) / 10}%`;
  const PERK = {
    craft: (l) => { const opened = RECIPES.filter((r) => r.level === l).map((r) => r.name); return opened.length ? `New at your workbench: ${opened.join(', ')}.` : 'You spot better finds in the Free Pile.'; },
    hustle: (l) => `People say yes ${pc(hustleEdge(l))} more often.`,
    wellness: (l) => `Thirst and hunger build ${pc(wellEase(l))} slower.`,
    charisma: (l) => `Security goes ${pc(charmEase(l))} easier on you, and people hear you out again sooner.`,
    decks: (l) => (l === 3 ? 'You can now play without the training wheels.' : `Steadier hands: the second deck wanders ${pc(Math.min(0.5, (l - 1) * 0.04))} less.`),
  };
  const needXp = (l) => (l < LEVEL_XP.length ? LEVEL_XP[l] : 130 + 45 * (l - 7) + 5 * (l - 7) ** 2);
  const xpOf = (k) => (k === 'craft' ? state.craft.xp : state.skills[k]);
  const level = (k) => { let l = 1; while (l < 99 && xpOf(k) >= needXp(l + 1)) l++; return l; };
  function gain(k, amount) {
    const before = level(k);
    if (fx('clear')) amount = Math.ceil(amount * 1.5);
    if (k === 'craft') state.craft.xp += amount; else state.skills[k] += amount;
    const now = level(k);
    if (now > before) { state.points += now - before; levelUp(`${SKILLS[k][0]} level ${now}`, `${PERK[k](now)} +1 skill point: press K.`); sfx('level'); }
  }
  // a level-up slides in under the clock and does not stop play
  let levelTimer = 0;
  function levelUp(title, text) {
    const el = $('levelup');
    el.innerHTML = `<b class="comix">${title}</b><span>${text}</span>`;
    el.classList.add('show'); clearTimeout(levelTimer); levelTimer = setTimeout(() => el.classList.remove('show'), 4200);
  }
  const craftLevel = () => level('craft'), craftXp = (amount) => gain('craft', amount);
  const needsText = (r) => Object.entries(r.needs).map(([k, v]) => `${v} ${ITEMS[k].name.toLowerCase()}`).join(' + ');
  function workbench() {
    const lv = craftLevel(), nextXp = needXp(lv + 1);
    const todo = RECIPES.filter((r) => !made(r.id));
    // camp gear you build from salvage, then the things you make to wear and use
    const builds = Object.keys(GEAR).filter((k) => next(k) && next(k).salvage).map((k) => ({
      label: `Build: ${next(k).name} <small>${next(k).does}. Needs ${next(k).salvage} salvage</small>`,
      can: () => (have('salvage') >= next(k).salvage ? true : `missing ${next(k).salvage - have('salvage')} more salvage`),
      act: () => { spend('salvage', next(k).salvage); upgrade(k); craftXp(4); state.chain.stats.builds++; save(); },
    }));
    const opts = todo.map((r) => ({
      label: `${r.name} <small>${r.does}. Needs ${needsText(r)}</small>`,
      can: () => {
        if (lv < r.level) return `Craft level ${r.level}`;
        const short = Object.entries(r.needs).filter(([k, v]) => have(k) < v).map(([k, v]) => `${v - have(k)} more ${ITEMS[k].name.toLowerCase()}`);
        return short.length ? `missing ${short.join(', ')}` : true;
      },
      act: () => {
        for (const [k, v] of Object.entries(r.needs)) spend(k, v);
        state.craft.made[r.id] = true;
        pass(0.5);
        if (onGear) onGear(state.gear, state.craft.made);
        toast(`You made the ${r.name.toLowerCase()}. ${r.does}.`); sfx('build');
        craftXp(r.xp);
        save();
      },
    }));
    opts.unshift(...builds);
    opts.unshift({ label: 'Kandi bracelets <small>makes 2 to trade with people. Needs 1 fabric scraps</small>', stay: true,
      can: () => (!have('fabric') ? 'missing 1 fabric scraps' : room('bag', 'kandi') < 2 && !atCamp() ? 'no room in your bag' : true),
      act: () => { spend('fabric', 1); give('kandi', 2); pass(0.2); toast('Two kandi bracelets. Trade them from your bag.'); sfx('build'); craftXp(2); } });
    if (!opts.length) opts.push({ label: 'Nothing left to make <small>more patterns to come</small>', can: () => 'all made', act() {} });
    menu(`Workbench · Craft level ${lv}${nextXp ? ` (${state.craft.xp} of ${nextXp} xp)` : ''}`, opts);
  }
  const count = (where, k) => (k === 'cheese' ? (where === 'bag' ? state.cheese : state.store.cheese).length : (where === 'bag' ? state.bag : state.store)[k]);
  const used = (where) => Object.keys(ITEMS).reduce((s, k) => s + Math.ceil(count(where, k) / ITEMS[k].stack), 0);
  const room = (where, k) => { // how many more of k fit
    const cap = where === 'bag' ? bagSlots() : stashSlots(), c = count(where, k), st = ITEMS[k].stack;
    return (cap - used(where)) * st + (Math.ceil(c / st) * st - c);
  };
  const have = (k) => count('bag', k) + count('store', k) + (state.pantry[k] || 0); // bag, stash and kitchen pantry, for things you do at camp
  function spend(k, amount) { // take from the bag first, then the stash
    const fromBag = Math.min(state.bag[k], amount), fromStore = Math.min(state.store[k], amount - fromBag);
    state.bag[k] -= fromBag; state.store[k] -= fromStore;
    if (amount - fromBag - fromStore > 0) state.pantry[k] = Math.max(0, (state.pantry[k] || 0) - (amount - fromBag - fromStore)); // last, the kitchen pantry
  }
  // Put things in the bag. What does not fit goes to the stash if you are at camp, otherwise it is left behind.
  function give(k, amount, quality, toStash = atCamp()) {
    let left = amount;
    const put = (where) => {
      const fit = Math.min(left, room(where, k));
      if (k === 'cheese') for (let i = 0; i < fit; i++) (where === 'bag' ? state.cheese : state.store.cheese).push({ p: quality.p, f: [...quality.f] });
      else (where === 'bag' ? state.bag : state.store)[k] += fit;
      left -= fit;
    };
    put('bag');
    if (left && toStash) put('store');
    return left; // how many did not fit anywhere
  }
  // Put a harvest away: bag, then camp stash, then the produce cabinet. Returns how many found no room.
  // Nothing is ever thrown away: what does not fit stays on the plant (or the log) until you make space.
  function stow(k, amount) {
    let left = give(k, amount, undefined, true);
    if (left && pantryKinds().includes(k)) { const n = Math.min(left, pantryRoom(k)); if (n > 0) { state.pantry[k] = (state.pantry[k] || 0) + n; left -= n; } }
    return left;
  }
  function moveStack(k, from) {
    const to = from === 'bag' ? 'store' : 'bag';
    const amount = Math.min(count(from, k), ITEMS[k].stack, room(to, k));
    if (!amount) { toast(to === 'bag' ? 'Your bag is full.' : 'Your stash is full.'); return; }
    if (k === 'cheese') {
      const src = from === 'bag' ? state.cheese : state.store.cheese, dst = to === 'bag' ? state.cheese : state.store.cheese;
      src.sort((a, b) => b.p - a.p); dst.push(...src.splice(0, amount));
    } else { (from === 'bag' ? state.bag : state.store)[k] -= amount; (to === 'bag' ? state.bag : state.store)[k] += amount; }
  }
  // What the shops give for spare things, each. Not herbs or sage (those would pay for their own seeds), and never cooked food.
  const SELL = { salvage: 1, fabric: 1, lights: 2, kandi: 1, bottles: 1, tomato: 1, pepper: 1, oyster: 1, chanterelle: 2, morel: 3 };
  const atShop = () => { const p = getPlayer().root.position; return [STALLS.water, STALLS.gear].some(([x, z]) => Math.hypot(p.x - x, p.z - z) < 5); };
  // Drop one stack from your bag for good; with a price, a shop takes it off you.
  function dropStack(k, price = 0) {
    const amount = Math.min(count('bag', k), ITEMS[k].stack);
    if (!amount) return;
    if (k === 'cheese') { state.cheese.sort((a, b) => a.p - b.p); state.cheese.splice(0, amount); } // the worst ones go first
    else state.bag[k] -= amount;
    if (price) { state.cash += amount * price; sfx('coin'); toast(`Sold ${amount} ${ITEMS[k].name.toLowerCase()} for $${amount * price}.`); }
    else toast(`You leave ${amount} ${ITEMS[k].name.toLowerCase()} behind.`);
    if (!count('bag', k)) picked = null;
  }
  function useItem(k) {
    if (k === 'cheese') eat();
    else if (GROWN[k] || WILD[k] || k === 'sage') useShroom(k);
    else if (k === 'bottles' && state.bag.bottles) { state.bag.bottles--; add('hydration', sip()); toast('Ahh.'); }
    else if (k === 'kandi' && state.bag.kandi) {
      const p = getPlayer().root.position, f = people.find((x) => !x.away && Math.hypot(x.x - p.x, x.z - p.z) < 2.4 && x.kandi !== state.day);
      if (!f) { toast(people.some((x) => !x.away && Math.hypot(x.x - p.x, x.z - p.z) < 2.4) ? 'They are already wearing one of yours today.' : 'Walk up to somebody to trade kandi.'); return; }
      f.kandi = state.day; state.bag.kandi--; add('vibes', 0.04); state.chain.stats.kandi = (state.chain.stats.kandi || 0) + 1;
      const r = Math.random(), back = r < 0.25 ? ['bottles', 'a water'] : r < 0.4 ? ['fabric', 'a bandana'] : null;
      if (back && room('bag', back[0]) >= 1) { give(back[0], 1); toast(`Kandi traded. They hand you ${back[1]} in return.`); }
      else if (r > 0.8) { state.cash += 2; toast('Kandi traded. "Take two bucks, I insist."'); } else toast('Kandi traded. A hug, a grin, and they are gone.');
      sfx('pick'); gain('charisma', 2);
    }
    else if (k === 'balloons' && state.bag.balloons) { state.bag.balloons--; balloon(); }
    else if (k === 'b12' && state.bag.b12) { state.bag.b12--; state.nos.tingleUntil = 0; state.body = clamp(state.body + 0.3); toast('Chalky. Your hands feel like hands again.'); }
    else if (k === 'trailmix' && state.bag.trailmix) { state.bag.trailmix--; add('nourishment', 0.22 * (state.tree.gut ? 1.25 : 1)); toast('Sweet, salty, gone.'); }
    else if (k === 'electro' && state.bag.electro) {
      if (total() < state.fizzUntil) { toast('You are still fizzing from the last one. Give it a couple of hours.'); return; }
      state.bag.electro--; state.fizzUntil = total() + 2;
      add('energy', 0.25); add('hydration', 0.12); toast('Lemon-lime lightning. Energy up.'); sfx('pick');
    }
    else if (k === 'herbs' && state.bag.herbs) { state.bag.herbs--; add('vibes', 0.05); add('hygiene', 0.04); toast('Minty.'); }
    else if (k === 'wipes' && state.bag.wipes) { state.bag.wipes--; add('hygiene', 0.22); toast('A wipe-down. Better than nothing.'); }
  }
  // Stacks laid out as slots, the way the bag holds them.
  const slotsOf = (where) => {
    const out = [];
    for (const k of Object.keys(ITEMS)) for (let c = count(where, k); c > 0; c -= ITEMS[k].stack) out.push({ k, n: Math.min(c, ITEMS[k].stack) });
    return out;
  };
  let picked = null; // the thing you clicked in the bag panel
  const slotHtml = (s, where, key) => {
    if (!s) return '<div class="slot"></div>';
    const on = key === undefined && picked && picked.where === where && picked.k === s.k;
    return `<button class="slot${on ? ' on' : ''}" data-where="${where}" data-k="${s.k}" title="${(ITEMS[s.k] || RECIPES.find((r) => r.id === s.k)).name}">${ICONS[s.k]}${s.n > 1 ? `<b>${s.n}</b>` : ''}${key ? `<kbd>${key}</kbd>` : ''}</button>`;
  };
  const grid = (where, cap) => { const s = slotsOf(where); return `<div class="slots">${Array.from({ length: cap }, (_, i) => slotHtml(s[i], where)).join('')}</div>`; };
  function drawBag() {
    const camp = atCamp();
    if (picked && picked.where !== 'made' && !count(picked.where, picked.k)) picked = null;
    let info = '<p class="hint">Click a thing to see what it is and what you can do with it.</p>';
    if (picked && picked.where === 'made') {
      const r = RECIPES.find((x) => x.id === picked.k);
      info = `<div class="info">${ICONS[r.id]}<span><b>${r.name}</b><br><small>${r.does}. You made this.</small></span><span></span></div>`;
    } else if (picked) {
      const it = ITEMS[picked.k], c = count(picked.where, picked.k);
      const pile = picked.where === 'bag' ? state.cheese : state.store.cheese;
      const extra = picked.k === 'cheese' ? ` <small>worth $${pile.reduce((a, b) => a + b.p, 0)}: ${stockLine([pile])}</small>` : '';
      const buttons = picked.where === 'bag'
        ? `${it.use ? `<button data-do="use">${it.use}</button>` : ''}${camp ? '<button data-do="stash">Stash</button>' : ''}${SELL[picked.k] && atShop() ? `<button data-do="sell">Sell ${Math.min(c, it.stack)} for $${Math.min(c, it.stack) * SELL[picked.k]}</button>` : ''}<button data-do="drop">Drop</button>`
        : '<button data-do="take">Take</button>';
      info = `<div class="info">${ICONS[picked.k]}<span><b>${it.name} ×${c}</b>${extra}<br><small>${it.desc}${SELL[picked.k] && picked.where === 'bag' && !atShop() ? ` Sells for $${SELL[picked.k]} each: open your bag at the General Store or Leather & Burner.` : ''}</small></span><span>${buttons}</span></div>`;
    }
    const mine = RECIPES.filter((r) => made(r.id));
    $('bagpanel').innerHTML = `<h3 class="comix">${GEAR.bag[1][state.gear.bag - 1].name} <small>${used('bag')} of ${bagSlots()} slots</small></h3>${grid('bag', bagSlots())}`
      + (camp ? `<h3 class="comix" style="margin-top:12px">Camp stash <small>${used('store')} of ${stashSlots()} slots</small></h3>${grid('store', stashSlots())}` : '<p class="hint">Your stash is at your camp. Open your bag there to move things.</p>')
      + (mine.length ? `<h3 class="comix" style="margin-top:12px">Made by you <small>Craft level ${craftLevel()}</small></h3><div class="slots">${mine.map((r) => slotHtml({ k: r.id, n: 1 }, 'made')).join('')}</div>` : '')
      + info
      + '<div class="next">I or Esc to close</div>';
  }
  // ---- the skill tree: spend the points that level-ups and quests pay
  const TREE = {
    craft: [['packrat', 'Pack Rat', 'Your camp stash holds 18 stacks', 2, 1], ['mule', 'Mule', 'Two more bag slots', 3, 2], ['keen', 'Keen Eye', 'The Free Pile restocks twice as fast', 5, 2]],
    hustle: [['pitch', 'Smooth Pitch', 'People say yes 5% more often', 2, 1], ['upsell', 'Upsell', 'Three in four sandwich buyers add a water', 3, 2], ['regulars', 'Regulars', 'People can be asked again an hour sooner', 5, 2]],
    wellness: [['camel', 'Camel', 'A water restores more Hydration', 2, 1], ['nap', 'Power Nap', 'Naps restore more Energy', 3, 2], ['gut', 'Iron Gut', 'Food fills you a quarter more', 5, 2]],
    charisma: [['silver', 'Silver Tongue', 'Buzzkill fades half again as fast', 2, 1], ['haggle', 'Haggler', 'Camp gear costs 15% less', 3, 2], ['beloved', 'Beloved', 'Your Vibes settle a little higher', 5, 2]],
    decks: [['steady', 'Steady Hands', 'The second deck drifts half as fast', 2, 1], ['ears', 'Golden Ears', 'Key matches show in your crate even without the training wheels', 4, 2], ['selector', 'Selector', 'The floor starts every set a little warmer', 5, 2]],
  };
  function buyPerk(id) {
    for (const [k, list] of Object.entries(TREE)) {
      for (const [pid, name, , lv, cost] of list) {
        if (pid !== id || state.tree[id] || level(k) < lv || state.points < cost) continue;
        state.points -= cost; state.tree[id] = true;
        toast(`${name} learned.`); sfx('level'); save();
      }
    }
  }
  // The Vision Quest (decision 51): after a good trip, once, every perk comes back as points to spend again.
  function visionQuest() {
    let back = 0;
    for (const list of Object.values(TREE)) for (const [id, , , , cost] of list) if (state.tree[id]) { back += cost; delete state.tree[id]; }
    state.points += back; state.visionUsed = true;
    toast(back ? `You see it differently now. ${back} points are yours to spend again.` : 'Nothing to take back, but the door was open.'); sfx('level'); save();
  }
  function drawSkills() {
    const pts = `${state.points} skill point${state.points === 1 ? '' : 's'}`;
    $('bagpanel').innerHTML = `<h3 class="comix">Skills <small>${pts} to spend</small></h3>`
      + Object.keys(SKILLS).map((k) => {
        const l = level(k), a = needXp(l), b = needXp(l + 1);
        return `<div class="skill"><span><b>${SKILLS[k][0]}</b> <small>${SKILLS[k][1]}. ${l > 1 ? PERK[k](l) : 'No bonus yet.'}</small></span><span class="comix">Lv ${l}</span><div class="meter"><i style="width:${(xpOf(k) - a) / (b - a) * 100}%;background:var(--grape)"></i></div></div>`
          + `<div class="perks">${TREE[k].map(([id, name, does, lv, cost]) => {
            const own = state.tree[id], open = level(k) >= lv;
            return `<button class="perk${own ? ' own' : ''}" data-perk="${id}" ${own || !open || state.points < cost ? 'disabled' : ''}><b>${name}</b><small>${does}</small><i>${own ? 'Learned' : !open ? `Needs ${SKILLS[k][0]} level ${lv}` : `${cost} point${cost > 1 ? 's' : ''}`}</i></button>`;
          }).join('')}</div>`;
      }).join('')
      + (state.vision && !state.visionUsed ? '<p class="hint"><button data-vision="1">Vision Quest: take back every point you have spent</button> Once a festival.</p>' : '')
      + '<p class="hint" style="margin-bottom:16px">Levels rise by doing the thing. Every level-up pays a skill point, and so do quests.</p><div class="next">K or Esc to close</div>';
  }

  // ---- the map: every place you can use, the people who need a healer, and you
  function drawMap() {
    $('bagpanel').innerHTML = '<h3 class="comix">Map <small>the river is north, at the top</small></h3><canvas id="mapc" width="580" height="760"></canvas><div class="next">M or Esc to close</div>';
    const c = $('mapc').getContext('2d'), S = 4, X = (x) => (x + 85) * S, Z = (z) => (z + 175) * S; // the world from x -85..60 and z -175..15
    const area = (x1, z1, x2, z2, colour) => { c.fillStyle = colour; c.fillRect(X(x1), Z(z1), (x2 - x1) * S, (z2 - z1) * S); };
    area(-85, -175, 60, 15, '#93c96c');
    area(-25, -142, 60, -69, '#a5d47c'); // the Campgrounds
    area(-85, -140, -25, -92, '#86c56a'); // Main Stage Field
    area(-74, -161, -22, -137, '#cfe8a8'); // Healing Village
    area(-85, -152, 60, -146, '#e6d6a4'); area(-85, -175, 60, -161.3, '#5db7e8'); area(-85, -161.3, 60, -152, '#e6d6a4'); // the bank and the river
    area(-74, -161, -22, -146, '#cfe8a8');
    area(-85, -13.5, 60, 15, '#d8c39a'); // the Parking Lot
    area(-7.5, -66, 7.5, -13.5, '#dcb980'); // Shakedown Street
    c.textAlign = 'center'; c.fillStyle = 'rgba(23,17,31,.5)'; c.font = '700 17px "Marker Felt","Chalkboard SE",sans-serif';
    for (const [name, x, z] of [['THE PARKING LOT', -30, 2], ['SHAKEDOWN STREET', -27, -40], ['THE CAMPGROUNDS', 25, -112], ['MAIN STAGE FIELD', -55, -100], ['HEALING VILLAGE', -48, -140.5], ['THE RIVER', -10, -166]]) c.fillText(name, X(x), Z(z));
    const dot = (x, z, colour, name, side = 1) => {
      c.fillStyle = colour; c.strokeStyle = '#17111f'; c.lineWidth = 2.5;
      c.beginPath(); c.arc(X(x), Z(z), 6, 0, 7); c.fill(); c.stroke();
      c.font = '600 13px -apple-system,Arial,sans-serif'; c.textAlign = side > 0 ? 'left' : 'right';
      c.lineWidth = 3.5; c.strokeStyle = '#fff3d6'; c.strokeText(name, X(x) + side * 10, Z(z) + 4.5);
      c.fillStyle = '#17111f'; c.fillText(name, X(x) + side * 10, Z(z) + 4.5);
    };
    dot(...STALLS.water, '#3aa0ff', 'General Store');
    dot(...STALLS.burrito, '#8ac926', 'Veggie Burritos');
    dot(...STALLS.gear, '#ffc93c', 'Leather & Burner (camp gear)');
    dot(...STALLS.cheese, '#e8a33d', 'Grilled Cheese', -1);
    dot(...PERMIT, '#fff', 'Lot office (permits)');
    dot(...PILE, '#b9c2c9', 'Free Pile', -1);
    dot(...SHOWERS, '#2ec4b6', 'Showers', -1);
    dot(-70, -121, '#8f6aff', nowPlaying() ? `Main Stage: ${nowPlaying().split(',')[0]}` : 'Main Stage (music from 2 PM)');
    dot(...BOOTH, '#8f6aff', 'Open Decks', -1);
    dot(...VILLAGE.elder, '#ff5d8f', 'Village Elder');
    dot(...VILLAGE.chill, '#3aa0ff', 'Chill-Out Tent');
    dot(...VILLAGE.bath, '#2ec4b6', 'Sound bath');
    if (PAL >= 0) dot(people[PAL].x, people[PAL].z, '#8f6aff', 'Moonbeam', -1);
    dot(6.2, -60.6, '#d7263d', 'Vinny: balloons');
    if (state.nos.whip >= 1 && whipAround() && WHIP) dot(...WHIP, '#b9c2c9', 'Whip');
    dot(...CAMP.tent, '#ff5d8f', state.nos.tank && !state.nos.rig ? 'YOUR CAMP (tank by the sign)' : 'YOUR CAMP');
    if (fx('trip')) for (const w of state.wild) { c.fillStyle = '#fff3a0'; c.strokeStyle = '#17111f'; c.lineWidth = 2; c.beginPath(); c.arc(X(SPOTS[w.s].x), Z(SPOTS[w.s].z), 5, 0, 7); c.fill(); c.stroke(); } // on a good trip the mushrooms show themselves
    c.strokeStyle = '#ff5d8f'; c.lineWidth = 4; // people who need a healer
    for (const id of state.heal.ids) { const f = people[id]; if (!f) continue; c.beginPath(); c.moveTo(X(f.x) - 6, Z(f.z)); c.lineTo(X(f.x) + 6, Z(f.z)); c.moveTo(X(f.x), Z(f.z) - 6); c.lineTo(X(f.x), Z(f.z) + 6); c.stroke(); }
    const me = getPlayer().root;
    c.save(); c.translate(X(me.position.x), Z(me.position.z)); c.rotate(Math.PI - me.rotation.y); // facing +z is down the page
    c.fillStyle = '#d7263d'; c.strokeStyle = '#fff'; c.lineWidth = 2.5;
    c.beginPath(); c.moveTo(0, -11); c.lineTo(8, 9); c.lineTo(0, 5); c.lineTo(-8, 9); c.closePath(); c.fill(); c.stroke();
    c.restore();
  }
  // ---- the festival report: shown when the gates close on Monday, and any time after with the guide
  function drawReport() {
    const levels = Object.keys(SKILLS).reduce((s, k) => s + level(k), 0), quests = (lotDone() ? 1 : 0) + state.chain.i;
    const made = Object.keys(state.craft.made).length, worth = state.cash + state.stash;
    const score = worth / 10 + levels * 3 + quests * 8 + state.heal.count * 2 + state.picked + made * 3 + state.pal.friend * 2 + state.danced;
    const title = score >= 150 ? 'Certified Head' : score >= 95 ? 'Lot Legend' : score >= 55 ? 'Weekend Warrior' : score >= 25 ? 'Getting the hang of it' : 'Tourist';
    const row = (a, b) => `<div class="item"><span>${a}</span><b>${b}</b></div>`;
    $('bagpanel').innerHTML = `<h3 class="comix">Your first weekend <small>Monday, noon</small></h3>
      <p style="margin:4px 0 8px">Nobody is packing up. This festival does not end. Here is how ${look.name}'s first weekend went.</p>`
      + row('Money in hand and at camp', `$${worth}`) + row('Grilled cheese sold', state.sold) + row('People you helped', state.heal.count) + row('Litter binned', state.picked)
      + row('Things made at the workbench', made) + row('Quests finished', `${quests} of ${CHAIN.length + 1}`) + row('Skill levels, all together', levels)
      + row('Songs danced', state.danced) + row('Sets played', state.crate.sets) + row('Served at your camp kitchen', state.kitchen.served) + row('Friendship with Moonbeam', state.pal.friend)
      + `<h3 class="comix" style="margin-top:12px;text-align:center;font-size:30px">${title}</h3>
      <p class="hint" style="margin-bottom:16px">The music is back on at 2 PM, same as every day.</p><div class="next">Esc to close</div>`;
  }
  // ---- the field guide: the short version of how to get by
  function drawGuide() {
    const li = (a, b) => `<div class="item" style="display:block"><b>${a}</b><br><small style="font-size:13px">${b}</small></div>`;
    $('bagpanel').innerHTML = '<h3 class="comix">Field guide <small>how to get by</small></h3>'
      + li('Keep your bars up', 'Water at the General Store or free at the Chill-Out Tent. Food at the stalls or your own sandwiches (F). For Energy: sleep or nap in your tent, lie on a cot in the Chill-Out Tent, or drink an electrolyte packet. Wash in the river (free), the Showers ($3) or with baby wipes.')
      + li('Make money', 'Buy bread and cheese, cook at your camp stove, then walk up to people and press E. Q switches between sandwiches, water and anything else you carry. Lunch, dinner and late night sell best. Off Shakedown Street nobody minds; on it, buy a day permit at the lot office.')
      + li('Upgrade your camp', 'Leather & Burner on Shakedown Street sells tent, stove, cooler, bag and security upgrades. The first level of each is built at your workbench from Free Pile salvage.')
      + li('Make things', 'Dig the Free Pile and pick up litter for materials. Your workbench turns them into gear. The planter grows herbs that make sandwiches worth more.')
      + li('Get better', 'Skills rise by doing. Spend skill points with K. Quests are in the top-right corner and pay trophies for your camp.')
      + li('Watch out', 'From Friday: pickpockets on Shakedown Street, raids on an empty camp, rain and cold nights. Stash cash, buy camp security, befriend Moonbeam next door, get a rainfly.')
      + li('Grow and forage', 'Your garden takes seeds from the General Store; what you harvest goes into your sandwiches by itself and makes them worth more. Build a mushroom shelf at your workbench: the store has oyster spawn, and the Village Elder keeps the stranger cultures. Wild mushrooms come up under the big trees, on the river bank and in the open grass, most of them the morning after rain. Look before you pick: two of them have poisonous twins. J opens your field journal.')
      + li('The nitrous game', 'Optional and risky. Vinny sells balloons at the far end of Shakedown Street. Sell for him on commission, or get your own tank: from Whip behind the Costume Shop, from town through the lot office, or off Vinny’s stall while he sleeps (3 to 6 AM). Selling against him raises his heat until he comes for you, and the friends you have made decide how that goes. If a buyer speaks first, listen to how. Chaining balloons wrecks your Body.')
      + li('Keys', 'E use · Q choose what to offer · C your kitchen or corner menu while you are serving · I bag · K skills · J journal · M map · H this guide · F eat · R drink from a towed cooler · X dance at the Main Stage · E at the Open Decks tent to play a set · E at your kitchen counter to open it and serve · 1 to 9 use a bag slot · G graphics · N sound')
      + (state.over ? '<p class="hint"><button data-report="1">Show your first-weekend report</button></p>' : '')
      + '<div class="next" style="position:static;text-align:right;margin-top:8px">H or Esc to close</div>';
  }
  function drawPanel() { if (state.panel === 'skills') drawSkills(); else if (state.panel === 'map') drawMap(); else if (state.panel === 'report') drawReport(); else if (state.panel === 'guide') drawGuide(); else if (state.panel === 'journal') drawJournal(); else drawBag(); }
  function togglePanel(open = !state.panel, kind = 'bag') {
    state.panel = open ? kind : false; state.canMove = !open;
    $('bagpanel').classList.toggle('hidden', !open);
    $('bagpanel').classList.toggle('wide', (kind === 'map' || kind === 'journal') && open);
    if (open) { drawPanel(); $('prompt').classList.add('hidden'); }
  }
  $('bagpanel').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.perk) { buyPerk(b.dataset.perk); drawPanel(); return; }
    if (b.dataset.report) { togglePanel(true, 'report'); return; }
    if (b.dataset.j || b.dataset.print) { journalClick(b); return; }
    if (b.dataset.vision) { visionQuest(); drawPanel(); return; }
    if (b.classList.contains('slot')) picked = { where: b.dataset.where, k: b.dataset.k };
    else if (!picked) return;
    else if (b.dataset.do === 'use') useItem(picked.k);
    else if (b.dataset.do === 'drop') dropStack(picked.k);
    else if (b.dataset.do === 'sell') dropStack(picked.k, SELL[picked.k]);
    else moveStack(picked.k, b.dataset.do === 'stash' ? 'bag' : 'store');
    drawPanel();
  });
  // the hotbar: your bag along the bottom of the screen. Click a thing, or press its number, to use it.
  let hotHtml = '';
  $('hotbar').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (b && ITEMS[b.dataset.k].use && state.canMove) useItem(b.dataset.k);
  });
  function drawHotbar() {
    const show = state.mode === 'free' && !state.cooking && !state.panel && !state.menu && !state.dialogue;
    $('hotbar').classList.toggle('hidden', !show);
    if (!show) return;
    const s = slotsOf('bag');
    const html = Array.from({ length: bagSlots() }, (_, i) => slotHtml(s[i], 'bag', s[i] && ITEMS[s[i].k].use && i < 9 ? i + 1 : '')).join('');
    if (html !== hotHtml) { hotHtml = html; $('hotbar').innerHTML = html; }
  }

  // ---- HUD
  $('stats').innerHTML = `<div><span id="hname" class="comix" style="font-size:18px"></span></div>
    <div id="clock" class="comix" style="font-size:16px"></div>
    <div>Cash <b id="cash" class="comix">$40</b><span id="stashed"></span></div>
    ${BARS.map(([k, label]) => `<div class="bar"><span>${label}</span><div class="meter"><i id="bar-${k}"></i></div></div>`).join('')}
    <div id="inv"></div>`;
  function drawHud() {
    const h = Math.floor(state.hour), m = Math.floor((state.hour - h) * 60);
    $('clock').textContent = `${dayName(state.day).slice(0, 3)} ${(h + 11) % 12 + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}${state.weather.rain ? ' · Rain' : ''}`;
    $('cash').textContent = `$${state.cash}`;
    $('stashed').textContent = state.stash ? ` · $${state.stash} at camp` : '';
    for (const [k, , colour] of BARS) {
      const v = need(k), el = $('bar-' + k);
      el.style.width = `${v * 100}%`;
      el.style.background = k === 'buzzkill' ? colour : v < 0.25 ? '#d7263d' : colour;
    }
    const bits = [`Bag ${used('bag')}/${bagSlots()} <kbd>I</kbd> · Skills <kbd>K</kbd>${state.points ? ` <b style="font-size:13px;color:var(--grape)">+${state.points}</b>` : ''} · Map <kbd>M</kbd>`];
    if (state.mode === 'free' && atStage()) bits.push(`${nowPlaying().split(',')[0]} <kbd>X</kbd> dance`);
    const on = [fx('clear') ? 'Clear Head' : '', fx('soul') ? 'Old Soul' : '', fx('zombie') ? 'Zombie Legs' : '', fx('broth') ? 'Iron broth' : '', fx('smoke') ? 'Smoke' : '', fx('trip') ? 'Tripping' : ''].filter(Boolean);
    if (on.length) bits.push(on.join(' · '));
    if (state.body < 0.995) bits.push(`Body ${Math.round(state.body * 100)}%${total() < state.nos.tingleUntil ? ' · Tingle Fingers' : ''}`);
    else if (total() < state.nos.tingleUntil) bits.push('Tingle Fingers');
    if (rival()) bits.push(`Vinny’s heat: ${Math.round(state.nos.heat)}%${lookout() ? ' · lookout on' : ''}`);
    if (state.nos.side === 'ally' && state.nos.owed > 0) bits.push(`You owe Vinny $${state.nos.owed}`);
    if (discreet()) bits.push(`Tank in the cooler: ${state.nos.fills} fills <kbd>B</kbd> fill 5`);
    if (state.water || state.towing) bits.push(`Cooler: ${state.water} water${state.towing ? ' <kbd>R</kbd> drink' : ' (at camp)'}`);
    $('inv').innerHTML = bits.join('<br>');
    drawHotbar();
  }

  // ---- menus (stalls, your tent, the river)
  function menu(title, options, asShelf = false) {
    state.menu = { title, options, asShelf };
    state.canMove = false;
    $('menutitle').textContent = title;
    const box = $('menuopts');
    box.innerHTML = '';
    $('menu').classList.toggle('shelf', asShelf);
    if (asShelf) $('menutitle').innerHTML = `${title} <small>you have $${state.cash}</small>`;
    options.forEach((o, i) => {
      const b = document.createElement('button');
      const why = o.can ? o.can() : true;
      if (asShelf) b.innerHTML = `${ICONS[o.icon] || ''}<span>${o.label}</span>${why !== true ? `<em>${why}</em>` : `<b>${o.cost ? `$${o.cost}` : ''}</b>`}${i < 9 ? `<kbd>${i + 1}</kbd>` : ''}`;
      else b.innerHTML = `<kbd>${i + 1}</kbd> ${o.label}${o.cost ? ` <b>$${o.cost}</b>` : ''}${why !== true && why !== 'for your information' ? `<br><em class="why">Not now: ${why}</em>` : ''}`;
      b.disabled = why !== true || (o.cost || 0) > state.cash;
      b.onclick = () => choose(i);
      box.append(b);
    });
    $('menu').classList.remove('hidden');
    $('prompt').classList.add('hidden');
  }
  function closeMenu() { state.menu = null; state.canMove = true; $('menu').classList.add('hidden'); }
  function choose(i) {
    const o = state.menu && state.menu.options[i];
    if (!o) return;
    if ((o.can ? o.can() : true) !== true) return;
    if ((o.cost || 0) > state.cash) { toast('Not enough cash.'); return; }
    state.cash -= o.cost || 0;
    const { title, options, asShelf } = state.menu;
    closeMenu();
    o.act();
    if (o.stay && !state.menu && state.canMove) menu(title, options, asShelf);
  }
  // A menu line for buying something that goes in your bag: greyed out when there is no room.
  const shelf = (label, k, amount, cost, after) => ({ ...stock(label, k, amount, cost, after), icon: k, stay: true }); // the same, on a shop shelf
  const stock = (label, k, amount, cost, after) => ({
    label, cost, can: () => (room('bag', k) >= amount ? true : 'no room in your bag'),
    act: () => { give(k, amount); if (after) after(); },
  });

  // ---- sleeping, fainting, getting thrown out
  function rest(untilMorning) {
    state.canMove = false;
    const soaked = state.weather.rain && state.gear.tent < 3; // no rainfly
    let recap = '';
    if (untilMorning) { // what the day came to
      const log = state.dayLog, worth = state.cash + state.stash, bits = [worth >= log.worth ? `you came out $${worth - log.worth} ahead` : `you ended $${log.worth - worth} down`];
      if (state.sold > log.sold) bits.push(`sold ${state.sold - log.sold} sandwiches`);
      if (state.heal.count > log.helped) bits.push(`helped ${state.heal.count - log.helped} people`);
      if (state.picked > log.picked) bits.push(`binned ${state.picked - log.picked} bits of litter`);
      recap = ` Yesterday ${bits.join(', ')}.`;
      state.dayLog = { worth, sold: state.sold, helped: state.heal.count, picked: state.picked };
    }
    const before = total();
    if (untilMorning) { const wake = state.hour < 8 ? 8 : 32; pass(wake - state.hour); } else pass(2);
    const hours = total() - before;
    const tent = state.gear.tent, ease = tent >= 3 ? 0.5 : 1;
    add('energy', untilMorning ? (tent >= 2 ? 1 : 0.75) : (tent >= 5 ? 0.7 : 0.35) + (made('shade') ? 0.15 : 0) + (state.tree.nap ? 0.15 : 0));
    add('hydration', -0.03 * hours * ease); add('nourishment', -0.035 * hours * ease);
    if (tent < 4) add('hygiene', -0.012 * hours);
    add('vibes', soaked ? -0.15 : untilMorning ? 0.15 : 0.05); n.buzzkill = clamp(n.buzzkill - 0.08 * hours);
    for (const k of ['hydration', 'nourishment']) n[k] = Math.max(n[k], 0.12); // you wake up thirsty and hungry, not unconscious
    state.lot.sleep = true; tick('sleep');
    gfx.setTime(state.hour);
    const h = Math.floor(state.hour), m = Math.floor((state.hour - h) * 60);
    card(untilMorning ? `${dayName(state.day)}, 8:00 AM` : `${(h + 11) % 12 + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`,
      (soaked ? 'Rain came through the tent. You woke up soaked.' : untilMorning ? 'You slept like a rock.' : 'A two-hour nap. Slightly more human.') + recap, untilMorning ? 4400 : 2400, () => { state.canMove = true; gain('wellness', untilMorning ? 3 : 1); save(); });
  }
  function collapse(why) {
    state.canMove = false;
    const loss = Math.round(state.cash * 0.3);
    state.cash -= loss; pass(2);
    n.hydration = Math.max(n.hydration, 0.4); n.energy = Math.max(n.energy, 0.3); add('vibes', -0.25);
    getPlayer().root.position.set(VILLAGE.chill[0] - 0.5, 0, VILLAGE.chill[1] - 4.2);
    gfx.setTime(state.hour);
    card(why === 'energy' ? 'You crashed' : 'You fainted', `Someone carried you to the Chill-Out Tent. Two hours are gone${loss ? `, and $${loss} is missing from your pocket` : ''}.`, 3800, () => { state.canMove = true; });
  }
  function eject() {
    state.canMove = false;
    const fine = Math.min(10, state.cash), lost = made('hoodie') ? 0 : state.cheese.length;
    state.cash -= fine; if (!made('hoodie')) state.cheese = []; n.buzzkill = 0.3; add('vibes', -0.2);
    getPlayer().root.position.set(0, 0, 3);
    card('Ejected', `Security walked you out to the lot${fine ? ` and fined you $${fine}` : ''}${lost ? '. Your sandwiches are gone too' : ''}.`, 3800, () => { state.canMove = true; });
  }

  // ---- grilled cheese: cook it. One pan, or two with the second burner; each pan runs its own timing bar.
  const WIDE = [[0.52, 'raw'], [0.6, 'golden'], [0.7, 'perfect'], [0.8, 'golden'], [1.01, 'burnt']];
  const NARROW = [[0.57, 'raw'], [0.63, 'golden'], [0.69, 'perfect'], [0.75, 'golden'], [1.01, 'burnt']];
  const WIDEST = [[0.5, 'raw'], [0.57, 'golden'], [0.73, 'perfect'], [0.82, 'golden'], [1.01, 'burnt']];
  let ZONES = NARROW;
  // A sandwich is { p: what it is worth, f: the fillings in it }. Its name comes from its first filling.
  const sandwichName = (item) => { const f = FILLINGS.find((x) => x.item === item); return !f ? 'grilled cheese' : /melt|popper/i.test(f.name) ? f.name.toLowerCase() : `${f.name.toLowerCase()} grilled cheese`; };
  const plural = (name, c) => (c === 1 ? name : /cheese$/.test(name) ? name : `${name}s`);
  function stockLine(pools) { // "4 grilled cheese, 2 tomato melts"
    const by = {};
    for (const pool of pools) for (const s of pool) { const k = s.p < 2 ? 'burnt' : s.f[0] || ''; by[k] = (by[k] || 0) + 1; }
    const keys = ['', ...FILLINGS.map((f) => f.item), 'burnt'].filter((k) => by[k]);
    return keys.length ? keys.map((k) => `${by[k]} ${k === 'burnt' ? k : plural(sandwichName(k), by[k])}`).join(', ') : 'nothing cooked';
  }
  // ---- toppings go on by hand, one sandwich at a time, while it is in the pan. No topping means plain grilled cheese.
  // The strip shows each one as a small drawn slice, the same shapes that drop onto the sandwich (never a photo or a journal plate).
  const chip = (body) => `<svg viewBox="0 0 24 24" aria-hidden="true"><g stroke="#17111f" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">${body}</g></svg>`;
  const shroom = (cap, stem) => chip(`<path d="M10 13h4l1 8H9z" fill="${stem}"/><path d="M3 13c0-6 4-10 9-10s9 4 9 10z" fill="${cap}"/>`);
  const TOP_CHIP = {
    tomato: chip('<circle cx="12" cy="12" r="9.5" fill="#e0392b"/><circle cx="12" cy="12" r="6" fill="#f58a78"/><g fill="#f7e6a6" stroke="none"><circle cx="12" cy="8.5" r="1.2"/><circle cx="15.2" cy="13.6" r="1.2"/><circle cx="8.8" cy="13.6" r="1.2"/></g>'),
    pepper: chip('<circle cx="12" cy="12" r="9.5" fill="#3f9d4a"/><circle cx="12" cy="12" r="5.5" fill="#d4ecb0"/><g fill="#f7e6a6" stroke="none"><circle cx="10.5" cy="11" r="1"/><circle cx="13.6" cy="12.6" r="1"/></g>'),
    herbs: chip('<path d="M12 22V11" fill="none"/><path d="M12 12C5 12 3 8 3 4c6 0 9 3 9 8zM12 15c6 0 9-4 9-8-6 0-9 3-9 8z" fill="#4caf50"/>'),
    oyster: shroom('#eadfc8', '#f5efe0'), chanterelle: shroom('#e8a33d', '#c9822b'), morel: shroom('#7a5a3a', '#d9c8a4'),
  };
  const topLimit = () => (state.gear.stove >= 7 ? 2 : 1); // the sandwich press takes two
  const perFlip = () => (state.gear.stove >= 6 ? 2 : 1); // the griddle does two sandwiches to a flip, and one press tops both
  const promised = (item) => state.cooking.stations.reduce((sum, st) => sum + (st.active && !st.fresh && st.top.includes(item) ? perFlip() : 0), 0);
  function drawTops() {
    const c = state.cooking;
    $('cooktops').innerHTML = !c.tops.length ? '<small>No toppings on you. Grow tomatoes, peppers or herbs in your garden, or forage mushrooms, and they show up here to put on.</small>' : c.tops.map((item, n) => { const left = have(item) - promised(item); return `<button data-top="${item}"${left > 0 ? '' : ' disabled'}><kbd>${n + 1}</kbd>${TOP_CHIP[item] || ''}<span>${FILLINGS.find((f) => f.item === item).name}</span><b>×${Math.max(0, left)}</b></button>`; }).join('');
    $('cooktops').querySelectorAll('button').forEach((b) => { b.onclick = () => cookTop(b.dataset.top); });
    for (const st of c.stations) { const el = $('cookon' + st.i); if (el) el.textContent = !st.active || st.fresh ? '' : st.top.length ? st.top.map((k) => sandwichName(k).replace(' grilled cheese', '')).join(' + ') : 'plain'; }
  }
  // Put a topping on the sandwich in pan i; with no pan named, on the one furthest along that still has room for it.
  function cookTop(item, i) {
    const c = state.cooking;
    if (!c || !c.tops.includes(item)) return;
    const open = (st) => st.active && !st.fresh && st.top.length < topLimit() && !st.top.includes(item);
    const st = i !== undefined ? c.stations[i] : c.stations.filter(open).sort((x, y) => (y.side + y.x) - (x.side + x.x))[0];
    if (!st || !open(st)) { $('cookmsg').textContent = 'Nothing in the pan has room for that.'; return; }
    if (have(item) - promised(item) < 1) { $('cookmsg').textContent = `You are out of ${ITEMS[item].name.toLowerCase()}.`; return; }
    st.top.push(item); sfx('pick'); if (cook.addTopping) cook.addTopping(st.i, item);
    $('cookmsg').textContent = `${FILLINGS.find((f) => f.item === item).name} going on${c.pans > 1 ? ` the ${st.i ? 'right' : 'left'} pan` : ''}.`;
    drawTops();
  }
  function startCooking() {
    if (!have('supplies')) { toast('You need bread and cheese. The General Store sells it.'); return; }
    const pans = state.gear.stove >= 4 ? 2 : 1;
    const space = room('bag', 'cheese') + room('store', 'cheese') + cabinetCheeseRoom();
    if (space < 1) { toast('Your bag and your camp stash are both full. Sell or eat some first.'); return; }
    const per = state.gear.stove >= 6 ? 2 : 1; // the griddle does two to a flip
    const bySupplies = Math.ceil(have('supplies') / per), bySpace = Math.floor(space / per), totalToCook = Math.max(1, Math.min(bySupplies, pans * 5, bySpace));
    // say up front what is holding the session short, so two sandwiches and out is never a mystery
    const short = totalToCook >= pans * 5 ? '' : bySpace <= bySupplies ? 'space' : 'supplies';
    if (short === 'space') toast(`Room for only ${Math.max(1, Math.min(space, totalToCook * per))} more sandwiches: your bag and camp stash are nearly full. Sell some, or move ingredients into a produce cabinet (Leather & Burner) to free up stash space.`);
    else if (short === 'supplies') toast(`Bread and cheese for only ${have('supplies')} sandwiches, so this will be a short one. The General Store sells a case of 20.`);
    state.stashedAtStart = state.store.cheese.length;
    state.canMove = false;
    state.cooking = { pans, queue: totalToCook, total: totalToCook, made: 0, short, stations: [], tops: FILLINGS.filter((f) => have(f.item) > 0).map((f) => f.item) };
    ZONES = state.gear.stove >= 5 ? WIDEST : state.gear.stove >= 3 ? WIDE : NARROW;
    const pc = ZONES.map(([edge]) => `${Math.min(edge, 1) * 100}%`);
    const paint = `linear-gradient(90deg,#f6e7c1 0 ${pc[0]},#e8a33d ${pc[0]} ${pc[1]},#ffd23f ${pc[1]} ${pc[2]},#e8a33d ${pc[2]} ${pc[3]},#3b2416 ${pc[3]} 100%)`;
    $('cookbars').innerHTML = Array.from({ length: pans }, (_, i) => `<div class="cookrow">${pans > 1 ? `<kbd>${'AD'[i]}</kbd>` : ''}<div class="cookbar" style="background:${paint}"><i id="cookmark${i}"></i></div><span class="cookon" id="cookon${i}"></span></div>`).join('');
    $('cook').classList.remove('hidden'); $('prompt').classList.add('hidden');
    document.body.classList.add('cooking');
    $('cookmsg').textContent = (pans > 1 ? 'Two pans. A flips the left, D flips the right. Space flips whichever is further along.' : 'Flip it when the marker hits the gold. Space or click.') + (state.cooking.tops.length ? ' Number keys put a topping on what is in the pan.' : '');
    cook.start(gfx.light, Math.min(4, state.gear.stove));
    for (let i = 0; i < pans; i++) {
      const st = { i, side: 0, x: 0, speed: 0.3, first: null, wait: 0, fresh: false, active: false, top: [] };
      state.cooking.stations.push(st);
      if (state.cooking.queue > 0) { state.cooking.queue--; st.active = true; cook.newSandwich(i); st.wait = 0.42 + i * 0.9; } // the second pan starts a beat later
    }
    drawCount(); drawTops();
  }
  const drawCount = () => { const c = state.cooking; $('cookcount').textContent = `${c.made} sandwich${c.made === 1 ? '' : 'es'} done`; };
  function nextSide(st) {
    st.x = 0; st.wait = 0;
    st.speed = state.gear.stove >= 2 ? 0.3 + st.i * 0.04 : 0.24 + Math.random() * 0.26; // the wind guard steadies it
    if (total() < state.nos.tingleUntil) st.speed *= 0.7 + Math.random() * 0.8; // Tingle Fingers: nothing steadies that
    if (fx('clear')) st.speed *= 0.75; // a clear head slows the moment down
    cook.setProgress(st.i, 0);
  }
  function cookPress(i) {
    const c = state.cooking;
    if (!c) return;
    let st = c.stations[i];
    if (i === undefined) st = c.stations.filter((s) => s.active && s.wait <= 0).sort((a, b) => b.x - a.x)[0]; // Space: the one further along
    if (!st || !st.active || st.wait > 0) return;
    const zone = (ZONES.find(([edge]) => st.x < edge) || ZONES[ZONES.length - 1])[1]; // past the end counts as burnt
    if (st.side === 0) {
      st.first = zone; st.side = 1; st.wait = 0.8;
      $('cookmsg').textContent = { raw: 'Flipped early. Pale side.', golden: 'Nice flip.', perfect: 'Perfect flip.', burnt: 'That side is burnt.' }[zone];
      cook.flip(st.i);
      return;
    }
    const both = [st.first, zone];
    let [name, price] = both.includes('burnt') ? ['Burnt', 1] : both.includes('raw') ? ['Pale', 2] : both.every((z) => z === 'perfect') ? ['Perfect', 4] : ['Golden', 3];
    if (name === 'Perfect') state.chain.stats.perfect++;
    const base = price, batch = Math.min(state.gear.stove >= 6 ? 2 : 1, have('supplies'));
    for (let j = 0; j < batch; j++) {
      price = base;
      const fills = base >= 2 ? st.top.map((item) => FILLINGS.find((f) => f.item === item)).filter((f) => have(f.item) > 0) : []; // what you put on it; a burnt sandwich is past saving, and its toppings go back in the box
      for (const f of fills) {
        const bad = badFilling(f.item);
        spend(f.item, 1);
        if (bad) { price = 1; break; }
        price += f.bonus;
      }
      if (fills.length && price > base) name = fills.length > 1 ? `${fills[0].name} with ${ITEMS[fills[1].item].name.toLowerCase()}` : fills[0].name;
      const done = { p: price, f: price > base ? fills.map((f) => f.item) : [] };
      spend('supplies', 1);
      const serving = state.kitchen.open || hired('front');
      if (serving && room('store', 'cheese') > 0) state.store.cheese.push(done); // the stand is open (or Moonbeam is on the counter): it goes straight to the camp stash, which the counter serves from
      else if (serving && cabinetCheeseRoom() > 0) state.pantryCheese.push(done); // stash full: the cabinet takes it, and the counter serves from there as well
      else if (give('cheese', 1, done, true) > 0 && cabinetCheeseRoom() > 0) state.pantryCheese.push(done); // cooked at camp: bag, then stash, then cabinet
      c.made++;
      gain('hustle', price >= 4 ? 2 : 1);
    }
    st.side = 0;
    pass(8 / 60 / c.pans);
    $('cookmsg').textContent = `${name}${/melt|popper/i.test(name) ? '' : ' grilled cheese'}${batch > 1 ? ', two of them' : ''}. Worth $${price}${batch > 1 ? ' each' : ''}.`;
    st.wait = 1.25; st.fresh = true; st.top = [];
    cook.plate(st.i, name);
    drawCount(); drawTops();
  }
  function stopCooking() {
    const made = state.cooking.made, why = state.cooking.queue > 0 || state.cooking.stations.some((s) => s.active) ? '' : { space: ' That is all your bag and stash have room for.', supplies: ' That was the last of your bread and cheese.', '': '' }[state.cooking.short || ''];
    state.cooking = null; state.canMove = true;
    $('cook').classList.add('hidden');
    document.body.classList.remove('cooking');
    cook.stop();
    const stashed = state.store.cheese.length - (state.stashedAtStart || 0);
    if (made) { toast(stashed >= made ? `You made ${made} grilled cheese. They are in your camp stash, ready for the counter.${why}` : stashed > 0 ? `You made ${made} grilled cheese. Your bag took ${made - stashed}; the other ${stashed} are in your camp stash (I, at camp).${why}` : `You made ${made} grilled cheese.${why}`); state.lot.cook = true; tick('cook'); }
  }
  function updateCooking(dt) {
    const c = state.cooking;
    cook.update(dt);
    for (const st of c.stations) {
      if (!st.active) continue;
      if (st.wait > 0) {
        st.wait -= dt;
        if (st.wait <= 0) {
          if (st.fresh) { // the last one is plated: start another, or this pan is finished
            st.fresh = false;
            if (c.queue > 0) { c.queue--; cook.newSandwich(st.i); st.wait = 0.42; } else st.active = false;
            drawTops();
          } else nextSide(st);
        }
        continue;
      }
      st.x += dt * st.speed;
      cook.setProgress(st.i, st.x);
      $('cookmark' + st.i).style.left = `${Math.min(st.x, 1) * 100}%`;
      if (st.x >= 1) cookPress(st.i); // left it too long
    }
    if (c.stations.every((s) => !s.active)) stopCooking();
  }

  // ---- selling and eating
  const canSellWater = () => state.towing && state.water > 0; // from the cooler: this is what gets added to a sandwich sale
  const hasWater = () => canSellWater() || state.bag.bottles > 0; // offered on its own, a bottle from your bag will do
  // What you are holding out to people. You choose with Q; left alone, it is balloons late at night, then sandwiches, then water.
  const GOODS = { cheese: 'grilled cheese', water: 'cold water', balloons: 'balloons' };
  const onOffer = () => [state.cheese.length ? 'cheese' : '', hasWater() ? 'water' : '', state.bag.balloons > 0 ? 'balloons' : ''].filter(Boolean);
  function offering() {
    const have = onOffer();
    if (have.includes(state.offer)) return state.offer;
    return pushBalloon() ? 'balloons' : have[0];
  }
  function nextOffer() {
    const have = onOffer();
    if (have.length < 2) { toast(have.length ? `You only have ${GOODS[have[0]]} to offer.` : 'You have nothing to offer anybody.'); return; }
    state.offer = have[(have.indexOf(offering()) + 1) % have.length];
    toast(`Now offering: ${GOODS[state.offer]}.`);
  }
  const pitch = () => {
    const kind = offering(), more = onOffer().length > 1 ? ' · Q to offer something else' : '';
    let read = '';
    if (fx('clear') && kind !== 'balloons') { // you can see what they want before you ask
      const f = buyer();
      if (f) {
        if (kind === 'cheese') { if (f.appetite === undefined) f.appetite = Math.random(); read = f.appetite > 0.62 ? ' · they look hungry' : f.appetite < 0.38 ? ' · they have just eaten' : ' · could go either way'; }
        else { if (f.thirst === undefined) f.thirst = Math.random(); read = f.thirst > 0.62 ? ' · they look parched' : f.thirst < 0.38 ? ' · they are carrying a drink' : ' · could go either way'; }
      }
    }
    return (kind === 'balloons' ? balloonPitch() : kind === 'cheese' ? `Offer a grilled cheese ($${Math.max(...state.cheese.map((s) => s.p))})` : 'Offer cold water ($2)') + read + more;
  };
  function buyer() {
    if (!onOffer().length) return null;
    const p = getPlayer().root.position, now = total();
    let best = null, bd = 2.1;
    for (const f of people) { if (f.away || f.called || f.next > now || f === people[PAL] || f === people[WHIPI]) continue; const d = Math.hypot(f.x - p.x, f.z - p.z); if (d < bd) { bd = d; best = f; } }
    return best;
  }
  function sellWater(f, quiet) {
    // Cold water: cheap, easy, and security tolerates it. It sells best in the heat of the day.
    f.next = total() + 2;
    const hot = Math.max(0, 1 - Math.abs(state.hour - 14) / 4);
    f.thirst = f.thirst === undefined ? Math.random() : f.thirst;
    const chance = Math.min(0.9, 0.3 + hot * 0.4 + (f.thirst - 0.5) * 0.3 - (n.hygiene < 0.3 ? 0.2 : 0) + hustleEdge(level('hustle')));
    f.thirst = Math.random();
    if (Math.random() > chance) { if (!quiet) toast(['"I’m good on water."', '"Got my own, thanks."', '"Two bucks? For water?"'][Math.floor(Math.random() * 3)]); return false; }
    if (canSellWater()) state.water--; else state.bag.bottles--;
    state.cash += 2; add('vibes', 0.01); gain('hustle', 1); sfx('coin');
    if (!quiet) toast('+$2. Cold water, cold water.');
    return true;
  }
  function sell() {
    const f = buyer();
    if (!f) return;
    const kind = offering();
    if (kind === 'balloons') { sellBalloon(f); return; }
    if (kind === 'water') { sellWater(f); return; }
    state.cheese.sort((a, b) => b.p - a.p);
    const price = state.cheese[0].p;
    f.next = total() + 3 - Math.min(1.5, (level('charisma') - 1) * 0.25) - (state.tree.regulars ? 1 : 0);
    // A sale is never certain. It depends on how hungry this person is, the time of day,
    // how good the sandwich is, how you smell and how you come across.
    const h = state.hour;
    const mealtime = (h >= 12 && h < 14) || (h >= 18 && h < 20.5) || h >= 23 || h < 3; // lunch, dinner, late-night munchies
    f.appetite = f.appetite === undefined ? Math.random() : f.appetite;
    let chance = 0.42 + (f.appetite - 0.5) * 0.4 + (mealtime ? 0.15 : 0)
      + (price >= 4 ? 0.15 - Math.max(0, price - 5) * 0.03 : { 3: 0.05, 2: -0.1, 1: -0.3 }[price]) - (state.weather.rain && !fx('broth') ? 0.12 : 0)
      + (state.vibes > 0.7 ? 0.1 : state.vibes < 0.3 ? -0.15 : 0)
      - (n.hygiene < 0.5 ? 0.1 : 0) + (made('tray') ? 0.08 : 0) + hustleEdge(level('hustle'));
    if (n.hygiene < 0.3) chance *= 0.35;
    chance = Math.min(0.9, Math.max(0.05, chance));
    if (Math.random() > chance) {
      f.appetite = Math.random(); // they may feel differently later
      const no = n.hygiene < 0.3 ? ['"Uh, no thanks." You reek.', 'They take one step back. "I’m good."']
        : price === 1 ? ['"That one is burnt, friend."', '"Is that… charcoal?"']
        : f.appetite < 0.4 || !mealtime ? ['"Just ate, sorry."', '"I’m good, thanks."', '"Maybe later, family."', '"No cash on me."', 'They did not even hear you.']
        : ['"Three bucks? Nah."', '"I’m good, thanks."', '"Got my own, thanks."'];
      // with the cooler behind you there is a second thing to offer
      if (canSellWater() && sellWater(f, true)) { toast('No sandwich, but they took a cold water. +$2.'); return; }
      toast(no[Math.floor(Math.random() * no.length)]);
      return;
    }
    f.appetite = Math.random() * 0.4; // they just ate
    const pay = price + (price >= 4 && state.trophies.spatula ? 1 : 0); // the Golden Spatula
    state.cheese.shift(); state.cash += pay; state.sold++; add('vibes', 0.015); gain('hustle', 2); sfx('coin');
    const p = getPlayer().root.position;
    const combo = canSellWater() && Math.random() < (state.tree.upsell ? 0.75 : 0.5); // something to wash it down
    if (combo) { state.water--; state.cash += 2; }
    const got = combo ? `+$${pay + 2}, sandwich and a water` : `+$${pay}`;
    if (zoneAt(p.x, p.z) === 'Shakedown Street' && state.permitDay !== state.day) { add('buzzkill', 0.14 * [1, 1, 1, 1.15, 1.35][state.gear.bag] * (1 - charmEase(level('charisma')))); toast(`${got}. Security is watching: no booth, no vending on the Street.`); } else toast(got);
    if (state.sold >= 3 && !state.lot.sell) { state.lot.sell = true; tick('sell'); }
  }
  function eat() {
    if (!state.cheese.length) return;
    state.cheese.sort((a, b) => a.p - b.p);
    const price = state.cheese.shift().p; // eat the worst one first
    add('nourishment', (price >= 4 ? 0.38 : price === 1 ? 0.2 : 0.3) * (state.tree.gut ? 1.25 : 1));
    if (price >= 3) add('vibes', 0.02);
    toast(price === 1 ? 'You ate the burnt one. It was food.' : 'You ate a grilled cheese.');
  }

  // ---- trouble: pickpockets work the Street, and an empty camp gets visitors. None of it starts before Friday.
  function pickpocket() {
    const loss = Math.min(15, Math.max(2, Math.round(state.cash * 0.2)));
    state.cash -= loss; add('vibes', -0.05);
    toast(`Someone bumped into you in the crowd. $${loss} is gone from your pocket.`);
  }
  function raid() {
    state.raidNext = total() + 20; // once a day at most
    if (state.shrooms.some((s) => s && s.k === 'goldcap') && Math.random() < 0.5) { // not a thief this time
      state.shrooms = state.shrooms.map((s) => (s && s.k === 'goldcap' ? null : s));
      const fine = Math.min(30, state.stash); state.stash -= fine;
      state.raid = `Security swept the Campgrounds and found the tub in your tent. It is gone${fine ? `, and so is $${fine} from your stash` : ''}.`;
      return;
    }
    const kinds = Object.keys(ITEMS).filter((k) => count('store', k) > 0), larder = Object.keys(state.pantry).filter((k) => state.pantry[k] > 0); // the pantry is no safer than the tent
    if (state.stash >= 4) {
      // The better guarded the camp, the rarer the raid, and the more serious the thief who gets through.
      const guard = [0, 1, 0.5, 0.15][state.gear.lock] * (total() < state.pal.watch ? 0.2 : 1);
      const [share, most] = guard >= 1 ? [0.3, 25] : guard >= 0.5 ? [0.4, 60] : guard >= 0.1 ? [0.5, 120] : [0.6, 250];
      const loss = Math.min(most, Math.round(state.stash * share));
      state.stash -= loss; state.raid = `$${loss} of your stashed cash is gone.`;
    } else if (kinds.length + larder.length) {
      const pick = Math.floor(Math.random() * (kinds.length + larder.length)), inPantry = pick >= kinds.length, k = inPantry ? larder[pick - kinds.length] : kinds[pick];
      const amount = Math.min(inPantry ? state.pantry[k] : count('store', k), ITEMS[k].stack);
      if (inPantry) state.pantry[k] -= amount; else if (k === 'cheese') state.store.cheese.splice(0, amount); else state.store[k] -= amount;
      state.raid = `${amount} ${ITEMS[k].name.toLowerCase()} went missing from your ${inPantry ? 'produce cabinet' : 'stash'}.`;
    } else state.raid = 'Someone went through your tent and found nothing worth taking.';
  }

  // ---- the roaming healer: once the Village Elder has sent you out, a few people around the festival need help
  const AILS = [
    ['is sunburnt and dizzy', 'bottles', 'a water bottle', 'Water, shade and a minute of your time. They perk up.'],
    ['is sore from dancing all night', 'herbs', 'fresh herbs', 'A herb rub on the shoulders. They groan, then grin.'],
    ['is having a rough time', 'herbs', 'fresh herbs', 'You burn a little sage and sit with them until it passes.'],
  ];
  const nearHurt = (p) => state.heal.ids.find((id) => people[id] && Math.hypot(people[id].x - p.x, people[id].z - p.z) < 2.3);
  function helpSomeone() {
    const id = nearHurt(getPlayer().root.position);
    if (id === undefined) return;
    const [, k, what, done] = AILS[id % AILS.length];
    const give1 = state.bag[k] ? k : state.bag.sage ? 'sage' : ''; // sage from your garden works on anybody
    if (!give1) { toast(`They need ${what}, and you have none in your bag. Sage would do, too.`); return; }
    state.bag[give1]--;
    state.heal.ids = state.heal.ids.filter((x) => x !== id); state.heal.count++;
    if (state.reckon.path === 'quit') { state.cash += RECKON.healerPay; toast(`+$${RECKON.healerPay} from the Village bowl.`); } // the Village's healer is paid for it
    people[id].next = total() + 1; // let them catch their breath before you sell them a sandwich
    add('vibes', 0.05); pass(0.1);
    const tip = Math.random() < 0.5 ? 1 + Math.floor(Math.random() * 3) : 0;
    state.cash += tip;
    toast(`${done}${tip ? ` They press $${tip} into your hand.` : ''}`);
    gain('wellness', 3); gain('charisma', 1);
  }

  // ---- Moonbeam, the neighbour camped next to you: feed him, and he looks out for you
  // Moonbeam is the one person placed at his own spot beside your tent (main.js puts him there, on the moon rug). It used to be
  // 'whoever stands nearest your tent', which picked a passing camper whenever one was placed closer than he is.
  const MOON = [CAMP.tent[0] + 5.4, CAMP.tent[1] + 4.6];
  const PAL = people.reduce((best, f, i) => { const d = Math.hypot(f.x - MOON[0], f.z - MOON[1]); return d < 0.5 && (best < 0 || d < Math.hypot(people[best].x - MOON[0], people[best].z - MOON[1])) ? i : best; }, -1);
  const nearPal = (p) => PAL >= 0 && Math.hypot(people[PAL].x - p.x, people[PAL].z - p.z) < 2.2;
  function palMenu() {
    const pal = state.pal, watching = total() < pal.watch;
    const mood = pal.friend >= 4 ? 'Moonbeam lights up when he sees you.' : pal.friend >= 2 ? 'Moonbeam nods you over.' : 'Your neighbour looks up from a camp chair.';
    toast(mood);
    const onShift = hired('front'), held = pal.held || 0;
    menu(`Moonbeam, your neighbour${pal.friend ? ` (friendship ${pal.friend})` : ''}`, [
      ...(held > 0 || onShift ? [{ label: `Collect your takings: $${held} <small>${onShift ? 'he settles up when his shift ends at 2 AM' : 'what he sold at your counter'}</small>`,
        can: () => (onShift ? 'still on shift: come back after 2 AM' : held > 0 ? true : 'he sold nothing'),
        act: () => { state.cash += held; pal.held = 0; pal.told = true; sfx('coin'); toast(`Moonbeam counts it into your hand. +$${held}. "Good day at the counter, neighbour."`); save(); } }] : []),
      { label: 'Share a grilled cheese <small>he shares something back</small>', can: () => (state.cheese.length ? true : 'you have none on you'), act: () => {
        state.cheese.sort((a, b) => a.p - b.p); state.cheese.pop(); // you give them your best one
        pal.friend++; add('vibes', 0.05);
        const k = ['fabric', 'salvage', 'bottles'][pal.friend % 3], left = give(k, 1);
        toast(left ? '"Bless you, neighbour." He had a gift for you, but your bag is full.' : `"Bless you, neighbour. Here, take this." +1 ${ITEMS[k].name.toLowerCase()}.`);
        gain('charisma', 2);
      } },
      { label: 'Ask him to watch your camp <small>far fewer raids for a day</small>', can: () => (watching ? 'he is already keeping an eye out' : pal.friend >= 2 ? true : 'you barely know each other: share food first'),
        act: () => { pal.watch = total() + 24; toast('"Go have fun. Nobody is touching your stuff."'); } },
      { label: 'Ask him to be your lookout tonight <small>slower heat; a warning when a buyer smells wrong</small>', cost: 10,
        can: () => (lookout() ? 'he is already watching' : pal.friend < 2 ? 'share food first' : !state.nos.tank && !state.bag.balloons ? 'you have nothing to look out for' : true),
        act: () => { state.nos.lookoutUntil = state.hour < 6 ? state.day * 24 + 6 : (state.day + 1) * 24 + 6; toast('Moonbeam: I’ll whistle if I see tracksuits. Or new tie-dye.'); } },
      { label: 'Hire for the day: run the counter <small>sells from your camp stash and cabinet while you are out. He holds the takings: collect them from him when his shift ends at 2 AM</small>', cost: 35,
        can: () => (pal.friend < 4 ? 'needs friendship 4' : !state.kitchen.open ? 'put your kitchen sign up first' : working() ? 'already working for you today' : true), act: () => hire('front') },
      { label: 'Hire for the day: tend the garden <small>waters, picks and replants from your seeds</small>', cost: 35,
        can: () => (pal.friend < 4 ? 'needs friendship 4' : working() ? 'already working for you today' : true), act: () => hire('garden') },
      { label: 'Ask for some lot wisdom <small>once a day</small>', can: () => (pal.gift === state.day ? 'ask again tomorrow' : pal.friend >= 1 ? true : 'share food first'), act: () => {
        pal.gift = state.day;
        const tip = ['"The Free Pile gets fresh stuff every hour. Dig early."', '"Lunch and dinner are when folks buy. And late, after the headliner."', '"Rain coming? Get a rainfly on that tent, or sleep wet."',
          '"Do not carry a fat roll down Shakedown. Stash it, or lock your camp."', '"The Elder in the Healing Village is always after help. Bring herbs."'][state.day % 5];
        toast(tip); gain('charisma', 1);
      } },
    ]);
  }
  // ---- dancing at the Main Stage: X, when a set is on and you are close enough to feel it
  const LINEUP = [[14, 'Dusty Sandals'], [16, 'The Wook Report'], [18, 'Sunset Sermon'], [20, 'Lazer Moth'], [22, 'Electric Mycelium, the headliner'], [24, 'DJ Third Eye, late night']];
  const nowPlaying = () => { const w = week(); if (!w.music) return ''; if (w.preparty) return 'The pre-party: open decks all night'; const h = state.hour < 3 ? state.hour + 24 : state.hour; let act = ''; for (const [from, name] of LINEUP) if (h >= from && h < 27) act = name; return act; };
  const headliner = () => state.hour >= 22 && week().musicDay;
  const atStage = () => { const p = getPlayer().root.position; return Math.hypot(p.x + 70, p.z + 121) < 42 && week().music; };
  function dance() {
    if (n.energy < 0.12) { toast('Your legs are done. Rest first.'); return; }
    state.canMove = false; state.danced++; if (headliner()) state.chain.stats.headliner = (state.chain.stats.headliner || 0) + 1;
    pass(0.33);
    add('vibes', (state.weather.rain ? 0.16 : 0.12) + (headliner() ? 0.06 : 0) + (state.trophies.disco ? 0.05 : 0)); add('energy', -0.06); add('hydration', -0.05); add('hygiene', -0.02);
    gfx.setTime(state.hour);
    card(state.weather.rain ? 'Dancing in the rain' : headliner() ? 'You danced to the headliner' : 'You danced through a song', 'Vibes up. Legs a little heavier, mouth a little drier.', 1700, () => { state.canMove = true; gain('charisma', 1); });
  }

  // ---- the nitrous game (satire, and entirely optional). Vinny runs the balloons. You can sell for him, or get a
  // tank of your own three ways and sell against him, which raises his heat until he comes for you.
  const WHIPI = WHIP ? people.findIndex((f) => f.x === WHIP[0] && f.z === WHIP[1]) : -1;
  const late = () => state.hour >= 20 || state.hour < 4;
  const rival = () => state.nos.tank && state.nos.arc === ''; // Vinny's heat only matters while you compete with him
  const lookout = () => total() < state.nos.lookoutUntil;
  const discreet = () => state.nos.rig && state.towing; // the tank is hidden in your wheeled cooler
  const pushBalloon = () => state.bag.balloons > 0 && (late() || (!state.cheese.length && !canSellWater()));
  const price = () => (state.nos.side === 'ally' ? 7 : state.nos.price);
  const elderStands = () => state.village.elder && (state.nos.sold < 40 || state.reckon.path === 'mended') && state.reckon.path !== 'shrugged' && state.nos.arc !== 'made'; // the Elder will not back a heavy seller
  const allies = () => Math.max(0, (state.pal.friend >= 3 ? 1 : 0) + (state.heal.count >= 5 ? 1 : 0) + (level('charisma') >= 4 ? 1 : 0) + (elderStands() ? 1 : 0) - (state.nos.whipState === 'flipped' ? 1 : 0));
  const whipAround = () => !['gone', 'fled'].includes(state.nos.whipState);
  function talk(lines, then) { state.canMove = false; $('prompt').classList.add('hidden'); say(lines, () => { state.canMove = true; if (then) then(); }); }

  // One for yourself: a big lift, gone fast. Chaining them is what hurts: each one is worth less and costs more Body.
  function balloon() {
    const v = state.nos;
    v.chain = total() - v.last < 1 ? v.chain + 1 : 0; v.last = total();
    const c = Math.min(3, v.chain);
    add('vibes', [0.22, 0.1, 0.04, 0][c]);
    state.body = clamp(state.body - [0.1, 0.18, 0.26, 0.34][c]);
    if (c >= 1) { add('energy', -0.05); add('hydration', -0.04); }
    if (state.body <= 0.15) { v.tingleUntil = total() + 5; state.body = 0.3; toast('Everything goes sideways.'); collapse('balloons'); return; }
    if (state.body < 0.5) { v.tingleUntil = total() + 3; toast('You wobble and the balloon gets away from you. Tingle Fingers: clumsy hands for a few hours.'); return; }
    toast(['Wah… wah… wah… Thirty seconds of nothing mattering.', 'Less than the first one. It always is.', 'Your fingers are tingling and your legs want to sit down.', 'Nothing. Just cold lips and a headache.'][c]);
  }
  function heat(amount) {
    const v = state.nos;
    if (!rival()) return;
    v.heat = Math.min(100, v.heat + amount * (lookout() ? 0.6 : 1) * (discreet() ? 0.4 : 1));
    if (v.stage < 1 && v.heat >= 35) { v.stage = 1; toast('A guy in a tracksuit clocks you and gives a slow, cold nod.'); }
    else if (v.stage < 2 && v.heat >= 65) { v.stage = 2; v.sabotage = true; toast('Two of Vinny’s guys just walked off toward the Campgrounds.'); }
    if (v.heat >= 50 && v.route === 'whip' && v.whipState === 'ok' && v.reups >= 1 && !v.squeeze) { v.squeeze = true; toast('Whip is waving at you from behind the Costume Shop. He looks terrible.'); }
    if (v.heat >= 80 && (v.whipState === 'leaned' || v.flipLater)) { v.whipState = 'flipped'; v.flipLater = false; v.heat = 100; toast('Word on the Street: Whip told Vinny everything.'); }
  }

  // Narcs: now and then somebody speaks before you do. Some of those are just keen. Some are Officer Dan's people.
  const night = () => Math.floor((total() - 6) / 24);
  const NARC = ['"You got any of the… you know… the good stuff, broski?"', '"Hey, fellow festival-goer. Are you holding?"', '"I would like to purchase one drug balloon, please."'];
  const KEEN = ['"Balloons? Oh, yes please!"', '"Finally. Two. No, one. No, two."', '"Is that what I think it is? Bless you."'];
  const OFF = ['brand-new boots, not a speck of mud', 'a wristband from no festival you know', 'an earpiece, half hidden by the hat', 'the tie-dye still has shop creases'];
  function tell(f) {
    if (!f.tk || f.tk.night !== night()) {
      const speaks = Math.random() < 0.16, narc = speaks && Math.random() < 0.55;
      f.tk = { night: night(), speaks, narc, line: KEEN[Math.floor(Math.random() * 3)], seen: Math.random() < 0.3 + 0.05 * (level('charisma') - 1), off: OFF[Math.floor(Math.random() * OFF.length)] };
    }
    return f.tk;
  }
  function balloonPitch() {
    const f = buyer();
    if (!f) return `Offer a balloon ($${price()})`;
    const t = tell(f);
    const spotted = t.narc && (t.seen || fx('clear') || lookout()); // a narc talks like anyone else now: you have to notice
    return t.speaks ? `${t.line} Offer a balloon ($${price()})${spotted ? (lookout() && !t.seen && !fx('clear') ? ' · your lookout shakes their head' : ` · you notice ${t.off}`) : ''}` : `Offer a balloon ($${price()})`;
  }
  function bust() {
    const v = state.nos, fine = Math.min(state.cash, 40);
    state.canMove = false; state.cash -= fine; state.bag.balloons = 0; v.busts = (v.busts || 0) + 1; n.buzzkill = 0.5; add('vibes', -0.2);
    getPlayer().root.position.set(0, 0, 3);
    card('Busted', `That was one of Officer Dan’s, in a brand-new tie-dye. Your balloons are gone, and so is $${fine}. You are walked out to the lot.`, 4600, () => { state.canMove = true; });
  }
  function sellBalloon(f) {
    const v = state.nos, p = getPlayer().root.position, ask = price();
    f.next = total() + 2;
    if (tell(f).narc) { bust(); return; }
    if (Math.random() > Math.min(0.92, (late() ? 0.6 : 0.22) + hustleEdge(level('hustle')) + { 4: 0.15, 5: 0, 7: -0.2 }[ask] + (tell(f).speaks ? 0.4 : 0) - (shunned() ? RECKON.warnedSale : 0))) {
      toast(late() ? ['"Not my thing."', '"I’m good, thanks."', '"Just had one."'][Math.floor(Math.random() * 3)] : '"Bit early for that."'); return;
    }
    const street = zoneAt(p.x, p.z) === 'Shakedown Street', pay = ask - (v.arc === 'truce' ? 1 : 0);
    state.bag.balloons--; state.cash += pay; v.sold++;
    if (v.side === 'ally' && v.arc === '') { v.owed += 4; v.allySold++; }
    add('buzzkill', (street ? 0.2 : 0.1) * (discreet() ? 0.5 : 1) * (1 - charmEase(level('charisma')))); // a vendor permit does not cover this
    casualty();
    toast(`+$${pay}${v.arc === 'truce' ? ' after Vinny’s dollar' : v.side === 'ally' && v.arc === '' ? ' ($4 of it is Vinny’s)' : ''}. ${street ? 'On the Street. Bold.' : 'Wah wah.'}`);
    sfx('coin'); gain('hustle', 2);
    heat((street || Math.hypot(p.x - 6.2, p.z + 60.6) < 30 ? 6 : 3) * { 4: 1.6, 5: 1, 7: 0.5 }[ask]); // last, so its warnings are what you read. Undercutting him in the open is what he notices
  }
  function fillFive() {
    const v = state.nos;
    if (v.fills < 5) { toast(`The tank is nearly empty. Refill: ${whereToRefill()}.`); return; }
    if (room('bag', 'balloons') < 5) { toast('No room in your bag for five balloons.'); return; }
    v.fills -= 5; give('balloons', 5); toast(`Five balloons. ${v.fills} fills left.`);
  }
  function gotTank(route) { const v = state.nos; v.tank = true; v.fills = 30; v.route = route; v.side = 'rival'; sfx('build'); save(); }
  function loseTank() { const v = state.nos; v.tank = false; v.fills = 0; v.rig = false; state.bag.balloons = 0; state.store.balloons = 0; }

  // What becomes of Whip once the fight with Vinny is over.
  function settleWhip(ending) {
    const v = state.nos;
    if (v.route !== 'whip' || !whipAround()) return '';
    if (ending === 'won') { if (['ok', 'protected'].includes(v.whipState)) { v.whipState = 'grateful'; return ' Whip keeps your tank filled at cost from now on.'; } v.whipState = 'gone'; return ' Nobody has seen Whip since.'; }
    if (ending === 'truce') return ' Vinny never does find his leak.';
    if (v.whipState === 'protected') return ' Whip, who you kept out of it, is still out there.';
    v.whipState = 'gone'; return ' Vinny counts his tanks that night. Whip’s spot behind the Costume Shop is empty by morning.';
  }
  function brawl(a) {
    const v = state.nos, war = v.route === 'heist';
    if (a >= 3) {
      v.arc = 'won'; add('vibes', 0.2); state.trophies.valve = true;
      card('They showed up', `Moonbeam, the Elder’s people, half the folks you patched up. Vinny looks at the crowd, then at his four guys. "…Keep your corner, kid."${settleWhip('won')}`, 6000);
      gain('charisma', 8);
    } else if (a >= 1) {
      const loss = Math.round(state.cash * (war ? 0.5 : 0.3));
      v.heat = 55; v.stage = 1; v.war = 0; state.cash -= loss; add('energy', -0.3); add('vibes', -0.1);
      card('A dust-up', `A couple of friends came running. You kept the tank, and lost $${loss} and a shirt sleeve. Vinny: "This ain’t over."`, 5200);
    } else {
      const loss = Math.round(state.cash * 0.5);
      v.arc = 'backed'; loseTank(); state.cash -= loss; n.energy = Math.min(n.energy, 0.2); add('vibes', -0.3);
      getPlayer().root.position.set(VILLAGE.chill[0] - 0.5, 0, VILLAGE.chill[1] - 4.2);
      card('Nobody came', `You called, and nobody picked up. You wake in the Chill-Out Tent without the tank and $${loss} lighter.${settleWhip('backed')}`, 6000);
    }
    save();
  }
  function showdown() {
    const v = state.nos, a = allies(), war = v.route === 'heist';
    v.war = 0;
    talk(war ? [['Vinny', 'You. You took it right off my lot while I was sleepin’.'], ['Vinny', 'I ain’t even mad. I’m impressed. I’m also gonna take it back.']]
      : [['Vinny', 'There he is. The sandwich kid with the bottomless tank.'], ['Vinny', v.whipState === 'flipped' ? 'Whip sang, kid. Whole opera. I know what you paid.' : 'I counted my tanks, kid. Then I counted ’em again. You know what I found? Arithmetic.'],
        ['Vinny', 'So here’s how this goes. You hand it over and walk. Or you don’t.']], () => menu('Vinny, and four guys in tracksuits', [
      { label: 'Back down <small>give up the tank</small>', act: () => { v.arc = 'backed'; loseTank(); add('vibes', -0.15); card('You backed down', `The tank is gone. Vinny pats your cheek. "Smart kid." Sandwiches it is.${settleWhip('backed')}`, 5200); save(); } },
      { label: `Call your people and stand your ground <small>${a} of 4 will come</small>`, act: () => brawl(a) },
      ...(war ? [] : [{ label: 'Offer him a cut <small>needs Charisma level 4</small>', can: () => (level('charisma') >= 4 ? true : 'you cannot talk that well yet'),
        act: () => { v.arc = 'truce'; card('A truce', `"A dollar a balloon, off the top, and you stay polite." You shake on it. His hand is very cold.${settleWhip('truce')}`, 5200); gain('charisma', 6); save(); } }]),
    ]));
  }

  function vinnyTalk() {
    const v = state.nos, asleep = state.hour >= 3 && state.hour < 6;
    if (asleep) {
      menu('Vinny is asleep in his chair', [
        { label: 'Lift a tank from behind his stall <small>free, and it means war</small>', can: () => (v.tank ? 'you have a tank' : v.arc !== '' || v.side === 'ally' ? 'not after everything' : true), act: () => {
          if (Math.random() < 0.55 + (made('hoodie') ? 0.15 : 0)) {
            gotTank('heist'); v.heat = 90; v.stage = 2; v.war = total() + 3;
            card('You took it', 'Forty pounds of steel, carried at a dead run to your camp. Nobody shouted. He will know by breakfast.', 4200);
          } else {
            const loss = Math.round(state.cash * 0.4);
            state.cash -= loss; add('energy', -0.3); n.buzzkill = clamp(n.buzzkill + 0.4); v.grudge = true;
            getPlayer().root.position.set(0, 0, 3);
            card('A hand on your collar', `One of his guys was not asleep. You land in the Parking Lot $${loss} lighter. Vinny will remember this.`, 4600);
          }
        } },
        { label: 'Leave him be', act() {} },
      ]);
      return;
    }
    if (v.arc === 'won') { talk([['Vinny', 'You made your point, kid. Stay on your end of the lot.']]); return; }
    if (v.arc === 'truce') { talk([['Vinny', 'My dollar comes off the top. Pleasure doin’ business.']]); return; }
    const made1 = v.arc === 'made', each = made1 ? 3 : v.grudge ? 9 : 7;
    const shop = () => menu(made1 ? 'Vinny: family prices' : v.grudge ? 'Vinny: for you, 3 for $25' : 'Vinny: 3 for $20, no deals', [
      { label: 'One balloon <small>a short, silly head-rush</small>', cost: each, act: balloon },
      { label: 'Three balloons <small>for your bag</small>', cost: made1 ? 9 : v.grudge ? 25 : 20, can: () => (room('bag', 'balloons') >= 3 ? true : 'no room in your bag'), act: () => { give('balloons', 3); toast('"No refunds."'); } },
      ...(made1 ? [{ label: 'Ten balloons, wholesale <small>yours to sell at $7</small>', cost: 30, can: () => (room('bag', 'balloons') >= 10 ? true : 'no room in your bag'), act: () => { give('balloons', 10); toast('"Go make us look good."'); } }] : []),
      ...(v.side === '' && !v.tank && v.arc === '' && level('hustle') >= 3 && !v.grudge ? [{ label: 'Ask about work', act: () => talk([['Vinny', 'You can sell. I seen it. Sandwiches, but still.'], ['Vinny', 'I front you ten. You sell ’em at seven. Four a pop comes back to me, the rest is yours. Don’t make me come find you.']], () => { v.side = 'ally'; const fit = Math.min(10, room('bag', 'balloons')); give('balloons', fit); v.fronted = fit; toast(`${fit} balloons on the arm. Sell them for $7; $4 of each is Vinny’s.`); }) }] : []),
      ...(v.side === 'ally' && !made1 ? [
        { label: `Settle up <small>you owe him $${v.owed}</small>`, can: () => (v.owed <= 0 ? 'nothing owed' : state.cash < v.owed ? 'you do not have it' : true), act: () => {
          state.cash -= v.owed; v.owed = 0;
          if (v.allySold >= 20 && !v.leak) { v.leak = 1; if (!v.whip) v.whip = 1; talk([['Vinny', 'You’re good at this. So, a favour. I got a leak.'], ['Vinny', 'Somebody’s skimmin’ my gas. I count tanks, the count is wrong. Find me a name, kid. I look after people who look after me.']]); } else toast('"Square. I like square."');
        } },
        { label: 'Ten more on the arm', can: () => (v.owed > 0 ? 'settle up first' : room('bag', 'balloons') < 10 ? 'no room in your bag' : true), act: () => { give('balloons', 10); toast('"Seven each. Four to me."'); } },
        ...(v.leak === 1 ? [{ label: 'About your leak…', act: () => menu('Vinny wants a name', [
          { label: 'It is Whip <small>give him up</small>', can: () => (v.metWhip ? true : 'you have no name to give'), act: () => {
            v.arc = 'made'; v.leak = 2; v.whipState = 'gone'; state.cash += 60; state.trophies.mink = true; state.pal.friend = Math.max(0, state.pal.friend - 1); add('vibes', -0.1);
            card('Made', 'Vinny goes very still, then smiles. "$60 for your trouble. And the coat off my back." By morning Whip’s spot is empty. Moonbeam heard, and is not impressed.', 6200); save();
          } },
          { label: 'I found nothing', act: () => toast('"Keep lookin’. Somebody on this lot knows."') },
        ]) }] : []),
      ] : []),
    ]);
    if (!v.met) {
      v.met = true;
      talk([['Vinny', 'Three for twenty. No deals. No tabs. No "my buddy said".'], ['Vinny', 'You’re the kid who chased the naked guy. Cute. This end of the Street is mine, capisce?'],
        ['Vinny', 'You wanna sell sandwiches, sell sandwiches. Gas is a family business.']], shop);
    } else if (rival()) talk([['Vinny', v.heat > 60 ? 'Funny thing. My numbers are down and yours ain’t. We’ll talk soon.' : 'Kid. Sellin’ a lotta sandwiches lately?']], shop);
    else if (v.arc === 'backed') talk([['Vinny', 'Smart kid. Three for twenty.']], shop);
    else shop();
  }

  function whipTalk() {
    const v = state.nos;
    v.metWhip = true;
    if (v.side === 'ally' && v.arc === '') { // you work for Vinny
      if (v.leak !== 1) { talk([['Whip', 'You’re with HIM now? I never said nothin’. I was never here.']]); return; }
      talk([['Whip', 'Why’re you lookin’ at me like that. Why is he askin’ about tanks. Oh no. Oh no no no.']], () => menu('Whip is the leak', [
        { label: 'Warn him <small>and cross Vinny</small>', act: () => {
          v.whipState = 'fled'; v.leak = 2; v.owed = 0; gotTank('whip'); v.heat = 40; v.stage = 1;
          card('Whip runs', '"You’re a saint, kid. Take the tank, it’s by your tent, I can’t carry it where I’m goin’." He is over the fence in four seconds. You are in the gas business now, and Vinny will work out why.', 6200);
        } },
        { label: 'Say nothing and walk away', act: () => toast('He watches you all the way down the Street.') },
      ]));
      return;
    }
    if (v.whipState === 'grateful') { talk([['Whip', 'My guy! The corner king! Twenty-five a fill for you, forever.']], () => menu('Whip', [refill(25, 0), hireWhip()])); return; }
    if (v.arc === 'truce') { talk([['Whip', 'He’s got his dollar and he’s stopped countin’. Forty a fill. Keep it boring.']], () => menu('Whip', [refill(40, 0)])); return; }
    if (v.arc !== '') { talk([['Whip', v.arc === 'backed' ? 'You folded. I get it. I’d have folded. I got one more tank, if you ever grow a spine. Two hundred.' : 'I’m layin’ low. We’re square. Forget my face.']],
      v.arc === 'backed' ? () => menu('Whip', [{ label: 'Buy another tank <small>back in the game, and Vinny is already watching</small>', cost: 200, act: () => { v.arc = ''; gotTank('whip'); v.heat = 30; v.stage = 0; toast('"By your tent. Don’t fold this time."'); } }, { label: 'Walk away', act() {} }]) : undefined); return; }
    if (!v.tank) {
      talk([['Whip', 'Psst. Sandwich kid. I seen you work. You got hands.'], ['Whip', 'Vinny takes the lion’s share and I do the liftin’. So I got a tank he don’t count. Scuba size. Thirty fills.'],
        ['Whip', 'A hundred and twenty. And you never met me.']], () => menu('Whip (Nitrous Mafia, allegedly)', [
        { label: 'Buy the tank <small>30 fills, left at your camp</small>', cost: 120, act: () => { gotTank('whip'); v.whip = 2; toast('"It’ll be under your YOUR CAMP sign before you are. Go."'); } },
        { label: 'Walk away', act: () => toast('"Offer stands. Don’t look at me."') },
      ]));
      return;
    }
    if (v.squeeze && v.whipState === 'ok') { // Vinny's men have been leaning on him
      talk([['Whip', 'They had me against the porta-potties, man. "Where’s the gas goin’, Whip." I said rats. RATS.'], ['Whip', 'I can’t do this. You gotta help me or I gotta think about me.']], () => menu('Whip is being squeezed', [
        { label: 'Pay for him to lie low <small>he stays loyal; refills raise less heat</small>', cost: 40, act: () => { v.whipState = 'protected'; toast('"You’re good people. I won’t forget it."'); gain('charisma', 2); } },
        { label: 'Cut him loose <small>no more refills from him; some heat comes off</small>', act: () => { v.whipState = 'cut'; v.heat = Math.max(0, v.heat - 15); v.flipLater = Math.random() < 0.4; toast('"Yeah. Yeah, okay. Good luck, I guess."'); } },
        { label: 'Lean on him <small>cheaper refills, and he will hate you</small>', act: () => { v.whipState = 'leaned'; toast('"…Fine. Twenty-five a fill. You’re as bad as him."'); } },
      ]));
      return;
    }
    if (v.whipState === 'cut') { talk([['Whip', 'We’re done, remember? Don’t stand near me.']]); return; }
    talk([['Whip', v.reups === 0 ? 'Back already? Keep your voice down.' : v.whipState === 'leaned' ? 'Take it and go.' : v.heat > 50 ? 'Vinny’s been askin’ questions, man. Every refill, he counts again.' : 'Quick. In and out.']],
      () => menu('Whip', [refill(v.whipState === 'leaned' ? 25 : 40, v.whipState === 'protected' ? 8 : 15)]));
  }
  const refill = (cost, warmth) => ({ label: 'Refill the tank <small>back to 30 fills. Every refill widens the leak</small>', cost, can: () => (!state.nos.tank ? 'you have no tank' : state.nos.fills >= 30 ? 'the tank is full' : true),
    act: () => { const v = state.nos; v.fills = 30; v.reups++; toast(v.reups === 1 ? '"That’s one. He notices by three."' : '"Go. GO."'); heat(warmth); } });

  // The clean way in, at the lot office: a tank from a welding supplier in town. No Whip. Vinny still notices once you sell.
  function officeExtras() {
    const v = state.nos, morning = () => (state.hour < 8 ? state.day * 24 + 8 : (state.day + 1) * 24 + 8);
    if (['backed', 'made'].includes(v.arc) || v.side === 'ally') return [];
    return [
      ...(!v.tank ? [{ label: 'Order a gas tank from town <small>a welding supplier; at your camp tomorrow morning</small>', cost: 220, can: () => (v.order ? 'already on its way' : v.met ? true : 'what would you want one of those for?'), act: () => { v.order = morning(); toast('"Welding, is it? Sure. Tomorrow, eight o’clock, your camp."'); } }]
        : [{ label: 'Order a refill from town <small>tomorrow morning; no questions, no Whip</small>', cost: 60, can: () => (v.refillAt ? 'already on its way' : v.fills >= 30 ? 'the tank is full' : true), act: () => { v.refillAt = morning(); toast('"Lot of welding. Tomorrow at eight."'); } }]),
    ];
  }
  // Who will fill your tank depends on how things stand with Whip.
  function whereToRefill() {
    const v = state.nos, whipFills = whipAround() && v.whipState !== 'cut' && !(v.side === 'ally' && v.arc === '');
    const whipCost = v.whipState === 'grateful' || v.whipState === 'leaned' ? 25 : 40;
    const town = ['backed', 'made'].includes(v.arc) ? '' : 'the lot office orders one from town for $60, there by 8 AM';
    return [whipFills ? `Whip, behind the Costume Shop, for $${whipCost}` : '', town].filter(Boolean).join('; or ') || 'nobody will fill it now';
  }
  function tankMenu() {
    const v = state.nos;
    menu(`Your tank (${v.fills} of 30 fills) · selling at $${v.price}`, [
      ...(v.fills < 5 ? [{ label: `Where to refill <small>${whereToRefill()}</small>`, can: () => 'the tank is nearly empty', act() {} }] : []),
      { label: 'Fill five balloons for your bag', stay: true, can: () => (v.fills < 5 ? 'nearly empty' : room('bag', 'balloons') < 5 ? 'no room in your bag' : true), act: fillFive },
      { label: 'Fill one for yourself', can: () => (v.fills < 1 ? 'empty' : true), act: () => { v.fills--; balloon(); } },
      { label: 'Set your price <small>$4 undercuts Vinny and he notices; $7 is quiet and slow</small>', act: () => menu('Your price for a balloon', [4, 5, 7].map((d) => ({ label: `$${d} <small>${{ 4: 'sells fast, heat rises fast', 5: 'the going rate', 7: 'above Vinny’s price: slow, and half the heat' }[d]}</small>`, act: () => { v.price = d; toast(`Balloons at $${d}.`); } }))) },
      { label: 'Hide it in your wheeled cooler <small>fill balloons anywhere; far less heat while you tow it</small>', can: () => (v.rig ? 'already in there' : state.gear.cooler < 3 ? 'needs the cooler with wheels' : state.towing ? 'bring the cooler back to camp first' : true), act: () => { v.rig = true; toast('The tank is under the ice. Take the cooler with you and press B to fill five.'); } },
    ]);
  }
  function nosTick(hours, camp) {
    const v = state.nos;
    state.body = Math.min(1, state.body + hours * 0.12);
    if (!v.whip && v.met && level('hustle') >= 3 && !v.tank && v.arc === '') { v.whip = 1; toast('A twitchy guy behind the Costume Shop keeps looking at you.'); }
    if (v.order && total() >= v.order) { v.order = 0; gotTank('legit'); toast('A tank from town is standing under your YOUR CAMP sign.'); }
    if (v.refillAt && total() >= v.refillAt) { v.refillAt = 0; if (v.tank) { v.fills = 30; toast('Your tank has been refilled from town.'); } }
    if (!rival()) return;
    v.heat = Math.min(100, v.heat + hours * (v.sold ? 0.5 : 0)); // once you have sold, it never stops; you only choose how fast
    if (v.sabotage && camp && !discreet()) {
      v.sabotage = false; v.fills = Math.floor(v.fills / 2); state.canMove = false;
      card('Somebody was at your tank', 'The valve is cracked open and half the gas is gone. A note is taped to it: LAST WARNING.', 3800, () => { state.canMove = true; });
    } else if ((v.heat >= 100 && v.stage < 3) || (v.war && total() >= v.war)) { v.stage = 3; showdown(); }
  }

  // ---- the garden: up to six plots, four crops. What you grow goes into what you cook.
  const { crops: CROPS, fillings: FILLINGS, grown: GROWN, wild: WILD } = DATA;
  const SERUM = DATA.serum || { cost: 10, perJob: 1 };
  const fx = (k) => total() < state.fx[k]; // is an effect still running?
  const landPlots = () => [0, 1, 2, 4, 6][state.gear.land];
  function plots() {
    while (state.plots.length < landPlots()) state.plots.push({ crop: null, wet: false, start: 0, ready: 0 });
    return state.plots;
  }
  const growHours = (crop) => CROPS[crop].hours * (made('compost') ? 0.75 : 1);
  const wetPlot = (p) => { p.wet = true; p.start = total(); p.ready = total() + growHours(p.crop); };
  const waterOnHand = () => state.bag.bottles + state.water;
  const takeWater = () => { if (state.bag.bottles) state.bag.bottles--; else state.water--; };
  const plotState = (p) => (!p.crop ? 'empty' : !p.wet ? 'dry' : total() < p.ready ? 'growing' : 'ready');
  function gardenLabel() {
    const ps = plots(), c = { empty: 0, dry: 0, growing: 0, ready: 0 };
    for (const p of ps) c[plotState(p)]++;
    const bits = [c.ready ? `${c.ready} ready to harvest` : '', c.dry ? `${c.dry} need${c.dry === 1 ? 's' : ''} water` : '', c.growing ? `${c.growing} growing` : '', c.empty ? `${c.empty} empty` : ''].filter(Boolean);
    return `Your garden: ${bits.join(', ')}`;
  }
  function gardenMenu() {
    const ps = plots(), dry = ps.filter((p) => plotState(p) === 'dry'), need = made('can') ? 1 : dry.length;
    const opts = ps.map((p, i) => {
      const s = plotState(p), name = p.crop ? CROPS[p.crop].name : '';
      if (s === 'empty') {
        return { label: `Plot ${i + 1}: empty <small>plant something</small>`, can: () => (Object.values(CROPS).some((c) => have(c.seed) > 0) ? true : 'no seeds: the General Store sells them'), act: () => menu(`Plant plot ${i + 1}`,
          Object.entries(CROPS).filter(([, c]) => have(c.seed) > 0).map(([k, c]) => ({ label: `${c.name} <small>${c.hours} hours, gives ${c.yield}</small>`, act: () => {
            spend(c.seed, 1); p.crop = k; p.wet = false;
            if (state.weather.rain) wetPlot(p);
            toast(p.wet ? `${c.name} planted, and the rain is watering them.` : `${c.name} planted. They will not grow until you water them.`); gardenMenu();
          } }))) };
      }
      if (s === 'dry') return { label: `Plot ${i + 1}: ${name} <small>needs water</small>`, can: () => (waterOnHand() ? true : 'bring a water bottle, or fill your cooler'), act: () => { takeWater(); wetPlot(p); toast(`Watered. ${name} in about ${Math.ceil(growHours(p.crop))} hours.`); gardenMenu(); } };
      if (s === 'growing') return { label: `Plot ${i + 1}: ${name} <small>about ${Math.ceil(p.ready - total())} h left${have('serum') ? ` · pour grow serum (you have ${have('serum')})` : ''}</small>`, can: () => (have('serum') ? true : 'growing'),
        act: () => { spend('serum', 1); p.ready = total(); sfx('build'); toast(`The ${name.toLowerCase()} shoot up while you watch. Ready to harvest.`); gardenMenu(); } };
      return { label: `Plot ${i + 1}: harvest the ${name.toLowerCase()}${p.left ? ` <small>${p.left} still on the plant</small>` : ''}`, act: () => {
        const c = CROPS[p.crop], due = p.left || c.yield, left = stow(c.item, due);
        if (left === due) { toast(`No room for ${ITEMS[c.item].name.toLowerCase()} in your bag, stash or cabinet. They will keep on the plant until you make space.`); gardenMenu(); return; }
        if (left) { p.left = left; if (FILLINGS.find((f) => f.item === c.item)) state.recipes[c.item] = true; toast(`${due - left} ${ITEMS[c.item].name.toLowerCase()} picked. No room for the other ${left}: they will keep on the plant.`); gardenMenu(); return; }
        if (p.crop === 'herbs') state.chain.stats.herbs++;
        p.crop = null; p.wet = false; p.left = 0;
        const filling = FILLINGS.find((f) => f.item === c.item);
        toast(`${due} ${ITEMS[c.item].name.toLowerCase()}.${filling && !state.recipes[c.item] ? ` New sandwich: ${filling.name}.` : ''}`);
        if (filling) state.recipes[c.item] = true;
        gain('wellness', 2); gardenMenu();
      } };
    });
    if (dry.length > 1) opts.push({ label: `Water everything <small>${made('can') ? 'one water, with the watering can' : `${dry.length} waters`}</small>`, can: () => (waterOnHand() >= need ? true : 'not enough water on you'),
      act: () => { for (let i = 0; i < need; i++) takeWater(); dry.forEach(wetPlot); toast('Everything is watered.'); gardenMenu(); } });
    menu(`Your garden (${ps.length} plot${ps.length > 1 ? 's' : ''})`, opts);
  }

  // ---- the field journal: a page per mushroom. Found, checked, spore-printed: then you never get it wrong again.
  const SPECIES = { ...GROWN, ...WILD };
  const page = (k) => state.journal[k] || (state.journal[k] = { found: false, tell: false, print: false, where: '' });
  const pageDone = (k) => { const p = state.journal[k]; return !!p && p.found && p.tell && (p.print || !!WILD[k]?.poison || !!GROWN[k]); };
  function note(k, field, where) {
    const p = page(k), was = pageDone(k);
    if (field === 'found' && !p.found) { p.where = where || ''; toast(`New journal page: ${SPECIES[k].name}. Press J.`); }
    p[field] = true;
    if (!was && pageDone(k)) {
      gain('wellness', 4);
      levelUp(`Journal: ${SPECIES[k].name}`, `Page complete. ${SPECIES[k].use}`);
      if (k === 'ghostcap') state.points++;
      const set = (keys, id) => { if (!state.sets[id] && keys.every(pageDone)) { state.sets[id] = true; state.points++; toast('A whole section of the journal is complete. +1 skill point.'); } };
      set(Object.keys(GROWN), 'grown'); set(Object.keys(WILD), 'wild');
    }
  }
  const nextMorning = () => (state.hour < 6 ? state.day * 24 + 6 : (state.day + 1) * 24 + 6);
  let jPick = null;
  function drawJournal() {
    const card = (k) => { const p = state.journal[k], s = SPECIES[k], seen = p && p.found; return `<button class="jcard${jPick === k ? ' on' : ''}${seen ? '' : ' unknown'}" data-j="${k}">${seen ? `<img src="./assets/journal/${k}.jpg" alt="">` : '<span class="q">?</span>'}<b>${seen ? s.name : '???'}</b><i>${pageDone(k) ? 'complete' : seen ? `${[p.found, p.tell, p.print || !!s.poison || !!GROWN[k]].filter(Boolean).length} of 3` : ''}</i></button>`; };
    let detail = '<p class="hint">A page starts when you grow or find a mushroom. Check it and take a spore print to finish the page.</p>';
    if (jPick && state.journal[jPick] && state.journal[jPick].found) {
      const p = state.journal[jPick], s = SPECIES[jPick], wild = WILD[jPick];
      const canPrint = wild && !wild.poison && p.tell && !p.print && !state.prints[jPick];
      detail = `<div class="jdetail"><img src="./assets/journal/${jPick}.jpg" alt=""><div><b>${s.name}</b>${pageDone(jPick) ? ' <small>page complete</small>' : ''}<br>
        <small>${wild ? `${wild.looks}. Found ${p.where || 'on the grounds'}.` : `Grown on ${s.on}, ${s.hours} hours.`}</small><br>
        <small><b>The tell:</b> ${p.tell ? (wild ? wild.tell : 'You grew it yourself. No doubt about this one.') : (wild && wild.check === 'cut' ? 'not checked yet. Cut one open.' : 'not checked yet. Look underneath one.')}</small><br>
        <small><b>Use:</b> ${pageDone(jPick) || GROWN[jPick] ? s.use : 'finish the page to be sure.'}</small>
        ${state.prints[jPick] ? '<br><small>A spore print is drying at camp. Ready by morning.</small>' : ''}
        ${canPrint ? `<br><button data-print="${jPick}" ${atCamp() && have(jPick) ? '' : 'disabled'}>Take a spore print <small>${!atCamp() ? 'at your camp' : !have(jPick) ? 'you need one to hand' : 'uses one; ready by morning'}</small></button>` : ''}</div></div>`;
    }
    const done = Object.keys(SPECIES).filter(pageDone).length;
    $('bagpanel').innerHTML = `<h3 class="comix">Field journal <small>${done} of ${Object.keys(SPECIES).length} pages complete</small></h3>
      <h4>Grown at camp</h4><div class="jgrid">${Object.keys(GROWN).map(card).join('')}</div>
      <h4>Found in the wild</h4><div class="jgrid">${Object.keys(WILD).map(card).join('')}</div>${detail}<div class="next">J or Esc to close</div>`;
  }
  function journalClick(b) {
    if (b.dataset.j) jPick = b.dataset.j;
    else if (b.dataset.print) { const k = b.dataset.print; spend(k, 1); state.prints[k] = nextMorning(); toast('Cap down on a sheet of paper, under a cup. Ready by morning.'); }
    drawJournal();
  }

  // ---- growing mushrooms at camp: a culture is bought or earned once, then replanted for nothing
  const shroomSlots = () => [0, 0, 2, 4][state.gear.myco];
  function mycoMenu() {
    while (state.shrooms.length < shroomSlots()) state.shrooms.push(null);
    const owned = Object.keys(GROWN).filter((k) => state.cultures[k]);
    const opts = state.shrooms.map((s, i) => {
      if (!s) return { label: `Spot ${i + 1}: empty <small>start a culture</small>`, can: () => (owned.length ? true : 'no cultures: the General Store has oyster spawn; the Village Elder has the rest'), act: () => menu(`Start spot ${i + 1}`,
        owned.map((k) => ({ label: `${GROWN[k].name} <small>${GROWN[k].hours} hours, on ${GROWN[k].on}</small>`, act: () => { state.shrooms[i] = { k, start: total(), ready: total() + GROWN[k].hours }; toast(`${GROWN[k].name} started. Keep it dark and leave it alone.`); mycoMenu(); } }))) };
      if (total() < s.ready) return { label: `Spot ${i + 1}: ${GROWN[s.k].name} <small>about ${Math.ceil(s.ready - total())} h left</small>`, can: () => 'growing', act() {} };
      return { label: `Spot ${i + 1}: harvest the ${GROWN[s.k].name.toLowerCase()}`, act: () => {
        const g = GROWN[s.k], due = s.left || g.yield, left = stow(s.k, due);
        if (left === due) { toast(`No room for ${g.name.toLowerCase()} in your bag, stash or cabinet. They will keep where they are until you make space.`); mycoMenu(); return; }
        if (left) { s.left = left; toast(`${due - left} ${g.name.toLowerCase()} picked. No room for the other ${left}: they will keep.`); mycoMenu(); return; }
        state.shrooms[i] = null;
        toast(`${due} ${g.name.toLowerCase()}. ${g.use}`);
        if (s.k === 'oyster') state.recipes.oyster = true;
        note(s.k, 'found', 'at your own camp'); note(s.k, 'tell');
        gain('wellness', 2); mycoMenu();
      } };
    });
    menu(`Your mushroom shelf (${shroomSlots()} spots)`, opts);
  }
  // The Elder keeps the cultures the General Store does not. Called from his conversation after the first.
  function elderShop() {
    if (elderReckoning()) return;
    const opts = Object.entries(GROWN).filter(([, g]) => g.source === 'elder').map(([k, g]) => ({ label: `${g.name} culture <small>${g.use}</small>`, cost: g.cost, can: () => (state.cultures[k] ? 'you have it' : true), act: () => { state.cultures[k] = true; toast(`${g.name} culture. Grow it on your mushroom shelf at camp.`); } }));
    opts.push({ label: 'Ask about the golden caps', can: () => (state.cultures.goldcap ? 'he has taught you' : level('wellness') >= 3 ? true : 'he is not sure you are steady enough yet (Wellness 3)'), act: () => talk([
      ['Village Elder', 'Those are not a party. They are a conversation, and you do not get to pick the subject.'],
      ['Village Elder', 'So you choose the room. Somewhere kind: here, or your own camp. Fed. Watered. Feeling well. And somebody you trust within arm’s reach.'],
      ['Village Elder', 'Get that right and they will show you something. Get it wrong on Shakedown Street at midnight and you will want your mother. One handful. Once a day. Here is a start.'],
    ], () => { state.cultures.goldcap = true; toast('Golden cap culture. A tub in the dark of your tent, sixteen hours.'); gain('wellness', 3); }) });
    if (have('ghostcap') && !state.sets.ghostShown) opts.push({ label: 'Show him the ghost cap', act: () => { state.sets.ghostShown = true; add('vibes', 0.2); toast('"In forty years I have seen three." He holds it up to the light for a long time.'); gain('charisma', 6); } });
    menu('The Elder’s jars', opts);
  }

  // ---- what the mushrooms do
  const TRIPPY = ['The grass is breathing. It has always been breathing.', 'Somebody’s tie-dye is explaining itself to you.', 'You understand the totem pole now. You will not be able to explain it later.',
    'Moonbeam’s laugh has a colour.', 'Every tent is the same tent.', 'A stranger nods at you. You both know.'];
  function trip() {
    if (state.fx.tripDay === state.day) { toast('Not twice in a day. That was the rule.'); return false; }
    state.fx.tripDay = state.day;
    const p = getPlayer().root.position, zone = zoneAt(p.x, p.z), home = atCamp() || zone === 'Healing Village';
    const sitter = (atCamp() && state.pal.friend >= 2) || (zone === 'Healing Village' && state.village.elder);
    const score = (home ? 2 : zone === 'Shakedown Street' ? -2 : 0) + (state.vibes > 0.6 ? 1 : state.vibes < 0.35 ? -1 : 0) + (n.hydration > 0.4 && n.nourishment > 0.4 ? 1 : -1) + (sitter ? 1 : 0) - (rival() && state.nos.heat > 60 ? 1 : 0);
    if (score >= 3) {
      state.fx.trip = total() + 2; state.vibes = 1; state.points++; state.vision = true; n.buzzkill = 0;
      card('A good one', 'The colours start to breathe. Somebody kind is nearby, and for a while everything on this lot makes sense. +1 skill point. The Vision Quest is open: press K.', 5200);
      gain('wellness', 6);
    } else if (score >= 1) {
      state.fx.trip = total() + 1; add('vibes', 0.2);
      card('A gentle one', 'Colours a little brighter, jokes a little funnier. The setting was only half right, so that is all you get.', 3800);
    } else {
      const held = state.pal.friend >= 2;
      state.canMove = false; add('vibes', held ? -0.2 : -0.5); state.body = clamp(state.body - 0.3); pass(held ? 1 : 3); gfx.setTime(state.hour);
      card('The Spiral', held ? 'Wrong place, wrong time. It turns on you, until Moonbeam finds you and sits with you and tells you it ends. It does.' : 'Wrong place, wrong time, and nobody to sit with you. Three hours of it. You will choose the room next time.', 5600, () => { state.canMove = true; });
    }
    return true;
  }
  function useShroom(k) {
    const b = state.bag;
    if (!b[k]) return;
    if (k === 'lionsmane') { b[k]--; state.fx.clear = total() + 4; toast('Clear Head tea. For four hours you learn faster, read people, and time slows when it matters.'); }
    else if (k === 'reishi') { b[k]--; state.fx.soul = total() + 24; toast('Old Soul tea. Bitter as bark. Nothing can put you on the floor today.'); }
    else if (k === 'cordyceps') { b[k]--; state.fx.zombie = total() + 1; toast('Zombie Legs. Run. You will pay for it in an hour.'); }
    else if (k === 'turkeytail') { b[k]--; state.fx.broth = total() + 24; toast('Iron broth. Rain, cold and bad mushrooms can do nothing to you today.'); }
    else if (k === 'puffball') { b[k]--; state.fx.smoke = total() + 1; n.buzzkill = clamp(n.buzzkill - 0.3); toast('PUFF. A brown cloud, a lot of coughing, and you are somewhere else.'); sfx('pick'); }
    else if (k === 'chicken') { b[k]--; add('nourishment', 0.6); toast('Tastes like chicken. It really does.'); }
    else if (k === 'foxfire') { if (!atCamp()) { toast('Set glow jars out at your camp. Carried, they show you wild mushrooms at night.'); return; } if (state.glow >= 4) { toast('Four glow jars is plenty.'); return; } b[k]--; state.glow++; toast('A glow jar. Your camp has light that needs no power.'); }
    else if (k === 'goldcap') { if (trip()) b[k]--; }
    else if (k === 'sage') { b[k]--; add('vibes', 0.06); n.buzzkill = clamp(n.buzzkill - 0.1); toast('You burn a little sage. The air settles.'); }
  }
  // A filling you picked may not be what you thought it was.
  function badFilling(item) {
    const bad = state.fakes[item] || 0, all = have(item);
    if (!bad || Math.random() >= bad / Math.max(all, bad)) return false;
    state.fakes[item] = bad - 1;
    if (!fx('broth')) { state.body = clamp(state.body - 0.2); add('nourishment', -0.15); }
    const one = SPECIES[item] ? SPECIES[item].name.toLowerCase() : item;
    toast(fx('broth') ? `That was not a ${one}. The broth saves you; the sandwich goes in the bin.` : `That was not a ${one}. One taste and you feel ill. The sandwich goes in the bin.`);
    return true;
  }

  // ---- foraging: wild mushrooms come up around the grounds, most of them the morning after rain
  let seed = 11;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const SPOTS = [
    ...groves.slice(0, 22).map(([x, z]) => { const a = rnd() * 6.28; return { x: x + Math.cos(a) * 2.2, z: z + Math.sin(a) * 2.2, habitat: 'oaks', where: 'under the big trees' }; }),
    ...Array.from({ length: 8 }, () => ({ x: -16 + rnd() * 70, z: -157 - rnd() * 3, habitat: 'river', where: 'on the river bank' })),
    ...Array.from({ length: 8 }, () => ({ x: 28 + rnd() * 30, z: -136 + rnd() * 40, habitat: 'grass', where: 'in the open grass past the Campgrounds' })),
  ];
  const LOOK = { chanterelle: [0xf2a61c, 0.9], jack: [0xf28c1c, 1], morel: [0x8a5a2b, 0.9], falsemorel: [0x8a4a2b, 0.95], chicken: [0xff8c1a, 1.5], puffball: [0xf5f1e6, 1.3], turkeytail: [0x9c7a5a, 1.1], ghostcap: [0xdff7ff, 0.7] };
  const rainedLately = () => total() - state.rainedAt < 14;
  function growWild(night) {
    const wet = rainedLately(), taken = new Set(state.wild.map((w) => w.s));
    if (!night) state.wild = state.wild.filter((w) => WILD[w.k].when !== 'night'); // night species are gone by morning
    SPOTS.forEach((spot, s) => {
      if (taken.has(s) || state.wild.length >= wildMeshes.length || Math.random() > (wet ? 0.4 : 0.2)) return;
      const pool = Object.entries(WILD).filter(([, w]) => w.habitat === spot.habitat && (!w.afterRain || wet) && (w.when === 'any' || w.when === (night ? 'night' : 'day')));
      let roll = Math.random() * pool.reduce((a, [, w]) => a + w.weight, 0);
      const hit = pool.find(([, w]) => (roll -= w.weight) < 0);
      if (hit) state.wild.push({ s, k: hit[0] });
    });
  }
  const nearWild = (p) => state.wild.find((w) => Math.hypot(SPOTS[w.s].x - p.x, SPOTS[w.s].z - p.z) < 1.7);
  // You know a mushroom on sight once its page is complete, or its lookalike's, or with a clear head.
  const knows = (k) => fx('clear') || pageDone(k) || (WILD[k].fakes && pageDone(WILD[k].fakes)) || Object.entries(WILD).some(([o, w]) => w.fakes === k && pageDone(o));
  function forage() {
    const w = nearWild(getPlayer().root.position);
    if (!w) return;
    const sp = WILD[w.k], where = SPOTS[w.s].where;
    const leave = () => { note(w.k, 'found', where); note(w.k, 'tell'); toast(`${sp.name}. ${sp.tell} Poisonous: you leave it.`); state.wild = state.wild.filter((x) => x !== w); };
    const pick = (sure) => {
      const item = sp.poison ? sp.fakes : w.k, amount = sp.poison ? 2 : sp.yield;
      if (room('bag', item) < 1) { toast('Your bag is full.'); return; }
      give(item, amount);
      if (sp.poison) state.fakes[item] = (state.fakes[item] || 0) + amount; // you think it is the good one
      note(item, 'found', where); if (sure && !sp.poison) note(w.k, 'tell');
      if (!sp.poison && FILLINGS.some((f) => f.item === item)) state.recipes[item] = true;
      state.wild = state.wild.filter((x) => x !== w);
      toast(`You pick ${amount > 1 ? 'a couple' : 'it'}: ${sure ? sp.name.toLowerCase() : sp.looks.toLowerCase()}.`); sfx('pick'); gain('wellness', 1);
    };
    if (knows(w.k)) { if (sp.poison) leave(); else pick(true); return; }
    menu(sp.looks, [
      { label: sp.check === 'cut' ? 'Cut one open' : 'Look underneath', act: () => { if (sp.poison) leave(); else { note(w.k, 'found', where); note(w.k, 'tell'); toast(`${sp.tell} Good to pick.`); pick(true); } } },
      { label: 'Pick it as it is <small>if you are sure</small>', act: () => pick(false) },
      { label: 'Leave it', act() {} },
    ]);
  }
  function wildTick() {
    const night = state.hour >= 21 || state.hour < 6, id = (state.hour < 6 ? state.day - 1 : state.day) * 2 + (night ? 1 : 0);
    if (id !== state.wildDone) { state.wildDone = id; growWild(night); } // a fresh flush each morning and each night
    for (const [k, t] of Object.entries(state.prints)) if (total() >= t) { delete state.prints[k]; note(k, 'print'); }
    const dark = state.hour >= 20.5 || state.hour < 5.5, lit = state.bag.foxfire > 0 || fx('trip');
    wildMeshes.forEach((m, i) => {
      const w = state.wild[i];
      m.visible = !!w;
      if (!w) return;
      const [colour, size] = LOOK[w.k], glows = dark && (w.k === 'jack' || w.k === 'ghostcap' || lit);
      m.position.set(SPOTS[w.s].x, 0, SPOTS[w.s].z); m.scale.setScalar(size);
      m.userData.cap.color.setHex(colour); m.userData.cap.emissive.setHex(glows ? (w.k === 'ghostcap' ? 0x9fe8ff : w.k === 'jack' ? 0x3cff7a : 0x2a8a4a) : 0x000000);
    });
  }


  // ---- litter: cans and cups in the grass. They come back after a while.
  const nearLitter = (p) => litter.findIndex((l, i) => (state.litter[i] || 0) <= total() && Math.hypot(l.x - p.x, l.z - p.z) < 1.6);

  // ---- the cash tin in your tent: move any amount either way
  function cashMenu() {
    const move = (amount) => { state.cash -= amount; state.stash += amount; cashMenu(); };
    const put = (label, amount) => ({ label: `Stash ${label}`, can: () => (amount > 0 && state.cash >= amount ? true : 'not enough in your pocket'), act: () => move(amount) });
    const take = (label, amount) => ({ label: `Take ${label}`, can: () => (amount > 0 && state.stash >= amount ? true : 'not enough stashed'), act: () => move(-amount) });
    menu(`Cash: $${state.cash} in your pocket, $${state.stash} in the tent`, [
      put('$5', 5), put('$20', 20), put(`half ($${Math.floor(state.cash / 2)})`, Math.floor(state.cash / 2)), put(`all ($${state.cash})`, state.cash),
      take('$5', 5), take('$20', 20), take(`half ($${Math.floor(state.stash / 2)})`, Math.floor(state.stash / 2)), take(`all ($${state.stash})`, state.stash),
    ]);
  }

  // ---- the camp kitchen: put the sign up and people nearby walk over and order. You serve them, or Moonbeam does.
  const KITCHEN = { queue: 4, gap: [0.1, 0.3], rush: 0.6, premium: 1, tip: 1, mix: [0.2, 0.6] }; // tuned with dev/bot.js: queue length, game hours between customers, how much faster at mealtimes, dollars over the sandwich's price, the tip when someone gets the named sandwich they asked for, the order mix. The order mix is (below the first number: anything; below the second: plain; the rest: a named sandwich off today's board)
  // What a customer asks for: 'any' (whatever is hot), 'plain' (a golden grilled cheese) or a filling, meaning the sandwich named after it.
  const asks = (want) => (want === 'any' ? 'whatever is hot' : want === 'plain' ? 'a golden grilled cheese ($3 or better)' : `a ${sandwichName(want)}`);
  const meets = (s, want) => (want === 'any' ? s.p >= 2 : want === 'plain' ? s.p >= 3 : s.f.includes(want));
  // Today's board: plain grilled cheese, plus every named sandwich sitting cooked on the counter. People order what they can see.
  const board = (pools) => FILLINGS.filter((f) => pools.some((pool) => pool.some((s) => s.f.includes(f.item))));
  const kitchenReady = () => (!made('sign') ? 'build a hand-painted sign at your workbench' : state.gear.stove < 6 ? 'needs the flat-top griddle' : state.gear.land < 3 ? 'needs four garden plots' : true);
  const hired = (job) => state.kitchen.hire.job === job && total() < state.kitchen.hire.until;
  const working = () => total() < state.kitchen.hire.until;
  const queueSpot = (i) => [COUNTER[0] + 1.25 + i * 0.95, COUNTER[1] + (i % 2 ? 0.25 : -0.1)]; // a line straight out from the front of the counter
  function leaveQueue(q) { crowd.release(q.i); state.kitchen.queue = state.kitchen.queue.filter((x) => x !== q); }
  function closeKitchen(quiet) { const k = state.kitchen; k.open = false; for (const q of [...k.queue]) leaveQueue(q); if (!quiet) toast('Sign down. The kitchen is closed.'); }
  function serve(q, byPal) {
    const k = state.kitchen, f = people[q.i];
    // The sandwich that meets the order with the fewest fillings, then the cheapest, so the special ones are kept for whoever asks for them.
    // With nothing that meets it: the best plain one, or failing that the cheapest filled one.
    let best = null;
    for (const pool of byPal ? [state.store.cheese, state.pantryCheese] : [state.cheese, state.store.cheese, state.pantryCheese]) pool.forEach((s, idx) => {
      if (s.p < 2) return;
      const ok = meets(s, q.want), rank = ok ? s.f.length * 100 + s.p : s.f.length ? 100 + s.p : -s.p;
      if (!best || (ok && !best.ok) || (ok === best.ok && rank < best.rank)) best = { pool, idx, price: s.p, ok, rank, f: s.f };
    });
    if (!best) { if (!byPal) toast('You have nothing cooked to give them. They wander off.'); else state.pal.act = { kind: 'sorry', at: state.t }; k.walked++; leaveQueue(q); return; }
    if (!best.ok && Math.random() < 0.5) { if (!byPal) toast(`"I wanted ${asks(q.want)}." They wander off.`); k.walked++; leaveQueue(q); return; }
    best.pool.splice(best.idx, 1);
    if (!best.ok) k.wrong = (k.wrong || 0) + 1;
    const named = best.ok && q.want !== 'any' && q.want !== 'plain';
    const pay = best.price + (byPal ? 0 : KITCHEN.premium) + (named ? KITCHEN.tip : 0); // served by you, at your own counter: a dollar more than on foot. A named order met: a tip, whoever serves it
    if (byPal) { state.pal.act = { kind: 'serve', at: state.t }; state.pal.held = (state.pal.held || 0) + pay; state.pal.told = false; k.palSold++; k.palTake += pay; } // Moonbeam keeps the takings in his apron until you come and collect
    else { state.cash += pay; gain('hustle', 2); add('vibes', 0.015); sfx('coin'); toast(`+$${pay} for a ${sandwichName(best.f[0])}. ${named ? `Just what they ordered: $${KITCHEN.tip} tip.` : best.ok ? 'Just what they ordered.' : 'Not what they asked for, but they took it.'}`); }
    state.sold++; k.served++; if (f) { f.next = total() + 3; f.appetite = Math.random() * 0.4; }
    leaveQueue(q);
  }
  // Who E serves: from behind the counter, whoever has waited longest; anywhere else, a waiting customer you are standing next to.
  const atCounter = (p) => made('sign') && Math.hypot(p.x - COUNTER[0], p.z - COUNTER[1]) < 2.6;
  const nearOrder = (p) => {
    const waiting = state.kitchen.queue.filter((q) => q.at && people[q.i]);
    if (atCounter(p)) return waiting.sort((a, b) => a.at - b.at)[0];
    return waiting.find((q) => Math.hypot(people[q.i].x - p.x, people[q.i].z - p.z) < 2.3);
  };
  let servedT = -9; // E serves and E opens the counter menu, so the menu stays shut while anyone is queueing and for a moment after a sale
  function tendGarden() {
    let did = 0;
    for (const p of plots()) {
      const s = plotState(p);
      if (s === 'dry') { wetPlot(p); did++; }
      else if (s === 'ready') {
        const crop = p.crop, c = CROPS[crop];
        const due = p.left || c.yield, shelf = pantryKinds().includes(c.item) ? Math.min(due, pantryRoom(c.item)) : 0; // fillings go in the produce cabinet; the rest, and the overflow, into your camp stash
        const stashed = Math.max(0, Math.min(due - shelf, room('store', c.item)));
        if (shelf) state.pantry[c.item] = (state.pantry[c.item] || 0) + shelf;
        state.store[c.item] += stashed;
        if (shelf + stashed < due) { p.left = due - shelf - stashed; if (shelf + stashed) did++; continue; } // no room for all of it: the rest stays on the plant, and nothing is replanted over it
        p.left = 0;
        if (FILLINGS.find((x) => x.item === c.item)) state.recipes[c.item] = true;
        p.crop = null; p.wet = false;
        if (have(c.seed) > 0) { spend(c.seed, 1); p.crop = crop; wetPlot(p); } // replants from your own seeds
        did++;
      }
    }
    if (did && atCamp()) toast('Moonbeam has been at the garden: watered, picked and replanted.');
  }
  function kitchenTick() {
    const k = state.kitchen, now = total(), h = state.hour;
    if (hired('garden') && now >= k.gardenNext) { k.gardenNext = now + 0.5; tendGarden(); }
    if (!state.pal.told && (state.pal.held || 0) > 0 && !hired('front')) { state.pal.told = true; toast(`Moonbeam's shift is over. He is holding $${state.pal.held} for you: go and collect it from him.`); }
    if (!k.open) return;
    if ((h >= 8 || h < 2) && now >= k.next && k.queue.length < KITCHEN.queue && (atCamp() || hired('front'))) {
      const rush = (h >= 12 && h < 14) || (h >= 18 && h < 20.5) || h >= 23 || h < 2; // the same mealtimes that help you on foot
      k.next = now + (KITCHEN.gap[0] + Math.random() * (KITCHEN.gap[1] - KITCHEN.gap[0])) * (rush ? KITCHEN.rush : 1);
      const near = people.filter((f) => !f.away && !f.fixed && !f.called && f.next <= now && Math.hypot(f.x - CAMP.tent[0], f.z - CAMP.tent[1]) < 75);
      const f = near[Math.floor(Math.random() * near.length)], slot = [0, 1, 2, 3, 4].find((s) => !k.queue.some((q) => q.slot === s));
      if (f && Math.random() < Math.min(1, near.length / 12)) { // a thin crowd means long gaps between customers
        const menuToday = board(hired('front') && !atCamp() ? [state.store.cheese, state.pantryCheese] : [state.cheese, state.store.cheese, state.pantryCheese]);
        const r = Math.random(), want = r < KITCHEN.mix[0] ? 'any' : r < KITCHEN.mix[1] || !menuToday.length ? 'plain' : menuToday[Math.floor(Math.random() * menuToday.length)].item;
        const [x, z] = queueSpot(slot);
        if (crowd.call(f.i, x, z, Math.atan2(COUNTER[0] - x, COUNTER[1] - z))) k.queue.push({ i: f.i, slot, want, at: 0, born: now });
      }
    }
    for (const q of [...k.queue]) {
      if (!people[q.i] || !people[q.i].called) { k.queue = k.queue.filter((x) => x !== q); continue; }
      if (!q.at && crowd.waiting(q.i)) { q.at = now; if (hired('front')) state.pal.act = { kind: 'greet', at: state.t }; else if (atCamp()) toast(`A customer at your counter wants ${asks(q.want)}.`); }
      if (q.at && hired('front') && now - q.at > 0.08) serve(q, true); // about four seconds after his wave
      else if (q.at && now - q.at > 0.9) { if (atCamp()) toast('A customer got tired of waiting and wandered off.'); k.walked++; leaveQueue(q); }
      else if (!q.at && now - q.born > 2) leaveQueue(q);
    }
  }
  // ---- the produce cabinet: bought at the gear stall, it stands by the stove and takes ingredients only. It holds far more than the tent, and the stove cooks from it.
  const pantryKinds = () => ['supplies', ...FILLINGS.map((f) => f.item), 'sage'];
  const pantrySize = () => [0, 0, 12, 30, 60][state.gear.pantry] || 0;
  const pantryRoom = (k) => Math.max(0, pantrySize() - (state.pantry[k] || 0));
  const pantryLine = () => { const ks = pantryKinds().filter((k) => state.pantry[k] > 0); return ks.length ? ks.map((k) => `${state.pantry[k]} ${ITEMS[k].name.toLowerCase()}`).join(', ') : 'empty'; };
  // Cooked sandwiches keep in the cabinet too: as many as it holds of anything else. The kitchen counter serves from it.
  const cabinetCheeseRoom = () => Math.max(0, pantrySize() - state.pantryCheese.length);
  function stockCheese() {
    let moved = 0;
    for (const from of [state.store.cheese, state.cheese]) while (from.length && cabinetCheeseRoom() > 0) { state.pantryCheese.push(from.shift()); moved++; }
    toast(moved ? `${moved} grilled cheese into the cabinet. Your counter serves from here too.` : 'No room for more sandwiches in the cabinet.');
  }
  function takeCheese() {
    state.pantryCheese.sort((a, b) => b.p - a.p); // the best ones come out first
    let took = 0;
    while (took < ITEMS.cheese.stack && state.pantryCheese.length && room('bag', 'cheese') + room('store', 'cheese') > 0) { give('cheese', 1, state.pantryCheese.shift(), true); took++; }
    toast(took ? `${took} grilled cheese out of the cabinet.` : 'No room in your bag or stash.');
  }
  function stockPantry() {
    let moved = 0;
    for (const k of pantryKinds()) for (const from of [state.bag, state.store]) {
      const n = Math.min(from[k], pantryRoom(k));
      if (n > 0) { from[k] -= n; state.pantry[k] = (state.pantry[k] || 0) + n; moved += n; }
    }
    toast(moved ? `${moved} into the cabinet. It now holds: ${pantryLine()}.` : 'Nothing more fits in the cabinet.');
  }
  function emptyPantry() {
    let left = 0;
    for (const k of pantryKinds()) { const n = state.pantry[k] || 0; if (n) { state.pantry[k] = give(k, n, null, true); left += state.pantry[k]; } }
    toast(left ? `Your bag and stash are full; ${left} stayed in the cabinet.` : 'Cabinet emptied into your bag and stash.');
  }
  function takeFromPantry(k) {
    const n = Math.min(state.pantry[k], ITEMS[k].stack), left = give(k, n, undefined, true);
    state.pantry[k] -= n - left;
    toast(n - left ? `${n - left} ${ITEMS[k].name.toLowerCase()} out of the cabinet.` : 'No room in your bag or stash.');
  }
  function pantryMenu() {
    const lv = GEAR.pantry[1][state.gear.pantry - 1], up = next('pantry'), held = pantryKinds().filter((x) => state.pantry[x] > 0);
    menu(`${lv.name}: holds ${pantrySize()} of each ingredient and ${pantrySize()} cooked sandwiches`, [
      { label: `Put everything in <small>bread, cheese, vegetables, herbs and mushrooms from your bag and stash</small>`, can: () => (pantryKinds().some((x) => state.bag[x] + state.store[x] > 0 && pantryRoom(x) > 0) ? true : 'nothing to put in'), act: () => { stockPantry(); pantryMenu(); } },
      { label: `Put your cooked sandwiches in <small>from your stash and bag; room for ${cabinetCheeseRoom()} more</small>`, can: () => (!(state.cheese.length + state.store.cheese.length) ? 'you have none cooked' : cabinetCheeseRoom() < 1 ? 'no room for more' : true), act: () => { stockCheese(); pantryMenu(); } },
      ...(state.pantryCheese.length ? [{ label: `Grilled cheese ×${state.pantryCheese.length} <small>${stockLine([state.pantryCheese])}. Take ${Math.min(state.pantryCheese.length, ITEMS.cheese.stack)} out</small>`, act: () => { takeCheese(); pantryMenu(); } }] : []),
      ...held.map((x) => ({ label: `${ITEMS[x].name} ×${state.pantry[x]} <small>take ${Math.min(state.pantry[x], ITEMS[x].stack)} out</small>`, act: () => { takeFromPantry(x); pantryMenu(); } })),
      ...(held.length > 1 ? [{ label: 'Take everything out <small>into your bag, then your stash</small>', act: () => { emptyPantry(); pantryMenu(); } }] : []),
      { label: up ? `Bigger: ${up.name} <small>${up.does}. $${up.cost} at Leather & Burner on Shakedown Street</small>` : 'This is the biggest there is', can: () => 'for your information', act() {} },
    ]);
  }
  function counterMenu() {
    const k = state.kitchen, ready = kitchenReady();
    menu(`Your camp kitchen${k.open ? ' (open)' : ''}: ${k.served} served`, [
      k.open ? { label: 'Take the sign down <small>stop taking orders</small>', act: () => closeKitchen() }
        : { label: 'Put the sign up <small>people nearby walk over and order. An open kitchen draws more thieves</small>', can: () => ready, act: () => { k.open = true; k.next = total(); toast('Sign up. Stay at camp and customers will come to the counter.'); } },
      { label: `On the board today: ${['grilled cheese', ...board([state.cheese, state.store.cheese, state.pantryCheese]).map((f) => sandwichName(f.item))].join(', ')} <small>cooked: ${stockLine([state.cheese, state.store.cheese, state.pantryCheese])}</small>`, can: () => 'for your information', act() {} },
      { label: `In your produce cabinet: ${state.gear.pantry < 2 ? 'you have none; Leather & Burner sells a produce crate' : pantryLine()} <small>bread and cheese for ${have('supplies')} more sandwiches, counting your bag and stash</small>`, can: () => 'for your information', act() {} },
      { label: `Moonbeam has sold ${k.palSold} for $${k.palTake} <small>${(state.pal.held || 0) > 0 ? `he is holding $${state.pal.held} for you: collect it from him after his shift` : 'hire him from his camp chair, $35 a day'}</small>`, can: () => 'for your information', act() {} },
    ]);
  }
  function hire(job) {
    state.kitchen.hire = { job, until: state.hour < 2 ? state.day * 24 + 2 : (state.day + 1) * 24 + 2 }; state.kitchen.gardenNext = 0;
    toast(job === 'front' ? '"Counter is mine. Keep that stash full of sandwiches." He holds what he takes: collect it from him when his shift ends at 2 AM.' : '"I love a garden. Leave your seeds in the stash and I will replant."');
  }
  // ---- the Elder and the balloons: sell enough and the people you sold to start filling the cots in the Chill-Out Tent.
  // The Elder asks what you intend to do about it. First-guess numbers, not yet tuned.
  const RECKON = { first: 12, second: 60, mend: 3, every: 6, careEvery: 12, warnedSale: 0.15, warnedGap: 2, quitCash: 300, quitPoints: 5, healerPay: 8 }; // giving up the tank for good has to be worth a corner's income: a lump sum, skill points, every culture he keeps, and paid healing from then on
  const careful = () => state.reckon.path === 'mended'; // you sell the Elder's way: half as many end up needing a healer
  const shunned = () => state.reckon.stage >= 2 && !['mended', 'quit'].includes(state.reckon.path); // his people are warning buyers off you
  function reckonTick() {
    const r = state.reckon, v = state.nos;
    if (!state.village.elder) return;
    if (r.stage === 0 && v.sold >= RECKON.first) { r.stage = 1; toast('Word from the Healing Village: three people on cots in the Chill-Out Tent, blue-lipped and giggling. The Elder is asking for you by name.'); }
    if (r.path === 'mending' && state.heal.count - r.base >= RECKON.mend) { r.path = 'ready'; toast('That is three people you have sat with. Go and tell the Elder.'); }
    if (r.stage === 1 && v.sold >= RECKON.second && !['mended', 'quit'].includes(r.path)) { r.stage = 2; toast('The Elder’s people are out on the Street tonight, telling anyone who will listen whose balloons put their friends on a cot.'); }
  }
  // Called when you talk to the Elder. True means the conversation was about this and his shop stays shut.
  function elderReckoning() {
    const r = state.reckon, v = state.nos;
    if (r.stage === 0 || r.path === 'mended' || r.path === 'quit') return false;
    if (r.path === 'mending') { toast(`The Elder: "${Math.max(0, Math.min(RECKON.mend, state.heal.count - r.base))} of three. Look for the pink crosses. Water and herbs."`); return false; }
    if (r.path === 'ready') {
      r.path = 'mended'; state.points++; gain('wellness', 10); add('vibes', 0.15); give('bottles', 2);
      talk([['Village Elder', 'You did not have to. That is the only reason it counts.'],
        ['Village Elder', 'If you are going to keep selling, sell like a healer. A sip of water with every one. Sit the wobbly ones down. Send the bad ones to me before they fall, not after.']],
      () => card('The Elder’s way', 'From now on half as many of the people you sell to end up needing a healer, the Elder’s people leave your buyers alone, and he will stand with you again. +1 skill point.', 6200));
      save(); return true;
    }
    const lines = r.path === 'shrugged'
      ? [['Village Elder', shunned() ? 'My people are on the Street because of you. It does not have to stay that way.' : 'You came back. Good. The cots are still full.']]
      : [['Village Elder', 'Three on my cots last night. Blue lips, cold hands, laughing at nothing. Every one of them said the same name.'],
        ['Village Elder', 'I am not security. I will not take your tank. I am asking what you intend to do about it.']];
    talk(lines, reckonMenu);
    return true;
  }
  function reckonMenu() {
    const r = state.reckon, v = state.nos;
    menu('The Elder is waiting', [
      { label: `Make it right <small>sit with ${RECKON.mend} people who need a healer (the pink crosses), then come back</small>`, act: () => { r.path = 'mending'; r.base = state.heal.count; toast('"Water and herbs. Sit with them until it passes. Then come and tell me."'); } },
      { label: `Give it up <small>hand him your tank: no more balloons, no corner, for good. The Village passes the bowl: $${RECKON.quitCash}, ${RECKON.quitPoints} skill points, every culture he keeps, and from now on $${RECKON.healerPay} for each person you heal</small>`, can: () => (v.tank ? true : 'you have no tank to give'), act: () => {
        closeCorner(); state.corner.crew = {}; loseTank(); r.path = 'quit'; state.cash += RECKON.quitCash; state.points += RECKON.quitPoints; gain('wellness', 20); add('vibes', 0.25);
        for (const [k, c] of Object.entries(GROWN)) if (c.source === 'elder') state.cultures[k] = true;
        card('You gave it up', `The Elder’s people carry the tank down to the river and open the valve. It hisses for a long time. Then a bowl goes round the whole Village and comes back heavy: $${RECKON.quitCash}. He hands you a jar of every culture he keeps, ${RECKON.quitPoints} skill points land with them, and he names you the Village’s healer: $${RECKON.healerPay} from the bowl for every person you help from now on.`, 9000); save();
      } },
      { label: 'It is only balloons <small>walk away</small>', act: () => { r.path = 'shrugged'; crewWaver(); add('vibes', -0.05); toast('"Then there is nothing for you at my fire." He will not trade with you until you make it right.'); } },
    ]);
  }
  // ---- the corner crew: four stations, each worked by a named person you had to earn and now pay by the night (never a share).
  // Each hire takes one job off you. With all four on, the corner runs without you. People and numbers are data/crew.json.
  const STATIONS = ['fill', 'front', 'cash', 'run'];
  const EARN = { // what earns each member; 'later' members wait for quests that are not in the game yet
    whip: () => state.nos.whipState === 'grateful',
    lostsock: () => state.crate.best >= 90,
    doc: () => state.reckon.path === 'mended',
    brody: () => state.corner.wavedNarcs >= 5,
    tiny: () => state.corner.tinyPaid,
    marge: () => (state.crewShifts || 0) >= 5,
    deuce: () => state.corner.sold + state.corner.crewSold >= 20,
    juniper: () => state.heal.count >= 8,
    sparkle: () => state.chain.stats.kandi >= 6,
  };
  const crewNight = () => (state.hour < 4 ? state.day * 24 + 4 : (state.day + 1) * 24 + 4); // a night's work ends at 4 AM
  const seatId = (st) => { const s = state.corner.crew[st]; return s && total() < s.until && !state.corner.left[s.id] && CREW.members[s.id] ? s.id : ''; };
  const seat = (st) => { const id = seatId(st); return id ? CREW.members[id] : null; };
  const fullCrew = () => STATIONS.every((st) => seatId(st));
  const crewCount = () => STATIONS.filter((st) => seatId(st)).length;
  const crewCare = () => STATIONS.some((st) => { const m = seat(st); return m && m.care; });
  function crewEarnTick() { // somebody new will work for you
    if (!cornerOwned()) return;
    for (const [id, m] of Object.entries(CREW.members)) {
      if (state.corner.earned[id] || !EARN[id] || !EARN[id]()) continue;
      state.corner.earned[id] = true;
      toast(`${m.name} will work your corner: ${CREW.stations[m.station].name.toLowerCase()}. Hire them by the night at your crate.`);
    }
  }
  // Where a sale's money goes: with somebody on cash it leaves the corner for your camp stash (less whatever sticks to their fingers).
  function bank(pay) {
    const cash = seat('cash'), c = state.corner;
    if (!cash) { state.cash += pay; return pay; }
    if (Math.random() < (cash.skim || 0)) { pay = Math.max(0, pay - 1); c.skimmed = (c.skimmed || 0) + 1; }
    state.stash += pay; return pay;
  }
  function crewBust(why) { // the whole crew scatters for the night; whoever was on the front spends a day in the cooler
    const c = state.corner, v = state.nos, front = seatId('front'), lost = Math.min(v.fills, CREW.rules.bustLoss);
    v.fills -= lost; c.busts = (c.busts || 0) + 1;
    if (front) c.jail[front] = total() + CREW.rules.jail;
    const who = front ? CREW.members[front].name : 'Your crew';
    for (const st of STATIONS) if (c.crew[st]) c.crew[st].until = 0;
    toast(`${why} ${who} sold to one of Officer Dan's. The crew scattered, ${lost} fills went with them${front ? `, and ${who} is in the cooler till tomorrow night` : ''}.`);
  }
  // One balloon made and sold by the crew with nobody waiting on you. Returns nothing; every outcome is counted on state.corner.
  function crewSale() {
    const c = state.corner, v = state.nos, fill = seat('fill'), front = seat('front'), R = CREW.rules;
    if (v.fills < 1) { // the filler sends for more gas, out of the takings
      const night = Math.floor((total() - 6) / 24);
      if (c.refillNight !== night) { c.refillNight = night; c.refills = 0; }
      if (c.refills >= R.refills || state.stash + state.cash < R.refillCost) return;
      const fromStash = Math.min(state.stash, R.refillCost); state.stash -= fromStash; state.cash -= R.refillCost - fromStash;
      c.refills++; v.fills = 30; return;
    }
    if (Math.random() < (fill.pop || 0)) { v.fills--; c.popped = (c.popped || 0) + 1; return; }
    if (Math.random() < R.narc) { if (Math.random() < (front.spot || 0)) { c.crewWaved = (c.crewWaved || 0) + 1; return; } crewBust('Word from the Street:'); return; }
    if (Math.random() < (front.turnaway || 0)) return;
    const pay = bank(price() + (Math.random() < (fill.tip || 0) ? 1 : 0));
    v.fills--; v.sold++; c.crewSold++; c.crewTake += pay; casualty();
  }
  // With somebody on the tank you do not fill: they do, at their own standard. You still decide who gets one unless the front is covered too.
  function crewFillSale(q) {
    const c = state.corner, v = state.nos, fill = seat('fill'), f = people[q.i];
    cornerT = state.t;
    if (Math.random() < (fill.pop || 0)) { v.fills--; toast(`${fill.name} pops one. A fill wasted; they are still waiting.`); if (v.fills < 1) closeCorner('The tank is empty. Your corner is closed until you refill.'); return; }
    leaveCorner(q); f.next = total() + 2;
    if (tell(f).narc) { closeCorner(); for (const st of STATIONS) if (c.crew[st]) c.crew[st].until = 0; bust(); return; }
    const pay = bank(price() + (Math.random() < (fill.tip || 0) ? 1 : 0));
    v.fills--; v.sold++; c.sold++; c.take += pay;
    add('buzzkill', CORNER_RULES.buzz * (1 - charmEase(level('charisma')))); casualty();
    sfx('coin'); gain('hustle', 1);
    toast(`${fill.name} fills it, you hand it over. +$${pay}${seat('cash') ? ' to your stash' : ''}. ${v.fills} fills left.`);
    if (v.fills < 1) closeCorner('The tank is empty. Your corner is closed until you refill.');
  }
  function hireCrew(id) {
    const m = CREW.members[id], c = state.corner;
    c.crew[m.station] = { id, until: crewNight() }; c.crewNext = 0;
    toast(`${m.name}: ${m.hired || '"I am on it."'}${fullCrew() ? ' All four stations are filled: the corner runs without you tonight.' : ''}`);
    if (fullCrew()) { closeCorner(); elderWalk(); }
  }
  function stationMenu(st) {
    const c = state.corner, S = CREW.stations[st], on = seatId(st);
    const list = Object.entries(CREW.members).filter(([, m]) => m.station === st);
    const opts = list.map(([id, m]) => {
      if (m.rule === 'later') return { label: `${m.name} <small>${m.blurb} To earn: ${m.earn}</small>`, can: () => 'that story is not in the game yet', act() {} };
      if (c.left[id]) return { label: `${m.name} <small>walked off with the Elder</small>`, can: () => 'gone for good', act() {} };
      if (!c.earned[id]) return { label: `${m.name} <small>${m.blurb}</small>`, can: () => `not earned yet: ${m.earn.charAt(0).toLowerCase()}${m.earn.slice(1)}`, act() {} };
      return { label: `${m.name} <small>${m.blurb} Tonight, until 4 AM</small>`, cost: m.wage,
        can: () => (on === id ? 'already on tonight' : total() < (c.jail[id] || 0) ? 'in the cooler until tomorrow night' : state.nos.fills < 1 && st === 'fill' ? 'your tank is empty' : true),
        act: () => { hireCrew(id); if (!state.menu && state.canMove) crewMenu(); } };
    });
    if (st === 'fill' && !c.earned.whip && state.nos.whipState !== 'grateful') { // you won, but not with Whip on your side: say why he is missing, and give a way back
      const why = { gone: 'He cleared out after the showdown: you had cut him loose, leaned on him, or he had already talked to Vinny', fled: 'He ran when you took his tank', cut: 'You cut him loose', leaned: 'You leaned on him and he has not forgiven it', flipped: 'He told Vinny everything' }[state.nos.whipState] || 'He is keeping his head down';
      opts.splice(1, 0, { label: `Send word to Whip and square it <small>${why}. Pay what he reckons he is owed and he comes back: your filler, and $25 refills for good</small>`, cost: CREW.rules.whipBack || 80,
        act: () => { state.nos.whipState = 'grateful'; crewEarnTick(); toast('"…Yeah. Alright. We’re square." Whip is back behind the Costume Shop, and he will work your tank.'); stationMenu(st); } });
    }
    if (st === 'cash' && !c.tinyPaid) opts.push({ label: `Clear Tiny's debt to Vinny <small>he is yours to hire after that</small>`, cost: CREW.rules.tinyDebt, act: () => { c.tinyPaid = true; crewEarnTick(); stationMenu(st); } });
    opts.push({ label: 'Back', act: crewMenu });
    menu(`${S.name}: ${S.does}${on ? ` · ${CREW.members[on].name} is on tonight` : ' · you cover this yourself'}`, opts);
  }
  function crewMenu() {
    const c = state.corner;
    menu(`Your crew · ${crewCount()} of 4 stations filled tonight${fullCrew() ? ' · the corner runs without you' : ''}`, [
      ...STATIONS.map((st) => { const m = seat(st), S = CREW.stations[st]; return { label: `${S.name}: ${m ? `${m.name}, on tonight` : 'empty, you cover it'} <small>${S.does}</small>`, act: () => stationMenu(st) }; }),
      { label: `Your crew has sold ${c.crewSold} for $${c.crewTake} <small>into your camp stash. ${c.popped || 0} popped, ${c.crewWaved || 0} undercovers waved off, ${c.skimmed || 0} dollars gone missing, ${c.busts || 0} busts</small>`, can: () => 'for your information', act() {} },
      { label: 'Back', act: cornerMenu },
    ]);
  }
  // The night all four stations are first filled, the Elder comes to see it for himself.
  function elderWalk() {
    const c = state.corner, r = state.reckon;
    if (c.walked || !state.village.elder || r.path === 'mended' || r.path === 'quit') return;
    c.walked = true; r.stage = Math.max(1, r.stage);
    const soft = crewWaverer();
    talk([['Village Elder', 'I have not left the Village in eleven years. I wanted to see this for myself.'],
      ['Village Elder', 'This came off a wrist on one of my cots this morning. I will leave it on your crate.'],
      ...(soft ? [['Village Elder', `${CREW.members[soft].name}. I watched you sit with a stranger until sunrise. Now you hand these out?`]] : []),
      ['Village Elder', 'Four of you now. So I will ask all four at once. What do you intend to do about it?']], reckonMenu);
  }
  const crewWaverer = () => ['juniper', 'sparkle', 'willow', 'doc'].find((id) => STATIONS.some((st) => seatId(st) === id)); // the one you earned by kindness
  function crewWaver() { // you shrugged the Elder off: that one goes with him
    const id = crewWaverer();
    if (!id) return;
    state.corner.left[id] = true;
    toast(`${CREW.members[id].name} looks at you, then at him, and walks back up the Street beside the Elder. They will not work your corner again.`);
  }
  // ---- your corner: once Vinny has backed off, a spot at the far end of the Street is yours. Post up there at night with your
  // tank and buyers come to you; or pay Whip a night's wage to work it. Settings below were first guesses, not yet tuned.
  const CORNER_RULES = { queue: 3, gap: [0.07, 0.2], dayGap: 4, wait: 0.6, buzz: 0.08, wage: 50, whipGap: [0.12, 0.28], narc: 0.09, whipMiss: 0.5, whipLoss: 10, jail: 24 };
  const cornerOwned = () => state.nos.arc === 'won' && state.nos.tank && !!CORNER;
  const atCorner = (p) => cornerOwned() && Math.hypot(p.x - CORNER[0], p.z - CORNER[1]) < 2.8;
  const cornerSpot = (i) => [CORNER[0] - 0.4 + i * 0.95, CORNER[1] + 1.9 + i * 0.25]; // in a row in front of the crate, out in the Street
  const casualty = () => { if (state.nos.sold % (careful() || crewCare() ? RECKON.careEvery : RECKON.every) === 0 && state.heal.ids.length < 5 && state.village.elder) state.heal.ids.push(Math.floor(Math.random() * people.length)); }; // somebody had one too many
  let cornerT = -9;
  function leaveCorner(q) { crowd.release(q.i); state.corner.queue = state.corner.queue.filter((x) => x !== q); }
  function closeCorner(why) { const c = state.corner; if (!c.open) return; c.open = false; for (const q of [...c.queue]) leaveCorner(q); if (why) toast(why); }
  const cornerBuyer = (p) => (state.corner.open && atCorner(p) ? state.corner.queue.filter((q) => q.at && people[q.i]).sort((a, b) => a.at - b.at)[0] : undefined);
  function cornerPitch(q) {
    const t = tell(people[q.i]), spotted = t.narc && (t.seen || fx('clear') || lookout());
    return `${t.speaks ? `${t.line} ` : ''}Fill them a balloon ($${price()})${spotted ? (lookout() && !t.seen && !fx('clear') ? ' · your lookout shakes their head' : ` · you notice ${t.off}`) : ''} · Q waves them off · C menu`;
  }
  window.addEventListener('keyup', (e) => { if (e.code === 'Space') fillHold(false); });
  $('fillbtn').addEventListener('pointerdown', (e) => { e.preventDefault(); fillHold(true); }); window.addEventListener('pointerup', () => fillHold(false));
  // ---- filling a balloon for the buyer in front of you: hold to fill, let go in the gold. Too little and they haggle, too much and it pops.
  // Rules here; the drawing is the #fill panel. Sizes run 0 (empty) to 1 (pops). First-guess numbers.
  const FILL = { rate: 0.34, surge: 0.62, good: 0.2, perfect: 0.07, shift: 0.06, limp: 2, tip: 1, colours: ['#ff5d8f', '#ffd23f', '#3aa0ff', '#7cf29a', '#b78cff'] };
  function startFill(q) {
    const centre = 0.74 + (Math.random() * 2 - 1) * FILL.shift; // every balloon is a little different: read the gold band, do not count
    q.busy = true; cornerT = state.t;
    state.filling = { q, size: 0, held: false, started: false, centre, done: 0, colour: FILL.colours[Math.floor(Math.random() * FILL.colours.length)] };
    state.canMove = false; $('prompt').classList.add('hidden'); $('fill').classList.remove('hidden');
    const pc = (v) => `${Math.max(0, Math.min(1, v)) * 100}%`, g0 = centre - FILL.good / 2, g1 = centre + FILL.good / 2, p0 = centre - FILL.perfect / 2, p1 = centre + FILL.perfect / 2;
    $('fillbar').style.background = `linear-gradient(90deg,#f6e7c1 0 ${pc(g0)},#e8a33d ${pc(g0)} ${pc(p0)},#ffd23f ${pc(p0)} ${pc(p1)},#e8a33d ${pc(p1)} ${pc(g1)},#f6e7c1 ${pc(g1)} 93%,#d7263d 93% 100%)`;
    $('fillmsg').textContent = 'Hold Space to fill. Let go in the gold.';
    $('fillcount').textContent = `${state.nos.fills} fills in the tank · $${price()} a balloon`;
    drawFill();
  }
  function drawFill() {
    const f = state.filling, b = $('fillballoon'), d = 26 + f.size * 150;
    b.style.width = `${d * 0.86}px`; b.style.height = `${d}px`; b.style.background = f.colour; b.style.opacity = f.popped ? 0 : 1;
    b.style.transform = `translateX(${f.held && f.size > 0.85 ? Math.sin(state.t * 60) * 2 : 0}px)`; // it shudders when it is about to go
    $('fillmark').style.left = `${Math.min(1, f.size) * 100}%`;
    $('fillpop').classList.toggle('hidden', !f.popped);
  }
  function fillHold(on) {
    const f = state.filling;
    if (!f || f.done) return;
    if (on) { f.held = true; f.started = true; } else if (f.held) { f.held = false; endFill(); }
  }
  function updateFilling(dt) {
    const f = state.filling;
    if (f.done) { f.done -= dt; if (f.done <= 0) closeFill(); return; }
    if (f.held) {
      let rate = FILL.rate + f.size * FILL.surge; // it fills faster the fuller it gets
      if (total() < state.nos.tingleUntil) rate *= 0.6 + Math.random() * 1.1; // Tingle Fingers: your thumb is not your own
      if (fx('clear')) rate *= 0.75; // a clear head slows the moment down
      f.size += rate * dt;
      if (f.size >= 1) { f.size = 1; f.held = false; endFill(); }
    }
    drawFill();
  }
  function endFill() {
    const f = state.filling, v = state.nos, c = state.corner, who = people[f.q.i];
    const off = Math.abs(f.size - f.centre), popped = f.size >= 1, perfect = !popped && off <= FILL.perfect / 2, good = !popped && off <= FILL.good / 2, over = f.size > f.centre;
    v.fills--; // the gas is gone whatever happens to the balloon
    if (popped) {
      f.popped = true; sfx('pick'); add('vibes', -0.01);
      $('fillmsg').textContent = v.fills > 0 ? 'POP. One fill wasted. They are still waiting.' : 'POP. And that was the last of the tank.';
      f.done = 0.9; f.again = v.fills > 0; drawFill(); return;
    }
    cornerT = state.t; who.next = total() + 2; f.sold = true;
    if (tell(who).narc) { f.done = 0.01; f.bust = true; return; }
    const pay = Math.max(1, price() + (perfect ? FILL.tip : good ? 0 : -FILL.limp));
    bank(pay); v.sold++; c.sold++; c.take += pay;
    add('buzzkill', CORNER_RULES.buzz * (1 - charmEase(level('charisma')))); casualty();
    sfx('coin'); gain('hustle', perfect ? 3 : 2);
    $('fillmsg').textContent = perfect ? `Perfect. +$${pay}, and a dollar of that is a tip.` : good ? `A good one. +$${pay}.` : over ? `Tight as a drum: they take it at arm's length. +$${pay}.` : `Limp. "That is half a balloon." +$${pay}.`;
    f.done = 0.8; drawFill();
  }
  function closeFill(cancel) {
    const f = state.filling;
    if (!f) return;
    if (f.again && !cancel) { const q = f.q; state.filling = null; startFill(q); return; } // it popped: same buyer, another go
    state.filling = null; state.canMove = true; $('fill').classList.add('hidden');
    f.q.busy = false;
    if (f.sold) leaveCorner(f.q);
    if (f.bust) { closeCorner(); bust(); return; }
    if (state.nos.fills < 1) closeCorner('The tank is empty. Your corner is closed until you refill.');
  }
  function sellCorner(q) { // kept for anything that sells without the minigame
    const v = state.nos, c = state.corner, f = people[q.i];
    leaveCorner(q); cornerT = state.t; f.next = total() + 2;
    if (tell(f).narc) { closeCorner(); bust(); return; }
    const pay = price();
    v.fills--; state.cash += pay; v.sold++; c.sold++; c.take += pay;
    add('buzzkill', CORNER_RULES.buzz * (1 - charmEase(level('charisma')))); casualty();
    sfx('coin'); gain('hustle', 2);
    toast(`+$${pay}. ${v.fills} fills left in the tank.`);
    if (v.fills < 1) closeCorner('The tank is empty. Your corner is closed until you refill.');
  }
  function waveOff() { // Q at the corner: send the next buyer away without selling
    const q = cornerBuyer(getPlayer().root.position);
    if (!q) return false;
    const narc = tell(people[q.i]).narc; people[q.i].next = total() + 2;
    if (narc) state.corner.wavedNarcs++;
    leaveCorner(q); cornerT = state.t;
    toast(narc ? 'They walk off muttering into a sleeve. Good call.' : '"Whatever, man." They drift off. That one was just thirsty.');
    return true;
  }
  function cornerTick() {
    const c = state.corner, v = state.nos, now = total(), R = CORNER_RULES;
    crewEarnTick();
    if (fullCrew() && late() && now >= c.crewNext) { // all four stations filled: the corner works itself, wherever you are
      const pace = Math.min(seat('fill').speed || 1, seat('front').speed || 1, seat('run').speed || 1); // as fast as its slowest station
      c.crewNext = now + (CREW.rules.gap[0] + Math.random() * (CREW.rules.gap[1] - CREW.rules.gap[0])) / pace * (shunned() ? RECKON.warnedGap : 1);
      crewSale();
    }
    if (!c.open) return;
    const p = getPlayer().root.position;
    if (Math.hypot(p.x - CORNER[0], p.z - CORNER[1]) > 14) { closeCorner('You walked away from your corner. It is closed.'); return; }
    const runner = seat('run');
    if (now >= c.next && c.queue.length < R.queue + (runner ? CREW.rules.runnerQueue : 0)) {
      c.next = now + (R.gap[0] + Math.random() * (R.gap[1] - R.gap[0])) / (runner ? runner.speed * 1.2 : 1) * (shunned() ? RECKON.warnedGap : 1) * (late() ? 1 : R.dayGap); // by day it is a trickle // the Elder's people thin your queue
      const near = people.filter((f) => !f.away && !f.fixed && !f.called && f.next <= now && Math.hypot(f.x - CORNER[0], f.z - CORNER[1]) < 60);
      const f = near[Math.floor(Math.random() * near.length)], slot = [0, 1, 2, 3].find((s) => !c.queue.some((q) => q.slot === s));
      if (f && Math.random() < Math.min(1, near.length / 10)) { // a thin crowd means long gaps
        const [x, z] = cornerSpot(slot);
        if (crowd.call(f.i, x, z, Math.atan2(CORNER[0] - x, CORNER[1] - z))) c.queue.push({ i: f.i, slot, at: 0, born: now });
      }
    }
    for (const q of [...c.queue]) {
      if (!people[q.i] || !people[q.i].called) { c.queue = c.queue.filter((x) => x !== q); continue; }
      if (!q.at && crowd.waiting(q.i)) {
        q.at = now; const t = tell(people[q.i]), front = seat('front');
        if (front && t.narc && Math.random() < (front.spot || 0)) { people[q.i].next = now + 2; leaveCorner(q); toast(`${front.name} sends one away before they reach you: "Not tonight."`); continue; }
        if (front && !t.narc && Math.random() < (front.turnaway || 0)) { people[q.i].next = now + 2; leaveCorner(q); toast(`${front.name} turns somebody away. They looked fine to you.`); continue; }
        toast(t.speaks ? `At your corner: ${t.line}` : 'Somebody is at your corner, holding out a five.');
      }
      if (q.busy) continue; // you are filling theirs right now
      if (q.at && now - q.at > R.wait) leaveCorner(q);
      else if (!q.at && now - q.born > 2) leaveCorner(q);
    }
  }
  function cornerMenu() {
    const c = state.corner, v = state.nos;
    menu(`Your corner · tank ${v.fills} of 30 fills · $${price()} a balloon`, [
      c.open ? { label: 'Pack up <small>stop selling here</small>', act: () => closeCorner('You pack up the corner.') }
        : { label: `Post up here <small>buyers walk up to you; E fills them a balloon (or has your filler do it), Q waves one off. Busiest 8 PM to 4 AM${late() ? '' : ', slow right now'}. Watch for Officer Dan’s people</small>`, can: () => (fullCrew() ? 'your crew has the corner tonight' : v.fills < 1 ? 'your tank is empty' : true),
          act: () => { c.open = true; c.next = total(); toast(late() ? 'You are on your corner. Stay close and they will come to you.' : 'You are on your corner. It is slow before 8 PM: about a quarter of the night-time trade.'); } },
      { label: `Your crew <small>${crewCount()} of 4 stations filled tonight. Each hire takes a job off you; with all four the corner runs without you</small>`, act: crewMenu },
      { label: `You have sold ${c.sold} here for $${c.take}; your crew has sold ${c.crewSold + c.whipSold} for $${c.crewTake + c.whipTake}`, can: () => 'for your information', act() {} },
    ]);
  }
  const hireWhip = () => ({ label: 'Work my corner <small>he is your filler now: hire him by the night at your corner crate, under Your crew</small>', can: () => 'hire him at your corner', act() {} });
  // ---- the week: Thursday to Sunday is the festival. Monday people leave, Tuesday is quiet, Wednesday they roll back in.
  const week = () => crowd.week(state.day, state.hour);
  const DAY_NOTE = { Monday: 'Monday. People are packing up, and the Free Pile is overflowing.', Tuesday: 'Tuesday. The grounds are quiet: crews, lifers and you.', Wednesday: 'Wednesday. Cars are rolling in. The pre-party starts at 8 tonight.', Thursday: 'Thursday. The gates are open and the Main Stage starts at 2.' };
  let noted = -1;
  function crewShift() {
    menu('Stage crew', [{ label: 'Work a three-hour shift <small>$30 cash. Hot, heavy work</small>', can: () => (state.crewDay === state.day ? 'one shift a day' : state.hour < 8 || state.hour >= 17 ? 'the crew works 8 AM to 5 PM' : n.energy < 0.35 ? 'you are too tired' : true), act: () => {
      state.crewDay = state.day; state.crewShifts = (state.crewShifts || 0) + 1; state.canMove = false; pass(3); gfx.setTime(state.hour);
      state.cash += 30; add('energy', -0.3); add('hydration', -0.25); add('hygiene', -0.2); add('nourishment', -0.12);
      card('Three hours on the crew', 'Truss, cable and gaffer tape. $30 in your pocket and a new respect for whoever builds this place.', 3200, () => { state.canMove = true; gain('craft', 4); save(); });
    } }]);
  }

  // ---- the Decks: open decks at the tent by the Main Stage field
  const missing = (rare) => Object.keys(CRATE.tracks).filter((id) => !state.crate.owned.includes(id) && (rare === undefined || !!CRATE.tracks[id].rare === rare));
  const pickOne = (list) => list[Math.floor(Math.random() * list.length)];
  const floorSize = () => (state.hour >= 20 || state.hour < 3 ? 18 : state.hour >= 13 ? 13 : 7);
  function playSet(manual) {
    const funky = n.hygiene < 0.25, glowing = state.vibes > 0.7;
    state.canMove = false; state.decking = true; document.body.classList.add('decking');
    decks.start({ owned: state.crate.owned.slice(), level: level('decks'), manual, steady: !!state.tree.steady, ears: !!state.tree.ears, crowd: floorSize() + 6,
      startEnergy: 0.45 + (state.tree.selector ? 0.08 : 0) - (funky ? 0.12 : 0) + (glowing ? 0.05 : 0), onDone: setOver });
    if (funky) toast('The front row takes one sniff and steps back.');
  }
  function setOver(r) {
    state.decking = false; document.body.classList.remove('decking');
    if (!r.mixes) { state.canMove = true; return; } // walked off before playing anything
    const sc = CRATE.set.scratch || { tipPerPoint: 0, tipCap: 0 }, style = r.style || 0, flair = 1 + Math.min(sc.tipCap, style * sc.tipPerPoint); // scratching fattens the tip jar
    const e = r.energy, tips = e < 0.3 ? 0 : Math.round(floorSize() * e * e * 1.1 * flair), xp = Math.round((1 + 6 * e + r.mixes) * (r.manual ? 1.4 : 1)) + style;
    pass(1); gfx.setTime(state.hour);
    add('energy', -0.1); add('hydration', -0.08); add('vibes', (e - 0.4) * 0.25);
    state.cash += tips; state.crate.sets++; state.crate.best = Math.max(state.crate.best, Math.round(e * 100));
    let gift = '';
    if (!r.quit && e >= 0.75 && state.crate.gift !== state.day) {
      const pool = e >= 0.9 && missing(true).length ? missing(true) : missing(false).length ? missing(false) : missing();
      if (pool.length) { const id = pickOne(pool); state.crate.owned.push(id); state.crate.gift = state.day; gift = ` Lost Sock, who runs the tent, slides you a USB: “${CRATE.tracks[id].name}”${CRATE.tracks[id].rare ? ', unreleased' : ''}.`; }
    }
    const title = r.quit ? 'You walked off mid-set' : e >= 0.8 ? 'The tent went off' : e >= 0.55 ? 'A solid set' : e >= 0.3 ? 'A shaky set' : 'You cleared the floor';
    const bits = [`Crowd Energy ${Math.round(e * 100)}%.`, r.wrecks ? `${r.wrecks} train wreck${r.wrecks > 1 ? 's' : ''}.` : '', r.dead ? `${r.dead} stretch${r.dead > 1 ? 'es' : ''} of dead air.` : '', style ? `${style} style from scratching.` : '', tips ? `$${tips} in the tip jar.` : 'Nothing in the tip jar.'].filter(Boolean).join(' ');
    if (tips) sfx('coin');
    card(title, bits + gift, 4200, () => { state.canMove = true; gain('decks', xp); save(); });
  }
  function showCrate() {
    const all = Object.keys(CRATE.tracks).length;
    menu(`Your crate (${state.crate.owned.length} of ${all})`, [...state.crate.owned.map((id) => { const t = CRATE.tracks[id]; return { label: `${t.name}${t.rare ? ' ★' : ''} <small>${t.artist} · ${t.bpm} BPM · key ${t.key} · energy ${t.energy} of 5</small>`, stay: true, act() {} }; }), { label: 'Back', act: openDecks }]);
  }
  function openDecks() {
    menu('Open Decks', [
      { label: `Play a set <small>three mixes on the house controller${state.crate.best ? ` · your best: ${state.crate.best}%` : ''}</small>`, can: () => (n.energy < 0.15 ? 'you are too tired to stand up there' : true), act: () => playSet(false) },
      { label: 'Play without the training wheels <small>no sync, no meter: more Decks xp, bigger lifts</small>', can: () => (level('decks') >= 3 ? (n.energy < 0.15 ? 'you are too tired' : true) : 'needs Decks level 3'), act: () => playSet(true) },
      { label: `Look through your crate <small>${state.crate.owned.length} tracks</small>`, act: showCrate },
      { label: 'How a set works', act: () => { state.canMove = false; card('How a set works', 'Pick a track. Line its beats up under the one playing with ← and →. Press Space on a gold line to start the blend, and Space again on the pink line to swap the bass. Match keys, and give the floor the mood it asks for.', 9000, () => { state.canMove = true; }); } },
    ]);
  }

  // ---- places you can use
  interactables.push(
    { test: (p) => (state.gear.pantry >= 2 || Object.values(state.pantry).some((v) => v > 0)) && Math.hypot(p.x - CAMP.pantry[0], p.z - CAMP.pantry[1]) < 1.6, label: () => `Your ${GEAR.pantry[1][state.gear.pantry - 1].name.toLowerCase().replace('no cabinet', 'old pantry shelf')}: ${pantryLine()}${state.pantryCheese.length ? `, ${state.pantryCheese.length} grilled cheese` : ''}`, use: pantryMenu },
    { test: (p) => cornerBuyer(p) !== undefined, label: () => cornerPitch(cornerBuyer(getPlayer().root.position)), use: () => { const q = cornerBuyer(getPlayer().root.position); if (seat('fill')) crewFillSale(q); else startFill(q); } },
    { test: (p) => atCorner(p) && state.corner.open && (state.corner.queue.length > 0 || state.t - cornerT < 1.5), label: () => (state.corner.queue.length ? 'Somebody is heading for your corner · C for your corner menu' : 'Your corner (open) · C for your corner menu'), use() {} },
    { test: (p) => cornerOwned() && Math.hypot(p.x - CORNER[0], p.z - CORNER[1]) < 2.2, label: () => (state.corner.open ? 'Your corner (open)' : 'Your corner'), use: cornerMenu },
    { test: (p) => nearOrder(p) !== undefined, label: () => `Serve: they want ${asks(nearOrder(getPlayer().root.position).want)} · C for your kitchen menu`, use: () => { serve(nearOrder(getPlayer().root.position), false); servedT = state.t; } },
    { test: (p) => atCounter(p) && state.kitchen.open && (state.kitchen.queue.length > 0 || state.t - servedT < 1.5), label: () => (state.kitchen.queue.length ? 'A customer is walking up to your counter · C for your kitchen menu' : 'Your kitchen counter (open)'), use() {} },
    { test: (p) => made('sign') && Math.hypot(p.x - COUNTER[0], p.z - COUNTER[1]) < 1.9, label: () => (state.kitchen.open ? 'Your kitchen counter (open): sign, board and stock' : 'Your kitchen counter'), use: counterMenu },
    { test: (p) => !week().musicDay && Math.hypot(p.x + 62.5, p.z + 121) < 3.4, label: 'Stage crew: work a shift', use: crewShift },
    { at: BOOTH, r: 3.4, label: 'Open Decks: play a set', use: openDecks },
    { at: CAMP.cooler, r: 2.1, label: () => (state.towing ? 'Park your cooler' : 'Your cooler'), use: () => menu(`${GEAR.cooler[1][state.gear.cooler - 1].name} (${state.water} of ${coolerRoom()} waters)`, [
      { label: 'Drink a cold water', stay: true, can: () => (state.water > 0 ? true : 'empty: fill it at the General Store'), act: () => { state.water--; add('hydration', sip()); toast('Ahh.'); } },
      ...(state.nos.rig && state.nos.tank ? [{ label: `Fill five balloons <small>${state.nos.fills} fills in the tank under the ice</small>`, stay: true, act: fillFive }] : []),
      ...(state.gear.cooler < 3 ? [] : state.towing
        ? [{ label: 'Park the cooler here', act: () => { state.towing = false; toast('Cooler parked at camp.'); } }]
        : [{ label: 'Take the cooler with you <small>sell cold water; sprinting with it wears you out faster</small>', act: () => { state.towing = true; toast('Cooler in tow. Offer cold water to anyone, R to drink.'); } }]),
    ]) },
    { at: PILE, r: 3.4, label: 'Dig through the Free Pile', use: () => {
      if (total() < state.pileNext) { toast('Picked clean for now. It restocks every hour or so.'); return; }
      if (['salvage', 'fabric', 'lights'].every((k) => room('bag', k) < 1)) { toast('Your bag is full. Stash something at camp first.'); return; }
      state.pileNext = total() + (state.tree.keen ? 0.5 : 1) * (['Monday', 'Tuesday'].includes(week().name) ? 0.34 : 1); // everybody leaving dumps their gear
      pass(0.2);
      const finds = [['a broken camp chair', { salvage: 1 }], ['a tent with one pole', { salvage: 1, fabric: 1 }], ['half a sleeping bag', { fabric: 1 }],
        ['a tangle of dead fairy lights', { lights: 1 }], ['a tarp and some bungee cords', { fabric: 1, salvage: 1 }], ['a roll of duct tape, nearly full', { salvage: 2 }],
        ['a cracked cooler lid', { salvage: 1 }], ['a ripped flannel', { fabric: 1 }], ['a single flip-flop', {}]];
      let [what, parts] = finds[Math.floor(Math.random() * finds.length)];
      if (!Object.keys(parts).length && Math.random() < (craftLevel() - 1) * 0.25) [what, parts] = finds[Math.floor(Math.random() * 8)]; // a trained eye digs past the junk
      const got = [], left = [];
      for (const [k, v] of Object.entries(parts)) {
        const extra = craftLevel() >= 3 && Math.random() < 0.3 ? 1 : 0; // and gets more out of each find
        const fit = v + extra - give(k, v + extra);
        if (fit) got.push(`+${fit} ${ITEMS[k].name.toLowerCase()}`);
        if (fit < v) left.push(ITEMS[k].name.toLowerCase());
      }
      toast(!Object.keys(parts).length ? `You found ${what}. Still no use for it.` : `You found ${what}. ${got.join(', ') || 'No room for it'}.${left.length && got.length ? ' No room for the rest.' : ''}`);
      craftXp(2); state.chain.stats.digs++; sfx('pick');
    } },
    { at: STALLS.gear, r: 2.9, label: 'Leather & Burner: camp gear', use: () => {
      const opts = Object.keys(GEAR).map((k) => {
        const lv = next(k);
        if (!lv) return { label: `${GEAR[k][0]}: nothing new today`, can: () => 'fully upgraded here', act() {} };
        if (lv.salvage) return { label: `${lv.name}`, can: () => `build it at your workbench with ${lv.salvage} salvage`, act() {} };
        return { label: `${lv.name} <small>${lv.does}</small>`, cost: Math.ceil(lv.cost * (state.tree.haggle ? 0.85 : 1)), act: () => upgrade(k) };
      });
      menu('Camp gear', opts);
    } },
    { at: SHOWERS, r: 2.8, label: 'Showers', use: () => menu('Showers', [
      { label: 'Hot shower <small>fully clean</small>', cost: 3, act: () => { n.hygiene = 1; add('vibes', 0.04); pass(0.3); toast('Hot water. You are a new person.'); gain('wellness', 2); } },
    ]) },
    { at: CAMP.tent, r: 3.1, label: 'Your tent', use: () => menu(GEAR.tent[1][state.gear.tent - 1].name, [
      { label: 'Nap for two hours', act: () => rest(false) },
      { label: 'Sleep until morning', can: () => (state.hour >= 20 || state.hour < 5 ? true : 'after 8 PM'), act: () => rest(true) },
      { label: 'Open your bag and stash', act: () => togglePanel(true) },
      { label: 'Stash or take cash <small>choose how much</small>', act: cashMenu },
    ]) },
    { at: CAMP.stove, r: 2.7, label: 'Cook on your camp stove', use: startCooking },
    { at: CAMP.bench, r: 1.9, label: 'Your workbench', use: workbench },
    { at: CAMP.garden, r: 2.6, use: gardenMenu, label: gardenLabel },
    { test: (p) => shroomSlots() > 0 && Math.hypot(p.x - CAMP.myco[0], p.z - CAMP.myco[1]) < 1.8, label: 'Your mushroom shelf', use: mycoMenu },
    { test: (p) => !!nearWild(p), label: () => { const w = nearWild(getPlayer().root.position); return !w ? '' : knows(w.k) ? (WILD[w.k].poison ? `${WILD[w.k].name}: leave it` : `Pick the ${WILD[w.k].name.toLowerCase()}`) : `${WILD[w.k].looks}: take a closer look`; }, use: forage },
    { at: [6.2, -60.6], r: 2.7, label: () => (state.hour >= 3 && state.hour < 6 ? 'Vinny is asleep' : 'Talk to Vinny'), use: vinnyTalk },
    { test: (p) => state.nos.whip >= 1 && whipAround() && WHIP && Math.hypot(p.x - WHIP[0], p.z - WHIP[1]) < 2.4, label: () => (state.nos.metWhip ? 'Talk to Whip' : 'Talk to the twitchy guy'), use: whipTalk },
    { test: (p) => state.nos.tank && !state.nos.rig && Math.hypot(p.x - CAMP.tank[0], p.z - CAMP.tank[1]) < 1.7, label: 'Your tank', use: tankMenu },
    { at: PERMIT, r: 2.4, label: 'Lot office: vendor permits', use: () => menu('Lot office', [
      { label: 'Day permit <small>vend on Shakedown Street until midnight and security leaves you alone</small>', cost: 12,
        can: () => (state.permitDay === state.day ? 'you already hold today’s' : true), act: () => { state.permitDay = state.day; toast('Permit pinned to your shirt. Vend away.'); } },
      ...officeExtras(),
    ]) },
    { at: STALLS.water, r: 2.9, label: 'General Store', use: () => menu('General Store', [
      { icon: 'cup', label: 'Cold water <small>drink it now</small>', cost: 2, stay: true, act: () => { add('hydration', sip()); toast('Ahh.'); } },
      shelf('Water bottle <small>for your bag</small>', 'bottles', 1, 2),
      { icon: 'ice', stay: true, label: 'Fill your cooler <small>$1 a bottle</small>', can: () => (state.gear.cooler >= 3 && !state.towing ? 'bring your cooler here' : state.water >= coolerRoom() ? 'cooler is full' : state.cash < coolerRoom() - state.water ? 'not enough cash' : true),
        act: () => { const amount = coolerRoom() - state.water; state.cash -= amount; state.water += amount; toast(`${amount} waters on ice${state.towing ? '' : ' back at camp'}.`); } },
      shelf('Bread and cheese <small>makes 5 sandwiches</small>', 'supplies', 5, 5, () => { state.lot.supplies = true; tick('supplies'); toast('Bread and cheese. Cook it on your camp stove.'); }),
      shelf('A case of bread and cheese <small>makes 20 sandwiches: a full griddle session</small>', 'supplies', 20, 20, () => { state.lot.supplies = true; tick('supplies'); toast('A case of bread and cheese: 20 in your bag, enough for 20 sandwiches.'); }),
      shelf('Trail mix <small>a snack for your bag</small>', 'trailmix', 1, 3, () => toast('Trail mix. Eat it from your bag.')),
      shelf('Electrolyte packets <small>2 packets: Energy</small>', 'electro', 2, 4, () => toast('Electrolyte packets. Drink one from your bag when you are flagging.')),
      shelf('Baby wipes <small>5 wipe-downs</small>', 'wipes', 5, 3, () => toast('Baby wipes. Use them from your bag.')),
      shelf('B12 tablets <small>for Tingle Fingers</small>', 'b12', 1, 4, () => toast('B12. Take one from your bag.')),
      shelf('Herb seeds <small>4 hours</small>', 'seeds', 1, 3, () => toast('Herb seeds. Plant them at your camp.')),
      shelf('Tomato seeds <small>8 hours: tomato melts</small>', 'seedTomato', 1, 5),
      shelf('Pepper seeds <small>8 hours: jalapeño poppers</small>', 'seedPepper', 1, 5),
      shelf('Sage seeds <small>6 hours: healing herbs</small>', 'seedSage', 1, 6),
      shelf('Grow serum <small>one growing plot is ready at once</small>', 'serum', 1, SERUM.cost, () => toast('Grow serum. Pour it on a growing plot at your garden.')),
      { icon: 'oyster', stay: true, label: 'Oyster spawn <small>grow mushrooms: needs a shelf</small>', cost: 8, can: () => (state.cultures.oyster ? 'you have it' : true), act: () => { state.cultures.oyster = true; toast(shroomSlots() ? 'Oyster spawn. Start it on your mushroom shelf.' : 'Oyster spawn. Build a mushroom shelf at your workbench first.'); } },
      { icon: 'usb', stay: true, label: 'Dusty USB stick <small>one mystery track for your crate</small>', cost: 12, can: () => (missing(false).length ? true : 'nothing on these you do not have'),
        act: () => { const id = pickOne(missing(false)); state.crate.owned.push(id); toast(`On the stick: “${CRATE.tracks[id].name}” by ${CRATE.tracks[id].artist}. It is in your crate.`); } },
      { icon: 'poncho', stay: true, label: 'Rain poncho <small>rain stops bothering you</small>', cost: 8, can: () => (state.poncho ? 'you have one' : true), act: () => { state.poncho = true; toast('A yellow poncho. Let it rain.'); } },
    ], true) },
    { at: STALLS.cheese, r: 2.9, label: 'Grilled Cheese stall', use: () => menu('Grilled Cheese', [
      { label: 'Grilled cheese', cost: 3, act: () => { add('nourishment', 0.35); add('vibes', 0.02); toast('Lot classic.'); } },
    ]) },
    { at: STALLS.burrito, r: 2.9, label: 'Veggie Burritos stall', use: () => menu('Veggie Burritos', [
      { label: 'Veggie burrito', cost: 5, act: () => { add('nourishment', 0.6); add('vibes', 0.03); toast('That will hold you.'); } },
    ]) },
    { test: (p) => p.z < -161.3 && p.x > -19, label: 'The river', use: () => menu('The River', [
      { label: 'Rinse off and cool down (free)', act: () => { add('hygiene', 0.65); add('hydration', 0.12); add('vibes', 0.04); pass(0.25); toast('Cold, clean, alive.'); gain('wellness', 2); } },
    ]) },
    { test: (p) => nearPal(p), label: 'Talk to Moonbeam, your neighbour', use: palMenu },
    { test: (p) => nearHurt(p) !== undefined, label: () => `Help: this person ${AILS[nearHurt(getPlayer().root.position) % AILS.length][0]}`, use: helpSomeone },
    { test: (p) => nearLitter(p) >= 0, label: 'Pick up litter', use: () => {
      const i = nearLitter(getPlayer().root.position);
      if (i < 0) return;
      state.litter[i] = total() + 6; state.picked++;
      add('vibes', state.trophies.grabber ? 0.024 : 0.012);
      const scrap = (state.trophies.grabber || Math.random() < 0.35) && room('bag', 'salvage') >= 1;
      if (scrap) give('salvage', 1);
      toast(scrap ? 'Binned it, and kept a useful bit. +1 salvage.' : ['Binned it. The lot looks a little better.', 'Leave no trace.', 'One less can in the grass.'][state.picked % 3]);
      craftXp(1); sfx('pick');
    } },
    { test: () => !!buyer(), label: pitch, use: sell },
  );

  // the tank sits close to the stove and cooler, so it gets first say when you stand next to it
  interactables.unshift(interactables.splice(interactables.findIndex((i) => i.label === 'Your tank'), 1)[0]);

  // ---- saving. The game saves itself once you are free to roam; the opening is short enough to replay.
  const KEEP = ['hour', 'day', 'cash', 'stash', 'cheese', 'sold', 'needs', 'vibes', 'lot', 'gear', 'water', 'pileNext', 'bag', 'store', 'village', 'craft', 'skills', 'points', 'litter', 'picked', 'towing', 'raid', 'raidNext', 'chain', 'trophies', 'garden', 'weather', 'permitDay', 'heal', 'tree', 'dayLog', 'pal', 'danced', 'over', 'daily', 'fizzUntil', 'poncho', 'nos', 'body', 'offer', 'plots', 'recipes', 'shrooms', 'cultures', 'journal', 'prints', 'wild', 'wildDone', 'rainedAt', 'fakes', 'sets', 'fx', 'glow', 'vision', 'visionUsed', 'crate', 'kitchen', 'crewDay', 'pantry', 'pantryCheese', 'corner', 'reckon', 'crewShifts'];
  let saveClock = 0;
  function save() {
    if (state.mode !== 'free') return;
    const p = getPlayer().root;
    const data = { v: 2, at: Date.now(), look: { ...look }, pos: [p.position.x, p.position.z, p.rotation.y], zones: [...state.zonesSeen] };
    for (const k of KEEP) data[k] = state[k];
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(data)); } catch (e) { /* private window or full disk: play on without saving */ }
  }
  window.addEventListener('beforeunload', save);

  // ---- the first-hustle quest (a draft: the bible only names grilled cheese as the starter hustle)
  const LOT = [['camp', 'Find your camp in the Campgrounds'], ['supplies', 'Buy bread and cheese at the General Store'], ['cook', 'Cook grilled cheese on your camp stove'], ['sell', 'Sell three sandwiches'], ['sleep', 'Sleep or nap in your tent']];
  // ---- the quests that follow Lot Life 101. Each pays cash, a skill point and a trophy that stands at your camp.
  const CHAIN = [
    { title: 'Leave It Better', cash: 15, trophy: 'grabber', reward: 'the Golden Grabber for your camp: litter is worth double Vibes and always gives salvage.', steps: [
      ['digs', 'Dig through the Free Pile 3 times', () => state.chain.stats.digs >= 3], ['litter', 'Pick up 5 pieces of litter', () => state.picked >= 5],
      ['build', 'Build something at your workbench', () => state.chain.stats.builds >= 1], ['sling', 'Make the cup-holder sling', () => made('sling')]] },
    { title: 'Lot Legend', cash: 25, trophy: 'spatula', reward: 'the Golden Spatula for your camp: your best sandwiches sell for $1 more.', steps: [
      ['sold', 'Sell 15 grilled cheese', () => state.sold >= 15], ['perfect', 'Cook a Perfect grilled cheese', () => state.chain.stats.perfect >= 1],
      ['hustle', 'Reach Hustle level 4', () => level('hustle') >= 4], ['rich', 'Have $100 at once', () => state.cash + state.stash >= 100]] },
    { title: 'Home Sweet Home', cash: 30, trophy: 'flag', reward: 'the Camp Flag: nobody raids a camp flying it, and your Vibes rise while you are home.', steps: [
      ['fly', 'Put a rainfly on your tent', () => state.gear.tent >= 3], ['lock', 'Buy camp security', () => state.gear.lock >= 2],
      ['herbs', 'Harvest herbs from your planter', () => state.chain.stats.herbs >= 1], ['rain', 'Sit out some rain at camp, in the dry', () => state.chain.stats.rainCamp >= 0.25]] },
    { title: 'Good Neighbour', cash: 40, trophy: 'disco', reward: 'the Disco Ball for your camp: every dance lifts your Vibes further.', steps: [
      ['pal', 'Reach friendship 3 with Moonbeam', () => state.pal.friend >= 3], ['kandi', 'Trade 5 kandi bracelets', () => (state.chain.stats.kandi || 0) >= 5],
      ['heal', 'Help 5 people who need a healer', () => state.heal.count >= 5], ['headliner', 'Dance to the headliner (after 10 PM)', () => (state.chain.stats.headliner || 0) >= 1]] },
  ];
  const lotDone = () => LOT.every(([k]) => state.lot[k]);
  // ---- once the quests run out, the lot sets one small job a day
  const DAILY = [
    ['Sell 10 grilled cheese today', 10, () => state.sold], ['Help 3 people who need a healer today', 3, () => state.heal.count], ['Bin 8 bits of litter today', 8, () => state.picked],
    ['Dance through 3 songs today', 3, () => state.danced], ['Trade 4 kandi bracelets today', 4, () => state.chain.stats.kandi || 0],
  ];
  function dailyTick() {
    let d = state.daily;
    if (!d || d.day !== state.day) {
      const kind = (state.day * 2 + (d ? d.kind + 1 : 0)) % DAILY.length;
      d = state.daily = { day: state.day, kind, base: DAILY[kind][2](), done: false };
      if ($('qtitle').textContent !== 'Good Vibes Only') life.showQuest();
    }
    const [, goal, value] = DAILY[d.kind];
    if (!d.done && value() - d.base >= goal) {
      d.done = true; state.cash += 10; state.points++;
      const lost = give('serum', SERUM.perJob, undefined, true) > 0; // what will not fit in the bag is left behind unless you are at camp
      tick('daily'); sfx('level'); levelUp('Job of the day done', `+$10, a skill point and ${lost ? 'a bottle of grow serum you had no room for' : 'a bottle of grow serum'}. A new one tomorrow.`);
    }
  }
  function chainTick() {
    if (!state.lot.on || !lotDone()) return;
    if (state.chain.i >= CHAIN.length) { dailyTick(); return; }
    if ($('qtitle').textContent === 'Lot Life 101') { life.showQuest(); toast('Lot Life 101 done. New quest: Leave It Better.'); }
    const q = CHAIN[state.chain.i];
    let all = true;
    for (const [id, , ok] of q.steps) { if (ok()) tick(id); else all = false; }
    if (!all) return;
    state.chain.i++; state.cash += q.cash; state.trophies[q.trophy] = true; state.points++;
    sfx('level');
    card(`Quest complete: ${q.title}`, `+$${q.cash}, a skill point, and ${q.reward}`, 4600, () => { life.showQuest(); save(); });
  }
  const life = {
    startQuest() { state.lot.on = true; life.showQuest(); },
    showQuest() {
      if (!state.lot.on || state.mode !== 'free') return;
      if (!lotDone()) { quest('Lot Life 101', LOT); for (const [k] of LOT) if (state.lot[k]) tick(k); return; }
      const q = CHAIN[state.chain.i];
      if (q) { quest(q.title, q.steps.map(([id, text]) => [id, text])); for (const [id, , ok] of q.steps) if (ok()) tick(id); }
      else if (state.daily) { quest('Job of the day', [['daily', `${DAILY[state.daily.kind][0]} ($10, a skill point and a grow serum)`]]); if (state.daily.done) tick('daily'); }
      else quest('Festival regular', [['free', 'The lot is yours.']]);
    },
    // Put a saved game back. main.js has already switched to free roaming and moved the player.
    load(data) {
      for (const k of KEEP) {
        if (data[k] === undefined) continue;
        if (state[k] && typeof state[k] === 'object' && !Array.isArray(state[k])) Object.assign(state[k], data[k]); else state[k] = data[k];
      }
      state.kitchen.queue = []; // customers do not wait through a reload
      for (const id of CRATE.start) if (!state.crate.owned.includes(id)) state.crate.owned.unshift(id); // tracks added to the starting crate since this save
      state.corner.queue = []; state.corner.open = false;
      const whole = (list) => list.map((s) => (typeof s === 'number' ? { p: s, f: [] } : { p: s.p, f: s.f || [] })); // sandwiches were once only a price; for a day they could also go stale
      state.cheese = whole(state.cheese); state.store.cheese = whole(state.store.cheese); state.pantryCheese = whole(state.pantryCheese || []);
      if (!data.plots && data.garden && data.garden.on) state.plots = [{ crop: 'herbs', wet: data.garden.wet, start: data.garden.start, ready: data.garden.ready }]; // a planter from before the garden grew
      if (onGear) onGear(state.gear, state.craft.made);
      gfx.setTime(state.hour);
      drawHud();
    },
    save,
    key(e) {
      if (decks.active) return true; // the Decks have their own hands
      if (state.filling) { if (e.code === 'Space' && !e.repeat) fillHold(true); else if (e.code === 'Escape' && !state.filling.started) closeFill(true); return true; }
      if (state.cooking) {
        if (e.code === 'Space') cookPress();
        else if (e.code === 'KeyA' || e.code === 'ArrowLeft') cookPress(0);
        else if (e.code === 'KeyD' || e.code === 'ArrowRight') cookPress(state.cooking.pans > 1 ? 1 : 0);
        else if (e.code.startsWith('Digit')) { const item = state.cooking.tops[+e.code.slice(5) - 1]; if (item) cookTop(item); }
        else if (e.code === 'Escape') stopCooking();
        return true;
      }
      const kinds = { KeyI: 'bag', KeyK: 'skills', KeyM: 'map', KeyH: 'guide', KeyJ: 'journal' };
      if (state.panel) {
        if (e.code === 'Escape' || e.code === 'Tab' || kinds[e.code] === state.panel) togglePanel(false);
        else if (kinds[e.code]) togglePanel(true, kinds[e.code]);
        return true;
      }
      if (state.menu) {
        if (e.code.startsWith('Digit')) choose(+e.code.slice(5) - 1); else if (e.code === 'Escape' || e.code === 'KeyE') closeMenu();
        return true;
      }
      if (!state.canMove || (state.mode !== 'free' && state.mode !== 'chase')) return false;
      if (e.code === 'Tab') { togglePanel(true); return true; }
      if (kinds[e.code]) { togglePanel(true, kinds[e.code]); return true; }
      if (e.code.startsWith('Digit')) { const s = slotsOf('bag')[+e.code.slice(5) - 1]; if (s && ITEMS[s.k].use) { useItem(s.k); return true; } }
      if (e.code === 'KeyB' && discreet() && state.nos.tank) { fillFive(); return true; }
      if (e.code === 'KeyX' && atStage()) { dance(); return true; }
      if (e.code === 'KeyQ') { if (!waveOff()) nextOffer(); return true; }
      if (e.code === 'KeyC' && state.canMove && !state.menu) { // C opens your shop's menu wherever E is busy serving
        const here = getPlayer().root.position;
        if (atCounter(here)) { counterMenu(); return true; }
        if (atCorner(here)) { cornerMenu(); return true; }
      }
      if (e.code === 'KeyF') { eat(); return true; }
      if (e.code === 'KeyR' && state.towing && state.water > 0) { state.water--; add('hydration', sip()); toast('Ahh.'); return true; }
      return false;
    },
    // A click while cooking: with two pans, the left half of the screen is the left pan.
    cookTop, fillHold,
    cookClick(xFraction) { if (state.cooking) cookPress(state.cooking.pans > 1 ? (xFraction < 0.5 ? 0 : 1) : 0); },
    update(dt) {
      if (['load', 'creator', 'intro'].includes(state.mode)) return;
      if (decks.active) { decks.update(dt); return; } // the world waits while you play
      if (state.cooking) updateCooking(dt);
      if (state.filling) updateFilling(dt);
      const free = state.mode === 'free', hours = dt / HOUR;
      const busy = !state.canMove; // talking, in a menu, cooking, asleep
      pass(hours);
      gfx.setTime(state.hour);
      const sprinting = getPlayer().current === 'Run';
      const heat = 1 + 0.6 * Math.max(0, 1 - Math.abs(state.hour - 13.5) / 3.5); // hottest early afternoon
      const camp = atCamp();
      // weather: showers from Friday on, and cold in the small hours
      const w = state.weather, now = total();
      if (!w.rain && state.day >= 1 && now >= w.next) { w.rain = true; w.until = now + 1.5 + Math.random() * 1.5; if (free) toast('Rain rolling in. Get under something.'); }
      else if (w.rain && now >= w.until) { w.rain = false; state.rainedAt = now; w.next = now + 8 + Math.random() * 10; if (free) toast('The rain has passed.'); }
      const dry = camp && (state.gear.tent >= 3 || made('shade')); // a rainfly or the tarp shade rig keeps you dry at camp
      if (w.rain) {
        for (const pl of plots()) if (pl.crop && !pl.wet) wetPlot(pl);
        if (dry) { state.chain.stats.rainCamp += hours; add('vibes', hours * 0.04); } else if (!state.poncho && !fx('broth')) { add('vibes', -hours * 0.08); add('hygiene', hours * 0.05); }
      }
      if (camp && state.trophies.flag) add('vibes', hours * 0.03);
      const cold = state.hour >= 1 && state.hour < 6 && !made('vest') && !fx('broth');
      if (cold && !warned.cold && free) { warned.cold = true; toast('It got cold. A warm layer would help.'); } else if (!cold) warned.cold = false;
      const chill = (w.rain && !dry && !state.poncho && !fx('broth') ? 1.2 : 1) * (cold ? 1.25 : 1);
      const well = 1 - wellEase(level('wellness'));
      const haul = sprinting && state.towing ? 2.2 : 1; // dragging a full cooler at a run
      litter.forEach((l, i) => { l.mesh.visible = (state.litter[i] || 0) <= total(); });
      add('hydration', (-hours * 0.105 * heat * well - (sprinting ? dt * 0.004 * haul : 0)) * (state.gear.bag >= 3 ? 0.75 : 1) * (made('sling') ? 0.9 : 1)); // the hydration pack, the cup holder
      const night = state.hour >= 20 || state.hour < 7;
      add('energy', -hours * (0.045 + (n.nourishment < 0.2 ? 0.03 : 0)) * (night && made('vest') ? 0.75 : 1) * chill - (sprinting && !fx('zombie') ? dt * 0.006 * (haul > 1 ? 1.3 : 1) : 0)); // energy takes a smaller hit, or the cooler would cost more than it earns
      add('nourishment', -hours * 0.065 * well - (haul > 1 ? dt * 0.003 : 0));
      add('hygiene', -hours * 0.04 - (sprinting ? dt * 0.002 * haul : 0));
      n.buzzkill = clamp(n.buzzkill - hours * (camp ? 0.5 : 0.12) * (state.tree.silver ? 1.5 : 1)); // lying low at camp cools it fastest
      const lows = ['hydration', 'energy', 'nourishment', 'hygiene'].filter((k) => n[k] < 0.2).length;
      state.vibes = clamp(state.vibes + ((made('totem') ? 0.62 : 0.5) + (state.tree.beloved ? 0.05 : 0) - state.vibes) * hours * 0.06 - lows * hours * 0.05);
      if (!free) for (const k of ['hydration', 'energy', 'nourishment', 'hygiene']) n[k] = Math.max(n[k], 0.18); // nothing fails during the opening
      if (state.fx.zombie && now >= state.fx.zombie) { state.fx.zombie = 0; add('energy', -0.35); if (free) toast('The Zombie Legs wear off, and every step you ran arrives at once.'); }
      if (fx('soul')) for (const k of ['hydration', 'energy', 'nourishment', 'hygiene']) n[k] = Math.max(n[k], 0.1); // Old Soul: nothing puts you on the floor
      if (camp && state.glow && (state.hour >= 20 || state.hour < 6)) add('vibes', hours * 0.02 * state.glow); // glow jars at night
      document.body.classList.toggle('tripping', fx('trip'));
      if (fx('trip') && free && Math.random() < dt / 22) toast(TRIPPY[Math.floor(Math.random() * TRIPPY.length)]);
      if (free) wildTick();
      state.noSprint = n.energy < 0.08;
      for (const k of Object.keys(LOW)) {
        if (n[k] < 0.25 && !warned[k] && free) { warned[k] = true; toast(LOW[k]); } else if (n[k] > 0.4) warned[k] = false;
      }
      if (free && camp && !state.lot.camp && state.lot.on) { state.lot.camp = true; tick('camp'); toast('Home, such as it is.'); }
      if (free && !busy && state.day >= 1) {
        const p = getPlayer().root.position;
        if (zoneAt(p.x, p.z) === 'Shakedown Street' && state.cash >= 10 && !made('hoodie') && !fx('clear') && !fx('smoke') && Math.random() < hours * 0.05 * state.gear.bag) pickpocket();
        if (!camp && total() > state.raidNext && Math.random() < hours * (night ? 0.07 : 0.02) * [0, 1, 0.5, 0.15][state.gear.lock] * (state.trophies.flag ? 0 : 1) * (total() < state.pal.watch ? 0.2 : 1) * (state.kitchen.open ? 1.5 : 1)) raid();
        if (camp && state.raid) {
          const what = state.raid; state.raid = null; state.canMove = false; add('vibes', -0.08);
          card('Your camp was hit', `${what}${state.gear.lock < 3 ? ' Leather & Burner sells camp security.' : ''}`, 3600, () => { state.canMove = true; });
        }
      }
      // people who need a healer: five at a time, a new set every four hours
      if (free && state.village.elder && total() >= state.heal.next && people.length) {
        state.heal.next = total() + 4;
        state.heal.ids = Array.from({ length: 5 }, () => Math.floor(Math.random() * people.length)).filter((id, i, all) => all.indexOf(id) === i);
        if (!state.heal.told) { state.heal.told = true; toast('The Elder was right: look for the pink crosses. Bring water and herbs.'); }
      }
      marks.forEach((m, i) => {
        const f = people[state.heal.ids[i]];
        m.visible = !!f && free;
        if (f) { m.position.set(f.x, 2.3 + Math.sin(state.t * 3 + i) * 0.07, f.z); m.rotation.y = state.t * 1.5; }
      });
      if (free) { kitchenTick(); cornerTick(); reckonTick(); }
      if (free && !busy && noted !== state.day && state.hour >= 8 && state.day > 0) { noted = state.day; if (DAY_NOTE[week().name]) toast(DAY_NOTE[week().name]); }
      if (free && !busy) nosTick(hours, camp);
      if (free && !busy) {
        const act = nowPlaying();
        if (act !== state.act) { state.act = act; if (act) toast(`On the Main Stage now: ${act}.`); }
        if ((state.day > 4 || (state.day === 4 && state.hour >= 12)) && !state.over) { state.over = true; sfx('level'); togglePanel(true, 'report'); save(); } // Monday noon: the gates close
      }
      if (free && !busy) {
        chainTick();
        if (n.hydration <= 0) collapse('hydration'); else if (n.energy <= 0) collapse('energy'); else if (n.buzzkill >= 0.98) eject();
        saveClock += dt;
        if (saveClock > 8) { saveClock = 0; save(); }
      }
      drawHud();
    },
    // The Chill-Out Tent: free water, and a cot for an hour off your feet.
    chill(drink) {
      menu('Chill-Out Tent', [
        { label: 'Drink water <small>free</small>', act: drink },
        { label: 'Lie down on a cot for an hour <small>some Energy back, without the walk to camp</small>', can: () => (n.energy > 0.85 ? 'you are not tired' : true), act: () => {
          state.canMove = false;
          pass(1);
          add('energy', 0.22 + (state.tree.nap ? 0.1 : 0)); add('hydration', -0.03); add('nourishment', -0.035); add('vibes', 0.04); n.buzzkill = clamp(n.buzzkill - 0.1);
          gfx.setTime(state.hour);
          card('An hour on a cot', 'Fans, shade and somebody else keeping watch. Your legs work again.', 2200, () => { state.canMove = true; gain('wellness', 1); save(); });
        } },
      ]);
    },
    elderShop,
    toast, add, give, sell, people, xp: gain, level,
  };
  drawHud();
  return life;
}

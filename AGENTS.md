# SHAKEDOWN: handover pack

Read this first, whichever model or person you are. It says what the project is, how to run and test it, where things live, the rules Seth has set, and the traps that have already cost time.

## What this is

SHAKEDOWN is an open-world festival life-sim: you arrive broke at a music festival and work your way up by cooking, selling, crafting, healing and DJing. The full design is the bible, `design/BIBLE.md` (355 KB; search it, do not read it end to end).

This repository is a **playable browser prototype** in three.js. It exists to prove the game's rules and feel. The final engine is undecided (decision 46: Unreal Engine 5 will not run on Seth's M2 / 8 GB Mac), so:

- **Rules and numbers survive; browser code may not.** Put rules in plain data files (`game/data/*.json`) and keep rule code separate from drawing code where you can.
- **3D stays as plain shapes** unless Seth asks otherwise. Do not spend money on 3D models until the engine is chosen.

## Run it

```bash
bash game/play.sh --open
```

That serves `game/` on port 8790 and opens it. There is no build step, no package manager and no dependencies to install; three.js r160 is vendored in `game/lib/`.

The Desktop app is a separate copy of the game. Rebuild it after every change Seth should play:

```bash
bash tools/build_app.sh art/logo/icon-a-festival-sun.png
```

It needs `art/logo/`, which is on Seth's Mac but not in the repository (see "What is not in git").

## Where things are

| Path | What it is |
|---|---|
| `game/index.html` | The page: HUD, panels, all CSS. Loads `main.js?v=N`. |
| `game/main.js` | The world: map, props, characters, camera, input, the opening quest, the game loop, the camp's 3D look. |
| `game/life.js` | Nearly all game rules: needs, bag and stash, gear ladders, skills and perks, cooking rules, selling, theft and raids, weather, quests, Moonbeam, the nitrous storyline, garden, mushrooms, journal, save and load, the HUD. |
| `game/cook.js` | First-person grilled cheese view (drawing only; rules are in `life.js`). |
| `game/decks.js` | The DJ mixing minigame. Top half is rules, bottom half is drawing and sound. |
| `game/crowd.js` | The crowd's daily routine and walking. |
| `game/gfx.js`, `portrait.js`, `sound.js`, `icons.js` | Graphics quality levels, talking-head portraits, synthesised sound, inventory icons. |
| `game/data/garden.json` | Crops, sandwich fillings, grown and wild mushrooms. |
| `game/data/crate.json` | DJ tracks and the scoring rules of a set. |
| `game/data/crowd.json` | Where the crowd is at each hour. |
| `game/assets/` | Slimmed character models, props, textures, journal illustrations. |
| `design/camp-upgrade-map.md` | **Plan of record** for everything upgradeable at camp: 14 ladders with prices and benefits, what is built, the build order. |
| `design/decisions.md` | Numbered decisions Seth has made, plus notes on each system as built. Add to it when you build something. |
| `design/camp-gear.md`, `camp-and-needs.md`, `map-plan.md`, `wardrobe-plan.md`, `future-ideas.md` | Older plans and history. `camp-upgrade-map.md` wins where they disagree. |
| `design/food-truck-path.md` | The agreed path from walking vendor to food truck: six steps, wages, the van conversion, prices checked against test runs. |
| `game/dev/bot.js` | A test player that plays the real rules at high speed and reports income. Use it to check any price or balance change. |
| `tools/` | Blender and shell scripts for models, and `build_app.sh`. |

## What is built

Needs bars, inventory with hotbar, camp stash, save and continue, crafting bench, gear ladders (tent, stove 1 to 7, cooler, bag, lock, garden land, mushroom shelf), five numbered skills with perks (Craft, Hustle, Wellness, Charisma, Decks), grilled cheese cooking, selling sandwiches, water and balloons, the towed cooler, pickpockets and camp raids, weather, a quest chain and daily jobs, Moonbeam the neighbour, dancing, healing, the Vinny and Whip nitrous storyline with seven endings, a six-plot garden, fillings from crops, mushroom growing and foraging with a field journal, the Trip and Vision Quest, the General Store, the Decks minigame at the Open Decks tent, a crowd that follows a daily timetable and a weekly one (festival Thursday to Sunday, exodus Monday, quiet Tuesday, arrivals Wednesday), a camp kitchen where customers walk up and order sandwiches by name, a pantry for ingredients at the counter, cooked sandwiches that go stale at dawn, and Moonbeam for hire by the day.

## What is next

Seth's agreed order is the build order at the end of `design/food-truck-path.md`, whose first step (the camp kitchen) has a first version built. Still unbuilt from the map: the car ladder (Find Your Car, van $2,000, RV $12,000 which starts the Tour), storage, comfort, security extras, power and light, hygiene gear, workbench levels, more kitchen gear.

Good jobs to hand to a second model, because they are already specified: any ladder in `camp-upgrade-map.md` marked "Next", more content in the three data files, balance tuning, interface polish.

## Rules Seth has set

- Skills only rise by doing the matching thing. Charisma does not rise from selling.
- No skill or perk reduces camp raids.
- Recipes and fillings come from growing or foraging, never from buying a better ingredient.
- Duct tape is not sold.
- Hired helpers are paid a daily wage, never a share of the takings.
- Whip and his goons dress like festival-goers, not in designer clothes.
- This festival never ends: the days keep flowing and the week comes round again. It stays the home base; the RV is what starts the Tour.
- Mouth animation on talking heads is deferred.
- Paid art generation: hold 3D spending until the engine is chosen; 2D art that carries over is fine. Ask before spending.

## How to change the game safely

1. **Bump the cache-busting versions.** Every module is imported as `./file.js?v=N`. When you change a file, raise its number where it is imported, and raise `main.js?v=N` in `index.html`. If you skip this the browser keeps running old code.
2. **Test in the browser before saying it works.** The page exposes a test hook, `window.__game`, once loading finishes: `state`, `life`, `player`, `people`, `decks`, `crowd`, `gfx`, `step(n, dt)` and more. The usual pattern:
   - Open `http://localhost:8790/?gfx=0` (locks graphics quality) and wait for `window.__game.life`.
   - Skip the character creator: set `state.mode = 'free'`, `state.canMove = true`, hide `#creator`, show `#hud`.
   - Teleport with `player.root.position.set(x, 0, z)`, advance frames with `step(n, 1/30)`, press keys by dispatching `KeyboardEvent('keydown', { code })` on `window`.
   - The "nearby thing" prompt only updates inside `step`.
   - Stub `Math.random` to force an outcome.
3. **Never leave a test save behind.** Before leaving the page: `window.removeEventListener('beforeunload', life.save)`, `localStorage.removeItem('shakedown-save-1')`, and set `state.mode = 'creator'`. Otherwise Seth's next launch loads your test state.
4. **Save format.** `localStorage['shakedown-save-1']`, version 2. Only state keys in the `KEEP` list in `life.js` are saved; add yours. Loading merges nested objects, so new fields with defaults survive old saves. Every key in `ITEMS` is given a zero count in the bag and stash at start; a new item without that shows as "no room in your bag".
5. **Time.** `HOUR = 50` real seconds per game hour. `total() = day * 24 + hour`. Days keep counting past Monday; never compare against a clamped day.
6. **Rebuild the Desktop app**, then commit.

## Traps that have already bitten

- The dev server runs on **8790**; the Desktop app serves on **8777**. Saves are per port, so a save made in one is not in the other.
- People are instanced statues with no skeleton. Moving one means rewriting its instance matrix (see `crowd.js`).
- Models do not face +z. To aim something at a character's face use the `headfront` bone, not the root's rotation.
- A full-screen level-up card interrupted play and was replaced by a slide-in note. Keep notices non-blocking.
- An interactable listed later can be shadowed by a nearer one listed earlier; the tank had to be moved to the front of the list.
- A key press that picks a menu option can also reach whatever the option opens. `decks.js` ignores key presses for one tick after a set starts for this reason.
- Anything that jumps the clock (sleep, loading, a DJ set) must leave the crowd, crops and timers consistent; the crowd snaps to its timetable when time jumps more than a quarter of an hour.
- Nothing here has automated tests. Verification so far is scripted browser runs and screenshots, plus Seth playing. Sound has never been checked by anyone but Seth.
- Balance numbers are first guesses except the cooler-versus-walking money check.

## What is not in git

- `art/`: 707 MB of source 3D models, references and the app icon. On Seth's Mac at `~/code/shakedown/art` only. There is no backup of it.
- `.claude/HANDOFF.md`: session notes.
- The Desktop app itself (`~/Desktop/SHAKEDOWN.app`), which is rebuilt from `game/`.

## Working with Seth

Seth is the designer and plays every build. Explain in plain words what changed and how to see it in the game; say plainly what you tested and what you did not. Ask before anything that costs money or leaves the machine. When a decision is his, give a recommendation and ask once.

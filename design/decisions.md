# SHAKEDOWN — Decision Log (continues the bible's 45)

Decisions made during the build, newest last. The bible's own log (questions 1–45) is in Part 0.

46. **Engine on current hardware?** → UE5 will not run on the M2 / 8 GB Mac. Phases 0–4 (setup, art style, Style Bible, browser prototypes) proceed with no engine. Engine choice (Godot here vs UE5 on new hardware) is deferred to Phase 5. *(2026-11-16)*

47. **Art style?** → **A, painterly heightened-real**, is the game's look. **H (retro low-res)** becomes a graphics toggle derived from the A assets (low render resolution, pixelated textures, lowest-detail models), not a second asset set; it doubles as a performance mode. **F (underground comix)** is the 2D layer (quest log, phone, banners, posters). **D (claymation)** is for trip sequences. Round 2 stress tests not yet run. *(2026-11-16)*

48. **Character pipeline?** → Higgsfield reference image (front view, A-pose, wide stance, plain background, no held props) → Tripo image-to-3D → Blender slim to ~40,000 triangles with 2048 px textures, turned to face −Y → Meshy rigging (24 bones + one animation). The model **must** face forward before rigging or the skeleton is built wrong. Scripts in `tools/`. *(2026-11-16)*

49. **How is Buck "naked"?** → **Censor effect in-game.** The model keeps shorts-shaped geometry recoloured to skin tone, and the engine draws a pixel-blur that tracks his hips from every camera angle. No nude model is made. The comedy is the censor itself. *(2026-11-16)*

## 50. Modular clothing works: one base body, separate pieces (16 Nov 2026)
Tested in `art/modular/`. A bare base body is rigged once (24 bones). Each clothing piece is generated as its own image ("ghost mannequin", body removed), turned into its own 3D mesh, then fitted and bound to the base body's skeleton by `tools/fit_clothes.py` using `fit-config.json`.
- **Soft pieces** (tee, shorts) copy the body's bone weights, so they bend with it.
- **Hard pieces** (hat, bag) follow one bone, or blend between two.
- **Skin under a worn piece is hidden**, so it cannot poke through.
- Cost per piece: about 0.5 credit for the image and 9 for the 3D model. No rigging cost per piece.
- Known limits: each piece needs a few hand-tuned numbers to fit; hats do not grip the head; straps do not wrap round the body; one body shape only so far.

## 51. Skills: numbered levels plus a nine-branch tree (16 Nov 2026)
Seth's call. Changes Part 5 of the bible (the Skill Tree).

**Two systems, both kept.**
- **Numbered skill levels** (Runescape-style). Each activity has a level that rises only by doing it, with a high ceiling. This is the long chase. A level never goes down.
- **The skill tree** stays as written: branches, five tiers (Novice → Adept → Pro → Master → Capstone), scarce points you choose how to spend, Capstones locked behind questlines.
- **How they connect.** Levelling a numbered skill is one way to earn skill points, alongside quests and mentors.
- **Vision Quest stays.** Once per festival you can move a few spent points.
- **Calling stays emergent.** Nothing is picked at character creation; you can pivot in the same save.
- To tune in playtest: level ceiling, and how slowly a long-time player can buy the whole tree (the Certified Head).

**Nine branches.** The original seven (The Decks, Production, Hustle, Charisma, Streetwise, Wellness, Ringleader) plus two new ones. Tier contents below are first drafts.

| Branch | Covers | Novice → Master (draft) | Capstone (draft) |
|---|---|---|---|
| **Craft** | Making things: clothing, pins, kandi, glass, salvage builds | **Scrapper** (scavenging: spot better finds in the Free Pile and trash; cut, distress, basic tie-dye) → **Stitcher** (patchwork, sewing, useful salvage gear) → **Tailor** (fitted pieces, printing, embroidery) → **Designer** (original designs, LED wiring, limited runs) | **Label**: your own brand, sewn-in tag, pieces other characters seek out |
| **Tech** | Building and running gear: sound rigs, visuals, stage builds | **Roadie** (set up and patch gear, basic repairs) → **Tuner** (tune a rig to a space, run simple visuals) → **Builder** (build custom speakers and screens) → **Systems Head** (full stage design, sound and visuals together) | **The Wall**: the rig or visual show every stage wants to book |

**Folded in, not separate branches.**
- **Scavenging** is the early tiers of Craft.
- **Flow arts and fire spinning** sit under Charisma as a performance line.

Craft is about making; Hustle stays about selling, so a Maker invests in both. Tech serves both the Sound Engineer and the VJ paths.

## 52. Money is a number, not a bar (17 Nov 2026)
Seth's call. The bible lists Bankroll alongside the needs meters. It is not a meter: the HUD just shows how much cash you have. The needs bars are Hydration, Energy, Nourishment, Hygiene, Vibes and Buzzkill, plus Body (only shown when it moves).

### Decision 51 in the prototype (17 Nov 2026)
Four numbered skills are playable: Craft, Hustle, Wellness, Charisma. Each rises only by doing, ceiling 99. Levels need 8, 20, 38, 62, 92, 130 xp, then a growing step. Every level-up banks one skill point; the tree to spend them on is not built. All numbers are first guesses.

| Skill | Earns xp from | Each level gives |
|---|---|---|
| Craft | Digging the Free Pile (2), litter (1), salvage builds (4), recipes (6 to 20) | Better finds; recipes unlock at levels 1 to 5 |
| Hustle | Cooking a sandwich (1, perfect 2), selling a sandwich (2), selling a water (1) | +1.5% chance of a yes, up to +12% |
| Wellness | River rinse (2), shower (2), nap (1), night's sleep (3), sound bath (1 + hits), free water when thirsty (1) | Thirst and hunger build 3% slower, up to 20% |
| Charisma | Every offer you make (1), first talk with the Village Elder (3) | Security 5% easier on Street vending, up to 40%; people can be asked again 15 minutes sooner per level |

### The Decks in the prototype (18 Nov 2026)
The mixing game from bible Part 2 is playable at its smallest size, at the Open Decks tent on the camp side of the Main Stage field. Rules live in `game/decks.js` (top half) and numbers in `game/data/crate.json`, so they carry to another engine; the sound is made in code and is a stand-in for real tracks.

- **A set** is three mixes on the house controller: pick the next track, line its beats up under the one playing (← →), Space on a phrase to start a 16-beat blend, Space again mid-blend to swap the bass.
- **Scoring a mix:** beat alignment 40%, phrase timing 15%, bass swap 15%, key match 15%, mood 15%. Crowd Energy moves by up to a quarter either way. Failures: train wreck (beats apart during the blend), dead air (the track runs out after 96 beats), key clash, a tempo jump over 8%.
- **Reading the room:** before each mix the floor wants it harder, the same, or a breather; the next track's energy (1 to 5) answers that.
- **Training wheels:** tempo sync, a phase meter and key hints. From Decks level 3 you can play without them for 40% more xp and bigger lifts.
- **Crate:** 15 tracks, 5 to start. More from a $12 Dusty USB at the General Store, and one a day from Lost Sock after a set at 75% or better (unreleased ones at 90%).
- **Pay:** Decks xp (a fifth numbered skill, three perks), small tips, Vibes. Low Hygiene starts the floor colder. The clock stops during a set, then moves one hour.
- **Not built:** ranks and bookers, owning decks, B2B, the silent disco battle, Signature Sounds, importing your own music.

### The crowd moves (18 Nov 2026)
Every festival-goer now has a day, driven by the timetable in `game/data/crowd.json` (rules in `game/crowd.js`). Shares of the crowd by hour: asleep in their tents from 3 AM, waking from 8, a lunch rush on Shakedown Street at noon, the Main Stage field from 2 PM, a dinner rush at 6, nearly everyone at the headliner at 10, late-night munchies after midnight. Rain sends half the stage crowd back to camp.

- People walk the main path on the right-hand side, each a little late or early, and stop for a few seconds when you step up to them so you can make an offer.
- You can walk through people who are walking, not people who are standing. Sleeping people are gone from the world (in their tents) and cannot be sold to.
- Moonbeam, the Healing Village regulars and anyone who needs a healer stay put.
- The models are still statues: walking is a glide with a step-bob until rigged, animated people exist. They walk straight through tents off the path. Positions are not saved; a time jump (sleep, loading) puts everyone where they should be.
- This is the groundwork for selling from camp: customers can now walk up.

### The week, the camp kitchen and hiring Moonbeam (18 Nov 2026)
**The week (Seth's idea).** The festival never ends, but it has a weekly shape, set in `game/data/crowd.json`:

| Day | What happens |
|---|---|
| Thursday to Sunday | The festival. Full crowd, Main Stage from 2 PM to 3 AM |
| Monday | The exodus. People walk out to the Parking Lot through the day; about a fifth are left by 4 PM. The Free Pile restocks three times as fast (Monday and Tuesday) |
| Tuesday | Quiet. About a third of the usual people: the Street's regulars, crews and lifers. No music |
| Wednesday | Arrivals from 11 AM, most of the crowd in by evening. Pre-party at the Main Stage from 8 PM |

On Monday, Tuesday and Wednesday the stage crew pays $30 for a three-hour shift (8 AM to 5 PM, once a day). The first Thursday of a new game is always full.

**The camp kitchen, first version.** Build the hand-painted sign (workbench: 1 salvage, 1 fabric, Craft 2); with the griddle and four plots you can put it up at the counter by your stove. People within 75 m walk over, up to four in a queue, between 8 AM and 2 AM, faster at mealtimes (tuned with the test player; see `food-truck-path.md`). Each wants one of three things: whatever is hot, a proper golden one ($3 or better), or something special ($5 or better, only once you have grown a filling). Serve with E: the cheapest sandwich that meets the order, for its price plus $1. The wrong sandwich is refused half the time. They wait about an hour of game time. An open kitchen is raided half again as often.
*Not built:* the star rating, cooking to order.

**Orders by named sandwich (18 Nov 2026, second session).** A cooked sandwich now remembers what is in it: `{ p: price, f: [fillings] }` (old saves, which held prices only, are converted on load). At the stove, if you hold any filling, a menu asks what goes in: the best you have, one filling by name, or plain; the choice is remembered (`cookFill`). A chosen filling that runs out mid-session gives plain sandwiches, never a surprise filling. Customers at the counter ask for one of: whatever is hot (20%), a golden grilled cheese ($3 or better, 40%), or a named sandwich (40%), picked from the named sandwiches sitting cooked in your bag and stash at that moment. Serving hands over the sandwich that meets the order with the fewest fillings, then the cheapest, so specials are kept for whoever asks for them. A named order met pays a $1 tip on top (also when Moonbeam serves). A wrong sandwich is still refused half the time. The counter menu shows today's board and what is cooked; the bag shows the same breakdown. Settings are the `KITCHEN` line (`tip`, `mix`).
*Tried and dropped:* listing a sandwich on the board whenever you held its raw filling. Customers then ordered things that were not cooked, and a kitchen with a garden earned less than one without ($652 to $765 an hour against $841).

**Hiring Moonbeam.** At friendship 4, $35 for the day (until 2 AM), paid when you ask; one job a day. *Counter:* serves the queue from your camp stash while you are anywhere, at the sandwich's price with no extra dollar; the money goes into the stash. *Garden:* every half hour waters dry plots, picks what is ready into the stash and replants from your seeds. Standing daily pay with quitting after missed days is not built.

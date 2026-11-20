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
**Your corner, and Whip on a wage (Seth, 19 Nov 2026).** After the showdown is won (`nos.arc === 'won'`) and while you still have a tank, the crate under the YOUR CORNER sign at the far end of Shakedown Street (`CORNER` in `main.js`; the tank and balloons now stand beside it) is a place to sell from. *Post up* there between 8 PM and 4 AM: buyers walk up, three in a queue, one every 0.07 to 0.2 game hours when the crowd is thick. E sells one from the tank at your price; Q waves the buyer off. Each buyer is rolled with the same `tell()` as on foot, so about one in eleven is Officer Dan's, and you only see the tell if you would have seen it on foot (Charisma, Clear Head, or Moonbeam as lookout). Selling to one is the usual bust. Walking 14 m away, sunrise or an empty tank closes it. Buzzkill per sale is 0.08, less than on foot. *Whip:* if he is grateful after the win, $50 hires him until 4 AM. He sells from your tank every 0.12 to 0.28 game hours wherever you are and the money goes in the camp stash. He misses half the undercovers: a bust costs up to 10 fills, ends his night and keeps him in the cooler for 24 hours. A wage, never a share. Settings: `CORNER_RULES` in `life.js`, all first guesses. In one test he sold 17 balloons ($85) in three game hours. Not built: Whip standing at the corner (his model stays behind the Costume Shop), the tank being physically moved there.

**Recorded music in the Decks game, first test (Seth, 19 Nov 2026).** A crate track may now carry `audio: { file, bpm, offset, bars }`. `decks.js` plays the file as a loop of that many bars starting at `offset` seconds, at `deck tempo / file tempo` speed, through a low-pass and a high-pass at 190 Hz feeding the deck's two faders, so the bass swap still works on a full mix. It follows the deck's beat counter by bending playback speed up to 6% (a nudge sounds like a nudge) and restarts only if more than 0.3 s out. Tracks without a file, or whose file fails to load, use the made-in-code pattern. The one test track is `glitchtest`, "Bit Crusher Stomp": 60 s of instrumental glitch hop from ElevenLabs Music v2.5 through Higgsfield (8.72 credits), prompted for 110 BPM in A minor and measured at 110.1 BPM with the first beat at 0.06 s; the last second fades out, so the loop is 24 bars. It is first in the starting crate, and added to older saves on load. Nobody has listened to it yet: tempo and loading were checked by script only. `game/assets/music/` holds the file (938 KB).

**Moonbeam is easy to pick out (Seth, 19 Nov 2026).** Seth could not tell which person at camp was Moonbeam. Moonbeam was an ordinary crowd figure with a random body and colours on every launch. Now: the same body, size and colours every time (`person(..., look)` in `main.js`), a MOONBEAM nameplate floating over their head, and a small moon camp around them that nothing else on the grounds has (indigo rug with a ring of stars, a glowing crescent on a pole, stars on a string, a lantern). All plain shapes, no spend. Seth asked for a model of Moonbeam's own; that needs paid 3D generation and Blender, which the standing rule holds until the engine is chosen, so it is waiting on his say-so.

**A harvest is never lost (Seth, 19 Nov 2026).** Picking a crop or a mushroom with no room used to clear the plot and throw the overflow away. Now a harvest goes to bag, then stash, then the produce cabinet (`stow`); whatever does not fit stays on the plant (`left` on the plot or shelf spot) and the menu shows how many are still there. With no room at all, nothing is picked. Moonbeam's garden job follows the same rule and does not replant over a part-picked plot. Foraged wild mushrooms already refused to pick with a full bag.

**Short cooking sessions explained; a case of bread and cheese (19 Nov 2026).** Seth reported the stove cooking a couple of sandwiches and stopping. Cause: a $5 pack is 5 sandwiches, and the griddle does two per flip across two pans, so a pack lasts three flips. The stove now says at the start when a session will be short and why (bread and cheese, or room in bag and stash), and again at the end. The General Store also sells a case (20 for $20, same price each) and bread and cheese stacks to 10.

**Filling balloons is a minigame (Seth, 19 Nov 2026).** At your corner E no longer sells at once; it opens the fill panel. Hold Space (or the button) and the balloon grows, faster the fuller it gets; let go inside the gold band. The band's centre moves a little for every balloon. Perfect (the bright middle): price plus a $1 tip. Good: price. Outside the gold: $2 less, never under $1. Run it to the end and it pops: the fill is wasted and the same buyer waits for another go. Every attempt uses one fill. Tingle Fingers makes the fill rate jump about; Clear Head slows it. An undercover is only sprung when you hand a finished balloon over. Rule code and numbers: `FILL` and `startFill`/`endFill` in `life.js`; drawing is the `#fill` panel. Whip's sales do not use it. On-foot balloon sales still come from balloons you filled at the tank menu, with no minigame.

**The Elder and the balloons (19 Nov 2026, built while Seth was out, on his instruction to start a new story part).** This is the storyline Seth asked about: buyers ending up in the Healing Village and the Elder objecting. It needs the Elder to have been met. At 12 balloons sold a message says three people are on cots in the Chill-Out Tent and the Elder is asking for you. Talking to her then gives three choices. *Make it right:* sit with three people who need a healer (the pink crosses), then return. She teaches "the Elder's way": casualties drop from every 6th sale to every 12th, she stands with you in the showdown again whatever you have sold, +1 skill point. *Give it up:* she takes the tank for good (no balloons, no corner). Seth: the first reward (a reishi culture and two skill points) was far too small for giving up the corner for ever. It is now $300 from the Village's bowl, 5 skill points, every culture the Elder keeps, and from then on $8 for each person you heal (`quitCash`, `quitPoints`, `healerPay`). *It is only balloons:* she will not open her jars to you until you choose one of the others. At 60 sold without having made it right, her people warn buyers off you: on-foot balloon sales are 15 points less likely and the corner's queue fills half as fast. Settings: `RECKON` in `life.js`. State: `state.reckon`. Not built: anything visible in the Chill-Out Tent, and a quest-tracker entry (it is driven by messages and her conversation).

**Dropping and selling from the bag (Seth, 19 Nov 2026).** Every bag item has a Drop button: one stack, gone for good (for sandwiches, the worst first). Standing at the General Store or Leather & Burner, sellable items also show Sell: salvage $1, fabric $1, fairy lights $2, kandi $1, water bottles $1, tomatoes $1, peppers $1, oyster $1, chanterelle $2, morel $3 each. Herbs and sage are not sellable, because they would pay for their own seeds.

**Toppings by hand, and the counter's E key (Seth, 19 Nov 2026).** The menu before the stove is gone. In the cooking view a strip lists the fillings you hold, numbered; pressing a number (or clicking it) puts that topping on the sandwich in the pan furthest along that has room. One topping a sandwich, two with the sandwich press; on the griddle one press tops both sandwiches of the flip. No press means plain. Toppings on a burnt sandwich are not used up. Each pan's row shows what is on it. Rule code: `cookTop` in `life.js`. While Moonbeam is hired on the counter, what you cook goes straight to the camp stash, because that is where they serve from. *The E key:* from within 2.6 m of the counter E serves whoever has waited longest; the counter menu will not open while anyone is queueing or walking up, nor for 1.5 seconds after a sale. Before, E only reached customers within 2.3 m, and from behind the counter most of the queue is further than that, so it opened the menu instead. *Measured once:* the test player, topping each sandwich with whichever kind it had least of, netted $1,360 a real hour with tomatoes and peppers (190 served, 82 walked off), against $958 when a whole session was one kind. Its stand-in garden never runs dry, so a real garden would earn less; even so the camp kitchen may now sit above its $1,000 target and near the Street table's $1,300.

**The produce cabinet; stale food tried and removed (Seth, 19 Nov 2026).** Seth asked for somewhere to stock up on what he grows so a rush does not sell him out. It is a gear ladder (`pantry` in `GEAR`, sold at Leather & Burner): produce crate $40 (12 of each), pantry cabinet $110 (30 of each), camp larder $260 (60 of each). It stands by the stove (`CAMP.pantry`) and takes bread and cheese, every filling and sage. Its menu puts everything in from bag and stash, or takes a stack of one thing back out. The stove cooks from bag, then stash, then cabinet; Moonbeam's garden job puts fillings there first; raids can take a stack from it, the same as from the stash. A first version was a free shelf at the kitchen counter holding 30 of each; anything left on it by an older save can still be taken out at the same spot. *Stale food, removed:* for one day cooked sandwiches went stale (first at the next 5 AM, then after two days, becoming $2 day-olds). Seth removed it: room for cooked food is already tight (5 to a slot) against a roomy cabinet, the test runs showed the rule barely changed income, and it read as a punishment at dawn. Cooked sandwiches keep for ever again.

**Grow serum (Seth, 19 Nov 2026).** Seth asked for a serum, earned or bought, that makes crops grow instantly. One bottle poured on a watered, growing garden plot makes it ready to harvest at once (garden menu, on the plot's own line). Two ways to get it: $10 at the General Store, no limit, and one bottle with every job of the day. It does not water a dry plot and does not work on the mushroom shelf. Numbers are `serum` in `game/data/garden.json`. Priced so a tomato or pepper plot ($12 of filling bonus from a $5 seed) roughly breaks even: it buys time before a rush, not profit. Open question for Seth: this lets money shorten growing, which sits close to the rule that fillings are never bought.

*Tried and dropped:* listing a sandwich on the board whenever you held its raw filling. Customers then ordered things that were not cooked, and a kitchen with a garden earned less than one without ($652 to $765 an hour against $841).

**Hiring Moonbeam.** At friendship 4, $35 for the day (until 2 AM), paid when you ask; one job a day. *Counter:* serves the queue from your camp stash while you are anywhere, at the sandwich's price with no extra dollar; the money goes into the stash. *Garden:* every half hour waters dry plots, picks what is ready into the stash and replants from your seeds. Standing daily pay with quitting after missed days is not built.

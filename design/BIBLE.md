# SHAKEDOWN — The Complete Design Bible & Build Handover
*Everything about the game, in one document. Compiled 2026-11-16.*

---

## What this is
This is the full, consolidated design bible for **SHAKEDOWN** — an open-world festival life-sim that's a loving satire of jam-band / bass-music "wook" festival culture. It gathers **36 design documents** into one read-through so a builder (you, steering **Claude Code** driving **Unreal Engine 5**) has every system, character, quest, and decision in a single place.

**The pitch, in three sentences.** You start as a broke wook at a massive music festival and claw your way up — as a DJ, or as a clothing Maker, a sound engineer, a party-throwing Ringleader, a VJ, a vendor, or a healer. **Act 1 (The Come-Up)** is an open-world life-sim with a real DJ rhythm game and Sims-style needs; **Act 2 (The Empire)** flips to a festival-management sim where you build the stage you once played. It's GTA/RDR2 in scope, affectionate in tone, and designed so that *connection and care are the point* — the sober, peaceful path is always fully viable.

## How to read this document
- **Part 0 (Master Index)** is the bird's-eye view: a digest of all 28+ systems, the full **decision log** (every design question we settled and why), the document map, and the build priority. **Start there.**
- **Parts 1–35** are the full deep-dive docs, grouped: the Core → the Craft (DJ + builders) → Progression & the Empire → World & Paths → Identity & Appearance → Needs/Vibes/Substances → Streetwise/Crime/Heat → Social & Expression → Economy & Longevity → Characters & Quests → **Tech & Build (Part 35)**.
- Each system doc ends with its **interlocks** (what it touches) and a **tuning note** (numbers come from playtest, not paper).

## The three design truths a builder must hold
1. **No push-button open world exists.** AI is a *supervised force multiplier*, not the dev team. The realistic stack is **you (steering) + Claude Code (drives UE5 via local MCP — not Cowork) + a 3D-asset pipeline (Meshy/Tripo/Rodin + Poly Haven + fal.ai) + Higgsfield (2D cutscenes/previs/trailers only) + UE5-native landscapes.** Full detail in Part 35.
2. **Scope is the only lever that matters.** Build the **vertical slice first** — the Mixing Engine + Shakedown Street + the Renegade Woods + the Conspiracy Circle + Buck's intro — prove the loop is fun, *then* expand one festival at a time as content layers on shared systems. The full build order is at the end of Part 0.
3. **Everything interlocks through a few shared meters.** Most systems don't stand alone — they read from and write to a small set of shared readouts (**personal Vibes**, **Cred/reputation**, **Crowd Vibe**, **the Collapse System**, **Cash↔Cred**). Build those cores once and the rest feeds them. Note the deliberate walls: **personal Vibes** (your aura, global) ≠ **Crowd Vibe** (a zone's mood) ≠ **Cred** (persistent, faction-tinted reputation, where "commercial vs. underground" lives).

## The 8 pieces of design DNA (every system obeys these)
Affectionate satire first · three-path choices (Hustle / PLUR / Chaos) · assist scaling · failures telegraphed and in degrees · systems interlock · care-as-gameplay (sober viable) · connection is the point · parody-first-then-real-partners.

---

## Contents

- **Part 0 — Master Index, Decision Log & Build Priority**
- **Part 1 — Game Design Doc — The Core**
- **Part 2 — DJ Gameplay — The Mixing Engine**
- **Part 3 — The Sound System Builder**
- **Part 4 — The Visual (VJ) Builder**
- **Part 5 — Progression & Longevity — The Skill Tree**
- **Part 6 — Advanced Systems**
- **Part 7 — Act 2 — Festival Operations**
- **Part 8 — World Structure & The Tour**
- **Part 9 — Player Paths & Identity**
- **Part 10 — The Ringleader**
- **Part 11 — Wardrobe & Fashion**
- **Part 12 — Living Hair & the Wook Barber**
- **Part 13 — The Vibes Meter — Raisers & Tankers**
- **Part 14 — Substances & the Bad Trip**
- **Part 15 — Tolerance, Greening Out & the Balloon Trap**
- **Part 16 — The Streetwise Path**
- **Part 17 — Pickpockets & Narcs**
- **Part 18 — Area Banners & Crowd Vibe**
- **Part 19 — Dance, Emotes & the Dancefloor**
- **Part 20 — Scene Status & Titles**
- **Part 21 — Pins**
- **Part 22 — The Music Ecosystem**
- **Part 23 — The Consolidated Economy**
- **Part 24 — Things To Do & Longevity**
- **Part 25 — The Social Universe (Radiate)**
- **Part 26 — NPCs — Onboarding, Patches & Reactions**
- **Part 27 — NPC Roster — The Character Bible**
- **Part 28 — Quest Discovery & Gating**
- **Part 29 — The Quest Catalog (118 quests)**
- **Part 30 — Sample Quest — The Conspiracy Circle**
- **Part 31 — Sample Quest — Breakthrough**
- **Part 32 — Sample Quest — The Master's Set**
- **Part 33 — Getting Into the Nitrous Game**
- **Part 34 — Buck (the Naked Guy)**
- **Part 35 — Tech & Build Pipeline**

---

# Part 0 — Master Index, Decision Log & Build Priority

*The bird's-eye view: the full systems digest, the complete decision log, the document map, and the build order. Read this first.*

# SHAKEDOWN — Master Design Bible (Complete)
### *The full record. Every system, every idea, every question. Open this first; the companion docs hold the deep detail.*

---

## THE PITCH

**SHAKEDOWN** is an open-world festival life-sim — a loving satire of jam-band / bass-music festival culture with the scope of *GTA*, the living world of *RDR2*, the needs-juggling of *The Sims*, and a real rhythm/mixing game at its heart. You arrive with $40 and a dream, hustle the lot, climb from silent disco to the main stage at sunrise, and in **Act 2** build and run your own festival. From recycling cans for deposit to founding the whole circuit. *PLUR. Now go make your grilled cheese empire.*

**DJ is the marquee path — but not the only one.** The spine generalizes: **broke wook → your craft → your empire.** You can climb as a DJ, or make your name as a clothing **Maker**, a **food vendor**, a **pin** artist, a **sound engineer**, a **Ringleader** (party-thrower), a **VJ**, or a **healer** — each with its own come-up and empire. And after the solo game lands, it grows into a **social universe** where your reputation is portable and your crew is real.

## THE TWO ACTS
- **Act 1 — The Come-Up:** open-world life-sim + rhythm game. A broke wook becomes a legend. Goal: headline the main stage (or top your chosen craft).
- **Act 2 — The Empire:** RCT/Thrillville management tycoon. The legend becomes a mogul. Goal: build a beloved, profitable festival (or brand). (Everyone plays both — Act 2 is the finale, not optional.)
- **The spine is path-agnostic:** a Maker goes blanket → booth → brand; the **Ringleader** goes renegade party → the whole festival. Same emotional arc, different craft.

## THE CORE LOOP (Act 1)
**Hustle for cash → spend on gear / gigs / needs → build reputation → climb toward the headline.** Juggle three pressures: **survive** (needs), **hustle** (money), **climb** (rep).

## THE TWO PATHS (identity — *not* the two acts)
A persistent **Cash-vs-Cred** trajectory you slide along:
- **Festival Legend** — commercial, sold-out, rich, mass-appeal → in Act 2, a Coachella-scale festival.
- **Underground Deity** — heady, broke, revered, the Sculptor path → in Act 2, a beloved boutique gathering.
Your specialization pushes you toward a pole; your path flavors *what kind of mogul* you become. You can't be both — and that non-convertibility is the whole point.

## MANY WAYS TO PLAY (the path system)
Identity is **emergent, not a locked class**: one character per save, pursue one path or several, **pivot anytime** (the Vision Quest respec) without starting over. Your biggest achievement headlines who you are. Build reality: **ship the DJ path deep first**, add the others (Maker, Ringleader, Sound Engineer…) like content updates — the same way multiplayer arrives after the solo game.

## DESIGN DNA (the recurring principles)
1. **Affectionate satire** — the culture is the joke and the heart.
2. **Three-path choices** — almost everything offers a **Hustle** (profit), **PLUR** (cred), or **Chaos** (fast/risky) route.
3. **Assist scaling** — accessible floor, mastery ceiling on every minigame.
4. **Failures have degrees and are telegraphed** — disasters feel earned, never random.
5. **Systems interlock** — every system casts a shadow on every other.
6. **Care is gameplay** — caretaking/harm-reduction is mechanized; sobriety is a legit build.
7. **Connection is the point** — the social layer exists to turn shared obsession into real friendship; PLUR is mechanized, not decorative.
8. **Parody first, real partners as you grow** — fictional analogs at launch (Infra-Sound, Spiral Noodles); license real festivals, vendors, artists, and pins as the audience justifies it.

---

# THE COMPLETE SYSTEMS DIGEST

### 1. World & Map Zones
Contained festival (Thu–Mon), later a **Tour** of biome-festivals. Zones: **Shakedown Street** (vendor lot / hustle hub), **The Campgrounds** (customizable home base), **Main Stage Field**, **The Renegade Woods** (after-hours DJ climb, foraging, getting lost), **Healing Village / Workshop Dome**, **Silent Disco**, **The Parking Lot** (the eternal "where's my car"), **Porta-Potty Row** (hazard), **The River** (free hygiene/hydration), **Artist/VIP Area** (rep-locked).

### 2. Needs System
Real-time meters, each answering a *different* question: **Hydration** (conscious?), **Energy** (can act/perform?), **Nourishment** (fueled + buffs?), **Hygiene** (do people want to be *near* you?), **Vibes** (are people *drawn to* you?), **Buzzkill** (is security onto you?), plus **Bankroll**.
- **Hydration collapse** is the one hard physical fail: warning signs → critical (vision/audio distortion, worse DJ timing) → **faint** (lose time, miss sets, wake at medical, vulnerable to theft). Recovers via water/shade/river/hydration-pack.
- **Hygiene vs. Vibes are orthogonal axes.** Hygiene = external/physical (smell/funk; people keep distance; a stinky DJ clears his front row; can be *masked* by deodorant/clothes). Vibes = internal/emotional (mood/aura; gates dialogue quality, important-NPC access, "selling vibes" services; earned through experiences). Four quadrants — standout: **Funky + High Vibes = beloved grimy guru** vs **Funky + Low Vibes = stinky and miserable, repels everyone.**
- **Funk is faction-relative:** repellent to VIP/bookers, but *cred* to the renegade-woods core ("the dirt is armor"). Hygiene is a choice about which scene you're smelling for.

### 3. The Hustle Economy + Dynamic Pricing
Hustles (each a risk/reward minigame): **grilled cheese** (cooking timing), veggie burritos, **cold water** (markup), **balloons/nitrous** (high risk, Buzzkill heat + Nitrous Mafia beef), **kandi** crafting/trade, heady glass/tapestries/fashion booths, **can recycling** (broke-wook bootstrap), **ticket flipping/miracles**, **vibe services** (tarot/palm/sound baths), **charger cartel**.
**Dynamic pricing** (universal layer): you set prices; demand driven by **temperature + time of day + crowd density + scarcity**. Each item has a **fair-price band** (below = sell out thin; in = the pocket; above = volume falls). **Gouging during a Heat Wave** = max cash but Buzzkill heat + Vibes hit; **fair pricing** in a crisis = Cred. Rivals reprice → price wars. UI: live Demand readout, fair-price band, slider, projected volume + sales ticker, reprice anytime. *(Full money model in the Consolidated Economy doc.)*

### 4. Factions
Seven, with their own quests; helping one can cost another: **Lot Vendors, Flow Arts Crew, Renegade DJs/Sound Crews, Healing Village, The Buzzkills (Security, inverse rep), Nitrous Mafia (optional/darker), Bookers/Promoters.**

### 5. DJ Career — The Ranks
10 ranks: Bedroom Bemused → Silent Disco Scrub → Drum Circle Selector → **Renegade Rookie** (the real beginning) → Campground Soundsystem → Side Stage Sundae → Sunrise Set Shaman → Direct Support → Main Stage Headliner → The Closer / Festival Legend. Each rank-up needs **Booker rep + a successful set + gear.**

### 6. The Mixing Engine (core of every gig)
One engine, many modes (standard set, B2B, silent-disco versus, apex). Two decks + crossfader + 3-band EQ + filter + cue. Loop: track A plays → load B → **beatmatch** → **transition** on a phrase → read the room, pick next. **Crowd Energy** meter scores it. Skill layers gated by gear (controller → CDJs → turntables → custom rig). Failure states: **train wreck** (beats drift), dead air, **key clash**. **Assist scaling**: auto-sync + suggested-track for beginners → full manual for pros/Sculptor.

### 7. Signature Sounds — The Taste Ladder
Equippable "loadouts" reshaping the minigame, the crowd, and the **Cash-vs-Cred split**. 11 tiers: **The Feels Machine** (future bass/Illenium — the starter "crap"; huge crowd, zero cred) → The 808 Stomp (trap) → Wonk Wonk Wonk (riddim) → The Gateway Drop (brostep) → Technicolor (color bass) → The Robot Uprising (neuro) → The Heady Pivot (halftime) → Amen Brother (DnB) → The Promised Land (glitch-hop) → The Sunrise Temple (downtempo) → **THE SCULPTOR** (Tipper-tier sound design + QBert-level turntablism; gear-gated on turntables + maxed sound-design tree). Read-the-room matters (wrong sound for the stage flops). Endgame: **craft your OWN signature** (sound-design tree) + genre-bend mid-set. **Two win conditions** = the sellout fork (Legend vs Underground Deity).

### 8. Your Crate (Track IDs) + Custom Import
Tracks are collectible items with BPM/key/energy/sound-tag/heat. Curate for *range* (deckbuilding meta). Collect via: **found USBs** (roulette, incl. cursed files), **NPC gifts**, **the Aux Circle** (campsite cipher minigame), **B2B trades**, crate-digging (vendors), **bedroom production**, the legendary **"The ID"** quest. **Custom import** is buildable (auto BPM/key/beat-grid analysis + time-stretch sync; precedent: Audiosurf, Beat Hazard) — gate user imports behind **Streamer Mode**. *(See the Music Ecosystem doc for the artist-upload model that supplies the default library.)*

### 9. Economy & Upgrades (three tracks + bag + cashing out)
**Never let one purchase "solve" money** — split into three tracks paying in different currencies:
- **The Decks** (instrument): access + skill ceiling, NOT cash. Tiers: laptop → 2ch controller → 4ch controller → CDJs+mixer → +turntables (scratch path) → custom rig.
- **The Soundsystem / PA** (venue): the real **cash-ROI** track — own a rig to *host* instead of guest (keep tips, charge door, sell to your own crowd, run a named stage). *(Built in depth in the Sound System Builder doc.)*
- **The Campsite** (base): shelter spine (ratty tent → tent+EZ-up → van → **RV** → glamp dome) + bolt-on **modules** each giving a *different* benefit — Kitchen (cash), Storage (capacity), Power (enabler), Comfort (time), Crafting (cash), Hygiene (upkeep), Aesthetic (social).
- **The Bag** (mobile carry, separate from the static Camp Stash): fanny pack → sling → **hydration pack** (slows hydration decay) → backpack → rolling cooler/wagon (huge but slow/restricted) → custom modular rig. *Bigger isn't always better* — heavy/flashy bags hurt stealth + draw theft. Upgrade via vendor, craft, quests/Gift Lot, or a **skill perk** ("Mule"/"Pack Rat").
- **Cashing out:** sell-back (~40–60%) OR **the Gift Lot** (gift for Cred + a loyal ally) OR pass-down to a mentee. Gift-Cred diminishes on repeats (anti-farm).
- **RV is a milestone, not the goal** (it also drives the Tour). The goal is the ascension.
- *Full faucets-vs-sinks map, the difficulty curve, broke/debt states, and the Cash↔Cred model live in the **Consolidated Economy** doc.*

### 10. The Visual Builder (in-game VJ studio)
Build a **VJ rig**, not a literal Photoshop. Layers: Loop Library → Compositor (layers/blend/masks) → **Audio-reactivity** (off the same beat-grid as the mixing engine) → generative shader FX → freehand & import → AI generation (your Higgsfield instinct, in-world) → **visual setlist**. Visuals **score into the set** (Crowd Energy/Vibes/Cred). Assist scaling: Auto-VJ → manual → Sculptor runs music *and* visuals. Ties to **brand** (recognizable look, posters, Festival Famous), a **VJ-for-hire career**, and **Act 2 stage screens**. Import caveat = Streamer Mode.

### 11. The Sound System Builder
Build a modular PA/rig from components (subs, tops, amps, processing, power). A **fixed point-pool** grounded as real physical budgets (**power / weight / space**) that **grow** with progression but never let you max every axis — so you **specialize** across **Loudness / Fidelity / Low-End / Coverage / Reliability.** **Money is a separate "quality" axis** from points (points = shape/specialization). A **Sound Check** tuning minigame dials the rig to the room. The three builders unlock in order: **Visuals (early) → Sound (mid) → Stage (late) → Festival (Act 2).** A rig accrues its **own prestige & legacy** (looks, sound, pedigree, iconic moments, soundclash record) — a famous rig becomes sought-after to hear and play on, flips the booking economy, and can be **dented.** **Soundclash PvP.**

### 12. Wardrobe & Fashion
**Player uniqueness** = deep wardrobe + many vendors; **NPC uniqueness** = procedural generation. Hybrid changing UX (closet at camp scaling with campsite tier + quick-swap bag loadouts + vendor fitting rooms + saved outfit slots). **Cosmetic-first with light functional layers** (shade slows decay, poncho for storms, layers for cold sets, flashy fit = +Charisma, faction-coded fits, stage look = recognizability). Funk accumulates visually. Vendors as "brands" (Free Pile → tie-dye → rave/kandi → heady couture → leather/burner → costume → Designer → artist one-of-a-kind). **DIY** (tie-dye, patches, pins, LEDs → Patch Jacket collectathon). Appearance layer (hair, body paint, glitter, gems, ink). **Procedural NPCs** = modular parts library + weighted archetype templates + palette variation; named NPCs hand-authored. **Character creation up front** (but you *don't* pick your DJ archetype — that's earned via the Taste Ladder). *Same parts library powers player + crowd.*

### 13. Player Paths & Identity (many ways to play)
The spine generalizes to **broke wook → your craft → your empire.** Paths (each with a Come-Up and an Empire form): **DJ/Producer** (marquee), **Sound Engineer**, **The Ringleader** (party-thrower), **The Maker (fashion)**, **Food Vendor**, **VJ/Visual Artist**, **Healer/Wellness.** **Emergent identity, no lock-in:** one character per save, dabble or commit, pivot via the Vision Quest respec, no new save needed to switch. **The Maker** has a full custom-creation tool (design tie-dye & patchwork; materials cost money; grind blanket → booth → brand) — the same small-business loop powers Food and Pins, so you can play and win **without ever DJing.** **Flow toys** = a side activity for everyone, not a career.
- **Stacking (one Calling, many Hustles):** you can do it all, limited by **time/presence** (can't be two places at once), **capital**, and skill (specialize early, master it all only over the long haul). **Delegation** — hire NPCs/friends to run a booth while you play (wages, earns less, lazy/thieving-employee risk). Your **Calling** builds identity + Cred (the ceiling); your **Hustles** are delegated cash. The Cash↔Cred split *enforces* "focus for identity + diversify for income" — you need a **name** (Cred, from your Calling) *and* **capital** (Cash, from Hustles) to found a festival.
- **Path depth is tiered (don't build seven equal games):** **Tier 1** DJ (flagship, deepest) · **Tier 2** Maker & Ringleader (full alternates) · **Tier 3** booth/food/sound/VJ/flow/healer (lighter, delegatable, support). **Quests split:** a big **universal** pool everyone shares (built once) + focused **path-specific** career chains (DJ's deepest).

### 14. The Skill Tree (built for a long game)
7 branches, **specialize-early / master-eventually** (time-gated, *not* hard-capped — you become a *type*, and only a decades-deep lifer rounds out into mastery of everything, which is what a **Certified Head** is): **Decks** (→ The Sculptor), **Production** (→ The ID), **Hustle** (→ Lot Baron), **Charisma** (→ Festival Famous), **Streetwise** (→ Ghost), **Wellness** (→ The Anchor), **Ringleader** (→ Festival Founder, unlocks Act 2). Tiers Novice→Capstone; **capstones gated behind questlines, not just points.** Points from leveling + learn-by-doing + quests. Limited respec = **the Vision Quest** (once per festival). Synergies reward hybrids.

### 15. The Streetwise Path (stealth, theft & cons)
The corrosive fast lane; **socially costed**, forks you toward the outlaw identity. Categories: **Evasion** (sneak back in, discreet dealing, lose the Buzzkills, smuggle), **Infiltration** (VIP/backstage, rider food, the 13th porta-potty), **Theft from people** (pickpocket, campsite raids, steal IDs from booths, **rob the collapsed** = dark mirror of caretaking, lift wristbands), **Theft from vendors/festival/mafia** (shoplift, skim the Nitrous Mafia, steal a rig/power, box-office heist), **Scams & cons** (fake wristbands/tickets/empty balloons, miracle scams, impersonation), **Sabotage** (tank a rival DJ, snitch/frame, Act 2 espionage), **Lockpicking & grand-theft-golf-cart**, **The Getaway** (change clothes/wash off to break a description, stash loot, bribe out), **The Underground** (the Fence; the Lot Rats thieves' crew). **Caught =** Vibes crater, heat spike, rep loss, word spreads, wholesome content locks. Crime is the fast/lonely shortcut; honest hustling stays the reliable default.

### 16. Substances & the Bad Trip
**Abstracted/satirical, harm-reduction ethos, sober fully viable.** Consumable class (alcohol, caffeine, cannabis, balloons, "party favors," "doses") with game-y buffs + risk. **Set & Setting** is the core modifier. **The Bad Trip** = the emotional crisis-event (telegraphed; world turns hostile; rising Spiral meter). Recovery *is* the gameplay: chill-out tent, water, a **breathing micro-game**, a **trip-sitter** (allies show up *if* you banked goodwill — loners suffer alone), **surrender not fight**. The *receiving* end of Sober Sunrise. Aftermath: insight + bonds, or crash/collapse/robbed + "fried" debuff + the **comedown**. The **sober path** is respected (no bad-trip risk, crisper minigames, the trusted trip-sitter, every ending reachable sober).

### 17. Dance, Emotes & the Dancefloor
Genre-specific dance styles you bust out by reading what's playing — **untz-untz** (house shuffle), **headbang** (brostep throwdown), **spaghetti/liquid** (wonky bass), plus the jam twirl, psy-stomp, d&b skank, trance hands-up, hardstyle hakken. The **crowd dances in the matching style**, so the dancefloor is a **live readout of your set** (nail the read → unison; misread → people drift; scout a stage by body language). A light Vibes mechanic — **expression-first, never a tax.** **Social emotes** are the multiplayer glue, crowned by **the PLUR handshake that trades a kandi bracelet.** Styles unlock via the Taste Ladder; your signature move shows on Radiate. Interlocks with hydration (dance hard → drink), flow toys, photo mode, wardrobe.

### 18. Scene Status & Titles (Certified Head)
A **path-agnostic** prestige layer that *reads* all your other systems and gives the culture's name for you: **Tourist → First-Timer → Festie → Lot Rat → Raver/Vet → Wook → Head → OG/Elder → Legend → ★ Certified Head** (god tier). The apex **forks** with the Cash↔Cred split: **Certified Head** (underground/Deity apex, *conferred* via a vouching rite by the heads) vs **Festival Royalty** (commercial/Legend apex); the rare **Double Crown** holds both. Plus a gallery of earned **titles/epithets** — honors (*The Miracle Worker*, *Crate Digger*, *The Trip-Sitter*, *The Connector*) and affectionate roasts (*Sparkle Pony*, *Sound Hog*, *Gate Crasher*, *Spunion*) — displayed on your profile. **Nameplates:** every character (you included) wears a title in small text above their name — your **rank by default**, or any earned **title** swapped in to flex; for NPCs it's instant characterization (*Nitrous Kingpin / Vinny*) and a running comedy engine. **Rank** (one ladder, top = Certified Head) and **titles** (a no-top collection) share that single slot.

### 19. The Music Ecosystem (artist uploads & discovery)
The fix for the copyrighted-music problem: **artists upload their *own* music** (granting a license, because exposure to the target audience *is* the payment), curated by your approval. Tracks are **tagged by subgenre** and surface through NPC DJs at matching stages/festivals — so music **finds you organically.** The existing **"what's this ID?"** Shazam moment feeds the **track-ID collection** with real tracks you can follow/support via Radiate. Honest caveats: **curation burden** (plan the ramp from solo approval → curators → community flagging) + a simple **submission license** (you own it; samples cleared). Player-produced tracks could join the pool later; scene labels can partner once you're big.

### 20. Pins (collect, craft, trade, sell)
A beloved festival micro-economy built **almost free** by reusing existing templates: **designing** pins reuses the Maker creation tool (with real pin features — sliders, spinners, danglers, glow, **blinkies**); **booths** reuse the small-business loop; **trading** reuses the kandi ritual; **collecting** feeds the passport metagame. Rarity tiers & **grails**, crew pins, a banner you flex on Radiate, titles (*Pin Baron*, *Grail Keeper*). A complete "start from nothing" business you can play without DJing. Licensed artist-collab pins fit the partnership model later.

### 21. Heat & Re-Entry (the Buzzkill system)
Buzzkill = wanted level; maxes → **ejection** (grounds cut, hustles paused, missed sets forfeited, possible fine). **Ban escalates** (first time easy; repeat offenders "flagged"). Three ways back: **Buy** (scalp a band, bribe a guard, hire a fixer), **Sneak** (fence-jump stealth, smuggle via vendor truck, steal a credential), **Earn** (cleanup pardon, get *vouched for* by an ally you helped). Prevent it: lay low, dump hot inventory, pre-bribe.

### 22. The Tour & World Structure (meta-progression)
**One dense home festival is the content hub and your anchor** — most quests, your camp, Patches, and your core relationships live there (so the social web, NPC arcs, and the Ringleader rolodex actually accrue). Most of Act 1 happens at home. The **Tour** then adds a **circuit** of festivals you travel to in your van — **Forest** (home), **Desert** (heat), **Beach** (sand hygiene), **The Big Destination Fest** (endgame) — but these aren't smaller copies: they're the **same systems in new settings**, each layering a biome challenge + local NPCs/quests + exclusive gear/contacts + higher-tier gates. Gear/skills/rep/contacts travel with you. **Rhythm:** base + expeditions. **Build-wise:** ship the home festival first, add others as **content layers** on the shared systems — never a rebuilt game. Act 2 flips it: you found *your own* festival.

### 23. Act 2 — Festival Mogul (the management endgame)
Triggered by the Festival Founder capstone. RCT/Thrillville tycoon, **year over year**. **The master variable is attendance** (set via ticket pricing + lineup draw; overselling multiplies every failure). You manage: **site** (stages, camps, vendor village + power/water/medical/security/sanitation/parking), **lineup** (Act 1 relationships pay off — mentees headline cheap), **tickets & pricing** (tiers + scaled dynamic pricing), **budget** (you can lose money), **marketing/hype**, **live ops** (Act 1 crises from the boss's chair), **brand**.
- **The Failure Matrix** (~15 systems, degrees not binary, compounding): sanitation, water, food, medical, security (too little *and* too aggressive), capacity/overselling, power, parking, noise/curfew, weather/drainage, lineup, shade, waste/cleanup, finance. The **Fyre Scenario** = the compound catastrophe.
- **How you know what you need:** Requirements Panel (ratios like ~1 toilet/75–100), color **Readiness Dashboard**, an **Advisor NPC**, a **Stress-Test forecast**. Assist scaling. After-Action Report teaches you year over year.
- Capstone: **found your own festival**; you can still **cameo headline**. Endless sandbox tail.

### 24. The Social Universe (Radiate) — *post-launch*
Built **after** the solo game ships. **Sequencing:** solo story → cheap async **social layer** → expensive **real-time shared world** last. **Radiate** = the in-game social app (profiles, feed, friends, last-online). **Rave crews** (name yourselves; crew chat on the GTA-style in-game phone). **The solo→MP bridge:** your multiplayer profile *is* your single-player résumé (rank, rig prestige, brand, festivals thrown) — the grind is portable; you can **visit others' worlds** as async snapshots (a UGC showcase). **Server reality:** keep the social layer **global**, shard the real-time **worlds** (RuneScape-style hopping + "hop to your crew's world"); festival **density** is the real technical challenge. Cosmetic support funds servers — never pay-to-play. **The dream:** real friendships and partners formed through shared obsession — the most on-theme thing the game can do.

### 25. Things To Do & Longevity (the activity layers)
Beyond quests/gigs: **Flow Arts** (toys as a side activity), **deep relationships & a traveling crew** (and a festival dog), **collection / photo-mode / passport / hall-of-fame**, **wellness & teaching workshops**, **exploration / foraging / secrets**, **the road itself** as gameplay, and an **in-world social-media/influence** layer. The principle: **alt-careers multiply content by how many ways there are to *be*, and social + UGC removes the "last thing to do" entirely.**

### 26. NPCs — The Open Start, Patches & Reactions
**Onboarding:** character creation is **appearance only** — you don't pick a path. You're dropped in broke, and **Patches, the Mayor of Shakedown Street** (an elder wook, a Certified Head, patch-and-pin coat, a bell on his staff) welcomes you, teaches the circuit, then gets out of your way so your path *emerges*. He stays **anchored at the home base** as your **diegetic help system** (context-aware hints, never a checklist) and **crowns you Certified Head** at the end — the first NPC you meet closes your arc. **Reaction states:** every NPC reads as **① first-meeting** (a signature tagline that tutorializes — "3 for $20, no deals!"), **② familiar** (drops the pitch, remembers you), **③ relationship-modified** (allied = perks · famous = recognition · rival = won't deal/sabotage · infamous = wary). **Arcs & continuity:** significant NPCs run a small **state machine** of story beats with shifting **world presence**, **quest-chaining**, branch-by-behavior (ally / rival / **neglect**), and **persistence** — worked out for Vinny's Nitrous Mafia and the Breakthrough Circle. Cheap to build (state flags + authored beats on the systemic backbone). *(See the NPC Roster for the character bible + template.)*

### 27. Quest Discovery, Unlocking & Gating
**The 118-quest catalog is the *developer's* master list — never a player-facing menu.** Quests are **discovered, unlocked, earned.** Three visibility tiers: **Discovered/Active** (your log), **Gated/latent** (locked behind rep/rank/skill/prior-quest/location; surface when met), **Hidden/Secret** (the legendary tail — never listed). Discovery vectors: talking to Familiar NPCs, reaching places, crossing thresholds, world events, deepening relationships, finding clues, lot gossip. Guidance is **diegetic** (Patches + ambient cues), never a checklist. Serves the long game — paces content, prevents overwhelm, rewards curiosity. *"A festival where things keep happening to you," not "a map covered in icons."*

### 28. The Ringleader (the party-thrower path)
"Promoter," reframed — the **renegade who throws the party**: scout the spot → **pull the crew together** → build the vibe → drop the location (underground whisper network) → run the night & dodge the Buzzkills → a legendary night grows your name → **found your own festival** (Act 2). **Core mechanic — your Contacts:** everyone you befriend saves to your **phone**; when it's time, you **call them up** to fill the night's slots (DJs, sound crew, VJ, flow, vendors, fixers, muscle). Relationship level sets whether they pick up, their cut, their quality, and their reliability. **Your social web *is* your power** — kindness compounds into people who answer for the love; "knew them when" contacts blow up into cheap headliners. **The Act 2 bridge:** the rolodex *becomes* your festival's lineup — Act 1 Ringleader → Act 2 Founder is one continuous story. Mostly **assembly** of existing systems (phone + reactions + arcs), so cheap to build.

---

# THE QUEST CATALOG (118 quests, 12 categories)
A. DJ Ascension (12) · B. Signature Sound style quests (12) · C. Faction questlines (27) · D. Hustle & Economy · E. Comedy/Lot-Life (**The Scent of a Wook**, Where's My Car, the Naked Guy) · F. Heartfelt/PLUR Caretaking (Sober Sunrise, Festie Bestie) · G. Mystery (The Phantom Set, The ID) · H. Romance · I. Crisis/World Events (the Storm, Raid, Stampede) · J. Collectathons & Trade Chains (Kandi Climb, Patch Jacket) · K. Radiant micro-quests · L. Legendary/Endgame (Underground Deity, **Leave No Trace**, Pass the Torch).
**Fully-built showcase quest:** *The Conspiracy Circle* — a comedy "boss fight" where the boss is a monologue and the weapon is a djembe. Full dialogue bank (tiered Theories), a Guitar-Hero drum minigame whose tempo ramps with his ranting, call-and-response, a no-fail "good vibes only" state, a tender [have you had water today?] branch, and a gifted djembe reward.
**Second showcase quest:** *Breakthrough* — the hilltop circle at sunset. The substance is abstracted ("the medicine"); **Set & Setting** decides the outcome; the core verb is **Surrender** (let-go vs cling → breakthrough vs Bad Trip); ~90 seconds of abstract hyperspace timed to the sunset; the **sober "hold space" path completes it fully and earns the most Cred.** Rewards: a visual pack, an Equanimity perk, the *Saw The Other Side* title, and lasting bonds (Willow, Doc, Cedar, Moonbeam).
**Third showcase quest:** *The Master's Set* — a late-game pilgrimage to witness a mythic Sculptor-tier legend play a secret sunrise set (earned via deep taste + a vouched invite; ignites your own Sculptor climb). Built as a **fictional homage** now; the dream is to **license Dave Tipper** into the role later (name/likeness + music = a real deal — the parody-first→real-partner model).
**Canon first quest — "Bare Witness":** the tutorial. Mid-welcome, **Buck streaks past** (naked, screaming); Patches sends you after him, and **chasing Buck *is* the guided tour** — teaches movement, the zones, interaction, the quest log, and a first hydration lesson, paying off with Buck serene at the river. *The first thing you do is chase a screaming naked man into a sunrise.*
**Nitrous questline — getting into the game:** buy a huge tank via **Whip** (a rogue Mafia insider skimming Vinny's own supply — the signature route), or source it legit, or **heist** it (Chaos → instant war). Discovery is *"when, not if"* (a suspicion meter you pace via re-ups & recklessness) → the **brawl**, where you **call your contacts** for backup. Kicks off Vinny's rival arc.
**Parked quest concepts:** **Buck** (the Naked Guy / "Gerald, former actuary") has five more funny concepts on file — Great Pants Hunt, Decency Patrol, Emperor's New Wisdom, Buck Goes Viral, Buck's Sunburn.

---

# TECH & BUILD (summary — see the Tech & Build Pipeline doc)
- **The honest headline:** no push-button open world exists — AI is a **supervised force multiplier**, not the dev team. **Scope is the lever;** slice-first is the plan.
- **Engine:** Unreal Engine 5 (full game); browser/Three.js for fast loop-prototyping.
- **Who builds it:** **Claude Code** is the hub that drives UE5 via *local* MCP (VibeUE + UnrealClaude + Epic's UE 5.8 native MCP) — **not Cowork** (remote-only; its lane is organizing this design bible + planning).
- **3D assets:** a dedicated pipeline — **Meshy / Tripo / Rodin** (text→3D, great for the prop-dense festival; hero assets need human cleanup) + **Blender MCP + Poly Haven** (free PBR textures) + **fal.ai** (bespoke). Landscapes in **UE5 native Landscape** (+ Gaea/World Machine), never Blender meshes.
- **Higgsfield (corrected):** a **2D video / cutscene / previs / trailer** tool — *not* the source of in-game 3D assets. Cutscenes route: Sequencer for in-engine/player-reflective, Higgsfield for stylized/previs.
- **NPCs without per-play cost:** systemic AI backbone (free, RDR2-style) + optional **on-device SLM** (NVIDIA ACE/UE5) for open-ended chat. **Avoid cloud LLM APIs** (the only per-play model).
- **Cost model bottom line:** build with AI (a dev expense; free tools + Claude sub + generation/Higgsfield credits); ship a game that costs **nothing per play.**

---

# QUESTIONS EXPLORED & DECISIONS MADE
*(Every design question we worked through, and where it landed.)*

1. **Overall concept?** → SHAKEDOWN: open-world wook festival life-sim, two acts.
2. **How do Signature Sounds work?** → 11-tier Taste Ladder, cash-vs-cred, Sculptor apex, craft-your-own, two win conditions.
3. **A huge quest list?** → 118 quests, 12 categories.
4. **Sound-system upgrades / ROI / campsite / RV / sell-back?** → Three upgrade tracks; PA is the cash-ROI; RV is a milestone; sell-back vs the Gift Lot.
5. **Conspiracy Circle dialogue + drum minigame?** → Full quest design.
6. **The First USB + Silent Treatment?** → The Mixing Engine (one engine, many modes), custom import w/ Streamer Mode, both quests built.
7. **Buzzkill re-entry + dynamic pricing + custom stage builder?** → Three re-entry paths; the demand/elasticity pricing model; the Stage Builder.
8. **Skill tree + festival-management endgame?** → 7-branch unmaxable tree; Act 2 Festival Mogul.
9. **Wardrobe / vendors / unique NPCs?** → Hybrid wardrobe; vendor "brands"; procedural NPC generation; character creation (but archetype is earned).
10. **What are "the two endings"?** → The Legend↔Deity *paths* (not the acts); they flavor Act 2.
11. **Act 2 failure outcomes + how many toilets?** → The Failure Matrix + the planning/readiness/advisor UX.
12. **Upgrade bag size over time?** → The Bag track; bigger-isn't-always-better tradeoffs.
13. **Hydration too low? Hygiene vs. Vibes?** → Hydration collapse; hygiene (external) vs vibes (internal/aura); faction-relative funk.
14. **Theft/stealth — what else?** → The full Streetwise toolkit + identity-fork consequences.
15. **Bad trip + how substances work?** → Set-and-setting + care-as-gameplay bad trip; sober path viable.
16. **In-game visual builder?** → The VJ studio (build a rig, not Photoshop); visuals score the set.
17. **NPCs with minds, no per-play cost? + Fable 5 / Higgsfield / Unreal research?** → Systemic/local AI; engine = Unreal; Higgsfield = assets/marketing; clarified the two "Fables."
18. **(Correction) Fable 5 one-shots games.** → Confirmed; build-time vs runtime cost.
19. **(Correction) The graphics were real in-game.** → Confirmed; AI assets + neural rendering free at runtime.
20. **Make the master index exhaustive / bundle everything.** → This document + the downloadable folder.
21. **A modular sound-system builder + is a fixed point-pool arbitrary?** → The **Sound System Builder**: point-pool grounded as physical budgets that grow; money as a separate quality axis; Sound Check; rig prestige & soundclash. (Conceded the point-pool idea is valid.)
22. **How much more economy detail / consolidate it?** → The **Consolidated Economy** doc: every faucet vs sink across phases, the money-feel curve, broke/debt states, the Cash↔Cred model. (Numbers come from playtest, not paper.)
23. **What else to do besides quests + flow toys + real-festival/vendor sponsorship?** → The **Things To Do & Longevity** doc; flow toys added (as a side activity); the parody-first→real-partners partnership philosophy.
24. **Multiplayer/social, the Radiate app, servers, crews, build order?** → The **Social Universe** doc; solo-first sequencing; global social layer vs sharded real-time worlds.
25. **Not everyone's a DJ — multiple paths? Custom clothing path? Identity solo→MP? Switch without a new save?** → The **Player Paths & Identity** doc: the generalized spine, the Maker, emergent identity (no lock-in), the solo→MP résumé bridge.
26. **Dance/emotes (untz, headbang, liquid)?** → The **Dance, Emotes & the Dancefloor** doc; crowd-as-readout; the PLUR/kandi handshake.
27. **Curated artist music uploads + RuneScape-style worlds?** → The **Music Ecosystem** doc; world-sharding added to the Social Universe doc.
28. **Status tiers / "Certified Head"?** → The **Scene Status & Titles** doc; path-agnostic ladder, the apex fork, the titles gallery (incl. "Spunion").
29. **Pins — sell, customize, run booths?** → The **Pins** doc; reuses the Maker/booth/kandi/collection templates.
30. **Onboarding without picking a path + a recognizable tutorial NPC?** → The **open start** (appearance-only creation; path emerges) + **Patches**, the anchored home-base guide/oracle who crowns you at the end; the **reaction-state system** (first-meet → familiar → relationship-modified).
31. **Should players unlock quests instead of seeing a 100+ list?** → **Quest Discovery & Gating:** the catalog is the dev's master list, never a player menu; discovered/gated/hidden tiers; Patches + ambient cues as diegetic guidance.
32. **Titles above names — and are nameplates the same as the rank ladder?** → **Nameplates** show your rank by default or a chosen title; clarified **rank** (one ladder, top = Certified Head) vs **titles** (a no-top collection) sharing one slot.
33. **A DMT-circle / hilltop-sunset quest?** → **"Breakthrough"** fully-built (abstracted substance; Set & Setting; the Surrender mechanic; sober/sitter path completes it; real rewards).
34. **Name all characters + Naked-Guy quest ideas?** → Roster roll call; **Buck** named (+ 5 parked concepts); christened **Vinny**, **Officer Dan**, and the circle (**Cedar/Willow/Moonbeam/Doc**).
35. **Roster should detail each NPC's behavioral arc/continuity?** → Added the **Arc & Continuity** layer to the roster (state machines, world presence, quest-chaining, branch-incl-neglect, persistence) + worked arcs for **Vinny** and the **Breakthrough Circle**.
36. **Make every path as deep as DJ? Path-specific vs universal quests? Everyone a DJ?** → **No** — tier path depth (DJ flagship · Maker/Ringleader full · rest light/support); a big **universal** quest pool + focused **path-specific** chains; DJ is the default spine, not forced.
37. **Can a DJ also build rigs & own a booth?** → Yes — **paths stack**, limited by time/capital/skill; **delegation** (hire help) runs what you can't tend; **one Calling (identity/Cred) + many Hustles (cash)**, enforced by the Cash↔Cred split.
38. **Is the tree "unmaxable," or is a Certified Head a master of everything?** → Reconciled: **time-gated, not hard-capped** — specialize early, a decades-deep lifer masters it all (that's the Certified Head). "Master of none" was overstated.
39. **"Promoter sounds boring."** → Reframed as **The Ringleader** — the renegade party-thrower whose core mechanic is a **phone of Contacts** you call up to throw nights; the rolodex becomes your Act 2 lineup.
40. **One home festival with the most to do + others later?** → Yes — **home = dense hub/anchor**; Tour festivals = same systems in new settings (content layers), added over time. (World Structure doc.)
41. **Buck as the first thing you see / first quest?** → **"Bare Witness"** — Buck streaks past during Patches' welcome; chasing him *is* the tutorial tour. Canon opener.
42. **A Dave Tipper cutscene/quest + see him play live?** → **The Master's Set** capstone; built as a fictional homage now, license Tipper in later (real name/likeness/music = a deal).
43. **How do you get a nitrous tank — rogue insider?** → **Whip** back-doors you a tank (signature route; also legit-source or heist); discovery is *"when, not if"* (suspicion meter) → the **brawl** where you call your contacts. Triggers Vinny's rival arc.
44. **Clothing: banana hammock + elf ears?** → Added to the Wardrobe "Signature & Statement Pieces" catalog (banana hammock = audacity/faction-relative/Buck-approved; elf ears = fae faction-coded fit, opens a costume lane).
45. **(Uploaded) Fact-checked build-tooling research.** → Rebuilt the Tech doc: **Claude Code (not Cowork)** drives UE5; a real **3D-asset pipeline** (Meshy/Tripo/Rodin + Poly Haven + fal); **Higgsfield = 2D/cutscene/previs** (corrected); landscapes native; **scope discipline** validates slice-first.

---

# DOCUMENT MAP (36 docs)

| Doc | Covers |
|---|---|
| **Master Design Bible** *(this)* | the complete record + every question |
| **Game Design Doc** *(core)* | pitch, map, needs, hustles, factions, DJ ranks, Signature Sounds, Economy/rigs/camp/bag, Tour, art direction, build order |
| **DJ Gameplay** | the mixing engine, custom import, First USB & Silent Treatment quests |
| **The Sound System Builder** | modular rig, the point-pool constraint, Sound Check, rig prestige & soundclash |
| **The Visual Builder** | the in-game VJ studio |
| **Progression & Longevity** | the 7-branch skill tree (specialize-early/master-eventually) + Act 2 intro |
| **Advanced Systems** | ejection/re-entry, dynamic pricing, the Stage Builder |
| **Act 2 Operations** | the failure matrix + planning/feedback systems |
| **World Structure & The Tour** | the home-festival hub + the circuit; festivals as content layers |
| **Player Paths & Identity** | multi-path spine, Calling vs Hustles, delegation, path-depth tiers, the Maker |
| **The Ringleader** | the party-thrower path + the Contacts/rolodex mechanic |
| **Wardrobe & Fashion** | player wardrobe, vendors, procedural NPCs, character creation, signature pieces |
| **The Streetwise Path** | stealth, theft & cons toolkit |
| **Substances & the Bad Trip** | substances, set & setting, the bad-trip event, sober path |
| **Dance, Emotes & the Dancefloor** | genre dance styles, crowd-reading, the PLUR/kandi handshake |
| **Scene Status & Titles** | the status ladder to Certified Head, the titles gallery, nameplates |
| **Pins** | collect, craft, trade & sell pins; the booth business |
| **The Music Ecosystem** | artist uploads, in-world discovery, curation & licensing |
| **The Consolidated Economy** | faucets vs sinks, difficulty curve, broke states, Cash↔Cred |
| **Things To Do & Longevity** | the activity layers beyond quests |
| **The Social Universe (Radiate)** | the social app, crews, servers, the solo→MP bridge, world-scaling |
| **NPCs — Onboarding, Patches & Reactions** | the open start, Patches, the reaction system, "Bare Witness" first quest |
| **NPC Roster (Character Bible)** | the entry template, named-vs-procedural, arcs & continuity, the seed list |
| **Tech & Build Pipeline** | the Claude Code stack, the asset pipeline, cutscenes, NPC architecture, cost model |
| **Quest Discovery & Gating** | how quests are found, unlocked & gated (not a checklist) |
| **Quest Catalog** | 118 quests across 12 categories |
| **Sample Quest — The Conspiracy Circle** | a fully-built quest (dialogue + drum minigame) |
| **Sample Quest — Breakthrough** | the hilltop circle (Set & Setting + the Surrender mechanic) |
| **Sample Quest — The Master's Set** | the legend pilgrimage; the homage-now / license-Tipper-later plan |
| **Getting Into the Nitrous Game** | Whip, the three tank routes, the "when-not-if" brawl trigger |
| **Buck (the Naked Guy)** | character sketch + the canon first quest + five parked concepts |
| **The Vibes Meter** | the full raisers/tankers laundry list; Vibes-vs-Cred wall; decay/momentum |
| **Tolerance, Greenout & the Balloon Trap** | weed tolerance + greening out; nitrous Body-damage cap; the shared Collapse System |
| **Pickpockets & Narcs** | two-way theft, anti-theft gear, cash/safe banking, catching a dip, undercover cops, the drug-buyer encounter |
| **Area Banners & Crowd Vibe** | zone-entry title cards; the Crowd-Vibe zone stat (drives crime/encounters); the Crowd-vs-personal-Vibe wall |
| **Living Hair & the Wook Barber** | hair grows over time; funk → natural dreadlocks; Barber Bodhi; fewer starting hair options |

---

# BUILD PRIORITY
1. **The Mixing Engine** (unlocks DJ quests, B2B, silent disco in one build).
2. **Core loop grey-box** (needs + grilled cheese + day/night).
3. **Vertical slice** (Shakedown Street + Renegade Woods + the Conspiracy Circle + Buck's intro), built via **Claude Code driving UE5** + the 3D-asset pipeline.
4. **Faction/rep + 3 signature quests.**
5. **Trailer (Higgsfield) → wishlist/community → decide full scope.**
6. Ship the slice, prove the loop, **then** expand — one festival at a time (content layers), toward Act 2.

**Phase 2+ (post-launch expansions, in rough order):** additional **paths** (Maker → Ringleader → Sound Engineer…) · the **Music Ecosystem** (artist uploads) · the **cheap async social layer** (Radiate, crews, profiles) · **real-time multiplayer worlds** · **real festival/vendor/artist partnerships** (incl. the Tipper cameo) as the audience grows.

*Act 1 makes you a legend on stage; Act 2 makes you the person who builds the stage — and the skill tree decides which kind of legend you became. The paths decide what kind of legend you wanted to be in the first place; the social universe makes that legend real to other people.*

---

# Part 1 — Game Design Doc — The Core

# SHAKEDOWN
### *(working title — an open-world festival life-sim)*

> Alt titles to vibe-check: **Lot Life**, **Miracle**, **Wook: The Open World**, **Festie**, **Renegade**.
> *"Shakedown"* wins because Shakedown Street is the unofficial vendor lot at every festival — it's literally your starting hustle zone, your home turf, and a real piece of the culture.

---

## 1. The Pitch

You arrive at the gates of a multi-day music festival with $40, a duffel bag, and a dream: become the headliner. **Shakedown** is a satirical open-world life-sim where you survive and climb a festival ecosystem from the bottom — slinging grilled cheese on the lot, trading kandi, dodging security, and grinding your way up from playing silent disco to closing the main stage at sunrise.

Think **GTA's open-world hustle + RDR2's living world + The Sims' needs system + a rhythm game for the DJ career** — all wrapped in an affectionate parody of jam-band / bass-music festival culture.

**Tone:** loving satire, not mockery. The culture is the joke *and* the heart. PLUR is real here.

---

## 2. The Core Loop

```
HUSTLE for cash  →  spend on GEAR / GIGS / NEEDS  →  build REPUTATION
        ↑                                                      ↓
        └──────────  climb the DJ RANKS toward the headline slot  ←┘
```

Every in-game day you're juggling three pressures:

- **Survive** — keep your needs meters out of the red (you stink, you're broke, you're dehydrated).
- **Hustle** — make money through vending, gigs, and side quests.
- **Climb** — build cred with the right people to unlock better set times and bigger stages.

---

## 3. Setting & Map Zones

The festival is a contained open world (Thu–Mon). Later you **tour a circuit** of different festivals (see §9), each a new biome.

| Zone | What it is | Why you go there |
|---|---|---|
| **Shakedown Street** | The vendor lot. Your main hustle hub. | Sell food/balloons, trade, find quests, dodge security |
| **The Campgrounds** | Your customizable home base (tent → RV → glamp dome) | Sleep, store gear, cook, craft, recover needs |
| **Main Stage Field** | The big crowd, the big sound | Watch headliners, eventually *play* here |
| **The Renegade Woods** | After-hours unofficial stages in the forest | Your DJ climb starts here; foraging; getting *lost* |
| **Healing Village / Workshop Dome** | Sound baths, ecstatic dance, yoga, crystals | Earn skill points, sell "vibes" services, recover sanity |
| **Silent Disco** | Headphones-only dance tent | Entry-level DJ gigs |
| **The Parking Lot** | An eternal, labyrinthine field of cars | The legendary "where is my car" quest |
| **Porta-Potty Row** | A hazard zone | Hygiene risk, comedy, the occasional dropped phone |
| **The River / Swimming Hole** | Chill respite | Free hygiene + hydration top-up, social hub |
| **Artist / VIP Area** | Locked behind reputation | The dream — backstage, free food, real bookers |

---

## 4. Needs System (the Sims layer)

Meters that decay in real time and drive both gameplay and comedy:

- **Hygiene** 🧼 — decays fast in heat/dust. Low hygiene tanks your social interactions (NPCs literally recoil). *This is where your "find deodorant for the stinky wook" quest lives — see §7.*
- **Hydration** 💧 — drops in the sun; pass out if it hits zero. Why "cold water cold water" is the most profitable thing you can sell.
- **Energy / Stamina** ⚡ — sleep to refill; affects DJ performance and run speed.
- **Nourishment** 🌯 — the munchies. Eat to refill; certain foods give temporary buffs.
- **Vibes** ✨ — your overall mental state / aura. Good food, good sets, and good company raise it; bad trips, security hassle, and being broke lower it. Drives your charisma in dialogue.
- **Bankroll** 💰 — self-explanatory.
- **Buzzkill Meter** 🚨 — your "wanted level." Security ("the Buzzkills") notice illegal hustling. Fills with heat, triggers patrols, can get you ejected from the festival (a costly setback). This is the GTA-stars analog.

**Every meter answers a different question** — none of them overlap:

| Meter | The question it answers |
|---|---|
| Hydration | *Are you physically OK / conscious?* |
| Energy | *Can you keep doing things / perform?* |
| Nourishment | *Are you fueled (and buffed)?* |
| **Hygiene** | *Do people want to be **near** you?* (external, physical) |
| **Vibes** | *Are people **drawn to** you / will you charm them?* (internal, aura) |
| Buzzkill | *Is security onto you?* |

### What actually happens — Hydration (the hard physical fail)

Hydration is the one meter with a real *collapse* state, and it degrades in stages, not all at once:

1. **Moderate-low:** warning signs — slower stamina regen, reduced sprint, a heat-shimmer screen effect.
2. **Critical:** vision blurs and tunnels, audio muffles, you move at a crawl, and your **DJ performance suffers** (shaky hands = tighter mixing windows, higher train-wreck risk).
3. **Zero — you faint.** A heat-stroke blackout: you lose a **chunk of time** (and may miss a booked set — real stakes), wake up later (often at the **medical/chill-out tent** because someone dragged you there), and you're **vulnerable while down** — a sketchy spot means theft. Repeated collapses escalate (medical flags you).

The flip side is wholesome: if a passing NPC helps you up, that's the same caretaking loop you run on *others* in *Sober Sunrise*. Recovery: water (your own hustle item!), the hydration-pack bag perk, shade, the river.

### Hygiene vs. Vibes — two different axes (the key distinction)

They feel similar but they're **orthogonal**, and keeping them separate is what makes both interesting:

- **Hygiene = external & physical.** It's about your *smell and funk* — the involuntary way bodies react to yours. Low hygiene = people physically **keep their distance**: vendors serve you slower, dance-floor neighbors back away (**a stinky DJ clears his own front row** — it hurts crowd-pull), romance options close, and some **"clean" spaces** (VIP, the Healing Village) bar you. It can be **temporarily masked** (deodorant, a river rinse, fresh clothes from your wardrobe) without truly fixing the underlying state.
- **Vibes = internal & emotional.** It's your *mood and aura* radiating outward as charisma. It gates **dialogue quality, persuasion, the important-NPC interactions, and "selling vibes" services** (tarot only works when yours are high). Earned through *experiences* (great sets, good company, helping people), tanked by *bad* ones (bad trips, security hassle, being broke, getting robbed).

One-line version: **Hygiene is whether people want to be near you; Vibes is whether they're drawn to you.** They cross into four quadrants:

| | **High Vibes** | **Low Vibes** |
|---|---|---|
| **Clean** | the polished charmer — VIP & bookers love you | presentable but flat; people approach, you fumble |
| **Funky** | the **beloved grimy guru** — wooks adore you, clean spaces reject you | the dreaded stinky-and-miserable; you repel *everyone* (peak "Scent of a Wook") |

**The twist that makes hygiene a *choice*, not a chore:** funk is **faction-relative.** To the clean crowd (VIP, bookers, the influencer wooks) low hygiene is repellent — but to the grimiest renegade-woods core, **the dirt is cred** (exactly the conspiracy guy's "the dirt is armor"). So you're not just keeping a bar topped up; you're deciding *which scene you're dressing — and smelling — for.* It ties straight into read-the-room and the faction system.

---

## 5. Making Money — The Hustles

Money is the whole early game. Each hustle is a mini-game with risk/reward and reputation consequences.

**Lot Food (low risk, steady)**
- **Grilled Cheese** — a cooking timing mini-game (don't burn it, melt it right). The classic lot starter hustle.
- **Veggie burritos / quesadillas** — bigger batches, more prep, better margins.
- **Cold water** — buy a case cheap, sell single bottles at outrageous markup. Highest margin on a hot day; security tolerates it.

**Balloons (high risk, high reward)** 🎈
- The "balloons" hustle is your fast money — but it draws the **Buzzkill Meter** *and* puts you in conflict with the **Nitrous Mafia** faction (turf, supply, beef). Played for GTA-style satire, not a how-to. Pure risk/reward tension: big cash, big heat.

**Craft & Trade**
- **Kandi** — make beaded bracelets (a simple crafting mini-game) and trade them up PLUR-style. A trading-quest chain where you swap your way from a single bead to something valuable.
- **Heady glass / tapestries / festival fashion** — set up a booth; inventory + pricing management.

**Service Economy ("selling vibes")**
- Tarot readings, palm readings, sound baths, "energy work." Charisma-based mini-games gated by your **Vibes** stat and Healing Village rep.

**Broke-Wook Starter**
- **Can recycling** — wander the grounds collecting cans for deposit. Pennies, but it's the zero-capital bootstrap when you've spent your last dollar.

**Ticket Flipping / Miracles**
- Buy low, sell high on tickets — or *give* a miracle (a free ticket) to earn massive Vibes/Cred at a cash cost. The economy rewards both the shark and the saint differently.

---

## 6. Reputation & Factions

Cred is tracked per-faction. Helping one can hurt another.

- **Lot Vendors** — your hustle community. High rep = better supplier prices, prime booth spots.
- **Flow Arts Crew** — hoopers, poi spinners, fire dancers. Unlock performance hustles & cosmetics.
- **Renegade DJs / Sound Crews** — the gatekeepers to your forest come-up.
- **Healing Village** — wellness folk. Unlock vibe-services and buff items.
- **The Buzzkills (Security)** — inverse rep. Low heat = freedom; high heat = patrols and ejection.
- **The Nitrous Mafia** — optional, darker questline. Cross them at your peril.
- **Promoters / Bookers** — the people who control set times. The *real* boss faction for the DJ dream.

---

## 7. Side Quests & Missions

A mix of comedy, fetch, social, and escalating questlines. Examples:

- **"The Scent of a Wook"** *(your idea)* — A beloved but *catastrophically* stinky wook is clearing out a 20-foot radius and tanking everyone's Vibes. Track down deodorant across the lot (none of the vendors carry it — it's a *whole quest*), maybe stage an intervention at the river. Reward: huge Vibes boost + a loyal NPC ally.
- **"I Need a Miracle"** — Help a tickless traveler get inside. Branches: buy them in, scam someone, or work the system.
- **"Lost Festie Bestie"** — Reunite two friends separated since Friday. Uses the crowd-navigation and totem-spotting mechanics.
- **"Where's My Car"** — The eternal one. Navigate the labyrinth Parking Lot from fragmented memories. Pure comedy.
- **"Sober Sunrise"** — A stranger is having a rough night. Get them water, a banana, and a safe spot. A genuine harm-reduction-flavored quest that rewards big Cred — the caretaking ethos of the culture, played straight.
- **"The Shakedown Shakedown"** — Security cracks down on the lot. Warn vendors, hide product, or organize. Faction-defining choices.
- **"Kandi Climb"** — The trade-up chain (see §5).
- **"Renegade Rising"** — The questline that bootstraps your DJ career in the woods (see §8).

Mission design principle: every quest should let you choose between **the hustle path** (profit), **the PLUR path** (Cred/Vibes), and **the chaos path** (fast + risky).

---

## 8. The DJ Career — The Main Arc

This is the heart of progression and your highest-skill gameplay. Performing is a **rhythm / live-mixing mini-game**: beatmatch, read the crowd's energy meter, time your drops, run B2B (back-to-back) sets with rival DJs, and avoid the dreaded **train wreck** (a botched transition that nukes your crowd energy and your Booker rep).

**The climb — 10 ranks:**

1. **Bedroom Bemused** — making tracks in your tent on a cracked laptop.
2. **Silent Disco Scrub** — your first real (headphones-only) set.
3. **Drum Circle Selector** — earning tips in the round.
4. **Renegade Rookie** — first unofficial forest stage at 4am. *The real beginning.*
5. **Campground Soundsystem** — running your own little rig.
6. **Side Stage Sundae** — an official (tiny) slot.
7. **Sunrise Set Shaman** — the coveted dawn slot; pure vibes.
8. **Direct Support** — opening for a name act.
9. **Main Stage Headliner** — *the dream.*
10. **The Closer / Festival Legend** — you ARE the festival now.

Each rank up requires **Booker rep + a successful set + gear**. Better gear (controllers, USBs full of unreleased tracks, a signature sound) improves your mini-game ceiling. Your **track library** is itself a collectible system — find/buy/trade unreleased IDs to wow crowds.

---

## 8B. Signature Sounds — The Taste Ladder

Ranking up your *career* unlocks bigger stages. Ranking up your **Signature Sound** unlocks who you *are* as an artist — and in this scene, the most respected sound isn't the biggest, it's the most surgical. The whole ladder runs on one tension:

> **Commercial sounds** = huge crowds, fat stacks, near-zero respect.
> **Heady sounds** = tiny rabid congregations, no money, *legend status.*

Each Signature Sound is an equippable **loadout** that reshapes the DJ mini-game (timing windows, special mechanics), the **crowd it summons**, and your **Cash-vs-Cred split**. Reading the room is the meta-skill: drop apex IDM at a main-stage rage crowd and they wander off; drop future bass in the 4am woods and the heads boo you off the renegade stage.

*(The tier snobbery below is the in-game culture talking — lovingly. All taste is fake. Mostly.)*

| # | In-game name | Real referent | Crowd it draws | Mini-game feel | Cash / Cred |
|---|---|---|---|---|---|
| 1 | **The Feels Machine** | future bass / melodic dubstep *(Illenium-core — your starter "crap")* | main stage, phone flashlights, exactly one (1) tear | wide forgiving timing, auto-aligned drops | ★★★★★ / ★ |
| 2 | **The 808 Stomp** | festival trap | ragers, twerk | hype-button heavy | ★★★★ / ★★ |
| 3 | **Wonk Wonk Wonk** | riddim | the riddim wooks (own subspecies), gas masks, neck injuries | hypnotic metronomic groove-lock | ★★★ / ★★ |
| 4 | **The Gateway Drop** | brostep / dubstep (Skrillex lineage) | the faithful workhorse crowd | tighter timing, growl-"talk" segments | ★★★ / ★★★ |
| 5 | **Technicolor** | color bass / tearout | bright-bass kids | first **edit chains** | ★★ / ★★★ |
| 6 | **The Robot Uprising** | neuro / neurofunk | dark, technical heads | fast polyrhythm lanes, precise | ★★ / ★★★★ |
| 7 | **The Heady Pivot** | halftime / deep dubstep (Ivy Lab, Truth) | crowd shrinks, devotion spikes — the woods notice you | spacious but punishing accuracy | ★ / ★★★★ |
| 8 | **Amen Brother** | drum & bass / jungle | speed freaks | rapid lanes, breakbeat juggling | ★★ / ★★★★ |
| 9 | **The Promised Land** | west-coast wonky / glitch-hop (KOAN Sound, Mr. Bill, Gladkill) | tiny rabid heady congregation | off-grid swing, micro-edits, granular fills | ★ / ★★★★★ |
| 10 | **The Sunrise Temple** | downtempo / psydub | dawn-set worshippers, sound-bath refugees | texture & space over bangers; pure Vibes | ½ / ★★★★★ |
| ★ | **THE SCULPTOR** *(Scratch God)* | **Tipper-tier sound design + turntablism (QBert-level scratch)** | small, silent, jaws on the floor, then religious | the hardest content in the game (see below) | — / ★★★★★★ |

**The apex — "THE SCULPTOR":**
The final unlock fuses two masteries — David Tipper's surgical, impossible sound *design* and full turntablist scratch *technique*. Requirements: every prior sound unlocked **+ turntables in your rig** (gear-gated — no decks, no scratch god) **+ a maxed Sound-Design skill tree.** The mini-game changes entirely:
- **Frame-perfect micro-edit windows** (glitch-hop chops with zero margin).
- **Live "Sound Sculpt" segments** — you *build* the patch in real time instead of triggering a preset drop.
- **Scratch sequences** — a turntablism sub-mini-game (crabs, flares, transformers).

**Craft your OWN signature (the real endgame):**
The Sound-Design skill tree lets you combine unlocked elements — reese bass, granular glitch, neuro screech, formant scratch, sub-design — into a sound *nobody's heard.* The 100% flex isn't "play like Tipper," it's "no one can place your genre." Apex players can **genre-bend mid-set**, B2B-ing against themselves across the whole ladder.

**Two win conditions (the sellout fork):**
A persistent **Cash-vs-Cred** trajectory branches the ending —
- **Festival Legend** — ride the commercial sounds, headline the Big Destination Fest, max money & fame.
- **Underground Deity** — walk the heady path to THE SCULPTOR, play to 40 silent worshippers in the woods at sunrise, and become the name *other DJs* whisper about.
You can chase both, but the timing/cred costs make purity the flex.

---

## 8C. Economy — Rigs, Camps & the Gift Lot

**The core principle: never let one purchase "solve" money.** Split what feels like "the rig" into **three upgrade tracks**, each paying back in a *different* currency. That keeps every purchase a real choice instead of an obvious next rung on a money ladder.

| Track | What it is | What it pays back in |
|---|---|---|
| **The Decks** | your instrument | skill ceiling + *access* (which stages/sounds) — **not** raw cash |
| **The Soundsystem (PA)** | your venue | **this is the cash-ROI track** — you host instead of guest |
| **The Campsite** | your base | quality of life — time, capacity, safety, social pull |

### Track 1 — The Decks (instrument: access + ceiling, NOT a cash printer)

| Tier | Gear | Unlocks | Performance effect |
|---|---|---|---|
| 1 | Cracked laptop + cans | bedroom production only | — |
| 2 | Entry 2-ch controller | silent disco, drum circle | widest (most forgiving) timing |
| 3 | Pro 4-ch controller | renegade + campground stages | tighter timing, B2B-capable |
| 4 | CDJs + mixer | official side stages, "real DJ" cred | full ceiling, all standard sounds |
| 5 | **+ Turntables** | **the scratch path / Sculptor sounds** | adds the scratch sub-mini-game |
| 6 | Custom / modular signature rig | genre-bend mid-set, max-Cred flex | highest ceiling, your own sound |

> Decks gate **access** and raise your **skill ceiling** — they don't generate cash on their own. A pro on a cheap controller out-earns a scrub on CDJs. This is what stops "buy biggest rig = win."

### Track 2 — The Soundsystem / PA (the real ROI: own the venue)

This is where "better gear → more money" *correctly* lives. A PA lets you **host** instead of **guest** — you own the means of (sound) production.

1. **No PA** — you play others' stages; keep tips only, host takes the door.
2. **Battery PA** — throw a tiny renegade set; now you keep *all* tips.
3. **Subs + tops** — host a real renegade stage: charge a donation "door," AND sell water/balloons to *your own* captive crowd (vertical integration).
4. **Full rig + crew** — run a *named* stage / afterparty as a recurring revenue node with passive income while you're off doing other things — plus major Cred as a crew leader.

ROI logic: it's a capital investment that pays back through **hosting effort**, and it requires Power upgrades (below) to run. Ties to the *Carry the Sub* and *Power Struggle* quests.

### Track 3 — The Campsite (base: a shelter spine + bolt-on modules)

**Shelter spine:**

| Tier | Shelter | Benefits |
|---|---|---|
| 1 | Ratty borrowed tent | slow needs recovery, tiny storage, no theft protection |
| 2 | Real tent + EZ-up canopy | shade slows hygiene/hydration decay; basic storage |
| 3 | Car camp (van) | lockable (theft protection), more storage, better sleep, in-lot mobility |
| 4 | **RV** | fast needs recovery, big storage, onboard kitchen, AC (negates heat waves), **drives the tour circuit** |
| 5 | Glamp dome / custom | status magnet: passive Cred/Vibes, draws NPCs (networking + crowd recruiting), camp becomes a fast-travel hub |

**Modules (bolt onto any shelter) — note each gives a *different kind* of benefit:**

| Module | Benefit type | Effect |
|---|---|---|
| Kitchen (stove → griddle → full) | **Cash** | food-hustle output, quality & speed up |
| Storage (cooler → lockbox → shelving) | **Capacity** | more vend inventory; theft protection |
| Power (battery → solar → generator) | **Enabler** | charges devices (charger hustle), runs your PA |
| Comfort (sleep kit, hammock, shade) | **Time** | faster needs recovery = more active hours per day |
| Crafting bench (kandi / glass) | **Cash** | unlock/upgrade craft hustles |
| Hygiene (solar shower) | **Upkeep** | passive hygiene = fewer social penalties, less downtime |
| Aesthetic (tapestries, lights, art) | **Social** | raises camp "vibe rating": passive Cred, NPC draw, fast-travel hub |

> Because benefits come in different currencies (cash / capacity / time / access / upkeep / social), players upgrade by **playstyle** — the hustler maxes Kitchen + Storage, the DJ maxes Power + the PA, the socialite maxes Aesthetic — instead of all chasing the same "biggest number."

### Carry vs. Stash — Upgrading Your Bag

You actually have **two inventories**, and they upgrade on different tracks:

- **The Camp Stash** — big, static storage at base (scales with campsite tier + the **Storage** module above). Holds your full wardrobe, surplus vending stock, and your whole collection. Doesn't move.
- **The Bag** — what's on your person *in the field.* Limited, and the thing you upgrade to roam longer between camp trips.

**Why bag size matters:** carry capacity gates how much stock you can sell before a restock run, how many quick-swap **outfit loadouts** you can bring (Rain Fit *and* Night Fit), and how much loot/gear you can haul. Small bag = constant trips home; big bag = freedom. Like the camp upgrades, it buys you **time and throughput.**

| Tier | Bag | Capacity | Perk / Tradeoff |
|---|---|---|---|
| 1 | Fanny pack / plastic bag | tiny | the broke-wook starter |
| 2 | Drawstring sling | small | light — fine for dancing/DJing |
| 3 | **Hydration pack** | medium | **built-in water → slows hydration decay** (needs-system synergy) |
| 4 | Hiking backpack | large | rugged, all-purpose |
| 5 | Rolling cooler / wagon | huge (vending) | carries cases — but **slow & restricted in crowds/woods** |
| 6 | Custom modular rig | max | bolt-on pouches; doubles as a **fashion statement** |

**The tradeoff that stops "bigger is always better":** big carriers are slow and clumsy in tight spots, and a heavy/flashy bag **hurts stealth** (the fence-jump / sneak-back) and **draws more theft attention.** So you pick your bag for the *outing* — a light sling for a dancing/DJ/stealth night, the wagon for a vending day. It's a loadout choice, not a linear upgrade.

**How you upgrade it (multiple paths, on-brand):**
- **Buy** from the utility / burner-gear vendor.
- **Craft / modular** — bolt on pouches and pocketed patches (ties to crafting + DIY fashion).
- **Quest rewards & the Gift Lot** — a gifted pack carries sentimental Cred.
- **Skill tree** — a Hustle/Wellness perk (*"Mule" / "Pack Rat"*) raises effective carry, so capacity is part item, part *you.*

*Model note: keep it simple — a slot/weight capacity where consumables stack (water, food) and uniques (outfits, gear) each take a slot, plus a couple of quick-slots for your active outfit and hotbar items.*

### Is the RV the goal?

**No — it's a milestone, not the win condition.** The goal is the DJ ascension (Headliner / Sculptor). The RV is the "you've made it" quality-of-life capstone *and* the thing that lets you tour the circuit — with a flex tier beyond it. Don't let a comfort upgrade quietly become the point of the game; it should *serve* the real goal.

### Cashing out — Sell-back vs. The Gift Lot

When you outgrow gear, three exits — and the choice should *matter*:

- **Sell back** — recoup ~40–60% cash (depreciation). Pragmatic; funds your next upgrade.
- **Gift it (the Gift Lot)** — zero cash, but a chunk of **Cred/Vibes** + a real relationship with the recipient (future ally who returns favors and hypes your sets). Pure PLUR.
- **Pass it down** — give it to a specific newbie you're mentoring (*First Festival* / *Pass the Torch*) for story rewards.

This ties straight to the two endings: the **Underground Deity / Cred** path loves gifting; the **commercial** path may prefer the cash. *Guardrail:* gift-Cred scales with item value, **diminishes on repeats**, and is context-sensitive (giving something genuinely needed beats dumping junk) — so you can't farm Cred by re-gifting cheap gear.

### Anti-snowball checklist
- Decks & camp buy **time, access, capacity, safety** — not raw cash multipliers.
- The **PA is the one true cash-ROI track**, and it costs hosting effort + power.
- **Apex heady gear earns *less* cash, more Cred** — the top of the tree is never a money fountain.
- **Soft sinks** keep inflation down: gear breaks (repair quests), the RV burns gas to tour.

---

## 9. Meta-Progression — The Tour

After the first festival, you unlock **the circuit**: travel (RDR2-style map traversal in a beat-up van you customize) between festivals across the year. Each is a distinct biome and vibe:

- **Forest fest** (the tutorial home)
- **Desert fest** (heat survival cranked up; dust, heady art cars)
- **Beach fest** (hydration easy, sand hygiene nightmare)
- **The Big Destination Fest** (the endgame — headlining here is the win condition)

You keep gear, skills, rep, and your van between festivals. Each run sharpens the loop and pushes you toward the headline dream. (Bonus: this structure makes the game *shippable in chunks* — you can build and release one festival, then add biomes.)

---

## 10. Art Direction & Tooling — let's be real about this part

You said GTA / RDR2 graphics and **Higgsfield** for the visuals. Here's the honest landscape so you build on solid ground:

**What Higgsfield (and AI image/video tools) are genuinely great for:**
- **Concept art** — characters, lot scenes, stage designs, mood boards.
- **Key art & trailers** — cinematic marketing shots, the announce trailer, posters.
- **Texture/material references** and **cutscene previz**.
- **Rapid style exploration** — nailing the look before anyone models anything.

**What they don't do:** generate a *playable* open world. AI tools make images and video clips, not the 3D world, physics, AI, and systems you actually walk around in. RDR2/GTA-tier fidelity is the output of a ~thousand-person studio, many years, and hundreds of millions of dollars — that's not a tooling gap you can close with a generator.

**The realistic pipeline for *this* game:**
1. **Engine: Unreal Engine 5** — closest to that GTA/RDR2 look out of the box (Nanite/Lumen), and it's free to start.
2. **Art: AI for concept + cinematics**, then real 3D modeling/world-building in-engine (or with assets from marketplaces to start).
3. **Scope down to a vertical slice first** — one festival, Shakedown Street + the Renegade Woods, the grilled-cheese hustle, and the DJ mini-game. A *stylized* look (think a slightly heightened, painterly festival vibe) will look better and cost vastly less than chasing photoreal — and it fits the whimsical tone better anyway.
4. Ship the slice, prove the loop is fun, *then* expand.

> Note on "**Fable 5**": I'm honestly not sure what you're referring to there — it doesn't match a game-making tool I know of (the *Fable* game series is a separate Xbox RPG, and there's an unrelated AI-TV startup called Fable). If you can tell me what Fable 5 is in your plan, I can fit it into the pipeline properly.

---

## 11. Build Order (suggested)

1. **Core loop prototype** (grey-box): needs meters + grilled-cheese hustle + one day cycle.
2. **DJ mini-game** standalone — this is your signature mechanic; make it fun in isolation.
3. **Shakedown Street + Renegade Woods** as a playable slice.
4. **Faction/rep system + 3 signature quests** (Scent of a Wook, Renegade Rising, Where's My Car).
5. **Art pass** using AI concept work to lock the visual identity.
6. **Vertical slice trailer** (great use of Higgsfield) → wishlist/community → decide on full scope.

---

*PLUR. Now go make your grilled cheese empire.* 🧀


---

# Part 2 — DJ Gameplay — The Mixing Engine

# SHAKEDOWN — DJ Gameplay
### The Mixing Engine · Custom Tracks · "The First USB" & "Silent Treatment"
*Companion to the main design doc. This is the foundational gameplay of the whole DJ Ascension — §8's "rhythm/live-mixing mini-game," fully specified.*

---

## PART 1 — The Mixing Mini-Game (the core of every gig)

**Build one engine; layer modes on top.** Standard sets, B2B, the silent-disco versus battle, and the apex Sculptor set are all the *same* mixing engine with different rules bolted on. One system, huge content payoff — exactly what a small team wants.

**The deck:** two decks (A / B), a crossfader, 3-band EQ (low/mid/high), a filter sweep, and a cue button.

**The core loop of a set:**
1. **Track A** is playing the room.
2. **Load Track B** from your crate (your USB).
3. **Beatmatch** — line up B's beat-grid to A's. This is the skill. Sync-assist strength scales with your gear and rank (see below).
4. **Transition** — crossfade + swap EQ bands, ideally on a phrase boundary or into the drop.
5. **Read the room, pick the next track,** repeat.

**Crowd Energy meter:** the heartbeat of the scoring. It rises on clean transitions and well-matched energy; it sags on mistakes or a track that doesn't fit the moment. Which **Signature Sound** you're playing and whether it suits the stage/crowd feeds directly into this (callback to §8B read-the-room).

**Skill layers, gated by gear (callback to §8C):**
- **Controller:** basic crossfade + EQ blends.
- **CDJs + mixer:** loops, hot cues, longer creative transitions.
- **Turntables:** scratching, beat juggling — the scratch path.
- **Custom rig (Sculptor):** live sound-sculpting + everything manual.

**The ways to blow it:**
- **Train Wreck** — beats drift out of phase. Audible mess, Crowd Energy craters. (This is the failure the catalog quest is named after.)
- **Dead air** — you didn't load B in time; the track runs out.
- **Key Clash** — mixing two harmonically incompatible tracks sounds sour. *This is why your crate needs curating by key, not just vibe.*

**Scoring = transition smoothness + sustained Crowd Energy + risk taken (harder transitions pay more Cred) + room-reading accuracy.**

**Assist scaling (the difficulty dial):** beginners get strong auto-sync and a "suggested next track" highlight. Ranking up lets you switch assists *off* for more Cred — and the Sculptor path basically demands full manual. Same engine serves a first-timer and a god.

---

## PART 2 — Your Crate Is Your Ammo (and yes — import your own MP3s)

Every track ("ID") is a collectible **item** with stats that feed the mixing game:

| Property | Why it matters |
|---|---|
| **BPM** | how easily it beatmatches with neighbors |
| **Key** | mix compatible keys = smooth; clash = sour |
| **Energy** | for reading/raising the room |
| **Sound tag** | which Signature Sound / crowd it serves |
| **Heat / Rarity** | unreleased IDs hype a crowd harder; commons are filler |

Curating a USB becomes a light **deckbuilding meta**: you want range across energies and keys so you can handle *any* room. A USB of 30 bangers in the same key is useless.

### Importing your own tracks — the real picture

**Your vision (build a legit USB from your own MP3s and actually hear them mixed) is achievable.** Here's the honest breakdown:

**What's genuinely feasible:**
- **Loading local audio at runtime** — standard in Unreal/Unity (via FMOD/Wwise or native).
- **Auto-analysis of any track** — BPM, beat-grid, and key detection on arbitrary MP3s is well-trodden tech. Games like *Audiosurf*, *Beat Hazard*, and *Melody's Escape* generate entire levels from your music library. Libraries like aubio / Essentia do the heavy lifting.
- **Real DJ-style mixing of two arbitrary tracks** — harder, but real. You need **time-stretching** (so two different-BPM tracks can sync, exactly like rekordbox/Serato "sync") — Rubber Band, SoundTouch, and élastique all do this. Quantized loops and hot cues fall out of the same beat-grid.
- So: player imports tracks → game analyzes them → the mixing mini-game blends them with sync-assist scaled by skill/gear. **You'd literally hear your own crate mixed live.** This is the dream feature and it's buildable.

**The one thing you MUST design around — licensing:**
- A player mixing **their own legally-owned files for private play** = lowest risk, generally fine.
- The moment that mix gets **recorded, streamed, or shared** (Twitch/YouTube), you hit the same copyright wall every "bring your own music" game faces.
- You **cannot ship copyrighted songs** in a commercial game without licensing them.

**The solution that actually makes the game better:**
1. **Ship a default crate of licensed / Creative-Commons / royalty-free tracks** — and here's the gold: *partner with real up-and-coming festival producers and netlabels.* An underground-festival game scored by actual underground artists is authentic AND a built-in marketing + community engine. The IDs you scavenge in-game are by real (or in-game) artists.
2. **Offer custom import as a "Bring Your Own Crate" sandbox** — with a **Streamer Mode** that mutes/swaps custom tracks during capture, and a clear "you're responsible for your own files" stance. This is the established pattern for custom-audio features.

*(Not legal advice — before a commercial release, get a real music-licensing lawyer. But this is the well-worn path, and the partner-with-artists angle is a genuine strength, not just a workaround.)*

---

## PART 3 — Quest: "The First USB"

**The fantasy:** you show up with an empty USB. You can't play a real set until it's full enough to handle a room. This quest is the tutorial for the whole crate-curation meta — and a festival-wide scavenger hunt.

**Ways to fill your USB:**

- **Found USBs** — on the ground in the lot, dropped at stages, (regrettably) in porta-potty row. Pick one up → "let's see what's on here" → a **roulette** of random tracks: bangers, filler, the occasional unreleased gem... or a **corrupted/cursed file** (a gag track that tanks any crowd until you delete it). Rarity tiers on the USB casing hint at the loot.
- **NPC gifts** — strangers whose *only* purpose is to go "yo, you gotta hear this" and drop you a track. One-and-done. Makes the world feel generous and alive. Some only share if your **Vibes** are high enough ("your aura's gotta be right, brother").
- **The Aux Circle** — sit with a campsite crew passing the aux. A small read-the-room mini-game: when it comes to you, play one of *your* tracks. Nail the circle's vibe → you earn their respect *and* they share IDs back; misread it → you bomb the cipher and lose a little face. Pure social mechanic.
- **B2B trades** — go back-to-back with another DJ. Win the exchange and they respect you enough to drop their **unreleased ID** (ties to the mixing engine's B2B mode).
- **Crate digging (vendors)** — buy tracks and sample packs on the lot. Reliable, costs cash — the non-free option.
- **Bedroom production** — make your *own* originals in your tent; your library grows as your production skill does.
- **The legendary ID** — the catalog's "The ID" quest: hunt the one track everyone's Shazaming in vain, back to its source.

**Completion:** USB hits a viable size *and spread* (the game nudges you toward range, not just count) → you're cleared to book real sets. The quest quietly teaches that a good crate is balanced, which the mixing game then tests forever.

---

## PART 4 — Quest: "Silent Treatment" (the channel-steal versus battle)

**The fantasy:** silent disco — everyone wears headsets that **glow a color for the channel they're tuned to.** Multiple DJs, one dance floor. You vs. a rival, fighting to pull the crowd onto *your* color. It's a tug-of-war over a shared crowd.

**How to actually execute it (you said you weren't sure — here's a clean way):**

It's the **mixing mini-game underneath**, plus a **versus layer** on top:

- **The floor** is a cluster of dancers, each headset glowing **your color** or **the rival's** (undecided dancers are dim).
- Your performance generates **Pull**. Sources of Pull: a clean transition, a track that *matches the floor's current mood*, and landing a big drop on-beat. Pull radiates out and flips nearby dancers to your color.
- **The rival DJ** (an AI with a personality — e.g., a future-bass crowd-pleaser who's easy but grabs the basic crowd, or a tryhard who counters your energy) is doing the same on their channel.
- **The real skill is reading the floor's shifting mood**, not just playing harder. The crowd cycles through wants — *energy now / breakdown now / groove now*. Whoever reads it and delivers gets the Pull. So if the rival just blew their load on a huge drop and the floor's spent, **you** win them by going deep and groovy while their crowd fatigues. It's rock-paper-scissors of energy states layered over the mixing.
- **Momentum waves:** chain good plays and a visible color cascade sweeps a whole section of the floor to you — satisfying, readable, and the core "comeback" moment.
- **Spice (kept light):** a few limited moves — burn a rare **unreleased ID** from your USB for a Pull burst, or a "key-change gambit." The rival can answer. Skill battle, not gimmick spam.

**Win conditions & rewards (scale with margin):**
- Own the most of the floor when the timer ends = win.
- **Floor blackout** (the *entire* floor your color) = perfect bonus: big Cred, Booker attention, and the rival respects you enough to **drop you their ID** — looping straight back into your USB collection.
- **Losing isn't game-over:** you still scrape some Cred, the rival gets a gloat line, and you can rematch. Good Vibes Only, but make it sting a little.

---

*Build note: Parts 3 and 4 both run on the Part 1 engine, so building the mixing mini-game first unlocks the early-game DJ quests, the B2B system, AND the silent-disco battle in one shot. This is the highest-leverage system in the whole game — build it first.*


---

# Part 3 — The Sound System Builder

# SHAKEDOWN — The Sound System Builder
### (+ the unified unlock & cost framework for all three builders)
*Companion to the design bible. Extends §8C (the PA track), the Stage Builder, and the Visual Builder.*

---

## PART 1 — Design Your Own Sound System

**The fantasy:** soundsystem culture treats the rig as an art form and an identity — people build custom scoop subs, *name* their systems, and battle them in soundclashes. This builder turns "buy a bigger PA" into "engineer the rig that *is* you."

**It deepens the §8C PA track (assist scaling, same as everything else):** early on you **buy pre-built PA tiers** (simple, accessible). Later you unlock the **custom Sound System Builder** and start *engineering* your rig instead of buying the next tier.

### The modular build
Assemble from components: **subwoofers** (scoop / reflex / horn-loaded), **mid-range tops**, **tweeters/hi**, **amplifiers** (power = headroom), **crossovers / DSP**, cabling, and the **stack/array layout**.

### The stats that emerge from your build

| Stat | What it does |
|---|---|
| **Output / SPL** | how loud — how big a crowd you can physically move |
| **Frequency Signature** | your bass/mid/high balance — bass monster vs. balanced vs. crisp & detailed |
| **Coverage / Throw** | how far and wide it reaches (crowd capacity at a stage) |
| **Headroom / Reliability** | underpowered or overdriven = distortion and **blown speakers** (a repair cost) |

### How customization is constrained — the point pool, grounded and grown

The backbone is a **fixed point pool** allocated across competing axes — and the reason you *can't* just have more points is the whole point: scarcity is what forces you to choose **what your rig specializes in.** Max one axis and you starve another, so every rig is a deliberate identity (a bass monster, a clarity rig, a loud-but-muddy crowd-mover) and none is good at everything. That's sound design, not a limitation.

Two refinements fold in the economy and progression **without touching that mechanic:**

**1. Ground the pool as physical budgets, and let it grow.** The "points" are really your **power budget** (generator wattage), **transport/weight** (what you can haul — *Carry the Sub*), and **space/footprint**. That makes the tradeoff thematic ("can't power that many subs," "can't haul that into the woods") and ties it to other systems. Crucially, the pool **grows with progression** (better generator, transport, money) — early game it's a tiny budget and brutal either/or choices; late game it's bigger, so you can do *three* of the five axes well instead of two — **but never all five.** The specialization tension is permanent; the ceiling just rises.

**2. Money is a separate axis — shape vs. quality.** Your **points decide the *shape*** (what the rig specializes in). Your **money decides the *tier*** of the components filling that shape — a scrappy budget low-end rig and a Funktion-One-grade low-end rig can share the *same allocation* and sound worlds apart. Point pool = identity; economy = quality. They don't step on each other.

The competing axes you allocate across: **Loudness (SPL) · Fidelity/Clarity · Low-End Weight · Coverage/Throw · Reliability/Headroom.** You can't max them all — so your build becomes an identity you match to your Signature Sound.

**Keep a simple point-buy as the accessible floor (assist scaling):** a "Quick Build" mode lets beginners slide a basic budget across loudness/fidelity/low-end for a serviceable rig fast; the full component-builder is the mastery ceiling. Same floor-and-ceiling pattern as Auto-VJ, buy-tiers-vs-build-custom, and beatmatch assist.

### The Sound Check (tuning mini-game)
Before a set you **tune the rig to the space** — a sound-check mini-game (EQ, phase, gain-staging). Good tuning = a crowd-energy bonus; muddy or harsh tuning = a penalty. Skill expression that rewards knowing your rig.

### The tradeoffs (so "biggest" isn't automatically "best")
- **Weight / transport** — a monster rig is brutal to haul into the **Renegade Woods** (the *Carry the Sub* quest); a light rig is mobile but moves a smaller crowd.
- **Power draw** — big rigs need big power → ties to the camp **Power module** (generator) and *Power Struggle*.
- **Sonic signature must match your sound** — a riddim/dubstep set wants monstrous subs; a glitch-hop/downtempo set wants clarity and detail; future-bass wants balance. **The wrong rig for your Signature Sound = a worse set.** Read-the-room, but for hardware.

### The interlocks
- **Powers your stages** — your custom rig is what you place on the stages you build.
- **The hosting/ROI loop** — a better rig moves a bigger crowd = more door/tips (it's the cash-ROI track, so reinvesting profits into your rig pays back).
- **Maintenance** — overdriven rigs blow speakers (a soft money sink that keeps the economy honest).
- **Brand & identity** — **name your system.** A legendary rig feeds **Festival Famous**, right alongside your signature sound, visual aesthetic, and stage look.
- **The Soundclash (versus event)** — the soundsystem-culture battle: your rig + set vs. a rival's, fighting for the crowd (a cousin of the silent-disco channel battle). A great mid/late event and faction hook.

> **The trinity:** stage + sound + visuals all custom = a festival that *looks, sounds, and feels like you, end to end.* That total authorship is the Act 2 payoff.

---

## PART 2 — When the Three Builders Unlock & What They Cost

**Philosophy:** the builders are **creator / progression-gated layers**, not starting tools (you begin as a broke wook). Each is gated by **money + reputation + a short "earn it" quest** — never cash alone — and each follows the **buy-tiers-first, build-custom-later** pattern. They unlock in escalating order matched to when each becomes *relevant*:

### The unlock ladder

| Builder | Unlocks around | Gated by | Why then |
|---|---|---|---|
| **Visual Builder (VJ)** | **Early** — Renegade Rookie | a basic version comes *free* with your first real rig; deep compositor/import/AI tiers via a workshop quest + small cost | visuals score into sets from your very first shows — you want players VJing early |
| **Sound System Builder** | **Mid** — once you own a real PA / run renegade stages (Renegade DJ rep) | a "build your first rig" mentor quest (the school-bus glitch-hop wizard / a soundsystem elder) + capital | the rig only matters once you're *hosting*; this is your cash-ROI engine |
| **Stage Builder (renegade)** | **Late Act 1** — Side Stage rep + a land claim | Renegade DJ rep + a lease/claim + serious capital | building a venue is the "own the means of production" leap |
| **Stage Builder (sanctioned) → Festival (Act 2)** | **Endgame** — the Festival Founder capstone | the capstone questline | the full budget/management sim is the finale |

Natural order: **Visuals → Sound System → Stage → Festival.** Each is a deeper, pricier creative layer — the artist → venue-owner → mogul arc made literal.

### How to think about cost (two separate costs)

Split every builder into **(a) the unlock gate** (one-time: quest + rep + a meaningful-but-not-crushing cash cost) and **(b) the component cost curve** (ongoing — what you spend *inside* the builder).

| Builder | Unlock cost (relative) | Component curve | Notes |
|---|---|---|---|
| **Visual Builder** | **Cheap** | modest — loop packs, FX, AI credits | visuals are accessible by design |
| **Sound System** | **Mid** (~ a mid PA tier) | **long-tail** — scavenged blown sub → Funktion-One-tier flex | it's an **investment**, not a sink — it earns back by hosting |
| **Stage Builder** | **Expensive** | high — rig, decor, amenities, artist fees | the biggest single Act 1 investment; generates revenue |
| **Festival (Act 2)** | the capstone | the entire finance sim | tickets/lineup/infra budgeting |

**Cost principles:**
- **Long-tail component curves** mean there's always a pricier rig/stage/effect to chase — a healthy late-game money sink that's really **reinvestment** (the PA and stages pay back, so spending is ROI, not waste).
- **Relative magnitudes:** Visuals cheap · Sound System mid (ROI-positive) · Stage expensive · Festival = the whole budget.
- **The loop:** host sets → earn → reinvest in your rig/stage/visuals → move bigger crowds → earn more. The three builders are where your profits *go*, and why you keep hustling.

*(All figures relative and tunable — exact prices come out of full economy balancing, like the Act 2 toilet ratios.)*

---

## PART 3 — Sound System Prestige & Legacy

Your rig isn't just gear — it's an **entity with its own reputation,** tracked separately from yours but feeding it. A legendary system becomes a *destination*: sought-after to hear, sought-after to play on, and a source of street cred for whoever built and runs it.

### What builds the rig's legend (the inputs)

| Factor | How it grows the legend |
|---|---|
| **Build & looks** | craftsmanship, custom scoops, lights, heady artistry — a beautiful rig draws eyes and reverence |
| **Sound quality** | SPL, frequency signature, tuning — "that rig *hits different*" travels by word of mouth |
| **Pedigree (who's played it)** | the names of DJs who've blessed it — a famous headliner's set makes its legend *jump* |
| **Iconic moments** | the transcendent sunrise set, the night something special happened (provenance, like a guitar a legend played) |
| **Soundclash record** | wins against rival systems build its battle reputation |
| **Crowd memories** | how many people have had a peak experience on it |

### What the legend unlocks (the outputs — why it matters mechanically)

- **Sought-after to HEAR** — crowds travel to your stage *for the rig itself*, independent of the lineup. A legendary system is a draw on its own → more door, tips, and vendor income (feeds the hosting ROI loop).
- **Sought-after to PLAY ON** — DJs start asking *you*. This **flips the booking economy**: instead of you paying artists, owners of prestigious rigs get artists seeking them out (it's an honor, sometimes a paid privilege) — and every big name who plays it *further* boosts its pedigree. A virtuous cycle.
- **Street cred for YOU** — the rig's legend rubs off on its builder/owner, feeding **Festival Famous** and **Renegade/soundsystem faction rep.**
- **Rental / lease income** — other crews and stages want your famous rig → passive income.
- **Booking leverage** — a prestigious rig earns better set times and festival placement; in **Act 2 it becomes your festival's marquee draw** ("come hear the legendary [rig name]").

### The catch (so it's not pure number-go-up)

- **Prestige can be dented:** a flop or train-wreck on it, a **soundclash loss**, **blown speakers mid-set** (public embarrassment), or letting a mismatched/bad DJ play it.
- **So you curate who plays it** — the gatekeeping choice: protect the prestige (only proven names) vs. **PLUR openness** (bless a wide-eyed up-and-comer for goodwill). A real values fork.
- **Neglect costs luster** — stop maintaining/investing and a legend fades.
- **Authenticity vs. hype** — a flashy commercial rig and a sonically-perfect underground rig earn *different kinds* of cred from different crowds (the Legend↔Deity fork, in hardware form).

### The legacy arc
Scrappy hand-me-down nobody's heard of → locally known → **regionally famous across the Tour** → a legendary system people make pilgrimages to hear → **THE rig that defines your Act 2 festival** — a name whispered like the Sculptor.

### Interlocks
The sound-system builder (the rig) · Festival Famous & brand · the hosting ROI loop (legend = bigger crowds = more money) · the booking economy (DJs seek your rig) · the Soundclash · Renegade/soundsystem faction rep · the two paths (commercial vs. heady cred) · provenance quests (*The Phantom Set*) · the Tour (reputation travels) · Act 2 (your rig is the marquee).

> Your rig earns its name the same way you do — by what it sounds like, who it's lifted up, and the nights people will never forget on it.


---

# Part 4 — The Visual (VJ) Builder

# SHAKEDOWN — The Visual Builder (In-Game VJ Studio)
*Companion to the main design doc. Player-created live visuals for your sets and stages.*

## The honest reframe (read first)

Yes — and it slots in beautifully, because every DJ set in this game *already wants* visuals behind it. But here's the scope-real talk I've given on the other big swings:

- **The dream:** "Photoshop + After Effects, in-game." Drawing every frame from scratch.
- **The smart build:** **a VJ rig, in-game** — combine, layer, tweak, and *react.* This is how real VJ software (Resolume, TouchDesigner) actually works.

The VJ-rig approach isn't a compromise — it's *better*, for three reasons: (1) freehand pixel-pushing is enormously expensive to build and most players can't draw a good loop from scratch anyway; (2) a modular "sample, layer, react" system gets *anyone* to a gorgeous, music-synced show in minutes; (3) it has a far higher skill ceiling that's actually about *performance*, not draftsmanship. So: build the VJ rig as the core, and offer freehand/import/AI as the dream-tier ceiling on top.

---

## 1. The Builder — Floor to Ceiling

| Layer | What it is | Skill floor → ceiling |
|---|---|---|
| **Loop Library** | a big bank of trippy elements — fractals, plasma, kaleidoscopes, geometric patterns, liquid, nature footage, logo/text slots | pick & place (floor) |
| **The Compositor** | stack layers with blend modes, hue/color shifting, masks, transforms — the "Photoshop feel," but for motion | approachable layering |
| **Audio-Reactivity** | link visual parameters to your music: kick pulses the visuals, bass warps them, the **drop triggers a scene change**, frequency bands drive color | the magic — and it's free off your mixing engine's beat-grid |
| **Generative / Shader FX** | procedural particles, feedback trails, datamosh, fractal zooms — driven by knobs, not code | tweak-by-parameter |
| **Freehand & Import** | draw your own elements; import your own images/clips/logos | the dream tier |
| **AI Generation** | prompt-generate textures and loops to drop in (your original **Higgsfield** instinct, *inside* the game) | accelerator |
| **Scenes & Visual Setlist** | save multiple "scenes" and sequence/trigger them live | the performance |

**The key insight:** the **same beat-grid that drives your mix drives your visuals.** Audio-reactivity isn't a separate system you build from scratch — it's the mixing engine's tempo/FFT data piped into visual parameters. One source of truth, two art forms.

**Import caveat (same as custom MP3s):** your own assets for private play = fine; for streaming/commercial you need **Streamer Mode** (swap/disable custom assets during capture) and the "you're responsible for your files" stance. The default Loop Library ships as licensed/original content.

---

## 2. Performing — Live VJing

Visuals aren't wallpaper — they're a **gameplay layer that scores into the set.** A great visual show boosts **Crowd Energy, Vibes, and Cred** on top of your audio mix; a flat one leaves points on the table.

- **Trigger scenes live** during your set, hit visual "drops," react to the room.
- **Assist scaling (consistent with everything else):** beginners get **Auto-VJ** (visuals react to the music automatically). Pros **manually trigger** scenes for a tighter show. The **Sculptor-tier flex** is running *both* music and visuals manually — peak mastery, two hands, one brain.
- **Delegate or co-op:** hire a **VJ NPC**, or — multiplayer hook — let a **friend run your visuals** while you mix. The festival B2B, but audio + visual.

---

## 3. Visuals as Identity & Brand

Like your stage fit, your **visual aesthetic becomes part of your recognizable brand.** People know your look. It lands on your **posters**, your **stage**, and feeds the **Festival Famous** capstone. The Sculptor has a signature *visual* signature, not just a sonic one — "craft a sound nobody's heard" gains a twin: *show them something nobody's seen.*

---

## 4. The VJ Career & Economy

A whole second creative role and revenue stream:
- **VJ-for-hire** — get booked to run visuals for other DJs' sets (a service hustle).
- **Sell visual packs** — like selling track IDs, but loops and scenes.
- **VJ reputation** — build a name as a visual artist; the best DJs request *you.*

---

## 5. Stage Builder Synergy (Act 2)

This is the payoff multiplier: the visuals you create **play on the LED walls and projection-mapped surfaces of the stages you build** in Act 2. You design the stage *and* the show on it. Two of your creative systems feeding each other — your festival looks like *yours,* end to end.

---

## 6. Community

Same pattern as custom stages and crates: players **share visual packs and scenes.** A creative-community layer that keeps content flowing long after launch.

---

*Interlocks with: the mixing engine (shared beat-grid powers reactivity), Crowd Energy & Vibes scoring, the brand/Festival-Famous identity, the Stage Builder's screens (Act 2), the custom-import + Streamer-Mode framing, and your original Higgsfield/AI intent — now a tool the player wields in-world.*


---

# Part 5 — Progression & Longevity — The Skill Tree

# SHAKEDOWN — Progression & Longevity
### The Skill Tree · Act 2: Festival Mogul
*Companion to the main design doc. This is the answer to "it should take a long time to beat."*

---

## 1. Built to Be Long — the longevity architecture

The game is **two full acts**, not one:
- **Act 1 — The Come-Up:** survive the lot, climb the DJ ranks, master a Signature Sound, headline.
- **Act 2 — The Empire:** retire from the decks (or don't) and build & run your *own* festival, year over year.

Each act is a full game's worth of play. Stacked on top:
- A **7-branch skill tree** you specialize in *by necessity* early (you become a *type*) — but it's **time-gated, not hard-capped**: a decades-deep lifer can eventually master all of it, which is exactly what a **Certified Head** is.
- **The Tour** — multiple festivals/biomes to conquer.
- The **Signature Sound ladder** (11 tiers to the Sculptor).
- **118 quests** and counting.
- **Two endings** + heavy specialization → real replay value.

This is a 60-hours-plus game by design, with an endless sandbox tail.

---

## 2. The Skill Tree

**How points work (a hybrid, so it never feels grindy *or* trivial):**
- Earn skill points from **leveling, learn-by-doing** (using a skill improves its branch), and **quest/mentor rewards.**
- Tiers per skill: **Novice → Adept → Pro → Master → Capstone.**
- **Capstones are gated behind questlines, not just points** — you can't buy your way to mastery; you have to *earn* it (the Sculptor's Trial, the Festival Founder arc, etc.). This is a big longevity lever.
- **Limited respec — "The Vision Quest":** once per festival, an ego-death ritual (mushroom tea, sweat lodge — pick your flavor) lets you reallocate a *few* points. Enough to experiment; not enough to erase your identity.

**The 7 branches:**

| Branch | Theme | Sample progression → **Capstone** (gated by questline) |
|---|---|---|
| **The Decks** | performance | tighter beatmatch → live EQ/loops → hot cues + harmonic mixing → scratching/juggling → **The Sculptor** (live sound-sculpt + genre-bend mid-set) |
| **Production** | making tracks | bedroom basics → remixing → signature sound-design palette → faster output/collabs → **The ID** (produce the festival's most-chased track) |
| **Hustle** | business | cook faster → **Price Sense** (clearer fair-price band) → bulk logistics/2nd stall → **Demand Whisperer** (predict heat-wave spikes early) → **Lot Baron** (passive multi-stall supply chain) |
| **Charisma** | social | extra dialogue → boosted rep gains → networking (more allies/+1s) → **Smooth Talker** (defuse the Buzzkills) → **Festival Famous** (every door opens; NPCs seek *you* out) |
| **Streetwise** | outlaw | quieter movement / slower heat → fence-jump stealth → credential forging → safer balloon game → **Ghost** (near-immune to ejection, master smuggler) |
| **Wellness** | survival/care | slower needs decay → faster recovery / more active hours → foraging + comedown resistance → **Caretaker** (stabilize others for big Cred) → **The Anchor** (barely manage needs; the calm everyone leans on) |
| **Ringleader** | management | *(mostly locked early)* book one NPC DJ → curate a small lineup → marketing + crowd-flow → event finance/logistics → **Festival Founder** (unlocks Act 2) |

**Synergies reward hybrids:** Charisma + Ringleader = cheap headliner bookings · Hustle + Ringleader = a profitable vendor village · Streetwise + Decks = legendary renegade stages · Wellness + Charisma = the beloved-elder path.

**Why you specialize:** for a long time the tree has far more nodes than you've earned points for, so you *become* someone — **the Outlaw Hustler**, **the Heady Producer-Recluse**, **the Beloved Ringleader** — which maps onto the two endings and drives replayability. Only the decades-deep lifer eventually rounds out into mastery of everything (the Certified Head).

---

## 3. Act 2 — Festival Mogul (the management endgame)

**The trigger:** beat the end-game gig (you're a **Festival Legend** or **Underground Deity**) and earn the **Festival Founder** capstone → Act 2 opens. You pivot from *performer* to *organizer.* This is a whole second game: an RCT/Thrillville-style tycoon sim at full festival scale, played out **year over year.**

### What you manage

- **Site design** — multiple stages, campgrounds, a vendor village, *plus* the unglamorous infrastructure that actually makes or breaks an event: **power, water, medical, security, sanitation (yes, porta-potty math), parking, ingress/egress.** Underbuild any of it and you get incidents.
- **The lineup** — book artists across genres and budgets. **Your Act 1 relationships pay off enormously:** DJs you mentored headline cheap, the rival you beat in a B2B now owes you, the conspiracy guy "holds the field." Balance a splashy headliner budget against discovering cheap undercard talent.
- **Tickets & pricing** — tiers (GA / VIP / comps) running the **dynamic-pricing model scaled up:** early-bird, lineup-reveal hype spikes, scarcity/FOMO, day-of pricing. Too high → empty fields; too low → money left on the table *and* dangerous overcrowding.
- **Budget & finance** — you can genuinely **lose money.** Loans, sponsors (sell out a little for cash — the Cred tension returns at scale), reinvestment.
- **Marketing & hype** — announce trailers, staggered lineup drops, social buzz, influencer wooks. Anticipation is a resource you build.
- **Live operations** — during the event you manage crowd flow and respond to **the crisis events from the organizer's side** now: the Storm, a medical surge, the Stampede, a headliner cancellation — all *your* problem this time. The Act 1 crises flip perspective.
- **Brand & reputation** — a great festival grows your brand → bigger lineup and crowd next year. A bad one shrinks it.

### The multi-year arc
Start with a tiny one-day **boutique fest** and grow it across in-game years into a multi-day **destination** on the Tour. This is the long-tail endgame that keeps the game going long after the DJ campaign.

### The failure state — "the Fyre scenario"
Overpromise, underbuild, oversell tickets, skimp on water and toilets → stranded crowds, no infrastructure, a riot, a torched brand, and possibly lawsuits. A real (and darkly funny) lose condition that makes the management *mean something.*

### You can still play
Cameo headline sets at your own festival — your Act 1 mastery doesn't evaporate; it becomes the crown jewel of the event you built.

### The true ending (and endless mode)
There's a "win" — a legendary, beloved, *profitable* destination festival — but also an **endless sandbox**: keep growing it, or found fresh festivals in new biomes. From recycling cans for deposit to running the whole circuit. The game doesn't really end, which is the entire point.

---

*The whole shape: **Act 1** makes you a legend on stage; **Act 2** makes you the person who builds the stage. The skill tree decides *which kind* of legend — and you'll need more than one playthrough to see it all.*


---

# Part 6 — Advanced Systems

# SHAKEDOWN — Advanced Systems
### Heat & Re-Entry · Dynamic Pricing · The Stage Builder
*Companion to the main design doc. Three deeper systems that plug into what we've already built.*

---

## 1. Getting Ejected — and Getting Back In
*Extends §4 (the Buzzkill Meter) and the Security faction questline.*

When the **Buzzkill Meter** maxes, you're walked to the gate. This is a real setback, not a game-over:

**What ejection costs you:**
- Grounds access cut — active hustles pause, your campsite is now *behind the fence.*
- Any **booked set you miss while out** is forfeited (brutal if it was a rank-up gig — real stakes).
- Possible fine / confiscated inventory on the way out.

**Ban escalation (so it can't be abused):** your first ejection is cheap and easy to undo. Repeat offenders get **"flagged"** — gate staff recognize you, the easy methods close, and you're forced onto the harder paths. Three strikes and you're working for it.

**Three ways back in** (the usual Cash / Chaos / PLUR fork):

| Path | Methods | Cost / Risk |
|---|---|---|
| **Buy back** *(Cash)* | scalp a wristband off a gate-side dealer (might be **fake** → caught again = worse); bribe a guard (needs Security rep — ties to *Inside Man*); hire a "fixer" NPC | Fast, expensive, fake-band risk |
| **Sneak back** *(Chaos)* | fence-jump stealth mini-game (patrol patterns + gaps); smuggle in via a vendor supply truck (needs Lot Vendor ally → *Supply Run*); the creek/tunnel route (a lot-rat secret); steal/borrow a **staff or artist credential** and walk in the front | Cheap, thrilling, caught = longer ban |
| **Earn back** *(PLUR)* | do cleanup/teardown "community service" for a pardon; get **vouched for** by someone with pull — a booker, a beloved vendor, a headliner you helped earlier | Slow, free, makes your past kindness pay off |

**Design hook:** the *Earn back* path is where earlier relationships cash in — that headliner you helped in *Sober Sunrise* vouches for you at the gate. It makes the whole PLUR economy feel consequential.

**Prevention (before it maxes):** lay low at camp to "go dark" and cool the meter (*Heat Death* quest), dump hot inventory before a sweep, or pre-emptively bribe a guard. Ejection should always feel like *you pushed your luck*, not a random punishment.

---

## 2. Dynamic Pricing — You Set the Price
*Extends §5 (the hustle economy). This is the universal pricing layer for ALL vending — water is just the clearest example.*

You set your own price on everything you sell. Nail the read and you print money; misjudge it and you sit on stock.

**Demand is driven by conditions:**
- **Temperature** — a hot day spikes water demand; a **Heat Wave** event sends it through the roof.
- **Time of day** — food peaks at meal/munchie times; water peaks midday and *after* late-night dancing; balloons peak late.
- **Crowd density** — set up near the main stage during a headliner and thirst is enormous.
- **Scarcity** — if other vendors are sold out, the market is yours; charge accordingly.

**Elasticity — the sweet spot:**
Every item has a **fair price** the crowd expects, shown as a shaded band.
- **Below the band** → sells out instantly, thin margin, you run dry fast.
- **In the band** → strong volume *and* margin. The pocket.
- **Above the band** → volume drops off; *way* above → NPCs grumble and walk.

**The gouging vs. fairness hook (ties to the two endings):**
Jacking prices during the **Heat Wave** crisis = max cash, but it dents **Vibes**, draws **Buzzkill heat** (security cracks down on gougers), and hurts vendor rep. **Fair** pricing in a crisis earns serious **Cred**. The commercial path gouges; the Underground-Deity path keeps it kind.

**Competition:** rival vendors reprice too. Undercut them to steal sales — but start a **price war** and you both race to the bottom. Reading when to hold price vs. undercut is its own skill.

**UI sketch:** a per-stall panel — live **Demand** readout (Low/Med/High from temp + time + crowd), the shaded **fair-price band**, your **price slider**, and a **projected volume + margin** preview. Commit, watch the live sales ticker, and **reprice any time** as conditions shift. The pro move: stock up cheap *before* a forecasted heat wave, then ride the spike.

---

## 3. The Stage Builder (RollerCoaster Tycoon, but for festival stages)
*Extends §8C — this is the full realization of the "own the venue" PA track. The endgame creative + economic sandbox.*

**The arc this unlocks:** broke wook selling grilled cheese → DJ → **PA owner** → **venue owner** → **promoter** → ultimately **festival founder.** It's the whole game's rags-to-riches dream made literal.

**Unlock gating:** money **+** Renegade-DJ reputation **+** a claim/lease on land. You don't just plop a stage — you earn the right and the capital.

### Renegade vs. Sanctioned (the risk layer — ties straight to the Buzzkill system)

| | **Renegade stage** (woods) | **Sanctioned stage** (leased plot) |
|---|---|---|
| Cost | Cheap, fast | Expensive lease + fees |
| Money | Keep everything | Share with festival org |
| Rules | None | Curfews, sound limits |
| Risk | **Buzzkill heat accrues — security can RAID and tear down your build & rig** | Safe; can grow into a permanent fixture |
| Vibe | Outlaw, legendary potential | "Going legit" |

### What you build (Thrillville-style placement)

- **The stage** — tier/size sets crowd capacity and prestige (riser → side stage → main-stage scale).
- **Your rig** — place the **PA you bought in §8C** (subs + tops). Bigger rig = bigger sound radius, crowd cap, and energy ceiling. *This is where "buy and put your own rig here" lives.*
- **The whole surrounding area** — paths, lighting, lasers, LED walls, art installations, totems, shade structures, chill zones, hammocks, fire pits.
- **Vendor plots** — place stalls (run them yourself or **rent to NPC vendors** for passive income). Fed, hydrated, happy crowds stay longer.
- **Amenities** — water stations, *clean* porta-potties (yes, this raises satisfaction), a chill-out/first-aid tent (reduces bad-trip incidents that tank your vibe rating), charging stations.
- **Decor / theme** — aesthetic items raise the area's **Vibe Rating** (same currency as your camp), which pulls bigger crowds and better artists.

### The economic loop (the RCT guts)

Crowds show up based on **who's booked + your Vibe Rating + location + word of mouth.** Their **satisfaction** is driven by sound quality, amenities, not being over-crowded, and the lineup. **Happy crowds stay longer, spend more, return, and raise your stage's reputation** — which pulls even bigger crowds. The flywheel.

- **Income:** door/donations, vendor rent, your own stall sales, bar (if sanctioned).
- **Costs:** rig, decor, **artist fees** (you pay DJs to play), power/generator, security, upkeep.

### Becoming a promoter

You now **book the lineup** — including yourself. Each NPC DJ draws their own Signature-Sound crowd; book a big name for a big fee and a big turnout, schedule set times, run B2Bs. The game quietly flips: you've gone from *artist* to *venue owner and promoter.* Your relationships and your ear for talent become the gameplay.

### Prestige → Found Your Own Festival (the capstone)

Your stage levels up (Vibe Rating + reputation) until it becomes a **destination** — a named stage people travel for. Push it far enough and the ultimate endgame opens: **found your own festival** on the Tour circuit. The §A rank "*you ARE the festival now*" becomes literal ownership. From recycling cans for deposit to running the whole field.

*(Optional online layer: like RCT/Thrillville park-sharing, players could share custom stage/area designs.)*

---

*How it all interlocks: the Stage Builder spends the money your Dynamic Pricing earns, runs on the PA from §8C, and — if you go renegade — feeds right back into the Buzzkill/Re-Entry loop when security comes to shut you down. Every system now touches every other one.*


---

# Part 7 — Act 2 — Festival Operations

# SHAKEDOWN — Act 2 Operations
### What Goes Wrong · How You Know Before It Does
*Companion to the Progression & Longevity doc. The guts of the festival-management endgame.*

---

## Part 1 — The Master Variable: Attendance

Everything in Act 2 keys off **how many people show up.** And *you* control that, via ticket pricing/tiers (the dynamic-pricing model, scaled up) and your lineup's draw. The core loop:

> **set prices / book lineup → that sets attendance → attendance sets every requirement → you must build to match.**

This is why **overselling is so dangerous: it's a multiplier on every other failure at once.** Sell 20k tickets for a site built for 8k and your toilets, water, food, medical, *and* security all fail simultaneously. Matching ticket volume to real built capacity is the central skill of the whole act.

---

## Part 2 — The Failure Matrix

Failures come in **degrees** (grumbling → incidents → catastrophe), not on/off, and they **compound** — overcrowding makes every capacity shortfall worse at the same time.

| System | If underbuilt | Cascade | Brand / $ outcome |
|---|---|---|---|
| **Sanitation (toilets)** | lines, then people use the treeline | filth, stench, "hazard" zones, illness risk | "the toilet festival," health-dept heat |
| **Water** | dehydration (brutal in heat) | medical surges, faintings, heat casualties | liability, lawsuit, shutdown risk |
| **Food** | vendor lines, stalls sell out | hangry crowd, black-market gouging, early exits | vendors lose money & won't rebook |
| **Medical** | can't absorb heat/overindulgence surges | preventable emergencies escalate; deaths | investigation, permits revoked, event ended |
| **Security — too little** | theft, fights, mass fence-jumping | overcrowding from free entry, injuries | lost revenue **+** safety incidents |
| **Security — too aggressive** | heavy-handed patrols, confiscations | crowd resentment, viral "bad security" clips | brand hit from the *other* direction |
| **Capacity (oversold)** | site exceeds safe limit | crush zones (the Stampede), fire-marshal violation, *everything* overwhelmed | shutdown; multiplies all failures |
| **Power** | generators undersized | stage outages mid-headliner, sound cuts | refund demands; artists refuse to play |
| **Parking / ingress-egress** | too few lanes & lots | hours-long entry, missed sets, night gridlock | community/permit backlash |
| **Noise / curfew** (sanctioned) | exceed the ordinance | fines, forced curfew cutoffs kill the headliner | lose the venue lease, lawsuits |
| **Weather / drainage** | no storm plan, low ground | mud, flooding, canceled sets, stranded campers | the Storm becomes a catastrophe |
| **Lineup fit** | wrong artists / headliner cancels, no backup | disappointment, walkouts | refunds, low return rate next year |
| **Shade & heat** (desert biome) | no cover | heat casualties | medical load + liability |
| **Waste / cleanup** | no leave-no-trace crew | grounds become a dump | environmental fines, lose the land |
| **Budget / finance** | *overspend* (usually a headliner) vs. undersell | cash crunch even if the show was good | bankruptcy — the *inverse* of Fyre |

Note the **two-sided failures**: security and finance can fail from *too much* as easily as too little. Good design isn't "max everything" — it's *balance*.

### The Fyre Scenario
The named catastrophic ending = **compound failure**: overhype the marketing, oversell the tickets, underbuild the infrastructure. Stranded crowds, no water, no toilets, a riot, a torched brand, lawsuits. It's not one mistake — it's the *stack.*

---

## Part 3 — How You Know What You Need (the planning UX)

A disaster is only *fair* if the game told you it was coming. Four layers, before the gates ever open:

**1. The Requirements Panel.** Based on **projected attendance**, the game shows target ratios and a live "**have N / need M**" readout per system. Illustrative (these are tuning knobs, loosely modeled on real event planning):

| System | Rough target |
|---|---|
| Toilets | ~1 per 75–100 attendees |
| Water stations | ~1 per 500–1,000 |
| Medical staff | scales with size + heat/biome |
| Food throughput | vendor capacity ≥ peak meal demand |
| Security | a ratio that rises with crowd + alcohol |
| Parking | spaces per carpool group |

**2. The Readiness Dashboard.** Every subsystem shows **green / yellow / red** against projected attendance. Red = you're heading for a disaster. This is your safety net — the warning is impossible to miss.

**3. The Advisor NPC.** A seasoned ops chief translates the numbers into plain talk: *"Boss, this lineup pulls 20k. You've got toilets for 8k. That's a riot waiting to happen."* Tie this to a **Phase-1 ally** — the veteran vendor or sound-crew elder you befriended becomes your Operations Chief in Act 2. Relationships pay off again.

**4. The Forecast / Stress-Test.** A "what-if" preview: lock in your build and attendance, and the game projects a **satisfaction + risk forecast** before you spend a dollar. Run scenarios, find the red zones, fix them on paper.

**Assist scaling (consistent with the DJ mixing game):** beginners get explicit "you need M toilets" targets and an advisor who nags. Veterans can **turn the recommendations off** for a harder, realistic challenge — read emergent demand yourself, no training wheels.

---

## Part 4 — Live Ops & the After-Action Report

**During the event** you mostly *can't build* — so the live phase is about **managing flow**: open more gates, redeploy staff to the worst queues, emergency water runs, redirect crowds away from crush zones, kill a stage's volume before the curfew fine hits. Your planning mistakes surface here as live crises (the Act 1 crisis events — Storm, Stampede, cancellation — now from the boss's chair).

Live tools: **queue-length and crowd-density heatmaps**, a satisfaction meter, and incident alerts.

**The After-Action Report.** Post-event, an itemized post-mortem: *"3,200 attendees couldn't reach a working toilet · sanitation satisfaction −60% · brand −2 stars · 14 vendors won't rebook."* You learn exactly what broke, fix it, and rebuild. Year over year, this is the **mastery curve** that makes Act 2 a long game — and makes a clean, beloved, profitable festival feel genuinely earned.

---

*The whole act is one honest bargain: the game shows you the math, warns you in three colors and a human voice, and then holds you to your choices. Skimp to pad your margin and the riot is on you — not the dice.*


---

# Part 8 — World Structure & The Tour

# SHAKEDOWN — World Structure & The Tour
### Your home festival, the circuit, and how content is laid out across the world
*Companion to the design bible. Deepens the Tour concept from the core GDD.*

---

## The Short Answer

**Yes — one home festival is the dense content hub and your anchor, and other festivals come later with their own quests.** That's the structure. One refinement, though: the other festivals aren't *smaller copies* of home — they're **new settings that remix the same deep systems and add their own focused local content.** Same depth, different world. That's what keeps the Tour exciting instead of feeling like reruns.

---

## The Home Festival (your anchor)

The densest, most content-rich ground in the game — your **main map.** It holds:
- the **bulk of the quests** (most of the universal pool + your Calling's main career spine),
- your **camp / home base** and **Patches** at the hub,
- your **core relationships** and the social web that everything pays off through.

Most of **Act 1** lives here, and that's deliberate: **you can't build deep relationships while constantly moving.** Concentrating the social systems at home is what makes the NPC arcs, your crew, your regulars, and the **Ringleader's rolodex** actually accrue and pay off. Home is where you *belong.* It recurs as the annual flagship you always come back to.

---

## The Tour (the circuit of festivals)

The other festivals are **expeditions** — the same systems, recontextualized. Each one layers on:
- **A biome challenge** that changes how you survive and play — **Desert** cranks the heat (hydration crisis territory), **Beach** adds sand-and-water hygiene, weather shifts the whole vibe.
- **A pocket of local NPCs & quests** — new faces, new lot characters, festival-specific stories.
- **Exclusive opportunities** — gear, track IDs, contacts, scenes, and crowds you can *only* find there.
- **Progression gates** — some festivals open only later and run higher-tier content.

Examples on the circuit: **Forest** (home) → **Desert** → **Beach** → **the Big Destination Fest** (endgame scale). Each is a *new context for mastery*, not a watered-down home.

**What travels with you:** gear, skills, rep, and **contacts** persist across the whole Tour (the meta-progression). You carry your *self* from festival to festival; the ground changes underneath you.

---

## The Rhythm: Base + Expeditions

Home is where you **build and belong**; the Tour is where you **adventure and bring it back.** That loop — settle and deepen, then venture out and test yourself in new conditions, then return richer — is the macro-shape of the game. It's why the home hub is dense and the satellites are flavorful-but-focused.

---

## How Quests Distribute
- **Home:** the bulk of the **universal** quests (comedy, world events, heartfelt, factions) + your **Calling's** main career spine.
- **Tour festivals:** *more* universal quests (local color and events) + the **continuation** of your Calling's chain + a handful of **festival-exclusive** quests you can't get anywhere else.
- All of it **surfaces through the discovery system** as you explore each new ground — never a dumped checklist.

Because the **core systems are shared**, every new festival is a **content layer** (biome + local NPCs + local quests), *not* a rebuilt game. That's the whole trick to scaling a huge world affordably.

---

## The Act 2 Turn

You spend Act 1 walking through *other people's* festivals — learning the circuit, building the network. Then Act 2 flips it: **you found and run your own.** Your home-festival experience + your contacts rolodex become the blueprint and the lineup. The Tour taught you how; now you build the destination.

---

## Build Implications *(this is the "later on" you intuited)*
1. **Ship ONE festival first** — the home/Forest hub. Prove the loop, the systems, the vibe.
2. **Add festivals as expansions/updates** — each a biome + local-content layer on the shared systems. *This is exactly your "other festivals with other quests later on."*
3. **Never rebuild the game per festival** — the systems travel; only the setting and local content are new.

The cheapest path to a massive world is **one deep home + a growing circuit of remix-festivals**, not five full games stitched together.

---

## Interlocks
- **The Tour** — the meta-progression spine this formalizes.
- **Relationships, NPC arcs & the Ringleader rolodex** — concentrated at home so they pay off.
- **Quest discovery + the universal/path-specific split** — how content surfaces and distributes.
- **Needs** — biomes stress different needs (Desert→hydration, Beach→hygiene).
- **Act 2** — touring others' festivals sets up founding your own.
- **Build order** — ship the home slice, grow the circuit over time.


---

# Part 9 — Player Paths & Identity

# SHAKEDOWN — Player Paths & Identity
### From "DJ life-sim" to a festival-life RPG with many ways to be
*Companion to the design bible. Captures the multi-path expansion + how identity carries into the social universe.*

---

## The Big Shift

The original spine was **broke wook → headline DJ → festival mogul.** Your insight: *not everyone wants to be a DJ.* So the spine generalizes to:

> **broke wook → [your craft] → [your empire]**

DJing stays the **marquee path** (it's the richest, most marketable, and owns the rhythm game). But it becomes *one of several* ways to live the festival life. This is the jump from "a game about being a DJ" to **"a game about making it in festival culture, however you choose to."**

---

## The Path-Agnostic Spine

The two-act structure still holds for *everyone* — it just reskins per path:

| Path | Act 1: The Come-Up | Act 2: The Empire |
|---|---|---|
| **DJ / Producer** *(marquee)* | busk → open sets → headline | throw your own festival |
| **Sound Engineer** | tune others' rigs for cash → build a reputation | run the sound company everyone books |
| **The Ringleader** *(party-thrower)* | throw tiny renegade parties → small events | the full festival management sim |
| **The Maker (Fashion)** | sell tie-dye off a blanket → your own booth | a clothing brand across the circuit |
| **Food Vendor** | one griddle → a popular booth | a food empire / fleet of trucks |
| **VJ / Visual Artist** | visuals-for-hire → a signature look | the studio every stage wants |
| **Healer / Wellness** | workshops on the lawn → a following | run the Healing Village |

**Same emotional arc** (come up from nothing → build something that outlives you), **different craft and different core activity.** That's what keeps it one coherent game instead of seven.

---

## The Identity Model (answering "do I get locked in?")

**SHAKEDOWN is a life-sim, not a class-based RPG.** So:

- **One character per save.** You are a person at a festival, not a "DJ class."
- **You can pursue one path deeply, dabble in several, or pivot.** Your *identity* is **emergent** — it's headlined by your biggest achievement (the game knows whether you're "DJ Lunar Bloom, headliner" or "Sage, the tie-dye legend of Shakedown Street").
- **Switching paths does NOT require a new save.** You pivot in-world, and the existing **Vision Quest respec** (skill tree) already supports rebuilding. Want to quit DJing and open a food booth? Do it. The story bends.
- **New saves are for a genuinely fresh vibe** (a different origin, a clean slate) — *optional*, never forced.

This matters because it's the honest answer to "what if I change my mind": you don't lose your character or your world — you grow into someone new, the way people actually do at festivals.

---

## Stacking Paths — Can a DJ Also Build Rigs and Own a Booth?

**Yes.** Paths aren't classes you're locked into — they're **pursuits you invest in**, and you can stack as many as you want. A DJ can absolutely build their own sound system *and* run a booth. The question is never "are you allowed?" — it's **"at what cost?"** Three natural limiters (all already in the design) keep that choice meaningful, so breadth trades against depth instead of letting you trivially master everything:

1. **Skill points — time-gated, not hard-capped.** *Early*, you haven't earned enough points to be great at everything, so you **specialize by necessity**: a DJ dabbling in the Hustle branch runs a booth worse than a dedicated vendor — **at first.** But there's no permanent wall. A true lifer keeps earning points and clearing capstone questlines until they've genuinely mastered it all — which is **exactly what a Certified Head is:** the veteran who's been around so long they're a master of everything. Mastering all of it isn't impossible; it's the *ultimate* long-haul achievement (perfect for a game meant to take forever to beat). Specialization defines you for a long time — but the decades-deep lifer transcends it.
2. **Time & presence** — you **can't be in two places at once.** While you're DJing the sunrise set, you're *not* at your booth and *not* tuning your rig. The festival clock forces you to choose where to stand, moment to moment. This is the real limiter.
3. **Capital** — every pursuit needs investment (decks, PA components, booth stock). Money's finite, especially early; spread thin and you progress slower on every front.

### Delegation — the pressure valve
You don't have to physically tend everything. **Hire help** — an NPC (or, in the social universe, a friend/crew member) can run your booth or watch your rig while you play. It costs **wages**, a hired booth **earns less** than one you work yourself, and a lazy or sticky-fingered employee is a real risk (naps, skims the till, gifts product to cute strangers — comedy *and* management depth, and a foreshadow of Act 2's staffing).

### Natural synergies vs. divergences
- **DJ + Sound System building = natural synergy.** This is the classic sound-system-crew fantasy: build the rig you play on, get into **soundclash** (your rig *and* your set), self-sufficiency. The PA is already the DJ's "host" upgrade track — so a DJ growing into rig-building is core, not a stretch. (Many will still partner with a dedicated **Sound Engineer** instead — which is exactly where multiplayer crews shine: your buddy is the sound guy.)
- **DJ + Booth = divergent but classic.** Different skills, and they compete for time — but it's literally **the come-up** (you sell grilled cheese to afford your first controller). The question is whether you *keep and grow* the booth into a real business alongside the music. Delegation is how you do both.
- **Booth + Pins + Food = the small-business stack.** All Hustle-branch, and they reinforce each other — the natural shape of a vendor-mogul build.

### Why the game *wants* you to be able to stack
Depth wins **Act 1** (a specialist climbs faster and higher on their one ladder), but **breadth wins Act 2** — running your own festival means overseeing stages, vendors, *and* sound from above, so the generalist who dabbled in everything actually understands the whole operation. Specialize to become a legend; generalize to become a mogul. Both are real arcs.

---

## Your Calling vs. Your Hustles (focus *and* diversify)

The clean answer to "do I focus one path, or do everything?": **commit to one Calling, run many Hustles.**

- **Your Calling (one primary path)** — the pursuit you invest most in (DJ, Maker, Ringleader, Sound Engineer…). It's your **identity** (your nameplate, status, and Cred), the thing with the **high ceiling** (signature capstones, mastery, the Act 2 empire form), and the gameplay you actively *play*. It's **emergent** — revealed by where you've gone deepest, not picked at creation — and it can shift if you re-commit.
- **Your Hustles (a portfolio of side income)** — the universal cash activities anyone can run: a grilled-cheese stand, water sales, ticket flips, a small booth. You start them hands-on (the come-up), then **delegate** them (hire staff) so they run passively while you focus on your Calling. They build **Cash**, not identity.

**Why this naturally produces "focused identity + diversified income":** founding your festival in Act 2 takes **both currencies** — a **NAME** (Cred, which *only* your Calling builds) *and* **CAPITAL** (Cash, which your Hustles pile up). The Cash↔Cred model does the enforcing for free: you can't grilled-cheese your way to a legendary reputation, and you can't headline your way to a fat bankroll without selling *something*. So the smart player lands exactly where you want them — **one passion they're known for, plus several income streams funding the dream.**

**The Calling/Hustle line is just depth of commitment.** The same activity can be either: a delegated grilled-cheese stand is a Hustle, but pour your identity into it and it *graduates* into the Maker/Food **Calling** with its own empire. Your Calling can lean on Hustles in other domains, and any Hustle can become a new Calling if you pivot into it.

**How focus stays rewarded (so having a "main" always matters):**
- **Ceiling** — only your Calling reaches the capstones, the signature, the empire; Hustles stay lucrative-but-capped.
- **Cred** — identity and standing come *only* from your Calling; side cash can't buy them.
- **Active vs. passive** — your Calling is the hands-on, skill-expressive gameplay you're there for; Hustles trend delegated/passive, so your active time concentrates on your passion.

**The structure in one line: focus defines who you are; diversification funds what you're building.**

---

## Spotlight Path: The Maker (custom clothing) — *your idea, fully in*

A creation path that parallels the Visual Builder, but for **fashion** — and it's both a *feature anyone can touch* and a *full path you can commit to.*

- **The creation tool:** design your own **tie-dye** (fold patterns, dye palettes) and **patchwork** (panels, patches, stitching) — like the VJ studio, but for garments. Real expression, your designs.
- **The ground-up grind:** start by selling a single piece off a blanket on the lot → **materials cost money**, so you reinvest → save for a **booth** → upgrade it → become a **brand** with a name and a following.
- **Where it sells:** to NPCs (demand driven by the same pricing model as food/vending), and later **to other players** in the social universe (your fits on real people = status).
- **Act 2 form:** a clothing label across the whole circuit — the fashion cousin of the festival mogul.

The same template works for the **Food Vendor** path (one griddle → a beloved booth → an empire). These two are the proof that "start from nothing and build a small business" is a complete, satisfying way to play — no DJing required.

---

## Flow Toys — reclassified *(per your call)*

**Not a path.** A **side activity anyone can do** — pick up a hoop/poi/staff, hit the rhythm mini-game, earn **Flow points / Vibes**, tips, and cosmetics. It enriches any path (a DJ who also spins, a Maker who performs) without being a career of its own. Simpler, and it spreads the fun across everyone.

---

## How Deep Should Each Path Be? *(the answer: not equally)*

The honest answer to "make every path as deep as the DJ path": **no — and trying to is the trap that kills ambitious games.** Match a path's depth to two things: how *central* the fantasy is, and how naturally deep its core **verb** is. DJing has a marquee rhythm mechanic that can carry an entire game; a booth's core loop is lighter *by nature.* Pour equal effort into all seven and you get seven mediocre systems instead of one great one. So **tier them:**

**Tier 1 — Flagship: the DJ.** The deepest path, the marquee mechanic, the trailer, the most quests, the highest ceiling. The spine of the game. Built first and deepest.

**Tier 2 — Full alternate paths (just a couple).** Real core mechanics + their own career chain + an Act 2 empire form, but less total content than DJ. Best candidates:
- **The Maker** — the creation tool is genuinely deep and expressive (people *love* creation systems).
- **The Ringleader** — it's basically Act 2, which everyone plays anyway, so it's "deep for free"; in Act 1 it's throwing small events.
These are the "you could genuinely main this instead of DJ" paths.

**Tier 3 — Light paths / elevated hustles.** The booth, food vendor, **sound engineer**, VJ, flow artist, healer. Satisfying loops, but lighter — perfect as side hustles, diversified income, a casual playstyle, or **support** for the performance fantasy (the VJ and the sound guy literally feed the DJ's set). Most are delegatable. You *can* lean into one as your thing — it's just thinner than DJ until you expand it. **This is the honest home for "the booth" and "the sound guy"** — they don't need DJ-level depth, and forcing it would be wasted effort.

### So should everyone be a DJ?
**Not forced to — but DJ is the default spine and the deepest experience, and that's okay.** Most players will main it; the alt-paths serve players who want something different, and they give *everyone* the diversified-income layer (one Calling + many Hustles). Be honest that a booth-main run is *viable but thinner* than a DJ-main at launch — then **deepen whichever alt-paths players actually gravitate to**, post-launch.

### Path-specific vs. universal quests *(this is how you afford it)*
- **Universal quests = most of the content.** Comedy/lot-life (Buck, Where's My Car), crisis/world events (the Storm, the Raid), heartfelt/PLUR (Sober Sunrise, the Breakthrough circle), faction lines, the social fabric — **everyone** gets these regardless of path. They build the *world*, they're shared across every playthrough, so you build them **once** and every player benefits. The bulk of the 118.
- **Path-specific quests = your Calling's career chain.** The DJ ascension ladder, the Maker's brand chain, the Ringleader's event chain — fewer, gated by your path (surfaced via the discovery system), DJ's being the deepest.

That ratio — **one big shared world + focused per-Calling spines** — is what makes the whole thing affordable. You're building one rich festival everyone lives in, plus a deep DJ career and a few lighter ones, *not* seven full games.

---

## The Honest Scope Reality

Seven full paths is *enormous* — each marquee path needs its own core activity, progression, and economy. The buildable way (and it mirrors your multiplayer-later instinct exactly):

1. **Build the DJ path deep first.** It's the flagship, it has the rhythm game, it's the trailer. Ship the vertical slice and the first release as a DJ-focused game with the *architecture* built to accept more paths.
2. **Several "paths" already exist as hustles.** Food vending, clothing, flow, VJ are *already* activities in the bible — they graduate into full paths over time.
3. **Add paths like content updates** — Maker, then Ringleader, then Sound Engineer — once people are playing, the same way multiplayer arrives after the solo game lands.

You design the *path system* now so it's extensible. You *build* one path now so it actually ships.


---

# Part 10 — The Ringleader

# SHAKEDOWN — The Ringleader (the party-thrower path)
### "Promoter," reframed — the renegade who builds the magic, powered by a phone full of people
*Companion to the design bible. A Tier-2 Calling. Working name: **The Ringleader** (alt: the Plug, the Instigator).*

---

## The Reframe

"Promoter" is a boring *word*, not a boring *path.* The label sounds like a guy in a polo selling ticket packages. The real fantasy is **the scrappy renegade party-thrower** — the person who conjures a legendary night out of an empty field and a phone full of friends. It's part heist, part social web, part creative direction, with the law closing in. The least boring thing in the game.

---

## What You Actually Do (the loop)

**Scout the spot** (hidden clearing vs. big field — safety vs. scale) → **pull the crew together** (the heart — see below) → **build the vibe** (haul the rig, set lights, rig visuals) → **drop the location** (the underground whisper network — too loud and you're busted, too quiet and nobody comes) → **run the night live** (keep the energy, handle chaos, and dodge the Buzzkills closing in) → **the payoff** (a legendary night → your name grows → bigger events → eventually you **found your own festival**, which is Act 2).

---

## The Core Mechanic: Your Contacts *(your idea — the heart of the path)*

Every person you meet and befriend across the festival gets saved to your **phone contacts** — and when it's time to throw a party, **you call them up.** Your relationships aren't flavor; they're your **production resources.** You are the hub the whole scene plugs into.

### Building the rolodex
Meet someone, get on good terms (Familiar+ in the reaction system), and they become a **contact.** Collecting and curating a great rolodex is its own meta-game — like the track-ID crate, but for *people.* A bedroom DJ today is a headliner next season; the scrappy sound guy becomes a legend. Who you *know* is your inventory.

### What each contact is
| Field | What it means |
|---|---|
| **Specialty** | DJ/selector · sound crew · VJ · flow artist · vendor · fixer · muscle/haulers · *connector* (brings other people) |
| **Tier** | their skill / draw level (a Renegade Rookie vs. a Sunrise Shaman) |
| **Relationship** | how tight you are — the master dial (below) |
| **Reliability** | will they actually show, on time, with what they promised? |
| **Vibe / quirk** | the flaky genius, the loyal workhorse, the diva, the one who always knows a guy |

### The call — what your relationship buys
When you ring a contact, your standing with them decides:
- **Do they even pick up?** (low rep → straight to voicemail)
- **What do they charge / what's their cut?** (tight bonds = friend rates, favors, "I'll do it for the love")
- **How good is what they bring?** (tier + relationship + their current form)
- **Will they flake?** (low reliability = a no-show that can sink your night)

### Assembling the night (the heist-crew puzzle)
You've got a **venue size**, a **budget**, a **vibe target**, and **constraints** — a DJ is useless without a sound contact to bring a rig; a crowd needs vendors; a hot spot needs a fixer to keep the Buzzkills away. Filling those slots from your rolodex, within budget, to hit the vibe you want **is** the strategic core. Book a tight all-night lineup or one legendary headliner? Spend on a big rig or a fixer for insurance? That's the game.

### The phone is where it plays
GTA-style: scroll contacts, place the call, they answer **in character** (a tight contact greets you warm; a flaky one hedges). Coordinate the crew in a group chat. The Ringleader path largely *lives* in the phone — the rolodex is the dashboard.

---

## Your Social Web Is Your Power

This is the soul of the path: **every kindness compounds into capability.** The PLUR you spent, the mentee you raised, the sound guy you helped, the vendor you hooked up — they all come back as people who *pick up the phone* and bring their A-game *for the love.* The player who treated the scene well now commands it. Be a taker all game and you'll throw a party nobody answers for.

## Contacts Grow With You *(the "knew them when" payoff)*

Contacts run their own arcs (the NPC continuity system). Book your friends when they're nobodies and watch them blow up — now the headliner everyone wants *owes their start to your tiny renegade stage.* Your mentee becomes your cheapest legendary booking. That long-game payoff — your rolodex appreciating like stock you invested in with friendship — is the path's secret engine.

## Promoter Rep & the Feedback Loop

Throw great nights → playing your parties becomes **a good look** → better people start answering, even ones you barely know → bigger events. Flake on people or throw a busted dud → word spreads, contacts dodge your calls. (Ties to sound-system prestige, the booking economy, and your status.)

---

## The Act 2 Bridge *(the big one)*

The bible already says Act 2 lineups run on "**Act 1 relationships pay off — mentees headline cheap.**" The contacts rolodex **is that bridge, made literal.** The phone full of people you built as a renegade Ringleader *becomes your festival's lineup and crew in Act 2.* You don't start your festival from a blank booking screen — you start it from **years of friendships.** This is why the Ringleader is the most natural on-ramp to the endgame: the whole path is you assembling the human network you'll need to found a festival. **Act 1 Ringleader → Act 2 Founder is one continuous story.**

---

## Multiplayer

In the social universe, your contacts include **real players.** You call up your friends' characters to DJ, crew, vend, and spin at your party — the Ringleader becomes the **social organizer of the whole player community**, the one who throws the nights everyone shows up to. Possibly the single best "main" for a social player.

---

## Interlocks
- **NPC reactions, relationships & arcs** — contacts *are* relationships; the whole rolodex rides on that system.
- **The in-game phone** (Social Universe) — the interface the path lives in.
- **Factions** — your contacts span DJs, sound crews, flow artists, vendors, fixers.
- **The come-up** — you build the rolodex across the entire game; the payoff is cumulative.
- **Crews** — your regular contacts become your standing crew.
- **Buzzkill/heat** — fixers, lookouts, the bust risk, moving the party.
- **Status & titles** — promoter rep; a *Ringleader* / *Scene Builder* identity.
- **Act 2** — the rolodex becomes your festival lineup. The path's destiny.

---

## Tier & Build Note
A **Tier-2 full path** (its own core mechanic + career chain + Act 2 form), and arguably the best **endgame Calling**, because throwing a great party requires understanding DJs, sound, vibe, *and* hustle — so the generalist who dabbled in everything thrives here. It reuses systems already designed (phone + reactions + arcs), so its depth is **mostly assembly, not new tech** — a high-payoff path to build.


---

# Part 11 — Wardrobe & Fashion

# SHAKEDOWN — Wardrobe & Fashion
*Companion to the main design doc. Festival fashion is core culture, so this is more than a costume menu.*

---

## Character Creation — The Opening

At the start, you build your character:
- **Looks** — body, face, hair, skin (drawn from the same procedural parts library that generates the crowd; see §5).
- **Starting outfits** — a small set of **basic beginner fits** to mix and match. Everything iconic and exclusive is **earned or bought in-game later** — your wardrobe is your *visible come-up* (thrift-and-flip-flops on day one → a recognizable signature look by the end).
- **Your DJ name / handle** — because the whole game is about building that name's legend (Festival Famous, your rig's reputation, your festival's brand).

*(On "buy exclusive fits": with **in-game currency** earned by hustling, this is perfect progression. If "buy" ever means **real money**, that's a separate business-model decision — and for a game you give friends, cosmetics-as-earned-rewards is the cleaner, better-loved approach. Decide that deliberately, later.)*

### Do you pick a DJ archetype at the start? **No — and here's why.**

It's tempting, but a hard class-pick would **gut the spine of the game.** The Taste Ladder — starting on the "bullshit" (future bass / festival trap / melodic) and climbing to god-tier sound design and audiophile fidelity — *is the story.* Letting someone select "Sculptor" from a menu is like starting an RPG at max level: it skips the come-up, the satire, the humility, and the earned identity. And specialization is already handled better elsewhere — through the **skill tree** (which you can't max, so you become a *type*), **which sounds you chase**, and the **cash-vs-cred fork.** Your archetype is **forged through play, not chosen from a menu.**

**The reconciliation (so the "I want to choose something" itch is still scratched):** separate *cosmetic identity* (chosen freely, upfront) from *mechanical progression* (earned). The character creator gives immediate identity through looks, fits, and your name. Optionally, a light **origin/background** flavor pick — *bedroom producer · lot kid · burner · trustafarian slumming it* — colors your early dialogue and gives a tiny starting nudge (a small resource or stat lean), **without locking your sound or your ceiling.** Everyone still starts musically at the bottom and earns their taste.

---

## Two different problems (don't conflate them)

- **"*I* look unique"** → a deep **player wardrobe** + lots of distinct clothing vendors. Solved by content variety.
- **"*Every NPC* looks unique"** → **procedural outfit generation.** You cannot hand-author outfits for a crowd of thousands; nobody does. (See §5.)

Your "different vendors with different clothes" instinct is right — for the *player.* The crowd needs a different mechanism.

---

## 1. How the player wardrobe works

**The changing UX — a hybrid, so it's not all friction:**
- Your **full closet lives at camp** (and its size **scales with your campsite tier** from §8C — the RV has a real wardrobe; the ratty tent holds three shirts). This gives camp another reason to exist.
- But you carry a small **"bag" loadout** and can **quick-swap on the go**, and any clothing vendor doubles as a **fitting room.** So you're never forced into a long trek just to swap a hat.
- **Saved outfit slots** — "Day Fit," "Night Fit," "Stage Fit," "Rain Fit" — one-tap swapping as conditions change.

---

## 2. Cosmetic-first — but fashion *matters*

**The call:** clothing is primarily **self-expression**, with a **light, thematic functional layer** on top. In a festival game, what you wear should plug into the systems we already have — not as heavy RPG armor stats, but as soft, flavorful edges:

| Item type | Soft mechanical effect |
|---|---|
| Footwear (boots vs. flip-flops) | Stamina/Energy — flip-flops are comfy until they snap mid-lot |
| Shade (hats, parasols, sunglasses) | Slows **hygiene/hydration decay** in the sun (helps in Heat Waves) |
| Layers / jacket | Warmth for the cold **sunrise & night** sets |
| Rain poncho | Protection during the **Storm** crisis event |
| A flashy, iconic fit | **+Vibes/Charisma** in social interactions |
| Faction-coded fit | Rep & read-the-room — dress wook for the woods, clean for VIP/bookers, flow-gear for that crew |
| Your **stage look** | Crowd **recognizability & pull** — your fit becomes your brand (see §6) |

**The funk layer (ties to hygiene):** your fit gets visibly dusty/muddy over the weekend. Lean into it (the conspiracy guy's "the dirt is armor") or wash up at the river. A small systemic loop, pure flavor.

---

## 3. Where clothes come from

**Vendors as distinct "brands" — variety + a progression curve:**

| Vendor | Aesthetic | When |
|---|---|---|
| The Free Pile / thrift tarp | random finds, RNG | broke-wook starter |
| Tie-Dye & Tapestry booth | classic lot | early |
| Rave/Kandi gear | neon, fishnet, LED, kandi | early–mid |
| Heady / Flow couture | flowy, ornate festival-fashion | mid |
| Leather & Burner gear | utility, goggles, dust-proof | mid |
| Costume / Onesie shop | theme-night fits | situational |
| The Designer | high-end status pieces | late, expensive |
| Artist one-of-a-kind | commissioned, unique | endgame / Gift Lot |

**Other acquisition:** trades, the **Gift Lot** (gifted clothes carry sentimental Cred), quest rewards (signature items), and found pieces.

**DIY / customization** — the heart of festival fashion: tie-dye your own, sew on **patches**, add pins, distress, wire in LEDs. This ties straight into the existing **Patch Jacket collectathon** and your **crafting skill** — your best pieces are ones you *made.*

**Beyond garments — the self-expression layer:** hair styles/colors, **body paint, glitter, face gems, temporary tattoos, piercings, nails.** Festival looks aren't just clothes; the character/appearance system needs all of it.

---

## 4. Making every NPC look unique (the procedural answer)

**Honest production note:** an open-world festival crowd is thousands of bodies. You can't author each outfit. The real solution is the same one RDR2/GTA/AC crowds use:

1. **One modular clothing system** — mix-and-match slots (top, bottom, footwear, headwear, accessories, hair, body-art) drawing from a large shared piece library.
2. **Weighted archetype templates** — a "wook," a "raver," a "flow artist," a "vendor," a "bro," a "fairy," etc. Each archetype pulls from style-appropriate pieces, so the crowd reads as *characterful*, not random noise.
3. **Palette & pattern variation** — recoloring/repatterning multiplies apparent uniqueness for almost free. Two NPCs in the same shirt in different colorways look different at a glance.
4. **Named NPCs get hand-authored signature looks** — quest-givers and faction leaders (the conspiracy guy, the bookers) are memorable and instantly recognizable; the background crowd is procedural.

**The elegant part:** the **same modular system powers the player wardrobe** — you're drawing from the identical piece library, just with full manual control instead of weighted randomization. Build it once, get both the player closet *and* the living crowd.

---

## 5. The payoff — your fit is your brand

Fashion is your **visible come-up.** You arrive in one ratty thrift outfit; you end up in iconic, customized, one-of-a-kind pieces. That arc is readable at a glance and deeply satisfying.

And your **signature stage look** becomes part of your identity: NPCs recognize and comment on it, it feeds the **Festival Famous** capstone, and in **Act 2 it appears on your own festival's posters.** The kid in flip-flops selling grilled cheese becomes a silhouette people know.

---

## Signature & Statement Pieces *(a growing list)*

Specific iconic items worth calling out by name. A running catalog — add to it as ideas land.

### The Banana Hammock
The boldest fit in the game, short of going full Buck — a near-nude sling worn with pure, unshakable confidence.
- **Vibes/Charisma:** maximum audacity, and **polarizing** like funk is faction-relative — the party crowd *loves* the sheer send (**+Vibes**), while the buttoned-up world (VIP, bookers, the Buzzkills) visibly recoils. Wearing it is a flex that takes nerve.
- **Functional:** it's legit swimwear — ideal at the **River** and the **Beach** festival (heat & water).
- **The decency edge:** you're *technically* clothed (unlike Buck), so it rides the very legal edge of the Buzzkill line. Pure comedy.
- **Buck connection:** his spiritual cousin — a possible **Buck-approved unlock** ("you get it, family"); wear it and Buck regards you as kin.
- **Appearance layer:** earns spectacular tan lines and sunburn risk.
- **Streetwise gag:** nowhere to conceal *anything* — useless for smuggling or hiding loot.

### Elf Ears
Prosthetic pointed ears — the fae/forest-festival staple, and pure persona.
- **Acquisition:** the **Costume shop**, or **DIY-craftable**.
- **Faction/scene rapport:** a **faction-coded fit** — codes you to the **forest / fae / psytrance / heady** crowd, with a small Vibes/rapport bump among the woodland & Healing Village types. Dress fae for the woods.
- **Opens a fae/fantasy lane:** the first of a whole costume category — horns, wings, tails, face gems — to grow over time.
- **Appearance layer:** pairs perfectly with body paint, glitter, and gems for a full fae look.

---

*One system, two payoffs: a deep player wardrobe for self-expression, and — via procedural generation off the same parts library — a crowd where nobody looks copy-pasted.*


---

# Part 12 — Living Hair & the Wook Barber

# SHAKEDOWN — Living Hair: Growth, Dreadlocks & the Wook Barber
*Companion to the design bible (extends Wardrobe & Fashion + the Hygiene/Funk system). Hair isn't a menu pick you lock at creation — it's a **living system that grows and reacts to how you live.** Let yourself go feral and your body keeps the score: your mane grows out and, if you stay crusty long enough, **naturally dreads.** Which means the map needs a barber.*

---

## The core idea
Most games freeze your hair at character creation. SHAKEDOWN treats it as **emergent identity** (a locked design principle — your look is *earned, not picked*): hair has **length** and **condition** that change slowly over in-world time and in response to your **Funk**. Over a long playthrough your character visibly evolves from fresh-faced newcomer to weathered lifer — and *how* they evolve is a fingerprint of the choices you made. It's self-expression you grow into, not a slider you set and forget.

---

## 1. Hair grows over time
- Hair carries a **Length** value that rises slowly with in-game time: **Buzzed → Short → Medium → Long → Very Long → Feral.**
- Growth is a slow **ambient background process** — you notice it across sessions, the way a real festival stint leaves you progressively more unkempt. It rewards the long game (your look at hour 60 tells a story).
- **Beards / body hair** grow on the same clock (§5).
- Length is a **gate**, not just a look: certain cuts and styles need length to exist (you can't get the big braids or a proper man-bun at Buzzed) — so growth literally unlocks options over time.

## 2. Character creation, revised — fewer starting options
Because hair is a *journey*, creation gives you a **deliberately modest** starting menu: base **texture, color,** and a **starting length** (short-ish to medium), plus a few simple styles. You **don't** get a giant wall of elaborate hairstyles up front — those are **grown into and earned at the barber.** Same philosophy as the DJ archetype: you begin plain and *become* something. Your iconic look is a destination, not a starting selection.

## 3. The Funk → Dreadlock pathway *(the star mechanic)*
Sustained high **Funk** + enough **Length** + **time** + **not grooming** → hair begins to **mat and dread on its own.** No menu, no button — you simply *let it happen.*

**The stages (a gradual visual evolution):**
`Kempt → Unkempt → Tangled/Matted → Baby Dreads → Mature Dreads → the Legendary Wook Mane`

**The drivers:** it only progresses while you're **funky and neglectful** — showering, washing, and brushing **slow or reset** the early stages. So it's a passive readout of a committed crusty lifestyle, not something that ambushes a clean player.

**The point of commitment (telegraphed):** early stages (Tangled/Matted, Baby Dreads) are **reversible** — the barber can comb them out, or a good wash-and-brush arc walks them back. But once dreads **mature**, they're **cut-only** (true to how real dreads work) — a soft, self-authored **fork**: embrace the path, or intervene before the point of no return. The game flags the threshold so it's a *choice*, never a gotcha.

**Two ways to get there:** the **organic route** (earn them through funk + time — the authentic crusty badge) or the **intentional route** (pay the barber to start them properly — the look without the three-week grime grind).

## 4. Dreads as identity & cred *(keep the wall)*
A big matted mane (plus heavy funk, a wild beard) reads instantly as a **committed head / OG** — it's a **faction-relative cred signifier**, exactly like funk:
- **With the wook / deep-woods / heady crowd:** cred, recognition ("a real one"), warmer access, maybe dread-gated dialogue and standing.
- **With VIP / bookers / commercial / normie:** the opposite read (crusty, unkempt) — a clean cut swings *those* rooms your way instead.

**Wall reminder (per the earlier correction):** this is a **Cred / faction-reception** signal (persistent, faction-tinted) — the same axis as funk — **not** your personal **Vibes** meter. Hair changes *how the scene reads you*, not your internal aura. Don't let it leak into the Vibes readout.

## 5. Beards & the rest
The festival beard grows on the same clock and can go equally feral. The barber grooms, trims, shapes, **braids, and beads** it. A grown-out beard + dreads + funk is the full "descended into the lifestyle" silhouette — and it's all emergent.

## 6. THE WOOK BARBER — *Barber Bodhi, "Split Endz"*
The map needs someone to intervene, so meet **Bodhi** — a gentle, grizzled lifer who's been cutting hair at festivals for thirty-odd years and does **dreads by hand**, working a single chair under a tie-dye tarp hung with mirrors and wind chimes. (Location: a fixed nook — Healing Village edge or off Shakedown Street.)

**Services (a money sink + a style unlock):**
- **Cut / trim / shape** — reset length, and access styles your grown-out length now allows.
- **Shave** — head and/or beard, the full reset.
- **Dreads, done right** — start them intentionally, **maintain/tighten** mature ones (a recurring light upkeep visit), add **beads / wraps / cuffs.**
- **Comb-out** — rescue early matting before the point of no return.
- **Styles** — braids, wraps, a mohawk, top-knot, plus **dye** (including UV/blacklight-reactive festival colors).
- **The Big Chop** — cutting off a mature Wook Mane is a whole **identity event**: Bodhi does it almost ceremonially, and you can **keep the severed dreads as a trophy item.** A candidate for a small ritual quest.

**Bodhi as more than a chair:** a barbershop is a **gossip node** — he knows *everyone*, so his chair is a hub for **lot gossip, quest hooks, and faction news** (feeds the Discovery system). Befriend him and it pays: discounts, exclusive styles, introductions (**Ringleader contacts**), and eventually he can **teach you to do dreads/cuts yourself** (a small skill — groom at camp, or do it for others as a hustle). He's Certified-Head-adjacent elder energy — a natural warm recurring face.

## 7. Interlocks
- **Hygiene / Funk** — the engine of the whole dread pathway; washing is the brake/reset.
- **Wardrobe & Fashion / Character Creation** — revises the creation hair menu (fewer starting options); dreads/beard enable bead & wrap accessories.
- **Cred / Factions** — hair is a faction-relative reception signal (wook-cred vs. commercial-clean), same axis as funk. **Not personal Vibes.**
- **Longevity / Time** — a marquee long-game payoff: your look visibly chronicles your run.
- **NPC Roster / Procedural NPCs** — NPCs share the hair-state system, so a floor-dragging-dread NPC instantly *reads* as a deep-lifer OG — free visual class-signaling across the crowd. Bodhi joins the **named** roster (elder tier).
- **Titles & Roasts** — "Crusty," "The Mane Event," "Dreadlord," "Baby Dreads," "Freshly Chopped."
- **Discovery / Ringleader** — Bodhi's chair as gossip + contacts hub.

---

*Framing note: the dreadlock mechanic is the affectionate "three weeks unwashed at the festival and my hair started doing its own thing" trope — squarely the crusty-festival-wook satire this game runs on, played warm and light. It's about **neglect-and-commitment**, kept away from anything heavier.*

*Tuning note: growth rate, how much sustained funk it takes to progress each dread stage, and where the reversible→permanent line sits all come from **playtest, not paper** — target feel is "you look up one day and realize the festival changed you," dialed until it lands.*


---

# Part 13 — The Vibes Meter — Raisers & Tankers

# SHAKEDOWN — The Vibes Meter: Raisers & Tankers
*Companion to the design bible. The big laundry list of everything that lifts or crushes your aura — plus how it decays, stacks, and gates gameplay.*

---

## What Vibes actually is (quick recap)
**Vibes = your internal/emotional aura** — mood, presence, the energy people feel off you. It is **orthogonal to Hygiene** (funk is external/physical; you can be filthy with radiant Vibes, or showered and hollow). Vibes **gates** dialogue quality, access to certain NPCs/circles, "selling vibes" services (tarot, sound baths), how your sets read, and whether allies show up for you in a crisis. It **drifts toward a personal baseline** set by your sleep and self-care, so spikes fade — but reputational hits stick.

**Legend.** Size: `+ / ++ / +++` (nudge → solid → big spike), mirrored for tanks `− / −− / −−−`.
Type: **Spike** (instant) · **Buff/Debuff** (timed aura) · **Drip** (slow ongoing) · **Ambient** (field effect while near a thing/place) · **Sticky** (persistent/reputational until worked off).

---

# ⬆️ RAISERS

### Music & the Floor
- `+++` Catching a transcendent set from a legend — Spike + lingering Buff
- `+++` Nailing your own set / maxing Crowd Energy
- `+++` A sunrise or closing set — huge (Set & Setting bonus)
- `+++` The whole crowd singing/chanting as one
- `++` The drop landing perfectly (yours or theirs) — Spike
- `++` A clean B2B handoff with a friend
- `++` Silent-disco sync — the whole room on your channel
- `++` Stumbling onto a secret/surprise set
- `+` Dancing (any style) — Drip while you dance, scales with the crowd
- `+` Finally getting the ID of a track you loved

### Connection & PLUR
- `+++` Trip-sitting someone through a rough one — Sticky (big Cred + bond)
- `+++` Handing out a "miracle" (a free ticket to someone stuck outside)
- `+++` Reuniting someone with their lost crew or car
- `+++` A "we made it to sunrise together" group moment
- `++` Making a real Festie Bestie — Sticky
- `++` Being welcomed into a circle
- `++` Gifting food or gear you made
- `++` A deep 3am conversation — Buff
- `+` Trading a kandi bracelet (the PLUR handshake) — stacks per trade
- `+` A genuine hug; helping a stranger (water, directions, a boost)

### Care & Wellness *(the sober-viable raisers)*
- `++` A full night's sleep or a real nap — resets your baseline upward
- `++` Yoga / a workshop / breathwork — Buff
- `++` A river dip or cold plunge — (also fixes hygiene + hydration)
- `++` A massage, bodywork, or sound bath — Buff
- `+` Drinking water right when you needed it
- `+` A genuinely nourishing meal (not just fuel)
- `+` Grounding — barefoot, sitting with a tree, actually being present
- `+` Stretching before a long night — prevents a later drain

### Nature & Setting
- `++` A beautiful vista or a hidden spot in the woods — Spike on discovery
- `++` Sunrise / sunset — Ambient while it happens
- `++` Rain you *choose* to dance in — (attitude-dependent — see It Depends)
- `+` A killer campsite you built — Ambient home-base aura
- `+` A full moon / clear starry night — Ambient
- `+` Weather breaking nice after a storm

### Substances Done Right *(abstracted/satirical; Set & Setting good)*
- `+++` A "good trip" with the right set & setting — long Buff
- `++` A microdose flow state — sharper minigames, warm aura
- `++` Sharing a ceremony or circle — Sticky bond
- `+` A single balloon at the right moment (diminishing; Buzzkill risk)
- `+` Coffee at the right time (energy + a minor lift)

### Recognition & Achievement
- `+++` Ranking up on any path — Spike
- `++` Earning a title or epithet — Sticky
- `++` Someone recognizing you ("wait — aren't you…?")
- `++` Your art / booth / set getting genuine love
- `++` Getting vouched for, or an invite to something exclusive
- `+` A sincere compliment on your fit

### Expression & Generosity *(the gift economy)*
- `++` **Fair pricing during a crisis** (heat wave, shortage) — Sticky Cred
- `++` Working the Gift Lot / giving stuff away
- `++` Paying it forward after someone carried you
- `+` Rocking a flashy or freshly-finished fit — Ambient (also +Charisma)
- `+` Finishing a DIY project (patch, pin, tapestry)
- `+` Petting the festival dog — *(never not worth it)*
- `+` Bubbles, a clean hoop flow, any spontaneous whimsy

---

# ⬇️ TANKERS

### Bad Trips & Overdoing It
- `−−−` Greening out / the **Spiral** (the Bad Trip event)
- `−−−` A bad set & setting trip
- `−−` The comedown / "fried" debuff — lingering Drip
- `−−` Getting hopelessly crossfaded
- `−` One too many balloons — stacks toward `−−`

### Body Lows
- `−−−` Dehydration → collapse (you also faint and lose time)
- `−−` Total exhaustion / no sleep — Drip
- `−−` A hangover — morning Debuff
- `−` Running on empty (hunger) — Drip
- `−` Sunburn — Sticky until it heals *(Buck warned you)*
- `−` Blisters, wet cold, trench foot — Drip
- `−` A porta-potty-row incident — situational Spike

### Social Friction & Betrayal
- `−−−` A bad breakup / romance gone wrong — Sticky
- `−−−` Betraying a friend — or getting betrayed
- `−−−` Being known as a **snitch** — Sticky, spreads
- `−−` Getting called a "tourist," a poser, or a **"Spunion"** — Sticky/reputational
- `−−` Your calls going unanswered — the Ringleader sting
- `−−` An argument, or a fight breaking out near you
- `−` Rejection (asked to dance and got a no; pitched and got ignored)
- `−` FOMO — watching everyone else peak without you — Drip

### Crime — Received *(and inflicted)*
- `−−−` Getting robbed or pickpocketed — Spike
- `−−−` Your campsite raided while you slept
- `−−−` **Robbing the collapsed / preying on people** — Sticky *(the dark mirror: tanks Vibes even as Cash goes up)*
- `−−` Getting scammed (fake ticket, empty balloon)
- `−−` Gouging in a crisis **and getting called out** — Sticky
- `−−` Someone stealing your spot or gear

### Buzzkill & Authority
- `−−−` Ejection from the grounds
- `−−` Getting hassled / patted down by security
- `−−` A raid or crackdown near you
- `−−` A fine, or losing your stash to a guard
- `−` Endless line, wristband problem, entry denied

### Music Gone Wrong
- `−−−` Train-wrecking **your own** set (in public)
- `−−` The wrong sound for the room (your read was off)
- `−` A DJ train-wrecking / dead air (as a listener) — Ambient
- `−` Someone dropping **The Feels Machine** unironically at 2am — *(comedic; faction-relative)*
- `−` Generic main-stage pandering, if you're a head — Ambient

### Loss & Logistics
- `−−−` Losing your **phone** — your whole rolodex *(Ringleader catastrophe)*
- `−−` Losing your car (the eternal one) — Drip until found
- `−−` Gear breaking mid-set
- `−−` Tent flooding / everything soaked in a storm
- `−` Losing your crew in a crowd; a dead phone with no charger plug

### Environmental Bummers
- `−−−` A crowd crush / stampede scare — Spike
- `−` A trashed campground / litter everywhere — Ambient
- `−` An oppressive heat wave — Drip
- `−` A muddy, flooded field — Ambient

### Isolation & Neglect
- `−` Too long alone with zero connection — Drip (baseline sags)
- `−` Neglecting your crew until arcs go cold — Sticky
- `−` Skipping every workshop and self-care — slow baseline erosion

---

# 🧭 VIBES vs. CRED — *(a correction: don't conflate them)*
An earlier draft filed "going commercial," sponsor deals, and VIP status here as "faction-relative Vibes." That was wrong — those aren't Vibes at all. Three systems have to stay distinct:

- **Vibes (this meter)** = your **personal, in-the-moment aura** — how you feel and the energy people read off you *right now.* Driven by your experiences (music, care, connection, bad trips, loss). It is **largely global** — mostly the same number whoever's looking. It gates dialogue warmth, NPC openness, selling-vibes services, and crisis support.
- **Cred / Reputation / the Legend↔Deity path** = your **persistent standing and identity**, which *is* faction-tinted and driven by **career choices.** This is where "commercial vs. underground" actually lives: going big-room, taking a sponsor, chasing VIP status moves your **Cred and your path** (toward Legend, away from Deity), and each faction reacts on its own rep track. **Not a Vibes fluctuation.**
- **Funk (the Hygiene axis)** = a faction-relative **reception** — cred to the woods crew, repellent to VIP. Also separate from Vibes.

**Rule of thumb:** *Vibes = how you feel and read this moment (mostly global). Cred/Reputation = how the scene regards you over time (faction-tinted). Funk = a Hygiene-axis reception.*

A few things touch more than one at once — a **wild chaos bender** genuinely swings your personal **Vibes** (a peak, then a crash) *and* your **reputation** with different crews — but that's two separate readouts moving together, not "faction-relative Vibes." Keeping them un-blurred is what stops Vibes from becoming a catch-all meter that secretly means everything.

---

# ⚙️ MODIFIERS & META

- **Set & Setting** multiplies experience outcomes. A great setting can turn a risky moment into `+++`; a bad one flips the same moment negative. It's the master dial on every substance/ceremony/peak.
- **Decay to baseline.** Vibes always drifts back toward your personal baseline, which is *raised* by sleep + wellness habits and *lowered* by neglect. Spikes are temporary; **Sticky/reputational** effects are not — they must be lived down or worked off.
- **Momentum & the spiral.** Good moments compound into a peak day; a run of bad ones can start a **vibe death-spiral** (each low makes the next more likely) that you have to *actively* break — water, a friend, a nap, a good song.
- **Funk stays orthogonal.** Hygiene never sets Vibes directly. The four quadrants hold: **Funky + High Vibes = beloved grimy guru** · **Clean + High Vibes = the shining host** · **Funky + Low Vibes = stinky and miserable** · **Clean + Low Vibes = hollow / try-hard.**

# 🎯 WHY IT MATTERS — what Vibes gates
- **Dialogue** — high Vibes unlocks warmer, deeper, funnier conversation branches.
- **Access** — some NPCs and circles only open up to a strong aura.
- **Selling Vibes** — tarot, sound baths, guiding, "reading" people: you can't sell what you don't have.
- **Stage presence** — your aura colors how any set is received (a Vibes multiplier on Crowd Energy).
- **Who shows up for you** — banked goodwill + high Vibes = the trip-sitter appears, the contacts answer, the crowd has your back. Low and lonely = you're on your own.

---

*Design note: nearly every entry here is already produced by another system (music, care, crime, substances, factions, weather, the rolodex) — Vibes is the **shared emotional readout** they all write to. Build the meter once; every other system feeds it for free.*


---

# Part 14 — Substances & the Bad Trip

# SHAKEDOWN — Substances, Set & Setting & The Bad Trip
*Companion to the main design doc. Extends §4 (Needs & Vibes).*

## Design stance (read first)

This system is **abstracted and satirical**, never a real-world how-to — substances are a *consumable item class* with game-y buffs and risks, like potions in an RPG, not a guide. Three rules keep it tasteful *and* make it better design:

1. **Harm-reduction is the ethos** — the real festival caretaking community runs on water, rest, trip-sitters, and looking out for each other. The game models *that care* as mechanics.
2. **Sober is fully viable and respected** — you can reach every ending, including the apex Sculptor, stone-cold sober. Substances are never mandatory (see §5).
3. **The downsides are real** — impairment, the comedown, the bad trip, vulnerability. No glamorization-by-necessity.

---

## 1. Substances as a Consumable Class

They behave like **food with bigger swings and real risk** — a risk/reward layer over the Vibes and Needs systems. Effects are kept at a flavor/category level and stay mechanical:

| Type | The boon (mechanical) | The cost / risk |
|---|---|---|
| **Lot beer** (alcohol) | loosens social checks, small Vibes bump | impairs minigames, dehydration, sloppy |
| **Caffeine** | Energy top-up | crash later |
| **Cannabis** | chill, Vibes up | slows you down, munchies (Nourishment drain) |
| **Balloons** (nitrous) | a brief, silly head-rush — mostly comedic | gone in seconds; pure novelty |
| **"Party favors"** (upper-type) | big Vibes + stamina, dance/social bonuses | hard comedown; **overheating/dehydration risk** (feeds the collapse system) |
| **"Doses"** (psychedelic-type) | profound Vibes swings, altered perception (great visual FX), unlocks **transcendent moments** (the sunrise set "hits different") | **highest bad-trip risk; the most context-dependent** (see §2) |

The deeper ones don't have *fixed* outcomes — which is the whole point of the next section.

---

## 2. Set & Setting — the Core Modifier

The actual harm-reduction wisdom becomes a real mechanic: **a substance's outcome isn't a fixed buff — it's modulated by your state and your surroundings.**

- **SET (internal):** your current **Vibes**, recent experiences, stress, and whether you're **hydrated / fed / rested.** Go in stressed, broke, hungry, dehydrated → bad-trip odds spike. Go in blissed, fed, watered → good-trip odds.
- **SETTING (external):** safe, beautiful, **with friends**, good music, sunrise = good multipliers. Alone, in a chaotic crush, near aggressive security, bad crowd = bad multipliers.

This turns use into a **strategic choice with prep**, not a free buff — and it teaches, through mechanics, the real cultural wisdom that *context determines the outcome.* Same dose, two completely different nights.

---

## 3. The Bad Trip (the Vibes-crash crisis event)

The emotional sibling to the **dehydration collapse** (physical) and the **Buzzkill chase** (legal). A mini-event you have to navigate.

**Trigger:** high bad-trip-risk conditions (a risky substance + poor Set/Setting + overdoing it). It's **telegraphed** — the UI wobbles, the world starts to destabilize — so it's a spiral you can feel coming, not an ambush.

**The experience:** Vibes crater. The world turns hostile and overwhelming — visual/audio distortion, the crowd feels claustrophobic and menacing, controls go swimmy, the screen closes in, your needs readouts glitch. A **Spiral meter** climbs. The festival becomes a threatening maze.

**How you recover — this is the heart (harm-reduction as gameplay):**
- **Get to the chill-out tent** — reaching the safe space is the primary objective.
- **Grounding actions** lower the Spiral: drink water, sit down, get to a quieter/darker spot, and a gentle **breathing micro-game** (a calming, rhythmic inverse of the drum minigame).
- **A trip-sitter talks you down** — a friend NPC or a Healing Village volunteer. **Your PLUR investments pay off here:** if you've banked goodwill, allies *show up* to help. If you've walked the **outlaw/loner path**, nobody comes — the bad trip is lonelier and harder. A direct consequence of the identity fork.
- **Surrender, don't fight** — *resisting/panicking raises the Spiral; accepting and grounding lets it pass.* The real wisdom, made mechanical.
- **It's the receiving end of *Sober Sunrise*** — the caretaking loop goes bidirectional. The kindness you spent on strangers comes back when it's your turn.

**Aftermath:**
- **Handled well** (grounded, helped, rode it out) → a temporary Vibes dip but a *deeper* experience, a small lasting insight/buff ("you faced the dragon"), and stronger bonds with whoever helped.
- **Handled badly** (panicked, alone, wandered into worse) → a big Vibes crash, lost time, possible **collapse** (hands you to the medical/dehydration system), getting **robbed**, or stumbling into the **Buzzkills.** Repeated bad trips leave a lingering **"fried" debuff.**
- **The comedown** is its own gentle phase — the Monday blues, the "everything folds into Tuesday" dread (the conspiracy guy was right). You recover through rest, good company, and the Healing Village's **integration circle.**

---

## 4. Avoiding & Mitigating (so it's fair and teaches care)

- **Prep lowers risk hugely:** hydrated, fed, rested, good company, safe setting.
- **Pacing:** the game tracks intensity; pushing too hard spikes risk. Restraint is rewarded.
- **The Wellness skill branch** reduces bad-trip odds and severity, up to **The Anchor** capstone — near-immune, and the calm presence who can *sit others* through theirs.
- **In-world care** (water stations, the chill tent, looking-out-for-your-crew) reduces risk — modeled as the community's care, not as instructions.

---

## 5. The Sober Path (a real, respected build)

The **sober raver / "California sober"** is a real and revered festival archetype, and the game honors it:

- **No bad-trip risk, no impairment penalty** — your minigames stay crisp. Nailing frame-perfect Sculptor mixing is arguably *easier* sober.
- **You become the trusted trip-sitter** the whole lot relies on — huge Cred, the backbone of the caretaking economy, the designated **Anchor.**
- **Every ending and the apex are reachable sober.** Substances are a flavor/risk-reward option, never a requirement — and choosing none is its own dignified, mechanically-supported playstyle.

---

*Interlocks with: Vibes & the needs system (§4), the dehydration collapse, the chill-out tent, the Sober Sunrise caretaking loop, the Wellness branch + Healing Village, the two-path identity fork (who shows up for you), and the comedown/post-festival blues. The danger is real, the care is the gameplay, and sobriety is a legit way to win.*


---

# Part 15 — Tolerance, Greening Out & the Balloon Trap

# SHAKEDOWN — Tolerance, Greening Out & the Balloon Trap
*Companion to the design bible (extends Substances & the Bad Trip and the Vibes Meter). How weed and nitrous each **boost Vibes but cap themselves** — via two deliberately different anti-abuse mechanisms, so they never feel the same.*

---

## The design problem this solves
Weed and nitrous both **raise Vibes** (per the Vibes Meter doc). Left unchecked, that makes them a free Vibes faucet — smoke to cap, ignore every other system. So each needs a **real, rising cost** that makes abuse self-defeating while a *reasonable* amount stays fun and viable. Two substances, **two different caps**:

- **Weed → capped by TOLERANCE + greening out.** Diminishing returns; the more you lean on it, the less it does and the more it costs.
- **Nitrous → capped by BODY DAMAGE.** The high is so short it *tempts* chaining, and chaining is exactly what wrecks you.

Both stay **telegraphed** (fair, never random) and **sober stays fully viable** — these are optional Vibes tools among dozens of raisers, not a required loop.

---

# 🌿 WEED — the Tolerance System

Four values interact. Only two are ever shown plainly; the others live under the hood and surface through feel and warnings.

**1. Tolerance (T)** — a slow stat, 0→high.
- **Rises** a little every time you smoke (more if you smoke heavily in a short window).
- **Decays** slowly over in-game days of lighter use.
- **A Tolerance Break ("t-break")** — a stretch of days clean — drops it hard. This is a *strategic reset*, and it's real wook vocabulary, so it doubles as flavor.

**2. Highness (H)** — a short-term meter, spikes per hit, decays over minutes. This is your *current* buzz.

**3. The Vibes payoff** — roughly: **base boost × (how much room your tolerance leaves) × (how much room your current buzz leaves).** In plain terms:
- **Higher Tolerance → smaller boost per hit.** (Diminishing returns across your whole run.)
- **Already high → smaller boost per hit.** (Diminishing returns *within* a session.)
- There's a **sweet-spot buzz band** where Vibes is best. Go *past* it and Vibes actually starts to **drop** — too high reads as anxious / couch-locked / paranoid, not vibey.

**4. The Greenout Ceiling (G)** — the buzz level where you green out. **G rises with Tolerance** — seasoned smokers handle more.

### The elegant tension (this is the whole design)
| | Low tolerance | High tolerance |
|---|---|---|
| Vibes per hit | **big** | small |
| Cost to feel it | **cheap** (a little goes far) | expensive (need way more) |
| Greenout risk | **high** (low ceiling) | low (high ceiling) |

So a fresh smoker gets huge cheap Vibes but **greens out easily**; a heavy smoker rarely greens out but pays a lot for a meager lift. Neither end is "best" — and the **t-break** lets you deliberately trade a few clean days to snap back to the cheap-big-Vibes state. Chasing Vibes through weed becomes a little **management game with a self-correcting cost**, exactly as intended.

### The economic interlock
Because high Tolerance means you need **more** to reach the sweet spot, tolerance is literally **inflation on your Vibes-buying** — more money spent, more supply burned (feeding the Hustle economy). Abuse taxes itself in cash *and* effect.

### Greening Out (the crisis)
Runs on the shared **Collapse System** (below), weed-flavored and always **telegraphed in degrees**:
1. **Warnings** — cottonmouth, the walls breathing a little, a creeping paranoia, tunnel vision, "I need to sit down." The UI tints; audio muffles. *You have time to stop.*
2. **Push past it** (another hit, a bad Setting, standing in the sun) → **greenout**: nausea, the spins, cold sweat, you sit/lie down involuntarily — and if it tips over, you **pass out** (lose time, **miss your sets**, wake somewhere random, vulnerable to theft).
3. **Recovery = the care loop** — water, something sugary/food, fresh air, lie down, a friend or **trip-sitter** (shows up if you banked goodwill), CBD, even the folk-remedy black peppercorn (a grounded, funny harm-reduction touch). Sober allies who help *you* here is the receiving end of Sober Sunrise.

### Optional flavor depth (satire, if you want it)
- **Strain types:** *sativa* = more Vibes/energy but higher paranoia/greenout risk · *indica* = chill + a couch-lock energy debuff · *hybrid* = balanced.
- **Edibles = the delayed-onset trap:** no immediate H, so the classic *"I don't feel anything…"* → you eat more → onset hits all at once → **instant greenout.** A comedy set-piece waiting to happen.

---

# 🎈 NITROUS — the Balloon Trap

Deliberately **not** a tolerance system. The limiter is **acute Body damage**, and the trap is baked into the *shape* of the high.

**The hit.** A balloon gives a **big, intense Vibes/euphoria spike** — the "wah-wah" wobble — that lasts only **~20–30 seconds**, then drops. That shortness is the whole hook.

**The chain trap.** Because the high evaporates so fast, the game *tempts* you to immediately rip another… and another. But:
- **Diminishing returns:** each balloon in quick succession gives **less** Vibes (euphoria flattens fast). Chain-ripping is low-reward.
- **Rising cost:** each one drains your **Body meter** — and chaining (before Body recovers) drains it **fast.** High-cost. So the tempting move is the losing move; spacing them out is fine, chaining is the trap.

**The Body meter (the "health meter").** A gauge that mostly sits full and only moves under acute physical abuse. Nitrous is its main customer.
- Chain-rip → Body craters → **motor-control loss** (you visibly wobble, drop the balloon, **ragdoll to the ground** — comedic and real) → keep going → **pass out** via the Collapse System (miss sets, vulnerable, and the Buzzkills clock you).
- **Recovers** slowly with rest, air, food, water, time.

**The long-term satirical cost.** Heavy nitrous use applies a lingering **"Tingle Fingers"** debuff (numb hands → worse minigame precision, sloppier beatmatching) that clears with rest or a **B12 supplement** item. Grounded in the real harm-reduction fact, played for a wince-laugh, not a lecture.

**Why it's a different cap than weed:** no tolerance ramp to manage — the ceiling is **immediate bodily wreckage + a high too short to sustain.** Weed is a *slow-burn management* limiter; nitrous is a *fast-punish* limiter. Same design goal (Vibes has a cost), two different textures.

*(Balloons also carry the established **Buzzkill heat** + **Nitrous Mafia** beef — so there's a third, social cost layered on top. See the Nitrous Game doc.)*

---

# ⚕️ The Shared Collapse System (build once, reuse everywhere)
Greening out and nitrous blackout aren't bespoke — they're two inputs to **one** "you go down" system that also serves **hydration collapse, total exhaustion, and the Bad Trip Spiral.** Common spine:

**Telegraph (degrees) → tipping point → collapse (lose time, miss sets, wake elsewhere, theft-vulnerable, maybe a roast title) → care-loop recovery (self or a banked-goodwill ally/sitter).**

One crisis framework, many triggers (dehydration / greenout / nitrous / exhaustion / bad trip) — cheap to build, consistent to learn, and it makes **care-as-gameplay** pay off identically across all of them. A **Body meter** is the one new gauge this introduces; it's lean (mostly full, only acute harm moves it) and it's the home for the "health" cost the nitrous idea needs. *(Flagging honestly: the needs system didn't have a general health meter before — this adds a small, focused one rather than a big combat-style HP bar.)*

---

# 🎛️ Why this is fun, not just punishing
- It's a **push-your-luck** loop: chase the peak Vibes while reading the cliff. Telegraphs make it a *skill*, not a coin-flip.
- **Meaningful choices:** ride a low tolerance for cheap highs and play carefully around the low ceiling, or grind tolerance up for safety and eat the cost — then t-break to reset. Space your balloons or gamble on the chain.
- **Self-correcting:** the more you abuse either, the worse the deal gets — so the system caps itself without a hard "you may not." 
- **Sober stays king:** every ending, every Vibes peak, is reachable with zero substances. These are optional spice with teeth.

---

# 🔗 Interlocks
- **Vibes Meter** — both are Vibes raisers *with* these caps; over-the-line use flips them into Vibes *tankers* (greenout, blackout, the comedown).
- **Set & Setting** — a bad Setting lowers your greenout ceiling and steepens every risk; a good one buys you margin.
- **The Economy** — tolerance inflates your weed spend; balloons burn cash + supply.
- **Buzzkill / Nitrous Mafia** — balloons draw heat and Mafia beef on top of the body cost.
- **Care-as-gameplay** — the sitter/ally who pulls you out of a greenout or a nitrous drop is banked goodwill paying off.
- **Titles & Roasts** — chronic offenders earn epithets ("Spunion," "Balloon Boy," "Greened-Out Greg") — comedy with a memory.

---

*Tuning note, per house rules: the curves, thresholds, decay rates, and how fast tolerance climbs all come from **playtest, not paper** — the goal is "a couple is great, a lot is a bad time," dialed until that *feels* true. The structure above is the skeleton; the numbers are found on the floor.*


---

# Part 16 — The Streetwise Path

# SHAKEDOWN — The Streetwise Path
### Stealth, Theft & Cons (the outlaw branch, fully brainstormed)
*Companion to the main design doc. This is the gameplay of the Streetwise skill branch (capstone: **Ghost**).*

**Framing:** crime is the **fast lane with a corrosive toll.** Honest hustling is more reliable and earns you the wholesome content; theft is quicker but **socially costed** and it **forks you toward the outlaw identity** (you can't be the Beloved Promoter *and* the lot thief). Most players dabble when desperate — exactly the right instinct that it should mostly be a *dead-broke* move, alongside recycling cans.

---

## 1. Evasion — Not Being Seen
*(Defensive stealth. No theft, just staying invisible.)*

- **Sneak back into the festival** after ejection — fence-jump, slip past patrols. *(your #1)*
- **Deal discreetly** — sell balloons/contraband without rival **Nitrous Mafia** or security clocking you; positioning, lookouts, reading patrol routes. *(your #2)*
- **Lose the Buzzkills** when your heat is high — break line of sight, then *blend*: vanish into a dense crowd, duck into a drum circle, hide in a tent (or, regrettably, a porta-potty). The festival version of "lose the cops."
- **Smuggle past the gate** — bring in outside water/booze/product to undercut the licensed vendors.
- **Slip through sweeps** — survive the *Shakedown Shakedown* security crackdown without losing your stash.

---

## 2. Infiltration — Getting Where You're Not Allowed

- **Sneak into VIP / backstage / the artist area** — network with bookers, raid the hospitality spread, meet headliners, and dig for rare track IDs you can't get anywhere else.
- **Crash a sold-out or locked set.**
- **Eat the rider** — sneak the absurd 37-item artist rider food for free.
- **Reach the lore spots** — the conspiracy guy's mythical **13th porta-potty** at 4am.
- **Gatecrash a renegade stage** you weren't invited to.

---

## 3. Theft — From People

- **Pickpocket in crowds** — a packed headliner set is perfect cover (everyone's distracted and dancing). Lift cash, a phone (resell), a wristband, or a **USB** (free IDs).
- **Raid campsites** *(your #3)* — loot unattended tents and coolers for cash, gear, clothes, stock, even a generator. **Serious Vibe hit if caught**; a dead-broke-only move.
- **Steal IDs at the source** — a DJ's USB left in the booth. A dark shortcut for *The First USB* — fill your crate by stealing other people's unreleased tracks.
- **Rob the collapsed** — the **dark mirror of the caretaking loop.** When an NPC faints from dehydration, you can help them up (*Sober Sunrise*, big Cred)... or rifle their pockets (big Vibe/karma hit). Same trigger, opposite soul.
- **Lift a wristband or a staff/artist credential** — for re-entry, resale, or infiltration disguise.

---

## 4. Theft — From Vendors, the Festival & the Mafia

- **Shoplift booths** — steal your starting inventory instead of buying it. Caught = that vendor (and the Vendor faction) won't deal with you.
- **Dine-and-dash** at food stalls.
- **Skim the Nitrous Mafia** — boost their tanks/supply. Insanely risky, huge payoff, generational beef.
- **Rob a rival vendor's stock** to corner the market (feeds the dynamic-pricing competition).
- **Steal a rig component or tap power** for your renegade stage — the larcenous version of *Carry the Sub* / *Power Struggle*. Cheaper than buying; riskier than asking.
- **The box-office heist** — endgame, heist-tier: crack the festival's safe.

---

## 5. Scams & Cons
*(Social stealth — deception instead of pickpocketing.)*

- **Fakes:** counterfeit wristbands, fake tickets, *empty* balloons, knockoff "heady" glass.
- **Miracle scams:** sell a "free ticket" that's worthless; sell the same ticket twice.
- **Short-change** your own customers for extra margin (risking your vendor rep).
- **Impersonation:** pose as staff/artist/medical for access and freebies.
- **Cold-read cons:** the dishonest version of the Vibes "fortune-teller" services.

---

## 6. Sabotage
*(Stealth aimed at rivals.)*

- **Tank a rival DJ's set** — swap or steal their USB, cut their power, tamper with their gear → they train-wreck on stage.
- **Snitch or frame** — tip security about a *rival* to pull heat onto them, or plant contraband so they get busted instead of you.
- **Kneecap a rival vendor** — spoil their stock or steal their supply before peak hours.
- **Act 2 espionage** — poach a competing festival's artists, leak their lineup, sic inspectors on them. Corporate dirty tricks at scale.

---

## 7. Lockpicking & Grand Theft Golf-Cart

- **Crack locks** — lockboxes, coolers, vans/RVs, vendor cashboxes, the box-office safe (tiered by Streetwise skill).
- **Boost a vehicle** — hotwire a **golf cart, art car, or someone's van** for fast travel or a getaway. The festival's GTA-car-theft moment.

---

## 8. The Getaway
*(When a job goes loud — this is where your other systems pay off.)*

- **Change your description** — duck into a tent and **swap your outfit** (wardrobe tie) to break a description-based pursuit, Hitman/RDR2-style. Your *fit is your wanted poster.*
- **Wash off the funk** — high **hygiene/funk** is an identifier; a river rinse can shake a smell-based tail. (Yes, your B.O. can rat you out.)
- **Ditch hot items** and **stash loot at camp** before you're patted down.
- **Bribe out** if cornered (needs cash + a little Security rep).

---

## 9. The Underground
*(The social layer that makes crime a *scene*, not just an action.)*

- **The Fence** — a black-market NPC who buys stolen/branded goods you *can't* sell to normal vendors (a distinctive USB or one-of-a-kind jacket gets recognized otherwise).
- **The Lot Rats** — a thieves' crew faction with its own rep, jobs, and honor-among-thieves code. Repping them up unlocks heists, safehouses, and getaway help — the dark-mirror faction to the Healing Village.

---

## 10. The Streetwise Skill Ladder *(from the skill tree)*

Quieter movement / slower heat → **crowd-blend invisibility** → pickpocket & sleight-of-hand proficiency → **lockpicking** tiers → **credential forging** → safer balloon game → **GHOST** (near-immune to ejection, master smuggler, moves through anywhere).

---

## 11. The Cost (and why that's the point)

Crime has to *bite*, or the whole PLUR economy collapses:

- **Caught =** Vibes crater, Buzzkill heat spikes, faction rep drops, and **word spreads** — a known thief finds NPCs guarding their stuff, vendors watching them, and the **wholesome content locked** (Healing Village, romance, the beloved-elder path, the "vouched-for" re-entry).
- **The identity fork:** lean into theft and you slide hard toward the **outlaw / Underground Deity-adjacent** path and *away* from Festival Legend respectability. The game won't let you be both — which makes every job a real choice about who you're becoming.
- **Branded loot is hot** — steal something distinctive and someone may recognize it on you.
- **Victims remember** — robbing the wrong NPC spawns an enemy or a revenge questline.

**Guardrail philosophy:** keep honest hustling the *reliable, socially rewarding* default; make crime the *fast, lonely, corrosive* shortcut. Then it's a meaningful desperation-or-roleplay choice — never the obvious optimal play.

---

*Everything here rides systems you already built: the Buzzkill heat, the bag-vs-stealth tradeoff, hygiene-as-identifier, the wardrobe-as-disguise, the hydration collapse, the Nitrous Mafia, and the two-path identity fork. The outlaw branch isn't a bolt-on — it's the shadow cast by the whole game.*


---

# Part 17 — Pickpockets & Narcs

# SHAKEDOWN — Pickpockets & Narcs: Two-Way Theft & Undercover Heat
*Companion to the design bible (extends the Streetwise Path + the Buzzkill system). Theft cuts **both ways** — you can lift, and you can *get* lifted — and not every festie in the crowd is a festie. Two cat-and-mouse loops that make the lot feel alive and a little dangerous.*

---

## Design intent
The Streetwise doc already covers *you* stealing. Two things were missing: **the world stealing back**, and **the law hiding in plain sight.** Both add ambient tension without punishing honest players — a sober vendor who banks their cash and doesn't deal will rarely feel either. They bite exactly as hard as you lean into risk.

---

# 👐 PICKPOCKETING — both directions

## A. You → them (offense — fleshing out the Streetwise entry)
- **Targets carry things:** cash, sellable items, a phone, a wristband (re-entry), occasionally a stash or quest item. **Distracted, intoxicated, dancing, or collapsed** targets are far easier (a greened-out mark is a sitting duck — the Collapse System's dark payoff).
- **The lift = a nerve minigame:** approach unseen → a steady-hand / timing check (a moving "safe zone," tighten under pressure) → grab. Crowd density is cover; your **Streetwise skill** widens the window, speeds the lift, and unlocks grabbing *more* per attempt.
- **Getting "made":** fail (or hit a wary target) and they react **by archetype** — a chill wook just looks heartbroken (small take, but a real **Vibes/Cred** gut-punch for you), a normie screams for security (**heat spike**), a Nitrous Mafia goon swings. Word spreads; a known dip **locks wholesome content** and makes NPCs guard up around you.

## B. Them → you (defense — NEW)
Opportunist NPCs (Lot Rats, desperate types, the sketchy edge of the crowd) will **try to lift *you***, weighted toward when you're vulnerable:
- **When they strike:** dense-crowd dancing, intoxicated/greened-out, **passed out** (auto-vulnerable — highest loss), distracted, asleep at an unsecured camp, flashing a fat stack.
- **The tell (telegraphed to the alert):** a too-close dancer, a bump, a "hey brother, got a light?" distraction. Your **Streetwise / awareness** surfaces it — a highlight, a slowed beat, a gut-prompt. Low awareness = you feel it only when your cash is already lighter.
- **Counterplay = a grab-the-wrist reaction:** catch their hand in the window → you **snag the thief** (get it back, they flee, a little Vibes/Cred win, maybe intel to sell). Miss → they melt into the crowd with some cash or an item.
- **When you're down, you're prey:** collapsed/asleep = no reaction prompt, bigger loss — *unless* you banked goodwill and a **friend or trip-sitter guards you** (care-as-gameplay paying off again).
- **Frequency scales with:** cash on hand, appearance/gear, area heat (Shakedown Street lot = pickpocket alley; your upgraded camp = safe), and your notoriety.

## C. Anti-Theft Gear (the counter — NEW)
Upgrades on the **Bag/economy tracks** that reduce or block pickpocketing — with the bible's usual *bigger-isn't-always-free* trade-offs:
- **The Fanny Pack / Hip Pack** — the iconic festival move, worn front; basic anti-lift protection. (Peak function-meets-comedy.)
- **Money Belt / Hidden Pocket** — cash stored here **can't be pickpocketed**, but it's slower to draw (a beat of fumble at the vendor).
- **Crossbody / Chest Rig** — keeps valuables in view; solid protection, a Charisma-neutral look.
- **Locking / Anti-Theft Backpack** — bag + camp upgrade; blocks bag-dips **and** campsite raids.
- **The Decoy Wallet** *(Streetwise item)* — they lift the decoy (a few bucks); your real stash is safe, and you can **bait-and-catch** on purpose.
- **The Sock/Diaper Stash** *(gross-funny, deep concealment)* — max security, zero dignity, slowest access.
- **Best practice, not gear:** **split your money** — carry a little, **bank the rest** at a secured camp/stash. Walking around with everything is the real vulnerability; no gear beats not having it on you.
- **Trade-off axis:** max-security setups are slower to access and sometimes dorkier (minor Charisma ding) — so there's a real style-vs-safety choice, same as the Bag philosophy.

---

# 💰 CASH, CAMP & THE SAFE (the money-at-risk layer)
**Design stance first: this is risk-management, NOT a banking chore.** The trap is forcing a trek to camp after every $5 hustle. The fixes: make banking **optional and incentivized**, **scale theft-interest to how fat your stack is**, and add **convenience valves** so returning to camp is a *choice*, not a tax.

### Two pools of money
- **On-hand cash** — what you carry. Spendable anywhere; **pickpocketable**; partially lost if you're lifted or busted. **No hard cap** — but the fatter the stack, the bigger a target you are and the more a hit costs.
- **Banked cash (the Safe, at camp)** — **secure.** Can't be pickpocketed; resists campsite raids. Deposit/withdraw at camp — or via a valve below.

### The Safe (a money sink + a progression hook)
- **Buy one early** (before that, loose camp cash is raid-vulnerable), then **upgrade capacity**: Lockbox → Cash Box → Safe → Floor Safe → *(Act 2)* Office Vault.
- The capacity cap is a **soft anti-hoarding nudge**: when it's full you're pushed to **spend/reinvest** — gear, campsite, the Act 2 festival fund — which keeps money *flowing* instead of pooling. True overflow goes to an **offsite stash / "the bank"** (uncapped, safe, but a trek or a fee and no quick access).
- **Raid defense:** raiders grab **loose** camp cash/items, but a bought safe **protects what's inside** (higher tiers resist cracking longer). The safe is why you sleep easy.

### Convenience valves (this is what kills the tedium)
- **The Van = a mobile safe** *(Tour synergy)* — later, bank from your vehicle; park it by the stage and camp comes to you.
- **Hire a runner** *(delegation payoff)* — a trusted NPC couriers your payout to the safe for a cut. The chore becomes an economic choice.
- **Auto-deposit** — route gig payouts straight to the safe minus a courier fee: trade a sliver of money for zero-risk convenience.
- **Booker direct-deposit** — big venues can pay into your safe for a fee.

So you choose your posture: **risk-on** (carry it all, skip the fees, feel the tension) or **risk-off** (auto-bank, pay a little, never sweat it).

### Why stack-size scaling matters
Pickpockets barely care about a broke wook's pocket change, but a **fat post-gig stack is a magnet.** So small hustle income = **no nag**; big scores = an occasional **high-tension "cash-run"** to safety — the *good* kind of tension. After a legendary set you're holding a brick, and every bump in the crowd spikes your pulse until it's locked away. **That moment is the feature.**

### The anti-rage rule
You can only ever lose what you're **carrying** — banked money is untouchable. So a pickpocket or a bust **stings but never wipes you.** With telegraphs + the grab-the-wrist counter + gear on top, theft stays **tense, not devastating.**

---

# 👊 CATCHING A PICKPOCKET
Land the grab-the-wrist reaction and time **freezes** on you gripping their arm mid-lift — now **you** decide, three-path style. Who's watching + the thief's archetype color every outcome:

- **Let it slide (PLUR):** "Not cool, brother." They slink off — **Vibes/Cred bump** (you're the bigger person). If they were **desperate** (hungry, broke, a first-timer), mercy can seed a **redemption arc**: they resurface as an ally, a tip-off source, or a **Ringleader contact** — a reformed dip with the *Lift* skill you can deploy.
- **Take it back + tax them (Hustle):** reclaim your stuff and skim a **penalty** off their cash. You profit; small Vibes ding; they flee with a grudge (**rival seed**).
- **Make a scene (Chaos):** grab 'em loud or throw hands. Draws a crowd and **Buzzkill heat on *you*** (fighting's a bad look); the thief bolts or it **escalates into a brawl** (call-your-contacts payoff). Tanks Vibes with the peaceful crowd, raises it with the rowdy.
- **Call it out (Lawful/Social):** yell for security or a nearby ally; real Buzzkills or your **contacts** nab them — but summoning security **raises ambient heat**, which you *do not* want if **you're** holding hot inventory. (Delicious irony: you can't call the cops when you're dirty too.)
- **Turn the tables (Streetwise flex):** counter-lift them in the scuffle and walk away with **more** than they tried to take. Skill-gated; peak outlaw identity.

**Emergent deterrence (the real reward):** catching thieves builds a **rep** — word spreads ("don't try *that* one"), and **pickpockets target you less over time.** Awareness + gear + a few good catches makes the whole problem **fade as you master it** (assist-scaling / mastery-ceiling DNA — the system bows out once you've beaten it).

**If you MISS the catch:** they snag it and bolt → optional **foot-chase** through the crowd (dodge festies, keep eyes on them; lose sight = lose it). Catch them → the menu above. But **chasing costs** — you leave your booth/gear unattended, might blast past a narc, and burn needs. Sometimes you eat the loss and let it go (and it's only what you were *carrying* — see the anti-rage rule).

---

# 🕵️ UNDERCOVER COPS / NARCS (NEW — a Buzzkill sub-faction)
Overt **Buzzkills** are uniformed security you can *see* (visible heat). **Narcs** are the hidden layer: plainclothes cops dressed as festies, watching for **dealing, buying, open use, and theft.** They're the enforcement teeth behind the nitrous "when-not-if" suspicion.

### The core mechanic: you can never be 100% sure
That uncertainty *is* the gameplay. Every hand-to-hand deal becomes a small gamble, and caution gets rewarded. Narcs can:
- **Watch and swoop** — clock a hand-to-hand, then move in.
- **Entrapment-buy** — approach *you* trying to buy nitrous/party-favors. Sell to a narc → **bust.** (The overeager fake buyer is a comedy staple: *"You got any of the… you know… the good stuff, broski?"* — delivered a little too earnestly.)

### The Tells (skill-gated perception)
The observant can read a narc; the oblivious can't. A **"Spot the Narc" / Streetwise** sense surfaces tells, sharper as the skill grows:
- The **too-clean, too-new fit** (crisp shoes, zero patches, wristband on wrong).
- **Watching, not vibing** — never dances, never drinks, scans the crowd, loiters.
- The **overeager buyer** who asks too directly and doesn't know the lingo.
- An earpiece, a repeated loop-path, a "camping" spot with sightlines.
- High skill → a subtle highlight or a gut-feeling meter on a suspect. Low skill → **you're flying blind** (pure risk).

### Counterplay
- **Vet your buyers** — small-talk/lingo checks: do they know the scene? Real heads pass; narcs fumble.
- **Use lookouts** — this is a **Ringleader-contacts** payoff: post a trusted friend to watch your six.
- **Deal through trusted NPCs**, in low-surveillance zones, and **keep moving.**
- **Sell the intel** — once you've *made* a narc, warn others (or charge for the tip); a "made" narc loses value to the cops.

### Getting caught by a narc (worse than overt security)
A real **bust**: big heat spike, **confiscation**, a fine, likely **ejection**, a lasting **criminal-rep** mark, and possibly a **holding-tent "festival jail"** timeout (a little wait-it-out / talk-your-way-out minigame). **Escalates hard with priors** — the flagged repeat offender gets watched.

### Dynamic density (telegraphed, never a gotcha)
Narc presence **rises with** festival heat, your notoriety, and **crackdown world-events** — and the lot **warns you**: gossip ripples ("heads up, *lotta* narcs out tonight, be cool"), so you can choose to lie low, dump hot inventory, or press your luck. Fair by design.

### Sober/legit players opt out for free
If you don't deal, use in the open, or steal, narcs are just weird over-friendly strangers you can ignore. The whole system only switches on for the risk-takers — consistent with **sober-viable.**

---

# 🤝 THE DRUG-BUYER ENCOUNTER *(the "you got the good stuff, broski?" mechanic)*
The flip side of the narc read, as a **recurring judgment call.** If you deal (have dealable inventory / the dealing hustle active), NPCs periodically **approach you wanting to buy** — and every one is a **read-the-room gamble**: legit customer, or narc in cargo shorts?

### The loop
An NPC walks up with a pitch. Before you answer, you **size them up** — demeanor, outfit, dialogue, tells — then choose **Sell** or **Decline.** Optionally **chat them up first** (small-talk probing) to gather more read before committing.

### Who's approaching you (a spectrum)
- **The legit festie** — chill, knows the lingo, right fit/vibe → safe sale, profit, and a shot at a **repeat customer / contact.**
- **The narc** — too-clean fit, overeager, fumbles the lingo, *"you got the good stuff, broski?"* → **sell = bust.** Decline = safe.
- **The sketchy/desperate one** — jittery, twitchy; might **rob you** mid-deal, cause a scene, or be a lightweight who **greens out on what you sold** (blowback on your rep + a Vibes/Cred ding).
- **The rival/flipper** — buying to resell or scoping your supply (a competitor seed).

### Reading them (skill-gated, never certain)
- **Demeanor** (body language: vibing vs. watching), **outfit** (crisp/new = flag; festie-worn = safer), **dialogue** (lingo check — real heads talk right; narcs don't).
- Your **Streetwise / "read people" skill** surfaces a confidence signal — sharper the higher it is. Low skill = you're guessing. **You can never be 100% sure**, which is the whole tension.

### Outcomes
- **Sell to legit** → cash (via dynamic pricing), dealer rep, maybe a returning face / contact.
- **Sell to a narc** → **bust** (heat, confiscation, fine, ejection, criminal-rep — per the narc rules above).
- **Sell to sketchy** → possible robbery, a scene, or a **bad-trip event you're implicated in.**
- **Decline** → zero risk, zero profit. Wrongly declining a legit buyer = a small missed sale (and over-declining stalls your dealer rep). Correctly declining a narc = you just dodged a bust.

So there's real **two-way error cost:** false-negative (sold to a narc) is a disaster; false-positive (spooked off a real customer) is a paper cut. Attention + skill tilts the odds; it never removes the gamble.

### Tools & counterplay
Vet via conversation before selling · deal only in **high-crowd-vibe zones** (fewer narcs — see the Crowd Vibe doc) · post a **Ringleader lookout** · or deal through a **trusted intermediary** (safer, smaller cut). And as always — **don't deal at all** and this entire layer never fires (sober/legit-viable).

---

# 🔗 Interlocks
- **Streetwise Path** — offense side, spotting narcs, the Fence, the Lot Rats crew, "getting made" consequences.
- **The Buzzkill system** — narcs are a hidden Buzzkill sub-type; both feed the same heat/ejection/re-entry loop.
- **The Collapse System** — passing out (greenout, nitrous, dehydration) = peak pickpocket vulnerability; the guard-your-friend care loop counters it.
- **Bag / Economy** — anti-theft gear tier + banking/splitting cash as active risk management.
- **The Ringleader** — contacts as lookouts and trusted dealing channels.
- **Nitrous Game** — narcs are the enforcement arm of the "when-not-if" suspicion meter.
- **Vibes** — getting lifted tanks Vibes; **catching** a thief or **making** a narc is a small Vibes/Cred win.
- **Titles & Roasts** — "Light Fingers," "Got Got," "Narced Out," "The Snitch-Spotter."

---

*Tuning note: pickpocket frequency, narc density, tell-clarity per skill level, and bust severity all come from **playtest, not paper** — target feel is "the lot has real stakes, but paying attention and playing smart keeps you safe," dialed until that's true.*


---

# Part 18 — Area Banners & Crowd Vibe

# SHAKEDOWN — Area Banners & Crowd Vibe
*Companion to the design bible. The open-world "you've entered ___" title cards — and the **Crowd Vibe** readout they carry: an ambient property of a *place and its people* that drives crime odds, encounters, and mood. (Explicitly **not** your personal Vibes meter — see the wall below.)*

---

## 1. The Area-Entry Banner
Cross into a named area and it announces itself — a flash + title at the top of the screen, the way a new town/region reveals itself in an open-world game.

**What shows:**
- **Area name**, festival-poster styled (hand-drawn banner energy) — *Shakedown Street · The Renegade Woods · Healing Village · Main Stage Field · The Parking Lot · Porta-Potty Row · The Silent Disco · The River.*
- A short **flavor tagline** on first entry (*"Shakedown Street — 3 for $20, no deals"*).
- The current **Crowd Vibe** readout (band + color/icon — §2).

**When it fires (don't spam it):**
- **First visit** = the big reveal (larger card, maybe a beat of ambient intro / a Patches line).
- **Repeat visits** = a quick flash, and *only re-surfaced if the Crowd Vibe has meaningfully shifted* — e.g., *"Shakedown Street — now Tense"* after a fight breaks out. A steady-state area you re-enter constantly shouldn't nag.
- Triggered on crossing a real threshold, not on every wander across a fuzzy line.

**Why it earns its place:** it teaches the map, gives each zone identity, and — by carrying the Crowd Vibe — turns entering an area into a **quick tactical read** ("this lot's gone sketchy, tuck the stack away").

---

## 2. Crowd Vibe — the zone stat
**Crowd Vibe = the ambient collective energy of the people in an area, right now.** It's a property of the *place and its crowd*, not of you. Think of it as the room's mood-and-safety readout.

**The bands (readout):** a 5-step scale, color-coded, on-theme —
`Sketchy → Tense → Chill → Buzzing → Transcendent` (red → amber → green → bright → gold).

**What sets it (all telegraphed, all dynamic):**
- **Zone baseline** — Healing Village runs high/chill; Shakedown Street is busier and lower; the Renegade Woods at 4am is volatile; Main Stage during a headliner is Buzzing; the Parking Lot is liminal and often Sketchy.
- **Time of day** — deep-night skews more fried and edgy; sunrise can swing gold.
- **Crowd density** — a good packed crowd lifts it; **overcrowding** drops it (crush/tension risk).
- **Events** — a great set, a group PLUR moment, a cleanup ↑ · a fight, a raid, a storm, a bad-trip wave, trash piling up ↓.
- **Cleanliness/state** — a trashed, muddy area sits lower.

**What it drives:**
- **Crime odds** — low Crowd Vibe = **more pickpockets and sketchier drug-buyers/narcs**; high = safer, friendlier.
- **Encounter flavor** — who walks up to you and how (chill legit buyers in a Buzzing crowd; jittery/predatory ones when it's Sketchy).
- **Commerce** — a Buzzing/Transcendent crowd **tips better, buys more, trades more kandi**, and is easier to sell services/sets to; a Sketchy crowd haggles, bails, and steals.
- **Set reception baseline** — the room's starting willingness before you even play a note.
- **Safety events** — crush/fight likelihood rises as it falls.

**Player agency (read it *and* change it):**
- **Read it** to pick where to hustle, deal, play, or lie low — and whether to bank your cash before crossing in.
- **Change it** — a killer set, a generous PLUR act, or cleaning up **raises** the local Crowd Vibe; starting chaos, a fight, or gouging **tanks** it. So an area's mood is partly *your* fingerprint, and lifting a Sketchy lot into a Buzzing one is a real, visible accomplishment.

---

## 3. THE WALL — Crowd Vibe ≠ personal Vibes
Two different readouts that must never be merged (this is the correction from the Vibes Meter doc, enforced):

| | **Personal Vibes** | **Crowd Vibe** |
|---|---|---|
| Belongs to | **you** (your aura/state) | the **place + its people** |
| Scope | mostly global, follows you | local, per-area, per-moment |
| Driven by | your experiences (music, care, loss…) | the zone, time, density, events |
| Gates/drives | your dialogue, NPC access, selling-vibes, crisis support | crime odds, encounters, commerce, set-reception baseline, safety |
| Shown | your HUD meter | the **area banner** + a zone indicator |

**They interact, they don't overlap:** a Transcendent crowd can *ambiently lift* your personal Vibes, and *your* great set can *raise* the crowd's Vibe — two dials nudging each other, still two dials. (And neither is **Cred** — the persistent, faction-tinted reputation axis where "commercial vs. underground" lives.)

---

## 4. Interlocks
- **Pickpockets & Narcs** — Crowd Vibe is the master dial on theft odds, buyer/narc density, and encounter tone; the banner is the player's cue to secure cash on entry.
- **The Map/Zones** (core GDD) — every named zone gets a banner + a baseline Crowd Vibe.
- **DJ Gameplay** — your set is the biggest lever a player has for *raising* an area's Crowd Vibe live.
- **Economy/Dynamic Pricing** — Crowd Vibe feeds demand, tips, and haggling.
- **Crisis/World Events** — raids, storms, fights, bad-trip waves visibly crater the local readout (and re-fire the banner).
- **Personal Vibes** — ambient cross-lift only; kept strictly separate per §3.

---

*Tuning note: band thresholds, how fast Crowd Vibe swings, and exactly how hard it weights crime/commerce all come from **playtest, not paper** — target feel is "you can read a space at a glance and it rewards paying attention," dialed until true.*


---

# Part 19 — Dance, Emotes & the Dancefloor

# SHAKEDOWN — Dance, Emotes & the Dancefloor
### How your body talks at a festival — genre dance styles, the PLUR handshake, and reading the crowd
*Companion to the design bible.*

---

## The Pitch — expression first

Every scene has its own body language, and a wook can read a whole dancefloor at a glance. SHAKEDOWN turns that into gameplay: **genre-specific dance styles** you bust out by reading what's playing, **social emotes** that are the backbone of non-verbal connection in the social universe, and a **dancefloor that visibly reflects how well a set is landing.** Expression first — mechanics light. It should feel like *you* dancing, not a chore.

---

## 1. The Genre Dance Taxonomy

Each style maps to a scene/faction. Your three are the headliners; here's the fuller dialect map:

| Style | Genre / Scene | The move |
|---|---|---|
| **Untz untz** | House / techno | four-on-the-floor shuffle, two-step, cutting shapes |
| **Headbang / throwdown** | Brostep / dubstep | rage, stank face, *destroy* the drop |
| **Spaghetti / liquid** | Wonky/experimental bass (Liquid Stranger, Wakaan) | boneless noodle arms, digits, fluid flow |
| **The noodle / twirl** | Jamtronica / jam | barefoot hippie sway, the spin, eyes-closed groove |
| **Psy-stomp** | Psytrance | intricate footwork, the headphase, locked-in |
| **Skank / footwork** | Drum & bass | fast skank, quick feet |
| **Hands-up / rail-ride** | Trance | reach for the lasers, the big build payoff |
| **The jump / hakken** | Hardstyle / gabber | stomp, jump, full send |
| **The groove / hustle** | Funk / disco / soul | hips, swagger, partner moves |
| **The skank / sway** | Reggae / dub | slow rock, one-drop sway |

The satire writes itself, and the authenticity is the point — anyone in the culture will recognize their people instantly.

---

## 2. Reading the Floor (the DJ interlock)

This is why dancing isn't just cosmetic. The crowd (NPCs *and* players) **dances in the style that matches the genre** — so the dancefloor becomes a **live readout of your set:**
- Nail the read and the floor locks into the matching style in unison — a sea of headbangers, a shuffle army, a field of noodle arms.
- Misread the room (drop the wrong vibe, kill the energy) and people fall out of sync, stand around, drift off. **You can see a bad set in their bodies before you see it in the numbers.**
- As a dancer, you can scout a stage from a distance just by the body language — *that's* where the heads are tonight.

---

## 3. The Vibes of It (the light mechanic)

- **Match the groove** to what's playing → build personal **Vibes/energy**, and when you're in a crowd, you add to the **collective energy** that feeds the DJ's set.
- A subtle **timing/flow element** (shared with the drum game / flow toys beat-grid): catch the pocket, hit a **lock-in flow state** for a flourish and a bonus.
- **Expression-first principle:** never force dance-matching as a grind during every set. It's a *fun amplifier*, not a tax. Mash a button and vibe and you're fine; master the timing and you shine.

---

## 4. Social Emotes (beyond dancing)

The non-verbal vocabulary that makes the social universe feel human:
- **The PLUR handshake → kandi trade** — the iconic peace-love-unity-respect handshake as an animation that *trades a kandi bracelet.* This is the emotional core emote of the whole game.
- Hugs, the festival wave, hands-up, blowing kisses, the **wook nod**, "namaste," the shush-for-the-drop, pointing at the DJ, the group crowd-wave.
- Sit-in emotes (join a drum circle, plop in the grass, skip a rock).

---

## 5. The Social-Universe Glue

Emotes are how players connect without voice or text — essential for the Radiate/crew layer:
- An **emote wheel** on the in-game phone/radial.
- **Crew dance circles** — your rave crew throws down together; synchronized crew emotes and signature crew moves.
- The **kandi handshake between two real players** is exactly the kind of small, warm ritual that turns strangers into festie besties. The connection thesis, in one gesture.

---

## 6. Unlocks & Identity

- **Earn styles by living the scene** — climb the genre **Taste Ladder**, hang in those crowds, gain that faction's rep, and their dance unlocks. You learn to noodle by being *around* the bass heads.
- **Your signature move** — a go-to dance/emote that becomes part of your identity (and shows on your Radiate profile).
- **Cosmetic flourishes** — gloving LEDs, light trails, flow-toy blends for the dedicated.

---

## 7. Interlocks
- **Hydration system:** dance hard and long → you sweat → hydration drops. The rave has a cost; the water vendor stays relevant. (Direct tie to the needs deep-dive.)
- **Flow toys:** dancing and flow-toy spinning blend into one expressive moment.
- **Photo Mode:** emotes and poses are how you capture the memory.
- **Wardrobe:** your fit + your move = your whole vibe. A brostep god in full bass-head regalia headbanging hits different.
- **Factions/Taste Ladder:** the dancefloor is the genre map made physical.

---

*Design note: the whole feature lives or dies on feel. Get the animations and the music-sync *juicy* and players will dance for the joy of it; over-systematize it and it becomes homework. Expression first, always.*


---

# Part 20 — Scene Status & Titles

# SHAKEDOWN — Scene Status & Titles
### Cultural standing, earned epithets, and the long road to Certified Head
*Companion to the design bible.*

---

## The Idea — status is who the *scene* says you are

This is a layer *on top of* the mechanical ladders, not another grind. It **reads everything you've done** — DJ rank, Cred, faction rep, collections, iconic moments — and gives the culture's *name* for you. Crucially, it's **path-agnostic:** a legendary Maker, a revered flow artist, or a beloved sound tech can hit the top **without ever DJing.** Status is the one prestige system that unifies every way to play.

It's also the answer to "the game should take a long time to beat" — **Certified Head is a true long-haul capstone**, earned over the whole journey, not bought.

---

## The Scene Status Ladder (the spine)

| Tier | Who you are | Roughly earned by |
|---|---|---|
| **Tourist** | here for the headliner, gone by encore | just showing up |
| **First-Timer** | wide-eyed, overwhelmed, hooked | your first full festival |
| **Festie** | you get it now, you'll be back | a season under your belt |
| **Lot Rat / Road Dog** | you live for this, always around | living the circuit, paying dues |
| **Raver / Tour Vet** | established regular, known face | rep across a few factions |
| **Wook** | fully crusty devotee — *a badge of honor here* | true commitment (and questionable hygiene) |
| **Head** | a real connoisseur — you *know* | deep taste + the heads' respect |
| **OG / Elder** | people defer to you, you hold history | years, mentorship, legacy |
| **Legend** | known across the whole circuit | iconic moments, broad fame |
| **★ Certified Head** | **god tier** — the heads themselves certify you | see below |

---

## The Fork at the Top *(reinforces the core Cash↔Cred split)*

The apex bifurcates along the Legend↔Deity identity fork — and you usually **can't hold both** (the deliberate Cash/Cred non-convertibility):

- **★ Certified Head** — the **underground / Deity apex.** Revered by the heads. You can't buy it; you earn it by being the real thing. The *opposite* of a sellout.
- **★ Festival Royalty** — the **commercial / Legend apex.** Famous, headlining, rich, on every flyer.

The rare player who somehow earns **both** unlocks the secret hardest achievement — the **Double Crown** — precisely *because* the systems fight you on it.

---

## Earning "Certified Head" (the capstone rite)

Not one maxed ladder — **broad *and* deep devotion**, proven across the game:
- **Taste** — high on the Signature Sounds Taste Ladder (you *know* music).
- **Dues** — time on the road, festivals survived, the circuit walked.
- **Respect** — inner-circle standing with the underground factions.
- **Moments** — a history of legendary, talked-about nights.

Then the **rite:** the elders/heads **vouch for you** (ties directly to the vouched-for re-entry and faction inner circles) — a culminating Vision-Quest-style trial where the scene itself decides you're the real deal. It's *conferred*, not unlocked. That's what makes it mean something.

---

## Titles & Epithets (the gallery)

Beyond the main ladder, a collection of **earned honorifics for *how* you play** — displayed on your Radiate profile and over your head in multiplayer. You pick which to show.

**Badges of honor:**
- *The Miracle Worker* (gifted countless tickets) · *Certified Sound Tech* (rig mastery) · *The Trip-Sitter* (talked people down) · *Soundclash Champ* · *Crate Digger* (huge track-ID collection) · *Lot Legend* (vending empire) · *Fire Marshal* (flow mastery) · *Stage Builder* · *The Connector* (introduced players who became real friends)

**Affectionate roasts (the satirical anti-titles):**
- *Sparkle Pony* (all looks, no music) · *Gate Crasher* (sneaks in, never pays) · *Sound Hog* (won't share the aux) · *The Narc* (snitched) · *Spunion* (perpetually too far gone) · *Bunk Dealer* (sold someone a dud) — earned by clueless or scummy play, worn whether you like it or not.

The roast titles are pure SHAKEDOWN tone — the game lovingly clowns you as much as it celebrates you.

---

## Nameplates — The Title Above the Name

Every character — **you included** — wears their title in small text directly above their name. Talk to Patches and you read:

```
        Certified Head
           Patches
```

**First, the key distinction — two systems, one slot:**
- **Rank** (the ladder) is your *standing* — one tier at a time, climbed by overall progress, **Certified Head at the very top.**
- **Titles / epithets** (the gallery) are your *flavor* — a collection of labels earned by specific deeds, with **no "top"** (*The Miracle Worker*, *Spunion*, *Self-Proclaimed Shaman*).
- The nameplate is **one slot**: it shows your **rank by default**, or **a title you swap in** to flex. Rank = where you stand; title = how you're known.

**For NPCs:** the title is their one-line identity, shown the moment you meet them — instant characterization *and* soft tutorialization. You learn who someone is before they say a word:

```
   Nitrous Kingpin          First-Timer            Buzzkill
      Vinny                   some kid          Security Officer Dan
```

**For the player:** your nameplate shows your **current status tier** by default (*Lot Rat → Wook → Head → ★ Certified Head* as you climb), and you can **swap in any earned title** from your gallery to flex — wear *The Miracle Worker* with pride, or rock *Spunion* ironically. Your title rides above your head in multiplayer and headlines your Radiate profile.

**It's a comedy engine.** Walking the lot reading everyone's titles *is* the joke: *Sparkle Pony*, *Self-Proclaimed Shaman*, *Peaked At 2PM*, *Aspiring Wook*, *That One Sober Guy*, *Lot Loan Shark*. The nameplate is a deadpan punchline delivery system.

**Design details:**
- **Color-coded by rarity/standing** — common gray climbing to a legendary glow for *Certified Head* / *Festival Royalty*, so high-status characters visibly pop across a crowd.
- **Reveal rules:** most titles show on approach/target; a few **hidden-identity** NPCs (the Fence, anyone undercover) don't reveal their *true* title until you're in deep enough to know them — tying into the first-meet-vs-familiar reaction system.
- **Dynamic:** your title updates live as your status climbs or as you equip a different one; an NPC's can shift if their situation does.
- **Faction tint (optional):** a subtle color or icon marking which scene a title belongs to.

It's the visible surface of this whole system — every bit of status and every earned epithet, readable in a glance above a head.

---

## Interlocks
- **Radiate & multiplayer:** your status tier + chosen title are your headline social signal — the first thing people see on your profile and nameplate.
- **The identity fork:** the two apexes *are* the Legend↔Deity choice made visible.
- **Path-agnostic:** unifies DJs, Makers, flow artists, sound techs, promoters — everyone climbs the same status ladder their own way.
- **Factions:** inner-circle respect gates the top — you can't be a Certified Head the heads don't recognize.
- **Reads the whole game:** rank, Cred, collections, and moments all feed it; nothing else has to change.


---

# Part 21 — Pins

# SHAKEDOWN — Pins (Collect, Craft, Trade, Sell)
### The festival pin economy — and why it's almost free to build
*Companion to the design bible.*

---

## Why pins belong

Pin trading is one of the most beloved real micro-economies in festival culture — the lanyards, the banners, the grail hunts, the trade rituals in line. It's pure SHAKEDOWN material. And here's the best part: **it's almost free to build, because it reuses systems you already have.** Pins aren't a new engine — they're new *content* poured into four existing templates:

| Pin activity | Reuses the template from |
|---|---|
| **Designing pins** | the tie-dye / patchwork creation tool (the Maker) |
| **Running a pin booth** | the food/clothing booth small-business loop |
| **Trading pins** | the kandi PLUR-handshake trade ritual |
| **Collecting pins** | the collection / passport metagame |

High authenticity, low new tech. That's the dream ratio.

---

## 1. Collecting & the Grail Hunt
- Pins drop and sell across the world in **rarity tiers** — common → rare → **grails.**
- **Limited / seasonal / artist / festival / crew** pins create the hunt and the flex.
- Feeds the existing **collection & passport** longevity metagame — a reason to wander every lot and every festival.

## 2. Crafting (a Maker sub-craft)
A pin design tool parallel to the clothing creator, with *real* pin features so it feels authentic:
- **Form:** shape, enamel colors, art, numbering for limited runs.
- **The good stuff:** **sliders** (a piece slides on a track), **spinners**, **bobbles/danglers**, **glow-in-the-dark**, **blinkies** (LED light-up pins — festival staples), glitter fill, translucent "stained-glass."
- **Materials/manufacturing cost money** → you reinvest → your designs get more ambitious. Same ground-up grind as the Maker path.

## 3. Running a Pin Booth (small business)
- The same booth loop as food/clothing: **stock, price** (dynamic pricing model already in the bible), **upgrade the booth, build a brand.**
- A complete "start from nothing" business — someone could play SHAKEDOWN as **a pin vendor** and never DJ, exactly like the Maker.
- Limited drops and restock timing become a real strategy (scarcity drives demand).

## 4. The Trade Ritual (social glue)
- Trading pins with NPCs — and, in the social universe, **with real players** — as a ritual animation cousin to the **kandi handshake.**
- **Crew pins** (your rave crew's own pin) become identity and connection objects.
- Ties to **Radiate:** show off your collection, hunt grails others are trading, flex a banner.

## 5. Display & Flex
- Wear a **pin banner / lanyard**, or display your collection at **camp.**
- Shows on your **Radiate profile** — rare pins are a status signal.
- Unlocks **status titles**: *Pin Baron* (booth empire), *Grail Keeper* (legendary collection), *Pin Trader* (master of the swap).

---

## Interlocks
- **Economy:** faucet (selling, flipping grails) + sink (materials, chasing rares).
- **The Maker path:** pins are a natural second craft alongside clothing — or a path of their own.
- **Collection / passport:** pins are premium collectibles.
- **Kandi & trade rituals:** the social swap, displayed and animated.
- **Radiate & crews:** collections on profiles, crew pins as identity.
- **Status & titles:** *Pin Baron*, *Grail Keeper*.
- **Partnerships (later):** real pin artists are a huge scene — licensed artist-collab pins fit the same "real partners as you grow" model as the music and vendor systems.

---

*Bottom line: pins deliver a deep, authentic, beloved festival sub-economy for a fraction of the build cost, because every piece of it rides on a system already in the bible.*


---

# Part 22 — The Music Ecosystem

# SHAKEDOWN — The Music Ecosystem
### Artist uploads, in-world discovery, and turning a legal problem into a feature
*Companion to the design bible. Resolves the copyrighted-music issue raised in the DJ-gameplay doc.*

---

## The Problem It Solves

Letting players import *commercial* copyrighted music is a licensing nightmare (covered in the DJ-gameplay doc). Your fix flips it completely:

> **Artists upload their *own* original music — because they *want* the exposure.**

By uploading, the artist grants the license. No infringement, because it's theirs. And instead of a legal liability, the game gains an **endless, free, scene-authentic music library** that grows itself.

---

## The Model: a discovery platform baked into the game

Think SoundCloud/Bandcamp built into a festival world. It's **symbiotic** — the same philosophy as the vendor partnerships, but for music:
- **Emerging artists** get heard by their *exact* target audience (the bass/jam/festival crowd literally playing a festival game).
- **The game** gets a bottomless, authentic, free soundtrack that stays current.
- **Players** get real music to discover — the way you actually find tracks at a festival.

This is the music version of "parody analogs first, real partners as you grow" — except artists will want in from day one, because exposure *is* the payment.

---

## How Tracks Live in the World

- Every uploaded track is **tagged by subgenre.**
- It surfaces through **NPC DJs whose style, stage, and festival match** that subgenre and vibe — a wonky-bass track turns up at the Wakaan-like stage; a deep-house cut plays the sunrise set.
- So the music **finds you organically**, in context — exactly like hearing an unknown banger across the field and going "what *is* this?"

---

## The Discovery → Support Loop *(ties into the track-ID system)*

The existing **"what's this ID?"** interaction (the Shazam moment that's pure festival culture) becomes the engine:
1. Hear something great in-world → **tap to ID it** → see the track + artist + links.
2. It feeds your **track-ID collection / crate-digging** — now stocked with *real* tracks by real people.
3. **Follow & support** the artist — via the in-game Radiate app and out to their Bandcamp/Spotify/socials.
4. The artist gets **credited in-world** — which is the whole payoff for them.

That loop is a genuine discovery service for the scene, wrapped inside a game.

---

## Curation — your approval gate *(honest about the burden)*

- **Early on, manual approval is a *feature*:** your taste sets the game's sonic identity and keeps quality high. A curated library *is* the value.
- **At scale it becomes a bottleneck.** Plan the ramp: a submission queue → fast-tracking trusted artists → volunteer genre-curators → community flagging → eventually a small curation team. Don't let "I approve everything" quietly become a second full-time job.

---

## The Legal Backbone (the one real wrinkle — kept simple)

Even with original music, you need a short **submission agreement** before uploads open:
- The uploader **confirms they own/control the track**, including **cleared samples** (the sneaky risk — an original track with an uncleared sample is still a problem).
- They **grant a non-exclusive license** to use it in-game.
- Your approval gate + this agreement together are your protection.

This is standard for any UGC-music platform. Not heavy — but get a simple version in place *before* opening the doors.

---

## Monetization (optional, later — and a real tension)

You *could* sell **"featured" placement** (higher play frequency, prime festival slots) — the vendor-sponsorship model applied to music. But there's a credibility tension: pay-to-play placement can sour the authentic-discovery feel the whole system runs on. **Recommendation:** keep it merit- and curation-based first; if you monetize, do it gently and late, and never let money override taste.

---

## Synergies
- **Player-producers:** down the line, tracks players make in-game (Production branch / Signature Sound) could enter the pool — so players hear *each other's* music out in the world. A powerful UGC loop for later.
- **The Taste Ladder & subgenre map** route every track to the right stages and crowds.
- **Radiate:** artist profiles, following, and a discovery feed live here.
- **Label partnerships:** once you're big, scene labels (the Wakaan-likes) could partner — curated label showcases, real stages, the works.


---

# Part 23 — The Consolidated Economy

# SHAKEDOWN — The Economy (Consolidated)
### Every faucet vs. every sink · the difficulty curve · broke states · the Cash↔Cred model
*Companion to the design bible. Pulls all the scattered economic pieces into one place.*

---

## The Shape of the Economy

Two currencies in tension — **Cash** (liquid, spendable) and **Cred** (reputation/standing, *not* directly spendable) — flowing from **faucets** (income) into **sinks** (spending), on an **anti-snowball backbone** so no single purchase ever "solves" money.

**Design intent — the money-feel arc:**
- **Early Act 1:** white-knuckle scarcity (survival).
- **Mid Act 1:** comfortable, steady income; first big investments.
- **Late Act 1:** big capital; money is about *what you build*, not survival.
- **Act 2:** macro P&L — you budget (and can lose) a whole festival.

---

## 1. Faucets — Every Income Source
*(Phase: E/M/L = early/mid/late Act 1 · A2 = Act 2. Scale = rough magnitude.)*

| Source | Type | Phase | Scale |
|---|---|---|---|
| Can recycling | bootstrap floor | E | tiny |
| Busking (drum circle / flow arts) | performance | E | tiny |
| Grilled cheese & lot food | vending | E–M | small→med |
| Cold water | vending | E–M | small (spikes in heat) |
| Veggie burritos / quesadillas | vending | M | med |
| Balloons (nitrous) | vending (risky) | E–M | med–large (+heat) |
| Kandi craft & trade | craft | E–M | small |
| Heady glass / tapestries / fashion | booth | M | med |
| Charger cartel | vending | M | small–med |
| Vibe services (tarot / sound bath) | service | M | small–med |
| Ticket flipping / miracles | service | M | med (or Cred if gifted) |
| Set tips | performance | E–M | small→med |
| The door (hosting your own stage) | hosting | M–L | med–large |
| Vendor rent (your stage/festival) | hosting | L–A2 | med–large (passive) |
| Selling to your own crowd | hosting | M–L | med |
| VJ-for-hire | creative | M–L | med |
| Selling visual packs / track IDs | creative | M–L | small–med (passive) |
| Rig rental/lease (prestigious rig) | creative | L | med (passive) |
| Flow-arts bookings | performance | M–L | med |
| Teaching workshops (wellness) | service | M–L | small–med |
| Crime (theft / scams / the Fence) | outlaw | E–L | varies (socially costed) |
| **Ticket sales** | Act 2 | A2 | **the macro engine** |
| Bar / concessions | Act 2 | A2 | large |
| Sponsorships (vendor partnerships) | Act 2 | A2 | large |

---

## 2. Sinks — Every Place Money Goes
*(Investment = pays back; Sink = doesn't; Soft sink = anti-inflation drain.)*

| Sink | Type | Phase | Nature |
|---|---|---|---|
| Needs (food / water) | survival | E | sink (cheap) |
| Restocking vending inventory | operating cost | E–M | sink (cost of business) |
| The Decks (controller→CDJs→turntables) | gear | E–L | investment (skill/access) |
| The PA / Soundsystem | gear | M–L | **investment (cash-ROI)** |
| Campsite shelter + modules | base | E–L | mixed (QoL + Kitchen/Storage ROI) |
| The Bag | carry | E–M | investment (throughput) |
| Sound-system components | builder | M–L | investment (long-tail) |
| Stage Builder (rig / decor / amenities) | builder | L | investment (revenue) |
| Visual Builder (packs / FX / AI credits) | builder | M–L | mixed |
| Generator / power upgrades | enabler | M–L | investment (enables the rig) |
| Wardrobe (fits / DIY / exclusives) | cosmetic | E–L | sink (soft-status) |
| Track IDs / crate digging | content | E–L | investment (better sets) |
| Substances | consumable | M | sink (risk/reward) |
| Maintenance / repairs (blown speakers, gear) | upkeep | M–L | **soft sink** |
| Gas (touring the van/RV) | upkeep | M–L | **soft sink** |
| Bribes / fixers / re-entry | situational | any | sink |
| Land leases (sanctioned stages) | venue | L–A2 | investment |
| Artist fees (booking) | venue | L–A2 | investment (draws crowd) |
| Miracles given / gifting | cash→cred | any | **conversion** (buys Cred) |
| Act 2 infrastructure (toilets/water/medical…) | venue ops | A2 | investment (prevents disaster) |
| Act 2 marketing | venue | A2 | investment |

---

## 3. The Faucets-vs-Sinks Balance Map (by phase)

| Phase | Faucets that dominate | Sinks that dominate | The feel |
|---|---|---|---|
| **Early Act 1** | cans, busking, grilled cheese, water, set tips | needs, restocking, first cheap gear | **Scarcity.** Every dollar matters; one bad day hurts. |
| **Mid Act 1** | full vending, services, the door, first creative income | the PA, the bag, camp modules, first builder components | **Comfort + first big bets.** Steady income funds your first real investments. |
| **Late Act 1** | hosting, rentals, VJ/creative, flow bookings | the three builders (long-tail), land leases, artist fees, generator | **Capital + reinvestment.** Money's about *what you build*, not survival. Soft sinks (gas/repairs) keep it honest. |
| **Act 2** | ticket sales, bar, vendor rent, sponsorships | the whole festival budget (infra, lineup, marketing) | **Macro P&L.** You can lose a fortune; balance is the gameplay. |

**The reinvestment loop** runs the whole back half: **host → earn → reinvest in rig/stage/visuals → bigger crowds → earn more.** The builders are where late-game money *goes* — and why you keep hustling.

---

## 4. The Difficulty / Money-Feel Curve

The economy should *feel* different at each phase, and these are the knobs to tune it:
- **Early:** thin faucets + cheap-but-constant sinks (needs) = pressure. The can-recycling/busking floor guarantees you can always claw back.
- **Mid:** faucets outpace survival sinks → surplus → the *temptation* of big investments (do I buy the PA or the better rig first?).
- **Late:** faucets are strong, but the **long-tail builder curves** + soft sinks (gas, repairs, maintenance) absorb the surplus, so there's always something to chase and money never trivializes.
- **Act 2:** the scale jumps an order of magnitude; the challenge flips from *earning* to *allocating*.

---

## 5. Broke & Debt States

**Can you bottom out?** Yes — and it should sting without soft-locking you.
- **The recovery floor (no dead ends):** can recycling and busking are always available with zero capital. You can *always* climb back.
- **The broke spiral (the tension):** when you're broke you can't afford food/water → needs decay → hygiene/hydration penalties → worse social & performance → harder to earn. Climbing out means breaking the spiral (cheapest needs first, then a hustle).
- **Crime as the desperation valve:** the Streetwise path is the fast way out of broke — but socially costed (the "only when dead broke" framing).
- **Debt:** loans exist (a lot loan-shark NPC in Act 1; sponsors/loans in Act 2) — fast cash, real strings. Default and you've got a problem (Nitrous-Mafia-adjacent heat, or Act 2 bankruptcy).
- **Ejection** is an economic setback (lost access + forfeited sets), not a game-over.
- **Bankruptcy** (Act 2) is the real lose-state — the Fyre scenario's financial cousin.

---

## 6. The Cash ↔ Cred Model (the dual economy)

Two currencies, deliberately **not freely interchangeable** — and that asymmetry *is* the Legend↔Deity identity fork.

**Cash** — liquid, universal, directly spendable on gear, components, land, inventory.
**Cred** — reputation/standing; **not directly spendable.** It's a *soft* currency that unlocks **access, opportunities, and better rates**: prime set times, faction doors (Healing Village inner circle), the **vouched-for re-entry**, rental demand for your rig, sponsor interest, who'll play your stage.

**Conversions:**
- **Cash → Cred:** gift gear (the Gift Lot), give miracles, fair-price during a crisis, throw free renegade sets, mentor a newbie. *You spend money or forgo profit to buy standing.*
- **Cred → Cash (indirect only):** high Cred raises your earning *ceiling and rates* — better-paid bookings, a famous rig earns rentals, Festival Famous opens paid gigs, sponsors chase famous festivals. Cred never converts *directly*; it makes your faucets bigger.

**The deliberate non-convertibility (why it matters):**
- You **can't buy** the heady underground's respect — commercial cash success earns **Legend**-cred with mainstream crowds but actively **loses Deity**-cred with the heads.
- **Some doors open only to Cred** (the inner circle, the vouched re-entry, the beloved-elder path); **some open only to Cash** (gear, land, infrastructure).
- You can't max both — which forces the identity choice. That tension is the whole point.

---

## 7. The Backbone (anti-snowball principles, consolidated)
- **Different tracks pay in different currencies** — the Decks buy access, the Campsite buys time/capacity, only the **PA is true cash-ROI.**
- **Apex heady gear earns *less* cash, more Cred** — the top of the tree is never a money fountain.
- **Soft sinks** (gas, repairs, maintenance) quietly drain surplus → no runaway inflation.
- **The builders are the money's purpose** — long-tail curves mean there's always something worth saving for.
- **Cash and Cred stay separate** — so success on one axis never trivializes the other.

---

*Tuning note: every magnitude here is **relative and directional**, not a number. Exact prices, payouts, and curves come out of playtesting — designing them on paper is the classic wasted-work trap. This doc fixes the **shape** of the economy; balancing fills in the values later.*


---

# Part 24 — Things To Do & Longevity

# SHAKEDOWN — Things To Do & Longevity
### Beyond quests, gigs & building — the activity layers that make it endless
*Companion to the design bible.*

---

## Quick stock — what's already to do
DJing (the mixing engine + all its modes) · 118 quests + radiant micro-quests · the hustle economy + dynamic pricing · building (visuals / stages / rigs / full festivals) · camp upgrades · the skill tree (7 branches) · wardrobe & character expression · stealth/theft/cons · substances & care · the Tour across biomes · the whole Act 2 management sim. **That's already more than most shipped games.** So the additions below aren't "we're short" — they're the levers that turn "a long game" into "a game with no real end."

---

## 1. Flow Arts & Performance — a whole second career *(your flow-toys ask)*

You can be a **performer**, not just a DJ — a parallel identity/career that reuses the rhythm-minigame engine.

- **The toys:** hula hoop, poi, staff, fans, juggling, levwand, contact/dragon staff, buugeng — and **fire** versions as an upgrade tier.
- **The mini-game:** chain tricks to the beat (same engine family as the drum/mixing games), build combos, hit a **flow-state lock-in** for multipliers. Timing windows tighten as you learn harder tricks.
- **What it earns:** busking tips, **Flow Arts faction rep**, new toys & cosmetics, crowd-Vibes, performance **bookings**, and unlocks (fire spinning).
- **Progression:** learn tricks → combos → fire → a **signature style** → legendary performer (a flow-arts cousin to the Sculptor).
- **Synergies:** perform *during* a DJ's set and split tips · fire spinning at your own stage is a **spectacle that boosts your festival's draw** (stage builder / Act 2) · recruit a flow crew · it slots into the skill tree as its own performance lane. *Another "type" to be = another full playthrough.*

---

## 2. Multiplayer & Social — the single biggest longevity multiplier

A solo game has a finish line; a social one doesn't. A festival is *inherently* multiplayer.

- **Co-op:** road-trip the Tour with friends, share a camp, run a **stage or festival as a crew**, **B2B sets** together (one mixes, one VJs), trip-sit each other.
- **Crews / found-family:** a guild system — your sound crew, your camp family, shared rep and gear.
- **Visit each other's festivals & stages** — walk through a friend's custom-built festival, hear their rig, play their stage.
- **Soundclash (PvP):** your rig + set vs. theirs, for the crowd.
- **Player trading:** kandi, track IDs, gear, fits.
- **Async:** leaderboards for sets/festivals, your festival gets visited and rated while you're offline.

---

## 3. The Creator Community (UGC) — where it becomes truly infinite

You already have the *builders* (visuals, stages, rigs, festivals, fits, tracks/sets). Add **sharing** and the content becomes endless because the *players* make it:

- Publish and browse festivals, stages, rigs, visual packs, outfits, and recorded sets.
- Rate, follow, and **remix** others' creations.
- A real in-game **scene** — creators following creators. (This is the LittleBigPlanet / Dreams / RCT model, and it's the engine behind your viral dream below.)

---

## 4. Deep Relationships & Your Crew — emotional longevity

The Sims layer, expanded past romance quests:
- NPCs with **evolving, persistent relationships** (friends, rivals, mentors, festie besties) who **remember you across the Tour.**
- A **crew that travels with you** — companions who carry gear, hype your sets, sit your trips. Your past PLUR pays off here.
- Long-running **rivalries and alliances** that develop over festivals.
- A **festival dog** — a lot-dog companion you care for; finds items, draws people, beloved. (Pure culture.)
- Recurring characters whose **arcs progress** (the conspiracy guy evolves; the newbie you mentored becomes a headliner). *People are why you keep playing.*

---

## 5. Collection, Mastery & Memories — completionist longevity
- **Festival Passport** — stamps/badges for every festival, every stage played, every soundclash won.
- **Photo Mode + a Memories album** — capture moments (huge in festival culture; doubles as a share hook).
- A **Hall of Fame / discography** — every track you've made, every legendary set.
- The existing collectathons (track IDs, Patch Jacket, pins, totems, art cars) + a "people you've met" log.

---

## 6. Wellness & Workshops — an alt-path with its own progression
The Healing Village as *activities*: yoga, meditation, sound baths, breathwork, ecstatic dance — mini-games that give buffs, Vibes, and skill points. Once skilled, **teach workshops** for income + rep. A "spiritual journey" lane and identity (the sober/caretaker build's home turf).

## 7. Exploration, Foraging & Secrets — open-world discovery
Hidden renegade stages, the mythical 13th porta-potty, easter eggs, secret sunrise viewpoints, **foraging** (mushrooms/herbs gathering loops), and piecing together festival **lore**.

## 8. The Road — travel as gameplay
The van/RV journey between festivals as actual content: scenic routes, breakdowns, hitchhikers, roadside diners, crew bonding, gear hauled on the roof. RDR2-style traversal, not a loading screen.

## 9. In-World Social Media & Influence — the meta layer
An in-game "feed" where you post your sets, looks, and festivals to build a following — feeding **Festival Famous** and your brand. An influencer/clout sub-game that also seeds the viral fantasy below.

---

## 10. Live-Service & Real-Festival Partnerships — *(your viral idea — and the one catch)*

**The vision:** recreate real festivals (Infrasound, Secret Dream) and real vendors (Island Noodles), with vendors *paying* for an in-game booth once the game has reach.

**The honest catch — IP/licensing:** real festival names, layouts, logos, and brands are **trademarked**. You can't recreate "Infrasound" or drop in "Island Noodles" without **permission/a deal.** But here's the thing — *that's exactly the model you're describing.* A vendor paying for a booth **is the license**: they consent, they benefit (exposure to their exact audience), you get paid. That's legitimate **brand-partnership / product placement**, common in games.

**The pragmatic path:**
1. **Build with parody analogs first** — "Infra-Sound," "Spiral Noodles," fictional-but-lovingly-accurate festivals and vendors. Zero IP risk, ships free, and it's *funnier.*
2. **Swap in real partners as deals materialize** — once the game has an audience, beloved vendors and even festivals may *want* in. Replace the analog with the real, licensed version.
3. **Keep it opt-in and authentic** — heavy-handed ads sour goodwill, but a booth from a vendor fans actually *miss between festivals* is content players will love. The good version of in-game advertising.

**The viral path is genuinely smart for this niche:** the festival/bass community lives on Reddit, Facebook groups, and Discord, and they'd *recognize and share* an authentic recreation of their world. Grassroots marketing into a passionate, tight-knit scene is exactly how a game like this breaks out. Realistic? Most games don't go viral — but the concept is unusually shareable, and the audience is reachable.

---

## The longevity principle

Two things make a game effectively endless, and you now have both on the table:
1. **Alt-careers & build-types** (DJ / producer / flow artist / promoter / hustler / outlaw / healer) — each is a *different playthrough*, so the content multiplies by however many ways there are to *be.*
2. **Social + UGC** — when players make and share the content and play together, the game stops having a "last thing to do." That's the jump from "100-hour game" to "a place people keep coming back to."


---

# Part 25 — The Social Universe (Radiate)

# SHAKEDOWN — The Social Universe (Radiate)
### The in-game social app, rave crews, and how the solo grind becomes a shared world
*Companion to the design bible. The multiplayer/social layer — built after the solo game lands.*

---

## Sequencing (locked-in instinct)

**Solo story first → social layer second → real-time shared world last.**

This is the right order for three reasons: the solo game is the thing you can actually finish and ship; the social features are *much* cheaper than real-time multiplayer (see server reality below); and you want **people already playing and invested** before you ask them to be social. You don't launch a party into an empty room.

---

## The Thesis: connection is the whole point

Festival culture *is* human connection — PLUR, the people you meet in line, the friends you make at 4am by a rig. A social layer that turns in-game bonds into **real friendships, partners, even soulmates** isn't a bolt-on feature — it's the most **on-theme thing the game could possibly do.** The game's soul is connection; the social universe is that soul, made real. Design it with that dignity, not as a chat box.

---

## Radiate — the in-game social app

A parody social platform (the festival world's Instagram/BeReal), lived through your **in-game phone**:

- **Profiles** — your festival résumé (see the bridge below), your looks, your sets, your creations.
- **A feed** — post photos (ties to Photo Mode), sets, fits, festival moments; follow people; build a following that feeds **Festival Famous.**
- **Friends** — meet people in-world or through Radiate; add them; see **when they were last online** (GTA-style).
- **Discovery** — find people by scene, by home festival, by craft. The connective tissue that lets real friendships form.

---

## Rave Crews

- **Form and name your own crew** — your sound crew, your camp family, your squad.
- **Crew identity** — a name, a tag, shared rep, maybe a crew totem/flag and matching fits.
- **Crew chat** — a **group chat on your in-game phone**, exactly like GTA's.
- **Crews do things together** — run a stage, throw an event, road-trip the Tour, soundclash another crew (once real-time lands).
- This is the single best retention hook in the game: people stay for *their people.*

---

## The In-Game Phone (GTA-style)

The hub for all of the above: contacts, **group chats**, **last-online** indicators, event invites, the Radiate feed, and gig/booking notifications. One familiar interface tying the social universe together.

---

## The Solo → Multiplayer Bridge *(your best idea here)*

**Your multiplayer profile *is* your single-player world's résumé.** Everything you grind solo becomes your portable reputation:

- DJ rank, signature sound, your rig's **prestige**
- The brand/booth/festival you built, festivals you've thrown
- Your crew, your Cred, your Festival Famous, your collections

When someone taps your profile in the social universe, they see **who you became** in your own world. This is what makes the solo grind *matter socially* — your reputation travels. It's the motivational backbone that ties the two halves of the game together, and it's cheap to do (it's just profile data, not a live world).

**Visiting worlds:** people *can* tour what you built — walk through **your festival, your booth, your stage** as an **async snapshot** (not a live server). This gives "visit my world" a real purpose: it's the **creator-community / UGC showcase** — you show off what you made, others get inspired, the best creations spread. Animal-Crossing-island energy, festival edition.

---

## The Server Reality (the honest part)

You asked if multiplayer servers cost money. **Yes — but the costs split into two very different buckets, and conflating them is what sinks indie multiplayer:**

| Layer | What it is | Cost | When |
|---|---|---|---|
| **Social layer** | profiles, Radiate, crews, chat, last-online, leaderboards, async world *visits* | **relatively cheap** — mostly stored data + light backend, largely asynchronous | earlier |
| **Real-time shared world** | many players in the *same live festival*, synced in real time | **expensive + hard** — pay per concurrent player, plus netcode complexity | later, if at all |

**The plan:** build the **cheap, async social layer** first (it delivers 80% of the connection — crews, profiles, chat, visiting worlds — for a fraction of the cost). Gate the **real-time shared festival** on actually having an audience and the budget to run it. You may find the social layer alone is enough to create the friendships you're dreaming about.

**Paying for the servers:** the bible already separates **earn-in-game cosmetics** from **optional real-money cosmetics** — that split, kept non-predatory, is the honest way to fund ongoing server costs without gutting the game. Servers cost money; cosmetic support covers it; nobody has to pay to play.

---

## Scaling the Worlds (RuneScape-style)

Your instinct here is exactly right. Start with **one world** (capacity N). As the population grows, spin up more **identical worlds** — players pick which to join, and if one's full they hop to another. It's **elastic**: you add worlds (and their cost) only as real players show up, and modern cloud auto-scaling makes this cleaner than RuneScape's original version.

**The key refinement — split global from sharded:**
- Keep the **social layer global** — one shared backend, so friends, crews, Radiate, and profiles persist **across every world.** Your people are never lost.
- Keep the **real-time worlds sharded** — each is a separate live instance.
- Add **"hop to your friend's/crew's world"** so sharding never *scatters* your squad. (This is the one thing RuneScape players always needed — make grouping up frictionless.)

**The honest hard part:** a festival's whole fantasy is **density** — huge crowds at the stage — and syncing many real players in one packed space is the genuine technical challenge (it's why per-world caps may be lower than a sparse MMO's). The toolkit: crowd LODs, NPC crowd-filling around the real players, and per-stage instancing — though instancing trades away some of that "we're all here together" feel. **Density is the thing to prototype carefully**, because it's both the point and the difficulty.

**Sequencing:** this is a real-time-multiplayer concern, so it's the *last* phase — after the solo game ships and the cheap async social layer is live.

---

## The Dream, Grounded

People genuinely do meet lifelong friends and partners in games built around shared passion — it happens in every game with a real community. SHAKEDOWN is *unusually* well-suited to it because its entire subject is connection and good vibes. You can't *promise* soulmates — but you can build the conditions where they happen: shared obsession, small crews, real identity, a reason to come back to the same people. That's the most you can design, and it's a beautiful thing to aim at.


---

# Part 26 — NPCs — Onboarding, Patches & Reactions

# SHAKEDOWN — NPCs: Onboarding, First Impressions & Reactions
### The open start, the guide who welcomes you, and how NPCs remember you
*Companion to the design bible.*

---

## 1. The Open Start — you don't pick a path, you *find* one

Locking in the prior decision, now with a concrete opening flow:
- **Character creation = appearance only.** You build *how you look*, not *what you are.*
- **You're dropped into the world** arriving at your first festival — broke, wide-eyed, $40 in your pocket.
- **A single, super-recognizable NPC welcomes you** and gives the tutorial intro to the festival circuit — the lot, the stages, the woods, the basics of staying alive (needs).
- **Then he gets out of your way.** Crucially, he does **not** tell you to be a DJ, or a vendor, or anything. He points at all the doors and lets the festival show you who you are. Your path **emerges** from what you gravitate toward.

This is the "show, don't funnel" opening — the world is the character creator for your *identity*.

---

## 2. Patches — the Mayor of Shakedown Street *(the guide)*

The first face you meet, and one of the most important characters in the game.

**Who he is:** an elder wook who's been to every festival on the circuit since the beginning, knows *everyone*, and personally welcomes every first-timer. Nobody knows his real name — he's just **Patches**, the self-appointed **Mayor of Shakedown Street.** He is, mechanically, a **Certified Head** — the living embodiment of the game's apex status. *He is what you could become.*

**Instantly recognizable (the silhouette tells his whole story):**
- Long silver dreads, a serene permanent grin, bare feet or blown-out sandals.
- A **patchwork coat absolutely buried in patches and pins** from decades of festivals — a walking museum of the entire circuit. (That coat is the aspirational end-state of your *own* Patch Jacket and pin banner.)
- A hand-carved walking staff topped with a little bell you hear before you see him.

**How he talks:** warm, unhurried, speaks in gentle festival-koans and dad jokes, calls everyone **"family."** Has a story about every single patch on his coat if you ask. Never sells you anything. Never rushes.

**His role across the whole game:**
- **The tutorial** — he teaches by welcoming, not by lecturing.
- **The anchored oracle (your home-base help system)** — Patches *stays put* in the main area / home base, so you can **always** find him. He's the game's diegetic help desk: ask him where to go, what to do next, or how something works, and he answers with **context-aware, in-character hints** based on your progress and current standing — never a checklist, always a nudge ("heard the renegade crew's lookin' for someone who can actually mix, family…"). He's the soft guidance layer of the Quest Discovery system.
- **The full-circle payoff** — the player who reaches the top is **vouched into Certified Head by Patches himself.** The first NPC who welcomed you is the one who crowns you. *The character who opens the game closes your arc.* That symmetry is worth protecting.

---

## 3. The First Quest — "Bare Witness"

The tone-setter, and the first thing that happens in the game. While Patches is mid-welcome — gently gesturing across the grounds — **Buck streaks past:** naked, screaming, arms flailing at the sky, dead sprint. Patches doesn't even pause. A beat. *"...ah. That's Buck. He does that."* Then, with a grin: *"Tell you what, family — go after him. Knows these grounds better than anybody, even if he's got no idea he's givin' you the tour. Just don't lose him."*

**That's your first quest** — and it's a piece of stealth design: chasing Buck's chaotic path **is** the guided tour of the festival.

- **Teaches the basics through the chase:** sprinting & movement, camera/follow, and the festival's key zones — Buck careens through **Shakedown Street**, the **campgrounds**, past the **main stage**, and down toward the **river** — plus the interaction prompt and your first **quest-log** entry.
- **A light needs touch:** you're sweating by the end, and the catch-moment lands the game's care ethos — *"you're drippin', kid. Drink some water."* First lesson in hydration, delivered with love.
- **The payoff (pure Buck):** you finally corner him at the river as the sun breaks — and the chaos just *evaporates.* He turns, serene, no memory of the sprint: *"Oh — hey, family. Beautiful day, huh?"* Why was he running? He's already forgotten. He was just *that* happy. His nameplate settles in: **Free Spirit / Buck.**
- **The hook:** he wanders off blissfully, now a recurring face (and a contact) — seeding every later Buck bit. Quest complete: you've toured the whole festival, met its patron saint of joy, and learned the controls.

**Why it's the perfect opener:** in ninety seconds it sets the tone (affectionate absurdity), teaches the controls, tours the map, introduces a beloved character, and lands the care ethos — all as comedy, not a single menu or lecture. *The first thing you do in SHAKEDOWN is chase a screaming naked man into a sunrise.* That's the whole game in one sentence.

---

## 4. The Reaction-State System (first meet → familiar → relationship-modified)

Every distinct NPC reacts to you based on **who you are to them right now.** Three layers:

**① First Meeting — the signature intro.** The first time you interact, they hit you with a **tagline, a hook, or an explanation of what they do.** This *is* the world tutorializing itself — you learn what an NPC/vendor/faction is *for* by meeting them. (The Nitrous Mafia's "**3 for $20, no deals!**" is exactly this.)

**② Familiar — known quantity.** Once you've met, they drop the pitch. Greetings get shorter, warmer, or just transactional. They remember you were here.

**③ Relationship-Modified — they react to your standing:**

| Your standing | How they treat you |
|---|---|
| **Allied / high rep** | discounts, secret menu, favors, warmth, gifts |
| **Neutral** | standard service |
| **Famous / high status** | recognition — *"holy shit, you're—"* — deference or excitement |
| **Rival / competitor** | cold, refuse to deal, price you out, turf threats, sabotage |
| **Infamous (thief/narc)** | wary, won't sell, watch their pockets, warn others |

---

## 5. Worked Example — The Nitrous Mafia *(your scenario, fully)*

- **First meeting:** *"3 for $20, NO DEALS!"* — plus a menacing-but-comic intro that establishes who they are and that they run this corner.
- **Familiar:** they skip the pitch — a nod, a one-liner, straight to business.
- **Regular customer / on good terms:** maybe a bulk rate, they tolerate you, you're "alright."
- **You get your own tank and start competing:** now you're a **threat to their corner.** Reactions **flip** — they're hostile, they **won't sell to you**, they jack prices when you're around, they run you off their turf. And it **escalates into a real rivalry** (the "whatever issues that causes"): a price war, a sabotaged tank, goons sent to your booth, a tense confrontation questline. Competing with the Mafia is *high-risk* — they're the darker faction for a reason, and the heat (Buzzkill) and danger scale with your ambition.

That single example shows the whole system: an NPC who **teaches you on meeting**, **remembers you after**, and **turns on you when your actions make you their rival.**

---

## 6. How the Memory Works (and why it's cheap to build)

Each NPC tracks a few **state flags**: *met-before*, your *rep* with them/their faction, your *overall status/fame*, and *notable events* (you helped them / robbed them / out-competed them). Dialogue is **authored branches keyed to those flags** — this rides the **systemic AI backbone** (RDR2-style, from the Tech doc), so it costs **nothing per play.** Optional on-device SLM can enrich open-ended chat, but the reaction *system* is just smart state + good writing.

---

## 7. Interlocks
- **Factions** — rep is the main dial on reactions.
- **Status & Fame** — recognition behavior; Patches embodies the apex and gates Certified Head.
- **Streetwise** — infamy makes NPCs wary; getting "flagged" changes greetings.
- **Economy** — rivalry reactions tie into competitor pricing and turf.
- **Quests** — rivalries (like the Nitrous war) escalate into questlines.
- **Patch Jacket / Pins** — Patches' coat is the visible aspirational endpoint.
- **Procedural NPCs** — archetype crowds use a lighter version (generic first-line + basic familiarity).


---

# Part 27 — NPC Roster — The Character Bible

# SHAKEDOWN — NPC Roster (Character Bible)
### The framework for cataloging every NPC, plus a seed list of everyone named so far
*Companion to the design bible. A living catalog — this is the skeleton; we flesh it out over time.*

---

## Purpose

Eventually every distinct NPC needs a spec. This doc is the **structure** that makes that buildable: a standard entry template, a split between hand-authored and procedural NPCs, and a **seed list** of every named character already implied across the bible so nothing gets lost.

---

## Two Tiers of NPC

**① Named / Unique NPCs** — hand-authored, recurring, memorable. They carry the story, the quests, the factions, the tutorials. **These get full entries.** Realistically ~20–40 carry the whole game.

**② Archetype NPCs** — the procedurally generated population (ravers, vendors, security, kandi kids) built from the modular parts library + weighted templates (see Wardrobe & Fashion). **These are defined as *templates*, not individuals** — a generic first-line, basic familiarity, faction tint. Occasionally one gets an emergent name and a tiny story.

**The honest scope rule:** fully author the key named NPCs; **procedurally generate everyone else.** Don't hand-write 500 ravers. The named ones make it feel personal; the crowd makes it feel alive.

---

## The Entry Template *(use for every Named NPC)*

```
NAME / HANDLE:
ROLE / ARCHETYPE:
FACTION:
WHERE FOUND:
LOOK (recognizable silhouette):
PERSONALITY / VOICE:
① FIRST-MEETING tagline/intro:
② FAMILIAR behavior:
③ RELATIONSHIP-MODIFIED reactions (allied / rival / famous / infamous):
— ARC & CONTINUITY —
ARC / STORY BEATS (the ordered steps + what triggers each):
WORLD PRESENCE (where/when you see them, and how it shifts as the arc advances):
QUEST CHAIN (how one quest with them leads to the next):
BRANCH POINTS (how your choices fork the arc — ally / rival / neglect):
PERSISTENCE (what they remember; do they stay, recur, travel the Tour, or drift away):
RESOLUTION (where the arc can land, and its different endings):
— —
SERVICES (vendor / quest-giver / trainer / ally):
QUESTS & HOOKS:
INTERLOCKS:
STATUS: [authored | sketched | TODO]
```

---

## Seed List — every named NPC implied so far

*(Status flags: ✅ designed · ✏️ sketched · ⬜ TODO)*

### Guides & Mentors
| NPC | Role | Status |
|---|---|---|
| **Patches, Mayor of Shakedown Street** | the welcome/tutorial guide; Certified Head; crowns you at the end | ✅ |
| **The Mentor DJ** | the legend you chase / who passes the torch ("Pass the Torch") | ⬜ |
| **Your Mentee** | the newbie you raise, who can headline in Act 2 | ✏️ |
| **The Advisor** (Act 2) | a Phase-1 ally who becomes your festival advisor | ✏️ |

### Faction Leaders / Key Reps *(one signature face per faction)*
| NPC | Faction | Status |
|---|---|---|
| **Lot Vendor rep** | Lot Vendors | ⬜ |
| **Flow Arts crew leader** | Flow Arts Crew | ⬜ |
| **The Renegade** (woods sound-crew boss) | Renegade DJs/Sound Crews | ⬜ |
| **The Healing Village elder/guru** | Healing Village | ⬜ |
| **The Buzzkill Chief** (head of security, recurring foil) · **Officer Dan** | The Buzzkills | ✏️ |
| **Vinny** — the Nitrous Kingpin (menacing-comic) | Nitrous Mafia | ✏️ |
| **The Booker** (gates DJ rank-ups) | Bookers/Promoters | ✏️ |

### Comedy & Lot-Life
| NPC | Role | Status |
|---|---|---|
| **The Conspiracy Circle Guy** | drum-circle ranter; fully-built sample quest | ✅ |
| **Buck** (the Naked Guy) | serene nudist free spirit; recurring lot-life fixture | ✏️ |
| **The "Where's My Car" guy / lot characters** | comedy hooks | ⬜ |

### The Breakthrough Circle *(the hilltop sunset quest)*
| NPC | Role | Status |
|---|---|---|
| **Cedar** | the *Self-Proclaimed Shaman*; means well, speaks in posters | ✅ |
| **Willow** | the nervous *First-Timer*; a tender-care thread → recurring friend | ✅ |
| **Moonbeam** | the giggling *Spunion*; occasional accidental profundity | ✅ |
| **Doc** | the quiet *Trip-Sitter*; the real anchor of the circle | ✅ |

### The Underground (Streetwise)
| NPC | Role | Status |
|---|---|---|
| **The Fence** | buys stolen goods | ✏️ |
| **Lot Rats crew leader** | the thieves' crew | ✏️ |

### Heartfelt & Relationships
| NPC | Role | Status |
|---|---|---|
| **Festie Bestie** | the friend you make; possible trip-sitter | ✏️ |
| **Romance options** (a few named) | the Romance questline | ⬜ |
| **The Trip-Sitter ally** | shows up in the Bad Trip *if* you banked goodwill | ✏️ |

### Music & Career
| NPC | Role | Status |
|---|---|---|
| **Rival DJ(s)** | come-up competition; sabotage targets | ⬜ |
| **"The ID" / USB characters** | the legendary track-ID mystery chain | ✏️ |
| **Real artist cameos** (later) | via the music/partnership model | ⬜ |

### Vendors-as-Brands *(some graduate into characters)*
| NPC | Role | Status |
|---|---|---|
| **Signature vendor owners** (tie-dye, heady glass, food, pins) | brand faces + small-business rivals/allies | ⬜ |

---

## NPC Arcs & Continuity (the storyline layer)

Every significant NPC is more than a reaction snapshot — they run a small **state machine** of story beats the player moves them through over the whole game. Three dimensions:

- **Story beats** — the ordered steps of their personal arc, each triggered by an interaction, quest, or threshold.
- **World presence** — where and how you bump into them *between* quests, which **shifts as the arc advances** (a stranger on a corner → nodding you through → glaring → hunting you).
- **Branching** — your behavior forks the arc: lean in (**ally**), compete with or cross them (**rival**), or **neglect** them entirely (they drift, move on, or fade to a background nod). *Not interacting is itself a path.*

Plus the connective tissue:
- **Quest-chaining** — one quest with them unlocks the next, gated by your relationship and prior beats: a personal questline that surfaces through the discovery system.
- **Persistence** — they remember and carry state; they keep existing in the world, may travel the Tour with you, recur at milestones, or leave for good.
- **Cheap to build** — it's all state flags + authored beats riding the systemic backbone (the same engine as the reaction system).

---

## Worked Arc — Vinny & the Nitrous Mafia

| Beat | Trigger | Behavior & world presence |
|---|---|---|
| **0 · Stranger** | first meeting | *"3 for $20, NO DEALS!"* Holds his corner; ignores you otherwise. |
| **1 · Regular** | buy a few times | Drops the pitch, nods you over, "my guy." Offers a small off-the-books errand. |

**Then it forks on what you do:**

**▸ Ally branch** — run his errands → trusted → access to supply, protection, turf. *World presence:* waved through checkpoints, given a corner of your own; a darker rise-through-the-ranks questline. **Resolution:** you become a lieutenant / the Mafia's a permanent backer.

**▸ Rival branch** *(you get a tank and compete)* —
- **R1 · Cold war:** won't sell to you, undercuts your prices when you're near, glares.
- **R2 · Intimidation:** goons visit your booth, a sabotaged tank, a "last warning."
- **R3 · Showdown:** a confrontation quest. **Resolutions:** back down (humbled, absorbed) · out-compete (you take the corner — grudging respect *or* lasting grudge) · broker a truce (split territory).

**▸ Enemy branch** — snitch to the Buzzkills / cross them badly → they actively hunt you (ambushes, heat spikes, a "marked" state) until you settle it or lie low.

**▸ Neglect branch** — never engage past Beat 0 → they stay the background "3 for $20" guys, neutral forever.

*World presence tracks the branch:* fixed corner (stranger) → nodding you through (ally) → refusing/glaring (rival) → stalking you (enemy).

---

## Worked Arc — The Breakthrough Circle *(post-quest continuity)*

After you blast off (or sit sober) on the hill, the circle **doesn't evaporate** — each member becomes a persistent presence whose path depends on how you engaged.

- **Willow** *(the first-timer)* — **if you looked after her:** a recurring friend with her own confidence arc — you spot her around the Healing Village and camp gaining her footing, then thriving; a follow-up quest where she asks your help; eventually she **pays it forward** to a new newbie, and if you mentor her she headlines a small set (ties into the mentee system). Can become a festie bestie / crew member / romance. **If you didn't:** a friendly-but-distant face you pass by (the drift branch).
- **Doc** *(the trip-sitter)* — the steady one becomes a reliable ally: a quietly deepening friendship, a Wellness mentor, and **the guy who shows up to sit *you* if you have a Bad Trip later** (callback payoff).
- **Cedar** *(the shaman)* — recurring comic relief you catch "guiding" other circles; ropes you into the *next* ceremony (a Healing Village quest chain) or makes you his trusted hand; loyal under the posters.
- **Moonbeam** *(the spunion)* — pure radiant background joy: random delightful run-ins in odd corners of the festival, an occasional "where's Moonbeam" gag, low-stakes warmth.

**The principle:** a one-night quest seeds **lasting relationships** — their world presence, their greetings, and the new quests they offer all continue based on whether and how you keep showing up. Engage and the circle becomes family; blast off and never return and they're warm acquaintances you drift past.

---



1. Promote a seed entry to a **full template entry** whenever an NPC gets touched by a quest or system.
2. Prioritize anyone attached to **the tutorial, a faction, a rank-gate, or a marquee quest** — those are load-bearing.
3. Leave the crowd procedural; only name an archetype NPC when the world benefits from it.

*This list will grow as we design. The goal isn't to write everyone at once — it's to make sure every name we've already invented has a home, and every future NPC has a shape to drop into.*


---

# Part 28 — Quest Discovery & Gating

# SHAKEDOWN — Quest Discovery, Unlocking & Gating
### A living world you uncover, not a 100-item checklist you tick off
*Companion to the design bible.*

---

## The Principle

You're right — a readable list of 100+ quests kills the magic. It turns a festival into a chore board and tells you who you're "supposed" to be before you've lived it. So:

> **The 118-quest catalog is the *developer's* master design. The player never sees it as a menu.** Quests are **discovered**, **unlocked**, and **earned** — they reveal themselves as you live in the world.

Your log only ever shows what you've *found.* The rest of the iceberg stays underwater until you bump into it.

---

## Three Visibility Tiers

| Tier | What it is | Shows in log? |
|---|---|---|
| **Discovered / Active** | quests you've found and taken on | yes — your current log |
| **Gated (latent)** | exist in the design, but locked behind prerequisites; surface *when conditions are met or you encounter them* | no — until triggered |
| **Hidden / Secret** | the legendary tail ("The ID," secret endings); no listing at all | never — found only through play |

You never stare at a wall of 118 tasks. You see the handful you're living, sense more out there, and occasionally trip over something nobody told you about.

---

## Discovery Vectors — how a quest *enters* your log

A quest surfaces when you:
- **Talk to an NPC** — especially once you're **Familiar** with them (ties to the reaction system: rep and acquaintance open quests).
- **Reach a place** — the Renegade Woods, the Healing Village, a new biome on the Tour.
- **Cross a threshold** — a faction-rep level, a DJ rank, a skill tier.
- **Trigger a world event** — the Storm, a Raid, a stampede; radiant events fire around you.
- **Deepen a relationship** — friends, mentees, romance, crew.
- **Find a clue or item** — a cryptic USB, a flyer, a rumor, an overheard conversation.
- **Hear word-of-mouth** — the lot talks; gossip points you toward things.

The quest doesn't exist *to you* until the world hands it over.

---

## Gating — the natural order

Latent quests carry **prerequisites** so the game unfolds in a sane sequence:
- **Rep / rank / skill** thresholds (no headliner quest on day one).
- **Prior quests** (questlines unlock step by step).
- **Location / time / Tour stage** access.
- **Relationship** depth (some quests only a true friend or rival triggers).

Gating is what makes discovery feel *designed* instead of random — you're always finding the *right* next thing, not everything at once.

---

## The Log Philosophy

- Shows **only discovered quests**, cleanly grouped (main thread, faction, side, radiant).
- **Never** dumps the full catalog or pre-writes your to-do list for the whole game.
- Tracks what you've *chosen to chase*, with just enough breadcrumb to resume.

---

## Patches & Diegetic Guidance (so nobody's lost)

Pure organic discovery has one failure mode: a player standing in a huge world with no idea what to do. The fix isn't a checklist — it's **Patches.** Anchored at the home base, he's the **in-world hint system:** ask him and he points you toward **one or two things appropriate to your progress**, in character, as a nudge. Optional, repeatable, never spoilery. Plus ambient cues — a distressed NPC, a flyer, a rumor — telegraph quests so the world *shows* you where to look. **Guidance through the world, not through a menu.**

---

## Secrets Stay Secret

The **legendary/endgame** quests (The ID, the hidden endings, the deepest faction lore) are **never listed.** They're found through curiosity, cryptic clues, and deep play — and that's exactly why finding one feels incredible. Protecting the unlisted tail is what rewards the players who go deep.

---

## Why This Serves the Long Game
- **Paces the content** — discovery meters out 118 quests over a long arc instead of dumping them.
- **Prevents overwhelm** — you're never buried under a list.
- **Rewards curiosity** — exploration and relationships literally generate your quests.
- **Makes the world feel alive** — quests come from *people and places*, not a UI.

That's the difference between "a map covered in icons" and "a festival where things keep happening to you."

---

## Interlocks
- **Reaction system** — Familiar/repped NPCs are a primary quest source.
- **Factions** — rep tiers progressively unlock questlines.
- **DJ ranks & skill tree** — rank-gates and capstone questlines.
- **Radiant micro-quests** — the always-on procedural layer that keeps the lot busy between authored beats.
- **Patches** — the soft, diegetic guidance backbone.


---

# Part 29 — The Quest Catalog (118 quests)

# SHAKEDOWN — Quest Catalog
### *Companion to the main design doc. ~100 quests across 12 categories.*

**Reward tags:** `[Cash]` `[Cred]` `[Vibes]` `[Rep]` (faction) `[Gear]` `[Sound]` (signature-sound unlock) `[Story]`

**Design rule:** wherever possible, each quest offers a **Hustle path** (profit), a **PLUR path** (Cred/Vibes), and a **Chaos path** (fast + risky). The best ones change depending on which Signature Sound and faction standing you're carrying.

---

## A. Main Spine — The DJ Ascension
*The career climb. Gated by Booker rep + a successful set + gear.*

1. **Bedroom to Bonfire** — produce your first track in your tent; get one (1) stranger to nod. `[Story]`
2. **The First USB** — beg, borrow, or steal enough IDs to fill an actual set.
3. **Silent Treatment** — your first silent-disco slot. Half the crowd is on a different channel.
4. **Round and Round** — earn a spot in the drum-circle rotation without getting "good-vibes"-policed out.
5. **Renegade Rookie** — find the unmarked 4am forest stage and talk the sound crew into 20 minutes.
6. **Set-Time Politics** — two stages, one slot, a promoter who owes three people favors.
7. **Train Wreck** — rebuild your rep after a catastrophic beatmatch fail goes viral on festival TikTok.
8. **The B2B Gauntlet** — survive a back-to-back against a DJ actively trying to sandbag you.
9. **Direct Support** — open for a name act without outshining them. (Or outshine them — consequences.)
10. **The Cancellation** — headliner drops day-of; pitch yourself as the emergency replacement.
11. **Main Stage** — the dream slot. Don't choke.
12. **The Closer** — close the entire festival. The sun, the crowd, the legacy. `[Story]`

---

## B. Signature Sound "Style" Quests
*One unlock chain per tier of the Taste Ladder. Each is earned, not bought.*

13. **Feels Trip** — learn the starter future-bass sound from a guy who cried at his own set. `[Sound]`
14. **Trap House** — cop the 808 stomp from a producer who only speaks in ad-libs. `[Sound]`
15. **Wonk Lessons** — embed with the riddim wooks for a weekend to earn the wonk. `[Sound]`
16. **The Growl** — learn to make synths "talk" from a retired brostep legend now selling kombucha. `[Sound]`
17. **Color Theory** — the tearout mentor only teaches after you bring rare sample packs. `[Sound]`
18. **Robot Language** — decode neurofunk from a producer who communicates exclusively via spectrogram. `[Sound]`
19. **Halftime Heady** — earn the trust of the woods' inner circle; they don't believe in four-on-the-floor. `[Sound]`
20. **Amen Break** — find the original break and the full lineage of everyone who ever chopped it. `[Sound]`
21. **The Promised Land** — apprentice with a wonky glitch-hop wizard who lives in a converted school bus. `[Sound]`
22. **Temple Tones** — a downtempo shaman tests whether you can DJ *without* a drop. `[Sound]`
23. **Get the Decks** — track down real turntables in a lot full of controllers. `[Gear]` *(gates the scratch path)*
24. **The Sculptor's Trial** — the apex: build a sound nobody's heard, on turntables, at sunrise, in silence. `[Sound]` `[Story]`

---

## C. Faction Questlines

**Lot Vendors**
25. **Pitch a Tent** — claim and defend a booth spot from a passive-aggressive burrito cartel. `[Rep]`
26. **Supply Run** — your wholesale plug got ejected; find a new one before the lunch rush. `[Cash]`
27. **Health Inspector** — a rare "official" appears. Pass inspection or bribe with grilled cheese.
28. **Vendor Union** — organize the lot against the security shakedown. `[Rep]` `[Story]`

**Flow Arts Crew**
29. **Drop the Hoop** — learn to hoop without concussing a bystander.
30. **Don't Catch Fire** — fire-spinning 101. Insurance not included.
31. **Totem Pole Position** — build the crew a crowd totem so absurd it becomes festival-famous. `[Vibes]`
32. **Flow State** — perform during someone's set and split the tips. `[Cash]`

**Renegade DJs / Sound Crews**
33. **Carry the Sub** — haul a 200-lb subwoofer into the woods at 3am. Quietly.
34. **Power Struggle** — the rig keeps tripping; find a generator and "borrow" some power.
35. **Stage Coup** — the woods crew is fracturing. Pick a side, or unite them. `[Rep]`
36. **Location Scout** — find the next secret stage spot before security maps the old one.

**Healing Village**
37. **First Bath** — assist a sound-bath. Do not fall asleep on the gong.
38. **Sage Advice** — source ethically harvested sage for the smudge crew. `[Rep]`
39. **The Integration** — help campers process the weekend in a closing circle. `[Vibes]`

**The Buzzkills (Security)** *(inverse rep — heat management)*
40. **Inside Man** — a sympathetic guard offers to look the other way. For a price.
41. **The Sweep** — they're confiscating glass. Warn the vendors, or profit off the panic.
42. **Wristband Heist** — your band got cut. Get back in without one. `[Chaos]`
43. **Heat Death** — your Buzzkill meter is maxed. Lay low for a full day or get ejected.

**Nitrous Mafia** *(darker, fully optional)*
44. **Balloon Turf** — they want a cut. Pay, fight, or undercut them.
45. **The Supply** — they control the tanks. Do you want in — and what does it cost you?
46. **Crackdown** — security and the mafia go to war. Don't get caught between.
47. **Get Out Clean** — exit the balloon game without a target on your back. `[Story]`

**Bookers / Promoters**
48. **The Guest List** — get your name on it. Everyone's name is on it. The list means nothing and everything.
49. **Rider Run** — fulfill an absurd 37-item artist rider to earn a booker's favor.
50. **The Demo** — get your track into the right hands without being cringe about it. `[Rep]`
51. **Politics** — two bookers feud; your set time is the bargaining chip.

---

## D. Hustle & Economy
52. **Grilled Cheese Empire** — one griddle to a franchise. Supply, pricing, and a rival cook. `[Cash]`
53. **Cold Water Cold Water** — corner the water market before the heat wave. `[Cash]`
54. **The Markup** — buy cases cheap outside the gate; smuggle them past security. `[Chaos]`
55. **Kandi Kingdom** — turn beads into an empire of friendship.
56. **Glass Half Full** — apprentice with a heady glass blower; vend without shattering inventory.
57. **Recycling Rangers** — the broke-wook bootstrap. Cans for deposit — but a rival crew had the same idea.
58. **Miracle Market** — flip tickets, or give miracles for Cred. Track who's worthy. `[Cash]`/`[Cred]`
59. **The Charger Cartel** — own the portable-battery economy. Everyone's phone is dead. `[Cash]`
60. **Vibe Services** — set up tarot and palm-reading; build a regular clientele. `[Vibes]`

---

## E. Comedy / Lot-Life Side Quests
61. **The Scent of a Wook** — the original. Find deodorant for a beloved, devastating wook. `[Vibes]`
62. **Where's My Car** — navigate the infinite lot from three corrupted memories.
63. **I Need a Miracle** — get a tickless traveler inside, by any means.
64. **Aux Cord Wars** — settle, diplomatically or otherwise, who controls the campground speaker.
65. **The Naked Guy** — gently relocate a very free spirit before security finds him.
66. **Onesie Down** — a man is trapped in a costume zipper. Rescue his dignity.
67. **The Conspiracy Circle** — a drum-circle guy has Theories. Survive the conversation for a reward.
68. **Parrot Problems** — a man's festival parrot escaped. It only responds to bass.
69. **The Glitter Incident** — you've been glitter-bombed. Nothing will ever be clean again. *(cosmetic curse)*
70. **Mud Season** — it rained. Rescue a camp's collapsing canopy.
71. **Vibe Check** — the self-appointed "good vibes only" enforcer is harshing everyone's mellow. Handle it.
72. **Borrowed Light** — the eternal "got a light?" spirals into a chain of favors.
73. **Hold This?** — a stranger hands you something and vanishes. *(sometimes a hook, sometimes a problem)*

---

## F. Heartfelt / PLUR Caretaking
74. **Sober Sunrise** — water, a banana, a safe spot for a stranger having a rough night. `[Cred]`
75. **Festie Bestie** — reunite two friends separated since Friday.
76. **Are You My Ride** — help someone who lost their whole crew and their way home.
77. **First Festival** — mentor a wide-eyed newbie through their first night. `[Vibes]`
78. **The Comedown** — sit with someone through the Monday blues. No fixing. Just presence.
79. **Lost Meds** — someone's actual medication is missing. Real stakes, real search.
80. **The Reunion** — two old friends who fell out are both here. Engineer a peace.
81. **Carry Them Home** — a friend overdid it. Get them back to camp safe, without judgment.
82. **Pay It Forward** — someone gave you a miracle once. Find someone worthy to give one to. `[Cred]`

---

## G. Mystery & Investigation
83. **The Phantom Set** — a legendary unannounced set happened in the woods. Find out who played it.
84. **The ID** — track down the unreleased song everyone's been Shazaming in vain.
85. **Who Took the Totem** — the crew's famous totem vanished. Follow the clues.
86. **The Vanishing Vendor** — a beloved lot cook disappeared mid-weekend.
87. **Festival Lore** — piece together the festival's origin from contradictory old-timers.
88. **The Leak** — someone leaked the secret-set lineup. Find the source. `[Rep]`
89. **Ghost Camp** — a fully set-up camp, abandoned, no owner. What happened here?

---

## H. Romance & Relationships
90. **Festival Fling** — a sunrise connection. Will it survive past Monday?
91. **Camp Crush** — your next-tent neighbor. A slow burn over the weekend.
92. **B2B Chemistry** — sparks with a rival DJ during a back-to-back. Mixing business and pleasure.
93. **The Long Distance** — they live across the country. Decide if the tour can include them.
94. **The One That Got Away** — they're at this festival too. Three years later.

---

## I. Crisis / World Events
*Dynamic, time-pressured, can fire during any festival.*

95. **The Storm** — weather rolls in. Secure camp; decide whether the show goes on.
96. **Lineup Shuffle** — a headliner cancels and the whole schedule cascades.
97. **The Raid** — security sweeps the lot. Everyone reacts in real time.
98. **Blackout** — the main stage loses power mid-set. Chaos and opportunity.
99. **Heat Wave** — needs decay doubles; the water economy explodes.
100. **The Stampede** — a surprise B2B announcement draws a dangerous crowd. Help manage the flow.

---

## J. Collectathons & Trade Chains
101. **The Kandi Climb** — trade up from one bead to a legendary cuff, PLUR-chain style.
102. **Crate Digging** — collect rare track IDs from vendors, DJs, and secret drops. *(feeds your DJ sets)*
103. **Totem Gallery** — photograph the festival's funniest crowd totems.
104. **The Patch Jacket** — earn a patch from every stage and crew to build the ultimate vest. `[Gear]`
105. **Art Car Tour** — find and ride every art car on the grounds.
106. **Pin Trading** — complete the festival pin set through the underground pin economy.

---

## K. Micro-Quests / Daily Radiant
*Procedurally generated lot filler with flavor. Cheap to produce, infinite supply.*

107. **"Cold water?"** — random vendors need a runner. `[Cash]`
108. **"Seen my friend?"** — endless lost-friend tasks with procedural descriptions.
109. **"Got a charger?"** — battery favors with strangers.
110. **"Where's the [stage]?"** — give directions to the lost. *(rewards your map mastery)*
111. **"Trade ya?"** — spontaneous barter offers, occasionally too good to be true.
112. **"Hype my set?"** — a small DJ needs bodies at their stage. Go recruit a crowd. `[Rep]`

---

## L. Legendary / Endgame
113. **Headline the Big One** — the destination-fest finale. `[Story]`
114. **The Underground Deity** — the perfect heady sunrise set to 40 silent worshippers. `[Story]`
115. **Tipper & Friends** — earn an invite to the most exclusive heady gathering. Now *you're* the mentor.
116. **The Circuit Complete** — headline every festival on the tour.
117. **Pass the Torch** — a wide-eyed newbie asks *you* for advice. Full circle. `[Story]`
118. **Leave No Trace** — the festival ends. You help tear it all down. The field empties. The world resets for next year. *(bittersweet capstone)* `[Story]`

---

*That's the bible. Pick any one and we can blow it out into a full quest design — objectives, branches, fail states, dialogue, and rewards.*


---

# Part 30 — Sample Quest — The Conspiracy Circle

# THE CONSPIRACY CIRCLE
### Full quest design — dialogue bank + drum mini-game
*Companion to the SHAKEDOWN docs. Tone: affectionate satire. He is never threatening, never angry, never right — just absolutely, radiantly certain. All "Theories" are self-evidently goofy festival woo. No real-world conspiracy content.*

---

## The Hook

You pass a lone drummer holding court by a smoldering fire. He locks eyes. You are now in the circle. **The circle is not closed.** You cannot simply walk away — that's "just physics, brother." To leave, you have to drum with him until his **Conviction** maxes out and he reaches enlightenment (or close enough), at which point he blesses you and the circle "opens."

It's a comedy boss fight where the boss is a monologue and the weapon is a djembe.

---

## The Two Meters

| Meter | Whose | Fills when… | Drains when… |
|---|---|---|---|
| **Conviction** (the goal) | His | you hold the groove during a rant + give him good "yes-and" responses | you flub call-and-response or try to bail |
| **Patience** (don't bottom out) | Yours | you nail sections, deflect well, or show him genuine care | he blocks your exit, or you drop the beat repeatedly |

**Win:** fill his Conviction → he ascends (emotionally) → reward.
**"Loss":** Patience bottoms out → you don't die (Good Vibes Only) — he just sighs *"the field wasn't ready,"* you lose a little Vibes + time, and resume from the section start. The inability to actually fail is part of the joke.

---

## The Drum Mini-Game (Guitar Hero style)

- **3-lane note highway** mapped to djembe voices: **BASS** (low, center) / **TONE** (mid, rim) / **SLAP** (high snap). Optional 4th **SHAKER** accent lane for hard mode.
- Notes scroll to a hit line; tap on the beat. Windows: **Perfect / In the Pocket / Lost It.**
- **His rant plays OVER the drumming** as cycling pop-ups. This is the core trick: as Conviction climbs from Tier 1 → Tier 3, **BPM ramps and note density increases** — he's "channeling." Holding the beat through a full-tempo Tier-3 rant is the real skill check.
- **Call-and-Response (Simon-says):** periodically he drums a short pattern (notes flash in *his* color, no input from you), then you echo it. Nail it → Conviction boost. Flub it → he side-eyes you: *"...you felt the doubt enter, didn't you,"* and re-teaches the pattern slower.
- **Flow State / "Lock In":** a sustained streak fills a **Groove gauge**. Max it and you both drop into a shared trance — screen goes kaleidoscope, multiplier spikes, and it auto-advances to the next Theory tier. Triggering it at the top unlocks **The Forbidden Theory** as the reward cutscene.
- **Difficulty knob:** which Signature Sound you main subtly flavors the chart. (Riddim mains get a hypnotic locked groove; the downtempo shaman gets sparse, spacious patterns; the future-bass starter gets, lovingly, the easiest one.)

---

## Dialogue Bank — The Theories

Cycle these as randomized pop-ups during play, escalating by tier as Conviction fills.

### TIER 1 — Surface Theories *(warm-up tempo)*
- "Brother. BROTHER. Sit. The circle's not closed. You can't leave an open circle. That's just physics."
- "You feel that bass in your chest? That's not the subwoofer. That's the planet. The bass guy's just translating."
- "They tune everything to 440 Hz, man. 432 is the people's frequency. My djembe only speaks 432. I had it blessed."
- "No cell service out here, right? It's not the towers. They don't want us coordinating once we figure it out."
- "Why's the moon so bright this weekend? Somebody's running the moon hot. I'm just saying."
- "Crystals don't heal you, brother. They *charge.* And what charges a crystal? ...You do. You've always been the battery."

### TIER 2 — Deep Cuts *(tempo ramps, denser notes)*
- "The porta-potty rotation is sacred geometry. Count the blue ones. Go on. ...You can't. They move when you blink. That's not paranoia, that's pattern recognition."
- "Grilled cheese is a psyop. Comfort food sits on your root chakra so you can't ascend. I only eat what the lot gives me freely. (beat) ...Do you have any?"
- "Sage doesn't clear negative energy. It clears *surveillance.* They edited that out of the workshop. I was THERE."
- "Every festival is the same festival. Same field. They roll it up and move it. That's why you can't find your car — the car's fine, the FIELD moved."
- "The wooks aren't dirty. The dirt is armor. The dirt is information. You wash it off, you reset your save file. I remember everything."
- "Birds? At a festival? When's the last time you saw a *real* one out here. They don't send the live ones into this much frequency. Look up. ...Drone. Beautiful, though."
- "Mercury's in retrograde, the WiFi's down, AND my ex is here. You think that's three coincidences? That's a CONVERGENCE."
- "Lizard people? Nah, that's what They want you to think They want you to think. It's deeper. It's *hammocks.* Big Hammock owns the trees now."
- "The glow sticks are tracking devices. Gorgeous ones. I still buy them. I won't let Them take aesthetics from me too."

### TIER 3 — The Forbidden Theory *(full tempo — the climax reward beat)*
- "Okay. Okay. You earned this one. Lean in. ...The headliners don't *cancel.* They ASCEND. Every year, right around the sunrise set. They tell you 'scheduling conflict' so you don't panic and try it yourself."
- "There's a 13th porta-potty. It's only there at 4am. Nobody's come back to talk about it — not because it's bad, brother. Because they didn't *want* to. I've seen the light under the door. It's warm."
- "We're not a drum circle. We never were. We're *load-bearing.* We stop drumming, the whole weekend folds into Tuesday. And nobody — NOBODY — is ready for Tuesday."

---

## Player Response Archetypes

Offer 2–3 of these between sections. Each has a mechanical kick:

- **[Yes-and — escalate]** *"Brother, I've been SAYING this. The 13th porta-potty is just the comedown made architectural."* → He's electrified. **Conviction surges, tempo jumps** (harder section), but huge Vibes/Cred if you hold the beat.
- **[Deflect with woo]** *"That's heavy, man. I gotta sit with it."* → Neutral. Buys a breather, **tempo eases** one notch.
- **[Genuine care — the wholesome turn]** *"Hey... have you had any water today?"* → He stops. Long pause. *"...You're the first person to ask me that all weekend."* **Patience refund**, unlocks a tender sub-branch (ties to the PLUR / Sober Sunrise ethos — you can quietly steer him toward the chill-out tent for bonus Cred).
- **[Out-conspiracy him]** *invent something wilder* → If it out-weirds him, he's stunned: *"...you might be more awake than me, brother,"* and you **shortcut toward the win.** If it flops, he corrects you, condescendingly, and you eat a Patience hit.
- **[Try to bail]** *"I should go find my friends—"* → *"The circle isn't closed, brother."* **Blocks you, drains Patience.** Repeated attempts tank Vibes (it's rude, and the game gently judges you for it).

---

## Win / Reward

When his Conviction maxes, the trance completes, the fire flares, and he **blesses you** — circle opens. Rewards:

- **Big Vibes boost** + **Drum-Circle / Flow Arts faction Rep.**
- **He gifts you his spare djembe** — unlocks/upgrades the **Drum-Circle busking hustle** and a Flow Arts tie-in. (It's a *gift*, fitting the Gift Lot ethos — and now you can start your *own* circle.)
- **Recurring buff — "Holding the Field":** once per festival, drum with him for a temporary needs-decay slowdown.
- **Joke item — "Certificate of Wokeness (Original Recipe)":** does absolutely nothing. Sits in your inventory forever. Perfect.
- He becomes a **recurring friendly NPC** whose Theories *evolve* each festival (running gag) — see barks.

---

## Ambient Barks
*(Cycle when you walk past him outside the quest — keeps him alive in the world.)*

- "432, baby. 432 forever."
- "Stay hydrated, brother. The lizards can't get you if you're hydrated. ...That's not the theory, that's just good advice."
- "Lookin' good. Your aura's only a *little* beige today."
- "You find your car yet? ...You won't. Love you, though."
- "I'd offer you a balloon but I don't trust the gas anymore. The vibe's free. The vibe's always free."
- "I sold my phone for a tapestry and I have never gotten a clearer signal."
- "I'm not in a cult. A cult would have snacks. We have a drum circle. Totally different. (beat) ...Do *you* have snacks?"

---

*Build note: this quest is a perfect vertical-slice showcase — it exercises the dialogue system, the rhythm mini-game engine, the meter UI, faction rep, and the Gift Lot, all in one self-contained encounter you can demo in two minutes.*


---

# Part 31 — Sample Quest — Breakthrough

# SHAKEDOWN — Sample Quest: "Breakthrough"
### The circle on the hill at sunset
*Companion to the design bible. A fully-built quest, in the spirit of the Conspiracy Circle sample. The substance is abstracted ("the medicine"); the sober/sitter path completes the quest just as fully.*

---

## Premise

A circle of wooks gathers on the **Overlook** — the highest hill above the festival — to catch the sunset and "go see what the medicine has to show them." Someone invites you up. What follows is the game's most sincere set-piece: a few real minutes of awe wrapped in a whole lot of affectionate nonsense, where **how you prepared and who you're with decides whether it's transcendent or a spiral** — and where sitting it out to hold space for others is its own kind of victory.

This is the game letting its guard down. Play it straight and gorgeous at the peak; let the satire breathe on either side of it.

---

## Setting & Atmosphere

- **The Overlook**, golden hour. The festival glitters in the basin below; bass rolls up faint and warm.
- A circle of mismatched blankets, a few totems planted in the dirt, someone's portable speaker playing downtempo.
- **The sunset is the clock.** The whole ceremony is timed to the sun touching the horizon — the peak lands *exactly* as it goes down. When the game wants to take your breath away, this is where it does it.

---

## The Cast (the circle)

| NPC | Their whole deal | Nameplate |
|---|---|---|
| **Cedar** | the self-appointed guide; speaks entirely in dispensary-poster wisdom; means *so* well | *Self-Proclaimed Shaman* |
| **Willow** | the nervous first-timer; this is a tender-care opportunity | *First-Timer* |
| **Moonbeam** | the giggler; communicates exclusively in delighted wheezing | *Spunion* |
| **Doc** | the quiet one who actually knows what he's doing; the real anchor | *The Trip-Sitter* |
| **(optional) Patches** | may wander up to "keep an eye on the kids"; gentle gravity | *Certified Head* |

The joke and the heart live side by side: Cedar's ridiculous, but Doc is genuinely wise, and Willow is genuinely scared.

---

## How the Quest Surfaces *(quest-discovery interlock)*

No quest marker. You **discover** it: overhear the circle inviting people near the Healing Village, get pulled in by a Familiar NPC, follow Moonbeam's giggling up the hill, or have Patches mention it ("some of the family's headin' up to the Overlook for the sunset, if that calls to you"). It only *surfaces* if you've got some Healing-Village or renegade rapport — the heads don't invite just anyone.

---

## Set & Setting — the prep that decides everything *(core interlock)*

The Substances doc's **Set & Setting** rule is the spine of this quest. Before the sun drops, the game quietly reads:
- **Set (internal):** your **Vibes**, your **Energy**, whether you're carrying unresolved stress (a recent bad event, a rivalry, low needs).
- **Setting (external):** the company (allies in the circle vs strangers), whether you're hydrated, whether you ate, whether you rushed up here frazzled or arrived calm.

**Good set & setting → the path to a breakthrough. Bad set & setting → the door to the Bad Trip.** The choices *leading up* to the moment matter more than the moment itself — that's the lesson, mechanized.

---

## Three Approaches *(the Hustle / PLUR / Chaos DNA)*

- **PLUR — Intention.** Settle in, hydrate, set an intention with the circle, be present for Willow. Stacks the deck toward transcendence and deep bonding.
- **Sober — Hold Space.** Decline the pipe and **become the circle's sitter.** You don't partake at all — you tend the fire, keep the water close, talk Willow down if she wobbles, watch over everyone. **Completes the quest fully**, earns the most Cred of any path, and is treated as the wisest choice, not the boring one.
- **Chaos — Send It.** Pile in unprepared, frazzled, too eager. Fast track to turbulence and possibly the Bad Trip — with a real reward only if you somehow ride it out.

---

## The Core Mechanic: **Surrender**

When you partake, the screen begins to bloom — geometry creeping in at the edges, audio folding over itself. A single prompt surfaces, over and over, gentler or harsher depending on your set & setting:

> *Hold on.* ⟷ *Let go.*

- **Clinging / fighting it** (panicked inputs, resisting) builds **Turbulence.** Too much Turbulence tips you into the **Bad Trip** event.
- **Letting go** (a calm, unhurried release — *stopping*, breathing, a single soft input) eases the Turbulence and opens the door.

It's the **"surrender, not fight"** wisdom from the Bad Trip doc, turned into the actual verb of the scene. The first-timer who white-knuckles struggles; the one who exhales breaks through. (Assist scaling: a forgiving window for newcomers, a tighter read for the experienced.)

---

## The Breakthrough Sequence

If you let go, the world **dissolves.** For ~90 seconds of real time:
- Color and geometry unfold into a wordless, on-rails place — vast, intricate, alive. The game goes fully abstract; the festival, your body, your name, all gone.
- Something is *there with you.* No dialogue — just presence, pattern, and a wordless exchange that feels like being shown something you can't keep.
- Then the long fall back — the hill, the blanket, your breath, the circle's faces — **as the sun touches the horizon.** You return to the exact moment it sets.

This is the showcase for the trippy rendering / Visual Builder tech: the one stretch of the game that looks like nothing else in it.

---

## Branches & Outcomes

| You did this | What happens |
|---|---|
| **Good set & setting + surrendered** | **The Breakthrough.** Transcendent. Full rewards + bonds. |
| **Rough set & setting, but rode the Turbulence** | a harder, messier journey; partial insight; you're shaken but okay |
| **Turbulence maxed** | flips into the **Bad Trip** crisis event — and whether anyone sits you depends on the goodwill you banked with the circle (Doc/Patches step in *if* you've been kind) |
| **Sober — held space** | you witness the others' journeys, talk Willow through her wobble, and close the circle as its quiet anchor |

---

## Rewards

**The Breakthrough (partook):**
- **"Hyperspace Cartography"** — a Visual Builder loop pack in the geometric/entity style, "brought back" from the other side. *(Creative unlock — your sets now carry a piece of this.)*
- **Equanimity** — a small permanent Wellness perk: a touch more Bad-Trip resistance, calmer under pressure.
- **Title unlocked:** *Saw The Other Side.*
- A **Memory** (photo-mode keepsake of the sunset circle) for the passport.
- Deep **Cred** with the Healing Village + lasting bonds with the circle (potential festie besties).

**Held Space (sober):**
- Major **Cred** (the most of any path) + the circle's permanent loyalty.
- Progress toward **The Trip-Sitter** title and a **Wellness** boost.
- You still get the **Memory** — and the quiet respect of everyone who came down safe because you were there.

**Willow's thread:** if you looked after her (sober or not), she becomes a recurring friend who later pays it forward — the kindness compounds across the game.

---

## Dialogue Bank (a taste — satire and sincerity, shoulder to shoulder)

**Cedar (Self-Proclaimed Shaman):**
- "We're not *taking* anything, family. We're *receiving*. Big difference."
- "The medicine doesn't give you what you want. It gives you what you... *(long pause)* ...yeah."
- "I've sat with this maybe forty times. Forty-*one* after tonight. Each one's a teacher."

**Willow (First-Timer), nervous:**
- "Is it — is it supposed to feel scary before? Or am I doing it wrong?"
- *[if you reassure her]* "Okay. Okay. I'm glad you're up here."

**Moonbeam (Spunion):**
- *(wheezing)* "Bro. *Bro.* The grass is so... it's so grass."
- *(much later, profound)* "...we're just the universe checking its own reflection." *(immediately giggling again)*

**Doc (The Trip-Sitter), low and steady:**
- "Nobody's gotta do anything they don't want to up here. Sitting's sacred too."
- "Water's right here. I'm right here. Go where you need to go."

**The comedown (everyone, as stars come out):**
- Cedar, quietly, for once with nothing to prove: "...I don't have a poster line for that one."
- Willow: "I think I get why you all keep coming back."

---

## Tone Note

This quest only works if it's **sincere at the peak and silly at the edges.** Mock Cedar's posters, never the experience itself. Make the sunset genuinely beautiful. Keep the substance abstracted and the **sober path honored as the wisest seat in the circle.** Done right, it's the moment players screenshot and remember — the game's whole thesis (connection, care, awe, and a little ridiculousness) in one hill at sundown.

---

## Interlocks
- **Substances / Set & Setting** — the prep system is the spine; this is its showcase.
- **The Bad Trip** — the failure branch *is* that event, gated by the goodwill you banked.
- **Care-as-gameplay** — the sitter path is the highest-Cred route.
- **Visual Builder** — the breakthrough hands you a real creative reward.
- **Status & Titles** — *Saw The Other Side* / *The Trip-Sitter*.
- **Quest discovery** — surfaces diegetically, gated by rapport.
- **Relationships** — Willow becomes a lasting bond; the circle becomes family.
- **Wellness skill tree** — Equanimity feeds the Anchor capstone path.


---

# Part 32 — Sample Quest — The Master's Set

# SHAKEDOWN — The Master's Set (the legendary-artist capstone)
### A reverent late-game pilgrimage + live-set payoff — and how to cast Dave Tipper into it for real
*Companion to the design bible.*

---

## The Idea

Somewhere deep in the game, a **mythic apex artist** — rarely seen, almost a rumor — plays a **secret sunrise set** once in a great while. He's the living embodiment of **The Sculptor**, the north star every serious head reveres. A late-game quest earns you the right to **witness it live** — the game's most sincere, spiritual spectacle, and the moment that lights the fuse on your *own* ascension. Seeing the master play is what sets you on the path to becoming one.

---

## The Honest Part First — a real artist needs a real license

Dave Tipper is a **real, living, beloved artist** — and he's *already* this game's apex reference (the bible literally defines the Sculptor as "Tipper-tier sound design"). To feature him **literally** — his name, his likeness, his music in that set — you need his **permission**: right-of-publicity clearance for name/likeness, plus **sync/master licenses** for any actual track. That's a real deal, and it's his call, not something you can just drop in.

**The buildable path (same model as the music ecosystem and vendor partnerships):**
1. **Build a respectful *fictional* legend now** — a homage figure, zero IP risk, ships free. The game already worships "Tipper-tier" sound, so the slot is honest and ready.
2. **Design the role so the real artist can be dropped in later** — name, likeness, and one licensed track swapped into a pre-built reverent set-piece.
3. **As the game grows into a genuine love letter to his scene, approach Tipper / his team** about an official cameo + a licensed track for that one sacred set. Given how on-theme it is, it's a *plausible* partnership down the line — but earned, not assumed. Until then, the homage carries it.

---

## The Fictional Legend (what you build now)

A reclusive sound-design god — the in-world embodiment of the Sculptor. Rarely appears; an impossibly detailed, water-clean sound; revered by every real head. Give him a handle that's an homage without being the man himself (placeholder: **"Drip"** — or simply *the Sculptor*; pick the name later).

**Played completely straight.** The culture gets lovingly roasted everywhere else in the game — but **the master does not.** This is the one figure treated with pure reverence, the way the Breakthrough quest goes sincere at its peak. He's the mountaintop.

---

## The Quest — "The Master's Set" (a pilgrimage)

A capstone, gated *late*:
- **The rumor:** word ripples through the heads that the legend is doing a rare secret sunrise set.
- **Earn your place:** you can't just show up. You prove you're a **real head** — deep taste (far up the Taste Ladder), dues paid, and an invite **vouched** by the inner circle (Healing Village / the underground / Patches / Certified-Head-adjacent standing). The fiction: you can only *find* — and truly *hear* — the master once your own ears are ready.
- **The journey:** decode the secret location via the underground whisper network (the same drop mechanic as the Ringleader path), carry a token or pass a small trial, and make the trek out in the dark.

---

## The Payoff — You Witness the Set Live

The reward is the **cutscene/awe-moment**: the master at work at sunrise, the crowd in hushed reverence, the visuals blooming, the sound *perfect*. The game's most sincere spectacle — no satire, just awe (the Breakthrough peak's spiritual cousin).

- **Mechanical reward:** it **unlocks/ignites your own apex** — the final rung toward the Sculptor, a signature-sound unlock, a sound-design boost. A torch-passing.
- **A Memory** for the passport — a night you carry the rest of the game.
- **Identity:** witnessing it can be a soft prerequisite to *completing* your own Sculptor path — you have to have seen the mountaintop to climb it.

---

## Tone
Sincere, spiritual, reverent. The earn-it gating is what makes it *land* — by the time you're allowed in, you've become someone who can appreciate it. This is the moment the game stops winking and just lets the music be holy for a few minutes.

---

## Interlocks
- **The Sculptor / Taste Ladder** — the apex this whole thing embodies; the quest feeds your own climb.
- **The Music Ecosystem** — the licensing/partnership path for casting the real artist.
- **The Ringleader** — the secret-location drop mechanic.
- **Certified Head / factions** — earning the vouch and the invite.
- **Breakthrough** — the sincere-awe tone template.
- **Patches** — a fitting herald (the elder who tells you the master's coming, and maybe vouches you in).
- **Passport** — the Memory of the set.


---

# Part 33 — Getting Into the Nitrous Game

# SHAKEDOWN — Getting Into the Nitrous Game
### How you get the tank, the rogue insider who sells it to you, and the war it starts
*Companion to the design bible. Satirical/abstracted, like all the substance content — the "Nitrous Mafia" is mob-comedy lot satire, not a how-to.*

---

## The Short Answer

**Yes — back-dooring the tank through a rogue Nitrous Mafia member is the best primary route.** It's relationship-driven, dramatically loaded, and it organically lights the fuse on the entire Vinny rivalry. The tank isn't a purchase; it's a *betrayal you bought into.* (Two alt routes exist for other playstyles — below.)

---

## Why the Back-Door Deal Is the Right Hook
- It ties acquisition to a **character**, not a shop — consistent with the whole game running on relationships.
- It bakes in **stakes from the first second:** the product is skimmed from the Mafia's *own* supply, so the moment you sell, you're competing with Vinny **using his own gas.** That's the powder keg.
- It makes the seller a **recurring asset *and* liability** — your supply line and your biggest exposure.
- It's the natural **inciting incident** for the Vinny rival arc already in the roster.

---

## The Insider — "Whip" *(new character)*

A twitchy, greedy **mid-level Nitrous Mafia guy** — tired of Vinny taking the lion's share, skimming product to move on the side. Nervous, in over his head, always glancing over his shoulder. He **approaches you** once you've shown you're a real hustler (or you stumble onto his side operation). He'll sell you a **huge scuba tank + an off-the-books refill hookup** — for a price that's a genuine **capital investment.**

- **Nameplate options:** *Nitrous Mafia (Allegedly)* · *Vinny's Guy* · *Skimmer.*
- **Vibe:** your sketchy plug who's one bad day from disaster. You like him; you also can't fully trust him.

---

## Three Ways to Get a Tank *(the Hustle / PLUR / Chaos DNA)*

1. **The Back-Door Deal — *signature, relationship route.*** Buy from Whip. Medium cost, medium risk; introduces the insider thread and sets up the rivalry. The intended "in."
2. **Legit Sourcing — *Hustle route.*** Bring a tank in from **off-site** via your van/the Tour (a legit gas/welding-supply connection). More money up front and no insider entanglement at acquisition — **but the second you sell on their turf, the Mafia notices anyway.** The "I did it clean and they *still* came for me" path.
3. **The Heist — *Chaos/Streetwise route.*** Just **steal** a tank straight from the Mafia (ties to the existing "skim the Nitrous Mafia / steal a rig" Streetwise toolkit). No cost, **instant war, maximum heat.** For the player who wants the conflict *now.*

---

## Whip as Asset + Liability (the ticking clock)

Your **refills come through Whip**, so he's your lifeline — and your fault line:
- If **Vinny discovers the leak**, Whip is in real danger and your **supply dries up** (or worse).
- Whip might get **squeezed, flip, or rat you out** to save his own skin.
- You get choices: **protect him**, cut him loose, lean on him harder, or get burned. He's a relationship with consequences, not a vending machine.

---

## What It Triggers — the Vinny Rival Arc

Selling nitrous against the Mafia drops you straight into Vinny's **rival branch** (from the roster's worked arc):
**cold war** (won't deal, undercuts you) → **intimidation** (goons at your booth, a sabotaged tank, a last warning) → **showdown** (back down / out-compete and take the corner / broker a truce). The back-door deal is **beat zero** of that whole storyline.

---

## The Discovery & the Brawl — *when*, not *if*

The question isn't whether Vinny finds out — **it's when, and how bad.** You're selling skimmed gas on his turf; discovery is baked into the premise. The trick is making the *timing and severity* the player's to influence, so it never feels like a forced fuck-up **or** an unearned scripted beat.

- ❌ **Forcing you to slip up** feels cheap — players resent a mistake the game made *for* them.
- ❌ **Pure auto-script** ("first re-up = caught, period") railroads it.
- ✅ **A "when, not if" suspicion meter** — inevitable, but *paced by your choices.*

**The Heat-with-Vinny meter (a Buzzkill cousin):**
- **Spikes it:** selling aggressively, **undercutting him in the open**, dealing near his turf, high volume, and **every re-up with Whip** (each refill widens the leak in his own supply).
- **Buys time:** discretion, modest volume, selling on the margins, paying for cover. Slows it — *never stops it.*
- **Telegraphed** (per the game's DNA): warning signs before the boil — a guy clocking your booth, **Whip getting jumpy** ("Vinny's been askin' questions, man"), a cold nod from a Mafia member.

**The re-up as heartbeat:** your **first re-up** is the natural **warning shot** — that's where the first sign drops, *not* the full brawl. Keep pushing and the meter climbs to the **boiling point**, where it erupts.

**The Brawl — and the call that saves you *(the Ringleader payoff)*:** when it boils over, the Mafia comes for you — and this is where **your phone full of connections pays off.** You call up the allies you've built (muscle, your crew, friends who owe you) to back you in the scrap, talk it down, or cover your escape. **Build relationships and they show up; play the loner and you face the Mafia alone** — same logic as the Bad Trip's trip-sitter. *Your social web is your survival.* And **severity scales:** a careful, well-connected player gets a manageable dust-up; a reckless, friendless one gets a disaster (degrees of failure, not binary).

**The heist route changes everything:** if you *stole* the tank (the Chaos route), there's **no slow burn — Vinny knows from the jump.** You skip the suspicion meter and go straight to **open war.** Faster, cleaner, far more dangerous — the impatient player's path.

This keeps your agency intact (you set the pace and how ready you are), guarantees the dramatic beat (it *will* come), and turns the showdown into a referendum on how well you've treated the people around you.

---

## Economics & Risk
- A huge tank is a **major capital sink** that becomes a **big, steady faucet** (volume balloon sales — the high-risk, high-reward end of the hustle economy).
- You can **undercut the Mafia** and spark a **price war** (dynamic pricing).
- But it carries **constant Buzzkill heat** (nitrous is high-exposure) **plus the rivalry tax.** Big money, big target.
- **Upgradeable:** a bigger tank, a better fill setup, a discreet rig to dodge heat.

---

## Interlocks
- **Vinny / Nitrous Mafia arc** — this is its inciting incident.
- **The balloon hustle** — the tank supercharges it.
- **Streetwise** — the heist route + Whip's betrayal web.
- **Buzzkill heat** — nitrous runs hot.
- **Dynamic pricing** — undercutting and price wars.
- **The Tour / van** — the legit off-site sourcing route.
- **NPC reactions & contacts** — Whip is a relationship with an arc of his own.


---

# Part 34 — Buck (the Naked Guy)

# SHAKEDOWN — Buck (the Naked Guy): Character & Quest Concepts
### Character sketch + five parked quest ideas to choose from later
*Companion to the design bible. All quests below are **concepts — not yet selected.** Captured for a later decision.*

---

## The Character: Buck

- **Who:** the festival's beloved naked guy — a serene, blissed-out free spirit and permanent lot fixture.
- **The name:** everyone calls him **Buck** (buck naked). His government name, known to exactly one person and never volunteered, is **Gerald — a former actuary** who came to one festival eight years ago and simply never put the clothes back on.
- **Vibe:** the single most at-peace human on the grounds. Unbothered, gentle, gracious. **Never a creep** — the comedy is always the *situation* and his serene obliviousness, never anything leering. He's a wholesome icon.
- **Nameplate:** could read *Free Spirit*, or just *Buck*.
- **Recurring fixture:** turns up around the lot in escalating situations; a running visual gag that can bloom into any of the quests below.

---

## ⭐ Canon — Buck's debut is the game's FIRST quest

Buck **streaks past — naked, screaming, arms flailing — during Patches' tutorial welcome**, and chasing him *is* the opening tour of the festival ("**Bare Witness**" — see the NPCs: Onboarding doc). It teaches movement, the zones, interaction, the quest log, and a first hydration lesson, then pays off with Buck serene at the river having forgotten he was ever running. *The first thing you do in SHAKEDOWN is chase a screaming naked man into a sunrise.* The five concepts below remain parked for later.

---

## Parked Quest Concepts *(decide later)*

### 1. The Great Pants Hunt 📋
Buck has lost his clothes — not that he *wants* them back, but security's circling. Retrace his blissed-out wanderings to recover each item from somewhere absurd (a shoe atop a totem, his shirt now flying as a crew's flag, his pants bartered to a vendor for a single grape). **Punchline:** you present the bundle and he gratefully declines to wear any of it.
- *Interlocks:* fetch/exploration, Buzzkill heat, lot comedy.

### 2. Decency Patrol (vs. the Buzzkills) 📋
Officer Dan is on a mission to cite him. Keep Buck **covered and mobile** on a timer — improvising a strategically-placed festival sign, a barrel, body paint that "legally counts as clothes" — while dodging security.
- **Three paths:** PLUR (gently talk him into a sarong) · Hustle (sell him an overpriced "ceremonial kilt") · Chaos (make your *own* distraction to pull heat off — spikes your Buzzkill meter).
- *Interlocks:* the Buzzkill/heat system, stealth/timing, Officer Dan.

### 3. The Emperor's New Wisdom 📋  *(the fool-as-sage swerve)*
Buck is secretly the most enlightened person at the festival, and another quest needs his insight. To earn it you must meet him on his level — shed your **status** (and maybe your inhibitions) and just *be* with him. He drops genuine koans, completely naked and unbothered. Pairs absurd with sincere, like the Breakthrough quest.
- **Reward:** a *Free Spirit* perk + real guidance.
- *Interlocks:* status/titles (shedding status), Wellness, the sincere-amid-satire tone.

### 4. Buck Goes Viral 📋
A (tastefully censored) photo of Buck blows up on **Radiate**. Now he's mobbed for selfies and hating it — he just wants to vibe. **Help him escape the clout**, or go full Hustle and become his **manager**: Buck merch, a censored-silhouette **pin**, a brand he's profoundly indifferent to.
- *Interlocks:* Radiate / Festival Famous, pins & merch, influencer-culture satire.

### 5. Buck's Sunburn (a care quest) 📋
Practical comedy meets **care-as-gameplay**: Buck is getting catastrophically sunburned in unfortunate places. Get sunscreen on him, hydrate him, and find him shade — straight into the **hydration system** — without it getting weird.
- **Reward:** deep Cred + his eternal loyalty.
- *Interlocks:* needs/hydration, caretaking, the wholesome-Cred path.

---

*Tone guardrail for all five: Buck is a gentle, beloved fixture. The joke is the absurd situation and his unflappable serenity — never anything leering. Keep it warm.*


---

# Part 35 — Tech & Build Pipeline

# SHAKEDOWN — Tech & Build Pipeline
*Companion to the design bible. The engine, who builds it, the asset pipeline, cutscenes, NPC architecture, and the cost model — updated with fact-checked mid-2026 tooling research. (Tools here move fast; verify specifics before committing.)*

---

## The Honest Headline

**Nobody — with or without AI — gets an open-world game close to push-button right now.** AI is a force multiplier on a real dev effort, not the dev team. It's a **supervised assistant** that proposes steps and stops for approval; "fire-and-forget a stack of markdown and walk away to a finished game" is not real. The proven ceiling for a *finished, steered* artifact with this tooling is a **prototype/slice**, not a shipped open world.

So the skill that matters most isn't knowing Unreal's node graphs — the agent handles that. It's **steering** (catching when output is subtly wrong), **owning the asset pipeline**, and **scope discipline.** Scope is the single dial that closes the gap between "open-world AAA" and "finishable solo-with-AI."

---

## 1. The Engine
- **Unreal Engine 5** — the foundation. Closest to GTA/RDR2-tier fidelity out of the box (Nanite, Lumen, path tracing, World Partition streaming), free until you clear a revenue threshold, and where the AI-NPC and neural-rendering plugins live.
- **Browser / Three.js** — where AI one-shot tools natively output; great for *prototyping the loop* fast and cheap, not for the final photoreal-ish world. (Prototype here, rebuild in UE5 — the code is throwaway, the design/community carry over.)

## 2. Who Builds It — the Claude Code Stack

The agent drives Unreal through **local MCP servers**, which means the hub is **Claude Code (in a terminal beside the engine), NOT Cowork.**

| Tool | Role | Cost |
|---|---|---|
| **Claude Code** | the hub that holds all local MCP servers (Unreal + Blender + fal) | your Claude sub/API |
| **VibeUE** | MIT plugin exposing UE5's editor to the agent — Blueprints, Python, landscape, foliage, materials, Niagara | free |
| **UnrealClaude** | viewport screenshots + actor manipulation, so the agent can *see* what it built | free |
| **UE 5.8 native MCP** | Epic's own (June 17 2026) — props, PCG, lighting, Blueprints from terminal (docs still incomplete) | free |

**Claude Code vs. Cowork — important:** Cowork only supports **remote** connectors from Anthropic's cloud, so it **can't cleanly attach the local Unreal/Blender MCP servers.** Cowork's real lane is the **knowledge work** — organizing this design bible, planning, asset bookkeeping. (Which is exactly what it's been doing here.) Drive the *engine* with Claude Code; manage the *project* with Cowork.

**What the agent does NOT do:** generate your 3D assets. It wires logic and orchestrates the editor. The content comes from the pipeline below — and that's the part people underestimate.

## 3. The Asset Pipeline (the underestimated part)

**3D props & characters — AI is genuinely useful here, with cleanup.**
- **Meshy / Tripo / Rodin / Hunyuan** turn text or images into textured 3D models in ~a minute, with low-poly modes and direct UE5 export; Tripo even rigs characters.
- **Reality check:** AI is a force multiplier for *quantity* (background population — hundreds of props), but a liability for **hero assets** — it tends to give you only the LOD0 mesh and can produce "gameslop" that looks fine at distance but breaks under a 4K camera. **Background: AI. Hero assets (Patches, the player, key items): human cleanup/hand-work.**
- *SHAKEDOWN fit:* the festival is **prop-dense** (booths, tents, rigs, totems, art cars, vendor wares) — squarely the AI sweet spot. The *crowd* is the **procedural NPC system** (modular parts library), not per-asset modeling.

**Textures.**
- **Poly Haven via Blender MCP** — free, game-ready tiling PBR materials. The best *default* for standard textures.
- **fal.ai** — 1,000+ models via hosted MCP (bearer token in Claude Code); use for **bespoke/stylized** textures, 3D, and upscaling. Raw image-gen isn't a seamless PBR set on its own, so Poly Haven wins for the standard library.

**Landscapes — do NOT generate as Blender meshes.**
- The festival grounds and the biome Tour belong in **UE5's native Landscape system** (heightmaps, World Partition streaming, LOD, layer/foliage painting), optionally fed by **Gaea / World Machine** heightmaps. A big imported terrain mesh throws away streaming and LODs and wrecks open-world performance.

**Blender MCP** ties it together: local server driving Blender's Python (objects, materials, lighting, Poly Haven downloads, Rodin gen) for cleanup/export — a rapid-prototyping aid, not an artist replacement. Runs in Claude Code (local server, same as Unreal).

## 4. Cutscenes

- **Sequencer (UE5's in-engine cinematic editor) — the default.** Real-time, uses your actual assets, can reflect player state (your character, time of day, who's in your crew), near-zero storage. Use for anything that must match the game or react to the player.
- **Movie Render Queue** — pre-render a Sequencer scene to high-fidelity video for a rare showpiece (e.g., a polished intro).
- **Higgsfield** — *stylized* pre-rendered cutscenes (intros, flashbacks, dream/lore), **previs** (block camera/timing cheap before building in Sequencer), and **trailers**. Lean into a deliberately different art style so the gap reads as intentional.

*Routing our designed cutscenes:* **Buck's intro chase** → in-engine/Sequencer (it's gameplay + player-reflective). **Breakthrough's hyperspace** → great fit for **stylized pre-rendered** (it's abstract, no asset-match needed). **The Master's Set** → real-time Sequencer (it shows your character + the crowd in reverence). When in doubt, **previs in Higgsfield, build in Sequencer.**

## 5. Higgsfield — what it's actually for *(corrected)*

Higgsfield is a **2D image/video** platform (Cinema Studio 3.x: optical camera control, deterministic camera moves, Soul Cast character consistency, Sora 2 / Veo 3.1 / Kling, 4K images, ~15s clips; "3D Mode" is Gaussian-splatting camera framing, **not** an asset exporter). Its output is **rendered video, not engine-ready 3D.**

So — refining our earlier take — Higgsfield is the **cinematic/marketing/previs layer**, not the source of in-game 3D assets. The actual in-game assets come from the §3 pipeline (Meshy/Tripo/Rodin + Poly Haven + fal). AI-generated assets *do* become your real-time look — just from those tools, not from Higgsfield. Two persistent limits: it can't match your exact in-engine characters, and identity drifts shot-to-shot (put a face only in the first shot). Pricing is credit-based (~$15 / $39 / $99 tiers) and **video burns credits fast** — iterate at low res, render finals only.

## 6. NPC AI — minds without per-play cost

**Default: systemic AI (free, reliable).** RDR2/GTA/Sims "aliveness" = schedules, needs, perception, memory, reaction rules. Deterministic, runs on any hardware, **zero runtime cost.** Even GTA VI reportedly uses enhanced systemic NPCs, not full generative LLMs. This already powers our reaction states, NPC arcs, and authored content (the Conspiracy Circle feels alive for free).

**For open-ended generative chat: go local, not cloud.**
- **Cloud LLM APIs** = per-token cost *forever* → avoid for a shipped friend game.
- **On-device SLMs** (NVIDIA ACE UE5 plugins; Qwen3-8B, Nemotron Nano; shipping in PUBG's "Ally," etc.) = run on the player's GPU → **no per-play cost to you.** Tradeoffs: needs a capable GPU, install size, lower quality than cloud.

**Architecture:** systemic backbone for *all* NPCs (free) + an *optional* local SLM bolted onto a few special characters for open-ended conversation.

## 7. Real-Time AI Graphics
1. **AI-generated assets** rendered by the engine — **free at runtime** (baked in). The realistic core of the "AI look."
2. **Neural rendering** (NVIDIA DLSS 5-style, fall 2026) — AI upscaling/enhancement on the *player's* GPU; no cost to you.
3. **Fully generative "every-frame" engines** — real but bleeding-edge; temporal-consistency, control, and per-frame GPU-cost walls. Not the core renderer yet.

A gorgeous **stylized** festival look is achievable today; literal photoreal GTA/RDR2 fidelity still leans on huge human pipelines that asset-gen assists but doesn't replace. **Stylized is the smart target.**

## 8. The Cost Model

| Cost | When | Who pays |
|---|---|---|
| Claude Code (the build agent) | build time | you (dev cost) |
| AI 3D gen (Meshy/Tripo/Rodin), fal.ai | build time | you (per generation) |
| Higgsfield (cutscenes/previs/trailer) | build time | you (credits) |
| VibeUE · UnrealClaude · UE5.8 MCP · Blender MCP · Poly Haven · UE5 | — | **free** |
| In-game AI-generated assets | runtime | **nobody** (baked in) |
| Neural rendering (DLSS 5) | runtime | nobody (player GPU) |
| Systemic-AI NPCs | runtime | **nobody** |
| On-device SLM NPCs | runtime | nobody (player GPU) |
| Cloud-LLM NPCs | runtime | **you, per play** ← avoid |

**Net:** build with AI tooling (a development expense), ship a game that costs **nothing per play** — as long as NPCs use systemic/local AI, not cloud calls.

## 9. Build Order (scope is the lever)

The fact-checked research strongly endorses **slice-first** — exactly our plan:
1. **Prototype the loop** fast (browser/coding-model is fine) — prove the mixing engine + core loop are *fun.*
2. **Rebuild the vertical slice in UE5** — Shakedown Street + Renegade Woods + the Conspiracy Circle + Buck's intro — via Claude Code + the asset pipeline.
3. **Faction/rep + 3 signature quests.**
4. **Trailer (Higgsfield) → wishlist & community → decide full scope.**
5. **Ship the slice, prove the loop, then expand** — one festival at a time (per the World Structure doc), each a biome + local-content layer on the shared systems, *not* a rebuilt game.

Build the small finishable thing first; learn exactly where the tools help and where they stall; scale up with judgment instead of hope.


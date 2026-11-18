# The path to the food truck

Agreed with Seth on 18 Nov 2026. The bible gives the food vendor one line: "one griddle → a popular booth → a food empire / fleet of trucks". This is that line worked out as six steps, each of which changes how you play. Nothing here is built yet.

## The six steps

| Step | What you have | Cost | What changes in play |
|---|---|---|---|
| 1. Walking vendor | A bag of sandwiches, a $12 day permit | Built | You chase customers one at a time |
| 2. Camp kitchen | Griddle, four garden plots, a hand-painted sign | Gear you already buy | Customers walk up to your camp and order a particular sandwich. Moonbeam can be hired |
| 3. Table on the Street | A folding table and a rented pitch on Shakedown Street | $150 table, $30 a day | A queue forms at the lunch and dinner rushes. Two-item menu, cooked to order |
| 4. Booth | A permanent stall with your name on it | $1,500 | Four-item menu, one helper, regulars, a signature dish, a health inspector |
| 5. Food truck | A van with a serving hatch cut into it | $2,000 van + $3,000 conversion | It moves. You park where the crowd is. Two helpers |
| 6. Fleet | A second truck run by staff | Later | The bible's "Lot Baron". Out of scope for the prototype |

## What makes it a game

- **Orders.** Customers ask for a specific sandwich, so the menu depends on what your garden and foraging produce.
- **Following the crowd.** People move on a timetable (`game/data/crowd.json`), so where you set up each hour matters. This is the truck's whole advantage.
- **Reputation.** Each stand has a star rating from speed and quality. More stars bring more walk-ups and let you charge more.
- **A rival.** The Grilled Cheese stall already on Shakedown Street competes once you rent a pitch near it.
- **Trouble.** A health inspector (pass, or bribe with grilled cheese), and Vinny noticing if balloons go out of the hatch.
- **You cook at steps 2 and 3.** From the booth on, helpers cook and you run the menu, the stock and the location.

## Staff are paid a wage

Seth's call: helpers take a wage, not a share of the takings.

| Who | Where | Wage per game day |
|---|---|---|
| Moonbeam | Camp kitchen (front of house or garden, one job a day) | $35 |
| A second hand (someone you healed) | Camp kitchen, the other job | $45 |
| Booth hand | The booth window | $60 |
| Truck cook and truck window | The food truck | $80 each |

- **Paid every morning** from your pocket or stash, before they start.
- **Miss a day** and they do not work that day. **Miss two in a row** and they quit until you pay what you owe and make it right with a gift.
- **A wage is a risk you carry.** On a rained-out day the helper still costs $35 to $80, where a share would have cost nothing. That is the point: hiring is a bet on your own stand.
- **Why these numbers.** A helper has to bring in clearly more than they cost. In the test runs below, one well-equipped person selling on foot nets $120 to $240 a game day. A helper selling from your stash at a slower rate should gross about $100 to $150 a day, so $35 to $45 leaves a real margin without being free money.

## How the van conversion works

The van is car level 6 on the car ladder (`camp-upgrade-map.md`, section 1). It has one interior, and you decide what goes in it.

| | Camper build | Kitchen build |
|---|---|---|
| Cost on top of the $2,000 van | Three salvage projects (roof deck, insulation, fold-out counter) | $3,000 serving hatch, then three projects |
| Sleeping | The best bed in the game | You sleep in your tent, so tent upgrades still matter |
| Storage | 12 lockable slots, raid-proof | Ingredients and cooked food only |
| What it is for | Comfort, safety, the road to the RV | Income: a stand that moves |

**The kitchen projects**, done one at a time after the hatch:

1. **Flat-top:** cooks four sandwiches at once.
2. **Fridge:** stock keeps overnight, and you can sell cold drinks from the window.
3. **Second window:** two queues, which is what makes the second helper worth paying.

**Where it can park.** Moving takes about ten game minutes, so you pick a spot for each rush, not each customer.

| Pitch | Fee | Best time |
|---|---|---|
| Campgrounds crossroads | Free | Mornings, when people wake up hungry |
| Shakedown Street | $30 a day | Lunch and dinner rushes |
| Main Stage field edge | $60 a day (festival vendor pass) | 8 PM to midnight, the biggest crowd of the day |
| Healing Village gate | The Elder's trust, no fee | Quiet daytime trade; no balloons, ever |
| Parking Lot | Free | After 3 AM, when the after-party spills out |

**The choice is not a trap.** You can strip one build and fit the other for $500 and a game day. You lose the projects you built, not the van.

**How the fork ends.** The RV ($12,000) is a second vehicle, not a third van level:

- A **camper** owner trades the van in for $2,000 off the RV. They reach the RV sooner in comfort, but with no stand earning for them.
- A **truck** owner keeps the truck and buys the RV on top. On the Tour a helper drives the truck behind you, so the food path has its own reason to tour.

## What a test player earns, and what that means for prices

Seth asked for the prices to be checked against real play. `game/dev/bot.js` is a test player that plays the actual game rules at high speed: it buys bread and cheese, cooks, walks up to people and offers, buys a day permit, drinks, showers and sleeps. One full festival each, Thursday 4 PM to Monday noon:

| Gear | Pace | Sandwiches sold | Net for the festival | Net per real hour of play |
|---|---|---|---|---|
| Starting gear | Walking | 82 | $56 | $80 |
| Starting gear | Brisk (some sprinting) | 106 | $142 | $216 |
| Two burners, bigger bag | Walking | 178 | $224 | $294 |
| Two burners, bigger bag | Brisk | 218 | $488 | $709 |
| Griddle, big bag, serving tray | Walking | 274 | $466 | $608 |
| Griddle, big bag, serving tray | Brisk | 399 | $910 | $1,288 |

**How far to trust this.** Each row is one run, so the figures carry luck. The bot is a plain player: it never gardens (fillings add $1 to $5 a sandwich), never tows the cooler, never sells balloons, does no quests, and buys no upgrades during the run. The brisk pace does not pay the energy cost of sprinting. A good human with a garden should beat the bottom rows; Seth's own report (over $450 after a couple of hours, after buying gear and being robbed) sits between the middle rows.

**Three things the runs show.**

1. **One festival is short.** Thursday to Monday is about 45 minutes of active play once sleep is skipped. Even the best row nets under $1,000 in that time.
2. **Gear matters more than anything.** The same pace earns about six times more with the griddle, big bag and tray than with starting gear.
3. **Half the time is walking.** Walking is 46 to 65 percent of every run. That is exactly what a table, a booth and a truck remove, which is why each step up should be worth a lot.

**Pricing rule.** Each big purchase should take about two real hours at the income of the step before it.

| Step | Expected income per real hour | Price | Hours to afford from the step before |
|---|---|---|---|
| Walking, fully equipped, with a garden | about $750 | | |
| Camp kitchen with Moonbeam | about $1,000 | Gear only | |
| Table on the Street | about $1,300 | $150 + $30 a day | Under half an hour: a cheap first taste |
| Booth | about $2,000 | $1,500 | About 1.2 |
| Food truck | about $3,500 | $5,000 with the van | About 2.5 |
| RV | | $12,000 | About 3.5 |

The prices already agreed hold up against this rule, so they stay. The income column is a target for the stands, not a measurement: nothing above walking exists yet. When a stand is built, run the bot on it and adjust the stand, not the price.

## After Monday: the festival never ends (Seth, 18 Nov 2026)

One festival weekend is about 45 minutes of play, and nothing costing more than about $1,000 can be earned inside one. Seth's answer: the days just keep flowing. This festival goes on for ever, which is also what lets it be the home base you come back to from the Tour. In the prototype the week now comes round again, and the Monday-noon report is a recap of your first weekend, not an ending. The week has a shape: festival Thursday to Sunday, exodus on Monday, a quiet Tuesday, arrivals and a pre-party on Wednesday (see `decisions.md`). Quiet days are for crew shifts, the Free Pile, the garden and stocking up; stands earn on festival days.

## Build order

1. Orders and the camp kitchen with Moonbeam on a wage (step 2). **First version built 18 Nov 2026**; still to do: named-sandwich orders, the star rating, a second helper, and a test-player run to tune it toward its income target.
2. The table and pitch on the Street, with queues and the star rating (step 3).
3. The booth, the rival stall and the health inspector (step 4).
4. The car ladder up to the van, then the kitchen build and the pitches (step 5).

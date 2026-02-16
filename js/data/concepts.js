// Poker Concepts & Theory Content

export const CONCEPT_CATEGORIES = [
    {
        id: 'fundamentals',
        title: 'Fundamentals',
        icon: '🎯'
    },
    {
        id: 'preflop',
        title: 'Preflop Theory',
        icon: '🃏'
    },
    {
        id: 'postflop',
        title: 'Postflop Theory',
        icon: '🎲'
    },
    {
        id: 'advanced',
        title: 'Advanced Concepts',
        icon: '🧠'
    }
];

export const CONCEPTS = {
    fundamentals: [
        {
            id: 'position',
            title: 'Position Explained',
            content: `Position is your seat relative to the button. It determines who acts first and who acts last.

**Position order (6-max):**
- UTG (Under the Gun) - first to act preflop, toughest position
- HJ (Hijack)
- CO (Cutoff)
- BTN (Button) - last to act postflop (best position)
- SB (Small Blind)
- BB (Big Blind)

**In Position (IP) vs Out of Position (OOP):**
- IP means you act after your opponent on later streets (you get more information)
- OOP means you act first (you give information and must guess more)

**Why position changes your strategy:**
- You realize more equity IP (you can check behind and see free cards)
- You bluff more effectively IP (you can represent strong ranges and choose bet sizes)
- You value bet thinner IP (you control the final bet sizing and avoid check-raises)
- OOP you need stronger hands to put money in (harder to realize equity)

**Practical rules of thumb:**
- Open wider in later positions (CO/BTN) because you will play more pots IP
- Defend tighter OOP (especially SB) because you realize less equity
- Most postflop spots are easier IP; the same hand can be a bet IP but a check OOP

**Common mistakes:**
- Playing the same hand the same way IP and OOP
- Over-calling OOP with hands that look OK but realize poorly

**Drills (in this app):**
- Preflop Trainer: compare UTG vs BTN opening ranges
- Postflop Trainer: compare IP vs OOP c-bet decisions on the same textures`
        },
        {
            id: 'actions-and-sizing',
            title: 'Action Vocabulary + Bet Sizing Vocabulary',
            content: `Poker study gets much easier when the words mean the same thing every time.

**Core actions:**
- Fold: give up the hand
- Call: match a bet
- Check: bet 0 when allowed
- Bet: put money in when nobody has bet yet on this street
- Raise: increase the bet size after someone bets

**Common preflop terms:**
- Open / RFI: raise first in
- Limp: call the big blind preflop (usually avoided in 6-max cash)
- 3-bet: re-raise preflop
- 4-bet: re-raise the 3-bet
- Cold call: call a raise when you were not already in the pot
- Squeeze: 3-bet after an open and at least one caller

**Sizing language:**
- bb: big blinds (our trainers use bb)
- % pot: fraction of the pot (50% pot, 75% pot, etc.)
- Overbet: bet larger than the pot (for example 125% pot)

**Why sizing matters (high level):**
- Bigger bets create more fold equity but require stronger (more polarized) ranges
- Smaller bets let more hands continue and are used with more merged ranges

**Drills (in this app):**
- Preflop Trainer: practice open / 3-bet / 4-bet decisions
- Bet Sizing Trainer: practice selecting sizes that match the goal`
        },
        {
            id: 'pot-odds',
            title: 'Pot Odds and Equity',
            content: `Pot odds tell you the minimum equity you need to call.

**The core formula (break-even call):**
Required equity = Call Amount / (Pot After You Call)

If the pot is P and you must call C:
- You call C
- Final pot becomes P + C
- Break-even equity is C / (P + C)

**Example:**
Pot is 100bb, villain bets 50bb, so pot is now 150bb and you must call 50bb.
Required equity = 50 / 200 = 25%

**Quick mental shortcuts (most useful):**
- Call 1/4 pot: need ~17% equity
- Call 1/3 pot: need 20% equity
- Call 1/2 pot: need 25% equity
- Call 2/3 pot: need ~29% equity
- Call pot: need 33% equity
- Call 2x pot: need 40% equity

**Pot odds vs equity (what to compare):**
- Pot odds gives required equity
- Equity is your chance to win at showdown if all remaining cards were dealt

**Estimating equity quickly (outs + rule of 4 and 2):**
- Count your outs (cards that improve you to a likely-winning hand)
- With 2 cards to come (flop → river): equity ≈ outs × 4%
- With 1 card to come (turn → river): equity ≈ outs × 2%

Examples:
- Flush draw on flop: ~9 outs → ~36% with two cards to come
- Open-ended straight draw on flop: ~8 outs → ~32%
- Gutshot on flop: ~4 outs → ~16%

**Drills (in this app):**
- Pot Odds Trainer: practice required equity under different bet sizes
- Equity Calculator: estimate your equity on different boards

Next concepts:
- Implied Odds & Reverse Implied Odds
- Equity Realization (why raw equity != realized equity)
- Multiway Pot Odds Adjustments`
        },
        {
            id: 'implied-odds',
            title: 'Implied Odds and Reverse Implied Odds',
            content: `Implied odds = extra money you expect to win on later streets when you hit.

Pot odds only considers the current price. Implied odds considers future betting.

**When implied odds are good:**
- You have a strong draw to a *well-disguised* hand
- Stacks are deep (more money behind)
- Villain will pay you when you hit (they have strong top-pair type hands)

Examples (general):
- Calling with a pocket pair for set mining can be profitable when stacks are deep.
- Calling with a nut flush draw can be profitable even if you are slightly below direct pot-odds.

**Reverse implied odds:**
Reverse implied odds = you can hit and still lose a big pot.

Common reverse implied odds situations:
- Low flush draws (you make a flush but villain makes a higher flush)
- Weak top pair vs ranges that contain many better top pairs
- Straights on paired boards where full houses exist

**Practical rule:**
Prefer draws to the *nuts* and avoid dominated draws, especially OOP.

**Drills (in this app):**
- Equity Calculator: compare A-high flush draw vs low flush draw on the same flop
- Postflop Trainer: notice when weak draws become folds on big sizing`
        },
        {
            id: 'equity-realization',
            title: 'Equity Realization (Why 30% Equity Isn’t Always 30% Realized)',
            content: `Raw equity is your chance to win at showdown if all cards are dealt.

Realized equity is how much of that equity you *actually* get to convert into winning chips.

**Why equity realization changes:**
- Position: IP realizes more (you can check behind and take free cards)
- Bet sizing: big bets force folds and reduce realization for weak draws
- Hand type: suited/connected hands realize better than weak offsuit hands
- Domination: some “outs” are not clean (you improve but are still behind)

**Simple examples:**
- A gutshot OOP vs big bet often realizes poorly (you fold turns too often).
- A nut flush draw IP realizes well (you can call and win big when you hit).

**Practical consequence:**
When you’re deciding to call, don’t ask only “do I have enough equity?”
Ask also “can I realistically realize it from this position and against this sizing?”

**Drills (in this app):**
- Postflop Trainer: compare the same call IP vs OOP
- Pot Odds Trainer: connect bet size increases to lower realization thresholds`
        },
        {
            id: 'multiway-pot-odds',
            title: 'Multiway Pot Odds Adjustments',
            content: `Multiway pots change everything:
- There is more money in the pot (better direct pot odds)
- But your chance to win with a marginal hand is lower (someone often has something)

**Key changes in multiway pots:**
- You need stronger made hands (top pair becomes less valuable)
- Draws become more valuable (you can win a bigger pot when you hit)
- Bluffing becomes less effective (fold equity drops with multiple players)

**Pot odds vs implied odds multiway:**
- Direct pot odds are often better, but you must consider whether your hand can win vs multiple ranges.

**Common mistakes:**
- Calling multiway with weak top pairs because the price looks good
- Bluffing into two players (fold equity is much lower)

**Drills (in this app):**
- Pot Odds Trainer: practice required equity with larger pots
- Postflop Trainer: treat multiway as “need stronger value + fewer bluffs”`
        },
        {
            id: 'hand-rankings',
            title: 'Hand Rankings Refresher (Including “Board Plays”)',
            content: `Standard hand strength (best to worst):
1) Royal flush
2) Straight flush
3) Four of a kind
4) Full house
5) Flush
6) Straight
7) Three of a kind
8) Two pair
9) One pair
10) High card

**Important: the board can play.**
Sometimes the best 5-card hand uses only community cards.

Examples:
- Board: A♠ K♠ Q♠ J♠ T♠ → everyone has a royal flush (chop)
- Board: K♦ K♣ K♠ 7♥ 7♣ → everyone has a full house (KKK77)

**Practical consequence:**
When evaluating strength, always ask: “What is my *best 5-card hand*?”

**Drills (in this app):**
- Equity Calculator: test edge cases where the board plays
- Hand Replayer: pause on river and identify the best 5-card hand`
        },
        {
            id: 'equity-vs-range',
            title: 'Equity vs a Range (Not Just vs One Hand)',
            content: `Poker decisions are usually vs an opponent’s range, not a specific hand.

**Equity vs hand:**
Your chance to win against one exact hand.

**Equity vs range:**
Your chance to win averaged across all hands the opponent can have.

**Why this matters:**
- A hand can be crushing vs some combos and terrible vs others.
- The same top pair can be a value bet vs a wide range and a check vs a tight range.

**Practical approach:**
1) Estimate what villain’s range looks like given preflop + flop action.
2) Ask how your hand performs vs that entire range.
3) Choose the line with best EV (not the line that beats the strongest possible hand).

**Drills (in this app):**
- Equity Calculator: compare your hand equity vs different ranges
- Concepts → Ranges & Combos: practice blocker thinking for range construction`
        },
        {
            id: 'monte-carlo-variance',
            title: 'Monte Carlo Equity: Variance, Iterations, and Determinism',
            content: `Many equity calculators estimate equity by simulation (Monte Carlo).

**Key idea:**
- More iterations → more stable results
- Fewer iterations → more noise

**Why this matters for training apps:**
- If results change a lot from run to run, feedback can feel random.
- For “trainer grading,” we want consistent (deterministic) feedback whenever possible.

**Practical takeaway:**
Use simulated equity as a *tool for intuition*, not as a perfect truth.

**Drills (in this app):**
- Equity Calculator: run similar spots and observe how results stabilize with more trials
- Postflop Trainer: focus on EV direction (good vs bad) more than exact %`
        },
        {
            id: 'expected-value',
            title: 'Expected Value (EV)',
            content: `Expected Value (EV) is the long-run average profit of a decision.

**Core idea:**
- You will not win every hand
- But you can still make decisions that win money on average

**Simple EV formula (call decisions):**
EV = (Win% × Amount Won) - (Lose% × Amount Lost)

**Example:**
You call 50bb into a pot that will be 200bb after you call. Your equity is 40%.
- Win: 40% × 200bb = 80bb
- Lose: 60% × 50bb = 30bb
- EV = 80bb - 30bb = +50bb

**EV vs accuracy:**
- Poker is not about always being right
- It is about choosing the highest EV line among your options

**EV loss (how this app grades):**
Many trainers show an EV grade (Perfect / Good / Mistake / Blunder) and an EV loss in bb.
- EV loss is the difference between the recommended action EV and your action EV
- A small EV loss can still be a reasonable human decision

**Common mistakes:**
- Choosing actions because they "feel" safe rather than comparing EV
- Ignoring how position and future streets change realized EV

**Drills (in this app):**
- Preflop / Postflop trainers: focus on reducing EV loss, not just being correct
- Smart Practice: let SRS bring back the spots where your EV loss is highest`
        },
        {
            id: 'using-ev-loss',
            title: 'How to Use EV Loss + Grades to Improve',
            content: `The most important metric in this app is EV loss.

**EV loss = how much EV you gave up vs the best action.**

**How to use it (simple loop):**
1) Don’t chase “100% correct.” Chase lower EV loss.
2) Look for repeated spot types (same texture/position/line) where EV loss is high.
3) Study the relevant concept page.
4) Drill that exact trainer mode.
5) Re-test.

**Why EV loss is better than “right/wrong”:**
- Many poker spots have multiple close options.
- EV loss tells you the cost of your mistake.

**Practical tip:**
Treat big EV loss spots as “priority bugs” in your strategy.

**Drills (in this app):**
- Session History: filter for biggest EV loss
- Smart Practice: let SRS schedule your highest EV loss spots`
        },
        {
            id: 'skill-rating',
            title: 'How to Use Skill Rating (Without Gaming It)',
            content: `Skill Rating is a progress indicator, not the goal.

**How to use it correctly:**
- Track trends over time, not day-to-day noise
- Use it to motivate consistency, not perfection

**How people “game” ratings (don’t do this):**
- Only playing the easiest trainer modes
- Avoiding spots you are weak at

**Better approach:**
- Intentionally practice your weak spots (where EV loss is highest)
- Ratings will follow

**Drills (in this app):**
- Smart Practice: focus on weaknesses
- Dashboard: check rating trends weekly`
        },
        {
            id: 'smart-practice-srs',
            title: 'Smart Practice (SRS): How to Get Fast Improvement',
            content: `SRS (spaced repetition) is the fastest way to turn “knowledge” into automatic decisions.

**What SRS does well:**
- Brings back mistakes *right before* you forget them
- Stops you from mindlessly grinding easy spots

**How to use Smart Practice:**
1) Do a normal session in a trainer.
2) Let Smart Practice collect misses / high EV loss spots.
3) Do short SRS sessions daily (even 5–10 minutes).

**Important:**
If you keep missing a spot, pause and read the concept page.

**Drills (in this app):**
- Smart Practice: short daily sets
- Concepts: read the linked topic when a card repeats too often`
        },
        {
            id: 'review-with-hand-replayer',
            title: 'How to Review Hands with Hand Replayer',
            content: `Review turns practice into skill.

**A simple review checklist:**
1) Identify the spot type (SRP vs 3-bet pot, IP/OOP, texture).
2) What was your plan on flop? (value / bluff / bluff-catch)
3) What changed on turn/river? (runout equity shift)
4) Was sizing consistent with your goal?
5) Where did EV loss occur?

**Common mistake in review:**
- Only looking at outcomes (win/lose) instead of decision quality.

**Drills (in this app):**
- Hand Replayer: replay the biggest EV loss hands
- Concepts: read the topic that matches the street where you leaked EV`
        },
        {
            id: 'fold-equity',
            title: 'Fold Equity (Why Aggression Works)',
            content: `Fold equity is the part of your bet’s EV that comes from your opponent folding.

When you bet, two things can happen:
- Villain folds (you win the pot immediately)
- Villain continues (you realize equity at showdown or in future streets)

**Simple model (one-street intuition):**
EV(bet) ≈ (Fold% × PotNow) + (Call% × EV_when_called)

So even a weak hand can profitably bet if:
- Villain folds often enough, and/or
- You still have some equity when called (draws)

**What increases fold equity?**
- Bigger sizing (but costs more when called)
- Scary boards / runouts for villain’s range
- Your perceived range advantage (you represent strong hands)
- Being in position (you can apply pressure on future streets)

**What decreases fold equity?**
- Calling-station opponents
- Very wet boards where villain has many draws
- When your line is inconsistent (you rarely have value)

**Important warning:**
Fold equity is not a free gift. If you bluff too much, opponents adjust by calling more.

**How this relates to our EV feedback:**
Many trainer EV models include rough fold equity assumptions (especially preflop). These are approximations to produce useful feedback, not perfect solver truth.

**Drills (in this app):**
- C-bet Trainer: observe how wet vs dry boards change the recommended betting frequency
- Bet Sizing Trainer: see how bigger bets require more value/bluff polarization`
        },
        {
            id: 'initiative-range-nut-advantage',
            title: 'Initiative + Range Advantage vs Nut Advantage',
            content: `These ideas explain *who gets to bet more* and *who should be careful* on different boards.

**Initiative (high-level):**
Initiative means you were the last aggressor (often the preflop raiser).
- Having initiative lets you represent strength and win pots without showdown
- You still must respect board texture and the opponent’s range

**Range advantage:**
You have range advantage when your range has higher average strength on this board.
- Example: many A-high / K-high dry flops favor the preflop raiser’s range

**Nut advantage:**
You have nut advantage when you hold more of the *very best hands* (nuts / near-nuts).
- Example: some low connected flops can give the caller more sets / 2-pair / straights

**Why the difference matters:**
- Range advantage often supports **smaller bets** at high frequency
- Nut advantage often supports **bigger bets / stack pressure** because you can credibly represent the top

**Practical pattern:**
- If you have range advantage but not nut advantage, bet often but be cautious with very large sizes
- If you have nut advantage, you can polarize (big bet / check) more effectively

**Common mistakes:**
- Thinking “I raised preflop, so I always c-bet”
- Betting big on boards where you don’t have the top hands (you get raised a lot)

**Drills (in this app):**
- C-bet Trainer / Postflop Trainer: compare decisions on dry A/K-high boards vs low connected boards
- Board Texture Trainer: practice identifying when boards shift advantage toward the caller`
        },
        {
            id: 'spr',
            title: 'SPR (Stack-to-Pot Ratio) and Commitment',
            content: `SPR = Stack-to-Pot Ratio. It measures how “deep” you are relative to the pot.

**Definition:**
SPR = Effective Stack / Pot Size

**Why SPR matters:**
SPR heavily influences which hands are strong enough to stack off.
- Low SPR: one-pair hands go up in value (easier to get all-in)
- High SPR: you need stronger hands (two pair+), and draws gain implied odds

**Rules of thumb (cash-game style intuition):**
- SPR ~ 1–3: top pair / overpair can often be comfortable stacking off
- SPR ~ 4–8: one-pair becomes more “pot control” oriented; draws become powerful
- SPR 10+: be cautious stacking off with one pair (you can lose a huge pot)

**SPR and bet sizing:**
- With low SPR, larger bets can commit stacks quickly
- With high SPR, betting big with marginal hands creates tough turn/river decisions

**Common mistakes:**
- Treating top pair as a “monster” at high SPR
- Bluffing too big at low SPR when villain can call wider

**Drills (in this app):**
- Multi-street Trainer: focus on pot growth across streets and how it changes your river options
- Bet Sizing Trainer: see how different sizing sequences change the end-of-hand pot geometry`
        },
        {
            id: 'gto-baseline',
            title: 'GTO as a Baseline (and When to Exploit)',
            content: `GTO is best thought of as a strong default strategy, not a religion.

**What GTO gives you:**
- Balanced ranges (you have value hands and bluffs in the right mix)
- You are harder to exploit if opponents fight back
- A clear baseline to measure your decisions (EV loss)

**What GTO does NOT guarantee:**
- That you maximize profit against a specific weak opponent
- That the same frequencies are best at every stake / player pool

**Exploit = intentional deviation with a reason:**
Examples:
- Villain over-folds: bluff more, steal more, c-bet more
- Villain over-calls: bluff less, value bet thinner, size up value
- Villain under-defends BB: open wider

**How to use this app correctly:**
- Use trainers to build a strong baseline (reduce EV loss)
- Use Smart Practice to fix your repeated mistakes
- In real games, deviate exploitatively only when you have evidence

**Drills (in this app):**
- Any trainer: focus on EV loss over “right/wrong”
- Session History + Hand Replayer: review patterns in your mistakes`
        },
        {
            id: 'ranges',
            title: 'Ranges and Range Advantage',
            content: `A range is the set of hands a player can reasonably have in a spot.

**Why ranges matter:**
- You rarely know an exact hand
- The correct play depends on how your hand performs against the opponent's entire range

**Combos (very important):**
- A pair has 6 combos (for example QQ)
- A suited hand has 4 combos (for example AK suited)
- An offsuit hand has 12 combos (for example AK offsuit)

**Blockers (removal effects):**
Cards in your hand remove combos from the opponent.
- Having an Ace removes some strong Ace-x combos from villain
- This matters a lot for bluff selection and thin value

**Range advantage vs nut advantage:**
- Range advantage: one player has more overall strong hands on average
- Nut advantage: one player has more of the very best hands (top sets, straights, etc.)

**Example:**
Board: K high dry flop
- Preflop raiser often has range advantage (more strong broadways)
- Caller often has more medium pairs and suited connectors

**How to use this concept:**
- If you have range advantage, you can often bet smaller and more frequently
- If you lack nut advantage, you should be careful with big bets and stacks

**Drills (in this app):**
- C-bet Trainer: practice betting frequencies on different textures
- Equity Calculator: compare a hand vs a range to build intuition`
        }
    ],

    preflop: [
        {
            id: 'rfi-strategy',
            title: 'RFI Strategy by Position',
            content: `RFI = Raise First In (you open the pot).

**Default in 6-max cash:** raise or fold. Limping is usually avoided because it:
- gives everyone great odds
- creates multiway pots
- makes it harder to realize equity

**Why opening works (what you win):**
- You can win the blinds immediately
- You get initiative, which creates fold equity postflop
- You often get to play heads-up (simpler decisions)

**Why ranges widen by position:**
- Later position plays more pots IP
- Blinds are forced to defend wider vs steals
- You can profitably open more “thin” hands because you realize more equity

**Typical RFI sizes (broad intuition):**
- UTG: tight (strong broadways, strong pairs, suited aces)
- HJ: slightly wider
- CO: wider (more suited connectors / broadways)
- BTN: widest (many suited hands, more offsuit broadways)
- SB: wide but tricky (you are OOP postflop vs BB)

**Sizing standards:**
- A common baseline is ~2.0–2.5bb opens (this app’s preflop trainer uses a standard open sizing model)
- In general: smaller opens allow wider ranges; bigger opens tighten ranges

**Construction rules of thumb (high-level):**
- Prefer suited hands to offsuit hands (better equity realization)
- Prefer connected hands to disconnected hands (more board coverage)
- Avoid dominated offsuit hands in early position (like A7o, K9o)

**When to deviate exploitatively (if you have a reason):**
- If blinds are tight: open wider (steal more)
- If blinds are aggressive 3-bettors: tighten opens and/or 4-bet more linear
- If table is very call-heavy: tighten opens and emphasize hands that realize well postflop

**Common mistakes:**
- Opening too wide UTG because BTN ranges look fun
- Over-valuing weak offsuit aces (domination)

**Drills (in this app):**
- Preflop Trainer → RFI: focus on UTG/HJ discipline
- Preflop Trainer → BB Defense: understand how your open affects villain’s defense range`
        },
        {
            id: '3betting',
            title: '3-Betting Theory',
            content: `A 3-bet is a re-raise preflop.

**Why 3-bet at all?**
- Build a bigger pot with your strongest hands
- Win dead money immediately (fold equity)
- Deny equity to hands that would love to see a flop cheaply
- Create a lower SPR pot, which simplifies postflop play

**3-bet ranges: linear vs polarized**

**Linear (merged):**
- You 3-bet many of your strongest hands *and* some medium-strong hands
- Used when villain folds too much to 3-bets or when you’re OOP and don’t want to call as much

**Polarized:**
- You 3-bet very strong hands + bluffs, and you *call* with the medium part
- Used when villain defends correctly (calls/4-bets) and you can profitably call with many hands

**Value vs bluff 3-bets (construction):**

**Value 3-bets** typically:
- dominate villain’s calling range (AK vs AQ/KQ)
- or are strong enough to continue vs a 4-bet (QQ+ in many pools)

**Bluff 3-bets** typically:
- have blockers to villain’s strongest continuing hands (A♠5♠ blocks AA/AK)
- have good playability when called (suited connectors, suited broadways)
- do NOT make great calls (hands that get dominated when flat calling)

**Sizing (standards / intuition):**
- In Position (IP): often ~3x the open
- Out of Position (OOP): often ~3.5–4x the open (you want to reduce villain’s positional edge)

**Postflop consequences:**
- 3-bet pots are lower SPR → top pair becomes stronger
- ranges are tighter → boards hit differently than single-raised pots

**Common mistakes:**
- 3-betting only premiums (becomes face-up)
- 3-betting too many dominated offsuit broadways as bluffs
- using the same size IP and OOP

**Drills (in this app):**
- Preflop Trainer → 3-Bet: focus on building a consistent value/bluff mix
- Preflop Trainer → 4-Bet: learn which hands can continue after you 3-bet`
        },
        {
            id: '4betting',
            title: '4-Betting Theory (vs 3-Bets)',
            content: `A 4-bet is a re-raise of a 3-bet.

This is one of the most important preflop spots because ranges are tight and stacks can go in quickly.

**Your three options vs a 3-bet:**
- Fold
- Call (flat)
- 4-bet

**Why 4-bet?**
- Value: build the pot with premium hands
- Bluff: win the pot immediately using blockers + fold equity
- Deny equity: prevent villain from realizing equity with hands that call 3-bets well

**4-bet range composition:**

**Value 4-bets** often include:
- AA, KK, QQ, AK (depends on positions and pool tendencies)

**Bluff 4-bets** often include:
- hands with strong blockers (especially Ax)
- hands that are too weak to call profitably but can win immediately if villain folds

**Calling the 3-bet instead (why call):**
- Some hands are too strong to fold but not ideal to 4-bet
- Calling keeps villain’s bluffs in and avoids getting 5-bet shoved off equity
- IP you realize equity better; OOP calling becomes tougher

**Sizing intuition:**
- IP 4-bets are smaller than OOP 4-bets
- OOP you typically size bigger to compensate for positional disadvantage

**Common mistakes:**
- 4-betting only AA/KK (becomes face-up)
- 4-bet bluffing hands without blockers
- calling 3-bets OOP with dominated hands that realize poorly

**Drills (in this app):**
- Preflop Trainer → 4-Bet vs 3-Bet: practice the fold/call/4-bet decision
- Equity Calculator: compare AK vs QQ on different runouts to build intuition for all-in equity`
        },
        {
            id: 'cold-calling',
            title: 'Cold Calling (When to Flat a Raise)',
            content: `A cold call is calling an open raise when you were not already invested (not in the blinds).

Cold calling can be correct, but it’s often overused.

**Why cold calling is usually tighter than people think:**
- You invite squeezes (someone behind can 3-bet and force you to fold)
- You often go multiway (harder to realize equity)
- Many hands that look playable are actually dominated (AJo, KQo vs strong ranges)

**Hands that cold call well (general properties):**
- Hands with good playability: suited broadways, suited connectors
- Hands with implied odds: pocket pairs (set mining)
- Hands that are not easily dominated (suited > offsuit)

**Position matters a lot:**
- IP: you realize equity better and can defend more
- OOP: cold calling becomes much harder (you face c-bets and pressure)

**When cold calling is more attractive:**
- The opener is wide (CO/BTN steals)
- Players behind are passive (less likely to squeeze)
- Stacks are deeper (implied odds improve)

**When cold calling is usually a mistake:**
- Against tight early-position opens
- With offsuit broadways that are dominated
- When aggressive players behind can squeeze

**Drills (in this app):**
- Preflop Trainer → Cold Call: practice fold vs call vs 3-bet decisions
- Preflop Trainer → 3-Bet: learn which hands prefer aggression over calling`
        },
        {
            id: 'squeezing',
            title: 'Squeezes (3-Betting After an Open + Caller)',
            content: `A squeeze is a 3-bet after there is an open raise and at least one caller.

**Why squeezes can be very profitable:**
- There is extra dead money (open + call + blinds)
- The caller often has a capped/weak range (they didn’t 3-bet)
- Your bet pressures *two* players at once

**What makes a good squeeze spot:**
- Open raiser is capable of folding
- Caller is loose / weak
- You have blockers or a strong value hand
- You have a good position (squeezing from BTN/CO vs earlier positions)

**Sizing intuition:**
- Squeeze sizes are typically larger than normal 3-bets because there is more money in the pot
- OOP you generally size bigger than IP

**Range construction:**
- Value: premiums and strong hands that can continue if called
- Bluffs: blocker-heavy hands (Ax suited) and hands with playability when called

**Common mistakes:**
- Squeezing with hands that play terribly when called (weak offsuit hands)
- Squeezing too small (gives great odds to call in position)
- Squeezing into players who never fold (use value-heavy ranges instead)

**Drills (in this app):**
- Preflop Trainer: compare 3-bet vs squeeze logic (fold equity vs value)
- EV feedback: notice how dead money increases the EV of aggression`
        },
        {
            id: 'bb-defense',
            title: 'Blind Defense Principles',
            content: `The Big Blind (BB) is the best “price” you will ever get preflop, because you already invested 1bb.

**Why BB defense matters:**
- You close the action preflop
- You often get good pot odds
- If you over-fold the BB, you lose a lot of EV over time

**Pot odds intuition:**
When facing a standard open, you usually need surprisingly little equity to continue.
That’s why BB defense ranges are wide, especially vs BTN/SB.

**Defense vs position (high-level):**
- vs UTG: defend tight (opener range is strong)
- vs CO: defend wider
- vs BTN: defend widest (steal is wide)
- vs SB: defend very wide (heads-up, but you are OOP postflop)

**Call vs 3-bet:**

**3-bet** when:
- you have strong value
- you have good blocker bluffs
- you are OOP and calling would realize poorly

**Call** when:
- your hand plays well postflop (suitedness, connectedness)
- you don’t want to inflate the pot OOP with a medium-strength hand

**Fold** when:
- your hand is dominated and plays poorly (weak offsuit trash)

**Hand quality rules of thumb:**
- Suited hands realize equity better than offsuit
- Connected hands realize better than disconnected
- Small pairs can call for implied odds when stacks are deeper

**Common mistakes:**
- Over-folding vs BTN steals
- Defending with too many weak offsuit hands (they realize poorly)
- Never 3-betting from the BB (you become passive and capped)

**Drills (in this app):**
- Preflop Trainer → BB Defense: focus on defending wider vs BTN/SB than vs UTG
- Postflop Trainer: practice playing OOP after defending BB`
        }
        ,
        {
            id: 'sb-strategy',
            title: 'Small Blind (SB) Strategy: Why It’s Often 3-Bet or Fold',
            content: `The Small Blind is a difficult position postflop because you are almost always OOP.

**Why SB is tricky:**
- You act first postflop
- Your equity realization is worse
- Calling invites the BB to enter (multiway) or squeeze

**Common modern baseline:**
- SB vs open: often prefers 3-bet or fold more than cold calling

**Why 3-betting from SB is attractive:**
- You deny BB’s ability to realize equity cheaply
- You can win the pot immediately more often
- You create a lower SPR pot where initiative matters

**When SB can call:**
- Vs very small opens
- With hands that play very well multiway (some suited connectors)
- When BB is passive and opener is wide

**Common mistakes:**
- Calling too much from SB with dominated hands
- Using tiny 3-bet sizes that give great odds

**Drills (in this app):**
- Preflop Trainer: compare SB decisions vs BB decisions
- Postflop Trainer: focus on OOP play after SB flats/3-bets`
        },
        {
            id: 'preflop-sizing-standards',
            title: 'Preflop Sizing Standards (Opens, 3-Bets, 4-Bets)',
            content: `Sizing is part of strategy: it changes pot odds, SPR, and how wide opponents can continue.

**Opens (RFI):**
- Many games use ~2.0–2.5bb opens
- Smaller opens allow wider ranges; bigger opens force tighter ranges

**3-bets:**
- IP: often ~3x the open
- OOP: often ~3.5–4x the open
Reason: OOP wants more fold equity and less positional disadvantage.

**4-bets:**
- IP: smaller
- OOP: bigger
Reason: OOP needs to deny IP’s advantage and avoid giving good calling odds.

**A good default principle:**
Use a sizing that makes your value hands happy and doesn’t allow opponents to profitably continue with everything.

**Common mistakes:**
- Too-small 3-bets OOP (gives great odds)
- Inconsistent sizing that “tells a story” (big = value, small = bluff)

**Drills (in this app):**
- Preflop Trainer: observe how sizing affects the profitability of marginal continues
- Pot Odds Trainer: connect sizing to required equity`
        },
        {
            id: 'preflop-common-leaks',
            title: 'Common Preflop Leaks (and How to Fix Them)',
            content: `Most win-rate comes from avoiding big, repeatable mistakes.

**Very common leaks:**
- Over-calling preflop (especially OOP)
- Under-defending the BB vs steals
- Over-valuing weak offsuit aces (domination)
- Never 3-betting (too passive)
- 3-betting only premiums (too face-up)

**How to fix them:**
- Tighten cold calls; prefer suited/connected hands
- Learn BB defense fundamentals (position + pot odds)
- Add a small set of blocker bluffs to your 3-bet/4-bet ranges
- Track EV loss in trainers and focus on your biggest repeat errors

**Drills (in this app):**
- Smart Practice: let SRS repeatedly quiz the spots you miss
- Session History: review which preflop spot types cause the most EV loss`
        }
    ],

    postflop: [
        {
            id: 'cbet-theory',
            title: 'Continuation Betting Theory',
            content: `A continuation bet (c-bet) is betting the flop after you were the preflop aggressor.

**Why c-bet?**
- Fold equity (you win the pot immediately when villain folds)
- Value (worse hands can call)
- Protection / denial (charge draws and overcards)
- Initiative (your line is credible because you raised preflop)

**Two common strategies:**

**Range-bet (bet very frequently):**
- Works best on boards where the preflop raiser has clear range advantage
- Often uses small sizing to let many hands continue

**Split strategy (bet some, check some):**
- Used on more dynamic boards or boards that hit the caller
- You check hands that don’t benefit from betting (or want to protect checking range)

**When to c-bet more often:**
- Dry, high-card boards (Axx, Kxx) that favor the raiser
- When you are in position
- Against opponents who over-fold

**When to check more often:**
- Low connected boards that favor the caller’s range (987, 876)
- Very wet boards where villain has many strong draws
- When OOP and your hand doesn’t benefit from building the pot

**Sizing concepts (why size changes):**
- Small (25–33% pot): good for range-bets on advantage boards
- Medium (50–75% pot): good for charging draws and building pots with value
- Big (75%+ / overbet): usually more polarized (strong value + bluffs)

**Common mistakes:**
- C-betting automatically because “I raised preflop”
- Betting big on boards where you don’t have the nut advantage
- Never checking strong hands (your checking range becomes weak)

**Drills (in this app):**
- C-bet Trainer: practice choosing bet vs check by texture and position
- Board Texture Trainer: learn which boards favor raiser vs caller`
        },
        {
            id: 'board-texture',
            title: 'Board Texture Analysis',
            content: `Board texture tells you how ranges interact with the flop.

It answers:
- Who has range advantage?
- Who has nut advantage?
- How much should we bet (small vs big)?

**Dry vs wet (draw density):**

**Dry boards:**
- Few draws available
- Example: K♠ 7♦ 2♣
- Strategy: often smaller bets, higher frequency

**Wet boards:**
- Many draws available
- Example: J♠ T♥ 9♠ (straight + flush draws)
- Strategy: more checking, or larger bets when betting (deny equity)

**Static vs dynamic (runout sensitivity):**

**Static:** turn/river cards don’t change equities much
- Example: A♣ 7♦ 2♠

**Dynamic:** many turns/rivers change who is ahead
- Example: 9♠ 8♦ 7♠

**Paired vs unpaired:**
- Paired boards (K K 4) often reduce nut combinations and can increase bluffing
- Unpaired boards can create many strong value combos (sets, two pair)

**High-card vs low-card:**
- High-card boards (Axx/Kxx/Qxx) often favor the preflop raiser
- Low connected boards often favor the caller

**Worked examples:**
- A♠ 8♦ 3♣ (dry, high): raiser often has advantage → frequent small c-bets
- J♦ T♦ 8♣ (wet, dynamic): caller has more strong draws → check more / size up when betting
- 7♠ 7♥ 2♦ (paired): fewer nut hands exist → small bets can work often

**Drills (in this app):**
- Board Texture Trainer: classify boards and predict who has advantage
- Postflop Trainer: practice adjusting bet/check and sizing by texture`
        },
        {
            id: 'facing-cbets',
            title: 'Facing C-Bets: Call / Raise / Fold',
            content: `When you face a c-bet, your job is to continue with hands that can profitably realize equity.

**Three options:**
- Fold
- Call
- Raise

**The two big factors:**
- Pot odds (required equity)
- Equity realization (how likely you are to see showdown / improve)

**When calling is attractive:**
- You have a made hand with showdown value (top pair, second pair in some spots)
- You have a strong draw that realizes well
- You are in position (easier to realize equity)

**When raising is attractive:**
- Value: you have a strong made hand that wants to build the pot
- Semi-bluff: you have a strong draw and benefit from fold equity
- Villain’s range is capped and your line is credible

**When folding is correct:**
- You have insufficient equity for the price
- Your hand is dominated and realizes poorly (weak offsuit hands)
- The board/runout is bad for your continuing range

**Common mistakes:**
- Calling too wide OOP “because it’s only one bet”
- Raising too many weak draws with no fold equity
- Folding too much vs small c-bets on boards that favor the raiser (you get exploited)

**Drills (in this app):**
- Postflop Trainer: practice defending vs different c-bet sizes
- Pot Odds Trainer: connect bet size to required equity`
        },
        {
            id: 'draws',
            title: 'Draws and Semi-Bluffs',
            content: `A draw is a hand that is behind now but can improve on future streets.

**Common draw types:**
- Flush draws (9 outs)
- Open-ended straight draws (8 outs)
- Gutshots (4 outs)
- Two overcards (sometimes 6 outs, but can be dominated)
- Backdoor draws (need two running cards)

**Made hand vs draw:**
- Made hands win now
- Draws win later; they need either pot odds or fold equity (semi-bluffing)

**Semi-bluffing:**
When you bet/raise a draw, you can win in two ways:
- Villain folds now
- Villain calls and you improve later

**Strong vs weak draws:**
- Nut draws (A-high flush draw) realize better and can play bigger pots
- Weak draws (low flush draw) can be dominated and suffer reverse implied odds

**Key concept: implied odds vs reverse implied odds**
- Implied odds: you win extra when you hit
- Reverse implied odds: you lose extra when you hit a second-best hand

**Common mistakes:**
- Over-playing weak draws OOP
- Ignoring that some outs are not clean (pairing board, dominated flushes)

**Drills (in this app):**
- Equity Calculator: compare different draw strengths on various boards
- Postflop Trainer: practice when to call vs semi-bluff with draws`
        },
        {
            id: 'value-bluff-protection',
            title: 'Value vs Bluff vs Protection (What Your Bet Accomplishes)',
            content: `Most bets fall into one (or more) of these buckets.

**Value bet:**
You expect worse hands to call.
- Goal: extract chips from worse hands
- Example: top pair betting vs second pair / draws

**Bluff:**
You expect better hands to fold.
- Goal: win the pot without showdown
- Bluff EV depends heavily on fold equity and credible lines

**Protection / denial:**
You bet to charge hands that have equity but are currently behind.
- Goal: make draws and overcards pay to realize their equity
- Important on wet boards (many turn cards change the winner)

**Merged vs polarized betting ranges:**
- Merged: many medium-strength hands bet (common with small sizes)
- Polarized: mostly strong value + bluffs bet (common with large sizes)

**Common mistakes:**
- Calling a bet “protection” when worse hands never call
- Bluffing into ranges that are too strong to fold
- Value betting too big with medium hands and getting raised off equity

**Drills (in this app):**
- Bet Sizing Trainer: practice matching sizing to goal (merged vs polarized)
- Postflop Trainer: identify whether your hand is value, bluff-catcher, or bluff`
        },
        {
            id: 'overcards-backdoors',
            title: 'Overcards and Backdoor Equity',
            content: `Some hands look like “nothing” but still have meaningful equity.

**Overcards:**
If you have two overcards to the board (like A♠K♣ on 7♦4♠2♥), you can improve to top pair.
- Overcards are stronger when:
  - the opponent’s range contains many folds
  - you have backdoors (backdoor flush/straight)
  - you are in position

**Backdoor draws (BDFD / BDSD):**
Backdoor = you need two running cards to complete.
- Example: you have A♦Q♦ on K♣7♦2♠ (backdoor flush draw)
- These add semi-bluffing potential because turn cards can give you strong equity

**Why backdoors matter:**
- They allow you to continue more hands vs small bets
- They make bluffing turns more credible when equity improves

**Common mistakes:**
- Over-calling with overcards OOP on wet boards (realization is poor)
- Ignoring that some overcards are dominated (AJ vs AK)

**Drills (in this app):**
- Postflop Trainer: practice continuing with overcards + backdoors vs folding total air
- Equity Calculator: compare overcards with and without backdoor draws`
        },
        {
            id: 'ip-vs-oop-postflop',
            title: 'Position Postflop: IP vs OOP Patterns',
            content: `Many postflop mistakes come from ignoring how much position changes equity realization.

**In Position (IP):**
- You get information first (villain acts before you)
- You can realize equity more often (check behind, take free cards)
- You can apply pressure efficiently (you control bet sizes and river decisions)

**Out of Position (OOP):**
- You must act first and reveal information
- You face more difficult turn/river decisions
- Your bluffs need to be more selective because realization is worse

**Practical consequences:**
- IP you can call more often (better realization)
- OOP you often prefer 3-bet/fold preflop and check/raise more selectively postflop
- IP you can value bet thinner; OOP you should be careful with medium hands

**Common mistakes:**
- Defending too wide OOP and then “guessing” across streets
- Using the same c-bet frequency IP and OOP

**Drills (in this app):**
- Postflop Trainer: compare the same flop spot IP vs OOP
- Multi-street Trainer: notice how IP gets easier river decisions`
        },
        {
            id: 'common-flop-mistakes',
            title: 'Common Flop Mistakes (Quick Checklist)',
            content: `A fast checklist to reduce EV loss.

**On the flop, avoid:**
- Auto c-betting every flop
- Betting big on boards that smash the caller
- Calling too wide OOP vs medium/large bets
- Over-raising weak draws with no fold equity
- Slowplaying when the board is dynamic (you give free cards)

**Do more often:**
- Use small bets on boards where you have range advantage
- Size up on wet boards when you want denial
- Think in ranges (what does villain have here?)
- Consider SPR and whether the hand should play for stacks

**Drills (in this app):**
- EV feedback: identify which flop textures create your biggest EV loss
- Smart Practice: repeat the textures and lines you misplay`
        },
        {
            id: 'bet-sizing',
            title: 'Bet Sizing Theory',
            content: `Bet sizing is strategy. It changes:
- pot odds (what villain must defend)
- fold equity (how often bluffs work)
- SPR (how committed stacks become)

**F1. Why size matters (goals):**
- Value extraction: win more when ahead
- Denial/protection: charge draws and overcards
- Fold equity: make bluffs profitable
- Range shaping: big bets force polarization; small bets allow merging

**General principles:**
1) Bigger bets = more polarized (strong value + bluffs)
2) Smaller bets = more merged (many medium-strength hands can bet)
3) Sizing should match board texture and range advantage

**F2. Small vs big bets on different textures:**

**Small bets (25–33% pot):**
- Good on dry boards where you have range advantage
- Lets you bet many hands (range-bet style)
- Gives villain good odds (so expect more calls)

**Big bets (60–100% pot):**
- Good on wet/dynamic boards to deny equity
- Good when you want to build a pot with strong value
- Requires a tighter, more polarized betting range

**Overbets (125%+):**
- Usually only when you have nut advantage or villain is capped

**Turn sizing (common intuition):**
- Many turns use 50–75% pot
- Bigger sizes pressure draws and set up river shoves
- Smaller sizes can be used for thin value or to keep bluffs alive

**River sizing (common intuition):**
- Small: thin value and inducing
- Big: polarized value/bluffs

**F3. Sizing with value vs bluffs:**
- If you use a big size for value, you need bluffs in that same size
- If you only big-bet with value, opponents over-fold vs big bets

**F4. Common sizing heuristics (SRP vs 3-bet pots):**
- Single-raised pots (SRP): often more small c-bets on A/K-high dry boards
- 3-bet pots: ranges are tighter, SPR is lower → fewer streets and more commitment

**Common mistakes:**
- Using big bets with medium-strength “thin value” hands
- Betting small on very wet boards where denial is important
- Changing size based on hand strength (telegraphing)

**Drills (in this app):**
- Bet Sizing Trainer: choose sizes that match your goal
- Pot Odds Trainer: connect villain’s price to your sizing
- Multi-street Trainer: plan sizing so river outcomes make sense`
        }
    ],

    advanced: [
        {
            id: 'gto-vs-exploitative',
            title: 'GTO vs Exploitative Play',
            content: `Two fundamental approaches to poker strategy.

**GTO (Game Theory Optimal):**
- A balanced strategy designed to be hard to exploit
- Uses correct value/bluff ratios for a given sizing
- A strong default when opponents are unknown

**Exploitative:**
- Intentionally deviates to punish a specific leak
- Can earn more vs weak opponents, but becomes exploitable if villain adjusts

**How to think about it (practical):**
- Start with a GTO-ish baseline so you don’t have obvious holes
- Deviate only when you can name a concrete reason (data / repeated behavior)

**Common exploits (examples):**
- Villain over-folds: bluff more, steal more, c-bet more
- Villain over-calls: bluff less, value bet thinner, size up value
- Villain under-defends BB: open wider
- Villain over-3bets: tighten opens, 4-bet more linear, trap more

**Important: what this app teaches**
The trainers generally grade you against a GTO-style recommendation.
- Use the trainer to build a strong baseline
- Then apply exploits in real games when you have evidence

**Common mistakes:**
- Calling something “exploit” when it’s actually just a punt
- Over-bluffing without knowing villain’s fold frequency

**Drills (in this app):**
- Use EV loss as a compass: aim to reduce EV loss before adding fancy exploits
- Use Smart Practice (SRS) to revisit the exact spots you repeatedly miss`
        },
        {
            id: 'turn-barreling',
            title: 'Turn Barreling (When to Continue Aggression)',
            content: `The turn is where pots become large and mistakes become expensive.

**Why barrel the turn?**
- Value: you still get called by worse
- Denial: you charge draws / deny equity
- Bluff: you gain fold equity as ranges narrow

**Good turn cards to barrel (general idea):**
- Cards that improve your perceived range (overcards to the board)
- Cards that reduce villain’s continues (bad cards for their range)
- Cards that give you equity (pick up a draw / pair)

**Bad turn cards to barrel:**
- Cards that smash the caller’s range (complete obvious draws)
- Cards that reduce your value advantage

**Key concept: equity shift**
Ask: “Who likes this turn more, me or villain?”

**Drills (in this app):**
- Postflop Trainer: compare flop bet → turn decisions across different runouts
- Multi-street Trainer: plan flop/turn sizing and see how it affects river options`
        },
        {
            id: 'river-value-and-bluffcatching',
            title: 'River Value, Thin Value, and Bluff-Catching',
            content: `On the river, there are no more cards to come: decisions are purely about ranges.

**Value betting on the river:**
- Bet when worse hands can call
- Your sizing should target the part of villain’s range that continues

**Thin value:**
- Betting with hands that are only slightly ahead of villain’s calling range
- Usually smaller sizing to get called by bluff-catchers

**Bluff-catching:**
- Calling a river bet with a hand that cannot beat value, but can beat bluffs
- Requires villain to have enough bluffs in their range

**Common mistakes:**
- Over-folding rivers (many players bluff more than you think)
- Over-calling rivers vs under-bluffing opponents
- Using huge sizes with thin value

**Drills (in this app):**
- Postflop Trainer: practice river call/fold thresholds via pot odds
- EV feedback: review whether your biggest losses come from river over-calls or over-folds`
        },
        {
            id: 'bluff-construction',
            title: 'Bluff Construction (Blockers, Unblockers, MDF Intuition)',
            content: `Good bluffs are chosen, not guessed.

**Two pieces of a good bluff:**
- The story is credible (your line can represent value)
- Your hand is a good candidate (blockers / equity)

**Blockers and unblockers:**
- Blockers: cards in your hand that reduce villain’s value combos
- Unblockers: cards that *do not* block villain’s folding hands / bluffs

Example intuition:
- Having an Ace can be a strong blocker because it removes some of villain’s top hands.

**MDF (Minimum Defense Frequency) intuition:**
MDF tells you how often a defender must continue to avoid being auto-exploited by bluffs.
- Bigger bets require the defender to fold more
- Therefore, bigger bets need more polarization (strong value + bluffs)

**Common mistakes:**
- Bluffing with hands that block villain’s folds
- Bluffing without enough credible value hands in your range

**Drills (in this app):**
- Bet Sizing Trainer: connect sizing to required bluff frequency
- Advanced → Blockers concept: practice choosing bluff candidates with removal effects`
        },
        {
            id: 'overbet-theory',
            title: 'Overbet Theory (Why Bet Bigger Than Pot)',
            content: `An overbet is betting more than the pot.

**Why overbet?**
- To apply maximum pressure with a polarized range
- To target capped ranges that can’t defend well
- To leverage nut advantage (you have more of the best hands)

**When overbets appear most often:**
- On runouts where one player has a strong nut advantage
- When the defender’s range contains many medium-strength bluff-catchers

**Common mistakes:**
- Overbetting without nut advantage (you get called/raised too much)
- Overbetting with thin value (you only get called by better)

**Drills (in this app):**
- Bet Sizing Trainer: practice when a big size is logical vs when small is better
- Postflop Trainer: look for textures/runouts where pressure is highest`
        },
        {
            id: 'check-raise-theory',
            title: 'Check-Raise Theory (Value + Bluffs)',
            content: `A check-raise is checking, then raising after villain bets.

**Why check-raise?**
- Value: build a pot with strong hands
- Protection: deny equity on wet boards
- Bluff: use fold equity when villain’s bet range is wide

**When check-raises are credible:**
- On boards where the caller has many strong hands (sets, two pair, strong draws)
- When villain c-bets too frequently

**Range construction:**
- Value: strong made hands
- Bluffs: strong draws and some blocker bluffs

**Common mistakes:**
- Check-raising only value (becomes obvious)
- Check-raising weak draws that can’t continue vs a 3-bet

**Drills (in this app):**
- Postflop Trainer: practice when to check-raise vs when to call
- Board Texture Trainer: identify boards where the defender has nut advantage`
        },
        {
            id: 'multistreet-planning',
            title: 'Multi-Street Planning (Flop → Turn → River)',
            content: `Good players don’t just choose a flop action — they choose a *line*.

**A simple planning framework:**
1) What is my hand category? (value / bluff-catcher / draw / air)
2) What is my goal? (get called by worse, fold out better, deny equity)
3) What turn cards help me? What cards hurt me?
4) What river do I expect to value bet or bluff?

**Why planning matters:**
- It prevents random “one-and-done” aggression
- It avoids building pots with hands that can’t handle pressure later
- It improves sizing sequences (pot geometry)

**Drills (in this app):**
- Multi-street Trainer: practice selecting lines that make sense across streets
- Hand Replayer: review where your plan broke on turn/river`
        },
        {
            id: 'range-narrowing',
            title: 'Range Narrowing + Combos Across Streets',
            content: `Every action removes hands from ranges.

**How ranges narrow:**
- Preflop action sets the starting range
- Flop bet/call/raise removes many weak hands
- Turn action removes even more
- By the river, ranges can be very polarized

**Combo thinking (practical):**
- Ask “how many value combos do they have?” vs “how many bluffs can they have?”
- Blockers matter more later because ranges are narrower

**Common mistakes:**
- Treating river like flop (ranges are not wide anymore)
- Ignoring that certain lines remove bluffs (for example, passive lines often mean fewer bluffs)

**Drills (in this app):**
- Postflop Trainer: watch how EV feedback changes by street
- Advanced concepts: apply blockers on river bluff-catch spots`
        },
        {
            id: 'runouts',
            title: 'Runouts: Good vs Bad Turns/Rivers',
            content: `A runout is the sequence of turn + river cards.

**Why runouts matter:**
- They change equity
- They change nut advantage
- They change which bluffs are credible

**Good runouts for the aggressor:**
- Overcards that hit the aggressor’s perceived range
- Bricks that don’t complete draws

**Good runouts for the defender:**
- Cards that complete many draws the defender can have
- Low cards that connect with defender’s suited/connected hands

**Practical question:**
"If this turn/river comes, who can represent the nuts?"

**Drills (in this app):**
- Board Texture Trainer: connect flop texture to likely turn/river dynamics
- Multi-street Trainer: practice adjusting lines on different runouts`
        },
        {
            id: 'pot-geometry',
            title: 'Pot Geometry (Sizing Sequences)',
            content: `Pot geometry is how your bet sizes determine the final pot size by the river.

**Why it matters:**
- You can plan to get stacks in with value
- You can apply maximum pressure with bluffs
- You can avoid accidentally committing with marginal hands

**Common sizing sequences:**
- Small flop → big turn → shove river (pressure builds as ranges narrow)
- Big flop → big turn (fast-play on wet boards)
- Check flop → bet turn (delayed c-bet lines)

**Geometric sizing idea:**
Bet a consistent fraction each street so that a river shove is natural.

**Drills (in this app):**
- Bet Sizing Trainer: practice building coherent sizing lines
- Multi-street Trainer: see how sizing affects river SPR`
        },
        {
            id: 'balance',
            title: 'Balance and Frequencies',
            content: `Balance means your range contains both strong hands and bluffs in correct proportions.

**Why Balance Matters:**
- Prevents opponents from exploiting you
- Makes your bets unpredictable
- Allows bluffs to be profitable

**Optimal Bluffing Frequency:**
Based on bet sizing and pot odds you're giving

Formula: Bluff% = Risk / (Risk + Reward)

**Example:**
Pot = 100, you bet 100 (pot-sized)
Opponent gets 2:1 odds (needs 33% equity to call)
You should bluff 50% as often as you value bet

- If you bet 15 value combos → include 7-8 bluff combos
- Total: 22-23 combos (15 value + 7-8 bluffs)

**By Bet Size:**
- 50% pot: 33% bluffs, 67% value (2:1 ratio)
- 100% pot: 50% bluffs, 50% value (1:1 ratio)
- 200% pot: 67% bluffs, 33% value (2:1 ratio)

**Application:**
If you only bet with the nuts, opponents fold everything. If you only bluff, they call everything. Balance prevents both exploits.`
        },
        {
            id: 'blockers',
            title: 'Blockers and Removal Effects',
            content: `Blockers are cards in your hand that reduce the combinations of specific hands your opponent can have.

**Why Blockers Matter:**
- Affect bluffing candidates
- Affect calling vs folding decisions
- Help construct ranges

**Bluffing with Blockers:**
Best bluffs block opponent's value hands

**Example 1:**
Board: K♠ Q♥ J♦ T♠ 3♣
You have A♠ 5♠
- Blocks AA, AK, AQ, AJ, AT (straight combos)
- Good bluff candidate - opponent less likely to have straight

**Example 2:**
Board: K♠ K♥ 7♦ 3♣ 2♠
You have A♠ K♦
- Blocks opponent's KK, AK
- Bad bluff - you block hands that might fold!
- Better as bluff-catcher

**Common Blocker Bluffs:**
- Ace-high on river (blocks top pairs)
- Suited aces for 3-betting (blocks AA, AK)
- Broadway cards (block big pairs, top pairs)

**Removal Effects:**
When deciding to call, having cards that block opponent's bluffs is bad (makes bluffs less likely). Having cards that block value hands is good (makes value less likely).`
        }
    ]
};

export function getConceptsByCategory(category) {
    return CONCEPTS[category] || [];
}

export function getAllConcepts() {
    return Object.values(CONCEPTS).flat();
}

export function getConceptById(id) {
    const allConcepts = getAllConcepts();
    return allConcepts.find(c => c.id === id);
}

export default {
    CONCEPT_CATEGORIES,
    CONCEPTS,
    getConceptsByCategory,
    getAllConcepts,
    getConceptById
};

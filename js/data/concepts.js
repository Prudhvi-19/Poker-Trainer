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

**Important: equity realization**
Even if you have enough raw equity, you might not realize it when:
- You are OOP
- Your draw is weak and faces big bets
- You often get forced to fold on later streets

**Implied odds (future money):**
You can call slightly below break-even if you expect to win more later when you hit.
Be careful: reverse implied odds happen when your hand improves but is still second best.

**Drills (in this app):**
- Pot Odds Trainer: practice required equity under different bet sizes
- Equity Calculator: estimate your equity on different boards`
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
            content: `C-betting is betting on the flop after you were the preflop aggressor.

**Why C-Bet?**
- Range advantage on many flops
- Initiative advantage (aggression)
- Fold equity (opponent might fold)
- Build pot with strong hands

**When to C-Bet Frequently:**
- Dry boards (K72, A84)
- Boards that favor your range
- Against opponents who fold too much
- When in position

**When to Check Frequently:**
- Wet coordinated boards (JT8, 987)
- Boards that favor caller's range
- Against calling stations
- When out of position with nothing

**C-Bet Sizing:**
- Small (25-33%): With range advantage, encourages calls from worse
- Medium (50-67%): Standard, balanced
- Large (75-100%): Deny equity to draws, polarized
- Overbet (125%+): Nuts or air, very polarized

**GTO Approach:** Mix bet and check with all hand types to stay balanced`
        },
        {
            id: 'board-texture',
            title: 'Board Texture Analysis',
            content: `Board texture determines who has range advantage and how to proceed.

**Dry vs Wet:**

**Dry Boards:**
- Few draws available
- Cards don't connect well
- Examples: K♠ 7♦ 2♣, A♥ 8♣ 4♠, Q♦ 6♠ 2♥
- Favors: Preflop raiser (range advantage)
- Strategy: C-bet frequently, medium sizing

**Wet Boards:**
- Many draws available
- Cards connect
- Examples: J♠ T♥ 9♠, 8♦ 7♦ 6♣, K♥ Q♠ J♦
- Favors: Calling range (more connected hands)
- Strategy: Check more often, larger sizing when betting

**Static vs Dynamic:**

**Static:** Few turn cards change board significantly
Example: K♠ 7♦ 2♣ → Not many scary turns

**Dynamic:** Many turn cards change equity
Example: J♠ T♥ 8♠ → Tons of straight and flush possibilities

**High vs Low:**
- High: K+ high card (favors raiser)
- Middle: 9-J high card (neutral)
- Low: 8- high card (can favor caller - setmining range)`
        },
        {
            id: 'bet-sizing',
            title: 'Bet Sizing Theory',
            content: `Bet sizing should achieve specific goals and stay balanced.

**General Principles:**
1. Bigger bets = More polarized range
2. Smaller bets = More merged range
3. Match sizing to goal

**Flop Sizing:**
- 25-33%: Very merged range, inducing calls
- 50-67%: Standard, balanced
- 75-100%: Polarized, denying equity
- 125%+: Nuts or air

**Turn Sizing:**
- Usually 50-75% pot
- Can overbet with very strong hands or as bluffs
- Smaller with marginal made hands (pot control)

**River Sizing:**
- 33-50%: Thin value, inducing
- 67-75%: Standard value
- 100%+: Polarized (nuts or bluff)

**Geometric Sizing:**
Size your bets to get all-in by river with a consistent fraction
- Allows for maximum pressure across three streets

**Balance:**
Use same sizing with both value and bluffs to avoid being exploitable`
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

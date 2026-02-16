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
            id: 'bb-defense',
            title: 'Blind Defense Principles',
            content: `The BB is the most important position to defend correctly.

**Why Defend Wide:**
- You already have 1bb invested
- You're getting excellent pot odds (3.5:1 minimum)
- You close the action (no one left to act)

**Defense Range vs Position:**
- vs UTG: Tightest (~15% total - calls + 3-bets)
- vs HJ: ~20%
- vs CO: ~27%
- vs BTN: Very wide (~40%)
- vs SB: Widest (~55%)

**Call vs 3-Bet Decision:**
- 3-Bet: Very strong hands + some bluffs (polarized)
- Call: Medium strength hands that play well postflop
- Fold: Weakest hands with poor playability

**Hands that Always Call (vs most positions):**
- Small pairs (implied odds)
- Suited connectors (playability)
- Suited aces (nut potential)

**Avoid:** Weak offsuit hands (K4o, Q7o, J6o) unless vs very wide ranges (BTN/SB)`
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

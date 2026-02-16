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
            content: `RFI = Raise First In. The action when you're first to enter the pot.

**Never Limp in 6-Max:** Always raise or fold (except SB can complete sometimes)

**Why Raise?**
1. Steal the blinds immediately
2. Build a pot when you have the best hand
3. Take initiative (aggression advantage postflop)
4. Play fewer pots out of position

**RFI Range Sizes:**
- UTG: ~15% (tight, strong hands)
- HJ: ~18%
- CO: ~28%
- BTN: ~48% (very wide)
- SB: ~45% (vs BB only)

**Standard Sizing:** 2.5bb from all positions

**Adjust Based On:**
- Table dynamics (tighter if players are 3-betting a lot)
- Stack sizes (wider with deeper stacks)
- Player tendencies (exploit weak players)`
        },
        {
            id: '3betting',
            title: '3-Betting Theory',
            content: `A 3-bet is a re-raise preflop.

**3-Bet Range Construction:**

**Linear (Merged):**
Contains your strongest hands without gaps
Example: AA-99, AK-AJ
Used vs tight opponents who will fold too much

**Polarized:**
Contains very strong hands + bluffs, no medium hands
Example: AA-QQ, AK, A5s-A2s, KQs
Used vs opponents who call or 4-bet correctly

**Why 3-Bet?**
1. Build pot with strong hands
2. Deny opponent's pot odds
3. Win dead money immediately
4. Avoid playing OOP postflop (from blinds)

**Standard Sizing:**
- In Position: 3x the raise (2.5bb → 7.5bb)
- Out of Position: 3.5x the raise (2.5bb → 9bb)

**Bluff Candidates:**
- Suited aces (A5s-A2s): Blocker value + nut potential
- Suited connectors (76s, 65s): Playability if called
- Hands that don't play well as calls`
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
- Unexploitable strategy
- Balanced ranges (mix of value and bluffs)
- Frequencies designed to make opponent indifferent
- Best vs unknown, strong opponents
- Guarantees you don't lose in the long run

**Exploitative:**
- Adjusts to opponent's specific mistakes
- Unbalanced (over-fold, over-call, over-bluff vs them)
- Maximizes profit vs that specific opponent
- Best vs known, weak opponents
- Can be exploited by aware opponents

**When to Use Each:**
- **GTO Base:** Start with GTO, adjust from there
- **Exploit:** When you identify clear tendencies
  - vs calling station: Bluff less, value bet thinner
  - vs nit: Bluff more, value bet less
  - vs maniac: Call more, bluff less

**The Balance:**
Good players use GTO as default and make exploitative adjustments when edges are clear.

"Play GTO until you have reason not to."`
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

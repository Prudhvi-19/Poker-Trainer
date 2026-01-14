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
            content: `Position is your seat relative to the button and determines when you act in a hand.

**Position Order (6-max):**
- UTG (Under the Gun) - First to act, worst position
- HJ (Hijack) - Second to act
- CO (Cutoff) - Third to act
- BTN (Button) - Last to act preflop and postflop, best position
- SB (Small Blind) - Acts last preflop, first postflop
- BB (Big Blind) - Acts last preflop (after SB), second postflop

**Why Position Matters:**
- Acting last gives you information advantage
- You see what opponents do before making your decision
- You can control pot size more effectively
- Late position allows you to play more hands profitably
- Early position requires tighter ranges to compensate for positional disadvantage

**Key Principle:** The later your position, the wider your range can be.`
        },
        {
            id: 'pot-odds',
            title: 'Pot Odds and Equity',
            content: `Pot odds are the ratio of the current pot size to the cost of a call.

**Example:**
Pot = $100, Bet = $50
Pot odds = $150:$50 = 3:1
You need to win 25% of the time to break even (1/(3+1) = 0.25)

**Equity** is your percentage chance to win the hand.

**The Rule:** Call when your equity > pot odds requirement

**Common Scenarios:**
- Facing half pot bet: Need 33% equity (2:1 odds)
- Facing pot-sized bet: Need 33% equity (2:1 odds)
- Facing 2x pot overbet: Need 40% equity (1.5:1 odds)

**Implied Odds:** Future money you can win on later streets
- Important when drawing to strong hands (flushes, straights)
- Consider opponent's stack and likelihood to pay you off`
        },
        {
            id: 'expected-value',
            title: 'Expected Value (EV)',
            content: `Expected Value is the average amount you win or lose from a decision over the long run.

**Formula:** EV = (Win% × Win Amount) - (Lose% × Lose Amount)

**Example:**
You call $50 into $100 pot with 40% equity
- Win: 40% × $150 = $60
- Lose: 60% × $50 = -$30
- EV = $60 - $30 = +$30

**Positive EV (+EV):** The correct play long-term
**Negative EV (-EV):** A losing play long-term
**Zero EV:** Break-even play

**Key Insight:** Poker decisions should maximize EV, not win rate. Sometimes folding the best hand is +EV if the pot odds aren't right.`
        },
        {
            id: 'ranges',
            title: 'Ranges and Range Advantage',
            content: `A range is all possible hands a player could have in a situation.

**Range vs Hand:**
- Beginners think: "I have AK"
- Advanced players think: "Villain's range is..."

**Range Advantage:**
The player whose range contains more strong hands on a particular board has range advantage.

**Example:**
Board: K♥ 7♠ 2♦
- Raiser has range advantage (has more KK, 77, 22, AK, KQ)
- Caller has fewer premium hands, more middle pairs and draws

**How to Use Range Advantage:**
- With advantage: Bet frequently (c-bet)
- Without advantage: Check more, call when priced in
- As ranges evolve (flop → turn → river), advantage can shift

**Polarization:**
A polarized range contains very strong hands and bluffs, but few medium-strength hands.`
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

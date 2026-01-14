// Practice Scenarios Library
// Curated collection of important poker situations

export const SCENARIO_CATEGORIES = {
    PREFLOP: 'Preflop Essentials',
    CBET: 'C-Betting Fundamentals',
    TURN: 'Turn Barrels',
    RIVER: 'River Decisions',
    BB_DEFENSE: 'Blind Defense',
    THREE_BET_POTS: '3-Bet Pots',
    MULTIWAY: 'Multiway Pots',
    TRICKY: 'Tricky Spots'
};

export const SCENARIOS = [
    // Preflop Essentials
    {
        id: 'pf-001',
        category: SCENARIO_CATEGORIES.PREFLOP,
        title: 'UTG Opening Range - Premium Pairs',
        difficulty: 'easy',
        setup: {
            position: 'UTG',
            hand: 'QQ',
            action: 'First to act, 100bb effective'
        },
        question: 'You are UTG with QQ. What should you do?',
        correctAnswer: 'Raise to 2.5bb',
        explanation: 'QQ is a premium hand that plays well in early position. Always raise for value from UTG. QQ is strong enough to build the pot and plays well postflop in position.',
        commonMistakes: [
            'Limping (never limp in 6-max)',
            'Over-raising to 4bb+ (builds pot too large with marginal equity vs AA/KK)'
        ],
        concepts: ['Position', 'RFI Strategy', 'Premium Hands']
    },
    {
        id: 'pf-002',
        category: SCENARIO_CATEGORIES.PREFLOP,
        title: 'Button Opening Range - Suited Connectors',
        difficulty: 'easy',
        setup: {
            position: 'BTN',
            hand: '76s',
            action: 'Folded to you, 100bb effective'
        },
        question: 'You are on the BTN with 76s. What should you do?',
        correctAnswer: 'Raise to 2.5bb',
        explanation: 'On the button, your opening range is very wide (~48%). 76s has good playability - it makes straights, flushes, and two pairs. Button is the most profitable position, so we raise a wide range.',
        commonMistakes: [
            'Folding (too tight for BTN)',
            'Limping (defeats purpose of position)'
        ],
        concepts: ['Position', 'Button Opening', 'Playability']
    },
    {
        id: 'pf-003',
        category: SCENARIO_CATEGORIES.PREFLOP,
        title: '3-Betting vs BTN - Value 3-Bet',
        difficulty: 'medium',
        setup: {
            position: 'BB',
            hand: 'AJs',
            action: 'BTN raises to 2.5bb, SB folds'
        },
        question: 'BTN raises, you are BB with AJs. What should you do?',
        correctAnswer: '3-bet to 9bb',
        explanation: 'AJs is too strong to just call vs BTN\'s wide range. 3-betting builds the pot with our equity advantage and allows us to win immediately sometimes. We prefer 3-betting to calling to avoid playing OOP postflop.',
        commonMistakes: [
            'Flatting (plays poorly OOP)',
            '3-betting too small (gives opponent good odds)'
        ],
        concepts: ['3-Betting', 'Out of Position', 'Equity Advantage']
    },
    {
        id: 'pf-004',
        category: SCENARIO_CATEGORIES.PREFLOP,
        title: '3-Betting Bluffs - Suited Aces',
        difficulty: 'medium',
        setup: {
            position: 'BB',
            hand: 'A5s',
            action: 'CO raises to 2.5bb, SB folds'
        },
        question: 'CO raises, you are BB with A5s. Should you 3-bet or call?',
        correctAnswer: '3-bet to 9bb (as a bluff)',
        explanation: 'A5s is a polarized 3-bet bluff. It has blocker value (blocks AA, AK) and nut potential (wheel straights, nut flush). We balance our value 3-bets with these hands. Can also call as part of a mixed strategy.',
        commonMistakes: [
            'Always calling (too passive)',
            'Never 3-betting (unbalanced range)'
        ],
        concepts: ['Polarization', 'Blockers', 'Range Balance']
    },

    // C-Betting Fundamentals
    {
        id: 'cb-001',
        category: SCENARIO_CATEGORIES.CBET,
        title: 'C-Bet on Dry Boards',
        difficulty: 'easy',
        setup: {
            position: 'BTN',
            hand: 'AK',
            preflop: 'You raised BTN, BB called',
            flop: 'K♠ 7♦ 2♣',
            pot: '5.5bb'
        },
        question: 'You raised BTN with AK, BB called. Flop: K72 rainbow. What should you do?',
        correctAnswer: 'Bet 3.5bb (67% pot)',
        explanation: 'This is a value bet on a dry board where we have top pair top kicker. Dry boards favor the raiser\'s range. We want to build the pot and protect our hand from overcards. 67% pot is standard sizing.',
        commonMistakes: [
            'Checking (losing value)',
            'Betting too small (not building pot)',
            'Overbetting (unbalanced)'
        ],
        concepts: ['C-Betting', 'Board Texture', 'Value Betting']
    },
    {
        id: 'cb-002',
        category: SCENARIO_CATEGORIES.CBET,
        title: 'C-Bet on Wet Boards',
        difficulty: 'medium',
        setup: {
            position: 'CO',
            hand: 'A♦Q♦',
            preflop: 'You raised CO, BB called',
            flop: 'J♠ T♥ 8♠',
            pot: '5.5bb'
        },
        question: 'You raised CO with A♦Q♦, BB called. Flop: JT8 two-tone. What should you do?',
        correctAnswer: 'Bet 4bb (75% pot) or Check',
        explanation: 'This wet board hits BB\'s calling range hard (many Jx, Tx, straight draws). We have a gutshot and overcards. We can bet as a semi-bluff with a larger sizing to deny equity, or check and realize our equity. Mixed strategy is best.',
        commonMistakes: [
            'Always betting (too aggressive on wet boards)',
            'Small sizing (allows opponent to see turn cheaply)'
        ],
        concepts: ['Wet vs Dry Boards', 'Range Advantage', 'Semi-Bluffing']
    },
    {
        id: 'cb-003',
        category: SCENARIO_CATEGORIES.CBET,
        title: 'C-Bet Frequency on Coordinated Boards',
        difficulty: 'hard',
        setup: {
            position: 'BTN',
            hand: '9♣ 8♣',
            preflop: 'You raised BTN, BB called',
            flop: 'K♥ Q♠ J♦',
            pot: '5.5bb'
        },
        question: 'You raised BTN with 98s, BB called. Flop: KQJ rainbow. You completely missed. Bet or check?',
        correctAnswer: 'Check',
        explanation: 'This ultra-connected board heavily favors BB\'s calling range. Many broadway cards connect, and our hand has very little equity (only a gutshot). We should check most of our range here and give up on this hand.',
        commonMistakes: [
            'C-betting anyway (burning money)',
            'Trying to bluff every flop (unbalanced)'
        ],
        concepts: ['Board Coverage', 'Range Disadvantage', 'Pot Control']
    },

    // BB Defense
    {
        id: 'bb-001',
        category: SCENARIO_CATEGORIES.BB_DEFENSE,
        title: 'Defending BB vs UTG',
        difficulty: 'easy',
        setup: {
            position: 'BB',
            hand: 'T9s',
            action: 'UTG raises to 2.5bb, folds to you'
        },
        question: 'UTG raises, you have T9s in BB. What should you do?',
        correctAnswer: 'Call',
        explanation: 'T9s is a call vs UTG. It\'s too weak to 3-bet against UTG\'s tight range, but too strong to fold getting 3.5:1 pot odds. It plays reasonably well postflop with straight and flush potential.',
        commonMistakes: [
            'Folding (too tight)',
            '3-betting (too loose vs UTG range)'
        ],
        concepts: ['BB Defense', 'Pot Odds', 'Position']
    },
    {
        id: 'bb-002',
        category: SCENARIO_CATEGORIES.BB_DEFENSE,
        title: 'Defending BB vs BTN - Wide Range',
        difficulty: 'medium',
        setup: {
            position: 'BB',
            hand: 'Q8s',
            action: 'Folds to BTN who raises 2.5bb, SB folds'
        },
        question: 'BTN raises, you have Q8s in BB. What should you do?',
        correctAnswer: 'Call',
        explanation: 'Against BTN\'s wide range (~48%), Q8s is a profitable call. We\'re getting good pot odds (3.5:1) and BTN opens many worse hands. Q8s has playability and can make strong pairs, straights, and flushes.',
        commonMistakes: [
            'Folding (too tight vs wide BTN range)',
            'Always 3-betting (can also call)'
        ],
        concepts: ['Exploiting Wide Ranges', 'Pot Odds', 'Hand Playability']
    },

    // 3-Bet Pots
    {
        id: '3bp-001',
        category: SCENARIO_CATEGORIES.THREE_BET_POTS,
        title: 'C-Betting in 3-Bet Pot as Aggressor',
        difficulty: 'medium',
        setup: {
            position: 'BTN',
            hand: 'A♥ Q♣',
            preflop: 'CO raised 2.5bb, you 3-bet to 9bb on BTN, CO called',
            flop: 'K♠ 8♦ 3♥',
            pot: '19bb'
        },
        question: 'You 3-bet pre with AQ, CO called. Flop: K83 rainbow. Bet or check?',
        correctAnswer: 'Bet 13bb (67% pot)',
        explanation: 'As the 3-bettor, you have range advantage on this king-high dry board. You should c-bet frequently here, even when you miss. This board favors your range (many AK, KK combinations). AQ has overcards and can improve.',
        commonMistakes: [
            'Giving up (too passive)',
            'Checking without a plan'
        ],
        concepts: ['3-Bet Pots', 'Range Advantage', 'Aggression']
    },

    // Turn Play
    {
        id: 'turn-001',
        category: SCENARIO_CATEGORIES.TURN,
        title: 'Turn Barrel - Following Through',
        difficulty: 'medium',
        setup: {
            position: 'BTN',
            hand: 'A♠ K♠',
            preflop: 'You raised BTN, BB called',
            flop: 'Q♥ 7♣ 2♦ - You bet, BB called',
            turn: '5♠',
            pot: '13bb'
        },
        question: 'You c-bet flop with AK high, BB called. Turn: blank (5♠). Bet again or give up?',
        correctAnswer: 'Bet 9bb (67% pot) or give up depending on opponent',
        explanation: 'This is a close decision. The turn is a complete blank. If villain is a calling station, give up. Against thinking players who might fold Qx or middle pairs to pressure, we can barrel again. We have 6 outs to improve.',
        commonMistakes: [
            'Always barreling (vs calling stations)',
            'Never barreling (too passive)'
        ],
        concepts: ['Turn Barrels', 'Opponent Tendencies', 'Equity']
    },

    // River Decisions
    {
        id: 'river-001',
        category: SCENARIO_CATEGORIES.RIVER,
        title: 'Value Betting River - Thin Value',
        difficulty: 'hard',
        setup: {
            position: 'CO',
            hand: 'A♣ J♥',
            preflop: 'You raised CO, BB called',
            flop: 'A♠ 8♦ 4♣ - You bet, BB called',
            turn: '2♥ - You bet, BB called',
            river: '7♠',
            pot: '30bb'
        },
        question: 'You bet flop and turn with AJ on A84-2-7. Villain called twice. Bet or check river?',
        correctAnswer: 'Bet 20bb (67% pot) for thin value',
        explanation: 'Villain has called twice but not raised, likely indicating a weak Ax, middle pair, or draw. River is a brick. We can bet for thin value - villain will call with worse Ax (AT, A9, A5) and fold complete air. Check loses value against weak aces.',
        commonMistakes: [
            'Checking (losing value vs weak aces)',
            'Overbetting (folds out all worse hands)'
        ],
        concepts: ['Thin Value Betting', 'Hand Reading', 'River Play']
    },

    // Multiway Pots
    {
        id: 'multi-001',
        category: SCENARIO_CATEGORIES.MULTIWAY,
        title: 'Multiway C-Betting',
        difficulty: 'hard',
        setup: {
            position: 'BTN',
            hand: 'A♠ K♦',
            preflop: 'You raised BTN, SB and BB both called',
            flop: 'K♥ J♣ 9♠',
            pot: '7.5bb',
            players: 3
        },
        question: 'You raised BTN with AK, both blinds called. Flop: KJ9. Bet or check in 3-way pot?',
        correctAnswer: 'Bet 5bb (67% pot)',
        explanation: 'Even multiway, top pair top kicker is strong. We need to protect against draws and worse kings. Bet for value and protection. However, be prepared to slow down if raised - someone could have flopped two pair or a straight.',
        commonMistakes: [
            'Checking (giving free cards)',
            'Betting too small (allowing draws to see turn cheaply)'
        ],
        concepts: ['Multiway Pots', 'Protection', 'Value Betting']
    },

    // Tricky Spots
    {
        id: 'tricky-001',
        category: SCENARIO_CATEGORIES.TRICKY,
        title: 'Facing a Check-Raise',
        difficulty: 'hard',
        setup: {
            position: 'BTN',
            hand: 'A♥ T♥',
            preflop: 'You raised BTN, BB called',
            flop: 'T♠ 7♥ 3♣ - You bet, BB raises 3x',
            pot: '16bb (after check-raise)'
        },
        question: 'You c-bet with AT on T73, BB check-raises. What should you do?',
        correctAnswer: 'Call',
        explanation: 'Top pair good kicker is too strong to fold to a single check-raise. Villain could be semi-bluffing with draws, check-raising worse Tx, or value-raising sets. We call and reassess on turn. Only fold to significant aggression or vs a very tight player.',
        commonMistakes: [
            'Folding (too weak)',
            '3-betting (building pot OOP with marginal hand)'
        ],
        concepts: ['Check-Raises', 'Hand Strength', 'Pot Control']
    },
    {
        id: 'tricky-002',
        category: SCENARIO_CATEGORIES.TRICKY,
        title: 'Facing Overbet',
        difficulty: 'hard',
        setup: {
            position: 'CO',
            hand: 'K♣ Q♣',
            preflop: 'You raised CO, BB called',
            flop: 'K♠ 9♦ 2♥ - You bet, BB called',
            turn: '5♣ - You bet, BB called',
            river: 'A♠ - You check, BB overbets 2x pot',
            pot: '60bb before overbet'
        },
        question: 'You checked river with KQ on K925A board. Villain overbets 120bb into 60bb. Call or fold?',
        correctAnswer: 'Fold',
        explanation: 'The ace is a terrible river card for you - villain\'s overbet polarizes their range to Ax (mostly) or bluffs. Your KQ is now a bluff-catcher. Against an overbet, we need the nuts or near-nuts to call. Villain likely has Ax or is bluffing missed draws. We\'re not getting the right price to call as a bluff-catcher.',
        commonMistakes: [
            'Calling (bad pot odds vs polarized range)',
            'Not considering ace changed board dynamic'
        ],
        concepts: ['Polarization', 'Bluff-Catchers', 'River Overbets']
    }
];

// Helper functions
export function getScenariosByCategory(category) {
    return SCENARIOS.filter(s => s.category === category);
}

export function getScenariosByDifficulty(difficulty) {
    return SCENARIOS.filter(s => s.difficulty === difficulty);
}

export function getScenarioByConcept(concept) {
    return SCENARIOS.filter(s => s.concepts && s.concepts.includes(concept));
}

export function getRandomScenario(category = null) {
    const pool = category ? getScenariosByCategory(category) : SCENARIOS;
    return pool[Math.floor(Math.random() * pool.length)];
}

export default {
    SCENARIO_CATEGORIES,
    SCENARIOS,
    getScenariosByCategory,
    getScenariosByDifficulty,
    getScenarioByConcept,
    getRandomScenario
};

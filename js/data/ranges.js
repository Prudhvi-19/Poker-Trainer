// GTO Ranges for 6-max Texas Hold'em Cash Games
// Based on standard GTO solver outputs and modern poker theory

// Hand categories for easier range building
const PREMIUMS = ['AA', 'KK', 'QQ', 'JJ', 'TT', 'AKs', 'AQs', 'AKo'];

const BROADWAY_PAIRS = ['99', '88', '77'];

const HIGH_SUITED_BROADWAY = ['AJs', 'ATs', 'KQs', 'KJs', 'QJs'];

const MED_SUITED_BROADWAY = ['KTs', 'QTs', 'JTs', 'T9s'];

const SUITED_CONNECTORS = ['98s', '87s', '76s', '65s', '54s'];

const SUITED_ONE_GAPPERS = ['T8s', '97s', '86s', '75s', '64s'];

const SUITED_ACES = ['A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s'];

const HIGH_OFFSUIT_BROADWAY = ['AQo', 'AJo', 'ATo', 'KQo'];

const MED_OFFSUIT_BROADWAY = ['KJo', 'KTo', 'QJo', 'QTo', 'JTo'];

const SMALL_PAIRS = ['66', '55', '44', '33', '22'];

const LOW_SUITED_KINGS = ['K9s', 'K8s', 'K7s', 'K6s', 'K5s', 'K4s'];

const LOW_SUITED_QUEENS = ['Q9s', 'Q8s', 'Q7s', 'Q6s'];

const LOW_SUITED_JACKS = ['J9s', 'J8s', 'J7s'];

const LOW_SUITED_CONNECTORS = ['43s', '32s'];

const LOW_OFFSUIT_ACES = ['A9o', 'A8o', 'A7o', 'A6o', 'A5o', 'A4o', 'A3o', 'A2o'];

const LOW_OFFSUIT_KINGS = ['K9o', 'K8o', 'K7o'];

const LOW_OFFSUIT_QUEENS = ['Q9o', 'Q8o'];

const LOW_OFFSUIT_JACKS = ['J9o'];

// RFI (Raise First In) Ranges
export const RFI_RANGES = {
    UTG: [ // ~15% of hands
        ...PREMIUMS,
        ...BROADWAY_PAIRS,
        '66', '55',
        ...HIGH_SUITED_BROADWAY,
        'KTs', 'QTs', 'JTs', 'T9s',
        '98s', '87s', '76s',
        'A9s', 'A5s', 'A4s',
        'KQo'
    ],
    HJ: [ // ~18% of hands
        ...PREMIUMS,
        ...BROADWAY_PAIRS,
        ...SMALL_PAIRS,
        ...HIGH_SUITED_BROADWAY,
        ...MED_SUITED_BROADWAY,
        '98s', '87s', '76s', '65s',
        'T8s', '97s',
        ...SUITED_ACES,
        'K9s',
        'AQo', 'AJo', 'KQo', 'KJo'
    ],
    CO: [ // ~28% of hands
        ...PREMIUMS,
        ...BROADWAY_PAIRS,
        ...SMALL_PAIRS,
        ...HIGH_SUITED_BROADWAY,
        ...MED_SUITED_BROADWAY,
        ...SUITED_CONNECTORS,
        ...SUITED_ONE_GAPPERS,
        '54s', '43s',
        ...SUITED_ACES,
        'K9s', 'K8s', 'K7s',
        'Q9s', 'Q8s',
        'J9s', 'J8s',
        ...HIGH_OFFSUIT_BROADWAY,
        'KJo', 'KTo', 'QJo', 'QTo', 'JTo',
        'A9o', 'A8o', 'A7o',
        'K9o'
    ],
    BTN: [ // ~48% of hands - widest range
        ...PREMIUMS,
        ...BROADWAY_PAIRS,
        ...SMALL_PAIRS,
        ...HIGH_SUITED_BROADWAY,
        ...MED_SUITED_BROADWAY,
        ...SUITED_CONNECTORS,
        ...SUITED_ONE_GAPPERS,
        ...LOW_SUITED_CONNECTORS,
        ...SUITED_ACES,
        ...LOW_SUITED_KINGS,
        ...LOW_SUITED_QUEENS,
        ...LOW_SUITED_JACKS,
        'T7s', '96s', '85s', '74s', '63s', '52s',
        ...HIGH_OFFSUIT_BROADWAY,
        ...MED_OFFSUIT_BROADWAY,
        ...LOW_OFFSUIT_ACES,
        ...LOW_OFFSUIT_KINGS,
        ...LOW_OFFSUIT_QUEENS,
        ...LOW_OFFSUIT_JACKS,
        'T9o', 'T8o',
        'Q7o', 'J8o'
    ],
    SB: [ // ~45% of hands vs BB
        ...PREMIUMS,
        ...BROADWAY_PAIRS,
        ...SMALL_PAIRS,
        ...HIGH_SUITED_BROADWAY,
        ...MED_SUITED_BROADWAY,
        ...SUITED_CONNECTORS,
        ...SUITED_ONE_GAPPERS,
        '54s', '43s', '32s',
        ...SUITED_ACES,
        ...LOW_SUITED_KINGS,
        ...LOW_SUITED_QUEENS,
        'J9s', 'J8s', 'J7s',
        'T7s', '96s', '85s',
        ...HIGH_OFFSUIT_BROADWAY,
        ...MED_OFFSUIT_BROADWAY,
        ...LOW_OFFSUIT_ACES,
        'K9o', 'K8o',
        'Q9o',
        'J9o',
        'T9o'
    ]
};

// 3-Bet Ranges vs each position
export const THREE_BET_RANGES = {
    vsUTG: [ // Tight, ~5%
        'AA', 'KK', 'QQ', 'JJ', 'TT',
        'AKs', 'AQs', 'AJs',
        'AKo',
        'A5s', 'A4s', // For balance
        'KQs'
    ],
    vsHJ: [ // ~6%
        'AA', 'KK', 'QQ', 'JJ', 'TT', '99',
        'AKs', 'AQs', 'AJs', 'ATs',
        'KQs', 'KJs',
        'AKo', 'AQo',
        'A5s', 'A4s', 'A3s', 'A2s', // Bluffs
        '76s', '65s' // Suited connectors as bluffs
    ],
    vsCO: [ // ~8%
        'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88',
        'AKs', 'AQs', 'AJs', 'ATs', 'A9s',
        'KQs', 'KJs', 'KTs',
        'QJs', 'QTs',
        'JTs',
        'AKo', 'AQo', 'AJo',
        ...SUITED_ACES, // More suited aces
        '87s', '76s', '65s', '54s',
        'T9s'
    ],
    vsBTN: [ // ~11% - defend wider vs BTN
        'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77',
        'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
        'KQs', 'KJs', 'KTs', 'K9s',
        'QJs', 'QTs', 'Q9s',
        'JTs', 'J9s',
        'T9s', 'T8s',
        '98s', '87s', '76s', '65s', '54s',
        'AKo', 'AQo', 'AJo', 'ATo',
        'KQo'
    ],
    vsSB: [ // BB vs SB 3-bet, ~14%
        'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55',
        'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
        'KQs', 'KJs', 'KTs', 'K9s', 'K8s',
        'QJs', 'QTs', 'Q9s',
        'JTs', 'J9s', 'J8s',
        'T9s', 'T8s',
        '98s', '87s', '76s', '65s', '54s', '43s',
        'AKo', 'AQo', 'AJo', 'ATo', 'A9o',
        'KQo', 'KJo'
    ]
};

// BB Defense Ranges (Call or 3-bet)
export const BB_DEFENSE_RANGES = {
    vsUTG: [ // ~15% total
        // 3-bet hands (from THREE_BET_RANGES.vsUTG)
        // Plus calling hands:
        'TT', '99', '88', '77', '66', '55', '44', '33', '22',
        'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
        'KQs', 'KJs', 'KTs',
        'QJs', 'QTs', 'Q9s',
        'JTs', 'J9s',
        'T9s', 'T8s',
        '98s', '87s', '76s', '65s',
        'AKo', 'AQo', 'AJo',
        'KQo'
    ],
    vsHJ: [ // ~20%
        '99', '88', '77', '66', '55', '44', '33', '22',
        'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
        'KQs', 'KJs', 'KTs', 'K9s',
        'QJs', 'QTs', 'Q9s',
        'JTs', 'J9s', 'J8s',
        'T9s', 'T8s', 'T7s',
        '98s', '87s', '76s', '65s', '54s',
        'AKo', 'AQo', 'AJo', 'ATo',
        'KQo', 'KJo'
    ],
    vsCO: [ // ~27%
        ...SMALL_PAIRS,
        'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
        'KQs', 'KJs', 'KTs', 'K9s', 'K8s',
        'QJs', 'QTs', 'Q9s', 'Q8s',
        'JTs', 'J9s', 'J8s',
        'T9s', 'T8s', 'T7s',
        '98s', '87s', '76s', '65s', '54s', '43s',
        '97s', '86s',
        'AKo', 'AQo', 'AJo', 'ATo', 'A9o',
        'KQo', 'KJo', 'KTo',
        'QJo', 'QTo'
    ],
    vsBTN: [ // ~40% - very wide defense
        ...SMALL_PAIRS,
        ...SUITED_ACES,
        'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'K7s', 'K6s',
        'QJs', 'QTs', 'Q9s', 'Q8s', 'Q7s',
        'JTs', 'J9s', 'J8s', 'J7s',
        'T9s', 'T8s', 'T7s',
        '98s', '87s', '76s', '65s', '54s', '43s', '32s',
        '97s', '86s', '75s', '64s',
        'AKo', 'AQo', 'AJo', 'ATo', 'A9o', 'A8o', 'A7o', 'A6o', 'A5o',
        'KQo', 'KJo', 'KTo', 'K9o',
        'QJo', 'QTo', 'Q9o',
        'JTo', 'J9o',
        'T9o'
    ],
    vsSB: [ // ~55% - widest defense
        ...SMALL_PAIRS,
        ...SUITED_ACES,
        ...LOW_SUITED_KINGS,
        ...LOW_SUITED_QUEENS,
        ...LOW_SUITED_JACKS,
        'K4s', 'K3s', 'K2s',
        'Q6s', 'Q5s', 'Q4s',
        'J6s',
        'T9s', 'T8s', 'T7s', 'T6s',
        '98s', '97s', '96s',
        '87s', '86s', '85s',
        '76s', '75s', '74s',
        '65s', '64s', '63s',
        '54s', '53s', '52s',
        '43s', '42s',
        '32s',
        ...LOW_OFFSUIT_ACES,
        'A4o', 'A3o', 'A2o',
        'KQo', 'KJo', 'KTo', 'K9o', 'K8o', 'K7o',
        'QJo', 'QTo', 'Q9o', 'Q8o',
        'JTo', 'J9o', 'J8o',
        'T9o', 'T8o',
        '98o', '87o'
    ]
};

// Calling ranges vs 3-bets (for 4-bet trainer)
export const CALL_3BET_RANGES = {
    vsUTG: ['QQ', 'JJ', 'TT', 'AQs', 'AJs', 'KQs'],
    vsHJ: ['JJ', 'TT', '99', 'AQs', 'AJs', 'ATs', 'KQs', 'QJs', 'AQo'],
    vsCO: ['TT', '99', '88', 'AJs', 'ATs', 'KQs', 'KJs', 'QJs', 'AQo', 'AJo'],
    vsBTN: ['99', '88', '77', 'ATs', 'A9s', 'KQs', 'KJs', 'QJs', 'JTs', 'AQo', 'AJo', 'KQo'],
    vsSB: ['88', '77', '66', 'ATs', 'A9s', 'A8s', 'KJs', 'KTs', 'QJs', 'JTs', 'AJo', 'ATo', 'KQo']
};

// 4-Bet ranges (for advanced play)
export const FOUR_BET_RANGES = {
    vsUTG: ['AA', 'KK', 'QQ', 'AKs', 'AKo'],
    vsHJ: ['AA', 'KK', 'QQ', 'JJ', 'AKs', 'AKo', 'A5s'], // A5s as bluff
    vsCO: ['AA', 'KK', 'QQ', 'JJ', 'TT', 'AKs', 'AKo', 'AQs', 'A5s', 'A4s'],
    vsBTN: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', 'AKs', 'AKo', 'AQs', 'A5s', 'A4s', 'A3s', 'KQs'],
    vsSB: ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', 'AKs', 'AKo', 'AQs', 'AJs', 'A5s', 'A4s', 'A3s', 'A2s', 'KQs']
};

// Helper function to check if hand is in range
export function isInRange(hand, range) {
    if (!hand || !range) return false;

    const handString = typeof hand === 'string' ? hand : hand.display;

    return range.includes(handString);
}

// Get range size
export function getRangeSize(range) {
    if (!range) return 0;

    let combos = 0;

    range.forEach(hand => {
        if (hand.length === 2) {
            // Pair (e.g., 'AA')
            combos += 6;
        } else if (hand.endsWith('s')) {
            // Suited (e.g., 'AKs')
            combos += 4;
        } else if (hand.endsWith('o')) {
            // Offsuit (e.g., 'AKo')
            combos += 12;
        }
    });

    return combos;
}

// Get range percentage (out of 1326 possible starting hands)
export function getRangePercentage(range) {
    const combos = getRangeSize(range);
    return (combos / 1326) * 100;
}

// Get recommended action for a hand in a position
export function getRecommendedAction(hand, position, action = 'rfi') {
    const handString = typeof hand === 'string' ? hand : hand.display;

    switch (action) {
        case 'rfi':
            return isInRange(handString, RFI_RANGES[position]) ? 'raise' : 'fold';

        case '3bet':
            const posKey = `vs${position}`;
            return isInRange(handString, THREE_BET_RANGES[posKey]) ? 'raise' : 'fold';

        case 'bb-defense':
            return isInRange(handString, BB_DEFENSE_RANGES[`vs${position}`]) ? 'call' : 'fold';

        default:
            return null;
    }
}

export default {
    RFI_RANGES,
    THREE_BET_RANGES,
    BB_DEFENSE_RANGES,
    CALL_3BET_RANGES,
    FOUR_BET_RANGES,
    isInRange,
    getRangeSize,
    getRangePercentage,
    getRecommendedAction
};

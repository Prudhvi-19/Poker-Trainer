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
    UTG: [ // ~16% of hands (standard GTO 15-17%)
        ...PREMIUMS,
        ...BROADWAY_PAIRS,
        '66', '55', '44', // Added 44
        ...HIGH_SUITED_BROADWAY,
        'KTs', 'QTs', 'JTs', 'T9s',
        '98s', '87s', '76s', '65s', // Added 65s
        'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s', // All suited aces
        'KQo', 'AJo' // Added AJo
    ],
    HJ: [ // ~21% of hands (standard GTO 19-22%)
        ...PREMIUMS,
        ...BROADWAY_PAIRS,
        ...SMALL_PAIRS,
        ...HIGH_SUITED_BROADWAY,
        ...MED_SUITED_BROADWAY,
        '98s', '87s', '76s', '65s', '54s', // Added 54s
        'T8s', '97s', '86s', // Added 86s
        ...SUITED_ACES,
        'K9s', 'K8s', // Added K8s
        'Q9s', // Added Q9s
        'AQo', 'AJo', 'ATo', 'KQo', 'KJo' // Added ATo
    ],
    CO: [ // ~28% of hands
        ...PREMIUMS,
        ...BROADWAY_PAIRS,
        ...SMALL_PAIRS,
        ...HIGH_SUITED_BROADWAY,
        ...MED_SUITED_BROADWAY,
        ...SUITED_CONNECTORS,
        ...SUITED_ONE_GAPPERS,
        '43s', // 54s already in SUITED_CONNECTORS
        ...SUITED_ACES,
        'K9s', 'K8s', 'K7s',
        'Q9s', 'Q8s',
        'J9s', 'J8s',
        ...HIGH_OFFSUIT_BROADWAY,
        'KJo', 'KTo', 'QJo', 'QTo', 'JTo',
        'A9o', 'A8o', 'A7o',
        'K9o'
    ],
    BTN: [ // ~50% of hands - widest range (standard GTO 48-52%)
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
        'T7s', '96s', '85s', '74s', '63s', '52s', '42s', // Added 42s
        ...HIGH_OFFSUIT_BROADWAY,
        ...MED_OFFSUIT_BROADWAY,
        ...LOW_OFFSUIT_ACES,
        ...LOW_OFFSUIT_KINGS,
        ...LOW_OFFSUIT_QUEENS,
        ...LOW_OFFSUIT_JACKS,
        'T9o', 'T8o', 'T7o', // Added T7o
        '98o', '97o', // Added 98o, 97o
        '87o', '86o', // Added 87o, 86o
        '76o', // Added 76o
        'Q7o', 'J8o', 'J7o' // Added J7o
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
        'AKs', 'AQs', 'AJs', 'ATs',
        'KQs', 'KJs', 'KTs',
        'QJs', 'QTs',
        'JTs',
        'AKo', 'AQo', 'AJo',
        ...SUITED_ACES, // All suited aces (A9s through A2s)
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

// BB Defense Ranges - CALLING only (3-bet hands are in BB_3BET_RANGES)
export const BB_DEFENSE_RANGES = {
    vsUTG: [ // ~20% call range (tight defense vs UTG, standard GTO ~18-22%)
        '99', '88', '77', '66', '55', '44', '33', '22', // Pairs (excluding premiums in 3-bet range)
        'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', // Suited aces
        'KQs', 'KJs', 'KTs', 'K9s', // Suited kings
        'QJs', 'QTs', 'Q9s', // Suited queens
        'JTs', 'J9s', 'J8s', // Suited jacks
        'T9s', 'T8s', // Suited tens
        '98s', '97s', '87s', '76s', '65s', '54s', // Suited connectors
        'AQo', 'AJo', 'ATo', // Offsuit broadways
        'KQo', 'KJo' // Offsuit kings
    ],
    vsHJ: [ // ~25% call range (standard GTO ~22-28%)
        '99', '88', '77', '66', '55', '44', '33', '22', // Pairs
        'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', // Suited aces
        'KQs', 'KJs', 'KTs', 'K9s', 'K8s', // Suited kings
        'QJs', 'QTs', 'Q9s', 'Q8s', // Suited queens
        'JTs', 'J9s', 'J8s', // Suited jacks
        'T9s', 'T8s', 'T7s', // Suited tens
        '98s', '97s', '87s', '86s', '76s', '65s', '54s', '43s', // Suited connectors
        'AQo', 'AJo', 'ATo', 'A9o', // Offsuit aces
        'KQo', 'KJo', 'KTo', // Offsuit kings
        'QJo' // Offsuit queens
    ],
    vsCO: [ // ~30% call range (standard GTO defense ~27-35%)
        'TT', '99', '88', ...SMALL_PAIRS,
        'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s', // All suited aces
        'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'K7s', 'K6s', // More suited kings
        'QJs', 'QTs', 'Q9s', 'Q8s', 'Q7s', // More suited queens
        'JTs', 'J9s', 'J8s', 'J7s', // More suited jacks
        'T9s', 'T8s', 'T7s',
        '98s', '97s', '87s', '86s', '76s', '75s', '65s', '64s', '54s', '43s', // More suited connectors/gappers
        'AQo', 'AJo', 'ATo', 'A9o', 'A8o', 'A7o', 'A6o', 'A5o', // More offsuit aces
        'KQo', 'KJo', 'KTo', 'K9o', // More offsuit kings
        'QJo', 'QTo', 'Q9o', // More offsuit queens
        'JTo', 'J9o', // Added offsuit jacks
        'T9o' // Added T9o
    ],
    vsBTN: [ // ~40% call range - very wide defense
        '99', '88', '77', ...SMALL_PAIRS,
        ...SUITED_ACES,
        'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'K7s', 'K6s',
        'QJs', 'QTs', 'Q9s', 'Q8s', 'Q7s',
        'JTs', 'J9s', 'J8s', 'J7s',
        'T9s', 'T8s', 'T7s',
        '98s', '87s', '76s', '65s', '54s', '43s', '32s',
        '97s', '86s', '75s', '64s',
        'AQo', 'AJo', 'ATo', 'A9o', 'A8o', 'A7o', 'A6o', 'A5o',
        'KQo', 'KJo', 'KTo', 'K9o',
        'QJo', 'QTo', 'Q9o',
        'JTo', 'J9o',
        'T9o'
    ],
    vsSB: [ // ~55% call range - widest defense
        '99', '88', '77', ...SMALL_PAIRS,
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

// BB 3-Bet Ranges vs each position (for BB Defense trainer)
export const BB_3BET_RANGES = {
    vsUTG: [ // Tight 3-bet range vs UTG, ~5%
        'AA', 'KK', 'QQ', 'JJ',
        'AKs', 'AQs', 'AJs',
        'AKo',
        'A5s', 'A4s' // Bluffs with blockers
    ],
    vsHJ: [ // ~6%
        'AA', 'KK', 'QQ', 'JJ', 'TT',
        'AKs', 'AQs', 'AJs', 'ATs',
        'KQs',
        'AKo', 'AQo',
        'A5s', 'A4s', 'A3s' // Bluffs
    ],
    vsCO: [ // ~8%
        'AA', 'KK', 'QQ', 'JJ', 'TT', '99',
        'AKs', 'AQs', 'AJs', 'ATs', 'A9s',
        'KQs', 'KJs',
        'QJs',
        'AKo', 'AQo', 'AJo',
        'A5s', 'A4s', 'A3s', 'A2s', // Suited ace bluffs
        '76s', '65s' // Suited connector bluffs
    ],
    vsBTN: [ // ~11% - wider defense vs BTN
        'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88',
        'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s',
        'KQs', 'KJs', 'KTs',
        'QJs', 'QTs',
        'JTs',
        'AKo', 'AQo', 'AJo', 'ATo',
        'KQo',
        'A5s', 'A4s', 'A3s', 'A2s',
        '87s', '76s', '65s', '54s'
    ],
    vsSB: [ // ~14% - widest 3-bet (blind vs blind)
        'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66',
        'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
        'KQs', 'KJs', 'KTs', 'K9s',
        'QJs', 'QTs', 'Q9s',
        'JTs', 'J9s',
        'T9s',
        '98s', '87s', '76s', '65s', '54s',
        'AKo', 'AQo', 'AJo', 'ATo', 'A9o',
        'KQo', 'KJo'
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

// Cold calling ranges (facing a raise, not in blinds)
export const COLD_CALL_RANGES = {
    vsUTG: [ // Very tight, prefer 3-bet or fold
        'JJ', 'TT', '99', '88', '77',
        'AJs', 'ATs', 'KQs', 'QJs', 'JTs',
        'AQo'
    ],
    vsHJ: [
        'TT', '99', '88', '77', '66', '55',
        'AJs', 'ATs', 'A9s', 'KQs', 'KJs', 'QJs', 'JTs', 'T9s',
        'AQo', 'AJo'
    ],
    vsCO: [
        '99', '88', '77', '66', '55', '44', '33', '22',
        'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s',
        'KJs', 'KTs', 'QJs', 'QTs', 'JTs', 'T9s', '98s', '87s', '76s',
        'AJo', 'ATo', 'KQo'
    ],
    vsBTN: [
        '88', '77', '66', '55', '44', '33', '22',
        'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
        'KTs', 'K9s', 'QJs', 'QTs', 'JTs', 'J9s', 'T9s', '98s', '87s', '76s', '65s', '54s',
        'AJo', 'ATo', 'KQo', 'KJo'
    ],
    vsSB: [
        '77', '66', '55', '44', '33', '22',
        'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
        'KJs', 'KTs', 'K9s', 'QJs', 'QTs', 'JTs', 'J9s', 'T9s', 'T8s', '98s', '87s', '76s', '65s', '54s',
        'ATo', 'A9o', 'KQo', 'KJo', 'QJo'
    ]
};

// Squeeze ranges (facing raise + call[s])
export const SQUEEZE_RANGES = {
    vsUTG: [ // Tight - original raiser is strong
        'AA', 'KK', 'QQ', 'JJ',
        'AKs', 'AQs',
        'AKo'
    ],
    vsHJ: [
        'AA', 'KK', 'QQ', 'JJ', 'TT',
        'AKs', 'AQs', 'AJs',
        'AKo', 'AQo',
        'A5s', 'A4s' // Bluffs
    ],
    vsCO: [
        'AA', 'KK', 'QQ', 'JJ', 'TT', '99',
        'AKs', 'AQs', 'AJs', 'ATs',
        'KQs', 'KJs',
        'AKo', 'AQo',
        'A5s', 'A4s', 'A3s', 'A2s',
        '76s', '65s' // Bluffs
    ],
    vsBTN: [ // Wider - BTN likely weak
        'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77',
        'AKs', 'AQs', 'AJs', 'ATs', 'A9s',
        'KQs', 'KJs', 'KTs',
        'QJs', 'JTs',
        'AKo', 'AQo', 'AJo',
        ...SUITED_ACES, // More bluffs
        '87s', '76s', '65s', '54s'
    ],
    vsSB: [ // Very wide
        'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66',
        'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
        'KQs', 'KJs', 'KTs', 'K9s',
        'QJs', 'QTs',
        'JTs', 'T9s',
        '98s', '87s', '76s', '65s', '54s',
        'AKo', 'AQo', 'AJo', 'ATo',
        'KQo'
    ]
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
            const bbKey = `vs${position}`;
            // Check 3-bet range first, then call range
            if (isInRange(handString, BB_3BET_RANGES[bbKey])) {
                return 'raise';
            } else if (isInRange(handString, BB_DEFENSE_RANGES[bbKey])) {
                return 'call';
            }
            return 'fold';

        default:
            return null;
    }
}

export default {
    RFI_RANGES,
    THREE_BET_RANGES,
    BB_DEFENSE_RANGES,
    BB_3BET_RANGES,
    CALL_3BET_RANGES,
    FOUR_BET_RANGES,
    COLD_CALL_RANGES,
    SQUEEZE_RANGES,
    isInRange,
    getRangeSize,
    getRangePercentage,
    getRecommendedAction
};

// GTO Ranges for 6-max Texas Hold'em Cash Games
// Based on standard GTO solver outputs and modern poker theory
// AUDITED: All ranges checked for consistency - no duplicates between raise/call

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

// ============================================
// RFI (Raise First In) Ranges
// ============================================
export const RFI_RANGES = {
    UTG: [ // ~16% of hands (standard GTO 15-17%)
        ...PREMIUMS,
        ...BROADWAY_PAIRS,
        '66', '55', '44',
        ...HIGH_SUITED_BROADWAY,
        'KTs', 'QTs', 'JTs', 'T9s',
        '98s', '87s', '76s', '65s',
        'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
        'AQo', 'AJo', 'KQo'
    ],
    HJ: [ // ~21% of hands (standard GTO 19-22%)
        ...PREMIUMS,
        ...BROADWAY_PAIRS,
        ...SMALL_PAIRS,
        ...HIGH_SUITED_BROADWAY,
        ...MED_SUITED_BROADWAY,
        '98s', '87s', '76s', '65s', '54s',
        'T8s', '97s', '86s',
        ...SUITED_ACES,
        'K9s', 'K8s',
        'Q9s',
        'AQo', 'AJo', 'ATo', 'KQo', 'KJo'
    ],
    CO: [ // ~28% of hands
        ...PREMIUMS,
        ...BROADWAY_PAIRS,
        ...SMALL_PAIRS,
        ...HIGH_SUITED_BROADWAY,
        ...MED_SUITED_BROADWAY,
        ...SUITED_CONNECTORS,
        ...SUITED_ONE_GAPPERS,
        '43s',
        ...SUITED_ACES,
        'K9s', 'K8s', 'K7s',
        'Q9s', 'Q8s',
        'J9s', 'J8s',
        ...HIGH_OFFSUIT_BROADWAY,
        'KJo', 'KTo', 'QJo', 'QTo', 'JTo',
        'A9o', 'A8o', 'A7o', 'A6o', 'A5o',
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
        'T7s', '96s', '85s', '74s', '63s', '52s', '42s',
        ...HIGH_OFFSUIT_BROADWAY,
        ...MED_OFFSUIT_BROADWAY,
        ...LOW_OFFSUIT_ACES,
        ...LOW_OFFSUIT_KINGS,
        ...LOW_OFFSUIT_QUEENS,
        ...LOW_OFFSUIT_JACKS,
        'T9o', 'T8o', 'T7o',
        '98o', '97o',
        '87o', '86o',
        '76o',
        'Q7o', 'J8o', 'J7o'
    ],
    SB: [ // ~45% of hands vs BB
        ...PREMIUMS,
        ...BROADWAY_PAIRS,
        ...SMALL_PAIRS,
        ...HIGH_SUITED_BROADWAY,
        ...MED_SUITED_BROADWAY,
        ...SUITED_CONNECTORS,
        ...SUITED_ONE_GAPPERS,
        '43s', '32s',
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

// ============================================
// 3-Bet Ranges vs each position
// ============================================
export const THREE_BET_RANGES = {
    vsUTG: [ // Tight, ~5%
        'AA', 'KK', 'QQ', 'JJ', 'TT',
        'AKs', 'AQs', 'AJs',
        'AKo',
        'A5s', 'A4s', // Bluffs with blockers
        'KQs'
    ],
    vsHJ: [ // ~6%
        'AA', 'KK', 'QQ', 'JJ', 'TT', '99',
        'AKs', 'AQs', 'AJs', 'ATs',
        'KQs', 'KJs',
        'AKo', 'AQo',
        'A5s', 'A4s', 'A3s', // Bluffs (NOT A2s - keep for call range)
        '76s', '65s' // Suited connectors as bluffs
    ],
    vsCO: [ // ~8%
        'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88',
        'AKs', 'AQs', 'AJs', 'ATs',
        'KQs', 'KJs', 'KTs',
        'QJs', 'QTs',
        'JTs',
        'T9s', '98s', // Added 98s for consistency
        'AKo', 'AQo', 'AJo',
        'A5s', 'A4s' // Bluffs (fewer than before to avoid overlap)
    ],
    vsBTN: [ // ~11% - defend wider vs BTN
        'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77',
        'AKs', 'AQs', 'AJs', 'ATs', 'A9s',
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

// ============================================
// BB Defense Ranges - CALLING only
// These are MUTUALLY EXCLUSIVE from BB_3BET_RANGES
// ============================================
export const BB_DEFENSE_RANGES = {
    vsUTG: [ // ~15% call range (tight defense vs UTG)
        // Pairs not in 3-bet range (JJ+ are 3-bet)
        '99', '88', '77', '66', '55', '44', '33', '22',
        // Suited aces (A5s, A4s are 3-bet bluffs)
        'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A3s', 'A2s',
        // Suited broadways
        'KQs', 'KJs', 'KTs', 'K9s',
        'QJs', 'QTs', 'Q9s',
        'JTs', 'J9s',
        'T9s', 'T8s',
        // Suited connectors
        '98s', '97s', '87s', '76s', '65s', '54s',
        // Offsuit broadways (AKo is 3-bet)
        'AQo', 'AJo', 'ATo',
        'KQo', 'KJo'
    ],
    vsHJ: [ // ~20% call range
        // Pairs (TT+ are 3-bet)
        '99', '88', '77', '66', '55', '44', '33', '22',
        // Suited aces (A5s-A3s are 3-bet bluffs)
        'A9s', 'A8s', 'A7s', 'A6s', 'A2s',
        // Suited broadways
        'KTs', 'K9s', 'K8s',
        'QTs', 'Q9s', 'Q8s',
        'JTs', 'J9s', 'J8s',
        'T9s', 'T8s', 'T7s',
        // Suited connectors (76s, 65s are 3-bet bluffs)
        '98s', '97s', '87s', '86s', '54s', '43s',
        // Offsuit (AKo, AQo are 3-bet)
        'AJo', 'ATo', 'A9o',
        'KQo', 'KJo', 'KTo',
        'QJo'
    ],
    vsCO: [ // ~25% call range
        // Pairs (TT+ are 3-bet)
        '99', '88', '77', ...SMALL_PAIRS,
        // Suited aces (A5s, A4s are 3-bet)
        'A9s', 'A8s', 'A7s', 'A6s', 'A3s', 'A2s',
        // Suited broadways (KQs, KJs, QJs are 3-bet)
        'KTs', 'K9s', 'K8s', 'K7s', 'K6s',
        'QTs', 'Q9s', 'Q8s', 'Q7s',
        'J9s', 'J8s', 'J7s',
        // Suited tens
        'T8s', 'T7s',
        // Suited connectors (T9s, 98s are 3-bet)
        '97s', '87s', '86s', '76s', '75s', '65s', '64s', '54s', '43s',
        // Offsuit (AKo, AQo, AJo are 3-bet)
        'ATo', 'A9o', 'A8o', 'A7o', 'A6o', 'A5o',
        'KQo', 'KJo', 'KTo', 'K9o',
        'QJo', 'QTo', 'Q9o',
        'JTo', 'J9o',
        'T9o'
    ],
    vsBTN: [ // ~35% call range
        // Pairs (88+ are 3-bet)
        '77', '66', '55', '44', '33', '22',
        // Suited aces (A9s+ are 3-bet)
        'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
        // Suited kings (K9s+ are 3-bet)
        'K8s', 'K7s', 'K6s', 'K5s', 'K4s',
        // Suited queens (Q9s+ are 3-bet)
        'Q8s', 'Q7s', 'Q6s',
        // Suited jacks (J9s+ are 3-bet)
        'J8s', 'J7s', 'J6s',
        // Suited tens (T8s+ are 3-bet)
        'T7s', 'T6s',
        // Suited connectors (98s+ are 3-bet)
        '97s', '86s', '75s', '64s', '53s', '43s', '32s',
        // Offsuit (ATo+ are 3-bet)
        'A9o', 'A8o', 'A7o', 'A6o', 'A5o', 'A4o',
        // Offsuit kings (KQo is 3-bet)
        'KJo', 'KTo', 'K9o', 'K8o',
        'QJo', 'QTo', 'Q9o',
        'JTo', 'J9o',
        'T9o', 'T8o'
    ],
    vsSB: [ // ~45% call range - widest defense (blind vs blind)
        // Pairs (55+ are 3-bet)
        '44', '33', '22',
        // Most suited hands are 3-bet vs SB, call range is offsuit heavy
        // Some suited connectors/gappers not in 3-bet range
        '97s', '86s', '85s', '75s', '74s', '64s', '63s', '53s', '52s', '42s', '32s',
        // Offsuit aces (A9o+ are 3-bet)
        'A8o', 'A7o', 'A6o', 'A5o', 'A4o', 'A3o', 'A2o',
        // Offsuit kings (KJo+ are 3-bet)
        'KTo', 'K9o', 'K8o', 'K7o', 'K6o',
        // Offsuit queens
        'QTo', 'Q9o', 'Q8o', 'Q7o',
        // Offsuit jacks
        'JTo', 'J9o', 'J8o', 'J7o',
        // Offsuit tens
        'T9o', 'T8o', 'T7o',
        // Offsuit connectors
        '98o', '97o', '87o', '86o', '76o', '75o', '65o'
    ]
};

// ============================================
// BB 3-Bet Ranges vs each position
// These are MUTUALLY EXCLUSIVE from BB_DEFENSE_RANGES
// ============================================
export const BB_3BET_RANGES = {
    vsUTG: [ // Tight 3-bet range vs UTG, ~5%
        'AA', 'KK', 'QQ', 'JJ', 'TT',
        'AKs', 'AQs', 'AJs',
        'AKo',
        'A5s', 'A4s' // Bluffs with blockers
    ],
    vsHJ: [ // ~6%
        'AA', 'KK', 'QQ', 'JJ', 'TT',
        'AKs', 'AQs', 'AJs', 'ATs',
        'KQs', 'KJs',
        'QJs',
        'AKo', 'AQo',
        'A5s', 'A4s', 'A3s', // Bluffs
        '76s', '65s' // Suited connector bluffs
    ],
    vsCO: [ // ~8%
        'AA', 'KK', 'QQ', 'JJ', 'TT',
        'AKs', 'AQs', 'AJs', 'ATs',
        'KQs', 'KJs',
        'QJs',
        'T9s', '98s',
        'AKo', 'AQo', 'AJo',
        'A5s', 'A4s' // Bluffs
    ],
    vsBTN: [ // ~11% - wider defense vs BTN
        'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88',
        'AKs', 'AQs', 'AJs', 'ATs', 'A9s',
        'KQs', 'KJs', 'KTs', 'K9s',
        'QJs', 'QTs', 'Q9s',
        'JTs', 'J9s',
        'T9s', 'T8s',
        '98s', '87s', '76s', '65s', '54s',
        'AKo', 'AQo', 'AJo', 'ATo',
        'KQo'
    ],
    vsSB: [ // ~14% - widest 3-bet (blind vs blind)
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

// ============================================
// 4-Bet Ranges - when facing a 3-bet after you opened
// These are MUTUALLY EXCLUSIVE from CALL_3BET_RANGES
// ============================================
export const FOUR_BET_RANGES = {
    vsUTG: [ // Very tight - UTG 3-bet is strong
        'AA', 'KK',
        'AKs', 'AKo'
    ],
    vsHJ: [
        'AA', 'KK', 'QQ',
        'AKs', 'AKo',
        'A5s' // Bluff
    ],
    vsCO: [
        'AA', 'KK', 'QQ', 'JJ',
        'AKs', 'AKo', 'AQs',
        'A5s', 'A4s' // Bluffs
    ],
    vsBTN: [
        'AA', 'KK', 'QQ', 'JJ', 'TT',
        'AKs', 'AKo', 'AQs',
        'A5s', 'A4s', 'A3s', // Bluffs
        'KQs'
    ],
    vsSB: [
        'AA', 'KK', 'QQ', 'JJ', 'TT', '99',
        'AKs', 'AKo', 'AQs', 'AJs',
        'A5s', 'A4s', 'A3s', 'A2s', // Bluffs
        'KQs'
    ]
};

// ============================================
// Call 3-Bet Ranges - when facing a 3-bet after you opened
// These are MUTUALLY EXCLUSIVE from FOUR_BET_RANGES
// ============================================
export const CALL_3BET_RANGES = {
    vsUTG: [ // Tight call range vs UTG 3-bet (AA, KK, AKs/AKo are 4-bet)
        'QQ', 'JJ', 'TT',
        'AQs', 'AJs',
        'KQs'
    ],
    vsHJ: [ // QQ+ are 4-bet
        'JJ', 'TT', '99',
        'AQs', 'AJs', 'ATs',
        'KQs', 'KJs',
        'QJs',
        'AQo'
    ],
    vsCO: [ // JJ+ are 4-bet
        'TT', '99', '88',
        'AJs', 'ATs',
        'KQs', 'KJs',
        'QJs',
        'AQo', 'AJo'
    ],
    vsBTN: [ // TT+ are 4-bet, KQs is 4-bet
        '99', '88', '77',
        'ATs', 'A9s',
        'KJs', 'KTs',
        'QJs', 'JTs',
        'AQo', 'AJo', 'KQo'
    ],
    vsSB: [ // 99+ are 4-bet
        '88', '77', '66',
        'ATs', 'A9s', 'A8s',
        'KJs', 'KTs',
        'QJs', 'JTs',
        'AJo', 'ATo', 'KQo'
    ]
};

// ============================================
// Cold Calling Ranges - facing a raise, not in blinds
// ============================================
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

// ============================================
// Squeeze Ranges - facing raise + caller(s)
// ============================================
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
        'A5s', 'A4s', 'A3s', 'A2s', // Bluffs
        '76s', '65s'
    ],
    vsBTN: [ // Wider - BTN range is weak
        'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77',
        'AKs', 'AQs', 'AJs', 'ATs', 'A9s',
        'KQs', 'KJs', 'KTs',
        'QJs', 'JTs',
        'AKo', 'AQo', 'AJo',
        'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s', // More bluffs
        '87s', '76s', '65s', '54s'
    ],
    vsSB: [ // Very wide vs SB
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

// ============================================
// Helper Functions
// ============================================

// Check if hand is in range
export function isInRange(hand, range) {
    if (!hand || !range) return false;
    const handString = typeof hand === 'string' ? hand : hand.display;
    return range.includes(handString);
}

// Get range size in combos
export function getRangeSize(range) {
    if (!range) return 0;
    let combos = 0;
    range.forEach(hand => {
        if (hand.length === 2) {
            combos += 6; // Pair (e.g., 'AA')
        } else if (hand.endsWith('s')) {
            combos += 4; // Suited (e.g., 'AKs')
        } else if (hand.endsWith('o')) {
            combos += 12; // Offsuit (e.g., 'AKo')
        }
    });
    return combos;
}

// Get range percentage (out of 1326 possible starting hands)
export function getRangePercentage(range) {
    const combos = getRangeSize(range);
    return (combos / 1326) * 100;
}

// Get recommended action for a hand in a situation
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
            if (isInRange(handString, BB_3BET_RANGES[bbKey])) {
                return 'raise';
            } else if (isInRange(handString, BB_DEFENSE_RANGES[bbKey])) {
                return 'call';
            }
            return 'fold';

        case '4bet':
            const fourBetKey = `vs${position}`;
            if (isInRange(handString, FOUR_BET_RANGES[fourBetKey])) {
                return 'raise';
            } else if (isInRange(handString, CALL_3BET_RANGES[fourBetKey])) {
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

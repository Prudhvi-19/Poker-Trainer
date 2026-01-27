// Postflop GTO Frequencies and Ranges
// Based on modern poker solvers and GTO theory

// Board texture classifications
export const BOARD_TEXTURES = {
    // Dry boards: disconnected, few draws
    DRY: ['K♠7♦2♣', 'A♥9♦4♠', 'Q♣8♥3♦', 'J♠6♦2♥'],
    // Wet boards: connected, many draws
    WET: ['9♥8♥7♦', 'Q♠J♥T♦', 'T♣9♠6♥', 'K♦Q♦9♣'],
    // Static boards: unlikely to change on turn/river
    STATIC: ['A♠A♦7♣', 'K♥K♣2♦', 'Q♠Q♥4♣'],
    // Dynamic boards: equity can shift dramatically
    DYNAMIC: ['J♥T♥9♣', '8♦7♦6♣', 'A♥K♥Q♦']
};

// C-bet frequencies by position and board texture (GTO approximations)
export const CBET_FREQUENCIES = {
    IP: { // In position
        DRY: 0.75,      // C-bet 75% on dry boards
        WET: 0.55,      // C-bet 55% on wet boards
        STATIC: 0.80,   // C-bet 80% on static boards
        DYNAMIC: 0.60   // C-bet 60% on dynamic boards
    },
    OOP: { // Out of position
        DRY: 0.55,      // C-bet 55% on dry boards
        WET: 0.40,      // C-bet 40% on wet boards
        STATIC: 0.65,   // C-bet 65% on static boards
        DYNAMIC: 0.45   // C-bet 45% on dynamic boards
    }
};

// Facing c-bet defense frequencies (fold vs call vs raise)
// Based on GTO MDF (Minimum Defense Frequency)
// Against 50% pot bet, MDF = 1 - (bet / (pot + bet)) = 1 - (0.5 / 1.5) = ~67% defend
// Against 67% pot bet, MDF = 1 - (0.67 / 1.67) = ~60% defend
// Against 100% pot bet, MDF = 1 - (1 / 2) = 50% defend
export const DEFENSE_FREQUENCIES = {
    IP: { // In position can defend wider
        DRY: { fold: 0.30, call: 0.55, raise: 0.15 },    // ~70% defend
        WET: { fold: 0.35, call: 0.50, raise: 0.15 },    // ~65% defend
        STATIC: { fold: 0.35, call: 0.55, raise: 0.10 }, // ~65% defend
        DYNAMIC: { fold: 0.40, call: 0.45, raise: 0.15 } // ~60% defend
    },
    OOP: { // Out of position defends tighter
        DRY: { fold: 0.40, call: 0.48, raise: 0.12 },    // ~60% defend
        WET: { fold: 0.45, call: 0.42, raise: 0.13 },    // ~55% defend
        STATIC: { fold: 0.42, call: 0.48, raise: 0.10 }, // ~58% defend
        DYNAMIC: { fold: 0.48, call: 0.38, raise: 0.14 } // ~52% defend
    }
};

export default {
    BOARD_TEXTURES,
    CBET_FREQUENCIES,
    DEFENSE_FREQUENCIES
};

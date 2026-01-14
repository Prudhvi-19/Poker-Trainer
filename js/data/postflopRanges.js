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
export const DEFENSE_FREQUENCIES = {
    IP: {
        DRY: { fold: 0.55, call: 0.35, raise: 0.10 },
        WET: { fold: 0.40, call: 0.45, raise: 0.15 },
        STATIC: { fold: 0.60, call: 0.30, raise: 0.10 },
        DYNAMIC: { fold: 0.45, call: 0.40, raise: 0.15 }
    },
    OOP: {
        DRY: { fold: 0.60, call: 0.30, raise: 0.10 },
        WET: { fold: 0.50, call: 0.35, raise: 0.15 },
        STATIC: { fold: 0.65, call: 0.25, raise: 0.10 },
        DYNAMIC: { fold: 0.55, call: 0.30, raise: 0.15 }
    }
};

export default {
    BOARD_TEXTURES,
    CBET_FREQUENCIES,
    DEFENSE_FREQUENCIES
};

// Constants and Enums

export const POSITIONS = ['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB'];

export const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

export const SUITS = {
    SPADES: '♠',
    HEARTS: '♥',
    DIAMONDS: '♦',
    CLUBS: '♣'
};

export const SUIT_NAMES = {
    '♠': 'spades',
    '♥': 'hearts',
    '♦': 'diamonds',
    '♣': 'clubs'
};

export const ACTIONS = {
    FOLD: 'fold',
    CALL: 'call',
    RAISE: 'raise',
    CHECK: 'check',
    BET: 'bet'
};

export const BET_SIZES = {
    QUARTER: 0.25,
    THIRD: 0.33,
    HALF: 0.5,
    TWO_THIRD: 0.67,
    THREE_QUARTER: 0.75,
    POT: 1.0,
    OVERBET: 1.5
};

export const BET_SIZE_LABELS = {
    [BET_SIZES.QUARTER]: '25% pot',
    [BET_SIZES.THIRD]: '33% pot',
    [BET_SIZES.HALF]: '50% pot',
    [BET_SIZES.TWO_THIRD]: '67% pot',
    [BET_SIZES.THREE_QUARTER]: '75% pot',
    [BET_SIZES.POT]: '100% pot',
    [BET_SIZES.OVERBET]: '150% pot'
};

export const MODULES = {
    DASHBOARD: 'dashboard',
    PREFLOP_TRAINER: 'preflop-trainer',
    POSTFLOP_TRAINER: 'postflop-trainer',
    MULTISTREET_TRAINER: 'multistreet-trainer',
    EQUITY_CALCULATOR: 'equity-calculator',
    HAND_REPLAYER: 'hand-replayer',
    RANGE_VISUALIZER: 'range-visualizer',
    CHARTS: 'charts',
    SCENARIOS: 'scenarios',
    CONCEPTS: 'concepts',
    HISTORY: 'history',
    SETTINGS: 'settings',
    // Postflop trainers
    BOARD_TEXTURE_TRAINER: 'board-texture-trainer',
    CBET_TRAINER: 'cbet-trainer',
    BET_SIZING_TRAINER: 'bet-sizing-trainer',
    POT_ODDS_TRAINER: 'pot-odds-trainer'
};

export const TRAINER_TYPES = {
    RFI: 'rfi',
    THREE_BET: '3bet',
    FOUR_BET: '4bet',
    COLD_CALL: 'cold-call',
    SQUEEZE: 'squeeze',
    BB_DEFENSE: 'bb-defense',
    BLIND_VS_BLIND: 'blind-vs-blind',
    CBET: 'cbet',
    FACING_CBET: 'facing-cbet',
    BOARD_TEXTURE: 'board-texture',
    TURN_PLAY: 'turn',
    RIVER_PLAY: 'river',
    MULTISTREET: 'multistreet'
};

export const STREET = {
    PREFLOP: 'preflop',
    FLOP: 'flop',
    TURN: 'turn',
    RIVER: 'river'
};

export const BOARD_TEXTURE = {
    DRY: 'dry',
    WET: 'wet',
    STATIC: 'static',
    DYNAMIC: 'dynamic'
};

export const DIFFICULTY = {
    EASY: 'easy',
    MEDIUM: 'medium',
    HARD: 'hard'
};

export const KEYBOARD_SHORTCUTS = {
    'r': ACTIONS.RAISE,
    'f': ACTIONS.FOLD,
    'c': ACTIONS.CALL,
    ' ': 'next',
    '1': BET_SIZES.QUARTER,
    '2': BET_SIZES.THIRD,
    '3': BET_SIZES.HALF,
    '4': BET_SIZES.TWO_THIRD,
    '5': BET_SIZES.THREE_QUARTER,
    '6': BET_SIZES.POT
};

export const STORAGE_KEYS = {
    SESSIONS: 'poker_trainer_sessions',
    SETTINGS: 'poker_trainer_settings',
    PROGRESS: 'poker_trainer_progress',
    CUSTOM_RANGES: 'poker_trainer_custom_ranges',
    LAST_VISIT: 'poker_trainer_last_visit',
    STREAK: 'poker_trainer_streak',
    RATING: 'poker_trainer_rating',
    SRS: 'poker_trainer_srs',
    SRS_ACTIVE: 'poker_trainer_srs_active',
    SRS_AUTOSTART: 'poker_trainer_srs_autostart'
};

export const DEFAULT_SETTINGS = {
    theme: 'dark',
    deckStyle: '4-color',
    soundEnabled: false,
    animationSpeed: 'normal',
    fontSize: 'medium',
    defaultSessionLength: 25,
    showHints: false,
    timedMode: false,
    difficulty: DIFFICULTY.MEDIUM,
    maxStoredSessions: 200  // Increased from hardcoded 100
};

// ENH-001 (ELO): simple rating defaults
export const DEFAULT_RATING = {
    current: 1200,
    history: [],
    lastUpdated: null
};

export const POKER_QUOTES = [
    "In the long run, there's no luck in poker, but the short run is longer than most people know.",
    "The beautiful thing about poker is that everybody thinks they can play.",
    "Poker is a skill game pretending to be a chance game.",
    "Life is not always a matter of holding good cards, but sometimes, playing a poor hand well.",
    "The key to No-Limit is to put a man to a decision for all his chips.",
    "Fold and live to fold again.",
    "Play the players, not the cards.",
    "GTO doesn't win the most, but it loses the least.",
    "Master the fundamentals. Advanced play is just fundamentals executed faster.",
    "Every hand is a new puzzle. Solve it."
];

export const NAVIGATION_ITEMS = [
    { id: MODULES.DASHBOARD, icon: '📊', label: 'Dashboard' },
    { id: MODULES.PREFLOP_TRAINER, icon: '🎯', label: 'Preflop Trainer' },
    { id: MODULES.POSTFLOP_TRAINER, icon: '🎲', label: 'Postflop Trainer' },
    { id: MODULES.MULTISTREET_TRAINER, icon: '🎰', label: 'Multi-Street Trainer' },
    { id: MODULES.BOARD_TEXTURE_TRAINER, icon: '🃏', label: 'Board Texture' },
    { id: MODULES.CBET_TRAINER, icon: '💰', label: 'C-Bet Strategy' },
    { id: MODULES.BET_SIZING_TRAINER, icon: '📐', label: 'Bet Sizing' },
    { id: MODULES.POT_ODDS_TRAINER, icon: '🔢', label: 'Pot Odds & MDF' },
    { id: MODULES.EQUITY_CALCULATOR, icon: '🧮', label: 'Equity Calculator' },
    { id: MODULES.HAND_REPLAYER, icon: '🎬', label: 'Hand Replayer' },
    { id: MODULES.RANGE_VISUALIZER, icon: '🎨', label: 'Range Visualizer' },
    { id: MODULES.CHARTS, icon: '📈', label: 'Charts Reference' },
    { id: MODULES.SCENARIOS, icon: '📚', label: 'Scenarios Library' },
    { id: MODULES.CONCEPTS, icon: '🧠', label: 'Concepts & Theory' },
    { id: MODULES.HISTORY, icon: '📜', label: 'Session History' },
    { id: MODULES.SETTINGS, icon: '⚙️', label: 'Settings' }
];

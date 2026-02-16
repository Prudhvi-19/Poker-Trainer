// Equity simulation utilities (Monte Carlo)
//
// Goal: provide deterministic, reusable equity estimation for trainers (ENH-002)
// and the Equity Calculator module.

import { RANKS, SUITS } from './constants.js';

const SUIT_VALUES = Object.values(SUITS);

// -----------------------
// Deterministic RNG
// -----------------------

// FNV-1a 32-bit hash for stable seeds
export function hashStringToSeed(str) {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = Math.imul(h, 0x01000193);
    }
    return h >>> 0;
}

export function mulberry32(seed) {
    let a = seed >>> 0;
    return function rng() {
        a |= 0;
        a = (a + 0x6D2B79F5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

export function makeRng(seedOrString) {
    const seed = typeof seedOrString === 'string' ? hashStringToSeed(seedOrString) : (seedOrString >>> 0);
    return mulberry32(seed);
}

function pickRandom(arr, rng) {
    return arr[Math.floor(rng() * arr.length)];
}

// -----------------------
// Card helpers
// -----------------------

export function cardToString(card) {
    return `${card.rank}${card.suit}`;
}

export function parseCardString(cardStr) {
    if (!cardStr || cardStr.length < 2) return null;
    return { rank: cardStr.slice(0, -1), suit: cardStr.slice(-1) };
}

export function normalizeCardInput(card) {
    if (!card) return null;
    if (typeof card === 'string') return parseCardString(card);
    if (typeof card === 'object' && card.rank && card.suit) return card;
    return null;
}

export function normalizeCards(cards) {
    if (!Array.isArray(cards)) return [];
    return cards.map(normalizeCardInput).filter(Boolean);
}

export function buildUsedSetFromCards(cards) {
    const used = new Set();
    for (const c of cards) used.add(cardToString(c));
    return used;
}

export function getRemainingDeck(usedSet) {
    const deck = [];
    for (const rank of RANKS) {
        for (const suit of SUIT_VALUES) {
            const c = `${rank}${suit}`;
            if (!usedSet.has(c)) deck.push(c);
        }
    }
    return deck;
}

// -----------------------
// Hand code expansion (e.g. AKs, AKo, QQ)
// -----------------------

export function expandHandCodeToCombos(handCode) {
    if (!handCode || typeof handCode !== 'string') return [];

    // Pair (e.g. 'QQ')
    if (handCode.length === 2) {
        const r = handCode[0];
        const combos = [];
        for (let i = 0; i < SUIT_VALUES.length; i++) {
            for (let j = i + 1; j < SUIT_VALUES.length; j++) {
                combos.push([`${r}${SUIT_VALUES[i]}`, `${r}${SUIT_VALUES[j]}`]);
            }
        }
        return combos;
    }

    const r1 = handCode[0];
    const r2 = handCode[1];
    const suffix = handCode[2]; // 's' or 'o'
    if (suffix !== 's' && suffix !== 'o') return [];

    const combos = [];
    if (suffix === 's') {
        for (const s of SUIT_VALUES) {
            combos.push([`${r1}${s}`, `${r2}${s}`]);
        }
    } else {
        for (const s1 of SUIT_VALUES) {
            for (const s2 of SUIT_VALUES) {
                if (s1 === s2) continue;
                combos.push([`${r1}${s1}`, `${r2}${s2}`]);
            }
        }
    }
    return combos;
}

export function expandRangeToCombos(range) {
    if (!Array.isArray(range)) return [];
    const all = [];
    for (const code of range) {
        const combos = expandHandCodeToCombos(code);
        for (const c of combos) {
            all.push(c);
        }
    }
    return all;
}

export function sampleVillainHandFromCombos(villainCombos, usedSet, rng) {
    if (!villainCombos || villainCombos.length === 0) return null;

    // Try a few random picks before falling back to linear scan.
    for (let attempts = 0; attempts < 24; attempts++) {
        const combo = pickRandom(villainCombos, rng);
        if (!usedSet.has(combo[0]) && !usedSet.has(combo[1])) return combo;
    }

    for (const combo of villainCombos) {
        if (!usedSet.has(combo[0]) && !usedSet.has(combo[1])) return combo;
    }
    return null;
}

// If a module only has abstract hand codes (e.g. 'AKs'), create a deterministic
// concrete 2-card representation that avoids collisions with used cards.
export function handCodeToConcreteCards(handCode, usedSet = new Set(), seed = 'hero') {
    const rng = makeRng(`${seed}:${handCode}`);
    const combos = expandHandCodeToCombos(handCode);
    if (combos.length === 0) return null;

    // Prefer a combo that doesn't collide with usedSet
    for (let attempts = 0; attempts < 24; attempts++) {
        const combo = pickRandom(combos, rng);
        if (!usedSet.has(combo[0]) && !usedSet.has(combo[1])) return combo;
    }
    for (const combo of combos) {
        if (!usedSet.has(combo[0]) && !usedSet.has(combo[1])) return combo;
    }
    return null;
}

// -----------------------
// 7-card evaluation (copied from equityCalculator.js for reuse)
// -----------------------

const HAND_RANKS = {
    HIGH_CARD: 1,
    PAIR: 2,
    TWO_PAIR: 3,
    THREE_OF_A_KIND: 4,
    STRAIGHT: 5,
    FLUSH: 6,
    FULL_HOUSE: 7,
    FOUR_OF_A_KIND: 8,
    STRAIGHT_FLUSH: 9
};

export function compareKickers(k1, k2) {
    // Lower index in RANKS = higher rank (A=0 ... 2=12)
    for (let i = 0; i < Math.min(k1.length, k2.length); i++) {
        if (k1[i] < k2[i]) return 1;
        if (k1[i] > k2[i]) return -1;
    }
    return 0;
}

function checkStraight(rankIndicesAscending) {
    const sorted = [...new Set(rankIndicesAscending)].sort((a, b) => b - a);
    if (sorted.length < 5) return false;
    for (let i = 0; i <= sorted.length - 5; i++) {
        const slice = sorted.slice(i, i + 5);
        if (slice[0] - slice[4] === 4) return true;
    }
    // Wheel: A,5,4,3,2 (A=0, 5=9, 4=10, 3=11, 2=12)
    return sorted.includes(0) && sorted.includes(9) && sorted.includes(10) && sorted.includes(11) && sorted.includes(12);
}

function evaluate5(cards) {
    const ranks = cards.map(c => RANKS.indexOf(c[0]));
    const suits = cards.map(c => c.slice(-1));

    const rankCounts = {};
    for (const r of ranks) rankCounts[r] = (rankCounts[r] || 0) + 1;

    const ranksWithCounts = Object.entries(rankCounts)
        .map(([rank, count]) => ({ rank: Number(rank), count }))
        .sort((a, b) => (b.count !== a.count ? b.count - a.count : a.rank - b.rank));

    const counts = ranksWithCounts.map(x => x.count);
    const orderedRanks = ranksWithCounts.map(x => x.rank);
    const uniqueRanks = Object.keys(rankCounts).map(Number).sort((a, b) => a - b);

    const isFlush = suits.every(s => s === suits[0]);
    const isStraight = checkStraight(uniqueRanks);

    if (isStraight && isFlush) {
        const isWheel = uniqueRanks.includes(0) && uniqueRanks.includes(12);
        return { rank: HAND_RANKS.STRAIGHT_FLUSH, kickers: isWheel ? [9] : [uniqueRanks[0]] };
    }
    if (counts[0] === 4) return { rank: HAND_RANKS.FOUR_OF_A_KIND, kickers: orderedRanks };
    if (counts[0] === 3 && counts[1] === 2) return { rank: HAND_RANKS.FULL_HOUSE, kickers: orderedRanks };
    if (isFlush) return { rank: HAND_RANKS.FLUSH, kickers: uniqueRanks };
    if (isStraight) {
        const isWheel = uniqueRanks.includes(0) && uniqueRanks.includes(12);
        return { rank: HAND_RANKS.STRAIGHT, kickers: isWheel ? [9] : [uniqueRanks[0]] };
    }
    if (counts[0] === 3) return { rank: HAND_RANKS.THREE_OF_A_KIND, kickers: orderedRanks };
    if (counts[0] === 2 && counts[1] === 2) return { rank: HAND_RANKS.TWO_PAIR, kickers: orderedRanks };
    if (counts[0] === 2) return { rank: HAND_RANKS.PAIR, kickers: orderedRanks };
    return { rank: HAND_RANKS.HIGH_CARD, kickers: uniqueRanks };
}

export function evaluateBest5Of7(sevenCards) {
    if (!Array.isArray(sevenCards) || sevenCards.length < 5) {
        throw new Error('evaluateBest5Of7 expects 5-7 cards');
    }
    if (sevenCards.length === 5) return evaluate5(sevenCards);

    const n = sevenCards.length;
    let best = null;

    // For 6 or 7 cards, brute-force choose 5 (small constant)
    for (let a = 0; a < n - 4; a++) {
        for (let b = a + 1; b < n - 3; b++) {
            for (let c = b + 1; c < n - 2; c++) {
                for (let d = c + 1; d < n - 1; d++) {
                    for (let e = d + 1; e < n; e++) {
                        const eval5 = evaluate5([sevenCards[a], sevenCards[b], sevenCards[c], sevenCards[d], sevenCards[e]]);
                        if (!best || eval5.rank > best.rank || (eval5.rank === best.rank && compareKickers(eval5.kickers, best.kickers) > 0)) {
                            best = eval5;
                        }
                    }
                }
            }
        }
    }
    return best;
}

export function compareHands7(hero7, villain7) {
    const h = evaluateBest5Of7(hero7);
    const v = evaluateBest5Of7(villain7);
    if (h.rank > v.rank) return 1;
    if (h.rank < v.rank) return -1;
    return compareKickers(h.kickers, v.kickers);
}

// -----------------------
// Monte Carlo equity
// -----------------------

export function simulateEquityHandVsHand({ hand1, hand2, board = [], iterations = 10000, seed = 'equity' }) {
    const rng = makeRng(seed);
    const baseUsed = new Set([...(hand1 || []), ...(hand2 || []), ...(board || [])]);
    let w1 = 0;
    let w2 = 0;
    let ties = 0;

    for (let i = 0; i < iterations; i++) {
        const used = new Set(baseUsed);
        const fullBoard = [...board];
        while (fullBoard.length < 5) {
            const remaining = getRemainingDeck(used);
            const c = pickRandom(remaining, rng);
            fullBoard.push(c);
            used.add(c);
        }

        const cmp = compareHands7([...hand1, ...fullBoard], [...hand2, ...fullBoard]);
        if (cmp > 0) w1++;
        else if (cmp < 0) w2++;
        else ties++;
    }

    return {
        hand1Equity: ((w1 + ties / 2) / iterations) * 100,
        hand2Equity: ((w2 + ties / 2) / iterations) * 100,
        hand1Wins: w1,
        hand2Wins: w2,
        ties,
        iterations
    };
}

export function simulateEquityVsRange({ heroCards, villainRange, board = [], iterations = 2500, seed = 'equity-range' }) {
    const rng = makeRng(seed);
    const hero = [...(heroCards || [])];
    const b = [...(board || [])];

    const baseUsed = new Set([...hero, ...b]);
    const villainCombos = expandRangeToCombos(villainRange || []);
    if (villainCombos.length === 0) {
        return { equity: 0.5, iterations: 0, wins: 0, ties: 0, losses: 0 };
    }

    let wins = 0;
    let losses = 0;
    let ties = 0;

    for (let i = 0; i < iterations; i++) {
        const villain = sampleVillainHandFromCombos(villainCombos, baseUsed, rng);
        if (!villain) break;

        const used = new Set(baseUsed);
        used.add(villain[0]);
        used.add(villain[1]);

        const fullBoard = [...b];
        while (fullBoard.length < 5) {
            const remaining = getRemainingDeck(used);
            const c = pickRandom(remaining, rng);
            fullBoard.push(c);
            used.add(c);
        }

        const cmp = compareHands7([...hero, ...fullBoard], [...villain, ...fullBoard]);
        if (cmp > 0) wins++;
        else if (cmp < 0) losses++;
        else ties++;
    }

    const done = wins + losses + ties;
    if (done === 0) return { equity: 0.5, iterations: 0, wins: 0, ties: 0, losses: 0 };
    return {
        equity: (wins + ties / 2) / done,
        iterations: done,
        wins,
        ties,
        losses
    };
}

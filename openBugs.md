# Open Bugs (Audit)

This file tracks **known open business/logic/UX bugs** found during code review.

- **Repo:** Poker-Trainer
- **Working branch:** `audit/bug-hunt`
- **Last updated:** 2026-02-15

## Severity scale

- **P0**: breaks core functionality / data loss / security issue
- **P1**: major incorrect logic, misleading training outcomes, or major UX regression
- **P2**: correctness edge case, noticeable UX issue, performance issue
- **P3**: minor polish / cleanup

---

## BUG-005 — Stats “common mistakes” grouping key uses `scenario.action` (field doesn’t exist)

- **Severity:** P2
- **Area:** `js/utils/stats.js`
- **Status:** OPEN

### Symptoms
`getCommonMistakes()` builds a grouping key with `result.scenario.action`, but scenarios use fields like `correctAction`, `type`, etc.
This leads to poor/incorrect aggregation.

### Suspected root cause
Field mismatch (`scenario.action` not present).

### Fix idea
Use a stable key like `{ module, trainerType/type, position, hand.display, correctAction }`.

---

## BUG-007 — Multi-street trainer: “facing a raise” uses BB defense ranges for every hero position

- **Severity:** P1
- **Area:** `js/modules/multistreetTrainer.js`, `js/data/ranges.js`
- **Status:** OPEN

### Symptoms
When hero is not the aggressor preflop, the logic uses:

```js
const defenseRange = ranges.BB_DEFENSE_RANGES[posKey];
```

even if hero is e.g. `CO` vs an `UTG` open.

### Impact
Correct answers can be systematically wrong (mis-trains players).

### Fix idea
Use the correct range table based on hero position/situation:
- blinds: BB defense vs opens (and SB vs opens if modeled)
- non-blinds: use cold-call / 3-bet ranges
Also constrain scenario generation so only supported matchups are produced.

---

## BUG-008 — Multi-street trainer: random positions create unsupported matchups (missing `vs...` keys)

- **Severity:** P2
- **Area:** `js/modules/multistreetTrainer.js`, `js/data/ranges.js`
- **Status:** OPEN

### Symptoms
`villainPosition` can be any position other than hero’s, including `BB`/`SB`.
The range data is keyed for `vsUTG/vsHJ/vsCO/vsBTN/vsSB` (no `vsBB`).
When `posKey` is missing, correct action defaults to fold.

### Fix idea
Constrain `villainPosition` to supported opener positions, or expand range tables.

---

## BUG-009 — Multi-street trainer: pot/stacks inconsistent with blinds posting

- **Severity:** P2
- **Area:** `js/modules/multistreetTrainer.js`
- **Status:** OPEN

### Symptoms
Hand starts with `pot: 1.5` (blinds) but both stacks remain at `100` (blinds not deducted).
If hero/villain is SB/BB, subsequent pot/stack calculations are inaccurate.

### Fix idea
Model blind posting explicitly based on player positions OR start pot at 0 and track contributions.

---

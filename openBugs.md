
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

## BUG-001 — Settings can crash if stored settings are missing newer keys

- **Severity:** P0
- **Area:** `js/utils/storage.js`, `js/modules/settings.js`, `js/app.js`
- **Status:** OPEN

### Symptoms
If a user has an older `poker_trainer_settings` object in `localStorage` (missing keys introduced later), the app may crash when rendering Settings.

### Repro
1. In DevTools, set `localStorage.poker_trainer_settings = "{}"`
2. Navigate to `#settings`
3. Observe error risk at `currentSettings.defaultSessionLength.toString()`

### Suspected root cause
`storage.getSettings()` returns the stored object as-is and **does not merge with `DEFAULT_SETTINGS`**, so required fields can be `undefined`.

### Fix idea
In `getSettings()`, return `{...DEFAULT_SETTINGS, ...storedSettings}` (and ensure nested defaults if needed).
Also harden Settings render paths against missing values.

---

## BUG-002 — `defaultSessionLength.toString()` can throw

- **Severity:** P0
- **Area:** `js/modules/settings.js`
- **Status:** OPEN

### Suspected root cause
`currentSettings.defaultSessionLength` can be `undefined` if settings are missing/malformed.

### Fix idea
Use `String(currentSettings.defaultSessionLength ?? DEFAULT_SETTINGS.defaultSessionLength)`.

---

## BUG-003 — Navigation helper mutates URL hash (redundant + can cause double navigation)

- **Severity:** P1
- **Area:** `js/components/Navigation.js`
- **Status:** OPEN

### Symptoms
`setActiveNavItem()` both:
1) updates active CSS class, and
2) sets `window.location.hash = moduleId`

But navigation click handler already triggers routing via `onNavigate()` (which also sets the hash), and `app.js` also listens to `hashchange` to call `setActiveNavItem()`.

### Risk
Redundant hash writes, potential weirdness with router generation guard and/or event timing.

### Fix idea
Make `setActiveNavItem()` **pure UI state** (only class toggling). Leave hash mutation to the router.

---

## BUG-004 — Postflop trainer keyboard instructions don’t match actual shortcuts

- **Severity:** P1
- **Area:** `js/app.js`, `js/modules/postflopTrainer.js`
- **Status:** OPEN

### Symptoms
Postflop trainer header says: `B=Bet/Raise`, but `app.js` doesn’t dispatch any shortcut for key `b`.

### Fix idea
Either:
- add `case 'b':` in `app.js` to dispatch the same action as raise/bet, or
- update the UI copy to match the implemented keys.

---

## BUG-005 — Stats “common mistakes” grouping key uses `scenario.action` (field doesn’t exist)

- **Severity:** P2
- **Area:** `js/utils/stats.js`
- **Status:** OPEN

### Symptoms
`getCommonMistakes()` builds a grouping key with `result.scenario.action`, but scenarios use fields like `correctAction`, `type`, etc.
This leads to poor/incorrect aggregation.

### Fix idea
Use a stable key like `{module, trainerType/type, position, hand.display, correctAction}`.

---

## BUG-006 — Equity calculator: Random hand / Clear board don’t refresh duplicate-card disabling

- **Severity:** P2
- **Area:** `js/modules/equityCalculator.js`
- **Status:** OPEN

### Symptoms
`setRandomHand()` and `clearBoard()` update `<select>.value` programmatically but do not call `updateCardAvailability()`.
Because programmatic `.value = ...` doesn’t trigger `change`, the UI can show illegal/duplicate cards as “available” until the user manually changes a dropdown.

### Fix idea
Call `updateCardAvailability()` at the end of `setRandomHand()` and `clearBoard()`.

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
- blinds: BB defense vs opens, SB defense vs opens (if modeled)
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

## “Already patched on branch but not yet committed/verified”

The following changes exist as local modifications on `audit/bug-hunt` and should be verified + committed:

- **Equity calculator Monte Carlo simulation**: reset `usedCards` per iteration to avoid card-exhaustion/correlation across iterations.
- **Scenario container IDs**: standardize to `scenario-container` for trainers to avoid DOM lookup inconsistencies.


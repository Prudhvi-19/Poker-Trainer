
# Closed Bugs

## 2026-02-15

### FIXED — BUG-001 Settings can crash if stored settings are missing newer keys

- **Severity:** P0
- **Commit:** `b2d56ae`
- **Fix:** `storage.getSettings()` now merges stored settings into `DEFAULT_SETTINGS` so missing keys can’t crash Settings.
- **Verification:** Loaded `#settings` in browser without console errors.

### FIXED — BUG-002 `defaultSessionLength.toString()` can throw

- **Severity:** P0
- **Commit:** `b2d56ae`
- **Fix:** Hardened to `String(currentSettings.defaultSessionLength ?? DEFAULT_SETTINGS.defaultSessionLength)`.
- **Verification:** Loaded `#settings` successfully.

### FIXED — BUG-003 Navigation helper mutates URL hash (redundant + can cause double navigation)

- **Severity:** P1
- **Commit:** `b2d56ae`
- **Fix:** `setActiveNavItem()` is now UI-only (no `window.location.hash` mutation).
- **Verification:** Navigated via sidebar; app continues to load correctly.

### FIXED — BUG-004 Postflop trainer keyboard instructions don’t match actual shortcuts

- **Severity:** P1
- **Commit:** `b2d56ae`
- **Fix:** Added global `b` keyboard shortcut mapping to the existing `raise` action.
- **Verification:** Manual review of `js/app.js` shortcut dispatch; app loads.

### FIXED — BUG-006 Equity calculator: Random hand / Clear board don’t refresh duplicate-card disabling

- **Severity:** P2
- **Commit:** `b2d56ae`
- **Fix:** Call `updateCardAvailability()` after programmatic value changes.
- **Verification:** App loads; requires quick in-UI interaction verification later.

### FIXED — BUG-010 Scenario container id inconsistencies can break trainer keyboard shortcuts

- **Severity:** P2
- **Commit:** `5914195`
- **Fix:** Standardized trainer scenario containers to use `id="scenario-container"`.
- **Verification:** Code inspection; interactive regression test pending.

### FIXED — BUG-005 Stats “common mistakes” grouping key uses `scenario.action` (field doesn’t exist)

- **Severity:** P2
- **Commit:** `41e32a3`
- **Fix:** Corrected the aggregation key to use stable scenario fields instead of nonexistent `scenario.action`.
- **Verification:** Code inspection.

### FIXED — BUG-007 Multi-street trainer: incorrect defense ranges used when facing a raise

- **Severity:** P1
- **Commit:** `615f7e0`
- **Fix:** Constrained multistreet preflop to supported heads-up BTN/BB scenarios and uses `getRecommendedAction(..., 'bb-defense')` for BB vs BTN opens.
- **Verification:** Loaded `#multistreet-trainer` in browser; no console errors.

### FIXED — BUG-008 Multi-street trainer: unsupported matchup generation (missing `vs...` keys)

- **Severity:** P2
- **Commit:** `615f7e0`
- **Fix:** Scenario generation no longer produces unsupported position matchups; constrained to BTN/BB.
- **Verification:** Loaded `#multistreet-trainer` in browser.

### FIXED — BUG-009 Multi-street trainer: pot/stacks inconsistent with blinds posting

- **Severity:** P2
- **Commit:** `615f7e0`
- **Fix:** Added heads-up blind posting + tracked contributions so pot/stack updates are consistent with scenario actions.
- **Verification:** Loaded `#multistreet-trainer` in browser and interacted with actions.

### FIXED — BUG-011 Event listener memory leak across trainer modules

- **Severity:** P0
- **Commits:** `76f8897`, `11d9197`
- **Fix:** Centralized `poker-shortcut` handling via `js/utils/shortcutManager.js` and clear the active handler on every route change in `js/router.js`.
- **Verification:** Code inspection; manual navigation test recommended.

### FIXED — BUG-012 XSS vulnerability in Modal innerHTML

- **Severity:** P0
- **Commit:** `ae21f00`
- **Fix:** `showModal()` no longer injects raw HTML strings; string content is rendered via `textContent`.
- **Verification:** Code inspection.

### FIXED — BUG-013 localStorage quota exceeded silently drops sessions

- **Severity:** P0
- **Commit:** `f82b566`
- **Fix:** Show toast warnings before truncating sessions and on save failure so user is informed about data loss / action needed.
- **Verification:** Code inspection; manual storage-fill test recommended.

## 2026-02-16

### FIXED — BUG-014 Infinite recursion in cold call scenario generation

- **Severity:** P1
- **Commit:** `2841aa2`
- **Fix:** Avoid empty filtered position arrays during cold-call scenario generation (prevents recursion crash).
- **Verification:** Code inspection; scenario generation no longer recurses on empty pools.

### FIXED — BUG-015 Keyboard shortcuts fire through modals / feedback (double-action)

- **Severity:** P1
- **Commits:** `76f8897`, `11d9197`, `a5f1568`
- **Fix:** Centralized shortcut handling and added guards so Space on focused feedback buttons doesn’t also dispatch a global “next” shortcut.
- **Verification:** Code inspection; manual in-UI test recommended.

### FIXED — BUG-016 Multi-street trainer crash on hand generation failures

- **Severity:** P1
- **Commit:** `7efdcf3`
- **Fix:** Guard `generateNewHand()` failures; retry once, toast on failure, and avoid dereferencing null hand.
- **Verification:** Code inspection.

### FIXED — BUG-017 Session save not guaranteed on rapid navigation

- **Severity:** P1
- **Commit:** `7efdcf3`
- **Fix:** Persist session shell immediately, and persist in-progress hand/session after each decision and street advancement.
- **Verification:** Code inspection.

### FIXED — BUG-018 Incorrect straight draw detection logic

- **Severity:** P1
- **Commit:** `445e2a5`
- **Fix:** Correct wheel straight-draw detection to require the specific wheel ranks rather than a permissive low-card count.
- **Verification:** Code inspection.

### FIXED — BUG-019 `randomItem()` returns undefined on empty arrays

- **Severity:** P2
- **Commit:** `e4d5d15`
- **Fix:** `randomItem([])` now returns `null`.
- **Verification:** Code inspection.

### FIXED — BUG-020 No schema validation on imported JSON data

- **Severity:** P2
- **Commit:** `e31b8db`
- **Fix:** Validate imported JSON structure before importing; reject invalid types; avoid forced reload and refresh streak UI in-place.
- **Verification:** Code inspection.

### VERIFIED — BUG-021 Hand replayer index-zero false-negative check

- **Severity:** P2
- **Status:** No change required
- **Notes:** Current code uses `currentSessionIndex === null` so index `0` is handled correctly.

### FIXED — BUG-022 No progress indicator for Monte Carlo equity calculation

- **Severity:** P2
- **Commit:** `b6122d4`
- **Fix:** Show spinner and disable Calculate button while simulation runs.
- **Verification:** Code inspection.

### FIXED — BUG-023 Settings font-size silently falls back on invalid values

- **Severity:** P2
- **Commit:** `52f4d9b`
- **Fix:** Validate stored `fontSize` on startup; reset invalid values to Medium and show a toast.
- **Verification:** Code inspection.

### FIXED — BUG-024 Equity calculator kicker sorting ambiguity

- **Severity:** P2
- **Commit:** `9d03a33`
- **Fix:** Document rank-index encoding assumptions so kicker ordering is explicit.
- **Verification:** Code inspection.

### FIXED — BUG-025 Streak display not updated on data import

- **Severity:** P2
- **Commit:** `e31b8db`
- **Fix:** Refresh in-memory settings and update streak display after import; no page reload required.
- **Verification:** Code inspection.

### FIXED — BUG-026 Missing ARIA labels on navigation links

- **Severity:** P3
- **Commit:** `b8be37f`
- **Fix:** Add `aria-label` to nav links and `role="navigation"` landmark.
- **Verification:** Code inspection.

### FIXED — BUG-027 No input trimming on hand string parsing

- **Severity:** P3
- **Commit:** `6c2489b`
- **Fix:** Trim whitespace in `parseHand()`.
- **Verification:** Code inspection.

### VERIFIED — BUG-028 Inline styles reference CSS variables that may not exist

- **Severity:** P3
- **Status:** No change required
- **Notes:** `--border-radius` is defined in `css/variables.css`.

### FIXED — BUG-029 Action buttons matched by textContent substring (fragile)

- **Severity:** P3
- **Commits:** `3f000b8`, `091845a`
- **Fix:** Set `data-action` on buttons and match deterministically; supports raise/bet and call/check aliasing.
- **Verification:** Code inspection.

### FIXED — BUG-030 Private method `_getSessionCounts()` called from dashboard

- **Severity:** P3
- **Commit:** `df30357`
- **Fix:** Exposed public `stats.getSessionCounts()` and updated dashboard to use it.
- **Verification:** Code inspection.


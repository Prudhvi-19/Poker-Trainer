
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


# Open Bugs & Feature Enhancements (Audit)

This file tracks **known open bugs, logic/UX issues, and feature enhancements** found during comprehensive code review and competitive analysis.

- **Repo:** Poker-Trainer
- **Working branch:** `claude/research-product-enhancements-7hyrp`
- **Last updated:** 2026-02-16

## Severity scale

- **P0**: breaks core functionality / data loss / security issue
- **P1**: major incorrect logic, misleading training outcomes, or major UX regression
- **P2**: correctness edge case, noticeable UX issue, performance issue
- **P3**: minor polish / cleanup

## Enhancement priority

- **E0**: Table-stakes feature that competitors all have -- must ship
- **E1**: High-impact differentiator that would set us apart
- **E2**: Nice-to-have feature that rounds out the product
- **E3**: Future vision / long-term roadmap item

---

# PART 1 -- OPEN BUGS

## Shipped E0 Review Findings

_The following bugs were discovered during code review of the shipped ENH-001 through ENH-004 implementations. They are regressions or gaps introduced by those features._

---

## P1 -- High

### BUG-031 Board Texture & Pot Odds trainers missing EV feedback (ENH-002 gap)

- **Files:** `js/modules/boardTextureTrainer.js`, `js/modules/potOddsTrainer.js`
- **Description:** ENH-002 shipped 4-tier EV feedback (Perfect/Good/Mistake/Blunder) into preflop, postflop, multi-street, c-bet, and bet-sizing trainers. However, Board Texture Trainer and Pot Odds Trainer still use binary correct/incorrect feedback with no `computeEvFeedback` or `gradeFromEvLoss` integration. No import of `evFeedback.js` in either file. Both trainers do update the ELO rating (confirmed: `applyDecisionRating` is called in potOddsTrainer), but the user sees old-style green/red feedback instead of the 4-tier system with EV cost.
- **Impact:** Inconsistent UX across trainers. Users see modern EV-graded feedback in 5 trainers but fall back to binary in 2 others. Breaks the "unified feedback experience" promise of ENH-002.
- **Suggested fix:** Add EV feedback to both trainers. For Pot Odds, the EV model is simpler (pot odds math is exact, not Monte Carlo). For Board Texture, use the correct/incorrect binary mapped to the grade system (correct = Perfect, incorrect = Blunder).

### BUG-032 Board Texture & Pot Odds trainers not integrated with SRS (ENH-004 gap)

- **Files:** `js/modules/boardTextureTrainer.js`, `js/modules/potOddsTrainer.js`
- **Description:** ENH-004 shipped spaced repetition (SRS) integration into preflop, postflop, multi-street, c-bet, and bet-sizing trainers. Board Texture and Pot Odds trainers have zero SRS integration -- no `buildScenarioKeyFromResult`, no `upsertSrsResult` calls, no Smart Practice session routing. Confirmed: no `srs` or `recordSrsResult` imports in either file.
- **Impact:** Users who practice Board Texture or Pot Odds never build SRS entries for those skills. Weak spots in these areas are never scheduled for review. The Smart Practice queue has a blind spot for 2 of 7 trainers.
- **Suggested fix:** Add SRS key generation for board texture (key = question category + texture type) and pot odds (key = scenario type + bet size ratio). Record results via `upsertSrsResult` after each answer.

### BUG-033 PWA icons are placeholder stubs -- not real images (ENH-003 gap)

- **Files:** `icons/icon-192.png`, `icons/icon-512.png`, `icons/apple-touch-icon.png`
- **Description:** The 3 icon files committed are binary stubs (tiny placeholder PNGs), not actual branded app icons. When a user installs the PWA via "Add to Home Screen", the icon will either show a generic blank square or a broken image. The `manifest.webmanifest` references these files correctly, but the visual result is unacceptable.
- **Impact:** PWA installability works technically, but the installed app looks broken on the home screen. First impression is terrible. Users may uninstall immediately.
- **Suggested fix:** Design and commit proper app icons -- a poker-themed icon (e.g., stylized spade/chip with "GTO" text) in 192x192 and 512x512. Also add a `"purpose": "any maskable"` field to the manifest for adaptive icon support on Android 13+.

### BUG-034 Service worker cache version is static -- never auto-increments (ENH-003 gap)

- **File:** `service-worker.js:9`
- **Description:** `CACHE_VERSION = 'poker-trainer-v2'` is hardcoded. When code is updated and deployed, the service worker still serves the old cached version because the cache key hasn't changed. Users will see stale code indefinitely until they manually clear browser cache or the developer remembers to bump the version string.
- **Impact:** Users running the PWA never receive updates. Bug fixes and new features are invisible to installed PWA users.
- **Suggested fix:** Either (a) hash the cache version based on a build timestamp/git commit, or (b) add a version bump to the deployment checklist with prominent comments. Also add a UI notification when a new service worker version is detected ("New version available -- tap to refresh").

---

## P2 -- Medium

### BUG-035 No PWA install prompt UX (ENH-003 gap)

- **File:** `js/app.js`
- **Description:** The service worker registers correctly, but there is no code to intercept the `beforeinstallprompt` event or display an "Install App" button/banner. Users must discover the "Add to Home Screen" option from the browser's own menu, which most users don't know about.
- **Impact:** Very low PWA install rate. The feature exists technically but is invisible to 95% of users.
- **Suggested fix:** Listen for `beforeinstallprompt`, store the event, and show a non-intrusive "Install App" banner in the header or settings page. Dismiss after install or after user declines.

### BUG-036 No service worker update notification (ENH-003 gap)

- **File:** `service-worker.js:91`, `js/app.js`
- **Description:** `self.skipWaiting()` is called on install, and `self.clients.claim()` on activate, which auto-updates the service worker. However, the app never notifies the user that new content is available. The `console.log('[sw] New version available')` message is only visible in DevTools. Combined with BUG-034 (static cache version), updates are both rare AND invisible.
- **Impact:** Users don't know when updates are deployed. May report bugs that are already fixed.
- **Suggested fix:** Use the `controllerchange` event in `app.js` to show a toast: "App updated! Refresh to see the latest changes." Or auto-reload on activation.

### BUG-037 Preflop EV model uses hardcoded fold equity assumptions

- **File:** `js/modules/preflopTrainer.js:735-741`
- **Description:** `OPEN_FOLD_EQUITY` hardcodes position-based fold equity values (UTG: 0.20, HJ: 0.25, CO: 0.35, BTN: 0.45, SB: 0.35, BB: 0). These are rough approximations that don't account for stack depth, table dynamics, or opponent tendencies. The values assume a standard 100bb cash game. For tournament contexts or shallow stacks, these are significantly wrong.
- **Impact:** EV feedback for preflop RFI decisions can be misleading. A hand might show "Good" when the actual EV loss is higher (or lower) than estimated. Users may internalize incorrect EV expectations.
- **Suggested fix:** Add a comment explicitly documenting that these are 100bb cash approximations. Consider making fold equity configurable in settings for different game types. Long-term: derive fold equity from actual range data rather than hardcoding.

### BUG-038 EV feedback for cold call and squeeze scenarios returns null

- **File:** `js/modules/preflopTrainer.js:712-880` (the `computeEvFeedback` function)
- **Description:** The `actionEvs()` switch statement in `computeEvFeedback` handles RFI, 3-bet, 4-bet, and BB defense types. But cold call (`TRAINER_TYPES.COLD_CALL`) and squeeze (`TRAINER_TYPES.SQUEEZE`) are not handled -- they fall through to the `default` case which returns `null`. This means ~2 of 6 preflop trainer modes silently skip EV feedback entirely.
- **Impact:** Users training cold call or squeeze scenarios see no EV information. The feedback panel still shows correct/incorrect but the 4-tier grade and EV loss (bb) fields are missing. Inconsistent experience within the same trainer module.
- **Suggested fix:** Add `case TRAINER_TYPES.COLD_CALL` and `case TRAINER_TYPES.SQUEEZE` blocks to the switch. For cold call, model as calling a raise (EV of call vs fold). For squeeze, model as 3-bet with fold equity against both raiser and caller.

### BUG-039 EV loss floor prevents "Perfect" on technically wrong-but-close answers

- **File:** `js/utils/evFeedback.js:113-116`
- **Description:** When `isCorrect === false`, the code forces `loss = Math.max(loss, 0.15)`. This prevents a wrong answer from ever receiving a "Perfect" grade (threshold: <= 0.1bb). However, in poker, some "wrong" answers are extremely close in EV (e.g., folding vs calling when both have nearly identical EV). A legitimate 0.02bb EV difference gets artificially inflated to 0.15bb, which is then graded "Good" instead of the more accurate "Perfect."
- **Impact:** Users see "Good" for near-optimal plays that happen to differ from the GTO recommendation. This is technically incorrect feedback -- the EV loss shown doesn't match reality.
- **Suggested fix:** Either remove the floor entirely and let wrong answers show their actual EV (even if "Perfect"), or reduce the floor to a smaller value (e.g., 0.05bb). Add a note in the feedback: "Close to optimal" for wrong-but-near-perfect decisions.

### BUG-040 SRS scenario keys for multistreet are too coarse

- **File:** `js/utils/srs.js:87-94`
- **Description:** Multistreet SRS keys only include `{ module, street, position }`. This means ALL decisions on the flop from BTN map to the same SRS item, regardless of board texture, hand strength, or action taken. A user who nails flop c-bets on dry boards but struggles on wet boards will have both experiences averaged into one SRS item.
- **Impact:** SRS cannot identify granular weaknesses within multi-street play. A single "flop from BTN" item might oscillate between "due" and "not due" as different board textures yield different results, degrading the scheduling algorithm's effectiveness.
- **Suggested fix:** Include `heroIsAggressor` and at least `texture` (from the multistreet hand's board analysis) in the key to differentiate scenarios. The scenario key function already accepts these fields -- the multistreet decision objects just don't populate them.

### BUG-041 Manifest missing maskable icon purpose

- **File:** `manifest.webmanifest`
- **Description:** Icon entries have `"type": "image/png"` but no `"purpose"` field. Modern Android (13+) uses adaptive icons that require `"purpose": "any maskable"` to render correctly in different icon shapes (circle, squircle, teardrop). Without this, the icon may be cropped awkwardly or show with large padding.
- **Impact:** Installed PWA icon looks poorly cropped on modern Android devices.
- **Suggested fix:** Add `"purpose": "any maskable"` to icon entries. Ensure the actual icon artwork has safe zone padding (inner 80% contains the visual content).

### BUG-042 CSS styling duplication for EV feedback grades

- **Files:** `css/modules.css`, `css/components.css`
- **Description:** Both files define near-identical rules for `.feedback-panel.grade-perfect`, `.grade-good`, `.grade-mistake`, `.grade-blunder` and `.feedback-section.grade-*`. The color values and border-left styles are duplicated across both files.
- **Impact:** Maintenance burden. If feedback colors are changed in one file, the other becomes out of sync. Increases CSS payload unnecessarily.
- **Suggested fix:** Consolidate all grade styling into `css/components.css` (where component-level styles belong) and remove duplicates from `css/modules.css`.

---

## P3 -- Minor / Polish

### BUG-043 ELO opponent rating hardcoded at 1500 for all trainers

- **File:** `js/utils/rating.js` (called from all trainer modules)
- **Description:** Every `applyDecisionRating(current, isCorrect, 1500)` call uses a fixed opponent rating of 1500. This means a simple RFI drill and a complex multi-street river decision both use the same difficulty baseline. Preflop RFI decisions are objectively easier than postflop river plays, but the rating system doesn't differentiate.
- **Impact:** Rating growth doesn't accurately reflect skill development across different complexity levels. A user grinding only easy preflop RFI can inflate their rating to Master tier without ever practicing hard postflop spots.
- **Suggested fix:** Map trainer type to estimated difficulty: preflop RFI = 1300, postflop river = 1700, multi-street = 1800, etc. This makes rating gains harder for simple tasks and more rewarding for complex ones.

### BUG-044 No ELO rating reset mechanism in settings

- **File:** `js/modules/settings.js`
- **Description:** Settings has "Reset All Progress" and "Clear All Data" buttons, but neither explicitly mentions the rating system. While "Clear All Data" presumably clears localStorage (including rating), there is no targeted "Reset Rating" option for users who want a fresh start without losing session history.
- **Impact:** Minor UX gap. Users who want to restart their rating journey must either clear all data or manually edit localStorage.
- **Suggested fix:** Add a "Reset Rating" button in settings under the Data Management section. Confirm via modal before resetting.

### BUG-045 Smart Practice session state lost on page refresh

- **File:** `js/utils/smartPracticeSession.js`
- **Description:** The Smart Practice session stores its queue in `STORAGE_KEYS.SRS_ACTIVE` but if the user refreshes the page mid-session (F5, browser refresh, or PWA restart), the active session context is lost. The next visit to the dashboard shows a fresh "Smart Practice" section with a new queue, and any in-progress queue position is gone.
- **Impact:** Minor. Users must restart their Smart Practice queue after refresh. Progress within the queue (which items have been reviewed) is lost.
- **Suggested fix:** On app initialization, check for an active SRS session in storage and offer to resume it: "You have an unfinished Smart Practice session (3/10 items reviewed). Resume?"

### BUG-046 No offline indicator in app UI (ENH-003 gap)

- **File:** `js/app.js`
- **Description:** The PWA works offline via service worker cache, but the app provides no visual indication of online/offline status. Users training offline don't know whether their data exports or future sync features would work. There's no `navigator.onLine` check or `online`/`offline` event listener.
- **Impact:** Minor confusion for offline users. No functional impact since the app is fully client-side.
- **Suggested fix:** Add a small connectivity indicator (e.g., subtle icon in the navigation footer). Listen for `online`/`offline` events and toggle the indicator.

---

# Previously Fixed Bugs

All bugs from BUG-011 through BUG-030 have been fixed. See `closedBugs.md` for details.

**Summary of closures:**
- P0: BUG-011 (listener leak), BUG-012 (XSS), BUG-013 (localStorage quota) -- all fixed
- P1: BUG-014 (cold call recursion), BUG-015 (shortcut double-action), BUG-016 (deck exhaustion), BUG-017 (session save), BUG-018 (straight draw) -- all fixed
- P2: BUG-019 (randomItem), BUG-020 (import validation), BUG-021 (verified OK), BUG-022 (equity spinner), BUG-023 (font size), BUG-024 (kicker docs), BUG-025 (import refresh) -- all fixed
- P3: BUG-026 (ARIA labels), BUG-027 (hand trim), BUG-028 (verified OK), BUG-029 (data-action), BUG-030 (public API) -- all fixed

---

# PART 2 -- FEATURE ENHANCEMENTS

## E0 -- Shipped (with review notes)

_All 4 E0 enhancements have been shipped. See `closedBugs.md` for commit references._

### ENH-001 ELO / Skill Rating System -- SHIPPED

- **Status:** Shipped (commit `0716cb6`)
- **Review verdict:** Correct implementation. ELO formula, K-factor scaling, tier badges all working.
- **Open issues from review:** BUG-043 (hardcoded opponent rating), BUG-044 (no reset in settings)

### ENH-002 Instant Decision Feedback with EV Impact -- SHIPPED

- **Status:** Shipped (commits `b6bb1b8`, `78a7f45`)
- **Review verdict:** 4-tier grading, EV loss calculation, and Monte Carlo equity all correctly implemented in 5 of 7 trainers.
- **Open issues from review:** BUG-031 (board texture + pot odds missing EV feedback), BUG-037 (hardcoded fold equity), BUG-038 (cold call/squeeze return null), BUG-039 (EV loss floor), BUG-042 (CSS duplication)

### ENH-003 Progressive Web App (PWA) -- SHIPPED

- **Status:** Shipped (commit `5924809`)
- **Review verdict:** Service worker, manifest, and precaching all work. Technical PWA requirements met.
- **Open issues from review:** BUG-033 (placeholder icons), BUG-034 (static cache version), BUG-035 (no install prompt), BUG-036 (no update notification), BUG-041 (missing maskable purpose), BUG-046 (no offline indicator)

### ENH-004 Smart Practice / Spaced Repetition -- SHIPPED

- **Status:** Shipped (commit `03cf4e3`)
- **Review verdict:** SM-2 variant correctly implemented. SRS state stored in localStorage and included in export/import. Integrated into 5 of 7 trainers.
- **Open issues from review:** BUG-032 (board texture + pot odds not integrated), BUG-040 (multistreet keys too coarse), BUG-045 (session lost on refresh)

---

## E1 -- High-Impact Differentiators

### ENH-005 Achievement & Badge System with Gamification

- **Description:** Implement a comprehensive achievement system to boost retention and motivation. Achievements should reward both skill milestones AND consistency.
- **Achievement categories:**
  - **Skill milestones:** "Sharp Shooter" (90%+ accuracy in a 50-hand session), "Position Master" (80%+ accuracy from all positions), "Street Fighter" (complete 100 multi-street hands)
  - **Consistency streaks:** "Week Warrior" (7-day streak), "Monthly Grinder" (30-day streak), "Iron Will" (100-day streak)
  - **Volume badges:** "Century Club" (100 sessions), "1K Hands" (1,000 hands practiced), "10K Hands" (10,000 hands)
  - **Module mastery:** "Preflop Pro" (95%+ in all preflop modes), "Postflop Wizard" (95%+ in all postflop modes)
  - **Special:** "Perfect Session" (100% accuracy, 20+ hands), "Comeback Kid" (recover from <50% to >80% in one session)
- **Display:** Badge gallery page, unlocked badge toast notifications, badges shown on profile/dashboard

### ENH-006 Smart Study Plan Generator

- **Description:** Auto-generate a personalized daily/weekly study plan based on the user's weakness data. Analyze accuracy by position, trainer type, hand category, and board texture to identify the biggest leaks, then prescribe targeted practice.
- **Key components:**
  - Weakness detection engine (already partially exists in `stats.js`)
  - Priority-ranked list of weak areas with specific drills
  - Daily practice schedule: "Today's Plan: 15 min BB defense vs BTN, 10 min c-bet on wet boards, 5 min review missed hands"
  - Weekly progress report comparing plan targets vs actuals
  - Adaptive -- plan adjusts as weaknesses improve

### ENH-007 Range vs Range Equity Visualizer

- **Description:** Extend the equity calculator to support range vs range analysis. Instead of just "AKs vs QQ," allow users to input full ranges (using the existing hand grid) and see aggregate equity, equity distribution, and how ranges interact on different boards.
- **Key components:**
  - Two range selectors (using existing `HandGrid.js`)
  - Aggregate equity bar (Range A: 52.3% vs Range B: 47.7%)
  - Board input for flop/turn/river analysis
  - Equity distribution histogram
  - "Hot hands" breakdown -- which combos in each range contribute most equity
  - Flop subset analysis -- show how equity shifts across all 1,755 strategically distinct flops

### ENH-008 GTO Practice Bot (Play Against GTO)

- **Description:** Create a simulated opponent that plays GTO strategy. The user plays a full hand (preflop through river) against a bot that makes solver-optimal decisions. After each hand, show a full breakdown of where the user deviated from GTO and the EV cost.
- **Key components:**
  - Bot decision engine using existing range data + postflop frequencies
  - Realistic betting lines (open, 3-bet, c-bet, barrel, check-raise)
  - Hand-by-hand review with GTO comparison
  - Session stats: EV won/lost vs GTO baseline
  - Difficulty levels: "GTO" (perfect play), "Exploitative" (common player tendencies), "Fish" (loose-passive)

### ENH-009 Dark/Light Theme Refinement + Custom Themes

- **Description:** While dark/light themes exist, refine them to production polish level. Add a "felt green" poker theme. Allow CSS variable overrides for custom color schemes.
- **Key components:**
  - Refined dark theme (softer contrast, WCAG AA compliant)
  - Refined light theme (proper shadows, no washed-out elements)
  - "Poker Felt" theme (deep green background, classic casino feel)
  - Theme preview in settings
  - Smooth theme transition animations
  - Respect `prefers-color-scheme` OS setting by default

### ENH-010 Hand History Import (PokerStars / OHH format)

- **Description:** Allow users to import their real hand histories from online poker sites. Parse the hands and provide GTO analysis of each decision the user made in real play.
- **Key components:**
  - Parser for PokerStars HH format (the de facto standard)
  - Parser for Open Hand History (OHH) format for broader compatibility
  - Post-import analysis: compare each user decision vs GTO recommendation
  - Aggregate leak report: "In 500 imported hands, you're folding too much from CO (GTO says open 28%, you opened 19%)"
  - Integration with hand replayer for reviewed imported hands

---

## E2 -- Nice-to-Have Features

### ENH-011 ICM / Tournament Training Module

- **Description:** Add tournament-specific training covering ICM (Independent Chip Model), bubble play, final table strategy, and push/fold charts.
- **Key components:**
  - ICM calculator: input stack sizes + payout structure, output $EV for each player
  - Bubble factor display: show how much losing costs more than winning gains
  - Push/fold trainer for short-stack tournament play (Nash equilibrium ranges)
  - Final table scenarios with varying stack depths
  - Satellite-specific strategy (top-heavy vs flat payouts)

### ENH-012 Custom Scenario Builder

- **Description:** Let users create their own training scenarios. Define hero/villain positions, stack depths, board textures, and the correct GTO action. Share scenarios as JSON.
- **Key components:**
  - Visual scenario editor with position picker, hand selector, board builder
  - Custom correct-action assignment with explanation field
  - Save to personal scenario library
  - Import/export scenarios as JSON for sharing
  - Community scenario packs (curated collections)

### ENH-013 Detailed Performance Analytics Dashboard

- **Description:** Replace the current basic dashboard with a comprehensive analytics view inspired by PokerTracker's reporting.
- **Key components:**
  - Accuracy trend graph (line chart over time, by week/month)
  - Heat map of 13x13 hand grid showing accuracy per hand type
  - Position radar chart (accuracy by position, spider/radar graph)
  - Board texture performance breakdown (accuracy on dry vs wet vs static vs dynamic)
  - "Biggest Leaks" widget with specific actionable drills
  - Time-of-day performance analysis
  - Comparison: this week vs last week, this month vs last month

### ENH-014 Sound Effects & Audio Feedback

- **Description:** Add optional sound effects for card dealing, chip clicking, correct/incorrect answers, and achievement unlocks.
- **Key components:**
  - Card deal sound on new hand
  - Chip sound on raise/bet
  - Success chime on correct answer
  - Error buzz on incorrect answer
  - Master volume control + per-category toggles
  - Respect system mute/vibrate settings

### ENH-015 Timed Challenge Mode

- **Description:** Add a speed-based training mode where users must make GTO-correct decisions under time pressure.
- **Key components:**
  - Configurable timer per decision (5s, 10s, 15s, 30s)
  - Visual countdown bar
  - Auto-fold on timeout (mimics real poker timebank)
  - Speed accuracy trade-off tracking
  - "Speed Rating" separate from accuracy rating

### ENH-016 Multi-Language Support (i18n)

- **Description:** Internationalize the app to support multiple languages.
- **Key components:**
  - Extract all UI strings to locale files (JSON)
  - Language picker in settings
  - RTL support for Arabic
  - Locale-aware number/date formatting

### ENH-017 Keyboard Shortcut Customization

- **Description:** Allow users to rebind keyboard shortcuts.
- **Key components:**
  - Shortcut editor in settings
  - Default presets: "Standard" (R/C/F), "WASD" (W/A/S/D), "Vim" (H/J/K/L)
  - Conflict detection
  - Visual shortcut reference overlay (press `?` to show)

---

## E3 -- Future Vision / Long-Term

### ENH-018 Multiplayer Training Rooms

- **Description:** Allow multiple users to practice together in real-time. Requires WebSocket backend.

### ENH-019 AI Coach with Natural Language Explanations

- **Description:** Integrate an LLM-powered coaching layer that explains GTO decisions in plain English.

### ENH-020 Solver Integration for Custom Spots

- **Description:** Client-side simplified CFR solver for common spots.

### ENH-021 Cloud Sync & Cross-Device Progress

- **Description:** Optional cloud backup and sync (Firebase/Supabase).

### ENH-022 Omaha & Short-Deck Variants

- **Description:** Extend the trainer to support PLO and Short-Deck Hold'em.

---

# PART 3 -- COMPETITIVE POSITIONING SUMMARY

## Current State vs Market (updated post-E0 ship)

| Feature | Our App | GTO Wizard | Postflop+ | PeakGTO | NTPoker |
|---------|---------|------------|-----------|---------|---------|
| Preflop Training | 6 modes | Full | Limited | Full | Full |
| Postflop Training | 5 modes | Full | Full (offline) | Full | Basic |
| Multi-Street | Yes | Yes | Yes | Yes | Yes |
| Equity Calculator | Hand vs Hand | Full solver | Built-in | N/A | Range + Hand |
| ELO Rating | Yes (v1) | No | Yes | Yes | No |
| EV Feedback | 4-tier (5/7 trainers) | EV cost | 4-tier | EV + coaching | Basic |
| Spaced Repetition | Yes (5/7 trainers) | No | No | No | No |
| Achievements | **Missing** | No | No | No | No |
| PWA / Offline Install | Yes (needs icons) | Web only | Native app | Web only | Native app |
| ICM / Tournament | **Missing** | Yes (premium) | Yes | Yes | No |
| Hand History Import | **Missing** | Yes | No | No | No |
| Range vs Range | **Missing** | Yes | Yes | Yes | Yes |
| Study Plan | **Missing** | Partial | No | No | No |
| Price | Free | $35+/mo | $9.99/mo | $49/mo | Free tier |

## Our Unique Advantages (to double down on)

1. **Zero dependencies, zero cost** -- completely free, runs locally, no account needed
2. **Privacy-first** -- all data stays in browser, no telemetry
3. **Lightweight** -- ~200KB total, instant loads, works on any device
4. **Open source** -- community can contribute scenarios, ranges, translations
5. **Spaced Repetition** -- no competitor has this (first mover advantage)

## Immediate Priorities (post-E0 polish)

1. **BUG-033** Real PWA icons -- the app can't be installed in its current state
2. **BUG-031/032** Board Texture + Pot Odds trainer parity -- complete the EV + SRS integration across all 7 trainers
3. **BUG-034** Cache versioning -- deployed updates must actually reach users
4. **BUG-038** Cold call/squeeze EV -- complete the preflop EV coverage

## Next E1 Priorities

1. **ENH-005** Achievements -- drives retention and daily engagement
2. **ENH-007** Range vs Range -- required for serious poker study
3. **ENH-006** Study Plan -- turns leak detection into an actionable plan

---

*Last reviewed: 2026-02-16 | Reviewer: Implementation review of ENH-001 through ENH-004 + all bug fixes*

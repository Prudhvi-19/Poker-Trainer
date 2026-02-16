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

## All Clear

**No open bugs.** 46 bugs tracked total (BUG-001 through BUG-046), all fixed and verified across two review cycles. See `closedBugs.md` for full history.

**Note:** BUG-041 (manifest missing maskable icon purpose) was fixed as part of BUG-033 commit `e72773d` and documented within that entry in `closedBugs.md`. All 16 review-cycle bugs (BUG-031 through BUG-046) verified correct during second review pass on 2026-02-16.

---

# PART 2 -- FEATURE ENHANCEMENTS

## E0 -- Shipped (all verified clean)

_All 4 E0 enhancements shipped and all post-ship review bugs resolved._

### ENH-001 ELO / Skill Rating System -- SHIPPED + POLISHED

- **Status:** Shipped (commit `0716cb6`) + review fixes (commit `ea34112`)
- **Review verdict:** Correct implementation. ELO formula, K-factor scaling, tier badges all working.
- **Post-ship fixes applied:** BUG-043 (context-aware opponent rating via `opponentRatingForContext()`), BUG-044 (rating reset button in settings with modal confirmation)
- **Remaining review issues:** None

### ENH-002 Instant Decision Feedback with EV Impact -- SHIPPED + POLISHED

- **Status:** Shipped (commits `b6bb1b8`, `78a7f45`) + review fixes (commits `8ad666e`, `ea34112`)
- **Review verdict:** 4-tier grading, EV loss, and Monte Carlo equity now correctly implemented across **all 7 trainers**.
- **Post-ship fixes applied:** BUG-031 (board texture + pot odds EV feedback), BUG-037 (fold equity documented as 100bb cash approximation), BUG-038 (cold call + squeeze EV models added), BUG-039 (EV loss floor removed), BUG-042 (CSS grade styles consolidated)
- **Remaining review issues:** None

### ENH-003 Progressive Web App (PWA) -- SHIPPED + POLISHED

- **Status:** Shipped (commit `5924809`) + review fixes (commits `e72773d`, `ea34112`)
- **Review verdict:** Full PWA with real icons, install prompt, update notifications, stale-while-revalidate caching, maskable icons, and offline indicator.
- **Post-ship fixes applied:** BUG-033 (real poker-themed icons), BUG-034 (stale-while-revalidate cache strategy), BUG-035 (beforeinstallprompt + install button with iOS fallback), BUG-036 (controllerchange update notification modal), BUG-041 (maskable icon purpose in manifest), BUG-046 (online/offline badge in sidebar)
- **Remaining review issues:** None

### ENH-004 Smart Practice / Spaced Repetition -- SHIPPED + POLISHED

- **Status:** Shipped (commit `03cf4e3`) + review fixes (commits `8ad666e`, `ea34112`)
- **Review verdict:** SM-2 variant correctly implemented. SRS now integrated across **all 7 trainers** with granular scenario keys and session recovery.
- **Post-ship fixes applied:** BUG-032 (board texture + pot odds SRS integration), BUG-040 (multistreet keys now include heroIsAggressor + texture), BUG-045 (Smart Practice session resumes on page refresh with modal prompt)
- **Remaining review issues:** None

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

## Current State vs Market (updated post-review-fix)

| Feature | Our App | GTO Wizard | Postflop+ | PeakGTO | NTPoker |
|---------|---------|------------|-----------|---------|---------|
| Preflop Training | 6 modes | Full | Limited | Full | Full |
| Postflop Training | 5 modes | Full | Full (offline) | Full | Basic |
| Multi-Street | Yes | Yes | Yes | Yes | Yes |
| Equity Calculator | Hand vs Hand | Full solver | Built-in | N/A | Range + Hand |
| ELO Rating | Yes (context-aware) | No | Yes | Yes | No |
| EV Feedback | 4-tier (all 7 trainers) | EV cost | 4-tier | EV + coaching | Basic |
| Spaced Repetition | Yes (all 7 trainers) | No | No | No | No |
| Achievements | **Missing** | No | No | No | No |
| PWA / Offline Install | Yes (full UX) | Web only | Native app | Web only | Native app |
| ICM / Tournament | **Missing** | Yes (premium) | Yes | Yes | No |
| Hand History Import | **Missing** | Yes | No | No | No |
| Range vs Range | **Missing** | Yes | Yes | Yes | Yes |
| Study Plan | **Missing** | Partial | No | No | No |
| Price | Free | $35+/mo | $9.99/mo | $49/mo | Free tier |

## Our Unique Advantages

1. **Zero dependencies, zero cost** -- completely free, runs locally, no account needed
2. **Privacy-first** -- all data stays in browser, no telemetry
3. **Lightweight** -- ~200KB total, instant loads, works on any device
4. **Open source** -- community can contribute scenarios, ranges, translations
5. **Spaced Repetition** -- no competitor has this (first mover advantage)
6. **Full PWA** -- installable on any device with offline support, update notifications, and install prompt

## Next Priorities (E1)

1. **ENH-005** Achievements -- drives retention and daily engagement
2. **ENH-007** Range vs Range -- required for serious poker study
3. **ENH-006** Study Plan -- turns leak detection into an actionable plan

---

*Last reviewed: 2026-02-16 | Reviewer: Second review pass -- all BUG-031..046 verified fixed, zero new issues*

# Open Bugs & Feature Enhancements (Audit)

This file tracks **known open bugs, logic/UX issues, and feature enhancements** found during comprehensive code review and competitive analysis.

- **Repo:** Poker-Trainer
- **Working branch:** `audit/bug-hunt`
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

## P0 -- Critical

✅ No open **P0** issues currently (BUG-011/012/013 fixed; see `closedBugs.md`).

---

## P1 -- High

✅ No open **P1** issues currently (as of 2026-02-16). See `closedBugs.md` for details.

---

## P2 -- Medium

✅ No open **P2** issues currently (as of 2026-02-16). See `closedBugs.md` for details.

---

## P3 -- Minor / Polish

✅ No open **P3** issues currently (as of 2026-02-16). See `closedBugs.md` for details.

---

# PART 2 -- FEATURE ENHANCEMENTS

## E0 -- Must-Ship (Table Stakes vs Competitors)

_Note: shipped enhancements are tracked in_ `closedBugs.md` _(e.g. ENH-001, ENH-002)._ 

### ENH-003 Progressive Web App (PWA) with Offline Support

- **Competitive gap:** [Postflop+](https://www.craftywheel.com/postflopplus) is "the only GTO poker trainer that works without an internet connection." Our app already runs client-side but cannot be installed or used offline after browser cache clears.
- **Description:** Convert the app into a full PWA with service worker, web app manifest, and installability. This gives us:
  - "Add to Home Screen" on mobile (feels like a native app)
  - True offline support (service worker caches all assets)
  - Push notification capability (for streak reminders)
  - App-store-like discoverability via PWABuilder
- **Key components:**
  - `manifest.json` with app name, icons (192px, 512px), theme color, display: standalone
  - Service worker with cache-first strategy for all static assets
  - Offline fallback page
  - Install prompt handling
- **Reference:** [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps), [PWABuilder](https://www.pwabuilder.com/)

- **Status:** ✅ Shipped (see `closedBugs.md`)

### ENH-004 Spaced Repetition System for Weak Spots

- **Competitive gap:** No major poker trainer has SRS built in. This would be a first-mover advantage. [Preflop AI](https://apps.apple.com/us/app/gto-poker-trainer-preflop-ai/id6747779080) uses "Duolingo-style" learning but without true SRS scheduling.
- **Description:** Track which hand types, positions, and scenarios the user consistently gets wrong. Use a spaced repetition algorithm (SM-2 or FSRS) to schedule targeted practice sessions. Hands the user struggles with appear more frequently; mastered hands appear less often.
- **Key components:**
  - Per-hand-type difficulty rating (based on historical accuracy)
  - Review interval scheduling (1 day, 3 days, 7 days, 14 days, 30 days)
  - "Smart Practice" mode that prioritizes weak spots
  - Visual progress bars showing mastery per hand category
  - Daily review queue with estimated session length
- **Reference:** [Spaced repetition for poker ranges](https://www.pokerstrategy.com/news/content/How-to-memorise-a-poker-range_115334/), [FSRS algorithm](https://github.com/open-spaced-repetition/fsrs4anki/wiki/spaced-repetition-algorithm:-a-three%E2%80%90day-journey-from-novice-to-expert), [BBZ Poker study techniques](https://bbzpoker.com/5-proven-techniques-to-help-you-study-poker-charts/)

- **Status:** ✅ Shipped (see `closedBugs.md`)

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
- **Design principle:** Make achievements challenging enough to feel meaningful but achievable enough to maintain motivation. Avoid rewarding pure volume over quality (ref: [gamification pitfalls](https://europeangaming.eu/portal/latest-news/2025/08/22/189908/why-gamification-is-reshaping-online-poker/)).
- **Reference:** [Gamification best practices in poker](https://creatiosoft.com/blogs/gamification-in-online-poker/), [SaaS gamification examples](https://userpilot.com/blog/gamification-example-saas/)

### ENH-006 Smart Study Plan Generator

- **Description:** Auto-generate a personalized daily/weekly study plan based on the user's weakness data. Analyze accuracy by position, trainer type, hand category, and board texture to identify the biggest leaks, then prescribe targeted practice.
- **Key components:**
  - Weakness detection engine (already partially exists in `stats.js`)
  - Priority-ranked list of weak areas with specific drills
  - Daily practice schedule: "Today's Plan: 15 min BB defense vs BTN, 10 min c-bet on wet boards, 5 min review missed hands"
  - Weekly progress report comparing plan targets vs actuals
  - Adaptive -- plan adjusts as weaknesses improve
- **Why it matters:** [GTO Wizard](https://gtowizard.com/) has aggregated reports but no personalized study plans. [Preflop AI](https://apps.apple.com/us/app/gto-poker-trainer-preflop-ai/id6747779080) has structured lessons but not personalized to the player's leaks. A truly adaptive study planner would be unique in the market.

### ENH-007 Range vs Range Equity Visualizer

- **Description:** Extend the equity calculator to support range vs range analysis. Instead of just "AKs vs QQ," allow users to input full ranges (using the existing hand grid) and see aggregate equity, equity distribution, and how ranges interact on different boards.
- **Key components:**
  - Two range selectors (using existing `HandGrid.js`)
  - Aggregate equity bar (Range A: 52.3% vs Range B: 47.7%)
  - Board input for flop/turn/river analysis
  - Equity distribution histogram
  - "Hot hands" breakdown -- which combos in each range contribute most equity
  - Flop subset analysis -- show how equity shifts across all 1,755 strategically distinct flops
- **Reference:** [GTO Wizard aggregated reports](https://gtowizard.com/), [NTPoker range equity](https://apps.apple.com/us/app/gto-preflop-trainer-ntpoker/id1630961215)

### ENH-008 GTO Practice Bot (Play Against GTO)

- **Description:** Create a simulated opponent that plays GTO strategy. The user plays a full hand (preflop through river) against a bot that makes solver-optimal decisions. After each hand, show a full breakdown of where the user deviated from GTO and the EV cost.
- **Key components:**
  - Bot decision engine using existing range data + postflop frequencies
  - Realistic betting lines (open, 3-bet, c-bet, barrel, check-raise)
  - Hand-by-hand review with GTO comparison
  - Session stats: EV won/lost vs GTO baseline
  - Difficulty levels: "GTO" (perfect play), "Exploitative" (common player tendencies), "Fish" (loose-passive)
- **Reference:** [Upswing Lucid GTO Trainer](https://upswingpoker.com/lucid-gto-trainer/), [Simple GTO Trainer](https://simplepoker.com/en/Solutions/Simple_GTO_Trainer)

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
- **Reference:** [Open Hand History spec](https://hh-specs.handhistory.org), [PHH standard](https://arxiv.org/html/2312.11753v2), [hhp JS parser](https://github.com/thlorenz/hhp)

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
- **Why it matters:** Currently the app only covers cash game strategy. Tournament poker is a massive segment. [GTO Wizard](https://gtowizard.com/) charges premium for ICM features.
- **Reference:** [ICM basics](https://blog.gtowizard.com/icm-basics/), [PokerCoaching ICM guide](https://pokercoaching.com/blog/poker-icm/), [Bubble factor explained](https://www.pokerlistings.com/poker-strategies/tournament-nl-holdem/how-to-play-most-profitably-on-the-bubble-with-the-help-of-icm)

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
- **Reference:** [PokerTracker 4 analytics](https://www.pokerscout.com/best-poker-software-tools/), [Best poker software comparison](https://www.pokerstrategy.com/online-poker/best-poker-software/)

### ENH-014 Sound Effects & Audio Feedback

- **Description:** Add optional sound effects for card dealing, chip clicking, correct/incorrect answers, and achievement unlocks. Sound reinforces learning through multi-sensory feedback.
- **Key components:**
  - Card deal sound on new hand
  - Chip sound on raise/bet
  - Success chime on correct answer
  - Error buzz on incorrect answer
  - Achievement fanfare on badge unlock
  - Master volume control + per-category toggles
  - Respect system mute/vibrate settings
- **Note:** Settings already mention "sound effects" in the README but no audio is implemented.

### ENH-015 Timed Challenge Mode

- **Description:** Add a speed-based training mode where users must make GTO-correct decisions under time pressure. Mirrors the real-time decision-making of actual poker.
- **Key components:**
  - Configurable timer per decision (5s, 10s, 15s, 30s)
  - Visual countdown bar
  - Auto-fold on timeout (mimics real poker timebank)
  - Speed accuracy trade-off tracking
  - "Speed Rating" separate from accuracy rating
  - Leaderboard potential (personal bests)

### ENH-016 Multi-Language Support (i18n)

- **Description:** Internationalize the app to support multiple languages. Poker is global -- Spanish, Portuguese, German, French, Japanese, and Chinese would cover the largest poker markets.
- **Key components:**
  - Extract all UI strings to locale files (JSON)
  - Language picker in settings
  - RTL support for Arabic
  - Locale-aware number/date formatting
  - GTO terminology glossary per language

### ENH-017 Keyboard Shortcut Customization

- **Description:** Allow users to rebind keyboard shortcuts. Some users may prefer WASD, vim keys, or have accessibility needs.
- **Key components:**
  - Shortcut editor in settings
  - Default presets: "Standard" (R/C/F), "WASD" (W/A/S/D), "Vim" (H/J/K/L)
  - Conflict detection
  - Visual shortcut reference overlay (press `?` to show)

---

## E3 -- Future Vision / Long-Term

### ENH-018 Multiplayer Training Rooms

- **Description:** Allow multiple users to practice together in real-time. One player acts as hero, others observe and make independent decisions, then compare. Requires WebSocket backend.
- **Key components:**
  - Room creation with shareable link
  - Real-time synchronization of scenarios
  - Independent decision tracking per participant
  - Post-hand discussion/comparison view
  - Leaderboard within room

### ENH-019 AI Coach with Natural Language Explanations

- **Description:** Integrate an LLM-powered coaching layer that explains GTO decisions in plain English. Instead of just "Fold is correct," explain "You should fold A7o from UTG because your hand is too weak to profitably open from early position. The hands that play well from UTG need to be strong enough to withstand 3-bets from five remaining positions."
- **Key components:**
  - Context-aware explanations for every decision
  - "Ask the Coach" button for deeper analysis
  - Personalized tips based on user's historical weaknesses
  - Concept linking (connect decisions to theory lessons)

### ENH-020 Solver Integration for Custom Spots

- **Description:** Allow users to define custom game trees and solve for GTO strategy using a client-side simplified solver (CFR algorithm). Not full PioSolver, but a lightweight approximation for common spots.
- **Key components:**
  - Custom game tree builder (bet sizes, positions, stack depths)
  - Simplified CFR solver running in Web Workers
  - Strategy visualization (range splits by action)
  - EV comparison between strategies
- **Reference:** [GTOBase solver approach](https://gtobase.com/), [Simple GTO Trainer custom drills](https://simplepoker.com/en/Solutions/Simple_GTO_Trainer)

### ENH-021 Cloud Sync & Cross-Device Progress

- **Description:** Add optional cloud backup and sync so users can practice on desktop and mobile seamlessly. Could use a simple backend (Firebase, Supabase) or peer-to-peer sync.
- **Key components:**
  - Optional account creation (email or anonymous)
  - Auto-sync localStorage to cloud on session end
  - Conflict resolution for concurrent edits
  - Export/import as fallback for offline-first users

### ENH-022 Omaha & Short-Deck Variants

- **Description:** Extend the trainer to support Pot-Limit Omaha (PLO) and Short-Deck (6+) Hold'em. Both are growing rapidly in online poker.
- **Key components:**
  - 4-card hand display for Omaha
  - Omaha equity calculator (more complex combinatorics)
  - Short-deck adjusted hand rankings (flush beats full house)
  - Variant-specific GTO ranges
  - Variant selector in settings

---

# PART 3 -- COMPETITIVE POSITIONING SUMMARY

## Current State vs Market

| Feature | Our App | GTO Wizard | Postflop+ | PeakGTO | NTPoker |
|---------|---------|------------|-----------|---------|---------|
| Preflop Training | 6 modes | Full | Limited | Full | Full |
| Postflop Training | 5 modes | Full | Full (offline) | Full | Basic |
| Multi-Street | Yes | Yes | Yes | Yes | Yes |
| Equity Calculator | Hand vs Hand | Full solver | Built-in | N/A | Range + Hand |
| ELO Rating | Yes (v1) | No | Yes | Yes | No |
| EV Feedback | 4-tier + EV loss | EV cost | 4-tier | EV + coaching | Basic |
| Spaced Repetition | **Missing** | No | No | No | No |
| Achievements | **Missing** | No | No | No | No |
| PWA / Offline Install | **Missing** | Web only | Native app | Web only | Native app |
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

## Biggest Gaps to Close (priority order)

1. **ENH-003** PWA -- users need to install and use offline on mobile
2. **ENH-004** Spaced Repetition -- unique differentiator, no competitor has this
3. **ENH-005** Achievements -- drives retention and daily engagement
4. **ENH-007** Range vs Range -- required for serious poker study

---

*Last reviewed: 2026-02-16 | Reviewer: Code audit + competitive analysis*

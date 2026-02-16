# Theory Enhancement Plan (Concepts Knowledge Base)

Goal: grow the in-app **Concepts & Theory** content into a comprehensive, structured study curriculum that is **tailored to the trainers in this repo** (Preflop, Postflop, C-bet, Bet Sizing, Pot Odds, Board Texture, Multi-street, Equity Calculator) and supports long-term, iterative expansion.

This document is the execution plan + checklist (“booklist”). We will check items off one by one and steadily expand `js/data/concepts.js` (and any supporting UI) without breaking the app.

---

## Success criteria

- Concepts content covers **every decision type** the trainers ask users to make.
- Content is **structured** (clear modules/chapters) and **searchable/scannable**.
- Explanations are **actionable** (what to do, why, and what changes the decision).
- Concepts include **examples** aligned with existing trainers (positions, sizes, textures).
- No “hand-wavy” advice: whenever we give a rule, we also give its **assumptions** and **common exceptions**.
- The app remains fast (concept content is data-only; no heavy dependencies).

---

## Constraints / repo rules

- Keep changes on a feature branch (this branch: `cocepts_theory`).
- Prefer small, reviewable commits.
- Avoid duplicate sources of truth (share reusable logic in `js/utils/*` only when needed).
- Concepts must remain consistent with trainer logic (avoid contradicting what the app grades as “correct”).

---

## Approach (iterative)

We’ll work in “chapters”. Each chapter:

1) Write content in `js/data/concepts.js` (or split into additional data files if it grows too large).
2) Add a small set of **trainer-linked examples**.
3) Add a short **self-check quiz** section inside the concept page (lightweight; still static content).
4) Verify visually in the Concepts module.
5) Commit.

To keep quality high, every chapter will follow a consistent template:

- **Definition**
- **Why it matters**
- **Rules of thumb** (with assumptions)
- **Common mistakes**
- **Worked examples** (preferably matching our trainers)
- **Drills** (which trainer mode to use + what to focus on)

---

## Booklist / Checklist (check off one by one)

### A. Foundations (required for every trainer)

- [ ] A1. Positions & table geometry (6-max, BTN/SB/BB/UTG/HJ/CO)
- [ ] A2. Action vocabulary + bet sizing vocabulary (open/3b/4b/call/fold/check/raise)
- [ ] A3. Ranges & combos (169 hands, combos, blockers, suited vs offsuit)
- [ ] A4. Equity, pot odds, and required equity (call thresholds)
- [ ] A5. Expected value (EV) basics (chip EV, bb EV; why EV loss matters)
- [ ] A6. Fold equity (what it is; what drives it; where our models approximate)
- [ ] A7. Initiative & range advantage vs nut advantage
- [ ] A8. SPR (stack-to-pot ratio) and how it changes strategy
- [ ] A9. Why GTO is a baseline + when exploit deviations are reasonable

### B. Preflop (maps to Preflop Trainer)

- [ ] B1. RFI strategy by position (goals, construction, why BTN widens)
- [ ] B2. 3-bet strategy (value vs bluff, linear vs polarized)
- [ ] B3. 4-bet strategy (ranges, blockers, sizing, when to call)
- [ ] B4. Cold calling (when it’s allowed, why it’s often tight, multiway effects)
- [ ] B5. Squeezes (fold equity vs two players, sizing, when not to squeeze)
- [ ] B6. BB defense (MDF intuition, pot odds, suited hands realization)
- [ ] B7. SB strategy (3-bet or fold tendencies; why calling is tricky)
- [ ] B8. Preflop sizing standards (2x/2.5x/3x opens, 3b sizing IP/OOP)
- [ ] B9. Common preflop leaks (over-calling, under-defending BB, wrong blockers)

### C. Postflop single-street (maps to Postflop Trainer + Cbet Trainer)

- [ ] C1. Board texture taxonomy (dry/wet/static/dynamic) + examples
- [ ] C2. C-betting: when to bet vs check (range betting vs split strategy)
- [ ] C3. Facing c-bets: call/raise/fold heuristics (equity + realization)
- [ ] C4. Draws: strong vs weak; implied odds; semi-bluffing logic
- [ ] C5. Protection vs value vs bluff (what each means)
- [ ] C6. Overcards and backdoors (when they matter)
- [ ] C7. Position: IP vs OOP play patterns
- [ ] C8. Common flop mistakes (over-bluffing wet boards, slowplaying wrong spots)

### D. Turn & River (maps to Postflop Trainer)

- [ ] D1. Turn barreling: card selection, equity shifts, double-barrel logic
- [ ] D2. River value: thin value vs bluff-catch vs give-up
- [ ] D3. Bluff construction (blockers, unblockers, minimum defense frequency intuition)
- [ ] D4. Overbet theory (when it appears; polar ranges)
- [ ] D5. Check-raise theory (value/bluff ratios; when it’s credible)

### E. Multi-street planning (maps to Multi-street Trainer)

- [ ] E1. Street-by-street plan: what changes from flop→turn→river
- [ ] E2. Range narrowing and combinatorics across streets
- [ ] E3. Runouts: good vs bad turns/rivers for aggressor/defender
- [ ] E4. Pot geometry and sizing sequences (33/75/overbet lines)

### F. Bet sizing (maps to Bet Sizing Trainer)

- [ ] F1. Why size matters (fold equity + value extraction + denial)
- [ ] F2. Small vs big bets on different textures
- [ ] F3. Sizing with value vs bluffs (keeping ranges coherent)
- [ ] F4. Common sizing heuristics in SRP and 3bp

### G. Pot odds & calling thresholds (maps to Pot Odds Trainer)

- [ ] G1. Pot odds math (quick mental shortcuts)
- [ ] G2. Implied odds / reverse implied odds
- [ ] G3. Equity realization: why 30% raw equity isn’t always 30% realized
- [ ] G4. Multiway pot odds adjustments

### H. Equity calculator / hand strength

- [ ] H1. Hand rankings refresher (incl. board plays)
- [ ] H2. Equity vs range vs hand (why ranges matter)
- [ ] H3. Variance in Monte Carlo sims; why iterations matter (determinism in our app)

### I. Meta-learning (how to study with this app)

- [ ] I1. How to use EV loss + grades to guide improvement
- [ ] I2. How to use Skill Rating without “gaming” it
- [ ] I3. How to use Smart Practice (SRS) effectively
- [ ] I4. How to review hands (Hand Replayer workflow)

---

## First implementation milestone (Phase 1)

When you approve, I’ll start by implementing **A1–A5** plus **G1** (pot odds math) because they underpin nearly every trainer and will make the rest easier.

Deliverables for Phase 1:

- Expand `js/data/concepts.js` with new sections for A1–A5 and G1
- Add “Drills” links pointing to the relevant trainer modules
- Ensure the Concepts UI still renders smoothly

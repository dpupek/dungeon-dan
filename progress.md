Original prompt: PLEASE IMPLEMENT THIS PLAN:
# Phase 5 Plan: Maypole Spang Run

2026-05-12

- Implemented the Phase 5 bonus-room slice in the gameplay runtime.
- Added `maypole-spang-run`, a one-attempt Beltane gate in `fossil-stair`, 12 score-only spangs, and flying cow hazards.
- Added bonus-round state tracking to `RunState` for unlock, active timer, spang score, and authored return context.
- Added HUD switching for active bonus rounds and a debug `render_game_to_text` snapshot hook for browser verification.
- Validation:
  - `npm test` passed.
  - `npm run build` passed before the browser-validation hook was added, then the post-hook browser pass verified the Maypole flow using `window.render_game_to_text`.
  - Browser/runtime verification confirmed:
    - doorway locked before `fossil-shell`
    - doorway active after collecting `fossil-shell`
    - entering the doorway loads `maypole-spang-run`
    - cow collision returns to `fossil-stair` without reducing lives

TODO / follow-up:

- Add a more formal automated browser test around the bonus flow if the repo adopts a stable Playwright harness.
- Consider replacing remaining internal `treasure` naming with `relic` naming in runtime/config internals.

2026-05-14

- Addressed the Maypole HUD regression so the main run timer stays visible during the bonus round alongside the bonus countdown.

Validation

- `npm test` -> passed
- `npm run build` -> passed

2026-05-14

- Implemented the Phase 6 Stormshaft Bow champion-room slice in the gameplay runtime.
- Added `stormshaft-range` as a main-route room with a timing-focused relic encounter built around `The Stormshaft Bow`.
- Added a first reusable story-flow layer with authored room triggers, linear steward-echo sequences, soft gameplay lock, advance/skip input, and scripted relic-grant beats.
- Added a Phaser-native dialogue overlay controller that keeps story content renderer-agnostic while proving the first Zelda-style denizen conversation flow.
- Dev-gated the browser debug globals so validation hooks remain available locally without shipping an unconditional production surface.

Validation

- `npm test` -> passed
- `npm run build` -> passed
- Browser/runtime verification confirmed:
  - the Stormshaft intro trigger starts on room entry
  - player movement is blocked while dialogue is active
  - the Stormshaft outro starts on relic encounter
  - skipping the outro still grants `stormshaft-bow`
  - the final relic handoff transitions cleanly into the end scene

2026-05-14

- Polished the post-review Phase 5 and Phase 6 regressions from manual browser feedback.
- Moved the Beltane gate onto the main `fossil-stair` route and kept locked doorways visibly present with a dimmed `Locked` state.
- Added dedicated `stormshaft-bow` relic art instead of reusing the generic clam pickup.
- Fixed room-boundary handling so rooms without an authored exit clamp the player at the edge instead of allowing an offscreen death, and added a focused transition regression test.

Validation

- `npm test` -> passed
- `npm run build` -> passed

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

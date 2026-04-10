# Issue #6 Basement Recovery

This document tracks the implementation status and current design decisions for GitHub issue `#6`.

## Goal

Make accidental falls recoverable by turning the basement into an intentional traversal route instead of a near-dead-end or implicit game-over space.

## Current decisions

- Refer to the lowest authored traversal route as the **basement**.
- Refer to the main authored traversal route as the **ground floor**.
- Room exits remain edge-driven. The engine still allows left/right transitions at the room boundary.
- Basement recovery may span multiple rooms; same-room recovery is not required.
- Basement routes should run continuously across the room width in the current design.
- Dan should remain on the same level when transitioning between rooms whenever the destination room has supporting edge geometry on that level.

## Implemented

- Added a continuous basement route across the room set in `src/game/data/rooms.ts`.
- Raised the ground floor to create a larger visual and gameplay separation from the basement.
- Extended the `sunken-vault` ladder so the basement route has a clear authored recovery point back to the ground floor.
- Updated room transition spawns so Dan stays on the basement or ground floor when crossing room boundaries, based on the level he was on in the prior room.
- Updated ladder handling so Dan can step off a ladder onto supported basement geometry without having to jump.
- Updated room-authoring and debugging docs to describe the basement route convention and same-level room transitions.

## Validation status

- `npm run build` passes.
- `npm test` passes.
- Manual checks confirmed:
  - the basement route renders across the room set
  - Dan can transition into the next room while staying on the basement route
  - the ladder exit behavior no longer requires a jump in the basement recovery flow

## Remaining checks

- Perform a full intentional-fall playthrough from each major drop point through to the `sunken-vault` recovery ladder.
- Re-check overall room feel now that the ground floor sits higher above the basement.
- Decide whether any hazards need retuning now that the basement path is a more explicit traversal lane.

## Next likely follow-ups

- Add a walking animation for Dan.
- Improve visual signaling so players understand the basement route is recoverable rather than a fail state.
- Add richer room background art without hurting gameplay readability.

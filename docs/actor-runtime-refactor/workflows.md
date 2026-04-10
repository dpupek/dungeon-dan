# Actor Runtime Refactor Workflows

## Goal

Refactor Dan's Dungeon so Phaser scenes orchestrate gameplay while actor, relic, room, spawn, HUD, and developer-console behavior live behind stable runtime boundaries.

## Baseline behavior

- Dan moves with custom platform support checks instead of Arcade physics collisions.
- Ladders use expanded grab bounds and allow basement/ground-floor traversal.
- Room transitions preserve floor when possible.
- Hazards move inside room-authored lanes and clamp to safe platform bounds.
- Relic collection updates score, persists across rooms, and ends the run when all relics are collected.
- The hidden developer console can jump rooms, choose spawn floor, adjust lives, and adjust time.

## Primary workflows

### Gameplay tick

1. Scene reads player input.
2. Player actor updates movement and animation state against room geometry.
3. Room runtime updates hazard and relic presentation.
4. Scene checks overlaps and transitions.
5. Session bridge updates run state and scene outcomes.
6. HUD and developer console render from current session + runtime state.

### Room load

1. Session bridge moves to the target room.
2. Room runtime rebuilds platforms, ladders, hazard actors, and relic actors.
3. Spawn resolver picks a supported ground-floor or basement entry point.
4. Player actor respawns into the room with reset transient state.

### Debug workflow

1. Developer console opens during gameplay only.
2. Console reads current room, floor, score, lives, relic count, and time.
3. Console dispatches explicit commands back to the scene/session bridge.
4. Scene applies those commands without bypassing run-state ownership.

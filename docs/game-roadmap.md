# Dan's Dungeon Roadmap

This roadmap focuses on the next meaningful improvements to feel, content, readability, and replay value for the current five-room adventure.

## Phase 1: Movement and Readability

- [x] Add coyote time so late jumps near platform edges still register.
- [x] Add jump buffering so early jump presses trigger on landing.
- [x] Improve landing and hurt feedback with small pose timing or camera polish.
- [x] Tune monster placement so ground-level jumps stay fair and readable.
- [x] Add a short visual pass for platform readability against each room background.

## Phase 2: Room Identity and Variety

- [ ] Add 3 to 5 new rooms with stronger individual gimmicks.
- [ ] Introduce one room built around layered vertical routing instead of mostly flat traversal.
- [ ] Introduce one trap-driven room with timed environmental hazards.
- [ ] Introduce one room where the basement path is the safer route and the ground floor is higher risk.
- [ ] Make each relic room feel distinct through layout, hazard rhythm, or treasure placement.

## Phase 3: Audio and Atmosphere

- [ ] Add looping adventure music for active gameplay with persisted music-only volume controls.
- [ ] Add room ambience or lightweight environmental sound layers.
- [ ] Add richer relic pickup, damage, and room-transition sound cues.
- [ ] Add background art per room that supports the foreground instead of competing with it.

## Phase 4: Enemies and Encounters

- [ ] Add at least one new monster behavior beyond patrol, charge, and swoop.
- [ ] Give existing monsters clearer encounter roles so rooms are not just speed variants.
- [ ] Add encounter combinations that force route choices instead of only jump timing.
- [ ] Expand actor archetypes and animation support for more expressive monsters.

## Phase 5: Progression and Replay Value

- [ ] Add checkpoints or a limited continue system.
- [ ] Add a stronger end-of-run structure, such as escape pressure after the last relic.
- [ ] Add score bonuses for fast completion, no-death play, or full relic clears.
- [ ] Add a simple title-screen attract or briefing improvement so goals are clearer to first-time players.

## Phase 6: Quality and Production Hardening

- [ ] Add validation helpers or tests for room spacing and jump-space authoring rules.
- [ ] Reduce the current production bundle size warning if content growth continues.
- [ ] Add CI checks beyond build/test if room-data validation becomes automated.
- [ ] Keep docs, issue plans, and contributor guidance aligned with the gameplay systems that actually ship.

## Recommended order

If only a few items are tackled next, use this order:

1. Adventure music and ambience
2. Add a room with more varied platform heights
3. New room set with stronger gimmicks
4. One new monster behavior
5. Checkpoint or continue system

## Current recommendation

The next best slice is **audio and atmosphere**, starting with issue `#4`.

Why this is next:

- movement readability and baseline room readability are now in place
- music and ambience improve perceived polish across the entire game immediately
- audio is orthogonal to the current room/runtime work, so it is less likely to destabilize traversal

For `#4`, the intended v1 shape is:

- one looping adventure bed for gameplay
- separate music-only volume controls
- browser-persisted music volume and mute state
- no full settings menu yet

After `#4`, the next strongest gameplay-content item is issue `#5`, because the current room set still needs a more vertical platform-routing test case.

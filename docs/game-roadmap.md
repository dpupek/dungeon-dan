# Dan's Dungeon Roadmap

This roadmap focuses on the next meaningful improvements to feel, content, readability, and replay value for the current six-room adventure.

## Phase 1: Movement and Readability

- [x] Add coyote time so late jumps near platform edges still register.
- [x] Add jump buffering so early jump presses trigger on landing.
- [x] Improve landing and hurt feedback with small pose timing or camera polish.
- [x] Tune monster placement so ground-level jumps stay fair and readable.
- [x] Add a short visual pass for platform readability against each room background.

## Phase 2: Room Identity and Variety

- [ ] Add 3 to 5 new rooms with stronger individual gimmicks.
- [x] Introduce one room built around layered vertical routing instead of mostly flat traversal.
- [x] Ship `Fossil Stair` as the sixth room to fulfill issue `#5` and the room concept from `#11`.
- [ ] Introduce one trap-driven room with timed environmental hazards.
- [ ] Introduce one room where the basement path is the safer route and the ground floor is higher risk.
- [ ] Make each relic room feel distinct through layout, hazard rhythm, or treasure placement.

## Phase 3: Audio and Atmosphere

- [x] Add looping adventure music for active gameplay with persisted music-only volume controls.
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

The next best slice is **new room set content**, starting with the remaining authored room concepts after `Fossil Stair`.

Why this is next:

- movement readability, baseline room readability, music, and the first strongly vertical room are now in place
- the game benefits most from adding more authored room identities before introducing another system-heavy feature
- the remaining room concepts can build on the now-proven basement and ladder conventions

The strongest candidates now are:

- `#7` through `#16` for stronger room gimmicks
- `#3` for richer per-room background art once the authored room set is more stable
- a new monster behavior only after a few more room layouts prove where current hazards are repetitive

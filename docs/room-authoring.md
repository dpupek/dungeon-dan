# Room Authoring

Room content is authored in `src/game/data/rooms.ts`.

## Platforms

Platforms use center-based coordinates:

- `x`, `y`: center point
- `width`, `height`: rendered and logical size

The platform top is `y - height / 2`. Ground monsters should usually sit with their feet close to that top edge.

### Basement recovery routes

Basement routes are also authored as ordinary platforms in room data. There is no separate engine feature for "basement" in the current build.

Use these rules:

- An intentional fall catch should land Dan on authored basement geometry instead of sending him straight below the world bounds.
- Basement recovery platforms should run continuously across the room unless a future issue explicitly introduces a different authored convention.
- Basement exits remain edge-driven. If a room has a left or right exit, leave enough walkable space near that boundary for Dan to reach the edge transition.
- If you use a basement wall or obstacle shape, do not block the actual boundary edge that is meant to transition to the next room.
- A basement drop does not need same-room recovery, but it must lead to a readable route toward a future ladder.
- Avoid layouts that trap Dan in the basement with no ladder and no practical edge exit.
- If Dan transitions between rooms from the basement or the ground floor, the authored edge geometry should support arriving on that same level in the next room.

## Ladders

Ladders also use center-based coordinates:

- `x`, `y`: center point
- `width`, `height`: visual ladder size

The gameplay ladder grab zone is intentionally taller and wider than the art, especially at the top, so Dan can climb down from a platform without pixel-perfect alignment.

## Hazards

Hazards use these important fields:

- `x`, `y`: initial sprite position
- `width`, `height`: rendered size and movement-bound input
- `minX`, `maxX`: coarse lane hint, not the final movement span

At room load, `GameScene` resolves the platform that supports the hazard and clamps the hazard's runtime travel to a safe platform span. Author `minX` and `maxX` as the intended lane, then let the runtime clamp prevent edge overhang.

### Ground monsters

- Place `paul_crab` and `dave_goat` so their bottoms are near the platform top.
- Keep their lane centered on the platform they should patrol.
- Do not hand-tune lanes right up to platform edges unless the danger is part of the design.

### Flying monsters

- Place `mark_wasp` at the desired baseline flight height.
- `swoopDepth` controls vertical amplitude.
- `swoopRate` controls vertical tempo.
- Horizontal motion still uses a platform-derived safe lane, so keep the wasp visually associated with one platform span.

## Spawn points

Spawn points are safety-critical.

- `default` should always land Dan on supported floor
- `fromLeft` and `fromRight` should land on the correct side of a room transition without placing Dan in a pit or inside a ladder
- Use the same platform-top rule as player landing logic when choosing `y`

If a room starts with instant death, inspect spawn coordinates before changing physics.

## Basement validation

After adding or changing a basement route:

- Verify Dan can intentionally or accidentally fall onto it without dying immediately.
- Verify the route still reaches a future ladder or room exit.
- Verify room-edge exits still work from the basement if that room is meant to allow basement traversal.
- Verify room transitions preserve Dan's current level when he moves between the basement and the ground floor.

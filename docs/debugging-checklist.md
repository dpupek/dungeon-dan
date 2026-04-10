# Debugging Checklist

Use this file when a gameplay regression appears after art, room, or movement changes.

## Player falls through floor

Check these first:

- `src/game/runtime/actors/PlayerActor.ts`: movement update and platform landing logic
- `src/game/runtime/RoomRuntime.ts`: support-platform geometry queries
- `src/game/data/rooms.ts`: player spawn point and platform coordinates for the current room
- player render size vs. support assumptions in `GAME_CONFIG.player`

Questions to answer:

- Is the player feet position close enough to the platform top?
- Is the support inset too strict?
- Did a spawn point place Dan over empty space?

## Player hovers above platform after landing

Check:

- `PlayerActor` landing snap position
- player texture/display size
- platform top calculation

If the sprite changed recently, verify the art proportions still match the collision assumptions.

## Ladder is hard to enter or impossible to descend from platform

Check:

- `findActiveLadder` in `src/game/runtime/RoomRuntime.ts`
- ladder top reach vs. rendered ladder height
- player x-centering while climbing
- ladder coordinates in `src/game/data/rooms.ts`

Bias toward a forgiving top-entry zone. Strict ladders feel broken fast.

## Monster walks off platform

Check:

- `resolveHazardTravelBounds` in `src/game/runtime/RoomRuntime.ts`
- `findHazardPlatform` in `src/game/runtime/RoomRuntime.ts`
- monster display width
- room-authored `minX` and `maxX`

Remember that authored lane bounds are only hints. The runtime safe span should keep the visible sprite supported.

## Dan can drop into the basement but cannot recover

Check:

- basement-route platforms in `src/game/data/rooms.ts`
- whether the basement route still reaches the room edge for transition
- whether the intended recovery ladder exists in this room or a reachable adjacent room
- whether a basement obstacle blocks Dan before the actual room boundary

The current game uses authored geometry for basement recovery. If Dan is trapped, fix the room layout before adding new engine rules.

## Dan changes rooms and appears on the wrong level

Check:

- whether the exit edge is reachable from the level Dan is leaving
- whether the destination room has edge-supporting geometry on the matching level
- `resolveSpawnPoint` and transition spawn selection in `src/game/runtime/SpawnResolver.ts`

Ground-floor transitions should keep Dan on the ground floor, and basement transitions should keep him in the basement unless the room layout makes that impossible.

## Sprite looks wrong but collisions seem wrong too

Check both:

- `src/game/scenes/BootScene.ts` for the texture shape
- `src/game/runtime/` for display size, animation state, snap position, lane bounds, and overlap checks

In this project, visual tuning and gameplay tuning often need to move together.

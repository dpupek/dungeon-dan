# Gameplay Architecture

Dan's Dungeon keeps Phaser as the render shell, but gameplay responsibilities now live behind explicit runtime modules and actor contracts.

## Core split

- `src/game/data/rooms.ts`: author room geometry, exits, spawns, actor placement, and relic placement.
- `src/game/content/archetypes.ts`: define reusable actor and relic archetypes with behavior and animation defaults.
- `src/game/assets/manifest.ts`: define stable animation-set and texture keys.
- `src/game/state/RunState.ts`: own run-level rules. Score, lives, timer, collected relic ids, room transitions, win, and loss live here.
- `src/game/runtime/`: own scene-scoped gameplay runtime objects.
- `src/game/scenes/BootScene.ts`: generate textures and boot-time assets in code.
- `src/game/scenes/GameScene.ts`: orchestrate the runtime, route input, and react to scene outcomes.

## Runtime split

- `GameSessionBridge`: adapts scene commands to run-state mutations.
- `RoomRuntime`: owns platforms, ladders, hazard actors, relic actors, and room teardown.
- `PlayerActor`: owns Dan's movement, climb logic, facing, and animation state.
- `HazardActor`: owns per-instance hazard motion and presentation state.
- `RelicActor`: owns relic idle presentation and collection teardown.
- `SpawnResolver`: preserves ground-floor and basement spawn behavior across transitions.
- `HudController` and `DeveloperConsoleController`: own overlay UI and debug input surfaces.

## Player movement

The player still does not rely on Phaser Arcade bodies for floor contact. Dan uses a custom actor that:

- applies velocity and gravity manually
- resolves platform landing by finding a supporting platform near the player's feet
- resolves low overhead platforms as real ceilings so jump-under spaces can force a head-bump
- uses a larger ladder grab zone than the rendered ladder art
- derives animation state from gameplay state and plays named Phaser sprite animations from the committed Dan spritesheet

This keeps floor support stable while making walking, climbing, hurt, jump, and fall presentation easier to extend.

## Actor and relic content

Rooms are still data-driven, but runtime presentation no longer depends on inline scene branching.

- room instances reference actor and relic archetypes
- archetypes define behavior defaults and animation-set ids
- room data continues to own geometry and placement
- the runtime turns authored instances into disposable Phaser objects per room load

## Collision model

- Player-vs-platform: custom support checks through `RoomRuntime`
- Player-vs-ladder: rectangle overlap against an expanded ladder zone
- Player-vs-hazard: rectangle overlap against hazard actor bounds
- Player-vs-relic: rectangle overlap against relic actor bounds

## Practical rule

When a visual change seems to affect gameplay, inspect both the asset manifest and the runtime geometry. In this project, animation keys, render size, spawn position, ladder reach, and support bounds are tightly connected.

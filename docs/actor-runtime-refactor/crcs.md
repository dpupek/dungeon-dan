# Actor Runtime Refactor CRCs

## `GameScene`

- Responsibilities: scene orchestration, input routing, room loads, outcome transitions, death flow
- Collaborators: `GameSessionBridge`, `RoomRuntime`, `PlayerActor`, `HudController`, `DeveloperConsoleController`, `SpawnResolver`

## `GameSessionBridge`

- Responsibilities: adapt `RunStateController` into scene-facing session commands and snapshots
- Collaborators: `RunStateController`

## `RoomRuntime`

- Responsibilities: own room-scoped visual/runtime objects, geometry queries, hazard/relic updates, room teardown
- Collaborators: `HazardActor`, `RelicActor`, room content definitions

## `PlayerActor`

- Responsibilities: Dan movement state, climb state, facing, animation state, sprite synchronization
- Collaborators: `RoomRuntime`, player animation manifest

## `HazardActor`

- Responsibilities: per-instance hazard movement, presentation state, texture selection, lane-bound updates
- Collaborators: actor archetypes, hazard behavior strategy helpers

## `RelicActor`

- Responsibilities: relic idle presentation, sparkle/tween lifecycle, collection teardown
- Collaborators: relic archetypes, animation manifest

## `HudController`

- Responsibilities: render room label, run HUD, status text
- Collaborators: scene, session snapshot

## `DeveloperConsoleController`

- Responsibilities: render hidden debug console, track selection state, emit debug commands
- Collaborators: scene, room/session context

## `SpawnResolver`

- Responsibilities: pick supported ground-floor and basement spawns for room loads and transitions
- Collaborators: room geometry, `GameScene`

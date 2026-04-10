# Actor Runtime Refactor Roadmap

- [x] Phase 1: Baseline the current runtime behavior in shaping docs
- [x] Phase 1: Define actor/relic/archetype/animation/runtime vocabulary
- [x] Phase 1: Add asset and animation manifest layer
- [x] Phase 2: Extract `HudController`
- [x] Phase 2: Extract `DeveloperConsoleController`
- [x] Phase 2: Extract `SpawnResolver`
- [x] Phase 2: Extract `RoomRuntime`
- [x] Phase 3: Introduce `PlayerActor`
- [x] Phase 3: Introduce `HazardActor`
- [x] Phase 3: Introduce `RelicActor`
- [x] Phase 3: Route gameplay through `GameSessionBridge`
- [x] Phase 4: Migrate rooms to actor/relic archetype-backed instance definitions
- [ ] Phase 4: Expand content archetypes beyond the current three monsters and clam relic
- [ ] Phase 4: Add external sprite-sheet or generated frame-strip support when new art lands
- [ ] Phase 4: Evaluate moving the HUD to DOM if status density grows beyond the current canvas overlay

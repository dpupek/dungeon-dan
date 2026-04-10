# Actor Runtime Refactor Stakeholder Summary

This refactor is about keeping Dan's Dungeon easy to extend as Dan, the monsters, and the relics gain richer animation and behavior.

## Why this matters

- New actor types should not require more branching inside `GameScene`.
- Walking, climbing, hurt, patrol, charge, swoop, and idle presentation should come from explicit actor state.
- Room content should stay data-driven while behavior and animation defaults move into reusable archetypes.

## What changes for contributors

- Scene work becomes orchestration-focused instead of behavior-heavy.
- New monsters and relics are added by defining archetypes and placing room instances.
- Debug, HUD, spawn, and room runtime logic now live in their own modules.

## Expected outcome

- Faster feature work on animations and actor variants
- Lower risk of regression when touching room transitions or runtime presentation
- Clearer test seams for animation state, spawn rules, and hazard behavior

# Art Pipeline

Most gameplay art is generated in `src/game/scenes/BootScene.ts`, but Dan now uses a committed spritesheet at `public/images/dan-spritesheet.png`. The title-screen key art is also an external image asset loaded by BootScene from `public/images/title-box-art-refined.png`.

## Current generated textures

- `golden-clam-open`
- `golden-clam-closed`
- `paul-crab-a`
- `paul-crab-b`
- `dave-goat-a`
- `dave-goat-b`
- `dave-goat-scream`
- `mark-wasp-a`
- `mark-wasp-b`
- ladder and ground textures

## Current committed sprite sheets

- `public/images/dan-spritesheet.png`

## Working style

Favor silhouette-first shapes that read at small sizes:

- Dan should read as a hobbit at gameplay scale, not only when zoomed in
- monsters should have distinct outlines before color details matter
- ladders should read as climbable structures, not translucent bars
- relics should pop against the background

## Gameplay coupling

When changing art, also check:

- animation manifests in `src/game/assets/manifest.ts`
- actor sizing and presentation in `src/game/runtime/actors/`
- spawn heights and platform snap
- ladder grab range
- hazard safe travel inset

Changing a sprite from a block to a more expressive shape often shifts where players expect its feet, claws, or wings to be.

## Practical art rules

- Keep player art centered unless the movement code is updated to account for an off-center silhouette.
- Keep Dan's walk cycle bottom-centered across all frames so jump, landing, and ladder alignment stay stable.
- Keep ground monster feet visually near the bottom of the sprite box.
- Keep flying monster silhouettes balanced enough that horizontal flip still looks natural.
- Prefer a few high-contrast colors over muddy detail.

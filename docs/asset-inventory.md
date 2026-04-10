# Asset Inventory

This file documents the current asset boundary in Dan's Dungeon so docs and code do not drift apart.

## BootScene-generated gameplay assets

`src/game/scenes/BootScene.ts` generates these runtime textures:

- `wood-plank-a`
- `wood-plank-b`
- `wood-plank-c`
- `glint-4`
- `glint-8`
- `ladder`
- `golden-clam-open`
- `golden-clam-closed`
- `paul-crab-a`
- `paul-crab-b`
- `dave-goat-a`
- `dave-goat-b`
- `dave-goat-scream`
- `mark-wasp-a`
- `mark-wasp-b`

These are gameplay-facing textures used at runtime and should be treated as code-generated art.

## Committed static image assets

The repository currently ships these committed title-art images under `public/images/`:

- `title-box-art.png`
- `title-box-art-refined.png`
- `dan-spritesheet.png`

BootScene currently loads:

- `title-box-art-refined.png` as the `title-box-art` key
- `dan-spritesheet.png` as the `dan-spritesheet` player animation sheet

This means the title screen uses a committed bitmap, and Dan now uses a committed spritesheet instead of BootScene-generated player frames.

## Source-of-truth rules

Use these rules when updating docs or assets:

- If an asset is loaded with `this.load.image(...)`, treat it as a committed static asset.
- If an asset is built with `graphics.generateTexture(...)`, treat it as a BootScene-generated runtime texture.
- Do not describe all art as code-generated unless the title splash has also been moved into code.
- If the loaded title image changes, update `README.md`, `docs/art-pipeline.md`, and this file in the same change.

## Workflow notes

When updating title art:

1. Generate or revise the candidate image.
2. Commit only the intended final image under `public/images/`.
3. Confirm BootScene points at the correct file.
4. Confirm the README still renders the same asset path.

When updating gameplay art:

1. Check the generated texture code in `BootScene.ts`.
2. Check display sizing and collision assumptions in `src/game/runtime/`.
3. Re-read `docs/debugging-checklist.md` if the change affects feel or alignment.

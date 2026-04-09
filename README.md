# Dan's Dungeon

![Dan's Dungeon title art](public/images/title-box-art-refined.png)

Dan's Dungeon is a browser-based retro action platformer built with Phaser 3, TypeScript, and Vite. The current playable is a compact temple run with five connected rooms, treasure collection, moving hazards, ladders, pits, score, lives, and a countdown timer.

## What is in the repo

- `src/game/scenes/` contains the Boot, Title, Game, and End scenes.
- `src/game/state/RunState.ts` owns score, lives, timer, and collected treasure state.
- `src/game/data/rooms.ts` is the room-authoring source of truth.
- `public/images/title-box-art-refined.png` is the title graphic loaded by BootScene.
- `docs/` contains architecture, room-authoring, debugging, and art-pipeline notes.

## Run locally

1. Install Node.js 20+.
2. From `E:\Sandbox\dungeon-dan`, run `npm install`.
3. Start the dev server with `npm run dev`.
4. Build a production bundle with `npm run build`.
5. Run tests with `npm test`.

## Controls

- Arrow keys or `WASD`: move and climb
- `Space`: jump
- `P`: pause
- `R`: restart the run

## Project notes

- The browser title and public-facing name should remain `Dan's Dungeon`.
- Gameplay sprites and textures are generated in `src/game/scenes/BootScene.ts`.
- The title splash is a static image asset loaded by BootScene from `public/images/title-box-art-refined.png`.
- Sound effects are oscillator-based and do not rely on external audio assets.
- Room content is data-driven through typed room definitions in `src/game/data/rooms.ts`.

## Title art workflow

Python 3.12 and the `openai` package are used locally for higher-quality title art generation.

1. Set `OPENAI_API_KEY` in your shell or user environment.
2. From `E:\Sandbox\dungeon-dan`, run `python scripts/generate_title_art.py`.
3. Generated images should be written under ignored output paths such as `output/imagegen/title-box-art-api.png`.

You can also point the script at a custom prompt file:
`python scripts/generate_title_art.py --prompt-file docs/title-art-prompt.txt --out output/imagegen/title-box-art-v2.png`

## Architecture

- Player movement and platform support are handled by custom scene logic in `src/game/scenes/GameScene.ts`, not Phaser Arcade physics.
- Hazard lanes start from room-authored `minX` and `maxX`, then clamp to platform-derived safe travel bounds when a room loads.
- Run state, scoring, treasure persistence, lives, and timer flow through `src/game/state/RunState.ts`.

## Docs

- `CONTRIBUTING.md`
- `docs/repository-bootstrap.md`
- `docs/asset-inventory.md`
- `docs/gameplay-architecture.md`
- `docs/room-authoring.md`
- `docs/debugging-checklist.md`
- `docs/art-pipeline.md`

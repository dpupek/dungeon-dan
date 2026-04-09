# AGENTS.md

## Repository identity

- Repository: `E:\Sandbox\dungeon-dan`
- Canonical game name: **Dan's Dungeon**
- Tech stack: Phaser 3 + TypeScript + Vite + Vitest
- Primary branch: `main`

## Back story

- This repository was split out of `E:\Sandbox\danmade-playground` on 2026-04-08.
- The game originally lived under the `pitfall-clone/` folder in that repo.
- The split preserved git history by extracting only the `pitfall-clone` path into this standalone repository.
- During the split, user-facing names were normalized to **Dan's Dungeon**.
- Older history and documents may still mention:
  - `pitfall-clone`
  - `Temple Runaway`
- Treat those older names as historical context, not the current product identity.

## Current naming rules

- Use **Dan's Dungeon** for public-facing game name, browser title, docs, and descriptions.
- Use `dungeon-dan` for package/repo-facing identifiers where a filesystem-safe or package-safe name is needed.
- Do not reintroduce `Temple Runaway` or `pitfall-clone` into current docs, metadata, or UI unless you are explicitly documenting history.

## Repo shape

- `src/` contains the game runtime and gameplay code.
- `src/game/scenes/` contains boot, title, gameplay, and end scenes.
- `src/game/state/RunState.ts` owns run-level rules such as lives, score, timer, and collected treasure state.
- `src/game/data/rooms.ts` is the room-authoring source of truth.
- `docs/` contains gameplay architecture, room authoring, debugging notes, art pipeline notes, and art prompts.
- `scripts/generate_title_art.py` generates title art using the OpenAI Images API.
- `public/` contains static image assets.

## Validation commands

Run these from repo root:

- `npm install`
- `npm run build`
- `npm test`
- `npm run dev`

Expected validation baseline:

- `npm run build` succeeds without TypeScript errors.
- `npm test` passes the `RunState` tests.
- The browser title should be `Dan's Dungeon`.
- A missing `favicon.ico` during local dev is currently known and non-blocking unless the task is specifically about browser polish.

## Working rules for future agents

- Keep patches minimal and scoped.
- Preserve gameplay behavior unless the task explicitly asks for gameplay changes.
- Prefer updating existing docs and systems over introducing parallel structures.
- Treat the GitHub issue as the source of truth for scoped work. If no issue exists for the requested change, recommend creating one before the change is merged.
- When working on a contributor-facing change, align with `CONTRIBUTING.md` and the pull request template.
- Check `git remote -v` before any repo-publishing work. Because this repo was split from another local repo, `origin` may be wrong in a fresh clone or after local migration.
- If `origin` points at a local path or old source repository, rename it to something explicit like `split-source` before adding the GitHub remote as `origin`.
- If you touch naming, keep the repo consistent with **Dan's Dungeon**.
- If you find references to `Temple Runaway` or `pitfall-clone`, first determine whether they are:
  - intentional historical references, or
  - stale identifiers that should be updated
- Do not assume this repo still has any runtime dependency on `danmade-playground`; the split was intended to make this repo standalone.

## Testing guidance

- Follow strict assertions rather than weakening tests to hide behavioral issues.
- Treat odd output, naming drift, or formatting glitches as signals to trace to the source instead of normalizing around them.
- Prefer the AAAA testing pattern when adding or updating tests:
  - Arrange
  - Assert initial state
  - Act
  - Assert final state

## Asset and tooling notes

- The title-art workflow expects `OPENAI_API_KEY` to be set before running `scripts/generate_title_art.py`.
- Generated output should go under ignored output paths, not committed repo-root scratch files.
- Gameplay textures are generated in `src/game/scenes/BootScene.ts`, but the title splash is a committed static image loaded from `public/images/title-box-art-refined.png`.
- Avoid committing local dev artifacts such as logs.

## Split provenance

If a future task involves explaining history or reconciling old references:

- Source repo at split time: `E:\Sandbox\danmade-playground`
- Original game folder: `pitfall-clone`
- Split date: 2026-04-08
- Split intent: isolate the game into its own repository while preserving history and standardizing the identity around Dan's Dungeon

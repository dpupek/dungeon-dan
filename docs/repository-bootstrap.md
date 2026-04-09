# Repository Bootstrap

Use this checklist when publishing, rehoming, or sanity-checking the repository setup for Dan's Dungeon.

## Root file baseline

The repo root should contain these baseline files:

- `README.md`
- `LICENSE`
- `.gitignore`
- `AGENTS.md`

Before publishing, confirm each file reflects the current product identity and repo behavior.

## Remote hygiene

This repository was split from another local repository. Do not assume `origin` is safe.

Check first:

1. Run `git remote -v`.
2. If `origin` points to a local path or old source repository, rename it to something explicit such as `split-source`.
3. Add the real GitHub remote as `origin`.
4. Push `main` with upstream tracking.

Target state:

- `origin` points to the GitHub repository for `dungeon-dan`
- any preserved local source remote uses a non-`origin` name

## Publishing checklist

When creating or validating the public repository:

1. Verify the GitHub repo name is `dungeon-dan`.
2. Verify the default branch is `main`.
3. Verify `origin` points to the GitHub repo, not a local path.
4. Push `main` and confirm upstream tracking.
5. Verify the repository visibility matches the intended state.
6. Verify the README renders the title image correctly on GitHub.
7. Verify the license is present.
8. Verify the browser-facing game name remains `Dan's Dungeon`.

## Documentation drift checks

Before considering the bootstrap complete, compare docs against runtime reality:

- If BootScene loads a committed image, docs must not claim all art is code-generated.
- If the title graphic changes, update both the README and `docs/art-pipeline.md`.
- If controls, build commands, or public-facing names change, update the README in the same change.

## Release hygiene

For small repo-shaping changes, keep the changeset tight:

- metadata and root docs together
- runtime behavior changes separate unless the repo is otherwise broken
- avoid bundling unrelated cleanup into publishing work

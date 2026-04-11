---
name: phaser-ui-overlay-conventions
description: Repo-specific guidance for deciding when an in-canvas Phaser overlay is still acceptable and when a richer DOM-backed menu is the right next step.
---

# Phaser UI Overlay Conventions

Use this skill when working on HUDs, debug panels, pause menus, settings screens, or any other UI overlay in Dan's Dungeon.

## Default decision rule

1) Keep small gameplay overlays in Phaser
- Use Phaser-rendered rectangles, text, and lightweight controllers for:
  - HUD strips
  - short status labels
  - compact debug badges

2) Stop stretching Phaser text blocks into full menus
- If a panel becomes text-dense, scrollable, or needs pinned regions, do not keep layering layout fixes onto a single text object.
- Split the overlay cleanly first if the scope is still small.

3) Promote richer menus to DOM-backed UI
- Use a DOM-backed overlay when the surface needs:
  - reliable text wrapping
  - scrolling
  - stronger alignment control
  - multiple sections with independent behavior
  - button, list, or form-like interaction

## Repo-specific lesson

The developer console started as a small Phaser overlay and quickly hit the usual failure mode:
- overflow
- poor padding
- mixed info and controls in one text flow

That is acceptable as a short-lived Phaser overlay while the feature is still compact. It is not the target architecture for larger menus. Future work on developer tools, settings, or other text-heavy menus should prefer a richer DOM experience before more layout complexity is added.

## Practical implementation rule

- For now, keep gameplay-adjacent overlays in their own runtime controller classes.
- If the change is mostly about text layout rather than gameplay behavior, challenge the Phaser-only approach and consider DOM first.
- Do not solve recurring UI overflow problems by shrinking fonts repeatedly.

## Related repo docs

- `docs/conventions.md`
- `docs/gameplay-architecture.md`
- `docs/debugging-checklist.md`

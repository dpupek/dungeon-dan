# Conventions

This document captures lightweight project rules that are easy to forget during fast iteration.

## UI and overlays

- Keep gameplay-critical overlays readable against every room backdrop.
- Prefer a dedicated controller for each overlay surface instead of mixing HUD, pause, and debug layout directly into `GameScene`.
- Use Phaser-rendered overlays for small, low-interaction surfaces:
  - HUD strips
  - short pause labels
  - compact debug badges
- Treat text-heavy overlays as temporary in-canvas UI, not a long-term layout destination.

## Menu and panel guidance

- If a menu becomes text-dense, scrollable, or starts needing pinned sections, do not keep extending a single Phaser text block.
- The first escalation step is a cleaner Phaser overlay layout:
  - separate panels for information and controls
  - explicit padding and anchoring
  - a dedicated scroll affordance instead of inline status text
- The next escalation step for rich menus is a DOM-backed overlay.

## When to move a menu to DOM

Move a menu or panel to a richer DOM experience when any of these become true:

- the overlay needs reliable text wrapping, alignment, or scrolling
- the overlay needs buttons, lists, tabs, or form-like interaction
- layout work starts dominating the gameplay code change
- contributors keep fixing overflow, padding, or text-fit defects instead of adding game behavior

For Dan's Dungeon, future developer tools, settings menus, and other text-heavy panels should prefer a DOM-backed overlay rather than continued Phaser text-layout work.

The same rule applies to future rich audio/settings menus. Keyboard shortcuts and brief HUD feedback are fine in Phaser, but a multi-control audio/settings surface should move to a richer DOM experience.

## Room readability

- Backgrounds should support gameplay readability, not compete with it.
- Platforms, ladders, hazards, relics, and HUD text must remain visually stronger than room backdrop elements.
- Decorative room theming belongs behind gameplay lanes and should not sit on the safest jump takeoff or landing reads.

## Debug UI

- Debug tooling may ship hidden in builds when it materially improves iteration speed.
- Hidden debug UI still needs production-level readability; debug-only is not a license for fragile layout.
- If a debug surface keeps growing, promote it to a more appropriate UI technology instead of adding more ad hoc text formatting.

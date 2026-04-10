# Actor Runtime Refactor Edge Cases

## Runtime boundaries

- Run state must not store transient animation or sprite state.
- Scene restarts must not leak runtime objects, tweens, or keyboard listeners.
- Room rebuilds must destroy old hazard and relic runtime objects before new ones are created.

## Movement and traversal

- Dan must still step off a ladder at the basement level without jumping.
- Floor preservation across room transitions must keep Dan on basement routes when a valid basement edge platform exists.
- Missing basement platforms should fall back to the authored spawn instead of generating invalid placements.

## Actor behavior

- Dave's charge cycle must keep a readable windup and reset cleanly at lane edges.
- Mark's swoop motion must not drift away from its authored origin lane over time.
- Paul's patrol animation must not imply movement off supported platforms.

## Relics and win flow

- Previously collected relics must stay removed when rooms reload.
- Collecting the final relic must still transition directly to the end scene.
- Idle relic animation must not change collision readability.

## Debug tools

- Developer console input must suppress gameplay input while open.
- Debug room jumps and room restarts must use the same spawn rules as normal gameplay.
- Debug life/time mutations must still flow through run-state ownership.

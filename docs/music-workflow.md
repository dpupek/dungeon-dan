# Music Workflow

Dan's Dungeon uses one looping gameplay music bed in v1.

## Tool recommendation

Preferred AI music workflow for future iterations:

1. **SOUNDRAW**
2. **Udio**
3. **Suno** for ideation only

Why:

- SOUNDRAW is the best fit for controllable, instrumental background music for gameplay loops.
- Udio is a strong fallback when a richer musical idea is needed and extra cleanup is acceptable.
- Suno is useful for quick inspiration, but less ideal as the primary path for controlled game underscore.

## Target for the gameplay loop

- instrumental only
- adventure / temple-hunt tone
- clear pulse that works like a gameplay metronome
- moderate tempo, around `96-108 BPM`
- not bass-heavy
- not overly bright or splashy
- long enough to loop without feeling repetitive immediately

## Runtime rule

- music is separate from the oscillator-based sound effects
- gameplay music volume is persisted in browser storage
- `M` toggles music mute
- `[` lowers music volume
- `]` raises music volume

## Current shipped asset

- `public/audio/adventure-loop.mp3`

This repo currently ships a committed gameplay loop asset for the playable build. Future revisions can replace it with a better externally generated loop without changing the runtime contract.

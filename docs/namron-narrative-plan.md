# Relics of Namron Narrative Plan

This plan records the revised narrative direction for turning the current platformer into a Barony of Namron story.

## Working title

**Lost Relics of Namron**

Subtitle:

**A Barony of Namron Story**

## Core premise

The Barony of Namron was protected by the Sable Storm, a living memory shaped by service, art, martial skill, welcome, humor, and competition. The storm was not held by a single crown. It was preserved across generations by former Nobility, award traditions, champions, and the people who kept showing up to do the work.

When the Sable Storm goes quiet, the current Baronage sends the Seeker into old courts, revel fields, ranges, practice yards, shrines, vaults, and storm-cellars to recover the Relics of Namron. The relics are not treasure in the ordinary sense. They are physical memories of the Barony's values.

The Seeker does not gather the relics to rule Namron. The Seeker gathers them to restore the storm and return the story to the people.

## Tone

The story should be heroic, affectionate, and slightly ridiculous. Namron should feel like a place where solemn service, real skill, courtly honor, spring revelry, spangs, and cows can all belong to the same mythology.

## Required relics

These relics form the main quest.

| Relic | Honors | Narrative meaning |
| --- | --- | --- |
| Pennon of the Rising Storm | Rising Storm | Youth, promise, and the future of the Barony |
| The Many-Colored Torsade | Torsade | Steady service and long labor |
| The Argent Fleur | Argent Fleur | Arts, sciences, craft, and performance |
| Ascia Rossa | Ascia Rossa | Marshalate honor, protection, and discipline |
| The Flying Cow Token | Flying Cow of Namron | Joy, harmless shenanigans, and baronial humor |
| Heart of the Sable Storm | Heart of the Sable Storm | Deep service, counsel, and continuity |
| The Argent-Couped Kriegshelt | Kriegshelt | Lifelong service and highest baronial honor |
| Storm Singer | Protector of Namron | Chivalric champion tradition |
| Besse de Toronado | Baroness's Justice | Rapier champion tradition |
| The Stormshaft Bow | Archery champions | Patience, sight, timing, and clean release |
| The Three Black Axes | Thrown weapons champions | Precision, courage, and controlled force |

## Bonus relic experience

### The Maypole Spang Run

The Spang of Beltane should be a timed bonus round, not a required main quest relic.

Premise: after the Seeker recovers enough of Namron's joy, a Beltane gate opens into a spring field where the maypole has awakened and the spangs are loose.

Gameplay goals:

- Run for 30 to 45 seconds.
- Collect as many leaping spangs as possible before the music ends.
- Use a tall maypole as the room centerpiece.
- Use ribbons as visual lanes, optional climb paths, or semi-platform route language.
- Make spangs leap around as small, fast bonus collectibles.
- Use cows as the enemy type for this round.
- Keep cow behavior disruptive and funny before it becomes punishing.
- Do not kill the player for failing the bonus. Running out of time returns the Seeker to the main route.

Possible rewards:

- Bonus score.
- Extra time.
- Temporary storm favor.
- Cosmetic completion marker for a high-spang run.

## Former Nobility distribution

Former Nobility should appear as stewards, echoes, or memory keepers rather than villains. Their rooms are tests left behind for the Seeker.

The final distribution can be tuned as the room list stabilizes, but the structure should support these roles:

- Founding and early Baronage memories guard the storm and service relics.
- Artisan-forward memories guard the Argent Fleur.
- Martial-forward memories guard Ascia Rossa, Storm Singer, Besse de Toronado, the Stormshaft Bow, and the Three Black Axes.
- Revel or court-humor memories guard the Flying Cow Token and unlock the Maypole Spang Run.
- The current Baronage frames the story and sends the Seeker into the old ways.

Avoid portraying real former Nobility as enemies. The opposition should be storm echoes, animated court tests, cows, hazards, or old memory-guardians.

## Narrative arc

### Act 1: The Storm Goes Quiet

At Beltane, the Sable Storm fails to answer. The current Baronage discovers that Namron's award and champion relics have scattered into the Barony's old memory halls. The Seeker is sent below the revel field into the first chambers.

### Act 2: Service, Art, and Steel

The Seeker recovers relics that teach what Namron values: service, craft, protection, and the discipline of the field. The rooms should make each relic feel earned through layout identity, not only through item labels.

### Act 3: Joy Is Also Law

The Flying Cow Token changes the tone. The game should deliberately become playful here, with misdirection, comic movement, and a sense that laughter is a real part of what keeps the Barony alive.

Recovering the Flying Cow Token can unlock the Maypole Spang Run.

### Act 4: Champions of the Storm

The Seeker proves worthy before champion relics:

- Storm Singer asks whether the Seeker can stand as Protector.
- Besse de Toronado asks whether the Seeker can move with judgment.
- The Stormshaft Bow asks whether the Seeker can wait, aim, and release cleanly.
- The Three Black Axes ask whether the Seeker can commit with precision.

### Act 5: Labor Omnia Vincit

The final chamber combines the lessons of the main relics. The Argent-Couped Kriegshelt is not won by combat alone. It is awarded when the Seeker proves that service, art, martial skill, humor, welcome, and persistence all belong to one story.

When the relics return, the Sable Storm reforms above Namron. The Seeker becomes the Bearer of the Relics, not a ruler.

## Implementation phases

## Implemented first slice

Issue `#18` begins as a narrative-skin pass over the current six-room playable. This slice keeps room ids, geometry, hazards, scoring, timer, and relic collection behavior unchanged while updating the public title, title/end copy, room titles, and relic labels.

| Existing room id | First-slice room title | First-slice relic |
| --- | --- | --- |
| canopy-gate | Storm Gate | Pennon of the Rising Storm |
| ember-bridge | Torsade Hall | The Many-Colored Torsade |
| monkey-step | Argent Fleur Gallery | The Argent Fleur |
| sunken-vault | Red Axe Vault | Ascia Rossa |
| fossil-stair | Flying Cow Field | The Flying Cow Token |
| idol-hall | Sable Heart Hall | Heart of the Sable Storm |

### Phase 1: Narrative foundation

- Choose the production title and subtitle.
- Replace generic treasure language with relic language where appropriate.
- Decide whether the player remains Dan or becomes a named Seeker of Namron.
- Add a contributor-facing narrative reference doc.
- Create a GitHub issue for the narrative transition.

### Phase 2: Relic data model and labels

- Replace the current generic relic labels with Namron relic names.
- Keep runtime collection behavior unchanged.
- Decide whether relics need distinct archetypes or can initially share the existing golden-clam presentation.
- Add room-data comments or docs describing which relic belongs to which award or champion tradition.

### Phase 3: Room mapping

- Map the current six rooms to the first six Namron relics.
- Use future room issues to add champion and award-specific spaces.
- Preserve basement recovery conventions while reshaping room identities.
- Prefer room identity through layout, color, hazard rhythm, and labels before adding new systems.

### Phase 4: Narrative UI pass

- Update title, intro copy, end copy, HUD terms, and relic completion language.
- Keep text short enough for the current Phaser overlay.
- If lore grows into text-heavy panels, move it to a DOM-backed overlay instead of expanding canvas text.

### Phase 5: The Maypole Spang Run

- Add a bonus-room flow separate from required relic completion.
- Add timed spang collection.
- Add maypole/ribbon visual language.
- Add cows as the bonus-round enemy.
- Return the player to the main route when the timer ends.

Implemented in the current slice:

- `fossil-stair` now unlocks a one-shot Beltane gate after `The Flying Cow Token` is recovered.
- The gate enters `maypole-spang-run`, a 35-second bonus field with 12 score-only spangs and flying cow hazards.
- Cow hits or time expiry end the bonus round and return the Seeker to the authored gate return point without costing a life.

### Phase 6: Champion rooms

- Add or revise rooms for Protector, Baroness's Justice, archery champions, and thrown weapons champions.
- Give the Stormshaft Bow and Three Black Axes dedicated room identities.
- Add distinct encounter rhythms that represent patience, aim, timing, and controlled commitment.

### Phase 7: Polish and validation

- Run build and tests after each gameplay slice.
- Manually verify room readability after every background or relic presentation change.
- Confirm all relics remain collectable and the final win condition still works.
- Document any new authoring rules introduced by bonus rounds, cows, or champion relics.

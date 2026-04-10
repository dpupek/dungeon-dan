import { ACTOR_ANIMATION_MANIFESTS, RELIC_ANIMATION_MANIFESTS } from "../assets/manifest";
import { GAME_CONFIG } from "../config";
import type { ActorArchetypeId, AnimationSetId, RelicArchetypeId } from "../types";

export type HazardBehaviorId = "patrol" | "charge" | "swoop";

export interface ActorArchetype {
  id: ActorArchetypeId;
  label: string;
  animationSetId: AnimationSetId;
  behavior: HazardBehaviorId;
  defaultSpeed: number;
}

export interface RelicArchetype {
  id: RelicArchetypeId;
  label: string;
  animationSetId: AnimationSetId;
  baseScale: number;
}

export const ACTOR_ARCHETYPES: Record<ActorArchetypeId, ActorArchetype> = {
  "paul-crab": {
    id: "paul-crab",
    label: "Paul Crab",
    animationSetId: ACTOR_ANIMATION_MANIFESTS["paul-crab"].id,
    behavior: "patrol",
    defaultSpeed: 120,
  },
  "dave-goat": {
    id: "dave-goat",
    label: "Dave Goat",
    animationSetId: ACTOR_ANIMATION_MANIFESTS["dave-goat"].id,
    behavior: "charge",
    defaultSpeed: 90,
  },
  "mark-wasp": {
    id: "mark-wasp",
    label: "Mark Wasp",
    animationSetId: ACTOR_ANIMATION_MANIFESTS["mark-wasp"].id,
    behavior: "swoop",
    defaultSpeed: GAME_CONFIG.physics.hazardSpeed,
  },
};

export const RELIC_ARCHETYPES: Record<RelicArchetypeId, RelicArchetype> = {
  "golden-clam": {
    id: "golden-clam",
    label: "Golden Clam",
    animationSetId: RELIC_ANIMATION_MANIFESTS["golden-clam"].id,
    baseScale: 2.5,
  },
};

import type { ActorArchetypeId, AnimationSetId, RelicArchetypeId } from "../types";

export interface SpriteAnimationClipManifest {
  animationKey: string;
  startFrame: number;
  endFrame: number;
  frameRate: number;
  repeat: number;
}

export interface PlayerAnimationManifest {
  id: AnimationSetId;
  textureKey: string;
  frameWidth: number;
  frameHeight: number;
  idle: SpriteAnimationClipManifest;
  walk: SpriteAnimationClipManifest;
  jump: SpriteAnimationClipManifest;
  fall: SpriteAnimationClipManifest;
  climb: SpriteAnimationClipManifest;
  hurt: SpriteAnimationClipManifest;
}

export interface ActorAnimationManifest {
  id: AnimationSetId;
  idle: string[];
  patrol?: string[];
  "charge-windup"?: string[];
  charge?: string[];
  swoop?: string[];
}

export interface RelicAnimationManifest {
  id: AnimationSetId;
  idle: string[];
  collected: string[];
}

export const PLAYER_ANIMATION_MANIFEST: PlayerAnimationManifest = {
  id: "dan",
  textureKey: "dan-spritesheet",
  frameWidth: 16,
  frameHeight: 16,
  idle: { animationKey: "dan-idle", startFrame: 0, endFrame: 0, frameRate: 1, repeat: 0 },
  walk: { animationKey: "dan-walk", startFrame: 1, endFrame: 6, frameRate: 11, repeat: -1 },
  jump: { animationKey: "dan-jump", startFrame: 7, endFrame: 7, frameRate: 1, repeat: 0 },
  fall: { animationKey: "dan-fall", startFrame: 8, endFrame: 8, frameRate: 1, repeat: 0 },
  climb: { animationKey: "dan-climb", startFrame: 9, endFrame: 10, frameRate: 7, repeat: -1 },
  hurt: { animationKey: "dan-hurt", startFrame: 11, endFrame: 11, frameRate: 1, repeat: 0 },
};

export const ACTOR_ANIMATION_MANIFESTS: Record<ActorArchetypeId, ActorAnimationManifest> = {
  "paul-crab": {
    id: "paul-crab",
    idle: ["paul-crab-a", "paul-crab-b"],
    patrol: ["paul-crab-a", "paul-crab-b"],
  },
  "dave-goat": {
    id: "dave-goat",
    idle: ["dave-goat-a", "dave-goat-b"],
    patrol: ["dave-goat-a", "dave-goat-b"],
    "charge-windup": ["dave-goat-b"],
    charge: ["dave-goat-scream"],
  },
  "mark-wasp": {
    id: "mark-wasp",
    idle: ["mark-wasp-a", "mark-wasp-b"],
    swoop: ["mark-wasp-a", "mark-wasp-b"],
  },
};

export const RELIC_ANIMATION_MANIFESTS: Record<RelicArchetypeId, RelicAnimationManifest> = {
  "golden-clam": {
    id: "golden-clam",
    idle: ["golden-clam-open", "golden-clam-closed"],
    collected: [],
  },
};

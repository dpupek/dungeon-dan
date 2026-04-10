export type RoomId = "canopy-gate" | "ember-bridge" | "monkey-step" | "sunken-vault" | "idol-hall";
export type FloorLevel = "ground" | "basement";
export type AnimationSetId = "dan" | "paul-crab" | "dave-goat" | "mark-wasp" | "golden-clam";
export type ActorArchetypeId = "paul-crab" | "dave-goat" | "mark-wasp";
export type RelicArchetypeId = "golden-clam";

export interface PlatformDefinition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LadderDefinition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RelicInstanceDefinition {
  id: string;
  archetypeId: RelicArchetypeId;
  x: number;
  y: number;
  label: string;
}

export interface ActorInstanceDefinition {
  id: string;
  archetypeId: ActorArchetypeId;
  x: number;
  y: number;
  width: number;
  height: number;
  minX: number;
  maxX: number;
  speed?: number;
  swoopDepth?: number;
  swoopRate?: number;
  chargePauseMs?: number;
}

export type HazardDefinition = ActorInstanceDefinition;
export type TreasureDefinition = RelicInstanceDefinition;

export interface RoomDefinition {
  id: RoomId;
  title: string;
  platforms: PlatformDefinition[];
  ladders: LadderDefinition[];
  actors: ActorInstanceDefinition[];
  relics: RelicInstanceDefinition[];
  exits: {
    left?: RoomId;
    right?: RoomId;
  };
  spawn: {
    default: { x: number; y: number };
    fromLeft?: { x: number; y: number };
    fromRight?: { x: number; y: number };
  };
}

export interface RunState {
  currentRoomId: RoomId;
  lives: number;
  score: number;
  timeRemainingMs: number;
  collectedRelicIds: string[];
  status: "title" | "playing" | "won" | "lost";
}

export interface ScenePayload {
  runState?: RunState;
}

export interface EndScenePayload {
  outcome: "won" | "lost";
  runState: RunState;
}

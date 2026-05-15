export type RoomId =
  | "canopy-gate"
  | "ember-bridge"
  | "monkey-step"
  | "sunken-vault"
  | "fossil-stair"
  | "idol-hall"
  | "maypole-spang-run";
export type FloorLevel = "ground" | "basement";
export type AnimationSetId =
  | "dan"
  | "paul-crab"
  | "dave-goat"
  | "mark-wasp"
  | "flying-cow"
  | "golden-clam"
  | "spang";
export type ActorArchetypeId = "paul-crab" | "dave-goat" | "mark-wasp" | "flying-cow";
export type RelicArchetypeId = "golden-clam" | "spang";

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

export type BackdropSilhouetteId = "canopy" | "bridge" | "ruins" | "idol" | "field";

export interface RoomBackdropDefinition {
  farColor: string;
  midColor: string;
  accentColor: string;
  fogColor: string;
  silhouette: BackdropSilhouetteId;
}

export interface RelicInstanceDefinition {
  id: string;
  archetypeId: RelicArchetypeId;
  x: number;
  y: number;
  label: string;
}

export interface BonusPickupDefinition {
  id: string;
  archetypeId: "spang";
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

export interface DoorwayDefinition {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  destinationRoomId: RoomId;
  returnPosition: { x: number; y: number };
  unlockRelicId?: string;
  oneShot?: boolean;
  prompt: string;
}

export interface RoomDefinition {
  id: RoomId;
  title: string;
  backdrop: RoomBackdropDefinition;
  platforms: PlatformDefinition[];
  ladders: LadderDefinition[];
  actors: ActorInstanceDefinition[];
  relics: RelicInstanceDefinition[];
  bonusPickups: BonusPickupDefinition[];
  doorways: DoorwayDefinition[];
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
  bonusRound: {
    status: "locked" | "available" | "active" | "completed";
    timeRemainingMs: number;
    scoreCollected: number;
    spangsCollected: number;
    returnContext: {
      roomId: RoomId;
      x: number;
      y: number;
    } | null;
  };
  status: "title" | "playing" | "won" | "lost";
}

export interface MusicSettings {
  musicVolume: number;
  musicMuted: boolean;
}

export interface ScenePayload {
  runState?: RunState;
}

export interface EndScenePayload {
  outcome: "won" | "lost";
  runState: RunState;
}

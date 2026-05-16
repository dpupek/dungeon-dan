export type RoomId =
  | "canopy-gate"
  | "ember-bridge"
  | "monkey-step"
  | "sunken-vault"
  | "fossil-stair"
  | "idol-hall"
  | "maypole-spang-run"
  | "stormshaft-range"
  | "black-axes-yard";
export type FloorLevel = "ground" | "basement";
export type AnimationSetId =
  | "dan"
  | "paul-crab"
  | "dave-goat"
  | "mark-wasp"
  | "flying-cow"
  | "golden-clam"
  | "stormshaft-bow"
  | "three-black-axes"
  | "spang";
export type ActorArchetypeId = "paul-crab" | "dave-goat" | "mark-wasp" | "flying-cow";
export type RelicArchetypeId = "golden-clam" | "stormshaft-bow" | "three-black-axes" | "spang";

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

export interface StoryLineBeatDefinition {
  type: "line";
  speakerId: string;
  speakerName: string;
  text: string;
  portraitKey?: string;
}

export interface StoryPauseBeatDefinition {
  type: "pause";
  durationMs: number;
}

export interface StoryCameraFocusBeatDefinition {
  type: "camera-focus";
  x: number;
  y: number;
  durationMs?: number;
}

export interface StoryGrantRelicBeatDefinition {
  type: "grant-relic";
  relicId: string;
}

export interface StoryEndBeatDefinition {
  type: "end";
}

export type StoryBeatDefinition =
  | StoryLineBeatDefinition
  | StoryPauseBeatDefinition
  | StoryCameraFocusBeatDefinition
  | StoryGrantRelicBeatDefinition
  | StoryEndBeatDefinition;

export interface StorySequenceDefinition {
  id: string;
  skippable?: boolean;
  beats: StoryBeatDefinition[];
}

export interface StoryTriggerDefinition {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  sequenceId: string;
  autoStart?: boolean;
  once?: boolean;
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
  storyTriggers?: StoryTriggerDefinition[];
  storyHooks?: {
    onRelicEncounter?: Record<string, string>;
  };
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
  completedStoryTriggerIds: string[];
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

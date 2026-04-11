import { GAME_CONFIG } from "../config";
import { GAME_MOVEMENT_METRICS } from "../movementMetrics";
import type { RoomDefinition, RoomId } from "../types";

const floorY = GAME_CONFIG.world.floorY;
const groundPlatformHeight = 28;
const upperPlatformHeight = 24;
const basementPlatformHeight = 20;
const lowerRouteY =
  floorY +
  GAME_MOVEMENT_METRICS.minimumBasementSeparationPx -
  groundPlatformHeight / 2 +
  basementPlatformHeight / 2;
const lowerRouteWidth = GAME_CONFIG.world.width;
const lowerRouteX = GAME_CONFIG.world.width / 2;

export const ROOM_ORDER: RoomId[] = [
  "canopy-gate",
  "ember-bridge",
  "monkey-step",
  "sunken-vault",
  "fossil-stair",
  "idol-hall",
];

export const ROOM_DEFINITIONS: Record<RoomId, RoomDefinition> = {
  "canopy-gate": {
    id: "canopy-gate",
    title: "Canopy Gate",
    backdrop: {
      farColor: "#12314d",
      midColor: "#2b5d4f",
      accentColor: "#3f7a62",
      fogColor: "#86c5a3",
      silhouette: "canopy",
    },
    platforms: [
      { x: 110, y: floorY, width: 220, height: groundPlatformHeight },
      { x: 640, y: floorY, width: 640, height: groundPlatformHeight },
      { x: 760, y: 340, width: 190, height: upperPlatformHeight },
      { x: lowerRouteX, y: lowerRouteY, width: lowerRouteWidth, height: basementPlatformHeight },
    ],
    ladders: [{ x: 740, y: 404, width: 28, height: 128 }],
    actors: [
      {
        id: "paul-gate",
        archetypeId: "paul-crab",
        x: 590,
        y: floorY - 14,
        width: 40,
        height: 24,
        minX: 470,
        maxX: 690,
        speed: 120,
      },
    ],
    relics: [{ id: "jade-mask", archetypeId: "golden-clam", x: 810, y: 298, label: "Jade Mask" }],
    exits: { right: "ember-bridge" },
    spawn: {
      default: { x: 120, y: floorY - 42 },
      fromLeft: { x: 120, y: floorY - 42 },
      fromRight: { x: 700, y: floorY - 42 },
    },
  },
  "ember-bridge": {
    id: "ember-bridge",
    title: "Ember Bridge",
    backdrop: {
      farColor: "#1a223f",
      midColor: "#5a3b2c",
      accentColor: "#8a5a36",
      fogColor: "#d49c63",
      silhouette: "bridge",
    },
    platforms: [
      { x: 120, y: floorY, width: 240, height: groundPlatformHeight },
      { x: 450, y: floorY, width: 220, height: groundPlatformHeight },
      { x: 830, y: floorY, width: 260, height: groundPlatformHeight },
      { x: 470, y: 320, width: 160, height: upperPlatformHeight },
      { x: lowerRouteX, y: lowerRouteY, width: lowerRouteWidth, height: basementPlatformHeight },
    ],
    ladders: [{ x: 470, y: 394, width: 28, height: 148 }],
    actors: [
      {
        id: "dave-ember",
        archetypeId: "dave-goat",
        x: 830,
        y: floorY - 16,
        width: 42,
        height: 26,
        minX: 760,
        maxX: 900,
        speed: 92,
        chargePauseMs: 900,
      },
      {
        id: "paul-bridge",
        archetypeId: "paul-crab",
        x: 510,
        y: 304,
        width: 40,
        height: 24,
        minX: 410,
        maxX: 530,
        speed: 115,
      },
    ],
    relics: [{ id: "sun-disc", archetypeId: "golden-clam", x: 560, y: 278, label: "Sun Disc" }],
    exits: { left: "canopy-gate", right: "monkey-step" },
    spawn: {
      default: { x: 140, y: floorY - 42 },
      fromLeft: { x: 140, y: floorY - 42 },
      fromRight: { x: 840, y: floorY - 42 },
    },
  },
  "monkey-step": {
    id: "monkey-step",
    title: "Monkey Step",
    backdrop: {
      farColor: "#10263e",
      midColor: "#3b5f51",
      accentColor: "#587b63",
      fogColor: "#9bc19c",
      silhouette: "canopy",
    },
    platforms: [
      { x: 110, y: floorY, width: 220, height: groundPlatformHeight },
      { x: 642, y: floorY, width: 636, height: groundPlatformHeight },
      { x: 270, y: 340, width: 180, height: upperPlatformHeight },
      { x: 690, y: 280, width: 170, height: upperPlatformHeight },
      { x: lowerRouteX, y: lowerRouteY, width: lowerRouteWidth, height: basementPlatformHeight },
    ],
    ladders: [
      { x: 270, y: 404, width: 28, height: 120 },
      { x: 690, y: 322, width: 28, height: 122 },
    ],
    actors: [
      {
        id: "dave-monkey",
        archetypeId: "dave-goat",
        x: 720,
        y: floorY - 14,
        width: 42,
        height: 26,
        minX: 610,
        maxX: 860,
        speed: 90,
        chargePauseMs: 1100,
      },
      {
        id: "mark-upper",
        archetypeId: "mark-wasp",
        x: 290,
        y: 344,
        width: 38,
        height: 24,
        minX: 210,
        maxX: 350,
        speed: 88,
        swoopDepth: 24,
        swoopRate: 2.8,
      },
    ],
    relics: [{ id: "amber-idol", archetypeId: "golden-clam", x: 760, y: 238, label: "Amber Idol" }],
    exits: { left: "ember-bridge", right: "sunken-vault" },
    spawn: {
      default: { x: 120, y: floorY - 42 },
      fromLeft: { x: 120, y: floorY - 42 },
      fromRight: { x: 600, y: floorY - 42 },
    },
  },
  "sunken-vault": {
    id: "sunken-vault",
    title: "Sunken Vault",
    backdrop: {
      farColor: "#162034",
      midColor: "#3c4958",
      accentColor: "#6d7d8a",
      fogColor: "#94a4b0",
      silhouette: "ruins",
    },
    platforms: [
      { x: 110, y: floorY, width: 220, height: groundPlatformHeight },
      { x: 450, y: floorY, width: 252, height: groundPlatformHeight },
      { x: 820, y: floorY, width: 280, height: groundPlatformHeight },
      { x: 310, y: 330, width: 160, height: upperPlatformHeight },
      { x: 640, y: 250, width: 180, height: upperPlatformHeight },
      { x: lowerRouteX, y: lowerRouteY, width: lowerRouteWidth, height: basementPlatformHeight },
    ],
    ladders: [
      { x: 310, y: 424, width: 28, height: 206 },
      { x: 640, y: 292, width: 28, height: 124 },
    ],
    actors: [
      {
        id: "mark-vault",
        archetypeId: "mark-wasp",
        x: 440,
        y: floorY - 16,
        width: 38,
        height: 24,
        minX: 360,
        maxX: 520,
        speed: 92,
        swoopDepth: 22,
        swoopRate: 2.4,
      },
      {
        id: "paul-vault",
        archetypeId: "paul-crab",
        x: 720,
        y: 234,
        width: 40,
        height: 24,
        minX: 580,
        maxX: 760,
        speed: 120,
      },
    ],
    relics: [{ id: "moon-gem", archetypeId: "golden-clam", x: 720, y: 208, label: "Moon Gem" }],
    exits: { left: "monkey-step", right: "fossil-stair" },
    spawn: {
      default: { x: 120, y: floorY - 42 },
      fromLeft: { x: 120, y: floorY - 42 },
      fromRight: { x: 820, y: floorY - 42 },
    },
  },
  "fossil-stair": {
    id: "fossil-stair",
    title: "Fossil Stair",
    backdrop: {
      farColor: "#181f31",
      midColor: "#475262",
      accentColor: "#748391",
      fogColor: "#b7c1c7",
      silhouette: "ruins",
    },
    platforms: [
      { x: 150, y: floorY, width: 280, height: groundPlatformHeight },
      { x: 470, y: floorY, width: 170, height: groundPlatformHeight },
      { x: 815, y: floorY, width: 250, height: groundPlatformHeight },
      { x: 330, y: 334, width: 150, height: upperPlatformHeight },
      { x: 600, y: 314, width: 150, height: upperPlatformHeight },
      { x: 490, y: 252, width: 160, height: upperPlatformHeight },
      { x: 780, y: 196, width: 140, height: upperPlatformHeight },
      { x: lowerRouteX, y: lowerRouteY, width: lowerRouteWidth, height: basementPlatformHeight },
    ],
    ladders: [
      { x: 330, y: 366, width: 28, height: 116 },
      { x: 600, y: 278, width: 28, height: 112 },
      { x: 780, y: 300, width: 28, height: 228 },
    ],
    actors: [
      {
        id: "mark-fossil",
        archetypeId: "mark-wasp",
        x: 700,
        y: 238,
        width: 38,
        height: 24,
        minX: 640,
        maxX: 840,
        speed: 84,
        swoopDepth: 22,
        swoopRate: 2.6,
      },
    ],
    relics: [{ id: "fossil-shell", archetypeId: "golden-clam", x: 800, y: 154, label: "Fossil Shell" }],
    exits: { left: "sunken-vault", right: "idol-hall" },
    spawn: {
      default: { x: 140, y: floorY - 42 },
      fromLeft: { x: 140, y: floorY - 42 },
      fromRight: { x: 800, y: floorY - 42 },
    },
  },
  "idol-hall": {
    id: "idol-hall",
    title: "Idol Hall",
    backdrop: {
      farColor: "#211a33",
      midColor: "#624267",
      accentColor: "#8d6a93",
      fogColor: "#bba2c4",
      silhouette: "idol",
    },
    platforms: [
      { x: 110, y: floorY, width: 220, height: groundPlatformHeight },
      { x: 640, y: floorY, width: 640, height: groundPlatformHeight },
      { x: 510, y: 330, width: 180, height: upperPlatformHeight },
      { x: 820, y: 250, width: 160, height: upperPlatformHeight },
      { x: lowerRouteX, y: lowerRouteY, width: lowerRouteWidth, height: basementPlatformHeight },
    ],
    ladders: [
      { x: 510, y: 394, width: 28, height: 146 },
      { x: 820, y: 292, width: 28, height: 124 },
    ],
    actors: [
      {
        id: "dave-idol",
        archetypeId: "dave-goat",
        x: 700,
        y: floorY - 14,
        width: 42,
        height: 26,
        minX: 600,
        maxX: 860,
        speed: 96,
        chargePauseMs: 850,
      },
      {
        id: "mark-idol",
        archetypeId: "mark-wasp",
        x: 540,
        y: 314,
        width: 38,
        height: 24,
        minX: 430,
        maxX: 590,
        speed: 90,
        swoopDepth: 26,
        swoopRate: 3.2,
      },
    ],
    relics: [{ id: "sky-crown", archetypeId: "golden-clam", x: 860, y: 208, label: "Sky Crown" }],
    exits: { left: "fossil-stair" },
    spawn: {
      default: { x: 120, y: floorY - 42 },
      fromLeft: { x: 120, y: floorY - 42 },
      fromRight: { x: 700, y: floorY - 42 },
    },
  },
};

export function getRoomDefinition(roomId: RoomId): RoomDefinition {
  return ROOM_DEFINITIONS[roomId];
}

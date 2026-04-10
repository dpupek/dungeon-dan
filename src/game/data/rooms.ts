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
  "idol-hall",
];

export const ROOM_DEFINITIONS: Record<RoomId, RoomDefinition> = {
  "canopy-gate": {
    id: "canopy-gate",
    title: "Canopy Gate",
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
        x: 640,
        y: floorY - 14,
        width: 40,
        height: 24,
        minX: 560,
        maxX: 860,
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
        x: 470,
        y: floorY - 16,
        width: 42,
        height: 26,
        minX: 390,
        maxX: 610,
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
        x: 580,
        y: floorY - 14,
        width: 42,
        height: 26,
        minX: 510,
        maxX: 760,
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
        x: 500,
        y: floorY - 16,
        width: 38,
        height: 24,
        minX: 430,
        maxX: 560,
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
    exits: { left: "monkey-step", right: "idol-hall" },
    spawn: {
      default: { x: 120, y: floorY - 42 },
      fromLeft: { x: 120, y: floorY - 42 },
      fromRight: { x: 820, y: floorY - 42 },
    },
  },
  "idol-hall": {
    id: "idol-hall",
    title: "Idol Hall",
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
        x: 620,
        y: floorY - 14,
        width: 42,
        height: 26,
        minX: 540,
        maxX: 850,
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
    exits: { left: "sunken-vault" },
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

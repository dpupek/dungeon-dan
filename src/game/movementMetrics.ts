import { GAME_CONFIG } from "./config";

const jumpVelocity = Math.abs(GAME_CONFIG.physics.jumpVelocity);
const gravity = GAME_CONFIG.physics.gravityY;
const fullJumpDurationSeconds = (2 * jumpVelocity) / gravity;
const maxJumpHeightPx = (jumpVelocity * jumpVelocity) / (2 * gravity);

export const GAME_MOVEMENT_METRICS = {
  maxJumpHeightPx,
  fullJumpDurationSeconds,
  maxFlatJumpDistancePx: GAME_CONFIG.physics.runSpeed * fullJumpDurationSeconds,
  comfortableGapPx: 104,
  hardGapPx: 136,
  minimumBasementSeparationPx: 112,
} as const;


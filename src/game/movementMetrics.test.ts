import { describe, expect, it } from "vitest";
import { GAME_MOVEMENT_METRICS } from "./movementMetrics";

describe("GAME_MOVEMENT_METRICS", () => {
  it("derives the current jump envelope from physics", () => {
    expect(GAME_MOVEMENT_METRICS.maxJumpHeightPx).toBeCloseTo(96.18, 1);
    expect(GAME_MOVEMENT_METRICS.fullJumpDurationSeconds).toBeCloseTo(0.84, 2);
    expect(GAME_MOVEMENT_METRICS.maxFlatJumpDistancePx).toBeCloseTo(175.64, 1);
  });

  it("keeps authored spacing targets inside the current jump envelope", () => {
    expect(GAME_MOVEMENT_METRICS.comfortableGapPx).toBeLessThan(GAME_MOVEMENT_METRICS.maxFlatJumpDistancePx);
    expect(GAME_MOVEMENT_METRICS.hardGapPx).toBeLessThan(GAME_MOVEMENT_METRICS.maxFlatJumpDistancePx);
    expect(GAME_MOVEMENT_METRICS.minimumBasementSeparationPx).toBeGreaterThan(GAME_MOVEMENT_METRICS.maxJumpHeightPx);
  });
});


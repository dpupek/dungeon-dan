import { describe, expect, it } from "vitest";
import { stepHazardRuntime } from "./hazardBehavior";

describe("stepHazardRuntime", () => {
  it("patrol hazards reverse at safe bounds", () => {
    const result = stepHazardRuntime(
      {
        behavior: "patrol",
        x: 98,
        y: 200,
        direction: 1,
        modeTimerMs: 0,
        originY: 200,
        safeMinX: 20,
        safeMaxX: 100,
        baseSpeed: 40,
      },
      0.1,
    );

    expect(result.x).toBe(100);
    expect(result.direction).toBe(-1);
    expect(result.presentationState).toBe("patrol");
  });

  it("charge hazards wait, then charge, then reset", () => {
    const windup = stepHazardRuntime(
      {
        behavior: "charge",
        x: 50,
        y: 200,
        direction: 1,
        modeTimerMs: 0,
        originY: 200,
        safeMinX: 20,
        safeMaxX: 100,
        baseSpeed: 40,
        pauseMs: 1000,
      },
      0.5,
    );
    expect(windup.presentationState).toBe("charge-windup");

    const charge = stepHazardRuntime(
      {
        behavior: "charge",
        x: 50,
        y: 200,
        direction: 1,
        modeTimerMs: 1000,
        originY: 200,
        safeMinX: 20,
        safeMaxX: 100,
        baseSpeed: 40,
        pauseMs: 1000,
      },
      0.25,
    );
    expect(charge.presentationState).toBe("charge");
    expect(charge.isCharging).toBe(true);
  });

  it("swoop hazards oscillate vertically", () => {
    const result = stepHazardRuntime(
      {
        behavior: "swoop",
        x: 40,
        y: 200,
        direction: 1,
        modeTimerMs: 0,
        originY: 200,
        safeMinX: 20,
        safeMaxX: 100,
        baseSpeed: 40,
        swoopDepth: 20,
        swoopRate: 2,
      },
      0.25,
    );

    expect(result.y).not.toBe(200);
    expect(result.presentationState).toBe("swoop");
  });
});

import { describe, expect, it } from "vitest";
import { resolvePlayerAnimationState } from "./playerAnimation";

describe("resolvePlayerAnimationState", () => {
  it("uses hurt over all other states", () => {
    expect(
      resolvePlayerAnimationState({
        isClimbing: true,
        isGrounded: true,
        vx: 200,
        vy: -20,
        isHurt: true,
      }),
    ).toBe("hurt");
  });

  it("returns walk while grounded and moving", () => {
    expect(
      resolvePlayerAnimationState({
        isClimbing: false,
        isGrounded: true,
        vx: 210,
        vy: 0,
        isHurt: false,
      }),
    ).toBe("walk");
  });

  it("returns climb when climbing", () => {
    expect(
      resolvePlayerAnimationState({
        isClimbing: true,
        isGrounded: false,
        vx: 0,
        vy: 0,
        isHurt: false,
      }),
    ).toBe("climb");
  });

  it("distinguishes jump from fall while airborne", () => {
    expect(
      resolvePlayerAnimationState({
        isClimbing: false,
        isGrounded: false,
        vx: 0,
        vy: -120,
        isHurt: false,
      }),
    ).toBe("jump");
    expect(
      resolvePlayerAnimationState({
        isClimbing: false,
        isGrounded: false,
        vx: 0,
        vy: 120,
        isHurt: false,
      }),
    ).toBe("fall");
  });
});

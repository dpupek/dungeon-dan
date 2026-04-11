import { describe, expect, it } from "vitest";
import { canUseGroundJump, consumeBufferedJump, tickJumpWindowState } from "./jumpWindowState";

describe("jumpWindowState", () => {
  it("refreshes coyote time while grounded and decrements it in the air", () => {
    const grounded = tickJumpWindowState(
      { coyoteTimerMs: 0, jumpBufferTimerMs: 0 },
      { dtMs: 16, jumpPressed: false, isGrounded: true },
    );

    expect(grounded.coyoteTimerMs).toBe(90);
    expect(canUseGroundJump(grounded, false)).toBe(true);

    const airborne = tickJumpWindowState(grounded, {
      dtMs: 30,
      jumpPressed: false,
      isGrounded: false,
    });

    expect(airborne.coyoteTimerMs).toBe(60);
    expect(canUseGroundJump(airborne, false)).toBe(true);
  });

  it("buffers jump presses and clears them once consumed", () => {
    const buffered = tickJumpWindowState(
      { coyoteTimerMs: 0, jumpBufferTimerMs: 0 },
      { dtMs: 16, jumpPressed: true, isGrounded: false },
    );

    expect(buffered.jumpBufferTimerMs).toBe(120);

    const consumed = consumeBufferedJump(buffered);
    expect(consumed.jumpBufferTimerMs).toBe(0);
    expect(consumed.coyoteTimerMs).toBe(0);
  });
});


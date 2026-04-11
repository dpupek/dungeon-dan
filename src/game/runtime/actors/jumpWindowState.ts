import { GAME_CONFIG } from "../../config";

export interface JumpWindowState {
  coyoteTimerMs: number;
  jumpBufferTimerMs: number;
}

export function createJumpWindowState(): JumpWindowState {
  return {
    coyoteTimerMs: 0,
    jumpBufferTimerMs: 0,
  };
}

export function tickJumpWindowState(
  state: JumpWindowState,
  input: { dtMs: number; jumpPressed: boolean; isGrounded: boolean },
): JumpWindowState {
  const jumpBufferTimerMs = input.jumpPressed
    ? GAME_CONFIG.player.jumpBufferMs
    : Math.max(0, state.jumpBufferTimerMs - input.dtMs);
  const coyoteTimerMs = input.isGrounded
    ? GAME_CONFIG.player.coyoteTimeMs
    : Math.max(0, state.coyoteTimerMs - input.dtMs);

  return {
    coyoteTimerMs,
    jumpBufferTimerMs,
  };
}

export function canUseGroundJump(state: JumpWindowState, isGrounded: boolean): boolean {
  return isGrounded || state.coyoteTimerMs > 0;
}

export function consumeBufferedJump(state: JumpWindowState): JumpWindowState {
  return {
    ...state,
    jumpBufferTimerMs: 0,
    coyoteTimerMs: 0,
  };
}


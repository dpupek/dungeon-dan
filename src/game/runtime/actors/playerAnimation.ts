export type PlayerAnimationState = "idle" | "walk" | "jump" | "fall" | "climb" | "hurt";

export interface PlayerAnimationContext {
  isClimbing: boolean;
  isGrounded: boolean;
  vx: number;
  vy: number;
  isHurt: boolean;
}

export function resolvePlayerAnimationState(context: PlayerAnimationContext): PlayerAnimationState {
  if (context.isHurt) {
    return "hurt";
  }

  if (context.isClimbing) {
    return "climb";
  }

  if (!context.isGrounded) {
    return context.vy < 0 ? "jump" : "fall";
  }

  if (Math.abs(context.vx) > 0) {
    return "walk";
  }

  return "idle";
}

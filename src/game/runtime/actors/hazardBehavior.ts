import type { HazardBehaviorId } from "../../content/archetypes";

export type HazardPresentationState = "patrol" | "charge-windup" | "charge" | "swoop";

export interface HazardStepInput {
  behavior: HazardBehaviorId;
  x: number;
  y: number;
  direction: 1 | -1;
  modeTimerMs: number;
  originY: number;
  safeMinX: number;
  safeMaxX: number;
  baseSpeed: number;
  pauseMs?: number;
  swoopDepth?: number;
  swoopRate?: number;
}

export interface HazardStepResult {
  x: number;
  y: number;
  direction: 1 | -1;
  modeTimerMs: number;
  isCharging: boolean;
  presentationState: HazardPresentationState;
}

export function stepHazardRuntime(input: HazardStepInput, dtSeconds: number): HazardStepResult {
  if (input.behavior === "charge") {
    return stepChargeHazard(input, dtSeconds);
  }

  if (input.behavior === "swoop") {
    return stepSwoopHazard(input, dtSeconds);
  }

  return stepPatrolHazard(input, dtSeconds);
}

function stepPatrolHazard(input: HazardStepInput, dtSeconds: number): HazardStepResult {
  let direction = input.direction;
  let x = input.x + input.baseSpeed * direction * dtSeconds;

  if (x >= input.safeMaxX) {
    x = input.safeMaxX;
    direction = -1;
  } else if (x <= input.safeMinX) {
    x = input.safeMinX;
    direction = 1;
  }

  return {
    x,
    y: input.originY,
    direction,
    modeTimerMs: input.modeTimerMs + dtSeconds * 1000,
    isCharging: false,
    presentationState: "patrol",
  };
}

function stepChargeHazard(input: HazardStepInput, dtSeconds: number): HazardStepResult {
  const pauseMs = input.pauseMs ?? 1000;
  let modeTimerMs = input.modeTimerMs + dtSeconds * 1000;
  let direction = input.direction;
  let x = input.x;
  let isCharging = false;
  let presentationState: HazardPresentationState = "charge-windup";

  if (modeTimerMs >= pauseMs) {
    isCharging = true;
    presentationState = "charge";
    x += input.baseSpeed * 1.65 * direction * dtSeconds;

    if (x >= input.safeMaxX) {
      x = input.safeMaxX;
      direction = -1;
      modeTimerMs = 0;
      isCharging = false;
      presentationState = "patrol";
    } else if (x <= input.safeMinX) {
      x = input.safeMinX;
      direction = 1;
      modeTimerMs = 0;
      isCharging = false;
      presentationState = "patrol";
    }
  }

  return {
    x,
    y: input.originY,
    direction,
    modeTimerMs,
    isCharging,
    presentationState,
  };
}

function stepSwoopHazard(input: HazardStepInput, dtSeconds: number): HazardStepResult {
  let direction = input.direction;
  let x = input.x + input.baseSpeed * direction * dtSeconds;

  if (x >= input.safeMaxX) {
    x = input.safeMaxX;
    direction = -1;
  } else if (x <= input.safeMinX) {
    x = input.safeMinX;
    direction = 1;
  }

  const modeTimerMs = input.modeTimerMs + dtSeconds * 1000;
  const swoopDepth = input.swoopDepth ?? 22;
  const swoopRate = input.swoopRate ?? 2.5;

  return {
    x,
    y: input.originY + Math.sin((modeTimerMs / 1000) * swoopRate * Math.PI) * swoopDepth,
    direction,
    modeTimerMs,
    isCharging: false,
    presentationState: "swoop",
  };
}

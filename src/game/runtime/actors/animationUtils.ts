export function getCycledFrame(frames: string[], elapsedMs: number, stepMs: number): string {
  if (frames.length === 0) {
    return "";
  }

  if (frames.length === 1) {
    return frames[0];
  }

  const index = Math.floor(elapsedMs / stepMs) % frames.length;
  return frames[index];
}

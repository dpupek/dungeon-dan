import { GAME_CONFIG } from "../config";
import type { FloorLevel, PlatformDefinition, RoomDefinition } from "../types";

type SpawnKey = "default" | "fromLeft" | "fromRight";

export class SpawnResolver {
  resolveSpawnPoint(
    room: RoomDefinition,
    spawnKey: SpawnKey,
    transitionY?: number,
    forceFloor?: FloorLevel,
  ): { x: number; y: number } {
    const authoredSpawn = room.spawn[spawnKey] ?? room.spawn.default;
    if (forceFloor) {
      return forceFloor === "ground" ? authoredSpawn : this.resolveBasementSpawn(room.platforms, authoredSpawn);
    }

    if (transitionY === undefined || spawnKey === "default") {
      return authoredSpawn;
    }

    const preferredX = spawnKey === "fromLeft" ? 40 : GAME_CONFIG.world.width - 40;
    const matchingPlatform = this.findTransitionPlatform(room.platforms, preferredX, transitionY);
    if (!matchingPlatform) {
      return authoredSpawn;
    }

    const span = this.getPlatformSpan(matchingPlatform, 12);
    const top = this.getPlatformTop(matchingPlatform);
    return {
      x: clamp(preferredX, span.minX, span.maxX),
      y: top - GAME_CONFIG.player.height / 2,
    };
  }

  getFloorLevel(platform: PlatformDefinition | null, y: number): FloorLevel {
    if (platform) {
      return platform.y > GAME_CONFIG.world.floorY + 40 ? "basement" : "ground";
    }

    return y > GAME_CONFIG.world.floorY ? "basement" : "ground";
  }

  private resolveBasementSpawn(
    platforms: PlatformDefinition[],
    fallbackSpawn: { x: number; y: number },
  ): { x: number; y: number } {
    const basementPlatforms = platforms.filter((platform) => platform.y > GAME_CONFIG.world.floorY + 40);
    if (basementPlatforms.length === 0) {
      return fallbackSpawn;
    }

    const preferredPlatform =
      basementPlatforms.find((platform) => {
        const span = this.getPlatformSpan(platform, 24);
        return fallbackSpawn.x >= span.minX && fallbackSpawn.x <= span.maxX;
      }) ?? basementPlatforms[0];

    const span = this.getPlatformSpan(preferredPlatform, 24);
    const top = this.getPlatformTop(preferredPlatform);

    return {
      x: clamp(fallbackSpawn.x, span.minX, span.maxX),
      y: top - GAME_CONFIG.player.height / 2,
    };
  }

  private findTransitionPlatform(
    platforms: PlatformDefinition[],
    preferredX: number,
    transitionY: number,
  ): PlatformDefinition | null {
    const targetFeetY = transitionY + GAME_CONFIG.player.height / 2;
    let bestPlatform: PlatformDefinition | null = null;
    let bestScore = Number.POSITIVE_INFINITY;

    for (const platform of platforms) {
      const span = this.getPlatformSpan(platform, 12);
      if (preferredX < span.minX || preferredX > span.maxX) {
        continue;
      }

      const top = this.getPlatformTop(platform);
      const score = Math.abs(top - targetFeetY) + Math.abs(platform.x - preferredX) * 0.1;
      if (score < bestScore) {
        bestPlatform = platform;
        bestScore = score;
      }
    }

    return bestPlatform;
  }

  private getPlatformSpan(platform: PlatformDefinition, inset = 0): { minX: number; maxX: number } {
    const left = platform.x - platform.width / 2;
    const right = platform.x + platform.width / 2;
    const clampedInset = Math.min(inset, platform.width / 2 - 1);

    return {
      minX: left + clampedInset,
      maxX: right - clampedInset,
    };
  }

  private getPlatformTop(platform: PlatformDefinition): number {
    return platform.y - platform.height / 2;
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

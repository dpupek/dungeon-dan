import { GAME_CONFIG } from "../config";
import type { RoomDefinition } from "../types";

export type RoomBoundaryAction =
  | { type: "none" }
  | { type: "transition"; edge: "left" | "right" }
  | { type: "clamp"; x: number };

const EXIT_THRESHOLD_PX = 20;

export function resolveRoomBoundaryAction(room: RoomDefinition, playerX: number): RoomBoundaryAction {
  const minExitX = -EXIT_THRESHOLD_PX;
  const maxExitX = GAME_CONFIG.world.width + EXIT_THRESHOLD_PX;
  const minClampX = GAME_CONFIG.player.width / 2;
  const maxClampX = GAME_CONFIG.world.width - GAME_CONFIG.player.width / 2;

  if (playerX < minExitX) {
    if (room.exits.left) {
      return { type: "transition", edge: "left" };
    }
    return { type: "clamp", x: minClampX };
  }

  if (playerX > maxExitX) {
    if (room.exits.right) {
      return { type: "transition", edge: "right" };
    }
    return { type: "clamp", x: maxClampX };
  }

  return { type: "none" };
}

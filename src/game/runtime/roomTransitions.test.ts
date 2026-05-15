import { describe, expect, it } from "vitest";
import { getRoomDefinition } from "../data/rooms";
import { GAME_CONFIG } from "../config";
import { resolveRoomBoundaryAction } from "./roomTransitions";

describe("resolveRoomBoundaryAction", () => {
  it("transitions right when the room has an authored right exit", () => {
    const room = getRoomDefinition("idol-hall");

    expect(resolveRoomBoundaryAction(room, GAME_CONFIG.world.width + 21)).toEqual({
      type: "transition",
      edge: "right",
    });
  });

  it("clamps the player inside rooms with no authored right exit", () => {
    const room = getRoomDefinition("stormshaft-range");

    expect(resolveRoomBoundaryAction(room, GAME_CONFIG.world.width + 21)).toEqual({
      type: "clamp",
      x: GAME_CONFIG.world.width - GAME_CONFIG.player.width / 2,
    });
  });

  it("transitions left when the room has an authored left exit", () => {
    const room = getRoomDefinition("stormshaft-range");

    expect(resolveRoomBoundaryAction(room, -21)).toEqual({
      type: "transition",
      edge: "left",
    });
  });
});

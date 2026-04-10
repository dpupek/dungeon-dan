import { describe, expect, it } from "vitest";
import { getRoomDefinition } from "../data/rooms";
import { SpawnResolver } from "./SpawnResolver";

describe("SpawnResolver", () => {
  it("keeps a default spawn on the ground floor", () => {
    const resolver = new SpawnResolver();
    const room = getRoomDefinition("canopy-gate");

    const spawn = resolver.resolveSpawnPoint(room, "default");

    expect(spawn).toEqual({ x: 120, y: 372 });
  });

  it("can force a basement spawn onto the basement route", () => {
    const resolver = new SpawnResolver();
    const room = getRoomDefinition("ember-bridge");

    const spawn = resolver.resolveSpawnPoint(room, "default", undefined, "basement");

    expect(spawn.x).toBe(140);
    expect(spawn.y).toBeGreaterThan(460);
  });

  it("preserves transition floor when a matching edge platform exists", () => {
    const resolver = new SpawnResolver();
    const room = getRoomDefinition("monkey-step");

    const spawn = resolver.resolveSpawnPoint(room, "fromLeft", 480);

    expect(spawn.y).toBeGreaterThan(460);
  });
});

import { describe, expect, it } from "vitest";
import { clampMusicVolume, formatMusicStatus, loadMusicSettings, saveMusicSettings } from "./musicSettings";

class MemoryStorage {
  private readonly map = new Map<string, string>();

  getItem(key: string): string | null {
    return this.map.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.map.set(key, value);
  }
}

describe("musicSettings", () => {
  it("clamps music volume into the supported range", () => {
    expect(clampMusicVolume(-1)).toBe(0);
    expect(clampMusicVolume(0.42)).toBe(0.42);
    expect(clampMusicVolume(2)).toBe(1);
  });

  it("falls back to defaults when stored values are invalid", () => {
    const storage = new MemoryStorage();
    storage.setItem("dungeon-dan.music-volume", "loud");
    storage.setItem("dungeon-dan.music-muted", "maybe");

    const settings = loadMusicSettings(storage);
    expect(settings.musicVolume).toBe(0.22);
    expect(settings.musicMuted).toBe(false);
  });

  it("persists clamped settings values", () => {
    const storage = new MemoryStorage();
    saveMusicSettings(storage, { musicVolume: 4, musicMuted: true });

    const settings = loadMusicSettings(storage);
    expect(settings.musicVolume).toBe(1);
    expect(settings.musicMuted).toBe(true);
  });

  it("formats a readable status string", () => {
    expect(formatMusicStatus({ musicVolume: 0.7, musicMuted: false })).toBe("Music 70%");
    expect(formatMusicStatus({ musicVolume: 0.7, musicMuted: true })).toBe("Music Muted");
  });
});

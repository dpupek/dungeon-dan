import { GAME_CONFIG } from "../config";
import type { MusicSettings } from "../types";

const MUSIC_VOLUME_KEY = "dungeon-dan.music-volume";
const MUSIC_MUTED_KEY = "dungeon-dan.music-muted";

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export function clampMusicVolume(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function getBrowserStorage(): StorageLike | null {
  if (typeof window === "undefined" || !("localStorage" in window)) {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function getDefaultMusicSettings(): MusicSettings {
  return {
    musicVolume: GAME_CONFIG.audio.defaultMusicVolume,
    musicMuted: false,
  };
}

export function loadMusicSettings(storage: StorageLike | null): MusicSettings {
  const defaults = getDefaultMusicSettings();
  if (!storage) {
    return defaults;
  }

  const rawVolume = storage.getItem(MUSIC_VOLUME_KEY);
  const parsedVolume = rawVolume === null ? Number.NaN : Number.parseFloat(rawVolume);
  const musicVolume = Number.isFinite(parsedVolume) ? clampMusicVolume(parsedVolume) : defaults.musicVolume;

  const rawMuted = storage.getItem(MUSIC_MUTED_KEY);
  const musicMuted = rawMuted === "true" ? true : rawMuted === "false" ? false : defaults.musicMuted;

  return { musicVolume, musicMuted };
}

export function saveMusicSettings(storage: StorageLike | null, settings: MusicSettings): void {
  if (!storage) {
    return;
  }

  storage.setItem(MUSIC_VOLUME_KEY, String(clampMusicVolume(settings.musicVolume)));
  storage.setItem(MUSIC_MUTED_KEY, settings.musicMuted ? "true" : "false");
}

export function formatMusicStatus(settings: MusicSettings): string {
  if (settings.musicMuted || settings.musicVolume <= 0) {
    return "Music Muted";
  }

  return `Music ${Math.round(clampMusicVolume(settings.musicVolume) * 100)}%`;
}

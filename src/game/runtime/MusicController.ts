import Phaser from "phaser";
import { formatMusicStatus, getBrowserStorage, loadMusicSettings, saveMusicSettings } from "../audio/musicSettings";
import type { MusicSettings } from "../types";

const GAMEPLAY_MUSIC_KEY = "adventure-loop";
const GAMEPLAY_MUSIC_URL = `${import.meta.env.BASE_URL}audio/adventure-loop.mp3`;

export class MusicController {
  private readonly scene: Phaser.Scene;
  private readonly storage = getBrowserStorage();
  private settings: MusicSettings = loadMusicSettings(this.storage);
  private sound: Phaser.Sound.BaseSound | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  async startGameplayLoop(): Promise<void> {
    await this.ensureMusicLoaded();
    await this.resumeAudioContext();

    if (!this.sound) {
      this.sound = this.scene.sound.add(GAMEPLAY_MUSIC_KEY, {
        loop: true,
        volume: this.settings.musicMuted ? 0 : this.settings.musicVolume,
      });
    }

    this.applySettingsToSound();
    if (!this.sound.isPlaying) {
      this.sound.play();
    } else if (this.sound.isPaused) {
      this.sound.resume();
    }
  }

  pauseGameplayLoop(): void {
    this.sound?.pause();
  }

  resumeGameplayLoop(): void {
    if (!this.sound) {
      return;
    }

    this.applySettingsToSound();
    if (this.sound.isPaused) {
      this.sound.resume();
    }
  }

  stopGameplayLoop(): void {
    this.sound?.stop();
  }

  adjustVolume(delta: number): string {
    this.settings.musicMuted = false;
    this.settings.musicVolume = Math.min(1, Math.max(0, this.settings.musicVolume + delta));
    this.persistAndApply();
    return formatMusicStatus(this.settings);
  }

  toggleMute(): string {
    this.settings.musicMuted = !this.settings.musicMuted;
    this.persistAndApply();
    return formatMusicStatus(this.settings);
  }

  destroy(): void {
    this.stopGameplayLoop();
    this.sound?.destroy();
    this.sound = null;
  }

  private async resumeAudioContext(): Promise<void> {
    if (!("context" in this.scene.sound)) {
      return;
    }

    const context = this.scene.sound.context;
    if (!context || context.state === "closed" || context.state === "running") {
      return;
    }

    try {
      await context.resume();
    } catch {
      // Keep audio optional if the browser still rejects autoplay.
    }
  }

  private async ensureMusicLoaded(): Promise<void> {
    if (this.scene.cache.audio.exists(GAMEPLAY_MUSIC_KEY)) {
      return;
    }

    await new Promise<void>((resolve) => {
      this.scene.load.audio(GAMEPLAY_MUSIC_KEY, GAMEPLAY_MUSIC_URL);
      this.scene.load.once(Phaser.Loader.Events.COMPLETE, () => resolve());
      this.scene.load.start();
    });
  }

  private persistAndApply(): void {
    saveMusicSettings(this.storage, this.settings);
    this.applySettingsToSound();
  }

  private applySettingsToSound(): void {
    if (!this.sound) {
      return;
    }

    const sound = this.sound as Phaser.Sound.WebAudioSound | Phaser.Sound.HTML5AudioSound;
    sound.setVolume(this.settings.musicMuted ? 0 : this.settings.musicVolume);
  }
}

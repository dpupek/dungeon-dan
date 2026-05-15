import Phaser from "phaser";
import { RELIC_ANIMATION_MANIFESTS } from "../../assets/manifest";
import { RELIC_ARCHETYPES } from "../../content/archetypes";
import type { BonusPickupDefinition } from "../../types";
import { getCycledFrame } from "./animationUtils";

export class BonusPickupActor {
  private readonly archetype;
  private readonly sprite: Phaser.GameObjects.Image;
  private readonly sparkles: Phaser.GameObjects.Image[];
  private animationClockMs = 0;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly definition: BonusPickupDefinition,
  ) {
    this.archetype = RELIC_ARCHETYPES[definition.archetypeId];
    const manifest = RELIC_ANIMATION_MANIFESTS[definition.archetypeId];
    this.sprite = scene.add.image(definition.x, definition.y, manifest.idle[0]);
    this.sprite.setDisplaySize(16 * this.archetype.baseScale, 16 * this.archetype.baseScale);
    this.sprite.setDepth(5);
    this.sprite.setAlpha(0.98);
    this.sparkles = this.createSparkles();

    scene.tweens.add({
      targets: this.sprite,
      y: this.sprite.y - 4,
      duration: 380,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
    });
  }

  update(dtSeconds: number): void {
    this.animationClockMs += dtSeconds * 1000;
    const manifest = RELIC_ANIMATION_MANIFESTS[this.definition.archetypeId];
    const textureKey = getCycledFrame(manifest.idle, this.animationClockMs, 120);
    if (textureKey) {
      this.sprite.setTexture(textureKey);
    }
  }

  getBounds(): Phaser.Geom.Rectangle {
    return this.sprite.getBounds();
  }

  getDefinition(): BonusPickupDefinition {
    return this.definition;
  }

  collect(): void {
    this.scene.tweens.killTweensOf(this.sprite);
    this.sprite.destroy();
    this.sparkles.forEach((sparkle) => {
      this.scene.tweens.killTweensOf(sparkle);
      sparkle.destroy();
    });
  }

  destroy(): void {
    this.collect();
  }

  private createSparkles(): Phaser.GameObjects.Image[] {
    const sparkleConfigs = [
      { key: "glint-4", offsetX: -10, offsetY: -8, scale: 0.42, duration: 180, repeatDelay: 520 },
      { key: "glint-4", offsetX: 11, offsetY: -4, scale: 0.32, duration: 160, repeatDelay: 460 },
    ] as const;

    return sparkleConfigs.map((config, index) => {
      const sparkle = this.scene.add.image(this.sprite.x + config.offsetX, this.sprite.y + config.offsetY, config.key);
      sparkle.setDepth(6 + index);
      sparkle.setScale(0.1);
      sparkle.setAlpha(0);

      this.scene.tweens.add({
        targets: sparkle,
        alpha: { from: 0, to: 1 },
        scaleX: { from: 0.1, to: config.scale },
        scaleY: { from: 0.1, to: config.scale },
        angle: index === 0 ? 10 : -10,
        ease: "Sine.easeOut",
        yoyo: true,
        repeat: -1,
        duration: config.duration,
        repeatDelay: config.repeatDelay,
        delay: 140 + index * 90,
      });

      return sparkle;
    });
  }
}

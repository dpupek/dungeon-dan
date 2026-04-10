import Phaser from "phaser";
import { RELIC_ANIMATION_MANIFESTS } from "../../assets/manifest";
import { RELIC_ARCHETYPES } from "../../content/archetypes";
import type { RelicInstanceDefinition } from "../../types";
import { getCycledFrame } from "./animationUtils";

export class RelicActor {
  private readonly archetype;
  private readonly sprite: Phaser.GameObjects.Image;
  private readonly sparkles: Phaser.GameObjects.Image[];
  private animationClockMs = 0;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly definition: RelicInstanceDefinition,
  ) {
    this.archetype = RELIC_ARCHETYPES[definition.archetypeId];
    const manifest = RELIC_ANIMATION_MANIFESTS[definition.archetypeId];
    this.sprite = scene.add.image(definition.x, definition.y, manifest.idle[0]);
    this.sprite.setDisplaySize(16 * this.archetype.baseScale, 16 * this.archetype.baseScale);
    this.sprite.setDepth(4);
    this.sprite.setAlpha(0.98);
    this.sparkles = this.createSparkles();

    scene.tweens.add({
      targets: this.sprite,
      y: this.sprite.y - 6,
      duration: 780,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
    });
  }

  update(dtSeconds: number): void {
    this.animationClockMs += dtSeconds * 1000;
    const manifest = RELIC_ANIMATION_MANIFESTS[this.definition.archetypeId];
    const textureKey = getCycledFrame(manifest.idle, this.animationClockMs, 220);
    if (textureKey) {
      this.sprite.setTexture(textureKey);
    }
  }

  getBounds(): Phaser.Geom.Rectangle {
    return this.sprite.getBounds();
  }

  getDefinition(): RelicInstanceDefinition {
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
      { key: "glint-8", offsetX: -18, offsetY: -16, baseScale: 0.9, duration: 260, repeatDelay: 900, angle: 0 },
      { key: "glint-4", offsetX: 20, offsetY: -6, baseScale: 0.62, duration: 220, repeatDelay: 760, angle: 14 },
      { key: "glint-4", offsetX: 6, offsetY: 18, baseScale: 0.52, duration: 210, repeatDelay: 1040, angle: -12 },
    ] as const;

    return sparkleConfigs.map((config, index) => {
      const sparkle = this.scene.add.image(this.sprite.x + config.offsetX, this.sprite.y + config.offsetY, config.key);
      sparkle.setDepth(6 + index);
      sparkle.setScale(0.15);
      sparkle.setAlpha(0);
      sparkle.setAngle(config.angle);

      this.scene.tweens.add({
        targets: sparkle,
        alpha: { from: 0, to: 1 },
        scaleX: { from: 0.15, to: config.baseScale },
        scaleY: { from: 0.15, to: config.baseScale },
        angle: config.angle + (index % 2 === 0 ? 12 : -12),
        ease: "Sine.easeOut",
        yoyo: true,
        repeat: -1,
        duration: config.duration,
        repeatDelay: config.repeatDelay,
        delay: 180 + index * 170,
      });

      return sparkle;
    });
  }
}

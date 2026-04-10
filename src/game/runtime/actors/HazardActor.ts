import Phaser from "phaser";
import { ACTOR_ANIMATION_MANIFESTS } from "../../assets/manifest";
import { ACTOR_ARCHETYPES } from "../../content/archetypes";
import type { ActorInstanceDefinition } from "../../types";
import { getCycledFrame } from "./animationUtils";
import { stepHazardRuntime, type HazardPresentationState } from "./hazardBehavior";

export class HazardActor {
  private readonly sprite: Phaser.GameObjects.Image;
  private readonly archetype;
  private direction: 1 | -1 = 1;
  private modeTimerMs = 0;
  private animationClockMs = 0;
  private presentationState: HazardPresentationState =
    "patrol";

  constructor(
    scene: Phaser.Scene,
    private readonly definition: ActorInstanceDefinition,
    private readonly safeBounds: { minX: number; maxX: number },
  ) {
    this.archetype = ACTOR_ARCHETYPES[definition.archetypeId];
    this.presentationState = this.archetype.behavior === "swoop" ? "swoop" : "patrol";
    const initialTexture = ACTOR_ANIMATION_MANIFESTS[definition.archetypeId].idle[0];
    this.sprite = scene.add.image(definition.x, definition.y, initialTexture);
    this.sprite.setDisplaySize(definition.width, definition.height);
    this.sprite.setDepth(4);

    if (this.definition.archetypeId === "dave-goat") {
      this.modeTimerMs = Math.random() * (this.definition.chargePauseMs ?? 1000);
    }
  }

  update(dtSeconds: number): void {
    const result = stepHazardRuntime(
      {
        behavior: this.archetype.behavior,
        x: this.sprite.x,
        y: this.sprite.y,
        direction: this.direction,
        modeTimerMs: this.modeTimerMs,
        originY: this.definition.y,
        safeMinX: this.safeBounds.minX,
        safeMaxX: this.safeBounds.maxX,
        baseSpeed: this.definition.speed ?? this.archetype.defaultSpeed,
        pauseMs: this.definition.chargePauseMs,
        swoopDepth: this.definition.swoopDepth,
        swoopRate: this.definition.swoopRate,
      },
      dtSeconds,
    );

    this.sprite.x = result.x;
    this.sprite.y = result.y;
    this.direction = result.direction;
    this.modeTimerMs = result.modeTimerMs;
    this.presentationState = result.presentationState;
    this.animationClockMs += dtSeconds * 1000;
    this.syncPresentation();
  }

  private syncPresentation(): void {
    const manifest = ACTOR_ANIMATION_MANIFESTS[this.definition.archetypeId];
    const frames =
      manifest[this.presentationState] ??
      manifest.patrol ??
      manifest.swoop ??
      manifest.idle;
    const textureKey = getCycledFrame(frames, this.animationClockMs, 140);
    if (textureKey) {
      this.sprite.setTexture(textureKey);
    }
    this.sprite.setFlipX(this.direction < 0);
  }

  getBounds(): Phaser.Geom.Rectangle {
    return this.sprite.getBounds();
  }

  getDefinition(): ActorInstanceDefinition {
    return this.definition;
  }

  destroy(): void {
    this.sprite.destroy();
  }
}

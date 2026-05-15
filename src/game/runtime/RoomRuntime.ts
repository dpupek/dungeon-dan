import Phaser from "phaser";
import { ACTOR_ARCHETYPES } from "../content/archetypes";
import { GAME_CONFIG } from "../config";
import type { BonusPickupDefinition, DoorwayDefinition } from "../types";
import { HazardActor } from "./actors/HazardActor";
import { BonusPickupActor } from "./actors/BonusPickupActor";
import { RelicActor } from "./actors/RelicActor";
import type {
  ActorInstanceDefinition,
  FloorLevel,
  LadderDefinition,
  PlatformDefinition,
  RelicInstanceDefinition,
  RoomDefinition,
} from "../types";

type HorizontalSpan = {
  minX: number;
  maxX: number;
};

export class RoomRuntime {
  private room!: RoomDefinition;
  private platformViews: Phaser.GameObjects.Container[] = [];
  private ladderViews: Phaser.GameObjects.Graphics[] = [];
  private hazardActors: HazardActor[] = [];
  private relicActors: RelicActor[] = [];
  private bonusPickupActors: BonusPickupActor[] = [];
  private doorwayViews: Phaser.GameObjects.Container[] = [];
  private doorwayViewById = new Map<string, Phaser.GameObjects.Container>();

  constructor(private readonly scene: Phaser.Scene) {}

  load(room: RoomDefinition, collectedRelicIds: string[]): void {
    this.destroy();
    this.room = room;

    this.room.platforms.forEach((platform) => {
      this.platformViews.push(this.createPlatformView(platform));
    });

    this.room.ladders.forEach((ladder) => {
      this.ladderViews.push(this.createLadderView(ladder));
    });

    this.room.actors.forEach((actor) => {
      const safeBounds = this.resolveHazardTravelBounds(actor);
      this.hazardActors.push(new HazardActor(this.scene, actor, safeBounds));
    });

    this.room.relics
      .filter((relic) => !collectedRelicIds.includes(relic.id))
      .forEach((relic) => {
        this.relicActors.push(new RelicActor(this.scene, relic));
      });

    this.room.bonusPickups.forEach((pickup) => {
      this.bonusPickupActors.push(new BonusPickupActor(this.scene, pickup));
    });

    this.room.doorways.forEach((doorway) => {
      const view = this.createDoorwayView(doorway);
      this.doorwayViews.push(view);
      this.doorwayViewById.set(doorway.id, view);
    });
  }

  update(dtSeconds: number): void {
    this.hazardActors.forEach((hazard) => hazard.update(dtSeconds));
    this.relicActors.forEach((relic) => relic.update(dtSeconds));
    this.bonusPickupActors.forEach((pickup) => pickup.update(dtSeconds));
  }

  getRoom(): RoomDefinition {
    return this.room;
  }

  findSupportingPlatform(playerX: number, playerY: number): PlatformDefinition | null {
    const feetY = playerY + GAME_CONFIG.player.height / 2;

    for (const platform of this.room.platforms) {
      const span = this.getPlatformSpan(platform, 6);
      const top = this.getPlatformTop(platform);
      const withinX = playerX >= span.minX && playerX <= span.maxX;
      const closeToTop = feetY >= top - 4 && feetY <= top + 14;

      if (withinX && closeToTop) {
        return platform;
      }
    }

    return null;
  }

  findBlockingCeiling(playerX: number, previousHeadY: number, currentHeadY: number): PlatformDefinition | null {
    if (currentHeadY >= previousHeadY) {
      return null;
    }

    let blockingPlatform: PlatformDefinition | null = null;
    let blockingBottom = Number.NEGATIVE_INFINITY;

    for (const platform of this.room.platforms) {
      const span = this.getPlatformSpan(platform, 6);
      const bottom = platform.y + platform.height / 2;
      const withinX = playerX >= span.minX && playerX <= span.maxX;
      const crossedBottom = previousHeadY >= bottom && currentHeadY <= bottom;

      if (!withinX || !crossedBottom) {
        continue;
      }

      if (bottom > blockingBottom) {
        blockingPlatform = platform;
        blockingBottom = bottom;
      }
    }

    return blockingPlatform;
  }

  findActiveLadder(bounds: Phaser.Geom.Rectangle): LadderDefinition | null {
    for (const ladder of this.room.ladders) {
      const ladderRect = new Phaser.Geom.Rectangle(
        ladder.x - ladder.width / 2 - 8,
        ladder.y - ladder.height / 2 - 20,
        ladder.width + 16,
        ladder.height + 32,
      );

      if (Phaser.Geom.Intersects.RectangleToRectangle(bounds, ladderRect)) {
        return ladder;
      }
    }

    return null;
  }

  getFloorLevel(bounds: Phaser.Geom.Rectangle): FloorLevel {
    const support = this.findSupportingPlatform(bounds.centerX, bounds.centerY);
    if (support) {
      return support.y > GAME_CONFIG.world.floorY + 40 ? "basement" : "ground";
    }

    return bounds.centerY > GAME_CONFIG.world.floorY ? "basement" : "ground";
  }

  findOverlappingHazard(bounds: Phaser.Geom.Rectangle): ActorInstanceDefinition | null {
    for (const hazard of this.hazardActors) {
      if (Phaser.Geom.Intersects.RectangleToRectangle(bounds, hazard.getBounds())) {
        return hazard.getDefinition();
      }
    }

    return null;
  }

  findOverlappingRelic(bounds: Phaser.Geom.Rectangle): RelicInstanceDefinition | null {
    for (const relic of this.relicActors) {
      if (Phaser.Geom.Intersects.RectangleToRectangle(bounds, relic.getBounds())) {
        return relic.getDefinition();
      }
    }

    return null;
  }

  findOverlappingBonusPickup(bounds: Phaser.Geom.Rectangle): BonusPickupDefinition | null {
    for (const pickup of this.bonusPickupActors) {
      if (Phaser.Geom.Intersects.RectangleToRectangle(bounds, pickup.getBounds())) {
        return pickup.getDefinition();
      }
    }

    return null;
  }

  findOverlappingDoorway(bounds: Phaser.Geom.Rectangle): DoorwayDefinition | null {
    for (const doorway of this.room.doorways) {
      const doorwayRect = new Phaser.Geom.Rectangle(
        doorway.x - doorway.width / 2,
        doorway.y - doorway.height / 2,
        doorway.width,
        doorway.height,
      );
      if (Phaser.Geom.Intersects.RectangleToRectangle(bounds, doorwayRect)) {
        return doorway;
      }
    }

    return null;
  }

  collectRelic(relicId: string): void {
    const relic = this.relicActors.find((entry) => entry.getDefinition().id === relicId);
    if (!relic) {
      return;
    }

    relic.collect();
    this.relicActors = this.relicActors.filter((entry) => entry !== relic);
  }

  collectBonusPickup(pickupId: string): void {
    const pickup = this.bonusPickupActors.find((entry) => entry.getDefinition().id === pickupId);
    if (!pickup) {
      return;
    }

    pickup.collect();
    this.bonusPickupActors = this.bonusPickupActors.filter((entry) => entry !== pickup);
  }

  setDoorwayActive(doorwayId: string, active: boolean): void {
    const view = this.doorwayViewById.get(doorwayId);
    if (!view) {
      return;
    }

    view.setVisible(active);
  }

  destroy(): void {
    this.platformViews.forEach((view) => view.destroy());
    this.ladderViews.forEach((view) => view.destroy());
    this.hazardActors.forEach((hazard) => hazard.destroy());
    this.relicActors.forEach((relic) => relic.destroy());
    this.bonusPickupActors.forEach((pickup) => pickup.destroy());
    this.doorwayViews.forEach((view) => view.destroy());
    this.platformViews = [];
    this.ladderViews = [];
    this.hazardActors = [];
    this.relicActors = [];
    this.bonusPickupActors = [];
    this.doorwayViews = [];
    this.doorwayViewById.clear();
  }

  private resolveHazardTravelBounds(actor: ActorInstanceDefinition): { minX: number; maxX: number } {
    const supportingPlatform = this.findHazardPlatform(actor);
    if (!supportingPlatform) {
      return { minX: actor.minX, maxX: actor.maxX };
    }

    const platformSpan = this.getPlatformSpan(supportingPlatform, this.getHazardEdgeInset(actor));
    const minX = Math.max(actor.minX, platformSpan.minX);
    const maxX = Math.min(actor.maxX, platformSpan.maxX);

    if (minX <= maxX) {
      return { minX, maxX };
    }

    const fallbackX = Phaser.Math.Clamp(actor.x, platformSpan.minX, platformSpan.maxX);
    return { minX: fallbackX, maxX: fallbackX };
  }

  private findHazardPlatform(actor: ActorInstanceDefinition): PlatformDefinition | null {
    const hazardBottom = actor.y + actor.height / 2;
    const laneCenter = (actor.minX + actor.maxX) / 2;
    const laneWidth = Math.max(actor.maxX - actor.minX, actor.width);
    let bestPlatform: PlatformDefinition | null = null;
    let bestScore = Number.POSITIVE_INFINITY;

    for (const platform of this.room.platforms) {
      const span = this.getPlatformSpan(platform);
      const top = this.getPlatformTop(platform);
      const overlapsLane = actor.maxX >= span.minX && actor.minX <= span.maxX;
      const nearTop = Math.abs(hazardBottom - top) <= 18;

      if (!overlapsLane || !nearTop) {
        continue;
      }

      const platformCenter = (span.minX + span.maxX) / 2;
      const score =
        Math.abs(top - hazardBottom) * 8 +
        Math.abs(platformCenter - laneCenter) +
        Math.abs(platform.width - laneWidth) * 0.05;
      if (score < bestScore) {
        bestPlatform = platform;
        bestScore = score;
      }
    }

    return bestPlatform;
  }

  private createPlatformView(platform: PlatformDefinition): Phaser.GameObjects.Container {
    const textureKey = Phaser.Utils.Array.GetRandom(["wood-plank-a", "wood-plank-b", "wood-plank-c"]);
    const left = platform.x - platform.width / 2;
    const top = platform.y - platform.height / 2;
    const container = this.scene.add.container(left, top);
    const plank = this.scene.add.tileSprite(platform.width / 2, platform.height / 2, platform.width, platform.height, textureKey);
    plank.tilePositionX = Phaser.Math.Between(0, 31);
    const topLip = this.scene.add.rectangle(platform.width / 2, 2, platform.width, 3, 0xd4a373);
    topLip.setAlpha(0.45);
    const bottomShadow = this.scene.add.rectangle(platform.width / 2, platform.height - 2, platform.width, 4, 0x3b2418);
    bottomShadow.setAlpha(0.65);

    container.add([plank, topLip, bottomShadow]);
    return container;
  }

  private createLadderView(ladder: LadderDefinition): Phaser.GameObjects.Graphics {
    const view = this.scene.add.graphics();
    const left = ladder.x - ladder.width / 2;
    const top = ladder.y - ladder.height / 2 - 10;
    const height = ladder.height + 10;
    const railWidth = 4;
    const rungInset = 4;
    const rungHeight = 2;
    const rungSpacing = 10;

    view.fillStyle(0x8d5524, 1);
    view.fillRect(left, top, railWidth, height);
    view.fillRect(left + ladder.width - railWidth, top, railWidth, height);

    view.fillStyle(0xf6bd60, 1);
    for (let y = top + 6; y < top + height - 2; y += rungSpacing) {
      view.fillRect(left + rungInset, y, ladder.width - rungInset * 2, rungHeight);
    }

    view.lineStyle(1, 0x432818, 1);
    view.strokeRect(left, top, railWidth, height);
    view.strokeRect(left + ladder.width - railWidth, top, railWidth, height);
    return view;
  }

  private createDoorwayView(doorway: DoorwayDefinition): Phaser.GameObjects.Container {
    const container = this.scene.add.container(doorway.x, doorway.y);
    container.setDepth(3);

    const frame = this.scene.add.rectangle(0, 0, doorway.width, doorway.height, 0x2d1e2f, 0.24);
    frame.setStrokeStyle(3, 0xf4d35e, 0.75);
    const glow = this.scene.add.rectangle(0, 0, doorway.width - 16, doorway.height - 16, 0x9ef01a, 0.18);
    glow.setStrokeStyle(2, 0xd9ed92, 0.55);
    const lintel = this.scene.add.rectangle(0, -doorway.height / 2 + 10, doorway.width + 6, 12, 0x4f772d, 0.95);
    const sign = this.scene.add.text(0, doorway.height / 2 + 12, doorway.prompt, {
      fontFamily: "Courier New",
      fontSize: "14px",
      color: "#fefae0",
      stroke: "#283618",
      strokeThickness: 4,
    });
    sign.setOrigin(0.5, 0);

    container.add([frame, glow, lintel, sign]);
    return container;
  }

  private getPlatformSpan(platform: PlatformDefinition, inset = 0): HorizontalSpan {
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

  private getHazardEdgeInset(actor: ActorInstanceDefinition): number {
    const archetype = ACTOR_ARCHETYPES[actor.archetypeId];
    const minInset = archetype.behavior === "swoop" ? 10 : 8;
    return Math.max(minInset, actor.width / 2 - 4);
  }
}

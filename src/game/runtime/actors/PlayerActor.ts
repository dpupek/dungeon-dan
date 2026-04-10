import Phaser from "phaser";
import { PLAYER_ANIMATION_MANIFEST } from "../../assets/manifest";
import { GAME_CONFIG } from "../../config";
import type { FloorLevel, LadderDefinition, PlatformDefinition } from "../../types";
import { resolvePlayerAnimationState, type PlayerAnimationState } from "./playerAnimation";

export interface PlayerIntent {
  moveX: -1 | 0 | 1;
  moveY: -1 | 0 | 1;
  jumpPressed: boolean;
}

export interface PlayerEnvironment {
  findSupportingPlatform(x: number, y: number): PlatformDefinition | null;
  findBlockingCeiling(x: number, previousHeadY: number, currentHeadY: number): PlatformDefinition | null;
  findActiveLadder(bounds: Phaser.Geom.Rectangle): LadderDefinition | null;
  getFloorLevel(bounds: Phaser.Geom.Rectangle): FloorLevel;
}

export interface PlayerStepResult {
  jumped: boolean;
}

export class PlayerActor {
  private readonly sprite: Phaser.GameObjects.Sprite;
  private vx = 0;
  private vy = 0;
  private isGrounded = false;
  private isClimbing = false;
  private facing: 1 | -1 = 1;
  private activeLadder: LadderDefinition | null = null;
  private animationState: PlayerAnimationState = "idle";
  private isHurt = false;

  constructor(scene: Phaser.Scene) {
    this.sprite = scene.add.sprite(0, 0, PLAYER_ANIMATION_MANIFEST.textureKey, PLAYER_ANIMATION_MANIFEST.idle.startFrame);
    this.sprite.setDisplaySize(GAME_CONFIG.player.width, GAME_CONFIG.player.height);
    this.sprite.setDepth(5);
  }

  spawn(position: { x: number; y: number }): void {
    this.sprite.setPosition(position.x, position.y);
    this.sprite.setTint(0xffffff);
    this.vx = 0;
    this.vy = 0;
    this.isGrounded = false;
    this.isClimbing = false;
    this.activeLadder = null;
    this.facing = 1;
    this.isHurt = false;
    this.animationState = "idle";
    this.syncAnimation();
  }

  update(dtSeconds: number, intent: PlayerIntent, environment: PlayerEnvironment): PlayerStepResult {
    this.activeLadder = environment.findActiveLadder(this.getBounds());
    const hasSupport = environment.findSupportingPlatform(this.sprite.x, this.sprite.y) !== null;
    const wantsToStepOffLadder =
      this.isClimbing && hasSupport && intent.moveX !== 0 && intent.moveY === 0;
    let jumped = false;

    if (wantsToStepOffLadder) {
      this.isClimbing = false;
    }

    if (this.activeLadder && (intent.moveY !== 0 || this.isClimbing)) {
      this.isClimbing = true;
      this.isGrounded = false;
      this.vx = 0;
      this.vy = 0;
      this.sprite.x = Phaser.Math.Linear(this.sprite.x, this.activeLadder.x, 0.7);

      if (intent.moveY < 0) {
        this.sprite.y -= GAME_CONFIG.physics.climbSpeed * dtSeconds;
      } else if (intent.moveY > 0) {
        this.sprite.y += GAME_CONFIG.physics.climbSpeed * dtSeconds;
      }
    } else {
      if (this.isClimbing) {
        this.isClimbing = false;
      }

      if (intent.moveX < 0) {
        this.vx = -GAME_CONFIG.physics.runSpeed;
        this.facing = -1;
      } else if (intent.moveX > 0) {
        this.vx = GAME_CONFIG.physics.runSpeed;
        this.facing = 1;
      } else {
        this.vx = 0;
      }

      if (intent.jumpPressed && this.isGrounded) {
        this.vy = GAME_CONFIG.physics.jumpVelocity;
        this.isGrounded = false;
        jumped = true;
      }

      this.sprite.x += this.vx * dtSeconds;
      const previousHeadY = this.sprite.y - GAME_CONFIG.player.height / 2;
      this.vy += GAME_CONFIG.physics.gravityY * dtSeconds;
      this.sprite.y += this.vy * dtSeconds;

      this.resolveCeilingCollision(previousHeadY, environment);
      this.resolvePlatformLanding(environment);
    }

    if (intent.jumpPressed && this.isClimbing) {
      this.isClimbing = false;
      this.vy = GAME_CONFIG.physics.jumpVelocity * 0.8;
      this.isGrounded = false;
      jumped = true;
    }

    this.syncAnimation();
    return { jumped };
  }

  private resolveCeilingCollision(previousHeadY: number, environment: PlayerEnvironment): void {
    if (this.vy >= 0) {
      return;
    }

    const currentHeadY = this.sprite.y - GAME_CONFIG.player.height / 2;
    const ceiling = environment.findBlockingCeiling(this.sprite.x, previousHeadY, currentHeadY);
    if (!ceiling) {
      return;
    }

    const ceilingBottom = ceiling.y + ceiling.height / 2;
    this.sprite.y = ceilingBottom + GAME_CONFIG.player.height / 2;
    this.vy = 0;
  }

  private resolvePlatformLanding(environment: PlayerEnvironment): void {
    const support = environment.findSupportingPlatform(this.sprite.x, this.sprite.y);
    if (!support || this.vy < 0) {
      this.isGrounded = false;
      return;
    }

    const platformTop = support.y - support.height / 2;
    this.sprite.y = platformTop - GAME_CONFIG.player.height / 2;
    this.vy = 0;
    this.isGrounded = true;
  }

  private syncAnimation(): void {
    const nextAnimationState = resolvePlayerAnimationState({
      isClimbing: this.isClimbing,
      isGrounded: this.isGrounded,
      vx: this.vx,
      vy: this.vy,
      isHurt: this.isHurt,
    });

    if (
      nextAnimationState !== this.animationState ||
      this.sprite.anims.currentAnim?.key !== PLAYER_ANIMATION_MANIFEST[nextAnimationState].animationKey
    ) {
      this.animationState = nextAnimationState;
      this.sprite.play(PLAYER_ANIMATION_MANIFEST[this.animationState].animationKey, true);
    }

    this.sprite.setFlipX(this.facing < 0);
  }

  setHurt(active: boolean): void {
    this.isHurt = active;
    this.sprite.setTint(active ? 0xff0000 : 0xffffff);
    this.syncAnimation();
  }

  getBounds(): Phaser.Geom.Rectangle {
    return new Phaser.Geom.Rectangle(
      this.sprite.x - GAME_CONFIG.player.width / 2,
      this.sprite.y - GAME_CONFIG.player.height / 2,
      GAME_CONFIG.player.width,
      GAME_CONFIG.player.height,
    );
  }

  getPosition(): { x: number; y: number } {
    return { x: this.sprite.x, y: this.sprite.y };
  }

  getFloorLevel(environment: PlayerEnvironment): FloorLevel {
    return environment.getFloorLevel(this.getBounds());
  }

  destroy(): void {
    this.sprite.destroy();
  }
}

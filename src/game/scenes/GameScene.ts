import Phaser from "phaser";
import { RetroSfx } from "../audio/RetroSfx";
import { GAME_CONFIG } from "../config";
import { getRoomDefinition } from "../data/rooms";
import { DeveloperConsoleController, type DeveloperConsoleCommand } from "../runtime/DeveloperConsoleController";
import { GameSessionBridge } from "../runtime/GameSessionBridge";
import { HudController } from "../runtime/HudController";
import { RoomRuntime } from "../runtime/RoomRuntime";
import { SpawnResolver } from "../runtime/SpawnResolver";
import { PlayerActor, type PlayerIntent } from "../runtime/actors/PlayerActor";
import type { FloorLevel, RoomId, RunState, ScenePayload } from "../types";

export class GameScene extends Phaser.Scene {
  private session!: GameSessionBridge;
  private runState!: RunState;
  private player!: PlayerActor;
  private roomRuntime!: RoomRuntime;
  private spawnResolver!: SpawnResolver;
  private hud!: HudController;
  private developerConsole!: DeveloperConsoleController;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: Record<"left" | "right" | "up" | "down" | "jump" | "pause" | "restart", Phaser.Input.Keyboard.Key>;
  private sfx!: RetroSfx;
  private isPaused = false;
  private isRespawning = false;

  constructor() {
    super("game");
  }

  create(data: ScenePayload): void {
    this.session = new GameSessionBridge(data.runState);
    this.runState = this.session.state;
    this.sfx = new RetroSfx(this);
    this.spawnResolver = new SpawnResolver();

    this.drawBackdrop();
    this.hud = new HudController(this);
    this.developerConsole = new DeveloperConsoleController(this);
    this.roomRuntime = new RoomRuntime(this);
    this.player = new PlayerActor(this);

    this.createInput();
    this.loadRoom(this.runState.currentRoomId, "default");

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.roomRuntime.destroy();
      this.hud.destroy();
      this.developerConsole.destroy();
      this.player.destroy();
    });
  }

  update(_time: number, delta: number): void {
    if (this.isPaused || this.isRespawning || this.developerConsole.isConsoleOpen()) {
      this.refreshUi();
      return;
    }

    const dtSeconds = delta / 1000;
    this.runState = this.session.state;
    const playerStep = this.player.update(dtSeconds, this.readPlayerIntent(), this.roomRuntime);
    if (playerStep.jumped) {
      this.sfx.jump();
    }

    this.roomRuntime.update(dtSeconds);
    this.collectRelicOverlaps();
    this.checkHazardOverlaps();
    this.checkRoomTransitions();
    this.checkFallDeath();

    this.runState = this.session.tick(delta);
    this.refreshUi();

    if (this.runState.status === "lost") {
      this.scene.start("end", { outcome: "lost", runState: this.runState });
    }
  }

  private drawBackdrop(): void {
    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width, height, 0x15304c);

    for (let i = 0; i < 6; i += 1) {
      this.add
        .rectangle(120 + i * 160, 90 + (i % 2) * 16, 180, 90, 0x2d6a4f, 0.65)
        .setAngle(i % 2 === 0 ? -5 : 5);
    }
  }

  private createInput(): void {
    this.cursors = this.input.keyboard?.createCursorKeys() as Phaser.Types.Input.Keyboard.CursorKeys;
    this.keys = {
      left: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      up: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      jump: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
      pause: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.P),
      restart: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.R),
    };

    this.keys.pause.on("down", () => {
      if (this.developerConsole.isConsoleOpen()) {
        return;
      }

      this.isPaused = !this.isPaused;
      this.refreshUi();
    });

    this.keys.restart.on("down", () => {
      if (this.developerConsole.isConsoleOpen()) {
        return;
      }

      this.scene.restart();
    });

    this.input.keyboard?.on("keydown", (event: KeyboardEvent) => {
      const command = this.developerConsole.handleKey(event, {
        currentRoomId: this.roomRuntime.getRoom().id,
        currentRoomTitle: this.roomRuntime.getRoom().title,
        currentFloor: this.player.getFloorLevel(this.roomRuntime),
        runState: this.runState,
        totalRelics: this.session.totalRelicCount,
      });
      this.executeDeveloperConsoleCommand(command);
      this.refreshUi();
    });
  }

  private readPlayerIntent(): PlayerIntent {
    const moveLeft = this.cursors.left.isDown || this.keys.left.isDown;
    const moveRight = this.cursors.right.isDown || this.keys.right.isDown;
    const moveUp = this.cursors.up.isDown || this.keys.up.isDown;
    const moveDown = this.cursors.down.isDown || this.keys.down.isDown;
    const jumpPressed =
      Phaser.Input.Keyboard.JustDown(this.cursors.space) || Phaser.Input.Keyboard.JustDown(this.keys.jump);

    return {
      moveX: moveLeft ? -1 : moveRight ? 1 : 0,
      moveY: moveUp ? -1 : moveDown ? 1 : 0,
      jumpPressed,
    };
  }

  private executeDeveloperConsoleCommand(command: DeveloperConsoleCommand): void {
    switch (command.type) {
      case "adjust-lives":
        this.runState = this.session.adjustLives(command.delta);
        return;
      case "adjust-time":
        this.runState = this.session.adjustTime(command.deltaMs);
        return;
      case "jump":
        this.loadRoom(command.roomId, "default", undefined, command.floor);
        return;
      case "restart-room":
        this.loadRoom(this.roomRuntime.getRoom().id, "default", undefined, command.floor);
        return;
      case "none":
      default:
        return;
    }
  }

  private loadRoom(
    roomId: RoomId,
    spawnKey: "default" | "fromLeft" | "fromRight",
    transitionY?: number,
    forceFloor?: FloorLevel,
  ): void {
    this.runState = this.session.moveToRoom(roomId);
    const room = getRoomDefinition(roomId);
    this.roomRuntime.load(room, this.runState.collectedRelicIds);

    const spawn = this.spawnResolver.resolveSpawnPoint(room, spawnKey, transitionY, forceFloor);
    this.player.spawn(spawn);
    this.refreshUi();
  }

  private collectRelicOverlaps(): void {
    const relic = this.roomRuntime.findOverlappingRelic(this.player.getBounds());
    if (!relic) {
      return;
    }

    this.runState = this.session.collectRelic(relic.id);
    this.roomRuntime.collectRelic(relic.id);
    this.sfx.pickup();
    this.refreshUi();

    if (this.runState.status === "won") {
      this.sfx.win();
      this.scene.start("end", { outcome: "won", runState: this.runState });
    }
  }

  private checkHazardOverlaps(): void {
    if (this.isRespawning || this.runState.status !== "playing") {
      return;
    }

    const hazard = this.roomRuntime.findOverlappingHazard(this.player.getBounds());
    if (hazard) {
      void this.handleDeath(hazard.archetypeId);
    }
  }

  private checkRoomTransitions(): void {
    const playerPosition = this.player.getPosition();
    const leftExit = this.roomRuntime.getRoom().exits.left;
    const rightExit = this.roomRuntime.getRoom().exits.right;

    if (playerPosition.x < -20 && leftExit) {
      this.loadRoom(leftExit, "fromRight", playerPosition.y);
    } else if (playerPosition.x > GAME_CONFIG.world.width + 20 && rightExit) {
      this.loadRoom(rightExit, "fromLeft", playerPosition.y);
    }
  }

  private checkFallDeath(): void {
    if (this.player.getPosition().y > GAME_CONFIG.world.height + 32) {
      void this.handleDeath();
    }
  }

  private async handleDeath(cause?: "paul-crab" | "dave-goat" | "mark-wasp"): Promise<void> {
    if (this.isRespawning || this.runState.status !== "playing") {
      return;
    }

    this.isRespawning = true;
    if (cause === "dave-goat") {
      this.sfx.humanScream();
    } else {
      this.sfx.hurt();
    }
    this.player.setHurt(true);
    this.runState = this.session.loseLife();
    this.refreshUi();

    await new Promise<void>((resolve) => {
      this.time.delayedCall(500, () => resolve());
    });

    if (this.runState.status === "lost") {
      this.scene.start("end", { outcome: "lost", runState: this.runState });
      return;
    }

    this.loadRoom(this.runState.currentRoomId, "default");
    this.isRespawning = false;
  }

  private refreshUi(): void {
    this.hud.render(this.roomRuntime.getRoom().title, this.runState, this.session.totalRelicCount, {
      paused: this.isPaused,
      developerConsoleOpen: this.developerConsole.isConsoleOpen(),
    });

    this.developerConsole.refresh({
      currentRoomId: this.roomRuntime.getRoom().id,
      currentRoomTitle: this.roomRuntime.getRoom().title,
      currentFloor: this.player.getFloorLevel(this.roomRuntime),
      runState: this.runState,
      totalRelics: this.session.totalRelicCount,
    });
  }
}

import Phaser from "phaser";
import { RetroSfx } from "../audio/RetroSfx";
import { GAME_CONFIG } from "../config";
import { getRoomDefinition } from "../data/rooms";
import { DeveloperConsoleController, type DeveloperConsoleCommand } from "../runtime/DeveloperConsoleController";
import { GameSessionBridge } from "../runtime/GameSessionBridge";
import { HudController } from "../runtime/HudController";
import { MusicController } from "../runtime/MusicController";
import { RoomRuntime } from "../runtime/RoomRuntime";
import { SpawnResolver } from "../runtime/SpawnResolver";
import { PlayerActor, type PlayerIntent } from "../runtime/actors/PlayerActor";
import type { DoorwayDefinition, FloorLevel, RoomBackdropDefinition, RoomDefinition, RoomId, RunState, ScenePayload } from "../types";

export class GameScene extends Phaser.Scene {
  private session!: GameSessionBridge;
  private runState!: RunState;
  private player!: PlayerActor;
  private roomRuntime!: RoomRuntime;
  private spawnResolver!: SpawnResolver;
  private hud!: HudController;
  private music!: MusicController;
  private developerConsole!: DeveloperConsoleController;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: Record<
    "left" | "right" | "up" | "down" | "jump" | "pause" | "restart" | "musicMute",
    Phaser.Input.Keyboard.Key
  >;
  private sfx!: RetroSfx;
  private isPaused = false;
  private isRespawning = false;
  private isBonusTransitioning = false;
  private backdropViews: Phaser.GameObjects.GameObject[] = [];
  private transientStatusText: string | null = null;
  private transientStatusUntil = 0;

  constructor() {
    super("game");
  }

  create(data: ScenePayload): void {
    this.session = new GameSessionBridge(data.runState);
    this.runState = this.session.state;
    this.sfx = new RetroSfx(this);
    this.music = new MusicController(this);
    this.spawnResolver = new SpawnResolver();

    this.hud = new HudController(this);
    this.developerConsole = new DeveloperConsoleController(this);
    this.roomRuntime = new RoomRuntime(this);
    this.player = new PlayerActor(this);

    this.createInput();
    this.loadRoom(this.runState.currentRoomId, "default");
    this.publishDebugSnapshot();
    void this.music.startGameplayLoop();

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.music.destroy();
      this.roomRuntime.destroy();
      this.hud.destroy();
      this.developerConsole.destroy();
      this.player.destroy();
      this.clearBackdrop();
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
    if (playerStep.hardLanded) {
      this.cameras.main.shake(60, 0.0022, true);
    }

    this.roomRuntime.update(dtSeconds);
    this.collectRelicOverlaps();
    this.collectBonusPickupOverlaps();
    this.checkDoorwayTransitions();
    this.checkHazardOverlaps();
    this.checkRoomTransitions();
    this.checkFallDeath();

    this.runState = this.session.tick(delta);
    if (this.runState.bonusRound.status === "active" && this.runState.bonusRound.timeRemainingMs === 0) {
      this.exitBonusRound("The music ended. Score what you gathered and run on.");
    }
    this.refreshUi();

    if (this.runState.status === "lost") {
      this.scene.start("end", { outcome: "lost", runState: this.runState });
    }
  }

  private drawBackdrop(room: RoomDefinition): void {
    this.clearBackdrop();

    const { width, height } = this.scale;
    const { farColor, midColor, accentColor, fogColor, silhouette } = room.backdrop;
    const far = this.add.rectangle(width / 2, height / 2, width, height, Phaser.Display.Color.HexStringToColor(farColor).color);
    far.setDepth(-20);
    this.backdropViews.push(far);

    for (let i = 0; i < 4; i += 1) {
      const band = this.add.rectangle(
        120 + i * 260,
        120 + (i % 2) * 18,
        260,
        120,
        Phaser.Display.Color.HexStringToColor(midColor).color,
        0.55,
      );
      band.setAngle(i % 2 === 0 ? -6 : 5);
      band.setDepth(-19);
      this.backdropViews.push(band);
    }

    const accent = Phaser.Display.Color.HexStringToColor(accentColor).color;
    const silhouetteShapes = this.buildBackdropSilhouettes(silhouette, accent);
    silhouetteShapes.forEach((shape) => {
      shape.setDepth(-18);
      this.backdropViews.push(shape);
    });

    const fog = this.add.rectangle(width / 2, height - 118, width, 180, Phaser.Display.Color.HexStringToColor(fogColor).color, 0.18);
    fog.setDepth(-17);
    this.backdropViews.push(fog);
  }

  private buildBackdropSilhouettes(
    silhouette: RoomBackdropDefinition["silhouette"],
    color: number,
  ): Phaser.GameObjects.Shape[] {
    switch (silhouette) {
      case "bridge":
        return [
          this.add.rectangle(160, 190, 220, 46, color, 0.32).setAngle(-8),
          this.add.rectangle(470, 170, 280, 58, color, 0.3).setAngle(5),
          this.add.rectangle(790, 188, 240, 48, color, 0.28).setAngle(-6),
        ];
      case "ruins":
        return [
          this.add.rectangle(180, 228, 120, 160, color, 0.28),
          this.add.rectangle(420, 204, 96, 210, color, 0.3),
          this.add.rectangle(730, 218, 150, 180, color, 0.26),
        ];
      case "idol":
        return [
          this.add.circle(190, 214, 86, color, 0.14),
          this.add.circle(720, 202, 104, color, 0.12),
          this.add.rectangle(500, 180, 180, 90, color, 0.22).setAngle(-4),
        ];
      case "field":
        return [
          this.add.ellipse(180, 408, 360, 96, color, 0.28),
          this.add.ellipse(730, 400, 420, 104, color, 0.24),
          this.add.rectangle(480, 210, 18, 280, 0xe9c46a, 0.95),
          this.add.triangle(470, 112, 0, 20, 70, 0, 70, 40, 0xdb5461, 0.9),
          this.add.rectangle(350, 256, 220, 10, 0xef476f, 0.4).setAngle(-28),
          this.add.rectangle(612, 256, 220, 10, 0x118ab2, 0.4).setAngle(28),
          this.add.rectangle(370, 312, 180, 10, 0xf4d35e, 0.35).setAngle(-18),
          this.add.rectangle(590, 314, 180, 10, 0x80ed99, 0.35).setAngle(18),
        ];
      case "canopy":
      default:
        return [
          this.add.ellipse(160, 160, 240, 120, color, 0.26).setAngle(-10),
          this.add.ellipse(470, 146, 300, 126, color, 0.28).setAngle(6),
          this.add.ellipse(790, 172, 260, 118, color, 0.24).setAngle(-8),
        ];
    }
  }

  private clearBackdrop(): void {
    this.backdropViews.forEach((view) => view.destroy());
    this.backdropViews = [];
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
      musicMute: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.M),
    };

    this.keys.pause.on("down", () => {
      if (this.developerConsole.isConsoleOpen()) {
        return;
      }

      this.isPaused = !this.isPaused;
      if (this.isPaused) {
        this.music.pauseGameplayLoop();
      } else {
        this.music.resumeGameplayLoop();
      }
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
      if (!this.developerConsole.isConsoleOpen()) {
        this.handleMusicKey(event);
      }
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
    spawnOverride?: { x: number; y: number },
  ): void {
    this.runState = this.session.moveToRoom(roomId);
    const room = getRoomDefinition(roomId);
    this.drawBackdrop(room);
    this.roomRuntime.load(room, this.runState.collectedRelicIds);

    this.syncDoorwayStates();
    const spawn = spawnOverride ?? this.spawnResolver.resolveSpawnPoint(room, spawnKey, transitionY, forceFloor);
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
    this.syncDoorwayStates();
    this.sfx.pickup();
    this.refreshUi();

    if (this.runState.status === "won") {
      this.sfx.win();
      this.music.stopGameplayLoop();
      this.scene.start("end", { outcome: "won", runState: this.runState });
    }
  }

  private collectBonusPickupOverlaps(): void {
    if (this.runState.bonusRound.status !== "active") {
      return;
    }

    const pickup = this.roomRuntime.findOverlappingBonusPickup(this.player.getBounds());
    if (!pickup) {
      return;
    }

    this.runState = this.session.collectSpang();
    this.roomRuntime.collectBonusPickup(pickup.id);
    this.sfx.pickup();
    this.refreshUi();

    if (this.runState.bonusRound.spangsCollected >= this.roomRuntime.getRoom().bonusPickups.length) {
      this.exitBonusRound("Every spang is yours. The gate throws you back laughing.");
    }
  }

  private checkDoorwayTransitions(): void {
    if (this.isRespawning || this.isBonusTransitioning) {
      return;
    }

    const doorway = this.roomRuntime.findOverlappingDoorway(this.player.getBounds());
    if (!doorway || !this.isDoorwayActive(doorway)) {
      return;
    }

    this.enterBonusRoom(doorway);
  }

  private checkHazardOverlaps(): void {
    if (this.isRespawning || this.runState.status !== "playing") {
      return;
    }

    const hazard = this.roomRuntime.findOverlappingHazard(this.player.getBounds());
    if (hazard) {
      if (this.runState.bonusRound.status === "active") {
        this.exitBonusRound("A flying cow clipped you out of the round.");
        return;
      }
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
      if (this.runState.bonusRound.status === "active") {
        this.exitBonusRound("You fell out of the field and the gate shut behind you.");
        return;
      }
      void this.handleDeath();
    }
  }

  private enterBonusRoom(doorway: DoorwayDefinition): void {
    if (this.isBonusTransitioning) {
      return;
    }

    this.isBonusTransitioning = true;
    this.runState = this.session.startBonusRound({
      roomId: this.roomRuntime.getRoom().id,
      x: doorway.returnPosition.x,
      y: doorway.returnPosition.y,
    });
    this.loadRoom(doorway.destinationRoomId, "default");
    this.isBonusTransitioning = false;
    this.showTransientStatus("Maypole Spang Run");
  }

  private exitBonusRound(summary: string): void {
    if (this.isBonusTransitioning || this.runState.bonusRound.status !== "active") {
      return;
    }

    const returnContext = this.runState.bonusRound.returnContext;
    if (!returnContext) {
      return;
    }

    this.isBonusTransitioning = true;
    const spangsCollected = this.runState.bonusRound.spangsCollected;
    const scoreCollected = this.runState.bonusRound.scoreCollected;
    this.runState = this.session.completeBonusRound();
    this.loadRoom(returnContext.roomId, "default", undefined, undefined, {
      x: returnContext.x,
      y: returnContext.y,
    });
    this.isBonusTransitioning = false;
    this.showTransientStatus(`${summary} Spangs ${spangsCollected}/12  Score +${scoreCollected}`);
  }

  private async handleDeath(cause?: "paul-crab" | "dave-goat" | "mark-wasp" | "flying-cow"): Promise<void> {
    if (this.isRespawning || this.runState.status !== "playing") {
      return;
    }

    this.isRespawning = true;
    this.cameras.main.shake(150, 0.0055, true);
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
      this.music.stopGameplayLoop();
      this.scene.start("end", { outcome: "lost", runState: this.runState });
      return;
    }

    this.loadRoom(this.runState.currentRoomId, "default");
    this.isRespawning = false;
  }

  private refreshUi(): void {
    const now = this.time.now;
    if (this.transientStatusUntil <= now) {
      this.transientStatusText = null;
    }

    this.hud.render(this.roomRuntime.getRoom().title, this.runState, this.session.totalRelicCount, {
      paused: this.isPaused,
      developerConsoleOpen: this.developerConsole.isConsoleOpen(),
      statusMessage: this.transientStatusUntil > now ? this.transientStatusText : null,
      bonusRound:
        this.runState.bonusRound.status === "active"
          ? {
              active: true,
              spangsCollected: this.runState.bonusRound.spangsCollected,
              totalSpangs: this.roomRuntime.getRoom().bonusPickups.length,
              timeRemainingMs: this.runState.bonusRound.timeRemainingMs,
            }
          : null,
    });

    this.developerConsole.refresh({
      currentRoomId: this.roomRuntime.getRoom().id,
      currentRoomTitle: this.roomRuntime.getRoom().title,
      currentFloor: this.player.getFloorLevel(this.roomRuntime),
      runState: this.runState,
      totalRelics: this.session.totalRelicCount,
    });
    this.publishDebugSnapshot();
  }

  private handleMusicKey(event: KeyboardEvent): void {
    switch (event.code) {
      case "KeyM":
        event.preventDefault();
        this.showTransientStatus(this.music.toggleMute());
        return;
      case "BracketLeft":
        event.preventDefault();
        this.showTransientStatus(this.music.adjustVolume(-GAME_CONFIG.audio.musicVolumeStep));
        return;
      case "BracketRight":
        event.preventDefault();
        this.showTransientStatus(this.music.adjustVolume(GAME_CONFIG.audio.musicVolumeStep));
        return;
      default:
        return;
    }
  }

  private showTransientStatus(text: string): void {
    this.transientStatusText = text;
    this.transientStatusUntil = this.time.now + GAME_CONFIG.audio.musicStatusMessageMs;
  }

  private syncDoorwayStates(): void {
    this.roomRuntime.getRoom().doorways.forEach((doorway) => {
      this.roomRuntime.setDoorwayActive(doorway.id, this.isDoorwayActive(doorway));
    });
  }

  private isDoorwayActive(doorway: DoorwayDefinition): boolean {
    if (doorway.unlockRelicId && !this.session.hasCollectedRelic(doorway.unlockRelicId)) {
      return false;
    }

    if (doorway.oneShot && this.runState.bonusRound.status !== "available") {
      return false;
    }

    return true;
  }

  private publishDebugSnapshot(): void {
    const room = this.roomRuntime.getRoom();
    const playerPosition = this.player.getPosition();
    const snapshot = {
      roomId: room.id,
      roomTitle: room.title,
      player: {
        x: Math.round(playerPosition.x),
        y: Math.round(playerPosition.y),
      },
      run: {
        score: this.runState.score,
        lives: this.runState.lives,
        relicsCollected: this.runState.collectedRelicIds.length,
        timeRemainingMs: this.runState.timeRemainingMs,
        status: this.runState.status,
      },
      bonusRound: {
        ...this.runState.bonusRound,
        activeDoorways: room.doorways.filter((doorway) => this.isDoorwayActive(doorway)).map((doorway) => doorway.id),
        totalSpangs: room.bonusPickups.length,
      },
    };

    window.__DUNGEON_DAN_STATE = snapshot;
    window.render_game_to_text = () => JSON.stringify(snapshot);
  }
}

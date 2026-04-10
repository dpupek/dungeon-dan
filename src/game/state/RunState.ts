import { GAME_CONFIG } from "../config";
import { ROOM_ORDER, getRoomDefinition } from "../data/rooms";
import type { RoomId, RunState } from "../types";

export class RunStateController {
  private state: RunState;

  constructor(initialState?: RunState) {
    this.state = initialState ?? RunStateController.createInitialState();
  }

  static createInitialState(): RunState {
    return {
      currentRoomId: ROOM_ORDER[0],
      lives: GAME_CONFIG.run.lives,
      score: 0,
      timeRemainingMs: GAME_CONFIG.run.timerSeconds * 1000,
      collectedRelicIds: [],
      status: "playing",
    };
  }

  get snapshot(): RunState {
    return {
      ...this.state,
      collectedRelicIds: [...this.state.collectedRelicIds],
    };
  }

  moveToRoom(roomId: RoomId): RunState {
    getRoomDefinition(roomId);
    this.state.currentRoomId = roomId;
    return this.snapshot;
  }

  adjustLives(delta: number): RunState {
    this.state.lives = Math.max(0, this.state.lives + delta);
    this.state.status = this.state.lives === 0 ? "lost" : "playing";
    return this.snapshot;
  }

  adjustTime(deltaMs: number): RunState {
    this.state.timeRemainingMs = Math.max(0, this.state.timeRemainingMs + deltaMs);
    this.state.status = this.state.timeRemainingMs === 0 ? "lost" : "playing";
    return this.snapshot;
  }

  collectRelic(relicId: string): RunState {
    if (!this.state.collectedRelicIds.includes(relicId)) {
      this.state.collectedRelicIds = [...this.state.collectedRelicIds, relicId];
      this.state.score += GAME_CONFIG.run.relicScore;
    }

    if (this.state.collectedRelicIds.length === this.totalRelicCount) {
      this.state.status = "won";
    }

    return this.snapshot;
  }

  collectTreasure(treasureId: string): RunState {
    return this.collectRelic(treasureId);
  }

  tick(deltaMs: number): RunState {
    if (this.state.status !== "playing") {
      return this.snapshot;
    }

    this.state.timeRemainingMs = Math.max(0, this.state.timeRemainingMs - deltaMs);
    if (this.state.timeRemainingMs === 0) {
      this.state.status = "lost";
    }

    return this.snapshot;
  }

  loseLife(): RunState {
    this.state.lives -= 1;
    if (this.state.lives <= 0) {
      this.state.lives = 0;
      this.state.status = "lost";
    }
    return this.snapshot;
  }

  hasCollectedRelic(relicId: string): boolean {
    return this.state.collectedRelicIds.includes(relicId);
  }

  hasCollected(treasureId: string): boolean {
    return this.hasCollectedRelic(treasureId);
  }

  get totalRelicCount(): number {
    return ROOM_ORDER.reduce((count, roomId) => count + getRoomDefinition(roomId).relics.length, 0);
  }

  get totalTreasureCount(): number {
    return this.totalRelicCount;
  }
}

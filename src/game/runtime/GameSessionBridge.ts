import { RunStateController } from "../state/RunState";
import type { RoomId, RunState } from "../types";

export class GameSessionBridge {
  private readonly controller: RunStateController;

  constructor(initialState?: RunState) {
    this.controller = new RunStateController(initialState);
  }

  get state(): RunState {
    return this.controller.snapshot;
  }

  moveToRoom(roomId: RoomId): RunState {
    return this.controller.moveToRoom(roomId);
  }

  collectRelic(relicId: string): RunState {
    return this.controller.collectRelic(relicId);
  }

  tick(deltaMs: number): RunState {
    return this.controller.tick(deltaMs);
  }

  loseLife(): RunState {
    return this.controller.loseLife();
  }

  adjustLives(delta: number): RunState {
    return this.controller.adjustLives(delta);
  }

  adjustTime(deltaMs: number): RunState {
    return this.controller.adjustTime(deltaMs);
  }

  hasCollectedRelic(relicId: string): boolean {
    return this.controller.hasCollectedRelic(relicId);
  }

  get totalRelicCount(): number {
    return this.controller.totalRelicCount;
  }
}

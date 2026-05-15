import type { StoryBeatDefinition, StoryLineBeatDefinition, StorySequenceDefinition } from "../../types";

export interface ActiveStoryPresentation {
  speakerName: string;
  text: string;
  portraitLabel: string;
  skippable: boolean;
}

export type StoryFlowAction =
  | { type: "none" }
  | { type: "camera-focus"; x: number; y: number; durationMs?: number }
  | { type: "grant-relic"; relicId: string }
  | { type: "sequence-ended"; sequenceId: string };

interface ActiveStoryState {
  sequence: StorySequenceDefinition;
  beatIndex: number;
  pauseRemainingMs: number;
  currentLine: StoryLineBeatDefinition | null;
}

export class StoryFlowController {
  private activeState: ActiveStoryState | null = null;

  constructor(private readonly sequences: Record<string, StorySequenceDefinition>) {}

  isActive(): boolean {
    return this.activeState !== null;
  }

  getPresentation(): ActiveStoryPresentation | null {
    if (!this.activeState?.currentLine) {
      return null;
    }

    const line = this.activeState.currentLine;
    return {
      speakerName: line.speakerName,
      text: line.text,
      portraitLabel: line.portraitKey ?? line.speakerName.slice(0, 2).toUpperCase(),
      skippable: this.activeState.sequence.skippable !== false,
    };
  }

  startSequence(sequenceId: string): StoryFlowAction[] {
    const sequence = this.sequences[sequenceId];
    if (!sequence) {
      return [{ type: "none" }];
    }

    this.activeState = {
      sequence,
      beatIndex: 0,
      pauseRemainingMs: 0,
      currentLine: null,
    };

    return this.processCurrentBeat();
  }

  advance(): StoryFlowAction[] {
    if (!this.activeState) {
      return [{ type: "none" }];
    }

    if (!this.activeState.currentLine) {
      return [{ type: "none" }];
    }

    this.activeState.currentLine = null;
    this.activeState.beatIndex += 1;
    return this.processCurrentBeat();
  }

  update(deltaMs: number): StoryFlowAction[] {
    if (!this.activeState || this.activeState.pauseRemainingMs <= 0) {
      return [{ type: "none" }];
    }

    this.activeState.pauseRemainingMs = Math.max(0, this.activeState.pauseRemainingMs - deltaMs);
    if (this.activeState.pauseRemainingMs > 0) {
      return [{ type: "none" }];
    }

    this.activeState.beatIndex += 1;
    return this.processCurrentBeat();
  }

  skip(): StoryFlowAction[] {
    if (!this.activeState || this.activeState.sequence.skippable === false) {
      return [{ type: "none" }];
    }

    const actions: StoryFlowAction[] = [];
    while (this.activeState) {
      const beat = this.activeState.sequence.beats[this.activeState.beatIndex];
      if (!beat) {
        actions.push(...this.finishSequence());
        break;
      }

      if (beat.type === "grant-relic") {
        actions.push({ type: "grant-relic", relicId: beat.relicId });
      } else if (beat.type === "camera-focus") {
        actions.push({ type: "camera-focus", x: beat.x, y: beat.y, durationMs: beat.durationMs });
      } else if (beat.type === "end") {
        actions.push(...this.finishSequence());
        break;
      }

      this.activeState.beatIndex += 1;
    }

    return actions.length > 0 ? actions : [{ type: "none" }];
  }

  private processCurrentBeat(): StoryFlowAction[] {
    if (!this.activeState) {
      return [{ type: "none" }];
    }

    const actions: StoryFlowAction[] = [];

    while (this.activeState) {
      const beat: StoryBeatDefinition | undefined = this.activeState.sequence.beats[this.activeState.beatIndex];
      if (!beat) {
        actions.push(...this.finishSequence());
        break;
      }

      switch (beat.type) {
        case "line":
          this.activeState.currentLine = beat;
          return actions.length > 0 ? actions : [{ type: "none" }];
        case "pause":
          this.activeState.pauseRemainingMs = beat.durationMs;
          return actions.length > 0 ? actions : [{ type: "none" }];
        case "camera-focus":
          actions.push({ type: "camera-focus", x: beat.x, y: beat.y, durationMs: beat.durationMs });
          this.activeState.beatIndex += 1;
          continue;
        case "grant-relic":
          actions.push({ type: "grant-relic", relicId: beat.relicId });
          this.activeState.beatIndex += 1;
          continue;
        case "end":
          actions.push(...this.finishSequence());
          break;
        default:
          this.activeState.beatIndex += 1;
          continue;
      }
    }

    return actions.length > 0 ? actions : [{ type: "none" }];
  }

  private finishSequence(): StoryFlowAction[] {
    if (!this.activeState) {
      return [{ type: "none" }];
    }

    const sequenceId = this.activeState.sequence.id;
    this.activeState = null;
    return [{ type: "sequence-ended", sequenceId }];
  }
}

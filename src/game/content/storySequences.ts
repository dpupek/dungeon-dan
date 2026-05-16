import type { StorySequenceDefinition } from "../types";

export const STORY_SEQUENCES: Record<string, StorySequenceDefinition> = {
  "stormshaft-bow-intro": {
    id: "stormshaft-bow-intro",
    skippable: true,
    beats: [
      {
        type: "line",
        speakerId: "steward-echo",
        speakerName: "Steward Echo",
        portraitKey: "SE",
        text: "The Stormshaft Bow belongs to the patient hand, not the hurried one.",
      },
      {
        type: "line",
        speakerId: "steward-echo",
        speakerName: "Steward Echo",
        portraitKey: "SE",
        text: "Watch the lanes. Wait for the clean opening. Move only when the range gives leave.",
      },
      { type: "end" },
    ],
  },
  "stormshaft-bow-outro": {
    id: "stormshaft-bow-outro",
    skippable: true,
    beats: [
      {
        type: "line",
        speakerId: "steward-echo",
        speakerName: "Steward Echo",
        portraitKey: "SE",
        text: "You did not snatch. You waited, judged, and loosed true.",
      },
      { type: "grant-relic", relicId: "stormshaft-bow" },
      {
        type: "line",
        speakerId: "steward-echo",
        speakerName: "Steward Echo",
        portraitKey: "SE",
        text: "Take the Stormshaft Bow, and carry Namron's patience with it.",
      },
      { type: "end" },
    ],
  },
  "three-black-axes-intro": {
    id: "three-black-axes-intro",
    skippable: true,
    beats: [
      {
        type: "line",
        speakerId: "steward-echo",
        speakerName: "Steward Echo",
        portraitKey: "SE",
        text: "The Three Black Axes do not honor flinching. They ask for a line, a choice, and the nerve to keep it.",
      },
      { type: "camera-focus", x: 760, y: 270, durationMs: 320 },
      { type: "pause", durationMs: 300 },
      {
        type: "line",
        speakerId: "steward-echo",
        speakerName: "Steward Echo",
        portraitKey: "SE",
        text: "Read the crossings. Step into one lane, then commit before the court closes it.",
      },
      { type: "end" },
    ],
  },
  "three-black-axes-outro": {
    id: "three-black-axes-outro",
    skippable: true,
    beats: [
      {
        type: "line",
        speakerId: "steward-echo",
        speakerName: "Steward Echo",
        portraitKey: "SE",
        text: "You did not scatter your will. You chose the cut and carried it through.",
      },
      { type: "grant-relic", relicId: "three-black-axes" },
      {
        type: "line",
        speakerId: "steward-echo",
        speakerName: "Steward Echo",
        portraitKey: "SE",
        text: "Take the Three Black Axes, and remember that precision is courage made visible.",
      },
      { type: "end" },
    ],
  },
};

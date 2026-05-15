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
};

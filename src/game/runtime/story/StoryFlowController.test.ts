import { describe, expect, it } from "vitest";
import { STORY_SEQUENCES } from "../../content/storySequences";
import { StoryFlowController } from "./StoryFlowController";

describe("StoryFlowController", () => {
  it("presents line beats and ends a linear sequence on advance", () => {
    const controller = new StoryFlowController(STORY_SEQUENCES);

    controller.startSequence("stormshaft-bow-intro");

    expect(controller.isActive()).toBe(true);
    expect(controller.getPresentation()?.speakerName).toBe("Steward Echo");

    controller.advance();
    expect(controller.getPresentation()?.text).toContain("Watch the lanes");

    const actions = controller.advance();
    expect(actions).toEqual([{ type: "sequence-ended", sequenceId: "stormshaft-bow-intro" }]);
    expect(controller.isActive()).toBe(false);
  });

  it("applies grant-relic actions when a skippable sequence is skipped", () => {
    const controller = new StoryFlowController(STORY_SEQUENCES);

    controller.startSequence("stormshaft-bow-outro");
    const actions = controller.skip();

    expect(actions).toContainEqual({ type: "grant-relic", relicId: "stormshaft-bow" });
    expect(actions).toContainEqual({ type: "sequence-ended", sequenceId: "stormshaft-bow-outro" });
    expect(controller.isActive()).toBe(false);
  });

  it("processes camera-focus and pause beats before the next line", () => {
    const controller = new StoryFlowController(STORY_SEQUENCES);

    const startActions = controller.startSequence("three-black-axes-intro");

    expect(startActions).toEqual([{ type: "none" }]);
    expect(controller.getPresentation()?.text).toContain("do not honor flinching");

    const focusActions = controller.advance();
    expect(focusActions).toContainEqual({ type: "camera-focus", x: 760, y: 270, durationMs: 320 });
    expect(controller.getPresentation()).toBeNull();

    expect(controller.update(150)).toEqual([{ type: "none" }]);
    const lineActions = controller.update(200);
    expect(lineActions).toEqual([{ type: "none" }]);
    expect(controller.getPresentation()?.text).toContain("Read the crossings");
  });
});

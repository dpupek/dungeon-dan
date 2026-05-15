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
});

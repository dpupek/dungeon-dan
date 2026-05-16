import { describe, expect, it } from "vitest";
import { ROOM_ORDER } from "../data/rooms";
import { RunStateController } from "./RunState";

describe("RunStateController", () => {
  it("starts in the first room with fresh run stats", () => {
    const controller = new RunStateController();
    const state = controller.snapshot;

    expect(state.currentRoomId).toBe(ROOM_ORDER[0]);
    expect(state.lives).toBe(3);
    expect(state.score).toBe(0);
    expect(state.completedStoryTriggerIds).toEqual([]);
    expect(state.bonusRound.status).toBe("locked");
    expect(state.status).toBe("playing");
  });

  it("collects relics once and wins after all relics are found", () => {
    const controller = new RunStateController();
    const ids = [
      "jade-mask",
      "sun-disc",
      "amber-idol",
      "moon-gem",
      "fossil-shell",
      "sky-crown",
      "stormshaft-bow",
      "three-black-axes",
    ];

    ids.forEach((id) => controller.collectRelic(id));

    const state = controller.snapshot;
    expect(state.collectedRelicIds).toHaveLength(ids.length);
    expect(state.score).toBe(250 * ids.length);
    expect(state.status).toBe("won");
  });

  it("counts down time and loses when it reaches zero", () => {
    const controller = new RunStateController();

    controller.tick(140_000);

    expect(controller.snapshot.timeRemainingMs).toBe(0);
    expect(controller.snapshot.status).toBe("lost");
  });

  it("drops lives and loses the run at zero", () => {
    const controller = new RunStateController();

    controller.loseLife();
    controller.loseLife();
    controller.loseLife();

    expect(controller.snapshot.lives).toBe(0);
    expect(controller.snapshot.status).toBe("lost");
  });

  it("moves between rooms without resetting collected state", () => {
    const controller = new RunStateController();

    controller.collectRelic("jade-mask");
    controller.moveToRoom("monkey-step");

    expect(controller.snapshot.currentRoomId).toBe("monkey-step");
    expect(controller.snapshot.collectedRelicIds).toEqual(["jade-mask"]);
  });

  it("ignores duplicate relic pickups", () => {
    const controller = new RunStateController();

    controller.collectRelic("jade-mask");
    controller.collectRelic("jade-mask");

    expect(controller.snapshot.collectedRelicIds).toEqual(["jade-mask"]);
    expect(controller.snapshot.score).toBe(250);
  });

  it("unlocks the bonus round after the flying cow token is collected", () => {
    const controller = new RunStateController();

    controller.collectRelic("fossil-shell");

    expect(controller.snapshot.bonusRound.status).toBe("available");
  });

  it("tracks an active bonus round and returns to completed after it ends", () => {
    const controller = new RunStateController();

    controller.collectRelic("fossil-shell");
    controller.startBonusRound({ roomId: "fossil-stair", x: 260, y: 372 });

    expect(controller.snapshot.bonusRound.status).toBe("active");
    expect(controller.snapshot.bonusRound.returnContext).toEqual({
      roomId: "fossil-stair",
      x: 260,
      y: 372,
    });

    controller.completeBonusRound();

    expect(controller.snapshot.bonusRound.status).toBe("completed");
    expect(controller.snapshot.bonusRound.returnContext).toBeNull();
  });

  it("adds spang score without changing lives or relic count", () => {
    const controller = new RunStateController();

    controller.collectRelic("fossil-shell");
    controller.startBonusRound({ roomId: "fossil-stair", x: 260, y: 372 });
    controller.collectSpang();
    controller.collectSpang();

    expect(controller.snapshot.score).toBe(250 + 200);
    expect(controller.snapshot.lives).toBe(3);
    expect(controller.snapshot.collectedRelicIds).toEqual(["fossil-shell"]);
    expect(controller.snapshot.bonusRound.spangsCollected).toBe(2);
  });

  it("does not allow the bonus round to restart after completion", () => {
    const controller = new RunStateController();

    controller.collectRelic("fossil-shell");
    controller.startBonusRound({ roomId: "fossil-stair", x: 260, y: 372 });
    controller.completeBonusRound();
    controller.startBonusRound({ roomId: "fossil-stair", x: 260, y: 360 });

    expect(controller.snapshot.bonusRound.status).toBe("completed");
  });

  it("tracks completed story triggers once per run", () => {
    const controller = new RunStateController();

    controller.completeStoryTrigger("stormshaft-range-intro-trigger");
    controller.completeStoryTrigger("black-axes-yard-intro-trigger");
    controller.completeStoryTrigger("stormshaft-range-intro-trigger");

    expect(controller.snapshot.completedStoryTriggerIds).toEqual([
      "stormshaft-range-intro-trigger",
      "black-axes-yard-intro-trigger",
    ]);
    expect(controller.hasCompletedStoryTrigger("stormshaft-range-intro-trigger")).toBe(true);
  });
});

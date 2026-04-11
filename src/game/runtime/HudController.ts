import type Phaser from "phaser";
import { GAME_CONFIG } from "../config";
import type { RunState } from "../types";

export class HudController {
  private readonly panel: Phaser.GameObjects.Rectangle;
  private readonly divider: Phaser.GameObjects.Rectangle;
  private readonly roomLabel: Phaser.GameObjects.Text;
  private readonly hudLabel: Phaser.GameObjects.Text;
  private readonly statusLabel: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.panel = scene.add.rectangle(GAME_CONFIG.world.width / 2, 42, GAME_CONFIG.world.width - 32, 62, 0x0b132b, 0.68);
    this.panel.setStrokeStyle(2, 0xf4d35e, 0.25);
    this.panel.setDepth(20);

    this.divider = scene.add.rectangle(GAME_CONFIG.world.width / 2, 58, GAME_CONFIG.world.width - 72, 1, 0xf4d35e, 0.18);
    this.divider.setDepth(21);

    this.roomLabel = scene.add.text(24, 20, "", {
      fontFamily: "Courier New",
      fontSize: "18px",
      color: GAME_CONFIG.palette.text,
    });
    this.roomLabel.setDepth(22);

    this.hudLabel = scene.add.text(24, 48, "", {
      fontFamily: "Courier New",
      fontSize: "19px",
      color: "#f4d35e",
    });
    this.hudLabel.setDepth(22);

    this.statusLabel = scene.add.text(GAME_CONFIG.world.width - 24, 20, "", {
      fontFamily: "Courier New",
      fontSize: "18px",
      color: GAME_CONFIG.palette.text,
    });
    this.statusLabel.setOrigin(1, 0);
    this.statusLabel.setDepth(22);
  }

  render(
    roomTitle: string,
    runState: RunState,
    totalRelics: number,
    uiState: { paused: boolean; developerConsoleOpen: boolean; statusMessage?: string | null },
  ): void {
    const seconds = Math.ceil(runState.timeRemainingMs / 1000);
    this.roomLabel.setText(roomTitle);
    this.hudLabel.setText(
      `Score ${runState.score}   Lives ${runState.lives}   Clams ${runState.collectedRelicIds.length}/${totalRelics}   Time ${seconds}`,
    );
    if (uiState.developerConsoleOpen) {
      this.statusLabel.setText("Dev Console Open");
    } else if (uiState.statusMessage) {
      this.statusLabel.setText(uiState.statusMessage);
    } else {
      this.statusLabel.setText(uiState.paused ? "Paused" : "P pause  R restart");
    }
  }

  destroy(): void {
    this.panel.destroy();
    this.divider.destroy();
    this.roomLabel.destroy();
    this.hudLabel.destroy();
    this.statusLabel.destroy();
  }
}

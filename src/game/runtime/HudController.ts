import type Phaser from "phaser";
import { GAME_CONFIG } from "../config";
import type { RunState } from "../types";

export class HudController {
  private readonly roomLabel: Phaser.GameObjects.Text;
  private readonly hudLabel: Phaser.GameObjects.Text;
  private readonly statusLabel: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.roomLabel = scene.add.text(24, 20, "", {
      fontFamily: "Courier New",
      fontSize: "18px",
      color: GAME_CONFIG.palette.text,
    });

    this.hudLabel = scene.add.text(24, 48, "", {
      fontFamily: "Courier New",
      fontSize: "20px",
      color: "#f4d35e",
    });

    this.statusLabel = scene.add.text(GAME_CONFIG.world.width - 24, 20, "", {
      fontFamily: "Courier New",
      fontSize: "18px",
      color: GAME_CONFIG.palette.text,
    });
    this.statusLabel.setOrigin(1, 0);
  }

  render(
    roomTitle: string,
    runState: RunState,
    totalRelics: number,
    uiState: { paused: boolean; developerConsoleOpen: boolean },
  ): void {
    const seconds = Math.ceil(runState.timeRemainingMs / 1000);
    this.roomLabel.setText(roomTitle);
    this.hudLabel.setText(
      `Score ${runState.score}   Lives ${runState.lives}   Clams ${runState.collectedRelicIds.length}/${totalRelics}   Time ${seconds}`,
    );
    if (uiState.developerConsoleOpen) {
      this.statusLabel.setText("Dev Console Open");
    } else {
      this.statusLabel.setText(uiState.paused ? "Paused" : "P pause  R restart");
    }
  }

  destroy(): void {
    this.roomLabel.destroy();
    this.hudLabel.destroy();
    this.statusLabel.destroy();
  }
}

import type Phaser from "phaser";
import { GAME_CONFIG } from "../../config";
import type { ActiveStoryPresentation } from "./StoryFlowController";

export class DialogueOverlayController {
  private readonly panel: Phaser.GameObjects.Rectangle;
  private readonly portraitFrame: Phaser.GameObjects.Rectangle;
  private readonly portraitLabel: Phaser.GameObjects.Text;
  private readonly speakerLabel: Phaser.GameObjects.Text;
  private readonly bodyLabel: Phaser.GameObjects.Text;
  private readonly promptLabel: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    const width = GAME_CONFIG.world.width;
    const height = GAME_CONFIG.world.height;

    this.panel = scene.add.rectangle(width / 2, height - 82, 820, 116, 0x0b132b, 0.84);
    this.panel.setStrokeStyle(3, 0xf4d35e, 0.55);
    this.panel.setDepth(30);
    this.panel.setVisible(false);

    this.portraitFrame = scene.add.rectangle(114, height - 82, 66, 66, 0x1d3557, 0.92);
    this.portraitFrame.setStrokeStyle(2, 0xf4d35e, 0.55);
    this.portraitFrame.setDepth(31);
    this.portraitFrame.setVisible(false);

    this.portraitLabel = scene.add.text(114, height - 92, "", {
      fontFamily: "Georgia",
      fontSize: "22px",
      color: "#fefae0",
      align: "center",
    });
    this.portraitLabel.setOrigin(0.5);
    this.portraitLabel.setDepth(32);
    this.portraitLabel.setVisible(false);

    this.speakerLabel = scene.add.text(164, height - 124, "", {
      fontFamily: "Georgia",
      fontSize: "20px",
      color: "#f4d35e",
      stroke: "#0b132b",
      strokeThickness: 4,
    });
    this.speakerLabel.setDepth(32);
    this.speakerLabel.setVisible(false);

    this.bodyLabel = scene.add.text(164, height - 98, "", {
      fontFamily: "Courier New",
      fontSize: "19px",
      color: GAME_CONFIG.palette.text,
      wordWrap: { width: 620 },
      maxLines: 3,
      lineSpacing: 6,
    });
    this.bodyLabel.setDepth(32);
    this.bodyLabel.setVisible(false);

    this.promptLabel = scene.add.text(width - 90, height - 34, "", {
      fontFamily: "Courier New",
      fontSize: "16px",
      color: "#ffe082",
      align: "right",
    });
    this.promptLabel.setOrigin(1, 0.5);
    this.promptLabel.setDepth(32);
    this.promptLabel.setVisible(false);
  }

  render(model: ActiveStoryPresentation | null): void {
    const visible = model !== null;
    this.panel.setVisible(visible);
    this.portraitFrame.setVisible(visible);
    this.portraitLabel.setVisible(visible);
    this.speakerLabel.setVisible(visible);
    this.bodyLabel.setVisible(visible);
    this.promptLabel.setVisible(visible);

    if (!model) {
      return;
    }

    this.portraitLabel.setText(model.portraitLabel);
    this.speakerLabel.setText(model.speakerName);
    this.bodyLabel.setText(model.text);
    this.promptLabel.setText(model.skippable ? "Enter advance   Esc skip" : "Enter advance");
  }

  destroy(): void {
    this.panel.destroy();
    this.portraitFrame.destroy();
    this.portraitLabel.destroy();
    this.speakerLabel.destroy();
    this.bodyLabel.destroy();
    this.promptLabel.destroy();
  }
}

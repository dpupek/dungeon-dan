import Phaser from "phaser";
import { GAME_CONFIG } from "../config";
import { ROOM_ORDER, getRoomDefinition } from "../data/rooms";
import type { EndScenePayload } from "../types";

export class EndScene extends Phaser.Scene {
  constructor() {
    super("end");
  }

  create(data: EndScenePayload): void {
    const { width, height } = this.scale;
    const didWin = data.outcome === "won";
    const totalRelicCount = ROOM_ORDER.reduce(
      (count, roomId) => count + getRoomDefinition(roomId).relics.length,
      0,
    );

    this.add.rectangle(width / 2, height / 2, width, height, 0x0b132b);
    this.add
      .text(width / 2, 140, didWin ? "Storm Restored" : "Storm Lost", {
        fontFamily: "Courier New",
        fontSize: "42px",
        color: didWin ? GAME_CONFIG.palette.treasure : GAME_CONFIG.palette.scorpion,
      })
      .setOrigin(0.5);

    this.add
      .text(
        width / 2,
        250,
        `Score ${data.runState.score}\nRelics ${data.runState.collectedRelicIds.length}/${totalRelicCount}\nLives ${data.runState.lives}`,
        {
          fontFamily: "Courier New",
          fontSize: "24px",
          align: "center",
          color: GAME_CONFIG.palette.text,
        },
      )
      .setOrigin(0.5);

    this.add
      .text(
        width / 2,
        390,
        didWin
          ? "The Sable Storm rises again; the relics of Namron are returned."
          : "The storm keeps its memories for now.",
        {
          fontFamily: "Courier New",
          fontSize: "22px",
          align: "center",
          color: GAME_CONFIG.palette.text,
        },
      )
      .setOrigin(0.5);

    this.add
      .text(width / 2, 470, "Press R to retry or T for title", {
        fontFamily: "Courier New",
        fontSize: "22px",
        color: "#f4d35e",
      })
      .setOrigin(0.5);

    this.input.keyboard?.on("keydown-R", () => this.scene.start("game"));
    this.input.keyboard?.on("keydown-T", () => this.scene.start("title"));
  }
}

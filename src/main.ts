import Phaser from "phaser";
import "./styles.css";
import { GAME_CONFIG } from "./game/config";
import { BootScene } from "./game/scenes/BootScene";
import { EndScene } from "./game/scenes/EndScene";
import { GameScene } from "./game/scenes/GameScene";
import { TitleScene } from "./game/scenes/TitleScene";

declare global {
  interface Window {
    __DUNGEON_DAN_GAME?: Phaser.Game;
    __DUNGEON_DAN_STATE?: unknown;
    render_game_to_text?: () => string;
    advanceTime?: (ms: number) => Promise<void>;
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_CONFIG.world.width,
  height: GAME_CONFIG.world.height,
  parent: "app",
  backgroundColor: GAME_CONFIG.palette.sky,
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: GAME_CONFIG.physics.gravityY },
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, TitleScene, GameScene, EndScene],
};

const game = new Phaser.Game(config);
if (import.meta.env.DEV) {
  window.__DUNGEON_DAN_GAME = game;
  window.advanceTime = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));
}

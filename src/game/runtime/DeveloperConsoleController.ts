import type Phaser from "phaser";
import { ROOM_ORDER, getRoomDefinition } from "../data/rooms";
import { GAME_CONFIG } from "../config";
import type { FloorLevel, RoomId, RunState } from "../types";

export type DeveloperConsoleCommand =
  | { type: "adjust-lives"; delta: number }
  | { type: "adjust-time"; deltaMs: number }
  | { type: "jump"; roomId: RoomId; floor: FloorLevel }
  | { type: "restart-room"; floor: FloorLevel }
  | { type: "none" };

interface DeveloperConsoleContext {
  currentRoomId: RoomId;
  currentRoomTitle: string;
  currentFloor: FloorLevel;
  runState: RunState;
  totalRelics: number;
}

export class DeveloperConsoleController {
  private readonly panel: Phaser.GameObjects.Rectangle;
  private readonly text: Phaser.GameObjects.Text;
  private isOpen = false;
  private selectedRoomIndex = 0;
  private selectedFloor: FloorLevel = "ground";

  constructor(scene: Phaser.Scene) {
    this.panel = scene.add.rectangle(
      GAME_CONFIG.world.width / 2,
      GAME_CONFIG.world.height / 2,
      620,
      280,
      0x0b132b,
      0.9,
    );
    this.panel.setStrokeStyle(3, 0xf4d35e, 0.7);
    this.panel.setDepth(50);
    this.panel.setVisible(false);

    this.text = scene.add.text(180, 162, "", {
      fontFamily: "Courier New",
      fontSize: "18px",
      color: "#fefae0",
      lineSpacing: 8,
    });
    this.text.setDepth(51);
    this.text.setVisible(false);
  }

  handleKey(event: KeyboardEvent, context: DeveloperConsoleContext): DeveloperConsoleCommand {
    if (event.code === "Backquote") {
      event.preventDefault();
      this.toggle(context);
      return { type: "none" };
    }

    if (!this.isOpen) {
      return { type: "none" };
    }

    switch (event.code) {
      case "BracketLeft":
        event.preventDefault();
        this.selectedRoomIndex = (this.selectedRoomIndex + ROOM_ORDER.length - 1) % ROOM_ORDER.length;
        break;
      case "BracketRight":
        event.preventDefault();
        this.selectedRoomIndex = (this.selectedRoomIndex + 1) % ROOM_ORDER.length;
        break;
      case "KeyG":
        event.preventDefault();
        this.selectedFloor = "ground";
        break;
      case "KeyB":
        event.preventDefault();
        this.selectedFloor = "basement";
        break;
      case "KeyL":
        event.preventDefault();
        this.refresh(context);
        return { type: "adjust-lives", delta: event.shiftKey ? -1 : 1 };
      case "KeyT":
        event.preventDefault();
        this.refresh(context);
        return { type: "adjust-time", deltaMs: event.shiftKey ? -30000 : 30000 };
      case "Enter":
        event.preventDefault();
        return { type: "jump", roomId: ROOM_ORDER[this.selectedRoomIndex], floor: this.selectedFloor };
      case "KeyR":
        event.preventDefault();
        return { type: "restart-room", floor: context.currentFloor };
      default:
        break;
    }

    this.refresh(context);
    return { type: "none" };
  }

  refresh(context: DeveloperConsoleContext): void {
    if (!this.isOpen) {
      return;
    }

    const selectedRoomId = ROOM_ORDER[this.selectedRoomIndex];
    const selectedRoom = getRoomDefinition(selectedRoomId);
    const currentFloorLabel = context.currentFloor === "ground" ? "Ground Floor" : "Basement";
    const selectedFloorLabel = this.selectedFloor === "ground" ? "Ground Floor" : "Basement";
    const seconds = Math.ceil(context.runState.timeRemainingMs / 1000);

    this.text.setText(
      [
        "Developer Console",
        "",
        `Current Room: ${context.currentRoomTitle} (${context.currentRoomId})`,
        `Current Floor: ${currentFloorLabel}`,
        `Lives: ${context.runState.lives}   Score: ${context.runState.score}`,
        `Clams: ${context.runState.collectedRelicIds.length}/${context.totalRelics}   Time: ${seconds}s`,
        "",
        `Selected Room: ${selectedRoom.title} (${selectedRoom.id})`,
        `Selected Spawn Floor: ${selectedFloorLabel}`,
        "",
        "[ / ] cycle room   G ground floor   B basement",
        "L add life   Shift+L remove life",
        "T add 30s   Shift+T remove 30s",
        "Enter jump to room   R restart room",
        "` close console",
      ].join("\n"),
    );
  }

  isConsoleOpen(): boolean {
    return this.isOpen;
  }

  destroy(): void {
    this.panel.destroy();
    this.text.destroy();
  }

  private toggle(context: DeveloperConsoleContext): void {
    this.isOpen = !this.isOpen;
    this.selectedRoomIndex = ROOM_ORDER.indexOf(context.currentRoomId);
    this.selectedFloor = context.currentFloor;
    this.panel.setVisible(this.isOpen);
    this.text.setVisible(this.isOpen);
    this.refresh(context);
  }
}

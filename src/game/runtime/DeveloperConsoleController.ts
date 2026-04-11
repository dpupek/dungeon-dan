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
  private static readonly PANEL_WIDTH = 660;
  private static readonly PANEL_HEIGHT = 338;
  private static readonly INFO_PANEL_WIDTH = 592;
  private static readonly INFO_PANEL_HEIGHT = 162;
  private static readonly CONTROLS_PANEL_WIDTH = 592;
  private static readonly CONTROLS_PANEL_HEIGHT = 98;
  private static readonly INFO_PANEL_LEFT =
    GAME_CONFIG.world.width / 2 - DeveloperConsoleController.INFO_PANEL_WIDTH / 2;
  private static readonly INFO_PANEL_TOP = 230 - DeveloperConsoleController.INFO_PANEL_HEIGHT / 2;
  private static readonly CONTROLS_PANEL_LEFT =
    GAME_CONFIG.world.width / 2 - DeveloperConsoleController.CONTROLS_PANEL_WIDTH / 2;
  private static readonly CONTROLS_PANEL_TOP = 362 - DeveloperConsoleController.CONTROLS_PANEL_HEIGHT / 2;
  private static readonly PANEL_PADDING_X = 18;
  private static readonly PANEL_PADDING_Y = 14;

  private readonly panel: Phaser.GameObjects.Rectangle;
  private readonly infoPanel: Phaser.GameObjects.Rectangle;
  private readonly controlsPanel: Phaser.GameObjects.Rectangle;
  private readonly infoText: Phaser.GameObjects.Text;
  private readonly controlsText: Phaser.GameObjects.Text;
  private readonly scrollHintText: Phaser.GameObjects.Text;
  private readonly scene: Phaser.Scene;
  private isOpen = false;
  private selectedRoomIndex = 0;
  private selectedFloor: FloorLevel = "ground";
  private infoScrollIndex = 0;
  private readonly visibleInfoLines = 7;
  private lastContext: DeveloperConsoleContext | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.panel = scene.add.rectangle(
      GAME_CONFIG.world.width / 2,
      GAME_CONFIG.world.height / 2,
      DeveloperConsoleController.PANEL_WIDTH,
      DeveloperConsoleController.PANEL_HEIGHT,
      0x0b132b,
      0.9,
    );
    this.panel.setStrokeStyle(3, 0xf4d35e, 0.7);
    this.panel.setDepth(50);
    this.panel.setVisible(false);

    this.infoPanel = scene.add.rectangle(
      GAME_CONFIG.world.width / 2,
      230,
      DeveloperConsoleController.INFO_PANEL_WIDTH,
      DeveloperConsoleController.INFO_PANEL_HEIGHT,
      0x102040,
      0.7,
    );
    this.infoPanel.setStrokeStyle(1, 0xf4d35e, 0.35);
    this.infoPanel.setDepth(51);
    this.infoPanel.setVisible(false);

    this.controlsPanel = scene.add.rectangle(
      GAME_CONFIG.world.width / 2,
      362,
      DeveloperConsoleController.CONTROLS_PANEL_WIDTH,
      DeveloperConsoleController.CONTROLS_PANEL_HEIGHT,
      0x081629,
      0.84,
    );
    this.controlsPanel.setStrokeStyle(1, 0xf4d35e, 0.35);
    this.controlsPanel.setDepth(51);
    this.controlsPanel.setVisible(false);

    this.infoText = scene.add.text(
      DeveloperConsoleController.INFO_PANEL_LEFT + DeveloperConsoleController.PANEL_PADDING_X,
      DeveloperConsoleController.INFO_PANEL_TOP + DeveloperConsoleController.PANEL_PADDING_Y + 18,
      "",
      {
      fontFamily: "Courier New",
      fontSize: "15px",
      color: "#fefae0",
      lineSpacing: 6,
      },
    );
    this.infoText.setDepth(52);
    this.infoText.setVisible(false);

    this.controlsText = scene.add.text(
      DeveloperConsoleController.CONTROLS_PANEL_LEFT + DeveloperConsoleController.PANEL_PADDING_X,
      DeveloperConsoleController.CONTROLS_PANEL_TOP + DeveloperConsoleController.PANEL_PADDING_Y,
      "",
      {
      fontFamily: "Courier New",
      fontSize: "15px",
      color: "#f4d35e",
      lineSpacing: 5,
      },
    );
    this.controlsText.setDepth(52);
    this.controlsText.setVisible(false);

    this.scrollHintText = scene.add.text(
      DeveloperConsoleController.INFO_PANEL_LEFT + DeveloperConsoleController.INFO_PANEL_WIDTH - 170,
      DeveloperConsoleController.INFO_PANEL_TOP + DeveloperConsoleController.PANEL_PADDING_Y,
      "",
      {
      fontFamily: "Courier New",
      fontSize: "12px",
      color: "#b8c1ec",
      align: "right",
      fixedWidth: 152,
      },
    );
    this.scrollHintText.setDepth(52);
    this.scrollHintText.setVisible(false);

    scene.input.on("wheel", this.handleWheel, this);
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
      case "ArrowUp":
      case "PageUp":
        event.preventDefault();
        this.scrollInfo(-1);
        break;
      case "ArrowDown":
      case "PageDown":
        event.preventDefault();
        this.scrollInfo(1);
        break;
      case "Home":
        event.preventDefault();
        this.infoScrollIndex = 0;
        break;
      case "End":
        event.preventDefault();
        this.infoScrollIndex = Number.MAX_SAFE_INTEGER;
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
    this.lastContext = context;
    if (!this.isOpen) {
      return;
    }

    const selectedRoomId = ROOM_ORDER[this.selectedRoomIndex];
    const selectedRoom = getRoomDefinition(selectedRoomId);
    const currentFloorLabel = context.currentFloor === "ground" ? "Ground Floor" : "Basement";
    const selectedFloorLabel = this.selectedFloor === "ground" ? "Ground Floor" : "Basement";
    const seconds = Math.ceil(context.runState.timeRemainingMs / 1000);
    const infoLines = [
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
      "This panel scrolls if the info grows.",
      "Use Up/Down, PageUp/PageDown, or the mouse wheel.",
    ];
    const maxScrollIndex = Math.max(0, infoLines.length - this.visibleInfoLines);
    this.infoScrollIndex = Math.min(maxScrollIndex, Math.max(0, this.infoScrollIndex));
    const visibleLines = infoLines.slice(this.infoScrollIndex, this.infoScrollIndex + this.visibleInfoLines);
    const hasOverflow = infoLines.length > this.visibleInfoLines;
    const scrollLabel = hasOverflow
      ? `Scroll ${this.infoScrollIndex + 1}-${Math.min(infoLines.length, this.infoScrollIndex + this.visibleInfoLines)} / ${infoLines.length}`
      : "";

    this.infoText.setText(visibleLines.join("\n"));
    this.scrollHintText.setText(scrollLabel);
    this.scrollHintText.setVisible(hasOverflow);
    this.controlsText.setText(
      [
        "[ / ] cycle room   G ground floor   B basement",
        "L add life   Shift+L remove life",
        "T add 30s   Shift+T remove 30s",
        "Enter jump to room   R restart room   ` close console",
      ].join("\n"),
    );
  }

  isConsoleOpen(): boolean {
    return this.isOpen;
  }

  destroy(): void {
    this.scene.input.off("wheel", this.handleWheel, this);
    this.panel.destroy();
    this.infoPanel.destroy();
    this.controlsPanel.destroy();
    this.infoText.destroy();
    this.controlsText.destroy();
    this.scrollHintText.destroy();
  }

  private toggle(context: DeveloperConsoleContext): void {
    this.isOpen = !this.isOpen;
    this.selectedRoomIndex = ROOM_ORDER.indexOf(context.currentRoomId);
    this.selectedFloor = context.currentFloor;
    this.infoScrollIndex = 0;
    this.panel.setVisible(this.isOpen);
    this.infoPanel.setVisible(this.isOpen);
    this.controlsPanel.setVisible(this.isOpen);
    this.infoText.setVisible(this.isOpen);
    this.controlsText.setVisible(this.isOpen);
    this.scrollHintText.setVisible(this.isOpen);
    this.refresh(context);
  }

  private scrollInfo(delta: number): void {
    this.infoScrollIndex = Math.max(0, this.infoScrollIndex + delta);
  }

  private handleWheel(
    _pointer: Phaser.Input.Pointer,
    _currentlyOver: Phaser.GameObjects.GameObject[],
    _deltaX: number,
    deltaY: number,
  ): void {
    if (!this.isOpen) {
      return;
    }

    if (deltaY > 0) {
      this.scrollInfo(1);
    } else if (deltaY < 0) {
      this.scrollInfo(-1);
    }

    if (this.lastContext) {
      this.refresh(this.lastContext);
    }
  }
}

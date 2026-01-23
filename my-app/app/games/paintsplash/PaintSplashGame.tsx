"use client";

import { useEffect, useRef } from "react";
import Phaser from "phaser";

const WIDTH = 400;
const HEIGHT = 400;

// --- Game constants (mirrors your original)
const GRID_SIZE = 17;
const GRID_W = 270;

const CHOICES = 30;

const BUTTON_W = 32;
const BUTTON_SPACE = 44;

// 6 colors (same as your list)
const COLORS = [
  0xff0000, // red
  0xff9600, // orange
  0xffff00, // yellow
  0x00c800, // green
  0x0000ff, // blue
  0xff00ff, // magenta
];

type Cell = { x: number; y: number };

function key(x: number, y: number) {
  return `${x},${y}`;
}

class PaintSplashScene extends Phaser.Scene {
  // grid data
  private currentColor = 0;
  private taken = new Set<string>();
  private squares: Cell[][] = [[], [], [], [], [], []];

  // ui/game state
  private currentNum = CHOICES;
  private isWinAt: number | null = null;
  private gameDrawn = false;
  private helpOpen = false;

  // layout
  private cellSize = GRID_W / GRID_SIZE;
  private boardX = 200 - GRID_W / 2;
  private boardY = 200 - GRID_W / 2;

  // phaser objects
  private gBg!: Phaser.GameObjects.Graphics;
  private gBoard!: Phaser.GameObjects.Graphics;
  private gOverlay!: Phaser.GameObjects.Graphics;

  private helpText!: Phaser.GameObjects.Text;
  private titleText!: Phaser.GameObjects.Text;
  private centerText!: Phaser.GameObjects.Text;

  private splashStart = 0;

  // buttons: 6 color buttons + help + close
  private buttons: { x: number; y: number; r: number }[] = [];

  constructor() {
    super("paint-splash");
  }

  create() {
    this.splashStart = this.time.now;

    // graphics layers
    this.gBg = this.add.graphics();
    this.gBoard = this.add.graphics();
    this.gOverlay = this.add.graphics();

    // buttons layout (same math as original)
    for (let i = 0; i < 6; i++) {
      this.buttons.push({
        x: 200 + (i - 2.5) * BUTTON_SPACE,
        y: GRID_W + 20 + (3 * (400 - GRID_W - 20)) / 4,
        r: BUTTON_W / 2,
      });
    }
    // help (?) button
    this.buttons.push({ x: 380, y: 20, r: 25 / 2 });
    // close (x) button for help overlay
    this.buttons.push({ x: 320, y: 80, r: 18 / 2 });

    // texts
    this.titleText = this.add
      .text(200, 0, "Ink Spill", {
        fontFamily: "Arial, system-ui, -apple-system, Segoe UI, Roboto",
        fontSize: "75px",
        color: "#ffffff",
      })
      .setOrigin(0.5, 0.5);

    this.centerText = this.add
      .text(200, 200, "", {
        fontFamily: "Arial, system-ui, -apple-system, Segoe UI, Roboto",
        fontSize: "50px",
        color: "#000000",
      })
      .setOrigin(0.5, 0.5)
      .setVisible(false);

    this.helpText = this.add
      .text(90, 125, "", {
        fontFamily: "Arial, system-ui, -apple-system, Segoe UI, Roboto",
        fontSize: "15px",
        color: "#000000",
        wordWrap: { width: 220 },
      })
      .setVisible(false);

    // init grid
    this.initGrid();
    this.doChoice(); // like your `do_choice(currentColor)` at start

    // input
    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
      this.onClick(p.x, p.y);
    });
  }

  private initGrid() {
    this.taken.clear();
    this.squares = [[], [], [], [], [], []];

    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        const squareColor = Phaser.Math.Between(0, 5);
        if (x === 0 && y === 0) this.currentColor = squareColor;
        this.squares[squareColor].push({ x, y });
      }
    }

    // original had taken = [[0,0]]
    this.taken.add(key(0, 0));

    this.currentNum = CHOICES;
    this.isWinAt = null;
    this.helpOpen = false;
    this.gameDrawn = false;
  }

  private isTakenCandidate(x: number, y: number): boolean {
    // Equivalent to your is_taken(square):
    // If it's adjacent (N/S/E/W) to any taken cell AND the square is in squares[currentColor]
    // (Your original loops were a bit odd but effectively checks adjacency.)
    const k = key(x, y);
    if (this.taken.has(k)) return false;

    // must currently be of currentColor
    if (!this.isInColorBucket(x, y, this.currentColor)) return false;

    // adjacency to taken
    const neighbors = [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ];
    for (const [nx, ny] of neighbors) {
      if (nx < 0 || nx >= GRID_SIZE || ny < 0 || ny >= GRID_SIZE) continue;
      if (this.taken.has(key(nx, ny))) return true;
    }
    return false;
  }

  private isInColorBucket(x: number, y: number, colorIndex: number): boolean {
    // O(n) search just like your original (fine for 17x17)
    const arr = this.squares[colorIndex];
    for (let i = 0; i < arr.length; i++) {
      const c = arr[i];
      if (c.x === x && c.y === y) return true;
    }
    return false;
  }

  private doChoice() {
    // loop until no more squares are being added (your while(true) + count)
    while (true) {
      let added = 0;
      for (let x = 0; x < GRID_SIZE; x++) {
        for (let y = 0; y < GRID_SIZE; y++) {
          if (!this.taken.has(key(x, y)) && this.isTakenCandidate(x, y)) {
            this.taken.add(key(x, y));
            added++;
          }
        }
      }
      if (added === 0) break;
    }
  }

  private overButton(mx: number, my: number): number {
    for (let i = 0; i < this.buttons.length; i++) {
      const b = this.buttons[i];
      const dx = mx - b.x;
      const dy = my - b.y;
      if (dx * dx + dy * dy < b.r * b.r) return i;
    }
    return -1;
  }

  private onClick(mx: number, my: number) {
    const button = this.overButton(mx, my);

    if (button === -1 || this.currentNum === 0 || this.isWinAt !== null || !this.gameDrawn) return;

    if (button === 6) {
      this.helpOpen = true;
      return;
    }
    if (button === 7 && this.helpOpen) {
      this.helpOpen = false;
      return;
    }

    if (!this.helpOpen && button !== this.currentColor && button >= 0 && button <= 5) {
      this.currentNum--;
      this.currentColor = button;
      this.doChoice();

      if (this.taken.size === GRID_SIZE * GRID_SIZE) {
        this.isWinAt = this.time.now;
      }
    }
  }

  private cycleColors(start: number) {
    // (currentNum + floor((millis() - start) % 6000 / 1000)) % 6
    const step = Math.floor(((this.time.now - start) % 6000) / 1000);
    return (this.currentNum + step) % 6;
  }

  update() {
    const t = this.time.now - this.splashStart;

    // cursor
    const pointer = this.input.activePointer;
    const hover = this.overButton(pointer.x, pointer.y) !== -1;
    this.input.setDefaultCursor(hover ? "pointer" : "default");

    if (t < 3000) {
      this.drawInkSpill(t);
      return;
    }

    this.drawGame();
    this.gameDrawn = true;

    // win/lose overlays
    if (this.isWinAt !== null) {
      this.drawWin(this.isWinAt);
    } else if (this.currentNum === 0) {
      this.drawLose();
    }
  }

  private drawBackground() {
    // gradient background like original
    this.gBg.clear();
    for (let i = 0; i <= HEIGHT; i++) {
      const v = Math.floor((255 * i) / HEIGHT);
      const c = (v << 16) | (v << 8) | v;
      this.gBg.lineStyle(1, c, 1);
      this.gBg.beginPath();
      this.gBg.moveTo(0, i);
      this.gBg.lineTo(WIDTH, i);
      this.gBg.strokePath();
    }
  }

  private drawInkSpill(timeSince: number) {
    this.drawBackground();
    this.gBoard.clear();
    this.gOverlay.clear();
    this.centerText.setVisible(false);
    this.helpText.setVisible(false);

    // slide the title down over time (like your 200 * timeSince/(leng-final))
    const leng = 3000;
    const final = 1500;
    const denom = Math.max(1, leng - final);
    const clamped = Math.min(timeSince, leng - final);
    const y = 200 * (clamped / denom);

    this.titleText.setVisible(true);
    this.titleText.setPosition(200, y);
  }

  private drawGame() {
    this.titleText.setVisible(false);
    this.drawBackground();

    this.gBoard.clear();
    this.gOverlay.clear();

    // board white frame
    this.gBoard.fillStyle(0xffffff, 1);
    this.gBoard.fillRect(this.boardX - 10, this.boardY - 10, GRID_W + 20, GRID_W + 20);

    // squares
    for (let colorIndex = 0; colorIndex < 6; colorIndex++) {
      const bucket = this.squares[colorIndex];
      for (let i = 0; i < bucket.length; i++) {
        const { x, y } = bucket[i];
        const isTaken = this.taken.has(key(x, y));
        const drawColor = isTaken ? COLORS[this.currentColor] : COLORS[colorIndex];

        this.gBoard.fillStyle(drawColor, 1);
        this.gBoard.fillRect(
          this.boardX + x * this.cellSize,
          this.boardY + y * this.cellSize,
          this.cellSize,
          this.cellSize
        );
      }
    }

    // choice bar
    this.drawBar(CHOICES, this.currentNum);

    // color buttons
    for (let i = 0; i < 6; i++) {
      const b = this.buttons[i];
      this.gOverlay.fillStyle(COLORS[i], 1);
      this.gOverlay.fillCircle(b.x, b.y, b.r);
    }

    // help (?) button
    {
      const b = this.buttons[6];
      this.gOverlay.fillStyle(0x525252, 1);
      this.gOverlay.fillCircle(b.x, b.y, b.r);
      const q = this.add
        .text(b.x, b.y, "?", {
          fontFamily: "Arial, system-ui, -apple-system, Segoe UI, Roboto",
          fontSize: "18px",
          color: "#000000",
        })
        .setOrigin(0.5, 0.5);
      // avoid creating every frame: destroy it immediately after render (cheap but ok)
      // If you want, I can refactor to persistent text objects.
      this.time.delayedCall(0, () => q.destroy());
    }

    // help overlay
    if (this.helpOpen) {
      // box
      this.gOverlay.lineStyle(2, 0x666666, 1);
      this.gOverlay.fillStyle(0xffffff, 1);
      this.gOverlay.fillRect(80, 80, 240, 240);
      this.gOverlay.lineStyle(0, 0, 0);

      // close button
      const b = this.buttons[7];
      this.gOverlay.fillStyle(0x878787, 1);
      this.gOverlay.fillCircle(b.x, b.y, b.r);
      const xTxt = this.add
        .text(b.x, b.y - 1, "x", {
          fontFamily: "Arial, system-ui, -apple-system, Segoe UI, Roboto",
          fontSize: "12px",
          color: "#ffffff",
        })
        .setOrigin(0.5, 0.5);
      this.time.delayedCall(0, () => xTxt.destroy());

      // header
      const header = this.add
        .text(200, 104, "How To Play", {
          fontFamily: "Arial, system-ui, -apple-system, Segoe UI, Roboto",
          fontSize: "20px",
          color: "#000000",
        })
        .setOrigin(0.5, 0.5);
      this.time.delayedCall(0, () => header.destroy());

      // body (persistent text object)
      this.helpText.setVisible(true);
      this.helpText.setText(
        "The goal of the game is to make\n" +
          "the grid one color. The buttons\n" +
          "on the bottom of the screen\n" +
          "change the color of the upper-left\n" +
          "square and the squares\n" +
          "connected to it that are the same\n" +
          "color. However, you only have a\n" +
          "limited amount of choices. If the\n" +
          "bar on the top of the screen runs\n" +
          "out, the game ends."
      );
    } else {
      this.helpText.setVisible(false);
    }
  }

  private drawBar(total: number, current: number) {
    const width = 276;
    const height = 12;
    const posY = 200 - GRID_W / 2 - 32;
    const choiceW = width / total;

    // current portion
    this.gOverlay.lineStyle(1, 0xffffff, 1);
    this.gOverlay.fillStyle(0x1e00ff, 1);
    this.gOverlay.fillRect(200 - width / 2, posY, current * choiceW, height);

    // remaining
    if (current !== total) {
      this.gOverlay.fillStyle(0x202020, 1);
      this.gOverlay.fillRect(200 - width / 2 + current * choiceW, posY, (total - current) * choiceW, height);
    }

    // dividers
    for (let i = 1; i < total; i++) {
      this.gOverlay.lineStyle(1, 0xffffff, 1);
      this.gOverlay.beginPath();
      this.gOverlay.moveTo(200 - width / 2 + choiceW * i, posY);
      this.gOverlay.lineTo(200 - width / 2 + choiceW * i, posY + height);
      this.gOverlay.strokePath();
    }
    this.gOverlay.lineStyle(0, 0, 0);
  }

  private drawWin(start: number) {
    this.centerText.setVisible(true);
    this.centerText.setText("You win!");
    this.centerText.setColor("#000000");
    this.centerText.setFontSize(50);

    const color = COLORS[this.cycleColors(start)];
    this.gOverlay.fillStyle(color, 1);
    this.gOverlay.fillRect(this.boardX, this.boardY, GRID_W, GRID_W);
  }

  private drawLose() {
    this.centerText.setVisible(true);
    this.centerText.setText(
      `Game over!\n\nYou had ${GRID_SIZE * GRID_SIZE - this.taken.size} squares left.`
    );
    this.centerText.setColor("#000000");
    this.centerText.setFontSize(30);
  }
}

export default function PaintSplashGame() {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hostRef.current) return;

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: hostRef.current,
      width: WIDTH,
      height: HEIGHT,
      backgroundColor: "#000000",
      scene: PaintSplashScene,
    });

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div ref={hostRef} style={{ width: WIDTH, height: HEIGHT }} />;
}

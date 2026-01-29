"use client";

import { useEffect, useRef } from "react";
import Phaser from "phaser";

/**
 * Fixed virtual resolution.
 * Build your game as if it's ALWAYS this size.
 * Phaser will scale it up/down to fit the browser while preserving aspect ratio.
 */
const VIRTUAL_WIDTH = 400;
const VIRTUAL_HEIGHT = 400;

/**
 * ---------------------------
 * Scene: Preload
 * ---------------------------
 * Load images/audio/fonts here.
 * After loading finishes, jump to the next scene.
 */
class PreloadScene extends Phaser.Scene {
  constructor() {
    super("preload");
  }

  preload() {
    // ✅ Put your asset loading here:
    // this.load.image("player", "/assets/player.png");
    // this.load.audio("jump", "/assets/jump.wav");

    // Optional: simple loading text
    this.add
      .text(VIRTUAL_WIDTH / 2, VIRTUAL_HEIGHT / 2, "Loading...", {
        fontFamily: "Arial, system-ui, -apple-system, Segoe UI, Roboto",
        fontSize: "18px",
        color: "#ffffff",
      })
      .setOrigin(0.5);
  }

  create() {
    // ✅ When ready, start your first real scene
    this.scene.start("menu");
  }
}

/**
 * ---------------------------
 * Scene: Menu (or Title)
 * ---------------------------
 * Title screen, press-to-start, options, etc.
 */
class MenuScene extends Phaser.Scene {
  constructor() {
    super("menu");
  }

  create() {
    this.add
      .text(VIRTUAL_WIDTH / 2, 60, "My Phaser Game", {
        fontFamily: "Arial, system-ui, -apple-system, Segoe UI, Roboto",
        fontSize: "26px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    const startText = this.add
      .text(VIRTUAL_WIDTH / 2, 140, "Click / Tap to Start", {
        fontFamily: "Arial, system-ui, -apple-system, Segoe UI, Roboto",
        fontSize: "16px",
        color: "#cbd5e1",
      })
      .setOrigin(0.5);

    // ✅ Input wiring belongs here (menu buttons, click to start, etc.)
    this.input.once("pointerdown", () => {
      this.scene.start("game");
    });

    // Optional: little pulse so it feels alive
    this.tweens.add({
      targets: startText,
      alpha: 0.3,
      duration: 600,
      yoyo: true,
      repeat: -1,
    });
  }
}

/**
 * ---------------------------
 * Scene: Game (main loop)
 * ---------------------------
 * Most of your gameplay lives here:
 * - create(): build the world, spawn player, set up input/colliders
 * - update(): per-frame logic
 */
class GameScene extends Phaser.Scene {
  // Example fields (put your state here)
  private g!: Phaser.GameObjects.Graphics;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private playerPos = new Phaser.Math.Vector2(200, 200);

  constructor() {
    super("game");
  }

  create() {
    // ✅ Input setup
    this.cursors = this.input.keyboard!.createCursorKeys();

    // ✅ World setup (background, map, physics, etc.)
    this.g = this.add.graphics();

    this.add
      .text(VIRTUAL_WIDTH / 2, 20, "Aspect-Ratio Locked Game", {
        fontFamily: "Arial, system-ui, -apple-system, Segoe UI, Roboto",
        fontSize: "18px",
        color: "#ffffff",
      })
      .setOrigin(0.5, 0);

    // ✅ If you want a "pause" overlay scene later, you'd launch it from here:
    // this.scene.launch("hud");

    this.draw();
  }

  update(_time: number, delta: number) {
    // ✅ Main game loop logic:
    // - movement
    // - animations
    // - timers
    // - win/lose checks
    // - AI
    const speed = 0.12 * delta;

    if (this.cursors.left?.isDown) this.playerPos.x -= speed;
    if (this.cursors.right?.isDown) this.playerPos.x += speed;
    if (this.cursors.up?.isDown) this.playerPos.y -= speed;
    if (this.cursors.down?.isDown) this.playerPos.y += speed;

    // Keep in bounds of the virtual canvas
    this.playerPos.x = Phaser.Math.Clamp(this.playerPos.x, 20, VIRTUAL_WIDTH - 20);
    this.playerPos.y = Phaser.Math.Clamp(this.playerPos.y, 40, VIRTUAL_HEIGHT - 20);

    this.draw();
  }

  private draw() {
    this.g.clear();

    // background
    this.g.fillStyle(0x111827, 1);
    this.g.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

    // example "play area"
    this.g.fillStyle(0x0b1220, 1);
    this.g.fillRect(50, 50, 300, 300);

    this.g.lineStyle(3, 0xffffff, 1);
    this.g.strokeRect(50, 50, 300, 300);

    // example "player"
    this.g.fillStyle(0x60a5fa, 1);
    this.g.fillCircle(this.playerPos.x, this.playerPos.y, 10);
  }
}

/**
 * ---------------------------
 * Optional Scene: HUD / UI Overlay
 * ---------------------------
 * Put score/health/minimap/etc here. Usually no physics.
 * You can run it in parallel with GameScene via `scene.launch("hud")`.
 */
class HudScene extends Phaser.Scene {
  private scoreText!: Phaser.GameObjects.Text;
  private score = 0;

  constructor() {
    super("hud");
  }

  create() {
    // ✅ UI elements go here
    this.scoreText = this.add
      .text(10, 10, "Score: 0", {
        fontFamily: "Arial, system-ui, -apple-system, Segoe UI, Roboto",
        fontSize: "14px",
        color: "#ffffff",
      })
      .setOrigin(0, 0);

    // ✅ Example: listen for events from GameScene
    // this.game.events.on("score:add", (amount:number) => { ... });
  }

  // Example public method to update HUD from elsewhere
  setScore(score: number) {
    this.score = score;
    this.scoreText.setText(`Score: ${this.score}`);
  }
}

/**
 * ---------------------------
 * Next.js wrapper component
 * ---------------------------
 * Mounts Phaser into a div and destroys on unmount.
 * Keeps aspect ratio locked via Scale.FIT.
 */
export default function PhaserAspectRatioTemplate() {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hostRef.current) return;

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: hostRef.current,
      width: VIRTUAL_WIDTH,
      height: VIRTUAL_HEIGHT,
      backgroundColor: "#000000",

      // ✅ Register all scenes you plan to use
      scene: [PreloadScene, MenuScene, GameScene, HudScene],

      // ✅ Aspect ratio lock (your current approach)
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH, // centers the canvas in the host div
      },

      // ✅ If you add physics later, enable it here
      // physics: {
      //   default: "arcade",
      //   arcade: { debug: false },
      // },
    });

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div
      ref={hostRef}
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        // The canvas will be centered by Phaser (CENTER_BOTH),
        // but keeping a simple container is still nice.
      }}
    />
  );
}

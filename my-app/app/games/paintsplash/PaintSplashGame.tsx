"use client";

import { useEffect, useRef } from "react";
import Phaser from "phaser";

/** Fixed virtual resolution */
const VIRTUAL_WIDTH = 400;
const VIRTUAL_HEIGHT = 400;

/** --- Minimal Scene --- */
class BasicScene extends Phaser.Scene {
  private g!: Phaser.GameObjects.Graphics;

  constructor() {
    super("basic");
  }

  create() {
    this.g = this.add.graphics();

    this.add
      .text(VIRTUAL_WIDTH / 2, 20, "Aspect-Ratio Template", {
        fontFamily: "Arial, system-ui, -apple-system, Segoe UI, Roboto",
        fontSize: "20px",
        color: "#ffffff",
      })
      .setOrigin(0.5, 0);

    this.draw();
  }

  private draw() {
    this.g.clear();

    // background
    this.g.fillStyle(0x111827, 1);
    this.g.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);

    // centered square (example content)
    this.g.fillStyle(0x0b1220, 1);
    this.g.fillRect(50, 50, 300, 300);

    this.g.lineStyle(3, 0xffffff, 1);
    this.g.strokeRect(50, 50, 300, 300);
  }
}

/** --- Next.js wrapper --- */
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
      scene: BasicScene,
      scale: {
        mode: Phaser.Scale.FIT,          // 🔑 maintain aspect ratio
        autoCenter: Phaser.Scale.NO_CENTER,
      },
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
        justifyContent: "left",
        alignItems: "flex-start",
      }}
    />
  );
}

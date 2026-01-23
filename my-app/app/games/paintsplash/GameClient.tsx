"use client";

import dynamic from "next/dynamic";

const PaintSplashGame = dynamic(
  () => import("./PaintSplashGame"),
  { ssr: false }
);

export default function GameClient() {
  return <PaintSplashGame />;
}

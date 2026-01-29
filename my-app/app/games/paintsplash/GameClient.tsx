"use client";

import dynamic from "next/dynamic";

const Component = dynamic(
    () => import("./PaintSplashGame"),
    { ssr: false },
);

export default function GameClient() {
    return <Component/>
}

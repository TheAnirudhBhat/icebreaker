"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import PlayerPhone from "./PlayerPhone";
import type { Duet } from "../hooks/useDuet";

// On-phone view of the proto: one phone (Arjun's), rendered responsively at the device's
// real width with NO transform scaling. That keeps text at its native size (14px renders at
// 14px, exactly like the desktop shell) AND lets the app fill the screen edge to edge. A
// fixed-width mock can't be both edge to edge and native when you SCALE it (scale up = big
// text, scale 1 = side margins); rendering at the real width sidesteps that by letting the
// already flex/percentage-based layout reflow to fill, instead of scaling. The stage is
// pinned to the visual viewport (height + offset) so the keyboard shrinks it cleanly.
export default function MobileProto({ duet }: { duet: Duet }) {
  const [vp, setVp] = useState<{ height: number; offsetTop: number } | null>(null);

  // There's no second phone on the device view, so once you seal your answers,
  // simulate the match answering after a beat so the waiting state advances to the
  // reveal on its own.
  const sealed = duet.me.phase === "sealed";
  useEffect(() => {
    if (!sealed) return;
    const t = window.setTimeout(() => duet.aanyaAutoPlay(), 2600);
    return () => window.clearTimeout(t);
  }, [sealed, duet.aanyaAutoPlay]);

  // Track the visual viewport (height + vertical offset) so the keyboard shrinks and
  // repositions the stage instead of covering it or shoving the page around.
  useLayoutEffect(() => {
    const vv = window.visualViewport;
    const update = () =>
      setVp(vv ? { height: vv.height, offsetTop: vv.offsetTop } : { height: window.innerHeight, offsetTop: 0 });
    update();
    vv?.addEventListener("resize", update);
    vv?.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    return () => {
      vv?.removeEventListener("resize", update);
      vv?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        top: vp ? vp.offsetTop : 0,
        height: vp ? vp.height : "100dvh",
        background: "#FFFFFF",
        // Clear the notch and home indicator only; left/right insets are 0 in portrait,
        // so the app still runs edge to edge horizontally.
        padding: "env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)",
        boxSizing: "border-box",
      }}
    >
      <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
        <PlayerPhone duet={duet} selfId="me" onDevice />
      </div>
    </div>
  );
}

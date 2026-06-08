"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import PlayerPhone from "./PlayerPhone";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "./DeviceFrame";
import type { Duet } from "../hooks/useDuet";

// On-phone view of the proto: one phone (Arjun's), full-bleed. The 360-wide app
// is scaled with `zoom` to fit the safe-area-padded area, so it fills the screen
// without the notch or home indicator overlapping. The container tracks the
// visual viewport, so when the device keyboard opens the phone refits into the
// space above it and the compose bar stays visible (real typing works).
export default function MobileProto({ duet }: { duet: Duet }) {
  const areaRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(0); // 0 until measured, so it never flashes unscaled
  const [vh, setVh] = useState<number | undefined>(undefined);

  // There's no second phone on the device view, so once you seal your answers,
  // simulate the match answering after a beat, so the waiting state advances to
  // the reveal on its own.
  const sealed = duet.me.phase === "sealed";
  useEffect(() => {
    if (!sealed) return;
    const t = window.setTimeout(() => duet.aanyaAutoPlay(), 2600);
    return () => window.clearTimeout(t);
  }, [sealed, duet.aanyaAutoPlay]);

  // Refit the phone whenever its available area changes (resize, or the container
  // shrinking when the keyboard opens).
  useLayoutEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    const fit = () => setZoom(Math.min(el.clientWidth / SCREEN_WIDTH, el.clientHeight / SCREEN_HEIGHT));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Drive the height from the visual viewport so the keyboard shrinks the stage
  // instead of covering it.
  useLayoutEffect(() => {
    const vv = window.visualViewport;
    const update = () => setVh(vv ? vv.height : window.innerHeight);
    update();
    vv?.addEventListener("resize", update);
    window.addEventListener("resize", update);
    return () => {
      vv?.removeEventListener("resize", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: vh ?? "100dvh",
        background: "#FFFFFF",
        // Keep the phone clear of the notch and home indicator.
        padding: "env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)",
        boxSizing: "border-box",
      }}
    >
      <div ref={areaRef} style={{ width: "100%", height: "100%", display: "flex", alignItems: "flex-start", justifyContent: "center", overflow: "hidden" }}>
        <div style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, flexShrink: 0, position: "relative", overflow: "hidden", zoom: zoom || 1, opacity: zoom ? 1 : 0 }}>
          <PlayerPhone duet={duet} selfId="me" onDevice />
        </div>
      </div>
    </div>
  );
}

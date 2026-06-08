"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import PlayerPhone from "./PlayerPhone";
import { SCREEN_WIDTH } from "./DeviceFrame";
import type { Duet } from "../hooks/useDuet";

// On-phone view of the proto: one phone (Arjun's), edge to edge. The 360-wide app is
// scaled with `transform: scale` to fill the device width. We use transform, not the
// CSS `zoom` property, because `zoom` renders inconsistently on mobile Safari (the
// proto looked right in desktop device-emulation but broke on real phones). The scale
// never drops below 1, so text always renders at least its design size and never goes
// illegibly small. The container tracks the visual viewport, so when the device
// keyboard opens the phone refits into the space above it and the compose bar stays
// visible.
export default function MobileProto({ duet }: { duet: Duet }) {
  const areaRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<{ scale: number; h: number } | null>(null); // null until measured, so it never flashes unscaled
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

  // Fill the width (never shrinking below 1:1), then size the logical height so the
  // scaled phone fills the whole available area. Refit whenever the area changes
  // (rotation, or the keyboard shrinking the viewport).
  useLayoutEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    const measure = () => {
      const scale = Math.max(1, el.clientWidth / SCREEN_WIDTH);
      setFit({ scale, h: el.clientHeight / scale });
    };
    measure();
    const ro = new ResizeObserver(measure);
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
        // Keep the app's content clear of the notch and home indicator; the white
        // padding reads as part of the (white) app, so it still looks edge to edge.
        padding: "env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)",
        boxSizing: "border-box",
      }}
    >
      <div ref={areaRef} style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
        {fit && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: SCREEN_WIDTH,
              height: fit.h,
              transform: `scale(${fit.scale})`,
              transformOrigin: "top left",
            }}
          >
            <PlayerPhone duet={duet} selfId="me" onDevice />
          </div>
        )}
      </div>
    </div>
  );
}

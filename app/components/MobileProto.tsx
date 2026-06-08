"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import PlayerPhone from "./PlayerPhone";
import { SCREEN_WIDTH } from "./DeviceFrame";
import type { Duet } from "../hooks/useDuet";

// On-phone view of the proto: one phone (Arjun's), edge to edge. The 360-wide app
// is scaled with `zoom` to FILL the device width, and its logical height is set so
// that after the zoom it fills the available height too, so the screen reaches every
// edge with no letterbox. The app's own header and compose bar carry the safe-area
// insets (via the padded container), so nothing sits under the notch or home
// indicator. The container tracks the visual viewport, so when the device keyboard
// opens the phone refits into the space above it and the compose bar stays visible.
export default function MobileProto({ duet }: { duet: Duet }) {
  const areaRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<{ zoom: number; h: number }>({ zoom: 0, h: 0 }); // 0 until measured, so it never flashes unscaled
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

  // Fill the width edge to edge, then size the logical height so the zoomed phone
  // fills the whole available area (height * zoom == area height). Refit whenever
  // the area changes (rotation, or the keyboard shrinking the viewport).
  useLayoutEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    const measure = () => {
      const zoom = el.clientWidth / SCREEN_WIDTH;
      setFit({ zoom, h: zoom > 0 ? el.clientHeight / zoom : 0 });
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
      <div ref={areaRef} style={{ width: "100%", height: "100%", overflow: "hidden" }}>
        <div className="on-device" style={{ width: SCREEN_WIDTH, height: fit.h, zoom: fit.zoom || 1, opacity: fit.zoom ? 1 : 0, position: "relative", overflow: "hidden" }}>
          <PlayerPhone duet={duet} selfId="me" onDevice />
        </div>
      </div>
    </div>
  );
}

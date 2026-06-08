"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import PlayerPhone from "./PlayerPhone";
import { SCREEN_WIDTH } from "./DeviceFrame";
import type { Duet } from "../hooks/useDuet";

// On-phone view of the proto: one phone (Arjun's), near edge to edge. The 360-wide app
// is scaled with `transform: scale` (not the CSS `zoom` property, which renders
// inconsistently on mobile Safari). We fill ~95% of the width and center it, so type
// reads a touch smaller than a full-width upscale while still feeling full-bleed. Scale
// never drops below 1, so text never goes below its design size. The stage is pinned to
// the visual viewport (height + offset), so when the keyboard opens the phone refits
// into the space above it and follows iOS's scroll instead of glitching out.
export default function MobileProto({ duet }: { duet: Duet }) {
  const areaRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<{ scale: number; h: number; left: number } | null>(null);
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

  // Fill ~95% of the width (never below 1:1), size the height so the scaled phone fills
  // the area, and center it horizontally. Refit whenever the area changes (rotation, or
  // the keyboard shrinking the viewport).
  useLayoutEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      const scale = Math.max(1, (w / SCREEN_WIDTH) * 0.95);
      setFit({ scale, h: el.clientHeight / scale, left: Math.max(0, (w - SCREEN_WIDTH * scale) / 2) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

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
              left: fit.left,
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

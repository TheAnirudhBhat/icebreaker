"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import PlayerPhone from "./PlayerPhone";
import { SCREEN_WIDTH } from "./DeviceFrame";
import type { Duet } from "../hooks/useDuet";

// On-phone view of the proto: one phone (Arjun's). The 360-wide design (the same canvas as
// the desktop shell) is scaled with `transform: scale` to FILL the device width, so it looks
// pixel-identical to the desktop phone, just sized to the screen. On a phone wider than 360
// that means scaling slightly above 1:1 (text included) so the whole thing fills edge to edge
// with no margins. The stage is pinned to the visual viewport (height + offset) so the
// keyboard shrinks it cleanly instead of covering it.
export default function MobileProto({ duet }: { duet: Duet }) {
  const areaRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<{ scale: number; h: number } | null>(null);
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

  // Scale the 360 design to fill the width (clientWidth / 360), so it fills edge to edge and
  // keeps the desktop shell's exact proportions (everything scales together, text included).
  // Height is sized so the scaled phone fills vertically too. Refit whenever the area changes
  // (rotation, or the keyboard shrinking the viewport).
  useLayoutEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      // Guard a 0-width measure (e.g. mid-transition): scale 0 would divide the height by
      // zero (Infinity) and blank the phone.
      if (!w) return;
      const scale = w / SCREEN_WIDTH;
      setFit({ scale, h: el.clientHeight / scale });
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
        // Clear the notch and home indicator only; left/right insets are 0 in portrait, so
        // the scaled phone fills the width edge to edge.
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

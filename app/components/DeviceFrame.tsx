"use client";

import type { ReactNode } from "react";
import { BG_PRIMARY } from "../lib/colors";

// iPhone 17 shell (ported from the explore-slice proto). The bezel art (rim +
// Dynamic Island + side buttons baked in) sits on top; screen content fills the
// transparent cut-out behind it.
//
// A 360-wide logical viewport (matching the Figma canvas 1:1) with NO transform
// scaling, so a 14px font renders at 14px regardless of the phone's on-screen size:
// shrink the device by editing these dimensions, never by scaling, so type stays
// consistent. Every value is the old 402-wide frame times 360/402, so the bezel art
// still lines up exactly with the screen cut-out.
const OUTER_W = 403;
const OUTER_H = 824;
const SCREEN_W = 360;
const SCREEN_H = 783;
const INSET_TOP = 20.6;
const INSET_LEFT = 21.5;
const SCREEN_RADIUS = 45;

export const SCREEN_WIDTH = SCREEN_W;

export default function DeviceFrame({ children }: { children: ReactNode }) {
  return (
    <div style={{ position: "relative", width: OUTER_W, height: OUTER_H, flexShrink: 0 }}>
      <div
        style={{
          position: "absolute",
          top: INSET_TOP,
          left: INSET_LEFT,
          width: SCREEN_W,
          height: SCREEN_H,
          borderRadius: SCREEN_RADIUS,
          overflow: "hidden",
          background: BG_PRIMARY,
          zIndex: 1,
        }}
      >
        {children}
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/iphone17_bezel.png"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 2,
          pointerEvents: "none",
          filter: "drop-shadow(0 14px 32px rgba(26,22,20,0.16)) drop-shadow(0 3px 9px rgba(26,22,20,0.10))",
        }}
      />
    </div>
  );
}

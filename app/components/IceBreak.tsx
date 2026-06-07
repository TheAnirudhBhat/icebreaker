"use client";

import { useState } from "react";
import { typography } from "../lib/typography";
import { RADIUS_L } from "../lib/radii";

const TAPS_TO_BREAK = 3;

// Jagged, branching fractures, revealed one group per tap.
const CRACKS = [
  "M52 -2 L49 28 L63 46 L56 74 L67 126",
  "M49 28 L22 36 L36 58 L14 86",
  "M63 46 L90 40 L76 66 L97 104 M56 74 L41 100",
];

function CrackOverlay({ taps }: { taps: number }) {
  return (
    <svg viewBox="0 0 100 124" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 2 }}>
      {CRACKS.slice(0, taps).map((d, i) => (
        <g key={i}>
          <path d={d} stroke="rgba(90,135,170,0.55)" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d={d} stroke="rgba(255,255,255,0.95)" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}
    </svg>
  );
}

// Alternative reveal opener: a block of ice you tap to break, then the reveal opens.
export default function IceBreak({ onOpen }: { onOpen: () => void }) {
  const [taps, setTaps] = useState(0);
  const [shaking, setShaking] = useState(false);
  const [shattering, setShattering] = useState(false);

  const handleTap = () => {
    if (shattering) return;
    const next = taps + 1;
    setTaps(next);
    setShaking(true);
    window.setTimeout(() => setShaking(false), 200);
    if (next >= TAPS_TO_BREAK) {
      setShattering(true);
      window.setTimeout(onOpen, 480);
    }
  };

  return (
    <div style={{ padding: "8px 16px 4px" }}>
      <button
        type="button"
        onClick={handleTap}
        className={`${shaking ? "anim-ice-shake" : ""} ${shattering ? "anim-ice-shatter" : ""}`}
        style={{
          position: "relative",
          width: "100%",
          height: 220,
          borderRadius: RADIUS_L,
          border: "1px solid rgba(255,255,255,0.75)",
          background: "linear-gradient(160deg, #EAF5FB 0%, #CFE5F1 46%, #AECFE4 100%)",
          boxShadow:
            "0 14px 32px -14px rgba(70,110,150,0.55), inset 0 2px 7px rgba(255,255,255,0.95), inset 0 -12px 20px rgba(120,160,190,0.45)",
          cursor: "pointer",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* frost highlights */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(70% 55% at 24% 10%, rgba(255,255,255,0.72), rgba(255,255,255,0) 60%), radial-gradient(60% 45% at 86% 88%, rgba(255,255,255,0.35), rgba(255,255,255,0) 60%)",
            pointerEvents: "none",
          }}
        />
        {/* gloss streak */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: -30,
            left: "18%",
            width: 70,
            height: 200,
            background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.5), rgba(255,255,255,0))",
            transform: "rotate(20deg)",
            pointerEvents: "none",
          }}
        />
        <CrackOverlay taps={taps} />
        <span
          style={{
            position: "relative",
            zIndex: 3,
            ...typography.buttonNormal,
            color: "#3A5C77",
            textShadow: "0 1px 0 rgba(255,255,255,0.65)",
          }}
        >
          Tap to break the ice
        </span>
      </button>
    </div>
  );
}

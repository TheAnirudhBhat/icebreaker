"use client";

import { typography, FONT_SANS } from "../lib/typography";
import { RADIUS_M } from "../lib/radii";
import { TEXT_PRIMARY, MAIN_PRIMARY, OUTLINE_BOLD } from "../lib/colors";

// The mystery cover face. Tapping triggers the reveal (the flip is driven by the
// parent). `fill` makes it stretch to fill a flip face's full height.
export default function RevealCard({ onReveal, fill = false, name }: { onReveal: () => void; fill?: boolean; name?: string }) {
  return (
    <button
      type="button"
      onClick={onReveal}
      aria-label={name ? `Reveal your icebreakers with ${name}` : "Reveal your icebreakers"}
      className="transition-transform active:scale-[0.98]"
      style={{
        width: "100%",
        height: fill ? "100%" : undefined,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 10,
        background: "#FEFDFC",
        border: `1px solid ${OUTLINE_BOLD}`,
        borderRadius: RADIUS_M,
        boxShadow: "0 6px 18px -13px rgba(26,22,20,0.16)",
        padding: "24px 20px",
        cursor: "pointer",
      }}
    >
      <div style={{ width: 200, height: 153, borderRadius: 12, overflow: "hidden", flexShrink: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/reveal-cover.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <span style={{ ...typography.headerH4, color: TEXT_PRIMARY, maxWidth: 200, textWrap: "balance" }}>Your icebreakers are ready</span>
        <span style={{ fontFamily: FONT_SANS, fontWeight: 400, fontSize: 14, lineHeight: "20px", color: MAIN_PRIMARY }}>Tap to reveal</span>
      </div>
    </button>
  );
}

"use client";

import { FONT_SANS } from "../lib/typography";
import { TEXT_PRIMARY, BG_CARD } from "../lib/colors";
import type { Person } from "../data/match";

// Inline card shown in the chat after you seal your answers, matched to Figma
// 82-1176: a small line-art note icon over the wait copy, in the same shell as the
// in-chat trigger banner (full-width, 1px #CECECC hairline, 10px radius, no shadow).
export default function SealedWaiting({ other }: { other: Person }) {
  return (
    <div
      className="anim-chat-in"
      style={{
        width: "100%",
        background: BG_CARD,
        border: "1px solid #CECECC",
        borderRadius: 10,
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      {/* Icon shown through the same crop window as the Figma frame. */}
      <span style={{ position: "relative", width: 66, height: 62, flexShrink: 0, overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/sealed-icon.png" alt="" style={{ position: "absolute", height: "238.81%", left: "-62.5%", top: "-66.49%", width: "224.48%", maxWidth: "none", display: "block" }} />
      </span>

      <p style={{ fontFamily: FONT_SANS, fontWeight: 400, fontSize: 14, lineHeight: "20px", letterSpacing: "0.07px", color: TEXT_PRIMARY, textAlign: "center", width: 206, margin: 0 }}>
        Icebreakers will be available as soon as {other.name} answers too.
      </p>
    </div>
  );
}

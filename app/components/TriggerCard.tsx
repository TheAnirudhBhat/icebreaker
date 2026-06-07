"use client";

import type { CSSProperties } from "react";
import { FONT_SERIF, FONT_SANS } from "../lib/typography";
import { TEXT_PRIMARY, TEXT_TERTIARY, BG_SHEET, MAIN_PRIMARY, ALPHA_WHITE_FF } from "../lib/colors";
import { GestureNav } from "./AppChrome";

const FEATHER = "radial-gradient(ellipse 86% 84% at 50% 48%, #000 70%, transparent 100%)";

// The three value props share one illustrated sprite sheet, each shown through a
// 24px window (crop offsets lifted straight from the Figma frame).
const PROPS: { crop: CSSProperties; title: string }[] = [
  { crop: { height: "710.78%", left: "-43.19%", top: "-95.86%", width: "1068.08%" }, title: "See the music you both love" },
  { crop: { height: "705.24%", left: "-40.36%", top: "-300.73%", width: "1064.66%" }, title: "Find the friends you share" },
  { crop: { height: "703.14%", left: "-40.36%", top: "-511.52%", width: "1064.66%" }, title: "See the places you'd both love" },
];

// Full-screen explainer for Icebreaker, opened from the in-chat nudge. It sells the
// payoff (what it quietly pulls together) before anyone connects or answers.
export default function TriggerCard({
  onContinue,
}: {
  onContinue: () => void;
}) {
  return (
    <div style={{ background: BG_SHEET, display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "0px 24px 8px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icebreaker-hero.png" alt="" style={{ width: 282, maxWidth: "100%", height: "auto", display: "block", marginTop: -20, WebkitMaskImage: FEATHER, maskImage: FEATHER }} />

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40, width: "100%" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 16 }}>
              <h2 style={{ fontFamily: FONT_SERIF, fontWeight: 600, fontSize: 30, lineHeight: "31px", letterSpacing: "-0.4px", color: TEXT_PRIMARY, margin: 0, maxWidth: 240 }}>
                Break the ice, together
              </h2>
              <p style={{ fontFamily: FONT_SANS, fontWeight: 400, fontSize: 14, lineHeight: "18px", color: TEXT_PRIMARY, margin: 0, padding: "0 8px" }}>
                Connect your music and social apps, both answer a few questions, then see what you have in common.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14, width: 251 }}>
              {PROPS.map((p) => (
                <div key={p.title} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ position: "relative", width: 24, height: 24, overflow: "hidden", flexShrink: 0 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/prop-icons.png" alt="" style={{ position: "absolute", maxWidth: "none", display: "block", ...p.crop }} />
                  </span>
                  <span style={{ fontFamily: FONT_SANS, fontWeight: 700, fontSize: 15, lineHeight: "20px", color: TEXT_PRIMARY }}>{p.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "12px 24px 12px" }}>
        <button
          type="button"
          onClick={onContinue}
          className="transition-transform active:scale-[0.98]"
          style={{ width: "100%", fontFamily: FONT_SANS, fontWeight: 700, fontSize: 14, lineHeight: "20px", color: ALPHA_WHITE_FF, background: MAIN_PRIMARY, border: "none", borderRadius: 25, padding: "14px 18px", cursor: "pointer" }}
        >
          Start Icebreaker
        </button>
        <p style={{ fontFamily: FONT_SANS, fontWeight: 400, fontSize: 11, lineHeight: "16px", color: TEXT_TERTIARY, textAlign: "center", margin: 0 }}>
          By continuing, you agree to our Terms &amp; Privacy Policy.
        </p>
      </div>

      <GestureNav />
    </div>
  );
}

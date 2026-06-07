"use client";

import { Fragment, useEffect, useState } from "react";
import type { Duet } from "../hooks/useDuet";
import { typography, FONT_SANS } from "../lib/typography";
import { TEXT_PRIMARY, TEXT_SECONDARY, TEXT_TERTIARY, BG_CARD, OUTLINE_SUBTLE } from "../lib/colors";

const JUMPS: { id: "trigger" | "connect" | "questions" | "sealed" | "ready" | "reveal"; label: string; desc: string }[] = [
  { id: "trigger", label: "Trigger", desc: "The in-chat nudge to start" },
  { id: "connect", label: "Connect", desc: "Link your apps" },
  { id: "questions", label: "Questions", desc: "Answer the prompts" },
  { id: "sealed", label: "Sealed", desc: "Answered, waiting on them" },
  { id: "ready", label: "Tap to reveal", desc: "Both answered, card not opened" },
  { id: "reveal", label: "Reveal", desc: "Icebreakers revealed" },
];

// Out-of-frame debug drawer: a subtle grey grip pulls out a Hinge-style list to
// jump either phone straight to a state. On first load the grip gives a one-time
// nudge (a small "Jump to a state" tag + a gentle tug) so it's discoverable, then
// quietly settles into the subtle grip once noticed or opened.
export default function ProtoControls({ duet }: { duet: Duet }) {
  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState(true);

  // The discovery hint fades on its own after a few seconds.
  useEffect(() => {
    if (!hint) return;
    const t = window.setTimeout(() => setHint(false), 5000);
    return () => window.clearTimeout(t);
  }, [hint]);

  const showHint = hint && !open;

  return (
    <div style={{ position: "fixed", top: "50%", right: 0, transform: "translateY(-50%)", zIndex: 60, display: "flex", alignItems: "center" }}>
      {/* one-time discovery tag, sits just left of the grip and fades away */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          right: 30,
          top: "50%",
          transform: `translateY(-50%) translateX(${showHint ? 0 : 10}px)`,
          opacity: showHint ? 1 : 0,
          transition: "opacity var(--dur-base) var(--ease), transform var(--dur-base) var(--ease)",
          pointerEvents: "none",
          whiteSpace: "nowrap",
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: BG_CARD,
          border: `1px solid ${OUTLINE_SUBTLE}`,
          borderRadius: 999,
          boxShadow: "0 8px 22px -10px rgba(26,22,20,0.3)",
          padding: "7px 13px",
        }}
      >
        <span style={{ fontFamily: FONT_SANS, fontWeight: 500, fontSize: 12, lineHeight: "16px", color: TEXT_SECONDARY }}>Jump to a state</span>
        <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
          <path d="M6 4l5 5-5 5" stroke={TEXT_TERTIARY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <button
        type="button"
        onClick={() => {
          setHint(false);
          setOpen((o) => !o);
        }}
        aria-label={open ? "Hide jump panel" : "Show jump panel"}
        style={{ flexShrink: 0, width: 22, height: 64, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <span
          className={showHint ? "anim-grip-tug" : undefined}
          style={{
            width: 4,
            height: showHint ? 44 : 36,
            borderRadius: 2,
            background: showHint ? "#ABA9A7" : "#C9C7C5",
            transition: "height var(--dur-base) var(--ease), background var(--dur-base) var(--ease)",
          }}
        />
      </button>

      <div style={{ width: open ? 296 : 0, overflow: "hidden", transition: "width var(--dur-base) var(--ease)" }}>
        <div
          style={{
            width: 296,
            maxHeight: "88vh",
            overflowY: "auto",
            background: BG_CARD,
            borderLeft: `1px solid ${OUTLINE_SUBTLE}`,
            borderTop: `1px solid ${OUTLINE_SUBTLE}`,
            borderBottom: `1px solid ${OUTLINE_SUBTLE}`,
            borderRadius: "14px 0 0 14px",
            padding: "18px 20px",
            boxShadow: "-16px 0 40px -20px rgba(26,22,20,0.3)",
          }}
        >
          <span style={{ ...typography.metadata, color: TEXT_TERTIARY, textTransform: "uppercase", letterSpacing: "0.1em" }}>Jump to a state</span>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 6 }}>
            {JUMPS.map((j, i) => (
              <Fragment key={j.id}>
                {i > 0 && <div style={{ height: 1, background: OUTLINE_SUBTLE }} />}
                <button
                  type="button"
                  onClick={() => duet.debugJump(j.id)}
                  className="transition-transform active:scale-[0.99]"
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, width: "100%", background: "transparent", border: "none", padding: "12px 0", cursor: "pointer", textAlign: "left" }}
                >
                  <span style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
                    <span style={{ fontFamily: FONT_SANS, fontWeight: 500, fontSize: 14, lineHeight: "20px", color: TEXT_PRIMARY }}>{j.label}</span>
                    <span style={{ fontFamily: FONT_SANS, fontWeight: 400, fontSize: 12, lineHeight: "16px", color: TEXT_SECONDARY }}>{j.desc}</span>
                  </span>
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M6 4l5 5-5 5" stroke={TEXT_TERTIARY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import type { Duet } from "../hooks/useDuet";
import { typography } from "../lib/typography";
import {
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  TEXT_TERTIARY,
  BG_CARD,
  OUTLINE_BOLD,
  OUTLINE_SUBTLE,
  MAIN_PRIMARY,
  MAIN_PRIMARY_SUBTLE,
  ALPHA_WHITE_FF,
} from "../lib/colors";
import { RADIUS_L, RADIUS_PILL } from "../lib/radii";

function Pill({ onClick, children, filled }: { onClick: () => void; children: React.ReactNode; filled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="transition-transform active:scale-[0.97]"
      style={{
        ...typography.buttonSmall,
        color: filled ? ALPHA_WHITE_FF : TEXT_PRIMARY,
        background: filled ? MAIN_PRIMARY : "transparent",
        border: `1px solid ${filled ? MAIN_PRIMARY : OUTLINE_BOLD}`,
        borderRadius: RADIUS_PILL,
        padding: "8px 14px",
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
}

function PhaseChip({ label, phase }: { label: string; phase: string }) {
  return (
    <span style={{ ...typography.metadata, color: TEXT_TERTIARY, textTransform: "uppercase", letterSpacing: "0.06em" }}>
      {label}{" "}
      <span style={{ color: TEXT_SECONDARY, background: MAIN_PRIMARY_SUBTLE, padding: "2px 7px", borderRadius: RADIUS_PILL }}>{phase}</span>
    </span>
  );
}

const JUMPS: { id: "trigger" | "connect" | "questions" | "sealed" | "reveal"; label: string }[] = [
  { id: "trigger", label: "Trigger" },
  { id: "connect", label: "Connect" },
  { id: "questions", label: "Questions" },
  { id: "sealed", label: "Sealed" },
  { id: "reveal", label: "Reveal" },
];

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
      <span style={{ ...typography.metadata, color: TEXT_TERTIARY, textTransform: "uppercase", letterSpacing: "0.1em", width: 56 }}>{label}</span>
      {children}
    </div>
  );
}

export default function ProtoControls({ duet }: { duet: Duet }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "fixed", top: "50%", right: 0, transform: "translateY(-50%)", zIndex: 60, display: "flex", alignItems: "center" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Hide director" : "Show director"}
        style={{
          flexShrink: 0,
          width: 26,
          height: 70,
          borderRadius: "10px 0 0 10px",
          border: `1px solid ${OUTLINE_SUBTLE}`,
          borderRight: "none",
          background: BG_CARD,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "-8px 0 22px -16px rgba(26,22,20,0.3)",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ transform: open ? "none" : "rotate(180deg)" }}>
          <path d="M9 3l-4 4 4 4" stroke={TEXT_SECONDARY} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div style={{ width: open ? 340 : 0, overflow: "hidden", transition: "width 0.32s cubic-bezier(0.22,1,0.36,1)" }}>
        <div
          style={{
            width: 340,
            maxHeight: "88vh",
            overflowY: "auto",
            background: BG_CARD,
            borderLeft: `1px solid ${OUTLINE_SUBTLE}`,
            borderTop: `1px solid ${OUTLINE_SUBTLE}`,
            borderBottom: `1px solid ${OUTLINE_SUBTLE}`,
            borderRadius: "12px 0 0 12px",
            padding: 16,
            boxShadow: "-16px 0 40px -20px rgba(26,22,20,0.3)",
          }}
        >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <span style={{ ...typography.metadata, color: TEXT_TERTIARY, textTransform: "uppercase", letterSpacing: "0.1em" }}>Director</span>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <PhaseChip label="you" phase={duet.me.phase} />
          <PhaseChip label="aanya" phase={duet.aanya.phase} />
        </div>
      </div>

      <Row label="Run">
        <Pill onClick={duet.reset}>↺ Replay</Pill>
        <Pill onClick={duet.aanyaAutoPlay} filled>Aanya plays</Pill>
        <Pill onClick={duet.aanyaPass}>Aanya passes</Pill>
      </Row>

      <Row label="Jump">
        {JUMPS.map((j) => (
          <Pill key={j.id} onClick={() => duet.debugJump(j.id)}>
            {j.label}
          </Pill>
        ))}
      </Row>

          <p style={{ ...typography.caption, color: TEXT_TERTIARY, margin: "14px 2px 0", lineHeight: 1.5 }}>
            Play either phone, or run Aanya from here. Jump straight to any state.
          </p>
        </div>
      </div>
    </div>
  );
}

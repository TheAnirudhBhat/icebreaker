"use client";

import { StatusBarSpacer } from "./AppChrome";
import { typography, FONT_SANS } from "../lib/typography";
import { BG_PRIMARY } from "../lib/colors";
import type { Person } from "../data/match";

const TAB_ACTIVE = "rgba(0,0,0,0.9)";

// The Hinge chat header: back + name + overflow, then Chat / Profile tabs.
// On a real device (`onDevice`) the status-bar spacer is dropped, since the
// device's own status bar (and the view's safe-area inset) already clear the top.
export default function MatchHeader({ other, onBack, onDevice = false }: { other: Person; onBack?: () => void; onDevice?: boolean }) {
  return (
    <div style={{ background: BG_PRIMARY, flexShrink: 0 }}>
      {!onDevice && <StatusBarSpacer backgroundColor={BG_PRIMARY} />}
      <div style={{ display: "flex", alignItems: "center", padding: "8px 12px" }}>
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="transition-transform active:scale-[0.92]"
          style={{ width: 40, height: 40, flexShrink: 0, marginRight: -3, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M15 6L9 12L15 18" stroke="rgba(0,0,0,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span style={{ fontFamily: FONT_SANS, fontWeight: 700, fontSize: 20, lineHeight: "24px", letterSpacing: "0.4px", color: "rgba(0,0,0,0.9)", flex: 1 }}>{other.name}</span>
        <button
          type="button"
          aria-label="More"
          style={{ width: 48, height: 48, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="5" cy="12" r="1.9" fill="rgba(0,0,0,0.9)" />
            <circle cx="12" cy="12" r="1.9" fill="rgba(0,0,0,0.9)" />
            <circle cx="19" cy="12" r="1.9" fill="rgba(0,0,0,0.9)" />
          </svg>
        </button>
      </div>

      <div style={{ display: "flex", width: 336, margin: "0 auto", borderBottom: "0.5px solid #DEDEDE" }}>
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <span style={{ ...typography.buttonSmall, color: TAB_ACTIVE, letterSpacing: "0.28px", padding: "12px 16px", borderBottom: `2px solid ${TAB_ACTIVE}`, marginBottom: -1 }}>Chat</span>
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <span style={{ ...typography.buttonSmall, color: "rgba(0,0,0,0.3)", letterSpacing: "0.28px", padding: "12px 16px" }}>Profile</span>
        </div>
      </div>
    </div>
  );
}

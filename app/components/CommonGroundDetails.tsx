"use client";

import { useMemo } from "react";
import { typography } from "../lib/typography";
import { RADIUS_M } from "../lib/radii";
import { TEXT_PRIMARY, TEXT_TERTIARY } from "../lib/colors";
import { commonGround, revealRows } from "../lib/insights";
import type { PlayerState } from "../hooks/useDuet";

// The reveal: a light card of things to go on, a mix of real facts about them and
// where you two line up. In `preview` mode it renders statically (no entrance
// animation, no outer margin) so it can sit behind the opener.
export default function CommonGroundDetails({
  selfState,
  otherState,
  otherName,
  variant,
  preview = false,
  onExpand,
}: {
  selfState: PlayerState;
  otherState: PlayerState;
  otherName: string;
  variant: "flip" | "expand" | "fade";
  preview?: boolean;
  onExpand?: () => void;
}) {
  const tappable = !!onExpand;
  const enterClass = preview ? "" : variant === "flip" ? "anim-flip-in" : variant === "expand" ? "anim-expand-in" : "rev-fade";

  // Only what's fair to show a match: shared overlaps and the answers you both
  // gave, each reframed as something to actually talk about. No private inferences.
  const rows = useMemo(() => {
    const cg = commonGround(selfState.connected, selfState.answers, otherState.connected, otherState.answers);
    return revealRows(cg, otherName);
  }, [selfState, otherState, otherName]);

  return (
    <div className={preview ? "" : "anim-chat-in"} style={{ padding: preview ? 0 : "8px 16px 6px" }}>
      <div
        className={enterClass}
        onClick={tappable ? onExpand : undefined}
        role={tappable ? "button" : undefined}
        style={{
          position: "relative",
          background: "linear-gradient(135deg, rgba(187,167,192,0.08), rgba(187,167,192,0) 55%), #FFFFFF",
          borderRadius: RADIUS_M,
          border: "1px solid rgba(206,206,204,0.5)",
          padding: "24px 24px 26px",
          transformOrigin: "center",
          cursor: tappable ? "pointer" : "default",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 4, marginBottom: 20 }}>
          <span style={{ ...typography.headerH4, color: TEXT_PRIMARY, flex: 1 }}>Icebreakers</span>
          {tappable && (
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
              <path d="M6 4l5 5-5 5" stroke={TEXT_TERTIARY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {rows.map((row, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              {row.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={row.logo} alt="" width={18} height={18} style={{ display: "block", flexShrink: 0, marginTop: 1 }} />
              ) : (
                <span style={{ fontSize: 18, lineHeight: "18px", flexShrink: 0 }}>{row.emoji}</span>
              )}
              <span style={{ ...typography.bodyNormal, fontSize: 14, lineHeight: "20px", color: TEXT_PRIMARY, flex: 1 }}>{row.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

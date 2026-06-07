"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { typography } from "../lib/typography";
import { TEXT_PRIMARY, BG_SHEET } from "../lib/colors";
import { NavButton } from "./AppChrome";
import Avatar from "./Avatar";
import { mockIcebreakers } from "../lib/insights";
import type { PlayerState } from "../hooks/useDuet";
import type { Person } from "../data/match";

// The elaborated common ground, in a content-hugging bottom sheet that opens when
// the reveal card is tapped: each overlap with its detail lines. It sizes to its
// content (GameSheet caps + scrolls only if it ever overflows a page), so a short
// reveal reads as a small sheet rather than a forced full screen.
export default function CommonGroundSheet({
  selfPerson,
  otherPerson,
  otherName,
  onClose,
}: {
  selfState: PlayerState;
  otherState: PlayerState;
  selfPerson: Person;
  otherPerson: Person;
  otherName: string;
  onClose: () => void;
}) {
  // Same hand-picked icebreakers as the inline reveal card, shown in full here.
  const rows = useMemo(() => mockIcebreakers(otherName), [otherName]);

  const rootRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  // Lift the sticky bar with a shadow once content scrolls beneath it.
  useEffect(() => {
    const scroller = rootRef.current?.closest("[data-sheet-scroll]") as HTMLElement | null;
    if (!scroller) return;
    // Only lift the bar once the sheet has expanded to full screen, not while it's
    // still a content-sized sheet mid-scroll.
    const onScroll = () => setScrolled(scroller.dataset.expanded === "true" && scroller.scrollTop > 2);
    scroller.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => scroller.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={rootRef} style={{ background: BG_SHEET, display: "flex", flexDirection: "column" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 5, background: BG_SHEET, display: "flex", justifyContent: "flex-end", padding: "8px 10px 4px", boxShadow: scrolled ? "0 4px 12px -6px rgba(26,22,20,0.22)" : "none", transition: "box-shadow var(--dur-micro) var(--ease)" }}>
        <NavButton kind="close" onClick={onClose} ariaLabel="Close" />
      </div>

      <div style={{ padding: "0 28px 28px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", textAlign: "left", marginBottom: 24 }}>
          <div style={{ display: "flex", marginBottom: 20 }}>
            <div style={{ display: "flex", borderRadius: "50%", border: "3px solid #FFFFFF", position: "relative", zIndex: 1 }}>
              <Avatar name={selfPerson.name} gradient={selfPerson.gradient} photo={selfPerson.photo} size={60} />
            </div>
            <div style={{ display: "flex", borderRadius: "50%", border: "3px solid #FFFFFF", marginLeft: -16 }}>
              <Avatar name={otherPerson.name} gradient={otherPerson.gradient} photo={otherPerson.photo} size={60} />
            </div>
          </div>
          <h2 style={{ ...typography.headerH1, lineHeight: "36px", letterSpacing: "0px", color: TEXT_PRIMARY, margin: 0 }}>Icebreakers</h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {rows.map((row, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              {row.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={row.logo} alt="" width={18} height={18} style={{ display: "block", flexShrink: 0, marginTop: 1 }} />
              ) : (
                <span style={{ width: 18, height: 20, flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 18, lineHeight: 1, marginTop: 2 }}>{row.emoji}</span>
              )}
              <span style={{ ...typography.bodyNormal, fontSize: 14, lineHeight: "20px", color: TEXT_PRIMARY, flex: 1 }}>{row.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import DeviceFrame from "./components/DeviceFrame";
import PlayerPhone from "./components/PlayerPhone";
import ProtoControls from "./components/ProtoControls";
import { useDuet } from "./hooks/useDuet";
import { typography, FONT_SERIF, FONT_SANS } from "./lib/typography";
import { TEXT_PRIMARY, TEXT_SECONDARY, TEXT_TERTIARY, BG_SHEET, OUTLINE_SUBTLE } from "./lib/colors";
import { ME, AANYA } from "./data/match";

// Margin annotation shown OUTSIDE the phone shell while the first device is on the
// connect screen, explaining the webview auth we skipped. Handwriting, text only.
const CONNECT_NOTE =
  "Tapping Connect opens a webview to sign in and authorize each app to share its info with Hinge. Skipped here for the proto.\n\nYou only see this screen the first time you use this feature.";

// Trigger-timing annotation for the in-chat nudge (timings are a starting guess).
const NUDGE_NOTE =
  "The Icebreaker nudge is triggered when someone sits on a new, empty chat without messaging, or comes back to a match they left unanswered. It shows once, and the timing can be experimented with.";

// Shown when someone taps "Write my own" on a question: free-text entry isn't built
// in this proto, so the row surfaces this note instead of opening a keyboard.
const WRITE_OWN_NOTE = "Writing your own answer isn't wired up in this proto.";

// The design notes shown by the top-right info button, mirroring the Figma
// "Design Notes" frame: how the concept was approached, not per-screen mechanics.
const DESIGN_NOTES: string[] = [
  "Designed to feel native to Hinge by closely following its existing patterns, interactions, and visual language.",
  "UI, motion, and interaction decisions were guided by Hinge's design system and product conventions.",
  "Custom illustrations and icons were created with ChatGPT Image Generation and Nano Banana, then refined to match Hinge's visual style.",
  "The React prototype is the recommended way to experience the concept: it shows the complete two-sided interaction flow.",
  "This concept focuses on post-match icebreakers, but the underlying mechanic could extend to lightweight guessing games, question reveals, or other playful formats that spark engagement before a conversation begins.",
];

type Note = { text: string; top: number };

function PhoneColumn({ label, side, note, children }: { label: string; side: "left" | "right"; note?: Note; children: React.ReactNode }) {
  // Keep the last note mounted while it eases out, so margin notes fade in and out
  // instead of popping. `shown` holds the content (incl. through the exit fade);
  // `visible` drives opacity, flipped a frame after mount so the enter transitions too.
  const [shown, setShown] = useState<Note | undefined>(note);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!note) {
      setVisible(false);
      return;
    }
    setShown(note);
    // Double rAF so the element paints at opacity 0 before flipping to 1. A single
    // frame can batch both commits and skip the enter transition (it popped instead
    // of faded, notably on the right column); two frames guarantee the fade.
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setVisible(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note?.text, note?.top]);

  const noteStyle: React.CSSProperties | undefined = shown && {
    position: "absolute",
    top: shown.top,
    width: 220,
    fontFamily: "'Caveat', cursive",
    fontWeight: 500,
    fontSize: 22,
    lineHeight: "27px",
    color: "#9A9A9A",
    pointerEvents: "none",
    opacity: visible ? 1 : 0,
    transition: "opacity var(--dur-base) var(--ease)",
    ...(side === "left"
      ? ({ right: "100%", marginRight: 28, textAlign: "right" } as const)
      : ({ left: "100%", marginLeft: 28, textAlign: "left" } as const)),
  };
  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
      {children}
      <span style={{ ...typography.metadata, color: TEXT_SECONDARY, textTransform: "uppercase", letterSpacing: "0.14em" }}>{label}&apos;s screen</span>
      {shown && noteStyle && (
        <div style={noteStyle}>
          {shown.text.split("\n\n").map((para, i) => (
            <p key={i} style={{ margin: 0, marginTop: i === 0 ? 0 : 14 }}>
              {para}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

// Page-level info modal: a centered Hinge-style card listing the design notes, easing
// and fading in/out. Opened from the top-right info button.
function DesignNotes({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (open) {
      setMounted(true);
      // Double rAF: paint at opacity 0 first so the enter transition actually runs,
      // instead of the browser batching both commits into one frame (an instant pop).
      let raf2 = 0;
      const raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setVisible(true));
      });
      return () => {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
      };
    }
    setVisible(false);
    const t = window.setTimeout(() => setMounted(false), 340);
    return () => window.clearTimeout(t);
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!mounted) return null;
  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 80, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "rgba(26,22,20,0.22)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", opacity: visible ? 1 : 0, transition: "opacity var(--dur-base) var(--ease)" }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Design notes"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 820,
          maxHeight: "90vh",
          overflowY: "auto",
          background: BG_SHEET,
          border: `1px solid ${OUTLINE_SUBTLE}`,
          borderRadius: 24,
          boxShadow: "0 44px 110px -36px rgba(26,22,20,0.5)",
          padding: "52px 60px 60px",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0) scale(1)" : "translateY(10px) scale(0.985)",
          transition: "opacity var(--dur-base) var(--ease), transform var(--dur-base) var(--ease)",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="transition-transform active:scale-[0.94]"
          style={{ position: "absolute", top: 28, right: 28, width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", cursor: "pointer" }}
        >
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
            <path d="M4 4l8 8M12 4l-8 8" stroke={TEXT_SECONDARY} strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </button>

        <h2 style={{ fontFamily: FONT_SERIF, fontWeight: 600, fontSize: 38, lineHeight: "42px", letterSpacing: "-0.6px", color: TEXT_PRIMARY, margin: "0 40px 32px 0" }}>Design Notes</h2>

        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 26 }}>
          {DESIGN_NOTES.map((note, i) => (
            <li key={i} style={{ display: "flex", gap: 14 }}>
              <span aria-hidden style={{ flexShrink: 0, fontFamily: FONT_SANS, fontSize: 18, lineHeight: "28px", color: TEXT_TERTIARY }}>&bull;</span>
              <p style={{ margin: 0, fontFamily: FONT_SANS, fontWeight: 400, fontSize: 18, lineHeight: "28px", color: TEXT_PRIMARY }}>{note}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Page() {
  const duet = useDuet();
  const [notesOpen, setNotesOpen] = useState(false);

  const iceMessages = duet.messages.filter((m) => m.from !== "system").length;
  const bothPlayed = duet.me.submitted && duet.aanya.submitted;
  const connectNote = (pid: "me" | "aanya"): Note | undefined =>
    duet.firstConnector === pid && duet[pid].phase === "connect" && !duet.generating[pid]
      ? { text: CONNECT_NOTE, top: 320 }
      : undefined;
  // Sits by the questions screen only while that phone is mid-game and just tapped it.
  const writeOwnNote = (pid: "me" | "aanya"): Note | undefined =>
    duet.writeOwnId === pid && duet[pid].phase === "playing" ? { text: WRITE_OWN_NOTE, top: 460 } : undefined;
  // The trigger-timing note rides alongside the left phone's first in-chat nudge.
  const meNote: Note | undefined =
    connectNote("me") ?? writeOwnNote("me") ?? (duet.me.phase === "trigger" && !bothPlayed && iceMessages < 5 ? { text: NUDGE_NOTE, top: 480 } : undefined);
  const aanyaNote = connectNote("aanya") ?? writeOwnNote("aanya");

  return (
    <>
      {/* The proto is two phones side by side, so it needs a desktop-width screen.
          On mobile we hide it (CSS, see .mobile-blocker) and show a short note. */}
      <div
        className="mobile-blocker"
        style={{
          minHeight: "100dvh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "40px 32px",
          background: "#FFFFFF",
          gap: 14,
        }}
      >
        <div style={{ fontFamily: FONT_SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 30, letterSpacing: "-0.5px", color: TEXT_PRIMARY }}>
          Icebreaker
        </div>
        <p style={{ fontFamily: FONT_SERIF, fontWeight: 400, fontSize: 19, lineHeight: "27px", color: TEXT_SECONDARY, maxWidth: 300, margin: 0 }}>
          This prototype is best viewed on a desktop. Open it on a larger screen to explore.
        </p>
      </div>
      <main
        className="desktop-app"
        style={{
          position: "relative",
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
          background: "#FFFFFF",
        }}
      >
      <header style={{ position: "absolute", top: 0, left: 0, padding: "24px 36px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ fontFamily: FONT_SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 28, letterSpacing: "-0.5px", color: TEXT_PRIMARY }}>
            Icebreaker
          </div>
          <span style={{ ...typography.caption, color: TEXT_TERTIARY, lineHeight: "16px" }}>a hinge feature concept</span>
        </div>
      </header>

      <button
        type="button"
        onClick={() => setNotesOpen(true)}
        aria-label="Design notes"
        className="transition-transform active:scale-[0.94]"
        style={{ position: "absolute", top: 24, right: 34, zIndex: 55, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", cursor: "pointer" }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path d="M12 11C12.69 11 13.25 11.56 13.25 12.25V15.5801C13.25 16.27 12.69 16.8301 12 16.8301C11.31 16.8301 10.75 16.27 10.75 15.5801V12.25C10.75 11.56 11.31 11 12 11Z" fill={TEXT_SECONDARY} />
          <path d="M12 7.42969C12.6899 7.42969 13.2499 7.9898 13.25 8.67969C13.25 9.36969 12.69 9.92969 12 9.92969C11.31 9.92969 10.75 9.36969 10.75 8.67969C10.7501 7.9898 11.3101 7.42969 12 7.42969Z" fill={TEXT_SECONDARY} />
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2ZM12 4.5C7.86 4.5 4.5 7.86 4.5 12C4.5 16.14 7.86 19.5 12 19.5C16.14 19.5 19.5 16.14 19.5 12C19.5 7.86 16.14 4.5 12 4.5Z" fill={TEXT_SECONDARY} />
        </svg>
      </button>

      <div style={{ display: "flex", gap: 160, alignItems: "flex-start", justifyContent: "center", flexWrap: "wrap" }}>
        <PhoneColumn label={ME.name} side="left" note={meNote}>
          <DeviceFrame>
            <PlayerPhone duet={duet} selfId="me" />
          </DeviceFrame>
        </PhoneColumn>
        <PhoneColumn label={AANYA.name} side="right" note={aanyaNote}>
          <DeviceFrame>
            <PlayerPhone duet={duet} selfId="aanya" />
          </DeviceFrame>
        </PhoneColumn>
      </div>

      <ProtoControls duet={duet} />

      <DesignNotes open={notesOpen} onClose={() => setNotesOpen(false)} />
    </main>
    </>
  );
}

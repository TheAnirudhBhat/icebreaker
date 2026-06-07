"use client";

import { useEffect, useState } from "react";
import DeviceFrame from "./components/DeviceFrame";
import PlayerPhone from "./components/PlayerPhone";
import ProtoControls from "./components/ProtoControls";
import { useDuet } from "./hooks/useDuet";
import { typography, FONT_SERIF } from "./lib/typography";
import { TEXT_PRIMARY, TEXT_SECONDARY, TEXT_TERTIARY } from "./lib/colors";
import { ME, AANYA } from "./data/match";

// Margin annotation shown OUTSIDE the phone shell while the first device is on the
// connect screen, explaining the webview auth we skipped. Handwriting, text only.
const CONNECT_NOTE =
  "Tapping Connect opens a webview to sign in and authorize each app to share its info with Hinge. Skipped here for the proto.\n\nYou only see this screen the first time you use this feature.";

// Trigger-timing annotation for the in-chat nudge (timings are a starting guess).
const NUDGE_NOTE =
  "Triggered when someone sits on an empty chat without messaging, or returns to one they left unanswered. Timing still to be worked out.";

// Shown when someone taps "Write my own" on a question: free-text entry isn't built
// in this proto, so the row surfaces this note instead of opening a keyboard.
const WRITE_OWN_NOTE = "Writing your own answer isn't wired up in this proto.";

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

export default function Page() {
  const duet = useDuet();

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
    </main>
    </>
  );
}

"use client";

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
  "Tapping Connect opens a webview to sign in and authorize each app to share its info with Hinge. Skipped here for the proto.\n\nConnecting is a one-time step.";

// Trigger-timing annotation for the in-chat nudge (timings are a starting guess).
const NUDGE_NOTE =
  "This nudge fires after a couple minutes on the chat, or when someone opens it, doesn't reply, then comes back hours later. Timing is a guess we can tune.";

type Note = { text: string; top: number };

function PhoneColumn({ label, side, note, children }: { label: string; side: "left" | "right"; note?: Note; children: React.ReactNode }) {
  const noteStyle: React.CSSProperties | undefined = note && {
    position: "absolute",
    top: note.top,
    width: 220,
    fontFamily: "'Caveat', cursive",
    fontWeight: 500,
    fontSize: 22,
    lineHeight: "27px",
    color: "#9A9A9A",
    pointerEvents: "none",
    ...(side === "left"
      ? ({ right: "100%", marginRight: 28, textAlign: "right" } as const)
      : ({ left: "100%", marginLeft: 28, textAlign: "left" } as const)),
  };
  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
      {children}
      <span style={{ ...typography.metadata, color: TEXT_SECONDARY, textTransform: "uppercase", letterSpacing: "0.14em" }}>{label}&apos;s screen</span>
      {note && noteStyle && (
        <div style={noteStyle}>
          {note.text.split("\n\n").map((para, i) => (
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
    duet.firstConnector === pid && duet[pid].phase === "connect" && duet.generatingId !== pid
      ? { text: CONNECT_NOTE, top: 320 }
      : undefined;
  // The trigger-timing note rides alongside the left phone's first in-chat nudge.
  const meNote: Note | undefined =
    connectNote("me") ?? (duet.me.phase === "trigger" && !bothPlayed && iceMessages < 5 ? { text: NUDGE_NOTE, top: 480 } : undefined);
  const aanyaNote = connectNote("aanya");

  return (
    <main
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
  );
}

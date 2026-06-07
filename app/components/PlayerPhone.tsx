"use client";

import { useEffect, useRef, useState } from "react";
import type { Duet, PlayerId } from "../hooks/useDuet";
import { typography, FONT_SANS } from "../lib/typography";
import {
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  TEXT_TERTIARY,
  BG_PRIMARY,
  BG_SECONDARY,
  BG_CARD,
  BG_SHEET,
  MAIN_PRIMARY,
  MAIN_PRIMARY_SUBTLE,
  OUTLINE_BOLD,
  OUTLINE_SUBTLE,
  ALPHA_WHITE_FF,
} from "../lib/colors";
import { RADIUS_PILL, RADIUS_M } from "../lib/radii";
import { AppBar, NavButton, GestureNav, StatusBar, BOTTOM_INSET } from "./AppChrome";
import MatchHeader from "./MatchHeader";
import Avatar from "./Avatar";
import TriggerCard from "./TriggerCard";
import ChatStart from "./ChatStart";
import ConnectStep from "./ConnectStep";
import IcebreakerStory from "./IcebreakerStory";
import SealedWaiting from "./SealedWaiting";
import GameSheet from "./GameSheet";
import RevealCard from "./RevealCard";
import IceBreak from "./IceBreak";
import CommonGroundDetails from "./CommonGroundDetails";
import CommonGroundSheet from "./CommonGroundSheet";
import RevealSlot from "./RevealSlot";
import MockKeyboard from "./MockKeyboard";
import { ME, AANYA, type Person } from "../data/match";

const KEYBOARD_HEIGHT = 300;

// A Hinge iOS push that drops in below the Dynamic Island the moment the other
// person submits their answers.
function PushBanner({ body, onTap, onDismiss }: { body: string; onTap: () => void; onDismiss: () => void }) {
  // iOS-style banner: drag up past a threshold flings it off the top and dismisses;
  // a small drag snaps back; a plain tap opens the Icebreaker.
  const [dy, setDy] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [touched, setTouched] = useState(false);
  const startY = useRef(0);
  const moved = useRef(false);

  // iOS temp banners auto-dismiss after a few seconds; slide it away on a timer
  // unless the user has already grabbed it.
  useEffect(() => {
    if (touched) return;
    const t = window.setTimeout(() => {
      setTouched(true);
      setExiting(true);
    }, 8000);
    return () => window.clearTimeout(t);
  }, [touched]);

  return (
    <div
      className={touched ? undefined : "anim-push-down"}
      onPointerDown={(e) => {
        startY.current = e.clientY;
        moved.current = false;
        setTouched(true);
        setDragging(true);
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (!dragging) return;
        const d = e.clientY - startY.current;
        if (Math.abs(d) > 6) moved.current = true;
        setDy(Math.min(0, d)); // only allow upward travel
      }}
      onPointerUp={() => {
        if (!dragging) return;
        setDragging(false);
        if (dy < -36) setExiting(true);
        else {
          setDy(0);
          if (!moved.current) onTap();
        }
      }}
      onPointerCancel={() => {
        setDragging(false);
        setDy(0);
      }}
      onTransitionEnd={(e) => {
        if (exiting && e.propertyName === "transform") onDismiss();
      }}
      style={{
        position: "absolute",
        top: 56,
        left: 10,
        right: 10,
        zIndex: 52,
        touchAction: "none",
        transform: touched ? `translateY(${exiting ? -180 : dy}px)` : undefined,
        opacity: exiting ? 0 : 1,
        transition: dragging ? "none" : "transform 0.32s cubic-bezier(0.4, 0, 1, 1), opacity 0.3s ease",
      }}
    >
      <button
        type="button"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onTap();
        }}
        className="transition-transform active:scale-[0.99]"
        style={{ width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 11, background: "rgba(250,250,252,0.98)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 22, padding: "12px 14px", boxShadow: "0 22px 46px -16px rgba(26,22,20,0.5)", cursor: "pointer" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hinge-icon.png" alt="Hinge" width={40} height={40} style={{ display: "block", flexShrink: 0, borderRadius: 10 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <span style={{ ...typography.buttonSmall, fontSize: 13, color: TEXT_PRIMARY }}>Hinge</span>
            <span style={{ ...typography.caption, color: TEXT_TERTIARY }}>now</span>
          </div>
          <div style={{ ...typography.bodySmall, color: TEXT_PRIMARY, marginTop: 1 }}>
            {body}
          </div>
        </div>
      </button>
    </div>
  );
}

function SystemNote({ text }: { text: string }) {
  return (
    <div className="anim-chat-in" style={{ display: "flex", justifyContent: "center", padding: "6px 22px" }}>
      <div style={{ ...typography.caption, color: TEXT_SECONDARY, background: BG_SECONDARY, border: `1px solid ${OUTLINE_SUBTLE}`, borderRadius: RADIUS_M, padding: "10px 14px", textAlign: "center", maxWidth: 280 }}>
        {text}
      </div>
    </div>
  );
}

function MeBubble({ text }: { text: string }) {
  return (
    <div className="anim-chat-in" style={{ display: "flex", justifyContent: "flex-end", padding: "3px 16px" }}>
      <div style={{ ...typography.bodyNormal, color: ALPHA_WHITE_FF, background: MAIN_PRIMARY, borderRadius: 20, borderBottomRightRadius: 6, padding: "9px 14px", maxWidth: "76%" }}>
        {text}
      </div>
    </div>
  );
}

function TheirBubble({ text, person }: { text: string; person: Person }) {
  return (
    <div className="anim-chat-in" style={{ display: "flex", alignItems: "flex-end", gap: 4, padding: "3px 16px 3px 14px" }}>
      <Avatar name={person.name} gradient={person.gradient} size={24} photo={person.photo} />
      <div style={{ ...typography.bodyNormal, color: TEXT_PRIMARY, background: "#EEEEEE", borderRadius: 20, borderBottomLeftRadius: 6, padding: "9px 14px", maxWidth: "72%" }}>
        {text}
      </div>
    </div>
  );
}

// A chat day/time separator (Figma 107-2139): Modern Era 12px, #AFADAB, centered.
// Sits above each card that drops into the thread (nudge, sealed wait, reveal).
function ChatTimestamp() {
  return (
    <p style={{ fontFamily: FONT_SANS, fontWeight: 400, fontSize: 12, lineHeight: "16px", color: "#AFADAB", textAlign: "center", margin: 0 }}>
      Today 1:45 PM
    </p>
  );
}

export default function PlayerPhone({ duet, selfId }: { duet: Duet; selfId: PlayerId }) {
  const self = duet[selfId];
  const otherId: PlayerId = selfId === "me" ? "aanya" : "me";
  const other = duet[otherId];
  const selfPerson = selfId === "me" ? ME : AANYA;
  const otherPerson = selfId === "me" ? AANYA : ME;
  const phase = self.phase;

  const [draft, setDraft] = useState("");
  const [kbVisible, setKbVisible] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [pushDismissed, setPushDismissed] = useState(false);
  const [readyPush, setReadyPush] = useState(false);
  const prevOtherSubmitted = useRef(other.submitted);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // The message box stays visible throughout (the sheets float over the chat).
  // It only hides during the deep game steps where the sheet is the whole focus.
  const showInput = phase !== "connect" && phase !== "playing";
  const bothPlayed = self.submitted && other.submitted;
  // The in-chat nudge stays until the game is played or the ice is clearly broken.
  const iceMessages = duet.messages.filter((m) => m.from !== "system").length;
  const nudgeVisible = (phase === "trigger" || phase === "dismissed" || phase === "chat" || phase === "intro" || phase === "connect" || phase === "playing") && !bothPlayed && iceMessages < 5;
  // The push fires when the other person has submitted but you haven't played yet.
  const pushVisible = other.submitted && !self.submitted && phase !== "intro" && phase !== "connect" && phase !== "playing";
  const vis = duet.visibleFor(self.connected);
  const currentPrompt = vis[self.index];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    // Glide first, then snap a few times as late layout settles (entrance anims,
    // card growth) so the newest message/card always lands fully above the compose
    // bar instead of hiding behind it, and both phones converge to the same spot.
    // Snaps are instant, so they never fight the glide or read as jerky.
    const snaps = [120, 350, 700].map((d) =>
      window.setTimeout(() => el.scrollTo({ top: el.scrollHeight, behavior: "auto" }), d)
    );
    return () => snaps.forEach((t) => window.clearTimeout(t));
  }, [duet.messages, phase, revealed, nudgeVisible, bothPlayed]);

  // Keyboard open/close gets its own single smooth scroll, fired after the chat's
  // padding transition (250ms) finishes, so it never competes with the content
  // scroll above (that competition was the "two jerky motions").
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const t = window.setTimeout(() => el.scrollTo({ top: el.scrollHeight, behavior: "smooth" }), 280);
    return () => window.clearTimeout(t);
  }, [kbVisible]);

  useEffect(() => {
    if (!bothPlayed) {
      setRevealed(false);
      setReadyPush(false);
    }
  }, [bothPlayed]);

  // The other person just finished, and you'd already submitted: your Icebreaker is
  // ready. Fire a push for the one who was waiting (not the one who just answered).
  useEffect(() => {
    if (other.submitted && !prevOtherSubmitted.current && self.submitted && !revealed) {
      setReadyPush(true);
    }
    prevOtherSubmitted.current = other.submitted;
  }, [other.submitted, self.submitted, revealed]);

  useEffect(() => {
    if (duet.revealNonce > 0) setRevealed(true);
  }, [duet.revealNonce]);

  // A swiped-away push stays gone until the condition clears (you play, or a new
  // round), at which point a fresh push may surface again.
  useEffect(() => {
    if (!pushVisible) setPushDismissed(false);
  }, [pushVisible]);

  const handleSend = () => {
    const t = draft.trim();
    if (!t) return;
    duet.sendMessage(selfId, t);
    if (phase === "silent" || phase === "trigger" || phase === "dismissed") duet.openChat(selfId);
    setDraft("");
  };

  return (
    <div style={{ height: "100%", position: "relative", background: BG_PRIMARY, overflow: "hidden" }}>
      {pushVisible && !pushDismissed && (
        <PushBanner
          body={`${otherPerson.name} started a conversation with Icebreaker. Answer yours to reveal.`}
          onTap={() => duet.startIntro(selfId)}
          onDismiss={() => setPushDismissed(true)}
        />
      )}
      {readyPush && (
        <PushBanner
          body={`${otherPerson.name} answered too. Your Icebreaker is ready.`}
          onTap={() => {
            setRevealed(true);
            setReadyPush(false);
          }}
          onDismiss={() => setReadyPush(false)}
        />
      )}
      <div style={{ height: "100%", display: "flex", flexDirection: "column", paddingBottom: kbVisible ? KEYBOARD_HEIGHT : 0, transition: "padding-bottom 250ms cubic-bezier(0.4,0,0.2,1)" }}>
        <MatchHeader other={otherPerson} onBack={duet.reset} />

        <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", paddingBottom: kbVisible ? 16 : 24 }}>
          {/* the like + start-chat history stays through every phase */}
          <ChatStart self={selfPerson} other={otherPerson} />

          {nudgeVisible && (
            <div className="anim-chat-in" style={{ padding: "24px 24px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
              <ChatTimestamp />
              <div
                role="button"
                tabIndex={0}
                onClick={() => duet.startIntro(selfId)}
                className="transition-transform active:scale-[0.99]"
                style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 12, background: BG_CARD, border: "1px solid #CECECC", borderRadius: 10, padding: "20px 24px", cursor: "pointer" }}
              >
                <span style={{ position: "relative", width: 110, height: 56, overflow: "hidden", flexShrink: 0 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/nudge-icon.png" alt="" style={{ position: "absolute", height: "242.42%", left: "-43.34%", top: "-71.21%", width: "186.67%", maxWidth: "none", display: "block" }} />
                </span>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ fontFamily: FONT_SANS, fontWeight: 700, fontSize: 14, lineHeight: "24px", letterSpacing: "0.07px", color: "#0E0D10" }}>
                    {other.submitted ? `${otherPerson.name} started an Icebreaker` : "See what you two have in common"}
                  </div>
                  <span style={{ fontFamily: FONT_SANS, fontWeight: 700, fontSize: 12, lineHeight: "15px", color: "#66295F" }}>
                    {other.submitted ? "Answer now" : "Try Icebreaker"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {phase === "sealed" && (
            <div style={{ padding: "24px 24px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
              <ChatTimestamp />
              <SealedWaiting other={otherPerson} />
            </div>
          )}

          {(phase === "sealed" || phase === "chat") && (
            <div style={{ paddingTop: phase === "chat" ? 10 : 4, paddingBottom: 0 }}>
              {phase === "chat" && bothPlayed && (
                <div style={{ display: "flex", justifyContent: "center", padding: "0 24px 8px" }}>
                  <ChatTimestamp />
                </div>
              )}
              {phase === "chat" && bothPlayed && (
                duet.revealStyle === "ice" ? (
                  <RevealSlot revealed={revealed}>
                    {revealed ? (
                      <CommonGroundDetails selfState={self} otherState={other} otherName={otherPerson.name} variant={duet.revealAnim} onExpand={() => setDetailsOpen(true)} />
                    ) : (
                      <IceBreak onOpen={() => setRevealed(true)} />
                    )}
                  </RevealSlot>
                ) : duet.revealStyle === "stretch" ? (
                  // The cover opens the full Icebreaker sheet (the sheet's slide-up is the stretch).
                  <div style={{ position: "relative", padding: "8px 24px 16px" }}>
                    {revealed ? (
                      <CommonGroundDetails preview selfState={self} otherState={other} otherName={otherPerson.name} variant={duet.revealAnim} onExpand={() => setDetailsOpen(true)} />
                    ) : (
                      <RevealCard name={otherPerson.name} onReveal={() => setRevealed(true)} />
                    )}
                  </div>
                ) : (
                  // A true 3D flip. Canonical setup: an invisible content spacer sets the
                  // card height, both faces are absolute with hidden backfaces, perspective
                  // lives on the parent. Tapping rotates the card to present the details.
                  <div style={{ padding: "8px 24px 16px", perspective: 1400 }}>
                    <div
                      style={{
                        position: "relative",
                        transformStyle: "preserve-3d",
                        transition: "transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)",
                        transform: revealed ? "rotateY(180deg)" : "none",
                      }}
                    >
                      {/* invisible spacer: sizes the card to the details content */}
                      <div aria-hidden style={{ visibility: "hidden" }}>
                        <CommonGroundDetails preview selfState={self} otherState={other} otherName={otherPerson.name} variant={duet.revealAnim} onExpand={() => setDetailsOpen(true)} />
                      </div>
                      {/* front face = the cover */}
                      <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", pointerEvents: revealed ? "none" : "auto" }}>
                        <RevealCard fill name={otherPerson.name} onReveal={() => setRevealed(true)} />
                      </div>
                      {/* back face = the details */}
                      <div style={{ position: "absolute", inset: 0, transform: "rotateY(180deg)", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", pointerEvents: revealed ? "auto" : "none" }}>
                        <CommonGroundDetails preview selfState={self} otherState={other} otherName={otherPerson.name} variant={duet.revealAnim} onExpand={() => setDetailsOpen(true)} />
                      </div>
                    </div>
                  </div>
                )
              )}
              {duet.messages.map((m) =>
                m.from === "system" ? (
                  <SystemNote key={m.id} text={m.text} />
                ) : m.from === selfId ? (
                  <MeBubble key={m.id} text={m.text} />
                ) : (
                  <TheirBubble key={m.id} text={m.text} person={otherPerson} />
                )
              )}
              {phase === "chat" && bothPlayed && duet.messages.length >= 4 && (
                <div style={{ display: "flex", justifyContent: "center", padding: "14px 16px 4px" }}>
                  <button
                    type="button"
                    onClick={() => duet.startNewRound(selfId)}
                    className="transition-transform active:scale-[0.98]"
                    style={{ ...typography.buttonSmall, color: MAIN_PRIMARY, background: MAIN_PRIMARY_SUBTLE, border: `1px solid ${OUTLINE_SUBTLE}`, borderRadius: RADIUS_PILL, padding: "10px 18px", cursor: "pointer" }}
                  >
                    Play another round
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {showInput && (
          <div
            style={{
              position: "relative",
              zIndex: 31,
              background: BG_PRIMARY,
              // Keyboard up: drop the home-indicator inset so the input sits ~24px
              // above the keyboard's top edge instead of leaving a dead gap.
              padding: `16px 14px ${kbVisible ? 10 : BOTTOM_INSET}px`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onFocus={() => setKbVisible(true)}
                onBlur={() => setKbVisible(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
                placeholder="Send a message"
                style={{ flex: 1, height: 44, ...typography.bodyNormal, color: TEXT_PRIMARY, background: "transparent", border: `1px solid ${OUTLINE_BOLD}`, borderRadius: RADIUS_PILL, padding: "0 18px", outline: "none" }}
              />
              {draft.trim() ? (
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleSend}
                  aria-label="Send"
                  style={{ width: 44, height: 44, flexShrink: 0, borderRadius: "50%", border: "none", background: MAIN_PRIMARY, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 18px -8px rgba(101,32,88,0.7)" }}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 14V5M5 9l4-4 4 4" stroke={ALPHA_WHITE_FF} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              ) : (
                <div
                  aria-hidden
                  style={{ width: 44, height: 44, flexShrink: 0, borderRadius: "50%", background: "#EEEEEE", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="9" y="3" width="6" height="11" rx="3" stroke={TEXT_SECONDARY} strokeWidth="1.8" />
                    <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7" stroke={TEXT_SECONDARY} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        )}

        {!kbVisible && <GestureNav />}
      </div>

      {showInput && <MockKeyboard visible={kbVisible} />}

      <GameSheet
        open={phase === "intro" || phase === "connect" || phase === "playing"}
        onClose={() => duet.dismiss(selfId)}
        variant={duet.sheetStyle}
        fullHeight={phase === "intro" || phase === "connect" || phase === "playing"}
      >
        {/* One sheet that morphs between steps. The app bar is shared and stays put;
            only the step content below it slides in horizontally on phase change. */}
        <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <AppBar
            backgroundColor={BG_SHEET}
            leading={
              phase === "playing" && self.index > 0 ? (
                <NavButton kind="back" onClick={() => duet.goBack(selfId)} ariaLabel="Previous question" />
              ) : (
                <span style={{ width: 48 }} />
              )
            }
            trailing={<NavButton kind="close" onClick={() => duet.dismiss(selfId)} ariaLabel="Close" />}
          />
          <div key={`step-${phase}`} className={phase === "intro" ? undefined : "anim-push-in"} style={{ flex: 1, minHeight: 0 }}>
            {phase === "intro" && <TriggerCard onContinue={() => duet.startGame(selfId)} />}
            {phase === "connect" && (
              <ConnectStep
                connected={self.connected}
                onToggle={(s) => duet.toggleConnect(selfId, s)}
                onContinue={() => duet.finishConnect(selfId)}
                onBeginGenerate={() => duet.beginGenerating(selfId)}
              />
            )}
            {phase === "playing" && currentPrompt && (
              <IcebreakerStory
                prompt={currentPrompt}
                currentIndex={self.index}
                total={vis.length}
                currentAnswer={self.answers[currentPrompt.id]}
                onAnswer={(pid, a) => duet.answer(selfId, pid, a)}
              />
            )}
          </div>
        </div>
      </GameSheet>


      <GameSheet open={detailsOpen} onClose={() => setDetailsOpen(false)} variant={duet.sheetStyle}>
        <CommonGroundSheet selfState={self} otherState={other} selfPerson={selfPerson} otherPerson={otherPerson} otherName={otherPerson.name} onClose={() => setDetailsOpen(false)} />
      </GameSheet>

      {/* the iOS status bar is fixed: one overlay above everything (chat + sheets) */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 50 }}>
        <StatusBar backgroundColor="transparent" />
      </div>
    </div>
  );
}

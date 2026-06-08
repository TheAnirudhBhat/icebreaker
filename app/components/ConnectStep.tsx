"use client";

import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { typography, FONT_SERIF, FONT_SANS } from "../lib/typography";
import {
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  BG_SHEET,
  MAIN_PRIMARY,
  ALPHA_WHITE_FF,
} from "../lib/colors";
import { RADIUS_PILL } from "../lib/radii";
import { GestureNav, OnDeviceContext } from "./AppChrome";
import { SERVICES, type ServiceId } from "../data/connects";
import dynamic from "next/dynamic";
import hingeLoader from "../data/hinge-loader.json";

// Lottie touches `document`, so load the player client-only.
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const DIVIDER = "rgba(26,22,20,0.08)";

// The loader cycles this copy so it reads like the system is genuinely working
// through both profiles before it hands over the questions.
const GEN_STEPS = [
  "Analyzing your profiles",
  "Reading your music taste",
  "Generating your questions",
];

export default function ConnectStep({
  connected,
  onToggle,
  onContinue,
  onBeginGenerate,
}: {
  connected: Record<ServiceId, boolean>;
  onToggle: (s: ServiceId) => void;
  onContinue: () => void;
  onBeginGenerate?: () => void;
}) {
  const [connecting, setConnecting] = useState<ServiceId[]>([]);
  const [generating, setGenerating] = useState(false);
  const [genStep, setGenStep] = useState(0);
  const [lottieReady, setLottieReady] = useState(false);
  const anyConnected = (Object.values(connected) as boolean[]).some(Boolean);
  // On the single-phone device view the loader read too high; nudge it ~12px lower
  // so it sits visually centered. Desktop is left as-is.
  const onDevice = useContext(OnDeviceContext);

  const genStepRef = useRef(0);

  // Warm the Lottie chunk on mount so the loader's first frame is ready instantly.
  useEffect(() => {
    void import("lottie-react");
  }, []);

  const handleGenerate = () => {
    if (generating) return;
    onBeginGenerate?.();
    genStepRef.current = 0;
    setGenStep(0);
    setGenerating(true);
  };

  // Advance one status line per full Lottie loop, then hand over after the last line
  // has had its own loop, so the loader plays a few seamless loops before questions.
  const handleLoop = () => {
    const next = genStepRef.current + 1;
    if (next >= GEN_STEPS.length) {
      onContinue();
      return;
    }
    genStepRef.current = next;
    setGenStep(next);
  };

  // Safety net in case the Lottie never loops (fails to load): still proceed.
  useEffect(() => {
    if (!generating) return;
    const t = window.setTimeout(onContinue, 8000);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generating]);

  // Reveal the icon and the status line together: keep the loader hidden until the
  // Lottie DOM is ready (onDOMLoaded), with a short safety reveal so it never blanks.
  useEffect(() => {
    if (!generating) {
      setLottieReady(false);
      return;
    }
    const t = window.setTimeout(() => setLottieReady(true), 300);
    return () => window.clearTimeout(t);
  }, [generating]);

  // Mock the OAuth round-trip: tap -> brief loader -> connected tick.
  const handleRow = (id: ServiceId) => {
    if (connected[id]) {
      onToggle(id);
      return;
    }
    if (connecting.includes(id)) return;
    setConnecting((c) => [...c, id]);
    window.setTimeout(() => {
      onToggle(id);
      setConnecting((c) => c.filter((x) => x !== id));
    }, 1000);
  };

  // Mock the question-generation step as a generic full-screen loader.
  if (generating) {
    return (
      <div key="gen" className="anim-push-in" style={{ display: "flex", flexDirection: "column", height: "100%", background: BG_SHEET }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: "24px", paddingBottom: onDevice ? 126 : 150, opacity: lottieReady ? 1 : 0, transition: "opacity var(--dur-entrance) var(--ease)" }}>
          <div style={{ width: 150, height: 124, display: "flex" }}>
            <Lottie animationData={hingeLoader} loop autoplay onDOMLoaded={() => setLottieReady(true)} onLoopComplete={handleLoop} style={{ width: "100%", height: "100%" }} />
          </div>
          {/* Reserve two lines of height so swapping status lines never shifts the loader. */}
          <span key={genStep} className="anim-soft-in" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 48, fontFamily: FONT_SANS, fontWeight: 600, fontSize: 18, lineHeight: "24px", color: TEXT_PRIMARY, textAlign: "center", maxWidth: 160 }}>{GEN_STEPS[genStep]}</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: BG_SHEET }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 24px 8px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <h2 style={{ fontFamily: FONT_SERIF, fontWeight: 600, fontSize: 30, lineHeight: "31px", letterSpacing: "-0.5px", color: TEXT_PRIMARY, margin: 0 }}>
              Connect your vibes
            </h2>
            <p style={{ fontFamily: FONT_SANS, fontWeight: 400, fontSize: 14, lineHeight: "18px", color: TEXT_PRIMARY, margin: 0 }}>
              Connect more for sharper questions and more in common. Disconnect anytime in settings.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            {SERVICES.map((s, idx) => {
              const on = connected[s.id];
              const loading = connecting.includes(s.id);
              return (
                <Fragment key={s.id}>
                  {idx > 0 && <div style={{ height: 1, background: DIVIDER }} />}
                  <button
                    type="button"
                    onClick={() => handleRow(s.id)}
                    className="transition-transform active:scale-[0.99]"
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, width: "100%", background: "transparent", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s.logo} alt="" width={32} height={32} style={{ display: "block", flexShrink: 0 }} />
                      <span style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
                        {/* Modern Era ships no Semibold; a 0.2px same-color stroke fakes
                            the Figma weight (jugaad) without a heavier font cut. */}
                        <span style={{ fontFamily: FONT_SANS, fontWeight: 400, fontSize: 14, lineHeight: "20px", color: "#2C2827", WebkitTextStroke: "0.2px #2C2827" }}>{s.name}</span>
                        <span style={{ fontFamily: FONT_SANS, fontWeight: 400, fontSize: 12, lineHeight: "16px", color: TEXT_SECONDARY }}>{s.unlocks}</span>
                      </span>
                    </span>
                    {on ? (
                      <span className="anim-reveal-pop" style={{ width: 22, height: 22, borderRadius: "50%", background: MAIN_PRIMARY, display: "grid", placeItems: "center", flexShrink: 0 }}>
                        {/* Path bbox centered in the viewBox (y was ~0.5 low); display:block drops the inline gap. */}
                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" style={{ display: "block" }}>
                          <path d="M2.5 7L6 10.5L11.5 3.5" stroke={ALPHA_WHITE_FF} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    ) : loading ? (
                      <span className="anim-spin" style={{ width: 20, height: 20, flexShrink: 0, display: "flex" }}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <circle cx="10" cy="10" r="8" stroke="rgba(101,32,88,0.18)" strokeWidth="2.4" />
                          <path d="M10 2a8 8 0 0 1 8 8" stroke={MAIN_PRIMARY} strokeWidth="2.4" strokeLinecap="round" />
                        </svg>
                      </span>
                    ) : (
                      <span style={{ fontFamily: FONT_SANS, fontWeight: 700, fontSize: 12, lineHeight: "15px", color: "#181818", background: "#EFEFEF", padding: "6px 12px", borderRadius: RADIUS_PILL, flexShrink: 0 }}>Connect</span>
                    )}
                  </button>
                </Fragment>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ flexShrink: 0, padding: "12px 24px 8px" }}>
        <button
          type="button"
          onClick={handleGenerate}
          className="transition-transform active:scale-[0.98]"
          style={
            anyConnected
              ? { width: "100%", fontFamily: FONT_SANS, fontWeight: 700, fontSize: 14, lineHeight: "20px", color: ALPHA_WHITE_FF, background: MAIN_PRIMARY, border: "none", borderRadius: 25, padding: "14px 18px", cursor: "pointer" }
              : { width: "100%", fontFamily: FONT_SANS, fontWeight: 700, fontSize: 14, lineHeight: "20px", color: TEXT_SECONDARY, background: "transparent", border: "none", borderRadius: 25, padding: "14px 18px", cursor: "pointer" }
          }
        >
          {anyConnected ? "Generate questions" : "Skip to questions"}
        </button>
      </div>

      <GestureNav />
    </div>
  );
}

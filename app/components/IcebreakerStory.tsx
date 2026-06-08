"use client";

import { useEffect, useRef, useState } from "react";
import { FONT_SERIF, FONT_SANS } from "../lib/typography";
import { TEXT_PRIMARY, BG_SHEET, MAIN_PRIMARY, ALPHA_WHITE_FF } from "../lib/colors";
import { GestureNav } from "./AppChrome";
import MockKeyboard from "./MockKeyboard";
import { maxSelectFor } from "../data/prompts";
import type { Answer } from "../data/match";
import type { Prompt } from "../data/prompts";

const SUBTLE_INK = "rgba(26,22,20,0.08)";
const MUTED = "#ABACA9";
const KB_H = 290; // mock keyboard height; the write-my-own sheet rests just above it

const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

// The deck-position tracker. It lives above the sliding question, so it stays put
// and only the dots update as you move through.
function Pagination({ total, current }: { total: number; current: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 11, height: 38 }}>
      {Array.from({ length: total }).map((_, i) => {
        const isCur = i === current;
        const done = i < current;
        return (
          <span
            key={i}
            style={{
              width: isCur ? 38 : 7,
              height: isCur ? 38 : 7,
              borderRadius: "50%",
              background: isCur ? "transparent" : done ? "#1B1B1B" : "#DEDFDC",
              boxShadow: isCur ? `inset 0 0 0 2px ${TEXT_PRIMARY}` : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              flexShrink: 0,
              // Brand --ease is too dramatic for this small size morph; a smooth ease-out reads better.
              transition: "width var(--dur-entrance) cubic-bezier(0.22, 1, 0.36, 1), height var(--dur-entrance) cubic-bezier(0.22, 1, 0.36, 1), background-color var(--dur-base) var(--ease), box-shadow var(--dur-base) var(--ease)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, opacity: isCur ? 1 : 0, transition: "opacity var(--dur-micro) var(--ease)" }}>
              <circle cx="12" cy="8.5" r="3.4" stroke={TEXT_PRIMARY} strokeWidth="1.7" />
              <path d="M5.8 19a6.2 6.2 0 0 1 12.4 0" stroke={TEXT_PRIMARY} strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </span>
        );
      })}
    </div>
  );
}

// Square checkbox for multi-select, round radio for single-select.
function Indicator({ multi, checked }: { multi: boolean; checked: boolean }) {
  const radius = multi ? 5 : "50%";
  if (!checked) {
    return <span style={{ width: 18, height: 18, borderRadius: radius, background: "#F1F1F1", flexShrink: 0 }} />;
  }
  return (
    <span style={{ width: 18, height: 18, borderRadius: radius, background: MAIN_PRIMARY, display: "grid", placeItems: "center", flexShrink: 0 }}>
      {/* Path bbox centered in the viewBox (was 0.5 low); display:block drops the inline
          baseline gap so the tick stays centered under the device transform scale. */}
      <svg width="11" height="11" viewBox="0 0 14 14" fill="none" style={{ display: "block" }}>
        <path d="M2.5 7L6 10.5L11.5 3.5" stroke={ALPHA_WHITE_FF} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export default function IcebreakerStory({
  prompt,
  currentIndex,
  total,
  currentAnswer,
  onAnswer,
  onWriteOwn,
}: {
  prompt: Prompt;
  currentIndex: number;
  total: number;
  currentAnswer?: Answer;
  onAnswer: (promptId: string, answer: Answer) => void;
  onWriteOwn: () => void;
}) {
  const max = maxSelectFor(prompt.id);
  const multi = max > 1;
  const [selected, setSelected] = useState<string[]>([]);
  const [customOpen, setCustomOpen] = useState(false);
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (customOpen) inputRef.current?.focus({ preventScroll: true });
  }, [customOpen]);

  useEffect(() => {
    setSelected(currentAnswer?.optionIds ?? []);
    setText(currentAnswer?.custom ?? "");
    setCustomOpen(false);
  }, [prompt.id, currentAnswer?.optionIds, currentAnswer?.custom]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (!multi) return [id];
      if (prev.length < max) return [...prev, id];
      return prev; // at the cap
    });
  };

  const advance = () => {
    if (selected.length) onAnswer(prompt.id, { optionIds: selected });
  };

  const commitCustom = () => {
    const t = text.trim();
    if (!t) return;
    setCustomOpen(false);
    onAnswer(prompt.id, { custom: t });
  };

  const subtitle = multi ? `Select up to ${max}` : "Select one";

  const rowStyle: React.CSSProperties = { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, width: "100%", background: "transparent", border: "none", padding: "16px 0", cursor: "pointer", textAlign: "left" };
  const labelStyle: React.CSSProperties = { fontFamily: FONT_SANS, fontWeight: 700, fontSize: 14, lineHeight: "24px", color: TEXT_PRIMARY };

  return (
    <div style={{ position: "relative", background: BG_SHEET, display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "8px 28px 0", overflowX: "hidden", overflowY: "auto" }}>
        {/* Pagination is fixed above the sliding question, so it never moves sideways. */}
        <div style={{ marginBottom: 18 }}>
          <Pagination total={total} current={currentIndex} />
        </div>

        <div key={prompt.id} className="anim-push-in" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingRight: 64 }}>
            <h2 style={{ fontFamily: FONT_SERIF, fontWeight: 600, fontSize: 28, lineHeight: "36px", letterSpacing: "-0.4px", color: TEXT_PRIMARY, margin: 0 }}>{prompt.question}</h2>
            <span style={{ fontFamily: FONT_SANS, fontWeight: 400, fontSize: 14, lineHeight: "20px", color: MUTED }}>{subtitle}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {prompt.options.map((opt, i) => (
              <div key={opt.id}>
                {i > 0 && <div style={{ height: 1, background: SUBTLE_INK }} />}
                <button type="button" onClick={() => toggle(opt.id)} className="transition-transform active:scale-[0.99]" style={rowStyle}>
                  <span style={labelStyle}>{cap(opt.label)}</span>
                  <Indicator multi={multi} checked={selected.includes(opt.id)} />
                </button>
              </div>
            ))}

            {prompt.allowCustom && (
              <div>
                <div style={{ height: 1, background: SUBTLE_INK }} />
                {/* Proto: free-text answers aren't wired up, so this surfaces an
                    out-of-frame note (onWriteOwn) instead of opening the entry sheet. */}
                <button type="button" onClick={onWriteOwn} className="transition-transform active:scale-[0.99]" style={rowStyle}>
                  <span style={labelStyle}>Write my own</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M4 20h4l10-10-4-4L4 16v4z" stroke={TEXT_PRIMARY} strokeWidth="1.6" strokeLinejoin="round" />
                    <path d="M13.5 6.5l4 4" stroke={TEXT_PRIMARY} strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "12px 28px 8px" }}>
        <span style={{ fontFamily: FONT_SANS, fontWeight: 500, fontSize: 12, lineHeight: "16px", color: MUTED, maxWidth: 190 }}>These questions help us find what you share, and break the ice.</span>
        <button
          type="button"
          onClick={advance}
          disabled={selected.length === 0}
          aria-label="Next question"
          className="transition-transform active:scale-[0.95]"
          style={{ width: 48, height: 48, flexShrink: 0, borderRadius: 24, border: "none", background: MAIN_PRIMARY, opacity: selected.length ? 1 : 0.35, cursor: selected.length ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", transition: "opacity var(--dur-micro) var(--ease)" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ display: "block" }}>
            <path d="M10 6l6 6-6 6" stroke={ALPHA_WHITE_FF} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <GestureNav />

      {/* Write-my-own: a Hinge-style bottom sheet for free text entry. */}
      <MockKeyboard visible={customOpen} />
      {customOpen && (
        <>
          <div onClick={() => setCustomOpen(false)} className="anim-backdrop-in" style={{ position: "absolute", inset: 0, background: "rgba(26,22,20,0.35)", zIndex: 10 }} />
          <div className="anim-sheet-up" style={{ position: "absolute", left: 0, right: 0, bottom: KB_H, zIndex: 31, background: "#FFFFFF", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: "22px 22px 18px", boxShadow: "0 -12px 40px -16px rgba(26,22,20,0.3)" }}>
            <div style={{ fontFamily: FONT_SERIF, fontWeight: 600, fontSize: 20, lineHeight: "26px", color: TEXT_PRIMARY, marginBottom: 14 }}>Write your own</div>
            <input
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitCustom();
              }}
              placeholder="say it in your own words…"
              style={{ width: "100%", fontFamily: FONT_SANS, fontWeight: 700, fontSize: 14, color: TEXT_PRIMARY, background: "#F1F1F1", border: "none", borderRadius: 12, padding: "14px 16px", outline: "none", marginBottom: 14 }}
            />
            <button
              type="button"
              onClick={commitCustom}
              disabled={!text.trim()}
              className="transition-transform active:scale-[0.98]"
              style={{ width: "100%", fontFamily: FONT_SANS, fontWeight: 700, fontSize: 14, lineHeight: "20px", color: ALPHA_WHITE_FF, background: MAIN_PRIMARY, border: "none", borderRadius: 25, padding: "14px 18px", opacity: text.trim() ? 1 : 0.35, cursor: text.trim() ? "pointer" : "default" }}
            >
              Add
            </button>
          </div>
        </>
      )}
    </div>
  );
}

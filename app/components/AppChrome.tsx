"use client";

import { createContext, useContext, type CSSProperties, type ReactNode } from "react";
import { typography } from "../lib/typography";
import { BG_PRIMARY, ALPHA_BLACK_30, TEXT_PRIMARY } from "../lib/colors";

export const STATUS_BAR_HEIGHT = 54; // clears the bezel's baked-in Dynamic Island
export const BOTTOM_INSET = 20; // gesture nav: 8px + 4px bar + 8px

// True inside the on-device (single-phone) view. Lets deeply-nested chrome drop the
// bits the real OS already provides (the home indicator) without prop-threading.
export const OnDeviceContext = createContext(false);

// ── Status bar (iPhone, ported from the explore-slice proto) ────────────────

const SB_DARK = "rgba(0,0,0,0.88)";

function SignalGlyph() {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">
      <rect x="0" y="8" width="3.2" height="4" rx="0.6" fill="currentColor" />
      <rect x="5" y="5.5" width="3.2" height="6.5" rx="0.6" fill="currentColor" />
      <rect x="10" y="3" width="3.2" height="9" rx="0.6" fill="currentColor" />
      <rect x="15" y="0" width="3.2" height="12" rx="0.6" fill="currentColor" />
    </svg>
  );
}
function WifiGlyph() {
  return (
    <svg width="17" height="13" viewBox="0 -1 17 13" fill="none" aria-hidden="true">
      <circle cx="8.5" cy="10.5" r="1.5" fill="currentColor" />
      <path d="M5.4 7.7 C 6.4 6.7 10.6 6.7 11.6 7.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M3 5.2 C 5 3.2 12 3.2 14 5.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M0.7 2.7 C 3.7 -0.3 13.3 -0.3 16.3 2.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </svg>
  );
}
function BatteryGlyph() {
  return (
    <svg width="28" height="14" viewBox="0 0 28 14" fill="none" aria-hidden="true">
      <rect x="0.5" y="0.5" width="23" height="13" rx="3.5" stroke="currentColor" strokeOpacity="0.45" fill="none" />
      <rect x="2.2" y="2.2" width="17" height="9.6" rx="1.6" fill="currentColor" />
      <rect x="25" y="4.5" width="1.6" height="5" rx="0.5" fill="currentColor" fillOpacity="0.45" />
    </svg>
  );
}

export function StatusBar({
  backgroundColor = BG_PRIMARY,
  time = "9:41",
}: {
  backgroundColor?: string;
  time?: string;
}) {
  return (
    <div aria-hidden="true" style={{ backgroundColor, height: STATUS_BAR_HEIGHT, position: "relative" }}>
      {/* time + icons sit beside the Dynamic Island, vertically centred on it */}
      <div
        style={{
          position: "absolute",
          top: 8,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: 40,
          paddingRight: 30,
          color: SB_DARK,
        }}
      >
        <span style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif', fontWeight: 600, fontSize: 16, letterSpacing: "-0.3px", lineHeight: 1 }}>{time}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <SignalGlyph />
          <WifiGlyph />
          <BatteryGlyph />
        </span>
      </div>
    </div>
  );
}

// A transparent reservation the height of the status bar, for screens that sit
// under the single fixed StatusBar overlay (so content clears the island).
export function StatusBarSpacer({ backgroundColor = "transparent" }: { backgroundColor?: string }) {
  return <div aria-hidden="true" style={{ height: STATUS_BAR_HEIGHT, backgroundColor, flexShrink: 0 }} />;
}

// ── Gesture nav indicator ───────────────────────────────────────────────────

export function GestureNav({ backgroundColor = "transparent" }: { backgroundColor?: string }) {
  // On a real device the OS draws the home indicator, so drop the in-app gesture bar
  // and leave a 12px buffer so content never sticks to the bottom edge.
  const onDevice = useContext(OnDeviceContext);
  if (onDevice) return <div aria-hidden="true" className="shrink-0" style={{ height: 12 }} />;
  return (
    <div
      className="shrink-0 flex items-center justify-center"
      style={{ backgroundColor, paddingTop: 8, paddingBottom: 8 }}
      aria-hidden="true"
    >
      <div style={{ width: 128, height: 4, backgroundColor: ALPHA_BLACK_30, borderRadius: 40 }} />
    </div>
  );
}

// ── Nav button ──────────────────────────────────────────────────────────────

type NavButtonProps = {
  kind: "back" | "close";
  onClick?: () => void;
  ariaLabel?: string;
  color?: string;
};

export function NavButton({ kind, onClick, ariaLabel, color = TEXT_PRIMARY }: NavButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel ?? (kind === "back" ? "Back" : "Close")}
      style={{
        width: 48,
        height: 48,
        border: "none",
        background: "transparent",
        cursor: onClick ? "pointer" : "default",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: 12,
      }}
    >
      {kind === "back" ? (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 6L9 12L15 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
}

// ── App bar (standard) ──────────────────────────────────────────────────────

type AppBarProps = {
  leading?: ReactNode;
  title?: ReactNode;
  trailing?: ReactNode;
  shadow?: boolean;
  backgroundColor?: string;
  hideStatusBar?: boolean;
};

export function AppBar({
  leading,
  title,
  trailing,
  shadow = false,
  backgroundColor = BG_PRIMARY,
  hideStatusBar = false,
}: AppBarProps) {
  return (
    <div
      className="shrink-0"
      style={{ backgroundColor, boxShadow: shadow ? "0px 6px 16px rgba(26,22,20,0.05)" : "none" }}
    >
      {!hideStatusBar && <StatusBarSpacer backgroundColor={backgroundColor} />}

      <div style={{ position: "relative", padding: 8, height: 64 }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 56,
            right: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              color: TEXT_PRIMARY,
              textAlign: "center",
              ...typography.headerH4,
            }}
          >
            {title ?? null}
          </div>
        </div>

        <div style={{ position: "absolute", top: 8, left: 8, height: 48, display: "flex", alignItems: "center" }}>
          {leading}
        </div>

        {trailing ? (
          <div style={{ position: "absolute", top: 8, right: 8, height: 48, display: "flex", alignItems: "center" }}>
            {trailing}
          </div>
        ) : null}
      </div>
    </div>
  );
}

// ── Footer inset ────────────────────────────────────────────────────────────

type FooterInsetProps = {
  children?: ReactNode;
  backgroundColor?: string;
  paddingX?: number;
  paddingTop?: number;
  minBottomPadding?: number;
  boxShadow?: string;
  style?: CSSProperties;
};

export function FooterInset({
  children,
  backgroundColor = BG_PRIMARY,
  paddingX = 16,
  paddingTop = 8,
  minBottomPadding = 12,
  boxShadow,
  style,
}: FooterInsetProps) {
  return (
    <div
      className="shrink-0"
      style={{
        backgroundColor,
        paddingLeft: paddingX,
        paddingRight: paddingX,
        paddingTop,
        paddingBottom: minBottomPadding,
        boxShadow,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

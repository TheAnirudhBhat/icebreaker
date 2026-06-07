"use client";

// A faceted ice crystal, used in place of a bare "?" on sealed cards.
export default function IceMotif({ size = 32, color = "rgba(255,255,255,0.92)" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
      <path d="M16 4 L25 13 L16 28 L7 13 Z" fill="rgba(255,255,255,0.16)" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M7 13 H25" stroke={color} strokeWidth="1.2" opacity="0.75" />
      <path d="M11.6 13 L16 4 M20.4 13 L16 4" stroke={color} strokeWidth="1.1" opacity="0.6" />
      <path d="M11.6 13 L16 28 M20.4 13 L16 28" stroke={color} strokeWidth="1.1" opacity="0.45" />
    </svg>
  );
}

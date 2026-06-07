"use client";

// The icebreaker motif: two ice cubes caught mid-break, angled and overlapped so
// they read as one cracking cube. Static (no loop) so both phones always match.
export default function IceCubes({ size = 46 }: { size?: number }) {
  const drop = "drop-shadow(0 8px 11px rgba(58,90,120,0.30))";
  return (
    <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: size * 1.28 }}>
      <span style={{ fontSize: size, lineHeight: 1, display: "inline-block", transform: "rotate(-13deg)", filter: drop }}>
        🧊
      </span>
      <span style={{ fontSize: size, lineHeight: 1, display: "inline-block", marginLeft: -size * 0.42, transform: "rotate(13deg)", filter: drop }}>
        🧊
      </span>
    </div>
  );
}

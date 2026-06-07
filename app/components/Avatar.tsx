"use client";

import { FONT_SERIF } from "../lib/typography";

type AvatarProps = {
  name: string;
  gradient: [string, string];
  size?: number;
  photo?: string;
  ring?: string;
};

// Gradient + initial avatar (photo-optional). Keeps the proto self-contained and
// avoids using a real person's face as a fake match.
export default function Avatar({ name, gradient, size = 44, photo, ring }: AvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase();
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        flexShrink: 0,
        background: `linear-gradient(145deg, ${gradient[0]}, ${gradient[1]})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: ring
          ? `0 0 0 2px ${ring}, inset 0 0 0 1px rgba(255,255,255,0.22)`
          : "inset 0 0 0 1px rgba(255,255,255,0.22)",
      }}
    >
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <span
          style={{
            fontFamily: FONT_SERIF,
            fontWeight: 500,
            fontSize: Math.round(size * 0.42),
            color: "rgba(255,255,255,0.96)",
            lineHeight: 1,
          }}
        >
          {initial}
        </span>
      )}
    </div>
  );
}

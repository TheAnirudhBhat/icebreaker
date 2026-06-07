"use client";

// The Stalemate pawns illustration, with its edges feathered so the light image
// background blends into the warm sheet instead of showing a hard rectangle.
export default function PawnsArt({ width = 180 }: { width?: number }) {
  const feather = "radial-gradient(ellipse 86% 84% at 50% 48%, #000 70%, transparent 100%)";
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/pawns.png"
      alt=""
      style={{
        width,
        height: "auto",
        display: "block",
        margin: "0 auto",
        WebkitMaskImage: feather,
        maskImage: feather,
      }}
    />
  );
}

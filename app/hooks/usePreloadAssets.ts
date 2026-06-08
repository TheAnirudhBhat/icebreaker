"use client";

import { useEffect } from "react";

// Single source of truth for the images the proto renders across every state.
// Most are gated behind a phase (connect logos, explainer art, sealed icon,
// reveal cover), so without warming they only fetch the first time you reach
// that state, which reads as a pop. Keep this in sync with the assets under
// public/ that components actually render.
const IMAGE_ASSETS = [
  "/iphone17_bezel.png",
  "/hinge-icon.png",
  "/nudge-icon.png",
  "/liked-photo.png",
  "/arjun.jpg",
  "/aanya.jpg",
  "/icebreaker-hero.png",
  "/prop-icons.png",
  "/sealed-icon.png",
  "/reveal-cover.png",
  "/logos/spotify.svg",
  "/logos/apple-music.svg",
  "/logos/instagram.svg",
];

// Decoded images held for the page's lifetime so they stay warm in memory, not
// just in the HTTP cache. <img> and CSS url() both read the same cache, so once
// warmed, any state paints its asset instantly.
const warmed: HTMLImageElement[] = [];

// Warm every proto image (and the Lottie player chunk) once, right after mount,
// so jumping between states never waits on a first-time fetch.
export function usePreloadAssets() {
  useEffect(() => {
    if (warmed.length) return;
    for (const src of IMAGE_ASSETS) {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
      warmed.push(img);
    }
    // The Connect loader pulls lottie-react as a separate chunk; warm it now so
    // its first frame is ready before anyone opens Connect.
    void import("lottie-react");
  }, []);
}

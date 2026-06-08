"use client";

import { useEffect } from "react";
import { BEZEL_SRC } from "../components/DeviceFrame";
import { ME, AANYA } from "../data/match";
import { SERVICES } from "../data/connects";

// Images the proto renders across its states. Most are gated behind a phase
// (connect logos, explainer art, sealed icon, reveal cover), so without warming
// they only fetch the first time you reach that state, which reads as a pop. The
// photos, service logos and bezel are pulled from their source modules so they
// can't drift; the rest are one-off component art (inline literals in their own
// components). Keep the literal list in sync with that art under public/.
const IMAGE_ASSETS = [
  BEZEL_SRC,
  ME.photo,
  AANYA.photo,
  ...SERVICES.map((s) => s.logo),
  "/hinge-icon.png",
  "/nudge-icon.png",
  "/liked-photo.png",
  "/icebreaker-hero.png",
  "/prop-icons.png",
  "/sealed-icon.png",
  "/reveal-cover.png",
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
      if (!src) continue;
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

"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { OUTER_W, OUTER_H } from "../components/DeviceFrame";

// useLayoutEffect on the client (measure before paint, no size flash); fall back
// to useEffect on the server to avoid the SSR warning.
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const LABEL_BLOCK = 40; // PhoneColumn's 16px gap + 24px label line under each phone
const STACK_H = OUTER_H + LABEL_BLOCK; // full height of one phone column
const NOTE_W = 250; // per-side room reserved for the margin annotations
const GAP_MAX = 160; // inter-phone gap on roomy screens (the original design)
const GAP_MIN = 56; // tightest the phones come together on small screens
const PAD = 24; // viewport breathing room on every side
const SCALE_MAX = 1; // never upscale past the 1:1 designed size; only shrink to fit

export type StageFit = { scale: number; gap: number; ready: boolean };

// Fit the two-phone stage to the viewport: 1:1 wherever it fits, shrinking only
// when the viewport is too short. The inter-phone gap tightens on narrower
// screens so the phones draw closer before anything has to shrink. `ready` stays
// false until the first measurement so the stage can hide rather than flash a
// wrong size on load. Applied via CSS `zoom`, which scales the layout box too, so
// it stays centered with no wrapper scaffolding.
export function useStageFit(): StageFit {
  const [fit, setFit] = useState<StageFit>({ scale: 1, gap: GAP_MAX, ready: false });
  useIsoLayoutEffect(() => {
    const measure = () => {
      const availW = window.innerWidth - PAD * 2;
      const availH = window.innerHeight - PAD * 2;
      const scaleH = Math.min(SCALE_MAX, availH / STACK_H);
      // Largest gap (clamped) whose stage still fits the width at that scale.
      const gap = Math.max(GAP_MIN, Math.min(GAP_MAX, availW / scaleH - OUTER_W * 2 - NOTE_W * 2));
      // Width only bites once the gap is already at its minimum.
      const scale = Math.min(scaleH, availW / (OUTER_W * 2 + gap + NOTE_W * 2));
      setFit({ scale, gap, ready: true });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  return fit;
}

"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

// Wraps the reveal area and animates its height smoothly as the mystery card
// gives way to the (taller) details. Overflow is hidden only while growing, then
// switched to visible so card shadows aren't clipped.
export default function RevealSlot({ revealed, children }: { revealed: boolean; children: ReactNode }) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [overflow, setOverflow] = useState<"hidden" | "visible">("visible");

  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    setHeight(el.scrollHeight);
    if (revealed) setOverflow("hidden");
  }, [revealed]);

  return (
    <div
      onTransitionEnd={(e) => {
        if (e.propertyName === "height") setOverflow("visible");
      }}
      style={{
        height: height !== undefined ? height : "auto",
        overflow,
        perspective: 1000,
        transition: "height var(--dur-entrance) var(--ease)",
      }}
    >
      <div ref={innerRef}>{children}</div>
    </div>
  );
}

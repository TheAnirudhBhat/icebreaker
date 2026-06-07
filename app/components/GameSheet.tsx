"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { BG_PRIMARY, BG_OVERLAY } from "../lib/colors";
import { STATUS_BAR_HEIGHT } from "./AppChrome";

// A bottom sheet that rises over the chat and animates its height as the content
// changes size, so stepping between TriggerCard/ConnectStep/IcebreakerStory morphs
// smoothly. It owns its own enter/exit: when `open` flips false it slides down and
// fades the backdrop out, showing the last content the whole way before unmounting,
// so dismissing never just blinks away. Two shells:
//   "sheet"    Hinge-style: full-width, flush to the bottom edge, modest top corners.
//   "floating" the original card, inset on all sides with an all-around shadow.
export default function GameSheet({
  open,
  onClose,
  children,
  variant = "sheet",
  fullHeight = false,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  variant?: "sheet" | "floating";
  fullHeight?: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [scrollable, setScrollable] = useState(false);
  const [mounted, setMounted] = useState(open);
  const [exiting, setExiting] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const isSheet = variant === "sheet";

  // Keep showing the last content while sliding closed, so the sheet doesn't empty
  // out mid-animation once the phase behind it has already moved on.
  const lastChildren = useRef<ReactNode>(children);
  if (open) lastChildren.current = children;

  const fallback = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearFallback = () => {
    if (fallback.current) {
      clearTimeout(fallback.current);
      fallback.current = null;
    }
  };
  const finishExit = () => {
    clearFallback();
    setMounted(false);
    setExiting(false);
  };

  useEffect(() => {
    if (open) {
      clearFallback();
      setMounted(true);
      setExiting(false);
      setExpanded(false);
    } else if (mounted) {
      setExiting(true);
      // If the slide-down is disabled (reduced motion) animationend never fires,
      // so unmount on a timer as a fallback.
      clearFallback();
      fallback.current = setTimeout(finishExit, 480);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => () => clearFallback(), []);

  useEffect(() => {
    const inner = innerRef.current;
    const wrap = wrapRef.current;
    if (!inner || !wrap) return;
    const measure = () => {
      // Freeze the height while the sheet is closing, so the slide-down doesn't
      // reflow its content (which made the CTA jitter on dismiss).
      if (!open) return;
      // Full-screen flow steps fill the whole phone; the rest hug their content.
      let h: number;
      if (isSheet && fullHeight) {
        h = wrap.clientHeight;
      } else if (expanded) {
        // Once a scrollable sheet has been expanded, it fills the page (minus a status
        // bar inset so its content clears the iOS clock/battery).
        h = wrap.clientHeight - STATUS_BAR_HEIGHT;
      } else {
        const cap = wrap.clientHeight * (isSheet ? 0.92 : 0.86) - (isSheet ? 8 : 28);
        h = Math.min(inner.scrollHeight, cap);
      }
      setHeight(h);
      // Only scroll when content genuinely overflows, so a short sheet never jitters
      // on a sub-pixel overflow (nothing more to show means no scroll).
      setScrollable(inner.scrollHeight > h + 1);
    };
    const ro = new ResizeObserver(measure);
    ro.observe(inner);
    measure();
    return () => ro.disconnect();
  }, [open, isSheet, mounted, fullHeight, expanded]);

  if (!mounted) return null;
  const content = open ? children : lastChildren.current;

  return (
    <div ref={wrapRef} className="absolute inset-0" style={{ zIndex: 40 }}>
      <div
        className={exiting ? "anim-backdrop-out" : "anim-backdrop-in"}
        onClick={onClose}
        aria-hidden
        style={{ position: "absolute", inset: 0, background: BG_OVERLAY }}
      />
      <div
        onAnimationEnd={(e) => {
          if (exiting && e.target === e.currentTarget) finishExit();
        }}
        className={exiting ? "anim-sheet-down" : "anim-sheet-up"}
        style={{
          position: "absolute",
          left: isSheet ? 0 : 12,
          right: isSheet ? 0 : 12,
          bottom: isSheet ? 0 : 12,
          background: BG_PRIMARY,
          borderRadius: isSheet ? (fullHeight || expanded ? 0 : "16px 16px 0 0") : 24,
          transition: "border-radius 0.36s cubic-bezier(0.22, 1, 0.36, 1)",
          boxShadow: isSheet
            ? "0 -12px 44px -20px rgba(26,22,20,0.28)"
            : "0 18px 50px -12px rgba(26,22,20,0.45)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {isSheet && expanded && <div aria-hidden style={{ height: STATUS_BAR_HEIGHT, flexShrink: 0, background: BG_PRIMARY }} />}
        <div
          data-sheet-scroll
          data-expanded={expanded ? "true" : "false"}
          onScroll={(e) => {
            // A scrollable sheet turns into a full page the moment you scroll it.
            if (isSheet && !fullHeight && !expanded && e.currentTarget.scrollTop > 4) setExpanded(true);
          }}
          style={{ height, overflowY: scrollable ? "auto" : "hidden", overflowX: "hidden", transition: "height 0.36s cubic-bezier(0.22, 1, 0.36, 1)" }}
        >
          <div ref={innerRef} style={fullHeight ? { height: "100%" } : { paddingBottom: isSheet ? 14 : 0 }}>{content}</div>
        </div>
      </div>
    </div>
  );
}

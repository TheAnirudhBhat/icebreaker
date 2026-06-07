"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SONG_PROMPT, pickDeck, type Prompt } from "../data/prompts";
import { musicConnected, type ServiceId } from "../data/connects";
import { AANYA_ANSWERS, AANYA_CONNECTED, NONE_CONNECTED, type Answer } from "../data/match";

export type PlayerId = "me" | "aanya";
export type PlayerPhase =
  | "silent"
  | "trigger"
  | "intro"
  | "dismissed"
  | "connect"
  | "playing"
  | "sealed"
  | "chat";

export type PlayerState = {
  phase: PlayerPhase;
  connected: Record<ServiceId, boolean>;
  index: number;
  answers: Record<string, Answer>;
  submitted: boolean;
};

export type ChatMessage = { id: string; from: PlayerId | "system"; text: string };

const TRIGGER_DELAY = 1500;
const DECK_SIZE = 5;

function randomSeed(): number {
  return Math.floor(Math.random() * 1e9);
}

function initialPlayer(): PlayerState {
  return { phase: "silent", connected: { ...NONE_CONNECTED }, index: 0, answers: {}, submitted: false };
}

export function useDuet() {
  const [me, setMe] = useState<PlayerState>(initialPlayer);
  const [aanya, setAanya] = useState<PlayerState>(initialPlayer);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  // Seed starts constant (SSR-safe), then randomizes on mount and each replay so
  // every chat draws a different deck.
  const [seed, setSeed] = useState(1);
  const [usedIds, setUsedIds] = useState<string[]>([]);
  const [revealStyle, setRevealStyle] = useState<"flip" | "ice" | "stretch">("flip");
  const [revealNonce, setRevealNonce] = useState(0);
  const [revealAnim, setRevealAnim] = useState<"flip" | "expand" | "fade">("fade");
  // Bottom-sheet shell: Hinge-style bottom-anchored ("sheet") vs the original floating card.
  const [sheetStyle, setSheetStyle] = useState<"sheet" | "floating">("sheet");
  // The first device to reach the connect screen shows the out-of-frame explainer.
  const [firstConnector, setFirstConnector] = useState<PlayerId | null>(null);
  // The device whose connect screen is running the generate loader (hides the note).
  const [generatingId, setGeneratingId] = useState<PlayerId | null>(null);

  useEffect(() => setSeed(randomSeed()), []);

  // The deck is shared by both players in this chat (so the reveal can compare),
  // and skips questions already used in earlier rounds.
  const deck = useMemo(() => pickDeck(seed, DECK_SIZE, usedIds), [seed, usedIds]);

  // A player's visible questions: the shared deck, plus the song question only if
  // they haven't connected a music service.
  const visibleFor = useCallback(
    // Always five questions: when music isn't connected, the song prompt takes the
    // last slot instead of being appended (which would make six).
    (connected: Record<ServiceId, boolean>): Prompt[] =>
      musicConnected(connected) ? deck : [...deck.slice(0, DECK_SIZE - 1), SONG_PROMPT],
    [deck]
  );

  const setter = (pid: PlayerId) => (pid === "me" ? setMe : setAanya);

  useEffect(() => {
    if (me.phase !== "silent") return;
    const t = setTimeout(() => setMe((p) => (p.phase === "silent" ? { ...p, phase: "trigger" } : p)), TRIGGER_DELAY);
    return () => clearTimeout(t);
  }, [me.phase]);

  useEffect(() => {
    if (aanya.phase !== "silent") return;
    const t = setTimeout(() => setAanya((p) => (p.phase === "silent" ? { ...p, phase: "trigger" } : p)), TRIGGER_DELAY + 300);
    return () => clearTimeout(t);
  }, [aanya.phase]);

  // When both submit, both land in the open chat with the reveal as a card.
  // If one passes, the other is NOT notified: they simply stay sealed and waiting.
  useEffect(() => {
    if (me.submitted && aanya.submitted) {
      setMe((p) => (p.phase !== "chat" ? { ...p, phase: "chat" } : p));
      setAanya((p) => (p.phase !== "chat" ? { ...p, phase: "chat" } : p));
    }
  }, [me.submitted, aanya.submitted]);

  // Tapping the in-chat nudge opens the full-screen Icebreaker explainer first.
  const startIntro = useCallback((pid: PlayerId) => {
    setter(pid)((prev) => ({ ...prev, phase: "intro" }));
  }, []);

  const startGame = useCallback((pid: PlayerId) => {
    setFirstConnector((f) => f ?? pid);
    setGeneratingId(null);
    setter(pid)((prev) => ({ ...prev, phase: "connect", connected: { ...NONE_CONNECTED }, index: 0, answers: {}, submitted: false }));
  }, []);

  // ConnectStep calls this when the generate/skip CTA is tapped, so the out-of-frame
  // explainer can disappear immediately (before the loader finishes).
  const beginGenerating = useCallback((pid: PlayerId) => setGeneratingId(pid), []);

  const toggleConnect = useCallback((pid: PlayerId, service: ServiceId) => {
    setter(pid)((prev) => ({ ...prev, connected: { ...prev.connected, [service]: !prev.connected[service] } }));
  }, []);

  const finishConnect = useCallback((pid: PlayerId) => {
    setGeneratingId(null);
    setter(pid)((prev) => ({ ...prev, phase: "playing", index: 0 }));
  }, []);

  const answer = useCallback(
    (pid: PlayerId, promptId: string, ans: Answer) => {
      setter(pid)((prev) => {
        const answers = { ...prev.answers, [promptId]: ans };
        const vis = visibleFor(prev.connected);
        const isLast = prev.index >= vis.length - 1;
        if (!isLast) return { ...prev, answers, index: prev.index + 1 };
        return { ...prev, answers, submitted: true, phase: "sealed" };
      });
    },
    [visibleFor]
  );

  const goBack = useCallback((pid: PlayerId) => {
    setter(pid)((prev) => ({ ...prev, index: Math.max(0, prev.index - 1) }));
  }, []);

  const dismiss = useCallback((pid: PlayerId) => {
    setter(pid)((prev) => ({ ...prev, phase: "dismissed", index: 0, answers: {}, submitted: false }));
  }, []);

  const sendMessage = useCallback((pid: PlayerId, text: string) => {
    const t = text.trim();
    if (!t) return;
    setMessages((prev) => [...prev, { id: `${pid}-${prev.length}`, from: pid, text: t }]);
  }, []);

  const openChat = useCallback((pid: PlayerId) => {
    setter(pid)((prev) => ({ ...prev, phase: "chat" }));
  }, []);

  const aanyaAutoPlay = useCallback(() => {
    setAanya((prev) => ({
      ...prev,
      connected: { ...AANYA_CONNECTED },
      answers: { ...AANYA_ANSWERS },
      submitted: true,
      phase: "sealed",
    }));
  }, []);

  const aanyaPass = useCallback(() => {
    setAanya((prev) => ({ ...prev, phase: "dismissed", index: 0, answers: {}, submitted: false }));
  }, []);

  // Re-initiate the icebreaker mid-chat with a fresh, non-repeating deck.
  const startNewRound = useCallback(
    (pid: PlayerId) => {
      setUsedIds((prev) => [...prev, ...deck.map((p) => p.id)]);
      setSeed(randomSeed());
      const otherPid: PlayerId = pid === "me" ? "aanya" : "me";
      setter(pid)((prev) => ({ ...prev, phase: "playing", index: 0, answers: {}, submitted: false }));
      setter(otherPid)((prev) => ({ ...prev, phase: "trigger", index: 0, answers: {}, submitted: false }));
    },
    [deck]
  );

  const reset = useCallback(() => {
    setSeed(randomSeed());
    setUsedIds([]);
    setMe(initialPlayer());
    setAanya(initialPlayer());
    setMessages([]);
    setFirstConnector(null);
    setGeneratingId(null);
  }, []);

  // Debug: jump the "me" phone straight to a state for quick testing.
  const debugJump = useCallback(
    (target: "silent" | "trigger" | "connect" | "questions" | "sealed" | "reveal") => {
      setMessages([]);
      if (target === "silent") {
        setSeed(randomSeed());
        setUsedIds([]);
        setMe(initialPlayer());
        setAanya(initialPlayer());
        setFirstConnector(null);
        return;
      }
      if (target === "trigger") {
        setMe({ ...initialPlayer(), phase: "trigger" });
        setAanya({ ...initialPlayer(), phase: "trigger" });
        return;
      }
      if (target === "connect") {
        setMe({ ...initialPlayer(), phase: "connect" });
        setFirstConnector("me");
        return;
      }
      if (target === "questions") {
        setMe({ phase: "playing", connected: { ...AANYA_CONNECTED }, index: 0, answers: {}, submitted: false });
        return;
      }
      if (target === "sealed") {
        setMe({ phase: "sealed", connected: { ...AANYA_CONNECTED }, index: 0, answers: { ...AANYA_ANSWERS }, submitted: true });
        setAanya({ ...initialPlayer(), phase: "trigger" });
        return;
      }
      // reveal: both played + reveal already open
      const filled = { phase: "chat" as const, connected: { ...AANYA_CONNECTED }, index: 0, answers: { ...AANYA_ANSWERS }, submitted: true };
      setMe(filled);
      setAanya(filled);
      setRevealNonce((n) => n + 1);
    },
    []
  );

  return {
    me,
    aanya,
    messages,
    visibleFor,
    startIntro,
    startGame,
    toggleConnect,
    finishConnect,
    answer,
    goBack,
    dismiss,
    sendMessage,
    openChat,
    aanyaAutoPlay,
    aanyaPass,
    startNewRound,
    reset,
    revealStyle,
    setRevealStyle,
    revealNonce,
    revealAnim,
    setRevealAnim,
    sheetStyle,
    setSheetStyle,
    firstConnector,
    generatingId,
    beginGenerating,
    debugJump,
  };
}

export type Duet = ReturnType<typeof useDuet>;

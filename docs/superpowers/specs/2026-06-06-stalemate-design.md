# Stalemate — Post-Match Icebreaker Game (Prototype Spec)

**Owner:** Wave (Anirudh) · **Status:** Build · **Date:** 2026-06-06

A clickable concept prototype of a post-match icebreaker game, hosted inside a
Hinge-style chat. It demonstrates the core bet end-to-end on a single device.
This is a concept demo, not a full case study or exhaustive flow set.

---

## 1. Problem

Introverted users match but freeze before sending the first message. The match
sits idle and decays into a missed connection. Three frictions compound at the
post-match moment: **effort** (composing a good opener is work), **exposure**
(getting left on read is a small real rejection, so silence feels safer), and
**urgency** (nothing forces the move). Existing "convo starters" are *pre-match*
nudges. There is no shipped *post-match* intervention for the freeze. That gap is
the target.

## 2. What we're building

If a match goes **48h with zero messages from either side**, the chat
auto-triggers a lightweight mutual-reveal game. Both people answer the same short
prompt set. **Neither side's answers show until both have played.** On reveal,
overlaps surface and the chat gets built-in material to continue from.

It addresses the three frictions directly:

| Friction | How the game answers it |
|----------|--------------------------|
| Effort   | Tap to select answers, no blank message box |
| Exposure | Mutual reveal — nobody goes first, answers hidden until both commit |
| Urgency  | The 48h auto-trigger converts open-ended hesitation into a prompted moment |

## 3. Why a game, not a message helper

An earlier "Wingman" concept (surface a profile interest, scaffold a half-written
opener) was rejected: it's redundant at scale, asymmetric (helps only the
sender), and carries a "this was AI-written" smell. The game is symmetric, not
interest-dependent, and works across unlimited matches without a detectable
pattern. **The prototype therefore never writes an opener for the user** — the
reveal surfaces shared context and hands back to free-form chat.

## 4. Scope

**In (v1 prototype):**
- A Hinge-style match chat that has been silent for 48h (entry state)
- In-chat auto-trigger card
- 3-prompt deck, tap-to-select, no typing
- Mutual-reveal lock: answers hidden until both have played
- Locked / "waiting for your match" state, then a simulated match playing back
- Reveal: synced flip, per-prompt you-vs-them, overlap highlights, a tally
- Handoff: reveal collapses into a shared-context system note, free chat resumes

**Out (v1 prototype):**
- Writing the user's actual messages (the rejected Wingman concept)
- A matches/inbox list screen — we open directly into the one silent chat
- Pre-match / discovery suggestions
- Real two-player networking — the match (Player B) is simulated on-device
- Owning the conversation past the icebreaker (this is a starter, not a chatbot)

## 5. State machine

Single `useGameState` hook drives phases:

```
silent ── 48h trigger ──▶ trigger ── tap Play ──▶ playing
playing ── answer 3/3 ──▶ locked ── ~2.5s sim ──▶ reveal ── tap Start chatting ──▶ chat
```

- **silent** — quiet chat, "matched 2 days ago" divider, empty state.
- **trigger** — same chat with the auto-trigger card mounted.
- **playing** — game sheet rises; user answers the deck.
- **locked** — user's answers committed and hidden; "waiting for Aanya", then
  "Aanya is playing…" (simulated).
- **reveal** — cards flip in sync; overlaps highlighted; tally shown.
- **chat** — system note summarizes the overlap; free-form input is live.

The simulated match's answers are a fixture tuned so **2 of 3 overlap**, for a
satisfying reveal.

## 6. The game, concretely (v1)

Three light-but-revealing prompts, each with 3–4 tappable options (emoji + label):

1. **Ideal first-date energy?** — coffee + a long walk / dinner & a drink /
   something a little chaotic / a quiet spot, good conversation
2. **I'm most myself when…** — it's just the two of us / out with a big group /
   somewhere in nature / it's 2am and we're deep in it
3. **Weekend reset of choice?** — sleep in, zero plans / brunch + wandering /
   a workout that hurts (the good way) / lost in a project

Tap an option to select and advance. After the third, answers commit (hidden).
On reveal, prompts where both picked the same option are highlighted with the
rose accent and a small heart; a tally reads "You matched on 2 of 3." Then
**Start chatting** drops a single system note (the overlap as shared material)
and opens free chat. No opener is pre-written.

## 7. Decisions resolved for the prototype

These were genuine open questions in the PRD; the prototype commits to one answer
each (and stays honest that the *product* questions remain open — see §10):

- **Mandatory-leaning trigger.** The game fires automatically and both sides are
  expected to play; the symmetry framing ("nobody sees anything until you both
  do") is the mitigation against a coercive feel.
- **48h hard trigger, no 24h soft nudge** — keeps the demo clean.
- **3 prompts**, tap-to-select (not sliders, not free text) — lowest effort.
- **Match simulated on-device** so the reveal completes in one sitting.

## 8. Architecture / file map

Reuses the aibanker-design harness (Next 16 / React 19 / Tailwind 4), re-skinned.

**Lifted + re-skinned (slice → Hinge):**
- `app/components/AppChrome.tsx` — StatusBar, GestureNav, NavButton, AppBar,
  FooterInset (slice `ChatAppBar`/`PersonaToggle` dropped)
- `app/components/MockKeyboard.tsx` — decorative iOS keyboard
- `app/components/DeviceFrame.tsx` — 360×780 phone bezel
- `app/lib/{colors,typography,radii,spacing,elevation}.ts` — tokens; semantic
  names kept, brand ramp repointed to Hinge (paper / ink / plum + rose)
- `scripts/dev.sh` — free-port dev server

**New:**
- `app/data/prompts.ts` — prompt set + types
- `app/data/match.ts` — the match (Aanya) + her fixed answers
- `app/hooks/useGameState.ts` — phase machine + overlap computation
- `app/components/MatchHeader.tsx` — chat header (back, avatar, name)
- `app/components/Avatar.tsx` — gradient + initial avatar (photo-optional)
- `app/components/MatchChat.tsx` — orchestrator: chrome + chat + sheets by phase
- `app/components/TriggerCard.tsx` — in-chat 48h trigger
- `app/components/PromptDeck.tsx` — answer flow
- `app/components/LockedState.tsx` — committed / waiting
- `app/components/RevealView.tsx` — flip + overlap + tally + handoff
- `app/page.tsx` — centers the DeviceFrame with MatchChat

## 9. Visual direction

Hinge-flavored: warm paper background (`#FBF8F4`), near-black warm ink, white
cards, **plum** (`#6D3BA4`) for the game/primary actions, **rose** (`#E2566F`)
for connection/overlap moments. Editorial serif (Fraunces) for display
headlines, Inter for UI. Fonts via `<link>` (no build-time fetch).

## 10. What the prototype does NOT prove

These are the real product bets and remain open after the demo:
- **Conversion** — does the trigger turn silence into actual ongoing
  conversation? (the only metric that matters)
- **Segment validity** — is the silent-but-interested segment large and distinct
  from genuinely low-intent matches a game can't help?
- **Coercion sentiment** — do users feel helped or babysat by a forced trigger?

The prototype is the artifact for testing direction and feel, not these metrics.

---

## 11. v2 update (2026-06-06) — connected signals + two phones

Direction shifted after the first build. The strongest icebreaker is a true,
specific, mutual fact, so the game now surfaces real common ground, not generic
guesses.

- **Connect step (one-time, mocked):** Spotify/Apple Music, Instagram, Letterboxd.
  A connected service contributes a factual overlap card and **replaces its
  question** (no song question if Music is connected; no film question if Watch
  is). This is interactive: skip a service and its question returns.
- **Questions are gap-fillers only:** opinion / passion / values (which no app can
  know) always ask; music / film ask only when skipped. Every question's 4th
  option is **write your own** (free text).
- **Blended reveal:** "what you already share" connect-overlap cards (only for
  services both connected) + "how you each answered" cards (overlaps highlighted,
  customs shown).
- **Two phones, side by side** (You + Aanya), `useDuet` two-player state. The
  asymmetric privacy is now *visible*: neither phone shows the other's status
  until both submit; if one passes, only the submitter learns it.
- **Director** (below the phones): Replay, "Aanya plays" (auto-run), "Aanya
  passes" (asymmetric demo). Either phone is also fully tappable.

New/changed files: `data/connects.ts`, `data/prompts.ts` (domain-tagged),
`data/match.ts` (ME/AANYA + scripted answers), `hooks/useDuet.ts` (replaces
useGameState), `components/ConnectStep.tsx`, `PlayerPhone.tsx` (replaces
MatchChat), rewritten `IcebreakerStory` / `RevealStory` / `ProtoControls` /
`MatchHeader` / `SealedWaiting`, two-phone `page.tsx`.

**Known limitation:** asymmetric connects (you skip a service Aanya keeps) leave
that domain's answer without a counterpart, so it is omitted from the reveal. The
default path (both connect all) is clean.

import { sharedOverlaps, musicConnected, type Overlap, type ServiceId } from "../data/connects";
import { ALL_PROMPTS, matchPhraseFor, topicFor } from "../data/prompts";
import type { Answer } from "../data/match";

export type AnswerPair = {
  id: string;
  question: string;
  matchPhrase: string; // how a shared answer reads, e.g. "Same ick"
  topic: string; // short neutral context, e.g. "Hill"
  optionId?: string; // the shared option id when matched, for deriving a talking point
  mine: { emoji: string; label: string };
  theirs: { emoji: string; label: string };
  isMatch: boolean;
};

export type CommonGround = {
  overlaps: Overlap[];
  pairs: AnswerPair[];
  matchedCount: number;
  count: number;
  quirk: string;
};

function display(promptId: string, ans: Answer): { emoji: string; label: string } {
  const p = ALL_PROMPTS.find((x) => x.id === promptId);
  const ids = ans.optionIds ?? [];
  if (ids.length && p) {
    const opts = ids
      .map((id) => p.options.find((x) => x.id === id))
      .filter(Boolean) as { emoji: string; label: string }[];
    if (opts.length) return { emoji: opts[0].emoji, label: opts.map((o) => o.label).join(", ") };
  }
  if (ans.custom) return { emoji: "✍️", label: ans.custom };
  return { emoji: "•", label: "" };
}

// A playful one-liner that cross-references the real overlaps + answers.
function makeQuirk(overlaps: Overlap[], matched: AnswerPair[]): string {
  const hasMusic = overlaps.some((o) => o.group === "music");
  const l = matched.map((m) => m.mine.label.toLowerCase());

  if (matched.length >= 2) {
    return hasMusic
      ? `Same songs on repeat, and you synced on ${l[0]} and ${l[1]}. The algorithm could never.`
      : `You synced on ${l[0]} and ${l[1]}. Suspiciously compatible.`;
  }
  if (matched.length === 1) {
    return hasMusic
      ? `Same artist on repeat, and you synced on ${l[0]}. Of course you matched.`
      : `You synced on ${l[0]}. That's basically a personality match.`;
  }
  if (hasMusic) return `No answers in common, but the same songs on loop. The universe is being unsubtle.`;
  if (overlaps.length) return `Different answers, overlapping worlds. Could be chaos, could be chemistry.`;
  return `Total opposites on paper. Honestly? Could be the fun kind.`;
}

export function commonGround(
  selfConnected: Record<ServiceId, boolean>,
  selfAnswers: Record<string, Answer>,
  otherConnected: Record<ServiceId, boolean>,
  otherAnswers: Record<string, Answer>
): CommonGround {
  const overlaps = sharedOverlaps(selfConnected, otherConnected);

  const pairs: AnswerPair[] = [];
  ALL_PROMPTS.forEach((p) => {
    const a = selfAnswers[p.id];
    const b = otherAnswers[p.id];
    if (!a || !b) return;
    pairs.push({
      id: p.id,
      question: p.question,
      matchPhrase: matchPhraseFor(p.id),
      topic: topicFor(p.id),
      optionId: (a.optionIds ?? []).find((id) => (b.optionIds ?? []).includes(id)),
      mine: display(p.id, a),
      theirs: display(p.id, b),
      isMatch: (a.optionIds ?? []).some((id) => (b.optionIds ?? []).includes(id)),
    });
  });

  const matched = pairs.filter((p) => p.isMatch);
  return {
    overlaps,
    pairs,
    matchedCount: matched.length,
    count: overlaps.length + matched.length,
    quirk: makeQuirk(overlaps, matched),
  };
}

// Short, discussable topics grounded in the real overlap, in Hinge's tone
// (debate / swap / ask). A post-match take on Hinge's pre-match Convo Starters.
// Real, conversation-worthy facts about a person, drawn from what they connected.
// Not necessarily shared, the point is something to actually message about.
export function funFacts(connected: Record<ServiceId, boolean>, name: string): { emoji: string; text: string }[] {
  const out: { emoji: string; text: string }[] = [];
  if (musicConnected(connected)) out.push({ emoji: "🎧", text: `${name} has had Ariana Grande on repeat all month` });
  if (connected.instagram) out.push({ emoji: "📷", text: `${name} follows way too many dog accounts` });
  out.push({ emoji: "🌙", text: `${name} is most alive in a 2am conversation` });
  return out;
}

// An intuitive headline for the reveal, scaled to how much actually lines up.
export function revealHeadline(cg: CommonGround): string {
  const n = cg.matchedCount + cg.overlaps.length;
  if (n >= 4) return "You two have a lot in common";
  if (n >= 2) return "You've got a few things in common";
  return "Here's where you two line up";
}

export type RevealRow = { emoji: string; logo?: string; text: string };

// A shared answer, stated as a plain, complete sentence, with no interpretation
// bolted on. Keyed by `${promptId}:${optionId}`. The reveal surfaces the fact and
// steps back; the user decides what to say.
const MATCHED_STATEMENTS: Record<string, string> = {
  "hot-take:book": "You both think the book is always better than the film.",
  "hot-take:pineapple": "You both think pineapple belongs on pizza.",
  "hot-take:calls": "You both think a phone call beats texting.",
  "ick:slow": "You both can't stand slow walkers when you're in a hurry.",
  "ick:chew": "You both find loud chewing really off-putting.",
  "ick:nobooks": "You both see a home with no books as a red flag.",
  "overrated:brunch": "You both think brunch is overrated.",
  "overrated:beach": "You both think beach holidays are overrated.",
  "overrated:crypto": "You both think crypto talk is overrated.",
  "talk-hour:rabbit": "You could both talk for an hour about a niche rabbit hole.",
  "talk-hour:team": "You could both talk for an hour about why your team got robbed.",
  "talk-hour:theory": "You could both talk for an hour about a theory you half-believe.",
  "nerd:space": "You're both secretly nerdy about space.",
  "nerd:truecrime": "You're both secretly nerdy about true crime.",
  "nerd:tactics": "You're both secretly nerdy about football tactics.",
  "hill:tea": "You'd both die on the hill that tea beats coffee.",
  "hill:physical": "You'd both die on the hill that physical media is best.",
  "hill:window": "You both always want the window seat.",
  "fall-for:laugh": "You both fall for people who make you laugh mid-argument.",
  "fall-for:obsession": "You both fall for people with one weird obsession.",
  "fall-for:stubborn": "You both fall for people who can out-stubborn you.",
  "green-flag:waiters": "You both think being kind to waiters is an instant green flag.",
  "green-flag:textback": "You both think actually texting back is an instant green flag.",
  "green-flag:passion": "You both think having a real passion is an instant green flag.",
  "know-me:friends": "You'd both say the fastest way to know you is to meet your friends.",
  "know-me:lose": "You'd both say the fastest way to know you is to watch you lose a game.",
  "know-me:late": "You'd both say the fastest way to know you is a 2am conversation.",
  "song-self:cry": "You both have a song you'd cry in the car to.",
  "song-self:dance": "You both have a pure dancefloor track as your anthem.",
  "song-self:slow": "You both have a slow 2am burn as your song.",
  "gig:indie": "You'd both pick a sweaty indie set over anything seated.",
  "gig:djset": "You'd both rather be at a late DJ set than anywhere with chairs.",
  "gig:jazz": "You'd both happily spend the night in a tiny jazz bar.",
  "repeat:feels": "You're both on a 'something to feel things to' kick right now.",
  "repeat:hype": "You both keep pure pre-game hype on heavy repeat.",
  "repeat:throwback": "You're both unapologetically deep in throwbacks lately.",
  "saturday:trail": "You'd both rather be out on a trail by 8 than anywhere else.",
  "saturday:crawl": "You'd both spend a perfect Saturday on a long food crawl.",
  "saturday:vinyl": "You'd both happily lose a Saturday to records and nowhere to be.",
};

function matchedStatement(p: AnswerPair): string {
  const key = `${p.id}:${p.optionId ?? ""}`;
  if (MATCHED_STATEMENTS[key]) return MATCHED_STATEMENTS[key];
  return `You both said "${p.mine.label.toLowerCase()}" for your ${p.topic.toLowerCase()}.`;
}

// Each overlap stated as a plain fact, no interpretation.
const OVERLAP_STATEMENTS: Partial<Record<Overlap["group"], string>> = {
  music: "The Weeknd is top-5 for you both, and 'Blinding Lights' is in both your heavy rotations.",
  social: "You've got 4 mutual follows, Rhea Mehta and Karan Shah among them.",
  photos: "Your photos both skew outdoors: trails, morning runs, a lot of filter coffee.",
};

// A single first-date suggestion drawn from the strongest shared signal (matched
// answers first, then connected overlaps), shown as the reveal's closing point.
function dateIdea(cg: CommonGround): string {
  const matched = new Set(cg.pairs.filter((p) => p.isMatch).map((p) => `${p.id}:${p.optionId ?? ""}`));
  const has = (g: Overlap["group"]) => cg.overlaps.some((o) => o.group === g);
  if (matched.has("gig:djset") || matched.has("gig:indie") || matched.has("gig:arena") || matched.has("gig:jazz"))
    return "A gig at The Humming Tree could be your kind of first date.";
  if (matched.has("saturday:trail") || has("photos"))
    return "A sunrise walk in Cubbon Park, coffee at Third Wave after.";
  if (matched.has("saturday:crawl"))
    return "A no-plan food crawl through Indiranagar.";
  if (has("music")) return "A set at The Humming Tree, given the shared taste.";
  if (has("social")) return "That Koramangala cafe your mutuals keep posting.";
  return "Coffee at Third Wave that turns into a long walk.";
}

// The reveal: shared overlaps and answers stated as plain facts, closing with a
// first-date suggestion derived from what lines up.
export function revealRows(cg: CommonGround, otherName: string, limit = 3): RevealRow[] {
  const out: RevealRow[] = [];
  const music = cg.overlaps.find((o) => o.group === "music");
  if (music) out.push({ emoji: music.emoji, logo: music.logo, text: OVERLAP_STATEMENTS.music! });
  const social = cg.overlaps.find((o) => o.group === "social");
  if (social) out.push({ emoji: social.emoji, logo: social.logo, text: OVERLAP_STATEMENTS.social! });

  cg.pairs.filter((p) => p.isMatch).forEach((p) => out.push({ emoji: p.mine.emoji, text: matchedStatement(p) }));

  // Differences, stated plainly too.
  cg.pairs
    .filter((p) => !p.isMatch)
    .forEach((p) =>
      out.push({
        emoji: p.mine.emoji,
        text: `You went with ${p.mine.label.toLowerCase()}, ${otherName} with ${p.theirs.label.toLowerCase()}. A fun first debate.`,
      })
    );

  if (out.length < 3) {
    const photos = cg.overlaps.find((o) => o.group === "photos");
    if (photos) out.push({ emoji: photos.emoji, text: OVERLAP_STATEMENTS.photos! });
  }

  const rows = out.slice(0, limit);
  rows.push({ emoji: "💡", text: dateIdea(cg) });
  return rows;
}

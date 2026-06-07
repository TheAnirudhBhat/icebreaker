// Questions only fill what connected services can't know. A larger pool plus a
// per-chat deck means two different matches don't get the same questions, so a
// receiver never pattern-matches the icebreaker across chats.

export type PromptDomain = "opinion" | "passion" | "values" | "music";

export type PromptOption = {
  id: string;
  emoji: string;
  label: string;
};

export type Prompt = {
  id: string;
  domain: PromptDomain;
  emoji: string;
  question: string;
  options: PromptOption[];
  allowCustom: boolean; // 4th choice is always "write my own"
};

// Gap-fillers - no app knows these. A varied subset is drawn per chat.
export const GAP_POOL: Prompt[] = [
  {
    id: "hot-take", domain: "opinion", emoji: "🔥", question: "My most harmless hot take:", allowCustom: true,
    options: [
      { id: "book", emoji: "📚", label: "the book is always better" },
      { id: "pineapple", emoji: "🍍", label: "pineapple belongs on pizza" },
      { id: "calls", emoji: "📞", label: "calls beat texting" },
      { id: "sequels", emoji: "🎬", label: "sequels can beat the original" },
    ],
  },
  {
    id: "ick", domain: "opinion", emoji: "🙃", question: "An ick I can't explain:", allowCustom: true,
    options: [
      { id: "slow", emoji: "🐌", label: "slow walkers in a hurry" },
      { id: "chew", emoji: "😖", label: "loud chewing" },
      { id: "nobooks", emoji: "📭", label: "no books at home" },
      { id: "voicenotes", emoji: "🎙️", label: "five-minute voice notes" },
    ],
  },
  {
    id: "overrated", domain: "opinion", emoji: "🥱", question: "Wildly overrated, fight me:", allowCustom: true,
    options: [
      { id: "brunch", emoji: "🍳", label: "brunch" },
      { id: "beach", emoji: "🏖️", label: "beach holidays" },
      { id: "crypto", emoji: "🪙", label: "crypto talk" },
      { id: "festivals", emoji: "🎪", label: "music festivals" },
    ],
  },
  {
    id: "talk-hour", domain: "passion", emoji: "💬", question: "I could talk for an hour about:", allowCustom: true,
    options: [
      { id: "rabbit", emoji: "🕳️", label: "a niche rabbit hole" },
      { id: "team", emoji: "⚽", label: "why my team got robbed" },
      { id: "theory", emoji: "👽", label: "a theory I half-believe" },
      { id: "noodles", emoji: "🍜", label: "the perfect bowl of noodles" },
    ],
  },
  {
    id: "nerd", domain: "passion", emoji: "🤓", question: "I'm a secret nerd about:", allowCustom: true,
    options: [
      { id: "space", emoji: "🪐", label: "space" },
      { id: "truecrime", emoji: "🔍", label: "true crime" },
      { id: "tactics", emoji: "📋", label: "football tactics" },
      { id: "maps", emoji: "🗺️", label: "maps and geography" },
    ],
  },
  {
    id: "hill", domain: "passion", emoji: "⛰️", question: "A hill I'll happily die on:", allowCustom: true,
    options: [
      { id: "tea", emoji: "🍵", label: "tea beats coffee" },
      { id: "physical", emoji: "📀", label: "physical media only" },
      { id: "window", emoji: "🪟", label: "window seat, always" },
      { id: "pineapple", emoji: "🍍", label: "pineapple belongs on pizza" },
    ],
  },
  {
    id: "fall-for", domain: "values", emoji: "💘", question: "I fall a little for people who:", allowCustom: true,
    options: [
      { id: "laugh", emoji: "😂", label: "make me laugh mid-argument" },
      { id: "obsession", emoji: "🤓", label: "have one weird obsession" },
      { id: "stubborn", emoji: "🪨", label: "can out-stubborn me" },
      { id: "cook", emoji: "🍳", label: "can cook one great meal" },
    ],
  },
  {
    id: "green-flag", domain: "values", emoji: "✅", question: "Instant green flag:", allowCustom: true,
    options: [
      { id: "waiters", emoji: "🤝", label: "kind to waiters" },
      { id: "textback", emoji: "📲", label: "actually texts back" },
      { id: "passion", emoji: "🔥", label: "has a real passion" },
      { id: "plans", emoji: "📅", label: "actually makes plans" },
    ],
  },
  {
    id: "know-me", domain: "values", emoji: "🔑", question: "The fastest way to know me:", allowCustom: true,
    options: [
      { id: "friends", emoji: "👯", label: "see me with my friends" },
      { id: "lose", emoji: "🎲", label: "watch me lose a game" },
      { id: "late", emoji: "🌙", label: "a 2am conversation" },
      { id: "playlist", emoji: "🎶", label: "go through my playlists" },
    ],
  },
  // Music + scene-leaning prompts. Both sides connected music and share mutuals, so
  // these play to that overlap while staying general (no "how do you know them").
  {
    id: "gig", domain: "music", emoji: "🎶", question: "The gig I'd say yes to tonight:", allowCustom: true,
    options: [
      { id: "indie", emoji: "🎸", label: "a sweaty indie set" },
      { id: "arena", emoji: "🎤", label: "a full arena pop show" },
      { id: "djset", emoji: "🎧", label: "a late DJ set" },
      { id: "jazz", emoji: "🎷", label: "a tiny jazz bar" },
    ],
  },
  {
    id: "repeat", domain: "music", emoji: "🔁", question: "On repeat for me right now:", allowCustom: true,
    options: [
      { id: "feels", emoji: "🌧️", label: "something to feel things to" },
      { id: "hype", emoji: "⚡", label: "pure pre-game hype" },
      { id: "throwback", emoji: "📼", label: "a shameless throwback" },
      { id: "fresh", emoji: "✨", label: "whatever just dropped" },
    ],
  },
  {
    id: "saturday", domain: "values", emoji: "🗓️", question: "My ideal Saturday, honestly:", allowCustom: true,
    options: [
      { id: "crawl", emoji: "🍜", label: "a long food crawl" },
      { id: "trail", emoji: "🥾", label: "out on a trail by 8" },
      { id: "vinyl", emoji: "📀", label: "records, nowhere to be" },
      { id: "group", emoji: "🎉", label: "whatever the group chat says" },
    ],
  },
];

// Shown only when no music service is connected (the connect covers this domain).
export const SONG_PROMPT: Prompt = {
  id: "song-self", domain: "music", emoji: "🎵", question: "A song that's basically my personality:", allowCustom: true,
  options: [
    { id: "cry", emoji: "🌧️", label: "one to cry in the car to" },
    { id: "dance", emoji: "💃", label: "pure dancefloor serotonin" },
    { id: "slow", emoji: "🌙", label: "a slow 2am burn" },
    { id: "hype", emoji: "🔥", label: "a pre-night-out hype track" },
  ],
};

export const ALL_PROMPTS: Prompt[] = [...GAP_POOL, SONG_PROMPT];

// Some prompts let you pick more than one (multi-select, up to N); the rest take a
// single answer. The question screen reads this to switch between checkbox and radio.
export const MULTI_SELECT: Record<string, number> = {
  overrated: 2,
  nerd: 2,
  "fall-for": 2,
};
export function maxSelectFor(id: string): number {
  return MULTI_SELECT[id] ?? 1;
}

// Seeded PRNG so a chat's deck is stable for that pairing but differs across chats.
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Draws k questions, skipping any already used this chat so rounds don't repeat.
// Falls back to the full pool once it's exhausted.
// How a shared answer reads in the reveal, so matched answers carry their context
// (e.g. "Same ick: loud chewing" instead of a bare "you both: loud chewing").
export const MATCH_PHRASES: Record<string, string> = {
  "hot-take": "Same hot take",
  ick: "Same ick",
  overrated: "Same overrated pick",
  "talk-hour": "Both ramble about",
  nerd: "Both nerd out on",
  hill: "Same hill",
  "fall-for": "Both fall for",
  "green-flag": "Same green flag",
  "know-me": "Both say it's",
  "song-self": "Same vibe",
  gig: "Same gig",
  repeat: "Same rotation",
  saturday: "Same Saturday",
};

export function matchPhraseFor(id: string): string {
  return MATCH_PHRASES[id] ?? "You both";
}

// Short, neutral topic per prompt, so a single answer (matched or not) reads with
// context, e.g. "Hill: window seat" instead of a bare "window seat".
export const TOPICS: Record<string, string> = {
  "hot-take": "Hot take",
  ick: "Ick",
  overrated: "Overrated pick",
  "talk-hour": "Rabbit hole",
  nerd: "Obsession",
  hill: "Hill",
  "fall-for": "Type",
  "green-flag": "Green flag",
  "know-me": "Tell",
  "song-self": "Song",
  gig: "Gig",
  repeat: "On repeat",
  saturday: "Saturday",
};

export function topicFor(id: string): string {
  return TOPICS[id] ?? "Answer";
}

// Surface the profile-centered prompts (music + scene) first, so a deck actually
// feels drawn from what the two share rather than generic gap-fillers.
const PRIORITY = ["gig", "repeat", "saturday"];

export function pickDeck(seed: number, k = 3, exclude: string[] = []): Prompt[] {
  const rng = mulberry32(seed);
  let arr = GAP_POOL.filter((p) => !exclude.includes(p.id));
  if (arr.length < k) arr = [...GAP_POOL];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  // Stable partition: priority prompts keep their shuffled order but lead the deck.
  arr.sort((a, b) => (PRIORITY.includes(b.id) ? 1 : 0) - (PRIORITY.includes(a.id) ? 1 : 0));
  const deck = arr.slice(0, k);

  // Always surface at least two "pick up to 2" prompts, so every deck includes the
  // multi-select moment. Swap them into the tail (keeping the priority leads), drawing
  // from the leftover shuffled pool first and the full multi set as a fallback.
  const isMulti = (p: Prompt) => maxSelectFor(p.id) > 1;
  const minMulti = Math.min(2, k);
  const inDeck = (id: string) => deck.some((d) => d.id === id);
  let pool = arr.slice(k).filter((p) => isMulti(p) && !inDeck(p.id));
  if (pool.length < minMulti) {
    pool = pool.concat(GAP_POOL.filter((p) => isMulti(p) && !inDeck(p.id) && !pool.some((q) => q.id === p.id)));
  }
  for (let i = deck.length - 1; i >= 0 && deck.filter(isMulti).length < minMulti && pool.length; i--) {
    if (PRIORITY.includes(deck[i].id) || isMulti(deck[i])) continue;
    deck[i] = pool.shift()!;
  }
  return deck;
}

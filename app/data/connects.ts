export type ServiceId = "spotify" | "applemusic" | "instagram";

export type Service = {
  id: ServiceId;
  name: string;
  emoji: string;
  tagline: string;
  unlocks: string; // what connecting reveals
  logo: string; // brand mark in /public/logos
};

export const SERVICES: Service[] = [
  { id: "spotify", name: "Spotify", emoji: "🎧", tagline: "music", unlocks: "Shared songs & artists", logo: "/logos/spotify.svg" },
  { id: "applemusic", name: "Apple Music", emoji: "🎵", tagline: "music", unlocks: "Shared songs & artists", logo: "/logos/apple-music.svg" },
  { id: "instagram", name: "Instagram", emoji: "📷", tagline: "mutuals, privately", unlocks: "Mutual follows", logo: "/logos/instagram.svg" },
];

export type OverlapGroup = "music" | "social" | "photos";

export type Overlap = {
  group: OverlapGroup;
  emoji: string;
  logo?: string; // brand mark, when the overlap maps to a connected service
  headline: string;
  preview: string; // one specific line for the chat snapshot card
  lines: string[]; // the full detail for the reveal
};

// Mocked overlap data, grouped so Spotify/Apple Music both feed one "music" card.
export const OVERLAPS: Record<OverlapGroup, Overlap> = {
  music: {
    group: "music",
    emoji: "🎧",
    logo: "/logos/spotify.svg",
    headline: "Your music lines up",
    preview: "“Bad Habit” on repeat for you both",
    lines: [
      "Steve Lacy is a top-5 artist for both of you",
      "“Bad Habit” sits in both your heavy rotations",
      "Shared genres: mellow R&B, bedroom pop, neo-soul",
      "78% taste overlap this month",
      "You both lean late-night, low-fi listening",
    ],
  },
  social: {
    group: "social",
    emoji: "📷",
    logo: "/logos/instagram.svg",
    headline: "4 mutual follows",
    preview: "Rhea, Karan, Dev + 1 more",
    lines: [
      "Rhea Mehta and Karan Shah, friends from your college days",
      "Dev Joshi and Meher Kapoor, who you each follow back",
      "4 mutuals in total, so you clearly run in the same circles",
    ],
  },
  photos: {
    group: "photos",
    emoji: "📸",
    headline: "Your photos line up",
    preview: "both outdoorsy + sporty",
    lines: [
      "Hers read: trail hikes, a climbing gym, a lot of filter coffee",
      "Yours read: morning runs, the same gym chain, beach mornings",
      "Together: you're both happiest outdoors and on the move",
    ],
  },
};

export function musicConnected(c: Record<ServiceId, boolean>): boolean {
  return c.spotify || c.applemusic;
}

// Overlap cards to show in the reveal: a group counts only if BOTH people have it.
export function sharedOverlaps(a: Record<ServiceId, boolean>, b: Record<ServiceId, boolean>): Overlap[] {
  const out: Overlap[] = [];
  if (musicConnected(a) && musicConnected(b)) out.push(OVERLAPS.music);
  if (a.instagram && b.instagram) out.push(OVERLAPS.social);
  // Profile photos are always present on both sides, so the photo read is always
  // available (mocked here; a real build would tag photos with a vision model).
  out.push(OVERLAPS.photos);
  return out;
}

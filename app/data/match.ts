import type { ServiceId } from "./connects";

export type Answer = { optionIds?: string[]; custom?: string };

export type Person = {
  id: "me" | "aanya";
  name: string;
  gradient: [string, string];
  photo?: string;
  age?: number;
  matchedAgo?: string;
};

export const ME: Person = {
  id: "me",
  name: "Arjun",
  gradient: ["#6D3BA4", "#8C5BC2"],
  photo: "/arjun.jpg",
};

export const AANYA: Person = {
  id: "aanya",
  name: "Aanya",
  gradient: ["#E2566F", "#6D3BA4"],
  photo: "/aanya.jpg",
  age: 26,
  matchedAgo: "matched 2 days ago",
};

// Aanya's pick for every pool question, so auto-play works whatever deck is drawn.
export const AANYA_ANSWERS: Record<string, Answer> = {
  "hot-take": { optionIds: ["book"] },
  ick: { optionIds: ["chew"] },
  overrated: { optionIds: ["crypto", "brunch"] },
  "talk-hour": { optionIds: ["theory"] },
  nerd: { optionIds: ["space", "truecrime"] },
  hill: { optionIds: ["tea"] },
  "fall-for": { optionIds: ["laugh", "obsession"] },
  "green-flag": { optionIds: ["passion"] },
  "know-me": { optionIds: ["late"] },
  "song-self": { optionIds: ["slow"] },
  gig: { optionIds: ["djset"] },
  repeat: { optionIds: ["feels"] },
  saturday: { optionIds: ["trail"] },
};

// Aanya uses Spotify + Instagram. You connect during the demo.
export const AANYA_CONNECTED: Record<ServiceId, boolean> = { spotify: true, applemusic: false, instagram: true };
export const NONE_CONNECTED: Record<ServiceId, boolean> = { spotify: false, applemusic: false, instagram: false };

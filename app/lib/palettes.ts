// Rich, warm editorial palettes for the full-screen reveal cards. Rotating hues
// (plum, clay, forest, dusty rose, ink) keep the hero moment multi-coloured
// rather than a single-hue gradient.

export type CardPalette = {
  bg: string;
  text: string;
  accent: string;
  soft: string; // muted text on the dark card
};

export const CARD_PALETTES: CardPalette[] = [
  { bg: "#2C1A3B", text: "#F6ECF5", accent: "#E2566F", soft: "rgba(246,236,245,0.6)" }, // deep plum
  { bg: "#3A2417", text: "#F8EEE3", accent: "#E89A4F", soft: "rgba(248,238,227,0.6)" }, // warm clay
  { bg: "#14322A", text: "#E7F4ED", accent: "#67C79A", soft: "rgba(231,244,237,0.6)" }, // forest
  { bg: "#3D1726", text: "#FBE7EE", accent: "#F0A6BC", soft: "rgba(251,231,238,0.6)" }, // dusty rose
  { bg: "#162038", text: "#E6EDF8", accent: "#7CA4FF", soft: "rgba(230,237,248,0.6)" }, // ink navy
];

export function paletteAt(index: number): CardPalette {
  return CARD_PALETTES[index % CARD_PALETTES.length];
}

import type { CSSProperties } from "react";

type TypographyStyle = CSSProperties & {
  fontFamily: string;
  fontWeight: number;
  fontSize: number;
  lineHeight: string;
  letterSpacing: string;
};

// Editorial serif for display/headlines (Hinge-flavored), clean sans for UI.
// Loaded via <link> in layout.tsx, so no build-time font fetch.
const serif = "var(--font-serif), 'Lora', Georgia, 'Times New Roman', serif";
const sans = "var(--font-sans), 'Hanken Grotesk', system-ui, -apple-system, sans-serif";

function createStyle(
  fontFamily: string,
  fontWeight: number,
  fontSize: number,
  lineHeight: number,
  letterSpacingPct: number
): TypographyStyle {
  return {
    fontFamily,
    fontWeight,
    fontSize,
    lineHeight: `${lineHeight}px`,
    letterSpacing: `${(fontSize * letterSpacingPct) / 100}px`,
  };
}

export const typography = {
  displayLarge: createStyle(serif, 600, 56, 60, -2),
  displayMedium: createStyle(serif, 600, 40, 46, -2),
  displaySmall: createStyle(serif, 600, 32, 38, -1.5),
  headerH1: createStyle(serif, 600, 28, 34, -1),
  headerH2: createStyle(sans, 600, 22, 28, -0.5),
  headerH3: createStyle(sans, 600, 18, 24, -0.2),
  headerH4: createStyle(sans, 600, 16, 20, 0),
  buttonNormal: createStyle(sans, 600, 16, 24, 0),
  buttonSmall: createStyle(sans, 600, 14, 18, 0),
  bodyLarge: createStyle(sans, 400, 17, 26, 0),
  bodyNormal: createStyle(sans, 400, 15, 22, 0),
  bodySmall: createStyle(sans, 400, 13, 18, 0),
  caption: createStyle(sans, 500, 12, 16, 0.5),
  metadata: createStyle(sans, 500, 11, 14, 4),
} as const;

export const FONT_SERIF = serif;
export const FONT_SANS = sans;

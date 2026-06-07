// Stalemate color tokens - Hinge-flavored (warm paper, near-black ink, plum brand,
// rose accent for connection/overlap moments). Semantic names mirror the lifted
// harness (AppChrome, MockKeyboard) so those components wire in unchanged.

// ── Plum (brand) ───────────────────────────────────────────────
export const PLUM_50 = "#F3EDFA";
export const PLUM_100 = "#E5D8F3";
export const PLUM_200 = "#CBB1E7";
export const PLUM_300 = "#AA82D6";
export const PLUM_400 = "#8C5BC2";
export const PLUM_500 = "#6D3BA4"; // primary
export const PLUM_600 = "#592F87";
export const PLUM_700 = "#46256B";
export const PLUM_800 = "#341B50";
export const PLUM_900 = "#241239";

// ── Rose (connection / overlap accent) ─────────────────────────
export const ROSE_50 = "#FCEBEF";
export const ROSE_100 = "#F8D3DC";
export const ROSE_300 = "#F09CB0";
export const ROSE_500 = "#E2566F";
export const ROSE_600 = "#C73E58";

// ── Paper / warm neutrals ──────────────────────────────────────
export const PAPER = "#FFFFFF"; // app background (Hinge white)
export const PAPER_CARD = "#FFFFFF";
export const SAND_50 = "#F4EEE7";
export const SAND_100 = "#EAE2D8";
export const SAND_200 = "#DCD2C5";
export const SAND_300 = "#C6BAAA";
export const INK_900 = "#1A1614"; // near-black, warm

// ── Alpha / Black (ink) ────────────────────────────────────────
export const ALPHA_BLACK_FF = "#000000";
export const ALPHA_BLACK_90 = "rgba(26,22,20,0.92)";
export const ALPHA_BLACK_80 = "rgba(26,22,20,0.8)";
export const ALPHA_BLACK_70 = "rgba(26,22,20,0.68)";
export const ALPHA_BLACK_60 = "rgba(26,22,20,0.58)";
export const ALPHA_BLACK_50 = "rgba(26,22,20,0.48)";
export const ALPHA_BLACK_40 = "rgba(26,22,20,0.4)";
export const ALPHA_BLACK_30 = "rgba(26,22,20,0.3)";
export const ALPHA_BLACK_20 = "rgba(26,22,20,0.2)";
export const ALPHA_BLACK_10 = "rgba(26,22,20,0.1)";
export const ALPHA_BLACK_05 = "rgba(26,22,20,0.05)";

// ── Alpha / White ──────────────────────────────────────────────
export const ALPHA_WHITE_FF = "#FFFFFF";
export const ALPHA_WHITE_90 = "rgba(255,255,255,0.9)";
export const ALPHA_WHITE_80 = "rgba(255,255,255,0.8)";
export const ALPHA_WHITE_70 = "rgba(255,255,255,0.7)";
export const ALPHA_WHITE_60 = "rgba(255,255,255,0.6)";
export const ALPHA_WHITE_50 = "rgba(255,255,255,0.5)";
export const ALPHA_WHITE_40 = "rgba(255,255,255,0.4)";
export const ALPHA_WHITE_30 = "rgba(255,255,255,0.3)";
export const ALPHA_WHITE_20 = "rgba(255,255,255,0.2)";
export const ALPHA_WHITE_10 = "rgba(255,255,255,0.1)";
export const ALPHA_WHITE_00 = "rgba(255,255,255,0)";

// ── Semantic: Text & Icons ─────────────────────────────────────
export const TEXT_PRIMARY = ALPHA_BLACK_90;
export const TEXT_SECONDARY = ALPHA_BLACK_70;
export const TEXT_TERTIARY = ALPHA_BLACK_50;
export const TEXT_DISABLED = ALPHA_BLACK_20;

export const TEXT_ON_COLOR_PRIMARY = ALPHA_WHITE_FF;
export const TEXT_ON_COLOR_SECONDARY = ALPHA_WHITE_70;
export const TEXT_ON_COLOR_TERTIARY = ALPHA_WHITE_40;
export const TEXT_ON_COLOR_DISABLED = ALPHA_WHITE_30;

// ── Semantic: Outline ──────────────────────────────────────────
export const OUTLINE_BOLD = ALPHA_BLACK_10;
export const OUTLINE_SUBTLE = ALPHA_BLACK_05;
export const OUTLINE_ON_COLOR_BOLD = ALPHA_WHITE_30;
export const OUTLINE_ON_COLOR_SUBTLE = ALPHA_WHITE_20;

// ── Semantic: Background ───────────────────────────────────────
export const BG_PRIMARY = PAPER;
export const BG_SECONDARY = SAND_50;
export const BG_TERTIARY = SAND_50;
export const BG_CARD = PAPER_CARD;
export const BG_SHEET = "#FFFDFC"; // warm off-white for the full-screen game sheets
export const BG_DISABLED = SAND_100;
export const BG_BRAND = PLUM_500;
export const BG_OVERLAY = "rgba(26,22,20,0.45)";

// ── Semantic: Core / Main ──────────────────────────────────────
// Hinge brand action color (CTAs, ticks, selected states, accents).
export const MAIN_PRIMARY = "#652058";
export const MAIN_PRIMARY_BOLD = "#4E1843";
export const MAIN_PRIMARY_MEDIUM = "#591C4D";
export const MAIN_PRIMARY_SUBTLE = "#F5EAF1";

export const MAIN_ACCENT = ROSE_500;
export const MAIN_ACCENT_BOLD = ROSE_600;
export const MAIN_ACCENT_SUBTLE = ROSE_50;

// ── Semantic: Core / Utility ───────────────────────────────────
export const UTILITY_INFO = "#2B6ACF";
export const UTILITY_NEGATIVE = "#CE1D26";
export const UTILITY_POSITIVE = "#2E9E6B";
export const UTILITY_WARNING = "#E8902A";

// ── Gradient ───────────────────────────────────────────────────
// Brand gradient: plum → rose (for the game layer / reveal moments).
export const GRADIENT_BRAND = `linear-gradient(135deg, ${PLUM_500}, ${ROSE_500})`;
export const GRADIENT_BRAND_SOFT = `linear-gradient(135deg, ${PLUM_50}, ${ROSE_50})`;

export const siteConfig = {
  name: "Meebits Fútbol",
  description: "Football prediction markets powered by Polymarket",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
} as const;

// ── Competition type ──────────────────────────────────────────
export type Competition = "worldcup" | "championsleague";

export const COMPETITIONS: {
  id: Competition;
  label: string;
  shortLabel: string;
}[] = [
  { id: "worldcup", label: "World Cup 2026", shortLabel: "World Cup" },
  { id: "championsleague", label: "Champions League", shortLabel: "UCL" },
];

// ── World Cup 2026 ────────────────────────────────────────────
export const WORLD_CUP_EVENT_SLUGS = [
  "2026-fifa-world-cup-winner-595",
  "2026-fifa-world-cup-which-countries-qualify",
  "fifa-world-cup-group-a-winner",
  "fifa-world-cup-group-b-winner",
  "fifa-world-cup-group-c-winner",
  "fifa-world-cup-group-d-winner",
  "fifa-world-cup-group-e-winner",
  "fifa-world-cup-group-f-winner",
  "fifa-world-cup-group-g-winner",
  "fifa-world-cup-group-h-winner",
  "fifa-world-cup-group-i-winner",
  "fifa-world-cup-group-j-winner",
  "fifa-world-cup-group-k-winner",
  "fifa-world-cup-group-l-winner",
] as const;

export const WORLD_CUP_KEYWORDS = [
  "world cup 2026",
  "fifa world cup",
  "2026 fifa",
  "world cup winner",
  "world cup qualif",
  "world cup group",
] as const;

// ── Champions League ──────────────────────────────────────────
export const CHAMPIONS_LEAGUE_EVENT_SLUGS = [
  "uefa-champions-league-winner",
  "champions-league-top-scorer-655",
  "uefa-champions-league-most-assists",
  "uefa-champions-league-most-clean-sheets-gk",
  "ucl-team-to-reach-quarter-finals",
] as const;

export const CHAMPIONS_LEAGUE_KEYWORDS = [
  "champions league",
  "ucl",
  "uefa champions",
] as const;

export const BUILDER_FEE_BPS = 100; // 1% builder fee

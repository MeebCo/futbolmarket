export const siteConfig = {
  name: "FutbolMarket",
  description: "Bet on World Cup 2026 outcomes via Polymarket",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
} as const;

// Known World Cup 2026 event slugs on Polymarket (found via API)
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

// Keywords to match World Cup markets in title/description
// Used as a secondary filter when discovering new events
export const WORLD_CUP_KEYWORDS = [
  "world cup 2026",
  "fifa world cup",
  "2026 fifa",
  "world cup winner",
  "world cup qualif",
  "world cup group",
] as const;

export const BUILDER_FEE_BPS = 100; // 1% builder fee

import { ENDPOINTS } from "./contracts";
import {
  WORLD_CUP_EVENT_SLUGS,
  WORLD_CUP_KEYWORDS,
  CHAMPIONS_LEAGUE_EVENT_SLUGS,
  CHAMPIONS_LEAGUE_KEYWORDS,
} from "@/config/site";
import type {
  GammaEvent,
  GammaMarket,
  MarketCategory,
  MarketSummary,
} from "./types";

const GAMMA_API = ENDPOINTS.GAMMA;

// ── Categorization ────────────────────────────────────────────

export function categorizeMarket(
  question: string,
  eventSlug: string
): { category: MarketCategory; competition: MarketSummary["competition"] } {
  const q = question.toLowerCase();
  const s = eventSlug.toLowerCase();

  // Champions League detection (word-boundary check for "ucl" to avoid matching "nuclear" etc.)
  const isCL =
    s.startsWith("ucl-") ||
    s.includes("champions-league") ||
    q.includes("champions league") ||
    /\bucl\b/.test(q);

  if (isCL) {
    // CL match markets (slug pattern: ucl-{team}-{team}-{date})
    if (s.match(/^ucl-[a-z]+-[a-z]+-\d{4}-\d{2}-\d{2}/)) return { category: "cl-match", competition: "championsleague" };
    // CL knockout (quarter-finals, semi-finals, etc.)
    if (q.includes("quarter") || q.includes("semi") || q.includes("final") || q.includes("reach")) return { category: "cl-knockout", competition: "championsleague" };
    // CL stats (top scorer, assists, clean sheets)
    if (q.includes("scorer") || q.includes("assist") || q.includes("clean sheet") || q.includes("goal")) return { category: "cl-stats", competition: "championsleague" };
    // CL winner
    if (q.includes("win") || s.includes("winner")) return { category: "cl-winner", competition: "championsleague" };
    // Default CL
    return { category: "cl-winner", competition: "championsleague" };
  }

  // World Cup detection
  if (q.includes("win group") && q.includes("world cup")) return { category: "group", competition: "worldcup" };
  if (q.includes("win") && q.includes("world cup")) return { category: "winner", competition: "worldcup" };
  if (q.includes("qualify")) return { category: "qualification", competition: "worldcup" };
  if (q.includes("world cup") || q.includes("fifa")) return { category: "other", competition: "worldcup" };

  return { category: "other", competition: "other" };
}

// ── Parsing ───────────────────────────────────────────────────

function parseMarket(m: GammaMarket, eventSlug: string = ""): MarketSummary {
  let outcomes: string[] = [];
  let outcomePrices: number[] = [];
  let clobTokenIds: string[] = [];

  try {
    outcomes = JSON.parse(m.outcomes || "[]");
  } catch {
    outcomes = [];
  }
  try {
    outcomePrices = JSON.parse(m.outcomePrices || "[]").map(Number);
  } catch {
    outcomePrices = [];
  }
  try {
    clobTokenIds = JSON.parse(m.clobTokenIds || "[]");
  } catch {
    clobTokenIds = [];
  }

  const { category, competition } = categorizeMarket(m.question, eventSlug);

  return {
    conditionId: m.conditionId,
    question: m.question,
    slug: m.slug,
    image: m.image,
    icon: m.icon,
    outcomes,
    outcomePrices,
    volume: parseFloat(m.volume || "0"),
    volume24hr: parseFloat(m.volume24hr || "0"),
    liquidity: parseFloat(m.liquidityClob || m.liquidity || "0"),
    endDate: m.endDate,
    active: m.active,
    closed: m.closed,
    category: m.category,
    clobTokenIds,
    negRisk: m.negRisk,
    negRiskMarketId: m.negRiskMarketId,
    bestBid: parseFloat(m.bestBid || "0"),
    bestAsk: parseFloat(m.bestAsk || "0"),
    lastTradePrice: parseFloat(m.lastTradePrice || "0"),
    oneDayPriceChange: parseFloat(m.oneDayPriceChange || "0"),
    description: m.description,
    spread: parseFloat(m.spread || "0"),
    orderPriceMinTickSize: parseFloat(m.orderPriceMinTickSize || "0.01"),
    orderMinSize: parseFloat(m.orderMinSize || "5"),
    acceptingOrders: m.acceptingOrders,
    marketCategory: category,
    competition,
  };
}

// ── Event fetching ────────────────────────────────────────────

/** Fetch events by their known slugs (reliable primary method) */
async function fetchEventsBySlugs(slugs: readonly string[]): Promise<GammaEvent[]> {
  const queries = slugs.map((slug) =>
    fetch(`${GAMMA_API}/events?slug=${slug}&limit=1`)
      .then((r) => r.json())
      .then((data: GammaEvent[]) => (Array.isArray(data) ? data : []))
      .catch(() => [] as GammaEvent[])
  );
  const results = await Promise.all(queries);
  return results.flat();
}

/** Discover CL match events by scanning active events for ucl- slug pattern */
async function discoverCLMatchEvents(): Promise<GammaEvent[]> {
  const allEvents: GammaEvent[] = [];
  // Paginate through active events to find UCL matches
  for (let offset = 0; offset < 400; offset += 100) {
    try {
      const res = await fetch(
        `${GAMMA_API}/events?active=true&closed=false&limit=100&offset=${offset}`
      );
      const data: GammaEvent[] = await res.json();
      if (!Array.isArray(data) || data.length === 0) break;

      const clEvents = data.filter((e) => {
        const slug = (e.slug || "").toLowerCase();
        const title = (e.title || "").toLowerCase();
        return (
          slug.startsWith("ucl-") ||
          slug.includes("champions-league") ||
          title.includes("champions league") ||
          title.includes("uefa champions") ||
          /\bucl\b/.test(title)
        );
      });
      allEvents.push(...clEvents);
    } catch {
      break;
    }
  }
  return allEvents;
}

/** Discover World Cup events by keyword matching */
async function discoverWorldCupEvents(): Promise<GammaEvent[]> {
  try {
    const res = await fetch(
      `${GAMMA_API}/events?active=true&closed=false&limit=200`
    );
    const data: GammaEvent[] = await res.json();
    if (!Array.isArray(data)) return [];

    return data.filter((e) => {
      const title = (e.title || "").toLowerCase();
      const desc = (e.description || "").toLowerCase();
      return WORLD_CUP_KEYWORDS.some(
        (kw) => title.includes(kw) || desc.includes(kw)
      );
    });
  } catch {
    return [];
  }
}

// ── Public API ────────────────────────────────────────────────

/** Fetch all events for all competitions */
export async function fetchAllEvents(): Promise<GammaEvent[]> {
  const [wcSlugEvents, wcDiscovered, clSlugEvents, clMatchEvents] =
    await Promise.all([
      fetchEventsBySlugs(WORLD_CUP_EVENT_SLUGS),
      discoverWorldCupEvents(),
      fetchEventsBySlugs(CHAMPIONS_LEAGUE_EVENT_SLUGS),
      discoverCLMatchEvents(),
    ]);

  // Merge and deduplicate by event ID
  const all = [
    ...wcSlugEvents,
    ...wcDiscovered,
    ...clSlugEvents,
    ...clMatchEvents,
  ];
  const seen = new Set<string>();
  return all.filter((e) => {
    if (seen.has(e.id)) return false;
    seen.add(e.id);
    return true;
  });
}

/** Backward-compatible: fetch World Cup events only */
export async function fetchWorldCupEvents(): Promise<GammaEvent[]> {
  const [slugEvents, discoveredEvents] = await Promise.all([
    fetchEventsBySlugs(WORLD_CUP_EVENT_SLUGS),
    discoverWorldCupEvents(),
  ]);

  const all = [...slugEvents, ...discoveredEvents];
  const seen = new Set<string>();
  return all.filter((e) => {
    if (seen.has(e.id)) return false;
    seen.add(e.id);
    return true;
  });
}

/** Fetch all markets across all competitions */
export async function fetchAllMarkets(): Promise<MarketSummary[]> {
  const events = await fetchAllEvents();
  const allMarkets: MarketSummary[] = [];
  const seen = new Set<string>();

  for (const event of events) {
    if (event.markets) {
      for (const m of event.markets) {
        if (!seen.has(m.conditionId)) {
          seen.add(m.conditionId);
          allMarkets.push(parseMarket(m, event.slug));
        }
      }
    }
  }

  allMarkets.sort((a, b) => b.volume - a.volume);
  return allMarkets;
}

/** Backward-compatible: fetch World Cup markets only */
export async function fetchWorldCupMarkets(): Promise<MarketSummary[]> {
  const events = await fetchWorldCupEvents();
  const allMarkets: MarketSummary[] = [];
  const seen = new Set<string>();

  for (const event of events) {
    if (event.markets) {
      for (const m of event.markets) {
        if (!seen.has(m.conditionId)) {
          seen.add(m.conditionId);
          allMarkets.push(parseMarket(m, event.slug));
        }
      }
    }
  }

  allMarkets.sort((a, b) => b.volume - a.volume);
  return allMarkets;
}

export async function fetchMarketByConditionId(
  conditionId: string
): Promise<GammaMarket | null> {
  try {
    const res = await fetch(
      `${GAMMA_API}/markets?condition_id=${conditionId}&limit=1`
    );
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return data[0];
    }
    return null;
  } catch {
    return null;
  }
}

export async function fetchMarketBySlug(
  slug: string
): Promise<GammaMarket | null> {
  try {
    const res = await fetch(`${GAMMA_API}/markets?slug=${slug}&limit=1`);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return data[0];
    }
    return null;
  } catch {
    return null;
  }
}

export async function fetchOrderBook(tokenId: string) {
  try {
    const res = await fetch(`${ENDPOINTS.CLOB}/book?token_id=${tokenId}`);
    return await res.json();
  } catch {
    return { bids: [], asks: [] };
  }
}

export async function fetchPriceHistory(
  tokenId: string,
  fidelity: number = 60
): Promise<Array<{ t: number; p: number }>> {
  try {
    const res = await fetch(
      `${ENDPOINTS.CLOB}/prices-history?market=${tokenId}&interval=all&fidelity=${fidelity}`
    );
    const data = await res.json();
    return data.history || [];
  } catch {
    return [];
  }
}

export { parseMarket };

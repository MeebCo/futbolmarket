import { ENDPOINTS } from "./contracts";
import { WORLD_CUP_EVENT_SLUGS, WORLD_CUP_KEYWORDS } from "@/config/site";
import type { GammaEvent, GammaMarket, MarketCategory, MarketSummary } from "./types";

const GAMMA_API = ENDPOINTS.GAMMA;

export function categorizeMarket(question: string): MarketCategory {
  const q = question.toLowerCase();
  if (q.includes("win group") && q.includes("world cup")) return "group";
  if (q.includes("win") && q.includes("world cup")) return "winner";
  if (q.includes("qualify")) return "qualification";
  return "other";
}

function parseMarket(m: GammaMarket): MarketSummary {
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
    marketCategory: categorizeMarket(m.question),
  };
}

/** Check if text matches any World Cup keyword */
function isWorldCupRelated(text: string): boolean {
  const lower = text.toLowerCase();
  return WORLD_CUP_KEYWORDS.some((kw) => lower.includes(kw));
}

/**
 * Fetch World Cup events by their known slugs.
 * This is the primary, reliable method.
 */
async function fetchEventsBySlug(): Promise<GammaEvent[]> {
  const queries = WORLD_CUP_EVENT_SLUGS.map((slug) =>
    fetch(`${GAMMA_API}/events?slug=${slug}&limit=1`)
      .then((r) => r.json())
      .then((data: GammaEvent[]) => (Array.isArray(data) ? data : []))
      .catch(() => [] as GammaEvent[])
  );

  const results = await Promise.all(queries);
  return results.flat();
}

/**
 * Discover additional World Cup events by scanning recent active events
 * and filtering by title/description keywords.
 */
async function discoverWorldCupEvents(): Promise<GammaEvent[]> {
  try {
    const res = await fetch(
      `${GAMMA_API}/events?active=true&closed=false&limit=200`
    );
    const data: GammaEvent[] = await res.json();
    if (!Array.isArray(data)) return [];

    return data.filter(
      (e) =>
        isWorldCupRelated(e.title || "") ||
        isWorldCupRelated(e.description || "")
    );
  } catch {
    return [];
  }
}

export async function fetchWorldCupEvents(): Promise<GammaEvent[]> {
  // Fetch by known slugs + discover new ones in parallel
  const [slugEvents, discoveredEvents] = await Promise.all([
    fetchEventsBySlug(),
    discoverWorldCupEvents(),
  ]);

  // Merge and deduplicate by event ID
  const all = [...slugEvents, ...discoveredEvents];
  const seen = new Set<string>();
  return all.filter((e) => {
    if (seen.has(e.id)) return false;
    seen.add(e.id);
    return true;
  });
}

export async function fetchWorldCupMarkets(): Promise<MarketSummary[]> {
  const events = await fetchWorldCupEvents();
  const allMarkets: MarketSummary[] = [];
  const seen = new Set<string>();

  for (const event of events) {
    if (event.markets) {
      for (const m of event.markets) {
        if (!seen.has(m.conditionId)) {
          seen.add(m.conditionId);
          allMarkets.push(parseMarket(m));
        }
      }
    }
  }

  // Sort by volume descending
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

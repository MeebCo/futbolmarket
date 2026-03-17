export interface GammaMarket {
  id: string;
  question: string;
  conditionId: string;
  slug: string;
  resolutionSource: string;
  endDate: string;
  liquidity: string;
  startDate: string;
  image: string;
  icon: string;
  description: string;
  outcomes: string;
  outcomePrices: string;
  volume: string;
  active: boolean;
  closed: boolean;
  marketMakerAddress: string;
  createdAt: string;
  updatedAt: string;
  new: boolean;
  featured: boolean;
  submitted_by: string;
  category: string;
  volume24hr: string;
  clobTokenIds: string;
  umaBond: string;
  umaReward: string;
  volume24hrClob: string;
  volumeClob: string;
  liquidityClob: string;
  acceptingOrders: boolean;
  negRisk: boolean;
  negRiskMarketId: string;
  negRiskRequestId: string;
  ready: boolean;
  funded: boolean;
  acceptingOrderTimestamp: string;
  tags: Tag[];
  cyom: boolean;
  competitive: string;
  pagerDutyNotificationEnabled: boolean;
  spread: string;
  oneDayPriceChange: string;
  lastTradePrice: string;
  bestBid: string;
  bestAsk: string;
  automaticallyActive: boolean;
  clearBookOnStart: boolean;
  seriesColor: string;
  showMarketImages: boolean;
  customLivenessRules: string;
  tokenTicker: string;
  rewardsMinSize: string;
  rewardsMaxSpread: string;
  rewardsEventId: string;
  rewardsPayout: string;
  rewardsActive: boolean;
  notificationsEnabled: boolean;
  enableOrderBook: boolean;
  orderPriceMinTickSize: string;
  orderMinSize: string;
  events: GammaEvent[];
}

export interface GammaEvent {
  id: string;
  ticker: string;
  slug: string;
  title: string;
  description: string;
  startDate: string;
  creationDate: string;
  endDate: string;
  image: string;
  icon: string;
  active: boolean;
  closed: boolean;
  archived: boolean;
  new: boolean;
  featured: boolean;
  restricted: boolean;
  liquidity: number;
  volume: number;
  openInterest: number;
  createdAt: string;
  updatedAt: string;
  competitive: number;
  volume24hr: number;
  enableOrderBook: boolean;
  liquidityClob: number;
  commentCount: number;
  markets: GammaMarket[];
  tags: Tag[];
  cyom: boolean;
  showMarketImages: boolean;
  showAllOutcomes: boolean;
  automaticallyActive: boolean;
  negRisk: boolean;
}

export interface Tag {
  id: string;
  label: string;
  slug: string;
  forceShow: boolean;
}

export type MarketCategory =
  | "winner"
  | "group"
  | "qualification"
  | "cl-winner"
  | "cl-match"
  | "cl-knockout"
  | "cl-stats"
  | "other";

// Simplified types for UI consumption
export interface MarketSummary {
  conditionId: string;
  question: string;
  slug: string;
  image: string;
  icon: string;
  outcomes: string[];
  outcomePrices: number[];
  volume: number;
  volume24hr: number;
  liquidity: number;
  endDate: string;
  active: boolean;
  closed: boolean;
  category: string;
  clobTokenIds: string[];
  negRisk: boolean;
  negRiskMarketId: string;
  bestBid: number;
  bestAsk: number;
  lastTradePrice: number;
  oneDayPriceChange: number;
  description: string;
  spread: number;
  orderPriceMinTickSize: number;
  orderMinSize: number;
  acceptingOrders: boolean;
  marketCategory: MarketCategory;
  competition: "worldcup" | "championsleague" | "other";
}

export interface MarketDetail extends MarketSummary {
  orderbook: OrderBookData;
  eventTitle?: string;
  eventSlug?: string;
}

export interface OrderBookData {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  spread: number;
  midpoint: number;
  hash: string;
  timestamp: string;
  market: string;
  asset_id: string;
}

export interface OrderBookEntry {
  price: string;
  size: string;
}

export interface PriceHistoryPoint {
  t: number; // timestamp
  p: number; // price
}

export interface Position {
  asset: string;
  conditionId: string;
  size: string;
  avgPrice: string;
  currentPrice: number;
  pnl: number;
  marketQuestion: string;
  outcome: string;
  marketSlug: string;
}

export interface OpenOrder {
  id: string;
  market: string;
  asset_id: string;
  side: "BUY" | "SELL";
  price: string;
  original_size: string;
  size_matched: string;
  outcome: string;
  status: string;
  created_at: number;
  expiration: number;
  associate_trades: string[];
  owner: string;
  type: string;
  marketQuestion?: string;
}

export interface TradeRecord {
  id: string;
  taker_order_id: string;
  market: string;
  asset_id: string;
  side: "BUY" | "SELL";
  size: string;
  price: string;
  status: string;
  match_time: string;
  outcome: string;
  fee_rate_bps: string;
  owner: string;
  type: string;
  marketQuestion?: string;
}

// Trading types
export type OrderSide = "BUY" | "SELL";

export interface OrderParams {
  tokenId: string;
  side: OrderSide;
  price: number;
  size: number;
  feeRateBps?: number;
  nonce?: number;
  expiration?: number;
}

// Builder HMAC signing
export interface HmacSignRequest {
  method: string;
  path: string;
  body?: string;
  timestamp?: string;
}

export interface HmacSignResponse {
  headers: Record<string, string>;
}

// Auth types
export type AuthMethod = "wallet" | "magic" | null;

export interface SessionData {
  isLoggedIn: boolean;
  address?: string;
  authMethod?: AuthMethod;
  safeAddress?: string;
}

// WebSocket message types
export interface WsMarketMessage {
  event_type: string;
  market: string;
  asset_id: string;
  price?: string;
  side?: string;
  size?: string;
  timestamp?: string;
  changes?: Array<{
    price: string;
    size: string;
    side: string;
  }>;
}

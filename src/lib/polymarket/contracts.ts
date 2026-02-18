// Polymarket contract addresses on Polygon
export const CONTRACTS = {
  // USDC.e (Bridged USDC) on Polygon
  USDCe: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174" as const,
  // Conditional Tokens Framework
  CTF: "0x4D97DCd97eC945f40cF65F87097ACe5EA0476045" as const,
  // CTF Exchange (Polymarket CLOB)
  CTF_EXCHANGE: "0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E" as const,
  // Neg Risk CTF Exchange
  NEG_RISK_CTF_EXCHANGE: "0xC5d563A36AE78145C45a50134d48A1215220f80a" as const,
  // Neg Risk Adapter
  NEG_RISK_ADAPTER: "0xd91E80cF2E7be2e162c6513ceD06f1dD0dA35296" as const,
  // Gnosis Safe Proxy Factory
  SAFE_PROXY_FACTORY: "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2" as const,
  // Gnosis Safe Singleton
  SAFE_SINGLETON: "0x3E5c63644E683549055b9Be8653de26E0B4CD36E" as const,
} as const;

// Polymarket API endpoints
export const ENDPOINTS = {
  CLOB: "https://clob.polymarket.com" as const,
  GAMMA: "https://gamma-api.polymarket.com" as const,
  STRAPI: "https://strapi-matic.polymarket.com" as const,
  DATA: "https://data-api.polymarket.com" as const,
  WS: "wss://ws-subscriptions-clob.polymarket.com/ws/market" as const,
  WS_USER: "wss://ws-subscriptions-clob.polymarket.com/ws/user" as const,
} as const;

// Polygon chain config
export const POLYGON = {
  chainId: 137,
  name: "Polygon",
  rpcUrl: process.env.NEXT_PUBLIC_POLYGON_RPC_URL || "https://polygon-rpc.com",
  blockExplorer: "https://polygonscan.com",
  nativeCurrency: {
    name: "MATIC",
    symbol: "MATIC",
    decimals: 18,
  },
} as const;

// USDC has 6 decimals
export const USDC_DECIMALS = 6;

// ERC20 ABI (minimal for approve/allowance/balanceOf)
export const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function decimals() external view returns (uint8)",
  "function symbol() external view returns (string)",
] as const;

// CTF ABI (minimal for setApprovalForAll)
export const CTF_ABI = [
  "function setApprovalForAll(address operator, bool approved) external",
  "function isApprovedForAll(address account, address operator) external view returns (bool)",
] as const;

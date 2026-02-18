"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { ENDPOINTS } from "@/lib/polymarket/contracts";
import type { OrderBookEntry } from "@/lib/polymarket/types";

interface MarketStreamData {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  lastPrice: number | null;
  isConnected: boolean;
}

interface WsMessage {
  event_type?: string;
  market?: string;
  asset_id?: string;
  // book message
  bids?: Array<{ price: string; size: string }>;
  asks?: Array<{ price: string; size: string }>;
  // price message
  price?: string;
  side?: string;
  size?: string;
  timestamp?: string;
  hash?: string;
}

/**
 * WebSocket hook for real-time market data from Polymarket.
 * Subscribes to orderbook updates for a given token ID.
 */
export function useMarketStream(tokenId: string | null): MarketStreamData {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>(undefined);
  const [isConnected, setIsConnected] = useState(false);
  const [bids, setBids] = useState<OrderBookEntry[]>([]);
  const [asks, setAsks] = useState<OrderBookEntry[]>([]);
  const [lastPrice, setLastPrice] = useState<number | null>(null);

  const connect = useCallback(() => {
    if (!tokenId) return;

    // Clean up existing connection
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    try {
      const ws = new WebSocket(ENDPOINTS.WS);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);

        // Subscribe to market channel
        ws.send(
          JSON.stringify({
            type: "market",
            assets_id: tokenId,
          })
        );
      };

      ws.onmessage = (event) => {
        try {
          const data: WsMessage = JSON.parse(event.data);

          if (data.event_type === "book") {
            if (data.bids) setBids(data.bids);
            if (data.asks) setAsks(data.asks);
          }

          if (data.event_type === "price_change" || data.event_type === "last_trade_price") {
            if (data.price) {
              setLastPrice(parseFloat(data.price));
            }
          }

          if (data.event_type === "tick_size_change") {
            // Handle tick size change if needed
          }
        } catch {
          // Ignore malformed messages
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        // Reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 3000);
      };

      ws.onerror = () => {
        ws.close();
      };
    } catch {
      setIsConnected(false);
    }
  }, [tokenId]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connect]);

  return { bids, asks, lastPrice, isConnected };
}

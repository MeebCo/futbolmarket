import { http, createConfig } from "wagmi";
import { polygon } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID || "";

export const wagmiConfig = createConfig({
  chains: [polygon],
  connectors: [
    injected(),
    ...(projectId
      ? [
          walletConnect({
            projectId,
            metadata: {
              name: "FutbolMarket",
              description: "World Cup 2026 Prediction Markets",
              url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
              icons: [],
            },
          }),
        ]
      : []),
  ],
  transports: {
    [polygon.id]: http(
      process.env.NEXT_PUBLIC_POLYGON_RPC_URL || "https://polygon-rpc.com"
    ),
  },
});

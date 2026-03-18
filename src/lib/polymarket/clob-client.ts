import { ClobClient } from "@polymarket/clob-client";
import { ENDPOINTS, POLYGON } from "./contracts";
import { createRemoteBuilderConfig } from "./builder-config";
import type { Wallet } from "ethers";
import type { JsonRpcSigner } from "ethers";

// Signature type 2 = POLY_GNOSIS_SAFE (all users trade via Safe wallets)
const SIGNATURE_TYPE = 2;

interface CreateClobClientOptions {
  signer?: Wallet | JsonRpcSigner;
  creds?: {
    key: string;
    secret: string;
    passphrase: string;
  };
  funderAddress?: string;
}

/**
 * Create a ClobClient configured for the Meebits Fútbol builder integration.
 * Runs client-side with remote builder signing (credentials stay server-side).
 */
export function createClobClient(options: CreateClobClientOptions): ClobClient {
  const builderConfig = createRemoteBuilderConfig();

  // The clob-client expects ethers v5 types but we use v6.
  // We cast here since the SDK handles both internally.
  return new ClobClient(
    ENDPOINTS.CLOB,
    POLYGON.chainId,
    options.signer as unknown as any, // eslint-disable-line @typescript-eslint/no-explicit-any -- ethers v5/v6 compatibility
    options.creds,
    SIGNATURE_TYPE,
    options.funderAddress,
    undefined, // geoBlockToken
    true, // useServerTime
    builderConfig
  );
}

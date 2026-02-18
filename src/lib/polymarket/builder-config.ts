import { BuilderConfig } from "@polymarket/builder-signing-sdk";

// Client-side: remote builder config that points to our API route
// Builder credentials never leave the server
export function createRemoteBuilderConfig(): BuilderConfig {
  return new BuilderConfig({
    remoteBuilderConfig: {
      url: "/api/polymarket/sign",
    },
  });
}

// Server-side: local builder config with env credentials
export function createLocalBuilderConfig(): BuilderConfig | undefined {
  const key = process.env.POLYMARKET_BUILDER_API_KEY;
  const secret = process.env.POLYMARKET_BUILDER_SECRET;
  const passphrase = process.env.POLYMARKET_BUILDER_PASSPHRASE;

  if (!key || !secret || !passphrase) {
    return undefined;
  }

  return new BuilderConfig({
    localBuilderCreds: { key, secret, passphrase },
  });
}

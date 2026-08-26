import "server-only";

import type { ProviderName, ServerConfig } from "@/lib/config/env";
import { DemoProviderAdapter } from "./demo";
import { HttpProviderAdapter } from "./http.server";
import type { ProviderAdapter } from "./types";

export function createProviderAdapters(config: ServerConfig): ReadonlyMap<ProviderName, ProviderAdapter> {
  const adapters = new Map<ProviderName, ProviderAdapter>();

  for (const provider of config.providers) {
    if (config.demoMode) {
      adapters.set(provider, new DemoProviderAdapter());
      continue;
    }

    const httpConfig = config.httpProviders[provider];
    if (!httpConfig) throw new Error(`No server adapter configured for ${provider}`);
    adapters.set(provider, new HttpProviderAdapter(httpConfig));
  }

  return adapters;
}

import { describe, expect, it } from "vitest";
import { parseServerEnv, toPublicConfig } from "@/lib/config/env";

describe("environment configuration", () => {
  it("defaults to deterministic demo mode without credentials", () => {
    const config = parseServerEnv({});
    expect(config.demoMode).toBe(true);
    expect(config.providers).toEqual(["openai", "anthropic", "gemini", "perplexity"]);
    expect(config.httpProviders).toEqual({});
  });

  it("parses each environment in isolation", () => {
    const first = parseServerEnv({ DEMO_MODE: "true", PROVIDERS: "openai" });
    const second = parseServerEnv({ DEMO_MODE: "true", PROVIDERS: "gemini" });
    expect(first.providers).toEqual(["openai"]);
    expect(second.providers).toEqual(["gemini"]);
  });

  it("fails closed when configured mode lacks server credentials", () => {
    expect(() => parseServerEnv({ DEMO_MODE: "false", PROVIDERS: "openai" }))
      .toThrow("OPENAI_API_KEY and OPENAI_BASE_URL are required");
  });

  it("rejects unknown providers and unsafe endpoint protocols", () => {
    expect(() => parseServerEnv({ PROVIDERS: "unknown" })).toThrow("Unknown provider");
    expect(() => parseServerEnv({
      DEMO_MODE: "false",
      PROVIDERS: "openai",
      OPENAI_API_KEY: "server-placeholder-secret",
      OPENAI_BASE_URL: "file:///provider",
    })).toThrow("must use http or https");
  });

  it("never serializes keys or endpoints into public configuration", () => {
    const secret = "server-placeholder-secret";
    const endpoint = "https://provider.invalid/v1";
    const server = parseServerEnv({
      DEMO_MODE: "false",
      PROVIDERS: "openai",
      OPENAI_API_KEY: secret,
      OPENAI_BASE_URL: endpoint,
      OPENAI_MODEL: "model-placeholder",
    });
    const serialized = JSON.stringify(toPublicConfig(server));

    expect(serialized).not.toContain(secret);
    expect(serialized).not.toContain(endpoint);
    expect(serialized).not.toContain("apiKey");
    expect(JSON.parse(serialized)).toEqual({
      demoMode: false,
      providers: ["openai"],
      runtime: "configured",
    });
  });
});

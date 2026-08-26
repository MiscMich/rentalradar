export const PROVIDER_NAMES = ["openai", "anthropic", "gemini", "perplexity"] as const;

export type ProviderName = (typeof PROVIDER_NAMES)[number];

export interface HttpProviderConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

export interface ServerConfig {
  demoMode: boolean;
  providers: readonly ProviderName[];
  httpProviders: Partial<Record<ProviderName, HttpProviderConfig>>;
}

export interface PublicConfig {
  demoMode: boolean;
  providers: readonly ProviderName[];
  runtime: "demo" | "configured";
}

const providerDefaults: Record<ProviderName, string> = {
  openai: "gpt-model-placeholder",
  anthropic: "claude-model-placeholder",
  gemini: "gemini-model-placeholder",
  perplexity: "perplexity-model-placeholder",
};

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value.trim() === "") return fallback;
  if (["1", "true", "yes", "on"].includes(value.toLowerCase())) return true;
  if (["0", "false", "no", "off"].includes(value.toLowerCase())) return false;
  throw new Error("DEMO_MODE must be a boolean value");
}

function parseProviderList(value: string | undefined): readonly ProviderName[] {
  if (!value?.trim()) return PROVIDER_NAMES;

  const entries = value.split(",").map((entry) => entry.trim().toLowerCase()).filter(Boolean);
  const unknown = entries.filter((entry) => !PROVIDER_NAMES.includes(entry as ProviderName));
  if (unknown.length > 0) throw new Error(`Unknown provider: ${unknown.join(", ")}`);

  return [...new Set(entries)] as ProviderName[];
}

function envPrefix(provider: ProviderName): string {
  return provider.toUpperCase();
}

export function parseServerEnv(env: Readonly<Record<string, string | undefined>>): ServerConfig {
  const demoMode = parseBoolean(env.DEMO_MODE, true);
  const providers = parseProviderList(env.PROVIDERS);
  const httpProviders: Partial<Record<ProviderName, HttpProviderConfig>> = {};

  if (!demoMode) {
    for (const provider of providers) {
      const prefix = envPrefix(provider);
      const apiKey = env[`${prefix}_API_KEY`]?.trim();
      const baseUrl = env[`${prefix}_BASE_URL`]?.trim();
      const model = env[`${prefix}_MODEL`]?.trim() || providerDefaults[provider];

      if (!apiKey || !baseUrl) {
        throw new Error(`${prefix}_API_KEY and ${prefix}_BASE_URL are required when DEMO_MODE=false`);
      }

      const parsedUrl = new URL(baseUrl);
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        throw new Error(`${prefix}_BASE_URL must use http or https`);
      }

      httpProviders[provider] = { apiKey, baseUrl: parsedUrl.toString(), model };
    }
  }

  return { demoMode, providers, httpProviders };
}

export function toPublicConfig(config: ServerConfig): PublicConfig {
  return {
    demoMode: config.demoMode,
    providers: [...config.providers],
    runtime: config.demoMode ? "demo" : "configured",
  };
}

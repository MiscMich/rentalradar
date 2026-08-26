import type { ProviderName } from "@/lib/config/env";
import type { ProviderResult } from "@/lib/domain/types";

export const DEMO_NOW = "2026-01-12T10:00:00.000Z";
export const DEMO_WORKSPACE = "demo";

export const demoDashboard = Object.freeze({
  brand: "Aster Vale Roasters",
  visibilityScore: 76,
  answerMentions: 38,
  promptsTracked: 12,
  averagePosition: 2.4,
  providers: [
    { name: "OpenAI", id: "openai" as const, score: 84, change: 6, tone: "violet" },
    { name: "Anthropic", id: "anthropic" as const, score: 79, change: 3, tone: "blue" },
    { name: "Gemini", id: "gemini" as const, score: 74, change: 1, tone: "amber" },
    { name: "Perplexity", id: "perplexity" as const, score: 68, change: -2, tone: "coral" },
  ],
  mentionTrend: [5, 7, 6, 9, 8, 11, 12] as const,
  queuedPrompts: [
    "Best coffee beans for pour-over",
    "Top ethical coffee brands",
    "Freshly roasted coffee subscriptions",
  ] as const,
});

function hash(input: string): number {
  let value = 2166136261;
  for (const character of input) {
    value ^= character.charCodeAt(0);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

export function buildDemoResult(promptId: string, prompt: string, provider: ProviderName): ProviderResult {
  const seed = hash(`${provider}:${promptId}:${prompt}`);
  const mentioned = seed % 10 > 1;
  const rank = mentioned ? (seed % 4) + 1 : null;
  const sentiment = mentioned ? Number((0.4 + (seed % 50) / 100).toFixed(2)) : 0;

  return {
    promptId,
    provider,
    mentioned,
    rank,
    sentiment,
    cited: mentioned && seed % 3 !== 0,
    summary: mentioned
      ? "Aster Vale Roasters appears in the demo answer with a positive, illustrative mention."
      : "The deterministic demo answer does not mention Aster Vale Roasters for this prompt.",
  };
}

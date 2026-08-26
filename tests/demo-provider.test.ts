import { describe, expect, it } from "vitest";
import { DEMO_NOW, buildDemoResult, demoDashboard } from "@/lib/demo/fixtures";
import { DemoProviderAdapter } from "@/lib/providers/demo";

describe("deterministic demo behavior", () => {
  it("uses a fixed demo clock and stable dashboard fixture", () => {
    expect(DEMO_NOW).toBe("2026-01-12T10:00:00.000Z");
    expect(demoDashboard.visibilityScore).toBe(76);
    expect(demoDashboard.providers.map((provider) => provider.score)).toEqual([84, 79, 74, 68]);
  });

  it("returns identical fixture results for identical inputs", () => {
    const first = buildDemoResult("prompt-a", "Best coffee beans?", "openai");
    const second = buildDemoResult("prompt-a", "Best coffee beans?", "openai");
    expect(first).toEqual(second);
  });

  it("keeps demo provider responses deterministic and provider-specific", async () => {
    const adapter = new DemoProviderAdapter();
    const request = {
      brand: "Aster Vale Roasters",
      promptId: "prompt-a",
      prompt: "Best coffee beans?",
      provider: "openai" as const,
    };
    const first = await adapter.run(request);
    const second = await adapter.run(request);
    const otherProvider = await adapter.run({ ...request, provider: "gemini" });

    expect(first).toEqual(second);
    expect(first.provider).toBe("openai");
    expect(otherProvider.provider).toBe("gemini");
    expect(otherProvider).not.toEqual(first);
  });
});

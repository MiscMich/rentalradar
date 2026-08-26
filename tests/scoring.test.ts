import { describe, expect, it } from "vitest";
import { scoreVisibility } from "@/lib/domain/scoring";

describe("visibility scoring", () => {
  it("returns zero for an empty observation set", () => {
    expect(scoreVisibility([])).toEqual({ mention: 0, position: 0, sentiment: 0, citation: 0, total: 0 });
  });

  it("returns 100 for a cited, first-position, positive mention", () => {
    expect(scoreVisibility([{
      provider: "openai",
      mentioned: true,
      rank: 1,
      sentiment: 1,
      cited: true,
    }])).toEqual({ mention: 55, position: 25, sentiment: 10, citation: 10, total: 100 });
  });

  it("penalizes missing mentions and clamps malformed input values", () => {
    const result = scoreVisibility([
      { provider: "openai", mentioned: true, rank: -4, sentiment: 4, cited: true },
      { provider: "gemini", mentioned: false, rank: 1, sentiment: 1, cited: false },
    ]);
    expect(result).toEqual({ mention: 27.5, position: 12.5, sentiment: 5, citation: 5, total: 50 });
  });
});

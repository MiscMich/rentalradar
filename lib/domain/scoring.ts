import type { VisibilityObservation } from "./types";

export interface VisibilityScoreBreakdown {
  citation: number;
  mention: number;
  position: number;
  sentiment: number;
  total: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function round(value: number): number {
  return Math.round(value * 10) / 10;
}

export function scoreVisibility(observations: readonly VisibilityObservation[]): VisibilityScoreBreakdown {
  if (observations.length === 0) {
    return { mention: 0, position: 0, sentiment: 0, citation: 0, total: 0 };
  }

  const mentioned = observations.filter((observation) => observation.mentioned);
  const mention = (mentioned.length / observations.length) * 55;
  const position = observations.reduce((sum, observation) => {
    if (!observation.mentioned || observation.rank === null) return sum;
    return sum + clamp((6 - observation.rank) / 5, 0, 1);
  }, 0) / observations.length * 25;
  const sentiment = observations.reduce((sum, observation) => {
    if (!observation.mentioned) return sum;
    return sum + clamp((observation.sentiment + 1) / 2, 0, 1);
  }, 0) / observations.length * 10;
  const citation = observations.filter((observation) => observation.cited).length / observations.length * 10;

  return {
    mention: round(mention),
    position: round(position),
    sentiment: round(sentiment),
    citation: round(citation),
    total: round(mention + position + sentiment + citation),
  };
}

import type { ProviderName } from "@/lib/config/env";

export interface PromptRecord {
  id: string;
  tenantId: string;
  text: string;
  createdAt: string;
  enabled: boolean;
}

export interface VisibilityObservation {
  provider: ProviderName;
  mentioned: boolean;
  rank: number | null;
  sentiment: number;
  cited: boolean;
}

export interface ProviderResult extends VisibilityObservation {
  promptId: string;
  summary: string;
}

export interface ProviderRequest {
  brand: string;
  promptId: string;
  prompt: string;
  provider: ProviderName;
}

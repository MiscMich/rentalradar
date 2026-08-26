import "server-only";

import type { HttpProviderConfig } from "@/lib/config/env";
import type { ProviderRequest, ProviderResult } from "@/lib/domain/types";
import type { ProviderAdapter } from "./types";

interface GenericProviderPayload {
  mentioned?: boolean;
  rank?: number | null;
  sentiment?: number;
  cited?: boolean;
  summary?: string;
}

export class HttpProviderAdapter implements ProviderAdapter {
  constructor(private readonly config: HttpProviderConfig) {}

  async run(request: ProviderRequest): Promise<ProviderResult> {
    const response = await fetch(this.config.baseUrl, {
      method: "POST",
      headers: {
        "authorization": `Bearer ${this.config.apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: this.config.model,
        brand: request.brand,
        prompt: request.prompt,
      }),
      cache: "no-store",
    });

    if (!response.ok) throw new Error(`Provider request failed with status ${response.status}`);
    const payload = await response.json() as GenericProviderPayload;

    return {
      promptId: request.promptId,
      provider: request.provider,
      mentioned: payload.mentioned === true,
      rank: typeof payload.rank === "number" ? payload.rank : null,
      sentiment: typeof payload.sentiment === "number" ? payload.sentiment : 0,
      cited: payload.cited === true,
      summary: typeof payload.summary === "string" ? payload.summary : "Provider response received.",
    };
  }
}

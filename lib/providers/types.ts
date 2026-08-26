import type { ProviderRequest, ProviderResult } from "@/lib/domain/types";

export interface ProviderAdapter {
  run(request: ProviderRequest): Promise<ProviderResult>;
}

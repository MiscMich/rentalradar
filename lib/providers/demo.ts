import { buildDemoResult } from "@/lib/demo/fixtures";
import type { ProviderRequest } from "@/lib/domain/types";
import type { ProviderAdapter } from "./types";

export class DemoProviderAdapter implements ProviderAdapter {
  async run(request: ProviderRequest) {
    return buildDemoResult(request.promptId, request.prompt, request.provider);
  }
}

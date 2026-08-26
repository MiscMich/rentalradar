import type { PromptRecord, ProviderResult } from "@/lib/domain/types";

export class TenantScopeError extends Error {
  constructor() {
    super("A tenant scope is required");
    this.name = "TenantScopeError";
  }
}

export class ResourceUnavailableError extends Error {
  constructor() {
    super("Resource is unavailable in this scope");
    this.name = "ResourceUnavailableError";
  }
}

interface PromptInput {
  id: string;
  text: string;
  createdAt: string;
  enabled?: boolean;
}

interface ResultInput extends Omit<ProviderResult, "promptId"> {
  promptId: string;
}

function promptKey(tenantId: string, promptId: string): string {
  return JSON.stringify([tenantId, promptId]);
}

export class InMemoryTenantRepository {
  readonly #prompts = new Map<string, PromptRecord>();
  readonly #results = new Map<string, ProviderResult[]>();

  forTenant(tenantId: string | undefined): TenantRepositoryScope {
    if (!tenantId?.trim()) throw new TenantScopeError();
    return new TenantRepositoryScope(tenantId, this.#prompts, this.#results);
  }
}

export class TenantRepositoryScope {
  constructor(
    private readonly tenantId: string,
    private readonly prompts: Map<string, PromptRecord>,
    private readonly results: Map<string, ProviderResult[]>,
  ) {}

  listPrompts(): readonly PromptRecord[] {
    return [...this.prompts.values()]
      .filter((prompt) => prompt.tenantId === this.tenantId)
      .map((prompt) => ({ ...prompt }));
  }

  getPrompt(id: string): PromptRecord {
    const prompt = this.prompts.get(promptKey(this.tenantId, id));
    if (!prompt) throw new ResourceUnavailableError();
    return { ...prompt };
  }

  createPrompt(input: PromptInput): PromptRecord {
    const key = promptKey(this.tenantId, input.id);
    if (!input.id.trim() || !input.text.trim() || this.prompts.has(key)) {
      throw new ResourceUnavailableError();
    }

    const prompt: PromptRecord = {
      id: input.id,
      tenantId: this.tenantId,
      text: input.text,
      createdAt: input.createdAt,
      enabled: input.enabled ?? true,
    };
    this.prompts.set(key, prompt);
    return { ...prompt };
  }

  updatePrompt(id: string, changes: Partial<Pick<PromptRecord, "text" | "enabled">>): PromptRecord {
    const current = this.getPrompt(id);
    const updated = { ...current, ...changes, tenantId: this.tenantId, id: current.id };
    if (!updated.text.trim()) throw new ResourceUnavailableError();
    this.prompts.set(promptKey(this.tenantId, id), updated);
    return { ...updated };
  }

  addResult(input: ResultInput): ProviderResult {
    this.getPrompt(input.promptId);
    const result = { ...input };
    const tenantResults = this.results.get(this.tenantId) ?? [];
    tenantResults.push(result);
    this.results.set(this.tenantId, tenantResults);
    return { ...result };
  }

  listResults(promptId: string): readonly ProviderResult[] {
    this.getPrompt(promptId);
    return (this.results.get(this.tenantId) ?? [])
      .filter((result) => result.promptId === promptId)
      .map((result) => ({ ...result }));
  }
}

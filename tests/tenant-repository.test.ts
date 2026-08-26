import { describe, expect, it } from "vitest";
import {
  InMemoryTenantRepository,
  ResourceUnavailableError,
  TenantScopeError,
} from "@/lib/repository/tenant-repository";

const createdAt = "2026-01-12T10:00:00.000Z";

describe("tenant-scoped repository", () => {
  it("fails closed without a tenant scope", () => {
    const repository = new InMemoryTenantRepository();
    expect(() => repository.forTenant(undefined)).toThrow(TenantScopeError);
    expect(() => repository.forTenant(" ")).toThrow(TenantScopeError);
  });

  it("does not reveal records across tenants", () => {
    const repository = new InMemoryTenantRepository();
    const north = repository.forTenant("tenant-north");
    const south = repository.forTenant("tenant-south");
    north.createPrompt({ id: "prompt-a", text: "A safe prompt", createdAt });

    expect(south.listPrompts()).toEqual([]);
    expect(() => south.getPrompt("prompt-a")).toThrow(ResourceUnavailableError);
    expect(() => south.updatePrompt("prompt-a", { text: "Attempted overwrite" }))
      .toThrow(ResourceUnavailableError);
    expect(north.getPrompt("prompt-a").text).toBe("A safe prompt");
  });

  it("keys prompt ids by tenant so both tenants can use the same id", () => {
    const repository = new InMemoryTenantRepository();
    const north = repository.forTenant("tenant-north");
    const south = repository.forTenant("tenant-south");

    north.createPrompt({ id: "shared-id", text: "North", createdAt });
    south.createPrompt({ id: "shared-id", text: "South", createdAt });

    expect(north.getPrompt("shared-id").text).toBe("North");
    expect(south.getPrompt("shared-id").text).toBe("South");
  });

  it("makes a cross-tenant existing id indistinguishable from an absent id", () => {
    const repository = new InMemoryTenantRepository();
    const north = repository.forTenant("tenant-north");
    const south = repository.forTenant("tenant-south");
    north.createPrompt({ id: "private-id", text: "North", createdAt });

    const observe = (id: string) => {
      try {
        south.getPrompt(id);
        return "available";
      } catch (error) {
        const unavailable = error as ResourceUnavailableError;
        return `${unavailable.name}:${unavailable.message}`;
      }
    };

    expect(observe("private-id")).toBe(observe("absent-id"));
  });

  it("only accepts results for prompts owned by the active scope", () => {
    const repository = new InMemoryTenantRepository();
    const north = repository.forTenant("tenant-north");
    const south = repository.forTenant("tenant-south");
    north.createPrompt({ id: "prompt-a", text: "A safe prompt", createdAt });

    expect(() => south.addResult({
      promptId: "prompt-a",
      provider: "openai",
      mentioned: true,
      rank: 1,
      sentiment: 1,
      cited: true,
      summary: "Should not be stored",
    })).toThrow(ResourceUnavailableError);
    expect(north.listResults("prompt-a")).toEqual([]);
  });

  it("returns copies rather than mutable internal records", () => {
    const repository = new InMemoryTenantRepository();
    const scoped = repository.forTenant("tenant-north");
    const record = scoped.createPrompt({ id: "prompt-a", text: "Original", createdAt });
    record.text = "Mutated outside repository";
    expect(scoped.getPrompt("prompt-a").text).toBe("Original");
  });
});

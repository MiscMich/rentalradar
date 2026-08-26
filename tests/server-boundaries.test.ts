import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("server-only boundaries", () => {
  it.each([
    "lib/config/server.ts",
    "lib/providers/http.server.ts",
    "lib/providers/server.ts",
  ])("marks %s as server-only", async (file) => {
    const source = await readFile(new URL(`../${file}`, import.meta.url), "utf8");
    expect(source).toContain('import "server-only"');
  });
});

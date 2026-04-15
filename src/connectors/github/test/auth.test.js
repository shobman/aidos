import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, readFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { loadToken, saveToken } from "../auth.js";

describe("token cache", () => {
  let dir;

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), "aidos-auth-"));
  });

  afterEach(async () => {
    await rm(dir, { recursive: true });
  });

  it("returns null when no cached token", async () => {
    const token = await loadToken(join(dir, "auth.json"));
    assert.equal(token, null);
  });

  it("round-trips a token", async () => {
    const path = join(dir, "auth.json");
    await saveToken(path, { access_token: "gho_abc123", token_type: "bearer", scope: "repo" });
    const loaded = await loadToken(path);
    assert.equal(loaded.access_token, "gho_abc123");
  });

  it("returns null for corrupted file", async () => {
    const path = join(dir, "auth.json");
    const { writeFile } = await import("node:fs/promises");
    await writeFile(path, "not json");
    const token = await loadToken(path);
    assert.equal(token, null);
  });
});


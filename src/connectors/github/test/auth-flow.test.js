import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, readFile, writeFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { ensureAuth } from "../auth.js";

async function exists(p) {
  try { await stat(p); return true; } catch { return false; }
}

describe("ensureAuth two-phase flow", () => {
  let dir, authPath, pendingPath;

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), "aidos-auth-flow-"));
    authPath = join(dir, "auth.json");
    pendingPath = join(dir, "pending_auth.json");
    process.env.AIDOS_GITHUB_CLIENT_ID = "Iv23li_test";
  });

  afterEach(async () => {
    await rm(dir, { recursive: true });
    delete process.env.AIDOS_GITHUB_CLIENT_ID;
  });

  it("first call initiates device flow and writes pending_auth.json", async () => {
    const fetchFn = async (url) => {
      if (url.includes("/login/device/code")) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            device_code: "dc_1",
            user_code: "AAAA-1111",
            verification_uri: "https://github.com/login/device",
            interval: 5,
            expires_in: 900,
          }),
        };
      }
      throw new Error("no unexpected fetches");
    };

    const result = await ensureAuth({ path: authPath, pendingPath, fetchFn });
    assert.equal(result.authenticated, false);
    assert.match(result.message, /AAAA-1111/);
    assert.match(result.message, /github\.com\/login\/device/);
    assert.ok(await exists(pendingPath), "pending_auth.json should be written");
  });

  it("second call polls token endpoint and succeeds", async () => {
    await writeFile(pendingPath, JSON.stringify({
      device_code: "dc_1",
      user_code: "AAAA-1111",
      verification_uri: "https://github.com/login/device",
      expires_at: Date.now() + 900_000,
      interval: 5,
    }));

    const fetchFn = async (url) => {
      if (url.includes("/login/oauth/access_token")) {
        return { ok: true, status: 200, json: async () => ({ access_token: "gho_ok", token_type: "bearer", scope: "repo" }) };
      }
      if (url.includes("/user")) {
        return { ok: true, status: 200, json: async () => ({ login: "simon" }) };
      }
      throw new Error(`unexpected ${url}`);
    };

    const result = await ensureAuth({ path: authPath, pendingPath, fetchFn });
    assert.equal(result.authenticated, true);
    assert.equal(result.token, "gho_ok");
    assert.equal(result.login, "simon");
    assert.ok(await exists(authPath), "auth.json should be written");
    assert.equal(await exists(pendingPath), false, "pending_auth.json should be deleted");
  });

  it("authorization_pending returns retry message", async () => {
    await writeFile(pendingPath, JSON.stringify({
      device_code: "dc_1",
      user_code: "AAAA-1111",
      verification_uri: "https://github.com/login/device",
      expires_at: Date.now() + 900_000,
      interval: 5,
    }));

    const fetchFn = async () => ({
      ok: true, status: 200,
      json: async () => ({ error: "authorization_pending" }),
    });

    const result = await ensureAuth({ path: authPath, pendingPath, fetchFn });
    assert.equal(result.authenticated, false);
    assert.match(result.message, /still waiting/i);
    assert.match(result.message, /AAAA-1111/);
    assert.ok(await exists(pendingPath), "pending_auth.json should remain");
  });

  it("expired_token clears pending and restarts flow", async () => {
    await writeFile(pendingPath, JSON.stringify({
      device_code: "dc_1",
      user_code: "AAAA-1111",
      verification_uri: "https://github.com/login/device",
      expires_at: Date.now() + 900_000,
      interval: 5,
    }));

    let devFlowRestarted = false;
    const fetchFn = async (url) => {
      if (url.includes("/login/oauth/access_token")) {
        return { ok: true, status: 200, json: async () => ({ error: "expired_token" }) };
      }
      if (url.includes("/login/device/code")) {
        devFlowRestarted = true;
        return {
          ok: true, status: 200,
          json: async () => ({ device_code: "dc_2", user_code: "BBBB-2222", verification_uri: "https://github.com/login/device", interval: 5, expires_in: 900 }),
        };
      }
      throw new Error(`unexpected ${url}`);
    };

    const result = await ensureAuth({ path: authPath, pendingPath, fetchFn });
    assert.equal(result.authenticated, false);
    assert.ok(devFlowRestarted, "device flow should restart");
    assert.match(result.message, /BBBB-2222/);
  });

  it("access_denied clears pending and returns denial message", async () => {
    await writeFile(pendingPath, JSON.stringify({
      device_code: "dc_1",
      user_code: "AAAA-1111",
      verification_uri: "https://github.com/login/device",
      expires_at: Date.now() + 900_000,
      interval: 5,
    }));

    const fetchFn = async () => ({ ok: true, status: 200, json: async () => ({ error: "access_denied" }) });

    const result = await ensureAuth({ path: authPath, pendingPath, fetchFn });
    assert.equal(result.authenticated, false);
    assert.match(result.message, /denied/i);
    assert.equal(await exists(pendingPath), false);
  });

  it("cached token validates and returns authenticated", async () => {
    await writeFile(authPath, JSON.stringify({ access_token: "gho_cached" }));
    const fetchFn = async (url) => {
      if (url.includes("/user")) {
        return { ok: true, status: 200, json: async () => ({ login: "simon" }) };
      }
      throw new Error(`unexpected ${url}`);
    };
    const result = await ensureAuth({ path: authPath, pendingPath, fetchFn });
    assert.equal(result.authenticated, true);
    assert.equal(result.token, "gho_cached");
    assert.equal(result.login, "simon");
  });

  it("401 on cached token clears it and initiates fresh flow", async () => {
    await writeFile(authPath, JSON.stringify({ access_token: "gho_revoked" }));
    const fetchFn = async (url) => {
      if (url.includes("/user")) {
        return { ok: false, status: 401, json: async () => ({}) };
      }
      if (url.includes("/login/device/code")) {
        return {
          ok: true, status: 200,
          json: async () => ({ device_code: "dc_x", user_code: "CCCC-3333", verification_uri: "https://github.com/login/device", interval: 5, expires_in: 900 }),
        };
      }
      throw new Error(`unexpected ${url}`);
    };
    const result = await ensureAuth({ path: authPath, pendingPath, fetchFn });
    assert.equal(result.authenticated, false);
    assert.match(result.message, /CCCC-3333/);
    assert.equal(await exists(authPath), false, "expired auth.json should be cleared");
  });

  it("returns setup message when AIDOS_GITHUB_CLIENT_ID not set", async () => {
    delete process.env.AIDOS_GITHUB_CLIENT_ID;
    const result = await ensureAuth({ path: authPath, pendingPath, fetchFn: async () => ({}) });
    assert.equal(result.authenticated, false);
    assert.match(result.message, /AIDOS_GITHUB_CLIENT_ID|OAuth App Client ID/);
  });

  it("returns invalid client ID message when device code returns 404", async () => {
    const fetchFn = async () => ({ ok: false, status: 404, text: async () => "Not Found", json: async () => ({}) });
    const result = await ensureAuth({ path: authPath, pendingPath, fetchFn });
    assert.equal(result.authenticated, false);
    assert.match(result.message, /Client ID/);
    assert.match(result.message, /invalid|404/i);
  });

  it("treats expired pending as fresh start", async () => {
    await writeFile(pendingPath, JSON.stringify({
      device_code: "old", user_code: "OLD-CODE",
      verification_uri: "https://github.com/login/device",
      expires_at: Date.now() - 1000,
      interval: 5,
    }));
    const fetchFn = async (url) => {
      if (url.includes("/login/device/code")) {
        return {
          ok: true, status: 200,
          json: async () => ({ device_code: "new", user_code: "NEW-CODE", verification_uri: "https://github.com/login/device", interval: 5, expires_in: 900 }),
        };
      }
      throw new Error(`unexpected ${url}`);
    };
    const result = await ensureAuth({ path: authPath, pendingPath, fetchFn });
    assert.match(result.message, /NEW-CODE/);
    assert.doesNotMatch(result.message, /OLD-CODE/);
  });
});

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { preflightPublish } from "../server.js";

function mockClient(overrides = {}) {
  return {
    getBranch: async () => ({ commit: { sha: "abc" } }),
    compare: async () => ({ ahead_by: 1, behind_by: 0, files: [] }),
    lookupUser: async (login) => ({ login }),
    lookupTeam: async (org, slug) => ({ slug, org }),
    ...overrides,
  };
}

describe("preflightPublish", () => {
  it("passes when all checks ok", async () => {
    const client = mockClient();
    const result = await preflightPublish(client, "org", "repo", "aidos/simon", {
      strategy: "pr", target: "main", reviewers: [],
    });
    assert.equal(result.ok, true);
    assert.ok(result.checks.every((c) => c.pass));
  });

  it("fails when target branch missing", async () => {
    const client = mockClient({
      getBranch: async (o, r, b) => {
        if (b === "main") throw new Error("GitHub API 404");
        return { commit: { sha: "abc" } };
      },
    });
    const result = await preflightPublish(client, "org", "repo", "aidos/simon", {
      strategy: "pr", target: "main", reviewers: [],
    });
    assert.equal(result.ok, false);
    assert.ok(result.checks.find((c) => c.name === "target_branch" && !c.pass));
  });

  it("fails on merge conflict (behind_by > 0 with diverged history)", async () => {
    const client = mockClient({
      compare: async () => ({ ahead_by: 1, behind_by: 2, files: [] }),
    });
    const result = await preflightPublish(client, "org", "repo", "aidos/simon", {
      strategy: "pr", target: "main", reviewers: [],
    });
    assert.equal(result.ok, false);
    const conflict = result.checks.find((c) => c.name === "conflicts");
    assert.ok(conflict && !conflict.pass);
  });

  it("validates individual reviewer via lookupUser", async () => {
    let lookedUp;
    const client = mockClient({
      lookupUser: async (login) => { lookedUp = login; return { login }; },
    });
    const result = await preflightPublish(client, "org", "repo", "aidos/simon", {
      strategy: "pr", target: "main", reviewers: ["alice"],
    });
    assert.equal(lookedUp, "alice");
    assert.equal(result.ok, true);
  });

  it("fails on invalid reviewer", async () => {
    const client = mockClient({
      lookupUser: async () => { throw new Error("GitHub API 404"); },
    });
    const result = await preflightPublish(client, "org", "repo", "aidos/simon", {
      strategy: "pr", target: "main", reviewers: ["bob"],
    });
    assert.equal(result.ok, false);
    assert.ok(result.checks.find((c) => c.name === "reviewers" && !c.pass));
  });

  it("validates team reviewer (@prefix) via lookupTeam", async () => {
    let lookedUp;
    const client = mockClient({
      lookupTeam: async (org, slug) => { lookedUp = { org, slug }; return { slug }; },
    });
    const result = await preflightPublish(client, "org", "repo", "aidos/simon", {
      strategy: "pr", target: "main", reviewers: ["@reviewers"],
    });
    assert.deepEqual(lookedUp, { org: "org", slug: "reviewers" });
    assert.equal(result.ok, true);
  });
});

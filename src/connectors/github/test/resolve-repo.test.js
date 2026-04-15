import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { resolveRepo } from "../server.js";

function mockClient(overrides = {}) {
  return {
    getRepo: async () => { throw new Error("not mocked"); },
    listUserRepos: async () => [],
    searchRepos: async () => ({ items: [] }),
    ...overrides,
  };
}

describe("resolveRepo", () => {
  it("direct org/repo resolves via getRepo", async () => {
    const client = mockClient({
      getRepo: async (o, r) => ({ full_name: `${o}/${r}` }),
    });
    const result = await resolveRepo(client, "org/my-repo");
    assert.equal(result.status, "single");
    assert.equal(result.repo, "org/my-repo");
  });

  it("direct org/repo returns none on 404", async () => {
    const client = mockClient({
      getRepo: async () => { throw new Error("GitHub API 404: Not Found"); },
      searchRepos: async () => ({ items: [] }),
    });
    const result = await resolveRepo(client, "org/missing");
    assert.equal(result.status, "none");
  });

  it("short name with single match returns it", async () => {
    const client = mockClient({
      listUserRepos: async () => [{ full_name: "org/Zenith.Core" }],
    });
    const result = await resolveRepo(client, "Zenith.Core");
    assert.equal(result.status, "single");
    assert.equal(result.repo, "org/Zenith.Core");
  });

  it("short name with multiple matches returns list", async () => {
    const client = mockClient({
      listUserRepos: async () => [
        { full_name: "org/Zenith.Core" },
        { full_name: "org/Zenith.Data" },
        { full_name: "org/Zenith.Web" },
      ],
    });
    const result = await resolveRepo(client, "Zenith");
    assert.equal(result.status, "multiple");
    assert.deepEqual(result.matches.sort(), ["org/Zenith.Core", "org/Zenith.Data", "org/Zenith.Web"].sort());
  });

  it("case-insensitive matching", async () => {
    const client = mockClient({
      listUserRepos: async () => [{ full_name: "org/Zenith.Core" }],
    });
    const result = await resolveRepo(client, "zenith.core");
    assert.equal(result.status, "single");
    assert.equal(result.repo, "org/Zenith.Core");
  });

  it("falls back to search when user repos has no match", async () => {
    const client = mockClient({
      listUserRepos: async () => [],
      searchRepos: async () => ({ items: [{ full_name: "other/Zenith.Core" }] }),
    });
    const result = await resolveRepo(client, "Zenith.Core");
    assert.equal(result.status, "single");
    assert.equal(result.repo, "other/Zenith.Core");
  });

  it("zero matches returns none", async () => {
    const client = mockClient();
    const result = await resolveRepo(client, "nonexistent");
    assert.equal(result.status, "none");
  });
});

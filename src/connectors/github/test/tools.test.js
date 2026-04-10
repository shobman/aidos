import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { resolveWorkspace, readArtifacts } from "../server.js";

function mockClient(overrides = {}) {
  const defaults = {
    getUser: async () => ({ login: "simon" }),
    searchRepos: async () => ({ items: [{ full_name: "org/my-repo", default_branch: "main" }] }),
    getRepo: async (o, r) => ({ full_name: `${o}/${r}`, default_branch: "main" }),
    getBranch: async () => { throw new Error("GitHub API 404"); },
    listBranches: async () => [],
    createBranch: async () => ({ ref: "refs/heads/aidos/simon" }),
    getTree: async () => ({
      sha: "root",
      tree: [
        { path: ".aidos/problem.md", type: "blob", sha: "aaa" },
        { path: ".aidos/manifest.json", type: "blob", sha: "bbb" },
        { path: "src/index.js", type: "blob", sha: "ccc" },
      ],
    }),
    getBlob: async () => ({
      content: Buffer.from(JSON.stringify({ write: { strategy: "pr", target: "main" } })).toString("base64"),
      encoding: "base64",
    }),
    merge: async () => ({}),
  };
  return { ...defaults, ...overrides };
}

describe("resolveWorkspace", () => {
  it("creates branch when it does not exist", async () => {
    let getBranchCallCount = 0;
    const client = mockClient({
      // First call (check if user branch exists) → 404
      // Second call (get default branch SHA) → success
      // Third call (get user branch head after create) → success
      getBranch: async (owner, repo, branch) => {
        getBranchCallCount++;
        if (branch === "aidos/simon") {
          throw new Error("GitHub API 404");
        }
        // Default branch or user branch after creation
        return { commit: { sha: "abc123" }, name: branch };
      },
    });

    const result = await resolveWorkspace(client, "simon", "org/my-repo", null);

    assert.equal(result.branch, "aidos/simon");
    assert.equal(result.branch_created, true);
    assert.equal(result.default_branch, "main");
    assert.equal(result.repo, "org/my-repo");
  });

  it("syncs existing branch", async () => {
    let mergeCalled = false;
    const client = mockClient({
      getBranch: async () => ({ commit: { sha: "abc123" }, name: "aidos/simon" }),
      merge: async () => {
        mergeCalled = true;
        return {};
      },
    });

    const result = await resolveWorkspace(client, "simon", "org/my-repo", null);

    assert.equal(result.branch_created, false);
    assert.equal(result.branch, "aidos/simon");
    assert.ok(mergeCalled, "merge should be called to sync existing branch");
  });

  it("discovers .aidos/ folders", async () => {
    const client = mockClient({
      getBranch: async (owner, repo, branch) => ({ commit: { sha: "abc123" }, name: branch }),
    });

    const result = await resolveWorkspace(client, "simon", "org/my-repo", null);

    assert.equal(result.aidos_folders.length, 1);
    assert.equal(result.aidos_folders[0].path, ".aidos");
    assert.ok(result.aidos_folders[0].write, "write config should be present");
  });

  it("discovers multiple .aidos/ folders in monorepo", async () => {
    const client = mockClient({
      getBranch: async (owner, repo, branch) => ({ commit: { sha: "abc123" }, name: branch }),
      getTree: async () => ({
        sha: "root",
        tree: [
          { path: ".aidos/problem.md", type: "blob", sha: "aaa" },
          { path: ".aidos/manifest.json", type: "blob", sha: "bbb" },
          { path: "services/auth/.aidos/problem.md", type: "blob", sha: "ccc" },
          { path: "services/auth/.aidos/manifest.json", type: "blob", sha: "ddd" },
          { path: "src/index.js", type: "blob", sha: "eee" },
        ],
      }),
    });

    const result = await resolveWorkspace(client, "simon", "org/my-repo", null);

    assert.equal(result.aidos_folders.length, 2);
    const paths = result.aidos_folders.map((f) => f.path);
    assert.ok(paths.includes(".aidos"), "root .aidos/ should be found");
    assert.ok(paths.includes("services/auth/.aidos"), "nested .aidos/ should be found");
  });
});

describe("readArtifacts", () => {
  it("returns all files from .aidos/ folder", async () => {
    const client = mockClient({
      getBranch: async () => ({ commit: { sha: "head123" }, name: "aidos/simon" }),
      getTree: async () => ({
        sha: "root",
        tree: [
          { path: ".aidos/problem.md", type: "blob", sha: "sha1" },
          { path: ".aidos/solution.md", type: "blob", sha: "sha2" },
          { path: ".aidos/manifest.json", type: "blob", sha: "sha3" },
          { path: ".aidos/feature-auth/feature-auth.md", type: "blob", sha: "sha4" },
          { path: "src/index.js", type: "blob", sha: "sha5" },
        ],
      }),
      getBlob: async (owner, repo, sha) => ({
        content: Buffer.from(`content of ${sha}`).toString("base64"),
        encoding: "base64",
      }),
    });

    const result = await readArtifacts(client, "org", "my-repo", "aidos/simon", ".aidos");

    assert.equal(result.files.length, 4, "should return only .aidos/ files");
    const paths = result.files.map((f) => f.path);
    assert.ok(paths.includes(".aidos/problem.md"));
    assert.ok(paths.includes(".aidos/solution.md"));
    assert.ok(paths.includes(".aidos/manifest.json"));
    assert.ok(paths.includes(".aidos/feature-auth/feature-auth.md"));
    assert.ok(!paths.includes("src/index.js"), "src/ file should not be included");

    for (const file of result.files) {
      assert.ok(file.path, "each file should have a path");
      assert.ok(file.content, "each file should have content");
      assert.ok(file.sha, "each file should have a sha");
    }
  });

  it("returns empty array for folder with no files", async () => {
    const client = mockClient({
      getBranch: async () => ({ commit: { sha: "head123" }, name: "aidos/simon" }),
      getTree: async () => ({ sha: "root", tree: [] }),
    });

    const result = await readArtifacts(client, "org", "my-repo", "aidos/simon", ".aidos");

    assert.equal(result.files.length, 0);
  });
});

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { userFacingError, mapGitHubError } from "../errors.js";

describe("userFacingError", () => {
  it("maps 401 to session expired message", () => {
    const msg = userFacingError(401, "any");
    assert.match(msg, /session has expired/i);
  });

  it("maps 403 with repo_read context", () => {
    const msg = userFacingError(403, "repo_read");
    assert.match(msg, /permission to access this repo/i);
    assert.match(msg, /org access/i);
  });

  it("maps 403 with repo_write context", () => {
    const msg = userFacingError(403, "repo_write");
    assert.match(msg, /write access/i);
  });

  it("maps 404 with repo context", () => {
    const msg = userFacingError(404, "repo");
    assert.match(msg, /not found/i);
  });

  it("maps 404 with branch context", () => {
    const msg = userFacingError(404, "branch");
    assert.match(msg, /branch not found/i);
  });

  it("maps 409 push conflict", () => {
    const msg = userFacingError(409, "push", { target: "main" });
    assert.match(msg, /conflict/i);
    assert.match(msg, /main/);
  });

  it("maps 422 PR creation", () => {
    const msg = userFacingError(422, "pr_create");
    assert.match(msg, /Couldn't create the PR/i);
  });

  it("maps 422 reviewer", () => {
    const msg = userFacingError(422, "pr_reviewers", { name: "bob" });
    assert.match(msg, /reviewer 'bob'/i);
  });

  it("maps 5xx to GitHub outage", () => {
    assert.match(userFacingError(500, "any"), /GitHub is having issues/i);
    assert.match(userFacingError(503, "any"), /GitHub is having issues/i);
  });

  it("maps network errors", () => {
    const msg = userFacingError("network", "any");
    assert.match(msg, /Can't reach GitHub/i);
  });

  it("falls back to generic message for unmapped status", () => {
    const msg = userFacingError(418, "any");
    assert.match(msg, /unexpected/i);
  });
});

describe("mapGitHubError", () => {
  it("extracts status from GitHub API Error message", () => {
    const err = new Error("GitHub API 404 [getRepo]: {}");
    const result = mapGitHubError(err, "repo");
    assert.equal(result.status, 404);
    assert.match(result.message, /not found/i);
  });

  it("detects network errors by name", () => {
    const err = new TypeError("fetch failed");
    const result = mapGitHubError(err, "any");
    assert.equal(result.status, "network");
    assert.match(result.message, /Can't reach GitHub/i);
  });

  it("passes through unknown errors as 0/unexpected", () => {
    const err = new Error("random failure");
    const result = mapGitHubError(err, "any");
    assert.equal(result.status, 0);
  });
});

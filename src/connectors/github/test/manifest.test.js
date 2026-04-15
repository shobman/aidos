import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { validateManifest } from "../manifest.js";

describe("validateManifest", () => {
  it("accepts a minimal valid manifest", () => {
    const result = validateManifest({ write: { strategy: "pr", target: "main" } });
    assert.equal(result.valid, true);
    assert.deepEqual(result.errors, []);
  });

  it("accepts a fully configured manifest", () => {
    const result = validateManifest({
      write: { strategy: "pr", target: "main", reviewers: ["@team"] },
      publish: { confluence: { space: "ENG" } },
    });
    assert.equal(result.valid, true);
  });

  it("rejects unknown top-level keys", () => {
    const result = validateManifest({ write: {}, bogus: 1 });
    assert.equal(result.valid, false);
    assert.ok(result.errors.some((e) => /bogus|additional/i.test(e)));
  });

  it("rejects invalid strategy", () => {
    const result = validateManifest({ write: { strategy: "force-push" } });
    assert.equal(result.valid, false);
  });

  it("rejects non-array reviewers", () => {
    const result = validateManifest({ write: { reviewers: "alice" } });
    assert.equal(result.valid, false);
  });

  it("returns valid for empty object", () => {
    const result = validateManifest({});
    assert.equal(result.valid, true);
  });
});

import assert from "node:assert/strict";
import test from "node:test";
import { resolve } from "node:path";
import { getGitDiff } from "../server/git-diff.mjs";

const repositoryPath = resolve(import.meta.dirname, "../../..");

test("returns a read-only diff for a Git repository", async () => {
  const result = await getGitDiff({ repositoryPath, maxBytes: 1_000 });
  assert.equal(result.repository_path, repositoryPath);
  assert.equal(result.base_ref, null);
  assert.ok(Array.isArray(result.changed_files));
  assert.equal(typeof result.diff, "string");
  assert.equal(typeof result.truncated, "boolean");
});

test("rejects an option-like base revision", async () => {
  await assert.rejects(getGitDiff({ repositoryPath, baseRef: "--not-a-revision" }), /cannot start with '-'/);
});

test("rejects a non-Git directory", async () => {
  await assert.rejects(getGitDiff({ repositoryPath: "/private/tmp" }), /Git working tree/);
});

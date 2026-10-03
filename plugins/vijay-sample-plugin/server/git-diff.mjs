import { execFile as execFileCallback } from "node:child_process";
import { realpath } from "node:fs/promises";
import { resolve } from "node:path";
import { promisify } from "node:util";

const execFile = promisify(execFileCallback);
const DEFAULT_MAX_BYTES = 50_000;
const MIN_MAX_BYTES = 1_000;
const MAX_MAX_BYTES = 200_000;

function normalizeMaxBytes(maxBytes = DEFAULT_MAX_BYTES) {
  if (!Number.isInteger(maxBytes) || maxBytes < MIN_MAX_BYTES || maxBytes > MAX_MAX_BYTES) {
    throw new Error(`max_bytes must be an integer from ${MIN_MAX_BYTES} to ${MAX_MAX_BYTES}.`);
  }
  return maxBytes;
}

function validateBaseRef(baseRef) {
  if (baseRef === undefined) return undefined;
  if (!baseRef || baseRef.startsWith("-") || /[\s\0]/.test(baseRef)) {
    throw new Error("base_ref must be a non-empty Git revision without whitespace and cannot start with '-'.");
  }
  return baseRef;
}

async function runGit(repositoryPath, args) {
  return execFile("git", ["-C", repositoryPath, ...args], {
    encoding: "utf8",
    maxBuffer: 210_000
  });
}

async function resolveGitRepository(repositoryPath) {
  if (typeof repositoryPath !== "string" || !repositoryPath.trim()) {
    throw new Error("repository_path is required.");
  }

  let resolvedPath;
  try {
    resolvedPath = await realpath(resolve(repositoryPath));
  } catch {
    throw new Error("repository_path does not exist or cannot be accessed.");
  }

  try {
    const { stdout } = await runGit(resolvedPath, ["rev-parse", "--is-inside-work-tree"]);
    if (stdout.trim() !== "true") throw new Error();
  } catch {
    throw new Error("repository_path must point to a Git working tree.");
  }
  return resolvedPath;
}

function truncateUtf8(value, maxBytes) {
  const bytes = Buffer.from(value, "utf8");
  if (bytes.length <= maxBytes) return { value, truncated: false };
  return { value: bytes.subarray(0, maxBytes).toString("utf8"), truncated: true };
}

export async function getGitDiff({ repositoryPath, baseRef, maxBytes } = {}) {
  const repository = await resolveGitRepository(repositoryPath);
  const normalizedBaseRef = validateBaseRef(baseRef);
  const normalizedMaxBytes = normalizeMaxBytes(maxBytes);

  if (normalizedBaseRef) {
    try {
      await runGit(repository, ["rev-parse", "--verify", "--quiet", `${normalizedBaseRef}^{commit}`]);
    } catch {
      throw new Error(`base_ref '${normalizedBaseRef}' does not resolve to a commit in this repository.`);
    }
  }

  const revisionArgs = normalizedBaseRef ? [normalizedBaseRef] : [];
  const { stdout: filesOutput } = await runGit(repository, ["diff", "--no-ext-diff", "--name-only", ...revisionArgs, "--"]);
  const { stdout: diffOutput } = await runGit(repository, ["diff", "--no-ext-diff", "--unified=3", ...revisionArgs, "--"]);
  const { value: diff, truncated } = truncateUtf8(diffOutput, normalizedMaxBytes);

  return {
    repository_path: repository,
    base_ref: normalizedBaseRef ?? null,
    changed_files: filesOutput.split("\n").filter(Boolean),
    diff,
    truncated
  };
}

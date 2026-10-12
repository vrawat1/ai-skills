"""Read-only MCP tool for inspecting a local Git repository."""

from __future__ import annotations

import subprocess
from pathlib import Path
from typing import Any

from mcp.server.fastmcp import FastMCP
from mcp.types import ToolAnnotations

server = FastMCP(
    "repo-status",
    instructions=(
        "Use get_repo_status only when the user explicitly supplies a local repository path "
        "and asks for repository status. The tool is read-only."
    ),
)


def _run_git(repository_path: Path, *args: str) -> str:
    completed = subprocess.run(
        ["git", "-C", str(repository_path), *args],
        check=True,
        capture_output=True,
        text=True,
        timeout=10,
    )
    return completed.stdout


def _resolve_repository(repository_path: str) -> Path:
    if not isinstance(repository_path, str) or not repository_path.strip():
        raise ValueError("repository_path is required.")

    try:
        path = Path(repository_path).expanduser().resolve(strict=True)
    except OSError as error:
        raise ValueError("repository_path does not exist or cannot be accessed.") from error

    try:
        if _run_git(path, "rev-parse", "--is-inside-work-tree").strip() != "true":
            raise ValueError
    except (subprocess.CalledProcessError, ValueError) as error:
        raise ValueError("repository_path must point to a Git working tree.") from error

    return Path(_run_git(path, "rev-parse", "--show-toplevel").strip())


def get_repository_status(repository_path: str) -> dict[str, Any]:
    """Return read-only status information for one explicitly supplied Git repository."""
    repository = _resolve_repository(repository_path)
    branch = _run_git(repository, "symbolic-ref", "--quiet", "--short", "HEAD").strip()
    if not branch:
        branch = "(detached HEAD)"

    status_lines = _run_git(repository, "status", "--porcelain=v1", "--branch").splitlines()
    changed_files = [
        {"index_status": line[0], "worktree_status": line[1], "path": line[3:]}
        for line in status_lines[1:]
        if len(line) >= 4
    ]

    try:
        upstream = _run_git(repository, "rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{upstream}").strip()
        counts = _run_git(repository, "rev-list", "--left-right", "--count", "@{upstream}...HEAD").split()
        behind, ahead = (int(counts[0]), int(counts[1]))
    except (subprocess.CalledProcessError, ValueError, IndexError):
        upstream, ahead, behind = None, None, None

    return {
        "repository_path": str(repository),
        "branch": branch,
        "upstream": upstream,
        "ahead": ahead,
        "behind": behind,
        "changed_files": changed_files,
    }


@server.tool(
    name="get_repo_status",
    annotations=ToolAnnotations(
        readOnlyHint=True,
        destructiveHint=False,
        idempotentHint=True,
        openWorldHint=False,
    ),
)
def get_repo_status(repository_path: str) -> dict[str, Any]:
    """Read branch, upstream, ahead/behind counts, and changed files for a local Git repository."""
    return get_repository_status(repository_path)


if __name__ == "__main__":
    server.run(transport="stdio")

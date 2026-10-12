# Vijay Sample Plugin

This plugin packages the `transaction-review` skill for Codex. It reviews supplied source-control transactions, diffs, and code changes without modifying code or external systems.

## Included skill

`skills/transaction-review/` contains the reusable skill instructions and its test cases.

## Included MCP tool

`get_git_diff` returns tracked working-tree changes for an explicitly supplied local Git repository. It uses only read-only Git commands and caps returned diff content at 50,000 UTF-8 bytes by default.

`get_repo_status` is a Python MCP tool that returns the repository branch, upstream, ahead/behind counts, and changed files. It is read-only and requires an explicit `repository_path`.

Install server dependencies from this plugin directory before enabling the tool:

```sh
npm install
python3 -m venv .venv
./.venv/bin/python -m pip install -r requirements.txt
npm test
```

The plugin registers `.mcp.json` through `.codex-plugin/plugin.json`. When calling the tool, provide `repository_path`; optionally provide `base_ref` to compare that commit with the working tree and `max_bytes` (1,000–200,000) to change the output cap.

## Use

Install the plugin in Codex, then ask:

```text
Use $transaction-review to review this supplied code change.
```

Supply a diff or changed source along with any issue context and test evidence. See `skills/transaction-review/TEST_CASES.md` for repeatable checks.

## License

Add a license before making this plugin broadly available.

# Vijay Sample Plugin

This plugin packages the `transaction-review` skill for Codex. It reviews supplied source-control transactions, diffs, and code changes without modifying code or external systems.

## Included skill

`skills/transaction-review/` contains the reusable skill instructions and its test cases.

## Use

Install the plugin in Codex, then ask:

```text
Use $transaction-review to review this supplied code change.
```

Supply a diff or changed source along with any issue context and test evidence. See `skills/transaction-review/TEST_CASES.md` for repeatable checks.

## License

Add a license before making this plugin broadly available.

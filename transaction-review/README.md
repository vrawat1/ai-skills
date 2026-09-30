# Transaction Review Skill

A portable Codex skill for reviewing a supplied source-control transaction, diff, or code change. It produces a concise, evidence-backed review without changing code, publishing comments, or updating external systems.

## Contents

- `SKILL.md` — the skill instructions.
- `.gitignore` — excludes common local metadata.

## Use locally

Copy `transaction-review` into your Codex skills directory, then invoke it in a chat using:

```text
Use $transaction-review to review <transaction, diff, or code change>.
```

The skill expects a changed-file list, diff, source files, issue context, or test evidence. It reports any unavailable inputs as limitations instead of inferring them.

## Publish

Review the files again before publishing, especially if you customize the instructions with company-specific systems, URLs, or examples.

Choose and add a license before making the repository public; the right choice depends on how you want others to reuse the skill.

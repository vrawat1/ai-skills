---
name: transaction-review
description: Review a supplied source-control transaction, diff, or code change and produce an evidence-backed, read-only review with focused validation. Use for code-review requests, not implementation or publishing changes.
---

# Transaction Review

Review the change artifacts supplied by the user and produce a concise, evidence-backed report. This skill is read-only: do not modify source, publish review comments, change source control, or update external tracking systems.

## Inputs

Use the available transaction file list, diff, source files, issue description, and test evidence. State which inputs were available. If no changed files or diff are supplied, request them before claiming to have reviewed the transaction.

Treat unstated repository conventions, runtime behavior, and test results as unknown. Do not invent commands, file contents, APIs, issue details, or validation results.

## Review

Focus on changed code and directly affected callers, interfaces, configuration, and tests when those artifacts are supplied. Prioritize:

1. Incorrect behavior, null or boundary handling, error propagation, and data integrity.
2. Broken language or framework contracts, including method signatures, bindings, model assumptions, and transaction boundaries.
3. Compatibility risk, including callers or configuration that may no longer agree with the changed code.
4. Missing or inadequate test coverage for the behavior that changed.

Report a finding only when the supplied evidence supports it. Distinguish a defect from a risk that needs validation. Do not add style-only feedback unless it obscures correctness, maintainability, or safe operation.

## Output

Return these sections in order:

1. **Scope reviewed** — inputs received and material limitations.
2. **Findings** — ordered by severity. For each: severity, location, evidence, impact, and a specific recommendation. If there are no findings, say so plainly.
3. **Validation plan** — the smallest set of tests or checks that would validate the changed behavior. Clearly mark checks that could not be run.
4. **Recommendation** — `approve`, `approve with follow-up`, or `needs changes`, with one-sentence rationale.

Use `blocker`, `high`, `medium`, or `low` severity only when a finding is present. A missing input is a limitation, not a finding, unless the request requires a release decision that cannot safely be made without it.

## Boundaries

Ask for explicit approval before any action that changes source control, source code, a test environment, an issue tracker, or another external system. Separate the review result from any requested action and identify exactly what approval is needed.

Vijay Sample Plugin
===================

This Codex plugin contains example skills and local MCP tools for learning.

Included tools
--------------

1. get_git_diff     - Returns a Git diff for a local repository.
2. get_repo_status  - Returns Git status for a supplied local repository path.
3. greet            - Returns a greeting for a name.
4. add              - Adds two numbers.

Prerequisites
-------------

- Node.js 18 or later
- Python 3.10 or later
- Git
- Codex desktop app with the ai-skills marketplace installed

Local setup
-----------

Run these commands from this plugin directory:

  cd plugins/vijay-sample-plugin
  npm install
  python3 -m venv .venv
  ./.venv/bin/python -m pip install -r requirements.txt

Run tests
---------

  npm test

This runs both the Node.js tests and the Python tests.

Use in Codex
------------

Open a new Codex chat and mention the plugin, then ask for a tool by name.

Examples:

  @Vijay Sample Plugin Use the add tool to calculate 3 + 4.

  @Vijay Sample Plugin Use the greet tool to greet Vijay.

  @Vijay Sample Plugin Use get_repo_status for this repository path:
  /Users/vijayrawat/Documents/ChatGPT/AILearning/ai-skills-repo

Refreshing after an update
--------------------------

1. Commit and push the updated plugin to the ai-skills repository.
2. Refresh or upgrade the ai-skills marketplace in Codex.
3. If Python tools do not start after a refresh, create the plugin's .venv and
   install requirements.txt in the installed plugin copy.
4. Start a new Codex chat so it discovers the updated tool list.

The .venv directory is intentionally not committed. It is a local runtime
dependency and may need to be recreated when Codex installs a new plugin version.

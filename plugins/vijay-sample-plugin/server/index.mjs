import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { getGitDiff } from "./git-diff.mjs";

const server = new McpServer({ name: "git-diff-tools", version: "0.1.0" }, {
  instructions: "Use get_git_diff only when the user explicitly supplies the repository path and requests a Git diff. The tool is read-only."
});

server.registerTool("get_git_diff", {
  title: "Get Git diff",
  description: "Read tracked Git changes for an explicitly supplied local repository. This tool never modifies the repository.",
  inputSchema: {
    repository_path: z.string().min(1).describe("Absolute or relative path to the local Git working tree."),
    base_ref: z.string().min(1).optional().describe("Optional commit revision to compare with the working tree."),
    max_bytes: z.number().int().min(1_000).max(200_000).optional().describe("Maximum UTF-8 bytes returned for the diff; defaults to 50000.")
  },
  annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }
}, async ({ repository_path, base_ref, max_bytes }) => {
  try {
    const result = await getGitDiff({ repositoryPath: repository_path, baseRef: base_ref, maxBytes: max_bytes });
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }], structuredContent: result };
  } catch (error) {
    return { isError: true, content: [{ type: "text", text: error instanceof Error ? error.message : "Unable to read the Git diff." }] };
  }
});

await server.connect(new StdioServerTransport());

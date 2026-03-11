#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import * as z from "zod/v4";
import { loadIconCache } from "./utils/cache.js";
import { getIcon, resolveIcon } from "./tools/index.js";
const server = new McpServer({
    name: "mdi-icons-mcp",
    version: "1.0.3"
});
// 查询图标名（供不依赖 SVG 的框架使用，或在调用 mdi_get_icon 前确认 name）
server.registerTool("mdi_resolve_icon", {
    title: "Resolve MDI Icon Name",
    description: `Look up all valid MDI icon names that match a keyword.

Use this tool BEFORE writing any icon code, or whenever you need to find the correct icon name.
All returned names are guaranteed to exist — pick the one that best matches your intent.

Examples:
- keyword "account" → returns all account-* icons
- keyword "head-outline" → returns head-outline and similar
- keyword "arrow-left" → returns all arrow-left-* icons

IMPORTANT: Never guess or invent icon names. Always call this tool first and pick from the returned list.`,
    inputSchema: {
        keyword: z.string().describe("English keyword to search (e.g., 'home', 'account', 'arrow-left'). Returns all icon names that contain this keyword."),
        limit: z.number().default(200).describe("Maximum number of results to return")
    },
    outputSchema: {
        names: z.array(z.string()).describe("All matching kebab-case icon names — guaranteed to exist, pick one to use in your code"),
        total: z.number().describe("Total number of matching icons found")
    }
}, async ({ keyword, limit }) => {
    const result = await resolveIcon(keyword, limit);
    return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        structuredContent: result
    };
});
// 获取图标 SVG（用于需要 SVG 代码的场景）
server.registerTool("mdi_get_icon", {
    title: "Get MDI Icon SVG",
    description: "Get MDI icon SVG code. Use English icon names.",
    inputSchema: {
        name: z.string().describe("Icon name in English"),
        size: z.number().default(24).describe("Icon size in pixels"),
        color: z.string().default("currentColor").describe("Icon color")
    },
    outputSchema: {
        svg: z.string().describe("SVG code"),
        name: z.string().describe("Icon name")
    }
}, async ({ name, size, color }) => {
    const result = await getIcon(name, size, color);
    return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        structuredContent: result
    };
});
// 初始化并启动
async function main() {
    await loadIconCache();
    const transport = new StdioServerTransport();
    await server.connect(transport);
}
main().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map
#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import * as z from "zod/v4";
import { loadIconCache } from "./utils/cache.js";
import { searchIcons, getIcon } from "./tools/index.js";

const server = new McpServer({
  name: "mdi-icons-mcp",
  version: "1.0.2"
});

// 注册搜索工具
server.registerTool(
  "mdi_search",
  {
    title: "Search MDI Icons",
    description: "Search MDI icons by keyword. Use English icon names (e.g., 'home', 'close', 'settings'). The AI will automatically translate user descriptions to English keywords.",
    inputSchema: {
      keyword: z.string().describe("Icon name in English"),
      limit: z.number().default(100).describe("Maximum number of results")
    },
    outputSchema: {
      icons: z.array(z.string()).describe("Matching icon names")
    }
  },
  async ({ keyword, limit }) => {
    const result = await searchIcons(keyword, limit);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      structuredContent: result
    };
  }
);

// 注册获取图标工具
server.registerTool(
  "mdi_get_icon",
  {
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
  },
  async ({ name, size, color }) => {
    const result = await getIcon(name, size, color);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      structuredContent: result
    };
  }
);

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

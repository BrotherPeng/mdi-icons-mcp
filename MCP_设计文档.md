# MDI Icons MCP 服务器

> Material Design Icons 自动下载 MCP 服务器

## 一、项目概述

从 https://pictogrammers.com/library/mdil/ 自动下载 SVG 图标供 AI 使用。

## 二、数据源

| 来源 | 地址 | 用途 |
|-----|------|-----|
| **CDN** | `https://cdn.jsdelivr.net/npm/@mdi/svg@latest/svg/{name}.svg` | 获取单个图标 |
| **jsDelivr Data API** | `https://data.jsdelivr.com/v1/package/npm/@mdi/svg@latest` | 获取图标列表（约 7447 个） |

## 三、MCP 工具设计

```typescript
// 1. Search for icons
{
  name: "mdi_search",
  description: "Search MDI icons by keyword. Use English icon names (e.g., 'home', 'close', 'settings'). The AI will automatically translate user descriptions to English keywords.",
  inputSchema: {
    type: "object",
    properties: {
      keyword: { type: "string", description: "Icon name in English (e.g., 'home', 'close', 'arrow-right')" },
      limit: { type: "number", default: 20 }
    },
    required: ["keyword"]
  }
}

// 2. Get icon SVG
{
  name: "mdi_get_icon",
  description: "Get MDI icon SVG code. Use English icon names. Customize size and color as needed.",
  inputSchema: {
    type: "object",
    properties: {
      name: { type: "string", description: "Icon name in English (e.g., 'home', 'close', 'settings')" },
      size: { type: "number", default: 24, description: "Icon size in pixels" },
      color: { type: "string", default: "currentColor", description: "Icon color (hex or CSS color)" }
    },
    required: ["name"]
  }
}

// 3. List popular icons
{
  name: "mdi_list_popular",
  description: "List popular MDI icons.",
  inputSchema: {
    type: "object",
    properties: {
      limit: { type: "number", default: 50 }
    }
  }
}

// 4. Batch download icons
{
  name: "mdi_batch_download",
  description: "Download multiple icons to local directory. Use English icon names.",
  inputSchema: {
    type: "object",
    properties: {
      icons: { type: "array", items: { type: "string" }, description: "List of icon names in English" },
      outputDir: { type: "string", description: "Output directory path" }
    },
    required: ["icons", "outputDir"]
  }
}
```

## 四、图标列表缓存机制

### 4.1 缓存策略

```typescript
interface IconCache {
  version: string;        // 包版本号，如 "7.4.47"
  updatedAt: string;     // 更新时间 ISO 8601
  icons: Array<{
    name: string;        // 图标名，如 "close"
    url: string;         // CDN URL
  }>;
}

const CACHE_FILE = "icons.json";
const CACHE_MAX_AGE = 2 * 24 * 60 * 60 * 1000; // 2 天（毫秒）
```

### 4.2 加载逻辑

**核心策略：版本号优先，过期兜底**

```typescript
import fs from "fs/promises";
import path from "path";

let iconList: Array<{ name: string; url: string }> = [];

async function loadIconCache(): Promise<void> {
  const cachePath = path.resolve(CACHE_FILE);

  try {
    // 1. 读取本地缓存
    const cached = JSON.parse(await fs.readFile(cachePath, "utf-8")) as IconCache;

    // 2. 获取远程最新版本号
    const versionRes = await fetch("https://data.jsdelivr.com/v1/package/npm/@mdi/svg");
    const versionData = await versionRes.json();
    const latestVersion = versionData.tags.latest;

    // 3. 版本号无变化，使用缓存
    if (cached.version === latestVersion) {
      iconList = cached.icons;
      console.log(`[MDI] Cache up to date (${cached.version}), ${iconList.length} icons`);
      return;
    }

    console.log(`[MDI] Version changed: ${cached.version} → ${latestVersion}, refreshing...`);
  } catch {
    console.log("[MDI] No cache found, fetching from API...");
  }

  await refreshIconCache();
}
```

### 4.3 缓存结构示例

```json
{
  "version": "7.4.47",
  "updatedAt": "2026-02-10T12:00:00.000Z",
  "icons": [
    { "name": "ab-testing", "url": "https://cdn.jsdelivr.net/npm/@mdi/svg@latest/svg/ab-testing.svg" },
    { "name": "close", "url": "https://cdn.jsdelivr.net/npm/@mdi/svg@latest/svg/close.svg" },
    { "name": "home", "url": "https://cdn.jsdelivr.net/npm/@mdi/svg@latest/svg/home.svg" }
  ]
}
```

### 4.4 缓存策略说明

| 场景 | 行为 |
|-----|------|
| 首次运行 | 调用 API → 生成缓存 |
| 版本号未变 | 使用缓存（跳过 API 请求） |
| 版本号已变 | 调用 API → 更新缓存 |
| 缓存文件损坏 | 重新调用 API |

**优点：**
- 减少不必要的网络请求（版本号不变时不刷新）
- 版本号变更时才同步最新图标

## 五、推荐框架

```bash
npm install @modelcontextprotocol/sdk axios
```

**为什么选官方 SDK：**
- 官方维护，零依赖
- 支持 stdio 模式（Cursor 原生支持）
- 文档完善

## 六、核心代码示例

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import fs from "fs/promises";
import path from "path";

const server = new Server({
  name: "mdi-icons-mcp",
  version: "1.0.0"
});

const CACHE_FILE = "icons.json";

interface IconCache {
  version: string;
  updatedAt: string;
  icons: Array<{ name: string; url: string }>;
}

let iconList: Array<{ name: string; url: string }> = [];

// 加载图标缓存（版本号优先）
async function loadIconCache() {
  const cachePath = path.resolve(CACHE_FILE);

  try {
    // 1. 读取本地缓存
    const cached = JSON.parse(await fs.readFile(cachePath, "utf-8")) as IconCache;

    // 2. 获取远程版本号
    const versionRes = await fetch("https://data.jsdelivr.com/v1/package/npm/@mdi/svg");
    const versionData = await versionRes.json();
    const latestVersion = versionData.tags.latest;

    // 3. 版本号无变化，使用缓存
    if (cached.version === latestVersion) {
      iconList = cached.icons;
      console.log(`[MDI] Cache up to date (${cached.version}), ${iconList.length} icons`);
      return;
    }

    console.log(`[MDI] Version changed: ${cached.version} → ${latestVersion}, refreshing...`);
  } catch {
    console.log("[MDI] No cache found, fetching from API...");
  }

  await refreshIconCache();
}

// 刷新图标缓存
async function refreshIconCache() {
  const res = await fetch("https://data.jsdelivr.com/v1/package/npm/@mdi/svg@latest");
  const data = await res.json();

  const svgFiles = data.files.find((f: any) => f.name === "svg")?.files || [];
  iconList = svgFiles.map((f: any) => ({
    name: f.name.replace(".svg", ""),
    url: `https://cdn.jsdelivr.net/npm/@mdi/svg@latest/svg/${f.name}`
  }));

  const cache: IconCache = {
    version: data.tags.latest,
    updatedAt: new Date().toISOString(),
    icons: iconList
  };

  await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2));
  console.log(`[MDI] Cached ${iconList.length} icons (${cache.version})`);
}

// Search icons
server.addTool({
  name: "mdi_search",
  description: "Search MDI icons by keyword. Use English icon names.",
  inputSchema: {
    type: "object",
    properties: {
      keyword: { type: "string", description: "Search keyword in English" },
      limit: { type: "number", default: 20 }
    },
    required: ["keyword"]
  },
  async run({ keyword, limit = 20 }) {
    const lower = keyword.toLowerCase();
    const results = iconList
      .filter(icon => icon.name.toLowerCase().includes(lower))
      .slice(0, limit);
    return { icons: results.map(r => r.name) };
  }
});

// Get icon SVG
server.addTool({
  name: "mdi_get_icon",
  description: "Get MDI icon SVG code.",
  inputSchema: {
    type: "object",
    properties: {
      name: { type: "string", description: "Icon name in English" },
      size: { type: "number", default: 24, description: "Icon size in pixels" },
      color: { type: "string", default: "currentColor", description: "Icon color" }
    },
    required: ["name"]
  },
  async run({ name, size = 24, color = "currentColor" }) {
    const url = `https://cdn.jsdelivr.net/npm/@mdi/svg@latest/svg/${name}.svg`;
    const res = await fetch(url);
    if (!res.ok) {
      return { error: `Icon '${name}' not found` };
    }
    const svg = await res.text();
    const modified = svg
      .replace(/width="\d+"/, `width="${size}"`)
      .replace(/height="\d+"/, `height="${size}"`)
      .replace(/fill="[^"]*"/, `fill="${color}"`);
    return { svg: modified, name };
  }
});

// 初始化并启动
await loadIconCache();

const transport = new StdioServerTransport();
server.connect(transport);
```

## 七、项目结构

```
mdi-icons-mcp/
├── package.json
├── tsconfig.json
├── icons.json              # 图标缓存文件（自动生成）
├── src/
│   ├── index.ts            # 服务器入口
│   ├── cache.ts            # 缓存管理
│   └── tools/
│       ├── search.ts       # 搜索
│       ├── getIcon.ts      # 获取
│       └── list.ts         # 列表
└── .env
```

## 八、启动命令

```bash
# 首次运行会下载图标列表并缓存
npm run dev

# 构建
npm run build

# 在 Cursor 中配置
# .cursor/mcp.json:
{
  "mdi-icons-mcp": {
    "command": "node",
    "args": ["/path/to/dist/index.js"]
  }
}
```

## 九、功能优先级

| 优先级 | 功能 | 说明 |
|-------|------|-----|
| P0 | 搜索图标 | 关键词搜索 |
| P0 | 获取SVG | 返回纯SVG代码 |
| P1 | 图标缓存 | icons.json + 2天过期 |
| P1 | 图标列表 | 分类展示 |
| P2 | 批量下载 | 一次性获取多个 |

## 十、常见图标名称

```
account, home, menu, search, bell, cart, settings,
edit, delete, add, check, close, plus, minus,
arrow-left, arrow-right, arrow-up, arrow-down,
chevron-left, chevron-right, chevron-up, chevron-down,
eye, eye-off, heart, heart-outline, star, star-outline,
download, upload, share, link, content-copy,
calendar, clock, map-marker, phone, email, message,
camera, image, file, folder, cloud, trash, pencil,
lock, unlock, key, shield, alert, information, help,
check-circle, error, warning, success, loading, sync
```

## 十一、参考链接

- [MDI 官网](https://pictogrammers.com/library/mdil/)
- [jsDelivr Data API](https://www.jsdelivr.com/docs/data.jsdelivr.com)
- [MCP SDK](https://github.com/modelcontextprotocol/sdk)
- [CDN 地址](https://cdn.jsdelivr.net/npm/@mdi/svg@latest/svg/)

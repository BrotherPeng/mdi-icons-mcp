# MDI Icons MCP Server

Material Design Icons 自动下载服务器，专为 AI 助手设计。支持查询图标名称、获取 SVG 代码，并可自定义颜色和大小。

[English](README.md) | 简体中文

## 功能特性

- 🔍 **图标名查询** - 通过关键词搜索并获取真实存在的 icon name 列表，AI 自行选择最匹配的
- 📥 **SVG 获取** - 下载图标并自定义颜色和大小
- ⚡ **自动缓存** - 首次加载后快速响应
- 🎨 **参数自定义** - 支持自定义颜色、尺寸

## 可用工具

### mdi_resolve_icon

查询所有匹配关键词的 MDI icon name，AI 从返回列表中选择正确的名称使用。

适用于 `@mdi/js`、`@mdi/react`、Vuetify、Flutter MDI 包等**只需要 icon name 字符串**的框架。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `keyword` | string | 必填 | 搜索关键词（英文），返回所有包含该词的图标名 |
| `limit` | number | 200 | 最大返回数量 |

**返回值：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `names` | string[] | 所有匹配的 kebab-case icon name（均真实存在，从中选一个用于代码） |
| `total` | number | 命中的图标总数 |

### mdi_get_icon

获取 MDI 图标 SVG 代码，适用于需要渲染图标图像的场景。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `name` | string | 必填 | 图标名称（kebab-case，如 `account-circle`） |
| `size` | number | 24 | 图标尺寸（像素） |
| `color` | string | currentColor | 图标颜色（支持所有 CSS 颜色值） |

## AI 工作流

```
1. 调用 mdi_resolve_icon("account") 
   → 返回 ["account", "account-circle", "account-outline", ...]

2. AI 根据语义选择最合适的名称
   → 例如选择 "account-circle"

3a. 只需要名称？直接写代码：
    import { mdiAccountCircle } from '@mdi/js'

3b. 需要 SVG？调用 mdi_get_icon("account-circle", 24, "#fff")
    → 返回完整 SVG 代码
```

> ⚠️ AI 不应猜测或杜撰图标名称，必须从 `mdi_resolve_icon` 的返回列表中选取。

## 在 AI 工具中使用

### Cursor

在 `.cursor/mcp.json` 文件中添加配置：

```json
{
  "mdi-icons-mcp": {
    "command": "node",
    "args": ["/path/to/mdi-icons-mcp/dist/index.js"],
    "type": "stdio"
  }
}
```

路径根据实际项目位置调整。

### Continue (VS Code / JetBrains)

在 `.continue/config.json` 中添加：

```json
{
  "models": [
    {
      "name": "claude-sonnet",
      "provider": "anthropic"
    }
  ],
  "tools": [
    {
      "name": "mdi-icons-mcp",
      "command": "node",
      "args": ["/path/to/mdi-icons-mcp/dist/index.js"],
      "transport": "stdio"
    }
  ]
}
```

### Claude Desktop

在 `~/.config/claude/claude_desktop_config.json` 中配置：

```json
{
  "mcpServers": {
    "mdi-icons-mcp": {
      "command": "node",
      "args": ["/absolute/path/to/mdi-icons-mcp/dist/index.js"]
    }
  }
}
```

### Roo Code (VS Code)

在设置中或 `roo.json` 配置：

```json
{
  "mcpServers": {
    "mdi-icons-mcp": {
      "command": "node",
      "args": ["./mdi-icons-mcp/dist/index.js"]
    }
  }
}
```

### 通过 npx

无需克隆仓库，直接从 npm 使用 mdi-icons-mcp：

```json
{
  "mdi-icons-mcp": {
    "command": "npx",
    "args": [
      "-y",
      "mdi-icons-mcp@latest"
    ],
    "type": "stdio"
  }
}
```

## 使用示例

### 查询图标名（用于框架代码）

```
用户：找一个"人头轮廓"图标，用在 Vuetify 里
AI：调用 mdi_resolve_icon("head")

返回：["head", "head-outline", "head-alert-outline", "head-cog-outline", ...]

AI 选择 "head-outline"，在 Vuetify 中使用：
<v-icon>mdi-head-outline</v-icon>
```

### 获取 SVG 代码

```
用户：下载 account 图标，修改为白色，宽度 80px
AI：调用 mdi_get_icon("account", 80, "white")

返回 SVG：
<svg xmlns="http://www.w3.org/2000/svg" width="80" viewBox="0 0 24 24">
  <path fill="white" d="M12,4A4,4..." />
</svg>
```

## 安装与运行

### 环境要求

- Node.js 18+
- pnpm (推荐) 或 npm/yarn

### 安装

```bash
# 克隆项目
git clone https://github.com/BrotherPeng/mdi-icons-mcp.git
cd mdi-icons-mcp

# 安装依赖
pnpm install

# 构建项目
pnpm build
```

### 开发模式

```bash
pnpm dev
```

## 项目结构

```
mdi-icons-mcp/
├── src/
│   ├── index.ts           # MCP 服务器入口
│   ├── tools/
│   │   ├── resolveIcon.ts # 图标名查询工具
│   │   └── getIcon.ts     # SVG 获取工具
│   └── utils/
│       └── cache.ts       # 图标缓存管理
├── icons.json             # MDI 图标列表缓存
├── package.json
└── README.md
```

## 可用图标

支持 7000+ Material Design Icons，完整列表见 [materialdesignicons.com](https://materialdesignicons.com/)。

## 常见问题

### Q: 图标名称是什么格式？
A: 全部为 `kebab-case` 英文，如 `home`、`account-circle`、`arrow-left`。使用 `mdi_resolve_icon` 查询后从返回列表选取即可，无需记忆。

### Q: 如何在 @mdi/js 中使用？
A: icon name `account-circle` 对应的 JS 导出名为 `mdiAccountCircle`（转为 camelCase 加 `mdi` 前缀）。

### Q: 如何在 Vuetify 中使用？
A: 直接用 `mdi-` 前缀：`<v-icon>mdi-account-circle</v-icon>`。

### Q: 支持哪些颜色？
A: 支持所有 CSS 颜色值：`white`、`#FF5733`、`rgb(255, 87, 51)` 等（仅 `mdi_get_icon` 工具生效）。

### Q: 提示 "Icon not found"？
A: 先用 `mdi_resolve_icon` 查询确认图标名称后再调用 `mdi_get_icon`。

## License

MIT

## 相关链接

- [Material Design Icons](https://materialdesignicons.com/)
- [@mdi/svg NPM](https://www.npmjs.com/package/@mdi/svg)
- [Model Context Protocol](https://modelcontextprotocol.io/)

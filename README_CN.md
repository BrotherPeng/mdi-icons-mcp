# MDI Icons MCP Server

Material Design Icons 自动下载服务器，专为 AI 助手设计。支持搜索图标、获取 SVG 代码，并可自定义颜色和大小。

[English](README.md) | 简体中文

## 功能特性

- 🔍 **图标搜索** - 通过关键词搜索 Material Design Icons
- 📥 **SVG 获取** - 下载图标并自定义颜色和大小
- ⚡ **自动缓存** - 首次加载后快速响应
- 🎨 **参数自定义** - 支持自定义颜色、尺寸

## 可用工具

### mdi_search

搜索 MDI 图标

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `keyword` | string | 必填 | 图标名称（英文） |
| `limit` | number | 100 | 最大返回数量 |

### mdi_get_icon

获取 MDI 图标 SVG

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `name` | string | 必填 | 图标名称（英文） |
| `size` | number | 24 | 图标尺寸（像素） |
| `color` | string | currentColor | 图标颜色 |

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

### OpenAI ChatGPT (macOS/Windows)

macOS (`~/Library/Application Support/Cursor/mcp.json`) 或 Windows (`%APPDATA%\Cursor\mcp.json`)：

```json
{
  "mdi-icons-mcp": {
    "command": "node",
    "args": ["/Users/your-name/path/to/mdi-icons-mcp/dist/index.js"],
    "type": "stdio"
  }
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

## 使用示例

### 搜索图标

```
用户：搜索 home 图标
AI：正在搜索 "home" 图标...
找到以下图标：
- home
- home-account
- home-alert
- home-analytics
...
```

### 下载并自定义

```
用户：下载 account 图标，修改为白色，宽度 80px
AI：正在获取 account 图标...

已修改 account.svg：

<svg xmlns="http://www.w3.org/2000/svg" id="mdi-account" width="80" viewBox="0 0 24 24">
  <path fill="white" d="M12,4A4,4..." />
</svg>

文件已保存到：account.svg
```

## 安装与运行

### 环境要求

- Node.js 18+
- pnpm (推荐) 或 npm/yarn

### 安装

```bash
# 克隆项目
git clone https://your-repo/mdi-icons-mcp.git
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
│   ├── index.ts        # MCP 服务器入口
│   ├── tools/
│   │   ├── search.ts   # 搜索工具实现
│   │   └── getIcon.ts  # 获取图标工具实现
│   └── utils/
│       └── cache.ts    # 图标缓存管理
├── icons.json          # MDI 图标列表
├── package.json
└── README.md
```

## 可用图标

支持 7000+ Material Design Icons，包括：

- 常用图标：home, user, settings, search, close, menu, edit, delete, add, save, download, upload, star, heart, mail, phone, etc.

## 常见问题

### Q: 图标名称是什么语言？
A: 使用英文名称，如 `home`、`account`、`settings`，AI 会自动翻译中文描述。

### Q: 如何获取完整图标列表？
A: 查看 `icons.json` 文件，包含所有可用图标名称。

### Q: 支持哪些颜色？
A: 支持所有 CSS 颜色值：`white`、`#FF5733`、`rgb(255, 87, 51)` 等。

### Q: 提示 "Icon not found"？
A: 请检查图标名称是否正确，可先使用 `mdi_search` 搜索确认。

## License

MIT

## 相关链接

- [Material Design Icons](https://materialdesignicons.com/)
- [@mdi/svg NPM](https://www.npmjs.com/package/@mdi/svg)
- [Model Context Protocol](https://modelcontextprotocol.io/)

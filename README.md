# MDI Icons MCP Server

Material Design Icons auto-download server for AI assistants. Search icons, get SVG code, and customize colors and sizes.

[English](README.md) | [简体中文](README_CN.md)

## Features

- 🔍 **Icon Search** - Search Material Design Icons by keyword
- 📥 **SVG Download** - Download icons with custom color and size
- ⚡ **Auto Cache** - Fast response after initial load
- 🎨 **Customizable** - Support color and size parameters

## Available Tools

### mdi_search

Search MDI icons

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `keyword` | string | required | Icon name in English |
| `limit` | number | 100 | Maximum number of results |

### mdi_get_icon

Get MDI icon SVG

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | string | required | Icon name in English |
| `size` | number | 24 | Icon size in pixels |
| `color` | string | currentColor | Icon color |

## Usage in AI Tools

### Cursor

Add configuration to `.cursor/mcp.json`:

```json
{
  "mdi-icons-mcp": {
    "command": "node",
    "args": ["/path/to/mdi-icons-mcp/dist/index.js"],
    "type": "stdio"
  }
}
```

Adjust the path according to your project location.

### Continue (VS Code / JetBrains)

Add to `.continue/config.json`:

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

macOS (`~/Library/Application Support/Cursor/mcp.json`) or Windows (`%APPDATA%\Cursor\mcp.json`):

```json
{
  "mdi-icons-mcp": {
    "command": "node",
    "args": ["/path/to/mdi-icons-mcp/dist/index.js"],
    "type": "stdio"
  }
}
```

### Claude Desktop

Configure in `~/.config/claude/claude_desktop_config.json`:

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

Configure in settings or `roo.json`:

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

### Via npx

Use mdi-icons-mcp directly from npm without cloning the repository:

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

## Usage Examples

### Search Icons

```
User: Search for home icon
AI: Searching for "home" icons...
Found icons:
- home
- home-account
- home-alert
- home-analytics
...
```

### Download and Customize

```
User: Download account icon, white color, 80px width
AI: Getting account icon...

Modified account.svg:

<svg xmlns="http://www.w3.org/2000/svg" id="mdi-account" width="80" viewBox="0 0 24 24">
  <path fill="white" d="M12,4A4,4..." />
</svg>

File saved to: account.svg
```

## Installation & Running

### Requirements

- Node.js 18+
- pnpm (recommended) or npm/yarn

### Installation

```bash
# Clone the project
git clone https://your-repo/mdi-icons-mcp.git
cd mdi-icons-mcp

# Install dependencies
pnpm install

# Build the project
pnpm build
```

### Development Mode

```bash
pnpm dev
```

## Project Structure

```
mdi-icons-mcp/
├── src/
│   ├── index.ts        # MCP server entry point
│   ├── tools/
│   │   ├── search.ts   # Search tool implementation
│   │   └── getIcon.ts  # Get icon tool implementation
│   └── utils/
│       └── cache.ts    # Icon cache management
├── icons.json          # MDI icon list
├── package.json
└── README.md
```

## Available Icons

7000+ Material Design Icons supported, including:

- Common icons: home, user, settings, search, close, menu, edit, delete, add, save, download, upload, star, heart, mail, phone, etc.

## FAQ

### Q: What language should icon names be?
A: Use English names like `home`, `account`, `settings`. AI will automatically translate descriptions.

### Q: How to get the full icon list?
A: Check `icons.json` file for all available icon names.

### Q: What colors are supported?
A: All CSS color values: `white`, `#FF5733`, `rgb(255, 87, 51)`, etc.

### Q: Getting "Icon not found" error?
A: Check if the icon name is correct. Use `mdi_search` first to verify.

## License

MIT

## Related Links

- [Material Design Icons](https://materialdesignicons.com/)
- [@mdi/svg NPM](https://www.npmjs.com/package/@mdi/svg)
- [Model Context Protocol](https://modelcontextprotocol.io/)

# MDI Icons MCP Server

Material Design Icons auto-download server for AI assistants. Look up icon names, get SVG code, and customize colors and sizes.

[English](README.md) | [简体中文](README_CN.md)

## Features

- 🔍 **Icon Name Lookup** - Search by keyword and get a list of real, guaranteed-to-exist icon names for AI to pick from
- 📥 **SVG Download** - Download icons with custom color and size
- ⚡ **Auto Cache** - Fast response after initial load
- 🎨 **Customizable** - Support color and size parameters

## Available Tools

### mdi_resolve_icon

Look up all valid MDI icon names matching a keyword. AI picks the most appropriate one from the returned list.

Use this tool when you need an icon name string for frameworks like `@mdi/js`, `@mdi/react`, Vuetify, Flutter MDI packages, etc.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `keyword` | string | required | English keyword — returns all icon names containing this term |
| `limit` | number | 200 | Maximum number of results |

**Response:**

| Field | Type | Description |
|-------|------|-------------|
| `names` | string[] | All matching kebab-case icon names (guaranteed to exist — pick one for your code) |
| `total` | number | Total number of matching icons found |

### mdi_get_icon

Get MDI icon SVG code, for use cases that require rendered icon images.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | string | required | Icon name in kebab-case (e.g., `account-circle`) |
| `size` | number | 24 | Icon size in pixels |
| `color` | string | currentColor | Icon color (any CSS color value) |

## AI Workflow

```
1. Call mdi_resolve_icon("account")
   → Returns ["account", "account-circle", "account-outline", ...]

2. AI picks the best match based on intent
   → e.g., "account-circle"

3a. Only need the name? Write code directly:
    import { mdiAccountCircle } from '@mdi/js'

3b. Need SVG? Call mdi_get_icon("account-circle", 24, "#fff")
    → Returns full SVG code
```

> ⚠️ AI should never guess or invent icon names. Always call `mdi_resolve_icon` first and pick from the returned list.

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

### Look Up Icon Name (for framework code)

```
User: Find a "person outline" icon for use in Vuetify
AI: Calls mdi_resolve_icon("account-outline")

Returns: ["account-outline", "account-circle-outline", "account-box-outline", ...]

AI picks "account-outline" and uses it in Vuetify:
<v-icon>mdi-account-outline</v-icon>
```

### Get SVG Code

```
User: Get account icon, white color, 80px
AI: Calls mdi_get_icon("account", 80, "white")

Returns SVG:
<svg xmlns="http://www.w3.org/2000/svg" width="80" viewBox="0 0 24 24">
  <path fill="white" d="M12,4A4,4..." />
</svg>
```

## Installation & Running

### Requirements

- Node.js 18+
- pnpm (recommended) or npm/yarn

### Installation

```bash
# Clone the project
git clone https://github.com/BrotherPeng/mdi-icons-mcp.git
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
│   ├── index.ts           # MCP server entry point
│   ├── tools/
│   │   ├── resolveIcon.ts # Icon name lookup tool
│   │   └── getIcon.ts     # SVG download tool
│   └── utils/
│       └── cache.ts       # Icon cache management
├── icons.json             # MDI icon list cache
├── package.json
└── README.md
```

## Available Icons

7000+ Material Design Icons supported. Full list at [materialdesignicons.com](https://materialdesignicons.com/).

## FAQ

### Q: What format are icon names in?
A: All names are `kebab-case` English, e.g., `home`, `account-circle`, `arrow-left`. Use `mdi_resolve_icon` to find names — no need to memorize them.

### Q: How do I use icon names in @mdi/js?
A: The icon name `account-circle` maps to `mdiAccountCircle` in JS (camelCase with `mdi` prefix).

### Q: How do I use icon names in Vuetify?
A: Use the `mdi-` prefix: `<v-icon>mdi-account-circle</v-icon>`.

### Q: What colors are supported?
A: All CSS color values: `white`, `#FF5733`, `rgb(255, 87, 51)`, etc. (applies to `mdi_get_icon` only).

### Q: Getting "Icon not found" error?
A: Use `mdi_resolve_icon` to look up the correct icon name first, then call `mdi_get_icon`.

## License

MIT

## Related Links

- [Material Design Icons](https://materialdesignicons.com/)
- [@mdi/svg NPM](https://www.npmjs.com/package/@mdi/svg)
- [Model Context Protocol](https://modelcontextprotocol.io/)

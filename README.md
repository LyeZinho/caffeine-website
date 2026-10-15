# caffeine-website

Documentation monorepo for **Caffeine Engine**:

- `packages/docs-site` — SvelteKit site (HTML docs, no Markdown in the engine repo)
- `packages/docs-mcp` — MCP server for agents (`search_docs`, `get_doc`)
- `tex/` — LaTeX sources for PDF books
- `content/html/` — generated HTML from legacy Markdown (run `npm run migrate:md`)

## Development

```bash
npm install
npm run migrate:md   # after updating import/ sources
npm run dev
```

## MCP (Cursor / agents)

```json
{
  "mcpServers": {
    "caffeine-docs": {
      "command": "node",
      "args": ["packages/docs-mcp/src/index.js"],
      "cwd": "/path/to/caffeine-website"
    }
  }
}
```

The engine repository links this project as the `caffeine-website` git submodule.

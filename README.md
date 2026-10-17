# caffeine-website

Documentation monorepo for **Caffeine Engine**:

- `packages/marketing` — Site público (landing, tutoriais, blog) — **abrir em `:3000`**
- `packages/docs-site` — SvelteKit (`/docs`, HTML migrado, PDF/TeX)
- `packages/docs-mcp` — MCP server for agents (`search_docs`, `get_doc`)
- `tex/` — LaTeX sources for PDF books
- `content/html/` — generated HTML from legacy Markdown (run `npm run migrate:md`)

## Development

```bash
npm install
npm run sync:engine  # copy Markdown from parent engine repo into import/
npm run migrate:md   # after updating import/ sources
npm run dev          # marketing :3000 + docs :5173 (proxy /docs)
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

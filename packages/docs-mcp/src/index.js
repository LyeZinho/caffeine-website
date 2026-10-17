#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const indexPath = path.join(root, 'content', 'search-index.json');
const graphPath = path.join(root, 'content', 'link-graph.json');
const htmlDir = path.join(root, 'content', 'html');

const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
const linkGraph = fs.existsSync(graphPath)
  ? JSON.parse(fs.readFileSync(graphPath, 'utf8'))
  : {};

const server = new McpServer({
  name: 'caffeine-docs',
  version: '0.1.0',
});

server.tool(
  'search_docs',
  'Search Caffeine documentation titles and slugs (HTML site, not engine Markdown).',
  {
    query: z.string().describe('Case-insensitive substring'),
    limit: z.number().int().min(1).max(50).optional().describe('Max results (default 20)'),
  },
  async ({ query, limit = 20 }) => {
    const q = query.toLowerCase();
    const hits = index
      .filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.slug.toLowerCase().includes(q) ||
          e.path.toLowerCase().includes(q),
      )
      .slice(0, limit);
    return {
      content: [{ type: 'text', text: JSON.stringify(hits, null, 2) }],
    };
  },
);

server.tool(
  'get_related_docs',
  'Outgoing links, backlinks, and prev/next for a doc slug (cross-references).',
  {
    slug: z.string().describe('Slug from search_docs'),
  },
  async ({ slug }) => {
    const node = linkGraph[slug];
    if (!node) {
      return { content: [{ type: 'text', text: `No graph entry: ${slug}` }], isError: true };
    }
    return { content: [{ type: 'text', text: JSON.stringify(node, null, 2) }] };
  },
);

server.tool(
  'get_doc',
  'Fetch a documentation page as HTML article body by slug (e.g. docs/ecs/core).',
  {
    slug: z.string().describe('Slug from search_docs'),
  },
  async ({ slug }) => {
    const file = path.join(htmlDir, `${slug}.html`);
    if (!fs.existsSync(file)) {
      return { content: [{ type: 'text', text: `Not found: ${slug}` }], isError: true };
    }
    const html = fs.readFileSync(file, 'utf8');
    return { content: [{ type: 'text', text: html }] };
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);

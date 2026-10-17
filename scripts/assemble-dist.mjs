#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const docsBuild = path.join(root, 'packages', 'docs-site', 'build');
const marketingDist = path.join(root, 'packages', 'marketing', 'dist');
const target = path.join(marketingDist, 'docs');

if (!fs.existsSync(docsBuild)) {
  console.error('Missing docs-site build. Run: DOCS_BASE=/docs npm run build -w @caffeine/docs-site');
  process.exit(1);
}
if (!fs.existsSync(marketingDist)) {
  console.error('Missing marketing dist. Run: npm run build -w @caffeine/marketing');
  process.exit(1);
}

fs.rmSync(target, { recursive: true, force: true });
fs.cpSync(docsBuild, target, { recursive: true });
console.log(`Copied ${docsBuild} -> ${target}`);

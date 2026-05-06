#!/usr/bin/env node
/**
 * One-shot tool catalog modularization helper.
 *
 * Reads the legacy `src/config/tools.ts`, groups entries by category,
 * and writes a new `src/config/tools/` directory tree with one file per
 * category plus shared types/categories/index modules.
 *
 * Run once: `npx tsx scripts/maintenance/split-tools-config.ts`
 * After verification, delete `src/config/tools.ts` and this script.
 */
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { tools, categories, type Tool, type ToolCategory } from '../../src/config/tools';

const OUT_DIR = 'src/config/tools';
mkdirSync(OUT_DIR, { recursive: true });

// 1. types.ts
const TYPES_CONTENT = `export type ToolCategory =
  | 'text'
  | 'encoding'
  | 'generators'
  | 'converters'
  | 'development'
  | 'security'
  | 'network'
  | 'image'
  | 'math'
  | 'charts'
  | 'office'
  | 'lifestyle'
  | 'finance'
  | 'fun';

export interface Tool {
  slug: string;
  category: ToolCategory;
  icon: string;
  component: string;
  popular?: boolean;
}
`;
writeFileSync(`${OUT_DIR}/types.ts`, TYPES_CONTENT);

// 2. categories.ts (mirrors original ordering)
const categoriesLines = categories
  .map((c) => `  { id: '${c.id}', icon: '${c.icon}' },`)
  .join('\n');
const CATEGORIES_CONTENT = `import type { ToolCategory } from './types';

export const categories: { id: ToolCategory; icon: string }[] = [
${categoriesLines}
];
`;
writeFileSync(`${OUT_DIR}/categories.ts`, CATEGORIES_CONTENT);

// 3. one file per category preserving original relative order
function toolToLine(t: Tool): string {
  const parts = [
    `slug: '${t.slug}'`,
    `category: '${t.category}'`,
    `icon: '${t.icon}'`,
    `component: '${t.component}'`,
  ];
  if (t.popular) parts.push('popular: true');
  return `  { ${parts.join(', ')} },`;
}

const constName = (cat: ToolCategory) => `${cat.toUpperCase()}_TOOLS`;

for (const cat of categories) {
  const inCat = tools.filter((t) => t.category === cat.id);
  const lines = inCat.map(toolToLine).join('\n');
  const content = `import type { Tool } from './types';

export const ${constName(cat.id)}: Tool[] = [
${lines}
];
`;
  writeFileSync(`${OUT_DIR}/${cat.id}.ts`, content);
}

// 4. index.ts - aggregates and re-exports the public API
const importLines = categories
  .map((c) => `import { ${constName(c.id)} } from './${c.id}';`)
  .join('\n');
const spreadLines = categories
  .map((c) => `  ...${constName(c.id)},`)
  .join('\n');

const INDEX_CONTENT = `${importLines}
import type { Tool, ToolCategory } from './types';

export type { Tool, ToolCategory } from './types';
export { categories } from './categories';

export const tools: Tool[] = [
${spreadLines}
];

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return tools.filter((t) => t.category === category);
}

export function getPopularTools(): Tool[] {
  return tools.filter((t) => t.popular);
}

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}
`;
writeFileSync(`${OUT_DIR}/index.ts`, INDEX_CONTENT);

// 5. summary
const summary = categories.map((c) => {
  const count = tools.filter((t) => t.category === c.id).length;
  return `  ${c.id.padEnd(12)} ${String(count).padStart(3)} tools`;
});
console.log(`Wrote ${OUT_DIR}/`);
console.log(summary.join('\n'));
console.log(`Total: ${tools.length} tools across ${categories.length} categories`);

import { describe, expect, it } from 'vitest';
import fs from 'fs';
import path from 'path';
import { getPriorityTools } from '@/lib/seo-discovery';
import { categories } from '@/config/tools';
import { comparisonSurfaceSlugs } from '@/lib/comparison-surfaces';
import { aiToolTopicSlugs } from '@/lib/ai-tool-topics';

/**
 * The plain-node IndexNow submitter (scripts/submit-indexnow.js) cannot import
 * TypeScript, so it historically carried its own hard-coded URL lists. Those
 * lists drift from the dynamic single source of truth (seo-discovery + config
 * surfaces): priority tools were covered 35/151 and recovered flagships such
 * as jwt-decoder were missing entirely. These contracts pin the script's lists
 * to the dynamic sets so the drift cannot silently grow.
 */

const scriptSource = fs.readFileSync(
  path.resolve(__dirname, '../submit-indexnow.js'),
  'utf8',
);

function parseStringArray(constantName: string): string[] {
  const match = new RegExp(
    `const ${constantName} = \\[([\\s\\S]*?)\\]`,
  ).exec(scriptSource);
  if (!match) {
    throw new Error(`Could not find ${constantName} in submit-indexnow.js`);
  }
  return Array.from(
    match[1].matchAll(/'([^']+)'/g),
    (m) => m[1],
  );
}

const priorityToolSlugs = parseStringArray('PRIORITY_TOOL_SLUGS');
const categorySlugs = parseStringArray('CATEGORY_SLUGS');
const comparisonSlugs = parseStringArray('COMPARISON_SLUGS');
const aiTopicSlugs = parseStringArray('AI_TOPIC_SLUGS');

const dynamicPrioritySlugs = new Set(getPriorityTools().map((tool) => tool.slug));
const dynamicCategoryIds = categories.map((category) => category.id);
const dynamicComparisonSlugs = comparisonSurfaceSlugs;
const dynamicAiTopicSlugs = aiToolTopicSlugs;

describe('IndexNow submitter priority list drift', () => {
  it('keeps every script-provided tool slug resolvable in the dynamic priority set', () => {
    const ghostSlugs = priorityToolSlugs.filter((slug) => !dynamicPrioritySlugs.has(slug));
    expect(ghostSlugs).toEqual([]);
  });

  it('covers the recovered flagship tools in the script tool list', () => {
    // These were restored to index,follow by the 2026-08-20 priority fix and
    // must stay in the high-value IndexNow submit set.
    const requiredFlagships = [
      'jwt-decoder',
      'json-formatter',
      'base64',
      'word-counter',
      'ai-token-calculator',
    ];
    const missing = requiredFlagships.filter((slug) => !priorityToolSlugs.includes(slug));
    expect(missing).toEqual([]);
  });

  it('keeps script category, comparison and AI topic lists in sync with the surfaces', () => {
    expect(categorySlugs).toEqual(dynamicCategoryIds);
    expect(comparisonSlugs).toEqual(dynamicComparisonSlugs);
    expect(aiTopicSlugs).toEqual(dynamicAiTopicSlugs);
  });

  it('keeps dynamic priority coverage materially ahead of the script list', () => {
    // The script list is the manually curated top tier; the dynamic set keeps
    // expanding as GSC recovery slugs land. Guard against the curated list
    // being gutted accidentally.
    expect(priorityToolSlugs.length).toBeGreaterThanOrEqual(35);
    expect(dynamicPrioritySlugs.size).toBeGreaterThan(priorityToolSlugs.length);
  });
});
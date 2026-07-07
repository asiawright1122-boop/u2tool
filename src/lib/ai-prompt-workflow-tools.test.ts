import { describe, expect, it } from 'vitest';
import { buildJsonToPrompt, optimizeAiPrompt } from './ai-prompt-workflow-tools';

describe('AI prompt workflow tools', () => {
  it('optimizes a rough prompt into a structured reusable prompt', () => {
    const result = optimizeAiPrompt({
      audience: 'content marketers',
      constraints: 'avoid ranking guarantees and include examples',
      draft: 'Write an SEO brief for a landing page',
      format: 'Markdown brief with headings',
      goal: 'seo',
      tone: 'direct',
    });

    expect(result.optimizedPrompt).toContain('Role: You are a direct AI assistant');
    expect(result.optimizedPrompt).toContain('search intent');
    expect(result.optimizedPrompt).toContain('content marketers');
    expect(result.gaps).toContain('Target audience is not explicit in the draft prompt.');
    expect(result.checklist).toHaveLength(3);
    expect(result.wordCount).toBeGreaterThan(60);
  });

  it('builds a JSON-grounded prompt with schema summary and pasted data', () => {
    const result = buildJsonToPrompt({
      audience: 'API developers',
      includeSchema: true,
      jsonText: JSON.stringify({
        users: [
          { id: 1, name: 'Ada', plan: 'pro' },
          { id: 2, name: 'Lin', plan: 'free' },
        ],
        meta: { source: 'billing-export' },
      }),
      outputFormat: 'Markdown table plus risks',
      task: 'summarize user plan distribution',
    });

    expect(result.error).toBeNull();
    expect(result.topLevelType).toBe('object');
    expect(result.keyCount).toBeGreaterThan(5);
    expect(result.arrayCount).toBe(1);
    expect(result.schemaSummary).toContain('$.users: array(2)');
    expect(result.prompt).toContain('Do not invent fields');
    expect(result.prompt).toContain('"billing-export"');
  });

  it('returns a readable error for invalid JSON', () => {
    const result = buildJsonToPrompt({
      audience: '',
      includeSchema: true,
      jsonText: '{"broken": true,}',
      outputFormat: '',
      task: '',
    });

    expect(result.error).toBeTruthy();
    expect(result.prompt).toBe('');
    expect(result.topLevelType).toBe('invalid');
  });
});

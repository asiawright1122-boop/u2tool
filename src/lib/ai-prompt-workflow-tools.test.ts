import { describe, expect, it } from 'vitest';
import {
  buildJsonToPrompt,
  calculateRagChunkPlan,
  generateAiPromptTemplate,
  optimizeAiPrompt,
} from './ai-prompt-workflow-tools';

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

  it('estimates RAG chunk counts and context usage from retrieval settings', () => {
    const result = calculateRagChunkPlan({
      chunkSize: 800,
      contextWindow: 16000,
      documentTokens: 12000,
      overlapTokens: 160,
      promptReserveTokens: 3000,
      topK: 5,
    });

    expect(result.effectiveStepTokens).toBe(640);
    expect(result.chunkCount).toBe(19);
    expect(result.embeddedTokenEstimate).toBe(15200);
    expect(result.retrievedContextTokens).toBe(4000);
    expect(result.contextBudgetTokens).toBe(13000);
    expect(result.contextUsagePercent).toBeCloseTo(30.8);
    expect(result.overlapPercent).toBe(20);
    expect(result.warnings).toEqual([]);
  });

  it('warns when RAG retrieval crowds the available context', () => {
    const result = calculateRagChunkPlan({
      chunkSize: 1800,
      contextWindow: 8000,
      documentTokens: 50000,
      overlapTokens: 720,
      promptReserveTokens: 2000,
      topK: 5,
    });

    expect(result.contextUsagePercent).toBe(150);
    expect(result.warnings).toContain('Retrieved chunks consume most of the available context budget.');
    expect(result.warnings).toContain('Overlap is high; embedding storage and duplicate retrieved text may grow quickly.');
    expect(result.recommendation).toContain('Reduce top K');
  });

  it('generates reusable prompt templates with normalized variables', () => {
    const result = generateAiPromptTemplate({
      constraints: 'cite assumptions and avoid unsupported claims',
      includeExample: true,
      outputFormat: 'Markdown table and action bullets',
      task: 'Create a launch brief for {{topic}}',
      tone: 'concise product strategist',
      variablesText: 'Topic, audience, source notes, audience',
    });

    expect(result.variables.map((variable) => variable.name)).toEqual([
      'topic',
      'audience',
      'source_notes',
    ]);
    expect(result.template).toContain('{{source_notes}}');
    expect(result.examplePrompt).toContain('Example variable values');
    expect(result.checklist).toHaveLength(3);
    expect(result.wordCount).toBeGreaterThan(50);
  });
});

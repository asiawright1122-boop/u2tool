import { describe, expect, it } from 'vitest';
import { buildAliases, collectSpecs, renderAliases } from './generate-ai-discovery-aliases';

describe('generate-ai-discovery-aliases', () => {
  it('collects specs from a batch manifest', () => {
    const specs = collectSpecs({
      tools: [
        {
          slug: 'example-tool',
        },
      ],
    });

    expect(specs).toHaveLength(1);
    expect(specs[0].slug).toBe('example-tool');
  });

  it('builds normalized aliases from aliases and search intent', () => {
    const aliases = buildAliases([
      {
        slug: 'example-tool',
        search_intent: '  convert   example data  ',
        aliases: ['example converter', '', 'example converter'],
      },
      {
        slug: 'Invalid Slug',
        aliases: ['ignored'],
      },
    ]);

    expect(aliases).toEqual({
      'example-tool': ['convert example data', 'example converter'],
    });
  });

  it('renders the generated TypeScript registry', () => {
    const content = renderAliases({
      'example-tool': ['convert example data'],
    });

    expect(content).toContain('AUTO-GENERATED');
    expect(content).toContain('GENERATED_DISCOVERY_ALIASES');
    expect(content).toContain('"example-tool"');
    expect(content).toContain('"convert example data"');
  });
});

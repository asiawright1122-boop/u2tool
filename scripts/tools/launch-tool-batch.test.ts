import { describe, expect, it } from 'vitest';
import { buildToolUrls, normalizeLaunchInput, renderReport } from './launch-tool-batch';

describe('launch-tool-batch', () => {
  it('accepts a manifest with a tools array', () => {
    const specs = normalizeLaunchInput({
      tools: [
        {
          slug: 'example-calculator',
          category: 'finance',
          icon: 'calculator',
          locales: {
            en: {
              name: 'Example Calculator',
              description: 'Calculate an example result.',
            },
          },
        },
      ],
    });

    expect(specs).toHaveLength(1);
    expect(specs[0].slug).toBe('example-calculator');
  });

  it('preserves AI discovery aliases from launch input', () => {
    const specs = normalizeLaunchInput({
      slug: 'example-calculator',
      category: 'finance',
      icon: 'calculator',
      search_intent: 'calculate an example result',
      aliases: ['example result calculator'],
      locales: {
        en: {
          name: 'Example Calculator',
          description: 'Calculate an example result.',
        },
      },
    });

    expect(specs[0].search_intent).toBe('calculate an example result');
    expect(specs[0].aliases).toEqual(['example result calculator']);
  });

  it('builds one URL per locale for every launched tool', () => {
    const urls = buildToolUrls(['example-calculator'], 'https://www.u2tool.com/');

    expect(urls).toHaveLength(10);
    expect(urls[0]).toBe('https://www.u2tool.com/en/tools/example-calculator/');
    expect(urls).toContain('https://www.u2tool.com/ar/tools/example-calculator/');
  });

  it('renders the IndexNow command with the generated URL file', () => {
    const report = renderReport({
      inputPath: '/repo/docs/examples/tool-launch-batch.example.json',
      runDir: '/repo/.tmp/tool-launches/example',
      localizedDir: '/repo/.tmp/tool-launches/example/localized',
      indexNowPath: '/repo/.tmp/tool-launches/example/indexnow-urls.txt',
      slugs: ['example-calculator'],
      urls: ['https://www.u2tool.com/en/tools/example-calculator/'],
      qaMode: 'light',
      dryRun: false,
      skipImportMap: false,
    });

    expect(report).toContain('npm run submit:indexnow -- --urls-file');
    expect(report).toContain('example-calculator');
  });
});

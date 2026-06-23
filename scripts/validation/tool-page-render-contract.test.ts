import { describe, expect, it } from 'vitest';

import {
  buildToolPageRenderReport,
  compareToolPageRenderContract,
  computeToolPageRenderExitCode,
  extractToolPageRenderContract,
  hasOnlyFetchFailures,
  parseToolPageRenderArgs,
  TOOL_PAGE_RENDER_MATRIX,
} from './tool-page-render-contract';

const sampleHtml = String.raw`<!doctype html>
<html lang="en">
  <head>
    <title>YouTube Tags Generator | U2Tool</title>
    <meta name="description" content="Generate YouTube tags quickly.">
    <link rel="canonical" href="https://www.u2tool.com/en/tools/youtube-tags-generator/">
    <script type="application/ld+json">{"@type":"Organization","name":"U2Tool"}</script>
    <script type="application/ld+json">{"@type":["SoftwareApplication","FAQPage"],"name":"YouTube Tags Generator"}</script>
  </head>
  <body>
    <h1 class="text-4xl">YouTube Tags Generator</h1>
    <section data-tool-cluster="creator-seo" data-tool-cluster-group="youtube">
      <a href="/en/tools/youtube-title-generator/" data-sibling-tool="youtube-title-generator">YouTube Title</a>
      <a href="/en/tools/youtube-thumbnail-generator/" data-sibling-tool="youtube-thumbnail-generator">YouTube Thumbnail</a>
    </section>
    <details><summary><h3>How do I use this?</h3></summary><div>Paste a topic.</div></details>
    <details><summary><h3>Does it call YouTube?</h3></summary><div>No.</div></details>
  </body>
</html>`;

describe('TOOL_PAGE_RENDER_MATRIX', () => {
  it('covers every cluster plus FAQ, CJK, and RTL sentinel routes', () => {
    expect(TOOL_PAGE_RENDER_MATRIX.map((entry) => `${entry.locale}/${entry.slug}`)).toEqual([
      'en/bar-chart-generator',
      'en/youtube-tags-generator',
      'en/json-formatter',
      'en/image-compressor',
      'en/currency-converter',
      'en/pdf-to-image',
      'en/password-generator',
      'en/word-counter',
      'en/markdown-editor',
      'ja/json-formatter',
      'ar/password-generator',
    ]);
  });
});

describe('extractToolPageRenderContract', () => {
  it('extracts stable head, structured-data, cluster, sibling, and FAQ fields', () => {
    const contract = extractToolPageRenderContract(sampleHtml, 200, ['Does it call YouTube?']);

    expect(contract).toEqual({
      status: 200,
      title: 'YouTube Tags Generator | U2Tool',
      description: 'Generate YouTube tags quickly.',
      canonical: 'https://www.u2tool.com/en/tools/youtube-tags-generator/',
      h1: 'YouTube Tags Generator',
      jsonLdTypes: ['FAQPage', 'Organization', 'SoftwareApplication'],
      toolClusters: ['creator-seo'],
      toolClusterGroups: ['youtube'],
      siblingToolHrefs: [
        '/en/tools/youtube-thumbnail-generator/',
        '/en/tools/youtube-title-generator/',
      ],
      faqQuestionCount: 2,
      bodyTextSentinels: ['Does it call YouTube?'],
    });
  });
});

describe('compareToolPageRenderContract', () => {
  it('passes when the rendered contract satisfies the route expectation', () => {
    const expectation = {
      locale: 'en',
      slug: 'youtube-tags-generator',
      expectedTitleIncludes: 'YouTube Tags Generator',
      expectedDescriptionIncludes: 'YouTube tags',
      expectedH1Includes: 'YouTube Tags Generator',
      expectedCanonicalPath: '/en/tools/youtube-tags-generator/',
      expectedJsonLdTypes: ['Organization', 'SoftwareApplication', 'FAQPage'],
      expectedToolCluster: 'creator-seo',
      minClusterGroups: 1,
      minSiblingToolLinks: 2,
      minFaqQuestions: 2,
      bodyMustInclude: ['Does it call YouTube?'],
    };

    const failures = compareToolPageRenderContract(
      expectation,
      extractToolPageRenderContract(sampleHtml, 200, expectation.bodyMustInclude),
      sampleHtml
    );

    expect(failures).toEqual([]);
  });

  it('fails when the canonical URL drifts away from the expected route path', () => {
    const expectation = {
      locale: 'en',
      slug: 'youtube-tags-generator',
      expectedTitleIncludes: 'YouTube Tags Generator',
      expectedDescriptionIncludes: 'YouTube tags',
      expectedH1Includes: 'YouTube Tags Generator',
      expectedCanonicalPath: '/en/tools/youtube-tags-generator/',
      expectedJsonLdTypes: ['Organization', 'SoftwareApplication'],
    };
    const htmlWithWrongCanonical = sampleHtml.replace(
      'https://www.u2tool.com/en/tools/youtube-tags-generator/',
      'https://www.u2tool.com/en/tools/wrong-tool/'
    );

    const failures = compareToolPageRenderContract(
      expectation,
      extractToolPageRenderContract(htmlWithWrongCanonical, 200),
      htmlWithWrongCanonical
    );

    expect(failures).toContain(
      'en/youtube-tags-generator canonical: expected to end with "/en/tools/youtube-tags-generator/" but found "https://www.u2tool.com/en/tools/wrong-tool/"'
    );
  });

  it('fails with a cluster-card regression message when cluster markup disappears', () => {
    const htmlWithoutCluster = sampleHtml.replace(/<section data-tool-cluster[\s\S]*?<\/section>/, '');
    const expectation = {
      locale: 'en',
      slug: 'youtube-tags-generator',
      expectedTitleIncludes: 'YouTube Tags Generator',
      expectedDescriptionIncludes: 'YouTube tags',
      expectedH1Includes: 'YouTube Tags Generator',
      expectedJsonLdTypes: ['Organization', 'SoftwareApplication'],
      expectedToolCluster: 'creator-seo',
      minClusterGroups: 1,
      minSiblingToolLinks: 1,
    };

    const failures = compareToolPageRenderContract(
      expectation,
      extractToolPageRenderContract(htmlWithoutCluster, 200),
      htmlWithoutCluster
    );

    expect(failures).toContain(
      'en/youtube-tags-generator cluster-card render regression: expected data-tool-cluster="creator-seo" but found []'
    );
    expect(failures).toContain(
      'en/youtube-tags-generator cluster-card render regression: expected at least 1 data-tool-cluster-group entries but found 0'
    );
    expect(failures).toContain(
      'en/youtube-tags-generator cluster-card render regression: expected at least 1 sibling tool links but found 0'
    );
  });
});

describe('parseToolPageRenderArgs', () => {
  it('uses local SSR as the default target and supports filter/json options', () => {
    const originalFetchBaseUrl = process.env.FETCH_BASE_URL;
    const originalProdBaseUrl = process.env.PROD_BASE_URL;
    delete process.env.FETCH_BASE_URL;
    delete process.env.PROD_BASE_URL;

    try {
      expect(parseToolPageRenderArgs([])).toEqual({
        baseUrl: 'http://localhost:4321',
        filter: '',
        jsonOut: '',
        timeoutMs: 15000,
        updateBaseline: false,
      });

      expect(parseToolPageRenderArgs([
        '--base-url',
        'http://127.0.0.1:8787/',
        '--filter',
        'json',
        '--json-out',
        '.planning/research/reports/render.json',
        '--timeout-ms',
        '2500',
      ])).toEqual({
        baseUrl: 'http://127.0.0.1:8787',
        filter: 'json',
        jsonOut: '.planning/research/reports/render.json',
        timeoutMs: 2500,
        updateBaseline: false,
      });
    } finally {
      restoreEnv('FETCH_BASE_URL', originalFetchBaseUrl);
      restoreEnv('PROD_BASE_URL', originalProdBaseUrl);
    }
  });

  it('rejects update-baseline until committed baselines exist', () => {
    expect(() => parseToolPageRenderArgs(['--update-baseline'])).toThrow(
      '--update-baseline is reserved for a future committed-baseline workflow'
    );
  });
});

function restoreEnv(key: string, value: string | undefined): void {
  if (value === undefined) {
    delete process.env[key];
  } else {
    process.env[key] = value;
  }
}

describe('buildToolPageRenderReport', () => {
  it('summarizes pass/fail counts and drives a non-zero exit code on drift', () => {
    const report = buildToolPageRenderReport({
      baseUrl: 'http://localhost:4321',
      results: [
        {
          locale: 'en',
          slug: 'ok-tool',
          path: '/en/tools/ok-tool/',
          status: 200,
          failures: [],
        },
        {
          locale: 'en',
          slug: 'broken-tool',
          path: '/en/tools/broken-tool/',
          status: 200,
          failures: ['en/broken-tool cluster-card render regression: expected data-tool-cluster="security" but found []'],
        },
      ],
    });

    expect(report.summary).toEqual({
      total: 2,
      passed: 1,
      failed: 1,
    });
    expect(computeToolPageRenderExitCode(report)).toBe(1);
  });

  it('distinguishes unreachable SSR server failures from render contract drift', () => {
    const report = buildToolPageRenderReport({
      baseUrl: 'http://localhost:4321',
      results: [
        {
          locale: 'en',
          slug: 'youtube-tags-generator',
          path: '/en/tools/youtube-tags-generator/',
          status: 0,
          failures: ['en/youtube-tags-generator fetch: fetch failed'],
          error: 'fetch failed',
        },
      ],
    });

    expect(hasOnlyFetchFailures(report)).toBe(true);
    expect(computeToolPageRenderExitCode(report)).toBe(1);
  });
});

describe('validateToolPageRenderContract', () => {
  it('fetches one route and returns a passing result for matching rendered HTML', async () => {
    const { vi } = await import('vitest');
    vi.resetModules();
    vi.doMock('../../src/lib/seo-probe', () => ({
      fetchHtmlWithRetry: vi.fn(async () => ({
        html: sampleHtml,
        response: { status: 200 },
      })),
      getTagContent: (html: string, selector: 'title' | 'description' | 'canonical') => {
        if (selector === 'title') {
          return html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() || '';
        }
        if (selector === 'description') {
          return html.match(/<meta name="description" content="([^"]*)"/i)?.[1]?.trim() || '';
        }
        return html.match(/<link rel="canonical" href="([^"]*)"/i)?.[1]?.trim() || '';
      },
      extractJsonLdBlocks: () => [
        { '@type': 'Organization' },
        { '@type': ['SoftwareApplication', 'FAQPage'] },
      ],
    }));

    const { validateToolPageRenderContract } = await import('./validate-tool-page-render-contract');
    const result = await validateToolPageRenderContract({
      locale: 'en',
      slug: 'youtube-tags-generator',
      expectedTitleIncludes: 'YouTube Tags Generator',
      expectedDescriptionIncludes: 'YouTube tags',
      expectedH1Includes: 'YouTube Tags Generator',
      expectedJsonLdTypes: ['Organization', 'SoftwareApplication', 'FAQPage'],
      expectedToolCluster: 'creator-seo',
      minClusterGroups: 1,
      minSiblingToolLinks: 2,
      minFaqQuestions: 2,
    }, 'http://localhost:4321');

    expect(result.failures).toEqual([]);
    expect(result.path).toBe('/en/tools/youtube-tags-generator/');

    vi.doUnmock('../../src/lib/seo-probe');
    vi.resetModules();
  });

  it('returns a route-level fetch failure when the SSR request exceeds the timeout', async () => {
    const { vi } = await import('vitest');
    vi.useFakeTimers();
    vi.resetModules();
    vi.doMock('../../src/lib/seo-probe', () => ({
      fetchHtmlWithRetry: vi.fn((_url: string, init?: RequestInit) => new Promise((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => {
          reject(init.signal?.reason);
        });
      })),
      getTagContent: () => '',
      extractJsonLdBlocks: () => [],
    }));

    const { validateToolPageRenderContract } = await import('./validate-tool-page-render-contract');
    const resultPromise = validateToolPageRenderContract({
      locale: 'en',
      slug: 'youtube-tags-generator',
      expectedTitleIncludes: 'YouTube Tags Generator',
      expectedDescriptionIncludes: 'YouTube tags',
      expectedH1Includes: 'YouTube Tags Generator',
      expectedJsonLdTypes: ['Organization'],
    }, 'http://localhost:4321', 5);

    await vi.advanceTimersByTimeAsync(5);
    const result = await resultPromise;

    expect(result.failures).toEqual([
      'en/youtube-tags-generator fetch: timed out after 5ms',
    ]);

    vi.useRealTimers();
    vi.doUnmock('../../src/lib/seo-probe');
    vi.resetModules();
  });
});

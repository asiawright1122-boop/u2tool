import { describe, expect, it } from 'vitest';

import { getPilotToolCapabilityProfiles } from '../../src/config/tool-capabilities';
import { locales } from '../../src/lib/i18n';
import { organicSearchProfiles } from '../../src/lib/organic-search-portfolio';
import { buildToolWrapperTranslations } from '../../src/lib/tool-page-translations';
import {
  loadBaseUiMessages,
  loadToolPageMessages,
  mergeMessageRecords,
  readMessageFile,
} from '../../src/lib/translations';
import {
  buildToolPageRenderReport,
  compareToolPageRenderContract,
  computeToolPageRenderExitCode,
  extractToolPageRenderContract,
  hasOnlyFetchFailures,
  parseToolPageRenderArgs,
  TOOL_PAGE_RENDER_MATRIX,
} from './tool-page-render-contract';

const SHARED_CAPABILITY_LABEL_KEYS = [
  'tools.capabilityDisclosure.title',
  'tools.capabilityDisclosure.runsLocally',
  'tools.capabilityDisclosure.optionalServer',
  'tools.capabilityDisclosure.acceptedInputs',
  'tools.capabilityDisclosure.producedOutputs',
  'tools.capabilityDisclosure.supportedLanguage',
  'tools.capabilityDisclosure.limits',
  'tools.capabilityDisclosure.privacyLocal',
  'tools.capabilityDisclosure.privacyServer',
  'tools.capabilityDisclosure.languageNeutral',
  ...locales.map((locale) => `tools.capabilityDisclosure.languages.${locale}`),
] as const;

const sampleHtml = String.raw`<!doctype html>
<html lang="en">
  <head>
    <title>YouTube Tags Generator | U2Tool</title>
    <meta name="description" content="Generate YouTube tags quickly.">
    <meta name="robots" content="index, follow, max-snippet:-1">
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

const enforcedCapabilityHtml = sampleHtml.replace(
  '<h1 class="text-4xl">YouTube Tags Generator</h1>',
  `<h1 class="text-4xl">YouTube Tags Generator</h1>
    <section
      data-tool-capability="release-ready-tool"
      data-capability-version="2.3.0"
      data-local-processing="true"
    >Localized capability disclosure</section>`,
);

const grammarNoticeHtml = enforcedCapabilityHtml.replace(
  '<h1 class="text-4xl">YouTube Tags Generator</h1>',
  `<h1 class="text-4xl">YouTube Tags Generator</h1>
    <p
      id="grammar-checker-language-notice"
      role="note"
      data-grammar-language-notice
      data-input-language="en"
    >This local checker is designed for English text.</p>`,
);

function resolveMessage(
  messages: Record<string, unknown>,
  labelKey: string,
): unknown {
  return labelKey
    .split('.')
    .reduce<unknown>((value, segment) => {
      if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return undefined;
      }
      return (value as Record<string, unknown>)[segment];
    }, messages);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

describe('localized capability catalogs', () => {
  it('resolves every visible profile and shared disclosure label from each locale catalog', async () => {
    const failures: string[] = [];

    for (const locale of locales) {
      const localizedBase = await readMessageFile(`${locale}/base.json`);
      if (!localizedBase) {
        failures.push(`${locale}: missing base catalog`);
        continue;
      }

      for (const profile of getPilotToolCapabilityProfiles()) {
        const localizedSplit = await readMessageFile(
          `${locale}/tools/${profile.slug}.json`,
        );
        if (!localizedSplit) {
          failures.push(`${locale}/${profile.slug}: missing split catalog`);
          continue;
        }

        const runtimeBase = await loadBaseUiMessages(locale);
        const runtimeTool = await loadToolPageMessages(locale, profile.slug);
        const runtimeTools = runtimeBase.tools as Record<string, unknown>;
        const runtimeMessages = buildToolWrapperTranslations({
          currentSlug: profile.slug,
          currentToolMessages: runtimeTool,
          toolSlugs: getPilotToolCapabilityProfiles().map(({ slug }) => slug),
          toolsCommon: runtimeTools,
        });

        const localizedTools = localizedBase.tools as Record<string, unknown>;
        const localizedToolBase =
          (localizedTools[profile.slug] as Record<string, unknown>) ?? {};
        const localizedMessages = buildToolWrapperTranslations({
          currentSlug: profile.slug,
          currentToolMessages: mergeMessageRecords(
            localizedToolBase,
            localizedSplit,
          ),
          toolSlugs: getPilotToolCapabilityProfiles().map(({ slug }) => slug),
          toolsCommon: localizedTools,
        });

        const profileLabelKeys = [
          ...profile.modes,
          ...profile.acceptedInputs,
          ...profile.producedOutputs,
          ...profile.browserOnlyFeatures,
          ...profile.optionalServerFeatures,
          ...profile.limits,
        ].map(({ labelKey }) => labelKey);

        for (const labelKey of new Set([
          ...SHARED_CAPABILITY_LABEL_KEYS,
          ...profileLabelKeys,
        ])) {
          const runtimeValue = resolveMessage(runtimeMessages, labelKey);
          const localizedValue = resolveMessage(localizedMessages, labelKey);
          if (!isNonEmptyString(localizedValue)) {
            failures.push(`${locale}/${profile.slug}: ${labelKey}`);
            continue;
          }
          if (runtimeValue !== localizedValue) {
            failures.push(
              `${locale}/${profile.slug}: ${labelKey} resolved through fallback`,
            );
          }
        }
      }
    }

    expect(failures).toEqual([]);
  });
});

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
      'ko/html-preview',
      'ru/ip-validator',
      'ru/ip-lookup',
      'en/grammar-checker',
      'en/hex-editor',
      'en/sql-query-optimizer',
      'en/excel-viewer',
      'en/typing-speed-test',
      'en/gantt-chart-generator',
      'en/iban-validator',
      'en/ical-parser',
      'ru/grammar-checker',
      'ja/json-formatter',
      'ar/password-generator',
    ]);
  });

  it('covers every active-recovery P0 route from the organic search portfolio', () => {
    const coveredRoutes = new Set(
      TOOL_PAGE_RENDER_MATRIX.map((entry) => `${entry.locale}/${entry.slug}`)
    );
    const p0Routes = organicSearchProfiles
      .filter((profile) => profile.tier === 'P0' && profile.status === 'active-recovery')
      .map((profile) => `${profile.locale}/${profile.slug}`);

    expect(p0Routes.length).toBeGreaterThan(0);

    const uncovered = p0Routes.filter((route) => !coveredRoutes.has(route));
    expect(
      uncovered,
      `active-recovery P0 routes must have render-contract coverage: ${uncovered.join(', ')}`
    ).toEqual([]);
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
      robots: 'index, follow, max-snippet:-1',
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
      capabilitySlug: undefined,
      capabilityVersion: undefined,
      localProcessing: undefined,
      capabilityDisclosureCount: 0,
      grammarLanguageNoticeCount: 0,
      grammarLanguageNoticeTagName: undefined,
      grammarLanguageNoticeRole: undefined,
      grammarLanguageNoticeInputLanguage: undefined,
      grammarLanguageNoticeText: undefined,
    });
  });

  it('extracts capability identity, version, and local-processing attributes', () => {
    const contract = extractToolPageRenderContract(enforcedCapabilityHtml);

    expect(contract).toMatchObject({
      capabilitySlug: 'release-ready-tool',
      capabilityVersion: '2.3.0',
      localProcessing: true,
      capabilityDisclosureCount: 1,
    });
  });

  it('extracts one semantic Grammar language notice with exact text and input language', () => {
    const contract = extractToolPageRenderContract(grammarNoticeHtml);

    expect(contract).toMatchObject({
      grammarLanguageNoticeCount: 1,
      grammarLanguageNoticeTagName: 'p',
      grammarLanguageNoticeRole: 'note',
      grammarLanguageNoticeInputLanguage: 'en',
      grammarLanguageNoticeText: 'This local checker is designed for English text.',
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

  it('compares the capability attributes for an enforced profile fixture', () => {
    const expectation = {
      locale: 'en',
      slug: 'release-ready-tool',
      expectedTitleIncludes: 'YouTube Tags Generator',
      expectedDescriptionIncludes: 'YouTube tags',
      expectedH1Includes: 'YouTube Tags Generator',
      expectedJsonLdTypes: ['Organization', 'SoftwareApplication'],
      expectedCapabilitySlug: 'release-ready-tool',
      expectedCapabilityVersion: '2.3.0',
      expectedLocalProcessing: true,
    };

    const failures = compareToolPageRenderContract(
      expectation,
      extractToolPageRenderContract(enforcedCapabilityHtml),
      enforcedCapabilityHtml,
    );

    expect(failures).toEqual([]);
  });

  it('rejects Grammar notice copy that appears only inside client JavaScript', () => {
    const expectation = {
      locale: 'en',
      slug: 'release-ready-tool',
      expectedTitleIncludes: 'YouTube Tags Generator',
      expectedDescriptionIncludes: 'YouTube tags',
      expectedH1Includes: 'YouTube Tags Generator',
      expectedJsonLdTypes: ['Organization', 'SoftwareApplication'],
      expectedCapabilitySlug: 'release-ready-tool',
      expectedCapabilityVersion: '2.3.0',
      expectedLocalProcessing: true,
      expectedGrammarLanguageNotice: {
        inputLanguage: 'en',
        text: 'This local checker is designed for English text.',
      },
    };
    const scriptOnlyHtml = enforcedCapabilityHtml.replace(
      '</body>',
      `<script>window.__grammarNotice = '<p data-grammar-language-notice data-input-language="en">This local checker is designed for English text.</p>';</script></body>`,
    );

    expect(
      compareToolPageRenderContract(
        expectation,
        extractToolPageRenderContract(scriptOnlyHtml),
        scriptOnlyHtml,
      ),
    ).toContain(
      'en/release-ready-tool grammar language notice: expected 1 semantic element but found 0',
    );
  });

  it('requires exactly one Grammar notice with the expected attribute and localized text', () => {
    const expectation = {
      locale: 'en',
      slug: 'release-ready-tool',
      expectedTitleIncludes: 'YouTube Tags Generator',
      expectedDescriptionIncludes: 'YouTube tags',
      expectedH1Includes: 'YouTube Tags Generator',
      expectedJsonLdTypes: ['Organization', 'SoftwareApplication'],
      expectedCapabilitySlug: 'release-ready-tool',
      expectedCapabilityVersion: '2.3.0',
      expectedLocalProcessing: true,
      expectedGrammarLanguageNotice: {
        inputLanguage: 'en',
        text: 'This local checker is designed for English text.',
      },
    };

    expect(
      compareToolPageRenderContract(
        expectation,
        extractToolPageRenderContract(grammarNoticeHtml),
        grammarNoticeHtml,
      ),
    ).toEqual([]);

    const duplicateWrongNoticeHtml = grammarNoticeHtml.replace(
      '</body>',
      `<p data-grammar-language-notice data-input-language="ru">Неверный текст</p></body>`,
    );
    const failures = compareToolPageRenderContract(
      expectation,
      extractToolPageRenderContract(duplicateWrongNoticeHtml),
      duplicateWrongNoticeHtml,
    );

    expect(failures).toContain(
      'en/release-ready-tool grammar language notice: expected 1 semantic element but found 2',
    );

    const wrongNoticeHtml = grammarNoticeHtml
      .replace('data-input-language="en"', 'data-input-language="ru"')
      .replace(
        'This local checker is designed for English text.',
        'Неверный текст',
      );
    const wrongFailures = compareToolPageRenderContract(
      expectation,
      extractToolPageRenderContract(wrongNoticeHtml),
      wrongNoticeHtml,
    );
    expect(wrongFailures).toContain(
      'en/release-ready-tool grammar language notice: expected data-input-language="en" but found "ru"',
    );
    expect(wrongFailures).toContain(
      'en/release-ready-tool grammar language notice: expected localized text "This local checker is designed for English text." but found "Неверный текст"',
    );
  });

  it('requires the Grammar notice marker to be on a p element with role="note"', () => {
    const expectation = {
      locale: 'en',
      slug: 'release-ready-tool',
      expectedTitleIncludes: 'YouTube Tags Generator',
      expectedDescriptionIncludes: 'YouTube tags',
      expectedH1Includes: 'YouTube Tags Generator',
      expectedJsonLdTypes: ['Organization', 'SoftwareApplication'],
      expectedCapabilitySlug: 'release-ready-tool',
      expectedCapabilityVersion: '2.3.0',
      expectedLocalProcessing: true,
      expectedGrammarLanguageNotice: {
        inputLanguage: 'en',
        text: 'This local checker is designed for English text.',
      },
    };
    const replacements = [
      {
        html: grammarNoticeHtml.replace('<p\n', '<div\n').replace('</p>', '</div>'),
        failure:
          'en/release-ready-tool grammar language notice: expected tag <p> but found <div>',
      },
      {
        html: grammarNoticeHtml.replace('      role="note"\n', ''),
        failure:
          'en/release-ready-tool grammar language notice: expected role="note" but found undefined',
      },
      {
        html: grammarNoticeHtml.replace('role="note"', 'role="alert"'),
        failure:
          'en/release-ready-tool grammar language notice: expected role="note" but found "alert"',
      },
      {
        html: grammarNoticeHtml.replace(
          /<p([\s\S]*?data-grammar-language-notice[\s\S]*?)<\/p>/,
          '<script$1</script>',
        ),
        failure:
          'en/release-ready-tool grammar language notice: expected tag <p> but found <script>',
      },
    ];

    for (const { html, failure } of replacements) {
      expect(
        compareToolPageRenderContract(
          expectation,
          extractToolPageRenderContract(html),
          html,
        ),
      ).toContain(failure);
    }
  });

  it('reports capability identity, version, and processing drift', () => {
    const expectation = {
      locale: 'en',
      slug: 'expected-tool',
      expectedTitleIncludes: 'YouTube Tags Generator',
      expectedDescriptionIncludes: 'YouTube tags',
      expectedH1Includes: 'YouTube Tags Generator',
      expectedJsonLdTypes: ['Organization', 'SoftwareApplication'],
      expectedCapabilitySlug: 'expected-tool',
      expectedCapabilityVersion: '9.0.0',
      expectedLocalProcessing: false,
    };

    const failures = compareToolPageRenderContract(
      expectation,
      extractToolPageRenderContract(enforcedCapabilityHtml),
      enforcedCapabilityHtml,
    );

    expect(failures).toContain(
      'en/expected-tool capability disclosure: expected data-tool-capability="expected-tool" but found "release-ready-tool"',
    );
    expect(failures).toContain(
      'en/expected-tool capability disclosure: expected data-capability-version="9.0.0" but found "2.3.0"',
    );
    expect(failures).toContain(
      'en/expected-tool capability disclosure: expected data-local-processing=false but found true',
    );
  });

  it('keeps an inventory pilot route free of public capability attributes', () => {
    const expectation = {
      locale: 'en',
      slug: 'excel-viewer',
      expectedTitleIncludes: 'YouTube Tags Generator',
      expectedDescriptionIncludes: 'YouTube tags',
      expectedH1Includes: 'YouTube Tags Generator',
      expectedJsonLdTypes: ['Organization', 'SoftwareApplication'],
    };
    const contract = extractToolPageRenderContract(sampleHtml);

    expect(contract).toMatchObject({
      capabilitySlug: undefined,
      capabilityVersion: undefined,
      localProcessing: undefined,
      capabilityDisclosureCount: 0,
    });
    expect(compareToolPageRenderContract(expectation, contract, sampleHtml)).toEqual([]);
  });

  it('rejects empty capability attributes on an inventory route', () => {
    const expectation = {
      locale: 'en',
      slug: 'excel-viewer',
      expectedTitleIncludes: 'YouTube Tags Generator',
      expectedDescriptionIncludes: 'YouTube tags',
      expectedH1Includes: 'YouTube Tags Generator',
      expectedJsonLdTypes: ['Organization', 'SoftwareApplication'],
    };
    const htmlWithEmptyDisclosure = sampleHtml.replace(
      '<h1 class="text-4xl">YouTube Tags Generator</h1>',
      `<h1 class="text-4xl">YouTube Tags Generator</h1>
      <section data-tool-capability="" data-capability-version="" data-local-processing=""></section>`,
    );

    expect(
      compareToolPageRenderContract(
        expectation,
        extractToolPageRenderContract(htmlWithEmptyDisclosure),
        htmlWithEmptyDisclosure,
      ),
    ).toContain(
      'en/excel-viewer capability disclosure: expected 0 disclosure elements but found 1',
    );
  });

  it('rejects duplicate disclosure elements on an enforced route', () => {
    const expectation = {
      locale: 'en',
      slug: 'release-ready-tool',
      expectedTitleIncludes: 'YouTube Tags Generator',
      expectedDescriptionIncludes: 'YouTube tags',
      expectedH1Includes: 'YouTube Tags Generator',
      expectedJsonLdTypes: ['Organization', 'SoftwareApplication'],
      expectedCapabilitySlug: 'release-ready-tool',
      expectedCapabilityVersion: '2.3.0',
      expectedLocalProcessing: true,
    };
    const duplicateDisclosureHtml = enforcedCapabilityHtml.replace(
      '</body>',
      `<aside data-tool-capability="release-ready-tool" data-capability-version="2.3.0" data-local-processing="true"></aside>
      </body>`,
    );

    expect(
      compareToolPageRenderContract(
        expectation,
        extractToolPageRenderContract(duplicateDisclosureHtml),
        duplicateDisclosureHtml,
      ),
    ).toContain(
      'en/release-ready-tool capability disclosure: expected 1 disclosure elements but found 2',
    );
  });

  it('rejects capability attributes split across separate elements', () => {
    const expectation = {
      locale: 'en',
      slug: 'release-ready-tool',
      expectedTitleIncludes: 'YouTube Tags Generator',
      expectedDescriptionIncludes: 'YouTube tags',
      expectedH1Includes: 'YouTube Tags Generator',
      expectedJsonLdTypes: ['Organization', 'SoftwareApplication'],
      expectedCapabilitySlug: 'release-ready-tool',
      expectedCapabilityVersion: '2.3.0',
      expectedLocalProcessing: true,
    };
    const splitDisclosureHtml = sampleHtml.replace(
      '<h1 class="text-4xl">YouTube Tags Generator</h1>',
      `<h1 class="text-4xl">YouTube Tags Generator</h1>
      <section data-tool-capability="release-ready-tool"></section>
      <section data-capability-version="2.3.0"></section>
      <section data-local-processing="true"></section>`,
    );

    expect(
      compareToolPageRenderContract(
        expectation,
        extractToolPageRenderContract(splitDisclosureHtml),
        splitDisclosureHtml,
      ),
    ).toContain(
      'en/release-ready-tool capability disclosure: expected 1 disclosure elements but found 3',
    );
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

  it('fails an indexable recovery route when robots drifts to noindex', () => {
    const expectation = {
      locale: 'ru',
      slug: 'ip-validator',
      expectedTitleIncludes: 'YouTube Tags Generator',
      expectedDescriptionIncludes: 'YouTube tags',
      expectedH1Includes: 'YouTube Tags Generator',
      expectedCanonicalPath: '/en/tools/youtube-tags-generator/',
      expectedIndexable: true,
      expectedJsonLdTypes: ['Organization', 'SoftwareApplication', 'FAQPage'],
    };
    const html = sampleHtml.replace(
      'content="index, follow, max-snippet:-1"',
      'content="noindex, nofollow"',
    );

    expect(
      compareToolPageRenderContract(
        expectation,
        extractToolPageRenderContract(html),
        html,
      ),
    ).toContain(
      'ru/ip-validator robots: expected index, follow but found "noindex, nofollow"',
    );

    const nofollowHtml = sampleHtml.replace(
      'content="index, follow, max-snippet:-1"',
      'content="index, nofollow"',
    );
    expect(
      compareToolPageRenderContract(
        expectation,
        extractToolPageRenderContract(nofollowHtml),
        nofollowHtml,
      ),
    ).toContain(
      'ru/ip-validator robots: expected index, follow but found "index, nofollow"',
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

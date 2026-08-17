import * as cheerio from 'cheerio';

import { extractJsonLdBlocks, getTagContent } from '../../src/lib/seo-probe';

export interface ToolPageRenderCliOptions {
  baseUrl: string;
  filter: string;
  jsonOut: string;
  timeoutMs: number;
  updateBaseline: boolean;
}

export interface ToolPageRenderExpectation {
  locale: string;
  slug: string;
  reason?: string;
  expectedTitleIncludes: string;
  expectedDescriptionIncludes: string;
  expectedH1Includes: string;
  expectedCanonicalPath?: string;
  expectedIndexable?: boolean;
  expectedJsonLdTypes: string[];
  expectedToolCluster?: string;
  minClusterGroups?: number;
  minSiblingToolLinks?: number;
  minFaqQuestions?: number;
  bodyMustInclude?: string[];
  expectedCapabilitySlug?: string;
  expectedCapabilityVersion?: string;
  expectedLocalProcessing?: boolean;
  expectedGrammarLanguageNotice?: {
    inputLanguage: string;
    text: string;
  };
}

export interface ToolPageRenderContract {
  status: number;
  title: string;
  description: string;
  canonical: string;
  robots: string;
  h1: string;
  jsonLdTypes: string[];
  toolClusters: string[];
  toolClusterGroups: string[];
  siblingToolHrefs: string[];
  faqQuestionCount: number;
  bodyTextSentinels: string[];
  capabilitySlug?: string;
  capabilityVersion?: string;
  localProcessing?: boolean;
  capabilityDisclosureCount: number;
  grammarLanguageNoticeCount: number;
  grammarLanguageNoticeTagName?: string;
  grammarLanguageNoticeRole?: string;
  grammarLanguageNoticeInputLanguage?: string;
  grammarLanguageNoticeText?: string;
}

export interface ToolPageRenderResult {
  locale: string;
  slug: string;
  path: string;
  status: number;
  failures: string[];
  error?: string;
  contract?: ToolPageRenderContract;
}

export interface ToolPageRenderReport {
  generatedAt: string;
  baseUrl: string;
  summary: {
    total: number;
    passed: number;
    failed: number;
  };
  results: ToolPageRenderResult[];
}

export const TOOL_PAGE_RENDER_MATRIX: ToolPageRenderExpectation[] = [
  {
    locale: 'en',
    slug: 'bar-chart-generator',
    reason: 'chart cluster member + support-content fallback',
    expectedTitleIncludes: 'Bar Chart',
    expectedDescriptionIncludes: 'bar chart',
    expectedH1Includes: 'Bar Chart',
    expectedJsonLdTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    expectedToolCluster: 'chart',
    minClusterGroups: 1,
    minSiblingToolLinks: 1,
    bodyMustInclude: ['data-tool-cluster="chart"'],
  },
  {
    locale: 'en',
    slug: 'youtube-tags-generator',
    reason: 'creator SEO cluster member',
    expectedTitleIncludes: 'YouTube Tags',
    expectedDescriptionIncludes: 'YouTube',
    expectedH1Includes: 'YouTube Tags',
    expectedJsonLdTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    expectedToolCluster: 'creator-seo',
    minClusterGroups: 1,
    minSiblingToolLinks: 1,
    bodyMustInclude: ['data-tool-cluster="creator-seo"'],
  },
  {
    locale: 'en',
    slug: 'json-formatter',
    reason: 'developer/data cluster member',
    expectedTitleIncludes: 'JSON Formatter',
    expectedDescriptionIncludes: 'JSON',
    expectedH1Includes: 'JSON Formatter',
    expectedJsonLdTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    expectedToolCluster: 'developer-data',
    minClusterGroups: 1,
    minSiblingToolLinks: 1,
    bodyMustInclude: ['data-tool-cluster="developer-data"'],
  },
  {
    locale: 'en',
    slug: 'image-compressor',
    reason: 'image cluster member + comparison guide',
    expectedTitleIncludes: 'Image Compressor',
    expectedDescriptionIncludes: 'image',
    expectedH1Includes: 'Image Compressor',
    expectedJsonLdTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    expectedToolCluster: 'image',
    minClusterGroups: 1,
    minSiblingToolLinks: 1,
    bodyMustInclude: ['data-tool-cluster="image"'],
  },
  {
    locale: 'en',
    slug: 'currency-converter',
    reason: 'online calculator cluster member',
    expectedTitleIncludes: 'Currency Converter',
    expectedDescriptionIncludes: 'currency',
    expectedH1Includes: 'Currency Converter',
    expectedJsonLdTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    expectedToolCluster: 'online-calculator',
    minClusterGroups: 1,
    minSiblingToolLinks: 1,
    bodyMustInclude: ['data-tool-cluster="online-calculator"'],
  },
  {
    locale: 'en',
    slug: 'pdf-to-image',
    reason: 'PDF/document cluster member',
    expectedTitleIncludes: 'PDF to Image',
    expectedDescriptionIncludes: 'PDF',
    expectedH1Includes: 'PDF to Image',
    expectedJsonLdTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    expectedToolCluster: 'pdf-document',
    minClusterGroups: 1,
    minSiblingToolLinks: 1,
    bodyMustInclude: ['data-tool-cluster="pdf-document"'],
  },
  {
    locale: 'en',
    slug: 'password-generator',
    reason: 'security cluster member',
    expectedTitleIncludes: 'Password Generator',
    expectedDescriptionIncludes: 'password',
    expectedH1Includes: 'Password Generator',
    expectedJsonLdTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    expectedToolCluster: 'security',
    minClusterGroups: 1,
    minSiblingToolLinks: 1,
    bodyMustInclude: ['data-tool-cluster="security"'],
  },
  {
    locale: 'en',
    slug: 'word-counter',
    reason: 'text/writing cluster member',
    expectedTitleIncludes: 'Word Counter',
    expectedDescriptionIncludes: 'word',
    expectedH1Includes: 'Word Counter',
    expectedJsonLdTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    expectedToolCluster: 'text-writing',
    minClusterGroups: 1,
    minSiblingToolLinks: 1,
    bodyMustInclude: ['data-tool-cluster="text-writing"'],
  },
  {
    locale: 'en',
    slug: 'markdown-editor',
    reason: 'FAQ coverage',
    expectedTitleIncludes: 'Markdown Editor',
    expectedDescriptionIncludes: 'Markdown',
    expectedH1Includes: 'Markdown Editor',
    expectedJsonLdTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    minFaqQuestions: 1,
  },
  {
    locale: 'ko',
    slug: 'html-preview',
    reason: 'Korean HTML viewer recovery intent and runtime boundary',
    expectedTitleIncludes: 'HTML 뷰어 온라인',
    expectedDescriptionIncludes: 'HTML과 CSS',
    expectedH1Includes: 'HTML 미리보기',
    expectedCanonicalPath: '/ko/tools/html-preview/',
    expectedIndexable: true,
    expectedJsonLdTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    minSiblingToolLinks: 1,
    minFaqQuestions: 6,
    bodyMustInclude: ['JavaScript를 실행하지 않으며', 'HTML 뷰어와 HTML 실행 도구'],
  },
  {
    locale: 'ru',
    slug: 'ip-validator',
    reason: 'Russian IP validation recovery intent and lookup boundary',
    expectedTitleIncludes: 'Проверка IP адреса',
    expectedDescriptionIncludes: 'IPv4',
    expectedH1Includes: 'Проверка IP адреса',
    expectedCanonicalPath: '/ru/tools/ip-validator/',
    expectedIndexable: true,
    expectedJsonLdTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    minSiblingToolLinks: 2,
    minFaqQuestions: 5,
    bodyMustInclude: ['Чем проверка IP адреса отличается от поиска IP адреса'],
  },
  {
    locale: 'ru',
    slug: 'ip-lookup',
    reason: 'Russian IP geolocation recovery intent and validation boundary',
    expectedTitleIncludes: 'Поиск IP адреса',
    expectedDescriptionIncludes: 'геолокация',
    expectedH1Includes: 'Поиск IP адреса',
    expectedCanonicalPath: '/ru/tools/ip-lookup/',
    expectedIndexable: true,
    expectedJsonLdTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    minSiblingToolLinks: 2,
    minFaqQuestions: 5,
    bodyMustInclude: ['Проверяет ли поиск IP адреса формат IPv4 и IPv6'],
  },
  {
    locale: 'en',
    slug: 'grammar-checker',
    reason: 'release-blocking English grammar capability disclosure',
    expectedTitleIncludes: 'Grammar Checker',
    expectedDescriptionIncludes: 'English',
    expectedH1Includes: 'Grammar Checker',
    expectedCanonicalPath: '/en/tools/grammar-checker/',
    expectedJsonLdTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    expectedCapabilitySlug: 'grammar-checker',
    expectedCapabilityVersion: '1.1.0',
    expectedLocalProcessing: true,
    expectedGrammarLanguageNotice: {
      inputLanguage: 'en',
      text: 'This local checker is designed for English text.',
    },
  },
  {
    locale: 'en',
    slug: 'hex-editor',
    reason: 'release-blocking local binary Hex Editor capability disclosure',
    expectedTitleIncludes: 'Hex Editor',
    expectedDescriptionIncludes: 'binary',
    expectedH1Includes: 'Hex Editor',
    expectedCanonicalPath: '/en/tools/hex-editor/',
    expectedJsonLdTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    expectedCapabilitySlug: 'hex-editor',
    expectedCapabilityVersion: '2.0.0',
    expectedLocalProcessing: true,
    bodyMustInclude: ['File Editor', 'Maximum file size: 2 MiB.'],
  },
  {
    locale: 'en',
    slug: 'sql-query-optimizer',
    reason: 'release-blocking local SQL analysis and pasted EXPLAIN capability disclosure',
    expectedTitleIncludes: 'SQL Query Optimizer',
    expectedDescriptionIncludes: 'dialect',
    expectedH1Includes: 'SQL Query Optimizer',
    expectedCanonicalPath: '/en/tools/sql-query-optimizer/',
    expectedJsonLdTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    expectedCapabilitySlug: 'sql-query-optimizer',
    expectedCapabilityVersion: '2.0.0',
    expectedLocalProcessing: true,
    bodyMustInclude: [
      'Database dialect',
      'EXPLAIN text (optional)',
      'Analyze locally',
      'This tool does not connect to a database, does not execute SQL',
      'Local diagnostic explanations are displayed in English.',
    ],
  },
  {
    locale: 'en',
    slug: 'excel-viewer',
    reason: 'release-blocking local Excel workbook data viewer disclosure',
    expectedTitleIncludes: 'Excel Viewer',
    expectedDescriptionIncludes: 'locally',
    expectedH1Includes: 'Excel Viewer',
    expectedCanonicalPath: '/en/tools/excel-viewer/',
    expectedJsonLdTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    expectedCapabilitySlug: 'excel-viewer',
    expectedCapabilityVersion: '2.0.0',
    expectedLocalProcessing: true,
    bodyMustInclude: [
      'Your workbook stays in your browser and is never uploaded.',
      'Maximum file size: 10 MiB. Each worksheet is limited to 10,000 rows, 256 columns, or 250,000 cells. Macros are never executed.',
      'Download selected sheet CSV',
    ],
  },
  {
    locale: 'en',
    slug: 'typing-speed-test',
    reason: 'release-blocking local timed typing and history capability disclosure',
    expectedTitleIncludes: 'Typing Speed Test',
    expectedDescriptionIncludes: 'typing speed test',
    expectedH1Includes: 'Typing Speed Test',
    expectedCanonicalPath: '/en/tools/typing-speed-test/',
    expectedJsonLdTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    expectedCapabilitySlug: 'typing-speed-test',
    expectedCapabilityVersion: '2.0.0',
    expectedLocalProcessing: true,
    bodyMustInclude: [
      'Test duration',
      'Local history',
      'Saved only in this browser.',
    ],
  },
  {
    locale: 'en',
    slug: 'gantt-chart-generator',
    reason: 'release-blocking local Gantt project planning capability disclosure',
    expectedTitleIncludes: 'Gantt Chart Maker',
    expectedDescriptionIncludes: 'Gantt',
    expectedH1Includes: 'Gantt Chart Maker',
    expectedCanonicalPath: '/en/tools/gantt-chart-generator/',
    expectedJsonLdTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    expectedCapabilitySlug: 'gantt-chart-generator',
    expectedCapabilityVersion: '2.0.0',
    expectedLocalProcessing: true,
    bodyMustInclude: [
      'Project actions',
      'Critical path',
      'Local project data',
    ],
  },
  {
    locale: 'ru',
    slug: 'grammar-checker',
    reason: 'localized UI with explicit English-input boundary',
    expectedTitleIncludes: 'Проверка грамматики онлайн бесплатно',
    expectedDescriptionIncludes: 'английского текста',
    expectedH1Includes: 'Проверка грамматики',
    expectedCanonicalPath: '/ru/tools/grammar-checker/',
    expectedJsonLdTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    expectedCapabilitySlug: 'grammar-checker',
    expectedCapabilityVersion: '1.1.0',
    expectedLocalProcessing: true,
    expectedGrammarLanguageNotice: {
      inputLanguage: 'en',
      text: 'Интерфейс локализован на русский язык, но инструмент проверяет английский текст.',
    },
  },
  {
    locale: 'ja',
    slug: 'json-formatter',
    reason: 'CJK rendering',
    expectedTitleIncludes: 'JSON',
    expectedDescriptionIncludes: 'JSON',
    expectedH1Includes: 'JSON',
    expectedJsonLdTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    expectedToolCluster: 'developer-data',
    minClusterGroups: 1,
    minSiblingToolLinks: 1,
  },
  {
    locale: 'ar',
    slug: 'password-generator',
    reason: 'RTL rendering',
    expectedTitleIncludes: 'كلمات مرور',
    expectedDescriptionIncludes: 'كلمات المرور',
    expectedH1Includes: 'كلمة المرور',
    expectedJsonLdTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    expectedToolCluster: 'security',
    minClusterGroups: 1,
    minSiblingToolLinks: 1,
  },
];

export function extractToolPageRenderContract(
  html: string,
  status = 200,
  bodySentinels: string[] = []
): ToolPageRenderContract {
  const capabilityDisclosures = extractCapabilityDisclosureElements(html);
  const capabilityDisclosure = capabilityDisclosures[0];
  const localProcessingAttribute = capabilityDisclosure?.localProcessing;
  const grammarLanguageNotices = extractGrammarLanguageNoticeElements(html);
  const grammarLanguageNotice = grammarLanguageNotices[0];

  return {
    status,
    title: decodeHtmlEntities(getTagContent(html, 'title')),
    description: decodeHtmlEntities(getTagContent(html, 'description')),
    canonical: getTagContent(html, 'canonical'),
    robots: getTagContent(html, 'robots'),
    h1: decodeHtmlEntities(stripTags(firstMatch(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i))),
    jsonLdTypes: extractJsonLdTypes(html),
    toolClusters: uniqueSorted(attributeValues(html, 'data-tool-cluster')),
    toolClusterGroups: uniqueSorted(attributeValues(html, 'data-tool-cluster-group')),
    siblingToolHrefs: uniqueSorted(siblingToolHrefs(html)),
    faqQuestionCount: countFaqQuestions(html),
    bodyTextSentinels: bodySentinels.filter((sentinel) => html.includes(sentinel)),
    capabilitySlug: capabilityDisclosure?.slug,
    capabilityVersion: capabilityDisclosure?.version,
    localProcessing:
      localProcessingAttribute === undefined
        ? undefined
        : localProcessingAttribute === 'true'
          ? true
          : localProcessingAttribute === 'false'
            ? false
            : undefined,
    capabilityDisclosureCount: capabilityDisclosures.length,
    grammarLanguageNoticeCount: grammarLanguageNotices.length,
    grammarLanguageNoticeTagName: grammarLanguageNotice?.tagName,
    grammarLanguageNoticeRole: grammarLanguageNotice?.role,
    grammarLanguageNoticeInputLanguage: grammarLanguageNotice?.inputLanguage,
    grammarLanguageNoticeText: grammarLanguageNotice?.text,
  };
}

export function compareToolPageRenderContract(
  expectation: ToolPageRenderExpectation,
  contract: ToolPageRenderContract,
  html: string
): string[] {
  const route = `${expectation.locale}/${expectation.slug}`;
  const failures: string[] = [];

  if (contract.status < 200 || contract.status >= 300) {
    failures.push(`${route} status: expected 2xx but found ${contract.status}`);
  }

  pushIncludesFailure(failures, route, 'title', contract.title, expectation.expectedTitleIncludes);
  pushIncludesFailure(failures, route, 'description', contract.description, expectation.expectedDescriptionIncludes);
  pushIncludesFailure(failures, route, 'h1', contract.h1, expectation.expectedH1Includes);
  if (expectation.expectedCanonicalPath && !contract.canonical.endsWith(expectation.expectedCanonicalPath)) {
    failures.push(
      `${route} canonical: expected to end with ${JSON.stringify(expectation.expectedCanonicalPath)} but found ${JSON.stringify(contract.canonical)}`
    );
  }

  if (
    expectation.expectedIndexable === true
  ) {
    const robotsDirectives = new Set(
      contract.robots.toLowerCase().split(',').map((directive) => directive.trim()),
    );
    if (
      !robotsDirectives.has('index') ||
      !robotsDirectives.has('follow') ||
      robotsDirectives.has('noindex') ||
      robotsDirectives.has('nofollow')
    ) {
      failures.push(
        `${route} robots: expected index, follow but found ${JSON.stringify(contract.robots)}`
      );
    }
  }

  for (const schemaType of expectation.expectedJsonLdTypes) {
    if (!contract.jsonLdTypes.includes(schemaType)) {
      failures.push(
        `${route} jsonld: expected @type ${JSON.stringify(schemaType)} but found ${JSON.stringify(contract.jsonLdTypes)}`
      );
    }
  }

  if (expectation.expectedToolCluster && !contract.toolClusters.includes(expectation.expectedToolCluster)) {
    failures.push(
      `${route} cluster-card render regression: expected data-tool-cluster="${expectation.expectedToolCluster}" but found ${JSON.stringify(contract.toolClusters)}`
    );
  }

  if (expectation.minClusterGroups !== undefined && contract.toolClusterGroups.length < expectation.minClusterGroups) {
    failures.push(
      `${route} cluster-card render regression: expected at least ${expectation.minClusterGroups} data-tool-cluster-group entries but found ${contract.toolClusterGroups.length}`
    );
  }

  if (expectation.minSiblingToolLinks !== undefined && contract.siblingToolHrefs.length < expectation.minSiblingToolLinks) {
    failures.push(
      `${route} cluster-card render regression: expected at least ${expectation.minSiblingToolLinks} sibling tool links but found ${contract.siblingToolHrefs.length}`
    );
  }

  if (expectation.minFaqQuestions !== undefined && contract.faqQuestionCount < expectation.minFaqQuestions) {
    failures.push(
      `${route} faq: expected at least ${expectation.minFaqQuestions} FAQ questions but found ${contract.faqQuestionCount}`
    );
  }

  for (const sentinel of expectation.bodyMustInclude ?? []) {
    if (!html.includes(sentinel)) {
      failures.push(`${route} body: expected rendered HTML to include ${JSON.stringify(sentinel)}`);
    }
  }

  const expectedCapabilityDisclosureCount =
    expectation.expectedCapabilitySlug !== undefined ||
    expectation.expectedCapabilityVersion !== undefined ||
    expectation.expectedLocalProcessing !== undefined
      ? 1
      : 0;
  if (contract.capabilityDisclosureCount !== expectedCapabilityDisclosureCount) {
    failures.push(
      `${route} capability disclosure: expected ${expectedCapabilityDisclosureCount} disclosure elements but found ${contract.capabilityDisclosureCount}`,
    );
  }

  pushExactAttributeFailure(
    failures,
    route,
    'data-tool-capability',
    contract.capabilitySlug,
    expectation.expectedCapabilitySlug,
  );
  pushExactAttributeFailure(
    failures,
    route,
    'data-capability-version',
    contract.capabilityVersion,
    expectation.expectedCapabilityVersion,
  );
  pushExactAttributeFailure(
    failures,
    route,
    'data-local-processing',
    contract.localProcessing,
    expectation.expectedLocalProcessing,
  );

  const expectedGrammarLanguageNoticeCount = expectation.expectedGrammarLanguageNotice
    ? 1
    : 0;
  if (contract.grammarLanguageNoticeCount !== expectedGrammarLanguageNoticeCount) {
    failures.push(
      `${route} grammar language notice: expected ${expectedGrammarLanguageNoticeCount} semantic element${expectedGrammarLanguageNoticeCount === 1 ? '' : 's'} but found ${contract.grammarLanguageNoticeCount}`,
    );
  }
  if (expectation.expectedGrammarLanguageNotice) {
    if (contract.grammarLanguageNoticeTagName !== 'p') {
      failures.push(
        `${route} grammar language notice: expected tag <p> but found <${contract.grammarLanguageNoticeTagName}>`,
      );
    }
    if (contract.grammarLanguageNoticeRole !== 'note') {
      failures.push(
        `${route} grammar language notice: expected role="note" but found ${JSON.stringify(contract.grammarLanguageNoticeRole)}`,
      );
    }
    if (
      contract.grammarLanguageNoticeInputLanguage !==
      expectation.expectedGrammarLanguageNotice.inputLanguage
    ) {
      failures.push(
        `${route} grammar language notice: expected data-input-language=${JSON.stringify(expectation.expectedGrammarLanguageNotice.inputLanguage)} but found ${JSON.stringify(contract.grammarLanguageNoticeInputLanguage)}`,
      );
    }
    if (
      contract.grammarLanguageNoticeText !==
      expectation.expectedGrammarLanguageNotice.text
    ) {
      failures.push(
        `${route} grammar language notice: expected localized text ${JSON.stringify(expectation.expectedGrammarLanguageNotice.text)} but found ${JSON.stringify(contract.grammarLanguageNoticeText)}`,
      );
    }
  }

  return failures;
}

export function parseToolPageRenderArgs(argv: string[]): ToolPageRenderCliOptions {
  const envBaseUrl = process.env.FETCH_BASE_URL || process.env.PROD_BASE_URL || '';
  const options: ToolPageRenderCliOptions = {
    baseUrl: normalizeBaseUrl(envBaseUrl || 'http://localhost:4321'),
    filter: '',
    jsonOut: '',
    timeoutMs: 15000,
    updateBaseline: false,
  };

  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];
    if (arg === '--base-url' && argv[index + 1]) {
      options.baseUrl = normalizeBaseUrl(argv[++index]);
    } else if (arg === '--filter' && argv[index + 1]) {
      options.filter = argv[++index].trim().toLowerCase();
    } else if (arg === '--json-out' && argv[index + 1]) {
      options.jsonOut = argv[++index];
    } else if (arg === '--timeout-ms' && argv[index + 1]) {
      options.timeoutMs = parsePositiveInteger(argv[++index], '--timeout-ms');
    } else if (arg === '--update-baseline') {
      throw new Error('--update-baseline is reserved for a future committed-baseline workflow');
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

export function filterToolPageRenderMatrix(
  matrix: ToolPageRenderExpectation[],
  filter: string
): ToolPageRenderExpectation[] {
  const normalizedFilter = filter.trim().toLowerCase();
  if (!normalizedFilter) {
    return matrix;
  }

  return matrix.filter((entry) =>
    [
      entry.locale,
      entry.slug,
      entry.reason ?? '',
      entry.expectedToolCluster ?? '',
      `${entry.locale}/${entry.slug}`,
    ].some((value) => value.toLowerCase().includes(normalizedFilter))
  );
}

export function buildToolPageRenderReport(params: {
  baseUrl: string;
  results: ToolPageRenderResult[];
  generatedAt?: string;
}): ToolPageRenderReport {
  const failed = params.results.filter((result) => result.failures.length > 0 || result.error).length;

  return {
    generatedAt: params.generatedAt ?? new Date().toISOString(),
    baseUrl: params.baseUrl,
    summary: {
      total: params.results.length,
      passed: params.results.length - failed,
      failed,
    },
    results: params.results,
  };
}

export function computeToolPageRenderExitCode(report: ToolPageRenderReport): number {
  return report.summary.failed > 0 ? 1 : 0;
}

export function hasOnlyFetchFailures(report: ToolPageRenderReport): boolean {
  return report.summary.failed > 0 && report.results.every((result) => Boolean(result.error));
}

export function toolPagePath(locale: string, slug: string): string {
  return `/${locale}/tools/${slug}/`;
}

function pushIncludesFailure(
  failures: string[],
  route: string,
  field: string,
  actual: string,
  expected: string
): void {
  if (!actual.toLowerCase().includes(expected.toLowerCase())) {
    failures.push(`${route} ${field}: expected to include ${JSON.stringify(expected)} but found ${JSON.stringify(actual)}`);
  }
}

function extractJsonLdTypes(html: string): string[] {
  const types: string[] = [];

  for (const block of extractJsonLdBlocks(html)) {
    collectJsonLdTypes(block, types);
  }

  return uniqueSorted(types);
}

function collectJsonLdTypes(value: unknown, types: string[]): void {
  if (Array.isArray(value)) {
    for (const item of value) {
      collectJsonLdTypes(item, types);
    }
    return;
  }

  if (!value || typeof value !== 'object') {
    return;
  }

  const record = value as Record<string, unknown>;
  const typeValue = record['@type'];
  if (typeof typeValue === 'string') {
    types.push(typeValue);
  } else if (Array.isArray(typeValue)) {
    for (const item of typeValue) {
      if (typeof item === 'string') {
        types.push(item);
      }
    }
  }

  for (const item of Object.values(record)) {
    if (item && typeof item === 'object') {
      collectJsonLdTypes(item, types);
    }
  }
}

function attributeValues(html: string, attribute: string): string[] {
  const values: string[] = [];
  const pattern = new RegExp(`\\b${escapeRegExp(attribute)}=(["'])(.*?)\\1`, 'gi');
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(html)) !== null) {
    const value = match[2]?.trim();
    if (value) {
      values.push(decodeHtmlEntities(value));
    }
  }

  return values;
}

function pushExactAttributeFailure(
  failures: string[],
  route: string,
  attribute: string,
  actual: string | boolean | undefined,
  expected: string | boolean | undefined,
): void {
  if (actual === expected) {
    return;
  }

  failures.push(
    `${route} capability disclosure: expected ${attribute}=${JSON.stringify(expected)} but found ${JSON.stringify(actual)}`,
  );
}

interface ExtractedCapabilityDisclosure {
  slug?: string;
  version?: string;
  localProcessing?: string;
}

interface ExtractedGrammarLanguageNotice {
  tagName: string;
  role?: string;
  inputLanguage?: string;
  text: string;
}

function extractGrammarLanguageNoticeElements(
  html: string,
): ExtractedGrammarLanguageNotice[] {
  const $ = cheerio.load(html);

  return $('[data-grammar-language-notice]')
    .toArray()
    .map((element) => {
      const notice = $(element);
      return {
        tagName: element.tagName.toLowerCase(),
        role: notice.attr('role')?.trim(),
        inputLanguage: notice.attr('data-input-language')?.trim(),
        text: notice.text().trim(),
      };
    });
}

function extractCapabilityDisclosureElements(
  html: string,
): ExtractedCapabilityDisclosure[] {
  const disclosures: ExtractedCapabilityDisclosure[] = [];
  const tagPattern = /<[a-z][^>]*>/gi;
  let match: RegExpExecArray | null;

  while ((match = tagPattern.exec(html)) !== null) {
    const tag = match[0];
    if (
      !/\b(?:data-tool-capability|data-capability-version|data-local-processing)\b/i.test(
        tag,
      )
    ) {
      continue;
    }

    disclosures.push({
      slug: attributeValueFromTag(tag, 'data-tool-capability'),
      version: attributeValueFromTag(tag, 'data-capability-version'),
      localProcessing: attributeValueFromTag(tag, 'data-local-processing'),
    });
  }

  return disclosures;
}

function attributeValueFromTag(
  tag: string,
  attribute: string,
): string | undefined {
  const pattern = new RegExp(
    `\\b${escapeRegExp(attribute)}\\s*=\\s*(["'])(.*?)\\1`,
    'i',
  );
  const match = tag.match(pattern);
  return match ? decodeHtmlEntities(match[2] ?? '').trim() : undefined;
}

function siblingToolHrefs(html: string): string[] {
  const hrefs: string[] = [];
  const anchorPattern = /<a\b(?=[^>]*\bdata-sibling-tool=(["']).*?\1)[^>]*>/gi;
  let match: RegExpExecArray | null;

  while ((match = anchorPattern.exec(html)) !== null) {
    const href = match[0].match(/\bhref=(["'])(.*?)\1/i)?.[2]?.trim();
    if (href) {
      hrefs.push(decodeHtmlEntities(href));
    }
  }

  return hrefs;
}

function countFaqQuestions(html: string): number {
  const faqBlocks = extractJsonLdBlocks(html).filter((block) => containsJsonLdType(block, 'FAQPage'));
  let count = 0;

  for (const block of faqBlocks) {
    const mainEntity = block.mainEntity;
    if (Array.isArray(mainEntity)) {
      count += mainEntity.length;
    }
  }

  if (count > 0) {
    return count;
  }

  return (html.match(/<summary\b[\s\S]*?<\/summary>/gi) ?? []).length;
}

function containsJsonLdType(value: unknown, type: string): boolean {
  if (Array.isArray(value)) {
    return value.some((item) => containsJsonLdType(item, type));
  }

  if (!value || typeof value !== 'object') {
    return false;
  }

  const record = value as Record<string, unknown>;
  const typeValue = record['@type'];
  if (typeValue === type || (Array.isArray(typeValue) && typeValue.includes(type))) {
    return true;
  }

  return Object.values(record).some((item) => item && typeof item === 'object' && containsJsonLdType(item, type));
}

function firstMatch(value: string, pattern: RegExp): string {
  return value.match(pattern)?.[1]?.trim() ?? '';
}

function stripTags(value: string): string {
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values)).sort((left, right) => left.localeCompare(right));
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function normalizeBaseUrl(value: string): string {
  return value.replace(/\/+$/, '');
}

function parsePositiveInteger(value: string, flag: string): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${flag} must be a positive integer`);
  }
  return parsed;
}

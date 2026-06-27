import { describe, expect, it } from 'vitest';
import {
  buildTdkCleanupCandidateExport,
  buildTdkCleanupCandidates,
  buildTdkIntegrityReport,
  parseTdkIntegrityArgs,
  validateToolTdk,
  type TdkIntegrityFinding,
  type TdkSourceLayerIndex,
} from './validate-tdk-integrity';

describe('validateToolTdk', () => {
  it('returns no findings for metadata inside locale-specific safe bounds', () => {
    const findings = validateToolTdk({
      locale: 'en',
      slug: 'json-formatter',
      category: 'development',
      lookupKey: 'json-formatter',
      toolDict: {
        seo_title: 'JSON Formatter Online',
        seo_description: 'Format and validate JSON text in the browser with readable indentation.',
      },
    });

    expect(findings).toEqual([]);
  });

  it('flags missing metadata as hard errors', () => {
    const findings = validateToolTdk({
      locale: 'fr',
      slug: 'json-formatter',
      category: 'development',
      lookupKey: 'json-formatter',
      toolDict: {},
    });

    expect(findings).toContainEqual({
      locale: 'fr',
      slug: 'json-formatter',
      category: 'development',
      field: 'seo_title',
      severity: 'error',
      kind: 'missing',
      message: 'seo_title is missing or empty',
    });
    expect(findings).toContainEqual({
      locale: 'fr',
      slug: 'json-formatter',
      category: 'development',
      field: 'seo_description',
      severity: 'error',
      kind: 'missing',
      message: 'seo_description is missing or empty',
    });
  });

  it('flags forbidden placeholders as hard errors', () => {
    const findings = validateToolTdk({
      locale: 'es',
      slug: 'json-formatter',
      category: 'development',
      lookupKey: 'json-formatter',
      toolDict: {
        seo_title: 'PLACEHOLDER JSON Formatter',
        seo_description: 'Use this JSON formatter once ${BASE_URL} has been configured.',
      },
    });

    expect(findings).toContainEqual(
      expect.objectContaining({
        field: 'seo_title',
        severity: 'error',
        kind: 'forbidden_token',
        message: 'seo_title contains forbidden placeholder "PLACEHOLDER"',
      })
    );
    expect(findings).toContainEqual(
      expect.objectContaining({
        field: 'seo_description',
        severity: 'error',
        kind: 'forbidden_token',
        message: 'seo_description contains forbidden placeholder "${BASE_URL}"',
      })
    );
  });

  it('classifies overlong CJK description warnings with length metadata', () => {
    const findings = validateToolTdk({
      locale: 'ja',
      slug: 'json-formatter',
      category: 'development',
      lookupKey: 'json-formatter',
      toolDict: {
        seo_title: 'JSON整形ツール',
        seo_description: 'あ'.repeat(121),
      },
    });

    expect(findings).toEqual([
      {
        locale: 'ja',
        slug: 'json-formatter',
        category: 'development',
        field: 'seo_description',
        severity: 'warning',
        kind: 'length',
        direction: 'long',
        length: 121,
        min: 40,
        max: 120,
        overBy: 1,
        message: 'seo_description length 121 is out of safe bounds [40, 120]',
      },
    ]);
  });
});

describe('buildTdkIntegrityReport', () => {
  it('summarizes warnings by locale, field, category, direction, and slug', () => {
    const findings: TdkIntegrityFinding[] = [
      {
        locale: 'ja',
        slug: 'json-formatter',
        category: 'development',
        field: 'seo_description',
        severity: 'warning',
        kind: 'length',
        direction: 'long',
        length: 121,
        min: 40,
        max: 120,
        overBy: 1,
        message: 'seo_description length 121 is out of safe bounds [40, 120]',
      },
      {
        locale: 'fr',
        slug: 'json-formatter',
        category: 'development',
        field: 'seo_title',
        severity: 'warning',
        kind: 'length',
        direction: 'long',
        length: 71,
        min: 10,
        max: 70,
        overBy: 1,
        message: 'seo_title length 71 is out of safe bounds [10, 70]',
      },
      {
        locale: 'fr',
        slug: 'missing-tool',
        category: 'text',
        field: 'namespace',
        severity: 'error',
        kind: 'missing_namespace',
        message: 'Missing translation namespace under key "missing-tool"',
      },
    ];

    const report = buildTdkIntegrityReport(findings, {
      totalTools: 2,
      totalLocales: 2,
      checkedCount: 4,
    });

    expect(report.summary.errors).toBe(1);
    expect(report.summary.warnings).toBe(2);
    expect(report.summary.warningsByField).toEqual({
      seo_title: 1,
      seo_description: 1,
    });
    expect(report.summary.warningsByDirection).toEqual({
      short: 0,
      long: 2,
    });
    expect(report.summary.topWarningLocales).toEqual([
      { locale: 'fr', count: 1 },
      { locale: 'ja', count: 1 },
    ]);
    expect(report.summary.topWarningCategories).toEqual([
      { category: 'development', count: 2 },
    ]);
    expect(report.summary.topWarningSlugs).toEqual([
      { slug: 'json-formatter', count: 2 },
    ]);
  });
});

describe('buildTdkCleanupCandidates', () => {
  const findings: TdkIntegrityFinding[] = [
    {
      locale: 'fr',
      slug: 'jwt-payload-decoder',
      category: 'security',
      field: 'seo_description',
      severity: 'warning',
      kind: 'length',
      direction: 'long',
      length: 240,
      min: 50,
      max: 180,
      overBy: 60,
      message: 'seo_description length 240 is out of safe bounds [50, 180]',
    },
    {
      locale: 'ja',
      slug: 'json-formatter',
      category: 'development',
      field: 'seo_description',
      severity: 'warning',
      kind: 'length',
      direction: 'long',
      length: 190,
      min: 40,
      max: 120,
      overBy: 70,
      message: 'seo_description length 190 is out of safe bounds [40, 120]',
    },
    {
      locale: 'ko',
      slug: 'json-formatter',
      category: 'development',
      field: 'seo_title',
      severity: 'warning',
      kind: 'length',
      direction: 'long',
      length: 40,
      min: 5,
      max: 35,
      overBy: 5,
      message: 'seo_title length 40 is out of safe bounds [5, 35]',
    },
    {
      locale: 'en',
      slug: 'missing-tool',
      category: 'development',
      field: 'seo_description',
      severity: 'error',
      kind: 'missing',
      message: 'seo_description is missing or empty',
    },
  ];

  const report = buildTdkIntegrityReport(findings, {
    totalTools: 3,
    totalLocales: 4,
    checkedCount: 12,
  });

  const sourceLayers: TdkSourceLayerIndex = {
    fr: {
      'jwt-payload-decoder': {
        seo_description: {
          root: 'Decode JWT payloads with a long root description that needs review.',
          base: 'Decode JWT payloads with a different base description that needs review.',
          rootPath: 'src/messages/fr.json',
          basePath: 'src/messages/fr/base.json',
        },
      },
    },
    ja: {
      'json-formatter': {
        seo_description: {
          root: 'JSON data formatter description shared by root and base.',
          base: 'JSON data formatter description shared by root and base.',
          rootPath: 'src/messages/ja.json',
          basePath: 'src/messages/ja/base.json',
        },
      },
    },
    ko: {
      'json-formatter': {
        seo_title: {
          base: 'Overlong Korean title from base only',
          basePath: 'src/messages/ko/base.json',
        },
      },
    },
  };

  it('ranks warning-only cleanup candidates by overrun and adds source-layer sync metadata', () => {
    const candidates = buildTdkCleanupCandidates(report, sourceLayers, {
      limit: 2,
      fields: ['seo_description'],
    });

    expect(candidates).toEqual([
      expect.objectContaining({
        rank: 1,
        locale: 'ja',
        slug: 'json-formatter',
        field: 'seo_description',
        direction: 'long',
        length: 190,
        max: 120,
        overBy: 70,
        currentValue: 'JSON data formatter description shared by root and base.',
        sourceLayers: {
          status: 'root_base_match',
          rootValue: 'JSON data formatter description shared by root and base.',
          baseValue: 'JSON data formatter description shared by root and base.',
          rootPath: 'src/messages/ja.json',
          basePath: 'src/messages/ja/base.json',
        },
      }),
      expect.objectContaining({
        rank: 2,
        locale: 'fr',
        slug: 'jwt-payload-decoder',
        field: 'seo_description',
        direction: 'long',
        length: 240,
        max: 180,
        overBy: 60,
        currentValue: 'Decode JWT payloads with a long root description that needs review.',
        sourceLayers: expect.objectContaining({
          status: 'root_base_mismatch',
        }),
      }),
    ]);
  });

  it('filters candidates by locale, field, and direction', () => {
    const candidates = buildTdkCleanupCandidates(report, sourceLayers, {
      locales: ['ko'],
      fields: ['seo_title'],
      directions: ['long'],
    });

    expect(candidates).toEqual([
      expect.objectContaining({
        rank: 1,
        locale: 'ko',
        slug: 'json-formatter',
        field: 'seo_title',
        currentValue: 'Overlong Korean title from base only',
        sourceLayers: expect.objectContaining({
          status: 'base_only',
        }),
      }),
    ]);
  });

  it('builds a compact cleanup candidate export with report totals and applied filters', () => {
    const exportPayload = buildTdkCleanupCandidateExport(report, sourceLayers, {
      limit: 1,
      locales: ['ja', 'fr'],
      fields: ['seo_description'],
      directions: ['long'],
    });

    expect(exportPayload.summary).toEqual({
      errors: 1,
      warnings: 3,
      candidateCount: 1,
    });
    expect(exportPayload.filters).toEqual({
      limit: 1,
      locales: ['ja', 'fr'],
      fields: ['seo_description'],
      directions: ['long'],
    });
    expect(exportPayload.candidates).toHaveLength(1);
    expect(exportPayload.candidates[0]).toEqual(expect.objectContaining({
      locale: 'ja',
      slug: 'json-formatter',
      overBy: 70,
    }));
  });
});

describe('parseTdkIntegrityArgs', () => {
  it('parses help, report path, and top limit', () => {
    expect(parseTdkIntegrityArgs(['--report-path', '/tmp/report.json', '--top', '7'])).toEqual({
      help: false,
      reportPath: '/tmp/report.json',
      top: 7,
      candidateTop: 20,
    });
    expect(parseTdkIntegrityArgs(['--help'])).toEqual({
      help: true,
      top: 30,
      candidateTop: 20,
    });
  });

  it('parses cleanup candidate export options', () => {
    expect(parseTdkIntegrityArgs([
      '--candidates-path',
      '/tmp/candidates.json',
      '--candidate-top',
      '12',
      '--candidate-locales',
      'ja,ko',
      '--candidate-fields',
      'seo_description',
      '--candidate-directions',
      'long',
    ])).toEqual({
      help: false,
      top: 30,
      candidatesPath: '/tmp/candidates.json',
      candidateTop: 12,
      candidateLocales: ['ja', 'ko'],
      candidateFields: ['seo_description'],
      candidateDirections: ['long'],
    });
  });

  it('rejects invalid top limits and unknown flags', () => {
    expect(() => parseTdkIntegrityArgs(['--top', '0'])).toThrow('Invalid value for --top: 0');
    expect(() => parseTdkIntegrityArgs(['--candidate-top', '0'])).toThrow('Invalid value for --candidate-top: 0');
    expect(() => parseTdkIntegrityArgs(['--candidate-fields', 'namespace'])).toThrow('Invalid value for --candidate-fields: namespace');
    expect(() => parseTdkIntegrityArgs(['--candidate-directions', 'sideways'])).toThrow('Invalid value for --candidate-directions: sideways');
    expect(() => parseTdkIntegrityArgs(['--wat'])).toThrow('Unknown argument: --wat');
  });
});

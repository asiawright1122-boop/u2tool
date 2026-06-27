import { describe, expect, it } from 'vitest';
import {
  buildTdkIntegrityReport,
  parseTdkIntegrityArgs,
  validateToolTdk,
  type TdkIntegrityFinding,
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

describe('parseTdkIntegrityArgs', () => {
  it('parses help, report path, and top limit', () => {
    expect(parseTdkIntegrityArgs(['--report-path', '/tmp/report.json', '--top', '7'])).toEqual({
      help: false,
      reportPath: '/tmp/report.json',
      top: 7,
    });
    expect(parseTdkIntegrityArgs(['--help'])).toEqual({
      help: true,
      top: 30,
    });
  });

  it('rejects invalid top limits and unknown flags', () => {
    expect(() => parseTdkIntegrityArgs(['--top', '0'])).toThrow('Invalid value for --top: 0');
    expect(() => parseTdkIntegrityArgs(['--wat'])).toThrow('Unknown argument: --wat');
  });
});

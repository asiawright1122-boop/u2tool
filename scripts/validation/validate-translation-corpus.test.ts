import { describe, it, expect } from 'vitest';
import {
  validateSplitFile,
  auditCoverage,
  auditBaseJsonNamespace,
  buildCorpusReport,
  parseTranslationCorpusArgs,
  type SplitFileFinding,
  type CoverageFinding,
  type NamespaceFinding,
} from './validate-translation-corpus';

// ---------------------------------------------------------------------------
// TCG-01: validateSplitFile
// ---------------------------------------------------------------------------

describe('validateSplitFile', () => {
  const VALID_RECORD = {
    detailed_description: 'A'.repeat(60),
    usage_steps: ['Open the tool', 'Enter your input', 'Click format'],
    usage_examples: ['Example one', 'Example two'],
    faqs: [{ question: 'What is this?', answer: 'It is a tool.' }],
  };

  it('returns no findings for a valid file', () => {
    const findings = validateSplitFile(VALID_RECORD, 'en', 'test-tool');
    expect(findings).toEqual([]);
  });

  it('returns no findings for a valid file without faqs (optional)', () => {
    const { faqs, ...noFaqs } = VALID_RECORD;
    void faqs;
    const findings = validateSplitFile(noFaqs, 'en', 'test-tool');
    expect(findings).toEqual([]);
  });

  it('allows extra tool-specific UI keys without flagging', () => {
    const record = { ...VALID_RECORD, pomodoro: '25', shortBreak: '5', settings: { theme: 'dark' } };
    const findings = validateSplitFile(record, 'en', 'pomodoro-timer');
    expect(findings).toEqual([]);
  });

  it('flags missing detailed_description', () => {
    const { detailed_description, ...record } = VALID_RECORD;
    void detailed_description;
    const findings = validateSplitFile(record, 'en', 'test-tool');
    expect(findings).toContainEqual({
      locale: 'en', slug: 'test-tool', field: 'detailed_description',
      reason: 'required key is missing', severity: 'error',
    });
  });

  it('flags missing usage_steps', () => {
    const { usage_steps, ...record } = VALID_RECORD;
    void usage_steps;
    const findings = validateSplitFile(record, 'en', 'test-tool');
    expect(findings.some((f) => f.field === 'usage_steps' && f.reason === 'required key is missing')).toBe(true);
  });

  it('flags missing usage_examples', () => {
    const { usage_examples, ...record } = VALID_RECORD;
    void usage_examples;
    const findings = validateSplitFile(record, 'en', 'test-tool');
    expect(findings.some((f) => f.field === 'usage_examples' && f.reason === 'required key is missing')).toBe(true);
  });

  it('flags wrong type for detailed_description', () => {
    const record = { ...VALID_RECORD, detailed_description: 123 };
    const findings = validateSplitFile(record, 'en', 'test-tool');
    expect(findings.some((f) => f.field === 'detailed_description' && f.reason.includes('expected string'))).toBe(true);
  });

  it('flags detailed_description stub length (below 20 chars) as error', () => {
    const record = { ...VALID_RECORD, detailed_description: 'too short' }; // 9 chars
    const findings = validateSplitFile(record, 'en', 'test-tool');
    const dd = findings.find((f) => f.field === 'detailed_description');
    expect(dd).toBeDefined();
    expect(dd!.severity).toBe('error');
    expect(dd!.reason).toContain('unfinished stub');
  });

  it('flags detailed_description short length (20-49 chars) as warning', () => {
    const record = { ...VALID_RECORD, detailed_description: 'A'.repeat(35) }; // 35 chars
    const findings = validateSplitFile(record, 'en', 'test-tool');
    const dd = findings.find((f) => f.field === 'detailed_description');
    expect(dd).toBeDefined();
    expect(dd!.severity).toBe('warning');
    expect(dd!.reason).toContain('short but valid');
  });

  it('returns no findings for detailed_description at or above 50 chars', () => {
    const record = { ...VALID_RECORD, detailed_description: 'A'.repeat(50) };
    const findings = validateSplitFile(record, 'en', 'test-tool');
    expect(findings.some((f) => f.field === 'detailed_description')).toBe(false);
  });

  it('flags empty usage_steps array', () => {
    const record = { ...VALID_RECORD, usage_steps: [] };
    const findings = validateSplitFile(record, 'en', 'test-tool');
    expect(findings.some((f) => f.field === 'usage_steps' && f.reason === 'array is empty')).toBe(true);
  });

  it('flags empty string item in usage_steps', () => {
    const record = { ...VALID_RECORD, usage_steps: ['valid', '  ', 'also valid'] };
    const findings = validateSplitFile(record, 'en', 'test-tool');
    expect(findings.some((f) => f.field === 'usage_steps[1]' && f.reason.includes('empty'))).toBe(true);
  });

  it('flags faqs with empty question', () => {
    const record = { ...VALID_RECORD, faqs: [{ question: '', answer: 'valid answer' }] };
    const findings = validateSplitFile(record, 'en', 'test-tool');
    expect(findings.some((f) => f.field === 'faqs[0].question')).toBe(true);
  });

  it('flags faqs that is not an array', () => {
    const record = { ...VALID_RECORD, faqs: { question: 'q', answer: 'a' } };
    const findings = validateSplitFile(record, 'en', 'test-tool');
    expect(findings.some((f) => f.field === 'faqs' && f.reason.includes('expected array'))).toBe(true);
  });

  it('warns on empty faqs array', () => {
    const record = { ...VALID_RECORD, faqs: [] };
    const findings = validateSplitFile(record, 'en', 'test-tool');
    expect(findings.some((f) => f.field === 'faqs' && f.severity === 'warning')).toBe(true);
  });

  it('flags forbidden token in detailed_description', () => {
    const record = { ...VALID_RECORD, detailed_description: `${'A'.repeat(50)} TODO fix this` };
    const findings = validateSplitFile(record, 'en', 'test-tool');
    expect(findings.some((f) => f.field === 'detailed_description' && f.reason.includes('forbidden token'))).toBe(true);
  });

  it('flags forbidden token in usage_steps item', () => {
    const record = { ...VALID_RECORD, usage_steps: ['PLACEHOLDER step', 'valid'] };
    const findings = validateSplitFile(record, 'en', 'test-tool');
    expect(findings.some((f) => f.field === 'usage_steps[0]' && f.reason.includes('forbidden token'))).toBe(true);
  });

  it('flags forbidden token in faq answer', () => {
    const record = { ...VALID_RECORD, faqs: [{ question: 'q?', answer: 'see MISSING data' }] };
    const findings = validateSplitFile(record, 'en', 'test-tool');
    expect(findings.some((f) => f.field === 'faqs[0].answer' && f.reason.includes('forbidden token'))).toBe(true);
  });

  it('accepts custom-layout tools that omit all standard keys (no escape-hatch false positive)', () => {
    // world-cup-group-calculator style: tournament bracket with its own keys.
    const record = {
      title: 'World Cup',
      group: 'Group A',
      team: 'Team',
      knockout_stage: 'Knockout',
    };
    const findings = validateSplitFile(record, 'en', 'world-cup-group-calculator');
    expect(findings).toEqual([]);
  });

  it('custom-layout tool: present standard key must still be type-correct', () => {
    // Declares usage_steps (so standard layout applies) but typed wrong.
    const record = { usage_steps: 'not-an-array', customKey: 'x' };
    const findings = validateSplitFile(record, 'en', 'mixed-tool');
    expect(findings.some((f) => f.field === 'usage_steps' && f.reason.includes('expected array'))).toBe(true);
    // detailed_description + usage_examples are required (standard layout triggered).
    expect(findings.some((f) => f.field === 'detailed_description' && f.reason === 'required key is missing')).toBe(true);
  });

  it('accepts legacy {q, a} faq pair but flags it as a render-drift error', () => {
    const record = { ...VALID_RECORD, faqs: [{ q: 'What is this?', a: 'It is a tool.' }] };
    const findings = validateSplitFile(record, 'ja', 'toml-json');
    // The {q,a} pair itself is structurally valid (no non-empty-string finding).
    expect(findings.some((f) => f.field === 'faqs[0].question')).toBe(false);
    expect(findings.some((f) => f.field === 'faqs[0].answer')).toBe(false);
    // But the legacy shape is flagged as a render-drift error.
    const drift = findings.find((f) => f.field === 'faqs[0]' && f.severity === 'error');
    expect(drift).toBeDefined();
    expect(drift!.reason).toContain('legacy {q, a}');
  });

  it('rejects faq item mixing or missing both key pairs', () => {
    const record = { ...VALID_RECORD, faqs: [{ question: 'q?', foo: 'bar' }] };
    const findings = validateSplitFile(record, 'en', 'test-tool');
    expect(findings.some((f) => f.field === 'faqs[0]' && f.severity === 'error')).toBe(true);
  });

  it('returns root error when record is not an object', () => {
    const findings = validateSplitFile('not an object', 'en', 'test-tool');
    expect(findings).toHaveLength(1);
    expect(findings[0].field).toBe('(root)');
    expect(findings[0].severity).toBe('error');
  });

  it('returns root error when record is an array', () => {
    const findings = validateSplitFile([1, 2, 3], 'en', 'test-tool');
    expect(findings).toHaveLength(1);
    expect(findings[0].field).toBe('(root)');
  });
});

// ---------------------------------------------------------------------------
// TCG-02: auditCoverage
// ---------------------------------------------------------------------------

describe('auditCoverage', () => {
  const catalogSlugs = new Set(['json-formatter', 'password-generator', 'jwt-decoder']);
  const aliases = { 'jwt-debugger': 'jwt-decoder' };

  it('returns no findings when all catalog slugs have files in all locales', () => {
    const fileSlugsByLocale = {
      en: new Set(['json-formatter', 'password-generator', 'jwt-decoder']),
      zh: new Set(['json-formatter', 'password-generator', 'jwt-decoder']),
    };
    const findings = auditCoverage(catalogSlugs, fileSlugsByLocale, aliases);
    expect(findings).toEqual([]);
  });

  it('flags missing file in one locale', () => {
    const fileSlugsByLocale = {
      en: new Set(['json-formatter', 'password-generator', 'jwt-decoder']),
      zh: new Set(['json-formatter', 'password-generator']), // missing jwt-decoder
    };
    const findings = auditCoverage(catalogSlugs, fileSlugsByLocale, aliases);
    expect(findings).toContainEqual({
      locale: 'zh', slug: 'jwt-decoder', kind: 'missing',
      details: 'expected file jwt-decoder.json not found',
    });
  });

  it('flags orphan file not in catalog', () => {
    const fileSlugsByLocale = {
      en: new Set(['json-formatter', 'password-generator', 'jwt-decoder', 'mystery-tool']),
    };
    const findings = auditCoverage(catalogSlugs, fileSlugsByLocale, aliases);
    expect(findings.some((f) => f.slug === 'mystery-tool' && f.kind === 'orphan')).toBe(true);
  });

  it('resolves alias: catalog jwt-debugger maps to jwt-decoder file', () => {
    const catalogWithAlias = new Set(['json-formatter', 'jwt-debugger']);
    const fileSlugsByLocale = {
      en: new Set(['json-formatter', 'jwt-decoder']),
    };
    const findings = auditCoverage(catalogWithAlias, fileSlugsByLocale, aliases);
    // jwt-debugger resolves to jwt-decoder which exists → no missing finding
    expect(findings.filter((f) => f.kind === 'missing')).toEqual([]);
  });

  it('flags alias source slug as missing when alias target file absent', () => {
    const catalogWithAlias = new Set(['json-formatter', 'jwt-debugger']);
    const fileSlugsByLocale = {
      en: new Set(['json-formatter']), // jwt-decoder file absent
    };
    const findings = auditCoverage(catalogWithAlias, fileSlugsByLocale, aliases);
    expect(findings.some((f) => f.slug === 'jwt-debugger' && f.kind === 'missing')).toBe(true);
  });

  it('detects asymmetric locale file sets', () => {
    const fileSlugsByLocale = {
      en: new Set(['json-formatter', 'password-generator', 'jwt-decoder']),
      zh: new Set(['json-formatter', 'password-generator']), // 1 fewer
    };
    const findings = auditCoverage(catalogSlugs, fileSlugsByLocale, aliases);
    // zh should report jwt-decoder as missing
    expect(findings.some((f) => f.locale === 'zh' && f.slug === 'jwt-decoder' && f.kind === 'missing')).toBe(true);
  });

  it('handles empty catalog', () => {
    const fileSlugsByLocale = { en: new Set(['json-formatter']) };
    const findings = auditCoverage(new Set(), fileSlugsByLocale, aliases);
    // No catalog slugs → no missing; but json-formatter is an orphan
    expect(findings.every((f) => f.kind === 'orphan')).toBe(true);
  });

  it('handles empty locale file set', () => {
    const fileSlugsByLocale = { en: new Set<string>() };
    const findings = auditCoverage(catalogSlugs, fileSlugsByLocale, aliases);
    expect(findings.length).toBe(3); // all 3 catalog slugs missing
    expect(findings.every((f) => f.kind === 'missing')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// TCG-05: auditBaseJsonNamespace
// ---------------------------------------------------------------------------

describe('auditBaseJsonNamespace', () => {
  // EN reference: the canonical tools namespace. Mixes shared UI string keys
  // (copy/clear/...) with tool UI groups (regex/json-formatter/...), both valid.
  const enBaseTools = {
    copy: 'Copy',
    clear: 'Clear',
    generate: 'Generate',
    inputPlaceholder: 'Enter text',
    regex: { pattern: 'Pattern', flags: 'Flags', global: 'Global' },
    'json-formatter': { name: 'JSON Formatter', description: '...', beautify: 'Beautify' },
  };

  it('returns no findings for a namespace identical to EN', () => {
    const findings = auditBaseJsonNamespace(enBaseTools, 'zh', enBaseTools);
    expect(findings).toEqual([]);
  });

  it('returns no findings for EN audited against itself (reference locale)', () => {
    const findings = auditBaseJsonNamespace(enBaseTools, 'en', enBaseTools);
    expect(findings).toEqual([]);
  });

  it('flags a missing top-level key vs EN', () => {
    const { inputPlaceholder, ...zhTools } = enBaseTools;
    void inputPlaceholder;
    const findings = auditBaseJsonNamespace(zhTools, 'zh', enBaseTools);
    expect(findings.some((f) => f.key === 'inputPlaceholder' && f.kind === 'missing_key')).toBe(true);
  });

  it('flags an extra top-level key vs EN', () => {
    const zhTools = { ...enBaseTools, mysteriousKey: 'Some value' };
    const findings = auditBaseJsonNamespace(zhTools, 'zh', enBaseTools);
    expect(findings.some((f) => f.key === 'mysteriousKey' && f.kind === 'extra_key')).toBe(true);
  });

  it('flags tool UI group inner-key drift (locale adds an inner key EN lacks)', () => {
    // Mirrors the real drift: ZH tools.area-chart-generator carries `faqs` EN lacks.
    const zhTools = {
      ...enBaseTools,
      'json-formatter': { name: 'JSON 格式化', description: '...', beautify: '美化', faqs: 'FAQ' },
    };
    const findings = auditBaseJsonNamespace(zhTools, 'zh', enBaseTools);
    const drift = findings.find((f) => f.key === 'json-formatter' && f.kind === 'group_key_drift');
    expect(drift).toBeDefined();
    expect(drift!.details).toContain('faqs');
    expect(drift!.groupKeyDriftShape).toBe('extra_only');
    expect(drift!.extraInnerKeys).toEqual(['faqs']);
  });

  it('flags tool UI group inner-key drift (locale drops an inner key EN has)', () => {
    const zhTools = {
      ...enBaseTools,
      regex: { pattern: '模式', flags: '标志' }, // global dropped
    };
    const findings = auditBaseJsonNamespace(zhTools, 'zh', enBaseTools);
    const drift = findings.find((f) => f.key === 'regex' && f.kind === 'group_key_drift');
    expect(drift).toBeDefined();
    expect(drift!.details).toContain('global');
    expect(drift!.groupKeyDriftShape).toBe('missing_only');
    expect(drift!.missingInnerKeys).toEqual(['global']);
  });

  it('classifies mixed inner-key drift when locale both drops and adds keys', () => {
    const zhTools = {
      ...enBaseTools,
      regex: { pattern: '模式', global: '全局', extra: '额外' },
    };
    const findings = auditBaseJsonNamespace(zhTools, 'zh', enBaseTools);
    const drift = findings.find((f) => f.key === 'regex' && f.kind === 'group_key_drift');
    expect(drift).toBeDefined();
    expect(drift!.groupKeyDriftShape).toBe('mixed');
    expect(drift!.missingInnerKeys).toEqual(['flags']);
    expect(drift!.extraInnerKeys).toEqual(['extra']);
  });

  it('does not treat object-valued tool UI groups as suspicious (the old false positive)', () => {
    // 692 real object-valued groups like `regex` must NOT be flagged.
    const findings = auditBaseJsonNamespace(enBaseTools, 'zh', enBaseTools);
    expect(findings.some((f) => f.key === 'regex')).toBe(false);
  });

  it('returns no findings for non-object input', () => {
    const findings = auditBaseJsonNamespace(null, 'zh', enBaseTools);
    expect(findings).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// buildCorpusReport
// ---------------------------------------------------------------------------

describe('buildCorpusReport', () => {
  it('aggregates findings and computes summary counts', () => {
    const schemaFindings: SplitFileFinding[] = [
      { locale: 'zh', slug: 'b-tool', field: 'detailed_description', reason: 'missing', severity: 'error' },
      { locale: 'en', slug: 'a-tool', field: 'usage_steps', reason: 'empty', severity: 'error' },
      { locale: 'en', slug: 'a-tool', field: 'faqs', reason: 'empty array', severity: 'warning' },
    ];
    const coverageFindings: CoverageFinding[] = [
      { locale: 'ja', slug: 'missing-tool', kind: 'missing' },
    ];
    const namespaceFindings: NamespaceFinding[] = [
      { locale: 'zh', key: 'weird', kind: 'extra_key' },
    ];

    const report = buildCorpusReport(schemaFindings, coverageFindings, namespaceFindings, {
      totalFiles: 100,
      totalLocales: 10,
    });

    expect(report.totalFiles).toBe(100);
    expect(report.totalLocales).toBe(10);
    expect(report.summary.schemaErrors).toBe(2); // only errors counted
    expect(report.summary.coverageGaps).toBe(1);
    expect(report.summary.namespaceIssues).toBe(1);
    expect(report.summary.namespaceByKind).toEqual({
      missing_key: 0,
      extra_key: 1,
      group_key_drift: 0,
    });
  });

  it('sorts schema findings by error-first then locale then slug', () => {
    const schemaFindings: SplitFileFinding[] = [
      { locale: 'en', slug: 'z-tool', field: 'x', reason: 'w', severity: 'warning' },
      { locale: 'en', slug: 'a-tool', field: 'y', reason: 'e', severity: 'error' },
      { locale: 'en', slug: 'a-tool', field: 'z', reason: 'e2', severity: 'error' },
    ];
    const report = buildCorpusReport(schemaFindings, [], [], { totalFiles: 1, totalLocales: 1 });
    expect(report.schemaFindings.map((f) => f.reason)).toEqual(['e', 'e2', 'w']);
  });

  it('produces a timestamp', () => {
    const report = buildCorpusReport([], [], [], { totalFiles: 0, totalLocales: 0 });
    expect(report.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('handles empty findings', () => {
    const report = buildCorpusReport([], [], [], { totalFiles: 0, totalLocales: 0 });
    expect(report.summary.schemaErrors).toBe(0);
    expect(report.summary.coverageGaps).toBe(0);
    expect(report.summary.namespaceIssues).toBe(0);
    expect(report.summary.namespaceByKind).toEqual({
      missing_key: 0,
      extra_key: 0,
      group_key_drift: 0,
    });
    expect(report.summary.groupKeyDriftShapes).toEqual({
      missing_only: 0,
      extra_only: 0,
      mixed: 0,
    });
    expect(report.schemaFindings).toEqual([]);
  });

  it('computes namespace warning breakdown hotspots', () => {
    const report = buildCorpusReport(
      [],
      [],
      [
        { locale: 'zh', key: 'gpa-calculator', kind: 'group_key_drift', groupKeyDriftShape: 'extra_only' },
        { locale: 'zh', key: 'gpa-calculator', kind: 'group_key_drift', groupKeyDriftShape: 'extra_only' },
        { locale: 'ar', key: 'pace-calculator', kind: 'group_key_drift', groupKeyDriftShape: 'missing_only' },
        { locale: 'ar', key: 'regex', kind: 'missing_key' },
      ],
      { totalFiles: 2, totalLocales: 2 }
    );

    expect(report.summary.namespaceByKind).toEqual({
      missing_key: 1,
      extra_key: 0,
      group_key_drift: 3,
    });
    expect(report.summary.groupKeyDriftShapes).toEqual({
      missing_only: 1,
      extra_only: 2,
      mixed: 0,
    });
    expect(report.summary.topNamespaceLocales).toEqual([
      { locale: 'ar', count: 2 },
      { locale: 'zh', count: 2 },
    ]);
    expect(report.summary.topNamespaceKeys[0]).toEqual({
      key: 'gpa-calculator',
      count: 2,
    });
  });
});

describe('parseTranslationCorpusArgs', () => {
  it('parses report path and top limit', () => {
    expect(
      parseTranslationCorpusArgs(['--report-path', 'out.json', '--top', '12'])
    ).toEqual({
      help: false,
      reportPath: 'out.json',
      top: 12,
    });
  });

  it('parses help flags', () => {
    expect(parseTranslationCorpusArgs(['--help'])).toEqual({
      help: true,
      top: 30,
    });
  });

  it('rejects invalid top values', () => {
    expect(() => parseTranslationCorpusArgs(['--top', '0'])).toThrow(
      'Invalid value for --top: 0'
    );
  });

  it('rejects unknown flags', () => {
    expect(() => parseTranslationCorpusArgs(['--wat'])).toThrow(
      'Unknown argument: --wat'
    );
  });
});

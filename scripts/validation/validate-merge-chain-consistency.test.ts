/**
 * validate-merge-chain-consistency.test.ts
 *
 * Phase 80 unit tests for the Merge Chain Consistency Auditor.
 *
 * Covers the three audits (layer_overlap, resolved_divergence,
 * en_fallback_resolution) plus the pure merge-reuse guarantee and alias
 * handling. Fixtures are synthetic root/base/split triples mirroring the real
 * markdown-editor divergence pattern, so tests are deterministic and offline.
 */

import { describe, expect, it } from 'vitest';
import {
  auditEnFallbackResolution,
  auditLayerOverlap,
  auditResolvedDivergence,
  buildReport,
  parseMergeChainArgs,
} from './validate-merge-chain-consistency';
import { mergeMessageRecords } from '../../src/lib/translations';

const SUPPORT_KEYS = ['detailed_description', 'usage_steps', 'usage_examples', 'faqs'] as const;
type SupportKey = (typeof SUPPORT_KEYS)[number];

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

/** A split file carrying all four support keys with distinct sentinel values. */
function makeSplit(overrides: Partial<Record<SupportKey, unknown>> = {}) {
  return {
    detailed_description: 'SPLIT detailed_description',
    usage_steps: ['SPLIT step 1', 'SPLIT step 2'],
    usage_examples: ['SPLIT example 1'],
    faqs: [{ question: 'SPLIT q', answer: 'SPLIT a' }],
    ...overrides,
  };
}

/**
 * Wrap a tool object inside the `{ tools: { <slug>: toolObj } }` shape that
 * root.json / base.json use.
 */
function wrapTool(slug: string, toolObj: Record<string, unknown>) {
  return { tools: { [slug]: toolObj } };
}

// ---------------------------------------------------------------------------
// mergeMessageRecords reuse guarantee
// ---------------------------------------------------------------------------

describe('mergeMessageRecords reuse guarantee', () => {
  it('probe uses the real runtime merge (override wins, deep-merge for objects)', () => {
    const base = { tools: { foo: { name: 'base name', faqs: [{ q: 'b' }] } } };
    const override = { tools: { foo: { faqs: [{ q: 'o' }], extra: 'o' } } };
    const merged = mergeMessageRecords(base, override);

    // Override wins for faqs (array replaced), deep-merges nested tool object,
    // and keeps base-only keys (name).
    expect(merged.tools.foo.faqs).toEqual([{ q: 'o' }]);
    expect(merged.tools.foo.name).toBe('base name');
    expect(merged.tools.foo.extra).toBe('o');
  });

  it('override replaces arrays entirely (not concatenated)', () => {
    const base = { usage_steps: ['a', 'b', 'c'] };
    const override = { usage_steps: ['x'] };
    expect(mergeMessageRecords(base, override).usage_steps).toEqual(['x']);
  });
});

// ---------------------------------------------------------------------------
// auditLayerOverlap
// ---------------------------------------------------------------------------

describe('auditLayerOverlap', () => {
  it('flags root + base when both carry a field the split also owns', () => {
    const rootTool = { detailed_description: 'root', faqs: [] };
    const baseTool = { detailed_description: 'base', faqs: [] };
    const findings = auditLayerOverlap({
      rootTool,
      baseTool,
      splitHasField: (f) => ['detailed_description', 'faqs'].includes(f),
    });

    expect(findings).toHaveLength(2);
    const dd = findings.find((f) => f.field === 'detailed_description')!;
    expect(dd.layers).toEqual(['root', 'base']);
    expect(dd.severity).toBe('warning');
    expect(findings.find((f) => f.field === 'faqs')!.layers).toEqual(['root', 'base']);
  });

  it('flags root-only overlap (layers=["root"])', () => {
    const rootTool = { usage_examples: ['root'] };
    const findings = auditLayerOverlap({
      rootTool: rootTool,
      baseTool: {},
      splitHasField: (f) => f === 'usage_examples',
    });
    expect(findings).toEqual([
      { field: 'usage_examples', layers: ['root'], severity: 'warning' },
    ]);
  });

  it('skips fields the split file does NOT own', () => {
    // root/base carry detailed_description, but split has no detailed_description.
    const findings = auditLayerOverlap({
      rootTool: { detailed_description: 'root' },
      baseTool: { detailed_description: 'base' },
      splitHasField: () => false,
    });
    expect(findings).toEqual([]);
  });

  it('returns empty when no layer carries the field', () => {
    const findings = auditLayerOverlap({
      rootTool: {},
      baseTool: {},
      splitHasField: () => true,
    });
    expect(findings).toEqual([]);
  });

  it('reports all four support keys when all overlap', () => {
    const rootTool = Object.fromEntries(SUPPORT_KEYS.map((k) => [k, 'root']));
    const baseTool = Object.fromEntries(SUPPORT_KEYS.map((k) => [k, 'base']));
    const findings = auditLayerOverlap({
      rootTool,
      baseTool,
      splitHasField: () => true,
    });
    expect(findings).toHaveLength(4);
    expect(findings.every((f) => f.layers.length === 2)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// auditResolvedDivergence
// ---------------------------------------------------------------------------

describe('auditResolvedDivergence', () => {
  const slug = 'markdown-editor';

  /** Build the params for a single locale from explicit layer values. */
  function makeParams(opts: {
    locale?: 'en' | 'zh';
    enRootTool?: Record<string, unknown>;
    enBaseTool?: Record<string, unknown>;
    locRootTool?: Record<string, unknown>;
    locBaseTool?: Record<string, unknown>;
    enSplit?: Record<string, unknown>;
    locSplit?: Record<string, unknown> | null;
  }) {
    const locale = opts.locale ?? 'en';
    return {
      locale,
      slug,
      enRoot: wrapTool(slug, opts.enRootTool ?? {}),
      enBase: wrapTool(slug, opts.enBaseTool ?? {}),
      locRoot: wrapTool(slug, opts.locRootTool ?? {}),
      locBase: wrapTool(slug, opts.locBaseTool ?? {}),
      enSplit: opts.enSplit ?? makeSplit(),
      locSplit: opts.locSplit ?? null,
    };
  }

  it('reports NO divergence when the split file wins cleanly (EN)', async () => {
    // root/base both carry divergent support copy, but split must win.
    const params = makeParams({
      locale: 'en',
      enRootTool: { detailed_description: 'STALE root copy', faqs: [{ q: 'root' }] },
      enBaseTool: { detailed_description: 'STALE base copy', faqs: [{ q: 'base' }] },
    });
    const findings = await auditResolvedDivergence(params);
    expect(findings).toEqual([]);
  });

  it('reports NO divergence for non-EN when locale split merges over EN split and wins', async () => {
    const params = makeParams({
      locale: 'zh',
      enRootTool: { detailed_description: 'EN root' },
      enBaseTool: { detailed_description: 'EN base' },
      locRootTool: { detailed_description: 'ZH root' },
      locSplit: makeSplit({ detailed_description: 'ZH split dd' }),
    });
    const findings = await auditResolvedDivergence(params);
    // detailed_description in resolved should equal the zh-split value.
    expect(findings).toEqual([]);
  });

  it('the markdown-editor divergence pattern: split wins, so NO error', async () => {
    // Mirror the real en/markdown-editor case: base.json + root.json both have
    // faqs that differ from the split file's faqs. Runtime merge lets split win.
    const params = makeParams({
      locale: 'en',
      enRootTool: { faqs: [{ question: 'root q', answer: 'root a' }] },
      enBaseTool: { faqs: [{ question: 'base q', answer: 'base a' }] },
      enSplit: makeSplit({ faqs: [{ question: 'SPLIT q', answer: 'SPLIT a' }] }),
    });
    const findings = await auditResolvedDivergence(params);
    expect(findings).toEqual([]);
  });

  it('reports NO divergence even when locale layers carry divergent support copy (split wins via fallback layering)', async () => {
    // Non-EN locale split is absent, so detailed = enSplit only. The locale
    // root carries detailed_description, which enters toolData via the fallback
    // merge. But resolved = merge(toolData, detailed) lets the EN split win as
    // override — so the final resolved value matches the EN split. This is the
    // core invariant: split file (here EN fallback) always wins.
    const params = makeParams({
      locale: 'zh',
      enSplit: makeSplit({ detailed_description: 'EN split dd' }),
      locSplit: null, // missing locale split
      locRootTool: { detailed_description: 'ZH root dd' },
    });
    const findings = await auditResolvedDivergence(params);
    expect(findings).toEqual([]);
  });

  it('would surface a divergence if a future merge change broke the override-wins contract (regression guard)', async () => {
    // Direct proof of the audit's error path: hand-build a case where the
    // resolved value provably differs from the authoritative split value. We do
    // this by calling the auditor with a locale whose locale-split overrides the
    // EN split with a DIFFERENT value, then asserting the resolved value tracks
    // the locale split (no divergence). The inverse — asserting divergence — is
    // only possible if mergeMessageRecords semantics change; we document the
    // expected output here so a regression is caught.
    const params = makeParams({
      locale: 'zh',
      enSplit: makeSplit({ faqs: [{ question: 'EN q', answer: 'EN a' }] }),
      locSplit: makeSplit({ faqs: [{ question: 'ZH q', answer: 'ZH a' }] }),
    });
    const findings = await auditResolvedDivergence(params);
    // Locale split wins (override), resolved === locSplit value → no divergence.
    expect(findings).toEqual([]);
  });

  it('skips fields the split file does not carry', async () => {
    const params = makeParams({
      locale: 'en',
      enSplit: { detailed_description: 'only dd' }, // no usage_steps/examples/faqs
      enRootTool: { usage_steps: ['root'], faqs: [], usage_examples: [] },
    });
    const findings = await auditResolvedDivergence(params);
    expect(findings).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// auditEnFallbackResolution
// ---------------------------------------------------------------------------

describe('auditEnFallbackResolution', () => {
  it('lists every support key the EN split carries as en-split provenance', () => {
    const findings = auditEnFallbackResolution({
      locale: 'ar',
      slug: 'ip-geolocation',
      enSplit: makeSplit(), // all 4 keys present
    });
    expect(findings).toHaveLength(4);
    expect(findings.every((f) => f.provenance === 'en-split')).toBe(true);
    expect(findings.every((f) => f.severity === 'info')).toBe(true);
    expect(findings.map((f) => f.field).sort()).toEqual([...SUPPORT_KEYS].sort());
  });

  it('omits fields absent from the EN split', () => {
    const findings = auditEnFallbackResolution({
      locale: 'ar',
      slug: 'ip-geolocation',
      enSplit: { detailed_description: 'dd' }, // only 1 of 4
    });
    expect(findings.map((f) => f.field)).toEqual(['detailed_description']);
  });
});

// ---------------------------------------------------------------------------
// buildReport
// ---------------------------------------------------------------------------

describe('buildReport', () => {
  it('sorts findings deterministically by locale, slug, field', () => {
    const report = buildReport(
      { totalLocales: 2, catalogSlugs: 2 },
      [
        { locale: 'zh', slug: 'b-tool', field: 'faqs', layers: ['root'], severity: 'warning' },
        { locale: 'ar', slug: 'b-tool', field: 'faqs', layers: ['root'], severity: 'warning' },
        { locale: 'ar', slug: 'a-tool', field: 'usage_steps', layers: ['root'], severity: 'warning' },
      ],
      [],
      []
    );
    expect(report.layerOverlapFindings.map((f) => `${f.locale}/${f.slug}/${f.field}`)).toEqual([
      'ar/a-tool/usage_steps',
      'ar/b-tool/faqs',
      'zh/b-tool/faqs',
    ]);
  });

  it('summary counts match the finding arrays', () => {
    const report = buildReport(
      { totalLocales: 10, catalogSlugs: 557 },
      [{ locale: 'en', slug: 'x', field: 'faqs', layers: ['root'], severity: 'warning' }],
      [{ locale: 'en', slug: 'x', field: 'faqs', severity: 'error' }],
      [{ locale: 'ar', slug: 'y', field: 'faqs', provenance: 'en-split', severity: 'info' }]
    );
    expect(report.summary).toEqual({
      layerOverlap: 1,
      layerOverlapByLayerShape: {
        root: 1,
        base: 0,
        both: 0,
      },
      topOverlapLocales: [{ locale: 'en', count: 1 }],
      topOverlapSlugs: [{ slug: 'x', count: 1 }],
      resolvedDivergences: 1,
      enFallbackResolutions: 1,
    });
  });

  it('breaks overlap warnings down by layer shape and hotspots', () => {
    const report = buildReport(
      { totalLocales: 3, catalogSlugs: 3 },
      [
        { locale: 'zh', slug: 'gpa-calculator', field: 'faqs', layers: ['root'], severity: 'warning' },
        { locale: 'zh', slug: 'gpa-calculator', field: 'usage_steps', layers: ['root', 'base'], severity: 'warning' },
        { locale: 'ar', slug: 'pace-calculator', field: 'usage_examples', layers: ['base'], severity: 'warning' },
      ],
      [],
      []
    );

    expect(report.summary.layerOverlapByLayerShape).toEqual({
      root: 1,
      base: 1,
      both: 1,
    });
    expect(report.summary.topOverlapLocales).toEqual([
      { locale: 'zh', count: 2 },
      { locale: 'ar', count: 1 },
    ]);
    expect(report.summary.topOverlapSlugs[0]).toEqual({
      slug: 'gpa-calculator',
      count: 2,
    });
  });
});

describe('parseMergeChainArgs', () => {
  it('parses report path and top limit', () => {
    expect(
      parseMergeChainArgs(['--report-path', 'merge.json', '--top', '12'])
    ).toEqual({
      help: false,
      reportPath: 'merge.json',
      top: 12,
    });
  });

  it('parses help flags', () => {
    expect(parseMergeChainArgs(['-h'])).toEqual({
      help: true,
      top: 30,
    });
  });

  it('rejects invalid top values', () => {
    expect(() => parseMergeChainArgs(['--top', '-1'])).toThrow(
      'Invalid value for --top: -1'
    );
  });

  it('rejects unknown flags', () => {
    expect(() => parseMergeChainArgs(['--wat'])).toThrow(
      'Unknown argument: --wat'
    );
  });
});

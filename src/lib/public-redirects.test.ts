import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { locales } from './i18n';
import {
  explainUnwinnable,
  fastPathRules,
  firstDynamicLine,
  isDynamicSource,
  parseRedirects,
  resolveRule,
  ruleMatches,
} from './public-redirects';

const redirectsPath = path.resolve(process.cwd(), 'public/_redirects');
const rules = parseRedirects(fs.readFileSync(redirectsPath, 'utf8'));

describe('_redirects matcher', () => {
  it('treats :param as a single segment and * as one or more', () => {
    expect(ruleMatches('/:locale/tools/:tool', '/en/tools/base64')).toBe(true);
    expect(ruleMatches('/:locale/tools/:tool', '/en/tools/ranking/popular')).toBe(false);
    expect(ruleMatches('/tools/ranking/*', '/tools/ranking/newest')).toBe(true);
    expect(ruleMatches('/tools/ranking/*', '/tools/ranking')).toBe(false);
    expect(ruleMatches('/tools/ranking/*', '/tools/ranking/')).toBe(false);
  });

  it('classifies placeholder and splat sources as dynamic', () => {
    expect(isDynamicSource('/tools/ranking')).toBe(false);
    expect(isDynamicSource('/:locale/tools/ranking')).toBe(true);
    expect(isDynamicSource('/tools/ranking/*')).toBe(true);
  });
});

describe('deprecated ranking routes resolve in one hop', () => {
  // Cloudflare applies _redirects before the Worker. If the winning rule only
  // appends a trailing slash or a locale prefix, the Worker still has to issue a
  // second redirect to reach the real target — a 2-hop chain that wastes crawl
  // budget. Each of these must land on its final destination directly.
  //
  // A previous attempt declared these as `/:locale/tools/ranking` immediately
  // above `/:locale/tools/:tool` and shipped green, but never fired in
  // production: only a static rule above the first dynamic rule wins. Hence both
  // the per-locale expansion and the placement assertion below.
  const bareForms = [
    '/tools/ranking',
    '/tools/ranking/',
    ...locales.flatMap((locale) => [`/${locale}/tools/ranking`, `/${locale}/tools/ranking/`]),
  ];

  for (const rankingPath of bareForms) {
    it(`${rankingPath} redirects straight to a tools index`, () => {
      const rule = resolveRule(rules, rankingPath);
      expect(rule, `no _redirects rule matches ${rankingPath}`).not.toBeNull();
      expect(rule?.destination).toMatch(/^\/[a-z]{2}\/tools\/$/);
    });

    it(`${rankingPath} is placed where it actually wins`, () => {
      expect(explainUnwinnable(rules, rankingPath)).toBeNull();
    });
  }

  // Sub-paths keep resolving via the splat / explicit dynamic rules; nothing
  // narrower competes with them, so their placement is unconstrained.
  const subPaths = ['/tools/ranking/newest', '/en/tools/ranking/newest', '/ar/tools/ranking/popular'];

  for (const rankingPath of subPaths) {
    it(`${rankingPath} redirects straight to a tools index`, () => {
      const rule = resolveRule(rules, rankingPath);
      expect(rule, `no _redirects rule matches ${rankingPath}`).not.toBeNull();
      expect(rule?.destination).toMatch(/^\/(?::locale|[a-z]{2})\/tools\/$/);
    });
  }
});

describe('_redirects ordering invariants', () => {
  it('keeps every contested static rule in the winning fast path', () => {
    // The defect class this guards: a static rule that another rule also matches
    // with a different destination, placed below the first dynamic rule. Such a
    // rule parses fine, reads as if it takes precedence, and never fires.
    const boundary = firstDynamicLine(rules);
    const unwinnable = rules
      .filter((rule) => !isDynamicSource(rule.source) && rule.line > boundary)
      .map((rule) => explainUnwinnable(rules, rule.source))
      .filter((reason): reason is string => reason !== null);

    expect(unwinnable).toEqual([]);
  });

  it('declares the fast path as a contiguous block before any dynamic rule', () => {
    const boundary = firstDynamicLine(rules);
    const fastPath = fastPathRules(rules);

    expect(fastPath.length).toBeGreaterThan(0);
    expect(Math.max(...fastPath.map((rule) => rule.line))).toBeLessThan(boundary);
    expect(fastPath.every((rule) => !isDynamicSource(rule.source))).toBe(true);
  });

  it('stays within Cloudflare per-file limits', () => {
    const dynamic = rules.filter((rule) => isDynamicSource(rule.source));
    const staticRules = rules.filter((rule) => !isDynamicSource(rule.source));

    expect(dynamic.length).toBeLessThanOrEqual(100);
    expect(staticRules.length).toBeLessThanOrEqual(2000);
    for (const rule of rules) {
      expect(`${rule.source} ${rule.destination}`.length).toBeLessThanOrEqual(1000);
    }
  });

  it('parses every non-comment line into a rule with a valid status', () => {
    expect(rules.length).toBeGreaterThan(100);
    for (const rule of rules) {
      expect(rule.source.startsWith('/'), `line ${rule.line}: source must be absolute`).toBe(true);
      expect([301, 302, 307, 308]).toContain(rule.status);
    }
  });
});

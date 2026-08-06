import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { parseRedirects, resolveRule, ruleMatches } from './public-redirects';

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
});

describe('deprecated ranking routes resolve in one hop', () => {
  // Cloudflare applies _redirects before the Worker. If the winning rule only
  // appends a trailing slash or a locale prefix, the Worker still has to issue
  // a second redirect to reach the real target — a 2-hop chain that wastes
  // crawl budget. Each of these must land on its final destination directly.
  const rankingPaths = [
    '/tools/ranking',
    '/tools/ranking/',
    '/tools/ranking/newest',
    '/en/tools/ranking',
    '/en/tools/ranking/',
    '/zh/tools/ranking',
    '/ar/tools/ranking/popular',
  ];

  for (const rankingPath of rankingPaths) {
    it(`${rankingPath} redirects straight to a tools index`, () => {
      const rule = resolveRule(rules, rankingPath);
      expect(rule, `no _redirects rule matches ${rankingPath}`).not.toBeNull();
      // Destination must be a tools index, never another /tools/ranking form.
      expect(rule?.destination).toMatch(/^\/(?::locale|[a-z]{2})\/tools\/$/);
    });
  }
});

describe('_redirects ordering invariants', () => {
  it('never lets a broader earlier rule shadow a more specific later one', () => {
    // The defect class this guards: a literal rule placed after a :param or *
    // rule that already matches the same path never fires.
    const shadowed: string[] = [];

    rules.forEach((rule, index) => {
      const hasWildcard = /(?:^|\/)(?::[^/]+|\*)(?:\/|$)/.test(rule.source);
      if (hasWildcard) {
        return;
      }

      // A literal source is a concrete path; find any earlier rule matching it.
      const earlier = rules.slice(0, index).find((candidate) => ruleMatches(candidate.source, rule.source));
      if (earlier && earlier.destination !== rule.destination) {
        shadowed.push(
          `line ${rule.line} (${rule.source} -> ${rule.destination}) is shadowed by ` +
            `line ${earlier.line} (${earlier.source} -> ${earlier.destination})`
        );
      }
    });

    expect(shadowed).toEqual([]);
  });

  it('parses every non-comment line into a rule with a valid status', () => {
    expect(rules.length).toBeGreaterThan(100);
    for (const rule of rules) {
      expect(rule.source.startsWith('/'), `line ${rule.line}: source must be absolute`).toBe(true);
      expect([301, 302, 307, 308]).toContain(rule.status);
    }
  });
});

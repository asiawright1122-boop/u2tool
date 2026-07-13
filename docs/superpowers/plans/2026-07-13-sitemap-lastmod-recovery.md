# Sitemap Lastmod Recovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish accurate URL-level sitemap `lastmod` signals for the July recovery cohort, deploy them independently from uncommitted content work, resubmit the sitemap in Google Search Console, and establish clean 7-day and 14-day monitoring checkpoints.

**Architecture:** Replace the four-date generated manifest with a source-controlled JSON release manifest containing `pages`, `ai`, and `tools` fallback dates plus canonical-path overrides. A typed resolver validates and resolves dates, sitemap builders carry resolved dates through entry metadata so the sitemap index derives exact child dates, and a guarded CLI adds approved release URLs without mass-refreshing unchanged pages.

**Tech Stack:** Astro 6, TypeScript, Vitest, Node.js 22+, Cloudflare Workers/Wrangler, Google Search Console.

## Global Constraints

- Work only in `/Users/kaka/Dev/u2tool/.worktrees/sitemap-lastmod-recovery` on branch `codex/sitemap-lastmod-recovery`.
- Do not copy, stage, or modify the 44 uncommitted SEO content files in `/Users/kaka/Dev/u2tool`.
- Do not change tool copy, metadata, internal links, or runtime behavior in this release.
- Do not mark all 5,700 tool URLs with the deployment date.
- Use actual material-change dates: P1 recovery URLs use `2026-07-05`; Gantt uses `2026-07-01`; the broad AI discovery bucket uses `2026-07-08`; unchanged tool and ordinary-page fallbacks remain `2026-06-02`.
- Do not repeat broad URL Inspection requests; only resubmit `https://www.u2tool.com/sitemap.xml` after production verification succeeds.
- Preserve canonical URL, hreflang, priority, change-frequency, and sitemap URL-count behavior.
- Run each task with a red-green-refactor test cycle and commit each independently testable deliverable.

---

## File Map

- `src/config/sitemap-lastmod.json` — human-auditable fallback dates and canonical-path overrides.
- `src/lib/sitemap-lastmod.ts` — typed manifest validation, path normalization, resolution, and date aggregation.
- `src/lib/sitemap-lastmod.test.ts` — resolver and manifest regression tests.
- `src/lib/sitemap-utils.ts` — XML entry builders that preserve resolved `lastmod` metadata.
- `src/lib/sitemap-utils.test.ts` — XML and child-date tests.
- `src/lib/sitemap-entry-builders.ts` — pure builders shared by child sitemap routes and the sitemap index.
- `src/lib/sitemap-entry-builders.test.ts` — route-family bucket and date aggregation tests.
- `src/pages/sitemap-tools.xml.ts` — tool entries using the `tools` bucket.
- `src/pages/sitemap-pages.xml.ts` — ordinary and AI entries using their matching buckets.
- `src/pages/sitemap-priority.xml.ts` — priority entries with per-path bucket resolution.
- `src/pages/sitemap.xml.ts` — index entries derived from actual child entry dates.
- `scripts/seo/update-sitemap-lastmod.ts` — guarded release-manifest updater.
- `scripts/seo/update-sitemap-lastmod.test.ts` — CLI parsing and mutation tests.
- `scripts/validation/validate-technical-seo.ts` — validity/future-date checks without forcing unchanged pages to appear recently modified.
- `scripts/validation/validate-search-engine-compliance.ts` — live path-to-date and child-index consistency checks.
- `.github/workflows/deploy-cloudflare.yml` — deploy code changes while ignoring docs-only evidence commits.
- `scripts/validation/deploy-workflow-contract.test.ts` — workflow regression guard.
- `package.json` — CLI command wiring.
- `docs/GSC_SITEMAP_LASTMOD_RECOVERY_2026-07-13.md` — deployment, GSC acceptance, and monitoring record.
- Delete `src/generated/sitemap-lastmod.ts` after every import has moved to the new resolver.

---

### Task 1: Typed Release Manifest and Resolver

**Files:**
- Create: `src/config/sitemap-lastmod.json`
- Create: `src/lib/sitemap-lastmod.ts`
- Create: `src/lib/sitemap-lastmod.test.ts`

**Interfaces:**
- Produces: `SitemapLastmodBucket`, `SitemapLastmodManifest`, `normalizeSitemapPath()`, `validateSitemapLastmodManifest()`, `resolveSitemapLastmod()`, and `maxLastmod()`.
- Consumes: supported locales from `src/lib/i18n.ts` and discoverable tool slugs from `src/lib/seo-discovery.ts`.

- [ ] **Step 1: Create the initial manifest with conservative fallbacks**

Create `src/config/sitemap-lastmod.json`:

```json
{
  "buckets": {
    "pages": "2026-06-02",
    "ai": "2026-07-08",
    "tools": "2026-06-02"
  },
  "overrides": {
    "/en/tools/gantt-chart-generator/": "2026-07-01"
  }
}
```

- [ ] **Step 2: Write failing resolver tests**

Create `src/lib/sitemap-lastmod.test.ts` with these exact behaviors:

```ts
import { describe, expect, it } from 'vitest';
import {
  maxLastmod,
  normalizeSitemapPath,
  resolveSitemapLastmod,
  validateSitemapLastmodManifest,
  type SitemapLastmodManifest,
} from './sitemap-lastmod';

const manifest: SitemapLastmodManifest = {
  buckets: {
    pages: '2026-06-02',
    ai: '2026-07-08',
    tools: '2026-06-02',
  },
  overrides: {
    '/en/tools/gantt-chart-generator/': '2026-07-01',
    '/en/tools/sql-query-optimizer/': '2026-07-05',
  },
};

describe('sitemap lastmod resolver', () => {
  it('normalizes canonical URLs, queries, fragments, and missing slashes', () => {
    expect(normalizeSitemapPath('https://www.u2tool.com/en/tools/sql-query-optimizer?x=1#top'))
      .toBe('/en/tools/sql-query-optimizer/');
  });

  it('prefers an exact override over the bucket fallback', () => {
    expect(resolveSitemapLastmod('/en/tools/sql-query-optimizer/', 'tools', manifest))
      .toBe('2026-07-05');
  });

  it('keeps unchanged tools on the tools fallback', () => {
    expect(resolveSitemapLastmod('/en/tools/uuid-generator/', 'tools', manifest))
      .toBe('2026-06-02');
  });

  it('returns the newest valid date', () => {
    expect(maxLastmod(['2026-06-02', '2026-07-05', '2026-07-01']))
      .toBe('2026-07-05');
  });

  it('rejects future dates deterministically', () => {
    expect(() => validateSitemapLastmodManifest({
      ...manifest,
      overrides: { '/en/tools/uuid-generator/': '2026-07-14' },
    }, '2026-07-13')).toThrow('future lastmod');
  });

  it('rejects unsupported locales and unknown tool slugs', () => {
    expect(() => validateSitemapLastmodManifest({
      ...manifest,
      overrides: { '/it/tools/uuid-generator/': '2026-07-05' },
    }, '2026-07-13')).toThrow('unsupported locale');

    expect(() => validateSitemapLastmodManifest({
      ...manifest,
      overrides: { '/en/tools/not-a-real-tool/': '2026-07-05' },
    }, '2026-07-13')).toThrow('unknown tool slug');
  });
});
```

- [ ] **Step 3: Run the test and confirm the red state**

Run:

```bash
npx vitest run src/lib/sitemap-lastmod.test.ts
```

Expected: FAIL because `src/lib/sitemap-lastmod.ts` does not exist.

- [ ] **Step 4: Implement the typed resolver**

Create `src/lib/sitemap-lastmod.ts` with this public structure:

```ts
import manifestJson from '@/config/sitemap-lastmod.json';
import { locales } from '@/lib/i18n';
import { getDiscoverableTools } from '@/lib/seo-discovery';

export type SitemapLastmodBucket = 'pages' | 'ai' | 'tools';

export interface SitemapLastmodManifest {
  buckets: Record<SitemapLastmodBucket, string>;
  overrides: Record<string, string>;
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const SUPPORTED_LOCALES = new Set<string>(locales);
const DISCOVERABLE_TOOL_SLUGS = new Set(getDiscoverableTools().map((tool) => tool.slug));

function assertDate(value: string, label: string, today: string): void {
  const parsed = new Date(`${value}T00:00:00Z`);
  if (!DATE_PATTERN.test(value) || Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) {
    throw new Error(`${label}: invalid lastmod "${value}"`);
  }
  if (value > today) {
    throw new Error(`${label}: future lastmod "${value}"`);
  }
}

export function normalizeSitemapPath(input: string): string {
  const trimmed = input.trim();
  const parsed = trimmed.startsWith('http://') || trimmed.startsWith('https://')
    ? new URL(trimmed)
    : new URL(trimmed.startsWith('/') ? trimmed : `/${trimmed}`, 'https://www.u2tool.com');
  const pathname = parsed.pathname.replace(/\/{2,}/g, '/');
  return pathname === '/' ? '/' : `${pathname.replace(/\/+$/, '')}/`;
}

export function validateSitemapLastmodManifest(
  input: SitemapLastmodManifest,
  today = new Date().toISOString().slice(0, 10)
): SitemapLastmodManifest {
  for (const bucket of ['pages', 'ai', 'tools'] as const) {
    assertDate(input.buckets[bucket], `bucket ${bucket}`, today);
  }

  for (const [rawPath, lastmod] of Object.entries(input.overrides)) {
    const path = normalizeSitemapPath(rawPath);
    if (path !== rawPath) {
      throw new Error(`non-canonical override path "${rawPath}"`);
    }

    const segments = path.split('/').filter(Boolean);
    const locale = segments[0] || '';
    if (!SUPPORTED_LOCALES.has(locale)) {
      throw new Error(`unsupported locale "${locale}" in ${path}`);
    }

    if (segments[1] === 'tools') {
      const slug = segments[2] || '';
      if (segments.length !== 3 || !DISCOVERABLE_TOOL_SLUGS.has(slug)) {
        throw new Error(`unknown tool slug "${slug}" in ${path}`);
      }
    }

    assertDate(lastmod, `override ${path}`, today);
  }

  return input;
}

export const sitemapLastmodManifest = validateSitemapLastmodManifest(
  manifestJson as SitemapLastmodManifest
);

export function resolveSitemapLastmod(
  path: string,
  bucket: SitemapLastmodBucket,
  manifest: SitemapLastmodManifest = sitemapLastmodManifest
): string {
  const normalized = normalizeSitemapPath(path);
  return manifest.overrides[normalized] || manifest.buckets[bucket];
}

export function maxLastmod(values: readonly string[]): string {
  if (values.length === 0) {
    throw new Error('Cannot calculate max lastmod from an empty list');
  }
  return [...values].sort().at(-1)!;
}
```

- [ ] **Step 5: Run resolver tests and type checking**

Run:

```bash
npx vitest run src/lib/sitemap-lastmod.test.ts
npm run check
```

Expected: resolver tests PASS; Astro check reports 0 errors.

- [ ] **Step 6: Commit the core manifest**

```bash
git add src/config/sitemap-lastmod.json src/lib/sitemap-lastmod.ts src/lib/sitemap-lastmod.test.ts
git commit -m "feat(seo): add typed sitemap lastmod manifest"
```

---

### Task 2: Carry Resolved Dates Through Sitemap Entries

**Files:**
- Modify: `src/lib/sitemap-utils.ts`
- Create: `src/lib/sitemap-utils.test.ts`
- Create: `src/lib/sitemap-entry-builders.ts`
- Create: `src/lib/sitemap-entry-builders.test.ts`
- Modify: `src/pages/sitemap-tools.xml.ts`
- Modify: `src/pages/sitemap-pages.xml.ts`
- Modify: `src/pages/sitemap-priority.xml.ts`
- Modify: `src/pages/sitemap.xml.ts`
- Delete: `src/generated/sitemap-lastmod.ts`

**Interfaces:**
- Consumes: `resolveSitemapLastmod()` and `maxLastmod()` from Task 1.
- Produces: `SitemapUrlEntry`, `buildUrl()`, `buildUrlForLocales()`, `newestEntryLastmod()`, and pure `buildToolsSitemapEntries()`, `buildPagesSitemapEntries()`, and `buildPrioritySitemapEntries()` functions in `src/lib/sitemap-entry-builders.ts`.

- [ ] **Step 1: Write failing sitemap-entry tests**

Create `src/lib/sitemap-utils.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { buildUrl, newestEntryLastmod } from './sitemap-utils';

describe('sitemap URL entries', () => {
  it('embeds an override date and retains it as entry metadata', () => {
    const entry = buildUrl(
      '/en/tools/gantt-chart-generator/',
      '0.9',
      'daily',
      'tools'
    );

    expect(entry.lastmod).toBe('2026-07-01');
    expect(entry.xml).toContain('<lastmod>2026-07-01</lastmod>');
  });

  it('keeps an unchanged control URL on the bucket fallback', () => {
    const entry = buildUrl('/en/tools/uuid-generator/', '0.7', 'weekly', 'tools');
    expect(entry.lastmod).toBe('2026-06-02');
  });

  it('derives the newest represented child date from entries', () => {
    const entries = [
      buildUrl('/en/tools/uuid-generator/', '0.7', 'weekly', 'tools'),
      buildUrl('/en/tools/gantt-chart-generator/', '0.9', 'daily', 'tools'),
    ];
    expect(newestEntryLastmod(entries)).toBe('2026-07-01');
  });
});
```

- [ ] **Step 2: Run the test and confirm the API mismatch**

Run:

```bash
npx vitest run src/lib/sitemap-utils.test.ts
```

Expected: FAIL because `buildUrl()` returns a string and accepts a raw date.

- [ ] **Step 3: Refactor sitemap utilities to typed entries**

Change `src/lib/sitemap-utils.ts` to expose:

```ts
import { maxLastmod, resolveSitemapLastmod, type SitemapLastmodBucket } from '@/lib/sitemap-lastmod';

export interface SitemapUrlEntry {
  path: string;
  lastmod: string;
  xml: string;
}

export function buildUrl(
  path: string,
  priority: string,
  changefreq: string,
  bucket: SitemapLastmodBucket
): SitemapUrlEntry {
  const lastmod = resolveSitemapLastmod(path, bucket);
  return {
    path,
    lastmod,
    xml: renderUrlXml(path, priority, changefreq, lastmod, allLocales),
  };
}

export function buildUrlForLocales(
  path: string,
  priority: string,
  changefreq: string,
  publishedLocales: readonly Locale[],
  bucket: SitemapLastmodBucket
): SitemapUrlEntry {
  const lastmod = resolveSitemapLastmod(path, bucket);
  return {
    path,
    lastmod,
    xml: renderUrlXml(path, priority, changefreq, lastmod, publishedLocales),
  };
}

export function newestEntryLastmod(entries: readonly SitemapUrlEntry[]): string {
  return maxLastmod(entries.map((entry) => entry.lastmod));
}

export function generateSitemapResponse(entries: SitemapUrlEntry[]): Response {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.map((entry) => entry.xml).join('\n')}
</urlset>`;
  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
```

Keep the existing XML escaping, localized URL construction, and hreflang rendering in a private `renderUrlXml()` helper. Keep `buildSitemapIndexEntry(path, lastmod)` returning XML text.

- [ ] **Step 4: Move route-family construction into one pure builder module**

Create `src/lib/sitemap-entry-builders.ts`. Move the existing loops and imports from the three child route files into this module. Use this exact pattern for the tool family:

```ts
export function buildToolsSitemapEntries() {
  const entries = [];
  for (const locale of locales) {
    for (const tool of getDiscoverableTools()) {
      entries.push(buildUrl(`/${locale}/tools/${tool.slug}`, '0.7', 'weekly', 'tools'));
    }
  }
  return entries;
}
```

Implement in the same module:

- `buildPagesSitemapEntries()` using `pages` for ordinary paths and `ai` for AI paths;
- `buildPrioritySitemapEntries()` using `pages`, `ai`, and `tools` according to each route family.

Change every `buildUrlForLocales(..., sitemapLastmodManifest.ai)` call to `buildUrlForLocales(..., 'ai')`.

Create `src/lib/sitemap-entry-builders.test.ts` with assertions that:

```ts
import { describe, expect, it } from 'vitest';
import {
  buildPagesSitemapEntries,
  buildPrioritySitemapEntries,
  buildToolsSitemapEntries,
} from './sitemap-entry-builders';
import { newestEntryLastmod } from './sitemap-utils';

describe('sitemap entry builders', () => {
  it('publishes all discoverable localized tool URLs', () => {
    const entries = buildToolsSitemapEntries();
    expect(entries.length).toBeGreaterThanOrEqual(5_000);
    expect(entries.some((entry) => entry.path === '/en/tools/gantt-chart-generator/')).toBe(true);
  });

  it('keeps AI and ordinary page buckets distinct', () => {
    const entries = buildPagesSitemapEntries();
    expect(entries.find((entry) => entry.path === '/en/ai/')?.lastmod).toBe('2026-07-08');
    expect(entries.find((entry) => entry.path === '/en/')?.lastmod).toBe('2026-06-02');
  });

  it('derives the priority child date from the represented entries', () => {
    expect(newestEntryLastmod(buildPrioritySitemapEntries())).toBe('2026-07-08');
  });
});
```

- [ ] **Step 5: Make child sitemap routes thin adapters**

Each child route imports its matching pure builder. For example, `src/pages/sitemap-tools.xml.ts` becomes:

```ts
import type { APIRoute } from 'astro';
import { buildToolsSitemapEntries } from '@/lib/sitemap-entry-builders';
import { generateSitemapResponse } from '@/lib/sitemap-utils';

export const prerender = true;
export const GET: APIRoute = () => generateSitemapResponse(buildToolsSitemapEntries());
```

- [ ] **Step 6: Derive sitemap-index dates from actual child entries**

Change `src/pages/sitemap.xml.ts` to:

```ts
import type { APIRoute } from 'astro';
import {
  buildPagesSitemapEntries,
  buildPrioritySitemapEntries,
  buildToolsSitemapEntries,
} from '@/lib/sitemap-entry-builders';
import {
  buildSitemapIndexEntry,
  generateSitemapIndexResponse,
  newestEntryLastmod,
} from '@/lib/sitemap-utils';

export const prerender = true;

export const GET: APIRoute = () => {
  const priorityEntries = buildPrioritySitemapEntries();
  const pageEntries = buildPagesSitemapEntries();
  const toolEntries = buildToolsSitemapEntries();

  return generateSitemapIndexResponse([
    buildSitemapIndexEntry('/sitemap-priority.xml', newestEntryLastmod(priorityEntries)),
    buildSitemapIndexEntry('/sitemap-pages.xml', newestEntryLastmod(pageEntries)),
    buildSitemapIndexEntry('/sitemap-tools.xml', newestEntryLastmod(toolEntries)),
  ]);
};
```

- [ ] **Step 7: Remove the stale generated manifest**

Delete `src/generated/sitemap-lastmod.ts` after confirming:

```bash
rg -n "generated/sitemap-lastmod|sitemapLastmodManifest|SITEMAP_LASTMOD" src scripts
```

Expected: no imports of the deleted file and no global `SITEMAP_LASTMOD` fallback.

- [ ] **Step 8: Run the focused test and build**

```bash
npx vitest run src/lib/sitemap-lastmod.test.ts src/lib/sitemap-utils.test.ts src/lib/sitemap-entry-builders.test.ts
npm run check
npm run build
```

Expected: all tests PASS, Astro check has 0 errors, build exits 0.

- [ ] **Step 9: Inspect generated sitemap dates**

```bash
rg -n -A2 -B1 "gantt-chart-generator|uuid-generator" dist/client/sitemap-tools.xml
sed -n '1,40p' dist/client/sitemap.xml
```

Expected:

- Gantt entry contains `2026-07-01`;
- UUID Generator contains `2026-06-02`;
- tools child entry in `sitemap.xml` contains `2026-07-01` before P1 overrides are imported.

- [ ] **Step 10: Commit sitemap integration**

```bash
git add src/lib/sitemap-utils.ts src/lib/sitemap-utils.test.ts src/lib/sitemap-entry-builders.ts src/lib/sitemap-entry-builders.test.ts src/pages/sitemap-tools.xml.ts src/pages/sitemap-pages.xml.ts src/pages/sitemap-priority.xml.ts src/pages/sitemap.xml.ts src/generated/sitemap-lastmod.ts
git commit -m "refactor(seo): resolve sitemap dates per URL"
```

---

### Task 3: Guarded Manifest Update CLI

**Files:**
- Create: `scripts/seo/update-sitemap-lastmod.ts`
- Create: `scripts/seo/update-sitemap-lastmod.test.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: `SitemapLastmodManifest`, `normalizeSitemapPath()`, and `validateSitemapLastmodManifest()`.
- Produces: `parseArgs()`, `extractInputUrls()`, `canonicalizeRecoveryUrl()`, `updateManifest()`, and CLI command `seo:sitemap-lastmod:update`.

- [ ] **Step 1: Write failing CLI tests**

Create `scripts/seo/update-sitemap-lastmod.test.ts` covering:

```ts
import { describe, expect, it } from 'vitest';
import {
  canonicalizeRecoveryUrl,
  parseArgs,
  updateManifest,
} from './update-sitemap-lastmod';

const baseManifest = {
  buckets: { pages: '2026-06-02', ai: '2026-07-08', tools: '2026-06-02' },
  overrides: { '/en/tools/gantt-chart-generator/': '2026-07-01' },
};

describe('sitemap lastmod updater', () => {
  it('parses write, exclusion, and safety options', () => {
    expect(parseArgs([
      '--url-list', 'urls.txt',
      '--date', '2026-07-05',
      '--exclude-url', 'https://www.u2tool.com/en/tools/gantt-chart-generator/',
      '--write',
    ])).toMatchObject({
      urlList: 'urls.txt',
      date: '2026-07-05',
      excludeUrls: ['https://www.u2tool.com/en/tools/gantt-chart-generator/'],
      write: true,
    });
  });

  it('rejects non-production hosts', () => {
    expect(() => canonicalizeRecoveryUrl('https://example.com/en/tools/uuid-generator/'))
      .toThrow('u2tool.com');
  });

  it('adds canonical paths in sorted order', () => {
    const result = updateManifest(
      baseManifest,
      [
        'https://www.u2tool.com/zh/tools/uuid-generator/',
        'https://www.u2tool.com/en/tools/uuid-generator/',
      ],
      '2026-07-05',
      { today: '2026-07-13', maxBatchSize: 200 }
    );

    expect(Object.keys(result.manifest.overrides)).toEqual([
      '/en/tools/gantt-chart-generator/',
      '/en/tools/uuid-generator/',
      '/zh/tools/uuid-generator/',
    ]);
  });

  it('retains a newer existing date instead of regressing it', () => {
    const result = updateManifest(
      { ...baseManifest, overrides: { '/en/tools/uuid-generator/': '2026-07-08' } },
      ['https://www.u2tool.com/en/tools/uuid-generator/'],
      '2026-07-05',
      { today: '2026-07-13', maxBatchSize: 200 }
    );
    expect(result.manifest.overrides['/en/tools/uuid-generator/']).toBe('2026-07-08');
    expect(result.retained).toContain('/en/tools/uuid-generator/');
  });

  it('blocks batches over 200 URLs without explicit approval', () => {
    const urls = Array.from({ length: 201 }, (_, index) =>
      `https://www.u2tool.com/en/tools/tool-${index}/`
    );
    expect(() => updateManifest(baseManifest, urls, '2026-07-05', {
      today: '2026-07-13',
      maxBatchSize: 200,
    })).toThrow('exceeds safety threshold');
  });
});
```

Use known discoverable slugs for any test that reaches full manifest validation; the 201-row threshold test must assert the threshold before slug validation.

- [ ] **Step 2: Run the test and confirm red state**

```bash
npx vitest run scripts/seo/update-sitemap-lastmod.test.ts
```

Expected: FAIL because the updater does not exist.

- [ ] **Step 3: Implement the updater**

Create `scripts/seo/update-sitemap-lastmod.ts` with these public types and functions:

```ts
interface Args {
  allowLargeBatch: boolean;
  date?: string;
  excludeUrls: string[];
  manifest?: string;
  monitoringJson?: string;
  urlList?: string;
  write: boolean;
}

interface UpdateOptions {
  maxBatchSize: number;
  today: string;
  allowLargeBatch?: boolean;
  excludeUrls?: readonly string[];
}

interface UpdateResult {
  added: string[];
  retained: string[];
  manifest: SitemapLastmodManifest;
}
```

Required behavior:

```ts
export function canonicalizeRecoveryUrl(input: string): string {
  const url = new URL(input.trim());
  if (url.protocol !== 'https:' || url.hostname !== 'www.u2tool.com') {
    throw new Error(`Recovery URL must use https://www.u2tool.com: ${input}`);
  }
  return normalizeSitemapPath(url.toString());
}

export function updateManifest(
  current: SitemapLastmodManifest,
  rawUrls: readonly string[],
  releaseDate: string,
  options: UpdateOptions
): UpdateResult {
  const excluded = new Set((options.excludeUrls || []).map(canonicalizeRecoveryUrl));
  const paths = [...new Set(rawUrls.map(canonicalizeRecoveryUrl))]
    .filter((path) => !excluded.has(path))
    .sort();

  if (paths.length > options.maxBatchSize && !options.allowLargeBatch) {
    throw new Error(`Batch size ${paths.length} exceeds safety threshold ${options.maxBatchSize}`);
  }

  const nextOverrides = { ...current.overrides };
  const added: string[] = [];
  const retained: string[] = [];

  for (const path of paths) {
    const existing = nextOverrides[path];
    if (existing && existing >= releaseDate) {
      retained.push(path);
      continue;
    }
    nextOverrides[path] = releaseDate;
    added.push(path);
  }

  const manifest = validateSitemapLastmodManifest({
    buckets: current.buckets,
    overrides: Object.fromEntries(Object.entries(nextOverrides).sort(([a], [b]) => a.localeCompare(b))),
  }, options.today);

  return { added, retained, manifest };
}
```

`main()` must:

1. require exactly one of `--url-list` or `--monitoring-json`;
2. require `--date`;
3. read the committed manifest by default;
4. run dry by default and print additions/retained counts plus JSON;
5. write only when `--write` is present;
6. write atomically through a temporary file followed by `fs.renameSync()`;
7. exit non-zero on any invalid row before changing the manifest.

- [ ] **Step 4: Wire the npm command**

Add to `package.json`:

```json
"seo:sitemap-lastmod:update": "node --import tsx/esm scripts/seo/update-sitemap-lastmod.ts"
```

- [ ] **Step 5: Run tests and a dry-run fixture**

```bash
npx vitest run scripts/seo/update-sitemap-lastmod.test.ts src/lib/sitemap-lastmod.test.ts
npm run seo:sitemap-lastmod:update -- \
  --url-list exports/seo/gsc-p1-post-deploy-monitoring/2026-07-05/p1-monitoring-urls.txt \
  --date 2026-07-05 \
  --exclude-url https://www.u2tool.com/en/tools/gantt-chart-generator/
```

Before the dry run, generate the ignored monitoring list with:

```bash
npm run report:gsc-p1-post-deploy-monitoring
```

Expected: updater reports the P1 additions without changing `src/config/sitemap-lastmod.json`.

- [ ] **Step 6: Commit the CLI**

```bash
git add scripts/seo/update-sitemap-lastmod.ts scripts/seo/update-sitemap-lastmod.test.ts package.json package-lock.json
git commit -m "feat(seo): add guarded sitemap lastmod updater"
```

---

### Task 4: Import the Recovery Cohort and Harden Validation

**Files:**
- Modify: `src/config/sitemap-lastmod.json`
- Modify: `scripts/validation/validate-technical-seo.ts`
- Modify: `scripts/validation/validate-search-engine-compliance.ts`
- Create: `scripts/validation/sitemap-lastmod-xml.ts`
- Create: `scripts/validation/sitemap-lastmod-xml.test.ts`

**Interfaces:**
- Consumes: committed recovery manifest and generated/live sitemap XML.
- Produces: `extractUrlLastmods()`, `extractSitemapIndexLastmods()`, `assertValidLastmods()`, and `assertExpectedLastmod()`.

- [ ] **Step 1: Import the 2026-07-05 cohort with Gantt excluded**

Generate the list, review dry-run output, then write:

```bash
npm run report:gsc-p1-post-deploy-monitoring

npm run seo:sitemap-lastmod:update -- \
  --url-list exports/seo/gsc-p1-post-deploy-monitoring/2026-07-05/p1-monitoring-urls.txt \
  --date 2026-07-05 \
  --exclude-url https://www.u2tool.com/en/tools/gantt-chart-generator/

npm run seo:sitemap-lastmod:update -- \
  --url-list exports/seo/gsc-p1-post-deploy-monitoring/2026-07-05/p1-monitoring-urls.txt \
  --date 2026-07-05 \
  --exclude-url https://www.u2tool.com/en/tools/gantt-chart-generator/ \
  --write
```

Expected manifest:

- Gantt remains `2026-07-01`;
- all other approved P1 paths are `2026-07-05`;
- `/en/tools/uuid-generator/` is absent from overrides and remains on `2026-06-02`.

- [ ] **Step 2: Write failing XML validation tests**

Create `scripts/validation/sitemap-lastmod-xml.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import {
  assertExpectedLastmod,
  assertValidLastmods,
  extractSitemapIndexLastmods,
  extractUrlLastmods,
} from './sitemap-lastmod-xml';

describe('sitemap lastmod XML validation', () => {
  it('maps URL entries to dates', () => {
    const xml = '<urlset><url><loc>https://www.u2tool.com/en/tools/uuid-generator/</loc><lastmod>2026-06-02</lastmod></url></urlset>';
    expect(extractUrlLastmods(xml).get('https://www.u2tool.com/en/tools/uuid-generator/'))
      .toBe('2026-06-02');
  });

  it('maps child sitemaps to dates', () => {
    const xml = '<sitemapindex><sitemap><loc>https://www.u2tool.com/sitemap-tools.xml</loc><lastmod>2026-07-05</lastmod></sitemap></sitemapindex>';
    expect(extractSitemapIndexLastmods(xml).get('https://www.u2tool.com/sitemap-tools.xml'))
      .toBe('2026-07-05');
  });

  it('allows old but accurate dates and rejects future dates', () => {
    expect(() => assertValidLastmods(['2026-01-01'], '2026-07-13')).not.toThrow();
    expect(() => assertValidLastmods(['2026-07-14'], '2026-07-13')).toThrow('future');
  });

  it('reports exact path/date mismatches', () => {
    const values = new Map([['https://www.u2tool.com/en/tools/uuid-generator/', '2026-06-02']]);
    expect(() => assertExpectedLastmod(values, 'https://www.u2tool.com/en/tools/uuid-generator/', '2026-07-05'))
      .toThrow('expected 2026-07-05, got 2026-06-02');
  });
});
```

- [ ] **Step 3: Implement the XML validation helper**

Create `scripts/validation/sitemap-lastmod-xml.ts` with pure functions. Parse complete `<url>` and `<sitemap>` blocks so a `lastmod` cannot be accidentally associated with the next `loc`.

```ts
export function extractUrlLastmods(xml: string): Map<string, string> {
  return new Map(Array.from(xml.matchAll(/<url>[\s\S]*?<loc>(.*?)<\/loc>[\s\S]*?<lastmod>(.*?)<\/lastmod>[\s\S]*?<\/url>/g))
    .map((match) => [match[1], match[2]]));
}

export function extractSitemapIndexLastmods(xml: string): Map<string, string> {
  return new Map(Array.from(xml.matchAll(/<sitemap>[\s\S]*?<loc>(.*?)<\/loc>[\s\S]*?<lastmod>(.*?)<\/lastmod>[\s\S]*?<\/sitemap>/g))
    .map((match) => [match[1], match[2]]));
}

export function assertValidLastmods(values: readonly string[], today: string): void {
  for (const value of values) {
    const parsed = new Date(`${value}T00:00:00Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) {
      throw new Error(`invalid lastmod "${value}"`);
    }
    if (value > today) {
      throw new Error(`future lastmod "${value}"`);
    }
  }
}

export function assertExpectedLastmod(
  values: ReadonlyMap<string, string>,
  url: string,
  expected: string
): void {
  const actual = values.get(url) || 'missing';
  if (actual !== expected) {
    throw new Error(`${url}: expected ${expected}, got ${actual}`);
  }
}
```

- [ ] **Step 4: Stop treating accurate old dates as technical failures**

In `scripts/validation/validate-technical-seo.ts`:

- remove `MAX_LASTMOD_AGE_DAYS`;
- replace `assertRecentLastmods()` with `assertValidLastmods(extractLastmods(xml), today)`;
- continue requiring every checked sitemap to contain dates;
- reject malformed and future dates, not old accurate dates.

This prevents the production gate from incentivizing fake mass-refresh dates.

- [ ] **Step 5: Make live compliance compare exact paths and child dates**

In `scripts/validation/validate-search-engine-compliance.ts`:

- import the XML helper and new manifest resolver;
- remove the single global-date assertion;
- assert exact production mappings for:
  - `https://www.u2tool.com/en/tools/gantt-chart-generator/` = `2026-07-01`;
  - `https://www.u2tool.com/en/tools/sql-query-optimizer/` = `2026-07-05`;
  - `https://www.u2tool.com/en/tools/uuid-generator/` = `2026-06-02`;
  - `https://www.u2tool.com/en/ai/` = `2026-07-08`.
- derive the expected `/sitemap-tools.xml`, `/sitemap-pages.xml`, and `/sitemap-priority.xml` dates by building the matching entry arrays and calling `newestEntryLastmod()`;
- compare those values to `sitemap.xml`.

Also correct the existing tools-search check so `/en/tools/?q=word` expects canonical `/en/tools/` while remaining `noindex`; this removes the known false positive without changing production behavior.

- [ ] **Step 6: Run focused tests and offline build inspection**

```bash
npx vitest run \
  src/lib/sitemap-lastmod.test.ts \
  src/lib/sitemap-utils.test.ts \
  scripts/seo/update-sitemap-lastmod.test.ts \
  scripts/validation/sitemap-lastmod-xml.test.ts

npm run check
npm run build
```

Then verify output:

```bash
rg -n -A2 -B1 "gantt-chart-generator|sql-query-optimizer|uuid-generator" dist/client/sitemap-tools.xml
sed -n '1,40p' dist/client/sitemap.xml
```

Expected: exact recovery dates, unchanged control date, and child maxima are correct.

- [ ] **Step 7: Commit recovery data and validators**

```bash
git add src/config/sitemap-lastmod.json scripts/validation/validate-technical-seo.ts scripts/validation/validate-search-engine-compliance.ts scripts/validation/sitemap-lastmod-xml.ts scripts/validation/sitemap-lastmod-xml.test.ts
git commit -m "fix(seo): publish accurate recovery lastmod signals"
```

---

### Task 5: Full Pre-deploy Verification and Recovery Record

**Files:**
- Create: `docs/GSC_SITEMAP_LASTMOD_RECOVERY_2026-07-13.md`
- Modify: `.github/workflows/deploy-cloudflare.yml`
- Create: `scripts/validation/deploy-workflow-contract.test.ts`

**Interfaces:**
- Consumes: committed manifest, build output, current GSC baseline, branch commit hashes.
- Produces: auditable deployment checklist and 7-day/14-day checkpoint dates.

- [ ] **Step 1: Create the recovery record before deployment**

Create `docs/GSC_SITEMAP_LASTMOD_RECOVERY_2026-07-13.md` with populated pre-deploy values:

```markdown
# GSC Sitemap Lastmod Recovery - 2026-07-13

## Scope

- Release: sitemap lastmod infrastructure and approved recovery overrides only.
- P1 material-change date: 2026-07-05.
- Gantt material-change date: 2026-07-01.
- AI discovery fallback date: 2026-07-08.
- Unchanged tools fallback date: 2026-06-02.
- Content-worktree files included: 0.

## Pre-deploy Baseline

- Latest complete GSC range: 2026-07-04 through 2026-07-10.
- Clicks: 2; previous: 1.
- Impressions: 1,012; previous: 824.
- P1 clicks: 0.
- Production tools sitemap URL count: 5,700.
- Production tools sitemap lastmod before release: 2026-06-02 for all entries.

## Release Controls

- Branch: codex/sitemap-lastmod-recovery.
- Sitemap to submit after verified deployment: https://www.u2tool.com/sitemap.xml.
- Broad URL Inspection requests permitted: 0.
- Deployment and GSC evidence are appended only from observed command/UI output.

## Monitoring

- Day 7: accepted submission date + 7 complete days.
- Day 14: accepted submission date + 14 complete days.
- Do not churn content during the first 7 complete days unless live indexability fails.
```

- [ ] **Step 2: Prevent docs-only evidence commits from redeploying the Worker**

Modify `.github/workflows/deploy-cloudflare.yml`:

```yaml
on:
  push:
    branches: [main]
    paths-ignore:
      - 'docs/**'
  workflow_dispatch:
```

Create `scripts/validation/deploy-workflow-contract.test.ts`:

```ts
import fs from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('Cloudflare deploy workflow', () => {
  it('does not redeploy the Worker for docs-only evidence commits', () => {
    const workflow = fs.readFileSync('.github/workflows/deploy-cloudflare.yml', 'utf8');
    expect(workflow).toContain('paths-ignore:');
    expect(workflow).toContain("- 'docs/**'");
    expect(workflow).toContain('workflow_dispatch:');
  });
});
```

Run:

```bash
npx vitest run scripts/validation/deploy-workflow-contract.test.ts
```

Expected: PASS. A release containing source files still deploys; a later docs-only GSC evidence commit does not create a second Worker version.

- [ ] **Step 3: Run the complete pre-deploy command set**

```bash
npm run check
npx vitest run \
  src/lib/sitemap-lastmod.test.ts \
  src/lib/sitemap-utils.test.ts \
  scripts/seo/update-sitemap-lastmod.test.ts \
  scripts/validation/sitemap-lastmod-xml.test.ts \
  scripts/validation/deploy-workflow-contract.test.ts
npm run build
npm run validate:sitemap-urls
npm run validate:robots-txt
git diff --check
git status --short
```

Expected:

- Astro check: 0 errors;
- all focused tests PASS;
- build exits 0;
- sitemap and robots checks exit 0;
- diff check emits nothing;
- only plan-approved files are modified.

- [ ] **Step 4: Verify no content-worktree leakage**

Run in the isolated worktree:

```bash
git diff --name-only main...HEAD
```

Expected: no `src/messages/**`, content-trust, tool-content, or unrelated UI files.

Run in the primary workspace:

```bash
git -C /Users/kaka/Dev/u2tool status --short
```

Expected: the original uncommitted file set remains present and untouched.

- [ ] **Step 5: Commit the pre-deploy record and workflow guard**

```bash
git add docs/GSC_SITEMAP_LASTMOD_RECOVERY_2026-07-13.md .github/workflows/deploy-cloudflare.yml scripts/validation/deploy-workflow-contract.test.ts
git commit -m "chore: record sitemap recovery release controls"
```

---

### Task 6: Merge, Deploy, Resubmit, and Start Monitoring

**Files:**
- Modify after deployment: `docs/GSC_SITEMAP_LASTMOD_RECOVERY_2026-07-13.md`

**Interfaces:**
- Consumes: verified branch, GitHub deployment workflow, Cloudflare production, authenticated GSC UI.
- Produces: merged release, accepted sitemap submission, Worker version, and dated monitoring checkpoints.

- [ ] **Step 1: Push the isolated branch**

```bash
git push -u origin codex/sitemap-lastmod-recovery
```

Expected: remote branch created successfully.

- [ ] **Step 2: Create a ready pull request**

```bash
gh pr create \
  --base main \
  --head codex/sitemap-lastmod-recovery \
  --title "Fix sitemap lastmod recovery signals" \
  --body "Publishes accurate URL-level lastmod dates for the July GSC recovery cohort, keeps unchanged tools on their historical fallback, derives sitemap-index dates from child content, and adds guarded update/validation tooling. Excludes all unrelated content-worktree changes."
```

Expected: PR URL returned.

- [ ] **Step 3: Review the PR diff and checks**

```bash
gh pr diff --name-only
gh pr checks --watch
```

Expected: only approved sitemap, validation, test, package, and recovery-document files; required checks pass.

- [ ] **Step 4: Merge and watch the Cloudflare deployment**

```bash
gh pr merge --merge
gh run list --workflow deploy-cloudflare.yml --branch main --limit 1
```

Read and watch the latest deployment run:

```bash
RUN_ID=$(gh run list --workflow deploy-cloudflare.yml --branch main --limit 1 --json databaseId --jq '.[0].databaseId')
gh run watch "$RUN_ID" --exit-status
```

Expected: `Deploy To Cloudflare` completes successfully.

Fast-forward the checked-out feature branch to the merge commit so later evidence edits start from the deployed `main` state:

```bash
git pull --ff-only origin main
```

Expected: the current branch fast-forwards because the feature tip is a parent of the merge commit.

- [ ] **Step 5: Run fresh production verification**

```bash
npm run validate:search-engine-compliance
npm run validate:technical-seo
npm run report:gsc-p1-post-deploy-monitoring -- --smoke true
```

Expected:

- exact live path/date checks pass;
- no future/malformed dates;
- 95 monitored URLs, 0 smoke failures;
- Gantt, SQL Optimizer, UUID control, AI page, and child-index dates match the manifest.

- [ ] **Step 6: Record the deployed version before touching GSC**

Use `wrangler deployments list` or the successful workflow output to capture the Worker version. Update the recovery document with:

- merged commit;
- PR URL;
- GitHub deployment run URL;
- Cloudflare Worker version;
- live verification timestamp in Asia/Shanghai.

Keep these documentation edits uncommitted until GSC acceptance is recorded, so deployment and submission evidence land in one final documentation commit.

- [ ] **Step 7: Resubmit the sitemap in Google Search Console**

Use the authenticated in-app browser and the browser-control skill:

1. Open the `u2tool.com` domain property.
2. Navigate to **Sitemaps**.
3. Submit `https://www.u2tool.com/sitemap.xml`.
4. Confirm the UI reports success/acceptance.
5. Do not submit the priority/pages/tools child sitemaps separately unless GSC rejects the index.
6. Do not perform broad URL Inspection submissions.

Record the exact accepted timestamp and visible status in the recovery document.

- [ ] **Step 8: Calculate and record checkpoint dates**

From the accepted GSC timestamp, record:

- Day 7 = seven complete days after acceptance;
- Day 14 = fourteen complete days after acceptance.

The checkpoint report must compare:

- site totals;
- 95 P1 URLs;
- 52 request-submitted URLs;
- 15 already-indexed URLs;
- the historical high-value URL/query cohort;
- impression-gain concentration by locale and page family.

- [ ] **Step 9: Run final verification and commit GSC evidence**

```bash
npm run check
npx vitest run \
  src/lib/sitemap-lastmod.test.ts \
  src/lib/sitemap-utils.test.ts \
  scripts/seo/update-sitemap-lastmod.test.ts \
  scripts/validation/sitemap-lastmod-xml.test.ts \
  scripts/validation/deploy-workflow-contract.test.ts
git diff --check
git status --short
```

Commit and push the GSC acceptance record:

```bash
git add docs/GSC_SITEMAP_LASTMOD_RECOVERY_2026-07-13.md
git commit -m "docs: record GSC sitemap acceptance"
git push origin HEAD:main
```

If branch protection rejects the direct documentation-only push, use:

```bash
git switch -c codex/sitemap-lastmod-recovery-evidence
git push -u origin codex/sitemap-lastmod-recovery-evidence
gh pr create --base main --head codex/sitemap-lastmod-recovery-evidence --title "Record GSC sitemap acceptance" --body "Records the deployed Worker version, live sitemap verification, GSC acceptance time, and monitoring checkpoint dates."
gh pr merge --merge
```

Expected: final documentation contains deployed commit, Worker version, live verification time, GSC accepted time, and exact Day 7/Day 14 dates.

---

## Plan Self-review Checklist

- Every design requirement maps to a task: manifest/resolver (Task 1), sitemap integration/index dates (Task 2), safe updates (Task 3), actual cohort and validation (Task 4), release evidence (Task 5), deployment/GSC/monitoring (Task 6).
- The existing content worktree stays outside every `git add` command.
- Date ownership is unambiguous: buckets and URL overrides are configured; sitemap-index dates are derived.
- Pre-deploy validation never requires production to match an undeployed manifest; exact live-manifest comparison runs after Cloudflare deployment.
- Old accurate `lastmod` values are allowed; invalid and future dates fail.
- No step uses broad URL Inspection requests.
- No placeholder text, undefined interface, or out-of-order dependency remains.

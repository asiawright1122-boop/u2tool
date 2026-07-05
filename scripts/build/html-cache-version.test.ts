import { describe, expect, it } from 'vitest';
import { getHtmlCacheVersion } from './html-cache-version.mjs';

function fakeReader(values: Record<string, string>) {
  return (args: string[]) => values[args.join(' ')] ?? '';
}

describe('html cache version', () => {
  it('uses an explicit build version override when provided', () => {
    const version = getHtmlCacheVersion({
      env: { U2TOOL_HTML_CACHE_VERSION: 'seo-recovery-2026-07-02' },
      readGitValue: fakeReader({}),
    });

    expect(version).toBe('seo-recovery-2026-07-02');
  });

  it('returns the commit for clean builds', () => {
    const version = getHtmlCacheVersion({
      env: {},
      readGitValue: fakeReader({
        'rev-parse --short=12 HEAD': 'abc123def456',
        'status --porcelain': '',
      }),
    });

    expect(version).toBe('abc123def456');
  });

  it('fingerprints dirty builds so consecutive dirty deploys get distinct cache keys', () => {
    const version = getHtmlCacheVersion({
      env: {},
      readGitValue: fakeReader({
        'rev-parse --short=12 HEAD': 'abc123def456',
        'status --porcelain': ' M src/lib/discovery-surface.ts',
        'diff --binary HEAD': 'diff --git a/src/lib/discovery-surface.ts b/src/lib/discovery-surface.ts\n+one',
        'ls-files --others --exclude-standard': '',
      }),
    });
    const changedVersion = getHtmlCacheVersion({
      env: {},
      readGitValue: fakeReader({
        'rev-parse --short=12 HEAD': 'abc123def456',
        'status --porcelain': ' M src/lib/discovery-surface.ts',
        'diff --binary HEAD': 'diff --git a/src/lib/discovery-surface.ts b/src/lib/discovery-surface.ts\n+two',
        'ls-files --others --exclude-standard': '',
      }),
    });

    expect(version).toMatch(/^abc123def456-dirty-[a-f0-9]{12}$/);
    expect(version).not.toBe('abc123def456-dirty');
    expect(changedVersion).not.toBe(version);
  });
});

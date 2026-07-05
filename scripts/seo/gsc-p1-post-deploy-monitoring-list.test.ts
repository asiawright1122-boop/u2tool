import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  extractUrls,
  parseArgs,
  renderCsv,
  rowForUrl,
} from './gsc-p1-post-deploy-monitoring-list.js';

const tempDirs: string[] = [];

function writeTempWorklog(contents: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'u2tool-p1-monitoring-'));
  tempDirs.push(dir);
  const filePath = path.join(dir, 'worklog.md');
  fs.writeFileSync(filePath, contents, 'utf8');
  return filePath;
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    fs.rmSync(dir, { force: true, recursive: true });
  }
});

describe('gsc p1 post deploy monitoring list', () => {
  it('parses kebab CLI options', () => {
    expect(parseArgs([
      '--worklog',
      'docs/worklog.md',
      '--csv-out',
      'out.csv',
      '--smoke',
      'true',
    ])).toEqual({
      worklog: 'docs/worklog.md',
      csvOut: 'out.csv',
      smoke: 'true',
    });
  });

  it('extracts unique production URLs in sorted order', () => {
    const worklogPath = writeTempWorklog([
      '| `https://www.u2tool.com/zh/tools/sql-injection-tester/` | evidence | result |',
      '| `https://www.u2tool.com/en/tools/excel-to-csv/` | evidence | result |',
      '| `https://www.u2tool.com/en/tools/excel-to-csv/` | duplicate | result |',
      'Ignore https://example.com/not-production/ and relative /en/tools/foo/.',
    ].join('\n'));

    expect(extractUrls(worklogPath)).toEqual([
      'https://www.u2tool.com/en/tools/excel-to-csv/',
      'https://www.u2tool.com/zh/tools/sql-injection-tester/',
    ]);
  });

  it('builds monitoring row metadata from URL path segments', () => {
    const row = rowForUrl(
      'https://www.u2tool.com/ru/tools/video-to-base64/',
      7,
      'a9e30cc0-23be-46c1-950e-3047b67ab7b9',
      'a9e30cc0',
      '2026-07-12',
      '2026-07-19',
      '2026-08-02'
    );

    expect(row).toMatchObject({
      index: 7,
      cacheBustedUrl: 'https://www.u2tool.com/ru/tools/video-to-base64/?v=a9e30cc0',
      locale: 'ru',
      slug: 'video-to-base64',
      requestIndexingSubmitted: 'no',
      immediateStatus: 'not-smoked',
    });
  });

  it('marks the Spanish Word Counter CDN cache note explicitly', () => {
    const row = rowForUrl(
      'https://www.u2tool.com/es/tools/word-counter/',
      51,
      'a9e30cc0-23be-46c1-950e-3047b67ab7b9',
      'a9e30cc0',
      '2026-07-12',
      '2026-07-19',
      '2026-08-02'
    );

    expect(row.immediateStatus).toBe('pending-unversioned-cdn-cache');
    expect(row.notes).toContain('stale Cloudflare CDN HTML cache');
  });

  it('renders CSV with quoted cells', () => {
    const row = rowForUrl(
      'https://www.u2tool.com/en/tools/excel-to-csv/',
      1,
      'a9e30cc0-23be-46c1-950e-3047b67ab7b9',
      'a9e30cc0',
      '2026-07-12',
      '2026-07-19',
      '2026-08-02'
    );
    row.notes = 'A note with "quotes"';

    expect(renderCsv([row])).toContain('"A note with ""quotes"""');
  });
});

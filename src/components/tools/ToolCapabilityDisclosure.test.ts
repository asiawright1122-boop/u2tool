import { execFileSync } from 'node:child_process';
import {
  copyFileSync,
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const repoRoot = fileURLToPath(new URL('../../..', import.meta.url));
const fixtureRoot = path.join(
  repoRoot,
  'src/components/tools/test-fixtures/tool-capability-disclosure',
);
const astroBin = path.join(repoRoot, 'node_modules/.bin/astro');

let tempRoot = '';
let html = '';

beforeAll(() => {
  tempRoot = mkdtempSync(path.join(tmpdir(), 'u2tool-capability-disclosure-'));
  const outDir = path.join(tempRoot, 'dist');
  const cacheDir = path.join(tempRoot, 'cache');
  const projectRoot = path.join(tempRoot, 'project');
  mkdirSync(projectRoot, { recursive: true });
  copyFileSync(
    path.join(fixtureRoot, 'astro.config.mjs'),
    path.join(projectRoot, 'astro.config.mjs'),
  );
  cpSync(path.join(fixtureRoot, 'src'), path.join(projectRoot, 'src'), {
    recursive: true,
  });
  symlinkSync(
    path.join(repoRoot, 'node_modules'),
    path.join(projectRoot, 'node_modules'),
    'dir',
  );

  execFileSync(astroBin, ['build'], {
    cwd: projectRoot,
    encoding: 'utf8',
    env: {
      ...process.env,
      CAPABILITY_FIXTURE_OUT_DIR: outDir,
      CAPABILITY_FIXTURE_CACHE_DIR: cacheDir,
      CAPABILITY_FIXTURE_REPO_ROOT: repoRoot,
    },
    timeout: 60_000,
  });

  html = readFileSync(path.join(outDir, 'index.html'), 'utf8');
}, 60_000);

afterAll(() => {
  if (tempRoot) {
    rmSync(tempRoot, { recursive: true, force: true });
  }
});

describe('ToolCapabilityDisclosure', () => {
  it('renders an engine-limited profile with localized attributes, language, and privacy copy', () => {
    const disclosure = disclosureHtml('grammar-checker');

    expect(disclosure).toContain('data-capability-version="1.0.0"');
    expect(disclosure).toContain('data-local-processing="true"');
    expect(disclosure).toContain('此工具的功能');
    expect(disclosure).toContain('英语');
    expect(disclosure).toContain('在本地模式下，您的输入仅保留在此浏览器中。');
    expect(disclosure).not.toContain('可选的服务器处理');
  });

  it('renders the localized language-neutral label without engine locales', () => {
    const disclosure = disclosureHtml('hex-editor');

    expect(disclosure).toContain('Was dieses Tool kann');
    expect(disclosure).toContain('Sprachneutral');
    expect(disclosure).not.toContain('Optional server processing');
  });

  it('renders optional-server features and privacy only when a server feature exists', () => {
    const disclosure = disclosureHtml('grammar-checker-server-fixture');

    expect(disclosure).toContain('Optional server processing');
    expect(disclosure).toContain('Local English grammar checks');
    expect(disclosure).toContain(
      'Server processing only starts after you explicitly request it.',
    );
  });

  it('leaves the tracked fixture free of generated Astro and Vite artifacts', () => {
    expect(trackedFixtureArtifacts()).toEqual([]);
  });
});

function disclosureHtml(slug: string): string {
  const match = html.match(
    new RegExp(
      `<section\\b(?=[^>]*data-tool-capability="${slug}")[\\s\\S]*?</section>`,
    ),
  );
  expect(match, `missing rendered disclosure for ${slug}`).not.toBeNull();
  return match![0];
}

function trackedFixtureArtifacts(): string[] {
  return ['.astro', 'dist', '.vite', 'node_modules'].filter((entry) =>
    existsSync(path.join(fixtureRoot, entry)),
  );
}

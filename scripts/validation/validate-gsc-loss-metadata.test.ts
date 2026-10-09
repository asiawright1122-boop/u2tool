import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import { describe, expect, it } from 'vitest';

function collectReferencedValidationFiles(entrypoint: string): string[] {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8')) as {
    scripts: Record<string, string>;
  };
  const visitedScripts = new Set<string>();
  const referencedFiles = new Set<string>();

  const visit = (scriptName: string) => {
    if (visitedScripts.has(scriptName)) return;
    visitedScripts.add(scriptName);

    const command = packageJson.scripts[scriptName];
    expect(command, `Missing npm script referenced by ${scriptName}`).toBeTruthy();

    for (const match of command.matchAll(/\bnpm run ([\w:-]+)/g)) {
      visit(match[1]);
    }

    // The independent runner receives npm script names as arguments, without
    // repeating "npm run". Keep their transitive file-coverage check intact.
    const independentPrefix = 'node scripts/validation/run-independent-checks.mjs ';
    if (command.startsWith(independentPrefix)) {
      for (const name of command.slice(independentPrefix.length).trim().split(/\s+/)) visit(name);
    }

    for (const match of command.matchAll(/\b(scripts\/[\w./-]+\.(?:[cm]?[jt]sx?|sh|py))\b/g)) {
      referencedFiles.add(match[1]);
    }
  };

  visit(entrypoint);
  return [...referencedFiles].sort();
}

describe('GSC loss metadata production gate', () => {
  it('validates the metadata users and crawlers actually receive', () => {
    const result = spawnSync(
      process.execPath,
      ['--import', 'tsx/esm', 'scripts/validation/validate-gsc-loss-metadata.ts'],
      { cwd: process.cwd(), encoding: 'utf8' }
    );

    expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);
    expect(result.stdout).toContain('GSC loss metadata validation passed');
  });
});

describe('Production Verification failure reporting', () => {
  it('can create its required labels and issue with explicit permissions', () => {
    const workflow = fs.readFileSync('.github/workflows/project-health.yml', 'utf8');

    expect(workflow).toMatch(/permissions:\s*\n\s+contents: read\s*\n\s+issues: write/);
    expect(workflow).toContain('github.rest.issues.createLabel');
    expect(workflow).toContain("labels: ['production-verification', 'automated']");
  });

  it('starts a local SSR preview for the post-build render contract', () => {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const runner = fs.readFileSync('scripts/validation/run-with-preview.mjs', 'utf8');

    expect(packageJson.scripts['validate:tool-page-render-contract'])
      .toBe('node scripts/validation/run-tool-page-render-contract.mjs');
    expect(packageJson.scripts['qa:production']).toContain('run-with-preview.mjs -- npm run qa:production:postbuild');
    expect(runner).toContain("'node_modules/astro/bin/astro.mjs'");
    expect(runner).toContain("'--host', '127.0.0.1'");
    expect(runner).toContain('FETCH_BASE_URL: previewBaseUrl');
    expect(runner).toContain("CANONICAL_BASE_URL: env.CANONICAL_BASE_URL || 'https://www.u2tool.com'");
    expect(runner).toContain("SKIP_SOURCE_RENDERED_CHECKS: '1'");
    expect(runner).toContain('stop(preview,');
  });

  it('keeps all HTTP verification inside one owned preview after building', () => {
    const scripts = JSON.parse(fs.readFileSync('package.json', 'utf8')).scripts;
    expect(scripts['verify:production']).toBe('npm run qa:production:prebuild && npm run build && node scripts/validation/run-with-preview.mjs -- npm run verify:production:preview && npm run planning:traceability && npm run health:check');
    expect(scripts['verify:production:preview']).toBe('npm run qa:production:postbuild && npm run qa:smoke:checks && npm run report:seo-alignment');
    expect(scripts['qa:smoke']).toBe('node scripts/validation/run-with-preview.mjs -- npm run qa:smoke:checks');
    expect(scripts['qa:smoke:checks']).toContain('smoke-e2e.ts && npm run validate:sitemap-urls -- --online');
  });
});

describe('Production Verification repository contract', () => {
  it('tracks every local script reachable from the production verification entrypoint', () => {
    const referencedFiles = collectReferencedValidationFiles('verify:production');

    expect(referencedFiles.length).toBeGreaterThan(0);
    for (const file of referencedFiles) {
      expect(fs.existsSync(file), `${file} does not exist`).toBe(true);

      const ignored = spawnSync('git', ['check-ignore', '-q', '--', file], {
        cwd: process.cwd(),
        encoding: 'utf8',
      });
      expect(ignored.status, `${file} is ignored by Git and will be missing in CI`).not.toBe(0);

      const tracked = spawnSync('git', ['ls-files', '--error-unmatch', '--', file], {
        cwd: process.cwd(),
        encoding: 'utf8',
      });
      expect(tracked.status, `${file} is not tracked by Git and will be missing in CI`).toBe(0);
    }
  });

  it('delegates service ownership rather than probing, spawning or killing arbitrary port owners', () => {
    for (const name of ['smoke-e2e.ts', 'validate-sitemap-urls.ts']) {
      const consumer = fs.readFileSync(`scripts/validation/${name}`, 'utf8');
      expect(consumer).toContain('getManagedPreviewUrl()');
      expect(consumer).not.toContain('checkServerActive');
      expect(consumer).not.toContain('spawn(');
      expect(consumer).not.toContain('process.kill');
      expect(consumer).not.toContain('lsof -t');
    }
  });
});

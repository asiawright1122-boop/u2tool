import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import { describe, expect, it } from 'vitest';

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
    expect(runner).toContain("spawn('npm', ['run', 'preview'");
    expect(runner).toContain('FETCH_BASE_URL: previewBaseUrl');
    expect(runner).toContain('CANONICAL_BASE_URL: canonicalBaseUrl');
    expect(runner).toContain("SKIP_SOURCE_RENDERED_CHECKS: '1'");
    expect(runner).toContain('preview.kill');
  });
});

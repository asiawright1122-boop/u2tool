import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { expect, it } from 'vitest';
import { INDEX_SUPPRESSION } from '../../src/config/index-suppression.generated';
import approvals from '../../src/config/index-retention-approvals.json';

it('preserves the exact reviewed noindex set, not just its count', () => {
  const keys = Object.keys(INDEX_SUPPRESSION).filter(key => INDEX_SUPPRESSION[key]).sort();
  expect(createHash('sha256').update(JSON.stringify(keys)).digest('hex'))
    // 2026-10-24 AI-citation unsuppression: -37 noindex lines (>=100
    // Copilot citations per page; evidence in
    // docs/SEO_AI_CITATION_CHECKPOINT_2026-10-24.md). Prior set hash:
    // 5eeccfea3e36f9809c15090ba1795a722090f0a7d59bf1f69dd0ccde2d006b65.
    .toBe('840b63bd44d54675faa56ba6b38a4954b7075f5beeae92388ea199f67e281543');
});

it('keeps every migrated approval retained, including expired review dates', () => {
  // 226 at the 2026-10-09 baseline + 37 from the 2026-10-24 unsuppression.
  expect(approvals.entries.length).toBe(263);
  for (const entry of approvals.entries) expect(INDEX_SUPPRESSION[entry.key], entry.key).not.toBe(true);
});

it('runs source and local SSR gates before deploying the Worker', () => {
  const workflow = fs.readFileSync('.github/workflows/deploy-cloudflare.yml', 'utf8');
  const source = workflow.indexOf('npm run qa:seo-recovery');
  const build = workflow.indexOf('npm run build');
  const rendered = workflow.indexOf('npm run validate:seo-recovery-rendered');
  const deploy = workflow.indexOf('npx wrangler deploy');
  expect(source).toBeGreaterThan(0);
  expect(source).toBeLessThan(build);
  expect(rendered).toBeGreaterThan(build);
  expect(rendered).toBeLessThan(deploy);
});

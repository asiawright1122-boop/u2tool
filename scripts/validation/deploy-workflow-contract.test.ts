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

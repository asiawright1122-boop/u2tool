import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const toolsDir = join(process.cwd(), 'src/components/tools');

function readToolComponents() {
  return readdirSync(toolsDir)
    .filter((fileName) => fileName.endsWith('.svelte'))
    .map((fileName) => ({
      fileName,
      source: readFileSync(join(toolsDir, fileName), 'utf8'),
    }));
}

describe('tool component translation namespaces', () => {
  it('uses the plural tools namespace for tool page translations', () => {
    const offenders = readToolComponents()
      .filter(({ source }) => source.includes("translations['tool']") || source.includes('MISSING: tool.'))
      .map(({ fileName }) => fileName);

    expect(offenders).toEqual([]);
  });
});

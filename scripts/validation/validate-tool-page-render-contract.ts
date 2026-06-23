import { mkdir, writeFile } from 'node:fs/promises';
import * as path from 'node:path';
import { pathToFileURL } from 'node:url';

import { fetchHtmlWithRetry } from '../../src/lib/seo-probe';
import {
  buildToolPageRenderReport,
  compareToolPageRenderContract,
  computeToolPageRenderExitCode,
  extractToolPageRenderContract,
  filterToolPageRenderMatrix,
  hasOnlyFetchFailures,
  parseToolPageRenderArgs,
  TOOL_PAGE_RENDER_MATRIX,
  toolPagePath,
  type ToolPageRenderExpectation,
  type ToolPageRenderResult,
} from './tool-page-render-contract';

export async function validateToolPageRenderContract(
  expectation: ToolPageRenderExpectation,
  baseUrl: string,
  timeoutMs = 15000
): Promise<ToolPageRenderResult> {
  const pathName = toolPagePath(expectation.locale, expectation.slug);
  const url = `${baseUrl}${pathName}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort(new Error(`timed out after ${timeoutMs}ms`));
  }, timeoutMs);

  try {
    const { html, response } = await fetchHtmlWithRetry(url, { signal: controller.signal });
    const contract = extractToolPageRenderContract(html, response.status, expectation.bodyMustInclude);
    const failures = compareToolPageRenderContract(expectation, contract, html);

    return {
      locale: expectation.locale,
      slug: expectation.slug,
      path: pathName,
      status: response.status,
      failures,
      contract,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    return {
      locale: expectation.locale,
      slug: expectation.slug,
      path: pathName,
      status: 0,
      failures: [`${expectation.locale}/${expectation.slug} fetch: ${message}`],
      error: message,
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function runToolPageRenderContractValidation(argv = process.argv.slice(2)) {
  const options = parseToolPageRenderArgs(argv);
  const matrix = filterToolPageRenderMatrix(TOOL_PAGE_RENDER_MATRIX, options.filter);
  const results: ToolPageRenderResult[] = [];

  for (const expectation of matrix) {
    results.push(await validateToolPageRenderContract(expectation, options.baseUrl, options.timeoutMs));
  }

  const report = buildToolPageRenderReport({
    baseUrl: options.baseUrl,
    results,
  });

  if (options.jsonOut) {
    await mkdir(path.dirname(options.jsonOut), { recursive: true });
    await writeFile(options.jsonOut, `${JSON.stringify(report, null, 2)}\n`, 'utf-8');
  }

  return report;
}

async function main(): Promise<void> {
  const report = await runToolPageRenderContractValidation();

  process.stdout.write('\nTool Page Render Contract — SSR audit\n');
  process.stdout.write(`  Base URL: ${report.baseUrl}\n`);
  process.stdout.write(`  Total:    ${report.summary.total}\n`);
  process.stdout.write(`  Passed:   ${report.summary.passed}\n`);
  process.stdout.write(`  Failed:   ${report.summary.failed}\n`);

  for (const result of report.results) {
    if (result.failures.length === 0 && !result.error) {
      process.stdout.write(`  ✓ ${result.locale}/${result.slug}\n`);
      continue;
    }

    process.stderr.write(`  ✗ ${result.locale}/${result.slug}\n`);
    for (const failure of result.failures) {
      process.stderr.write(`    - ${failure}\n`);
    }
  }

  if (report.summary.failed === 0) {
    process.stdout.write('\n[PASS] Tool page render contract passed.\n');
  } else if (hasOnlyFetchFailures(report)) {
    process.stderr.write('\n[FAIL] Tool page render contract could not reach the configured SSR server.\n');
    process.stderr.write('       Start local preview or set FETCH_BASE_URL / PROD_BASE_URL to a reachable target.\n');
  } else {
    process.stderr.write('\n[FAIL] Tool page render contract drift detected.\n');
  }

  process.exitCode = computeToolPageRenderExitCode(report);
}

const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : '';
if (import.meta.url === invokedPath) {
  main().catch((error) => {
    process.stderr.write(`Fatal: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
}

import { describe, expect, it, vi } from 'vitest';

import {
  cleanupGrammarBrowserFixture,
  withPuppeteerPage,
} from './grammar-checker-fixture-lifecycle';

describe('GrammarChecker browser fixture lifecycle', () => {
  it('closes a Puppeteer page when the browser assertion path rejects', async () => {
    const failure = new Error('browser assertion failed');
    const page = {
      close: vi.fn().mockResolvedValue(undefined),
    };

    await expect(
      withPuppeteerPage(
        async () => page,
        async () => {
          throw failure;
        },
      ),
    ).rejects.toBe(failure);
    expect(page.close).toHaveBeenCalledOnce();
  });

  it('attempts browser, server, and temp-tree cleanup when every cleanup path fails', async () => {
    const browserFailure = new Error('browser close failed');
    const serverFailure = new Error('server close failed');
    const tempTreeFailure = new Error('temp-tree removal failed');
    const closeBrowser = vi.fn().mockRejectedValue(browserFailure);
    const closeServer = vi.fn().mockRejectedValue(serverFailure);
    const removeTempTree = vi.fn().mockRejectedValue(tempTreeFailure);

    let thrown: unknown;
    try {
      await cleanupGrammarBrowserFixture({
        closeBrowser,
        closeServer,
        removeTempTree,
      });
    } catch (error) {
      thrown = error;
    }

    expect(closeBrowser).toHaveBeenCalledOnce();
    expect(closeServer).toHaveBeenCalledOnce();
    expect(removeTempTree).toHaveBeenCalledOnce();
    expect(thrown).toBeInstanceOf(AggregateError);
    expect((thrown as AggregateError).errors).toEqual([
      browserFailure,
      serverFailure,
      tempTreeFailure,
    ]);
  });
});

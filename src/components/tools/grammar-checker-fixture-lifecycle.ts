interface PuppeteerPageLifecycle {
  close(): Promise<void>;
}

type CleanupAction = () => void | Promise<void>;

interface GrammarBrowserFixtureCleanup {
  closeBrowser: CleanupAction;
  closeServer: CleanupAction;
  removeTempTree: CleanupAction;
}

export async function withPuppeteerPage<
  Page extends PuppeteerPageLifecycle,
  Result,
>(
  createPage: () => Promise<Page>,
  run: (page: Page) => Promise<Result>,
): Promise<Result> {
  const page = await createPage();

  try {
    return await run(page);
  } finally {
    await page.close();
  }
}

export async function cleanupGrammarBrowserFixture({
  closeBrowser,
  closeServer,
  removeTempTree,
}: GrammarBrowserFixtureCleanup): Promise<void> {
  const errors: unknown[] = [];
  const closeResults = await Promise.allSettled([
    Promise.resolve().then(closeBrowser),
    Promise.resolve().then(closeServer),
  ]);

  for (const result of closeResults) {
    if (result.status === 'rejected') {
      errors.push(result.reason);
    }
  }

  try {
    await removeTempTree();
  } catch (error) {
    errors.push(error);
  }

  if (errors.length > 0) {
    throw new AggregateError(errors, 'GrammarChecker fixture cleanup failed');
  }
}

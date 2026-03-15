<script lang="ts">
  import { getLocalizedPath } from '@/lib/i18n';
  import type { Locale } from '@/lib/i18n';
  import { buildDiscoveryEvent, sendDiscoveryEvents } from '@/lib/ai-discovery/telemetry';
  import { createTranslator } from '@/lib/translations';
  import * as Icon from 'lucide-svelte';

  interface DiscoveryMatch {
    slug: string;
    name: string;
    description: string;
    category: string;
    categoryName: string;
    score: number;
    matchedTerms: string[];
  }

  interface DiscoveryResponse {
    query: string;
    normalizedQuery: string;
    matches: DiscoveryMatch[];
    action: 'direct' | 'suggest' | 'fallback';
    confidence: number;
    error: 'EMPTY_QUERY' | null;
  }

  interface Props {
    locale: string;
    translations?: Record<string, unknown>;
  }

  let { locale, translations = {} }: Props = $props();

  let query = $state('');
  let isLoading = $state(false);
  let error = $state('');
  let hasSearched = $state(false);
  let results = $state<DiscoveryMatch[]>([]);
  let action = $state<'direct' | 'suggest' | 'fallback'>('fallback');
  let confidence = $state(0);
  let fallbackEventSent = $state(false);

  function t(key: string, fallback: string): string {
    const translator = createTranslator(translations as Record<string, unknown>);
    return translator(key, fallback);
  }

  const pageTitle = $derived(
    t('aiDiscovery.heroTitle', 'AI Tool Discovery')
  );
  const pageDescription = $derived(
    t(
      'aiDiscovery.heroDescription',
      'Describe what you want to do, and we will map it to the best existing tool first.'
    )
  );
  const inputPlaceholder = $derived(
    t('aiDiscovery.inputPlaceholder', 'Example: convert json to csv')
  );
  const submitIdleLabel = $derived(
    t('aiDiscovery.submitIdle', 'Find Tool')
  );
  const submitLoadingLabel = $derived(
    t('aiDiscovery.submitLoading', 'Searching...')
  );
  const directResultSummary = $derived(
    t('aiDiscovery.directResultSummary', 'Best match found.')
  );
  const suggestResultSummary = $derived(
    t('aiDiscovery.suggestResultSummary', 'Here are suggested matches.')
  );
  const confidenceLabel = $derived(
    t('aiDiscovery.confidenceLabel', 'Confidence')
  );
  const noMatchMessage = $derived(
    t('aiDiscovery.noMatchMessage', 'No confident match found for this query yet.')
  );
  const browseAllToolsLabel = $derived(
    t('aiDiscovery.browseAllTools', 'Browse all tools')
  );

  let initializedFromUrl = false;
  $effect(() => {
    if (initializedFromUrl || typeof window === 'undefined') {
      return;
    }

    const url = new URL(window.location.href);
    const queryInUrl = url.searchParams.get('q');
    if (queryInUrl) {
      query = queryInUrl;
      void submitSearch();
    }
    initializedFromUrl = true;
  });

  function toToolPath(slug: string): string {
    return getLocalizedPath(locale as Locale, `/tools/${slug}`);
  }

  function toToolsPath(): string {
    return getLocalizedPath(locale as Locale, '/tools');
  }

  function updateQueryInUrl(value: string): void {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (value.trim()) {
      url.searchParams.set('q', value.trim());
    } else {
      url.searchParams.delete('q');
    }
    window.history.replaceState({}, '', url.toString());
  }

  async function submitSearch(): Promise<void> {
    const trimmed = query.trim();
    hasSearched = true;
    error = '';
    results = [];
    action = 'fallback';
    confidence = 0;
    fallbackEventSent = false;

    if (!trimmed) {
      error = t('aiDiscovery.emptyQueryError', 'Please enter a query.');
      updateQueryInUrl('');
      return;
    }

    isLoading = true;
    updateQueryInUrl(trimmed);
    try {
      const response = await fetch(`/api/ai-discovery/search?locale=${encodeURIComponent(locale)}&q=${encodeURIComponent(trimmed)}`);
      const payload = await response.json() as DiscoveryResponse | { error?: string; message?: string };
      if (!response.ok) {
        error = payload.message ?? payload.error ?? t('aiDiscovery.requestFailedError', 'Search failed.');
        return;
      }

      const typedPayload = payload as DiscoveryResponse;
      results = typedPayload.matches ?? [];
      action = typedPayload.action;
      confidence = typedPayload.confidence;

      const querySubmittedEvent = buildDiscoveryEvent({
        name: 'query_submitted',
        locale,
        query: trimmed,
        action: typedPayload.action,
        confidence: typedPayload.confidence,
      });
      if (querySubmittedEvent) {
        void sendDiscoveryEvents([querySubmittedEvent]);
      }
    } catch (err) {
      console.error('[DiscoverySearch] request failed', err);
      error = t('aiDiscovery.requestFailedError', 'Failed to search. Please try again.');
    } finally {
      isLoading = false;
    }
  }

  function handleResultClick(result: DiscoveryMatch): void {
    const clickEvent = buildDiscoveryEvent({
      name: 'result_clicked',
      locale,
      query,
      toolSlug: result.slug,
      action,
      confidence,
    });
    if (clickEvent) {
      void sendDiscoveryEvents([clickEvent]);
    }
  }

  $effect(() => {
    if (isLoading || !hasSearched || !!error || results.length > 0 || fallbackEventSent) {
      return;
    }

    const fallbackEvent = buildDiscoveryEvent({
      name: 'fallback_viewed',
      locale,
      query,
      action: 'fallback',
      confidence,
    });
    if (fallbackEvent) {
      fallbackEventSent = true;
      void sendDiscoveryEvents([fallbackEvent]);
    }
  });
</script>

<section class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-5 md:p-6">
  <div class="mb-5">
    <h1 class="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">{pageTitle}</h1>
    <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
      {pageDescription}
    </p>
  </div>

  <form class="flex flex-col sm:flex-row gap-3" onsubmit={(event) => { event.preventDefault(); void submitSearch(); }}>
    <input
      bind:value={query}
      type="text"
      placeholder={inputPlaceholder}
      aria-label={inputPlaceholder}
      class="flex-1 h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-700
             bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
    <button
      type="submit"
      disabled={isLoading}
      class="h-10 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed
             text-white text-sm font-medium transition-colors inline-flex items-center justify-center gap-2"
    >
      {#if isLoading}
        <Icon.Loader2 class="w-4 h-4 animate-spin" />
      {/if}
      <span>{isLoading ? submitLoadingLabel : submitIdleLabel}</span>
    </button>
  </form>

  {#if error}
    <div class="mt-4 rounded-lg border border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300 px-3 py-2 text-sm">
      {error}
    </div>
  {/if}

  {#if hasSearched && !isLoading}
    <div class="mt-5 border-t border-gray-100 dark:border-gray-800 pt-5">
      {#if results.length > 0}
        <div class="mb-3 flex items-center justify-between gap-4">
          <p class="text-sm text-gray-600 dark:text-gray-300">
            {action === 'direct' ? directResultSummary : suggestResultSummary}
          </p>
          <span class="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
            {confidenceLabel} {(confidence * 100).toFixed(0)}%
          </span>
        </div>

        <div class="space-y-3">
          {#each results as result}
            <a
              href={toToolPath(result.slug)}
              onclick={() => handleResultClick(result)}
              class="block rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
            >
              <div class="flex items-start justify-between gap-3">
                <div>
                  <h3 class="text-sm font-semibold text-gray-900 dark:text-white">{result.name}</h3>
                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{result.description}</p>
                </div>
                <span class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{result.categoryName}</span>
              </div>
            </a>
          {/each}
        </div>
      {:else}
        <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 p-4">
          <p class="text-sm text-gray-700 dark:text-gray-300">
            {noMatchMessage}
          </p>
          <div class="mt-3">
            <a
              href={toToolsPath()}
              class="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900 text-sm font-medium"
            >
              {browseAllToolsLabel}
              <Icon.ArrowRight class="w-4 h-4" />
            </a>
          </div>
        </div>
      {/if}
    </div>
  {/if}
</section>

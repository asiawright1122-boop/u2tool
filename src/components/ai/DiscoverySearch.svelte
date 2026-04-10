<script lang="ts">
  import { getLocalizedPath } from '@/lib/i18n';
  import type { Locale } from '@/lib/i18n';
  import { buildDiscoveryEvent, sendDiscoveryEvents } from '@/lib/ai-discovery/telemetry';
  import { createTranslator } from '@/lib/translations';
  import * as Icon from 'lucide-svelte';

  interface DiscoveryMatch {
    slug: string;
    href?: string;
    kind?: 'comparison' | 'tool';
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

  function toResultPath(result: DiscoveryMatch): string {
    return result.href || toToolPath(result.slug);
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

<section class="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-gradient-to-br from-slate-50 via-white to-slate-100 shadow-xl
                dark:border-slate-800 dark:from-slate-900 dark:via-zinc-900 dark:to-black p-6 md:p-8 backdrop-blur-sm mb-10">
  <!-- Background Decorations -->
  <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/5 via-amber-200/10 to-transparent dark:from-amber-500/10 dark:via-amber-700/5 dark:to-transparent pointer-events-none"></div>

  <div class="relative z-10 mb-6">
    <h1 class="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{pageTitle}</h1>
    <p class="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
      {pageDescription}
    </p>
  </div>

  <form class="relative z-10 flex flex-col sm:flex-row gap-3" onsubmit={(event) => { event.preventDefault(); void submitSearch(); }}>
    <div class="relative flex-1">
      <input
        bind:value={query}
        type="text"
        placeholder={inputPlaceholder}
        aria-label={inputPlaceholder}
        class="w-full h-12 pl-4 pr-10 rounded-xl border border-slate-200 dark:border-slate-700
               bg-white/60 dark:bg-slate-800/80 text-slate-900 dark:text-white
               focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
               placeholder:text-slate-400 transition-all duration-200"
      />
      {#if isLoading}
        <div class="absolute right-3 top-1/2 -translate-y-1/2">
          <Icon.Loader2 class="w-5 h-5 animate-spin text-slate-400" />
        </div>
      {/if}
    </div>
    <button
      type="submit"
      disabled={isLoading}
      class="h-12 px-6 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-sm font-bold transition-all
             hover:bg-black hover:shadow-lg dark:hover:bg-slate-100 disabled:opacity-60 disabled:cursor-not-allowed
             inline-flex items-center justify-center gap-2 group border border-slate-800 dark:border-transparent lg:min-w-[140px]"
    >
      <span>{isLoading ? submitLoadingLabel : submitIdleLabel}</span>
      {#if !isLoading}
        <Icon.Search class="w-4 h-4 transition-transform group-hover:scale-110" />
      {/if}
    </button>
  </form>

  {#if error}
    <div class="relative z-10 mt-4 rounded-xl border border-red-200 bg-red-50/50 text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300 px-4 py-3 text-sm flex items-center gap-2">
      <Icon.AlertCircle class="w-4 h-4 shrink-0" />
      {error}
    </div>
  {/if}

  {#if hasSearched && !isLoading}
    <div class="relative z-10 mt-6 border-t border-slate-200/60 dark:border-slate-800 pt-6">
      {#if results.length > 0}
        <div class="mb-4 flex items-center justify-between gap-4">
          <p class="text-sm font-medium text-slate-600 dark:text-slate-400">
            {action === 'direct' ? directResultSummary : suggestResultSummary}
          </p>
          <span class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-amber-900/30 dark:text-amber-400 border border-blue-100 dark:border-amber-500/30">
            {confidenceLabel} {(confidence * 100).toFixed(0)}%
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          {#each results as result}
            <a
              href={toResultPath(result)}
              onclick={() => handleResultClick(result)}
              class="group block rounded-2xl border border-slate-200/60 bg-white/40 dark:bg-slate-900/40 p-5
                     backdrop-blur-md transition-all duration-300 hover:shadow-xl hover:border-blue-400/60 dark:hover:border-amber-500/50"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <h3 class="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-amber-400 transition-colors uppercase tracking-tight">{result.name}</h3>
                  <p class="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{result.description}</p>
                </div>
                <span class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 whitespace-nowrap bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200/50 dark:border-slate-700/50">
                  {result.categoryName}
                </span>
              </div>
            </a>
          {/each}
        </div>
      {:else}
        <div class="rounded-2xl border border-slate-200/60 bg-white/40 dark:bg-slate-800/40 p-6 text-center backdrop-blur-md">
          <Icon.SearchX class="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
          <p class="text-sm text-slate-700 dark:text-slate-300 mb-4">
            {noMatchMessage}
          </p>
          <a
            href={toToolsPath()}
            class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-sm font-bold hover:shadow-lg transition-all"
          >
            {browseAllToolsLabel}
            <Icon.ArrowRight class="w-4 h-4" />
          </a>
        </div>
      {/if}
    </div>
  {/if}
</section>

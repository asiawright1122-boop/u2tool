<script lang="ts">
  /**
   * GlobalSearch.svelte
   *
   * Global search component with natural language search support.
   * Searches tools by name, description, and category.
   */
  import { getLocalizedPath } from '@/lib/i18n';
  import type { Locale } from '@/lib/i18n';
  import { buildAiDiscoveryLink } from '@/lib/ai-discovery/query-link';
  import { createTranslator } from '@/lib/translator';
  import * as Icon from 'lucide-svelte';

  interface Props {
    locale: string;
    translations?: Record<string, unknown>;
  }

  let { locale, translations = {} }: Props = $props();

  interface ToolIndex {
    slug: string;
    name: string;
    description: string;
    category: string;
    categoryName: string;
  }

  let toolsIndex = $state<ToolIndex[]>([]);
  let searchQuery = $state('');
  let isOpen = $state(false);
  let selectedIndex = $state(0);
  let searchInputRef: HTMLInputElement | undefined = $state();
  let isLoading = $state(false);

  function t(key: string, fallback: string): string {
    const translator = createTranslator(translations as Record<string, unknown>);
    return translator(key, fallback);
  }

  const searchPlaceholder = $derived(
    t('search.placeholder', t('nav.searchPlaceholder', 'Search tools...'))
  );
  const searchButtonLabel = $derived(
    t('common.search', 'Search')
  );
  const searchLoadingLabel = $derived(
    t('common.loading', 'Loading...')
  );
  const noResultsLabel = $derived(
    t('search.noResults', t('nav.noResults', 'No tools found'))
  );
  const aiDiscoveryButtonLabel = $derived(
    t('aiDiscovery.globalSearchCta', 'Try AI discovery')
  );

  async function loadToolsIndex() {
    if (toolsIndex.length > 0) return;
    
    isLoading = true;
    try {
      const response = await fetch(`/${locale}/tools-index.json/`);
      if (response.ok) {
        toolsIndex = await response.json();
        // Auto-open results after loading if there's a query
        if (searchQuery.trim()) {
          isOpen = true;
        }
      }
    } catch (error) {
      console.error('Failed to load tools index:', error);
    } finally {
      isLoading = false;
    }
  }

  $effect(() => {
    if (isOpen && toolsIndex.length === 0) {
      loadToolsIndex();
    }
  });

  interface SearchResult {
    slug: string;
    name: string;
    description: string;
    category: string;
    categoryName: string;
    score: number;
  }

  const searchResults = $derived(() => {
    if (!searchQuery.trim() || toolsIndex.length === 0) return [];

    const query = searchQuery.toLowerCase().trim();
    const results: SearchResult[] = [];

    for (const tool of toolsIndex) {
      let score = 0;
      const nameLower = tool.name.toLowerCase();
      const descLower = tool.description.toLowerCase();
      const categoryLower = tool.categoryName.toLowerCase();

      if (nameLower.includes(query)) {
        score += 100;
        if (nameLower.startsWith(query)) score += 50;
      }

      if (descLower.includes(query)) {
        score += 30;
      }

      if (categoryLower.includes(query)) {
        score += 20;
      }

      const queryWords = query.split(/\s+/);
      for (const word of queryWords) {
        if (nameLower.includes(word)) score += 10;
        if (descLower.includes(word)) score += 5;
        if (categoryLower.includes(word)) score += 3;
      }

      if (score > 0) {
        results.push({
          slug: tool.slug,
          name: tool.name,
          description: tool.description,
          category: tool.category,
          categoryName: tool.categoryName,
          score
        });
      }
    }

    return results.sort((a, b) => b.score - a.score).slice(0, 8);
  });

  async function handleSearchClick() {
    if (!searchQuery.trim()) {
      return;
    }

    if (toolsIndex.length === 0) {
      await loadToolsIndex();
    }

    const results = searchResults();
    if (results.length > 0) {
      navigateToTool(results[0].slug);
      return;
    }

    navigateToAiDiscovery(searchQuery);
  }
   function handleInput() {
     if (searchQuery.trim().length > 0) {
       isOpen = true;
       if (toolsIndex.length === 0) {
         loadToolsIndex();
       }
     } else {
       isOpen = false;
     }
     selectedIndex = 0;
   }

   function handleKeydown(e: KeyboardEvent) {
    const results = searchResults();

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, results.length - 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, 0);
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      navigateToTool(results[selectedIndex].slug);
    } else if (e.key === 'Enter' && searchQuery.trim()) {
      e.preventDefault();
      void handleSearchClick();
    } else if (e.key === 'Escape') {
      isOpen = false;
      searchInputRef?.blur();
    }
  }

  function navigateToTool(slug: string) {
    const toolPath = getLocalizedPath(locale as Locale, `/tools/${slug}`);
    window.location.href = toolPath;
  }

  function navigateToAiDiscovery(query: string) {
    const aiPath = buildAiDiscoveryLink(locale as Locale, query);
    window.location.href = aiPath;
  }

  function handleFocus() {
    if (searchQuery.trim().length > 0) {
      isOpen = true;
    }
  }

  function handleBlur() {
    setTimeout(() => {
      isOpen = false;
    }, 200);
  }
</script>

<div class="relative mx-1 min-w-0 flex-1 group/search sm:mx-6 sm:max-w-xl">
  <div class="relative flex items-center">
    <input
      type="text"
      bind:this={searchInputRef}
      bind:value={searchQuery}
      placeholder={searchPlaceholder}
      aria-label={searchPlaceholder}
      oninput={handleInput}
      onkeydown={handleKeydown}
      onfocus={handleFocus}
      onblur={handleBlur}
      class="w-full h-10 pl-4 pr-12 text-sm rounded-xl border border-slate-200 dark:border-white/10
             bg-white/60 dark:bg-slate-900 text-slate-900 dark:text-white backdrop-blur-md
             focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500/30
             transition-all duration-300 group-hover/search:border-slate-300 dark:group-hover/search:border-white/20 shadow-sm sm:pr-32"
    />
    <button
      onclick={() => void handleSearchClick()}
      class="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg bg-slate-950 dark:bg-amber-500 hover:bg-black dark:hover:bg-amber-400
             text-white dark:text-slate-950 text-[10px] font-black uppercase tracking-widest transition-all duration-300 gap-2 shadow-lg dark:shadow-amber-500/10 sm:w-auto sm:px-4"
    >
      <Icon.Search class="w-3.5 h-3.5" />
      <span class="hidden sm:inline">{searchButtonLabel}</span>
    </button>
  </div>

  {#if isOpen}
    <div class="absolute top-full left-0 right-0 mt-2 glass-strong !bg-white/95 dark:!bg-slate-900/95
                border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl 
                overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-300">
      {#if isLoading}
        <div class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
          {searchLoadingLabel}
        </div>
      {:else if searchResults().length > 0}
        <ul class="py-1 max-h-80 overflow-y-auto">
          {#each searchResults() as result, index}
            <li>
              <button
                onclick={() => navigateToTool(result.slug)}
                class="w-full px-5 py-3 text-left transition-colors duration-200
                       {index === selectedIndex ? 'bg-amber-500/10 dark:bg-amber-500/10' : 'hover:bg-slate-50 dark:hover:bg-white/5'}"
              >
                <div class="flex items-center justify-between">
                  <span class="font-bold text-sm text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400">
                    {result.name}
                  </span>
                  <span class="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded">
                    {result.categoryName}
                  </span>
                </div>
                {#if result.description}
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-1 font-medium">
                    {result.description}
                  </p>
                {/if}
              </button>
            </li>
          {/each}
        </ul>
      {:else if searchQuery.trim().length > 0}
        <div class="px-6 py-8 text-center space-y-4">
          <p class="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed italic">
            "{searchQuery}" - {noResultsLabel}
          </p>
          <button
            onclick={() => navigateToAiDiscovery(searchQuery)}
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-950 dark:bg-amber-500 text-white dark:text-slate-950 text-[10px] font-black uppercase tracking-widest transition-all duration-300 hover:shadow-xl dark:hover:shadow-amber-500/20 active:scale-95"
          >
            <Icon.Sparkles class="w-3.5 h-3.5" />
            {aiDiscoveryButtonLabel}
          </button>
        </div>
      {/if}
    </div>
  {/if}
</div>

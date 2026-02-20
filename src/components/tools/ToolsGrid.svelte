<script lang="ts">
  /**
   * ToolsGrid.svelte
   *
   * Interactive tool listing with category filtering.
   * Reads ?category= from URL to filter tools by category.
   * Shows all categories when no filter is active.
   */
  import { getLocalizedPath } from '@/lib/i18n';
  import type { Locale } from '@/lib/i18n';

  interface CategoryItem {
    id: string;
    icon: string;
  }

  interface ToolItem {
    slug: string;
    category: string;
    icon: string;
    popular?: boolean;
  }

  interface Props {
    locale: string;
    categories: CategoryItem[];
    tools: ToolItem[];
    categoryNames: Record<string, string>;
    toolNames: Record<string, string>;
    toolDescriptions: Record<string, string>;
    navMessages: Record<string, string>;
  }

  let { locale, categories, tools, categoryNames, toolNames, toolDescriptions, navMessages }: Props = $props();

  let activeCategory = $state<string | null>(null);

  // Read category from URL on mount
  $effect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    activeCategory = params.get('category');

    // Listen for popstate (back/forward navigation)
    const onPopState = () => {
      const p = new URLSearchParams(window.location.search);
      activeCategory = p.get('category');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  });

  function getToolsByCategory(catId: string) {
    return tools.filter(t => t.category === catId);
  }

  function setCategory(catId: string | null) {
    activeCategory = catId;
    const url = new URL(window.location.href);
    if (catId) {
      url.searchParams.set('category', catId);
    } else {
      url.searchParams.delete('category');
    }
    window.history.pushState({}, '', url.toString());
  }

  let filteredCategories = $derived(
    activeCategory
      ? categories.filter(c => c.id === activeCategory)
      : categories
  );

  let totalVisible = $derived(
    activeCategory
      ? getToolsByCategory(activeCategory).length
      : tools.length
  );

  function toolPath(slug: string) {
    return getLocalizedPath(locale as Locale, `/tools/${slug}`);
  }
</script>

<!-- Category filter tabs -->
<div class="flex flex-wrap gap-2 mb-6">
  <button
    onclick={() => setCategory(null)}
    class="px-3 py-1.5 text-sm rounded-lg transition-colors {activeCategory === null
      ? 'bg-blue-600 text-white'
      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}"
  >
    {navMessages.allTools || 'All'} ({tools.length})
  </button>
  {#each categories as cat}
    {@const count = getToolsByCategory(cat.id).length}
    {#if count > 0}
      <button
        onclick={() => setCategory(cat.id)}
        class="px-3 py-1.5 text-sm rounded-lg transition-colors {activeCategory === cat.id
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}"
      >
        <span>{cat.icon}</span> {categoryNames[cat.id] || cat.id} ({count})
      </button>
    {/if}
  {/each}
</div>

<p class="text-gray-600 dark:text-gray-300 mb-6">
  {totalVisible} {navMessages.toolsAvailable || 'tools available'}
</p>

<!-- Tool sections -->
{#each filteredCategories as cat}
  {@const catTools = getToolsByCategory(cat.id)}
      {#if catTools.length > 0}
    <section id={cat.id} class="mb-10">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
        <span>{cat.icon}</span>
        <span>{categoryNames[cat.id] || cat.id}</span>
        <span class="text-sm font-normal text-gray-500 dark:text-gray-400">({catTools.length})</span>
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {#each catTools as tool}
          <a
            href={toolPath(tool.slug)}
            class="group flex items-center gap-3 p-3 bg-white dark:bg-gray-800/50
                   border border-gray-200 dark:border-gray-700/50 rounded-lg
                   hover:border-blue-300 dark:hover:border-blue-600
                   hover:shadow-md hover:shadow-blue-500/10
                   hover:-translate-y-0.5 transition-all duration-200"
          >
            <span class="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
              {tool.icon}
            </span>
            <div class="flex-1 min-w-0">
              <h3 class="font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {toolNames[tool.slug] || tool.slug}
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">
                {toolDescriptions[tool.slug] || ''}
              </p>
            </div>
            {#if tool.popular}
              <span class="px-1.5 py-0.5 text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded flex-shrink-0">
                🔥
              </span>
            {/if}
          </a>
        {/each}
      </div>
    </section>
  {/if}

{/each}
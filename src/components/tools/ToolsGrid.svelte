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

  let filteredCategories = $derived(
    activeCategory
      ? categories.filter(c => c.id === activeCategory)
      : categories
  );

  function toolPath(slug: string) {
    return getLocalizedPath(locale as Locale, `/tools/${slug}`);
  }
</script>

<!-- Tool sections -->
{#each filteredCategories as cat}
  {@const catTools = getToolsByCategory(cat.id)}
      {#if catTools.length > 0}
    <section id={cat.id} class="mb-8">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        <span>{cat.icon}</span>
        <span>{categoryNames[cat.id] || cat.id}</span>
        <span class="text-sm font-normal text-gray-400 dark:text-gray-500">({catTools.length})</span>
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {#each catTools as tool}
          <a
            href={toolPath(tool.slug)}
            class="group flex items-center gap-3 p-3 bg-white dark:bg-gray-800/60
                   border border-gray-100 dark:border-gray-700/40 rounded-xl
                   hover:border-blue-400/60 dark:hover:border-blue-500/40
                   hover:bg-blue-50/50 dark:hover:bg-blue-900/10
                   cursor-pointer transition-all duration-200"
          >
            <span class="text-2xl flex-shrink-0">
              {tool.icon}
            </span>
            <div class="flex-1 min-w-0">
              <h3 class="font-medium text-sm text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {toolNames[tool.slug] || tool.slug}
              </h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                {toolDescriptions[tool.slug] || ''}
              </p>
            </div>
            {#if tool.popular}
              <span class="text-xs text-orange-500 flex-shrink-0">🔥</span>
            {/if}
          </a>
        {/each}
      </div>
    </section>
  {/if}

{/each}
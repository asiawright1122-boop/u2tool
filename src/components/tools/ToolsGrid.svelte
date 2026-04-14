<script lang="ts">
  /**
   * ToolsGrid.svelte
   *
   * Interactive tool listing with category filtering.
   * Reads ?category= from URL to filter tools by category.
   * Shows all categories when no filter is active.
   */
  import { getLocalizedPath } from '@/lib/i18n';
  import { getIconSvg } from '@/lib/icon-svg';
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
    <section id={cat.id} class="mb-10">
      <h2 class="text-sm font-black text-slate-400 dark:text-slate-500 mb-5 flex items-center gap-3 uppercase tracking-[0.25em]">
        <span class="text-slate-950 dark:text-amber-500/80 inline-flex drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]">{@html getIconSvg(cat.icon, 18)}</span>
        <span>{categoryNames[cat.id] || cat.id}</span>
        <span class="text-[10px] font-medium opacity-50">({catTools.length})</span>
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each catTools as tool}
          <a
            href={toolPath(tool.slug)}
            class="group flex items-center gap-4 p-4 bg-white dark:bg-white/[0.02]
                   border border-slate-200/60 dark:border-white/[0.05] rounded-2xl
                   hover:border-amber-500/40 dark:hover:border-amber-500/30
                   hover:bg-amber-50/50 dark:hover:bg-amber-500/[0.02]
                   hover:shadow-xl hover:shadow-amber-500/5
                   cursor-pointer transition-all duration-300 relative overflow-hidden"
          >
            <div class="absolute inset-0 bg-gradient-to-br from-amber-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span class="text-slate-950 dark:text-amber-500 flex-shrink-0 inline-flex drop-shadow-sm group-hover:scale-110 transition-transform duration-500">
              {@html getIconSvg(tool.icon, 20)}
            </span>
            <div class="flex-1 min-w-0 relative z-10">
              <h3 class="font-bold text-sm text-slate-900 dark:text-white truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors tracking-tight">
                {toolNames[tool.slug] || tool.slug}
              </h3>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
                {toolDescriptions[tool.slug] || ''}
              </p>
            </div>
            {#if tool.popular}
              <span class="inline-flex items-center px-2 py-0.5 text-[9px] font-black uppercase tracking-tighter rounded-lg bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400 flex-shrink-0 border border-red-200/50 dark:border-red-500/20">HOT</span>
            {/if}
          </a>
        {/each}
      </div>
    </section>
  {/if}

{/each}
<script lang="ts">
  /**
   * Sidebar.svelte
   *
   * Left sidebar navigation matching the original Next.js GlobalSidebar design.
   * - Desktop (≥1024px): expanded, 220px wide
   * - Tablet (768-1023px): collapsed, 64px wide (icons only)
   * - Mobile (<768px): hidden (bottom nav instead)
   */
  import { getLocalizedPath } from '@/lib/i18n';
  import type { Locale } from '@/lib/i18n';

  interface CategoryItem {
    id: string;
    icon: string;
  }

  interface Props {
    locale: string;
    categories: CategoryItem[];
    categoryNames: Record<string, string>;
    navMessages: Record<string, string>;
    siteName?: string;
  }

  let { locale, categories, categoryNames, navMessages, siteName = 'U2Tool' }: Props = $props();

  let toolsExpanded = $state(true);
  let rankingExpanded = $state(true);

  function homePath() {
    return getLocalizedPath(locale as Locale, '/');
  }
  function toolsPath() {
    return getLocalizedPath(locale as Locale, '/tools');
  }
  function categoryPath(id: string) {
    return getLocalizedPath(locale as Locale, '/tools') + '?category=' + id;
  }

  // Detect collapsed state from CSS media query
  let collapsed = $state(false);

  // Track active category from URL
  let activeCategory = $state<string | null>(null);

  $effect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(min-width: 768px) and (max-width: 1023px)');
    collapsed = mql.matches;
    const handler = (e: MediaQueryListEvent) => { collapsed = e.matches; };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  });

  $effect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    activeCategory = params.get('category');
  });
</script>

<nav
  class="h-full w-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 overflow-y-auto overflow-x-hidden"
  role="navigation"
>
  <!-- Logo -->
  <div class="h-16 flex items-center px-4 border-b border-gray-200 dark:border-gray-800">
    <a href={homePath()} class="flex items-center gap-2">
      <span class="text-2xl">🛠️</span>
      {#if !collapsed}
        <span class="text-lg font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          {siteName}
        </span>
      {/if}
    </a>
  </div>

  <div class="py-3 px-2">
    <!-- Home -->
    <a
      href={homePath()}
      class="sidebar-item"
      class:justify-center={collapsed}
      title={collapsed ? (navMessages.home || 'Home') : undefined}
    >
      <span class="text-lg">🏠</span>
      {#if !collapsed}
        <span class="text-sm font-medium">{navMessages.home || 'Home'}</span>
      {/if}
    </a>

    <!-- Ranking -->
    <div>
      <button
        onclick={() => { if (!collapsed) rankingExpanded = !rankingExpanded; }}
        class="sidebar-item w-full"
        class:justify-center={collapsed}
        title={collapsed ? (navMessages.ranking || 'Ranking') : undefined}
      >
        <span class="text-lg">🏆</span>
        {#if !collapsed}
          <span class="flex-1 text-sm font-medium text-left">{navMessages.ranking || 'Ranking'}</span>
          <svg class="w-4 h-4 transition-transform {rankingExpanded ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        {/if}
      </button>

      {#if !collapsed && rankingExpanded}
        <nav class="mt-1 space-y-0.5">
          <a href={getLocalizedPath(locale as Locale, '/tools/ranking/newest')} class="sidebar-item pl-8">
            <span class="text-base">🆕</span>
            <span class="flex-1 text-sm truncate">{navMessages.newest || 'Newest'}</span>
          </a>
          <a href={getLocalizedPath(locale as Locale, '/tools/ranking/popular')} class="sidebar-item pl-8">
            <span class="text-base">🔥</span>
            <span class="flex-1 text-sm truncate">{navMessages.hottest || 'Popular'}</span>
          </a>
        </nav>
      {/if}
    </div>

    <!-- Divider -->
    <div class="h-px bg-gray-200 dark:bg-gray-700 my-2 mx-2"></div>

    <!-- Tool Categories -->
    <div>
      <button
        onclick={() => { if (!collapsed) toolsExpanded = !toolsExpanded; }}
        class="sidebar-item w-full"
        class:justify-center={collapsed}
        title={collapsed ? (navMessages.toolCategories || 'Categories') : undefined}
      >
        <span class="text-lg">🛠️</span>
        {#if !collapsed}
          <span class="flex-1 text-sm font-medium text-left">{navMessages.toolCategories || 'Tool Categories'}</span>
          <svg class="w-4 h-4 transition-transform {toolsExpanded ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        {/if}
      </button>

      {#if !collapsed && toolsExpanded}
        <nav class="mt-1 space-y-0.5">
          {#each categories as cat}
            <a
              href={categoryPath(cat.id)}
              class="sidebar-item pl-8"
              class:sidebar-item-active={activeCategory === cat.id}
              title={categoryNames[cat.id] || cat.id}
            >
              <span class="text-base">{cat.icon}</span>
              <span class="flex-1 text-sm truncate">{categoryNames[cat.id] || cat.id}</span>
            </a>
          {/each}
        </nav>
      {/if}

      {#if collapsed}
        <nav class="mt-1 space-y-0.5">
          {#each categories.slice(0, 5) as cat}
            <a
              href={categoryPath(cat.id)}
              class="sidebar-item justify-center"
              class:sidebar-item-active={activeCategory === cat.id}
              title={categoryNames[cat.id] || cat.id}
            >
              <span class="text-base">{cat.icon}</span>
            </a>
          {/each}
        </nav>
      {/if}
    </div>

    <!-- Divider -->
    <div class="h-px bg-gray-200 dark:bg-gray-700 my-2 mx-2"></div>

    <!-- All Tools -->
    <a
      href={toolsPath()}
      class="sidebar-item"
      class:justify-center={collapsed}
      title={collapsed ? (navMessages.tools || 'All Tools') : undefined}
    >
      <span class="text-lg">📋</span>
      {#if !collapsed}
        <span class="text-sm font-medium">{navMessages.tools || 'All Tools'}</span>
      {/if}
    </a>
  </div>
</nav>

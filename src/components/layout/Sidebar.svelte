<script lang="ts">
  /**
   * Sidebar.svelte
   *
   * Left sidebar navigation with Lucide SVG icons (no emoji).
   * - Desktop (≥1024px): expanded, 220px wide
   * - Tablet (768-1023px): collapsed, 64px wide (icons only)
   * - Mobile (<768px): hidden (bottom nav instead)
   */
  import { getLocalizedPath } from '@/lib/i18n';
  import { getIconSvg } from '@/lib/icon-svg';
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

  function homePath() {
    return getLocalizedPath(locale as Locale, '/');
  }
  function toolsPath() {
    return getLocalizedPath(locale as Locale, '/tools');
  }
  function categoryPath(id: string) {
    return getLocalizedPath(locale as Locale, '/tools') + '?category=' + id;
  }

  let collapsed = $state(false);
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
  class="h-full w-full bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-white/5 overflow-y-auto overflow-x-hidden"
>
  <!-- Logo -->
  <div class="h-16 flex items-center px-5 border-b border-slate-200 dark:border-white/5 mb-2">
    <a href={homePath()} class="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white group w-full" class:justify-center={collapsed}>
      <span class="text-amber-500 transition-transform group-hover:scale-110 duration-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)] shrink-0">{@html getIconSvg('gem', 24)}</span>
      {#if !collapsed}
        <span class="tracking-tight truncate">U2<span class="text-amber-500">Tool</span></span>
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
      <span class="sidebar-icon">{@html getIconSvg('home', 18)}</span>
      {#if !collapsed}
        <span class="text-sm font-medium">{navMessages.home || 'Home'}</span>
      {/if}
    </a>

    <!-- Tool Categories -->
    <div>
      <button
        onclick={() => { if (!collapsed) toolsExpanded = !toolsExpanded; }}
        class="sidebar-item w-full"
        class:justify-center={collapsed}
        title={collapsed ? (navMessages.toolCategories || 'Categories') : undefined}
      >
        <span class="sidebar-icon">{@html getIconSvg('layout-grid', 18)}</span>
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
              <span class="sidebar-icon">{@html getIconSvg(cat.icon, 16)}</span>
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
              <span class="sidebar-icon">{@html getIconSvg(cat.icon, 18)}</span>
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
      <span class="sidebar-icon">{@html getIconSvg('list', 18)}</span>
      {#if !collapsed}
        <span class="text-sm font-medium">{navMessages.tools || 'All Tools'}</span>
      {/if}
    </a>
  </div>
</nav>

<style>
  .sidebar-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }
</style>

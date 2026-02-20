<script lang="ts">
  /**
   * MobileBottomNav.svelte
   *
   * Bottom navigation bar for mobile devices (<768px).
   * Shows Home, Tools, Categories, and Settings icons.
   */
  import { getLocalizedPath } from '@/lib/i18n';
  import type { Locale } from '@/lib/i18n';

  interface Props {
    locale: string;
    navMessages?: Record<string, string>;
  }

  let { locale, navMessages = {} }: Props = $props();

  let homePath = $derived(getLocalizedPath(locale as Locale, '/'));
  let toolsPath = $derived(getLocalizedPath(locale as Locale, '/tools'));
</script>

<div class="mobile-bottom-nav md:hidden">
  <div class="flex items-center justify-around py-2">
    <a href={homePath} class="flex flex-col items-center gap-1 px-3 py-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
      <span class="text-xl">🏠</span>
      <span class="text-xs">{navMessages.home || 'Home'}</span>
    </a>
    <a href={toolsPath} class="flex flex-col items-center gap-1 px-3 py-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
      <span class="text-xl">🛠️</span>
      <span class="text-xs">{navMessages.tools || 'Tools'}</span>
    </a>
    <a href={toolsPath} class="flex flex-col items-center gap-1 px-3 py-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
      <span class="text-xl">📂</span>
      <span class="text-xs">{navMessages.categories || 'Categories'}</span>
    </a>
  </div>
</div>

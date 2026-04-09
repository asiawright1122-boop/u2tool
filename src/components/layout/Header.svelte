<script lang="ts">
  /**
   * Header.svelte
   *
   * Navigation bar with site logo/name, search, language selector, and theme toggle.
   * This is a Svelte component (not Astro) because it needs client-side
   * interactivity for the language dropdown and theme toggle.
   *
   * Requirements: 6.1, 2.6
   */
  import LanguageSelector from '@/components/ui/LanguageSelector.svelte';
  import ThemeToggle from '@/components/ui/ThemeToggle.svelte';
  import GlobalSearch from '@/components/ui/GlobalSearch.svelte';
  import { getLocalizedPath } from '@/lib/i18n';
  import type { Locale } from '@/lib/i18n';

  interface Props {
    locale: string;
    translations?: Record<string, unknown>;
  }

  let { locale, translations = {} }: Props = $props();

  let currentPath = $state('/');

  $effect(() => {
    if (typeof window !== 'undefined') {
      currentPath = window.location.pathname;
    }
  });

  let homePath = $derived(getLocalizedPath(locale as Locale, '/'));
</script>

<header class="w-full border-b border-gray-200/80 dark:border-gray-800/80
               bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
  <div class="w-full px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-14">
      <GlobalSearch {locale} translations={translations} />

      <div class="flex items-center gap-3 shrink-0">
        <LanguageSelector {locale} {currentPath} />
        <ThemeToggle />
      </div>
    </div>
  </div>
</header>

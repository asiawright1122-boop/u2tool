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

<header class="w-full glass-nav sticky top-0 z-50 transition-all duration-300">
  <div class="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent dark:via-amber-500/20"></div>
  <div class="w-full px-4 sm:px-8 lg:pl-0 lg:pr-8">
    <div class="flex items-center justify-between h-16">
      <div class="flex-1 max-w-2xl">
        <GlobalSearch {locale} translations={translations} />
      </div>

      <div class="flex items-center gap-4 shrink-0">
        <LanguageSelector {locale} {currentPath} />
        <div class="w-px h-6 bg-slate-200 dark:bg-white/10"></div>
        <ThemeToggle />
      </div>
    </div>
  </div>
</header>

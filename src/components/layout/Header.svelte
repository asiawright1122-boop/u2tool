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
  import { getAiToolsDirectoryHref, getAiToolsDirectoryLabel } from '@/lib/ai-tools-navigation';
  import { getIconSvg } from '@/lib/icon-svg';

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
  let aiToolsHref = $derived(getAiToolsDirectoryHref(locale as Locale));
  let aiToolsLabel = $derived(getAiToolsDirectoryLabel(locale as Locale));
  let aiToolsIcon = getIconSvg('sparkle', 15);
</script>

<header class="w-full glass-nav sticky top-0 z-50 transition-all duration-300">
  <div class="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent dark:via-amber-500/20"></div>
  <div class="w-full px-3 sm:px-8 lg:pl-0 lg:pr-8">
    <div class="flex h-16 items-center justify-between gap-2 sm:gap-4">
      <div class="min-w-0 flex-1 max-w-2xl">
        <GlobalSearch {locale} translations={translations} />
      </div>

      <a
        href={aiToolsHref}
        data-prefetch
        class="hidden shrink-0 items-center gap-2 rounded-xl border border-sky-200/70 bg-sky-50/80 px-3 py-2 text-[11px] font-black uppercase tracking-[0.14em] text-sky-700 transition hover:border-sky-300 hover:bg-sky-100 dark:border-sky-400/20 dark:bg-sky-950/25 dark:text-sky-200 dark:hover:border-sky-300/50 xl:inline-flex"
      >
        <span class="inline-flex" aria-hidden="true">{@html aiToolsIcon}</span>
        <span>{aiToolsLabel}</span>
      </a>

      <div class="flex items-center gap-1.5 shrink-0 sm:gap-4">
        <LanguageSelector {locale} {currentPath} />
        <div class="hidden h-6 w-px bg-slate-200 dark:bg-white/10 sm:block"></div>
        <ThemeToggle />
      </div>
    </div>
  </div>
</header>

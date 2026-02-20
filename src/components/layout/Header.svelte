<script lang="ts">
  /**
   * Header.svelte
   *
   * Navigation bar with site logo/name, language selector, and theme toggle.
   * This is a Svelte component (not Astro) because it needs client-side
   * interactivity for the language dropdown and theme toggle.
   *
   * Requirements: 6.1, 2.6
   */
  import LanguageSelector from '@/components/ui/LanguageSelector.svelte';
  import ThemeToggle from '@/components/ui/ThemeToggle.svelte';
  import { getLocalizedPath } from '@/lib/i18n';
  import type { Locale } from '@/lib/i18n';

  interface Props {
    locale: string;
  }

  let { locale }: Props = $props();

  // Get the current path for the language selector
  let currentPath = $state('/');

  $effect(() => {
    if (typeof window !== 'undefined') {
      currentPath = window.location.pathname;
    }
  });

  let homePath = $derived(getLocalizedPath(locale as Locale, '/'));
  let toolsPath = $derived(getLocalizedPath(locale as Locale, '/tools'));

  let mobileMenuOpen = $state(false);

  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }
</script>

<header class="sticky top-0 z-40 w-full border-b border-gray-200/80 dark:border-gray-800/80
               bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-14">
      <!-- Logo / Site Name -->
      <a href={homePath} class="flex items-center gap-2 text-lg font-bold
                                text-gray-900 dark:text-white hover:opacity-80 transition-opacity">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
        <span>U2Tool</span>
      </a>

      <!-- Right side: Language + Theme -->
      <div class="flex items-center gap-2">
        <div class="hidden sm:block">
          <LanguageSelector {locale} {currentPath} />
        </div>
        <ThemeToggle />
      </div>
    </div>
  </div>
</header>

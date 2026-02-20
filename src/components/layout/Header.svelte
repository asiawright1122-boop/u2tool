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

<header class="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800
               bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      <!-- Logo / Site Name -->
      <a href={homePath} class="flex items-center gap-2 text-xl font-bold
                                text-gray-900 dark:text-white hover:opacity-80 transition-opacity">
        <span class="text-2xl">🛠️</span>
        <span>U2Tool</span>
      </a>

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex items-center gap-6">
        <a href={toolsPath}
           class="text-sm font-medium text-gray-600 dark:text-gray-400
                  hover:text-gray-900 dark:hover:text-white transition-colors">
          Tools
        </a>
      </nav>

      <!-- Right side: Language + Theme -->
      <div class="flex items-center gap-2">
        <div class="hidden sm:block">
          <LanguageSelector {locale} {currentPath} />
        </div>
        <ThemeToggle />

        <!-- Mobile menu button -->
        <button
          onclick={toggleMobileMenu}
          class="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800
                 transition-colors text-gray-700 dark:text-gray-300"
          aria-label="Toggle menu"
        >
          {#if mobileMenuOpen}
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          {:else}
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          {/if}
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    {#if mobileMenuOpen}
      <div class="md:hidden border-t border-gray-200 dark:border-gray-800 py-4 space-y-3">
        <a href={toolsPath}
           class="block px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400
                  hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg
                  hover:bg-gray-100 dark:hover:bg-gray-800">
          Tools
        </a>
        <div class="px-3 sm:hidden">
          <LanguageSelector {locale} {currentPath} />
        </div>
      </div>
    {/if}
  </div>
</header>

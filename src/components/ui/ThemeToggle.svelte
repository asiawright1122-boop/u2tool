<script lang="ts">
  /**
   * ThemeToggle.svelte
   *
   * Button that toggles between light and dark themes.
   * Uses the theme Svelte store from @/lib/theme.
   * Shows a sun icon in dark mode and a moon icon in light mode.
   *
   * Requirements: 6.1, 6.2, 6.3
   */
  import { onMount } from 'svelte';
  import { theme, THEME_CHANGE_EVENT } from '@/lib/theme';

  let currentTheme = $state('system');
  let isDark = $state(false);

  function syncResolvedTheme() {
    if (typeof document === 'undefined') {
      isDark = false;
      return;
    }

    isDark = document.documentElement.classList.contains('dark');
  }

  onMount(() => {
    theme.init();
    const unsubscribe = theme.subscribe((value) => {
      currentTheme = value;
      syncResolvedTheme();
    });
    syncResolvedTheme();

    const handleThemeChange = () => {
      syncResolvedTheme();
    };

    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);

    return () => {
      unsubscribe();
      window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    };
  });

  function handleToggle() {
    theme.toggle();
  }
</script>

<button
  onclick={handleToggle}
  class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800
         transition-colors text-gray-700 dark:text-gray-300"
  aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
>
  {#if isDark}
    <!-- Sun icon: shown in dark mode, click to switch to light -->
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  {:else}
    <!-- Moon icon: shown in light mode, click to switch to dark -->
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  {/if}
</button>

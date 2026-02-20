/**
 * Theme Store
 *
 * Svelte writable store for managing light/dark/system theme.
 * Persists preference to localStorage and applies the `.dark` class on <html>.
 *
 * Requirements: 6.2, 6.3
 */

import { writable } from 'svelte/store';

export type Theme = 'light' | 'dark' | 'system';

function createThemeStore() {
  const { subscribe, set, update } = writable<Theme>('system');

  return {
    subscribe,

    /**
     * Toggle between light and dark themes.
     * Saves the preference to localStorage and applies it immediately.
     */
    toggle() {
      update((current) => {
        const next: Theme = current === 'dark' ? 'light' : 'dark';
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('theme', next);
        }
        applyTheme(next);
        return next;
      });
    },

    /**
     * Initialize the theme from localStorage.
     * Should be called once when the Svelte component mounts.
     * Note: The inline script in BaseLayout.astro handles the initial
     * class application to prevent FOUC. This method syncs the store state.
     */
    init() {
      if (typeof localStorage === 'undefined') return;

      const saved = localStorage.getItem('theme') as Theme | null;
      if (saved && (saved === 'light' || saved === 'dark' || saved === 'system')) {
        set(saved);
        applyTheme(saved);
      } else {
        // No saved preference — use system default
        set('system');
        applyTheme('system');
      }
    },
  };
}

/**
 * Apply the theme by toggling the `.dark` class on <html>.
 * Handles the 'system' theme by checking the OS preference.
 */
function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') return;

  const isDark =
    theme === 'dark' ||
    (theme === 'system' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  document.documentElement.classList.toggle('dark', isDark);
}

/**
 * Singleton theme store instance.
 * Import and use in Svelte components:
 *
 *   import { theme } from '@/lib/theme';
 *   theme.init();       // on mount
 *   theme.toggle();     // on button click
 *   $theme              // reactive current value ('light' | 'dark' | 'system')
 */
export const theme = createThemeStore();

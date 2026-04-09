/**
 * Theme Store
 *
 * Svelte writable store for managing light/dark/system theme.
 * Persists preference to localStorage and applies the `.dark` class on <html>.
 *
 * Requirements: 6.2, 6.3
 */

import { writable } from 'svelte/store';
import {
  THEME_STORAGE_KEY,
  isTheme,
  resolveThemePreference,
  type Theme,
} from './theme-contract';

export const THEME_CHANGE_EVENT = 'u2tool:themechange';

export function getResolvedTheme(theme: Theme): 'light' | 'dark' {
  if (typeof window === 'undefined') {
    return resolveThemePreference(theme, false);
  }

  return resolveThemePreference(
    theme,
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
}

function createThemeStore() {
  const { subscribe, set, update } = writable<Theme>('system');
  let currentTheme: Theme = 'system';
  let listenersInitialized = false;

  return {
    subscribe,

    /**
     * Toggle between light and dark themes.
     * Saves the preference to localStorage and applies it immediately.
     */
    toggle() {
      update((current) => {
        currentTheme = current;
        const next: Theme = getResolvedTheme(currentTheme) === 'dark' ? 'light' : 'dark';
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(THEME_STORAGE_KEY, next);
        }
        currentTheme = next;
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

      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      currentTheme = isTheme(saved) ? saved : 'system';
      set(currentTheme);
      applyTheme(currentTheme);

      if (!listenersInitialized && typeof window !== 'undefined') {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleSystemThemeChange = () => {
          if (currentTheme === 'system') {
            applyTheme('system');
          }
        };
        const handleStorageChange = (event: StorageEvent) => {
          if (event.key !== null && event.key !== THEME_STORAGE_KEY) {
            return;
          }

          currentTheme = isTheme(event.newValue) ? event.newValue : 'system';
          set(currentTheme);
          applyTheme(currentTheme);
        };

        mediaQuery.addEventListener('change', handleSystemThemeChange);

        window.addEventListener('storage', handleStorageChange);
        listenersInitialized = true;
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

  const resolvedTheme = getResolvedTheme(theme);
  const isDark = resolvedTheme === 'dark';

  document.documentElement.classList.toggle('dark', isDark);
  document.documentElement.style.colorScheme = resolvedTheme;

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(THEME_CHANGE_EVENT, {
        detail: {
          theme,
          resolvedTheme,
        },
      })
    );
  }
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
export { THEME_STORAGE_KEY, type Theme };

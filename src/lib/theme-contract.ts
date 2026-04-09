export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'theme';

export function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark' || value === 'system';
}

export function resolveThemePreference(
  theme: Theme | null | undefined,
  prefersDark: boolean
): ResolvedTheme {
  if (theme === 'dark') {
    return 'dark';
  }

  if (theme === 'light') {
    return 'light';
  }

  return prefersDark ? 'dark' : 'light';
}

export function buildThemeInitScript(storageKey = THEME_STORAGE_KEY): string {
  const quotedStorageKey = JSON.stringify(storageKey);

  return `(function () {
  var t = localStorage.getItem(${quotedStorageKey});
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var resolvedTheme =
    t === 'dark' || ((t === 'system' || !t) && prefersDark)
      ? 'dark'
      : 'light';
  var d = resolvedTheme === 'dark';
  document.documentElement.classList.toggle('dark', d);
  document.documentElement.style.colorScheme = resolvedTheme;
})();`;
}

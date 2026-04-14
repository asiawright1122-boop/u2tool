<script lang="ts">
  /**
   * LanguageSelector.svelte
   *
   * Dropdown component for switching between the 10 supported locales.
   * On selection, navigates to the same page path with the new locale prefix.
   *
   * Requirements: 2.6
   */
  import { locales, getLocalizedPath } from '@/lib/i18n';
  import type { Locale } from '@/lib/i18n';

  interface Props {
    locale: string;
    currentPath: string;
  }

  let { locale, currentPath }: Props = $props();

  let open = $state(false);

  const localeLabels: Record<string, string> = {
    en: 'English',
    zh: '中文',
    ja: '日本語',
    ko: '한국어',
    es: 'Español',
    pt: 'Português',
    fr: 'Français',
    de: 'Deutsch',
    ru: 'Русский',
    ar: 'العربية',
  };

  function handleSelect(newLocale: string) {
    open = false;
    const path = getLocalizedPath(newLocale as Locale, currentPath);
    window.location.href = path;
  }

  function toggleDropdown() {
    open = !open;
  }

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.language-selector')) {
      open = false;
    }
  }
</script>

<svelte:window onclick={handleClickOutside} />

<div class="language-selector relative">
  <button
    onclick={toggleDropdown}
    class="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest
           hover:bg-slate-100 dark:hover:bg-white/5 transition-all duration-300
           text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-white/10"
    aria-label="Select language"
    aria-expanded={open}
  >
    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
    <span>{localeLabels[locale] || locale}</span>
    <svg class="w-3 h-3 transition-transform duration-300" class:rotate-180={open} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
    </svg>
  </button>

  {#if open}
    <div class="absolute top-full right-0 mt-2 w-48 glass-strong !bg-white/95 dark:!bg-slate-900/95
                border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl
                z-50 py-2 max-h-80 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-300">
      {#each locales as loc}
        <button
          onclick={() => handleSelect(loc)}
          class="w-full text-left px-5 py-2.5 text-xs font-bold uppercase tracking-widest transition-all duration-200
                 {loc === locale ? 'text-amber-600 dark:text-amber-500 bg-amber-500/10' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10'}"
        >
          {localeLabels[loc] || loc}
        </button>
      {/each}
    </div>
  {/if}
</div>

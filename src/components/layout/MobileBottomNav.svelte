<script lang="ts">
  /**
   * MobileBottomNav.svelte
   *
   * Bottom navigation bar for mobile devices (<768px).
   * Uses Lucide SVG icons instead of emoji.
   */
  import { getLocalizedPath } from '@/lib/i18n';
  import { getIconSvg } from '@/lib/icon-svg';
  import type { Locale } from '@/lib/i18n';
  import { getAiToolsDirectoryHref, getAiToolsDirectoryLabel } from '@/lib/ai-tools-navigation';

  interface Props {
    locale: string;
    navMessages?: Record<string, string>;
  }

  let { locale, navMessages = {} }: Props = $props();

  let homePath = $derived(getLocalizedPath(locale as Locale, '/'));
  let toolsPath = $derived(getLocalizedPath(locale as Locale, '/tools'));
  let aiToolsPath = $derived(getAiToolsDirectoryHref(locale as Locale));
  let aiToolsLabel = $derived(getAiToolsDirectoryLabel(locale as Locale));
</script>

<div class="mobile-bottom-nav md:hidden glass-nav !border-t-0 shadow-[0_-8px_30px_rgba(0,0,0,0.2)]">
  <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent dark:via-amber-500/20"></div>
  <div class="flex items-center justify-around py-3">
    <a href={homePath} class="flex min-w-0 flex-1 flex-col items-center gap-1.5 px-2 py-1 text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-500 transition-all active:scale-95 group/nav">
      <span class="mobile-nav-icon group-active/nav:scale-110">{@html getIconSvg('home', 22)}</span>
      <span class="max-w-full truncate text-center text-[9px] font-black uppercase tracking-[0.12em] opacity-80 group-hover/nav:opacity-100">{navMessages.home || 'Home'}</span>
    </a>
    <a href={toolsPath} class="flex min-w-0 flex-1 flex-col items-center gap-1.5 px-2 py-1 text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-500 transition-all active:scale-95 group/nav">
      <span class="mobile-nav-icon group-active/nav:scale-110">{@html getIconSvg('layout-grid', 22)}</span>
      <span class="max-w-full truncate text-center text-[9px] font-black uppercase tracking-[0.12em] opacity-80 group-hover/nav:opacity-100">{navMessages.tools || 'Tools'}</span>
    </a>
    <a href={aiToolsPath} data-ai-tools-mobile-nav class="flex min-w-0 flex-1 flex-col items-center gap-1.5 px-2 py-1 text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-all active:scale-95 group/nav" aria-label={aiToolsLabel}>
      <span class="mobile-nav-icon group-active/nav:scale-110">{@html getIconSvg('sparkle', 22)}</span>
      <span class="max-w-full truncate text-center text-[9px] font-black uppercase tracking-[0.12em] opacity-80 group-hover/nav:opacity-100">{aiToolsLabel}</span>
    </a>
    <a href={toolsPath} class="flex min-w-0 flex-1 flex-col items-center gap-1.5 px-2 py-1 text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-500 transition-all active:scale-95 group/nav">
      <span class="mobile-nav-icon group-active/nav:scale-110">{@html getIconSvg('folder', 22)}</span>
      <span class="max-w-full truncate text-center text-[9px] font-black uppercase tracking-[0.12em] opacity-80 group-hover/nav:opacity-100">{navMessages.categories || 'Categories'}</span>
    </a>
  </div>
</div>

<style>
  .mobile-nav-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
</style>

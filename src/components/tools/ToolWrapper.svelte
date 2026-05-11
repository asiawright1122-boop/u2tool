<script lang="ts">
  import type { Component } from 'svelte';
  import TOOL_IMPORT_MAP from './ToolImportMap';

  interface Props {
    slug: string;
    locale: string;
    translations: Record<string, unknown>;
  }

  let { slug, locale, translations }: Props = $props();

  type ToolComponent = Component<{
    slug?: string;
    locale: string;
    translations: Record<string, unknown>;
  }>;

  let loadedComponent = $state<ToolComponent | null>(null);
  let loading = $state(true);
  let error = $state<string | null>(null);

  // Only depend on slug: when slug changes, load the tool. Avoid reading loading/loadedComponent
  // here so that updating them in the importer callback does not re-trigger this effect.
  $effect(() => {
    const currentSlug = slug;
    loadedComponent = null;
    loading = true;
    error = null;

    const importer = TOOL_IMPORT_MAP[currentSlug];
    if (!importer) {
      error = `Tool not found: ${currentSlug}`;
      loading = false;
      return;
    }

    importer()
      .then((mod) => {
        loadedComponent = mod.default as ToolComponent;
        loading = false;
      })
      .catch((err) => {
        console.error(`[ToolWrapper] Failed to load tool ${currentSlug}:`, err);
        error = `Failed to load tool: ${currentSlug}`;
        loading = false;
      });
  });
</script>

{#if loading}
  <div class="flex flex-col items-center justify-center min-h-[350px] gap-6">
    <div class="relative w-16 h-16">
      <div class="absolute inset-0 rounded-full border-2 border-amber-500/10 dark:border-amber-500/5"></div>
      <div class="absolute inset-0 rounded-full border-t-2 border-amber-500 animate-spin shadow-[0_0_15px_rgba(245,158,11,0.3)]"></div>
    </div>
    <div class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600 animate-pulse">
      Initialising Engine
    </div>
  </div>
{:else if error}
  <div class="flex items-center justify-center min-h-[350px]">
    <div class="glass-card p-8 border-red-500/20 dark:border-red-500/30 text-center max-w-md">
      <div class="text-red-500 mb-4 flex justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      </div>
      <p class="text-slate-900 dark:text-white font-bold mb-2">{error}</p>
      <p class="text-sm text-slate-500 dark:text-slate-400">Please try refreshing the page or contact support if the problem persists.</p>
    </div>
  </div>
{:else if loadedComponent}
  {@const Component = loadedComponent}
  <Component {slug} {locale} {translations} />
{/if}

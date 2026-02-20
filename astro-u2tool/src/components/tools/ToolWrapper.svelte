<script lang="ts">
  import type { Component } from 'svelte';
  import TOOL_IMPORT_MAP from './ToolImportMap';

  interface Props {
    slug: string;
    locale: string;
    translations: Record<string, unknown>;
  }

  let { slug, locale, translations }: Props = $props();

  type ToolComponent = Component<{ locale: string; translations: Record<string, unknown> }>;

  let loadedComponent = $state<ToolComponent | null>(null);
  let loading = $state(true);
  let error = $state<string | null>(null);

  $effect(() => {
    loadedComponent = null;
    loading = true;
    error = null;

    const importer = TOOL_IMPORT_MAP[slug];
    if (!importer) {
      error = `Tool not found: ${slug}`;
      loading = false;
      return;
    }

    importer()
      .then((mod) => {
        loadedComponent = mod.default;
        loading = false;
      })
      .catch((err) => {
        console.error(`Failed to load tool ${slug}:`, err);
        error = `Failed to load tool: ${slug}`;
        loading = false;
      });
  });
</script>

{#if loading}
  <div class="flex items-center justify-center min-h-[300px]">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>
{:else if error}
  <div class="flex items-center justify-center min-h-[300px] text-red-500">
    <p>{error}</p>
  </div>
{:else if loadedComponent}
  <svelte:component this={loadedComponent} {locale} {translations} />
{/if}

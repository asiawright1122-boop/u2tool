<script lang="ts">
  import type { Component } from 'svelte';
  import { AlertCircle, RotateCw } from 'lucide-svelte';
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
  let loadGeneration = 0;

  const stateCopy: Record<string, { failed: string; retry: string }> = {
    ar: { failed: 'تعذر تحميل الأداة.', retry: 'إعادة المحاولة' },
    de: { failed: 'Das Tool konnte nicht geladen werden.', retry: 'Erneut versuchen' },
    en: { failed: 'The tool could not be loaded.', retry: 'Try again' },
    es: { failed: 'No se pudo cargar la herramienta.', retry: 'Intentar de nuevo' },
    fr: { failed: "L’outil n’a pas pu être chargé.", retry: 'Réessayer' },
    ja: { failed: 'ツールを読み込めませんでした。', retry: '再試行' },
    ko: { failed: '도구를 불러오지 못했습니다.', retry: '다시 시도' },
    pt: { failed: 'Não foi possível carregar a ferramenta.', retry: 'Tentar novamente' },
    ru: { failed: 'Не удалось загрузить инструмент.', retry: 'Повторить' },
    zh: { failed: '工具加载失败。', retry: '重试' },
  };

  function toolLabel(key: string, fallback: string): string {
    const tools = translations.tools;
    if (!tools || typeof tools !== 'object' || Array.isArray(tools)) return fallback;
    const value = (tools as Record<string, unknown>)[key];
    return typeof value === 'string' ? value : fallback;
  }

  async function loadTool(currentSlug: string) {
    const generation = ++loadGeneration;
    loadedComponent = null;
    loading = true;
    error = null;

    const importer = TOOL_IMPORT_MAP[currentSlug];
    if (!importer) {
      error = currentSlug;
      loading = false;
      return;
    }

    try {
      const mod = await importer();
      if (generation !== loadGeneration || currentSlug !== slug) return;
      loadedComponent = mod.default as ToolComponent;
    } catch (err) {
      console.error(`[ToolWrapper] Failed to load tool ${currentSlug}:`, err);
      if (generation !== loadGeneration || currentSlug !== slug) return;
      error = currentSlug;
    } finally {
      if (generation === loadGeneration && currentSlug === slug) loading = false;
    }
  }

  // Only depend on slug: when slug changes, load the tool. Avoid reading loading/loadedComponent
  // here so that updating them in the importer callback does not re-trigger this effect.
  $effect(() => {
    const currentSlug = slug;
    void loadTool(currentSlug);
  });
</script>

{#if loading}
  <div class="min-h-[350px] animate-pulse" role="status" aria-live="polite">
    <span class="sr-only">{toolLabel('loading', 'Loading...')}</span>
    <div class="h-10 w-2/5 rounded-xl bg-slate-200/70 dark:bg-white/10"></div>
    <div class="mt-7 h-28 rounded-2xl bg-slate-100 dark:bg-white/5"></div>
    <div class="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div class="h-14 rounded-xl bg-slate-100 dark:bg-white/5"></div>
      <div class="h-14 rounded-xl bg-slate-100 dark:bg-white/5"></div>
    </div>
  </div>
{:else if error}
  <div class="flex items-center justify-center min-h-[350px]">
    <div class="glass-card p-8 border-red-500/20 dark:border-red-500/30 text-center max-w-md">
      <div class="text-red-500 mb-4 flex justify-center">
        <AlertCircle size={32} aria-hidden="true" />
      </div>
      <p class="text-slate-900 dark:text-white font-bold mb-5">
        {stateCopy[locale]?.failed || stateCopy.en.failed}
      </p>
      <button
        type="button"
        onclick={() => void loadTool(slug)}
        class="btn-primary inline-flex items-center gap-2 !px-5 !py-2.5 !text-xs"
      >
        <RotateCw size={15} aria-hidden="true" />
        {stateCopy[locale]?.retry || stateCopy.en.retry}
      </button>
    </div>
  </div>
{:else if loadedComponent}
  {@const Component = loadedComponent}
  <Component {slug} {locale} {translations} />
{/if}

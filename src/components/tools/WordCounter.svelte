<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string, fallback?: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : fallback ?? `MISSING: tools.${key}`;
  }

  let text = $state('');

  let stats = $derived.by(() => {
    const trimmed = text.trim();
    return {
      characters: text.length,
      charactersNoSpaces: text.replace(/\s/g, '').length,
      words: trimmed ? trimmed.split(/\s+/).length : 0,
      sentences: trimmed ? (trimmed.match(/[.!?]+/g) || []).length || (trimmed.length > 0 ? 1 : 0) : 0,
      paragraphs: trimmed ? trimmed.split(/\n\n+/).filter(p => p.trim()).length : 0,
      lines: trimmed ? trimmed.split('\n').length : 0,
    };
  });
  const charactersNoSpacesLabel = $derived(
    t('wordCounter.charactersNoSpaces', locale === 'es' ? 'Caracteres sin espacios' : 'Characters without spaces')
  );
  const linesLabel = $derived(t('wordCounter.lines', locale === 'es' ? 'Líneas' : 'Lines'));

</script>

{#snippet StatCard(label: string, value: number)}
  <div class="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-center">
    <div class="text-2xl font-bold text-amber-600 dark:text-amber-400">{value}</div>
    <div class="text-sm text-gray-600 dark:text-gray-300">{label}</div>
  </div>
{/snippet}


    <div class="space-y-4">
      <div>
        <label for="word-counter-field-2" class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{t('input')}</label>
        <textarea
          class="tool-textarea h-64"
          bind:value={text}
          placeholder={t('inputPlaceholder')} id="word-counter-field-2"></textarea>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        {@render StatCard(t('wordCounter.words'), stats.words)}
        {@render StatCard(t('wordCounter.characters'), stats.characters)}
        {@render StatCard(charactersNoSpacesLabel, stats.charactersNoSpaces)}
        {@render StatCard(t('wordCounter.sentences'), stats.sentences)}
        {@render StatCard(t('wordCounter.paragraphs'), stats.paragraphs)}
        {@render StatCard(linesLabel, stats.lines)}
      </div>

      <button
        onclick={() => text = ''}
        class="btn-secondary"
      >
        {t('clear')}
      </button>
    </div>
  

<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
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

</script>


    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{t('input')}</label>
        <textarea
          class="tool-textarea h-64"
          bind:value={text}
          placeholder={t('inputPlaceholder')}></textarea>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard label={t('wordCounter.words')} value={stats.words} />
        <StatCard label={t('wordCounter.characters')} value={stats.characters} />
        <StatCard label={t('wordCounter.characters')} value={stats.charactersNoSpaces} />
        <StatCard label={t('wordCounter.sentences')} value={stats.sentences} />
        <StatCard label={t('wordCounter.paragraphs')} value={stats.paragraphs} />
        <StatCard label="Lines" value={stats.lines} />
      </div>

      <button
        onclick={() => text = ''}
        class="btn-secondary"
      >
        {t('clear')}
      </button>
    </div>
  

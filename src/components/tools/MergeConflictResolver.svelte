<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  type ResolveMode = 'current' | 'incoming' | 'both';

  let { locale, translations }: Props = $props();

  function t(key: string): string {
    const scope = (translations['tools']['merge-conflict-resolver'] as Record<string, unknown>) || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) value = (value as Record<string, unknown>)?.[k];
    return typeof value === 'string' ? value : `MISSING: tools.merge-conflict-resolver.${key}`;
  }

  function tCommon(key: string): string {
    const scope = (translations['tools'] as Record<string, unknown>) || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) value = (value as Record<string, unknown>)?.[k];
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  const SAMPLE_CONFLICT = [
    'function greet() {',
    '<<<<<<< HEAD',
    '  return \"Hello from current branch\";',
    '=======',
    '  return \"Hello from incoming branch\";',
    '>>>>>>> feature/new-greeting',
    '}',
  ].join('\n');

  let input = $state(SAMPLE_CONFLICT);
  let mode = $state<ResolveMode>('current');
  let copied = $state(false);

  function resolveConflictText(content: string, resolveMode: ResolveMode): string {
    const lines = content.split(/\r?\n/);
    const result: string[] = [];
    let state: 'normal' | 'current' | 'incoming' = 'normal';
    let currentChunk: string[] = [];
    let incomingChunk: string[] = [];

    for (const line of lines) {
      if (line.startsWith('<<<<<<<')) {
        state = 'current';
        currentChunk = [];
        incomingChunk = [];
        continue;
      }

      if (state === 'current' && line.startsWith('=======')) {
        state = 'incoming';
        continue;
      }

      if (state === 'incoming' && line.startsWith('>>>>>>>')) {
        if (resolveMode === 'current') result.push(...currentChunk);
        if (resolveMode === 'incoming') result.push(...incomingChunk);
        if (resolveMode === 'both') result.push(...currentChunk, ...incomingChunk);
        state = 'normal';
        continue;
      }

      if (state === 'current') {
        currentChunk.push(line);
        continue;
      }

      if (state === 'incoming') {
        incomingChunk.push(line);
        continue;
      }

      result.push(line);
    }

    // If conflict markers are broken, keep original text to avoid destructive output.
    if (state !== 'normal') {
      return content;
    }

    return result.join('\n');
  }

  let output = $derived.by(() => resolveConflictText(input, mode));

  async function copyOutput() {
    await navigator.clipboard.writeText(output);
    copied = true;
    setTimeout(() => {
      copied = false;
    }, 1800);
  }

  function clearAll() {
    input = '';
  }
</script>

<div class="space-y-4">
  <div class="flex flex-wrap gap-2">
    <button
      onclick={() => (mode = 'current')}
      class={`px-3 py-1.5 rounded ${mode === 'current' ? 'bg-amber-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
    >
      {t('useCurrent') || 'Use current'}
    </button>
    <button
      onclick={() => (mode = 'incoming')}
      class={`px-3 py-1.5 rounded ${mode === 'incoming' ? 'bg-amber-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
    >
      {t('useIncoming') || 'Use incoming'}
    </button>
    <button
      onclick={() => (mode = 'both')}
      class={`px-3 py-1.5 rounded ${mode === 'both' ? 'bg-amber-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
    >
      {t('keepBoth') || 'Keep both'}
    </button>
  </div>

  <div>
    <label for="merge-conflict-input" class="block text-sm font-medium mb-2">
      {t('input') || 'Conflict Input'}
    </label>
    <textarea
      id="merge-conflict-input"
      bind:value={input}
      rows={10}
      class="tool-textarea font-mono"
      placeholder={t('inputPlaceholder') || 'Paste conflicted file content here'}
    ></textarea>
  </div>

  <div class="flex gap-2">
    <button onclick={clearAll} class="btn-secondary">{tCommon('clear') || 'Clear'}</button>
    <button onclick={copyOutput} class="btn-primary">
      {copied ? tCommon('copied') || 'Copied' : tCommon('copy') || 'Copy'}
    </button>
  </div>

  <div>
    <label for="merge-conflict-output" class="block text-sm font-medium mb-2">
      {t('output') || 'Resolved Output'}
    </label>
    <textarea
      id="merge-conflict-output"
      value={output}
      rows={10}
      readonly
      class="tool-textarea font-mono"
    ></textarea>
  </div>
</div>

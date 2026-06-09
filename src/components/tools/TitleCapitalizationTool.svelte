<script lang="ts">
  import { Check, Copy, RefreshCw } from 'lucide-svelte';
  import { onDestroy } from 'svelte';

  interface Props {
    locale?: string;
    translations?: Record<string, unknown>;
  }

  let { locale = 'en', translations = {} }: Props = $props();

  const COPY = {
    title: 'Title Capitalization Tool',
    subtitle: 'Convert headlines to title case, sentence case, uppercase, or lowercase.',
    input: 'Title or headline',
    style: 'Capitalization style',
    titleCase: 'Title Case',
    sentenceCase: 'Sentence case',
    uppercase: 'UPPERCASE',
    lowercase: 'lowercase',
    output: 'Converted title',
    copy: 'Copy',
    copied: 'Copied',
    reset: 'Reset',
    words: 'Words',
    chars: 'Characters',
    currentStyle: 'Current style',
    localNote: 'Runs locally with deterministic capitalization rules. No AI API is called.',
  };

  let title = $state('how to build a better content workflow with AI tools');
  let style = $state('title');
  let copied = $state(false);
  let copyTimer: ReturnType<typeof setTimeout> | null = null;

  const output = $derived(convertTitle(title, style));
  const wordCount = $derived(title.trim() ? title.trim().split(/\s+/).length : 0);

  onDestroy(() => {
    if (copyTimer) {
      clearTimeout(copyTimer);
    }
  });

  function convertTitle(value: string, selectedStyle: string) {
    if (selectedStyle === 'upper') {
      return value.toUpperCase();
    }
    if (selectedStyle === 'lower') {
      return value.toLowerCase();
    }
    if (selectedStyle === 'sentence') {
      return sentenceCase(value);
    }

    return titleCase(value);
  }

  function sentenceCase(value: string) {
    return value
      .toLowerCase()
      .replace(/(^\s*[a-z]|[.!?]\s+[a-z])/g, (match) => match.toUpperCase());
  }

  function titleCase(value: string) {
    const smallWords = new Set(['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'nor', 'of', 'on', 'or', 'per', 'the', 'to', 'vs', 'via']);
    const words = value.split(/(\s+)/);

    return words
      .map((word, index) => {
        if (/^\s+$/.test(word)) {
          return word;
        }

        const normalized = word.toLowerCase();
        const isEdge = index === 0 || index === words.length - 1;
        const previousWord = words.slice(0, index).reverse().find((part) => !/^\s+$/.test(part));
        const followsBreak = previousWord ? /[:.!?]$/.test(previousWord) : false;

        if (!isEdge && !followsBreak && smallWords.has(normalized)) {
          return normalized;
        }

        return capitalizeWord(word);
      })
      .join('');
  }

  function capitalizeWord(value: string) {
    return value.replace(/[a-z][a-z']*/gi, (part) => {
      if (/^[A-Z0-9]{2,}$/.test(part)) {
        return part;
      }
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    });
  }

  async function copyOutput() {
    if (!output) {
      return;
    }

    await navigator.clipboard.writeText(output);
    copied = true;
    if (copyTimer) {
      clearTimeout(copyTimer);
    }
    copyTimer = setTimeout(() => {
      copied = false;
    }, 1800);
  }

  function resetForm() {
    title = 'how to build a better content workflow with AI tools';
    style = 'title';
  }
</script>

<div class="space-y-6">
  <div>
    <h2 class="text-xl font-bold text-slate-900 dark:text-white">{COPY.title}</h2>
    <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">{COPY.subtitle}</p>
  </div>

  <div>
    <label for="title-capitalization-input" class="tool-label">{COPY.input}</label>
    <textarea
      id="title-capitalization-input"
      class="tool-input min-h-28"
      bind:value={title}
      placeholder="how to write better email subject lines"
    ></textarea>
  </div>

  <div>
    <label for="title-capitalization-style" class="tool-label">{COPY.style}</label>
    <select id="title-capitalization-style" class="tool-input" bind:value={style}>
      <option value="title">{COPY.titleCase}</option>
      <option value="sentence">{COPY.sentenceCase}</option>
      <option value="upper">{COPY.uppercase}</option>
      <option value="lower">{COPY.lowercase}</option>
    </select>
  </div>

  <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
    <div class="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
      <div class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{COPY.words}</div>
      <div class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{wordCount}</div>
    </div>
    <div class="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
      <div class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{COPY.chars}</div>
      <div class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{title.length}</div>
    </div>
    <div class="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
      <div class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{COPY.currentStyle}</div>
      <div class="mt-1 text-lg font-bold text-slate-900 dark:text-white">
        {style === 'sentence' ? COPY.sentenceCase : style === 'upper' ? COPY.uppercase : style === 'lower' ? COPY.lowercase : COPY.titleCase}
      </div>
    </div>
  </div>

  <div>
    <div class="tool-label">{COPY.output}</div>
    <pre class="min-h-28 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-4 text-base text-slate-900 whitespace-pre-wrap break-words dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">{output}</pre>
  </div>

  <div class="flex flex-wrap gap-3">
    <button type="button" class="btn-primary inline-flex items-center gap-2" onclick={copyOutput} disabled={!output}>
      {#if copied}
        <Check class="h-4 w-4" aria-hidden="true" />
        {COPY.copied}
      {:else}
        <Copy class="h-4 w-4" aria-hidden="true" />
        {COPY.copy}
      {/if}
    </button>
    <button type="button" class="btn-secondary inline-flex items-center gap-2" onclick={resetForm}>
      <RefreshCw class="h-4 w-4" aria-hidden="true" />
      {COPY.reset}
    </button>
  </div>

  <p class="text-xs font-medium text-slate-500 dark:text-slate-400">{COPY.localNote}</p>
</div>

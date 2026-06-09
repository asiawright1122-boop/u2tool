<script lang="ts">
  import { Check, Copy, RefreshCw } from 'lucide-svelte';
  import { onDestroy } from 'svelte';

  interface Props {
    translations?: Record<string, unknown>;
  }

  let { translations = {} }: Props = $props();

  const COPY = {
    title: 'YouTube Tags Generator',
    subtitle: 'Create a comma-separated YouTube tag list from a topic, keyword, and audience.',
    topic: 'Video topic',
    keyword: 'Target keyword',
    audience: 'Audience',
    output: 'Comma-separated tags',
    tags: 'Generated tags',
    copy: 'Copy tags',
    copied: 'Copied',
    reset: 'Reset',
    count: 'Tag count',
    localNote: 'Generated locally from templates. This does not use live YouTube search volume or trend data.',
  };

  let topic = $state('beginner workflow automation with no-code tools');
  let keyword = $state('workflow automation');
  let audience = $state('small business owners');
  let copied = $state(false);
  let copyTimer: ReturnType<typeof setTimeout> | null = null;

  const title = $derived(getToolMessage('name', COPY.title));
  const description = $derived(getToolMessage('description', COPY.subtitle));
  const tags = $derived(generateTags(topic, keyword, audience));
  const output = $derived(tags.join(', '));

  onDestroy(() => {
    if (copyTimer) {
      clearTimeout(copyTimer);
    }
  });

  function getToolMessage(key: string, fallback: string) {
    const toolsScope = translations.tools as Record<string, unknown> | undefined;
    const toolScope = toolsScope?.['youtube-tags-generator'] as Record<string, unknown> | undefined;
    const value = toolScope?.[key];
    return typeof value === 'string' ? value : fallback;
  }

  function normalize(value: string) {
    return value.trim().replace(/\s+/g, ' ');
  }

  function compact(value: string) {
    return normalize(value).toLowerCase();
  }

  function unique(values: string[]) {
    const seen = new Set<string>();
    return values
      .map(normalize)
      .filter(Boolean)
      .filter((value) => {
        const key = value.toLowerCase();
        if (seen.has(key)) {
          return false;
        }
        seen.add(key);
        return true;
      });
  }

  function generateTags(videoTopic: string, targetKeyword: string, targetAudience: string) {
    const safeTopic = compact(videoTopic) || 'video topic';
    const safeKeyword = compact(targetKeyword) || safeTopic;
    const safeAudience = compact(targetAudience) || 'viewers';
    const topicWords = safeTopic.split(/\s+/).filter((word) => word.length > 3).slice(0, 5);

    return unique([
      safeKeyword,
      safeTopic,
      `${safeKeyword} tutorial`,
      `${safeKeyword} tips`,
      `${safeKeyword} guide`,
      `${safeKeyword} for beginners`,
      `${safeTopic} tutorial`,
      `${safeTopic} explained`,
      `${safeTopic} examples`,
      `${safeTopic} step by step`,
      `${safeTopic} for ${safeAudience}`,
      `${safeAudience} ${safeKeyword}`,
      `${safeAudience} guide`,
      ...topicWords.map((word) => `${word} tips`),
      ...topicWords.map((word) => `${word} tutorial`),
    ]).slice(0, 24);
  }

  async function copyTags() {
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
    topic = 'beginner workflow automation with no-code tools';
    keyword = 'workflow automation';
    audience = 'small business owners';
  }
</script>

<div class="space-y-6">
  <div>
    <h2 class="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
    <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">{description}</p>
  </div>

  <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
    <div>
      <label for="youtube-tags-topic" class="tool-label">{COPY.topic}</label>
      <input id="youtube-tags-topic" class="tool-input" type="text" bind:value={topic} />
    </div>
    <div>
      <label for="youtube-tags-keyword" class="tool-label">{COPY.keyword}</label>
      <input id="youtube-tags-keyword" class="tool-input" type="text" bind:value={keyword} />
    </div>
    <div>
      <label for="youtube-tags-audience" class="tool-label">{COPY.audience}</label>
      <input id="youtube-tags-audience" class="tool-input" type="text" bind:value={audience} />
    </div>
  </div>

  <div class="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
    <div class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{COPY.count}</div>
    <div class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{tags.length}</div>
  </div>

  <div>
    <div class="tool-label">{COPY.tags}</div>
    <div class="flex flex-wrap gap-2 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
      {#each tags as tag}
        <span class="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          {tag}
        </span>
      {/each}
    </div>
  </div>

  <div>
    <div class="tool-label">{COPY.output}</div>
    <pre class="min-h-28 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 whitespace-pre-wrap break-words dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">{output}</pre>
  </div>

  <div class="flex flex-wrap gap-3">
    <button type="button" class="btn-primary inline-flex items-center gap-2" onclick={copyTags}>
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

<script lang="ts">
  import { AlertCircle, Check, Copy, RefreshCw } from 'lucide-svelte';
  import { onDestroy } from 'svelte';
  import { buildJsonToPrompt } from '@/lib/ai-prompt-workflow-tools';

  interface Props {
    locale?: string;
    translations?: Record<string, unknown>;
  }

  let { locale = 'en', translations = {} }: Props = $props();

  const copyByLocale = {
    en: {
      title: 'JSON to Prompt',
      description: 'Convert JSON, API responses, and config snippets into prompts grounded in the actual data shape.',
      json: 'JSON input',
      jsonPlaceholder: 'Paste valid JSON here',
      task: 'AI task',
      audience: 'Audience',
      outputFormat: 'Output format',
      includeSchema: 'Include schema summary',
      prompt: 'Generated prompt',
      schema: 'Detected JSON shape',
      keys: 'Keys',
      arrays: 'Arrays',
      type: 'Top type',
      copy: 'Copy prompt',
      copied: 'Copied',
      reset: 'Reset',
      localNote: 'Parsing happens locally in your browser. This tool does not send your JSON to an AI service.',
    },
    zh: {
      title: 'JSON 转 Prompt',
      description: '把 JSON、API 返回和配置片段转换成基于真实数据结构的 AI 提示词。',
      json: 'JSON 输入',
      jsonPlaceholder: '在这里粘贴有效 JSON',
      task: 'AI 任务',
      audience: '受众',
      outputFormat: '输出格式',
      includeSchema: '包含结构摘要',
      prompt: '生成的提示词',
      schema: '识别出的 JSON 结构',
      keys: '字段',
      arrays: '数组',
      type: '顶层类型',
      copy: '复制提示词',
      copied: '已复制',
      reset: '重置',
      localNote: 'JSON 解析在浏览器本地完成，不会把你的 JSON 发送给 AI 服务。',
    },
  } as const;

  const sampleJson = `{
  "users": [
    { "id": 1, "name": "Ada", "plan": "pro" },
    { "id": 2, "name": "Lin", "plan": "free" }
  ],
  "meta": { "source": "billing-export" }
}`;

  const copy = $derived(locale === 'zh' ? copyByLocale.zh : copyByLocale.en);

  let jsonText = $state(sampleJson);
  let task = $state('Summarize plan distribution and flag useful follow-up segments');
  let audience = $state('product and growth team');
  let outputFormat = $state('Markdown summary with a small table and action bullets');
  let includeSchema = $state(true);
  let copied = $state(false);
  let copyTimer: ReturnType<typeof setTimeout> | null = null;

  const title = $derived(getToolMessage('name', copy.title));
  const description = $derived(getToolMessage('description', copy.description));
  const result = $derived(buildJsonToPrompt({ audience, includeSchema, jsonText, outputFormat, task }));

  onDestroy(() => {
    if (copyTimer) clearTimeout(copyTimer);
  });

  function getToolMessage(key: string, fallback: string): string {
    const toolsScope = translations.tools as Record<string, unknown> | undefined;
    const toolScope = toolsScope?.['json-to-prompt'] as Record<string, unknown> | undefined;
    const value = toolScope?.[key];
    return typeof value === 'string' ? value : fallback;
  }

  async function copyPrompt() {
    if (!result.prompt) return;
    await navigator.clipboard.writeText(result.prompt);
    copied = true;
    if (copyTimer) clearTimeout(copyTimer);
    copyTimer = setTimeout(() => {
      copied = false;
    }, 1800);
  }

  function resetForm() {
    jsonText = sampleJson;
    task = 'Summarize plan distribution and flag useful follow-up segments';
    audience = 'product and growth team';
    outputFormat = 'Markdown summary with a small table and action bullets';
    includeSchema = true;
  }
</script>

<div class="space-y-6">
  <div>
    <h2 class="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
    <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">{description}</p>
  </div>

  <div class="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
    <section class="space-y-4">
      <div>
        <label for="json-to-prompt-input" class="tool-label">{copy.json}</label>
        <textarea
          id="json-to-prompt-input"
          class="tool-textarea h-72 resize-y"
          placeholder={copy.jsonPlaceholder}
          bind:value={jsonText}
        ></textarea>
      </div>

      <div>
        <label for="json-to-prompt-task" class="tool-label">{copy.task}</label>
        <input id="json-to-prompt-task" class="tool-input" type="text" bind:value={task} />
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label for="json-to-prompt-audience" class="tool-label">{copy.audience}</label>
          <input id="json-to-prompt-audience" class="tool-input" type="text" bind:value={audience} />
        </div>
        <div>
          <label for="json-to-prompt-format" class="tool-label">{copy.outputFormat}</label>
          <input id="json-to-prompt-format" class="tool-input" type="text" bind:value={outputFormat} />
        </div>
      </div>

      <label class="inline-flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white/60 px-4 py-3 text-sm font-bold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
        <input
          type="checkbox"
          bind:checked={includeSchema}
          class="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500/20"
        />
        {copy.includeSchema}
      </label>
    </section>

    <section class="space-y-4">
      <div class="grid grid-cols-3 gap-3">
        <div class="rounded-xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
          <div class="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{copy.keys}</div>
          <div class="mt-1 text-2xl font-black text-slate-900 dark:text-white">{result.keyCount}</div>
        </div>
        <div class="rounded-xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
          <div class="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{copy.arrays}</div>
          <div class="mt-1 text-2xl font-black text-slate-900 dark:text-white">{result.arrayCount}</div>
        </div>
        <div class="rounded-xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
          <div class="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{copy.type}</div>
          <div class="mt-1 truncate text-base font-black text-slate-900 dark:text-white">{result.topLevelType}</div>
        </div>
      </div>

      {#if result.error}
        <div class="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 dark:border-red-400/30 dark:bg-red-950/20 dark:text-red-200">
          <AlertCircle class="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <span>{result.error}</span>
        </div>
      {:else}
        <div class="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
          <h3 class="text-sm font-black text-slate-900 dark:text-white">{copy.schema}</h3>
          <ul class="mt-3 max-h-44 space-y-1 overflow-auto text-xs font-mono leading-5 text-slate-600 dark:text-slate-300">
            {#each result.schemaSummary as line}
              <li>{line}</li>
            {/each}
          </ul>
        </div>
      {/if}

      <div>
        <div class="tool-label">{copy.prompt}</div>
        <pre class="min-h-80 overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 whitespace-pre-wrap break-words text-slate-900 dark:border-white/10 dark:bg-slate-950 dark:text-slate-100">{result.prompt}</pre>
      </div>
    </section>
  </div>

  <div class="flex flex-wrap gap-3">
    <button type="button" class="btn-primary inline-flex items-center gap-2" onclick={copyPrompt} disabled={!result.prompt}>
      {#if copied}
        <Check class="h-4 w-4" aria-hidden="true" />
        {copy.copied}
      {:else}
        <Copy class="h-4 w-4" aria-hidden="true" />
        {copy.copy}
      {/if}
    </button>
    <button type="button" class="btn-secondary inline-flex items-center gap-2" onclick={resetForm}>
      <RefreshCw class="h-4 w-4" aria-hidden="true" />
      {copy.reset}
    </button>
  </div>

  <p class="text-xs font-medium text-slate-500 dark:text-slate-400">{copy.localNote}</p>
</div>

<script lang="ts">
  import { Check, Copy, RefreshCw } from 'lucide-svelte';
  import { onDestroy } from 'svelte';
  import { generateAiPromptTemplate } from '@/lib/ai-prompt-workflow-tools';

  interface Props {
    locale?: string;
    translations?: Record<string, unknown>;
  }

  let { locale = 'en', translations = {} }: Props = $props();

  const copyByLocale = {
    en: {
      title: 'AI Prompt Template Generator',
      description: 'Create reusable prompt templates with variables, constraints, example values, and a review checklist.',
      task: 'Task',
      variables: 'Variables',
      variablesPlaceholder: 'topic, audience, source notes',
      tone: 'Tone',
      outputFormat: 'Output format',
      constraints: 'Constraints',
      includeExample: 'Include example values',
      template: 'Prompt template',
      example: 'Example prompt',
      variableTable: 'Variable table',
      checklist: 'Template checklist',
      words: 'Words',
      variableCount: 'Variables',
      copy: 'Copy template',
      copied: 'Copied',
      reset: 'Reset',
      localNote: 'Template generation is local and deterministic. Review placeholders before sending to an AI model.',
    },
    zh: {
      title: 'AI Prompt 模板生成器',
      description: '生成带变量、约束、示例值和检查清单的可复用 AI Prompt 模板。',
      task: '任务',
      variables: '变量',
      variablesPlaceholder: 'topic, audience, source notes',
      tone: '语气',
      outputFormat: '输出格式',
      constraints: '约束',
      includeExample: '包含示例值',
      template: 'Prompt 模板',
      example: '示例 Prompt',
      variableTable: '变量表',
      checklist: '模板检查清单',
      words: '词数',
      variableCount: '变量',
      copy: '复制模板',
      copied: '已复制',
      reset: '重置',
      localNote: '模板在本地确定性生成。发送给 AI 模型前请检查所有占位符。',
    },
  } as const;

  const copy = $derived(locale === 'zh' ? copyByLocale.zh : copyByLocale.en);

  let task = $state('Create a launch brief for {{topic}}');
  let variablesText = $state('topic, audience, source notes, launch date');
  let tone = $state('concise product strategist');
  let outputFormat = $state('Markdown brief with a table, risks, and action bullets');
  let constraints = $state('separate facts from assumptions, avoid unsupported claims, keep the final checklist practical');
  let includeExample = $state(true);
  let copied = $state(false);
  let copyTimer: ReturnType<typeof setTimeout> | null = null;

  const title = $derived(getToolMessage('name', copy.title));
  const description = $derived(getToolMessage('description', copy.description));
  const result = $derived(generateAiPromptTemplate({
    constraints,
    includeExample,
    outputFormat,
    task,
    tone,
    variablesText,
  }));

  onDestroy(() => {
    if (copyTimer) clearTimeout(copyTimer);
  });

  function getToolMessage(key: string, fallback: string): string {
    const toolsScope = translations.tools as Record<string, unknown> | undefined;
    const toolScope = toolsScope?.['ai-prompt-template-generator'] as Record<string, unknown> | undefined;
    const value = toolScope?.[key];
    return typeof value === 'string' ? value : fallback;
  }

  async function copyTemplate() {
    await navigator.clipboard.writeText(result.examplePrompt);
    copied = true;
    if (copyTimer) clearTimeout(copyTimer);
    copyTimer = setTimeout(() => {
      copied = false;
    }, 1800);
  }

  function resetForm() {
    task = 'Create a launch brief for {{topic}}';
    variablesText = 'topic, audience, source notes, launch date';
    tone = 'concise product strategist';
    outputFormat = 'Markdown brief with a table, risks, and action bullets';
    constraints = 'separate facts from assumptions, avoid unsupported claims, keep the final checklist practical';
    includeExample = true;
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
        <label for="prompt-template-task" class="tool-label">{copy.task}</label>
        <input id="prompt-template-task" class="tool-input" type="text" bind:value={task} />
      </div>
      <div>
        <label for="prompt-template-variables" class="tool-label">{copy.variables}</label>
        <textarea
          id="prompt-template-variables"
          class="tool-textarea h-28 resize-y"
          placeholder={copy.variablesPlaceholder}
          bind:value={variablesText}
        ></textarea>
      </div>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label for="prompt-template-tone" class="tool-label">{copy.tone}</label>
          <input id="prompt-template-tone" class="tool-input" type="text" bind:value={tone} />
        </div>
        <div>
          <label for="prompt-template-format" class="tool-label">{copy.outputFormat}</label>
          <input id="prompt-template-format" class="tool-input" type="text" bind:value={outputFormat} />
        </div>
      </div>
      <div>
        <label for="prompt-template-constraints" class="tool-label">{copy.constraints}</label>
        <textarea id="prompt-template-constraints" class="tool-textarea h-28 resize-y" bind:value={constraints}></textarea>
      </div>
      <label class="inline-flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white/60 px-4 py-3 text-sm font-bold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
        <input
          type="checkbox"
          bind:checked={includeExample}
          class="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500/20"
        />
        {copy.includeExample}
      </label>
    </section>

    <section class="space-y-4">
      <div class="grid grid-cols-2 gap-3">
        <div class="rounded-xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
          <div class="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{copy.words}</div>
          <div class="mt-1 text-2xl font-black text-slate-900 dark:text-white">{result.wordCount}</div>
        </div>
        <div class="rounded-xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
          <div class="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{copy.variableCount}</div>
          <div class="mt-1 text-2xl font-black text-slate-900 dark:text-white">{result.variableCount}</div>
        </div>
      </div>

      <div>
        <div class="tool-label">{includeExample ? copy.example : copy.template}</div>
        <pre class="min-h-80 overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 whitespace-pre-wrap break-words text-slate-900 dark:border-white/10 dark:bg-slate-950 dark:text-slate-100">{result.examplePrompt}</pre>
      </div>
    </section>
  </div>

  <div class="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]">
    <section class="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
      <h3 class="text-sm font-black text-slate-900 dark:text-white">{copy.variableTable}</h3>
      <div class="mt-3 overflow-x-auto">
        <table class="w-full min-w-[520px] text-left text-xs">
          <thead class="text-slate-500 dark:text-slate-400">
            <tr>
              <th class="py-2 pr-4 font-black uppercase tracking-[0.14em]">Name</th>
              <th class="py-2 pr-4 font-black uppercase tracking-[0.14em]">Placeholder</th>
              <th class="py-2 pr-4 font-black uppercase tracking-[0.14em]">Example</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 text-slate-700 dark:divide-white/10 dark:text-slate-300">
            {#each result.variables as variable}
              <tr>
                <td class="py-2 pr-4 font-bold">{variable.name}</td>
                <td class="py-2 pr-4 font-mono">{variable.placeholder}</td>
                <td class="py-2 pr-4">{variable.example}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </section>

    <section class="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
      <h3 class="text-sm font-black text-slate-900 dark:text-white">{copy.checklist}</h3>
      <ul class="mt-3 space-y-2 text-xs font-medium leading-5 text-slate-600 dark:text-slate-300">
        {#each result.checklist as item}
          <li>{item}</li>
        {/each}
      </ul>
    </section>
  </div>

  <div class="flex flex-wrap gap-3">
    <button type="button" class="btn-primary inline-flex items-center gap-2" onclick={copyTemplate}>
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

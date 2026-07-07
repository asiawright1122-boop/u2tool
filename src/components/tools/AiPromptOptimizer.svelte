<script lang="ts">
  import { Check, Copy, RefreshCw } from 'lucide-svelte';
  import { onDestroy } from 'svelte';
  import { optimizeAiPrompt, type AiPromptGoal } from '@/lib/ai-prompt-workflow-tools';

  interface Props {
    locale?: string;
    translations?: Record<string, unknown>;
  }

  let { locale = 'en', translations = {} }: Props = $props();

  const copyByLocale = {
    en: {
      title: 'AI Prompt Optimizer',
      description: 'Turn a rough prompt into a structured, reusable prompt with constraints and checks.',
      draft: 'Rough prompt',
      draftPlaceholder: 'Example: Write an SEO brief for a landing page about AI token costs',
      goal: 'Goal',
      audience: 'Audience',
      tone: 'Tone',
      format: 'Output format',
      constraints: 'Constraints',
      optimized: 'Optimized prompt',
      gaps: 'Draft gaps',
      checklist: 'Send checklist',
      words: 'Words',
      sections: 'Sections',
      copy: 'Copy prompt',
      copied: 'Copied',
      reset: 'Reset',
      localNote: 'Template-based and local. This tool does not call an AI model.',
      noGaps: 'No obvious gaps detected.',
      goalOptions: {
        writing: 'Writing',
        coding: 'Coding',
        seo: 'SEO',
        translation: 'Translation',
        image: 'Image prompt',
        data: 'Data analysis',
      },
    },
    zh: {
      title: 'AI 提示词优化器',
      description: '把粗糙提示词整理成带角色、约束、输出格式和检查清单的可复用 Prompt。',
      draft: '原始提示词',
      draftPlaceholder: '例如：为 AI token 费用页面写一份 SEO 内容简报',
      goal: '目标',
      audience: '受众',
      tone: '语气',
      format: '输出格式',
      constraints: '约束',
      optimized: '优化后的提示词',
      gaps: '草稿缺口',
      checklist: '发送前检查',
      words: '词数',
      sections: '段落',
      copy: '复制提示词',
      copied: '已复制',
      reset: '重置',
      localNote: '基于模板在本地生成，不会调用 AI 模型。',
      noGaps: '未发现明显缺口。',
      goalOptions: {
        writing: '写作',
        coding: '代码',
        seo: 'SEO',
        translation: '翻译',
        image: '图像提示词',
        data: '数据分析',
      },
    },
  } as const;

  const copy = $derived(locale === 'zh' ? copyByLocale.zh : copyByLocale.en);

  let draft = $state('Write an SEO brief for a landing page about AI token costs');
  let goal = $state<AiPromptGoal>('seo');
  let audience = $state('developers comparing LLM API pricing');
  let tone = $state('clear, practical, and direct');
  let format = $state('Markdown brief with headings, bullet points, and a final checklist');
  let constraints = $state('avoid ranking guarantees, mention assumptions, include concrete examples');
  let copied = $state(false);
  let copyTimer: ReturnType<typeof setTimeout> | null = null;

  const title = $derived(getToolMessage('name', copy.title));
  const description = $derived(getToolMessage('description', copy.description));
  const result = $derived(optimizeAiPrompt({ audience, constraints, draft, format, goal, tone }));

  onDestroy(() => {
    if (copyTimer) clearTimeout(copyTimer);
  });

  function getToolMessage(key: string, fallback: string): string {
    const toolsScope = translations.tools as Record<string, unknown> | undefined;
    const toolScope = toolsScope?.['ai-prompt-optimizer'] as Record<string, unknown> | undefined;
    const value = toolScope?.[key];
    return typeof value === 'string' ? value : fallback;
  }

  async function copyPrompt() {
    await navigator.clipboard.writeText(result.optimizedPrompt);
    copied = true;
    if (copyTimer) clearTimeout(copyTimer);
    copyTimer = setTimeout(() => {
      copied = false;
    }, 1800);
  }

  function resetForm() {
    draft = 'Write an SEO brief for a landing page about AI token costs';
    goal = 'seo';
    audience = 'developers comparing LLM API pricing';
    tone = 'clear, practical, and direct';
    format = 'Markdown brief with headings, bullet points, and a final checklist';
    constraints = 'avoid ranking guarantees, mention assumptions, include concrete examples';
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
        <label for="ai-prompt-optimizer-draft" class="tool-label">{copy.draft}</label>
        <textarea
          id="ai-prompt-optimizer-draft"
          class="tool-textarea h-40 resize-y"
          placeholder={copy.draftPlaceholder}
          bind:value={draft}
        ></textarea>
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label for="ai-prompt-optimizer-goal" class="tool-label">{copy.goal}</label>
          <select id="ai-prompt-optimizer-goal" class="tool-select" bind:value={goal}>
            {#each Object.entries(copy.goalOptions) as [value, label]}
              <option value={value}>{label}</option>
            {/each}
          </select>
        </div>
        <div>
          <label for="ai-prompt-optimizer-tone" class="tool-label">{copy.tone}</label>
          <input id="ai-prompt-optimizer-tone" class="tool-input" type="text" bind:value={tone} />
        </div>
      </div>

      <div>
        <label for="ai-prompt-optimizer-audience" class="tool-label">{copy.audience}</label>
        <input id="ai-prompt-optimizer-audience" class="tool-input" type="text" bind:value={audience} />
      </div>

      <div>
        <label for="ai-prompt-optimizer-format" class="tool-label">{copy.format}</label>
        <input id="ai-prompt-optimizer-format" class="tool-input" type="text" bind:value={format} />
      </div>

      <div>
        <label for="ai-prompt-optimizer-constraints" class="tool-label">{copy.constraints}</label>
        <textarea id="ai-prompt-optimizer-constraints" class="tool-textarea h-28 resize-y" bind:value={constraints}></textarea>
      </div>
    </section>

    <section class="space-y-4">
      <div class="grid grid-cols-2 gap-3">
        <div class="rounded-xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
          <div class="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{copy.words}</div>
          <div class="mt-1 text-2xl font-black text-slate-900 dark:text-white">{result.wordCount}</div>
        </div>
        <div class="rounded-xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
          <div class="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{copy.sections}</div>
          <div class="mt-1 text-2xl font-black text-slate-900 dark:text-white">{result.sectionCount}</div>
        </div>
      </div>

      <div>
        <div class="tool-label">{copy.optimized}</div>
        <pre class="min-h-80 overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 whitespace-pre-wrap break-words text-slate-900 dark:border-white/10 dark:bg-slate-950 dark:text-slate-100">{result.optimizedPrompt}</pre>
      </div>

      <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div class="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
          <h3 class="text-sm font-black text-slate-900 dark:text-white">{copy.gaps}</h3>
          <ul class="mt-3 space-y-2 text-xs font-medium leading-5 text-slate-600 dark:text-slate-300">
            {#if result.gaps.length === 0}
              <li>{copy.noGaps}</li>
            {:else}
              {#each result.gaps as gap}
                <li>{gap}</li>
              {/each}
            {/if}
          </ul>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
          <h3 class="text-sm font-black text-slate-900 dark:text-white">{copy.checklist}</h3>
          <ul class="mt-3 space-y-2 text-xs font-medium leading-5 text-slate-600 dark:text-slate-300">
            {#each result.checklist as item}
              <li>{item}</li>
            {/each}
          </ul>
        </div>
      </div>
    </section>
  </div>

  <div class="flex flex-wrap gap-3">
    <button type="button" class="btn-primary inline-flex items-center gap-2" onclick={copyPrompt}>
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

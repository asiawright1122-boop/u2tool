<script lang="ts">
  import { AlertTriangle, Check, Copy, RefreshCw } from 'lucide-svelte';
  import { onDestroy } from 'svelte';
  import { calculateRagChunkPlan } from '@/lib/ai-prompt-workflow-tools';

  interface Props {
    locale?: string;
    translations?: Record<string, unknown>;
  }

  let { locale = 'en', translations = {} }: Props = $props();

  const copyByLocale = {
    en: {
      title: 'RAG Chunk Size Calculator',
      description: 'Estimate chunk count, overlap duplication, and retrieval context usage before building a RAG workflow.',
      documentTokens: 'Document tokens',
      chunkSize: 'Chunk size',
      overlap: 'Overlap tokens',
      topK: 'Top K',
      contextWindow: 'Context window',
      reserve: 'Prompt and answer reserve',
      chunks: 'Chunks',
      embedded: 'Embedded tokens',
      retrieved: 'Retrieved context',
      usage: 'Context usage',
      step: 'Effective step',
      overlapRate: 'Overlap rate',
      recommendation: 'Recommendation',
      warnings: 'Planning warnings',
      noWarnings: 'No major planning warnings for these settings.',
      copy: 'Copy plan',
      copied: 'Copied',
      reset: 'Reset',
      localNote: 'Estimates are local planning numbers. Actual RAG quality depends on document structure, embedding model, reranking, and prompts.',
    },
    zh: {
      title: 'RAG 分块大小计算器',
      description: '在搭建 RAG 工作流前估算分块数量、overlap 重复量和检索上下文占用。',
      documentTokens: '文档 token',
      chunkSize: '分块大小',
      overlap: '重叠 token',
      topK: 'Top K',
      contextWindow: '上下文窗口',
      reserve: '提示词与回答预留',
      chunks: '分块数',
      embedded: '嵌入 token',
      retrieved: '检索上下文',
      usage: '上下文占用',
      step: '有效步长',
      overlapRate: '重叠比例',
      recommendation: '建议',
      warnings: '规划风险',
      noWarnings: '当前设置没有明显规划风险。',
      copy: '复制方案',
      copied: '已复制',
      reset: '重置',
      localNote: '这里是本地规划估算。实际 RAG 效果还取决于文档结构、embedding 模型、rerank 和提示词。',
    },
  } as const;

  const copy = $derived(locale === 'zh' ? copyByLocale.zh : copyByLocale.en);

  let documentTokens = $state(12000);
  let chunkSize = $state(800);
  let overlapTokens = $state(160);
  let topK = $state(5);
  let contextWindow = $state(16000);
  let promptReserveTokens = $state(3000);
  let copied = $state(false);
  let copyTimer: ReturnType<typeof setTimeout> | null = null;

  const title = $derived(getToolMessage('name', copy.title));
  const description = $derived(getToolMessage('description', copy.description));
  const result = $derived(calculateRagChunkPlan({
    chunkSize,
    contextWindow,
    documentTokens,
    overlapTokens,
    promptReserveTokens,
    topK,
  }));

  onDestroy(() => {
    if (copyTimer) clearTimeout(copyTimer);
  });

  function getToolMessage(key: string, fallback: string): string {
    const toolsScope = translations.tools as Record<string, unknown> | undefined;
    const toolScope = toolsScope?.['rag-chunk-size-calculator'] as Record<string, unknown> | undefined;
    const value = toolScope?.[key];
    return typeof value === 'string' ? value : fallback;
  }

  function formatNumber(value: number): string {
    return Math.round(value).toLocaleString(locale);
  }

  function planSummary(): string {
    return [
      `${title}`,
      `${copy.documentTokens}: ${formatNumber(documentTokens)}`,
      `${copy.chunkSize}: ${formatNumber(chunkSize)}`,
      `${copy.overlap}: ${formatNumber(overlapTokens)} (${result.overlapPercent}%)`,
      `${copy.topK}: ${formatNumber(topK)}`,
      `${copy.chunks}: ${formatNumber(result.chunkCount)}`,
      `${copy.embedded}: ${formatNumber(result.embeddedTokenEstimate)}`,
      `${copy.retrieved}: ${formatNumber(result.retrievedContextTokens)}`,
      `${copy.usage}: ${result.contextUsagePercent}%`,
      `${copy.recommendation}: ${result.recommendation}`,
      `${copy.warnings}: ${result.warnings.length ? result.warnings.join(' | ') : copy.noWarnings}`,
    ].join('\n');
  }

  async function copyPlan() {
    await navigator.clipboard.writeText(planSummary());
    copied = true;
    if (copyTimer) clearTimeout(copyTimer);
    copyTimer = setTimeout(() => {
      copied = false;
    }, 1800);
  }

  function resetForm() {
    documentTokens = 12000;
    chunkSize = 800;
    overlapTokens = 160;
    topK = 5;
    contextWindow = 16000;
    promptReserveTokens = 3000;
  }
</script>

<div class="space-y-6">
  <div>
    <h2 class="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
    <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">{description}</p>
  </div>

  <div class="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
    <section class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <label for="rag-document-tokens" class="tool-label">{copy.documentTokens}</label>
        <input id="rag-document-tokens" class="tool-input" type="number" min="1" step="100" bind:value={documentTokens} />
      </div>
      <div>
        <label for="rag-chunk-size" class="tool-label">{copy.chunkSize}</label>
        <input id="rag-chunk-size" class="tool-input" type="number" min="64" step="50" bind:value={chunkSize} />
      </div>
      <div>
        <label for="rag-overlap-tokens" class="tool-label">{copy.overlap}</label>
        <input id="rag-overlap-tokens" class="tool-input" type="number" min="0" step="10" bind:value={overlapTokens} />
      </div>
      <div>
        <label for="rag-top-k" class="tool-label">{copy.topK}</label>
        <input id="rag-top-k" class="tool-input" type="number" min="1" step="1" bind:value={topK} />
      </div>
      <div>
        <label for="rag-context-window" class="tool-label">{copy.contextWindow}</label>
        <input id="rag-context-window" class="tool-input" type="number" min="1000" step="1000" bind:value={contextWindow} />
      </div>
      <div>
        <label for="rag-reserve" class="tool-label">{copy.reserve}</label>
        <input id="rag-reserve" class="tool-input" type="number" min="0" step="250" bind:value={promptReserveTokens} />
      </div>
    </section>

    <section class="space-y-4">
      <div class="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <div class="rounded-xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
          <div class="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{copy.chunks}</div>
          <div class="mt-1 text-2xl font-black text-slate-900 dark:text-white">{formatNumber(result.chunkCount)}</div>
        </div>
        <div class="rounded-xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
          <div class="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{copy.embedded}</div>
          <div class="mt-1 text-2xl font-black text-slate-900 dark:text-white">{formatNumber(result.embeddedTokenEstimate)}</div>
        </div>
        <div class="rounded-xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
          <div class="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{copy.usage}</div>
          <div class="mt-1 text-2xl font-black text-slate-900 dark:text-white">{result.contextUsagePercent}%</div>
        </div>
        <div class="rounded-xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
          <div class="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{copy.retrieved}</div>
          <div class="mt-1 text-xl font-black text-slate-900 dark:text-white">{formatNumber(result.retrievedContextTokens)}</div>
        </div>
        <div class="rounded-xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
          <div class="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{copy.step}</div>
          <div class="mt-1 text-xl font-black text-slate-900 dark:text-white">{formatNumber(result.effectiveStepTokens)}</div>
        </div>
        <div class="rounded-xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
          <div class="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{copy.overlapRate}</div>
          <div class="mt-1 text-xl font-black text-slate-900 dark:text-white">{result.overlapPercent}%</div>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950">
        <h3 class="text-sm font-black text-slate-900 dark:text-white">{copy.recommendation}</h3>
        <p class="mt-2 text-sm font-medium leading-6 text-slate-700 dark:text-slate-300">{result.recommendation}</p>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
        <h3 class="flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white">
          <AlertTriangle class="h-4 w-4 text-amber-500" aria-hidden="true" />
          {copy.warnings}
        </h3>
        <ul class="mt-3 space-y-2 text-xs font-medium leading-5 text-slate-600 dark:text-slate-300">
          {#if result.warnings.length === 0}
            <li>{copy.noWarnings}</li>
          {:else}
            {#each result.warnings as warning}
              <li>{warning}</li>
            {/each}
          {/if}
        </ul>
      </div>
    </section>
  </div>

  <div class="flex flex-wrap gap-3">
    <button type="button" class="btn-primary inline-flex items-center gap-2" onclick={copyPlan}>
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

<script lang="ts">
  import { Check, Copy, RefreshCw } from 'lucide-svelte';
  import { onDestroy } from 'svelte';
  import {
    AI_MODEL_PRICING,
    calculateAiTokenCost,
    getAiModelPricingGroups,
    type AiTokenCostResult,
  } from '../../lib/ai-token-calculator';

  interface Props {
    locale?: string;
    translations?: Record<string, unknown>;
  }

  let { locale = 'en', translations = {} }: Props = $props();

  const COPY = {
    title: 'AI Token Calculator',
    subtitle: 'Estimate prompt tokens, output tokens, request cost, and batch spend for common AI API models.',
    promptSample: 'Summarize this product changelog for developers and include migration risks.',
    model: 'Model',
    prompt: 'Prompt text',
    outputTokens: 'Estimated output tokens',
    requestCount: 'Request count',
    inputTokens: 'Input tokens',
    totalTokens: 'Total tokens',
    perRequest: 'Per request',
    batchCost: 'Batch cost',
    source: 'Pricing source',
    pricingDate: 'Pricing checked',
    copy: 'Copy summary',
    copied: 'Copied',
    reset: 'Reset',
    localNote: 'Estimates run locally. Token counts use a simple character-based approximation.',
  };

  const initialPromptText = uiMessage('promptSample', COPY.promptSample);
  const modelGroups = getAiModelPricingGroups();
  let modelId = $state(AI_MODEL_PRICING[0].id);
  let promptText = $state(initialPromptText);
  let outputTokens = $state('600');
  let requestCount = $state('1000');
  let copied = $state(false);
  let copyTimer: ReturnType<typeof setTimeout> | null = null;

  const result: AiTokenCostResult = $derived(calculateAiTokenCost({
    modelId,
    promptText,
    outputTokens: Number(outputTokens),
    requestCount: Number(requestCount),
  }));

  function toolMessage(key: string, fallback: string) {
    const toolsScope = translations.tools as Record<string, unknown> | undefined;
    const toolScope = toolsScope?.['ai-token-calculator'] as Record<string, unknown> | undefined;
    const value = toolScope?.[key];
    return typeof value === 'string' ? value : fallback;
  }

  function uiMessage(key: keyof typeof COPY, fallback: string) {
    const toolsScope = translations.tools as Record<string, unknown> | undefined;
    const toolScope = toolsScope?.['ai-token-calculator'] as Record<string, unknown> | undefined;
    const uiScope = toolScope?.ui as Record<string, unknown> | undefined;
    const value = uiScope?.[key];
    return typeof value === 'string' ? value : fallback;
  }

  const ui = $derived({
    model: uiMessage('model', COPY.model),
    prompt: uiMessage('prompt', COPY.prompt),
    outputTokens: uiMessage('outputTokens', COPY.outputTokens),
    requestCount: uiMessage('requestCount', COPY.requestCount),
    inputTokens: uiMessage('inputTokens', COPY.inputTokens),
    totalTokens: uiMessage('totalTokens', COPY.totalTokens),
    perRequest: uiMessage('perRequest', COPY.perRequest),
    batchCost: uiMessage('batchCost', COPY.batchCost),
    source: uiMessage('source', COPY.source),
    pricingDate: uiMessage('pricingDate', COPY.pricingDate),
    copy: uiMessage('copy', COPY.copy),
    copied: uiMessage('copied', COPY.copied),
    reset: uiMessage('reset', COPY.reset),
    localNote: uiMessage('localNote', COPY.localNote),
  });

  function number(value: number, maximumFractionDigits = 0) {
    return new Intl.NumberFormat(locale, { maximumFractionDigits }).format(value);
  }

  function currency(value: number) {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: result.model.currency,
      maximumFractionDigits: value < 0.01 ? 6 : 4,
    }).format(value);
  }

  function copyText() {
    return [
      `${ui.model}: ${result.model.provider} - ${result.model.model}`,
      `${ui.inputTokens}: ${result.inputTokens}`,
      `${ui.outputTokens}: ${result.outputTokens}`,
      `${ui.perRequest}: ${currency(result.perRequestCost)}`,
      `${ui.batchCost}: ${currency(result.batchCost)}`,
    ].join('; ');
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(copyText());
    copied = true;
    if (copyTimer) {
      clearTimeout(copyTimer);
    }
    copyTimer = setTimeout(() => {
      copied = false;
    }, 1600);
  }

  function resetForm() {
    modelId = AI_MODEL_PRICING[0].id;
    promptText = uiMessage('promptSample', COPY.promptSample);
    outputTokens = '600';
    requestCount = '1000';
  }

  onDestroy(() => {
    if (copyTimer) {
      clearTimeout(copyTimer);
    }
  });
</script>

<div class="space-y-6">
  <div>
    <h2 class="text-xl font-bold text-slate-900 dark:text-white">{toolMessage('name', COPY.title)}</h2>
    <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">{toolMessage('description', COPY.subtitle)}</p>
  </div>

  <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
    <div>
      <label for="ai-token-model" class="tool-label">{ui.model}</label>
      <select id="ai-token-model" class="tool-input" bind:value={modelId}>
        {#each modelGroups as group (group.provider)}
          <optgroup label={group.provider}>
            {#each group.models as model (model.id)}
              <option value={model.id}>{model.model}</option>
            {/each}
          </optgroup>
        {/each}
      </select>
    </div>

    <div>
      <label for="ai-token-output" class="tool-label">{ui.outputTokens}</label>
      <input id="ai-token-output" class="tool-input" type="number" min="0" bind:value={outputTokens} />
    </div>

    <div>
      <label for="ai-token-requests" class="tool-label">{ui.requestCount}</label>
      <input id="ai-token-requests" class="tool-input" type="number" min="1" bind:value={requestCount} />
    </div>

    <div>
      <div class="tool-label">{ui.pricingDate}</div>
      <div class="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
        {result.model.pricingDate}
      </div>
    </div>

    <div class="md:col-span-2">
      <label for="ai-token-prompt" class="tool-label">{ui.prompt}</label>
      <textarea id="ai-token-prompt" class="tool-input min-h-40 font-mono text-sm" bind:value={promptText}></textarea>
    </div>
  </div>

  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <div class="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
      <div class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{ui.inputTokens}</div>
      <div class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{number(result.inputTokens)}</div>
    </div>
    <div class="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
      <div class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{ui.totalTokens}</div>
      <div class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{number(result.totalTokens)}</div>
    </div>
    <div class="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
      <div class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{ui.perRequest}</div>
      <div class="mt-1 text-2xl font-bold text-emerald-700 dark:text-emerald-300">{currency(result.perRequestCost)}</div>
    </div>
    <div class="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
      <div class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{ui.batchCost}</div>
      <div class="mt-1 text-2xl font-bold text-amber-700 dark:text-amber-300">{currency(result.batchCost)}</div>
    </div>
  </div>

  <div class="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
    <div><span class="font-semibold text-slate-800 dark:text-slate-100">{ui.source}:</span> <a class="text-amber-700 hover:underline dark:text-amber-300" href={result.model.sourceUrl} target="_blank" rel="noreferrer">{result.model.sourceUrl}</a></div>
    {#if result.model.note}
      <div class="mt-2">{result.model.note}</div>
    {/if}
    <div class="mt-2 text-xs text-slate-500 dark:text-slate-400">{ui.localNote}</div>
  </div>

  <div class="flex flex-wrap gap-3">
    <button type="button" class="btn-primary inline-flex items-center gap-2" onclick={handleCopy}>
      {#if copied}
        <Check class="h-4 w-4" aria-hidden="true" />
        {ui.copied}
      {:else}
        <Copy class="h-4 w-4" aria-hidden="true" />
        {ui.copy}
      {/if}
    </button>
    <button type="button" class="btn-secondary inline-flex items-center gap-2" onclick={resetForm}>
      <RefreshCw class="h-4 w-4" aria-hidden="true" />
      {ui.reset}
    </button>
  </div>
</div>

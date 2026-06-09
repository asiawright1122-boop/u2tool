<script lang="ts">
  import { Check, Copy, RefreshCw } from 'lucide-svelte';
  import { onDestroy } from 'svelte';

  interface Props {
    locale?: string;
    translations?: Record<string, unknown>;
  }

  let { translations = {} }: Props = $props();

  const COPY = {
    title: 'AI Prompt Generator',
    subtitle: 'Build structured prompts for writing, coding, analysis, and marketing tasks.',
    task: 'Task type',
    topic: 'Topic',
    audience: 'Audience',
    tone: 'Tone',
    format: 'Output format',
    constraints: 'Constraints',
    output: 'Generated prompt',
    copy: 'Copy prompt',
    copied: 'Copied',
    reset: 'Reset',
    words: 'Words',
    sections: 'Sections',
    localNote: 'Template-based and local. This tool does not call an AI model.',
  };

  const taskLabels: Record<string, string> = {
    writing: 'writing',
    coding: 'coding',
    analysis: 'analysis',
    marketing: 'marketing',
  };

  const toneLabels: Record<string, string> = {
    professional: 'professional',
    concise: 'concise',
    friendly: 'friendly',
    persuasive: 'persuasive',
  };

  let task = $state('writing');
  let topic = $state('launch plan for a browser-based productivity tool');
  let audience = $state('busy SaaS founders');
  let tone = $state('professional');
  let format = $state('bullet list with a short summary');
  let constraints = $state('keep it practical, include examples, avoid unsupported claims');
  let copied = $state(false);
  let copyTimer: ReturnType<typeof setTimeout> | null = null;

  const title = $derived(getToolMessage('name', COPY.title));
  const description = $derived(getToolMessage('description', COPY.subtitle));
  const prompt = $derived(buildPrompt());
  const wordCount = $derived(prompt.trim().split(/\s+/).filter(Boolean).length);
  const sectionCount = $derived((prompt.match(/^[A-Z][^:\n]+:/gm) || []).length);

  onDestroy(() => {
    if (copyTimer) {
      clearTimeout(copyTimer);
    }
  });

  function getToolMessage(key: string, fallback: string) {
    const toolsScope = translations.tools as Record<string, unknown> | undefined;
    const toolScope = toolsScope?.['ai-prompt-generator'] as Record<string, unknown> | undefined;
    const value = toolScope?.[key];
    return typeof value === 'string' ? value : fallback;
  }

  function valueOrFallback(value: string, fallback: string) {
    return value.trim() || fallback;
  }

  function buildPrompt() {
    const taskLabel = taskLabels[task] || taskLabels.writing;
    const toneLabel = toneLabels[tone] || toneLabels.professional;
    const safeTopic = valueOrFallback(topic, 'the selected topic');
    const safeAudience = valueOrFallback(audience, 'the target audience');
    const safeFormat = valueOrFallback(format, 'a clear structured answer');
    const safeConstraints = valueOrFallback(constraints, 'be specific and avoid unsupported claims');

    return [
      `Role: You are a ${toneLabel} assistant helping with a ${taskLabel} task.`,
      `Objective: Create a useful response about ${safeTopic}.`,
      `Audience: Write for ${safeAudience}.`,
      `Output format: ${safeFormat}.`,
      `Constraints: ${safeConstraints}.`,
      'Instructions:',
      '- Start with the answer the audience can use immediately.',
      '- Use concrete examples, steps, or criteria where helpful.',
      '- Separate facts from recommendations when certainty matters.',
      '- End with a brief next-step checklist.',
    ].join('\n');
  }

  async function copyPrompt() {
    await navigator.clipboard.writeText(prompt);
    copied = true;
    if (copyTimer) {
      clearTimeout(copyTimer);
    }
    copyTimer = setTimeout(() => {
      copied = false;
    }, 1800);
  }

  function resetForm() {
    task = 'writing';
    topic = 'launch plan for a browser-based productivity tool';
    audience = 'busy SaaS founders';
    tone = 'professional';
    format = 'bullet list with a short summary';
    constraints = 'keep it practical, include examples, avoid unsupported claims';
  }
</script>

<div class="space-y-6">
  <div>
    <h2 class="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
    <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">{description}</p>
  </div>

  <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
    <div>
      <label for="ai-prompt-task" class="tool-label">{COPY.task}</label>
      <select id="ai-prompt-task" class="tool-input" bind:value={task}>
        <option value="writing">Writing</option>
        <option value="coding">Coding</option>
        <option value="analysis">Analysis</option>
        <option value="marketing">Marketing</option>
      </select>
    </div>

    <div>
      <label for="ai-prompt-tone" class="tool-label">{COPY.tone}</label>
      <select id="ai-prompt-tone" class="tool-input" bind:value={tone}>
        <option value="professional">Professional</option>
        <option value="concise">Concise</option>
        <option value="friendly">Friendly</option>
        <option value="persuasive">Persuasive</option>
      </select>
    </div>

    <div>
      <label for="ai-prompt-topic" class="tool-label">{COPY.topic}</label>
      <input id="ai-prompt-topic" class="tool-input" type="text" bind:value={topic} />
    </div>

    <div>
      <label for="ai-prompt-audience" class="tool-label">{COPY.audience}</label>
      <input id="ai-prompt-audience" class="tool-input" type="text" bind:value={audience} />
    </div>

    <div class="md:col-span-2">
      <label for="ai-prompt-format" class="tool-label">{COPY.format}</label>
      <input id="ai-prompt-format" class="tool-input" type="text" bind:value={format} />
    </div>

    <div class="md:col-span-2">
      <label for="ai-prompt-constraints" class="tool-label">{COPY.constraints}</label>
      <textarea id="ai-prompt-constraints" class="tool-input min-h-24" bind:value={constraints}></textarea>
    </div>
  </div>

  <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
    <div class="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
      <div class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{COPY.words}</div>
      <div class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{wordCount}</div>
    </div>
    <div class="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
      <div class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{COPY.sections}</div>
      <div class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{sectionCount}</div>
    </div>
  </div>

  <div>
    <div class="tool-label">{COPY.output}</div>
    <pre class="min-h-64 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 whitespace-pre-wrap break-words dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">{prompt}</pre>
  </div>

  <div class="flex flex-wrap gap-3">
    <button type="button" class="btn-primary inline-flex items-center gap-2" onclick={copyPrompt}>
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

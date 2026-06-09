<script lang="ts">
  import { Check, Copy, RefreshCw } from 'lucide-svelte';
  import { onDestroy } from 'svelte';

  interface Props {
    translations?: Record<string, unknown>;
  }

  let { translations = {} }: Props = $props();

  const COPY = {
    title: 'Email Preview Text Generator',
    subtitle: 'Create inbox preview and preheader text that supports your subject line.',
    subject: 'Subject line',
    topic: 'Campaign topic',
    audience: 'Audience',
    benefit: 'Reader benefit',
    tone: 'Tone',
    output: 'Preview text options',
    copy: 'Copy',
    copyAll: 'Copy all',
    copied: 'Copied',
    reset: 'Reset',
    chars: 'chars',
    target: 'Target: 35-90 chars',
    localNote: 'Generated locally. Add the final preview text in your own email platform.',
  };

  const toneLabels: Record<string, string> = {
    professional: 'Professional',
    friendly: 'Friendly',
    persuasive: 'Persuasive',
    playful: 'Playful',
  };

  let subject = $state('Your onboarding checklist is ready');
  let topic = $state('customer onboarding');
  let audience = $state('customer success teams');
  let benefit = $state('launch smoother handoffs with fewer missed steps');
  let tone = $state('persuasive');
  let copiedKey = $state('');
  let copyTimer: ReturnType<typeof setTimeout> | null = null;

  const title = $derived(getToolMessage('name', COPY.title));
  const description = $derived(getToolMessage('description', COPY.subtitle));
  const previews = $derived(generatePreviews(subject, topic, audience, benefit, tone));
  const output = $derived(previews.map((item, index) => `${index + 1}. ${item.text}`).join('\n'));

  onDestroy(() => {
    if (copyTimer) {
      clearTimeout(copyTimer);
    }
  });

  function getToolMessage(key: string, fallback: string) {
    const toolsScope = translations.tools as Record<string, unknown> | undefined;
    const toolScope = toolsScope?.['email-preview-text-generator'] as Record<string, unknown> | undefined;
    const value = toolScope?.[key];
    return typeof value === 'string' ? value : fallback;
  }

  function clean(value: string, fallback: string) {
    return value.trim().replace(/\s+/g, ' ') || fallback;
  }

  function fitPreview(value: string) {
    if (value.length <= 95) {
      return value;
    }
    return `${value.slice(0, 92).trimEnd()}...`;
  }

  function generatePreviews(emailSubject: string, campaignTopic: string, targetAudience: string, readerBenefit: string, selectedTone: string) {
    const safeSubject = clean(emailSubject, 'your subject line');
    const safeTopic = clean(campaignTopic, 'this campaign');
    const safeAudience = clean(targetAudience, 'your readers');
    const safeBenefit = clean(readerBenefit, 'get a clearer next step');
    const opener = selectedTone === 'friendly'
      ? 'Here is a simple way'
      : selectedTone === 'playful'
        ? 'Small nudge, useful payoff'
        : selectedTone === 'professional'
          ? 'Use this practical guide'
          : 'Open this to';

    return [
      { angle: 'Benefit support', text: fitPreview(`${opener} to ${safeBenefit}.`) },
      { angle: 'Subject companion', text: fitPreview(`${safeSubject}: the quick context and next step are inside.`) },
      { angle: 'Audience fit', text: fitPreview(`Built for ${safeAudience} working on ${safeTopic}.`) },
      { angle: 'Checklist', text: fitPreview(`Get the steps, examples, and checks you need for ${safeTopic}.`) },
      { angle: 'Curiosity', text: fitPreview(`A few details can make ${safeTopic} much easier to act on.`) },
      { angle: 'Direct', text: fitPreview(`Use this to ${safeBenefit} without adding another long process.`) },
      { angle: 'Friendly reminder', text: fitPreview(`Before you start ${safeTopic}, review these quick ideas.`) },
      { angle: 'Short', text: fitPreview(`${safeBenefit}. See the details inside.`) },
    ];
  }

  async function copyText(text: string, key: string) {
    await navigator.clipboard.writeText(text);
    copiedKey = key;
    if (copyTimer) {
      clearTimeout(copyTimer);
    }
    copyTimer = setTimeout(() => {
      copiedKey = '';
    }, 1800);
  }

  function resetForm() {
    subject = 'Your onboarding checklist is ready';
    topic = 'customer onboarding';
    audience = 'customer success teams';
    benefit = 'launch smoother handoffs with fewer missed steps';
    tone = 'persuasive';
  }
</script>

<div class="space-y-6">
  <div>
    <h2 class="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
    <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">{description}</p>
  </div>

  <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
    <div>
      <label for="email-preview-subject" class="tool-label">{COPY.subject}</label>
      <input id="email-preview-subject" class="tool-input" type="text" bind:value={subject} />
    </div>
    <div>
      <label for="email-preview-topic" class="tool-label">{COPY.topic}</label>
      <input id="email-preview-topic" class="tool-input" type="text" bind:value={topic} />
    </div>
    <div>
      <label for="email-preview-audience" class="tool-label">{COPY.audience}</label>
      <input id="email-preview-audience" class="tool-input" type="text" bind:value={audience} />
    </div>
    <div>
      <label for="email-preview-benefit" class="tool-label">{COPY.benefit}</label>
      <input id="email-preview-benefit" class="tool-input" type="text" bind:value={benefit} />
    </div>
    <div>
      <label for="email-preview-tone" class="tool-label">{COPY.tone}</label>
      <select id="email-preview-tone" class="tool-input" bind:value={tone}>
        {#each Object.entries(toneLabels) as [value, label]}
          <option value={value}>{label}</option>
        {/each}
      </select>
    </div>
  </div>

  <div>
    <div class="tool-label">{COPY.output}</div>
    <div class="space-y-3">
      {#each previews as item, index}
        <article class="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div class="min-w-0 flex-1">
              <div class="text-xs font-semibold uppercase text-amber-600 dark:text-amber-300">{item.angle}</div>
              <p class="mt-1 text-base font-semibold text-slate-900 dark:text-white">{item.text}</p>
              <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.text.length} {COPY.chars} · {COPY.target}</p>
            </div>
            <button type="button" class="btn-secondary inline-flex items-center gap-2 !px-3 !py-2 !text-xs" onclick={() => copyText(item.text, `preview-${index}`)}>
              {#if copiedKey === `preview-${index}`}
                <Check class="h-4 w-4" aria-hidden="true" />
                {COPY.copied}
              {:else}
                <Copy class="h-4 w-4" aria-hidden="true" />
                {COPY.copy}
              {/if}
            </button>
          </div>
        </article>
      {/each}
    </div>
  </div>

  <div class="flex flex-wrap gap-3">
    <button type="button" class="btn-primary inline-flex items-center gap-2" onclick={() => copyText(output, 'all')}>
      {#if copiedKey === 'all'}
        <Check class="h-4 w-4" aria-hidden="true" />
        {COPY.copied}
      {:else}
        <Copy class="h-4 w-4" aria-hidden="true" />
        {COPY.copyAll}
      {/if}
    </button>
    <button type="button" class="btn-secondary inline-flex items-center gap-2" onclick={resetForm}>
      <RefreshCw class="h-4 w-4" aria-hidden="true" />
      {COPY.reset}
    </button>
  </div>

  <p class="text-xs font-medium text-slate-500 dark:text-slate-400">{COPY.localNote}</p>
</div>

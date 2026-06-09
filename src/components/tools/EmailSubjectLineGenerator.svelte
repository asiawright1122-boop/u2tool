<script lang="ts">
  import { Check, Copy, RefreshCw } from 'lucide-svelte';
  import { onDestroy } from 'svelte';

  interface Props {
    translations?: Record<string, unknown>;
  }

  let { translations = {} }: Props = $props();

  const COPY = {
    title: 'Email Subject Line Generator',
    subtitle: 'Generate subject line options from a campaign topic, audience, benefit, and tone.',
    topic: 'Campaign topic',
    audience: 'Audience',
    benefit: 'Reader benefit',
    tone: 'Tone',
    output: 'Subject line options',
    copy: 'Copy',
    copyAll: 'Copy all',
    copied: 'Copied',
    reset: 'Reset',
    chars: 'chars',
    localNote: 'Generated locally. Test the final line in your own email platform.',
  };

  const toneLabels: Record<string, string> = {
    professional: 'Professional',
    friendly: 'Friendly',
    persuasive: 'Persuasive',
    playful: 'Playful',
  };

  let topic = $state('new customer onboarding checklist');
  let audience = $state('B2B SaaS teams');
  let benefit = $state('reduce setup time and avoid missed steps');
  let tone = $state('persuasive');
  let copiedKey = $state('');
  let copyTimer: ReturnType<typeof setTimeout> | null = null;

  const title = $derived(getToolMessage('name', COPY.title));
  const description = $derived(getToolMessage('description', COPY.subtitle));
  const subjects = $derived(generateSubjects(topic, audience, benefit, tone));
  const output = $derived(subjects.map((item, index) => `${index + 1}. ${item.text}`).join('\n'));

  onDestroy(() => {
    if (copyTimer) {
      clearTimeout(copyTimer);
    }
  });

  function getToolMessage(key: string, fallback: string) {
    const toolsScope = translations.tools as Record<string, unknown> | undefined;
    const toolScope = toolsScope?.['email-subject-line-generator'] as Record<string, unknown> | undefined;
    const value = toolScope?.[key];
    return typeof value === 'string' ? value : fallback;
  }

  function clean(value: string, fallback: string) {
    return value.trim().replace(/\s+/g, ' ') || fallback;
  }

  function generateSubjects(campaignTopic: string, targetAudience: string, readerBenefit: string, selectedTone: string) {
    const safeTopic = clean(campaignTopic, 'your campaign');
    const safeAudience = clean(targetAudience, 'your audience');
    const safeBenefit = clean(readerBenefit, 'get a better result');
    const tonePrefix = selectedTone === 'friendly'
      ? 'A simpler way'
      : selectedTone === 'playful'
        ? 'Tiny upgrade'
        : selectedTone === 'professional'
          ? 'Practical guide'
          : 'Make this easier';

    return [
      { angle: 'Benefit-first', text: `${tonePrefix}: ${safeBenefit}` },
      { angle: 'Audience fit', text: `${safeAudience}: improve ${safeTopic}` },
      { angle: 'Checklist', text: `Your ${safeTopic} checklist is ready` },
      { angle: 'Curiosity', text: `The missing piece in ${safeTopic}` },
      { angle: 'Problem-solution', text: `Stop losing time on ${safeTopic}` },
      { angle: 'Direct offer', text: `Use this to ${safeBenefit}` },
      { angle: 'How-to', text: `How to handle ${safeTopic} without extra work` },
      { angle: 'Launch', text: `New: a better way to approach ${safeTopic}` },
      { angle: 'Reminder', text: `Before you start ${safeTopic}, read this` },
      { angle: 'Short', text: `${safeTopic}: next steps` },
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
    topic = 'new customer onboarding checklist';
    audience = 'B2B SaaS teams';
    benefit = 'reduce setup time and avoid missed steps';
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
      <label for="email-subject-topic" class="tool-label">{COPY.topic}</label>
      <input id="email-subject-topic" class="tool-input" type="text" bind:value={topic} />
    </div>
    <div>
      <label for="email-subject-audience" class="tool-label">{COPY.audience}</label>
      <input id="email-subject-audience" class="tool-input" type="text" bind:value={audience} />
    </div>
    <div>
      <label for="email-subject-benefit" class="tool-label">{COPY.benefit}</label>
      <input id="email-subject-benefit" class="tool-input" type="text" bind:value={benefit} />
    </div>
    <div>
      <label for="email-subject-tone" class="tool-label">{COPY.tone}</label>
      <select id="email-subject-tone" class="tool-input" bind:value={tone}>
        {#each Object.entries(toneLabels) as [value, label]}
          <option value={value}>{label}</option>
        {/each}
      </select>
    </div>
  </div>

  <div>
    <div class="tool-label">{COPY.output}</div>
    <div class="space-y-3">
      {#each subjects as item, index}
        <article class="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div class="min-w-0 flex-1">
              <div class="text-xs font-semibold uppercase text-amber-600 dark:text-amber-300">{item.angle}</div>
              <p class="mt-1 text-base font-semibold text-slate-900 dark:text-white">{item.text}</p>
              <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.text.length} {COPY.chars}</p>
            </div>
            <button type="button" class="btn-secondary inline-flex items-center gap-2 !px-3 !py-2 !text-xs" onclick={() => copyText(item.text, `subject-${index}`)}>
              {#if copiedKey === `subject-${index}`}
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

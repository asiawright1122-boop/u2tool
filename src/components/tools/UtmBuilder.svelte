<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();
  void locale;

  function t(key: string): string {
    const scope = (translations.tools as Record<string, unknown>)?.['utm-builder'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const part of keys) {
      value = (value as Record<string, unknown>)?.[part];
    }
    return typeof value === 'string' ? value : `MISSING: tools.utm-builder.${key}`;
  }

  const UTM_FIELDS = [
    { key: 'utm_source', stateKey: 'source', required: true },
    { key: 'utm_medium', stateKey: 'medium', required: true },
    { key: 'utm_campaign', stateKey: 'campaign', required: true },
    { key: 'utm_term', stateKey: 'term', required: false },
    { key: 'utm_content', stateKey: 'content', required: false },
  ] as const;

  let baseUrl = $state('https://example.com/pricing');
  let source = $state('google');
  let medium = $state('cpc');
  let campaign = $state('spring_launch');
  let term = $state('');
  let content = $state('');
  let copied = $state(false);
  let copyTimer: ReturnType<typeof setTimeout> | null = null;

  onDestroy(() => {
    if (copyTimer) {
      clearTimeout(copyTimer);
    }
  });

  function normalizeBaseUrl(value: string): string {
    const trimmed = value.trim();
    if (!trimmed) {
      return '';
    }
    return /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  }

  function getFieldValue(stateKey: string): string {
    switch (stateKey) {
      case 'source':
        return source;
      case 'medium':
        return medium;
      case 'campaign':
        return campaign;
      case 'term':
        return term;
      case 'content':
        return content;
      default:
        return '';
    }
  }

  function buildCampaignUrl(): string {
    const normalized = normalizeBaseUrl(baseUrl);
    if (!normalized) {
      return '';
    }

    try {
      const url = new URL(normalized);
      for (const field of UTM_FIELDS) {
        const value = getFieldValue(field.stateKey).trim();
        if (value) {
          url.searchParams.set(field.key, value);
        } else {
          url.searchParams.delete(field.key);
        }
      }
      return url.toString();
    } catch {
      return '';
    }
  }

  const generatedUrl = $derived(buildCampaignUrl());
  const requiredFilled = $derived([source, medium, campaign].filter((value) => value.trim()).length);
  const isReady = $derived(Boolean(generatedUrl && requiredFilled === 3));
  const activeParams = $derived(
    UTM_FIELDS
      .map((field) => ({ key: field.key, value: getFieldValue(field.stateKey).trim() }))
      .filter((field) => field.value)
  );

  function loadExample() {
    baseUrl = 'https://www.u2tool.com/en/tools/meta-tag-generator/';
    source = 'newsletter';
    medium = 'email';
    campaign = 'productivity_tools';
    term = 'developer utilities';
    content = 'cta_button';
  }

  function clearAll() {
    baseUrl = '';
    source = '';
    medium = '';
    campaign = '';
    term = '';
    content = '';
  }

  async function copyUrl() {
    if (!generatedUrl) {
      return;
    }
    await navigator.clipboard.writeText(generatedUrl);
    copied = true;
    if (copyTimer) {
      clearTimeout(copyTimer);
    }
    copyTimer = setTimeout(() => {
      copied = false;
    }, 2000);
  }
</script>

<div class="space-y-6">
  <div class="grid grid-cols-1 lg:grid-cols-[1.15fr,0.85fr] gap-6">
    <div class="space-y-4">
      <div>
        <div class="flex items-center justify-between gap-3 mb-2">
          <label for="utm-base-url" class="tool-label">{t('baseUrl')}</label>
          <button
            type="button"
            onclick={loadExample}
            class="text-xs text-amber-600 hover:text-amber-700 dark:text-amber-400"
          >
            {t('loadExample')}
          </button>
        </div>
        <input
          id="utm-base-url"
          type="url"
          bind:value={baseUrl}
          class="tool-input"
          placeholder="https://example.com/page"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="utm-source" class="tool-label">{t('source')}</label>
          <input id="utm-source" bind:value={source} class="tool-input" placeholder="google, newsletter, instagram" />
        </div>
        <div>
          <label for="utm-medium" class="tool-label">{t('medium')}</label>
          <input id="utm-medium" bind:value={medium} class="tool-input" placeholder="cpc, email, social" />
        </div>
        <div>
          <label for="utm-campaign" class="tool-label">{t('campaign')}</label>
          <input id="utm-campaign" bind:value={campaign} class="tool-input" placeholder="spring_launch" />
        </div>
        <div>
          <label for="utm-term" class="tool-label">{t('term')}</label>
          <input id="utm-term" bind:value={term} class="tool-input" placeholder="keyword or audience" />
        </div>
        <div class="md:col-span-2">
          <label for="utm-content" class="tool-label">{t('content')}</label>
          <input id="utm-content" bind:value={content} class="tool-input" placeholder="button_a, hero_link, banner_1" />
        </div>
      </div>

      <div class="flex flex-wrap gap-3">
        <button type="button" onclick={copyUrl} disabled={!isReady} class="btn-primary disabled:opacity-50">
          {copied ? t('copied') : t('copyUrl')}
        </button>
        <button type="button" onclick={clearAll} class="btn-secondary">
          {t('clear')}
        </button>
      </div>
    </div>

    <div class="space-y-4">
      <div class="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-700">
        <div class="flex items-center justify-between gap-3 mb-3">
          <h3 class="text-sm font-semibold text-slate-900 dark:text-white">{t('requiredFields')}</h3>
          <span class={`text-xs font-semibold ${requiredFilled === 3 ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
            {requiredFilled}/3
          </span>
        </div>
        <div class="space-y-2">
          {#each UTM_FIELDS.filter((field) => field.required) as field (field.key)}
            <div class="flex items-center justify-between gap-3 text-sm">
              <span class="font-mono text-slate-600 dark:text-slate-300">{field.key}</span>
              <span class={getFieldValue(field.stateKey).trim() ? 'text-green-600 dark:text-green-400' : 'text-slate-400 dark:text-slate-500'}>
                {getFieldValue(field.stateKey).trim() ? t('filled') : t('missing')}
              </span>
            </div>
          {/each}
        </div>
      </div>

      <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
        <div class="text-sm font-semibold text-gray-900 dark:text-white mb-2">{t('generatedUrl')}</div>
        {#if generatedUrl}
          <p class="font-mono text-sm text-gray-700 dark:text-gray-200 break-all">{generatedUrl}</p>
        {:else}
          <p class="text-sm text-red-600 dark:text-red-400">{t('invalidUrl')}</p>
        {/if}
      </div>
    </div>
  </div>

  {#if activeParams.length > 0}
    <div class="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
      <table class="w-full text-sm">
        <thead class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
          <tr>
            <th class="px-4 py-2 text-left">{t('parameter')}</th>
            <th class="px-4 py-2 text-left">{t('value')}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          {#each activeParams as param (param.key)}
            <tr class="bg-white dark:bg-gray-900">
              <td class="px-4 py-2 font-mono text-amber-600 dark:text-amber-400">{param.key}</td>
              <td class="px-4 py-2 font-mono text-gray-800 dark:text-gray-200 break-all">{param.value}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

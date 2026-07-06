<script lang="ts">
  import { Check, Copy, FileUp, RefreshCw } from 'lucide-svelte';
  import { onDestroy } from 'svelte';
  import { formatBytes, parseHarSummary, type HarSummaryResult } from '../../lib/har-viewer';

  interface Props {
    locale?: string;
    translations?: Record<string, unknown>;
  }

  let { translations = {} }: Props = $props();

  const SAMPLE_HAR = JSON.stringify({
    log: {
      version: '1.2',
      creator: { name: 'U2Tool sample', version: '1.0' },
      entries: [
        { request: { method: 'GET', url: 'https://example.com/' }, response: { status: 200, content: { size: 4200 } }, time: 120 },
        { request: { method: 'GET', url: 'https://example.com/app.js' }, response: { status: 200, content: { size: 28400 } }, time: 260 },
        { request: { method: 'POST', url: 'https://api.example.com/search' }, response: { status: 200, bodySize: 2100 }, time: 480 },
        { request: { method: 'GET', url: 'https://cdn.example.com/missing.css' }, response: { status: 404, content: { size: 500 } }, time: 90 },
      ],
    },
  }, null, 2);

  const COPY = {
    title: 'HAR File Viewer',
    subtitle: 'Inspect HAR requests, status codes, domains, transfer size, and slowest entries locally in your browser.',
    input: 'HAR JSON',
    upload: 'Open .har file',
    summary: 'Summary',
    requests: 'Requests',
    bytes: 'Transferred',
    time: 'Total time',
    domains: 'Domains',
    status: 'Status groups',
    slowest: 'Slowest requests',
    method: 'Method',
    url: 'URL',
    copy: 'Copy summary',
    copied: 'Copied',
    sample: 'Load sample',
    file: 'File',
    localNote: 'Files are read by your browser only. Nothing is uploaded.',
  };

  let input = $state(SAMPLE_HAR);
  let fileName = $state('');
  let copied = $state(false);
  let copyTimer: ReturnType<typeof setTimeout> | null = null;

  const result: HarSummaryResult = $derived(input.trim()
    ? parseHarSummary(input)
    : { valid: false, error: 'Paste HAR JSON or open a .har file.' });

  function toolMessage(key: string, fallback: string) {
    const toolsScope = translations.tools as Record<string, unknown> | undefined;
    const toolScope = toolsScope?.['har-file-viewer'] as Record<string, unknown> | undefined;
    const value = toolScope?.[key];
    return typeof value === 'string' ? value : fallback;
  }

  async function handleFileUpload(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    const file = element.files?.[0];
    if (!file) {
      return;
    }
    input = await file.text();
    fileName = file.name;
  }

  function summaryText() {
    if (!result.valid || !result.summary) {
      return result.error || '';
    }
    const summary = result.summary;
    return [
      `${COPY.requests}: ${summary.requestCount}`,
      `${COPY.bytes}: ${formatBytes(summary.totalBytes)}`,
      `${COPY.time}: ${Math.round(summary.totalTime)} ms`,
      `${COPY.domains}: ${summary.domains.map((domain) => `${domain.domain} (${domain.count})`).join(', ')}`,
    ].join('\n');
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(summaryText());
    copied = true;
    if (copyTimer) {
      clearTimeout(copyTimer);
    }
    copyTimer = setTimeout(() => {
      copied = false;
    }, 1600);
  }

  function loadSample() {
    input = SAMPLE_HAR;
    fileName = '';
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

  <div class="flex flex-wrap gap-3">
    <label class="btn-primary inline-flex cursor-pointer items-center gap-2">
      <FileUp class="h-4 w-4" aria-hidden="true" />
      {COPY.upload}
      <input type="file" accept=".har,application/json" class="hidden" onchange={handleFileUpload} />
    </label>
    <button type="button" class="btn-secondary inline-flex items-center gap-2" onclick={loadSample}>
      <RefreshCw class="h-4 w-4" aria-hidden="true" />
      {COPY.sample}
    </button>
    {#if fileName}
      <div class="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">{COPY.file}: {fileName}</div>
    {/if}
  </div>

  <div>
    <label for="har-input" class="tool-label">{COPY.input}</label>
    <textarea id="har-input" class="tool-input min-h-64 font-mono text-xs" bind:value={input}></textarea>
  </div>

  {#if !result.valid}
    <div class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
      {result.error}
    </div>
  {:else if result.summary}
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
        <div class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{COPY.requests}</div>
        <div class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{result.summary.requestCount}</div>
      </div>
      <div class="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
        <div class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{COPY.bytes}</div>
        <div class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{formatBytes(result.summary.totalBytes)}</div>
      </div>
      <div class="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
        <div class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{COPY.time}</div>
        <div class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{Math.round(result.summary.totalTime)} ms</div>
      </div>
      <div class="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
        <div class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{COPY.domains}</div>
        <div class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{result.summary.domains.length}</div>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div>
        <h3 class="mb-2 text-sm font-semibold text-slate-800 dark:text-slate-100">{COPY.status}</h3>
        <div class="divide-y divide-slate-200 rounded-lg border border-slate-200 dark:divide-slate-700 dark:border-slate-700">
          {#each Object.entries(result.summary.statusGroups) as [group, count] (group)}
            <div class="flex items-center justify-between px-4 py-2 text-sm">
              <span class="text-slate-600 dark:text-slate-300">{group}</span>
              <span class="font-semibold text-slate-900 dark:text-white">{count}</span>
            </div>
          {/each}
        </div>
      </div>
      <div>
        <h3 class="mb-2 text-sm font-semibold text-slate-800 dark:text-slate-100">{COPY.domains}</h3>
        <div class="divide-y divide-slate-200 rounded-lg border border-slate-200 dark:divide-slate-700 dark:border-slate-700">
          {#each result.summary.domains as domain (domain.domain)}
            <div class="flex items-center justify-between gap-3 px-4 py-2 text-sm">
              <span class="truncate text-slate-600 dark:text-slate-300">{domain.domain}</span>
              <span class="shrink-0 font-semibold text-slate-900 dark:text-white">{domain.count} / {formatBytes(domain.bytes)}</span>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <div>
      <h3 class="mb-2 text-sm font-semibold text-slate-800 dark:text-slate-100">{COPY.slowest}</h3>
      <div class="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
        <table class="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-700">
          <thead class="bg-slate-50 dark:bg-slate-950">
            <tr>
              <th class="px-4 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">{COPY.method}</th>
              <th class="px-4 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">{COPY.url}</th>
              <th class="px-4 py-2 text-right font-semibold text-slate-600 dark:text-slate-300">{COPY.time}</th>
              <th class="px-4 py-2 text-right font-semibold text-slate-600 dark:text-slate-300">{COPY.bytes}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
            {#each result.summary.slowest as request (request.url + request.time)}
              <tr>
                <td class="px-4 py-2 font-mono text-slate-700 dark:text-slate-200">{request.method}</td>
                <td class="max-w-md truncate px-4 py-2 text-slate-600 dark:text-slate-300">{request.url}</td>
                <td class="px-4 py-2 text-right text-slate-700 dark:text-slate-200">{Math.round(request.time)} ms</td>
                <td class="px-4 py-2 text-right text-slate-700 dark:text-slate-200">{formatBytes(request.bytes)}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>

    <div class="flex flex-wrap gap-3">
      <button type="button" class="btn-primary inline-flex items-center gap-2" onclick={handleCopy}>
        {#if copied}
          <Check class="h-4 w-4" aria-hidden="true" />
          {COPY.copied}
        {:else}
          <Copy class="h-4 w-4" aria-hidden="true" />
          {COPY.copy}
        {/if}
      </button>
    </div>
  {/if}

  <p class="text-xs font-medium text-slate-500 dark:text-slate-400">{COPY.localNote}</p>
</div>

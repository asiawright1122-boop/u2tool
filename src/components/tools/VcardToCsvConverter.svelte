<script lang="ts">
  import { Check, Copy, Download, RefreshCw } from 'lucide-svelte';
  import { onDestroy } from 'svelte';

  interface Props {
    translations?: Record<string, unknown>;
  }

  interface ConvertResult {
    output: string;
    count: number;
    rows: string[][];
    error: string;
  }

  let { translations = {} }: Props = $props();

  const COPY = {
    title: 'vCard to CSV Converter',
    subtitle: 'Convert pasted BEGIN:VCARD blocks into spreadsheet-ready CSV rows.',
    vcard: 'vCard or VCF text',
    delimiter: 'Delimiter',
    comma: 'Comma',
    semicolon: 'Semicolon',
    tab: 'Tab',
    output: 'CSV output',
    contacts: 'Contacts',
    csvRows: 'CSV rows',
    fields: 'CSV columns',
    copy: 'Copy CSV',
    copied: 'Copied',
    download: 'Download CSV',
    reset: 'Reset',
    invalid: 'Paste one or more complete BEGIN:VCARD blocks.',
    localNote: 'Runs locally in your browser. It keeps one common value per CSV column, so review complex VCF files before bulk import.',
  };

  const headers = ['first_name', 'last_name', 'full_name', 'email', 'phone', 'company', 'title', 'address'];
  const defaultVcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'FN:Avery Stone',
    'N:Stone;Avery;;;',
    'ORG:Northwind Studio',
    'TITLE:Product Lead',
    'TEL;TYPE=CELL:+1 555 0147',
    'EMAIL:avery@example.com',
    'ADR;TYPE=WORK:;;101 Market Street;;;;',
    'END:VCARD',
    '',
    'BEGIN:VCARD',
    'VERSION:3.0',
    'FN:Mina Patel',
    'N:Patel;Mina;;;',
    'ORG:Acme Labs',
    'TITLE:Operations Manager',
    'TEL;TYPE=CELL:+1 555 0192',
    'EMAIL:mina@example.com',
    'ADR;TYPE=WORK:;;22 Lake Road;;;;',
    'END:VCARD',
  ].join('\n');

  let vcard = $state(defaultVcard);
  let delimiter = $state('comma');
  let copied = $state(false);
  let copyTimer: ReturnType<typeof setTimeout> | null = null;

  const title = $derived(getToolMessage('name', COPY.title));
  const description = $derived(getToolMessage('description', COPY.subtitle));
  const result = $derived(convertVcardToCsv());
  const previewRows = $derived(result.rows.slice(0, 4));

  onDestroy(() => {
    if (copyTimer) {
      clearTimeout(copyTimer);
    }
  });

  function getToolMessage(key: string, fallback: string) {
    const toolsScope = translations.tools as Record<string, unknown> | undefined;
    const toolScope = toolsScope?.['vcard-to-csv-converter'] as Record<string, unknown> | undefined;
    const value = toolScope?.[key];
    return typeof value === 'string' ? value : fallback;
  }

  function delimiterValue(value: string) {
    if (value === 'semicolon') return ';';
    if (value === 'tab') return '\t';
    return ',';
  }

  function unfoldVcardLines(raw: string): string[] {
    const lines: string[] = [];
    for (const line of raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n')) {
      if (/^[ \t]/.test(line) && lines.length > 0) {
        lines[lines.length - 1] += line.slice(1);
      } else {
        lines.push(line);
      }
    }
    return lines;
  }

  function splitVcardBlocks(raw: string): string[][] {
    const blocks: string[][] = [];
    let current: string[] = [];

    for (const line of unfoldVcardLines(raw)) {
      const trimmed = line.trim();
      if (/^BEGIN:VCARD$/i.test(trimmed)) {
        current = [trimmed];
        continue;
      }

      if (current.length > 0) {
        current.push(trimmed);
      }

      if (/^END:VCARD$/i.test(trimmed) && current.length > 0) {
        blocks.push(current);
        current = [];
      }
    }

    return blocks;
  }

  function unescapeVcardText(value: string) {
    return value.replace(/\\n/g, '\n').replace(/\\([,;\\])/g, '$1');
  }

  function vcardValue(lines: string[], key: string) {
    const upperKey = key.toUpperCase();
    const line = lines.find((candidate) => {
      const colonIndex = candidate.indexOf(':');
      if (colonIndex < 0) {
        return false;
      }
      const property = candidate.slice(0, colonIndex).split(';')[0].toUpperCase();
      return property === upperKey;
    });
    const colonIndex = line?.indexOf(':') ?? -1;
    return colonIndex >= 0 ? unescapeVcardText((line || '').slice(colonIndex + 1)) : '';
  }

  function csvCell(value: string, selectedDelimiter: string) {
    if (value.includes('"') || value.includes('\n') || value.includes('\r') || value.includes(selectedDelimiter)) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  function convertVcardToCsv(): ConvertResult {
    const selectedDelimiter = delimiterValue(delimiter);
    const blocks = splitVcardBlocks(vcard || '');
    const rows = blocks.map((block) => {
      const nameParts = vcardValue(block, 'N').split(';');
      const fullName = vcardValue(block, 'FN') || [nameParts[1], nameParts[0]].filter(Boolean).join(' ');
      return [
        nameParts[1] || '',
        nameParts[0] || '',
        fullName,
        vcardValue(block, 'EMAIL'),
        vcardValue(block, 'TEL'),
        vcardValue(block, 'ORG'),
        vcardValue(block, 'TITLE'),
        vcardValue(block, 'ADR').split(';').filter(Boolean).join(' '),
      ];
    }).filter((row) => row.some(Boolean));

    if (rows.length === 0) {
      return { output: '', count: 0, rows: [], error: COPY.invalid };
    }

    const output = [headers, ...rows]
      .map((row) => row.map((cell) => csvCell(cell, selectedDelimiter)).join(selectedDelimiter))
      .join('\n');

    return { output, count: rows.length, rows, error: '' };
  }

  async function copyOutput() {
    if (!result.output) {
      return;
    }

    await navigator.clipboard.writeText(result.output);
    copied = true;
    if (copyTimer) {
      clearTimeout(copyTimer);
    }
    copyTimer = setTimeout(() => {
      copied = false;
    }, 1800);
  }

  function downloadCsv() {
    if (!result.output) {
      return;
    }

    const blob = new Blob([result.output], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'contacts.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  function resetForm() {
    vcard = defaultVcard;
    delimiter = 'comma';
  }
</script>

<div class="space-y-6">
  <div>
    <h2 class="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
    <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">{description}</p>
  </div>

  <div class="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
    <div>
      <label for="vcard-csv-input" class="tool-label">{COPY.vcard}</label>
      <textarea id="vcard-csv-input" class="tool-input min-h-72 font-mono text-sm" bind:value={vcard}></textarea>
    </div>

    <div class="space-y-4">
      <div>
        <label for="vcard-csv-delimiter" class="tool-label">{COPY.delimiter}</label>
        <select id="vcard-csv-delimiter" class="tool-input" bind:value={delimiter}>
          <option value="comma">{COPY.comma}</option>
          <option value="semicolon">{COPY.semicolon}</option>
          <option value="tab">{COPY.tab}</option>
        </select>
      </div>
      <div class="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
        <div class="font-semibold text-slate-900 dark:text-white">{COPY.fields}</div>
        <p class="mt-2">first_name,last_name,full_name,email,phone,company,title,address</p>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
    <div class="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
      <div class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{COPY.contacts}</div>
      <div class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{result.count}</div>
    </div>
    <div class="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
      <div class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{COPY.csvRows}</div>
      <div class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{result.output ? result.count + 1 : 0}</div>
    </div>
  </div>

  {#if previewRows.length > 0}
    <div>
      <div class="tool-label">Preview</div>
      <div class="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
        <table class="w-full min-w-[760px] text-left text-sm">
          <thead class="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-950 dark:text-slate-400">
            <tr>
              {#each headers as header}
                <th class="border-r border-slate-200 px-3 py-2 last:border-r-0 dark:border-slate-700">{header}</th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each previewRows as row}
              <tr class="border-t border-slate-200 dark:border-slate-700">
                {#each row as cell}
                  <td class="border-r border-slate-200 px-3 py-2 text-slate-700 last:border-r-0 dark:border-slate-700 dark:text-slate-200">{cell}</td>
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}

  <div>
    <div class="tool-label">{COPY.output}</div>
    {#if result.output}
      <pre class="min-h-48 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 whitespace-pre-wrap break-words dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">{result.output}</pre>
    {:else}
      <div class="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
        {result.error}
      </div>
    {/if}
  </div>

  <div class="flex flex-wrap gap-3">
    <button type="button" class="btn-primary inline-flex items-center gap-2" onclick={copyOutput} disabled={!result.output}>
      {#if copied}
        <Check class="h-4 w-4" aria-hidden="true" />
        {COPY.copied}
      {:else}
        <Copy class="h-4 w-4" aria-hidden="true" />
        {COPY.copy}
      {/if}
    </button>
    <button type="button" class="btn-secondary inline-flex items-center gap-2" onclick={downloadCsv} disabled={!result.output}>
      <Download class="h-4 w-4" aria-hidden="true" />
      {COPY.download}
    </button>
    <button type="button" class="btn-secondary inline-flex items-center gap-2" onclick={resetForm}>
      <RefreshCw class="h-4 w-4" aria-hidden="true" />
      {COPY.reset}
    </button>
  </div>

  <p class="text-xs font-medium text-slate-500 dark:text-slate-400">{COPY.localNote}</p>
</div>
